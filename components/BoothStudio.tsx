'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, FileDown, Plus } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SidebarHistory from '@/components/SidebarHistory';
import LiveDictationConsole from '@/components/LiveDictationConsole';
import TranscriptEditor from '@/components/TranscriptEditor';
import {
  combineLiveTranscript,
  countWordsAndChars,
  downloadTextFile,
  formatShortDate,
  sanitizeFilename,
} from '@/lib/transcript-utils';
import { exportTranscriptToPdf } from '@/lib/pdf-export';
import {
  appendDictationChunk,
  formatSpokenPunctuation,
  insertManualPunctuation,
} from '@/lib/voice-punctuation';
import { isRtlLanguage } from '@/lib/languages';
import {
  createBlankSession,
  readActiveSessionId,
  readStoredSessions,
  writeActiveSessionId,
  writeStoredSessions,
} from '@/lib/sessions-storage';
import { useTheme } from '@/lib/theme';
import type { TranscriptSession } from '@/lib/types';

export default function BoothStudio() {
  const [sessions, setSessions] = useState<TranscriptSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  const [interimText, setInterimText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [voicePunctuation, setVoicePunctuation] = useState(true);
  const [sessionResetNonce, setSessionResetNonce] = useState(0);

  const { theme } = useTheme();

  // Hydrate saved sessions and active selection from localStorage
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const stored = readStoredSessions();
      if (stored.length > 0) {
        const storedActiveId = readActiveSessionId();
        const validActive =
          stored.find((s) => s.id === storedActiveId)?.id ?? stored[0].id;
        setSessions(stored);
        setActiveSessionId(validActive);
        setIsHydrated(true);
        return;
      }

      const initial = createBlankSession();
      setSessions([initial]);
      setActiveSessionId(initial.id);
      setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist sessions to localStorage
  useEffect(() => {
    if (!isHydrated || sessions.length === 0) return;
    writeStoredSessions(sessions);
  }, [sessions, isHydrated]);

  // Persist active session ID to localStorage
  useEffect(() => {
    if (!isHydrated || !activeSessionId) return;
    writeActiveSessionId(activeSessionId);
  }, [activeSessionId, isHydrated]);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) ?? sessions[0] ?? null;
  }, [sessions, activeSessionId]);

  const updateActiveSession = useCallback(
    (updater: (prev: TranscriptSession) => TranscriptSession) => {
      setSessions((prevList) =>
        prevList.map((s) =>
          s.id === activeSessionId
            ? { ...updater(s), updatedAt: new Date().toISOString() }
            : s
        )
      );
    },
    [activeSessionId]
  );

  const handleCreateNewSession = useCallback(() => {
    const fresh = createBlankSession();
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
    setInterimText('');
  }, []);

  const handleSelectSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (!target) return;
    setActiveSessionId(id);
    setInterimText('');
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, title: newTitle, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const handleDeleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fresh = createBlankSession();
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      setInterimText('');
      return;
    }

    setSessions(remaining);
    if (id === activeSessionId) {
      setActiveSessionId(remaining[0].id);
      setInterimText('');
    }
  };

  const handleAppendFinalDictation = useCallback(
    (finalChunk: string) => {
      updateActiveSession((prev) => {
        const formatted = formatSpokenPunctuation(finalChunk, {
          enabled: voicePunctuation,
          existingText: prev.plainText,
          language: prev.language,
        });
        if (!formatted) return prev;
        return {
          ...prev,
          plainText: appendDictationChunk(prev.plainText, formatted),
        };
      });
    },
    [updateActiveSession, voicePunctuation]
  );

  const handleInsertManualPunctuation = useCallback(
    (insertText: string) => {
      updateActiveSession((prev) => ({
        ...prev,
        plainText: insertManualPunctuation(prev.plainText, insertText),
      }));
    },
    [updateActiveSession]
  );

  const exportContent = activeSession?.plainText ?? '';
  const hasExportableText = exportContent.trim().length > 0;
  const liveWordStats = useMemo(
    () => countWordsAndChars(combineLiveTranscript(exportContent, interimText)),
    [exportContent, interimText]
  );

  const handleDownloadTxt = () => {
    const content = exportContent.trim();
    if (!content || !activeSession) return;
    downloadTextFile(sanitizeFilename(activeSession.title), content);
  };

  const handleExportPdf = async () => {
    const content = exportContent.trim();
    if (!content || !activeSession || isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await exportTranscriptToPdf({
        title: activeSession.title,
        content,
        language: activeSession.language,
        durationSeconds: activeSession.durationSeconds,
        updatedAt: activeSession.updatedAt,
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyText = async () => {
    const content = exportContent.trim();
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard denied
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#F6F7F9] dark:bg-[#0B0D10] text-zinc-900 dark:text-[#F3F4F6] overflow-hidden transition-colors duration-150">
      <SiteHeader
        onNewSession={handleCreateNewSession}
        rightAction={
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={!hasExportableText || isExportingPdf}
              aria-label="Export to PDF"
              className="inline-flex h-9 items-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-300 dark:border-white/[0.12] bg-white dark:bg-[#161920] px-2.5 sm:px-3.5 text-xs font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-[#1D212A] disabled:opacity-35 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <FileDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="sm:hidden">{isExportingPdf ? '...' : 'PDF'}</span>
              <span className="hidden sm:inline">
                {isExportingPdf ? 'Exporting...' : 'Export to PDF'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              disabled={!hasExportableText}
              aria-label="Download .txt"
              className="inline-flex h-9 items-center gap-1.5 sm:gap-2 rounded-lg bg-amber-500 px-2.5 sm:px-4 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-35 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="sm:hidden">.txt</span>
              <span className="hidden sm:inline">Download .txt</span>
            </button>
          </div>
        }
      />

      {/* Main Workspace Split */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SidebarHistory
          sessions={sessions}
          activeSessionId={activeSession?.id ?? ''}
          onSelectSession={handleSelectSession}
          onNewSession={handleCreateNewSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
        />

        <main
          id="studio-top"
          className="flex flex-1 flex-col min-w-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
            {/* Workspace Control Strip: Title & Copy */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                {activeSession && (
                  <>
                    <input
                      type="text"
                      value={activeSession.title}
                      onChange={(e) =>
                        updateActiveSession((s) => ({
                          ...s,
                          title: e.target.value,
                        }))
                      }
                      aria-label="Current session title"
                      className="w-full max-w-lg bg-transparent font-display text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-0 border-b border-transparent focus:border-amber-500/60 pb-0.5 truncate"
                    />
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Live Dictation</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatShortDate(activeSession.updatedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {liveWordStats.words.toLocaleString()}{' '}
                        {liveWordStats.words === 1 ? 'word' : 'words'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {liveWordStats.characters.toLocaleString()}{' '}
                        {liveWordStats.characters === 1
                          ? 'character'
                          : 'characters'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!hasExportableText}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#161920] px-3.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1D212A] disabled:opacity-35 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-700 dark:text-amber-300">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCreateNewSession}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#161920] px-3.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1D212A] transition-colors duration-150 whitespace-nowrap shrink-0 lg:hidden"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Live Dictation Console */}
            <LiveDictationConsole
              key={`${activeSession?.id ?? 'default'}-${sessionResetNonce}`}
              language={activeSession?.language ?? 'en-US'}
              onLanguageChange={(lang) =>
                updateActiveSession((s) => ({ ...s, language: lang }))
              }
              onAppendFinalText={handleAppendFinalDictation}
              onInterimChange={setInterimText}
              initialDuration={activeSession?.durationSeconds ?? 0}
              onDurationTick={(secs) =>
                updateActiveSession((s) => ({
                  ...s,
                  durationSeconds: secs,
                }))
              }
              theme={theme}
              voicePunctuation={voicePunctuation}
              onToggleVoicePunctuation={() =>
                setVoicePunctuation((prev) => !prev)
              }
              existingText={activeSession?.plainText ?? ''}
              onInsertPunctuation={handleInsertManualPunctuation}
            />

            {/* Editable Transcript Canvas */}
            <TranscriptEditor
              plainText={activeSession?.plainText ?? ''}
              interimText={interimText}
              textDirection={
                isRtlLanguage(activeSession?.language ?? 'en-US')
                  ? 'rtl'
                  : 'ltr'
              }
              onPlainTextChange={(text) =>
                updateActiveSession((s) => ({ ...s, plainText: text }))
              }
              onClearTranscript={() => {
                updateActiveSession((s) => ({
                  ...s,
                  plainText: '',
                  durationSeconds: 0,
                }));
                setSessionResetNonce((n) => n + 1);
              }}
            />

            <SiteFooter compact />
          </div>
        </main>
      </div>
    </div>
  );
}
