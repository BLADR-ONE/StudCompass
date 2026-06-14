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
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Theme-tied education doodles, faded like pencil on paper */}
      <div aria-hidden="true" className="texture-doodle" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      />

      <div className="wrap relative">
        <div className="max-w-2xl">
          <p className="eyebrow">Trei pași simpli</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Cum funcționează StudCompass?
          </h2>
          <p className="mt-4 text-pretty text-text-muted sm:text-lg">
            De la „habar n-am încotro" la o listă scurtă de facultăți care
            chiar ți se potrivesc.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Dashed route connecting the three map markers */}
          <div
            aria-hidden="true"
            className="absolute -top-7 left-[16%] right-[16%] hidden border-t-2 border-dashed border-primary-soft/40 md:block"
          />

          {STEPS.map(({ numeral, title, body }) => (
            <li
              key={numeral}
              className="group relative rounded-3xl border border-border bg-surface-raised p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft/60 hover:shadow-lift"
            >
              {/* Map marker */}
              <div
                aria-hidden="true"
                className="absolute -top-7 left-1/2 hidden size-3.5 -translate-x-1/2 rounded-full border-2 border-primary-soft bg-bg transition-colors duration-300 group-hover:bg-primary-soft md:block"
              />
              <span
                aria-hidden="true"
                className="wonky font-display text-5xl font-semibold italic text-primary/25 transition-colors duration-300 group-hover:text-primary/45 dark:text-primary-soft/30 dark:group-hover:text-primary-soft/50"
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
        </ol>
      </div>
    </section>
  );
}
