'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowUpRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { TextRoll } from './Navbar';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemoveItem: (id: string, size: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  // ESC key to close drawer & lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
  }, [isOpen, onClose]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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
            onClick={onClose}
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
                  Atelier Dispatch Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
              </div>

              <button
                onClick={onClose}
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
                      Complimentary Global Courier Unlocked
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-black font-bold">${freeShippingThreshold - subtotal}.00</strong> for Free Global Shipping
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
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
                  <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-neutral-300" />
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    Your bag is empty
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-[220px]">
                    No handcrafted items commissioned yet.
                  </p>
                </div>
              ) : (
                items.map((item) => (
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
                            ${item.price * item.quantity}.00
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
                            onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                            className="p-1.5 hover:bg-neutral-100 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-black" />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                            className="p-1.5 hover:bg-neutral-100 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-black" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id, item.size)}
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
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-black/10 bg-white space-y-4">
                {/* SUB-TOTAL BREAKDOWN */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-neutral-500">
                    <span>Atelier Subtotal</span>
                    <span className="font-bold text-black">${subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Express Dispatch</span>
                    <span className="font-semibold text-black">
                      {subtotal >= freeShippingThreshold ? 'Complimentary' : '$15.00'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-black/10 flex justify-between text-sm font-sans font-black text-black">
                    <span className="uppercase tracking-tight">Total Valuation</span>
                    <span className="font-mono">
                      ${subtotal >= freeShippingThreshold ? subtotal : subtotal + 15}.00
                    </span>
                  </div>
                </div>

                {/* TRUST BADGE PILL */}
                <div className="flex items-center gap-2 p-2.5 bg-neutral-50 border border-black/10 text-[10px] text-neutral-600 font-mono">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Backed by HIDEWOOD 100-Year Heritage Guarantee</span>
                </div>

                {/* CHECKOUT BUTTON WITH ROTATING 90° ARROW */}
                <button
                  onClick={onCheckout}
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