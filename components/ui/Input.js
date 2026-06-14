import { useId } from 'react';

export default function Input({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const messageId = `${inputId}-message`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-text"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`h-11 w-full rounded-xl border bg-surface px-4 text-[0.95rem] text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition placeholder:text-text-muted/60 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? 'border-rust focus:border-rust focus:ring-rust/25'
            : 'border-border focus:border-primary focus:ring-primary/25'
        }`}
        {...props}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={`mt-1.5 text-xs ${
            error ? 'font-medium text-rust dark:text-[#e09478]' : 'text-text-muted'
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
