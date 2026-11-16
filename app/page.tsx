'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/Preloader';
import HeroTitle from '@/components/HeroTitle';
import CategoryRunway from '@/components/CategoryRunway';
import ProductGrid from '@/components/ProductGrid';
import PopularCollections from '@/components/PopularCollections';
import LifestyleBanners from '@/components/LifestyleBanners';
import CorporateGiftingSection from '@/components/CorporateGiftingSection';
import AtelierFilm from '@/components/AtelierFilm';
import TiltedTilesReviews from '@/components/TiltedTilesReviews';
import DropReservationBanner from '@/components/DropReservationBanner';
import ComboSection from '@/components/ComboSection';
import { useAtelierTransition } from '@/context/TransitionContext';

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

let hasPreloadedInCurrentSession = false;

export default function HomePage() {
  const { navigateTo } = useAtelierTransition();
  const [preloaderDone, setPreloaderDone] = useState(hasPreloadedInCurrentSession);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  const handlePreloaderComplete = () => {
    hasPreloadedInCurrentSession = true;
    setPreloaderDone(true);
  };

  // Fetch real products from Neon Database API
  useEffect(() => {
    const fetchHomeCatalog = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const mapped: Product[] = data.products.map((p: any) => ({
            id: p.slug || p.id,
            name: p.name,
            price: p.price,
            badge: p.isNewArrival ? 'New Drop' : (p.featuredSale ? 'Special Price' : ''),
            category: p.subCategory || p.category,
            description: p.description || '',
            spec: p.spec || 'Pure Leather',
            inStock: p.inStock,
            images: [
              p.coverPrimary || p.images?.[0] || '/belt-macro.png',
              p.coverHover || p.images?.[1] || p.coverPrimary || '/belt-macro.png',
            ],
          }));
          setLiveProducts(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch home products:', err);
      }
    };
    fetchHomeCatalog();
  }, []);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': 'https://hidewood.in/#store',
        name: 'HIDEWOOD Kanpur Atelier',
        url: 'https://hidewood.in',
        description:
          '100% full-grain leather belts, solid brass buckles, wallets, and handcrafted accessories made in Kanpur, India.',
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
            products={liveProducts}
            onSelectProduct={(prod) => {
              navigateTo(`/products/${encodeURIComponent(prod.id)}`);
            }}
            isReady={preloaderDone}
          />

          {/* 1. Popular Collections (Shop by Style) */}
          <PopularCollections />

          {/* 2. Handcrafted Leather Combos & Gift Sets */}
          <ComboSection />

          {/* 3. Lifestyle Banners */}
          <LifestyleBanners />

          {/* 4. Bespoke Corporate Gifting Monolith */}
          <CorporateGiftingSection />

          <AtelierFilm isReady={preloaderDone} />

          <TiltedTilesReviews />

          <DropReservationBanner />
        </main>
      </div>
    </>
  );
}