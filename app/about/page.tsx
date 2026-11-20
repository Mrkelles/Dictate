import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'About Us — BoothScript',
  description:
    'Learn how BoothScript delivers focused, browser-native speech-to-text dictation with real-time waveform metering and local transcript storage.',
};

const capabilities = [
  {
    index: '01.',
    title: 'Instant Live Dictation',
    body: 'Powered by your browser’s built-in Web Speech API, BoothScript turns spoken words into editable text in real time across 16 regional language profiles with pause, resume, and stop controls.',
  },
  {
    index: '02.',
    title: 'Real-Time Audio Metering',
    body: 'An integrated Web Audio waveform monitor gives immediate visual confirmation that your microphone signal is active and well-leveled while you speak, without recording or uploading audio files.',
  },
  {
    index: '03.',
    title: 'Editable Transcript Workspace',
    body: 'Clean up phrasing directly in the editor with inline Find & Replace, live word and character counts that update mid-sentence, and one-click clipboard copy or plain .txt file export.',
  },
  {
    index: '04.',
    title: 'Local-First Session Library',
    body: 'Every dictation session is saved automatically to your browser’s local storage so you can revisit, rename, search, and manage transcripts without creating an account.',
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl space-y-10">
        <header className="space-y-4 border-b border-zinc-200 dark:border-white/[0.08] pb-8">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            About BoothScript
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
            A calm broadcast booth for turning speech into clean text
          </h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            BoothScript was built for writers, broadcasters, researchers, students, and note-takers who want a fast, uncluttered dictation workspace right inside their browser—without sign-up walls, bloated toolbars, or cloud lock-in.
          </p>
        </header>

        <section aria-labelledby="how-it-works-heading" className="space-y-6">
          <h2
            id="how-it-works-heading"
            className="font-display text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100"
          >
            Built around how people actually dictate
          </h2>

          <div className="divide-y divide-zinc-200 dark:divide-white/[0.08] border-y border-zinc-200 dark:border-white/[0.08]">
            {capabilities.map((item) => (
              <div
                key={item.index}
                className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6"
              >
                <div className="sm:col-span-4">
                  <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                    <span className="mr-2 font-mono tabular-nums text-amber-700 dark:text-amber-400">
                      {item.index}
                    </span>
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:col-span-8">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="principles-heading" className="space-y-4">
          <h2
            id="principles-heading"
            className="font-display text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100"
          >
            Our design principles
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Dictation tools should stay out of your way while giving clear feedback when your microphone is live. That is why BoothScript pairs a high-contrast studio interface—available in both dark and light modes—with straightforward controls, predictable plain-text exports, and complete ownership over your transcripts.
          </p>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Have a question or suggestion for improving the studio? Visit our{' '}
            <Link
              href="/contact"
              className="font-medium text-amber-700 dark:text-amber-400 underline underline-offset-4 hover:text-amber-600 dark:hover:text-amber-300"
            >
              Contact page
            </Link>{' '}
            or jump straight back into a session.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap"
          >
            <span>Open Dictation Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/privacy"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#161920] px-4 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1D212A] transition-colors duration-150 whitespace-nowrap"
          >
            Read Privacy Policy
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
