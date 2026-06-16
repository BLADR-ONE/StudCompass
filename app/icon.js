import { ImageResponse } from 'next/og';

/* App Router icon convention. Renders the StudCompass brand mark — the
   CompassRose from components/layout/Brand.js — onto the deep-teal ink
   background, with the rose in mint so it reads clearly as a tab favicon.
   This file supersedes public/favicon.ico in the App Router. */

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d2123',
          borderRadius: 6,
        }}
      >
        {/* CompassRose, adapted from components/layout/Brand.js.
            Stroke widths are scaled up for legibility at 32px. */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="92" stroke="#a8e8e8" strokeWidth="4" />
          <g stroke="#a8e8e8" strokeWidth="3" opacity="0.7">
            <path d="M100 6v18" />
            <path d="M100 176v18" />
            <path d="M6 100h18" />
            <path d="M176 100h18" />
          </g>
          {/* North arm in accent orange — the one allowed highlight. */}
          <path
            d="M100 22 116 88 100 178 84 88Z"
            fill="#f07820"
            stroke="#f07820"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* East–west arm in mint. */}
          <path
            d="M22 100 88 84 178 100 88 116Z"
            fill="#a8e8e8"
            stroke="#a8e8e8"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <circle cx="100" cy="100" r="9" fill="#0d2123" />
          <circle cx="100" cy="100" r="5" fill="#f07820" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
