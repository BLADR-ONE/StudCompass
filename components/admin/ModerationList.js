'use client';

import { useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Modal from '../ui/Modal.js';
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

function getSearchableText(item) {
  return [item.authorName, item.authorEmail, item.body, item.facultyName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/* One moderation drawer — reviews or public messages. Hide/unhide is
   optimistic: the row is struck off the map instantly and restored if
   the server says no. */
export default function ModerationList({ kind, items: initialItems }) {
  const copy = COPY[kind] || COPY.message;
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [pendingId, setPendingId] = useState('');
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const hiddenCount = items.filter((item) => item.hiddenAt).length;
  const faculties = [...new Set(items.map((item) => item.facultyName).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'ro'));
  const authors = [
    ...new Set(
      items.map((item) => item.authorName || item.authorEmail || 'Călător fără nume'),
    ),
  ].sort((a, b) => a.localeCompare(b, 'ro'));

  const search = query.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    if (search) {
      if (!getSearchableText(item).includes(search)) {
        return false;
      }
    }

    if (facultyFilter !== 'all' && item.facultyName !== facultyFilter) {
      return false;
    }

    const authorName = item.authorName || item.authorEmail || 'Călător fără nume';
    if (authorFilter !== 'all' && authorName !== authorFilter) {
      return false;
    }

    if (visibilityFilter === 'visible' && item.hiddenAt) {
      return false;
    }

    if (visibilityFilter === 'hidden' && !item.hiddenAt) {
      return false;
    }

    return true;
  });

  const filtersActive =
    query.trim() ||
    facultyFilter !== 'all' ||
    authorFilter !== 'all' ||
    visibilityFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setFacultyFilter('all');
    setAuthorFilter('all');
    setVisibilityFilter('all');
  };

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

  const requestDelete = (item) => {
    setDeleteError('');
    setDeleteTarget(item);
  };

  const closeDelete = () => {
    if (deleteBusy) {
      return;
    }
    setDeleteTarget(null);
    setDeleteError('');
  };

  const deleteItem = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteBusy(true);
    setDeleteError('');

    try {
      const action = kind === 'review' ? 'delete_review' : 'delete_message';
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: deleteTarget.id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'delete_failed');
      }

      setItems((rows) => rows.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setDeleteError('Nu am putut șterge elementul. Mai încearcă o dată.');
    } finally {
      setDeleteBusy(false);
    }
  };

  if (items.length === 0) {
    return <DeskEmpty title={copy.emptyTitle}>{copy.emptyBody}</DeskEmpty>;
  }

  return (
    <div>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="mb-4 grid gap-4 rounded-[1.75rem] border border-border bg-surface p-4 shadow-card sm:p-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Input
          label="Caută în moderare"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Text, autor, email sau facultate"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Facultate
            </label>
            <select
              value={facultyFilter}
              onChange={(event) => setFacultyFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate facultățile</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Autor
            </label>
            <select
              value={authorFilter}
              onChange={(event) => setAuthorFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toți autorii</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Vizibilitate
            </label>
            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate</option>
              <option value="visible">Vizibile</option>
              <option value="hidden">Ascunse</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Pe masă: <span className="tabular-nums">{items.length}</span>
            <span aria-hidden="true"> · </span>
            Ascunse: <span className="tabular-nums">{hiddenCount}</span>
            <span aria-hidden="true"> · </span>
            Afișate: <span className="tabular-nums">{filteredItems.length}</span>
          </p>
          {filtersActive && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Resetează filtrele
            </Button>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <DeskEmpty
          title={
            filtersActive
              ? 'Niciun element nu se potrivește filtrului.'
              : copy.emptyTitle
          }
          action={
            filtersActive ? (
              <Button variant="ghost" onClick={clearFilters}>
                Curăță filtrele
              </Button>
            ) : null
          }
        >
          {filtersActive ? (
            'Ajustează căutarea, autorul, facultatea sau vizibilitatea pentru a vedea alte elemente.'
          ) : (
            copy.emptyBody
          )}
        </DeskEmpty>
      ) : (
        <ul className="grid gap-3">
          {filteredItems.map((item) => {
            const hidden = Boolean(item.hiddenAt);
            const authorName = item.authorName || item.authorEmail || 'Călător fără nume';
            return (
              <li
                key={item.id}
                className="rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <AuthorMark name={authorName} dimmed={hidden} />

                    <div className={`min-w-0 flex-1 ${hidden ? 'opacity-55' : ''}`}>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-text">
                          {authorName}
                        </span>
                        {item.authorEmail && (
                          <span className="truncate text-xs text-text-muted">
                            {item.authorEmail}
                          </span>
                        )}
                        <Badge tone={hidden ? 'destructive' : 'primary'}>
                          {hidden ? copy.hiddenBadge : 'Vizibilă'}
                        </Badge>
                      </div>

                      {kind === 'review' && (
                        <StarRating
                          size="sm"
                          value={item.rating}
                          className="mt-1.5"
                        />
                      )}

                      {item.body && (
                        <p
                          className={`mt-2 line-clamp-3 text-pretty text-sm leading-relaxed text-text-muted ${
                            hidden ? 'line-through decoration-rust/50' : ''
                          }`}
                        >
                          {item.body}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge tone="highlight">{item.facultyName}</Badge>
                        <span className="text-xs text-text-muted">
                          {deskDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-none flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
                    {hidden ? (
                      <ActionPill
                        tone="primary"
                        busy={pendingId === item.id}
                        onClick={() => toggle(item)}
                      >
                        {copy.unhide}
                      </ActionPill>
                    ) : (
                      <ActionPill
                        tone="rust"
                        busy={pendingId === item.id}
                        onClick={() => toggle(item)}
                      >
                        {copy.hide}
                      </ActionPill>
                    )}
                    <ActionPill
                      tone="rust"
                      busy={deleteTarget?.id === item.id && deleteBusy}
                      onClick={() => requestDelete(item)}
                    >
                      Șterge
                    </ActionPill>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={closeDelete}
        title={kind === 'review' ? 'Ștergi recenzia?' : 'Ștergi mesajul?'}
        footer={
          <>
            <Button variant="ghost" onClick={closeDelete} disabled={deleteBusy}>
              Renunță
            </Button>
            <Button variant="destructive" loading={deleteBusy} onClick={deleteItem}>
              Da, șterge
            </Button>
          </>
        }
      >
        <p className="text-pretty text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-text">
            {deleteTarget?.authorName || 'Acest element'}
          </strong>{' '}
          va fi șters definitiv. Nu există altă cascadă în afară de rândul
          selectat.
        </p>
        {deleteError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm font-medium text-rust dark:text-[#e09478]"
          >
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  );
}
