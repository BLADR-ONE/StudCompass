const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_SITE_URL = 'http://localhost:3000';

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

export function buildVerificationUrl(token) {
  const url = new URL('/verify', getSiteUrl());
  url.searchParams.set('token', token);
  return url.toString();
}

export async function sendVerificationEmail({ to, name, token }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return {
      ok: false,
      error: 'missing_email_config',
    };
  }

  const verificationUrl = buildVerificationUrl(token);
  const subject = 'Verifică-ți adresa de email la StudCompass';
  const greeting = name ? `Salut, ${name}!` : 'Salut!';
  const plainText = [
    greeting,
    '',
    'Apasă pe linkul de mai jos pentru a-ți verifica adresa de email și a activa contul StudCompass:',
    verificationUrl,
    '',
    'Dacă nu ai cerut acest mesaj, îl poți ignora.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #16312f;">
      <p>${greeting}</p>
      <p>Apasă pe butonul de mai jos pentru a-ți verifica adresa de email și a activa contul StudCompass.</p>
      <p>
        <a href="${verificationUrl}" style="display:inline-block;background:#1f6f64;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">
          Verifică emailul
        </a>
      </p>
      <p style="word-break:break-word;">Dacă butonul nu merge, deschide acest link:<br>${verificationUrl}</p>
      <p>Dacă nu ai cerut acest mesaj, îl poți ignora.</p>
    </div>
  `;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      text: plainText,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    return {
      ok: false,
      error: 'resend_failed',
      status: response.status,
      details,
    };
  }

  return {
    ok: true,
  };
}

/**
 * Sends a generic Romanian-language "you already have an account" notice.
 * Deliberately contains NO name, role, or account details — only a prompt
 * to log in or reset the password. Called when a registration attempt hits
 * a duplicate email so the route can return 201 without leaking enumeration.
 */
export async function sendExistingAccountEmail({ to }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return {
      ok: false,
      error: 'missing_email_config',
    };
  }

  const loginUrl = getSiteUrl() + '/account/auth';
  const subject = 'Cont StudCompass existent';
  const plainText = [
    'Salut,',
    '',
    'Cineva a încercat să se înregistreze pe StudCompass cu această adresă de email, dar un cont există deja.',
    '',
    'Dacă ești tu, poți intra în cont sau îți poți reseta parola:',
    loginUrl,
    '',
    'Dacă nu ai făcut tu această cerere, poți ignora acest mesaj în siguranță.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #16312f;">
      <p>Salut,</p>
      <p>Cineva a încercat să se înregistreze pe StudCompass cu această adresă de email, dar un cont există deja.</p>
      <p>Dacă ești tu, poți intra în cont sau îți poți reseta parola:</p>
      <p>
        <a href="${loginUrl}" style="display:inline-block;background:#1f6f64;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">
          Intră în cont
        </a>
      </p>
      <p style="word-break:break-word;">Dacă butonul nu merge, deschide acest link:<br>${loginUrl}</p>
      <p>Dacă nu ai făcut tu această cerere, poți ignora acest mesaj în siguranță.</p>
    </div>
  `;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      text: plainText,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    return {
      ok: false,
      error: 'resend_failed',
      status: response.status,
      details,
    };
  }

  return {
    ok: true,
  };
}
