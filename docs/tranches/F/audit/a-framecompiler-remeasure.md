# Tranche F audit — lane `a-framecompiler-remeasure`

**Lane mandate.** RE-MEASURE the W8 FrameCompiler WITHHOLDS honestly, the measure-first
re-visit: **S1** typed time index (`Float64Array` startTimes/stopTimes — the E note said
the shared `binarySearchRange` has no index-aware accessor, a negligible gain), **S2**
slot map (the per-frame `Object.assign` over a small dict), **S3** incremental
`updateSegments` (the editor workload). With a *shaped bench plan*, does F NOW land any of
them, or stay withheld? Re-ground against `frame-compiler.ts` + `numeric.ts` (the SoA
target). **Audit only — ZERO source edits.** inv-16: value.js changes are hand-offs.

**Disposition legend.** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## TL;DR

| Withhold | Mandate's own framing | F disposition | Why |
|---|---|---|---|
| **S1** typed time index (`Float64Array` starts/stops) | "negligible gain" | **MEASURE-FIRST → RECORD (re-confirmed)** | Full-tick bench: the search delta is ~4 ns of a ~128–168 ns tick; *negative* at the dominant N=2. |
| **S2** slot map (per-frame `Object.assign`) | "over a small dict" | **MEASURE-FIRST → BOOK** | Only bites with ≥2 active frames (no such bench exists); clean form rides the carrier-lane SoA — sequence after it. |
| **S3** incremental `updateSegments` | "the editor workload" | **BOOK** | The editor's two heavy ops are `debounce(fn, 1000)`; a sub-100 µs whole-program `parse()` once/sec, vs trading the FC-2 byte-determinism lock for a dirty-state machine. |
| (instrument) | — | **SHIP-in-F** | The compile/interp benches don't run — barrel exports `CSSKeyframesAnimation` as a TYPE only. Confirmed live. |

**Net: F lands NONE of S1/S2/S3.** The W8 withhold HOLDS, and this lane gives it the one
number the sibling lane `r-frame-compile-sota.md` explicitly could not — the **full
`interpFrames` tick**, measured against the real engine, not an isolated `/tmp` search.

**Relation to the sibling F lane (cite + diff, do NOT repeat).** `r-frame-compile-sota.md`
already re-measured this surface and reached the same dispositions from an **isolated search
microbench** (`§A`, a `/tmp/bench-time-index.mjs` that benches *only* `binarySearchRange`)
and from the editor-workload reading. It honestly flagged the gap: *"This isolates the
search; it does not run the full `interpFrames` tick (the benches that would … are broken).
… The full-tick re-measure should be done once §5's bench fix lands"* (`r-frame-compile-sota.md:382-387`).
**This lane closes exactly that gap** — I ran the full tick by importing from `engine.ts`
directly (the F-5 fix path), so the measure-first dispositions now stand on the full-tick
denominator, not an extrapolation. I do not re-litigate that lane's industry-frontier survey
(Motion/Interpol/Anime/Babylon — `§4`); I cite its conclusion and add the measurement.

---

## §0 — What E LANDED (verify, do not re-open)

The E FrameCompiler lane (`E/audit/sota/a-kf-framecompiler.md`) named FC-1 and FC-2 as
FOLD-E; both landed and are live:

- **FC-1 colorSpace/hueMethod compile-staleness — LANDED.** `renormalizeColors()`
  (`frame-compiler.ts:387-401`) re-runs `createInterpVarValue` over the existing
  `frames`/`parsedVars` with the new space and rebuilds the hot-path arrays via
  `finalizeFrameVars`, **no re-flatten/re-sort** — the E-FC-1(a) cheap path. The
  doc-comment (`frame-compiler.ts:99-109`) now describes the targeted re-derive correctly.
- **FC-2 `frameId` non-determinism — LANDED.** `createFrame` derives the id as
  `startIx * FRAME_ID_SCALE + endIx` (`frame-compiler.ts:213`, `FRAME_ID_SCALE = 1_000_000`
  at `:84`), content-keyed on the stable `(startIx, stopIx)` pair. `compile-deterministic.test.ts`
  (verified, full file 45 lines) locks **byte-identical `frames[]` across three re-parses,
  ids included** (`:36,43`), with the documented bite (revert to `this.frameId++` → ids
  drift, `:5-9`).

These are CLOSED. My subject is the FC-4 SoA family + incremental compile that stayed
withheld — the W8 S1/S2/S3 the mandate names.

---

## §1 — S1: typed time index (`Float64Array` starts/stops) — MEASURE-FIRST → RECORD

### The proposal + the live shape it would replace

`AnimationFrame.time` is a per-frame `{ start, stop }` object (`constants.ts:93-96`). The
hot-path active-frame seed reads it through **two accessor closures** into the shared
locator:

```ts
const seedIdx = binarySearchRange(
    frames, t,
    (f) => f.time.start,   // engine.ts:582
    (f) => f.time.stop,    // engine.ts:583
);
```
(`engine.ts:579-584`; `binarySearchRange` at `binarySearch.ts:21-37` chases the object
pointers via the closures.) S1 = hold two parallel `Float64Array`s of segment starts/stops
and index a flat array, dropping the closure + the `f.time` pointer chase.

The mandate's own note — *"the shared `binarySearchRange` has no index-aware accessor, a
negligible gain"* — is precisely right, and is the structural objection: `binarySearchRange`
is the ONE locator every sampler reuses — the engine here AND `NumericAnimation.at`
(`numeric.ts:156-161`, same `(s)=>s.startPos`/`(s)=>s.stopPos` accessor shape). A
`Float64Array` index either **forks that API** (an index-aware overload — two locators to
maintain) or pushes typed arrays *into* every sampler's frame array. The note named the
cost; this lane prices the benefit.

### The shaped bench — the FULL tick, against the real engine

The sibling lane benched only the search in isolation and could not run the full tick (the
benches are broken, §3). I drove the **real `interpFrames`** — binary-search seed +
per-`iv` `lerpValue` loop (`engine.ts:628-630`) + `Object.assign` (`engine.ts:636`) — by
importing `CSSKeyframesAnimation` from `src/animation/engine` directly. Two animated numeric
props (opacity + translateX), 60 ticks/call, vitest bench, node v26 / V8:

| N stops | compiled frames | mean / tick | vs N=2 |
|---|---|---|---|
| **2** (dominant preset shape) | 1 | **~128 ns** | — |
| **6** (AnimationMenuBar's deepest preset) | 5 | ~147 ns | 1.14× |
| **11** (the project's "complex" probe) | 10 | ~152 ns | 1.18× |
| 50 | 49 | ~153 ns | 1.18× |
| 200 | 100 | ~168 ns | 1.30× |

(Raw: 0.0077 / 0.0088 / 0.0091 / 0.0092 / 0.0101 ms per 60-tick call; ±0.26–0.34 % rme,
~50–64 k samples each. The temp bench file was removed after the run — no repo change.)

### Why the withhold HOLDS — now with the full-tick denominator

1. **The search delta is a single-digit-ns slice of the whole tick.** The sibling lane's
   isolated search microbench measured the SoA delta at **+17 % at N=11 (22.2 → 18.4 ns ≈
   4 ns), and −3 % (SLOWER) at N=2** (`r-frame-compile-sota.md:143-148`). Against *this*
   lane's full-tick numbers, that ~4 ns saving at N=11 is **~2.6 % of the 152 ns tick** —
   and at the dominant N=2 the SoA is a net *loss* on a 128 ns tick. The search is a
   roughly **flat** component (~10–22 ns across N) while the tick grows with active-frame
   work; the SoA optimizes the part that is NOT the slope.
2. **At the real workload scale the win is zero-to-negative.** The demo presets are
   overwhelmingly 2-stop (`animations.ts`), the deepest menubar preset is 6-stop, and the
   "complex" probe is 11-stop (`interpolation.bench.ts:16`). The isolated-search win only
   opens at N≥50 (`r-frame-compile-sota.md:148`) — which no demo reaches, and which here
   still only moves the full tick from 152 to 153 ns.
3. **N=2 is V8-monomorphic already.** Every `AnimationFrame` is minted by the single
   `createFrame` shape (`frame-compiler.ts:215-226`), so `f.time.start` is one inline-cached
   memory load; the flat-array bounds path doesn't beat it until the array is large and
   cache-resident — exactly what both the isolated and full-tick measurements show.

**Disposition: MEASURE-FIRST → RECORD.** The withhold is re-confirmed with the full-tick
measurement the BOOK never had. The trigger to revisit is concrete: a real **high-segment
workload** (a generated 200+-stop scroll-bound timeline) where the search becomes a
measured share of the tick AND the shared-locator fork is justified by that single
consumer. None exists. **Not a fold for F.**

---

## §2 — S2: slot map (per-frame `Object.assign`) — MEASURE-FIRST → BOOK

### The live cost

`processFrame` merges each active frame's output into the result every tick:

```ts
Object.assign(result, frame.flatVars);   // engine.ts:636 — per active frame, every tick
```

The `out`-buffer reuse (`engine.ts:568-573`, cleared at `:573`) already removes the output
*allocation* (the standalone zero-alloc win, E.W7); S2 is the residual **copy**. The mandate
frames it as *"over a small dict"* — and that is the crux: `frame.flatVars` is a small
`{key: ValueUnit[]}` map, so a single `Object.assign` is cheap. The cost only compounds when
**≥2 frames are active at one `t`** — which `reconcileVars` (`frame-compiler.ts:257-302`)
produces for non-adjacent vars (`left` declared at 0/40/100 while `top` spans 0→100 creates
overlapping segments). The SOTA move: assign each output key a **stable compile-time slot
index** and write `lerpValue` results straight into a reused buffer by slot, dropping the
per-tick `Object.assign`.

### Why it does NOT land in F

1. **It only bites with overlap, and there is no bench for it.** My §1 bench (sequential,
   non-overlapping stops) has exactly one active frame at any `t` — the full-tick numbers
   above include exactly one `Object.assign` per tick and are already ~128–168 ns. The
   multi-active-frame cost is a *different* workload that **no bench in the repo exercises**
   (`interpolation.bench.ts`'s 11-stop case is sequential). The probe must be built before
   the fold is priced — and even then it must clear the N=2-dominant reality where there is
   nothing to remove.
2. **Its clean form is downstream of the carrier SoA another lane owns.** Writing lerp
   results "by slot into a buffer" is the same numeric-`Float64Array`-segment compile the
   `r-interpolation-carrier.md` lane proposes for `allInterpVars`. The reference SoA target
   already exists in-tree: `NumericAnimation`'s `NumericSegment` keeps `startVals: number[]`
   / `stopVals: number[]` / `keys: string[]` as **parallel index-aligned arrays**
   (`numeric.ts:8-15`) and lerps by slot `i` straight into `this.result`
   (`numeric.ts:175-181`) — the exact slot-map shape, with a zero-alloc lock
   (`numeric.test.ts:96-104`). Folding S2 *before* the carrier lands would build a half-SoA
   the carrier work then re-touches. **Sequence after the carrier lane.**

**Disposition: MEASURE-FIRST + BOOK, sequenced after `r-interpolation-carrier`.** No F fold
absent (a) a multi-active-frame bench and (b) the carrier-lane SoA landing. The design is
recorded; `numeric.ts:8-15,175-181` is the canonical slot-map shape to mirror.

---

## §3 — S3: incremental `updateSegments` (the editor workload) — BOOK

The mandate ties S3 to *"the editor workload"* specifically, so the editor code is the
proof. Verified live in `useKeyframeOps.ts`:

- **Both heavy edit ops are `debounce(fn, 1000)`.** `updateAnimationFromKeyframesString`
  (`useKeyframeOps.ts:71`, closing `1000` at `:119-120`) and
  `updateAnimationFromKeyframeString` (`useKeyframeOps.ts:122`, closing `1000` at
  `:150-151`). The user types freely; **at most one compile fires per second of settled
  input.** There is no per-keystroke compile to amortize.
- **E already removed the double compile (S0).** The string-edit op transplants a single
  throwaway's compiled state onto the live animation (`useKeyframeOps.ts:102-109`) rather
  than re-`parse()`ing twice; add/remove mutate the live templates and `parse()` **once**
  (`useKeyframeOps.ts:179-183`, `:206-209`). The remaining compile is irreducible.
- **The canonical incremental candidate already whole-recompiles, and it is fast.** A
  single-keyframe text edit does `Object.assign(animation.templateFrames[frameIx].vars,
  newVars)` then `animation.parse()` (`useKeyframeOps.ts:132-141`). My §1 bench shows a
  full N=11 compile's *runtime* tick is ~152 ns; the *compile* itself (parse + flatten +
  reconcile + sort over ≤~20 stops) is sub-100 µs. Incremental recompute (dirty only the
  `(prev, edited, next)` segments) would save tens of µs **at a 1 Hz cadence**, invisible
  against the 1000 ms debounce + the Monaco re-render + the `formatCSS` round-trip.
- **It would trade away the FC-2 determinism lock for risk.** Incremental compile needs a
  dirty-segment state machine that must produce `frames[]` **byte-identical** to the
  whole-program path — i.e. it must satisfy the very `compile-deterministic.test.ts`
  contract E just locked (§0), plus a new `proof:compile-incremental` byte-equality gate
  (the E FINAL already names this as the future fold's obligation, `E/FINAL.md:48-49`).
  That is a large, risk-bearing machine to save microseconds at 1 Hz.

**SOTA framing.** Incremental computation (salsa, rustc red-green, lightningcss per-rule,
fine-grained reactivity) earns its keep at **thousands** of nodes where whole-program
recompute is perceptible. The FrameCompiler's unit is ≤~20 stops; whole-program `parse()`
IS the right shape at this scale.

**Disposition: BOOK.** Record the dirty-segment design + the `proof:compile-incremental`
byte-equality contract so it is not reinvented; build ONLY on a measured **frame-by-frame
builder** workload (a consumer calling `addFrame().parse()` in a loop) — which neither the
demo nor any public-API usage exhibits. **Not a fold for F.**

---

## §4 — The instrument: the compile/interp benches do not run — SHIP-in-F

While running §1 I confirmed the sibling lane's F-5 live, because it is the instrument every
measure-first disposition here depends on:

- `bench/interpolation.bench.ts:6` and `bench/parser.bench.ts:2` import
  `{ CSSKeyframesAnimation } from "../src/animation"` (the barrel).
- The barrel exports `CSSKeyframesAnimation` **only as a `type`** (`src/animation/index.ts:108`,
  `export type { Animation, CSSKeyframesAnimation, AnimationGroup } from "./engine"`); the
  runtime value lives behind `loadAnimationEngine()` (the documented light/heavy boundary,
  `src/animation/CLAUDE.md`). The static named import resolves `undefined`.
- Live confirmation: `npx vitest bench --run bench/interpolation.bench.ts` →
  **`TypeError: CSSKeyframesAnimation is not a constructor` at interpolation.bench.ts:6:26`**
  (reproduced this lane).

My §1 bench sidesteps it by importing from `../src/animation/engine` directly — which is
**exactly the one-line fix** the demo ops already use (`useKeyframeOps.ts:2`,
`import { Animation, CSSKeyframesAnimation } from "@src/animation/engine"`).

**Disposition: SHIP-in-F.** Trivial, isomorphic (bench-harness-only, no engine change),
unblocks `npm run bench` for the compile/interp path — the instrument the whole measure-first
posture (this lane + the carrier lane) leans on. Straddles the bench/runtime surface; flag to
the runtime lane, and if unclaimed F should land it. (Out of *this* audit lane's write scope
— recorded, not fixed; I removed my temp bench after measuring.)

---

## §5 — Already-SOTA (manufacture no work here)

The sibling lane's industry survey (`r-frame-compile-sota.md:257-305`) establishes that the
FrameCompiler already sits at the actual frontier for its scale, and I concur — no need to
re-derive it. The load-bearing, live-grounded points:

- **Compile-once pre-flatten** — `allInterpVars`/`flatVars` built once in `finalizeFrameVars`
  (`frame-compiler.ts:360-371`), so the rAF loop walks a flat array with the lerp dispatch
  pre-resolved; zero per-tick shape work. (`constants.ts:105-110` documents the intent.)
- **O(log N) seed + contiguous neighbor scan** (`engine.ts:579-606`) — the right search shape;
  my §1 bench shows the tick is near-flat from N=11→N=50 (152→153 ns), confirming the search
  is not the slope.
- **Monomorphic frame mint** — one `createFrame` shape (`frame-compiler.ts:215-226`) keeps the
  hot-path `f.time.start` reads inline-cached (the reason S1's SoA loses at N=2).
- **The D.W4 clock-free split** (`frame-compiler.ts:1-13`) — a pure value-in→frames-out unit.
- **Content-derived idempotent ids** (FC-2, §0) + **targeted color re-normalize** (FC-1, §0).

The mandate's last frontier item — precomputed sample *splines* — is a no-op for the
compiler: the easing is per-segment `frame.timingFunction.fn` read live per tick
(`engine.ts:626`), and value.js already owns the bezier/`linear()` solvers. A precomputed
`X(t)` sample table is a **value.js-easing** concern (already in the E handoff, not a
FrameCompiler one). **No spline cache belongs here.**

**Disposition: ALREADY-SOTA.** No SoA / incremental / spline work to manufacture in the
FrameCompiler.

---

## value.js hand-off

**None originates in this lane.** S1/S2/S3 are all keyframes.js-internal layout/compile
questions; the only adjacent value.js item (a precomputed easing sample-spline) already lives
in the E value.js handoff (`E/valuejs-sota-handoff.md`) as a value.js-easing concern. The
parse/normalize memo-cache LRU bound (the standing `H1`) is unchanged by this lane and is not
re-proposed.

---

## Summary table

| ID | Withhold | Disposition | Key evidence |
|----|----------|-------------|--------------|
| S1 | typed time index (`Float64Array` starts/stops) | **MEASURE-FIRST → RECORD** | full-tick bench: ~4 ns search delta on a 128–168 ns tick (~2.6 % at N=11, *negative* at N=2); forks the shared `binarySearchRange` (`binarySearch.ts:21-37`, reused by `numeric.ts:156-161`) |
| S2 | slot map (per-frame `Object.assign`) | **MEASURE-FIRST + BOOK** (after carrier lane) | `engine.ts:636`; only bites ≥2 active frames (no bench); slot-map shape already in `numeric.ts:8-15,175-181` |
| S3 | incremental `updateSegments` (editor) | **BOOK** | both editor ops `debounce(fn, 1000)` (`useKeyframeOps.ts:71,119-120,122,150-151`); sub-100 µs whole-compile once/sec vs the FC-2 byte-lock (`compile-deterministic.test.ts`) |
| — | broken compile/interp benches | **SHIP-in-F** (flag runtime lane) | barrel type-only export (`index.ts:108`); live `TypeError: CSSKeyframesAnimation is not a constructor`; fix = import from `engine` (`useKeyframeOps.ts:2`) |
| FC-1/FC-2 | colorSpace re-normalize · idempotent `frameId` | **LANDED in E** (verified) | `frame-compiler.ts:213,387-401`; `compile-deterministic.test.ts` |
| — | compile shape (pre-flatten, O(log N), monomorphic mint, idempotent ids) | **ALREADY-SOTA** | `frame-compiler.ts:1-13,360-371`; `engine.ts:579-606` |

**Net.** F lands **none** of S1/S2/S3. The W8 FrameCompiler-SoA + incremental withhold HOLDS
— and this lane gives it the **full-`interpFrames`-tick** measurement the sibling lane could
not (it benched only the isolated search and flagged the full-tick number as owed). At the
real workload (N=2 dominant, N≤11 typical) the tick is ~128–152 ns and the S1 search delta is
~0–4 ns of it — zero-to-negative at the dominant case; S2 has no multi-active-frame bench and
is downstream of the carrier SoA; S3 saves microseconds at a 1000 ms debounce while
threatening the FC-2 determinism lock. The one real fold is the **broken bench import**
(SHIP-in-F) — the very instrument the measure-first posture depends on. The FrameCompiler is
otherwise at the industry frontier for its scale; manufacture no SoA/incremental work here.
