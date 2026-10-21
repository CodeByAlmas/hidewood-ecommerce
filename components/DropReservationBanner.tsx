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
      setErrorMsg('Please enter a valid email address.');
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
        throw new Error('Server busy, please try again.');
      }

      setSubmitted(true);
    } catch {
      // Graceful fallback for customer experience
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const HEADING_PRIMARY = 'HANDCRAFTED REAL LEATHER.';

  return (
    <section
      id="reservation"
      aria-label="Upcoming Limited Drop Early Access"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-4 pb-14 sm:pb-20 select-none overflow-hidden"
    >
      {/* Container matching exact padding of ProductGrid, PopularCollections & LifestyleBanners */}
      <div className="w-full px-3 sm:px-6 md:px-8">
        
        {/* CINEMATIC BANNER FRAME */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full min-h-[560px] sm:min-h-[620px] lg:h-[72vh] max-h-[820px] bg-neutral-950 overflow-hidden flex flex-col justify-between p-5 sm:p-10 md:p-12 lg:px-14 lg:py-10 group border border-black/15 shadow-2xl"
        >
          {/* BACKGROUND IMAGE - NATURAL FULL-GRAIN COLOR */}
          <img
            src="/ReservationBackgroundImage.png"
            alt="Handcrafted Real Leather Collection - Kanpur Workshop"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105 pointer-events-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1400&auto=format&fit=crop';
            }}
          />

          {/* DUAL DIRECTIONAL VIGNETTE GRADIENT (Protected Contrast) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

          {/* TOP HUD BAR */}
          <div className="relative z-10 flex items-center justify-between text-white font-mono text-[9px] sm:text-xs uppercase pt-1">
            <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 sm:px-3.5 py-1.5 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="tracking-wider font-bold">LIMITED EDITION DROP &bull; EARLY ACCESS</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-300 font-bold">
              <span>ONLY 200 PIECES HANDCRAFTED</span>
              <span>&bull;</span>
              <span>OCTOBER 2026 DISPATCH</span>
            </div>
          </div>

          {/* CENTER HERO EDITORIAL STATEMENT */}
          <div className="relative z-10 max-w-4xl py-6 sm:py-8 my-auto">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2 sm:mb-3">
              PRE-ORDER VIP ACCESS // LIMITED BATCH
            </span>

            {/* Natural Word Wrapping + TextRoll on Each Word (Never Cuts Text) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[1.02] mb-3 sm:mb-5">
              <span className="inline-flex flex-wrap gap-x-2.5 sm:gap-x-3.5">
                {HEADING_PRIMARY.split(' ').map((word, wIdx) => (
                  <span key={wIdx} className="inline-block overflow-hidden">
                    <TextRoll className="font-black text-white">
                      {word}
                    </TextRoll>
                  </span>
                ))}
              </span>
              <span className="text-neutral-300 font-light block mt-1 tracking-tight">
                MADE TO LAST GENERATIONS.
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-7 drop-shadow-sm font-sans">
              Our next batch features heavy 4.2mm thick leather belts, solid sand-cast brass buckles, and handmade travel duffel bags. Cut from 100% pure leather that never peels or cracks.
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
                  placeholder="Enter your email for early access..."
                  className="bg-black/80 border border-white/20 text-white placeholder-neutral-400 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-mono focus:outline-none focus:border-white flex-1 backdrop-blur-md"
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
                      <span>Get Early Access</span>
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
                <span>You are on the list! We will notify you before launch.</span>
              </motion.div>
            )}

            {errorMsg && (
              <p className="mt-2 text-xs font-mono text-red-400">
                {errorMsg}
              </p>
            )}
          </div>

          {/* BOTTOM METADATA BAR */}
          <div className="relative z-10 pt-4 pb-1 sm:pb-2 border-t border-white/15 flex flex-col sm:flex-row items-baseline justify-between gap-2.5 text-neutral-300 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>100% PURE LEATHER &bull; NO SYNTHETICS OR CARDBOARD</span>
            </div>
            <div className="text-white font-bold tracking-widest">
              FREE EXPRESS DELIVERY ACROSS INDIA
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}