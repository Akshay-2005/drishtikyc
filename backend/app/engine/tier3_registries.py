"""
Tier 3: Real-Time Multi-Registry Cross-Verification Mesh
- ITD / NSDL: PAN Active & Aadhaar Seeding
- GSTN: Active Status, GSTR-3B Filing Regularity & Address Match
- MCA21: CIN Validation, Director DIN Status, Active Bank Charges
- NPCI / Bank IMPS Penny Drop: Account Name Verification & Hybrid Fuzzy Match
- CKYCR: Central KYC Registry Lookup (14-digit KIN)
"""
import time
from typing import Dict, Any, List
from .fuzzy_matcher import compute_hybrid_name_match


def verify_pan_with_itd(pan: str, name: str) -> Dict[str, Any]:
    """Simulates Income Tax Department (ITD) / NSDL PAN API verification."""
    pan = pan.upper().strip()
    is_valid_format = len(pan) == 10

    # Simulating known test cases
    is_dormant_or_invalid = pan.startswith("DORM") or pan.endswith("999X")

    if is_dormant_or_invalid:
        return {
            "status": "FAILED",
            "pan": pan,
            "pan_status": "INACTIVE_OR_SUSPENDED",
            "aadhaar_seeded": False,
            "itd_registered_name": "NONE",
            "name_match_score": 0.0,
            "latency_ms": 65
        }

    match_score, match_details = compute_hybrid_name_match(name, name)
    return {
        "status": "VERIFIED",
        "pan": pan,
        "pan_status": "ACTIVE_AND_OPERATIONAL",
        "aadhaar_seeded": True,
        "itd_registered_name": name,
        "name_match_score": match_score,
        "category": "CORPORATE" if pan[3] == 'C' else "INDIVIDUAL",
        "latency_ms": 78
    }


def verify_gstn_portal(gstin: str, legal_name: str) -> Dict[str, Any]:
    """Simulates GSTN Portal live check, GSTR-3B filing history, and compliance track record."""
    gstin = gstin.upper().strip()
    is_cancelled = "CNCL" in gstin or gstin.endswith("0Z0")

    if is_cancelled:
        return {
            "status": "FAILED",
            "gstin": gstin,
            "taxpayer_status": "CANCELLED_FOR_NON_FILING",
            "filing_regularity_score": 0.15,
            "gstr_3b_filed_count": 2,
            "gstr_3b_total_quarters": 8,
            "address_matched": False,
            "latency_ms": 110
        }

    # High quality filing track record
    filing_regularity = 0.95
    return {
        "status": "VERIFIED",
        "gstin": gstin,
        "taxpayer_status": "ACTIVE",
        "legal_name": legal_name,
        "taxpayer_type": "Regular",
        "state_jurisdiction": "Karnataka Ward 4",
        "filing_regularity_score": filing_regularity,
        "gstr_3b_filed_count": 8,
        "gstr_3b_total_quarters": 8,
        "einvoice_enabled": True,
        "address_matched": True,
        "latency_ms": 124
    }


def verify_mca21_cin(cin: str, company_name: str, directors: List[Dict[str, str]]) -> Dict[str, Any]:
    """Simulates Ministry of Corporate Affairs (MCA21) portal verification for CIN and DINs."""
    cin = cin.upper().strip()
    
    # Check if this CIN is marked as shell / struck-off in our registry simulation
    is_struck_off = "SHELL" in cin or "STRUCK" in cin or cin.endswith("000000")
    
    flagged_dins = []
    for d in directors:
        din = d.get("din", "")
        # Flag DINs marked in known defaulter/shell company lists
        if din.startswith("999") or "SHELL" in d.get("name", "").upper() or din in ["09998888", "08887777"]:
            flagged_dins.append({
                "din": din,
                "name": d.get("name", "Unknown"),
                "reason": "DIN linked to multiple struck-off shell entities under Section 248 of Companies Act"
            })

    if is_struck_off:
        return {
            "status": "FAILED",
            "cin": cin,
            "company_status": "STRUCK_OFF",
            "active_charges_count": 4,
            "unreleased_charge_amount_inr": 25000000,
            "flagged_directors": flagged_dins,
            "mca_health_score": 10.0,
            "latency_ms": 145
        }

    return {
        "status": "VERIFIED",
        "cin": cin,
        "company_name": company_name,
        "company_status": "ACTIVE_COMPLIANT",
        "class_of_company": "Private",
        "paid_up_capital_inr": 5000000,
        "active_charges_count": 0,
        "flagged_directors": flagged_dins,
        "mca_health_score": 98.0 if not flagged_dins else 35.0,
        "latency_ms": 130
    }


def execute_bank_penny_drop(account_num: str, ifsc: str, expected_name: str) -> Dict[str, Any]:
    """
    Simulates NPCI / IMPS ₹1.00 Bank Account Penny Drop.
    Extracts beneficiary name from Core Banking System and computes fuzzy match.
    """
    account_num = account_num.strip()
    ifsc = ifsc.upper().strip()

    # Handle formal scenario variations
    if "Tata" in expected_name:
        cbs_beneficiary_name = "TATA DIGITAL PRIVATE LIMITED"
    elif "Infosys" in expected_name:
        cbs_beneficiary_name = "INFOSYS BPM LIMITED"
    elif "Suresh" in expected_name or "Gupta" in expected_name:
        cbs_beneficiary_name = "S. K. GUPTA"
    elif "Alaknanda" in expected_name:
        cbs_beneficiary_name = "ALAKNANDA INFRASTRUCTURE & TRADING CORPORATION PVT LTD"
    else:
        cbs_beneficiary_name = expected_name.upper()

    match_score, match_details = compute_hybrid_name_match(expected_name, cbs_beneficiary_name)

    is_success = match_score >= 0.70

    return {
        "status": "VERIFIED" if is_success else "FLAGGED_MISMATCH",
        "imps_rrn": f"RRN{int(time.time()*1000) % 1000000000000}",
        "account_number_masked": f"••••{account_num[-4:]}",
        "ifsc": ifsc,
        "bank_name": "HDFC Bank Ltd" if "HDFC" in ifsc else ("ICICI Bank Ltd" if "ICIC" in ifsc else "State Bank of India"),
        "cbs_registered_name": cbs_beneficiary_name,
        "expected_name": expected_name,
        "fuzzy_name_score": match_score,
        "name_match_details": match_details,
        "penny_drop_status": "ACCOUNT_CREDITED_SUCCESSFULLY",
        "latency_ms": 190
    }


def execute_multi_registry_mesh(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Executes all Tier 3 registry cross-verifications in parallel or pipeline mesh."""
    pan = payload.get("pan", "")
    legal_name = payload.get("legal_name", "")
    gstin = payload.get("gstin", "")
    cin = payload.get("cin", "")
    directors = payload.get("directors", [])
    account_num = payload.get("bank_account", "")
    ifsc = payload.get("bank_ifsc", "")

    itd_result = verify_pan_with_itd(pan, legal_name)
    gstn_result = verify_gstn_portal(gstin, legal_name)
    mca_result = verify_mca21_cin(cin, legal_name, directors) if cin else {"status": "SKIPPED_INDIVIDUAL", "mca_health_score": 90.0}
    penny_drop_result = execute_bank_penny_drop(account_num, ifsc, legal_name) if account_num else {"status": "SKIPPED", "fuzzy_name_score": 1.0}

    # Aggregate registry alignment
    all_verified = (
        itd_result.get("status") == "VERIFIED" and
        gstn_result.get("status") == "VERIFIED" and
        mca_result.get("status") in ["VERIFIED", "SKIPPED_INDIVIDUAL"] and
        penny_drop_result.get("status") in ["VERIFIED", "SKIPPED"]
    )

    return {
        "status": "VERIFIED" if all_verified else "ANOMALY_FLAGGED",
        "itd_pan": itd_result,
        "gstn_portal": gstn_result,
        "mca21": mca_result,
        "bank_penny_drop": penny_drop_result,
        "ckyc_kin": f"KIN-IN-{int(time.time()) % 100000000000000:014d}",
        "all_registries_aligned": all_verified
    }
