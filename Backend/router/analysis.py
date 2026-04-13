import os
import json
import logging
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import httpx
from Backend import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

logger.info(f"GROQ key present: {bool(GROQ_API_KEY)}")
logger.info(f"GEMINI key present: {bool(GEMINI_API_KEY)}")

router = APIRouter(prefix="/analysis", tags=["analysis"])

async def call_groq(prompt: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-70b-versatile",
        "messages": [{"role": "user", "content": prompt[:8000]}],
        "temperature": 0.7,
        "max_tokens": 2000
    }
    async with httpx.AsyncClient() as client:
        logger.info("Calling Groq API...")
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=60.0)
            logger.info(f"Groq response status: {response.status_code}")
            if response.status_code != 200:
                logger.error(f"Groq error: {response.text}")
                response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            logger.error(f"Groq HTTP error: {e.response.text}")
            raise HTTPException(status_code=500, detail=f"AI API error: {e.response.text}")

async def call_gemini(prompt: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Calling Gemini API...")
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    return response.text

async def get_ai_response(prompt: str) -> str:
    try:
        if GROQ_API_KEY:
            logger.info("Using Groq API")
            return await call_groq(prompt)
    except Exception as e:
        logger.error(f"Groq failed: {e}")
        if GEMINI_API_KEY:
            logger.info("Falling back to Gemini API")
            return await call_gemini(prompt)
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    if GEMINI_API_KEY:
        logger.info("Using Gemini API")
        return await call_gemini(prompt)
    
    logger.error("No AI API key configured")
    raise HTTPException(status_code=500, detail="No AI API key configured")

def parse_analysis_response(response_text: str) -> dict:
    try:
        data = json.loads(response_text)
        return data
    except json.JSONDecodeError:
        lines = response_text.strip().split("\n")
        result = {"score": 50, "strengths": [], "weaknesses": [], "ats_compatibility": "Unknown", "line_improvements": [], "overall_summary": response_text}
        for line in lines:
            if line.lower().startswith("score:"):
                try:
                    result["score"] = int(line.split(":")[1].strip())
                except:
                    pass
        return result

@router.post("/resume", response_model=schemas.AnalysisResponse)
async def analyze_resume(request: schemas.AnalysisRequest):
    prompt = f"""You are an expert resume analyzer. Analyze the following resume and provide detailed feedback in JSON format.

Resume:
{request.resume_text}

Please analyze and return a JSON object with exactly this structure:
{{
    "score": <integer 0-100>,
    "strengths": [{{"area": "<skill/area>", "description": "<explanation>"}}],
    "weaknesses": [{{"area": "<area>", "description": "<explanation>"}}],
    "ats_compatibility": "<High/Medium/Low with explanation>",
    "line_improvements": [{{"line": "<original line or section>", "suggestion": "<improvement suggestion>"}}],
    "overall_summary": "<2-3 sentence summary>"
}}

Focus on:
1. Skills clarity and quantification
2. Action verbs usage
3. Format and structure
4. ATS optimization (keywords, formatting)
5. Experience descriptions
6. Education and certifications

Return ONLY valid JSON, no other text."""

    try:
        response = await get_ai_response(prompt)
        parsed = parse_analysis_response(response)
        
        return schemas.AnalysisResponse(
            score=parsed.get("score", 50),
            strengths=[schemas.StrengthItem(**s) for s in parsed.get("strengths", [])],
            weaknesses=[schemas.WeaknessItem(**w) for w in parsed.get("weaknesses", [])],
            ats_compatibility=parsed.get("ats_compatibility", "Medium"),
            line_improvements=[schemas.LineImprovement(**l) for l in parsed.get("line_improvements", [])],
            overall_summary=parsed.get("overall_summary", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/skills-gap", response_model=schemas.SkillsGapResponse)
async def analyze_skills_gap(request: schemas.SkillsGapRequest):
    prompt = f"""You are an expert career analyzer. Compare the resume with the job description and identify skill gaps.

Resume:
{request.resume_text}

Job Description:
{request.job_description}

Return a JSON object with exactly this structure:
{{
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["skill1", "skill2"],
    "gap_percentage": <0-100>,
    "recommendations": ["recommendation1", "recommendation2"]
}}

Identify:
1. Technical skills (languages, tools, frameworks)
2. Soft skills
3. Domain knowledge
4. Certifications needed

Return ONLY valid JSON, no other text."""

    try:
        response = await get_ai_response(prompt)
        parsed = json.loads(response)
        
        return schemas.SkillsGapResponse(
            matched_skills=parsed.get("matched_skills", []),
            missing_skills=parsed.get("missing_skills", []),
            gap_percentage=parsed.get("gap_percentage", 0),
            recommendations=parsed.get("recommendations", [])
        )
    except json.JSONDecodeError:
        return schemas.SkillsGapResponse(
            matched_skills=[],
            missing_skills=[],
            gap_percentage=100,
            recommendations=["Unable to parse response"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skills gap analysis failed: {str(e)}")

@router.post("/cover-letter", response_model=schemas.CoverLetterResponse)
async def generate_cover_letter(request: schemas.CoverLetterRequest):
    prompt = f"""You are an expert cover letter writer. Generate a personalized, professional cover letter.

Resume:
{request.resume_text}

Job Title: {request.job_title}
Company: {request.company_name}
Job Description:
{request.job_description}

Write a cover letter that:
1. Opens with enthusiasm for the specific role at {request.company_name}
2. Highlights 2-3 relevant skills/experiences from the resume that match the job requirements
3. Shows understanding of the company's needs
4. Closes with a call to action

Keep it professional, concise (300-400 words), and engaging. Use a professional tone.
Do NOT include any placeholders - use concrete examples from the resume.
Do NOT include any JSON - just the cover letter text."""

    try:
        response = await get_ai_response(prompt)
        return schemas.CoverLetterResponse(cover_letter=response.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")