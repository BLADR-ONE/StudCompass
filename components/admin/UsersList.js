'use client';

import { useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Modal from '../ui/Modal.js';
import {
  ActionPill,
  AuthorMark,
  DeskEmpty,
  ErrorBanner,
  deskDate,
} from './DeskBits.js';
import UserRowActions from './UserRowActions.js';

async function moderate(action, id) {
  const res = await fetch('/api/admin/moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, id }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || 'moderate_failed');
  }
}

/* The travelers' register. Banning is the one truly destructive act on
   the desk, so it asks twice — a rust-toned confirmation before the seal. */
export default function UsersList({ items: initialItems, currentUserId }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [banFilter, setBanFilter] = useState('all');
  const [pendingId, setPendingId] = useState('');
  const [error, setError] = useState('');
  const [roleBusyId, setRoleBusyId] = useState('');

  /* Ban confirmation modal state. */
  const [target, setTarget] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [modalError, setModalError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const bannedCount = items.filter((item) => item.bannedAt).length;
  const adminCount = items.filter((item) => item.role === 'admin').length;
  const filteredItems = items.filter((user) => {
    const search = query.trim().toLowerCase();
    if (search) {
      const haystack = [user.name, user.email].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }

    if (banFilter === 'banned' && !user.bannedAt) {
      return false;
    }

    if (banFilter === 'active' && user.bannedAt) {
      return false;
    }

    return true;
  });

  const filtersActive = query.trim() || roleFilter !== 'all' || banFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setRoleFilter('all');
    setBanFilter('all');
  };

  const setBanned = (id, bannedAt) => {
    setItems((rows) =>
      rows.map((row) => (row.id === id ? { ...row, bannedAt } : row)),
    );
  };

  const setRole = (id, role) => {
    setItems((rows) => rows.map((row) => (row.id === id ? { ...row, role } : row)));
  };

  const closeModal = () => {
    if (confirming) {
      return;
    }
    setTarget(null);
    setModalError('');
  };

  const closeDeleteModal = () => {
    if (deleteBusy) {
      return;
    }
    setDeleteTarget(null);
    setDeleteError('');
  };

  const confirmBan = async () => {
    if (!target) {
      return;
    }
    setModalError('');
    setConfirming(true);
    try {
      await moderate('ban_user', target.id);
      setBanned(target.id, new Date().toISOString());
      setTarget(null);
    } catch {
      setModalError('Nu am putut bloca acest cont. Mai încearcă o dată.');
    } finally {
      setConfirming(false);
    }
  };

  const toggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    setError('');
    setRoleBusyId(user.id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: nextRole }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'role_update_failed');
      }
      setRole(user.id, nextRole);
    } catch (err) {
      setError(
        err?.message === 'Trebuie să existe cel puțin un administrator'
          ? 'Trebuie să rămână cel puțin un administrator.'
          : 'Nu am putut modifica rolul. Mai încearcă o dată.',
      );
    } finally {
      setRoleBusyId('');
    }
  };

  const requestDelete = (user) => {
    setDeleteError('');
    setDeleteTarget(user);
  };

  const deleteUser = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteBusy(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'delete_failed');
      }

      setItems((rows) => rows.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err?.message === 'Trebuie să existe cel puțin un administrator'
          ? 'Trebuie să rămână cel puțin un administrator.'
          : 'Nu am putut șterge contul. Mai încearcă o dată.',
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  /* Unban undoes a restriction — optimistic, no ceremony needed. */
  const unban = async (user) => {
    setError('');
    setPendingId(user.id);
    setBanned(user.id, null);
    try {
      await moderate('unban_user', user.id);
    } catch {
      setBanned(user.id, user.bannedAt);
      setError('Nu am putut debloca acest cont. Mai încearcă o dată.');
    } finally {
      setPendingId('');
    }
  };

  if (items.length === 0) {
    return (
      <DeskEmpty title="Registrul e încă alb.">
        Conturile călătorilor vor apărea aici pe măsură ce se înscriu în
        atlas.
      </DeskEmpty>
    );
  }

  return (
    <div>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="mb-4 grid gap-4 rounded-[1.75rem] border border-border bg-surface p-4 shadow-card sm:p-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Input
          label="Caută utilizator"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nume sau email"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Rol
            </label>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate rolurile</option>
              <option value="user">Utilizator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Blocat
            </label>
            <select
              value={banFilter}
              onChange={(event) => setBanFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate conturile</option>
              <option value="active">Active</option>
              <option value="banned">Blocate</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            În registru: <span className="tabular-nums">{items.length}</span>
            <span aria-hidden="true"> · </span>
            Blocate: <span className="tabular-nums">{bannedCount}</span>
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
              ? 'Niciun utilizator nu se potrivește filtrului.'
              : 'Registrul e încă alb.'
          }
          action={
            filtersActive ? (
              <Button variant="ghost" onClick={clearFilters}>
                Curăță filtrele
              </Button>
            ) : null
          }
        >
          {filtersActive
            ? 'Ajustează căutarea, rolul sau starea de blocare ca să vezi alte conturi.'
            : 'Conturile călătorilor vor apărea aici pe măsură ce se înscriu în atlas.'}
        </DeskEmpty>
      ) : (
        <ul className="grid gap-3">
          {filteredItems.map((user) => {
            const banned = Boolean(user.bannedAt);
            const isSelf = user.id === currentUserId;
            const userName = user.name || user.email || 'Călător fără nume';
            return (
              <li
                key={user.id}
                className="rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <AuthorMark name={userName} dimmed={banned} />

                    <div className={`min-w-0 flex-1 ${banned ? 'opacity-55' : ''}`}>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-text">
                          {user.name || 'Călător fără nume'}
                        </span>
                        {user.role === 'admin' && (
                          <Badge tone="primary">Cartograf</Badge>
                        )}
                        {isSelf && <Badge tone="highlight">Tu</Badge>}
                        {banned && <Badge tone="destructive">Blocat</Badge>}
                      </div>
                      {user.email && (
                        <p className="mt-0.5 truncate text-xs text-text-muted">
                          {user.email}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-text-muted">
                        Călător din {deskDate(user.createdAt)}
                        {banned && (
                          <span> · blocat din {deskDate(user.bannedAt)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-none flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
                    {banned ? (
                      <ActionPill
                        tone="primary"
                        busy={pendingId === user.id}
                        onClick={() => unban(user)}
                        className="h-auto min-h-10 justify-start rounded-2xl px-4 py-2 text-left"
                      >
                        <span className="flex flex-col items-start leading-tight">
                          <span>Deblochează contul</span>
                          <span className="text-[11px] font-medium opacity-70">
                            Revine în registru
                          </span>
                        </span>
                      </ActionPill>
                    ) : isSelf ? (
                      <span className="text-xs font-medium text-text-muted">
                        Contul tău
                      </span>
                    ) : (
                      <ActionPill
                        tone="rust"
                        onClick={() => {
                          setModalError('');
                          setTarget(user);
                        }}
                        className="h-auto min-h-10 justify-start rounded-2xl px-4 py-2 text-left"
                      >
                        <span className="flex flex-col items-start leading-tight">
                          <span>Blochează contul</span>
                          <span className="text-[11px] font-medium opacity-70">
                            Oprește publicarea
                          </span>
                        </span>
                      </ActionPill>
                    )}
                    <UserRowActions
                      canToggleRole={!isSelf}
                      roleBusy={roleBusyId === user.id}
                      onToggleRole={() => toggleRole(user)}
                      toggleLabel={
                        user.role === 'admin'
                          ? 'Retrogradează la utilizator'
                          : 'Promovează la admin'
                      }
                      toggleHint={
                        user.role === 'admin'
                          ? 'Scoate accesul de administrare'
                          : 'Permite administrarea conținutului'
                      }
                      toggleTone={user.role === 'admin' ? 'rust' : 'primary'}
                      canDelete={!isSelf && !(user.role === 'admin' && adminCount <= 1)}
                      deleteBusy={deleteBusy && deleteTarget?.id === user.id}
                      onDelete={() => requestDelete(user)}
                      deleteLabel="Șterge contul"
                      deleteHint="Recenzii și mesaje vor fi șterse"
                      lockLabel={
                        isSelf
                          ? 'Contul tău'
                          : user.role === 'admin' && adminCount <= 1
                            ? 'Ultimul admin'
                            : ''
                      }
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={Boolean(target)}
        onClose={closeModal}
        title="Blochezi acest cont?"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} disabled={confirming}>
              Renunță
            </Button>
            <Button
              variant="destructive"
              loading={confirming}
              onClick={confirmBan}
            >
              Da, blochează
            </Button>
          </>
        }
      >
        <p className="text-pretty text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-text">
            {target?.name || target?.email || 'Acest călător'}
          </strong>{' '}
          nu va mai putea publica recenzii sau mesaje în atlas. Poți reveni
          oricând asupra deciziei, de la aceeași masă.
        </p>
        {modalError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm font-medium text-rust dark:text-[#e09478]"
          >
            {modalError}
          </p>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        title="Ștergi acest cont?"
        footer={
          <>
            <Button variant="ghost" onClick={closeDeleteModal} disabled={deleteBusy}>
              Renunță
            </Button>
            <Button variant="destructive" loading={deleteBusy} onClick={deleteUser}>
              Da, șterge
            </Button>
          </>
        }
      >
        <p className="text-pretty text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-text">
            {deleteTarget?.name || deleteTarget?.email || 'Acest călător'}
          </strong>{' '}
          va fi șters definitiv. Se vor șterge recenziile, mesajele, conturile
          Auth (`accounts`, `sessions`), apoi utilizatorul.
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
