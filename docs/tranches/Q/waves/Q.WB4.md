# Q.WB4 — WAAPI curvature-adaptive sub-segment densify: replace the fixed `WAAPI_SUBSEGMENT_STOPS=8` with a curvature-driven stop count (dense where the rAF curve bends, sparse where it is near-linear)

**Band:** B — Engine-perf + emerging-CSS Phase-2 · the WAAPI fidelity frontier.
**Phase:** **NOW** — fully kf-internal, zero sibling dependency, executable on authorization. The densify lives entirely in `waapi.ts:toWAAPIKeyframes` (a kf-owned emit); no value.js/parse-that/glass-ui edge.
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile ─► Q.WB4`. Independent of Q.WB1/WB2 (compile-time lowering) and Q.WB3 (the rAF-path interp substrate). Touches ONLY the WAAPI keyframe-build emit — orthogonal to every other Band-B seam.
**Owning-DM-or-idea:** `B5-kf-engine-arch` Q.W-ENG7 (WAAPI curvature-adaptive sub-segment densify — replace the fixed `WAAPI_SUBSEGMENT_STOPS=8` with a curvature-driven stop count) + the finding "WAAPI eligibility is conservative-correct but leaves a measured perf opportunity on the table." The owner directive: **architectural transpositions for elegance/simplicity/performance are DESIRABLE** — a fixed uniform densify is a blunt instrument; the curvature-adaptive emit is the precise one (the `springLinearStops` adaptive-emit precedent generalized).

---

## Context

### The breach — a FIXED uniform densify over-samples linear segments and may under-sample sharp bends

`toWAAPIKeyframes` (`waapi.ts:260`) densifies the WAAPI keyframe set so the compositor's piecewise-LINEAR fill tracks the true rAF curve (which BENDS mid-segment for a multi-component or unit-converted transform with a non-linear per-segment easing). The current densify is FIXED and UNIFORM (`waapi.ts:249-290`):

```js
const WAAPI_SUBSEGMENT_STOPS = 8;                                  // waapi.ts:249
// …between each pair of consecutive boundaries:
for (let s = 1; s <= WAAPI_SUBSEGMENT_STOPS; s++) {               // waapi.ts:286
    sampleTimes.add(a + (span * s) / (WAAPI_SUBSEGMENT_STOPS + 1));
}
```

This emits EXACTLY 8 interior stops per segment regardless of how the curve behaves there. Two costs:

1. **Over-sampling near-linear segments** — a `linear`/near-linear segment needs ZERO interior stops (the WAAPI piecewise-linear fill already matches it exactly); 8 stops there are pure keyframe-set bloat (the compositor handles a larger keyframe array, the `interpFrames` sampler runs 8 needless evals per segment at build time).
2. **Potentially under-sampling sharp bends** — a segment whose easing bends sharply (a `cubic-bezier` with a steep inflection, a spring `linear()` twin's overshoot, a `vh`→`px` unit conversion with a non-linear DOM resolution) may need MORE than 8 stops to keep the piecewise-linear fill within a perceptual tolerance of the true curve. A fixed 8 is a guess, not a tolerance.

The comment already names the gap (`waapi.ts:245-247`): "BOUNDED: a fixed, conservative count keeps the keyframe set small … Strictly fidelity-improving" — fixed-and-conservative is honest, but it is a blunt instrument where a curvature-driven count is the precise one.

### The cure — sample where the curve BENDS (the adaptive-densify, the `springLinearStops` precedent)

The densify should spend stops where the rAF curve actually bends and none where it is linear. The curvature-adaptive emit (per segment, between boundaries `a` and `b`):

- **Probe the segment's curvature** — the second difference of the eased curve is the discrete curvature signal. Sample the segment's easing `fn` at a few probe points; the magnitude of the second difference (`|f(t-h) - 2f(t) + f(t+h)|`) at each probe is the local bend. A near-zero second difference everywhere → a (near-)linear segment → ZERO interior stops. A large second difference → place stops DENSE around the bend.
- **Recursive midpoint subdivision (the de-Casteljau-style adaptive sampler)** — subdivide a segment ONLY where the chord-to-curve error (the gap between the piecewise-linear fill and the true `interpFrames` sample at the midpoint) exceeds a perceptual tolerance `WAAPI_CHORD_TOLERANCE`; recurse into the halves that still exceed it, stop where the chord matches. The stop COUNT is then a FUNCTION of the curve, bounded by a `WAAPI_MAX_SUBSEGMENT_STOPS` ceiling (so a pathological easing cannot emit unbounded keyframes).
- **The result is `≤` the fixed-8 count on every realistic curve** AND a tighter fill on the sharp ones: a linear segment drops from 8 stops to 0; a gently-bending segment drops to 2–3; only a sharply-bending segment approaches (and is capped at) the ceiling. The keyframe set SHRINKS on the common case and TIGHTENS on the hard case — strictly better than the fixed uniform emit.

This is the SAME idiom `springLinearStops` proves (its adaptive stop emit over the spring curve) — the densify is curve-aware, not count-fixed.

### The fidelity guard — the emit must never REGRESS the fill (the falsification anchor)

The adaptive densify is born-RED-guarded against producing a WORSE fill than the fixed-8 emit. The chord-to-curve error of the adaptive emit must be `≤` the fixed-8 emit's error on every segment of a curvature corpus (a `cubic-bezier` inflection, a spring `linear()` overshoot, a `vh`-unit-converted transform, a `linear` baseline). And the boundary endpoints are UNCHANGED (the adaptive emit only redistributes the INTERIOR stops — the start/stop of every segment is always emitted, exactly as today). The emit stays "strictly fidelity-improving" — now provably, not by a fixed-count assertion.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| fixed-stop-const | `src/animation/waapi.ts:249` | `const WAAPI_SUBSEGMENT_STOPS = 8` — the FIXED uniform interior-stop count |
| uniform-emit | `src/animation/waapi.ts:280-290` | the densify loop emits EXACTLY 8 evenly-spaced interior stops per segment, curve-agnostic |
| densify-rationale | `src/animation/waapi.ts:238-247` | the comment names the gap: "a multi-component or unit-converted transform whose true rAF curve BENDS mid-segment would drift … BOUNDED: a fixed, conservative count" |
| true-curve-sampler | `src/animation/waapi.ts:292-293` | `animation.interpFrames(t, false)` — the true rAF curve sampler the adaptive subdivision probes (already the densify's per-stop eval) |
| springLinearStops-precedent | `src/animation/springLinearStops.ts` | the adaptive stop-emit over the spring curve — the curve-aware densify idiom this wave generalizes |
| boundary-preserved | `src/animation/waapi.ts:266-272` | every frame boundary (`time.start`/`time.stop`) is always in `timePoints` — the adaptive emit redistributes ONLY the interior, never drops a boundary |
| no-sibling-edge | `src/animation/waapi.ts` (whole module) | the densify is kf-owned emit — no value.js/parse-that/glass-ui edge (NOW phase, in-realm) |

---

## Scope

Each S-clause is concrete + falsifiable. The densify is a curvature-driven stop count over the EXISTING `interpFrames` sampler — no new module, no new value.js edge.

- **S1 — the measure-first decision (the keyframe-count + fidelity baseline).** Bench the fixed-8 emit vs the curvature-adaptive emit over a curvature corpus (`cubic-bezier` inflection, spring `linear()` overshoot, `vh`-unit transform, `linear` baseline): record the per-curve interior-stop COUNT + the chord-to-curve ERROR for both. Records the verdict in `scripts/waapi-densify-decision.json` (the P-inv-28 durable home).
- **S2 — the curvature-adaptive emit (gated on S1 ADOPT).** Replace the fixed loop with recursive midpoint subdivision: subdivide a segment ONLY where the chord-to-curve error exceeds `WAAPI_CHORD_TOLERANCE`, capped at `WAAPI_MAX_SUBSEGMENT_STOPS`. A near-linear segment emits 0 interior stops; a sharply-bending one approaches (and caps at) the ceiling. Boundaries unchanged.
- **S3 — the born-RED gate (the REAL observable: fidelity + count, not a grep).** `proof:waapi-adaptive-densify` — a same-report assertion that the adaptive emit produces (a) `≤` the fixed-8 stop count on the linear/gentle curves AND (b) a chord-to-curve error `≤` the fixed-8 emit on EVERY curve (never a fidelity regression) AND (c) every boundary preserved.

---

### S1 — the measure-first decision (keyframe-count + fidelity baseline)

**Breach.** The fixed-8 densify has never been MEASURED against a curvature-adaptive alternative — the "8 is conservative" claim (`waapi.ts:245`) is a guess, not a measured tolerance. There is no decision home for "does the adaptive emit actually shrink the count without regressing fidelity?"

**Cure.** Author `bench/waapi-densify.bench.ts` measuring, over a curvature corpus, BOTH emits:
- the FIXED-8 emit (the current `toWAAPIKeyframes` densify);
- the curvature-adaptive emit (the S2 candidate);

for each curve recording (1) the interior-stop COUNT and (2) the chord-to-curve ERROR (the max gap between the piecewise-linear fill of the emitted stops and the true `interpFrames` curve, sampled at a fine grid). The corpus: a `cubic-bezier(.9,0,.1,1)` sharp-inflection, a spring `linear()` overshoot twin, a `vh`→`px` unit-converted transform (the DOM-resolution non-linearity), and a `linear` baseline (the zero-interior-stop case). Records the verdict in `scripts/waapi-densify-decision.json` (the durable-verdict shape) with a `$comment` scoping the metric to "interior-stop count + chord-to-curve error over the curvature corpus."

**Gate bite.** `proof:waapi-adaptive-densify` `measured-first` clause: `waapi-densify-decision.json` exists, records both emits' count + error per curve. BITE: a decision-JSON that asserts the adaptive emit is better WITHOUT a recorded chord-error comparison (a count-only claim, ignoring fidelity) → the error-recorded assertion reds.

---

### S2 — the curvature-adaptive emit (gated on S1 ADOPT)

**Breach.** `toWAAPIKeyframes` (`waapi.ts:280-290`) emits a FIXED 8 interior stops per segment regardless of curvature — over-sampling linear segments (keyframe bloat) and possibly under-sampling sharp bends (fidelity gap).

**Cure (IF chartered).** Replace the fixed loop with recursive midpoint subdivision over each segment `[a, b]`:
1. Sample the true curve at `a`, `m = (a+b)/2`, `b` via `interpFrames` (the EXISTING sampler at `waapi.ts:293`).
2. Compute the chord-to-curve error at `m`: the gap between the linear interpolation of `(a, b)` and the true sample at `m` (per animated channel — the max over channels).
3. If the error `> WAAPI_CHORD_TOLERANCE` AND the recursion depth `< WAAPI_MAX_SUBSEGMENT_STOPS`-derived ceiling: emit `m` as an interior stop and recurse into `[a, m]` and `[m, b]`. Else stop (the chord matches the curve within tolerance — no interior stop needed here).
4. A near-linear segment short-circuits at step 3 (the chord matches at the midpoint) → ZERO interior stops. A sharply-bending one recurses until the chord matches or the ceiling caps it.

`WAAPI_CHORD_TOLERANCE` is a perceptual tolerance (a fraction of the animated range — e.g. 0.5% of the segment's value span, the sub-pixel-fidelity threshold); `WAAPI_MAX_SUBSEGMENT_STOPS` (e.g. 16, double the old fixed 8) caps a pathological easing so the emit is always bounded. The boundary endpoints are ALWAYS emitted (unchanged — the adaptive emit redistributes ONLY the interior).

**Constraint (observable-truth — never a fidelity regression; KISS).** The transposition changes the STOP DISTRIBUTION (fixed-uniform → curvature-adaptive), never the boundary endpoints and never a WORSE fill. The chord-to-curve error of the adaptive emit must be `≤` the fixed-8 emit on EVERY corpus curve (the fidelity guard). KISS: the subdivision reuses the EXISTING `interpFrames` sampler (`waapi.ts:293`) — no new curve evaluator; just a recursive split over the sampler the densify already calls.

**Gate bite.** `proof:waapi-adaptive-densify` `count-shrinks` clause: the adaptive emit's interior-stop count is `≤` the fixed-8 count on the `linear` + gentle-`cubic-bezier` curves (and `0` on the `linear` baseline). BITE: an adaptive emit that still emits 8 stops on a `linear` segment (the curvature probe mis-wired) → the count-shrinks assertion reds.

---

### S3 — the born-RED gate (`proof:waapi-adaptive-densify`)

**Breach.** No gate covers the densify emit at all (`ls scripts/proof-waapi*` → no file). The fidelity claim ("strictly fidelity-improving," `waapi.ts:247`) is un-witnessed — there is no oracle that the emit tracks the rAF curve, fixed OR adaptive.

**Cure.** Author `scripts/proof-waapi-adaptive-densify.mjs` over `bench/waapi-densify.bench.ts` + a behaviour assertion (the gate-blindspot lesson: the REAL observable is the emitted keyframe set's fidelity to the rAF curve, not a source grep):
1. **count-shrinks** — the adaptive emit's interior-stop count `≤` the fixed-8 count on the linear/gentle curves; `0` interior stops on the `linear` baseline.
2. **fidelity-never-regresses (KEYSTONE)** — the adaptive emit's chord-to-curve error `≤` the fixed-8 emit's error on EVERY corpus curve (the sharp `cubic-bezier`, the spring overshoot, the `vh` transform, the `linear` baseline). The adaptive emit is provably AT LEAST as faithful as the fixed one, everywhere.
3. **boundaries-preserved** — every frame boundary (`time.start`/`time.stop`) appears in the emitted offset set, both emits (the adaptive redistribution never drops a boundary).

Born-RED today: the emit is fixed-uniform (no curvature probe), `waapi-densify-decision.json` is absent, and no gate exists — so all three assertions fail on the current tree (the fixed emit emits 8 stops on a `linear` segment → `count-shrinks` reds; no decision JSON → `measured-first` reds). The gate is born-RED by construction.

**The plant-a-failure.** On the cured tree, regress the chord-tolerance comparison to `<` instead of `>` (subdivide where the chord ALREADY matches) → the adaptive emit over-samples the linear baseline → the `count-shrinks` clause reds. Or regress the subdivision to drop a boundary → the `boundaries-preserved` clause reds. Or set `WAAPI_CHORD_TOLERANCE` too coarse so a sharp bend under-samples below the fixed-8 fidelity → the `fidelity-never-regresses` clause reds. Each witness is a live emitted-keyframe-set fidelity measurement, never a grep.

---

## Born-RED gate

**Gate:** `proof:waapi-adaptive-densify` (NEW — `scripts/proof-waapi-adaptive-densify.mjs` over `bench/waapi-densify.bench.ts` + `waapi-densify-decision.json`). Born-RED on today's tree: the emit is fixed-uniform, no decision JSON, no gate.

| Clause | The REAL observable | Born-RED witness on today's tree |
|--------|----------------------|------------------------------------|
| `measured-first` | both emits' interior-stop count + chord-to-curve error over the curvature corpus | `waapi-densify-decision.json` ENOENT → no measured count/fidelity comparison → RED |
| `count-shrinks` | the adaptive emit's count `≤` fixed-8 on linear/gentle curves; `0` on `linear` | the fixed emit emits 8 stops on a `linear` segment → RED |
| `fidelity-never-regresses` (KEYSTONE) | the adaptive emit's chord-error `≤` fixed-8's on EVERY curve | the adaptive emit does not exist → no fidelity comparison → RED |
| `boundaries-preserved` | every frame boundary appears in the emitted offsets | (the adaptive emit does not exist) → RED |

**The portability spine.** The fidelity metric (chord-to-curve error) is DETERMINISTIC (a numeric error over a sampled grid, not wall-clock — HARD everywhere); the stop-count is DETERMINISTIC (an integer, not timing). NO absolute-hz floor — the densify is a BUILD-time emit, not a hot-path; the metric is count + error, both device-independent. (Any build-time throughput is an observe-only note, never a hard CI predicate — the device-dependence-greening spine.)

**Green condition.** The bench measures both emits' count + chord-error over the curvature corpus + writes `waapi-densify-decision.json` (S1, measure-first); ADOPT charters the adaptive emit (S2) which subdivides by curvature, capped + boundary-preserving; the live gate asserts the adaptive emit shrinks the count on the common case + never regresses fidelity on any case + preserves every boundary (S3). The emit is provably "strictly fidelity-improving" — by a measured tolerance, not a fixed-count guess.

---

## Dependencies

- **`toWAAPIKeyframes` + the `interpFrames` sampler — already shipped** (`waapi.ts:260,293`). The densify seam + the true-curve sampler the adaptive subdivision reuses; NO new curve evaluator, NO new value.js edge.
- **The `springLinearStops` adaptive-emit precedent — already shipped** (`springLinearStops.ts`). The curve-aware densify idiom this wave generalizes; NO new pattern invented.
- **Independent of every other Band-B wave + every sibling.** The densify is kf-owned WAAPI emit — no value.js/parse-that/glass-ui edge (the NOW phase, fully in-realm; inv-16 trivially holds). File surfaces: `src/animation/waapi.ts` (the adaptive emit replacing the fixed loop), `bench/waapi-densify.bench.ts` (NEW), `scripts/proof-waapi-adaptive-densify.mjs` (NEW), `scripts/waapi-densify-decision.json` (NEW). No collision with Q.WB3 (a SEPARATE rAF-path interp seam — this is the WAAPI emit path).
- **NO sibling publish dependency.** Entirely kf-internal.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WB4 — **DOCS ONLY.** It writes zero source (inv-16: kf writes only keyframes.js; this wave touches NO foreign tree at all). On owner authorization the densify opens — STAGED: S1 (the bench + decision-JSON scaffold) lands FIRST; the S2 adaptive emit is a DEMOTE-TO-SPIKE chartered ONLY if S1 shows the adaptive emit shrinks the count WITHOUT a fidelity regression. Gate-first (`proof:waapi-adaptive-densify` born-RED + the bench baseline recorded BEFORE the adaptive emit lands), observable-truth (the emitted keyframe set's count + chord-to-curve fidelity over the REAL curvature corpus, not a source grep), no-legacy (the fixed `WAAPI_SUBSEGMENT_STOPS=8` const + the uniform loop DELETED, replaced by the adaptive emit — not kept beside as dead parallel), KISS (the subdivision reuses the existing `interpFrames` sampler — a recursive split, not a new evaluator), P-inv-28 (the verdict gets a durable `waapi-densify-decision.json` terminal home — ADOPT charters the adaptive emit, KILL records the falsification and ships the fixed-8 emit as-is).

---

## Mid-tranche-friction pre-emption

- **FRICTION: the adaptive emit could REGRESS fidelity on a sharp bend** (under-sampling below the fixed-8 quality) — a worse fill than the blunt-but-safe fixed emit. **PRE-EMPT:** S2's `fidelity-never-regresses` gate clause asserts the adaptive chord-error is `≤` the fixed-8 error on EVERY corpus curve; the adaptive emit is provably at-least-as-faithful, everywhere — the fidelity guard is authored NOW, not discovered after a visible compositor drift.
- **FRICTION: a pathological easing could emit UNBOUNDED keyframes** (a curve that never satisfies the chord tolerance). **PRE-EMPT:** S2 caps the subdivision at `WAAPI_MAX_SUBSEGMENT_STOPS` (e.g. 16) so the emit is ALWAYS bounded — the curvature-adaptive count is a function of the curve UP TO a ceiling, never unbounded.
- **FRICTION: a count-only "it's smaller" claim could ship a worse fill** (optimizing keyframe count at the cost of fidelity). **PRE-EMPT:** S1 records BOTH count AND chord-error; the decision-JSON's `measured-first` clause forbids a count-only verdict (the error comparison is mandatory) — the smell-test (a contrivance that trades fidelity for count) is gate-bitten.
- **FRICTION: this wave touches the WAAPI emit path that any other Q wave touching `waapi.ts` eligibility might also touch.** **PRE-EMPT:** the densify is scoped to `toWAAPIKeyframes`'s interior-stop emit ONLY (`waapi.ts:280-290`) — orthogonal to `isWAAPIEligible` (the eligibility predicate) and `toWAAPIOptions` (the timing emit); no other Band-B wave touches `waapi.ts`, so no edit-collision. Stated here so the impl ordering carries no hidden coupling.
