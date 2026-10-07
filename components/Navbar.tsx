'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, ChevronDown, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  bagCount?: number;
  onOpenBag?: () => void;
  onNavigate?: (section: string) => void;
}

// ========================================================
// 1. SKIPER UI TEXTROLL (For Desktop Links)
// ========================================================
const STAGGER = 0.022;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className = '', center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-block overflow-hidden cursor-pointer select-none ${className}`}
      style={{ lineHeight: 0.95 }}
    >
      <div className="block">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: '-105%' },
              }}
              transition={{
                ease: [0.25, 1, 0.5, 1],
                duration: 0.35,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </div>

      <div className="absolute inset-0">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: '105%' },
                hovered: { y: 0 },
              }}
              transition={{
                ease: [0.25, 1, 0.5, 1],
                duration: 0.35,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

// ========================================================
// 2. PRELOADER-STYLE DIRECTIONAL LETTER REVEAL (For Mobile Menu)
// ========================================================
const REVEAL_VECTORS = [
  { y: '105%', x: 0 },
  { y: 0, x: '-105%' },
  { y: '-105%', x: 0 },
  { y: 0, x: '105%' },
];

function DirectionalTextReveal({
  text,
  isOpen,
  baseDelay = 0,
}: {
  text: string;
  isOpen: boolean;
  baseDelay?: number;
}) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split('').map((char, index) => {
        const vector = REVEAL_VECTORS[index % REVEAL_VECTORS.length];
        return (
          <span key={index} className="overflow-hidden inline-block relative py-1 px-[0.5px]">
            <motion.span
              initial={{ x: vector.x, y: vector.y }}
              animate={
                isOpen
                  ? {
                      x: 0,
                      y: 0,
                      transition: {
                        duration: 0.45,
                        delay: baseDelay + index * 0.02,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  : {
                      x: vector.x,
                      y: vector.y,
                      transition: {
                        duration: 0.3,
                        delay: (text.length - index) * 0.015,
                        ease: [0.7, 0, 0.3, 1],
                      },
                    }
              }
              className="inline-block leading-none"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

// ========================================================
// NESTED PRODUCT HIERARCHY DATA
// ========================================================
interface SubCategoryItem {
  name: string;
  tag: string;
  spec: string;
  id: string;
}

interface ProductCategory {
  id: string;
  title: string;
  tagline: string;
  items: SubCategoryItem[];
}

const PRODUCT_TAXONOMY: ProductCategory[] = [
  {
    id: 'belts',
    title: 'Heirloom Belts',
    tagline: '4.2mm Single-Origin Steerhide',
    items: [
      { name: 'The Bridle Edition', tag: 'Limited Run', spec: '38mm Full-Grain // Brass', id: 'archive' },
      { name: 'The Onyx Dress Belt', tag: 'Bespoke Suiting', spec: '32mm Calfskin // Graphite', id: 'archive' },
      { name: 'Heritage Raw Saddle', tag: 'Natural Tannin', spec: '40mm Heavy Bovine // Patina', id: 'archive' },
      { name: 'Solid Sand-Cast Buckles', tag: 'Hardware Only', spec: 'Molten Sand-Cast Metal', id: 'anatomy' },
    ],
  },
  {
    id: 'jackets',
    title: 'Atelier Outerwear',
    tagline: 'Tea-Core Hide & Heavy Brass',
    items: [
      { name: 'Tuscan Moto Rider', tag: 'Drop 02 Preview', spec: '1.4mm Heavy Cowhide', id: 'reservation' },
      { name: 'Atelier Field Overshirt', tag: 'Hand-Oiled', spec: 'Unlined Raw Suede', id: 'reservation' },
      { name: 'Archive Aviator Flight', tag: 'Limited Batch', spec: 'Shearling Collar // Brass', id: 'reservation' },
    ],
  },
  {
    id: 'goods',
    title: 'Wallets & Carry',
    tagline: 'Seamless Buttero Construction',
    items: [
      { name: 'Bespoke Folio Wallet', tag: 'Phase 02 Drop', spec: '6-Slot Bifold // Creased', id: 'archive' },
      { name: 'Monolithic Field Duffle', tag: 'Vault Edition', spec: 'Peened Copper Rivets', id: 'patrons' },
      { name: 'EDC Valet Catchall Tray', tag: 'Beeswax Seal', spec: 'Molded Steerhide', id: 'expansion' },
    ],
  },
  {
    id: 'footwear',
    title: 'Welted Footwear',
    tagline: 'Goodyear Welt // Oak-Bark Soles',
    items: [
      { name: 'Channeled Welt Derby', tag: 'Drop 02 Preview', spec: 'Double Leather Sole', id: 'reservation' },
      { name: 'Service Combat Boot', tag: 'Archival', spec: 'Vibram Commando Lug', id: 'reservation' },
    ],
  },
];

// ========================================================
// 3. MAIN NAVBAR COMPONENT
// ========================================================
export default function Navbar({
  bagCount = 0,
  onOpenBag,
  onNavigate,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop Dropdown States
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Accordion States
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>('belts');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnterProducts = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeaveProducts = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 180);
  };

  return (
    <>
      {/* GLASSMORPHIC MAIN NAVBAR */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#F8F8F6]/80 backdrop-blur-2xl border-b border-black/10 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]'
            : 'bg-[#F8F8F6]/90 backdrop-blur-xl border-b border-black/5 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLinkClick('hero')}
              className="flex items-center gap-3 group select-none cursor-pointer text-left"
            >
              <div className="relative p-1.5 rounded-lg bg-black/[0.04] group-hover:bg-black/[0.08] transition-colors border border-black/5">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current transition-transform duration-300 group-hover:scale-95"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="18" y="10" width="28" height="80" rx="2" fill="currentColor" />
                  <rect x="74" y="10" width="6" height="80" rx="2" fill="currentColor" />
                  <rect x="46" y="32" width="34" height="6" fill="currentColor" />
                </svg>
              </div>
              
              <div className="flex items-baseline">
                <TextRoll className="text-[19px] sm:text-[23px] font-black tracking-tight text-black uppercase font-sans">
                  HIDEWOOD
                </TextRoll>
                <span className="text-[9px] font-semibold align-super ml-1 text-black/70">
                  &trade;
                </span>
              </div>
            </button>

            {/* Atelier Tagline */}
            <div className="hidden lg:flex items-center gap-2 pl-6 border-l border-black/10 text-[11px] font-medium tracking-normal text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Series 01 &bull; Heavy Full-Grain Belts</span>
            </div>
          </div>

          {/* DESKTOP NAV LINKS WITH NESTED MULTI-TIER DROPDOWN */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-normal font-sans">
            
            {/* 1. ATELIER PRODUCTS (MULTI-LEVEL NESTED DROPDOWN) */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnterProducts}
              onMouseLeave={handleMouseLeaveProducts}
            >
              <button
                className="flex items-center gap-1 font-semibold text-black hover:text-neutral-600 transition-colors cursor-pointer group"
              >
                <TextRoll center className="font-semibold text-black">
                  Atelier Products
                </TextRoll>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isProductsOpen ? 'rotate-180 text-black' : 'text-neutral-500'
                  }`}
                />
              </button>

              {/* FLOATING MULTI-LEVEL MEGA FLYOUT */}
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 w-[580px] bg-white border border-black/15 shadow-2xl p-0 overflow-hidden flex z-50 text-black select-none mt-1"
                  >
                    {/* Column 1: Primary Categories (Belts, Jackets, Goods, Footwear) */}
                    <div className="w-[230px] bg-neutral-50 border-r border-black/10 p-3 flex flex-col gap-1">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 px-3 py-1 font-bold">
                        Category Index
                      </div>

                      {PRODUCT_TAXONOMY.map((cat, idx) => {
                        const isSelected = activeCategoryIndex === idx;
                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveCategoryIndex(idx)}
                            onClick={() => handleLinkClick('archive')}
                            className={`p-2.5 rounded-none cursor-pointer transition-all duration-200 flex items-center justify-between ${
                              isSelected
                                ? 'bg-black text-white font-bold'
                                : 'hover:bg-black/5 text-neutral-800'
                            }`}
                          >
                            <div>
                              <div className="text-xs uppercase tracking-tight flex items-center gap-1.5">
                                <span>{cat.title}</span>
                              </div>
                              <div className={`text-[10px] font-mono leading-tight ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {cat.tagline}
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 2: Specific Sub-Category Items for active selection */}
                    <div className="flex-1 p-4 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 font-mono text-[9px] uppercase text-neutral-400">
                          <span>{PRODUCT_TAXONOMY[activeCategoryIndex].title} // SPECIFICATIONS</span>
                          <span className="text-red-600 font-bold">DISPATCH VERIFIED</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {PRODUCT_TAXONOMY[activeCategoryIndex].items.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleLinkClick(sub.id)}
                              className="p-2 border border-black/10 hover:border-black hover:bg-neutral-50 text-left transition-all group/sub flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <div className="text-xs font-bold text-black uppercase tracking-tight group-hover/sub:translate-x-0.5 transition-transform">
                                  {sub.name}
                                </div>
                                <div className="text-[10px] font-mono text-neutral-500">
                                  {sub.spec}
                                </div>
                              </div>
                              <span className="text-[9px] font-mono uppercase bg-neutral-200 group-hover/sub:bg-black group-hover/sub:text-white px-2 py-0.5 transition-colors">
                                {sub.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dropdown Mini Footer Banner */}
                      <div className="pt-3 border-t border-black/10 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase mt-4">
                        <span>EST. 2026 TUSCAN HIDE</span>
                        <span className="text-black font-bold">100 YR INTEGRITY BOND</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. CRAFT ANATOMY LINK */}
            <button
              onClick={() => handleLinkClick('anatomy')}
              className="relative py-1.5 text-neutral-700 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-medium text-black">
                Craft Anatomy
              </TextRoll>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 ease-out opacity-80" />
            </button>

            {/* 3. PATRON LOGS / REVIEWS */}
            <button
              onClick={() => handleLinkClick('patrons')}
              className="relative py-1.5 text-neutral-700 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-medium text-black">
                Patron Logs
              </TextRoll>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 ease-out opacity-80" />
            </button>

            {/* 4. PHASE 02 DROP RESERVATION */}
            <button
              onClick={() => handleLinkClick('reservation')}
              className="relative py-1.5 text-neutral-700 hover:text-black transition-colors group cursor-pointer flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <TextRoll center className="font-semibold text-black">
                Phase 02 Drop
              </TextRoll>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 ease-out opacity-80" />
            </button>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Bag Button */}
            <button
              onClick={onOpenBag}
              className="group relative flex items-center gap-2.5 bg-neutral-950 hover:bg-black text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-all duration-300 cursor-pointer shadow-sm backdrop-blur-md border border-white/10 active:scale-95"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-transform duration-200 group-hover:-translate-y-0.5" />
              <TextRoll className="hidden sm:inline-block text-[11px] font-semibold text-white">
                Bag
              </TextRoll>
              <span className="bg-white text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {bagCount}
              </span>
            </button>

            {/* Dispatch Concierge Link */}
            <button
              onClick={() => handleLinkClick('reservation')}
              className="hidden lg:inline-flex items-center gap-1 text-[13px] font-medium text-neutral-800 hover:text-black transition-all pl-2 cursor-pointer font-sans"
            >
              <TextRoll className="font-medium text-black">
                Dispatch
              </TextRoll>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 opacity-60" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden flex-col justify-center items-center w-10 h-10 rounded-full border border-black/10 bg-white/70 backdrop-blur-xl shadow-xs gap-1.5 z-50 cursor-pointer active:scale-90 transition-all"
              aria-label="Toggle Mobile Menu"
            >
              <span
                className={`w-5 h-[2px] bg-black transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-black transition-all duration-200 ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-black transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE FULL-SCREEN ACCORDION & DIRECTORY OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-30 bg-black/95 text-white flex flex-col justify-between px-5 pt-24 pb-8 md:hidden select-none overflow-y-auto"
          >
            {/* Top Sub-Header */}
            <div className="flex justify-between items-center text-xs tracking-tight text-neutral-400 border-b border-white/10 pb-3">
              <span>Directory</span>
              <span>HIDEWOOD &bull; Atelier 2026</span>
            </div>

            {/* ACCORDION CATEGORIES & NESTED SUBS */}
            <div className="flex flex-col gap-4 my-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                // SELECT CATEGORY & SILHOUETTE
              </span>

              {PRODUCT_TAXONOMY.map((cat, idx) => {
                const isExpanded = mobileExpandedCat === cat.id;
                return (
                  <div key={cat.id} className="border-b border-white/10 pb-3">
                    <button
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                      className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-neutral-500 font-bold">0{idx + 1}</span>
                        <h3 className="text-2xl font-bold tracking-tight text-white uppercase">
                          <DirectionalTextReveal
                            text={cat.title}
                            isOpen={isMobileMenuOpen}
                            baseDelay={0.08 + idx * 0.05}
                          />
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>

                    {/* Sub Category Items Accordion Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col gap-2 pt-3 pl-6 overflow-hidden"
                        >
                          {cat.items.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleLinkClick(sub.id)}
                              className="p-2.5 bg-neutral-900 border border-white/10 text-left flex items-center justify-between cursor-pointer active:bg-white active:text-black transition-colors"
                            >
                              <div>
                                <div className="text-xs font-bold uppercase">{sub.name}</div>
                                <div className="text-[10px] font-mono text-neutral-400">{sub.spec}</div>
                              </div>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-white/20">
                                {sub.tag}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Direct Quick Sections */}
              <div className="pt-2 flex flex-col gap-3 font-mono text-xs uppercase">
                <button
                  onClick={() => handleLinkClick('anatomy')}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-neutral-300"
                >
                  <span>// Craft Anatomy Protocol</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleLinkClick('patrons')}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-neutral-300"
                >
                  <span>// Patron Wear Records</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleLinkClick('reservation')}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-red-500 font-bold"
                >
                  <span>// Reserve Phase 02 Dispatch Key</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Glass Concierge Card */}
            <div className="border border-white/10 p-3.5 bg-white/[0.04] backdrop-blur-md flex flex-col gap-1 text-xs text-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-xs font-mono">CONCIERGE DESK</span>
                <span className="text-white font-mono text-xs">dispatch@hidewood.com</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 pt-1 border-t border-white/5">
                4.2mm Tuscan Bovine &bull; Sand-Cast Brass Metallurgy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { TextRoll };