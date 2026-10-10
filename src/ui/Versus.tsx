/**
 * Meridian against the computer you already have (Rami, 2026-10-11: "Meridian vs other OS, say
 * Windows and macOS, or if you think better not to say, don't").
 *
 * Not named. Meridian runs on the computer you have, on top of its own system, so "Meridian vs
 * Windows" would be untrue, and a named rival invites the trademark and comparative-advertising
 * questions a product page does not need. The honest comparison is the same computer without and
 * with Meridian, in the situations where the difference is felt.
 *
 * Every Meridian line is something it does today (files and settings in the account, spaces with
 * their own apps, files and sign-ins, the suite included in every plan).
 *
 * The first law: static rows; each arrives on its own view timeline (opacity and transform).
 */
import type { ReactNode } from 'react';
import { MeridianLockup } from './kit';

export type VersusRow = { when: string; usual: ReactNode; meridian: ReactNode };

export function Versus({ id, title, lede, rows }: { id: string; title: ReactNode; lede: ReactNode; rows: VersusRow[] }) {
  return (
    <section className="vs" aria-labelledby={id}>
      {/* the site's own section heading (system.tsx BandHead), centred, its ink flipped for black */}
      <div className="sys-head sys-head-center">
        <h2 id={id} className="sys-title">
          {title}
        </h2>
        <p className="sys-lede">{lede}</p>
      </div>
      <div className="vs-table" role="table" aria-label="Other systems, and Meridian">
        <div className="vs-row vs-cols" role="row">
          <span role="columnheader" className="vs-when" />
          <span role="columnheader" className="vs-usual-h">
            Other systems
          </span>
          <span role="columnheader" className="vs-meridian-h">
            <MeridianLockup height={28} />
          </span>
        </div>
        {rows.map((r) => (
          <div className="vs-row" role="row" key={r.when}>
            <span role="rowheader" className="vs-when">
              {r.when}
            </span>
            <span role="cell" className="vs-usual">
              {r.usual}
            </span>
            <span role="cell" className="vs-meridian">
              {r.meridian}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
