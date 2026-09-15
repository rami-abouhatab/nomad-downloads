# Nomad — downloads

The public site for [Nomad](https://nomad.devapps.cc): the download page,
the `/dl` functions, the old `/g` guest-link redirect, and `/desk` — the
shell's web build, which a guest link opens (nomad-shell `src/guest`).

Served by **Cloudflare Pages** (project `nomad-downloads`, direct upload —
nothing deploys on push). To publish, from this folder, with
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment:

    npx wrangler pages deploy . --project-name nomad-downloads --branch main --commit-dirty=true

On the ARM64 laptop wrangler's `workerd` has no binary: install wrangler
with `--ignore-scripts`, run `npm rebuild esbuild`, and stub
`node_modules/workerd/lib/main.js` to `module.exports = {}` — the Pages
deploy never runs workerd. Rebuild `/desk` in nomad-shell with
`npx vite build --mode web --outDir ../nomad-site/desk` before deploying.

Installers are published as **release assets** rather than committed here:
they are ~100 MB each and a git repository is the wrong place for a binary
that is rebuilt every version.

Publishing a new version is two steps — upload the installers to a release,
then point `RELEASE` in `index.html` at it. Nothing else in the page changes.

The source Nomad is built from is a separate, private repository.
