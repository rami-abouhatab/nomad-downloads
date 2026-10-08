/**
 * /dl/<arch> — the original download link, from before Nomad had more than
 * one product. It always meant the desktop, so it still serves AX.
 * Every other product lives at /dl/<product>/<arch>.
 *
 * The bytes live on GitHub releases; everything a person visits is served
 * from our own domain. Pages caps a single file at 25 MB, so the installers
 * could never have lived beside the page regardless. See ../_lib/releases.js.
 */
import { normaliseArch, notFound, serveBuild } from '../_lib/releases.js';

export async function onRequestGet({ params }) {
  const arch = normaliseArch(params.arch);
  if (!arch) return notFound('Unknown build.');
  return serveBuild('ax', arch);
}
