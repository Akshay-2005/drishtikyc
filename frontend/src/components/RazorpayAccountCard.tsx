"use client";

import React, { useState } from "react";
import { RazorpayAccount } from "@/lib/types";
import { Check, Copy, Key, ShieldCheck, CreditCard, Lock, ArrowUpRight } from "lucide-react";

interface Props {
  account: RazorpayAccount | null;
  riskTier: string;
  drishtiScore: number;
}

export default function RazorpayAccountCard({ account, riskTier, drishtiScore }: Props) {
  const [copiedKey, setCopiedKey] = useState(false);

  if (!account) {
    return (
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-white">Razorpay Accounts API Provisioning</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            Awaiting Verification
          </span>
        </div>
        <div className="py-8 text-center text-slate-500 text-xs font-mono">
          Execute verification pipeline to trigger automated account provisioning via `POST /v1/accounts`.
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const isLiveActive = riskTier === "TIER_1_GREEN";

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Razorpay Linked Account
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PROVISIONED
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">{account.legal_business_name}</p>
          </div>
        </div>

        <div>
          {isLiveActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              LIVE ACTIVE (T+2)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <Lock className="w-3.5 h-3.5" />
              SANDBOX + ₹50K LIVE CAP
            </span>
          )}
        </div>
      </div>

      {/* Account Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-mono">
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Account ID:</span>
          <span className="text-blue-400 font-bold">{account.id}</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Daily Cap:</span>
          <span className="text-emerald-400 font-bold">
            ₹{parseInt(account.notes.daily_cap_inr || "0").toLocaleString()}
          </span>
        </div>
      </div>

      {/* API Key Box */}
      <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/90 mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Key className="w-3.5 h-3.5 text-blue-400" />
            {isLiveActive ? "Production Key (rzp_live)" : "Sandbox Test Key (rzp_test)"}
          </span>
          <button
            onClick={() => copyToClipboard(account.live_keys?.key_id || account.sandbox_keys.key_id)}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono"
          >
            {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey ? "Copied" : "Copy Key"}
          </button>
        </div>
        <div className="font-mono text-xs text-slate-200 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 truncate select-all">
          {account.live_keys?.key_id || account.sandbox_keys.key_id}
        </div>
      </div>

      {/* Activated Payment Rails */}
      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          ✓ UPI AutoPay
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          ✓ Domestic Cards
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          ✓ NetBanking (54 Banks)
        </span>
        {isLiveActive && (
          <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-600/40 text-blue-300 font-semibold">
            ✓ Instant Settlements Enabled
          </span>
        )}
      </div>
    </div>
  );
}
