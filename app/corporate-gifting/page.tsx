'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Send,
  Layers,
  Award,
  PackageCheck,
  Check,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';

interface GiftSlab {
  tier: string;
  units: string;
  discount: string;
  turnaround: string;
  leadTime: string;
}

const GIFT_SLABS: GiftSlab[] = [
  { tier: 'Starter Batch', units: '25 – 50 Units', discount: '15% Discount', turnaround: 'Free Logo Debossing', leadTime: '5 – 7 Working Days' },
  { tier: 'Business Tier', units: '51 – 150 Units', discount: '25% Discount', turnaround: 'Custom Wooden Gift Boxes', leadTime: '8 – 10 Working Days' },
  { tier: 'Enterprise Tier', units: '150+ Units', discount: 'Best Wholesale Rate', turnaround: 'Priority Multi-City Delivery', leadTime: 'Fast-Track Dispatch' },
];

const CURATED_SETS = [
  {
    id: 'set-01',
    name: 'Executive Belt & Wallet Set',
    pairing: 'Formal Belt (32mm) + Classic Bifold Wallet',
    leather: '100% Genuine Leather / Solid Brass Buckle',
    priceEstimate: '₹2,799 / Set (Bulk Price)',
    image: '/belt-macro.png',
  },
  {
    id: 'set-02',
    name: 'Daily Essentials Gift Set',
    pairing: 'Slim Cardholder + Leather Phone Case + Keyring',
    leather: 'Real Full-Grain Leather / Waxed Finish',
    priceEstimate: '₹1,899 / Set (Bulk Price)',
    image: '/belt-macro.png',
  },
  {
    id: 'set-03',
    name: 'Travel Duffel & Bag Set',
    pairing: 'Weekend Duffel Bag (45L) + Luggage Tag + Tech Pouch',
    leather: 'Thick Real Leather / Brass Metal Zippers',
    priceEstimate: '₹11,499 / Set (Bulk Price)',
    image: '/belt-macro.png',
  },
];

export default function CorporateGiftingPage() {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('25-50');
  const [budget, setBudget] = useState('₹50,000 – ₹1,50,000');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/corporate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          name: contactPerson,
          email,
          phone,
          quantity,
          budget,
          notes,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Inquiry error:', err);
      alert('Network issue. Please connect directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const corporateSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'HIDEWOOD Corporate Leather Gifting & Bulk Branding',
    provider: {
      '@type': 'LocalBusiness',
      name: 'HIDEWOOD Kanpur Workshop',
      telephone: '+91-9999999999',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kanpur',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'India',
      },
    },
    description:
      'Custom corporate leather gifting in India. Handcrafted full-grain belts, wallets, and gift sets stamped with company logos.',
    url: 'https://hidewood.in/corporate-gifting',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(corporateSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 overflow-x-hidden">
        {/* Navigation Breadcrumb */}
        <section className="max-w-[1600px] mx-auto mb-8 sm:mb-12">
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>CORPORATE DESK</span>
              <span>&bull;</span>
              <span className="text-black font-bold">BULK &amp; COMPANY GIFTING</span>
            </div>
          </nav>
        </section>

        {/* Hero Section */}
        <section className="max-w-[1600px] mx-auto mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end pb-10 border-b border-black/10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Direct from Kanpur Factory &bull; 100% Pure Leather
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                CUSTOM CORPORATE LEATHER GIFTS.
              </h1>
            </div>

            <div className="lg:col-span-4">
              <p className="font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                High-quality real leather gifts for your clients, employees, and business partners. Handcrafted with your company logo embossed neatly on every piece.
              </p>
              <div className="flex items-center gap-3 font-mono text-[11px] text-black font-bold">
                <span className="p-1 bg-black text-white">GST INVOICE AVAILABLE</span>
                <span>ALL INDIA SHIPPING</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Quality Highlights */}
        <section className="max-w-[1600px] mx-auto mb-16 sm:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Layers className="w-6 h-6 text-red-600 mb-3" />
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 01 PURE LEATHER
              </span>
              <h3 className="font-black text-sm uppercase text-black mb-2">
                100% Real Leather Only
              </h3>
              <p className="text-neutral-600 font-sans leading-relaxed text-[11px]">
                No synthetic rexine, no plastic sheets, and no cardboard inside. These gifts never peel or tear and stay durable for years of daily use.
              </p>
            </div>

            <div className="p-6 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-6 h-6 text-black mb-3" />
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 02 LOGO BRANDING
              </span>
              <h3 className="font-black text-sm uppercase text-black mb-2">
                Clean Company Logo Stamping
              </h3>
              <p className="text-neutral-600 font-sans leading-relaxed text-[11px]">
                We create metal dies of your company logo. You can choose natural heat stamping, classic gold foil, or subtle silver foil branding.
              </p>
            </div>

            <div className="p-6 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <PackageCheck className="w-6 h-6 text-emerald-700 mb-3" />
              <span className="text-[10px] uppercase text-neutral-400 block mb-1">
                // 03 PREMIUM PACKAGING
              </span>
              <h3 className="font-black text-sm uppercase text-black mb-2">
                Ready-to-Gift Boxes
              </h3>
              <p className="text-neutral-600 font-sans leading-relaxed text-[11px]">
                Packed inside solid matte black gift boxes or pine wood crates, complete with warranty verification cards for easy handover.
              </p>
            </div>
          </div>
        </section>

        {/* Curated Gifting Sets Gallery */}
        <section className="max-w-[1600px] mx-auto mb-16 sm:mb-24">
          <div className="flex items-baseline justify-between pb-3 mb-6 border-b border-black/10 font-mono text-xs uppercase">
            <span className="font-bold text-black">// POPULAR CORPORATE GIFT SETS</span>
            <span className="text-neutral-400">CUSTOM BRANDING READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURATED_SETS.map((set) => (
              <div
                key={set.id}
                className="border border-black bg-white flex flex-col justify-between group overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                  <img
                    src={set.image}
                    alt={set.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[9px] font-mono uppercase font-bold">
                    Logo Stamping Included
                  </div>
                </div>

                <div className="p-5 font-mono">
                  <h4 className="font-bold text-black uppercase text-base mb-1 font-sans">
                    {set.name}
                  </h4>
                  <p className="text-neutral-500 text-[11px] mb-3 font-sans">
                    {set.pairing}
                  </p>
                  <div className="text-[10px] text-neutral-400 border-t border-black/10 pt-2 mb-3">
                    Material: {set.leather}
                  </div>
                  <div className="text-sm font-bold text-red-600">
                    {set.priceEstimate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quantity Slabs Table */}
        <section className="max-w-[1600px] mx-auto mb-16 sm:mb-24">
          <div className="border border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10 font-mono text-xs uppercase">
              <span className="font-bold text-black flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                QUANTITY &amp; DISCOUNT TIERS
              </span>
              <span className="text-neutral-400">GST INPUT INVOICE</span>
            </div>

            <div className="overflow-x-auto [scrollbar-width:none]">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-black/10 text-neutral-400 text-[10px] uppercase">
                    <th className="pb-3">Order Slab</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Discount</th>
                    <th className="pb-3">Packaging Details</th>
                    <th className="pb-3 text-right">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {GIFT_SLABS.map((slab, sIdx) => (
                    <tr key={sIdx} className="hover:bg-neutral-50">
                      <td className="py-3.5 font-bold text-black uppercase">{slab.tier}</td>
                      <td className="py-3.5 text-neutral-700">{slab.units}</td>
                      <td className="py-3.5 text-red-600 font-bold">{slab.discount}</td>
                      <td className="py-3.5 text-neutral-600 font-sans text-[11px]">{slab.turnaround}</td>
                      <td className="py-3.5 text-right font-bold text-black">{slab.leadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Direct Contact & Inquiry Form */}
        <section id="inquiry" className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Contact Card */}
            <div className="lg:col-span-5 p-6 sm:p-10 border-2 border-black bg-black text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-2 font-bold">
                // DIRECT FACTORY HELP
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4 font-sans leading-tight">
                TALK DIRECTLY TO OUR KANPUR TEAM.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-8">
                Need samples before booking? Have an urgent office event within 10 days? Reach out directly to our production desk in Kanpur.
              </p>

              <div className="space-y-4 font-mono text-xs border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>corporate@hidewood.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+91 99999 99999 (Mon–Sat, 9AM to 7PM)</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    'Hello HIDEWOOD team, I want to discuss a bulk corporate leather gifting order for our company.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Inquiry Form */}
            <div className="lg:col-span-7 border-2 border-black bg-white p-6 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-black/10 font-mono text-xs uppercase">
                <span className="font-bold text-black">REQUEST SAMPLES &amp; PRICE QUOTE</span>
                <span className="text-emerald-700 font-bold">REPLY WITHIN 4 HOURS</span>
              </div>

              {submitted ? (
                <div className="py-16 text-center font-mono">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-2xl font-black uppercase text-black font-sans mb-2">
                    REQUEST RECEIVED
                  </h4>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto mb-6 font-sans">
                    Thank you, {contactPerson}. Our gifting specialist will send you design mockups and tier pricing on email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs uppercase underline text-black cursor-pointer font-bold"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Tech Solutions"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@company.com"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Required Quantity
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="25-50">25 to 50 Units</option>
                        <option value="51-150">51 to 150 Units</option>
                        <option value="150-500">150 to 500 Units</option>
                        <option value="500+">More than 500 Units</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase text-black font-bold mb-1">
                        Estimated Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Under ₹50,000">Under ₹50,000</option>
                        <option value="₹50,000 – ₹1,50,000">₹50,000 to ₹1,50,000</option>
                        <option value="₹1,50,000 – ₹5,00,000">₹1,50,000 to ₹5,00,000</option>
                        <option value="Above ₹5,00,000">Above ₹5,00,000</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-black font-bold mb-1">
                      Event Date &amp; Item Details
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us your event date, products you want (belts, wallets, etc.), or any specific logo placement requests..."
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Get Quote &amp; Digital Sample</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-[10px] text-neutral-400 font-mono uppercase">
                    Free Digital Mockup Provided Before Order Confirmation
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}