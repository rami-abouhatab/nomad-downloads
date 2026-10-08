import { Layout } from '../ui/Layout';
import { AX_DESK, Display, Hero, SectionHead } from '../ui/blocks';
import { LinkButton, More, ProductMark, type ProductKey } from '../ui/kit';
import { SIGN_IN, SIGN_UP, checkout } from '../data';

type Card = {
  product: ProductKey;
  name: string;
  title: string;
  body: string;
  price: string;
  href: string;
  verb: { label: string; href: string };
};

const CARDS: Card[] = [
  {
    product: 'polaris',
    name: 'Polaris Browser',
    title: 'The browser, complete.',
    body: 'Fast and quiet. It blocks ads and trackers on its own, and helps you find the pages you read last week.',
    price: 'Free',
    href: '/polaris',
    verb: { label: 'Download', href: '/download#polaris' },
  },
  {
    product: 'reach',
    name: 'Reach',
    title: 'Mail, chat and calls, together.',
    body: 'Every mail account you have, chats with anyone on Nomad, calls and meetings, in one calm window.',
    price: 'Free · Premium from $4.99 a month',
    href: '/reach',
    verb: { label: 'Download', href: '/download#reach' },
  },
  {
    product: 'drift',
    name: 'Drift',
    title: 'Send a file with a link.',
    body: 'Drop a file up to 2 GB, share the link, done. Premium sends straight to your phone or another PC.',
    price: 'Free · Premium from $2.99 a month',
    href: '/drift',
    verb: { label: 'Send a file', href: 'https://drift.nomad.ax' },
  },
  {
    product: 'office',
    name: 'Nomad Office',
    title: 'Documents, sheets, slides and PDFs.',
    body: 'Folio, Grids, Expo and Markup, installed on your own computer. Already inside every AX plan.',
    price: '$5.99 a month · in every AX plan',
    href: '/office',
    verb: { label: 'Buy', href: checkout('office', 'yearly') },
  },
];

export default function HomePage() {
  return (
    <Layout page="home">
      <Hero
        name="Nomad"
        title={
          <>
            Wherever
            <br />
            you are.
          </>
        }
        lede="Nomad makes a desktop that lives in your account, and the apps that go with it: a browser, a home for your mail and calls, a quick way to send files, and an office suite. One Nomad account opens all of them."
        actions={
          <>
            <LinkButton href="/ax" variant="primary" hero>
              Meet AX
            </LinkButton>
            <More href="/pricing">See pricing</More>
          </>
        }
      >
        <div className="wrap hero-media">
          <Display {...AX_DESK} priority />
        </div>
      </Hero>

      <section className="section band" id="products" aria-labelledby="products-title">
        <div className="wrap">
          <SectionHead id="products-title" eyebrow="Products" title="Everything Nomad makes." />

          <article className="ax-card reveal" aria-labelledby="card-ax">
            <div className="ax-card-copy">
              <ProductMark product="ax" size={64} />
              <p className="eyebrow">AX · the desktop</p>
              <h3 id="card-ax" className="title-lg">
                Your whole desk, in your account.
              </h3>
              <p className="body">
                Sign in on any computer and your desk opens as you left it: your apps, your files, your windows, even the tabs you had open.
              </p>
              <p className="card-price">From $9.99 a month · 14 days free</p>
              <div className="card-links">
                <More href="/ax">Learn more</More>
                <More href={checkout('ax:starter', 'yearly')}>Start free trial</More>
              </div>
            </div>
            <img
              className="ax-card-shot"
              src="/assets/shots/ax-desk-800.webp"
              srcSet="/assets/shots/ax-desk-800.webp 800w, /assets/shots/ax-desk-1280.webp 1280w"
              sizes="(min-width: 900px) 560px, 92vw"
              width={1920}
              height={1080}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </article>

          <div className="cards">
            {CARDS.map((c) => (
              <article className="card reveal" key={c.product} aria-labelledby={`card-${c.product}`}>
                <ProductMark product={c.product} size={56} />
                <p className="eyebrow">{c.name}</p>
                <h3 id={`card-${c.product}`} className="title">
                  {c.title}
                </h3>
                <p className="body">{c.body}</p>
                <p className="card-price">{c.price}</p>
                <div className="card-links">
                  <More href={c.href}>Learn more</More>
                  <More href={c.verb.href}>{c.verb.label}</More>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="account" aria-labelledby="account-title">
        <div className="wrap split">
          <div className="split-copy reveal">
            <p className="eyebrow">One Nomad account</p>
            <h2 id="account-title" className="headline">
              One account.
              <br />
              <span className="dim">Everything opens with it.</span>
            </h2>
          </div>
          <div className="split-copy reveal">
            <p className="lede">
              Make it once with your email, then sign in with a passkey or a password. Your plans, your apps and your desk all belong to
              that one account.
            </p>
            <p className="body">
              You never need a Google, Apple or Microsoft account to use Nomad. Bringing in your Gmail or Google Drive is something you can
              do later, inside the apps, and undo any time.
            </p>
            <div className="actions">
              <LinkButton href={SIGN_UP} variant="primary" hero>
                Create your account
              </LinkButton>
              <More href={SIGN_IN}>Sign in</More>
            </div>
          </div>
        </div>
      </section>

      <section className="section band" id="about" aria-labelledby="about-title">
        <div className="wrap split">
          <div className="split-copy reveal">
            <p className="eyebrow">About Nomad</p>
            <h2 id="about-title" className="headline">
              Software that follows you,
              <br />
              <span className="dim">not your computer.</span>
            </h2>
          </div>
          <div className="split-copy reveal">
            <p className="body">
              Nomad is the company. It makes AX, the desktop that lives in your account, and the apps that go with it: Polaris Browser,
              Reach, Drift and Nomad Office. Every one of them works inside AX, and most work on their own on your computer too.
            </p>
            <p className="body">
              Plans and payments happen on the web, in your Nomad account, and never inside an app. We do not sell your data, we do not
              show you ads, and we do not use your files to train anything.
            </p>
            <More href="/privacy">How Nomad handles your data</More>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="start-title">
        <div className="wrap">
          <SectionHead
            id="start-title"
            center
            title="Try AX free for 14 days."
            lede="Start on AX Starter. Office, Polaris Browser, Reach and Drift come with it."
          >
            <div className="actions">
              <LinkButton href={checkout('ax:starter', 'yearly')} variant="primary" hero>
                Start free trial
              </LinkButton>
              <More href="/pricing">Compare plans</More>
            </div>
          </SectionHead>
        </div>
      </section>
    </Layout>
  );
}
