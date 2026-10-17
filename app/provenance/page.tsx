'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ShieldCheck, Flame, Compass, Clock, Award, Hammer } from 'lucide-react';

const PATINA_STAGES = [
  {
    day: 'DAY 01 // FRESH BENCH',
    title: 'The Untamed Steerhide',
    desc: 'Dense, rigid, and matte pale oak-tan. Internal bovine collagen fibers saturated with tallow and organic beeswax. Edges friction-burnished by hand.',
    gradient: 'from-[#D8C7A5] to-[#BFA980]',
    roughness: '100% Stiffness',
    surface: 'Dry Waxy Bloom',
  },
  {
    day: 'DAY 90 // ACCLIMATION',
    title: 'The Body Contour',
    desc: 'Body warmth and natural waist friction begin yielding. Leather molds microscopically to the owner’s hip bone structure. Surface starts absorbing sunlight.',
    gradient: 'from-[#B58B54] to-[#916733]',
    roughness: '85% Rigidity',
    surface: 'Satin Amber Sheen',
  },
  {
    day: 'YEAR 03 // TEA-CORE EMERGENCE',
    title: 'The Indigo & Sun Rub',
    desc: 'Deep caramel undertones burst through. Denim indigo crocking penetrates edge bevels, creating authentic high-contrast wear lines.',
    gradient: 'from-[#7A451E] to-[#542B0D]',
    roughness: 'Supple Armor',
    surface: 'Polished Tea-Core',
  },
  {
    day: 'YEAR 10 // OBSIDIAN HEIRLOOM',
    title: 'Indestructible Patina',
    desc: 'A glassy, mirror-like friction glaze. Collagen fibers permanently interlocked. Hardware develops an antique verdigris halo. Zero stretch failure.',
    gradient: 'from-[#3A1F11] to-[#1A0B05]',
    roughness: 'Second Skin',
    surface: 'Mirror Friction Glaze',
  },
];

export default function ProvenancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [patinaIndex, setPatinaIndex] = useState(0);

  // Scroll perspective animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);

  // AEO / GEO / SEO Structured JSON-LD Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'The HIDEWOOD Provenance | Artisanal Leather Atelier',
    description:
      'The engineering dossier of HIDEWOOD: 4.2mm unsplit Tuscan steerhide, organic mimosa pit-tannage, and hand sand-cast brass hardware produced at the Kanpur artisanal bench.',
    url: 'https://hidewood.example.com/provenance',
    mainEntity: {
      '@type': 'Organization',
      name: 'HIDEWOOD Atelier',
      foundingDate: '2026',
      knowsAbout: [
        'Vegetable-Tanned Bovine Leather',
        'English Bridle Leather Hot-Stuffing',
        'Sand-Cast Molten Brass Metallurgy',
        'Heirloom Patina Evolution',
      ],
      location: {
        '@type': 'Place',
        name: 'Kanpur Artisanal Bench',
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
      {/* 1. SEO / AEO / GEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        ref={containerRef}
        className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden"
      >
        {/* 2. TOP HUD BREADCRUMB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Return to Atelier Index"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Return to Index</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>MANUFACTURE DOSSIER</span>
              <span>&bull;</span>
              <span className="text-black font-bold">VOL. 01 // 2026</span>
            </div>
          </nav>
        </section>

        {/* 3. HERO MONOLITH STATEMENT */}
        <motion.section
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-16 sm:mb-28"
        >
          <div className="border border-black bg-white p-6 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                Kanpur Workshop Bench &bull; Tuscan Bark Tannage
              </span>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-none mb-6">
              ENGINEERED <br />
              AGAINST TIME.
            </h1>

            <p className="max-w-2xl text-sm sm:text-lg text-neutral-700 leading-relaxed font-normal mb-8">
              We do not split hides to make them uniform. We do not spray acrylic paint to hide natural scars. HIDEWOOD was founded on a singular conviction: leather should outlive the person who wears it.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-black/10 font-mono text-xs uppercase">
              <div>
                <span className="text-neutral-400 block text-[9px]">// CORE DENSITY</span>
                <span className="font-bold text-black text-sm sm:text-base">4.2mm Unsplit</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// TANNIN STEEP</span>
                <span className="font-bold text-black text-sm sm:text-base">60 Days Pit</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// HARDWARE MASS</span>
                <span className="font-bold text-black text-sm sm:text-base">185g Sand-Cast</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">// LIFE HORIZON</span>
                <span className="font-bold text-black text-sm sm:text-base">100 Yrs Warranty</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4. INTERACTIVE 10-YEAR PATINA TIME-LAPSE LAB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/10 mb-8 font-sans">
            <div>
              <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
                // LABORATORY SIMULATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
                THE 10-YEAR PATINA ACCELERATOR
              </h2>
            </div>
            <p className="font-mono text-xs text-neutral-500 max-w-sm">
              Drag or tap stages to witness how unlacquered bovine hide records atmospheric oils and body warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Stage: 3D-Look Hide Specimen Card */}
            <div className="lg:col-span-7 border border-black p-6 sm:p-10 bg-white flex flex-col justify-between relative overflow-hidden group">
              {/* Animated Hide Texture Simulator */}
              <motion.div
                key={patinaIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-r ${PATINA_STAGES[patinaIndex].gradient} relative border border-black/20 shadow-inner flex items-center justify-center overflow-hidden mb-6`}
              >
                {/* Surface Grain Texture Simulation Matrix */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '12px 12px',
                  }}
                />

                {/* Hot Stamp Deboss Watermark */}
                <div className="relative border-2 border-black/30 px-6 py-3 font-mono text-xs sm:text-sm uppercase tracking-widest font-black text-black/50 rotate-[-4deg] select-none">
                  HIDEWOOD &bull; ATELIER 2026 &bull; SANTA CROCE
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
                    <span className="text-neutral-400 block text-[10px]">STRUCTURAL DENSITY:</span>
                    <span className="font-bold text-black">{PATINA_STAGES[patinaIndex].roughness}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">SURFACE LUSTRE:</span>
                    <span className="font-bold text-black">{PATINA_STAGES[patinaIndex].surface}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stage: Stepper Timeline Selector */}
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

        {/* 5. THE THREE PILLARS: PIT TANNAGE, METALLURGY & SADDLE STITCH */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="border-t border-black/10 pt-10 mb-10">
            <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
              // ATELIER CRAFT METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-black">
              HOW WE FORGE THE HEIRLOOM
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
                  Tuscan Pit Tannage
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  No toxic chrome sulfates. Our bovine hides submerge in subterranean oak bark pits for 60 continuous days in Santa Croce sull’Arno, drinking natural tannins until the core fiber is completely amber.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                CHEMISTRY: 100% ORGANIC CHESTNUT &amp; MIMOSA BARK
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-mono font-bold text-xs mb-6">
                  02
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  Sand-Cast Molten Brass
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  Our buckles are never stamped out of cheap zinc alloy sheets. Every buckle is poured as molten raw brass into compressed sand molds, yielding unique microscopic surface cooling fissures.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                METALLURGY: SOLID RECYCLED COPPER-ZINC ALLOY (185G)
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-mono font-bold text-xs mb-6">
                  03
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  Kanpur Artisanal Bench
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  Assembled on heavy wooden benches in Kanpur. Every edge is beveled with English iron edgers and friction-burnished by hand using beeswax and canvas friction until an impermeable glass bead forms.
                </p>
              </div>

              <div className="pt-6 border-t border-black/10 mt-6 font-mono text-[10px] text-neutral-500 uppercase">
                EXECUTION: HAND-SLICKED ZERO ACRYLIC PAINT SEAL
              </div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION / ARCHIVE CONCIERGE */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-black text-white p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-400 block mb-2 font-bold">
                // ENTER THE ARCHIVE
              </span>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                WEAR THE DIFFERENCE.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                Explore Series 01 unsplit steerhide belts and hand-cut leather goods engineered to outlive trends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Link
                href="/products"
                className="bg-white text-black hover:bg-neutral-200 px-8 py-4 font-bold text-xs uppercase tracking-widest text-center transition-colors font-mono"
              >
                Shop All Silhouettes
              </Link>
              <Link
                href="/"
                className="border border-white/20 hover:border-white px-8 py-4 font-bold text-xs uppercase tracking-widest text-center text-white transition-colors font-mono"
              >
                Back To Hero Index
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}