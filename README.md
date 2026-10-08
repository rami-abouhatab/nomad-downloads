# nomad.ax

The public site of Nomad, the company: the products (AX, Polaris Browser,
Reach, Drift, Nomad Office), pricing, downloads, and the legal pages. Also the
`/dl` functions that serve installers, the old `/g` guest-link redirect, and
`/desk` — the shell's web build, which a guest link opens (nomad-shell
`src/guest`).

**Built from nomad-design.** Every page is React on nomad-design's tokens and
controls (the Button anatomy, Segment, ProBadge, `Sym`), imported the way
nomad-cms and nomad-account import it (`file:` sibling, React deduped,
`fs.allow` over `..`). Each page is **prerendered to static HTML at build
time** and then hydrated by its own small entry, so it reads and works before
any script runs, and a page never downloads another page's code.

| Path | Source |
| --- | --- |
| `/` | `src/pages/home.tsx` |
| `/ax` | `src/pages/ax.tsx` — AX, with its plans and questions |
| `/polaris` `/reach` `/drift` `/office` | one page per app |
| `/pricing` | AX plans, the comparison table, then "Apps on their own" |
| `/download` | every product, per Windows architecture |
| `/privacy` `/terms` | legal (entity, contact and governing law still to fill) |

`src/pages.ts` lists every page with its title and description;
`src/ui/` holds the frame (global bar, product bar, footer) and the shared
sections (hero, plan cards, comparison table, questions).

Prices are THE LAW in `nomad-shell/docs/pricing.md` (2026-10-08) and live in
one file, `src/data.ts`. `tools/check-site.mjs` fails the build output if any
page prints a price THE LAW does not name. Buy buttons go to
`https://account.nomad.ax/checkout?product=<id>&period=yearly|monthly`.

**AX has no logo yet.** Until it does, AX is drawn typographically on a
squircle (`ProductMark` in `src/ui/kit.tsx`). Drift's plate is a placeholder
glyph too; every other icon is the family-v1 artwork from nomad-shell
(`public/assets/icons/`). The product screenshots in `public/assets/shots/`
are the real apps, captured headless from their own code on sample data.

**Icons.** nomad-design's `symbols.tsx` imports every icon family it can draw
(~1.5 MB). `tools/nd-symbols.mjs` answers that import with a module generated
from nomad-design's own maps holding only `SITE_MARKS`. A page that starts
drawing a new mark adds its name there.

## Working on it

    npm install
    npm run dev                 # http://127.0.0.1:5390, client-rendered, hot reload
    npm run build               # typecheck, then tools/build.mjs → dist/
    node tools/serve.mjs        # dist/ on http://127.0.0.1:8791, /dl included
    node tools/check-site.mjs   # checks dist/: links, fragments, markup, prerender, buy links, prices
    node --test tools/releases.test.mjs   # the /dl functions

`npm run build` prints every page's JS and CSS, raw and gzipped.
`serve.mjs` stands in for `wrangler pages dev`, whose workerd has no ARM64
Windows binary: pretty URLs (`ax.html` at `/ax`), and the real functions
answering from the real GitHub releases (downloads are not streamed in the
preview).

## Downloads

Installers are **release assets** on `rami-abouhatab/nomad-downloads`, never
files in this repo: they are ~100 MB each and Pages caps a file at 25 MB.
Each product publishes on its own schedule into that one repository, named

    <Product>-<version>-<arch>-setup.exe

with Product one of `AX`, `Polaris`, `Reach`, `Drift`, `NomadOffice` and arch
`arm64` or `x64`. Builds named `Nomad-…` (from before AX had its name) count as
AX. Publishing is uploading the files to a (non-draft, non-pre-release)
release — no edit here, the buttons light up on their own.

| Route | Answers |
| --- | --- |
| `/dl/<product>/<arch>` | streams the newest build (`ax`, `polaris`, `reach`, `drift`, `office`) |
| `/dl/<arch>` | the original link; still AX |
| `/dl/manifest?product=reach` | JSON: version, date, and each arch's file, size and url, or `null` |
| `/dl/manifest?product=all` | the same for every product, under `products` |
| `/dl/manifest` | AX in the original shape, for anything that copied the old page |

The newest version wins across all releases, so one release may carry several
products and a product's latest build need not be in the latest release.

## Deploying

Served by **Cloudflare Pages**, project `nomad-downloads`, by direct upload:
nothing deploys on push. The domains (`nomad.ax`, `www`, `get`, `guest`, and
the older `bynomad.co` hosts) are attached to that project in Cloudflare.

1. Rebuild `/desk` if the shell changed, from nomad-shell:

       npx vite build --mode web --outDir ../nomad-site/desk

2. Build and check. The build stages `public/` (assets, `/g`, `_headers`) and
   copies `desk/` into `dist/`:

       npm run build
       node tools/check-site.mjs
       node --test tools/releases.test.mjs

3. Deploy from the repository root — wrangler compiles `./functions` from the
   folder it runs in, whatever folder it uploads — with `CLOUDFLARE_API_TOKEN`
   and `CLOUDFLARE_ACCOUNT_ID` in the environment:

       npx wrangler pages deploy dist --project-name nomad-downloads --branch main --commit-dirty=true

On the ARM64 laptop wrangler's `workerd` has no binary: install wrangler with
`--ignore-scripts`, run `npm rebuild esbuild`, and stub
`node_modules/workerd/lib/main.js` to `module.exports = {}` — the Pages deploy
never runs workerd.

After a deploy, open `https://nomad.ax/dl/manifest?product=all` and check every
product reports what you expect.

The source the products are built from lives in separate, private repositories.
