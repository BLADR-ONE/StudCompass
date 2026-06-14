'use client';

import { useState } from 'react';
import Badge from '../ui/Badge.js';
import StarRating from '../ui/StarRating.js';
import {
  ActionPill,
  AuthorMark,
  DeskEmpty,
  ErrorBanner,
  deskDate,
} from './DeskBits.js';

const COPY = {
  review: {
    hiddenBadge: 'Ascunsă',
    hide: 'Ascunde',
    unhide: 'Repune pe hartă',
    emptyTitle: 'Nicio recenzie pe masă.',
    emptyBody:
      'Când călătorii vor lăsa recenzii în atlas, le vei putea citi și modera de aici.',
  },
  message: {
    hiddenBadge: 'Ascuns',
    hide: 'Ascunde',
    unhide: 'Repune pe hartă',
    emptyTitle: 'Niciun mesaj pe masă.',
    emptyBody:
      'Conversațiile de pe paginile facultăților vor apărea aici, gata de moderat.',
  },
};

/* One moderation drawer — reviews or public messages. Hide/unhide is
   optimistic: the row is struck off the map instantly and restored if
   the server says no. */
export default function ModerationList({ kind, items: initialItems }) {
  const copy = COPY[kind] || COPY.message;
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState('');
  const [error, setError] = useState('');

  const hiddenCount = items.filter((item) => item.hiddenAt).length;

  const toggle = async (item) => {
    const hide = !item.hiddenAt;
    const action =
      kind === 'review'
        ? hide
          ? 'hide_review'
          : 'unhide_review'
        : hide
          ? 'hide_message'
          : 'unhide_message';

    const previous = items;
    setError('');
    setPendingId(item.id);
    setItems((rows) =>
      rows.map((row) =>
        row.id === item.id
          ? { ...row, hiddenAt: hide ? new Date().toISOString() : null }
          : row,
      ),
    );

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: item.id }),
      });
      if (!res.ok) {
        throw new Error('moderate_failed');
      }
    } catch {
      setItems(previous);
      setError('Nu am putut salva modificarea. Mai încearcă o dată.');
    } finally {
      setPendingId('');
    }
  };

  if (items.length === 0) {
    return <DeskEmpty title={copy.emptyTitle}>{copy.emptyBody}</DeskEmpty>;
  }

  return (
    <div>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
        Pe masă: <span className="tabular-nums">{items.length}</span>
        <span aria-hidden="true"> · </span>
        Ascunse: <span className="tabular-nums">{hiddenCount}</span>
      </p>

      <ul className="divide-y divide-dashed divide-border overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
        {items.map((item) => {
          const hidden = Boolean(item.hiddenAt);
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:gap-4"
            >
              <AuthorMark name={item.authorName} dimmed={hidden} />

              <div className={`min-w-0 flex-1 ${hidden ? 'opacity-55' : ''}`}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-text">
                    {item.authorName || 'Călător fără nume'}
                  </span>
                  {item.authorEmail && (
                    <span className="truncate text-xs text-text-muted">
                      {item.authorEmail}
                    </span>
                  )}
                </div>

                {kind === 'review' && (
                  <StarRating size="sm" value={item.rating} className="mt-1.5" />
                )}

                {item.body && (
                  <p
                    className={`mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-text-muted ${
                      hidden ? 'line-through decoration-rust/50' : ''
                    }`}
                  >
                    {item.body}
                  </p>
                )}

                <p className="mt-2 text-xs text-text-muted">
                  <span className="font-semibold text-primary-strong dark:text-primary-soft">
                    {item.facultyName}
                  </span>
                  <span> · {deskDate(item.createdAt)}</span>
                </p>
              </div>

              <div className="flex flex-none items-center gap-2.5 sm:flex-col sm:items-end sm:justify-between">
                {hidden ? (
                  <>
                    <Badge tone="destructive">{copy.hiddenBadge}</Badge>
                    <ActionPill
                      tone="primary"
                      busy={pendingId === item.id}
                      onClick={() => toggle(item)}
                    >
                      {copy.unhide}
                    </ActionPill>
                  </>
                ) : (
                  <ActionPill
                    tone="rust"
                    busy={pendingId === item.id}
                    onClick={() => toggle(item)}
                  >
                    {copy.hide}
                  </ActionPill>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
