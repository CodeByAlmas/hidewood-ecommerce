'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
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
  message: string;
}

const INITIAL_INQUIRY: InquiryState = {
  fullName: '',
  email: '',
  phone: '',
  topic: 'Belt Sizing Help',
  waistSize: '34',
  message: '',
};

export default function ContactConciergePage() {
  const [formData, setFormData] = useState<InquiryState>(INITIAL_INQUIRY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kanpurTime, setKanpurTime] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Live Kanpur Workshop Clock (IST)
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

  // XSS & Input Sanitizer
  const sanitizeText = (input: string): string => {
    return input.replace(/[<>]/g, '').trim();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 100% Reliable Mail Dispatch: Opens Gmail Web Composer directly + fallback to mailto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const safeName = sanitizeText(formData.fullName) || 'Customer';
    const safeEmail = sanitizeText(formData.email);
    const safePhone = sanitizeText(formData.phone) || 'Not provided';
    const safeSize = sanitizeText(formData.waistSize);
    const safeMsg = sanitizeText(formData.message) || 'Inquiry regarding HIDEWOOD products.';

    const mailSubject = `Product Inquiry: ${formData.topic} - ${safeName}`;
    const mailBody =
      `Customer Name: ${safeName}\n` +
      `Email Address: ${safeEmail}\n` +
      `Phone Number: ${safePhone}\n` +
      `Inquiry Topic: ${formData.topic}\n` +
      `Waist / Shoe Size: ${safeSize}"\n\n` +
      `Message:\n${safeMsg}`;

    // Direct Web Gmail Composer URL (works across all browsers without mail client app)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dispatch@hidewood.com&su=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    // Standard mailto fallback for Outlook/Apple Mail users
    const mailtoUrl = `mailto:dispatch@hidewood.com?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    // Try opening Gmail Web first in new tab; if popup blocked, trigger standard mailto
    const newWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  // Direct WhatsApp Message Link
  const generateWhatsAppLink = () => {
    const safeName = sanitizeText(formData.fullName) || 'Customer';
    const safePhone = sanitizeText(formData.phone) || 'Not provided';
    const safeMsg = sanitizeText(formData.message) || 'I need help choosing the right size and leather product.';

    const text =
      `Hello HIDEWOOD Team,%0A%0A` +
      `*Name:* ${encodeURIComponent(safeName)}%0A` +
      `*Phone:* ${encodeURIComponent(safePhone)}%0A` +
      `*Topic:* ${encodeURIComponent(formData.topic)}%0A` +
      `*Waist Size:* ${encodeURIComponent(formData.waistSize)}"%0A` +
      `*Question:* ${encodeURIComponent(safeMsg)}`;

    return `https://wa.me/919999999999?text=${text}`;
  };

  // Structured Data Schema (LocalBusiness & ContactPage)
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'HIDEWOOD Customer Support & Workshop Desk',
    description:
      'Direct customer support for sizing guidance, order tracking, and custom inquiries from our Kanpur leather workshop.',
    url: 'https://hidewood.example.com/contact',
    mainEntity: {
      '@type': 'Store',
      name: 'HIDEWOOD Leather',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200',
      telephone: '+91-99999-99999',
      email: 'dispatch@hidewood.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Industrial Leather Cluster, Jajmau',
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
      q: 'How does the +2" Belt Sizing Rule work?',
      a: 'Belts are measured from the buckle fold to the center hole. If your regular jeans or trouser waist is 32 inches, your ideal belt size is 34 inches.',
    },
    {
      q: 'Where is your leather produced and sourced?',
      a: 'All our leather is sourced directly from our own sister tannery facility right here in Kanpur, India. No third-party synthetic blending or middlemen.',
    },
    {
      q: 'How fast is dispatch and delivery across India?',
      a: 'Orders are dispatched within 24 to 48 hours from our workshop. Delivery takes 2 to 4 business days via express courier with real-time tracking.',
    },
    {
      q: 'What if the belt or shoe size doesn’t fit me?',
      a: 'We offer an easy 14-day unworn size exchange policy. Simply message our WhatsApp desk or email us and we will arrange the exchange.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* TOP BREADCRUMB */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
          <nav
            aria-label="Breadcrumb Navigation"
            className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10px] sm:text-xs uppercase"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 py-1 px-1 -ml-1 text-neutral-600 hover:text-black transition-colors font-semibold cursor-pointer min-h-[36px]"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 pointer-events-none" />
              <span className="pointer-events-none">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>CUSTOMER SUPPORT</span>
              <span>&bull;</span>
              <span className="text-black font-bold">KANPUR WORKSHOP</span>
            </div>
          </nav>
        </section>

        {/* HERO TITLE & TELEMETRY */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Direct Workshop Hotline &bull; Kanpur Bench
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                HELP &amp; SUPPORT
              </h1>
            </div>

            {/* Kanpur Live Workshop Clock */}
            <div className="border border-black bg-white p-4 sm:p-5 flex items-center gap-6 font-mono text-xs shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-black" />
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    WORKSHOP TIME (IST)
                  </span>
                  <span className="font-bold text-black text-sm">{kanpurTime || '10:00:00 AM IST'}</span>
                </div>
              </div>
              <div className="border-l border-black/15 pl-6">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  SUPPORT STATUS
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  ONLINE &amp; ACTIVE
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SPLIT GRID: FORM & WORKSHOP CONTACT DETAILS */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-start">
            
            {/* LEFT: INQUIRY FORM */}
            <div className="lg:col-span-7 border border-black bg-white p-6 sm:p-10">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-black/10 font-mono text-[10px] sm:text-xs uppercase text-neutral-500">
                <span>01 // SEND US AN INQUIRY</span>
                <span>EMAIL &amp; WHATSAPP</span>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 sm:py-16 text-center flex flex-col items-center justify-center font-mono"
                >
                  <CheckCircle2 className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mb-2">
                    INQUIRY OPENED IN EMAIL
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mb-6 leading-relaxed">
                    Your inquiry has been compiled and opened in your email tab. Please hit send, or chat directly with our Kanpur team on WhatsApp.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Message on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData(INITIAL_INQUIRY);
                      }}
                      className="border border-black px-6 py-2.5 text-xs font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      Fill New Form
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@gmail.com"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors cursor-pointer"
                      >
                        <option>Belt Sizing Help</option>
                        <option>Order Tracking</option>
                        <option>Size Exchange</option>
                        <option>Bulk / Corporate Orders</option>
                        <option>Leather Care Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                      />
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
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-black font-semibold mb-1.5">
                      Your Message or Question
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us what you need help with regarding fit, product options, or dispatch times..."
                      className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3.5 text-xs font-mono focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Dual Action: Send Email or Instant WhatsApp */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-black text-white hover:bg-neutral-800 py-3.5 px-6 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 font-mono shadow-xs active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Opening Mail...' : 'Send Inquiry via Email'}</span>
                    </button>

                    <a
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-black bg-white hover:bg-neutral-100 py-3.5 px-6 text-xs uppercase font-bold tracking-widest transition-colors flex items-center justify-center gap-2 font-mono text-black active:scale-98"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: CONTACT DETAILS & DISPATCH GUARANTEE */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="border border-black bg-white p-6 sm:p-8">
                <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block mb-2">
                  // WORKSHOP LOCATION
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-3">
                  THE KANPUR WORKSHOP
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-6">
                  Where genuine full-grain leather is cut, stitched, and finished by master craftsmen. Direct from factory with zero middlemen markups.
                </p>

                <div className="space-y-4 border-t border-black/10 pt-5 font-mono text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Workshop Address</span>
                      <span className="text-neutral-500 text-[11px] leading-relaxed block">
                        Jajmau Leather Cluster, Kanpur, Uttar Pradesh 208010, India
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Official Email</span>
                      <a href="mailto:dispatch@hidewood.com" className="text-neutral-600 hover:text-black underline text-[11px]">
                        dispatch@hidewood.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black uppercase block">Customer Helpline</span>
                      <span className="text-neutral-500 text-[11px]">+91 (0) 512 284 9102</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-black/15 bg-[#F4F4F0] p-6 font-mono text-xs">
                <div className="flex items-center gap-2 mb-3 font-bold text-black uppercase">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Customer Support Guarantees</span>
                </div>
                <ul className="space-y-2 text-[11px] text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>Direct WhatsApp sizing advice before dispatch.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>14-day hassle-free size exchange guarantee on all products.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-black">&bull;</span>
                    <span>Lifetime warranty on genuine leather and solid brass hardware.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="border-t border-black/10 pt-10 mb-8 font-sans">
            <span className="font-mono text-[10px] sm:text-xs uppercase text-neutral-500 font-bold block mb-1">
              // HELPFUL INFORMATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              FREQUENTLY ASKED QUESTIONS
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