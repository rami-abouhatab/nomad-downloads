import type { ReactNode } from 'react';
import { Layout } from '../ui/Layout';
import { Compare, Hero, PlanCard, SectionHead } from '../ui/blocks';
import { LinkButton, More, ProductMark, type ProductKey } from '../ui/kit';
import { PeriodSwitch, PriceText, usePeriod } from '../ui/period';
import { AX_PLANS, DRIFT_WEB, PRICE_FOOT, checkout, type ProductId } from '../data';

type Tier = {
  name: string;
  price: ProductId | 'free';
  what: string;
  buy?: { label: string; product: ProductId };
  get?: { label: string; href: string };
  more?: string;
};

type App = { id: ProductKey; name: string; tagline: string; tiers: Tier[]; inAx: ReactNode };

const APPS: App[] = [
  {
    id: 'polaris',
    name: 'Polaris Browser',
    tagline: 'The browser, complete.',
    tiers: [
      {
        name: 'Polaris Browser',
        price: 'free',
        what: 'The whole browser, with nothing held back.',
        get: { label: 'Download', href: '/download#polaris' },
        more: '/polaris',
      },
    ],
    inAx: 'Polaris is the browser on every AX desk.',
  },
  {
    id: 'reach',
    name: 'Reach',
    tagline: 'Mail, chat and calls, together.',
    tiers: [
      {
        name: 'Reach',
        price: 'free',
        what: 'As many mail accounts as you have, chat, one-to-one calls, meetings up to 40 minutes and 10 people, events and people.',
        get: { label: 'Download', href: '/download#reach' },
      },
      {
        name: 'Reach Premium',
        price: 'reach:premium',
        what: 'Meetings up to 4 hours and 50 people, recordings, scheduled send and snooze, and your own domain with one mailbox and unlimited aliases. Extra mailboxes are $1.99 a month each.',
        buy: { label: 'Buy Reach Premium', product: 'reach:premium' },
        more: '/reach',
      },
    ],
    inAx: 'Reach is on every AX desk. AX Pro and Ultra include Reach Premium.',
  },
  {
    id: 'drift',
    name: 'Drift',
    tagline: 'Send a file with a link.',
    tiers: [
      {
        name: 'Drift',
        price: 'free',
        what: 'Send from your browser: files up to 2 GB, links that last a day.',
        get: { label: 'Send a file', href: DRIFT_WEB },
      },
      {
        name: 'Drift Premium',
        price: 'drift:premium',
        what: 'The Drift app and device pairing, to send straight to your phone or another PC. Files up to 10 GB, links that last 7 days.',
        buy: { label: 'Buy Drift Premium', product: 'drift:premium' },
        more: '/drift',
      },
    ],
    inAx: 'Drift is on every AX desk. AX Pro and Ultra include Drift Premium, and Ultra sends up to 50 GB.',
  },
  {
    id: 'office',
    name: 'Nomad Office',
    tagline: 'Folio, Grids, Expo and Markup.',
    tiers: [
      {
        name: 'Nomad Office',
        price: 'office',
        what: 'Documents, spreadsheets, presentations and PDFs, installed on your own computer. There is no free tier.',
        buy: { label: 'Buy Nomad Office', product: 'office' },
        more: '/office',
      },
    ],
    inAx: 'Every AX plan has Nomad Office. Buy it alone only to use it outside AX.',
  },
];

function TierView({ t }: { t: Tier }) {
  const period = usePeriod();
  return (
    <div className="tier">
      <div className="tier-top">
        <h4 className="tier-name">{t.name}</h4>
        <p className="tier-price">{t.price === 'free' ? 'Free' : <PriceText product={t.price} />}</p>
      </div>
      <p className="tier-what">{t.what}</p>
      <div className="tier-cta">
        {t.buy && (
          <LinkButton href={checkout(t.buy.product, period)} variant="primary" size="md">
            {t.buy.label}
          </LinkButton>
        )}
        {t.get && (
          <LinkButton href={t.get.href} size="md">
            {t.get.label}
          </LinkButton>
        )}
        {t.more && <More href={t.more}>Learn more</More>}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Layout page="pricing">
      <Hero
        name="Pricing"
        title={
          <>
            One account.
            <br />
            <span className="dim">Pick what you need.</span>
          </>
        }
        lede="AX is the whole desktop, with every Nomad app inside. Or take an app on its own. Yearly plans are two months free."
        actions={<PeriodSwitch />}
      />

      <section className="section-tight band" id="ax" aria-labelledby="ax-title">
        <div className="wrap">
          <SectionHead
            id="ax-title"
            eyebrow="AX · the desktop"
            title="AX plans."
            lede="Every plan is the full AX desktop with Nomad Office, Polaris Browser, Reach and Drift inside. Start with 14 days of AX Starter, free."
          />
          <div className="plans">
            {AX_PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="compare" aria-labelledby="compare-title">
        <div className="wrap">
          <SectionHead id="compare-title" title="Every AX feature, side by side." />
          <Compare />
        </div>
      </section>

      <section className="section band" id="apps" aria-labelledby="apps-title">
        <div className="wrap">
          <SectionHead
            id="apps-title"
            eyebrow="Apps on their own"
            title="Just the app you need."
            lede="Use Nomad's apps without AX, on your own computer. They sign in with the same Nomad account, and every one of them is already part of AX."
          />
          <div className="apps">
            {APPS.map((a) => (
              <article className="app-card" id={a.id} key={a.id} aria-labelledby={`app-${a.id}`}>
                <div className="app-card-head">
                  <ProductMark product={a.id} size={52} />
                  <div>
                    <h3 id={`app-${a.id}`}>{a.name}</h3>
                    <p>{a.tagline}</p>
                  </div>
                </div>
                <div className="tiers">
                  {a.tiers.map((t) => (
                    <TierView key={t.name} t={t} />
                  ))}
                </div>
                <p className="in-ax-line">
                  <ProductMark product="ax" size={22} />
                  <span>
                    <b>Included in AX.</b> {a.inAx}
                  </span>
                </p>
              </article>
            ))}
          </div>
          <p className="plans-foot small">
            {PRICE_FOOT} If you buy an AX plan that includes an app you already pay for, the app's own plan ends and what is left of it is
            credited to your AX bill.
          </p>
        </div>
      </section>
    </Layout>
  );
}
