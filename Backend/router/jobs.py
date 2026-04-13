import os
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

load_dotenv()

APIFY_API_KEY = os.getenv("APIFY_API_KEY")
router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobItem(BaseModel):
    id: str
    title: str
    company: str
    location: str
    url: str
    posted_date: Optional[str] = None
    description: Optional[str] = None

class JobDiscoveryRequest(BaseModel):
    keywords: str
    location: Optional[str] = None

class JobDiscoveryResponse(BaseModel):
    jobs: List[JobItem]
    source: str

async def scrape_linkedin(keywords: str, location: str = None) -> List[dict]:
    url = "https://api.apify.com/v2/acts/twhitelion~linkedin-jobs-scraper/run"
    payload = {
        "keywords": keywords,
        "location": location or "Remote",
        "limit": 20
    }
    headers = {
        "Authorization": f"Bearer {APIFY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            if response.status_code == 200:
                data = response.json()
                dataset_id = data.get("defaultDatasetId")
                if dataset_id:
                    jobs_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items"
                    jobs_response = await client.get(jobs_url, headers=headers, timeout=30.0)
                    if jobs_response.status_code == 200:
                        return jobs_response.json()
        except Exception as e:
            return []
    return []

async def scrape_naukri(keywords: str) -> List[dict]:
    url = f"https://api.apify.com/v2/acts/nickhiller~naukri-scraper/run"
    payload = {
        "searchTerms": [keywords],
        "maxResults": 20
    }
    headers = {
        "Authorization": f"Bearer {APIFY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            if response.status_code == 200:
                data = response.json()
                dataset_id = data.get("defaultDatasetId")
                if dataset_id:
                    jobs_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items"
                    jobs_response = await client.get(jobs_url, headers=headers, timeout=30.0)
                    if jobs_response.status_code == 200:
                        return jobs_response.json()
        except Exception:
            return []
    return []

@router.post("/discover", response_model=JobDiscoveryResponse)
async def discover_jobs(request: JobDiscoveryRequest):
    jobs = []
    
    linkedin_jobs = await scrape_linkedin(request.keywords, request.location)
    for job in linkedin_jobs[:10]:
        jobs.append(JobItem(
            id=f"linkedin-{job.get('id', '')}",
            title=job.get("title", ""),
            company=job.get("company", ""),
            location=job.get("location", ""),
            url=job.get("url", ""),
            posted_date=job.get("postedDate", ""),
            description=job.get("description", "")
        ))
    
    naukri_jobs = await scrape_naukri(request.keywords)
    for job in naukri_jobs[:10]:
        jobs.append(JobItem(
            id=f"naukri-{job.get('id', '')}",
            title=job.get("title", ""),
            company=job.get("company", ""),
            location=job.get("location", ""),
            url=job.get("url", ""),
            posted_date=job.get("postedDate", ""),
            description=job.get("description", "")
        ))
    
    return JobDiscoveryResponse(jobs=jobs, source="Apify Scraper")

@router.get("/mock-jobs/{keywords}")
async def get_mock_jobs(keywords: str):
    mock_jobs = [
        {
            "id": "mock-1",
            "title": f"Software Engineer - {keywords}",
            "company": "Tech Corp",
            "location": "Bangalore, India",
            "url": "https://linkedin.com/jobs/view/123",
            "posted_date": "2026-04-10",
            "description": "Looking for a skilled software engineer with Python, FastAPI, and React experience."
        },
        {
            "id": "mock-2",
            "title": f"Full Stack Developer - {keywords}",
            "company": "StartupXYZ",
            "location": "Remote",
            "url": "https://naukri.com/jobs/456",
            "posted_date": "2026-04-11",
            "description": "Join our team to build amazing web applications."
        },
        {
            "id": "mock-3",
            "title": f"Backend Engineer - {keywords}",
            "company": "InnovateTech",
            "location": "Hyderabad, India",
            "url": "https://internshala.com/jobs/789",
            "posted_date": "2026-04-12",
            "description": "Work on scalable backend systems using modern technologies."
        }
    ]
    return JobDiscoveryResponse(jobs=[JobItem(**j) for j in mock_jobs], source="Mock Data")