from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.dependencies import get_db
from backend.app.core.oauth2 import get_current_user
from backend.app.models.user import User
from backend.app.models.job import Job
from backend.app.schemas.job import JobCreate
from backend.app.models.resume import Resume
from backend.app.models.job_match import JobMatch
from backend.app.services.analysis.ai_job_matcher import AIJobMatchAnalyzer


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


# =========================================================
# CREATE JOB
# =========================================================

@router.post("/")
def create_job(
    job: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_record = Job(
        title=job.title,
        company=job.company,
        description=job.description,
        user_id=current_user.id
    )

    db.add(job_record)
    db.commit()
    db.refresh(job_record)

    return {
        "message": "Job created successfully",
        "job_id": job_record.id,
        "title": job_record.title,
        "company": job_record.company
    }


# =========================================================
# GET ALL JOBS
# =========================================================

@router.get("/")
def get_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = (
        db.query(Job)
        .filter(
            Job.user_id == current_user.id
        )
        .order_by(
            Job.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "created_at": job.created_at
        }
        for job in jobs
    ]


# =========================================================
# GET ONE SPECIFIC JOB MATCH
# =========================================================
# IMPORTANT:
# This route must appear BEFORE /{job_id}
# because /{job_id} can otherwise capture "matches".
# =========================================================

@router.get("/matches/{match_id}")
def get_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = (
        db.query(JobMatch)
        .join(
            Job,
            JobMatch.job_id == Job.id
        )
        .filter(
            JobMatch.id == match_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=404,
            detail="Job match not found"
        )

    return {
        "match_id": match.id,
        "resume_id": match.resume_id,
        "job_id": match.job_id,
        "match_score": match.match_score,
        "analysis": match.analysis_data,
        "created_at": match.created_at
    }


# =========================================================
# GET SINGLE JOB
# =========================================================

@router.get("/{job_id}")
def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "created_at": job.created_at
    }


# =========================================================
# MATCH RESUME WITH JOB
# =========================================================

@router.post("/{job_id}/match/{resume_id}")
def match_resume_with_job(
    job_id: int,
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # -----------------------------------------------------
    # Find job
    # -----------------------------------------------------

    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # -----------------------------------------------------
    # Find resume
    # -----------------------------------------------------

    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # -----------------------------------------------------
    # Check parsed data
    # -----------------------------------------------------

    if not resume.parsed_data:
        raise HTTPException(
            status_code=400,
            detail="Resume has not been parsed yet"
        )

    # -----------------------------------------------------
    # Run AI job matching
    # -----------------------------------------------------

    analyzer = AIJobMatchAnalyzer()

    result = analyzer.match(
        resume.parsed_data,
        job.description
    )

    # -----------------------------------------------------
    # Save match result
    # -----------------------------------------------------

    job_match = JobMatch(
        resume_id=resume.id,
        job_id=job.id,
        match_score=result.get("match_score"),
        analysis_data=result
    )

    db.add(job_match)
    db.commit()
    db.refresh(job_match)

    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {
        "message": "Resume matched with job successfully",
        "match_id": job_match.id,
        "resume_id": resume.id,
        "job_id": job.id,
        "result": result
    }


# =========================================================
# GET ALL MATCHES FOR A JOB
# =========================================================

@router.get("/{job_id}/matches")
def get_job_matches(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # -----------------------------------------------------
    # Verify job ownership
    # -----------------------------------------------------

    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # -----------------------------------------------------
    # Get all matches
    # -----------------------------------------------------

    matches = (
        db.query(JobMatch)
        .join(
            Resume,
            JobMatch.resume_id == Resume.id
        )
        .filter(
            JobMatch.job_id == job_id,
            Resume.user_id == current_user.id
        )
        .order_by(
            JobMatch.created_at.desc()
        )
        .all()
    )

    # -----------------------------------------------------
    # Return matches
    # -----------------------------------------------------

    return [
        {
            "match_id": match.id,
            "resume_id": match.resume_id,
            "job_id": match.job_id,
            "match_score": match.match_score,
            "analysis": match.analysis_data,
            "created_at": match.created_at
        }
        for match in matches
    ]