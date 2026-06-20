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
        className="motif-route"
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
      <g className="motif-flag" transform="translate(186 30)">
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
        className="motif-link"
        d="M28 150 70 120 96 146 132 70 158 96 176 40"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path className="motif-link motif-link-2" d="M70 120 84 56 132 70" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <g stroke="currentColor" strokeWidth="1.25" fill="var(--sc-bg)">
        <circle className="motif-star" cx="28" cy="150" r="3" />
        <circle className="motif-star motif-star-2" cx="70" cy="120" r="3.5" />
        <circle className="motif-star motif-star-3" cx="96" cy="146" r="2.5" />
        <circle className="motif-star motif-star-4" cx="84" cy="56" r="3" />
        <circle className="motif-star motif-star-2" cx="158" cy="96" r="3" />
        <circle className="motif-star motif-star-3" cx="176" cy="40" r="2.5" />
      </g>
      {/* Brightest star — accent four-point spark. */}
      <g className="motif-pulse" style={{ transformOrigin: '132px 70px' }} transform="translate(132 70)">
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
        <path className="motif-contour motif-contour-1" d="M6 96 C 50 60 88 132 128 92 C 152 68 178 84 196 70" strokeWidth="1.25" opacity="0.7" />
        <path className="motif-contour motif-contour-2" d="M2 122 C 48 90 92 150 134 112 C 160 90 182 106 198 94" strokeWidth="1" opacity="0.5" />
        <path className="motif-contour motif-contour-3" d="M8 70 C 48 42 84 104 122 70 C 148 48 176 62 194 50" strokeWidth="1" opacity="0.45" />
        <path className="motif-contour motif-contour-4" d="M12 148 C 54 120 96 172 140 138 C 166 118 184 130 198 120" strokeWidth="0.85" opacity="0.32" />
        <path className="motif-contour motif-contour-5" d="M16 46 C 50 26 80 78 116 50" strokeWidth="0.85" opacity="0.3" />
      </g>
      {/* Summit marker — accent benchmark dot. */}
      <circle className="motif-pulse" style={{ transformOrigin: '128px 92px' }} cx="128" cy="92" r="3.4" fill="var(--color-accent)" />
    </svg>
  );
}

/* Horizon — concentric arcs over a baseline with a rising marker. Beginnings. */
export function Horizon({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <line x1="6" y1="132" x2="194" y2="132" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
      <g className="motif-arcs" stroke="currentColor" fill="none">
        <path d="M52 132 A 48 48 0 0 1 148 132" strokeWidth="1.25" opacity="0.7" />
        <path d="M34 132 A 66 66 0 0 1 166 132" strokeWidth="1" opacity="0.45" />
        <path d="M16 132 A 84 84 0 0 1 184 132" strokeWidth="0.85" opacity="0.28" />
      </g>
      {/* Sun / waypoint cresting the horizon — accent. It rises and sets. */}
      <g className="motif-rise">
        <circle cx="100" cy="132" r="11" fill="var(--color-accent)" />
        <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.6">
          <path d="M100 104v-10" />
          <path d="M126 110l7-7" />
          <path d="M74 110l-7-7" />
        </g>
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
      <g className="motif-cross" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" style={{ transformOrigin: '86px 88px' }}>
        <path d="M84 88h-8M88 88v-8M84 88h8M88 88v8" />
      </g>
      {/* Dropped pin at a grid intersection — accent. It drops and settles. */}
      <g className="motif-drop" style={{ transformOrigin: '128px 116px' }} transform="translate(128 88)">
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
      {/* The graticule turns slowly behind the fixed limb, like a spun globe. */}
      <g className="motif-globe" stroke="currentColor" fill="none" strokeWidth="0.9" opacity="0.5" style={{ transformOrigin: '100px 100px' }}>
        <ellipse cx="100" cy="100" rx="34" ry="84" />
        <ellipse cx="100" cy="100" rx="64" ry="84" />
        <path d="M16 100h168" />
        <path d="M28 60h144M28 140h144" />
      </g>
      {/* A pinned point on the globe — accent. */}
      <circle className="motif-pulse" style={{ transformOrigin: '132px 64px' }} cx="132" cy="64" r="3.6" fill="var(--color-accent)" />
      <circle cx="132" cy="64" r="8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Second wave — five more field-notes marks, same contract as the family
   above. Each carries element-level classes (`.motif-*`) so the CSS in
   globals.css can animate individual parts (a needle, a drawn route, a
   falling star) instead of only translating the whole node. All decorative,
   aria-hidden, single accent moment, 200×200 viewBox, currentColor strokes.
--------------------------------------------------------------------------- */

/* Astrolabe — a graduated instrument ring with a pivoting sighting rule.
   Measuring your position against the sky. The rule sweeps slowly. */
export function Astrolabe({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      {/* Graduation ticks around the limb. */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.55">
        <path d="M100 12v12" />
        <path d="M100 176v12" />
        <path d="M12 100h12" />
        <path d="M176 100h12" />
        <path d="M37.5 37.5l8 8" />
        <path d="M154.5 154.5l8 8" />
        <path d="M162.5 37.5l-8 8" />
        <path d="M45.5 154.5l-8 8" />
      </g>
      {/* Rete star-pointers — a faint inner web. */}
      <path
        d="M100 38 122 78 100 100 78 78Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.35"
      />
      {/* The alidade (sighting rule) — pivots about the centre. */}
      <g className="motif-spin-host" style={{ transformOrigin: '100px 100px' }}>
        <path d="M30 100h140" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="170" cy="100" r="3" fill="var(--color-accent)" />
        <circle cx="30" cy="100" r="2.4" fill="currentColor" opacity="0.6" />
      </g>
      <circle cx="100" cy="100" r="3.2" fill="currentColor" />
    </svg>
  );
}

/* Switchback — a mountain trail folding back on itself up a slope, with a
   summit marker. The route draws itself like a plotted ascent. */
export function Switchback({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Slope hint. */}
      <path d="M8 184 L 96 36 L 184 184" stroke="currentColor" strokeWidth="0.85" opacity="0.3" />
      {/* The zig-zag ascent — drawn as a switchback path that plots itself. */}
      <path
        className="motif-route motif-switchback"
        d="M28 176 L 150 158 L 56 128 L 150 110 L 70 84 L 142 68 L 86 48 L 124 36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.78"
      />
      {/* Trailhead marker. */}
      <circle cx="28" cy="176" r="3" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
      {/* Summit flag — the accent moment. */}
      <g transform="translate(124 36)">
        <path d="M0 0v-22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 -22 15 -16 0 -10Z" fill="var(--color-accent)" />
      </g>
    </svg>
  );
}

/* RiverDelta — branching watercourses fanning to a coastline with a depth
   sounding. The tributaries shimmer like light on moving water. */
export function RiverDelta({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Coastline. */}
      <path d="M6 168 C 56 156 96 172 140 160 C 168 152 184 162 196 156" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* The main channel and its branches, fanning toward the sea. */}
      <g className="motif-flow" stroke="currentColor" fill="none" strokeLinecap="round">
        <path d="M150 14 C 128 54 132 92 96 120 C 70 140 44 150 18 162" strokeWidth="1.5" opacity="0.75" />
        <path d="M132 92 C 110 108 96 142 70 160" strokeWidth="1" opacity="0.5" />
        <path d="M120 104 C 132 130 150 142 174 158" strokeWidth="1" opacity="0.5" />
        <path d="M114 70 C 96 84 84 96 60 104" strokeWidth="0.85" opacity="0.4" />
        <path d="M138 60 C 156 78 168 88 188 96" strokeWidth="0.85" opacity="0.35" />
      </g>
      {/* Depth sounding — accent. */}
      <circle cx="96" cy="120" r="3.4" fill="var(--color-accent)" />
    </svg>
  );
}

/* NorthStar — a radiant pole star over a faint pole arc. The fixed point you
   steer by. The star draws its rays and breathes. */
export function NorthStar({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Faint circumpolar arcs the star presides over. */}
      <g stroke="currentColor" fill="none" opacity="0.32">
        <path d="M40 150 A 78 78 0 0 1 160 150" strokeWidth="0.85" />
        <path d="M58 162 A 56 56 0 0 1 142 162" strokeWidth="0.75" />
      </g>
      {/* Long radiant rays. */}
      <g className="motif-rays" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" style={{ transformOrigin: '100px 84px' }}>
        <path d="M100 30v28" />
        <path d="M100 110v28" />
        <path d="M46 84h28" />
        <path d="M126 84h28" />
        <path d="M64 48l18 18" />
        <path d="M136 120l-18-18" />
        <path d="M136 48l-18 18" />
        <path d="M64 120l18-18" />
      </g>
      {/* The four-point star itself — accent. */}
      <g className="motif-pulse" style={{ transformOrigin: '100px 84px' }}>
        <path
          d="M100 60 107 77 124 84 107 91 100 108 93 91 76 84 93 77Z"
          fill="var(--color-accent)"
        />
      </g>
    </svg>
  );
}

/* ScaleBar — a cartographer's distance scale: a graduated ruler with a pair
   of stepping dividers. Measuring the distance left to travel. The dividers
   "walk" the bar. */
export function ScaleBar({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* The graduated bar. */}
      <g stroke="currentColor" strokeWidth="1.25" opacity="0.7">
        <path d="M22 130h156" />
        <path d="M22 122v16" />
        <path d="M61 122v16" />
        <path d="M100 122v16" />
        <path d="M139 122v16" />
        <path d="M178 122v16" />
      </g>
      {/* Minor ticks. */}
      <g stroke="currentColor" strokeWidth="0.85" opacity="0.4">
        <path d="M41.5 126v8" />
        <path d="M80.5 126v8" />
        <path d="M119.5 126v8" />
        <path d="M158.5 126v8" />
      </g>
      {/* Filled first interval — reads as "distance covered". */}
      <path d="M22 130h39" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Stepping dividers above the bar — the walking instrument. */}
      <g className="motif-step" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transformOrigin: '100px 130px' }}>
        <path d="M86 72 100 116 114 72" />
        <circle cx="100" cy="68" r="2.4" fill="currentColor" />
      </g>
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
