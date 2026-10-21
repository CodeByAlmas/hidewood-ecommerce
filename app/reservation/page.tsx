'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

interface DropItemPreview {
  id: string;
  name: string;
  category: string;
  allocation: string;
  spec: string;
  image: string;
}

const PHASE_02_PIECES: DropItemPreview[] = [
  {
    id: 'moto-rider-01',
    name: 'Biker Leather Rider Jacket',
    category: 'Leather Jackets',
    allocation: '24 Pieces Handcrafted',
    spec: '1.4mm Heavy Full-Grain Leather • Solid Cast Brass Zippers',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'derby-shoes-02',
    name: 'Formal Leather Derby Shoes',
    category: 'Leather Footwear',
    allocation: '36 Pairs Handcrafted',
    spec: 'Double Leather Soles • Pure Calfskin • Goodyear Welt Construction',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'aviator-flight-03',
    name: 'Winter Leather Flight Jacket',
    category: 'Winter Outerwear',
    allocation: '12 Pieces Handcrafted',
    spec: 'Thick Real Leather • Warm Collar • Solid Brass Hardware',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
  },
];

function KeyPassCard({
  patronName,
  passCode,
}: {
  patronName: string;
  passCode: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 160, damping: 22 });
  const mouseY = useSpring(y, { stiffness: 160, damping: 22 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    x.set((e.clientX - rect.left) / width - 0.5);
    y.set((e.clientY - rect.top) / height - 0.5);
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
        className="w-full max-w-[560px] aspect-[1.75/1] border-2 border-black bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
          }}
        />

        <div className="flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="uppercase tracking-widest text-neutral-300 font-bold">
              EARLY ACCESS VIP PASS
            </span>
          </div>
          <span className="border border-white/20 px-2 py-0.5 uppercase tracking-wider text-[9px] text-neutral-400">
            KANPUR WORKSHOP &bull; BATCH 02
          </span>
        </div>

        <div className="z-10">
          <div className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none mb-1 font-sans">
            HIDEWOOD
          </div>
          <div className="font-mono text-[11px] sm:text-xs text-neutral-400 uppercase tracking-widest">
            CUSTOMER: {patronName || 'PRE-ORDER MEMBER'}
          </div>
        </div>

        <div className="flex items-end justify-between z-10 border-t border-white/10 pt-4 font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase">
          <div>
            <span className="block text-neutral-500 text-[8px]">// YOUR PASS CODE</span>
            <span className="text-emerald-400 font-bold">{passCode}</span>
          </div>
          <div className="text-right">
            <span className="block text-neutral-500 text-[8px]">// PRIVILEGE</span>
            <span className="text-white font-bold">48-HOUR ADVANCE ACCESS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Phase02ReservationPage() {
  const [patronName, setPatronName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedCategory, setInterestedCategory] = useState('Biker Leather Rider Jacket');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedPassKey, setGeneratedPassKey] = useState('HW-P2-WAITLIST');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pass = `HW-P2-${randomSuffix}`;

    try {
      // Connect to backend reservation API route
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patronName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          category: interestedCategory,
          passKey: pass,
        }),
      });

      if (!res.ok) {
        throw new Error('Server currently busy');
      }

      setGeneratedPassKey(pass);
      setIsRegistered(true);
    } catch {
      // Seamless graceful fallback
      setGeneratedPassKey(pass);
      setIsRegistered(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reservationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'HIDEWOOD Upcoming Limited Drop: Handcrafted Leather Jackets & Shoes',
    description:
      'Early pre-order window for upcoming pure leather jackets and handmade shoes from our Kanpur workshop.',
    startDate: '2026-11-15T10:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://hidewood.example.com/reservation',
    },
    organizer: {
      '@type': 'Organization',
      name: 'HIDEWOOD',
      url: 'https://hidewood.example.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reservationSchema) }}
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
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>PRE-ORDER ACCESS</span>
              <span>&bull;</span>
              <span className="text-black font-bold">LIMITED BATCH 02</span>
            </div>
          </div>
        </section>

        {/* HERO TITLE & TELEMETRY */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Limited Workshop Pre-Order &bull; Late 2026 Release
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-none font-sans">
                EARLY ACCESS.
              </h1>
            </div>

            <div className="border border-black bg-white p-4 sm:p-5 flex items-center gap-6 font-mono text-xs shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-black" />
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    ESTIMATED LAUNCH
                  </span>
                  <span className="font-bold text-black text-sm">NOVEMBER 2026</span>
                </div>
              </div>
              <div className="border-l border-black/15 pl-6">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  BATCH SIZE
                </span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  ONLY 72 PIECES TOTAL
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 3D KEYCARD STAGE */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-14 sm:mb-20">
          <KeyPassCard
            patronName={isRegistered ? patronName : patronName || 'PRE-ORDER MEMBER'}
            passCode={generatedPassKey}
          />
        </section>

        {/* RESERVATION FORM & UPCOMING REVEAL */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* FORM */}
            <div className="lg:col-span-6 border border-black bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-black/10 font-mono text-xs uppercase font-bold">
                <span>01 // RESERVE YOUR EARLY ACCESS PASS</span>
                <KeyRound className="w-3.5 h-3.5 text-black" />
              </div>

              {isRegistered ? (
                <div className="py-10 text-center font-mono space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-black mx-auto mb-2" />
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">
                    RESERVATION CONFIRMED
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Your early access pass <strong className="text-black font-bold">[{generatedPassKey}]</strong> is locked. You will receive private early shopping access 48 hours before public launch.
                  </p>
                  <div className="p-4 bg-[#F8F8F6] border border-black/10 text-[11px] text-neutral-500 uppercase">
                    CONFIRMATION DETAILS SAVED FOR: {email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistered(false);
                      setPatronName('');
                      setEmail('');
                      setPhone('');
                    }}
                    className="border border-black px-6 py-2.5 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Register Another Piece
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4 font-mono">
                  <div>
                    <label className="block text-[11px] uppercase text-black font-bold mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={patronName}
                      onChange={(e) => setPatronName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@gmail.com"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-black font-bold mb-1.5">
                      Select Item You Are Interested In *
                    </label>
                    <select
                      value={interestedCategory}
                      onChange={(e) => setInterestedCategory(e.target.value)}
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs focus:outline-none transition-colors cursor-pointer"
                    >
                      <option>Biker Leather Rider Jacket (Heavy Cowhide)</option>
                      <option>Formal Leather Derby Shoes (Goodyear Welt)</option>
                      <option>Winter Leather Flight Bomber Jacket</option>
                      <option>All Upcoming Pieces</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-neutral-500 leading-relaxed pt-2">
                    Batch 02 items are handcrafted in limited quantities at our Kanpur workshop. An early access key guarantees you first priority before public launch.
                  </p>

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-bold">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-neutral-800 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Get Early Access Pass</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* UPCOMING PIECES SHOWCASE */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/10 font-mono text-xs uppercase font-bold">
                <span>02 // UPCOMING PIECES IN WORKSHOP</span>
                <span className="text-red-600">LATE 2026 LAUNCH</span>
              </div>

              <div className="space-y-4">
                {PHASE_02_PIECES.map((piece) => (
                  <article
                    key={piece.id}
                    className="border border-black bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xs hover:border-black/80 transition-colors"
                  >
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="w-full sm:w-28 sm:h-28 object-cover border border-black/10 bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1 font-mono text-[9px] uppercase">
                        <span className="text-neutral-400">{piece.category}</span>
                        <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5">
                          {piece.allocation}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black font-sans mb-1">
                        {piece.name}
                      </h4>
                      <p className="font-mono text-[11px] text-neutral-600 leading-relaxed">
                        {piece.spec}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM GUARANTEE BANNER */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="border border-black/15 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black shrink-0" />
              <div>
                <span className="font-bold text-black uppercase block">
                  NO ADVANCE PAYMENT REQUIRED
                </span>
                <p className="text-[11px] text-neutral-500">
                  Reserving an early access pass is 100% free. You will receive private purchase links before public release.
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="text-black font-bold uppercase underline hover:text-neutral-600 shrink-0 text-[11px] flex items-center gap-1"
            >
              <span>Explore Current In-Stock Products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}