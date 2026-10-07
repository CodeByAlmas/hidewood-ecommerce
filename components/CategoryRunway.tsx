'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Sparkles, Lock } from 'lucide-react';
import { TextRoll } from './Navbar';

export interface SubCategoryItem {
  id: string;
  num: string;
  name: string;
  badge: string;
  rangeCount: string;
  spec: string;
  image: string;
}

export interface ParentCategory {
  id: string;
  num: string;
  code: string;
  name: string;
  status: 'In Stock' | 'Launching Soon' | 'Coming Soon';
  tagline: string;
  image: string;
  subCategories: SubCategoryItem[];
}

const CATEGORIES_DATA: ParentCategory[] = [
  {
    id: 'cat-belts',
    num: '01',
    code: 'DISCIPLINE // 01',
    name: 'Leather Belts',
    status: 'In Stock',
    tagline: 'Pure 4.2mm full-grain leather belts with solid sand-cast brass buckles.',
    image: '/belt-macro.png',
    subCategories: [
      {
        id: 'sub-formal',
        num: '01',
        name: 'Formal Dress Belts',
        badge: '32mm Profile',
        rangeCount: '4 Cuts',
        spec: 'Tailored Suiting Edge',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-casual',
        num: '02',
        name: 'Casual Jeans Belts',
        badge: '40mm Harness',
        rangeCount: '3 Cuts',
        spec: 'Solid Brass Roller',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-reversible',
        num: '03',
        name: 'Reversible 2-in-1',
        badge: '34mm Swivel',
        rangeCount: 'Dual Face',
        spec: 'Black & Tan Flip',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-raw',
        num: '04',
        name: 'Raw Patina Belts',
        badge: '38mm Untreated',
        rangeCount: 'Heirloom',
        spec: 'Ages With Sunlight',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'cat-wallets-edc',
    num: '02',
    code: 'DISCIPLINE // 02',
    name: 'Wallets & EDC',
    status: 'Launching Soon',
    tagline: 'Slim bifold wallets, card sleeves, and MagSafe leather phone cases.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200&auto=format&fit=crop',
    subCategories: [
      {
        id: 'sub-bifold',
        num: '01',
        name: 'Classic Bifolds',
        badge: '8 Cards + Cash',
        rangeCount: 'Phase 02',
        spec: 'Flush Beeswax Edge',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-cardholder',
        num: '02',
        name: 'Card Sleeves',
        badge: 'Minimal EDC',
        rangeCount: 'Daily Carry',
        spec: 'Single Fold Steerhide',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-phone-case',
        num: '03',
        name: 'Leather Phone Cases',
        badge: 'MagSafe Ready',
        rangeCount: 'Pre-Order',
        spec: 'Vegetable-Tanned Shell',
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'cat-carry',
    num: '03',
    code: 'DISCIPLINE // 03',
    name: 'Travel & Bags',
    status: 'Coming Soon',
    tagline: 'Spacious weekend holdalls, field duffels, and structural leather baggage.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
    subCategories: [
      {
        id: 'sub-duffle',
        num: '01',
        name: 'Weekend Duffles',
        badge: '32L Holdall',
        rangeCount: 'Vault Blueprint',
        spec: 'Wrap-Around Harness',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-tote',
        num: '02',
        name: 'Monolithic Field Totes',
        badge: 'Heavy Steer',
        rangeCount: 'Archive',
        spec: 'Copper Rivet Anchors',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'cat-outerwear-tack',
    num: '04',
    code: 'DISCIPLINE // 04',
    name: 'Jackets & Tack',
    status: 'Coming Soon',
    tagline: 'Tea-core leather jackets, saddlery equestrian tack, deerskin gloves & hats.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
    subCategories: [
      {
        id: 'sub-jacket',
        num: '01',
        name: 'Double Rider Jacket',
        badge: '1.4mm Horsehide',
        rangeCount: 'Winter Drop',
        spec: 'Cupro Satin Lining',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-equestrian',
        num: '02',
        name: 'Saddlery & Tack',
        badge: '5.5mm Thickness',
        rangeCount: 'Bespoke Order',
        spec: 'Hand-Waxed Stirrups',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-gloves',
        num: '03',
        name: 'Artisanal Gloves',
        badge: 'Deerskin',
        rangeCount: 'Autumn Drop',
        spec: 'External Seam Stitch',
        image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-hats',
        num: '04',
        name: 'Leather Hats & Caps',
        badge: '6-Panel Block',
        rangeCount: 'Phase 04',
        spec: 'Oiled Roughout',
        image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'cat-footwear',
    num: '05',
    code: 'DISCIPLINE // 05',
    name: 'Footwear Atelier',
    status: 'Coming Soon',
    tagline: 'Goodyear welted shoes, dress boots, raw-edge slides, and home slippers.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
    subCategories: [
      {
        id: 'sub-loafer',
        num: '01',
        name: 'Penny Loafers & Boots',
        badge: 'Calfskin',
        rangeCount: 'Phase 03',
        spec: 'Oak-Bark Tanned Soles',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'sub-sandal',
        num: '02',
        name: 'Sandals & Slippers',
        badge: 'Barefoot Cut',
        rangeCount: 'Summer Vault',
        spec: 'Solid Brass Buckles',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
];

interface CategoryRunwayProps {
  isReady?: boolean;
  onSelectSubCategory?: (subId: string) => void;
}

export default function CategoryRunway({
  isReady = true,
  onSelectSubCategory,
}: CategoryRunwayProps) {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [glassModalCat, setGlassModalCat] = useState<ParentCategory | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    const checkView = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        setHasTriggered(true);
      }
    };

    const timer = setTimeout(checkView, 150);
    window.addEventListener('scroll', checkView, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkView);
    };
  }, [isReady]);

  return (
    <>
      {/* ZERO BORDER LINE + TIGHT BOTTOM PADDING (pb-4 sm:pb-6) */}
      <section
        ref={sectionRef}
        id="categories"
        className="relative w-screen left-1/2 -translate-x-1/2 pt-1 pb-4 sm:pb-6 select-none overflow-hidden"
      >
        <div className="w-full px-2 sm:px-4 md:px-6">
          {/* SHOP BY CATEGORIES SUB-BAR (No extra border line) */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 mb-4 sm:mb-6 font-sans">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse shrink-0" />
              <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
                Shop by Categories &bull; 5 Master Disciplines
              </h2>
            </div>
            <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
              Series 01 Belts In Stock &bull; Disciplines 02–05 In Tannage
            </p>
          </div>

          {/* MAIN CATEGORIES DISPLAY */}
          <motion.div
            initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, x: -20 }}
            animate={
              hasTriggered
                ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, x: 0 }
                : { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, x: -20 }
            }
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* 1. MOBILE-DEDICATED FULL-CARD TOUCH LAYOUT */}
            <div className="flex md:hidden flex-col gap-3 w-full">
              {CATEGORIES_DATA.map((cat) => {
                const isLive = cat.status === 'In Stock';
                return (
                  <div
                    key={`mobile-${cat.id}`}
                    onClick={() => setGlassModalCat(cat)}
                    className="relative w-full h-44 bg-neutral-950 border border-black/15 overflow-hidden cursor-pointer group active:scale-[0.99] transition-transform"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover grayscale contrast-125 brightness-75"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white font-mono text-[9px] uppercase">
                      <span className="bg-black/80 px-2 py-0.5 border border-white/15 font-bold">
                        0{cat.num} &bull; {cat.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 border font-bold flex items-center gap-1 ${
                          isLive
                            ? 'bg-white text-black border-white'
                            : 'bg-black/70 text-neutral-300 border-white/15'
                        }`}
                      >
                        {!isLive && <Lock className="w-2.5 h-2.5" />}
                        {cat.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                      <div>
                        <h3 className="text-base font-black uppercase tracking-tight text-white leading-tight">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-neutral-300 line-clamp-1 max-w-[65vw] font-normal mt-0.5">
                          {cat.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[9px] uppercase font-bold bg-white text-black px-2 py-0.5 shrink-0">
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP HARMONIOUS ACCORDION */}
            <div className="hidden md:flex flex-row w-full gap-3 lg:gap-4 items-stretch">
              {CATEGORIES_DATA.map((cat, idx) => {
                const isSelected = activeCard === idx;
                const isLive = cat.status === 'In Stock';

                return (
                  <motion.div
                    key={cat.id}
                    onClick={() => {
                      setActiveCard(idx);
                      setGlassModalCat(cat);
                    }}
                    onMouseEnter={() => setActiveCard(idx)}
                    className="relative cursor-pointer overflow-hidden border border-black/15 bg-neutral-950 group h-[23rem] lg:h-[24rem]"
                    animate={{
                      flex: isSelected ? 3.4 : 1,
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white font-mono text-[10px] uppercase">
                      <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 font-bold shrink-0">
                        0{cat.num}
                      </span>
                      <span
                        className={`px-2 py-0.5 border font-bold text-[9px] shrink-0 flex items-center gap-1 ${
                          isLive
                            ? 'bg-white text-black border-white'
                            : 'bg-black/70 backdrop-blur-md text-neutral-300 border-white/15'
                        }`}
                      >
                        {!isLive && <Lock className="w-2.5 h-2.5" />}
                        {cat.status}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 flex flex-col justify-end text-white overflow-hidden">
                      {isSelected ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full"
                        >
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                            {cat.code}
                          </span>

                          <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight mb-2 text-white">
                            <span className="inline-flex flex-wrap gap-x-1.5">
                              {cat.name.split(' ').map((word, wIdx) => (
                                <span key={wIdx} className="inline-block overflow-hidden">
                                  <TextRoll className="font-black text-white">
                                    {word}
                                  </TextRoll>
                                </span>
                              ))}
                            </span>
                          </h3>

                          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3 font-normal">
                            {cat.tagline}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] font-mono uppercase">
                            <span className="text-neutral-400 flex items-center gap-1 text-[10px]">
                              <Sparkles className="w-3 h-3 text-white" />
                              {cat.subCategories.length} Items Configured
                            </span>

                            <span className="inline-flex items-center gap-1 text-white font-bold group-hover:text-neutral-200">
                              <span>Explore Details</span>
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:rotate-45 group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-full overflow-hidden">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase block">
                            0{cat.num}
                          </span>
                          <h4 className="text-xs lg:text-sm font-bold uppercase tracking-tight truncate text-neutral-200 group-hover:text-white transition-colors">
                            {cat.name}
                          </h4>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPACT ATELIER SUB-CATEGORY DRAWER MODAL */}
      <AnimatePresence>
        {glassModalCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGlassModalCat(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#111111] text-white border border-white/20 shadow-2xl p-4 sm:p-7 z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
                        <span className="inline-flex flex-wrap gap-x-1.5">
                          {glassModalCat.name.split(' ').map((word, wIdx) => (
                            <span key={wIdx} className="inline-block overflow-hidden">
                              <TextRoll className="font-black text-white">
                                {word}
                              </TextRoll>
                            </span>
                          ))}
                        </span>
                      </h3>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 border border-white/20 bg-white/10 text-neutral-300">
                        {glassModalCat.status}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                      [ {glassModalCat.subCategories.length} Disciplines Configured ] &bull; Select to inspect piece
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setGlassModalCat(null)}
                  className="p-1.5 sm:p-2 border border-white/20 hover:border-white bg-white/5 hover:bg-white text-white hover:text-black cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 sm:mt-5 flex gap-3 sm:gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#FFFFFF_#222222]">
                {glassModalCat.subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setGlassModalCat(null);
                      if (onSelectSubCategory) onSelectSubCategory(sub.id);
                    }}
                    className="group relative flex-1 min-w-[200px] sm:min-w-[220px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white transition-all duration-300 cursor-pointer p-3 sm:p-3.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase pb-2 border-b border-white/10 mb-2.5 sm:mb-3 text-neutral-400">
                      <span>LINE 0{sub.num}</span>
                      <span className="text-white font-bold">{sub.rangeCount}</span>
                    </div>

                    <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden border border-white/10 mb-2.5 sm:mb-3">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 right-2 text-[9px] font-mono text-neutral-300 truncate">
                        {sub.spec}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-neutral-400 uppercase block mb-0.5">
                        {sub.badge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white truncate mb-2 sm:mb-3">
                        <span className="inline-flex flex-wrap gap-x-1">
                          {sub.name.split(' ').map((word, wIdx) => (
                            <span key={wIdx} className="inline-block overflow-hidden">
                              <TextRoll className="font-black text-white">
                                {word}
                              </TextRoll>
                            </span>
                          ))}
                        </span>
                      </h4>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase font-bold text-white">
                        <span>{glassModalCat.status === 'In Stock' ? 'Explore Piece' : 'Join Waitlist'}</span>
                        <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full border border-white/20 group-hover:border-white flex items-center justify-center">
                          <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:rotate-45 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase">
                <span>Santa Croce Tuscan Full-Grain Hide &bull; Kanpur Handcraft</span>
                <span className="text-neutral-400">HIDEWOOD ATELIER &bull; INDIA</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}