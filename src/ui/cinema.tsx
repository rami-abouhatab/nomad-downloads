/**
 * The black zone (Rami, 2026-10-10: "the first few sections must all be black"). Its parts:
 * DarkZone and DarkHead (an eyebrow, a title and a line, set left). The zone ends in a clean cut to
 * the white rest (Rami, 2026-10-11: "not blur or gradient, just cut"). What fills it is TryDesk.tsx, the real desktop to press.
 *
 * DarkHead arrives from the left on a CSS scroll timeline (opacity and transform only); without
 * view timelines, or under reduced motion, it is simply there.
 */
import type { ReactNode } from 'react';

export function DarkZone({ children }: { children: ReactNode }) {
  return <div className="cz">{children}</div>;
}

export function DarkHead({ id, eyebrow, title, lede }: { id: string; eyebrow?: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="cz-head cz-from-left">
      {eyebrow && <p className="cz-eyebrow">{eyebrow}</p>}
      <h2 id={id} className="cz-title">
        {title}
      </h2>
      {lede && <p className="cz-lede">{lede}</p>}
    </div>
  );
}
