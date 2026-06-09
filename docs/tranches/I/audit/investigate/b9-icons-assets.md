# B9 — Icons + Missing Assets + Source-Map Errors — Investigation

**Agent:** investigation [b9-icons-assets]
**Date:** 2026-06-08
**Surfaces:** B9 — `ENOENT: assets/icons/easing-icon-sm.svg`; "Source Map loading errors (x47)";
the dev-vs-build icon-resolution discrepancy; the `vite-svg-loader ?component` seam.

---

## TL;DR (root-cause verdict)

B9 is **NOT an application defect in the current source or the built product.** It is a
**dev-environment STALE-STATE artifact** plus **benign DevTools source-map noise from
pre-bundled vendor deps (Monaco)**. Concretely:

1. **`easing-icon-sm.svg` 404 / ENOENT** — that filename was a **real tracked icon in H.W5**
   (`db90cbb`), then **renamed to the bare `easing.svg`** in H.W10 (`8df1e6a`, "RE-INSTANTIATED
   icons"). **Zero live source references `*-icon-sm.svg` today.** The error the user saw came
   from a **stale Vite dev module graph / browser cache** (and/or the un-tracked stale
   `demo/app/dist/` build artifact dated **March 25**) still importing the OLD path. A
   freshly-restarted dev server and the built `dist/gh-pages/` both resolve **zero** such 404s.

2. **"Source Map loading errors (x47)"** — these are **DevTools-only** warnings emitted while
   Vite's dep-optimizer serves **Monaco's lazily-loaded language chunks** (`apex`, `postiats`,
   `protobuf`, …) and `html2canvas`, whose `sourceMappingURL` comments point at maps the
   optimizer does not always emit alongside the chunk (`html2canvas.js.map` is literally absent
   in `node_modules/.vite/deps`). They are a **dev-mode console annoyance, not runtime failures**,
   and **do not appear in the built `dist`** at all.

The icon **architecture itself is sound and idiomatic** (inline-`<svg>` via the
`vite-svg-loader ?component` seam, themed by `currentColor`). Icons render correctly in both
dev and build (verified visually — see screenshots). **The fix is hygiene + a guard gate, not a
re-architecture.**

---

## Reproduction harness

Two playwright probes (modeled on `scripts/proof-no-orphan-specular.mjs`: ephemeral `serveDist`
on port 0; `chromium` via `createRequire(KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js)
.require("playwright-core")`; `openSceneFresh` → `${base}/#/${scene}`):

- **Built dist** — `docs/tranches/I/audit/investigate/probes/b9-icons-assets.mjs`
  serves `dist/gh-pages/`, records EVERY request (server-side 404 set) + browser
  `console`/`pageerror`/`requestfailed`/`response>=400` + `.map` fetches + a per-scene icon
  inventory (`<svg>` count, `<img>` srcs, broken imgs, CSS `url()`s) + a screenshot.
- **Dev server** — `docs/tranches/I/audit/investigate/probes/b9-dev-mode.mjs`
  points the same chromium at the live Vite dev server (`KF_DEV_BASE=http://localhost:5174`).

Run:
```sh
# built dist
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
  node docs/tranches/I/audit/investigate/probes/b9-icons-assets.mjs
# live dev (npm run dev must be up)
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js KF_DEV_BASE=http://localhost:5174 \
  node docs/tranches/I/audit/investigate/probes/b9-dev-mode.mjs
```
JSON output: `probes/b9-probe-output.json` (dist) · `probes/b9-dev-output.json` (dev).

---

## Evidence

### (1) Built `dist/gh-pages/` — CLEAN, swept across all 7 scenes

```
SERVER 404 PATHS (union across scenes): (none)
[cube]        consoleErrors=1 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=45 brokenImgs=0
[amiga]       consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=54 brokenImgs=0
[square]      consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=27 brokenImgs=0
[easing]      consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=22 brokenImgs=0
[spring]      consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=21 brokenImgs=0
[sequence]    consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=18 brokenImgs=0
[motion-path] consoleErrors=0 pageErrors=0 netFailures=0 sourcemaps=0 inlineSvg=17 brokenImgs=0
```
- **Zero** missing assets, **zero** broken `<img>`, **zero** `.map` requests, **zero** CSS
  `url()` background images. Icons are inline `<svg>` SFCs (17–54 per scene).
- The single `cube` console error is the **B1 parse-error crash** (`Err x 0 / 1 | / ^^^`),
  **a different surface** (engine `processFrame` empty-input) — out of B9 scope. Recorded here
  only to disambiguate it from any icon error.

### (2) Fresh dev server (`:5174`, restarted clean) — ALSO CLEAN

```
[all 7 scenes] net404=0  sourcemapNon200=0  pageErrors=0
UNION 404 SET (dev):           (none)
UNION SOURCEMAP FAIL SET (dev): (none)
```
On a **freshly-restarted** dev server (clean module graph, no HMR drift, no browser cache),
**the `easing-icon-sm.svg` 404 does NOT reproduce.** This is the key disambiguation: the bug is
**state-dependent**, not source-dependent.

### (3) Direct dev-server fetches — the SPA-fallback masks the missing file

```
GET /assets/icons/easing-icon-sm.svg  → HTTP 200  Content-Type: text/html   (SPA fallback = index.html!)
GET /assets/icons/totally-bogus.svg   → HTTP 200  Content-Type: text/html   (same — any unknown path)
GET (current) easing.svg              → HTTP 200  (real file, resolves)
```
The Vite dev server's **SPA history-fallback returns `index.html` (HTTP 200, `text/html`) for
ANY unknown path.** So a stale reference to `easing-icon-sm.svg` does **not** surface as a
browser network 404 — instead the browser gets HTML where it expected an SVG (a silent
mis-paint), while the **Vite server process** logs the **filesystem `ENOENT`** when its
transform pipeline (the `?component` plugin) tries to `readFile` the path named by a stale
importer. That is exactly the `ENOENT: assets/icons/easing-icon-sm.svg` shape the user reported.

### (4) Git archaeology — the rename that orphaned the old name

```
assets/icons/easing-icon-sm.svg   ADDED  H.W5  db90cbb  (the inline-<svg> icon registry, S1/S2)
                                  DELETED H.W10 8df1e6a  (icons RE-INSTANTIATED → bare easing.svg)
assets/icons/easing.svg           CURRENT (live; scenes.ts imports "@assets/icons/easing.svg?component")
```
H.W10 also killed the 6 raster PNGs (`cube-icon-sm.png`, `amiga-icon-sm.png`, …) and re-pointed
the favicon to `favicon.svg` (BLK-7). **No live source string contains `-icon-sm`** — the only
hits are H-tranche **docs** and the **un-tracked stale `demo/app/dist/`** artifact:
```
demo/app/dist/index.html         → <link rel="icon" href="/assets/cube-icon-sm-CqZgfax4.png">   (March 25, stale)
demo/app/dist/assets/index-*.js  → references easing-icon-sm                                    (March 25, stale)
git ls-files demo/app/dist  → (empty)   ← NOT tracked; pure local build crud from the old era
```

### (5) The "x47 Source Map" errors — Monaco + html2canvas dep-optimizer maps

```
optimized dep chunks (node_modules/.vite/deps) referencing a .map : 137
  of those, .map MISSING next to the chunk                        : 1  (html2canvas.js.map)
sample chunks carrying source-maps: apex-*, postiats-*, protobuf-*  (Monaco monarch languages)
value.js / parse-that dists ship maps: 25 each, present
glass-ui dist: 0 sourceMappingURL, 0 .map files
```
The "x47" is the cluster of **DevTools source-map load attempts** for Monaco's per-language
worker chunks (Monaco bundles ~50+ language grammars; `vendor-monaco` is lazy-loaded only when
the CSS editor mounts — that's why it correlates with editor-bearing scenes) plus `html2canvas`.
These maps are either (a) not emitted by Vite's optimizer next to the served chunk, or
(b) point at sources DevTools cannot resolve. They are **dev-only DevTools console diagnostics**;
they do **not** fire `pageerror`, do **not** 404 in the network tab of the **built** app
(the gh-pages build sets `sourcemap: false`, see `vite.config.ts:289` for the lib build and the
gh-pages block), and have **zero** runtime effect.

### (6) Visual confirmation — icons render in BOTH dev and build

`shots/b9-dev-cube.png`: the dock dropdown shows the **colorful "🎲 Cube" scene icon**; the
sidebar shows the **easing pencil-edit glyph + the curve glyph + Play/Reverse icons**, all
rendered as themed inline SVG. `shots/b9-*.png` (dist) and `shots/b9-dev-*.png` (dev) across all
7 scenes show no missing/broken glyphs. The `?component` seam works end-to-end.

---

## The architecture (for the record — it is correct)

- **Seam:** `vite.config.ts:190` `svgLoader({ defaultImport: "component", svgoConfig: …})` with
  `convertColors:false` + `removeViewBox:false` so `currentColor` theming + scaling survive SVGO.
- **Reference:** `demo/app/scenes.ts:15-21` imports each glyph `from "@assets/icons/<id>.svg?component"`
  and hangs it on `SceneDescriptor.icon` (icon-as-data, single-source; the dock iterates
  `scene.icon` via `<component :is>` — no parallel string-keyed map that drifts on a rename).
- **Alias:** `vite.config.ts:161` `@assets → <repo>/assets`. The 7 scene SVGs + `favicon.svg`
  all exist in `assets/icons/` (verified).
- **Favicon:** dev `index.html` uses `href="../../assets/icons/favicon.svg"` (root = `demo/app/`,
  resolves to `<repo>/assets/icons/favicon.svg`); the build rewrites it to the hashed
  `./assets/favicon-*.svg` (`dist/gh-pages/index.html:17`). Both resolve.

This is **idiomatic** and should be **preserved**, not transposed. The single named flaw is that
it has **no guard** against a renamed/orphaned glyph re-appearing, and **no gate** that an icon
actually paints at runtime — which is precisely the H gate-blindspot.

---

## Root-cause hypothesis (ranked)

1. **PRIMARY — stale dev module graph / browser cache referencing the H.W5-era `*-icon-sm.svg`.**
   The user's live `:5174` had been running across the H.W5→H.W10 icon rename; an un-invalidated
   HMR module (or a hard-cached browser entry, or the stale `demo/app/dist/` artifact bleeding in)
   kept importing the deleted path. Vite's `?component` plugin `readFile`'d it → server `ENOENT`;
   the browser got the SPA HTML fallback (200) → silent icon mis-paint. **Reproduces only with a
   stale graph; a clean restart is green.** Confidence: HIGH (git rename + clean-restart-green +
   SPA-fallback mechanics all corroborate).

2. **SECONDARY — Monaco/html2canvas dep-optimizer source maps → the "x47" DevTools noise.**
   Pre-bundled vendor chunks carry `sourceMappingURL` comments whose maps the optimizer does not
   reliably co-serve (`html2canvas.js.map` is outright absent). Dev-only, benign, build-clean.
   Confidence: HIGH.

3. **CONTRIBUTING — the un-tracked stale `demo/app/dist/` (March 25).** A leftover old-era build
   in the source tree that still names `cube-icon-sm.png` / `easing-icon-sm`. It is not on the
   serve path of either the current dev root or the gh-pages build, but it is a latent
   contamination source and pollutes greps. Should be deleted + git-ignored. Confidence: MED.

---

## What B9 needs from the tranche (hand-off to root-cause/authoring)

- **Hygiene (KISS, no re-arch):** delete the un-tracked stale `demo/app/dist/`; add it (and any
  stray non-canonical build dirs) to `.gitignore`; document the single canonical demo build
  output (`dist/gh-pages/`).
- **The real gate (closes the blindspot for B9):** a **runtime icon-paint gate** — playwright
  opens each scene, asserts **every** `SceneDescriptor` glyph resolves to a **painting** inline
  `<svg>` with non-zero box (not an SPA-HTML fallback, not a broken `<img>`), and asserts the
  **server-side 404 set is empty** while clicking through scenes + opening the editor (so a future
  icon rename that orphans a path REDS at runtime, not just at source-shape). This is the lesson:
  H's `proof:scene-icons` checked source-shape + load-time and **missed the orphaned-rename class
  of failure** because the SPA fallback hides it from the network tab.
- **Source-map noise:** a deliberate disposition for the Monaco/html2canvas dev-map warnings —
  either accept-and-document (they are dev-only, build is `sourcemap:false`) or suppress at the
  Vite dep-optimize layer. Recommend **accept + document** (KISS; suppression risks masking real
  map errors). NOT a runtime defect; should be explicitly de-scoped from "broken product".

---

## Artifacts

- Probes:
  `docs/tranches/I/audit/investigate/probes/b9-icons-assets.mjs` (dist),
  `docs/tranches/I/audit/investigate/probes/b9-dev-mode.mjs` (dev)
- JSON:
  `docs/tranches/I/audit/investigate/probes/b9-probe-output.json`,
  `docs/tranches/I/audit/investigate/probes/b9-dev-output.json`
- Screenshots: `docs/tranches/I/audit/investigate/shots/b9-*.png` (dist, 7 scenes),
  `docs/tranches/I/audit/investigate/shots/b9-dev-*.png` (dev, 7 scenes) —
  `b9-dev-cube.png` is the visual icon-render confirmation.
