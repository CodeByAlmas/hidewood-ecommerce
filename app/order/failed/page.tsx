'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, RotateCcw, MessageCircle, ArrowLeft } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'UNKNOWN';

  return (
    <div className="max-w-xl mx-auto border-2 border-black bg-white p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
      <div className="w-12 h-12 bg-red-100 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>

      <span className="text-[10px] uppercase text-neutral-400 font-bold block mb-1">
        TRANSACTION INCOMPLETE
      </span>
      <h1 className="text-2xl sm:text-4xl font-black uppercase text-black font-sans mb-3">
        PAYMENT NOT COMPLETED
      </h1>

      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans mb-6">
        Aapka payment complete nahi ho paya ya bank ne decline kar diya. Agar aapke account se amount debit ho gaya hai, toh wo 3–5 working days me aapke bank account me auto-refund ho jayega.
      </p>

      <div className="p-3 bg-[#F8F8F6] border border-black/10 text-xs mb-6">
        Reference ID: <strong className="text-black font-bold">{orderId}</strong>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/cart"
          className="flex-1 bg-black text-white hover:bg-neutral-800 py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Payment</span>
        </Link>

        <a
          href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hello HIDEWOOD team, my payment failed for Order ID ${orderId}. Please assist.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-black bg-white hover:bg-neutral-100 py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-black"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Help on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 px-4 flex items-center justify-center">
      <Suspense fallback={<div className="font-mono text-xs">Loading status...</div>}>
        <FailedContent />
      </Suspense>
    </main>
  );
}