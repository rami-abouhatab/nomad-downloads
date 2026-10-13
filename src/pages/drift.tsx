import { Layout } from '../ui/Layout';
import { LinkButton, More, Sym } from '../ui/kit';
import { PeriodSwitch, PriceText, usePeriod } from '../ui/period';
import { DRIFT_WEB, checkout } from '../data';
import { Actions, Band, BandHead, Chapters, Columns, InMeridian, MiniCompare, PageHero, ProductName, RealShot } from '../ui/system';

/* Drift, shaped like a send page (Rami, 2026-10-10): one centred verb in
   the opening, the three steps, free against Premium row by row, sending to
   your own devices, and its place in MeridianOS. */

function Choose() {
  const period = usePeriod();
  return (
    <Actions>
      <LinkButton href={DRIFT_WEB} variant="secondary" hero>
        Send a file
      </LinkButton>
      <LinkButton href={checkout('drift:premium', period)} variant="primary" hero>
        Buy Drift Premium
      </LinkButton>
    </Actions>
  );
}

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
      <div data-light="drift">
        <PageHero
          light="drift"
          layout="center"
          eyebrow={<ProductName product="drift" name="Drift" />}
          title="Send it with a link."
          lede="Drop a file, get a link, send it to anyone. Drift works right in your browser with your free Nomad account, with nothing to install. Up to 2 GB per link, kept for a day. Free."
          actions={
            <>
              <LinkButton href={DRIFT_WEB} variant="primary" hero>
                Send a file
              </LinkButton>
              <More href="#premium">Drift Premium</More>
            </>
          }
          note="Opens drift.nomad.ax in your browser."
          visual={<RealShot name="drift-send" ratio="16 / 10" eager alt="The Drift send panel: a PDF ready to go to anyone with a link, lasting an hour, and Create link." />}
        />

        <Band label="how-title">
          <BandHead id="how-title" title="Three steps." lede="Nothing to install on either end." />
          <Columns
            numbered
            align="center"
            items={[
              { title: 'Drop the file', body: 'Open drift.nomad.ax and drop in up to 2 GB per link.' },
              { title: 'Copy the link', body: 'Drift uploads it and hands you a link. Send it however you like.' },
              { title: 'They download it', body: 'Whoever has the link can download the file for a day. Then it is gone.' },
            ]}
          />
          <Chapters
            product="drift"
            items={[
              {
                title: 'A link, and a code for a phone.',
                icon: 'driftLink',
                body: 'Drift hands you the link to copy, and a QR code any phone camera can scan to download the file there.',
                visual: <RealShot name="drift-link-ready-4x3" ratio="4 / 3" alt="Drift with the link ready: Copy link, and a QR code to scan with a phone camera." />,
              },
              {
                title: 'The other end is just a page.',
                icon: 'download',
                body: 'Whoever you send it to opens the link in any browser and downloads the file, with nothing to install and no account.',
                visual: <RealShot name="drift-web-4x3" ratio="4 / 3" alt="A Drift link opened in a browser: the file name and size, when the link expires, and Download." />,
              },
            ]}
          />
        </Band>

        <Band id="premium" tone="mist" label="premium-title">
          <BandHead id="premium-title" title="Drift or Drift Premium." lede="Drift is free in your browser. Premium sends bigger files for longer, and straight to your own devices.">
            <PeriodSwitch />
          </BandHead>
          <MiniCompare
            heads={['Drift', 'Drift Premium']}
            rows={[
              { label: 'Price', cells: ['Free', <PriceText key="p" product="drift:premium" />] },
              { label: 'Per link', cells: ['2 GB', '10 GB'] },
              { label: 'Links last', cells: ['1 day', '7 days'] },
              { label: 'Send from your browser', cells: [<Sym key="a" name="check" size={18} />, <Sym key="b" name="check" size={18} />] },
              { label: 'The Drift app for your PC', cells: ['—', <Sym key="c" name="check" size={18} />] },
              { label: 'Send straight to your phone or another PC', cells: ['—', <Sym key="d" name="check" size={18} />] },
            ]}
          />
          <Choose />
        </Band>

        <Band label="pair-title">
          <h2 id="pair-title" className="vh">
            Sending to your own devices
          </h2>
          <Chapters
            product="drift"
            items={[
              {
                title: 'Straight to your phone. Or your other PC.',
                icon: 'driftDevice',
                body: 'The Drift app pairs your devices once, then sends to them directly. What is sent to you arrives as a notice, to take or to turn down. On your phone there is nothing to install: scan a QR code and it opens in the browser.',
                visual: <RealShot name="drift-receive-4x3" ratio="4 / 3" alt="A Drift notice at the top of the screen: someone wants to send you a document, with Decline and Accept." />,
              },
            ]}
          />
          <Actions align="start">
            <More href="/download#drift">Download the Drift app</More>
          </Actions>
        </Band>

        <InMeridian
          id="meridian-title"
          title="Built into your desk."
          body="Every MeridianOS desk can send with Drift. Meridian Pro and Ultra include Drift Premium on the desk, and Meridian Ultra is the only way to send up to 50 GB per link."
        />
      </div>
    </Layout>
  );
}
