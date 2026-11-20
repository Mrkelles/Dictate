import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BoothScript — Broadcast Speech-to-Text Studio',
  description:
    'Broadcast-grade speech-to-text studio for live microphone dictation with real-time waveform metering, editable transcripts, session history, and .txt export.',
  openGraph: {
    title: 'BoothScript — Broadcast Speech-to-Text Studio',
    description:
      'Broadcast-grade speech-to-text studio for live microphone dictation with real-time waveform metering, editable transcripts, session history, and .txt export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoothScript — Broadcast Speech-to-Text Studio',
    description:
      'Broadcast-grade speech-to-text studio for live microphone dictation with real-time waveform metering, editable transcripts, session history, and .txt export.',
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('boothscript_theme_v1');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jakarta.variable} ${jetbrains.variable} dark`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F6F7F9] text-zinc-900 dark:bg-[#0B0D10] dark:text-[#F3F4F6] antialiased selection:bg-amber-500/25 selection:text-zinc-950 dark:selection:bg-amber-500/30 dark:selection:text-amber-100"
      >
        {children}
      </body>
    </html>
  );
}
