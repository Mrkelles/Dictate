import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Disclaimer — BoothScript',
  description:
    'Important disclaimers regarding automated speech recognition accuracy, browser compatibility, and local transcript storage in BoothScript.',
};

const sections = [
  {
    heading: '1. Automated Speech Recognition Accuracy',
    paragraphs: [
      'BoothScript relies on automated browser speech recognition to convert spoken audio into text. Accuracy can be affected by background noise, microphone quality, speaking speed, accents, technical terminology, homophones, and punctuation phrasing.',
      'Always review and proofread your transcript carefully before publishing, quoting, submitting, or relying on it for important work.',
    ],
  },
  {
    heading: '2. Not Certified Legal, Medical, or Official Transcription',
    paragraphs: [
      'BoothScript is a general-purpose drafting and note-taking studio. It is not a certified court reporting tool, medical dictation system, or compliance-certified transcription platform, and should not be relied upon as an official legal, clinical, or regulatory record.',
    ],
  },
  {
    heading: '3. Browser and Device Compatibility',
    paragraphs: [
      'Live microphone dictation depends on Web Speech API support provided by your browser and operating system. Certain browsers, privacy extensions, or restricted corporate networks may limit or disable speech recognition functionality.',
    ],
  },
  {
    heading: '4. Local Storage and Data Loss',
    paragraphs: [
      'Because BoothScript saves your Session Library locally inside your browser rather than on remote cloud servers, clearing browser cookies or site storage, switching browsers, or losing device access will result in loss of unsaved local sessions. We strongly recommend using Download .txt to keep permanent copies of important transcripts.',
    ],
  },
  {
    heading: '5. Consent and Recording Laws',
    paragraphs: [
      'If you use BoothScript during meetings, interviews, or phone calls involving other participants, you are solely responsible for informing participants and obtaining any legally required consent before transcribing their speech.',
    ],
  },
  {
    heading: '6. No Warranty',
    paragraphs: [
      'All tools and content provided through BoothScript are offered for informational and productivity purposes only, without express or implied warranties of accuracy, uninterrupted availability, or fitness for a particular purpose.',
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-zinc-200 dark:border-white/[0.08] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-amber-700 dark:text-amber-400">
              Notice
            </span>
            <span aria-hidden="true">·</span>
            <span>Effective November 2026</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
            Disclaimer
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Important information regarding automated speech-to-text accuracy, browser dependencies, and responsible use of BoothScript.
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
          See also our{' '}
          <Link
            href="/terms"
            className="font-medium text-amber-700 dark:text-amber-400 underline underline-offset-4"
          >
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="font-medium text-amber-700 dark:text-amber-400 underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </article>
    </PageShell>
  );
}
