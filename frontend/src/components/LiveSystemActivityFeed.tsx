"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function LiveSystemActivityFeed() {
  const activities = [
    { text: "PAN verified for Tata Digital", time: "2s ago", color: "bg-blue-500" },
    { text: "GSTIN matched with MCA21", time: "5s ago", color: "bg-emerald-500" },
    { text: "Potential circular trading detected", time: "12s ago", color: "bg-rose-500" },
    { text: "Razorpay account provisioning initiated", time: "28s ago", color: "bg-blue-500" },
    { text: "Document OCR completed (99.2% confidence)", time: "34s ago", color: "bg-emerald-500" }
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Live System Activity
        </h3>
        <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Activity Items */}
      <div className="space-y-3 my-auto">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2.5 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${act.color}`}></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                {act.text}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
