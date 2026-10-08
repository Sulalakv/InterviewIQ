from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.dependencies import get_db
from backend.app.core.oauth2 import get_current_user

from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.models.resume_analysis import ResumeAnalysis
from backend.app.models.job import Job
from backend.app.models.job_match import JobMatch
from backend.app.schemas.dashboard import DashboardResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # -------------------------
    # Counts
    # -------------------------

    resume_count = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .count()
    )

    job_count = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .count()
    )

    analysis_count = (
        db.query(ResumeAnalysis)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .count()
    )

    match_count = (
        db.query(JobMatch)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .count()
    )

    # -------------------------
    # Recent resumes
    # -------------------------

    recent_resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.id.desc())
        .limit(5)
        .all()
    )

    # -------------------------
    # Recent jobs
    # -------------------------

    recent_jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    # -------------------------
    # Recent matches
    # -------------------------

    recent_matches = (
        db.query(JobMatch)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(JobMatch.created_at.desc())
        .limit(5)
        .all()
    )

    # -------------------------
    # Latest resume
    # -------------------------

    latest_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.id.desc())
        .first()
    )

    latest_analysis = None

    if latest_resume:
        latest_analysis = (
            db.query(ResumeAnalysis)
            .filter(
                ResumeAnalysis.resume_id == latest_resume.id
            )
            .order_by(ResumeAnalysis.created_at.desc())
            .first()
        )

    # -------------------------
    # Response
    # -------------------------

    return {
        "counts": {
            "resumes": resume_count,
            "jobs": job_count,
            "analyses": analysis_count,
            "matches": match_count
        },

        "latest_resume": (
            {
                "id": latest_resume.id,
                "filename": latest_resume.original_filename
            }
            if latest_resume
            else None
        ),

        "latest_analysis": (
            {
                "resume_id": latest_analysis.resume_id,
                "overall_score": latest_analysis.overall_score,
                "ats_score": latest_analysis.ats_score,
                "analysis": latest_analysis.analysis_data
            }
            if latest_analysis
            else None
        ),

        "recent_resumes": [
            {
                "id": resume.id,
                "filename": resume.original_filename
            }
            for resume in recent_resumes
        ],

        "recent_jobs": [
            {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "created_at": job.created_at
            }
            for job in recent_jobs
        ],

        "recent_matches": [
            {
                "match_id": match.id,
                "resume_id": match.resume_id,
                "job_id": match.job_id,
                "match_score": match.match_score,
                "created_at": match.created_at
            }
            for match in recent_matches
        ]
    }