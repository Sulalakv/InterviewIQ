from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from backend.app.database.database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False
    )

    overall_score = Column(
        Integer,
        nullable=True
    )

    ats_score = Column(
        Integer,
        nullable=True
    )

    analysis_data = Column(
        JSONB,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    resume = relationship(
        "Resume",
        back_populates="analyses"
    )