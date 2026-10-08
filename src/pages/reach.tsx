import { Layout } from '../ui/Layout';
import { Features, Hero, InAx, SectionHead, SinglePlan, WindowShot } from '../ui/blocks';
import { LinkButton, More, ProductMark } from '../ui/kit';

export default function ReachPage() {
  return (
    <Layout
      page="reach"
      local={{
        name: 'Reach',
        links: [
          { label: 'Overview', href: '/reach', current: true },
          { label: 'Reach Premium', href: '/reach#premium' },
          { label: 'Download', href: '/download#reach' },
        ],
        cta: { label: 'Download', href: '/download#reach' },
      }}
    >
      <Hero
        mark={<ProductMark product="reach" size={112} />}
        name="Reach"
        title={
          <>
            Everyone,
            <br />
            in one place.
          </>
        }
        lede="Your mail, your chats and your calls, in one calm window. Bring every mail account you have, talk to anyone on Nomad, and meet face to face. Free."
        actions={
          <>
            <LinkButton href="/download#reach" variant="primary" hero>
              Download Reach
            </LinkButton>
            <More href="#premium">Reach Premium</More>
          </>
        }
        note="Free for everyone with a Nomad account. For Windows 10 and 11."
      >
        <div className="wrap hero-media">
          <WindowShot
            name="reach-chat"
            priority
            alt="Reach on Chat: a list of conversations on the left and one open conversation, with voice call, video call and search above it."
          />
        </div>
      </Hero>

      <section className="section band" aria-labelledby="free-title">
        <div className="wrap">
          <SectionHead id="free-title" eyebrow="Reach · free" title="Everything you need to keep in touch." />
          <Features
            items={[
              { title: 'All your mail', body: 'Add as many Gmail and Outlook accounts as you have, and keep them all in one app.' },
              { title: 'Chat', body: 'Message anyone on Nomad by their handle.' },
              { title: 'Calls', body: 'Voice and video calls between two people, as long as you like.' },
              { title: 'Meetings', body: 'Meet with up to 10 people for up to 40 minutes, with a link anyone can open.' },
              { title: 'Events', body: 'Your calendar beside your conversations, so the plan and the thread stay together.' },
              { title: 'People', body: 'Everyone you write to, call or meet, in one list you never had to build.' },
            ]}
          />
        </div>
      </section>

      <SinglePlan
        id="premium"
        eyebrow="Reach Premium"
        title={
          <>
            Longer meetings.
            <br />
            <span className="dim">Your own address.</span>
          </>
        }
        lede="For people who meet a lot, and want mail at their own domain."
        product="reach:premium"
        name="Reach Premium"
        cta="Buy Reach Premium"
        lead="Everything in Reach, plus"
        lines={[
          'Meetings up to **4 hours** and **50 people**',
          'Meeting recordings',
          'Scheduled send and snooze',
          'Your own domain, with one mailbox and unlimited aliases',
          'More mailboxes for $1.99 a month each',
        ]}
      />

      <section className="section" aria-labelledby="domain-title">
        <div className="wrap split">
          <div className="split-copy reveal">
            <p className="eyebrow">Reach Premium</p>
            <h2 id="domain-title" className="headline">
              Mail at your own domain.
            </h2>
          </div>
          <div className="split-copy reveal">
            <p className="body">
              Bring a domain you own and Reach sets up a mailbox on it, like you@yourname.com, plus as many aliases as you want: hello@,
              invoices@, anything@. The mailbox is hosted by Zoho Mail and lives in Reach beside your other accounts. Need a second mailbox
              on the same domain? Add one for $1.99 a month.
            </p>
          </div>
        </div>
      </section>

      <InAx
        id="ax-title"
        title="Reach in AX."
        body="Reach is on every AX desk. AX Pro and Ultra include Reach Premium, and Ultra stretches meetings to 24 hours and 100 people."
      />
    </Layout>
  );
}
