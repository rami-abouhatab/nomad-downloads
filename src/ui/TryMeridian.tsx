/**
 * Try Meridian (Rami, 2026-10-10: "a button, try it; when clicked the window smoothly opens, grows
 * in real time, full screen but not full width, and we try the real experience, not a simulation;
 * not an account, but the experience"). The button stands in the opening where the price used to.
 *
 * The real shell, its web build at desk.nomad.ax, booted as the demo desk (`#demo`: nomad-shell
 * src/demo/boot.ts, an in-memory drive, no account, nothing written anywhere). It runs in a frame
 * that grows out of the button that opened it and folds back into it on close.
 *
 * The first law: the window is in the page from the first client render, hidden, under <body>
 * (outside the hero's entrance transforms, which would trap a fixed layer); the press reads the
 * button's place once, writes three custom properties on the window and flips a class, and the
 * grow is transform and opacity only. The frame's page loads on the press, behind the shell's own
 * black splash; the connection opens as soon as the pointer comes near. Reduced motion: at once.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LinkButton } from './kit';

const DESK = import.meta.env.DEV ? 'http://127.0.0.1:5173/#demo' : 'https://desk.nomad.ax/#demo';

export function TryMeridian({ className }: { className?: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const frameBox = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    const b = button.current;
    const l = layer.current;
    const box = frameBox.current;
    if (!b || !l || !box) return;
    let frame: HTMLIFrameElement | null = null;
    let warmed = false;
    let closing = 0;

    const warm = () => {
      if (warmed) return;
      warmed = true;
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = new URL(DESK).origin;
      document.head.append(link);
    };

    /* The window grows from the button. Its resting box comes from layout (offsets ignore its
       transform; the layer is fixed at the viewport's corner, so they are viewport coordinates). */
    const aim = () => {
      const r = b.getBoundingClientRect();
      const w = { left: box.offsetLeft, top: box.offsetTop, width: box.offsetWidth, height: box.offsetHeight };
      box.style.setProperty('--tx', `${r.left + r.width / 2 - (w.left + w.width / 2)}px`);
      box.style.setProperty('--ty', `${r.top + r.height / 2 - (w.top + w.height / 2)}px`);
      box.style.setProperty('--s', String(Math.max(r.width / w.width, 0.04)));
    };

    const open = () => {
      clearTimeout(closing);
      if (!frame) {
        frame = document.createElement('iframe');
        frame.title = 'Meridian, the real desk';
        frame.src = DESK;
        frame.allow = 'clipboard-read; clipboard-write; fullscreen';
        box.querySelector('.tm-screen')!.append(frame);
      }
      /* under the site's main header while it is on screen (Rami: "under the main header") */
      const bar = document.querySelector('.gnav')?.getBoundingClientRect().bottom ?? 0;
      l.style.setProperty('--tm-top', `${Math.max(0, Math.round(bar))}px`);
      l.hidden = false;
      aim();
      void box.offsetWidth; // the start state is committed before the class moves it
      l.classList.add('is-open');
      window.setTimeout(() => frame?.focus(), 620);
    };

    const close = () => {
      if (!l.classList.contains('is-open')) return;
      aim();
      l.classList.remove('is-open');
      closing = window.setTimeout(() => (l.hidden = true), 560);
      b.focus({ preventScroll: true });
    };

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onWheel = (e: WheelEvent) => e.preventDefault(); // the page stays put behind the window
    const closer = l.querySelector('.tm-close')!;
    const scrim = l.querySelector('.tm-scrim')!;
    b.addEventListener('pointerenter', warm);
    b.addEventListener('focus', warm);
    b.addEventListener('click', open);
    closer.addEventListener('click', close);
    scrim.addEventListener('click', close);
    l.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKey);
    return () => {
      b.removeEventListener('pointerenter', warm);
      b.removeEventListener('focus', warm);
      b.removeEventListener('click', open);
      closer.removeEventListener('click', close);
      scrim.removeEventListener('click', close);
      l.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
    };
  }, [host]);

  const windowLayer = (
    <div className="tm-layer" ref={layer} hidden data-lenis-prevent role="dialog" aria-modal="true" aria-label="Meridian, the real desk">
      <div className="tm-scrim" />
      <div className="tm-window" ref={frameBox}>
        <div className="tm-bar">
          <span className="tm-name">Meridian</span>
          <span className="tm-note">A demo desk. Nothing you do here is saved.</span>
          <LinkButton href="/ax#plans" size="sm" variant="primary" className="tm-get">
            Get Meridian
          </LinkButton>
          <button type="button" className="tm-close" aria-label="Close">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="tm-screen" />
      </div>
    </div>
  );

  return (
    <>
      <button type="button" className={className ? `nm-btn site-btn-hero tm-button ${className}` : 'nm-btn site-btn-hero tm-button'} data-variant="primary" data-size="lg" ref={button}>
        <span className="nm-btn-label">Try it right here</span>
      </button>
      {host && createPortal(windowLayer, host)}
    </>
  );
}
