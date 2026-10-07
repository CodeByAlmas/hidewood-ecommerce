'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowUpRight } from 'lucide-react';

const upcomingItems = [
  {
    title: 'The Bifold Heirloom Wallet',
    tag: 'Drop 02 — Autumn',
    desc: 'Unlined 6-slot vegetable tanned Italian saddle leather with saddle-stitched edges.',
    status: 'In Prototyping'
  },
  {
    title: '48-Hour Weekender Duffel',
    tag: 'Drop 03 — Winter',
    desc: 'Heavyweight full-grain leather shell with solid sand-cast brass rivets and YKK Excella zippers.',
    status: 'Waitlist Open'
  },
  {
    title: 'Hand-Cut Watch Straps',
    tag: 'Drop 04',
    desc: 'Bespoke tapered leather bands designed for vintage horology timepieces.',
    status: 'Field Testing'
  }
];

export default function FutureExpansion() {
  return (
    <section id="future-expansion" className="py-24 bg-[#09090b] text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-neutral-800 pb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
              The Living Archive
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Beyond The Belt.
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md mt-4 md:mt-0">
            Hidewood began on the cutting bench mastering belts. Here is what our artisans are preparing for next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="border border-neutral-800/80 bg-neutral-900/40 p-8 rounded-2xl flex flex-col justify-between backdrop-blur-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 bg-neutral-800 rounded-full text-neutral-300">
                    {item.tag}
                  </span>
                  <Lock className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-normal mb-3 text-neutral-100 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/60 flex items-center justify-between">
                <span className="text-xs text-amber-400/80 font-mono">
                  {item.status}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-400 group-hover:text-white transition-colors cursor-pointer">
                  Request Access <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}