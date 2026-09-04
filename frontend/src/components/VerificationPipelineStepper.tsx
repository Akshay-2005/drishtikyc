"use client";

import React from "react";
import { Check } from "lucide-react";

interface Props {
  activeStep?: number;
}

export default function VerificationPipelineStepper({ activeStep = 5 }: Props) {
  const steps = [
    { num: 1, label: "Document Intake", count: "1,284", pct: "100%" },
    { num: 2, label: "OCR & Parsing", count: "1,280", pct: "99.7%" },
    { num: 3, label: "Deterministic Checks", count: "1,245", pct: "96.9%" },
    { num: 4, label: "Risk Analysis", count: "1,196", pct: "93.1%" },
    { num: 5, label: "Final Decision", count: "1,173", pct: "91.4%" }
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Verification Pipeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            End-to-end AI powered merchant onboarding flow
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Pipeline Running Live
        </div>
      </div>

      {/* Stepper with connecting line */}
      <div className="relative flex items-center justify-between pt-2">
        {/* Connecting Background Line */}
        <div className="absolute top-[28px] left-[40px] right-[40px] h-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
        {/* Active Progress Line */}
        <div className="absolute top-[28px] left-[40px] right-[40px] h-[2px] bg-blue-500 z-0"></div>

        {steps.map((step) => (
          <div key={step.num} className="relative z-10 flex flex-col items-center text-center">
            {/* Circle Node */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/25 ring-4 ring-white dark:ring-slate-900 mb-3">
              {step.num}
            </div>

            {/* Step Label */}
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
              {step.label}
            </div>

            {/* Counts */}
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
              {step.count}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {step.pct}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
