'use client';

import { useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Modal from '../ui/Modal.js';
import {
  ActionPill,
  DeskEmpty,
  deskDate,
} from './DeskBits.js';
import FacultyForm from './FacultyForm.js';

const EMPTY_FACULTY = {
  name: '',
  slug: '',
  city: '',
  address: '',
  description: '',
  website: '',
  email: '',
  phone: '',
  tuitionCost: '',
  minAdmissionGrade: '',
  budgetSeatsIndex: '',
  coverUrl: '',
  emblemUrl: '',
  multiCampus: false,
  domainIds: [],
  programs: [''],
};

function sortFaculties(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, 'ro'));
}

function toFormValues(faculty) {
  if (!faculty) {
    return EMPTY_FACULTY;
  }

  return {
    name: faculty.name || '',
    slug: faculty.slug || '',
    city: faculty.city || '',
    address: faculty.address || '',
    description: faculty.description || '',
    website: faculty.website || '',
    email: faculty.email || '',
    phone: faculty.phone || '',
    tuitionCost: faculty.tuitionCost == null ? '' : String(faculty.tuitionCost),
    minAdmissionGrade:
      faculty.minAdmissionGrade == null ? '' : String(faculty.minAdmissionGrade),
    budgetSeatsIndex:
      faculty.budgetSeatsIndex == null ? '' : String(faculty.budgetSeatsIndex),
    coverUrl: faculty.coverUrl || '',
    emblemUrl: faculty.emblemUrl || '',
    multiCampus: Boolean(faculty.multiCampus),
    domainIds: Array.isArray(faculty.domainIds)
      ? faculty.domainIds
      : (faculty.domains || []).map((domain) => domain.id),
    programs: Array.isArray(faculty.programs) && faculty.programs.length > 0
      ? faculty.programs.map((program) =>
          typeof program === 'string' ? program : program?.name || '',
        )
      : [''],
  };
}

function countPrograms(faculty) {
  return Array.isArray(faculty.programs) ? faculty.programs.length : 0;
}

export default function FacultiesList({
  items: initialItems,
  domains = [],
}) {
  const [items, setItems] = useState(() => sortFaculties(initialItems));
  const [nameQuery, setNameQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [editor, setEditor] = useState(null);
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredItems = items.filter((faculty) => {
    const query = nameQuery.trim().toLowerCase();
    if (query) {
      const haystack = [
        faculty.name,
        faculty.slug,
        faculty.city,
        faculty.address,
        faculty.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (cityFilter !== 'all' && faculty.city !== cityFilter) {
      return false;
    }

    if (
      domainFilter !== 'all' &&
      !(faculty.domains || []).some((domain) => domain.id === domainFilter)
    ) {
      return false;
    }

    return true;
  });

  const cities = [...new Set(items.map((faculty) => faculty.city).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'ro'));

  const filteredMultiCampusCount = filteredItems.filter((item) => item.multiCampus)
    .length;
  const filtersActive =
    nameQuery.trim() || cityFilter !== 'all' || domainFilter !== 'all';

  const clearFilters = () => {
    setNameQuery('');
    setCityFilter('all');
    setDomainFilter('all');
  };

  const closeEditor = () => {
    if (formBusy) {
      return;
    }
    setEditor(null);
    setFormError('');
  };

  const createFaculty = () => {
    setFormError('');
    setEditor({ mode: 'create', faculty: null });
  };

  const editFaculty = (faculty) => {
    setFormError('');
    setEditor({ mode: 'edit', faculty });
  };

  const saveFaculty = async (values) => {
    setFormError('');
    setFormBusy(true);

    const method = editor?.mode === 'edit' ? 'PATCH' : 'POST';
    const payload = {
      ...values,
      ...(editor?.faculty?.id ? { id: editor.faculty.id } : {}),
    };

    try {
      const res = await fetch('/api/admin/faculties', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'faculty_save_failed');
      }

      setItems((prev) => {
        const next =
          method === 'POST'
            ? [...prev, data.faculty]
            : prev.map((item) =>
                item.id === data.faculty.id ? data.faculty : item,
              );
        return sortFaculties(next);
      });
      setEditor(null);
    } catch (error) {
      setFormError(
        error?.message === 'Slug-ul există deja'
          ? 'Slug-ul există deja. Alege altul.'
          : 'Nu am putut salva facultatea. Verifică datele și mai încearcă.',
      );
    } finally {
      setFormBusy(false);
    }
  };

  const confirmDelete = (faculty) => {
    setDeleteError('');
    setDeleteTarget(faculty);
  };

  const closeDelete = () => {
    if (deleteBusy) {
      return;
    }
    setDeleteTarget(null);
    setDeleteError('');
  };

  const deleteFaculty = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteBusy(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/admin/faculties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'faculty_delete_failed');
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setDeleteError(
        'Nu am putut șterge facultatea. Verifică permisiunile și mai încearcă.',
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <DeskEmpty
        title="Nu există facultăți în catalog."
        action={
          <Button onClick={createFaculty}>Adaugă prima facultate</Button>
        }
      >
        Acesta este locul unde apar facultățile publice, împreună cu domeniile și
        programele lor.
      </DeskEmpty>
    );
  }

  return (
    <div>
      <div className="mb-4 grid gap-4 rounded-[1.75rem] border border-border bg-surface p-4 shadow-card sm:p-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <Input
            label="Caută facultate"
            value={nameQuery}
            onChange={(event) => setNameQuery(event.target.value)}
            placeholder="Nume, slug, oraș sau descriere"
          />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Oraș
            </label>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate orașele</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Domeniu
            </label>
            <select
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">Toate domeniile</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            În catalog: <span className="tabular-nums">{items.length}</span>
            <span aria-hidden="true"> · </span>
            Afișate: <span className="tabular-nums">{filteredItems.length}</span>
            <span aria-hidden="true"> · </span>
            Multi-campus:{' '}
            <span className="tabular-nums">{filteredMultiCampusCount}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {filtersActive && (
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Resetează filtrele
              </Button>
            )}
            <Button size="sm" onClick={createFaculty}>
              Adaugă facultate
            </Button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <DeskEmpty
          title={
            filtersActive
              ? 'Nicio facultate nu se potrivește filtrului.'
              : 'Nu există facultăți în catalog.'
          }
          action={
            filtersActive ? (
              <Button variant="ghost" onClick={clearFilters}>
                Curăță filtrele
              </Button>
            ) : (
              <Button onClick={createFaculty}>Adaugă prima facultate</Button>
            )
          }
        >
          {filtersActive
            ? 'Schimbă căutarea, orașul sau domeniul ca să găsești facultatea dorită.'
            : 'Acesta este locul unde apar facultățile publice, împreună cu domeniile și programele lor.'}
        </DeskEmpty>
      ) : (
        <ul className="grid gap-3">
          {filteredItems.map((faculty) => (
            <li
              key={faculty.id}
              className="rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-text">
                      {faculty.name}
                    </h3>
                    <Badge tone="primary">{faculty.city}</Badge>
                    {faculty.multiCampus && (
                      <Badge tone="highlight">Mai multe campusuri</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    <span className="font-semibold text-primary-strong dark:text-primary-soft">
                      {faculty.slug}
                    </span>
                    <span> · actualizat {deskDate(faculty.updatedAt || faculty.createdAt)}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(faculty.domains || []).map((domain) => (
                      <Badge key={domain.id} tone="neutral">
                        {domain.name}
                      </Badge>
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {countPrograms(faculty)} programe
                    {faculty.tuitionCost != null && (
                      <span> · cost {faculty.tuitionCost}</span>
                    )}
                    {faculty.minAdmissionGrade != null && (
                      <span>
                        {' '}
                        · medie {String(faculty.minAdmissionGrade).replace('.', ',')}
                      </span>
                    )}
                    {faculty.budgetSeatsIndex != null && (
                      <span>
                        {' '}
                        · buget index {String(faculty.budgetSeatsIndex).replace('.', ',')}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-none flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
                  <ActionPill tone="primary" onClick={() => editFaculty(faculty)}>
                    Modifică
                  </ActionPill>
                  <ActionPill tone="rust" onClick={() => confirmDelete(faculty)}>
                    Șterge
                  </ActionPill>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(editor)}
        onClose={closeEditor}
        title={editor?.mode === 'edit' ? 'Modifică facultatea' : 'Adaugă facultate'}
        className="max-w-[96vw] lg:max-w-[92rem] xl:max-w-[96rem]"
      >
        <FacultyForm
          initialValues={toFormValues(editor?.faculty)}
          domains={domains}
          busy={formBusy}
          error={formError}
          onSubmit={saveFaculty}
          onCancel={closeEditor}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={closeDelete}
        title="Ștergi facultatea?"
        footer={
          <>
            <Button variant="ghost" onClick={closeDelete} disabled={deleteBusy}>
              Renunță
            </Button>
            <Button variant="destructive" loading={deleteBusy} onClick={deleteFaculty}>
              Da, șterge
            </Button>
          </>
        }
      >
        <p className="text-pretty text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-text">
            {deleteTarget?.name || 'Această facultate'}
          </strong>{' '}
          va fi ștearsă definitiv. Se vor șterge în tranzacție legăturile de
          domenii, programele, recenziile și mesajele, apoi facultatea.
        </p>
        {deleteError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm font-medium text-rust dark:text-rust-soft"
          >
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  );
}
