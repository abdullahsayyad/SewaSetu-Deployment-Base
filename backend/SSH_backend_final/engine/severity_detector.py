# """
# Severity Detector — Rule-Based Weighted Framework
# ===================================================
# Detects severity of a civic complaint using keyword matching
# with predefined weights.

# Severity Levels:
# - Critical (weight 5): fire, explosion, collapse, electrocution, injured, gas leak
# - High (weight 4): live wire, flooding, accident, exposed drain, broken transformer
# - Medium (weight 3): pothole, water leakage, streetlight failure
# - Low (weight 2): garbage delay, noise complaint, minor delay
# - Minimal (weight 1): suggestion, feedback
# """


# # Severity keyword definitions with weights
# SEVERITY_KEYWORDS = {
#     # Critical — Public Safety Emergency (weight 5)
#     "fire": 5,
#     "explosion": 5,
#     "collapse": 5,
#     "collapsed": 5,
#     "electrocution": 5,
#     "electrocuted": 5,
#     "injured": 5,
#     "injury": 5,
#     "injuries": 5,
#     "gas leak": 5,
#     "death": 5,
#     "dead": 5,
#     "killed": 5,
#     "emergency": 5,
#     "life-threatening": 5,
#     "building collapse": 5,
#     "dead open wire": 5,
#     "open wire": 5,

#     # High — Hazardous Infrastructure (weight 4)
#     "live wire": 4,
#     "flooding": 4,
#     "flood": 4,
#     "accident": 4,
#     "accidents": 4,
#     "exposed drain": 4,
#     "broken transformer": 4,
#     "open manhole": 4,
#     "electrocution risk": 4,
#     "danger": 4,
#     "dangerous": 4,
#     "hazard": 4,
#     "hazardous": 4,
#     "sewage overflow": 4,
#     "contaminated": 4,
#     "contamination": 4,
#     "falling": 4,
#     "hanging wire": 4,
#     "dangling": 4,

#     # Medium — Infrastructure Risk (weight 3)
#     "pothole": 3,
#     "potholes": 3,
#     "water leakage": 3,
#     "leakage": 3,
#     "leak": 3,
#     "streetlight failure": 3,
#     "streetlight": 3,
#     "power outage": 3,
#     "power cut": 3,
#     "water shortage": 3,
#     "no water": 3,
#     "pipeline burst": 3,
#     "road damage": 3,
#     "damaged road": 3,
#     "broken road": 3,
#     "sinkhole": 3,
#     "waterlogging": 3,

#     # Low — Service Disruption (weight 2)
#     "garbage delay": 2,
#     "garbage": 2,
#     "noise complaint": 2,
#     "noise": 2,
#     "minor delay": 2,
#     "delay": 2,
#     "bus delay": 2,
#     "irregular service": 2,
#     "late collection": 2,
#     "overgrown": 2,
#     "broken bench": 2,
#     "graffiti": 2,
#     "litter": 2,
#     "mosquito": 2,
#     "mosquitoes": 2,
#     "stray animals": 2,
#     "open dumping": 2,

#     # Minimal — Advisory (weight 1)
#     "suggestion": 1,
#     "feedback": 1,
#     "request": 1,
#     "inquiry": 1,
#     "information": 1,
#     "appreciate": 1,
#     "thank": 1,
#     "improvement": 1,
# }

# # Severity levels mapping
# SEVERITY_LEVELS = {
#     5: {"level": "Critical", "risk_type": "Public Safety Emergency"},
#     4: {"level": "High", "risk_type": "Hazardous Infrastructure"},
#     3: {"level": "Medium", "risk_type": "Infrastructure Risk"},
#     2: {"level": "Low", "risk_type": "Service Disruption"},
#     1: {"level": "Minimal", "risk_type": "Advisory"},
# }


# def detect_severity(text: str) -> dict:
#     """
#     Detect the severity of a complaint using keyword matching.

#     Rules:
#     - Identify all matching severity keywords
#     - severity_score = sum of weights (capped at 10)
#     - severity_level = determined by highest matching weight
#     - risk_type = corresponding risk type for severity level

#     Returns:
#         {
#             "severity_score": 7,
#             "severity_level": "Critical",
#             "risk_type": "Public Safety Emergency",
#             "matched_keywords": ["injured", "pothole", "accident"]
#         }
#     """
#     text_lower = text.lower()
#     matched_keywords = []
#     total_weight = 0
#     highest_weight = 0

#     # Sort keywords by length (longest first) to match phrases before words
#     sorted_keywords = sorted(SEVERITY_KEYWORDS.keys(), key=len, reverse=True)

#     matched_set = set()  # Track matched positions to avoid double-counting

#     for keyword in sorted_keywords:
#         if keyword in text_lower:
#             # Check for word boundary match (avoid partial matches)
#             import re
#             # Escape the keyword, but replace spaces with \s+ to handle varying whitespace
#             escaped_kw = r'\s+'.join(re.escape(w) for w in keyword.split())
#             pattern = r'\b' + escaped_kw + r'\b'
#             if re.search(pattern, text_lower):
#                 weight = SEVERITY_KEYWORDS[keyword]
#                 matched_keywords.append(keyword)
#                 total_weight += weight

#                 if weight > highest_weight:
#                     highest_weight = weight

#     # Cap severity score at 10
#     severity_score = min(total_weight, 10)

#     # Default to Minimal if no keywords matched
#     if highest_weight == 0:
#         highest_weight = 1

#     severity_info = SEVERITY_LEVELS.get(highest_weight, SEVERITY_LEVELS[1])

#     return {
#         "severity_score": severity_score,
#         "severity_level": severity_info["level"],
#         "risk_type": severity_info["risk_type"],
#         "matched_keywords": matched_keywords
#     }


"""
Severity Detector — Rule-Based Weighted Framework
===================================================
Detects severity of a civic complaint using keyword matching
with predefined weights.

Severity Levels:
- Critical (weight 5): fire, explosion, collapse, electrocution, injured, gas leak
- High (weight 4): live wire, flooding, accident, exposed drain, broken transformer
- Medium (weight 3): pothole, water leakage, streetlight failure
- Low (weight 2): garbage delay, noise complaint, minor delay
- Minimal (weight 1): suggestion, feedback
"""


# Severity keyword definitions with weights
SEVERITY_KEYWORDS = {
    # Critical — Public Safety Emergency (weight 5)
    "fire": 5,
    "explosion": 5,
    "collapse": 5,
    "collapsed": 5,
    "electrocution": 5,
    "electrocuted": 5,
    "injured": 5,
    "injury": 5,
    "injuries": 5,
    "gas leak": 5,
    "death": 5,
    "dead": 5,
    "killed": 5,
    "emergency": 5,
    "life-threatening": 5,
    "building collapse": 5,
    "dead open wire": 5,
    "open wire": 5,
    "breathing": 5,
    "difficulty breathing": 5,
    "choking": 5,
    "unconscious": 5,
    "bleeding": 5,
    "dying": 5,

    # High — Hazardous Infrastructure (weight 4)
    "live wire": 4,
    "flooding": 4,
    "flood": 4,
    "accident": 4,
    "accidents": 4,
    "exposed drain": 4,
    "broken transformer": 4,
    "open manhole": 4,
    "electrocution risk": 4,
    "danger": 4,
    "dangerous": 4,
    "hazard": 4,
    "hazardous": 4,
    "sewage overflow": 4,
    "contaminated": 4,
    "contamination": 4,
    "falling": 4,
    "hanging wire": 4,
    "dangling": 4,

    # Medium — Infrastructure Risk (weight 3)
    "pothole": 3,
    "potholes": 3,
    "water leakage": 3,
    "leakage": 3,
    "leak": 3,
    "streetlight failure": 3,
    "streetlight": 3,
    "power outage": 3,
    "power cut": 3,
    "water shortage": 3,
    "no water": 3,
    "pipeline burst": 3,
    "road damage": 3,
    "damaged road": 3,
    "broken road": 3,
    "sinkhole": 3,
    "waterlogging": 3,

    # Low — Service Disruption (weight 2)
    "garbage delay": 2,
    "garbage": 2,
    "noise complaint": 2,
    "noise": 2,
    "minor delay": 2,
    "delay": 2,
    "bus delay": 2,
    "irregular service": 2,
    "late collection": 2,
    "overgrown": 2,
    "broken bench": 2,
    "graffiti": 2,
    "litter": 2,
    "mosquito": 2,
    "mosquitoes": 2,
    "stray animals": 2,
    "open dumping": 2,

    # Minimal — Advisory (weight 1)
    "suggestion": 1,
    "feedback": 1,
    "request": 1,
    "inquiry": 1,
    "information": 1,
    "appreciate": 1,
    "thank": 1,
    "improvement": 1,
}

# Severity levels mapping
SEVERITY_LEVELS = {
    5: {"level": "Critical", "risk_type": "Public Safety Emergency"},
    4: {"level": "High", "risk_type": "Hazardous Infrastructure"},
    3: {"level": "Medium", "risk_type": "Infrastructure Risk"},
    2: {"level": "Low", "risk_type": "Service Disruption"},
    1: {"level": "Minimal", "risk_type": "Advisory"},
}


def detect_severity(text: str) -> dict:
    """
    Detect the severity of a complaint using keyword matching.

    Rules:
    - Identify all matching severity keywords
    - severity_score = sum of weights (capped at 10)
    - severity_level = determined by highest matching weight
    - risk_type = corresponding risk type for severity level

    Returns:
        {
            "severity_score": 7,
            "severity_level": "Critical",
            "risk_type": "Public Safety Emergency",
            "matched_keywords": ["injured", "pothole", "accident"]
        }
    """
    text_lower = text.lower()
    matched_keywords = []
    total_weight = 0
    highest_weight = 0

    # Sort keywords by length (longest first) to match phrases before words
    sorted_keywords = sorted(SEVERITY_KEYWORDS.keys(), key=len, reverse=True)

    matched_set = set()  # Track matched positions to avoid double-counting

    for keyword in sorted_keywords:
        if keyword in text_lower:
            # Check for word boundary match (avoid partial matches)
            import re
            # Escape the keyword, but replace spaces with \s+ to handle varying whitespace
            escaped_kw = r'\s+'.join(re.escape(w) for w in keyword.split())
            pattern = r'\b' + escaped_kw + r'\b'
            if re.search(pattern, text_lower):
                weight = SEVERITY_KEYWORDS[keyword]
                matched_keywords.append(keyword)
                total_weight += weight

                if weight > highest_weight:
                    highest_weight = weight

    # Cap severity score at 10
    severity_score = min(total_weight, 10)

    # Default to Minimal if no keywords matched
    if highest_weight == 0:
        highest_weight = 1
        severity_score = 1

    severity_info = SEVERITY_LEVELS.get(highest_weight, SEVERITY_LEVELS[1])

    return {
        "severity_score": severity_score,
        "severity_level": severity_info["level"],
        "risk_type": severity_info["risk_type"],
        "matched_keywords": matched_keywords
    }