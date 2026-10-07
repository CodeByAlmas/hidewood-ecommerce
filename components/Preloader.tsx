'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

// Fixed directional letter reveal configuration (H, I, D, E, W, O, O, D)
const LETTER_MASKS = [
  { char: 'H', from: { y: '105%', x: 0 },   exit: { y: '105%', x: 0 },   delay: 0.10 },
  { char: 'I', from: { y: 0, x: '-105%' }, exit: { y: 0, x: '-105%' }, delay: 0.14 },
  { char: 'D', from: { y: '-105%', x: 0 },  exit: { y: '-105%', x: 0 },  delay: 0.18 },
  { char: 'E', from: { y: '105%', x: 0 },   exit: { y: '105%', x: 0 },   delay: 0.22 },
  { char: 'W', from: { y: 0, x: '105%' },  exit: { y: 0, x: '105%' },  delay: 0.26 },
  { char: 'O', from: { y: '-105%', x: 0 },  exit: { y: '-105%', x: 0 },  delay: 0.30 },
  { char: 'O', from: { y: '105%', x: 0 },   exit: { y: '105%', x: 0 },   delay: 0.34 },
  { char: 'D', from: { y: 0, x: '105%' },  exit: { y: 0, x: '105%' },  delay: 0.38 },
];

// Cards centered: Trigger count tighter rakha hai taaki quickly pop hon
const CARDS_DATA = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
    rot: -10,
    trigger: 10
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    rot: 8,
    trigger: 18
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    rot: -5,
    trigger: 26
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    rot: 12,
    trigger: 34
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    rot: -2,
    trigger: 42
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    rot: 6,
    trigger: 50
  }
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [counter, setCounter] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsReversing(true), 200);
          setTimeout(() => setShowCurtain(true), 650);
          setTimeout(() => onComplete(), 1150);
          return 100;
        }
        return prev + 1;
      });
    }, 24);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden bg-black">
      
      {/* 1. TOP COUNTER TICKER */}
      <div className="absolute top-10 font-mono text-xs tracking-[0.25em] text-neutral-400">
        {counter < 10 ? `00${counter}` : counter < 100 ? `0${counter}` : '100'}
      </div>

      {/* 2. TRANSITION CURTAIN (Black & White Split) */}
      {showCurtain && (
        <>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1] }}
            className="absolute inset-0 bg-[#F8F8F6] origin-bottom z-50"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 0] }}
            transition={{ duration: 0.35 }}
            className="absolute z-[60] w-16 h-16 bg-white border border-black"
          />
        </>
      )}

      {/* 3. CENTER STAGE */}
      <div className="relative w-[340px] sm:w-[420px] h-[340px] flex items-center justify-center">
        
        {/* CARDS (Increased Velocity & Snappy Bloom/Implosion) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {CARDS_DATA.map((card, idx) => {
            const isVisible = counter >= card.trigger;

            return (
              <motion.div
                key={card.id}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={
                  isReversing
                    ? {
                        scale: 0,
                        rotate: 0,
                        opacity: 0,
                        transition: {
                          duration: 0.24,
                          delay: (CARDS_DATA.length - idx) * 0.02,
                          ease: [0.76, 0, 0.24, 1]
                        }
                      }
                    : isVisible
                    ? {
                        scale: 1,
                        rotate: card.rot,
                        opacity: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 550,
                          damping: 26,
                          mass: 0.45
                        }
                      }
                    : { scale: 0, rotate: 0, opacity: 0 }
                }
                style={{
                  transformOrigin: 'center center',
                  zIndex: 10 + idx
                }}
                className="absolute w-[185px] h-[255px] bg-white rounded-lg p-2.5 shadow-2xl flex flex-col justify-between border border-neutral-300"
              >
                {/* Visual */}
                <div className="w-full h-[190px] bg-neutral-900 rounded overflow-hidden relative">
                  <img
                    src={card.img}
                    alt="Leather Frame"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-white rounded-xs shadow-xs" />
                  <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white bg-black px-1.5 py-0.5 uppercase tracking-wider">
                    0{idx + 1}
                  </div>
                </div>

                {/* Sub-bar */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-200 font-mono text-[9px] text-black">
                  <span className="font-bold tracking-wider">HIDEWOOD</span>
                  <span className="text-black font-extrabold">&bull;&bull;</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 4. FIXED TYPOGRAPHY (Directional Masks & Difference Invert Blend) */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ mixBlendMode: 'difference' }}
        >
          <div className="flex items-center justify-center font-black tracking-tighter text-white select-none">
            {LETTER_MASKS.map((item, index) => {
              const isVisible = counter >= 8;

              return (
                <div key={index} className="overflow-hidden inline-block relative py-1 px-[1px]">
                  <motion.span
                    initial={{ x: item.from.x, y: item.from.y }}
                    animate={
                      isReversing
                        ? {
                            x: item.exit.x,
                            y: item.exit.y,
                            transition: {
                              duration: 0.3,
                              delay: (LETTER_MASKS.length - index) * 0.02,
                              ease: [0.7, 0, 0.3, 1]
                            }
                          }
                        : isVisible
                        ? {
                            x: 0,
                            y: 0,
                            transition: {
                              duration: 0.45,
                              delay: item.delay,
                              ease: [0.16, 1, 0.3, 1]
                            }
                          }
                        : { x: item.from.x, y: item.from.y }
                    }
                    className="text-6xl sm:text-7xl uppercase inline-block font-sans leading-none"
                  >
                    {item.char}
                  </motion.span>
                </div>
              );
            })}

            {/* Trade Mark (TM) Symbol */}
            <div className="overflow-hidden inline-block self-start mt-1 ml-1">
              <motion.span
                initial={{ y: '100%' }}
                animate={
                  isReversing
                    ? { y: '-100%', transition: { duration: 0.22 } }
                    : counter >= 15
                    ? { y: '0%', transition: { duration: 0.35, delay: 0.42 } }
                    : { y: '100%' }
                }
                className="text-xs sm:text-sm font-sans font-bold inline-block text-white"
              >
                &trade;
              </motion.span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}