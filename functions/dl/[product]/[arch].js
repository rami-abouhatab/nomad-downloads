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

export async function onRequestGet({ params }) {
  const slug = productSlug(params.product);
  const arch = normaliseArch(params.arch);
  if (!slug || !arch) return notFound('Unknown build.');
  return serveBuild(slug, arch);
}
