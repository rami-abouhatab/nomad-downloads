/**
 * Which plans the visitor holds, so the shop knows who you are (Rami, 2026-10-14: one shop, on
 * nomad.ax). account.nomad.ax writes `nomad_plans` beside `nomad_who` on the registrable domain:
 * `product/interval` for each live subscription, nothing else (nomad-account session.ts
 * `tellThePlans`). A plan card then says "Your plan" and changes it instead of selling it again.
 * Read after hydration, like the account menu, so the prerendered page and the first render agree.
 */
import { useEffect, useState } from 'react';
import { ACCOUNT, checkout, type Period, type ProductId } from '../data';

export type Holding = { product: string; interval: 'month' | 'year' };

/** Meridian is Meridian in every address: billing's `ax:` keys read as `meridian:`. */
const slug = (p: string) => p.replace(/^ax:/, 'meridian:');
const familyOf = (p: string) => slug(p).split(':')[0];

/** The cookie's plans, by family. Exported for the test. */
export function readHeld(cookie: string): Record<string, Holding> {
  const raw = cookie.split('; ').find((c) => c.startsWith('nomad_plans='));
  const out: Record<string, Holding> = {};
  if (!raw) return out;
  try {
    for (const item of decodeURIComponent(raw.slice('nomad_plans='.length)).split(',')) {
      const [product, interval] = item.split('/');
      if (!product || (interval !== 'month' && interval !== 'year')) continue;
      out[familyOf(product)] = { product: slug(product), interval };
    }
  } catch {
    /* unreadable: nothing held */
  }
  return out;
}

export function useHeld(): Record<string, Holding> {
  const [held, setHeld] = useState<Record<string, Holding>>({});
  useEffect(() => {
    const read = () => setHeld(document.cookie.includes('nomad_who=') ? readHeld(document.cookie) : {});
    read();
    window.addEventListener('focus', read);
    return () => window.removeEventListener('focus', read);
  }, []);
  return held;
}

/**
 * What a plan card's button does for this visitor: buy it, switch to it from another plan of the
 * same family, or manage it when it is theirs. Exported for the test.
 */
export function buyFor(id: ProductId, name: string, period: Period, held: Record<string, Holding>, buy: string): { label: string; href: string; yours: boolean } {
  const mine = held[familyOf(id)];
  if (!mine) return { label: buy, href: checkout(id, period), yours: false };
  if (mine.product === slug(id)) return { label: 'Manage your plan', href: `${ACCOUNT}/subscriptions/change?family=${familyOf(id)}`, yours: true };
  return { label: `Switch to ${name}`, href: checkout(id, period), yours: false };
}
