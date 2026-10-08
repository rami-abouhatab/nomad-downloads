// Which files make up the site, shared by the tools.
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Folders that are not pages: build output, tooling, templates. */
const SKIP = new Set(['.git', '.wrangler', 'node_modules', 'desk', 'tools', 'partials', 'functions', 'assets']);

/** Every .html page, as a forward-slash path relative to the root. */
export function pages(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP.has(name)) out.push(...pages(full));
    } else if (name.endsWith('.html')) {
      out.push(relative(ROOT, full).split(sep).join('/'));
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
