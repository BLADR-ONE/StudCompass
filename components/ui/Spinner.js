const SIZES = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-9',
};

export default function Spinner({
  size = 'md',
  className = '',
  label = 'Se încarcă…',
}) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`animate-spin ${SIZES[size] || SIZES.md} ${className}`}
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.25"
        />
        <path
          d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
