from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

from .config import get_settings
from .database import connect_db, close_db, get_database, get_gridfs
from .services.pdf_service import extract_text_from_pdf, extract_company_name, extract_pdf_preview
from .services.news_service import search_news
from .services.ai_service import analyze_with_ai
from .services.auth_service import (
    create_user, get_user_by_email, get_user_by_gst, 
    authenticate_user, authenticate_admin, authenticate_admin_db,
    create_admin, get_admin_by_email, ADMIN_REGISTRATION_CODE
)
from .models import (
    AnalysisResult, ReportResponse, 
    UserRegister, UserLogin, UserResponse, AdminLogin,
    AdminRegister, AdminResponse, CreditAssignment, CreditResponse,
    CompanyWithCredits
)

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

# ============ AUTH ENDPOINTS ============

@app.post("/auth/register", response_model=UserResponse)
async def register_user(user: UserRegister):
    """Register a new industry user."""
    db = get_database()
    
    # Validate passwords match
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Validate password length
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Check if email already exists
    existing_email = await get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if GST already exists
    existing_gst = await get_user_by_gst(db, user.gst_number)
    if existing_gst:
        raise HTTPException(status_code=400, detail="GST number already registered")
    
    # Create user
    user_doc = await create_user(db, user.model_dump())
    
    return UserResponse(
        id=str(user_doc["_id"]),
        gst_number=user_doc["gst_number"],
        email=user_doc["email"],
        company_name=user_doc["company_name"],
        industry_type=user_doc["industry_type"],
        role=user_doc["role"],
        created_at=user_doc["created_at"]
    )

@app.post("/auth/login")
async def login_user(credentials: UserLogin):
    """Login for industry users."""
    db = get_database()
    
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "company_name": user["company_name"],
        "industry_type": user["industry_type"],
        "gst_number": user["gst_number"],
        "role": "client",
        "name": user["company_name"]
    }

@app.post("/auth/admin/login")
async def login_admin(credentials: AdminLogin):
    """Login for government admin users."""
    db = get_database()
    
    # First check database
    admin = await authenticate_admin_db(db, credentials.email, credentials.password)
    if admin:
        return {
            "id": str(admin["_id"]),
            "email": admin["email"],
            "name": admin["name"],
            "department": admin["department"],
            "role": "admin"
        }
    
    # Fallback to hardcoded credentials
    admin = authenticate_admin(credentials.email, credentials.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    return admin

@app.post("/auth/admin/register", response_model=AdminResponse)
async def register_admin(admin: AdminRegister):
    """Register a new government admin user."""
    db = get_database()
    
    # Verify admin registration code
    if admin.admin_code != ADMIN_REGISTRATION_CODE:
        raise HTTPException(status_code=403, detail="Invalid admin registration code")
    
    # Validate passwords match
    if admin.password != admin.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Validate password length
    if len(admin.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Check if email already exists
    existing_admin = await get_admin_by_email(db, admin.email)
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create admin
    admin_doc = await create_admin(db, admin.model_dump())
    
    return AdminResponse(
        id=str(admin_doc["_id"]),
        email=admin_doc["email"],
        name=admin_doc["name"],
        department=admin_doc["department"],
        role=admin_doc["role"],
        created_at=admin_doc["created_at"]
    )

# ============ REPORT ENDPOINTS ============

@app.post("/preview")
async def preview_pdf(file: UploadFile = File(...)):
    """
    Extract and preview data from uploaded PDF before full analysis.
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Read file
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")
    
    # Extract preview data
    try:
        preview_data = extract_pdf_preview(file_bytes)
        preview_data["filename"] = file.filename
        preview_data["file_size_mb"] = round(len(file_bytes) / (1024 * 1024), 2)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF data: {e}")
    
    return preview_data

@app.post("/analyze", response_model=ReportResponse)
async def analyze_report(file: UploadFile = File(...), user_id: Optional[str] = None):
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
        "user_id": user_id,
        "analysis": analysis.model_dump()
    }
    
    result = await db.reports.insert_one(report_doc)
    
    return ReportResponse(
        id=str(result.inserted_id),
        filename=file.filename,
        uploaded_at=report_doc["uploaded_at"],
        user_id=user_id,
        analysis=analysis
    )

@app.get("/reports", response_model=List[ReportResponse])
async def get_reports(user_id: Optional[str] = None):
    """Get all analyzed reports, optionally filtered by user."""
    db = get_database()
    reports = []
    
    query = {"user_id": user_id} if user_id else {}
    
    async for doc in db.reports.find(query).sort("uploaded_at", -1):
        reports.append(ReportResponse(
            id=str(doc["_id"]),
            filename=doc["filename"],
            uploaded_at=doc["uploaded_at"],
            user_id=doc.get("user_id"),
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
        user_id=doc.get("user_id"),
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

# ============ USER MANAGEMENT (Admin only) ============

@app.get("/admin/users")
async def get_all_users():
    """Get all registered users (admin only)."""
    db = get_database()
    users = []
    
    async for doc in db.users.find().sort("created_at", -1):
        users.append({
            "id": str(doc["_id"]),
            "gst_number": doc["gst_number"],
            "email": doc["email"],
            "company_name": doc["company_name"],
            "industry_type": doc["industry_type"],
            "created_at": doc["created_at"]
        })
    
    return users

@app.get("/admin/companies")
async def get_all_companies_with_data():
    """Get all companies with their reports and credits data."""
    db = get_database()
    companies = []
    
    async for user in db.users.find().sort("created_at", -1):
        user_id = str(user["_id"])
        
        # Get reports for this user
        reports = []
        total_score = 0
        async for report in db.reports.find({"user_id": user_id}):
            reports.append(report)
            if report.get("analysis") and report["analysis"].get("scores"):
                total_score += report["analysis"]["scores"].get("final_trust_score", 0)
        
        avg_score = total_score / len(reports) if reports else None
        
        # Get credits for this user and calculate balances
        credits = []
        credit_balances = {}
        async for credit in db.credits.find({"user_id": user_id}).sort("assigned_at", -1):
            ctype = credit["credit_type"]
            trans_type = credit.get("transaction_type", "credit")
            
            if ctype not in credit_balances:
                credit_balances[ctype] = 0
            
            if trans_type == "credit":
                credit_balances[ctype] += credit["amount"]
            else:
                credit_balances[ctype] -= credit["amount"]
            
            credits.append({
                "id": str(credit["_id"]),
                "user_id": credit["user_id"],
                "company_name": user["company_name"],
                "credit_type": credit["credit_type"],
                "amount": credit["amount"],
                "reason": credit["reason"],
                "transaction_type": trans_type,
                "assigned_by": credit["assigned_by"],
                "assigned_at": credit["assigned_at"],
                "valid_until": credit.get("valid_until")
            })
        
        companies.append({
            "id": user_id,
            "gst_number": user["gst_number"],
            "email": user["email"],
            "company_name": user["company_name"],
            "industry_type": user["industry_type"],
            "created_at": user["created_at"],
            "total_reports": len(reports),
            "avg_trust_score": round(avg_score, 1) if avg_score else None,
            "credits": credits,
            "credit_balances": credit_balances
        })
    
    return companies

@app.post("/admin/credits")
async def assign_credit(credit: CreditAssignment, admin_email: str = "admin@gov.in"):
    """Assign or deduct credits from a company."""
    db = get_database()
    
    # Verify user exists
    try:
        user = await db.users.find_one({"_id": ObjectId(credit.user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # For debit, check if user has enough credits of that type
    if credit.transaction_type == "debit":
        total_credits = 0
        async for c in db.credits.find({"user_id": credit.user_id, "credit_type": credit.credit_type}):
            if c.get("transaction_type", "credit") == "credit":
                total_credits += c["amount"]
            else:
                total_credits -= c["amount"]
        
        if total_credits < credit.amount:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient {credit.credit_type} credits. Available: {total_credits}"
            )
    
    credit_doc = {
        "user_id": credit.user_id,
        "credit_type": credit.credit_type,
        "amount": credit.amount,
        "reason": credit.reason,
        "transaction_type": credit.transaction_type,
        "assigned_by": admin_email,
        "assigned_at": datetime.utcnow(),
        "valid_until": credit.valid_until
    }
    
    result = await db.credits.insert_one(credit_doc)
    
    return {
        "id": str(result.inserted_id),
        "user_id": credit.user_id,
        "company_name": user["company_name"],
        "credit_type": credit.credit_type,
        "amount": credit.amount,
        "reason": credit.reason,
        "transaction_type": credit.transaction_type,
        "assigned_by": admin_email,
        "assigned_at": credit_doc["assigned_at"],
        "valid_until": credit.valid_until
    }

@app.get("/admin/credits")
async def get_all_credits():
    """Get all assigned credits."""
    db = get_database()
    credits = []
    
    async for credit in db.credits.find().sort("assigned_at", -1):
        # Get company name
        try:
            user = await db.users.find_one({"_id": ObjectId(credit["user_id"])})
            company_name = user["company_name"] if user else "Unknown"
        except Exception:
            company_name = "Unknown"
        
        credits.append({
            "id": str(credit["_id"]),
            "user_id": credit["user_id"],
            "company_name": company_name,
            "credit_type": credit["credit_type"],
            "amount": credit["amount"],
            "reason": credit["reason"],
            "assigned_by": credit["assigned_by"],
            "assigned_at": credit["assigned_at"],
            "valid_until": credit.get("valid_until")
        })
    
    return credits

@app.delete("/admin/credits/{credit_id}")
async def revoke_credit(credit_id: str):
    """Revoke/delete a credit assignment."""
    db = get_database()
    
    try:
        result = await db.credits.delete_one({"_id": ObjectId(credit_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid credit ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Credit not found")
    
    return {"message": "Credit revoked successfully"}

@app.get("/users/{user_id}/credits")
async def get_user_credits(user_id: str):
    """Get credits assigned to a specific user with balances."""
    db = get_database()
    
    # Verify user exists
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    credits = []
    balances = {}
    
    async for credit in db.credits.find({"user_id": user_id}).sort("assigned_at", -1):
        ctype = credit["credit_type"]
        trans_type = credit.get("transaction_type", "credit")
        
        if ctype not in balances:
            balances[ctype] = 0
        
        if trans_type == "credit":
            balances[ctype] += credit["amount"]
        else:
            balances[ctype] -= credit["amount"]
        
        credits.append({
            "id": str(credit["_id"]),
            "credit_type": credit["credit_type"],
            "amount": credit["amount"],
            "reason": credit["reason"],
            "transaction_type": trans_type,
            "assigned_by": credit["assigned_by"],
            "assigned_at": credit["assigned_at"],
            "valid_until": credit.get("valid_until")
        })
    
    return {
        "transactions": credits,
        "balances": balances
    }

@app.get("/admin/stats")
async def get_admin_stats():
    """Get dashboard statistics for admin."""
    db = get_database()
    
    # Count companies
    total_companies = await db.users.count_documents({})
    
    # Count reports
    total_reports = await db.reports.count_documents({})
    
    # Get reports by traffic light
    red_count = 0
    yellow_count = 0
    green_count = 0
    total_score = 0
    score_count = 0
    
    async for report in db.reports.find():
        if report.get("analysis") and report["analysis"].get("scores"):
            scores = report["analysis"]["scores"]
            light = scores.get("traffic_light", "").upper()
            if light == "RED":
                red_count += 1
            elif light == "YELLOW":
                yellow_count += 1
            elif light == "GREEN":
                green_count += 1
            
            if scores.get("final_trust_score"):
                total_score += scores["final_trust_score"]
                score_count += 1
    
    # Get total credits by type
    credit_stats = {}
    async for credit in db.credits.find():
        ctype = credit["credit_type"]
        if ctype not in credit_stats:
            credit_stats[ctype] = 0
        credit_stats[ctype] += credit["amount"]
    
    # Get industry distribution
    industry_counts = {}
    async for user in db.users.find():
        industry = user.get("industry_type", "Other")
        if industry not in industry_counts:
            industry_counts[industry] = 0
        industry_counts[industry] += 1
    
    return {
        "total_companies": total_companies,
        "total_reports": total_reports,
        "avg_trust_score": round(total_score / score_count, 1) if score_count > 0 else None,
        "traffic_light_distribution": {
            "red": red_count,
            "yellow": yellow_count,
            "green": green_count
        },
        "credit_totals": credit_stats,
        "industry_distribution": industry_counts
    }
