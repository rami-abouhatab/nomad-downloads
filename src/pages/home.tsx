import { Layout } from '../ui/Layout';
import { HeroFilm } from '../ui/HeroFilm';
import { LinkButton, MeridianLockup, More, Sym } from '../ui/kit';
import { AppCards } from '../ui/SuiteCards';
import { checkout } from '../data';
import { PLATFORMS, PlatformMark, useMyPlatform } from '../ui/system';


/* Where the apps run, the platforms' marks and which one this computer is
   live in ui/system.tsx, shared with every product page. */

/* The questions people ask before they start (Rami, 2026-10-10). Every
   answer repeats what /ax, /pricing and the terms already say; platforms are
   left to the section above and privacy to the line below. */
const FAQ = [
  {
    q: 'What is MeridianOS?',
    a: 'A whole desktop that lives in your Nomad account: your apps, your files, your windows and your settings. Sign in on any computer and it opens the way you left it.',
  },
  {
    q: 'What happens when I use another computer?',
    a: 'Install MeridianOS, sign in with your Nomad account, and your desk opens as you left it. Your files and settings live in your account, not on the machine.',
  },
  {
    q: 'How does the free trial work?',
    a: 'Meridian Starter is free for 14 days. You start it, and later change or cancel it, in your Nomad account on the web. Nothing is ever paid inside the app.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. Cancelling stops the next renewal, and your plan runs to the end of the period you paid for.',
  },
  {
    q: 'Can I use the apps without MeridianOS?',
    a: 'Yes. Polaris Browser, Reach and Citadel are free, and Nomad Office and the Premium plans of Reach, Drift and Citadel can be bought on their own. Inside MeridianOS, every plan includes Nomad Office and Pro and Ultra add the Premium plans; outside it, each app has its own subscription.',
  },
  {
    q: 'Do I need a Google or Microsoft account?',
    a: 'No. A Nomad account is your email and a passkey or password. If you want your Gmail, Outlook or Google Drive in MeridianOS, you connect them inside the apps.',
  },
];

export default function HomePage() {
  const mine = useMyPlatform();
  return (
    <Layout page="home">
      <HeroFilm />

      {/* Order (Rami, 2026-10-10): MeridianOS's story together (how it works,
          then the trial), then the suite, then where it runs. */}
      <div className="flow">
        {/* How it works (Rami, 2026-10-10): the hero's promise in three plain
            steps, no device and no mockup: a symbol, a line and a sentence. */}
        <section className="how" aria-labelledby="how-title">
          <div className="wrap">
            <h2 id="how-title" className="how-title">
              Sign in. It&rsquo;s all there.
            </h2>
            <p className="how-lede">Your desktop lives in your Nomad account, not in a computer.</p>
            <ol className="how-steps">
              <li>
                <Sym name="account" size={36} />
                <h3>Sign in on any computer.</h3>
                <p>Your Nomad account is the key. Nothing to set up on the computer in front of you.</p>
              </li>
              <li>
                <Sym name="display" size={36} />
                <h3>Your desk opens as you left it.</h3>
                <p>Apps, files and windows, exactly where they were, down to the open tab.</p>
              </li>
              <li>
                <Sym name="cloud" size={36} />
                <h3>Walk away.</h3>
                <p>Close the lid. Everything is saved, ready for the next computer you sit at.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="panel-section panel-full" aria-labelledby="meridian-title">
          <div className="panel-full-inner">
            <div className="panel panel-meridian">
              {/* apple.com's product tile (Rami, 2026-10-10): 692 px tall like
                  theirs; the name on top, the laptop whole between, the line and
                  the buttons under it. */}
              <h2 id="meridian-title" className="meridian-head">
                <MeridianLockup height={64} label="MeridianOS" className="meridian-head-lockup" />
              </h2>
              <img
                className="panel-meridian-photo"
                src="/assets/hero/meridian-laptop-golden-1774.webp"
                srcSet="/assets/hero/meridian-laptop-golden-1774.webp 1774w, /assets/hero/meridian-laptop-golden-3548.webp 3548w"
                sizes="100vw"
                width={3548}
                height={1774}
                alt="MeridianOS on a laptop: the desktop with its menu bar and dock over a golden desert at sunrise."
                loading="lazy"
                decoding="async"
              />
              <div className="meridian-foot">
                <p className="meridian-line">Every Nomad app built in. Free for 14 days.</p>
                <div className="panel-actions">
                  <LinkButton href={checkout('ax:starter', 'yearly')} variant="primary" hero>
                    Start free trial
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section tiles-section" aria-labelledby="tiles-title">
          <div className="wrap">
            <h2 id="tiles-title" className="tiles-title">
              Nomad Suite
            </h2>
            <AppCards />
            <p className="suite-office">
              Folio, Grids, Expo and Markup come together in Nomad Office.{' '}
              <a href={checkout('office', 'yearly')}>Buy Nomad Office</a>
            </p>
          </div>
        </section>


        {/* Where it runs (Rami, 2026-10-09): microsoft.com's shape for it. No
            block behind it; the promise on the left, the platforms on the right
            as a ruled list, each with its own mark and its own download. */}
        <section className="where" aria-labelledby="everywhere-title">
          <div className="wrap where-inner">
            <div className="where-copy">
              <h2 id="everywhere-title" className="where-title">
                Get Meridian on your computer.
              </h2>
              <p className="where-lede">The desktop and every Nomad app, for Mac and Windows.</p>
            </div>
            <ul className="where-list" aria-label="Available on">
              {PLATFORMS.map((x) => (
                <li key={x.name} className={mine === x ? 'is-mine' : undefined}>
                  <PlatformMark mark={x.mark} />
                  <div className="where-name">
                    <h3>{x.name}</h3>
                    <p>{x.note}</p>
                  </div>
                  {/* One Download each, the same link for every platform (Rami,
                      2026-10-10); the visitor's own reads "for this computer"
                      and its rule is darker. */}
                  <More href={x.href}>{mine === x ? 'Download for this computer' : 'Download'}</More>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The questions, last before the privacy line: the site's own
            disclosure list (.qa, as on /ax), in one centred column like the
            sections above it. */}
        <section className="home-qa" id="questions" aria-labelledby="faq-title">
          <div className="wrap">
            <h2 id="faq-title" className="home-qa-title">
              Frequently asked questions.
            </h2>
            <div className="qa">
              {FAQ.map((it) => (
                <details key={it.q}>
                  <summary>
                    <span>{it.q}</span>
                    <Sym name="caretDown" size={16} className="qa-caret" />
                  </summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

      </div>

    </Layout>
  );
}
