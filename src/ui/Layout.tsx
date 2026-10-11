/**
 * The frame every page sits in: the global bar, an optional product bar, the
 * page, and the footer.
 *
 * The global bar is solid white with a hairline under it, the way
 * microsoft.com's is: no backdrop blur, so scrolling never re-rasters glass
 * under it (the first law). On a product page the global bar scrolls away and
 * the product's own bar sticks, as apple.com's local nav does; elsewhere the
 * global bar is the one that sticks. Both are `position: sticky`, so nothing
 * here listens to scroll.
 */
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '@nd/controls/Button';
import { CamelMark, LinkButton, ProductMark, Sym, type ProductKey } from './kit';
import { MANAGE_PLAN, SIGN_IN, SIGN_UP } from '../data';
import { PeriodProvider } from './period';
import { footnotesFor } from '../footnotes';
import { AccountMenu, AccountPanelVerbs } from './AccountMenu';
import type { PageId } from '../pages';

const PRODUCTS: { id: PageId; label: string; href: string }[] = [
  { id: 'ax', label: 'MeridianOS', href: '/meridian' },
  { id: 'polaris', label: 'Polaris Browser', href: '/polaris' },
  { id: 'reach', label: 'Reach', href: '/reach' },
  { id: 'drift', label: 'Drift', href: '/drift' },
  { id: 'citadel', label: 'Citadel', href: '/citadel' },
  { id: 'office', label: 'Nomad Office', href: '/office' },
];
const MORE: { id: PageId; label: string; href: string }[] = [
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
  { id: 'download', label: 'Download', href: '/download' },
];

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Nomad home">
      <CamelMark height={17} />
    </a>
  );
}

/**
 * The phone menu (Rami, 2026-10-11: "a more premium burger and burger page animation, and when I
 * scroll on it the website scrolls"). The burger's two lines turn into a cross; the menu is a white
 * page under the bar, its rows arriving one after another; the page behind it holds still while it
 * is open. Only opacity and transform move, on layers that exist before the tap (the first law), and
 * reduced motion is instant. The panel stays mounted (inert and invisible when closed), so opening
 * mounts nothing.
 */
function GlobalNav({ page, sticky }: { page: PageId; sticky: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const show = (next: boolean) => {
    /* Where the bar ends right now: the menu starts there, even if the bar has partly scrolled away.
       Read once, at the tap, before anything moves. */
    if (next && header.current) {
      const bottom = Math.max(0, Math.round(header.current.getBoundingClientRect().bottom));
      panel.current?.style.setProperty('--gnav-bottom', `${bottom}px`);
    }
    setOpen(next);
  };

  /* While it is open: the page holds still, Escape closes, and a window grown past the phone
     layout closes it. Opening moves focus to the first row. */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.menu = 'open';
    panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const wide = window.matchMedia('(min-width: 1041px)');
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      delete root.dataset.menu;
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const all = [...PRODUCTS, ...MORE];
  return (
    <header ref={header} className={sticky ? 'gnav is-sticky' : 'gnav'} data-open={open || undefined}>
      <div className="wrap gnav-row">
        <Brand />
        <nav className="gnav-links" aria-label="Main">
          <ul>
            {all.map((l) => (
              <li key={l.id}>
                <a href={l.href} aria-current={l.id === page ? 'page' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="gnav-end">
          <AccountMenu />
          <Button
            ref={toggle}
            className="gnav-menu"
            variant="ghost"
            size="lg"
            iconOnly
            aria-label={open ? 'Close menu' : 'Menu'}
            aria-expanded={open}
            aria-controls={panelId}
            icon={
              <span className="burger" aria-hidden="true">
                <span />
                <span />
              </span>
            }
            onClick={() => show(!open)}
          />
        </div>
      </div>
      <div className="gnav-panel" id={panelId} ref={panel} inert={!open} aria-hidden={!open}>
        <nav className="wrap" aria-label="Main, small screens">
          <ul className="gnav-panel-products">
            {PRODUCTS.map((l, i) => (
              <li key={l.id} style={{ '--i': i } as CSSProperties}>
                <a href={l.href} aria-current={l.id === page ? 'page' : undefined} onClick={() => setOpen(false)}>
                  <ProductMark product={l.id as ProductKey} size={30} />
                  <span>{l.label}</span>
                  <Sym name="caretRight" size={14} className="gnav-panel-go" />
                </a>
              </li>
            ))}
          </ul>
          <ul className="gnav-panel-more">
            {MORE.map((l, i) => (
              <li key={l.id} style={{ '--i': PRODUCTS.length + i } as CSSProperties}>
                <a href={l.href} aria-current={l.id === page ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="gnav-panel-end" style={{ '--i': all.length } as CSSProperties}>
            <AccountPanelVerbs
              Link={({ href, primary, children }) => (
                <LinkButton href={href} variant={primary ? 'primary' : undefined} hero>
                  {children}
                </LinkButton>
              )}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}

export type LocalNavProps = {
  name: string;
  links: { label: string; href: string; current?: boolean }[];
  cta?: { label: string; href: string };
  /** 'dark': black all the way down, its line appearing once the page scrolls (MeridianOS). */
  tone?: 'dark';
};

/**
 * The product's own bar: its name, its sections, its one verb. A section link
 * that goes where the verb goes is dropped (Rami, 2026-10-10: a "Download"
 * link beside a "Download" button is the same thing twice).
 *
 * `tone: 'dark'` (Rami, 2026-10-10: "no bottom border; when I scroll the border appears, but
 * keep the header black"): the bar is black throughout and its line shows only once the page has
 * scrolled. An IntersectionObserver on a marker just above the bar decides when, and it sets a
 * class directly: no scroll listener and no React render on the way.
 */
function LocalNav({ name, links, cta, tone }: LocalNavProps) {
  const shown = cta ? links.filter((l) => l.href !== cta.href && l.label !== cta.label) : links;
  const nav = useRef<HTMLElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tone !== 'dark' || !nav.current || !marker.current) return;
    const el = nav.current;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-scrolled', !e.isIntersecting), { threshold: 0 });
    io.observe(marker.current);
    return () => io.disconnect();
  }, [tone]);
  return (
    <>
      {tone === 'dark' && <div className="lnav-marker" ref={marker} aria-hidden="true" />}
      <nav className={tone === 'dark' ? 'lnav lnav-dark' : 'lnav'} aria-label={name} ref={nav}>
        <div className="wrap lnav-row">
          <span className="lnav-name">{name}</span>
          <ul className="lnav-links">
            {shown.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={l.current ? 'page' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {cta && (
            <LinkButton href={cta.href} variant="primary" size="sm" className="lnav-cta">
              {cta.label}
            </LinkButton>
          )}
        </div>
      </nav>
    </>
  );
}

/* The privacy promise at the foot of every page. Only what is true today. */
const PRIVACY = [
  { title: 'Safe in your account.', body: 'Your files live in your account, on protected, encrypted servers.' },
  { title: 'No ads.', body: 'None on the desk or in the apps. Polaris blocks trackers too.' },
  { title: 'Never sold.', body: 'Your data is never sold, rented or shared with advertisers.' },
  { title: 'Never trains AI.', body: 'Your files, mail and chats are never used to train AI.' },
  { title: 'Locked by you.', body: 'Citadel encrypts any file or folder behind your own PIN.' },
]

type Col = { title: string; links: { label: string; href: string }[] };

/* Five short columns, apple.com's footer in size and voice: small type, muted,
   nothing a person has to read twice. Pricing and Download sit with the
   products they buy and install. */
const FOOT: Col[] = [
  {
    title: 'Products',
    links: [
      ...PRODUCTS.map(({ label, href }) => ({ label, href })),
      { label: 'Pricing', href: '/pricing' },
      { label: 'Download', href: '/download' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', href: SIGN_IN },
      { label: 'Create a Nomad account', href: SIGN_UP },
      { label: 'Manage your plan', href: MANAGE_PLAN },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Questions about MeridianOS', href: '/meridian#questions' },
      { label: 'Compare MeridianOS plans', href: '/pricing#compare' },
      { label: 'Which download is mine?', href: '/download#which' },
      { label: 'Your data', href: '/privacy#what-you-can-do' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Nomad', href: '/' },
      { label: 'One Nomad account', href: '/#questions' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

/* Rami, 2026-10-08: the footer is a black card inset from the window by a
   small gap, the page around it pure white. The light inside it is a static
   radial gradient falling from the card's top edge, and the faint "Nomad" low
   in the card is type at a few percent: nothing animates and nothing filters,
   so scrolling past it costs the compositor nothing (the first law). */
function Footer({ page }: { page: PageId }) {
  const notes = footnotesFor(page);
  return (
    <footer className="foot">
      {/* apple.com's fine print: its own block above the links, centred, plain paragraphs, each
          with its number (this page's notes, then the ones that hold everywhere) */}
      <div className="foot-fine">
        {notes.map((n, i) => (
          <p key={n}>
            {i + 1}. {n}
          </p>
        ))}
      </div>

      {/* Then the privacy promise, on every page (Rami, 2026-10-11), the way apple.com ends a page:
          small type on the white page, straight on the links. Only what is true today. */}
      <section className="fine" aria-labelledby="privacy-title">
        <div className="fine-inner">
          <div className="fine-head">
            <h2 id="privacy-title">Private by design.</h2>
            <p>Nomad is paid for by its plans, never by your data.</p>
          </div>
          <ul className="fine-points">
            {PRIVACY.map((x) => (
              <li key={x.title}>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="foot-card">
        <div className="wrap foot-inner">
          <a className="foot-brand" href="/" aria-label="Nomad home">
            <CamelMark height={17} />
            <span>Nomad</span>
          </a>
          <div className="foot-cols">
            {FOOT.map((c) => (
              <section key={c.title} className="foot-col" aria-label={c.title}>
                <h2>{c.title}</h2>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="foot-base">
            <p className="foot-legal">
              <span>Copyright © 2026 Origins. Nomad is a product of Origins. All rights reserved.</span>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </p>
            {/* The country/language slot. One locale today, so it is a statement,
                not a control: a picker with one row is a menu row that does
                nothing (hig.md tripwire 10). */}
            <p className="foot-locale">
              <Sym name="globe" size={14} />
              <span>English (United States)</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ page, local, children }: { page: PageId; local?: LocalNavProps; children: ReactNode }) {
  return (
    <PeriodProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <GlobalNav page={page} sticky={!local} />
      {local && <LocalNav {...local} />}
      <main id="main">{children}</main>
      <Footer page={page} />
    </PeriodProvider>
  );
}
