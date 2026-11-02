"""Conservative, offline URL structure checks for CyberSmart.

This module never opens or fetches a submitted URL. It does not provide live
reputation, DNS, certificate, or malware-content checks.
"""

import ipaddress
import re
from urllib.parse import urlparse, unquote

SUSPICIOUS_TERMS = {
    "login": "login-related URL wording",
    "verify": "verification-related URL wording",
    "password": "password-related URL wording",
    "account": "account-related URL wording",
    "secure": "security-related URL wording",
    "signin": "sign-in URL wording",
    "confirm": "confirmation-related URL wording",
    "wallet": "wallet-related URL wording",
    "recover": "account-recovery URL wording",
}
KNOWN_BRANDS = (
    "paypal", "amazon", "google", "microsoft", "apple", "netflix",
    "instagram", "facebook", "whatsapp",
)


def analyse_url(raw_url: str):
    candidate = raw_url.strip()
    if not candidate:
        raise ValueError("Enter a website address to analyse.")
    if any(ch.isspace() for ch in candidate):
        raise ValueError("The URL must not contain spaces.")
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", candidate):
        candidate = "https://" + candidate

    parsed = urlparse(candidate)
    if parsed.scheme.lower() not in {"http", "https"}:
        raise ValueError("Only HTTP and HTTPS website addresses can be checked.")
    if not parsed.hostname:
        raise ValueError("That does not look like a valid website address.")

    host = parsed.hostname.lower().rstrip(".")
    if host == "localhost" or host.endswith(".localhost"):
        raise ValueError("Localhost addresses cannot be checked here.")

    score = 0
    reasons = []
    threats = []

    try:
        ipaddress.ip_address(host.strip("[]"))
        score += 30
        reasons.append("The address uses a raw IP address instead of a normal domain name.")
        threats.append("IP-address URL")
    except ValueError:
        pass

    if parsed.username is not None or parsed.password is not None or "@" in parsed.netloc:
        score += 25
        reasons.append("The address contains an @ sign or embedded user information, which can obscure the actual destination.")
        threats.append("Potentially misleading URL format")

    if host.startswith("xn--") or ".xn--" in host:
        score += 25
        reasons.append("The domain uses punycode, which can be used to disguise look-alike characters.")
        threats.append("Punycode domain")

    if host.count("-") >= 3:
        score += 10
        reasons.append("The domain contains several hyphens; this is a weak warning sign on its own.")
        threats.append("Unusual domain structure")

    if len(candidate) > 120:
        score += 8
        reasons.append("The web address is unusually long.")
        threats.append("Unusually long URL")

    if len(host.split(".")) >= 5:
        score += 8
        reasons.append("The domain has several subdomain levels. Check which part is the registered domain.")
        threats.append("Complex subdomain structure")

    decoded = unquote(candidate).lower()
    if re.search(r"%[0-9a-fA-F]{2}", candidate):
        score += 8
        reasons.append("The address contains encoded characters. This is not automatically malicious, but deserves careful inspection.")
        threats.append("Encoded URL characters")

    found_terms = [description for term, description in SUSPICIOUS_TERMS.items() if term in decoded]
    if found_terms:
        score += min(12, len(found_terms) * 4)
        reasons.append("The URL contains wording often seen in account or sign-in links: " + ", ".join(found_terms[:3]) + ".")
        threats.append("Account-related URL wording")

    path = (parsed.path or "").lower()
    if re.search(r"\.(exe|scr|bat|cmd|js|vbs|apk|msi)(?:$|/)", path):
        score += 20
        reasons.append("The URL path appears to point to an executable or installable file.")
        threats.append("Potentially risky file download")

    if parsed.scheme.lower() == "http":
        score += 5
        reasons.append("The address uses HTTP rather than HTTPS. This alone does not prove the site is malicious.")
        threats.append("No HTTPS")

    # Flag brand names embedded in a larger, non-matching hostname, but do not
    # claim impersonation without proper registrable-domain analysis.
    brand_hits = [brand for brand in KNOWN_BRANDS if brand in host and not (host == brand + ".com" or host.endswith("." + brand + ".com"))]
    if brand_hits:
        score += 15
        reasons.append("The hostname includes a well-known brand name in an unusual domain position: " + ", ".join(brand_hits[:2]) + ".")
        threats.append("Possible brand-name misuse")

    score = min(100, score)
    if not reasons:
        reasons.append("No major structural warning signs were found by these basic checks.")

    if score >= 60:
        advice = "Do not open the link or enter information. Ask a trusted adult and verify the address through the organisation's official website or app."
    elif score >= 30:
        advice = "Be cautious. Do not sign in or share information through this link. Check the exact domain using an official source."
    else:
        advice = "No major structural warning signs were detected, but that does not prove the site is safe. Only visit sites you intended to visit and verify the domain independently."

    return {
        "risk_score": score,
        "detected_threats": threats,
        "reasons": reasons,
        "recommended_action": advice,
        "normalized_url": candidate,
    }
