# Tranche F deep-SOTA audit — lane `p-compile-perf-F`

**Lane mandate.** COMPILE-time perf deep — the `FrameCompiler` `parse()` whole-program
compile. E.W8 landed the deterministic content-derived `frameId` (S4) and the editor
**single**-compile (S0, the demo double→single fold); the incremental `updateSegments`
(S3) + the SoA layout (S1/S2) stayed **withheld**. With a **shaped compile bench (the
editing-session profile)**, does F land the incremental path + the SoA layout, or stay
withheld? The honest measure-first disposition + the bench design. **Audit only — ZERO
source edits.** inv-16: any value.js change is a hand-off; this lane writes only this doc.

**Disposition legend.** SHIP-in-F · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## TL;DR

| Item | F disposition | The one number that decides it |
|---|---|---|
| **S3** incremental `updateSegments` (the editor workload) | **BOOK (re-confirmed, now with the COMPILE denominator)** | whole-program re-`parse()` of an **80-stop** animation = **~393 µs = 0.039 % of the editor's 1000 ms debounce window**. At the real N≤20 it is **~8–97 µs**. There is nothing to amortize. |
| **S1** typed time index (`Float64Array` starts/stops) | **RECORD (defer to the runtime lanes — not a compile concern)** | it is a *runtime-tick* item (~4 ns of a 128–168 ns tick, per the two sibling lanes); it does **not** appear in the compile profile at all. |
| **S2** slot map (per-tick `Object.assign`) | **RECORD (runtime item; downstream of the carrier lane)** | likewise a runtime-tick item; sequenced behind `r-interpolation-carrier`. |
| **The compile bench itself** | **SHIP-in-F (the editing-session profile bench)** | the repo has a runtime `interpolation.bench.ts` + a cold `parser.bench.ts` but **NO warm re-`parse()` / editing-session compile bench** — and both are broken (F-5). This lane designs it and ran it ad-hoc. |
| **The compile pipeline shape** | **ALREADY-SOTA** | whole-program `parse()` at ≤20 stops is the right shape; the editor's single-compile (S0) made the irreducible cost a single sub-100-µs pass per settled second. |

**Net: F lands NONE of S1/S2/S3.** The W8 withhold HOLDS — and this lane is the one that
measured the thing the mandate names (the **compile**, not the runtime tick), against the
**editing-session cadence** the FOCUS asks about. The compile is invisible at the editor's
1000 ms debounce by **four orders of magnitude**, even at stop counts 4× the demo's
deepest preset. The only fold is the **bench instrument** (a warm/editing-session compile
bench — SHIP-in-F, harness-only).

---

## §0 — Relation to the sibling lanes (cite + diff, do NOT repeat)

Two other F lanes share the FrameCompiler surface. I cite their conclusions and **add the
one measurement neither produced** — the *compile* cost.

- **`r-frame-compile-sota.md`** re-measured the **runtime** typed-time-index search in an
  isolated `/tmp` microbench (its §A: N=2 wash, N≥11 ~17–21 %) and read the editor
  workload (debounce 1000 ms). It explicitly flagged the gap: *"This isolates the search;
  it does not run the full `interpFrames` tick … The full-tick re-measure should be done
  once §5's bench fix lands"* (`r-frame-compile-sota.md:382-387`). It dispositioned S1 →
  RECORD, S3 → BOOK, S2 → MEASURE-FIRST+BOOK.
- **`a-framecompiler-remeasure.md`** closed that gap on the *runtime* side — it drove the
  real `interpFrames` tick (~128 ns at N=2 → ~168 ns at N=200) and re-confirmed S1 →
  RECORD, S2 → BOOK, S3 → BOOK.

**Both lanes measured the RUNTIME TICK (the `interpFrames` sampling loop). Neither measured
the COMPILE (`parse()` — flatten + reconcile + sort + finalize).** They both *assert*
"a full compile … is sub-100 µs" (`a-framecompiler-remeasure.md:201`,
`r-frame-compile-sota.md:203`) **without measuring it**. The FOCUS for *this* lane is
precisely the compile and the editing-session profile — so the net-new contribution here
is **the compile measurement that grounds that sub-100 µs claim** (and refines it: it holds
for N≤11, and the editor stays invisible even where it does *not* hold, at N=20+). I do not
re-run their runtime-tick benches; I cite them and own the compile axis.

The runtime SoA carrier (the `iv` lerp over `Float64Array`) is owned by
`r-interpolation-carrier.md` (its measured ~2.0–2.3× flat-array win → **value.js-HANDOFF**,
re-scoping E Wave D); S1/S2 ride that, not the compile. **No double-count.**

---

## §1 — What E LANDED (verify, do not re-open)

The live `frame-compiler.ts` confirms the E.W8 folds the mandate names:

- **S0 — the editor double→single compile — LANDED.** Each of the four editor mutation ops
  now compiles **once**: the string-edit op builds ONE throwaway `fromKeyframes` and
  *transplants* its compiled state (`animation.compiler = compiled.compiler`) onto the live
  animation rather than re-`parse()`ing a second time (`useKeyframeOps.ts:102-109`); the
  single-keyframe edit mutates one template's `vars` then `parse()`s once
  (`useKeyframeOps.ts:132-141`); add/remove mutate the live templates and `parse()` once
  (`useKeyframeOps.ts:179-183`, `:206-209`). The old "double whole-program compile per
  keystroke-batch" (the E `d-framecompiler.md` D-2 finding) is gone. **Verified.**
- **S4 — content-derived deterministic `frameId` — LANDED.** `createFrame` derives
  `id = startIx * FRAME_ID_SCALE + endIx` (`frame-compiler.ts:213`, `FRAME_ID_SCALE =
  1_000_000` at `:84`), keyed on the stable `(startIx, stopIx)` pair, not a monotonic
  counter. `compile-deterministic.test.ts:22-44` locks **byte-identical `frames[]` across
  three re-parses, ids included**, with the documented bite (revert to `this.frameId++` →
  ids drift). `parse()` is idempotent. **Verified.**
- **D-1 (the index-space conflation) — LANDED.** `createFrame`'s transform/timing inherit
  seeks now walk `this.templateFrames` (`frame-compiler.ts:190-205`), not the half-built
  `this.frames`, with the comment at `:179-186` explaining the template-vs-segment index
  space. **Verified.**
- **FC-1 (colorSpace re-normalize) — LANDED.** `renormalizeColors()`
  (`frame-compiler.ts:387-401`) re-derives the color carriers in place after a
  `setColorSpace`/`setHueMethod` on compiled frames, no re-flatten/re-sort. **Verified.**

These are CLOSED. My subject is the W8 **S1/S2/S3** that stayed withheld, against the
compile axis.

---

## §2 — The shaped compile bench (the editing-session profile) — the net-new measurement

### What was missing

The repo's benches do not cover the compile-at-the-editor-cadence workload, and they are
broken:
- `bench/interpolation.bench.ts` measures the **runtime** `interpFrames` tick (not compile).
- `bench/parser.bench.ts` measures a **cold** `fromString` (parse-cache miss, one shot) —
  not the *warm, repeated* re-`parse()` an editing session generates.
- Both `import { CSSKeyframesAnimation } from "../src/animation"` — the barrel that E made
  lazy (`loadAnimationEngine()`), so the static named import resolves `undefined` →
  `TypeError: CSSKeyframesAnimation is not a constructor` (the sibling lanes' **F-5**,
  `r-frame-compile-sota.md:308-330`). The fix is the one-line import from
  `../src/animation/engine` — exactly what the demo ops do (`useKeyframeOps.ts:2`).

So **no bench measures the thing the FOCUS asks about**. I built the editing-session
profile ad-hoc (importing from `engine.ts` directly — the F-5 workaround), node v26 / V8.
The shaped profile and its three workloads:

1. **`fromString` warm** — the full editor path (CSS parse → flatten → reconcile → sort →
   finalize), `tryParseCache` hot (the steady cadence: the same values re-compiled).
2. **`re-parse()` only** — the single-keyframe-edit op path (`useKeyframeOps.ts:141`): the
   templates already exist; only `parse()` re-runs (no value.js CSS *grammar* parse).
3. **color compile** — the `createInterpVarValue` → `normalizeValueUnits` →
   `prepareInterpVar` path, the heaviest per-segment compile work.

### The measurement (µs per whole-program compile)

| N stops (shape) | `fromString` warm | `re-parse()` only | with color |
|---|---|---|---|
| **2** (dominant preset — `animations.ts`) | **11.6 µs** | 7.8–8.4 µs | 13.7 µs |
| **6** (deepest AnimationMenuBar preset) | 37.8 µs | 27.6–29.6 µs | — |
| **11** (the project's "complex" probe — `interpolation.bench.ts:16`) | 69.1 µs | 51.9–56.5 µs | 93.6 µs |
| **20** (an editor-heavy hand-built animation) | 129.7 µs | 96.6–101.1 µs | — |
| 40 (pathological) | — | ~194–199 µs | — |
| 80 (pathological) | — | ~393–406 µs | — |

(node v26 / V8; warm cache; 20–50 k iters/case after a 2 k-iter warm-up. The temp bench
file was removed after the run — **no repo change**. Re-runnable via §A.)

### What this refines vs the sibling lanes' assertion

The sibling lanes asserted "sub-100 µs" without a number. The measurement says:
- **It holds at the demo's real scale (N≤11): 8–69 µs.** The "sub-100 µs" claim is true and
  now grounded.
- **It does NOT hold at N=20 (`re-parse` ~97–101 µs, `fromString` ~130 µs).** A
  hand-authored 20-stop animation *crosses* 100 µs on the `fromString` path. The sibling
  lanes' round-number claim was directionally right but imprecise at the top of the editor's
  plausible range — the honest figure is **~6 µs/stop amortized** on the warm `fromString`
  path, ~5 µs/stop on `re-parse`.
- **The scaling is ~linear, not the O(F²) worst case.** The `reconcileVars` frame-existence
  `findIndex` (`frame-compiler.ts:281-283`, the residual FC-5) and the per-`ix`
  `Object.keys` re-walk are O(F²)-capable, but at these stop counts with mostly-adjacent
  vars the linear `createFrame` loop + the parse/normalize per-segment cost dominate, so the
  measured curve is ~linear (52 → 97 → 199 → 406 µs across N=11/20/40/80 ≈ doubling with N).
  **The FC-5 findIndex is not the compile bottleneck at any real N** — it stays a cohesion
  nit (BOOK), not a perf fold.

---

## §3 — S3 incremental `updateSegments` — the editor cadence kills it (BOOK, re-confirmed)

The FOCUS ties S3 to *"the editing-session profile."* The session profile is the proof, and
it is decisive: **the compile is invisible against the editor's debounce by four orders of
magnitude.**

### The headroom calculation (the load-bearing number)

Both heavy editor ops are `debounce(fn, 1000)` (`useKeyframeOps.ts:71→119-120` and
`:122→150-151`) — at most **one compile per second of settled input**. Against that 1000 ms
window:

| N stops | whole-program re-`parse()` | % of the 1000 ms debounce window |
|---|---|---|
| 11 (complex probe) | 52.0 µs | **0.0052 %** |
| 20 (editor-heavy) | 96.7 µs | **0.0097 %** |
| 40 (pathological) | 193.9 µs | **0.0194 %** |
| 80 (pathological) | 393.2 µs | **0.0393 %** |

Even an **80-stop** animation — 13× the demo's deepest preset, larger than any hand-authored
keyframe set in the repo — re-compiles in **0.039 %** of the debounce window. And that
single compile is bracketed by the things that actually cost: a `yieldToMain()` between the
CSS parse and the compile (`useKeyframeOps.ts:91`), the Monaco re-render, and the `formatCSS`
round-trip (`useKeyframeOps.ts:154`) — each of which dwarfs the µs-scale compile.

### What incremental would buy, and what it would cost

- **Buy:** an `updateSegments(touchedKeyframeIx)` that re-`parseAndFlattenObject`s only the
  touched template and re-`createInterpVarValue`s only the incident segments (the
  `(prev→k)`/`(k→next)` pairs + any reconciled non-adjacent segment ending/starting at `k`)
  — the direct port of `NumericAnimation.updateKeyframe`'s 1–2-adjacent-segment recompute
  (`numeric.ts:186-205`, the ALREADY-SOTA in-tree template). At N=20 it would replace a
  ~97 µs whole compile with a ~2-segment recompute — **a ~90 µs saving, at a 1 Hz cadence,
  inside a window where 97 µs is already 0.0097 %.** Unmeasurable to a user.
- **Cost:** a dirty-segment state machine that must produce `frames[]` **byte-identical** to
  the whole-program path — i.e. it must *keep satisfying* the `compile-deterministic.test.ts`
  contract E just locked (§1), **plus** a new `proof:compile-incremental` byte-equality gate
  (E FINAL already names this as the future fold's obligation, `E/FINAL.md:48-49`). The
  incremental path has to reconcile across non-adjacent vars correctly (the same
  `varIndex`/`reconcileVars` logic, `frame-compiler.ts:234-302`) and re-derive exactly the
  segments a whole compile would — a genuinely risk-bearing machine to save microseconds at
  1 Hz.

This is the textbook *measure-first reject*: SOTA incremental computation (salsa, rustc's
red-green query model, lightningcss per-rule independence, fine-grained reactivity) earns
its complexity at **thousands** of nodes where whole-program recompute is *perceptible*. The
FrameCompiler's unit is ≤~20 stops and whole-program `parse()` is **0.01 %** of the editor's
own debounce — the scale is three to four orders of magnitude below where the discipline
pays.

### The honest revisit trigger (named, so it is not a perpetual punt)

S3 lands the moment a **measured frame-by-frame builder workload** appears — a consumer
calling `addFrame().parse()` in a tight loop (O(F²) whole-program rebuild to construct a
timeline incrementally), or a generated **high-stop scroll-bound timeline** re-compiled per
scroll-frame rather than per-settled-second. **Neither the demo nor any public-API usage
exhibits it** (the public `addFrame`/`parse` are chainable, but every `from*` path
batch-adds then `parse()`s once — `engine.ts`; the editor debounces). The dirty-segment
design + the `proof:compile-incremental` byte-equality contract are recorded below so the
fold is not reinvented.

**Disposition: BOOK.** Record the design; build only on a measured builder/scroll workload.
**Not a fold for F.**

---

## §4 — S1 / S2 are RUNTIME items, not compile items (RECORD, defer)

The mandate lists S1 (typed time index) and S2 (slot map) under "the SoA layout" alongside
S3, but the compile profile is the honest disambiguator: **neither S1 nor S2 appears in the
compile cost** — they are both *runtime-tick* concerns the two sibling lanes own.

- **S1 (typed `Float64Array` starts/stops)** changes how `interpFrames`'s
  `binarySearchRange` reads `f.time.start`/`f.time.stop` per tick (`engine.ts:579-584`).
  Building the parallel arrays at compile is trivial (one `Float64Array.from` over `frames`
  — sub-µs at any N); the question is entirely the **runtime** search delta, which
  `a-framecompiler-remeasure.md` measured at ~4 ns of a 128–168 ns tick (~2.6 % at N=11,
  *negative* at N=2). It does not move the compile and it does not move the tick. **RECORD —
  defer to the runtime lanes; the compile cost of *adding* the index is negligible, so there
  is no compile-side reason to land or withhold it. The decision is purely runtime, already
  made (RECORD).**
- **S2 (slot map vs per-tick `Object.assign`)** is the per-active-frame output merge
  (`engine.ts:636`) — a **runtime** copy, gated on a multi-active-frame workload no bench
  exercises, and its clean form rides the `r-interpolation-carrier` SoA (the slot-map shape
  is `numeric.ts:8-15,175-181`). It has **no compile cost** to weigh. **RECORD — owned by the
  carrier + FrameCompiler-remeasure lanes; not a compile-axis fold.**

This lane's contribution to S1/S2 is the clarification that **they are mislabeled as
compile-layout items** — they are runtime-layout items. The *compile* never touches them
except to build a trivial typed array. There is no compile-perf case to make for either.

---

## §5 — The compile pipeline is ALREADY-SOTA (manufacture no work)

The compile measurement confirms the pipeline shape is right for its scale:

- **The editor single-compile (S0) made the irreducible cost one pass.** Pre-E the editor
  paid two whole-program compiles per settled edit; post-E it pays one (§1). At N≤11 that is
  8–69 µs once per second — the cost was halved *and* is already invisible. The biggest
  available compile win was the double→single fold, and **E already took it.**
- **Compile-once pre-flatten** — `finalizeFrameVars` builds `flatVars`/`allInterpVars` once
  at compile (`frame-compiler.ts:360-371`), so the rAF loop walks a flat array with the lerp
  dispatch pre-resolved. The compile does the shape work; the tick does none.
- **`tryParseCache` warm path** — the per-value parse is memoized
  (`utils.ts:203,241-243,267`); the warm `fromString` (11.6 µs N=2) vs a fully-cold parse is
  the cache earning its keep. The cache is unbounded (the standing FC-6 / handoff F3 nit),
  but at the editor's small working set it never evicts; **bounding it is the value.js LRU
  handoff (F3), not a compile-structure fold** (see §6).
- **Monomorphic frame mint + content-derived idempotent ids + targeted color re-normalize**
  — `createFrame` is one shape (`frame-compiler.ts:215-226`); the id is content-derived
  (S4); `renormalizeColors` is the cheap re-derive (FC-1). All landed in E.
- **The D.W4 clock-free split** — a pure value-in→frames-out compiler
  (`frame-compiler.ts:1-13`), unit-testable without a loop.

The mandate's "SoA layout" framing is answered honestly: **there is no compile-side SoA
work that pays.** The SoA that *does* pay (the runtime carrier, ~2×) is value.js-owned and
owned by the carrier lane. The FrameCompiler's compile is at the frontier for its scale.

**Disposition: ALREADY-SOTA.**

---

## §6 — The one fold F should make: the editing-session compile bench (SHIP-in-F)

The instrument the whole measure-first posture leans on does not exist *and* is broken:

- The two existing benches don't cover the editing-session compile (cold one-shot parse +
  runtime tick only), and both fail to import the constructor (F-5, §2).
- The shaped editing-session profile (§2) — **warm `fromString` + warm `re-parse()` at
  N ∈ {2, 6, 11, 20}, plus the color path** — is the bench that makes the S3 withhold
  *measured rather than asserted*. It is what let this lane state "0.0097 % of the debounce
  window" instead of "sub-100 µs, trust me."

**Disposition: SHIP-in-F (harness-only).** Add `bench/compile.bench.ts` (the editing-session
profile) importing from `src/animation/engine`, and fix the F-5 import in the two existing
benches (one line each). Isomorphic — no engine change, unblocks `npm run bench` for the
compile path. This straddles the bench/runtime surface and overlaps the sibling lanes' F-5
SHIP-in-F call (`r-frame-compile-sota.md:308-330`, `a-framecompiler-remeasure.md:222-245`);
**it is one fold, not three — F should land it once, and this lane contributes the
editing-session bench *design* (the warm re-`parse()` shape + the debounce-headroom
assertion) the F-5 fix alone does not provide.** (Out of *this* audit lane's write scope —
recorded, not written; the temp bench was removed after measuring.)

### The bench design (record, so F lands it as designed)

```ts
// bench/compile.bench.ts — the editing-session compile profile.
// FIX the F-5 import: from "../src/animation/engine" (not the lazy barrel).
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

const makeCSS = (N: number, withColor = false) =>
    Array.from({ length: N }, (_, i) => {
        const pct = Math.round((i / (N - 1)) * 100);
        const color = withColor ? `; color: rgb(${i * 10}, ${255 - i * 10}, 128)` : "";
        return `${pct}% { opacity: ${(i / (N - 1)).toFixed(3)}; transform: translateX(${i * 20}px)${color}; }`;
    }).join("\n");

// (a) WARM fromString — the steady editor cadence (tryParseCache hot).
describe("compile: fromString warm (editing-session)", () => {
    for (const N of [2, 6, 11, 20]) {
        const css = makeCSS(N);
        bench(`N=${N}`, () => { new CSSKeyframesAnimation({ duration: 1000 }).fromString(css); });
    }
});

// (b) re-parse() only — the single-keyframe-edit op path (useKeyframeOps.ts:141).
describe("compile: re-parse() (single-keyframe edit)", () => {
    for (const N of [2, 6, 11, 20]) {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(makeCSS(N));
        bench(`N=${N}`, () => { anim.parse(); });
    }
});

// (c) color compile — createInterpVarValue normalize-heavy.
describe("compile: color (normalize-heavy)", () => {
    for (const N of [2, 11]) {
        const css = makeCSS(N, true);
        bench(`N=${N}`, () => { new CSSKeyframesAnimation({ duration: 1000 }).fromString(css); });
    }
});
```

The assertion that matters is not a hard regression threshold (compile is not on a
frame budget) but the **debounce-headroom invariant**: the slowest realistic compile
(N=20, ~100 µs) is < 0.1 % of the editor's 1000 ms debounce — the measured proof that S3 is
correctly withheld. Record it as a comment, not a failing gate (a compile-perf regression
gate would be narration here — there is no user-visible budget to bite).

---

## §A — the re-runnable compile bench (the editing-session profile)

`npx tsx <file>` (node v26 / V8). Imports from `engine.ts` directly (the F-5 workaround).
Reproduces §2 and §3's tables.

```js
import { CSSKeyframesAnimation } from "<abs>/src/animation/engine.ts";

function compileBench(label, build, iters) {
  for (let i = 0; i < 2000; i++) build();                       // warm
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < iters; i++) build();
  const ns = Number(process.hrtime.bigint() - t0) / iters;
  console.log(`${label.padEnd(40)} ${(ns / 1000).toFixed(2)} µs/compile`);
}
const makeCSS = (N) => Array.from({ length: N }, (_, i) => {
  const pct = Math.round((i / (N - 1)) * 100);
  return `${pct}% { opacity: ${(i/(N-1)).toFixed(3)}; transform: translateX(${i*20}px); }`;
}).join("\n");

for (const N of [2, 6, 11, 20]) {                                // warm fromString
  const css = makeCSS(N);
  compileBench(`fromString N=${N}`, () => new CSSKeyframesAnimation({ duration: 1000 }).fromString(css), 50000);
}
for (const N of [2, 6, 11, 20, 40, 80]) {                        // re-parse() only
  const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(makeCSS(N));
  compileBench(`re-parse() N=${N}`, () => anim.parse(), N > 40 ? 10000 : 50000);
}
// headroom: re-parse() µs as a fraction of the 1000ms editor debounce
```

**Caveat (honest).** This is node/V8, not the browser's main thread; the absolute µs in a
real browser under Monaco + Vue reactivity will be higher (more GC pressure, a colder cache,
the `yieldToMain` task split). But the *ratio* — compile vs the 1000 ms debounce — only gets
**more** favorable to the withhold under that reality: the debounce window is fixed at
1000 ms and the bracketing Monaco/format work grows, so the compile's share shrinks further.
The conclusion (S3 withheld) is robust to the environment.

---

## Summary table

| ID | Finding | Disposition | Where |
|----|---------|-------------|-------|
| S3 | Incremental `updateSegments`: whole-program re-`parse()` is **0.0052 %–0.039 % of the editor's 1000 ms debounce** at N=11–80; saving ~2-segment recompute at 1 Hz vs the `compile-deterministic` byte-lock + a new `proof:compile-incremental` gate | **BOOK** (record design + byte-equality contract; build only on a measured builder/scroll workload — none exists) | `useKeyframeOps.ts:71,119-151,179-209`; `frame-compiler.ts:234-302`; `numeric.ts:186-205`; `compile-deterministic.test.ts` |
| S1 | Typed time index: a **runtime-tick** item (~4 ns of a 128–168 ns tick per the sibling lanes), NOT a compile item; building the index at compile is sub-µs | **RECORD** (mislabeled as compile-layout; defer to the runtime lanes) | `engine.ts:579-584`; `binarySearch.ts:21-37`; `a-framecompiler-remeasure.md §1` |
| S2 | Slot map: a **runtime** per-tick `Object.assign` copy gated on multi-active frames; no compile cost; rides the carrier SoA | **RECORD** (owned by carrier + remeasure lanes; not a compile fold) | `engine.ts:636`; `numeric.ts:8-15,175-181`; `r-interpolation-carrier.md` |
| — | **The editing-session compile bench** — warm `fromString` + warm `re-parse()` + debounce-headroom invariant; the instrument that makes S3 *measured* not asserted; the two existing benches are broken (F-5) | **SHIP-in-F** (harness-only; design recorded §6) | `bench/interpolation.bench.ts:2`, `bench/parser.bench.ts:2`; fix = `../src/animation/engine` |
| FC-5 | `reconcileVars` frame-existence `findIndex` + per-`ix` `Object.keys` re-walk (O(F²)-capable) — measured **NOT** the bottleneck (compile is ~linear at all real N) | **BOOK** (cohesion nit, fold opportunistically; not a perf fold) | `frame-compiler.ts:263-283,234-247` |
| — | Compile pipeline (single-compile S0, compile-once pre-flatten, warm `tryParseCache`, monomorphic mint, idempotent ids, targeted re-normalize, clock-free split) | **ALREADY-SOTA** | `frame-compiler.ts:1-13,215-226,360-371,387-401`; `useKeyframeOps.ts:102-109` |

**value.js hand-off.** **None originates in this lane.** The adjacent unbounded-cache item
(`tryParseCache` bound + the value.js memo LRU) is the standing handoff **F3**
(`E/valuejs-sota-handoff.md:288`) — at the editor's small warm working set it never evicts,
so it is a robustness bound, not a compile-perf fold; not re-proposed here.

**Net.** F lands **none** of S1/S2/S3. This lane is the one that measured the *compile* the
FOCUS names (the two sibling lanes measured the runtime tick and asserted "sub-100 µs"
without a number) — and at the **editing-session cadence** the answer is unambiguous:
whole-program `parse()` is **8–130 µs at the real N≤20, scaling ~linearly, and four orders
of magnitude below the editor's own 1000 ms debounce even at a pathological 80 stops.** There
is nothing to amortize; incremental `updateSegments` would trade the E byte-determinism lock
for a dirty-state machine to save microseconds at 1 Hz. S1/S2 are runtime-layout items
mislabeled as compile-layout — their compile cost is nil. The FrameCompiler's compile is
ALREADY-SOTA: the biggest available win (the editor double→single compile) E already took.
The one fold is the **editing-session compile bench** (SHIP-in-F, harness-only) — the
instrument that turns this lane's withhold from an assertion into a measurement.
