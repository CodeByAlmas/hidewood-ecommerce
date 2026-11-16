'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Heart, Plus, Check, Bell, Loader2, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

export interface Product {
  id: string;
  name: string;
  price: number;
  badge?: string;
  category: string;
  description: string;
  spec: string;
  inStock: boolean;
  images: string[];
  coverPrimary?: string;
  coverHover?: string;
  isNewArrival?: boolean;
}

interface ProductGridProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  isReady?: boolean;
}

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
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.05 });

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(prod.id);

  const primaryImg = prod.coverPrimary || prod.images?.[0] || '/belt-macro.png';
  const hoverImg = prod.coverHover || prod.images?.[1] || primaryImg;
  const hasSecondary = hoverImg !== primaryImg;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!prod.inStock) return;

    addItemToCart({
      id: `${prod.id}-quick`,
      name: prod.name,
      price: prod.price,
      size: '34',
      quantity: 1,
      image: primaryImg,
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
        badge: prod.badge || (prod.isNewArrival ? 'New Drop' : ''),
        category: prod.category,
        image: primaryImg,
        spec: prod.spec,
      });
    }
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/reservation');
  };

  return (
    <article
      ref={cardRef}
      onClick={() => onSelect(prod)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      {/* White Backdrop Before Scroll Reveal */}
      <div className={`relative ${aspect} w-full overflow-hidden bg-white mb-2.5`}>
        {/* Primary Cover Image: Left-to-Right Wipe on Scroll */}
        <motion.div
          initial={{ x: '-101%' }}
          animate={isInView ? { x: '0%' } : { x: '-101%' }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <img
            src={primaryImg}
            alt={prod.name}
            loading="lazy"
            className="w-full h-full object-cover pointer-events-none transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-102"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/belt-macro.png';
            }}
          />
        </motion.div>

        {/* Secondary Image Flip on Hover */}
        {hasSecondary && (
          <motion.img
            src={hoverImg}
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

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
          {prod.badge && (
            <span className="bg-black/85 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider">
              {prod.badge}
            </span>
          )}
          {prod.isNewArrival && !prod.badge && (
            <span className="bg-purple-950/90 text-purple-200 text-[8px] sm:text-[9px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
              <span>New Drop</span>
            </span>
          )}
          {!prod.inStock && (
            <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
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

        {/* Action Button Bar */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-20">
          <AnimatePresence>
            {prod.inStock ? (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full bg-black/90 hover:bg-black text-white py-2 px-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 active:scale-98 shadow-md cursor-pointer"
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
                className="w-full bg-black/90 hover:bg-black text-white py-2 px-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold text-center transition-all duration-300 flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 active:scale-98 shadow-md cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-red-500" />
                <span>NOTIFY ME WHEN BACK</span>
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Title & Pricing */}
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
      <p className="text-[10px] text-neutral-500 font-sans truncate mt-0.5">
        {prod.spec || 'Pure Leather Piece'}
      </p>
    </article>
  );
}

export default function ProductGrid({
  products: initialProducts,
  onSelectProduct,
}: ProductGridProps) {
  const [liveCatalog, setLiveCatalog] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts || initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setLiveCatalog(initialProducts);
      setIsLoading(false);
      return;
    }

    const fetchDatabaseCatalog = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const mapped: Product[] = data.products.map((p: any) => ({
            id: p.slug || p.id,
            name: p.name,
            price: p.price,
            badge: p.isNewArrival ? 'New Drop' : (p.featuredSale ? 'Flash Sale' : ''),
            category: p.subCategory || p.category,
            description: p.description || '',
            spec: p.spec || 'Pure Leather',
            inStock: p.inStock,
            coverPrimary: p.coverPrimary,
            coverHover: p.coverHover,
            isNewArrival: p.isNewArrival,
            images: [
              p.coverPrimary || p.images?.[0] || '/belt-macro.png',
              p.coverHover || p.images?.[1] || p.coverPrimary || '/belt-macro.png',
            ],
          }));
          setLiveCatalog(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch home catalog in ProductGrid:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseCatalog();
  }, [initialProducts]);

  const rowChunks = useMemo(() => {
    const chunks: Product[][] = [];
    let i = 0;
    while (i < liveCatalog.length) {
      const patternIndex = chunks.length % 3;
      const size = patternIndex === 0 ? 4 : 3;
      chunks.push(liveCatalog.slice(i, i + size));
      i += size;
    }
    return chunks;
  }, [liveCatalog]);

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
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-3 mb-6 sm:mb-8 font-sans border-b border-black/10"
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

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-red-600 mb-2" />
            <span>Loading Atelier Catalog...</span>
          </div>
        ) : liveCatalog.length === 0 ? (
          <div className="p-12 border border-dashed border-black/15 bg-white/60 text-center font-mono my-4">
            <p className="text-xs uppercase text-neutral-500 font-bold">
              Catalog updating. Products added via admin console will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-14 w-full">
            {rowChunks.map((chunk, chunkIdx) => {
              const pattern = chunkIdx % 3;

              if (pattern === 0 || chunk.length === 4) {
                return (
                  <div
                    key={chunkIdx}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full"
                  >
                    {chunk.map((item) => (
                      <ProductItem
                        key={item.id}
                        prod={item}
                        aspect="aspect-[3/4]"
                        onSelect={onSelectProduct}
                      />
                    ))}
                  </div>
                );
              }

              if (pattern === 1) {
                const leftTwo = chunk.slice(0, 2);
                const rightBig = chunk[2];

                return (
                  <div
                    key={chunkIdx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start"
                  >
                    <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                      {leftTwo.map((item) => (
                        <ProductItem
                          key={item.id}
                          prod={item}
                          aspect="aspect-[3/4]"
                          onSelect={onSelectProduct}
                        />
                      ))}
                    </div>

                    {rightBig && (
                      <div className="md:col-span-7">
                        <ProductItem
                          prod={rightBig}
                          aspect="aspect-[16/11]"
                          onSelect={onSelectProduct}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              if (pattern === 2) {
                const leftBig = chunk[0];
                const rightTwo = chunk.slice(1, 3);

                return (
                  <div
                    key={chunkIdx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-start"
                  >
                    {leftBig && (
                      <div className="md:col-span-7">
                        <ProductItem
                          prod={leftBig}
                          aspect="aspect-[16/11]"
                          onSelect={onSelectProduct}
                        />
                      </div>
                    )}

                    <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                      {rightTwo.map((item) => (
                        <ProductItem
                          key={item.id}
                          prod={item}
                          aspect="aspect-[3/4]"
                          onSelect={onSelectProduct}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </section>
  );
}