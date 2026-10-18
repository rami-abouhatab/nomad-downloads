/**
 * The product and service pages, in one corporate system (Rami, 2026-10-18: "improve the other pages
 * as you see fit, hero included; I want visual structure and a professional corporate layout"; home
 * and MeridianOS are left as they are).
 *
 * Every page reads down one left edge: a full-width block in the product's own light, the words on
 * the left and the real product on the right (the home hero's shape), a row of facts under it, then
 * sections whose titles sit on that left edge, their content in grey cards on a white page, the
 * platforms as cards, MeridianOS as one contained black card, and the questions in two columns. The
 * service pages (pricing, download, the legal pages) open on a shorter block of the same kind.
 * Everything is painted once; nothing here moves.
 */
import type { ReactNode } from 'react';
import { LinkButton, MeridianMark, More, ProductMark, Sym, type ProductKey } from './kit';
import { PlatformMark, useMyPlatform, type HeroLight, type Item } from './system';

/* ── The opening ────────────────────────────────────────────────────────── */

/** A product page's opening: its block, then the facts. */
export function CorpHero({
  light,
  name,
  title,
  lede,
  actions,
  note,
  visual,
  facts,
}: {
  light: ProductKey;
  name: string;
  title: ReactNode;
  lede: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  visual?: ReactNode;
  facts?: { value: ReactNode; label: ReactNode }[];
}) {
  return (
    <section className="ch" data-light={light} aria-labelledby="ph-title">
      <div className="ch-block">
        <div className="ch-copy">
          <p className="ch-eyebrow">
            <ProductMark product={light} size={28} />
            <span>{name}</span>
          </p>
          <h1 id="ph-title" className="ch-title">
            {title}
          </h1>
          <p className="ch-lede">{lede}</p>
          {actions && <div className="ch-actions">{actions}</div>}
          {note && <p className="ch-note">{note}</p>}
        </div>
        {visual && <div className="ch-visual">{visual}</div>}
      </div>
      {facts && (
        <ul className="ch-facts" aria-label={`${name} at a glance`}>
          {facts.map((f, i) => (
            <li key={i}>
              <span className="ch-fact-value">{f.value}</span>
              <span className="ch-fact-label">{f.label}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** A service page's opening: the same block, shorter, words only. */
export function CorpHeader({
  light = 'neutral',
  eyebrow,
  title,
  lede,
  children,
}: {
  light?: HeroLight;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="ch ch-short" data-light={light} aria-labelledby="ph-title">
      <div className="ch-block">
        <div className="ch-copy">
          {eyebrow && <p className="ch-eyebrow">{eyebrow}</p>}
          <h1 id="ph-title" className="ch-title">
            {title}
          </h1>
          {lede && <p className="ch-lede">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/* ── Sections ───────────────────────────────────────────────────────────── */

/** One section on the page's left edge: a small label, the title, its line, a link to the right. */
export function Section({
  id,
  anchor,
  label,
  title,
  lede,
  aside,
  tone = 'white',
  children,
}: {
  id: string;
  anchor?: string;
  label?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  tone?: 'white' | 'mist';
  children: ReactNode;
}) {
  return (
    <section id={anchor} className={`cs cs-${tone}`} aria-labelledby={id}>
      <div className="sys-wrap">
        <div className="cs-head">
          <div className="cs-head-copy">
            {label && <p className="cs-label">{label}</p>}
            <h2 id={id} className="cs-title">
              {title}
            </h2>
            {lede && <p className="cs-lede">{lede}</p>}
          </div>
          {aside && <div className="cs-aside">{aside}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

type Card = Item & { visual?: ReactNode; action?: ReactNode; n?: number };

/**
 * Cards in a grid, each a grey panel: a symbol (or a number, or an app's icon), the title and its
 * line, and the real capture at the foot when there is one. `cols` is how many across.
 */
export function Cards({ items, cols = 3 }: { items: Card[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={`cc cc-${cols}`}>
      {items.map((it) => (
        <li key={it.title} id={it.id} className={it.visual ? 'cc-card cc-has-visual' : 'cc-card'}>
          <div className="cc-copy">
            {it.n !== undefined ? (
              <span className="cc-n" aria-hidden="true">
                {it.n}
              </span>
            ) : (
              (it.mark ?? (it.icon && <Sym name={it.icon} size={22} className="cc-icon" />))
            )}
            <h3 className="cc-title">
              {it.title}
              {it.tag}
            </h3>
            <p className="cc-body">{it.body}</p>
            {it.action && <div className="cc-action">{it.action}</div>}
          </div>
          {it.visual && <div className="cc-visual">{it.visual}</div>}
        </li>
      ))}
    </ul>
  );
}

/** One big card: a feature with its words on the left and its capture on the right. */
export function Feature({ icon, title, body, action, visual }: { icon?: string; title: string; body: ReactNode; action?: ReactNode; visual: ReactNode }) {
  return (
    <article className="cf">
      <div className="cf-copy">
        {icon && <Sym name={icon} size={22} className="cc-icon" />}
        <h3 className="cc-title">{title}</h3>
        <p className="cc-body">{body}</p>
        {action && <div className="cc-action">{action}</div>}
      </div>
      <div className="cf-visual">{visual}</div>
    </article>
  );
}

/* ── Where to get it ────────────────────────────────────────────────────── */

/**
 * Where to get the app, as cards: the Windows builds (what the download page offers), and the web
 * where the app is on the web too. The visitor's own computer is marked.
 */
export function GetCards({ anchor, web }: { anchor: string; web?: { href: string; host: string } }) {
  const mine = useMyPlatform();
  const cards = [
    { key: 'windows', mark: 'windows' as const, name: 'Windows', note: 'Intel and AMD PCs, Windows 10 and 11', mine: mine?.mark === 'windows' },
    { key: 'arm', mark: 'chip' as const, name: 'Windows on ARM', note: 'Snapdragon PCs, Windows 11', mine: mine?.mark === 'chip' },
  ];
  return (
    <ul className={`cc cc-${web ? 3 : 2} cg`}>
      {cards.map((c) => (
        <li key={c.key} className={c.mine ? 'cc-card cg-mine' : 'cc-card'}>
          <div className="cc-copy">
            <span className="cg-mark">
              <PlatformMark mark={c.mark} />
            </span>
            <h3 className="cc-title">{c.name}</h3>
            <p className="cc-body">{c.note}</p>
            <div className="cc-action">
              <More href={`/download#${anchor}`}>{c.mine ? 'Download for this computer' : 'Download'}</More>
            </div>
          </div>
        </li>
      ))}
      {web && (
        <li className="cc-card">
          <div className="cc-copy">
            <span className="cg-mark">
              <Sym name="globe" size={22} />
            </span>
            <h3 className="cc-title">On the web</h3>
            <p className="cc-body">Any browser, any computer, at {web.host}.</p>
            <div className="cc-action">
              <More href={web.href}>Open {web.host}</More>
            </div>
          </div>
        </li>
      )}
    </ul>
  );
}

/* ── MeridianOS ─────────────────────────────────────────────────────────── */

/** Where the app sits in MeridianOS: one black card on the page's edges, the desktop beside the words. */
export function CorpMeridian({ id, title, body }: { id: string; title: ReactNode; body: ReactNode }) {
  return (
    <section className="cs cs-white cm" aria-labelledby={id}>
      <div className="sys-wrap">
        <div className="cm-card">
          <div className="cm-copy">
            <MeridianMark height={36} className="cm-mark" />
            <p className="cs-label">Included in MeridianOS</p>
            <h2 id={id} className="cs-title">
              {title}
            </h2>
            <p className="cs-lede">{body}</p>
            <div className="cm-actions">
              <LinkButton href="/meridian" variant="primary" size="md">
                Learn more about MeridianOS
              </LinkButton>
            </div>
          </div>
          <div className="cm-visual" aria-hidden="true">
            <img
              src="/assets/hero/laptop-front-1x.webp"
              srcSet="/assets/hero/laptop-front-1x.webp 1006w, /assets/hero/laptop-front.webp 2013w"
              sizes="(max-width: 900px) 88vw, 44vw"
              alt=""
              width={1006}
              height={521}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Legal ──────────────────────────────────────────────────────────────── */

/** A legal page: its contents down the left, the text on the right. */
export function LegalBody({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <section className="cs cs-white" aria-label="Contents">
      <div className="sys-wrap cl">
        <nav className="cl-toc" aria-label="On this page">
          <p className="cs-label">On this page</p>
          <ol>
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="legal cl-text">{children}</article>
      </div>
    </section>
  );
}
