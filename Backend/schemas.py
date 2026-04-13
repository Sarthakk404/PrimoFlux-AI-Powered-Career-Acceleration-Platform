from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ResumeCreate(BaseModel):
    filename: str
    extracted_text: str

class ResumeResponse(BaseModel):
    id: int
    user_id: int | None = None
    filename: str
    extracted_text: str
    analysis: str | None = None
    score: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    resume_text: str

class StrengthItem(BaseModel):
    area: str
    description: str

class WeaknessItem(BaseModel):
    area: str
    description: str

class LineImprovement(BaseModel):
    line: str
    suggestion: str

class AnalysisResponse(BaseModel):
    score: int
    strengths: List[StrengthItem]
    weaknesses: List[WeaknessItem]
    ats_compatibility: str
    line_improvements: List[LineImprovement]
    overall_summary: str

class SkillsGapRequest(BaseModel):
    resume_text: str
    job_description: str

class SkillsGapResponse(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    gap_percentage: float
    recommendations: List[str]

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_title: str
    company_name: str
    job_description: str

class CoverLetterResponse(BaseModel):
    cover_letter: str