'use client';

const STORAGE_KEY = 'sc_visitor';

function createVisitorId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (cached) {
    return cached;
  }

  const visitorId = createVisitorId();
  window.localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}

export function trackAnalyticsEvent(eventType, faculty) {
  if (typeof window === 'undefined') {
    return;
  }

  const visitorId = getVisitorId();
  if (!visitorId) {
    return;
  }

  const payload = {
    eventType,
    visitorId,
  };

  if (faculty) {
    payload.faculty = faculty;
  }

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(
        '/api/analytics',
        new Blob([body], { type: 'application/json' }),
      );
      if (sent) {
        return;
      }
    }
  } catch {
    // Fall through to fetch.
  }

  void fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch(() => {});
}
