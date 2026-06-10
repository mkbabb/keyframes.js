# Tranche J Audit — Lane: perf-frontier

**Lane:** perf-frontier  
**Date:** 2026-06-09  
**Branch:** master @ 4072af9 (clean except untracked `docs/tranches/J/`)  
**Method:** read-only — source + scripts + existing perf evidence; every claim carries file:line or command + output.

---

## 1. Bundle inventory (dist/ — library build only; gh-pages not built)

The `dist/gh-pages/` directory does NOT exist on the current working tree. The last manual deploy was executed from a separate build invocation (`4072af9` commit, `docs(tranche-I WZ): deploy EXECUTED`). The library-only `dist/` is present and represents the `npm run build` output:

| File | Size (uncompressed) |
|---|---|
| `dist/keyframes.js` (ESM entry) | 16 KB |
| `dist/engine-Dcgwzp_B.js` | 36 KB |
| `dist/animations-Bh4iSiMM.js` | 12 KB |
| `dist/timeline-DGmUwYQF.js` | 8.6 KB |
| `dist/springTimingFunction-Dqeea4sG.js` | 6.0 KB |
| `dist/draw-svg-gICVS7eq.js` | 1.5 KB |
| `dist/motion-path-Cf2Vi7p0.js` | 1.0 KB |
| `dist/animate-CbYJT2p8.js` | 960 B |

`ls -la /Users/mkbabb/Programming/keyframes.js/dist/` — all confirmed present as of Jun 9 23:50.

The library entry itself is compact (16 KB ESM). The static/dynamic boundary (`loadAnimationEngine()`) is correctly implemented per `src/animation/index.ts:197-220` — the HEAVY surface (`engine.ts` + value.js) is behind a dynamic import and not in the initial library chunk.

### Demo bundle (gh-pages — from the b16 measured build)

The b16 investigation (`docs/tranches/I/audit/investigate/b16-perf-profile.md`) profiled the LAST gh-pages build. Observed transfer for that build (54 requests, 16,354 KB total):

| Chunk | Transfer KB |
|---|---|
| `vendor-monaco*.js` | **8,171** |
| `css.worker*.js` | 2,060 |
| `vendor-highlight*.js` | 1,809 |
| `editor.worker*.js` | 820 |
| `vendor-reka-ui*.js` | 677 |
| `index*.css` | 599 |
| `vendor-three*.js` | **522** |
| `index*.js` (app entry) | 489 |
| `engine*.js` | 313 |

Source: `probes/b16-perf-profile.result.json:serverTransfer` — measured against the built dist served on localhost.

**Key observations:**

1. Monaco contributes **8.2 MB raw** (core + language workers). Already deferred off the critical path via `defineAsyncComponent` (`demo/app/scenes/*.vue` lazy scene imports, `vite.config.ts:394-432`). `vite.config.ts` excludes `vendor-monaco` from `modulePreload` (`vite.config.ts:375-379`). The `deferLazyCSSPlugin` also applies to `vendor-monaco` (`vite.config.ts:437`). But the b16 profiler recorded Monaco as the HEAVIEST single resource at first load — the `proof:monaco-deferred` bundle-graph probe in `scripts/proof-modern-web.mjs` asserts ZERO static edge to `vendor-monaco` from the app entry, which was TRUE at the time of the b16 build but cannot be re-verified without a fresh `npm run gh-pages` build.

2. Three.js lands at 522 KB. The import pattern is `import * as THREE from "three"` (`demo/app/scenes/AmigaScene.vue:18`, `demo/amiga/utils.ts:1`, `demo/amiga/useAmigaAnimations.ts:1`, `demo/amiga/useSphereSpin.ts:1`) — a namespace import that prevents rolldown tree-shaking of Three.js. The minified Three.js module is 356 KB (`node_modules/three/build/three.module.min.js` — `ls -lah` confirmed). The `vendor-three` chunk in the demo exceeds this because OrbitControls is included. Three.js is in the `vendor-three` `advancedChunks` group (`vite.config.ts:419-422`) and NOT in the `modulePreload` exclusion list (only `vendor-monaco, vendor-three, vendor-prettier, vendor-highlight, html2canvas` are excluded from modulePreload per `vite.config.ts:340`). Wait — `vendor-three` IS in the `lazyChunks` list at `vite.config.ts:340`, so it is excluded from eager `modulePreload`.

3. The CSS payload (599 KB for `index*.css`) is notable. The source CSS files total ~57 KB raw (`demo/@/styles/style.css` 16.7 KB + `design-idioms.css` 37.9 KB + `brand.css` 2.3 KB). The large built CSS arises from Tailwind v4 + glass-ui cascade inclusion. No `@layer` ordering measured separately.

---

## 2. Perf instruments — current scope and recorded budgets

### `proof-perf-frame-budget.mjs` (`scripts/`, 25 KB)

**Clauses:**
- **(c) dock-expand under 4× CPU throttle:** drops ≤ 2 frames. Born-RED witness: 12/114 dropped (b16 §3). Gate: `scripts/proof-perf-frame-budget.mjs:79`.
- **(d) easing-play at 1× (real experience):** drops ≤ 3 frames. Born-RED witness: 36/70 dropped UNTHROTTLED (b16 §1 — the Vue reactive storm). Gate: `scripts/proof-perf-frame-budget.mjs:80`.
- **(e) HYGIENE non-load-bearing:** backdrop-filter surface count on `/cube` (~30 at b16). FLAG for on-device re-measure (headless masks GPU compositing cost). Does NOT gate.

**Known soft spots (explicitly documented):**
- The dock `transition: width` under `backdrop-filter` is glass-ui-owned (`dock.css`). The clause (c) budget depends on glass-ui `~3.9.0`'s dock retune holding. If the retune consumed still animates an intrinsic-size property under backdrop-filter, the clause RECORDS a GLASS-UI HANDOFF flag rather than adding a kf-side CSS override (`proof-perf-frame-budget.mjs:295-304`).
- The easing scene's glass-card backdrop-filter re-composite under 4× HEADLESS throttle inflates drop count (~11-16) but headless MASKS real GPU compositing. The clause oracle is 1× (real experience) — NOT 4× headless — as this is the `proof-perf-frame-budget.mjs:69-80` design rationale.

### `proof-scene-transition-perf.mjs` (`scripts/`, 16 KB)

**Budget:** 120 ms p95 for cross-scene navigate + control-surface re-render. Measured W11 baseline: p50 ≈ 36 ms, p95 ≈ 46 ms (`proof-scene-transition-perf.mjs:63-64`). Budget is ~2.6× over the measured p95.

**Known soft spot:** the underlying `scene-control-dfa` timing defect from the I close post-merge tail. `proof-scene-control-dfa.mjs:211` has a fixed `settleMs = 1600` with no `IN_CI` awareness (the CI-aware fix at `66855c2` was REVERTED at `feb39c3`). The root defect is a real runtime lag (`cube→spring` leaves control trigger null/stale until FSM settles).

### `proof-scene-perf-budget.mjs` (`scripts/`, 34 KB)

Five clauses — all source-anchored + browser-confirmed:
1. Amiga tile-count ≤ 256 fillRect (was ~524k — A3 fix).
2. Amiga DPR cap ≤ 2 (was `dpr * 2` — A2 fix, `demo/app/scenes/AmigaScene.vue:128`).
3. `.scene-host` has `contain: paint` (G1 — `demo/app/App.vue:319`).
4. Amiga `.scene-root` SHEDS `content-visibility` (I.W3 B3 RC-2 fix — IntersectionObserver present-loop pause instead).
5. Cube will-change is transient not resident (G5 — `demo/cube/CubeTarget.vue`).

### `lighthouse-gate.mjs` (`scripts/`, 13 KB)

Runs Lighthouse `accessibility` + `seo` per scene × viewport (mobile 375×667, desktop 1440×900). Hard floor: SEO ≥ 90. A11y: hardened on all audits except two held buckets (`button-name`, `label`, `aria-input-field-name` — glass-ui ASK-3; both `color-contrast` and `image-alt` were removed from the bucket at C.W2 close per `lighthouse-gate.mjs:76-83`). Does NOT measure performance scores.

### `proof-lighthouse-mobile.mjs` (`scripts/`, 13 KB)

Per-scene MOBILE Performance ceilings (B-baseline floors — "no regression" claim, not a win claim):

| scene | mobile Perf floor |
|---|---|
| home | 63 |
| cube | 64 |
| amiga | 49 |
| square | 62 |
| easing | 61 |
| spring | 52 |

Source: `proof-lighthouse-mobile.mjs:75-82`. In CI: `KF_REQUIRE_LH=1` hard-asserts; locally/untrusted: RECORDS-WITHHELD (the Lighthouse CPU throttle is unreliable in shared sandboxes). The spring-mobile LCP bound is < 15 s (was 28.5 s — pathological Monaco eager load pre-E.W4).

### `bench/` directory — micro-benchmarks

| Bench | What it measures |
|---|---|
| `interpolation.bench.ts` | `interpFrames` per 60 frames: 2-stop, multi-prop, 11-stop |
| `interp-buffer.bench.ts` | Threaded out-buffer shape at K=2/5/12 (600-frame steady window) |
| `parser.bench.ts` | `parseCSSKeyframes` cold + warm; cache-buster (editor-keystroke); layer isolation (bare `parseCSSValue` vs full pipeline) |
| `playwright.bench.ts` | LoAF >50ms-trace gate: 200-cell `AnimationGroup` composite; asserts no >50ms BLOCKING task (the `scheduler.yield` batching gate) |
| `sync-step.bench.ts` | Present but not catalogued above — spring tick throughput |
| `spring-tick.bench.ts` | Spring tick throughput |
| `compile.bench.ts` | FrameCompiler throughput |
| `computed-real-dom.bench.ts` | Computed-unit DOM resolution (cqw/vh) |

**`AnimationGroup.YIELD_BATCH = 32`** (`src/animation/group.ts:76`): groups > 32 children tick in batches with `scheduler.yield()` between them (INP relief). The LoAF bench drives 200 cells to exercise the batched path.

---

## 3. Live Lighthouse baseline attempt

**SKIPPED.** `dist/gh-pages/` does not exist on this tree (it must be built with `npm run gh-pages`, which is a build operation this read-only audit cannot execute). The b16 profile (`docs/tranches/I/audit/investigate/b16-perf-profile.md`) from the most recent built dist is the authoritative baseline. Key numbers reproduced in §1 above.

---

## 4. Modern-web alignment status

`scripts/proof-modern-web.mjs` carries an audited checklist (`proof-modern-web.mjs:401-533`). Verified against the tree:

| Code | Axis | Status (tree-verified) |
|---|---|---|
| C1 | INP / `scheduler.yield` | ALIGNED — `yieldToMain` in `useKeyframeOps.ts`; `AnimationGroup.YIELD_BATCH=32` (`group.ts:76`) |
| C2/C4 | LCP — font preload + metric-matched fallback | ALIGNED — `<link rel="preload" as="font" ... crossorigin>` in `demo/app/index.html:46-51`; `@font-face "Instrument Serif Fallback"` at `style.css:87-94` |
| C3 | `content-visibility` off-screen scenes | N-A-with-reason (ONE scene mounted at a time via keyed `<Suspense>`; the single live scene is above-fold; cv:auto over above-fold is forbidden by the guide; cv:hidden IS used on the inactive Monaco pane correctly) |
| C5 | SPA route-chunk warmup | ALIGNED — `lazyScene()` + `warmScene` pointer-enter warmup in `demo/app/scenes.ts:54-73` |
| UX1 | View Transitions for scene-swap | ALIGNED — `useSceneTransition.ts:2` imports `startViewTransition` from glass-ui; `App.vue:311` `view-transition-name: scene-subject` |
| C5b/Speculation | Speculation Rules | N-A-with-reason (SPA-EXCLUDED; guide explicitly forbids speculation rules on SPAs) |
| CSS2 | Container queries | ALIGNED — `container-type: inline-size` in `style.css` |

**Gap identified:** `content-visibility:hidden` on the inactive Monaco pane is declared as ALIGNED in the checklist (`proof-modern-web.mjs:419-428`), but that claim is qualified: the cv:hidden usage is for the EDITOR PANE (caching the already-mounted Monaco), NOT for inactive scenes (which are fully unmounted via keyed `<Suspense>`). This is the correct, intentional distinction. No gap.

**Fetch priority / `fetchpriority`:** Not in the checklist. The Instrument Serif preload lacks an explicit `fetchpriority="high"` attribute (`demo/app/index.html:46-51`). Browser default for a font preload is high-priority anyway (`as="font"` implies high fetch priority in modern browsers), but an explicit `fetchpriority="high"` would make the intent explicit and future-proof. Minor.

---

## 5. Ranked perf transposition candidates

### PF-1 — Three.js namespace import prevents tree-shaking (P1, MEASURE-FIRST)

**Evidence:** `demo/app/scenes/AmigaScene.vue:18` `import * as THREE from "three"` + `demo/amiga/utils.ts:1`, `demo/amiga/useAmigaAnimations.ts:1`, `demo/amiga/useSphereSpin.ts:1` — all four Three.js consumers use the namespace import. Three.js docs explicitly recommend named imports for tree-shaking: `import { WebGLRenderer, Scene, ... } from 'three'`. The b16 build shows `vendor-three*.js` at 522 KB; the minified named-import build is 356 KB (`node_modules/three/build/three.module.min.js`). The actuaL used surface is small: `THREE.WebGLRenderer`, `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.HemisphereLight`, `THREE.SpotLight`, `THREE.BoxGeometry`, `THREE.MeshLambertMaterial`, `THREE.Mesh`, `THREE.Color`, `THREE.BackSide` + `OrbitControls` from `three/examples/jsm/` — roughly 15 classes from a 640 KB source tree.

**Expected win:** ~100-200 KB reduction in `vendor-three` chunk (estimate from full-bundle 640 KB → named-only subset; exact delta requires a build probe). This directly improves amiga-scene cold-load, which already has the lowest mobile Perf floor (49) and showed a 299 ms Three.js mount spike on first load (b16 §2).

**Gate:** `npm run gh-pages` → compare `vendor-three` chunk size before/after; Lighthouse mobile on amiga scene.  
**Risk:** LOW — named imports are a pure refactor; the OrbitControls import from `three/examples/jsm/` is already a named subpath and is unaffected. Rolldown 0.19 with `advancedChunks` handles the refactor cleanly.

---

### PF-2 — Dock `transition: width` under `backdrop-filter` (GLASS-UI HANDOFF, P1 record)

**Evidence:** `scripts/proof-perf-frame-budget.mjs:295-304` — glass-ui-owned. `proof:perf-frame-budget` clause (c) is the born-RED gate (12/114 dropped, p95 25 ms, max 49 ms at b16 §3). The I.W6 glass-ui `~3.9.0` consume is the stated fix path. The gate currently records a HANDOFF flag if dropped > 2 after the 3.9.0 retune.

**Status to verify:** the dock budget clause (c) status CANNOT be confirmed without running `proof:perf-frame-budget` against the built dist. If clause (c) is still failing, the kf-side path is ZERO (no dock.css override; the fix is glass-ui-side). This is a monitoring item, not a kf J candidate.

**Expected win (if glass-ui retune holds):** 0 kf work, dock expand drops from 12 to ≤ 2.  
**Gate:** `node scripts/proof-perf-frame-budget.mjs` against built dist.  
**Risk:** zero kf risk (no kf change needed); glass-ui version dependency.

---

### PF-3 — Monaco eager pull on non-editor scenes (P1, VERIFY-ONLY)

**Evidence:** b16 §1 — `vendor-monaco*.js` = 8.2 MB, `css.worker` = 2.1 MB, `editor.worker` = 820 KB. Total Monaco footprint: ~11 MB in the b16 build. The `proof:monaco-deferred` clause in `scripts/proof-modern-web.mjs:133-185` asserts ZERO static edge from the app entry to `vendor-monaco`. This was TRUE at b16 build time. The `lazyChunks` exclusion and `deferLazyCSSPlugin` are in place (`vite.config.ts:340,437`).

**BUT:** without a fresh `npm run gh-pages` + bundle-graph probe, the current static-edge status CANNOT be confirmed. The `vite.config.ts` `advancedChunks.groups` was changed in tranche I (the `preload-helper` group was added to prevent rolldown from parking the `__vitePreload` helper inside `vendor-monaco`). A regression where `vendor-monaco` becomes statically reachable again from the entry would not be visible without a bundle probe.

**Expected win (if regressed):** eliminating the static edge removes Monaco from the critical path entirely; the mobile spring LCP regression (28.5 s → < 15 s, `proof-lighthouse-mobile.mjs:84-98`) was the documented win.  
**Gate:** `KF_ANALYZE=1 npm run gh-pages` → `dist/gh-pages/_chunks.json` → verify `vendor-monaco` has no eager import edge from entry; `proof:monaco-deferred` (source half always passes; bundle half needs the build).  
**Risk:** LOW if the fix holds; the `advancedChunks` `preload-helper` group exists specifically to prevent the regression.

---

### PF-4 — CSS payload (599 KB built CSS) — `content-visibility:hidden` for inactive Monaco pane (P2, MEASURE-FIRST)

**Evidence:** `index*.css` = 599 KB in the b16 build. The raw source CSS is ~57 KB (`style.css` 16.7 KB + `design-idioms.css` 37.9 KB + `brand.css` 2.3 KB). The bloat (×10) comes from Tailwind v4 utility expansion + glass-ui cascade inclusion. This is a Tailwind/postcss pipeline artifact — no single demo CSS file is the cause.

The checklist already records that `content-visibility:hidden` is correctly used for the Monaco pane (`proof-modern-web.mjs:422-428`). If the Monaco pane is cv:hidden when inactive, its CSS rendering cost is deferred.

**No clear kf-side win exists** for the CSS weight without a Tailwind audit (measuring which utility classes are actually emitted vs dead-code). The CSS is fully tree-shaken by Tailwind's JIT; the 599 KB is the USED utility surface + glass-ui. A dedicated CSS-weight audit (build with `--report` + PurgeCSS comparison) is needed before any claim.

**Gate required first:** `npm run gh-pages` → measure `index*.css` size; compare with/without specific glass-ui imports.  
**Risk:** low (CSS changes are style-isolating), but no win is measurable without the probe.

---

### PF-5 — backdrop-filter surface count (30 live layers, on-device GPU re-measure needed) (P2, HYGIENE)

**Evidence:** `proof-perf-frame-budget.mjs:419-444` clause (e) — HYGIENE non-load-bearing. At b16, 30 live backdrop-filter layers on `/cube`. Headless masks GPU compositing cost (headless Chromium has no real GPU; the b16 probe measured `0.7 ms` for a 30× forced-repaint which is meaningless under software rendering). On real hardware with a Retina display, 30 stacked `backdrop-filter: blur(X)px` layers can consume significant fill-rate budget.

**This is a HYGIENE FLAG, not a gate.** The clause explicitly does NOT gate. An on-device trace with the DevTools Performance panel (Timeline → GPU track) on a real macOS Retina display would reveal the actual compositing cost. If it exceeds ~3–4 ms/frame, targeted glass-ui surface consolidation would be the lever.

**No J action without an on-device measurement.** Manufactured perf claims without device measurement violate the mandate.

---

### PF-6 — `AnimationGroup` per-frame `Promise.all` array allocation (P2, BOOK/MEASURE-FIRST)

**Evidence:** `src/animation/group.ts:501-513` — `_advanceSlice` allocates a fresh `Promise<number>[]` + `Promise.all` EVERY frame. In steady state every `advanceTo` resolves synchronously (no `await` after first frame at `engine.ts:840-863`), so this is `Promise.all` over already-resolved values — pure per-frame GC pressure. Already identified as ENG-3 in the J engine-core audit.

**Expected win:** removes the per-frame array alloc in the group draw loop. For a 200-cell group this is 200 Promise handles + 1 array per frame (~10 KB/s of short-lived allocations). Whether it registers in the GC profile requires `bench/playwright.bench.ts` + `node --expose-gc` measurement.

**Gate:** extend `bench/loaf-scene.html` to record `window.performance.measureUserAgentSpecificMemory?.()` before/after the fix; or use V8 memory profiling. The existing LoAF bench does NOT assert allocation discipline — only main-thread blocking.  
**Risk:** medium (the `Promise.all` path carries the genuine async first-frame `onStart`/delay path; a sync fast-path must not skip the async route).

---

### PF-7 — `fetchpriority="high"` on the LCP font preload (P2, LOW EFFORT)

**Evidence:** `demo/app/index.html:46-51` — the `<link rel="preload" as="font">` for Instrument Serif lacks `fetchpriority="high"`. Modern browsers already assign high priority to `as="font"` preloads, making this redundant in practice. But explicit `fetchpriority="high"` provides a signal to the browser's bandwidth estimator and makes the LCP intent unambiguous to auditing tools.

**Expected win:** negligible in absolute terms (the browser already fetches it at high priority). Zero risk; a two-character HTML edit.  
**Gate:** Lighthouse LCP metric on the home/cube scene before/after; expect < 10 ms delta.  
**Risk:** zero.

---

### PF-8 — SoA `lerpArray` consumption (BOOK — ≥5 tranches deferred, needs KILL pressure)

**Evidence:** `src/animation/group.ts:76` `YIELD_BATCH = 32`; `src/animation/engine.ts:730-732` per-channel `_lerp` closure dispatch. The G-2 finding (from `docs/tranches/G/audit/a-engine-perf.md`) measured K=6-10 as the real-world transform-animation shape (translate3d+scale+rotate+opacity = 10 channels), where `lerpArray` (value.js `math.ts:48`) bites 2.5–4× over per-channel dispatch. `lerpArray` EXISTS in value.js 0.11.2 (installed, confirmed), but kf's `frame-compiler.ts` does not consume it.

**Current status:** `grep -r lerpArray src/` → 0 hits. The SoA compile-side transposition (adapting `frame-compiler.ts` to emit a `Float64Array` keyframe buffer consumed by a `lerpArray` call in `interpFrames`) is a MEASURE-FIRST candidate that has been deferred ≥5 tranches.

**J mandate:** the deferred-ledger lane (`docs/tranches/J/audit/deferred-ledger.md:102`) calls for KILL-reaffirm or bench-first. A bench comparing the current per-channel `_lerp` path against `lerpArray` on a realistic K=8 animation (the demo's transform-heavy cube animation) is the prerequisite. Without the bench, J should KILL this entry rather than carry it another tranche.

**Gate:** `bench/interpolation.bench.ts` extended with a `Float64Array`-based SoA shape at K=8; show ≥ 20% wall-time reduction to justify the FrameCompiler refactor.  
**Risk:** HIGH if elected — `FrameCompiler` emits `AnimationFrame[]` with `interpVars: Record<string, ValueUnit[]>`; moving to a numeric SoA requires a parallel codepath or a full type-level refactor. The deferred-ledger correctly calls this out as a SHIP-only-at-K≥6 workload.

---

## 6. Summary table

| # | Title | Severity | Expected win | Measurement gate | Risk | Disposition |
|---|---|---|---|---|---|---|
| PF-1 | Three.js namespace import prevents tree-shaking | P1 | ~100-200 KB chunk reduction, amiga LCP improvement | Build probe: vendor-three size before/after | LOW | FOLD |
| PF-2 | Dock transition:width under backdrop-filter | P1 (GLASS-UI) | ≤ 2 dropped frames on dock expand | `proof:perf-frame-budget` clause (c) | GLASS-UI OWNED | VERIFY-ONLY |
| PF-3 | Monaco eager-pull regression risk | P1 | Preserve spring LCP < 15s; no critical-path Monaco | `KF_ANALYZE=1 npm run gh-pages` + bundle probe | LOW | VERIFY-ONLY |
| PF-4 | CSS payload 599 KB | P2 | Unknown — probe required | Build + PurgeCSS audit | LOW | BOOK |
| PF-5 | backdrop-filter fill-rate (30 live layers) | P2 | Unknown — on-device only | On-device DevTools GPU track | HEADLESS-BLIND | BOOK |
| PF-6 | Group per-frame `Promise.all` array alloc | P2 | Removes per-frame array alloc (GC noise) | `bench/` memory probe | MEDIUM | BOOK/MEASURE-FIRST |
| PF-7 | `fetchpriority="high"` on font preload | P2 | Negligible (browser already high) | Lighthouse LCP delta | ZERO | FOLD (trivial) |
| PF-8 | SoA `lerpArray` consumption | BOOK | 2.5-4× at K=8-10 (measured in G) | K=8 interp bench in vitest | HIGH | BOOK/KILL-reaffirm |

---

## 7. What the existing instruments do NOT measure (gaps)

1. **INP on real interactions.** `proof-perf-frame-budget.mjs` measures rAF dropped-frame counts, NOT INP (Interaction to Next Paint). The LoAF bench (`bench/playwright.bench.ts`) asserts no >50ms BLOCKING task during a 200-cell group composite — correct but not a full INP harness. A real INP measurement would instrument `PerformanceObserver({type:'interaction'})` during PLAY+SWITCH+DRAG and assert median INP < 200ms.

2. **Cold-start TBT.** The b16 boot profile recorded 137 ms total blocking time at cold start (3 long tasks, longest 155 ms, `b16-perf-profile.result.json`). The `proof-lighthouse-mobile.mjs` asserts only the Lighthouse mobile Performance FLOOR (no TBT clause). A direct TBT gate on the built dist would close this gap.

3. **Network-throttled LCP on first visit.** The b16 profile ran on localhost (TTFB 4 ms). A 4G-throttled Lighthouse run (or a `chrome.loadingSettings.network` CDP probe) would reveal the real network-dependent LCP for first-time visitors who have not cached any chunk. The `proof-lighthouse-mobile.mjs` gate runs on localhost too (unbounded bandwidth) — its LCP numbers are NOT representative of a cold first-visit on a real connection.

4. **Memory growth under long sessions.** No probe tracks heap growth across repeated scene switches. The `takeHeapSnapshot` from the LoAF bench infrastructure (`bench/playwright.bench.ts`) could be extended, but none of the existing probes assert "heap at steady state < N MB" or "no growth after 20 scene switches."

---

## Re-runnable probes used in this audit

- `ls -lah /Users/mkbabb/Programming/keyframes.js/dist/` — library build files + sizes
- `cat docs/tranches/I/audit/investigate/probes/b16-perf-profile.result.json` — b16 transfer + initial load numbers
- `wc -c demo/@/styles/style.css demo/@/styles/design-idioms.css demo/@/styles/brand.css` — raw CSS sizes
- `grep -n "SCENE_CEILINGS" scripts/proof-lighthouse-mobile.mjs` — mobile perf floors
- `grep -n "YIELD_BATCH" src/animation/group.ts` — batch size constant
- `ls -lah node_modules/three/build/three.module.min.js` — Three.js min size
- `grep -rn "import \* as THREE" demo/` — namespace import pattern
