"use client";

import React from "react";
import { MoreHorizontal, ArrowRight, Check, AlertTriangle, X } from "lucide-react";

export interface VerificationRow {
  id: string;
  name: string;
  type: string;
  pan: string;
  score: number;
  status: "Low" | "Medium" | "High" | "Critical";
  decision: "Approved" | "Under Review" | "Rejected";
  time: string;
  avatarBg: string;
  avatarLetter: string;
  scenarioId: string;
}

interface Props {
  selectedId: string;
  onSelectMerchant: (merchant: VerificationRow) => void;
  onViewAll?: () => void;
}

export const VERIFICATION_ROWS: VerificationRow[] = [
  {
    id: "v1",
    name: "Tata Digital Private Limited",
    type: "Private Ltd",
    pan: "AABCT1234T",
    score: 12,
    status: "Low",
    decision: "Approved",
    time: "2.4s",
    avatarBg: "bg-blue-600",
    avatarLetter: "T",
    scenarioId: "golden_path"
  },
  {
    id: "v2",
    name: "Kuber FinTech Services",
    type: "Private Ltd",
    pan: "AABCK9999F",
    score: 78,
    status: "High",
    decision: "Under Review",
    time: "6.1s",
    avatarBg: "bg-indigo-900",
    avatarLetter: "K",
    scenarioId: "forged_gstin"
  },
  {
    id: "v3",
    name: "Infosys Business Process",
    type: "Private Ltd",
    pan: "AABCI3344M",
    score: 18,
    status: "Low",
    decision: "Approved",
    time: "1.9s",
    avatarBg: "bg-blue-500",
    avatarLetter: "I",
    scenarioId: "fuzzy_name"
  },
  {
    id: "v4",
    name: "Alaknanda Infrastructure",
    type: "LLP",
    pan: "AABCA7777M",
    score: 87,
    status: "Critical",
    decision: "Rejected",
    time: "4.3s",
    avatarBg: "bg-rose-700",
    avatarLetter: "A",
    scenarioId: "shell_network"
  },
  {
    id: "v5",
    name: "Shree Traders",
    type: "Proprietorship",
    pan: "ABCDE1234F",
    score: 32,
    status: "Medium",
    decision: "Approved",
    time: "3.1s",
    avatarBg: "bg-slate-500",
    avatarLetter: "S",
    scenarioId: "golden_path"
  }
];

export default function RecentVerificationsTable({ selectedId, onSelectMerchant, onViewAll }: Props) {
  const getScoreColor = (score: number) => {
    if (score < 30) return "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800";
    if (score < 60) return "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800";
    if (score < 80) return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800";
    return "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Low":
        return "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900";
      case "Medium":
        return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900";
      case "High":
        return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900";
      case "Critical":
        return "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Under Review
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <X className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Verifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest merchant applications processed by the AI engine
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 font-medium">
              <th className="pb-3 pl-2">Merchant Name</th>
              <th className="pb-3 px-2">Type</th>
              <th className="pb-3 px-2 font-mono">PAN / GSTIN</th>
              <th className="pb-3 px-3 text-center">Risk Score</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3">Decision</th>
              <th className="pb-3 px-2">Time</th>
              <th className="pb-3 pr-2 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {VERIFICATION_ROWS.map((row) => {
              const isSelected = selectedId === row.id;

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectMerchant(row)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isSelected
                      ? "bg-blue-50/60 dark:bg-blue-950/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Name + Avatar */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ${row.avatarBg}`}
                      >
                        {row.avatarLetter}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-2 font-medium text-slate-600 dark:text-slate-300">
                    {row.type}
                  </td>

                  {/* PAN */}
                  <td className="py-3.5 px-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {row.pan}
                  </td>

                  {/* Risk Score Pill */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold font-mono border ${getScoreColor(
                        row.score
                      )}`}
                    >
                      {row.score}
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Decision */}
                  <td className="py-3.5 px-3">
                    {getDecisionBadge(row.decision)}
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-2 font-mono text-slate-500 dark:text-slate-400">
                    {row.time}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pr-2 text-right text-slate-400 hover:text-slate-600">
                    <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
