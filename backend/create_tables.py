from app.database.database import Base, engine

# Import all models
from app.models.user import User

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")