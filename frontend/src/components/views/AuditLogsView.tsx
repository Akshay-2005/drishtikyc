"use client";

import React from "react";
import { FileText, ShieldCheck, Lock, Hash, CheckCircle2, Copy, ExternalLink } from "lucide-react";

export default function AuditLogsView() {
  const auditEntries = [
    {
      id: "LOG-SHA-8921",
      timestamp: "2026-09-04 15:35:12.891",
      event: "RAZORPAY_ACCOUNT_PROVISIONED",
      merchant: "Tata Digital Private Limited",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "VERIFIED",
      actor: "Autonomous Decision Tier 5"
    },
    {
      id: "LOG-SHA-8920",
      timestamp: "2026-09-04 15:35:10.450",
      event: "NPCI_PENNY_DROP_MATCHED",
      merchant: "Infosys Business Process Management Ltd",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      status: "VERIFIED",
      actor: "NPCI Registry Connector"
    },
    {
      id: "LOG-SHA-8919",
      timestamp: "2026-09-04 15:34:58.120",
      event: "MOD36_CHECKSUM_TAMPER_FLAG",
      merchant: "Kuber FinTech Services Private Limited",
      hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      status: "FLAGGED",
      actor: "Deterministic Validator Tier 2"
    },
    {
      id: "LOG-SHA-8918",
      timestamp: "2026-09-04 15:34:42.610",
      event: "SHELL_COMPANY_CLUSTER_QUARANTINED",
      merchant: "Alaknanda Infrastructure & Trading Corp",
      hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      status: "QUARANTINED",
      actor: "Bayesian Graph Scorer Tier 4"
    },
    {
      id: "LOG-SHA-8917",
      timestamp: "2026-09-04 15:34:20.301",
      event: "DPDP_AADHAAR_MASK_INGESTION",
      merchant: "Shree Traders",
      hash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
      status: "VERIFIED",
      actor: "Document Privacy Ingestion Tier 1"
    }
  ];

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Cryptographic SHA-256 Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable, tamper-evident verification ledger compliant with RBI Master Directions & DPDP Act 2023
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ledger Integrity: 100% Unbroken</span>
        </div>
      </div>

      {/* Audit Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 font-medium">
              <th className="pb-3 pl-2">Event Reference</th>
              <th className="pb-3 px-2">Timestamp</th>
              <th className="pb-3 px-2">Action / Event</th>
              <th className="pb-3 px-2">Entity Target</th>
              <th className="pb-3 px-2">SHA-256 Digest Token</th>
              <th className="pb-3 pr-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {auditEntries.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 pl-2 font-bold text-blue-600 dark:text-blue-400">
                  {log.id}
                </td>

                <td className="py-3.5 px-2 text-[11px] text-slate-500">
                  {log.timestamp}
                </td>

                <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-slate-100">
                  <div>{log.event}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{log.actor}</div>
                </td>

                <td className="py-3.5 px-2 font-sans font-medium text-slate-800 dark:text-slate-200">
                  {log.merchant}
                </td>

                <td className="py-3.5 px-2 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                  <span title={log.hash}>{log.hash.slice(0, 20)}...</span>
                  <button
                    onClick={() => copyHash(log.hash)}
                    className="ml-1.5 p-0.5 rounded text-slate-400 hover:text-blue-500"
                    title="Copy Full SHA-256 Hash"
                  >
                    <Copy className="w-3 h-3 inline" />
                  </button>
                </td>

                <td className="py-3.5 pr-2 text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      log.status === "VERIFIED"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : log.status === "FLAGGED"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
