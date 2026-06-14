'use client';

import { useEffect, useRef, useState } from 'react';
import { CompassRose } from '../layout/Brand.js';
import ModerationList from './ModerationList.js';
import UsersList from './UsersList.js';
import StatsPanel from './StatsPanel.js';

const TABS = [
  { id: 'recenzii', label: 'Recenzii' },
  { id: 'mesaje', label: 'Mesaje' },
  { id: 'utilizatori', label: 'Utilizatori' },
  { id: 'statistici', label: 'Statistici' },
];

/* The whole desk goes dark together: without a database there is nothing
   to moderate and nothing to count. */
function DeskOffline() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-16 text-center sm:py-20">
      <CompassRose className="pointer-events-none absolute -bottom-24 -left-16 size-72 text-primary/[0.08] dark:text-primary-soft/10" />
      <CompassRose className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.08] dark:text-primary-soft/10" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-display text-2xl font-semibold">
          Masa e goală — atlasul nu e conectat.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          Baza de date nu răspunde momentan, așa că recenziile, mesajele și
          registrul călătorilor nu pot fi aduse la masă. Revino după ce
          conexiunea e restabilită.
        </p>
      </div>
    </div>
  );
}

/* The cartographer's desk: one tab rail, four drawers. Panels stay
   mounted once opened, so moderation state and the chart survive
   switching back and forth. */
export default function AdminDesk({
  offline = false,
  reviews = [],
  messages = [],
  users = [],
  currentUserId = '',
}) {
  const [tab, setTab] = useState('recenzii');
  const [statsMounted, setStatsMounted] = useState(false);
  const tabRefs = useRef([]);

  /* The chart only starts measuring once its drawer is first opened. */
  useEffect(() => {
    if (tab === 'statistici') {
      setStatsMounted(true);
    }
  }, [tab]);

  if (offline) {
    return (
      <div className="animate-pop">
        <DeskOffline />
      </div>
    );
  }

  const counts = {
    recenzii: reviews.length,
    mesaje: messages.length,
    utilizatori: users.length,
  };

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const index = TABS.findIndex((item) => item.id === tab);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="animate-pop">
      {/* Drawer rail */}
      <div
        role="tablist"
        aria-label="Secțiunile mesei de administrare"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-1 rounded-[1.6rem] border border-border bg-surface p-1 sm:grid-cols-4 sm:rounded-full"
      >
        {TABS.map(({ id, label }, index) => {
          const active = tab === id;
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`desk-tab-${id}`}
              aria-selected={active}
              aria-controls={`desk-panel-${id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(id)}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
              {typeof counts[id] === 'number' && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums leading-none ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-border/70 text-text-muted'
                  }`}
                >
                  {counts[id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Drawers */}
      <div
        role="tabpanel"
        id="desk-panel-recenzii"
        aria-labelledby="desk-tab-recenzii"
        hidden={tab !== 'recenzii'}
        className="mt-7"
      >
        <ModerationList kind="review" items={reviews} />
      </div>

      <div
        role="tabpanel"
        id="desk-panel-mesaje"
        aria-labelledby="desk-tab-mesaje"
        hidden={tab !== 'mesaje'}
        className="mt-7"
      >
        <ModerationList kind="message" items={messages} />
      </div>

      <div
        role="tabpanel"
        id="desk-panel-utilizatori"
        aria-labelledby="desk-tab-utilizatori"
        hidden={tab !== 'utilizatori'}
        className="mt-7"
      >
        <UsersList items={users} currentUserId={currentUserId} />
      </div>

      <div
        role="tabpanel"
        id="desk-panel-statistici"
        aria-labelledby="desk-tab-statistici"
        hidden={tab !== 'statistici'}
        className="mt-7"
      >
        {statsMounted && <StatsPanel />}
      </div>
    </div>
  );
}
