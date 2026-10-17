'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Trash2,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCartHydrated } from '@/hooks/useCartHydrated';

export default function CheckoutCartPage() {
  const isHydrated = useCartHydrated();
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping & Patron Form State
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const activeItems = isHydrated ? items : [];
  const subtotal = isHydrated ? getSubtotal() : 0;
  const totalCount = isHydrated ? getTotalItems() : 0;
  const shippingCost = subtotal >= 5000 || activeItems.length === 0 ? 0 : 450;
  const grandTotal = subtotal + shippingCost;

  const sanitize = (val: string) => val.replace(/[<>]/g, '').trim();

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItems.length === 0) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const payload = {
        customerEmail: sanitize(customerEmail),
        shippingDetails: {
          name: sanitize(customerName),
          phone: sanitize(customerPhone),
          address: sanitize(addressLine),
          city: sanitize(city),
          postalCode: sanitize(postalCode),
        },
        items: activeItems.map((i) => ({
          productId: i.id,
          size: i.size,
          quantity: i.quantity,
          width: '38mm',
          buckle: 'Solid Sand-Cast Brass',
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server rejected checkout transaction.');
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        window.location.href = `/order/success?orderId=HW-${Math.floor(100000 + Math.random() * 900000)}`;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Payment initiation failed. Please verify connection.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
      {/* TOP BREADCRUMB */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalogue</span>
          </Link>

          <div className="flex items-center gap-2 text-neutral-400">
            <span>DISPATCH BAG</span>
            <span>&bull;</span>
            <span className="text-black font-bold">{totalCount} ARTIFACTS</span>
          </div>
        </div>
      </section>

      {/* HERO TITLE */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Bespoke Order Valuation</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none font-sans">
              COMMISSION REVIEW
            </h1>
          </div>

          <p className="font-mono text-xs text-neutral-500 max-w-sm">
            Hand-cut to order at the Kanpur bench. Complimentary express air shipping on orders above ₹5,000.
          </p>
        </div>
      </section>

      {/* MAIN SPLIT VIEW */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        {activeItems.length === 0 && isHydrated ? (
          <div className="border border-black bg-white p-12 sm:p-20 text-center font-mono max-w-2xl mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 stroke-[1] mx-auto mb-4 text-neutral-400" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-black mb-2">
              YOUR DISPATCH BAG IS EMPTY
            </h2>
            <p className="text-xs text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
              No heirloom steerhide pieces or bespoke wallets have been commissioned yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white hover:bg-neutral-800 px-8 py-3.5 text-xs uppercase font-bold tracking-widest transition-colors font-mono"
            >
              <span>Browse Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT: CART ITEMS LIST (7 COLS) */}
            <div className="lg:col-span-7 border border-black bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/10 font-mono text-xs uppercase font-bold">
                <span>01 // COMMISSIONED PIECES</span>
                <span className="text-neutral-400">LOT #402 TUSCAN HIDE</span>
              </div>

              <div className="divide-y divide-black/10">
                {activeItems.map((item) => (
                  <article
                    key={`${item.id}-${item.size}`}
                    className="py-6 first:pt-2 last:pb-2 flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 sm:w-24 sm:h-28 object-cover grayscale contrast-125 border border-black/10 bg-neutral-100 shrink-0"
                      />
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black font-sans">
                          {item.name}
                        </h3>

                        {item.size && (
                          <div className="mt-1.5 inline-block border border-black/15 bg-[#F8F8F6] px-2 py-0.5 text-[10px] font-mono text-neutral-700">
                            Waist Fit: <strong className="text-black">{item.size}</strong> (+2&quot; Rule Applied)
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center border border-black/20 bg-white">
                            <button
                              type="button"
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
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="p-1.5 hover:bg-neutral-100 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 text-black" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-sm font-bold text-red-600 sm:text-right shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </article>
                ))}
              </div>

              <div className="p-4 bg-[#F8F8F6] border border-black/10 font-mono text-xs">
                <div className="flex items-center gap-2 mb-1 font-bold text-black uppercase">
                  <Truck className="w-4 h-4" />
                  <span>
                    {subtotal >= 5000
                      ? 'Complimentary Express Air Courier Unlocked'
                      : `Add ₹${(5000 - subtotal).toLocaleString('en-IN')} more for free courier`}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Dispatched in cedarwood shaving boxes with tracking waybill directly to your door.
                </p>
              </div>
            </div>

            {/* RIGHT: PATRON DISPATCH DETAILS & TOTAL (5 COLS) */}
            <div className="lg:col-span-5 border border-black bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/10 font-mono text-xs uppercase font-bold">
                <span>02 // PATRON DISPATCH DOSSIER</span>
                <Lock className="w-3.5 h-3.5 text-black" />
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Almas Siddiqui"
                    className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="patron@domain.com"
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                    Dispatch Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Apartment, Street address..."
                    className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kanpur / Mumbai"
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="208010"
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* VALUATION BREAKDOWN */}
                <div className="border-t border-black/10 pt-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Atelier Subtotal</span>
                    <span className="font-bold text-black">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Express Air Courier</span>
                    <span className="font-bold text-black">
                      {shippingCost === 0 ? 'Complimentary' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>GST (Included)</span>
                    <span className="font-bold text-black">₹0 (Net Valuation)</span>
                  </div>
                  <div className="pt-3 border-t border-black/15 flex justify-between text-base font-bold text-black font-sans">
                    <span className="uppercase">Final Valuation</span>
                    <span className="font-mono text-red-600">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="font-mono text-[11px] text-red-600 font-bold">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black text-white hover:bg-neutral-800 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing ? 'Connecting Gateway...' : 'Authorize Secure Checkout'}
                  </span>
                </button>

                <div className="pt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>256-Bit Encrypted &bull; 100-Year Structural Integrity Warranty</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}