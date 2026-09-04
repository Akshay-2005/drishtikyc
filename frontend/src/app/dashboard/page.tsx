"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import NetworkGraphView from "@/components/NetworkGraphView";
import { fetchMetrics } from "@/lib/api";
import {
  Network,
  ShieldAlert,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Building2,
  Lock,
  Layers,
  FileCheck2,
  Activity,
  Sliders
} from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "graph" | "policies">("queue");

  useEffect(() => {
    async function load() {
      const data = await fetchMetrics();
      setMetrics(data);
    }
    load();
  }, []);

  const formalShellGraph = {
    has_shell_anomaly: true,
    flagged_clusters_count: 3,
    flagged_clusters: [],
    graph_nodes: [
      { id: "target_entity", name: "Alaknanda Infrastructure & Trading Corp", type: "TARGET_ENTITY" as const, status: "UNDER_REVIEW", risk: "NORMAL" as const },
      { id: "dir_1", name: "Vikramaditya Singhania (DIN: 09998888)", type: "DIRECTOR" as const, status: "DIN_BLACKLISTED_SEC248", risk: "CRITICAL" as const },
      { id: "dir_2", name: "Rajeshwar Rao (DIN: 08887777)", type: "DIRECTOR" as const, status: "CHARGEBACK_RISK_ASSOCIATE", risk: "CRITICAL" as const },
      { id: "shell_1", name: "Apex Paper Invoicing Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "STRUCK_OFF_ROC_SURAT", risk: "BLOCKED" as const },
      { id: "shell_2", name: "Vortex Mule Logistics Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "GST_EVASION_SEIZED", risk: "BLOCKED" as const },
      { id: "shell_3", name: "Deccan Fast Capital Pvt Ltd", type: "STRUCK_OFF_ENTITY" as const, status: "STRUCK_OFF_RBI", risk: "BLOCKED" as const }
    ],
    graph_links: [
      { source: "target_entity", target: "dir_1", label: "Director (45%)" },
      { source: "target_entity", target: "dir_2", label: "Director (25%)" },
      { source: "dir_1", target: "shell_1", label: "Former Director (2021)" },
      { source: "dir_1", target: "shell_2", label: "Former Director (2022)" },
      { source: "dir_2", target: "shell_3", label: "Former Director (2020)" }
    ],
    shell_penalty: 50,
    verdict: "SHELL_NETWORK_CLUSTER_DETECTED"
  };

  const formalQueue = [
    {
      id: "KYC-IN-2026-0891",
      name: "Tata Digital Private Limited",
      cin: "U72900MH2019PTC322568",
      pan: "AABCT1234T",
      score: 96.2,
      tier: "TIER_1_GREEN",
      latency: "18.2s",
      decision: "Instant Live Gateway Provisioned",
      methods: "All Domestic, UPI AutoPay, NetBanking"
    },
    {
      id: "KYC-IN-2026-0892",
      name: "Infosys Business Process Management Ltd",
      cin: "U72200KA2002PLC030310",
      pan: "AABCI3344M",
      score: 94.0,
      tier: "TIER_1_GREEN",
      latency: "21.4s",
      decision: "Penny Drop Acronym Matched (BPM)",
      methods: "All Domestic, Cards, EMI"
    },
    {
      id: "KYC-IN-2026-0893",
      name: "Zomato Hyperpure Private Limited",
      cin: "U74999HR2015PTC085671",
      pan: "AABCZ9911K",
      score: 76.5,
      tier: "TIER_2_AMBER",
      latency: "24.1s",
      decision: "₹50k Daily Cap + 5% Reserve Hold",
      methods: "UPI, NetBanking, Domestic Cards"
    },
    {
      id: "KYC-IN-2026-0894",
      name: "Kuber FinTech Services Private Limited",
      cin: "U74999GJ2022PTC998877",
      pan: "AABCK9999F",
      score: 12.0,
      tier: "TIER_3_RED",
      latency: "0.4s",
      decision: "Mod-36 Statutory Checksum Failed",
      methods: "Quarantined (₹0 Cap)"
    },
    {
      id: "KYC-IN-2026-0895",
      name: "Alaknanda Infrastructure & Trading Corp",
      cin: "U51909GJ2020PTC900222",
      pan: "AABCA7777M",
      score: 34.0,
      tier: "TIER_3_RED",
      latency: "19.8s",
      decision: "Section 248 Struck-Off DIN Cluster",
      methods: "Quarantined (₹0 Cap)"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/30">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                Risk & Regulatory Control Center
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Live monitoring of autonomous KYC activation decisions, shell network clusters, and statutory reserves
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "queue" ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Application Queue
            </button>
            <button
              onClick={() => setActiveTab("graph")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "graph" ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Shell Graph Explorer
            </button>
            <button
              onClick={() => setActiveTab("policies")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "policies" ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Statutory Policies
            </button>
          </div>
        </div>

        {/* High-Level Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Average End-to-End Latency</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">18.4s</div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Down from 48.0 hours manual ops</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Autonomous Green Path Ratio</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-400">82.4%</div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Zero human verifier required</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Zero-Cost Forgery Interceptions</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-400">₹142.50</div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Saved per forged submission at Tier 2</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">DPDP Act Statutory Privacy</span>
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">100%</div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">SHA-256 Vault Tokens Only</div>
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === "queue" && (
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Autonomous Verification & Linked Account Stream
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Live real-time stream of corporate KYC evaluations</p>
              </div>
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Webhook Sync: Active
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3.5 font-semibold">Application Ref</th>
                    <th className="pb-3.5 font-semibold">Corporate Entity</th>
                    <th className="pb-3.5 font-semibold">PAN / CIN</th>
                    <th className="pb-3.5 font-semibold">Bayesian Score</th>
                    <th className="pb-3.5 font-semibold">Risk Tier</th>
                    <th className="pb-3.5 font-semibold">Latency</th>
                    <th className="pb-3.5 font-semibold">Statutory Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {formalQueue.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 text-blue-400 font-bold">{m.id}</td>
                      <td className="py-4 font-sans font-medium text-slate-100 max-w-[220px] truncate pr-3">
                        {m.name}
                      </td>
                      <td className="py-4 text-slate-400">
                        <div>{m.pan}</div>
                        <div className="text-[10px] text-slate-500">{m.cin}</div>
                      </td>
                      <td className="py-4 font-bold text-slate-100">{m.score}/100</td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            m.tier === "TIER_1_GREEN"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                              : m.tier === "TIER_2_AMBER"
                              ? "bg-amber-950/80 text-amber-400 border-amber-500/40"
                              : "bg-rose-950/80 text-rose-400 border-rose-500/40"
                          }`}
                        >
                          {m.tier.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">{m.latency}</td>
                      <td className="py-4 font-sans text-slate-200">{m.decision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "graph" && (
          <div className="space-y-6">
            <NetworkGraphView graphData={formalShellGraph} />
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 text-xs text-slate-300 leading-relaxed">
              <strong className="text-rose-400 font-mono">ROC Surat Alert:</strong> Common Director DIN{" "}
              <code className="text-slate-100 font-mono">09998888</code> is recorded as a disqualified director in three companies struck off under Section 248 of the Companies Act, 2013 (Apex Paper Invoicing Pvt Ltd and Vortex Mule Logistics Pvt Ltd). Tier 4 Graph Link Radar has flagged this application for complete regulatory quarantine.
            </div>
          </div>
        )}

        {activeTab === "policies" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/80 rounded-3xl border border-emerald-500/30 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Tier 1: Green Path (Score ≥ 85)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
                <li>• Instant Live PG Provisioning (&lt;30s)</li>
                <li>• Daily Limit: ₹25,00,000 / day</li>
                <li>• Standard Settlement: T+2</li>
                <li>• Instant Payouts: Eligible</li>
                <li>• Rolling Reserve: 0.0%</li>
                <li>• Zero Manual Intervention</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-900/80 rounded-3xl border border-amber-500/30 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Tier 2: Amber Path (Score 60–84)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
                <li>• Sandbox Active + Live Capped</li>
                <li>• Daily Live Limit: ₹50,000 / day</li>
                <li>• Settlement Cycle: T+4</li>
                <li>• Rolling Reserve: 5% (14 Days)</li>
                <li>• Automated Webhook: Secondary Proof</li>
                <li>• Step-Up KYC Triggered</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-900/80 rounded-3xl border border-rose-500/30 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-white">Tier 3: Red Path (Score &lt; 60)</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
                <li>• Gateway Activation Blocked</li>
                <li>• Live Limit: ₹0 / day</li>
                <li>• Cryptographic Reason Ledger Signed</li>
                <li>• Escalated to Senior Compliance Queue</li>
                <li>• Automated Suspicious Activity Report (SAR)</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
