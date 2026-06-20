import Link from 'next/link';
import Button from '../components/ui/Button.js';
import { TrailWeave } from '../components/layout/Brand.js';

export const metadata = {
  title: 'Pagină negăsită',
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="texture-doodle" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      />
      <TrailWeave className="animate-trail-draw pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 text-primary/[0.09] dark:text-primary-soft/[0.1]" />

      <div className="wrap relative text-center">
        <p className="eyebrow animate-rise justify-center">Eroare 404</p>
        <h1
          className="animate-rise mx-auto mt-5 max-w-xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
          style={{ animationDelay: '120ms' }}
        >
          Ai ieșit de pe{' '}
          <em className="wonky italic text-primary-strong dark:text-primary-soft">
            hartă
          </em>
          .
        </h1>
        <p
          className="animate-rise mx-auto mt-5 max-w-md text-pretty leading-relaxed text-text-muted"
          style={{ animationDelay: '240ms' }}
        >
          Pagina pe care o cauți nu există sau s-a mutat. Busola zice s-o iei
          înapoi spre un reper cunoscut.
        </p>
        <div
          className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '360ms' }}
        >
          <Button href="/" variant="primary">
            Înapoi acasă
          </Button>
          <Link
            href="/facultati"
            className="text-sm font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
          >
            sau deschide catalogul →
          </Link>
        </div>
      </div>
    </section>
  );
}
