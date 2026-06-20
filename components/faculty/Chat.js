'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Button from '../ui/Button.js';
import Spinner from '../ui/Spinner.js';

const POLL_INTERVAL = 15000;

const timeFormatter = new Intl.DateTimeFormat('ro-RO', {
  hour: '2-digit',
  minute: '2-digit',
});
const dayFormatter = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'short',
});

function formatWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  return sameDay
    ? timeFormatter.format(date)
    : `${dayFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

function Message({ message }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="wonky mt-0.5 flex size-9 flex-none items-center justify-center rounded-full bg-teal-soft/20 font-display text-base font-semibold italic text-primary-strong dark:text-teal-soft"
      >
        {(message.authorName || '?').charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text">{message.authorName}</span>{' '}
          · {formatWhen(message.createdAt)}
        </p>
        <p className="mt-1 w-fit max-w-full whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2 text-sm leading-relaxed text-text">
          {message.body}
        </p>
      </div>
    </li>
  );
}

/* Public chat island: polls GET /api/messages?faculty=<slug> every 15s,
   posts via POST /api/messages. Posting requires a session. */
export default function Chat({ facultySlug }) {
  const { status: sessionStatus } = useSession();
  const [messages, setMessages] = useState(null);
  const [status, setStatus] = useState('loading');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const listRef = useRef(null);
  const lastCount = useRef(-1);

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?faculty=${encodeURIComponent(facultySlug)}`,
      );
      if (!res.ok) {
        setStatus((current) => (current === 'ready' ? 'ready' : 'unavailable'));
        return;
      }
      const payload = await res.json();
      /* API returns newest first — the room reads top to bottom. */
      setMessages([...(payload.messages || [])].reverse());
      setStatus('ready');
    } catch {
      setStatus((current) => (current === 'ready' ? 'ready' : 'unavailable'));
    }
  }, [facultySlug]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  /* Keep the room scrolled to the latest message. */
  useEffect(() => {
    if (!messages || messages.length === lastCount.current) {
      return;
    }
    lastCount.current = messages.length;
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || sending) {
      return;
    }

    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty: facultySlug, body: trimmed }),
      });

      if (res.ok) {
        setBody('');
        await load();
      } else if (res.status === 401) {
        setSendError('Sesiunea a expirat — intră din nou în cont.');
      } else if (res.status === 403) {
        setSendError('Contul tău nu poate scrie în chat momentan.');
      } else {
        setSendError('Mesajul nu a plecat. Mai încearcă o dată.');
      }
    } catch {
      setSendError('Mesajul nu a plecat. Verifică-ți conexiunea.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col rounded-3xl border border-border bg-surface-raised p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">Chat public</h3>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-text-muted">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary-soft opacity-60" />
            <span className="relative size-2 rounded-full bg-primary-soft" />
          </span>
          În direct
        </span>
      </div>

      <div
        ref={listRef}
        className="mt-5 max-h-[26rem] min-h-[10rem] overflow-y-auto pr-1"
      >
        {status === 'loading' && (
          <div className="flex h-full min-h-[10rem] items-center justify-center text-text-muted">
            <Spinner />
          </div>
        )}

        {status === 'unavailable' && (
          <div className="flex h-full min-h-[10rem] items-center justify-center px-4 text-center">
            <p className="text-sm leading-relaxed text-text-muted">
              Chatul nu poate fi încărcat momentan. Mai încearcă puțin mai
              târziu.
            </p>
          </div>
        )}

        {status === 'ready' &&
          (messages && messages.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </ul>
          ) : (
            <div className="flex h-full min-h-[10rem] items-center justify-center px-4 text-center">
              <p className="text-sm leading-relaxed text-text-muted">
                E liniște aici deocamdată. Sparge gheața — pune prima
                întrebare.
              </p>
            </div>
          ))}
      </div>

      {sessionStatus === 'authenticated' ? (
        <div className="mt-5 border-t border-dashed border-border pt-4">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <label htmlFor={`chat-${facultySlug}`} className="sr-only">
              Scrie un mesaj
            </label>
            <input
              id={`chat-${facultySlug}`}
              type="text"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Scrie un mesaj…"
              maxLength={4000}
              disabled={sending}
              className="h-11 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || body.trim().length === 0}
              aria-label="Trimite mesajul"
              className="inline-flex size-11 flex-none items-center justify-center rounded-full bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-all duration-200 hover:bg-primary-strong active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50"
            >
              {sending ? (
                <Spinner size="sm" />
              ) : (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="size-4 -translate-x-px"
                >
                  <path
                    d="M14.5 8 2 1.8l2.2 6.2L2 14.2 14.5 8Zm-10.3 0h4.6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </form>
          <p
            aria-live="polite"
            className={`mt-2.5 text-[11px] leading-relaxed ${
              sendError
                ? 'font-medium text-rust dark:text-rust-soft'
                : 'text-text-muted'
            }`}
          >
            {sendError ||
              'Mesajele sunt publice și trec printr-un filtru de limbaj.'}
          </p>
        </div>
      ) : sessionStatus === 'unauthenticated' ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-5">
          <p className="text-sm text-text-muted">
            Intră în cont ca să intri în discuție.
          </p>
          <Button href="/account/auth" size="sm">
            Intră în cont
          </Button>
        </div>
      ) : null}
    </div>
  );
}
