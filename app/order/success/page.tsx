'use client';

import React, { useMemo, Suspense, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle,
  Package,
  Plane,
  Truck,
  Sparkles,
  ArrowUpRight,
  BadgeCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

function Certificate3DCard({
  orderId,
  dateIssued,
}: {
  orderId: string;
  dateIssued: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 160, damping: 22 });
  const mouseY = useSpring(y, { stiffness: 160, damping: 22 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
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
      className="w-full flex items-center justify-center my-4 sm:my-6 select-none"
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
        className="w-full max-w-[620px] border-2 border-black bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white p-6 sm:p-10 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer transition-shadow"
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />

        <div className="flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-widest text-neutral-300 font-bold">
              GENUINE LEATHER CERTIFICATE
            </span>
          </div>
          <span className="border border-white/20 px-2 py-0.5 uppercase tracking-wider text-[9px] text-neutral-400">
            KANPUR FACTORY BENCH
          </span>
        </div>

        <div className="py-6 z-10">
          <div className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none mb-2 font-sans">
            HIDEWOOD
          </div>
          <div className="font-mono text-xs sm:text-sm text-neutral-300 uppercase tracking-widest">
            ORDER ID: <span className="text-emerald-400 font-bold">{orderId}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-t border-white/10 font-mono text-[10px] uppercase text-neutral-400">
          <div>
            <span className="block text-neutral-500 text-[8px]">// MATERIAL</span>
            <span className="text-white font-bold">100% Full-Grain Hide</span>
          </div>
          <div>
            <span className="block text-neutral-500 text-[8px]">// HARDWARE</span>
            <span className="text-white font-bold">Solid Cast Brass</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-neutral-500 text-[8px]">// WARRANTY</span>
            <span className="text-emerald-400 font-bold">Lifetime Guarantee</span>
          </div>
        </div>

        <div className="flex items-end justify-between z-10 border-t border-white/10 pt-4 font-mono text-[9px] sm:text-[10px] text-neutral-400 uppercase">
          <div>
            <span className="block text-neutral-500 text-[8px]">// ISSUED DATE</span>
            <span className="text-white font-bold">{dateIssued}</span>
          </div>
          <div className="text-right">
            <span className="block text-neutral-500 text-[8px]">// AUTHENTICITY</span>
            <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              100% VERIFIED
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get('orderId') || searchParams.get('session_id') || '';

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'verified' | 'pending' | 'invalid'>('loading');
  const [orderData, setOrderData] = useState<any>(null);

  const safeOrderId = useMemo(() => {
    const cleaned = rawOrderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    return cleaned ? cleaned.toUpperCase() : '';
  }, [rawOrderId]);

  // Server-side verification of order status to prevent unauthenticated access
  useEffect(() => {
    if (!safeOrderId) {
      setVerificationStatus('invalid');
      return;
    }

    let isMounted = true;
    const verifyOrder = async () => {
      try {
        const res = await fetch(`/api/orders/verify?orderId=${encodeURIComponent(safeOrderId)}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.status === 'PAID') {
          setVerificationStatus('verified');
          setOrderData(data.order);
          // Clear cart on confirmed verified purchase
          try {
            useCartStore.getState().items = [];
          } catch {}
        } else if (data.status === 'PENDING') {
          setVerificationStatus('pending');
        } else {
          setVerificationStatus('invalid');
        }
      } catch (err) {
        if (isMounted) setVerificationStatus('invalid');
      }
    };

    verifyOrder();
    return () => {
      isMounted = false;
    };
  }, [safeOrderId]);

  const dateIssued = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }, []);

  if (verificationStatus === 'loading') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-28 text-center font-mono text-xs uppercase text-neutral-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span>Verifying secure payment status with atelier gateway...</span>
      </div>
    );
  }

  if (verificationStatus === 'pending') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-24 text-center font-mono max-w-xl bg-white border border-black p-10">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold uppercase mb-2">Payment Verification Pending</h1>
        <p className="text-xs text-neutral-600 font-sans mb-6">
          Your payment gateway session is currently processing or awaiting webhook confirmation. If you completed payment, please wait a moment or check your orders dashboard.
        </p>
        <Link
          href="/orders"
          className="inline-block bg-black text-white hover:bg-neutral-800 px-6 py-3 text-xs uppercase font-bold tracking-widest"
        >
          Check Orders Status
        </Link>
      </div>
    );
  }

  if (verificationStatus === 'invalid') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-24 text-center font-mono max-w-xl bg-white border border-black p-10">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h1 className="text-xl font-bold uppercase mb-2">Invalid or Unverified Order</h1>
        <p className="text-xs text-neutral-600 font-sans mb-6">
          We could not verify a successful payment for this session. Please contact support or try placing your order again.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white hover:bg-neutral-800 px-6 py-3 text-xs uppercase font-bold tracking-widest"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const orderSchema = {
    '@context': 'https://schema.org',
    '@type': 'Order',
    orderNumber: safeOrderId,
    orderStatus: 'https://schema.org/OrderDelivered',
    seller: {
      '@type': 'Organization',
      name: 'HIDEWOOD Leather',
      url: 'https://hidewood.in',
    },
    orderDate: new Date().toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-8 sm:mb-12 font-mono text-[10px] sm:text-xs uppercase print:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              PAYMENT VERIFIED
            </span>
            <button
              onClick={() => window.print()}
              className="border border-black px-3.5 py-1.5 font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-black bg-white p-6 sm:p-12 lg:p-16 mb-12 sm:mb-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute right-4 -bottom-10 select-none pointer-events-none opacity-[0.03] text-black font-black font-mono text-[160px] sm:text-[240px] leading-none">
            HW
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3 font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Order Placed Successfully &bull; Handcrafted in Kanpur</span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-black leading-none mb-3">
                ORDER CONFIRMED
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-mono">
                Order Tracking Number: <strong className="text-black font-bold">{safeOrderId}</strong>
              </p>
            </div>

            <div className="border border-black p-4 bg-[#F8F8F6] text-center font-mono shrink-0 self-start sm:self-auto">
              <span className="text-[9px] uppercase text-neutral-400 block mb-0.5">
                WORKSHOP STATUS
              </span>
              <span className="text-xs font-bold text-black uppercase block">
                QUEUED FOR PACKING
              </span>
              <span className="text-[9px] text-emerald-700 font-bold uppercase block mt-1">
                ✓ 100% PURE LEATHER VERIFIED
              </span>
            </div>
          </div>

          <Certificate3DCard orderId={safeOrderId} dateIssued={dateIssued} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 font-mono text-xs uppercase my-8">
            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">DATE OF ORDER</span>
              <span className="font-bold text-black">{dateIssued}</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">LEATHER MATERIAL</span>
              <span className="font-bold text-black">100% Full-Grain Hide</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">BUCKLE &amp; METAL</span>
              <span className="font-bold text-black">Solid Sand-Cast Brass</span>
            </div>

            <div className="p-3.5 border border-black/10 bg-[#FAFAFA]">
              <span className="text-[10px] text-neutral-400 block mb-1">WARRANTY PROMISE</span>
              <span className="font-bold text-black">Lifetime Guarantee</span>
            </div>
          </div>

          <div className="border-t border-black/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
            <p className="max-w-xl leading-relaxed font-sans">
              This certificate confirms that your piece is handcrafted from 100% genuine full-grain leather directly at our Kanpur workshop. It contains zero synthetic cardboard fillers and will naturally darken and patina over time.
            </p>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase text-neutral-400 block font-mono">AUTHORIZED STAMP</span>
              <span className="font-bold text-black text-sm uppercase font-serif italic">
                Master Craftsman / Kanpur
              </span>
            </div>
          </div>
        </motion.div>

        {/* 4-Stage Delivery Progress Tracker */}
        <section className="mb-14 sm:mb-20 print:hidden">
          <div className="border-b border-black/10 pb-3 mb-6 flex items-center justify-between font-mono text-xs uppercase">
            <span className="font-bold text-black">// DELIVERY TIMELINE &amp; LOGISTICS</span>
            <span className="text-neutral-500 font-bold">AIR EXPRESS COURIER</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="border border-black bg-black text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STEP 01</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1">ORDER CONFIRMED</span>
              <p className="text-[10px] text-neutral-300">
                Craft specifications assigned to our workshop bench.
              </p>
            </div>

            <div className="border border-black bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STEP 02</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-black">QUALITY CHECK &amp; PACK</span>
              <p className="text-[10px] text-neutral-500 font-sans">
                Sealed in protective packaging with genuine leather certificate.
              </p>
            </div>

            <div className="border border-black/20 bg-white/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STEP 03</span>
                <Plane className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-neutral-500">EXPRESS AIRWAY</span>
              <p className="text-[10px] text-neutral-400 font-sans">
                Handed to BlueDart Air / Express courier for swift flight transit.
              </p>
            </div>

            <div className="border border-black/20 bg-white/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400">STEP 04</span>
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <span className="font-bold uppercase block text-sm mb-1 text-neutral-500">DOORSTEP DELIVERY</span>
              <p className="text-[10px] text-neutral-400 font-sans">
                Delivered safely to your specified address within 2-4 days.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 pt-8 print:hidden">
          <Link
            href="/orders"
            className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Track Order Status Live</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto border border-black/20 hover:border-black px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-center text-black transition-colors"
          >
            Explore More Products
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
            Loading Order Confirmation...
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}