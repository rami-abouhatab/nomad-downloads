/**
 * The facts the pages print: prices, plan contents, where a button goes.
 *
 * Prices are THE LAW in nomad-shell/docs/pricing.md (2026-10-08) and the
 * cents in platform contract C3. Change them there first, then here; nothing
 * else on the site holds a price.
 */

export type Period = 'yearly' | 'monthly';
export type ProductId = 'ax:starter' | 'ax:pro' | 'ax:ultra' | 'reach:premium' | 'drift:premium' | 'citadel:premium' | 'office';

export const ACCOUNT = 'https://account.nomad.ax';
export const SIGN_IN = `${ACCOUNT}/signin`;
export const SIGN_UP = `${ACCOUNT}/signup`;
/** billing.nomad.ax redirects into the account portal; the old links keep working. */
export const MANAGE_PLAN = 'https://billing.nomad.ax/';
export const DRIFT_WEB = 'https://drift.nomad.ax';

/** Where a buy button goes: the account portal's checkout. */
export const checkout = (product: ProductId, period: Period) =>
  `${ACCOUNT}/checkout?product=${product}&period=${period}`;

export type Price = { monthly: string; yearly: string; perMonthYearly: string };

export const PRICES: Record<ProductId, Price> = {
  'ax:starter': { monthly: '$9.99', yearly: '$99', perMonthYearly: '$8.25' },
  'ax:pro': { monthly: '$16.99', yearly: '$169', perMonthYearly: '$14.08' },
  'ax:ultra': { monthly: '$29.99', yearly: '$299', perMonthYearly: '$24.92' },
  'reach:premium': { monthly: '$4.99', yearly: '$49', perMonthYearly: '$4.08' },
  'drift:premium': { monthly: '$2.99', yearly: '$29', perMonthYearly: '$2.42' },
  'citadel:premium': { monthly: '$1.99', yearly: '$19', perMonthYearly: '$1.58' },
  office: { monthly: '$5.99', yearly: '$59', perMonthYearly: '$4.92' },
};

export type Plan = {
  id: ProductId;
  name: string;
  note: string;
  pitch: string;
  cta: string;
  lead: string;
  /** Lines; `**x**` is set in bold. */
  lines: string[];
  lit?: boolean;
};

export const AX_PLANS: Plan[] = [
  {
    id: 'ax:starter',
    name: 'Meridian Starter',
    note: '14 days free',
    pitch: 'One desk with everything you need to get on with things.',
    cta: 'Start free trial',
    lead: 'The full MeridianOS desktop',
    lines: [
      '**128 GB** of storage',
      '**1 desk**',
      'Nomad Office: Folio, Grids, Expo and Markup',
      'Polaris Browser',
      'Reach, with meetings up to 40 minutes and 10 people',
      'Drift, sending up to 2 GB for a day',
      '3 snapshots',
      '30 days of file history',
    ],
  },
  {
    id: 'ax:pro',
    name: 'Meridian Pro',
    note: 'Every feature',
    pitch: 'Keep work and home apart, and work with other people.',
    cta: 'Buy Meridian Pro',
    lead: 'Everything in Starter, plus every built-in feature',
    lit: true,
    lines: [
      '**512 GB** of storage',
      '**3 desks**',
      'Reach Premium: meetings up to 4 hours and 50 people, recordings, your own mail domain',
      'Drift Premium: 10 GB for 7 days and device pairing',
      'Lock, Convert and Fonts',
      'Guest links',
      'Working together live in Folio, Grids and Expo',
      'Desk templates',
      '25 snapshots',
      'A year of file history',
    ],
  },
  {
    id: 'ax:ultra',
    name: 'Meridian Ultra',
    note: 'The most room',
    pitch: 'Many desks, many computers, and room for all of it.',
    cta: 'Buy Meridian Ultra',
    lead: 'Everything in Pro, plus',
    lines: [
      '**1 TB** of storage',
      '**8 desks**',
      'Meetings up to 24 hours and 100 people',
      'Drift sends up to 50 GB for 7 days, only on Ultra',
      'Unlimited snapshots',
      'File history forever',
      'Priority support',
    ],
  },
];

/** The one-line account rule printed under every price. */
export const PRICE_FOOT =
  'Prices in US dollars. Plans, payments, receipts and cancelling all happen in your Nomad account on the web; nothing is ever paid inside an app.';
