"""
Formal Statutory Demo Fixtures for Razorpay Buildathon Evaluation
Strict corporate nomenclature conforming to MCA21, GSTN, and RBI Master KYC Directions.
"""
from typing import Dict, Any
from ..engine.tier2_validators import compute_gstin_checksum, generate_verhoeff_checksum


def get_valid_gstin(prefix_14: str) -> str:
    """Computes mathematically valid 15-character GSTIN with Mod-36 check digit."""
    chk = compute_gstin_checksum(prefix_14)
    return f"{prefix_14}{chk}"


def get_valid_aadhaar(prefix_11: str) -> str:
    """Computes mathematically valid 12-digit Aadhaar UID via Verhoeff D5 algorithm."""
    chk = generate_verhoeff_checksum(prefix_11)
    return f"{prefix_11}{chk}"


# Profile 1: Tier 1 Compliant Enterprise (Green Path)
TATA_DIGITAL_PROFILE: Dict[str, Any] = {
    "scenario_id": "golden_path",
    "scenario_title": "Corporate Entity: Tata Digital Private Limited",
    "description": "High-capitalization corporate entity with active MCA21 status, unblemished GSTR-3B filings (100% compliance), and verified directorship.",
    "legal_name": "Tata Digital Private Limited",
    "trade_name": "Tata Neu Payments",
    "email": "treasury.ops@tatadigital.com",
    "phone": "9820012345",
    "category": "e-commerce_marketplace",
    "subcategory": "digital_goods_and_services",
    "address": "Bombay House, 24 Homi Mody Street, Fort, Mumbai, Maharashtra 400001",
    "pan": "AABCT1234T",  # Company PAN ('C') with 5th char 'T'
    "gstin": get_valid_gstin("27AABCT1234T1Z"),
    "cin": "U72900MH2019PTC322568",
    "bank_account": "00600350123456",
    "bank_ifsc": "HDFC0000060",
    "aadhaar_number": get_valid_aadhaar("87654321901"),
    "directors": [
        {"name": "Natarajan Chandrasekaran", "din": "00121863", "pan": "AACPC5678K"},
        {"name": "Pratik Pal", "din": "08479541", "pan": "AACPP9012M"}
    ],
    "documents": {
        "pan_card": {"file_name": "pan_tata_digital_corp.pdf", "tampered": False},
        "gst_certificate": {"file_name": "form_gst_reg_06_maharashtra.pdf", "tampered": False},
        "bank_cheque": {"file_name": "cancelled_cheque_hdfc_fort.png", "tampered": False},
        "aadhaar_director": {"file_name": "aadhaar_xml_offline_kyc.xml", "tampered": False}
    }
}

# Profile 2: Tier 3 Statutory Checksum Rejection (Adversarial GSTIN Forgery)
FORGED_GSTIN_PROFILE: Dict[str, Any] = {
    "scenario_id": "forged_gstin",
    "scenario_title": "Adversarial Checksum Anomaly: Kuber FinTech Services",
    "description": "Digitally manipulated Form GST REG-06 where state code and PAN were spliced. Fails Mod-36 weighted check digit at Tier 2 Gate in 0ms (Zero API Cost).",
    "legal_name": "Kuber FinTech Services Private Limited",
    "trade_name": "KuberPay Fast",
    "email": "compliance@kuber-fin-audit.net",
    "phone": "9810098765",
    "category": "financial_intermediation",
    "subcategory": "payment_aggregator_merchant",
    "address": "Office 402, Ring Road Commercial Complex, Surat, Gujarat 395002",
    "pan": "AABCK9999F",
    "gstin": "24AABCK9999F1Z9",  # Invalid check digit '9' fails Modulo 36 algorithm
    "cin": "U74999GJ2022PTC998877",
    "bank_account": "10023456789012",
    "bank_ifsc": "SBIN0001234",
    "aadhaar_number": "999988887777",
    "directors": [
        {"name": "Alok Kumar Bansal", "din": "09112233", "pan": "ABCPA9999Z"}
    ],
    "documents": {
        "pan_card": {"file_name": "pan_altered_layer.pdf", "tampered": True},
        "gst_certificate": {"file_name": "gst_reg06_modified_quant.png", "tampered": True},
        "bank_cheque": {"file_name": "cheque_sbi_current.png", "tampered": False}
    }
}

# Profile 3: Tier 1 Autonomous Resolution (Phonetic Transliteration & Bank Penny Drop)
INFOSYS_BPM_PROFILE: Dict[str, Any] = {
    "scenario_id": "fuzzy_name",
    "scenario_title": "Transliteration Resolution: Infosys BPM Services",
    "description": "Statutory name variation across regulatory databases: MCA21 record 'Infosys Business Process Management Limited' vs Bank CBS IMPS record 'Infosys BPM Limited'.",
    "legal_name": "Infosys Business Process Management Limited",
    "trade_name": "Infosys BPM",
    "email": "vendor.settlements@infosys.com",
    "phone": "9880011223",
    "category": "information_technology",
    "subcategory": "business_process_outsourcing",
    "address": "Electronics City, Hosur Road, Bengaluru, Karnataka 560100",
    "pan": "AABCI3344M",  # Company PAN ('C') with 5th char 'I'
    "gstin": get_valid_gstin("29AABCI3344M1Z"),
    "cin": "U72200KA2002PLC030310",
    "bank_account": "00020500123456",
    "bank_ifsc": "ICIC0000002",
    "aadhaar_number": get_valid_aadhaar("65432109876"),
    "directors": [
        {"name": "Anantha Radhakrishnan", "din": "06948625", "pan": "AACPR7890K"}
    ],
    "documents": {
        "pan_card": {"file_name": "pan_infosys_bpm.pdf", "tampered": False},
        "gst_certificate": {"file_name": "gstin_karnataka_reg06.pdf", "tampered": False},
        "bank_cheque": {"file_name": "icici_corporate_cheque.png", "tampered": False}
    }
}

# Profile 4: Tier 3 Regulatory Quarantine (Shell Entity & Circular Trading Cluster)
SHELL_NETWORK_PROFILE: Dict[str, Any] = {
    "scenario_id": "shell_network",
    "scenario_title": "Shell Cluster Detection: Alaknanda Trading Corporation",
    "description": "Dormant entity with common Director DIN 09998888 associated with three corporate entities struck off by Registrar of Companies under Section 248.",
    "legal_name": "Alaknanda Infrastructure & Trading Corporation Pvt Ltd",
    "trade_name": "Alaknanda Infra",
    "email": "accounts@alaknanda-infra-corp.in",
    "phone": "9871122334",
    "category": "logistics_freight",
    "subcategory": "intermodal_shipping",
    "address": "Plot 88, Sector 4, GIDC Industrial Estate, Surat, Gujarat 395006",
    "pan": "AABCA7777M",
    "gstin": get_valid_gstin("24AABCA7777M1Z"),
    "cin": "U51909GJ2020PTC900222",
    "bank_account": "33445566778899",
    "bank_ifsc": "BARB0SURATX",
    "aadhaar_number": get_valid_aadhaar("33221144556"),
    "directors": [
        {"name": "Vikramaditya Singhania (DIN Blacklisted)", "din": "09998888", "pan": "ABCPS9999M"},
        {"name": "Rajeshwar Rao", "din": "08887777", "pan": "ABCPM8888K"}
    ],
    "documents": {
        "pan_card": {"file_name": "pan_alaknanda_corp.pdf", "tampered": False},
        "gst_certificate": {"file_name": "gstin_dormant_surat.pdf", "tampered": False},
        "bank_cheque": {"file_name": "bank_of_baroda_cheque.png", "tampered": False}
    }
}

SCENARIOS_MAP = {
    "golden_path": TATA_DIGITAL_PROFILE,
    "forged_gstin": FORGED_GSTIN_PROFILE,
    "fuzzy_name": INFOSYS_BPM_PROFILE,
    "shell_network": SHELL_NETWORK_PROFILE
}

GOLDEN_PATH_MERCHANT = TATA_DIGITAL_PROFILE
FORGED_GSTIN_MERCHANT = FORGED_GSTIN_PROFILE
FUZZY_NAME_MERCHANT = INFOSYS_BPM_PROFILE
SHELL_NETWORK_MERCHANT = SHELL_NETWORK_PROFILE
