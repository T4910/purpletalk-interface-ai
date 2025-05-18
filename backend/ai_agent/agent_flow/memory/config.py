import os
from dotenv import load_dotenv

load_dotenv()  # expects REDIS_URL, CREW_CONFIG_PATH

REDIS_URL = os.getenv("REDIS_URL")