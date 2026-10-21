'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, ChevronDown, ChevronRight, KeyRound, User, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { useFavoriteStore } from '@/store/useFavoriteStore';

interface NavbarProps {
  bagCount?: number;
  onOpenBag?: () => void;
  onNavigate?: (section: string) => void;
}

const STAGGER = 0.02;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className = '', center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none h-[1.15em] leading-none ${className}`}
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
                ease: [0.25, 1, 0.5, 1],
                duration: 0.32,
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
                ease: [0.25, 1, 0.5, 1],
                duration: 0.32,
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
      {text.split('').map((char, index) => (
        <span key={index} className="overflow-hidden inline-block relative py-0.5 px-[0.5px]">
          <motion.span
            initial={{ y: '120%', opacity: 0 }}
            animate={
              isOpen
                ? {
                    y: '0%',
                    opacity: 1,
                    transition: {
                      duration: 0.42,
                      delay: baseDelay + index * 0.022,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                : {
                    y: '-120%',
                    opacity: 0,
                    transition: {
                      duration: 0.28,
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
      ))}
    </span>
  );
}

interface SubCategoryItem {
  name: string;
  tag: string;
  spec: string;
  href: string;
}

interface ProductCategory {
  id: string;
  title: string;
  tagline: string;
  items: SubCategoryItem[];
}

const PRODUCT_TAXONOMY: ProductCategory[] = [
  {
    id: 'leather-belts',
    title: 'Leather Belts',
    tagline: '100% Solid Thick Real Leather',
    items: [
      { name: 'Formal Dress Belts', tag: '32mm Fit', spec: 'Smooth edge tailored for suits & trousers', href: '/products?category=FORMAL+BELTS' },
      { name: 'Casual Jeans Belts', tag: '40mm Wide', spec: 'Heavy brass roller buckle for denim', href: '/products?category=CASUAL+BELTS' },
      { name: 'Reversible 2-in-1 Belts', tag: 'Swivel Buckle', spec: 'Twist buckle to switch Black & Brown', href: '/products?category=REVERSIBLE+BELTS' },
      { name: 'Raw Natural Leather Belts', tag: 'Untreated', spec: 'Naturally darkens with sunlight & wear', href: '/products?category=RAW+BELTS' },
      { name: 'Solid Brass Buckles', tag: 'Hardware', spec: 'Heavy sand-cast replacement buckles', href: '/products?category=BUCKLES' },
    ],
  },
  {
    id: 'wallets-edc',
    title: 'Wallets & EDC',
    tagline: 'Slim Daily Pocket Essentials',
    items: [
      { name: 'Classic Bifold Wallets', tag: 'Pocket Slim', spec: 'Holds 8 cards & cash flat without bulk', href: '/products?category=BIFOLD+WALLETS' },
      { name: 'Minimalist Cardholders', tag: '6 Cards', spec: 'Front pocket ultra-slim card sleeves', href: '/products?category=CARDHOLDERS' },
      { name: 'MagSafe Leather Cases', tag: 'MagSafe', spec: 'Real leather phone covers with magnets', href: '/products?category=PHONE+CASES' },
      { name: 'Leather Key Organizers', tag: 'Brass Lock', spec: 'Compact real leather keychains', href: '/products?category=KEYCHAINS' },
    ],
  },
  {
    id: 'travel-bags',
    title: 'Travel Bags & Duffels',
    tagline: 'Cabin-Approved Holdalls',
    items: [
      { name: 'Weekend Travel Duffels', tag: '45L Capacity', spec: 'Heavy leather with solid brass zippers', href: '/products?category=TRAVEL+DUFFELS' },
      { name: 'Daily Laptop Backpacks', tag: 'Laptop Ready', spec: 'Padded straps with 28L storage', href: '/products?category=BACKPACKS' },
      { name: 'Everyday Leather Totes', tag: 'Heavy Steer', spec: 'Reinforced copper rivets for heavy load', href: '/products?category=TOTES' },
    ],
  },
  {
    id: 'outerwear',
    title: 'Jackets & Footwear',
    tagline: 'Pure Cowhide & Welted Soles',
    items: [
      { name: 'Biker Leather Jackets', tag: 'Heavy Rider', spec: '1.4mm cowhide with brass hardware', href: '/products?category=LEATHER+JACKETS' },
      { name: 'Formal Derby Shoes', tag: 'Goodyear Welt', spec: 'Replaceable genuine leather soles', href: '/products?category=FORMAL+SHOES' },
      { name: 'Comfort Leather Slides', tag: 'Ergonomic Bed', spec: 'All-leather molded footbed sandals', href: '/products?category=SANDALS' },
    ],
  },
];

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

  // Live Favourites Count
  const favItems = useFavoriteStore((state) => state.items);
  const favCount = isHydrated ? favItems.length : 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

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
    }, 180);
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F8F6]/90 backdrop-blur-2xl border-b border-black/10 py-2.5 shadow-sm'
            : 'bg-[#F8F8F6]/95 backdrop-blur-xl border-b border-black/5 py-3.5'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 group select-none cursor-pointer text-left"
              aria-label="HIDEWOOD - Return to Home"
            >
              <div className="relative p-1.5 rounded-lg bg-black/[0.04] group-hover:bg-black/[0.08] transition-colors border border-black/5">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current transition-transform duration-300 group-hover:scale-95"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="18" y="10" width="28" height="80" rx="2" fill="currentColor" />
                  <rect x="74" y="10" width="6" height="80" rx="2" fill="currentColor" />
                  <rect x="46" y="32" width="34" height="6" fill="currentColor" />
                </svg>
              </div>
              
              <div className="flex items-baseline overflow-hidden h-[24px]">
                <TextRoll className="text-[19px] sm:text-[22px] font-black tracking-tight text-black uppercase font-sans">
                  HIDEWOOD
                </TextRoll>
                <span className="text-[9px] font-semibold align-super ml-1 text-black/70">
                  &trade;
                </span>
              </div>
            </Link>

            <div className="hidden 2xl:flex items-center gap-2 pl-4 border-l border-black/10 text-[11px] font-medium text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>100% Full-Grain Leather &bull; Made in India</span>
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
              <TextRoll center className="font-semibold text-black">
                Shop All
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>

            {/* FLYOUT */}
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
                aria-label="Browse Collections by Category"
              >
                <TextRoll center className="font-semibold text-black">
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
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[660px] bg-white border border-black/15 shadow-2xl p-0 overflow-hidden flex z-50 text-black select-none mt-2"
                  >
                    <div className="w-[240px] bg-neutral-50 border-r border-black/10 p-3 flex flex-col gap-1">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 px-3 py-1 font-bold">
                        Shop By Category
                      </div>

                      {PRODUCT_TAXONOMY.map((cat, idx) => {
                        const isSelected = activeCategoryIndex === idx;
                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveCategoryIndex(idx)}
                            onClick={() => handleActionClick('/products', true)}
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

                    <div className="flex-1 p-4 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 font-mono text-[9px] uppercase text-neutral-400">
                          <span>{PRODUCT_TAXONOMY[activeCategoryIndex].title} &bull; Sub-Categories</span>
                          <span className="text-red-600 font-bold">100% PURE LEATHER</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          {PRODUCT_TAXONOMY[activeCategoryIndex].items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="p-2 border border-black/10 hover:border-black hover:bg-neutral-50 text-left transition-all group/sub flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <div className="text-xs font-bold text-black uppercase tracking-tight group-hover/sub:translate-x-0.5 transition-transform flex items-center gap-1">
                                  <span>{sub.name}</span>
                                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-[10px] font-mono text-neutral-500">
                                  {sub.spec}
                                </div>
                              </div>
                              <span className="text-[9px] font-mono uppercase bg-neutral-200 group-hover/sub:bg-black group-hover/sub:text-white px-2 py-0.5 transition-colors shrink-0">
                                {sub.tag}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/10 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase mt-4">
                        <Link
                          href="/products"
                          onClick={() => setIsProductsOpen(false)}
                          className="text-black font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Explore All {PRODUCT_TAXONOMY[activeCategoryIndex].title}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <span>LIFETIME GUARANTEE</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/provenance"
              className="relative py-1 text-neutral-700 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-medium text-black">
                About Us
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>

            <Link
              href="/contact"
              className="relative py-1 text-neutral-700 hover:text-black transition-colors group cursor-pointer"
            >
              <TextRoll center className="font-medium text-black">
                Help &amp; Support
              </TextRoll>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300 opacity-80" />
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* FAVORITES BUTTON (DESKTOP) */}
            <Link
              href="/favorites"
              className="relative hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 hover:text-black transition-colors py-1.5 px-2.5 border border-black/10 hover:border-black bg-white"
              aria-label={`View Wishlist containing ${favCount} items`}
            >
              <Heart className={`w-3.5 h-3.5 ${favCount > 0 ? 'fill-red-600 text-red-600' : 'text-neutral-600'}`} />
              <span className="font-bold text-[11px] uppercase tracking-wide">Saved</span>
              {favCount > 0 && (
                <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[9px]">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 hover:text-black transition-colors py-1.5 px-2.5 border border-black/10 hover:border-black bg-white"
              aria-label="Customer Sign In"
            >
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Sign In</span>
            </Link>

            <Link
              href="/orders"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 hover:text-black transition-colors py-1.5 px-2.5 border border-black/10 hover:border-black bg-white"
              aria-label="Customer Orders and Tracking"
            >
              <KeyRound className="w-3.5 h-3.5 text-neutral-600" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Orders</span>
            </Link>

            <button
              type="button"
              onClick={handleBagButtonClick}
              className="group relative flex items-center gap-2 bg-neutral-950 hover:bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              aria-label={`Shopping Bag containing ${activeBagCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
              <span className="hidden sm:inline-block text-[11px] font-semibold text-white">Bag</span>
              <span className="bg-white text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {activeBagCount}
              </span>
            </button>

            <Link
              href="/reservation"
              className="hidden xl:inline-flex items-center gap-1 text-[12px] font-medium text-neutral-800 hover:text-black pl-1 cursor-pointer font-sans"
              aria-label="Direct Phase 02 Dispatch Concierge"
            >
              <span className="font-semibold text-black">Dispatch</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden flex-col justify-center items-center w-9 h-9 rounded-full border border-black/10 bg-white/70 backdrop-blur-xl shadow-xs gap-1.5 z-50 cursor-pointer active:scale-90 transition-all"
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

      {/* MOBILE FULL-SCREEN DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-black/95 text-white flex flex-col justify-between px-5 pt-24 pb-8 md:hidden select-none overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-tight text-neutral-400 border-b border-white/10 pb-3">
              <span>Main Menu</span>
              <span>HIDEWOOD &bull; Real Leather</span>
            </div>

            {/* Mobile Primary Direct Links */}
            <div className="flex flex-col gap-2 my-4 pt-2">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-base font-bold uppercase tracking-tight text-white active:bg-white active:text-black transition-colors"
              >
                <span>Shop All Products</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {/* FAVORITES MOBILE LINK */}
              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white active:bg-white active:text-black transition-colors font-mono"
              >
                <span className="flex items-center gap-2">
                  <Heart className={`w-3.5 h-3.5 ${favCount > 0 ? 'fill-red-500 text-red-500' : 'text-neutral-300'}`} />
                  Saved Wishlist ({favCount})
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white active:bg-white active:text-black transition-colors font-mono"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-neutral-300" />
                  Sign In / Register
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 bg-white/10 border border-white/20 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-emerald-400 active:bg-white active:text-black transition-colors font-mono"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  My Orders &amp; Tracking
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Accordion Categories */}
            <div className="flex flex-col gap-3 my-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                // SHOP BY CATEGORY
              </span>

              {PRODUCT_TAXONOMY.map((cat, idx) => {
                const isExpanded = mobileExpandedCat === cat.id;
                return (
                  <div key={cat.id} className="border-b border-white/10 pb-2.5">
                    <button
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                      className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-neutral-500 font-bold">0{idx + 1}</span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                          <DirectionalTextReveal
                            text={cat.title}
                            isOpen={isMobileMenuOpen}
                            baseDelay={0.05 + idx * 0.04}
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
                          transition={{ duration: 0.25 }}
                          className="flex flex-col gap-2 pt-2.5 pl-4 sm:pl-6 overflow-hidden"
                        >
                          {cat.items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="p-2.5 bg-neutral-900 border border-white/10 text-left flex items-center justify-between cursor-pointer active:bg-white active:text-black transition-colors"
                            >
                              <div>
                                <div className="text-xs font-bold uppercase">{sub.name}</div>
                                <div className="text-[10px] font-mono text-neutral-400">{sub.spec}</div>
                              </div>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-white/20">
                                {sub.tag}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="pt-3 flex flex-col gap-2.5 font-mono text-xs uppercase">
                <Link
                  href="/provenance"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-neutral-300 text-left"
                >
                  <span>// About Us &amp; Craft</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-neutral-300 text-left"
                >
                  <span>// Customer Help &amp; Support</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/reservation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-red-500 font-bold text-left"
                >
                  <span>// Dispatch Reservation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bottom Support Card */}
            <div className="border border-white/10 p-3.5 bg-white/[0.04] backdrop-blur-md flex flex-col gap-1 text-xs text-neutral-300 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-xs font-mono">CUSTOMER CARE</span>
                <span className="text-white font-mono text-xs">support@hidewood.com</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 pt-1 border-t border-white/5">
                Handcrafted in Kanpur &bull; 100% Genuine Full-Grain Leather
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { TextRoll };