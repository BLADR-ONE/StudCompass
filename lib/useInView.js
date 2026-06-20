'use client';

import { useEffect, useRef, useState } from 'react';

/* prefers-reduced-motion check, guarded for SSR / no-matchMedia environments. */
function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Whether scroll-reveal should run at all in this environment. False on the
   server, when IntersectionObserver is missing, or under reduced motion — in
   every one of those cases the caller leaves content in its visible default. */
export function canReveal() {
  return (
    typeof window !== 'undefined' &&
    typeof IntersectionObserver === 'function' &&
    !prefersReducedMotion()
  );
}

/*
 * SSR-safe "is this element on screen yet" hook, reveal-once by default.
 *
 * Returns { ref, inView }. `inView` starts true so that the FIRST render —
 * server render, hydration, reduced-motion, or any environment without
 * IntersectionObserver — shows the content. Only after mount, if revealing is
 * supported, does it flip to false (armed/hidden) and wait for intersection to
 * flip back to true. This guarantees content is never gated on the observer.
 */
export function useInView({ amount = 0.2, once = true, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  /* Visible by default — see the docstring. */
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canReveal()) {
      /* No observer / reduced motion: stay visible, nothing to arm. */
      return undefined;
    }

    /* Arm: hide now (post-mount), then reveal on intersection. */
    setInView(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, once, rootMargin]);

  return { ref, inView };
}

export default useInView;
