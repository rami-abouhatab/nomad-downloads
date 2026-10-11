import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { Band, BandHead, Columns, FAQ, InMeridian, PageHero, PlanPair, ProductName, RealShot, Tabs } from '../ui/system';

/* Reach, shaped like microsoft.com's Outlook (Rami, 2026-10-10): the name and the line centred and
   the real app large under them (2026-10-11), the app in tabs, each with its own real capture, the
   rest in a row, then free beside Premium, the own-domain story, its place in MeridianOS, and the
   questions. */

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
      <div data-light="reach">
        <PageHero
          light="reach"
          layout="center"
          eyebrow={<ProductName product="reach" name="Reach" />}
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
          note="Free for everyone with a Nomad account. On Windows, or in your browser at reach.nomad.ax."
          visual={<RealShot name="reach-conversation" ratio="16 / 10" eager alt="Reach with a chat open: two people agreeing to meet at three, the chats listed beside it." />}
        />

        <Band label="parts-title">
          <BandHead id="parts-title" title="Everything you need to keep in touch." />
          <Tabs
            product="reach"
            items={[
              {
                title: 'Mail',
                icon: 'mail',
                body: 'Add every mail account you have, personal and work, and read them all in one inbox, or one at a time.',
                visual: <RealShot name="reach-mail-4x3" ratio="4 / 3" alt="Mail in Reach: every inbox together, a thread open with its attachment, and the mailboxes beside it." />,
              },
              {
                title: 'Chat',
                icon: 'send',
                body: 'Message anyone on Nomad by their handle. Unread, groups, pinned and muted chats each have their place, with your recent calls beside them.',
                visual: <RealShot name="reach-chatlist-4x3" ratio="4 / 3" alt="The chats in Reach: all chats, unread, groups, pinned and muted, and recent calls." />,
              },
              {
                title: 'Meetings',
                icon: 'devices',
                body: 'Meet with up to 10 people for up to 40 minutes, with a link anyone can open.',
                visual: <RealShot name="reach-meetings-4x3" ratio="4 / 3" alt="Meetings in Reach, with New meeting and nothing scheduled yet." />,
              },
              {
                title: 'Events',
                icon: 'clock',
                body: 'Your calendar beside your conversations, so the plan and the thread stay together.',
                visual: <RealShot name="reach-calendar-4x3" ratio="4 / 3" alt="The calendar in Reach: a week of October with the month beside it." />,
              },
              {
                title: 'Your way',
                icon: 'layers',
                body: 'Choose which parts of Reach run along the top, in the order you use them, and how it looks.',
                visual: <RealShot name="reach-settings-4x3" ratio="4 / 3" alt="Reach Settings: the theme, and the tabs along the top, each one switched on." />,
              },
            ]}
          />
          <Columns
            cols={2}
            items={[
              { title: 'Calls', icon: 'camera', body: 'Voice and video calls between two people, as long as you like.' },
              { title: 'People', icon: 'account', body: 'Everyone you write to, call or meet, in one list you never had to build.' },
            ]}
          />
        </Band>

        <Band id="premium" tone="mist" label="premium-title">
          <BandHead id="premium-title" title="Choose your Reach." lede="Reach is free for everyone. Reach Premium is for people who meet a lot." />
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
        </Band>

        <InMeridian
          id="meridian-title"
          title="Reach in MeridianOS."
          body="Reach is on every MeridianOS desk. Meridian Pro and Ultra include Reach Premium, and Ultra stretches meetings to 24 hours and 100 people."
        />

        <FAQ items={QA} />
      </div>
    </Layout>
  );
}
