'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  FolderOpen,
  Info,
  Mail,
  Menu,
  Mic,
  Moon,
  Scale,
  Shield,
  Sun,
  AlertCircle,
  X,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { createAndActivateSessionInStorage } from '@/lib/sessions-storage';

interface SiteHeaderProps {
  onNewSession?: () => void;
  rightAction?: React.ReactNode;
}

export default function SiteHeader({
  onNewSession,
  rightAction,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNewSessionClick = () => {
    setIsMobileMenuOpen(false);
    if (onNewSession) {
      onNewSession();
      return;
    }
    createAndActivateSessionInStorage();
    router.push('/');
  };

  const navLinkClass = (href: string) =>
    `transition-colors duration-150 whitespace-nowrap shrink-0 ${
      pathname === href
        ? 'text-zinc-950 dark:text-zinc-100 underline decoration-amber-500 underline-offset-8'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
    }`;

  const mobileLinkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
      pathname === href
        ? 'bg-white text-zinc-950 border border-amber-500/60 dark:bg-[#181C24] dark:text-zinc-100 dark:border-amber-500/40'
        : 'text-zinc-700 hover:bg-white/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100 border border-transparent'
    }`;

  return (
    <>
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 sm:gap-8 border-b border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#111318] px-4 sm:px-6 transition-colors duration-150">
        {/* Zone 1: Brand Title + Mobile Hamburger Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap shrink-0"
          >
            BoothScript
          </Link>
        </div>

        {/* Zone 2: Main Menu Navigation Links + Theme Toggle */}
        <nav
          aria-label="Primary studio menu"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          <Link href="/" className={navLinkClass('/')}>
            Dictation
          </Link>
          <button
            type="button"
            onClick={handleNewSessionClick}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Session
          </button>
          <Link href="/about" className={navLinkClass('/about')}>
            About
          </Link>
          <Link href="/contact" className={navLinkClass('/contact')}>
            Contact
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md px-1.5 py-1 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-amber-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          {rightAction ?? (
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Open Studio</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Hamburger Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-zinc-200 dark:border-white/[0.08] bg-[#ECEFF4] dark:bg-[#13161C] transition-colors duration-150">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-white/[0.08] px-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                BoothScript
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav
              aria-label="Mobile pages"
              className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
            >
              <div className="space-y-1">
                <p className="px-3 pb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Studio
                </p>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/')}
                >
                  <Mic className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Dictation</span>
                </Link>
                <Link
                  href="/sessions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/sessions')}
                >
                  <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Session Library</span>
                </Link>
              </div>

              <div className="border-t border-zinc-200 dark:border-white/[0.08] pt-4 space-y-1">
                <p className="px-3 pb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Information
                </p>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/about')}
                >
                  <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>About</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/contact')}
                >
                  <Mail className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Contact</span>
                </Link>
              </div>

              <div className="border-t border-zinc-200 dark:border-white/[0.08] pt-4 space-y-1">
                <p className="px-3 pb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Legal
                </p>
                <Link
                  href="/terms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/terms')}
                >
                  <Scale className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Terms of Use</span>
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/privacy')}
                >
                  <Shield className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass('/disclaimer')}
                >
                  <AlertCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Disclaimer</span>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Theme Toggle */}
            <div className="border-t border-zinc-200 dark:border-white/[0.08] p-3 space-y-2">
              <button
                type="button"
                onClick={handleNewSessionClick}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-3.5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>New Dictation Session</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] px-3.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-amber-500/50 transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <span className="inline-flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-amber-600" />
                  )}
                  <span>
                    {theme === 'dark'
                      ? 'Switch to Light Mode'
                      : 'Switch to Dark Mode'}
                  </span>
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
