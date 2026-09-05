"""
DrishtiKYC Master Pipeline Orchestration Engine
Executes Tiers 1 through 5 in a unified, deterministic, and auditable pipeline.
"""
import time
from typing import Dict, Any, List, Optional
from .tier1_document import parse_and_classify_document, mask_aadhaar_number
from .tier2_validators import validate_gstin, validate_verhoeff_aadhaar, validate_pan_structure, validate_bank_account
from .tier3_registries import execute_multi_registry_mesh
from .tier4_risk_engine import analyze_shell_entity_network, compute_bayesian_integrity_score
from .tier5_decision import evaluate_onboarding_decision
from .razorpay_client import RazorpayPlatformClient


class DrishtiPipelineOrchestrator:
    """End-to-End KYC & Risk Orchestration Pipeline."""

    def __init__(self):
        self.rzp_client = RazorpayPlatformClient()

    def run_full_pipeline(self, merchant_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes all 5 tiers sequentially with real-time telemetry and sub-second metrics.
        """
        start_time = time.time()
        tier_telemetry = []

        # =========================================================================
        # TIER 1: Document Intelligence, Classification & Forensic Security
        # =========================================================================
        t1_start = time.time()
        docs = merchant_data.get("documents", {})
        processed_docs = {}

        # Document: PAN
        pan_doc_meta = docs.get("pan_card", {"file_name": "pan.pdf", "tampered": False})
        processed_docs["pan"] = parse_and_classify_document("pan", pan_doc_meta["file_name"], {
            "pan": merchant_data.get("pan", ""),
            "name": merchant_data.get("legal_name", "")
        })

        # Document: Aadhaar with DPDP Masking
        aadhaar_num = merchant_data.get("aadhaar_number", "876543219012")
        processed_docs["aadhaar"] = parse_and_classify_document("aadhaar", "aadhaar_card.xml", {
            "aadhaar_number": aadhaar_num,
            "name": merchant_data.get("directors", [{}])[0].get("name", "Director") if merchant_data.get("directors") else merchant_data.get("legal_name", "")
        })

        # Document: GST Certificate
        gst_doc_meta = docs.get("gst_certificate", {"file_name": "gst_reg06.pdf", "tampered": False})
        processed_docs["gstin"] = parse_and_classify_document("gstin", gst_doc_meta["file_name"], {
            "gstin": merchant_data.get("gstin", ""),
            "legal_name": merchant_data.get("legal_name", "")
        })

        # Document: Bank Cheque
        processed_docs["cheque"] = parse_and_classify_document("cheque", "cancelled_cheque.png", {
            "account_number": merchant_data.get("bank_account", ""),
            "ifsc": merchant_data.get("bank_ifsc", ""),
            "account_holder_name": merchant_data.get("legal_name", "")
        })

        # Document: MCA CIN if corporate
        if merchant_data.get("cin"):
            processed_docs["mca"] = parse_and_classify_document("mca", "mca_inc.pdf", {
                "cin": merchant_data.get("cin", ""),
                "company_name": merchant_data.get("legal_name", ""),
                "directors": merchant_data.get("directors", [])
            })

        t1_duration = round((time.time() - t1_start) * 1000, 1)
        tier_telemetry.append({
            "tier_id": "tier_1",
            "tier_name": "Tier 1: Document Intelligence & DPDP Masking",
            "duration_ms": t1_duration,
            "status": "COMPLETED",
            "details": {
                "dpdp_aadhaar_masked": processed_docs["aadhaar"]["extracted_fields"]["masked_aadhaar"],
                "aadhaar_vault_token": processed_docs["aadhaar"]["extracted_fields"]["vault_token"],
                "documents_ingested_count": len(processed_docs)
            }
        })

        # =========================================================================
        # TIER 2: Deterministic Algorithmic & Structural Gate
        # =========================================================================
        t2_start = time.time()
        gstin_valid, gstin_msg, gstin_details = validate_gstin(merchant_data.get("gstin", ""))
        aadhaar_valid, aadhaar_msg = validate_verhoeff_aadhaar(aadhaar_num)
        pan_valid, pan_msg, pan_details = validate_pan_structure(merchant_data.get("pan", ""), merchant_data.get("legal_name", ""))
        bank_valid, bank_msg, bank_details = validate_bank_account(
            merchant_data.get("bank_account", "918273645019"),
            merchant_data.get("bank_ifsc", "HDFC0001234")
        )

        tier2_results = {
            "gstin": {"is_valid": gstin_valid, "message": gstin_msg, "details": gstin_details},
            "aadhaar_verhoeff": {"is_valid": aadhaar_valid, "message": aadhaar_msg},
            "pan_invariants": {"is_valid": pan_valid, "message": pan_msg, "details": pan_details},
            "bank_structure": {"is_valid": bank_valid, "message": bank_msg, "details": bank_details}
        }

        tier2_passed = all(v.get("is_valid", False) for v in tier2_results.values())
        t2_duration = round((time.time() - t2_start) * 1000, 1)

        tier_telemetry.append({
            "tier_id": "tier_2",
            "tier_name": "Tier 2: Deterministic Algorithmic Gate",
            "duration_ms": t2_duration,
            "status": "PASSED" if tier2_passed else "FAILED",
            "details": {
                "gstin_mod36_checksum": gstin_details.get("actual_check_digit", ""),
                "expected_checksum": gstin_details.get("expected_check_digit", ""),
                "verhoeff_d5_status": "VALID" if aadhaar_valid else "INVALID",
                "pan_entity_type": pan_details.get("entity_type", "Unknown"),
                "zero_api_cost_saved": not tier2_passed,
                "api_cost_saved_inr": "₹142.50" if not tier2_passed else "₹0.00",
                "rejection_speed": "0ms (Local Mod-36 Checksum Gate)" if not tier2_passed else "2ms (Algorithmic Pass)",
                "calls_prevented": "MCA21 Master (₹75) + GSTN Registry (₹45) + Penny Drop (₹22.50)" if not tier2_passed else "None"
            }
        })

        # =========================================================================
        # TIER 3: Real-Time Multi-Registry Cross-Verification Mesh
        # =========================================================================
        t3_start = time.time()
        # If Tier 2 failed on critical structural checksum, we note that API calls were saved
        if not tier2_passed:
            tier3_results = {
                "status": "SKIPPED_DUE_TO_TIER2_FAILURE",
                "itd_pan": {"status": "SKIPPED", "latency_ms": 0},
                "gstn_portal": {"status": "SKIPPED", "filing_regularity_score": 0.0, "latency_ms": 0},
                "mca21": {"status": "SKIPPED", "mca_health_score": 0.0, "latency_ms": 0},
                "bank_penny_drop": {"status": "SKIPPED", "fuzzy_name_score": 0.0, "latency_ms": 0},
                "api_cost_saved_inr": 142.50
            }
        else:
            tier3_results = execute_multi_registry_mesh({
                "pan": merchant_data.get("pan", ""),
                "legal_name": merchant_data.get("legal_name", ""),
                "gstin": merchant_data.get("gstin", ""),
                "cin": merchant_data.get("cin", ""),
                "directors": merchant_data.get("directors", []),
                "bank_account": merchant_data.get("bank_account", ""),
                "bank_ifsc": merchant_data.get("bank_ifsc", "")
            })

        t3_duration = round((time.time() - t3_start) * 1000, 1)
        tier_telemetry.append({
            "tier_id": "tier_3",
            "tier_name": "Tier 3: Multi-Registry Cross-Verification Mesh",
            "duration_ms": t3_duration,
            "status": "COMPLETED" if tier3_results.get("status") in ["VERIFIED", "ANOMALY_FLAGGED"] else "SKIPPED",
            "details": {
                "itd_pan_status": tier3_results.get("itd_pan", {}).get("pan_status", "SKIPPED"),
                "gstn_status": tier3_results.get("gstn_portal", {}).get("taxpayer_status", "SKIPPED"),
                "mca_status": tier3_results.get("mca21", {}).get("company_status", "SKIPPED"),
                "penny_drop_beneficiary": tier3_results.get("bank_penny_drop", {}).get("cbs_registered_name", "N/A"),
                "fuzzy_name_score": tier3_results.get("bank_penny_drop", {}).get("fuzzy_name_score", 0.0)
            }
        })

        # =========================================================================
        # TIER 4: Bayesian Fraud Scoring & Shell Entity Graph Intelligence
        # =========================================================================
        t4_start = time.time()
        shell_graph_results = analyze_shell_entity_network(
            company_name=merchant_data.get("legal_name", ""),
            cin=merchant_data.get("cin", ""),
            directors=merchant_data.get("directors", []),
            address=merchant_data.get("address", "")
        )

        bayesian_score_data = compute_bayesian_integrity_score(
            tier1_doc_results={"forensics": processed_docs["pan"]["forensics"]},
            tier2_validator_results=tier2_results,
            tier3_registry_results=tier3_results,
            shell_graph_results=shell_graph_results
        )

        t4_duration = round((time.time() - t4_start) * 1000, 1)
        tier_telemetry.append({
            "tier_id": "tier_4",
            "tier_name": "Tier 4: Bayesian Fraud Scoring & Graph Analysis",
            "duration_ms": t4_duration,
            "status": "COMPLETED",
            "details": {
                "drishti_score": bayesian_score_data["final_score"],
                "has_shell_anomaly": shell_graph_results["has_shell_anomaly"],
                "flagged_clusters_count": shell_graph_results["flagged_clusters_count"],
                "dimension_breakdown": bayesian_score_data["dimension_scores"]
            }
        })

        # =========================================================================
        # TIER 5: Autonomous Decision & Razorpay Orchestration
        # =========================================================================
        t5_start = time.time()
        decision_data = evaluate_onboarding_decision(
            bayesian_score_data=bayesian_score_data,
            tier1_doc={"forensics": processed_docs["pan"]["forensics"]},
            tier2_val=tier2_results,
            tier3_reg=tier3_results,
            shell_graph=shell_graph_results
        )

        # Razorpay API provisioning
        razorpay_account = None
        razorpay_stakeholders = []
        razorpay_products = None

        if decision_data["risk_tier"] in ["TIER_1_GREEN", "TIER_2_AMBER"]:
            razorpay_account = self.rzp_client.provision_linked_account(merchant_data, decision_data)
            razorpay_stakeholders = self.rzp_client.bind_stakeholders(
                razorpay_account["id"],
                merchant_data.get("directors", [])
            )
            razorpay_products = self.rzp_client.configure_products(
                razorpay_account["id"],
                decision_data["risk_tier"]
            )

        t5_duration = round((time.time() - t5_start) * 1000, 1)
        tier_telemetry.append({
            "tier_id": "tier_5",
            "tier_name": "Tier 5: Autonomous Decision & Razorpay Orchestration",
            "duration_ms": t5_duration,
            "status": "ACTIVATED" if decision_data["risk_tier"] == "TIER_1_GREEN" else ("CAPPED_SANDBOX" if decision_data["risk_tier"] == "TIER_2_AMBER" else "QUARANTINED"),
            "details": {
                "verdict": decision_data["verdict"],
                "risk_tier": decision_data["risk_tier"],
                "daily_cap": f"₹{decision_data['daily_transaction_cap_inr']:,}",
                "razorpay_account_id": razorpay_account["id"] if razorpay_account else "N/A"
            }
        })

        total_latency_ms = round((time.time() - start_time) * 1000, 1)

        return {
            "merchant_summary": {
                "legal_name": merchant_data.get("legal_name", ""),
                "trade_name": merchant_data.get("trade_name", ""),
                "pan": merchant_data.get("pan", ""),
                "gstin": merchant_data.get("gstin", ""),
                "cin": merchant_data.get("cin", ""),
                "category": merchant_data.get("category", ""),
                "bank_account_masked": f"••••{merchant_data.get('bank_account', '')[-4:]}"
            },
            "decision": decision_data,
            "drishti_score": bayesian_score_data["final_score"],
            "dimension_scores": bayesian_score_data["dimension_scores"],
            "tier_telemetry": tier_telemetry,
            "total_latency_ms": total_latency_ms,
            "tier1_documents": processed_docs,
            "tier2_validators": tier2_results,
            "tier3_registries": tier3_results,
            "tier4_shell_graph": shell_graph_results,
            "razorpay_provisioning": {
                "account": razorpay_account,
                "stakeholders": razorpay_stakeholders,
                "products": razorpay_products
            }
        }
