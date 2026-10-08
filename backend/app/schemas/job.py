from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):
    title: str
    company: Optional[str] = None
    description: str