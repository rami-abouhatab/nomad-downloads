/* Development only (`npm run dev`): one page per path, rendered on the
   client. The shipped site is prerendered by tools/build.mjs instead. */
import './styles';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { PAGES } from './pages';
import './site.css';

const loaders = import.meta.glob('./pages/*.tsx');
const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
const meta = PAGES.find((p) => p.route === path) ?? PAGES[0];
document.title = meta.title;
loaders[`./pages/${meta.id}.tsx`]().then((m) => {
  const Page = (m as { default: ComponentType }).default;
  createRoot(document.getElementById('root')!).render(<Page />);
});
