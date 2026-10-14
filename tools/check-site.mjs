// Validates the BUILT site (dist/) before a deploy. Run `npm run build` first,
// then `node tools/check-site.mjs`. No dependencies.
//
// For every page in dist/ (desk/, the shell's build output, is not ours to check):
//   - the document basics: doctype, <html lang>, charset, viewport, a title,
//     one <h1> on every page that has a <main>
//   - well-formed markup: every non-void element closed, in order
//   - unique ids, alt on every <img>, every <label for> pointing at an id
//   - every internal link and asset resolves the way Cloudflare Pages would
//     serve it (pretty URLs, folder index pages, the /dl functions), and every
//     #fragment exists on the page it points to
//   - every external link goes to a host we expect
//   - url(...) references in the built stylesheets resolve
//   - the page was prerendered (a filled #root, never a blank client-only
//     page) and loads exactly one module entry to hydrate it
//   - every buy link goes to account.nomad.ax/checkout with a product the
//     billing contract sells (C3) and a period of yearly or monthly, and no
//     page still sends a buyer to the old billing.nomad.ax/?product= form
//   - every page's prices are prices THE LAW names (docs/pricing.md)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DIST as ROOT, pages, routeOf } from './site-files.mjs';
import { ARCHES, productSlug } from '../functions/_lib/releases.js';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);
const EXTERNAL_OK = [
  /^nomad\.ax$/,
  /^(account|billing|drift|reach|desk|cms|admin)\.nomad\.ax$/,
  /^developers\.google\.com$/,
];

/** Platform contract C3: what billing sells. */
/* A link says meridian, never ax (Rami, 2026-10-11): ax: is billing's key and stays out of every address. */
const PRODUCTS = new Set(['meridian:starter', 'meridian:pro', 'meridian:ultra', 'office', 'reach:premium', 'drift:premium', 'citadel:premium']);
/** THE LAW's prices (monthly, yearly, the yearly-per-month line), plus the extra mailbox. */
const LAW_PRICES = new Set([
  '$9.99', '$99', '$8.25', '$16.99', '$169', '$14.08', '$29.99', '$299', '$24.92',
  '$4.99', '$49', '$4.08', '$2.99', '$29', '$2.42', '$5.99', '$59', '$4.92', '$1.99',
  // Citadel Premium (2026-10-09): $1.99 a month, $19 a year, $1.58 a month yearly
  '$19', '$1.58',
]);

if (!existsSync(join(ROOT, 'index.html'))) {
  console.log('dist/ has no index.html: run `npm run build` first.');
  process.exit(1);
}

const errors = [];
const warn = (file, msg) => errors.push(`${file}: ${msg}`);
const externals = new Map();

const decode = (v) => v.replace(/&(amp|quot|#39|lt|gt);/g, (_m, e) => ({ amp: '&', quot: '"', '#39': "'", lt: '<', gt: '>' })[e]);

/** Attributes of one tag, as a map (names lowercased, entities decoded). */
function attrs(src) {
  const out = {};
  const re = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(src))) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}

/** Tags in document order, with comments and script/style bodies skipped. */
function tags(html) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const t = { close: m[1] === '/', name: m[2].toLowerCase(), attrs: attrs(m[3] || ''), index: m.index, selfClose: /\/\s*$/.test(m[3] || '') };
    out.push(t);
    if (!t.close && RAW.has(t.name)) {
      const end = html.toLowerCase().indexOf(`</${t.name}`, re.lastIndex);
      if (end === -1) break;
      re.lastIndex = end;
    }
  }
  return out;
}

const lineOf = (html, index) => html.slice(0, index).split('\n').length;

/** The ids a page defines, cached. */
const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(join(ROOT, file), 'utf8');
    idCache.set(file, new Set(tags(html).filter((t) => !t.close && t.attrs.id).map((t) => t.attrs.id)));
  }
  return idCache.get(file);
}

const isFile = (p) => existsSync(p) && statSync(p).isFile();

/** Pages' lookup for a root-relative path; returns the file or null. */
function resolvePath(pathname) {
  const rel = decodeURIComponent(pathname).replace(/^\/+/, '');
  const base = join(ROOT, rel);
  for (const candidate of [base, base + '.html', join(base, 'index.html')]) {
    if (isFile(candidate)) return candidate.slice(ROOT.length).split('\\').join('/').replace(/^\/+/, '');
  }
  return null;
}

/** The /dl Pages Functions answer these paths. */
function isFunctionRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'dl') return false;
  if (parts.length === 2) return parts[1] === 'manifest' || ARCHES.includes(parts[1]);
  if (parts.length === 3) return productSlug(parts[1]) !== null && ARCHES.includes(parts[2]);
  return false;
}

function checkRef(file, html, t, value, kind) {
  if (!value || value.startsWith('data:') || value.startsWith('mailto:') || value.startsWith('tel:')) return;
  const line = lineOf(html, t.index);
  if (/^[a-z]+:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.hostname === 'billing.nomad.ax' && url.searchParams.has('product'))
      warn(file, `line ${line}: buy link still goes to billing.nomad.ax (${value}); use account.nomad.ax/checkout`);
    if (url.hostname === 'account.nomad.ax' && url.pathname === '/checkout') {
      const product = url.searchParams.get('product');
      const period = url.searchParams.get('period');
      if (!PRODUCTS.has(product)) warn(file, `line ${line}: checkout for unknown product "${product}"`);
      if (period !== 'yearly' && period !== 'monthly') warn(file, `line ${line}: checkout with period "${period}"`);
    }
    if (url.protocol !== 'https:') warn(file, `line ${line}: insecure link ${value}`);
    if (!EXTERNAL_OK.some((re) => re.test(url.hostname))) warn(file, `line ${line}: unexpected external host ${url.hostname}`);
    externals.set(value, (externals.get(value) || 0) + 1);
    return;
  }
  const url = new URL(value, 'https://nomad.ax' + routeOf(file) + (routeOf(file).endsWith('/') ? '' : ''));
  // Relative references resolve against the page's served URL, as a browser would.
  const target = url.pathname;
  const hash = decodeURIComponent(url.hash.slice(1));
  if (value.startsWith('#')) {
    if (hash && !idsOf(file).has(hash)) warn(file, `line ${line}: #${hash} does not exist on this page`);
    return;
  }
  if (isFunctionRoute(target)) return;
  const resolved = resolvePath(target);
  if (!resolved) {
    warn(file, `line ${line}: ${kind} ${value} does not resolve`);
    return;
  }
  if (hash && resolved.endsWith('.html') && !idsOf(resolved).has(hash)) {
    warn(file, `line ${line}: ${value} — #${hash} does not exist on ${resolved}`);
  }
}

function checkPage(file) {
  const html = readFileSync(join(ROOT, file), 'utf8');
  if (!/^<!doctype html>/i.test(html.trimStart())) warn(file, 'missing <!doctype html>');
  const all = tags(html);
  const open = (name) => all.filter((t) => !t.close && t.name === name);

  const htmlTag = open('html')[0];
  if (!htmlTag?.attrs.lang) warn(file, '<html> has no lang');
  if (!open('meta').some((t) => 'charset' in t.attrs)) warn(file, 'no <meta charset>');
  if (!open('meta').some((t) => t.attrs.name === 'viewport')) warn(file, 'no viewport meta');
  const title = /<title>([^<]*)<\/title>/i.exec(html);
  if (!title || !title[1].trim()) warn(file, 'empty or missing <title>');
  if (open('main').length) {
    const h1 = open('h1').length;
    if (h1 !== 1) warn(file, `has ${h1} <h1> elements (want 1)`);
    if (!open('main').some((t) => t.attrs.id === 'main')) warn(file, '<main> should carry id="main" for the skip link');
  }

  // Prerendered, and hydrated by one module entry.
  if (file !== 'g/index.html') {
    const root = /<div id="root">([\s\S]*?)<\/div>\s*<\/body>/.exec(html);
    if (!root || root[1].trim().length < 200) warn(file, '#root is empty: the page was not prerendered');
    const modules = all.filter((t) => !t.close && t.name === 'script' && t.attrs.type === 'module');
    if (modules.length !== 1) warn(file, `has ${modules.length} module scripts (want 1 entry)`);
    for (const m of html.matchAll(/\$\d+(?:\.\d+)?/g)) {
      if (!LAW_PRICES.has(m[0])) warn(file, `line ${lineOf(html, m.index)}: price ${m[0]} is not in THE LAW`);
    }
  }

  // Well-formed: a stack of open elements.
  const stack = [];
  for (const t of all) {
    if (VOID.has(t.name) || t.selfClose) continue; // void, or <path />-style in SVG
    if (!t.close) { stack.push(t); continue; }
    const top = stack.pop();
    if (!top || top.name !== t.name) {
      warn(file, `line ${lineOf(html, t.index)}: </${t.name}> closes <${top ? top.name : 'nothing'}>${top ? ` from line ${lineOf(html, top.index)}` : ''}`);
      return; // one structural error is enough; the rest would cascade
    }
  }
  for (const t of stack) warn(file, `line ${lineOf(html, t.index)}: <${t.name}> is never closed`);

  // Ids, alt text, labels.
  const seen = new Map();
  for (const t of all) {
    if (t.close) continue;
    if (t.attrs.id) {
      if (seen.has(t.attrs.id)) warn(file, `line ${lineOf(html, t.index)}: duplicate id "${t.attrs.id}"`);
      seen.set(t.attrs.id, true);
    }
    if (t.name === 'img' && !('alt' in t.attrs)) warn(file, `line ${lineOf(html, t.index)}: <img> without alt`);
  }
  for (const t of open('label')) {
    if (t.attrs.for && !seen.has(t.attrs.for)) warn(file, `line ${lineOf(html, t.index)}: <label for="${t.attrs.for}"> has no target`);
  }

  // Links and assets.
  for (const t of all) {
    if (t.close) continue;
    if (t.attrs.href !== undefined && ['a', 'link'].includes(t.name)) checkRef(file, html, t, t.attrs.href, 'link');
    if (t.attrs.src !== undefined) checkRef(file, html, t, t.attrs.src, 'asset');
  }
}

function checkCss(file) {
  const css = readFileSync(join(ROOT, file), 'utf8');
  const re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  let m;
  while ((m = re.exec(css))) {
    const ref = m[2];
    if (ref.startsWith('data:')) continue;
    const target = new URL(ref, 'https://nomad.ax/' + file).pathname;
    if (!resolvePath(target)) warn(file, `url(${ref}) does not resolve`);
  }
}

const files = pages();
for (const f of files) checkPage(f);
for (const f of readdirSync(join(ROOT, '_s')).filter((n) => n.endsWith('.css'))) checkCss(`_s/${f}`);

console.log(`Checked ${files.length} pages: ${files.join(', ')}`);
console.log(`External links (${externals.size}):`);
for (const [url, n] of [...externals].sort()) console.log(`  ${url}${n > 1 ? `  ×${n}` : ''}`);
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log('  ✗ ' + e);
  process.exit(1);
}
console.log('\nNo problems found.');
