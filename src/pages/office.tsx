import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { PriceText, usePeriod } from '../ui/period';
import { checkout } from '../data';
import { FAQ, PlanSolo, RealShot } from '../ui/system';
import { Cards, CorpHero, CorpMeridian, GetCards, Section } from '../ui/corp';

/* Nomad Office, in the corporate system (Rami, 2026-10-18): the block with Folio beside the words,
   the facts, the four apps as cards, three of them at work, the one price, where to get it, its
   place in MeridianOS, and the questions. */

const APPS = [
  { id: 'folio', name: 'Folio', body: 'Letters, reports, notes and everything in between, on a page that stays out of your way.' },
  { id: 'grids', name: 'Grids', body: 'Budgets, lists and the numbers behind them, with the formulas you already know.' },
  { id: 'expo', name: 'Expo', body: 'Slides for the meeting, the class or the pitch, built quickly and shown full screen.' },
  { id: 'markup', name: 'Markup', body: 'Read, highlight, comment on and sign PDFs, right on your own computer.' },
];

const QA = [
  { q: 'Is there a free version?', a: 'No. Nomad Office is a paid suite: $59 a year or $5.99 a month for all four apps.' },
  { q: 'Where are my files saved?', a: 'On your own computer, in Documents › Nomad Office, where you can find them.' },
  {
    q: 'Do I need it if I have MeridianOS?',
    a: 'Not on your desktop: every MeridianOS plan includes Nomad Office inside MeridianOS. Buy it on its own to use it outside MeridianOS. The two are separate subscriptions, and your files are the same in both.',
  },
];

function Buy() {
  const period = usePeriod();
  return (
    <LinkButton href={checkout('office', period)} variant="primary" hero>
      Buy Nomad Office
    </LinkButton>
  );
}

export default function OfficePage() {
  return (
    <Layout
      page="office"
      local={{
        name: 'Nomad Office',
        links: [
          { label: 'Overview', href: '/office', current: true },
          { label: 'Buy', href: '/office#buy' },
          { label: 'Download', href: '/download#office' },
        ],
        cta: { label: 'Buy', href: '/office#buy' },
      }}
    >
      <div data-light="office" className="corp">
        <CorpHero
          light="office"
          name="Nomad Office"
          title="Four apps. One quiet office."
          lede="Folio, Grids, Expo and Markup: documents, spreadsheets, presentations and PDFs, installed on your own computer and saved where you can find them."
          actions={
            <>
              <Buy />
              <More href="/download#office">Download</More>
            </>
          }
          note="Already in every MeridianOS plan."
          visual={<RealShot name="office-folio" ratio="16 / 10" eager alt="Folio with a design brief open: a title, headings, a bulleted list and paragraphs on a white page." />}
          facts={[
            { value: 'Four apps', label: 'Folio, Grids, Expo and Markup' },
            { value: <PriceText product="office" />, label: 'One price for all four' },
            { value: 'On your computer', label: 'Saved in Documents › Nomad Office' },
            { value: 'In MeridianOS', label: 'Included in every MeridianOS plan' },
          ]}
        />

        <Section id="apps-title" anchor="apps" label="The suite" title="Everything an office does.">
          <Cards
            cols={4}
            items={APPS.map((a) => ({
              id: a.id,
              title: a.name,
              body: a.body,
              mark: <img className="icon sys-app" src={`/assets/icons/${a.id}.webp`} alt="" width={56} height={56} loading="lazy" />,
            }))}
          />
        </Section>

        <Section id="grids-title" anchor="at-work" label="At work" title="The apps at work.">
          <Cards
            cols={3}
            items={[
              {
                title: 'The numbers, and the formulas behind them.',
                icon: 'grid',
                body: 'Grids works the way the spreadsheets you know do, with the formulas you already use, on your own computer.',
              },
              {
                title: 'Slides for the room.',
                icon: 'display',
                body: 'Expo builds the deck one slide at a time, and lays them all out side by side when you want to see the whole story.',
              },
              {
                title: 'Mark up any PDF.',
                icon: 'edit',
                body: 'Markup reads, highlights and comments on PDFs, right on your own computer.',
              },
            ]}
          />
        </Section>

        <Section id="buy-title" anchor="buy" tone="mist" label="Pricing" title="One price, all four apps." lede="One subscription for Folio, Grids, Expo and Markup. Your files stay on your computer.">
          <PlanSolo
            product="office"
            name="Nomad Office"
            pitch="Documents, spreadsheets, presentations and PDFs."
            cta="Buy Nomad Office"
            lines={['Folio, Grids, Expo and Markup', 'Installed on your own computer', 'Signs in with your Nomad account']}
            after={<More href="/download#office">Download Nomad Office</More>}
          />
        </Section>

        <Section id="get-title" label="Download" title="Get Nomad Office." lede="One installer puts Folio, Grids, Expo and Markup on your computer." aside={<More href="/download">All downloads</More>}>
          <GetCards anchor="folio" />
        </Section>

        <CorpMeridian
          id="meridian-title"
          title="Already in every MeridianOS plan."
          body="Every MeridianOS desktop comes with Nomad Office installed. Buy it on its own only if you want it outside MeridianOS."
                />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
