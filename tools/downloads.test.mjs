// /dl counts what it hands out (the back office's Apps › Downloads, 2026-10-15): serveBuild tells
// onServe the version it streamed, once the installer is on its way, and never for a failed fetch.
// `node --test tools/downloads.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { serveBuild } from '../functions/_lib/releases.js';

const github = (ok = true) => async (url) => {
  if (String(url).includes('api.github.com')) {
    return new Response(
      JSON.stringify([{ tag_name: 'r', draft: false, prerelease: false, assets: [{ name: 'Reach-1.2.0-x64-setup.exe', browser_download_url: 'https://example.invalid/Reach-1.2.0-x64-setup.exe', size: 5 }] }]),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
  return ok ? new Response('bytes') : new Response('nope', { status: 500 });
};

test('a streamed installer is counted with the version it is', async () => {
  const seen = [];
  const res = await serveBuild('reach', 'x64', github(), { version: '1.2.0', onServe: (v) => seen.push(v) });
  assert.equal(res.status, 200);
  assert.deepEqual(seen, ['1.2.0']);
});

test('a download that could not be fetched is not counted', async () => {
  const seen = [];
  const res = await serveBuild('reach', 'x64', github(false), { version: '1.2.0', onServe: (v) => seen.push(v) });
  assert.equal(res.status, 502);
  assert.deepEqual(seen, []);
});
