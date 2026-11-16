'use client';

import React, { createContext, useContext, useState, useTransition, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TransitionContextType {
  isNavigating: boolean;
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isNavigating: false,
  navigateTo: () => {},
});

export const useAtelierTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();
  const lockRef = useRef(false);

  const navigateTo = (href: string) => {
    if (!href || href === pathname || href === '/#' || href.startsWith('#') || lockRef.current) {
      return;
    }

    lockRef.current = true;

    // 1. Curtain rises smoothly from bottom & staggered letters enter
    setIsNavigating(true);

    // 2. Route changes cleanly while screen is fully covered (560ms)
    setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });

      // 3. Hold briefly for brand readability, then letters exit upward & curtain slides up
      setTimeout(() => {
        setIsNavigating(false);
        setTimeout(() => {
          lockRef.current = false;
        }, 700);
      }, 650);
    }, 560);
  };

  return (
    <TransitionContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}