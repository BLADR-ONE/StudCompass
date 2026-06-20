import { Contour } from '../layout/Brand.js';
import Reveal from '../ui/Reveal.js';

const STEPS = [
  {
    numeral: '01',
    title: 'Alege-ți domeniul',
    body: 'Pornește de la pasiunile tale: alege orașele și domeniile în care te vezi — de la Informatică și Medicină până la Arte.',
  },
  {
    numeral: '02',
    title: 'Compară opțiunile',
    body: 'Noi îți arătăm facultățile potrivite, cu detalii despre admitere, costuri, locuri la buget și părerile sincere ale studenților.',
  },
  {
    numeral: '03',
    title: 'Decizia îți aparține',
    body: 'Citești, cântărești și alegi în cunoștință de cauză. Harta e a noastră — drumul e al tău.',
  },
];

export default function HowItWorks() {
  return (
    <section className="chapter-band relative overflow-hidden py-24 sm:py-28">
      {/* Theme-tied education doodles, faded like pencil on paper */}
      <div aria-hidden="true" className="texture-doodle" />
      {/* Full-bleed contour terrain anchoring the band — the motif promoted from
          corner decoration to a section-scale background element. */}
      <Contour className="animate-drift-slow pointer-events-none absolute -right-32 -top-24 hidden size-[40rem] text-primary/[0.06] dark:text-primary-soft/[0.07] lg:block" />
      <span
        aria-hidden="true"
        className="beacon-glow-primary absolute -left-24 top-10 size-[28rem]"
      />

      <div className="wrap relative">
        <Reveal variant="fade-up" className="max-w-2xl">
          <p className="eyebrow">Trei pași simpli</p>
          <h2 className="mt-4 text-balance font-display text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.028em]">
            Cum funcționează StudCompass?
          </h2>
          <p className="mt-5 text-pretty text-text-muted sm:text-lg">
            De la „habar n-am încotro" la o listă scurtă de facultăți care
            chiar ți se potrivesc.
          </p>
        </Reveal>

        <Reveal
          stagger
          as="ol"
          className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {/* Dashed route connecting the three map markers */}
          <div
            aria-hidden="true"
            className="absolute -top-8 left-[16%] right-[16%] hidden border-t-2 border-dashed border-primary-soft/45 md:block"
          />

          {STEPS.map(({ numeral, title, body }) => (
            <li
              key={numeral}
              className="group relative rounded-3xl border border-border bg-surface-raised p-7 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-1.5 hover:border-primary-soft/60 hover:shadow-lift"
            >
              {/* Map marker */}
              <div
                aria-hidden="true"
                className="absolute -top-8 left-1/2 hidden size-4 -translate-x-1/2 rounded-full border-2 border-primary-soft bg-band shadow-[0_0_0_4px_var(--sc-band)] transition-colors duration-300 group-hover:bg-primary-soft md:block"
              />
              <span
                aria-hidden="true"
                className="wonky font-display text-6xl font-semibold italic text-primary/25 transition-colors duration-300 group-hover:text-primary/45 dark:text-primary-soft/30 dark:group-hover:text-primary-soft/50"
              >
                {numeral}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {body}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
