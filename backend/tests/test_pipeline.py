"""
End-to-End Pipeline Integration Tests for all 4 Hackathon Pitch Scenarios
"""
import pytest
from app.engine.pipeline_orchestrator import DrishtiPipelineOrchestrator
from app.data.demo_fixtures import (
    GOLDEN_PATH_MERCHANT,
    FORGED_GSTIN_MERCHANT,
    FUZZY_NAME_MERCHANT,
    SHELL_NETWORK_MERCHANT
)


@pytest.fixture
def orchestrator():
    return DrishtiPipelineOrchestrator()


def test_golden_path_scenario(orchestrator):
    result = orchestrator.run_full_pipeline(GOLDEN_PATH_MERCHANT)
    assert result["decision"]["risk_tier"] == "TIER_1_GREEN"
    assert result["decision"]["verdict"] == "INSTANT_LIVE_ACTIVATED"
    assert result["drishti_score"] >= 85.0
    assert result["razorpay_provisioning"]["account"] is not None
    assert result["razorpay_provisioning"]["account"]["id"].startswith("acc_")
    assert result["razorpay_provisioning"]["account"]["status"] == "activated"


def test_forged_gstin_scenario(orchestrator):
    result = orchestrator.run_full_pipeline(FORGED_GSTIN_MERCHANT)
    # Must fail at Tier 2 and result in Red Path quarantine
    assert result["decision"]["risk_tier"] == "TIER_3_RED"
    assert result["decision"]["verdict"] == "QUARANTINED"
    assert result["tier2_validators"]["gstin"]["is_valid"] is False
    # Verify zero API calls made to Tier 3 registry due to short-circuit
    assert result["tier3_registries"].get("status") == "SKIPPED_DUE_TO_TIER2_FAILURE"


def test_fuzzy_name_scenario(orchestrator):
    result = orchestrator.run_full_pipeline(FUZZY_NAME_MERCHANT)
    # Must resolve via penny drop and achieve Green Path or high score
    assert result["decision"]["risk_tier"] in ["TIER_1_GREEN", "TIER_2_AMBER"]
    assert result["tier3_registries"]["bank_penny_drop"]["fuzzy_name_score"] >= 0.80
    assert result["razorpay_provisioning"]["account"] is not None


def test_shell_network_scenario(orchestrator):
    result = orchestrator.run_full_pipeline(SHELL_NETWORK_MERCHANT)
    # Struck-off DIN must trigger shell cluster anomaly and quarantine
    assert result["tier4_shell_graph"]["has_shell_anomaly"] is True
    assert result["tier4_shell_graph"]["flagged_clusters_count"] >= 1
    assert result["decision"]["risk_tier"] == "TIER_3_RED"
    assert result["decision"]["verdict"] == "QUARANTINED"
