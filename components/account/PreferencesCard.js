'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button.js';
import Card from '../ui/Card.js';
import Select from '../ui/Select.js';

/* Preferred directions: city + study domains → PUT /api/preferences.
   The chips mirror the catalog FilterBar, so the legend reads the same. */
export default function PreferencesCard({
  cities = [],
  domains = [],
  initialCity = '',
  initialDomains = [],
}) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [selected, setSelected] = useState(initialDomains);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const toggleDomain = (slug) => {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug],
    );
    setStatus(null);
  };

  const save = async () => {
    setStatus(null);
    setSaving(true);
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domains: selected,
          ...(city ? { city } : {}),
        }),
      });

      if (res.ok) {
        setStatus({ tone: 'ok', text: 'Preferințele au fost salvate.' });
        router.refresh();
      } else if (res.status === 401) {
        setStatus({
          tone: 'error',
          text: 'Sesiunea a expirat — intră din nou în cont.',
        });
      } else if (res.status === 503) {
        setStatus({
          tone: 'error',
          text: 'Salvarea nu e disponibilă momentan. Mai încearcă în câteva minute.',
        });
      } else {
        setStatus({
          tone: 'error',
          text: 'Nu am putut salva preferințele. Mai încearcă o dată.',
        });
      }
    } catch {
      setStatus({
        tone: 'error',
        text: 'Nu am putut salva preferințele. Verifică-ți conexiunea.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="sm:p-7">
      <h2 className="font-display text-2xl font-semibold">Direcții preferate</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
        Orașul și domeniile spre care arată busola ta — ca să-ți scurtăm drumul
        prin catalog.
      </p>

      <div className="mt-5 space-y-5">
        <Select
          label="Oraș preferat"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setStatus(null);
          }}
        >
          <option value="">Fără preferință</option>
          {cities.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <div>
          <p className="mb-2 text-sm font-semibold text-text">
            Domenii de studiu
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {domains.map(({ slug, name }, index) => {
              const active = selected.includes(slug);
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleDomain(slug)}
                  style={{ '--i': index }}
                  className={`reveal-stagger inline-flex select-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[transform,border-color,box-shadow,background-color,color] duration-300 ease-out-quint active:scale-[0.97] ${
                    active
                      ? 'border-primary/40 bg-primary/10 text-primary-strong shadow-[0_0_0_1px_rgb(56_136_112/0.15)] dark:border-primary-soft/40 dark:bg-primary-soft/10 dark:text-primary-soft'
                      : 'border-border bg-surface text-text-muted hover:-translate-y-0.5 hover:border-primary-soft/60 hover:text-text hover:shadow-[0_2px_8px_-2px_rgb(56_136_112/0.18)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rotate-45 transition-colors duration-200 ${
                      active ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-5">
        <p
          aria-live="polite"
          className={`text-xs font-medium ${
            status?.tone === 'error'
              ? 'text-rust dark:text-rust-soft'
              : 'text-primary-strong dark:text-primary-soft'
          }`}
        >
          {status?.text || ''}
        </p>
        <Button type="button" onClick={save} loading={saving}>
          Salvează preferințele
        </Button>
      </div>
    </Card>
  );
}
