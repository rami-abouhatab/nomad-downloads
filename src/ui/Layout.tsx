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
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '@nd/controls/Button';
import { CamelMark, LinkButton, Sym } from './kit';
import { MANAGE_PLAN, SIGN_IN, SIGN_UP } from '../data';
import { PeriodProvider } from './period';
import type { PageId } from '../pages';

const PRODUCTS: { id: PageId; label: string; href: string }[] = [
  { id: 'ax', label: 'AX', href: '/ax' },
  { id: 'polaris', label: 'Polaris Browser', href: '/polaris' },
  { id: 'reach', label: 'Reach', href: '/reach' },
  { id: 'drift', label: 'Drift', href: '/drift' },
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
      <span>Nomad</span>
    </a>
  );
}

function GlobalNav({ page, sticky }: { page: PageId; sticky: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* Escape closes and hands focus back to the button; opening moves focus to
     the first link so a keyboard lands inside what it opened. */
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const all = [...PRODUCTS, ...MORE];
  return (
    <header className={sticky ? 'gnav is-sticky' : 'gnav'} data-open={open || undefined}>
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
          <a className="gnav-signin" href={SIGN_IN}>
            Sign in
          </a>
          <Button
            ref={toggle}
            className="gnav-menu"
            variant="ghost"
            size="lg"
            iconOnly
            aria-label={open ? 'Close menu' : 'Menu'}
            aria-expanded={open}
            aria-controls={panelId}
            icon={<Sym name={open ? 'close' : 'menu'} size={20} />}
            onClick={() => setOpen((o) => !o)}
          />
        </div>
      </div>
      <div className="gnav-panel" id={panelId} ref={panel} hidden={!open}>
        <nav className="wrap" aria-label="Main, small screens">
          <ul>
            {all.map((l) => (
              <li key={l.id}>
                <a href={l.href} aria-current={l.id === page ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="gnav-panel-end">
            <LinkButton href={SIGN_IN} variant="primary" hero>
              Sign in
            </LinkButton>
            <LinkButton href={SIGN_UP} hero>
              Create an account
            </LinkButton>
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
};

/** The product's own bar: its name, its sections, its one verb. */
function LocalNav({ name, links, cta }: LocalNavProps) {
  return (
    <nav className="lnav" aria-label={name}>
      <div className="wrap lnav-row">
        <span className="lnav-name">{name}</span>
        <ul className="lnav-links">
          {links.map((l) => (
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
  );
}

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
      { label: 'Questions about AX', href: '/ax#questions' },
      { label: 'Compare AX plans', href: '/pricing#compare' },
      { label: 'Which download is mine?', href: '/download#which' },
      { label: 'Your data', href: '/privacy#what-you-can-do' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Nomad', href: '/#about' },
      { label: 'One Nomad account', href: '/#account' },
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
function Footer() {
  return (
    <footer className="foot">
      <div className="foot-card">
        <div className="wrap foot-inner">
          <a className="foot-brand" href="/" aria-label="Nomad home">
            <CamelMark height={14} />
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
          <p className="foot-note">
            Prices in US dollars. AX, Reach, Drift and Nomad Office need a Nomad account; Polaris Browser works without one. AX
            Starter's 14-day trial is for new accounts.
          </p>
          <div className="foot-base">
            <p className="foot-legal">
              <span>Copyright © 2026 Nomad. All rights reserved.</span>
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
        <p className="foot-word" aria-hidden="true">
          Nomad
        </p>
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
      <Footer />
    </PeriodProvider>
  );
}
