import Link from 'next/link';
import { verifyEmailToken } from '../../lib/verification.js';

export const dynamic = 'force-dynamic';

function statusCopy(result) {
  switch (result.status) {
    case 'success':
      return {
        title: 'Email verificat',
        body: 'Adresa ta a fost verificată. Acum poți intra în cont.',
      };
    case 'expired':
      return {
        title: 'Link expirat',
        body: 'Linkul de verificare a expirat. Cere unul nou din pagina de autentificare.',
      };
    case 'missing':
      return {
        title: 'Lipsește tokenul',
        body: 'Lipsește tokenul de verificare. Folosește linkul complet din email.',
      };
    case 'unavailable':
      return {
        title: 'Verificare indisponibilă',
        body: 'Verificarea nu este disponibilă momentan. Revino peste câteva minute și încearcă din nou.',
      };
    default:
      return {
        title: 'Verificare eșuată',
        body: 'Linkul de verificare nu mai este valid. Cere unul nou din pagina de autentificare.',
      };
  }
}

export default async function VerifyPage({ searchParams }) {
  const params = await searchParams;
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  let result = { status: 'missing' };
  if (token) {
    const verification = await verifyEmailToken(token);
    if (verification.ok) {
      result = { status: 'success', email: verification.email };
    } else if (verification.error === 'database_unavailable') {
      result = { status: 'unavailable' };
    } else if (verification.error === 'expired_token') {
      result = { status: 'expired' };
    } else {
      result = { status: 'invalid' };
    }
  }

  const copy = statusCopy(result);

  return (
    <section className="wrap py-16 sm:py-24">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-border bg-surface-raised p-8 shadow-card sm:p-10">
        <p className="eyebrow">Verificare email</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-text">
          {copy.title}
        </h1>
        <p className="mt-4 leading-relaxed text-text-muted">{copy.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/account/auth"
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
          >
          Înapoi la autentificare
          </Link>
        </div>
      </section>
    </section>
  );
}
