'use client';

import React, { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle,
  Package,
  Plane,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get('orderId') || searchParams.get('session_id') || '';

  // Sanitize order ID to prevent XSS injection
  const safeOrderId = useMemo(() => {
    const cleaned = rawOrderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    return cleaned ? cleaned.toUpperCase() : `HW-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [rawOrderId]);

  // Current timestamp for the dispatch certificate
  const dateIssued = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }, []);

  // Structured Data Schema (Order & Parcel Delivery for SEO/AEO)
  const orderSchema = {
    '@context': 'https://schema.org',
    '@type': 'Order',
    orderNumber: safeOrderId,
    orderStatus: 'https://schema.org/OrderProcessing',
    seller: {
      '@type': 'Organization',
      name: 'HIDEWOOD Atelier',
      url: 'https://hidewood.example.com',
    },
    orderDate: new Date().toISOString(),
    deliveryLeadTime: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 4,
      unitCode: 'DAY',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-8 sm:mb-12 font-mono text-[10px] sm:text-xs uppercase print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Archive</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              TRANSMISSION VERIFIED
            </span>
            <button
              onClick={() => window.print()}
              className="border border-black px-3 py-1 font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3 h-3" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>

        {/* Hero Success Monolith */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-black bg-white p-6 sm:p-12 lg:p-16 mb-12 sm:mb-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Watermark Seal Background */}
          <div className="absolute right-4 -bottom-10 select-none pointer-events-none opacity-[0.03] text-black font-black font-mono text-[160px] sm:text-[240px] leading-none">
            HW
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Bespoke Commission Accepted &bull; Series 01</span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-black leading-none mb-3">
                CERTIFICATE OF AUTHENTICITY
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-mono">
                Order Serial Registry: <strong className="text-black font-bold">{safeOrderId}</strong>
              </p>
            </div>

            {/* Hand-Stamped Seal Badge */}
            <div className="border border-black p-4 bg-[#F8F8F6] text-center font-mono shrink-0 self-start sm:self-auto">
              <span className="text-[9px] uppercase text-neutral-400 block mb-0.5">
                BENCH ALLOCATION
              </span>
              <span className="text-xs font-bold text-black uppercase block">
                LOT #402 &bull; TUSCAN BOVINE
              </span>
              <span className="text-[9px] text-emerald-700 font-bold uppercase block mt-1">
                ✓ ZERO PLASTIC VERIFIED
              </span>
            </div>
          </div>

          {/* Certificate Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs uppercase mb-10">
            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">DATE OF RECORD</span>
              <span className="font-bold text-black">{dateIssued}</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">HIDE SPECIFICATION</span>
              <span className="font-bold text-black">4.2mm Unsplit Steer</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">METALLURGY</span>
              <span className="font-bold text-black">185g Sand-Cast Brass</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">WARRANTY HORIZON</span>
              <span className="font-bold text-black">100 Yrs Structural</span>
            </div>
          </div>

          {/* Atelier Seal Statement */}
          <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
            <p className="max-w-xl leading-relaxed">
              This digital certificate certifies that the commissioned hide was tanned using 100% mimosa and chestnut bark liquors in subterranean pits. It carries zero acrylic sealants and will patina naturally with body heat.
            </p>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase text-neutral-400 block">BENCH MASTER SIGNATURE</span>
              <span className="font-bold text-black text-sm uppercase font-serif italic">
                Atelier Master / Kanpur
              </span>
            </div>
          </div>
        </motion.div>

        {/* 4-Stage Dispatch Telemetry */}
        <section className="mb-14 sm:mb-20 print:hidden">
          <div className="border-b border-black/10 pb-3 mb-6 flex items-center justify-between font-mono text-xs uppercase">
            <span className="font-bold text-black">// COURIER DISPATCH TELEMETRY</span>
            <span className="text-neutral-400">DISPATCH VIA BLUEDART AIR / DHL EXPRESS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="border border-black bg-black text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STAGE 01</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1">BENCH COMPLETE</span>
              <p className="text-[10px] text-neutral-300">
                Hide skived, hand-beveled, and edge friction-burnished.
              </p>
            </div>

            <div className="border border-black bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STAGE 02</span>
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-black">CEDAR BOX PACK</span>
              <p className="text-[10px] text-neutral-500">
                Sealed in air-tight archival bag with fresh cedarwood curls.
              </p>
            </div>

            <div className="border border-black/20 bg-white/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STAGE 03</span>
                <Plane className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-neutral-500">EXPRESS AIRWAY</span>
              <p className="text-[10px] text-neutral-400">
                Direct airway bill issued for priority domestic / global flight.
              </p>
            </div>

            <div className="border border-black/20 bg-white/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STAGE 04</span>
                <Package className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-neutral-500">PATRON HANDOVER</span>
              <p className="text-[10px] text-neutral-400">
                Direct signature handover at your designated residence.
              </p>
            </div>
          </div>
        </section>

        {/* Immediate Leather Care Protocol */}
        <section className="border border-black bg-white p-6 sm:p-10 mb-14 sm:mb-20 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-black" />
            <h3 className="font-bold text-sm uppercase text-black">
              THE 30-DAY BREAK-IN PROTOCOL
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-neutral-600 leading-relaxed">
            <div>
              <strong className="text-black block mb-1 uppercase">01 // FIRST WEAR STIFFNESS</strong>
              Your 4.2mm steerhide will feel rigid out of the box. Do not apply chemical softeners. Natural body warmth will soften internal tallow within 7 days.
            </div>

            <div>
              <strong className="text-black block mb-1 uppercase">02 // WATER &amp; RAIN ACCIDENTS</strong>
              If drenched in monsoon or heavy rain, wipe with a dry cotton cloth and allow to air-dry flat away from artificial heaters.
            </div>

            <div>
              <strong className="text-black block mb-1 uppercase">03 // BI-ANNUAL BALM</strong>
              Once every 6 months, apply a thumbnail-sized dab of organic beeswax leather cream with palms to restore natural oils and enhance tea-core patina.
            </div>
          </div>
        </section>

        {/* Bottom CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 pt-8 print:hidden">
          <Link
            href="/products"
            className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-center transition-colors"
          >
            Explore Next Silhouettes
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto border border-black/20 hover:border-black px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-center text-black transition-colors"
          >
            Contact Dispatch Desk
          </Link>
        </div>
      </div>
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
      <Suspense
        fallback={
          <div className="max-w-[1400px] mx-auto px-4 py-20 text-center font-mono text-xs uppercase text-neutral-400">
            Validating Atelier Cipher...
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}