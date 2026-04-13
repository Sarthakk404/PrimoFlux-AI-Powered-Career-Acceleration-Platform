from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from Backend.database import get_db
from Backend.router.auth import get_current_user
from Backend import schemas
from Backend import models
from typing import List
import os
import shutil
import logging
import PyPDF2
from docx import Document

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.makedirs("uploads", exist_ok=True)
router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        logger.info(f"Uploading file: {file.filename} for user: {current_user.email}")
        
        if not file.filename.lower().endswith((".pdf", ".docx")):
            logger.warning(f"Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed.")
        
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = ""
        content_type = file.filename.lower()

        try:
            if content_type.endswith(".pdf"):
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                logger.info("PDF extracted successfully")

            elif content_type.endswith(".docx"):
                doc = Document(file_path)
                for paragraph in doc.paragraphs:
                    text += paragraph.text + "\n"
                logger.info("DOCX extracted successfully")
        except Exception as e:
            logger.error(f"Text extraction error: {e}")
            text = ""

        if not text.strip():
            logger.warning(f"No text extracted from {file.filename}")
            raise HTTPException(status_code=400, detail="Could not extract text from file. File may be empty or corrupted.")

        db_resume = models.Resume(
            user_id=current_user.id,
            filename=file.filename,
            extracted_text=text.strip()
        )
        
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        logger.info(f"Resume saved: ID {db_resume.id} for User {current_user.id}")
        return db_resume
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/list", response_model=List[schemas.ResumeResponse])
async def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.created_at.desc()).all()
    return resumes