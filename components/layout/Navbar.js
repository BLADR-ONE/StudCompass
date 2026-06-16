'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Brand from './Brand.js';
import ThemeToggle from './ThemeToggle.js';

const LINKS = [
  { href: '/', label: 'Acasă' },
  { href: '/facultati', label: 'Facultăți' },
  { href: '/about', label: 'Despre' },
];

function isActive(pathname, href) {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const { status, data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const authed = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';
  /* Kept v1 concept: glass-clear over the home hero, solid surface after. */
  const overHero = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Close the mobile menu on navigation and lock the page behind it. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const accountHref = authed ? '/account' : '/account/auth';
  const accountLabel = authed ? 'Cont' : 'Autentificare';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          overHero
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-border bg-bg/85 shadow-[0_1px_0_0_var(--sc-border)] backdrop-blur-md'
        }`}
      >
        <nav className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <Brand inverse={overHero} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      overHero
                        ? 'text-white/80 hover:text-white'
                        : 'text-text-muted hover:text-text'
                    } ${
                      active
                        ? `${overHero ? 'text-white' : 'text-text'} after:absolute after:-bottom-0.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-accent after:content-['']`
                        : ''
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  aria-current={isActive(pathname, '/admin') ? 'page' : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    overHero
                      ? 'text-white/80 hover:text-white'
                      : 'text-text-muted hover:text-text'
                  } ${
                    isActive(pathname, '/admin')
                      ? `${overHero ? 'text-white' : 'text-text'} after:absolute after:-bottom-0.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-accent after:content-['']`
                      : ''
                  }`}
                >
                  Administrare
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2.5">
            <ThemeToggle
              className={
                overHero
                  ? 'border-white/30 text-white/85 hover:border-white/60 hover:text-white'
                  : 'border-border text-text-muted hover:border-primary-soft hover:text-text'
              }
            />
            <Link
              href={accountHref}
              className={`hidden h-9 items-center rounded-full border px-4 text-sm font-semibold transition-colors sm:inline-flex ${
                overHero
                  ? 'border-white/40 text-white hover:bg-white/10'
                  : 'border-primary/40 text-primary-strong hover:bg-primary/10 dark:border-primary-soft/40 dark:text-primary-soft dark:hover:bg-primary-soft/10'
              }`}
            >
              {accountLabel}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
              className={`relative inline-flex size-9 items-center justify-center rounded-full border transition-colors md:hidden ${
                overHero
                  ? 'border-white/30 text-white'
                  : 'border-border text-text'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                  menuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
                  menuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-bg pt-[5.5rem] md:hidden"
        >
          <nav className="wrap flex flex-1 flex-col">
            <ul className="flex flex-col gap-1 border-t border-border pt-6">
              {LINKS.map(({ href, label }, index) => (
                <li
                  key={href}
                  className="animate-rise"
                  style={{ animationDelay: `${80 + index * 70}ms` }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 font-display text-4xl font-semibold tracking-tight transition-colors ${
                      isActive(pathname, href)
                        ? 'text-primary-strong dark:text-primary-soft'
                        : 'text-text hover:text-primary-strong dark:hover:text-primary-soft'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <li
                  className="animate-rise"
                  style={{ animationDelay: `${80 + LINKS.length * 70}ms` }}
                >
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 font-display text-4xl font-semibold tracking-tight transition-colors ${
                      isActive(pathname, '/admin')
                        ? 'text-primary-strong dark:text-primary-soft'
                        : 'text-text hover:text-primary-strong dark:hover:text-primary-soft'
                    }`}
                  >
                    Administrare
                  </Link>
                </li>
              )}
            </ul>
            <div
              className="animate-rise mt-8 border-t border-border pt-6"
              style={{ animationDelay: '320ms' }}
            >
              <Link
                href={accountHref}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-white transition-colors hover:bg-primary-strong"
              >
                {accountLabel}
              </Link>
            </div>
            <p className="eyebrow mt-auto pb-10">Busola ta pentru studii</p>
          </nav>
        </div>
      )}

      {/* Spacer: pages without the full-bleed home hero start below the bar. */}
      {!isHome && <div aria-hidden="true" className="h-[4.5rem]" />}
    </>
  );
}
