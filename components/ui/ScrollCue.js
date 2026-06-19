export default function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="animate-bob size-6 text-mint/70"
      >
        <path
          d="M5 9l7 7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
