"use client";

import React from "react";
import { X, ShieldCheck, Zap, CreditCard, Lock, ArrowUpRight, Play } from "lucide-react";
import PipelineVisualizer from "@/components/PipelineVisualizer";
import ThreeDRiskVault from "@/components/ThreeDRiskVault";
import RiskRadarChart from "@/components/RiskRadarChart";
import RazorpayAccountCard from "@/components/RazorpayAccountCard";
import AadhaarMaskPreview from "@/components/AadhaarMaskPreview";
import NetworkGraphView from "@/components/NetworkGraphView";
import { PipelineResult } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: PipelineResult | null;
  isRunning?: boolean;
}

export default function VerificationDetailModal({ isOpen, onClose, result, isRunning = false }: Props) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0A1024] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070D1A]/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {result.merchant_summary?.legal_name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {result.decision?.risk_tier}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              PAN: {result.merchant_summary?.pan} &bull; GSTIN: {result.merchant_summary?.gstin} &bull; Latency: {result.total_latency_ms}ms
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Pipeline & DPDP Masking */}
            <div className="lg:col-span-7 space-y-6">
              <PipelineVisualizer telemetry={result.tier_telemetry} isRunning={isRunning} />
              <AadhaarMaskPreview documentData={result.tier1_documents} />
              {result.tier4_shell_graph && result.tier4_shell_graph.has_shell_anomaly && (
                <NetworkGraphView graphData={result.tier4_shell_graph} />
              )}
            </div>

            {/* Right 5 cols: 3D Vault & Razorpay Account */}
            <div className="lg:col-span-5 space-y-6">
              <ThreeDRiskVault
                riskTier={result.decision.risk_tier}
                score={result.drishti_score}
                auditToken={result.decision.audit_token}
              />
              <RiskRadarChart
                score={result.drishti_score}
                dimensionScores={result.dimension_scores}
                riskTier={result.decision.risk_tier}
              />
              <RazorpayAccountCard
                account={result.razorpay_provisioning?.account}
                riskTier={result.decision.risk_tier}
                drishtiScore={result.drishti_score}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            Cryptographic Audit Nonce: {result.decision?.audit_token?.slice(0, 24)}...
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
