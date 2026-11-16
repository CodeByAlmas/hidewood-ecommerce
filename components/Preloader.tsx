'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const LETTER_MASKS = [
  { char: 'H', enterTrigger: 14, enterDuration: 0.72, exitDelay: 0.22, exitDuration: 0.45 },
  { char: 'I', enterTrigger: 4,  enterDuration: 0.56, exitDelay: 0.12, exitDuration: 0.40 },
  { char: 'D', enterTrigger: 20, enterDuration: 0.66, exitDelay: 0.04, exitDuration: 0.42 },
  { char: 'E', enterTrigger: 8,  enterDuration: 0.60, exitDelay: 0.00, exitDuration: 0.38 },
  { char: 'W', enterTrigger: 26, enterDuration: 0.70, exitDelay: 0.16, exitDuration: 0.44 },
  { char: 'O', enterTrigger: 11, enterDuration: 0.68, exitDelay: 0.28, exitDuration: 0.48 },
  { char: 'O', enterTrigger: 32, enterDuration: 0.64, exitDelay: 0.08, exitDuration: 0.40 },
  { char: 'D', enterTrigger: 18, enterDuration: 0.62, exitDelay: 0.25, exitDuration: 0.46 },
];

interface CardSpecimen {
  id: number;
  img: string;
  defaultRot: number;
  trigger: number;
  label: string;
}

const BASE_CARDS: CardSpecimen[] = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
    defaultRot: -9,
    trigger: 5,
    label: 'FULL-GRAIN HIDE',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    defaultRot: 7,
    trigger: 15,
    label: 'SOLID BRASS',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    defaultRot: -5,
    trigger: 25,
    label: 'HAND-STITCHED',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    defaultRot: 10,
    trigger: 35,
    label: 'VEG-TANNED',
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    defaultRot: -3,
    trigger: 45,
    label: 'SADDLE GRADE',
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    defaultRot: 5,
    trigger: 55,
    label: 'KANPUR ATELIER',
  },
];

const ZOOM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SHRINK_EASE: [number, number, number, number] = [0.7, 0, 0.3, 1];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [counter, setCounter] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const hasCompletedRef = useRef(false);

  // Randomize card order, subtle tilt angles & slight micro-offsets on every refresh
  const [randomizedCards, setRandomizedCards] = useState(() =>
    BASE_CARDS.map((card) => ({
      ...card,
      rot: card.defaultRot,
      x: 0,
      y: 0,
    }))
  );

  useEffect(() => {
    const shuffled = [...BASE_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => {
        const sign = index % 2 === 0 ? 1 : -1;
        const randomAngle = sign * (Math.floor(Math.random() * 9) + 3); // -11deg to +11deg
        const microX = Math.floor(Math.random() * 14) - 7; // -7px to +7px subtle deck offset
        const microY = Math.floor(Math.random() * 14) - 7;
        return {
          ...card,
          trigger: 5 + index * 10,
          rot: randomAngle,
          x: microX,
          y: microY,
        };
      });

    setRandomizedCards(shuffled);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 2600;
    const startTime = performance.now();

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      const easedProgress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentCount = Math.min(100, Math.round(easedProgress * 100));
      setCounter(currentCount);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => setIsReversing(true), 200);
        setTimeout(() => setShowCurtain(true), 760);
        setTimeout(() => onComplete(), 1300);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  const formattedCounter =
    counter < 10 ? `00${counter}` : counter < 100 ? `0${counter}` : '100';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading HIDEWOOD Kanpur Atelier: ${counter}%`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-6 sm:py-10 px-4 sm:px-8 select-none overflow-hidden bg-[#080808]"
    >
      {/* TOP RAZOR PROGRESS LINE */}
      <div className="fixed top-0 inset-x-0 h-[2px] bg-white/10 z-20 pointer-events-none">
        <div
          className="h-full bg-white transition-all duration-100 ease-out"
          style={{ width: `${counter}%` }}
        />
      </div>

      {/* 1. TOP BAR */}
      <div className="w-full max-w-[1800px] flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.2em] text-neutral-400 uppercase z-20">
        <span className="text-neutral-500">KANPUR // 26.4499° N</span>
        <span className="text-neutral-500">100% REAL HIDE</span>
      </div>

      {/* 2. TRANSITION CURTAIN (Bottom-to-Top Wipe) */}
      {showCurtain && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.52, ease: [0.83, 0, 0.17, 1] }}
          className="absolute inset-0 bg-[#F8F8F6] origin-bottom z-50 pointer-events-none"
        />
      )}

      {/* 3. CENTER STAGE */}
      <div className="relative w-full max-w-[330px] sm:max-w-[480px] md:max-w-[560px] h-[320px] sm:h-[380px] flex items-center justify-center my-auto">
        {/* TOP-RIGHT STAGE COUNTER */}
        <motion.div
          animate={
            isReversing
              ? { opacity: 0, y: -12, transition: { duration: 0.3, ease: SHRINK_EASE } }
              : { opacity: 1, y: 0 }
          }
          className="absolute top-4 right-3 sm:top-6 sm:right-6 z-40 font-mono text-xs sm:text-sm tracking-[0.15em] text-white font-bold tabular-nums"
        >
          {formattedCounter}
        </motion.div>

        {/* STACKED CARDS: Pure Center Zoom-In (scale 0 -> 1) & Center Shrink-Out (scale 1 -> 0) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {randomizedCards.map((card, idx) => {
            const isVisible = counter >= card.trigger;

            return (
              <motion.div
                key={card.id}
                initial={{ scale: 0, rotate: 0, x: 0, y: 0 }}
                animate={
                  isReversing
                    ? {
                        scale: 0,
                        rotate: 0,
                        x: 0,
                        y: 0,
                        transition: {
                          duration: 0.38,
                          delay: (randomizedCards.length - 1 - idx) * 0.04,
                          ease: SHRINK_EASE,
                        },
                      }
                    : isVisible
                    ? {
                        scale: 1,
                        rotate: card.rot,
                        x: card.x,
                        y: card.y,
                        transition: {
                          duration: 0.55,
                          ease: ZOOM_EASE,
                        },
                      }
                    : { scale: 0, rotate: 0, x: 0, y: 0 }
                }
                style={{
                  transformOrigin: 'center center',
                  zIndex: 10 + idx,
                }}
                className="absolute w-[155px] h-[215px] sm:w-[195px] sm:h-[265px] bg-white rounded-md sm:rounded-lg p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between border border-neutral-300 will-change-transform"
              >
                <div className="w-full h-[155px] sm:h-[195px] bg-neutral-900 rounded-xs overflow-hidden relative">
                  <img
                    src={card.img}
                    alt={`${card.label} leather specimen`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-xs shadow-xs" />
                  <div className="absolute bottom-1.5 left-1.5 text-[7px] sm:text-[8px] font-mono text-white bg-black/90 px-1.5 py-0.5 uppercase tracking-wider">
                    0{idx + 1} // {card.label}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200 font-mono text-[8px] sm:text-[9px] text-black">
                  <span className="font-bold tracking-wider">HIDEWOOD</span>
                  <span className="text-black font-extrabold">&bull;&bull;</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 4. TYPOGRAPHY: BOTTOM-TO-TOP ENTRY & UPWARD EXIT WITH INDEPENDENT LETTER TIMINGS */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ mixBlendMode: 'difference' }}
        >
          <div className="flex items-center justify-center font-black tracking-tighter text-white select-none">
            {LETTER_MASKS.map((item, index) => {
              const isVisible = counter >= item.enterTrigger;

              return (
                <div
                  key={index}
                  className="overflow-hidden inline-block relative py-1 px-[0.5px] sm:px-[1px]"
                >
                  <motion.span
                    initial={{ y: '115%' }}
                    animate={
                      isReversing
                        ? {
                            y: '-115%',
                            transition: {
                              duration: item.exitDuration,
                              delay: item.exitDelay,
                              ease: SHRINK_EASE,
                            },
                          }
                        : isVisible
                        ? {
                            y: '0%',
                            transition: {
                              duration: item.enterDuration,
                              ease: ZOOM_EASE,
                            },
                          }
                        : { y: '115%' }
                    }
                    className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl uppercase inline-block font-sans leading-none will-change-transform"
                  >
                    {item.char}
                  </motion.span>
                </div>
              );
            })}

            {/* Trade Mark (TM) Symbol */}
            <div className="overflow-hidden inline-block self-start mt-1 ml-0.5 sm:ml-1">
              <motion.span
                initial={{ y: '115%' }}
                animate={
                  isReversing
                    ? {
                        y: '-115%',
                        transition: {
                          duration: 0.4,
                          delay: 0.32,
                          ease: SHRINK_EASE,
                        },
                      }
                    : counter >= 24
                    ? {
                        y: '0%',
                        transition: {
                          duration: 0.55,
                          ease: ZOOM_EASE,
                        },
                      }
                    : { y: '115%' }
                }
                className="text-[10px] sm:text-xs md:text-sm font-sans font-bold inline-block text-white"
              >
                &trade;
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM FOOTER TICKER */}
      <div className="w-full max-w-[1800px] flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest text-neutral-500 uppercase z-20">
        <span>ARCHIVE INITIALIZING</span>
        <span className="text-neutral-400">ZERO CARDBOARD CORE</span>
        <span className="hidden sm:inline-block">&copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}