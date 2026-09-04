"use client";

import React from "react";
import { Network, AlertOctagon, ShieldAlert, Building2, UserX, AlertTriangle } from "lucide-react";
import NetworkGraphView from "@/components/NetworkGraphView";

export default function FraudNetworkView() {
  const formalShellGraph = {
    has_shell_anomaly: true,
    flagged_clusters_count: 3,
    flagged_clusters: [
      { cluster_id: "cluster_surat_01", risk_weight: 85, reason: "Common disqualified director across 3 struck-off paper billing companies" }
    ],
    graph_nodes: [
      { id: "target_entity", name: "Alaknanda Infrastructure & Trading Corp", type: "TARGET_ENTITY" as const, status: "UNDER_REVIEW", risk: "NORMAL" as const },
      { id: "dir_1", name: "Vikramaditya Singhania (DIN: 09998888)", type: "DIRECTOR" as const, status: "DIN_BLACKLISTED_SEC248", risk: "CRITICAL" as const },
      { id: "dir_2", name: "Rajeshwar Rao (DIN: 08887777)", type: "DIRECTOR" as const, status: "CHARGEBACK_RISK_ASSOCIATE", risk: "CRITICAL" as const },
      { id: "shell_1", name: "Apex Paper Invoicing Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "STRUCK_OFF_ROC_SURAT", risk: "BLOCKED" as const },
      { id: "shell_2", name: "Vortex Mule Logistics Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "GST_EVASION_SEIZED", risk: "BLOCKED" as const },
      { id: "shell_3", name: "Deccan Fast Capital Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "STRUCK_OFF_RBI", risk: "BLOCKED" as const }
    ],
    graph_links: [
      { source: "target_entity", target: "dir_1", label: "Director (45% Equity)" },
      { source: "target_entity", target: "dir_2", label: "Director (25% Equity)" },
      { source: "dir_1", target: "shell_1", label: "Former Director (2021)" },
      { source: "dir_1", target: "shell_2", label: "Former Director (2022)" },
      { source: "dir_2", target: "shell_3", label: "Former Director (2020)" }
    ],
    shell_penalty: 50,
    verdict: "SHELL_NETWORK_CLUSTER_DETECTED"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Shell Entity & Circular Trading Graph Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time knowledge graph traversal detecting Section 248 struck-off DIN clusters and synthetic merchant rings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold font-mono">
            Graph Anomaly: 3 High-Risk Rings
          </span>
        </div>
      </div>

      {/* Interactive Network Graph Component */}
      <NetworkGraphView graphData={formalShellGraph} />

      {/* Risk Advisory Alert */}
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
          <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>ROC Surat Compliance Advisory (Section 248 Companies Act)</span>
        </div>
        <p className="leading-relaxed">
          Director <strong>Vikramaditya Singhania (DIN: 09998888)</strong> holds 45% beneficial ownership in the target entity while previously serving as the primary signatory for two entities struck off by the Ministry of Corporate Affairs for circular invoicing. The autonomous risk scorer has applied a mandatory <strong>-50 penalty</strong> and routed the account to Regulatory Quarantine.
        </p>
      </div>
    </div>
  );
}
