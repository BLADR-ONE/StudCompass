import ChapterHeader from '../../../../components/layout/ChapterHeader.js';
import TestJourney from '../../../../components/test/TestJourney.js';

export const metadata = {
  title: 'Testul de carieră',
  description:
    'Răspunde la cele 120 de întrebări «Ți-ar plăcea să…?» și află spre ce domenii de studiu arată busola ta interioară.',
};

/* The career-test expedition: 120 questions in 12 stages on the map. */
export default function PersonalityTestPage() {
  return (
    <>
      <ChapterHeader
        eyebrow="Expediția interioară"
        title={
          <>
            120 de întrebări, o singură{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              direcție
            </em>
            .
          </>
        }
        subtitle="Răspunde sincer la fiecare «Ți-ar plăcea să…?» — la capătul traseului, busola ta interioară arată spre domeniile în care te-ai simți acasă."
      />

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          <div className="max-w-3xl">
            <TestJourney />
          </div>
        </div>
      </section>
    </>
  );
}
