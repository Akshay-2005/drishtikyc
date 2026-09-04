"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Zap, Activity, CheckCircle2, Lock, Radio } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Autonomous KYC Engine", icon: <Zap className="w-4 h-4" /> },
    { href: "/dashboard", label: "Risk & Fraud Console", icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-mono">
                DRISHTI<span className="text-blue-400">KYC</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">
              Neurosymbolic KYC & Risk Engine
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-slate-300">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>DPDP Vault: Active</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-emerald-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>FastAPI Core: Operational</span>
          </div>
        </div>
      </div>
    </header>
  );
}
