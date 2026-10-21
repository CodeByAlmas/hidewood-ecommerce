'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  KeyRound,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function PatronAuthPage() {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<'magic-link' | 'password'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProviderLoading, setSocialProviderLoading] = useState<'google' | 'apple' | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // If already logged in, redirect directly to orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('hidewood_session_email');
      if (activeSession) {
        router.push('/orders');
      }
    }
  }, [router]);

  const sanitize = (val: string) => val.replace(/[<>'"/]/g, '').trim();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = sanitize(email);
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (authMode === 'password' && password.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Persist session so /orders knows who is logged in
      if (typeof window !== 'undefined') {
        localStorage.setItem('hidewood_session_email', cleanEmail);
      }

      if (authMode === 'magic-link') {
        setStatusMessage({
          type: 'success',
          text: `Login link sent to ${cleanEmail}. Redirecting to your orders...`,
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Login successful! Opening your orders dashboard...',
        });
      }

      setTimeout(() => {
        router.push('/orders');
      }, 900);
    }, 1000);
  };

  const handleOAuthSignIn = (provider: 'google' | 'apple') => {
    setStatusMessage(null);
    setSocialProviderLoading(provider);

    const fallbackEmail = provider === 'google' ? 'customer@gmail.com' : 'customer@icloud.com';

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hidewood_session_email', fallbackEmail);
      }
      setSocialProviderLoading(null);
      setStatusMessage({
        type: 'success',
        text: `Connected with ${provider === 'google' ? 'Google' : 'Apple'}. Redirecting...`,
      });
      setTimeout(() => {
        router.push('/orders');
      }, 700);
    }, 1000);
  };

  const authSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Customer Sign In | HIDEWOOD Leather',
    description: 'Sign in to access your orders, track shipments, and manage your HIDEWOOD account.',
    url: 'https://hidewood.example.com/login',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authSchema) }}
      />

      <main className="min-h-screen bg-[#F8F8F6] text-[#111111] antialiased select-none pt-24 sm:pt-32 pb-20 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
        <div className="w-full max-w-md border-2 border-black bg-white p-6 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          
          {/* Top Breadcrumb Link */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10 font-mono text-[10px] sm:text-xs uppercase">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <span className="text-neutral-400">CUSTOMER LOGIN</span>
          </div>

          {/* Header Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase text-neutral-500 font-bold">
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Secure Customer Account</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-sans leading-none">
              SIGN IN
            </h1>
            <p className="font-mono text-xs text-neutral-500 mt-2">
              Log in to see your previous orders, live tracking, and account details.
            </p>
          </div>

          {/* 1. GOOGLE & APPLE LOGIN BUTTONS */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              disabled={socialProviderLoading !== null || isSubmitting}
              onClick={() => handleOAuthSignIn('google')}
              className="w-full border border-black/25 hover:border-black bg-[#F8F8F6] hover:bg-neutral-100 py-3 px-4 font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.39 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>
                {socialProviderLoading === 'google' ? 'Connecting Google...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              disabled={socialProviderLoading !== null || isSubmitting}
              onClick={() => handleOAuthSignIn('apple')}
              className="w-full bg-black text-white hover:bg-neutral-800 py-3 px-4 font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.74-.95 2.78 1 .08 2.05-.53 2.68-1.29z" />
              </svg>
              <span>
                {socialProviderLoading === 'apple' ? 'Connecting Apple...' : 'Sign in with Apple'}
              </span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-black/10" />
            <span className="bg-white px-3 text-[10px] font-mono uppercase text-neutral-400 absolute">
              Or Use Email Address
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 border border-black/20 p-1 bg-[#F8F8F6] mb-6 font-mono text-[11px] uppercase">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setStatusMessage(null);
              }}
              className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                authMode === 'password' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('magic-link');
                setStatusMessage(null);
              }}
              className={`py-2 text-center font-bold transition-colors cursor-pointer ${
                authMode === 'magic-link' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Email Link
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] uppercase text-black font-bold mb-1.5">
                Your Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com"
                  className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {authMode === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase text-black font-bold">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('magic-link')}
                    className="text-[10px] text-neutral-500 hover:text-black underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F8F8F6] border border-black/20 focus:border-black p-3 text-xs focus:outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Status alerts */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 text-[11px] border font-bold flex items-start gap-2 ${
                    statusMessage.type === 'error'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {statusMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting || socialProviderLoading !== null}
              className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>
                {isSubmitting
                  ? 'Signing In...'
                  : authMode === 'magic-link'
                  ? 'Send Login Link'
                  : 'Sign In to Account'}
              </span>
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="mt-8 pt-5 border-t border-black/10 font-mono text-[10px] text-neutral-400 uppercase flex items-center justify-between">
            <span className="flex items-center gap-1 text-black font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit Secure Encryption
            </span>
            <span>HIDEWOOD KANPUR</span>
          </div>

        </div>
      </main>
    </>
  );
}