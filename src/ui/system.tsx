/**
 * The page system (Rami, 2026-10-10: "lock the theme and style and rules, and
 * do it for every page"). Every page is assembled from these parts, all in the
 * home page's language: white ground, one rhythm between sections, the same
 * side margins as the footer, one title scale, nomad-design's buttons, and at
 * most one black moment per page. The rules are written out in
 * docs/site-style.md; the CSS is the "Page system" block at the end of
 * site.css.
 *
 * What changes from page to page is the order and the kind of sections, the
 * way apple.com and microsoft.com give every product page its own shape
 * (Safari runs in chapters, Outlook in tabs, iCloud+ in plans, Apple's
 * privacy page in dark tiles), and the hero's light, which takes each
 * product's own colours.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { checkout, type ProductId } from '../data';
import { Checks, LinkButton, MeridianMark, More, ProductMark, Rich, Sym, type ProductKey } from './kit';
import { PeriodSwitch, PriceBlock, usePeriod } from './period';

/* ── The hero ───────────────────────────────────────────────────────────── */

/** Which light a hero takes: a product's colours, or the neutral grey. */
export type HeroLight = ProductKey | 'neutral';

/**
 * The page's opening, in its product's light: the colours of the product's
 * own icon as a soft static wash that turns into the white page before the
 * next section, so there is no edge (MeridianOS, whose colour is Obsidian,
 * opens dark and ends square, as apple.com's macOS page does). `split` sets
 * the copy left and the picture right, microsoft.com's product hero;
 * `center` stacks them, apple.com's.
 */
export function PageHero({
  light,
  layout = 'split',
  eyebrow,
  title,
  lede,
  actions,
  note,
  visual,
}: {
  light: HeroLight;
  layout?: 'split' | 'center';
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <section className={`ph ph-${layout}`} data-light={light} aria-labelledby="ph-title">
      <div className="ph-inner">
        <div className="ph-copy">
          {eyebrow && <p className="ph-eyebrow">{eyebrow}</p>}
          <h1 id="ph-title" className="ph-title">
            {title}
          </h1>
          {lede && <p className="ph-lede">{lede}</p>}
          {actions && <div className="ph-actions">{actions}</div>}
          {note && <p className="ph-note">{note}</p>}
        </div>
        {visual && <div className="ph-visual">{visual}</div>}
      </div>
    </section>
  );
}

/**
 * A real capture of the product (Rami, 2026-10-11: "wire your screenshots"), never a mockup: the
 * shell's own windows, captured on the sunset desktop (design-assets/meridian-shots-2026-10-10).
 * `name` is a file family in /assets/shots/products: <name>-{1200,2000}.webp.
 */
/* Bumped when the captures are re-shot (2026-10-18: each app alone, from its own dev build;
   design-assets/app-shots-2026-10-18). */
const SHOTS_V = '20261018';

export function RealShot({ name, alt, ratio = '16 / 9', eager = false }: { name: string; alt: string; ratio?: string; eager?: boolean }) {
  return (
    <img
      className="sys-real-shot"
      src={`/assets/shots/products/${name}-2000.webp?v=${SHOTS_V}`}
      srcSet={`/assets/shots/products/${name}-1200.webp?v=${SHOTS_V} 1200w, /assets/shots/products/${name}-2000.webp?v=${SHOTS_V} 2000w`}
      sizes="(min-width: 1400px) 1300px, 94vw"
      alt={alt}
      style={{ aspectRatio: ratio }}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** The product's name with its icon, the line over a hero's title. */
export function ProductName({ product, name }: { product: ProductKey; name: string }) {
  return (
    <>
      <ProductMark product={product} size={28} />
      <span>{name}</span>
    </>
  );
}

/**
 * Where a product's mockup goes (Rami, 2026-10-10: "we will create mockups
 * for each"). Until it exists, the product's icon stands in at size in its
 * own light. Pass `src` once the mockup is made and the slot shows it.
 */
export function Mockup({
  product,
  src,
  srcSet,
  width,
  height,
  alt = '',
  priority = true,
}: {
  product: ProductKey;
  src?: string;
  srcSet?: string;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
}) {
  if (src)
    return (
      <img
        className="mockup-img"
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1040px) 52vw, 92vw"
        width={width}
        height={height}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    );
  return (
    <div className="mockup-slot" data-mockup={product}>
      <ProductMark product={product} size={220} />
    </div>
  );
}

/* ── Sections ───────────────────────────────────────────────────────────── */

/**
 * One section of a page. `white` is the page itself; `mist` is apple.com's
 * light grey band, for the one section a page wants set apart; `black` is the
 * page's one dark moment. Every section sits in the same rhythm and the same
 * side margins as the home page.
 */
export function Band({
  id,
  tone = 'white',
  label,
  className,
  children,
}: {
  id?: string;
  tone?: 'white' | 'mist' | 'black';
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`band-${tone}${className ? ` ${className}` : ''}`} aria-labelledby={label}>
      <div className="sys-wrap">{children}</div>
    </section>
  );
}

/** A section's title and line, centred (the default) or set left. */
export function BandHead({
  id,
  title,
  lede,
  eyebrow,
  align = 'center',
  children,
}: {
  id: string;
  title: ReactNode;
  lede?: ReactNode;
  eyebrow?: ReactNode;
  align?: 'center' | 'start';
  children?: ReactNode;
}) {
  return (
    <div className={`sys-head sys-head-${align}`}>
      {eyebrow && <p className="sys-eyebrow">{eyebrow}</p>}
      <h2 id={id} className="sys-title">
        {title}
      </h2>
      {lede && <p className="sys-lede">{lede}</p>}
      {children}
    </div>
  );
}

/** One sentence, set large: apple.com's statement between chapters. */
export function Statement({ id, children, sub }: { id: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="sys-statement">
      <h2 id={id}>{children}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/** One idea: a title and a line, with a symbol (`icon`) or a picture (`mark`, an app icon) over it. */
export type Item = { title: string; body: ReactNode; icon?: string; mark?: ReactNode; tag?: ReactNode; id?: string };

/**
 * Columns of short ideas, each under a hairline (the home page's three
 * steps). `numbered` turns them into a real sequence; `icon` sets a symbol
 * over each; `align` centres them (the default, Rami 2026-10-18: "also these
 * centered") or sets them left.
 */
export function Columns({
  items,
  cols = 3,
  numbered = false,
  align = 'center',
}: {
  items: Item[];
  cols?: 2 | 3 | 4;
  numbered?: boolean;
  align?: 'center' | 'start';
}) {
  const Tag = numbered ? 'ol' : 'ul';
  return (
    <Tag className={`sys-cols cols-${cols} sys-cols-${align}`}>
      {items.map((it, i) => (
        <li key={it.title} id={it.id}>
          {numbered ? (
            <span className="sys-n" aria-hidden="true">
              {i + 1}
            </span>
          ) : (
            (it.mark ?? (it.icon && <Sym name={it.icon} size={32} />))
          )}
          <h3>
            {it.title}
            {it.tag}
          </h3>
          <p>{it.body}</p>
        </li>
      ))}
    </Tag>
  );
}

/**
 * Chapters: a feature per row, its words on one side and its picture on the
 * other, sides alternating (apple.com's Safari). The picture is a mockup
 * slot until the mockups are made. Two or more are set as a grid instead (Rami,
 * 2026-10-18: "they're all over the place"): two by two, or three across for
 * three or more (a short last row centred under the rest), each picture over its words, all on the page's one set of edges. A
 * chapter on its own keeps the row.
 */
export function Chapters({
  product,
  items,
  grid = items.length > 1,
}: {
  product: ProductKey;
  items: (Item & { visual?: ReactNode; action?: ReactNode })[];
  grid?: boolean;
}) {
  return (
    <div className={grid ? `sys-chapters sys-chapters-grid${items.length === 3 || items.length > 4 ? ' sys-chapters-3' : ''}` : 'sys-chapters'}>
      {items.map((it, i) => (
        <article className={i % 2 && !grid ? 'sys-chapter flip' : 'sys-chapter'} key={it.title} id={it.id}>
          <div className="sys-chapter-copy">
            {/* The icon beside its title (Rami, 2026-10-11: "icon next to each title"). */}
            <div className="sys-title-row">
              {it.icon && <Sym name={it.icon} size={34} />}
              <h3>{it.title}</h3>
            </div>
            <p>{it.body}</p>
            {it.action && <div className="sys-chapter-action">{it.action}</div>}
          </div>
          <div className="sys-chapter-visual">{it.visual ?? <div className="sys-shot" data-mockup={`${product}:${i + 1}`} aria-hidden="true"><ProductMark product={product} size={112} /></div>}</div>
        </article>
      ))}
    </div>
  );
}

/**
 * Tabs: one feature at a time, chosen from a row of names, its picture
 * beside it (microsoft.com's Outlook and Microsoft 365). The panel is
 * swapped in place, with a short opacity settle on the compositor; nothing
 * moves or resizes. Every panel is in the prerendered page, so the content
 * is there before the script.
 */
export function Tabs({ product, items }: { product: ProductKey; items: (Item & { visual?: ReactNode })[] }) {
  const [on, setOn] = useState(0);
  return (
    <div className="sys-tabs">
      <div className="sys-tablist" role="tablist" aria-label="Features">
        {items.map((it, i) => (
          <button
            key={it.title}
            type="button"
            role="tab"
            id={`tab-${i}`}
            aria-selected={on === i}
            aria-controls={`panel-${i}`}
            tabIndex={on === i ? 0 : -1}
            className="sys-tab"
            onClick={() => setOn(i)}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
              const n = (on + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length;
              setOn(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
            }}
          >
            {it.icon && <Sym name={it.icon} size={20} />}
            <span>{it.title}</span>
          </button>
        ))}
      </div>
      {items.map((it, i) => (
        <div
          key={it.title}
          role="tabpanel"
          id={`panel-${i}`}
          aria-labelledby={`tab-${i}`}
          className="sys-panel"
          hidden={on !== i}
        >
          <div className="sys-panel-copy">
            <div className="sys-title-row">
              {it.icon && <Sym name={it.icon} size={34} />}
              <h3>{it.title}</h3>
            </div>
            <p>{it.body}</p>
          </div>
          <div className="sys-panel-visual">{it.visual ?? <div className="sys-shot" data-mockup={`${product}:${i + 1}`} aria-hidden="true"><ProductMark product={product} size={112} /></div>}</div>
        </div>
      ))}
    </div>
  );
}

/** Dark tiles, each one idea (apple.com's privacy page). */
export function Tiles({ items }: { items: Item[] }) {
  return (
    <ul className="sys-tiles">
      {items.map((it) => (
        <li key={it.title}>
          {it.icon && <Sym name={it.icon} size={36} />}
          <h3>
            {it.title}
            {it.tag}
          </h3>
          <p>{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/* ── Plans ──────────────────────────────────────────────────────────────── */

type Side = {
  name: string;
  price: ProductId | 'free';
  pitch: string;
  lead?: string;
  lines: string[];
  action: { label: string; href?: string; buy?: ProductId };
};

/**
 * The free app and its paid plan side by side (microsoft.com's plan cards):
 * the paid side is the lit one.
 */
export function PlanPair({ free, paid, foot }: { free: Side; paid: Side; foot?: ReactNode }) {
  const period = usePeriod();
  const card = (s: Side, lit: boolean) => (
    <article className={lit ? 'sys-plan lit' : 'sys-plan'} key={s.name} aria-label={s.name}>
      <h3>{s.name}</h3>
      <p className="sys-plan-pitch">{s.pitch}</p>
      {s.price === 'free' ? <p className="sys-plan-free">Free</p> : <PriceBlock product={s.price} />}
      <LinkButton
        href={s.action.buy ? checkout(s.action.buy, period) : (s.action.href ?? '#')}
        variant={lit ? 'primary' : 'secondary'}
        hero
        className="sys-plan-cta"
      >
        {s.action.label}
      </LinkButton>
      <Checks lead={s.lead} lines={s.lines} />
    </article>
  );
  return (
    <>
      <div className="sys-period">
        <PeriodSwitch />
      </div>
      <div className="sys-plans">
        {card(free, false)}
        {card(paid, true)}
      </div>
      {foot && <p className="sys-foot">{foot}</p>}
    </>
  );
}

/** One paid product with no free side (Nomad Office): its card alone, centred. */
export function PlanSolo({
  product,
  name,
  pitch,
  cta,
  lines,
  after,
}: {
  product: ProductId;
  name: string;
  pitch: string;
  cta: string;
  lines: string[];
  after?: ReactNode;
}) {
  const period = usePeriod();
  return (
    <>
      <div className="sys-period">
        <PeriodSwitch />
      </div>
      <div className="sys-plans sys-plans-solo">
        <article className="sys-plan lit" aria-label={name}>
          <h3>{name}</h3>
          <p className="sys-plan-pitch">{pitch}</p>
          <PriceBlock product={product} />
          <LinkButton href={checkout(product, period)} variant="primary" hero className="sys-plan-cta">
            {cta}
          </LinkButton>
          <Checks lines={lines} />
          {after}
        </article>
      </div>
    </>
  );
}

/** Pictures in a row, each with a title and a line under it (MeridianOS's places). */
export function Gallery({ items }: { items: { title: string; body: ReactNode; src: string; width: number; height: number }[] }) {
  return (
    <ul className="sys-gallery">
      {items.map((it) => (
        <li key={it.title}>
          <img src={it.src} alt="" width={it.width} height={it.height} loading="lazy" decoding="async" />
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** A short side-by-side of two plans, row by row (Drift's free and Premium). */
export function MiniCompare({
  heads,
  rows,
}: {
  heads: [string, string];
  rows: { label: string; cells: [ReactNode, ReactNode] }[];
}) {
  return (
    <div className="sys-mini" role="region" aria-label={`${heads[0]} and ${heads[1]}`} tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col">
              <span className="vh">Feature</span>
            </th>
            <th scope="col">{heads[0]}</th>
            <th scope="col">{heads[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.cells.map((c, i) => (
                <td key={i}>{c === true ? <Sym name="check" size={18} /> : c === false ? <span aria-label="Not included">—</span> : c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── The black moment: MeridianOS ───────────────────────────────────────── */

/**
 * Every app page's one black section: where the app sits inside MeridianOS,
 * with Meridian's mark, the way the home page's MeridianOS section is set.
 */
export function InMeridian({ id, title, body }: { id: string; title: ReactNode; body: ReactNode }) {
  return (
    <section className="band-black sys-meridian" aria-labelledby={id}>
      <div className="sys-wrap">
        <MeridianMark height={56} className="sys-meridian-mark" />
        <p className="sys-eyebrow">Included in MeridianOS</p>
        <h2 id={id} className="sys-title">
          {title}
        </h2>
        <p className="sys-lede">{body}</p>
        <div className="sys-actions">
          <More href="/meridian">Learn more about MeridianOS</More>
        </div>
      </div>
    </section>
  );
}

/* ── Questions ──────────────────────────────────────────────────────────── */

/**
 * The questions, as on the home page: the disclosure list full width. `black`
 * is apple.com's "Questions? Answers." band, for a page whose dark moment is
 * its questions.
 */
export function FAQ({
  id = 'questions',
  title = 'Frequently asked questions.',
  items,
  tone = 'white',
}: {
  id?: string;
  title?: ReactNode;
  items: { q: string; a: ReactNode }[];
  tone?: 'white' | 'black';
}) {
  return (
    <section id={id} className={`band-${tone} sys-faq`} aria-labelledby={`${id}-title`}>
      <div className="sys-wrap">
        <h2 id={`${id}-title`} className="sys-title sys-faq-title">
          {title}
        </h2>
        <div className="qa">
          {items.map((it) => (
            <details key={it.q}>
              <summary>
                <span>{it.q}</span>
                <Sym name="caretDown" size={16} className="qa-caret" />
              </summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Where it runs ──────────────────────────────────────────────────────── */

/* Each platform with its mark in one colour: Apple's apple and Windows' four
   panes (both the simple-icons CC0 paths), and a processor chip for Windows
   on ARM. */
export const PLATFORMS: { name: string; note: string; mark: 'apple' | 'windows' | 'chip'; href: string }[] = [
  { name: 'Mac', note: 'macOS', mark: 'apple', href: '/download' },
  { name: 'Windows', note: 'Intel and AMD PCs, Windows 10 and 11', mark: 'windows', href: '/download' },
  { name: 'Windows on ARM', note: 'Snapdragon PCs, Windows 11', mark: 'chip', href: '/download' },
];

export function PlatformMark({ mark }: { mark: 'apple' | 'windows' | 'chip' }) {
  if (mark === 'apple')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        />
      </svg>
    );
  if (mark === 'windows')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9 1h1.5v3h3V1H15v3h1.5A3.5 3.5 0 0 1 20 7.5V9h3v1.5h-3v3h3V15h-3v1.5a3.5 3.5 0 0 1-3.5 3.5H15v3h-1.5v-3h-3v3H9v-3H7.5A3.5 3.5 0 0 1 4 16.5V15H1v-1.5h3v-3H1V9h3V7.5A3.5 3.5 0 0 1 7.5 4H9zm-1.5 5A1.5 1.5 0 0 0 6 7.5v9A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 16.5 6zm1.5 3h6v6H9z"
      />
    </svg>
  );
}

/**
 * Which of the three this computer is, once the page is live. A Mac is told
 * by its user agent; Windows on ARM only by userAgentData's architecture,
 * since the classic string reports ARM64 as x64 on purpose. Unknown stays
 * unknown.
 */
export function useMyPlatform() {
  const [mine, setMine] = useState<(typeof PLATFORMS)[number] | null>(null);
  useEffect(() => {
    let live = true;
    const ua = navigator.userAgent;
    if (/Macintosh|Mac OS X/.test(ua)) {
      setMine(PLATFORMS[0]);
      return;
    }
    if (!/Windows/.test(ua)) return;
    const d = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } }).userAgentData;
    if (!d?.getHighEntropyValues) {
      setMine(PLATFORMS[1]);
      return;
    }
    d.getHighEntropyValues(['architecture'])
      .then((v) => live && setMine(v.architecture === 'arm' ? PLATFORMS[2] : PLATFORMS[1]))
      .catch(() => live && setMine(PLATFORMS[1]));
    return () => {
      live = false;
    };
  }, []);
  return mine;
}

/**
 * The three platforms as three ruled columns, each with its own download;
 * the visitor's own reads "for this computer" and its rule darkens.
 * `anchor` sends each link to that product's row on the download page.
 */
export function Platforms({ anchor }: { anchor?: string }) {
  const mine = useMyPlatform();
  return (
    <ul className="where-list sys-platforms" aria-label="Available on">
      {PLATFORMS.map((x) => (
        <li key={x.name} className={mine === x ? 'is-mine' : undefined}>
          <PlatformMark mark={x.mark} />
          <div className="where-name">
            <h3>{x.name}</h3>
            <p>{x.note}</p>
          </div>
          <More href={anchor ? `/download#${anchor}` : x.href}>{mine === x ? 'Download for this computer' : 'Download'}</More>
        </li>
      ))}
    </ul>
  );
}

/* ── Small parts ────────────────────────────────────────────────────────── */

/** A row of actions, centred under a section's title. */
export function Actions({ children, align = 'center' }: { children: ReactNode; align?: 'center' | 'start' }) {
  return <div className={`sys-actions sys-actions-${align}`}>{children}</div>;
}

/** Text with `**bold**` runs, for a line of copy. */
export function Line({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <span style={style}>
      <Rich text={text} />
    </span>
  );
}
