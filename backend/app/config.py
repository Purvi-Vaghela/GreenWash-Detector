from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    openai_api_key: str = ""
    serper_api_key: str = ""
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "greenwash_detector"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
