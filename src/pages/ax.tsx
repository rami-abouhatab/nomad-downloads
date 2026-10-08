import { Layout } from '../ui/Layout';
import { AX_DESK, AxPlans, Display, Features, Hero, Questions, SectionHead, WindowShot, type Feature } from '../ui/blocks';
import { LinkButton, More, ProductMark } from '../ui/kit';
import { checkout } from '../data';
import { ProBadge } from '@nd/controls/ProBadge';

/* The four places the old scroll scene walked through, each on one of the
   wallpapers AX ships with: same desk, different light. */
const PLACES = [
  { title: 'At home.', body: 'Your apps, your files and your windows, just where you put them.', wall: 'graphite' },
  { title: 'At the office.', body: 'Sign in on another computer and the same desk opens. Nothing to copy, nothing to set up again.', wall: 'ember' },
  { title: 'Away.', body: "A hotel, a library, a friend's laptop. Your desk follows your account, not the machine.", wall: 'ocean' },
  { title: 'Back again.', body: 'Everything you changed while you were out is already here.', wall: 'jade' },
];

const FEATURES: Feature[] = [
  { title: 'Nomad Office', body: 'Folio, Grids, Expo and Markup for documents, spreadsheets, presentations and PDFs. Nothing extra to buy.' },
  { title: 'Polaris Browser', body: 'The browser is built in, and each desk keeps its own sign-ins, so work and home never mix.' },
  { title: 'Reach', body: 'All your mail, chats and calls. AX Pro and Ultra add Reach Premium: longer meetings, recordings and your own mail domain.' },
  { title: 'Drift', body: 'Send any file with a link. AX Pro and Ultra add Drift Premium, the Drift app and sending straight to your phone.' },
  { title: 'Snapshots', body: 'A saved photo of your desktop: layout, open apps and tabs. Jump back to it any time. Your files keep their own history.' },
  { title: 'File history', body: 'Go back to an earlier version of any file: 30 days on Starter, a year on Pro, forever on Ultra.' },
  { title: 'More than one desk', pro: true, body: 'Keep work and home on separate desks, each with its own apps, files and sign-ins. Three on Pro, eight on Ultra.' },
  { title: 'Guest links', pro: true, body: 'Send someone a view of a desk. It opens in their browser, with nothing to install and no account. Links expire when you say.' },
  { title: 'Lock, Convert and Fonts', pro: true, body: 'Put a PIN on any file, folder or app. Turn a file into another format in place. Add your own fonts.' },
];

const QA = [
  {
    q: 'What is a desk?',
    a: 'A complete workspace: its own apps, files, windows and browser sign-ins. Most people need one. AX Pro gives you three, so work and home never meet; AX Ultra gives you eight.',
  },
  {
    q: 'What happens when I use another computer?',
    a: 'Install AX, sign in with your Nomad account, and your desk opens the way you left it. Your files and settings live in your account, not on the machine.',
  },
  {
    q: 'How does the free trial work?',
    a: 'AX Starter is free for 14 days. You start it, and later change or cancel it, in your Nomad account on the web. Nothing is ever paid inside the app.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Moving up or down is priced on the spot, with credit for what is left of your current plan. If you already pay for Nomad Office, Reach Premium or Drift Premium on their own, an AX plan that includes them replaces that payment.',
  },
  {
    q: 'Do I need a Google or Microsoft account?',
    a: 'No. A Nomad account is your email and a passkey or password. If you want your Gmail, Outlook or Google Drive in AX, you connect them inside the apps.',
  },
  {
    q: 'Which computers does AX run on?',
    a: 'Windows 10 and 11 PCs, with Intel, AMD or ARM processors. The download page picks the right one for you.',
  },
];

export default function AxPage() {
  return (
    <Layout
      page="ax"
      local={{
        name: 'AX',
        links: [
          { label: 'Overview', href: '/ax', current: true },
          { label: 'Plans', href: '/ax#plans' },
          { label: 'Questions', href: '/ax#questions' },
          { label: 'Download', href: '/download#ax' },
        ],
        cta: { label: 'Buy', href: '/ax#plans' },
      }}
    >
      <Hero
        mark={<ProductMark product="ax" size={96} />}
        name="AX"
        title="Access wherever you are."
        lede="AX is a whole desktop that lives in your Nomad account. Sign in on any computer and your desk opens the way you left it: your apps, your files, your windows, the tabs you had open."
        actions={
          <>
            <LinkButton href={checkout('ax:starter', 'yearly')} variant="primary" hero>
              Start free trial
            </LinkButton>
            <More href="/download#ax">Download</More>
          </>
        }
        note="AX Starter is free for 14 days. For Windows 10 and 11."
      >
        <div className="wrap hero-media">
          <Display {...AX_DESK} priority />
        </div>
      </Hero>

      <section className="section band" aria-labelledby="places-title">
        <div className="wrap">
          <SectionHead id="places-title" eyebrow="The same desk" title="Wherever you sign in." />
          <div className="places">
            {PLACES.map((p) => (
              <article className="place reveal" key={p.title}>
                <img src={`/assets/wall/${p.wall}-sm.webp`} alt="" width={836} height={470} loading="lazy" decoding="async" />
                <h3 className="title">{p.title}</h3>
                <p className="body">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="apps-title">
        <div className="wrap">
          <SectionHead
            id="apps-title"
            eyebrow="Built in"
            title="The apps you open every day."
            lede="Files, Gallery, Notebook and Settings are part of AX itself, with your files in your account rather than on the machine."
          />
          <div className="shots">
            <WindowShot
              name="files"
              className="reveal shots-wide"
              sizes="(min-width: 1200px) 1100px, 92vw"
              alt="Files showing the Pictures folder as a grid of photos, with Desktop, Documents, Downloads, Pictures and Music in the rail."
              caption="Files"
            />
            <WindowShot
              name="gallery"
              className="reveal"
              sizes="(min-width: 900px) 360px, 92vw"
              alt="Gallery's Photos view: photographs grouped by day, with Videos, On this day and folders in the rail."
              caption="Gallery"
            />
            <WindowShot
              name="notes"
              className="reveal"
              sizes="(min-width: 900px) 360px, 92vw"
              alt="Notebook with a note open: headings, a bulleted list, a quote and a checklist."
              caption="Notebook"
            />
            <WindowShot
              name="settings"
              className="reveal"
              sizes="(min-width: 900px) 360px, 92vw"
              alt="Settings on its Home page: the current space, Focus, Appearance and shortcuts to Personalization, Apps, Accounts and Storage."
              caption="Settings"
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="inside-title">
        <div className="wrap">
          <SectionHead
            id="inside-title"
            eyebrow="On every desk"
            title="Everything's already there."
            lede="Every Nomad app comes installed. The plan you pick decides how much room you get and which extras switch on."
          />
          <Features items={FEATURES} />
          <p className="small features-key">
            Marked <ProBadge plan="Pro" size="sm" /> are on AX Pro and AX Ultra.
          </p>
        </div>
      </section>

      <AxPlans />

      <Questions id="questions" items={QA} />
    </Layout>
  );
}
