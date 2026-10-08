// Copies each partials/<name>.html into every page that asks for it, between
//   <!-- partial:nav --> … <!-- /partial:nav -->
// and marks the current page's nav links with aria-current="page".
//
//   node tools/sync-partials.mjs          rewrite the pages
//   node tools/sync-partials.mjs --check  exit 1 if any page is out of date
//
// The site has no build step on purpose; this keeps the one piece of
// repeated markup honest without adding one.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, pages, routeOf } from './site-files.mjs';

const check = process.argv.includes('--check');
const partials = readdirSync(join(ROOT, 'partials'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.slice(0, -5))
  .map((name) => ({
  name,
  html: readFileSync(join(ROOT, 'partials', `${name}.html`), 'utf8').replace(/\r\n/g, '\n').trimEnd(),
}));

function render(html, route) {
  if (!route) return html;
  // Every link to this page (and to a page this one sits under) is current.
  return html.replace(/<a ([^>]*?)href="(\/[^"#?]*)"/g, (m, before, href) => {
    const current = href !== '/' && (route === href || route.startsWith(href + '/'));
    return current ? `<a ${before}href="${href}" aria-current="page"` : m;
  });
}

let stale = 0;
for (const file of pages()) {
  const path = join(ROOT, file);
  const original = readFileSync(path, 'utf8');
  let next = original.replace(/\r\n/g, '\n');
  for (const { name, html } of partials) {
    const re = new RegExp(String.raw`([ \t]*)<!-- partial:${name} -->[\s\S]*?<!-- /partial:${name} -->`);
    next = next.replace(re, (_m, indent) => {
      const body = render(html, routeOf(file))
        .split('\n')
        .map((l) => (l ? indent + l : l))
        .join('\n');
      return `${indent}<!-- partial:${name} -->\n${body}\n${indent}<!-- /partial:${name} -->`;
    });
  }
  if (next !== original.replace(/\r\n/g, '\n')) {
    stale++;
    if (check) console.log(`out of date: ${file}`);
    else writeFileSync(path, next);
  }
}
if (check && stale) {
  console.log(`${stale} page(s) differ from partials/. Run: node tools/sync-partials.mjs`);
  process.exit(1);
}
if (!check) console.log(stale ? `updated ${stale} page(s)` : 'all pages already in sync');
