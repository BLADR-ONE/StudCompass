import Image from 'next/image';
import pers1 from '../../public/assets/pers1.jpg';
import pers2 from '../../public/assets/pers2.jpg';

const TESTIMONIALS = [
  {
    quote:
      'Ne oferă o metodă simplă de a ne găsi profesia sau facultatea la care să studiem. Pentru noi, tinerii, e un ajutor real.',
    name: 'Cristian Constantinescu',
    role: 'elev în clasa a XII-a',
    image: pers1,
  },
  {
    quote:
      'Nu mă așteptam să recomand vreodată un site din proprie inițiativă, dar StudCompass mi-a demonstrat contrariul. Revin de fiecare dată când am nevoie.',
    name: 'Diana Dobrică',
    role: 'studentă în anul I',
    image: pers2,
  },
];

export default function TestimonialBand() {
  return (
    <section className="py-24 sm:py-28">
      <div className="wrap">
        <p className="eyebrow">Vocea comunității</p>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
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

          {/* Offset testimonial cards */}
          <div className="flex flex-col gap-6">
            {TESTIMONIALS.map(({ quote, name, role, image }, index) => (
              <figure
                key={name}
                className={`rounded-3xl border border-border bg-surface-raised p-6 shadow-card ${
                  index === 1 ? 'lg:ml-10' : 'lg:mr-10'
                }`}
              >
                <blockquote>
                  <p className="text-pretty text-sm leading-relaxed text-text">
                    „{quote}"
                  </p>
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Image
                    src={image}
                    alt=""
                    className="size-11 rounded-full border border-border object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-text">{name}</p>
                    <p className="text-xs text-text-muted">{role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
