from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from bson import ObjectId
from typing import List

from .config import get_settings
from .database import connect_db, close_db, get_database, get_gridfs
from .services.pdf_service import extract_text_from_pdf, extract_company_name
from .services.news_service import search_news
from .services.ai_service import analyze_with_ai
from .models import AnalysisResult, ReportResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="GreenWash Detector API",
    description="AI-powered ESG audit tool for detecting corporate greenwashing",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "GreenWash Detector API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/analyze", response_model=ReportResponse)
async def analyze_report(file: UploadFile = File(...)):
    """
    Analyze a corporate sustainability report PDF for greenwashing.
    Stores the file in MongoDB GridFS and saves analysis results.
    """
    settings = get_settings()
    db = get_database()
    fs = get_gridfs()
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Read file
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")
    
    # Store file in GridFS
    try:
        file_id = await fs.upload_from_stream(
            file.filename,
            file_bytes,
            metadata={"content_type": "application/pdf", "uploaded_at": datetime.utcnow()}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store file: {e}")
    
    # Extract text from PDF
    try:
        pdf_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {e}")
    
    if not pdf_text.strip():
        raise HTTPException(status_code=400, detail="PDF appears to be empty or contains no extractable text")
    
    # Extract company name for news search
    company_name = extract_company_name(pdf_text)
    
    # Search for external news
    try:
        news_data = await search_news(company_name, settings.serper_api_key)
    except Exception as e:
        news_data = f"News search failed: {e}"
    
    # Analyze with AI
    if not settings.openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        analysis = await analyze_with_ai(pdf_text, news_data, settings.openai_api_key)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")
    
    # Store report document with analysis
    report_doc = {
        "filename": file.filename,
        "file_id": str(file_id),
        "uploaded_at": datetime.utcnow(),
        "analysis": analysis.model_dump()
    }
    
    result = await db.reports.insert_one(report_doc)
    
    return ReportResponse(
        id=str(result.inserted_id),
        filename=file.filename,
        uploaded_at=report_doc["uploaded_at"],
        analysis=analysis
    )

@app.get("/reports", response_model=List[ReportResponse])
async def get_reports():
    """Get all analyzed reports."""
    db = get_database()
    reports = []
    
    async for doc in db.reports.find().sort("uploaded_at", -1):
        reports.append(ReportResponse(
            id=str(doc["_id"]),
            filename=doc["filename"],
            uploaded_at=doc["uploaded_at"],
            analysis=AnalysisResult(**doc["analysis"])
        ))
    
    return reports

@app.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str):
    """Get a specific report by ID."""
    db = get_database()
    
    try:
        doc = await db.reports.find_one({"_id": ObjectId(report_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return ReportResponse(
        id=str(doc["_id"]),
        filename=doc["filename"],
        uploaded_at=doc["uploaded_at"],
        analysis=AnalysisResult(**doc["analysis"])
    )

@app.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a report and its associated file."""
    db = get_database()
    fs = get_gridfs()
    
    try:
        doc = await db.reports.find_one({"_id": ObjectId(report_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Delete file from GridFS
    try:
        await fs.delete(ObjectId(doc["file_id"]))
    except Exception:
        pass  # File might already be deleted
    
    # Delete report document
    await db.reports.delete_one({"_id": ObjectId(report_id)})
    
    return {"message": "Report deleted successfully"}
