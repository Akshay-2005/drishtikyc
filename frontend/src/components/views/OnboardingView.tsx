"use client";

import React, { useState } from "react";
import { 
  Building2, 
  FileCheck, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ArrowRight,
  UploadCloud
} from "lucide-react";
import { runScenario } from "@/lib/api";
import { PipelineResult } from "@/lib/types";
import confetti from "canvas-confetti";

interface Props {
  onVerificationComplete?: (res: PipelineResult) => void;
}

export default function OnboardingView({ onVerificationComplete }: Props) {
  const [formData, setFormData] = useState({
    businessName: "Tata Digital Private Limited",
    entityType: "Private Limited Company",
    cin: "U72900MH2019PTC322568",
    pan: "AABCT1234T",
    gstin: "27AABCT1234T1Z5",
    bankAccount: "987654321012",
    ifsc: "HDFC0000060",
    aadhaarLast4: "1234",
    scenario: "golden_path"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);

  const presets = [
    {
      label: "Tata Digital (Golden Path)",
      scenario: "golden_path",
      data: {
        businessName: "Tata Digital Private Limited",
        entityType: "Private Limited Company",
        cin: "U72900MH2019PTC322568",
        pan: "AABCT1234T",
        gstin: "27AABCT1234T1Z5",
        bankAccount: "987654321012",
        ifsc: "HDFC0000060",
        aadhaarLast4: "1234"
      }
    },
    {
      label: "Kuber FinTech (Forged GSTIN)",
      scenario: "forged_gstin",
      data: {
        businessName: "Kuber FinTech Services Private Limited",
        entityType: "Private Limited Company",
        cin: "U74999GJ2022PTC998877",
        pan: "AABCK9999F",
        gstin: "24AABCK9999F1Z9",
        bankAccount: "112233445566",
        ifsc: "ICIC0000104",
        aadhaarLast4: "9876"
      }
    },
    {
      label: "Infosys BPM (Fuzzy Name Acronym)",
      scenario: "fuzzy_name",
      data: {
        businessName: "Infosys BPM Limited",
        entityType: "Public Limited Company",
        cin: "U72200KA2002PLC030310",
        pan: "AABCI3344M",
        gstin: "29AABCI3344M1ZR",
        bankAccount: "556677889900",
        ifsc: "SBIN0000456",
        aadhaarLast4: "3344"
      }
    },
    {
      label: "Alaknanda Infra (Shell Entity)",
      scenario: "shell_network",
      data: {
        businessName: "Alaknanda Infrastructure & Trading Corp",
        entityType: "Limited Liability Partnership",
        cin: "U51909GJ2020PTC900222",
        pan: "AABCA7777M",
        gstin: "24AABCA7777M1Z4",
        bankAccount: "998877665544",
        ifsc: "KKBK0000210",
        aadhaarLast4: "7777"
      }
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setFormData({
      ...preset.data,
      scenario: preset.scenario
    });
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await runScenario(formData.scenario);
      setResult(res);
      if (onVerificationComplete) onVerificationComplete(res);
      if (res.decision.verdict === "INSTANT_LIVE_ACTIVATED") {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Verification execution failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Autonomous Merchant Onboarding Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit statutory business credentials for autonomous 5-tier verification and instantaneous Razorpay Live Gateway provisioning
          </p>
        </div>

        {/* DPDP Compliance Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>DPDP Act 2023 Compliant</span>
        </div>
      </div>

      {/* Demo Preset Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Quick Demo Presets for Evaluators & Judges</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`px-3 py-2 text-left rounded-xl text-xs font-semibold transition-all border ${
                formData.scenario === p.scenario
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form & Live Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Intake Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Statutory Corporate Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Legal Entity Registered Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Entity Structure
                </label>
                <input
                  type="text"
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate CIN / LLPIN
                </label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goods & Services Tax ID (GSTIN)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Settlement Account No.
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank IFSC
                </label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Signatory Aadhaar (DPDP Masked: Last 4 digits only)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono border border-slate-200 dark:border-slate-700">
                  XXXX - XXXX -
                </span>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.aadhaarLast4}
                  onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                  className="w-24 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Autonomous 5-Tier Verification Engine...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Run Autonomous KYC & Provision Live Gateway
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right 5 cols: Instant Live Result & Linked Account Provisioning */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Verification Verdict
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    result.decision.verdict === "INSTANT_LIVE_ACTIVATED"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                      : result.decision.verdict === "CONDITIONAL_APPROVAL"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                  }`}
                >
                  {result.decision.verdict.replace(/_/g, " ")}
                </span>
              </div>

              {/* Drishti Score & Latency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">
                    Drishti Score
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                    {result.drishti_score}/100
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">
                    Pipeline Latency
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {(result.total_latency_ms / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>

              {/* Provisioned Razorpay Account */}
              {result.razorpay_provisioning.account && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      Razorpay Live Account
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300">
                      LIVE ACTIVE
                    </span>
                  </div>
                  <div className="font-mono text-xs text-white font-bold">
                    {result.razorpay_provisioning.account.id}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Daily Limit: <strong className="text-emerald-400">₹{result.decision.daily_transaction_cap_inr?.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              )}

              {/* Cryptographic SHA-256 Audit Digest */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-bold">
                  Immutable Audit Digest
                </div>
                <div className="text-slate-700 dark:text-slate-300 break-all text-[10px]">
                  {result.decision.audit_token}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ready for Instant Intake
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Select one of the demo presets above or enter custom statutory details, then click Run Autonomous KYC to view instant results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
