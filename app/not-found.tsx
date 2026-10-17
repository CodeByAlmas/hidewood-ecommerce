'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ShieldAlert, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-28 sm:pt-36 pb-20 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
      <div className="max-w-2xl w-full border-2 border-black bg-white p-8 sm:p-14 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        
        {/* Background Monolith Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none font-mono font-black text-[180px] sm:text-[240px] leading-none">
          404
        </div>

        {/* Top Cipher Header */}
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold mb-4">
          <ShieldAlert className="w-3.5 h-3.5 text-black" />
          <span>ARCHIVAL CIPHER REJECTED &bull; UNREGISTERED LOT</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter text-black leading-none mb-3 font-sans">
          PIECE VOID.
        </h1>

        <p className="font-mono text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
          The specimen or ledger you are attempting to inspect does not exist in the Kanpur archive or has been retired to private vaults.
        </p>

        {/* Quick Route Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            href="/"
            className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 px-6 py-3.5 uppercase font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Apex</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto border border-black hover:bg-black hover:text-white px-6 py-3.5 uppercase font-bold tracking-widest transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Browse Full Catalogue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Footer Audit Bar */}
        <div className="mt-10 pt-6 border-t border-black/10 font-mono text-[10px] text-neutral-400 uppercase flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3" />
            KANPUR BENCH TELEMETRY
          </span>
          <span>EST. 2026</span>
        </div>

      </div>
    </main>
  );
}