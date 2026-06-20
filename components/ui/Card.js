export default function Card({
  as: Tag = 'div',
  interactive = false,
  padded = true,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`rounded-3xl border border-border bg-surface-raised shadow-card ${
        padded ? 'p-6' : ''
      } ${
        interactive
          ? 'transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-1 hover:border-primary-soft/60 hover:shadow-lift'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
