"""
Tier 5: Autonomous Decision Engine & State Machine
- Dynamic Risk Tiering (Green / Amber / Red)
- Transaction Caps, Settlement Reserves & Step-Up KYC triggers
- Tamper-Proof Cryptographic Audit Reason Ledger
"""
import hashlib
import json
import time
from typing import Dict, Any, List


def evaluate_onboarding_decision(
    bayesian_score_data: Dict[str, Any],
    tier1_doc: Dict[str, Any],
    tier2_val: Dict[str, Any],
    tier3_reg: Dict[str, Any],
    shell_graph: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates final activation decision and assigns dynamic risk boundaries:
    - Tier 1 (Green Path): Score >= 85 -> Instant Full Live PG Activation (<30s)
    - Tier 2 (Amber Path): Score 60-84 -> Sandbox + ₹50,000/day Live Cap + 5% Reserve + Step-Up KYC
    - Tier 3 (Red Path): Score < 60 or Hard Failures -> Quarantined for Ops Review
    """
    score = bayesian_score_data.get("final_score", 0.0)
    hard_failures = []

    # Check hard invariant failures from Tier 2
    for k, v in tier2_val.items():
        if isinstance(v, dict) and v.get("is_valid") is False:
            hard_failures.append(f"Tier 2 Invariant Failed: {v.get('message', k)}")

    # Check document tampering
    if tier1_doc.get("forensics", {}).get("verdict") == "TAMPER_DETECTED":
        hard_failures.append("Tier 1 Invariant Failed: Document tampering or forgery detected")

    # Check shell entity cluster
    if shell_graph.get("has_shell_anomaly", False):
        hard_failures.append("Tier 4 Risk Anomaly: Director/CIN associated with struck-off shell company network")

    # State machine resolution
    if hard_failures or score < 60.0:
        risk_tier = "TIER_3_RED"
        verdict = "QUARANTINED"
        activation_state = "quarantined_for_ops"
        daily_transaction_cap_inr = 0
        settlement_cycle = "FROZEN"
        rolling_reserve_pct = 100.0
        allowed_methods = []
        action_required = "Manual compliance review required. Cryptographic audit trail exported to compliance queue."

    elif score < 85.0:
        risk_tier = "TIER_2_AMBER"
        verdict = "CONDITIONAL_APPROVAL"
        activation_state = "sandbox_and_capped_live"
        daily_transaction_cap_inr = 50000
        settlement_cycle = "T+4"
        rolling_reserve_pct = 5.0
        allowed_methods = ["upi", "netbanking", "domestic_cards"]
        action_required = "Merchant activated in sandbox with ₹50,000/day live cap. Step-Up KYC webhook triggered."

    else:
        risk_tier = "TIER_1_GREEN"
        verdict = "INSTANT_LIVE_ACTIVATED"
        activation_state = "full_live_activated"
        daily_transaction_cap_inr = 2500000  # ₹25 Lakh/day default
        settlement_cycle = "T+2"
        rolling_reserve_pct = 0.0
        allowed_methods = ["all_domestic_cards", "upi_autopay", "netbanking_all", "emi", "wallets", "corporate_cards"]
        action_required = "Zero human intervention required. Razorpay Linked Account provisioned directly."

    # Generate cryptographic audit hash
    audit_data = {
        "score": score,
        "risk_tier": risk_tier,
        "verdict": verdict,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "hard_failures": hard_failures,
        "dimension_scores": bayesian_score_data.get("dimension_scores", {})
    }
    audit_raw = json.dumps(audit_data, sort_keys=True)
    audit_token = f"audit_sha256_{hashlib.sha256(audit_raw.encode()).hexdigest()}"

    return {
        "risk_tier": risk_tier,
        "verdict": verdict,
        "activation_state": activation_state,
        "drishti_score": score,
        "daily_transaction_cap_inr": daily_transaction_cap_inr,
        "settlement_cycle": settlement_cycle,
        "rolling_reserve_pct": rolling_reserve_pct,
        "allowed_payment_methods": allowed_methods,
        "hard_failures": hard_failures,
        "action_required": action_required,
        "audit_token": audit_token,
        "audit_manifest": audit_data
    }
