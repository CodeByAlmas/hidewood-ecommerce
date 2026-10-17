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

const BRAND_LETTERS = ['H', 'I', 'D', 'E', 'W', 'O', 'O', 'D'];

function ShutterCurtain() {
  const { isNavigating } = useAtelierTransition();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-50 bg-[#090909] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <div className="flex items-center overflow-hidden">
            {BRAND_LETTERS.map((char, index) => (
              <div key={index} className="overflow-hidden inline-block px-[2px]">
                <motion.span
                  initial={{ y: '120%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-120%', opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 + index * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block text-white text-4xl sm:text-7xl font-black uppercase tracking-tight font-sans leading-none"
                >
                  {char}
                </motion.span>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, delay: 0.28 }}
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

      // URL extraction check: Sirf real destination path pick karega
      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Ignore hash anchors (#hero, #archive), downloads, and external links
      if (
        rawHref.startsWith('#') ||
        rawHref.startsWith('/#') ||
        anchor.hasAttribute('download') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      // Check if internal route
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