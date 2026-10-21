'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { TextRoll } from './Navbar';

interface LifestyleBannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  link: string;
  badge: string;
  image: string;
}

const LIFESTYLE_BANNERS: LifestyleBannerItem[] = [
  {
    id: 'formal-belts',
    tag: 'CATEGORY // 01',
    title: 'FORMAL SUIT BELTS',
    subtitle: 'Tailored 32mm profile crafted for trousers & bespoke suits',
    badge: 'Formal Classic',
    link: '/products',
    image: '/banners/banner-formal.png',
  },
  {
    id: 'heavy-denim',
    tag: 'CATEGORY // 02',
    title: 'HEAVY JEANS BELTS',
    subtitle: 'Thick 40mm solid leather with heavy brass roller buckle',
    badge: 'Everyday Heavy',
    link: '/products',
    image: '/banners/banner-denim.png',
  },
  {
    id: 'wallets-edc',
    tag: 'CATEGORY // 03',
    title: 'SLIM WALLETS & CARRY',
    subtitle: 'Slim bifold wallets & card cases built to fit flat in pockets',
    badge: 'Pocket Fit',
    link: '/products',
    image: '/banners/banner-wallets.png',
  },
  {
    id: 'travel-gear',
    tag: 'CATEGORY // 04',
    title: 'LEATHER TRAVEL BAGS',
    subtitle: 'Cabin-approved weekend duffles & heavy-duty holdalls',
    badge: 'Weekend Trip',
    link: '/products',
    image: '/banners/banner-travel.png',
  },
  {
    id: 'footwear',
    tag: 'CATEGORY // 05',
    title: 'HANDCRAFTED FOOTWEAR',
    subtitle: 'Goodyear welted derby shoes & all-leather comfort slides',
    badge: 'Real Leather Soles',
    link: '/products',
    image: '/banners/banner-footwear.png',
  },
  {
    id: 'jackets',
    tag: 'CATEGORY // 06',
    title: 'MOTORCYCLE JACKETS',
    subtitle: 'Heavy rider leather jackets with solid brass metal hardware',
    badge: '100% Real Hide',
    link: '/products',
    image: '/banners/banner-jackets.png',
  },
  {
    id: 'phone-cases',
    tag: 'CATEGORY // 07',
    title: 'MAGSAFE LEATHER CASES',
    subtitle: 'Shockproof phone covers that develop a dark golden patina',
    badge: 'MagSafe Ready',
    link: '/products',
    image: '/banners/banner-accessories.png',
  },
];

function ConveyerCard({ banner }: { banner: LifestyleBannerItem }) {
  return (
    <Link
      href={banner.link}
      className="group relative shrink-0 w-[240px] sm:w-[280px] md:w-[310px] aspect-[9/14] bg-neutral-950 overflow-hidden flex flex-col justify-between p-4 sm:p-5 cursor-pointer border border-black/15 transition-all duration-300 select-none"
    >
      {/* Background Image with Cinematic Hover Zoom */}
      <img
        src={banner.image}
        alt={banner.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-108 pointer-events-none"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop';
        }}
      />

      {/* Contrast Gradient for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 pointer-events-none" />

      {/* Top Header Tags */}
      <div className="relative z-10 flex items-center justify-between text-white font-mono text-[9px] uppercase pointer-events-none">
        <span className="bg-black/85 backdrop-blur-md px-2 py-0.5 border border-white/20 font-bold tracking-wider">
          {banner.tag}
        </span>
        <span className="bg-white text-black px-2 py-0.5 font-bold tracking-wider shadow-sm">
          {banner.badge}
        </span>
      </div>

      {/* Bottom Information Block */}
      <div className="relative z-10 text-white">
        <div className="flex items-center gap-1.5 mb-1.5 text-red-500 font-mono text-[9px] uppercase font-bold tracking-widest pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>Handmade in Kanpur</span>
        </div>

        {/* Rolling Words Hover Effect */}
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight mb-1.5">
          <span className="inline-flex flex-wrap gap-x-1.5">
            {banner.title.split(' ').map((word, wIdx) => (
              <span key={wIdx} className="inline-block overflow-hidden">
                <TextRoll className="font-black text-white">
                  {word}
                </TextRoll>
              </span>
            ))}
          </span>
        </h3>

        <p className="text-[10px] sm:text-[11px] text-neutral-300 font-sans font-normal leading-snug line-clamp-2 mb-3 pointer-events-none">
          {banner.subtitle}
        </p>

        <div className="pt-2 border-t border-white/20 flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase font-bold text-neutral-300 group-hover:text-white pointer-events-none">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Shop Category</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:rotate-45 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function LifestyleBanners() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <>
      <style jsx global>{`
        @keyframes conveyorRunway {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .conveyor-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: conveyorRunway 38s linear infinite;
        }
        .conveyor-track.is-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <section
        aria-label="Shop by Lifestyle & Occasions Runway"
        className="relative w-screen left-1/2 -translate-x-1/2 pt-4 pb-14 sm:pb-20 select-none overflow-hidden"
      >
        <div className="w-full px-3 sm:px-6 md:px-8">
          {/* Left Reveal Header Ribbon (Consistent Alignment) */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-5 sm:mb-7 font-sans border-b border-black/10"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
                Featured Categories &bull; 100% Genuine Full-Grain Leather
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto font-mono text-[10px] sm:text-xs">
              <span className="text-neutral-500 font-medium">
                Free Express Courier Over ₹5,000
              </span>
              <Link
                href="/products"
                className="font-bold text-black hover:text-neutral-600 inline-flex items-center gap-1 uppercase transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* CONTINUOUS CONVEYOR RUNWAY (Jerk-Free Pause & Resume) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full overflow-hidden flex px-3 sm:px-6 md:px-8"
        >
          <div className={`conveyor-track gap-3 sm:gap-4.5 ${isPaused ? 'is-paused' : ''}`}>
            {/* Seamless Double Loop for Infinite Motion */}
            {[...LIFESTYLE_BANNERS, ...LIFESTYLE_BANNERS].map((banner, index) => (
              <ConveyerCard key={`${banner.id}-${index}`} banner={banner} />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}