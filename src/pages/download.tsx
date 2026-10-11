import { useEffect, useState, type ReactNode } from 'react';
import { Layout } from '../ui/Layout';
import { Band, BandHead, PageHero } from '../ui/system';
import { ProductMark, Sym, type ProductKey } from '../ui/kit';
import { DRIFT_WEB } from '../data';

/**
 * Every link works before (and without) the script: /dl/<product>/<arch>
 * streams the newest build, or says plainly that it is not out yet. After
 * hydration the page asks /dl/manifest?product=all for versions and sizes,
 * and the browser for its architecture, and marks the build for this PC.
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

const PRODUCTS: { id: ProductKey; name: string; short: string; what: string; need: ReactNode }[] = [
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
    need: (
      <>
        Free with a Nomad account. <a href="/reach#premium">Reach Premium</a> adds more.
      </>
    ),
  },
  {
    id: 'drift',
    name: 'Drift',
    short: 'Drift',
    what: 'The Drift app, for sending straight to your devices.',
    need: (
      <>
        Needs <a href="/drift#premium">Drift Premium</a>. To send a link, no download: <a href={DRIFT_WEB}>drift.nomad.ax</a>.
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
    id: 'office',
    name: 'Nomad Office',
    short: 'Nomad Office',
    what: 'Folio, Grids, Expo and Markup.',
    need: (
      <>
        Needs <a href="/office#buy">Nomad Office</a>. Already on every MeridianOS desk.
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
        <div className="dl-list">
          {PRODUCTS.map((p) => {
            const info = manifest?.products?.[dlSlug(p.id)];
            return (
              <article className="dl-product" id={p.id === 'ax' ? 'meridian' : p.id} key={p.id} aria-labelledby={`dl-${p.id}`}>
                <ProductMark product={p.id} size={64} />
                <div className="dl-copy">
                  <h2 id={`dl-${p.id}`} className="title">
                    {p.name}
                  </h2>
                  <p className="body">{p.what}</p>
                  <p className="small">{p.need}</p>
                  {info && <p className="dl-version small">{info.version ? `Version ${info.version}` : 'Not released yet'}</p>}
                </div>
                <div className="dl-builds">
                  {ARCH.map((a) => {
                    const build = info?.builds?.[a.id];
                    const pending = Boolean(info) && !build?.url;
                    const match = !pending && Boolean(build?.url) && arch === a.id;
                    const href = build?.url ?? `/dl/${dlSlug(p.id)}/${a.id}`;
                    const meta = build?.size ? `${a.base} · ${mb(build.size)}` : a.base;
                    return (
                      <a
                        key={a.id}
                        className={['dl', match ? 'match' : '', pending ? 'pending' : ''].filter(Boolean).join(' ')}
                        href={pending ? undefined : href}
                        aria-disabled={pending || undefined}
                        download={pending ? undefined : true}
                      >
                        <Sym name="download" size={20} className="dl-glyph" />
                        <span className="dl-body">
                          <span className="dl-name">
                            {p.short} {a.label}
                          </span>
                          <span className="dl-meta">{meta}</span>
                        </span>
                        {(match || pending) && <span className="dl-tag">{match ? 'For this PC' : 'Soon'}</span>}
                      </a>
                    );
                  })}
                </div>
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
