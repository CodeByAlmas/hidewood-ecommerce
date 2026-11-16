'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { TransitionProvider, useAtelierTransition } from '@/context/TransitionContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Non-linear staggered entry & exit timings matching the reference video rhythm
const SHUTTER_LETTERS = [
  { char: 'H', enterDelay: 0.14, exitDelay: 0.14 },
  { char: 'I', enterDelay: 0.26, exitDelay: 0.04 },
  { char: 'D', enterDelay: 0.18, exitDelay: 0.18 },
  { char: 'E', enterDelay: 0.30, exitDelay: 0.08 },
  { char: 'W', enterDelay: 0.16, exitDelay: 0.12 },
  { char: 'O', enterDelay: 0.24, exitDelay: 0.02 },
  { char: 'O', enterDelay: 0.20, exitDelay: 0.16 },
  { char: 'D', enterDelay: 0.28, exitDelay: 0.06 },
];

const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const LETTER_ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LETTER_EXIT_EASE: [number, number, number, number] = [0.7, 0, 0.3, 1];

function ShutterCurtain() {
  const { isNavigating } = useAtelierTransition();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Navigating page"
          initial={{ y: '100%' }}
          animate={{
            y: '0%',
            transition: { duration: 0.55, ease: CURTAIN_EASE },
          }}
          exit={{
            y: '-100%',
            transition: { duration: 0.55, delay: 0.18, ease: CURTAIN_EASE },
          }}
          className="fixed inset-0 z-[90] bg-[#090909] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden will-change-transform"
        >
          <div className="flex items-center justify-center">
            {SHUTTER_LETTERS.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden inline-block py-1 px-[1px] sm:px-[2px]"
              >
                <motion.span
                  initial={{ y: '115%' }}
                  animate={{
                    y: '0%',
                    transition: {
                      duration: 0.48,
                      delay: item.enterDelay,
                      ease: LETTER_ENTER_EASE,
                    },
                  }}
                  exit={{
                    y: '-115%',
                    transition: {
                      duration: 0.36,
                      delay: item.exitDelay,
                      ease: LETTER_EXIT_EASE,
                    },
                  }}
                  className="inline-block text-white text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter font-sans leading-none will-change-transform"
                >
                  {item.char}
                </motion.span>
              </div>
            ))}

            {/* Trade Mark (TM) Symbol */}
            <div className="overflow-hidden inline-block self-start mt-1 ml-0.5 sm:ml-1">
              <motion.span
                initial={{ y: '115%' }}
                animate={{
                  y: '0%',
                  transition: {
                    duration: 0.42,
                    delay: 0.32,
                    ease: LETTER_ENTER_EASE,
                  },
                }}
                exit={{
                  y: '-115%',
                  transition: {
                    duration: 0.3,
                    delay: 0.10,
                    ease: LETTER_EXIT_EASE,
                  },
                }}
                className="inline-block text-white text-[10px] sm:text-xs md:text-sm font-sans font-bold"
              >
                &trade;
              </motion.span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 0.55,
              y: 0,
              transition: { duration: 0.35, delay: 0.32, ease: LETTER_ENTER_EASE },
            }}
            exit={{
              opacity: 0,
              y: -8,
              transition: { duration: 0.22, ease: LETTER_EXIT_EASE },
            }}
            className="mt-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-neutral-400"
          >
            KANPUR ATELIER &bull; ARCHIVAL DISPATCH
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GlobalLinkInterceptor({ children }: { children: React.ReactNode }) {
  const { navigateTo } = useAtelierTransition();

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      if (
        rawHref.startsWith('#') ||
        rawHref.startsWith('/#') ||
        anchor.hasAttribute('download') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      const destination = anchor.pathname || rawHref;
      if (destination.startsWith('/')) {
        e.preventDefault();
        e.stopPropagation();
        navigateTo(destination);
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [navigateTo]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isHydrated = useCartHydrated();

  const storeItems = useCartStore((state) => state.items);
  const isStoreOpen = useCartStore((state) => state.isOpen);
  const openStoreCart = useCartStore((state) => state.openCart);
  const closeStoreCart = useCartStore((state) => state.closeCart);
  const updateStoreQty = useCartStore((state) => state.updateQuantity);
  const removeStoreItem = useCartStore((state) => state.removeItem);
  const totalStoreCount = useCartStore((state) => state.getTotalItems());

  const [localCartOpen, setLocalCartOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([
    {
      id: 'hw-01',
      name: 'The Bridle Edition',
      price: 5499,
      size: '34',
      quantity: 1,
      image: '/belt-macro.png',
      category: 'Full-Grain 38mm',
    },
  ]);

  useEffect(() => {
    if (isHydrated && storeItems.length === 0 && localCartItems.length > 0) {
      localCartItems.forEach((item) => {
        useCartStore.getState().addItem(item);
      });
    }
  }, [isHydrated]);

  const activeCartOpen = isHydrated ? isStoreOpen : localCartOpen;
  const activeCartItems = isHydrated && storeItems.length > 0 ? storeItems : localCartItems;
  const activeBagCount = isHydrated ? totalStoreCount : localCartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleOpenBag = () => {
    setLocalCartOpen(true);
    openStoreCart();
  };

  const handleCloseBag = () => {
    setLocalCartOpen(false);
    closeStoreCart();
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    updateStoreQty(id, size, delta);
    setLocalCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string, size: string) => {
    removeStoreItem(id, size);
    setLocalCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const handleCheckout = () => {
    handleCloseBag();
    router.push('/cart');
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#090909] text-[#111111]`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#F8F8F6" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body className="min-h-full m-0 p-0 overflow-x-hidden bg-[#F8F8F6] flex flex-col justify-between selection:bg-black selection:text-white">
        <TransitionProvider>
          <GlobalLinkInterceptor>
            {/* 1. KINETIC SHUTTER CURTAIN */}
            <ShutterCurtain />

            {/* 2. GLOBAL NAVBAR */}
            <Navbar
              bagCount={activeBagCount}
              onOpenBag={handleOpenBag}
              onNavigate={(sectionId) => {
                const target = document.getElementById(sectionId);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                } else {
                  router.push(`/#${sectionId}`);
                }
              }}
            />

            {/* 3. GLOBAL CART DRAWER */}
            <CartDrawer
              isOpen={activeCartOpen}
              onClose={handleCloseBag}
              items={activeCartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />

            {/* 4. PAGE CONTENT */}
            <div className="flex-1 w-full flex flex-col">
              {children}
            </div>

            {/* 5. GLOBAL FOOTER */}
            <Footer />
          </GlobalLinkInterceptor>
        </TransitionProvider>
      </body>
    </html>
  );
}