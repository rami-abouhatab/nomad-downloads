/**
 * The Nomad platform (Supabase), read from nomad.ax's functions: only the public, read-only
 * functions the back office's releases expose (release_feed, release_downloads) and the anonymous
 * update counter (note_update_check). The publishable key identifies the project and grants only
 * what those functions allow; it is public by design (nomad-shell's .env commits it too).
 *
 * This file exports no onRequest handler, so Pages does not route it.
 */

export const PLATFORM_URL = 'https://hifnfnldkcfdczmzzdfl.supabase.co';
const KEY = 'sb_publishable_wIrjCcqep8NoxHJOnNGalQ_IqrNQ5ae';

/** Call a public function; null when the platform does not answer (the caller falls back). */
export async function rpc(name, args = {}, fetchImpl = fetch) {
  try {
    const res = await fetchImpl(`${PLATFORM_URL}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
