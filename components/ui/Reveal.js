'use client';

import { Children, cloneElement, isValidElement } from 'react';
import { useInView } from '../../lib/useInView.js';

/*
 * Reveal — scroll-reveal primitive for StudCompass.
 *
 * SSR-safe by construction: it renders its children visible by default and only
 * arms the hidden/offset start pose AFTER mount, once IntersectionObserver is
 * available and the user has not asked for reduced motion (both checked inside
 * useInView). If JS never runs, IO is unsupported, or reduced motion is set, the
 * content simply stays in its painted, visible state — the reveal can only ever
 * enhance, never hide. The transition CSS lives in app/globals.css under the
 * [data-reveal] / [data-reveal-item] contract.
 *
 * It wraps Server-Component children transparently ({children} pass through), so
 * a server page can drop <Reveal> around DB-rendered markup without becoming a
 * client component itself.
 *
 * Two modes:
 *   - Single (default): animates the wrapper element as one block.
 *       <Reveal variant="fade-up" delay={120}>…</Reveal>
 *   - Stagger: animates each direct child in sequence as the group enters.
 *       <Reveal stagger className="grid …">{items.map(…)}</Reveal>
 *
 * Props:
 *   variant   'fade-up' | 'fade' | 'slide-left' | 'slide-right'  (default fade-up)
 *   delay     ms before the single-element transition starts      (default 0)
 *   stagger   when true, fan in direct children by index          (default false)
 *   step      per-child stagger step in ms (stagger mode)          (default 80)
 *   as        element tag for the wrapper                          (default 'div')
 *   amount    IntersectionObserver threshold 0..1                  (default 0.2)
 *   once      reveal a single time then stop observing            (default true)
 *   className extra classes for the wrapper
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  stagger = false,
  step = 80,
  /* Cap the cascade so long grids (e.g. a full faculty catalog) don't trail in
     for seconds — past this many items the delay stops growing. */
  maxStagger = 8,
  as: Tag = 'div',
  amount = 0.2,
  once = true,
  className = '',
  ...rest
}) {
  const { ref, inView } = useInView({ amount, once });

  if (stagger) {
    /* Arm each direct child as a stagger item. Children keep their own classes;
       we layer the reveal contract via data-attrs + an index CSS var. When
       `inView` (the SSR/default state, or post-intersection), the group flips on
       and the [data-reveal-group-in] descendant rule resolves children to their
       resting pose. */
    const items = Children.toArray(children).filter(isValidElement);

    return (
      <Tag
        ref={ref}
        className={className}
        {...(inView ? { 'data-reveal-group-in': '' } : {})}
        {...rest}
      >
        {items.map((child, index) => {
          const i = Math.min(index, maxStagger);
          return cloneElement(child, {
            'data-reveal-item': '',
            style: {
              ...(child.props.style || {}),
              '--reveal-i': i,
              ...(step !== 80 ? { transitionDelay: `${i * step}ms` } : {}),
            },
          });
        })}
      </Tag>
    );
  }

  /* Single-element reveal. data-reveal arms the start pose; data-reveal-in
     (added when inView) transitions to rest. inView is true by default → the
     server/no-JS render paints [data-reveal-in], i.e. fully visible. */
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      {...(inView ? { 'data-reveal-in': '' } : {})}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
