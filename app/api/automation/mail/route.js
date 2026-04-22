import { NextResponse } from 'next/server';
import { sendAutomationEmail, smtpIsConfigured } from '@/lib/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const to = body?.to || 'ahmadlarin14@gmail.com';
    const subject = body?.subject || 'BuzzFlow notification';
    const html = body?.html || '<p>BuzzFlow notification</p>';
    const text = body?.text || 'BuzzFlow notification';
    const replyTo = body?.replyTo || '';

    const result = await sendAutomationEmail({ to, subject, html, text, replyTo });

    return NextResponse.json({
      ok: true,
      skipped: result.skipped,
      configured: smtpIsConfigured(),
      messageId: result.messageId || null,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : 'Unknown mail error',
    }, { status: 500 });
  }
}
