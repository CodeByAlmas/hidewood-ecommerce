'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Flame, Layers, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { TextRoll } from './Navbar';

const BENCHMARKS = [
  {
    num: '01',
    code: 'SPEC // 4.2MM',
    title: 'Unsplit Tuscan Steerhide',
    tag: 'ZERO SYNTHETIC FILLER',
    desc: 'Pure full-grain bovine hide from Santa Croce sull’Arno. No bonded dust, no cardboard core, no laminate veneer.',
    metric: '4.2mm',
    metricLabel: 'Solid Hide Density',
    icon: Layers,
  },
  {
    num: '02',
    code: 'METAL // SOLID FORGE',
    title: 'Sand-Cast Molten Brass',
    tag: 'NICKEL-FREE METALLURGY',
    desc: 'Buckles and rivets hand-poured into compressed green sand molds. Heavier tensile strength that never flakes or peels.',
    metric: '185g',
    metricLabel: 'Raw Hardware Mass',
    icon: Flame,
  },
  {
    num: '03',
    code: 'FINISH // ORGANIC SEAL',
    title: 'Beeswax Friction Burnish',
    tag: 'HAND-BEVELED APEX',
    desc: 'Edges are hand-skived, beveled, and glass-slicked with heated organic cera alba wax to lock internal fibers permanently.',
    metric: '100%',
    metricLabel: 'Natural Edge Seal',
    icon: ShieldCheck,
  },
  {
    num: '04',
    code: 'TENSILE // SADDLE LOCK',
    title: 'Braided Poly-Cord Stitch',
    tag: 'HEIRLOOM BONDING',
    desc: 'Waxed high-tensile bonded thread hand-guided along heavy grooved channels, resisting friction unraveling across generations.',
    metric: '100 YR',
    metricLabel: 'Structural Bond Bond',
    icon: Clock,
  },
];

const PATINA_STAGES = [
  {
    day: 'DAY 01',
    phase: 'ATELIER FRESH',
    tone: 'Matte Pale Ochre',
    desc: 'Rigid, dry-surface grain with firm structural memory. Requires 14 days of body warmth to yield.',
    image: '/AtelierFresh.png',
  },
  {
    day: 'DAY 180',
    phase: 'BODY ACCLIMATION',
    tone: 'Amber Caramel Lustre',
    desc: 'Oils from skin and sunlight oxidize tannins. Contours specifically to the user waist silhouette.',
    image: '/BodyAcclimation.png',
  },
  {
    day: 'YEAR 10+',
    phase: 'HEIRLOOM VAULT',
    tone: 'Deep Cognac Tea-Core',
    desc: 'Glassy, friction-buffed depth. Surface micro-creases lock into immutable personal provenance.',
    image: '/HeirloomVault.png',
  },
];

export default function CraftAnatomy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [activePatina, setActivePatina] = useState(0);

  return (
    <section
      ref={containerRef}
      id="anatomy"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-10 sm:pt-14 pb-20 sm:pb-28 overflow-hidden select-none"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
        
        {/* 1. TOP SUB-BAR HEADER */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 mb-8 sm:mb-12 font-sans"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse shrink-0" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
              Craft Anatomy &bull; The Longevity Protocol
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
            Uncompromised Metallurgy &bull; Tuscan Tannage Benchmark
          </p>
        </motion.div>

        {/* 2. FOUR HARD ENGINEERING BENCHMARKS (CLEAN STRIP) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-14 sm:pb-20 border-b border-black/10"
        >
          {BENCHMARKS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between p-0 w-full"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase pb-2 border-b border-black/10 mb-4 text-neutral-400">
                    <span>{item.code}</span>
                    <span className="text-black font-bold">{item.num}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-black stroke-[2]" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-red-600 font-bold">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black leading-snug mb-2">
                    <span className="inline-flex flex-wrap gap-x-1">
                      {item.title.split(' ').map((word, wIdx) => (
                        <span key={wIdx} className="inline-block overflow-hidden">
                          <TextRoll className="font-black text-black">
                            {word}
                          </TextRoll>
                        </span>
                      ))}
                    </span>
                  </h3>

                  <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-black/10 flex items-baseline justify-between font-mono">
                  <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    {item.metric}
                  </span>
                  <span className="text-[9px] uppercase text-neutral-400 font-semibold">
                    {item.metricLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* 3. THE 3-STAGE PATINA HORIZON TIME-LAPSE SHOWCASE */}
        <div className="pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Text & Interactive Stage Selector */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                PATINA EVOLUTION // 0 TO 3,650 DAYS
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black leading-tight mb-4">
                Vegetable Tannins Do Not Age. They Absorb Life.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-8 max-w-lg">
                Unlike synthetic PU that peels or chrome-tanned leather that degrades, authentic 
                Tuscan vegetable-tanned hides drink indigo dyes, rainwater, and palm friction to evolve a deep caramel glaze.
              </p>
            </div>

            {/* Stages Buttons */}
            <div className="flex flex-col gap-2.5 w-full">
              {PATINA_STAGES.map((stg, sIdx) => {
                const isSelected = activePatina === sIdx;
                return (
                  <button
                    key={sIdx}
                    onClick={() => setActivePatina(sIdx)}
                    className={`p-3 sm:p-4 text-left transition-all duration-300 flex items-start justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-black/10 hover:border-black'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-red-400' : 'text-red-600'}`}>
                          {stg.day}
                        </span>
                        <span className="text-[9px] font-mono tracking-wider opacity-60">
                          // {stg.phase}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-black uppercase tracking-tight">
                        {stg.tone}
                      </div>
                      <p className={`text-[11px] leading-relaxed mt-1 font-normal ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {stg.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pure Image Frame (Color Preserved: grayscale removed) */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] bg-neutral-200 overflow-hidden w-full">
            <motion.img
              key={activePatina}
              src={PATINA_STAGES[activePatina].image}
              alt={PATINA_STAGES[activePatina].phase}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
            
            {/* Top Right HUD Badge */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black text-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider">
              {PATINA_STAGES[activePatina].day} &bull; {PATINA_STAGES[activePatina].phase}
            </div>

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between text-white font-mono text-[9px] uppercase pointer-events-none">
              <span className="bg-black/80 px-2 py-0.5 border border-white/20">
                TUSCAN TANNIN SPECTRUM
              </span>
              <span className="bg-black/80 px-2 py-0.5 border border-white/20">
                PROVENANCE SECURED
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}