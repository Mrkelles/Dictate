import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — BoothScript',
  description:
    'Get in touch with the BoothScript team for support, browser compatibility questions, feature suggestions, or privacy inquiries.',
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <header className="max-w-2xl space-y-3 border-b border-zinc-200 dark:border-white/[0.08] pb-8">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Contact Us
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-balance">
            Get in touch with the BoothScript team
          </h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Questions about live dictation, microphone permissions, or accessibility? Send us a message using the form below or reach our support desk directly.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-5">
            <div className="space-y-4 divide-y divide-zinc-200 dark:divide-white/[0.08] border-y border-zinc-200 dark:border-white/[0.08]">
              <div className="py-4">
                <h2 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  Support &amp; Feedback
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  support@boothscript.app
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Typical response within 2 business days.
                </p>
              </div>

              <div className="py-4">
                <h2 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  Privacy &amp; Legal Inquiries
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  legal@boothscript.app
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  See our{' '}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
                  >
                    Terms of Use
                  </Link>
                  .
                </p>
              </div>

              <div className="py-4">
                <h2 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  Browser Dictation Tips
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Live dictation works best in recent versions of Google Chrome, Microsoft Edge, and Safari with microphone permissions enabled for this site.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
