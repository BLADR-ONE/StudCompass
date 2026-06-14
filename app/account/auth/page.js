import { redirect } from 'next/navigation';
import { auth } from '../../../lib/auth.js';
import AuthTabs from '../../../components/account/AuthTabs.js';
import { CompassRose } from '../../../components/layout/Brand.js';

export const metadata = {
  title: 'Autentificare',
  description:
    'Intră în contul StudCompass sau creează unul nou: recenzii, preferințe și testul de carieră, toate în jurnalul tău de drum.',
};

const PERKS = [
  'Lasă recenzii și mesaje pentru viitorii studenți',
  'Salvează orașele și domeniile care te interesează',
  'Păstrează rezultatul testului de carieră în jurnal',
];

/* Public checkpoint: an open field journal — the night map on the left
   page, the sign-in forms on the right. Signed-in travelers skip ahead. */
export default async function AuthPage({ searchParams }) {
  const session = await auth();
  if (session?.user) {
    redirect('/account');
  }

  const params = await searchParams;
  const rawError = Array.isArray(params?.error)
    ? params.error[0]
    : params?.error;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="texture-doodle" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      />

      <div className="wrap relative py-12 sm:py-16">
        <div className="animate-pop mx-auto grid w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-border bg-surface-raised shadow-lift lg:grid-cols-[1fr_1.1fr]">
          {/* Left page: always the night map, in both themes. */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-strong via-[#1c4a44] to-[#0c2426] p-8 sm:p-10">
            <div aria-hidden="true" className="texture-doodle-night" />
            <CompassRose className="animate-spin-slow pointer-events-none absolute -left-24 -top-24 size-72 text-mint/10" />
            <CompassRose className="pointer-events-none absolute -bottom-28 -right-20 size-64 text-mint/[0.07]" />

            <div className="relative flex h-full flex-col">
              <p className="eyebrow !text-mint">Jurnalul tău de drum</p>
              <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Fiecare drum are un{' '}
                <em className="wonky italic text-highlight">
                  punct de plecare
                </em>
                .
              </h1>
              <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-mint/80 sm:text-base">
                Cu un cont StudCompass, tot ce descoperi rămâne notat — părerile
                tale, direcțiile preferate și busola ta interioară.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-mint/75 lg:mt-auto lg:pt-10">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="size-1.5 flex-none rotate-45 bg-highlight"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right page: the forms. */}
          <div className="p-6 sm:p-10">
            <AuthTabs initialError={rawError || ''} />
          </div>
        </div>
      </div>
    </section>
  );
}
