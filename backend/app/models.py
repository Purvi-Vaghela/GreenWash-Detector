from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")

class CompanyInfo(BaseModel):
    name: str
    industry_type: str
    primary_focus: str

class Contradiction(BaseModel):
    claim: str
    reality: str
    source: Optional[str] = None

class Scores(BaseModel):
    final_trust_score: float
    specificity: float
    consistency: float
    verification: float
    traffic_light: str  # RED | YELLOW | GREEN

class AuditDetails(BaseModel):
    major_commitments: List[str]
    detected_contradictions: List[Contradiction]
    vague_language_count: int
    hard_metrics_found: int

class AnalysisResult(BaseModel):
    company_info: CompanyInfo
    scores: Scores
    audit_details: AuditDetails
    admin_brief: str
    client_feedback: str

class ReportDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    filename: str
    file_id: str  # GridFS file ID
    uploaded_at: datetime
    uploaded_by: Optional[str] = None
    analysis: Optional[AnalysisResult] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ReportResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime
    analysis: AnalysisResult
