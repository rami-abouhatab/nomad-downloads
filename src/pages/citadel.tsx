import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { FAQ, PlanPair, RealShot } from '../ui/system';
import { Cards, CorpHero, CorpMeridian, GetCards, Section } from '../ui/corp';

/* Citadel (Rami, 2026-10-09; page 2026-10-10; corporate system 2026-10-18): the block with the PIN
   beside the words, the facts, what it locks under the one plain promise, the three steps, free
   beside Premium, where to get it, its place in MeridianOS, and the questions.
   The law is nomad-shell/docs/pricing.md: a plan never decides whether you
   can open what you already locked, and app locking keeps out the people
   around you; it is never sold as security. */

const QA = [
  { q: 'What if I forget my PIN?', a: 'A code sent to your email sets a new one.' },
  { q: 'What happens to my files if I stop paying for Premium?', a: 'Nothing. A plan never decides whether you can open what you locked. Without Premium, app locking and the conveniences switch off; your locked folders and files stay locked, and open with your PIN as before.' },
  { q: 'Is locking an app the same as encrypting it?', a: "No. Locking an app keeps the people around you from opening it when you step away. Folders and files are different: what you lock is encrypted, so it stays unreadable even if someone copies it off the computer." },
  {
    q: 'Do I need Citadel if I have MeridianOS?',
    a: 'Not on your desktop: every MeridianOS desktop can lock folders and files, and Meridian Pro and Ultra include Citadel Premium there. Citadel Premium on its own has its own subscription and works everywhere, your desktop included, so on Meridian Starter it is the way to add just Citadel.',
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
      <div data-light="citadel" className="corp">
        <CorpHero
          light="citadel"
          name="Citadel"
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
          visual={<RealShot name="citadel-files" ratio="16 / 10" eager alt="Citadel: files and folders locked on this computer and in the cloud, and a place to drop more to lock." />}
          facts={[
            { value: 'Free', label: 'Lock as many folders and files as you like' },
            { value: 'Encrypted', label: 'Unreadable even if someone copies it' },
            { value: 'One PIN', label: 'Six digits, for everything you lock' },
            { value: 'Windows 10 and 11', label: 'Intel, AMD and ARM PCs' },
          ]}
        />

        <Section
          id="what-title"
          anchor="features"
          label="What you can lock"
          title="Locked means encrypted."
          lede="Locked files are encrypted, so they stay unreadable even if someone copies them off the computer."
        >
          <Cards
            cols={3}
            items={[
              {
                title: 'Any folder or file',
                icon: 'folder',
                body: 'Pick as many as you like, on this computer or on a drive you plug in. They are encrypted on the spot, and open again with your PIN.',
              },
              {
                title: 'Any app',
                icon: 'lock',
                tag: <span className="sys-tag">Premium</span>,
                body: 'Put an app behind your PIN, so the people around you cannot open your mail or your browser when you step away.',
              },
              {
                title: 'Your Vault',
                icon: 'shield',
                tag: <span className="sys-tag">Premium</span>,
                body: 'What you keep in your Vault is sealed with your key, and Nomad cannot read it. Open it with your Citadel PIN, from any computer where you use Citadel.',
              },
            ]}
          />
        </Section>

        <Section id="steps-title" anchor="how" label="How it works" title="Three steps. One PIN for everything.">
          <Cards
            cols={3}
            items={[
              { n: 1, title: 'Choose what to lock', body: 'Any folder or file on your computer. Pick as many as you like.' },
              { n: 2, title: 'Set your PIN', body: 'One six-digit PIN for everything you lock. Forget it, and a code to your email sets a new one.' },
              { n: 3, title: 'It stays locked', body: 'Locked files are encrypted, so they stay unreadable even if someone copies them off the computer.' },
            ]}
          />
        </Section>

        <Section
          id="premium-title"
          anchor="premium"
          tone="mist"
          label="Plans"
          title="Citadel and Citadel Premium."
          lede="Your files stay yours whether you pay or not: no plan ever decides whether you can open what you locked."
        >
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
              lines: ['Lock any **app** behind your PIN', 'Unlock with **Windows Hello** or **Touch ID**', 'Auto-lock when you step away or your computer sleeps', '**Cloud locks** and a **50 GB** Vault'],
              action: { label: 'Buy Citadel Premium', buy: 'citadel:premium' },
            }}
          />
        </Section>

        <Section id="get-title" label="Download" title="Get Citadel." lede="Free, with your Nomad account." aside={<More href="/download">All downloads</More>}>
          <GetCards anchor="citadel" />
        </Section>

        <CorpMeridian
          id="meridian-title"
          title="Built into your desktop."
          body="Every MeridianOS desktop can lock folders and files with Citadel, and Meridian Pro and Ultra include Citadel Premium on the desktop. Citadel Premium on its own has its own subscription, and works on your desktop too."
                />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
