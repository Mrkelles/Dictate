import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy — BoothScript',
  description:
    'How BoothScript handles microphone access, browser speech recognition, and locally stored transcripts.',
};

const sections = [
  {
    heading: '1. Local-First Transcript Storage',
    paragraphs: [
      'BoothScript is designed to keep your transcripts on your own device. Your saved dictation sessions, titles, durations, language selections, and light/dark theme preferences are stored exclusively in your web browser’s localStorage.',
      'BoothScript does not require user accounts and does not automatically upload your Session Library to BoothScript servers.',
    ],
  },
  {
    heading: '2. Microphone Access and Speech Recognition',
    paragraphs: [
      'When you click Start Dictation, your browser requests permission to access your microphone. BoothScript uses the browser’s Web Audio API solely in local memory to render the live visual waveform meter—no audio file is recorded or saved by BoothScript.',
      'Speech-to-text conversion is performed by your browser’s built-in Web Speech API (SpeechRecognition). Depending on your browser and operating system (such as Google Chrome, Microsoft Edge, or Apple Safari), your browser vendor may process spoken audio on-device or via its own speech recognition service under that vendor’s privacy policy.',
    ],
  },
  {
    heading: '3. Clipboard and File Exports',
    paragraphs: [
      'Copying text to your clipboard or downloading a .txt file occurs entirely inside your browser. Exported files are saved directly to your device’s downloads folder.',
    ],
  },
  {
    heading: '4. Contact Inquiries',
    paragraphs: [
      'If you choose to reach out through our Contact page or email our support address, we use the contact details and message you provide solely to respond to your inquiry and improve BoothScript.',
    ],
  },
  {
    heading: '5. Managing and Deleting Your Data',
    paragraphs: [
      'You have complete control over locally saved transcripts. You can clear an active transcript, delete individual sessions from the Session Library at any time, or clear site data in your browser settings to remove all stored sessions and preferences immediately.',
    ],
  },
  {
    heading: '6. Policy Updates',
    paragraphs: [
      'We may update this Privacy Policy if BoothScript introduces new capabilities or if legal requirements change. The effective date at the top of this page reflects the most recent revision.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-zinc-200 dark:border-white/[0.08] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-amber-700 dark:text-amber-400">
              Privacy
            </span>
            <span aria-hidden="true">·</span>
            <span>Effective November 2026</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
            Privacy Policy
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Your spoken drafts belong to you. This policy explains what stays in your browser, how microphone permissions work, and how you can remove your data at any time.
          </p>
        </header>

        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-2.5">
              <h2 className="font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                {section.heading}
              </h2>
              {section.paragraphs.map((text, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
                >
                  {text}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="border-t border-zinc-200 dark:border-white/[0.08] pt-6 text-xs text-zinc-500 dark:text-zinc-400">
          Have a privacy question?{' '}
          <Link
            href="/contact"
            className="font-medium text-amber-700 dark:text-amber-400 underline underline-offset-4"
          >
            Reach our team
          </Link>
          .
        </div>
      </article>
    </PageShell>
  );
}
