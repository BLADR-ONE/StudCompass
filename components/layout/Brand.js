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

/* ---------------------------------------------------------------------------
   Cartographer's field-notes motif family
   --------------------------------------------------------------------------
   Six abstract map-making marks that share the compass's line-art DNA
   (single-weight strokes in `currentColor`, one accent node) but break the
   visual monotony of the rose being on every page. Each is a drop-in decoration
   with the exact same contract as CompassRose: an aria-hidden SVG that takes a
   single `className` (caller supplies pointer-events / absolute / size / color).
   The compass itself stays the SINGLE signature mark — home hero + logo.
--------------------------------------------------------------------------- */

/* TrailWeave — a winding dashed route with milestone pins. The journey. */
export function TrailWeave({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 168 C 48 150 40 108 74 98 C 108 88 100 50 134 42 C 158 36 172 44 186 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 9"
        opacity="0.75"
      />
      <g stroke="currentColor" strokeWidth="1.25" fill="none">
        <circle cx="14" cy="168" r="4.5" opacity="0.6" />
        <circle cx="74" cy="98" r="4.5" opacity="0.7" />
        <circle cx="134" cy="42" r="4.5" opacity="0.8" />
      </g>
      {/* Destination flag — the one accent moment. */}
      <g transform="translate(186 30)">
        <path d="M0 0v-22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 -22 14 -17 0 -12Z" fill="var(--color-accent)" />
        <circle cx="0" cy="0" r="2.6" fill="currentColor" />
      </g>
    </svg>
  );
}

/* Constellation — connected star nodes. Discovery, finding your direction. */
export function Constellation({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <path
        d="M28 150 70 120 96 146 132 70 158 96 176 40"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M70 120 84 56 132 70" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <g stroke="currentColor" strokeWidth="1.25" fill="var(--sc-bg)">
        <circle cx="28" cy="150" r="3" />
        <circle cx="70" cy="120" r="3.5" />
        <circle cx="96" cy="146" r="2.5" />
        <circle cx="84" cy="56" r="3" />
        <circle cx="158" cy="96" r="3" />
        <circle cx="176" cy="40" r="2.5" />
      </g>
      {/* Brightest star — accent four-point spark. */}
      <g transform="translate(132 70)">
        <path
          d="M0 -11 2.6 -2.6 11 0 2.6 2.6 0 11 -2.6 2.6 -11 0 -2.6 -2.6Z"
          fill="var(--color-accent)"
        />
      </g>
    </svg>
  );
}

/* Contour — topographic elevation lines. Terrain, depth, the lay of the land. */
export function Contour({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <path d="M6 96 C 50 60 88 132 128 92 C 152 68 178 84 196 70" strokeWidth="1.25" opacity="0.7" />
        <path d="M2 122 C 48 90 92 150 134 112 C 160 90 182 106 198 94" strokeWidth="1" opacity="0.5" />
        <path d="M8 70 C 48 42 84 104 122 70 C 148 48 176 62 194 50" strokeWidth="1" opacity="0.45" />
        <path d="M12 148 C 54 120 96 172 140 138 C 166 118 184 130 198 120" strokeWidth="0.85" opacity="0.32" />
        <path d="M16 46 C 50 26 80 78 116 50" strokeWidth="0.85" opacity="0.3" />
      </g>
      {/* Summit marker — accent benchmark dot. */}
      <circle cx="128" cy="92" r="3.4" fill="var(--color-accent)" />
    </svg>
  );
}

/* Horizon — concentric arcs over a baseline with a rising marker. Beginnings. */
export function Horizon({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <line x1="6" y1="132" x2="194" y2="132" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
      <g stroke="currentColor" fill="none">
        <path d="M52 132 A 48 48 0 0 1 148 132" strokeWidth="1.25" opacity="0.7" />
        <path d="M34 132 A 66 66 0 0 1 166 132" strokeWidth="1" opacity="0.45" />
        <path d="M16 132 A 84 84 0 0 1 184 132" strokeWidth="0.85" opacity="0.28" />
      </g>
      {/* Sun / waypoint cresting the horizon — accent. */}
      <circle cx="100" cy="132" r="11" fill="var(--color-accent)" />
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.6">
        <path d="M100 104v-10" />
        <path d="M126 110l7-7" />
        <path d="M74 110l-7-7" />
      </g>
    </svg>
  );
}

/* WaypointGrid — a coordinate-grid corner with a dropped location pin. */
export function WaypointGrid({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="0.85" opacity="0.32">
        <path d="M40 8v184M84 8v184M128 8v184M172 8v184" />
        <path d="M8 44h184M8 88h184M8 132h184M8 176h184" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <path d="M84 88h-8M88 88v-8M84 88h8M88 88v8" />
      </g>
      {/* Dropped pin at a grid intersection — accent. */}
      <g transform="translate(128 88)">
        <path
          d="M0 28 C -11 12 -13 8 -13 0 A 13 13 0 1 1 13 0 C 13 8 11 12 0 28Z"
          fill="var(--color-accent)"
        />
        <circle cx="0" cy="-1" r="4.5" fill="var(--sc-bg)" />
      </g>
    </svg>
  );
}

/* Meridian — a globe wireframe of longitude/latitude arcs. Scope, the map. */
export function Meridian({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
      <g stroke="currentColor" fill="none" strokeWidth="0.9" opacity="0.5">
        <ellipse cx="100" cy="100" rx="34" ry="84" />
        <ellipse cx="100" cy="100" rx="64" ry="84" />
        <path d="M16 100h168" />
        <path d="M28 60h144M28 140h144" />
      </g>
      {/* A pinned point on the globe — accent. */}
      <circle cx="132" cy="64" r="3.6" fill="var(--color-accent)" />
      <circle cx="132" cy="64" r="8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
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
