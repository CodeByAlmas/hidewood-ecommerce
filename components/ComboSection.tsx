'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ComboItem {
  id: string;
  badge: string;
  price: string;
  name: string;
  spec: string;
  image: string;
  fallbackImage: string;
}

const UPCOMING_COMBOS: ComboItem[] = [
  {
    id: 'combo-01',
    badge: 'LAUNCHING SOON',
    price: 'FROM ₹8,999',
    name: "GENTLEMAN'S HERITAGE SET",
    spec: 'Full-grain belt with matching bifold wallet & brass key hook',
    image: '/combos/gentlemans-set.png',
    fallbackImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'combo-02',
    badge: 'COMING SOON',
    price: 'FROM ₹18,499',
    name: 'EXECUTIVE SUIT ENSEMBLE',
    spec: 'Matte onyx dress belt with welted derby shoes & slim card case',
    image: '/combos/executive-ensemble.png',
    fallbackImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'combo-03',
    badge: 'LAUNCHING SOON',
    price: 'FROM ₹28,999',
    name: 'WEEKEND EXPLORER SET',
    spec: '45L full-grain weekender duffle with heavy-duty belt & dopp kit',
    image: '/combos/weekend-explorer.png',
    fallbackImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'combo-04',
    badge: 'COMING SOON',
    price: 'FROM ₹36,999',
    name: "THE RIDER'S HERITAGE DUO",
    spec: '1.4mm steerhide moto rider jacket with heavy-duty roller belt',
    image: '/combos/riders-duo.png',
    fallbackImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function ComboSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming Handcrafted Leather Combos & Gift Sets | HIDEWOOD',
    description:
      'Curated real leather gift sets including full-grain belts, bifold wallets, travel duffels, and footwear handcrafted in Kanpur.',
    itemListElement: UPCOMING_COMBOS.map((combo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: combo.name,
      description: combo.spec,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Exactly matching PopularCollections: relative w-screen left-1/2 -translate-x-1/2 with pt-1 pb-8 */}
      <section
        aria-label="Upcoming Handcrafted Leather Combos"
        className="relative w-screen left-1/2 -translate-x-1/2 pt-1 pb-8 sm:pb-12 overflow-hidden select-none"
      >
        <div className="w-full px-3 sm:px-6 md:px-8">
          
          {/* Header Ribbon - Exact match with PopularCollections style & motion */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 mb-5 sm:mb-7 font-sans border-b border-black/10"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
                Upcoming Combos &bull; Curated Leather Sets
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
                100% Genuine Full-Grain Leather &bull; Free Shipping
              </p>
              <Link
                href="/reservation"
                className="font-mono text-[10px] sm:text-xs uppercase font-bold text-black hover:text-neutral-600 inline-flex items-center gap-1 transition-colors"
              >
                <span>Pre-Order</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Grid matching PopularCollections: 4 cols on desktop, 2 cols on mobile, exact aspect-[3/4] */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full"
          >
            {UPCOMING_COMBOS.map((combo) => (
              <article
                key={combo.id}
                className="group flex flex-col justify-between cursor-pointer w-full select-none"
              >
                <Link href="/reservation" className="block w-full">
                  {/* Visual Stage matching PopularCollections exact aspect-[3/4] */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200/50 mb-2 sm:mb-2.5">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = combo.fallbackImage;
                      }}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                    />

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-20 flex items-center gap-1 pointer-events-none">
                      <span className="bg-black text-white text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold">
                        {combo.badge}
                      </span>
                    </div>

                    {/* Top-Right Price Badge */}
                    <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-20 bg-white/95 backdrop-blur-xs text-black text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold shadow-xs pointer-events-none">
                      {combo.price}
                    </div>
                  </div>

                  {/* Minimal Bottom Metadata matching StyleCard */}
                  <div className="flex items-baseline justify-between gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <h3 className="font-bold text-black uppercase tracking-tight truncate group-hover:underline">
                        {combo.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-red-600 flex items-center gap-0.5">
                        <span>Notify</span>
                        <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] sm:text-[10px] text-neutral-500 font-sans truncate mt-0.5">
                    {combo.spec}
                  </p>
                </Link>
              </article>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
}