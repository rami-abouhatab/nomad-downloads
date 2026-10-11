import { Layout } from '../ui/Layout';
import { LinkButton, More } from '../ui/kit';
import { Band, BandHead, Chapters, Columns, InMeridian, PageHero, Platforms, ProductName, RealShot, Statement } from '../ui/system';

/* Polaris, shaped like apple.com's Safari (Rami, 2026-10-10): the name and the line centred, the
   real browser large under them (2026-10-11), one sentence, then the browser in chapters, each
   with its own real capture, what it is built on, where to get it, and its place in MeridianOS.
   No plans and no questions: it is free and simple. */

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
      <div data-light="polaris">
        <PageHero
          light="polaris"
          layout="center"
          eyebrow={<ProductName product="polaris" name="Polaris Browser" />}
          title="The browser, complete."
          lede="Fast, quiet, and free. Polaris keeps ads and trackers out on its own, helps you find the page you read last week, and gets out of the way of everything else."
          actions={
            <>
              <LinkButton href="/download#polaris" variant="primary" hero>
                Download Polaris
              </LinkButton>
              <More href="#chapters">See what it does</More>
            </>
          }
          note="Free, with nothing held back."
          visual={<RealShot name="polaris-page" ratio="16 / 10" eager alt="Polaris Browser with three tabs along the top and a Wikipedia article open, flush to the window." />}
        />

        <Band label="less-title">
          <Statement id="less-title" sub="One slim bar, tabs along the top, and nothing on the screen that is not the page or something you asked for.">
            Less browser. More of the page.
          </Statement>
        </Band>

        <Band id="chapters" label="chapters-title">
          <h2 id="chapters-title" className="vh">
            What Polaris does
          </h2>
          <Chapters
            product="polaris"
            items={[
              {
                title: 'A new tab with nothing in the way.',
                icon: 'globe',
                body: 'A new tab opens on one search field and the sites you go to most, over a quiet page. Nothing to scroll past, nothing trying to sell you something.',
                visual: <RealShot name="polaris-newtab-4x3" ratio="4 / 3" alt="A new tab in Polaris: one search field and five site shortcuts over the Polaris wordmark." />,
              },
              {
                title: 'Find what you meant.',
                icon: 'search',
                body: 'Start typing and Polaris offers what you are after: a search, a tab you already have open, or a page from your history.',
                visual: <RealShot name="polaris-suggest-4x3" ratio="4 / 3" alt="The Polaris address field open, suggesting a search, two open tabs and pages from history." />,
              },
              {
                title: 'Tabs on top, or down the side.',
                icon: 'layers',
                body: 'Keep your tabs along the top, or move them into a sidebar when there are a lot of them.',
                visual: <RealShot name="polaris-sidebar-4x3" ratio="4 / 3" alt="Polaris with its tabs in a sidebar on the left of the page." />,
              },
              {
                title: 'Set up the way you browse.',
                icon: 'settings',
                body: 'Choose where the tabs go, whether the page sits flush to the window, and what stays in the toolbar.',
                visual: <RealShot name="polaris-settings-4x3" ratio="4 / 3" alt="Polaris Settings, Appearance: where the tabs go, page edges set to Flush, and the toolbar buttons." />,
              },
            ]}
          />
        </Band>

        <Band tone="mist" label="built-title">
          <BandHead id="built-title" title="Built on what already works." />
          <Columns
            cols={4}
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
        </Band>

        <Band label="get-title">
          <BandHead id="get-title" title="Get Polaris." lede="Free, with nothing held back. No account needed to browse." />
          <Platforms anchor="polaris" />
        </Band>

        <InMeridian
          id="ax-title"
          title="Already on your desk."
          body="Polaris is the browser inside every MeridianOS desk. Each desk keeps its own sign-ins, so your work accounts stay on your work desk."
        />
      </div>
    </Layout>
  );
}
