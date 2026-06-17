# M.W5 — Compile-surface totality (the round-trip the L gates missed)

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:**
  value.js 0.13.0 (already pinned — has `serializeStylesheetItem`, the published
  `@property` inverse; NO sibling publish gate). Parallel with M.W6 ∥ M.W7 (the
  three Band-B kf-internal correctness waves, value.js-0.13.0-sufficient). Composes
  with M.W1's report-all runner but does NOT require it.
- **Gate (extended + tightened):** `proof:replay-equality` — (a) a NEW `compileToCSS`
  `@property`-emission clause, born-RED because `compile.ts` has ZERO
  `propertyRegistry`/`serializeStylesheetItem` references (`grep propertyRegistry
  src/animation/compile.ts` → 0, verified 2026-06-17); (b) the EXISTING S4
  named-selector clause RE-TARGETED off its source-shape proxy onto the REAL NaN
  observable — assert `frame.time.start`/`.stop` are NOT NaN after named-selector
  ingest OR the `NAMED_SELECTOR_NO_TIMELINE` throw fires (inv-M-observable-truth).
- **Folds (lane #):** lane-01 §2 (the `compileToCSS` `@property` compile-artifact
  gap) · lane-01 §4 (the S4 NaN-frame dead-code; Path A the structured throw) ·
  lane-01 §6 P1 (the `NAMED_SELECTOR_SUPERTYPE` placeholder-masquerading-as-wiring)
  · lane-01 §7 (the two M-obligation rows) · lane-01 §9 (the M.W1-candidate proposal).
- **Precept cure:** ⚠M1 (`frame-compiler.ts:128` — `NAMED_SELECTOR_SUPERTYPE`
  written-never-read, `NAMED_SELECTOR_NO_TIMELINE` typed-never-thrown; the
  no-workaround / inv-M-observable-truth violation).

---

## Context

L.W1 shipped the "replay-equality FLOOR" and its `proof:replay-equality` gate went
GREEN. The 32-lane re-audit live-probed the surface the gate could not see and
found TWO real breaches the green gate missed — both on this wave's surface
(lane-01 §0 verdict: "L.W1 landed FOUR of its five intended fixes correctly… three
residual gaps survive the gate"). Each is the same failure class the tranche is
named to cure: **the gate tested a proxy, not the observable that actually breaks.**

**Breach 1 — the `@property` compile-artifact gap (lane-01 §2).** L.W1 S2 wired
`@property` backward-serialize into the `CSSKeyframesToString` path
(`format.ts:480` calls `propertyRegistryToString`, which emits each registry entry
via value.js's published `serializeStylesheetItem` — `format.ts:417-433`). But
L.W1.md lines 118-123 ALSO specified "`compileToCSS` must include them in the
emitted CSS artifact" — and that half was never built. Ground truth (verified
2026-06-17): `src/animation/compile.ts` has **zero** references to
`propertyRegistry` or `serializeStylesheetItem` (`grep` → 0 hits). When a
`CSSKeyframesAnimation` carrying a `@property --hue { … }` block is passed to
`compileToCSS([a])`, the emitted CSS artifact contains only the `@keyframes` block
and the `.class` shorthand — the `@property` typing block is **silently absent**.
`compileToCSS` is the production-deploy surface (the zero-runtime CSS artifact), so
this is a correctness hole on the PRIMARY compile artifact, not a secondary
serializer: a consumer who deploys the compiled CSS loses the custom-property
typing, `--hue` falls back to the `<universal>` type, and `@property`-typed
transitions/interpolation stop being type-aware in the browser (lane-01 §2 impact).

**Breach 2 — the named-selector NaN-frame dead code (lane-01 §4, §6 P1).** L.W1 S4
stopped scroll-range named selectors (`entry`/`exit`/`cover`/`contain`) from
THROWING in `addFrame`: a matching selector is stored as
`new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` with `value` = the
raw STRING (`frame-compiler.ts:228-231`). The L.W1 spec (lines 191-196) described a
"resolve at parse() time when timeline present" deferred-phase resolver keyed on
the `superType` tag — but **that resolver was never implemented**. The stored tag
is dead code:

1. `new ValueUnit("entry", undefined, ["named-selector"])` stores `value = "entry"`
   (a STRING — verified by live node probe, lane-01 §4 / §11).
2. `parse()` sorts `templateFrames` by `a.start.value - b.start.value`
   (`frame-compiler.ts:449`) — `"entry" - "exit"` = NaN.
3. `calcFrameTime` computes `(start.value * duration) / 100`
   (`utils.ts:403`) — `"entry" * 1000 / 100` = NaN.
4. A live probe confirms `frame.time = { start: NaN, stop: NaN }` (lane-01 §4).
5. `binarySearchRange` over a NaN range: `value < NaN` = false AND `value > NaN` =
   false → the frame is treated as **always active** (every `t` matches). A bare
   named-selector animation with no `ScrollTimeline` does not throw, but
   `interpFrames(t)` ALWAYS hits the NaN frame and applies its values at every
   progress position — semantically wrong, NOT a correct scroll-driven animation
   (`binarySearch.ts:28-35`, NaN arithmetic + node probe, lane-01 §11).

`NAMED_SELECTOR_SUPERTYPE = "named-selector"` (`frame-compiler.ts:128`) is WRITTEN
to `addFrame` but never READ in `parse()`, `engine.ts`, or `timeline.ts`.
`NAMED_SELECTOR_NO_TIMELINE` is typed in `errors.ts:46` (a real
`AnimationOptionErrorCode`) but **never thrown** — a forward declaration without a
body (lane-01 §6 P1: "a placeholder masquerading as wiring… the stored tag is dead
code today"). This wave implements **Path A** (lane-01 §4): the minimal structured
throw — detect `NAMED_SELECTOR_SUPERTYPE` frames at `parse()` time and, if no
timeline has resolved them, throw `AnimationOptionError(code:
NAMED_SELECTOR_NO_TIMELINE)` instead of producing NaN frames. Path B (the full
`ScrollTimeline` named-range → numeric `%` bind over the K.W9 phase mapper) is a
SEPARATE later wave (it needs the K.W9 substrate threaded into `parse()`/a
post-parse `bindTimeline` call) and is explicitly EXCLUDED below — Path A is the
born-RED floor that replaces the silent-NaN with an honest error.

**The proxy the audit indicts (lane-01 §4 "The S4 gate only tests").** Today's
`proof:replay-equality` S4 clause (`proof-replay-equality.mjs:173-178`) asserts a
**source-shape regex** — `re: /entry\s*\|\s*exit\s*\|\s*cover\s*\|\s*contain/` over
`frame-compiler.ts` — i.e. "the named-range token set APPEARS in the guard." The
companion test (`test/replay-equality.test.ts:75-87`) asserts only (1) no throw on
`fromString(css)` and (2) the serialized output `toContain("entry")`/`("exit")` (a
string round-trip). NEITHER tests that `frame.time` is a valid number, NEITHER
calls `interpFrames`, NEITHER expects the structured throw. This is **exactly** the
inv-M-observable-truth keystone failure: the L.W1 S4 gate "tested no-throw + string
round-trip while the real breach was NaN frame-times" (M.md §inv-M-observable-truth;
charter ⚠M1). The gate this wave authors must bite the NaN.

### Audit evidence

| Ref | Source location | Fact |
|-----|-----------------|------|
| lane-01 §2 | `grep propertyRegistry src/animation/compile.ts` | **ZERO** hits — `compile.ts` never reaches `propertyRegistry`/`serializeStylesheetItem` (re-verified 2026-06-17) |
| lane-01 §2 | `src/animation/compile.ts:485,515` | `compileToCSS` loops `compileChild(child, opts, refusals)` per child → `chunks.join("\n\n")`; no `@property` prepend |
| lane-01 §2 | `src/animation/format.ts:417-433,480` | `propertyRegistryToString(animation)` exists + is called from `CSSKeyframesToString` — but is a **non-exported** module-local `function` (the emit authority to reuse) |
| lane-01 §4 | `src/animation/frame-compiler.ts:228-231` | `addFrame` stores a named selector as `new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` — `value` = the raw STRING |
| lane-01 §4 | `src/animation/frame-compiler.ts:449` | `parse()` sorts by `a.start.value - b.start.value` → `"entry" - "exit"` = NaN |
| lane-01 §4 | `src/animation/utils.ts:403` | `calcFrameTime`: `(start.value * duration) / 100` → `"entry" * 1000 / 100` = NaN |
| lane-01 §4 / §6 P1 | `src/animation/frame-compiler.ts:128` | `NAMED_SELECTOR_SUPERTYPE = "named-selector"` WRITTEN, never READ in `parse()`/`engine.ts`/`timeline.ts` |
| lane-01 §6 P1 | `src/animation/internal/errors.ts:46` | `NAMED_SELECTOR_NO_TIMELINE` is a typed `AnimationOptionErrorCode`, never THROWN (grep zero throw sites) |
| lane-01 §11 | `src/animation/internal/binarySearch.ts:28-35` | a NaN frame range → `binarySearchRange` returns the frame as ALWAYS-active (NaN comparison analysis + node probe) |
| lane-01 §4 | `scripts/proof-replay-equality.mjs:173-178` | the S4 clause is a SOURCE-SHAPE regex (`/entry\|exit\|cover\|contain/`) — the proxy, not the observable |
| lane-01 §4 | `test/replay-equality.test.ts:75-87` | S4 asserts no-throw + `toContain("entry"/"exit")` only — never frame-time soundness, never `interpFrames`, never the throw |
| dep | `node_modules/@mkbabb/value.js/dist/index.d.ts:39` | `serializeStylesheetItem` is a published top-level export — value.js 0.13.0 sufficient, NO sibling gate |
| ground truth | `node_modules/@mkbabb/value.js/dist/units/index.d.ts:9` | `ValueUnit.superType?: string[] \| undefined` — `parse()` can read `frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)` |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they make the
round-trip TOTAL on the COMPILE surface and replace the named-selector silent-NaN
with an honest structured error.

### S1 — `compileToCSS`/`compileChild` emit the `@property` typing blocks

**Breach.** `compile.ts` never reaches `animation.propertyRegistry`; a
`@property`-bearing `CSSKeyframesAnimation` compiled via `compileToCSS([a])` drops
its `@property` block (the `CSSKeyframesToString` path emits it, the compile path
does not — an asymmetry on the production-deploy artifact). `compile.ts:485,515` +
`grep` → 0 `propertyRegistry` hits (verified 2026-06-17).

**Cure.** `compileChild` (`compile.ts:292`, returns `string | null`) prepends each
child animation's `@property` blocks to the child's chunk by reusing the EXISTING
`propertyRegistryToString(child.animation)` helper — NOT a bespoke `@property`
re-derivation. This requires `propertyRegistryToString` to become an EXPORTED
member of `format.ts` (today a module-local `function` — `format.ts:417`); the
import is added to `compile.ts`'s existing `format.ts` import block. The blocks
prepend to the child chunk so an empty registry yields `""` (the helper already
returns `""` for a plain `Animation` / empty registry — lane-01 §2 /
`format.ts:425`) and a non-`@property` animation's chunk is byte-identical to
today. The single-authority gestalt: value.js's `serializeStylesheetItem` is the
ONE `@property` inverse, `propertyRegistryToString` is the ONE keyframes-side
wrapper, and BOTH serialize surfaces (`CSSKeyframesToString` + `compileChild`) call
it — no second emit path (the right gestalt per lane-01 §6 P3).

**Constraint (the registry lives on `CSSKeyframesAnimation` only).**
`propertyRegistry` is a field on `CSSKeyframesAnimation`, not the base `Animation`;
`propertyRegistryToString` already narrows via an optional-field cast and returns
`""` when absent (`format.ts:420-425`). `compileChild` operates on
`child.animation: Animation<V>` — the same optional access holds, no new type seam,
no `instanceof` branch needed.

**Gate bite (S5 coverage).** A `compileToCSS([a])` over a `@property --hue { … }`
animation asserts the emitted `css` `.toContain("@property --hue")` AND contains the
`@keyframes` block. Today (no wiring) the `@property` block is absent → RED. After
cure → GREEN. A plain (no-`@property`) animation's compiled `css` is unchanged
(regression-lock).

---

### S2 — `parse()` throws `NAMED_SELECTOR_NO_TIMELINE` instead of producing NaN frames (Path A)

**Breach.** A bare named-selector `@keyframes` (no `ScrollTimeline` attached) ingests
without throwing but produces `frame.time = { start: NaN, stop: NaN }`
(`frame-compiler.ts:449` sort → `utils.ts:403` `calcFrameTime`), and
`binarySearchRange` treats the NaN range as ALWAYS-active — every `interpFrames(t)`
applies the frame's values at every progress position (lane-01 §4). The
`NAMED_SELECTOR_SUPERTYPE` tag (`frame-compiler.ts:128`) and the
`NAMED_SELECTOR_NO_TIMELINE` error code (`errors.ts:46`) are both present but
inert — the deferred resolver the L.W1 comment promised was never written.

**Cure (Path A — the structured throw, lane-01 §4 / §7).** In `parse()`
(`frame-compiler.ts:446`), BEFORE the `templateFrames.sort` that produces the NaN
ordering, scan the template frames for any `start.superType?.includes(
NAMED_SELECTOR_SUPERTYPE)`. If none → no-op (zero behavior change for every
non-named animation — the common path is untouched). If any such frame exists AND
no timeline has resolved it to a numeric `%`, throw `new AnimationOptionError(…,
code: "NAMED_SELECTOR_NO_TIMELINE")` — the honest structured error that replaces the
silent NaN. The `NAMED_SELECTOR_SUPERTYPE` tag stored at `addFrame` (dead code
today) becomes LIVE — read at the parse seam, discharging the
written-never-read / typed-never-thrown placeholder (⚠M1). The error message names
the offending selector(s) and states that a named scroll-range selector requires a
`ScrollTimeline` to resolve to a numeric position.

**Constraint (Path A only; Path B is a separate later wave).** This wave does NOT
map named selectors to numeric `%` via the K.W9 `ScrollTimeline` phase mapper — that
is Path B (lane-01 §4 / §9), which requires `parse()` to accept an optional timeline
or a post-parse `bindTimeline(timeline)` re-resolve, and is EXCLUDED here. Path A's
contract is exact: a named-selector animation that CANNOT be resolved (no timeline)
**fails-explicit** rather than silently NaN-poisoning. When Path B later lands, the
throw becomes conditional on "no timeline bound" — the `superType` read site this
wave creates is the seam Path B extends, NOT re-architects.

**Constraint (fail-explicit, consistent with the engine's option seam).** The throw
is the SAME `AnimationOptionError` class the engine already raises for malformed
present input (`engine.ts` setters, `errors.ts:49` — "malformed present input throws
a typed `AnimationOptionError`; genuine omission defaults"). A named selector
WITHOUT a timeline is malformed-present (an unresolvable position was authored), so
the throw is idiomatic — not a new error taxonomy. No silent drop, no invented
number (lane-01 §4: "this replaces the current silent NaN with an honest structured
error").

**Gate bite (S5 coverage).** `new CSSKeyframesAnimation().fromString("@keyframes x {
entry { opacity: 0 } exit { opacity: 1 } }")` then `parse([])` throws
`AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"`. Today: it does
NOT throw — it produces NaN frames (the planted-RED witness is the NaN itself; see
S3). After cure: the throw fires.

---

### S3 — Tighten `proof:replay-equality` S4 to the REAL observable (inv-M-observable-truth)

**Breach.** The S4 gate clause (`proof-replay-equality.mjs:173-178`) tests a
SOURCE-SHAPE proxy — `re: /entry\s*\|\s*exit\s*\|\s*cover\s*\|\s*contain/` over the
`frame-compiler.ts` guard — which GREENs on "the token set appears in the source"
and is BLIND to whether frame times are NaN (lane-01 §4: "the S4 gate locked the
wrong observable"). The companion test (`test/replay-equality.test.ts:75-87`)
asserts only no-throw + string round-trip. This is the L.W1-S4 proxy failure the
tranche is named to cure (M.md §inv-M-observable-truth).

**Cure (the behavioral assertion, NOT the proxy).** Re-target S4 onto the genuine
breach. The disjunctive contract S2 establishes — **resolve OR refuse, never
NaN-always-active** — is asserted directly in `test/replay-equality.test.ts` (the
behavior the node gate's `proof:replay-equality` rides, per the existing
"no-source-edit" seam at `proof-replay-equality.mjs:196-211` that requires the test
to import the REAL engine + format surfaces). For the bare named-selector fixture
(`@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }`), assert EXACTLY ONE of:

1. **the throw fires** — `parse([])` throws `AnimationOptionError` with `code ===
   "NAMED_SELECTOR_NO_TIMELINE"` (the Path-A cure), OR
2. **every `frame.time.start`/`frame.time.stop` is a finite number** (`Number.isNaN`
   is false for all) — for the day Path B resolves them to numeric `%`.

The assertion FAILS when frame times are NaN AND no throw fired — the present
always-active state. The old source-shape regex clause in
`proof-replay-equality.mjs` is REPLACED (not kept beside) by an anchor that
verifies the throw/finite contract is exercised by the test (the gate's role is to
hold the behavior test to the real surface — lane-01 §7 "add a behavioral clause
asserting frame times are NOT NaN after named-selector ingest (or that
`NAMED_SELECTOR_NO_TIMELINE` is thrown)").

**Constraint (born-RED on TODAY's tree — the keystone).** The tightened assertion
MUST be authored FIRST and witnessed RED before S2's cure. On today's tree, the
named-selector fixture neither throws nor yields finite frame times — `parse([])`
yields `frame.time = { start: NaN, stop: NaN }` (lane-01 §4 live probe). So the
"throw OR finite" assertion FAILS today (neither disjunct holds) — the genuine NaN
defect is the born-RED witness, not a proxy for it (inv-M-observable-truth
discharged). A gate that merely greps for "the throw exists in source" would repeat
the L.W1-S4 mistake and is forbidden.

**Gate bite (S5 coverage).** Plant the cure (S2) → the throw disjunct holds → GREEN.
Revert the cure → NaN frames, no throw → both disjuncts fail → RED. The assertion
discriminates the EXACT state the cure changes.

---

## Born-RED gate

**Gate:** `proof:replay-equality` (EXISTING — `scripts/proof-replay-equality.mjs` +
its behavior twin `test/replay-equality.test.ts`; this wave EXTENDS the
`@property`-compile clause and RE-TARGETS the S4 named-selector clause). The gate is
GREEN on today's tree against the WRONG observables (lane-01 §0: "`proof:replay-equality`
confirmed GREEN… the S4 gate locked the wrong observable"). After this wave's
tightening it goes RED on today's tree until S1+S2 land.

**The REAL observable (inv-M-observable-truth).** The born-RED witness is the GENUINE
defect, live-probed, NOT a proxy:

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after cure |
|--------|-------------------------|------------------------------------------|---------------------|
| S1 `@property` compile | `compileToCSS([a])` over a `@property --hue` animation; assert `css.includes("@property --hue")` | `compile.ts` has 0 `propertyRegistry` hits → the `@property` block is **silently absent** from the artifact (live test, lane-01 §2) | the compiled `css` contains the `@property --hue` block + the `@keyframes` block |
| S2 / S3 named-selector | `fromString("@keyframes x { entry {…} exit {…} }")` then `parse([])`; assert throw `NAMED_SELECTOR_NO_TIMELINE` OR all `frame.time` finite | NO throw fires AND `frame.time = { start: NaN, stop: NaN }` (live node probe, lane-01 §4) → `binarySearchRange` treats the frame as **always-active** | `parse([])` throws `AnimationOptionError(code: NAMED_SELECTOR_NO_TIMELINE)` (Path A); the disjunct holds |

**Today's tree result.** With the S4 clause re-targeted off the source-shape proxy,
`proof:replay-equality` exits non-zero: the named-selector fixture neither throws
nor produces finite frame times (the live NaN state), and `compileToCSS` over a
`@property` animation omits the typing block. The born-RED is the genuine NaN /
silent-drop, not a stand-in — inv-M-observable-truth met (the L.W1 S4 gate tested a
proxy and missed this exact NaN; this wave does not repeat it).

**Green condition.** `compileToCSS` emits `@property` blocks for `@property`-bearing
children (S1); `parse()` throws `NAMED_SELECTOR_NO_TIMELINE` for an unresolvable
named-selector animation instead of NaN frames (S2); the tightened S4 assertion's
throw-OR-finite disjunct holds (S3); and every pre-existing replay-equality
assertion (S1 `!important`, S2 `CSSKeyframesToString` `@property`, S3 per-stop
composition, S5 composite floor) stays GREEN (no regression).

---

## Dependencies

- **value.js 0.13.0 (already pinned) — NO sibling publish gate.**
  `serializeStylesheetItem` is a published top-level export
  (`dist/index.d.ts:39`); `format.ts` already imports + uses it
  (`format.ts:6,429`). The compile path just needs to call the existing
  `propertyRegistryToString` wrapper (lane-01 §9: "value.js 0.13.0 already has
  `serializeStylesheetItem`… the compile path just needs to call it"). No O ask
  blocks this wave.
- **No sibling dep.** Pure kf-internal engine/format/compile + gate-script change.
  (The S1 `!important` value.js-O diagnostic ask #12 and the S4 Path B
  ScrollTimeline bind are SEPARATE — see Excluded.)
- **Composes with M.W1 (does NOT require it).** M.W1's report-all runner schedules
  `proof:replay-equality` as one node it no longer aborts the `&&` chain on; the
  iterate-to-green speedup compounds but is not owned here. M.W5 lands independently.
- **Parallel with M.W6 ∥ M.W7.** The three Band-B waves are value.js-0.13.0-sufficient
  kf-internal correctness fixes with no cross-wave file collision (M.W6 touches
  `compile-color.ts`/densify; M.W7 touches `walkSheet` ingest; M.W5 touches
  `compile.ts`/`format.ts` export/`frame-compiler.ts` parse + the replay gate).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 `@property` compile | A `@property`-bearing animation compiled via `compileToCSS` for deployment SILENTLY drops its custom-property typing block — `--hue` falls back to `<universal>`, `@property`-typed transitions stop being type-aware in the browser (the asymmetry between the two serialize surfaces re-opens) |
| S2 named-selector throw | A bare named-selector `@keyframes` (no `ScrollTimeline`) produces NaN frame times → `binarySearchRange` treats the frame as always-active → `interpFrames` applies its values at EVERY progress position; the `superType` tag relapses to written-never-read dead code (⚠M1) |
| S3 gate tightening | The S4 gate relapses to a SOURCE-SHAPE proxy (greps that the token set "appears in the guard") and goes BLIND to NaN frame times again — the exact L.W1-S4 inv-M-observable-truth failure the tranche is named to cure |

---

## Excluded from this wave

- **S4 Path B — the full `ScrollTimeline` named-range → numeric `%` bind.** Mapping
  named selectors to numeric positions via the K.W9 phase-range mapper (on timeline
  attach / a post-parse `bindTimeline` call) is a SEPARATE later wave (lane-01 §4
  Path B / §9 "M.W-ScrollTimeline-bind-candidate"). It requires the K.W9 substrate
  threaded into `parse()`; Path A is the born-RED floor and the seam Path B extends.
- **The S1 `!important` value.js-O diagnostic (ask #12).** Surfacing the
  keyframe-`!important` drop as a `ParseDiagnostic` on value.js's `OnParseError`
  channel is sibling-gated (value.js-O ask #12, `KF-TO-VALUEJS-O-ASKS.md`); kf cannot
  emit the diagnostic until value.js surfaces the drop event (lane-01 §1 / §8). The
  spec-faithful DROP itself is already correct (CSS Animations §3); only the
  diagnostic channel is deferred — NOT this wave.
- **The `animation-play-state` ingest half (ask #11).** value.js 0.13.0's
  `CSSAnimationOptions` carries `composition` but no `playState`
  (`extract.d.ts:8-17`, lane-01 §5); the `playState` round-trip is value.js-O ask
  #11, not a kf workaround and not this wave.
- **The multi-color densify fidelity fixes** (`oklch()` for oklch space; non-color
  property preservation) — M.W6 scope (⚠M2/⚠M3). M.W5 touches the `@property`
  compile prefix + the named-selector parse seam only, NOT the densify path.
- **The cross-depth sibling-linkage ingest gap** (`@media{@keyframes}` + top-level
  `.foo{animation}`) — M.W7 scope. Out of this wave.
