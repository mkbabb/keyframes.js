# impl-w5-proof-scene-icons — the GATE lane: proof:scene-icons (browser + static)

**Lane:** H.W5 §Hard gate — RE-AUTHOR `proof:scene-icons` (the prior workflow's
gate-authoring lanes were cut by a session limit before their files persisted).
The landed W5 impl is the GREEN-target; a revert of any landed surface is the
born-RED. Authored the gate, wired it into `package.json` + `.github/workflows/
ci.yml`, verified every clause BITES. NO git commit (the lead commits). Did NOT
edit the landed source (the only working-tree source delta is the landed W5 impl
that pre-existed this lane; the ChromeDock `<img>` born-RED probe was reverted
byte-clean).

---

## The gate — `scripts/proof-scene-icons.mjs`

Mirrors the harness idioms the contract named: `serveDist()` + the in-page hash
reconcile driver (`navByHash`, the SAME fixed point as the in-app Scene combobox
— goto clears storage) + the H.W1 FSM settle (poll `keyframes-js-scene-machine`
`.activeScene`) + the `KF_REQUIRE_BROWSER` `skipOrFail` (a playwright-absent skip
becomes a hard CI fail). Two halves:

### STATIC half (always runs)

- **G2 COVERAGE** — parse `demo/app/scenes.ts`: brace-match the `scenes:
  SceneDescriptor[]` array, split into per-descriptor `{…}` literals (comments
  blanked), assert every `id:` other than `home` carries an `icon:`. An icon-less
  scene is structurally unshippable (the permanent D8 cure). Lands 7/7.
- **G1 SHAPE** — every `assets/icons/*.svg` EXCLUDING the index.html-named
  favicon: `viewBox="0 0 32 32"` + `fill="none"` + ≥1 `stroke="currentColor"`,
  with ZERO baked `hsl(`/`rgb(`/`#hex` on ANY `stroke=`/`fill=` attribute value
  (belt: a global hex/hsl/rgb sweep). `opacity`/`stroke-dasharray` are NOT colors
  and pass; endpoint/texture fills pinned `fill="currentColor"` pass. Lands 7/7.
- **G3 NO-RASTER + FAVICON 404 GUARD (BLK-7)** — `assets/icons/` holds ZERO
  `.png` modulo the SINGLE allow-listed favicon named in `index.html`'s
  `rel=icon` (here the favicon is `favicon.svg`, so the PNG allow-list is empty —
  every `.png` is forbidden); the allow-list set = EXACTLY the index.html path;
  AND `index.html`'s `rel=icon` href RESOLVES to an existing file on disk
  (resolved source-relative to `demo/app/index.html`). The favicon is the lone
  allow-listed file and is EXCLUDED from the G1 no-baked-color iteration (it
  renders as a standalone document with an explicit `prefers-color-scheme` hue).

### BROWSER half (`KF_REQUIRE_BROWSER`) — the load-bearing clause

- **favicon-served** — the BUILT `dist/gh-pages/index.html` `rel=icon` serves
  HTTP 200 (the live 404 guard on the shipped artifact; lands the hashed
  `favicon-lzj0QcBq.svg`).
- **G4 THEMING (the authority over the file-shape G1)** — land on `#/cube`, probe
  the MOUNTED scene icon in the dock Scene trigger (`[aria-label="Scene"]`), in
  BOTH `.dark` and light (toggle the `.dark` class on `<html>` — the demo's
  `@custom-variant dark` mechanism). The probe targets the scene-icon slot
  PRECISELY (the `icon-sm shrink-0` glyph that precedes `<SelectValue>`), NOT
  "any svg in scope" (reka-ui's `<SelectValue>` renders its own inner svg — a
  naive scope query false-passes while an `<img>` regression is live; this was
  caught during born-RED authoring and fixed). Asserts: (a) the slot is a real
  inline `<svg>`, NOT an `<img>` — an `<img :src>` short-circuits to a precise
  RED ("a replaced element that CANNOT read host currentColor — theme-blind BY
  CONSTRUCTION; even a vector file fails through the `<img>` reference"); (b) the
  computed stroke == the host computed `color` (the `currentColor` resolution) in
  BOTH themes; (c) the resolved stroke DIFFERS dark vs light (it tracks the
  theme, not a baked hue). Lands light `rgb(108,106,96)` / dark `rgb(163,161,153)`
  — `text-muted-foreground` across themes.

---

## Born-RED verification (each clause BITES on a revert; GREEN restores)

| revert | clause that bit |
|---|---|
| drop `icon: AmigaIcon` from the amiga descriptor | **G2 coverage** RED ("1 non-home descriptor defines NO icon: amiga") |
| bake `hsl(248,88%,71%)` onto `easing.svg`'s stroke | **G1 shape** RED ("baked color on a stroke/fill attr; no stroke=currentColor") |
| drop a `.png` into `assets/icons/` | **G3 no-raster** RED ("1 non-allow-listed .png: cube-icon-sm.png") |
| point `index.html` rel=icon at a missing file | **G3 favicon-resolve** RED ("resolves to … which does NOT exist on disk — a live 404") |
| revert the dock scene icon to `<img :src>` (rebuilt) | **G4 theming** RED ("the mounted scene icon is an `<img :src=…>` — theme-blind BY CONSTRUCTION") |

The G4 `<img>` born-RED used a faithful `<img :src="…cube.svg?url">` (the exact
theme-blind reference the stage-4 truth names — its data-URI even reads
`stroke='currentColor'`, yet the `<img>` mechanism is theme-blind, the bite the
PNG→SVG file-swap alone misses). All reverts were temp/non-destructive; the
ChromeDock + dist were restored byte-clean and rebuilt to the landed impl
(verified: zero `imgRegressionUrl` residue, 2 inline `<component :is>` sites,
favicon resolves in the rebuilt dist).

---

## Wiring

- **package.json** — added `"proof:scene-icons": "node scripts/proof-scene-icons.
  mjs"` (after `proof:icon-idiom`, the icon-family neighbor) AND into the
  `proof:all` chain (after `proof:icon-idiom`, grouped with the H.W5 gates; the
  sibling-authored `proof:scene-perf-budget` insertion left intact).
- **.github/workflows/ci.yml** — a `demo-smoke` job step (it has a browser half)
  with `KF_REQUIRE_BROWSER: "1"`, placed adjacent to the sibling-authored
  `proof:scene-perf-budget` step (the two H.W5 demo-smoke gates together).
- **proof:ci-coverage** → GREEN: "all 63 proof:* gates are invoked in CI" (the
  gate is counted; an authored-but-unrun gate would have reded it).

## Verification run

- `npm run proof:scene-icons` (static) → PASS
- `KF_REQUIRE_BROWSER=1 npm run proof:scene-icons` (built dist served, real
  Playwright/chromium) → PASS (all 8 clauses green incl. G4 dark≠light)
- `node scripts/proof-ci-coverage.mjs` → PASS (63 gates invoked)
- `npm run gh-pages` → built green (the dist left at the landed good impl)

## Notes for the gate-regime lane (H.W8)

- G4 is the AUTHORITY over G1 (a file that reads `currentColor` but COMPUTES a
  baked hue at runtime — an `<img>` reference, an SVGO `convertColors` rewrite —
  FAILS). The probe inspects the scene-icon slot precisely, not "any svg in
  scope" (the reka-ui `<SelectValue>` inner-svg false-pass trap).
- The favicon allow-list is single-sourced from `index.html`'s `rel=icon` (G3
  derives the allowed set live; it is NOT a hardcoded basename), so a future
  favicon re-point (raster or vector) is honored without a gate edit, while the
  no-raster + 404 guards still bite.
