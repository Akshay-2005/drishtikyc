"use client";

import React, { useState } from "react";
import { Search, Bell, Moon, Sun, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 bg-white/90 dark:bg-[#070D1A]/90 backdrop-blur-xl border-slate-200 dark:border-slate-800/80">
      {/* Search Bar with ⌘ K */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search merchants, PAN, GSTIN, or Application ID..."
          className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-sans"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-3.5">
        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          className="p-2 rounded-xl border transition-all duration-200 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl border transition-all duration-200 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#070D1A]"></span>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2">
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
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
