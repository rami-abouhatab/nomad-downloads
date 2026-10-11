/**
 * The header's account control (Rami, 2026-10-11: "like Microsoft: I sign in, I come back to the
 * page I was on with a profile squircle in the header; click it for the account, sign out and the
 * rest").
 *
 * Signed out it is "Sign in", which goes to account.nomad.ax with this page as `next`, so the
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
import { useEffect, useState, type ReactElement } from 'react';
import { MenuHost, showMenu, type MenuEntry } from '@nd/Menu';
import { ACCOUNT, SIGN_IN, SIGN_UP } from '../data';

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
const initial = (w: Who) => (w.n || w.e).trim().charAt(0).toUpperCase();

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

export function AccountMenu() {
  const who = useWho();

  if (!who) {
    return (
      <a className="gnav-signin" href={SIGN_IN} onClick={(e) => (e.currentTarget.href = withNext(SIGN_IN))}>
        Sign in
      </a>
    );
  }

  return (
    <>
      <button type="button" className="acm-face" aria-label={`Your Nomad account, ${who.e}`} aria-haspopup="menu" onClick={(e) => openMenu(e.currentTarget, who)}>
        {initial(who)}
      </button>
      <MenuHost />
    </>
  );
}

/** The small-screen panel's two verbs, signed in or out. */
export function AccountPanelVerbs({ Link }: { Link: (p: { href: string; primary?: boolean; children: string }) => ReactElement }) {
  const who = useWho();
  if (!who) {
    return (
      <>
        <Link href={SIGN_IN} primary>
          Sign in
        </Link>
        <Link href={SIGN_UP}>Create an account</Link>
      </>
    );
  }
  return (
    <>
      <Link href={`${ACCOUNT}/`} primary>
        Your Nomad account
      </Link>
      <Link href={`${ACCOUNT}/signout`}>Sign out</Link>
    </>
  );
}
