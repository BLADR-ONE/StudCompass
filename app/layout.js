import { Fraunces, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import Providers from '../components/layout/Providers.js';
import Navbar from '../components/layout/Navbar.js';
import Footer from '../components/layout/Footer.js';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-schibsted',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'StudCompass — Busola ta pentru studii',
    template: '%s · StudCompass',
  },
  description:
    'Descoperă facultăți din toată România, citește recenzii sincere de la studenți și află-ți drumul cu testul de carieră StudCompass.',
  /* Tab icon is provided by the app/icon.js file convention (CompassRose). */
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0d2123' },
  ],
};

/* Runs before paint: applies the persisted theme (or system preference)
   so neither theme ever flashes. Persisted key: sc_theme. */
const themeScript = `(function(){try{var t=localStorage.getItem('sc_theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={`${fraunces.variable} ${schibsted.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg font-sans text-text antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-svh">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
