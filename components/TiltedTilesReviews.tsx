'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

export interface ReviewTile {
  id: string;
  name: string;
  city: string;
  piece: string;
  rating: number;
  quote: string;
  timeframe: string;
  image: string;
}

const REVIEWS_COL_1: ReviewTile[] = [
  {
    id: 'rev-01',
    name: 'Kabir Singhania',
    city: 'Mumbai',
    piece: 'The Bridle Edition // 38mm',
    rating: 5,
    quote: 'Wearing it daily for over a month now. Pure thick leather with zero cardboard inside. Heavy solid brass buckle feels indestructible.',
    timeframe: 'Verified Buyer',
    image: '/belt-macro.png',
  },
  {
    id: 'rev-02',
    name: 'Devansh Roy',
    city: 'New Delhi',
    piece: 'Bespoke Folio Wallet',
    rating: 5,
    quote: 'Super slim and fits flat in my back pocket without bulging. Edges are clean and smooth, leather feels very premium.',
    timeframe: 'Verified Buyer',
    image: '/AtelierFresh.png',
  },
  {
    id: 'rev-03',
    name: 'Aarav Mehta',
    city: 'Bengaluru',
    piece: 'Heritage Raw Saddle',
    rating: 5,
    quote: 'Natural untreated leather that naturally gets darker with daily wear and sunlight. Has a gorgeous warm caramel look now.',
    timeframe: 'Verified Buyer',
    image: '/BodyAcclimation.png',
  },
];

const REVIEWS_COL_2: ReviewTile[] = [
  {
    id: 'rev-04',
    name: 'Rohan Nambiar',
    city: 'Kanpur / London',
    piece: 'The Onyx Dress // 32mm',
    rating: 5,
    quote: 'Perfect width for office suits and formal trousers. The matte buckle looks sharp and elegant, definitely luxury grade.',
    timeframe: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rev-05',
    name: 'Zayan Farooqui',
    city: 'Hyderabad',
    piece: 'Tea-Core Steer Moto',
    rating: 5,
    quote: 'Thick real leather jacket. Felt heavy at first, but became super comfortable and molded to my body within two weeks.',
    timeframe: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rev-06',
    name: 'Vikramaditya',
    city: 'Pune',
    piece: 'Monolithic Field Duffle',
    rating: 5,
    quote: 'Heavy-duty copper rivets and thick leather straps. Survived 4 flights and rough luggage handling without a single scratch or tear.',
    timeframe: 'Verified Buyer',
    image: '/HeirloomValut.png',
  },
];

const REVIEWS_COL_3: ReviewTile[] = [
  {
    id: 'rev-07',
    name: 'Siddharth Sen',
    city: 'Kolkata',
    piece: 'The Bridle Edition // Brass',
    rating: 5,
    quote: 'The 4.2mm thickness is real. It is one solid piece of full-grain leather, not layered paper or synthetic leather. Built to last.',
    timeframe: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rev-08',
    name: 'Taran Gill',
    city: 'Chandigarh',
    piece: 'Goodyear Welt Derby',
    rating: 5,
    quote: 'Real leather soles with solid stitch construction. Extremely comfortable for formal meetings and easy to maintain.',
    timeframe: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rev-09',
    name: 'Pranav Joshi',
    city: 'Ahmedabad',
    piece: 'MagSafe Leather Case',
    rating: 5,
    quote: 'The leather gets a glossy dark shine with daily palm friction. Built solid like a leather belt for a smartphone.',
    timeframe: 'Verified Buyer',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop',
  },
];

// 3X Array duplicate for 100% seamless, mathematically continuous wrap loop
const SEAMLESS_COL_1 = [...REVIEWS_COL_1, ...REVIEWS_COL_1, ...REVIEWS_COL_1];
const SEAMLESS_COL_2 = [...REVIEWS_COL_2, ...REVIEWS_COL_2, ...REVIEWS_COL_2];
const SEAMLESS_COL_3 = [...REVIEWS_COL_3, ...REVIEWS_COL_3, ...REVIEWS_COL_3];

// Interactive 3D Edge Tilt Tile Component
function InteractiveTile({ item }: { item: ReviewTile }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      transition={{ duration: 0.15 }}
      className="relative w-full bg-neutral-900 border border-white/15 overflow-hidden cursor-pointer select-none group shadow-2xl"
    >
      {/* Background Piece Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={item.image}
          alt={`${item.name} - ${item.piece}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] font-mono uppercase text-white pointer-events-none">
          <span className="bg-black/80 px-2 py-0.5 border border-white/20">
            {item.piece}
          </span>
          <div className="flex gap-0.5 text-red-500">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-red-500 text-red-500" />
            ))}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="p-4 sm:p-5 bg-neutral-950 border-t border-white/10 flex flex-col justify-between text-white">
        <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-normal mb-4">
          &ldquo;{item.quote}&rdquo;
        </p>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[9px] sm:text-[10px]">
          <div>
            <div className="font-bold text-white uppercase flex items-center gap-1">
              <span>{item.name}</span>
              <ShieldCheck className="w-3 h-3 text-red-500" />
            </div>
            <div className="text-neutral-500">{item.city} &bull; {item.timeframe}</div>
          </div>
          <span className="text-white/40 uppercase font-mono text-[8px]">
            REAL BUYER
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TiltedTilesReviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      id="patrons"
      aria-label="Customer Reviews and Ratings"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-10 sm:pt-16 pb-24 sm:pb-36 bg-[#0E0E0E] text-white overflow-hidden select-none"
    >
      <div className="w-full px-3 sm:px-6 md:px-8 mb-8 sm:mb-12">
        {/* SUB-BAR HEADER (Simple English) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 border-b border-white/10 font-sans">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-white">
              Customer Reviews &bull; Real Leather In The Field
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-400 font-medium font-mono">
            Verified Purchase Ratings &bull; Delivery Across India
          </p>
        </div>
      </div>

      {/* TILTED ISOMETRIC DRIFTING CANVAS */}
      <div className="relative w-full h-[650px] sm:h-[780px] lg:h-[860px] overflow-hidden flex items-center justify-center [perspective:1400px]">
        {/* Subtle radial center highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)] pointer-events-none" />

        {/* Tilted Isometric Transform Container */}
        <div className="relative w-[130%] sm:w-[120%] lg:w-[110%] flex gap-4 sm:gap-6 lg:gap-8 justify-center [transform:rotate(-10deg)_skewY(4deg)_scale(1.05)]">
          
          {/* Column 1: Smooth Continuous Infinite Loop */}
          <motion.div
            animate={{ y: ['-33.333333%', '0%'] }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex flex-col gap-4 sm:gap-6 w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
          >
            {SEAMLESS_COL_1.map((item, idx) => (
              <InteractiveTile key={`col1-${item.id}-${idx}`} item={item} />
            ))}
          </motion.div>

          {/* Column 2: Opposite Smooth Continuous Infinite Loop */}
          <motion.div
            animate={{ y: ['0%', '-33.333333%'] }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex flex-col gap-4 sm:gap-6 w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
          >
            {SEAMLESS_COL_2.map((item, idx) => (
              <InteractiveTile key={`col2-${item.id}-${idx}`} item={item} />
            ))}
          </motion.div>

          {/* Column 3: Smooth Continuous Infinite Loop */}
          <motion.div
            animate={{ y: ['-33.333333%', '0%'] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex flex-col gap-4 sm:gap-6 w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
          >
            {SEAMLESS_COL_3.map((item, idx) => (
              <InteractiveTile key={`col3-${item.id}-${idx}`} item={item} />
            ))}
          </motion.div>

        </div>

        {/* Top & Bottom Edge Gradients */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0E0E0E] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0E0E0E] to-transparent pointer-events-none z-10" />
      </div>

      {/* FOOTER METRICS (Commercial & Clear) */}
      <div className="w-full px-3 sm:px-6 md:px-8 mt-8 sm:mt-12 flex flex-col sm:flex-row items-baseline justify-between gap-3 text-[10px] sm:text-xs font-mono text-neutral-400">
        <div>4.98 / 5.0 OVERALL CUSTOMER RATING &bull; 1,420+ ORDERS DELIVERED</div>
        <div className="text-white uppercase font-bold tracking-wider">LIFETIME LEATHER WARRANTY INCLUDED</div>
      </div>
    </section>
  );
}