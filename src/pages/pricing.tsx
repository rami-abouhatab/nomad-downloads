import { useEffect, useState } from 'react';
import { Segment } from '@nd/controls/Segment';
import { Layout } from '../ui/Layout';
import { Compare, PlanCard } from '../ui/blocks';
import { PeriodSwitch } from '../ui/period';
import { APP_PLANS, AX_PLANS, PRICE_FOOT } from '../data';
import { Band, BandHead, FAQ, PageHero } from '../ui/system';

/* Pricing, shaped like microsoft.com's Microsoft 365 plan comparison and apple.com's Apple One
   (Rami, 2026-10-14: "Apple and Microsoft don't do these structures and free-for-all cards"): one
   switch at the top for what you're shopping for, MeridianOS or an app on its own, and each side
   one row of equal plan columns: the name, the price, one verb, what you get. The free versions
   are a line under their plan, never cards of their own. Every feature side by side follows the
   Meridian plans; the billing questions close the page. */

type Shelf = 'meridian' | 'apps';

/* Where an address lands: an app's own anchor (account.nomad.ax/subscriptions/plans sends
   #citadel and friends here) opens the Apps side at that app. */
const APP_ANCHORS = new Set(['apps', 'office', 'reach', 'drift', 'citadel', 'polaris']);
const shelfOf = (hash: string): Shelf => (APP_ANCHORS.has(hash.replace(/^#/, '')) ? 'apps' : 'meridian');

const QA = [
  { q: 'How does the free trial work?', a: 'Meridian Starter is free for 14 days. You start it, and later change or cancel it, in your Nomad account on the web. Nothing is ever paid inside the app.' },
  { q: 'Can I cancel at any time?', a: 'Yes. Cancelling stops the next renewal, and your plan runs to the end of the period you paid for.' },
  { q: 'Can I change plans later?', a: 'Yes. Moving up starts today, with credit for what is left of your current plan. Moving down, or from yearly to monthly, starts when your current period ends, and nothing is charged until then.' },
  {
    q: 'I already pay for an app. What happens if I buy MeridianOS?',
    a: 'Nothing changes. They are separate subscriptions: MeridianOS covers the apps inside your desk, and the app you bought keeps its own subscription for using it outside MeridianOS. Your plans list each one, and your data is the same in both.',
  },
  { q: 'Is yearly cheaper?', a: 'Yes. Yearly plans are two months free.' },
];

export default function PricingPage() {
  const [shelf, setShelf] = useState<Shelf>('meridian');

  useEffect(() => {
    const read = () => {
      const next = shelfOf(location.hash);
      setShelf(next);
      const at = location.hash.replace(/^#/, '');
      if (next === 'apps' && at !== 'apps') requestAnimationFrame(() => document.getElementById(at)?.scrollIntoView({ block: 'start' }));
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const pick = (s: Shelf) => {
    setShelf(s);
    history.replaceState(null, '', s === 'apps' ? '#apps' : location.pathname);
  };

  return (
    <Layout page="pricing">
      <div data-light="neutral">
        <PageHero
          light="neutral"
          layout="center"
          eyebrow="Pricing"
          title="One account. Pick what you need."
          lede="MeridianOS is the whole desktop, with every Nomad app inside. Or take an app on its own, on your own computer."
          actions={
            <div className="shelf-switch">
              <Segment<Shelf>
                size="md"
                aria-label="What you’re shopping for"
                value={shelf}
                onChange={pick}
                options={[
                  { id: 'meridian', label: 'MeridianOS' },
                  { id: 'apps', label: 'Apps on their own' },
                ]}
              />
            </div>
          }
        />

        <div hidden={shelf !== 'meridian'}>
          <Band id="meridian" label="meridian-title">
            <BandHead id="meridian-title" title="MeridianOS plans." lede="Every plan is the full MeridianOS desktop with Nomad Office, Polaris Browser, Reach, Drift and Citadel inside. Start with 14 days of Meridian Starter, free.">
              <PeriodSwitch />
            </BandHead>
            <div className="plans">
              {AX_PLANS.map((p) => (
                <PlanCard key={p.id} plan={p} />
              ))}
            </div>
            <p className="sys-foot">{PRICE_FOOT}</p>
          </Band>

          <Band id="compare" label="compare-title">
            <BandHead id="compare-title" title="Every feature, side by side." />
            <Compare />
          </Band>
        </div>

        <div hidden={shelf !== 'apps'}>
          <Band id="apps" label="apps-title">
            <BandHead
              id="apps-title"
              title="Apps on their own."
              lede="For using a Nomad app on your own computer, without MeridianOS. Each is its own subscription, with the same Nomad account and the same data."
            >
              <PeriodSwitch />
            </BandHead>
            <div className="plans plans-4">
              {APP_PLANS.map((p) => (
                <div key={p.id} id={p.mark} className="plans-cell">
                  <PlanCard plan={p} />
                </div>
              ))}
            </div>
            <div className="shelf-notes">
              <p id="polaris">
                <b>Free from Nomad.</b> Polaris Browser, and the free Reach, Drift and Citadel, need only a Nomad account. <a href="/download">Download</a>
              </p>
              <p>
                <b>Already on MeridianOS?</b> Meridian Pro and Ultra include Nomad Office and Reach, Drift and Citadel Premium on the desk. Buy an app here only to use it outside MeridianOS.{' '}
                <a href="#meridian" onClick={(e) => (e.preventDefault(), pick('meridian'), window.scrollTo({ top: 0 }))}>
                  See MeridianOS plans
                </a>
              </p>
            </div>
            <p className="sys-foot">{PRICE_FOOT}</p>
          </Band>
        </div>

        <FAQ title="Questions? Answers." items={QA} tone="black" />
      </div>
    </Layout>
  );
}
