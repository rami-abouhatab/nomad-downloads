import { Layout } from '../ui/Layout';
import { Features, Hero, InAx, SectionHead } from '../ui/blocks';
import { LinkButton, More, ProductMark } from '../ui/kit';

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
      <Hero
        mark={<ProductMark product="polaris" size={112} />}
        name="Polaris Browser"
        title={
          <>
            The browser,
            <br />
            complete.
          </>
        }
        lede="Fast, quiet, and free. Polaris keeps ads and trackers out on its own, helps you find the page you read last week, and gets out of the way of everything else."
        actions={
          <>
            <LinkButton href="/download#polaris" variant="primary" hero>
              Download Polaris
            </LinkButton>
            <More href="/pricing#polaris">Pricing</More>
          </>
        }
        note="Free, with nothing held back. For Windows 10 and 11."
      >
        <div className="wrap hero-media">
          <figure className="window-shot">
            <img
              src="/assets/shots/polaris-window-1080.webp"
              srcSet="/assets/shots/polaris-window-720.webp 720w, /assets/shots/polaris-window-1080.webp 1080w"
              sizes="(min-width: 1140px) 1080px, 92vw"
              width={1080}
              height={700}
              alt="Polaris Browser on a new tab: tabs in a sidebar on the left, one slim bar with the address field, and a search field in the middle of the page."
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>
      </Hero>

      <section className="section band" aria-labelledby="why-title">
        <div className="wrap">
          <SectionHead
            id="why-title"
            title={
              <>
                Less browser.
                <br />
                <span className="dim">More of the page.</span>
              </>
            }
          />
          <Features
            items={[
              {
                title: 'Ads and trackers, kept out',
                body: 'Blocking is built in, so there is nothing to install. Turn it down for any site that needs it, and see what was kept away.',
              },
              {
                title: 'Find what you read',
                body: 'Polaris remembers the pages you actually read, not the ones you bounced off, so you can search for them later by what was on them.',
              },
              { title: 'A glance before you go', body: 'Peek at a link without leaving the page you are on. Keep it as a tab only if it was worth it.' },
              {
                title: 'Sites work as they should',
                body: 'Polaris is built on Chromium, the engine under Chrome and Edge, so the web looks and behaves the way it was made to.',
              },
              {
                title: 'Your sign-ins, if you want',
                body: "Sign in with your Nomad account and the sites you are signed in to come with you to your next computer. Or don't; Polaris works fully without an account.",
              },
              { title: 'Calm by design', body: 'One slim bar, tabs in a sidebar, and nothing on the screen that is not the page or something you asked for.' },
            ]}
          />
        </div>
      </section>

      <InAx
        id="ax-title"
        title="Already on your desk."
        body="Polaris is the browser inside every AX desk. Each desk keeps its own sign-ins, so your work accounts stay on your work desk."
      />
    </Layout>
  );
}
