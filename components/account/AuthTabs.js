'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';

/* Romanian copy for the ?error= codes NextAuth can append to this page. */
const URL_ERRORS = {
  CredentialsSignin: 'Email sau parolă greșite. Mai încearcă o dată.',
  EmailNeverificat:
    'Email neverificat — verifică-ți adresa și apoi încearcă din nou.',
  OAuthAccountNotLinked:
    'Emailul acesta e deja legat de altă metodă de autentificare. Intră cu emailul și parola contului.',
  AccessDenied: 'Accesul a fost refuzat. Mai încearcă o dată.',
  Configuration:
    'Autentificarea nu e disponibilă momentan. Revino puțin mai târziu.',
  Verification: 'Linkul de verificare a expirat. Mai încearcă o dată.',
};

const GENERIC_URL_ERROR =
  'Ceva nu a mers la autentificare. Mai încearcă o dată.';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TABS = [
  { id: 'login', label: 'Autentificare' },
  { id: 'register', label: 'Înregistrare' },
];

function GoogleIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.97 11.97 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

/* The right-hand page of the auth booklet: tabbed credentials forms plus
   Google. Success always lands the traveler at /account. */
export default function AuthTabs({ initialError = '', initialEmail = '' }) {
  const [tab, setTab] = useState('login');
  /* '', 'login', 'register' or 'google' — only one journey at a time. */
  const [busy, setBusy] = useState('');
  const [banner, setBanner] = useState(() =>
    initialError
      ? {
          tone: initialError === 'EmailNeverificat' ? 'notice' : 'error',
          text: URL_ERRORS[initialError] || GENERIC_URL_ERROR,
          actionType:
            initialError === 'EmailNeverificat'
              ? 'resendVerification'
              : null,
          email: initialEmail || '',
        }
      : null,
  );

  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const [regValues, setRegValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [regErrors, setRegErrors] = useState({});
  const [resendBusy, setResendBusy] = useState(false);

  const switchTab = (next) => {
    setTab(next);
    setBanner(null);
  };

  const setLoginField = (field) => (event) => {
    const { value } = event.target;
    setLoginValues((prev) => ({ ...prev, [field]: value }));
    setLoginErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setRegField = (field) => (event) => {
    const { value } = event.target;
    setRegValues((prev) => ({ ...prev, [field]: value }));
    setRegErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const showVerificationBanner = (email) => {
    setBanner({
      tone: 'notice',
      text: 'Email neverificat — verifică-ți adresa.',
      actionType: 'resendVerification',
      email,
    });
  };

  const handleResendVerification = async (emailOverride) => {
    const email = (emailOverride || loginValues.email || regValues.email)
      .trim()
      .toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setBanner({
        tone: 'error',
        text: 'Scrie un email valid ca să pot retrimite verificarea.',
      });
      return;
    }

    setResendBusy(true);
    try {
      const res = await fetch('/api/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setBanner({
          tone: 'error',
          text:
            data?.error ||
            'Nu am putut retrimite emailul de verificare. Mai încearcă o dată.',
        });
        return;
      }

      setBanner({
        tone: 'notice',
        text:
          data?.message ||
          'Am retrimis emailul de verificare. Verifică inboxul și folderul spam.',
        actionType: null,
      });
    } catch {
      setBanner({
        tone: 'error',
        text: 'Nu am putut retrimite emailul de verificare. Verifică-ți conexiunea.',
      });
    } finally {
      setResendBusy(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = loginValues.email.trim().toLowerCase();
    const password = loginValues.password;

    const errors = {};
    if (!EMAIL_RE.test(email)) {
      errors.email = 'Scrie o adresă de email validă.';
    }
    if (!password) {
      errors.password = 'Scrie parola contului tău.';
    }
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setBanner(null);
    setBusy('login');
    try {
      const callbackUrl = `${window.location.origin}/account`;
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
        redirectTo: callbackUrl,
      });

      if (result?.error) {
        try {
          const statusRes = await fetch('/api/verify/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData?.exists && !statusData?.verified) {
              showVerificationBanner(email);
              setBusy('');
              return;
            }
          }
        } catch {
          // Fall through to the generic credentials banner.
        }

        setBanner({
          tone: 'error',
          text:
            URL_ERRORS[result.error] ||
            URL_ERRORS.CredentialsSignin,
        });
        setBusy('');
        return;
      }

      if (result?.url) {
        const url = new URL(result.url, window.location.origin);
        const error = url.searchParams.get('error');
        const pendingEmail = url.searchParams.get('email') || email;

        if (error) {
          if (error === 'EmailNeverificat') {
            showVerificationBanner(pendingEmail);
          } else {
            setBanner({
              tone: 'error',
              text: URL_ERRORS[error] || GENERIC_URL_ERROR,
            });
          }
          setBusy('');
          return;
        }

        window.location.assign(url.toString());
        setBusy('');
      }
    } catch {
      setBanner({
        tone: 'error',
        text: 'Nu te-am putut conecta. Verifică-ți conexiunea și mai încearcă.',
      });
      setBusy('');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const name = regValues.name.trim();
    const email = regValues.email.trim().toLowerCase();
    const password = regValues.password;

    const errors = {};
    if (name.length < 2) {
      errors.name = 'Numele trebuie să aibă cel puțin 2 caractere.';
    }
    if (!EMAIL_RE.test(email)) {
      errors.email = 'Scrie o adresă de email validă.';
    }
    if (password.length < 8) {
      errors.password = 'Parola trebuie să aibă cel puțin 8 caractere.';
    }
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setBanner(null);
    setBusy('register');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 201) {
        const data = await res.json().catch(() => ({}));
        setTab('login');
        setLoginValues({ email, password: '' });
        setBanner({
          tone: data?.verificationEmailSent ? 'notice' : 'error',
          text: data?.verificationEmailSent
            ? 'Contul a fost creat. Ți-am trimis emailul de verificare.'
            : 'Contul a fost creat, dar emailul de verificare nu a putut fi trimis.',
          actionType: 'resendVerification',
          email,
        });
        setBusy('');
        return;
      }

      if (res.status === 409) {
        setBanner({
          tone: 'error',
          text: 'Există deja un cont cu acest email. Încearcă să te autentifici.',
        });
      } else if (res.status === 503) {
        setBanner({
          tone: 'error',
          text: 'Înregistrarea nu e disponibilă momentan. Mai încearcă în câteva minute.',
        });
      } else {
        setBanner({
          tone: 'error',
          text: 'Nu am putut crea contul. Verifică datele și mai încearcă o dată.',
        });
      }
    } catch {
      setBanner({
        tone: 'error',
        text: 'Nu am putut crea contul. Verifică-ți conexiunea.',
      });
    }
    setBusy('');
  };

  const handleGoogle = async () => {
    setBanner(null);
    setBusy('google');
    try {
      const callbackUrl = `${window.location.origin}/account`;
      const result = await signIn('google', {
        redirect: false,
        callbackUrl,
        redirectTo: callbackUrl,
      });

      if (result?.error) {
        setBanner({
          tone: 'error',
          text:
            result.error === 'Configuration'
              ? 'Autentificarea cu Google nu e configurată corect acum.'
              : 'Nu am putut porni autentificarea cu Google. Mai încearcă o dată.',
        });
        setBusy('');
        return;
      }

      if (result?.url) {
        window.location.assign(result.url);
        return;
      }
    } catch {
      setBanner({
        tone: 'error',
        text: 'Nu am putut porni autentificarea cu Google. Mai încearcă o dată.',
      });
      setBusy('');
    }
  };

  return (
    <div>
      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Autentificare sau înregistrare"
        className="grid grid-cols-2 gap-1 rounded-full border border-border bg-surface p-1"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchTab(id)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {banner && (
        <p
          role="alert"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            banner.tone === 'error'
              ? 'border-rust/30 bg-rust/10 text-rust dark:text-[#e09478]'
              : 'border-primary/30 bg-primary/10 text-primary-strong dark:border-primary-soft/30 dark:bg-primary-soft/10 dark:text-primary-soft'
          }`}
        >
          <span>{banner.text}</span>
          {banner.actionType === 'resendVerification' && (
            <button
              type="button"
              onClick={() => handleResendVerification(banner.email)}
              disabled={resendBusy}
              className="ml-3 inline-flex font-semibold underline-offset-4 transition-colors hover:underline disabled:opacity-60"
            >
              Retrimite emailul de verificare
            </button>
          )}
        </p>
      )}

      {tab === 'login' ? (
        <form onSubmit={handleLogin} noValidate className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nume@exemplu.ro"
            value={loginValues.email}
            onChange={setLoginField('email')}
            error={loginErrors.email}
          />
          <Input
            label="Parolă"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={loginValues.password}
            onChange={setLoginField('password')}
            error={loginErrors.password}
          />
          <Button
            type="submit"
            size="lg"
            loading={busy === 'login'}
            disabled={Boolean(busy) && busy !== 'login'}
            className="w-full"
          >
            Intră în cont
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} noValidate className="mt-6 space-y-4">
          <Input
            label="Nume"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Numele tău"
            hint="Apare lângă recenziile și mesajele tale."
            value={regValues.name}
            onChange={setRegField('name')}
            error={regErrors.name}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nume@exemplu.ro"
            value={regValues.email}
            onChange={setRegField('email')}
            error={regErrors.email}
          />
          <Input
            label="Parolă"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            hint="Minim 8 caractere."
            value={regValues.password}
            onChange={setRegField('password')}
            error={regErrors.password}
          />
          <Button
            type="submit"
            size="lg"
            loading={busy === 'register'}
            disabled={Boolean(busy) && busy !== 'register'}
            className="w-full"
          >
            Creează contul
          </Button>
        </form>
      )}

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-0 flex-1 border-t border-dashed border-border" />
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-text-muted">
          sau
        </span>
        <span className="h-0 flex-1 border-t border-dashed border-border" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="lg"
        loading={busy === 'google'}
        disabled={Boolean(busy) && busy !== 'google'}
        onClick={handleGoogle}
        className="w-full"
      >
        {busy !== 'google' && <GoogleIcon className="size-5" />}
        Continuă cu Google
      </Button>

      <p className="mt-6 text-center text-xs leading-relaxed text-text-muted">
        {tab === 'login' ? (
          <>
            Nu ai cont încă?{' '}
            <button
              type="button"
              onClick={() => switchTab('register')}
              className="font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
            >
              Creează unul
            </button>
          </>
        ) : (
          <>
            Ai deja cont?{' '}
            <button
              type="button"
              onClick={() => switchTab('login')}
              className="font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
            >
              Intră în cont
            </button>
          </>
        )}
      </p>
    </div>
  );
}
