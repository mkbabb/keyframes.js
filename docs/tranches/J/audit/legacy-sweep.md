# Tranche J — NO-LEGACY Sweep
**Lane:** legacy-sweep | **Date:** 2026-06-10 | **Branch:** master (tranche-i-dev merged as a4b1472)

---

## Method

Read-only sweep of `src/`, `demo/`, `scripts/`, `test/`, `bench/` (excluding `node_modules/`, `dist/`).
Eight categories:

| Cat | Probe |
|-----|-------|
| A | `grep -rn "TODO\|FIXME\|XXX\|HACK\|WORKAROUND\|TEMP"` |
| B | `grep -rn "@ts-ignore\|@ts-expect-error\|eslint-disable\|as any\b"` |
| C | `grep -rni "deprecated\|compat\|legacy\|back-compat"` |
| D | Commented-out code clusters (`^\s*// .*(const\|let\|function\|export)`) |
| E | Dead exports (zero importers — spot-checked) |
| F | `.skip/.only/.todo` in tests |
| G | `scripts/baselines/visual-lock/` PNG freshness |
| H | Orphaned files at repo root |
| I | CLAUDE.md rot — stale structure claims |

---

## A. TODO/FIXME/XXX/HACK/WORKAROUND/TEMP

### Hits

| File:Line | Text | Verdict |
|-----------|------|---------|
| `demo/@/components/custom/animation-controls/stores/controlSurfaceDFA.ts:12` | `// isControlsPanelOpen with reka-tab-fallback HACKS` | **LEGIT** — historical past-tense description of what the DFA replaced; body explains why (lines 12–19). Not a live hack. |
| `demo/app/scenes.ts:132` | `// engine's TEMPORAL orchestrator` | **LEGIT** — descriptor noun, not an action marker. |
| `demo/sequence/useSequenceDemo.ts:18` | `* useSequenceDemo — the dogfood of the engine's TEMPORAL orchestrator` | **LEGIT** — same: descriptor. |
| `test/sharing.test.ts:143` | `const corrupted = hash.slice(0, -5) + "XXXXX"` | **LEGIT** — intentional test value, not a marker. |

**Verdict: no actionable TODO/FIXME/HACK/WORKAROUND hits in the tree.**

---

## B. TypeScript Suppression Density

### `@ts-expect-error` (all are in test/ — justified cross-realm/DOM stubs)

| File | Count | Pattern |
|------|-------|---------|
| `test/platform-adopt.test.ts` | 11 | Install/tear-down DOM stubs (`CSS`, `matchMedia`, native timelines) — every one annotated |
| `test/waapi-lifecycle.test.ts` | 2 | WAAPI jsdom stub install/remove |
| `test/default-easing-css-twin.test.ts` | 2 | Same |
| `test/timeline.test.ts` | 1 | String-name rejection proof |
| `test/stagger.test.ts` | 1 | Same |
| `test/numeric.test.ts` | 1 | Same |
| `test/morph.test.ts` | 1 | Same |

All are annotated with a reason. **LEGIT.**

### `as any` hotspots (non-test)

| File:Line | Reason | Verdict |
|-----------|--------|---------|
| `src/animation/utils.ts:251,258` | Cross-realm `@mkbabb/parse-that` nominal type mismatch; comment at line 247 explains | **LEGIT** — structural impossibility without value.js re-architecture. |
| `demo/easing/useEasingDemo.ts:89` | `steppedEase` `jumpTerm` type narrowing | **LIVE-DEBT** — P2; should use a proper cast or typed param |
| `demo/easing/useEasingDemo.ts:389` | `AnimationGroup(contractAnim as any)` | **LIVE-DEBT** — P2; `contractAnim` is a `Ref<>` and needs `.value` |
| `demo/app/scenes/SquareScene.vue:34` | Same `AnimationGroup(anim as any)` pattern | **LIVE-DEBT** — P2 |
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:198,272` | `null as any` on `selectedAnimation` | **LIVE-DEBT** — P2; use typed union |
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:217` | `emit as any` | **LIVE-DEBT** — P2 |

### `eslint-disable`

`test/d3-changed-keys.measure.test.ts:48` — `eslint-disable-next-line no-console`. Justified (intentional measurement log). **LEGIT.**

---

## C. Deprecated / Compat / Legacy Markers

### Back-compat type alias — `ScenePlaybackState`

**File:** `demo/@/components/custom/animation-controls/stores/sceneMachine.ts:62–64`
```ts
/** Back-compat alias — the old `ScenePlaybackState` name maps onto the new
 *  snapshot shape so existing imports keep resolving through the barrel. */
export type ScenePlaybackState = PlaybackSnapshot;
```
**Check:** `grep -rn "ScenePlaybackState"` — used only in `stores/sceneMachine.ts` (definition) and `stores/index.ts:42` (re-export). Zero imports from outside `stores/`. The alias is dead-on-arrival.
**Verdict: LIVE-DEBT (P2)** — delete the alias + the `stores/index.ts:42` re-export in J.

### Dead barrel comment — `stores/index.ts:1–3`

```ts
// Barrel re-export — preserves all existing import paths.
// import { X } from "./animationStores" and
// import { X } from "./animationStores/index" both resolve here.
```
No consumer imports from `./animationStores` — the old directory never existed at that path. The comment is a stale migration note.
**Verdict: LIVE-DEBT (P2)** — delete lines 1–3 in J.

### `LEGACY_PATH_D` exported constant

**File:** `demo/motion-path/motionPathGeometry.ts:76`
```ts
export const LEGACY_PATH_D = "M 60 200 C 60 80, ...";
```
**Check:** `grep -rn "LEGACY_PATH_D"` — referenced ONLY inside `motionPathGeometry.ts` itself (JSDoc cross-links at lines 21, 52, 106). Zero importers in `demo/`, `test/`, or `src/`.
The export is justified as a geometry witness (line 71–74: "Kept ONLY as the geometry witness: … Not consumed by the scene"), but **it is exported and unreferenced** — a public dead export in a non-library file.
**Verdict: LIVE-DEBT (P2)** — change `export const LEGACY_PATH_D` to `const LEGACY_PATH_D` (unexport); keep the JSDoc geometry witness.

### `inertiaDecay.ts` — "legacy" commentary

`demo/@/components/custom/orbital-drag/composables/inertiaDecay.ts:3,14,19,20` uses "legacy" to describe the OLD per-frame form whose closed-form replacement is the current implementation. This is architectural archaeology, not dead code.
**Verdict: LEGIT.**

---

## D. Commented-Out Code

`grep -rn "^\s*// .*(const|let|function|export|return\b)"` across `src/` and `demo/` yields **0 actual commented-out code declarations**. All hits are prose comments that happen to contain those keywords in explanatory text (e.g., `// constructor comment once only promised it`). No clustered commented code blocks found.

**Verdict: clean.**

---

## E. Dead Exports

### Spot-checked candidates

| Export | File | Importers found | Verdict |
|--------|------|-----------------|---------|
| `LEGACY_PATH_D` | `demo/motion-path/motionPathGeometry.ts:76` | 0 (only self-JSDoc) | **LIVE-DEBT (P2)** — unexport |
| `ScenePlaybackState` | `stores/sceneMachine.ts:64` | 0 outside stores/ | **LIVE-DEBT (P2)** — delete |
| `WAAPIEligibility` (type) | `src/animation/waapi.ts:71` | Used by `engine.ts` internally | LEGIT |

---

## F. Test Skip / Only / Todo

`grep -rn "\.skip\|\.only\|test\.todo\|it\.skip\|it\.only\|describe\.skip\|describe\.only"` across `test/` and `bench/` — **zero hits**.

**Verdict: clean.**

---

## G. Visual-Lock Baselines

`ls scripts/baselines/visual-lock/*.png | wc -l` → **49** PNGs (matching the gate spec).

Most recent capture commit: `b17c65a fix(tranche-I WZ): bezier-panel font-overflow + re-capture the visual-lock golden baseline` — on `master`. No orphans in the `_diff/` subfolder relative to the 49 reference set.

**Verdict: current and clean.**

---

## H. Orphaned Files

### `b2-gen-crash-easing-visibility.png` — untracked at repo root

`git status` shows `?? b2-gen-crash-easing-visibility.png`. The file is a diagnostic screenshot generated during tranche-I B2 investigation (referenced in `docs/tranches/I/audit/investigate/b2-dfa-gen-crash.md:73` as intended path `docs/tranches/I/audit/investigate/shots/b2-gen-crash-easing-visibility.png`). The shots copy does NOT exist — the file was generated in the repo root by mistake and never moved or committed.

`.gitignore` has no `*.png` rule, so it persists as untracked noise.
**Verdict: DEAD (P2)** — delete in J (or add to `.gitignore` for root-level PNGs).

---

## I. CLAUDE.md Docs Rot

### I.1 Root `CLAUDE.md` — Entire `src/parsing/` and `src/units/` subtree

**Claim (CLAUDE.md:30–46):**
```
src/
├── parsing/             # CSS @keyframes parsing (see parsing/CLAUDE.md)
│   ├── keyframes.ts
│   ├── format.ts
│   ├── units.ts
│   ├── utils.ts
│   └── index.ts
├── units/               # Value types & normalization (see units/CLAUDE.md)
│   ├── index.ts
│   ├── constants.ts
│   ├── utils.ts
│   ├── normalize.ts
│   └── color/
│       ├── ...
```
**Reality:** `ls src/` → only `animation/` and `env.d.ts` exist. `src/parsing/` and `src/units/` do not exist. These modules were consolidated into `src/animation/` in a prior tranche (format.ts, utils.ts are at `src/animation/`). The referenced `parsing/CLAUDE.md` and `units/CLAUDE.md` also do not exist.
**Verdict: DEAD (P1)** — the root CLAUDE.md project tree is substantially wrong. J must rewrite it.

### I.2 Root `CLAUDE.md` — `src/easing.ts`, `src/math.ts`, `src/utils.ts`

**Claim (lines 47–49):**
```
├── easing.ts  # Re-export barrel: easing fns from value.js
├── math.ts    # Re-export barrel: clamp, lerp, bezier from value.js
└── utils.ts   # Re-export barrel + local memoizeDecorator
```
**Reality:** None of these three files exist in `src/`. `ls src/` → `animation/`, `env.d.ts` only.
**Verdict: DEAD (P1)** — remove these lines in J.

### I.3 Root `CLAUDE.md` — Architecture Notes cite `src/parsing/keyframes.ts`

**Claim (line 101):** `src/parsing/keyframes.ts + format.ts — @keyframes grammar + serialization`
**Reality:** `format.ts` is at `src/animation/format.ts`. `@keyframes` grammar is now inside `@mkbabb/value.js`. No separate `keyframes.ts` exists anywhere in `src/`.
**Verdict: DEAD (P1)** — update in J.

### I.4 Root `CLAUDE.md` — `@mkbabb/parse-that` role description

**Claim (line 97):** `@mkbabb/parse-that | Parser combinators for @keyframes grammar`
**Reality:** parse-that is only used in `src/animation/utils.ts:1,251,258` for a cross-realm nominal type workaround when parsing CSS function values — NOT for `@keyframes` grammar (which lives in value.js). The grammar role is wrong.
**Verdict: DEAD (P2)** — update description in J.

### I.5 Root `CLAUDE.md` — Primary exports list

**Claim (line 90):** `Animation, CSSKeyframesAnimation, AnimationGroup, NumericAnimation, SmoothProgress, ElementMorph, Timeline, ScrollTimeline, ManualTimeline, getAnimationId`
**Reality (`src/animation/index.ts`):** Also exports `SpringProgress`, `springLinearStops`, `springTimingFunction`, `RAFPlayback`, `stagger`, `flip`, `flipShared`, `drag`, `Draggable`, `decay`, `decayRest`, `Sequence`, `resolveEasing`, `toEasing`, `AnimationOptionError`, `UnknownEasingError`, `createNativeTimeline` + all type exports. The list is severely incomplete — 17+ exports missing.
**Verdict: LIVE-DEBT (P1)** — update in J.

### I.6 Root `CLAUDE.md` — Demo directory tree

**Claims (lines 52–61):**
```
demo/
├── cube/
├── simple/      ← DOES NOT EXIST
├── square/
├── amiga/
├── playground/
├── balls/       ← DOES NOT EXIST
├── boxes/       ← DOES NOT EXIST
└── bench/       ← DOES NOT EXIST
```
**Reality:** `ls demo/` → `@`, `CLAUDE.md`, `DESIGN.md`, `amiga`, `app`, `cube`, `easing`, `motion-path`, `playground`, `sequence`, `spring`, `square`
Missing from CLAUDE.md: `app/`, `easing/`, `motion-path/`, `sequence/`, `spring/`. Phantom entries: `simple/`, `balls/`, `boxes/`, `bench/`.
**Verdict: DEAD (P1)** — the demo tree section needs full rewrite.

### I.7 Root `CLAUDE.md` — Build comment

**Claim (line 9):** `npm run gh-pages  # demo (cube) → dist/`
**Reality:** `vite.config.ts:338,357` — gh-pages mode builds `demo/app/` (the multi-scene SPA) to `dist/gh-pages/`, not `cube` to `dist/`. Also: `npm run dev` likely runs on port 5173 (Vite default; no explicit `port:` key found in `vite.config.ts`), not `:8080` as the comment implies.
**Verdict: DEAD (P2)** — update build comments.

### I.8 Root `CLAUDE.md` — Test file list

**Claims (lines 63–78):** 15 named test files including `parsing.test.ts` and `units.test.ts`.
**Reality:** `ls test/*.test.ts | wc -l` → **69** test files. `parsing.test.ts` and `units.test.ts` do NOT exist. `editor-parsing.test.ts` does NOT exist. Many new test files added across tranches are not listed.
**Verdict: DEAD (P1)** — rewrite the test section.

### I.9 Root `CLAUDE.md` — Bench file list

**Claim (lines 80–83):** "3 files: interpolation.bench.ts, parser.bench.ts, playwright.bench.ts"
**Reality:** `ls bench/*.bench.ts | wc -l` → **8** files (adds: `compile.bench.ts`, `computed-real-dom.bench.ts`, `interp-buffer.bench.ts`, `spring-tick.bench.ts`, `sync-step.bench.ts`).
**Verdict: DEAD (P2)** — update bench count and list.

### I.10 `src/animation/CLAUDE.md` — Missing 9 source files

The file tree in `animation/CLAUDE.md` does NOT list: `stagger.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `sequence.ts`, `draw-svg.ts`, `motion-path.ts`, `animate.ts`, `frame-compiler.ts`. All 9 exist in `src/animation/` and are exported from `index.ts`.
**Verdict: LIVE-DEBT (P1)** — add all 9 to the file tree section.

### I.11 `demo/CLAUDE.md` — `@/composables/` entire section is wrong

**Claim (lines 26–29, 109–115):** `@/composables/` contains `useKeyboardShortcuts.ts`, `useShareState.ts`, `useTransformState.ts`, `transformMath.ts`, `useExclusiveSelect.ts`.
**Reality:** `ls demo/@/composables/` → `gestureSelectSuppression.ts`, `useDragScrub.ts` only.
- `useKeyboardShortcuts.ts` — DELETED; keyboard shortcuts now via `@mkbabb/glass-ui/keyboard` (`registerShortcut`)
- `useShareState.ts` — moved to `demo/@/components/custom/editor-shell/useShareState.ts`
- `useTransformState.ts`, `transformMath.ts` — moved to `demo/@/components/custom/matrix-editor/`
- `useExclusiveSelect.ts` — not found anywhere in the tree; no references
**Verdict: DEAD (P1)** — rewrite `@/composables/` section.

### I.12 `demo/CLAUDE.md` — `animationStores/` directory name

**Claim (line 54):** `animationStores/` — Directory module
**Reality:** The directory is `stores/`. The old `animationStores/` alias is referenced only in the stale comment at `stores/index.ts:1–3` (no active imports).
**Verdict: DEAD (P2)** — rename in CLAUDE.md + clean index.ts comment.

### I.13 `demo/CLAUDE.md` — Missing store files + phantom `scenePlayback.ts`

**Claim:** stores contains `scenePlayback.ts` (among others)
**Reality:** `ls stores/` → `animationOptionsStore.ts`, `controlOptionsStore.ts`, `controlSurfaceDFA.ts`, `hashSharing.ts`, `index.ts`, `sceneMachine.ts`, `scenePlaybackAdapters.ts`, `storeUtils.ts`, `useSceneMachine.ts`
`scenePlayback.ts` was split into `sceneMachine.ts` + `scenePlaybackAdapters.ts`. New files `controlSurfaceDFA.ts` and `useSceneMachine.ts` not mentioned.
**Verdict: DEAD (P2)** — update stores section.

### I.14 `demo/CLAUDE.md` — `controls/` has phantom `CubicBezierControls.vue` and `ColorInterpolationPanel.vue`

**Claim:** `controls/CubicBezierControls.vue` and `controls/ColorInterpolationPanel.vue`
**Reality:** Neither file exists. `CubicBezierControls` functionality is in the shared `demo/@/components/custom/EasingEditor.vue`. `ColorInterpolationPanel` is gone (absorbed).
**Verdict: DEAD (P2)** — remove these two from controls listing.

### I.15 `demo/CLAUDE.md` — `@/components/ui/` (shadcn-vue, "50+")

**Claim (line 25):** `ui/ — shadcn-vue components (50+)`
**Reality:** `ls demo/@/components/ui/` → single directory: `menubar/` (16 files). The ~50 shadcn-vue components were migrated to/replaced by `@mkbabb/glass-ui`.
**Verdict: DEAD (P1)** — update the description; the 50+ claim is 3× wrong.

### I.16 `demo/CLAUDE.md` — Key Dependencies missing `@mkbabb/glass-ui`

**Claim (lines 131–138):** Key Dependencies lists: `vue 3.5`, `@vueuse/core`, `reka-ui`, `three`, `gl-matrix`, `monaco-editor`, `html2canvas`, `@mkbabb/value.js`. No `@mkbabb/glass-ui`.
**Reality:** `package.json:173` → `"@mkbabb/glass-ui": "~3.9.0"` — a pinned first-class dependency used throughout the demo for dock, glass surfaces, keyboard shortcuts registry, and utility classes.
**Verdict: DEAD (P1)** — add glass-ui to Key Dependencies.

### I.17 `demo/CLAUDE.md` — Missing `IconTooltip.vue`, `LabeledInput.vue`, `LabeledSelect.vue`

**Claim (lines 19–23):** lists `IconTooltip.vue`, `LabeledInput.vue`, `LabeledSelect.vue` under `@/components/custom/`
**Reality:** None of these three files exist at that path (checked with `ls`).
**Verdict: DEAD (P2)** — remove from CLAUDE.md listing.

### I.18 `demo/CLAUDE.md` — `styles/utils.css` phantom entry

**Claim (line 32):** `utils.css — Fonts (Fraunces, Fira Code), rainbow effects, 3D`
**Reality:** `ls demo/@/styles/` → `brand.css`, `design-idioms.css`, `style.css`. No `utils.css`. The style content (confirmed by `grep`) is in `style.css` and `brand.css`.
**Verdict: DEAD (P2)** — remove from listing; note `style.css` absorbed the content.

### I.19 `demo/CLAUDE.md` — `useAnimationSync.ts` location

**Claim:** lists `useAnimationSync.ts` under `controls/`
**Reality:** `ls demo/@/components/custom/animation-controls/controls/composables/` → includes `useAnimationSync.ts`. Correct location, but the CLAUDE.md puts it as a top-level controls/ file rather than under `controls/composables/`.
**Verdict: P2** — minor structural inaccuracy.

---

## Summary Table

| ID | Severity | Category | File | Disposition |
|----|----------|----------|------|-------------|
| LS-1 | P1 | I | `CLAUDE.md:30–49` | `src/parsing/` + `src/units/` + `src/easing.ts` + `src/math.ts` + `src/utils.ts` tree — all phantom | FOLD (J W0) |
| LS-2 | P1 | I | `CLAUDE.md:90` | Primary exports list missing 17+ symbols | FOLD (J W0) |
| LS-3 | P1 | I | `CLAUDE.md:52–61` | Demo tree: 4 phantom dirs, 6 missing dirs | FOLD (J W0) |
| LS-4 | P1 | I | `CLAUDE.md:63–78` | Test file list: 2 phantom files, 54 missing, wrong count (15 vs 69) | FOLD (J W0) |
| LS-5 | P1 | I | `src/animation/CLAUDE.md` (file tree) | 9 module files not listed | FOLD (J W0) |
| LS-6 | P1 | I | `demo/CLAUDE.md:26–29,109–115` | `@/composables/` entirely wrong | FOLD (J W0) |
| LS-7 | P1 | I | `demo/CLAUDE.md:25` | UI components claim "50+" — only menubar remains | FOLD (J W0) |
| LS-8 | P1 | I | `demo/CLAUDE.md:131–138` | `@mkbabb/glass-ui` absent from Key Dependencies | FOLD (J W0) |
| LS-9 | P2 | C | `stores/sceneMachine.ts:62–64` + `stores/index.ts:42` | Dead back-compat `ScenePlaybackState` alias, zero consumers | FOLD (J W1) |
| LS-10 | P2 | C | `stores/index.ts:1–3` | Dead comment about `./animationStores` paths, zero consumers | FOLD (J W1) |
| LS-11 | P2 | E | `demo/motion-path/motionPathGeometry.ts:76` | `LEGACY_PATH_D` exported but zero importers | FOLD (J W1) |
| LS-12 | P2 | H | `b2-gen-crash-easing-visibility.png` (repo root) | Orphaned diagnostic screenshot, untracked | FOLD (J W0) |
| LS-13 | P2 | I | `CLAUDE.md:9,97,101` | Build comment wrong (gh-pages → app not cube, dist/gh-pages/ not dist/); parse-that role wrong | FOLD (J W0) |
| LS-14 | P2 | I | `CLAUDE.md:80–83` | Bench count wrong (3 vs 8) | FOLD (J W0) |
| LS-15 | P2 | I | `demo/CLAUDE.md:54` | `animationStores/` phantom dir name | FOLD (J W0) |
| LS-16 | P2 | I | `demo/CLAUDE.md` stores section | `scenePlayback.ts` phantom; missing `controlSurfaceDFA.ts`, `useSceneMachine.ts` | FOLD (J W0) |
| LS-17 | P2 | I | `demo/CLAUDE.md` controls section | `CubicBezierControls.vue` + `ColorInterpolationPanel.vue` phantom | FOLD (J W0) |
| LS-18 | P2 | I | `demo/CLAUDE.md:19–23` | `IconTooltip.vue`, `LabeledInput.vue`, `LabeledSelect.vue` phantom | FOLD (J W0) |
| LS-19 | P2 | I | `demo/CLAUDE.md:32` | `utils.css` phantom | FOLD (J W0) |
| LS-20 | P2 | B | `demo/easing/useEasingDemo.ts:89,389` + 4 AnimationControlsGroup.vue lines | `as any` casts with typed alternatives available | FOLD (J W2) |

---

## Not Actionable / LEGIT

| Item | Reason |
|------|--------|
| All `@ts-expect-error` in test/ | Every one annotated with rationale; DOM/cross-realm structural necessity |
| `as any` in `src/animation/utils.ts:251,258` | Cross-realm parse-that nominal type mismatch; documented at length |
| `eslint-disable-next-line no-console` in d3-changed-keys.measure.test.ts | Intentional measurement log |
| "HACKS" word in `controlSurfaceDFA.ts:12` | Past-tense historical description of what the DFA replaced |
| `LEGACY_PATH_D` JSDoc presence | The const itself stays (geometry witness); just needs un-exporting |
| `inertiaDecay.ts` "legacy" commentary | Correctly documents the old form vs the analytic replacement |
| `design-idioms.css` "DELETED" comment blocks | Archaeology notes, not dead code; code is already gone |
| 49 visual-lock PNGs | Count matches spec; freshest capture is `b17c65a` (I WZ) on master |
| No `.skip/.only/.todo` | Zero test skips confirmed |
| No commented-out code blocks | Probe returned zero declaration-level commented lines |

---

## Fold Candidates for J

J W0 (docs pass — no code change): LS-1 through LS-4, LS-12 through LS-19 (rewrite all three CLAUDE.md files + delete orphaned PNG + add .gitignore `/*.png` guard).

J W1 (light code cleanup): LS-9 (delete `ScenePlaybackState` alias + barrel re-export), LS-10 (delete stale comment), LS-11 (unexport `LEGACY_PATH_D`).

J W2 (type hygiene): LS-20 (`as any` casts in demo with typed alternatives).
