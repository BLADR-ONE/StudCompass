/* Initial-letter mark, in the same hand as the desk + faculty avatars. */
function InitialMark({ name }) {
  return (
    <span
      aria-hidden="true"
      className="wonky flex size-11 flex-none items-center justify-center rounded-full border border-border bg-primary/10 font-display text-lg font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
    >
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

/* The community's voice. The editorial pull-quote is the team's own line and
   always stands; the offset cards are real testimonials served from the
   database. When there are none, the section quietly shows just the team
   quote rather than inventing voices. */
export default function TestimonialBand({ testimonials = [] }) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section className="py-24 sm:py-28">
      <div className="wrap">
        <p className="eyebrow">Vocea comunității</p>

        <div
          className={`mt-10 grid items-start gap-12 lg:gap-16 ${
            hasTestimonials ? 'lg:grid-cols-[1.15fr_1fr]' : ''
          }`}
        >
          {/* Editorial pull-quote */}
          <figure className="relative">
            <span
              aria-hidden="true"
              className="wonky pointer-events-none absolute -left-4 -top-14 select-none font-display text-[10rem] font-semibold italic leading-none text-primary/15 dark:text-primary-soft/15"
            >
              „
            </span>
            <blockquote className="relative">
              <p className="wonky text-balance font-display text-2xl font-medium italic leading-snug text-text sm:text-3xl lg:text-[2.1rem]">
                Sunt puține locuri în care îți poți desena traseul spre
                carieră. Noi am construit StudCompass ca să fie unul dintre
                ele — busola fiecărui tânăr aflat în căutarea drumului său.
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-sm font-semibold text-text-muted">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-accent to-highlight"
              />
              Echipa StudCompass
            </figcaption>
          </figure>

          {/* Offset testimonial cards — real voices from the database. */}
          {hasTestimonials && (
            <div className="flex flex-col gap-6">
              {testimonials.map((item, index) => (
                <figure
                  key={item.id}
                  className={`rounded-3xl border border-border bg-surface-raised p-6 shadow-card ${
                    index % 2 === 1 ? 'lg:ml-10' : 'lg:mr-10'
                  }`}
                >
                  <blockquote>
                    <p className="text-pretty text-sm leading-relaxed text-text">
                      „{item.body}"
                    </p>
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <InitialMark name={item.authorName} />
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {item.authorName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {item.authorRole}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
