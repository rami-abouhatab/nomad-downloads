/**
 * The header's account control (Rami, 2026-10-11: "like Microsoft: I sign in, I come back to the
 * page I was on with a profile squircle in the header; click it for the account, sign out and the
 * rest").
 *
 * Signed out it is "Sign in", which goes to account.nomad.ax with this page as `next`, so the
 * person lands back here. Signed in it is the person's squircle; it opens a Popover (nomad-design,
 * grown from the squircle) with who they are and the places of their account, and Sign out, which
 * passes through account.nomad.ax/signout and comes back here signed out.
 *
 * Who is signed in comes from `nomad_who`, a cookie account.nomad.ax writes on the registrable
 * domain with only a name and an email (nomad-account session.ts `tellTheSite`). Nothing here can
 * sign anyone in; the session stays on account.nomad.ax. Read after hydration, so the prerendered
 * page and the first client render agree ("Sign in"), and only then swapped.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Popover } from '@nd/controls/Popover';
import { ACCOUNT, SIGN_IN, SIGN_UP } from '../data';
import { Sym } from './kit';

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

const PLACES: { label: string; path: string; glyph: Parameters<typeof Sym>[0]['name'] }[] = [
  { label: 'Your Nomad account', path: '/', glyph: 'account' },
  { label: 'Subscriptions', path: '/subscriptions', glyph: 'layers' },
  { label: 'Security', path: '/security', glyph: 'shield' },
  { label: 'Apps & downloads', path: '/apps', glyph: 'download' },
];

export function AccountMenu() {
  const who = useWho();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  if (!who) {
    return (
      <a className="gnav-signin" href={SIGN_IN} onClick={(e) => (e.currentTarget.href = withNext(SIGN_IN))}>
        Sign in
      </a>
    );
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        className="acm-face"
        aria-label={`Your Nomad account, ${who.e}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {initial(who)}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={button} side="bottom" align="end" gap={10} width={300} className="acm" role="dialog">
        {/* Focus lands on who you are (no ring), not on the first place (Popover data-autofocus). */}
        <div className="acm-who" tabIndex={-1} data-autofocus>
          <span className="acm-face acm-face-lg" aria-hidden="true">
            {initial(who)}
          </span>
          <span className="acm-id">
            {who.n ? <span className="acm-name">{who.n}</span> : null}
            <span className="acm-mail">{who.e}</span>
          </span>
        </div>
        <nav className="acm-places" aria-label="Your account">
          {PLACES.map((p) => (
            <a key={p.path} href={`${ACCOUNT}${p.path}`}>
              <Sym name={p.glyph} size={18} />
              <span>{p.label}</span>
            </a>
          ))}
        </nav>
        <div className="acm-foot">
          <a href={`${ACCOUNT}/signout`} onClick={(e) => (e.currentTarget.href = withNext(`${ACCOUNT}/signout`))}>
            Sign out
          </a>
          <a href={SIGN_IN} onClick={(e) => (e.currentTarget.href = `${ACCOUNT}/signout?next=${encodeURIComponent(withNext(SIGN_IN))}`)}>
            Use another account
          </a>
        </div>
      </Popover>
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
