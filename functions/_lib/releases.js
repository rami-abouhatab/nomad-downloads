/**
 * Which installers exist, read from the GitHub releases of
 * rami-abouhatab/nomad-downloads.
 *
 * Every Nomad product publishes into the same repository, and each product
 * ships on its own schedule, so "the latest release" no longer answers "the
 * latest Reach". Instead every published release is read, every asset is
 * parsed by name, and the newest version of the asked-for product and
 * architecture wins:
 *
 *     <Product>-<version>-<arch>-setup.exe
 *     MeridianOS-1.0.0-arm64-setup.exe · Reach-0.4.2-x64-setup.exe · NomadOffice-…
 *
 * Builds published before the products were named say `Nomad-…`; they are
 * AX's, so AX accepts both prefixes. That keeps `/dl/arm64` (the old link
 * printed in emails and the old page) serving the desktop.
 *
 * This file exports no `onRequest*` handler, so Pages does not route it; it
 * is only imported by the functions under /dl.
 */

export const REPO = 'rami-abouhatab/nomad-downloads';

/** GitHub refuses requests without one, with a 403 that explains nothing. */
import { rpc } from './platform.js';

export const UA = { 'User-Agent': 'nomad-downloads (nomad.ax)' };

export const ARCHES = ['arm64', 'x64'];

/**
 * The products, keyed by the slug used in URLs. `prefixes` are the asset name
 * prefixes that belong to the product, the first being today's.
 */
export const PRODUCTS = {
  meridian: { name: 'MeridianOS', prefixes: ['MeridianOS', 'AX', 'Nomad'] },
  polaris: { name: 'Polaris Browser', prefixes: ['Polaris'] },
  reach: { name: 'Reach', prefixes: ['Reach'] },
  drift: { name: 'Drift', prefixes: ['Drift'] },
  citadel: { name: 'Citadel', prefixes: ['Citadel'] },
  office: { name: 'Nomad Office', prefixes: ['NomadOffice'] },
};

/** Spellings people (and older links) use for a product, mapped to its slug. */
const ALIASES = {
  meridian: 'meridian',
  meridianos: 'meridian',
  ax: 'meridian', // the old name; links from before 2026-10-11 still say it
  nomad: 'meridian',
  desktop: 'meridian',
  polaris: 'polaris',
  'polaris-browser': 'polaris',
  reach: 'reach',
  drift: 'drift',
  citadel: 'citadel',
  office: 'office',
  nomadoffice: 'office',
  'nomad-office': 'office',
};

export function productSlug(value) {
  const key = String(value ?? '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ALIASES, key) ? ALIASES[key] : null;
}

export function normaliseArch(value) {
  const arch = String(value ?? '').trim().toLowerCase();
  return ARCHES.includes(arch) ? arch : null;
}

/**
 * `AX-1.2.0-arm64-setup.exe` → { prefix: 'AX', version: '1.2.0', arch: 'arm64' }.
 *
 * The architecture is matched as a whole dash-delimited field, never as a
 * substring: `x64` sits inside `arm64`'s neighbourhood often enough that a
 * loose `includes` would one day hand someone the wrong build, and that
 * failure (an app that installs and refuses to start) is opaque.
 */
const ASSET = /^([A-Za-z][A-Za-z0-9]*)-(\d+(?:\.\d+){0,3}(?:-[0-9A-Za-z.]+)?)-(arm64|x64)-setup\.exe$/;

export function parseAsset(name) {
  const m = ASSET.exec(String(name ?? ''));
  if (!m) return null;
  return { prefix: m[1], version: m[2], arch: m[3] };
}

/**
 * Semver-ish comparison: numeric fields left to right, and a pre-release
 * (`1.0.0-beta.1`) sorts below its release. Enough for our own tags; we never
 * publish build metadata.
 */
export function compareVersions(a, b) {
  const [ca, pa = null] = String(a).split(/-(.*)/s);
  const [cb, pb = null] = String(b).split(/-(.*)/s);
  const na = ca.split('.').map(Number);
  const nb = cb.split('.').map(Number);
  for (let i = 0; i < Math.max(na.length, nb.length); i++) {
    const d = (na[i] ?? 0) - (nb[i] ?? 0);
    if (d) return d < 0 ? -1 : 1;
  }
  if (pa === pb) return 0;
  if (pa === null) return 1;
  if (pb === null) return -1;
  return pa < pb ? -1 : 1;
}

/**
 * Every published release. Drafts and pre-releases are skipped on purpose: a
 * draft exists precisely so it is not downloadable yet.
 */
export async function listReleases(fetchImpl = fetch) {
  const res = await fetchImpl(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
    headers: { ...UA, Accept: 'application/vnd.github+json' },
    // Releases change rarely and this sits in front of 100 MB downloads;
    // a five-minute edge cache costs nothing and spares the API budget.
    cf: { cacheTtl: 300, cacheEverything: true },
  });
  if (!res.ok) return [];
  const body = await res.json();
  if (!Array.isArray(body)) return [];
  return body.filter((r) => r && !r.draft && !r.prerelease && Array.isArray(r.assets));
}

/**
 * The newest build of `slug` for `arch` across all releases, or null.
 * Returns the asset plus the version parsed from its name (not the release
 * tag: one release can carry several products at different versions).
 */
export function findBuild(releases, slug, arch) {
  const product = PRODUCTS[slug];
  if (!product || !ARCHES.includes(arch)) return null;
  const prefixes = product.prefixes.map((p) => p.toLowerCase());
  let best = null;
  for (const release of releases ?? []) {
    for (const asset of release.assets ?? []) {
      const parsed = parseAsset(asset.name);
      if (!parsed || parsed.arch !== arch) continue;
      const rank = prefixes.indexOf(parsed.prefix.toLowerCase());
      if (rank === -1) continue;
      const candidate = { asset, release, version: parsed.version, rank };
      if (
        !best ||
        compareVersions(candidate.version, best.version) > 0 ||
        // Same version under both names: today's name wins over the legacy one.
        (compareVersions(candidate.version, best.version) === 0 && rank < best.rank)
      ) {
        best = candidate;
      }
    }
  }
  return best && { asset: best.asset, release: best.release, version: best.version };
}

/** What the download page needs to know about one product. */
export function describeProduct(releases, slug, urlFor) {
  const builds = {};
  let version = null;
  let published = null;
  for (const arch of ARCHES) {
    const found = findBuild(releases, slug, arch);
    builds[arch] = found
      ? { file: found.asset.name, size: found.asset.size, version: found.version, url: urlFor(slug, arch) }
      : null;
    if (found && (!version || compareVersions(found.version, version) > 0)) {
      version = found.version;
      published = found.release.published_at ?? null;
    }
  }
  return { product: slug, name: PRODUCTS[slug].name, version, published, builds };
}

export const productUrl = (slug, arch) => `/dl/${slug}/${arch}`;

/** One exact version of `slug` for `arch` in the downloads repository, or null. */
export function findVersion(releases, slug, arch, version) {
  const product = PRODUCTS[slug];
  if (!product || !ARCHES.includes(arch)) return null;
  const prefixes = product.prefixes.map((p) => p.toLowerCase());
  for (const release of releases ?? []) {
    for (const asset of release.assets ?? []) {
      const parsed = parseAsset(asset.name);
      if (parsed && parsed.arch === arch && parsed.version === version && prefixes.includes(parsed.prefix.toLowerCase())) {
        return { asset, release, version };
      }
    }
  }
  return null;
}

/**
 * The back office's releases (nomad-cms/docs/back-office-plan.md §1): for every app it manages,
 * its live stable release, or null while none is live. An app absent from this map is not managed
 * yet and is read from the downloads repository as before.
 */
export async function managedReleases(fetchImpl = fetch) {
  const map = await rpc('release_downloads', {}, fetchImpl);
  return map && typeof map === 'object' ? map : {};
}

/** A managed app's live release as the manifest describes a product. */
export function describeManaged(slug, live, urlFor) {
  const builds = {};
  for (const arch of ARCHES) {
    const a = live?.assets?.find((x) => x.arch === arch);
    builds[arch] = a ? { file: a.file, size: a.size, version: live.version, url: urlFor(slug, arch) } : null;
  }
  return { product: slug, name: PRODUCTS[slug].name, version: live?.version ?? null, published: live?.publishedAt ?? null, builds };
}

/** The back office measures installers in the browser (SHA-512), so it may read them from here. */
const MEASURERS = ['https://cms.nomad.ax', 'http://127.0.0.1:5310', 'http://localhost:5310'];

/**
 * Streams one build to the person who asked for it: the published release when the back office
 * manages the app, else the newest in the downloads repository. `version` asks for one exact
 * build (the back office measuring a draft).
 */
export async function serveBuild(slug, arch, fetchImpl = fetch, { version = null, origin = null } = {}) {
  const product = PRODUCTS[slug];
  let file = null;
  let url = null;
  let size = null;
  if (version) {
    const found = findVersion(await listReleases(fetchImpl), slug, arch, version);
    if (found) ({ name: file, browser_download_url: url, size } = found.asset);
  } else {
    const managed = await managedReleases(fetchImpl);
    if (Object.prototype.hasOwnProperty.call(managed, slug)) {
      const a = managed[slug]?.assets?.find((x) => x.arch === arch);
      if (a) ({ file, url, size } = a);
    } else {
      const found = findBuild(await listReleases(fetchImpl), slug, arch);
      if (found) ({ name: file, browser_download_url: url, size } = found.asset);
    }
  }
  if (!url) {
    // Said plainly rather than as a bare 404: at this stage the usual reason
    // is that the build genuinely is not out yet, and a person who clicked a
    // download button deserves to be told which of those it is.
    return new Response(
      `No ${arch} build of ${product.name}${version ? ` ${version}` : ''} has been published yet. See https://nomad.ax/download`,
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  const upstream = await fetchImpl(url, { headers: UA });
  if (!upstream.ok || !upstream.body) {
    return new Response('The download is temporarily unavailable. Try again in a minute.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Streamed, not buffered: a Worker holding 100 MB in memory to hand it on
  // is a Worker that will eventually be killed for holding 100 MB in memory.
  const headers = {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${file}"`,
    'Cache-Control': 'public, max-age=3600',
  };
  if (size) headers['Content-Length'] = String(size);
  if (origin && MEASURERS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Disposition';
    headers.Vary = 'Origin';
  }
  return new Response(upstream.body, { headers });
}

export function notFound(text) {
  return new Response(text, { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
