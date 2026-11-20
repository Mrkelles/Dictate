'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Download,
  FileDown,
  Mic,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import PageShell from '@/components/PageShell';
import {
  createAndActivateSessionInStorage,
  createBlankSession,
  readActiveSessionId,
  readStoredSessions,
  writeActiveSessionId,
  writeStoredSessions,
} from '@/lib/sessions-storage';
import {
  countWordsAndChars,
  downloadTextFile,
  formatDuration,
  formatShortDate,
  sanitizeFilename,
} from '@/lib/transcript-utils';
import { exportTranscriptToPdf } from '@/lib/pdf-export';
import type { TranscriptSession } from '@/lib/types';

export default function SessionLibraryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<TranscriptSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const stored = readStoredSessions();
      const storedActive = readActiveSessionId();
      setSessions(stored);
      setActiveSessionId(storedActive || stored[0]?.id || '');
      setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      session.title.toLowerCase().includes(q) ||
      session.plainText.toLowerCase().includes(q)
    );
  });

  const handleOpenSession = (id: string) => {
    writeActiveSessionId(id);
    router.push('/');
  };

  const handleNewSession = () => {
    createAndActivateSessionInStorage();
    router.push('/');
  };

  const handleRename = (id: string) => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const next = sessions.map((s) =>
      s.id === id
        ? { ...s, title: trimmed, updatedAt: new Date().toISOString() }
        : s
    );
    setSessions(next);
    writeStoredSessions(next);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fresh = createBlankSession();
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      writeStoredSessions([fresh]);
      writeActiveSessionId(fresh.id);
      return;
    }
    setSessions(remaining);
    writeStoredSessions(remaining);
    if (id === activeSessionId) {
      setActiveSessionId(remaining[0].id);
      writeActiveSessionId(remaining[0].id);
    }
  };

  const handleDownload = (
    e: React.MouseEvent,
    session: TranscriptSession
  ) => {
    e.stopPropagation();
    const content = session.plainText.trim();
    if (!content) return;
    downloadTextFile(sanitizeFilename(session.title), content);
  };

  const handleExportPdf = async (
    e: React.MouseEvent,
    session: TranscriptSession
  ) => {
    e.stopPropagation();
    const content = session.plainText.trim();
    if (!content) return;
    await exportTranscriptToPdf({
      title: session.title,
      content,
      language: session.language,
      durationSeconds: session.durationSeconds,
      updatedAt: session.updatedAt,
    });
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 dark:border-white/[0.08] pb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
              Session Library
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              Browse, search, rename, export, or reopen your saved browser dictation transcripts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewSession}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* Search & Count Strip */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles or transcript text..."
              aria-label="Search saved transcripts"
              className="h-10 w-full rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#161920] pl-9 pr-8 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
            {isHydrated
              ? `${filteredSessions.length} ${
                  filteredSessions.length === 1 ? 'session' : 'sessions'
                }`
              : 'Loading sessions...'}
          </p>
        </div>

        {/* Session List */}
        {!isHydrated ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] animate-pulse"
              />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] px-6 py-12 text-center">
            <p className="font-display text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery ? 'No matching transcripts' : 'No saved sessions yet'}
            </p>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              {searchQuery
                ? 'Try searching with a different keyword or clear the filter.'
                : 'Start a live dictation session in the studio and it will appear here automatically.'}
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleNewSession}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap"
              >
                <Mic className="h-4 w-4" />
                <span>Start First Session</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;
              const { words, characters } = countWordsAndChars(session.plainText);
              const preview = session.plainText.trim();

              return (
                <article
                  key={session.id}
                  onClick={() => {
                    if (!isEditing) handleOpenSession(session.id);
                  }}
                  className={`rounded-xl border bg-white dark:bg-[#161920] p-4 sm:p-5 transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'border-amber-500/60 dark:border-amber-500/45'
                      : 'border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.16]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div
                          className="flex items-center gap-2 max-w-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(session.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            aria-label="Edit session title"
                            className="h-9 flex-1 rounded-lg border border-amber-500/60 bg-white dark:bg-[#0B0D10] px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRename(session.id)}
                            aria-label="Save session title"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            aria-label="Cancel rename"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.1] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <h2 className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-100 truncate">
                          {session.title}
                        </h2>
                      )}

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        {isActive && (
                          <>
                            <span className="font-sans font-medium text-amber-700 dark:text-amber-400">
                              Active session
                            </span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{formatShortDate(session.updatedAt)}</span>
                        {session.durationSeconds > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{formatDuration(session.durationSeconds)}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>
                          {words.toLocaleString()} {words === 1 ? 'word' : 'words'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {characters.toLocaleString()}{' '}
                          {characters === 1 ? 'character' : 'characters'}
                        </span>
                      </div>
                    </div>

                    {!isEditing && (
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleExportPdf(e, session)}
                          disabled={!preview}
                          title="Export to PDF"
                          aria-label={`Export ${session.title} to PDF`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          <FileDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDownload(e, session)}
                          disabled={!preview}
                          title="Download .txt"
                          aria-label={`Download ${session.title} as .txt`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-35 disabled:cursor-not-allowed"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(session.id);
                            setDraftTitle(session.title);
                          }}
                          aria-label={`Rename ${session.title}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(session.id)}
                          aria-label={`Delete ${session.title}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:border-red-300 dark:hover:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/15 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {preview || 'Empty transcript — open in studio to start dictating.'}
                  </p>

                  <div className="mt-3 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <span>Open in Studio</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
