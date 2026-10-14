/**
 * A Citadel cloud-locked file, read and opened in the browser (the format is citadel's
 * electron/cloudlock.cjs, and test/cloudlock.test.ts opens it this same way): the records come as
 * base64 strings, each one AES-256-GCM with its own IV and its place in the file in the AAD, so
 * nothing can be reordered, swapped or cut off. The key comes from citadel-cloud, and only when
 * the owner says so.
 */

export type Meta = { v: 1; id: string; iv: string; n: number; o?: string };
export type Header = { name: string; folder: boolean; size: number; type: string };
export type Locked = { meta: Meta; parts: string[] };

const API = 'https://hifnfnldkcfdczmzzdfl.supabase.co/functions/v1/citadel-cloud';

/** From a .locked.html chosen or dropped on the page (when the file could not open itself). */
export function parse(html: string): Locked | null {
  const m = /<script type="application\/json" id="citadel-meta">([^<]+)<\/script>/.exec(html);
  if (!m) return null;
  try {
    const meta = JSON.parse(m[1]) as Meta;
    if (meta.v !== 1 || typeof meta.id !== 'string' || typeof meta.iv !== 'string') return null;
    const parts = [...html.matchAll(/<script type="application\/octet-stream" class="citadel-part">([^<]*)<\/script>/g)].map((x) => x[1]);
    return { meta, parts };
  } catch {
    return null;
  }
}

const unb64 = (s: string) => {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

/** Every record verified, the count included; the header and the bytes as a Blob of their type. */
export async function decrypt(file: Locked, keyB64: string, onProgress?: (f: number) => void): Promise<{ header: Header; blob: Blob }> {
  const { meta, parts } = file;
  if (parts.length !== meta.n || parts.length < 2) throw new Error('damaged');
  const key = await crypto.subtle.importKey('raw', unb64(keyB64), 'AES-GCM', false, ['decrypt']);
  const prefix = unb64(meta.iv);
  const chunks: ArrayBuffer[] = [];
  let header: Header | null = null;
  for (let i = 0; i < parts.length; i++) {
    const iv = new Uint8Array(12);
    iv.set(prefix, 0);
    new DataView(iv.buffer).setUint32(8, i);
    const last = i === meta.n - 1;
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(`citadel1:${meta.id}:${i}:${last ? 1 : 0}`) }, key, unb64(parts[i]));
    if (i === 0) header = JSON.parse(new TextDecoder().decode(plain)) as Header;
    else chunks.push(plain);
    onProgress?.((i + 1) / parts.length);
  }
  if (!header) throw new Error('damaged');
  return { header, blob: new Blob(chunks, { type: header.type || 'application/octet-stream' }) };
}

/** One call to citadel-cloud. Never throws: a failure comes back as a sentence a person can read. */
export async function ask<T extends Record<string, unknown>>(action: string, body: Record<string, unknown>): Promise<T & { error?: string; status: number }> {
  try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...body }) });
    const data = (await r.json().catch(() => ({}))) as T & { error?: string };
    return { ...data, status: r.status };
  } catch {
    return { error: 'Nomad could not be reached. Check the connection and try again.', status: 0 } as T & { error?: string; status: number };
  }
}

export type Kind = 'image' | 'pdf' | 'text' | 'video' | 'audio' | 'folder' | 'other';
export function kindOf(h: { name: string; folder?: boolean; type?: string }): Kind {
  if (h.folder) return 'folder';
  const t = h.type || '';
  const ext = h.name.toLowerCase().split('.').pop() ?? '';
  if (t.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp'].includes(ext)) return 'image';
  if (t === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (t.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (t.startsWith('audio/') || ['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio';
  if (t.startsWith('text/') || t === 'application/json' || ['txt', 'md', 'csv', 'json', 'log', 'xml', 'yml', 'yaml'].includes(ext)) return 'text';
  return 'other';
}
