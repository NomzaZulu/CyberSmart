from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from groq_service import analyse_message, GroqServiceError
from url_detector import analyse_url, URLValidationError
from risk_engine import normalize_assessment

app = FastAPI(title="CyberSmart Scam Detection API", version="1.0.0")


class MessageRequest(BaseModel):
    message: str = Field(min_length=5, max_length=6000)


class URLRequest(BaseModel):
    url: str = Field(min_length=4, max_length=2048)


@app.get("/")
def root():
    return {"service": "CyberSmart Scam Detection API", "status": "online"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/scan/message")
def scan_message(payload: MessageRequest):
    try:
        raw_result = analyse_message(payload.message)
        return normalize_assessment(raw_result, source="message")
    except GroqServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/scan/url")
def scan_url(payload: URLRequest):
    try:
        raw_result = analyse_url(payload.url)
        return normalize_assessment(raw_result, source="url")
    except URLValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
