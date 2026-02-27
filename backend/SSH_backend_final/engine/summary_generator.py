
"""
Summary Generator — OpenAI API (gpt-4o-mini)
==============================================
Generates a concise admin-facing summary of the
entire analysis pipeline output using GPT.
"""

import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

_client = None


def _ensure_client():
    global _client
    if _client is not None:
        return
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables")
    _client = OpenAI(api_key=api_key)
    print("[SummaryGenerator] OpenAI client initialized.")


def generate_summary(analysis_data: dict) -> str:
    """
    Generate a concise, professional summary paragraph from the full analysis JSON.
    Designed for admin dashboard display.
    """
    _ensure_client()

    # Build a compact version of the data for the prompt
    compact = {
        "complaint": analysis_data.get("translation", {}).get("original_text", "N/A"),
        "category": analysis_data.get("category_analysis", {}).get("category", "N/A"),
        "subcategory": analysis_data.get("category_analysis", {}).get("subcategory", "N/A"),
        "severity_level": analysis_data.get("severity_analysis", {}).get("severity_level", "N/A"),
        "risk_type": analysis_data.get("severity_analysis", {}).get("risk_type", "N/A"),
        "sentiment": analysis_data.get("sentiment_analysis", {}).get("sentiment_label", "N/A"),
        "priority_score": analysis_data.get("priority_scoring", {}).get("priority_score", 0),
        "risk_tier": analysis_data.get("priority_scoring", {}).get("risk_tier", "N/A"),
        "departments": [d.get("department") for d in analysis_data.get("department_probabilities", [])],
        "location": analysis_data.get("entities", {}).get("location", ""),
        "keywords": analysis_data.get("extracted_keywords", []),
    }

    prompt = f"""You are an AI assistant for a government civic grievance system.

Given the following analysis data of a citizen complaint, write a SHORT professional summary (3-5 sentences max) for the admin dashboard.

The summary must:
- State the nature of the complaint clearly
- Mention the severity and risk tier
- Note the recommended department(s) for routing
- Mention location if available
- Be written in formal, concise language suitable for a government official

Analysis Data:
{json.dumps(compact, indent=2)}

Return ONLY the summary text, no quotes, no markdown, no extra formatting."""

    try:
        response = _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a concise government report writer. Output plain text only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[SummaryGenerator] OpenAI API error: {e}")
        # Fallback: generate a basic summary without GPT
        dept_list = ", ".join(compact["departments"][:3]) if compact["departments"] else "Unassigned"
        return (
            f"Complaint classified as {compact['category']} ({compact['subcategory']}) "
            f"with {compact['severity_level']} severity ({compact['risk_tier']} risk, "
            f"score {compact['priority_score']:.2f}/100). "
            f"Recommended routing: {dept_list}."
        )