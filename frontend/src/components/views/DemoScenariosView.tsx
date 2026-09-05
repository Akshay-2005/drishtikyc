"use client";

import React, { useState } from "react";
import { PlayCircle, ShieldCheck, AlertTriangle, Cpu, Network, CheckCircle2, ArrowRight, Loader2, Zap, ShieldAlert, Layers } from "lucide-react";
import { runScenario } from "@/lib/api";
import { PipelineResult } from "@/lib/types";
import confetti from "canvas-confetti";

interface Props {
  onSelectResult: (res: PipelineResult) => void;
}

export default function DemoScenariosView({ onSelectResult }: Props) {
  const [runningId, setRunningId] = useState<string | null>(null);

  const scenarios = [
    {
      id: "golden_path",
      name: "Scenario 1: Autonomous Golden Path (Tata Digital)",
      subtitle: "Instant Live Gateway Provisioning in <3 seconds",
      tag: "AUTO APPROVED",
      tagColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      desc: "Tata Digital submits verified statutory credentials. MCA21 and ITD records match perfectly. Penny drop beneficiary verified. Razorpay Linked Account provisioned instantaneously with ₹25L daily limit.",
      metrics: [
        { label: "Execution Time", value: "2.4s" },
        { label: "Bayesian Score", value: "96 / 100" },
        { label: "Decision", value: "Tier 1: Green Path" }
      ]
    },
    {
      id: "forged_gstin",
      name: "Scenario 2: Adversarial Checksum Tampering (Kuber FinTech)",
      subtitle: "Zero-cost forgery interception at Tier 2 in 0.4s",
      tag: "FLAGGED & BLOCKED",
      tagColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
      desc: "Adversary alters one character in GSTIN to bypass visual review. Deterministic Mod-36 checksum mathematical validator intercepts the forgery in 0ms before calling any paid third-party APIs.",
      metrics: [
        { label: "Interception Speed", value: "0.4s (0ms gate)" },
        { label: "API Cost Saved", value: "₹142.50" },
        { label: "Decision", value: "Tier 3: Quarantine" }
      ]
    },
    {
      id: "fuzzy_name",
      name: "Scenario 3: Fuzzy Acronym Transliteration (Infosys BPM)",
      subtitle: "High-confidence entity resolution without human ops",
      tag: "RESOLVED & APPROVED",
      tagColor: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      desc: "Document displays 'Infosys Business Process Management Limited' while bank penny drop returns 'Infosys BPM Ltd'. Combined Jaro-Winkler and corporate acronym expansion reconciles with 98.4% confidence.",
      metrics: [
        { label: "Match Confidence", value: "98.4%" },
        { label: "Ops Time Saved", value: "48 Hours" },
        { label: "Decision", value: "Tier 1: Green Path" }
      ]
    },
    {
      id: "shell_network",
      name: "Scenario 4: Shell Entity & DIN Cluster (Alaknanda Infra)",
      subtitle: "Companies Act Section 248 graph anomaly detection",
      tag: "REGULATORY QUARANTINE",
      tagColor: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800",
      icon: <Network className="w-5 h-5 text-rose-500" />,
      desc: "Entity appears clean on individual registries, but graph traversal reveals director Vikramaditya Singhania (DIN: 09998888) is linked to two struck-off circular trading shell companies.",
      metrics: [
        { label: "Graph Clusters Flagged", value: "3 Struck-Off" },
        { label: "Risk Penalty", value: "-50 Points" },
        { label: "Decision", value: "Tier 3: Red Quarantine" }
      ]
    }
  ];

  const handleRun = async (sc: typeof scenarios[0]) => {
    setRunningId(sc.id);
    try {
      const res = await runScenario(sc.id);
      onSelectResult(res);
      if (res.decision.verdict === "INSTANT_LIVE_ACTIVATED") {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Scenario execution error:", err);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Razorpay Buildathon Live Pitch Scenarios
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curated statutory merchant scenarios demonstrating autonomous underwriting, forensic interception, and gateway provisioning
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold font-mono">
            4 Interactive Scenarios Ready
          </span>
        </div>
      </div>

      {/* CENTERPIECE: TIER WALKTHROUGH CONTRAST MATRIX */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C1530] to-slate-950 border border-blue-500/30 shadow-xl text-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                Presentation Centerpiece &bull; Side-by-Side Tier Walkthrough
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Autonomous Green Path vs. 0ms Adversarial Interception
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              ⚡ ₹142.50 External API Cost Saved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Green Path Card */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tier 1: Autonomous Green Path
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Tata Digital
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Statutory credentials match cleanly across all databases. Zero human touchpoints required.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-emerald-950/80">
                  <span className="text-slate-400">Tier 1: DPDP Ingestion</span>
                  <span className="text-emerald-400 font-bold">PII Masked &amp; Vaulted</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-emerald-950/80">
                  <span className="text-slate-400">Tier 2: Math Checksum</span>
                  <span className="text-emerald-400 font-bold">Mod-36 Pass ('5' Verified)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-emerald-950/80">
                  <span className="text-slate-400">Tier 3: Multi-Registry</span>
                  <span className="text-emerald-400 font-bold">MCA21 &amp; GSTR-3B Active</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-emerald-950/80">
                  <span className="text-slate-400">Tier 4: Graph Proximity</span>
                  <span className="text-emerald-400 font-bold">0 Shell Links Flagged</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Tier 5: Razorpay Provisioning</span>
                  <span className="text-emerald-400 font-bold">Live Keys in &lt;2.4s</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRun(scenarios[0])}
              disabled={runningId !== null}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/30"
            >
              {runningId === "golden_path" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Run Live Green Path (&lt;2.4s)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Adversarial Checksum Forgery Card */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5" /> Tier 2: Adversarial Forgery Trap
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  Kuber FinTech
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Altered check digit caught locally at Tier 2 in 0ms. Halts expensive external API queries.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-rose-950/80">
                  <span className="text-slate-400">Tier 1: DPDP Ingestion</span>
                  <span className="text-emerald-400 font-bold">PII Masked &amp; Vaulted</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-rose-950/80">
                  <span className="text-slate-400">Tier 2: Math Checksum</span>
                  <span className="text-rose-400 font-bold">HALTED 0ms (Mod-36 '9' ≠ '1')</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-rose-950/80">
                  <span className="text-slate-400">External Registry Calls</span>
                  <span className="text-emerald-400 font-bold">SKIPPED (₹142.50 Saved)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-rose-950/80">
                  <span className="text-slate-400">Tier 4: Graph Proximity</span>
                  <span className="text-rose-400 font-bold">Sec 248 Shell Cluster</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Tier 5: Underwriting Decision</span>
                  <span className="text-rose-400 font-bold">SIU Hard Quarantine</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRun(scenarios[1])}
              disabled={runningId !== null}
              className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-600/30"
            >
              {runningId === "forged_gstin" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Run Live Forgery Trap (0ms Gate)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => {
          const isRunning = runningId === sc.id;

          return (
            <div
              key={sc.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {sc.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {sc.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sc.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${sc.tagColor}`}>
                    {sc.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {sc.desc}
                </p>

                {/* Statutory Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {sc.metrics.map((m, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">{m.label}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution CTA Button */}
              <button
                onClick={() => handleRun(sc)}
                disabled={isRunning}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Executing Live AI Pipeline...
                  </>
                ) : (
                  <>
                    <span>Run Live Demonstration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
