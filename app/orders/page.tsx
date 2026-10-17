'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  Package,
  Clock,
  ExternalLink,
  Lock,
  LogOut,
  Sparkles,
  Award,
  ChevronRight,
  Plane,
} from 'lucide-react';

interface OrderRecord {
  id: string;
  date: string;
  status: 'BENCH_CRAFTING' | 'CEDAR_SEALED' | 'IN_TRANSIT' | 'DELIVERED';
  courier: string;
  trackingNumber: string;
  items: {
    name: string;
    category: string;
    spec: string;
    waistSize?: string;
    monogram?: string;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  deliveryEstimate: string;
}

const SAMPLE_ARCHIVE_ORDERS: OrderRecord[] = [
  {
    id: 'HW-894210',
    date: 'Oct 04, 2026',
    status: 'IN_TRANSIT',
    courier: 'BlueDart Air Priority Express',
    trackingNumber: 'BLU-992014-IN',
    deliveryEstimate: 'Tomorrow by 18:00 IST',
    totalAmount: 11798,
    items: [
      {
        name: 'The Bridle Edition',
        category: 'Full-Grain Steerhide 38mm',
        spec: '4.2mm Tuscan Hide • Solid Sand-Cast Brass',
        waistSize: '34',
        monogram: 'AS',
        price: 5499,
        image: '/belt-macro.png',
      },
      {
        name: 'The Onyx Dress',
        category: 'Dress Silhouette 32mm',
        spec: 'Tuscan Calfskin • Brushed Steel Hardware',
        waistSize: '34',
        price: 6299,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'HW-773120',
    date: 'Aug 18, 2026',
    status: 'DELIVERED',
    courier: 'DHL Express Verified',
    trackingNumber: 'DHL-847291-EXP',
    deliveryEstimate: 'Delivered Aug 21, 2026',
    totalAmount: 4499,
    items: [
      {
        name: 'Bespoke Folio Wallet',
        category: 'Wallets & Carry',
        spec: '6-Slot Bifold • Hand-Pressed Creased Lines',
        monogram: 'ALM',
        price: 4499,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      },
    ],
  },
];

// ========================================================
// 3D PARALLAX PATRON KEYCARD COMPONENT
// ========================================================
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
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
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
        className="w-full max-w-[540px] aspect-[1.7/1] rounded-none border-2 border-black bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer transition-shadow"
      >
        {/* Shimmer Specular Light Mesh */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
        />

        {/* Top Monogram Telemetry */}
        <div className="flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="uppercase tracking-widest text-neutral-400 font-bold">
              PATRON ARCHIVAL CIPHER
            </span>
          </div>
          <span className="border border-white/20 px-2 py-0.5 uppercase tracking-wider text-[9px]">
            SERIES 01 // LOT 402
          </span>
        </div>

        {/* Center Metal Identity */}
        <div className="z-10">
          <div className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none mb-1 font-sans">
            HIDEWOOD
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest">
            {patronEmail}
          </div>
        </div>

        {/* Bottom Bar Authenticity Protocol */}
        <div className="flex items-end justify-between z-10 border-t border-white/10 pt-4 font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase">
          <div>
            <span className="block text-neutral-500 text-[8px]">// STATUS</span>
            <span className="text-white font-bold">CERTIFIED COMMISSIONS</span>
          </div>
          <div className="text-right">
            <span className="block text-neutral-500 text-[8px]">// GUARANTEE</span>
            <span className="text-white font-bold">100 YR STRUCTURAL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ========================================================
// MAIN ARCHIVAL ORDERS PAGE
// ========================================================
export default function OrdersArchivePage() {
  const [patronEmail, setPatronEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders] = useState<OrderRecord[]>(SAMPLE_ARCHIVE_ORDERS);
  const [filterQuery, setFilterQuery] = useState('');

  // Client-side Sanitizer
  const sanitize = (val: string) => val.replace(/[<>'"/]/g, '').trim();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitize(patronEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid patron communication email.');
      return;
    }
    setAuthError('');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPatronEmail('');
  };

  // Filter Orders safely
  const displayedOrders = useMemo(() => {
    if (!filterQuery) return orders;
    const q = filterQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((item) => item.name.toLowerCase().includes(q))
    );
  }, [orders, filterQuery]);

  // AEO / SEO JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Patron Archival Order Registry | HIDEWOOD Atelier',
    description:
      'Access dispatch telemetry, courier waybills, and digital certificates of authenticity for your commissioned HIDEWOOD leather goods.',
    url: 'https://hidewood.example.com/orders',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* TOP BREADCRUMB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Archive</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>PATRON REGISTRY</span>
              <span>&bull;</span>
              <span className="text-black font-bold">KANPUR DISPATCH</span>
            </div>
          </div>
        </section>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          {!isAuthenticated ? (
            /* ========================================================
               1. PASSWORDLESS TELEMETRY AUTHENTICATION FORM
               ======================================================== */
            <section className="max-w-xl mx-auto py-10 sm:py-16">
              <div className="border-2 border-black bg-white p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                
                <div className="flex items-center gap-2 mb-3 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                  <Lock className="w-3.5 h-3.5 text-black" />
                  <span>Encrypted Patron Chamber</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none mb-3 font-sans">
                  PATRON ACCESS
                </h1>

                <p className="font-mono text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
                  Enter the email address used during your atelier commission or checkout. We will retrieve your dispatch waybills and authenticity seals.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-bold mb-1.5">
                      Patron Identification Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={patronEmail}
                      onChange={(e) => setPatronEmail(e.target.value)}
                      placeholder="patron@domain.com"
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
                    className="w-full bg-black text-white hover:bg-neutral-800 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate &amp; Retrieve Dossier</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-black/10 font-mono text-[10px] text-neutral-400 uppercase flex items-center justify-between">
                  <span>AES-256 ZERO SCRIPT TRACKING</span>
                  <span>LOT VERIFIED</span>
                </div>
              </div>
            </section>
          ) : (
            /* ========================================================
               2. AUTHENTICATED PATRON ORDER DOSSIER & 3D KEYCARD
               ======================================================== */
            <section className="space-y-12">
              
              {/* Top Header Banner */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/10">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Active Patron Session</span>
                  </div>
                  <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none font-sans">
                    ARCHIVAL LEDGER
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={filterQuery}
                      onChange={(e) => setFilterQuery(e.target.value)}
                      placeholder="Filter by Order ID / Piece..."
                      className="bg-white border border-black/20 focus:border-black pl-8 pr-4 py-2 text-xs font-mono focus:outline-none w-full sm:w-64"
                    />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="border border-black px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* 3D Interactive Patron Metal Keycard */}
              <PatronKeyCard patronEmail={patronEmail} />

              {/* Orders History List */}
              <div className="space-y-8">
                {displayedOrders.length === 0 ? (
                  <div className="border border-black/10 bg-white p-12 text-center font-mono">
                    <p className="text-xs uppercase text-neutral-500 font-bold">
                      No matching commissions found in the Kanpur registry.
                    </p>
                  </div>
                ) : (
                  displayedOrders.map((order) => (
                    <article
                      key={order.id}
                      className="border border-black bg-white p-6 sm:p-8 lg:p-10 shadow-xs transition-shadow hover:shadow-md"
                    >
                      {/* Top Ledger HUD */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-black/10 font-mono text-xs uppercase">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-black text-sm">
                            ORDER // {order.id}
                          </span>
                          <span className="text-neutral-400">&bull;</span>
                          <span className="text-neutral-500">{order.date}</span>
                          <span className="text-neutral-400">&bull;</span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold ${
                              order.status === 'DELIVERED'
                                ? 'bg-black text-white'
                                : 'bg-red-600 text-white animate-pulse'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/order/success?orderId=${order.id}`}
                            className="font-bold text-black hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Certificate of Authenticity</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
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
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover grayscale contrast-125 border border-black/10 bg-neutral-100 shrink-0"
                              />
                              <div>
                                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black font-sans">
                                  {item.name}
                                </h3>
                                <p className="font-mono text-[10px] text-neutral-500 mb-1">
                                  {item.category}
                                </p>
                                <p className="font-mono text-[10px] text-neutral-600">
                                  {item.spec}
                                  {item.waistSize && ` • Waist: ${item.waistSize}"`}
                                  {item.monogram && ` • Monogram: [${item.monogram}]`}
                                </p>
                              </div>
                            </div>

                            <div className="font-mono text-xs font-bold text-red-600 sm:text-right shrink-0">
                              ₹{item.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Live Courier Telemetry Footer */}
                      <div className="bg-[#F8F8F6] p-4 sm:p-5 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px]">
                        <div className="flex items-center gap-3">
                          <Plane className="w-4 h-4 text-black shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase text-neutral-400 block">
                              LOGISTICS WAYBILL ({order.courier})
                            </span>
                            <span className="font-bold text-black uppercase">
                              TRACKING: {order.trackingNumber}
                            </span>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[9px] uppercase text-neutral-400 block">
                            TOTAL REVENUE COMMITTED
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
    </>
  );
}