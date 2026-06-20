import Link from 'next/link';
import Brand, { Meridian, GitHubIcon } from './Brand.js';

const NAV_LINKS = [
  { href: '/', label: 'Acasă' },
  { href: '/facultati', label: 'Facultăți' },
  { href: '/about', label: 'Despre' },
  { href: '/about#contact', label: 'Contact' },
];

const ACCOUNT_LINKS = [
  { href: '/account/auth', label: 'Autentificare' },
  { href: '/account', label: 'Contul meu' },
  { href: '/account/personalityTest', label: 'Test de carieră' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-teal-soft">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-mint/70 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* The footer is the "night map": deep ink-teal in both themes, by design. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a1c1e] text-mint/75">
      {/* Brand spine */}
      <div
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-primary via-accent to-highlight shadow-[0_0_24px_-4px_rgb(240_120_32/0.5)]"
      />
      <Meridian className="animate-drift-slow pointer-events-none absolute -right-20 -top-24 size-[24rem] text-mint/[0.1]" />
      <span
        aria-hidden="true"
        className="beacon-glow-primary absolute -left-28 bottom-0 size-[26rem] opacity-60"
      />

      <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Brand inverse />
          <p className="mt-5 text-sm leading-relaxed text-mint/65">
            Busola ta pentru studii. Facultăți din toată România, recenzii
            sincere de la studenți și un test de carieră — tot ce-ți trebuie ca
            să-ți alegi drumul.
          </p>
        </div>

        <FooterColumn title="Navighează" links={NAV_LINKS} />
        <FooterColumn title="Contul tău" links={ACCOUNT_LINKS} />
      </div>

      <div className="border-t border-mint/10">
        <div className="wrap flex flex-col items-start gap-3 py-6 text-xs text-mint/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} StudCompass. Făcut cu grijă în
            România.
          </p>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="hidden sm:inline">
              N&nbsp;·&nbsp;E&nbsp;·&nbsp;S&nbsp;·&nbsp;V
            </span>
            <a
              href="https://github.com/BLADR-ONE"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <GitHubIcon className="size-3.5" />
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
