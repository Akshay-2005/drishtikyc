"use client";

import React, { useState } from "react";
import { Store, Search, Filter, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import { VerificationRow, VERIFICATION_ROWS } from "@/components/RecentVerificationsTable";

interface Props {
  onInspectMerchant: (m: VerificationRow) => void;
}

export default function MerchantsView({ onInspectMerchant }: Props) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const extendedMerchants = [
    {
      ...VERIFICATION_ROWS[0],
      cin: "U72900MH2019PTC322568",
      gstin: "27AABCT1234T1Z5",
      dailyLimit: "₹25,00,000",
      rzpAcc: "acc_TataDigital2026",
      settlement: "T+2 Standard"
    },
    {
      ...VERIFICATION_ROWS[1],
      cin: "U74999GJ2022PTC998877",
      gstin: "24AABCK9999F1Z9 (Forged)",
      dailyLimit: "₹0",
      rzpAcc: "acc_KuberQuarantine",
      settlement: "Suspended"
    },
    {
      ...VERIFICATION_ROWS[2],
      cin: "U72200KA2002PLC030310",
      gstin: "29AABCI3344M1ZR",
      dailyLimit: "₹25,00,000",
      rzpAcc: "acc_InfosysBPM2026",
      settlement: "T+2 Standard"
    },
    {
      ...VERIFICATION_ROWS[3],
      cin: "U51909GJ2020PTC900222",
      gstin: "24AABCA7777M1Z4",
      dailyLimit: "₹0",
      rzpAcc: "acc_AlaknandaBlocked",
      settlement: "Blocked (Sec 248)"
    },
    {
      ...VERIFICATION_ROWS[4],
      cin: "Proprietorship Udyam-1284",
      gstin: "27ABCDE1234F1Z8",
      dailyLimit: "₹5,00,000",
      rzpAcc: "acc_ShreeTraders2026",
      settlement: "T+3"
    }
  ];

  const filtered = extendedMerchants.filter((m) => {
    const matchesFilter = filterStatus === "All" || m.decision === filterStatus;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.pan.toLowerCase().includes(search.toLowerCase()) ||
      m.cin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Merchant Portfolio Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered corporate merchants, linked gateway account statuses, and autonomous underwriting limits
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["All", "Approved", "Quarantined", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                filterStatus === status
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter merchants by name, PAN, CIN, or GSTIN..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-sans"
        />
      </div>

      {/* Merchants Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 font-medium">
              <th className="pb-3 pl-2">Corporate Entity</th>
              <th className="pb-3 px-2">Entity Type</th>
              <th className="pb-3 px-2 font-mono">PAN / CIN</th>
              <th className="pb-3 px-2 font-mono">Razorpay Account ID</th>
              <th className="pb-3 px-2 font-mono">Daily Live Limit</th>
              <th className="pb-3 px-2">Decision</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${m.avatarBg}`}>
                      {m.avatarLetter}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {m.gstin}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                  {m.type}
                </td>

                <td className="py-3.5 px-2 font-mono">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{m.pan}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{m.cin}</div>
                </td>

                <td className="py-3.5 px-2 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {m.rzpAcc}
                </td>

                <td className="py-3.5 px-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {m.dailyLimit}
                </td>

                <td className="py-3.5 px-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      m.decision === "Approved"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : m.decision === "Quarantined" || m.decision === "Under Review"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {m.decision}
                  </span>
                </td>

                <td className="py-3.5 pr-2 text-right">
                  <button
                    onClick={() => onInspectMerchant(m)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-semibold text-[11px]"
                  >
                    Inspect <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
