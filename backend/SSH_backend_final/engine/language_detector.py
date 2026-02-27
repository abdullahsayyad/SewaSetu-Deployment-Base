"""
Language Detection Module — OpenAI API (gpt-4o-mini)
======================================================
Uses OpenAI's model to dynamically detect the language 
of the input complaint text.
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
    print("[LanguageDetector] OpenAI client initialized.")


def detect_language(text: str) -> dict:
    """
    Detect the language of the given text using OpenAI.

    Returns:
        {
            "detected_language": "en",  # ISO 639-1 code
            "confidence": 0.95
        }
    """
    _ensure_client()

    if not text.strip():
        return {
            "detected_language": "en",
            "confidence": 0.0
        }

    prompt = f"""You are a language detection engine.

Detect the language of the following text:
\"{text}\"

Return ONLY a strict JSON object with:
- "detected_language": The ISO 639-1 two-letter code for the detected language (e.g., "en", "hi", "te", "mr", "ta").
- "confidence": A float between 0.0 and 1.0 indicating your confidence in the detection.

Example:
{{"detected_language": "en", "confidence": 0.99}}"""

    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"[LanguageDetector] Sending request attempt {attempt+1}...")
            response = _client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You are a JSON-only API. Output strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.0,
                max_tokens=50,
            )
            print(f"[LanguageDetector] Response received!")

            content = response.choices[0].message.content.strip()
            result = json.loads(content)
            
            # Ensure proper keys and types
            lang = str(result.get("detected_language", "en")).lower()
            conf = float(result.get("confidence", 0.95))

            return {
                "detected_language": lang[:2], # enforce 2-letters just in case
                "confidence": round(conf, 4)
            }

        except Exception as e:
            error_str = str(e).lower()
            if ("rate" in error_str or "429" in error_str or "quota" in error_str) and attempt < max_retries - 1:
                wait_time = 5 * (attempt + 1)
                print(f"[LanguageDetector] Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"[LanguageDetector] OpenAI API error: {e}")
                return {
                    "detected_language": "en",
                    "confidence": 0.5
                }
