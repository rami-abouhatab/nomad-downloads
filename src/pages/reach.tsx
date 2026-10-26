import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { FAQ, PlanPair } from '../ui/system';
import { Rows, CorpHero, CorpMeridian, GetCards, Section } from '../ui/corp';

/* Reach, in the corporate system (Rami, 2026-10-18): the block with the real app beside the words,
   the facts, the app in cards (mail and chat large, then meetings, events and settings, then calls
   and people), free beside Premium, where to get it, its place in MeridianOS, and the questions. */

const QA = [
  { q: 'Is Reach free?', a: 'Yes, for everyone with a Nomad account: as many mail accounts as you have, chat, one-to-one calls, meetings up to 40 minutes and 10 people, events and people. Reach Premium adds more.' },
  { q: 'Which mail accounts can I add?', a: 'As many as you have: Gmail, Outlook and Microsoft 365, iCloud, Yahoo, and your work email at any provider that offers IMAP. All in one app.' },
  { q: 'How long can meetings be?', a: 'Up to 40 minutes and 10 people on Reach, 4 hours and 50 people on Reach Premium, and 24 hours and 100 people on Meridian Ultra.' },
];

export default function ReachPage() {
  return (
    <Layout
      page="reach"
      local={{
        name: 'Reach',
        links: [
          { label: 'Overview', href: '/reach', current: true },
          { label: 'Reach Premium', href: '/reach#premium' },
          { label: 'On the web', href: 'https://reach.nomad.ax' },
          { label: 'Download', href: '/download#reach' },
        ],
        cta: { label: 'Download', href: '/download#reach' },
      }}
    >
      <div data-light="reach" className="corp">
        <CorpHero
          shot={{ name: 'reach-conversation', alt: 'Reach with a chat open: two people agreeing to meet, the chats listed beside it.' }}
          light="reach"
          name="Reach"
          title="Everyone, in one place."
          lede="Your mail, your chats and your calls, in one calm window. Bring every mail account you have, talk to anyone on Nomad, and meet face to face. Free."
          actions={
            <>
              <LinkButton href="/download#reach" variant="primary" hero>
                Download Reach
              </LinkButton>
              <More href="https://reach.nomad.ax">Use Reach on the web</More>
            </>
          }
          note="Free for everyone with a Nomad account."
          facts={[
            { value: 'Free', label: 'For everyone with a Nomad account' },
            { value: 'Every mail account', label: 'Gmail, Outlook, iCloud, Yahoo and IMAP' },
            { value: 'Meetings', label: 'Up to 40 minutes and 10 people, free' },
            { value: 'App and web', label: 'On Windows, or at reach.nomad.ax' },
          ]}
        />

        <Section id="parts-title" anchor="features" label="Features" title="Everything you need to keep in touch.">
          <Rows
            items={[
              {
                title: 'Mail',
                icon: 'mail',
                body: 'Add every mail account you have, personal and work, and read them all in one inbox, or one at a time.',
              },
              {
                title: 'Chat',
                icon: 'send',
                body: 'Message anyone on Nomad by their handle. Unread, groups, pinned and muted chats each have their place, with your recent calls beside them.',
              },
              {
                title: 'Meetings',
                icon: 'devices',
                body: 'Meet with up to 10 people for up to 40 minutes, with a link anyone can open.',
              },
              {
                title: 'Events',
                icon: 'clock',
                body: 'Your calendar beside your conversations, so the plan and the thread stay together.',
              },
            ]}
          />
          <Rows
            items={[
              { title: 'Calls', icon: 'camera', body: 'Voice and video calls between two people, as long as you like.' },
              { title: 'People', icon: 'account', body: 'Everyone you write to, call or meet, in one list you never had to build.' },
              {
                title: 'Your way',
                icon: 'layers',
                body: 'Choose which parts of Reach run along the top, in the order you use them, and how it looks.',
              },
            ]}
          />
        </Section>

        <Section
          id="premium-title"
          anchor="premium"
          tone="mist"
          label="Plans"
          title="Choose your Reach."
          lede="Reach is free for everyone. Reach Premium is for people who meet a lot."
        >
          <PlanPair
            free={{
              name: 'Reach',
              price: 'free',
              pitch: 'Everything you need to keep in touch.',
              lines: ['**Every mail account** you have, personal and work', 'Chat with anyone on Nomad', 'One-to-one voice and video calls', 'Meetings up to **40 minutes** and **10 people**', 'Events and people'],
              action: { label: 'Download Reach', href: '/download#reach' },
            }}
            paid={{
              name: 'Reach Premium',
              price: 'reach:premium',
              pitch: 'Longer, bigger meetings.',
              lead: 'Everything in Reach, plus',
              lines: [
                'Meetings up to **4 hours** and **50 people**',
                'Meeting recordings',
                'Scheduled send and snooze',
              ],
              action: { label: 'Buy Reach Premium', buy: 'reach:premium' },
            }}
          />
        </Section>

        <Section
          id="get-title"
          label="Download"
          title="Get Reach."
          lede="Install it on Windows, or use it in any browser."
          aside={<More href="/download">All downloads</More>}
        >
          <GetCards anchor="reach" web={{ href: 'https://reach.nomad.ax', host: 'reach.nomad.ax' }} />
        </Section>

        <CorpMeridian
          id="meridian-title"
          title="Reach in MeridianOS."
          body="Reach is on every MeridianOS desktop. Meridian Pro and Ultra include Reach Premium, and Ultra stretches meetings to 24 hours and 100 people."
                />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
