// src/app/pids/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { PidsStationBoard } from '@/components/Passenger/PidsStationBoard';
import { MOCK_LIVE_TRAINS } from '@/lib/mockData';

export default function PidsPublicPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-[#e2e3e9] flex flex-col">
      {/* Top Concourse Header */}
      <header className="border-b border-[#1c1d22] bg-[#040406]/90 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#2B7FFF]/20 border border-[#2B7FFF]/40 flex items-center justify-center text-blue-400 font-bold text-lg shadow-xs">
            🚉
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Central Railway • Passenger Information Display System (PIDS)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-[4px]">
                LIVE GPS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              SIH26028 Dynamic ETA Forecast Engine • Mumbai Suburban &amp; Coaching Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/planner"
            className="px-3.5 py-1.5 rounded-[4px] bg-[#121317] hover:bg-[#1c1d22] text-[#e2e3e9] border border-[#1c1d22] text-xs font-mono font-medium transition-all"
          >
            ← Open Corridor Planner
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-[4px] bg-[#2B7FFF] hover:bg-blue-600 text-white text-xs font-mono font-semibold transition-all shadow-xs"
          >
            Command Cockpit →
          </Link>
        </div>
      </header>

      {/* Main Concourse Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <PidsStationBoard liveTrains={MOCK_LIVE_TRAINS} defaultStationCode="KYN" />
      </main>

      {/* Concourse Ticker Footer */}
      <footer className="border-t border-[#1c1d22] bg-[#040406] py-3 px-4 sm:px-8 text-center text-xs font-mono text-slate-500">
        <span>Cris RTIS 30s Telemetry Linked • Dual-Aspect Prediction Invariant Enforced (P10 ≤ P50 ≤ P90) • © 2026 Indian Railways</span>
      </footer>
    </div>
  );
}
