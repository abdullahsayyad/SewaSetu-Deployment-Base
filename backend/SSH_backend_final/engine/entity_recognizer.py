"""
Named Entity Recognizer — spaCy NER
=====================================
Uses spaCy's NER pipeline to extract location and landmark entities
from complaint text.

Model: en_core_web_sm (small English model)
"""

import re
import spacy

_nlp = None


def _ensure_model():
    """Load the spaCy English model."""
    global _nlp
    if _nlp is not None:
        return

    try:
        _nlp = spacy.load("en_core_web_sm")
        print("[EntityRecognizer] spaCy en_core_web_sm loaded successfully.")
    except OSError:
        print("[EntityRecognizer] Downloading spaCy en_core_web_sm model...")
        from spacy.cli import download
        download("en_core_web_sm")
        _nlp = spacy.load("en_core_web_sm")
        print("[EntityRecognizer] Model loaded successfully.")


# Patterns for Indian location names and landmarks
LANDMARK_PATTERNS = [
    r'\b(?:near|opposite|behind|beside|adjacent to|in front of|next to)\s+(.+?)(?:\.|,|$)',
]

LANDMARK_KEYWORDS = [
    "school", "hospital", "station", "railway station", "bus stop", "bus stand",
    "temple", "church", "mosque", "gurudwara", "college", "university",
    "market", "mall", "park", "garden", "police station", "post office",
    "bank", "atm", "petrol pump", "gas station", "cinema", "theater",
    "court", "library", "stadium", "ground", "playground",
    "vidyalaya", "kendriya vidyalaya", "masjid", "mandir",
]

LOCATION_INDICATORS = [
    "road", "street", "lane", "avenue", "boulevard", "highway",
    "nagar", "puri", "pur", "bad", "abad", "wadi", "peth",
    "colony", "sector", "block", "ward", "area", "locality",
    "chowk", "chawk", "circle", "square", "main road",
    "cross", "layout", "extension", "phase", "stage",
    "NH", "SH", "MG Road", "GT Road",
]


def recognize_entities(text: str) -> dict:
    """
    Extract location and landmark entities from complaint text.

    Uses spaCy NER for GPE (geopolitical entity) and LOC (location),
    supplemented with pattern matching for Indian location names.

    Returns:
        {
            "location": "MG Road, Bangalore",
            "landmark": "near City Hospital"
        }
    """
    _ensure_model()

    doc = _nlp(text)

    locations = []
    landmarks = []

    # Phase 1: spaCy NER extraction
    for ent in doc.ents:
        if ent.label_ in ("GPE", "LOC"):
            locations.append(ent.text)
        elif ent.label_ in ("FAC", "ORG"):
            # Facilities and organizations can be landmarks
            landmarks.append(ent.text)

    # Phase 2: Pattern matching for landmarks
    text_lower = text.lower()
    for pattern in LANDMARK_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            match = match.strip()
            if match and len(match) > 2:
                landmarks.append(match)

    # Phase 3: Keyword matching for landmark types
    for keyword in LANDMARK_KEYWORDS:
        pattern = r'\b\w+\s+' + re.escape(keyword) + r'\b'
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if match.strip() not in landmarks:
                landmarks.append(match.strip())

    # Phase 4: Location indicator matching
    for indicator in LOCATION_INDICATORS:
        pattern = r'\b\w+[\s-]+' + re.escape(indicator) + r'\b'
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if match.strip() not in locations:
                locations.append(match.strip())

    # Deduplicate and pick best match
    location = ", ".join(dict.fromkeys(locations)) if locations else ""
    landmark = landmarks[0] if landmarks else ""

    # Clean up
    location = location.strip(", ").strip()
    landmark = landmark.strip(", ").strip()

    return {
        "location": location,
        "landmark": landmark
    }
