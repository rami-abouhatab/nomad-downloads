import { Layout } from '../ui/Layout';
import { PlanCard } from '../ui/blocks';
import { More } from '../ui/kit';
import { PeriodSwitch } from '../ui/period';
import { AX_PLANS, PRICE_FOOT } from '../data';
import { ProBadge } from '@nd/controls/ProBadge';
import { Band, BandHead, Columns, FAQ, Platforms, type Item } from '../ui/system';
import { DarkZone } from '../ui/cinema';
import { Collage } from '../ui/Collage';
import { Versus } from '../ui/Versus';
import { MeridianHero } from '../ui/MeridianHero';
import { useSmoothScroll } from '../ui/smooth';

/* MeridianOS, shaped like apple.com's macOS and microsoft.com's Windows
   (Rami, 2026-10-10): a black zone first (the opening, then the real Meridian to try and its
   pictures in a collage, then a clean cut to white), then on white "and so much more", the plans, where it runs, and the questions. */

const pro = <ProBadge plan="Pro" size="sm" />;
const MORE: Item[] = [
  { title: 'Nomad Office', icon: 'document', body: 'Folio, Grids, Expo and Markup for documents, spreadsheets, presentations and PDFs. Nothing extra to buy.' },
  { title: 'Polaris Browser', icon: 'globe', body: 'The browser is built in, and each desk keeps its own sign-ins, so work and home never mix.' },
  { title: 'Reach', icon: 'mail', body: 'All your mail, chats and calls. Pro and Ultra add Reach Premium: longer meetings, recordings and your own mail domain.' },
  { title: 'Drift', icon: 'send', body: 'Send any file with a link. Pro and Ultra add Drift Premium: bigger files, and sending straight to your phone.' },
  { title: 'Snapshots', icon: 'seekSnapshot', body: 'A saved photo of your desktop: layout, open apps and tabs. Jump back to it any time. Your files keep their own history.' },
  { title: 'File history', icon: 'clock', body: 'Go back to an earlier version of any file: 30 days on Starter, a year on Pro, forever on Ultra.' },
  { title: 'More than one desk', icon: 'layers', tag: pro, body: 'Keep work and home on separate desks, each with its own apps, files and sign-ins. Three on Pro, eight on Ultra.' },
  { title: 'Guest links', icon: 'seekGuest', tag: pro, body: 'Send someone a view of a desk. It opens in their browser, with nothing to install and no account. Links expire when you say.' },
  { title: 'Lock, Convert and Fonts', icon: 'lock', tag: pro, body: 'Put a PIN on any file, folder or app. Turn a file into another format in place. Add your own fonts.' },
];

/* What the privacy policy (pages/privacy.tsx) says, plus two lines Rami asked for (2026-10-11):
   the encryption line (true as worded: storage encrypted at rest, sign-ins sealed per account; NOT
   end-to-end), and the year after a subscription ends, which is his ruling of 2026-10-10 and NOT
   BUILT yet (nomad-shell docs/pricing.md): it must exist before this page ships. */
const PRIVATE: Item[] = [
  { title: 'Safe in your account', icon: 'shield', body: 'Your files live in your Nomad account on protected servers, encrypted where they are stored, not on any one computer. A lost or broken laptop takes nothing with it.' },
  { title: 'Work and home, apart', icon: 'layers', body: 'Each space keeps its own apps, files and sign-ins, so nothing from one shows up in the other.' },
  { title: 'Never sold', icon: 'eye', body: 'We do not sell your data, show you ads, or use your files to train anything.' },
  { title: 'Locked when you want', icon: 'lock', body: 'Put a PIN on anything private with Citadel. We keep only a protected form of the PIN.' },
  { title: 'Always yours to take', icon: 'download', body: 'Export every file and your account data to your computer at any time. Delete your account and it is erased.' },
  { title: 'A year to come back', icon: 'clock', body: 'If a subscription ends, we keep everything for a year and remind you to download it. Come back and pick up where you left off.' },
];

const QA = [
  {
    q: 'What is a desk?',
    a: 'A complete workspace: its own apps, files, windows and browser sign-ins. Most people need one. Meridian Pro gives you three, so work and home never meet; Meridian Ultra gives you eight.',
  },
  {
    q: 'What happens when I use another computer?',
    a: 'Install MeridianOS, sign in with your Nomad account, and your desk opens the way you left it. Your files and settings live in your account, not on the machine.',
  },
  {
    q: 'How does the free trial work?',
    a: 'Meridian Starter is free for 14 days. You start it, and later change or cancel it, in your Nomad account on the web. Nothing is ever paid inside the app.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Moving up or down is priced on the spot, with credit for what is left of your current plan.',
  },
  {
    q: 'Do I need a Google or Microsoft account?',
    a: 'No. A Nomad account is your email and a passkey or password. If you want your Gmail, Outlook or Google Drive in MeridianOS, you connect them inside the apps.',
  },
];

export default function AxPage() {
  useSmoothScroll();
  return (
    <Layout
      page="ax"
      local={{
        name: 'Meridian',
        links: [
          { label: 'Overview', href: '/meridian', current: true },
          { label: 'Plans', href: '/meridian#plans' },
          { label: 'Questions', href: '/meridian#questions' },
          { label: 'Download', href: '/download#meridian' },
        ],
        cta: { label: 'Buy', href: '/meridian#plans' },
        tone: 'dark',
      }}
    >
      <div data-light="ax">
        <MeridianHero />

        {/* The black zone (Rami, 2026-10-10): try the real Meridian (TryMeridian), then the
            pictures in a collage for whoever would rather look; then the black ends in a clean cut to white. */}
        <DarkZone>
          <Collage
            label="Meridian, close up"
            items={[
              { name: 'sq-seek', label: 'Search', title: 'Seek', body: 'One search for everything on your desk: apps, files, notes, and the web.', alt: 'Seek open over the desk, finding files and a note for “trip”.' },
              { name: 'sq-notices', label: 'Notifications', title: 'One calm card', body: 'Downloads, timers and messages arrive the same way, and wait while your pointer is on them.', alt: 'Three notifications under the menu bar.' },
              { name: 'row-gallery', label: 'Photos', title: 'Gallery', body: 'Your photographs grouped by day, with what happened on this day.', alt: 'Gallery showing photographs grouped by day.' },
              { name: 'sq-spaces', label: 'Spaces', title: 'Work and home, apart', body: 'Each space keeps its own apps, files, wallpaper and sign-ins.', alt: 'Settings showing three spaces: Personal, Work and Studio.' },
              { name: 'sq-stack', label: 'Windows', title: 'The Stack', body: 'Every open window at the same size. Pick one, or drop it into a layout.', alt: 'The Stack: Markup, Settings, Gallery and Files side by side.' },
              { name: 'row-markup', label: 'PDF', title: 'Markup', body: 'Read, mark up, fill in and sign any PDF.', alt: 'Markup with two PDFs.' },
              { name: 'sq-files', label: 'Files', title: 'In your account', body: 'Desktop, Documents, Downloads, Pictures and Music, the same on every computer.', alt: 'Files open on the Pictures folder over the desk.' },
              { name: 'row-settings', label: 'Settings', title: 'Yours, everywhere', body: 'Your space, Focus and appearance follow you to the next computer too.', alt: 'Settings on its Home page.' },
              { name: 'row-polaris', label: 'Browser', title: 'Polaris, built in', body: 'Each desk keeps its own sign-ins, so work and home never mix.', alt: 'Polaris Browser on a new tab.' },
              { name: 'sq-dock', label: 'The dock', title: 'Every Nomad app', body: 'Polaris, Reach, Files, Nomad Office and the rest are there from the first day.', alt: 'The dock with the whole Nomad suite.' },
            ]}
          />
          <Versus
            id="vs-title"
            title="Meridian vs Others"
            lede="What changes when your desk lives in your account, not on one machine."
            rows={[
              {
                when: 'What if I want to open my desktop on another laptop?',
                usual: 'A different desktop. Your files, apps and windows stay on the machine you left.',
                meridian: 'Open Meridian on any computer and sign in: your apps, files, windows, wallpaper and settings are all there, exactly the same.',
              },
              {
                when: 'What happens when I get a new computer?',
                usual: 'A day of installing, copying and setting things up again.',
                meridian: 'Install Meridian, sign in, and your desk is there.',
              },
              {
                when: 'What if my laptop is lost or broken?',
                usual: 'Whatever was not backed up goes with it.',
                meridian: 'Your files and settings live in your Nomad account, not on the laptop.',
              },
              {
                when: 'How do I keep work and home apart?',
                usual: 'One desktop for both, or separate user accounts to switch between.',
                meridian: 'Separate spaces, each with its own apps, files, wallpaper and sign-ins.',
              },
              {
                when: 'Do I have to buy my apps separately?',
                usual: 'An office suite, mail and file sharing, each bought and installed on its own.',
                meridian: 'Nomad Office, Polaris Browser, Reach and Drift come with every plan.',
              },
            ]}
          />
        </DarkZone>

        <Band label="more-title">
          <BandHead id="more-title" title="And so much more." lede="Every Nomad app comes installed. The plan you pick decides how much room you get and which extras switch on." />
          <Columns items={MORE} cols={3} align="center" />
          <p className="sys-foot">
            Marked <ProBadge plan="Pro" size="sm" /> are on Meridian Pro and Meridian Ultra.
          </p>
        </Band>

        {/* The question a cloud desktop raises: where is it, and who can see it (Rami, 2026-10-11).
            Every line is what the privacy policy already promises. */}
        <Band label="private-title">
          <BandHead id="private-title" title="Private by design." lede="Your files, your sign-ins and what you do on your desk stay yours. No ads, no selling, no training on your files." />
          <Columns items={PRIVATE} cols={3} align="center" />
          <p className="sys-foot">
            <More href="/privacy">Read how we handle your data</More>
          </p>
        </Band>

        <Band id="plans" tone="mist" label="plans-title">
          <BandHead id="plans-title" title="Pick the size of your desk." lede="Every plan is the full MeridianOS desktop. What changes is how much room you get, how many desks, and the extras.">
            <PeriodSwitch />
          </BandHead>
          <div className="plans">
            {AX_PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
          <p className="sys-foot">
            {PRICE_FOOT} <More href="/pricing#compare">Compare every feature</More>
          </p>
        </Band>

        <Band label="where-title">
          <BandHead id="where-title" title="Runs on the computer you have." lede="Install it once, sign in, and your desk is there." />
          <Platforms anchor="meridian" />
        </Band>

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
