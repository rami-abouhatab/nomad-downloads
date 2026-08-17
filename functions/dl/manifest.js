import { assetFor, latestRelease } from './[arch].js';

/**
 * What is downloadable right now, as JSON.
 *
 * The page asks this instead of carrying hardcoded filenames, which is what
 * makes publishing a release a *zero-commit* operation: upload two installers
 * and the buttons light up on their own, with the right version and the right
 * sizes. The previous shape — a `RELEASE` object edited by a script — meant
 * every publish touched the page, and a publish that forgot to would leave
 * live buttons pointing at a version that no longer existed.
 *
 * A build with no asset is reported as `null` rather than omitted, so the page
 * can draw a disabled card that says "soon" instead of silently dropping a
 * platform someone is waiting for.
 */
export async function onRequestGet() {
  const release = await latestRelease();

  const describe = (arch) => {
    const asset = assetFor(release, arch);
    return asset ? { file: asset.name, size: asset.size, url: `/dl/${arch}` } : null;
  };

  const body = {
    version: release?.tag_name?.replace(/^v/, '') ?? null,
    published: release?.published_at ?? null,
    builds: { arm64: describe('arm64'), x64: describe('x64') },
  };

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Short enough that a fresh release shows up while you are still
      // looking at the page, long enough to not re-ask on every reload.
      'Cache-Control': 'public, max-age=120',
    },
  });
}
