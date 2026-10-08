from dotenv import load_dotenv
import os

# Load variables from backend/.env
load_dotenv("backend/.env")


class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
    )

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


settings = Settings()