import Link from 'next/link';

/* The StudCompass mark: a compass dial with its needle pointing NNE —
   forward. North half is accent orange (the one allowed highlight). */
export function CompassMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth="2.75"
      />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <path d="M24 6.5v3" />
        <path d="M24 38.5v3" />
        <path d="M6.5 24h3" />
        <path d="M38.5 24h3" />
      </g>
      <g transform="rotate(26 24 24)">
        <path d="M24 8.5 28.4 24h-8.8L24 8.5Z" fill="var(--color-accent)" />
        <path
          d="M24 39.5 28.4 24h-8.8L24 39.5Z"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
      <circle cx="24" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}

/* Shared GitHub glyph — the one social mark used site-wide. */
export function GitHubIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

/* Large decorative compass rose — hero, CTA band, empty states. */
export function CompassRose({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="100" cy="100" r="97" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="76"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 7"
      />
      <g stroke="currentColor" strokeWidth="1" opacity="0.7">
        <path d="M100 3v14" />
        <path d="M100 183v14" />
        <path d="M3 100h14" />
        <path d="M183 100h14" />
        <path d="M31.4 31.4l9.9 9.9" />
        <path d="M158.7 158.7l9.9 9.9" />
        <path d="M168.6 31.4l-9.9 9.9" />
        <path d="M41.3 158.7l-9.9 9.9" />
      </g>
      <path
        d="M100 30 112 88 170 100 112 112 100 170 88 112 30 100 88 88Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M100 62 107 93 138 100 107 107 100 138 93 107 62 100 93 93Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.6"
        transform="rotate(45 100 100)"
      />
      <circle cx="100" cy="100" r="3.5" fill="currentColor" />
    </svg>
  );
}

/* Wordmark + mark. `inverse` is for photo/teal surfaces (mint on dark). */
export default function Brand({ inverse = false, className = '' }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="StudCompass — Acasă"
    >
      <CompassMark
        className={`size-8 transition-transform duration-500 group-hover:rotate-[14deg] ${
          inverse ? 'text-mint' : 'text-primary-strong dark:text-primary-soft'
        }`}
      />
      <span
        className={`font-display text-[1.3rem] font-semibold tracking-tight ${
          inverse ? 'text-white' : 'text-text'
        }`}
      >
        Stud
        <span
          className={`wonky italic ${
            inverse ? 'text-mint' : 'text-primary-strong dark:text-primary-soft'
          }`}
        >
          Compass
        </span>
      </span>
    </Link>
  );
}
