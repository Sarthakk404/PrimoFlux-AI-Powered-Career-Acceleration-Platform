from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from Backend.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Resume(Base):
    __tablename__ = 'resumes'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    filename = Column(String, index=True)
    extracted_text = Column(Text)
    analysis = Column(Text)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)