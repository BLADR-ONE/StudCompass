'use client';

/* Journey progress as a map route: 12 waypoints joined by a dashed trail.
   Walked segments turn solid; the current waypoint gets a quiet ping.
   Visited stages are clickable, the road ahead stays locked. */
export default function RouteProgress({
  stages,
  current,
  furthest,
  onJump,
  className = '',
}) {
  return (
    <nav aria-label="Etapele testului" className={className}>
      <ol className="flex items-center">
        {stages.map((complete, index) => {
          const reachable = index <= furthest;
          const isCurrent = index === current;

          return (
            <li
              key={index}
              className={`flex items-center ${
                index < stages.length - 1 ? 'min-w-0 flex-1' : 'flex-none'
              }`}
            >
              <button
                type="button"
                onClick={() => reachable && onJump(index)}
                disabled={!reachable}
                aria-label={`Etapa ${index + 1} din ${stages.length}${
                  complete ? ' — completă' : ''
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                title={`Etapa ${index + 1}`}
                className="relative flex size-6 flex-none items-center justify-center disabled:cursor-default"
              >
                {isCurrent && (
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex size-4 animate-ping rounded-full bg-primary/30"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative inline-flex rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'size-3.5 border-2 border-primary bg-surface-raised shadow-[0_0_0_3px_rgb(56_136_112/0.18)]'
                      : complete
                        ? 'size-2.5 bg-primary'
                        : reachable
                          ? 'size-2.5 border-2 border-primary/50 bg-surface-raised'
                          : 'size-2 border border-border bg-surface'
                  }`}
                />
              </button>

              {index < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`h-0 min-w-1 flex-1 border-t-2 transition-colors duration-300 ${
                    complete
                      ? 'border-solid border-primary/50'
                      : 'border-dashed border-border'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
