# L.W1 — Replay-equality FLOOR

- **Band:** A · **Class:** SHIP-in-L · **Dep:** value.js 0.13.0 (already pinned `^0.13.0`) — no new sibling gate
- **Gate (new):** `proof:replay-equality` — born-RED on today's tree over five breach-class fixtures;
  GREEN only when all five clauses cure.

---

## Context

K's Band II established replay-equality for a well-defined SUBSET: the
structural + easing + computed-unit axes are honest (gated by
`proof:roundtrip-fidelity` + `proof:compile-replay`). Five parity holes
remain in the SHIPPED 4.3.0 surface — all SILENTLY PASS today because no
fixture exercises any of them (Lane 33 finding, audit W89, ⚠15–17, ⚠28–31).
The round-trip claim is overclaimed: `format.ts` module doc asserts "ONE
serialization authority" and "a `var()`/`matrix3d()`/`cqw` round-trips
VERBATIM" — true for computed units, false for `!important` declarations,
`@property` blocks, per-stop composition, and named scroll selectors.
`inv-L-totality` (L.md §invariant set) elevates the honest-refusal law from
easing (the `serializeEasing` THROW idiom, `format.ts:43-51`) to the full
parsed surface: every parsed field round-trips correctly OR refuses with a
named reason — never a silent drop.

The K substrate makes this a WIRING wave, not a green-field one: value.js
0.13.0 already exposes `Declaration.important` (`stylesheet.d.ts:5`),
`PropertyDescriptor` + `serializeStylesheetItem` (the `@property` backward
path, `serialize.d.ts:4`), and `KeyframeRule.composition` (`stylesheet.d.ts`).
The gap is that none of these fields are consumed on the serialize/round-trip
path. `proof:replay-equality` is the new gate that enforces their consumption,
born-RED on the breach inputs.

### Audit evidence

| Ref | Source location | Breach |
|-----|-----------------|--------|
| ⚠31, W116 | `adapter.ts` `declsToVarMap` | `decl.important` read never — `!important` silently dropped |
| ⚠15, W75 | `engine.ts:1225` (`propertyRegistry`) | `serializeStylesheetItem` never called — `@property` lost on backward pass |
| ⚠16, W76 | `format.ts:81-103` (`declaredKeyframeBody`) | per-stop `animation-composition` not emitted — only per-stop easing is serialized |
| ⚠17, W118 | `frame-compiler.ts:179-188` (selector guard) | `entry`/`exit`/`cover`/`contain` (value.js `kind:"named"`) THROWS `AnimationOptionError` |
| W117 (Band A) | `constants.ts` (`AnimationOptions`) | `composite` absent from options — no round-trip path for the `animation-composition` (layer-level) longhand that value.js 0.13.0's `extractAnimationOptions` DOES surface (`CSSAnimationOptions.composition`, `extract.d.ts:16`) |
| W117 (dispatch dep) | `constants.ts` (`AnimationOptions`) | `playState` / `iterationComposite` — value.js 0.13.0 `CSSAnimationOptions` does NOT surface either (verified: `extract.d.ts:8-17` carries `composition` but no `playState`/`iterationComposite`). The `playState` ingest path is a value.js-Tranche-O dispatch dep (→ `KF-TO-VALUEJS-O-ASKS.md`), NOT greenable on 0.13.0; `iterationComposite` stays BOOKed (CSS Animations L2 experimental) |

Lane 33 verdict: `proof:roundtrip-fidelity` and `proof:compile-replay` are
SOURCE-SHAPE gates (grep for anchors); neither enumerates the breach inputs.
`proof:replay-equality` is the gap they leave.

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:replay-equality` GREEN.

### S1 — `!important` honor (`adapter.ts` `declsToVarMap`, viol31/W116)

**Breach.** `declsToVarMap` (`adapter.ts` declsToVarMap) reads only `decl.name` and
`decl.value`, discarding `decl.important` (`Declaration.important: boolean`,
`stylesheet.d.ts:5`). `format.ts:declaredKeyframeBody` never emits
`!important`. Parse–format–reparse of `opacity: 0 !important` loses the flag.

**Cure.** Two-site fix:
1. `adapter.ts` `declsToVarMap` — extend it to carry the `important` flag
   forward. The map value must encode importance alongside the `ValueArray`
   (a wrapper `{ value: ValueArray, important: boolean }` or a parallel
   `importantSet: Set<string>` on `ResolvedKeyframes`).
2. `format.ts:declaredKeyframeBody` — when the stored value is important, emit
   ` !important` after the value token before the `;`.

**Constraint.** The `parsedVars` pipeline (`parseAndFlattenObject` / `unflattenObjectToString`)
is value-typed; the important flag is declaration-level, not leaf-level. The
chosen representation must survive the existing `parsedVars[i]` projection
without mutating the interpolation hot-path. A `importantNames: Set<string>`
per template-frame on `ResolvedKeyframes` (parallel to `declarations`) is the
minimal-invasive path — it threads through `adapter.ts → engine.ts fromString
→ templateFrames` and is read only at serialize time.

**Gate bite.** Fixture: a bare `@keyframes` with `opacity: 0 !important` at
`from`. Today: `CSSKeyframesToString(a)` emits `opacity: 0;` (flag lost).
After cure: emits `opacity: 0 !important;`. The gate asserts the output
contains `!important`.

---

### S2 — `@property` backward-serialize (`engine.ts:1225`, viol15/W75)

**Breach.** `engine.ts:1225` declares `propertyRegistry: Map<string,
PropertyDescriptor>` and populates it from `fromString` (line 1235). The
engine also registers descriptors with the UA via `registerProperties` (line
1349). But neither `CSSKeyframesToString` (`format.ts`) nor `compileToCSS`
(`compile.ts`) calls `serializeStylesheetItem` on the registry — a compiled
artifact that animates a `--hue-angle` with `@property { syntax: "<angle>";
inherits: false; initial-value: 0deg }` loses the typing block on re-ship.

**Cure.** `CSSKeyframesToString` must prepend any non-empty
`animation.propertyRegistry` entries as `@property` blocks, one per entry,
using value.js's `serializeStylesheetItem` (`serialize.d.ts:4`, already
published, not yet imported in format.ts). Similarly `compileToCSS` must
include them in the emitted CSS artifact. The serialize path becomes:
`@property` blocks (if any) + blank line + `@keyframes …`.

**Constraint.** `serializeStylesheetItem` is on value.js's HEAVY surface
(statically imports `@mkbabb/value.js`); `format.ts` is already HEAVY (it
imports `camelCaseToHyphen`, `reverseAnimationShorthand`, etc. from value.js).
No boundary change. The `import { serializeStylesheetItem }` edge is new but
legal and acyclic.

**Gate bite.** Fixture: CSS with `@property --custom { syntax: "<angle>";
inherits: false; initial-value: 0deg }` followed by `@keyframes`. Today:
`CSSKeyframesToString` emits only the `@keyframes` block. After cure: emits
the `@property` block first. The gate asserts the output contains
`@property --custom`.

---

### S3 — Per-stop `animation-composition` serialize symmetry (`format.ts:81-103`, viol16/W76)

**Breach.** `declaredKeyframeBody` (`format.ts:81-103`) emits per-stop
`animation-timing-function` when it differs from the animation default
(lines 93-98), but emits NO `animation-composition` field. Yet
`templateFrame.composition` (`constants.ts:103`) IS captured from the adapter
(`adapter.ts:120-126`, `KeyframeRule.composition`). The serializer is
asymmetric: easing is symmetric (parse/serialize), composition is one-directional
(parse-only). `test/roundtrip-easing.test.ts` locks per-stop easing symmetry
but has no per-stop composition arm (Lane 33 finding: "compile-replay clause(b)
tests LAYER-level animation-composition but the breach is per-STOP").

**Cure.** `declaredKeyframeBody` must emit `  animation-composition: <op>;`
for any stop where `templateFrame.composition` is non-`undefined` and differs
from `replace` (the CSS default — omitting it is correct for `replace`). The
emitted value is the CSS longhand token: `"add"` | `"accumulate"`.

**Constraint.** The per-stop LAYER-level composition (K.W7, the `group.ts`
accumulate path) and the per-KEYFRAME composition operator are distinct. This
S-clause touches only the keyframe serializer — no engine behavioral change.
The `CompositeOperator` union (`constants.ts:164`) already covers the three
values.

**Gate bite.** Fixture: a `@keyframes` with `50% { opacity: 0.5;
animation-composition: add }`. Today: `CSSKeyframesToString` emits `opacity:
0.5;` at the `50%` stop, dropping `animation-composition: add`. After cure:
emits `animation-composition: add;`. Gate asserts the output contains
`animation-composition: add` at the correct stop.

---

### S4 — Named-selector `animate()` path (`frame-compiler.ts:179-188`, viol17/W118)

**Breach.** `FrameCompiler.addFrame` (`frame-compiler.ts:98+`) validates every
selector against `SELECTOR_KEYWORD_RE` (`/^(?:from|to)$/i`, line 98) and
`SELECTOR_PERCENT_RE` (line 99). Any selector that fails both regexes throws
`AnimationOptionError` (lines 183-188). value.js parses `entry`/`exit`/
`cover`/`contain` as `KeyframeSelector { kind: "named", name: ... }`
(`stylesheet.d.ts:12`) and `adapter.ts:114-116` surfaces them as their literal
name string (`out.push(sel.name)`). So `fromString` of a scroll-driven
`@keyframes` with `entry 0%`, `entry 100%`, or bare `entry` selectors THROWS
inside `addFrame` — what value.js produces, the frame-compiler cannot ingest.

**Cure.** Extend `SELECTOR_KEYWORD_RE` (or add a parallel
`SELECTOR_NAMED_RANGE_RE = /^(?:entry|exit|cover|contain)(?:\s+\d+(?:\.\d+)?%)?$/`)
to accept the four scroll-range keyword tokens. The range-fraction form
(`entry 0%`, `entry 50%`) is the common real-world shape; the bare form
(`entry`) maps to `entry 0% 100%` per scroll-animations spec.

The named selector maps to a progress value through the `ScrollTimeline`
phase mapper (`timeline.ts`, K.W9 substrate). The `addFrame` path must
convert a named selector to a numeric `%`-form `ValueUnit` using the same
mapper, or store the name as a pending-resolve token that binds when a
`ScrollTimeline` is attached. The minimal fix (resolve at attach time, no
pre-attach throw) is preferred: store the raw selector string on
`templateFrame.start` as an opaque `ValueUnit("entry", "named-selector")` and
resolve it to a `%` at `parse()` time when a timeline is present, `throw` with
a structured `AnimationOptionError(code: "NAMED_SELECTOR_NO_TIMELINE")` if no
timeline is set — replacing the current unconditional THROW with a deferred,
contextual one.

**Constraint.** This composes the K.W9 `ScrollTimeline` phase-range mapper and
the `createScrollScene` infrastructure. The named selector is only meaningful
in a scroll context; the cure is not "silently accept and ignore" but "accept
AND require a timeline to resolve." The gate-fixture must therefore test the
round-trip with a `ManualTimeline` substitute (progress-driven, not
scroll-driven) to avoid browser-only scroll APIs.

**Gate bite.** Fixture: `@keyframes x { entry { opacity: 0 } exit { opacity:
1 } }`. Today: `new CSSKeyframesAnimation(...).fromString(css)` THROWS
`AnimationOptionError`. After cure: the animation parses without throw. Gate
asserts no throw AND that the serialized output re-contains `entry` and `exit`
selector tokens (the named selectors survive the round-trip as authored).

---

### S5 — OPERATOR-floor: `composite` on `AnimationOptions` (W117, Band A) — SPLIT from the value.js-dispatch `playState` half

**The split (a corrected false-dependency).** The original W117 claim — that
`extractAnimationOptions` surfaces `composite` AND `iterationComposite` AND
`playState` — does NOT hold against the published value.js 0.13.0 surface.
Verified: `CSSAnimationOptions` (`node_modules/@mkbabb/value.js/dist/parsing/extract.d.ts:8-17`)
carries `composition?: "replace" | "add" | "accumulate"` (the layer-level
`animation-composition`) but has NO `playState` and NO `iterationComposite`
field; `grep -rn "play-state\|playState\|iterationComposite" node_modules/@mkbabb/value.js/dist/parsing/*.d.ts`
returns ZERO. So S5 splits:

- **Band A (greenable on 0.13.0, this wave):** the `composite` half. value.js
  0.13.0 DOES surface `CSSAnimationOptions.composition`, so the round-trip path
  for the layer-level `animation-composition` longhand is wireable today with
  no sibling publish gate.
- **value.js-Tranche-O dispatch dep (NOT this wave):** the `playState` half.
  `animation-play-state` is not parsed by value.js 0.13.0 at all — neither in
  `CSSAnimationOptions` nor in any longhand parser. The `playState` ingest path
  is therefore blocked on a value.js Tranche-O ask (it belongs in
  `KF-TO-VALUEJS-O-ASKS.md` as the `animation-play-state` grammar ask) and is
  NOT greenable on 0.13.0. The born-RED gate below asserts ONLY the Band-A
  (composite) half.

**Breach (Band A).** `AnimationOptions` (`constants.ts:166-191`) does not carry
`composite` (the layer-level `animation-composition`). `extractAnimationOptions`
(value.js 0.13.0) DOES surface `composition` from a sibling
`.class { animation: … }` / longhand block, but `engine.ts:fromString` drops it
(no `composite` field on `AnimationOptions` to receive it). There is no
round-trip path for an authored `animation-composition: add` (layer-level) that
arrived via shorthand/longhand ingest.

**Cure — minimal Band-A floor.** Add `composite?: CompositeOperator` to
`AnimationOptions` (NOT `playState` — value.js-dispatch-blocked; NOT
`iterationComposite` — Baseline 2023 but the CSS spec marks it experimental in
the Animations L2 draft; the honest move is a named `BOOK` with a
`proof:iteration-composite-baseline` tripwire, not an implementation). Wire:
- `engine.ts:fromString` / `setOptions` — read `composition` from
  `extractAnimationOptions` into `animation.options.composite`.
- `format.ts:CSSKeyframesToString` — when `animation.options.composite` is
  `"add"` or `"accumulate"` (non-default), emit `animation-composition: add;`
  in the shorthand block.

`iterationComposite` is BOOKED with a named tripwire: add the field as
`iterationComposite?: never` (a typed placeholder) in `AnimationOptions` + a
comment citing the Animations L2 spec status. The gate asserts the field
exists but is explicitly `never`, so a future silently-wrong implementation
reddens the type check.

`playState` is the value.js-Tranche-O dispatch dep: NOT added to
`AnimationOptions` in this wave (there is nothing for value.js to feed it —
`extractAnimationOptions` does not parse `animation-play-state` at 0.13.0). The
ask lands in `KF-TO-VALUEJS-O-ASKS.md`; the kf-side `playState` round-trip
opens as a Band-B consume-edge (L.W9) when value.js publishes the
`animation-play-state` grammar.

**Gate bite (Band A only — greenable on 0.13.0).** Fixture: a
`.class { animation: x 1s; animation-composition: add } @keyframes x { ... }`.
Today: `fromString` ingests the shorthand but the layer-level composition is
dropped — `animation.options.composite` is undefined and the re-serialized
output omits it. After cure: `animation.options.composite === "add"` AND the
serialized output contains `animation-composition: add`. Gate asserts both.
The `playState` round-trip is NOT asserted here (value.js-dispatch-blocked).

---

## Born-RED gate

**Gate name:** `proof:replay-equality` (NEW — does not exist in the current
`scripts/` directory; this wave authors it).

**Structure:** follows the `proof:compile-replay` pattern — a source-grep
(structural-wiring) half chained with a `vitest run` behavioural half over a
dedicated test file `test/replay-equality.test.ts` (NEW).

**Witness inputs that RED today / GREEN after cure:**

| Clause | Input that REDs today | Failure mode | Expected after cure |
|--------|----------------------|--------------|---------------------|
| S1 | `@keyframes x { from { opacity: 0 !important } to { opacity: 1 } }` | `CSSKeyframesToString` output lacks `!important` | output contains `!important` |
| S2 | `@property --hue { syntax: "<angle>"; inherits: false; initial-value: 0deg }\n@keyframes x { … }` | output lacks `@property` block | output starts with `@property --hue` |
| S3 | `@keyframes x { 50% { opacity: 0.5; animation-composition: add } }` | `CSSKeyframesToString` output omits `animation-composition: add` at `50%` | output contains `animation-composition: add` |
| S4 | `@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }` | `fromString` throws `AnimationOptionError` | no throw; re-serialized output contains `entry` and `exit` |
| S5 (Band A) | `.cls { animation: x 1s; animation-composition: add } @keyframes x { … }` | `animation.options.composite` is undefined; output lacks `animation-composition` | `composite === "add"`; output contains `animation-composition: add` (the `playState` half is value.js-dispatch-blocked → `KF-TO-VALUEJS-O-ASKS.md`, NOT asserted here) |

**Today's tree result:** every fixture above silently passes `proof:roundtrip-fidelity`
(it never exercises them) and every fixture either silently drops the field
or throws — none are asserted by any existing gate. `proof:replay-equality`
exits 1 on today's tree by construction: the five `requireAll` clauses assert
structural wiring anchors (the `!important` emit in `format.ts`, the
`serializeStylesheetItem` import edge, the `animation-composition` per-stop
emit, the extended selector guard, the `composite` on `AnimationOptions` —
Band A only; the `playState` half is value.js-dispatch-blocked and NOT a clause
of this gate) that do NOT exist in the current source.

**Green condition:** all five source-shape clauses pass AND `vitest run
test/replay-equality.test.ts` exits 0 over all five fixture round-trips.

---

## Dependencies

- **value.js 0.13.0** — already pinned `^0.13.0`; the required symbols
  (`Declaration.important`, `PropertyDescriptor`, `serializeStylesheetItem`,
  `KeyframeRule.composition`, `KeyframeSelector { kind: "named" }`) are ALL
  present in the published 0.13.0 surface (`dist/parsing/stylesheet.d.ts`,
  `dist/parsing/serialize.d.ts` — verified against installed package). No new
  sibling publish gate.
- **L.W6 (`proof:agent-validate`)** — gates on L.W1 + L.W2 being complete so
  the `validate(css)` verb projects a TOTAL refusal surface. L.W1 must land
  before L.W6 opens.
- **value.js Tranche O (dispatch dep, S5 `playState` half)** — the
  `animation-play-state` round-trip is BLOCKED on value.js publishing the
  `animation-play-state` grammar (`CSSAnimationOptions` at 0.13.0 has no
  `playState` field; `extract.d.ts:8-17` verified). The ask is recorded in
  `KF-TO-VALUEJS-O-ASKS.md`; the kf-side consume opens as a Band-B edge (L.W9)
  on the value.js publish. NOT a Band-A obligation of this wave.
- No glass-ui dep. No parse-that dep beyond what 0.13.0 already carries.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 `!important` | A future serializer that reads `decl.value` without `decl.important` silently drops priority — a cascaded override breaks on re-ship |
| S2 `@property` | A compiled artifact shipped to a browser without `@property` loses custom-property type registration — `--custom` falls back to `<universal>` type, breaking CSS `@property`-typed transitions |
| S3 per-stop composition | A round-tripped `@keyframes` with `animation-composition: add` re-parses as silent `replace` — the author's declared layering is discarded and the animation composites differently |
| S4 named selector | A scroll-driven `@keyframes` with `entry`/`exit` ingest THROWS instead of animating — a regression on any K.W9 ScrollScene consumer that uses named range selectors |
| S5 composite floor (Band A) | An `animation-composition: add` (layer-level) shorthand/longhand drop leaves the engine in the wrong layer-level mode on re-ship — the author's declared compositing is silently lost (the `playState` half is a value.js-Tranche-O dispatch dep, not gated here) |

---

## Excluded from this wave

- `iterationComposite` implementation — BOOK only (CSS Animations L2 draft, experimental; gate-first tripwire `proof:iteration-composite-baseline` deferred to L.WZ or the Baseline-fire wave).
- `animation-play-state` round-trip (S5 `playState` half) — value.js-Tranche-O dispatch dep, NOT greenable on 0.13.0 (value.js 0.13.0 `CSSAnimationOptions` carries no `playState`); the ask is in `KF-TO-VALUEJS-O-ASKS.md`, the consume opens Band-B (L.W9) on the value.js publish.
- Multi-color silent-densify (`compile-color.ts:188-190`) — L.W2 scope (compiler completeness, not the serialize path).
- `reverseMs` → `reverseCSSTime` unification (`compile.ts:241`) — L.W2 S-clause (W115).
- Named-selector → progress resolution under a live `ScrollTimeline` — the full mapping (covers `50%` fractional syntax) is a follow-on to the no-throw floor this wave establishes.
