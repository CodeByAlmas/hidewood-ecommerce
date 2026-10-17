'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Send,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface InquiryState {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  waistSize: string;
  monogramInitials: string;
  message: string;
}

const INITIAL_INQUIRY: InquiryState = {
  fullName: '',
  email: '',
  phone: '',
  topic: 'Bespoke Sizing & Monogramming',
  waistSize: '34',
  monogramInitials: '',
  message: '',
};

export default function ContactConciergePage() {
  const [formData, setFormData] = useState<InquiryState>(INITIAL_INQUIRY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kanpurTime, setKanpurTime] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Live Kanpur Bench Clock (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setKanpurTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // XSS & Payload Sanitizer
  const sanitizeText = (input: string): string => {
    return input.replace(/[<>]/g, '').trim();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monogramInitials' ? value.slice(0, 3).toUpperCase() : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate safe API dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  // Direct Wa.me link generator for instant VIP dispatch
  const generateWhatsAppLink = () => {
    const safeName = sanitizeText(formData.fullName) || 'Client';
    const text = `Hello HIDEWOOD Atelier Concierge,%0A%0AClient: ${encodeURIComponent(
      safeName
    )}%0ATopic: ${encodeURIComponent(formData.topic)}%0AWaist Size: ${encodeURIComponent(
      formData.waistSize
    )}"%0AMonogram Initials: ${encodeURIComponent(
      formData.monogramInitials || 'None'
    )}%0A%0AMessage: ${encodeURIComponent(
      sanitizeText(formData.message) || 'Requesting atelier sizing assistance.'
    )}`;
    return `https://wa.me/919999999999?text=${text}`;
  };

  // Structured Data Schema (GEO / AEO / LocalBusiness & ContactPage)
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'HIDEWOOD Atelier Concierge & Bespoke Dispatch Desk',
    description:
      'Direct communication desk for bespoke leather sizing, custom brass monogramming, and international parcel logistics from our Kanpur bench.',
    url: 'https://hidewood.example.com/contact',
    mainEntity: {
      '@type': 'Store',
      name: 'HIDEWOOD Leather Atelier',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200',
      telephone: '+91-99999-99999',
      email: 'dispatch@hidewood.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Industrial Tannery Belt, Jajmau',
        addressLocality: 'Kanpur',
        addressRegion: 'Uttar Pradesh',
        postalCode: '208010',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '26.4499',
        longitude: '80.3319',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      priceRange: '₹₹₹',
    },
  };

  const FAQS = [
    {
      q: 'How does the +2" Denim Waist Rule work?',
      a: 'Belts are measured from the internal fold where the buckle rests to the middle hole (the 3rd of 5 holes). If your actual denim/trouser waist measures 32 inches, your proper HIDEWOOD heirloom size is 34 inches.',
    },
    {
      q: 'Are hot-stamped blind deboss initials permanent?',
      a: 'Yes. Initials are pressed directly into the 4.2mm full-grain steerhide using 160°C heated brass typeface blocks with 2 tonnes of hydraulic pressure. They cannot rub off or peel away.',
    },
    {
      q: 'What is the dispatch turnaround for custom monogram pieces?',
      a: 'Bespoke debossed items are stamped within 24 hours at our Kanpur bench and handed directly to BlueDart Air / DHL Express in cedarwood shaving boxes.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes. We ship worldwide with DDP (Delivered Duty Paid) express options so international patrons encounter zero surprise customs delays.',
    },
  ];

  return (
    <>
      {/* 1. SEO / GEO SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* 2. TOP HUD BREADCRUMB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Return to Atelier Index"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Return to Index</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>COMMUNICATION DESK</span>
              <span>&bull;</span>
              <span className="text-black font-bold">KANPUR BENCH</span>
            </div>
          </nav>
        </section>

        {/* 3. HERO TITLE & TELEMETRY */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Direct Atelier Hotline &bull; Kanpur Workshop
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                CONCIERGE DESK
              </h1>
            </div>

            {/* Kanpur Live Workshop Telemetry Card */}
            <div className="border border-black bg-white p-4 sm:p-5 flex items-center gap-6 font-mono text-xs shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-black" />
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    WORKSHOP BENCH TIME
                  </span>
                  <span className="font-bold text-black text-sm">{kanpurTime || '09:00:00 AM IST'}</span>
                </div>
              </div>
              <div className="border-l border-black/15 pl-6">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  STATUS
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  BENCH ACTIVE
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SPLIT GRID: LEFT CONCIERGE FORM / RIGHT WORKSHOP DOSSIER */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-start">
            
            {/* LEFT: FORM COMPONENT (7 COLS) */}
            <div className="lg:col-span-7 border border-black bg-white p-6 sm:p-10">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-black/10 font-mono text-[10px] sm:text-xs uppercase text-neutral-500">
                <span>01 // BESPOKE SIZING &amp; DISPATCH INQUIRY</span>
                <span>DIRECT LINE</span>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 sm:py-16 text-center flex flex-col items-center justify-center font-mono"
                >
                  <CheckCircle2 className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mb-2">
                    TRANSMISSION RECEIVED
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mb-6 leading-relaxed">
                    Our Kanpur bench master has logged your specifications. An official dossier response will be dispatched within 4 working hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData(INITIAL_INQUIRY);
                    }}
                    className="border border-black px-6 py-2.5 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Patron Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Almas Siddiqui"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Communication Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="patron@domain.com"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Topic Category
                      </label>
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors cursor-pointer"
                      >
                        <option>Bespoke Sizing</option>
                        <option>Monogram Stamping</option>
                        <option>Wholesale Order</option>
                        <option>Global Dispatch</option>
                        <option>Leather Care Dossier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Waist Size (Inches)
                      </label>
                      <input
                        type="text"
                        name="waistSize"
                        value={formData.waistSize}
                        onChange={handleInputChange}
                        placeholder="34"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Initials (Max 3)
                      </label>
                      <input
                        type="text"
                        name="monogramInitials"
                        maxLength={3}
                        value={formData.monogramInitials}
                        onChange={handleInputChange}
                        placeholder="AS"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono font-bold uppercase focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                      Specific Instructions or Questions
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify your waist measurements, custom hole pitch, or questions regarding our Tuscan mimosa bark tannage..."
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs font-mono focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Dual Action Buttons: Form Submit or Instant WhatsApp */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-black text-white hover:bg-neutral-800 py-3.5 px-6 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
                    </button>

                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-black bg-white hover:bg-neutral-100 py-3.5 px-6 text-xs uppercase font-bold tracking-widest transition-colors flex items-center justify-center gap-2 font-mono text-black"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Instant WhatsApp Concierge</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: ATELIER DIRECTORY & LOCATION DOSSIER (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Workshop Benchmark Box */}
              <div className="border border-black bg-white p-6 sm:p-8">
                <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block mb-2">
                  // PHYSICAL BENCHMARK
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-3">
                  THE KANPUR ATELIER BENCH
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-6">
                  Where raw Tuscan bark-tanned bovine butts are cut, beveled, and slicked by third-generation craftsmen. Visitors are hosted by private appointment only.
                </p>

                <div className="space-y-4 border-t border-black/10 pt-5 font-mono text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Atelier Address</span>
                      <span className="text-neutral-500 text-[11px] leading-relaxed block">
                        Jajmau Leather District, Kanpur, Uttar Pradesh 208010, India
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Official Transmission</span>
                      <span className="text-neutral-500 text-[11px]">dispatch@hidewood.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Private Line</span>
                      <span className="text-neutral-500 text-[11px]">+91 (0) 512 284 9102</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Guarantees Box */}
              <div className="border border-black/15 bg-[#F4F4F0] p-6 font-mono text-xs">
                <div className="flex items-center gap-2 mb-3 font-bold text-black uppercase">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Atelier Dispatch Protocol</span>
                </div>
                <ul className="space-y-2 text-[11px] text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>All pieces packed inside air-tight sealed archival bags with natural cedarwood shavings.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>14-day zero-friction unworn size exchange policy on standard sizes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>100-year structural integrity guarantee against collagen tear and hardware crack.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* 5. ATELIER FAQ PROTOCOL (ACCORDION) */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="border-t border-black/10 pt-10 mb-8 font-sans">
            <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
              // CLARIFICATIONS &amp; PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              FREQUENTLY EXAMINED QUESTIONS
            </h2>
          </div>

          <div className="border border-black/10 divide-y divide-black/10 bg-white">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="p-4 sm:p-6">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-400 font-bold">
                        0{index + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-black group-hover:underline">
                        {faq.q}
                      </h4>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 pl-7 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </>
  );
}