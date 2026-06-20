import { GitHubIcon } from '../layout/Brand.js';

/* A wide, short, modest credit banner for an earlier contributor. Kept
   deliberately compact and secondary — clearly smaller than the lead
   developer section above it. */
export default function CreditCard({
  name = 'Toma Aris',
  handle = 'IRules',
}) {
  const profileUrl = `https://github.com/${handle}`;

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-surface-raised px-5 py-4 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-0.5 hover:border-primary-soft/60 hover:shadow-lift sm:gap-5 sm:px-6"
    >
      <img
        src={`${profileUrl}.png`}
        alt={name}
        className="size-12 shrink-0 rounded-xl border border-border object-cover sm:size-14"
        loading="lazy"
      />

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-muted">
          <GitHubIcon className="size-3.5" />
          Mulțumiri
        </p>
        <p className="mt-1 text-sm leading-snug text-text-muted sm:text-[0.95rem]">
          Merită un ochi și{' '}
          <span className="font-display font-semibold text-text transition-colors group-hover:text-primary-strong dark:group-hover:text-primary-soft">
            {name}
          </span>
          , care a ajutat la prima versiune a proiectului cu ceva timp în urmă.
        </p>
      </div>

      <span className="ml-auto hidden shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary-strong transition-colors group-hover:border-primary-soft/60 dark:text-primary-soft sm:inline-flex">
        github.com/{handle}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </a>
  );
}
