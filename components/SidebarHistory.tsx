'use client';

import React, { useState } from 'react';
import {
  Check,
  Mic,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  countWordsAndChars,
  formatDuration,
  formatShortDate,
} from '@/lib/transcript-utils';
import type { TranscriptSession } from '@/lib/types';

interface SidebarHistoryProps {
  sessions: TranscriptSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function SidebarHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onRenameSession,
  onDeleteSession,
}: SidebarHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const filteredSessions = sessions.filter((session) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      session.title.toLowerCase().includes(q) ||
      session.plainText.toLowerCase().includes(q)
    );
  });

  const startRename = (e: React.MouseEvent, session: TranscriptSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setDraftTitle(session.title);
  };

  const commitRename = (id: string) => {
    const trimmed = draftTitle.trim();
    if (trimmed) {
      onRenameSession(id, trimmed);
    }
    setEditingId(null);
  };

  return (
    <aside
      aria-label="Session library"
      className="hidden lg:block w-[268px] shrink-0 h-full"
    >
      <div className="flex h-full flex-col bg-[#ECEFF4] dark:bg-[#13161C] border-r border-zinc-200 dark:border-white/[0.08] transition-colors duration-150">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
          <span className="font-display text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">
            Session Library
          </span>
          <button
            type="button"
            onClick={onNewSession}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900/5 dark:bg-white/[0.06] px-3 text-xs font-medium text-zinc-800 dark:text-zinc-100 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transcripts..."
              aria-label="Search saved transcripts"
              className="h-9 w-full rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0D10] pl-8 pr-7 text-xs text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {searchQuery ? 'No matching sessions' : 'No saved sessions yet'}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {searchQuery
                  ? 'Try a different keyword.'
                  : 'Start dictating to record your first transcript.'}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;
              const { words } = countWordsAndChars(session.plainText);

              return (
                <div
                  key={session.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSession(session.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSession(session.id);
                    }
                  }}
                  className={`group relative flex flex-col gap-1.5 rounded-lg border px-3 py-2.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive
                      ? 'border-amber-500/60 bg-white dark:border-amber-500/40 dark:bg-[#181C24]'
                      : 'border-transparent hover:border-zinc-200 hover:bg-white/60 dark:hover:border-white/[0.06] dark:hover:bg-[#181C24]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Mic
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      />
                      {isEditing ? (
                        <div
                          className="flex items-center gap-1 flex-1 min-w-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitRename(session.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="h-6 w-full rounded border border-amber-500/50 bg-white dark:bg-[#0B0D10] px-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => commitRename(session.id)}
                            aria-label="Save title"
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-amber-600 dark:text-amber-400 hover:bg-zinc-900/5 dark:hover:bg-white/[0.06]"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`truncate text-xs font-medium ${
                            isActive
                              ? 'text-zinc-950 dark:text-zinc-100'
                              : 'text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {session.title}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => startRename(e, session)}
                          aria-label={`Rename ${session.title}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/[0.08] hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          aria-label={`Delete ${session.title}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-zinc-500 dark:text-zinc-400 hover:bg-red-500/15 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pl-5 text-[11px] text-zinc-500 font-mono tabular-nums truncate">
                    <span>Dictation</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatShortDate(session.updatedAt)}</span>
                    {session.durationSeconds > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{formatDuration(session.durationSeconds)}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{words}w</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
