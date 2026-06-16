'use client';

import Image from 'next/image';
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

const DEFAULT_HEADER_IMAGE = 'homeold.jpg';

function HeaderImagePicker() {
  const [current, setCurrent] = useState(DEFAULT_HEADER_IMAGE);
  const [selected, setSelected] = useState(DEFAULT_HEADER_IMAGE);
  const [status, setStatus] = useState('loading'); // loading | ready | unavailable
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

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
      setCurrent(image);
      setSelected(image);
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
      setCurrent(image);
      setSelected(image);
      setSaved(true);
    } catch {
      setError('Nu am putut salva imaginea. Mai încearcă o dată.');
    } finally {
      setSaving(false);
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
    <div>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {HEADER_CHOICES.map(({ file, label }) => {
          const isSelected = selected === file;
          const isCurrent = current === file;
          return (
            <button
              key={file}
              type="button"
              aria-pressed={isSelected}
              onClick={() => { setSelected(file); setSaved(false); }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 text-left shadow-card transition-all duration-200 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary-soft'
              }`}
            >
              <Image
                src={`/assets/${file}`}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1.5 p-2.5">
                <span className="text-xs font-semibold text-white drop-shadow">
                  {label}
                </span>
                {isCurrent && <Badge tone="highlight">Activă</Badge>}
              </span>
              {isSelected && (
                <span className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-white shadow">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
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
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="sm" loading={saving} disabled={!dirty} onClick={save}>
          Salvează imaginea
        </Button>
        {saved && !dirty && (
          <span className="text-sm font-medium text-primary-strong dark:text-primary-soft">
            Imaginea de antet a fost salvată.
          </span>
        )}
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
