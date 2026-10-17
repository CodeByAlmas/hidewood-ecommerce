'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scale,
  Award,
  ChevronDown,
  ArrowUpRight,
  Plane,
  FileCheck,
} from 'lucide-react';

interface PolicySection {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  clauses: {
    heading: string;
    body: string;
    specNote?: string;
  }[];
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'warranty',
    code: 'CODEX 01',
    title: '100-Year Structural Integrity Bond',
    subtitle: 'Century-Tier Archival Guarantee',
    clauses: [
      {
        heading: '1.1 Collagen Fiber Integrity',
        body: 'Every HIDEWOOD belt is cut exclusively from 4.2mm single-origin bovine butt, retaining its full unsplit grain. If your belt experiences fiber tear, delamination, or structural split under normal wear within 100 years of commission, the atelier will re-craft or replace your piece free of charge.',
        specNote: 'Excludes intentional blade cuts or acidic chemical immersion.',
      },
      {
        heading: '1.2 Solid Sand-Cast Metallurgy',
        body: 'Buckles are sand-cast from molten virgin brass and copper alloys. If a buckle cracks, fractures, or suffers structural failure at the prong or crossbar, it is covered by lifetime metallurgical replacement.',
        specNote: 'Surface oxidation and patina darkening are natural characteristics, not defects.',
      },
      {
        heading: '1.3 Saddle-Stitch & Rivet Guarantee',
        body: 'All peened solid copper rivets and hand saddle-stitched waxed threads are bound by zero-failure tolerances. Any loosened hardware will be re-peened at our Kanpur bench.',
      },
    ],
  },
  {
    id: 'dispatch',
    code: 'CODEX 02',
    title: 'International Dispatch & Customs (DDP)',
    subtitle: 'Global Logistics Protocol',
    clauses: [
      {
        heading: '2.1 Delivered Duty Paid (DDP) Clearance',
        body: 'For international patrons (United States, United Kingdom, European Union, UAE, Japan), all import duties and local luxury taxes are calculated at checkout. Parcels arrive with zero clearance friction or surprise customs billing at your door.',
        specNote: 'Dispatched via priority BlueDart Airway / DHL Express Air.',
      },
      {
        heading: '2.2 Handcrafted Turnaround Timeline',
        body: 'In-stock Series 01 belts dispatch within 24 to 48 hours in sealed archival cedarwood boxes. Custom debossed monograms require an additional 24 hours of bench stamping and hot-plate curing.',
      },
      {
        heading: '2.3 Airway Tracking & Insured Transit',
        body: 'Every dispatch carries full transit insurance against loss, theft, or courier mishandling. Waybill telemetry is transmitted via encrypted SMS and email upon airport scan.',
      },
    ],
  },
  {
    id: 'returns',
    code: 'CODEX 03',
    title: '14-Day Exchange & Sizing Protocol',
    subtitle: 'Bespoke Fit Correction',
    clauses: [
      {
        heading: '3.1 The +2" Sizing Correction Policy',
        body: 'If you selected the incorrect waist size despite our +2" denim guideline, you may request a size exchange within 14 days of delivery. The leather must remain unworn with no additional belt holes punched.',
        specNote: 'Return shipping is complimentary for domestic exchanges.',
      },
      {
        heading: '3.2 Custom Monogrammed Artifacts',
        body: 'Pieces stamped with personal blind-debossed initials are bespoke commissions crafted specifically for you. While they cannot be returned for cash refund, our 100-Year Structural Warranty remains fully active.',
      },
      {
        heading: '3.3 Archival Packaging Condition',
        body: 'Exchanges must include the original cotton dust pouch, certificate of authenticity card, and cedarwood shavings box.',
      },
    ],
  },
];

export default function TermsOfDispatchPage() {
  const [activeAccordion, setActiveAccordion] = useState<string>('warranty');

  // Structured Data Schema (AEO / GEO / Schema.org)
  const legalSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Dispatch, 100-Year Warranty & Returns | HIDEWOOD Atelier',
    description:
      'Official legal codex of HIDEWOOD: 100-Year Structural Integrity Guarantee, Delivered Duty Paid (DDP) international logistics, and 14-day sizing exchange protocols.',
    url: 'https://hidewood.example.com/terms',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 sm:pb-32 overflow-x-hidden">
        
        {/* TOP HUD BREADCRUMB */}
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
              <span>LEGAL CODEX</span>
              <span>&bull;</span>
              <span className="text-black font-bold">REVISION 2026.4</span>
            </div>
          </div>
        </section>

        {/* HERO HEADER */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Atelier Standards &bull; International B2C Protection
                </span>
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-none font-sans">
                TERMS &amp; BOND.
              </h1>
            </div>

            <div className="border border-black bg-white p-4 sm:p-5 flex items-center gap-6 font-mono text-xs shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-black" />
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    GOVERNING LAW
                  </span>
                  <span className="font-bold text-black text-sm">KANPUR JURISDICTION</span>
                </div>
              </div>
              <div className="border-l border-black/15 pl-6">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  WARRANTY BOND
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CENTURY TIER
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS AT A GLANCE */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-14 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="border border-black bg-white p-6 shadow-xs">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                100-Year Hide Warranty
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                Guaranteed against structural fiber failure, split, or hardware crack. We repair or replace without depreciation.
              </p>
            </div>

            <div className="border border-black bg-white p-6 shadow-xs">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                DDP Global Courier
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                Zero hidden duties for US, EU, UK &amp; GCC patrons. All customs tariffs and sales taxes prepaid by the atelier.
              </p>
            </div>

            <div className="border border-black bg-white p-6 shadow-xs">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-black mb-1 font-sans">
                14-Day Size Exchange
              </h3>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                Simple sizing adjustments on standard pieces. Hand-cut bespoke adjustments executed at our Kanpur bench.
              </p>
            </div>
          </div>
        </section>

        {/* DETAILED CODEX ACCORDION SECTION */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
          <div className="space-y-6">
            {POLICY_SECTIONS.map((section) => {
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
                          {section.clauses.map((clause, cIdx) => (
                            <div key={cIdx} className="pt-5 first:pt-0">
                              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-black mb-2 font-sans">
                                {clause.heading}
                              </h4>
                              <p className="text-xs text-neutral-600 leading-relaxed mb-2 font-normal">
                                {clause.body}
                              </p>
                              {clause.specNote && (
                                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                  // NOTE: {clause.specNote}
                                </div>
                              )}
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

        {/* BOTTOM CONCIERGE ASSISTANCE ROW */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="border border-black bg-black text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
            <div>
              <span className="text-neutral-400 uppercase text-[10px] block mb-1">
                // LEGAL &amp; CLAIMS ARBITRATION
              </span>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-sans">
                Require a Warranty Inspection or Exchange?
              </h3>
              <p className="text-neutral-400 text-[11px] max-w-xl mt-1 leading-relaxed">
                Connect directly with our master bench desk with your Order Serial registry number.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="bg-white text-black hover:bg-neutral-200 px-6 py-3 font-bold text-center uppercase tracking-widest text-[11px] transition-colors"
              >
                Contact Concierge Desk
              </Link>
              <Link
                href="/orders"
                className="border border-white/20 hover:border-white px-6 py-3 font-bold text-center text-white uppercase tracking-widest text-[11px] transition-colors"
              >
                View Patron Orders
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}