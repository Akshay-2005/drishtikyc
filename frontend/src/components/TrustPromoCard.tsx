"use client";

import React, { useState } from "react";
import { ArrowUpRight, Zap, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface TrustPromoCardProps {
  onRunScenario?: (scenarioId: string) => void;
  onViewScenarios?: () => void;
}

export default function TrustPromoCard({ onRunScenario, onViewScenarios }: TrustPromoCardProps) {
  const [activeRunning, setActiveRunning] = useState<string | null>(null);

  const handleLaunch = (scenarioId: string) => {
    setActiveRunning(scenarioId);
    if (onRunScenario) {
      onRunScenario(scenarioId);
    }
    setTimeout(() => {
      setActiveRunning(null);
    }, 1200);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#070D1F] via-[#0B1536] to-[#080E24] border border-[#1E2E62] shadow-xl flex flex-col justify-between text-white relative overflow-hidden h-full group">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/30 transition-all"></div>
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="space-y-3 relative z-10">
        {/* Badge & Live Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-mono font-bold text-blue-300">
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>PITCH SHOWCASE</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> 0ms Gate Active
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
            Cost Efficiency &amp; Tier Contrast
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Local <strong className="text-emerald-400">Mod-36</strong> math halts forged payloads in 0ms, saving <strong className="text-white">₹142.50</strong> per attempt before external API billing.
          </p>
        </div>

        {/* 1-Click Interactive Pitch Triggers */}
        <div className="space-y-2 pt-1">
          {/* Green Path Button */}
          <button
            onClick={() => handleLaunch("golden_path")}
            disabled={activeRunning !== null}
            className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/40 transition-all flex items-center justify-between gap-2 group/btn cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                {activeRunning === "golden_path" ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>Tier 1: Green Path</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 font-mono">
                    &lt; 2.4s
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Tata Digital &bull; Instant live PG keys
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Adversarial Forgery Button */}
          <button
            onClick={() => handleLaunch("forged_gstin")}
            disabled={activeRunning !== null}
            className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-rose-950/50 to-slate-900/80 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-900/40 transition-all flex items-center justify-between gap-2 group/btn cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30">
                {activeRunning === "forged_gstin" ? (
                  <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span>Tier 2: Forgery Trap</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-200 font-mono">
                    ₹142.50 Saved
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Kuber FinTech &bull; 0ms local rejection
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-rose-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>

      {/* Footer Branding & Nav */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
        <button
          onClick={onViewScenarios}
          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>All 4 Scenarios</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
          RAZORPAY 2026
        </span>
      </div>
    </div>
  );
}
