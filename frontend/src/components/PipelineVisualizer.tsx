"use client";

import React, { useState } from "react";
import { TelemetryStep } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Cpu,
  Database,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Lock,
  Layers
} from "lucide-react";

interface Props {
  telemetry: TelemetryStep[];
  activeTierIndex?: number;
  isRunning?: boolean;
}

export default function PipelineVisualizer({ telemetry, activeTierIndex = 5, isRunning = false }: Props) {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "tier_1":
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case "tier_2":
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case "tier_3":
        return <Database className="w-5 h-5 text-purple-400" />;
      case "tier_4":
        return <Share2 className="w-5 h-5 text-emerald-400" />;
      case "tier_5":
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      default:
        return <Layers className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVATED":
      case "PASSED":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-900/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case "CAPPED_SANDBOX":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-900/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            TIER 2 CAPPED LIVE
          </span>
        );
      case "FAILED":
      case "QUARANTINED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-900/30">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case "SKIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-400 border border-slate-700">
            <Clock className="w-3.5 h-3.5" />
            SKIPPED (₹0 API COST)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              5-Tier Autonomous Orchestration Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deterministic mathematical filters, registry cross-verification, Bayesian scoring, and API sync
          </p>
        </div>

        {isRunning ? (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/15 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold rounded-full animate-pulse self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Pipeline Running...
          </span>
        ) : (
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Telemetry Synced
          </span>
        )}
      </div>

      {/* Tiers List */}
      <div className="space-y-3.5">
        {telemetry.map((step, idx) => {
          const isExpanded = expandedTier === step.tier_id;
          const isFailed = step.status === "FAILED" || step.status === "QUARANTINED";

          return (
            <div
              key={step.tier_id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isFailed
                  ? "bg-gradient-to-r from-rose-950/30 via-slate-950/80 to-slate-950/80 border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-950/20"
                  : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div
                onClick={() => setExpandedTier(isExpanded ? null : step.tier_id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                    {getTierIcon(step.tier_id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                        TIER 0{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{step.tier_name}</h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-300 font-bold">{step.duration_ms}ms</span>
                      </span>
                      {step.details?.zero_api_cost_saved && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px]">
                          ⚡ 0ms Rejection: ₹142.50 API Cost Saved
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(step.status)}
                  <button className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 bg-slate-950/90">
                  {/* Highlight Banner for 0ms Checksum Cost Savings */}
                  {step.details?.zero_api_cost_saved && (
                    <div className="mb-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>0ms Local Checksum Gate — 100% External API Cost Savings</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Deterministic Mod-36 weighted mathematical validation intercepted the invalid check digit in <strong>{step.duration_ms}ms</strong> locally.
                        Prevented <strong>₹142.50</strong> in unnecessary third-party registry API calls (MCA21: ₹75, GSTN: ₹45, Bank IMPS: ₹22.50).
                      </p>
                    </div>
                  )}

                  {/* Highlight Banner for Autonomous Live Gateway Activation */}
                  {step.status === "ACTIVATED" && (
                    <div className="mb-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Autonomous Live Gateway Provisioning — Green Path Tier 1</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Full statutory underwriting completed autonomously in <strong>&lt;2.4 seconds</strong> without human ops touchpoints. Razorpay Linked Account live with instant API keys.
                      </p>
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
                    <span>Deterministic Parameters & Field Audit</span>
                    <span className="text-blue-400 font-bold">Latency: {step.duration_ms}ms</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                    {Object.entries(step.details || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80"
                      >
                        <span className="text-slate-400 text-[11px] truncate pr-2">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-slate-100 font-bold text-right break-all">
                          {typeof val === "object" ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
