# Nomad Settings icons

Approved monochrome PNG interface icons for the Nomad Settings navigation.

- `black/<size>px/` contains black glyphs with transparent backgrounds.
- `white/<size>px/` contains geometrically identical white glyphs.
- `catalog/settings-preview.png` is a labeled review sheet and is not an app asset.
- `icons.json` lists every icon and exported size.

The glyphs use the approved filled concept sheet: solid primary silhouettes
with negative-space details. Every color and size comes from the same alpha
mask. Regenerate the library with:

```powershell
python scripts/generate_nomad_settings_icons.py
```
