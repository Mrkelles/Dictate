'use client';

import React, { useMemo, useState } from 'react';
import {
  AlignLeft,
  Replace,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  combineLiveTranscript,
  countWordsAndChars,
} from '@/lib/transcript-utils';

interface TranscriptEditorProps {
  plainText: string;
  interimText: string;
  onPlainTextChange: (text: string) => void;
  onClearTranscript: () => void;
  textDirection?: 'ltr' | 'rtl';
}

export default function TranscriptEditor({
  plainText,
  interimText,
  onPlainTextChange,
  onClearTranscript,
  textDirection = 'ltr',
}: TranscriptEditorProps) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findTerm, setFindTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const hasInterim = interimText.trim().length > 0;
  const { words, characters, charactersNoSpaces } = useMemo(
    () => countWordsAndChars(combineLiveTranscript(plainText, interimText)),
    [plainText, interimText]
  );

  const handleReplaceAll = () => {
    if (!findTerm) return;
    const escaped = findTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    onPlainTextChange(plainText.replace(regex, replaceTerm));
  };

  return (
    <section
      id="transcript-workspace"
      aria-label="Editable transcript workspace"
      className="flex flex-1 flex-col rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] overflow-hidden transition-colors duration-150"
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
          <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
            <AlignLeft className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Transcript</span>
          </div>
          <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">
            ·
          </span>
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`flex items-center gap-2 font-mono tabular-nums transition-colors duration-150 ${
              hasInterim
                ? 'text-amber-700 dark:text-amber-300'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <span>
              <strong
                className={`font-semibold ${
                  hasInterim
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {words.toLocaleString()}
              </strong>{' '}
              {words === 1 ? 'word' : 'words'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong
                className={`font-semibold ${
                  hasInterim
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {characters.toLocaleString()}
              </strong>{' '}
              {characters === 1 ? 'character' : 'characters'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFindReplace((prev) => !prev)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
              showFindReplace
                ? 'border-amber-500/60 bg-amber-50 text-amber-800 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.07]'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Find &amp; Replace</span>
          </button>

          {plainText.trim().length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onClearTranscript();
                    setConfirmClear(false);
                  }}
                  className="inline-flex h-8 items-center rounded-lg bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-500/40 px-2.5 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/30 whitespace-nowrap"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  aria-label="Cancel clear"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-500/30 transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Inline Find & Replace Bar */}
      {showFindReplace && (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-zinc-200 dark:border-white/[0.08] bg-[#F1F3F6] dark:bg-[#11141A] px-5 py-3">
          <input
            type="text"
            value={findTerm}
            onChange={(e) => setFindTerm(e.target.value)}
            placeholder="Find text..."
            aria-label="Find text"
            className="h-8 w-44 rounded-md border border-zinc-300 dark:border-white/[0.1] bg-white dark:bg-[#0B0D10] px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
          />
          <input
            type="text"
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            placeholder="Replace with..."
            aria-label="Replace with"
            className="h-8 w-44 rounded-md border border-zinc-300 dark:border-white/[0.1] bg-white dark:bg-[#0B0D10] px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!findTerm}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-amber-500 px-3 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-40 transition-colors whitespace-nowrap"
          >
            <Replace className="h-3.5 w-3.5" />
            <span>Replace All</span>
          </button>
        </div>
      )}

      {/* Main Editable Canvas */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex h-full flex-col max-w-4xl">
          <textarea
            value={plainText}
            onChange={(e) => onPlainTextChange(e.target.value)}
            dir={textDirection}
            placeholder="Click Start Dictation and begin speaking. Your words will appear here in real time, and you can edit the transcript at any time."
            aria-label="Transcript text editor"
            className="min-h-[300px] w-full flex-1 resize-none bg-transparent text-[15px] sm:text-base leading-[1.7] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />
          {interimText && (
            <p
              dir={textDirection}
              className="mt-2 border-t border-zinc-200 dark:border-white/[0.06] pt-2 text-sm italic text-amber-700 dark:text-amber-300/80 whitespace-pre-wrap"
            >
              {interimText}
            </p>
          )}
        </div>
      </div>

      {/* Quiet Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-white/[0.08] bg-[#F8F9FB] dark:bg-[#13161C] px-5 py-2.5 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
          <span>
            {words.toLocaleString()} {words === 1 ? 'word' : 'words'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {characters.toLocaleString()} {characters === 1 ? 'character' : 'characters'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {charactersNoSpaces.toLocaleString()} without spaces
          </span>
        </div>
        <span className="text-zinc-500 dark:text-zinc-400">
          {hasInterim
            ? 'Updating live from microphone'
            : 'Saved automatically to browser history'}
        </span>
      </div>
    </section>
  );
}
