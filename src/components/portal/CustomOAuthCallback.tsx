import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { $clerkStore } from '@clerk/astro/client';
import './custom-auth.css';

interface Props {
  lang: 'es' | 'en';
  loginPath: string;
  redirectPath: string;
}

const subscribeClerk = (callback: () => void) => $clerkStore.listen(callback);
const getClerk = () => $clerkStore.get();

export default function CustomOAuthCallback({ lang, loginPath, redirectPath }: Props) {
  const clerk = useSyncExternalStore(subscribeClerk, getClerk, getClerk);
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!clerk || started.current) return;
    started.current = true;

    void clerk.handleRedirectCallback({
      signInUrl: loginPath,
      signUpUrl: loginPath,
      signInForceRedirectUrl: redirectPath,
      signInFallbackRedirectUrl: redirectPath,
      signUpForceRedirectUrl: loginPath,
      signUpFallbackRedirectUrl: loginPath,
      firstFactorUrl: loginPath,
      secondFactorUrl: loginPath,
      resetPasswordUrl: loginPath,
      continueSignUpUrl: loginPath,
      transferable: false,
    }).catch(() => setFailed(true));
  }, [clerk, loginPath, redirectPath]);

  return (
    <div className="custom-auth-callback" role="status">
      {!failed ? (
        <>
          <span className="custom-auth-spinner" aria-hidden="true" />
          <h1>{lang === 'en' ? 'Verifying your access' : 'Verificando tu acceso'}</h1>
          <p>{lang === 'en' ? 'This will only take a moment.' : 'Esto tomará solo un momento.'}</p>
        </>
      ) : (
        <>
          <span className="custom-auth-callback-mark" aria-hidden="true">!</span>
          <h1>{lang === 'en' ? 'We could not verify your access' : 'No pudimos verificar tu acceso'}</h1>
          <p>{lang === 'en' ? 'Return to sign in and try again.' : 'Vuelve al acceso e inténtalo de nuevo.'}</p>
          <a href={loginPath}>{lang === 'en' ? 'Back to sign in' : 'Volver al acceso'}</a>
        </>
      )}
    </div>
  );
}
