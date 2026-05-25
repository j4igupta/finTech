// Retro‑futuristic hero header
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function RetroHeader() {
  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d0d2b] to-[#0a0a1f] text-white">
      {/* background neon grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,234,0.2),transparent_70%)]" />
      <h1 className="z-10 text-5xl font-bold tracking-widest text-[#00ffea] drop-shadow-[0_0_10px_#00ffea]">
        FinQuest
      </h1>
      <p className="z-10 mt-4 max-w-2xl text-center text-lg text-[#c0c0ff]">
        Learn finance through a neon‑lit adventure. Perfect for new users who want to level up their money skills in a retro‑futuristic world.
      </p>
      <a
        href="/dashboard"
        className="z-10 mt-8 rounded-full bg-[#ff00c8] px-8 py-3 text-sm font-medium text-black shadow-[0_0_15px_#ff00c8] transition-transform hover:scale-105"
      >
        Dive In
      </a>
    </section>
  );
}
