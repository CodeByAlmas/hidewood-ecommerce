'use client';

import React, { useState, useEffect, use, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronDown,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  Star,
  Camera,
  CheckCircle2,
  X,
  Heart,
  Loader2,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  mrp?: number;
  price: number;
  badge?: string;
  inStock: boolean;
  featuredSale?: boolean;
  isNewArrival?: boolean;
  coverPrimary?: string;
  coverHover?: string;
  images: string[];
  sizes: string[];
  hasColors?: boolean;
  colors?: { name: string; hex: string; sizes?: string[]; images?: string[] }[];
  description: string;
  spec: string;
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

function formatTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.startsWith('(') && word.length > 1) {
        return '(' + word.charAt(1).toUpperCase() + word.slice(2);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function DesktopGalleryShot({
  src,
  alt,
  index,
  total,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
}) {
  const shotRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(shotRef, { once: true, amount: 0.05 });

  return (
    <div
      ref={shotRef}
      className="relative aspect-square sm:aspect-[4/3] w-full bg-white border border-black/10 overflow-hidden group"
    >
      <motion.div
        initial={{ x: '-101%' }}
        animate={isInView ? { x: '0%' } : { x: '-101%' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/belt-macro.png';
          }}
        />
      </motion.div>

      <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-1 tracking-wider">
        0{index + 1} / 0{total}
      </div>
    </div>
  );
}

function RelatedProductCard({ prod }: { prod: ProductDetail }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.05 });
  const [isHovered, setIsHovered] = useState(false);

  const primaryImg = prod.coverPrimary || prod.images?.[0] || '/belt-macro.png';
  const hoverImg = prod.coverHover || prod.images?.[1] || primaryImg;
  const hasSecondary = hoverImg !== primaryImg;

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(prod.slug || prod.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const key = prod.slug || prod.id;
    if (isFav) {
      removeFavorite(key);
    } else {
      addFavorite({
        id: key,
        name: prod.name,
        price: prod.price,
        badge: prod.isNewArrival ? 'New Drop' : 'Recommended',
        category: prod.category,
        image: primaryImg,
        spec: prod.spec,
      });
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col justify-between cursor-pointer w-full select-none"
    >
      <Link href={`/products/${encodeURIComponent(prod.slug || prod.id)}`} className="block w-full">
        {/* White Backdrop + Left-to-Right Scroll Wipe */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-black/10 mb-3">
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
              className="w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/belt-macro.png';
              }}
            />
          </motion.div>

          {/* Secondary Hover Flip */}
          {hasSecondary && (
            <motion.img
              src={hoverImg}
              alt={`${prod.name} alternate angle`}
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

          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
            aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFav ? 'fill-red-600 text-red-600' : 'text-neutral-700 hover:text-black'
              }`}
            />
          </button>
        </div>

        <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                prod.inStock ? 'bg-red-600' : 'bg-neutral-400'
              }`}
            />
            <h3 className="font-semibold text-black tracking-tight truncate group-hover:underline">
              {formatTitleCase(prod.name)}
            </h3>
          </div>

          <div className="text-right shrink-0 font-mono text-xs">
            <span className="font-bold text-black">
              ₹{prod.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 font-sans truncate mt-0.5">
          {prod.spec || '100% Full-Grain Leather'}
        </p>
      </Link>
    </article>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetSlug = decodeURIComponent(resolvedParams.slug);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [allProducts, setAllProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeMobileImage, setActiveMobileImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('34');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('specs');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = product ? isFavorite(product.slug) : false;

  useEffect(() => {
    let isMounted = true;
    const fetchCurrentProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && isMounted) {
          setAllProducts(data.products);

          const found = data.products.find(
            (p: any) => p.slug === targetSlug || p.id === targetSlug
          );

          if (found) {
            setProduct(found);
            if (found.sizes && found.sizes.length > 0) {
              setSelectedSize(found.sizes[0]);
            }
            if (found.hasColors && found.colors && found.colors.length > 0) {
              setSelectedColor(found.colors[0].name);
            }
          } else {
            setProduct(data.products[0] || null);
          }
        }
      } catch (err) {
        console.error('Failed to load product from DB:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCurrentProduct();
    return () => {
      isMounted = false;
    };
  }, [targetSlug]);

  const toggleMainFavorite = () => {
    if (!product) return;
    if (isFav) {
      removeFavorite(product.slug);
    } else {
      addFavorite({
        id: product.slug,
        name: product.name,
        price: product.price,
        badge: product.isNewArrival ? 'New Arrival' : 'Handcrafted',
        category: product.category,
        image: product.images[0] || '/belt-macro.png',
        spec: product.spec,
      });
    }
  };

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
    if (reviewsList.length === 0) return '5.0';
    const total = reviewsList.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    const others = allProducts.filter((p) => (p.slug || p.id) !== (product.slug || product.id));
    const sameCategory = others.filter(
      (p) => p.category?.toLowerCase() === product.category?.toLowerCase()
    );
    const diffCategory = others.filter(
      (p) => p.category?.toLowerCase() !== product.category?.toLowerCase()
    );
    return [...sameCategory, ...diffCategory].slice(0, 4);
  }, [product, allProducts]);

  const discountPercent = useMemo(() => {
    if (!product?.mrp || product.mrp <= product.price) return 0;
    return Math.round(((product.mrp - product.price) / product.mrp) * 100);
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    addItemToCart({
      id: `${product.slug}-${selectedSize}${selectedColor ? `-${selectedColor}` : ''}`,
      name: `${formatTitleCase(product.name)}${selectedColor ? ` (${selectedColor})` : ''}`,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[0] || '/belt-macro.png',
      category: product.category,
    });

    openCart();
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock) return;
    handleAddToCart();
    router.push('/checkout');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: reviewName.trim().slice(0, 60),
      rating: Math.min(5, Math.max(1, reviewRating)),
      date: 'Just now',
      title: reviewTitle.trim().slice(0, 100) || 'Verified Experience',
      comment: reviewComment.trim().slice(0, 800),
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center font-mono text-xs text-neutral-500">
        <Loader2 className="w-7 h-7 animate-spin text-black mb-2" />
        <span>Loading Leather Piece...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-4 text-center font-mono">
        <h1 className="text-xl font-semibold mb-2">Product Not Found</h1>
        <Link href="/products" className="text-xs uppercase underline">Back to catalog</Link>
      </div>
    );
  }

  const displayName = formatTitleCase(product.name);
  const activeImages =
    product.images && product.images.length > 0 ? product.images : ['/belt-macro.png'];

  // SEO, AEO & GEO Structured Data (XSS-Safe JSON stringify with </script> escaping)
  const productJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: displayName,
        image: activeImages,
        description: product.description,
        category: product.category,
        brand: { '@type': 'Brand', name: 'HIDEWOOD' },
        manufacturer: {
          '@type': 'Organization',
          name: 'HIDEWOOD Kanpur Atelier',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kanpur',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating,
          reviewCount: reviewsList.length,
        },
        offers: {
          '@type': 'Offer',
          url: `https://hidewood.in/products/${product.slug}`,
          priceCurrency: 'INR',
          price: product.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hidewood.in' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://hidewood.in/products' },
          { '@type': 'ListItem', position: 3, name: displayName, item: `https://hidewood.in/products/${product.slug}` },
        ],
      },
    ],
  }).replace(/<\/script>/g, '<\\/script>');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />

      <div className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-20 sm:pt-24 pb-16 sm:pb-24">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb Navigation"
          className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 border-b border-black/10"
        >
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-wider">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 py-1 text-neutral-600 hover:text-black transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Products</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span className="hidden sm:inline">Catalog</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-black font-semibold">{product.category}</span>
            </div>
          </div>
        </nav>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 items-start">
            
            {/* LEFT: IMAGES GALLERY */}
            <div className="lg:col-span-7 w-full">
              {/* Mobile Carousel */}
              <div className="block lg:hidden w-full mb-3">
                <div className="relative aspect-square w-full bg-white border border-black/10 overflow-hidden">
                  <motion.img
                    key={activeMobileImage}
                    src={activeImages[activeMobileImage] || activeImages[0]}
                    alt={`${displayName} image ${activeMobileImage + 1}`}
                    initial={{ x: '-101%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover will-change-transform"
                  />

                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase px-2.5 py-0.5">
                    0{activeMobileImage + 1} / 0{activeImages.length}
                  </div>

                  <button
                    type="button"
                    onClick={toggleMainFavorite}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xs cursor-pointer"
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-red-600 text-red-600' : 'text-neutral-800'
                      }`}
                    />
                  </button>
                </div>

                {activeImages.length > 1 && (
                  <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {activeImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveMobileImage(idx)}
                        className={`relative w-16 h-16 shrink-0 border overflow-hidden bg-white transition-all ${
                          activeMobileImage === idx
                            ? 'border-black ring-1 ring-black'
                            : 'border-black/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Vertical Gallery */}
              <div className="hidden lg:flex flex-col gap-7">
                {activeImages.map((img, idx) => (
                  <DesktopGalleryShot
                    key={idx}
                    src={img}
                    alt={`${displayName} view ${idx + 1}`}
                    index={idx}
                    total={activeImages.length}
                  />
                ))}
              </div>

              {/* Craft & Material Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 border-t border-black/10 font-mono text-[10px] mt-6">
                <div className="p-3.5 border border-black/10 bg-white">
                  <div className="text-neutral-400 uppercase text-[9px]">Leather</div>
                  <div className="font-semibold text-black mt-1">100% Full-Grain</div>
                </div>
                <div className="p-3.5 border border-black/10 bg-white">
                  <div className="text-neutral-400 uppercase text-[9px]">Construction</div>
                  <div className="font-semibold text-black mt-1">Zero Fillers</div>
                </div>
                <div className="p-3.5 border border-black/10 bg-white">
                  <div className="text-neutral-400 uppercase text-[9px]">Hardware</div>
                  <div className="font-semibold text-black mt-1">Solid Cast Brass</div>
                </div>
                <div className="p-3.5 border border-black/10 bg-white">
                  <div className="text-neutral-400 uppercase text-[9px]">Origin</div>
                  <div className="font-semibold text-black mt-1">Kanpur, India</div>
                </div>
              </div>
            </div>

            {/* RIGHT: CLEAN EDITORIAL DETAILS & BUYING PANEL */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col">
              {/* Top Meta & Stock */}
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-black/10 font-mono text-[10px] uppercase tracking-wider">
                <span className="px-2 py-0.5 bg-black text-white font-semibold">
                  {product.isNewArrival ? 'New Arrival' : (product.badge || 'Handcrafted')}
                </span>

                <div className="flex items-center gap-4">
                  {product.inStock ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Sold Out</span>
                  )}

                  <button
                    type="button"
                    onClick={toggleMainFavorite}
                    className="hidden sm:inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isFav ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Refined Title (Clean Title Case, Balanced Weight, Generous Line-Height) */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight text-neutral-900 leading-[1.18] mb-3 font-sans">
                {displayName}
              </h1>

              {/* Rating Summary Link */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5 text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                  ))}
                </div>
                <span className="text-xs font-mono font-semibold text-black">{averageRating}</span>
                <span className="text-neutral-300">&bull;</span>
                <a
                  href="#reviews-section"
                  className="text-xs font-mono text-neutral-600 hover:text-black underline underline-offset-4"
                >
                  {reviewsList.length} Verified Reviews
                </a>
              </div>

              {/* Price & Offer Block */}
              <div className="flex items-baseline flex-wrap gap-3 pb-6 mb-6 border-b border-black/10">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-black tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-sm font-mono text-neutral-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
                <span className="text-[11px] font-mono text-neutral-500 ml-auto">
                  Incl. GST &bull; Free Shipping
                </span>
              </div>

              {/* Product Description with Clean Spacing */}
              <div className="mb-7">
                <h2 className="text-[10px] font-mono uppercase text-neutral-400 tracking-widest mb-2 font-semibold">
                  About This Piece
                </h2>
                <p className="text-sm text-neutral-700 font-sans leading-[1.7] tracking-normal">
                  {product.description ||
                    'Handcrafted from 100% genuine full-grain leather in our Kanpur workshop. Built with solid cast brass hardware and waxed thread stitching for decades of daily wear.'}
                </p>
              </div>

              {/* Color Variations */}
              {product.hasColors && product.colors && product.colors.length > 0 && (
                <div className="p-4 border border-black/10 bg-white mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-neutral-900">
                      Finish: <span className="font-normal text-neutral-600">{selectedColor}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.colors.map((col) => {
                      const isChosen = selectedColor === col.name;
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col.name)}
                          title={col.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                            isChosen ? 'border-black scale-110' : 'border-transparent hover:scale-105'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/15 block"
                            style={{ backgroundColor: col.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection + Size Guide */}
              <div className="p-4 sm:p-5 border border-black/15 bg-white mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-xs text-neutral-900 uppercase tracking-wider font-mono">
                    Select Size (Inches)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-600 hover:text-black underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="mb-3.5 p-3 bg-[#F8F8F6] border border-black/10 text-[11px] font-mono text-neutral-700 leading-relaxed">
                    Order <strong>2 inches larger</strong> than your trouser waist size (e.g., if your pant waist is 32&quot;, select size 34&quot;).
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {(product.sizes && product.sizes.length > 0 ? product.sizes : ['30', '32', '34', '36', '38']).map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`h-10 min-w-[48px] px-3.5 border text-xs font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-800 border-black/15 hover:border-black'
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
                <div className="flex flex-col gap-3 mb-7">
                  <div className="flex items-center justify-between border border-black/15 bg-white px-4 py-2.5 w-full">
                    <span className="font-mono text-xs uppercase font-medium text-neutral-600">Quantity</span>
                    <div className="flex items-center gap-5">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-neutral-100 rounded-xs cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-semibold w-4 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:bg-neutral-100 rounded-xs cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full bg-white text-black border border-black hover:bg-neutral-100 py-3.5 px-5 text-xs uppercase font-mono font-semibold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 px-5 text-xs uppercase font-mono font-semibold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Buy Now &bull; ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-neutral-300 bg-neutral-200/70 p-4 text-center mb-7">
                  <span className="text-black text-xs uppercase font-semibold tracking-widest block font-mono">
                    Currently Out of Stock
                  </span>
                </div>
              )}

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-3 gap-2 py-4 mb-6 border-y border-black/10 text-center font-mono text-[10px] text-neutral-600">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-4 h-4 text-black" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 border-x border-black/10 px-1">
                  <RefreshCw className="w-4 h-4 text-black" />
                  <span>14-Day Size Exchange</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Lifetime Warranty</span>
                </div>
              </div>

              {/* Clean Accordion Panels */}
              <div className="divide-y divide-black/10 border-b border-black/10 font-mono text-xs">
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedAccordion(expandedAccordion === 'specs' ? null : 'specs')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase text-neutral-900 cursor-pointer"
                  >
                    <span>01 // Specifications &amp; Craft</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedAccordion === 'specs' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccordion === 'specs' && (
                    <div className="pb-4 space-y-2 text-xs text-neutral-600 font-sans leading-relaxed">
                      <div><strong className="text-black font-medium">Build:</strong> {product.spec}</div>
                      <div><strong className="text-black font-medium">Category:</strong> {product.category}{product.subCategory ? ` — ${product.subCategory}` : ''}</div>
                      <div><strong className="text-black font-medium">Personalization:</strong> Complimentary custom name initials available at checkout.</div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedAccordion(expandedAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full py-3.5 flex items-center justify-between text-left font-semibold uppercase text-neutral-900 cursor-pointer"
                  >
                    <span>02 // Shipping &amp; Returns</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccordion === 'shipping' && (
                    <div className="pb-4 text-xs text-neutral-600 leading-relaxed font-sans">
                      Dispatched within 24–48 hours from Kanpur via BlueDart &amp; Delhivery Express air courier. Includes 14-day hassle-free size exchange on unworn pieces.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section
          id="reviews-section"
          className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 mt-16 sm:mt-24 border-t border-black/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-black">
                  Customer Reviews ({reviewsList.length})
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Rated {averageRating} / 5.0 by verified buyers across India
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="self-start sm:self-auto py-2.5 px-4 bg-black text-white text-xs font-mono uppercase font-semibold tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 bg-white border border-black/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                  </div>

                  <h3 className="font-semibold text-sm text-black mb-1.5">{rev.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">{rev.comment}</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2.5 mt-4">
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

                <div className="pt-3.5 mt-4 border-t border-black/5 flex items-center justify-between font-mono text-[11px] text-neutral-500">
                  <span className="font-semibold text-black">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* YOU MAY ALSO LIKE SECTION */}
        {relatedProducts.length > 0 && (
          <section
            aria-label="You May Also Like"
            className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 mt-16 sm:mt-24 border-t border-black/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-7 sm:mb-9 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-black">
                  You May Also Like
                </h2>
              </div>

              <Link
                href="/products"
                className="font-mono text-xs uppercase font-semibold text-neutral-700 hover:text-black inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>Explore Full Collection</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
              {relatedProducts.map((relProd) => (
                <RelatedProductCard key={relProd.slug || relProd.id} prod={relProd} />
              ))}
            </div>
          </section>
        )}

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
                  <h3 className="font-semibold text-base tracking-tight text-black">
                    Write a Product Review
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="p-1 hover:bg-neutral-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1.5 font-semibold">
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
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Rohit V."
                      className="w-full border border-black/20 p-2.5 text-xs font-sans focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Great leather thickness and brass buckle"
                      className="w-full border border-black/20 p-2.5 text-xs font-sans focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                      Your Experience
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={800}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts on leather quality, fit, and finish..."
                      className="w-full border border-black/20 p-2.5 text-xs font-sans focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1 font-semibold">
                      Add Photo (Optional)
                    </label>
                    <label className="flex items-center gap-2 p-2.5 border border-dashed border-black/20 hover:border-black cursor-pointer bg-neutral-50">
                      <Camera className="w-4 h-4 text-neutral-600" />
                      <span className="text-xs text-neutral-600">Upload a photo (Max 5MB)</span>
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
                          className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white uppercase text-xs font-mono font-semibold tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}