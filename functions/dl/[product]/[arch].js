/**
 * /dl/<product>/<arch> — streams the newest published installer of one
 * product for one architecture (arm64 or x64).
 *
 * Products: meridian (ax works too), polaris, reach, drift, citadel, folio, grids, expo, markup.
 * The release is looked up, never hardcoded: publishing a version is
 * uploading `<Product>-<version>-<arch>-setup.exe` to a release in
 * rami-abouhatab/nomad-downloads, and nothing here or in the pages changes.
 */
import { normaliseArch, notFound, productSlug, serveBuild } from '../../_lib/releases.js';
import { rpc } from '../../_lib/platform.js';

export async function onRequestGet({ params, request, waitUntil }) {
  const slug = productSlug(params.product);
  const arch = normaliseArch(params.arch);
  if (!slug || !arch) return notFound('Unknown build.');
  /* ?v=1.2.0 asks for one exact build (the back office measuring a draft before it publishes). */
  const v = new URL(request.url).searchParams.get('v');
  const version = v && /^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(v) ? v : null;
  /* A person's download is counted (a number per day, app, platform and version, nothing about them);
     the back office measuring one exact build (?v=) is not a download. */
  const onServe = version ? null : (served) => waitUntil(rpc('note_download', { p_product: slug, p_arch: arch, p_version: served }));
  return serveBuild(slug, arch, fetch, { version, origin: request.headers.get('Origin'), onServe });
}
