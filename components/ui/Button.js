import Link from 'next/link';
import Spinner from './Spinner.js';

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-primary-strong',
  accent:
    'bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_24px_-10px_rgb(240_120_32/0.6)] hover:bg-accent-strong',
  ghost:
    'border border-border bg-transparent text-text hover:border-primary-soft hover:text-primary-strong dark:hover:text-primary-soft',
  destructive: 'bg-rust text-white hover:bg-[#6f3220]',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[0.95rem]',
  lg: 'h-13 px-8 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${
    SIZES[size] || SIZES.md
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
