'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronDown,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Star,
  Camera,
  CheckCircle2,
  X,
  Heart,
} from 'lucide-react';
import { PRODUCTS_CATALOG, ProductDetail } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface UserReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
}

const PRODUCT_COLORS: Record<string, { name: string; hex: string }[]> = {
  'the-bridle-edition': [
    { name: 'Pitch Black', hex: '#111111' },
    { name: 'Dark Chestnut', hex: '#4A2E1B' },
    { name: 'Vintage Tan', hex: '#8C5835' },
  ],
  'the-onyx-dress': [
    { name: 'Matte Onyx Black', hex: '#161616' },
    { name: 'Midnight Charcoal', hex: '#2A2A2A' },
  ],
  'bespoke-folio-wallet': [
    { name: 'Caramel Tan', hex: '#9E5B32' },
    { name: 'Classic Black', hex: '#141414' },
    { name: 'Olive Hunter', hex: '#3B4434' },
  ],
};

function RelatedProductCard({ prod }: { prod: ProductDetail }) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondary = prod.images && prod.images.length > 1;

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(prod.slug);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(prod.slug);
    } else {
      addFavorite({
        id: prod.slug,
        name: prod.name,
        price: prod.price,
        badge: 'Recommended',
        category: prod.category,
        image: prod.images[0],
        spec: `${prod.thickness} • ${prod.hardware}`,
      });
    }
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      <div className="relative w-full">
        <Link href={`/products/${prod.slug}`} className="block w-full">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200/50 mb-2.5">
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
                className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                style={{
                  visibility: isHovered ? 'visible' : 'hidden',
                }}
              />
            )}

            {!prod.inStock && (
              <div className="absolute top-2.5 left-2.5 z-20 bg-red-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 font-bold">
                Sold Out
              </div>
            )}

            {/* Heart button on Related Card */}
            <button
              type="button"
              onClick={toggleFavorite}
              className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
              aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                  isFav ? 'fill-red-600 text-red-600' : 'text-neutral-700 hover:text-black'
                }`}
              />
            </button>
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

          <p className="text-[10px] text-neutral-500 font-sans truncate mt-0.5">
            {prod.thickness} • {prod.hardware}
          </p>
        </Link>
      </div>
    </article>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const product: ProductDetail =
    PRODUCTS_CATALOG.find((p) => p.slug === resolvedParams.slug) || PRODUCTS_CATALOG[0];

  const availableColors = PRODUCT_COLORS[product.slug] || null;

  const [activeMobileImage, setActiveMobileImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('34');
  const [selectedColor, setSelectedColor] = useState(availableColors ? availableColors[0].name : '');
  const [quantity, setQuantity] = useState(1);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('specs');

  // Favorites Hook
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(product.slug);

  const toggleMainFavorite = () => {
    if (isFav) {
      removeFavorite(product.slug);
    } else {
      addFavorite({
        id: product.slug,
        name: product.name,
        price: product.price,
        badge: 'Handcrafted',
        category: product.category,
        image: product.images[0],
        spec: `${product.thickness} • ${product.hardware}`,
      });
    }
  };

  // Review System State
  const [reviewsList, setReviewsList] = useState<UserReview[]>([
    {
      id: 'rev-01',
      author: 'Rohit Verma',
      rating: 5,
      date: '2 weeks ago',
      title: 'Real full-grain leather, super thick!',
      comment:
        'Been wearing this daily. The leather is thick and doesn’t crease or peel like commercial store belts. Brass buckle has real weight.',
      verified: true,
      images: ['/belt-macro.png'],
    },
    {
      id: 'rev-02',
      author: 'Ananya S.',
      rating: 5,
      date: '1 month ago',
      title: 'Amazing craft & finish',
      comment:
        'Edges are beveled and hand-smoothed. Smells of pure organic leather. Best investment for tailored trousers.',
      verified: true,
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);

  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const averageRating = useMemo(() => {
    if (reviewsList.length === 0) return 5.0;
    const total = reviewsList.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const relatedProducts = useMemo(() => {
    const others = PRODUCTS_CATALOG.filter((p) => p.slug !== product.slug);
    const sameCategory = others.filter((p) => p.category === product.category);
    const diffCategory = others.filter((p) => p.category !== product.category);
    return [...sameCategory, ...diffCategory].slice(0, 4);
  }, [product.slug, product.category]);

  const handleAddToCart = () => {
    if (!product.inStock) return;

    addItemToCart({
      id: `${product.slug}-${selectedSize}${selectedColor ? `-${selectedColor}` : ''}`,
      name: `${product.name}${selectedColor ? ` (${selectedColor})` : ''}`,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[0],
      category: product.category,
    });

    openCart();
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    handleAddToCart();
    router.push('/checkout');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: reviewName.trim(),
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Verified Experience',
      comment: reviewComment.trim(),
      verified: true,
      images: reviewImage ? [reviewImage] : undefined,
    };

    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setReviewImage(null);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'HIDEWOOD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewsList.length,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-20 sm:pt-24 pb-14 sm:pb-24">
        
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb Navigation"
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 border-b border-black/10 select-none"
        >
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase">
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Back to Products</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] sm:text-xs">
              <span>CATALOG</span>
              <span>&bull;</span>
              <span className="text-black font-bold uppercase">{product.category}</span>
            </div>
          </div>
        </nav>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 xl:gap-20 items-start">
            
            {/* LEFT: IMAGES GALLERY */}
            <div className="lg:col-span-7 w-full">
              {/* Mobile Carousel */}
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

                  {/* Mobile Heart Float */}
                  <button
                    type="button"
                    onClick={toggleMainFavorite}
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm cursor-pointer"
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-red-600 text-red-600' : 'text-neutral-800'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2 py-0.5 border border-white/20">
                    100% PURE LEATHER
                  </div>
                </div>

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
                      <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Vertical Gallery */}
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
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                    />

                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 border border-white/20">
                      ANGLE // 0{idx + 1} OF 0{product.images.length}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 border border-white/20">
                      100% GENUINE LEATHER
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Specs Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-black/10 font-mono text-[9px] uppercase mt-4">
                <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                  <div className="text-neutral-400">MATERIAL</div>
                  <div className="font-bold text-black mt-0.5">100% Pure Leather</div>
                </div>
                <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                  <div className="text-neutral-400">CORE</div>
                  <div className="font-bold text-black mt-0.5">Zero Synthetic Fillers</div>
                </div>
                <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                  <div className="text-neutral-400">HARDWARE</div>
                  <div className="font-bold text-black mt-0.5">Solid Cast Brass</div>
                </div>
                <div className="p-2.5 sm:p-3 border border-black/10 bg-white">
                  <div className="text-neutral-400">WARRANTY</div>
                  <div className="font-bold text-black mt-0.5">Lifetime Guarantee</div>
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILS, REVIEWS & PURCHASING */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col justify-between">
              <div>
                {/* Stock Status Bar & Favorite Action */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/10 font-mono text-[10px] uppercase">
                  <span className="text-neutral-500 font-bold">{product.badge}</span>
                  <div className="flex items-center gap-3">
                    {product.inStock ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        In Stock &bull; Ready to Ship
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">Sold Out</span>
                    )}

                    <button
                      type="button"
                      onClick={toggleMainFavorite}
                      className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-600 hover:text-black cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
                      <span>{isFav ? 'Saved' : 'Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-2">
                  {product.name}
                </h1>

                {/* Rating & Review Indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5 text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono text-black">{averageRating}</span>
                  <span className="text-neutral-400 text-xs font-mono">&bull;</span>
                  <a
                    href="#reviews-section"
                    className="text-xs font-mono underline text-neutral-600 hover:text-black"
                  >
                    ({reviewsList.length} reviews)
                  </a>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 sm:gap-3 mb-5">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase">
                    All Taxes Included &bull; Free Delivery
                  </span>
                </div>

                {/* Product Description */}
                <div className="mb-5">
                  <h2 className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider mb-1 font-bold">
                    Description
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* CONDITIONAL COLOR OPTIONS */}
                {availableColors && availableColors.length > 0 && (
                  <div className="p-3.5 border border-black/10 bg-white mb-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-tight">
                        Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                      </span>
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        {availableColors.length} Shades
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {availableColors.map((col) => {
                        const isChosen = selectedColor === col.name;
                        return (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => setSelectedColor(col.name)}
                            title={col.name}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                              isChosen ? 'border-black scale-110' : 'border-transparent hover:scale-105'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 block"
                              style={{ backgroundColor: col.hex }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="p-3.5 sm:p-4 border border-black bg-white mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tight">
                      <span>Select Size</span>
                      <span className="text-[10px] font-mono font-normal text-neutral-500">(Inches)</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500">
                      Standard Pant Size + 2&quot;
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {['30', '32', '34', '36', '38'].map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`h-10 border text-xs font-mono font-bold transition-all cursor-pointer ${
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

                {/* Quantity & CTA Buttons */}
                {product.inStock ? (
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center justify-between border border-black bg-white px-3 py-2 w-full">
                      <span className="font-mono text-xs uppercase font-bold text-neutral-600">Quantity</span>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-1 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-sm font-bold w-4 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1 hover:bg-neutral-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full bg-white text-black border border-black hover:bg-neutral-100 py-3.5 px-4 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full bg-black text-white hover:bg-neutral-900 py-3.5 px-4 text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Buy Now &bull; ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                      </button>
                    </div>

                    {/* Dedicated Add to Wishlist Button */}
                    <button
                      type="button"
                      onClick={toggleMainFavorite}
                      className="w-full border border-black/20 hover:border-black py-2.5 px-4 text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer bg-neutral-50 hover:bg-white"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600 text-red-600' : 'text-neutral-700'}`} />
                      <span>{isFav ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="border border-neutral-300 bg-neutral-200 p-4 text-center mb-6">
                    <span className="text-black text-xs uppercase font-bold tracking-widest block font-mono">
                      Out of Stock &bull; Notify Me When Available
                    </span>
                  </div>
                )}

                {/* Accordion Panels */}
                <div className="border-t border-black/10 divide-y divide-black/10 font-mono text-xs">
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === 'specs' ? null : 'specs')}
                      className="w-full py-3 flex items-center justify-between text-left font-bold uppercase text-black cursor-pointer"
                    >
                      <span>01 // Materials &amp; Dimensions</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedAccordion === 'specs' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedAccordion === 'specs' && (
                      <div className="pb-3 space-y-1.5 text-[11px] text-neutral-600">
                        <div><strong>Leather Origin:</strong> {product.hideOrigin}</div>
                        <div><strong>Thickness:</strong> {product.thickness}</div>
                        <div><strong>Buckle / Hardware:</strong> {product.hardware}</div>
                        <div><strong>Stitching:</strong> {product.threadSpec}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === 'shipping' ? null : 'shipping')}
                      className="w-full py-3 flex items-center justify-between text-left font-bold uppercase text-black cursor-pointer"
                    >
                      <span>02 // Delivery &amp; Free Exchanges</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedAccordion === 'shipping' && (
                      <div className="pb-3 text-[11px] text-neutral-600 leading-relaxed font-sans">
                        Dispatched in 24–48 hours via express courier across India. 14-day hassle-free unworn size exchange warranty included.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Authentic Full-Grain Leather &bull; Lifetime Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section
          id="reviews-section"
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 sm:pt-20 mt-14 sm:mt-20 border-t border-black/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 sm:mb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                  Customer Reviews ({reviewsList.length})
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Average {averageRating} out of 5 stars from verified buyers across India
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="self-start sm:self-auto py-2.5 px-4 bg-black text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 bg-white border border-black/10 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{rev.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-black mb-1">{rev.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">{rev.comment}</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {rev.images.map((imgSrc, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={imgSrc}
                          alt="Customer review photo"
                          className="w-16 h-16 object-cover border border-black/10"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span className="font-bold text-black uppercase">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WRITE A REVIEW MODAL */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative w-full max-w-lg bg-white p-5 sm:p-7 shadow-2xl border border-black/20"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
                  <h3 className="font-bold text-sm sm:text-base uppercase tracking-tight text-black">
                    Write Product Review
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="p-1 hover:bg-neutral-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-bold">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-black text-black' : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-bold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Kabir S."
                      className="w-full border border-black/20 p-2 text-xs font-sans focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-bold">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Excellent thickness and finish"
                      className="w-full border border-black/20 p-2 text-xs font-sans focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-bold">
                      Your Feedback
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience regarding leather texture, fit, and build quality..."
                      className="w-full border border-black/20 p-2 text-xs font-sans focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-bold">
                      Add Photos (Optional)
                    </label>
                    <label className="flex items-center gap-2 p-2 border border-dashed border-black/20 hover:border-black cursor-pointer bg-neutral-50">
                      <Camera className="w-4 h-4 text-neutral-600" />
                      <span className="text-xs text-neutral-600">Upload a photo of your piece</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {reviewImage && (
                      <div className="mt-2 relative w-16 h-16 border border-black/20">
                        <img src={reviewImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setReviewImage(null)}
                          className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white uppercase text-xs font-bold tracking-wider hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* YOU MAY ALSO LIKE SECTION */}
        <section
          aria-label="You May Also Like"
          className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 sm:pt-20 mt-14 sm:mt-20 border-t border-black/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-6 sm:mb-8 font-sans border-b border-black/10">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
                You May Also Like &bull; Handcrafted Real Leather
              </h2>
            </div>

            <Link
              href="/products"
              className="font-mono text-[10px] sm:text-xs uppercase font-bold text-black hover:text-neutral-600 inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Collection</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 w-full"
          >
            {relatedProducts.map((relProd) => (
              <RelatedProductCard key={relProd.slug} prod={relProd} />
            ))}
          </motion.div>
        </section>

      </div>
    </>
  );
}