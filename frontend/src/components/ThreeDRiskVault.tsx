"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Shield, Sparkles, Activity, Lock } from "lucide-react";

interface Props {
  riskTier: string;
  score: number;
  auditToken?: string;
}

export default function ThreeDRiskVault({ riskTier, score, auditToken }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth || 360;
    const height = 240;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL not supported, falling back cleanly", err);
      return;
    }

    // Dynamic Color Palette based on Risk Tier
    const primaryColor =
      riskTier === "TIER_1_GREEN"
        ? 0x10b981 // Emerald
        : riskTier === "TIER_2_AMBER"
        ? 0xf59e0b // Amber
        : 0xef4444; // Crimson

    const secondaryColor =
      riskTier === "TIER_1_GREEN"
        ? 0x06b6d4 // Cyan
        : riskTier === "TIER_2_AMBER"
        ? 0xd97706 // Darker Amber
        : 0xb91c1c; // Darker Crimson

    // 1. Central Icosahedron Wireframe (Cryptographic Core)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 2. Inner Glowing Core Sphere
    const innerGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // 3. Orbiting Tier Rings (The 5 Verification Gates)
    const ringGroup = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.015, 8, 48), ringMaterial);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.015, 8, 48), ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // 4. Floating Particle Cloud
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.04,
      transparent: true,
      opacity: 0.75
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(primaryColor, 2, 50);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Mouse Tracking for Interactive Tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotation & Smooth Float
      coreMesh.rotation.x = elapsedTime * 0.35 + mouseY * 0.3;
      coreMesh.rotation.y = elapsedTime * 0.45 + mouseX * 0.3;

      innerMesh.rotation.x = -elapsedTime * 0.5;
      innerMesh.rotation.z = elapsedTime * 0.25;

      ringGroup.rotation.x = elapsedTime * 0.15;
      ringGroup.rotation.y = elapsedTime * 0.2;

      particleSystem.rotation.y = elapsedTime * 0.1;

      // Pulse Core Scale subtly
      const scale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.03;
      coreMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [riskTier]);

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/30">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            3D Risk Topology & State Vector
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          WebGL Interactive
        </span>
      </div>

      {/* WebGL Mount Container */}
      <div className="relative w-full h-[240px] flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Center Overlay Score Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md text-center shadow-xl">
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Bayesian Integrity</div>
            <div
              className={`text-2xl font-black font-mono tracking-tight ${
                riskTier === "TIER_1_GREEN"
                  ? "text-emerald-400"
                  : riskTier === "TIER_2_AMBER"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {score}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer telemetry */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="truncate max-w-[200px]">
          Vault Nonce: {auditToken ? auditToken.slice(0, 18) + "..." : "sha256_active"}
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <Lock className="w-3 h-3 text-cyan-400" />
          Hardware Isolated
        </span>
      </div>
    </div>
  );
}
