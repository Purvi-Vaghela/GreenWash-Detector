import hashlib
import secrets
from datetime import datetime
from typing import Optional
from bson import ObjectId

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash."""
    try:
        salt, hashed = stored_hash.split(":")
        check_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return check_hash == hashed
    except:
        return False

async def create_user(db, user_data: dict) -> dict:
    """Create a new industry user."""
    user_doc = {
        "gst_number": user_data["gst_number"],
        "email": user_data["email"].lower(),
        "company_name": user_data["company_name"],
        "industry_type": user_data["industry_type"],
        "password_hash": hash_password(user_data["password"]),
        "role": "client",
        "created_at": datetime.utcnow(),
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc

async def get_user_by_email(db, email: str) -> Optional[dict]:
    """Get user by email."""
    return await db.users.find_one({"email": email.lower()})

async def get_user_by_gst(db, gst_number: str) -> Optional[dict]:
    """Get user by GST number."""
    return await db.users.find_one({"gst_number": gst_number})

async def authenticate_user(db, email: str, password: str) -> Optional[dict]:
    """Authenticate user with email and password."""
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user

# Admin credentials (hardcoded for demo - in production use env vars)
ADMIN_CREDENTIALS = {
    "admin@govt.in": "admin123",
    "official@govt.in": "govt@2024"
}

# Secret code for admin registration (in production, use env var)
ADMIN_REGISTRATION_CODE = "GOVT2024SECRET"

def authenticate_admin(email: str, password: str) -> Optional[dict]:
    """Authenticate admin with hardcoded credentials or from database."""
    if email.lower() in ADMIN_CREDENTIALS:
        if ADMIN_CREDENTIALS[email.lower()] == password:
            return {
                "email": email.lower(),
                "role": "admin",
                "name": "Government Official"
            }
    return None

async def authenticate_admin_db(db, email: str, password: str) -> Optional[dict]:
    """Authenticate admin from database."""
    admin = await db.admins.find_one({"email": email.lower()})
    if not admin:
        return None
    if not verify_password(password, admin["password_hash"]):
        return None
    return admin

async def create_admin(db, admin_data: dict) -> dict:
    """Create a new admin user."""
    admin_doc = {
        "email": admin_data["email"].lower(),
        "name": admin_data["name"],
        "department": admin_data["department"],
        "password_hash": hash_password(admin_data["password"]),
        "role": "admin",
        "created_at": datetime.utcnow(),
    }
    
    result = await db.admins.insert_one(admin_doc)
    admin_doc["_id"] = result.inserted_id
    return admin_doc

async def get_admin_by_email(db, email: str) -> Optional[dict]:
    """Get admin by email."""
    return await db.admins.find_one({"email": email.lower()})
