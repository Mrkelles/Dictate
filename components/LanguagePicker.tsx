'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Check, ChevronDown, Clock, Globe, Search, X } from 'lucide-react';
import {
  DICTATION_LANGUAGES,
  getLanguageOption,
  pushRecentLanguageCode,
  RECENT_LANGUAGES_STORAGE_KEY,
  subscribeRecentLanguages,
  type LanguageOption,
} from '@/lib/languages';
import { hasNativePunctuationPack } from '@/lib/voice-punctuation';

interface LanguagePickerProps {
  value: string;
  onChange: (code: string) => void;
}

function getRecentSnapshotRaw(): string {
  try {
    return localStorage.getItem(RECENT_LANGUAGES_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function getRecentServerSnapshotRaw(): string {
  return '';
}

export default function LanguagePicker({
  value,
  onChange,
}: LanguagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const recentRaw = useSyncExternalStore(
    subscribeRecentLanguages,
    getRecentSnapshotRaw,
    getRecentServerSnapshotRaw
  );

  const recentLanguages = useMemo<LanguageOption[]>(() => {
    if (!recentRaw) return [];
    try {
      const parsed = JSON.parse(recentRaw);
      if (!Array.isArray(parsed)) return [];
      const codes = parsed.filter((c): c is string => typeof c === 'string');
      return codes
        .map((code) => DICTATION_LANGUAGES.find((lang) => lang.code === code))
        .filter((lang): lang is LanguageOption => Boolean(lang))
        .slice(0, 5);
    } catch {
      return [];
    }
  }, [recentRaw]);

  const currentOption = useMemo(() => getLanguageOption(value), [value]);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredLanguages = useMemo(() => {
    if (!trimmedQuery) return DICTATION_LANGUAGES;
    return DICTATION_LANGUAGES.filter(
      (lang) =>
        lang.label.toLowerCase().includes(trimmedQuery) ||
        lang.nativeName.toLowerCase().includes(trimmedQuery) ||
        lang.code.toLowerCase().includes(trimmedQuery) ||
        lang.baseLang.toLowerCase().includes(trimmedQuery)
    );
  }, [trimmedQuery]);

  const showRecentSection = !trimmedQuery && recentLanguages.length > 0;

  const flatSelectableList = useMemo(() => {
    if (!showRecentSection) return filteredLanguages;
    const recentCodes = new Set(recentLanguages.map((l) => l.code));
    const remaining = filteredLanguages.filter((l) => !recentCodes.has(l.code));
    return [...recentLanguages, ...remaining];
  }, [showRecentSection, recentLanguages, filteredLanguages]);

  const allSectionLanguages = useMemo(() => {
    if (!showRecentSection) return filteredLanguages;
    const recentCodes = new Set(recentLanguages.map((l) => l.code));
    return filteredLanguages.filter((l) => !recentCodes.has(l.code));
  }, [showRecentSection, recentLanguages, filteredLanguages]);

  useEffect(() => {
    if (!isOpen) return;
    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    pushRecentLanguageCode(code);
    onChange(code);
    setIsOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      setQuery('');
      triggerRef.current?.focus();
      return;
    }

    if (flatSelectableList.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatSelectableList.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (prev) =>
          (prev - 1 + flatSelectableList.length) % flatSelectableList.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target =
        flatSelectableList[Math.min(activeIndex, flatSelectableList.length - 1)];
      if (target) {
        handleSelect(target.code);
      }
    }
  };

  const renderLanguageRow = (lang: LanguageOption, flatIndex: number) => {
    const isSelected = lang.code === currentOption.code;
    const isHighlighted = flatIndex === activeIndex;
    const nativePunctuation = hasNativePunctuationPack(lang.code);

    return (
      <button
        key={lang.code}
        type="button"
        role="option"
        aria-selected={isSelected}
        onMouseEnter={() => setActiveIndex(flatIndex)}
        onClick={() => handleSelect(lang.code)}
        className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ${
          isSelected
            ? 'bg-amber-50 text-zinc-950 dark:bg-amber-500/15 dark:text-zinc-100'
            : isHighlighted
            ? 'bg-zinc-100 text-zinc-950 dark:bg-white/[0.06] dark:text-zinc-100'
            : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-medium">{lang.label}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="truncate">{lang.nativeName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums shrink-0">{lang.code}</span>
            {nativePunctuation && lang.baseLang !== 'en' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400 shrink-0">
                  Native punctuation
                </span>
              </>
            )}
          </div>
        </div>

        {isSelected && (
          <Check className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Dictation language: ${currentOption.label}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setActiveIndex(0);
        }}
        className="inline-flex h-10 max-w-[230px] sm:max-w-[260px] items-center gap-2 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-[#F6F7F9] dark:bg-[#0B0D10] px-3 text-xs font-medium text-zinc-900 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/[0.16] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <Globe className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="truncate">{currentOption.label}</span>
        <span className="hidden sm:inline font-mono text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
          {currentOption.code}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-zinc-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          onKeyDown={handleKeyDown}
          className="absolute left-0 sm:left-auto sm:right-0 z-40 mt-2 w-[min(23rem,calc(100vw-2.5rem))] rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#161920] shadow-lg overflow-hidden"
        >
          {/* Search Header */}
          <div className="border-b border-zinc-200 dark:border-white/[0.08] p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search supported languages..."
                aria-label="Search dictation languages"
                className="h-9 w-full rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-[#F6F7F9] dark:bg-[#0B0D10] pl-8 pr-8 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveIndex(0);
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear language search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between px-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>Switches dictation &amp; spoken punctuation</span>
              <span className="font-mono tabular-nums">
                {filteredLanguages.length} / {DICTATION_LANGUAGES.length}
              </span>
            </div>
          </div>

          {/* Scrollable List */}
          <div
            role="listbox"
            aria-label="Available dictation languages"
            className="max-h-72 overflow-y-auto p-1.5"
          >
            {flatSelectableList.length === 0 ? (
              <div className="px-3 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                No languages match &ldquo;{query.trim()}&rdquo;.
              </div>
            ) : (
              <>
                {showRecentSection && (
                  <div className="pb-1.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3 w-3" />
                      <span>Recent</span>
                    </div>
                    <div className="space-y-0.5">
                      {recentLanguages.map((lang, idx) =>
                        renderLanguageRow(lang, idx)
                      )}
                    </div>
                    <div className="my-1.5 border-t border-zinc-200 dark:border-white/[0.08]" />
                  </div>
                )}

                <div>
                  {showRecentSection && (
                    <div className="px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      All Languages
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {allSectionLanguages.map((lang, idx) =>
                      renderLanguageRow(
                        lang,
                        showRecentSection ? recentLanguages.length + idx : idx
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
