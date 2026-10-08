from fastapi import FastAPI
from backend.app.api.users import router as users_router
from backend.app.api.resume import router as resume_router
from backend.app.api.job import router as job_router
from backend.app.api.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="InterviewIQ API",
    description="AI-Powered Interview Preparation Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(dashboard_router)

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