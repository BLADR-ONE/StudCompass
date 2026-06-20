import Link from 'next/link';
import Image from 'next/image';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import StarRating from '../ui/StarRating.js';
import { WaypointGrid, NorthStar } from '../layout/Brand.js';
import Reveal from '../ui/Reveal.js';
import MotifScroll from '../ui/MotifScroll.js';

function Cover({ coverUrl, emblemUrl, name }) {
  const isLocal = typeof coverUrl === 'string' && coverUrl.startsWith('/');

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      {coverUrl ? (
        isLocal ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <img
            src={coverUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary-strong">
          <span
            aria-hidden="true"
            className="wonky font-display text-6xl font-semibold italic text-mint/40"
          >
            {(name || '?').charAt(0)}
          </span>
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent"
      />
      {emblemUrl && (
        <img
          src={emblemUrl}
          alt=""
          loading="lazy"
          className="absolute bottom-3 left-3 size-11 rounded-full border-2 border-white/80 bg-white object-contain p-0.5 shadow-card"
        />
      )}
    </div>
  );
}

function FacultyCard({ faculty }) {
  const { slug, name, city, coverUrl, emblemUrl, avgRating, reviewCount } =
    faculty;

  return (
    <Link
      href={`/facultati/${slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-1.5 hover:border-primary-soft/60 hover:shadow-lift focus-visible:[outline-offset:-2px]"
    >
      <Cover coverUrl={coverUrl} emblemUrl={emblemUrl} name={name} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug transition-colors group-hover:text-primary-strong dark:group-hover:text-primary-soft">
          {name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3">
          <Badge tone="primary">{city}</Badge>
          {avgRating != null ? (
            <StarRating size="sm" value={avgRating} count={reviewCount} />
          ) : (
            <span className="text-xs text-text-muted">Fără recenzii încă</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-16 text-center sm:py-20">
      <WaypointGrid className="pointer-events-none absolute -bottom-20 -left-16 size-72 text-primary/[0.13] dark:text-primary-soft/[0.14]" />
      <MotifScroll
        effect="rotate-rev"
        speed={1.1}
        className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.12] dark:text-primary-soft/[0.14]"
      >
        <NorthStar className="size-full" />
      </MotifScroll>
      <div className="relative mx-auto max-w-md">
        <h3 className="font-display text-2xl font-semibold">
          Harta se desenează chiar acum.
        </h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          Catalogul StudCompass se completează cu facultăți din toată România.
          Până atunci, descoperă-ți direcția cu testul de carieră sau aruncă o
          privire în catalog.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Button href="/facultati" variant="primary">
            Deschide catalogul
          </Button>
          <Link
            href="/account/personalityTest"
            className="text-sm font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
          >
            sau fă testul de carieră →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedFaculties({ faculties = [] }) {
  return (
    <section className="py-20 sm:py-24">
      <div className="wrap">
        <Reveal
          variant="fade-up"
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="eyebrow">Apreciate de comunitate</p>
            <h2 className="mt-4 text-balance font-display text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.028em]">
              Facultăți cu cele mai bune recenzii
            </h2>
          </div>
          {faculties.length > 0 && (
            <Link
              href="/facultati"
              className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary-strong transition-colors hover:border-primary-soft/60 hover:text-primary dark:text-primary-soft dark:hover:text-mint"
            >
              Vezi tot catalogul
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          )}
        </Reveal>

        <div className="mt-12">
          {faculties.length > 0 ? (
            <Reveal
              stagger
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {faculties.map((faculty) => (
                <div key={faculty.slug} className="flex">
                  <FacultyCard faculty={faculty} />
                </div>
              ))}
            </Reveal>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
