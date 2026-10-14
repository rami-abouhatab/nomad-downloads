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

/**
 * Where a buy button goes: the account portal's checkout. Meridian is Meridian in every address
 * (Rami, 2026-10-11): `ax:` is billing's key, a link says `meridian:starter`.
 */
export const checkout = (product: ProductId, period: Period) =>
  `${ACCOUNT}/checkout?product=${product.replace(/^ax:/, 'meridian:')}&period=${period}`;

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
  /** An app's plan wears the app's mark above its name (the Apps side of pricing). */
  mark?: 'reach' | 'drift' | 'citadel' | 'office';
  /** The free version beside it, in one quiet line under the card. */
  free?: { name: string; what: string; href: string; verb: string };
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
      'Reach Premium: meetings up to 4 hours and 50 people, and recordings',
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

/**
 * The apps on their own, as plans (Rami, 2026-10-14: "Apple and Microsoft don't do these
 * structures and free-for-all cards"): one column each, the same anatomy as the Meridian plans.
 * Each one's free version is a line under its card, not a card of its own.
 */
export const APP_PLANS: Plan[] = [
  {
    id: 'office',
    mark: 'office',
    name: 'Nomad Office',
    note: 'On your own computer',
    pitch: 'Folio, Grids, Expo and Markup, installed on your PC.',
    cta: 'Buy Nomad Office',
    lead: 'Everything for documents',
    lines: ['Documents in **Folio**', 'Spreadsheets in **Grids**', 'Presentations in **Expo**', 'PDFs in **Markup**', 'Works offline, saves to your Nomad account'],
  },
  {
    id: 'reach:premium',
    mark: 'reach',
    name: 'Reach Premium',
    note: 'Mail, chat and calls',
    pitch: 'Longer, bigger meetings, and recordings.',
    cta: 'Buy Reach Premium',
    lead: 'Everything in Reach, plus',
    lines: ['Meetings up to **4 hours**', 'Up to **50 people**', 'Meeting recordings', 'Scheduled send and snooze'],
    free: { name: 'Reach', what: 'every mail account, chat, calls and meetings up to 40 minutes', href: 'https://reach.nomad.ax/?install=1', verb: 'Install' },
  },
  {
    id: 'drift:premium',
    mark: 'drift',
    name: 'Drift Premium',
    note: 'Send files',
    pitch: 'The Drift app, and sending straight to your devices.',
    cta: 'Buy Drift Premium',
    lead: 'Everything in Drift, plus',
    lines: ['The Drift app and device pairing', 'Up to **10 GB** per link', 'Links kept for **7 days**'],
    free: { name: 'Drift', what: 'send up to 2 GB from your browser, kept for a day', href: 'https://drift.nomad.ax', verb: 'Send a file' },
  },
  {
    id: 'citadel:premium',
    mark: 'citadel',
    name: 'Citadel Premium',
    note: 'Lock what is yours',
    pitch: 'Lock apps and drives too, behind the same PIN.',
    cta: 'Buy Citadel Premium',
    lead: 'Everything in Citadel, plus',
    lines: ['Lock **apps**', 'Unlock with Windows Hello or Touch ID', 'Auto-lock', 'Cloud locks and the Vault, **50 GB**'],
    free: { name: 'Citadel', what: 'lock any folder or file behind one PIN', href: '/download#citadel', verb: 'Download' },
  },
];

/** The one-line account rule printed under every price. */
export const PRICE_FOOT =
  'Prices in US dollars. Plans, payments, receipts and cancelling all happen in your Nomad account on the web; nothing is ever paid inside an app.';
