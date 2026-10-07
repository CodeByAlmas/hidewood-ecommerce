'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/Preloader';
import HeroTitle from '@/components/HeroTitle';
import CategoryRunway from '@/components/CategoryRunway';
import ProductGrid from '@/components/ProductGrid';
import AtelierFilm from '@/components/AtelierFilm';
import CraftAnatomy from '@/components/CraftAnatomy';
import TiltedTilesReviews from '@/components/TiltedTilesReviews';
import DropReservationBanner from '@/components/DropReservationBanner';

interface Product {
  id: string;
  name: string;
  price: number;
  badge: string;
  category: string;
  description: string;
  spec: string;
  inStock: boolean;
  images: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'the-bridle-edition',
    name: 'The Bridle Edition',
    price: 5499,
    badge: 'Limited Run',
    category: 'Full-Grain 38mm',
    description: 'Cut from single-origin English bridle leather. Hot-stuffed with natural waxes and hand-burnished for lifetime wear.',
    spec: '4.2mm Unsplit Hide • Solid Sand-Cast Brass',
    inStock: true,
    images: [
      '/belt-macro.png',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'the-onyx-dress',
    name: 'The Onyx Dress',
    price: 6299,
    badge: 'Archive 2026',
    category: 'Dress 32mm',
    description: 'Ultra-refined profile tailored for bespoke suits. Hand-beveled edge painted in deep matte graphite.',
    spec: 'Tuscan Calfskin • Brushed Steel Hardware',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'heritage-raw-saddle',
    name: 'Heritage Raw Saddle',
    price: 6999,
    badge: 'Sold out',
    category: 'Heavy Harness 40mm',
    description: 'Natural untreated vegetable-tanned leather that develops a deep caramel patina unique to your movement.',
    spec: 'Heavy Bovine Butt • Hand Saddle-Stitched',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'bespoke-folio-wallet',
    name: 'Bespoke Folio Wallet',
    price: 4499,
    badge: 'Upcoming Drop',
    category: 'Leather Goods',
    description: 'Seamless six-pocket bifold crafted from buttero leather. Flush edges with hand-pressed creasing lines.',
    spec: 'Phase 02 Expansion Item',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <div className="w-full bg-[#F8F8F6] text-[#111111] antialiased selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 1. MODULAR PRELOADER WITH SMOOTH PAGE REVEAL SYNC */}
      <AnimatePresence>
        {!preloaderDone && (
          <Preloader onComplete={() => setPreloaderDone(true)} />
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT (REVEALS ONLY AFTER PRELOADER COMPLETES) */}
      <main id="hero" className="px-3 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-0 max-w-[1800px] mx-auto w-full overflow-x-hidden">
        {preloaderDone && <HeroTitle />}

        <CategoryRunway
          isReady={preloaderDone}
          onSelectSubCategory={(subId) => {
            const target = document.getElementById('archive');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <ProductGrid
          products={PRODUCTS}
          onSelectProduct={(prod) => {
            window.location.href = `/products/${prod.id}`;
          }}
          isReady={preloaderDone}
        />

        <AtelierFilm isReady={preloaderDone} />

        <CraftAnatomy />

        <TiltedTilesReviews />

        <DropReservationBanner />
      </main>

    </div>
  );
}