import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from 'react';
import {
  $clerkStore,
  $signInStore,
  $signUpStore,
} from '@clerk/astro/client';
import type {
  SignInResource,
  SignInSecondFactor,
  SignUpResource,
} from '@clerk/shared/types';
import './custom-auth.css';

type Lang = 'es' | 'en';
type Step =
  | 'credentials'
  | 'mfa'
  | 'reset-code'
  | 'new-password'
  | 'invitation'
  | 'processing';

interface Props {
  lang: Lang;
  product?: 'OS' | 'OPS';
  switchAccount?: boolean;
  redirectPath: string;
  callbackPath: string;
}

const subscribeClerk = (callback: () => void) => $clerkStore.listen(callback);
const getClerk = () => $clerkStore.get();
const subscribeSignIn = (callback: () => void) => $signInStore.listen(callback);
const getSignIn = () => $signInStore.get();
const subscribeSignUp = (callback: () => void) => $signUpStore.listen(callback);
const getSignUp = () => $signUpStore.get();

const copy = {
  es: {
    loading: 'Preparando acceso seguro…',
    title: 'Accede a tu entorno',
    subtitle: 'Usa el correo asociado a tu invitación.',
    google: 'Continuar con Google',
    divider: 'o usa tu contraseña',
    email: 'Correo electrónico',
    password: 'Contraseña',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    submit: 'Entrar al portal',
    forgot: 'Olvidé mi contraseña',
    requiredEmail: 'Escribe tu correo para continuar.',
    genericError: 'No pudimos completar el acceso. Inténtalo de nuevo.',
    invalidCredentials: 'El correo o la contraseña no son correctos.',
    locked: 'Este acceso está bloqueado temporalmente. Inténtalo más tarde.',
    invitedOnly: 'Este portal solo admite cuentas invitadas por Flouvia.',
    mfaTitle: 'Confirma que eres tú',
    mfaSubtitle: 'Ingresa el código de verificación para terminar.',
    code: 'Código de verificación',
    verify: 'Verificar acceso',
    methodTotp: 'App de autenticación',
    methodEmail: 'Correo electrónico',
    methodPhone: 'Mensaje de texto',
    methodBackup: 'Código de respaldo',
    chooseMethod: 'Usar otro método',
    resetTitle: 'Recupera tu acceso',
    resetSubtitle: 'Enviaremos un código al correo indicado.',
    sendCode: 'Enviar código',
    resetCodeTitle: 'Revisa tu correo',
    resetCodeSubtitle: 'Ingresa el código que acabamos de enviarte.',
    continue: 'Continuar',
    newPasswordTitle: 'Crea una contraseña nueva',
    newPasswordSubtitle: 'Usa una contraseña segura que no hayas usado antes.',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña',
    passwordMismatch: 'Las contraseñas no coinciden.',
    savePassword: 'Guardar y entrar',
    back: 'Volver al acceso',
    invitationTitle: 'Activa tu acceso',
    invitationSubtitle: 'Completa tus datos para aceptar la invitación de Flouvia.',
    firstName: 'Nombre',
    lastName: 'Apellido',
    acceptInvitation: 'Aceptar invitación',
    invalidInvitation: 'La invitación no es válida o ya expiró.',
  },
  en: {
    loading: 'Preparing secure access…',
    title: 'Access your environment',
    subtitle: 'Use the email associated with your invitation.',
    google: 'Continue with Google',
    divider: 'or use your password',
    email: 'Email address',
    password: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    submit: 'Enter the portal',
    forgot: 'Forgot my password',
    requiredEmail: 'Enter your email to continue.',
    genericError: 'We could not complete sign-in. Please try again.',
    invalidCredentials: 'The email or password is incorrect.',
    locked: 'This access is temporarily locked. Try again later.',
    invitedOnly: 'This portal only accepts accounts invited by Flouvia.',
    mfaTitle: 'Confirm it is you',
    mfaSubtitle: 'Enter your verification code to finish signing in.',
    code: 'Verification code',
    verify: 'Verify access',
    methodTotp: 'Authenticator app',
    methodEmail: 'Email',
    methodPhone: 'Text message',
    methodBackup: 'Backup code',
    chooseMethod: 'Use another method',
    resetTitle: 'Recover your access',
    resetSubtitle: 'We will send a code to the email you enter.',
    sendCode: 'Send code',
    resetCodeTitle: 'Check your email',
    resetCodeSubtitle: 'Enter the code we just sent you.',
    continue: 'Continue',
    newPasswordTitle: 'Create a new password',
    newPasswordSubtitle: 'Use a secure password you have not used before.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordMismatch: 'The passwords do not match.',
    savePassword: 'Save and sign in',
    back: 'Back to sign in',
    invitationTitle: 'Activate your access',
    invitationSubtitle: 'Complete your details to accept Flouvia’s invitation.',
    firstName: 'First name',
    lastName: 'Last name',
    acceptInvitation: 'Accept invitation',
    invalidInvitation: 'This invitation is invalid or has expired.',
  },
} as const;

function errorMessage(error: unknown, lang: Lang) {
  const fallback = copy[lang].genericError;
  if (!error || typeof error !== 'object') return fallback;

  const errors = (error as {
    errors?: Array<{ code?: string; message?: string; longMessage?: string }>;
  }).errors;
  const first = errors?.[0];
  if (!first) return fallback;

  const code = first.code ?? '';
  if (
    code.includes('identifier_not_found') ||
    code.includes('password_incorrect') ||
    code.includes('invalid_password')
  ) {
    return copy[lang].invalidCredentials;
  }
  if (code.includes('locked') || code.includes('too_many')) {
    return copy[lang].locked;
  }
  if (code.includes('ticket') || code.includes('invitation')) {
    return copy[lang].invalidInvitation;
  }

  return first.longMessage || first.message || fallback;
}

function factorLabel(factor: SignInSecondFactor, lang: Lang) {
  switch (factor.strategy) {
    case 'totp':
      return copy[lang].methodTotp;
    case 'email_code':
      return `${copy[lang].methodEmail}${'safeIdentifier' in factor ? ` · ${factor.safeIdentifier}` : ''}`;
    case 'phone_code':
      return `${copy[lang].methodPhone}${'safeIdentifier' in factor ? ` · ${factor.safeIdentifier}` : ''}`;
    case 'backup_code':
      return copy[lang].methodBackup;
    default:
      return factor.strategy;
  }
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  lang,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  lang: Lang;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  const c = copy[lang];

  return (
    <div className="custom-auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="custom-auth-password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="custom-auth-password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? c.hidePassword : c.showPassword}
          title={visible ? c.hidePassword : c.showPassword}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.7 10.7 0 0112 4c5.4 0 9 5.1 9 5.1a15 15 0 01-2.3 2.7M6.6 6.6C4.3 8.1 3 10 3 10s3.6 5 9 5a9.8 9.8 0 003.4-.6" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10s3.6-5 9-5 9 5 9 5-3.6 5-9 5-9-5-9-5z" /><circle cx="12" cy="10" r="2.5" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CustomSignIn({
  lang,
  product = 'OS',
  switchAccount = false,
  redirectPath,
  callbackPath,
}: Props) {
  const clerk = useSyncExternalStore(subscribeClerk, getClerk, getClerk);
  const signIn = useSyncExternalStore(subscribeSignIn, getSignIn, getSignIn);
  const signUp = useSyncExternalStore(subscribeSignUp, getSignUp, getSignUp);
  const baseCopy = copy[lang];
  const c = product === 'OPS'
    ? {
        ...baseCopy,
        title: lang === 'en' ? 'Enter the operations center' : 'Entra al centro de operación',
        subtitle: lang === 'en' ? 'Use your verified operator account.' : 'Usa tu cuenta verificada de operador.',
        google: lang === 'en' ? 'Continue with Flouvia Google' : 'Continuar con Google de Flouvia',
        submit: lang === 'en' ? 'Enter Ops' : 'Entrar a Ops',
        invitedOnly: lang === 'en' ? 'Flouvia team and authorized owner only.' : 'Solo equipo Flouvia y propietario autorizado.',
      }
    : baseCopy;

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [secondFactors, setSecondFactors] = useState<SignInSecondFactor[]>([]);
  const [activeFactor, setActiveFactor] = useState<SignInSecondFactor | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const ticketHandled = useRef(false);
  const restoredAttempt = useRef(false);
  const switchHandled = useRef(false);

  useEffect(() => {
    if (!switchAccount || !clerk || switchHandled.current) return;
    switchHandled.current = true;
    setStep('processing');
    void clerk.signOut({ redirectUrl: '/login?account=choose' }).catch(() => {
      setError(c.genericError);
      setStep('credentials');
    });
  }, [clerk, switchAccount]);

  const finish = async (resource: SignInResource | SignUpResource) => {
    if (!clerk || !resource.createdSessionId) {
      throw new Error('Missing session after authentication');
    }

    await clerk.setActive({
      session: resource.createdSessionId,
      navigate: ({ session, decorateUrl }) => {
        const destination = session.currentTask
          ? (lang === 'en' ? '/en/login' : '/login')
          : redirectPath;
        window.location.assign(decorateUrl(destination));
      },
    });
  };

  const prepareSecondFactor = async (
    factor: SignInSecondFactor,
    resource: SignInResource = signIn as SignInResource,
  ) => {
    if (!resource) return;

    if (factor.strategy === 'email_code') {
      await resource.prepareSecondFactor({
        strategy: 'email_code',
        emailAddressId: factor.emailAddressId,
      });
    } else if (factor.strategy === 'phone_code') {
      await resource.prepareSecondFactor({
        strategy: 'phone_code',
        phoneNumberId: factor.phoneNumberId,
      });
    }

    setActiveFactor(factor);
    setCode('');
    setStep('mfa');
  };

  const beginSecondFactor = async (resource: SignInResource) => {
    const supportedStrategies = new Set(['totp', 'email_code', 'phone_code', 'backup_code']);
    const factors = (resource.supportedSecondFactors ?? []).filter((factor) =>
      supportedStrategies.has(factor.strategy),
    );
    if (!factors.length) throw new Error('No supported second factor');

    const ordered = [...factors].sort((left, right) => {
      const order = ['totp', 'email_code', 'phone_code', 'backup_code'];
      return order.indexOf(left.strategy) - order.indexOf(right.strategy);
    });
    setSecondFactors(ordered);
    await prepareSecondFactor(ordered[0], resource);
  };

  const routeSignInResult = async (result: SignInResource) => {
    if (result.status === 'complete') {
      await finish(result);
      return;
    }
    if (result.status === 'needs_second_factor' || result.status === 'needs_client_trust') {
      await beginSecondFactor(result);
      return;
    }
    if (result.status === 'needs_new_password') {
      setStep('new-password');
      return;
    }
    throw new Error(`Unsupported sign-in state: ${result.status ?? 'unknown'}`);
  };

  useEffect(() => {
    if (!clerk || !signIn || restoredAttempt.current) return;
    restoredAttempt.current = true;

    if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
      void beginSecondFactor(signIn).catch(() => {
        setError(c.genericError);
        setStep('credentials');
      });
    } else if (signIn.status === 'needs_new_password') {
      setStep('new-password');
    }
  }, [clerk, signIn]);

  useEffect(() => {
    if (!clerk || !signIn || !signUp || ticketHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('__clerk_ticket');
    if (!ticket) return;

    ticketHandled.current = true;
    const status = params.get('__clerk_status');
    if (status === 'complete') {
      window.location.assign(redirectPath);
      return;
    }
    if (status !== 'sign_in') {
      setStep('invitation');
      return;
    }

    setStep('processing');
    setBusy(true);
    void signIn
      .create({ strategy: 'ticket', ticket })
      .then(routeSignInResult)
      .catch((cause) => {
        setError(errorMessage(cause, lang));
        setStep('credentials');
      })
      .finally(() => setBusy(false));
  }, [clerk, signIn, signUp]);

  const submitCredentials = async (event: FormEvent) => {
    event.preventDefault();
    if (!signIn || !clerk) return;
    setBusy(true);
    setError('');

    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      await routeSignInResult(result);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const startGoogle = async () => {
    if (!signIn) return;
    setBusy(true);
    setError('');
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: callbackPath,
        redirectUrlComplete: redirectPath,
        continueSignIn: true,
        continueSignUp: product === 'OPS',
        // Ops often lives alongside personal Google sessions. Always show the
        // account chooser so a rejected account never traps the operator in a
        // silent OAuth loop.
        oidcPrompt: product === 'OPS' ? 'select_account' : undefined,
      });
    } catch (cause) {
      setError(errorMessage(cause, lang));
      setBusy(false);
    }
  };

  const startReset = async () => {
    if (!signIn) return;
    if (!email.trim()) {
      setError(c.requiredEmail);
      return;
    }

    setBusy(true);
    setError('');
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setResetMode(true);
      setStep('reset-code');
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const verifyResetCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!signIn) return;
    setBusy(true);
    setError('');
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
      });
      if (result.status === 'needs_new_password') setStep('new-password');
      else await routeSignInResult(result);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const submitNewPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!signIn) return;
    if (newPassword !== confirmPassword) {
      setError(c.passwordMismatch);
      return;
    }

    setBusy(true);
    setError('');
    try {
      const result = await signIn.resetPassword({ password: newPassword });
      await routeSignInResult(result);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const submitMfa = async (event: FormEvent) => {
    event.preventDefault();
    if (!signIn || !activeFactor) return;
    setBusy(true);
    setError('');
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: activeFactor.strategy,
        code: code.trim(),
      });
      await routeSignInResult(result);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const submitInvitation = async (event: FormEvent) => {
    event.preventDefault();
    if (!signUp || !clerk) return;
    const ticket = new URLSearchParams(window.location.search).get('__clerk_ticket');
    if (!ticket) {
      setError(c.invalidInvitation);
      return;
    }

    setBusy(true);
    setError('');
    try {
      const result = await signUp.create({
        strategy: 'ticket',
        ticket,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });
      if (result.status !== 'complete') {
        throw new Error(`Incomplete invitation: ${result.missingFields.join(', ')}`);
      }
      await finish(result);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const chooseSecondFactor = async (factor: SignInSecondFactor) => {
    if (!signIn || busy || factor.strategy === activeFactor?.strategy) return;
    setBusy(true);
    setError('');
    try {
      await prepareSecondFactor(factor, signIn);
    } catch (cause) {
      setError(errorMessage(cause, lang));
    } finally {
      setBusy(false);
    }
  };

  const backToCredentials = () => {
    clerk?.client.resetSignIn();
    setStep('credentials');
    setResetMode(false);
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setSecondFactors([]);
    setActiveFactor(null);
    setError('');
  };

  if (!clerk || !signIn || !signUp || step === 'processing') {
    return (
      <div className="custom-auth-loading" role="status">
        <span className="custom-auth-spinner" aria-hidden="true" />
        <span>{c.loading}</span>
      </div>
    );
  }

  return (
    <div className="custom-auth" data-step={step}>
      {step === 'credentials' && (
        <>
          <div className="custom-auth-heading">
            <h2>{c.title}</h2>
            <p>{c.subtitle}</p>
          </div>

          <button type="button" className="custom-auth-google" onClick={startGoogle} disabled={busy}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.7 4.7 0 01-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9z" />
              <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.8c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.9A10 10 0 0012 22z" />
              <path fill="#FBBC05" d="M6.4 13.7A6 6 0 016.1 12c0-.6.1-1.2.3-1.7V7.4H3A10 10 0 002 12c0 1.7.4 3.2 1 4.6l3.4-2.9z" />
              <path fill="#EA4335" d="M12 6.2c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0012 2a10 10 0 00-9 5.4l3.4 2.9C7.2 8 9.4 6.2 12 6.2z" />
            </svg>
            <span>{c.google}</span>
          </button>

          {product === 'OS' && (
            <>
              <div className="custom-auth-divider"><span>{c.divider}</span></div>

              <form onSubmit={submitCredentials} className="custom-auth-form">
                <div className="custom-auth-field">
                  <label htmlFor="auth-email">{c.email}</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>
                <PasswordField
                  id="auth-password"
                  label={c.password}
                  value={password}
                  onChange={setPassword}
                  lang={lang}
                  autoComplete="current-password"
                />

                {error && <p className="custom-auth-error" role="alert">{error}</p>}

                <div className="custom-auth-actions-row">
                  <button type="button" className="custom-auth-link" onClick={startReset} disabled={busy}>
                    {c.forgot}
                  </button>
                </div>

                <button type="submit" className="custom-auth-primary" disabled={busy}>
                  <span>{busy ? c.loading : c.submit}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </>
          )}
          {product === 'OPS' && error && <p className="custom-auth-error custom-auth-google-error" role="alert">{error}</p>}
          <p className="custom-auth-note">{c.invitedOnly}</p>
        </>
      )}

      {step === 'mfa' && activeFactor && (
        <>
          <div className="custom-auth-heading">
            <h2>{c.mfaTitle}</h2>
            <p>{c.mfaSubtitle}</p>
          </div>
          <form onSubmit={submitMfa} className="custom-auth-form">
            <div className="custom-auth-field">
              <label htmlFor="auth-mfa-code">{factorLabel(activeFactor, lang)}</label>
              <input
                id="auth-mfa-code"
                className="custom-auth-code"
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="one-time-code"
                inputMode={activeFactor.strategy === 'backup_code' ? 'text' : 'numeric'}
                required
                autoFocus
              />
            </div>
            {error && <p className="custom-auth-error" role="alert">{error}</p>}
            <button type="submit" className="custom-auth-primary" disabled={busy}>
              <span>{busy ? c.loading : c.verify}</span><span aria-hidden="true">→</span>
            </button>
          </form>
          {secondFactors.length > 1 && (
            <div className="custom-auth-methods">
              <span>{c.chooseMethod}</span>
              <div>
                {secondFactors.map((factor) => (
                  <button
                    type="button"
                    key={`${factor.strategy}-${'safeIdentifier' in factor ? factor.safeIdentifier : ''}`}
                    className={factor.strategy === activeFactor.strategy ? 'is-active' : ''}
                    onClick={() => chooseSecondFactor(factor)}
                    disabled={busy}
                  >
                    {factorLabel(factor, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button type="button" className="custom-auth-back" onClick={backToCredentials}>{c.back}</button>
        </>
      )}

      {step === 'reset-code' && (
        <>
          <div className="custom-auth-heading">
            <h2>{c.resetCodeTitle}</h2>
            <p>{c.resetCodeSubtitle}</p>
          </div>
          <form onSubmit={verifyResetCode} className="custom-auth-form">
            <div className="custom-auth-field">
              <label htmlFor="auth-reset-code">{c.code}</label>
              <input
                id="auth-reset-code"
                className="custom-auth-code"
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                required
                autoFocus
              />
            </div>
            {error && <p className="custom-auth-error" role="alert">{error}</p>}
            <button type="submit" className="custom-auth-primary" disabled={busy}>
              <span>{busy ? c.loading : c.continue}</span><span aria-hidden="true">→</span>
            </button>
          </form>
          <button type="button" className="custom-auth-back" onClick={backToCredentials}>{c.back}</button>
        </>
      )}

      {step === 'new-password' && (
        <>
          <div className="custom-auth-heading">
            <h2>{c.newPasswordTitle}</h2>
            <p>{c.newPasswordSubtitle}</p>
          </div>
          <form onSubmit={submitNewPassword} className="custom-auth-form">
            <PasswordField
              id="auth-new-password"
              label={c.newPassword}
              value={newPassword}
              onChange={setNewPassword}
              lang={lang}
              autoComplete="new-password"
            />
            <PasswordField
              id="auth-confirm-password"
              label={c.confirmPassword}
              value={confirmPassword}
              onChange={setConfirmPassword}
              lang={lang}
              autoComplete="new-password"
            />
            {error && <p className="custom-auth-error" role="alert">{error}</p>}
            <button type="submit" className="custom-auth-primary" disabled={busy}>
              <span>{busy ? c.loading : c.savePassword}</span><span aria-hidden="true">→</span>
            </button>
          </form>
          {!resetMode && <button type="button" className="custom-auth-back" onClick={backToCredentials}>{c.back}</button>}
        </>
      )}

      {step === 'invitation' && (
        <>
          <div className="custom-auth-heading">
            <h2>{c.invitationTitle}</h2>
            <p>{c.invitationSubtitle}</p>
          </div>
          <form onSubmit={submitInvitation} className="custom-auth-form">
            <div className="custom-auth-name-grid">
              <div className="custom-auth-field">
                <label htmlFor="auth-first-name">{c.firstName}</label>
                <input id="auth-first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required />
              </div>
              <div className="custom-auth-field">
                <label htmlFor="auth-last-name">{c.lastName}</label>
                <input id="auth-last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" required />
              </div>
            </div>
            <PasswordField
              id="auth-invitation-password"
              label={c.password}
              value={password}
              onChange={setPassword}
              lang={lang}
              autoComplete="new-password"
            />
            {error && <p className="custom-auth-error" role="alert">{error}</p>}
            <button type="submit" className="custom-auth-primary" disabled={busy}>
              <span>{busy ? c.loading : c.acceptInvitation}</span><span aria-hidden="true">→</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
