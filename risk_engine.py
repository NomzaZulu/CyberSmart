"""Validation and normalization for CyberSmart detector results."""

import json

VALID_LEVELS = {"Low", "Medium", "High"}


def _safe_text(value, fallback, limit=500):
    if not isinstance(value, str):
        return fallback
    cleaned = value.strip()
    return cleaned[:limit] if cleaned else fallback


def _safe_list(value, limit=8):
    if not isinstance(value, list):
        return []
    return [item.strip()[:180] for item in value if isinstance(item, str) and item.strip()][:limit]


def normalize_message_result(raw_json):
    try:
        data = json.loads(raw_json)
    except (TypeError, json.JSONDecodeError):
        raise ValueError("The AI response was not valid JSON.")

    if not isinstance(data, dict):
        raise ValueError("The AI response had an unexpected format.")

    level = data.get("risk_level")
    if level not in VALID_LEVELS:
        level = "Medium"

    try:
        score = max(0, min(100, int(data.get("risk_score", 0))))
    except (TypeError, ValueError):
        score = 0

    # Keep the label and score coherent even if the model returns inconsistent values.
    if score >= 60:
        level = "High"
    elif score >= 30:
        level = "Medium"
    else:
        level = "Low"

    return {
        "risk_level": level,
        "risk_score": score,
        "is_suspicious": bool(data.get("is_suspicious", score >= 30)),
        "detected_threats": _safe_list(data.get("detected_threats")),
        "reasons": _safe_list(data.get("reasons")),
        "recommended_action": _safe_text(
            data.get("recommended_action"),
            "Do not share personal information. If unsure, pause and ask a trusted adult.",
        ),
        "uncertainty": _safe_text(
            data.get("uncertainty"),
            "This is an automated assessment, not proof that a message is safe or fraudulent.",
        ),
        "notice": "The score is an indicative assessment, not a probability or guarantee.",
    }


def combine_url_result(result):
    score = int(result["risk_score"])
    level = "High" if score >= 60 else "Medium" if score >= 30 else "Low"
    return {
        "input_type": "url",
        "risk_level": level,
        "risk_score": score,
        "is_suspicious": score >= 30,
        "detected_threats": result["detected_threats"],
        "reasons": result["reasons"],
        "recommended_action": result["recommended_action"],
        "uncertainty": "This checks URL structure only. It does not confirm the website's live reputation or scan its contents.",
        "notice": "A low score does not guarantee that a website is safe.",
        "analysis_type": "rule_based",
    }
