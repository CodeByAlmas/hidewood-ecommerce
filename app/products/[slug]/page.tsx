'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ChevronDown } from 'lucide-react';
import { PRODUCTS_CATALOG, ProductDetail } from '@/data/products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product: ProductDetail =
    PRODUCTS_CATALOG.find((p) => p.slug === resolvedParams.slug) || PRODUCTS_CATALOG[0];

  const [activeMobileImage, setActiveMobileImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('34');
  const [quantity, setQuantity] = useState(1);
  const [monogram, setMonogram] = useState('');
  const [showMonogramInput, setShowMonogramInput] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('specs');

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-20 sm:pt-24 pb-12 sm:pb-20">
      
      {/* 1. TOP BREADCRUMB */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 border-b border-black/10">
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Archive</span>
          </Link>

          <div className="flex items-center gap-2 text-neutral-400">
            <span>SERIES 01</span>
            <span>&bull;</span>
            <span className="text-black font-bold">{product.category}</span>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 xl:gap-20 items-start">
          
          {/* ======================================================== */}
          {/* LEFT: MOBILE COMPACT CAROUSEL / DESKTOP VERTICAL FEED    */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 w-full">
            
            {/* A. MOBILE ONLY (COMPACT SWIPE-FRIENDLY STAGE, NO LONG SCROLL) */}
            <div className="block lg:hidden w-full mb-2">
              <div className="relative aspect-square w-full bg-neutral-900 border border-black/15 overflow-hidden">
                <motion.img
                  key={activeMobileImage}
                  src={product.images[activeMobileImage]}
                  alt={`${product.name} frame ${activeMobileImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2 py-0.5 border border-white/20">
                  {activeMobileImage + 1} / {product.images.length}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2 py-0.5 border border-white/20">
                  {product.thickness.split(' ')[0]} SOLID DENSITY
                </div>
              </div>

              {/* Mobile Quick Thumbnails Row */}
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMobileImage(idx)}
                    className={`relative w-16 h-16 shrink-0 border overflow-hidden transition-all ${
                      activeMobileImage === idx
                        ? 'border-black ring-2 ring-black'
                        : 'border-black/20 opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* B. DESKTOP ONLY: CONTINUOUS VERTICAL SCROLL STREAM */}
            <div className="hidden lg:flex flex-col gap-6">
              {product.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-square sm:aspect-[4/3] w-full bg-neutral-900 border border-black/15 overflow-hidden group"
                >
                  <img
                    src={img}
                    alt={`${product.name} frame ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                  />

                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 border border-white/20">
                    FRAME // 0{idx + 1} OF 0{product.images.length}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 border border-white/20">
                    {product.thickness.split(' ')[0]} SOLID DENSITY
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Atelier Specs Ribbon (Common for Both) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-black/10 font-mono text-[9px] uppercase mt-4">
              <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                <div className="text-neutral-400">TANNAGE</div>
                <div className="font-bold text-black mt-0.5">Vegetal Bark</div>
              </div>
              <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                <div className="text-neutral-400">CORE MASS</div>
                <div className="font-bold text-black mt-0.5">Zero Plastic</div>
              </div>
              <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                <div className="text-neutral-400">METALLURGY</div>
                <div className="font-bold text-black mt-0.5">Sand-Cast</div>
              </div>
              <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                <div className="text-neutral-400">WARRANTY</div>
                <div className="font-bold text-black mt-0.5">Century Tier</div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: STICKY BESPOKE ORDERING DESK (5 COLS)             */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between">
            <div>
              {/* Telemetry Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 font-mono text-[10px] uppercase">
                <span className="text-neutral-500">{product.badge}</span>
                {product.inStock ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {product.stockCount} Hides Remaining
                  </span>
                ) : (
                  <span className="text-red-600 font-bold">Sold Out &bull; Waitlist Open</span>
                )}
              </div>

              {/* Title & Price */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-2 sm:mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-black font-mono text-black">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase">
                  Inclusive of All Taxes &bull; Free Global Courier
                </span>
              </div>

              {/* Editorial Description */}
              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-5 sm:mb-6">
                {product.description}
              </p>

              {/* Sizing Protocol */}
              <div className="p-3.5 sm:p-4 border border-black bg-white mb-5 sm:mb-6">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tight">
                    <span>Waist Size Selection</span>
                    <span className="text-[10px] font-mono font-normal text-neutral-500">(Inches)</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">
                    Rule: Denim Size + 2&quot;
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {['30', '32', '34', '36', '38'].map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`h-10 sm:h-11 border text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white border-black ring-1 ring-black'
                            : 'bg-white text-black border-black/20 hover:border-black'
                        }`}
                      >
                        {sz}&quot;
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monogram Box */}
              <div className="mb-5 sm:mb-6 border border-black/10 bg-neutral-100 p-3 sm:p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span className="text-xs font-bold uppercase tracking-tight text-black">
                      Blind Debossed Monogram
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMonogramInput(!showMonogramInput)}
                    className="text-[10px] font-mono uppercase text-black font-semibold underline cursor-pointer"
                  >
                    {showMonogramInput ? 'Remove' : '+ Add Initials (Free)'}
                  </button>
                </div>

                {showMonogramInput && (
                  <div className="mt-3 pt-3 border-t border-black/10 flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={3}
                      value={monogram}
                      onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                      placeholder="E.G. AS"
                      className="w-24 bg-white border border-black px-3 py-1.5 text-xs font-mono uppercase tracking-widest font-bold focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-neutral-500">
                      Up to 3 letters hand-pressed under brass heated stamp.
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity & CTA */}
              {product.inStock ? (
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-6 sm:mb-8">
                  <div className="flex items-center justify-between border border-black bg-white px-2 py-1 w-full sm:w-32 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Added ${quantity}x ${product.name} (Size: ${selectedSize}") to bag.`);
                    }}
                    className="flex-1 bg-black text-white hover:bg-neutral-900 py-3.5 sm:py-4 px-6 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Secure Piece &bull; ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  </button>
                </div>
              ) : (
                <div className="border border-neutral-300 bg-neutral-200 p-4 text-center mb-6 sm:mb-8">
                  <span className="text-black text-xs uppercase font-bold tracking-widest block font-mono">
                    Batch 01 Exhausted &bull; Enter Waitlist for Drop 02
                  </span>
                </div>
              )}

              {/* Accordion Panels */}
              <div className="border-t border-black/10 divide-y divide-black/10 font-mono text-xs">
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedAccordion(expandedAccordion === 'specs' ? null : 'specs')}
                    className="w-full py-3 sm:py-3.5 flex items-center justify-between text-left font-bold uppercase text-black cursor-pointer"
                  >
                    <span>01 // Hide Genealogy & Metallurgy</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedAccordion === 'specs' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccordion === 'specs' && (
                    <div className="pb-3.5 space-y-1.5 text-[11px] text-neutral-600">
                      <div><strong>Tannery:</strong> {product.hideOrigin}</div>
                      <div><strong>Thickness:</strong> {product.thickness}</div>
                      <div><strong>Hardware Mass:</strong> {product.hardware}</div>
                      <div><strong>Thread Channel:</strong> {product.threadSpec}</div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedAccordion(expandedAccordion === 'patina' ? null : 'patina')}
                    className="w-full py-3 sm:py-3.5 flex items-center justify-between text-left font-bold uppercase text-black cursor-pointer"
                  >
                    <span>02 // The 10-Year Patina Horizon</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedAccordion === 'patina' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccordion === 'patina' && (
                    <div className="pb-3.5 text-[11px] text-neutral-600 leading-relaxed">
                      Natural full-grain bovine hide develops a deep caramel tea-core glaze through body warmth, denim indigo rub, and palm oils.
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedAccordion(expandedAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full py-3 sm:py-3.5 flex items-center justify-between text-left font-bold uppercase text-black cursor-pointer"
                  >
                    <span>03 // Worldwide Dispatch & Returns</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccordion === 'shipping' && (
                    <div className="pb-3.5 text-[11px] text-neutral-600 leading-relaxed">
                      Dispatched within 24–48 hours via BlueDart Air / DHL Express in cedarwood shavings. Free 14-day unworn size exchange guarantee.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}