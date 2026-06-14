'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Select from '../ui/Select.js';
import Spinner from '../ui/Spinner.js';

/* The map legend: city, study domains, and the multi-campus switch.
   State lives entirely in the URL — every change rewrites the params. */
export default function FilterBar({
  cities = [],
  domains = [],
  city = '',
  selectedDomains = [],
  multiCampus = false,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasFilters = Boolean(city) || selectedDomains.length > 0 || multiCampus;

  const apply = (next) => {
    const params = new URLSearchParams();
    if (next.city) {
      params.set('city', next.city);
    }
    for (const slug of next.domains) {
      params.append('domain', slug);
    }
    if (next.multiCampus) {
      params.set('multiCampus', '1');
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/facultati?${query}` : '/facultati', {
        scroll: false,
      });
    });
  };

  const setCity = (value) =>
    apply({ city: value, domains: selectedDomains, multiCampus });

  const toggleDomain = (slug) =>
    apply({
      city,
      domains: selectedDomains.includes(slug)
        ? selectedDomains.filter((item) => item !== slug)
        : [...selectedDomains, slug],
      multiCampus,
    });

  const toggleMultiCampus = () =>
    apply({ city, domains: selectedDomains, multiCampus: !multiCampus });

  const reset = () => apply({ city: '', domains: [], multiCampus: false });

  return (
    <div className="rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Legendă și filtre</p>
        <div className="flex items-center gap-3">
          {isPending && (
            <Spinner size="sm" className="text-primary" label="Se filtrează…" />
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
            >
              Resetează filtrele
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[15rem_1fr]">
        <Select
          label="Oraș"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        >
          <option value="">Toate orașele</option>
          {cities.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-text">
            Domenii de studiu
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {domains.map(({ slug, name }) => {
              const active = selectedDomains.includes(slug);
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleDomain(slug)}
                  className={`inline-flex select-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    active
                      ? 'border-primary/40 bg-primary/10 text-primary-strong dark:border-primary-soft/40 dark:bg-primary-soft/10 dark:text-primary-soft'
                      : 'border-border bg-surface text-text-muted hover:border-primary-soft/60 hover:text-text'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rotate-45 transition-colors ${
                      active ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                  {name}
                </button>
              );
            })}
            {domains.length === 0 && (
              <p className="text-sm text-text-muted">
                Domeniile apar aici imediat ce catalogul e populat.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-dashed border-border pt-5">
        <button
          type="button"
          role="switch"
          aria-checked={multiCampus}
          onClick={toggleMultiCampus}
          className="group inline-flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className={`relative h-6 w-11 flex-none rounded-full border transition-colors duration-200 ${
              multiCampus
                ? 'border-primary bg-primary'
                : 'border-border bg-surface group-hover:border-primary-soft/60'
            }`}
          >
            <span
              className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-200 ${
                multiCampus ? 'left-[1.5rem]' : 'left-1'
              }`}
            />
          </span>
          <span className="text-sm font-medium text-text">
            Doar facultăți cu mai multe campusuri
          </span>
        </button>
      </div>
    </div>
  );
}
