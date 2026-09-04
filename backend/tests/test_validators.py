"""
Unit Tests for Deterministic Validators, Mod-36 GSTIN Checksum, Verhoeff Aadhaar, and Fuzzy Name Matcher
"""
import pytest
from app.engine.tier2_validators import (
    compute_gstin_checksum,
    validate_gstin,
    validate_verhoeff_aadhaar,
    generate_verhoeff_checksum,
    validate_pan_structure,
    validate_bank_account
)
from app.engine.fuzzy_matcher import (
    compute_hybrid_name_match,
    normalize_indian_entity_name,
    check_initials_match
)


def test_gstin_mod36_checksum_valid():
    # Valid GSTIN: 29AABCA1234A1Z -> compute checksum
    prefix = "29AABCA1234A1Z"
    expected_char = compute_gstin_checksum(prefix)
    full_gstin = f"{prefix}{expected_char}"

    is_valid, msg, details = validate_gstin(full_gstin)
    assert is_valid is True
    assert details["actual_check_digit"] == expected_char


def test_gstin_mod36_checksum_forged():
    # Forged GSTIN where 15th character is altered
    prefix = "29AABCA1234A1Z"
    valid_char = compute_gstin_checksum(prefix)
    wrong_char = "9" if valid_char != "9" else "8"
    forged_gstin = f"{prefix}{wrong_char}"

    is_valid, msg, details = validate_gstin(forged_gstin)
    assert is_valid is False
    assert "Forged or invalid GSTIN" in msg


def test_verhoeff_aadhaar_validation():
    # Test prefix 11 digits
    eleven_digits = "27654321901"
    check_digit = generate_verhoeff_checksum(eleven_digits)
    valid_aadhaar = f"{eleven_digits}{check_digit}"

    is_valid, msg = validate_verhoeff_aadhaar(valid_aadhaar)
    assert is_valid is True

    # Altering any single digit should fail
    invalid_aadhaar = valid_aadhaar[:-1] + ("0" if valid_aadhaar[-1] != "0" else "1")
    is_valid_bad, _ = validate_verhoeff_aadhaar(invalid_aadhaar)
    assert is_valid_bad is False


def test_pan_structural_invariants():
    # Corporate PAN (4th char 'C')
    valid_corp_pan = "AABCA1234A"
    is_valid, msg, details = validate_pan_structure(valid_corp_pan, "Acme Technologies Private Limited")
    assert is_valid is True
    assert details["entity_code"] == "C"

    # Individual PAN (4th char 'P')
    valid_ind_pan = "ABCPG1234K"
    is_valid_ind, _, details_ind = validate_pan_structure(valid_ind_pan, "Suresh Kumar Gupta")
    assert is_valid_ind is True
    assert details_ind["entity_code"] == "P"


def test_fuzzy_name_matcher():
    # Test initials expansion: "Suresh Kumar Gupta" vs "S. K. Gupta"
    score, details = compute_hybrid_name_match("Suresh Kumar Gupta", "S. K. Gupta")
    assert score >= 0.85
    assert details["is_initials_expansion"] is True

    # Test corporate normalization: "M/s Acme Retail Tech Pvt Ltd" vs "Acme Retail Technologies Private Limited"
    score_corp, details_corp = compute_hybrid_name_match("M/s Acme Retail Tech Pvt Ltd", "Acme Retail Technologies Private Limited")
    assert score_corp >= 0.85

    # Completely different names should score low
    score_diff, _ = compute_hybrid_name_match("Reliance Industries", "Infosys Technologies")
    assert score_diff < 0.60
