import { Layout } from '../ui/Layout';
import { Hero, InAx, SectionHead, SinglePlan, WindowShot } from '../ui/blocks';
import { LinkButton, More, ProductMark } from '../ui/kit';
import { usePeriod } from '../ui/period';
import { checkout } from '../data';

const APPS = [
  { id: 'folio', name: 'Folio', title: 'Documents.', body: 'Letters, reports, notes and everything in between, on a page that stays out of your way.' },
  { id: 'grids', name: 'Grids', title: 'Spreadsheets.', body: 'Budgets, lists and the numbers behind them, with the formulas you already know.' },
  { id: 'expo', name: 'Expo', title: 'Presentations.', body: 'Slides for the meeting, the class or the pitch, built quickly and shown full screen.' },
  { id: 'markup', name: 'Markup', title: 'PDFs.', body: 'Read, highlight, comment on and sign PDFs, right on your own computer.' },
];

function BuyOffice() {
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
      <Hero
        mark={<ProductMark product="office" size={112} label="Folio, Grids, Expo and Markup" />}
        name="Nomad Office"
        title={
          <>
            Four apps.
            <br />
            <span className="dim">One quiet office.</span>
          </>
        }
        lede="Folio, Grids, Expo and Markup: documents, spreadsheets, presentations and PDFs, installed on your own computer and saved where you can find them."
        actions={
          <>
            <BuyOffice />
            <More href="/download#office">Download</More>
          </>
        }
        note="$59 a year or $5.99 a month. Already included in every AX plan."
      >
        <div className="wrap hero-media">
          <WindowShot
            name="folio"
            height={1538}
            priority
            alt="Folio with a one-page launch plan open: the ribbon across the top, and a page with headings and a bulleted list."
          />
        </div>
      </Hero>

      <section className="section band" aria-labelledby="apps-title">
        <div className="wrap">
          <SectionHead id="apps-title" eyebrow="The four apps" title="Everything an office does." />
          <div className="cards cards-4">
            {APPS.map((a) => (
              <article className="card reveal" key={a.id}>
                <img className="icon" src={`/assets/icons/${a.id}.webp`} alt="" width={64} height={64} loading="lazy" />
                <p className="eyebrow">{a.name}</p>
                <h3 className="title">{a.title}</h3>
                <p className="body">{a.body}</p>
              </article>
            ))}
          </div>
          <WindowShot
            name="grids"
            className="reveal follow-shot"
            alt="Grids with a small table of months, revenue, costs and profit, and a total row worked out by formulas."
            caption="Grids: the numbers, and the formulas behind them."
          />
        </div>
      </section>

      <SinglePlan
        id="buy"
        eyebrow="Nomad Office"
        title={
          <>
            One price,
            <br />
            <span className="dim">all four apps.</span>
          </>
        }
        lede="Nomad Office is a paid suite with no free tier. Your files stay on your computer, in Documents › Nomad Office."
        product="office"
        name="Nomad Office"
        cta="Buy Nomad Office"
        lines={['Folio, Grids, Expo and Markup', 'Installed on your own Windows PC', 'Signs in with your Nomad account']}
        after={<More href="/download#office">Download Nomad Office</More>}
      />

      <InAx
        id="ax-title"
        title="Already in every AX plan."
        body="Every AX desk comes with Nomad Office installed. Buy it on its own only if you want it outside AX. If you move to AX later, your Office plan ends and what is left of it is credited to your AX bill."
      />
    </Layout>
  );
}
