'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
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

  const navigateTo = (href: string) => {
    // Agar same page par ho toh trigger mat karo
    if (href === pathname || href === `/#` || href.startsWith('#')) {
      return;
    }

    // 1. Pehle parda neeche se upar aakar screen cover karega
    setIsNavigating(true);

    // 2. 450ms wait karega jab tak screen 100% black cover na ho jaye
    setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });

      // 3. Page change hone ke baad parda upar slide hokar gayab ho jayega
      setTimeout(() => {
        setIsNavigating(false);
      }, 550);
    }, 450);
  };

  return (
    <TransitionContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}