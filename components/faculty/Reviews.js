'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Button from '../ui/Button.js';
import Spinner from '../ui/Spinner.js';
import StarRating from '../ui/StarRating.js';
import { Constellation } from '../layout/Brand.js';

const dateFormatter = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

function formatAvg(value) {
  return (Math.round(value * 10) / 10).toFixed(1).replace('.', ',');
}

function ReviewItem({ review }) {
  return (
    <li className="rounded-3xl border border-border bg-surface-raised p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="wonky flex size-10 flex-none items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
        >
          {(review.authorName || '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">
            {review.authorName}
          </p>
          <p className="text-xs text-text-muted">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <StarRating size="sm" value={review.rating} className="ml-auto" />
      </div>
      {review.body && (
        <p className="mt-3.5 text-pretty text-sm leading-relaxed text-text-muted">
          {review.body}
        </p>
      )}
    </li>
  );
}

/* Reviews island: GET/POST /api/reviews?faculty=<slug>.
   One review per student — posting again updates the existing one. */
export default function Reviews({ facultySlug }) {
  const { status: sessionStatus } = useSession();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/reviews?faculty=${encodeURIComponent(facultySlug)}`,
      );
      if (!res.ok) {
        setStatus('unavailable');
        return;
      }
      setData(await res.json());
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, [facultySlug]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);

    if (rating < 1) {
      setFormError('Alege mai întâi o notă — de la o stea la cinci.');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faculty: facultySlug,
          rating,
          body: body.trim(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        await load();
      } else if (res.status === 401) {
        setFormError('Sesiunea a expirat — intră din nou în cont.');
      } else if (res.status === 403) {
        setFormError('Contul tău nu poate publica recenzii momentan.');
      } else {
        setFormError('Nu am putut trimite recenzia. Mai încearcă o dată.');
      }
    } catch {
      setFormError('Nu am putut trimite recenzia. Verifică-ți conexiunea.');
    } finally {
      setSubmitting(false);
    }
  };

  const count = data?.count ?? 0;
  const avg = data?.avg ?? 0;

  return (
    <div>
      {/* Logbook header card: average + your-review form / sign-in gate */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
        {status === 'ready' && count > 0 && (
          <div className="flex items-center gap-5 border-b border-dashed border-border p-6">
            <span
              aria-hidden="true"
              className="wonky font-display text-5xl font-semibold italic text-primary-strong dark:text-primary-soft"
            >
              {formatAvg(avg)}
            </span>
            <div>
              <StarRating value={avg} />
              <p className="mt-1 text-xs text-text-muted">
                din {count} {count === 1 ? 'recenzie' : 'recenzii'}
              </p>
            </div>
          </div>
        )}

        {sessionStatus === 'authenticated' ? (
          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="font-display text-lg font-semibold">Recenzia ta</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              Ai o singură recenzie pentru fiecare facultate — dacă trimiți
              alta, o actualizezi pe cea existentă.
            </p>

            <StarRating
              value={rating}
              onChange={(value) => {
                setRating(value);
                setFormError('');
              }}
              size="lg"
              className="mt-4"
            />

            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Cum a fost experiența ta aici? Ce-ar trebui să știe cineva care vine după tine?"
              rows={4}
              maxLength={4000}
              className="mt-4 w-full resize-y rounded-xl border border-border bg-surface p-4 text-[0.95rem] text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p
                aria-live="polite"
                className={`text-xs font-medium ${
                  formError
                    ? 'text-rust dark:text-rust-soft'
                    : 'text-primary-strong dark:text-primary-soft'
                }`}
              >
                {formError ||
                  (success ? 'Recenzia ta e pe hartă. Mulțumim!' : '')}
              </p>
              <Button type="submit" loading={submitting}>
                Publică recenzia
              </Button>
            </div>
          </form>
        ) : sessionStatus === 'loading' ? (
          <div className="flex items-center justify-center p-10 text-text-muted">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="relative overflow-hidden p-6 text-center sm:p-8">
            <Constellation className="animate-twinkle pointer-events-none absolute -right-16 -top-20 size-56 text-primary/[0.09] dark:text-primary-soft/[0.1]" />
            <div className="relative">
              <h3 className="font-display text-lg font-semibold">
                Spune-ți părerea
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-text-muted">
                Intră în cont ca să lași o recenzie — durează un minut și
                ajută pe cineva aflat exact unde erai tu.
              </p>
              <Button href="/account/auth" className="mt-5">
                Intră în cont
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* The journal itself */}
      <div className="mt-6">
        {status === 'loading' && (
          <div className="flex justify-center py-10 text-text-muted">
            <Spinner />
          </div>
        )}

        {status === 'unavailable' && (
          <div className="rounded-3xl border-2 border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm leading-relaxed text-text-muted">
              Recenziile nu pot fi încărcate momentan. Mai încearcă puțin mai
              târziu.
            </p>
          </div>
        )}

        {status === 'ready' &&
          (count > 0 ? (
            <ul className="space-y-4">
              {data.reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </ul>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-primary-soft/40 px-6 py-10 text-center">
              <p className="font-display text-lg font-semibold">
                Jurnalul e încă alb.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
                Nimeni nu a scris încă despre locul ăsta. Fii primul care lasă
                un semn pe hartă.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
