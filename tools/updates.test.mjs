// The back office's releases on nomad.ax: the update feed every app reads, and the download page
// and /dl preferring published releases over the downloads repository. `node --test tools/`.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { handleUpdate, latestYml } from '../functions/update/[product]/[channel]/[arch]/[file].js';
import { handleManifest } from '../functions/dl/manifest.js';
import { serveBuild } from '../functions/_lib/releases.js';

const SHA = `${'A'.repeat(86)}==`;
const LIVE = {
  product: 'reach',
  channel: 'stable',
  version: '0.5.0',
  notes: 'Faster mail: "threads" open at once.',
  rollout: 25,
  mandatoryBelow: '0.3.0',
  publishedAt: '2026-10-11T12:00:00Z',
  asset: { arch: 'x64', file: 'Reach-0.5.0-x64-setup.exe', url: 'https://github.com/rami-abouhatab/nomad-downloads/releases/download/r/Reach-0.5.0-x64-setup.exe', size: 98000000, sha512: SHA },
};

/** A platform that answers release_feed / release_downloads, counts note_update_check, and a GitHub with one old Reach. */
function platform({ feed = LIVE, downloads = {} } = {}) {
  const calls = [];
  const impl = async (url, init) => {
    const u = String(url);
    calls.push({ url: u, body: init?.body ?? null });
    if (u.endsWith('/rpc/release_feed')) return new Response(JSON.stringify(feed));
    if (u.endsWith('/rpc/release_downloads')) return new Response(JSON.stringify(downloads));
    if (u.endsWith('/rpc/note_update_check')) return new Response('');
    if (u.startsWith('https://api.github.com/')) {
      return new Response(JSON.stringify([{ draft: false, prerelease: false, published_at: '2026-09-01T00:00:00Z', assets: [
        { name: 'Reach-0.4.0-x64-setup.exe', size: 1, browser_download_url: 'https://github.com/x/Reach-0.4.0-x64-setup.exe' },
        { name: 'Reach-0.6.0-x64-setup.exe', size: 1, browser_download_url: 'https://github.com/x/Reach-0.6.0-x64-setup.exe' },
      ] }]));
    }
    return new Response('installer-bytes');
  };
  impl.calls = calls;
  return impl;
}

test('latest.yml is electron-updater’s own shape, with the rollout as stagingPercentage', () => {
  const yml = latestYml(LIVE);
  assert.match(yml, /^version: 0\.5\.0$/m);
  assert.match(yml, /^ {2}- url: "https:\/\/github\.com\/.+Reach-0\.5\.0-x64-setup\.exe"$/m);
  assert.match(yml, new RegExp(`^sha512: "${SHA.replace(/[+/=]/g, '\\$&')}"$`, 'm'));
  assert.match(yml, /^stagingPercentage: 25$/m);
  assert.match(yml, /^releaseNotes: "Faster mail: \\"threads\\" open at once\."$/m);
  assert.doesNotMatch(latestYml({ ...LIVE, rollout: 100 }), /stagingPercentage/);
});

test('the feed answers only known apps, channels and arches, and 404s when nothing is live', async () => {
  const req = (h = {}) => new Request('https://nomad.ax/update/x', { headers: h });
  assert.equal((await handleUpdate({ product: 'evil', channel: 'stable', arch: 'x64', file: 'latest.yml' }, req(), platform())).status, 404);
  assert.equal((await handleUpdate({ product: 'reach', channel: 'nightly', arch: 'x64', file: 'latest.yml' }, req(), platform())).status, 404);
  assert.equal((await handleUpdate({ product: 'reach', channel: 'stable', arch: 'x64', file: 'secrets.txt' }, req(), platform())).status, 404);
  assert.equal((await handleUpdate({ product: 'reach', channel: 'stable', arch: 'x64', file: 'latest.yml' }, req(), platform({ feed: null }))).status, 404);
  const ok = await handleUpdate({ product: 'reach', channel: 'stable', arch: 'x64', file: 'latest.yml' }, req(), platform());
  assert.equal(ok.status, 200);
  assert.match(await ok.text(), /version: 0\.5\.0/);
});

test('release.json carries the notes and the update floor; a check is counted by the version it reports', async () => {
  const f = platform();
  const pending = [];
  const res = await handleUpdate({ product: 'reach', channel: 'stable', arch: 'x64', file: 'release.json' }, new Request('https://nomad.ax/u?v=0.4.0'), f, (p) => pending.push(p));
  assert.deepEqual(await res.json(), { version: '0.5.0', notes: LIVE.notes, mandatoryBelow: '0.3.0', publishedAt: LIVE.publishedAt, rollout: 25 });
  await Promise.all(pending);
  const counted = f.calls.find((c) => c.url.endsWith('/rpc/note_update_check'));
  assert.deepEqual(JSON.parse(counted.body), { p_product: 'reach', p_channel: 'stable', p_arch: 'x64', p_version: '0.4.0' });
});

test('a managed app’s published release wins over a newer upload in the downloads repository', async () => {
  const downloads = { reach: { version: '0.5.0', publishedAt: LIVE.publishedAt, assets: [LIVE.asset] }, drift: null };
  const all = await (await handleManifest(new URL('https://nomad.ax/dl/manifest?product=all'), platform({ downloads }))).json();
  assert.equal(all.products.reach.version, '0.5.0', 'not the unpublished 0.6.0 on GitHub');
  assert.equal(all.products.reach.builds.x64.file, 'Reach-0.5.0-x64-setup.exe');
  assert.equal(all.products.drift.version, null, 'managed with nothing live: nothing offered');
  const unmanaged = await (await handleManifest(new URL('https://nomad.ax/dl/manifest?product=all'), platform({ downloads: {} }))).json();
  assert.equal(unmanaged.products.reach.version, null, 'every app but MeridianOS is the back office’s: an upload alone offers nothing');
});

test('/dl serves the published installer, and one exact version to the back office with its CORS header', async () => {
  const downloads = { reach: { version: '0.5.0', assets: [LIVE.asset] } };
  const f = platform({ downloads });
  const res = await serveBuild('reach', 'x64', f);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('Content-Disposition'), /Reach-0\.5\.0-x64-setup\.exe/);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
  const draft = await serveBuild('reach', 'x64', platform({ downloads }), { version: '0.6.0', origin: 'https://cms.nomad.ax' });
  assert.match(draft.headers.get('Content-Disposition'), /Reach-0\.6\.0-x64-setup\.exe/);
  assert.equal(draft.headers.get('Access-Control-Allow-Origin'), 'https://cms.nomad.ax');
  const stranger = await serveBuild('reach', 'x64', platform({ downloads }), { version: '0.6.0', origin: 'https://evil.example' });
  assert.equal(stranger.headers.get('Access-Control-Allow-Origin'), null);
});

test('an app switched to beta asks for beta.yml, and gets the beta channel', async () => {
  const f = platform();
  const res = await handleUpdate({ product: 'office', channel: 'stable', arch: 'x64', file: 'beta.yml' }, new Request('https://nomad.ax/u'), f);
  assert.equal(res.status, 200);
  const asked = f.calls.find((c) => c.url.endsWith('/rpc/release_feed'));
  assert.equal(JSON.parse(asked.body).p_channel, 'beta');
});
