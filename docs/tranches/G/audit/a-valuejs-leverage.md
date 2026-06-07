# a-valuejs-leverage — better leverage value.js 0.11.0 (Tranche G deep audit)

**Lane id.** `a-valuejs-leverage`. **Branch.** `tranche-g-dev` (D+E+F IMPLEMENTED +
RELEASED — kf `4.0.0`, value.js `0.11.0`, parse-that `0.9.0` on the registry).
**Scope.** The kf↔value.js consumption seam — what value.js `0.11.0` now SHIPS that
the F audit (`F/audit/a-vj-consumption-F.md`, written against `0.10.0`) named OPEN, and
the integration G should fold: the re-pin, the F.W6 computed-endpoint cache consumption
(incl. the `bumpLayoutEpoch` container-resize edge), the D2 SoA numeric carrier, and the
remaining value.js under-leverage. **inv-16 relaxed for G impl, but value.js is AUDITED
as its own surface and every cross-repo item is tagged HAND-OFF.** Research + audit ONLY
— this doc is the only artifact; ZERO source edits.

**Method (inv ε).** Every kf claim is `file:line`-grounded against the live
`tranche-g-dev` tree + the installed `node_modules/@mkbabb/value.js@0.10.0` dist; every
value.js claim against the live source at `/Users/mkbabb/Programming/value.js` (HEAD
`e8cc1fb`, version `0.11.0`) + the published `0.11.0` dist. I **diff** the F audit, I do
not repeat it. I EXTEND the G `a-prompt-recap §pin-lag` / `a-deferred-ledger §0` (which
own the headline re-pin); this lane is the dedicated value.js deep-dive: the per-win
consumption mechanics, the one fold the bare re-pin does NOT cover, and the residual wave.

---

## 0. The headline — the seam INVERTED since F

The F audit's central finding (`a-vj-consumption-F §0.1`) was: **"the pin is current and
the seam is clean — installed === HEAD-declared, no pin lag; the entire handoff (Waves
A–F) remains UNCONSUMED and OPEN in value.js."** That is now **inverted on both halves**:

1. **value.js LANDED the entire Tranche-F wave and PUBLISHED it as `0.11.0`** (`npm view
   @mkbabb/value.js version` → `0.11.0`, `latest`; commits `8383bd8`..`e8cc1fb` on HEAD).
   The release commit message enumerates it: `A2/C5/B1b/A1/B3+B5/D2/F7 + the
   computed-endpoint cache`. Verified live in `value.js/src/`:
   - **C1/C2/C4/C7** — the computed-endpoint cache: `lerpComputedValue` now caches the
     resolved `(startN, stopN, unit)` on `iv._computedCache`, keyed `(target, epoch)`;
     a steady frame collapses to a bare `lerp` (`value.js/src/units/interpolate.ts:26-72`).
     `bumpLayoutEpoch()` / `getLayoutEpoch()` exported (`normalize.ts:157,166`; auto-install
     on `window.resize`, `:182-189`).
   - **B3/B5** — the frozen color-channel plan: a closure-free flat loop over a light SoA
     plan built once at `prepareInterpVar`, the ÷360 hue folded in (B5)
     (`interpolate.ts:89-135`).
   - **A1** — the O(1) first-char `dispatch(table)` at the 14-way color fork
     (`value.js/src/parsing/color.ts:557-593`).
   - **D2** — the SoA `lerpArray(Float64Array, Float64Array, t, out)` carrier primitive
     (`value.js/src/math.ts:48-60`), with a shaped bench (`value.js/bench/numeric-soa.mjs`).
   - **C5** (the 24 no-op relative length units), **A2** (maximal-munch unit classifier),
     **B1b** (`formatColor` omits `/alpha` at α=1), **F7** (custom-name-map-before-parse).

2. **kf is STILL pinned to `0.10.0` and consumes NONE of it.** `package.json` declares
   `"@mkbabb/value.js": "^0.10.0"` and `"@mkbabb/parse-that": "^0.8.2"` (re-verified
   live); `node_modules/@mkbabb/value.js` is `0.10.0`. I proved the installed `0.10.0`
   dist (`node_modules/@mkbabb/value.js/dist/value.js`) carries **none** of the F surface:
   `_computedCache` / `_colorPlan` / `layoutEpoch` / `bumpLayoutEpoch` / `lerpArray` are
   **all absent** (grep over the dist bundle = 0 hits each; the dist export-table has no
   `bumpLayoutEpoch`/`getLayoutEpoch`/`lerpArray`). **So the cache, the color plan, the
   dispatch, and the SoA primitive land ONLY on re-pin — they are not "transparently
   already there."** kf `4.0.0` shipped on the OLD value.js it drove the wins into.

**The structural reason the re-pin is nearly-free still holds (and is now PROVEN
non-breaking).** kf reaches the entire interp path through ONE dispatch site —
`lerpValue(eased, iv)` at `engine.ts:731` (the F docs cite `:629`; it moved with the
F.W4 `processFrame` lift), `iv._lerp`-internal. So C1/B3/B5/A1 are consumed with ZERO kf
edit. I verified the re-pin breaks NO kf import: all **29** value.js names kf statically
imports (`engine.ts:24`, `utils.ts:18,24`, `constants.ts:10,15`, `adapter.ts:9`,
`format.ts:8`, `waapi.ts:1`, `group.ts:1`, `frame-compiler.ts:21`, `animations.ts:1`,
`motion-path.ts`) are **still exported** by the `0.11.0` dist (checked each against
`value.js/dist/index.d.ts` + the `*.d.ts` set — 29/29 OK, zero MISSING).

---

## 1. SHIP-in-G — the re-pin + consumption (the headline fold)

### F-VJ-1 — re-pin `@mkbabb/value.js ^0.10.0 → ^0.11.0` (and parse-that transitively)

**Disposition: SHIP-in-G.** This is the G integration the lane exists to fold. It is the
consume-leg `F/FINAL.md:11-12` named ("kf consumes them unchanged through the `lerpValue
→ iv._lerp` seam **on re-pin** — ZERO kf edit needed") and **never executed**. It is
inv-27 owed at the post-F-publish moment (`a-prompt-recap §pin-lag`, `a-deferred-ledger
§0` carry the same headline; this lane GROUNDS the per-win mechanics + the residual edge).

- **The change:** `package.json` deps → `"@mkbabb/value.js": "^0.11.0"`; parse-that rides
  it transitively (kf consumes parse-that *only* through value.js on the heavy path — the
  one direct kf import is `import { any as parseAny } from "@mkbabb/parse-that"` at
  `utils.ts:1`, which `0.9.0` still exports; `a-prompt-recap §pin-lag` row 2). Re-build,
  re-run `proof:all`. Pixel-identical (faster, same output).
- **What it lands, zero-kf-edit, through `iv._lerp`:**
  - **C1 computed-endpoint cache (−94% / O(frames)→O(1) per `F/FINAL.md:39-44`):** every
    kf `@keyframes` animating `calc()`/`var()`/`vh`/`cqw` (the rAF resolver path) collapses
    to a bare `lerp(startN, stopN, t)` after frame 1 — no `getComputedValue`, no
    `value.toString()`, no forced reflow. Consumed entirely inside `lerpComputedValue`,
    reached via `engine.ts:731 lerpValue → iv._lerp`. **This is the F.W6 win whose clean
    home F ruled was value.js** (`F/FINAL.md:39-44`; the kf-side wrapper was
    recorded-withheld because it would duplicate value.js's resolver + add a library-global
    resize listener). The re-pin is the consume-leg of that ruling.
  - **B3/B5 color plan (3.96× per `F/FINAL.md:91-92`):** kf's color frames go through
    `prepareInterpVar(normalizeValueUnits(...))` (`utils.ts:339`), which now builds the
    frozen `_colorPlan`; `lerpColorValue` runs the closure-free loop. kf calls
    `prepareInterpVar` already — the plan is built/consumed on re-pin, no kf edit.
  - **A1 dispatch (2.41×):** internal to value.js's color parser (`color.ts:593`); kf
    consumes it through `parseCSSValueUnit`/`parseCSSValue` on every keyframe parse.
  - **C5 (the `50dvh→50px` *correctness* bug, `a-vj-consumption-F §2 C5`):** a kf
    `@keyframes` animating any of the 24 previously-no-op relative units (`dvh`/`svh`/`lvh`
    family, `vi vb cap ic lh rlh`) on the rAF path silently painted raw px; `0.11.0`
    resolves them. **This is a correctness fix, not perf** — it changes WRONG pixels to
    right (named-delta-isomorphic, the only befitting break in the re-pin).
  - **A2 / B1b / F7:** latent-correctness + serialize tidiness, consumed transparently.
- **Falsifiable instrument (named, SHIP-bar):**
  1. `proof:all` green on `^0.11.0` (the 261-test suite is the pixel-identity lock for
     every isomorphic win).
  2. `bench/interp-buffer.bench.ts` (the F.W1 threaded-out-buffer bench, value-module
     import, `bench/interp-buffer.bench.ts:18`) re-run before/after the re-pin on a
     **computed-unit** keyframe (`calc(100cqw - 100%)` / `vh`) — the C1 endpoint cache
     materializes as a wall-time drop on the steady frames. (NB: the current bench's
     FLAT_KEYS are numeric; a computed-unit variant is needed to BITE on C1 — see §3 the
     measure-first note. The re-pin SHIPs on `proof:all` + the C5 correctness test below;
     the bench is the perf witness.)
  3. A `proof:`-grade test asserting a `@keyframes` over `50dvh` resolves to the live
     `0.5 × dynamic-viewport-height` (not `50`) on the rAF path — the C5 correctness lock.

---

### F-VJ-2 — wire `bumpLayoutEpoch()` to the container-resize edge (the fold the bare re-pin does NOT cover)

**Disposition: SHIP-in-G (the one genuine kf-side fold of this lane).** The C1 cache is
invalidated by a monotonic `layoutEpoch`; value.js **auto-installs a `window.resize`
listener** that bumps it (`value.js/src/units/normalize.ts:182-189`). **But a CONTAINER
resize that does not coincide with a window resize never bumps the epoch** — so the C1
cache would serve **stale pre-resize pixels** for any container-query-unit animation whose
container box changes independently of the viewport. This is the exact C7 staleness the
value.js docstring names (`normalize.ts:166-174`: "Call on any event that changes a
computed-unit resolution — a viewport `resize`, a container `ResizeObserver` callback…").

**This BITES kf today.** kf's flagship computed-unit demo, `AnimationVisualizer.vue`,
animates the ball via `translate-x-[calc(100cqw_-_100%)]` (`demo/@/components/custom/
animation-controls/controls/AnimationVisualizer.vue:35`) inside a `container-type:
inline-size` parent (`demo/@/styles/style.css:256`). A panel/split-pane resize that
changes the container width **without** a window resize (a dock toggle, a sidebar
collapse, a flex re-layout) leaves the C1 cache stamped at the stale epoch → the ball
animates to the OLD `100cqw` pixel target until the next window resize busts it. **Before
the re-pin this bug cannot exist (0.10.0 re-resolves every frame, no cache); the re-pin
INTRODUCES it unless the container-resize signal is wired.** This is the no-workaround
seam: the right fix is to feed the genuine signal value.js exposes, not to disable the cache.

- **The fold (kf-side, idiomatic):** a `ResizeObserver` on each computed-unit animation's
  resolution-container (or the demo's `useResizeObserver` from `@vueuse/core`, already in
  the demo dep set — `demo/easing/EasingTarget.vue:102`, `AmigaScene.vue:12`) calls
  `bumpLayoutEpoch()` on container resize. value.js EXPORTS it for exactly this
  (`normalize.ts:166`); kf imports it on the heavy surface beside the rest of its value.js
  edge. **DRY:** the eviction/invalidation policy lives ONCE in value.js — kf only feeds
  the signal value.js's auto-`window.resize` cannot see.
- **Scope question to MEASURE-FIRST:** does the library wire this generically (an opt-in
  `ResizeObserver` on `setTargets` when any iv carries a `cq*`/computed unit), or is it a
  demo-only fold (the demo owns its containers)? The library-generic path adds a per-target
  observer for a niche unit class — the same boundary-breach concern that kept F.W6's
  wrapper out of kf. **Recommendation: the DEMO wires it (it owns `AnimationVisualizer`'s
  container); the LIBRARY documents the `bumpLayoutEpoch` contract for container-unit
  consumers** (mirrors the `AnimationGroup` managed-child contract doc). A library-generic
  auto-observer is BOOK pending a bench that a container-unit animation under panel-resize
  is a real workload.
- **Falsifiable instrument:** a demo/integration test (or a Playwright check on the live
  CF-Pages build) that resizes `AnimationVisualizer`'s container WITHOUT a window resize
  and asserts the ball's resolved x-target tracks the new `100cqw` (fails on a stale-epoch
  serve). Absent the wire, the test reproduces the staleness; with it, green.

---

## 2. MEASURE-FIRST — the D2 SoA numeric carrier (kf-local fold)

### F-VJ-3 — adopt `lerpArray` in `NumericAnimation`'s segment carrier

**Disposition: MEASURE-FIRST (kf-local SoA-segment compile), gated on representative-K.**
value.js `0.11.0` ships the D2 carrier primitive `lerpArray(start, stop, t, out)` over
contiguous `Float64Array`s (`value.js/src/math.ts:48-60`), measured (its own
`bench/numeric-soa.mjs`) at **1.56× (K=2) → 4.25× (K=64)**, byte-identical to K
independent `lerp()` calls, SLOWER at K=1 — so the docstring binds it to K≥2 callers only.

kf's `NumericAnimation` is the **in-tree SoA reference shaped to consume it without an
architectural edit** (`r-interpolation-carrier §3`/F-3, re-confirmed live):
- `buildSegment` stores `startVals: number[]` / `stopVals: number[]` AoS arrays
  (`numeric.ts:139-141`) and `at()` runs a per-key scalar `lerp(seg.startVals[i],
  seg.stopVals[i], eased)` loop (`numeric.ts:175-181`). That is **exactly** the AoS
  pointer-chase + per-channel scalar-call shape D2's `lerpArray` collapses into one flat
  `Float64Array` loop.
- The fold: compile `startVals`/`stopVals` to `Float64Array` at `buildSegment`, allocate a
  result `Float64Array`, and call `lerpArray(seg.startF64, seg.stopF64, eased, seg.outF64)`
  in `at()`, then scatter back into `this.result` (or keep `result` itself SoA-backed).
  Pixel-identical; the no-legacy collapse retires the scalar loop in the same motion.
- **The gate (why MEASURE-FIRST, not SHIP):** `NumericAnimation`'s realistic K is small —
  a morph/canvas keyframe is typically K=2–6 (`ElementMorph` composes it for x/y/scale).
  At K=1 `lerpArray` is a measured non-win; the value.js bench shows it BITES from K≥2
  (1.56×). So the fold lands ONLY if kf's representative `NumericAnimation`/`ElementMorph`
  workload is K≥2 on a SHAPED bench — else it is recorded-withheld WITH the number.
- **Falsifiable instrument:** a `bench/numeric-soa.bench.ts` (kf-side, the sibling of
  value.js's `numeric-soa.mjs`) over `NumericAnimation.at()` at K∈{2,5,12} (the
  `interp-buffer.bench.ts` K-ladder, `bench/interp-buffer.bench.ts`) — lands the fold on a
  demonstrated ≥1.3× at the demo's K, records-withheld otherwise. D1 monomorphization is
  KILLED upstream (a measured non-win, `r-interpolation-carrier §1`; value.js did NOT ship
  it) — do NOT re-litigate it. CSS Typed OM as a carrier is KILLED (a downgrade,
  `r-interpolation-carrier §4`).

**Note (RECORD):** `NumericAnimation` is **light-tier** (no static value.js edge —
`numeric.ts` imports only `internal/leaves`; CLAUDE.md boundary). `lerpArray` lives in
value.js's `math.ts`. Adopting it would add a value.js edge to a light module OR require a
`leaves.lerpArray` parity-copy (the existing `leaves.ts` clamp/lerp/scale pattern). The
parity-copy is the boundary-preserving home (mirrors `leaves.lerp`); this is a fold detail
to settle at impl, not a blocker. Tag the parity-copy as part of the MEASURE-FIRST fold.

---

## 3. The under-leveraged value.js surface (HANDOFF + RECORD)

The prompt asks what kf under-leverages across the heavy `lerpValue` seam, the color
science, and the parser. Honest answer, grounded:

### 3.1 The heavy `lerpValue` seam — ALREADY-SOTA leverage, nothing to fold

**RECORD (ALREADY-SOTA).** kf's single-dispatch consumption (`engine.ts:731` →
`iv._lerp`) is the IDEAL cross-repo contract — it is why C1/B3/B5/A1 are consumed with
zero kf edit (`a-vj-consumption-F §4`, re-confirmed: the seam moved from `:629` to `:731`
with the F.W4 `processFrame` lift but stayed single-dispatch). The re-export barrels are
gone; kf imports value.js directly at 11 heavy sites. There is **no leverage gap on this
seam** — the re-pin IS the leverage. Manufacture no kf-side interp-path work.

### 3.2 The C7 / D-resolved residual — value.js-HANDOFF (carried, re-grounded against 0.11.0)

The value.js charter v2 (`F/valuejs-sota-handoff-v2.md`) named a wave NOT folded into
`0.11.0`. Re-grounded against the published `0.11.0` — **strike what 0.11.0 closed, carry
the rest** (`a-prompt-recap GS-10`):

| value.js charter item | 0.11.0 status (verified) | G disposition |
|---|---|---|
| C1/C2/C4/C7 computed memo | **SHIPPED** (`interpolate.ts:26-72`, `normalize.ts:157-189`) | **consumed on re-pin (F-VJ-1)** |
| A1 dispatch / A2 munch / C5 24-units / B1b / B3+B5 / D2 / F7 | **SHIPPED** | **consumed on re-pin** |
| **S4** native WAAPI color (`cssColorInterpKeyword` + L4-space serializer) | **OPEN** — grep `cssColorInterpKeyword` over `value.js/src` = 0; kf's color block at `waapi.ts` stands | **value.js-HANDOFF** (paired kf eligibility-lift FOLD lands the same motion) |
| **S6 / F2** `currentColor`/`light-dark()`/system-color sentinels | **OPEN** — parser still rejects these inputs | **value.js-HANDOFF** (kf has 0 policy because the inputs don't parse) |
| **F3** LRU eviction on `getComputedValue.cache` | **OPEN** (the C1 cache + `bumpLayoutEpoch().clear()` is the wholesale-clear; no LRU bound) | **value.js-HANDOFF** (the bound belongs ONCE in value.js; the re-pin makes a kf-side second policy a DRY violation) |
| **VJ-F1** path-geometry sampler (MorphSVG/DrawSVG domain) | **OPEN** (no `d`-parse → bézier sampler in `value.js/src`) | **value.js-HANDOFF + BOOK** (the kf SVG wave, `gap-scorecard S2`) |
| **E1/E2** `linear()`/`steps()` parsers | **OPEN** value.js-side; kf's local reader LANDED (`utils.ts:106-130`) | **value.js-HANDOFF (re-scoped DRY)** — kf's `parseLinearStops` shim RETIRES onto value.js's parser when it lands (no-legacy collapse, `F.md:55`); not a kf blocker today |

Each is the value.js half of a paired win; the kf half is either landed (the
eligibility/policy seams) or structurally free (single-dispatch). These are NOT punts —
they are the next value.js wave, owned by the value.js owner against its own discipline.

### 3.3 The color science + parser breadth — ALREADY-SOTA (do NOT manufacture a deficit)

**RECORD (ALREADY-SOTA).** The F audit + the value.js charter v2 §7 ruled value.js's color
*science* (oklab/oklch perceptual lerp, gamut mapping, the CSS-Color-4 hue short-way),
parse *breadth*, and interp *dispatch* at or ahead of SOTA — "the gaps are churn +
memo-key cost + a handful of spec parsers, not science" (`valuejs-sota-handoff-v2.md:76-77`).
`0.11.0` closed the churn (B3/B5) and the memo-key cost (C1/C2). What remains (§3.2) is the
spec-parser frontier (S4/S6/E1) + the SVG-geometry wave (VJ-F1) — all correctly OPEN,
value.js-owned. kf's consumption of the science is exemplary and untouched.

---

## 4. ALREADY-SOTA — where kf's value.js leverage needs no work

Stated plainly (the KISS clause):

- **The single-dispatch interp seam** (`engine.ts:731` → `iv._lerp`) — the structural
  reason the re-pin is zero-kf-edit. No refactor to propose.
- **The boundary is exemplary** — light modules carry zero static value.js edge
  (`NumericAnimation`/`SmoothProgress`/`SpringProgress`/`Timeline`/`ElementMorph` read
  `internal/leaves`, gated by `proof:boundary`); the heavy surface imports value.js
  directly with no barrel indirection.
- **The §2 rename is closed** (`AnimationOptions→CSSAnimationOptions` discharged in
  `0.10.0`; kf imports neither — `a-vj-consumption-F §0.2`); **F4 `@property`
  round-trip is lossless** by verification (`0.11.0` locks it, commit `c17263d`); kf's
  local `linear()`/`steps()` readers close the consumer half of the easing round-trip.
- **All 29 kf-consumed value.js names survive `0.11.0`** — the re-pin is non-breaking.

---

## 5. Disposition summary

| ID | Finding | Disposition | Instrument (SHIP) |
|---|---|---|---|
| **F-VJ-1** | Re-pin `^0.10.0→^0.11.0` (+parse-that transitively); consume C1/B3/B5/A1/C5 through `iv._lerp` | **SHIP-in-G** | `proof:all` green + a C5 `50dvh` correctness test + `interp-buffer.bench.ts` (computed-unit variant) as the C1 perf witness |
| **F-VJ-2** | Wire `bumpLayoutEpoch()` to the container-resize edge (the re-pin INTRODUCES C1 staleness for `cqw` animations under non-window resize — bites `AnimationVisualizer`) | **SHIP-in-G** (demo-wires + library-documents the contract) | a resize-without-window-resize test on `AnimationVisualizer` asserting the ball tracks the new `100cqw` |
| **F-VJ-3** | Adopt `lerpArray` SoA carrier in `NumericAnimation` (the in-tree SoA reference) | **MEASURE-FIRST** (gated K≥2) | `bench/numeric-soa.bench.ts` at K∈{2,5,12} — land on ≥1.3× at demo K, record-withheld else; via a `leaves.lerpArray` parity-copy (boundary) |
| **F-VJ-4** | S4 native WAAPI color (`cssColorInterpKeyword` + L4 serializer) | **value.js-HANDOFF** | (paired kf eligibility-lift on publish) |
| **F-VJ-5** | S6/F2 `currentColor`/`light-dark()`/system-color sentinels | **value.js-HANDOFF** | (paired kf policy on publish) |
| **F-VJ-6** | F3 LRU bound on `getComputedValue.cache` | **value.js-HANDOFF** | (the bound lives ONCE in value.js) |
| **F-VJ-7** | VJ-F1 path-geometry sampler (MorphSVG/DrawSVG) | **value.js-HANDOFF + BOOK** | (the kf SVG wave) |
| **F-VJ-8** | E1/E2 `linear()`/`steps()` parsers; kf shim retires onto them | **value.js-HANDOFF (re-scoped DRY)** | (RETIRE `parseLinearStops` when value.js E1 lands) |
| **F-VJ-9** | The single-dispatch seam / boundary / color science / parser breadth | **RECORD (ALREADY-SOTA)** | — |

---

## inv-16 compliance

This lane wrote ONLY `docs/tranches/G/audit/a-valuejs-leverage.md`. ZERO source/test/CI/
demo edits to keyframes OR value.js. Every value.js item is a *proposal* / a HAND-OFF the
value.js owner sequences; the re-pin (F-VJ-1) and the container-resize fold (F-VJ-2) are
kf-side G IMPL proposed for a G wave, not written here. Every kf claim is `file:line`-
grounded against the live `tranche-g-dev` tree + the installed `0.10.0` dist; every
value.js claim against the live `0.11.0` source + the published `0.11.0` dist.
