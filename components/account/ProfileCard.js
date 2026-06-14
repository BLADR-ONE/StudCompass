'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button.js';
import Card from '../ui/Card.js';
import Input from '../ui/Input.js';

/* Profile entry of the logbook: the traveler name → PUT /api/profile. */
export default function ProfileCard({ initialName = '' }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [fieldError, setFieldError] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const save = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setFieldError('Numele trebuie să aibă cel puțin 2 caractere.');
      return;
    }

    setFieldError('');
    setStatus(null);
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      if (res.ok) {
        setStatus({ tone: 'ok', text: 'Numele a fost salvat în jurnal.' });
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
          text: 'Nu am putut salva numele. Mai încearcă o dată.',
        });
      }
    } catch {
      setStatus({
        tone: 'error',
        text: 'Nu am putut salva numele. Verifică-ți conexiunea.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="sm:p-7">
      <h2 className="font-display text-xl font-semibold">Nume de călător</h2>
      <p className="mt-1 text-sm leading-relaxed text-text-muted">
        Numele apare lângă recenziile și mesajele tale de pe hartă.
      </p>

      <form onSubmit={save} noValidate className="mt-5">
        <Input
          label="Nume"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Numele tău"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldError('');
          }}
          error={fieldError}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p
            aria-live="polite"
            className={`text-xs font-medium ${
              status?.tone === 'error'
                ? 'text-rust dark:text-[#e09478]'
                : 'text-primary-strong dark:text-primary-soft'
            }`}
          >
            {status?.text || ''}
          </p>
          <Button type="submit" loading={saving}>
            Salvează numele
          </Button>
        </div>
      </form>
    </Card>
  );
}
