"use client";

import React from "react";
import { DimensionScores } from "@/lib/types";
import { Shield, CheckCircle, AlertTriangle, XCircle, BarChart3 } from "lucide-react";

interface Props {
  score: number;
  dimensionScores: DimensionScores;
  riskTier: string;
}

export default function RiskRadarChart({ score, dimensionScores, riskTier }: Props) {
  const dimensions = [
    { key: "registry_identity", label: "Registry Identity Alignment", weight: "25%", score: dimensionScores.registry_identity || 0, desc: "MCA21 & ITD Active Records" },
    { key: "operational_filings", label: "GSTR-3B Statutory Filings", weight: "20%", score: dimensionScores.operational_filings || 0, desc: "12-Month Regularity Ratio" },
    { key: "mca_health", label: "MCA Entity & Charge Solvency", weight: "15%", score: dimensionScores.mca_health || 0, desc: "Section 248 Defaulter Check" },
    { key: "banking_penny_drop", label: "NPCI / Bank Penny Drop Invariance", weight: "15%", score: dimensionScores.banking_penny_drop || 0, desc: "CBS Beneficiary String Distance" },
    { key: "document_forensics", label: "Forensic Layer Integrity (ELA)", weight: "15%", score: dimensionScores.document_forensics || 0, desc: "Quantization Artifact Inspection" },
    { key: "graph_proximity", label: "Shell Graph Network Link Risk", weight: "10%", score: dimensionScores.graph_proximity || 0, desc: "DIN & Struck-off Clustering" }
  ];

  const getTierDetails = (tier: string) => {
    switch (tier) {
      case "TIER_1_GREEN":
        return {
          title: "Tier 1: Green Path (Autonomous Live Activation)",
          badge: "bg-emerald-950/80 text-emerald-400 border-emerald-500/40",
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          accent: "text-emerald-400",
          desc: "Full Live Gateway Provisioned via POST /v1/accounts in <30s. Zero manual ops review."
        };
      case "TIER_2_AMBER":
        return {
          title: "Tier 2: Amber Path (Capped Live Gateway)",
          badge: "bg-amber-950/80 text-amber-400 border-amber-500/40",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          accent: "text-amber-400",
          desc: "Sandbox Active + ₹50k/day live cap. 5% rolling reserve + Step-Up KYC triggered."
        };
      default:
        return {
          title: "Tier 3: Red Path (Regulatory Quarantine)",
          badge: "bg-rose-950/80 text-rose-400 border-rose-500/40",
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          accent: "text-rose-400",
          desc: "Merchant quarantined with cryptographic SHA-256 reason audit ledger."
        };
    }
  };

  const tierInfo = getTierDetails(riskTier);

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/30">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Explainable Bayesian Risk Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            6-dimension posterior probability distribution under Indian statutory regulatory weights
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto ${tierInfo.badge}`}>
          {tierInfo.icon}
          {riskTier.replace(/_/g, " ")}
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-5 flex items-center justify-between">
        <div className="text-xs">
          <div className="font-bold text-slate-200">{tierInfo.title}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{tierInfo.desc}</div>
        </div>
        <div className="text-right shrink-0 pl-3">
          <div className="text-xs text-slate-400 font-mono">Total Score</div>
          <div className={`text-xl font-black font-mono ${tierInfo.accent}`}>
            {score}<span className="text-xs text-slate-500">/100</span>
          </div>
        </div>
      </div>

      {/* 6 Dimension Breakdown Bars (Clean layout, no overlapping) */}
      <div className="space-y-3">
        {dimensions.map((dim) => {
          const isGood = dim.score >= 80;
          const isMid = dim.score >= 60 && dim.score < 80;

          return (
            <div key={dim.key} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="truncate pr-2">
                  <span className="text-slate-200 font-semibold">{dim.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">Weight: {dim.weight}</span>
                </div>
                <span className={`font-mono font-bold shrink-0 ${isGood ? "text-emerald-400" : isMid ? "text-amber-400" : "text-rose-400"}`}>
                  {dim.score}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isGood ? "bg-emerald-500" : isMid ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${dim.score}%` }}
                ></div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono truncate">
                {dim.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
