import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { Band, BandHead, Columns, FAQ, InMeridian, PageHero, PlanPair, ProductName, RealShot, Statement, Tiles } from '../ui/system';

/* Citadel (Rami, 2026-10-09; page 2026-10-10), shaped like apple.com's
   privacy page: one plain promise, what it locks as dark tiles, the three
   steps, free beside Premium, its place in MeridianOS, and the questions.
   The law is nomad-shell/docs/pricing.md: a plan never decides whether you
   can open what you already locked, and app locking keeps out the people
   around you; it is never sold as security. */

const QA = [
  { q: 'What if I forget my PIN?', a: 'A code sent to your email sets a new one.' },
  { q: 'What happens to my files if I stop paying for Premium?', a: 'Nothing. A plan never decides whether you can open what you locked. Without Premium, app locking and the conveniences switch off; your locked folders and files stay locked, and open with your PIN as before.' },
  { q: 'Is locking an app the same as encrypting it?', a: "No. Locking an app keeps the people around you from opening it when you step away. Folders and files are different: what you lock is encrypted, so it stays unreadable even if someone copies it off the computer." },
  {
    q: 'Do I need Citadel if I have MeridianOS?',
    a: 'Not on your desk: every MeridianOS desk can lock folders and files, and Meridian Pro and Ultra include Citadel Premium there. The Citadel app on its own is for a computer outside MeridianOS, with its own subscription.',
  },
];

export default function CitadelPage() {
  return (
    <Layout
      page="citadel"
      local={{
        name: 'Citadel',
        links: [
          { label: 'Overview', href: '/citadel', current: true },
          { label: 'Citadel Premium', href: '/citadel#premium' },
          { label: 'Download', href: '/download#citadel' },
        ],
        cta: { label: 'Download', href: '/download#citadel' },
      }}
    >
      <div data-light="citadel">
        <PageHero
          light="citadel"
          layout="center"
          eyebrow={<ProductName product="citadel" name="Citadel" />}
          title="Keep what's yours, yours."
          lede="Lock any folder or file on your computer behind one PIN. What you lock is encrypted, not just hidden. Free."
          actions={
            <>
              <LinkButton href="/download#citadel" variant="primary" hero>
                Download Citadel
              </LinkButton>
              <More href="#premium">Citadel Premium</More>
            </>
          }
          visual={<RealShot name="citadel-pin" ratio="16 / 10" eager alt="Choosing your Nomad PIN: six boxes, four digits typed, and Set PIN." />}
        />

        <Band label="promise-title">
          <Statement id="promise-title" sub="Locked files are encrypted, so they stay unreadable even if someone copies them off the computer.">
            Locked means encrypted.
          </Statement>
        </Band>

        <Band label="what-title">
          <BandHead id="what-title" title="What you can lock." />
          <Tiles
            items={[
              { title: 'Any folder or file', icon: 'folder', body: 'Pick as many as you like. They are encrypted on the spot, and open again with your PIN.' },
              { title: 'Any app', icon: 'lock', tag: <span className="sys-tag">Premium</span>, body: 'Put an app behind your PIN, so the people around you cannot open your mail or your browser when you step away.' },
              { title: 'Drives you plug in', icon: 'storage', tag: <span className="sys-tag">Premium</span>, body: 'Lock USB sticks and external drives too, with the same PIN.' },
            ]}
          />
        </Band>

        <Band tone="mist" label="steps-title">
          <BandHead id="steps-title" title="Three steps. One PIN for everything." />
          <Columns
            numbered
            align="center"
            items={[
              { title: 'Choose what to lock', body: 'Any folder or file on your computer. Pick as many as you like.' },
              { title: 'Set your PIN', body: 'One six-digit PIN for everything you lock. Forget it, and a code to your email sets a new one.' },
              { title: 'It stays locked', body: 'Locked files are encrypted, so they stay unreadable even if someone copies them off the computer.' },
            ]}
          />
        </Band>

        <Band id="premium" label="premium-title">
          <BandHead id="premium-title" title="Citadel and Citadel Premium." lede="Your files stay yours whether you pay or not: no plan ever decides whether you can open what you locked." />
          <PlanPair
            free={{
              name: 'Citadel',
              price: 'free',
              pitch: 'Lock folders and files, encrypted.',
              lines: ['Lock any **folder or file**', 'Real encryption, not hiding', 'One PIN for everything', 'Reset a forgotten PIN by email'],
              action: { label: 'Download Citadel', href: '/download#citadel' },
            }}
            paid={{
              name: 'Citadel Premium',
              price: 'citadel:premium',
              pitch: 'Lock your apps too. And unlock with a glance.',
              lead: 'Everything in Citadel, plus',
              lines: ['Lock any **app** behind your PIN', 'Unlock with **Windows Hello** or **Touch ID**', 'Auto-lock when you step away or your computer sleeps', 'Lock **USB and external drives**'],
              action: { label: 'Buy Citadel Premium', buy: 'citadel:premium' },
            }}
          />
        </Band>

        <InMeridian
          id="ax-title"
          title="Built into your desk."
          body="Every MeridianOS desk can lock folders and files with Citadel, and Meridian Pro and Ultra include Citadel Premium on the desk. The Citadel app on its own, for a computer outside MeridianOS, has its own subscription."
        />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
