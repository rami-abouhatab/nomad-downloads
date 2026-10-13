import type { ReactNode } from 'react';
import { Layout } from '../ui/Layout';
import { Compare, PlanCard } from '../ui/blocks';
import { LinkButton, More, ProductMark, type ProductKey } from '../ui/kit';
import { PeriodSwitch, PriceText, usePeriod } from '../ui/period';
import { AX_PLANS, DRIFT_WEB, PRICE_FOOT, checkout, type ProductId } from '../data';
import { Band, BandHead, FAQ, PageHero } from '../ui/system';

/* Pricing, shaped like apple.com's Apple One and microsoft.com's plan
   comparison (Rami, 2026-10-10): the period switch in the opening, the
   MeridianOS plans, every feature side by side, the apps on their own, and
   the billing questions in the black band. */

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
    inAx: 'Polaris is the browser on every MeridianOS desk.',
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
        what: 'Meetings up to 4 hours and 50 people, recordings, and scheduled send and snooze.',
        buy: { label: 'Buy Reach Premium', product: 'reach:premium' },
        more: '/reach',
      },
    ],
    inAx: 'Reach is on every MeridianOS desk. Meridian Pro and Ultra include Reach Premium on the desk.',
  },
  {
    id: 'drift',
    name: 'Drift',
    tagline: 'Send a file with a link.',
    tiers: [
      {
        name: 'Drift',
        price: 'free',
        what: 'Send from your browser: up to 2 GB per link, kept for a day.',
        get: { label: 'Send a file', href: DRIFT_WEB },
      },
      {
        name: 'Drift Premium',
        price: 'drift:premium',
        what: 'The Drift app and device pairing, to send straight to your phone or another PC. Up to 10 GB per link, kept for 7 days.',
        buy: { label: 'Buy Drift Premium', product: 'drift:premium' },
        more: '/drift',
      },
    ],
    inAx: 'Drift is on every MeridianOS desk. Meridian Pro and Ultra include Drift Premium on the desk, and Ultra sends up to 50 GB per link.',
  },
  {
    id: 'citadel',
    name: 'Citadel',
    tagline: 'Lock what is yours.',
    tiers: [
      {
        name: 'Citadel',
        price: 'free',
        what: 'Lock any folder or file behind one PIN, encrypted.',
        get: { label: 'Download', href: '/download#citadel' },
      },
      {
        name: 'Citadel Premium',
        price: 'citadel:premium',
        what: 'Lock apps too, unlock with Windows Hello or Touch ID, auto-lock, and lock external drives.',
        buy: { label: 'Buy Citadel Premium', product: 'citadel:premium' },
        more: '/citadel',
      },
    ],
    inAx: 'Every MeridianOS desk can lock folders and files. Meridian Pro and Ultra include Citadel Premium on the desk.',
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
    inAx: 'Every MeridianOS plan has Nomad Office. Buy it alone only to use it outside MeridianOS.',
  },
];

const QA = [
  { q: 'How does the free trial work?', a: 'Meridian Starter is free for 14 days. You start it, and later change or cancel it, in your Nomad account on the web. Nothing is ever paid inside the app.' },
  { q: 'Can I cancel at any time?', a: 'Yes. Cancelling stops the next renewal, and your plan runs to the end of the period you paid for.' },
  { q: 'Can I change plans later?', a: 'Yes. Moving up or down is priced on the spot, with credit for what is left of your current plan.' },
  {
    q: 'I already pay for an app. What happens if I buy MeridianOS?',
    a: 'Nothing changes. They are separate subscriptions: MeridianOS covers the apps inside your desk, and the app you bought keeps its own subscription for using it outside MeridianOS. Your plans list each one, and your data is the same in both.',
  },
  { q: 'Is yearly cheaper?', a: 'Yes. Yearly plans are two months free.' },
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
      <div data-light="neutral">
        <PageHero
          light="neutral"
          layout="center"
          eyebrow="Pricing"
          title="One account. Pick what you need."
          lede="MeridianOS is the whole desktop, with every Nomad app inside. Or take an app on its own. Yearly plans are two months free."
          actions={<PeriodSwitch />}
        />

        <Band id="meridian" label="meridian-title">
          <BandHead id="meridian-title" title="MeridianOS plans." lede="Every plan is the full MeridianOS desktop with Nomad Office, Polaris Browser, Reach, Drift and Citadel inside. Start with 14 days of Meridian Starter, free." />
          <div className="plans">
            {AX_PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </Band>

        <Band id="compare" label="compare-title">
          <BandHead id="compare-title" title="Every feature, side by side." />
          <Compare />
        </Band>

        <Band id="apps" tone="mist" label="apps-title">
          <BandHead
            id="apps-title"
            title="Just the app you need."
            lede="Use Nomad's apps without MeridianOS, on your own computer. They sign in with the same Nomad account and work on the same data. Each one is its own subscription, separate from MeridianOS."
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
                    <b>Included in MeridianOS.</b> {a.inAx}
                  </span>
                </p>
              </article>
            ))}
          </div>
          <p className="sys-foot">{PRICE_FOOT}</p>
        </Band>

        <FAQ title="Questions? Answers." items={QA} tone="black" />
      </div>
    </Layout>
  );
}
