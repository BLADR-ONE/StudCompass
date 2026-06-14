'use client';

import { useState } from 'react';

/* Honest mailto form: composes the message and opens the visitor's own
   e-mail client. Styled for the fixed night-map band it sits on. */
const FIELD =
  'w-full rounded-xl border border-mint/20 bg-white/[0.07] px-4 text-[0.95rem] text-white outline-none transition placeholder:text-mint/40 focus:border-mint/50 focus:ring-2 focus:ring-mint/20';

export default function ContactForm({ email = 'contact@studcompass.ro' }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const subject = `Mesaj prin StudCompass${trimmedName ? ` de la ${trimmedName}` : ''}`;
    const body = trimmedName
      ? `${trimmedMessage}\n\n— ${trimmedName}`
      : trimmedMessage;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-mint/15 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-semibold text-mint/85"
        >
          Cum te cheamă?
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Numele tău"
          maxLength={80}
          className={`h-11 ${FIELD}`}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-semibold text-mint/85"
        >
          Mesajul tău
        </label>
        <textarea
          id="contact-message"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Spune-ne ce te frământă — idei, întrebări, o facultate care lipsește de pe hartă…"
          rows={5}
          maxLength={4000}
          className={`resize-y py-3 ${FIELD}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[16rem] text-xs leading-relaxed text-mint/55">
          {opened
            ? 'Am deschis aplicația ta de e-mail — mai ai de apăsat doar „Trimite".'
            : 'Apăsând pe buton se deschide aplicația ta de e-mail, cu mesajul gata scris.'}
        </p>
        <button
          type="submit"
          className="inline-flex h-11 select-none items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_24px_-10px_rgb(240_120_32/0.6)] transition-all duration-200 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint active:scale-[0.97]"
        >
          Compune mesajul
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="size-4"
          >
            <path
              d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
