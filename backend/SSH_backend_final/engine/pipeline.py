# """
# Pipeline Orchestrator
# ======================
# Orchestrates all 8 NLP pipeline stages in sequence:

# 1. Language Detection (fastText)
# 2. Translation (IndicTrans2 / dictionary fallback)
# 3. Category Classification (BART zero-shot)
# 4. Sentiment Analysis (RoBERTa)
# 5. Severity Detection (Rule-based)
# 6. Keyword Extraction
# 7. Named Entity Recognition (spaCy)
# 8. Department Routing (Rule + probability)

# Returns the strict JSON output defined by the system spec.
# """

# from engine.language_detector import detect_language
# from engine.translator import translate
# from engine.category_classifier import classify
# from engine.sentiment_analyzer import analyze_sentiment
# from engine.severity_detector import detect_severity
# from engine.keyword_extractor import extract_keywords
# from engine.entity_recognizer import recognize_entities
# import time


# def analyze_complaint(text: str) -> dict:
#     """
#     Run the full NLP pipeline on a citizen complaint.

#     Args:
#         text: Raw complaint text (any language)

#     Returns:
#         Strict JSON output with all 8 analysis stages.
#     """
#     # ─── Stage 1: Language Detection ──────────────────────────
#     language_result = detect_language(text)

#     # ─── Stage 2: Translation ─────────────────────────────────
#     translation_result = translate(text, language_result["detected_language"])

#     # Use translated text for all downstream analysis
#     analysis_text = translation_result["translated_text"]

#     # ─── Stage 3: Category Classification ─────────────────────
#     category_result = classify(analysis_text)

#     # ─── Stage 4: Sentiment Analysis ──────────────────────────
#     sentiment_result = analyze_sentiment(analysis_text)

#     # ─── Stage 5: Severity Detection ──────────────────────────
#     severity_result = detect_severity(analysis_text)

#     # ─── Stage 6: Keyword Extraction ──────────────────────────
#     keywords = extract_keywords(analysis_text)

#     # ─── Stage 7: Named Entity Recognition ────────────────────
#     entities = recognize_entities(analysis_text)

#     # ─── Stage 8: Department Routing (Now directly from AI) ───
#     departments = category_result.pop("department_probabilities", [])

#     # ─── Stage 9: Priority Scoring (Phase 2 Integration) ──────
#     from engine.priority_scorer import compute_priority_score
#     priority_scoring = compute_priority_score(
#         severity_score=severity_result.get("severity_score", 0),
#         sentiment_score=sentiment_result.get("sentiment_score", 0.0),
#         category_confidence=category_result.get("category_confidence", 0.0),
#         location=entities.get("location", ""),
#         landmark=entities.get("landmark", ""),
#         extracted_keywords=keywords
#     )

#     # ─── Assemble Final Output ────────────────────────────────
#     return {
#         "language_detection": language_result,
#         "translation": translation_result,
#         "category_analysis": category_result,
#         "sentiment_analysis": sentiment_result,
#         "severity_analysis": severity_result,
#         "extracted_keywords": keywords,
#         "entities": entities,
#         "department_probabilities": departments,
#         "priority_scoring": priority_scoring,
#     }
"""
Pipeline Orchestrator
======================
Orchestrates all 8 NLP pipeline stages in sequence:

1. Language Detection (fastText)
2. Translation (IndicTrans2 / dictionary fallback)
3. Category Classification (BART zero-shot)
4. Sentiment Analysis (RoBERTa)
5. Severity Detection (Rule-based)
6. Keyword Extraction
7. Named Entity Recognition (spaCy)
8. Department Routing (Rule + probability)

Returns the strict JSON output defined by the system spec.
"""

from engine.language_detector import detect_language
from engine.translator import translate
from engine.category_classifier import classify
from engine.sentiment_analyzer import analyze_sentiment
from engine.severity_detector import detect_severity
from engine.keyword_extractor import extract_keywords
from engine.entity_recognizer import recognize_entities
from engine.summary_generator import generate_summary
import time


def analyze_complaint(text: str) -> dict:
    """
    Run the full NLP pipeline on a citizen complaint.

    Args:
        text: Raw complaint text (any language)

    Returns:
        Strict JSON output with all analysis stages.
    """
    # ─── Stage 1: Language Detection ──────────────────────────
    language_result = detect_language(text)

    # ─── Stage 2: Translation ─────────────────────────────────
    translation_result = translate(text, language_result["detected_language"])

    # Use translated text for all downstream analysis
    analysis_text = translation_result["translated_text"]

    # ─── Stage 3: Category Classification ─────────────────────
    category_result = classify(analysis_text)

    # ─── Stage 4: Sentiment Analysis ──────────────────────────
    sentiment_result = analyze_sentiment(analysis_text)

    # ─── Stage 5: Severity Detection ──────────────────────────
    severity_result = detect_severity(analysis_text)

    # ─── Stage 6: Keyword Extraction ──────────────────────────
    keywords = extract_keywords(analysis_text)

    # ─── Stage 7: Named Entity Recognition ────────────────────
    entities = recognize_entities(analysis_text)

    # ─── Stage 8: Department Routing (Now directly from AI) ───
    departments = category_result.pop("department_probabilities", [])

    # ─── Stage 9: Priority Scoring (Phase 2 Integration) ──────
    from engine.priority_scorer import compute_priority_score
    priority_scoring = compute_priority_score(
        severity_score=severity_result.get("severity_score", 0),
        sentiment_score=sentiment_result.get("sentiment_score", 0.0),
        category_confidence=category_result.get("category_confidence", 0.0),
        location=entities.get("location", ""),
        landmark=entities.get("landmark", ""),
        extracted_keywords=keywords
    )

    # ─── Assemble Final Output ────────────────────────────────
    result = {
        "language_detection": language_result,
        "translation": translation_result,
        "category_analysis": category_result,
        "sentiment_analysis": sentiment_result,
        "severity_analysis": severity_result,
        "extracted_keywords": keywords,
        "entities": entities,
        "department_probabilities": departments,
        "priority_scoring": priority_scoring,
    }
    result["summary"] = generate_summary(result)
    return result