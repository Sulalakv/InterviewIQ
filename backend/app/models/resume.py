from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

from backend.app.database.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    original_filename = Column(
        String,
        nullable=False
    )

    stored_filename = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    extracted_text = Column(
        String,
        nullable=True
    )

    parsed_data = Column(
        JSONB,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="resumes"
    )

    analyses = relationship(
        "ResumeAnalysis",
        back_populates="resume",
        cascade="all, delete-orphan"
    )

    job_matches = relationship(
        "JobMatch",
        back_populates="resume",
        cascade="all, delete-orphan"
    )