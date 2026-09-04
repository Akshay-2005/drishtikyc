"""
Onboarding & KYC API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
from ...engine.pipeline_orchestrator import DrishtiPipelineOrchestrator
from ...data.demo_fixtures import SCENARIOS_MAP

router = APIRouter(prefix="/onboarding", tags=["Onboarding & KYC"])
orchestrator = DrishtiPipelineOrchestrator()


class CustomMerchantPayload(BaseModel):
    legal_name: str
    trade_name: Optional[str] = None
    email: str
    phone: str
    category: Optional[str] = "ecommerce"
    subcategory: Optional[str] = "retail"
    address: str
    pan: str
    gstin: str
    cin: Optional[str] = ""
    bank_account: str
    bank_ifsc: str
    aadhaar_number: Optional[str] = "876543219012"
    directors: Optional[list] = []


@router.get("/scenarios")
def list_demo_scenarios():
    """Returns list of pre-configured hackathon evaluation scenarios."""
    scenarios = []
    for k, v in SCENARIOS_MAP.items():
        scenarios.append({
            "scenario_id": k,
            "title": v.get("scenario_title", k),
            "description": v.get("description", ""),
            "legal_name": v.get("legal_name", ""),
            "pan": v.get("pan", ""),
            "gstin": v.get("gstin", ""),
            "cin": v.get("cin", "")
        })
    return {"scenarios": scenarios}


@router.post("/scenarios/{scenario_id}/run")
def run_scenario(scenario_id: str):
    """Executes one of the 4 hackathon demo scenarios."""
    if scenario_id not in SCENARIOS_MAP:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found")

    merchant_data = SCENARIOS_MAP[scenario_id]
    result = orchestrator.run_full_pipeline(merchant_data)
    result["scenario_meta"] = {
        "scenario_id": scenario_id,
        "title": merchant_data.get("scenario_title", ""),
        "description": merchant_data.get("description", "")
    }
    return result


@router.post("/process")
def process_custom_onboarding(payload: CustomMerchantPayload):
    """Processes a custom merchant onboarding request through the 5-tier pipeline."""
    data = payload.model_dump()
    result = orchestrator.run_full_pipeline(data)
    return result
