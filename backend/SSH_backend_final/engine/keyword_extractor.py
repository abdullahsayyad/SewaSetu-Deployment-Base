"""
Keyword Extractor
==================
Extracts important risk-related keywords from the complaint text.
Uses a curated risk/civic keyword list combined with basic frequency analysis.
"""

import re
from collections import Counter

# Risk-related keywords to look for
RISK_KEYWORDS = {
    # Infrastructure
    "pothole", "potholes", "road damage", "broken road", "cracked", "sinkhole",
    "bridge collapse", "bridge", "streetlight", "traffic signal",

    # Electricity
    "power outage", "power cut", "blackout", "live wire", "open wire", "dead open wire", "transformer",
    "electrocution", "voltage", "voltage fluctuation", "electric pole",
    "power failure", "short circuit",

    # Water
    "water shortage", "no water supply", "pipeline", "leakage", "leak",
    "sewage", "sewage overflow", "flooding", "waterlogging", "drain",
    "contaminated water", "dirty water", "pipeline burst",

    # Sanitation
    "garbage", "waste", "dumping", "open dumping", "blocked drain",
    "mosquito", "mosquito breeding", "unhygienic", "filth", "stench",

    # Health
    "contamination", "disease", "infection", "hospital", "unsafe food",
    "food poisoning", "epidemic", "health hazard", "outbreak",

    # Safety
    "fire", "explosion", "collapse", "accident", "injured", "death", "dead", "killed",
    "gas leak", "dangerous", "hazardous", "emergency", "critical",
    "threat", "injury", "bribe", "corruption", "illegal",
    "life threatening",

    # Environment
    "tree fall", "fallen tree", "air pollution", "noise pollution",
    "pollution", "smoke", "dust", "toxic",

    # Transport
    "bus delay", "traffic jam", "road accident", "traffic congestion",
    "broken signal",
}

# Common stop words to filter out
STOP_WORDS = {
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "don", "now", "and", "but", "or", "if", "this", "that", "these",
    "those", "i", "me", "my", "we", "our", "you", "your", "he", "him",
    "she", "her", "it", "its", "they", "them", "their", "what", "which",
    "who", "whom", "please", "also", "about", "up",
}


def extract_keywords(text: str) -> list:
    """
    Extract risk-related keywords from the complaint text.

    Strategy:
    1. Match against known risk keyword list
    2. Extract remaining high-frequency meaningful words

    Returns:
        ["pothole", "accident", "injured", "MG Road"]
    """
    text_lower = text.lower()
    extracted = []

    # Phase 1: Match known risk keywords (longest first)
    sorted_keywords = sorted(RISK_KEYWORDS, key=len, reverse=True)
    for keyword in sorted_keywords:
        if keyword in text_lower:
            escaped_kw = r'\s+'.join(re.escape(w) for w in keyword.split())
            pattern = r'\b' + escaped_kw + r'\b'
            if re.search(pattern, text_lower):
                extracted.append(keyword)

    # Phase 2: Extract additional meaningful words via frequency
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text)
    word_freq = Counter(w.lower() for w in words if w.lower() not in STOP_WORDS)

    # Add frequent words not already captured
    existing = set(kw.lower() for kw in extracted)
    for word, freq in word_freq.most_common(10):
        if word not in existing and word not in STOP_WORDS:
            # Keep original case from text
            for w in words:
                if w.lower() == word:
                    extracted.append(w)
                    break

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for kw in extracted:
        if kw.lower() not in seen:
            seen.add(kw.lower())
            unique.append(kw)

    return unique[:15]  # Cap at 15 keywords
