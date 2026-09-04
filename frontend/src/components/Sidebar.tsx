"use client";

import React from "react";
import {
  LayoutDashboard,
  UserPlus,
  Brain,
  ShieldAlert,
  Network,
  Store,
  FileText,
  Terminal,
  PlayCircle,
  Zap,
  X
} from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen = false, onClose }: Props) {
  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "onboarding", label: "Onboarding", icon: <UserPlus className="w-4 h-4" /> },
    { id: "kyc_intel", label: "KYC Intelligence", icon: <Brain className="w-4 h-4" /> },
    { id: "risk_engine", label: "Risk Engine", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "fraud_network", label: "Fraud Network", icon: <Network className="w-4 h-4" /> },
    { id: "merchants", label: "Merchants", icon: <Store className="w-4 h-4" /> },
    { id: "audit_logs", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "api_playground", label: "API Playground", icon: <Terminal className="w-4 h-4" /> },
    { id: "demo_scenarios", label: "Demo Scenarios", icon: <PlayCircle className="w-4 h-4" /> }
  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Brand */}
      <div>
        <div className="p-5 border-b border-[#151D38]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight font-sans">
                  DrishtiKYC
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#1D284F] text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans tracking-tight">
                Secure Onboarding for a Trusted Economy
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? "bg-[#16234B] text-white font-semibold shadow-sm border border-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F1836]"
                }`}
              >
                <span className={isActive ? "text-blue-400" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Buildathon Card */}
      <div className="p-4 space-y-3.5 border-t border-[#151D38]/80 bg-[#080D1F]">
        {/* Systems Operational */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Systems Operational</span>
          </div>
          <div className="space-y-1 pl-4 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>KYC Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Risk Model</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Registry Connectors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Razorpay API</span>
            </div>
          </div>
        </div>

        {/* Buildathon Promo Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#101938] to-[#0A1024] border border-[#202F63] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
              <Zap className="w-3 h-3 text-white fill-current" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Built for Razorpay Buildathon
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Empowering Safe Commerce with AI
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0A1024] border-r border-[#151D38] flex-col justify-between h-screen sticky top-0 z-40 select-none shrink-0 text-slate-300">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-Over Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0A1024] border-r border-[#151D38] flex flex-col justify-between h-full select-none text-slate-300 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

