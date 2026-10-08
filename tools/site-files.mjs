// Which files make up the BUILT site (dist/), shared by the tools.
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
/** What `npm run build` writes and what is deployed. */
export const DIST = join(ROOT, 'dist');

/** Folders in dist/ that are not ours to check as pages: the shell's build, hashed output, images. */
const SKIP = new Set(['desk', '_s', 'assets']);

/** Every .html page in dist/, as a forward-slash path relative to dist/. */
export function pages(dir = DIST) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP.has(name)) out.push(...pages(full));
    } else if (name.endsWith('.html')) {
      out.push(relative(DIST, full).split(sep).join('/'));
    }
  }
  return out.sort();
}

/** The URL a page is served at by Cloudflare Pages: `ax.html` → `/ax`. */
export function routeOf(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return '/' + file.slice(0, -'/index.html'.length);
  return '/' + file.replace(/\.html$/, '');
}
