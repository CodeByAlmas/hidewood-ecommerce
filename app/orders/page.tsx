'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  Truck,
  Loader2,
  PackageOpen,
} from 'lucide-react';

interface OrderItemRecord {
  id: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderRecord {
  id: string;
  createdAt: string;
  status: string;
  courier?: string;
  trackingNumber?: string;
  totalAmount: number;
  items: OrderItemRecord[];
}

function PatronKeyCard({ patronEmail }: { patronEmail: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full flex items-center justify-center my-6 select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full max-w-[540px] aspect-[1.7/1] border-2 border-black bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
        />

        <div className="flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-widest text-neutral-300 font-bold">
              VERIFIED BUYER CARD
            </span>
          </div>
          <span className="border border-white/20 px-2 py-0.5 uppercase tracking-wider text-[9px]">
            100% PURE LEATHER
          </span>
        </div>

        <div className="z-10">
          <div className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none mb-1 font-sans">
            HIDEWOOD
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest truncate">
            {patronEmail}
          </div>
        </div>

        <div className="flex items-end justify-between z-10 border-t border-white/10 pt-4 font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase">
          <div>
            <span className="block text-neutral-500 text-[8px]">// VERIFICATION</span>
            <span className="text-white font-bold">GENUINE WORKSHOP ORDER</span>
          </div>
          <div className="text-right">
            <span className="block text-neutral-500 text-[8px]">// GUARANTEE</span>
            <span className="text-white font-bold">LIFETIME WARRANTY</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrdersArchivePage() {
  const router = useRouter();
  const [patronEmail, setPatronEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Fetch real authenticated customer orders
  const fetchCustomerOrders = async (emailToFetch: string) => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(emailToFetch)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('hidewood_session_email');
      if (activeEmail) {
        setPatronEmail(activeEmail);
        setIsAuthenticated(true);
        fetchCustomerOrders(activeEmail);
      }
    }
  }, []);

  const sanitize = (val: string) => val.replace(/[<>'"/]/g, '').trim();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitize(patronEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    setAuthError('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('hidewood_session_email', cleanEmail);
    }
    setIsAuthenticated(true);
    fetchCustomerOrders(cleanEmail);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hidewood_session_email');
    }
    setIsAuthenticated(false);
    setPatronEmail('');
    setOrders([]);
    router.push('/login');
  };

  const displayedOrders = useMemo(() => {
    if (!filterQuery) return orders;
    const q = filterQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((item) => item.name.toLowerCase().includes(q))
    );
  }, [orders, filterQuery]);

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
      {/* TOP BREADCRUMB */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-neutral-400">
            <span>CUSTOMER ACCOUNT</span>
            <span>&bull;</span>
            <span className="text-black font-bold">ORDER TRACKING</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        {!isAuthenticated ? (
          <section className="max-w-xl mx-auto py-10 sm:py-16">
            <div className="border-2 border-black bg-white p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>Secure Order Lookup</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none mb-3 font-sans">
                TRACK YOUR ORDER
              </h1>

              <p className="font-mono text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
                Enter the email address you used during checkout to view your order history and live delivery tracking.
              </p>

              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-black font-bold mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patronEmail}
                    onChange={(e) => setPatronEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>

                {authError && (
                  <p className="font-mono text-[11px] text-red-600 font-bold">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-neutral-800 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>View My Orders</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="space-y-12">
            {/* Header Banner */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/10">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Logged In As {patronEmail}</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none font-sans">
                  MY ORDERS
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search by Order ID or item..."
                    className="bg-white border border-black/20 focus:border-black pl-8 pr-4 py-2 text-xs font-mono focus:outline-none w-full sm:w-64"
                  />
                </div>

                <button
                  onClick={handleLogout}
                  className="border border-black px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* 3D Customer Member Card */}
            <PatronKeyCard patronEmail={patronEmail} />

            {/* Orders History List */}
            <div className="space-y-8">
              {isLoadingOrders ? (
                <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-neutral-400">
                  <Loader2 className="w-6 h-6 animate-spin text-black mb-2" />
                  <span>Loading your orders securely...</span>
                </div>
              ) : displayedOrders.length === 0 ? (
                <div className="border border-black/10 bg-white p-12 text-center font-mono">
                  <PackageOpen className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs uppercase text-neutral-600 font-bold">
                    No orders found for this account.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block bg-black text-white px-6 py-2.5 text-xs font-bold uppercase"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                displayedOrders.map((order) => (
                  <article
                    key={order.id}
                    className="border border-black bg-white p-6 sm:p-8 lg:p-10 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-black/10 font-mono text-xs uppercase">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-black text-sm">
                          ORDER #{order.id}
                        </span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-neutral-400">&bull;</span>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold ${
                            order.status === 'DELIVERED'
                              ? 'bg-black text-white'
                              : 'bg-red-600 text-white animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <Link
                        href={`/order/success?orderId=${order.id}`}
                        className="font-bold text-black hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>View Order Invoice</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Items Row */}
                    <div className="divide-y divide-black/5 mb-8">
                      {order.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || '/belt-macro.png'}
                              alt={item.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-black/10 bg-neutral-100 shrink-0"
                            />
                            <div>
                              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black font-sans">
                                {item.name}
                              </h3>
                              <p className="font-mono text-[10px] text-neutral-600">
                                Size: {item.size || 'Standard'}&quot; • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="font-mono text-xs font-bold text-red-600 sm:text-right shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live Tracking Delivery Bar */}
                    <div className="bg-[#F8F8F6] p-4 sm:p-5 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px]">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-black shrink-0" />
                        <div>
                          <span className="text-[9px] uppercase text-neutral-400 block">
                            COURIER: {order.courier || 'BlueDart Express Air'}
                          </span>
                          <span className="font-bold text-black uppercase">
                            TRACKING NO: {order.trackingNumber || 'Awaiting Shipment Tag'}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right border-l border-black/10 pl-4">
                        <span className="text-[9px] uppercase text-neutral-400 block">
                          TOTAL AMOUNT
                        </span>
                        <span className="font-bold text-black text-sm">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}