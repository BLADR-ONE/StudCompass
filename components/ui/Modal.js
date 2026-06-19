'use client';

import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { lock, unlock } from '../../lib/scroll-lock.js';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className = '',
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    lock();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlock();
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`animate-pop relative w-full max-w-lg rounded-3xl border border-border bg-surface-raised p-6 shadow-lift sm:p-7 ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          {title && (
            <h3
              id={titleId}
              className="font-display text-xl font-semibold text-text"
            >
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="-mr-1 -mt-1 inline-flex size-9 flex-none items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border/50 hover:text-text"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-4"
            >
              <path
                d="M3.5 3.5l9 9m0-9-9 9"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={title ? 'mt-4' : ''}>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
