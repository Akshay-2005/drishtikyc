# DrishtiKYC (AstraOnboard)
### AI-Powered Autonomous Onboarding & KYC Orchestration Engine
> **Razorpay Buildathon Track 02 Submission**  
> *Transforming high-friction 24–72 hour B2B merchant verification into a <30-second autonomous, fraud-resilient, regulatory-compliant activation pipeline.*

---

## 🌟 Executive Summary & Key Highlights
For payment aggregators (PAs) and payment gateways (PGs) operating under RBI Master Directions, merchant onboarding is a high-stakes bottleneck:
1. **Drop-off & Delay (24–72 Hours)**: Manual human document inspection leads to **~38% merchant abandonment**.
2. **Synthetic Identities & Shell Networks**: Fraudulent operators use dormant GSTINs, photo-tampered IDs, and struck-off DIN networks.
3. **Name Transliteration False Rejections**: Phonetic variances across Aadhaar, PAN, and Bank Accounts (*"Pradeep Kumar Sharma"* vs. *"P. K. Sharma"*) trigger unnecessary manual review queues.
4. **Strict Compliance Mandates**: RBI KYC Directions, DPDP Act 2023 (zero raw Aadhaar storage, SHA-256 vault tokens), PMLA 2002.

**DrishtiKYC** solves this with a **5-Tier Neurosymbolic Orchestration Pipeline**:
- **Deterministic Algorithmic Filters**: Mod-36 GSTIN checksum, Verhoeff $D_5$ Aadhaar validation, and PAN semantic checks reject forged documents locally in **0ms at zero external API cost**.
- **Real-Time Multi-Registry Mesh**: ITD/NSDL PAN status, GSTN GSTR-3B filing history, MCA21 CIN/DIN validation, NPCI Bank Penny Drop with Hybrid Jaro-Winkler fuzzy matching.
- **Bayesian Risk Engine & Shell Graph Radar**: 6-dimension dynamic risk scoring ($0-100$) and network link analysis detecting circular trading rings.
- **Native Razorpay API Integration**: Direct linked account provisioning via `POST /v1/accounts`, stakeholder binding (`POST /v1/stakeholders`), and dynamic payment method configuration (`POST /v1/products`).

---

## 🏗️ 5-Tier Architecture Pipeline

```
Merchant Uploads Documents / Enters Details
   │
   ▼
[ Tier 1: Ingestion & Document Normalization ]
   ├── Vision OCR & Document Classification (PAN, Aadhaar, GSTIN, Cheque, MOA)
   ├── Forensic Tampering / ELA (Error Level Analysis)
   └── Mandatory 8-Digit Aadhaar Masking (DPDP / UIDAI Compliance)
   │
   ▼
[ Tier 2: Deterministic Algorithmic & Structural Gate ] (Zero API Cost / Hallucination-Free)
   ├── Mod-36 GSTIN Checksum calculation (instant reject for forged GSTINs)
   ├── Verhoeff Dihedral (D5) Algorithm for Aadhaar
   └── PAN 4th/5th Character Semantic Invariants (Entity type: 'C', 'P', 'F', 'H')
   │
   ▼
[ Tier 3: Real-Time Multi-Registry Cross-Verification Mesh ]
   ├── ITD / NSDL: PAN Active & Seeded status
   ├── GSTN Portal: Active status, GSTR-3B filing regularity
   ├── MCA21: CIN/LLPIN validation, Director DIN status, Active charges
   ├── Bank IMPS Penny Drop: Account holder fuzzy name match (Jaro-Winkler ≥ 0.88)
   └── CKYCR: 14-digit KIN lookup
   │
   ▼
[ Tier 4: Bayesian Fraud Scoring & Shell Entity Detection ]
   ├── Graph Analysis: Shared DIN/Phone/Address across dormant/blacklisted firms
   ├── Passive Liveness & Biometric Verification
   └── Dynamic Bayesian Integrity Score (0 to 100)
   │
   ▼
[ Tier 5: Autonomous Decision & Razorpay Orchestration ]
   ├── Green Path (Score ≥ 85) ──► Instant Live PG Activation via Razorpay API (<30s)
   ├── Amber Path (Score 60–84) ──► Sandbox + Live Cap (₹50k/day) + Step-Up KYC
   └── Red Path   (Score < 60)  ──► Quarantined + Cryptographic Reason Ledger
```

---

## 🚀 Quickstart Guide

### 1. Start the Backend (FastAPI + Python 3.11+)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Backend API will be running at `http://localhost:8000` (Swagger docs at `/docs`).

### 2. Run Backend Tests
```bash
source backend/venv/bin/activate
PYTHONPATH=backend pytest backend/tests/ -v
```

### 3. Start the Frontend (Next.js 15 + Tailwind + TypeScript)
```bash
cd frontend
npm install
npm run dev -- -p 3000
```
Frontend will be running at `http://localhost:3000`.

---

## 🎯 Evaluator Demo Scenarios (1-Click on UI)

| Scenario | Merchant | Key Invariants Tested | Expected Verdict |
| :--- | :--- | :--- | :--- |
| **Scenario 1: Live Golden Path** | Acme Retail Technologies Pvt Ltd | Valid PAN, Mod-36 GSTIN checksum, active MCA CIN, clean filing track record. | **Tier 1: Green Path (Score 96)** &rarr; Instant Live PG Activation (`POST /v1/accounts`), Live Keys generated. |
| **Scenario 2: Adversarial Attack** | Apex Digital Paytech Pvt Ltd | Photoshopped GSTIN certificate with altered state check digit. | **Tier 3: Red Path** &rarr; Rejected at Tier 2 Mod-36 checksum locally in 0ms, saving external API costs. |
| **Scenario 3: Fuzzy Transliteration** | Suresh Kumar Gupta Enterprises | PAN *"Suresh Kumar Gupta"* vs Bank Cheque *"S. K. Gupta"*. | **Tier 1: Green Path** &rarr; Auto-matched via Hybrid Jaro-Winkler + Soundex + Penny Drop (92% confidence). |
| **Scenario 4: Shell Network Radar** | Vortex Mule Logistics Pvt Ltd | Director DIN `09998888` linked to 3 struck-off shell entities in Surat. | **Tier 3: Red Path** &rarr; Flagged by Tier 4 Graph Radar and quarantined with visual node-link evidence. |

---

## 🏆 Competitive Advantage Matrix

| Capability | Legacy Manual Ops | Generic Competitors | **DrishtiKYC (Our Solution)** |
| :--- | :---: | :---: | :---: |
| **End-to-End Latency** | 24–72 hours | 5–15 minutes | **< 30 seconds (Unified pipeline)** |
| **GSTIN Mod-36 Pre-Filter** | ❌ No | ❌ Rare (calls API directly) | ✅ **Instant zero-cost local validation** |
| **Fuzzy Name Resolution** | ❌ Manual Queue | ⚠️ Basic string distance | ✅ **Hybrid Jaro-Winkler + Penny Drop** |
| **Shell Company Graph Check** | ❌ No | ⚠️ Paid enterprise add-on | ✅ **Built-in Director/Address graph** |
| **Dynamic Risk Tiering** | ❌ Binary Pass/Fail | ⚠️ Static rules | ✅ **Bayesian adaptive caps & reserve** |
| **Razorpay Native Sync** | ❌ Custom script | ❌ Generic Webhooks | ✅ **Direct `POST /v1/accounts` provision** |

---

## 🔒 Security, Privacy & DPDP Compliance
- **Zero Raw Aadhaar Storage**: 12-digit Aadhaar numbers are never stored in disk or logs. Masked as `XXXX-XXXX-1234` with SHA-256 UIDAI vault tokens.
- **Deterministic Audit Trail**: Every decision generates a verifiable SHA-256 signed JSON manifest compliant with RBI Master Directions.
