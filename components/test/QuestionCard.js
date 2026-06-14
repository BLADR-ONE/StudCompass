'use client';

import { ANSWER_OPTIONS } from './test-data.js';

/* The three answer marks, each with its own field-log ink:
   da = solid primary, indiferent = primary wash, nu = ink stamp. */
export const ANSWER_SELECTED = {
  2: 'border-primary bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]',
  1: 'border-primary/40 bg-primary/10 text-primary-strong dark:text-primary-soft',
  0: 'border-text/80 bg-text text-bg',
};

export const ANSWER_IDLE =
  'border-border bg-surface text-text-muted hover:border-primary-soft hover:text-text';

const PILL =
  'flex cursor-pointer select-none items-center justify-center rounded-full border px-3 py-2 text-center text-sm font-semibold transition-all duration-150';

/* One log entry: dashed waypoint number, the question, three marks. */
export default function QuestionCard({ index, question, value, missing, onChange }) {
  return (
    <div
      id={`question-${index}`}
      role="radiogroup"
      aria-labelledby={`question-${index}-label`}
      className={`scroll-mt-28 rounded-2xl border bg-surface-raised p-4 shadow-card transition-colors duration-300 sm:p-5 ${
        missing ? 'border-dashed border-accent/70' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-7 flex-none items-center justify-center rounded-full border border-dashed border-primary/50 text-[0.7rem] font-bold tabular-nums text-primary-strong dark:text-primary-soft"
        >
          {index + 1}
        </span>
        <p
          id={`question-${index}-label`}
          className="text-pretty pt-1 font-medium leading-snug"
        >
          {question}
        </p>
      </div>

      <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
        {ANSWER_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`${PILL} has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                checked ? ANSWER_SELECTED[option.value] : ANSWER_IDLE
              }`}
            >
              <input
                type="radio"
                name={`question-${index}`}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
