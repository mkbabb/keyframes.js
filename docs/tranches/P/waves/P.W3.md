# P.W3 — the `_styleOut` out-buffer alloc-cure (the GROUNDED CORE) — the Typed-OM write path KILLED (measured 0.69× on multi-property)

> **SPIKE RAN (2026-06-22) → KILL.** Per the owner's "prototype and validate, don't abrogate," the Typed-OM write path was TESTED in a real browser: `bench/typed-om-validate.mjs` (Chromium, playwright-core) → `scripts/typed-om-decision.json`. On the MULTI-property transform (the wave's claimed-win shape), `attributeStyleMap.set` is **0.69× — i.e. ~45% MORE write-cost** than string `setProperty`: the `CSSTransformValue` construction (`CSSTranslate`/`CSSScale`/`CSSRotate`/`CSS.px` allocations) exceeds the string-build + browser-parse it was meant to skip (exactly the audit's "construction cost erases the win"). It wins 1.43× only on single-property `opacity` — already ~4.5M hz, not a bottleneck. **VERDICT: KILL the dual-path.** The string `setProperty` path is fine everywhere; the `_styleOut` out-buffer (S2) — orthogonal to TOM, a real per-frame alloc-cure — ships ALONE as the wave's grounded payload. (Companion: P.W2's SoA spike RAN → ADOPT at 3.7×; the same measure-first method gave OPPOSITE verdicts, neither decidable on paper.)

**Band:** B — engine-perf (the transpositions).
**Phase:** **NOW** — kf-internal, zero sibling dependency, executable on authorization. The wave's PAYLOAD is the `_styleOut` out-buffer alloc-cure (S2 — a single-path, proven-pattern alloc-cure that ships unconditionally). The Typed-OM `StylePropertyMap` write path (S1/S5) is a DEMOTE-TO-SPIKE: a measure-first Playwright gate runs FIRST; on KILL the out-buffer ships ALONE.
**Sequence:** `P.W1 apparatus (NOW) ─► B{P.W2 compositor-blend bench (NOW), P.W3 _styleOut out-buffer (this wave, NOW)}`. P.W3 rides ATOP P.W1's portable-perf-gate infrastructure (the device-independent ratio bench discipline the Typed-OM spike's measure-first gate consumes) and is independent of P.W2 (a SEPARATE seam — P.W2 is the compositor-blend bench over `transformFramesGrouped`; P.W3 is the DOM-write egress). It sits ATOP O.W8's measurement substrate: O.W8 S8 already scoped the per-frame `Record` out-buffer micro-edit on this exact line; P.W3 GRADUATES that out-buffer as the grounded core.
**Owning DM/idea:** the **O.W8 S8 `_styleOut` out-buffer** (the proven-pattern per-frame alloc-cure of `transformTargetsStyle`, `utils.ts:410-424`) — the GROUNDED CORE. The Typed-OM batched write path (`AUDIT-DIGEST.md` K3 `[radical·arch]` :511-514; the K1 framing :409-411) is RE-SCOPED to a measure-first SPIKE per `docs/tranches/P/CONTRIVANCE-AUDIT.md` (it is a PERMANENT dual-path — Typed-OM is Limited Availability, no Firefox — for a Chromium-mostly win on the least-common multi-property shape; run the write-cost gate FIRST, ship the out-buffer alone on KILL).

**The CONTRIVANCE-AUDIT split (the seam this wave honors).**

1. **The `_styleOut` out-buffer (S2) is the GROUNDED CORE — the wave's payload.** Hoist `const _styleOut: Record<string,string> = {}` and pass it as the `out` arg to `unflattenObjectToString` (the value.js sink ALREADY accepts it — `value.js/src/units/utils.ts:188-192`), eliminating the per-frame `Record` alloc. This is a proven-pattern alloc-cure (the F.W4 zero-alloc discipline), SINGLE-PATH (no dual code path), no speculative dependency. It ships unconditionally, on the existing `setProperty` egress — the O.W8 S8 graduation.
2. **The Typed-OM `StylePropertyMap` write path (S1/S5) is a DEMOTE-TO-SPIKE.** It is a PERMANENT dual-path: `StylePropertyMap` is Limited Availability (Chrome/Edge 66+, Safari 16.4+, NO Firefox aggregate API — NOT Baseline), so the `setProperty` fallback can NEVER be retired — both paths live forever. The win is Chromium-mostly, and only on the least-common multi-property write shape (the audit's own single-property caveat). So the write-cost Playwright gate runs FIRST as a MEASUREMENT; on KILL (the multi-property ratio does not clear ≤0.85, or the dual-path maintenance cost outweighs the Chromium-only win) the spike is NOT built and the S2 out-buffer ships ALONE.
3. **The `Playhead` value-object is DROPPED entirely** (was S4). It carries NO perf claim; it is pure delegating-accessor indirection (BC-preserving by construction = zero observable delta — a no-op refactor); and it depends on the unlanded O.W7. The `engine.ts` shrink the original framing attributed to it is O.W7's file-split (lifting the playback machine into `engine-playback.ts`), NOT a value-object. There is nothing here to land in P.W3 — see "Excluded from this wave."

---

## Context

### The defect, grounded

The default DOM-style renderer is `transformTargetsStyle` (`src/animation/utils.ts:410-424`), reached every rAF apply frame: `engine.ts:255-256` binds it as `_defaultTransform`, `engine.ts:776` calls `frame.transform(this.unflatten ? frame.vars : frame.flatVars, t)`, and the `_hasComposition` settle path at `engine.ts:1377` calls it directly. Its body today (`utils.ts:415-423`):

```ts
vars = flat ? vars : (flattenObject(vars) as V);
const styleStringVars = unflattenObjectToString(vars);   // fresh Record<string,string> per frame
targets.forEach((target) => {
    Object.entries(styleStringVars).forEach(([key, value]) => {
        target.style.setProperty(key, value);            // K string-serialize + browser CSS re-parse calls / frame
    });
});
```

Two costs compound on the hot path:

1. **The per-frame `Record<string,string>` alloc** (`utils.ts:417`). `unflattenObjectToString` is called with NO `out` argument — every frame mints a fresh `Record`, then `Object.entries(...)` mints an array-of-pairs over it. The value.js sink ALREADY accepts an `out` reuse target (`value.js/src/units/utils.ts:188-200` — it even clears stale keys), but the engine never passes one. (`AUDIT-DIGEST.md` K1 :409-411 / K3 :497-499 — the O.W8 S8 gap.)
2. **The string-serialize + browser CSS re-parse on EVERY `setProperty`** (`utils.ts:421`). For a `transform`-heavy animation the engine serializes `translate3d(…) scale3d(…) rotateZ(…)` to a string, then `style.setProperty("transform", "<that string>")` makes the browser RE-PARSE it back into a typed `CSSTransformValue`. This is the AoS string round-trip the **Typed OM (Houdini `StylePropertyMap`)** was designed to eliminate: `target.attributeStyleMap.set("transform", new CSSTransformValue([...]))` passes the typed value DIRECTLY — no serialize, no re-parse (`AUDIT-DIGEST.md` K3 :511-514, the `[radical·arch]` idea: "Potentially 30-50% DOM-write cost reduction for transform-heavy animations by eliminating the string serialization + browser CSS re-parse").

### The grounded core (S2): the `_styleOut` out-buffer alloc-cure

The wave's payload addresses cost (1) — the per-frame `Record` alloc — directly and unconditionally. `transformTargetsStyle` (`utils.ts:415-423`) calls `unflattenObjectToString(vars)` with NO `out` argument, minting a fresh `Record<string,string>` every apply frame. The value.js sink already accepts a reuse target (`value.js/src/units/utils.ts:188-200` — it even clears stale keys), so the cure is to hoist a module-scope `const _styleOut: Record<string,string> = {}` and pass it as the `out` arg. This is the O.W8 S8 graduation: a proven-pattern, SINGLE-PATH, zero-alloc cure (the F.W4 discipline), on the EXISTING `setProperty` egress, with NO speculative dependency and NO dual code path. It ships first and unconditionally — it is the wave's grounded core.

### The Typed-OM write path (SPIKE): a permanent dual-path, measured first

Cost (2) — the string-serialize + browser CSS re-parse on every `setProperty` — is the Typed-OM `StylePropertyMap.set()` target. But this is a DEMOTE-TO-SPIKE, because the path is a PERMANENT dual-path and the win is conditional:

- **`StylePropertyMap` path (Typed-OM eligible — the SPIKE).** When the renderer detects `target.attributeStyleMap instanceof StylePropertyMap` (the Houdini Typed-OM aggregate API, **LIMITED AVAILABILITY — Chrome/Edge 66+, Safari 16.4+, NO Firefox for the aggregate `attributeStyleMap`/`StylePropertyMap` API** — NOT Baseline; `AUDIT-DIGEST.md` K3 :513), build a typed `CSSStyleValue` (a `CSSTransformValue` for `transform`, a `CSSUnitValue` for numeric dimensions, a `CSSKeywordValue`/parsed `CSSStyleValue.parse(prop, str)` for the residual) and `set()` it — NO string serialize, NO re-parse. The win is Chromium-mostly (NO Firefox, ever) and only on the multi-property write shape (the audit's single-property caveat: `set()` of a SINGLE property may not beat `setProperty`). So this spike is gated on a write-cost measurement FIRST (S5/S1): the Playwright DOM-write-cost ratio over a MULTI-property transform must clear ≤0.85 to charter the engine edit; on KILL the spike is not built.
- **`setProperty` path (the universal floor — PERMANENT).** Because Typed-OM is Limited Availability, the `setProperty` path can NEVER be retired — it is the bit-for-bit default everywhere Typed-OM is absent (ALL of Firefox, old browsers, SSR), forever. This is why the Typed-OM win is a PERMANENT dual-path, not a clean replacement: both code paths live in perpetuity. The S2 out-buffer alloc-cure lands on this path unconditionally (it is the floor regardless of the spike verdict).

If the spike IS chartered, the egress builder owns ONLY the per-leaf → `CSSStyleValue` map; the library keeps the interp and the apply lifecycle (`engine.ts:776`) exactly as they are. KISS: the spike is the egress builder + the feature-detect branch, not a rewrite of the renderer protocol (`usesDefaultRenderer` reference-comparison stays bind-proof — `engine.ts:259-260`). If the spike is KILLED, none of this lands — the out-buffer ships alone.

### Why this is NOT a re-litigation of a falsified idea

The Typed-OM win is a *different-engine-write-path* win (the browser's typed-OM ingest vs its CSS-string parser), NOT a JS-side micro-opt of V8 that the SpanParser/SIMD falsifications govern. There is no runtime tagged-union, no closure-dispatch loop — the feature-detect branch is monomorphic per call site. The risk the audit names is precise (`AUDIT-DIGEST.md` K3 :513): "`StylePropertyMap.set()` with `CSSTransformValue` may not be faster for a SINGLE property; the win is the batch + the parse-skip on multi-property writes." That is exactly why the born-RED gate is a **portable DOM-write-cost ratio bench over a MULTI-property transform**, not a synthetic micro-bench — and why the feature-detect fallback is mandatory (a realm without Typed-OM — ALL of Firefox, old browsers, SSR — must keep the `setProperty` path bit-for-bit, never regress). The Typed-OM aggregate API is NOT Baseline (LIMITED AVAILABILITY: Chrome/Edge 66+, Safari 16.4+, NO Firefox), so the transposition is strictly PROGRESSIVE ENHANCEMENT, feature-detect-gated, with the string-`setProperty` path as the universal floor.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-20) |
|-----|-----------------|------------------------------|
| defect (alloc) | `src/animation/utils.ts:417` | `const styleStringVars = unflattenObjectToString(vars)` — NO `out` arg → fresh `Record` per apply frame |
| defect (round-trip) | `src/animation/utils.ts:419-423` | `targets.forEach(… Object.entries(styleStringVars).forEach(([k,v]) => target.style.setProperty(k,v)))` — K string-serialize + browser re-parse calls / frame |
| sink ready | `value.js/src/units/utils.ts:188-200` | `unflattenObjectToString(flatObj, out?)` ALREADY accepts a reuse `out` (clears stale keys) — the O.W8 S8 substrate, unconsumed by the engine |
| apply path | `src/animation/engine.ts:776` | `frame.transform(this.unflatten ? frame.vars : frame.flatVars, t)` — the per-frame default-renderer reach |
| apply path | `src/animation/engine.ts:255-256` | `_defaultTransform = (vars) => transformTargetsStyle(vars, this.targets)` — the bound default renderer |
| settle path | `src/animation/engine.ts:1377` | `transformTargetsStyle(vars, this.targets)` — the `_hasComposition` settle direct call (same egress) |
| bind-proof seam | `src/animation/engine.ts:259-260` | `usesDefaultRenderer(fn) { return fn === this._defaultTransform }` — reference comparison, the WAAPI-eligibility predicate this wave must not perturb |
| O.W8 substrate | `O.W8.md` S8 | the `_styleOut` out-buffer micro-edit + the heap-delta gate — P.W3's alloc-cure FLOOR |
| idea | `AUDIT-DIGEST.md` K3 :511-514 | `[radical·arch]` "two-phase pipeline (interpolate-all → write-all) … batched DOM style mutation … 30-50% DOM-write cost reduction" + the LIMITED-AVAILABILITY support window (Chrome/Edge 66+, Safari 16.4+, NO Firefox aggregate API — NOT Baseline) + the single-property risk |
| portable-gate discipline | `AUDIT-DIGEST.md` K3 :515-518 | "every HARD predicate as a same-report ratio" — the device-independent ratio P.W1 ratifies, this wave's gate consumes |

---

## Scope

The wave has THREE S-clauses, structured measure-first with the grounded core first:

- **S2 (the GROUNDED CORE — ships unconditionally).** The `_styleOut` module-scope out-buffer passed as the `out` arg to `unflattenObjectToString` — the O.W8 S8 alloc-cure, single-path, on the existing `setProperty` egress. Gated by a heap-delta zero-alloc arm. This is the wave's payload; it lands regardless of the spike verdict.
- **S5 (the measure-first gate — runs FIRST for the spike).** The born-RED `proof:typed-om-eligible` gate over the REAL runtime DOM-write-cost ratio on a MULTI-property transform (Playwright-core over `dist/gh-pages/`). It is authored BEFORE the Typed-OM egress and is the CHARTER GATE: the ratio must clear ≤0.85 for the spike to be built. The out-buffer floor (S2) is independent of this gate.
- **S1 (DEMOTE-TO-SPIKE — chartered ONLY if S5 clears the bar).** The `StylePropertyMap` write path in `transformTargetsStyle` with the permanent `setProperty` fallback. Built ONLY if S5's multi-property ratio clears ≤0.85; on KILL the spike is NOT built and S3 records the falsification, the S2 out-buffer shipping alone.
- **S3 (the verdict's terminal home).** The Typed-OM ADOPT/KILL verdict recorded in `scripts/typed-om-decision.json` beside `spring-vector-decision.json` (the K1-rec P-inv-28 terminal home). A KILL ships the S2 out-buffer alone.

**The `Playhead` value-object is DROPPED** (was S4 in the original framing — see "Excluded from this wave"). It carried no perf claim, was pure delegating-accessor indirection (a no-op refactor, zero observable delta), and depended on the unlanded O.W7. The `engine.ts` shrink belongs to O.W7's file-split, not to a value-object in this wave. `proof:published-surface` (the BC oracle) remains the repo's published-surface guard but is NOT a P.W3 deliverable — there is no engine-surface change here to gate.

---

## Born-RED gate

**Gate:** the grounded core (S2) is gated by an `out-buffer-floor` heap-delta arm (zero per-frame `Record` alloc — DETERMINISTIC, HARD everywhere). The Typed-OM spike (S1/S5) is gated by `proof:typed-om-eligible` (NEW — `scripts/proof-typed-om-eligible.mjs`; this wave authors it as the measure-first CHARTER GATE). It is a **REAL-BROWSER (Playwright-core) portable DOM-write-cost ratio gate** — NOT a jsdom source-shape proxy (jsdom has no `StylePropertyMap`, so a jsdom-only gate would GREEN-by-SKIP forever, the exact O.W8 S4 `proof:scheduler-posttask` anti-pattern). It mirrors the `bench/playwright.bench.ts` / `proof:computed-real-dom` harness (a real Chromium over the BUILT `dist/gh-pages/`). The `write-cost-ratio` is measured FIRST: it CHARTERS the spike (≥15% multi-property win) or KILLs it (the out-buffer ships alone).

### The RED observable TODAY

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | GREEN condition |
|---|---|---|---|
| `out-buffer-floor` (**GROUNDED CORE** — alloc-cure, S2) | `grep -n "unflattenObjectToString(vars)" src/animation/utils.ts` → the no-`out` call at :417; `test:zero-alloc` heap-delta over a 600-frame transform apply records a non-zero per-frame `Record` alloc | the per-frame `Record` alloc is live (O.W8 S8 un-implemented on the real tree) | a module-scope `_styleOut` reuse target passed as `out`; the heap-delta arm records ZERO per-frame `Record` alloc. Ships UNCONDITIONALLY (independent of the spike verdict) |
| `typed-om-path` (spike source-shape, S1) | `grep -n "attributeStyleMap\|StylePropertyMap\|CSSTransformValue" src/animation/utils.ts` | ZERO — `transformTargetsStyle` has NO Typed-OM branch; every apply is `setProperty` string round-trip | IF the spike is chartered: `transformTargetsStyle` feature-detects `target.attributeStyleMap` and `set()`s a typed `CSSStyleValue` on the Typed-OM path |
| `fallback-parity` (spike feature-detect safety, S1) | a synthetic realm with `attributeStyleMap` deleted: the apply path | NO fallback branch exists — the transposition would HARD-FAIL on a non-Typed-OM realm if naively authored | IF chartered: with `StylePropertyMap` absent, the apply produces bit-for-bit the SAME computed style as the `setProperty` path (no visual regression, no throw) — the PERMANENT fallback |
| `write-cost-ratio` (**KEYSTONE / CHARTER GATE** — measured first, S5) | Playwright trace: a 600-frame MULTI-property transform animation (`translate3d`+`scale3d`+`rotateZ`+`opacity`) over `dist/gh-pages/`, measuring DOM-write wall-cost via `performance.measure` around the apply egress | the `setProperty`-only path's per-frame write cost is the baseline; no Typed-OM path exists to compare | `typed-om-write-cost / setProperty-write-cost ≤ 0.85` (≥15% faster) on the multi-property case, measured PORTABLE (numerator + denominator from the SAME report, the P.W1 ratio discipline) → CHARTERS the spike. ABOVE 0.85, or the single-property case regressing past `1.0` → KILL (the S2 out-buffer ships alone) |

### How it is born-RED via a planted failure

The grounded-core arm and the spike's charter gate are authored BEFORE any Typed-OM code (gate-first). On a clean tree it exits 1 because:
- `out-buffer-floor` (the core) reds: the `unflattenObjectToString(vars)` call at `utils.ts:417` has no `out` arg → the heap-delta arm records the live per-frame alloc.
- `typed-om-path` reds: `grep attributeStyleMap src/animation/utils.ts` → ZERO (the branch is absent).
- `write-cost-ratio` reds: there is no Typed-OM path, so the ratio is identically `1.0` (or undefined) — it cannot meet `≤ 0.85`. This is the measure-first CHARTER GATE: it must clear ≤0.85 to authorize the spike.

**The DUAL born-RED structure (the proxy-trap guard).** Even if a future stub adds an `attributeStyleMap` branch that greens `typed-om-path` (the name-only source-shape proxy), the `write-cost-ratio` clause STILL reds unless that branch actually writes TYPED values that SKIP the string re-parse — a stub that builds a `CSSStyleValue.parse(prop, serializedString)` (which re-introduces the parse it was meant to skip) measures NO speedup and reds. The gate bites the GENUINE observable (the write is faster because the parse is skipped), never the presence of the API name. This is the inv-two-axis classification: a perf transposition closes via a RUNTIME ratio over the live observable, never a source-shape stand-in.

**A portable PERF gate (not an absolute floor).** Per the P.W1 ratio discipline (`AUDIT-DIGEST.md` K3 :515-518, the device-dependence-greening lesson), `write-cost-ratio` is a same-report ratio (Typed-OM-cost / setProperty-cost in the SAME Playwright trace) — robust across the macOS developer machine and the slow Linux runner. No absolute `floorMs`. CI posture: HARD via `declarePosture(hard)` once the real-browser harness is wired; observe-only locally where Chromium is unavailable (the booked CI-env split). The `out-buffer-floor` heap-delta arm is DETERMINISTIC (an alloc count, not timing — HARD everywhere) and is independent of the Playwright gate.

---

## Dependencies

- **The S2 out-buffer (the grounded core) — needs NOTHING but value.js's already-shipped `out` arg.** `value.js`'s `unflattenObjectToString(flatObj, out?)` is already shipped (`value.js/src/units/utils.ts:188-200`, the `out` reuse arg present since the O substrate). The S2 alloc-cure consumes an EXISTING value.js surface — no VJ-P ask, no publish dep. It is single-path and unconditional. **Pure NOW.**
- **The Typed-OM spike (`StylePropertyMap` / `CSSTransformValue` / `CSSUnitValue`) — a BROWSER feature at LIMITED AVAILABILITY, NOT Baseline; a PERMANENT dual-path.** Chrome/Edge 66+, Safari 16.4+, NO Firefox for the aggregate `attributeStyleMap`/`StylePropertyMap` API (`AUDIT-DIGEST.md` K3 :513). Because it is NOT Baseline, the `setProperty` fallback can NEVER be retired — the dual path is permanent, the win is Chromium-mostly, and the spike is built ONLY if the measure-first `write-cost-ratio` gate charters it. NO value.js / parse-that / glass-ui publish gates it; it fires (if chartered) entirely on today's installed tree.
- **The spike's charter gate rides ATOP P.W1's portable-perf-gate apparatus.** The `write-cost-ratio` is a device-independent same-report ratio — it CANNOT be authored before P.W1 ratifies the ratio discipline + the Playwright-core perf harness. P.W1 → P.W3 is a HARD in-tranche ordering (for the spike's gate; the S2 out-buffer is gated only by the deterministic heap-delta arm).
- **Independent of P.W2.** P.W2 is the compositor-blend bench over `transformFramesGrouped`; P.W3 is the DOM-write egress. Neither blocks the other — a SEPARATE seam, a SEPARATE gate.
- **Decision-JSON terminal home.** S3 records the Typed-OM verdict in `scripts/typed-om-decision.json` beside `spring-vector-decision.json` (the K1-rec P-inv-28 pattern: "Record each transposition's verdict in a decision JSON … ADOPT authorizes the engine edit, KILL records the falsification"). If the `write-cost-ratio` charter gate fails to clear `≤ 0.85` on real hardware, the verdict is KILL — the spike is NOT built, the falsification is recorded, and the alloc-cure core (S2) lands alone as the un-controversial O.W8 S8 graduation.
- **The `Playhead` value-object — DROPPED, not deferred.** It had no perf claim, was a no-op delegating-accessor refactor, and depended on the unlanded O.W7. P.W3 makes NO engine-surface change, so `proof:published-surface` is NOT a P.W3 deliverable. The `engine.ts` shrink lives in O.W7's file-split.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W3 — **DOCS ONLY**. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; no cross-repo edit — the `unflattenObjectToString` `out` arg is an ALREADY-shipped value.js surface, not a new ask; the Typed-OM spike, IF chartered, is a kf-internal egress over a browser feature at LIMITED AVAILABILITY). The IMPLEMENTATION (the `_styleOut` out-buffer as the grounded core; the `proof:typed-om-eligible` measure-first gate; the `transformTargetsStyle` Typed-OM egress IF chartered; the decision JSON) opens only on the owner's explicit authorization. The `Playhead` value-object is DROPPED — it is NOT part of this wave's implementation. When the impl opens it is:

- **grounded-core-first** — the S2 `_styleOut` out-buffer (single-path, deterministic zero-alloc gate) lands FIRST and unconditionally; it is the wave's payload and is independent of the spike.
- **measure-first** — the Typed-OM spike is a DEMOTE-TO-SPIKE: `proof:typed-om-eligible`'s `write-cost-ratio` charter gate is authored born-RED and measured BEFORE the egress transposition lands (S5 precedes S1). The spike is built ONLY on an ADOPT; a KILL ships the out-buffer alone and records the falsification.
- **observable-truth** — the `write-cost-ratio` keystone over a REAL Chromium DOM-write trace, never a jsdom source-shape proxy (the GREEN-by-SKIP anti-pattern is the named trap); the DUAL born-RED forbids a name-only `attributeStyleMap` stub from false-greening.
- **no-legacy (the core); permanent-dual-path (the spike)** — the per-frame `Record` alloc is PURGED on the `setProperty` egress (the O.W8 S8 graduation, single-path). IF the spike is chartered, the `setProperty` path is NOT a legacy to retire — it is the PERMANENT feature-detect fallback (Typed-OM is Limited Availability, no Firefox), gated bit-for-bit by `fallback-parity`. The dual path is the cost the measure-first gate weighs against the Chromium-only win.
- **KISS** — the core is a one-line `out`-arg change; IF the spike is chartered, it is the egress builder + the feature-detect branch, not a renderer-protocol rewrite; `usesDefaultRenderer`'s bind-proof reference comparison is untouched.
- **gestalt** — ONE apply egress (`transformTargetsStyle`); the out-buffer is unconditional, and IF the spike charters, two internal write paths chosen by capability, not two renderers.
- **P-invariant-28** — the Typed-OM verdict (ADOPT or KILL) is recorded in `typed-om-decision.json` (a terminal home, not a perpetual deferral); a KILL verdict ships the alloc-cure core alone and records the falsification, never carries the spike forward as a bare deferral.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| `out-buffer-floor` (GROUNDED CORE) | The per-frame `Record<string,string>` alloc persists on the apply hot path (the O.W8 S8 gap rides un-implemented into P) — steady-state GC pressure on every transform animation. This is the wave's payload; it ships regardless of the spike verdict |
| `write-cost-ratio` (KEYSTONE / CHARTER GATE) | The Typed-OM spike is built WITHOUT a measure-first ratio (an aggressive permanent-dual-path edit on an unmeasured Chromium-only win); OR a STUB Typed-OM branch re-introduces the parse (`CSSStyleValue.parse(prop, serializedString)`) and false-greens while delivering ZERO speedup; OR the transposition REGRESSES the single-property case below `1.0` (the audit's named risk) |
| `typed-om-path` (spike, if chartered) | The DOM-write egress stays an unconditional `setProperty` string round-trip when the measured win justifies the spike — every `transform` frame serializes to a string the browser then re-parses |
| `fallback-parity` (spike, if chartered) | A naive Typed-OM transposition HARD-FAILS on a non-Typed-OM realm (Firefox, old browser, SSR) — the PERMANENT feature-detect fallback is dropped and the egress throws or silently no-ops where `attributeStyleMap` is absent |

---

## Excluded from this wave

- **The `Playhead` value-object (DROPPED, was the original S4).** It carried no perf claim, was pure delegating-accessor indirection (BC-preserving by construction = a no-op refactor with zero observable delta), and depended on the unlanded O.W7. The `engine.ts` shrink the original framing attributed to it is O.W7's file-split (lifting the playback machine into `engine-playback.ts`), NOT a value-object. P.W3 makes NO engine-surface change; `proof:published-surface` / `proof:playhead-decoupled` / `proof:manual-clock-drive` are NOT P.W3 deliverables. (CONTRIVANCE-AUDIT: no speculative refactor without a measured payoff.)
- **The AnimationGroup compositor-blend bench (P.W2).** The `transformFramesGrouped` measure-first bench + the gated SoA fold is P.W2 — a SEPARATE wave, a SEPARATE gate. P.W3 owns ONLY the DOM-write egress.
- **The codegen-consume (P.W4).** The generated CSS-value parser is the GATED Band-B wave (parse-that B + value.js P). P.W3 is pure-NOW.
- **WAAPI maximalism (color-densify / computed-px-bake).** The `AUDIT-DIGEST.md` K1 :426-433 compositor-coverage expansion (lifting color/computed animations onto the compositor) is a SEPARATE compositor frontier — it perturbs `waapi.ts` eligibility, not the rAF apply egress P.W3 owns. Carried, not folded here.
- **Promoting Typed-OM to the WAAPI path.** WAAPI already bypasses the rAF apply entirely (the compositor owns the write). P.W3's Typed-OM transposition is the rAF-apply egress ONLY — the path WAAPI-ineligible animations (computed units, color interp, multi-segment easing) ride. The two are complementary, not competing.
