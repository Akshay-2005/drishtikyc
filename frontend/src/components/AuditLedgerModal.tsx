"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, X, FileCode } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  auditToken: string;
  auditManifest: Record<string, any>;
  verdict: string;
}

export default function AuditLedgerModal({ isOpen, onClose, auditToken, auditManifest, verdict }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(auditManifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Cryptographic Audit Reason Ledger</h3>
              <p className="text-xs text-slate-400">Verifiable, tamper-proof decision manifest for regulatory inspection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Token Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="truncate">
            <span className="text-slate-500 mr-2">SHA-256 Token:</span>
            <span className="text-blue-400 font-bold">{auditToken}</span>
          </div>
          <button
            onClick={copyJson}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied JSON" : "Copy JSON"}
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950/50">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 overflow-x-auto text-[11px] leading-relaxed text-slate-300">
            {JSON.stringify(auditManifest, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-400">Compliance Standard: RBI Master Directions & DPDP Act 2023</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
