// Builds nomad.ax into dist/: every page prerendered to static HTML, each
// hydrated by its own small entry, plus /g staged in.
//
//   npm run build          (typecheck, then this)
//
// 1. Vite builds one client entry per page (src/client/<id>.tsx) with a
//    manifest, so each page knows its own script, the chunks it imports and
//    its CSS.
// 2. Vite builds src/server.tsx for Node, and every page is rendered once
//    with react-dom/server into dist/<file> (meridian.html is served at /meridian).
// 3. /g comes through public/. /desk is not built here any more: it sends to the guest desk at
//    desk.nomad.ax (public/_redirects, 2026-10-14), so the shell is never copied in twice. The /dl
//    functions stay in ./functions, where wrangler compiles them from at deploy time (see README).
// 4. It prints each page's JS and CSS, raw and gzipped.
import { build } from 'vite';
import { readFileSync, readdirSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, 'node_modules', '.site-ssr');

const quiet = { logLevel: 'warn' };

await build({ root: ROOT, ...quiet });
await build({
  root: ROOT,
  ...quiet,
  build: { ssr: 'src/server.tsx', outDir: SSR, emptyOutDir: true, manifest: false, copyPublicDir: false },
});

const server = await import(pathToFileURL(join(SSR, 'server.js')).href);
const { PAGES } = server;
const manifest = JSON.parse(readFileSync(join(DIST, '.vite', 'manifest.json'), 'utf8'));

/** An entry's own file, the chunks it statically imports (transitively), and every CSS file among them. */
function assetsOf(key) {
  const js = [];
  const css = new Set();
  const seen = new Set();
  const walk = (k) => {
    if (seen.has(k)) return;
    seen.add(k);
    const c = manifest[k];
    js.push(c.file);
    for (const f of c.css ?? []) css.add(f);
    for (const i of c.imports ?? []) walk(i);
  };
  walk(key);
  return { entry: js[0], preload: js.slice(1), css: [...css] };
}

const font = readdirSync(join(DIST, '_s')).find((f) => /^inter-latin-wght-normal-.*\.woff2$/.test(f));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page(meta, body, a) {
  const url = `https://nomad.ax${meta.route}`;
  return `<!doctype html>
<html lang="en" data-theme="light" data-appearance="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Nomad" />
    <meta property="og:title" content="${esc(meta.ogTitle ?? meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
${font ? `    <link rel="preload" href="/_s/${font}" as="font" type="font/woff2" crossorigin />\n` : ''}${a.css
    .map((f) => `    <link rel="stylesheet" href="/${f}" />\n`)
    .join('')}${a.preload.map((f) => `    <link rel="modulepreload" href="/${f}" />\n`).join('')}    <script type="module" src="/${a.entry}"></script>
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
</html>
`;
}

const gz = (f) => gzipSync(readFileSync(join(DIST, f)), { level: 9 }).length;
const raw = (f) => statSync(join(DIST, f)).size;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const rows = [];

for (const meta of PAGES) {
  const a = assetsOf(`src/client/${meta.id}.tsx`);
  const body = server.render(meta.id);
  writeFileSync(join(DIST, meta.file), page(meta, body, a));
  const js = [a.entry, ...a.preload];
  rows.push({
    page: meta.route,
    'JS raw': kb(js.reduce((n, f) => n + raw(f), 0)),
    'JS gzip': kb(js.reduce((n, f) => n + gz(f), 0)),
    'own JS gzip': kb(gz(a.entry)),
    'CSS gzip': kb(a.css.reduce((n, f) => n + gz(f), 0)),
    'HTML gzip': kb(gz(meta.file)),
  });
}

rmSync(join(DIST, '.vite'), { recursive: true, force: true });


console.log(`Prerendered ${PAGES.length} pages into dist/.`);
console.table(rows);
writeFileSync(join(DIST, '..', 'node_modules', '.site-sizes.json'), JSON.stringify(rows, null, 2));
