import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

/**
 * Lenis smooth scrolling for a page (Rami, 2026-10-10: "this page needs to have lenis smooth
 * scrolling"). Lenis eases the window's own scroll position, so the page's CSS scroll timelines
 * (the opening's hand-over, the black zone's arrivals) follow it unchanged.
 *
 * Off under reduced motion (the wheel then moves the page as the system does) and before the
 * script runs; loaded only after hydration, so it never sits on the opening's first frames.
 * Horizontal swipes in the screenshot rows stay native (Lenis smooths the vertical only).
 */
export function useSmoothScroll(on = true) {
  useEffect(() => {
    if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let lenis: { destroy(): void } | null = null;
    let live = true;
    import('lenis').then(({ default: Lenis }) => {
      if (!live) return;
      lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09, smoothWheel: true });
    });
    return () => {
      live = false;
      lenis?.destroy();
    };
  }, [on]);
}
