'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileText,
  ChevronDown,
  ArrowUpRight,
  Fingerprint,
} from 'lucide-react';

interface PrivacySection {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  articles: {
    heading: string;
    body: string;
    guarantee: string;
  }[];
}

const PRIVACY_CODEX: PrivacySection[] = [
  {
    id: 'tracking',
    code: 'CODEX 01',
    title: 'Zero-Telemetry & Pixel Isolation',
    subtitle: 'No Cross-Site Ad Harvesting',
    articles: [
      {
        heading: '1.1 Third-Party Ad Tracker Prohibition',
        body: 'HIDEWOOD Atelier operates zero third-party behavioral trackers, cross-site surveillance cookies, or social media remarketing pixels (e.g. Meta Pixel, TikTok tracking). Your browsing behavior across our archive remains completely unshared.',
        guarantee: 'Zero commercial data brokering or ad monetization.',
      },
      {
        heading: '1.2 First-Party Functional Cookies Only',
        body: 'Cookies deposited on your machine serve strictly operational utilities: persisting your bespoke cart state, remembering size configurations (+2" rule), and validating your encrypted patron session keycard.',
        guarantee: 'Session tokens expire automatically after 30 days of inactivity.',
      },
    ],
  },
  {
    id: 'vault',
    code: 'CODEX 02',
    title: 'Patron Ledger & Vault Encryption',
    subtitle: 'AES-256 Storage Architecture',
    articles: [
      {
        heading: '2.1 Commission & Measurement Records',
        body: 'Physical waist measurements, custom debossed monograms, and airway delivery addresses are housed inside an isolated PostgreSQL vault. Data in transit is secured via TLS 1.3, and data at rest is protected with AES-256 encryption.',
        guarantee: 'Accessible exclusively by the Kanpur bench fulfillment master.',
      },
      {
        heading: '2.2 Payment Tokenization & PCI-DSS Compliance',
        body: 'At no stage does HIDEWOOD store, process, or view your complete credit card digits or UPI security pins. Payment authorization is conducted through end-to-end tokenized gateways (Stripe PCI-DSS Level 1 certified).',
        guarantee: 'Zero payment credential retention on atelier servers.',
      },
    ],
  },
  {
    id: 'rights',
    code: 'CODEX 03',
    title: 'Sovereignty & Archival Expungement',
    subtitle: 'GDPR, CCPA & DPDP Compliance',
    articles: [
      {
        heading: '3.1 The Right to Complete Erasure (Expungement)',
        body: 'Under European GDPR, California CCPA, and Indian DPDP Act 2023, you hold absolute sovereignty over your records. At any point, a patron may issue an expungement request to permanently purge shipping addresses, phone records, and email archives.',
        guarantee: 'Execution completed within 72 hours of cryptographically signed request.',
      },
      {
        heading: '3.2 Warranty Integrity Retention',
        body: 'If you choose complete data erasure, your 100-Year Structural Integrity Warranty is decoupled from your email and assigned to your physical physical Certificate of Authenticity serial number printed on your box.',
        guarantee: 'Your 100-year guarantee remains active via physical certificate.',
      },
    ],
  },
];

export default function PrivacyCodePage() {
  const [activeAccordion, setActiveAccordion] = useState<string>('tracking');

  // Structured Data Schema for Search Engines & AI Crawlers
  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Code & Archival Audit | HIDEWOOD Atelier',
    description:
      'Official privacy codex of HIDEWOOD Atelier: Zero ad tracking, AES-256 encrypted patron ledger, PCI-DSS Level 1 payment isolation, and GDPR/CCPA archival rights.',
    url: 'https://hidewood.example.com/privacy',
    publisher: {
      '@type': 'Organization',
      name: 'HIDEWOOD Atelier',
      url: 'https://hidewood.example.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
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
              <span>Return to Index</span>
            </Link>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>SECURITY CIPHER</span>
              <span>&bull;</span>
              <span className="text-black font-bold">ZERO-SURVEILLANCE</span>
            </div>
          </div>
        </section>

        {/* HERO TITLE */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Sovereign Privacy Architecture &bull; Revision 2026.4
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-none font-sans">
                PRIVACY CODE.
              </h1>
            </div>

            <div className="border border-black bg-white p-4 sm:p-5 flex items-center gap-6 font-mono text-xs shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-black" />
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    ENCRYPTION STANDARD
                  </span>
                  <span className="font-bold text-black text-sm">AES-256 + TLS 1.3</span>
                </div>
              </div>
              <div className="border-l border-black/15 pl-6">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  AD TRACKERS
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  0 ACTIVE PIXELS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* THREE FOUNDATIONAL SECURITY PILLARS */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-14 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="border border-black bg-white p-6 shadow-xs">
              <EyeOff className="w-6 h-6 text-black mb-4" />
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                Zero Ad Monetization
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                We do not sell patron records to ad brokers or install behavioral tracking beacons. Your interest in bespoke leather is private.
              </p>
            </div>

            <div className="border border-black bg-white p-6 shadow-xs">
              <Database className="w-6 h-6 text-black mb-4" />
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                Sovereign Vault Storage
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                Order histories and custom initials are kept in encrypted server databases with zero public search exposure.
              </p>
            </div>

            <div className="border border-black bg-white p-6 shadow-xs">
              <Fingerprint className="w-6 h-6 text-black mb-4" />
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                Right to Erasure
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                Full GDPR and DPDP compliance. Request complete expungement of your communication logs at any time.
              </p>
            </div>
          </div>
        </section>

        {/* ACCORDION CODEX SECTIONS */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="space-y-6">
            {PRIVACY_CODEX.map((section) => {
              const isOpen = activeAccordion === section.id;
              return (
                <div
                  key={section.id}
                  className="border border-black bg-white transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isOpen ? '' : section.id)}
                    className="w-full p-6 sm:p-8 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400 font-bold mb-1 uppercase">
                        <span>{section.code}</span>
                        <span>&bull;</span>
                        <span>{section.subtitle}</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black font-sans group-hover:underline">
                        {section.title}
                      </h2>
                    </div>

                    <div className="w-9 h-9 border border-black/20 flex items-center justify-center group-hover:border-black transition-colors shrink-0 ml-4">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-black' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-black/10 px-6 sm:px-8 pb-8 pt-6 bg-[#FAFAFA]"
                      >
                        <div className="space-y-6 divide-y divide-black/10 font-mono">
                          {section.articles.map((article, aIdx) => (
                            <div key={aIdx} className="pt-5 first:pt-0">
                              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-black mb-2 font-sans">
                                {article.heading}
                              </h4>
                              <p className="text-xs text-neutral-600 leading-relaxed mb-2 font-normal">
                                {article.body}
                              </p>
                              <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>// GUARANTEE: {article.guarantee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM AUDIT & EXPUNGEMENT TRANSMISSION BOX */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="border border-black bg-black text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
            <div>
              <span className="text-neutral-400 uppercase text-[10px] block mb-1">
                // PRIVACY DESK &amp; DATA ARBITRATION
              </span>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-sans">
                Request an Archival Expungement or Vault Audit
              </h3>
              <p className="text-neutral-400 text-[11px] max-w-xl mt-1 leading-relaxed">
                Connect with our compliance officer at privacy@hidewood.com to receive an encrypted dump or trigger permanent record erasure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="bg-white text-black hover:bg-neutral-200 px-6 py-3 font-bold text-center uppercase tracking-widest text-[11px] transition-colors"
              >
                Contact Privacy Desk
              </Link>
              <Link
                href="/terms"
                className="border border-white/20 hover:border-white px-6 py-3 font-bold text-center text-white uppercase tracking-widest text-[11px] transition-colors"
              >
                Review Terms of Dispatch
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}