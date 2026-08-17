# Nomad — downloads

The public download page for [Nomad](https://nomad.devapps.cc), served by
GitHub Pages from this repository's `main` branch.

Installers are published as **release assets** rather than committed here:
they are ~100 MB each and a git repository is the wrong place for a binary
that is rebuilt every version.

Publishing a new version is two steps — upload the installers to a release,
then point `RELEASE` in `index.html` at it. Nothing else in the page changes.

The source Nomad is built from is a separate, private repository.
