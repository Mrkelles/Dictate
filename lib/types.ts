export type { LanguageOption } from '@/lib/languages';
export { DICTATION_LANGUAGES } from '@/lib/languages';

export interface TranscriptSession {
  id: string;
  title: string;
  language: string;
  plainText: string;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
}
