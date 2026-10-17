'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowUpRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { TextRoll } from './Navbar';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/hooks/useCartHydrated';

export default function CartDrawer() {
  const router = useRouter();
  const isHydrated = useCartHydrated();

  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  // ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const activeItems = isHydrated ? items : [];
  const subtotal = isHydrated ? getSubtotal() : 0;
  const totalCount = isHydrated ? getTotalItems() : 0;

  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* SLIDE-OVER DRAWER */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-[#F8F8F6] text-[#111111] h-full flex flex-col justify-between border-l border-black/15 shadow-2xl z-10"
          >
            {/* 1. DRAWER HEADER */}
            <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <h2 className="text-xs uppercase tracking-widest font-black font-sans text-black">
                  Atelier Dispatch Bag ({totalCount})
                </h2>
              </div>

              <button
                onClick={closeCart}
                className="p-2 border border-black/10 hover:border-black hover:bg-neutral-100 transition-colors cursor-pointer group"
                aria-label="Close Bag"
              >
                <X className="w-4 h-4 text-black group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* 2. FREE EXPEDITED COURIER PROGRESS BAR */}
            <div className="px-5 sm:px-6 py-3.5 bg-neutral-100 border-b border-black/10 font-mono">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-600 mb-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-black" />
                  {subtotal >= freeShippingThreshold ? (
                    <span className="font-bold text-black uppercase">
                      Complimentary Air Express Unlocked
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-black font-bold">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> for Free Air Shipping
                    </span>
                  )}
                </span>
                <span className="font-bold text-black">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1 bg-black/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-black"
                />
              </div>
            </div>

            {/* 3. CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-black/10">
              {activeItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                  <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-neutral-300" />
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    Your bag is empty
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-[220px]">
                    No handcrafted pieces commissioned yet.
                  </p>
                </div>
              ) : (
                activeItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="pt-4 first:pt-0 flex gap-4">
                    {/* THUMBNAIL */}
                    <div className="relative w-20 h-24 sm:w-22 sm:h-26 bg-neutral-200 border border-black/10 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                    </div>

                    {/* ITEM DATA */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block">
                              {item.category}
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-tight text-black">
                              {item.name}
                            </h3>
                          </div>
                          <span className="text-xs font-mono font-bold text-black">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {item.size && (
                          <div className="mt-1 inline-block border border-black/15 bg-white px-2 py-0.5 text-[10px] font-mono text-neutral-600">
                            Fit: <span className="font-bold text-black">{item.size}</span>
                          </div>
                        )}
                      </div>

                      {/* QUANTITY TOGGLES & REMOVE */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-black/20 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="p-1.5 hover:bg-neutral-100 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-black" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="p-1.5 hover:bg-neutral-100 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-black" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 hover:text-black transition-colors cursor-pointer underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 4. FOOTER / CHECKOUT BAR */}
            {activeItems.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-black/10 bg-white space-y-4">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-neutral-500">
                    <span>Atelier Subtotal</span>
                    <span className="font-bold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Express Dispatch</span>
                    <span className="font-semibold text-black">
                      {subtotal >= freeShippingThreshold ? 'Complimentary' : '₹450'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-black/10 flex justify-between text-sm font-sans font-black text-black">
                    <span className="uppercase tracking-tight">Total Valuation</span>
                    <span className="font-mono text-red-600">
                      ₹{(subtotal >= freeShippingThreshold ? subtotal : subtotal + 450).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-neutral-50 border border-black/10 text-[10px] text-neutral-600 font-mono">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Backed by HIDEWOOD 100-Year Heritage Guarantee</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="group w-full bg-black text-white py-4 px-6 text-xs uppercase font-bold tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <TextRoll className="text-white font-bold">
                    Proceed to Bespoke Checkout
                  </TextRoll>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:rotate-45 group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}