import InitialAvatar from '../ui/InitialAvatar.js';
import Reveal from '../ui/Reveal.js';

/* The community's voice. The editorial pull-quote is the team's own line and
   always stands; the offset cards are real testimonials served from the
   database. When there are none, the section quietly shows just the team
   quote rather than inventing voices. */
export default function TestimonialBand({ testimonials = [] }) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <span
        aria-hidden="true"
        className="beacon-glow-primary absolute -left-32 top-0 size-[29rem]"
      />
      <div className="wrap relative">
        <p className="eyebrow">Vocea comunității</p>

        <div
          className={`mt-12 grid items-start gap-12 lg:gap-16 ${
            hasTestimonials ? 'lg:grid-cols-[1.15fr_1fr]' : ''
          }`}
        >
          {/* Editorial pull-quote */}
          <Reveal as="figure" variant="fade-up" className="relative">
            <span
              aria-hidden="true"
              className="wonky pointer-events-none absolute -left-5 -top-16 select-none font-display text-[13rem] font-semibold italic leading-none text-primary/15 dark:text-primary-soft/15"
            >
              „
            </span>
            <blockquote className="relative">
              <p className="wonky text-balance font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-medium italic leading-[1.12] text-text">
                Sunt puține locuri în care îți poți desena traseul spre
                carieră. Noi am construit StudCompass ca să fie unul dintre
                ele — busola fiecărui tânăr aflat în căutarea drumului său.
              </p>
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 text-sm font-semibold text-text-muted">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-gradient-to-r from-accent to-highlight"
              />
              Echipa StudCompass
            </figcaption>
          </Reveal>

          {/* Offset testimonial cards — real voices from the database. */}
          {hasTestimonials && (
            <Reveal stagger className="flex flex-col gap-6">
              {testimonials.map((item, index) => (
                <figure
                  key={item.id}
                  className={`rounded-3xl border border-border bg-surface-raised p-6 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-1 hover:border-primary-soft/50 hover:shadow-lift ${
                    index % 2 === 1 ? 'lg:ml-10' : 'lg:mr-10'
                  }`}
                >
                  <blockquote>
                    <p className="text-pretty text-sm leading-relaxed text-text">
                      „{item.body}"
                    </p>
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <InitialAvatar name={item.authorName} size="md" />
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
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
