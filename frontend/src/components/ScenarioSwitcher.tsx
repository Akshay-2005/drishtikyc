"use client";

import React from "react";
import { ScenarioItem } from "@/lib/types";
import { Building2, ShieldAlert, Sparkles, UserCheck, Play, ArrowUpRight, Cpu } from "lucide-react";

interface Props {
  scenarios: ScenarioItem[];
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  isRunning: boolean;
}

export default function ScenarioSwitcher({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  isRunning
}: Props) {
  const getScenarioMeta = (id: string) => {
    switch (id) {
      case "golden_path":
        return {
          tag: "Compliant Enterprise",
          badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/70",
          icon: <Building2 className="w-4 h-4 text-emerald-400" />,
          highlight: "Expected: Green Path (<20s Activation)"
        };
      case "forged_gstin":
        return {
          tag: "Adversarial Forgery Vector",
          badgeColor: "border-rose-500/40 text-rose-400 bg-rose-950/70",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          highlight: "Expected: Mod-36 Checksum Fail (0ms, ₹0 API Cost)"
        };
      case "fuzzy_name":
        return {
          tag: "Phonetic Transliteration",
          badgeColor: "border-sky-500/40 text-sky-400 bg-sky-950/70",
          icon: <UserCheck className="w-4 h-4 text-sky-400" />,
          highlight: "Expected: Auto-Resolved via Penny Drop"
        };
      case "shell_network":
        return {
          tag: "Circular Trading Ring",
          badgeColor: "border-amber-500/40 text-amber-400 bg-amber-950/70",
          icon: <Cpu className="w-4 h-4 text-amber-400" />,
          highlight: "Expected: Flagged Shell DIN Cluster & Quarantine"
        };
      default:
        return {
          tag: "Custom Test Vector",
          badgeColor: "border-blue-500/40 text-blue-400 bg-blue-950/70",
          icon: <Sparkles className="w-4 h-4 text-blue-400" />,
          highlight: "Dynamic Evaluation"
        };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Pre-configured Verification Profiles & Test Suites
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an enterprise test vector to trigger autonomous deterministic validation and multi-registry execution
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Ready for Instant Trigger
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((sc) => {
          const isSelected = selectedScenarioId === sc.scenario_id;
          const meta = getScenarioMeta(sc.scenario_id);

          return (
            <button
              key={sc.scenario_id}
              onClick={() => onSelectScenario(sc.scenario_id)}
              disabled={isRunning}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-gradient-to-b from-slate-800/95 to-slate-900/95 border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-500/50 -translate-y-0.5"
                  : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80 hover:-translate-y-0.5"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {meta.icon}
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${meta.badgeColor}`}>
                      {meta.tag}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition-colors line-clamp-1">
                  {sc.legal_name}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-2 truncate">
                  {meta.highlight}
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{sc.pan || "Proprietor"}</span>
                  <span className="flex items-center gap-1 text-blue-400 font-bold group-hover:text-blue-300">
                    <Play className="w-3 h-3 fill-current" /> Execute Pipeline
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
