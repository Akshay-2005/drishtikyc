"use client";

import React from "react";
import { ArrowUpRight, Zap } from "lucide-react";

export default function TrustPromoCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#0A1024] border border-[#1C2A54] shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
            Your Partner in <br />
            Trust and Growth
          </h3>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          AI-driven KYC. Real-time risk detection. Seamless Razorpay onboarding.
        </p>
      </div>

      <div className="pt-6 flex items-center gap-2">
        <span className="text-sm font-black font-sans tracking-tight text-white flex items-center gap-1.5">
          <span className="text-blue-400 font-bold">⚡ Razorpay</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 border-l border-slate-700 pl-2">
          BUILDATHON
        </span>
      </div>
    </div>
  );
}
