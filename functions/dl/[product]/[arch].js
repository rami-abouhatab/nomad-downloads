/**
 * /dl/<product>/<arch> — streams the newest published installer of one
 * product for one architecture (arm64 or x64).
 *
 * Products: ax, polaris, reach, drift, office (nomadoffice also works).
 * The release is looked up, never hardcoded: publishing a version is
 * uploading `<Product>-<version>-<arch>-setup.exe` to a release in
 * rami-abouhatab/nomad-downloads, and nothing here or in the pages changes.
 */
import { normaliseArch, notFound, productSlug, serveBuild } from '../../_lib/releases.js';

export async function onRequestGet({ params, request }) {
  const slug = productSlug(params.product);
  const arch = normaliseArch(params.arch);
  if (!slug || !arch) return notFound('Unknown build.');
  /* ?v=1.2.0 asks for one exact build (the back office measuring a draft before it publishes). */
  const v = new URL(request.url).searchParams.get('v');
  const version = v && /^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(v) ? v : null;
  return serveBuild(slug, arch, fetch, { version, origin: request.headers.get('Origin') });
}
