"""
Translation Module — OpenAI API (gpt-4o-mini)
=============================================
Handles translation of non-English complaints to English using AI.
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
    print("[Translator] OpenAI client initialized.")


def translate(text: str, detected_language: str) -> dict:
    """
    Translate non-English text to English.

    Returns:
        {
            "was_translated": bool,
            "original_text": str,
            "translated_text": str,
            "translation_confidence": float
        }
    """
    if detected_language == "en" or not text.strip():
        return {
            "was_translated": False,
            "original_text": text,
            "translated_text": text.strip(),
            "translation_confidence": 1.0
        }

    _ensure_client()

    prompt = f"""You are a professional translator for a civic grievance system.

Translate the following {detected_language} complaint into fluent, clear English. Keep the tone identical to the original text.

Original text:
\"{text}\"

Return ONLY a strict JSON object with:
- "translated_text": The English translation.
- "translation_confidence": A float between 0.0 and 1.0 indicating how confident you are that the translation captures the exact meaning.

Example:
{{"translated_text": "There is a massive pothole causing accidents.", "translation_confidence": 0.98}}"""

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
                temperature=0.1,
                max_tokens=600,
                timeout=15,
            )

            content = response.choices[0].message.content.strip()
            result = json.loads(content)
            
            trans_text = str(result.get("translated_text", text)).strip()
            conf = float(result.get("translation_confidence", 0.95))

            return {
                "was_translated": True,
                "original_text": text,
                "translated_text": trans_text,
                "translation_confidence": round(conf, 4)
            }

        except Exception as e:
            error_str = str(e).lower()
            if ("rate" in error_str or "429" in error_str or "quota" in error_str) and attempt < max_retries - 1:
                wait_time = 5 * (attempt + 1)
                print(f"[Translator] Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"[Translator] OpenAI API error: {e}")
                # Fallback to passing through the original text
                return {
                    "was_translated": False,
                    "original_text": text,
                    "translated_text": text,
                    "translation_confidence": 0.0
                }
