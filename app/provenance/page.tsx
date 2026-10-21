'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Flame, Compass, Clock, Award, Hammer } from 'lucide-react';

const PATINA_STAGES = [
  {
    day: 'DAY 01 // BRAND NEW',
    title: 'Fresh From The Workshop',
    desc: 'Firm, dense, and smooth natural tan. Pure real leather conditioned with natural oils and organic wax. Edges are hand-polished smoothly.',
    gradient: 'from-[#D8C7A5] to-[#BFA980]',
    roughness: '100% Solid & Firm',
    surface: 'Smooth Matte Finish',
  },
  {
    day: 'DAY 90 // BREAKING IN',
    title: 'Molding To Your Body',
    desc: 'Body warmth and daily wear begin softening the leather. It naturally contours and flexes to your waist and daily movement.',
    gradient: 'from-[#B58B54] to-[#916733]',
    roughness: 'Flexible & Comfortable',
    surface: 'Warm Amber Shine',
  },
  {
    day: 'YEAR 03 // NATURAL AGING',
    title: 'Rich Character & Color',
    desc: 'The leather turns into a deep warm caramel shade. Natural friction from jeans and daily touch gives it an authentic, lived-in vintage look.',
    gradient: 'from-[#7A451E] to-[#542B0D]',
    roughness: 'Soft & Super Durable',
    surface: 'Glossy Patina Glow',
  },
  {
    day: 'YEAR 10 // LIFELONG HEIRLOOM',
    title: 'Built To Last Decades',
    desc: 'A rich, dark mirror-like sheen. The leather fibers stay strong with zero tearing or cracking. Built to be passed down through generations.',
    gradient: 'from-[#3A1F11] to-[#1A0B05]',
    roughness: 'Perfect Fit',
    surface: 'Deep Vintage Shine',
  },
];

export default function ProvenancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [patinaIndex, setPatinaIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);

  // AEO / GEO / SEO Structured JSON-LD Data (Kanpur Direct Sourcing Model)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About HIDEWOOD | Handcrafted Real Leather Goods',
    description:
      'The story behind HIDEWOOD: 100% full-grain leather sourced directly from our own partner tanneries and handcrafted at our workshop benches in Kanpur, India.',
    url: 'https://hidewood.example.com/provenance',
    mainEntity: {
      '@type': 'Organization',
      name: 'HIDEWOOD Leather',
      foundingDate: '2026',
      knowsAbout: [
        '100% Full-Grain Real Leather',
        'Direct Factory Sourcing Kanpur',
        'Solid Sand-Cast Brass Hardware',
        'Handmade Leather Goods India',
      ],
      location: {
        '@type': 'Place',
        name: 'Kanpur Leather Workshop',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kanpur',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'India',
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        ref={containerRef}
        className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden"
      >
        {/* TOP BREADCRUMB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>OUR CRAFT STORY</span>
              <span>&bull;</span>
              <span className="text-black font-bold">KANPUR, INDIA</span>
            </div>
          </nav>
        </section>

        {/* HERO STATEMENT */}
        <motion.section
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-16 sm:mb-28"
        >
          <div className="border border-black bg-white p-6 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                Direct From Our Own Tanneries &bull; Kanpur Workshop
              </span>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-none mb-6">
              BUILT FOR A <br />
              LIFETIME.
            </h1>

            <p className="max-w-2xl text-sm sm:text-lg text-neutral-700 leading-relaxed font-normal mb-8">
              We never use synthetic fake leather, paper cores, or cardboard stuffing. HIDEWOOD leather is sourced directly from our own factory facility in Kanpur—meaning you get 100% pure full-grain leather crafted to outlast fast-fashion trends.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-black/10 font-mono text-xs uppercase">
              <div>
                <span className="text-neutral-400 block text-[9px]">// LEATHER DENSITY</span>
                <span className="font-bold text-black text-sm sm:text-base">Up to 4.2mm Solid</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// SOURCING MODEL</span>
                <span className="font-bold text-black text-sm sm:text-base">Own Kanpur Tannery</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// BUCKLES &amp; METAL</span>
                <span className="font-bold text-black text-sm sm:text-base">Solid Heavy Brass</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// OUR PROMISE</span>
                <span className="font-bold text-black text-sm sm:text-base">Lifetime Guarantee</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 10-YEAR LEATHER AGING SIMULATOR */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/10 mb-8 font-sans">
            <div>
              <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
                // REAL LEATHER EVOLUTION
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
                HOW OUR LEATHER AGES OVER TIME
              </h2>
            </div>
            <p className="font-mono text-xs text-neutral-500 max-w-sm">
              Tap or click the phases below to see how pure real leather develops a dark, glossy patina as you wear it.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Stage */}
            <div className="lg:col-span-7 border border-black p-6 sm:p-10 bg-white flex flex-col justify-between relative overflow-hidden group">
              <motion.div
                key={patinaIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-r ${PATINA_STAGES[patinaIndex].gradient} relative border border-black/20 shadow-inner flex items-center justify-center overflow-hidden mb-6`}
              >
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '12px 12px',
                  }}
                />

                <div className="relative border-2 border-black/30 px-6 py-3 font-mono text-xs sm:text-sm uppercase tracking-widest font-black text-black/50 rotate-[-4deg] select-none">
                  HIDEWOOD &bull; 100% PURE LEATHER &bull; KANPUR
                </div>

                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 border border-white/20">
                  {PATINA_STAGES[patinaIndex].day}
                </div>
              </motion.div>

              <div>
                <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2">
                  {PATINA_STAGES[patinaIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-6">
                  {PATINA_STAGES[patinaIndex].desc}
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-4 font-mono text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">LEATHER FEEL:</span>
                    <span className="font-bold text-black">{PATINA_STAGES[patinaIndex].roughness}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">SURFACE LOOK:</span>
                    <span className="font-bold text-black">{PATINA_STAGES[patinaIndex].surface}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stepper */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              {PATINA_STAGES.map((stage, idx) => {
                const isActive = patinaIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPatinaIndex(idx)}
                    className={`flex-1 p-5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-black bg-black text-white shadow-lg'
                        : 'border-black/15 bg-white text-black hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase mb-2">
                      <span className={isActive ? 'text-red-400 font-bold' : 'text-neutral-500'}>
                        PHASE 0{idx + 1}
                      </span>
                      <span>{stage.day.split('//')[0]}</span>
                    </div>

                    <div className="text-base sm:text-lg font-bold uppercase tracking-tight">
                      {stage.title}
                    </div>

                    <div className={`text-xs mt-1 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {stage.surface}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3 PILLARS OF HIDEWOOD CRAFT */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="border-t border-black/10 pt-10 mb-10">
            <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
              // HOW WE MAKE IT
            </span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-black">
              OUR 3 QUALITY COMMITMENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-mono font-bold text-xs mb-6">
                  01
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  Direct Factory Leather
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  No middlemen or third-party sourcing. We produce our leather directly at our sister tannery facility in Kanpur, controlling the vegetable tanning and wax treatment from start to finish.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                MATERIAL: 100% NATURAL FULL-GRAIN LEATHER
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-mono font-bold text-xs mb-6">
                  02
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  Solid Sand-Cast Brass
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  Our buckles are never stamped out of hollow or lightweight zinc alloys. We cast solid brass in compressed sand molds, giving every buckle real weight and durability that never snaps.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                HARDWARE: HEAVY SOLID BRASS &amp; RIVETS
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-mono font-bold text-xs mb-6">
                  03
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  Handcrafted In Kanpur
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  Every edge is hand-cut, beveled, and slicked with natural beeswax. We do not spray synthetic plastic coatings—the natural leather edges are polished by hand for a smooth, permanent finish.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                CRAFT: ZERO SYNTHETIC PLASTIC COATINGS
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-black text-white p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-400 block mb-2 font-bold">
                // EXPLORE OUR PRODUCTS
              </span>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                FEEL THE DIFFERENCE.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                Check out our genuine full-grain leather belts, handmade wallets, and travel duffels made right here in Kanpur.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Link
                href="/products"
                className="bg-white text-black hover:bg-neutral-200 px-8 py-4 font-bold text-xs uppercase tracking-widest text-center transition-colors font-mono"
              >
                Shop All Products
              </Link>
              <Link
                href="/"
                className="border border-white/20 hover:border-white px-8 py-4 font-bold text-xs uppercase tracking-widest text-center text-white transition-colors font-mono"
              >
                Back To Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}