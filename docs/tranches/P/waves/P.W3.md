# P.W3 — the Typed-OM batched write path: `transformTargetsStyle` transposed to interpolate-all → write-all (the DOM-write transposition)

**Band:** B — engine-perf (the transpositions).
**Phase:** **NOW** — kf-internal, zero sibling dependency, executable on authorization. The feature-detect fallback keeps every non-Typed-OM realm on today's `setProperty` path (no value.js/parse-that/glass-ui publish gates it).
**Sequence:** `P.W1 apparatus (NOW) ─► B{P.W2 SoA-compositor (NOW), P.W3 Typed-OM write-path (this wave, NOW)}`. P.W3 rides ATOP P.W1's portable-perf-gate infrastructure (the device-independent ratio bench discipline this wave's born-RED gate consumes) and is independent of P.W2 (a SEPARATE seam — P.W2 is the interpolate-arithmetic SoA fold over `allInterpVars`; P.W3 is the DOM-write egress AFTER the interp). It sits ATOP O.W8's measurement substrate: O.W8 S8 already scoped the per-frame `Record` out-buffer micro-edit on this exact line; P.W3 is the full transposition O.W8 measured-but-deferred.
**Owning DM/idea:** **K1/K3 lane — "Transposing the CSSKeyframesAnimation PLAY path onto a two-phase pipeline (interpolate-all → write-all) to enable batched DOM style mutation"** (`AUDIT-DIGEST.md` K3 novel-idea `[radical·arch]` :511-514; the K1 `[radical·arch]` Typed-OM framing :409-411). Pairs with the **Playhead value-object** transposition (K2 lane, `AUDIT-DIGEST.md` :461-464; CONSTITUTION §5 "the `Playhead` value-object") as the second Band-B P.W3 deliverable — the driver-protocol formalization that turns `KeyframesAnimation` into a thin compile-facade, gated by `proof:playhead-decoupled`.

This wave **supersedes O.W8 S8** (`O.W8.md` S8 — the module-scope `_styleOut` out-buffer micro-edit). O.W8 S8 was a *measurement-honesty* edit: hoist `const _styleOut: Record<string,string> = {}` and pass it as the `out` arg to `unflattenObjectToString` (the value.js sink already accepts it — `value.js/src/units/utils.ts:188-192`), eliminating the per-frame `Record` alloc, gated by a heap-delta extension. P.W3 is the *architectural* form: the out-buffer alloc-cure is the FLOOR, but the real win is retiring the string-serialize + browser CSS re-parse entirely on the apply path via `StylePropertyMap.set()` — a transposition O.W8 measured but could not author without the portable DOM-write-cost bench P.W1 ratifies.

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

### The transposition (interpolate-all → write-all)

The PLAY path today interleaves interpolate and write inside one `forEach` over targets. The transposition is a **two-phase pipeline**:

```
  PHASE 1 (interpolate-all):  allInterpVars ──► numeric/string leaf values  (engine.ts:754, lerpValue per iv — unchanged)
        │
        │  the per-frame flat result (frame.flatVars after the lerp)
        ▼
  PHASE 2 (write-all):        ONE batched StylePropertyMap.set() per property per target
                              (transformTargetsStyle, the new egress)
```

Phase 1 is unchanged — P.W2 owns the interp-arithmetic SoA fold; P.W3 owns ONLY the egress. The egress transposes:

- **`StylePropertyMap` path (Typed-OM eligible).** When the renderer detects `target.attributeStyleMap instanceof StylePropertyMap` (the Houdini feature, **Baseline: Chrome 66+ / Firefox 98+ / Safari 16.4+** — `AUDIT-DIGEST.md` K3 :513), build a typed `CSSStyleValue` (a `CSSTransformValue` for `transform`, a `CSSUnitValue` for numeric dimensions, a `CSSKeywordValue`/parsed `CSSStyleValue.parse(prop, str)` for the residual) and `set()` it — NO string serialize, NO re-parse.
- **`setProperty` fallback path (Typed-OM absent OR a property Typed-OM cannot represent).** Old realms, SSR, and any property whose value the typed builders cannot construct fall back to today's `unflattenObjectToString(vars, _styleOut)` + `setProperty` — but now with the O.W8 S8 out-buffer (the alloc-cure FLOOR that lands unconditionally, both paths).

The component owns ONLY the per-leaf → `CSSStyleValue` map; the library keeps the interp (Phase 1) and the apply lifecycle (`engine.ts:776`) exactly as they are. KISS: the transposition is the egress builder + the feature-detect branch, not a rewrite of the renderer protocol (`usesDefaultRenderer` reference-comparison stays bind-proof — `engine.ts:259-260`).

### Why this is NOT a re-litigation of a falsified idea

The Typed-OM win is a *different-engine-write-path* win (the browser's typed-OM ingest vs its CSS-string parser), NOT a JS-side micro-opt of V8 that the SpanParser/SIMD falsifications govern. There is no runtime tagged-union, no closure-dispatch loop — the feature-detect branch is monomorphic per call site. The risk the audit names is precise (`AUDIT-DIGEST.md` K3 :513): "`StylePropertyMap.set()` with `CSSTransformValue` may not be faster for a SINGLE property; the win is the batch + the parse-skip on multi-property writes." That is exactly why the born-RED gate is a **portable DOM-write-cost ratio bench over a MULTI-property transform**, not a synthetic micro-bench — and why the feature-detect fallback is mandatory (a realm without Typed-OM must keep the `setProperty` path bit-for-bit, never regress).

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
| idea | `AUDIT-DIGEST.md` K3 :511-514 | `[radical·arch]` "two-phase pipeline (interpolate-all → write-all) … batched DOM style mutation … 30-50% DOM-write cost reduction" + the Baseline window + the single-property risk |
| portable-gate discipline | `AUDIT-DIGEST.md` K3 :515-518 | "every HARD predicate as a same-report ratio" — the device-independent ratio P.W1 ratifies, this wave's gate consumes |

---

## Scope

**S1** transposes the egress in `transformTargetsStyle` into the two-phase `StylePropertyMap` write with a feature-detect fallback. **S2** lands the O.W8 S8 out-buffer alloc-cure as the unconditional FLOOR (both paths). **S3** records the Typed-OM ADOPT/KILL verdict in a decision JSON beside `spring-vector-decision.json` (the K1-rec P-inv-28 terminal home). **S4** is the sibling **Playhead value-object** transposition (the K2 driver-protocol formalization) over O.W7's shrunk `engine.ts`. The keystone is **S5** — the born-RED `proof:typed-om-eligible` gate over the REAL runtime DOM-write-cost ratio.

---

## Born-RED gate

**Gate:** `proof:typed-om-eligible` (NEW — `scripts/proof-typed-om-eligible.mjs`; this wave authors it). It is a **REAL-BROWSER (Playwright-core) portable DOM-write-cost ratio gate** — NOT a jsdom source-shape proxy (jsdom has no `StylePropertyMap`, so a jsdom-only gate would GREEN-by-SKIP forever, the exact O.W8 S4 `proof:scheduler-posttask` anti-pattern). It mirrors the `bench/playwright.bench.ts` / `proof:computed-real-dom` harness (a real Chromium over the BUILT `dist/gh-pages/`).

### The RED observable TODAY

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | GREEN condition |
|---|---|---|---|
| `typed-om-path` (source-shape) | `grep -n "attributeStyleMap\|StylePropertyMap\|CSSTransformValue" src/animation/utils.ts` | ZERO — `transformTargetsStyle` has NO Typed-OM branch; every apply is `setProperty` string round-trip | `transformTargetsStyle` feature-detects `target.attributeStyleMap` and `set()`s a typed `CSSStyleValue` on the Typed-OM path |
| `out-buffer-floor` (alloc-cure) | `grep -n "unflattenObjectToString(vars)" src/animation/utils.ts` → the no-`out` call at :417; `test:zero-alloc` heap-delta over a 600-frame transform apply records a non-zero per-frame `Record` alloc | the per-frame `Record` alloc is live (O.W8 S8 un-implemented on the real tree) | a module-scope `_styleOut` reuse target passed as `out`; the heap-delta arm records ZERO per-frame `Record` alloc on BOTH paths |
| `fallback-parity` (feature-detect safety) | a synthetic realm with `attributeStyleMap` deleted: the apply path | NO fallback branch exists — the transposition would HARD-FAIL on a non-Typed-OM realm if naively authored | with `StylePropertyMap` absent, the apply produces bit-for-bit the SAME computed style as the `setProperty` path (no visual regression, no throw) |
| `write-cost-ratio` (**KEYSTONE** — observable-truth) | Playwright trace: a 600-frame MULTI-property transform animation (`translate3d`+`scale3d`+`rotateZ`+`opacity`) over `dist/gh-pages/`, measuring DOM-write wall-cost via `performance.measure` around the apply egress | the `setProperty`-only path's per-frame write cost is the baseline; no Typed-OM path exists to compare | `typed-om-write-cost / setProperty-write-cost ≤ 0.85` (≥15% faster) on the Typed-OM path over the multi-property case, measured PORTABLE (numerator + denominator from the SAME report, the P.W1 ratio discipline) — AND on a single-property case the ratio is allowed `≤ 1.0` (no regression), per the audit's single-property caveat |

### How it is born-RED via a planted failure

The gate is authored BEFORE the transposition (gate-first). On a clean tree it exits 1 because:
- `typed-om-path` reds: `grep attributeStyleMap src/animation/utils.ts` → ZERO (the branch is absent).
- `out-buffer-floor` reds: the `unflattenObjectToString(vars)` call at `utils.ts:417` has no `out` arg → the heap-delta arm records the live per-frame alloc.
- `write-cost-ratio` reds: there is no Typed-OM path, so the ratio is identically `1.0` (or undefined) — it cannot meet `≤ 0.85`.

**The DUAL born-RED structure (the proxy-trap guard).** Even if a future stub adds an `attributeStyleMap` branch that greens `typed-om-path` (the name-only source-shape proxy), the `write-cost-ratio` clause STILL reds unless that branch actually writes TYPED values that SKIP the string re-parse — a stub that builds a `CSSStyleValue.parse(prop, serializedString)` (which re-introduces the parse it was meant to skip) measures NO speedup and reds. The gate bites the GENUINE observable (the write is faster because the parse is skipped), never the presence of the API name. This is the inv-two-axis classification: a perf transposition closes via a RUNTIME ratio over the live observable, never a source-shape stand-in.

**A portable PERF gate (not an absolute floor).** Per the P.W1 ratio discipline (`AUDIT-DIGEST.md` K3 :515-518, the device-dependence-greening lesson), `write-cost-ratio` is a same-report ratio (Typed-OM-cost / setProperty-cost in the SAME Playwright trace) — robust across the macOS developer machine and the slow Linux runner. No absolute `floorMs`. CI posture: HARD via `declarePosture(hard)` once the real-browser harness is wired; observe-only locally where Chromium is unavailable (the booked CI-env split).

### The Playhead sibling (S4) born-RED

The S4 Playhead value-object transposition carries its OWN born-RED `proof:playhead-decoupled` (`AUDIT-DIGEST.md` K2 :464): assert the extracted `engine-playback.ts` / Playhead module has ZERO import of `KeyframesAnimation` (a grep over the import graph) AND a `proof:manual-clock-drive` (K2 :468) — construct an `Animation`, inject a `ManualClock`, step it 60 frames, assert `effectiveT` advances WITHOUT a rAF. RED today: the playback machine is engine-internal (the four drivers — `sequence.ts:426,497`, `group-layer-springs.ts:164,201`, `ingest.ts:345` — poke raw `startTime`/`advanceTo` fields, so a Playhead module that imports nothing of `KeyframesAnimation` does not yet exist).

---

## Dependencies

- **Typed-OM (`StylePropertyMap` / `CSSTransformValue` / `CSSUnitValue`) — a BROWSER Baseline feature, NOT a sibling publish.** Chrome 66+ / Firefox 98+ / Safari 16.4+ (`AUDIT-DIGEST.md` K3 :513). The feature-detect fallback is the WHOLE point: this wave needs NO value.js / parse-that / glass-ui publish — it fires entirely on today's installed tree, with the `setProperty` path preserved bit-for-bit where Typed-OM is absent. **Pure NOW.**
- **`value.js`'s `unflattenObjectToString(flatObj, out?)` — already shipped** (`value.js/src/units/utils.ts:188-200`, the `out` reuse arg present since the O substrate). The S2 alloc-cure FLOOR consumes an EXISTING value.js surface — no VJ-P ask. (Contrast the codegen-consume P.W4 — that one IS gated.)
- **Rides ATOP P.W1's portable-perf-gate apparatus.** The `write-cost-ratio` keystone is a device-independent same-report ratio — it CANNOT be authored before P.W1 ratifies the ratio discipline + the Playwright-core perf harness. P.W1 → P.W3 is a HARD in-tranche ordering.
- **S4 Playhead rides ATOP O.W7's shrunk `engine.ts`.** O.W7 lifts the playback machine into `engine-playback.ts` (1397→~900, VJ-L1-gated). P.W3 S4 DEEPENS that shrink into the true driver-protocol transposition (the `Playhead` value-object). **P Band F (P.W11) is the accelerant** — the VJ-L1 WeakMap early-cure unblocks O.W7 NOW if value.js P slips, so S4 can proceed over the cleared seam. If O.W7 has not landed, S4 defers (the Typed-OM egress S1-S3-S5 is INDEPENDENT of the Playhead split and lands regardless).
- **Independent of P.W2.** P.W2 is the interp-arithmetic SoA fold (Phase 1); P.W3 is the DOM-write egress (Phase 2). They compose (P.W2's faster Phase-1 result flows into P.W3's faster Phase-2 write) but neither blocks the other — a SEPARATE seam, a SEPARATE gate (`proof:soa-interp` vs `proof:typed-om-eligible`).
- **Decision-JSON terminal home.** S3 records the Typed-OM verdict in `scripts/typed-om-decision.json` beside `spring-vector-decision.json` (the K1-rec P-inv-28 pattern: "Record each transposition's verdict in a decision JSON … ADOPT authorizes the engine edit, KILL records the falsification"). If the `write-cost-ratio` keystone fails to clear `≤ 0.85` on real hardware, the verdict is KILL — the transposition is NOT shipped, the falsification is recorded, and the alloc-cure FLOOR (S2) lands alone as the un-controversial O.W8 S8 graduation.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W3 — **DOCS ONLY**. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; no cross-repo edit — the Typed-OM win is a kf-internal egress transposition over a browser Baseline feature, and the `unflattenObjectToString` `out` arg is an ALREADY-shipped value.js surface, not a new ask). The IMPLEMENTATION (the `transformTargetsStyle` two-phase egress, the `_styleOut` out-buffer, the `proof:typed-om-eligible` gate, the Playhead value-object, the decision JSON) opens only on the owner's explicit authorization. When it opens it is:

- **gate-first** — `proof:typed-om-eligible` authored born-RED BEFORE the egress transposition lands (S5 precedes S1).
- **observable-truth** — the `write-cost-ratio` keystone over a REAL Chromium DOM-write trace, never a jsdom source-shape proxy (the GREEN-by-SKIP anti-pattern is the named trap); the DUAL born-RED forbids a name-only `attributeStyleMap` stub from false-greening.
- **no-legacy** — the `setProperty` path is RETAINED as the explicit feature-detect FALLBACK (not a parallel impl left to rot — it is the documented egress for non-Typed-OM realms, gated bit-for-bit by `fallback-parity`); the per-frame `Record` alloc is PURGED on both paths (the O.W8 S8 graduation).
- **KISS** — the transposition is the egress builder + the feature-detect branch + the out-buffer, not a renderer-protocol rewrite; `usesDefaultRenderer`'s bind-proof reference comparison is untouched.
- **gestalt** — ONE apply egress (`transformTargetsStyle`) with two internal write paths chosen by capability, not two renderers; the Playhead transposition (S4) formalizes the ONE driver protocol the four external drivers share.
- **P-invariant-28** — the Typed-OM verdict (ADOPT or KILL) is recorded in `typed-om-decision.json` (a terminal home, not a perpetual deferral); a KILL verdict ships the alloc-cure FLOOR alone and records the falsification, never carries the transposition forward as a bare deferral.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| `typed-om-path` | The DOM-write egress stays an unconditional `setProperty` string round-trip — every `transform` frame serializes to a string the browser then re-parses, the exact AoS waste Typed-OM eliminates |
| `out-buffer-floor` | The per-frame `Record<string,string>` alloc persists on the apply hot path (the O.W8 S8 gap rides un-implemented into P) — steady-state GC pressure on every transform animation |
| `fallback-parity` | A naive Typed-OM transposition HARD-FAILS on a non-Typed-OM realm (old browser, SSR) — the feature-detect fallback is dropped and the egress throws or silently no-ops where `attributeStyleMap` is absent |
| `write-cost-ratio` (KEYSTONE) | A STUB Typed-OM branch that re-introduces the parse (`CSSStyleValue.parse(prop, serializedString)`) passes a name-only `typed-om-path` proxy while delivering ZERO speedup — the runtime ratio that should bite the real observable (the write is faster because the parse is skipped) is silently green; OR the transposition REGRESSES the single-property case below `1.0` (the audit's named risk) |
| S4 `proof:playhead-decoupled` | O.W7's "split" stays a `this`-delegate file-shrink — the god-object coupling persists under a new filename, the four external drivers keep poking raw `startTime`/`advanceTo` fields, and `KeyframesAnimation` never becomes the thin compile-facade the K2 transposition mandates |

---

## Excluded from this wave

- **The SoA interp-arithmetic fold (P.W2).** Phase 1 (the `lerpValue`-per-iv numeric SoA) is P.W2's `proof:soa-interp` seam — a SEPARATE wave, a SEPARATE gate. P.W3 owns ONLY Phase 2 (the DOM-write egress).
- **The codegen-consume (P.W4).** The generated CSS-value parser is the GATED Band-B wave (parse-that B + value.js P). P.W3 is pure-NOW.
- **WAAPI maximalism (color-densify / computed-px-bake).** The `AUDIT-DIGEST.md` K1 :426-433 compositor-coverage expansion (lifting color/computed animations onto the compositor) is a SEPARATE compositor frontier — it perturbs `waapi.ts` eligibility, not the rAF apply egress P.W3 owns. Carried, not folded here.
- **Promoting Typed-OM to the WAAPI path.** WAAPI already bypasses the rAF apply entirely (the compositor owns the write). P.W3's Typed-OM transposition is the rAF-apply egress ONLY — the path WAAPI-ineligible animations (computed units, color interp, multi-segment easing) ride. The two are complementary, not competing.
