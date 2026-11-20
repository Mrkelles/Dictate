'use client';

import { useCallback, useSyncExternalStore } from 'react';

export const THEME_STORAGE_KEY = 'boothscript_theme_v1';
const THEME_CHANGE_EVENT = 'boothscript-theme-change';

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getThemeSnapshot(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getThemeServerSnapshot(): 'light' | 'dark' {
  return 'dark';
}

export function toggleDocumentTheme(): 'light' | 'dark' {
  const currentlyDark = document.documentElement.classList.contains('dark');
  const nextTheme: 'light' | 'dark' = currentlyDark ? 'light' : 'dark';
  if (nextTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  return nextTheme;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const toggleTheme = useCallback(() => {
    toggleDocumentTheme();
  }, []);

  return { theme, toggleTheme };
}
