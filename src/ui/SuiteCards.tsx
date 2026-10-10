import { checkout } from '../data';

/* The home page's Nomad Suite section (back on the page 2026-10-10, after
   the tiles, bands, banners and rows were tried and dropped). */

/* The Nomad suite as microsoft.com's product cards (Rami, 2026-10-09):
   every app its own card, set left: its icon, its name, a benefit headline,
   a sentence and two text links. The four standalone apps on the first row,
   the four Nomad Office apps on the second. */
type AppCard = {
  id: string;
  name: string;
  tagline: string;
  body: string;
  office?: boolean;
  learn: string;
  action: { label: string; href: string };
};

const OFFICE_BUY = { label: 'Buy', href: checkout('office', 'yearly') };

const APPS: AppCard[] = [
  {
    id: 'polaris',
    name: 'Polaris Browser',
    tagline: 'Browse without the noise',
    body: 'A fast, quiet browser that blocks ads and trackers on its own and keeps your sign-ins with your account.',
    learn: '/polaris',
    action: { label: 'Download', href: '/download#polaris' },
  },
  {
    id: 'reach',
    name: 'Reach',
    tagline: 'Every inbox, one calm window',
    body: 'All your mail accounts, chats and calls in one calm window, with meetings anyone can join from a link.',
    learn: '/reach',
    action: { label: 'Download', href: '/download#reach' },
  },
  {
    id: 'drift',
    name: 'Drift',
    tagline: 'Send anything, anywhere',
    body: 'Send any file with a link, or straight to your own phone and computers, without uploading it anywhere else.',
    learn: '/drift',
    action: { label: 'Send a file', href: 'https://drift.nomad.ax' },
  },
  {
    id: 'citadel',
    name: 'Citadel',
    tagline: "Keep what's yours, yours",
    body: 'Lock any app, folder or file on your computer behind one PIN, so the people around you can\'t open them.',
    learn: '/citadel',
    action: { label: 'Download', href: '/download#citadel' },
  },
  {
    id: 'folio',
    name: 'Folio',
    tagline: 'Write without distraction',
    body: 'Documents, letters and reports, written in a page that stays out of your way.',
    office: true,
    learn: '/office#folio',
    action: OFFICE_BUY,
  },
  {
    id: 'grids',
    name: 'Grids',
    tagline: 'Turn numbers into answers',
    body: 'Spreadsheets with formulas, charts and tables, fast on any size of sheet.',
    office: true,
    learn: '/office#grids',
    action: OFFICE_BUY,
  },
  {
    id: 'expo',
    name: 'Expo',
    tagline: 'Present like it’s finished',
    body: 'Slides that look finished, ready to present from any computer.',
    office: true,
    learn: '/office#expo',
    action: OFFICE_BUY,
  },
  {
    id: 'markup',
    name: 'Markup',
    tagline: 'Sign and edit any PDF',
    body: 'Read, sign, fill in and edit PDFs without printing a thing.',
    office: true,
    learn: '/office#markup',
    action: OFFICE_BUY,
  },
];

/* The row is microsoft.com's: no pictures (Rami, 2026-10-09). The scenes
   made for each app are kept in public/assets/shots/suite for the product
   pages. */
const ICON_V = '20261010a';

export function AppCards() {
  return (
    <div className="suite">
      {APPS.map((a) => (
        <article className="app-plate" key={a.id} aria-labelledby={`app-${a.id}`}>
          <img className="app-icon" src={`/assets/icons/${a.id}.webp?v=${ICON_V}`} width={64} height={64} alt="" decoding="async" />
          <p className="app-label" id={`app-${a.id}`}>
            <span>{a.name}</span>
            {a.office ? <span className="app-tag">Nomad Office</span> : null}
          </p>
          <h3 className="app-tagline">{a.tagline}</h3>
          <p className="app-body">{a.body}</p>
          <p className="app-links">
            {/* Office's four apps share one purchase, offered once under the
                cards (Rami, 2026-10-10: no link twice on the page). */}
            {a.office ? null : <a href={a.action.href}>{a.action.label}</a>}
            <a href={a.learn}>Learn more</a>
          </p>
        </article>
      ))}
    </div>
  );
}
