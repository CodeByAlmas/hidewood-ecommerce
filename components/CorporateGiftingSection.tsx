'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Sparkles, Building2, Layers, Check } from 'lucide-react';

export default function CorporateGiftingSection() {
  return (
    <section
      aria-label="Corporate Gifting & Bulk Orders"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-6 pb-14 sm:pb-20 select-none overflow-hidden"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-6 sm:mb-8 font-sans border-b border-black/10"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
              Corporate Gifts &bull; Bulk Orders for Clients &amp; Teams
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs">
            <span className="text-neutral-500 font-medium">
              GST Invoicing &bull; Custom Logo Stamping
            </span>
            <Link
              href="/corporate-gifting"
              className="font-bold text-black hover:text-neutral-600 inline-flex items-center gap-1 uppercase transition-colors"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Main Monolith Grid Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-black bg-white overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Visual Stage */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-900 border-b-2 lg:border-b-0 lg:border-r-2 border-black group">
            <img
              src="/belt-macro.png"
              alt="HIDEWOOD Corporate Leather Gift Box Set"
              className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase">
              <span className="bg-black/90 backdrop-blur-md text-white px-2.5 py-1 border border-white/20 font-bold tracking-wider">
                Min. Order: 25 Sets
              </span>
              <span className="bg-red-600 text-white px-2 py-1 font-bold tracking-wider">
                Custom Logo Print
              </span>
            </div>

            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 text-white font-mono">
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
                // POPULAR GIFT BOX SET
              </span>
              <p className="text-xs sm:text-sm font-sans font-bold uppercase tracking-tight text-white leading-snug">
                Real Leather Belt + Slim Card Wallet packed in a solid gift box.
              </p>
            </div>
          </div>

          {/* Right Information & Inquiry Callout */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#F8F8F6]">
            <div>
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase text-neutral-500 font-bold">
                <Building2 className="w-3.5 h-3.5 text-black" />
                <span>Bulk Orders &bull; Direct From Kanpur Factory</span>
              </div>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black leading-none mb-4 font-sans">
                PREMIUM GIFTS FOR YOUR TEAM &amp; CLIENTS.
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                Skip regular cheap giveaways. Gift 100% genuine leather products handcrafted to last for years, personalized with your company logo or initials.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] mb-8">
                {[
                  'Clean Logo Stamping (Gold / Blind)',
                  'Premium Ready-to-Gift Packaging',
                  'Fast Delivery Across India',
                  'Full GST Input Credit Invoice',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-black/10">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="font-semibold text-neutral-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase text-neutral-400 block">
                  WHOLESALE RATES AVAILABLE
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-black">
                  Starting ₹1,499 / Gift Set
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/corporate-gifting"
                  className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-widest transition-all text-center cursor-pointer shadow-sm active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Get Price Quote</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}