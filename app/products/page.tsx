'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS_CATALOG } from '@/data/products';

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  badge: string;
  category: string;
  description: string;
  spec: string;
  inStock: boolean;
  images: string[];
}

const INITIAL_ARCHIVE_ITEMS: CatalogItem[] = [
  {
    id: 'hw-01',
    slug: 'the-bridle-edition',
    name: 'The Bridle Edition',
    price: 5499,
    badge: 'Limited Run',
    category: 'Full-Grain Belts',
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
    slug: 'the-onyx-dress',
    name: 'The Onyx Dress',
    price: 6299,
    badge: 'Archive 2026',
    category: 'Full-Grain Belts',
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
    slug: 'heritage-raw-saddle',
    name: 'Heritage Raw Saddle',
    price: 6999,
    badge: 'Sold out',
    category: 'Full-Grain Belts',
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
    slug: 'bespoke-folio-wallet',
    name: 'Bespoke Folio Wallet',
    price: 4499,
    badge: 'Drop 01',
    category: 'Wallets & Carry',
    description: 'Seamless six-pocket bifold crafted from buttero leather. Flush edges with hand-pressed creasing lines.',
    spec: 'Phase 02 Expansion Item',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-05',
    slug: 'archival-field-backpack',
    name: 'Archival Field Backpack',
    price: 18499,
    badge: 'Archive 2026',
    category: 'Wallets & Carry',
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
    slug: 'service-derby-shoes',
    name: 'Service Derby Shoes',
    price: 14299,
    badge: 'Limited Run',
    category: 'Welted Footwear',
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
    slug: 'tea-core-steer-moto-jacket',
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
  {
    id: 'hw-08',
    slug: 'monolithic-field-duffle-45l',
    name: 'Monolithic Field Duffle 45L',
    price: 24999,
    badge: 'Statement Piece',
    category: 'Wallets & Carry',
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
    slug: 'magsafe-leather-case',
    name: 'MagSafe Leather Case',
    price: 3499,
    badge: 'EDC Essentials',
    category: 'Wallets & Carry',
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
    slug: 'raw-harness-slide',
    name: 'Raw Harness Slide',
    price: 7999,
    badge: 'Summer Vault',
    category: 'Welted Footwear',
    description: 'Bare-edge molded leather sandals hand-nailed to solid bovine soles.',
    spec: 'Hand-Molded Bed • Brass Buckles',
    inStock: false,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

function ShopProductCard({
  prod,
  aspect = 'aspect-[3/4]',
}: {
  prod: CatalogItem;
  aspect?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondary = prod.images && prod.images.length > 1;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      <Link href={`/products/${prod.slug}`} className="block w-full">
        <div className={`relative ${aspect} w-full overflow-hidden bg-neutral-200/50 mb-2.5`}>
          {/* Primary Image: Natural Color (Grayscale removed) */}
          <img
            src={prod.images[0]}
            alt={`${prod.name} Heirloom Full-Grain Leather Atelier Piece`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop';
            }}
          />

          {/* Secondary Image: Natural Color (Grayscale removed) */}
          {hasSecondary && (
            <motion.img
              src={prod.images[1]}
              alt={`${prod.name} secondary angle perspective`}
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
          )}

          {!prod.inStock && (
            <div className="absolute top-2.5 left-2.5 z-20 bg-black text-white font-mono text-[9px] uppercase px-2 py-0.5 border border-white/20">
              Archival Waitlist
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2 font-mono text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                prod.inStock ? 'bg-red-600' : 'bg-neutral-400'
              }`}
            />
            <h3 className="font-bold text-black uppercase tracking-tight truncate group-hover:underline">
              {prod.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="font-bold text-red-600">
              ₹{prod.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function RevealRow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CATEGORIES = [
  'ALL SILHOUETTES',
  'FULL-GRAIN BELTS',
  'OUTERWEAR ATELIER',
  'WALLETS & CARRY',
  'WELTED FOOTWEAR',
];

export default function ShopAllPage() {
  const [activeCategory, setActiveCategory] = useState('ALL SILHOUETTES');

  const allProducts: CatalogItem[] = useMemo(() => {
    const list = [...INITIAL_ARCHIVE_ITEMS];
    PRODUCTS_CATALOG.forEach((p) => {
      if (!list.some((item) => item.slug === p.slug)) {
        list.push({
          id: p.slug,
          slug: p.slug,
          name: p.name,
          price: p.price,
          badge: p.badge,
          category: 'Full-Grain Belts',
          description: p.description,
          spec: `${p.thickness} • ${p.hardware}`,
          inStock: p.inStock,
          images: p.images,
        });
      }
    });
    return list;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL SILHOUETTES') return allProducts;
    return allProducts.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [allProducts, activeCategory]);

  const rowChunks = useMemo(() => {
    const chunks: CatalogItem[][] = [];
    let i = 0;
    while (i < filteredProducts.length) {
      const patternIndex = chunks.length % 3;
      const size = patternIndex === 0 ? 4 : 3;
      chunks.push(filteredProducts.slice(i, i + size));
      i += size;
    }
    return chunks;
  }, [filteredProducts]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'HIDEWOOD Archival Catalogue | Full-Grain Leather Atelier',
    description:
      'Curated catalogue of unsplit 4.2mm Tuscan vegetable-tanned leather belts, sand-cast brass hardware, bespoke wallets, and archival outerwear.',
    url: 'https://hidewood.example.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredProducts.map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: prod.name,
          description: prod.description,
          image: prod.images[0],
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: prod.price,
            availability: prod.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* 2. TOP EDITORIAL ARCHIVE BANNER */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          
          {/* Breadcrumb with Hover Animation & Protected Pointer Events */}
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase mb-6 sm:mb-8"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Return to Atelier Index"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Return to Index</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>INDEX // 01</span>
              <span>&bull;</span>
              <span className="text-black font-bold">
                {filteredProducts.length} ARTIFACTS
              </span>
            </div>
          </nav>

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Complete Archival Registry
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                SHOP ALL PIECES
              </h1>
            </div>

            <p className="max-w-md font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Unsplit 4.2mm bovine hides, hot-stuffed waxes, and molten sand-cast brass hardware. Built to record life-wear patina.
            </p>
          </div>

          {/* 3. ATELIER HORIZONTAL FILTER BAR */}
          <div className="pt-4 flex items-center justify-between overflow-x-auto [scrollbar-width:none] gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black text-white font-bold'
                        : 'bg-white border border-black/15 text-neutral-700 hover:border-black'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase text-neutral-400 shrink-0 pl-4">
              <SlidersHorizontal className="w-3 h-3" />
              <span>STATUS: DISPATCH VERIFIED</span>
            </div>
          </div>

        </section>

        {/* 4. DYNAMIC EDITORIAL GRID WITH MULTI-ROW RHYTHM */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          {filteredProducts.length === 0 ? (
            <div className="p-16 border border-black/10 bg-white text-center font-mono">
              <p className="text-sm uppercase text-neutral-500 font-bold">
                No artifacts found under {activeCategory}
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('ALL SILHOUETTES')}
                className="mt-4 text-xs underline text-black uppercase cursor-pointer"
              >
                Reset Silhouettes Filter
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10 sm:gap-14 w-full">
              {rowChunks.map((chunk, chunkIdx) => {
                const pattern = chunkIdx % 3;

                if (pattern === 0 || chunk.length === 4) {
                  return (
                    <RevealRow
                      key={chunkIdx}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full"
                    >
                      {chunk.map((item) => (
                        <ShopProductCard
                          key={item.id}
                          prod={item}
                          aspect="aspect-[3/4]"
                        />
                      ))}
                    </RevealRow>
                  );
                }

                if (pattern === 1) {
                  const leftTwo = chunk.slice(0, 2);
                  const rightBig = chunk[2];

                  return (
                    <RevealRow
                      key={chunkIdx}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start"
                    >
                      <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                        {leftTwo.map((item) => (
                          <ShopProductCard
                            key={item.id}
                            prod={item}
                            aspect="aspect-[3/4]"
                          />
                        ))}
                      </div>

                      {rightBig && (
                        <div className="md:col-span-7">
                          <ShopProductCard
                            prod={rightBig}
                            aspect="aspect-[16/11]"
                          />
                        </div>
                      )}
                    </RevealRow>
                  );
                }

                if (pattern === 2) {
                  const leftBig = chunk[0];
                  const rightTwo = chunk.slice(1, 3);

                  return (
                    <RevealRow
                      key={chunkIdx}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start"
                    >
                      {leftBig && (
                        <div className="md:col-span-7">
                          <ShopProductCard
                            prod={leftBig}
                            aspect="aspect-[16/11]"
                          />
                        </div>
                      )}

                      <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                        {rightTwo.map((item) => (
                          <ShopProductCard
                            key={item.id}
                            prod={item}
                            aspect="aspect-[3/4]"
                          />
                        ))}
                      </div>
                    </RevealRow>
                  );
                }

                return null;
              })}
            </div>
          )}
        </section>

        {/* 5. BOTTOM EDITORIAL AUDIT PROOF */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 mt-16 border-t border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 01 ARCHIVAL INTEGRITY
              </span>
              <p className="text-black font-semibold uppercase">
                Single-origin hides sourced directly from Pisa & Tuscany. Zero synthetic fillers.
              </p>
            </div>

            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 02 BESPOKE STAMPING
              </span>
              <p className="text-black font-semibold uppercase">
                Complimentary brass hot-stamp blind debossing available on all archival leather goods.
              </p>
            </div>

            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 03 DISPATCH DISCIPLINE
              </span>
              <p className="text-black font-semibold uppercase">
                Protected in cedarwood shaving boxes with blue-dart express courier verification.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}