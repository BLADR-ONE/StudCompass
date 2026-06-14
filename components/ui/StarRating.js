'use client';

import { useState } from 'react';

const SIZES = {
  sm: 'size-3.5',
  md: 'size-[1.125rem]',
  lg: 'size-6',
};

function Star({ filled, sizeClass }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`${sizeClass} ${
        filled ? 'text-highlight' : 'text-text-muted/30'
      }`}
    >
      <path
        d="M10 1.7l2.47 5.18 5.69.74-4.17 3.95 1.05 5.63L10 14.43 4.96 17.2l1.05-5.63L1.84 7.62l5.69-.74L10 1.7Z"
        fill="currentColor"
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? 0 : 1.4}
        fillOpacity={filled ? 1 : 0}
      />
    </svg>
  );
}

/* Display mode: <StarRating value={4.3} count={12} />
   Input mode:   <StarRating value={rating} onChange={setRating} /> */
export default function StarRating({
  value = 0,
  count,
  onChange,
  size = 'md',
  className = '',
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = SIZES[size] || SIZES.md;
  const isInput = typeof onChange === 'function';

  if (isInput) {
    const active = hovered || value;
    return (
      <div
        role="radiogroup"
        aria-label="Acordă o notă"
        className={`inline-flex items-center gap-0.5 ${className}`}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={star === 1 ? 'O stea' : `${star} stele`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            className="rounded-md p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95"
          >
            <Star filled={star <= active} sizeClass={sizeClass} />
          </button>
        ))}
      </div>
    );
  }

  const safeValue = Math.max(0, Math.min(5, Number(value) || 0));
  const percent = (safeValue / 5) * 100;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        role="img"
        aria-label={`Notă ${safeValue.toFixed(1)} din 5`}
        className="relative inline-flex"
      >
        <span className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} filled={false} sizeClass={sizeClass} />
          ))}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex gap-0.5 overflow-hidden"
          style={{ width: `${percent}%` }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="flex-none">
              <Star filled sizeClass={sizeClass} />
            </span>
          ))}
        </span>
      </span>
      {typeof count === 'number' && (
        <span className="text-xs font-medium text-text-muted">({count})</span>
      )}
    </span>
  );
}
