/** The prerender: tools/build.mjs renders every page through this, once, at build time. */
import { renderToString } from 'react-dom/server';
import type { ComponentType } from 'react';
import type { PageId } from './pages';
import home from './pages/home';
import ax from './pages/ax';
import polaris from './pages/polaris';
import reach from './pages/reach';
import drift from './pages/drift';
import office from './pages/office';
import pricing from './pages/pricing';
import download from './pages/download';
import privacy from './pages/privacy';
import terms from './pages/terms';

export { PAGES } from './pages';

const COMPONENTS: Record<PageId, ComponentType> = { home, ax, polaris, reach, drift, office, pricing, download, privacy, terms };

export function render(id: PageId): string {
  const Page = COMPONENTS[id];
  return renderToString(<Page />);
}
