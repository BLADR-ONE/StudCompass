'use client';

import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import { ActionPill, ErrorBanner } from './DeskBits.js';
import slugModule from '../../lib/slug.js';

const { toSlug } = slugModule;

function asText(value) {
  return value == null ? '' : String(value);
}

function asPrograms(programs) {
  const values = Array.isArray(programs)
    ? programs
        .map((item) => (typeof item === 'string' ? item : item?.name))
        .map((item) => asText(item).trim())
        .filter(Boolean)
    : [];

  return values.length > 0 ? values : [''];
}

function buildDraft(values = {}) {
  return {
    name: asText(values.name),
    slug: asText(values.slug),
    city: asText(values.city),
    address: asText(values.address),
    description: asText(values.description),
    website: asText(values.website),
    email: asText(values.email),
    phone: asText(values.phone),
    tuitionCost: asText(values.tuitionCost),
    minAdmissionGrade: asText(values.minAdmissionGrade),
    budgetSeatsIndex: asText(values.budgetSeatsIndex),
    coverUrl: asText(values.coverUrl),
    emblemUrl: asText(values.emblemUrl),
    multiCampus: Boolean(values.multiCampus),
    domainIds: Array.isArray(values.domainIds) ? values.domainIds : [],
    programs: asPrograms(values.programs),
  };
}

function DomainPicker({ domains, value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text">Domenii</p>
        <Badge tone="neutral">{value.length}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {domains.length > 0 ? (
          domains.map((domain) => {
            const active = value.includes(domain.id);
            return (
              <button
                key={domain.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange(
                    active
                      ? value.filter((id) => id !== domain.id)
                      : [...value, domain.id],
                  )
                }
                className={`inline-flex select-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  active
                    ? 'border-primary/40 bg-primary/10 text-primary-strong dark:border-primary-soft/40 dark:bg-primary-soft/10 dark:text-primary-soft'
                    : 'border-border bg-surface text-text-muted hover:border-primary-soft/60 hover:text-text'
                }`}
              >
                {domain.name}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-text-muted">Nu există domenii încă.</p>
        )}
      </div>
    </div>
  );
}

function ProgramRows({ value, onChange }) {
  const update = (index, nextValue) => {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  };

  const remove = (index) => {
    const next = value.filter((_, itemIndex) => itemIndex !== index);
    onChange(next.length > 0 ? next : ['']);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text">Programe</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([...value, ''])}
        >
          Adaugă program
        </Button>
      </div>
      <div className="mt-3 space-y-3">
        {value.map((program, index) => (
          <div
            key={`${index}-${program}`}
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
          >
            <Input
              label={`Program ${index + 1}`}
              value={program}
              onChange={(event) => update(index, event.target.value)}
              placeholder="ex. Informatică economică"
              maxLength={120}
            />
            <div className="md:pb-0">
              <ActionPill tone="rust" onClick={() => remove(index)}>
                Șterge
              </ActionPill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FacultyForm({
  initialValues,
  domains = [],
  busy = false,
  error = '',
  onSubmit,
  onCancel,
}) {
  const [draft, setDraft] = useState(() => buildDraft(initialValues));
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    setDraft(buildDraft(initialValues));
    setSlugTouched(false);
  }, [initialValues]);

  const update = (field) => (event) => {
    const value = event.target.value;
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !slugTouched) {
        next.slug = toSlug(value);
      }
      return next;
    });
  };

  const toggleCampus = () => {
    setDraft((prev) => ({ ...prev, multiCampus: !prev.multiCampus }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      city: draft.city.trim(),
      address: draft.address.trim(),
      description: draft.description.trim(),
      website: draft.website.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      tuitionCost: draft.tuitionCost.trim(),
      minAdmissionGrade: draft.minAdmissionGrade.trim(),
      budgetSeatsIndex: draft.budgetSeatsIndex.trim(),
      coverUrl: draft.coverUrl.trim(),
      emblemUrl: draft.emblemUrl.trim(),
      multiCampus: draft.multiCampus,
      domainIds: draft.domainIds,
      programs: draft.programs.map((program) => program.trim()),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="max-h-[calc(100vh-15rem)] space-y-6 overflow-y-auto pr-2"
    >
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4 rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-text">
                Identitate și contact
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Informațiile de bază care apar pe pagina facultății.
              </p>
            </div>
            <Badge tone="neutral">{draft.programs.length} programe</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nume facultate"
              value={draft.name}
              onChange={update('name')}
              placeholder="ex. Facultatea de Informatică"
              maxLength={180}
              required
            />
            <Input
              label="Slug"
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true);
                update('slug')(event);
              }}
              hint="Se generează automat din nume, dar îl poți ajusta manual."
              placeholder="facultatea-de-informatica"
              maxLength={120}
              required
            />
            <Input
              label="Oraș"
              value={draft.city}
              onChange={update('city')}
              placeholder="ex. București"
              maxLength={120}
              required
            />
            <Input
              label="Locație"
              value={draft.address}
              onChange={update('address')}
              placeholder="ex. Bd. Exemplar 12"
              maxLength={255}
              className="md:col-span-2"
            />
            <Input
              label="Website"
              value={draft.website}
              onChange={update('website')}
              placeholder="https://..."
              maxLength={255}
            />
            <Input
              label="Email"
              value={draft.email}
              onChange={update('email')}
              placeholder="contact@..."
              maxLength={255}
            />
            <Input
              label="Telefon"
              value={draft.phone}
              onChange={update('phone')}
              placeholder="+40 ..."
              maxLength={80}
              className="md:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-text">
                Descriere și vizual
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Textul de prezentare și imaginile folosite la această facultate.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Descriere
            </label>
            <textarea
              value={draft.description}
              onChange={update('description')}
              rows={8}
              maxLength={4000}
              placeholder="Textul scurt de prezentare al facultății."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-[0.95rem] leading-relaxed text-text shadow-[inset_0_1px_2px_var(--sc-shadow-weak)] outline-none transition placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Cover"
              value={draft.coverUrl}
              onChange={update('coverUrl')}
              hint="URL sau data:image/...;base64,..."
              placeholder="https://... sau data:image/..."
              maxLength={5000}
            />
            <Input
              label="Emblem"
              value={draft.emblemUrl}
              onChange={update('emblemUrl')}
              hint="URL sau paste direct de bază64."
              placeholder="https://... sau data:image/..."
              maxLength={5000}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Cost"
              value={draft.tuitionCost}
              onChange={update('tuitionCost')}
              placeholder="ex. 7500"
              inputMode="numeric"
            />
            <Input
              label="Medie"
              value={draft.minAdmissionGrade}
              onChange={update('minAdmissionGrade')}
              placeholder="ex. 8.50"
              inputMode="decimal"
            />
            <Input
              label="Buget index"
              value={draft.budgetSeatsIndex}
              onChange={update('budgetSeatsIndex')}
              placeholder="ex. 1.20"
              inputMode="decimal"
            />
          </div>
        </section>
      </div>

      <section className="space-y-4 rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-text">
              Detalii academice
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Selectează domeniile și adaugă programele exact cum apar în catalog.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={draft.multiCampus}
            onClick={toggleCampus}
            className="group inline-flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className={`relative h-6 w-11 flex-none rounded-full border transition-colors duration-200 ${
                draft.multiCampus
                  ? 'border-primary bg-primary'
                  : 'border-border bg-surface group-hover:border-primary-soft/60'
              }`}
            >
              <span
                className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-200 ${
                  draft.multiCampus ? 'left-[1.5rem]' : 'left-1'
                }`}
              />
            </span>
            <span className="text-sm font-medium text-text">
              Mai multe campusuri
            </span>
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <DomainPicker
            domains={domains}
            value={draft.domainIds}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, domainIds: value }))
            }
          />

          <ProgramRows
            value={draft.programs}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, programs: value }))
            }
          />
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Renunță
          </Button>
        )}
        <Button type="submit" loading={busy}>
          Salvează facultatea
        </Button>
      </div>
    </form>
  );
}
