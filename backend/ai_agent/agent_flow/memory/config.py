import os
from dotenv import load_dotenv

load_dotenv()  # expects REDIS_URL, CREW_CONFIG_PATH

REDIS_URL = os.getenv("REDIS_URL")
MONGO_USER= os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")