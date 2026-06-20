'use client';

import { useEffect, useRef, useState } from 'react';
import { canReveal } from './useInView.js';

/*
 * SSR-safe scroll-progress hook for SCENERY (decorative motifs only).
 *
 * Returns { ref, progress }. `progress` is 0..1 describing how far the element
 * has travelled through the viewport: 0 when the element's top first touches the
 * bottom of the viewport, 1 when its bottom leaves the top. It starts at a
 * neutral 0.5 so the FIRST render — server, hydration, reduced-motion, or any
 * environment without rAF / IntersectionObserver — paints the motif at its
 * mid/resting pose. The caller maps `progress` onto a transform (parallax drift,
 * scroll-rotate, scale) via a CSS var; the motif is therefore always visible and
 * the scroll value can only ever ENHANCE it, never gate visibility.
 *
 * Performance: a single scroll/resize listener per mounted instance, but the
 * actual measure + state write is rAF-throttled (at most one per frame), reads
 * layout in the rAF callback only, and writes a CSS custom property on the node
 * directly (no React re-render for the continuous value — React state is only
 * used to expose the latest value should a caller want it). Listeners + frames
 * are cleaned up on unmount. An IntersectionObserver gate pauses the listener
 * work while the element is off-screen.
 *
 * Reduced motion / no-JS: `canReveal()` is false → we never attach listeners and
 * leave the CSS var unset, so the CSS `@media (prefers-reduced-motion)` static
 * pose (and the SSR default) governs. Nothing animates.
 */
export function useScrollProgress({ cssVar = '--motif-progress' } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0.5);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canReveal()) {
      return undefined;
    }

    let frame = 0;
    let active = true; // only measure while near/in viewport
    let visible = true;

    const measure = () => {
      frame = 0;
      if (!visible) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      /* 0 when top hits viewport bottom, 1 when bottom clears viewport top. */
      const total = rect.height + vh;
      const travelled = vh - rect.top;
      let p = travelled / total;
      if (p < 0) p = 0;
      else if (p > 1) p = 1;
      node.style.setProperty(cssVar, p.toFixed(4));
      setProgress(p);
    };

    const schedule = () => {
      if (!active || frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    /* Pause listener work when the motif is well off-screen. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible) schedule();
        }
      },
      { rootMargin: '40% 0px 40% 0px' },
    );
    io.observe(node);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    /* Prime once so the motif takes its true scroll pose immediately. */
    schedule();

    return () => {
      active = false;
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [cssVar]);

  return { ref, progress };
}

export default useScrollProgress;
