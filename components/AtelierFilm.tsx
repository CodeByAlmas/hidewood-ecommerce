'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Disc3, Eye, Sparkles } from 'lucide-react';
import { TextRoll } from './Navbar';

const CHANNELS = [
  {
    id: 'kinetic',
    num: '01',
    label: 'KINETIC CUT',
    tag: 'RHYTHM // ATELIER',
    src: '/video-kinetic.mp4',
    title: 'Kinetic Tension & Craft Pace.',
    desc: 'High-contrast studio tempo capturing unsplit Tuscan hide elasticity and heavy stitch pressure.',
    icon: Sparkles,
  },
  {
    id: 'macro',
    num: '02',
    label: 'MACRO SPECIMEN',
    tag: '4.2MM UP-CLOSE',
    src: '/video-macro.mp4',
    title: 'Pore Grain & Sand-Cast Brass.',
    desc: 'Micro-lens inspection of vegetable-tanned bovine fibers, beeswax-beveled edges, and raw graphite metal.',
    icon: Disc3,
  },
  {
    id: 'campaign',
    num: '03',
    label: 'ON-BODY CAMPAIGN',
    tag: 'TAILORED FIT',
    src: '/video-model.mp4',
    title: 'Draped for Movement & Suiting.',
    desc: 'Bespoke waist calibration in motion. Styled on raw Japanese denim and tailored Italian wool trousers.',
    icon: Eye,
  },
];

interface AtelierFilmProps {
  isReady?: boolean;
}

export default function AtelierFilm({ isReady = true }: AtelierFilmProps) {
  const [activeChannel, setActiveChannel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = CHANNELS[activeChannel];

  useEffect(() => {
    if (!isReady) return;

    const checkView = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        setHasTriggered(true);
      }
    };

    const timer = setTimeout(checkView, 150);
    window.addEventListener('scroll', checkView, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkView);
    };
  }, [isReady]);

  // Handle video playback on channel switch
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeChannel]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    /* TOP BLACK BORDER REMOVED (border-t-2 border-black deleted) */
    <section
      ref={sectionRef}
      id="film"
      className="relative w-screen left-1/2 -translate-x-1/2 pt-6 sm:pt-10 pb-16 sm:pb-24 select-none overflow-hidden"
    >
      <div className="w-full px-2 sm:px-4 md:px-6">
        
        {/* SECTION TOP SUB-BAR & MULTI-CHANNEL SWITCHER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-black/10 mb-6 sm:mb-8 font-sans">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse shrink-0" />
            <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-black">
              The Atelier Film &bull; Tri-Channel Cinema
            </h2>
          </div>

          {/* CHANNEL SWITCHER TABS: Mobile-friendly horizontal scroll track */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CHANNELS.map((ch, idx) => {
              const Icon = ch.icon;
              const isSelected = activeChannel === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChannel(idx);
                    setIsPlaying(true);
                  }}
                  className={`px-3 py-1.5 border uppercase tracking-wider text-[10px] sm:text-[11px] font-mono transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white text-neutral-600 border-black/15 hover:border-black'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                  <span>CH // 0{ch.num}</span>
                  <span className="hidden sm:inline font-bold">&bull; {ch.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FULL-BLEED CINEMATIC FRAME: Responsive Aspect Ratio */}
        <motion.div
          initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, x: -20 }}
          animate={
            hasTriggered
              ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, x: 0 }
              : { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, x: -20 }
          }
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-neutral-950 border border-black/15 overflow-hidden group shadow-lg"
        >
          {/* ACTIVE CHANNEL VIDEO */}
          <video
            ref={videoRef}
            key={current.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-102"
            src={current.src}
          />

          {/* CINEMATIC MONOCHROME GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

          {/* TOP HUD ROW */}
          <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between text-white font-mono text-[9px] sm:text-xs uppercase">
            <div className="bg-black/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/15 flex items-center gap-2">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="tracking-wider">{current.tag}</span>
              <span className="text-neutral-500 hidden sm:inline">&bull; 4K 24FPS</span>
            </div>

            {/* AUDIO & PLAY/PAUSE CONTROLS */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={togglePlay}
                className="p-1.5 sm:p-2 bg-black/80 hover:bg-white hover:text-black text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Toggle Play"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-1.5 sm:p-2 bg-black/80 hover:bg-white hover:text-black text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Toggle Mute"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* BOTTOM MANIFESTO OVERLAY */}
          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-3 text-white">
            <div className="max-w-2xl">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 tracking-widest block mb-1">
                CHANNEL 0{current.num} &bull; {current.label}
              </span>
              <h3 className="text-base sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight">
                <TextRoll className="font-black text-white">
                  {current.title}
                </TextRoll>
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-300 font-normal leading-relaxed mt-1 sm:mt-1.5 max-w-xl">
                {current.desc}
              </p>
            </div>

            <div className="font-mono text-left md:text-right text-[9px] sm:text-[10px] text-neutral-400 shrink-0">
              <div>EST. 2026 INDIA</div>
              <div className="text-white font-bold tracking-wider">EXPEDITED WORLDWIDE AIR</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}