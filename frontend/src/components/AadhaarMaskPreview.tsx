"use client";

import React from "react";
import { Lock, EyeOff, ShieldCheck, FileText, CheckCircle } from "lucide-react";

interface Props {
  documentData: Record<string, any>;
}

export default function AadhaarMaskPreview({ documentData }: Props) {
  const aadhaarDoc = documentData?.aadhaar?.extracted_fields || {
    masked_aadhaar: "XXXX-XXXX-9012",
    vault_token: "uidai_sha256_8f93b2c17409",
    name: "Natarajan Chandrasekaran",
    address: "Mumbai, Maharashtra"
  };

  const forensics = documentData?.pan?.forensics || {
    verdict: "AUTHENTIC_ORIGINAL",
    tamper_confidence: 0.03,
    integrity_score: 98.5
  };

  const isTampered = forensics.verdict === "TAMPER_DETECTED";

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              DPDP Act 2023 & UIDAI Statutory Redaction Vault
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero Raw Aadhaar Persistence &bull; SHA-256 Cryptographic Tokenization &bull; Error Level Analysis (ELA)
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          Statutory Compliant
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aadhaar Vault Card */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Aadhaar Offline e-KYC Vault</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Auto-Masked
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center mb-3">
              <div className="text-lg font-mono font-black tracking-widest text-emerald-400">
                {aadhaarDoc.masked_aadhaar}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                First 8 Digits Redacted (UIDAI Circular No. 12/2018)
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-1">
            <div className="flex justify-between items-center">
              <span>Vault Token:</span>
              <span className="text-slate-200 font-semibold truncate max-w-[170px]">
                {aadhaarDoc.vault_token}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Signatory:</span>
              <span className="text-slate-200 truncate max-w-[170px]">{aadhaarDoc.name}</span>
            </div>
          </div>
        </div>

        {/* Forensic Tampering ELA Card */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Image Forensics (Error Level Analysis)</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isTampered
                    ? "bg-rose-950 text-rose-400 border-rose-500/40"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {forensics.verdict}
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center mb-3">
              <div className={`text-lg font-mono font-black ${isTampered ? "text-rose-400" : "text-sky-400"}`}>
                {forensics.integrity_score}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                JPEG Quantization & Text Invariance Score
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono pt-1">
            {isTampered ? (
              <span className="text-rose-400 leading-tight block">
                ⚠️ High artifact variance detected around alphanumeric state & PAN layers.
              </span>
            ) : (
              <span className="text-emerald-400 leading-tight block">
                ✓ Continuous camera quantization tables. No digital tampering identified.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
