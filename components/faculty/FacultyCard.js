'use client';

import Link from 'next/link';
import Image from 'next/image';
import Badge from '../ui/Badge.js';
import StarRating from '../ui/StarRating.js';
import { trackAnalyticsEvent } from '../../lib/analytics.js';

const MAX_DOMAIN_BADGES = 2;

function Cover({ coverUrl, emblemUrl, name }) {
  const isLocal = typeof coverUrl === 'string' && coverUrl.startsWith('/');

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      {coverUrl ? (
        isLocal ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

/* Catalog card — same silhouette as the home "featured" cards, enriched
   with domain badges. Fires `card_click` on its way to the detail sheet. */
export default function FacultyCard({ faculty }) {
  const {
    slug,
    name,
    city,
    coverUrl,
    emblemUrl,
    avgRating,
    reviewCount,
    domains = [],
    multiCampus = false,
  } = faculty;

  const visibleDomains = domains.slice(0, MAX_DOMAIN_BADGES);
  const hiddenCount = domains.length - visibleDomains.length;

  return (
    <Link
      href={`/facultati/${slug}`}
      onClick={() => trackAnalyticsEvent('card_click', slug)}
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-1.5 hover:border-primary-soft/60 hover:shadow-lift focus-visible:[outline-offset:-2px]"
    >
      <Cover coverUrl={coverUrl} emblemUrl={emblemUrl} name={name} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {(visibleDomains.length > 0 || multiCampus) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleDomains.map((domain) => (
              <Badge key={domain} tone="neutral">
                {domain}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <span className="text-xs font-semibold text-text-muted">
                +{hiddenCount}
              </span>
            )}
            {multiCampus && <Badge tone="highlight">Mai multe campusuri</Badge>}
          </div>
        )}

        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug transition-colors group-hover:text-primary-strong dark:group-hover:text-primary-soft">
          {name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
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
