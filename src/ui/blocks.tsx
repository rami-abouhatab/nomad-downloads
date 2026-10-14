/**
 * The page sections every product page is assembled from: the hero, the
 * product shot, a feature grid, the plan cards, the comparison table and the
 * questions. One implementation each, so /ax and /pricing cannot drift apart.
 */
import type { ReactNode } from 'react';
import { buyFor, useHeld } from './held';
import { ProBadge } from '@nd/controls/ProBadge';
import { AX_PLANS, PRICE_FOOT, type Plan, type ProductId } from '../data';
import { Checks, LinkButton, More, Sym } from './kit';
import { PeriodSwitch, PriceBlock, PriceText, usePeriod } from './period';

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function Hero({
  mark,
  name,
  title,
  lede,
  actions,
  note,
  children,
  align = 'center',
}: {
  mark?: ReactNode;
  name?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
  align?: 'center' | 'start';
}) {
  return (
    <section className={`hero hero-${align}${children ? '' : ' hero-bare'}`}>
      <div className="wrap hero-copy">
        {mark && <div className="hero-mark">{mark}</div>}
        {name && <p className="eyebrow">{name}</p>}
        <h1 className="display">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {actions && <div className="actions">{actions}</div>}
        {note && <p className="small hero-note">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── Product shots ────────────────────────────────────────────────────── */

/**
 * A real screenshot, set in a display the way apple.com sets a screen in its
 * device: a dark bezel, a stand, no decoration behind it. The first shot on a
 * page is the page's largest paint, so it loads eagerly at high priority;
 * every other one is lazy.
 */
export function Display({
  srcSet,
  src,
  width,
  height,
  alt,
  sizes = '(min-width: 1200px) 1100px, 92vw',
  priority = false,
}: {
  srcSet: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className="display-shot">
      <div className="display-bezel">
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width={width}
          height={height}
          alt={alt}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
        />
      </div>
      <div className="display-stand" aria-hidden="true">
        <span className="display-neck" />
        <span className="display-foot" />
      </div>
    </figure>
  );
}

/**
 * A real app window, captured headless from the app's own code on sample
 * data (public/assets/shots/<name>-800|1280|1920.webp), framed the way a
 * window sits on the desk: the window's corner and a cast under it.
 */
export function WindowShot({
  name,
  width = 2560,
  height = 1600,
  alt,
  sizes = '(min-width: 1200px) 1100px, 92vw',
  priority = false,
  caption,
  className,
}: {
  name: string;
  width?: number;
  height?: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
  caption?: ReactNode;
  className?: string;
}) {
  const base = `/assets/shots/${name}`;
  return (
    <figure className={className ? `window-shot ${className}` : 'window-shot'}>
      <img
        src={`${base}-1280.webp`}
        srcSet={`${base}-800.webp 800w, ${base}-1280.webp 1280w, ${base}-1920.webp 1920w`}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export const AX_DESK = {
  src: '/assets/shots/ax-desk-1280.webp',
  srcSet: '/assets/shots/ax-desk-800.webp 800w, /assets/shots/ax-desk-1280.webp 1280w, /assets/shots/ax-desk-1920.webp 1920w',
  width: 1920,
  height: 1080,
  alt: 'A MeridianOS desk: a desert wallpaper, files and apps on the desktop, Polaris Browser open in a window, and the dock along the bottom.',
};

/* ── Section scaffolding ──────────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  lede,
  id,
  center = false,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id: string;
  center?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={center ? 'section-head center reveal' : 'section-head reveal'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="headline">
        {title}
      </h2>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </div>
  );
}

export type Feature = { title: string; body: ReactNode; pro?: boolean; id?: string };

/** A calm grid of one-idea features. `pro` marks the ones that start at Meridian Pro. */
export function Features({ items, cols = 3 }: { items: Feature[]; cols?: 2 | 3 }) {
  return (
    <div className={`features cols-${cols}`}>
      {items.map((f) => (
        <article className="feature reveal" key={f.title} id={f.id}>
          <h3>
            {f.title}
            {f.pro && <ProBadge plan="Pro" size="sm" className="feature-pro" />}
          </h3>
          <p>{f.body}</p>
        </article>
      ))}
    </div>
  );
}

/* ── Plans ─────────────────────────────────────────────────────────────── */

export function PlanCard({ plan, cta }: { plan: Plan; cta?: string }) {
  const period = usePeriod();
  /* The visitor's own plan says so, and its button changes it instead of selling it again (2026-10-14). */
  const buy = buyFor(plan.id, plan.name, period, useHeld(), cta ?? plan.cta);
  return (
    <article className={[plan.lit ? 'plan lit' : 'plan', buy.yours ? 'yours' : ''].filter(Boolean).join(' ')} aria-labelledby={`plan-${plan.id.replace(':', '-')}`}>
      <div className="plan-head">
        <p className="plan-note">{buy.yours ? <span className="plan-yours">Your plan</span> : plan.note}</p>
        <h3 className="plan-name" id={`plan-${plan.id.replace(/^ax:/, 'meridian:').replace(':', '-')}`}>
          {plan.name}
        </h3>
        <p className="plan-pitch">{plan.pitch}</p>
      </div>
      <PriceBlock product={plan.id} />
      <LinkButton href={buy.href} variant={plan.lit && !buy.yours ? 'primary' : 'secondary'} hero className="plan-cta">
        {buy.label}
      </LinkButton>
      <Checks lead={plan.lead} lines={plan.lines} />
    </article>
  );
}

export function AxPlans({ id = 'plans', compareLink = true }: { id?: string; compareLink?: boolean }) {
  return (
    <section className="section band" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <SectionHead
          id={`${id}-title`}
          center
          eyebrow="MeridianOS plans"
          title="Pick the size of your desk."
          lede="Every plan is the full MeridianOS desktop. What changes is how much room you get, how many desks, and the extras."
        >
          <PeriodSwitch />
        </SectionHead>
        <div className="plans">
          {AX_PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
        <p className="plans-foot small">
          {PRICE_FOOT}
          {compareLink && (
            <>
              {' '}
              <More href="/pricing#compare">Compare every feature</More>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

/** A single paid product on its own page: one card beside its pitch. */
export function SinglePlan({
  id,
  eyebrow,
  title,
  lede,
  product,
  name,
  cta,
  lead,
  lines,
  after,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  product: ProductId;
  name: string;
  cta: string;
  lead?: string;
  lines: string[];
  after?: ReactNode;
}) {
  const period = usePeriod();
  const buy = buyFor(product, name, period, useHeld(), cta);
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap split">
        <div className="split-copy reveal">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="headline">
            {title}
          </h2>
          <p className="lede">{lede}</p>
          <PeriodSwitch />
        </div>
        <article className="plan lit reveal" aria-label={name}>
          <div className="plan-head">
            {buy.yours ? (
              <p className="plan-note">
                <span className="plan-yours">Your plan</span>
              </p>
            ) : null}
            <h3 className="plan-name">{name}</h3>
          </div>
          <PriceBlock product={product} />
          <LinkButton href={buy.href} variant={buy.yours ? 'secondary' : 'primary'} hero className="plan-cta">
            {buy.label}
          </LinkButton>
          <Checks lead={lead} lines={lines} />
          {after}
        </article>
      </div>
    </section>
  );
}

/* ── The comparison table ─────────────────────────────────────────────── */

type Cell = string | boolean;
const ROWS: (
  | { group: string }
  | { label: string; cells: [Cell, Cell, Cell] }
)[] = [
  { label: 'Free trial', cells: ['14 days', false, false] },
  { group: 'The desk' },
  { label: 'Storage', cells: ['128 GB', '512 GB', '1 TB'] },
  { label: 'Desks', cells: ['1', '3', '8'] },
  { label: 'Snapshots', cells: ['3', '25', 'Unlimited'] },
  { label: 'File history', cells: ['30 days', '1 year', 'Forever'] },
  { label: 'Desk templates', cells: [false, true, true] },
  { label: 'Guest links', cells: [false, true, true] },
  { label: 'Lock, Convert and Fonts', cells: [false, true, true] },
  { label: 'Priority support', cells: [false, false, true] },
  { group: 'Apps included' },
  { label: 'Nomad Office', cells: [true, true, true] },
  { label: 'Working together live in Folio, Grids and Expo', cells: [false, true, true] },
  { label: 'Polaris Browser', cells: [true, true, true] },
  { label: 'Reach', cells: ['Reach', 'Reach Premium', 'Reach Premium'] },
  { label: 'Meetings', cells: ['40 minutes, 10 people', '4 hours, 50 people', '24 hours, 100 people'] },
  { label: 'Meeting recordings', cells: [false, true, true] },
  { label: 'Drift', cells: ['Drift', 'Drift Premium', 'Drift Premium'] },
  { label: 'Largest file you can send', cells: ['2 GB, for 1 day', '10 GB, for 7 days', '50 GB, for 7 days'] },
  { label: 'Drift app and device pairing', cells: [false, true, true] },
];

function CellView({ v }: { v: Cell }) {
  if (v === true)
    return (
      <>
        <Sym name="check" size={18} className="yes" />
        <span className="vh">Included</span>
      </>
    );
  if (v === false)
    return (
      <>
        <span className="no" aria-hidden="true">
          —
        </span>
        <span className="vh">Not included</span>
      </>
    );
  return <>{v}</>;
}

export function Compare() {
  const period = usePeriod();
  const held = useHeld();
  const ids: ProductId[] = ['ax:starter', 'ax:pro', 'ax:ultra'];
  return (
    <div className="compare-wrap" tabIndex={0} role="region" aria-labelledby="compare-title">
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">
              <span className="vh">Feature</span>
            </th>
            {AX_PLANS.map((p) => (
              <th scope="col" key={p.id}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="compare-price">
            <th scope="row">Price</th>
            {ids.map((id) => (
              <td key={id}>
                <PriceText product={id} />
              </td>
            ))}
          </tr>
          {ROWS.map((r) =>
            'group' in r ? (
              <tr className="group" key={r.group}>
                <th scope="rowgroup" colSpan={4}>
                  {r.group}
                </th>
              </tr>
            ) : (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.cells.map((c, i) => (
                  <td key={i}>
                    <CellView v={c} />
                  </td>
                ))}
              </tr>
            ),
          )}
          <tr className="compare-buy">
            <th scope="row">
              <span className="vh">Buy</span>
            </th>
            {AX_PLANS.map((p) => {
              const buy = buyFor(p.id, p.name, period, held, p.cta);
              return (
                <td key={p.id}>
                  <LinkButton href={buy.href} variant={p.lit && !buy.yours ? 'primary' : 'secondary'} size="md">
                    {buy.label}
                  </LinkButton>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Questions ─────────────────────────────────────────────────────────── */

export function Questions({ id, items }: { id: string; items: { q: string; a: ReactNode }[] }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap narrow">
        <h2 id={`${id}-title`} className="headline reveal">
          Questions.
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

/* ── "Included in MeridianOS" band ─────────────────────────────────────────────── */

export function InAx({ id, title, body }: { id: string; title: string; body: ReactNode }) {
  return (
    <section className="section" aria-labelledby={id}>
      <div className="wrap">
        <div className="in-ax reveal">
          <div className="in-ax-copy">
            <p className="eyebrow">Included in MeridianOS</p>
            <h2 id={id} className="title-lg">
              {title}
            </h2>
            <p className="body">{body}</p>
            <More href="/meridian">Learn more about MeridianOS</More>
          </div>
          <img
            className="in-ax-shot"
            src="/assets/shots/ax-desk-800.webp"
            srcSet="/assets/shots/ax-desk-800.webp 800w, /assets/shots/ax-desk-1280.webp 1280w"
            sizes="(min-width: 900px) 520px, 92vw"
            width={1920}
            height={1080}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
