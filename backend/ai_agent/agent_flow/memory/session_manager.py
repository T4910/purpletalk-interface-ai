# session_manager.py

from .config import MONGO_USER, MONGO_PASSWORD

from pymongo import MongoClient

# Connect to MongoDB (replace with your credentials)
client = MongoClient(f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@cluster0.uyixzji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["my_database"]
collection = db["sessions"]


# 2. Session TTL (in seconds)


def create_new_session(crew,session_id) -> str:
    """
    Generate a new session ID and instantiate a fresh Crew.
    Serializes and stores the Crew instance and an empty buffer in Redis.
    """
    if crew: 
        collection.update_one(
            {"session_id": session_id},
            {"$setOnInsert": {"buffer": []}},
            upsert=True
        )

    return session_id

def load_session(session_id: str):
    """
    Retrieve and deserialize session state from Redis.
    Returns None if session does not exist or has expired.
    """
    doc = collection.find_one({"session_id": session_id})
    return doc["buffer"] if doc else None

def save_session(session_id: str,new_texts: list[str]):
    """
    Serialize and save updated session state back to Redis.
    """
    collection.update_one(
        {"session_id": session_id},
        {"$push": {"buffer": {"$each": new_texts}}},
        upsert=True
    )

