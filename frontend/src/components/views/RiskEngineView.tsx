"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  Layers, 
  Activity,
  ArrowRight
} from "lucide-react";
import RiskRadarChart from "@/components/RiskRadarChart";

export default function RiskEngineView() {
  const [selectedTier, setSelectedTier] = useState<"TIER_1_GREEN" | "TIER_2_AMBER" | "TIER_3_RED">("TIER_1_GREEN");

  const sampleDimensionScores = {
    registry_identity: 96,
    operational_filings: 94,
    mca_health: 98,
    banking_penny_drop: 99,
    document_forensics: 95,
    graph_proximity: 88
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Explainable Bayesian Risk Engine & Policy Orchestrator
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multivariate Bayesian risk scoring engine with automated Razorpay gateway policy controls and statutory reserves
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold font-mono">
            Bayesian Weight Matrix: India Corporate v3.1
          </span>
        </div>
      </div>

      {/* 6-Dimension Radar Chart Component */}
      <RiskRadarChart
        score={94}
        dimensionScores={sampleDimensionScores}
        riskTier={selectedTier}
      />

      {/* Autonomous Gateway Tier Policies */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Autonomous Activation Policy Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1 Green */}
          <div
            onClick={() => setSelectedTier("TIER_1_GREEN")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              selectedTier === "TIER_1_GREEN"
                ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Tier 1: Green Path
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                Score ≥ 85
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <li>• Instant Live PG Provisioning (&lt;30s)</li>
              <li>• Daily Limit: ₹25,00,000 / day</li>
              <li>• Settlement Cycle: T+2 Standard</li>
              <li>• Instant Payouts: Active</li>
              <li>• Rolling Reserve: 0.0%</li>
            </ul>
          </div>

          {/* Tier 2 Amber */}
          <div
            onClick={() => setSelectedTier("TIER_2_AMBER")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              selectedTier === "TIER_2_AMBER"
                ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Tier 2: Amber Path
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                Score 60–84
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <li>• Sandbox Active + Live Capped</li>
              <li>• Daily Live Limit: ₹50,000 / day</li>
              <li>• Settlement Cycle: T+4</li>
              <li>• Rolling Reserve: 5% (14 Days)</li>
              <li>• Step-Up KYC Webhook Triggered</li>
            </ul>
          </div>

          {/* Tier 3 Red */}
          <div
            onClick={() => setSelectedTier("TIER_3_RED")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              selectedTier === "TIER_3_RED"
                ? "bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-md"
                : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Tier 3: Red Path
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold">
                Score &lt; 60
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <li>• Gateway Activation Blocked</li>
              <li>• Live Limit: ₹0 / day</li>
              <li>• Cryptographic Reason Signed</li>
              <li>• Automated Suspicious Activity Report</li>
              <li>• Escalated to Senior Compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
