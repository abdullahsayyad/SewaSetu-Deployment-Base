# """
# Priority Scorer — Phase 2 Risk Scoring
# ========================================
# Weighted, explainable, rule-based priority computation.
# """

# from typing import Dict, Any, List

# # ── Configuration Weights & Tiers ──
# WEIGHTS = {
#     "severity": 0.35,
#     "sentiment": 0.20,
#     "location_risk": 0.15,
#     "confidence": 0.15,
#     "keyword_risk": 0.15,
# }

# RISK_TIERS = {
#     "low_max": 0.3,
#     "medium_max": 0.6,
#     "high_max": 0.8,
# }

# SENSITIVE_LOCATIONS = {
#     "mumbai": 0.7, "delhi": 0.8, "chennai": 0.6, "kolkata": 0.6,
#     "bangalore": 0.5, "hyderabad": 0.5, "pune": 0.4, "lucknow": 0.5,
#     "jaipur": 0.4, "ahmedabad": 0.4, "slum area": 0.9, "industrial zone": 0.8,
#     "flood zone": 1.0, "earthquake zone": 1.0, "border area": 0.9,
# }

# SENSITIVE_LANDMARKS = {
#     "hospital": 0.9, "school": 0.9, "government office": 0.7,
#     "railway station": 0.7, "bus stand": 0.5, "temple": 0.6,
#     "mosque": 0.6, "church": 0.6, "market": 0.5, "dam": 0.8,
#     "power plant": 0.9, "water treatment plant": 0.9,
# }

# HIGH_RISK_KEYWORDS = {
#     "death": 1.0, "fire": 0.9, "flood": 0.9, "collapse": 0.9,
#     "explosion": 1.0, "electrocution": 1.0, "epidemic": 1.0,
#     "outbreak": 0.9, "contamination": 0.8, "hazardous": 0.8,
#     "emergency": 0.8, "dangerous": 0.7, "injury": 0.7,
#     "threat": 0.6, "corruption": 0.6, "bribe": 0.6,
#     "illegal": 0.6, "pollution": 0.5, "sewage": 0.5,
#     "broken": 0.3, "delay": 0.2, "pothole": 0.3,
#     "garbage": 0.4, "stench": 0.4, "dead": 1.0, 
#     "open wire": 1.0, "live wire": 1.0, "dead open wire": 1.0,
# }

# def _normalize_string(s: str) -> str:
#     return str(s).lower().strip() if s else ""

# def _round(val: float) -> float:
#     return round(val, 4)

# def normalize_severity(score: int) -> float:
#     """Normalize 0-10 severity score to 0-1."""
#     return min(1.0, max(0.0, score / 10.0))

# def sentiment_to_urgency(score: float) -> float:
#     """Convert sentiment (-1 to 1) to urgency (0 to 1). Negative is high urgency."""
#     return min(1.0, max(0.0, -score))

# def compute_location_risk(location: str, landmark: str) -> Dict[str, Any]:
#     loc = _normalize_string(location)
#     lm = _normalize_string(landmark)
    
#     loc_risk = 0.0
#     lm_risk = 0.0
#     parts = []
    
#     if loc in SENSITIVE_LOCATIONS:
#         loc_risk = SENSITIVE_LOCATIONS[loc]
#         parts.append(f'location "{loc}" risk={loc_risk}')
#     elif loc:
#         for key, val in SENSITIVE_LOCATIONS.items():
#             if key in loc or loc in key:
#                 loc_risk = max(loc_risk, val)
#                 parts.append(f'location partial-match "{key}" risk={val}')

#     if lm in SENSITIVE_LANDMARKS:
#         lm_risk = SENSITIVE_LANDMARKS[lm]
#         parts.append(f'landmark "{lm}" risk={lm_risk}')
#     elif lm:
#         for key, val in SENSITIVE_LANDMARKS.items():
#             if key in lm or lm in key:
#                 lm_risk = max(lm_risk, val)
#                 parts.append(f'landmark partial-match "{key}" risk={val}')
                
#     combined = max(loc_risk, lm_risk)
#     if loc_risk > 0 and lm_risk > 0:
#         combined = min(1.0, combined + 0.1)
#         parts.append("both-present bonus +0.1")
        
#     return {
#         "risk": _round(combined),
#         "details": "; ".join(parts) if parts else "no sensitive location/landmark match"
#     }

# def compute_keyword_risk(keywords: List[str]) -> Dict[str, Any]:
#     if not keywords:
#         return {"risk": 0.0, "matched": []}
        
#     matched = []
#     max_risk = 0.0
    
#     for kw in keywords:
#         normalized = _normalize_string(kw)
#         if normalized in HIGH_RISK_KEYWORDS:
#             val = HIGH_RISK_KEYWORDS[normalized]
#             max_risk = max(max_risk, val)
#             matched.append(f"{normalized}({val})")
#         else:
#             for key, val in HIGH_RISK_KEYWORDS.items():
#                 if key in normalized or normalized in key:
#                     max_risk = max(max_risk, val)
#                     matched.append(f"{normalized}~{key}({val})")
#                     break
                    
#     return {"risk": _round(max_risk), "matched": matched}

# def classify_risk_tier(score: float) -> str:
#     if score <= RISK_TIERS["low_max"]:
#         return "Low"
#     if score <= RISK_TIERS["medium_max"]:
#         return "Medium"
#     if score <= RISK_TIERS["high_max"]:
#         return "High"
#     return "Critical"

# def compute_priority_score(
#     severity_score: int,
#     sentiment_score: float,
#     category_confidence: float,
#     location: str,
#     landmark: str,
#     extracted_keywords: List[str]
# ) -> Dict[str, Any]:
#     """
#     Computes Phase 2 Priority Score.
#     """
#     severity = normalize_severity(severity_score)
#     sentiment_urgency = sentiment_to_urgency(sentiment_score)
#     confidence = float(category_confidence)
    
#     location_result = compute_location_risk(location, landmark)
#     keyword_result = compute_keyword_risk(extracted_keywords)
    
#     components = [
#         {
#             "name": "severity",
#             "raw_value": _round(severity),
#             "weight": WEIGHTS["severity"],
#             "weighted_value": _round(WEIGHTS["severity"] * severity)
#         },
#         {
#             "name": "sentiment_urgency",
#             "raw_value": _round(sentiment_urgency),
#             "weight": WEIGHTS["sentiment"],
#             "weighted_value": _round(WEIGHTS["sentiment"] * sentiment_urgency)
#         },
#         {
#             "name": "location_risk",
#             "raw_value": location_result["risk"],
#             "weight": WEIGHTS["location_risk"],
#             "weighted_value": _round(WEIGHTS["location_risk"] * location_result["risk"])
#         },
#         {
#             "name": "category_confidence",
#             "raw_value": _round(confidence),
#             "weight": WEIGHTS["confidence"],
#             "weighted_value": _round(WEIGHTS["confidence"] * confidence)
#         },
#         {
#             "name": "keyword_risk",
#             "raw_value": keyword_result["risk"],
#             "weight": WEIGHTS["keyword_risk"],
#             "weighted_value": _round(WEIGHTS["keyword_risk"] * keyword_result["risk"])
#         }
#     ]
    
#     total_before_clamp = sum(c["weighted_value"] for c in components)
#     priority_score = _round(min(1.0, max(0.0, total_before_clamp)))
    
#     risk_tier = classify_risk_tier(priority_score)
    
#     return {
#         "priority_score": priority_score,
#         "risk_tier": risk_tier,
#         "explainability": {
#             "components": components,
#             "total_before_clamp": _round(total_before_clamp)
#         }
#     }



"""
Priority Scorer — Phase 2 Risk Scoring
========================================
Weighted, explainable, rule-based priority computation.
"""

from typing import Dict, Any, List

# ── Configuration Weights & Tiers ──
WEIGHTS = {
    "severity": 0.35,
    "sentiment": 0.20,
    "location_risk": 0.15,
    "confidence": 0.15,
    "keyword_risk": 0.15,
}

RISK_TIERS = {
    "low_max": 0.3,
    "medium_max": 0.6,
    "high_max": 0.8,
}

SENSITIVE_LOCATIONS = {
    "mumbai": 0.7, "delhi": 0.8, "chennai": 0.6, "kolkata": 0.6,
    "bangalore": 0.5, "hyderabad": 0.5, "pune": 0.4, "lucknow": 0.5,
    "jaipur": 0.4, "ahmedabad": 0.4, "slum area": 0.9, "industrial zone": 0.8,
    "flood zone": 1.0, "earthquake zone": 1.0, "border area": 0.9,
}

SENSITIVE_LANDMARKS = {
    "hospital": 0.9, "school": 0.9, "government office": 0.7,
    "railway station": 0.7, "bus stand": 0.5, "temple": 0.6,
    "mosque": 0.6, "church": 0.6, "market": 0.5, "dam": 0.8,
    "power plant": 0.9, "water treatment plant": 0.9,
}

HIGH_RISK_KEYWORDS = {
    "death": 1.0, "fire": 0.9, "flood": 0.9, "collapse": 0.9,
    "explosion": 1.0, "electrocution": 1.0, "epidemic": 1.0,
    "outbreak": 0.9, "contamination": 0.8, "hazardous": 0.8,
    "emergency": 0.8, "dangerous": 0.7, "injury": 0.7,
    "threat": 0.6, "corruption": 0.6, "bribe": 0.6,
    "illegal": 0.6, "pollution": 0.5, "sewage": 0.5,
    "broken": 0.3, "delay": 0.2, "pothole": 0.3,
    "garbage": 0.4, "stench": 0.4, "dead": 1.0, 
    "open wire": 1.0, "live wire": 1.0, "dead open wire": 1.0,
    "breathing": 1.0, "difficulty breathing": 1.0, "choking": 0.9,
    "child": 0.5, "infant": 0.6, "baby": 0.6,
}

def _normalize_string(s: str) -> str:
    return str(s).lower().strip() if s else ""

def _round(val: float) -> float:
    return round(val, 4)

def normalize_severity(score: int) -> float:
    """Normalize 1-5 severity scale to 0-1 (using 5.0 max)."""
    return min(1.0, max(0.0, score / 5.0))

def sentiment_to_urgency(score: float) -> float:
    """Convert sentiment (-1 to 1) to urgency (0 to 1). Negative is high urgency."""
    return min(1.0, max(0.0, -score))

def compute_location_risk(location: str, landmark: str) -> Dict[str, Any]:
    loc = _normalize_string(location)
    lm = _normalize_string(landmark)
    
    loc_risk = 0.0
    lm_risk = 0.0
    parts = []
    
    if loc in SENSITIVE_LOCATIONS:
        loc_risk = SENSITIVE_LOCATIONS[loc]
        parts.append(f'location "{loc}" risk={loc_risk}')
    elif loc:
        for key, val in SENSITIVE_LOCATIONS.items():
            if key in loc or loc in key:
                loc_risk = max(loc_risk, val)
                parts.append(f'location partial-match "{key}" risk={val}')

    if lm in SENSITIVE_LANDMARKS:
        lm_risk = SENSITIVE_LANDMARKS[lm]
        parts.append(f'landmark "{lm}" risk={lm_risk}')
    elif lm:
        for key, val in SENSITIVE_LANDMARKS.items():
            if key in lm or lm in key:
                lm_risk = max(lm_risk, val)
                parts.append(f'landmark partial-match "{key}" risk={val}')
                
    combined = max(loc_risk, lm_risk)
    if loc_risk > 0 and lm_risk > 0:
        combined = min(1.0, combined + 0.1)
        parts.append("both-present bonus +0.1")
        
    return {
        "risk": _round(combined),
        "details": "; ".join(parts) if parts else "no sensitive location/landmark match"
    }

def compute_keyword_risk(keywords: List[str]) -> Dict[str, Any]:
    if not keywords:
        return {"risk": 0.0, "matched": []}
        
    matched = []
    max_risk = 0.0
    
    for kw in keywords:
        normalized = _normalize_string(kw)
        if normalized in HIGH_RISK_KEYWORDS:
            val = HIGH_RISK_KEYWORDS[normalized]
            max_risk = max(max_risk, val)
            matched.append(f"{normalized}({val})")
        else:
            for key, val in HIGH_RISK_KEYWORDS.items():
                if key in normalized or normalized in key:
                    max_risk = max(max_risk, val)
                    matched.append(f"{normalized}~{key}({val})")
                    break
                    
    return {"risk": _round(max_risk), "matched": matched}

def classify_risk_tier(score: float) -> str:
    if score <= RISK_TIERS["low_max"]:
        return "Low"
    if score <= RISK_TIERS["medium_max"]:
        return "Medium"
    if score <= RISK_TIERS["high_max"]:
        return "High"
    return "Critical"

def compute_priority_score(
    severity_score: int,
    sentiment_score: float,
    category_confidence: float,
    location: str,
    landmark: str,
    extracted_keywords: List[str]
) -> Dict[str, Any]:
    """
    Computes Phase 2 Priority Score.
    """
    severity = normalize_severity(severity_score)
    sentiment_urgency = sentiment_to_urgency(sentiment_score)
    confidence = float(category_confidence)
    
    location_result = compute_location_risk(location, landmark)
    keyword_result = compute_keyword_risk(extracted_keywords)
    
    components = [
        {
            "name": "severity",
            "raw_value": _round(severity),
            "weight": WEIGHTS["severity"],
            "weighted_value": _round(WEIGHTS["severity"] * severity)
        },
        {
            "name": "sentiment_urgency",
            "raw_value": _round(sentiment_urgency),
            "weight": WEIGHTS["sentiment"],
            "weighted_value": _round(WEIGHTS["sentiment"] * sentiment_urgency)
        },
        {
            "name": "location_risk",
            "raw_value": location_result["risk"],
            "weight": WEIGHTS["location_risk"],
            "weighted_value": _round(WEIGHTS["location_risk"] * location_result["risk"])
        },
        {
            "name": "category_confidence",
            "raw_value": _round(confidence),
            "weight": WEIGHTS["confidence"],
            "weighted_value": _round(WEIGHTS["confidence"] * confidence)
        },
        {
            "name": "keyword_risk",
            "raw_value": keyword_result["risk"],
            "weight": WEIGHTS["keyword_risk"],
            "weighted_value": _round(WEIGHTS["keyword_risk"] * keyword_result["risk"])
        }
    ]
    
    total_before_clamp = sum(c["weighted_value"] for c in components)
    priority_score = _round(min(1.0, max(0.0, total_before_clamp)))
    
    risk_tier = classify_risk_tier(priority_score)
    
    return {
        "priority_score": priority_score,
        "risk_tier": risk_tier,
        "explainability": {
            "components": components,
            "total_before_clamp": _round(total_before_clamp)
        }
    }