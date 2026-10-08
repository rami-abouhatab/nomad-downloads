import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { ndSymbols } from './tools/nd-symbols.mjs';
import { PAGES } from './src/pages.ts';

/**
 * nomad.ax, built from nomad-design.
 *
 * nomad-design is imported the way nomad-cms and nomad-account do it: a
 * `file:` sibling, React deduped to this package's copy (a linked package
 * resolves from its own node_modules first, and two Reacts break hooks while
 * blaming the wrong file), and `..` inside the serving root, or a NEW file
 * over there 403s and the import silently keeps the last tree that worked.
 *
 * Two additions for a public website:
 *
 * - `@nd/…` reaches a single control (`@nd/controls/Button`) instead of the
 *   barrel. The barrel pulls the menu engine, the tab strip and every
 *   control's CSS, none of which a marketing page uses.
 * - `ndSymbols` swaps nomad-design's `symbols.tsx` (every icon family the
 *   design system can draw, ~1.5 MB) for a module generated at build time
 *   that holds only the marks this site names, drawn by the same route Sym
 *   uses: Iconsax by name, Material for the rest.
 *
 * Every page is prerendered by tools/build.mjs and hydrated by its own small
 * entry (src/client/<page>.tsx), so a page downloads its own code and the
 * shared React chunk, never the other pages'.
 */
const ND = fileURLToPath(new URL('../nomad-design/src/', import.meta.url)).replace(/\\/g, '/');

export default defineConfig(({ isSsrBuild }) => ({
  /* Its own dependency cache: never share node_modules/.vite with another
     server (see nomad-account/vite.config.ts). */
  cacheDir: 'node_modules/.vite-site',
  plugins: [react(), ndSymbols()],
  resolve: {
    alias: [{ find: /^@nd\/(.*)$/, replacement: `${ND}$1` }],
    dedupe: ['react', 'react-dom', 'nomad-design'],
  },
  server: { port: 5390, strictPort: true, host: '127.0.0.1', fs: { allow: ['..'] } },
  preview: { port: 8791, strictPort: true, host: '127.0.0.1' },
  ssr: { noExternal: ['nomad-design', 'iconsax-react'] },
  build: {
    target: 'es2022',
    sourcemap: false,
    manifest: true,
    /* Content-hashed output lives apart from the hand-kept /assets, so it can
       be cached forever (public/_headers). */
    assetsDir: '_s',
    /* The prerender build (tools/build.mjs) names its own single input. */
    rollupOptions: isSsrBuild
      ? undefined
      : { input: Object.fromEntries(PAGES.map((p) => [p.id, `src/client/${p.id}.tsx`])) },
  },
}));
