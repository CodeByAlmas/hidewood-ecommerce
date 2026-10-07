'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from './Navbar';

// 1. Custom Typewriter Hook
export function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevMouseX = useRef<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const servicesList = [
    'Raw Heritage Belts',
    'Custom Solid Brass Buckle',
    'Laser Monogramming',
    'Bespoke Waist Tailoring',
    'Corporate Gifting'
  ];

  // Typewriter Hook
  const { displayed, done } = useTypewriter(
    "handcrafted full-grain leather.\nbuilt to outlive you.",
    38,
    700
  );

  // 2. Video Scrubbing & Autoplay Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024 || !video || !video.duration) return;

      if (prevMouseX.current === null) {
        prevMouseX.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevMouseX.current;
      prevMouseX.current = e.clientX;

      const change = (delta / window.innerWidth) * 0.8 * video.duration;
      const targetTime = Math.max(0, Math.min(video.duration, video.currentTime + change));

      video.currentTime = targetTime;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Multi-Select Toggle Handler
  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  return (
    <div className="relative w-full bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Interactive Sticky Header */}
      <Navbar />

      {/* Background Video Component (with Native Scrubbing) */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
        />
        {/* Subtle Gradient Veil for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent lg:w-3/5" />
      </div>

      {/* Content Layout Container: max-w-none with fluid padding for true full-width */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main id="spade-hero" className="w-full max-w-none mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-28 sm:pt-32 pb-12 flex-1 flex flex-col justify-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFBF9] border border-[#E3E7E2] w-fit mb-4 sm:mb-6 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1C2E1E]" />
            <span className="text-[11px] sm:text-[12px] tracking-widest font-semibold uppercase text-[#1C2E1E]">
              Grade-A Tuscan Vegetable Tanned
            </span>
          </motion.div>

          {/* Typewriter Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-6 sm:mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Secondary Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-8 sm:mb-14 max-w-3xl"
          >
            Tired of bonded leather cracking after six months? Hidewood crafts heirloom belts from 
            unsplit 4.2mm full-grain hides, finished with hand-burnished beeswax and solid forged brass.
          </motion.p>

          {/* Interactive Multi-Select Pills */}
          <div className="max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-1 sm:mb-2 text-neutral-900">
              What are you building?
            </h3>
            <p className="opacity-85 text-[#738273] mb-6 sm:mb-8 text-xs sm:text-sm">
              Select all options that match your preference for bespoke leather craft
            </p>

            {/* Pill Container */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              {servicesList.map(item => {
                const isSelected = selectedServices.includes(item);
                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => toggleService(item)}
                    whileTap={{ scale: 0.96 }}
                    className={`inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/20'
                        : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 stroke-[3]" />
                      </motion.span>
                    )}
                    {item}
                  </motion.button>
                );
              })}
            </div>

            {/* Contingent Feedback Status Banner */}
            <AnimatePresence mode="wait">
              {selectedServices.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="text-xs italic text-neutral-500 py-2"
                >
                  Please click to select services above to configure your bespoke specs.
                </motion.div>
              ) : (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-2">
                    <div>
                      <p className="text-[11px] sm:text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-0.5 sm:mb-1">
                        Selected Configuration:
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-neutral-900">
                        {selectedServices.join(' • ')}
                      </p>
                    </div>

                    <a
                      href="#archive"
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#1C2E1E] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      <span className="text-white">Let&apos;s Go</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}