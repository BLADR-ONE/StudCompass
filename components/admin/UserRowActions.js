'use client';

import Badge from '../ui/Badge.js';
import { ActionPill } from './DeskBits.js';

export default function UserRowActions({
  canToggleRole,
  roleBusy,
  onToggleRole,
  toggleLabel,
  toggleHint = '',
  toggleTone = 'primary',
  canDelete,
  deleteBusy,
  onDelete,
  deleteLabel = 'Șterge contul',
  deleteHint = 'Ireversibil',
  lockLabel = '',
}) {
  const pillClassName =
    'h-auto min-h-10 justify-start rounded-2xl px-4 py-2 text-left';

  return (
    <div className="flex flex-none flex-col items-stretch gap-2.5 sm:items-end">
      {!canToggleRole && lockLabel && <Badge tone="highlight">{lockLabel}</Badge>}
      {canToggleRole && (
        <ActionPill
          tone={toggleTone}
          busy={roleBusy}
          onClick={onToggleRole}
          className={pillClassName}
        >
          <span className="flex flex-col items-start leading-tight">
            <span>{toggleLabel}</span>
            {toggleHint && (
              <span className="text-[11px] font-medium opacity-70">{toggleHint}</span>
            )}
          </span>
        </ActionPill>
      )}
      {canDelete && (
        <ActionPill
          tone="rust"
          busy={deleteBusy}
          onClick={onDelete}
          className={pillClassName}
        >
          <span className="flex flex-col items-start leading-tight">
            <span>{deleteLabel}</span>
            {deleteHint && (
              <span className="text-[11px] font-medium opacity-70">{deleteHint}</span>
            )}
          </span>
        </ActionPill>
      )}
    </div>
  );
}
