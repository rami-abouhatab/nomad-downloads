import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { Rows, CorpHero, CorpMeridian, GetCards, Section } from '../ui/corp';

/* Polaris, in the corporate system (Rami, 2026-10-18: "visual structure and a professional corporate
   layout"): the block with the real browser beside the words, the facts, the browser in four cards,
   what it is built on, where to get it, and its place in MeridianOS. No plans and no questions: it is
   free and simple. */

export default function PolarisPage() {
  return (
    <Layout
      page="polaris"
      local={{
        name: 'Polaris Browser',
        links: [
          { label: 'Overview', href: '/polaris', current: true },
          { label: 'Pricing', href: '/pricing#polaris' },
          { label: 'Download', href: '/download#polaris' },
        ],
        cta: { label: 'Download', href: '/download#polaris' },
      }}
    >
      <div data-light="polaris" className="corp">
        <CorpHero
          shot={{ name: 'polaris-newtab', alt: 'The Polaris new tab: a star, one search field and the sites you visit most.' }}
          flip
          light="polaris"
          name="Polaris Browser"
          title="The browser, complete."
          lede="Fast, quiet, and free. Polaris keeps ads and trackers out on its own, helps you find the page you read last week, and gets out of the way of everything else."
          actions={
            <>
              <LinkButton href="/download#polaris" variant="primary" hero>
                Download Polaris
              </LinkButton>
              <More href="#features">See what it does</More>
            </>
          }
          facts={[
            { value: 'Free', label: 'Nothing held back, and no account needed to browse' },
            { value: 'Chromium', label: 'The engine under Chrome and Edge' },
            { value: 'Blocking built in', label: 'Ads and trackers kept out, nothing to install' },
            { value: 'Windows 10 and 11', label: 'Intel, AMD and ARM PCs' },
          ]}
        />

        <Section
          id="features-title"
          anchor="features"
          label="Features"
          title="Less browser. More of the page."
          lede="One slim bar, tabs along the top, and nothing on the screen that is not the page or something you asked for."
        >
          <Rows
            items={[
              {
                title: 'A new tab with nothing in the way.',
                icon: 'globe',
                body: 'A new tab opens on one search field and the sites you go to most, over a quiet page. Nothing to scroll past, nothing trying to sell you something.',
              },
              {
                title: 'Find what you meant.',
                icon: 'search',
                body: 'Start typing and Polaris offers what you are after: a search, a tab you already have open, or a page from your history.',
              },
              {
                title: 'Tabs on top, or down the side.',
                icon: 'layers',
                body: 'Keep your tabs along the top, or move them into a sidebar when there are a lot of them.',
              },
              {
                title: 'Set up the way you browse.',
                icon: 'settings',
                body: 'Choose where the tabs go, whether the page sits flush to the window, and what stays in the toolbar.',
              },
            ]}
          />
        </Section>

        <Section id="built-title" label="Under the hood" title="Built on what already works.">
          <Rows
            items={[
              {
                title: 'Sites work as they should',
                icon: 'globe',
                body: 'Polaris is built on Chromium, the engine under Chrome and Edge, so the web looks and behaves the way it was made to.',
              },
              {
                title: 'Ads and trackers, kept out',
                icon: 'shield',
                body: 'Blocking is built in, so there is nothing to install. Turn it down for any site that needs it.',
              },
              {
                title: 'A glance before you go',
                icon: 'eye',
                body: 'Peek at a link without leaving the page you are on. Keep it as a tab only if it was worth it.',
              },
              {
                title: 'One Nomad account',
                icon: 'account',
                body: 'Polaris browses without an account. Sign in with your free Nomad account, the same one as every Nomad app, and Polaris joins the rest of Nomad.',
              },
            ]}
          />
        </Section>

        <Section
          id="get-title"
          label="Download"
          title="Get Polaris."
          lede="Free, with nothing held back. No account needed to browse."
          aside={<More href="/download">All downloads</More>}
        >
          <GetCards anchor="polaris" />
        </Section>

        <CorpMeridian
          id="meridian-title"
          title="Already on your desktop."
          body="Polaris is the browser inside every MeridianOS desktop. Each desktop keeps its own sign-ins, so your work accounts stay on your work desktop."
        />
      </div>
    </Layout>
  );
}
