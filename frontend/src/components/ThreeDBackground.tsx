"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === "dark";

    // Mouse tracking with spring smoothing
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. 3D GEOMETRIC WIREFRAME MESH (Rotating Polyhedron / Data Cube)
    // ==========================================
    // 3D Polyhedron vertices (Cube + Octahedron dual cage)
    const baseCubeVertices: [number, number, number][] = [
      [-100, -100, -100], [100, -100, -100], [100, 100, -100], [-100, 100, -100],
      [-100, -100, 100],  [100, -100, 100],  [100, 100, 100],  [-100, 100, 100],
      [0, -140, 0], [0, 140, 0], [-140, 0, 0], [140, 0, 0], [0, 0, -140], [0, 0, 140]
    ];

    const cubeEdges: [number, number][] = [
      // Cube
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Octahedron peaks to cube corners
      [8, 0], [8, 1], [8, 4], [8, 5],
      [9, 2], [9, 3], [9, 6], [9, 7],
      [10, 0], [10, 3], [10, 4], [10, 7],
      [11, 1], [11, 2], [11, 5], [11, 6],
      [12, 0], [12, 1], [12, 2], [12, 3],
      [13, 4], [13, 5], [13, 6], [13, 7]
    ];

    // Second floating wireframe dodecahedron ring in upper right
    const ringSegments = 24;
    const ringRadius = 160;
    const ringPoints: [number, number, number][] = [];
    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      ringPoints.push([Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0]);
    }

    // ==========================================
    // 2. 3D PERSPECTIVE GRID (CYBER HORIZON)
    // ==========================================
    const gridCols = 16;
    const gridRows = 14;
    const gridSpacing = 90;
    const gridDepthStart = 200;

    // ==========================================
    // 3. 3D PARTICLE CONSTELLATION NODES
    // ==========================================
    const numParticles = 85;
    const particles: {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      glow: number;
    }[] = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 600 + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3.5 + 2.2,
        glow: Math.random() * Math.PI * 2
      });
    }

    // Rotation state
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let gridOffsetZ = 0;
    let time = 0;

    const fov = 400;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.015;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const tiltX = (mouse.y - height / 2) * 0.0004;
      const tiltY = (mouse.x - width / 2) * 0.0004;

      rotX += 0.004;
      rotY += 0.006;
      rotZ += 0.002;

      gridOffsetZ = (gridOffsetZ + 0.8) % gridSpacing;

      ctx.clearRect(0, 0, width, height);

      // Color Palette based on Theme - Richer, darker, and significantly more visible
      const gridStroke = isDark
        ? "rgba(56, 189, 248, 0.12)"
        : "rgba(30, 64, 175, 0.14)";
      const polyEdgeColor = isDark
        ? "rgba(99, 102, 241, 0.4)"
        : "rgba(30, 58, 138, 0.35)";
      const polyVertexColor = isDark
        ? "rgba(129, 140, 248, 0.85)"
        : "rgba(29, 78, 216, 0.75)";
      const ringStroke = isDark
        ? "rgba(45, 212, 191, 0.35)"
        : "rgba(14, 116, 144, 0.32)";
      const nodeColor = isDark
        ? "rgba(96, 165, 250, 0.7)"
        : "rgba(30, 64, 175, 0.55)";
      const lineLinkColor = isDark
        ? "rgba(59, 130, 246, 0.22)"
        : "rgba(37, 99, 235, 0.2)";

      // ==========================================
      // DRAW 1: 3D PERSPECTIVE CYBER GRID (Floor & Ceiling Waves)
      // ==========================================
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = gridStroke;

      const gridCenterY = height * 0.72;
      const gridOriginX = width * 0.5 + (mouse.x - width / 2) * 0.08;

      // Longitudinal lines
      for (let c = -gridCols / 2; c <= gridCols / 2; c++) {
        ctx.beginPath();
        let first = true;
        for (let r = 0; r <= gridRows; r++) {
          const z = gridDepthStart + r * gridSpacing - gridOffsetZ;
          const scale = fov / (fov + z);
          const x = gridOriginX + (c * gridSpacing) * scale;
          // Add gentle sine wave undulating effect
          const wave = Math.sin(time + c * 0.4 + r * 0.3) * 12;
          const y = gridCenterY + (180 + wave) * scale;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Latitudinal lines
      for (let r = 0; r <= gridRows; r++) {
        const z = gridDepthStart + r * gridSpacing - gridOffsetZ;
        const scale = fov / (fov + z);
        ctx.beginPath();
        const startX = gridOriginX + (-gridCols / 2 * gridSpacing) * scale;
        const endX = gridOriginX + (gridCols / 2 * gridSpacing) * scale;
        const wave = Math.sin(time + r * 0.3) * 12;
        const y = gridCenterY + (180 + wave) * scale;
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      // ==========================================
      // DRAW 2: 3D FLOATING ROTATING WIREFRAME POLYHEDRON (Left Core)
      // ==========================================
      const polyCenter = {
        x: width * 0.22 + (mouse.x - width / 2) * 0.05,
        y: height * 0.45 + (mouse.y - height / 2) * 0.05,
        z: 320
      };

      // 3D Rotation Matrix math
      const cosY = Math.cos(rotY + tiltY * 3);
      const sinY = Math.sin(rotY + tiltY * 3);
      const cosX = Math.cos(rotX + tiltX * 3);
      const sinX = Math.sin(rotX + tiltX * 3);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const projectedPoly: { x: number; y: number; scale: number; z: number }[] = [];

      for (let i = 0; i < baseCubeVertices.length; i++) {
        const [vx, vy, vz] = baseCubeVertices[i];

        // Rotate Y
        let x1 = vx * cosY + vz * sinY;
        let y1 = vy;
        let z1 = -vx * sinY + vz * cosY;

        // Rotate X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Rotate Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2 + polyCenter.z;

        const scale = fov / (fov + z3);
        const px = polyCenter.x + x3 * scale;
        const py = polyCenter.y + y3 * scale;

        projectedPoly.push({ x: px, y: py, scale, z: z3 });
      }

      // Draw Polyhedron Edges
      ctx.strokeStyle = polyEdgeColor;
      ctx.lineWidth = 1.8;
      for (let i = 0; i < cubeEdges.length; i++) {
        const [a, b] = cubeEdges[i];
        const pA = projectedPoly[a];
        const pB = projectedPoly[b];

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
      }

      // Draw Polyhedron Glowing Vertices
      for (let i = 0; i < projectedPoly.length; i++) {
        const p = projectedPoly[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, 4.0 * p.scale), 0, Math.PI * 2);
        ctx.fillStyle = polyVertexColor;
        ctx.fill();
      }

      // ==========================================
      // DRAW 3: 3D FLOATING GYROSCOPE RING (Upper Right Core)
      // ==========================================
      const ringCenter = {
        x: width * 0.82 + (mouse.x - width / 2) * 0.04,
        y: height * 0.28 + (mouse.y - height / 2) * 0.04,
        z: 350
      };

      const ringCosX = Math.cos(time * 0.4 + tiltX * 2);
      const ringSinX = Math.sin(time * 0.4 + tiltX * 2);
      const ringCosY = Math.cos(time * 0.6 + tiltY * 2);
      const ringSinY = Math.sin(time * 0.6 + tiltY * 2);

      ctx.beginPath();
      let firstRing = true;
      for (let i = 0; i <= ringSegments; i++) {
        const idx = i % ringSegments;
        const [rx, ry, rz] = ringPoints[idx];

        // 3D Rotate
        const x1 = rx * ringCosY + rz * ringSinY;
        const y1 = ry;
        const z1 = -rx * ringSinY + rz * ringCosY;

        const x2 = x1;
        const y2 = y1 * ringCosX - z1 * ringSinX;
        const z2 = y1 * ringSinX + z1 * ringCosX + ringCenter.z;

        const scale = fov / (fov + z2);
        const px = ringCenter.x + x2 * scale;
        const py = ringCenter.y + y2 * scale;

        if (firstRing) {
          ctx.moveTo(px, py);
          firstRing = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = ringStroke;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // ==========================================
      // DRAW 4: 3D CONSTELLATION PARTICLES & INTERCONNECTED VECTORS
      // ==========================================
      const projectedNodes: { x: number; y: number; scale: number }[] = [];

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];

        // Move in 3D
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.glow += 0.02;

        // Bounce within 3D boundaries
        if (p.x < -width * 0.7 || p.x > width * 0.7) p.vx *= -1;
        if (p.y < -height * 0.7 || p.y > height * 0.7) p.vy *= -1;
        if (p.z < 80 || p.z > 650) p.vz *= -1;

        // Mouse Parallax
        const curX = p.x + (mouse.x - width / 2) * (p.z / 600);
        const curY = p.y + (mouse.y - height / 2) * (p.z / 600);

        const scale = fov / (fov + p.z);
        const projX = curX * scale + width / 2;
        const projY = curY * scale + height / 2;

        projectedNodes.push({ x: projX, y: projY, scale });

        // Dynamic pulsing dot
        const pulse = Math.sin(p.glow) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(1.5, p.size * scale * pulse), 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }

      // Inter-particle connecting links
      const maxDist = 145;
      ctx.strokeStyle = lineLinkColor;
      ctx.lineWidth = 1.3;

      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const pi = projectedNodes[i];
          const pj = projectedNodes[j];

          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
    />
  );
}
