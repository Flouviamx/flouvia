import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { $clerkStore, $userStore } from '@clerk/astro/client';
import './custom-user-menu.css';

interface Props {
  lang: 'es' | 'en';
  product?: 'OS' | 'OPS';
}

const subscribeClerk = (callback: () => void) => $clerkStore.listen(callback);
const getClerk = () => $clerkStore.get();
const subscribeUser = (callback: () => void) => $userStore.listen(callback);
const getUser = () => $userStore.get();

function initials(firstName?: string | null, lastName?: string | null, email?: string) {
  const fromName = [firstName, lastName]
    .filter(Boolean)
    .map((part) => part?.trim().charAt(0).toUpperCase())
    .join('');
  return fromName || email?.charAt(0).toUpperCase() || 'F';
}

export default function CustomUserMenu({ lang, product = 'OS' }: Props) {
  const clerk = useSyncExternalStore(subscribeClerk, getClerk, getClerk);
  const user = useSyncExternalStore(subscribeUser, getUser, getUser);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  if (user === undefined) return <span className="fl-user-placeholder" aria-hidden="true" />;
  if (user === null) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';
  const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
  const label = lang === 'en' ? 'Open account menu' : 'Abrir menú de cuenta';
  const home = lang === 'en' ? '/en/' : '/';
  const accountHome = product === 'OPS' ? '/ops' : (lang === 'en' ? '/en/dashboard' : '/dashboard');

  const signOut = async () => {
    if (!clerk || busy) return;
    setBusy(true);
    try {
      await clerk.signOut({ redirectUrl: home });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fl-user-menu" ref={rootRef}>
      <button
        type="button"
        className="fl-user-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{initials(user.firstName, user.lastName, email)}</span>
      </button>

      {open && (
        <div className="fl-user-popover" role="menu">
          <div className="fl-user-identity">
            <span className="fl-user-name">{name}</span>
            <span className="fl-user-email">{email}</span>
          </div>
          <div className="fl-user-separator" />
          <a role="menuitem" href={accountHome}>
            <span>{product === 'OPS' ? 'Centro de operación' : (lang === 'en' ? 'Dashboard' : 'Panel principal')}</span>
            <span aria-hidden="true">→</span>
          </a>
          <button role="menuitem" type="button" onClick={signOut} disabled={busy}>
            <span>{busy ? (lang === 'en' ? 'Signing out…' : 'Cerrando sesión…') : (lang === 'en' ? 'Sign out' : 'Cerrar sesión')}</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </div>
  );
}
