from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "eleven-reader")
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "default_collection")
    PORT: int = os.getenv("PORT", 8000)
