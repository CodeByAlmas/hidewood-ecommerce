'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Plus, Check, Bell } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

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
  {
    id: 'hw-01',
    name: 'The Bridle Edition',
    price: 5499,
    badge: 'Best Seller',
    category: 'Full-Grain 38mm',
    description: 'Cut from 100% pure thick leather. Treated with natural wax for a lifetime of daily wear without cracking.',
    spec: '4.2mm Real Hide • Solid Brass Buckle',
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
    id: 'hw-03',
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
    id: 'hw-04',
    name: 'Bespoke Folio Wallet',
    price: 4499,
    badge: 'New Arrival',
    category: 'Wallets & Carry',
    description: 'Slim bifold leather wallet holding 8 cards and flat cash without bulging in your pocket.',
    spec: 'Smooth Grain Leather • Hand-Finished',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-05',
    name: 'Archival Field Backpack',
    price: 18499,
    badge: 'Travel Gear',
    category: 'Structural Bags',
    description: 'Heavyweight all-leather travel pack with reinforced solid copper rivets and padded shoulder straps.',
    spec: '28L Laptop Capacity • Solid Brass Locks',
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
    badge: 'Hand-Crafted',
    category: 'Leather Footwear',
    description: 'Classic lace-up formal derby shoes made with replaceable double leather soles for decade-long wear.',
    spec: 'Goodyear Welt Construction • Calf Leather',
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
    badge: 'Pure Leather Jacket',
    category: 'Leather Jackets',
    description: 'Heavyweight genuine motorcycle rider leather jacket with heavy duty brass metal zippers.',
    spec: '1.4mm Heavy Cowhide • Satin Inner Lining',
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'hw-08',
    name: 'Monolithic Field Duffle 45L',
    price: 24999,
    badge: 'Weekend Duffle',
    category: 'Travel Bags',
    description: 'Large weekend duffle bag cut from full-grain leather. Designed to handle airline travel effortlessly.',
    spec: '45L Cabin Approved • Copper Rivets',
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
    badge: 'Phone Cases',
    category: 'Phone Accessories',
    description: 'Real leather phone case with built-in MagSafe magnets that develops a dark, glossy patina with daily touch.',
    spec: 'Soft Microfiber Inside • Real Leather Shell',
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
    badge: 'Summer Sandals',
    category: 'Footwear',
    description: 'Comfortable contoured leather sandals with thick solid brass buckles hand-made on natural soles.',
    spec: 'All-Leather Footbed • Solid Brass Buckle',
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
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(prod.id);

  const hasSecondary = prod.images && prod.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!prod.inStock) return;

    addItemToCart({
      id: `${prod.id}-quick`,
      name: prod.name,
      price: prod.price,
      size: '34',
      quantity: 1,
      image: prod.images[0],
      category: prod.category,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    openCart();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(prod.id);
    } else {
      addFavorite({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        badge: prod.badge,
        category: prod.category,
        image: prod.images[0],
        spec: prod.spec,
      });
    }
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/reservation');
  };

  return (
    <div
      onClick={() => onSelect(prod)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      <div className={`relative ${aspect} w-full overflow-hidden bg-neutral-200/50 mb-2.5`}>
        {/* Primary Image */}
        <img
          src={prod.images[0]}
          alt={prod.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-102"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop';
          }}
        />

        {/* Secondary Image Flip */}
        {hasSecondary && (
          <motion.img
            src={prod.images[1]}
            alt={`${prod.name} secondary angle`}
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

        {/* Top Badges (Category & Stock) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase px-2 py-0.5 font-bold">
            {prod.badge}
          </span>
          {!prod.inStock && (
            <span className="bg-red-600 text-white text-[9px] font-mono uppercase px-2 py-0.5 font-bold">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-red-600 text-red-600' : 'text-neutral-700 hover:text-black'
            }`}
          />
        </button>

        {/* Quick Add To Bag / Notify Button Bar */}
        {prod.inStock ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-2.5 inset-x-2.5 z-20 bg-black/90 hover:bg-black text-white py-2 px-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 active:scale-98 shadow-md cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added To Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add &bull; 34&quot;</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNotifyMe}
            className="absolute bottom-2.5 inset-x-2.5 z-20 bg-black/90 hover:bg-black text-white py-2 px-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold text-center transition-all duration-300 flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 active:scale-98 shadow-md cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-red-500" />
            <span>NOTIFY ME WHEN BACK</span>
          </button>
        )}
      </div>

      {/* Product Title & Pricing */}
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
      <p className="text-[10px] text-neutral-500 font-sans truncate mt-0.5">
        {prod.spec}
      </p>
    </div>
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
      className="relative w-screen left-1/2 -translate-x-1/2 pt-4 pb-6 sm:pb-10 overflow-hidden select-none"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
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
              New Arrivals &bull; 100% Genuine Full-Grain Leather
            </h2>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-500 font-medium font-mono">
            Free Express Shipping Across India &bull; Lifetime Guarantee
          </p>
        </motion.div>

        <div className="flex flex-col gap-10 sm:gap-14 w-full">
          {/* Row 1: 4 Products */}
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

          {/* Row 2: 2 Compact Left + 1 Feature Right */}
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

          {/* Row 3: 1 Feature Left + 2 Compact Right */}
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