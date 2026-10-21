'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/Preloader';
import HeroTitle from '@/components/HeroTitle';
import CategoryRunway from '@/components/CategoryRunway';
import ProductGrid from '@/components/ProductGrid';
import PopularCollections from '@/components/PopularCollections';
import LifestyleBanners from '@/components/LifestyleBanners';
import AtelierFilm from '@/components/AtelierFilm';
import TiltedTilesReviews from '@/components/TiltedTilesReviews';
import DropReservationBanner from '@/components/DropReservationBanner';
import ComboSection from '@/components/ComboSection';

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
    badge: 'Best Seller',
    category: 'Full-Grain 38mm',
    description: 'Cut from 100% thick real leather. Treated with natural wax for a lifetime of daily wear without cracking.',
    spec: '4.2mm Real Hide • Solid Brass Buckle',
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
    badge: 'Formal Classic',
    category: 'Dress 32mm',
    description: 'Sleek formal belt with smooth hand-painted black edges tailored for dress trousers and bespoke suits.',
    spec: 'Italian Calfskin • Matte Steel Buckle',
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
    badge: 'Sold Out',
    category: 'Heavy Jeans 40mm',
    description: 'Natural uncolored leather belt that gets richer and darker as you wear it every single day.',
    spec: 'Extra Heavy Leather • Hand-Stitched',
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
    badge: 'New Arrival',
    category: 'Wallets & Carry',
    description: 'Slim bifold leather wallet holding 8 cards and flat cash without bulging in your pocket.',
    spec: 'Smooth Grain Leather • Hand-Finished',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

let hasPreloadedInCurrentSession = false;

export default function HomePage() {
  const router = useRouter();
  const [preloaderDone, setPreloaderDone] = useState(hasPreloadedInCurrentSession);

  const handlePreloaderComplete = () => {
    hasPreloadedInCurrentSession = true;
    setPreloaderDone(true);
  };

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': 'https://hidewood.example.com/#store',
        name: 'HIDEWOOD Leather',
        url: 'https://hidewood.example.com',
        description:
          '100% full-grain leather belts, solid brass buckles, wallets, and handcrafted accessories made in Kanpur.',
        priceRange: '₹₹₹',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kanpur',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      <div className="w-full bg-[#F8F8F6] text-[#111111] antialiased selection:bg-black selection:text-white overflow-x-hidden">
        
        <AnimatePresence mode="wait">
          {!preloaderDone && (
            <Preloader onComplete={handlePreloaderComplete} />
          )}
        </AnimatePresence>

        <main id="hero" className="px-3 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-0 max-w-[1800px] mx-auto w-full overflow-x-hidden">
          {preloaderDone && <HeroTitle />}

          <CategoryRunway
            isReady={preloaderDone}
            onSelectSubCategory={(_subId) => {
              const target = document.getElementById('archive');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <ProductGrid
            products={PRODUCTS}
            onSelectProduct={(prod) => {
              router.push(`/products/${prod.id}`);
            }}
            isReady={preloaderDone}
          />

          {/* 1. Popular Collections (Shop by Style - 4 Desktop / 2 Mobile) */}
          <PopularCollections />

          {/* 2. Handcrafted Leather Combos & Gift Sets (Directly after Featured Categories / Popular Collections) */}
          <ComboSection />

          {/* 3. Lifestyle Banners */}
          <LifestyleBanners />

          <AtelierFilm isReady={preloaderDone} />

          <TiltedTilesReviews />

          <DropReservationBanner />
        </main>

      </div>
    </>
  );
}