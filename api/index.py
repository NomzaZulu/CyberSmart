"""Vercel FastAPI entrypoint.

Vercel detects this app under api/index.py. The actual routes and business
logic remain modularized in the project-root modules.
"""

from main import app
