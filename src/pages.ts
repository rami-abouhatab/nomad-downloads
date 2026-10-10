/**
 * Every page of nomad.ax: its id (which is also its client entry,
 * src/client/<id>.tsx), the URL it is served at, the file the build writes,
 * and its head. tools/build.mjs prerenders each one; vite.config.ts builds one
 * entry per page from this list.
 *
 * Files are `<route>.html`, not `<route>/index.html`: Cloudflare Pages serves
 * `ax.html` at `/ax` with no redirect, which keeps every URL the old site
 * printed (and every link already out there) exactly as it was.
 */
export type PageId =
  | 'home'
  | 'ax'
  | 'polaris'
  | 'reach'
  | 'drift'
  | 'citadel'
  | 'office'
  | 'pricing'
  | 'download'
  | 'privacy'
  | 'terms';

export type PageMeta = {
  id: PageId;
  route: string;
  file: string;
  title: string;
  description: string;
  /** Short share title, when it differs from the tab title. */
  ogTitle?: string;
};

export const PAGES: PageMeta[] = [
  {
    id: 'home',
    route: '/',
    file: 'index.html',
    title: 'Nomad',
    description:
      'Nomad makes MeridianOS, the desktop that lives in your account, and the apps that go with it: Polaris Browser, Reach, Drift and Nomad Office. One Nomad account opens all of them.',
  },
  {
    id: 'ax',
    route: '/ax',
    file: 'ax.html',
    title: 'MeridianOS · Nomad',
    ogTitle: 'MeridianOS — Access wherever you are',
    description:
      'MeridianOS is a whole desktop that lives in your Nomad account. Sign in on any computer and your desk opens as you left it. Meridian Starter, Pro and Ultra, from $9.99 a month, 14 days free.',
  },
  {
    id: 'polaris',
    route: '/polaris',
    file: 'polaris.html',
    title: 'Polaris Browser · Nomad',
    description:
      'Polaris Browser is a fast, quiet, free browser from Nomad. Ads and trackers kept out, the pages you read easy to find again. For Windows.',
  },
  {
    id: 'reach',
    route: '/reach',
    file: 'reach.html',
    title: 'Reach · Nomad',
    description:
      'Reach puts your mail, chats and calls in one calm window. Free. Reach Premium adds longer meetings, recordings and mail at your own domain, from $4.99 a month.',
  },
  {
    id: 'drift',
    route: '/drift',
    file: 'drift.html',
    title: 'Drift · Nomad',
    description:
      'Drift sends a file with a link: up to 2 GB, free, nothing to install. Drift Premium adds the app and device pairing, 10 GB for 7 days, from $2.99 a month.',
  },
  {
    id: 'citadel',
    route: '/citadel',
    file: 'citadel.html',
    title: 'Citadel · Nomad',
    description:
      'Citadel locks any folder or file on your computer behind one PIN, with real encryption. Free. Citadel Premium adds app locking, Windows Hello and auto-lock, from $1.99 a month.',
  },
  {
    id: 'office',
    route: '/office',
    file: 'office.html',
    title: 'Nomad Office',
    description:
      'Nomad Office: Folio, Grids, Expo and Markup for documents, spreadsheets, presentations and PDFs, installed on your computer. $5.99 a month or $59 a year, and included in every MeridianOS plan.',
  },
  {
    id: 'pricing',
    route: '/pricing',
    file: 'pricing.html',
    title: 'Pricing · Nomad',
    description:
      "Meridian Starter, Pro and Ultra, and Nomad's apps on their own: Polaris Browser and Reach are free; Reach Premium, Drift Premium and Nomad Office from $2.99 a month. Yearly plans are two months free.",
  },
  {
    id: 'download',
    route: '/download',
    file: 'download.html',
    title: 'Download · Nomad',
    description: 'Download MeridianOS, Polaris Browser, Reach, Drift and Nomad Office for Windows 10 and 11, on Intel, AMD or ARM.',
  },
  {
    id: 'privacy',
    route: '/privacy',
    file: 'privacy.html',
    title: 'Privacy · Nomad',
    description: 'What Nomad keeps about you, why, who helps us keep it, and what you can do about it.',
  },
  {
    id: 'terms',
    route: '/terms',
    file: 'terms.html',
    title: 'Terms · Nomad',
    description: "The terms for using Nomad's products: MeridianOS, Polaris Browser, Reach, Drift and Nomad Office.",
  },
];

export const pageById = (id: PageId) => PAGES.find((p) => p.id === id)!;
