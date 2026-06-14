import Spinner from '../ui/Spinner.js';
import { CompassRose } from '../layout/Brand.js';

/* Small shared pieces of the cartographer's desk — kept together so the
   three drawers (recenzii / mesaje / utilizatori) stay visually identical. */

const dateFormatter = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function deskDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

/* Initial-letter mark, same as the traveler avatars on the public pages. */
export function AuthorMark({ name, dimmed = false }) {
  return (
    <span
      aria-hidden="true"
      className={`wonky flex size-10 flex-none items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft ${
        dimmed ? 'opacity-55' : ''
      }`}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

const PILL_TONES = {
  primary:
    'border-primary/30 text-primary-strong hover:bg-primary/10 dark:border-primary-soft/30 dark:text-primary-soft dark:hover:bg-primary-soft/10',
  rust: 'border-rust/35 text-rust hover:bg-rust/10 dark:border-[#e09478]/35 dark:text-[#e09478] dark:hover:bg-rust/25',
};

/* Compact row action. Rust tone is reserved for destructive acts
   (ascunde / blochează); primary undoes them. */
export function ActionPill({
  tone = 'primary',
  busy = false,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={busy}
      className={`inline-flex h-8 flex-none select-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition-colors duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${
        PILL_TONES[tone] || PILL_TONES.primary
      } ${className}`}
      {...rest}
    >
      {busy && <Spinner size="sm" className="size-3.5" />}
      {children}
    </button>
  );
}

/* Dashed “blank page” state, in the language of the public empty states. */
export function DeskEmpty({ title, children, action = null }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-14 text-center sm:py-16">
      <CompassRose className="pointer-events-none absolute -right-20 -top-24 size-72 text-primary/[0.08] dark:text-primary-soft/10" />
      <div className="relative mx-auto max-w-md">
        <h3 className="font-display text-2xl font-semibold">{title}</h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          {children}
        </p>
        {action && <div className="mt-7">{action}</div>}
      </div>
    </div>
  );
}

/* Rust alert banner — same voice as the auth form errors. */
export function ErrorBanner({ children }) {
  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm font-medium text-rust dark:text-[#e09478]"
    >
      {children}
    </p>
  );
}
