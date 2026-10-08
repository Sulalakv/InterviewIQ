from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.dependencies import get_db

from backend.app.core.oauth2 import get_current_user
from backend.app.models.user import User
from backend.app.models.resume import Resume
import shutil
import os
import uuid
from backend.app.services.resume_parser import extract_text_from_pdf
from backend.app.services.resume_sections import extract_sections
from backend.app.services.skill_extractor import extract_skills
from backend.app.models.resume_analysis import ResumeAnalysis
from backend.app.services.analysis.ai_analyzer import AIResumeAnalyzer

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.get("/test")
def test_resume():
    return {
        "message": "Resume API is working!"
    }





@router.post("/upload")
def upload_resume(
    resume: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    
): 
    allowed_types = [
        "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if resume.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="only pdf and docx files are allowed."
        )
    file_extension = os.path.splitext(resume.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(
        "uploads",
        unique_filename
    )
    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(
            resume.file,
            buffer
        )

    resume_text = extract_text_from_pdf(file_path)

    resume_sections = extract_sections(resume_text)
    technical_skills = resume_sections.get("technical_skills", [])

    skills = extract_skills(technical_skills)

    print("\n========== RESUME SECTIONS ==========\n")
    print(resume_sections)
    print("\n======================================\n")
    print("\n========== EXTRACTED SKILLS ==========\n")
    print(skills)
    print("\n=======================================\n")

    parsed_data = {
        "sections": resume_sections,
        "skills": skills
    }
    resume_record = Resume(
        original_filename=resume.filename,
        stored_filename=unique_filename,
        file_path=file_path,
        user_id=current_user.id,
        extracted_text=resume_text,
        parsed_data=parsed_data
    )
    

    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)
    
    
    return {
            "message": "Resume uploaded successfully",
            "resume_id": resume_record.id,
            "filename": resume_record.original_filename,
            "stored_filename": resume_record.stored_filename
        }




@router.post("/{resume_id}/analyze")
def analyze_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Find the resume
    resume_record = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume_record:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # 2. Make sure parsed data exists
    if not resume_record.parsed_data:
        raise HTTPException(
            status_code=400,
            detail="Resume has not been parsed yet"
        )

    # 3. Create AI analyzer
    analyzer = AIResumeAnalyzer()

    # 4. Analyze resume
    analysis_result = analyzer.analyze(
        resume_record.parsed_data
    )

    # 5. Store analysis
    analysis_record = ResumeAnalysis(
        resume_id=resume_record.id,
        overall_score=analysis_result.get("overall_score"),
        ats_score=analysis_result.get("ats_score"),
        analysis_data=analysis_result
    )

    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    # 6. Return result
    return {
        "message": "Resume analyzed successfully",
        "resume_id": resume_record.id,
        "analysis_id": analysis_record.id,
        "analysis": analysis_result
    }



@router.get("/{resume_id}/analysis")
def get_resume_analysis(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the resume and make sure it belongs to the logged-in user
    resume_record = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume_record:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Get the latest analysis for this resume
    analysis_record = (
        db.query(ResumeAnalysis)
        .filter(
            ResumeAnalysis.resume_id == resume_id
        )
        .order_by(
            ResumeAnalysis.created_at.desc()
        )
        .first()
    )

    if not analysis_record:
        raise HTTPException(
            status_code=404,
            detail="No analysis found for this resume"
        )

    return {
        "resume_id": resume_id,
        "analysis_id": analysis_record.id,
        "overall_score": analysis_record.overall_score,
        "ats_score": analysis_record.ats_score,
        "analysis": analysis_record.analysis_data,
        "created_at": analysis_record.created_at
    }



@router.get("/")
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).all()

    return [
        {
            "id": resume.id,
            "filename": resume.original_filename,
            "stored_filename": resume.stored_filename
        }
        for resume in resumes
    ]



@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return {
    "id": resume.id,
    "filename": resume.original_filename,
    "stored_filename": resume.stored_filename,
    "parsed_data": resume.parsed_data
}




