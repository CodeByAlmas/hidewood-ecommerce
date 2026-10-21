'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface StyleCollection {
  id: string;
  name: string;
  tagline: string;
  priceFrom: number;
  link: string;
  badge: string;
  images: [string, string];
}

const STYLES: StyleCollection[] = [
  {
    id: 'formal-belts',
    name: 'Formal Suiting Belts',
    tagline: 'Slim 32mm profile for trousers & bespoke tailoring',
    priceFrom: 5499,
    badge: 'Formal Classic',
    link: '/products',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
    ],
  },
  {
    id: 'denim-belts',
    name: 'Heavy Denim Jeans Belts',
    tagline: 'Thick 40mm solid leather with heavy brass roller buckle',
    priceFrom: 5499,
    badge: 'Everyday Heavy',
    link: '/products',
    images: [
      '/belt-macro.png',
      '/AtelierFresh.png',
    ],
  },
  {
    id: 'wallets-carry',
    name: 'Wallets & Everyday Carry',
    tagline: 'Slim bifold wallets, card cases & MagSafe phone covers',
    priceFrom: 3499,
    badge: 'Daily Carry',
    link: '/products',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=900&auto=format&fit=crop',
    ],
  },
  {
    id: 'travel-duffles',
    name: 'Leather Travel Bags',
    tagline: 'Heavy-duty leather weekender duffles & backpacks',
    priceFrom: 18499,
    badge: 'Travel Gear',
    link: '/products',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=900&auto=format&fit=crop',
    ],
  },
];

function StyleCard({ item }: { item: StyleCollection }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      <Link href={item.link} className="block w-full">
        {/* Visual Stage matching ProductGrid's exact zero-border aesthetic */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200/50 mb-2 sm:mb-2.5">
          {/* Primary View */}
          <img
            src={item.images[0]}
            alt={item.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop';
            }}
          />

          {/* Secondary View Slider on Hover */}
          <motion.img
            src={item.images[1]}
            alt={`${item.name} alternate view`}
            initial={false}
            animate={{
              x: isHovered ? '0%' : '-101%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            style={{
              visibility: isHovered ? 'visible' : 'hidden',
            }}
          />

          {/* Minimal Top Badges */}
          <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-20 flex items-center gap-1 pointer-events-none">
            <span className="bg-black text-white text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold">
              {item.badge}
            </span>
          </div>

          <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-20 bg-white/95 backdrop-blur-xs text-black text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold shadow-xs">
            From ₹{item.priceFrom.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Minimal Bottom Metadata */}
        <div className="flex items-baseline justify-between gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <h3 className="font-bold text-black uppercase tracking-tight truncate group-hover:underline">
              {item.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="font-bold text-red-600 flex items-center gap-0.5">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        <p className="text-[9px] sm:text-[10px] text-neutral-500 font-sans truncate mt-0.5">
          {item.tagline}
        </p>
      </Link>
    </article>
  );
}

export default function PopularCollections() {
  return (
    <section
      aria-label="Popular Curated Leather Collections"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-1 pb-8 sm:pb-12 overflow-hidden select-none"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
        {/* Left Reveal Header Ribbon (Theme Aligned) */}
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
              Popular Collections &bull; Shop By Style
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
              Pure Full-Grain Leather &bull; Free Shipping
            </p>
            <Link
              href="/products"
              className="font-mono text-[10px] sm:text-xs uppercase font-bold text-black hover:text-neutral-600 inline-flex items-center gap-1 transition-colors"
            >
              <span>All Pieces</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Left-to-Right Reveal Grid matching ProductGrid & Lifestyle */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full"
        >
          {STYLES.map((style) => (
            <StyleCard key={style.id} item={style} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}