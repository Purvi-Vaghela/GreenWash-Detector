from pydantic import BaseModel, Field, EmailStr
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

# User Models
class UserRegister(BaseModel):
    gst_number: str
    email: EmailStr
    company_name: str
    industry_type: str
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    gst_number: str
    email: str
    company_name: str
    industry_type: str
    role: str = "client"
    created_at: datetime

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminRegister(BaseModel):
    email: EmailStr
    name: str
    department: str
    password: str
    confirm_password: str
    admin_code: str  # Secret code to verify govt official

class AdminResponse(BaseModel):
    id: str
    email: str
    name: str
    department: str
    role: str = "admin"
    created_at: datetime

# ESG Analysis Models
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
    user_id: Optional[str] = None
    analysis: Optional[AnalysisResult] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ReportResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime
    user_id: Optional[str] = None
    analysis: AnalysisResult

# Credit Models
class CreditAssignment(BaseModel):
    user_id: str
    credit_type: str  # CO2, renewable, waste, etc.
    amount: float
    reason: str
    transaction_type: str = "credit"  # credit (add) or debit (deduct)
    valid_until: Optional[datetime] = None

class CreditResponse(BaseModel):
    id: str
    user_id: str
    company_name: str
    credit_type: str
    amount: float
    reason: str
    transaction_type: str = "credit"
    assigned_by: str
    assigned_at: datetime
    valid_until: Optional[datetime] = None

class CompanyWithCredits(BaseModel):
    id: str
    gst_number: str
    email: str
    company_name: str
    industry_type: str
    created_at: datetime
    total_reports: int = 0
    avg_trust_score: Optional[float] = None
    credits: List[CreditResponse] = []
