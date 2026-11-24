export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
  baseLang: string;
  dir: 'ltr' | 'rtl';
  script: 'latin' | 'cjk' | 'other';
}

// Curated widely supported Web Speech API locales across Chrome Desktop, Edge, and Safari.
// Every language listed here also maps to a verified native spoken punctuation pack (+ English fallback).
export const DICTATION_LANGUAGES: LanguageOption[] = [
  // English
  { code: 'en-US', label: 'English (United States)', nativeName: 'English (US)', baseLang: 'en', dir: 'ltr', script: 'latin' },
  { code: 'en-GB', label: 'English (United Kingdom)', nativeName: 'English (UK)', baseLang: 'en', dir: 'ltr', script: 'latin' },
  { code: 'en-AU', label: 'English (Australia)', nativeName: 'English (AU)', baseLang: 'en', dir: 'ltr', script: 'latin' },
  { code: 'en-CA', label: 'English (Canada)', nativeName: 'English (CA)', baseLang: 'en', dir: 'ltr', script: 'latin' },
  { code: 'en-IN', label: 'English (India)', nativeName: 'English (IN)', baseLang: 'en', dir: 'ltr', script: 'latin' },

  // Spanish
  { code: 'es-ES', label: 'Spanish (Spain)', nativeName: 'Español (España)', baseLang: 'es', dir: 'ltr', script: 'latin' },
  { code: 'es-MX', label: 'Spanish (Mexico)', nativeName: 'Español (México)', baseLang: 'es', dir: 'ltr', script: 'latin' },
  { code: 'es-US', label: 'Spanish (United States)', nativeName: 'Español (EE. UU.)', baseLang: 'es', dir: 'ltr', script: 'latin' },
  { code: 'es-AR', label: 'Spanish (Argentina)', nativeName: 'Español (Argentina)', baseLang: 'es', dir: 'ltr', script: 'latin' },

  // French, German, Italian, Portuguese
  { code: 'fr-FR', label: 'French (France)', nativeName: 'Français (France)', baseLang: 'fr', dir: 'ltr', script: 'latin' },
  { code: 'fr-CA', label: 'French (Canada)', nativeName: 'Français (Canada)', baseLang: 'fr', dir: 'ltr', script: 'latin' },
  { code: 'de-DE', label: 'German (Germany)', nativeName: 'Deutsch', baseLang: 'de', dir: 'ltr', script: 'latin' },
  { code: 'it-IT', label: 'Italian (Italy)', nativeName: 'Italiano', baseLang: 'it', dir: 'ltr', script: 'latin' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', baseLang: 'pt', dir: 'ltr', script: 'latin' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', baseLang: 'pt', dir: 'ltr', script: 'latin' },

  // Western & Northern European
  { code: 'nl-NL', label: 'Dutch (Netherlands)', nativeName: 'Nederlands', baseLang: 'nl', dir: 'ltr', script: 'latin' },
  { code: 'sv-SE', label: 'Swedish (Sweden)', nativeName: 'Svenska', baseLang: 'sv', dir: 'ltr', script: 'latin' },
  { code: 'nb-NO', label: 'Norwegian Bokmål', nativeName: 'Norsk bokmål', baseLang: 'nb', dir: 'ltr', script: 'latin' },
  { code: 'da-DK', label: 'Danish (Denmark)', nativeName: 'Dansk', baseLang: 'da', dir: 'ltr', script: 'latin' },
  { code: 'fi-FI', label: 'Finnish (Finland)', nativeName: 'Suomi', baseLang: 'fi', dir: 'ltr', script: 'latin' },
  { code: 'ca-ES', label: 'Catalan (Spain)', nativeName: 'Català', baseLang: 'ca', dir: 'ltr', script: 'latin' },

  // Central, Eastern & Southern European
  { code: 'pl-PL', label: 'Polish (Poland)', nativeName: 'Polski', baseLang: 'pl', dir: 'ltr', script: 'latin' },
  { code: 'ru-RU', label: 'Russian (Russia)', nativeName: 'Русский', baseLang: 'ru', dir: 'ltr', script: 'other' },
  { code: 'uk-UA', label: 'Ukrainian (Ukraine)', nativeName: 'Українська', baseLang: 'uk', dir: 'ltr', script: 'other' },
  { code: 'cs-CZ', label: 'Czech (Czechia)', nativeName: 'Čeština', baseLang: 'cs', dir: 'ltr', script: 'latin' },
  { code: 'sk-SK', label: 'Slovak (Slovakia)', nativeName: 'Slovenčina', baseLang: 'sk', dir: 'ltr', script: 'latin' },
  { code: 'hu-HU', label: 'Hungarian (Hungary)', nativeName: 'Magyar', baseLang: 'hu', dir: 'ltr', script: 'latin' },
  { code: 'ro-RO', label: 'Romanian (Romania)', nativeName: 'Română', baseLang: 'ro', dir: 'ltr', script: 'latin' },
  { code: 'bg-BG', label: 'Bulgarian (Bulgaria)', nativeName: 'Български', baseLang: 'bg', dir: 'ltr', script: 'other' },
  { code: 'hr-HR', label: 'Croatian (Croatia)', nativeName: 'Hrvatski', baseLang: 'hr', dir: 'ltr', script: 'latin' },
  { code: 'el-GR', label: 'Greek (Greece)', nativeName: 'Ελληνικά', baseLang: 'el', dir: 'ltr', script: 'other' },
  { code: 'tr-TR', label: 'Turkish (Turkey)', nativeName: 'Türkçe', baseLang: 'tr', dir: 'ltr', script: 'latin' },

  // East Asian
  { code: 'zh-CN', label: 'Chinese (Mandarin, Simplified)', nativeName: '中文（简体）', baseLang: 'zh', dir: 'ltr', script: 'cjk' },
  { code: 'zh-TW', label: 'Chinese (Mandarin, Traditional)', nativeName: '中文（繁體）', baseLang: 'zh', dir: 'ltr', script: 'cjk' },
  { code: 'zh-HK', label: 'Chinese (Cantonese, Hong Kong)', nativeName: '粵語（香港）', baseLang: 'zh', dir: 'ltr', script: 'cjk' },
  { code: 'ja-JP', label: 'Japanese (Japan)', nativeName: '日本語', baseLang: 'ja', dir: 'ltr', script: 'cjk' },
  { code: 'ko-KR', label: 'Korean (South Korea)', nativeName: '한국어', baseLang: 'ko', dir: 'ltr', script: 'other' },

  // South & Southeast Asian
  { code: 'hi-IN', label: 'Hindi (India)', nativeName: 'हिन्दी', baseLang: 'hi', dir: 'ltr', script: 'other' },
  { code: 'vi-VN', label: 'Vietnamese (Vietnam)', nativeName: 'Tiếng Việt', baseLang: 'vi', dir: 'ltr', script: 'latin' },
  { code: 'th-TH', label: 'Thai (Thailand)', nativeName: 'ไทย', baseLang: 'th', dir: 'ltr', script: 'cjk' },
  { code: 'id-ID', label: 'Indonesian (Indonesia)', nativeName: 'Bahasa Indonesia', baseLang: 'id', dir: 'ltr', script: 'latin' },
  { code: 'ms-MY', label: 'Malay (Malaysia)', nativeName: 'Bahasa Melayu', baseLang: 'ms', dir: 'ltr', script: 'latin' },
  { code: 'fil-PH', label: 'Filipino (Philippines)', nativeName: 'Filipino', baseLang: 'fil', dir: 'ltr', script: 'latin' },

  // Middle Eastern (RTL)
  { code: 'ar-SA', label: 'Arabic (Saudi Arabia)', nativeName: 'العربية (السعودية)', baseLang: 'ar', dir: 'rtl', script: 'other' },
  { code: 'ar-EG', label: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', baseLang: 'ar', dir: 'rtl', script: 'other' },
  { code: 'he-IL', label: 'Hebrew (Israel)', nativeName: 'עברית', baseLang: 'he', dir: 'rtl', script: 'other' },
];

const LANGUAGE_MAP = new Map<string, LanguageOption>(
  DICTATION_LANGUAGES.map((lang) => [lang.code, lang])
);

export const DEFAULT_LANGUAGE_CODE = 'en-US';

export function getLanguageOption(code: string): LanguageOption {
  const exact = LANGUAGE_MAP.get(code);
  if (exact) return exact;

  const base = code.split('-')[0]?.toLowerCase();
  if (base) {
    const byBase = DICTATION_LANGUAGES.find((l) => l.baseLang === base);
    if (byBase) return byBase;
  }

  return LANGUAGE_MAP.get(DEFAULT_LANGUAGE_CODE)!;
}

export function getBaseLanguage(code: string): string {
  return getLanguageOption(code).baseLang;
}

export function isRtlLanguage(code: string): boolean {
  return getLanguageOption(code).dir === 'rtl';
}

export const RECENT_LANGUAGES_STORAGE_KEY = 'boothscript_recent_languages_v1';
const RECENT_LANGUAGES_EVENT = 'boothscript-recent-languages-change';
const MAX_RECENT_LANGUAGES = 5;

export function readRecentLanguageCodes(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_LANGUAGES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && LANGUAGE_MAP.has(item))
      .slice(0, MAX_RECENT_LANGUAGES);
  } catch {
    return [];
  }
}

export function pushRecentLanguageCode(code: string): void {
  const resolved = getLanguageOption(code).code;
  try {
    const current = readRecentLanguageCodes();
    const next = [resolved, ...current.filter((item) => item !== resolved)].slice(
      0,
      MAX_RECENT_LANGUAGES
    );
    localStorage.setItem(RECENT_LANGUAGES_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENT_LANGUAGES_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function subscribeRecentLanguages(onChange: () => void): () => void {
  window.addEventListener(RECENT_LANGUAGES_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(RECENT_LANGUAGES_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}
