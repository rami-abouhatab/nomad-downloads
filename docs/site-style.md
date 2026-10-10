# nomad.ax: the locked style

Rami, 2026-10-10: "lock the theme and style and rules, and do it for every page." The home page is
the reference. Every page is built from the parts in `src/ui/system.tsx`, styled by the "Page
system" block at the end of `src/site.css`. A new page uses these parts. It does not get new CSS
unless a part is genuinely missing, and then the part is added to the system, not to the page.

## The ground and the bands

- The page is **white**. A section is set apart in one of two ways:
  - **mist** (`#f5f5f7`, apple.com's light grey band), at most once or twice a page;
  - **black**, at most once a page. That is the page's one dark moment: `InMeridian` on an app
    page, or the black "Questions? Answers." on MeridianOS and Pricing.
- **One rhythm** (`--rhythm`, 72–112px) separates every section. Two bands of the same tone in a
  row share it rather than doubling it. Under a light hero, the next band starts close (20–40px),
  so its title shows on the first screen, the way apple.com and microsoft.com end a hero early.
- **Side margins** are the footer's: `clamp(gutter, 6vw, 96px)`, full width. Sections are not
  boxed into a narrow column.

## Type

| Role | Size | Weight / tracking |
| --- | --- | --- |
| Hero title (`.ph-title`) | 40–76px | 700, −0.04em |
| Section title (`.sys-title`) | 40–72px | 700, −0.035em |
| Statement (`Statement`) | 44–96px | 700, −0.045em |
| Chapter / tab title | 30–48px | 700, −0.035em |
| Lede | 18–24px | `#4a4d54` |
| Column title | 20–24px | 650 |
| Body | 15–17px | `#4a4d54` |

Text is ink `#1d1d1f` on white, and `#f5f5f7` / `#a1a1a6` on black. Titles use `text-wrap: balance`.

## Actions

- Buttons are nomad-design's `LinkButton`: one `primary` verb per place, `hero` size in heroes and
  plan cards. On the dark hero the primary button is the light one.
- Every secondary link is `More` ("Learn more ›"). No link appears twice on a page.

## The hero (`PageHero`)

- Every hero takes **its product's colours**: the ground of the product's own icon, sampled from
  it (`[data-light='…']` in site.css). They form a static wash that ends in pure white over its
  last quarter, so there is never an edge where the page begins.
  - **MeridianOS** opens on pure black and ends square, like apple.com's macOS page.
  - **Nomad Office** carries its four apps' colours, one at each corner.
  - **Pricing and Download** use the neutral grey.
- `split` (copy left, picture right) is microsoft.com's product hero. `center` (stacked) is
  apple.com's. Choose per page.
- The picture is a `Mockup`. Until a product's mockup is made, its icon stands in, in its own
  light. Pass `src` when the mockup exists. Chapter and tab pictures are mockup slots in the same
  way (`data-mockup="product:n"`); real windows go in wherever they exist (`WindowShot`).

## The parts

| Part | Use | From |
| --- | --- | --- |
| `Statement` | one sentence, large | apple.com Safari, privacy |
| `Columns` | short ideas under hairlines; `numbered` for real steps, `icon` or `mark` over each | the home page's three steps; apple.com's "And so much more" |
| `Chapters` | one feature per row, words and picture alternating sides | apple.com Safari |
| `Tabs` | one feature at a time, from a row of names | microsoft.com Outlook, Microsoft 365 |
| `Tiles` | dark tiles, one idea each | apple.com privacy |
| `Gallery` | pictures in a row with a title and a line | — |
| `PlanPair` | the free app beside its paid plan | microsoft.com plan cards |
| `PlanSolo` | one paid product with no free side | — |
| `MiniCompare` | two plans row by row | — |
| `Platforms` | Mac, Windows, Windows on ARM, each with its download | the home page |
| `InMeridian` | the black "Included in MeridianOS" moment, with Meridian's mark | the home page's MeridianOS section |
| `FAQ` | the disclosure list, full width; `tone="black"` for "Questions? Answers." | the home page; apple.com |

## Every page has its own shape

No two pages run the same sections in the same order. The current shapes:

- **MeridianOS:** dark hero with the laptop · four places (Gallery) · the built-in apps (mist) ·
  And so much more · plans (mist) · where it runs · Questions? Answers. (black)
- **Polaris:** split hero · Statement · Chapters · built on (mist) · Get Polaris (Platforms) ·
  InMeridian
- **Reach:** split hero · Tabs · Reach and Reach Premium (mist) · own domain (Chapter) ·
  InMeridian · FAQ
- **Drift:** centred hero · three numbered steps · Drift or Drift Premium (MiniCompare, mist) ·
  your own devices (Chapter) · InMeridian
- **Citadel:** centred hero · Statement · dark Tiles · three steps (mist) · PlanPair · InMeridian ·
  FAQ
- **Nomad Office:** split hero in four colours · the four apps (Columns with icons) · Folio and
  Grids at work (Chapters, mist) · PlanSolo · InMeridian · FAQ
- **Pricing:** neutral centred hero with the period switch · plans · every feature side by side ·
  apps on their own (mist) · Questions? Answers. (black)
- **Download:** neutral centred hero · the downloads · which download is mine (mist)

## Motion and the first law

Gradients are static. The only motion is opacity, on the compositor: the scroll reveals and the
tab panel's settle. Nothing animates layout, filter or shadow, and under reduced motion everything
is at rest.

## Checks

`npm run build`, then `npm run check`. A page is not done until the checker passes and the page
shows no sideways scroll at 390px.
