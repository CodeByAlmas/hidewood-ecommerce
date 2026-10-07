'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Global Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
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

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) =>
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
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const totalBagCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#090909] text-[#111111]`}
    >
      <body className="min-h-full m-0 p-0 overflow-x-hidden bg-[#F8F8F6] flex flex-col justify-between">
        
        {/* PAGE TRANSITION ON ROUTE CHANGE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center pointer-events-none"
          >
            <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tighter font-sans">
              HIDEWOOD
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* GLOBAL NAVBAR */}
        <Navbar
          bagCount={totalBagCount}
          onOpenBag={() => setIsCartOpen(true)}
          onNavigate={(sectionId) => {
            const target = document.getElementById(sectionId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* GLOBAL CART DRAWER */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            alert('Initializing bespoke Stripe / Apple Pay / UPI checkout...');
          }}
        />

        {/* PAGE CONTENT */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <Footer />

      </body>
    </html>
  );
}