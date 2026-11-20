import type { TranscriptSession } from '@/lib/types';

export const SESSIONS_STORAGE_KEY = 'boothscript_sessions_v1';
export const ACTIVE_SESSION_STORAGE_KEY = 'boothscript_active_session_v1';

export function createBlankSession(): TranscriptSession {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateLabel = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: `Dictation — ${dateLabel}, ${timeLabel}`,
    language: 'en-US',
    plainText: '',
    durationSeconds: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function normalizeStoredSessions(rawList: unknown[]): TranscriptSession[] {
  return rawList
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === 'object')
    )
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : `sess-${Date.now()}`,
      title: typeof item.title === 'string' ? item.title : 'Untitled Dictation',
      language:
        typeof item.language === 'string' && item.language !== 'auto'
          ? item.language
          : 'en-US',
      plainText: typeof item.plainText === 'string' ? item.plainText : '',
      durationSeconds:
        typeof item.durationSeconds === 'number' ? item.durationSeconds : 0,
      createdAt:
        typeof item.createdAt === 'string'
          ? item.createdAt
          : new Date().toISOString(),
      updatedAt:
        typeof item.updatedAt === 'string'
          ? item.updatedAt
          : new Date().toISOString(),
    }));
}

export function readStoredSessions(): TranscriptSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return normalizeStoredSessions(parsed);
  } catch {
    return [];
  }
}

export function writeStoredSessions(sessions: TranscriptSession[]): void {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Ignore quota exceeded
  }
}

export function readActiveSessionId(): string {
  try {
    return localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function writeActiveSessionId(id: string): void {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function createAndActivateSessionInStorage(): TranscriptSession {
  const existing = readStoredSessions();
  const fresh = createBlankSession();
  writeStoredSessions([fresh, ...existing]);
  writeActiveSessionId(fresh.id);
  return fresh;
}
