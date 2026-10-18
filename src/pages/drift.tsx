import { Layout } from '../ui/Layout';
import { LinkButton, More, Sym } from '../ui/kit';
import { PeriodSwitch, PriceText, usePeriod } from '../ui/period';
import { DRIFT_WEB, checkout } from '../data';
import { Actions, MiniCompare, RealShot } from '../ui/system';
import { Cards, CorpHero, CorpMeridian, GetCards, Section } from '../ui/corp';

/* Drift, in the corporate system (Rami, 2026-10-18): the block with the send panel beside the words,
   the facts, the three steps and what each end sees, sending to your own devices, free against
   Premium row by row, where to get it, and its place in MeridianOS. */

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
      <div data-light="drift" className="corp">
        <CorpHero
          light="drift"
          name="Drift"
          title="Send it with a link."
          lede="Drop a file, get a link, send it to anyone. Drift works right in your browser with your free Nomad account, with nothing to install."
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
          facts={[
            { value: 'Free', label: 'With your free Nomad account' },
            { value: '2 GB per link', label: '10 GB with Drift Premium' },
            { value: 'Kept for a day', label: '7 days with Drift Premium' },
            { value: 'Nothing to install', label: 'On either end: it works in the browser' },
          ]}
        />

        <Section id="how-title" anchor="how" label="How it works" title="Three steps." lede="Nothing to install on either end.">
          <Cards
            cols={3}
            items={[
              { n: 1, title: 'Drop the file', body: 'Open drift.nomad.ax and drop in up to 2 GB per link.' },
              { n: 2, title: 'Copy the link', body: 'Drift uploads it and hands you a link. Send it however you like.' },
              { n: 3, title: 'They download it', body: 'Whoever has the link can download the file for a day. Then it is gone.' },
            ]}
          />
        </Section>

        <Section id="more-title" anchor="features" label="Features" title="More than a link.">
          <Cards
            cols={3}
            items={[
              {
                title: 'Everything sent to you, in one place.',
                icon: 'download',
                body: 'Files that come to you land in Received, newest first, with who sent them and when. Download them, save them to a device, or share them on.',
              },
              {
                title: 'A box anyone can drop into.',
                icon: 'driftLink',
                body: 'Open a box and share its link or QR code. People signed in to Nomad drop their files in, and only you see what lands there.',
              },
              {
                title: 'Straight to your phone or PC.',
                icon: 'driftDevice',
                body: 'The Drift app pairs your devices once, then sends to them directly. What is sent to you arrives as a notice, to take or to turn down. On a phone there is nothing to install.',
                action: <More href="/download#drift">Download the Drift app</More>,
              },
            ]}
          />
        </Section>

        <Section
          id="premium-title"
          anchor="premium"
          tone="mist"
          label="Plans"
          title="Drift or Drift Premium."
          lede="Drift is free in your browser. Premium sends bigger files for longer, and straight to your own devices."
          aside={<PeriodSwitch />}
        >
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
        </Section>

        <Section
          id="get-title"
          label="Download"
          title="Get Drift."
          lede="Send from any browser. The Drift app adds sending to your own devices."
          aside={<More href="/download">All downloads</More>}
        >
          <GetCards anchor="drift" web={{ href: DRIFT_WEB, host: 'drift.nomad.ax' }} />
        </Section>

        <CorpMeridian
          id="meridian-title"
          title="Built into your desktop."
          body="Every MeridianOS desktop can send with Drift. Meridian Pro and Ultra include Drift Premium on the desktop, and Meridian Ultra is the only way to send up to 50 GB per link."
                />
      </div>
    </Layout>
  );
}
