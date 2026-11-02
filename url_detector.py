"""Offline URL pattern checks. This module never opens or visits submitted URLs."""
import ipaddress
import re
from urllib.parse import urlparse


class URLValidationError(Exception):
    pass


SUSPICIOUS_TERMS = (
    "login", "verify", "account", "password", "secure", "signin",
    "confirm", "wallet", "recover", "gift", "prize", "update",
)


def analyse_url(raw_url: str) -> dict:
    raw = raw_url.strip()
    if not raw or any(ch.isspace() for ch in raw):
        raise URLValidationError("Enter a valid website address.")

    candidate = raw if re.match(r"^https?://", raw, re.I) else "https://" + raw
    try:
        parsed = urlparse(candidate)
        host = parsed.hostname
        # Accessing .port/.hostname can raise ValueError for malformed netlocs.
        _ = parsed.port
    except ValueError as exc:
        raise URLValidationError("The website address is not formatted correctly.") from exc

    if parsed.scheme.lower() not in {"http", "https"} or not host:
        raise URLValidationError("Enter a valid HTTP or HTTPS website address.")

    host = host.lower().rstrip(".")
    score = 0
    reasons = []
    threats = []

    try:
        ipaddress.ip_address(host)
        score += 30
        threats.append("IP-address website")
        reasons.append("The address uses a direct IP address instead of a normal domain name.")
    except ValueError:
        pass

    if parsed.scheme.lower() != "https":
        score += 10
        reasons.append("The address does not use HTTPS. This alone does not prove it is malicious.")

    if "@" in parsed.netloc:
        score += 25
        threats.append("Deceptive URL structure")
        reasons.append("The address contains an @ symbol, which can disguise the actual destination.")

    if "xn--" in host:
        score += 25
        threats.append("Punycode domain")
        reasons.append("The domain uses encoded international characters that can sometimes imitate another domain.")

    labels = host.split(".")
    if len(labels) > 3:
        score += 10
        reasons.append("The address has several subdomains. Check the registered domain carefully.")

    if len(candidate) > 100:
        score += 10
        reasons.append("The address is unusually long, so inspect its actual domain carefully.")

    if host.count("-") >= 3:
        score += 10
        reasons.append("The domain contains several hyphens, which can be used in lookalike addresses.")

    searchable = (host + parsed.path).lower()
    found = [term for term in SUSPICIOUS_TERMS if term in searchable]
    if found:
        score += min(15, 5 + len(found) * 2)
        reasons.append(
            "The address contains terms often used in account or reward messages: "
            + ", ".join(found[:5])
            + ". These words can also appear on legitimate sites."
        )

    if re.search(r"%[0-9a-fA-F]{2}", candidate):
        score += 10
        reasons.append("The address contains encoded characters that make it harder to read.")

    score = min(score, 100)
    if score >= 65:
        level = "High"
        advice = (
            "Do not open the link or enter information. Show it to a trusted adult "
            "and verify through the organisation's official app or website."
        )
    elif score >= 25:
        level = "Medium"
        advice = (
            "Do not sign in through this link. Check the exact domain independently "
            "and ask a trusted adult if unsure."
        )
    else:
        level = "Low"
        advice = (
            "No strong warning signs were found by these checks, but that does not "
            "prove the website is safe. Only visit sites you trust."
        )

    if not reasons:
        reasons.append("No obvious suspicious URL patterns were found by these basic checks.")

    return {
        "risk_level": level,
        "risk_score": score,
        "detected_threats": threats,
        "reasons": reasons,
        "recommended_action": advice,
        "assessment_note": (
            "This is a basic pattern check, not a live reputation lookup. "
            "The address was not opened or visited."
        ),
    }
