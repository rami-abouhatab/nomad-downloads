/**
 * /update/<product>/<channel>/<arch>/latest.yml — what every Nomad app's updater reads
 * (electron-updater's generic provider; nomad-cms/docs/back-office-plan.md §1), and
 * /update/<product>/<channel>/<arch>/release.json — the same release for the app's own window:
 * its notes and the floor below which the update can't be declined.
 *
 * Both come from the back office's live release (release_feed), never from the downloads
 * repository directly: a build uploaded there reaches nobody until it is published. A rollout
 * under 100% is electron-updater's own `stagingPercentage`. Each check is counted, anonymously,
 * by version (the app sends X-Nomad-Version, or ?v= on release.json).
 */
import { rpc } from '../../../../_lib/platform.js';

const PRODUCTS = ['meridian', 'polaris', 'reach', 'drift', 'citadel', 'office', 'folio', 'grids', 'expo', 'markup'];
const CHANNELS = ['stable', 'beta'];
const ARCHES = ['x64', 'arm64'];

const text = (body, status, type) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=60', 'Access-Control-Allow-Origin': '*' },
  });

/** A YAML string, double-quoted and escaped: notes can hold anything. */
const q = (s) => JSON.stringify(String(s ?? ''));

export function latestYml(r) {
  const a = r.asset;
  const lines = [
    `version: ${r.version}`,
    'files:',
    `  - url: ${q(a.url)}`,
    `    sha512: ${q(a.sha512)}`,
    `    size: ${Number(a.size)}`,
    `path: ${q(a.url)}`,
    `sha512: ${q(a.sha512)}`,
    `releaseDate: ${q(r.publishedAt ?? new Date().toISOString())}`,
  ];
  if (r.rollout && r.rollout < 100) lines.push(`stagingPercentage: ${Number(r.rollout)}`);
  if (r.notes) lines.push(`releaseNotes: ${q(r.notes)}`);
  return lines.join('\n') + '\n';
}

export async function handleUpdate(params, request, fetchImpl = fetch, waitUntil = () => {}) {
  const { product, arch, file } = params;
  if (!PRODUCTS.includes(product) || !CHANNELS.includes(params.channel) || !ARCHES.includes(arch)) return text('Unknown feed.', 404, 'text/plain; charset=utf-8');
  if (file !== 'latest.yml' && file !== 'beta.yml' && file !== 'release.json') return text('Unknown file.', 404, 'text/plain; charset=utf-8');
  /* electron-updater's own channel names its file: an app switched to beta asks for beta.yml. */
  const channel = file === 'beta.yml' ? 'beta' : params.channel;

  const url = new URL(request.url);
  const running = request.headers.get('X-Nomad-Version') || url.searchParams.get('v');
  if (running) waitUntil(rpc('note_update_check', { p_product: product, p_channel: channel, p_arch: arch, p_version: running }, fetchImpl));

  const r = await rpc('release_feed', { p_product: product, p_channel: channel, p_arch: arch }, fetchImpl);
  if (file === 'release.json') {
    return text(JSON.stringify(r ? { version: r.version, notes: r.notes, mandatoryBelow: r.mandatoryBelow, publishedAt: r.publishedAt, rollout: r.rollout } : null), 200, 'application/json; charset=utf-8');
  }
  /* No live release: nothing to update to. electron-updater treats a 404 as "no update". */
  if (!r || !r.asset) return text('No release published.', 404, 'text/plain; charset=utf-8');
  return text(latestYml(r), 200, 'text/yaml; charset=utf-8');
}

export function onRequestGet({ params, request, waitUntil }) {
  return handleUpdate(params, request, fetch, waitUntil);
}
