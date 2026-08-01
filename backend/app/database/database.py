from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.app.config.settings import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True  # Shows SQL queries in terminal
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()