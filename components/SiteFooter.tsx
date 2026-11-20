import React from 'react';
import Link from 'next/link';

interface SiteFooterProps {
  compact?: boolean;
}

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  return (
    <footer
      className={`border-t border-zinc-200 dark:border-white/[0.08] transition-colors duration-150 ${
        compact
          ? 'mt-8 pt-5 pb-2'
          : 'bg-white dark:bg-[#111318] px-4 py-8 sm:px-6'
      }`}
    >
      <div
        className={`mx-auto flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
          compact ? 'max-w-5xl' : 'max-w-5xl'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-display font-semibold text-zinc-800 dark:text-zinc-200">
            BoothScript
          </span>
          <span aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          <Link
            href="/about"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap"
          >
            Contact Us
          </Link>
          <Link
            href="/terms"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap"
          >
            Terms of Use
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap"
          >
            Privacy Policy
          </Link>
          <Link
            href="/disclaimer"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap"
          >
            Disclaimer
          </Link>
        </nav>
      </div>
    </footer>
  );
}
