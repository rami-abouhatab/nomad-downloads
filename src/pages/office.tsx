import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { usePeriod } from '../ui/period';
import { checkout } from '../data';
import { Band, BandHead, Chapters, Columns, FAQ, InMeridian, PageHero, PlanSolo, ProductName, RealShot } from '../ui/system';

/* Nomad Office, shaped like microsoft.com's Microsoft 365 (Rami,
   2026-10-10): the four apps' colours in the opening, the apps side by side,
   one of them at work, the one price, its place in MeridianOS, and the
   questions. */

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
    a: 'Not on your desk: every MeridianOS plan includes Nomad Office inside MeridianOS. Buy it on its own to use it outside MeridianOS. The two are separate subscriptions, and your files are the same in both.',
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
      <div data-light="office">
        <PageHero
          light="office"
          layout="center"
          eyebrow={<ProductName product="office" name="Nomad Office" />}
          title="Four apps. One quiet office."
          lede="Folio, Grids, Expo and Markup: documents, spreadsheets, presentations and PDFs, installed on your own computer and saved where you can find them."
          actions={
            <>
              <Buy />
              <More href="/download#office">Download</More>
            </>
          }
          note="$59 a year or $5.99 a month. Already in every MeridianOS plan."
          visual={<RealShot name="office-folio" ratio="16 / 10" eager alt="Folio with a design brief open: a title, headings, a bulleted list and paragraphs on a white page." />}
        />

        <Band label="apps-title">
          <BandHead id="apps-title" title="Everything an office does." />
          <Columns
            cols={4}
            items={APPS.map((a) => ({
              id: a.id,
              title: a.name,
              body: a.body,
              mark: <img className="icon sys-app" src={`/assets/icons/${a.id}.webp`} alt="" width={56} height={56} loading="lazy" />,
            }))}
          />
        </Band>

        <Band tone="mist" label="grids-title">
          <h2 id="grids-title" className="vh">
            The apps at work
          </h2>
          <Chapters
            product="office"
            items={[
              {
                title: 'The numbers, and the formulas behind them.',
                icon: 'grid',
                body: 'Grids works the way the spreadsheets you know do, with the formulas you already use, on your own computer.',
                visual: <RealShot name="office-grids-4x3" ratio="4 / 3" alt="Grids with a budget by month, its totals worked out by SUM formulas, one shown in the formula bar." />,
              },
              {
                title: 'Slides for the room.',
                icon: 'display',
                body: 'Expo builds the deck one slide at a time, and lays them all out side by side when you want to see the whole story.',
                visual: <RealShot name="office-expo-overview-4x3" ratio="4 / 3" alt="The slide sorter in Expo: five slides of a design review, side by side." />,
              },
              {
                title: 'Mark up any PDF.',
                icon: 'edit',
                body: 'Markup reads, highlights and comments on PDFs, right on your own computer.',
                visual: <RealShot name="office-markup-4x3" ratio="4 / 3" alt="Markup with a PDF open, two lines highlighted, and the highlight colours beside it." />,
              },
            ]}
          />
        </Band>

        <Band id="buy" label="buy-title">
          <BandHead id="buy-title" title="One price, all four apps." lede="Nomad Office is a paid suite with no free tier. Your files stay on your computer." />
          <PlanSolo
            product="office"
            name="Nomad Office"
            pitch="Documents, spreadsheets, presentations and PDFs."
            cta="Buy Nomad Office"
            lines={['Folio, Grids, Expo and Markup', 'Installed on your own computer', 'Signs in with your Nomad account']}
            after={<More href="/download#office">Download Nomad Office</More>}
          />
        </Band>

        <InMeridian
          id="meridian-title"
          title="Already in every MeridianOS plan."
          body="Every MeridianOS desk comes with Nomad Office installed. Buy it on its own only if you want it outside MeridianOS."
        />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
