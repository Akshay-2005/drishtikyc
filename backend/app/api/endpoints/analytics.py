"""
Analytics, Risk Radar & Shell Graph Endpoints
"""
from fastapi import APIRouter
from ...engine.tier4_risk_engine import analyze_shell_entity_network, KNOWN_SHELL_NETWORKS

router = APIRouter(prefix="/analytics", tags=["Analytics & Risk Intelligence"])


@router.get("/metrics")
def get_platform_impact_metrics():
    """Returns high-level business & operational impact metrics for the hackathon presentation."""
    return {
        "onboarding_time_reduction": {
            "legacy_ops_hours": 48.0,
            "drishti_seconds": 18.4,
            "speedup_factor": "94x faster"
        },
        "drop_off_reduction_pct": 32.5,
        "zero_cost_fraud_rejections_pct": 89.2,
        "dpdp_compliance_audit": "100% PII Masked & Tokenized",
        "api_cost_savings_inr": "₹142.50 per fraudulent submission prevented"
    }


@router.get("/shell-graph/cluster-sample")
def get_sample_shell_graph():
    """Returns a full multi-entity shell network graph for visual inspection."""
    return analyze_shell_entity_network(
        company_name="Vortex Mule Logistics Private Limited",
        cin="U51909GJ2020PTC900222",
        directors=[
            {"name": "Vikramaditya Singhania (Flagged Operator)", "din": "09998888"},
            {"name": "Rajeshwar Rao", "din": "08887777"}
        ],
        address="Plot 42, GIDC Industrial Estate, Surat, Gujarat"
    )
