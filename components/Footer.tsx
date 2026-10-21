'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [timeIST, setTimeIST] = useState('16:00:00');
  const [timeCET, setTimeCET] = useState('12:30:00');

  // Live World Clocks
  useEffect(() => {
    setMounted(true);
    const updateClocks = () => {
      const now = new Date();
      setTimeIST(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setTimeCET(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Europe/Rome',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3D Tilt Physics for the Giant Monolith
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 24 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-12deg', '12deg']);
  const textTranslateZ = useTransform(smoothX, [-0.5, 0.5], ['20px', '40px']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#090909] text-white pt-12 sm:pt-16 pb-6 select-none overflow-hidden border-t border-white/10 m-0 z-20 block"
    >
      {/* BACKGROUND SUBTLE RADIAL AMBIENCE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full px-3 sm:px-6 md:px-10">
        
        {/* TOP STATUS BAR: LIVE KANPUR & FLORENCE TELEMETRY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-10 sm:mb-14 border-b border-white/10 font-mono text-[10px] sm:text-xs">
          <div>
            <div className="text-neutral-500 uppercase flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>WORKSHOP // KANPUR</span>
            </div>
            <div className="text-white font-bold tracking-wider">{mounted ? timeIST : '16:00:00'} IST</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>LEATHER SOURCE // ITALY</span>
            </div>
            <div className="text-white font-bold tracking-wider">{mounted ? timeCET : '12:30:00'} CET</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase flex items-center gap-1.5 mb-1">
              <Compass className="w-3 h-3 text-neutral-400" />
              <span>SHIPPING TIME</span>
            </div>
            <div className="text-white font-bold tracking-wider">FAST DELIVERY ACROSS INDIA</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3 h-3 text-red-500" />
              <span>QUALITY GUARANTEE</span>
            </div>
            <div className="text-white font-bold tracking-wider">100% FULL-GRAIN LEATHER</div>
          </div>
        </div>

        {/* MID NAVIGATION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 pb-12 sm:pb-16 border-b border-white/10 font-sans">
          
          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest mb-4">
              PRODUCT CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold tracking-tight uppercase">
              {['Formal & Casual Belts', 'Wallets & Cardholders', 'Travel Duffels & Bags', 'Pure Leather Jackets', 'Handcrafted Shoes'].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality & Policies */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest mb-4">
              OUR QUALITY &amp; POLICIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold tracking-tight uppercase">
              <li>
                <Link
                  href="/provenance"
                  className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>100% Real Leather Guarantee</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/provenance"
                  className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>Solid Sand-Cast Brass</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>Lifetime Durability Warranty</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>Shipping &amp; Return Policy</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/provenance"
                  className="group inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>Leather Care Guide</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest mb-4">
              CUSTOMER SUPPORT
            </h4>
            <div className="text-xs sm:text-sm text-neutral-300 space-y-2 font-mono">
              <p>support@hidewood.com</p>
              
              <div className="pt-1">
                <Link
                  href="/orders"
                  className="text-white font-bold underline hover:text-neutral-300 flex items-center gap-1 text-xs uppercase"
                >
                  <span>Track Your Order &rarr;</span>
                </Link>
              </div>

              <p className="text-neutral-500 text-[11px] pt-1 font-sans">
                Mon-Sat 10:00 AM to 7:00 PM IST &bull; Free delivery across India.
              </p>
            </div>
          </div>

          {/* Back to Top */}
          <div className="col-span-2 md:col-span-3 flex md:justify-end items-start">
            <button
              onClick={scrollToTop}
              className="px-4 py-2.5 border border-white/20 hover:border-white bg-white/5 hover:bg-white hover:text-black transition-all font-mono text-[11px] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 3D FLOATING MONOLITH LOGO STAGE */}
        <div className="relative pt-8 pb-4 flex items-center justify-center [perspective:1200px] overflow-hidden">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="w-full text-center cursor-default select-none"
          >
            <span className="font-mono text-[9px] sm:text-xs text-neutral-500 uppercase tracking-[0.3em] block mb-2 sm:mb-3">
              100% REAL LEATHER &bull; BUILT TO LAST GENERATIONS
            </span>

            <motion.h1
              style={{ translateZ: textTranslateZ }}
              className="text-[17vw] leading-[0.82] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-700"
            >
              HIDEWOOD
            </motion.h1>

            <div className="opacity-15 blur-xs text-[17vw] leading-[0.82] font-black uppercase tracking-tighter text-white -scale-y-100 select-none pointer-events-none mt-[-2vw]">
              HIDEWOOD
            </div>
          </motion.div>
        </div>

        {/* BOTTOM LEGAL & COPYRIGHT BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[10px] text-neutral-500 uppercase">
          <div className="flex items-center gap-3">
            <span>&copy;2026 HIDEWOOD LEATHER PVT. LTD.</span>
            <span>&bull;</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/orders" className="hover:text-white cursor-pointer transition-colors">
              Track Order
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-white cursor-pointer transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&bull;</span>
            <Link href="/provenance" className="hover:text-white cursor-pointer transition-colors">
              Authenticity
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}