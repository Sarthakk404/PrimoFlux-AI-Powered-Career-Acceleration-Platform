from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Backend.router import resume, analysis, auth, jobs
import Backend.models as models
from Backend.database import engine
import os

try:
    models.Base.metadata.create_all(bind=engine)
    print("Database tables ready")
except Exception as e:
    print(f"Database error: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(auth.router)
app.include_router(jobs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Resume Analysis API!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
