# Lane 01 — L.W1 Replay-equality FLOOR: re-audit for Tranche M

**Lane:** 01 · **Tranche:** M (seed audit) · **Date:** 2026-06-17  
**Branch audited:** `tranche-l-dev` (tip `529fcfd`) · **Commit containing W1:** `8e386a7`  
**Subject:** `@property` backward-serialize / per-stop `animation-composition` / named-selector
ingest / composite floor  
**Gate:** `proof:replay-equality` — confirmed GREEN (`exit 0`, re-run this session)  
**Tests:** `test/replay-equality.test.ts` — all 5 passed (re-run this session)

---

## §0 — Verdict summary

L.W1 landed FOUR of its five intended fixes correctly and idiomatically. Every
fix is verified against source. Three residual gaps survive the gate:

| Gap | Severity | Owner |
|-----|----------|-------|
| S4 named-selector: NaN frame times (deferred phase resolver NOT implemented) | Medium — semantic silence, not a throw | M (if ScrollTimeline named-range bind is in scope) |
| S2 `@property`: `compileToCSS` does not emit `@property` blocks | Medium — compile artifact incomplete | M Band A |
| S1 `!important` diagnostic: `NAMED_SELECTOR_NO_TIMELINE` typed but never thrown | Low — diagnostic gap, not a correctness hole | value.js-O #12 + M Band B |

The core fixes (S2 `CSSKeyframesToString`, S3, S5) are idiomatic and complete.
The S1 correction (spec-faithful drop) is correct per CSS Animations §3. The
born-RED gate correctly locked S2–S5; the S4 gate locked the wrong observable
(no-throw + string round-trip) and missed the NaN-frame semantic.

---

## §1 — S1: `!important` honor (the audit premise correction)

### What the spec said

L.W1 originally specified that `adapter.ts declsToVarMap` must carry
`decl.important` forward and `format.ts declaredKeyframeBody` must emit
`!important` in the serialized output.

### What implementation discovered

During L.W1 implementation the premise was found to be factually wrong.
Per CSS Animations §3 (L1 and the L2 draft), a declaration inside a `@keyframes`
rule that is qualified `!important` is **invalid and the entire declaration is
ignored**. value.js 0.13.0's `liftKeyframeMetadata` drops it at the AST level —
exactly as a browser does. Re-emitting `!important` inside a keyframe would ship
invalid CSS and animate a frame no browser renders, breaking replay-equality.

**Verified against ground truth:** `node_modules/@mkbabb/value.js/dist/parsing/stylesheet.d.ts`
— `Declaration.important: boolean` IS present in the type, but `liftKeyframeMetadata`
drops declarations where `important === true` before populating `KeyframeRule.declarations`.
The `Declaration` type carries the flag for STYLE rules (where `!important` is valid);
the keyframe path never surfaces important declarations. This is correct.

### Resolution verdict: CORRECT

The cure is spec-faithful. The test at `test/replay-equality.test.ts:S1` asserts
`not.toContain("!important")` — the regression-lock. This is the RIGHT lock.

### Residual gap: diagnostic channel

The no-silent-drop law (`inv-L-totality`) requires that a consumer can LEARN
the declaration was dropped (rather than seeing it vanish). This requires
value.js to surface the drop as a `ParseDiagnostic` on its `OnParseError`
channel **at the `liftKeyframeMetadata` call site**, which it does not do at
0.13.0. kf cannot emit the diagnostic without value.js surfacing the drop event.

The verify-lane briefly attempted a workaround (re-parsing the keyframe body as
a style-rule to detect the important flag). That workaround was correctly
REVERTED — it is the forbidden path.

**M obligation:** None on the kf side. The ask is dispatched to value.js-O as
ask #12 (`KF-TO-VALUEJS-O-ASKS.md`). The kf-side consume opens as Band-B when
value.js publishes the diagnostic. The `NAMED_SELECTOR_NO_TIMELINE` error code
is typed in `errors.ts:46` but is described for the S4 deferred-resolve use
case, not S1 — no confusion, different codes.

---

## §2 — S2: `@property` backward-serialize

### What was implemented

`format.ts` now imports `serializeStylesheetItem` from `@mkbabb/value.js`
(`format.ts:6`) and the `propertyRegistryToString` helper (`format.ts:417-433`)
walks `animation.propertyRegistry` (populated by `engine.ts:1297` from
`resolved.properties` via `extractProperties`) and emits one `@property` block
per entry. `CSSKeyframesToString` prepends these blocks before the `.class` and
`@keyframes` output (`format.ts:479-483`).

**Verified against source:** the import is in the value.js import block
(`format.ts:1-11`), the helper is called from `CSSKeyframesToString`
(`format.ts:480`), and the test passes (`S2` in `replay-equality.test.ts:51-60`).

### Residual gap: `compileToCSS` does NOT emit `@property` blocks

**L.W1.md lines 118-123 stated:** "Similarly `compileToCSS` must include them
in the emitted CSS artifact."

**Ground truth (verified by live test this session):** `compile.ts` has ZERO
references to `propertyRegistry` or `serializeStylesheetItem`. When a
`CSSKeyframesAnimation` with a `@property --hue` block is passed to
`compileToCSS([a])`, the emitted CSS artifact contains only the `@keyframes`
block and the `.class` shorthand — the `@property` typing block is silently
absent.

**Evidence:**
- `src/animation/compile.ts` — `grep propertyRegistry`: zero results
- Live test (this session): `compileToCSS` output on a `@property`-bearing
  animation does not contain `@property --hue`
- `proof:compile-replay` does NOT check for `@property` emission in
  `compileToCSS` — the gate does not bite on this gap

**Impact:** A consumer who calls `compileToCSS` to produce a CSS artifact for
deployment loses the `@property` typing block. In a browser, `--hue` falls back
to the `<universal>` type, CSS transitions on it stop being type-aware, and
`@property`-typed interpolation breaks. This is a correctness gap, not cosmetic.

**M obligation:** Wire `@property` block emission into `compileToCSS`.
`compile.ts` must reach `animation.propertyRegistry` for each child and prepend
the blocks to the child's chunk (or to the aggregated artifact). The
`propertyRegistryToString` helper in `format.ts` already encapsulates the
emit logic — it can be called from `compileChild`. A born-RED gate clause on
`proof:compile-replay` or a new `proof:compile-property` asserts the fix.

---

## §3 — S3: per-stop `animation-composition` serialize symmetry

### What was implemented

`declaredKeyframeBody` in `format.ts:113-116` now reads `templateFrame.composition`
and emits `animation-composition: <op>;` for any stop where the operator is
non-`replace` (the CSS default). The emit is symmetric with the per-stop
`animation-timing-function` emit above it. The `premultipliedKeyframesBlock`
function (`format.ts:335-336`) also carries the same emit.

**Verified against source:** `format.ts:113-116`; test at `replay-equality.test.ts:S3` passes.

### Correctness

The coalescing in `CSSKeyframesToString` and `keyframesBlock` groups stops by
body string equality. Two stops with different `animation-composition` values
will produce different body strings and NOT coalesce — correct.

The adapter (`adapter.ts:241-246`) captures `rule.composition` into the
`composition` Map; `engine.ts:1353` threads it as the `composition` argument to
`addFrame`; `frame-compiler.ts:269` stores it on `templateFrame`. The full
pipeline is wired.

**No residual gaps in S3.** The cure is complete and idiomatic.

---

## §4 — S4: named-selector ingest (the NaN-frame residual gap)

### What was implemented

`frame-compiler.ts:117-118` adds `SELECTOR_NAMED_RANGE_RE =
/^(?:entry|exit|cover|contain)(?:\s+\d+(?:\.\d+)?%)?$/i`. When a selector
matches this regex, `addFrame` stores it as `new ValueUnit(selector, undefined,
[NAMED_SELECTOR_SUPERTYPE])` instead of calling `parseCSSValueUnit(selector)`
(which THROWS on `entry`). The gate asserts the named-range token set appears
in the guard (`frame-compiler.ts` named-selector clause), tests no-throw, and
asserts the serialized output contains `entry` and `exit`.

**Verified:** the test passes, the serializer emits the correct strings via
`String(templateFrame.start)` which calls `ValueUnit.toString()` → `"entry"`.

### Critical residual gap: NaN frame times

The L.W1 spec (lines 191-196) describes a "resolve at parse() time when
timeline present" strategy. **This is NOT implemented.** Evidence:

1. `new ValueUnit("entry", undefined, ["named-selector"])` stores `value = "entry"` (a
   string, verified by live probe this session with `node --input-type=module`).
2. `frame-compiler.ts:449` sorts by `a.start.value - b.start.value` — `"entry" - "exit"` = NaN.
3. `calcFrameTime` at `utils.ts:403` computes `start.value * duration / 100` — `"entry" * 1000 / 100` = NaN.
4. A live probe (this session) confirms: `frame.time = { start: NaN, stop: NaN }`.
5. `binarySearchRange` with NaN range: `value < NaN` = false, `value > NaN` = false → the
   frame is treated as **always active** (every t matches). A named-selector animation does
   not throw, but any call to `interpFrames(t)` will always "hit" the NaN frame and apply
   its values at every progress position — the animation is semantically wrong, not a correct
   scroll-driven animation.

**The `NAMED_SELECTOR_SUPERTYPE` tag is stored but NEVER READ.** The comments in
`frame-compiler.ts:113-128` describe a deferred-resolve mechanism ("the superType
tag is the channel the deferred phase resolver keys on"), but neither `parse()`,
`engine.ts`, nor `timeline.ts` has any code that checks for the tag or resolves
named selectors to a numeric `%`. `NAMED_SELECTOR_NO_TIMELINE` is typed in
`errors.ts` but never thrown — it is a forward declaration without an
implementation.

**The S4 gate only tests:**
1. No throw on `fromString(css)` ✓
2. The output contains `"entry"` and `"exit"` (string round-trip) ✓

**The gate does NOT test:**
- That `frame.time` values are valid (not NaN)
- That `interpFrames(t)` returns meaningful values
- That `NAMED_SELECTOR_NO_TIMELINE` is thrown when a numeric position is
  demanded without a timeline

The "no-throw floor" is correctly established. But the "deferred phase resolver"
described in the spec is missing, leaving NaN-poisoned frames in the compiled
state.

**Impact assessment:** Moderate. A bare named-selector animation with no
`ScrollTimeline` attached produces NaN frame times. `binarySearchRange` with NaN
returns the frame as always-active, so the animation plays with wrong progress.
This is invisible to the gate and to the `validate(css)` verb (which only checks
parseability, not frame-time soundness).

**M obligation:** The deferred phase resolver must be implemented. Two paths:

- **Path A (minimal / M Band A):** At `parse()` time, detect frames with
  `start.superType === NAMED_SELECTOR_SUPERTYPE`. If none, no-op. If any and no
  `ScrollTimeline` is attached, throw `AnimationOptionError(code:
  "NAMED_SELECTOR_NO_TIMELINE")` instead of producing NaN frames. This replaces
  the current silent NaN with an honest structured error — the deferred-contextual
  throw the spec described.

- **Path B (full / M or later):** Map named selectors to numeric `%` via the
  `ScrollTimeline` phase-range mapper when a timeline is attached (the K.W9
  substrate). This requires `parse()` to accept an optional timeline parameter
  or a post-parse "bind timeline" call that re-resolves NaN starts. Path B
  closes the full named-range usability.

Path A is a born-RED fix within M's scope. Path B composes the K.W9 timeline
mapper and is the full scroll-driven named-range round-trip. The M wave spec
should distinguish the two as sub-clauses.

---

## §5 — S5: `composite` on `AnimationOptions` (Band A)

### What was implemented

`constants.ts:203` adds `composite?: CompositeOperator` to `AnimationOptions`.
`constants.ts:214` adds `iterationComposite?: never` as the typed tripwire for
the BOOKED L2 property. `engine-css-metadata.ts:70-71` maps
`opt.composition` (from value.js `CSSAnimationOptions`) to `base.composite` in
`recoverAnimationOptionsBase`. `engine.ts:538-542` adds `setComposite` and
`setOptions` at `:555` calls it. `format.ts:199-205` emits
`animation-composition: <op>` via `animationComposition` when `options.composite`
is non-default.

**Verified against source:** all six sites confirmed. Test at
`replay-equality.test.ts:S5` passes: `options.composite === "add"` and the output
contains `animation-composition: add`.

### The `playState` split

The W1.md spec (lines 229-235) correctly identified that `animation-play-state`
is NOT surfaced by value.js 0.13.0. Verified against
`node_modules/@mkbabb/value.js/dist/parsing/extract.d.ts:8-17` — `CSSAnimationOptions`
carries `composition` but no `playState`. The `playState` ingest path is
correctly dispatched to value.js-O as ask #11.

### The `iterationComposite?: never` tripwire

The typed `never` at `constants.ts:214` is idiomatic — a future assignment to
the field fails the TypeScript type check, forcing a real `proof:iteration-composite-baseline`
gate rather than a silent-wrong implementation. This is correct.

**No residual gaps in S5.** The Band A half is complete.

---

## §6 — Precept audit (L.W1 as-built)

### P1: No quick solutions / workarounds

**VIOLATION found:** The `NAMED_SELECTOR_SUPERTYPE` mechanism is a structural
placeholder — the comment describes a real mechanism ("the superType tag is the
channel the deferred phase resolver keys on"), but the resolver itself is absent.
The stored tag is dead code today. This is not an idiomatic deferred
implementation; it is a forward declaration without a body. The effect is a
silent NaN-frame state that the gate does not catch.

This is a **gate-blind-spot** (the same class as the Lane 33 finding that
motivated L.W1): the born-RED gate tested the wrong observable (no-throw + string)
and missed the semantic correctness of frame times.

**Evidence:** `frame-compiler.ts:128` defines `NAMED_SELECTOR_SUPERTYPE = "named-selector"`;
it is written to `addFrame` but never read in `parse()`, `engine.ts`, or
`timeline.ts`. `errors.ts:46` defines `NAMED_SELECTOR_NO_TIMELINE` but it is
never thrown.

### P2: No legacy code

No legacy code found in the W1 sites. The pre-L selector guard (`SELECTOR_KEYWORD_RE`
only) was correctly extended, not patched. `declsToVarMap` was not changed (the
`!important` correction confirmed it should not be). The `propertyRegistryToString`
helper is new and cohesive.

### P3: Architectural gestalt

**S3 (per-stop composition)** and **S5 (composite floor)** are both idiomatic
one-authority fixes — the existing `animationComposition` helper is reused, the
pipeline is extended cleanly. No redundancy.

**S2 `@property` in `CSSKeyframesToString`** is correctly done: it uses value.js's
own `serializeStylesheetItem` (the published inverse), not a bespoke `@property`
re-derivation. This is the right gestalt.

**S2 `@property` in `compileToCSS`** is the missing half — a cohesive, symmetric
fix that was planned but not implemented.

### P4: `inv ε` (every claim cites an observed oracle)

The L.W1 CORRECTION section in `L.W1.md:57-77` is exemplary inv-ε handling —
the wrong premise is retained for the audit trail, the correction is cited against
the live CSS spec + value.js source, and the gate change is documented.

The NaN-frame situation is an inv-ε gap: the FINAL.md §S1 (`docs/tranches/L/FINAL.md:57`)
states "named keyframe selectors (`entry/exit/cover/contain`) ingest without
throwing" — this is TRUE. It does NOT claim the frames are semantically correct
(frame times are valid numbers). The overclaim is subtle but present: "ingest
without throwing" implies the animation is usable, which the NaN-frame state
contradicts.

---

## §7 — Deferred folds for M

| Item | Code location | M obligation |
|------|--------------|--------------|
| `compileToCSS` `@property` gap | `src/animation/compile.ts` (absent) | M Band A: wire `propertyRegistryToString` into `compileChild`; add gate clause |
| S4 NaN-frame deferred phase resolver (Path A: structured throw) | `src/animation/frame-compiler.ts:446-488` (`parse()`) | M Band A: detect `NAMED_SELECTOR_SUPERTYPE` frames at `parse()`, throw `NAMED_SELECTOR_NO_TIMELINE` if no timeline |
| S4 NaN-frame full ScrollTimeline bind (Path B) | `src/animation/frame-compiler.ts` + `engine.ts` + `timeline.ts` | M Band B (or later): map named selectors → numeric `%` via K.W9 phase mapper on timeline attach |
| S1 `!important` diagnostic | `src/animation/adapter.ts:resolveKeyframes` | M Band B (value.js-O #12 tripwire): fold the value.js `OnParseError` row into `ResolvedKeyframes.diagnostics` |
| `proof:replay-equality` S4 gate tightening | `scripts/proof-replay-equality.mjs` | M: add a behavioral clause asserting frame times are NOT NaN after named-selector ingest (or that `NAMED_SELECTOR_NO_TIMELINE` is thrown) |

---

## §8 — Cross-repo asks

### value.js-O (already dispatched in `KF-TO-VALUEJS-O-ASKS.md`)

| Ask # | Topic | Status |
|-------|-------|--------|
| #4 | `@property` typed grammar — `serializeStylesheetItem` typed `initial-value` produce | Partially consumed (kf already uses `serializeStylesheetItem`); the typed widening is the O ask |
| #11 | `animation-play-state` grammar — surface `playState` on `CSSAnimationOptions` | Blocking kf S5 `playState` half; NOT a kf workaround (0.13.0 simply lacks the parse) |
| #12 | Invalid-keyframe-decl diagnostic (`!important` drop) | Blocking kf S1 diagnostic; NOT a workaround — value.js must surface the drop event |

### parse-that

None specific to W1. The direct `parse-that` dependency in `utils.ts` (ask #8) is
unrelated to the replay-equality surface.

### glass-ui

None. W1 is a pure engine/format fix.

---

## §9 — M-wave proposals

### M.W1-candidate: `compileToCSS` `@property` + S4 NaN-floor (the compile-surface totality)

**Rationale:** L.W1's "replay-equality FLOOR" was scoped to the `CSSKeyframesToString`
path. The `compileToCSS` path is the production-deploy surface (the "zero-runtime CSS
artifact") and shares the same gap: a `@property`-bearing animation compiled to CSS
for deployment silently omits the typing block. This is a correctness hole on the
primary compile artifact, not a secondary serializer.

The S4 NaN-floor (Path A: structured throw at `parse()` for unresolvable named
selectors) belongs in the same wave: it is a one-function fix in `frame-compiler.ts`
that closes the "silent wrong state" the current deferred-but-absent resolver
introduces. Together these make the round-trip total on the COMPILE surface.

**Scope:** 
- `compile.ts compileChild` (or `walkGroup`/`walkList`) — prepend `@property` blocks
  from each child's `propertyRegistry` to the chunk
- `frame-compiler.ts parse()` — check for `NAMED_SELECTOR_SUPERTYPE` frames, throw
  `NAMED_SELECTOR_NO_TIMELINE` if present and no timeline has resolved them
- `proof:compile-replay` — add a `@property` clause; add a S4-NaN clause to
  `proof:replay-equality`
- Test: `test/compile-roundtrip.test.ts` new `@property` fixture; `test/replay-equality.test.ts`
  new NaN-rejection assertion

**Born-RED gate:** `compileToCSS` without the fix outputs CSS missing `@property` blocks
(observed, verified). `interpFrames` with named selectors silently returns always-active
frames (observed, verified). Both are clean born-RED discriminants.

**No new sibling gate:** value.js 0.13.0 already has `serializeStylesheetItem` (used in
`format.ts`). The compile path just needs to call it.

### M.W-ScrollTimeline-bind-candidate (Band B or later): S4 Path B full resolution

Full ScrollTimeline named-range selector → numeric `%` mapping, requiring the K.W9
`ScrollTimeline` phase-range mapper to be wired into `parse()` or a post-parse
`bindTimeline(timeline)` call. This is a separate wave because it requires the
K.W9 substrate and is not needed for the born-RED floor.

---

## §10 — Performance numbers

None measured in this audit. The W1 fixes are serializer-path additions
(serialize-only, not hot-path). The NaN-frame situation in S4 is a correctness gap
that could make named-selector animations "always active" — a runtime semantic error,
not a measurable perf issue. The `@property` emission gap in `compileToCSS` is a
compile-path gap, not hot-path.

---

## §11 — Evidence anchors

| Claim | Source | Verified |
|-------|--------|---------|
| S1 correction: `!important` in keyframes is invalid per CSS Animations §3 | CSS Animations Level 1 §3 + value.js `liftKeyframeMetadata` | Yes — behavior test (`not.toContain`) passes |
| S2 `serializeStylesheetItem` import in `format.ts` | `src/animation/format.ts:6` | Yes — in import block |
| S2 `propertyRegistryToString` called from `CSSKeyframesToString` | `src/animation/format.ts:480` | Yes |
| S2 `compileToCSS` gap: no `@property` emission | `src/animation/compile.ts` (zero grep hits for `propertyRegistry`) | Yes — live test confirmed |
| S3 per-stop composition emit in `declaredKeyframeBody` | `src/animation/format.ts:113-116` | Yes |
| S4 `SELECTOR_NAMED_RANGE_RE` addition | `src/animation/frame-compiler.ts:117-118` | Yes |
| S4 NaN frame times for named selectors | `src/animation/utils.ts:403`, `frame-compiler.ts:449` | Yes — live probe: `frame.time = { start: NaN, stop: NaN }` |
| S4 `NAMED_SELECTOR_SUPERTYPE` tag never read | All `src/animation/*.ts` files | Yes — grep zero results for reads |
| S4 `NAMED_SELECTOR_NO_TIMELINE` never thrown | `src/animation/internal/errors.ts:46`, `frame-compiler.ts` | Yes — grep zero throw sites |
| S4 NaN frame always-active via `binarySearchRange` | `src/animation/internal/binarySearch.ts:28-35` | Yes — NaN arithmetic analysis + node probe confirmed |
| S5 `composite?: CompositeOperator` on `AnimationOptions` | `src/animation/constants.ts:203` | Yes |
| S5 `iterationComposite?: never` tripwire | `src/animation/constants.ts:214` | Yes |
| S5 `recoverAnimationOptionsBase` maps `opt.composition` → `base.composite` | `src/animation/engine-css-metadata.ts:70-71` | Yes |
| S5 `setComposite` setter + `setOptions` wiring | `src/animation/engine.ts:538-555` | Yes |
| S5 `animationOptionsToString` emits `animation-composition` | `src/animation/format.ts:199-205` | Yes |
| value.js 0.13.0 `CSSAnimationOptions` has `composition` but no `playState` | `node_modules/@mkbabb/value.js/dist/parsing/extract.d.ts:8-17` | Yes |
| `proof:replay-equality` GREEN | `node scripts/proof-replay-equality.mjs` → exit 0 | Yes — re-run this session |
| All 5 replay-equality tests pass | `npx vitest run test/replay-equality.test.ts` | Yes — re-run this session |
