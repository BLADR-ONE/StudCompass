'use client';

import { useEffect, useRef } from 'react';
import { trackAnalyticsEvent } from '../../lib/analytics.js';

export default function PageViewTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) {
      return;
    }
    fired.current = true;
    trackAnalyticsEvent('page_view');
  }, []);

  return null;
}
