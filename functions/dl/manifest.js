/**
 * /dl/manifest — what is downloadable right now, as JSON.
 *
 *   /dl/manifest                 AX, in the original shape (urls /dl/<arch>)
 *   /dl/manifest?product=reach   one product
 *   /dl/manifest?product=all     every product, under `products`
 *
 * The pages ask this instead of carrying filenames, which is what makes
 * publishing a release a zero-commit operation: upload the installers and the
 * buttons light up on their own, with the right version and sizes.
 *
 * A build with no asset is reported as `null` rather than omitted, so the page
 * can draw a disabled "Soon" button instead of silently dropping a platform
 * someone is waiting for.
 */
import { PRODUCTS, describeProduct, listReleases, productSlug, productUrl } from '../_lib/releases.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Short enough that a fresh release shows up while you are still
      // looking at the page, long enough to not re-ask on every reload.
      'Cache-Control': 'public, max-age=120',
      // account.nomad.ax › Apps & downloads reads this too (2026-10-08). It is
      // public, read-only and carries no credentials, so any origin may.
      'Access-Control-Allow-Origin': '*',
    },
  });

export async function handleManifest(url, fetchImpl = fetch) {
  const asked = url.searchParams.get('product');

  if (asked && asked.toLowerCase() === 'all') {
    const releases = await listReleases(fetchImpl);
    const products = {};
    for (const slug of Object.keys(PRODUCTS)) products[slug] = describeProduct(releases, slug, productUrl);
    return json({ products });
  }

  if (asked) {
    const slug = productSlug(asked);
    if (!slug) return json({ error: `Unknown product "${asked}".`, products: Object.keys(PRODUCTS) }, 404);
    const releases = await listReleases(fetchImpl);
    return json(describeProduct(releases, slug, productUrl));
  }

  // No product: the original response, for the original page and anything
  // that copied it. AX, with the short /dl/<arch> urls.
  const releases = await listReleases(fetchImpl);
  return json(describeProduct(releases, 'ax', (_slug, arch) => `/dl/${arch}`));
}

export function onRequestGet({ request }) {
  return handleManifest(new URL(request.url));
}
