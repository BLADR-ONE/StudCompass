const TONES = {
  neutral: 'border-border bg-surface text-text-muted',
  primary:
    'border-primary/25 bg-primary/10 text-primary-strong dark:border-primary-soft/30 dark:bg-primary-soft/10 dark:text-primary-soft',
  accent:
    'border-accent/30 bg-accent/10 text-accent-strong dark:text-[#f8a060]',
  highlight:
    'border-highlight/40 bg-highlight/15 text-[#8a5d10] dark:text-highlight',
  destructive: 'border-rust/30 bg-rust/10 text-rust dark:text-rust-soft',
};

export default function Badge({
  tone = 'neutral',
  className = '',
  children,
  ...rest
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        TONES[tone] || TONES.neutral
      } ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
