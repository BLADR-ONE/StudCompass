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
      <circle cx="100" cy="100" r="97" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="100"
        cy="100"
        r="76"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 7"
      />
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.78">
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
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M100 62 107 93 138 100 107 107 100 138 93 107 62 100 93 93Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.65"
        transform="rotate(45 100 100)"
      />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
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
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeDasharray="1 10"
        opacity="0.9"
      />
      <g stroke="currentColor" strokeWidth="1.75" fill="none">
        <circle cx="14" cy="168" r="5" opacity="0.7" />
        <circle cx="74" cy="98" r="5" opacity="0.85" />
        <circle cx="134" cy="42" r="5" opacity="1" />
      </g>
      {/* Destination flag — the one accent moment, given bold presence. */}
      <g className="motif-flag" transform="translate(186 30)">
        <path d="M0 0v-26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -26 18 -20 0 -14Z" fill="var(--color-accent)" />
        <circle cx="0" cy="0" r="3.2" fill="currentColor" />
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
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path className="motif-link motif-link-2" d="M70 120 84 56 132 70" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <g stroke="currentColor" strokeWidth="1.75" fill="var(--sc-bg)">
        <circle className="motif-star" cx="28" cy="150" r="3.6" />
        <circle className="motif-star motif-star-2" cx="70" cy="120" r="4.2" />
        <circle className="motif-star motif-star-3" cx="96" cy="146" r="3" />
        <circle className="motif-star motif-star-4" cx="84" cy="56" r="3.6" />
        <circle className="motif-star motif-star-2" cx="158" cy="96" r="3.6" />
        <circle className="motif-star motif-star-3" cx="176" cy="40" r="3" />
      </g>
      {/* Brightest star — accent four-point spark, enlarged. */}
      <g className="motif-pulse" style={{ transformOrigin: '132px 70px' }} transform="translate(132 70)">
        <path
          d="M0 -14 3.3 -3.3 14 0 3.3 3.3 0 14 -3.3 3.3 -14 0 -3.3 -3.3Z"
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
        <path className="motif-contour motif-contour-1" d="M6 96 C 50 60 88 132 128 92 C 152 68 178 84 196 70" strokeWidth="2" opacity="0.9" />
        <path className="motif-contour motif-contour-2" d="M2 122 C 48 90 92 150 134 112 C 160 90 182 106 198 94" strokeWidth="1.75" opacity="0.7" />
        <path className="motif-contour motif-contour-3" d="M8 70 C 48 42 84 104 122 70 C 148 48 176 62 194 50" strokeWidth="1.5" opacity="0.62" />
        <path className="motif-contour motif-contour-4" d="M12 148 C 54 120 96 172 140 138 C 166 118 184 130 198 120" strokeWidth="1.25" opacity="0.48" />
        <path className="motif-contour motif-contour-5" d="M16 46 C 50 26 80 78 116 50" strokeWidth="1.25" opacity="0.42" />
      </g>
      {/* Summit marker — accent benchmark dot, with a halo ring. */}
      <circle cx="128" cy="92" r="8.5" stroke="var(--color-accent)" strokeWidth="1.25" fill="none" opacity="0.5" />
      <circle className="motif-pulse" style={{ transformOrigin: '128px 92px' }} cx="128" cy="92" r="4.2" fill="var(--color-accent)" />
    </svg>
  );
}

/* Horizon — concentric arcs over a baseline with a rising marker. Beginnings. */
export function Horizon({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <line x1="6" y1="132" x2="194" y2="132" stroke="currentColor" strokeWidth="1.75" opacity="0.75" />
      <g className="motif-arcs" stroke="currentColor" fill="none">
        <path d="M52 132 A 48 48 0 0 1 148 132" strokeWidth="1.75" opacity="0.85" />
        <path d="M34 132 A 66 66 0 0 1 166 132" strokeWidth="1.5" opacity="0.6" />
        <path d="M16 132 A 84 84 0 0 1 184 132" strokeWidth="1.25" opacity="0.4" />
      </g>
      {/* Sun / waypoint cresting the horizon — accent, enlarged with longer rays.
          It rises and sets. */}
      <g className="motif-rise">
        <circle cx="100" cy="132" r="14" fill="var(--color-accent)" />
        <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.75">
          <path d="M100 100v-13" />
          <path d="M128 108l9-9" />
          <path d="M72 108l-9-9" />
          <path d="M140 132h13" />
          <path d="M47 132h13" />
        </g>
      </g>
    </svg>
  );
}

/* WaypointGrid — a coordinate-grid corner with a dropped location pin. */
export function WaypointGrid({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.42">
        <path d="M40 8v184M84 8v184M128 8v184M172 8v184" />
        <path d="M8 44h184M8 88h184M8 132h184M8 176h184" />
      </g>
      <g className="motif-cross" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" style={{ transformOrigin: '86px 88px' }}>
        <path d="M84 88h-9M88 88v-9M84 88h9M88 88v9" />
      </g>
      {/* Dropped pin at a grid intersection — accent, enlarged. Drops + settles. */}
      <g className="motif-drop" style={{ transformOrigin: '128px 116px' }} transform="translate(128 88)">
        <path
          d="M0 33 C -13 14 -15.5 9 -15.5 0 A 15.5 15.5 0 1 1 15.5 0 C 15.5 9 13 14 0 33Z"
          fill="var(--color-accent)"
        />
        <circle cx="0" cy="-1" r="5.4" fill="var(--sc-bg)" />
      </g>
    </svg>
  );
}

/* Meridian — a globe wireframe of longitude/latitude arcs. Scope, the map. */
export function Meridian({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      {/* The graticule turns slowly behind the fixed limb, like a spun globe. */}
      <g className="motif-globe" stroke="currentColor" fill="none" strokeWidth="1.4" opacity="0.65" style={{ transformOrigin: '100px 100px' }}>
        <ellipse cx="100" cy="100" rx="34" ry="84" />
        <ellipse cx="100" cy="100" rx="64" ry="84" />
        <path d="M16 100h168" />
        <path d="M28 60h144M28 140h144" />
      </g>
      {/* A pinned point on the globe — accent, enlarged with a halo. */}
      <circle className="motif-pulse" style={{ transformOrigin: '132px 64px' }} cx="132" cy="64" r="4.6" fill="var(--color-accent)" />
      <circle cx="132" cy="64" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
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
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      {/* Graduation ticks around the limb. */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <path d="M100 10v14" />
        <path d="M100 176v14" />
        <path d="M10 100h14" />
        <path d="M176 100h14" />
        <path d="M36 36l9 9" />
        <path d="M155 155l9 9" />
        <path d="M164 36l-9 9" />
        <path d="M45 155l-9 9" />
      </g>
      {/* Rete star-pointers — an inner web, now legible. */}
      <path
        d="M100 38 122 78 100 100 78 78Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* The alidade (sighting rule) — pivots about the centre, bolder. */}
      <g className="motif-spin-host" style={{ transformOrigin: '100px 100px' }}>
        <path d="M28 100h144" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" opacity="0.9" />
        <circle cx="172" cy="100" r="4" fill="var(--color-accent)" />
        <circle cx="28" cy="100" r="3" fill="currentColor" opacity="0.7" />
      </g>
      <circle cx="100" cy="100" r="4" fill="currentColor" />
    </svg>
  );
}

/* Switchback — a mountain trail folding back on itself up a slope, with a
   summit marker. The route draws itself like a plotted ascent. */
export function Switchback({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Slope hint. */}
      <path d="M8 184 L 96 36 L 184 184" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      {/* The zig-zag ascent — drawn as a switchback path that plots itself. */}
      <path
        className="motif-route motif-switchback"
        d="M28 176 L 150 158 L 56 128 L 150 110 L 70 84 L 142 68 L 86 48 L 124 36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Trailhead marker. */}
      <circle cx="28" cy="176" r="3.6" stroke="currentColor" strokeWidth="1.75" opacity="0.7" />
      {/* Summit flag — the accent moment, bolder. */}
      <g className="motif-flag" transform="translate(124 36)">
        <path d="M0 0v-26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -26 18 -19 0 -12Z" fill="var(--color-accent)" />
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
      <path d="M6 168 C 56 156 96 172 140 160 C 168 152 184 162 196 156" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      {/* The main channel and its branches, fanning toward the sea. */}
      <g className="motif-flow" stroke="currentColor" fill="none" strokeLinecap="round">
        <path d="M150 14 C 128 54 132 92 96 120 C 70 140 44 150 18 162" strokeWidth="2.5" opacity="0.9" />
        <path d="M132 92 C 110 108 96 142 70 160" strokeWidth="1.75" opacity="0.65" />
        <path d="M120 104 C 132 130 150 142 174 158" strokeWidth="1.75" opacity="0.65" />
        <path d="M114 70 C 96 84 84 96 60 104" strokeWidth="1.4" opacity="0.55" />
        <path d="M138 60 C 156 78 168 88 188 96" strokeWidth="1.4" opacity="0.5" />
      </g>
      {/* Depth sounding — accent, with a halo ring. */}
      <circle cx="96" cy="120" r="9" stroke="var(--color-accent)" strokeWidth="1.25" fill="none" opacity="0.5" />
      <circle className="motif-pulse" style={{ transformOrigin: '96px 120px' }} cx="96" cy="120" r="4.4" fill="var(--color-accent)" />
    </svg>
  );
}

/* NorthStar — a radiant pole star over a faint pole arc. The fixed point you
   steer by. The star draws its rays and breathes. */
export function NorthStar({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Circumpolar arcs the star presides over. */}
      <g stroke="currentColor" fill="none" opacity="0.45">
        <path d="M40 150 A 78 78 0 0 1 160 150" strokeWidth="1.25" />
        <path d="M58 162 A 56 56 0 0 1 142 162" strokeWidth="1.1" />
      </g>
      {/* Long radiant rays. */}
      <g className="motif-rays" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" style={{ transformOrigin: '100px 84px' }}>
        <path d="M100 26v30" />
        <path d="M100 112v30" />
        <path d="M42 84h30" />
        <path d="M128 84h30" />
        <path d="M62 46l20 20" />
        <path d="M138 122l-20-20" />
        <path d="M138 46l-20 20" />
        <path d="M62 122l20-20" />
      </g>
      {/* The four-point star itself — accent, enlarged. */}
      <g className="motif-pulse" style={{ transformOrigin: '100px 84px' }}>
        <path
          d="M100 54 109 75 130 84 109 93 100 114 91 93 70 84 91 75Z"
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
      <g stroke="currentColor" strokeWidth="2" opacity="0.85">
        <path d="M22 130h156" />
        <path d="M22 120v20" />
        <path d="M61 120v20" />
        <path d="M100 120v20" />
        <path d="M139 120v20" />
        <path d="M178 120v20" />
      </g>
      {/* Minor ticks. */}
      <g stroke="currentColor" strokeWidth="1.25" opacity="0.5">
        <path d="M41.5 125v10" />
        <path d="M80.5 125v10" />
        <path d="M119.5 125v10" />
        <path d="M158.5 125v10" />
      </g>
      {/* Filled first interval — reads as "distance covered". */}
      <path d="M22 130h39" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
      {/* Stepping dividers above the bar — the walking instrument, bolder. */}
      <g className="motif-step" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={{ transformOrigin: '100px 130px' }}>
        <path d="M86 68 100 116 114 68" />
        <circle cx="100" cy="64" r="3.2" fill="currentColor" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Third wave — bolder eye-catcher marks. Same contract (aria-hidden, single
   className, 200×200, currentColor strokes, one accent node) but authored at a
   heavier visual weight from the start: thicker strokes, larger accent moments,
   and animations built to draw the eye rather than whisper.
--------------------------------------------------------------------------- */

/* WindRose — a bold 16-point compass star, the loudest cartographer mark.
   Long accent N-S spindle over short cardinal rays inside a graduated ring.
   The whole rose turns slowly; the accent needle pulses. An eye-catcher. */
export function WindRose({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="2" opacity="0.85" />
      <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.5" />
      <g className="motif-rose-turn" style={{ transformOrigin: '100px 100px' }}>
        {/* Diagonal half-winds — slim kite points. */}
        <g stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.55">
          <path d="M100 100 78 78 56 56 84 92Z" />
          <path d="M100 100 122 78 144 56 116 92Z" />
          <path d="M100 100 122 122 144 144 116 108Z" />
          <path d="M100 100 78 122 56 144 84 108Z" />
        </g>
        {/* Cardinal star — bold filled flanks. */}
        <path d="M100 100 90 90 100 22 110 90Z" fill="currentColor" opacity="0.75" />
        <path d="M100 100 110 110 100 178 90 110Z" fill="currentColor" opacity="0.4" />
        <path d="M100 100 90 110 22 100 90 90Z" fill="currentColor" opacity="0.5" />
        <path d="M100 100 110 90 178 100 110 110Z" fill="currentColor" opacity="0.5" />
        {/* The accent North spindle — the one bright moment. */}
        <path d="M100 100 93 93 100 30 107 93Z" fill="var(--color-accent)" />
      </g>
      <circle className="motif-pulse" style={{ transformOrigin: '100px 100px' }} cx="100" cy="100" r="5" fill="var(--color-accent)" />
    </svg>
  );
}

/* Sextant — a graduated quarter-arc instrument with a swinging index arm.
   Sighting an angle to the horizon. The index arm sweeps; the accent sights. */
export function Sextant({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* The graduated arc (the limb). */}
      <path d="M40 168 A 128 128 0 0 1 168 40" stroke="currentColor" strokeWidth="2.5" opacity="0.85" />
      <path d="M52 168 A 116 116 0 0 1 168 52" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      {/* Frame legs to the pivot. */}
      <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.7">
        <path d="M40 168 L 100 56" />
        <path d="M168 40 L 100 56" />
      </g>
      {/* Graduation ticks along the limb. */}
      <g stroke="currentColor" strokeWidth="1.25" opacity="0.5">
        <path d="M64 160 l-6 9" />
        <path d="M96 150 l-3 10" />
        <path d="M130 134 l2 10" />
        <path d="M156 110 l8 6" />
      </g>
      {/* The index arm — pivots from the apex, sweeping the arc. */}
      <g className="motif-sweep" style={{ transformOrigin: '100px 56px' }}>
        <path d="M100 56 L 60 156" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <circle cx="60" cy="156" r="4.4" fill="var(--color-accent)" />
      </g>
      {/* Pivot + horizon mirror (accent index). */}
      <circle cx="100" cy="56" r="3.4" fill="currentColor" />
    </svg>
  );
}

/* Latitude — a banded globe of stacked latitude lines with a tracked parallel.
   The accent parallel glides up the sphere; the bands breathe. Geography. */
export function Latitude({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      {/* Stacked parallels — chords across the sphere, foreshortened. */}
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <path d="M44 56 Q 100 50 156 56" strokeWidth="1.4" opacity="0.5" />
        <path d="M24 80 Q 100 73 176 80" strokeWidth="1.6" opacity="0.62" />
        <path d="M16 124 Q 100 132 184 124" strokeWidth="1.6" opacity="0.62" />
        <path d="M30 150 Q 100 159 170 150" strokeWidth="1.4" opacity="0.5" />
      </g>
      {/* The equator — bolder central band. */}
      <path d="M14 102 Q 100 96 186 102" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      {/* The tracked accent parallel — glides between latitudes. */}
      <g className="motif-parallel" style={{ transformOrigin: '100px 100px' }}>
        <path d="M22 100 Q 100 94 178 100" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="178" cy="100" r="4" fill="var(--color-accent)" />
      </g>
      <circle cx="100" cy="100" r="3.2" fill="currentColor" opacity="0.7" />
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
