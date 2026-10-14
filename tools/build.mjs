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

/*
 * Page to page, behind the camel's sheen (Rami, 2026-10-14: "loading between every form, every page,
 * no sudden appearance"; "use the camel sheen in small size, it's more our brand"). nomad.ax is
 * static pages, so it lives here, in every page's own HTML, before any script loads:
 *   - leaving: a click to another Nomad page fades this page out and shows the sheen, and the browser
 *     goes on at once (nothing waits on it);
 *   - arriving: a page reached that way holds behind the sheen until 420 ms after the click (never
 *     longer: a slow network has already spent the wait), then fades in. A visit from anywhere else
 *     opens at once. Opacity and transform only; reduced motion skips all of it.
 */
const CAMEL_D =
  'M462.49 1762.50 C466.31 1640.02 530.14 1513.94 575.92 1426.92 C700.37 1190.37 868.89 959.99 1067.65 780.32 C1174.04 684.15 1307.45 593.86 1457.41 632.97 C1672.41 689.04 1731.83 1074.70 1972.28 1053.36 C2107.30 1041.38 2192.37 906.20 2205.10 782.32 C2217.32 663.44 2179.53 538.74 2317.71 477.48 C2424.51 430.14 2551.09 467.24 2650.65 511.83 C2683.26 526.44 2764.85 554.67 2737.15 604.92 C2722.24 631.96 2655.23 625.77 2627.67 630.02 C2563.60 639.89 2503.32 670.39 2460.33 719.57 C2380.37 811.02 2362.91 943.28 2327.53 1055.41 C2257.56 1277.16 2076.95 1653.45 1832.43 1719.85 C1711.76 1752.62 1650.55 1656.50 1592.16 1569.53 C1519.45 1461.24 1433.70 1352.09 1309.27 1301.07 C1065.71 1201.23 775.74 1425.21 618.15 1592.28 C570.76 1642.52 529.07 1702.41 462.49 1762.50 Z';
const CAMEL_BOX = '462.5 455.4 2280.3 1307.1';
const CAMEL_MASK = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CAMEL_BOX}"><path d="${CAMEL_D}"/></svg>`)}")`;
const SHEEN_STYLE = `<style>
.nm-go{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;pointer-events:none;opacity:0;visibility:hidden;color:#1b1c20}
html[data-arriving] .nm-go,html[data-leaving] .nm-go{opacity:1;visibility:visible}
html[data-arriving] #root{opacity:0}
html[data-leaving] #root{opacity:0;transition:opacity 160ms cubic-bezier(.4,0,1,1)}
html[data-landed] #root{transition:opacity 220ms cubic-bezier(.2,0,0,1)}
.nm-go-mark{position:relative;width:40px;height:calc(40px*1307.1/2280.3)}
.nm-go-mark svg{position:absolute;inset:0;width:100%;height:100%;fill:currentColor;opacity:.18}
.nm-go-lit{position:absolute;inset:0;overflow:hidden;-webkit-mask:${CAMEL_MASK} 0 0/100% 100% no-repeat;mask:${CAMEL_MASK} 0 0/100% 100% no-repeat}
.nm-go-lit i{position:absolute;inset:0 auto 0 0;width:60%;background:linear-gradient(90deg,transparent,currentColor 50%,transparent);transform:translateX(-100%);will-change:transform}
html[data-arriving] .nm-go-lit i,html[data-leaving] .nm-go-lit i{animation:nm-go 1.4s cubic-bezier(.45,0,.3,1) -.5s infinite}
@keyframes nm-go{to{transform:translateX(170%)}}
@media (prefers-reduced-motion:reduce){.nm-go{display:none}html[data-arriving] #root,html[data-leaving] #root{opacity:1;transition:none}}
</style>`;
const SHEEN_HEAD = `<script>(function(){var d=document.documentElement,k='nm-go';try{var t=+sessionStorage.getItem(k);sessionStorage.removeItem(k);if(t&&Date.now()-t<8000&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-arriving','');var go=function(){d.setAttribute('data-landed','');requestAnimationFrame(function(){d.removeAttribute('data-arriving')})};var wait=function(){setTimeout(go,Math.max(0,420-(Date.now()-t)))};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',wait):wait()}}catch(e){}
addEventListener('pageshow',function(){d.removeAttribute('data-leaving')});
addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;var u=new URL(a.href,location.href);var h=u.hostname;if(h!=='nomad.ax'&&h.slice(-9)!=='.nomad.ax'&&u.origin!==location.origin)return;if(u.pathname.indexOf('/dl/')===0||/[.](exe|msi|dmg|zip|pdf)$/i.test(u.pathname))return;if(u.origin===location.origin&&u.pathname===location.pathname&&u.search===location.search)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;try{sessionStorage.setItem(k,String(Date.now()))}catch(e){}d.setAttribute('data-leaving','')})})();</script>`;
const SHEEN_BODY = `<div class="nm-go" role="progressbar" aria-label="Loading" aria-hidden="true"><span class="nm-go-mark"><svg viewBox="${CAMEL_BOX}"><path d="${CAMEL_D}"/></svg><span class="nm-go-lit"><i></i></span></span></div>`;

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
    ${SHEEN_STYLE}
    ${SHEEN_HEAD}
  </head>
  <body>
    ${SHEEN_BODY}
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
