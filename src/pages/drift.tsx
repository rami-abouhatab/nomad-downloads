import { Layout } from '../ui/Layout';
import { Hero, InAx, SectionHead, SinglePlan } from '../ui/blocks';
import { LinkButton, More, ProductMark } from '../ui/kit';
import { DRIFT_WEB } from '../data';

const STEPS = [
  { title: 'Drop the file', body: 'Open drift.nomad.ax and drop in anything up to 2 GB.' },
  { title: 'Copy the link', body: 'Drift uploads it and hands you a link. Send it however you like.' },
  { title: 'They download it', body: 'Whoever has the link can download the file for a day. Then it is gone.' },
];

export default function DriftPage() {
  return (
    <Layout
      page="drift"
      local={{
        name: 'Drift',
        links: [
          { label: 'Overview', href: '/drift', current: true },
          { label: 'Drift Premium', href: '/drift#premium' },
          { label: 'Download', href: '/download#drift' },
        ],
        cta: { label: 'Send a file', href: DRIFT_WEB },
      }}
    >
      <Hero
        mark={<ProductMark product="drift" size={112} />}
        name="Drift"
        title={
          <>
            Send it
            <br />
            with a link.
          </>
        }
        lede="Drop a file, get a link, send it to anyone. Drift works right in your browser, with nothing to install. Files up to 2 GB, links that last a day. Free."
        actions={
          <>
            <LinkButton href={DRIFT_WEB} variant="primary" hero>
              Send a file
            </LinkButton>
            <More href="#premium">Drift Premium</More>
          </>
        }
        note="Opens drift.nomad.ax in your browser."
      />

      <section className="section band" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHead
            id="how-title"
            title={
              <>
                Three steps.
                <br />
                <span className="dim">Nothing to install on either end.</span>
              </>
            }
          />
          {/* A real sequence, so it is numbered. */}
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li className="step reveal" key={s.title}>
                <span className="step-n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SinglePlan
        id="premium"
        eyebrow="Drift Premium"
        title={
          <>
            Straight to your phone.
            <br />
            <span className="dim">Or your other PC.</span>
          </>
        }
        lede="The Drift app pairs your devices once, then sends to them directly. On your phone there is nothing to install: scan a QR code and it opens in the browser."
        product="drift:premium"
        name="Drift Premium"
        cta="Buy Drift Premium"
        lead="Everything in Drift, plus"
        lines={[
          'The Drift app for your PC',
          'Device pairing: send straight to your phone or another PC',
          'Files up to **10 GB**',
          'Links that last **7 days**',
        ]}
        after={<More href="/download#drift">Download the Drift app</More>}
      />

      <InAx
        id="ax-title"
        title="Built into your desk."
        body="Every AX desk can send with Drift. AX Pro and Ultra include Drift Premium and the app, and AX Ultra is the only way to send files up to 50 GB."
      />
    </Layout>
  );
}
