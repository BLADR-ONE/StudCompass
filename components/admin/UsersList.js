'use client';

import { useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Modal from '../ui/Modal.js';
import {
  ActionPill,
  AuthorMark,
  DeskEmpty,
  ErrorBanner,
  deskDate,
} from './DeskBits.js';

async function moderate(action, id) {
  const res = await fetch('/api/admin/moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, id }),
  });
  if (!res.ok) {
    throw new Error('moderate_failed');
  }
}

/* The travelers' register. Banning is the one truly destructive act on
   the desk, so it asks twice — a rust-toned confirmation before the seal. */
export default function UsersList({ items: initialItems, currentUserId }) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState('');
  const [error, setError] = useState('');

  /* Ban confirmation modal state. */
  const [target, setTarget] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [modalError, setModalError] = useState('');

  const bannedCount = items.filter((item) => item.bannedAt).length;

  const setBanned = (id, bannedAt) => {
    setItems((rows) =>
      rows.map((row) => (row.id === id ? { ...row, bannedAt } : row)),
    );
  };

  const closeModal = () => {
    if (confirming) {
      return;
    }
    setTarget(null);
    setModalError('');
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

      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
        În registru: <span className="tabular-nums">{items.length}</span>
        <span aria-hidden="true"> · </span>
        Blocate: <span className="tabular-nums">{bannedCount}</span>
      </p>

      <ul className="divide-y divide-dashed divide-border overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
        {items.map((user) => {
          const banned = Boolean(user.bannedAt);
          const isSelf = user.id === currentUserId;
          return (
            <li
              key={user.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-4"
            >
              <AuthorMark name={user.name || user.email} dimmed={banned} />

              <div className={`min-w-0 flex-1 ${banned ? 'opacity-55' : ''}`}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-text">
                    {user.name || 'Călător fără nume'}
                  </span>
                  {user.role === 'admin' && (
                    <Badge tone="primary">Cartograf</Badge>
                  )}
                  {isSelf && <Badge tone="highlight">Tu</Badge>}
                </div>
                {user.email && (
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {user.email}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-text-muted">
                  Călător din {deskDate(user.createdAt)}
                  {banned && <span> · blocat din {deskDate(user.bannedAt)}</span>}
                </p>
              </div>

              <div className="flex flex-none items-center gap-2.5 sm:justify-end">
                {banned ? (
                  <>
                    <Badge tone="destructive">Blocat</Badge>
                    <ActionPill
                      tone="primary"
                      busy={pendingId === user.id}
                      onClick={() => unban(user)}
                    >
                      Deblochează
                    </ActionPill>
                  </>
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
                  >
                    Blochează
                  </ActionPill>
                )}
              </div>
            </li>
          );
        })}
      </ul>

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
    </div>
  );
}
