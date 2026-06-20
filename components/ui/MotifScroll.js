'use client';

import { useInView } from '../../lib/useInView.js';
import { useScrollProgress } from '../../lib/useScrollProgress.js';

/*
 * MotifScroll — scroll-driven motion wrapper for the cartographer motif SVGs.
 *
 * It is purely presentational glue: it wraps an inline motif SVG (which is itself
 * a safe-anywhere Server/Client presentational component) and ties it to the
 * scroll position. It NEVER imports server data, so a Server-Component page can
 * render `<MotifScroll><Contour …/></MotifScroll>` without becoming a client
 * page — only this wrapper is `'use client'`.
 *
 * SSR-safe: the motif is painted at full opacity / resting transform on the first
 * render (server, hydration, no-JS, reduced-motion). The scroll value only layers
 * a transform ON TOP after mount, so the SVG can never be blanked by a scroll
 * trigger. Reduced-motion-safe: both underlying hooks no-op under
 * prefers-reduced-motion (canReveal === false), and the CSS contract pins a clean
 * static pose under the reduced-motion media query.
 *
 * Modes (combinable):
 *   draw    one-time bold draw-on + scale-in as the motif scrolls into view
 *           (reuses useInView; arms the [data-motif-draw] start pose post-mount).
 *   effect  continuous scroll-progress transform driven by --motif-progress:
 *             'parallax' | 'parallax-up' | 'rotate' | 'rotate-rev' |
 *             'scale' | 'rise'  (see [data-motif-effect] in globals.css)
 *   speed   parallax/scroll travel multiplier (px or deg budget); CSS var.
 *
 * Props:
 *   effect    continuous scroll effect name (default none)
 *   draw      one-time draw-on reveal when true (default false)
 *   speed     intensity for the continuous effect (number, default 1)
 *   amount    IO threshold for the draw reveal (default 0.25)
 *   as        wrapper tag (default 'span')
 *   className wrapper classes (place absolute / size / color here as usual)
 */
export default function MotifScroll({
  children,
  effect = null,
  draw = false,
  speed = 1,
  amount = 0.25,
  as: Tag = 'span',
  className = '',
  style,
  ...rest
}) {
  /* One-time draw-on reveal. inView starts true (visible by default); only after
     mount under a capable, motion-OK environment does it arm + reveal. */
  const { ref: inViewRef, inView } = useInView({ amount, once: true });
  /* Continuous scroll progress writes --motif-progress straight onto the node. */
  const { ref: progressRef } = useScrollProgress();

  /* Merge the two refs onto one wrapper node. */
  const setRef = (node) => {
    inViewRef.current = node;
    progressRef.current = node;
  };

  const mergedStyle = {
    ...(style || {}),
    ...(speed !== 1 ? { '--motif-speed': speed } : {}),
  };

  /* The continuous scroll effect (translate/rotate/scale) lives on the OUTER
     wrapper; the one-time draw-on (scale + stroke sketch) lives on an INNER
     span. Splitting them means the two transforms never collide on one node, so
     `draw` and `effect` are freely combinable. Draw alone needs no inner node. */
  const inner = draw ? (
    <span data-motif-draw={inView ? 'in' : ''} className="block size-full">
      {children}
    </span>
  ) : (
    children
  );

  return (
    <Tag
      ref={setRef}
      {...(effect ? { 'data-motif-effect': effect } : {})}
      className={className}
      style={mergedStyle}
      {...rest}
    >
      {inner}
    </Tag>
  );
}
