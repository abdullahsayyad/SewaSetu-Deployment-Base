"""
Department Router — Rule + Probability Mapping
================================================
Maps classified categories to government departments
with probability distributions.

Department Mappings:
  Infrastructure → Municipal Corporation - Roads
  Electricity → Electricity Board
  Water & Drainage → Water Supply Department
  Sanitation → Municipal Sanitation Department
  Public Health → Health Department
  Law & Order → Police Department
  Transport → Traffic Police Department
  Environment → Environmental Authority
"""


# Primary department mapping (strict 1:1)
DEPARTMENT_MAP = {
    "Infrastructure": "Municipal Corporation - Roads",
    "Electricity": "Electricity Board",
    "Water & Drainage": "Water Supply Department",
    "Sanitation": "Municipal Sanitation Department",
    "Public Health": "Health Department",
    "Law & Order": "Police Department",
    "Transport": "Traffic Police Department",
    "Environment": "Environmental Authority",
}

# All departments
ALL_DEPARTMENTS = [
    "Municipal Corporation - Roads",
    "Electricity Board",
    "Water Supply Department",
    "Municipal Sanitation Department",
    "Health Department",
    "Police Department",
    "Traffic Police Department",
    "Environmental Authority",
]

# Co-responsibility matrix — secondary departments that may also be involved
CO_RESPONSIBILITY = {
    "Infrastructure": [
        ("Traffic Police Department", 0.08),
        ("Environmental Authority", 0.04),
    ],
    "Electricity": [
        ("Municipal Corporation - Roads", 0.06),
        ("Police Department", 0.04),
    ],
    "Water & Drainage": [
        ("Health Department", 0.10),
        ("Municipal Sanitation Department", 0.06),
    ],
    "Sanitation": [
        ("Health Department", 0.12),
        ("Environmental Authority", 0.08),
    ],
    "Public Health": [
        ("Municipal Sanitation Department", 0.08),
        ("Water Supply Department", 0.06),
    ],
    "Law & Order": [
        ("Municipal Corporation - Roads", 0.06),
        ("Traffic Police Department", 0.05),
    ],
    "Transport": [
        ("Municipal Corporation - Roads", 0.10),
        ("Police Department", 0.06),
    ],
    "Environment": [
        ("Health Department", 0.08),
        ("Municipal Corporation - Roads", 0.06),
    ],
}


def route_department(category: str, category_confidence: float) -> list:
    """
    Map a category to departments with probability distribution.

    The primary department always gets the highest probability.
    Secondary departments from the co-responsibility matrix get smaller shares.

    Returns:
        [
            {"department": "Municipal Corporation - Roads", "probability": 0.82},
            {"department": "Traffic Police Department", "probability": 0.10},
            {"department": "Environmental Authority", "probability": 0.05},
        ]
    """
    # Get primary department — this is the critical 1:1 mapping
    primary_dept = DEPARTMENT_MAP.get(category)

    if not primary_dept:
        # If category doesn't match, try to find closest match
        cat_lower = category.lower()
        for known_cat, dept in DEPARTMENT_MAP.items():
            if known_cat.lower() in cat_lower or cat_lower in known_cat.lower():
                primary_dept = dept
                category = known_cat
                break

        if not primary_dept:
            # Ultimate fallback
            primary_dept = "Municipal Corporation - Roads"
            category = "Infrastructure"

    # Primary department gets a high probability based on classification confidence
    # Scale: confidence of 0.9 → probability of 0.85, confidence of 0.8 → probability of 0.75
    primary_prob = round(max(0.65, min(0.92, category_confidence * 0.92)), 4)

    result = [{"department": primary_dept, "probability": primary_prob}]

    # Add co-responsible departments
    remaining_prob = round(1.0 - primary_prob, 4)
    co_depts = CO_RESPONSIBILITY.get(category, [])

    if co_depts:
        # Distribute remaining probability among co-responsible departments
        total_co_weight = sum(w for _, w in co_depts)

        for dept_name, weight in co_depts:
            if dept_name == primary_dept:
                continue  # Skip if same as primary
            scaled_prob = round((weight / total_co_weight) * remaining_prob, 4)
            if scaled_prob >= 0.02:  # Only include if >= 2%
                result.append({"department": dept_name, "probability": scaled_prob})

    # Sort by probability descending
    result.sort(key=lambda x: x["probability"], reverse=True)

    # Ensure probabilities sum to ~1.0
    total = sum(d["probability"] for d in result)
    if total < 1.0 and len(result) > 0:
        # Add remaining to primary
        result[0]["probability"] = round(result[0]["probability"] + (1.0 - total), 4)

    return result
