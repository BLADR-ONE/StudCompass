'use client';

/* No state needed: the icons swap purely via the [data-theme] CSS variant,
   so server and client markup always match (no hydration drift). */
export default function ThemeToggle({ className = '' }) {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('sc_theme', next);
    } catch {
      /* Private mode: theme simply won't persist. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Schimbă tema"
      title="Schimbă tema"
      className={`inline-flex size-9 items-center justify-center rounded-full border transition-colors duration-200 ${className}`}
    >
      {/* Moon — shown in light mode (tap to go dark) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-[1.05rem] dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sun — shown in dark mode (tap to go light) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
        className="hidden size-[1.05rem] dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    </button>
  );
}
