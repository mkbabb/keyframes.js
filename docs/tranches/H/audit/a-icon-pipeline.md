# Tranche H — DEEP AUDIT · lane `a-icon-pipeline`

**Charge:** the scene-icon ASSET pipeline — how the SVG/screenshot icons are
**produced → stored → referenced** (the thumbnail capture), end-to-end, so H can
*generate* icons for the surviving modes. Pairs with `a-scene-icons` (which owns the
registry design, idiom reconciliation, pertinence, and the survivor icon-concepts). This
lane owns the **mechanics of making, storing, building, and serving** an icon — the
reproducible generator H must land.

**Binding mandate:** idiomatic gestalt only; NO workarounds; a replaced surface replaced
in ONE motion; MEASURE-FIRST for every perf claim; every claim carries a `file:line` or a
live/build observation.

**Scope discipline vs. the pair:** `a-scene-icons` already concludes (correctly) that the
registry should move onto `SceneDescriptor` and the family should be one vector idiom. I do
NOT re-litigate that. I document the PIPELINE — the four stages an icon traverses, where
each stage lives today, the *measured* defects in each stage, and the **reproducible
generator spec** (the thing the user actually asked for: "document it end-to-end so H can
generate icons for the surviving modes").

---

## 0. TL;DR

The icon pipeline has **four stages**; only one is checked in.

| stage | today | state |
| --- | --- | --- |
| **1. PRODUCE** | ad-hoc Playwright screenshots (cube/amiga/square) + one hand-drawn SVG (easing) | **NOT REPRODUCIBLE** — no committed generator (git `74abd2b`) |
| **2. STORE** | repo-root `assets/icons/` — 7 files, 3 of them (`-lg`) dead | mixed idiom, 60 KB orphans |
| **3. BUILD/RESOLVE** | `@assets` Vite alias → `assets/`; default asset handling | works, but **inlines + duplicates** (measured) |
| **4. REFERENCE** | `<img :src="url">` in `ChromeDock.vue` | **theme-blind by construction** (replaced-element ctx) |

The single most consequential pipeline finding — beyond the pair's registry argument — is
**stage 4 + stage 3 together defeat theming for the icon H wants to standardize on.**
The easing SVG (the "good" idiom) is imported as a *URL* and rendered through `<img :src>`.
An `<img>` paints SVG as a **replaced element**: it cannot see the host document's
`currentColor`/CSS custom properties. So `easing-icon-sm.svg`'s baked `hsl(248,88%,71%)`
(`assets/icons/easing-icon-sm.svg:2`) is **just as theme-blind as the PNGs** in this
pipeline. Choosing "vector over raster" alone does NOT fix theming — the *reference
mechanism* (inline `<svg>` component, not `<img src=url>`) is what unlocks `currentColor`.
This is a pipeline truth `a-scene-icons` F1 assumes away ("themable via `currentColor`")
but the current `<img>` plumbing would silently negate.

**The deliverable H needs:** a checked-in `scripts/gen-scene-icons.mjs` (idiom B, photo-
real) *or* — recommended, converging with the pair — an **inline-SVG vector component
family** wired so the icon is a Vue `<component>`, not an `<img>` URL. I spec both below
with falsifiable gates. **Recommend the vector-component pipeline; spec the screenshot
generator fully too, because the user's phrasing ("screenshotted SVG thumbnails",
"generate icons") leaves the door open and H may want photo-real for cube/amiga.**

---

## 1. Stage 1 — PRODUCE (how each icon was actually made)

### 1.1 Two distinct production lineages, neither reproducible from the repo

**Lineage A — Playwright screenshots (cube, amiga, square).** git `74abd2b` (2026-03-15,
"feat(demo): add scene icons…"): the commit body states *"Capture Playwright screenshots
of cube (3-face angle, vivid colors), amiga (checkerboard ball, isolated), square (rotated
heyyyy) — All icons 256×256 (lg) + 32×32 (sm) with transparent backgrounds"*. The commit
added **only `Bin` blobs + an `index.html` favicon edit** (`git show 74abd2b --stat`: 7
binary files + 14 lines of HTML). **No generator script was landed.** The capture was run
from somewhere uncommitted and the outputs pasted in.

**Lineage B — hand-drawn SVG (easing).** git `f1d4fe6` ("feat(demo): add interactive
easing function demo scene") added `easing-icon-sm.svg` as a hand-authored vector: one ease
path + two endpoint dots, stroked in a literal hue (`easing-icon-sm.svg:1-5`).

### 1.2 The reproducibility hole — by the repo's own standard

The repo holds a CHECKED-IN capture harness, `scripts/capture.mjs`, whose header states the
exact precept the icons violate (`capture.mjs:6-11`):

> "the before/after-every-page edict … binds the capture to 'a SINGLE Playwright/Chrome
> harness CHECKED INTO the tranche's audit dir so it re-runs identically.' B authored the
> edict and ran the capture, but the harness lived in /tmp — so 're-runs identically' was
> unsatisfiable. This is that harness, in the repo."

The scene icons are in precisely that pre-`capture.mjs` unsatisfiable state: a generated
artifact with no committed generator. Under the mandate's NO-workaround / reproducibility
spine, the FIX is the same move that rescued the capture harness — land the generator.

### 1.3 The existing harness ALMOST does it — but the manifest is short three scenes

`scripts/capture.mjs` already: resolves Chromium (`demo-driver.mjs:74-88`), serves the
built `dist/gh-pages` (`serveDist`, `demo-driver.mjs:106-131`), navigates each scene by
hash route, computes a **subject rect** (`subjectRect`, `demo-driver.mjs:232-268` — largest
visible in-viewport element matching a selector), and **screenshots a clipped region**
(`capture.mjs:371-381` already does `page.screenshot({ clip: {x,y,width,height} })`). That
clip-screenshot is 80% of an icon generator.

**The gap (measured):** the shared `SCENES` manifest knows only six scenes —
`home/cube/amiga/square/easing/spring` (`demo-driver.mjs:40-59`). The four NEW modes the
icons are *for* — `sequence`, `motion-path`, `starting-style` (and `spring` lacks an icon
despite being in the manifest) — are **absent or icon-less**. A screenshot generator
reusing this manifest cannot even *reach* `sequence`/`motion-path`/`starting-style` until
the manifest gains their `route` + a `subjectSelector` per scene. This is the first
concrete task for an idiom-B pipeline.

### 1.4 Determinism is unproven for screenshots (MEASURE-FIRST)

The cube pose ("3-face angle"), the amiga checker phase, the square rotation are all
**animated** scenes. Two screenshot runs at arbitrary wall-clock times produce **different**
pixels (the cube is mid-rotation, the amiga checker has scrolled). For a screenshot pipeline
to satisfy "re-runs identically", each scene needs a **deterministic pose seed** — pause the
animation at a fixed `t`, or scrub to a fixed progress before the clip-shot. The current
RM-probe path waits a flat `2500ms` then samples (`capture.mjs:263,347`) — adequate for an
audit screenshot, NOT for a byte-stable icon. **No determinism instrument exists.** This is
the reason idiom A (hand-authored vector, where the file *is* the deterministic source) is
the lower-risk recommendation.

---

## 2. Stage 2 — STORE (where icons live on disk)

`@assets` → repo-root `assets/` (`vite.config.ts:160`, `vitest.config.ts:11`,
`tsconfig.json:22` all agree). The icon inventory (`file assets/icons/*`, this lane):

| file | type | dims | bytes | referenced by |
| --- | --- | --- | --- | --- |
| `cube-icon-sm.png` | PNG | 32×32 | 1147 | dock import + favicon `<link>` |
| `amiga-icon-sm.png` | PNG | 32×32 | 2671 | dock import |
| `square-icon-sm.png` | PNG | 32×32 (colormap) | 1561 | dock import |
| `easing-icon-sm.svg` | SVG | 32×32 vbox | 373 | dock import |
| `cube-icon-lg.png` | PNG | 256×256 | 9432 | **NOTHING (orphan)** |
| `amiga-icon-lg.png` | PNG | 256×256 | 31261 | **NOTHING (orphan)** |
| `square-icon-lg.png` | PNG | 256×256 | 18935 | **NOTHING (orphan)** |

**Storage defects:**
- **60.6 KB of dead `-lg` binaries.** `grep -rn "icon-lg\|lg.png" demo src --include=*.vue
  --include=*.ts | grep import` → zero hits (this lane; only matches are unrelated
  `class="icon-lg"` glyph-size utilities, e.g. `ChromeDock.vue:125`). KILL (agrees with pair
  F3). Their *only* purpose was a future "large render" that never arrived; under the
  mandate a large render should be a vector at any size, not a re-imported raster.
- **No naming/size contract.** `-sm` is 32×32, `-lg` is 256×256 by convention only — there
  is no schema, no manifest, nothing that says "an icon is 32×32 fill=none currentColor."
  This is why the four new scenes have NO file and nothing complained.
- **Mixed type per stem** (`.png` for three, `.svg` for one) — the store itself encodes the
  two-idiom split.

---

## 3. Stage 3 — BUILD / RESOLVE (what Vite does to an icon import)

The dock imports each icon as a module URL (`ChromeDock.vue:20-23`):
```ts
import cubeIcon from "@assets/icons/cube-icon-sm.png";   // → resolves to a string URL
```
Default Vite asset handling applies (no `assetsInlineLimit` / `assetsInclude` override
exists — confirmed `grep` over `vite.config.ts`/`vitest.config.ts`, this lane). Default
inline threshold is **4096 bytes**. **Measured against the built bundle** (`npm run
gh-pages` output present at `dist/gh-pages/`, this lane):

- All four dock icons are **under 4 KB → inlined as base64 data-URIs** into the entry chunk.
  `grep -o "data:image/png;base64" dist/gh-pages/assets/index-*.js` and
  `grep "data:image/svg+xml" …` both hit the **single entry chunk** `index-pbywWulI.js`
  (this lane). So all scene icons ship as base64 *inside the eager entry JS*, not as
  cacheable image files.
- **`cube-icon-sm.png` is DUPLICATED.** Because `index.html` *also* references it as the
  favicon (`demo/app/index.html:14` `<link rel="icon" href="../../assets/icons/
  cube-icon-sm.png">`), Vite processes the `<link>` as a build asset and **emits a
  separate hashed file** `dist/gh-pages/assets/cube-icon-sm-CqZgfax4.png` (this lane,
  `ls dist/gh-pages/assets/`), while the dock's `import` of the SAME file is **inlined** as
  base64. The cube icon thus ships twice: once as an emitted favicon file, once as base64 in
  the entry chunk. (Vite does not dedupe an HTML `<link>` asset against a JS `import` of the
  same source — different reference channels.)

**Favicon path correctness (positive — works):** the source `../../assets/icons/
cube-icon-sm.png` is correct because the build `root` is `demo/app/` (`vite.config.ts:244`),
so `../../assets` climbs to the repo root. Vite rewrites it to `./assets/
cube-icon-sm-CqZgfax4.png` in the built HTML (this lane). No defect here; noting it as the
one stage-3 thing that is already-SOTA.

**Build-stage verdict:** the inline-into-entry-chunk behavior is acceptable for ~1.5 KB
icons (avoids 4 round-trips), but it (a) bloats the eager entry, (b) makes the cube icon a
double-ship, and (c) is incidental, not designed. The real lever is stage 4: if the icons
become **inline `<svg>` Vue components** (idiom A), there is no asset URL to inline at all —
the markup is in the component tree, themable and zero-extra-request. That collapses stages
2/3/4 into one coherent move.

---

## 4. Stage 4 — REFERENCE (how an icon reaches the screen) — the theming defect

`ChromeDock.vue` renders every scene icon as a **raster-style `<img :src>`** in three sites
(`:171`, `:194`, `:210`):
```html
<img v-if="sceneIcons[currentSceneId]" :src="sceneIcons[currentSceneId]" … class="w-5 h-5 object-contain" />
```
with a `<Home>` Lucide glyph fallback (`:172`, `:211`; the dropdown-item site `:194` has NO
fallback — an unknown scene shows a bare label). The Lucide glyphs are inline `<svg>` (they
DO inherit `text-muted-foreground` / `currentColor`, `:145`,`:172`,`:180`). The scene icons
do NOT.

**The construction defect (root, MEASURE-FIRST via spec):** `<img src="…svg">` renders SVG
as a **replaced element**. A replaced-element / data-URI / external SVG is a *separate
document* — it **cannot** read the host page's `color` / `currentColor` / CSS custom
properties. So even the *vector* `easing-icon-sm.svg`, whose stroke is `hsl(248,88%,71%)`
(`easing-icon-sm.svg:2`), paints that **baked** hue in both light and dark mode — exactly as
theme-blind as the raster PNGs. The dock's own glyphs (inline `<svg>` via the Lucide
component) prove the contrast: they theme; the `<img>` icons cannot.

**Why this matters for H's charge:** `a-scene-icons` recommends "one vector family,
themable via `currentColor`." That recommendation is CORRECT but **incomplete without the
reference change** — switching PNG→SVG while keeping `<img :src>` yields a vector that is
*still* theme-blind. The pipeline truth: **theming is a property of the REFERENCE mechanism
(inline `<svg>`), not the FILE FORMAT.** H must change `<img>` → `<component :is>` /
inline-SVG, or the "themable" promise is silently broken.

---

## 5. The reproducible pipeline H should land

Two coherent end-to-end pipelines. **Recommend A.** Both have falsifiable gates.

### Pipeline A — inline-SVG vector component family (RECOMMENDED · SHIP-in-H)

The whole pipeline collapses to: **the file IS the source, the component IS the reference.**

1. **PRODUCE:** hand-author one `*.svg` per surviving scene in the `easing-icon-sm.svg`
   mould — `viewBox="0 0 32 32"`, `fill="none"`, **`stroke="currentColor"`** (NOT a baked
   hue — fix the easing icon's `hsl(248…)` to `currentColor` in the same motion),
   `stroke-width: 2.5–3`, `stroke-linecap: round`, optional `opacity:0.4` endpoint dots.
   Concepts are owned by `a-scene-icons §4`; this lane owns the *shape contract* above.
2. **STORE:** `assets/icons/<scene>.svg`. Delete the 3 `-lg` orphans + the 3 `-sm` PNGs in
   one motion (NO-legacy: replaced surface replaced once). Re-export cube favicon as a small
   SVG too, or keep the single emitted PNG favicon explicitly (favicons legitimately want a
   raster — that is a *named, befitting delta*, so it survives).
3. **BUILD/RESOLVE:** import the SVG as a **Vue component**, not a URL. Vite's
   `vite-svg-loader` (or `?component` query) turns `import CubeIcon from "…cube.svg?component"`
   into an inline-`<svg>` SFC. No data-URI, no extra request, themable. (One devDep +
   one alias-query — idiomatic, not a workaround.)
4. **REFERENCE:** the icon lives on `SceneDescriptor.icon: Component` (the pair's F2); the
   dock renders `<component :is="scene.icon" class="size-5 text-muted-foreground" />`. It now
   inherits theme color for free, exactly like the Lucide glyphs beside it.

**Falsifiable gates (`proof:scene-icons`):**
- **G1 (shape):** every `assets/icons/*.svg` has `fill="none"`, ≥1 `stroke="currentColor"`,
  `viewBox="0 0 32 32"`, and **zero** baked `hsl(`/`rgb(`/`#hex` stroke or fill.
- **G2 (coverage):** iterate `allScenes`; every non-`home` descriptor has a defined `icon`.
  (Structurally forbids the D8 regression — an icon-less scene cannot ship.)
- **G3 (no-raster):** `assets/icons/` contains zero `.png` (modulo a single, explicitly
  allow-listed favicon if H keeps one). Catches an `-lg` reappearance and any PNG drift.
- **G4 (themes — the stage-4 fix):** a jsdom/Playwright assert that a mounted scene icon's
  computed stroke equals the host `currentColor` in BOTH `.dark` and light — falsifies the
  `<img :src>` regression directly (an `<img>` icon FAILS G4 by construction).

### Pipeline B — checked-in screenshot generator (only if photo-real is a NAMED delta)

If H decides photo-real cube/amiga thumbnails are worth keeping (a *named, befitting
delta* — they ARE charming and uniquely communicate the 3D scenes), land a real generator
instead of pasted blobs. It reuses the existing harness end-to-end:

`scripts/gen-scene-icons.mjs`:
1. **Extend the manifest** (`demo-driver.mjs:40-59`): add `sequence`, `motion-path`,
   `starting-style` rows with a `route` + `subjectSelector` + a new `posePct` (deterministic
   scrub target). This is the prerequisite the pair flagged (manifest gap).
2. `serveDist(dist/gh-pages)` + `resolveChromium()` (reuse verbatim).
3. Per scene: `goto(#/route)`, **scrub the animation to `posePct` and PAUSE** (determinism —
   the missing piece §1.4; drive the demo's transport/scrubber, not a wall-clock wait), then
   `subjectRect(page, subjectSelector)` (reuse), then `page.screenshot({ clip, omitBackground:
   true })` → write `<scene>-sm.png` (32) and `<scene>-lg.png` (256) via a `deviceScaleFactor`
   pass or two clip sizes.
4. Emit a `_icons-manifest.json` recording each scene's `posePct` + output hash.

**Falsifiable gate (`proof:scene-icons` for idiom B):** run the generator twice; assert the
output PNG **byte hashes are identical** across runs (the determinism `capture.mjs` could
never claim for the original icons). If two runs differ, the pose seed is non-deterministic
and the gate fails — exactly the reproducibility hole §1.2 names.

**Why B is the fallback, not default:** it ships a second idiom (raster, theme-blind by
§4), requires non-trivial determinism work (§1.4), and re-introduces the inline/duplicate
build behavior (§3). Use it ONLY for the scenes whose value is *photographic* (the 3D cube,
the Three.js amiga); use vector (A) for the schematic scenes (easing/spring/sequence/path/
discrete). A **hybrid** is legitimate IF declared as the named delta and BOTH gates run.

---

## 6. Findings & dispositions

| # | finding | anchor | disposition | gate |
| --- | --- | --- | --- | --- |
| P1 | PRODUCE stage has no committed generator (icons un-reproducible) | git `74abd2b` (blobs only); `capture.mjs:6-11` (the very precept it violates) | **SHIP-in-H** (land idiom-A source files OR `gen-scene-icons.mjs`) | the icon source/generator is checked in; B-runs byte-identical |
| P2 | manifest reaches only 6 scenes; 3 survivors unreachable by any harness | `demo-driver.mjs:40-59` | **SHIP-in-H** (extend manifest, only if idiom B) / **BOOK** (moot under idiom A) | manifest has a row per non-home scene |
| P3 | screenshot poses are non-deterministic (animated scenes, flat wait) | `capture.mjs:263,347` | **MEASURE-FIRST** (prove byte-stable) before any B icon ships | two generator runs → identical hashes |
| P4 | STORE: 60.6 KB orphan `-lg` PNGs | `assets/icons/*-lg.png`; 0 import hits (this lane) | **KILL** | no `assets/icons/*.png` (modulo allow-listed favicon) |
| P5 | STORE: no icon shape/size contract | mixed `.png`/`.svg`, no schema | **SHIP-in-H** (codify the 32×32 `fill=none currentColor` contract) | `proof:scene-icons` G1 |
| P6 | BUILD: dock icons inline as base64 into eager entry chunk | `dist/gh-pages/assets/index-*.js` (this lane) | **RECORD** (moot under idiom A inline-SVG; minor under B) | n/a — folds into A |
| P7 | BUILD: `cube-icon-sm.png` double-ships (favicon file + dock base64) | `index.html:14` emit vs `ChromeDock.vue:20` inline (this lane) | **RECORD** (resolved by A; or de-dupe favicon ref) | one cube-icon byte source in the bundle |
| P8 | **REFERENCE: `<img :src>` is theme-blind by construction — even the SVG** | `ChromeDock.vue:171,194,210`; `easing-icon-sm.svg:2` (baked hue) | **SHIP-in-H** (inline `<svg>` component, not `<img>`) | `proof:scene-icons` G4 (stroke == host currentColor in dark+light) |
| P9 | favicon resolve path is correct (already-SOTA) | `index.html:14` → built `./assets/cube-icon-sm-*.png` (this lane) | **RECORD** (honest ALREADY-SOTA) | n/a |

**Cross-repo:** NONE. Every pipeline stage (produce script, `assets/`, `vite.config.ts`
alias, `ChromeDock.vue` render) is kf-owned. The dock CHROME defects (lag D5, popover D9)
are the glass-ui-HANDOFF lane — out of scope; this lane touches only what the dock renders
INTO its slot (the kf-owned scene icon), never glass-ui internals.

**Honest ALREADY-SOTA:** (1) the favicon resolution (§3, P9). (2) `scripts/lib/
demo-driver.mjs` is an exemplary single-sourced driver — `serveDist`/`resolveChromium`/
`subjectRect` are exactly the reusable primitives an idiom-B generator should compose, and
its convergence rationale (`demo-driver.mjs:1-27`) is the model for how `gen-scene-icons.mjs`
should be authored (share the manifest, never copy-paste it). (3) `easing-icon-sm.svg` is
the right *shape* idiom; its only wart is the baked hue (P8), trivially fixed to
`currentColor`.

---

## 7. Anchors used

- `demo/@/components/custom/dock/ChromeDock.vue:20-30,125,145,171-172,180,194,210-211`
- `demo/app/scenes.ts:7-14,54-123` (SceneDescriptor has no `icon`)
- `demo/app/index.html:14` (favicon source path)
- `assets/icons/*` (inventory via `file`; `easing-icon-sm.svg:1-5`)
- `vite.config.ts:160,244` (`@assets` alias, build root); `vitest.config.ts:11`;
  `tsconfig.json:22`
- `scripts/capture.mjs:6-11,263,347,371-381` (precept it violates; clip-screenshot
  primitive)
- `scripts/lib/demo-driver.mjs:40-59,74-88,106-131,232-268` (manifest gap; reusable
  primitives)
- git `74abd2b` (Playwright screenshots, blobs only — no generator), `f1d4fe6` (easing SVG)
- BUILD measured this lane: `dist/gh-pages/assets/index-pbywWulI.js` (base64 data-URIs);
  `dist/gh-pages/assets/cube-icon-sm-CqZgfax4.png` (duplicated favicon emit)
- pair: `docs/tranches/H/audit/a-scene-icons.md` (registry/idiom/pertinence — not re-argued)
