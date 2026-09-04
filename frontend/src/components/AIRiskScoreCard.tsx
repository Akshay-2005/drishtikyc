"use client";

import React from "react";
import { ArrowRight, ShieldCheck, FileCheck, Building, CreditCard, Network, Activity } from "lucide-react";

interface Props {
  score?: number;
  statusLabel?: string;
  breakdown?: {
    identity: number;
    docAuth: number;
    gstReg: number;
    bankVerif: number;
    fraudNet: number;
    behavioural: number;
  };
  onViewDetails?: () => void;
}

export default function AIRiskScoreCard({
  score = 18,
  statusLabel = "Low Risk",
  breakdown = {
    identity: 98,
    docAuth: 96,
    gstReg: 94,
    bankVerif: 99,
    fraudNet: 88,
    behavioural: 72
  },
  onViewDetails
}: Props) {
  const items = [
    { label: "Identity Match", value: breakdown.identity, icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Document Authenticity", value: breakdown.docAuth, icon: <FileCheck className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "GST Registry", value: breakdown.gstReg, icon: <Building className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Bank Verification", value: breakdown.bankVerif, icon: <CreditCard className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Fraud Network", value: breakdown.fraudNet, icon: <Network className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Behavioural Signals", value: breakdown.behavioural, icon: <Activity className="w-3.5 h-3.5 text-amber-500" /> }
  ];

  // Gauge calculation
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isLow = score < 30;
  const isMedium = score >= 30 && score < 70;
  const strokeColor = isLow ? "#10B981" : isMedium ? "#F59E0B" : "#EF4444";

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          AI Risk Score
        </h3>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Circular Gauge */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Value ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black font-sans text-slate-900 dark:text-slate-100 leading-none">
              {score}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">
              / 100
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {statusLabel}
        </div>
      </div>

      {/* Signal Breakdown List */}
      <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
