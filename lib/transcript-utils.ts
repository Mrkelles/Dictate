export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
  const rounded = Math.floor(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function sanitizeFilename(title: string): string {
  const base = title
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]+/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return base.length > 0 ? `${base}.txt` : 'transcript.txt';
}

export function downloadTextFile(filename: string, content: string): void {
  const safeName = filename.endsWith('.txt') ? filename : sanitizeFilename(filename);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = safeName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function combineLiveTranscript(
  plainText: string,
  interimText: string
): string {
  const trimmedInterim = interimText.trim();
  if (!trimmedInterim) return plainText;
  const needsSpace = plainText.length > 0 && !/[\s\n]$/.test(plainText);
  return `${plainText}${needsSpace ? ' ' : ''}${trimmedInterim}`;
}

export function countWordsAndChars(text: string): {
  words: number;
  characters: number;
  charactersNoSpaces: number;
} {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  return { words, characters, charactersNoSpaces };
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
