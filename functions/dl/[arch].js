/**
 * Serves a Nomad installer from nomad.devapps.cc.
 *
 * The bytes live on a GitHub release; hosting stays Cloudflare. That split is
 * the same one `fits-demo-download-proxy` already makes for the Fits APK, and
 * it is the right one: GitHub is a byte store the way it is a code store,
 * while everything a person actually visits is served from our own domain.
 * Pages caps a single file at 25 MB, so the installers could never have lived
 * beside the page regardless.
 *
 * A Pages Function rather than a standalone Worker, so it ships with the site
 * in one deploy instead of being a second thing to remember.
 *
 * The release is looked up rather than hardcoded. Publishing a new version
 * then means uploading two files — no edit here, no edit to the page.
 */

const REPO = 'rami-abouhatab/nomad-downloads';

/** GitHub refuses requests without one, with a 403 that explains nothing. */
const UA = { 'User-Agent': 'nomad-downloads (nomad.devapps.cc)' };

/**
 * The newest release that actually has assets.
 *
 * `/releases/latest` skips drafts and pre-releases, which is what we want —
 * a draft exists precisely so it is not downloadable yet.
 */
export async function latestRelease() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: UA,
    // Releases change rarely and this sits in front of a 100 MB download;
    // a five-minute edge cache costs nothing and spares the API budget.
    cf: { cacheTtl: 300, cacheEverything: true },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Matches on `-arm64-` and `-x64-` with the dashes, not a bare substring.
 * `x64` appears inside `arm64`'s neighbours often enough that a loose
 * `includes` would eventually hand someone the wrong architecture, and the
 * failure — an app that installs and refuses to launch — is opaque.
 */
export function assetFor(release, arch) {
  if (!release?.assets) return null;
  return release.assets.find((a) => a.name.includes(`-${arch}-`)) ?? null;
}

export async function onRequestGet({ params }) {
  const arch = String(params.arch || '').toLowerCase();
  if (arch !== 'arm64' && arch !== 'x64') {
    return new Response('Unknown build.', { status: 404 });
  }

  const release = await latestRelease();
  const asset = assetFor(release, arch);
  if (!asset) {
    // Said plainly rather than as a bare 404: at this stage the usual reason
    // is that the build genuinely is not out yet, and a person who clicked a
    // download button deserves to be told which of those it is.
    return new Response(
      `No ${arch} build has been published yet. See https://nomad.devapps.cc`,
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  const upstream = await fetch(asset.browser_download_url, { headers: UA });
  if (!upstream.ok || !upstream.body) {
    return new Response('The download is temporarily unavailable.', { status: 502 });
  }

  // Streamed, not buffered: a Worker holding 100 MB in memory to hand it on
  // is a Worker that will eventually be killed for holding 100 MB in memory.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(asset.size),
      'Content-Disposition': `attachment; filename="${asset.name}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
