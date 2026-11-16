'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  KeyRound,
  User,
  Heart,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { getStoredCategories, DEFAULT_CATEGORY_SUB_MAP } from '@/lib/categories';

interface NavbarProps {
  bagCount?: number;
  onOpenBag?: () => void;
  onNavigate?: (section: string) => void;
}

const STAGGER = 0.025;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className = '', center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none h-[1.2em] leading-none ${className}`}
    >
      <span className="inline-flex">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: '0%' },
                hovered: { y: '-120%' },
              }}
              transition={{
                ease: [0.16, 1, 0.3, 1],
                duration: 0.38,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </span>

      <span className="absolute inset-0 inline-flex">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: '120%' },
                hovered: { y: '0%' },
              }}
              transition={{
                ease: [0.16, 1, 0.3, 1],
                duration: 0.38,
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
};

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
        const staggeredDelay = baseDelay + Math.sin((index + 1) * 0.45) * 0.04 + index * 0.024;

        return (
          <span key={index} className="overflow-hidden inline-block relative py-0.5 px-[0.5px]">
            <motion.span
              initial={{ y: '130%', opacity: 0 }}
              animate={
                isOpen
                  ? {
                      y: '0%',
                      opacity: 1,
                      transition: {
                        duration: 0.45,
                        delay: staggeredDelay,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  : {
                      y: '-130%',
                      opacity: 0,
                      transition: {
                        duration: 0.25,
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

export default function Navbar({
  bagCount,
  onOpenBag,
  onNavigate,
}: NavbarProps) {
  const router = useRouter();
  const isHydrated = useCartHydrated();

  const openCart = useCartStore((state) => state.openCart);
  const totalStoreItems = useCartStore((state) => state.getTotalItems());
  const activeBagCount = isHydrated ? totalStoreItems : (bagCount ?? 0);

  const favItems = useFavoriteStore((state) => state.items);
  const favCount = isHydrated ? favItems.length : 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Categories from Stored Architecture
  const [categoryMap, setCategoryMap] = useState<Record<string, string[]>>(DEFAULT_CATEGORY_SUB_MAP);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  // Sync Categories safely with microtask scheduling to eliminate setState-in-render conflict
  useEffect(() => {
    let isMounted = true;

    const updateCats = () => {
      setTimeout(() => {
        if (isMounted) {
          setCategoryMap(getStoredCategories());
        }
      }, 0);
    };

    updateCats();

    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.categories) {
          setCategoryMap(data.categories);
          localStorage.setItem('hidewood_categories_map', JSON.stringify(data.categories));
        }
      })
      .catch(() => {});

    window.addEventListener('hidewood_categories_updated', updateCats);
    return () => {
      isMounted = false;
      window.removeEventListener('hidewood_categories_updated', updateCats);
    };
  }, []);

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

  const handleActionClick = (target: string, isInternalRoute = false) => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);

    if (isInternalRoute) {
      router.push(target);
      return;
    }

    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/#${target}`);
      }
    }
  };

  const handleBagButtonClick = () => {
    if (onOpenBag) onOpenBag();
    openCart();
  };

  const handleMouseEnterProducts = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeaveProducts = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 200);
  };

  const categoriesList = Object.keys(categoryMap);
  const currentCategoryName = categoriesList[activeCategoryIndex] || categoriesList[0] || 'Full-Grain Belts';
  const currentSubCategories = categoryMap[currentCategoryName] || [];

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F8F6]/95 backdrop-blur-2xl border-b border-black/10 py-2.5 shadow-sm'
            : 'bg-[#F8F8F6]/95 backdrop-blur-xl border-b border-black/5 py-3.5'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          
          {/* EXACT OFFICIAL H LOGO FROM REFERENCE */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center group select-none cursor-pointer"
              aria-label="HIDEWOOD Home"
            >
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-black fill-current transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:scale-105 active:scale-95"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* 1. Left Heavy Solid Monolith Rectangle[cite: 7] */}
                <rect x="18" y="10" width="30" height="80" fill="currentColor" />
                {/* 2. Right Needle Thin Line[cite: 7] */}
                <rect x="76" y="10" width="4.5" height="80" rx="2.25" fill="currentColor" />
                {/* 3. Center Crossbar Passing Through Needle[cite: 7] */}
                <rect x="44" y="34.5" width="41" height="5" rx="2.5" fill="currentColor" />
              </svg>
            </Link>

            <div className="hidden 2xl:flex items-center gap-2 pl-4 border-l border-black/10 text-[11px] font-mono text-neutral-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>100% Genuine Leather &bull; Made in India</span>
            </div>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-sans"
          >
            <Link
              href="/products"
              className="relative py-1 text-neutral-800 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-semibold text-black uppercase tracking-tight text-xs">
                Shop All
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>

            {/* DYNAMIC COLLECTIONS DRAWER */}
            <div
              className="relative py-1"
              onMouseEnter={handleMouseEnterProducts}
              onMouseLeave={handleMouseLeaveProducts}
              aria-haspopup="true"
              aria-expanded={isProductsOpen}
            >
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-black hover:text-neutral-600 transition-colors cursor-pointer group"
                aria-label="Browse Collections"
              >
                <TextRoll center className="font-semibold text-black uppercase tracking-tight text-xs">
                  Collections
                </TextRoll>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isProductsOpen ? 'rotate-180 text-black' : 'text-neutral-500'
                  }`}
                />
              </button>

              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 sm:left-[-40px] w-[680px] bg-white border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden flex z-50 text-black select-none mt-3"
                  >
                    {/* Left Category List */}
                    <div className="w-[240px] bg-[#F8F8F6] border-r border-black/10 p-3 flex flex-col justify-between shrink-0">
                      <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 py-1 font-bold">
                          Categories
                        </div>

                        {categoriesList.map((catName, idx) => {
                          const isSelected = activeCategoryIndex === idx;
                          const subCount = (categoryMap[catName] || []).length;
                          return (
                            <div
                              key={catName}
                              onMouseEnter={() => setActiveCategoryIndex(idx)}
                              onClick={() => handleActionClick('/products', true)}
                              className={`p-2.5 rounded-none cursor-pointer transition-colors flex items-center justify-between ${
                                isSelected
                                  ? 'bg-black text-white shadow-xs'
                                  : 'hover:bg-black/5 text-neutral-800'
                              }`}
                            >
                              <div>
                                <div className="text-xs uppercase font-bold tracking-tight">
                                  {catName}
                                </div>
                                <div className={`text-[10px] font-mono leading-tight mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                  {subCount} items
                                </div>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-black text-white font-mono text-[9px] uppercase tracking-wider mt-2">
                        <span className="text-amber-400 font-bold block mb-0.5">Pure Leather Only</span>
                        <span>Zero fake fillers &bull; Real hide</span>
                      </div>
                    </div>

                    {/* Right Sub-Category View */}
                    <div className="flex-1 p-5 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 font-mono text-[10px] uppercase">
                          <span className="font-bold text-black tracking-wider">
                            {currentCategoryName}
                          </span>
                          <span className="text-red-600 font-bold">
                            {currentSubCategories.length} Options
                          </span>
                        </div>

                        {currentSubCategories.length === 0 ? (
                          <div className="p-8 text-center text-neutral-400 font-mono text-xs border border-dashed border-black/10">
                            No items added under {currentCategoryName} yet.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto [scrollbar-width:none]">
                            {currentSubCategories.map((subName, sIdx) => (
                              <Link
                                key={sIdx}
                                href={`/products?category=${encodeURIComponent(currentCategoryName)}`}
                                onClick={() => setIsProductsOpen(false)}
                                className="p-2.5 border border-black/10 hover:border-black hover:bg-[#F8F8F6] text-left transition-colors group/sub flex items-center justify-between cursor-pointer"
                              >
                                <div>
                                  <div className="text-xs font-bold text-black uppercase tracking-tight flex items-center gap-1.5">
                                    <span>{subName}</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity text-black" />
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                                    100% Genuine Full-Grain Leather
                                  </div>
                                </div>
                                <span className="text-[9px] font-mono uppercase bg-neutral-100 group-hover/sub:bg-black group-hover/sub:text-white px-2 py-0.5 transition-colors shrink-0 font-bold border border-black/5">
                                  View
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-black/10 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase mt-4">
                        <Link
                          href={`/products?category=${encodeURIComponent(currentCategoryName)}`}
                          onClick={() => setIsProductsOpen(false)}
                          className="text-black font-bold hover:underline flex items-center gap-1"
                        >
                          <span>See All {currentCategoryName}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <span className="font-bold text-black">Lifetime Warranty</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/corporate-gifting"
              className="relative py-1 text-neutral-800 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-semibold text-black uppercase tracking-tight text-xs">
                Corporate Gifting
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>

            <Link
              href="/provenance"
              className="relative py-1 text-neutral-800 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-semibold text-black uppercase tracking-tight text-xs">
                About Us
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>

            <Link
              href="/contact"
              className="relative py-1 text-neutral-800 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-semibold text-black uppercase tracking-tight text-xs">
                Help &amp; Support
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/favorites"
              className="relative hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-800 hover:text-black transition-colors py-1.5 px-3 border border-black/15 hover:border-black bg-white shadow-xs"
              aria-label={`Saved items (${favCount})`}
            >
              <Heart className={`w-3.5 h-3.5 ${favCount > 0 ? 'fill-red-600 text-red-600' : 'text-neutral-700'}`} />
              <span className="font-bold text-[11px] uppercase tracking-wide">Saved</span>
              {favCount > 0 && (
                <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[9px]">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-800 hover:text-black transition-colors py-1.5 px-3 border border-black/15 hover:border-black bg-white shadow-xs"
              aria-label="Sign In"
            >
              <User className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Sign In</span>
            </Link>

            <Link
              href="/orders"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-800 hover:text-black transition-colors py-1.5 px-3 border border-black/15 hover:border-black bg-white shadow-xs"
              aria-label="Orders"
            >
              <KeyRound className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Orders</span>
            </Link>

            <button
              type="button"
              onClick={handleBagButtonClick}
              className="group relative flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              aria-label={`Shopping Bag (${activeBagCount} items)`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
              <span className="hidden sm:inline-block text-[11px] font-semibold text-white uppercase font-mono">Bag</span>
              <span className="bg-white text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {activeBagCount}
              </span>
            </button>

            <Link
              href="/reservation"
              className="hidden xl:inline-flex items-center gap-1 text-[12px] font-medium text-neutral-800 hover:text-black pl-1 cursor-pointer font-sans"
              aria-label="Book Dispatch"
            >
              <span className="font-bold text-xs uppercase tracking-tight text-black">Dispatch</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden flex-col justify-center items-center w-9 h-9 rounded-full border border-black/15 bg-white/90 backdrop-blur-xl shadow-xs gap-1.5 z-50 cursor-pointer active:scale-90 transition-all"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`w-4 h-[1.5px] bg-black transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-black transition-all duration-200 ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-black transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#0C0C0C] text-white flex flex-col justify-between px-5 pt-24 pb-8 md:hidden select-none overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE STORE
                </span>
                <span>KANPUR &bull; 100% LEATHER</span>
              </div>

              <div className="flex flex-col gap-2 my-4 pt-1">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-3.5 bg-white text-black border border-white flex items-center justify-between text-sm font-black uppercase tracking-tight active:scale-[0.99] transition-transform"
                >
                  <span>Explore All Products</span>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </Link>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] uppercase">
                  <Link
                    href="/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-white active:bg-white active:text-black transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Heart className={`w-3.5 h-3.5 ${favCount > 0 ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} />
                      Saved ({favCount})
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-emerald-400 active:bg-white active:text-black transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      Orders
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </Link>
                </div>

                <Link
                  href="/corporate-gifting"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-300 active:bg-white active:text-black transition-colors font-mono"
                >
                  <span>Corporate &amp; Bulk Gifting</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </Link>

                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-300 active:bg-white active:text-black transition-colors font-mono"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    Sign In / Register
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                </Link>
              </div>

              {/* Dynamic Accordion Categories */}
              <div className="flex flex-col gap-2.5 my-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                  // BROWSE BY CATEGORY
                </span>

                {categoriesList.map((catName, idx) => {
                  const isExpanded = mobileExpandedCat === catName;
                  const subs = categoryMap[catName] || [];

                  return (
                    <div key={catName} className="border-b border-white/10 pb-2.5">
                      <button
                        onClick={() => setMobileExpandedCat(isExpanded ? null : catName)}
                        className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-mono text-neutral-500 font-bold">0{idx + 1}</span>
                          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-sans">
                            <DirectionalTextReveal
                              text={catName}
                              isOpen={isMobileMenuOpen}
                              baseDelay={0.06 + idx * 0.05}
                            />
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-white' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-2 pt-2.5 pl-4 sm:pl-6 overflow-hidden"
                          >
                            {subs.length === 0 ? (
                              <div className="text-[10px] text-neutral-500 font-mono py-1">
                                No subcategories yet.
                              </div>
                            ) : (
                              subs.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={`/products?category=${encodeURIComponent(catName)}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="p-2.5 bg-neutral-900 border border-white/10 text-left flex items-center justify-between cursor-pointer active:bg-white active:text-black transition-colors"
                                >
                                  <div>
                                    <div className="text-xs font-bold uppercase">{sub}</div>
                                    <div className="text-[10px] font-mono text-neutral-400">100% Genuine Leather</div>
                                  </div>
                                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 border border-white/20 shrink-0 font-bold">
                                    View
                                  </span>
                                </Link>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-white/10 p-3 bg-white/[0.03] flex flex-col gap-1 text-xs text-neutral-300 mt-4">
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-neutral-400">CUSTOMER CARE</span>
                <span className="text-white">care@hidewood.in</span>
              </div>
              <p className="text-[9px] font-mono text-neutral-500 pt-1 border-t border-white/5 uppercase">
                Kanpur Workshop &bull; 100% Real Leather
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { TextRoll };