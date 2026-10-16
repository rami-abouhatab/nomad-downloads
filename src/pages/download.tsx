import { useEffect, useState, type ReactNode } from 'react';
import { Layout } from '../ui/Layout';
import { Band, BandHead, PageHero } from '../ui/system';
import { LinkButton, ProductMark, Sym, type ProductKey } from '../ui/kit';
import { DRIFT_WEB } from '../data';

/**
 * Every app as a tile (Rami, 2026-10-14: restyled with the shop, as account.nomad.ax's Apps &
 * downloads): its mark, what it is and what it needs, its version and size, and one Download.
 *
 * Every link works before (and without) the script: /dl/<product>/<arch>
 * streams the newest build, or says plainly that it is not out yet. Before the
 * page knows this computer it offers both builds; after hydration it asks
 * /dl/manifest?product=all for versions and sizes, and the browser for its
 * architecture, and the tile offers the build for this PC with the other beside it.
 */

type Arch = 'x64' | 'arm64';
type Build = { url?: string; size?: number } | null;
type Info = { version?: string | null; builds?: Partial<Record<Arch, Build>> };
type Manifest = { products?: Record<string, Info> };

const ARCH: { id: Arch; label: string; base: string }[] = [
  { id: 'x64', label: 'for Intel or AMD', base: 'Windows 10 and 11, 64-bit' },
  { id: 'arm64', label: 'for ARM', base: 'Snapdragon and other ARM64 PCs' },
];

/** A product as the download URLs say it: MeridianOS is `meridian`, never `ax` (Rami, 2026-10-11). */
const dlSlug = (id: ProductKey) => (id === 'ax' ? 'meridian' : id);

/* `web`: the app is also on the web (Reach and Drift: desktop apps since 2026-10-14, web apps since
   10-12). Its web address sits beside the download, and leads until a desktop build is published. */
const PRODUCTS: { id: ProductKey; name: string; short: string; what: string; need: ReactNode; web?: string }[] = [
  {
    id: 'ax',
    name: 'MeridianOS',
    short: 'MeridianOS',
    what: 'The desktop that lives in your account.',
    need: (
      <>
        Needs a MeridianOS plan. <a href="/meridian#plans">Meridian Starter is free for 14 days.</a>
      </>
    ),
  },
  { id: 'polaris', name: 'Polaris Browser', short: 'Polaris', what: 'The browser, complete.', need: 'Free. No account needed to browse.' },
  {
    id: 'reach',
    name: 'Reach',
    short: 'Reach',
    what: 'Mail, chat and calls, together.',
    web: 'https://reach.nomad.ax/?install=1',
    need: (
      <>
        Free with a Nomad account. <a href="/reach#premium">Reach Premium</a> adds more. A desktop app for Windows, and the same Reach on the
        web at <a href="https://reach.nomad.ax">reach.nomad.ax</a>.
      </>
    ),
  },
  {
    id: 'drift',
    name: 'Drift',
    short: 'Drift',
    what: 'The Drift app, for sending straight to your devices.',
    web: `${DRIFT_WEB}/?install=1`,
    need: (
      <>
        Free with a Nomad account; <a href="/drift#premium">Drift Premium</a> adds sending straight to your devices. A desktop app for Windows,
        and the same Drift on the web at <a href={DRIFT_WEB}>drift.nomad.ax</a>.
      </>
    ),
  },
  {
    id: 'citadel',
    name: 'Citadel',
    short: 'Citadel',
    what: 'Lock what is yours.',
    need: (
      <>
        Free. <a href="/citadel#premium">Citadel Premium</a> locks apps too.
      </>
    ),
  },
  {
    /* One download installs the four, as Microsoft Office installs Word, Excel and PowerPoint (Rami,
       2026-10-16: "Office will install the 4 apps"). Windows only: Reach and Drift are the only apps on
       the web (2026-10-14). */
    id: 'office',
    name: 'Nomad Office',
    short: 'Nomad Office',
    what: 'Folio, Grids, Expo and Markup, installed together.',
    need: (
      <>
        Documents, workbooks, slides and PDFs in Word, Excel and PowerPoint's own files. Needs a <a href="/office#buy">Nomad Office</a> subscription,
        already on every MeridianOS desk.
      </>
    ),
  },
];

/**
 * Which build this machine wants. `navigator.userAgentData` is the only
 * honest source on Windows on ARM: the classic user-agent string reports an
 * ARM64 machine as `Win64; x64` on purpose. Without it, recommend nothing
 * rather than guess wrong.
 */
async function detectArch(): Promise<Arch | null> {
  const d = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> } })
    .userAgentData;
  if (!d?.getHighEntropyValues) return null;
  try {
    const v = await d.getHighEntropyValues(['architecture']);
    return v.architecture === 'arm' ? 'arm64' : v.architecture === 'x86' ? 'x64' : null;
  } catch {
    return null;
  }
}

const mb = (bytes?: number) => (bytes ? `${Math.round(bytes / 1024 / 1024)} MB` : '');

export default function DownloadPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [arch, setArch] = useState<Arch | null>(null);

  useEffect(() => {
    let live = true;
    fetch('/dl/manifest?product=all', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((m) => live && setManifest(m));
    detectArch().then((a) => live && setArch(a));
    return () => {
      live = false;
    };
  }, []);

  return (
    <Layout page="download">
      <div data-light="neutral">
      <PageHero
        light="neutral"
        layout="center"
        eyebrow="Download"
        title="Get Nomad's apps."
        lede="Everything here runs on Windows 10 and 11. Each app has a build for Intel and AMD PCs and one for ARM; we point out the one that fits this computer."
      />

      <Band label="dl-title">
        <h2 id="dl-title" className="vh">
          Downloads
        </h2>
        <div className="dl-grid">
          {PRODUCTS.map((p) => {
            const info = manifest?.products?.[dlSlug(p.id)];
            const build = (a: Arch) => info?.builds?.[a];
            const out = (a: Arch) => !info || Boolean(build(a)?.url);
            const href = (a: Arch) => build(a)?.url ?? `/dl/${dlSlug(p.id)}/${a}`;
            const other: Arch | null = arch ? (arch === 'x64' ? 'arm64' : 'x64') : null;
            const size = arch ? build(arch)?.size : undefined;
            /* Reach and Drift are desktop apps that are also on the web (2026-10-14): the download once
               one is published, the web beside it; before that, the web leads. */
            const webLeads = Boolean(p.web) && Boolean(info) && !info?.version;
            const webUrl = p.web?.replace('/?install=1', '').replace('?install=1', '');
            const meta = webLeads
              ? 'The desktop app is coming soon · on the web now'
              : info
                ? info.version
                  ? `Version ${info.version}${size ? ` · ${mb(size)}` : ''}`
                  : 'Not released yet'
                : 'For Windows 10 and 11';
            return (
              <article className="dl-tile" id={p.id === 'ax' ? 'meridian' : p.id} key={p.id} aria-labelledby={`dl-${p.id}`}>
                <ProductMark product={p.id} size={56} />
                <h2 id={`dl-${p.id}`} className="dl-tile-name">
                  {p.name}
                </h2>
                <p className="dl-tile-what">{p.what}</p>
                <p className="dl-tile-need">{p.need}</p>
                <p className="dl-tile-meta">{meta}</p>
                <div className="dl-tile-verbs">
                  {webLeads ? (
                    <LinkButton href={webUrl!} variant="primary" size="md" icon={<Sym name="globe" size={16} />}>
                      Open {p.short} on the web
                    </LinkButton>
                  ) : info && !info.version ? (
                    <span className="dl-soon">Coming soon</span>
                  ) : arch && out(arch) ? (
                    <LinkButton href={href(arch)} variant="primary" size="md" download icon={<Sym name="download" size={16} />}>
                      Download
                    </LinkButton>
                  ) : (
                    ARCH.filter((a) => out(a.id)).map((a, i) => (
                      <LinkButton key={a.id} href={href(a.id)} variant={i === 0 ? 'primary' : 'secondary'} size="md" download icon={<Sym name="download" size={16} />}>
                        {a.id === 'x64' ? 'Intel or AMD' : 'ARM'}
                      </LinkButton>
                    ))
                  )}
                  {p.web && !webLeads ? (
                    <LinkButton href={webUrl!} size="md" icon={<Sym name="globe" size={16} />}>
                      Use it on the web
                    </LinkButton>
                  ) : null}
                </div>
                {!webLeads && arch && other && out(other) && (!info || info.version) ? (
                  <a className="dl-tile-other" href={href(other)} download>
                    Also for {other === 'x64' ? 'Intel and AMD' : 'ARM'} computers
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </Band>

      <Band id="which" tone="mist" label="which-title">
        <BandHead id="which-title" title="Which download is mine?" />
          <p className="sys-lede which-copy">
            Not sure which PC you have? Intel and AMD is the usual answer; ARM means a Snapdragon or similar chip. The apps install for your
            Windows user alone, so they need no administrator, and they uninstall from Windows' own list of apps. Until our builds are
            code-signed, Windows may warn that the publisher is unknown.
          </p>
      </Band>
      </div>
    </Layout>
  );
}
