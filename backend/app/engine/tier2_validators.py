"""
Tier 2: Deterministic Algorithmic & Structural Gate
Zero LLM Hallucination, Zero External API Cost local validators.
"""
import re
from typing import Dict, Any, Tuple

# Modulo 36 character set mapping for GSTIN check digit calculation
GST_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
GST_CHAR_MAP = {c: i for i, c in enumerate(GST_CHARS)}


def compute_gstin_checksum(gstin_14: str) -> str:
    """
    Computes the 15th check character for a 14-character GSTIN prefix using the
    official Indian GSTN Mod-36 weighted checksum algorithm:
    Check Digit = (36 - (sum(w_i * val(c_i)) mod 36)) mod 36
    where weights alternate (1, 2, 1, 2...) for odd/even indices.
    """
    gstin_14 = gstin_14.upper().strip()
    if len(gstin_14) != 14:
        raise ValueError("GSTIN prefix must be exactly 14 characters")

    total = 0
    for i, char in enumerate(gstin_14):
        if char not in GST_CHAR_MAP:
            raise ValueError(f"Invalid character '{char}' in GSTIN")
        val = GST_CHAR_MAP[char]
        weight = 1 if (i % 2 == 0) else 2
        factor = val * weight
        quotient = factor // 36
        remainder = factor % 36
        total += (quotient + remainder)

    rem = total % 36
    check_code = (36 - rem) % 36
    return GST_CHARS[check_code]


def validate_gstin(gstin: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Validates a 15-character GSTIN:
    - Format: 2 digits state code + 10 chars PAN + 1 entity code + 'Z' + 1 checksum
    - Mathematical Mod-36 Checksum Verification
    """
    gstin = gstin.upper().strip()
    gstin_regex = r"^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"

    if not re.match(gstin_regex, gstin):
        return False, "GSTIN does not match standard 15-character statutory format regex", {}

    state_code = gstin[:2]
    pan_part = gstin[2:12]
    entity_code = gstin[12]
    check_digit = gstin[14]

    try:
        expected_check_digit = compute_gstin_checksum(gstin[:14])
    except Exception as e:
        return False, f"Checksum calculation error: {str(e)}", {}

    is_valid = (check_digit == expected_check_digit)
    details = {
        "gstin": gstin,
        "state_code": state_code,
        "extracted_pan": pan_part,
        "entity_code": entity_code,
        "expected_check_digit": expected_check_digit,
        "actual_check_digit": check_digit,
        "is_valid": is_valid
    }

    if not is_valid:
        return False, f"Forged or invalid GSTIN: Checksum mismatch (Expected '{expected_check_digit}', got '{check_digit}')", details

    return True, "GSTIN format and Mod-36 Checksum valid", details


# Verhoeff Dihedral D5 Algorithm tables for 12-digit Aadhaar UID validation
VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def validate_verhoeff_aadhaar(aadhaar_num: str) -> Tuple[bool, str]:
    """
    Validates 12-digit Aadhaar UID using Verhoeff Dihedral Group D5 multiplication.
    Supports formatted '1234 5678 9012' or unformatted 12-digit string.
    """
    clean_num = aadhaar_num.replace(" ", "").replace("-", "").strip()
    if not re.match(r"^[2-9][0-9]{11}$", clean_num):
        return False, "Aadhaar must be a 12-digit number starting with 2-9"

    c = 0
    reversed_digits = [int(x) for x in reversed(clean_num)]
    for i, digit in enumerate(reversed_digits):
        c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]]

    if c == 0:
        return True, "Aadhaar Verhoeff D5 Checksum Valid"
    return False, "Aadhaar failed Verhoeff Dihedral D5 Checksum test"


def generate_verhoeff_checksum(eleven_digits: str) -> str:
    """Generates the 12th check digit for an 11-digit Aadhaar prefix."""
    c = 0
    reversed_digits = [int(x) for x in reversed(eleven_digits)]
    for i, digit in enumerate(reversed_digits):
        c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]]
    return str(VERHOEFF_INV[c])


def validate_pan_structure(pan: str, expected_name: str = None) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Validates PAN structure and 4th/5th semantic invariants:
    - Format: 5 uppercase letters + 4 digits + 1 uppercase letter
    - 4th character entity types:
      'C' (Company), 'P' (Person), 'H' (HUF), 'F' (Firm/LLP), 'A' (AOP),
      'T' (Trust), 'B' (BOI), 'L' (Local Authority), 'J' (Artificial Juridical), 'G' (Govt)
    - 5th character: First letter of Surname/Last Name (or Company name)
    """
    pan = pan.upper().strip()
    pan_regex = r"^[A-Z]{3}[CPHFATBLJG][A-Z][0-9]{4}[A-Z]$"

    if not re.match(pan_regex, pan):
        return False, "Invalid PAN card format or unrecognised 4th character entity code", {}

    entity_code = pan[3]
    entity_map = {
        'C': "Company / Private Limited / Public Limited",
        'P': "Individual / Sole Proprietor",
        'H': "Hindu Undivided Family (HUF)",
        'F': "Partnership Firm / LLP",
        'A': "Association of Persons (AOP)",
        'T': "Trust",
        'B': "Body of Individuals (BOI)",
        'L': "Local Authority",
        'J': "Artificial Juridical Person",
        'G': "Government Agency"
    }
    entity_desc = entity_map.get(entity_code, "Unknown")
    fifth_char = pan[4]

    name_alignment = True
    alignment_note = "No name supplied for 5th character alignment"
    if expected_name:
        clean_name = re.sub(r"[^A-Za-z]", " ", expected_name).strip().upper()
        noise_words = {
            "PVT", "LTD", "LIMITED", "PRIVATE", "LLP", "MS", "M/S", "SHRI", "MR", "MRS", "SMT", "DR",
            "ENTERPRISES", "ENTERPRISE", "STORE", "SUPERSTORE", "TRADERS", "TRADING", "SERVICES",
            "AGENCY", "AGENCIES", "TECHNOLOGIES", "TECH", "SOLUTIONS", "VENTURES", "LOGISTICS"
        }
        tokens = [t for t in clean_name.split() if t not in noise_words]
        if tokens:
            target_token = tokens[0] if entity_code in ['C', 'F', 'T', 'A'] else tokens[-1]
            if target_token and target_token[0] != fifth_char:
                # Check if any token matches the 5th character
                matching_tokens = [t for t in tokens if t.startswith(fifth_char)]
                if matching_tokens:
                    alignment_note = f"5th character '{fifth_char}' matches surname/name token '{matching_tokens[0]}'"
                    name_alignment = True
                else:
                    name_alignment = False
                    alignment_note = f"5th character '{fifth_char}' did not match first letter of tokens {tokens}"
            else:
                alignment_note = f"5th character '{fifth_char}' matches entity name token '{target_token}'"

    details = {
        "pan": pan,
        "entity_code": entity_code,
        "entity_type": entity_desc,
        "fifth_character": fifth_char,
        "name_alignment": name_alignment,
        "alignment_note": alignment_note
    }

    return True, "PAN format and semantic invariants valid", details


def validate_bank_account(account_num: str, ifsc_code: str) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Validates Bank Account number and Indian Financial System Code (IFSC):
    - Account: 9 to 18 digits.
    - IFSC: 4 alphabetic chars + '0' + 6 alphanumeric branch code.
    """
    clean_acc = account_num.strip()
    clean_ifsc = ifsc_code.upper().strip()

    if not re.match(r"^\d{9,18}$", clean_acc):
        return False, "Invalid Bank Account Number (must be 9 to 18 digits)", {}

    if not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", clean_ifsc):
        return False, "Invalid IFSC format (must be 4 alpha + '0' + 6 alphanumeric)", {}

    bank_code = clean_ifsc[:4]
    high_risk_banks = ["VIRT", "PAYT", "COOP", "TEST"]
    is_virtual_or_coop = bank_code in high_risk_banks

    return True, "Bank account and IFSC structure valid", {
        "account_masked": f"••••••••{clean_acc[-4:]}" if len(clean_acc) >= 4 else clean_acc,
        "ifsc": clean_ifsc,
        "bank_code": bank_code,
        "is_high_risk_flag": is_virtual_or_coop
    }
