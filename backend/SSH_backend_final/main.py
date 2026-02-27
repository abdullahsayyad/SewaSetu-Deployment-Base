# """
# Civic Grievance Intelligence Engine — FastAPI Server
# ======================================================
# REST API server for the NLP complaint analysis pipeline.

# Endpoints:
#   POST /analyze   — Analyze a citizen complaint (JSON body: {"complaint": "..."})
#   GET  /health    — Health check
#   GET  /schema    — Returns the output JSON schema

# Run with:
#   uvicorn main:app --reload --port 8000
# """

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field
# from dotenv import load_dotenv
# from pathlib import Path
# import time
# import os

# # Force-load environment variables from .env next to this file
# # Manual parsing ensures it works even when Uvicorn's reloader changes cwd
# _env_path = Path(__file__).resolve().parent / ".env"
# if _env_path.exists():
#     with open(_env_path, "r", encoding="utf-8") as f:
#         for line in f:
#             line = line.strip()
#             if line and not line.startswith("#") and "=" in line:
#                 key, _, value = line.partition("=")
#                 key = key.strip()
#                 value = value.strip().strip("'").strip('"')
#                 os.environ[key] = value
# load_dotenv(dotenv_path=_env_path, override=True)

# from engine.pipeline import analyze_complaint

# # ─── App Configuration ────────────────────────────────────
# app = FastAPI(
#     title="Civic Grievance Intelligence Engine",
#     description="AI-Powered NLP Pipeline for Citizen Complaint Analysis",
#     version="1.0.0",
#     docs_url="/docs",
#     redoc_url="/redoc",
# )

# # ─── CORS (for frontend integration) ─────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ─── Request / Response Models ────────────────────────────
# class ComplaintRequest(BaseModel):
#     complaint: str = Field(
#         ...,
#         min_length=5,
#         max_length=5000,
#         description="The citizen complaint text to analyze",
#         examples=[
#             "There is a massive pothole on MG Road near City Hospital causing accidents daily."
#         ],
#     )


# class LanguageDetection(BaseModel):
#     detected_language: str
#     confidence: float


# class Translation(BaseModel):
#     was_translated: bool
#     original_text: str
#     translated_text: str
#     translation_confidence: float


# class CategoryAnalysis(BaseModel):
#     category: str
#     subcategory: str
#     category_confidence: float


# class SentimentAnalysis(BaseModel):
#     sentiment_score: float
#     sentiment_label: str


# class SeverityAnalysis(BaseModel):
#     severity_score: int
#     severity_level: str
#     risk_type: str
#     matched_keywords: list[str]


# class Entities(BaseModel):
#     location: str
#     landmark: str


# class DepartmentProbability(BaseModel):
#     department: str
#     probability: float


# class ExplainabilityComponent(BaseModel):
#     name: str
#     raw_value: float
#     weight: float
#     weighted_value: float

# class Explainability(BaseModel):
#     components: list[ExplainabilityComponent]
#     total_before_clamp: float

# class PriorityScoring(BaseModel):
#     priority_score: float
#     risk_tier: str
#     explainability: Explainability


# class AnalysisResponse(BaseModel):
#     language_detection: LanguageDetection
#     translation: Translation
#     category_analysis: CategoryAnalysis
#     sentiment_analysis: SentimentAnalysis
#     severity_analysis: SeverityAnalysis
#     extracted_keywords: list[str]
#     entities: Entities
#     department_probabilities: list[DepartmentProbability]
#     priority_scoring: PriorityScoring
#     processing_time_ms: float = Field(
#         description="Total pipeline processing time in milliseconds"
#     )


# # ─── Endpoints ────────────────────────────────────────────

# @app.post("/analyze", response_model=AnalysisResponse)
# async def analyze(request: ComplaintRequest):
#     """
#     Analyze a citizen complaint through the full NLP pipeline.

#     Pipeline stages:
#     1. Language Detection (fastText)
#     2. Translation (IndicTrans2 dictionary)
#     3. Category Classification (Grok API — simulating BART zero-shot)
#     4. Sentiment Analysis (Grok API — simulating RoBERTa)
#     5. Severity Detection (Rule-based)
#     6. Keyword Extraction
#     7. Named Entity Recognition (spaCy)
#     8. Department Routing

#     Returns strict JSON with all analysis results.
#     """
#     try:
#         start_time = time.time()
#         result = analyze_complaint(request.complaint)
#         elapsed_ms = round((time.time() - start_time) * 1000, 2)
#         result["processing_time_ms"] = elapsed_ms
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")


# @app.post("/analyze/report", response_class=FileResponse)
# async def analyze_and_report(request: ComplaintRequest):
#     """
#     Analyze a citizen complaint and return a professional PDF report.
#     """
#     try:
#         start_time = time.time()
#         result = analyze_complaint(request.complaint)
#         elapsed_ms = round((time.time() - start_time) * 1000, 2)
#         result["processing_time_ms"] = elapsed_ms
        
#         pdf_path = generate_pdf_report(result)
        
#         return FileResponse(
#             path=pdf_path,
#             filename=f"civic_intelligence_report_{int(time.time())}.pdf",
#             media_type="application/pdf",
#             headers={"Content-Disposition": "attachment; filename=report.pdf"}
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")

# @app.get("/health")
# async def health_check():
#     """Health check endpoint."""
#     return {"status": "healthy", "service": "Civic Grievance Intelligence Engine"}




# @app.get("/schema")
# async def get_schema():
#     """Return the output JSON schema for integration reference."""
#     return AnalysisResponse.model_json_schema()


# # ─── Startup Event ────────────────────────────────────────

# @app.on_event("startup")
# async def startup_event():
#     """Pre-load local models on server startup."""
#     print("=" * 60)
#     print("  Civic Grievance Intelligence Engine")
#     print("  Starting model pre-loading...")
#     print("=" * 60)

#     try:
#         # Pre-load spaCy NER model
#         from engine.entity_recognizer import _ensure_model as load_ner
#         load_ner()

#         print("=" * 60)
#         print("  Local models loaded successfully!")
#         print("  Grok API ready for classification & sentiment.")
#         print("  Server ready at http://localhost:8000")
#         print("  API docs at http://localhost:8000/docs")
#         print("=" * 60)
#     except Exception as e:
#         print(f"[WARNING] Model pre-loading failed: {e}")
#         print("Models will load on first request instead.")

"""
Civic Grievance Intelligence Engine — FastAPI Server
======================================================
REST API server for the NLP complaint analysis pipeline.

Endpoints:
  POST /analyze   — Analyze a citizen complaint (JSON body: {"complaint": "..."})
  GET  /health    — Health check
  GET  /schema    — Returns the output JSON schema

Run with:
  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

from engine.pipeline import analyze_complaint

# ─── App Configuration ────────────────────────────────────
app = FastAPI(
    title="Civic Grievance Intelligence Engine",
    description="AI-Powered NLP Pipeline for Citizen Complaint Analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS (for frontend integration) ─────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ────────────────────────────
class ComplaintRequest(BaseModel):
    complaint: str = Field(
        ...,
        min_length=5,
        max_length=5000,
        description="The citizen complaint text to analyze",
        examples=[
            "There is a massive pothole on MG Road near City Hospital causing accidents daily."
        ],
    )


class LanguageDetection(BaseModel):
    detected_language: str
    confidence: float


class Translation(BaseModel):
    was_translated: bool
    original_text: str
    translated_text: str
    translation_confidence: float


class CategoryAnalysis(BaseModel):
    category: str
    subcategory: str
    category_confidence: float


class SentimentAnalysis(BaseModel):
    sentiment_score: float
    sentiment_label: str


class SeverityAnalysis(BaseModel):
    severity_score: int
    severity_level: str
    risk_type: str
    matched_keywords: list[str]


class Entities(BaseModel):
    location: str
    landmark: str


class DepartmentProbability(BaseModel):
    department: str
    probability: float


class ExplainabilityComponent(BaseModel):
    name: str
    raw_value: float
    weight: float
    weighted_value: float

class Explainability(BaseModel):
    components: list[ExplainabilityComponent]
    total_before_clamp: float

class PriorityScoring(BaseModel):
    priority_score: float
    risk_tier: str
    explainability: Explainability


class AnalysisResponse(BaseModel):
    language_detection: LanguageDetection
    translation: Translation
    category_analysis: CategoryAnalysis
    sentiment_analysis: SentimentAnalysis
    severity_analysis: SeverityAnalysis
    extracted_keywords: list[str]
    entities: Entities
    department_probabilities: list[DepartmentProbability]
    priority_scoring: PriorityScoring
    summary: str = Field(
        default="", description="GPT-generated admin summary of the analysis"
    )
    processing_time_ms: float = Field(
        description="Total pipeline processing time in milliseconds"
    )


# ─── Endpoints ────────────────────────────────────────────

from fastapi.responses import PlainTextResponse, FileResponse
from engine.report_generator import generate_pdf_report
import tempfile
import time
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: ComplaintRequest):
    """
    Analyze a citizen complaint through the full NLP pipeline.

    Pipeline stages:
    1. Language Detection (fastText)
    2. Translation (IndicTrans2 dictionary)
    3. Category Classification (Grok API — simulating BART zero-shot)
    4. Sentiment Analysis (Grok API — simulating RoBERTa)
    5. Severity Detection (Rule-based)
    6. Keyword Extraction
    7. Named Entity Recognition (spaCy)
    8. Department Routing

    Returns strict JSON with all analysis results including admin summary.
    """
    try:
        start_time = time.time()
        result = analyze_complaint(request.complaint)
        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        result["processing_time_ms"] = elapsed_ms
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")



@app.post("/analyze/report", response_class=FileResponse)
async def analyze_and_report(request: ComplaintRequest):
    """
    Analyze a citizen complaint and return a professional PDF report.
    """
    try:
        start_time = time.time()
        result = analyze_complaint(request.complaint)
        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        result["processing_time_ms"] = elapsed_ms
        
        pdf_path = generate_pdf_report(result)
        
        return FileResponse(
            path=pdf_path,
            filename=f"civic_intelligence_report_{int(time.time())}.pdf",
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")



@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Civic Grievance Intelligence Engine"}


@app.get("/schema")
async def get_schema():
    """Return the output JSON schema for integration reference."""
    return AnalysisResponse.model_json_schema()


# ─── Startup Event ────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Pre-load local models on server startup."""
    print("=" * 60)
    print("  Civic Grievance Intelligence Engine")
    print("  Starting model pre-loading...")
    print("=" * 60)

    try:
        # Pre-load spaCy NER model
        from engine.entity_recognizer import _ensure_model as load_ner
        load_ner()

        print("=" * 60)
        print("  Local models loaded successfully!")
        print("  Grok API ready for classification & sentiment.")
        print("  Server ready at http://localhost:8000")
        print("  API docs at http://localhost:8000/docs")
        print("=" * 60)
    except Exception as e:
        print(f"[WARNING] Model pre-loading failed: {e}")
        print("Models will load on first request instead.")