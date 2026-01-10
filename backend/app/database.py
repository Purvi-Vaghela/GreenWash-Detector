from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from .config import get_settings

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None
    fs: AsyncIOMotorGridFSBucket = None

db = Database()

async def connect_db():
    settings = get_settings()
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.mongodb_db_name]
    db.fs = AsyncIOMotorGridFSBucket(db.db)
    print(f"Connected to MongoDB: {settings.mongodb_db_name}")

async def close_db():
    if db.client:
        db.client.close()
        print("MongoDB connection closed")

def get_database() -> AsyncIOMotorDatabase:
    return db.db

def get_gridfs() -> AsyncIOMotorGridFSBucket:
    return db.fs
