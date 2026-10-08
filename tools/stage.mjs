// Copies only what the public should be served into dist/, so a deploy does
// not publish the tooling, the partials, the README or the functions' source.
//
//   node tools/stage.mjs
//   npx wrangler pages deploy dist --project-name nomad-downloads --branch main
//
// Run wrangler from the repository root: it compiles ./functions from there
// regardless of which folder is uploaded as the static site.
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './site-files.mjs';

const OUT = join(ROOT, 'dist');

/** Never published: tooling, sources, templates, repo files. */
const PRIVATE = new Set([
  '.git', '.gitignore', '.wrangler', 'node_modules', 'dist',
  'tools', 'partials', 'functions',
  'README.md', 'package.json', 'package-lock.json',
]);

rmSync(OUT, { recursive: true, force: true });
let count = 0;
for (const name of readdirSync(ROOT)) {
  if (PRIVATE.has(name) || name.startsWith('.')) continue;
  cpSync(join(ROOT, name), join(OUT, name), { recursive: true });
  count++;
}
if (!existsSync(join(OUT, 'desk', 'index.html'))) {
  console.warn('warning: desk/ has no index.html — rebuild it in nomad-shell before deploying (see README).');
}
const size = (dir) => readdirSync(dir).reduce((n, f) => {
  const p = join(dir, f);
  return n + (statSync(p).isDirectory() ? size(p) : statSync(p).size);
}, 0);
console.log(`staged ${count} entries into dist/ (${(size(OUT) / 1024 / 1024).toFixed(1)} MB)`);
