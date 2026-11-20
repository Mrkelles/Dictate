import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const ALLOWED_TOPICS = new Set([
  'General Inquiry',
  'Browser & Microphone Support',
  'Feature Request',
  'Privacy & Legal Question',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid contact submission payload.' },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const rawTopic = typeof record.topic === 'string' ? record.topic.trim() : '';
  const topic = ALLOWED_TOPICS.has(rawTopic) ? rawTopic : 'General Inquiry';
  const message =
    typeof record.message === 'string' ? record.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        error:
          'Please complete your name, email address, and message before sending.',
      },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  if (name.length > 120) {
    return NextResponse.json(
      { error: 'Name must be 120 characters or fewer.' },
      { status: 400 }
    );
  }

  if (message.length > 5000) {
    return NextResponse.json(
      { error: 'Message must be 5,000 characters or fewer.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    'BoothScript Contact <onboarding@resend.dev>';

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          'Email delivery is not configured yet. Please set RESEND_API_KEY and CONTACT_TO_EMAIL in your server environment secrets.',
      },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeTopic = escapeHtml(topic);
    const safeMessageHtml = escapeHtml(message).replace(/\r?\n/g, '<br />');

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[BoothScript] ${topic} from ${name}`,
      text: [
        `New BoothScript Contact Submission`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        ``,
        `Message:`,
        message,
      ].join('\n'),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #18181b; line-height: 1.6;">
          <div style="border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: #71717a;">BOOTHSCRIPT CONTACT FORM</p>
            <h1 style="margin: 6px 0 0; font-size: 20px; color: #09090b;">${safeTopic}</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #71717a; width: 80px;">From</td>
              <td style="padding: 6px 0; font-weight: 500;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #71717a;">Reply-To</td>
              <td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #b45309;">${safeEmail}</a></td>
            </tr>
          </table>
          <div style="background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; font-size: 14px; color: #27272a;">
            ${safeMessageHtml}
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message ||
            'Unable to send your message through Resend. Please try again later.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id ?? null,
    });
  } catch (err) {
    const messageText =
      err instanceof Error ? err.message : 'Unexpected error sending email.';
    return NextResponse.json({ error: messageText }, { status: 500 });
  }
}
