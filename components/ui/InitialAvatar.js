const SIZES = {
  sm: 'size-10 text-lg',
  md: 'size-11 text-lg',
  lg: 'size-14 text-2xl',
};

export default function InitialAvatar({
  name,
  dimmed = false,
  size = 'sm',
  className = '',
}) {
  return (
    <span
      aria-hidden="true"
      className={`wonky flex flex-none items-center justify-center rounded-full bg-primary/10 font-display font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft ${
        SIZES[size] || SIZES.sm
      } ${dimmed ? 'opacity-55' : ''} ${className}`}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );
}
