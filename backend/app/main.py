"""
DrishtiKYC / AstraOnboard - FastAPI Backend Application Entrypoint
Razorpay Buildathon Track 02: AI-Powered Autonomous Onboarding & KYC Orchestration Engine
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import onboarding, registries, analytics

app = FastAPI(
    title="DrishtiKYC Engine API",
    description="Autonomous Neurosymbolic KYC & Risk Orchestration Engine for Razorpay",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(onboarding.router, prefix="/api")
app.include_router(registries.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/")
def health_check():
    return {
        "engine": "DrishtiKYC / AstraOnboard",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "track": "Razorpay Buildathon Track 02 — Autonomous KYC Orchestration",
        "capabilities": [
            "Vision OCR & DPDP 8-digit Aadhaar Masking",
            "Deterministic Mod-36 GSTIN & Verhoeff D5 Checksum Gates",
            "Multi-Registry Real-time Mesh (MCA21, GSTN, ITD, NPCI Penny Drop)",
            "Explainable 6-Dimension Bayesian Risk Scoring (0-100)",
            "Shell Entity & Dormant DIN Network Graph Detection",
            "Autonomous Decision Engine & Razorpay Linked Account Provisioning"
        ]
    }
