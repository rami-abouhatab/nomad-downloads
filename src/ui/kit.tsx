/**
 * The site's small parts, every one of them a nomad-design object or built
 * from its tokens.
 *
 * LinkButton is nomad-design's Button anatomy on an `<a>`: the same
 * `.nm-btn` class, the same data-size / data-variant rungs, the same CSS from
 * nomad-design/src/controls/button.css. A website's verbs are links (they go
 * to another page), and a `<button>` inside an `<a>` is invalid HTML, so the
 * anchor wears the Button rather than wrapping it. button.css keys hover and
 * press on `:enabled`, which an anchor never matches; site.css restates those
 * two rules for `a.nm-btn` and nothing else. (Hand-off: nomad-design's
 * Button could take `href` and render the anchor itself.)
 */
import type { CSSProperties, ReactNode } from 'react';
import '@nd/controls/button.css';
import { Sym } from '@nd/symbols';
import type { ButtonSize, ButtonVariant } from '@nd/controls/Button';

export type ProductKey = 'ax' | 'polaris' | 'reach' | 'drift' | 'office';

export function LinkButton({
  href,
  children,
  variant = 'secondary',
  size = 'lg',
  hero = false,
  icon,
  className,
  download,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** The touch rung: --h-touch tall, for the one verb a hero or a plan card ends on. */
  hero?: boolean;
  icon?: ReactNode;
  className?: string;
  download?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}) {
  return (
    <a
      {...rest}
      href={href}
      download={download || undefined}
      className={['nm-btn', hero ? 'site-btn-hero' : '', className].filter(Boolean).join(' ')}
      data-size={size}
      data-variant={variant}
    >
      {icon != null && <span className="nm-btn-glyph">{icon}</span>}
      <span className="nm-btn-label">{children}</span>
    </a>
  );
}

/* The camel (Rami, 2026-09-30; made the one mark 2026-10-08): the company's
   only mark, one flat path from design-assets/camel-mark-2026-09-30/
   nomad-camel.svg (= public/brand/nomad-camel.svg). Inline, in currentColor,
   so the bar draws it charcoal on white and the footer pearl on black from
   the same path, with no request and no second file to keep in step. Never
   used for AX: AX is its own product and is set in type until its icon lands. */
const CAMEL_VIEWBOX = '416.9 409.9 2371.5 1398.2';
const CAMEL_PATH =
  'M462.49 1762.50 C466.31 1640.02 530.14 1513.94 575.92 1426.92 C700.37 1190.37 868.89 959.99 1067.65 780.32 C1174.04 684.15 1307.45 593.86 1457.41 632.97 C1672.41 689.04 1731.83 1074.70 1972.28 1053.36 C2107.30 1041.38 2192.37 906.20 2205.10 782.32 C2217.32 663.44 2179.53 538.74 2317.71 477.48 C2424.51 430.14 2551.09 467.24 2650.65 511.83 C2683.26 526.44 2764.85 554.67 2737.15 604.92 C2722.24 631.96 2655.23 625.77 2627.67 630.02 C2563.60 639.89 2503.32 670.39 2460.33 719.57 C2380.37 811.02 2362.91 943.28 2327.53 1055.41 C2257.56 1277.16 2076.95 1653.45 1832.43 1719.85 C1711.76 1752.62 1650.55 1656.50 1592.16 1569.53 C1519.45 1461.24 1433.70 1352.09 1309.27 1301.07 C1065.71 1201.23 775.74 1425.21 618.15 1592.28 C570.76 1642.52 529.07 1702.41 462.49 1762.50 Z';

/** The Nomad camel at a height; its width follows the mark's own proportion. */
export function CamelMark({ height = 18, className }: { height?: number; className?: string }) {
  return (
    <svg
      className={className ? `camel ${className}` : 'camel'}
      viewBox={CAMEL_VIEWBOX}
      height={height}
      width={Math.round((height * 2371.5) / 1398.2)}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d={CAMEL_PATH} />
    </svg>
  );
}

/** Apple's "Learn more ›": a quiet link whose chevron is the affordance. */
export function More({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className ? `more ${className}` : 'more'} href={href}>
      <span>{children}</span>
      <Sym name="caretRight" size={12} variant="Linear" />
    </a>
  );
}

/** A plan line: `**x**` is bold, the rest plain. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p))}</>;
}

export function Checks({ lead, lines }: { lead?: string; lines: string[] }) {
  return (
    <ul className="checks">
      {lead && <li className="checks-lead">{lead}</li>}
      {lines.map((l) => (
        <li key={l}>
          <Sym name="check" size={16} className="checks-mark" />
          <span>
            <Rich text={l} />
          </span>
        </li>
      ))}
    </ul>
  );
}

const ICON: Record<Exclude<ProductKey, 'ax' | 'drift' | 'office'>, string> = {
  polaris: '/assets/icons/polaris.webp',
  reach: '/assets/icons/reach.webp',
};

const OFFICE = ['folio', 'grids', 'expo', 'markup'];

/**
 * A product's mark at a size. AX has no logo yet, so it is drawn
 * typographically on a squircle (`--squircle`, the token's own shape);
 * Drift's plate is a placeholder glyph until its icon lands; Nomad Office is
 * its four app icons. Everything else is the family-v1 artwork.
 */
export function ProductMark({ product, size = 64, label }: { product: ProductKey; size?: number; label?: string }) {
  const style = { '--s': `${size}px` } as CSSProperties;
  const alt = label ?? '';
  if (product === 'ax')
    return (
      <span className="plate plate-ax" style={style} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <span>AX</span>
      </span>
    );
  if (product === 'drift')
    return (
      <span className="plate plate-drift" style={style} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 16c3.2 0 4.6-2 6.3-4.6C12 8.8 13.6 7 17 7h3" />
          <path d="M16.5 3.8 20 7l-3.5 3.2" />
          <path d="M4 20h16" opacity=".55" />
        </svg>
      </span>
    );
  if (product === 'office')
    return (
      <span className="office-stack" style={style} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        {OFFICE.map((n) => (
          <img key={n} src={`/assets/icons/${n}.webp`} alt="" width={Math.round(size * 0.46)} height={Math.round(size * 0.46)} />
        ))}
      </span>
    );
  return <img className="icon" src={ICON[product]} alt={alt} width={size} height={size} style={style} />;
}

export { Sym };
