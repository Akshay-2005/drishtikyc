"use client";

import React from "react";

export default function RiskDistributionDonut() {
  const categories = [
    { label: "Low Risk", pct: "82%", color: "#10B981" },
    { label: "Medium Risk", pct: "11%", color: "#F59E0B" },
    { label: "High Risk", pct: "5%", color: "#EF4444" },
    { label: "Critical", pct: "2%", color: "#8B5CF6" }
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
        Risk Distribution
      </h3>

      <div className="flex items-center justify-between gap-4 my-auto">
        {/* SVG Donut Chart */}
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Low Risk 82% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="14"
              strokeDasharray="196 238"
              strokeDashoffset="0"
            />
            {/* Medium Risk 11% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="14"
              strokeDasharray="26 238"
              strokeDashoffset="-196"
            />
            {/* High Risk 5% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="14"
              strokeDasharray="12 238"
              strokeDashoffset="-222"
            />
            {/* Critical 2% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#8B5CF6"
              strokeWidth="14"
              strokeDasharray="5 238"
              strokeDashoffset="-234"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-black text-slate-900 dark:text-slate-100 font-sans leading-none">
              1,284
            </span>
            <span className="text-[9px] text-slate-400 font-medium mt-0.5">
              Applications
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs font-sans flex-1 pl-2">
          {categories.map((c) => (
            <div key={c.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                ></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {c.label}
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                {c.pct}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
