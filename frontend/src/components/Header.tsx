"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Check,
  CheckCheck,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ExternalLink,
  Trash2
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "success" | "info";
  unread: boolean;
  targetTab?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Circular Trading Intercepted",
    message: "Shell entity ring detected for Kuber Fintech (GSTR-3B vs 2A mismatch > ₹2.4 Cr). Flagged by AI Risk Engine.",
    timestamp: "2m ago",
    type: "critical",
    unread: true,
    targetTab: "fraud_network"
  },
  {
    id: "notif-2",
    title: "Instant Merchant Provisioned",
    message: "Tata Digital Omnichannel auto-approved in 1.4s with 99.4% confidence. Production API keys issued.",
    timestamp: "14m ago",
    type: "success",
    unread: true,
    targetTab: "onboarding"
  },
  {
    id: "notif-3",
    title: "GSTIN Mod-36 Mismatch",
    message: "Alaknanda Logistics Pvt Ltd: Address geolocation divergence > 45km from registered principal place of business.",
    timestamp: "1h ago",
    type: "warning",
    unread: true,
    targetTab: "merchants"
  },
  {
    id: "notif-4",
    title: "DPDP Act 2023 Consent Signed",
    message: "Razorpay Turbo UPI SDK session verified with cryptographic Aadhaar vault tokenization.",
    timestamp: "3h ago",
    type: "info",
    unread: false,
    targetTab: "audit_logs"
  },
  {
    id: "notif-5",
    title: "Webhook Delivery Confirmed",
    message: "Event merchant.kyc.approved delivered to https://api.tatadigital.com/v1/kyc-hook (HTTP 200 OK).",
    timestamp: "5h ago",
    type: "success",
    unread: false,
    targetTab: "audit_logs"
  }
];

interface Props {
  onSearch?: (query: string) => void;
  onNavigateTab?: (tab: string) => void;
  onToggleMobileMenu?: () => void;
}

export default function Header({ onSearch, onNavigateTab, onToggleMobileMenu }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.targetTab && onNavigateTab) {
      onNavigateTab(item.targetTab);
      setIsNotificationOpen(false);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = filterTab === "unread"
    ? notifications.filter((n) => n.unread)
    : notifications;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "critical":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "success":
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case "info":
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 border-b flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 bg-white/90 dark:bg-[#070D1A]/90 backdrop-blur-xl border-slate-200 dark:border-slate-800/80">
      {/* Left: Hamburger Menu (Mobile) + Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md min-w-0 mr-2">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl border transition-all duration-200 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Search Bar with ⌘ K */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search merchants, PAN, GSTIN..."
            className="w-full pl-8 sm:pl-9 pr-2 sm:pr-14 py-1.5 sm:py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-sans"
          />
          <div className="hidden sm:flex absolute inset-y-0 right-0 pr-3 items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          className="p-2 rounded-xl border transition-all duration-200 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell with Functional Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="Open notifications"
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              isNotificationOpen
                ? "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 shadow-sm"
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Red Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-[#070D1A] animate-pulse pointer-events-none">
              {unreadCount}
            </span>
          )}

          {/* Dropdown Tray Popover */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-24px)] sm:w-96 max-w-sm rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 pt-2.5 pb-1 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    filterTab === "all"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterTab("unread")}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                    filterTab === "unread"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500/70" />
                    No notifications to show
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        notif.unread
                          ? "bg-blue-50/40 dark:bg-blue-950/20"
                          : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {notif.title}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.targetTab && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            <span>Inspect {notif.targetTab}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      {notif.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs px-4">
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onNavigateTab("audit_logs");
                      setIsNotificationOpen(false);
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View audit ledger →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill with Popover */}
        <div className="relative" ref={userRef}>
          <div
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-md ring-1 ring-slate-300 dark:ring-slate-700">
              AP
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Akshay Pandey
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Admin
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* User Menu Popover */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-32px)] rounded-xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100">Akshay Pandey</p>
                <p className="text-[10px] text-slate-400">akshay.pandey@razorpay.com</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  KYC Admin • Superuser
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab("api_playground");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>API Keys & Webhooks</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab("audit_logs");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>Security Audit Log</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
