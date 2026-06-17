import { CompassRose, GitHubIcon } from '../layout/Brand.js';

/* Featured developer banner — the page lead. A full-width branded panel
   introducing the single creator behind StudCompass, with live GitHub
   stats and a clear link to the profile. Built to read as a proper
   intro/banner, not a small card. */
export default function DeveloperHero({ owner, eyebrow = 'Despre noi' }) {
  const handle = owner.html_url.replace('https://github.com/', '');

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
      {/* Soft branded wash behind the lead, anchored to the night palette
          on the right so the compass rose has somewhere to live. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-soft/[0.10] via-transparent to-transparent dark:from-primary-soft/[0.06]"
      />

      <div className="wrap relative">
        <p
          className="eyebrow animate-rise"
          style={{ animationDelay: '60ms' }}
        >
          {eyebrow}
        </p>

        <h1
          className="animate-rise mt-5 max-w-3xl text-balance font-display text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.05]"
          style={{ animationDelay: '140ms' }}
        >
          StudCompass este desenat de{' '}
          <em className="wonky italic text-highlight">un singur om</em>.
        </h1>

        <p
          className="animate-rise mt-5 max-w-2xl text-pretty text-base leading-relaxed text-text-muted sm:text-lg"
          style={{ animationDelay: '220ms' }}
        >
          O busolă pentru elevii și studenții din România care vor să compare
          facultăți mai sigur — gândită, construită și întreținută de o singură
          persoană. Iată cartograful.
        </p>

        {/* The featured panel. Avatar on the left, identity + stats + CTA on
            the right; collapses to a stacked layout on small screens. */}
        <div
          className="animate-rise mt-12 overflow-hidden rounded-[2.25rem] border border-border bg-surface-raised shadow-card transition-all duration-300 hover:shadow-lift"
          style={{ animationDelay: '320ms' }}
        >
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <CompassRose className="animate-spin-slow pointer-events-none absolute -right-20 -top-24 hidden size-80 text-primary-soft/10 lg:block" />

            {/* Avatar, framed like a portrait coordinate. */}
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary-soft/30 to-accent/20 blur-md"
              />
              <img
                src={owner.avatar_url}
                alt={owner.name}
                className="relative size-32 rounded-[1.6rem] border border-border object-cover shadow-sm sm:size-40"
                loading="eager"
              />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-(--sc-eyebrow) shadow-sm">
                creator unic
              </span>
            </div>

            <div className="relative min-w-0">
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {owner.name}
              </h2>

              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-text-muted sm:text-[1.05rem]">
                {owner.bio}
              </p>

              {/* Live coordinates from GitHub. */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-baseline gap-1.5 rounded-2xl border border-border bg-surface px-4 py-2.5">
                  <span className="font-display text-lg font-semibold text-primary-strong dark:text-primary-soft">
                    {owner.public_repos}
                  </span>
                  <span className="text-sm text-text-muted">repo-uri publice</span>
                </span>
                <span className="inline-flex items-baseline gap-1.5 rounded-2xl border border-border bg-surface px-4 py-2.5">
                  <span className="font-display text-lg font-semibold text-primary-strong dark:text-primary-soft">
                    {owner.followers}
                  </span>
                  <span className="text-sm text-text-muted">urmăritori</span>
                </span>
              </div>

              <a
                href={owner.html_url}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex h-12 select-none items-center justify-center gap-2.5 rounded-full bg-accent px-7 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_24px_-10px_rgb(240_120_32/0.6)] transition-all duration-200 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]"
              >
                <GitHubIcon className="size-[1.05rem]" />
                {handle}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
