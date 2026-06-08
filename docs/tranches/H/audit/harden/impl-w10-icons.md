# impl-w10-icons — Lane A (G1: RE-INSTANTIATE the expressive icons + 3 new)

**Wave:** H.W10 · **Lane:** A — ICONS (G1) · **Branch:** `tranche-h-impl`
**Contract:** `docs/tranches/H/waves/H.W10.md` §S1 + the lead's binding G1 direction
**Scope (file-disjoint):** `assets/icons/` + `demo/app/scenes.ts` (icon import doc-comments only)
**Status:** DONE · tsc-clean · `npm run gh-pages` resolves every icon import (zero resolution errors)

---

## The binding direction (the user's exact words, via the lead)

> "I don't want the icons re-created. I want them re-instantiated. The only new icons should be
> for those that lack them. If they are to be converted to SVG, they should be done so 1-1."

So: the 4 ORIGINALS return VERBATIM from `084feb9` (W5's parent); only the 3 primitives that
LACKED an icon get a NEW colorful mark, drawn to MATCH the re-instantiated four. W5's hand-authored
monochrome `stroke="currentColor"` geometry is DISCARDED for the four. The W5 `SceneDescriptor.icon`
+ `vite-svg-loader ?component` substrate is KEPT untouched (the D8 theme-blind-raster cure).

---

## (1) The 4 RE-INSTANTIATED originals (1:1 from `084feb9`)

| Icon | Source @ `084feb9` | Mechanism | Faithfulness (verified) |
|------|--------------------|-----------|--------------------------|
| `cube.svg`   | `cube-icon-sm.png` (32×32 RGBA, 1147 B) | 1:1 raster→SVG embed | decoded base64 `cmp`-equal to source PNG → **PIXEL-IDENTICAL** |
| `amiga.svg`  | `amiga-icon-sm.png` (32×32 RGBA, 2671 B) | 1:1 raster→SVG embed | decoded base64 `cmp`-equal to source PNG → **PIXEL-IDENTICAL** |
| `square.svg` | `square-icon-sm.png` (32×32 colormap, 1561 B) | 1:1 raster→SVG embed | decoded base64 `cmp`-equal to source PNG → **PIXEL-IDENTICAL** |
| `easing.svg` | `easing-icon-sm.svg` (already vector) | restored verbatim | `diff` empty vs `084feb9` → **BYTE-IDENTICAL** (the `hsl(248,88%,71%)` violet stroke + the two opacity-0.4 violet endpoint dots — NOT W5's currentColor flip) |

### The raster→SVG mechanism (the "your call" between `<img>`/url() and `?component` embed)

CHOSE the **1:1 base64-`<image>`-in-SVG `?component` embed** the lead sanctioned, over the
`<img>`/url() route. Each raster is wrapped EXACTLY as the lead specified:

```svg
<svg xmlns="…" width="32" height="32" viewBox="0 0 32 32"><image width="32" height="32" image-rendering="pixelated" href="data:image/png;base64,…"/></svg>
```

Why this route is the cleaner faithful mechanism:
- **Pixel-faithful by construction** — the embed carries the EXACT original bytes (verified: the
  base64 decodes `cmp`-equal to the `084feb9` source PNG); `image-rendering: pixelated` keeps the
  32px raster crisp at glyph size.
- **Descriptor + ChromeDock stay 100% uniform** — all 7 icons remain a single `Component` type on
  `SceneDescriptor.icon`, all imported via `?component`, all rendered by the ONE
  `<component :is="scene.icon">` site. ZERO churn to `scenes.ts` imports, `ChromeDock.vue`, or the
  `icon?: Component` type. (The `<img>`/url() route would have widened the icon type to
  `Component | string` and forked a raster branch into ChromeDock — needless complexity.)
- **The D8 structural defense HOLDS** — `?component` compiles even a raster-embed to an inline
  `<svg><image>` (verified: `@vue/compiler-sfc` `compileTemplate` → inline-`<svg>` root, ZERO bare
  `<img>` for all 7). The gate's "mounted icon is a real inline `<svg>`, not an `<img>`" bite passes
  for the whole family.
- **SVGO-safe** — the `convertColors:false`/`removeViewBox:false` `preset-default` pipeline
  preserves the base64 `href` + the `viewBox` + `image-rendering` (verified through the exact
  `vite.config.ts` config).
- **No no-raster red, no orphan asset** — no raw `.png` sits in `assets/icons/` (only SVG +
  favicon), so the gate's no-raster check passes trivially; the originals live AS their pixels
  inside the SVG, so there's no duplicate PNG file to drift.

The re-instantiated 4 overwrote the SAME filenames in place (`cube.svg`/`amiga.svg`/`square.svg`/
`easing.svg`) — so there is NO orphaned W5 monochrome SVG left behind (no legacy beside its
replacement; the delete + restore is one motion).

---

## (2) The 3 NEW colorful icons (only for the primitives that LACKED one)

Pre-W5 these three wore `<Home>` (no icon). Drawn FRESH, colorful, to match the re-instantiated
four's expressive register + visual weight. They paint from the demo's dual-theme palette tokens
(`design-idioms.css` `--rainbow-*` / `style.css` `--color-progress`) with a `currentColor` fallback
(robust if a token is ever absent — never blank). `var()` refs survive the SVGO pipeline (verified).

| Icon | Concept | Palette (token → resolved) |
|------|---------|----------------------------|
| `spring.svg` | a DAMPED SINE settling onto a rail + a settled endpoint dot | curve + rail + start-dot `var(--color-progress)` (green `hsl(142 71% 45%)` — the settling tone); settled endpoint `var(--rainbow-green, hsl(130 70% 50%))` |
| `sequence.svg` | STAGGERED bars rising off a baseline (the per-child stagger offsets) | the four bars are a rainbow stagger violet→blue→cyan→green (`var(--rainbow-violet/blue/cyan/green)`); baseline `var(--rainbow-blue)` @ opacity 0.4 |
| `motion-path.svg` | a LOOPING offset-path + a traveller circle (the SAME `PATH_D` the MotionPath scene authors, scaled 1:1 from its `0 0 400 400` author space) | path + traveller `var(--rainbow-cyan, hsl(180 80% 50%))` |

The W5 stroke GEOMETRY for these three was sound (only the COLOR was the W5 defect, and these three
are NEW — no "original" to re-instantiate), so the shape language is retained and RE-COLORED into the
expressive register; `motion-path` keeps its DRY one-geometry-source tie to `motionPathGeometry.ts`.

Palette rationale: the per-primitive hues track the contract's suggested map (§2 G1 / R3) — spring→
green (settle), sequence→blue family, motion-path→cyan — so the family reads coherent against the
re-instantiated four and against the demo's rainbow play-button/progress-rail palette.

---

## (3) The descriptor wiring (unchanged substrate)

All 7 scenes stay mapped on `SceneDescriptor.icon` via the unchanged `?component` imports
(`scenes.ts:8-14`); `ChromeDock.vue:172,195,211` renders each with `<component :is="scene.icon">`;
`vite.config.ts:190-205` `svgLoader convertColors:false`/`removeViewBox:false` carries the colorful
SVGs (baked `hsl()`, `var()`, base64-`<image>`) through unchanged. Coverage: all 7 non-home
descriptors carry `icon:` (verified). The ONLY edits to `scenes.ts` were the two stale doc-comments
that described the family as monochrome `stroke="currentColor"` — updated to describe the colorful
re-instantiated/new family + the embed mechanism (the D8 note re-stated for the raster-embed case).

`favicon.svg` is OUT of scope and UNTOUCHED — it is a standalone-document cube glyph with its own
`prefers-color-scheme` currentColor styling (a favicon has no host-page currentColor; it is not a
dock scene icon and the gate allow-lists it by name).

---

## (4) DELETED W5 monochrome SVGs

There were no SEPARATE orphan files: the W5 monochrome `cube/amiga/square/easing.svg` were the same
four filenames the originals re-instantiate, so they were overwritten in place. The W5 monochrome
geometry for the four is GONE from the tree (git shows the 4 as modified, not added/deleted). The 3
new (spring/sequence/motion-path) replaced their W5 monochrome predecessors at the same paths.

---

## Verification ledger (for the gate lane to bind to)

- `tsc --noEmit` → clean (twice: after assets, after doc-comment edits).
- `npm run gh-pages` → `✓ built`, ZERO icon-resolution errors; the built chunk contains the base64
  raster embeds AND the easing `hsl(248…)` violet (the `?component` seam carried them).
- Faithfulness: `diff` (easing) byte-identical; `cmp` of decoded base64 vs `084feb9` source
  (cube/amiga/square) pixel-identical.
- D8 defense: `@vue/compiler-sfc compileTemplate` → all 7 compile to an inline-`<svg>` root, ZERO
  bare `<img>` createElement (raster-embeds render `<svg><image>`).
- Monochrome inversion: every non-favicon icon resolves ≥1 colorful value (raster pixels for the 3
  embeds; `hsl()`/`var()` for the 4 vectors) — a `stroke="currentColor"`-ONLY icon no longer exists
  in the family.
- Coverage: 7/7 non-home descriptors carry `icon:`; substrate (`scenes.ts` imports / `ChromeDock` /
  `vite.config.ts`) untouched.

## Anticipated gate REVISE (owned by H.W8, not this lane) — what my assets satisfy

- **Re-instantiation faithfulness** — byte-match (easing) / pixel-match (cube/amiga/square embeds)
  vs `084feb9`. ✓
- **Monochrome inversion (non-vacuous)** — no `currentColor`-only icon remains; the 3 new resolve a
  `var(--rainbow*/progress)` token; the 4 originals carry baked color. ✓
- **Coverage** — 7/7. ✓
- **No-raster RELAXED** — `assets/icons/` holds only SVG + favicon (no raw PNG), so the relaxed
  allow-list is satisfied with room to spare (I used the embed, not raw PNGs). ✓
- **D8 inline-`<svg>` structural bite** — held for the whole family (incl. raster-embeds). ✓

NOTE for the gate author: I did NOT keep raw `{cube,amiga,square}-icon-sm.png` files (the gate's
allow-list permits them but does not require them) — the pixels live inside the SVG embeds, so the
faithfulness check should compare the DECODED base64 of `{cube,amiga,square}.svg` against the
`084feb9:assets/icons/{…}-icon-sm.png` blobs (the `cmp`-equal check I ran), not look for raw PNG
files on disk.
