/**
 * /dl/manifest — what is downloadable right now, as JSON.
 *
 *   /dl/manifest                 MeridianOS, in the original shape (urls /dl/<arch>)
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
import { PRODUCTS, describeManaged, describeProduct, listReleases, managedReleases, productSlug, productUrl } from '../_lib/releases.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Short enough that a fresh release shows up while you are still
      // looking at the page, long enough to not re-ask on every reload.
      'Cache-Control': 'public, max-age=120',
      // Public facts about public downloads; account.nomad.ax reads them for its Apps page.
      'Access-Control-Allow-Origin': '*',
    },
  });

export async function handleManifest(url, fetchImpl = fetch) {
  const asked = url.searchParams.get('product');
  /* The back office's published releases first; an app it does not manage yet is read from the
     downloads repository as before. */
  const [managed, releases] = await Promise.all([managedReleases(fetchImpl), listReleases(fetchImpl)]);
  const describe = (slug, urlFor) =>
    Object.prototype.hasOwnProperty.call(managed, slug) ? describeManaged(slug, managed[slug], urlFor) : describeProduct(releases, slug, urlFor);

  if (asked && asked.toLowerCase() === 'all') {
    const products = {};
    for (const slug of Object.keys(PRODUCTS)) products[slug] = describe(slug, productUrl);
    return json({ products });
  }

  if (asked) {
    const slug = productSlug(asked);
    if (!slug) return json({ error: `Unknown product "${asked}".`, products: Object.keys(PRODUCTS) }, 404);
    return json(describe(slug, productUrl));
  }

  // No product: the original response, for the original page and anything
  // that copied it. MeridianOS, with the short /dl/<arch> urls.
  return json(describe('meridian', (_slug, arch) => `/dl/${arch}`));
}

export function onRequestGet({ request }) {
  return handleManifest(new URL(request.url));
}
