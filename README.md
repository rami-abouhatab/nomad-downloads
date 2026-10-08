# nomad.ax

The public site of Nomad, the company: the products (AX, Polaris Browser,
Reach, Drift, Nomad Office), pricing, downloads, and the legal pages. Also the
`/dl` functions that serve installers, the old `/g` guest-link redirect, and
`/desk` — the shell's web build, which a guest link opens (nomad-shell
`src/guest`).

Plain HTML, one stylesheet (`site.css`) and one small script (`site.js`). No
framework and no build step: every page reads and works with scripts off.

| Path | Page |
| --- | --- |
| `/` | `index.html` — Nomad, "Wherever you are." |
| `/ax` | `ax.html` — AX, the desktop, with its plans |
| `/polaris` `/reach` `/drift` `/office` | one page per app |
| `/pricing` | AX plans first, then "Apps on their own" |
| `/download` | every product, per Windows architecture |
| `/privacy` `/terms` | legal (entity, contact and governing law still to fill) |

Prices on these pages are THE LAW in `nomad-shell/docs/pricing.md`
(2026-10-08). If a price changes there, change `partials/plans.html` and the
app prices in `pricing.html`, `reach.html`, `drift.html` and `office.html`.

**AX has no logo yet.** Until it does, AX is drawn typographically: the
`.plate-ax` squircle and the `.ax-lockup` wordmark in `site.css`. Drift's plate
is a placeholder glyph too; every other icon is the family-v1 artwork from
nomad-shell, with the shell's squircle baked in (`assets/icons/`).

## Shared markup

The nav, the footer, the yearly/monthly switch and the AX plan cards live once
in `partials/` and are copied into each page between
`<!-- partial:name -->` markers:

    node tools/sync-partials.mjs          # after editing anything in partials/

## Checking it

    node tools/check-site.mjs             # links, fragments, markup, ids, alt text, partials
    node --test tools/releases.test.mjs   # the /dl functions
    node tools/serve.mjs                  # preview on http://127.0.0.1:8790, /dl included

`serve.mjs` stands in for `wrangler pages dev`, whose workerd has no ARM64
Windows binary: pretty URLs, folder index pages, and the real functions
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

2. Check, then stage only what is public into `dist/` (no tools, partials,
   README or function sources):

       node tools/check-site.mjs
       node --test tools/releases.test.mjs
       node tools/stage.mjs

3. Deploy from the repository root — wrangler compiles `./functions` from the
   folder it runs in, whatever folder it uploads — with `CLOUDFLARE_API_TOKEN`
   and `CLOUDFLARE_ACCOUNT_ID` in the environment:

       npx wrangler pages deploy dist --project-name nomad-downloads --branch main --commit-dirty=true

   Deploying `.` instead of `dist` still works, as it always has; it just
   publishes the tooling alongside the site.

On the ARM64 laptop wrangler's `workerd` has no binary: install wrangler with
`--ignore-scripts`, run `npm rebuild esbuild`, and stub
`node_modules/workerd/lib/main.js` to `module.exports = {}` — the Pages deploy
never runs workerd.

After a deploy, open `https://nomad.ax/dl/manifest?product=all` and check every
product reports what you expect.

The source the products are built from lives in separate, private repositories.
