'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  SlidersHorizontal,
  Check,
  ChevronDown,
  X,
  RotateCcw,
  Heart,
  ShoppingBag,
  Bell,
} from 'lucide-react';
import { PRODUCTS_CATALOG } from '@/data/products';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';

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
    badge: 'Best Seller',
    category: 'Full-Grain Belts',
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
    slug: 'the-onyx-dress',
    name: 'The Onyx Dress',
    price: 6299,
    badge: 'Formal Classic',
    category: 'Full-Grain Belts',
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
    slug: 'heritage-raw-saddle',
    name: 'Heritage Raw Saddle',
    price: 6999,
    badge: 'Sold Out',
    category: 'Full-Grain Belts',
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
    slug: 'bespoke-folio-wallet',
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
    slug: 'archival-field-backpack',
    name: 'Archival Field Backpack',
    price: 18499,
    badge: 'Travel Gear',
    category: 'Wallets & Carry',
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
    slug: 'service-derby-shoes',
    name: 'Service Derby Shoes',
    price: 14299,
    badge: 'Hand-Crafted',
    category: 'Welted Footwear',
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
    slug: 'tea-core-steer-moto-jacket',
    name: 'Tea-Core Steer Moto Jacket',
    price: 32999,
    badge: 'Pure Leather Jacket',
    category: 'Outerwear Atelier',
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
    slug: 'monolithic-field-duffle-45l',
    name: 'Monolithic Field Duffle 45L',
    price: 24999,
    badge: 'Weekend Duffle',
    category: 'Wallets & Carry',
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
    slug: 'magsafe-leather-case',
    name: 'MagSafe Leather Case',
    price: 3499,
    badge: 'Phone Cases',
    category: 'Wallets & Carry',
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
    slug: 'raw-harness-slide',
    name: 'Raw Harness Slide',
    price: 7999,
    badge: 'Summer Sandals',
    category: 'Welted Footwear',
    description: 'Comfortable contoured leather sandals with thick solid brass buckles hand-made on natural soles.',
    spec: 'All-Leather Footbed • Solid Brass Buckle',
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
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const hasSecondary = prod.images && prod.images.length > 1;

  // Favorites Hook
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(prod.id);

  // Cart Store Hook
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/reservation');
  };

  const navigateToProduct = () => {
    router.push(`/products/${prod.slug}`);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between w-full select-none"
    >
      <div className="relative w-full">
        {/* Visual Stage Box */}
        <div className={`relative ${aspect} w-full overflow-hidden bg-neutral-200/50 mb-2.5`}>
          {/* Main Visual Image Link */}
          <Link
            href={`/products/${prod.slug}`}
            className="absolute inset-0 z-0 block cursor-pointer"
            aria-label={`View details for ${prod.name}`}
          >
            <img
              src={prod.images[0]}
              alt={prod.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop';
              }}
            />

            {/* Secondary Image Flip */}
            {hasSecondary && (
              <motion.img
                src={prod.images[1]}
                alt={`${prod.name} alternate view`}
                initial={false}
                animate={{
                  x: isHovered ? '0%' : '-101%',
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover z-1 pointer-events-none"
                style={{
                  visibility: isHovered ? 'visible' : 'hidden',
                }}
              />
            )}
          </Link>

          {/* Top-Left Badges */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 pointer-events-none">
            {prod.badge && (
              <span className="bg-black text-white text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold tracking-wider">
                {prod.badge}
              </span>
            )}
            {!prod.inStock && (
              <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 font-bold tracking-wider">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Top-Right Heart Wishlist Trigger (Isolated from Link) */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-90 pointer-events-auto"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFav ? 'fill-red-600 text-red-600' : 'text-neutral-700 hover:text-black'
              }`}
            />
          </button>

          {/* Bottom Hover Actions Bar (Isolated from Link) */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-2 pointer-events-auto">
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  {prod.inStock ? (
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="w-full bg-black/95 hover:bg-black backdrop-blur-xs text-white py-2 px-3 text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md active:scale-98"
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added To Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-white" />
                          <span>+ QUICK ADD • 34&quot;</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNotifyMe}
                      className="w-full bg-black/85 hover:bg-black backdrop-blur-xs text-white py-2 px-3 text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bell className="w-3 h-3 text-red-500" />
                      <span>NOTIFY ME WHEN BACK</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Title & Price (Direct Navigation Link) */}
        <div
          onClick={navigateToProduct}
          className="cursor-pointer"
        >
          <div className="flex items-baseline justify-between gap-2 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  prod.inStock ? 'bg-red-600' : 'bg-neutral-400'
                }`}
              />
              <h3 className="font-bold text-black uppercase tracking-tight truncate hover:underline">
                {prod.name}
              </h3>
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
      </div>
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
  'ALL PRODUCTS',
  'LEATHER BELTS',
  'LEATHER JACKETS',
  'WALLETS & CARRY',
  'LEATHER SHOES',
];

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'featured';
type PriceFilter = 'all' | 'under-5k' | '5k-10k' | 'above-10k';

export default function ShopAllPage() {
  const [activeCategory, setActiveCategory] = useState('ALL PRODUCTS');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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
    let result = [...allProducts];

    // 1. Category Filter
    if (activeCategory !== 'ALL PRODUCTS') {
      const categoryMap: Record<string, string> = {
        'LEATHER BELTS': 'full-grain belts',
        'LEATHER JACKETS': 'outerwear atelier',
        'WALLETS & CARRY': 'wallets & carry',
        'LEATHER SHOES': 'welted footwear',
      };

      const targetCategory = categoryMap[activeCategory];
      if (targetCategory) {
        result = result.filter(
          (item) => item.category.toLowerCase() === targetCategory
        );
      }
    }

    // 2. Stock Availability Filter
    if (onlyInStock) {
      result = result.filter((item) => item.inStock);
    }

    // 3. Price Range Filter
    if (priceRange === 'under-5k') {
      result = result.filter((item) => item.price < 5000);
    } else if (priceRange === '5k-10k') {
      result = result.filter((item) => item.price >= 5000 && item.price <= 10000);
    } else if (priceRange === 'above-10k') {
      result = result.filter((item) => item.price > 10000);
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.badge === 'Best Seller' ? 1 : 0) - (a.badge === 'Best Seller' ? 1 : 0));
    }

    return result;
  }, [allProducts, activeCategory, sortBy, onlyInStock, priceRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (sortBy !== 'default') count++;
    if (onlyInStock) count++;
    if (priceRange !== 'all') count++;
    return count;
  }, [sortBy, onlyInStock, priceRange]);

  const handleResetFilters = () => {
    setSortBy('default');
    setOnlyInStock(false);
    setPriceRange('all');
  };

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
    name: 'HIDEWOOD | 100% Genuine Full-Grain Leather Products',
    description:
      'Explore handcrafted full-grain leather belts, slim wallets, duffels, leather jackets, and accessories made in Kanpur.',
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
        
        {/* TOP BANNER */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase mb-6 sm:mb-8"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>CATALOG</span>
              <span>&bull;</span>
              <span className="text-black font-bold">
                {filteredProducts.length} PRODUCTS
              </span>
            </div>
          </nav>

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Complete Collection &bull; 100% Genuine Leather
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                ALL PRODUCTS
              </h1>
            </div>

            <p className="max-w-md font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed">
              100% full-grain leather belts, handmade wallets, travel duffels, and bespoke jackets. Built to last a lifetime.
            </p>
          </div>

          {/* HORIZONTAL CATEGORY SCROLL & FILTER TRIGGER */}
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

            {/* FILTER & SORT BUTTON */}
            <div className="relative shrink-0 pl-2">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase font-bold py-1.5 px-3 border transition-colors shadow-xs cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-black/15 text-neutral-800 hover:border-black'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter &amp; Sort</span>
                {activeFilterCount > 0 && (
                  <span className="bg-red-600 text-white rounded-full px-1.5 py-0.2 text-[9px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* FILTER & SORT DRAWER */}
              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-black/20 shadow-2xl z-50 p-4 font-mono text-xs select-none"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10">
                      <span className="font-bold text-black uppercase tracking-wider">
                        Filter &amp; Sort Options
                      </span>
                      <div className="flex items-center gap-2">
                        {activeFilterCount > 0 && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-[10px] uppercase text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsFilterDropdownOpen(false)}
                          className="hover:text-black p-0.5 cursor-pointer text-neutral-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div className="mb-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                        Sort Products
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: 'Default', value: 'default' },
                          { label: 'Popular', value: 'featured' },
                          { label: '₹ Low to High', value: 'price-asc' },
                          { label: '₹ High to Low', value: 'price-desc' },
                        ].map((opt) => {
                          const isSelected = sortBy === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSortBy(opt.value as SortOption)}
                              className={`p-2 text-left uppercase text-[10px] border transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-black text-white border-black font-bold'
                                  : 'bg-neutral-50 hover:bg-neutral-100 border-black/10 text-neutral-700'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="mb-4 pt-3 border-t border-black/10">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                        Stock Availability
                      </span>
                      <label className="flex items-center gap-2.5 p-2 bg-neutral-50 border border-black/10 cursor-pointer hover:bg-neutral-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={onlyInStock}
                          onChange={(e) => setOnlyInStock(e.target.checked)}
                          className="accent-black w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-[11px] uppercase font-bold text-black">
                          Show In-Stock Only
                        </span>
                      </label>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4 pt-3 border-t border-black/10">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
                        Price Range
                      </span>
                      <div className="flex flex-col gap-1">
                        {[
                          { label: 'All Prices', value: 'all' },
                          { label: 'Under ₹5,000', value: 'under-5k' },
                          { label: '₹5,000 – ₹10,000', value: '5k-10k' },
                          { label: 'Above ₹10,000', value: 'above-10k' },
                        ].map((opt) => {
                          const isSelected = priceRange === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setPriceRange(opt.value as PriceFilter)}
                              className={`p-2 text-left uppercase text-[10px] border transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-black text-white border-black font-bold'
                                  : 'bg-neutral-50 hover:bg-neutral-100 border-black/10 text-neutral-700'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Apply */}
                    <button
                      type="button"
                      onClick={() => setIsFilterDropdownOpen(false)}
                      className="w-full py-2.5 bg-black text-white uppercase text-[11px] font-bold tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer text-center"
                    >
                      View {filteredProducts.length} Results
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </section>

        {/* DYNAMIC PRODUCT GRID */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          {filteredProducts.length === 0 ? (
            <div className="p-16 border border-black/10 bg-white text-center font-mono">
              <p className="text-sm uppercase text-neutral-500 font-bold">
                No products found matching your filter criteria
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('ALL PRODUCTS');
                  handleResetFilters();
                }}
                className="mt-4 text-xs underline text-black uppercase cursor-pointer"
              >
                Reset All Filters
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

        {/* BOTTOM BENEFIT TILES */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 mt-16 border-t border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 01 100% PURE REAL LEATHER
              </span>
              <p className="text-black font-semibold uppercase">
                All belts, wallets, bags, and jackets crafted from full-grain bovine hide. Zero cardboard core.
              </p>
            </div>

            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 02 FREE PERSONALIZATION
              </span>
              <p className="text-black font-semibold uppercase">
                Complimentary custom name initials stamped on leather goods upon request at checkout.
              </p>
            </div>

            <div className="p-4 border border-black/10 bg-white">
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 03 FAST &amp; SAFE SHIPPING
              </span>
              <p className="text-black font-semibold uppercase">
                Free express door delivery across India on orders over ₹5,000 with hassle-free size exchanges.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}