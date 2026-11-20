'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError(
        'Please complete your name, email address, and message before sending.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic,
          message: trimmedMessage,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        success?: boolean;
      } | null;

      if (!response.ok) {
        setError(
          data?.error ||
            'Unable to send your message right now. Please try again shortly.'
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setError(
        'Network error while sending your message. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-100">
              Message sent
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Thank you, {name.trim()}. Your {topic.toLowerCase()} note has been delivered, and we will reply to{' '}
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {email.trim()}
              </span>{' '}
              within two business days.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setTopic('General Inquiry');
                  setMessage('');
                  setSubmitted(false);
                }}
                className="inline-flex h-10 items-center rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-white/[0.04] px-4 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors duration-150 whitespace-nowrap"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] p-6 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            disabled={isSubmitting}
            required
            className="h-10 w-full rounded-lg border border-zinc-300 dark:border-white/[0.1] bg-[#F8F9FB] dark:bg-[#0B0D10] px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            disabled={isSubmitting}
            required
            className="h-10 w-full rounded-lg border border-zinc-300 dark:border-white/[0.1] bg-[#F8F9FB] dark:bg-[#0B0D10] px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-topic"
          className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
        >
          Topic
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-zinc-300 dark:border-white/[0.1] bg-[#F8F9FB] dark:bg-[#0B0D10] px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:border-amber-500/60 focus:outline-none disabled:opacity-60"
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Browser & Microphone Support">
            Browser &amp; Microphone Support
          </option>
          <option value="Feature Request">Feature Request</option>
          <option value="Privacy & Legal Question">
            Privacy &amp; Legal Question
          </option>
        </select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Message
          </label>
          <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
            {message.length.toLocaleString()} / 5,000 characters
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how we can help with BoothScript..."
          disabled={isSubmitting}
          required
          className="w-full resize-y rounded-lg border border-zinc-300 dark:border-white/[0.1] bg-[#F8F9FB] dark:bg-[#0B0D10] p-3 text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none disabled:opacity-60"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
