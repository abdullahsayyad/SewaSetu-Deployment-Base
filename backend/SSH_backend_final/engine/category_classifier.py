"""
Category Classifier — OpenAI API (gpt-4o-mini)
==============================================
Uses OpenAI's API for zero-shot text classification
of civic complaints into predefined categories.

Model: gpt-4o-mini
"""

import os
import json
import time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Category taxonomy with subcategories and keyword hints
CATEGORY_TAXONOMY = {
    "Infrastructure": {
        "subcategories": ["Roads", "Bridges", "Streetlights", "Public buildings"],
        "keywords": "pothole, road damage, broken road, cracked road, bridge, streetlight, street light, lamp post, public building, footpath, sidewalk, pavement, flyover, overpass"
    },
    "Electricity": {
        "subcategories": ["Power outage", "Transformer issue", "Live wire", "Voltage fluctuation"],
        "keywords": "electricity, power cut, power outage, blackout, transformer, live wire, electric pole, voltage, electric shock, electrocution, power failure, no power, current"
    },
    "Water & Drainage": {
        "subcategories": ["Water shortage", "Pipeline leakage", "Sewage overflow", "Flooding"],
        "keywords": "water, water supply, no water, pipeline, pipe leak, leakage, sewage, sewer, drainage, drain, flooding, waterlogging, borewell, water tanker, tap water, contaminated water"
    },
    "Sanitation": {
        "subcategories": ["Garbage collection", "Open dumping", "Blocked drains"],
        "keywords": "garbage, trash, waste, rubbish, dustbin, sanitation, sweeping, cleaning, dumping, littering, blocked drain, clogged drain, unhygienic, dirty, filthy, stinking"
    },
    "Public Health": {
        "subcategories": ["Contamination", "Unsafe food", "Mosquito breeding", "Hospital complaint"],
        "keywords": "health, disease, infection, contamination, food poisoning, unsafe food, mosquito, dengue, malaria, hospital, clinic, doctor, medical, epidemic, sick, illness"
    },
    "Law & Order": {
        "subcategories": ["Illegal activity", "Public disturbance", "Encroachment"],
        "keywords": "illegal, crime, theft, robbery, encroachment, unauthorized, disturbance, fight, harassment, vandalism, drug, gambling, trespassing, nuisance, anti-social"
    },
    "Transport": {
        "subcategories": ["Bus delay", "Broken traffic signal", "Road accident"],
        "keywords": "bus, traffic, transport, signal, traffic light, accident, vehicle, auto, rickshaw, taxi, cab, metro, train, commute, route, bus stop, traffic jam, congestion"
    },
    "Environment": {
        "subcategories": ["Tree fall", "Air pollution", "Noise pollution"],
        "keywords": "tree, fallen tree, pollution, air quality, smoke, dust, noise, loud, construction noise, factory, industrial, chemical, toxic, deforestation, green cover"
    },
    "Animals & Pests": {
        "subcategories": ["Stray animals", "Animal cruelty", "Dead animal", "Pet issue", "Pest outbreak"],
        "keywords": "dog, cat, stray, cow, monkey, snake, animal rescue, dead animal, pet, pest, rat, breathing, bite, cruelty, veterinary"
    },
    "Other": {
        "subcategories": ["General inquiry", "Miscellaneous", "Not applicable"],
        "keywords": "other, inquiry, question, miscellaneous, irrelevant, unclassified"
    },
}

_client = None


def _ensure_client():
    """Initialize the OpenAI client."""
    global _client
    if _client is not None:
        return

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables")

    _client = OpenAI(api_key=api_key)
    print("[CategoryClassifier] OpenAI client initialized.")


def classify(text: str) -> dict:
    """
    Classify a complaint into a primary category and subcategory.

    Returns:
        {
            "category": "Infrastructure",
            "subcategory": "Roads",
            "category_confidence": 0.87
        }
    """
    _ensure_client()

    if not text.strip():
        return {
            "category": "Infrastructure",
            "subcategory": "Roads",
            "category_confidence": 0.0
        }

    # Build taxonomy for prompt
    taxonomy_block = ""
    for cat, info in CATEGORY_TAXONOMY.items():
        subs = ", ".join(info["subcategories"])
        taxonomy_block += f"\n  {cat}:\n    Subcategories: {subs}\n    Keywords: {info['keywords']}\n"

    prompt = f"""You are a high-precision civic grievance classifier for an Indian municipal complaint system.

Your task:
Classify the complaint into EXACTLY ONE primary category and ONE subcategory.

You must strictly follow the taxonomy and boundary rules below.

---------------------------------------------------
CATEGORY TAXONOMY
---------------------------------------------------

Infrastructure
- Roads (potholes, damaged roads)
- Bridges
- Streetlights
- Public buildings

Electricity
- Power outage
- Transformer issue
- Live wire
- Voltage fluctuation

Water & Drainage
- Water shortage
- Pipeline leakage
- Sewage overflow
- Flooding

Sanitation
- Garbage collection
- Open dumping
- Blocked drains

Public Health
- Contamination
- Unsafe food
- Mosquito breeding
- Hospital complaint

Law & Order
- Illegal activity
- Public disturbance
- Encroachment

Transport
- Bus delay
- Broken traffic signal
- Road accident

Environment
- Tree fall
- Air pollution
- Noise pollution

Animals & Pests
- Stray animals
- Animal cruelty
- Dead animal
- Pet issue
- Pest outbreak

Other
- General inquiry
- Miscellaneous
- Not applicable


---------------------------------------------------
CRITICAL DISAMBIGUATION RULES (VERY IMPORTANT)
---------------------------------------------------

1. "Blocked drain", "clogged drain", "drain not cleaned"
   → ALWAYS classify as:
   Category: Sanitation
   Subcategory: Blocked drains

2. "Sewage overflow"
   → Category: Water & Drainage
   Subcategory: Sewage overflow

3. "Flooding due to rain"
   → Category: Water & Drainage
   Subcategory: Flooding

4. Garbage causing drain blockage
   → Primary issue is waste mismanagement
   → Category: Sanitation
   → Subcategory: Blocked drains

5. Water supply not coming
   → Water & Drainage → Water shortage

6. "Water clogging", "waterlogging", "stagnant water on road"
   → ALWAYS classify as:
   Category: Sanitation
   Subcategory: Blocked drains

7. If complaint mentions BOTH garbage and drain:
   - If focus is garbage not collected → Sanitation → Garbage collection
   - If focus is drain blockage → Sanitation → Blocked drains

Always classify based on ROOT CAUSE, not surface wording.

---------------------------------------------------
PRIORITY RULE
---------------------------------------------------

If multiple issues exist:
Choose the MOST URGENT or SAFETY-CRITICAL issue.

Example:
"live wire and garbage nearby"
→ Electricity → Live wire (higher risk)

---------------------------------------------------
CONFIDENCE RULE
---------------------------------------------------

category_confidence must be:
- Between 0.75 and 0.98
- Higher if complaint clearly matches a subcategory
- Lower if ambiguous

---------------------------------------------------
DEPARTMENTS
---------------------------------------------------

You must also assign the complaint to one or more government departments with probabilities summing to 1.0. 
Most cases should have ONE primary department. 
However, for complex cases involving overlapping infrastructure, safety, and health (e.g., a major accident causing a gas leak and fire), distribute probabilities across ALL relevant departments to ensure coordination.

Choose ONLY from this exact list:
- Municipal Corporation - Roads
- Electricity Board
- Water Supply Department
- Municipal Sanitation Department
- Health Department
- Police Department
- Traffic Police Department
- Environmental Authority
- Animal Control Department

---------------------------------------------------
COMPLAINT
---------------------------------------------------

"{text}"

---------------------------------------------------
OUTPUT FORMAT (STRICT)
---------------------------------------------------

Return ONLY valid JSON:
{{
  "category": "",
  "subcategory": "",
  "category_confidence": 0.0,
  "department_probabilities": [
    {{
      "department": "",
      "probability": 0.0
    }}
  ]
}}

Do not include explanations.
Do not include extra text.
Do not include markdown.
Return JSON only."""

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
                max_tokens=200,
            )

            content = response.choices[0].message.content.strip()

            result = json.loads(content)

            # Validate category
            valid_categories = list(CATEGORY_TAXONOMY.keys())
            if result.get("category") not in valid_categories:
                cat_lower = result.get("category", "").lower()
                matched = False
                for vc in valid_categories:
                    if vc.lower() in cat_lower or cat_lower in vc.lower():
                        result["category"] = vc
                        matched = True
                        break
                if not matched:
                    result["category"] = "Other"

            # Validate subcategory
            valid_subs = CATEGORY_TAXONOMY[result["category"]]["subcategories"]
            if result.get("subcategory") not in valid_subs:
                sub_lower = result.get("subcategory", "").lower()
                matched = False
                for vs in valid_subs:
                    if vs.lower() in sub_lower or sub_lower in vs.lower():
                        result["subcategory"] = vs
                        matched = True
                        break
                if not matched:
                    result["subcategory"] = valid_subs[0]

            # Validate and fix departments
            VALID_DEPTS = [
                "Municipal Corporation - Roads",
                "Electricity Board",
                "Water Supply Department",
                "Municipal Sanitation Department",
                "Health Department",
                "Police Department",
                "Traffic Police Department",
                "Environmental Authority",
                "Animal Control Department",
            ]
            
            depts = result.get("department_probabilities", [])
            fixed_depts = []
            for d in depts:
                dept_name = d.get("department", "")
                if dept_name not in VALID_DEPTS:
                    # fuzzy match
                    d_lower = dept_name.lower()
                    for vd in VALID_DEPTS:
                        if d_lower in vd.lower() or vd.lower() in d_lower:
                            dept_name = vd
                            break
                    else:
                        dept_name = "Health Department" if result.get("category") == "Animals & Pests" else "Municipal Corporation - Roads"
                fixed_depts.append({"department": dept_name, "probability": float(d.get("probability", 1.0))})

            if not fixed_depts:
                dept_name = "Health Department" if result.get("category") == "Animals & Pests" else "Municipal Corporation - Roads"
                fixed_depts = [{"department": dept_name, "probability": 1.0}]
                
            # Normalize probabilities
            total = sum(d["probability"] for d in fixed_depts)
            if total > 0:
                for d in fixed_depts:
                    d["probability"] = round(d["probability"] / total, 4)
            else:
                dept_name = "Health Department" if result.get("category") == "Animals & Pests" else "Municipal Corporation - Roads"
                fixed_depts = [{"department": dept_name, "probability": 1.0}]
            
            result["department_probabilities"] = sorted(fixed_depts, key=lambda x: x["probability"], reverse=True)

            result["category_confidence"] = round(
                max(0.5, min(0.98, float(result.get("category_confidence", 0.8)))),
                4
            )

            return result

        except Exception as e:
            error_str = str(e).lower()
            if ("rate" in error_str or "429" in error_str or "quota" in error_str) and attempt < max_retries - 1:
                wait_time = 15 * (attempt + 1)
                print(f"[CategoryClassifier] Rate limited, waiting {wait_time}s (attempt {attempt + 1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                print(f"[CategoryClassifier] OpenAI API error: {e}")
                return {
                    "category": "Infrastructure",
                    "subcategory": "Roads",
                    "category_confidence": 0.5,
                    "department_probabilities": [{"department": "Municipal Corporation - Roads", "probability": 1.0}]
                }