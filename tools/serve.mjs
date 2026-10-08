// A local preview that behaves like Cloudflare Pages for this site:
// pretty URLs (/ax serves ax.html), folder index pages, and the /dl
// functions run in-process against the real GitHub releases.
//
//   node tools/serve.mjs [port]      (default 8790)
//
// wrangler's own `pages dev` needs workerd, which has no ARM64 Windows
// binary; this stands in for it. It is a preview, never a deploy target.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './site-files.mjs';

const port = Number(process.argv[2] || 8790);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

/** Pages' lookup order for a path: exact file, then `.html`, then `/index.html`. */
async function resolveStatic(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^[\\/]+/, '');
  const base = join(ROOT, rel);
  if (!base.startsWith(ROOT.replace(/[\\/]$/, '') + sep) && base !== ROOT.replace(/[\\/]$/, '')) return null;
  for (const candidate of [base, base + '.html', join(base, 'index.html')]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

/** The /dl functions, routed the way Pages routes functions/dl. */
async function runFunction(url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['dl', ...]
  if (parts[0] !== 'dl') return null;
  const load = (p) => import(pathToFileURL(join(ROOT, 'functions', ...p)).href);
  const request = new Request(url.href);
  if (parts.length === 2 && parts[1] === 'manifest') return (await load(['dl', 'manifest.js'])).onRequestGet({ request, params: {} });
  if (parts.length === 2) return (await load(['dl', '[arch].js'])).onRequestGet({ request, params: { arch: parts[1] } });
  if (parts.length === 3) return (await load(['dl', '[product]', '[arch].js'])).onRequestGet({ request, params: { product: parts[1], arch: parts[2] } });
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  try {
    const fn = await runFunction(url);
    if (fn) {
      res.writeHead(fn.status, Object.fromEntries(fn.headers));
      // A preview never streams a 100 MB installer; it says what it would send.
      if (fn.headers.get('Content-Disposition')) return res.end(`(preview) would download ${fn.headers.get('Content-Disposition')}\n`);
      return res.end(Buffer.from(await fn.arrayBuffer()));
    }

    // /ax.html → /ax, as Pages does.
    if (url.pathname.endsWith('.html')) {
      const pretty = url.pathname.replace(/(index)?\.html$/, '');
      res.writeHead(308, { Location: pretty + url.search });
      return res.end();
    }

    const file = await resolveStatic(url.pathname);
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(String(err && err.stack || err));
  }
}).listen(port, '127.0.0.1', () => console.log(`nomad.ax preview on http://127.0.0.1:${port}`));
