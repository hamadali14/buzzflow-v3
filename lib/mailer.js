import nodemailer from 'nodemailer';

const DEFAULT_FROM = 'ahmadlarin14@gmail.com';

function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || DEFAULT_FROM;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';

  if (!host || !pass) {
    return null;
  }

  return { host, port, user, pass, secure };
}

export function smtpIsConfigured() {
  return Boolean(smtpConfig());
}

export async function sendAutomationEmail({ to, subject, html, text, replyTo }) {
  const config = smtpConfig();

  if (!config) {
    return { ok: true, skipped: true, reason: 'SMTP not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || config.user || DEFAULT_FROM,
    to,
    subject,
    html,
    text,
    replyTo: replyTo || undefined,
  });

  return { ok: true, skipped: false, messageId: info.messageId };
}
