"use client";

import React, { useState } from "react";
import { ShellGraphData, GraphNode } from "@/lib/types";
import { Network, ShieldAlert, CheckCircle2, Building2, User, Landmark, Info } from "lucide-react";

interface Props {
  graphData: ShellGraphData;
}

export default function NetworkGraphView({ graphData }: Props) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { has_shell_anomaly, flagged_clusters_count, graph_nodes, graph_links } = graphData;

  const width = 560;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;

  // Clean radial layout positioning
  const otherNodes = graph_nodes.filter((n) => n.type !== "TARGET_ENTITY");
  const targetNode = graph_nodes.find((n) => n.type === "TARGET_ENTITY");

  const positionedNodes = graph_nodes.map((node) => {
    if (node.type === "TARGET_ENTITY") {
      return { ...node, x: centerX, y: centerY };
    }
    const idx = otherNodes.findIndex((n) => n.id === node.id);
    const total = Math.max(1, otherNodes.length);
    const angle = (Math.PI * 2 / total) * idx - Math.PI / 2;
    const distance = node.type === "DIRECTOR" ? 95 : 125;

    return {
      ...node,
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle)
    };
  });

  const getNodeColors = (node: GraphNode) => {
    if (node.risk === "CRITICAL" || node.risk === "BLOCKED") {
      return { fill: "rgba(239, 68, 68, 0.18)", stroke: "#ef4444", text: "#f87171" };
    }
    if (node.type === "DIRECTOR") {
      return { fill: "rgba(16, 185, 129, 0.18)", stroke: "#10b981", text: "#34d399" };
    }
    return { fill: "rgba(59, 130, 246, 0.18)", stroke: "#3b82f6", text: "#60a5fa" };
  };

  const getNodeShortLabel = (node: GraphNode) => {
    if (node.type === "TARGET_ENTITY") return "Target Entity";
    if (node.type === "DIRECTOR") return "Director (DIN)";
    return "Struck-off Shell";
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/30">
              <Network className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Entity Link & Circular Trading Radar
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 248 Struck-Off Cluster & Common Director DIN Association
          </p>
        </div>

        {has_shell_anomaly ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40 animate-pulse self-start sm:self-auto">
            <ShieldAlert className="w-3.5 h-3.5" />
            {flagged_clusters_count} Shell Cluster(s) Flagged
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clean Corporate Graph
          </span>
        )}
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[280px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Links */}
          {graph_links.map((link, i) => {
            const src = positionedNodes.find((n) => n.id === link.source);
            const tgt = positionedNodes.find((n) => n.id === link.target);
            if (!src || !tgt) return null;

            return (
              <line
                key={i}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            );
          })}

          {/* Nodes */}
          {positionedNodes.map((node) => {
            const colors = getNodeColors(node);
            const isSelected = selectedNode?.id === node.id;
            const r = node.type === "TARGET_ENTITY" ? 22 : 16;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-all duration-200 hover:opacity-100"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r + (isSelected ? 3 : 0)}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + r + 12}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                >
                  {getNodeShortLabel(node)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-2 text-[10px] font-mono pointer-events-none">
          <span className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Target Entity
          </span>
          <span className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Director DIN
          </span>
          <span className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Struck-off Shell
          </span>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 rounded-xl bg-slate-900/95 border border-slate-700/90 backdrop-blur-md flex items-center justify-between text-xs animate-in fade-in">
            <div className="truncate pr-3">
              <div className="font-bold text-slate-100 truncate">{selectedNode.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Status: <span className="text-slate-300 font-semibold">{selectedNode.status}</span> | Risk Tier:{" "}
                <span className="font-bold text-rose-400">{selectedNode.risk}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
