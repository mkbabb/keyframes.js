# Root-Cause — rc-icons-build (B9: missing icon · dev-vs-build divergence · source-map x47)

**Agent:** root-cause [rc-icons-build]
**Date:** 2026-06-08
**Inputs read:** `investigate/b9-icons-assets.md` (+ `probes/b9-probe-output.json`,
`probes/b9-dev-output.json`), the live icon seam (`vite.config.ts` svgLoader, `src/env.d.ts`,
`demo/app/scenes.ts`, `demo/app/index.html`, `assets/icons/`), and git archaeology
(`db90cbb` H.W5, `8df1e6a` H.W10).
**Scope:** B9 only — the `ENOENT: assets/icons/easing-icon-sm.svg`, the dev-resolves-vs-build-uses
divergence, and the "Source Map loading errors (x47)". This is **design input for the waves**, not
a patch. No source is changed.

---

## 1. Verdict (confirmed root cause)

B9 is **NOT a defect in the current live source or in the built `dist/gh-pages/` product.** Both
resolve **zero** icon 404s and **zero** source-map non-200s across all 7 scenes (probe evidence
below). B9 is a **dev-environment integrity failure with three distinct, co-occurring causes**, all
rooted in a single structural gap: **there is no single source of icon/asset truth that the dev
server, the build, and the gates all share — and no runtime gate that an icon actually paints.**

| # | Symptom | Confirmed cause | File:line anchor |
|---|---------|-----------------|------------------|
| B9-a | `ENOENT: assets/icons/easing-icon-sm.svg` (the `*-icon-sm.svg` orphan) | A **stale local `demo/app/dist/`** build artifact (mtime **Mar 25**) + a stale Vite/browser module graph still importing the H.W5-era name that H.W10 renamed. The dev SPA-fallback masks it as HTTP-200 HTML, so it never surfaces as a browser 404 — only the Vite process logs the FS `ENOENT`. | rename: `db90cbb`→`8df1e6a`; orphan on disk: `demo/app/dist/index.html`, `demo/app/dist/assets/index-DMdgtHAo.js`; current seam: `demo/app/scenes.ts:18` (`easing.svg?component`) |
| B9-b | dev "resolves" `easing-icon-sm.svg` but build "uses" `easing.svg` | **Not a divergence in the live graph** — it is the **default-outDir landmine**: `vite.config.ts:274` sets `root: "./demo/app/"` with **no `outDir`** for the default build, so a bare `vite build` writes to `demo/app/dist/` (the Mar-25 orphan), while gh-pages is **explicitly** redirected to `dist/gh-pages/` (`vite.config.ts:286`). Two build roots, one stale, nothing cleans it. | `vite.config.ts:274` (root, no outDir) vs `vite.config.ts:286` (gh-pages outDir) |
| B9-c | "Source Map loading errors (x47)" | **Dev-only DevTools noise** from Vite's dep-optimizer serving Monaco per-language chunks + `html2canvas` whose `sourceMappingURL` maps it does not co-emit (`html2canvas.js.map` literally absent in `node_modules/.vite/deps`). **Zero** in the build (`sourcemap: false`, `vite.config.ts:289`). | `vite.config.ts:289` (`sourcemap: false`); dep-optimizer chunks under `node_modules/.vite/deps` |

Confidence: **HIGH** on all three — corroborated by git rename + clean-restart-green probes +
SPA-fallback mechanics (B9-a), by reading the two build blocks (B9-b), and by the build's
`sourcemap:false` + the missing `.map` inventory (B9-c).

---

## 2. The icon architecture is SOUND — preserve it

The reference seam is idiomatic and must **not** be re-architected:

- **One mechanism:** inline-`<svg>` SFC via `vite-svg-loader` `?component` (`vite.config.ts:190`,
  `defaultImport:"component"`, `convertColors:false` + `removeViewBox:false` so `currentColor`
  theming and `viewBox` scaling survive SVGO). Typed by `src/env.d.ts:16` (`declare module
  "*.svg?component"`).
- **Icon-as-data, single-source:** `demo/app/scenes.ts:15-21` imports each glyph and hangs it on
  `SceneDescriptor.icon`; the dock renders `<component :is="scene.icon">` (`ChromeDock.vue:225`).
  There is **no parallel string-keyed icon map** that can drift on a rename — the descriptor *is*
  the registry.
- All 8 SVGs (7 scenes + `favicon.svg`) exist in `assets/icons/`; `@assets` aliases to
  `<repo>/assets` (`vite.config.ts:161`). Icons paint in **both** dev and build (visual confirm in
  `shots/b9-dev-cube.png`).

The seam's **only** structural flaw: it is **build-time / load-time only**. A rename that orphans a
path cannot be caught by it, and **nothing asserts a glyph actually paints at runtime**.

---

## 3. Why the gates missed it (the blindspot, precisely)

H shipped `proof:scene-icons` GREEN. It checked **source-shape + load-time**: every
`SceneDescriptor` has an `icon`, every import string resolves at build. It is **blind to three
things**, each of which B9 exploits:

1. **The SPA history-fallback hides orphaned asset paths.** The dev server returns `index.html`
   (HTTP **200**, `text/html`) for ANY unknown path — `easing-icon-sm.svg` and `totally-bogus.svg`
   both 200 (probe §3). So a stale importer of a deleted glyph produces **HTML where SVG was
   expected** (a silent mis-paint) — never a network 404 the gate could see. The truth lives only
   in the **Vite process's** `ENOENT` log, which no gate reads.
2. **No runtime paint assertion.** The gate confirms the descriptor *names* an icon; it never
   confirms a **painting `<svg>` with non-zero box** is on screen after navigation. An orphaned or
   broken glyph is structurally invisible to a source-shape check.
3. **No build-output hygiene gate.** A stale `demo/app/dist/` from a default-outDir build sits in
   the tree contaminating dev-resolution and greps; nothing detects or forbids the second,
   orphaned build root.

This is the user's standing warning made concrete: *green source-shape gates miss
appearance/interaction/state; audit the RUNNING demo.* The icon orphan is the textbook
**orphaned-rename class**, invisible to load-time gates by construction.

---

## 4. The idiomatic GESTALT fix DIRECTION (the seam, the transposition)

Not a patch. The single root is **no shared source of asset truth across dev / build / gate**. Three
moves collapse the three symptoms into one invariant.

### 4.1 ONE build root — eliminate the default-outDir landmine (closes B9-b at the seam)

`root: "./demo/app/"` with **no explicit `outDir`** is the structural cause of the orphan: a default
`vite build` *will* re-spawn `demo/app/dist/`. The transposition is to make **the demo build have
exactly one output path, declared in one place**, and make a second output **impossible**, not
merely cleaned:

- The gh-pages build already routes to `dist/gh-pages/` (`vite.config.ts:286`). Give the **default**
  demo build the **same** single canonical `outDir` (under the gitignored root `dist/`), so no Vite
  invocation can ever write to `demo/app/dist/` again. The orphan becomes **unreachable by
  construction**, not a thing we periodically `rm`.
- Delete the existing Mar-25 `demo/app/dist/` orphan as one-time hygiene. (It is **already** ignored
  from VCS — `dist/` in `.gitignore` matches at any depth, so `git check-ignore demo/app/dist` =
  IGNORED; the B9-finding's "add to .gitignore" recommendation is **already satisfied** and should
  not be re-litigated. The real fix is *outDir collapse*, not a gitignore line.)

### 4.2 The dev server must NOT mask missing assets as 200-HTML (closes B9-a's invisibility)

The SPA history-fallback returning `index.html` for `*.svg` is what let the orphan hide. The
gestalt move: **asset paths and route paths are different namespaces — the SPA fallback must apply
to routes, never to file-extension'd asset requests.** A request for a `*.svg` (or any
asset-extension) that misses should **404 honestly** so it surfaces in the network tab and the
runtime gate, instead of silently returning HTML. This makes orphaned-asset failures **observable**
— the precondition for any gate to catch them.

### 4.3 ONE runtime icon-paint gate replaces the source-shape `proof:scene-icons` (closes the blindspot for good)

The headline transposition. The gate moves from *source-shape* to *runtime appearance*:

- Playwright opens **each** scene, and for **every** `SceneDescriptor.icon` (plus the favicon),
  asserts the glyph is a **painting inline `<svg>` with a non-zero bounding box** — not an SPA-HTML
  fallback, not a broken `<img>`, not a zero-box node.
- While clicking through scenes **and opening the CSS editor**, asserts the **server-side 404 set is
  empty** (the probe already records this — `server404Paths: []`). A future rename that orphans a
  path then **REDs at runtime**, where it lives, instead of passing a load-time shape check.
- This is one gate that subsumes the old one: it proves the descriptor names an icon **and** that
  the icon paints **and** that no asset 404s during interaction — the three things the H gate could
  not see.

### 4.4 Source-map noise (B9-c) — deliberate disposition, NOT a "fix"

The x47 is **dev-only DevTools diagnostics** from pre-bundled vendor maps (Monaco languages +
`html2canvas`); the build is `sourcemap:false` and clean. Recommended disposition: **accept +
document**, and explicitly **de-scope it from "broken product."** Suppressing it at the Vite
dep-optimize layer risks masking *real* future map errors (KISS: do not add machinery to silence
benign noise). The gate (§4.3) already asserts `sourcemapNon200 === 0` on the **built** product,
which is where it matters.

---

## 5. What this hands to the waves

1. **Seam fix (B9-b):** collapse the demo build to a single canonical `outDir`; the default-outDir
   landmine is the architectural root, not the orphan file. One-time delete the Mar-25
   `demo/app/dist/` (already VCS-ignored — no gitignore change needed; correct the B9-finding note).
2. **Honesty fix (B9-a):** the dev SPA-fallback must 404 asset-extension misses, not mask them as
   200-HTML — the precondition that makes orphaned assets observable.
3. **Gate overhaul (the headline):** retire source-shape `proof:scene-icons`; author **one runtime
   icon-paint + zero-asset-404-during-interaction gate** that clicks through every scene and the
   editor. This is the B9-shaped instance of the tranche-wide gate-regime overhaul.
4. **Disposition (B9-c):** accept-and-document the dev source-map noise; assert clean only on the
   built product. No suppression machinery.

**No legacy, no workaround:** the fix is to **unify the three sources of asset truth** (dev serve,
build output, gate) behind one canonical output path and one runtime paint assertion — eliminating
the divergence at the seam rather than papering over the orphan.

---

## 6. Anchors (file:line, for the wave authors)

- Seam (keep): `vite.config.ts:190` svgLoader · `src/env.d.ts:16` `*.svg?component` ·
  `demo/app/scenes.ts:15-21` icon imports · `demo/@/components/custom/dock/ChromeDock.vue:225`
  `<component :is="scene.icon">`.
- Build-root landmine (fix): `vite.config.ts:274` (`root:"./demo/app/"`, no outDir) vs
  `vite.config.ts:286` (gh-pages outDir) · `vite.config.ts:289` (`sourcemap:false`).
- Orphan on disk (delete; already VCS-ignored): `demo/app/dist/index.html`,
  `demo/app/dist/assets/index-DMdgtHAo.js` (mtime Mar 25).
- Rename archaeology: `assets/icons/easing-icon-sm.svg` ADDED `db90cbb` (H.W5) →
  DELETED/RENAMED→`easing.svg` `8df1e6a` (H.W10). Zero live source references `*-icon-sm`.
- Probe evidence: `probes/b9-probe-output.json` (dist, `server404Paths:[]`, sourcemaps 0/scene),
  `probes/b9-dev-output.json` (fresh dev, net404 0, sourcemapNon200 0). Re-run:
  `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js node
  docs/tranches/I/audit/investigate/probes/b9-icons-assets.mjs`.
- Favicon resolves both ways: dev `demo/app/index.html:17` (`../../assets/icons/favicon.svg`) ·
  build `dist/gh-pages/index.html:17` (hashed `./assets/favicon-*.svg`).
