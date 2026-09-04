"""
Registry Inspection API Endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
from ...engine.tier3_registries import verify_pan_with_itd, verify_gstn_portal, verify_mca21_cin, execute_bank_penny_drop
from ...engine.tier2_validators import validate_gstin, validate_verhoeff_aadhaar, validate_pan_structure

router = APIRouter(prefix="/registries", tags=["Registries"])


class PanCheckRequest(BaseModel):
    pan: str
    expected_name: Optional[str] = "Merchant"


class GstinCheckRequest(BaseModel):
    gstin: str
    legal_name: Optional[str] = "Merchant"


class PennyDropRequest(BaseModel):
    account_number: str
    ifsc: str
    expected_name: str


@router.post("/pan/verify")
def verify_pan(payload: PanCheckRequest):
    pan_valid, msg, details = validate_pan_structure(payload.pan, payload.expected_name)
    if not pan_valid:
        return {"valid": False, "message": msg, "details": details}
    itd_res = verify_pan_with_itd(payload.pan, payload.expected_name)
    return {"valid": True, "local_validation": details, "itd_registry": itd_res}


@router.post("/gstin/verify")
def verify_gst(payload: GstinCheckRequest):
    gst_valid, msg, details = validate_gstin(payload.gstin)
    if not gst_valid:
        return {"valid": False, "message": msg, "details": details, "api_cost_saved": True}
    gstn_res = verify_gstn_portal(payload.gstin, payload.legal_name)
    return {"valid": True, "local_validation": details, "gstn_portal": gstn_res}


@router.post("/penny-drop")
def run_penny_drop(payload: PennyDropRequest):
    return execute_bank_penny_drop(payload.account_number, payload.ifsc, payload.expected_name)
