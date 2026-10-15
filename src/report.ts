/**
 * The error reporter (launch workstream S7, 2026-10-11; docs/operations/error-intake.md).
 *
 * One self-contained file for every runtime Nomad has: the edge functions (Deno), the sites
 * (nomad.ax, account.nomad.ax, cms), MeridianOS and the apps (Chromium, Electron's renderer and
 * main process, Node 18+). It imports nothing, so another repo copies this file as it is.
 *
 * What it sends to `report-error`: the product, its version and architecture, a scrubbed one-line
 * message and a SHA-256 of the normalised stack. Never the stack, never a URL's query, never an
 * address, id or home folder. The server scrubs again and counts; a new kind of error emails ops.
 *
 *   Edge function:  import { withErrorReport } from '../_shared/report.ts';
 *                   Deno.serve(withErrorReport('fn:billing', async (req) => { ... }));
 *   Browser / app:  import { installBrowserReporter } from './report';
 *                   installBrowserReporter({ product: 'nomad-account', version: '1.4.0' });
 *   Anywhere:       const r = createReporter({ product: 'nomad-drift', version });
 *                   try { ... } catch (e) { r.report(e); }
 *
 * The reporter never throws and never retries: a lost report costs nothing, a reporter that
 * loops or blocks costs the page.
 */

export const REPORT_ENDPOINT = 'https://hifnfnldkcfdczmzzdfl.supabase.co/functions/v1/report-error';

export interface ReporterOptions {
  /** Lowercase product name: 'nomad-site', 'nomad-account', 'meridian', 'reach', 'fn:billing'… */
  product: string;
  version?: string;
  /** 'x64' | 'arm64' | 'web' | 'edge'… Defaults to what the runtime says, else ''. */
  arch?: string;
  endpoint?: string;
  /** Edge functions only: the project's OPS_SECRET, which exempts our own servers from the per-IP limit. */
  internalKey?: string;
  /** Most reports one reporter sends in its lifetime, so an error in a render loop cannot flood. */
  cap?: number;
}

export interface Reporter {
  report(err: unknown, count?: number): void;
  /** Reports and sends at once (a process about to exit, an edge function). Never rejects. */
  reportNow(err: unknown): Promise<void>;
  /** Sends what is queued now. Resolves when sent (or failed); never rejects. */
  flush(): Promise<void>;
}

interface Entry {
  message: string;
  stackHash: string;
  count: number;
}

/** Removes anything that could name a person or carry a secret, and keeps one short line. */
export function scrubMessage(raw: string): string {
  let s = String(raw ?? '');
  s = s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '<email>');
  s = s.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<id>');
  s = s.replace(/([A-Za-z]:)?[\\/](Users|home|Documents and Settings)[\\/][^\\/\s"']+/gi, '<home>');
  s = s.replace(/\?[^\s"')]*/g, '?…');
  s = s.replace(/\b(eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+\.?[A-Za-z0-9_-]*)/g, '<jwt>');
  s = s.replace(/[0-9a-f]{24,}/gi, '<hex>');
  s = s.replace(/\d{5,}/g, '<n>');
  s = s.replace(/\s+/g, ' ').trim();
  return (s || '(no message)').slice(0, 300);
}

/**
 * The stack reduced to what identifies the code path: function names and file basenames, with
 * build hashes, query strings, folders and line/column numbers removed, so the same bug hashes
 * the same on every machine and across rebuilds.
 */
export function normalizeStack(stack: string): string {
  return String(stack ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^at\s|@/.test(l))
    .map((l) =>
      l
        .replace(/\?[^\s):]*/g, '')
        .replace(/(?:[A-Za-z]+:\/\/\/?|[A-Za-z]:)?[^\s()@]*[\\/]([^\\/\s():@]+)/g, '$1')
        .replace(/[-.][A-Za-z0-9_]{8,}(\.m?js)/g, '$1')
        .replace(/:\d+(:\d+)?/g, '')
        .replace(/\s+/g, ' '),
    )
    .slice(0, 12)
    .join('\n');
}

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

/** SHA-256 of the normalised stack, or '' when there is none or no WebCrypto. */
export async function stackHash(stack: string | undefined): Promise<string> {
  const norm = normalizeStack(stack ?? '');
  const subtle = (globalThis as { crypto?: Crypto }).crypto?.subtle;
  if (!norm || !subtle) return '';
  try {
    return hex(await subtle.digest('SHA-256', new TextEncoder().encode(norm)));
  } catch {
    return '';
  }
}

function describe(err: unknown): { message: string; stack?: string } {
  if (err instanceof Error) return { message: `${err.name}: ${err.message}`, stack: err.stack };
  if (err && typeof err === 'object' && 'message' in err) {
    const e = err as { message?: unknown; stack?: unknown };
    return { message: String(e.message), stack: typeof e.stack === 'string' ? e.stack : undefined };
  }
  return { message: typeof err === 'string' ? err : JSON.stringify(err ?? null) ?? String(err) };
}

function runtimeArch(): string {
  const g = globalThis as { Deno?: { build?: { arch?: string } }; process?: { arch?: string; versions?: { node?: string } }; navigator?: unknown; document?: unknown };
  if (g.Deno?.build?.arch) return 'edge';
  if (g.process?.versions?.node && g.process.arch) return g.process.arch;
  if (g.document) return 'web';
  return '';
}

export function createReporter(opts: ReporterOptions): Reporter {
  const endpoint = opts.endpoint ?? REPORT_ENDPOINT;
  const arch = opts.arch ?? runtimeArch();
  let left = opts.cap ?? 50;
  const queue = new Map<string, Entry>();
  let pending: Promise<void> | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const send = async (): Promise<void> => {
    if (timer) clearTimeout(timer);
    timer = null;
    const errors = [...queue.values()].slice(0, 10);
    queue.clear();
    if (!errors.length) return;
    try {
      await fetch(endpoint, {
        method: 'POST',
        // text/plain keeps a browser from sending a CORS preflight; the server reads JSON anyway.
        headers: { 'Content-Type': 'text/plain', ...(opts.internalKey ? { 'x-report-internal': opts.internalKey } : {}) },
        body: JSON.stringify({ product: opts.product, version: opts.version ?? '', arch, errors }),
        keepalive: true,
      });
    } catch {
      /* lost: fine */
    }
  };

  const flush = (): Promise<void> => {
    pending = (pending ?? Promise.resolve()).then(send, send);
    return pending;
  };

  const enqueue = async (err: unknown, count = 1): Promise<boolean> => {
    if (left <= 0) return false;
    left--;
    const { message, stack } = describe(err);
    const clean = scrubMessage(message);
    const h = await stackHash(stack);
    const key = `${clean}\n${h}`;
    const had = queue.get(key);
    if (had) had.count += count;
    else queue.set(key, { message: clean, stackHash: h, count });
    return true;
  };

  const report = (err: unknown, count = 1) => {
    void enqueue(err, count).then((queued) => {
      if (!queued) return;
      if (queue.size >= 10) void flush();
      else if (!timer) timer = setTimeout(() => void flush(), 2000);
    });
  };

  const reportNow = async (err: unknown) => {
    if (await enqueue(err)) await flush();
  };

  return { report, reportNow, flush };
}

/**
 * Browser, Electron renderer or any page: reports uncaught errors and unhandled rejections, and
 * sends what is queued when the page goes away. Call once, early. Returns the reporter.
 */
export function installBrowserReporter(opts: ReporterOptions): Reporter {
  const r = createReporter({ arch: 'web', ...opts });
  const w = globalThis as unknown as Window;
  if (typeof w.addEventListener !== 'function') return r;
  w.addEventListener('error', (e: ErrorEvent) => {
    // Resource load failures (an <img> 404) arrive here without an error; they are not bugs.
    if (e.error || e.message) r.report(e.error ?? e.message);
  });
  w.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => r.report(e.reason));
  w.addEventListener('pagehide', () => void r.flush());
  return r;
}

type EdgeGlobal = { Deno?: { env: { get(k: string): string | undefined } }; EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } };

let fnReporter: Reporter | null = null;
let fnProduct = '';

/** Edge functions: report one error now (keeps the worker alive until it is sent). */
export function reportFunctionError(product: string, err: unknown): void {
  const g = globalThis as EdgeGlobal;
  if (!fnReporter || fnProduct !== product) {
    const base = g.Deno?.env.get('SUPABASE_URL');
    fnProduct = product;
    fnReporter = createReporter({
      product,
      arch: 'edge',
      endpoint: base ? `${base}/functions/v1/report-error` : REPORT_ENDPOINT,
      internalKey: g.Deno?.env.get('OPS_SECRET'),
      cap: 1000,
    });
  }
  const p = fnReporter.reportNow(err);
  try {
    g.EdgeRuntime?.waitUntil(p);
  } catch {
    /* not in the edge runtime */
  }
}

/**
 * Edge functions: wraps a Deno.serve handler. An exception that escapes it is reported and
 * answered with a plain 500 (with CORS, so the browser shows the status instead of a CORS error).
 */
export function withErrorReport(product: string, handler: (req: Request) => Response | Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (e) {
      console.error(product, e);
      reportFunctionError(product, e);
      return new Response(JSON.stringify({ error: 'Something went wrong on our side.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  };
}
