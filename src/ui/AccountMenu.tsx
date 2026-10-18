/**
 * The header's account control (Rami, 2026-10-11: "like Microsoft: I sign in, I come back to the
 * page I was on with a profile squircle in the header; click it for the account, sign out and the
 * rest"). Since 2026-10-18 it is words: "Log in", then the first name and a chevron.
 *
 * Signed out it is "Log in" (2026-10-18), which goes to account.nomad.ax with this page as `next`, so the
 * person lands back here. Signed in it is the person's squircle; it drops the house menu
 * (nomad-design showMenu, as MeridianOS's bar and account.nomad.ax's header do; Rami, 2026-10-11:
 * "a bit more minimal"): who is signed in as its quiet heading, the account's places as bare rows,
 * then Sign out, which passes through account.nomad.ax/signout and comes back here signed out.
 *
 * Who is signed in comes from `nomad_who`, a cookie account.nomad.ax writes on the registrable
 * domain with only a name and an email (nomad-account session.ts `tellTheSite`). Nothing here can
 * sign anyone in; the session stays on account.nomad.ax. Read after hydration, so the prerendered
 * page and the first client render agree ("Sign in"), and only then swapped.
 */
import { useEffect, useState } from 'react';
import { MenuHost, showMenu, type MenuEntry } from '@nd/Menu';
import { ACCOUNT, SIGN_IN } from '../data';

type Who = { n: string; e: string };

function readWho(): Who | null {
  try {
    const raw = document.cookie.split('; ').find((c) => c.startsWith('nomad_who='));
    if (!raw) return null;
    const who = JSON.parse(decodeURIComponent(raw.slice('nomad_who='.length))) as Partial<Who>;
    return typeof who.e === 'string' && who.e ? { n: typeof who.n === 'string' ? who.n : '', e: who.e } : null;
  } catch {
    return null;
  }
}

const here = () => (typeof location === 'undefined' ? 'https://nomad.ax/' : location.href);
const withNext = (url: string) => `${url}?next=${encodeURIComponent(here())}`;

export function useWho(): Who | null {
  const [who, setWho] = useState<Who | null>(null);
  useEffect(() => {
    setWho(readWho());
    /* Back from account.nomad.ax in another tab, or signed out there: read again on return. */
    const again = () => setWho(readWho());
    window.addEventListener('focus', again);
    return () => window.removeEventListener('focus', again);
  }, []);
  return who;
}

const PLACES: { label: string; path: string }[] = [
  { label: 'Your Nomad account', path: '/' },
  { label: 'Subscriptions', path: '/subscriptions' },
  { label: 'Security', path: '/security' },
  { label: 'Apps & downloads', path: '/apps' },
];

function openMenu(button: HTMLElement, who: Who) {
  const box = button.getBoundingClientRect();
  const items: MenuEntry[] = [
    { label: who.e, heading: true },
    ...PLACES.map((p) => ({ label: p.label, onSelect: () => location.assign(`${ACCOUNT}${p.path}`) })),
    { label: 'Sign out', separatorBefore: true, onSelect: () => location.assign(withNext(`${ACCOUNT}/signout`)) },
    { label: 'Use another account', onSelect: () => location.assign(`${ACCOUNT}/signout?next=${encodeURIComponent(withNext(SIGN_IN))}`) },
  ];
  showMenu(0, box.bottom + 6, items, { alignEnd: box.right, label: 'Your Nomad account' });
}

/** The name the bar shows: the first word of the account's name, or the email's local part. */
const firstName = (who: Who) => (who.n.trim().split(/\s+/)[0] || who.e.split('@')[0]);

export function AccountMenu() {
  const who = useWho();

  if (!who) {
    return (
      <a className="gnav-signin" href={SIGN_IN} onClick={(e) => (e.currentTarget.href = withNext(SIGN_IN))}>
        Log in
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        className="acm-name"
        aria-label={`Your Nomad account, ${who.e}`}
        aria-haspopup="menu"
        onClick={(e) => openMenu(e.currentTarget, who)}
      >
        {firstName(who)}
        <svg viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.6 5 6.6 8 3.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <MenuHost />
    </>
  );
}

