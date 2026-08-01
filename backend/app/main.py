from fastapi import FastAPI
from backend.app.api.users import router as users_router

app = FastAPI(
    title="InterviewIQ API",
    description="AI-Powered Interview Preparation Platform",
    version="1.0.0"
)
app.include_router(users_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to InterviewIQ 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }