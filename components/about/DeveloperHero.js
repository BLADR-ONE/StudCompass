import Image from 'next/image';
import { CompassRose, GitHubIcon } from '../layout/Brand.js';
import ScrollCue from '../ui/ScrollCue.js';
import { DEFAULT_HEADER_IMAGE } from '../../lib/site-constants.js';

/* Featured developer banner — the page lead. A full-width branded panel
   introducing the single creator behind StudCompass, with live GitHub
   stats and a clear link to the profile. Sits over the same full-bleed
   header image used on the home hero so the transparent navbar blends
   seamlessly at the top of /about. */
export default function DeveloperHero({ owner, eyebrow = 'Despre noi', headerImage = DEFAULT_HEADER_IMAGE }) {
  const handle = owner.html_url.replace('https://github.com/', '');
  const headerSrc =
    typeof headerImage === 'string' && headerImage.startsWith('data:')
      ? headerImage
      : `/assets/${headerImage}`;

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-bg">
      {/* Full-bleed background photo — same asset/logic as home Hero. */}
      <Image
        src={headerSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_62%]"
      />

      {/* Ink veil, heavier on the text side. Mirrors home Hero. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/10"
      />

      {/* Top vignette for navbar legibility. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/70 to-transparent"
      />

      <CompassRose className="animate-spin-slow pointer-events-none absolute -right-24 top-24 hidden size-[26rem] text-mint/15 lg:block" />

      <div className="wrap relative py-32">
        <p
          className="eyebrow animate-rise !text-mint"
          style={{ animationDelay: '60ms' }}
        >
          {eyebrow}
        </p>

        <h1
          className="animate-rise mt-5 max-w-3xl text-balance font-display text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.05] text-white"
          style={{ animationDelay: '140ms' }}
        >
          StudCompass este desenat de{' '}
          <em className="wonky italic text-highlight">un singur om</em>.
        </h1>

        <p
          className="animate-rise mt-5 max-w-2xl text-pretty text-base leading-relaxed text-mint/85 sm:text-lg"
          style={{ animationDelay: '220ms' }}
        >
          O busolă pentru elevii și studenții din România care vor să compare
          facultăți mai sigur — gândită, construită și întreținută de o singură
          persoană. Iată cartograful.
        </p>

        {/* The featured panel. Avatar on the left, identity + stats + CTA on
            the right; collapses to a stacked layout on small screens.
            Night-glass treatment so it reads over the dark hero photo. */}
        <div
          className="animate-rise mt-12 overflow-hidden rounded-[2.25rem] border border-mint/20 bg-ink/60 shadow-card backdrop-blur-md transition-all duration-300 hover:border-mint/35 hover:shadow-lift"
          style={{ animationDelay: '320ms' }}
        >
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <CompassRose className="animate-spin-slow pointer-events-none absolute -right-20 -top-24 hidden size-80 text-mint/10 lg:block" />

            {/* Avatar, framed like a portrait coordinate. */}
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary-soft/40 to-accent/25 blur-md"
              />
              <img
                src={owner.avatar_url}
                alt={owner.name}
                width={160}
                height={160}
                className="relative size-32 rounded-[1.6rem] border border-mint/25 object-cover shadow-sm sm:size-40"
                loading="eager"
              />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-mint/30 bg-ink/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-mint/80 shadow-sm">
                creator
              </span>
            </div>

            <div className="relative min-w-0">
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {owner.name}
              </h2>

              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-mint/80 sm:text-[1.05rem]">
                {owner.bio}
              </p>

              {/* Live coordinates from GitHub. */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-baseline gap-1.5 rounded-2xl border border-mint/20 bg-white/[0.06] px-4 py-2.5">
                  <span className="font-display text-lg font-semibold text-primary-soft">
                    {owner.public_repos}
                  </span>
                  <span className="text-sm text-mint/70">repo-uri publice</span>
                </span>
                <span className="inline-flex items-baseline gap-1.5 rounded-2xl border border-mint/20 bg-white/[0.06] px-4 py-2.5">
                  <span className="font-display text-lg font-semibold text-primary-soft">
                    {owner.followers}
                  </span>
                  <span className="text-sm text-mint/70">urmăritori</span>
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

      {/* Scroll cue */}
      <ScrollCue />
    </section>
  );
}
