// Tests for the download functions. No dependencies: `node --test tools/`.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  compareVersions,
  describeProduct,
  findBuild,
  parseAsset,
  productSlug,
  productUrl,
  serveBuild,
} from '../functions/_lib/releases.js';
import { handleManifest } from '../functions/dl/manifest.js';
import { onRequestGet as legacyArch } from '../functions/dl/[arch].js';
import { onRequestGet as productArch } from '../functions/dl/[product]/[arch].js';

const asset = (name, size = 1000) => ({ name, size, browser_download_url: `https://gh.example/${name}` });

// Newest first, as GitHub lists them; one release can carry several products.
const RELEASES = [
  {
    tag_name: 'reach-v0.5.0',
    published_at: '2026-10-07T00:00:00Z',
    draft: false,
    prerelease: false,
    assets: [asset('Reach-0.5.0-arm64-setup.exe'), asset('Reach-0.5.0-x64-setup.exe')],
  },
  {
    tag_name: 'v1.0.0-rc',
    published_at: '2026-10-06T00:00:00Z',
    draft: false,
    prerelease: true, // never served
    assets: [asset('AX-1.0.0-arm64-setup.exe')],
  },
  {
    tag_name: 'draft',
    draft: true, // never served
    prerelease: false,
    assets: [asset('Drift-9.9.9-x64-setup.exe')],
  },
  {
    tag_name: 'v0.2.0',
    published_at: '2026-10-05T00:00:00Z',
    draft: false,
    prerelease: false,
    assets: [
      asset('AX-0.2.0-arm64-setup.exe', 111),
      asset('NomadOffice-0.1.0-x64-setup.exe'),
      asset('Polaris-0.3.0-arm64-setup.exe'),
      asset('AX-0.2.0-arm64-setup.exe.blockmap'),
      asset('latest.yml'),
    ],
  },
  {
    tag_name: 'v0.1.2',
    published_at: '2026-09-20T00:00:00Z',
    draft: false,
    prerelease: false,
    assets: [asset('Nomad-0.1.2-arm64-setup.exe'), asset('Nomad-0.1.2-x64-setup.exe', 222)],
  },
];

const published = RELEASES.filter((r) => !r.draft && !r.prerelease);

function fakeFetch(releases = RELEASES) {
  const calls = [];
  const impl = async (url) => {
    calls.push(String(url));
    if (String(url).startsWith('https://api.github.com/')) {
      return new Response(JSON.stringify(releases), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('installer-bytes', { status: 200 });
  };
  impl.calls = calls;
  return impl;
}

test('parseAsset reads product, version and arch, and nothing else', () => {
  assert.deepEqual(parseAsset('AX-1.2.3-arm64-setup.exe'), { prefix: 'AX', version: '1.2.3', arch: 'arm64' });
  assert.deepEqual(parseAsset('NomadOffice-0.1.0-x64-setup.exe'), { prefix: 'NomadOffice', version: '0.1.0', arch: 'x64' });
  assert.deepEqual(parseAsset('Reach-1.0.0-beta.2-x64-setup.exe'), { prefix: 'Reach', version: '1.0.0-beta.2', arch: 'x64' });
  assert.equal(parseAsset('AX-1.2.3-arm64-setup.exe.blockmap'), null);
  assert.equal(parseAsset('latest.yml'), null);
  assert.equal(parseAsset('AX-1.2.3-ia32-setup.exe'), null);
  assert.equal(parseAsset('AX-1.2.3-xarm64-setup.exe'), null);
});

test('compareVersions orders numerically and puts pre-releases first', () => {
  assert.equal(compareVersions('0.10.0', '0.9.9'), 1);
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
  assert.equal(compareVersions('1.0', '1.0.0'), 0);
  assert.equal(compareVersions('1.0.0-beta', '1.0.0'), -1);
  assert.equal(compareVersions('1.0.0', '1.0.0-beta'), 1);
});

test('productSlug accepts the asset names and friendly spellings', () => {
  assert.equal(productSlug('AX'), 'ax');
  assert.equal(productSlug('NomadOffice'), 'office');
  assert.equal(productSlug('nomad-office'), 'office');
  assert.equal(productSlug('Polaris'), 'polaris');
  assert.equal(productSlug('toString'), null);
  assert.equal(productSlug(''), null);
});

test('findBuild picks the newest version of the product across releases', () => {
  const ax = findBuild(published, 'ax', 'arm64');
  assert.equal(ax.asset.name, 'AX-0.2.0-arm64-setup.exe');
  assert.equal(ax.version, '0.2.0');
  // AX has no newer x64 build yet: the legacy Nomad- build still serves it.
  assert.equal(findBuild(published, 'ax', 'x64').asset.name, 'Nomad-0.1.2-x64-setup.exe');
  assert.equal(findBuild(published, 'reach', 'x64').asset.name, 'Reach-0.5.0-x64-setup.exe');
  assert.equal(findBuild(published, 'office', 'x64').asset.name, 'NomadOffice-0.1.0-x64-setup.exe');
  assert.equal(findBuild(published, 'office', 'arm64'), null);
  assert.equal(findBuild(published, 'drift', 'x64'), null);
});

test('findBuild prefers the current name when a version exists under both', () => {
  const both = [{ assets: [asset('Nomad-2.0.0-x64-setup.exe'), asset('AX-2.0.0-x64-setup.exe')] }];
  assert.equal(findBuild(both, 'ax', 'x64').asset.name, 'AX-2.0.0-x64-setup.exe');
});

test('describeProduct reports missing builds as null', () => {
  const d = describeProduct(published, 'polaris', productUrl);
  assert.equal(d.name, 'Polaris Browser');
  assert.equal(d.version, '0.3.0');
  assert.equal(d.builds.arm64.url, '/dl/polaris/arm64');
  assert.equal(d.builds.x64, null);
});

test('manifest without a product keeps the original AX shape and urls', async () => {
  const res = await handleManifest(new URL('https://nomad.ax/dl/manifest'), fakeFetch());
  const body = await res.json();
  assert.equal(body.version, '0.2.0');
  assert.equal(body.builds.arm64.url, '/dl/arm64');
  assert.equal(body.builds.x64.url, '/dl/x64');
  assert.equal(body.builds.x64.size, 222);
});

test('manifest?product=all lists every product; drafts and pre-releases never show', async () => {
  const res = await handleManifest(new URL('https://nomad.ax/dl/manifest?product=all'), fakeFetch());
  const { products } = await res.json();
  assert.deepEqual(Object.keys(products).sort(), ['ax', 'drift', 'office', 'polaris', 'reach']);
  assert.equal(products.drift.builds.x64, null);
  assert.equal(products.ax.builds.arm64.file, 'AX-0.2.0-arm64-setup.exe');
  assert.equal(products.reach.builds.arm64.url, '/dl/reach/arm64');
});

test('manifest?product=unknown is a 404 with the list of products', async () => {
  const res = await handleManifest(new URL('https://nomad.ax/dl/manifest?product=word'), fakeFetch());
  assert.equal(res.status, 404);
  assert.ok((await res.json()).products.includes('office'));
});

test('serveBuild streams the asset with a download filename', async () => {
  const f = fakeFetch();
  const res = await serveBuild('reach', 'arm64', f);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Content-Disposition'), 'attachment; filename="Reach-0.5.0-arm64-setup.exe"');
  assert.equal(await res.text(), 'installer-bytes');
  assert.equal(f.calls.at(-1), 'https://gh.example/Reach-0.5.0-arm64-setup.exe');
});

test('serveBuild says plainly when a build is not out yet', async () => {
  const res = await serveBuild('drift', 'x64', fakeFetch());
  assert.equal(res.status, 404);
  assert.match(await res.text(), /No x64 build of Drift/);
});

test('route handlers reject unknown products and arches', async () => {
  assert.equal((await legacyArch({ params: { arch: 'ia32' } })).status, 404);
  assert.equal((await productArch({ params: { product: 'word', arch: 'x64' } })).status, 404);
  assert.equal((await productArch({ params: { product: 'reach', arch: 'mips' } })).status, 404);
});
