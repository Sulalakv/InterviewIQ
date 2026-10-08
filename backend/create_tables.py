from backend.app.database.database import Base, engine

# Import all models
from backend.app.models.user import User
from backend.app.models.resume import Resume
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")