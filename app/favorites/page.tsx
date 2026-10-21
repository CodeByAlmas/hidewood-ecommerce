'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { useFavoriteStore, FavoriteItem } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';

function FavoriteCard3D({
  item,
  onRemove,
  onAddToCart,
}: {
  item: FavoriteItem;
  onRemove: (id: string) => void;
  onAddToCart: (item: FavoriteItem) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 160, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 160, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="w-full flex justify-center select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full border border-black bg-white p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative"
      >
        <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden mb-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
          />

          {item.badge && (
            <div className="absolute top-2 left-2 z-10 bg-black text-white font-mono text-[8px] sm:text-[9px] uppercase px-2 py-0.5 font-bold">
              {item.badge}
            </div>
          )}

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 z-10 bg-white/95 hover:bg-black hover:text-white p-1.5 transition-colors cursor-pointer border border-black/10 shadow-xs"
            aria-label="Remove from Wishlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
            {item.category}
          </span>
          <h3 className="font-bold text-xs sm:text-sm uppercase tracking-tight text-black truncate font-sans">
            {item.name}
          </h3>
          <span className="font-mono text-xs font-bold text-red-600">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="w-full py-2.5 px-3 bg-black text-white hover:bg-neutral-800 text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Move To Bag</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function FavoritesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { items, removeFavorite } = useFavoriteStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('hidewood_session_email');
      setUserEmail(activeSession);
    }
  }, []);

  // GSAP Entry Animation
  useEffect(() => {
    if (mounted && containerRef.current) {
      gsap.fromTo(
        '.fav-item-node',
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [mounted, items.length]);

  const handleAddToCart = (item: FavoriteItem) => {
    addItemToCart({
      id: `${item.id}-default`,
      name: item.name,
      price: item.price,
      size: '34',
      quantity: 1,
      image: item.image,
      category: item.category,
    });
    openCart();
  };

  const favoriteSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Customer Saved Pieces & Wishlist | HIDEWOOD',
    description: 'Saved genuine full-grain leather belts, wallets, and bags handcrafted in Kanpur.',
    url: 'https://hidewood.example.com/favorites',
  };

  if (!mounted) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(favoriteSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        {/* Top Breadcrumb Header */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>SAVED ARCHIVE</span>
              <span>&bull;</span>
              <span className="text-black font-bold">{items.length} ITEMS</span>
            </div>
          </div>
        </section>

        {/* Hero Title & Identity Status */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                <span>
                  {userEmail ? `Private Wishlist for ${userEmail}` : 'Your Personal Wishlist'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none font-sans">
                SAVED PIECES
              </h1>
            </div>

            <p className="font-mono text-xs text-neutral-500 max-w-sm">
              Your curated shortlist of handcrafted Kanpur leather articles. Saved safely in your private browser vault.
            </p>
          </div>
        </section>

        {/* Wishlist Items Grid */}
        <section
          ref={containerRef}
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12"
        >
          {items.length === 0 ? (
            <div className="border border-black bg-white p-12 sm:p-20 text-center font-mono max-w-xl mx-auto shadow-xs">
              <PackageOpen className="w-12 h-12 stroke-[1] mx-auto mb-4 text-neutral-400" />
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-black mb-2 font-sans">
                YOUR WISHLIST IS EMPTY
              </h2>
              <p className="text-xs text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed font-sans">
                You haven&apos;t added any leather products to your favorites yet. Tap the heart icon on any article to save it here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-neutral-800 px-8 py-3.5 text-xs uppercase font-bold tracking-widest transition-colors font-mono"
              >
                <span>Browse Collection</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {items.map((item) => (
                <div key={item.id} className="fav-item-node">
                  <FavoriteCard3D
                    item={item}
                    onRemove={removeFavorite}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Guarantee Banner */}
          <div className="mt-14 sm:mt-20 border border-black/15 bg-white p-6 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-[11px] text-neutral-600 font-sans">
                100% Genuine Full-Grain Leather &bull; Free Express Courier &bull; 14-Day Size Exchange
              </span>
            </div>

            <Link
              href="/reservation"
              className="text-black font-bold uppercase underline hover:text-neutral-600 text-[11px] flex items-center gap-1 shrink-0"
            >
              <span>Explore Pre-Order Droplist</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}