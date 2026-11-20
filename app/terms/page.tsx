import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Terms of Use — BoothScript',
  description:
    'Terms governing your use of the BoothScript speech-to-text dictation workspace.',
};

const sections = [
  {
    heading: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using BoothScript, you agree to be bound by these Terms of Use and our Privacy Policy and Disclaimer. If you do not agree with these terms, please discontinue use of the application.',
    ],
  },
  {
    heading: '2. Description of the Service',
    paragraphs: [
      'BoothScript provides a browser-based speech-to-text dictation studio featuring live microphone transcription via the Web Speech API, real-time audio waveform metering, an editable transcript canvas, browser-local session history, and plain-text (.txt) download tools.',
      'We may update, refine, or discontinue individual interface features at any time to maintain browser compatibility and service reliability.',
    ],
  },
  {
    heading: '3. Ownership of Your Transcripts',
    paragraphs: [
      'You retain full ownership and responsibility for all text, notes, and transcripts you dictate, type, edit, or export using BoothScript. BoothScript claims no license or intellectual property rights over your content.',
    ],
  },
  {
    heading: '4. Microphone Access and Browser Dependencies',
    paragraphs: [
      'Live dictation requires granting microphone access through your web browser and relies on your browser’s built-in Speech Recognition engine. Availability, language coverage, and uptime of browser speech recognition are determined by your browser vendor and operating system.',
    ],
  },
  {
    heading: '5. Local Browser Storage and Backups',
    paragraphs: [
      'Saved sessions in your Session Library are stored locally in your browser’s storage (localStorage). Clearing browser data, switching devices, or using private/incognito browsing may permanently remove saved sessions. You are responsible for exporting important transcripts as .txt files.',
    ],
  },
  {
    heading: '6. Acceptable Use',
    paragraphs: [
      'You agree not to misuse BoothScript, attempt to disrupt or reverse-engineer its infrastructure, or use the application in violation of applicable laws, including laws governing consent for recording or transcribing third-party conversations.',
    ],
  },
  {
    heading: '7. Limitation of Liability',
    paragraphs: [
      'BoothScript is provided on an "as is" and "as available" basis without warranties of any kind. To the fullest extent permitted by law, BoothScript and its operators shall not be liable for any indirect, incidental, or consequential damages, including lost transcripts, transcription inaccuracies, or interrupted sessions.',
    ],
  },
  {
    heading: '8. Changes to These Terms',
    paragraphs: [
      'We may revise these Terms of Use periodically. Continued use of BoothScript after changes are posted constitutes acceptance of the updated terms. Questions may be directed to our team via the Contact page.',
    ],
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-zinc-200 dark:border-white/[0.08] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-amber-700 dark:text-amber-400">
              Legal
            </span>
            <span aria-hidden="true">·</span>
            <span>Effective November 2026</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
            Terms of Use
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Please read these terms carefully before using BoothScript for live speech-to-text dictation and transcript editing.
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
          Questions about these Terms of Use?{' '}
          <Link
            href="/contact"
            className="font-medium text-amber-700 dark:text-amber-400 underline underline-offset-4"
          >
            Contact us
          </Link>
          .
        </div>
      </article>
    </PageShell>
  );
}
