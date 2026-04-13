<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:a855f7&height=200&section=header&text=PrimoFlux&fontSize=80&fontAlignY=35&desc=AI-Powered%20Career%20Acceleration%20Platform&descAlignY=60&descAlign=50" />

  **Upload your resume. PrimoFlux finds your weaknesses, fixes them, finds the right jobs, and prepares you to get them.**  
  *The single intelligent platform that handles every step of your job search — resume analysis, live job discovery, skills gap detection, and personalized cover letters — supercharged by **Groq Llama 3.3 70B** with **Gemini** as fallback.*

  ### 🚀 The Only Career Platform a Fresher Will Ever Need

  <p align="center">
    <img src="https://img.shields.io/badge/Powered%20by-Groq%20%7C%20Gemini-black?style=for-the-badge&logo=ai&logoColor=f59e0b" alt="Groq + Gemini" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-black?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL%20NeonDB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Jobs-Apify%20Live%20Scraping-ff6b35?style=for-the-badge&logo=apify&logoColor=white" alt="Apify" />
    <img src="https://img.shields.io/badge/Deploy-Vercel%20%7C%20Railway-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployment" />
  </p>

</div>

---

## 💀 The Problem Every Fresher Knows Too Well

Every fresher in India faces the same painful cycle — spending hours wondering if their resume is good enough, manually searching across 5+ different job platforms, writing generic cover letters that get ignored, and never understanding why they keep getting rejected.

| Pain Point | Reality |
|---|---|
| 😰 **Weak Resumes** | No specific feedback on what to fix or add |
| 😤 **Platform Fatigue** | Searching LinkedIn, Naukri, Internshala separately — every single day |
| 📄 **Generic Applications** | Same cover letter blasted to every company |
| 🎯 **Skills Blindspot** | No idea what's missing for your dream role |

**There was no single intelligent platform that solved all of this. Until now.**

---

## ✨ How PrimoFlux Accelerates Your Career

PrimoFlux operates as a **seamless 6-step AI pipeline** — from raw resume to interview-ready candidate:

1. **📤 Upload Your Resume**  
   Drop your PDF. The AI reads and extracts everything instantly via PyPDF2.

2. **📊 Get Your Intelligence Report**  
   Receive a full resume score out of 100, strengths, weaknesses, ATS compatibility check, and bullet-point-level rewrite suggestions.

3. **🌐 Discover Live Jobs**  
   Based on your extracted skills, PrimoFlux fires real-time scraping across LinkedIn, Naukri, Internshala, Glassdoor, Wellfound, and Indeed via Apify — filtered by role, location, stipend, and work mode.

4. **🔍 Analyze Your Skills Gap**  
   Click any job listing. Paste the JD. The AI maps your resume against it and tells you exactly what you have, what you're missing, and how long it'll take to close the gap.

5. **✍️ Generate a Personalized Cover Letter**  
   One click. The AI fuses your actual resume data with the specific job description — not a template, a genuinely tailored letter every time.

6. **🏆 Apply & Win**  
   Walk into every application and interview fully prepared — not guessing.

---

## 🏗️ Architecture Stack

Engineered for speed, intelligence, and scale — every layer chosen with purpose.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend UI** | **React 19** + **Vite** + **Tailwind CSS** | Dashboard, job board, report pages |
| **Backend Core** | **FastAPI** (Python 3.11+) + **Pydantic v2** | API endpoints, business logic, auth |
| **Authentication** | **JWT** | Secure user sessions & account management |
| **AI Engine (Primary)** | **Groq Llama 3.3 70B Versatile** | Resume analysis, gap detection, cover letters |
| **AI Engine (Fallback)** | **Google Gemini API** | Resilient fallback for all AI operations |
| **PDF Processing** | **PyPDF2** | Text extraction from uploaded resumes |
| **Job Scraping** | **Apify** | Live listings from 6 major platforms in real-time |
| **Database** | **PostgreSQL (NeonDB)** | User accounts & resume data storage |
| **Deployment** | **Vercel** (Frontend) + **Railway** (Backend) | Cloud-hosted, production-ready |

---

## 🌐 Supported Job Platforms

PrimoFlux scrapes all major Indian and global job platforms **live** via Apify — no stale data, ever.

| Platform | Type | Best For |
|----------|------|---------|
| **LinkedIn** | Global Professional Network | Full-time roles, MNCs, networking |
| **Naukri.com** | India's Largest Job Portal | All job types, service companies |
| **Internshala** | India's Top Internship Platform | Internships, fresher roles |
| **Glassdoor** | Global Job + Reviews Platform | Company research + listings |
| **Wellfound (AngelList)** | Startup Job Platform | Startup jobs, equity roles |
| **Indeed** | Global Job Aggregator | Broad search across all categories |

---

## 🚀 Lift-Off: Local Setup

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- A [Groq API Key](https://console.groq.com/keys)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- A [NeonDB PostgreSQL](https://neon.tech) database URL *(free tier works)*
- An [Apify API Token](https://console.apify.com/account/integrations)

### 1. Clone the Repository

```bash
git clone https://github.com/Sarthakk404/PrimoFlux-AI-Powered-Career-Acceleration-Platform.git
cd PrimoFlux-AI-Powered-Career-Acceleration-Platform
```

### 2. Ignite the Backend

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

*Inside `.env`:*
```env
# AI — Primary + Fallback
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your_gemini_api_key_here

# Job Scraping
APIFY_API_TOKEN=your_apify_token_here

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Auth
SECRET_KEY=your_jwt_secret_key_here
```

### 4. Boot the Backend

```bash
uvicorn app.main:app --reload
```
> API server runs at `http://localhost:8000` · OpenAPI docs at `http://localhost:8000/docs`

### 5. Launch the Frontend

```bash
cd frontend
npm install
npm run dev
```
> UI live at `http://localhost:5173`

---

## 📡 Core API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/resume/upload` | Upload PDF and extract resume data |
| `POST` | `/api/v1/resume/analyze` | Generate full intelligence report + score |
| `POST` | `/api/v1/resume/improve` | Line-by-line improvement suggestions |
| `GET`  | `/api/v1/jobs/search` | Live job listings matched to user skills |
| `POST` | `/api/v1/jobs/gap-analysis` | Skills gap: resume vs job description |
| `POST` | `/api/v1/cover-letter/generate` | Personalized cover letter for a specific job |
| `POST` | `/api/v1/auth/register` | Create user account |
| `POST` | `/api/v1/auth/login` | JWT login |
| `GET`  | `/health` | Systems check |

---

## 🛣️ Build Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | PDF upload + text extraction (PyPDF2) | ✅ Done |
| 2 | Resume analyzer — score, strengths, weaknesses | ✅ Done |
| 3 | Resume improvement — line-by-line suggestions | ✅ Done |
| 4 | Apify integration — live job scraping | ✅ Done |
| 5 | Skills gap analyzer — resume vs JD | ✅ Done |
| 6 | Cover letter generator — personalized per job | ✅ Done |
| 7 | React frontend — dashboard, job board, report pages | ✅ Done |
| 8 | JWT auth + user accounts | ✅ Done |
| 9 | Vercel + Railway deployment | ✅ Done |

---

## 🎨 UI Philosophy

PrimoFlux is built with a precision-engineered dark dashboard aesthetic:
- **Deep Space Dashboard:** Multi-layered radial gradients with ambient indigo-violet glow across every surface.
- **Glassmorphism Cards:** Heavy `.backdrop-blur-xl` overlays giving each component real visual depth.
- **Fluid Transitions:** Smooth entrance animations and hover interactions across the entire job board and report views.
- **Data-First Design:** Resume scores, gap charts, and skill badges presented as visual intelligence — not raw text.

---

## 💡 Why PrimoFlux Wins Interviews

> *Built this because I needed it. That's the best origin story.*

- **Full Stack Coverage** — Backend, AI, database, scraping, auth, frontend — every layer built from scratch
- **Live Data** — Not a static demo. Real jobs from real platforms in real time via Apify
- **Dual AI Engine** — Groq as the primary for sub-second response, Gemini as the resilient fallback
- **AI With Purpose** — Not just an LLM wrapper. AI drives core value at every single step of the flow
- **Real Indian Market Focus** — Built specifically around the Naukri/Internshala/LinkedIn ecosystem freshers actually use

---

## 📄 License

Open source under the [MIT License](LICENSE).

---

<div align="center">
  <p>Engineered with ❤️ by <a href="https://github.com/Sarthakk404">Sarthak</a> · 2025</p>
</div>