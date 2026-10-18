import { LinkButton, MeridianLockup } from './kit';
import { TryMeridian } from './TryMeridian';
import { PRICES } from '../data';

/** Parked (Rami, 2026-10-12: "remove the Try it right here, or park it so I can get it back"). The
 *  button and the whole Try flow (TryMeridian.tsx) are kept; true brings it back. */
const SHOW_TRY = false;

/**
 * MeridianOS's opening (Rami, 2026-10-10): an arc of sunlight along a planet's edge, and over it
 * the words set the way apple.com sets a product's first screen: the mark and the product's name, small; the
 * line, large, tinted from ivory into the sunset; one plain sentence under it; and a price pill
 * with its Buy, all centred in the sky above the horizon.
 *
 * The arc is the laptop picture's (Rami: "the realistic one is the generated one"): one line of
 * light along a planet-sized curve, a white-hot core inside an orange glow that falls off the same
 * above and below, brightest toward the middle and dimming out through both sides of the screen.
 * Nothing else is in the sky. It comes up in place: the glow, then the core; nothing is drawn.
 *
 * The first law: every layer is a static gradient from the first paint; only opacity and
 * transform move. Reduced motion gets the risen sky and the words, at rest. The sunset is the
 * desktop's own (rgb 249 115 22 → 235 95 16 → 220 80 12).
 */
export function MeridianHero() {
  const starter = PRICES['ax:starter'];
  return (
    <section className="mxh" aria-labelledby="mxh-title">
      <div className="mxh-stage">
        <div className="mxh-sky" aria-hidden="true">
          <div className="mxh-glow" />
          <div className="mxh-near" />
          <div className="mxh-core" />
        </div>

        <div className="mxh-copy">
          <p className="mxh-name mxh-in" style={{ ['--d' as string]: '1500ms' }}>
            <MeridianLockup height={44} />
          </p>
          <h1 id="mxh-title" className="mxh-slogan mxh-in" style={{ ['--d' as string]: '1650ms' }}>
            Access wherever you are.
          </h1>
          <p className="mxh-sub mxh-in" style={{ ['--d' as string]: '1850ms' }}>
            Your whole desktop, on any computer you sign in to.
          </p>
          {SHOW_TRY ? (
            <div className="mxh-try mxh-in" style={{ ['--d' as string]: '2050ms' }}>
              <TryMeridian />
            </div>
          ) : null}
        </div>

        {/* The price stands on the planet, under the arc (Rami, 2026-10-10: "switch places"). */}
        <div className="mxh-offer mxh-in" style={{ ['--d' as string]: '2300ms' }}>
          <p>
            From {starter.monthly}/mo. or {starter.yearly}/yr.
            <br />
            14 days free with Meridian Starter.
          </p>
          <LinkButton href="/meridian#plans" variant="primary" className="mxh-buy">
            Buy
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
