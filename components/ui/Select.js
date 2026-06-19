import { useId } from 'react';

export default function Select({
  label,
  hint,
  error,
  id,
  className = '',
  children,
  ...props
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const messageId = `${selectId}-message`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-semibold text-text"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`h-11 w-full appearance-none rounded-xl border bg-surface pl-4 pr-10 text-[0.95rem] text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-rust focus:border-rust focus:ring-rust/25'
              : 'border-border focus:border-primary focus:ring-primary/25'
          }`}
          {...props}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          className={`mt-1.5 text-xs ${
            error ? 'font-medium text-rust dark:text-rust-soft' : 'text-text-muted'
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
