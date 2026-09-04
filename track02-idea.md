# Track 02: AI-Powered Autonomous Onboarding & KYC Orchestration Engine

> **Project Codename**: **DrishtiKYC / AstraOnboard**  
> **Track**: Razorpay Buildathon Track 02 — *AI-Powered Onboarding & KYC Orchestration*  
> **Core Value Proposition**: Transform high-friction 24–72 hour B2B merchant onboarding into a <30-second autonomous, fraud-resilient, regulatory-compliant activation pipeline with zero human intervention for clean entities and mathematically bounded risk quarantine for anomalies.

---

## 1. Executive Summary & Problem Landscape

### The B2B Merchant Onboarding Crisis in India
For modern payment aggregators (PAs) and payment gateways (PGs) operating under RBI Master Directions, merchant onboarding is a high-stakes bottleneck:
1. **High Drop-off & Latency (24–72 Hours)**: Traditional manual operations review requires human document verifiers to manually inspect PAN cards, GSTIN certificates, cancelled cheques, MCA filings, and board resolutions. Over 38% of merchants drop off during onboarding.
2. **Synthetic Identity & Circular Trading Fraud**: Fraudulent operators use synthetic PANs, dormant GSTINs, shell companies, and photo-tampered IDs to secure payment gateways for laundering, mule operations, or chargeback bust-outs.
3. **Name Transliteration & OCR Mismatches**: Legitimate merchants often face false rejections due to phonetic variations across Aadhaar, PAN, and Bank Accounts (e.g., *"Pradeep Kumar Sharma"* vs. *"P. K. Sharma"* vs. *"Pradeep Sharma"*), triggering unnecessary manual hold queues.
4. **Regulatory Non-Negotiables**: Strict compliance mandates (RBI KYC Directions 2016/2024, DPDP Act 2023, PMLA 2002, UIDAI Aadhaar Masking Circulars) require zero raw Aadhaar storage, deterministic audit trails, and strict data localization.

### The Solution: DrishtiKYC
**DrishtiKYC** is an **Autonomous Neurosymbolic KYC & Risk Engine** designed natively for the Razorpay ecosystem. It blends:
- **Vision-Language Document Intelligence** for unstructured document extraction.
- **Deterministic Algorithmic Validators** (Mod-36 GSTIN checksum, Verhoeff Aadhaar verification, entity structure parsing).
- **Live Multi-Registry Cross-Verification** (MCA21, GSTN, CKYCR, NSDL/ITD, Bank Penny Drop).
- **Bayesian Risk & Fraud Matrix** to assign dynamic transaction caps and instant sandbox-to-live activation.
- **Automated Razorpay Linked Account Provisioning** via Razorpay Accounts API (`POST /v1/accounts`).

---

## 2. Core Architecture & Processing Pipeline

```
Merchant Uploads Documents / Enters Details (Mobile/Web SDK)
   │
   ▼
[ Tier 1: Intelligent Ingestion & Document Normalization ]
   ├── Vision OCR & Document Classification (PAN, Aadhaar OKYC, GSTIN, Cheque, MOA)
   ├── Image Forensic Tampering & EXIF Verification (Error Level Analysis, Re-compression artifacts)
   └── Mandatory Aadhaar 8-Digit Masking (DPDP / UIDAI Compliance)
   │
   ▼
[ Tier 2: Deterministic Algorithmic & Structural Gate ]
   ├── Mod-36 GSTIN Checksum Calculation
   ├── Verhoeff Algorithm on Aadhaar
   ├── PAN 4th/5th Character Semantic Invariants (Entity type: 'C', 'P', 'F', 'H', etc.)
   └── Date Validity, Expiry & Format Consistency
   │
   ▼
[ Tier 3: Real-Time Multi-Registry Cross-Verification Mesh ]
   ├── ITD / NSDL: PAN Active & Seeded Status
   ├── GSTN Portal: Active status, GSTR-3B/1 filing history, business address matching
   ├── MCA21 (Ministry of Corporate Affairs): CIN/LLPIN validation, Director DIN status, Active charges
   ├── NPCI / Bank IMPS Penny Drop: Account holder name match via fuzzy distance (Jaro-Winkler >= 0.88)
   └── CKYCR (Central KYC Registry): 14-digit KIN pull for re-KYC deduplication
   │
   ▼
[ Tier 4: Bayesian Fraud Scoring & Shell Entity Detection Engine ]
   ├── Graph Network Analysis: Shared DIN/Phone/Address across blacklisted/dormant entities
   ├── Passive Liveness & Biometric Match (Euler angle head rotation, blink cadence, face similarity)
   └── Merchant Category Code (MCC) Risk Baseline + Dynamic Bayesian Posterior Update
   │
   ▼
[ Tier 5: Autonomous Decision & Razorpay Orchestration State Machine ]
   ├── Score >= 85 (Tier 1: Green Path) ──► Instant Live PG Activation (`POST /v1/accounts`) (<30s)
   ├── Score 60-84 (Tier 2: Amber Path) ──► Sandbox Active + Live Cap (₹50k/day) + Step-Up KYC
   └── Score < 60  (Tier 3: Red Path)   ──► Quarantined + Cryptographic Reason Ledger + Ops Review
```

---

## 3. Deep-Dive: Algorithmic & Mathematical Components

### 3.1. Deterministic Structural Validators (Zero LLM Hallucination)
Before any external API or LLM is queried, strict mathematical validations run locally:

1. **GSTIN Mod-36 Checksum**:
   A 15-character GSTIN is structured as `22AAAAA0000A1Z5`. The 15th check digit is computed via weighted Modulo 36:
   $$\text{Check Digit} = \left( 36 - \left( \sum_{i=1}^{14} w_i \cdot \text{val}(c_i) \pmod{36} \right) \right) \pmod{36}$$
   Any OCR or merchant input failing this checksum is rejected instantly without incurring paid external API charges.

2. **Aadhaar Verhoeff Dihedral $D_5$ Check**:
   Validates the 12-digit UID using the dihedral permutation and multiplication matrices over group $D_5$.

3. **Fuzzy Entity Name Matching Engine**:
   To handle Indian multilingual transliterations and honorific variances (*M/s*, *Pvt Ltd*, *Private Limited*, *Shri*, *Kumar*), the matching engine uses a hybrid metric:
   $$\text{Match Score} = 0.50 \cdot \text{Jaro-Winkler}(S_1, S_2) + 0.30 \cdot \text{TokenSortRatio}(S_1, S_2) + 0.20 \cdot \text{SoundexMatch}(S_1, S_2)$$
   - $\text{Score} \ge 0.88 \implies$ Exact Semantic Match (Auto-Approved).
   - $0.70 \le \text{Score} < 0.88 \implies$ Flagged for Bank Penny Drop confirmation.
   - $\text{Score} < 0.70 \implies$ Name Mismatch Exception.

---

## 4. Bayesian Fraud Scoring & Merchant Risk Tiering

Instead of binary pass/fail heuristics, DrishtiKYC computes an explainable **Merchant Integrity Score** ($S \in [0, 100]$):

### Scoring Parameters:
| Dimension | Signal / Metric | Weight | Anomaly Trigger |
| :--- | :--- | :---: | :--- |
| **Registry Identity** | PAN + GSTIN + MCA21 alignment | 25% | Entity name or director DIN mismatch |
| **Operational Track Record** | GSTN GSTR-3B filing regularity | 20% | $>3$ consecutive unfiled quarters |
| **Entity Health** | MCA charge registry / Defaulter list | 15% | Active unreleased bank charges / Struck-off DIN |
| **Banking Verification** | Penny drop match & IFSC branch validity | 15% | High-risk cooperative bank / Virtual bank account |
| **Device & Biometrics** | Passive liveness + IP/Proxy Risk | 15% | TOR/Data Center IP, spoofed EXIF metadata |
| **Graph Proximity** | Shared director/address graph clustering | 10% | Shared registered office with $\ge 5$ dormant firms |

$$\text{Final Score } S = \sum_{j=1}^{6} w_j \cdot s_j$$

### Dynamic Settlement & Activation Policies:
- **Tier 1 ($S \ge 85$) — Instant Green Path**:
  - Full Live Activation in $<30$ seconds.
  - Standard settlement cycle ($T+2$).
  - Full payment method suite (Cards, UPI, Netbanking, EMI, Wallets).
- **Tier 2 ($60 \le S < 85$) — Amber Guardrail Path**:
  - Instant Sandbox access + Live activation capped at ₹50,000/day.
  - Rolling settlement reserve (5% held for 14 days).
  - Automated webhook prompt requesting secondary proof (e.g., Utility bill or 6-month bank statement).
- **Tier 3 ($S < 60$) — Red Quarantine Path**:
  - Activation blocked.
  - Merchant account created in `created` state (not `activated`).
  - Audit trail exported with exact breakdown of failed invariants.

---

## 5. Razorpay Platform API Integration Architecture

DrishtiKYC directly interfaces with Razorpay's Production API primitives:

### 5.1. Linked Account Provisioning (`POST /v1/accounts`)
```json
{
  "email": "finance@merchantdomain.com",
  "phone": "9876543210",
  "type": "standard",
  "legal_business_name": "Acme Retail Technologies Private Limited",
  "business_type": "private_limited",
  "profile": {
    "category": "ecommerce",
    "subcategory": "electronics",
    "addresses": {
      "registered": {
        "street1": "Koramanagala 4th Block",
        "city": "Bengaluru",
        "state": "KA",
        "postal_code": "560034",
        "country": "IN"
      }
    }
  },
  "notes": {
    "drishti_score": "94.2",
    "risk_tier": "TIER_1_GREEN",
    "decision_id": "dec_kyc_89af3b2c"
  }
}
```

### 5.2. Stakeholder KYC Binding (`POST /v1/stakeholders`)
Binds Directors / Ultimate Beneficial Owners (UBOs) owning $\ge 10\%$ equity:
- Transmits verified DIN, PAN, and Aadhaar OKYC reference tokens.
- Records executive signing authority for legal terms.

### 5.3. Dynamic Product Enablement (`POST /v1/products`)
Enables payment methods and features based on the calculated risk tier:
- `payment_gateway`: Enabled automatically.
- `route`: Split settlement enabled for marketplace merchants.
- `instant_settlements`: Enabled only for $S \ge 90$ with clean banking history.

---

## 6. Security, Privacy & Regulatory Compliance

### 6.1. Digital Personal Data Protection (DPDP) Act 2023
- **Zero Raw Aadhaar Storage**: The 12-digit Aadhaar number is never written to disk or logs. Only the last 4 digits (`XXXX-XXXX-1234`) and the SHA-256 hash of the UIDAI XML digital signature are stored.
- **Purpose Limitation & Ephemeral Storage**: Uploaded document images are processed in-memory, hashed, and immediately archived to client-controlled private object storage with AES-256-GCM envelope encryption.

### 6.2. RBI Digital Lending & KYC Master Directions
- **V-CIP (Video Customer Identification Process) Ready**: Compliant with RBI guidelines for geolocated, live-timestamped, random question-prompted video capture.
- **CKYCR Automated Filing**: Auto-generates standard 14-digit Central KYC Registry format payloads for rapid reporting to CERSAI.

---

## 7. Hackathon 5-Minute Live Demo Plan

Judges evaluate functioning prototypes on speed, exception handling, and edge-case intelligence.

| Step | Time | Scenario / Action | What Judges See on the Screen |
| :--- | :---: | :--- | :--- |
| **1** | **0:00–0:30** | **The Problem Pitch** | Highlight that 40% of merchants abandon onboarding due to 3-day verification delays and false name mismatch rejections. |
| **2** | **0:30–1:45** | **Live Golden Path (Instant <20s)** | Upload legitimate PAN, GSTIN, and Cheque. System extracts OCR, runs Mod-36 checksum, calls mock MCA21/GSTN, computes Score (94/100), and provisions live Razorpay Account ID (`acc_...`) via API. |
| **3** | **1:45–2:45** | **Adversarial Attack: Forged GSTIN** | Upload a fabricated GSTIN image with altered state code. DrishtiKYC flags Mod-36 checksum failure, rejects without calling paid registries, and highlights exact forged characters on the UI. |
| **4** | **2:45–3:45** | **Fuzzy Name Transliteration** | Upload PAN *"Suresh Kumar Gupta"* and Bank Cheque *"S. K. Gupta"*. System performs hybrid Levenshtein-Jaro matching + Bank Penny Drop, auto-resolving the ambiguity without human intervention. |
| **5** | **3:45–4:30** | **Shell Company / Dormant DIN Alert** | Submit entity with director DIN matching a struck-off shell company network. System visualizes the entity connection graph and routes account to Tier 3 Quarantine. |
| **6** | **4:30–5:00** | **Architectural Honesty & Production Path** | Show clean Go/Python microservice architecture, OpenAPI spec, DPDP zero-PII guarantee, and Razorpay API readiness. |

---

## 8. Competitive Advantage Matrix

| Capability | Legacy Manual Ops | Competitors (Signzy / HyperVerge / IDfy) | **DrishtiKYC (Our Solution)** |
| :--- | :---: | :---: | :---: |
| **End-to-End Latency** | 24–72 hours | 5–15 minutes (multi-step calls) | **< 30 seconds (Unified pipeline)** |
| **GSTIN Mod-36 Pre-Filter** | ❌ No | ❌ Rare (calls API directly) | ✅ **Instant zero-cost local validation** |
| **Fuzzy Name Resolution** | ❌ Manual Queue | ⚠️ Basic string distance | ✅ **Hybrid Jaro-Winkler + Penny Drop** |
| **Shell Company Graph Check** | ❌ No | ❌ Paid enterprise add-on | ✅ **Built-in Director/Address graph** |
| **Dynamic Risk Tiering** | ❌ Binary Pass/Fail | ⚠️ Rule-based static flags | ✅ **Bayesian adaptive caps & reserve** |
| **Razorpay Native Sync** | ❌ Custom integration | ❌ Generic Webhooks | ✅ **Direct `POST /v1/accounts` provision** |

---

## 9. Technology Stack

- **Backend / Core Engine**: Python 3.11 / FastAPI & Go (High-throughput deterministic validation services).
- **Computer Vision & Document AI**: TrOCR / PaddleOCR + LayoutLMv3 for structured document parsing; OpenCV for Error Level Analysis (ELA) and tamper detection.
- **Frontend / Merchant Experience**: Next.js 15, Tailwind CSS, Lucide icons, Framer Motion for smooth micro-animations.
- **Database & Storage**: PostgreSQL with `pgvector` for document embedding similarity + SQLite WAL for local sandbox mode.
- **Integration Layer**: Official Razorpay Python / REST API client for linked accounts, stakeholders, and product configuration.
