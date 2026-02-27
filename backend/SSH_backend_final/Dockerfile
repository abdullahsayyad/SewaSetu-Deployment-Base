# ───────────────────────────────────────────────────────────
# CivicAI Backend — Dockerfile
# FastAPI + spaCy + fastText NLP Pipeline
# ───────────────────────────────────────────────────────────
FROM python:3.11-slim AS base

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies required for spaCy and fastText compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Install Python dependencies (cached layer) ──────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download spaCy English model at build time
RUN python -m spacy download en_core_web_sm

# ─── Copy application code ───────────────────────────────
COPY . .

# Ensure the fastText model directory exists
# The lid.176.bin model (131MB) must be present in models/
RUN test -f models/lid.176.bin || echo "WARNING: fastText model not found in models/"

# ─── Expose and Run ──────────────────────────────────────
EXPOSE 8000

# Production server with 4 workers
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
