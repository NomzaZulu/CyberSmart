"""Shared result validation and normalization for CyberSmart."""
from typing import Any


VALID_LEVELS = {"Low", "Medium", "High"}


def normalize_assessment(data: dict[str, Any], source: str = "message") -> dict[str, Any]:
    if not isinstance(data, dict):
        data = {}

    try:
        score = int(data.get("risk_score", 50))
    except (TypeError, ValueError):
        score = 50
    score = max(0, min(100, score))

    # Keep the displayed label consistent with the numeric score.
    if score >= 65:
        level = "High"
    elif score >= 25:
        level = "Medium"
    else:
        level = "Low"

    threats = data.get("detected_threats", [])
    reasons = data.get("reasons", [])
    if not isinstance(threats, list):
        threats = []
    if not isinstance(reasons, list):
        reasons = []

    threats = [str(item).strip()[:100] for item in threats[:8] if str(item).strip()]
    reasons = [str(item).strip()[:300] for item in reasons[:8] if str(item).strip()]

    if not reasons:
        reasons = ["The automated scan did not return specific evidence. Treat the result cautiously."]

    default_action = (
        "Do not share passwords or OTPs. Verify requests through an official channel "
        "and ask a trusted adult if unsure."
        if source == "message"
        else "Do not enter personal information unless you have independently verified the website."
    )

    return {
        "risk_level": level,
        "risk_score": score,
        "detected_threats": threats,
        "reasons": reasons,
        "recommended_action": str(data.get("recommended_action") or default_action)[:500],
        "assessment_note": str(
            data.get("assessment_note")
            or "Automated assessment; it can make mistakes. Low risk is not a guarantee of safety."
        )[:300],
    }
