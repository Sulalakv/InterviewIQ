from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel


class DashboardCounts(BaseModel):
    resumes: int
    jobs: int
    analyses: int
    matches: int


class ResumeSummary(BaseModel):
    id: int
    filename: str


class JobSummary(BaseModel):
    id: int
    title: str
    company: Optional[str] = None
    created_at: datetime


class MatchSummary(BaseModel):
    match_id: int
    resume_id: int
    job_id: int
    match_score: Optional[int] = None
    created_at: datetime


class LatestAnalysis(BaseModel):
    resume_id: int
    overall_score: Optional[int] = None
    ats_score: Optional[int] = None
    analysis: Optional[Any] = None


class DashboardResponse(BaseModel):
    counts: DashboardCounts

    latest_resume: Optional[ResumeSummary] = None

    latest_analysis: Optional[LatestAnalysis] = None

    recent_resumes: List[ResumeSummary]

    recent_jobs: List[JobSummary]

    recent_matches: List[MatchSummary]