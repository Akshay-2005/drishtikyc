"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ThreeDBackground from "@/components/ThreeDBackground";
import MetricCards from "@/components/MetricCards";
import VerificationPipelineStepper from "@/components/VerificationPipelineStepper";
import RiskDistributionDonut from "@/components/RiskDistributionDonut";
import TrustPromoCard from "@/components/TrustPromoCard";
import RecentVerificationsTable, { VERIFICATION_ROWS, VerificationRow } from "@/components/RecentVerificationsTable";
import AIRiskScoreCard from "@/components/AIRiskScoreCard";
import LiveSystemActivityFeed from "@/components/LiveSystemActivityFeed";
import VerificationDetailModal from "@/components/VerificationDetailModal";
import AuditLedgerModal from "@/components/AuditLedgerModal";
import OnboardingView from "@/components/views/OnboardingView";
import KYCIntelView from "@/components/views/KYCIntelView";
import RiskEngineView from "@/components/views/RiskEngineView";
import FraudNetworkView from "@/components/views/FraudNetworkView";
import MerchantsView from "@/components/views/MerchantsView";
import AuditLogsView from "@/components/views/AuditLogsView";
import ApiPlaygroundView from "@/components/views/ApiPlaygroundView";
import DemoScenariosView from "@/components/views/DemoScenariosView";
import { runScenario } from "@/lib/api";
import { PipelineResult } from "@/lib/types";
import confetti from "canvas-confetti";
import { ChevronDown, Calendar, Check } from "lucide-react";

const DATE_RANGE_OPTIONS = [
  { id: "today", label: "Today", sub: "Real-time stream" },
  { id: "yesterday", label: "Yesterday", sub: "Last 24 hours" },
  { id: "7days", label: "Last 7 days", sub: "Weekly aggregate" },
  { id: "30days", label: "Last 30 days", sub: "Monthly summary" },
  { id: "quarter", label: "This Quarter (Q3 2026)", sub: "Statutory fiscal period" },
  { id: "custom", label: "Custom Range", sub: "Choose start & end dates" }
];

export default function CommandCenterPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedMerchantRow, setSelectedMerchantRow] = useState<VerificationRow>(VERIFICATION_ROWS[0]);
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>("Last 7 days");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close date dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load initial pipeline for Tata Digital & check URL tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryTab = params.get("tab");
    if (queryTab) {
      setActiveTab(queryTab);
    }
    handleSelectMerchant(VERIFICATION_ROWS[0]);
  }, []);

  const handleSelectMerchant = async (merchant: VerificationRow) => {
    setSelectedMerchantRow(merchant);
    setIsRunning(true);
    try {
      const res = await runScenario(merchant.scenarioId);
      setPipelineResult(res);
      if (merchant.decision === "Approved") {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Failed to run pipeline for merchant:", err);
    } finally {
      setIsRunning(false);
    }
  };

  // Compute dynamic score & signals for AIRiskScoreCard
  const currentScore = pipelineResult ? Math.round(100 - pipelineResult.drishti_score) : selectedMerchantRow.score;
  const statusLabel = selectedMerchantRow.status + " Risk";

  const dynamicBreakdown = {
    identity: pipelineResult ? Math.round(pipelineResult.dimension_scores.registry_identity) : 98,
    docAuth: pipelineResult ? Math.round(pipelineResult.dimension_scores.document_forensics) : 96,
    gstReg: pipelineResult ? Math.round(pipelineResult.dimension_scores.operational_filings) : 94,
    bankVerif: pipelineResult ? Math.round(pipelineResult.dimension_scores.banking_penny_drop) : 99,
    fraudNet: pipelineResult ? Math.round(pipelineResult.dimension_scores.graph_proximity) : 88,
    behavioural: 72
  };

  // Normalize activeTab to canonical underscore format with fallback to overview
  const validTabs = [
    "overview",
    "onboarding",
    "kyc_intel",
    "risk_engine",
    "fraud_network",
    "merchants",
    "audit_logs",
    "api_playground",
    "demo_scenarios"
  ];
  const normalizedTab = (activeTab || "overview").replace(/-/g, "_");
  const currentTab = validTabs.includes(normalizedTab) ? normalizedTab : "overview";

  return (
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden bg-[#F8FAFC] dark:bg-[#070D1A] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* 3D Kinetic Three.js Background Animation */}
      <ThreeDBackground />

      {/* Left Sidebar (Desktop Persistent + Mobile Slide-over Drawer) */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 w-full">
        {/* Top Header */}
        <Header
          onNavigateTab={setActiveTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Content Body - Switches Dynamically on Sidebar Click */}
        <main className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW COMMAND CENTER (Default Mockup View) */}
          {currentTab === "overview" && (
            <>
              {/* Greeting & Command Center Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return "Good morning";
                      if (hour < 17) return "Good afternoon";
                      return "Good evening";
                    })()}, Akshay 👋
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                    KYC Operations Command Center
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Autonomous verification. Lower risk. Faster onboarding. A safer Internet for businesses.
                  </p>
                </div>

                {/* Interactive Date range dropdown */}
                <div className="relative self-start sm:self-auto" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{dateRange}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        isDateDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Options */}
                  {isDateDropdownOpen && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 max-w-[calc(100vw-32px)] rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80">
                        Select Verification Period
                      </div>
                      <div className="py-1 space-y-0.5">
                        {DATE_RANGE_OPTIONS.map((opt) => {
                          const isSelected = dateRange === opt.label;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setDateRange(opt.label);
                                setIsDateDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <div>
                                <div className="text-xs">{opt.label}</div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                  {opt.sub}
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 1: 5 KPI Metric Cards (dynamically reactive to dateRange) */}
              <MetricCards dateRange={dateRange} />

              {/* Row 2: Stepper (6 cols) + Donut (3 cols) + Trust Card (3 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-6">
                  <VerificationPipelineStepper />
                </div>

                <div className="lg:col-span-3">
                  <RiskDistributionDonut />
                </div>

                <div className="lg:col-span-3">
                  <TrustPromoCard />
                </div>
              </div>

              {/* Row 3: Recent Verifications Table (8 cols) + Right Widgets (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8">
                  <RecentVerificationsTable
                    selectedId={selectedMerchantRow.id}
                    onSelectMerchant={(merchant) => {
                      handleSelectMerchant(merchant);
                      setShowDetailModal(true);
                    }}
                    onViewAll={() => setActiveTab("merchants")}
                  />
                </div>

                <div className="lg:col-span-4 space-y-5">
                  <AIRiskScoreCard
                    score={selectedMerchantRow.score}
                    statusLabel={statusLabel}
                    breakdown={dynamicBreakdown}
                    onViewDetails={() => setShowDetailModal(true)}
                  />

                  <LiveSystemActivityFeed onViewAll={() => setActiveTab("audit_logs")} />
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ONBOARDING PORTAL */}
          {currentTab === "onboarding" && (
            <OnboardingView
              onVerificationComplete={(res) => {
                setPipelineResult(res);
                setShowDetailModal(true);
              }}
            />
          )}

          {/* TAB 3: KYC INTELLIGENCE & FORENSICS */}
          {currentTab === "kyc_intel" && <KYCIntelView />}

          {/* TAB 4: RISK ENGINE & POLICY CONTROLLER */}
          {currentTab === "risk_engine" && <RiskEngineView />}

          {/* TAB 5: FRAUD NETWORK GRAPH EXPLORER */}
          {currentTab === "fraud_network" && <FraudNetworkView />}

          {/* TAB 6: MERCHANTS DIRECTORY */}
          {currentTab === "merchants" && (
            <MerchantsView
              onInspectMerchant={(merchant) => {
                handleSelectMerchant(merchant);
                setShowDetailModal(true);
              }}
            />
          )}

          {/* TAB 7: CRYPTOGRAPHIC AUDIT LOGS */}
          {currentTab === "audit_logs" && <AuditLogsView />}

          {/* TAB 8: DEVELOPER API PLAYGROUND */}
          {currentTab === "api_playground" && <ApiPlaygroundView />}

          {/* TAB 9: BUILDATHON DEMO SCENARIOS */}
          {currentTab === "demo_scenarios" && (
            <DemoScenariosView
              onSelectResult={(res) => {
                setPipelineResult(res);
                setShowDetailModal(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Deep Inspection Verification Detail Modal */}
      <VerificationDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        result={pipelineResult}
        isRunning={isRunning}
      />

      {/* Cryptographic Audit Ledger Modal */}
      {pipelineResult && (
        <AuditLedgerModal
          isOpen={showAuditModal}
          onClose={() => setShowAuditModal(false)}
          auditToken={pipelineResult.decision.audit_token}
          auditManifest={pipelineResult.decision.audit_manifest}
          verdict={pipelineResult.decision.verdict}
        />
      )}
    </div>
  );
}
