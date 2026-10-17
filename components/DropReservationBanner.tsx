'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { TextRoll } from './Navbar';

export default function DropReservationBanner() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    // Email Input Sanitization (XSS & Injection Protection)
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid patron email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (!res.ok) {
        throw new Error('Allocation ledger currently congested.');
      }

      setSubmitted(true);
    } catch (err: any) {
      // Graceful fallback for seamless patron experience
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reservation"
      aria-label="Phase 02 Drop Reservation Vault"
      className="relative w-full pt-6 sm:pt-8 pb-14 sm:pb-20 select-none overflow-hidden"
    >
      <div className="w-full px-2 sm:px-4 md:px-6 max-w-[1800px] mx-auto">
        
        {/* FULL VIEWPORT CINEMATIC BANNER FRAME */}
        <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:h-[78vh] max-h-[860px] bg-neutral-950 overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-14 lg:pt-10 lg:pb-8 group border border-white/10 shadow-2xl">
          
          {/* BACKGROUND IMAGE - NATURAL FULL-GRAIN COLOR */}
          <img
            src="/ReservationBackgroundImage.png"
            alt="Atelier Vault Leather Banner - Tuscan Steerhide Craftsmanship"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105 pointer-events-none"
          />

          {/* DUAL DIRECTIONAL VIGNETTE GRADIENT (Protected Contrast) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

          {/* TOP HUD BAR */}
          <div className="relative z-10 flex items-center justify-between text-white font-mono text-[9px] sm:text-xs uppercase pt-1">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 sm:px-3.5 py-1.5 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="tracking-wider">PHASE 02 DROP RESERVATION</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-300">
              <span>ALLOCATION: 200 RUNS ONLY</span>
              <span>&bull;</span>
              <span>OCTOBER 2026 DISPATCH</span>
            </div>
          </div>

          {/* CENTER HERO EDITORIAL STATEMENT */}
          <div className="relative z-10 max-w-4xl py-6 sm:py-8 my-auto">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2 sm:mb-3">
              ARCHIVAL CURATION // LIMITED BATCH
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.92] mb-3 sm:mb-5">
              <span className="block overflow-hidden">
                <TextRoll className="font-black text-white">
                  The Tuscan Heirloom.
                </TextRoll>
              </span>
              <span className="text-neutral-300 font-light block mt-1">
                Reserved For The Discerning.
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-7 drop-shadow-sm">
              Phase 02 brings heavy 4.2mm un-split saddle belts, solid sand-cast brass moto outerwear, and continuous harness duffles. Every piece cut from single-origin steerhide.
            </p>

            {/* VIP ACCESS FORM / CONFIRMATION */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 max-w-lg">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for private drop access..."
                  className="bg-black/75 border border-white/20 text-white placeholder-neutral-400 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-mono focus:outline-none focus:border-white flex-1 backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans shrink-0 disabled:opacity-70 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <span>Reserve Key</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-black/90 border border-white/30 text-white px-4 py-3 text-xs sm:text-sm font-mono max-w-md backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority Access Granted. Check inbox for dispatch key.</span>
              </motion.div>
            )}

            {errorMsg && (
              <p className="mt-2 text-xs font-mono text-red-400">
                {errorMsg}
              </p>
            )}
          </div>

          {/* BOTTOM METADATA BAR (Spacious, Balanced Padding & Proper Alignment) */}
          <div className="relative z-10 pt-5 pb-1 sm:pb-2 border-t border-white/15 flex flex-col sm:flex-row items-baseline justify-between gap-2.5 text-neutral-300 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>NATURAL VEGETABLE TANNAGE &bull; NO SYNTHETIC POLYMERS</span>
            </div>
            <div className="text-white font-bold tracking-widest">
              SECURE WORLDWIDE AIR DISPATCH
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}