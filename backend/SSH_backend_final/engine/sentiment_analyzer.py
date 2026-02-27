"""
Sentiment Analyzer — OpenAI API (gpt-4o-mini)
=============================================
Uses OpenAI's model for sentiment analysis of complaint text.

Model: gpt-4o-mini

Outputs a score between -1.0 (very negative) and +1.0 (very positive).
"""

import os
import json
import time
from dotenv import load_dotenv
from openai import OpenAI
from engine.config import OPENAI_API_KEY

_client = None


def _ensure_client():
    """Initialize the OpenAI client."""
    global _client
    if _client is not None:
        return

    _client = OpenAI(api_key=OPENAI_API_KEY)
    print("[SentimentAnalyzer] OpenAI client initialized.")


def analyze_sentiment(text: str) -> dict:
    """
    Analyze the sentiment of the complaint text.

    Returns:
        {
            "sentiment_score": -0.85,
            "sentiment_label": "Very Negative"
        }
    """
    _ensure_client()

    if not text.strip():
        return {
            "sentiment_score": 0.0,
            "sentiment_label": "Neutral"
        }

    prompt = f"""You are a sentiment analyzer for citizen complaints, simulating RoBERTa sentiment model output.

Analyze this complaint's sentiment:
"{text}"

Rules:
- sentiment_score: float between -1.0 (very negative) and +1.0 (very positive)
- Most civic complaints are negative (-0.5 to -0.9)
- Urgent/dangerous complaints are very negative (-0.8 to -0.95)
- Neutral informational reports: around -0.2 to 0.0
- sentiment_label: one of "Very Negative", "Negative", "Neutral", "Positive", "Very Positive"

Examples:
"pothole causing accidents, people injured" → {{"sentiment_score": -0.88, "sentiment_label": "Very Negative"}}
"garbage not collected for weeks" → {{"sentiment_score": -0.65, "sentiment_label": "Negative"}}
"streetlight fixed, thank you" → {{"sentiment_score": 0.72, "sentiment_label": "Positive"}}
"requesting information about water schedule" → {{"sentiment_score": -0.1, "sentiment_label": "Neutral"}}

Return ONLY this JSON, no other text:
{{"sentiment_score": 0.0, "sentiment_label": ""}}"""

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = _client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You are a JSON-only API. Output strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.05,
                max_tokens=60,
            )

            content = response.choices[0].message.content.strip()

            result = json.loads(content)

            # Validate score
            score = float(result.get("sentiment_score", 0.0))
            score = max(-1.0, min(1.0, score))

            # Validate label
            valid_labels = ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
            label = result.get("sentiment_label", "Neutral")
            if label not in valid_labels:
                if score <= -0.7:
                    label = "Very Negative"
                elif score <= -0.3:
                    label = "Negative"
                elif score <= 0.3:
                    label = "Neutral"
                elif score <= 0.7:
                    label = "Positive"
                else:
                    label = "Very Positive"

            return {
                "sentiment_score": round(score, 4),
                "sentiment_label": label
            }

        except Exception as e:
            error_str = str(e).lower()
            if ("rate" in error_str or "429" in error_str or "quota" in error_str) and attempt < max_retries - 1:
                wait_time = 15 * (attempt + 1)
                print(f"[SentimentAnalyzer] Rate limited, waiting {wait_time}s (attempt {attempt + 1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                print(f"[SentimentAnalyzer] OpenAI API error: {e}")
                return {
                    "sentiment_score": -0.5,
                    "sentiment_label": "Negative"
                }
