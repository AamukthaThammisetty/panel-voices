from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URL)

db = client[Config.DATABASE_NAME]
collection = db[Config.COLLECTION_NAME]

def get_collection(name: str):
    return db[name]