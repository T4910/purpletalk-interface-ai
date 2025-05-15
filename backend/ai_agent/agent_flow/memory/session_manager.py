# session_manager.py

import asyncio
import pickle
import uuid
import redis.asyncio as aioredis
from crewai import Crew

from .config import REDIS_URL

# 1. Initialize the async Redis client
#    .get() and .set() are coroutines returning bytes/raw data
redis_client = aioredis.Redis.from_url(REDIS_URL, decode_responses=False)

# 2. Session TTL (in seconds)
SESSION_TTL = 60 * 60 * 24  # 24 hours

async def create_new_session(crew,session_id) -> str:
    """
    Generate a new session ID and instantiate a fresh Crew.
    Serializes and stores the Crew instance and an empty buffer in Redis.
    """
    payload = pickle.dumps({"crew": crew, "buffer": []})
    # Await the set operation with an expiration TTL
    await redis_client.set(session_id, payload, ex=SESSION_TTL)
    return session_id

async def load_session(session_id: str):
    """
    Retrieve and deserialize session state from Redis.
    Returns None if session does not exist or has expired.
    """
    raw = await redis_client.get(session_id)  # raw: bytes | None
    if raw is None:
        return None
    state = pickle.loads(raw)
    # Refresh TTL on each access (sliding expiration)
    await redis_client.expire(session_id, SESSION_TTL)
    return state  # dict with keys "crew" and "buffer"

async def save_session(session_id: str, crew, buffer):
    """
    Serialize and save updated session state back to Redis.
    """
    payload = pickle.dumps({"crew": crew, "buffer": buffer})
    await redis_client.set(session_id, payload, ex=SESSION_TTL)

# === Example async usage ===
if __name__ == "__main__":
    async def demo():
        # Create a new session
        sid = await create_new_session(crew=1)
        print("New session ID:", sid)

        # Load the session
        state = await load_session(sid)
        print("Loaded state keys:", list(state.keys()) if state else None)

        # Modify buffer and save
        crew = state["crew"]
        buffer = state["buffer"]
        buffer.append("User: Hello")
        await save_session(sid, crew, buffer)
        print("Updated buffer and saved.")

        # Load again to verify
        state2 = await load_session(sid)
        print("Buffer after reload:", state2["buffer"])

    asyncio.run(demo())