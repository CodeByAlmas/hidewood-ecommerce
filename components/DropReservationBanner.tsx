'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TextRoll } from './Navbar';

export default function DropReservationBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="reservation"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-4 sm:pt-6 pb-12 sm:pb-16 select-none overflow-hidden"
    >
      <div className="w-full px-2 sm:px-4 md:px-6">
        
        {/* FULL VIEWPORT CINEMATIC BANNER FRAME */}
        <div className="relative w-full min-h-[520px] sm:min-h-[620px] lg:h-[75vh] max-h-[820px] bg-neutral-950 overflow-hidden flex flex-col justify-between p-5 sm:p-10 md:p-14 group">
          
          {/* BACKGROUND IMAGE WITH SLOW HOVER ZOOM */}
          <img
            src="/ReservationBackgroundImage.png"
            alt="Atelier Vault Leather Banner"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-[0.4] transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105 pointer-events-none"
          />

          {/* DUAL DIRECTIONAL VIGNETTE GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

          {/* TOP HUD BAR */}
          <div className="relative z-10 flex items-center justify-between text-white font-mono text-[9px] sm:text-xs uppercase">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="tracking-wider">PHASE 02 DROP RESERVATION</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-400">
              <span>ALLOCATION: 200 RUNS ONLY</span>
              <span>&bull;</span>
              <span>OCTOBER 2026 DISPATCH</span>
            </div>
          </div>

          {/* CENTER/BOTTOM HERO EDITORIAL STATEMENT */}
          <div className="relative z-10 max-w-4xl my-auto py-8 sm:py-12">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2 sm:mb-3">
              ARCHIVAL CURATION // LIMITED BATCH
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.92] mb-4 sm:mb-6">
              <span className="block overflow-hidden">
                <TextRoll className="font-black text-white">
                  The Tuscan Heirloom.
                </TextRoll>
              </span>
              <span className="text-neutral-400 font-light block mt-1">
                Reserved For The Discerning.
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-8">
              Phase 02 brings heavy 4.2mm un-split saddle belts, solid sand-cast brass moto outerwear, and continuous harness duffles. Every piece cut from single-origin steerhide.
            </p>

            {/* VIP ACCESS FORM / CONFIRMATION */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 max-w-lg">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for private drop access..."
                  className="bg-black/75 border border-white/20 text-white placeholder-neutral-500 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-mono focus:outline-none focus:border-white flex-1 backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans shrink-0"
                >
                  <span>Reserve Key</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 bg-black/90 border border-white/30 text-white px-4 py-3 text-xs sm:text-sm font-mono max-w-md backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Priority Access Granted. Check inbox for dispatch key.</span>
              </div>
            )}
          </div>

          {/* BOTTOM METADATA BAR */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-baseline justify-between gap-2 text-neutral-400 font-mono text-[9px] sm:text-[10px] uppercase">
            <div>NATURAL VEGETABLE TANNAGE &bull; NO SYNTHETIC POLYMERS</div>
            <div className="text-white font-bold tracking-wider">SECURE WORLDWIDE AIR DISPATCH</div>
          </div>

        </div>

      </div>
    </section>
  );
}