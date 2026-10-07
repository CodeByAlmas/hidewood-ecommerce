'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const BRAND_NAME = 'HIDEWOOD';

// Exact delays aur zero-bounce curve (Unchanged)
const LETTER_DELAYS = [0.12, 0.22, 0.16, 0.28, 0.14, 0.25, 0.18, 0.30];

// Warning / Caution Tape Ticker Items
const CAUTION_TAPE_ITEMS = [
  'WARNING // DROP 01 ARCHIVE RUN: ONLY 14 STRAPS REMAINING',
  'CAUTION // 100% UNSPLIT TUSCAN STEERHIDE — ZERO SYNTHETIC CARDBOARD CORE',
  'NOTICE // 100-YEAR HERITAGE WARRANTY BOND INCLUDED WITH EVERY COMMISSION',
  'RESTRICTED // BESPOKE SIZING ACTIVE — COMPLIMENTARY EXPEDITED DISPATCH OVER ₹5,000',
  'CAUTION // DO NOT APPLY SYNTHETIC WAXES — VEGETABLE TANNIN PATINA IN PROGRESS',
];

export default function HeroTitle() {
  return (
    /* FULL VIEWPORT BREAKOUT: w-screen left-1/2 -translate-x-1/2 makes it edge-to-edge */
    <section className="relative w-screen left-1/2 -translate-x-1/2 pt-1 pb-4 sm:pb-6 select-none overflow-hidden">
      
      {/* 1. ORIGINAL GIANT TALL EDITORIAL HEADLINE WITH ATTACHED TM */}
      <div className="relative overflow-visible w-full px-2 sm:px-4 md:px-6">
        <div className="w-full flex items-end justify-between overflow-visible">
          
          <h1 className="w-full flex items-baseline justify-between font-black tracking-[-0.035em] uppercase font-sans select-none text-[15.8vw] sm:text-[15.5vw] md:text-[15.2vw] leading-[0.84] origin-bottom scale-y-[1.38] transform-gpu overflow-visible text-black">
            
            <span className="flex items-baseline overflow-visible w-full justify-between">
              {BRAND_NAME.split('').map((char, index) => {
                const isLast = index === BRAND_NAME.length - 1;

                return (
                  <span
                    key={index}
                    className="relative inline-flex items-baseline overflow-hidden pt-7 sm:pt-8 pb-1 px-[0.5px] sm:px-[1px]"
                  >
                    <motion.span
                      initial={{ y: '115%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 1.05,
                        delay: LETTER_DELAYS[index] || 0.15 + index * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block text-black"
                    >
                      {char}
                    </motion.span>

                    {/* TM MARK: Seedhe aakhiri letter 'D' ke saath attached */}
                    {isLast && (
                      <span className="relative inline-block overflow-hidden self-end pb-1 pl-0.5 sm:pl-1 select-none">
                        <motion.span
                          initial={{ y: '115%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          transition={{
                            duration: 0.95,
                            delay: 0.38,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="text-[3.4vw] sm:text-[2.8vw] md:text-[2.4vw] lg:text-[2.1vw] font-black text-black tracking-tight font-sans inline-block leading-none"
                        >
                          &trade;
                        </motion.span>
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
          </h1>

        </div>

        {/* 2. FULL-BLEED BOTTOM DIVIDER LINE (Halka sa gap restore kiya) */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2.5px] bg-black origin-left mt-4 sm:mt-5"
        />
      </div>

      {/* 3. ATELIER HAZARD / CAUTION WARNING RIBBON RUNWAY (EDGE-TO-EDGE FULL BLEED) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden border-y-2 border-black bg-black text-white py-2 sm:py-2.5 my-2 shadow-xs group"
      >
        <motion.div
          className="flex w-fit whitespace-nowrap cursor-default"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 22,
            repeat: Infinity,
          }}
        >
          {[...CAUTION_TAPE_ITEMS, ...CAUTION_TAPE_ITEMS].map((text, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 sm:gap-3.5 px-4 sm:px-6 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-black"
            >
              <span className="text-[#FFCC00] flex items-center gap-1.5 shrink-0">
                <AlertTriangle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#FFCC00] stroke-[2.5]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-tighter">///</span>
              </span>

              <span className="text-white hover:text-[#FFCC00] transition-colors">
                {text}
              </span>

              <span className="text-neutral-600 font-mono font-bold pl-1 sm:pl-2">
                /// [ATELIER SECURE] ///
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

    </section>
  );
}