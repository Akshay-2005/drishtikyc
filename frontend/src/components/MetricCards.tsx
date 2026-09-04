"use client";

import React from "react";
import { FileText, CheckCircle2, Clock, XCircle, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MetricCards() {
  const cards = [
    {
      id: "total",
      label: "Total Applications",
      value: "1,284",
      trend: "+12%",
      isPositive: true,
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
      sparkColor: "#10B981",
      path: "M0,20 Q15,18 30,22 T60,10 T90,5"
    },
    {
      id: "approved",
      label: "Auto Approved",
      value: "1,173",
      trend: "+8%",
      isPositive: true,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
      sparkColor: "#10B981",
      path: "M0,22 Q20,20 40,24 T70,12 T90,4"
    },
    {
      id: "review",
      label: "Under Review",
      value: "67",
      trend: "-3%",
      isPositive: false,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
      sparkColor: "#F59E0B",
      path: "M0,24 Q25,24 50,18 T80,12 T90,8"
    },
    {
      id: "rejected",
      label: "Rejected / Flagged",
      value: "44",
      trend: "-18%",
      isPositive: false,
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
      sparkColor: "#EF4444",
      path: "M0,20 Q20,10 40,24 T70,15 T90,18"
    },
    {
      id: "latency",
      label: "Avg. Verification Time",
      value: "2.8s",
      trend: "-42%",
      isPositive: true,
      icon: <Zap className="w-5 h-5 text-sky-500" />,
      iconBg: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400",
      sparkColor: "#3B82F6",
      path: "M0,18 Q20,22 40,16 T70,22 T90,14"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div
          key={c.id}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
              {c.icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-sans text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                {c.label}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span
              className={`inline-flex items-center text-xs font-semibold ${
                c.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : c.id === "latency"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {c.trend.startsWith("+") ? "↑" : "↓"} {c.trend.replace("+", "").replace("-", "")}
            </span>

            {/* Sparkline SVG */}
            <svg width="80" height="24" className="overflow-visible">
              <path
                d={c.path}
                fill="none"
                stroke={c.sparkColor}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
