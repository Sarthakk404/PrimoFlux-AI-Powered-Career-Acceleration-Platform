<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=200&section=header&text=PrimoFlux&fontSize=80&fontAlignY=35&desc=AI-Powered%20Resume%20Analysis%20Platform&descAlignY=60&descAlign=50" />

  **Stop guessing. Start hiring.**  
  *PrimoFlux analyzes resumes, matches candidates to jobs, and provides actionable insights — powered by **Google Gemini**.*

  ### The Smart Resume Analysis Platform

  <p align="center">
    <img src="https://img.shields.io/badge/AI-Google%20Gemini-black?style=for-the-badge&logo=ai&logoColor=f59e0b" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-black?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>

</div>

---

## PrimoFlux: How It Works

PrimoFlux streamlines hiring with an intelligent, **AI-driven workflow**:

1. **📄 Upload Resumes**  
   Candidates upload their resumes (PDF/DOCX) or register with their profile.
2. **🔍 AI Analysis**  
   Our Google Gemini-powered engine extracts skills, experience, and qualifications.
3. **🎯 Job Matching**  
   Smart matching algorithm pairs candidates with relevant open positions.
4. **📊 Insights Dashboard**  
   Get comprehensive analytics on candidate fit and role alignment.

---

## 🏗️ Architecture Stack

Modern, scalable architecture built for performance and reliability.

| Layer | Technology |
|-------|-----------|
| **Frontend UI** | **React 19** powered by **Vite**, animations via **Framer Motion**, styled with **Tailwind CSS v4**, and **Lucide Icons** |
| **Backend Core** | **FastAPI** utilizing **Python 3.11+**, strongly typed with **Pydantic v2** |
| **Intelligence** | **Google Gemini** *(Generative AI for resume parsing)* |
| **Database** | **PostgreSQL** with **SQLAlchemy 2.0** |
| **Authentication** | **JWT** with **bcrypt** |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- PostgreSQL database
- [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/PrimoFlux.git
cd PrimoFlux
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

```bash
cp .env.example .env
```

*Inside `.env`:*
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/primoflux

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret
JWT_SECRET=your_secret_key_here
```

### 4. Run the Backend

```bash
uvicorn Backend.main:app --reload
```
> API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 5. Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```
> Visit `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/resume/upload` | Upload and analyze resume |
| `POST` | `/api/v1/auth/register` | Candidate registration |
| `POST` | `/api/v1/auth/login` | User authentication |
| `GET`  | `/api/v1/jobs` | List available jobs |
| `POST` | `/api/v1/analysis/analyze` | AI-powered candidate analysis |
| `GET`  | `/health` | Health check |

---

## 📁 Project Structure

```
PrimoFlux/
├── Backend/
│   ├── main.py          # FastAPI app entry
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py      # Pydantic schemas
│   ├── database.py    # DB connection
│   └── router/       # API routes
├── Frontend/
│   ├── src/
│   │   ├── pages/    # React pages
│   │   ├── components/ # UI components
│   │   ├── services/  # API services
│   │   └── context/  # Auth context
│   └── package.json
├── uploads/            # Uploaded resumes
├── requirements.txt    # Python deps
└── Readme.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ by PrimoFlux Team</p>
</div>