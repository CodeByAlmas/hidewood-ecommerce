'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const BRAND_NAME = 'HIDEWOOD';

const LETTER_DELAYS = [0.12, 0.22, 0.16, 0.28, 0.14, 0.25, 0.18, 0.30];

// RedTape inspired customer-friendly value guarantees
const COMMERCIAL_HIGHLIGHTS = [
  '100% REAL FULL-GRAIN LEATHER — ZERO CARDBOARD FILLERS',
  'FREE EXPRESS DELIVERY ON ORDERS ABOVE ₹5,000 ACROSS INDIA',
  'LIFETIME REPAIR & DURABILITY GUARANTEE ON EVERY BELT',
  'EASY 14-DAY SIZE REPLACEMENT & HASSLE-FREE RETURNS',
  'PURE SOLID BRASS BUCKLES — BUILT TO NEVER SNAP OR TARNISH',
];

export default function HeroTitle() {
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 pt-1 pb-4 sm:pb-6 select-none overflow-hidden">
      
      {/* 1. GIANT EDITORIAL HEADLINE */}
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

        {/* 2. FULL-BLEED BOTTOM DIVIDER LINE */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2.5px] bg-black origin-left mt-4 sm:mt-5"
        />
      </div>

      {/* 3. RUNNING TICKER RIBBON (Commercial & Clean) */}
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
          {[...COMMERCIAL_HIGHLIGHTS, ...COMMERCIAL_HIGHLIGHTS].map((text, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 sm:gap-3.5 px-4 sm:px-6 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold"
            >
              <span className="text-white flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>

              <span className="text-white hover:text-neutral-300 transition-colors">
                {text}
              </span>

              <span className="text-neutral-500 font-mono font-bold pl-1 sm:pl-2">
                &bull;
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

    </section>
  );
}