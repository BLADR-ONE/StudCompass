'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Modal from '../ui/Modal.js';
import Spinner from '../ui/Spinner.js';
import {
  ActionPill,
  AuthorMark,
  DeskEmpty,
  ErrorBanner,
} from './DeskBits.js';
import { DEFAULT_HEADER_IMAGE } from '../../lib/content.js';

/* The shop sign over each settings room. Roomy on purpose — future
   settings get their own <SettingsSection> without disturbing these two. */
function SettingsSection({ title, description, children }) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-7">
      <div className="max-w-2xl">
        <h2 className="font-display text-xl font-semibold text-text sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Room 1 — Testimoniale                                                      */
/* -------------------------------------------------------------------------- */

const EMPTY_FORM = { authorName: '', authorRole: '', body: '' };

function TestimonialForm({ initial = EMPTY_FORM, busy, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const bodyId = useId();

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      authorName: form.authorName.trim(),
      authorRole: form.authorRole.trim(),
      body: form.body.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nume autor"
          value={form.authorName}
          onChange={update('authorName')}
          placeholder="ex. Andrei Popescu"
          maxLength={120}
          required
        />
        <Input
          label="Rol / descriere"
          value={form.authorRole}
          onChange={update('authorRole')}
          placeholder="ex. student în anul II"
          maxLength={120}
          required
        />
      </div>
      <div>
        <label
          htmlFor={bodyId}
          className="mb-1.5 block text-sm font-semibold text-text"
        >
          Testimonial
        </label>
        <textarea
          id={bodyId}
          value={form.body}
          onChange={update('body')}
          placeholder="Ce a spus despre StudCompass…"
          rows={4}
          minLength={10}
          maxLength={1200}
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-[0.95rem] leading-relaxed text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1.5 text-xs text-text-muted">
          Între 10 și 1200 de caractere.
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            Renunță
          </Button>
        )}
        <Button type="submit" size="sm" loading={busy}>
          Salvează
        </Button>
      </div>
    </form>
  );
}

function TestimonialRow({
  item,
  index,
  total,
  busy,
  onTogglePublished,
  onEdit,
  onDelete,
  onMove,
}) {
  const published = Boolean(item.published);

  return (
    <li className="flex flex-col gap-3 p-5 sm:flex-row sm:gap-4">
      {/* Reorder controls */}
      <div className="flex flex-none flex-row gap-1 sm:flex-col">
        <button
          type="button"
          aria-label="Mută mai sus"
          disabled={busy || index === 0}
          onClick={() => onMove(index, -1)}
          className="inline-flex size-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary-soft hover:text-primary-strong disabled:pointer-events-none disabled:opacity-30 dark:hover:text-primary-soft"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
            <path
              d="M4 10l4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Mută mai jos"
          disabled={busy || index === total - 1}
          onClick={() => onMove(index, 1)}
          className="inline-flex size-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-primary-soft hover:text-primary-strong disabled:pointer-events-none disabled:opacity-30 dark:hover:text-primary-soft"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AuthorMark name={item.authorName} dimmed={!published} />

      <div className={`min-w-0 flex-1 ${published ? '' : 'opacity-55'}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-text">
            {item.authorName}
          </span>
          <span className="text-xs text-text-muted">· {item.authorRole}</span>
          {published ? (
            <Badge tone="primary">Publicat</Badge>
          ) : (
            <Badge tone="neutral">Ascuns</Badge>
          )}
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-text-muted">
          „{item.body}"
        </p>
      </div>

      <div className="flex flex-none flex-wrap items-center gap-2.5 sm:flex-col sm:items-end">
        <ActionPill
          tone="primary"
          busy={busy}
          onClick={() => onTogglePublished(item)}
        >
          {published ? 'Ascunde' : 'Publică'}
        </ActionPill>
        <ActionPill tone="primary" busy={busy} onClick={() => onEdit(item)}>
          Modifică
        </ActionPill>
        <ActionPill tone="rust" busy={busy} onClick={() => onDelete(item)}>
          Șterge
        </ActionPill>
      </div>
    </li>
  );
}

function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | unavailable
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState('');

  const [adding, setAdding] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState('');

  const [editing, setEditing] = useState(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) {
        setStatus('unavailable');
        return;
      }
      const data = await res.json();
      setItems(data.testimonials || []);
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    setAddError('');
    setAddBusy(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, sortOrder: items.length }),
      });
      if (!res.ok) {
        throw new Error('create_failed');
      }
      const data = await res.json();
      setItems((prev) => [...prev, data.testimonial]);
      setAdding(false);
    } catch {
      setAddError('Nu am putut adăuga testimonialul. Verifică datele și mai încearcă.');
    } finally {
      setAddBusy(false);
    }
  };

  const saveEdit = async (values) => {
    if (!editing) {
      return;
    }
    setEditError('');
    setEditBusy(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...values }),
      });
      if (!res.ok) {
        throw new Error('update_failed');
      }
      const data = await res.json();
      setItems((prev) =>
        prev.map((row) => (row.id === editing.id ? data.testimonial : row)),
      );
      setEditing(null);
    } catch {
      setEditError('Nu am putut salva modificările. Verifică datele și mai încearcă.');
    } finally {
      setEditBusy(false);
    }
  };

  const togglePublished = async (item) => {
    setError('');
    setPendingId(item.id);
    const next = !item.published;
    setItems((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, published: next } : row,
      ),
    );
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, published: next }),
      });
      if (!res.ok) {
        throw new Error('toggle_failed');
      }
    } catch {
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, published: item.published } : row,
        ),
      );
      setError('Nu am putut schimba starea. Mai încearcă o dată.');
    } finally {
      setPendingId('');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleteError('');
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('delete_failed');
      }
      setItems((prev) => prev.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setDeleteError('Nu am putut șterge testimonialul. Mai încearcă o dată.');
    } finally {
      setDeleteBusy(false);
    }
  };

  /* Reorder by swapping neighbours, then persist the new order in bulk. */
  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) {
      return;
    }

    const previous = items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setError('');
    setPendingId('reorder');

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: next.map((row, i) => ({ id: row.id, sortOrder: i })),
        }),
      });
      if (!res.ok) {
        throw new Error('reorder_failed');
      }
    } catch {
      setItems(previous);
      setError('Nu am putut salva ordinea. Mai încearcă o dată.');
    } finally {
      setPendingId('');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-surface-raised text-text-muted shadow-card">
        <Spinner />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <DeskEmpty
        title="Testimonialele nu pot fi aduse."
        action={
          <ActionPill tone="primary" onClick={load}>
            Mai încearcă o dată
          </ActionPill>
        }
      >
        Atlasul nu răspunde momentan, așa că lista de testimoniale nu poate fi
        încărcată. Mai încearcă puțin mai târziu.
      </DeskEmpty>
    );
  }

  return (
    <div>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
          În atlas: <span className="tabular-nums">{items.length}</span>
          <span aria-hidden="true"> · </span>
          Publicate:{' '}
          <span className="tabular-nums">
            {items.filter((row) => row.published).length}
          </span>
        </p>
        {!adding && (
          <Button size="sm" onClick={() => { setAddError(''); setAdding(true); }}>
            Adaugă testimonial
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-6 rounded-3xl border border-dashed border-primary-soft/50 bg-surface-raised p-5 shadow-card sm:p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-text">
            Testimonial nou
          </h3>
          <TestimonialForm
            busy={addBusy}
            error={addError}
            onSubmit={create}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {items.length === 0 ? (
        <DeskEmpty title="Niciun testimonial încă.">
          Adaugă prima voce a comunității — va apărea pe pagina principală, în
          secțiunea „Vocea comunității”, odată ce o publici.
        </DeskEmpty>
      ) : (
        <ul className="divide-y divide-dashed divide-border overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
          {items.map((item, index) => (
            <TestimonialRow
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              busy={pendingId === item.id || pendingId === 'reorder'}
              onTogglePublished={togglePublished}
              onEdit={(row) => { setEditError(''); setEditing(row); }}
              onDelete={(row) => { setDeleteError(''); setDeleteTarget(row); }}
              onMove={move}
            />
          ))}
        </ul>
      )}

      {/* Edit modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => { if (!editBusy) setEditing(null); }}
        title="Modifică testimonialul"
      >
        {editing && (
          <TestimonialForm
            initial={{
              authorName: editing.authorName,
              authorRole: editing.authorRole,
              body: editing.body,
            }}
            busy={editBusy}
            error={editError}
            onSubmit={saveEdit}
            onCancel={() => { if (!editBusy) setEditing(null); }}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => { if (!deleteBusy) setDeleteTarget(null); }}
        title="Ștergi acest testimonial?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteBusy}
            >
              Renunță
            </Button>
            <Button
              variant="destructive"
              loading={deleteBusy}
              onClick={confirmDelete}
            >
              Da, șterge
            </Button>
          </>
        }
      >
        <p className="text-pretty text-sm leading-relaxed text-text-muted">
          Testimonialul lui{' '}
          <strong className="font-semibold text-text">
            {deleteTarget?.authorName}
          </strong>{' '}
          va fi șters definitiv din atlas. Această acțiune nu poate fi anulată.
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

/* -------------------------------------------------------------------------- */
/*  Room 2 — Imagine antet                                                     */
/* -------------------------------------------------------------------------- */

const HEADER_CHOICES = [
  { file: 'homeold.jpg', label: 'Clasică' },
  { file: 'journey.jpg', label: 'Drumul' },
  { file: 'home.jpg', label: 'Acasă' },
  { file: 'maincover.jpg', label: 'Panoramă' },
];

const HEADER_IMAGE_HISTORY_LIMIT = 4;

function isDataImage(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function headerImageSrc(value) {
  if (!value) {
    return `/assets/${DEFAULT_HEADER_IMAGE}`;
  }

  return isDataImage(value) ? value : `/assets/${value}`;
}

function headerImageLabel(value) {
  const preset = HEADER_CHOICES.find((choice) => choice.file === value);
  return preset ? preset.label : 'Imagine încărcată';
}

function normalizeRecentImages(current, recent = []) {
  return [...new Set([current, ...recent].filter(Boolean))].slice(
    0,
    HEADER_IMAGE_HISTORY_LIMIT,
  );
}

function readFileAsDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('upload_failed'));
      }
    };
    reader.onerror = () => reject(new Error('upload_failed'));
    reader.readAsDataURL(file);
  });
}

function HeaderImageCard({
  value,
  label,
  selected,
  current,
  onSelect,
  className = '',
}) {
  const active = selected === value;
  const live = current === value;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border-2 text-left shadow-card transition-all duration-200 ${
        active
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-border hover:border-primary-soft'
      } ${className}`}
    >
      <span className="absolute inset-0">
        <img
          src={headerImageSrc(value)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/12 to-transparent"
      />
      <span className="relative flex min-h-28 flex-col justify-between gap-3 p-3.5">
        <span className="flex items-start justify-between gap-2">
          {live ? <Badge tone="highlight">Activă</Badge> : <span />}
          {active && (
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-white shadow">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="size-3.5"
              >
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white drop-shadow">
            {label}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-white/80">
            {isDataImage(value) ? 'Încărcată de admin' : `/assets/${value}`}
          </span>
        </span>
      </span>
    </button>
  );
}

function HeaderImagePicker() {
  const [current, setCurrent] = useState(DEFAULT_HEADER_IMAGE);
  const [selected, setSelected] = useState(DEFAULT_HEADER_IMAGE);
  const [recent, setRecent] = useState([DEFAULT_HEADER_IMAGE]);
  const [status, setStatus] = useState('loading'); // loading | ready | unavailable
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const fileInputId = useId();

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) {
        setStatus('unavailable');
        return;
      }
      const data = await res.json();
      const image = data.settings?.headerImage || DEFAULT_HEADER_IMAGE;
      const history = Array.isArray(data.settings?.recentHeaderImages)
        ? data.settings.recentHeaderImages
        : [];
      setCurrent(image);
      setSelected(image);
      setRecent(normalizeRecentImages(image, history));
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headerImage: selected }),
      });
      if (!res.ok) {
        throw new Error('save_failed');
      }
      const data = await res.json();
      const image = data.settings?.headerImage || selected;
      const history = Array.isArray(data.settings?.recentHeaderImages)
        ? data.settings.recentHeaderImages
        : [];
      setCurrent(image);
      setSelected(image);
      setRecent(normalizeRecentImages(image, history));
      setSaved(true);
    } catch {
      setError('Nu am putut salva imaginea. Mai încearcă o dată.');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = (value) => {
    setSelected(value);
    setSaved(false);
    setError('');
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Alege un fișier imagine valid.');
      return;
    }

    if (file.size > 2_000_000) {
      setError('Imaginea e prea mare. Încarcă un fișier sub 2 MB.');
      return;
    }

    setUploadBusy(true);
    setError('');

    try {
      const dataUri = await readFileAsDataUri(file);
      pickImage(dataUri);
    } catch {
      setError('Nu am putut citi imaginea. Mai încearcă o dată.');
    } finally {
      setUploadBusy(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-surface-raised text-text-muted shadow-card">
        <Spinner />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <DeskEmpty
        title="Setarea nu poate fi adusă."
        action={
          <ActionPill tone="primary" onClick={load}>
            Mai încearcă o dată
          </ActionPill>
        }
      >
        Atlasul nu răspunde momentan, așa că imaginea de antet nu poate fi
        încărcată. Mai încearcă puțin mai târziu.
      </DeskEmpty>
    );
  }

  const dirty = selected !== current;

  return (
    <div className="space-y-5">
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h3 className="font-display text-xl font-semibold text-text">
                Imaginea selectată
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Alege un preset, o variantă recentă sau încarcă o imagine nouă.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={dirty ? 'accent' : 'primary'}>
                {dirty ? 'Nesalvată' : 'Salvată'}
              </Badge>
              {isDataImage(selected) ? (
                <Badge tone="highlight">Încărcată</Badge>
              ) : (
                <Badge tone="neutral">Preset</Badge>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
            <div className="relative aspect-[16/9]">
              <img
                src={headerImageSrc(selected)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-text">
                  {headerImageLabel(selected)}
                </p>
                <p className="text-xs text-text-muted">
                  {isDataImage(selected)
                    ? 'Se salvează ca data URI în site_settings.'
                    : `Fișierul ${selected}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label
                  htmlFor={fileInputId}
                  className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-border px-4 text-sm font-semibold text-text transition-colors hover:border-primary-soft hover:text-primary-strong ${uploadBusy ? 'pointer-events-none opacity-60' : ''}`}
                >
                  {uploadBusy ? 'Se încarcă...' : 'Încarcă imagine'}
                </label>
                <input
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="sr-only"
                />
                <Button size="sm" loading={saving} disabled={!dirty} onClick={save}>
                  Salvează imaginea
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {saved && !dirty && (
              <span className="text-sm font-medium text-primary-strong dark:text-primary-soft">
                Imaginea de antet a fost salvată.
              </span>
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-text">
                Variante recente
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Ultimele alegeri rămân aici, ca să poți reveni rapid la ele.
              </p>
            </div>
            <Badge tone="neutral">{recent.length}</Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {recent.map((file) => (
              <HeaderImageCard
                key={file}
                value={file}
                label={headerImageLabel(file)}
                selected={selected}
                current={current}
                onSelect={() => pickImage(file)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-text">
              Preseturi
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Imaginile pregătite în atlas. Poți reveni oricând la una dintre ele.
            </p>
          </div>
          <Badge tone="neutral">{HEADER_CHOICES.length}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HEADER_CHOICES.map(({ file, label }) => (
            <HeaderImageCard
              key={file}
              value={file}
              label={label}
              selected={selected}
              current={current}
              onSelect={() => pickImage(file)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The settings desk                                                          */
/* -------------------------------------------------------------------------- */

export default function SiteSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection
        title="Testimoniale"
        description="Vocile comunității care apar pe pagina principală. Adaugă, modifică, reordonează și alege ce e publicat — doar testimonialele publicate ajung pe site."
      >
        <TestimonialsManager />
      </SettingsSection>

      <SettingsSection
        title="Imagine antet"
        description="Fundalul secțiunii principale de pe pagina de start. Alege una dintre imaginile pregătite, apoi salvează."
      >
        <HeaderImagePicker />
      </SettingsSection>
    </div>
  );
}
