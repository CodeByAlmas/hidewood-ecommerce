'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Product {
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

interface ProductGridProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  isReady?: boolean;
}

const CATALOG_ITEMS: Product[] = [
  // ROW 1: 4 Equal Items
  {
    id: 'hw-01',
    name: 'The Bridle Edition',
    price: 5499,
    badge: 'Limited Run',
    category: 'Full-Grain 38mm',
    description: 'Cut from single-origin English bridle leather. Hot-stuffed with natural waxes and hand-burnished.',
    spec: '4.2mm Unsplit Hide • Solid Sand-Cast Brass',
    inStock: true,
    images: [
      '/belt-macro.png',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-02',
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
    id: 'hw-03',
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
    id: 'hw-04',
    name: 'Bespoke Folio Wallet',
    price: 4499,
    badge: 'Drop 01',
    category: 'Leather Goods',
    description: 'Seamless six-pocket bifold crafted from buttero leather. Flush edges with hand-pressed creasing lines.',
    spec: 'Phase 02 Expansion Item',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  // ROW 2: 2 Compact Items + 1 Giant Showcase
  {
    id: 'hw-05',
    name: 'Archival Field Backpack',
    price: 18499,
    badge: 'Archive 2026',
    category: 'Structural Bags',
    description: 'Heavy vegetable-tanned bridle travel pack with hand-hammered copper rivets.',
    spec: '28L Capacity • Solid Brass Hardware',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-06',
    name: 'Service Derby Shoes',
    price: 14299,
    badge: 'Limited Run',
    category: 'Goodyear Footwear',
    description: 'Hand-lasted service derby crafted on double oak-bark tanned leather soles.',
    spec: 'Goodyear Welt • Full Calfskin Lining',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-07',
    name: 'Tea-Core Steer Moto Jacket',
    price: 32999,
    badge: 'Phase 02 Drop',
    category: 'Outerwear Atelier',
    description: 'Vegetable-tanned double rider leather jacket with heavy solid brass hardware.',
    spec: '1.4mm Heavy Steer • Cupro Satin Lining',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  // ROW 3: 1 Giant Showcase + 2 Companion Items
  {
    id: 'hw-08',
    name: 'Monolithic Field Duffle 45L',
    price: 24999,
    badge: 'Statement Piece',
    category: 'Luggage & Carry',
    description: 'Continuous cut harness leather weekender built to outlive five generations.',
    spec: '45L Capacity • Peened Copper Rivets',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-09',
    name: 'MagSafe Leather Case',
    price: 3499,
    badge: 'EDC Essentials',
    category: 'Everyday Carry',
    description: 'Natural vegetable tanned hide shell made to patina with daily palm friction.',
    spec: 'Microfiber Interior • Raw Finish',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-10',
    name: 'Raw Harness Slide',
    price: 7999,
    badge: 'Summer Vault',
    category: 'Footwear',
    description: 'Bare-edge molded leather sandals hand-nailed to solid bovine soles.',
    spec: 'Hand-Molded Bed • Brass Buckles',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

function ProductItem({
  prod,
  aspect = 'aspect-[3/4]',
  onSelect,
}: {
  prod: Product;
  aspect?: string;
  onSelect: (product: Product) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondary = prod.images && prod.images.length > 1;

  return (
    <div
      onClick={() => onSelect(prod)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      {/* ZERO BORDER / ZERO OUTLINE IMAGE BOX */}
      <div className={`relative ${aspect} w-full overflow-hidden bg-neutral-200/50 mb-2.5`}>
        {/* Primary Image: Base Layer */}
        <img
          src={prod.images[0]}
          alt={prod.name}
          className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop';
          }}
        />

        {/* Secondary Image: Left se right slide in hoti hai (Strictly no bleed line artifact) */}
        {hasSecondary && (
          <motion.img
            src={prod.images[1]}
            alt={`${prod.name} secondary`}
            initial={false}
            animate={{
              x: isHovered ? '0%' : '-101%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 z-10 pointer-events-none"
            style={{
              visibility: isHovered ? 'visible' : 'hidden',
            }}
          />
        )}
      </div>

      {/* MINIMAL BOTTOM TEXT ROW */}
      <div className="flex items-baseline justify-between gap-2 font-mono text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          <span className="font-bold text-black uppercase tracking-tight truncate group-hover:underline">
            {prod.name}
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="font-bold text-red-600">
            ₹{prod.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

// 100% Reliable Left-to-Right Row Reveal on Scroll (Zero blank white-screen bug)
function RevealRow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProductGrid({
  onSelectProduct,
}: ProductGridProps) {
  return (
    <section
      id="archive"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-4 pb-20 sm:pb-28 overflow-hidden select-none"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
        
        {/* NEW ARRIVALS HEADLINE SUB-BAR */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 mb-6 sm:mb-8 font-sans"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse shrink-0" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
              New Arrivals &bull; Series 01 Dispatch
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
            Full-Spectrum Leather House &bull; Made in India
          </p>
        </motion.div>

        {/* DYNAMIC 3-ROW GRID (INDEPENDENT ROW-BY-ROW SCROLL REVEAL) */}
        <div className="flex flex-col gap-10 sm:gap-14 w-full">
          
          {/* ROW 1: 4 EQUAL PRODUCTS */}
          <RevealRow className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {CATALOG_ITEMS.slice(0, 4).map((item) => (
              <ProductItem
                key={item.id}
                prod={item}
                aspect="aspect-[3/4]"
                onSelect={onSelectProduct}
              />
            ))}
          </RevealRow>

          {/* ROW 2: 2 COMPACT LEFT + 1 GIANT STATEMENT CARD RIGHT */}
          <RevealRow className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start">
            <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
              <ProductItem
                prod={CATALOG_ITEMS[4]}
                aspect="aspect-[3/4]"
                onSelect={onSelectProduct}
              />
              <ProductItem
                prod={CATALOG_ITEMS[5]}
                aspect="aspect-[3/4]"
                onSelect={onSelectProduct}
              />
            </div>

            <div className="md:col-span-7">
              <ProductItem
                prod={CATALOG_ITEMS[6]}
                aspect="aspect-[16/11]"
                onSelect={onSelectProduct}
              />
            </div>
          </RevealRow>

          {/* ROW 3: 1 GIANT STATEMENT CARD LEFT + 2 COMPANION ITEMS RIGHT */}
          <RevealRow className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start">
            <div className="md:col-span-7">
              <ProductItem
                prod={CATALOG_ITEMS[7]}
                aspect="aspect-[16/11]"
                onSelect={onSelectProduct}
              />
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
              <ProductItem
                prod={CATALOG_ITEMS[8]}
                aspect="aspect-[3/4]"
                onSelect={onSelectProduct}
              />
              <ProductItem
                prod={CATALOG_ITEMS[9]}
                aspect="aspect-[3/4]"
                onSelect={onSelectProduct}
              />
            </div>
          </RevealRow>

        </div>
      </div>
    </section>
  );
}