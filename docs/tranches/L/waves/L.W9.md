# L.W9 — Constellation cross-repo dispatch

- **Band:** B · **Class:** DISPATCH-NOW, consume-on-publish
- **Gate (born-RED):** `proof:workaround-deletion` (NEW — four kf workarounds whose
  delete pre-condition is a sibling publish; RED today on every clause; GREEN arm-by-arm
  as siblings land); `proof:peer-satisfied` (REFERENCED — gate owned + authored by L.W4
  S8; L.W9 S3 is the dispatch that GREENs it; reads the full installed peer graph;
  RED today on glass-ui `^0.10.0||^0.11.0` ⚠8)
- **Sibling deps:** glass-ui 4.1.0 (BB close) · value.js 0.14.0 (Tranche O) · parse-that
  0.10.x (PT-WAVE-4+)

---

## Context

Band B dispatches net-now. The L.md charter identifies three gaps left when K closed the
round-trip SUBSET:

1. The kf consume seam carries **four live workarounds for sibling defects** — each is a
   named precept violation today (⚠1–3, ⚠5, ⚠7, ⚠18–20, ⚠23–24 from the 36-lane
   audit) that the no-workaround / inv-L-acyclic-purity invariants indict. Deleting them
   requires the sibling to fix the root; kf's side is the consume-edge re-pin.

2. **glass-ui BB is in execution (in-flight)** — the aria fix, the dock-morph-family
   polish, the KF-OSCILLATOR co-schedule, and the F-2 peer-cycle fix are all on a live
   tranche with a named 4.1.0 cut. The asks land into a tranche that already has a
   schedule, not a cold queue.

3. **value.js Tranche O (0.14.0)** and **parse-that PT-WAVE-4+** carry the grammar seam
   debt the K close recorded as Band-B gated: the comma-list forward-leg truncation (⚠13),
   the `linear()` serialize asymmetry (⚠19–20), the `FN_NAME` Symbol sidechannel (⚠18),
   the direct `parse-that` dep (⚠24), and the color()/transform correctness gaps (⚠10,
   ⚠12, ⚠23). Each is a fix-at-sibling obligation; none is a kf-internal cure.

### The K substrate this wave rides

K closed with `proof:chronic-closure` GREEN on 44 rows. Band B was explicitly STAGED at
the K close:

- `docs/tranches/K/FINAL.md §4` records **DL-K7 GlassControlPoint** and **DL-K9 RF-17**
  as HANDOFF with named tripwires.
- `docs/tranches/K/KF-TO-GLASSUI-BB-ASKS.md §2` names W-DOCK-MORPH-FAMILY for 4.1.0 and
  KF-OSCILLATOR as BOOKED.
- `docs/tranches/K/CONSTELLATION-DAG.md §5` records F-2 as a BB-side obligation with a
  live peer-warning blast radius.
- The audit's cross-repo-ask findings name the full slate (audit:203–236).

L.W9 converts those HANDOFF rows and BOOKED items into a structured dispatch: three
outbound ask documents (one per sibling), born-RED consume gates on the kf side, and a
deletion gate for each existing workaround whose delete-condition is the sibling publish.

### Audit evidence

| Finding | Source | Severity |
|---------|--------|----------|
| ⚠1–3, ⚠7 `aria-orientation` suppress-on-consume | `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"` — one of two pill strips; `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:66` (`<SegmentedTabs variant="pill">`) — NOT suppressed, emits the invalid attr on every scene | HIGH — incomplete fix + wrong layer |
| ⚠5 RF-17 kf pointerdown interim | `K/FINAL.md §4 DL-K9`; the `onPlayPointerDown`/`pointerHandled` twin retained post-K.W1 revert | HIGH — ⚠5 indicts it as a workaround the 4.1.0 cure must retire |
| ⚠8 F-2 peer-cycle | `K/CONSTELLATION-DAG.md §5`; glass-ui `^0.10.0||^0.11.0` rejects value.js 0.13.0 — ELSPROBLEMS on any install today | HIGH — live blast radius |
| W18, ⚠18 `FN_NAME` Symbol sidechannel | `src/animation/utils.ts:45–57` — kf stamps private state onto a published value.js class; `.clone()` drops it; kf re-stamps per call (`utils.ts:294–299`) | HIGH |
| W87, ⚠19–20 `linear()` regex workaround | `src/animation/utils.ts:185–196` — the `, 25%` → ` 25%` regex over value.js's own serializer output; explicit comment "a value.js 0.12.0 serialize/parse asymmetry" | HIGH — must delete on VJ-L2 landing |
| W94, ⚠24 direct `parse-that` dep | `src/animation/utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"` — kf reaching through value.js's parser abstraction layer; `package.json:194` `"@mkbabb/parse-that": "^0.9.0"` as a production dep | HIGH |
| W74, ⚠13 comma-list truncation | value.js `src/parsing/stylesheet.ts:212–235` — multi-value declarations silently truncated at first comma; ⚠13 evidence: `box-shadow: 0 0 0 red, 0 0 0 blue` → 4-leaf ValueArray, second shadow gone | HIGH |
| W71, ⚠10, ⚠23 color()/FunctionValue | value.js `src/parsing/color.ts:508–543` color() wrapper dropped on serialize; `FunctionValue.toString()` space-args→commas; kf workarounds in `utils.ts:188–202` | HIGH |
| W73, ⚠12 transform axis | value.js `src/parsing/index.ts:61–105` `rotate()` expanded to rotateX+rotateY (WRONG — rotate≡rotateZ; scale sets X+Y not Z) | HIGH |
| W93, ⚠27 packrat unsoundness | `parse-that/src/packrat.ts` self-documents as UNSOUND (id-only key, no offset), zero production consumers | MED |
| W105 permutation combinator | parse-that missing `permutation(...parsers)` for CSS `||` any-order semantics — value.js needs it to collapse workarounds | MED |
| W91, ⚠21 typesVersions | parse-that published 0.9.0 points `typesVersions` at non-existent `dist/src/parse/index.d.ts` | MED |
| W34 GlassControlPoint | `K/audit/deferred-ledger-k.md DL-K7` 5-tranche HANDOFF; `proof:control-point-live` born-RED since tranche E | MED |
| W128 KF-OSCILLATOR | `KF-TO-GLASSUI-BB-ASKS.md §1` BOOKED; no kf `Oscillator` class today | MED |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. The S-clauses in the **Ask** group
are dispatched now and consume-gated kf-side. The S-clauses in the **Delete** group are
born-RED deletions that GREEN on the paired sibling publish.

---

### S1 — glass-ui BB dispatch: SegmentedTabs aria fix + delete kf suppression
(W24/W50, ⚠1–3, ⚠7 → glass-ui BB)

**The ask.** SegmentedTabs must conditionally omit `aria-orientation` when the variant is
`pill` (role=group). The ARIA spec forbids `aria-orientation` on `role=group`. Today
glass-ui emits it unconditionally, so every `SegmentedTabs variant="pill"` consumer
receives the invalid attribute. The kf demo has a consume-side suppress
(`demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"`) that is:
(a) the wrong layer (inv-16 / no-workaround — the fix belongs in glass-ui),
(b) **incomplete** (the audit found `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:66`
carries the SAME `<SegmentedTabs variant="pill">` strip with NO suppression — confirmed on
disk: that element has no `:aria-orientation="undefined"` bind, so the invalid attr still
fires on every scene at the AnimationControls strip), and
(c) a pattern that requires per-call-site suppression rather than a fleet-wide root fix.

**Interim posture (the suppression deletion is gated on the glass-ui fix).** Until glass-ui
4.1.0 lands the root fix, the demo is at a choice it must make HONESTLY: either suppress
`aria-orientation` on BOTH pill strips (SpringSidebar.vue:43 AND the AnimationControls strip
— so the interim is complete, not half-applied), OR hold the workaround AS-IS and record the
AnimationControls strip as a KNOWN un-suppressed leak with the named tripwire (the glass-ui
4.1.0 publish). The fleet-wide blast radius (every `variant="pill"` consumer) must be VERIFIED
before claiming "incomplete fix" is the only remaining leak — the audit names two strips; a
disk grep of `variant="pill"` across `demo/` is the verification the consume-edge owes.

**The dispatch (outbound ask to glass-ui BB).** Filed in `KF-TO-GLASSUI-BB-ASKS.md §1`:
add a one-line conditional bind in SegmentedTabs's pill variant: emit `aria-orientation`
only when the variant is NOT `pill` (i.e., variant=underline or role=tablist). This is a
**one-line fix in glass-ui that makes ALL consumers correct at once** (audit cross-repo
finding: "driving it via BB makes ALL consumers correct at once" — audit:205).

**The kf deletion (born-RED gate).** On glass-ui 4.1.0-or-later publish with the aria
fix, the kf consume side:

1. Deletes `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"`.
2. Confirms `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:66`
   (`<SegmentedTabs variant="pill">`) has no residual suppression (the un-fixed site the
   audit found — it was never suppressed, so no delete needed there, but the gate confirms
   the live rendered pill emits NO `aria-orientation` after the glass-ui fix lands).
3. Re-pins `~4.1.x` (or the point-release that carries the fix).

**Gate arm `proof:workaround-deletion` S1.** Runs `grep -n 'aria-orientation' demo/` and
asserts zero hits with value `undefined` (the band-aid pattern). RED today
(`SpringSidebar.vue:43` matches). GREEN after deletion on the 4.1.x consume.

---

### S2 — glass-ui BB dispatch: RF-17 dock-layer cure + delete kf pointerdown interim
(W18/W43/DL-K9, ⚠5 → glass-ui BB)

**The ask.** The RF-17 click-strand (the `GlassDock` collapse-crossfade race that swallows
a play click during the morph) has been re-deferred across I→J→K. K.W1 reverted the
`useDockClickIntegrity` attempt and retained the kf interim (`onPlayPointerDown` /
`pointerHandled` flag). `K/KF-TO-GLASSUI-BB-ASKS.md §2` filed W-DOCK-MORPH-FAMILY for
4.1.0. The kf interim is a precept violation (⚠5): "the kf onPlayPointerDown/pointerHandled
interim … is a workaround of a glass-ui primitive defect. Inv-16 and the no-workaround
precept both indict it."

**The dispatch.** Filed in `KF-TO-GLASSUI-BB-ASKS.md §2`: W-DOCK-MORPH-FAMILY must include
the click-strand cure at the dock layer so that the kf play button receives the click even
when the dock is mid-morph. The BB `W-DOCK-MORPH-FAMILY` entry in `KF-TO-GLASSUI-BB-ASKS.md §2`
already names this (clause (a): "the morph animates a COMPOSITOR TRANSFORM not
`inline-size`; no per-frame relayout — the residual the user may still feel on a slow
frame"). The ask for 4.1.0 is that the cure is **at the dock layer**, making the interim
unnecessary at the consumer.

**The kf deletion.** On 4.1.0 publish with the dock cure, delete the `onPlayPointerDown` /
`pointerHandled` pattern from the kf demo. The exact site is tracked in the `KF-TO-GLASSUI-BB-ASKS.md`
dispatch; the gate asserts its absence.

**Gate arm `proof:workaround-deletion` S2.** Runs `grep -rn 'pointerHandled\|onPlayPointerDown'
demo/` and asserts zero hits. RED today (the interim is retained per `K/FINAL.md DL-K9`).
GREEN on the 4.1.0 consume-edge deletion.

---

### S3 — glass-ui BB dispatch: F-2 peer-cycle cure + `proof:peer-satisfied`
(⚠8, Lane 36 CROSS-REPO-ASK → glass-ui BB)

**The defect.** glass-ui 4.0.0's `peerDependencies` field carries
`"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` (`K/CONSTELLATION-DAG.md §5`). value.js
0.12.0 and 0.13.0 (the versions kf and glass-ui both actually consume) fall OUTSIDE this
range. Any kf consumer that installs `@mkbabb/glass-ui` alongside `@mkbabb/value.js`
today receives an ELSPROBLEMS peer warning blast. This is a glass-ui-side obligation: the
peer range must widen to `^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0` (or a semver range
that admits the current published version — the exact form is BB's decision). The no-workaround
precept forbids kf papering this over with `npm overrides` or `peerDependenciesMeta optional`
(Lane 36 ⚠ "no-quick-solution / no-workaround: must NOT be papered over").

**The dispatch.** Filed in `KF-TO-GLASSUI-BB-ASKS.md §3`: widen the value.js peer range in
the BB 4.1.0 cut to admit the current published version. The ask mirrors
`KF-TO-GLASSUI-BB-ASKS.md §2 W-PEER-SPINE` (which asked BB to confirm the 4.0.0/4.1.0
peer spine admits kf 4.x) — the value.js peer is the symmetric obligation.

**The consume gate `proof:peer-satisfied` — REFERENCE (owned by L.W4 S8; NOT
re-authored here).** L.W4 S8 authors the gate script
(`scripts/proof-peer-satisfied.mjs` + the `package.json` entry + `proof:all`
inclusion). It runs `npm ls --json 2>&1`, parses for any `peerMissing` / `invalid`
entries whose `required` field names a kf / glass-ui / value.js specifier, and
asserts zero. L.W9 S3 is the DISPATCH side: it files the glass-ui BB F-2 peer-widen
ask that GREENs the L.W4 gate. The gate is born-RED today (`npm ls` produces
ELSPROBLEMS for `@mkbabb/value.js` under the `@mkbabb/glass-ui` peer range) and
GREENs on the glass-ui 4.1.x publish with the widened range + kf re-pin — the
consume edge L.W9 owns, riding the gate L.W4 owns.

---

### S4 — glass-ui BB dispatch: GlassControlPoint gate-first BOOK
(W34, DL-K7, 5-tranche → glass-ui BB)

**The status.** DL-K7 exited K as HANDOFF with "gate-first BOOK: author
`proof:control-point-live` first" (`K/audit/deferred-ledger-k.md DL-K7`). The 5-tranche
chronic exits L only via one of two paths: (a) glass-ui BB publishes `GlassControlPoint`
in its cut AND `proof:control-point-live` is authored and GREEN, or (b) kf takes the
build-in-kf decision and authors the gate against a kf-owned implementation. The 5-tranche
tenure (E→J→K + L = ≥6 tranches by L.WZ) makes path (a) the preferred exit under P-invariant-28
(no perpetual punt — ≥4-tranche riders must exit, not re-BOOK).

**The dispatch.** Filed in `KF-TO-GLASSUI-BB-ASKS.md §4`: ask BB to include `GlassControlPoint`
(the SVG control-point handle + pointer composable enabling the keyframes curve editor) in
its 4.1.0 cut or to publish a named minor that carries it. The ask records the gate name
(`proof:control-point-live`) and the kf consume pattern (the keyframes editor spine in
`demo/` wires the curve editor over `GlassControlPoint`).

**L.W9 obligation (gate-first).** `proof:control-point-live` must be AUTHORED before any
implementation — a born-RED gate that asserts the `GlassControlPoint` component is
importable from the installed `@mkbabb/glass-ui` barrel and renders a draggable SVG handle.
Today it does not exist: `grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/`
→ ZERO. The gate is RED until glass-ui publishes the component. L.W9 authors the gate and
records the HANDOFF with the gate name as the named tripwire.

**P-invariant-28 compliance.** If `GlassControlPoint` has NOT shipped by L.WZ, the row
DOES NOT re-BOOK — it exits L as either EXITED (shipped) or a named terminal KILL
("build-in-kf decision taken") with a concrete implementation spec. The re-BOOK option is
closed.

---

### S5 — glass-ui BB dispatch: KF-OSCILLATOR co-schedule
(W128 → glass-ui BB + kf LIGHT primitive)

**The ask.** `KF-TO-GLASSUI-BB-ASKS.md §1` BOOKED the KF-OSCILLATOR: a LIGHT periodic
phase-clock (frequency + waveform → phase ∈ [0,1)) that glass-ui's BB speedtest idle-breath
(W-EASING-PRIMITIVE) and the demo's `KF-OSCILLATOR` scene consume. The primitive belongs in
kf (boundary law: "playback/phase = kf") and is value.js-free (it is a periodic phase clock,
not a CSS value parser). The BB W-EASING-PRIMITIVE wave is the consume signal.

**The kf side.** Ship `Oscillator` to `src/animation/` as a LIGHT named export beside
`SmoothProgress` / `SpringProgress` / `RAFPlayback`. Signature:

```ts
// LIGHT — no value.js edge
export class Oscillator {
    constructor(opts: { frequency: number; waveform?: "sine" | "triangle" | "square" | "sawtooth" });
    readonly phase: number;          // ∈ [0, 1)
    tick(dt: number): number;        // advances by frequency × dt, returns phase
    sample(t: number): number;       // pure: t → waveform(t * frequency)
}
```

The `phase` is a linear ramp modulo 1 driven by `tick(dt)` (where `dt` comes from the
caller's `RAFPlayback` loop or `ScrollTimeline`). Waveform shaping is a pure mapping over
`phase`. No rAF ownership — the caller drives the loop (mirrors `SmoothProgress` /
`SpringProgress` discipline).

**Gate arm.** `proof:boundary` assertion-3 must enumerate `Oscillator` as a LIGHT named
export with zero static value.js edge (mirrors the `warmEngine` arm from L.W7 S1). The
gate runs `scripts/proof-boundary.mjs` and asserts `Oscillator` is present in the light
bundle with no value.js specifier. Born-RED today (no `Oscillator` class exists in
`src/animation/`). GREEN when the class ships and `proof:boundary` sees it.

---

### S6 — value.js Tranche O dispatch: comma-list grammar + partial-input honesty
(W74, ⚠10, ⚠13, ⚠14 → value.js Tranche O)

**The defect.** `value.js/src/parsing/stylesheet.ts:212–235` (the
`parseDeclarationValue` path) calls `CSSValues.Values` which silently truncates
multi-value declarations at the first top-level comma — the `box-shadow: 0 0 0 red, 0 0 0 blue`
probe returns a 4-leaf ValueArray containing only the first shadow (⚠13 evidence; the
second shadow is gone with no diagnostic). The `proof:compile-replay` gate corpus has NO
multi-value fixture at this path — the gate is green over the exact lossy case (Lane 33
high-severity finding).

**The partial-input honesty obligation (⚠10).** The BBNF grammars in
`value.js/src/parsing/grammars/*.bbnf` declare `env()`/`attr()`/`toggle()`/`system-colors`
as the intended grammar while the production parser omits them. The partial-input path
should either emit a `ParseDiagnostic` (the existing `OnParseError` sink) or return an
honest partial-result with an `incomplete` flag — NOT `status:true` over a truncated
result.

**The dispatch (value.js Tranche O ask).** Filed in `KF-TO-VALUEJS-O-ASKS.md §1`:

- **VJ-O1 comma-list grammar.** Add a first-class `ValueList` / `segmentedValues` node to
  `CSSValues` so `parseDeclarationValue` returns the FULL comma-separated list as a typed
  `ValueList`, not just the first segment. The consume seam: kf's
  `src/animation/adapter.ts` `declsToVarMap` calls `parseAndFlattenObject` which calls
  `flattenObject` — the multi-value loss happens before kf's frame pipeline sees the data,
  so the fix must be at the value.js parse root.
- **VJ-O2 partial-input honesty.** `parseDeclarationValue` must return `status:false` (or
  emit an `OnParseError` diagnostic) when the input is not fully consumed — no more silent
  drop with `status:true`. Mirror the full-consumption enforcement at the stylesheet
  top-level (`stylesheet.ts:503–510`) down to the per-declaration value parse.

**kf-side consume gate.** `proof:workaround-deletion` S6 arm: after VJ-O1 lands in a
value.js publish, the kf test corpus `test/fixtures/keyframes/` gains a multi-value fixture
(`box-shadow: 0 0 0 red, 0 0 0 blue`, `font-family: Arial, sans-serif`,
`background: red, blue`) and `proof:compile-replay` is extended to assert the second value
is present. Born-RED today (no such fixture, gate skips the lossy case). GREEN on the
VJ-O1 consume.

---

### S7 — value.js Tranche O dispatch: `linear()` / FunctionValue serialize fix + delete kf regex
(W87, VJ-L2, ⚠19–20, ⚠23 → value.js Tranche O)

**The defect.** `value.js`'s `FunctionValue.toString()` emits `linear()` stops as a flat
comma list (`linear(0, 0.5, 25%, 1)`) where the canonical form is space-joined stops
(`linear(0, 0.5 25%, 1)`) — the emitted form is rejected by value.js's OWN `parseLinearStops`.
kf carries the workaround at `src/animation/utils.ts:185–196`: a regex that folds
`, <number>%` back to ` <number>%` with the comment "a value.js 0.12.0 serialize/parse
asymmetry". This is ⚠19–20 (replay-equality breach + no-workaround violation). The same
asymmetry affects `scroll()` positional args (⚠23: value.js 0.13.0 CHANGELOG acknowledges
it as a known limitation for `scroll()`).

**The dispatch.** Filed in `KF-TO-VALUEJS-O-ASKS.md §2`:

- **VJ-L2.** Fix `FunctionValue.toString()` to emit space-separated positional arguments
  for `linear()` stops (and `scroll()` positional args) — the form its own `parseLinearStops`
  accepts. Add a `linearStopsToCSS(stops)` utility that is the inverse of `parseLinearStops`.
  The cure is in value.js; kf must not own a workaround for it.

**The kf deletion.** On VJ-L2 in a published value.js cut:

1. Delete `src/animation/utils.ts:185–196` (the `LINEAR_PAREN_PREFIX` test + the
   `,\s*(-?[\d.]+%)/g` regex replacement + the `normalize` branch).
2. Remove the regex constant `LINEAR_PAREN_PREFIX` (defined near line 183 or similar).
3. Re-pin value.js to the VJ-L2 cut (`^0.14.x` or the specific patch).

**Gate arm `proof:workaround-deletion` S7.** Runs:

```
grep -n 'LINEAR_PAREN_PREFIX\|,\\s\*\(-\?.*%\)' src/animation/utils.ts
```

and asserts zero hits. RED today (`utils.ts:185–196` matches). GREEN on deletion.

**Round-trip gate tightening.** `proof:roundtrip-easing` (`test/roundtrip-easing.test.ts`)
must add a `linear()` stops round-trip arm that exercises the EXACT serializer → parser
path without the regex normalization. This arm is RED until VJ-L2 lands (the un-normalized
form is rejected today), GREEN after.

---

### S8 — value.js Tranche O dispatch: `FN_NAME` Symbol → value.js first-class `flatLeaf`
(W86, VJ-L1, ⚠18 → value.js Tranche O)

**The defect.** `src/animation/utils.ts:45–57` stamps a private `FN_NAME` Symbol onto
published `value.js` `ValueUnit` instances. The field is invisible to value.js — not
preserved by `.clone()`, not typed, not documented. kf re-stamps it on every clone
(`utils.ts:294–299`) because `ValueUnit.clone()` drops it. This is ⚠18: "kf is writing
state onto a class it does not own."

**The dispatch.** Filed in `KF-TO-VALUEJS-O-ASKS.md §3`:

- **VJ-L1.** Add a first-class `flatLeaf(valueUnit)` constructor or a `fromFlattened`
  factory that carries the function-name provenance as a TYPED field on `ValueUnit` (or a
  subclass `FlatValueUnit`). The `FN_NAME` Symbol pattern is a cross-repo provenance gap
  the sibling must own; kf should call `value.js.flatLeaf(u, fnName)` and receive back a
  typed instance, never stamp a Symbol directly.

**The kf deletion.** On VJ-L1 in a published cut:

1. Delete `const FN_NAME = Symbol("kf.fnName")` at `utils.ts:45`.
2. Replace all `getFnName(u)` / `setFnName(u, name)` call sites with the value.js
   first-class API.
3. Remove the `NamedValueUnit` private type alias.

**Gate arm `proof:workaround-deletion` S8.** Runs:

```
grep -n 'FN_NAME\|kf\.fnName' src/animation/utils.ts
```

and asserts zero hits. RED today (`utils.ts:45,51,55,294,298`). GREEN on deletion.

---

### S9 — value.js Tranche O dispatch: `parseCSSSubValue` → delete kf's direct `parse-that` dep
(W94, ⚠24 → value.js Tranche O)

**The defect.** `src/animation/utils.ts:1` imports `{ any as parseAny }` from
`@mkbabb/parse-that` directly. `package.json:194` carries `"@mkbabb/parse-that": "^0.9.0"`
as a production dependency. The `any` combinator is used at `utils.ts:228–250` to compose
value.js parsers across cross-realm nominal-type boundaries. This composition belongs in
value.js (which already owns the parsers); kf must not reach through value.js's parser
abstraction layer. ⚠24: "The fix is a cross-repo ask, not a kf-local fix."

The `proof:boundary` gate (`scripts/proof-boundary.mjs`) today does NOT scan for direct
`@mkbabb/parse-that` imports in HEAVY modules (audit W96: "extend
`holdsValueJsSpecifier` to also catch direct `@mkbabb/parse-that` imports in light
modules"). The boundary gate has a hole.

**The dispatch.** Filed in `KF-TO-VALUEJS-O-ASKS.md §4`:

- **VJ-L3 / W94.** Expose `parseCSSSubValue(property: string, value: string): ValueUnit | null`
  in value.js's published surface — a helper that applies the `any(value.js's per-property
  parsers)` composition internally, so kf's `getTimingFunction` / `parseAndFlattenObject`
  seam can call a single value.js function instead of importing `any` from `parse-that`
  directly. value.js already owns ALL the parsers; the `any` composition is a one-liner in
  value.js's parse module.

**The kf deletion.** On VJ-L3 in a published value.js cut:

1. Delete `import { any as parseAny } from "@mkbabb/parse-that"` at `utils.ts:1`.
2. Replace the `parseAny([…])` call at `utils.ts:228–250` with `parseCSSSubValue(property, value)`.
3. Remove `"@mkbabb/parse-that"` from `package.json` `dependencies` (it remains a
   `devDependency` only if needed by the test suite; it is removed entirely if not).

**Gate arm `proof:workaround-deletion` S9.** Runs:

```
grep -n '@mkbabb/parse-that' src/animation/utils.ts
```

and asserts zero hits. RED today (`utils.ts:1`). GREEN on deletion.

**`proof:boundary` extension.** `scripts/proof-boundary.mjs` must also scan HEAVY modules
for direct `@mkbabb/parse-that` imports and assert zero (`holdsValueJsSpecifier` already
covers `@mkbabb/value.js`; extend the same pattern to `@mkbabb/parse-that`). This arm is
born-RED until the deletion lands AND the boundary gate has the new assertion.

---

### S10 — value.js Tranche O dispatch: transform axis semantics + color() replay
(W71–72, W73, ⚠10, ⚠12, ⚠23 → value.js Tranche O)

**Transform axis (W72, ⚠12).** `value.js/src/parsing/index.ts:61–105` expands
`rotate(θ)` → `rotateX(θ)·rotateY(θ)` (semantically WRONG — CSS `rotate(θ)` is
`rotateZ(θ)`; CSS `scale(x, y)` sets X and Y, not Z). Any kf animation over a `transform`
keyframe that contains `rotate()` or `scale()` is silently wrong at the value.js parse
boundary. This is a CORRECTNESS (not round-trip) defect.

**color() replay (W71, ⚠10, ⚠23).** `value.js/src/parsing/color.ts:508–543` drops the
`color(` wrapper on serialize — `color(display-p3 0.5 0.1 0.2)` serializes without the
`color()` function name. `FunctionValue.toString()` (⚠23) injects commas into
space-separated color function arguments, breaking `parse(serialize(parse(s)))` identity.

**@property syntax (W73).** `value.js/src/parsing/stylesheet.ts:379–407` parses
`@property` registrations but treats the `syntax` string as opaque — `<color>` is not
typed against the property's `initial-value`, and `inherits` is not validated. kf's
engine emits `@property` registrations into the UA via `CSS.registerProperty` at
`engine.ts:1225/1318`, but `compileToCSS` / `CSSKeyframesToString` never re-emit them
backward (⚠15). The re-emit requires typed `syntax` support in value.js.

**The dispatch.** Filed in `KF-TO-VALUEJS-O-ASKS.md §5`:

- **VJ-O3 transform axis.** Fix `src/parsing/index.ts:61–105` to map `rotate(θ)` →
  `rotateZ(θ)` (not X+Y), `scale(s)` → `scaleXY(s)`, `skew(θ)` → `skewX(θ)·skewY(θ)`.
  Add a regression test that round-trips `transform: rotate(45deg)` and confirms the
  output matches CSS semantics.
- **VJ-O4 color() serialize.** Fix `src/parsing/color.ts`'s color() serializer to
  preserve the `color( )` wrapper and space-separate arguments. File alongside the
  `FunctionValue.toString()` VJ-L2 fix (S7).
- **VJ-O5 @property typed syntax.** Type the `syntax` string against the CSS Properties
  and Values API Level 1 grammar — at minimum: `<color>`, `<length>`, `<number>`,
  `<percentage>`, `<integer>`, `*`, the `|` union form. The `initial-value` is then
  validated against the typed syntax. This unblocks kf's `compileToCSS` `@property`
  backward serialization (L.W1 S2 / L.md §replay-equality: "@property registrations never
  re-emit backward").

**kf-side consume.** The transform-axis and color() fixes are correctness improvements
consumed transparently via re-pin (no kf code change required once value.js corrects the
output). `proof:replay-equality` (L.W1's born-RED gate) will GREEN the color() arm on the
VJ-O4 fix. The @property backward emit is an L.W1 S2 deliverable that unblocks on VJ-O5.

---

### S11 — parse-that PT-WAVE-4+: typesVersions surgery + packrat soundness + permutation
(W91–W93, W105, ⚠21, ⚠22, ⚠27 → parse-that)

**typesVersions (W91, ⚠21).** parse-that 0.9.0 published `typesVersions` pointing at
`dist/src/parse/index.d.ts` (a non-existent path). The modern `exports` map already
covers types correctly; the stale field is dead-code that confuses TypeScript resolution
(⚠21: "a legacy/workaround artifact — the modern exports map already covers types
correctly"). The fix is a parse-that-side `package.json` patch.

**Packrat soundness (W93, ⚠27).** `parse-that/src/packrat.ts` self-documents as UNSOUND
(id-only memoization key, not keyed on `(id, offset)`) and has zero production consumers.
The Warth-Douglass-Millstein `(id, offset)` re-key is BOOKED as PT-2 (the audit's
chronic-fold entry). The gate-first BOOK (`proof:packrat-sound` in parse-that, to be
authored before the cure) is the precondition.

**Permutation combinator (W105).** parse-that lacks a `permutation(...parsers)` combinator
for typed CSS `||` ("any order") semantics. value.js needs it to correctly parse the
`animation` shorthand's optional sub-properties in any order (the animation shorthand
can mix duration/delay/iteration-count in any combination — the current parser relies on
ordering heuristics). A typed `permutation` collapses a class of value.js grammar
workarounds that exist because the CSS `||` operator has no first-class expression.

**The dispatch.** Filed in `KF-TO-PARSE-THAT-ASKS.md`:

- **PT-WAVE-4a.** typesVersions surgery: remove the stale field, rely on `exports` map
  alone (self-contained; ships in a patch `0.9.x`).
- **PT-WAVE-4b.** packrat soundness: `(id, offset)` re-key per Warth-Douglass-Millstein.
  Gate-first: `proof:packrat-sound` authored before cure in parse-that's own gate suite.
- **PT-WAVE-5.** `permutation(...parsers)` combinator: typed `||` CSS any-order semantics.
  The combinatorial explosion is bounded to CSS property sub-values (small N, no recursion
  into at-rules). value.js re-pins parse-that on this cut and adopts `permutation` for the
  `animation` shorthand parser.

**kf-side consume.** The parse-that PT-WAVE-4a typesVersions fix is consumed immediately
on kf's next `^0.9.x` re-pin (it is a `package.json` patch on parse-that; no kf code
changes required). The packrat and permutation work are consumed by value.js (which pins
parse-that); kf sees the effect via value.js's grammar improvements. The one direct kf
edge: after S9 lands (kf drops its direct `parse-that` dep), the `package.json:194`
production dep is removed; parse-that remains a transitive dep through value.js only, which
is correct for the acyclic spine.

**Gate arm `proof:workaround-deletion` S11 (typesVersions).** After PT-WAVE-4a and kf
re-pins: `node -e "import('@mkbabb/parse-that').then(m => console.log(typeof m.any))"` must
exit 0 with output `"function"` (TypeScript types resolved cleanly). Born-RED today only
if the stale `typesVersions` path confuses the runtime import — this arm is LOW priority
relative to S7–S9 and may be OBSERVE-ONLY if the runtime is unaffected.

---

## Born-RED gate

### `proof:workaround-deletion` (NEW gate — born-RED on ALL arms today)

A new script `scripts/proof-workaround-deletion.mjs` with one arm per S-clause above.
Each arm:

1. Asserts the workaround PATTERN is absent from the kf source tree.
2. If the pattern IS present (workaround not yet deleted), checks whether the sibling
   PUBLISH has landed (`npm show <package>@<required-version>` — a registry probe).
3. If the publish has NOT landed: exits 0 with a PENDING notice (the born-RED is
   STAGED-PENDING, not a false-alarm failure).
4. If the publish HAS landed but the deletion is not done: exits 1 (the gate is TRULY RED
   — the sibling fixed the root, kf has not consumed).

**The gate design rationale.** This prevents the inverse mistake: declaring a workaround
"deleted" before the sibling has actually published the fix (which would leave the consumer
broken). The three-state model (PRESENT+UNPUBLISHED=PENDING / PRESENT+PUBLISHED=RED /
ABSENT=GREEN) maps exactly onto the Band-B consume-edge lifecycle.

**Witness inputs (RED on today's tree):**

| Arm | Witness command | Expected RED output |
|-----|-----------------|---------------------|
| S1 aria-suppress | `grep -n 'aria-orientation.*undefined' demo/spring/SpringSidebar.vue` | line 43 matches |
| S2 pointerHandled | `grep -rn 'pointerHandled\|onPlayPointerDown' demo/` | matches in the play-control composable |
| S7 linear regex | `grep -n 'LINEAR_PAREN_PREFIX' src/animation/utils.ts` | line ~183 matches |
| S8 FN_NAME | `grep -n 'FN_NAME' src/animation/utils.ts` | lines 45,51,55,294,298 match |
| S9 parse-that dep | `grep -n '@mkbabb/parse-that' src/animation/utils.ts` | line 1 matches |

### `proof:peer-satisfied` (REFERENCED — gate owned + authored by L.W4 S8; born-RED today)

The gate script `scripts/proof-peer-satisfied.mjs` is authored by L.W4 S8 (not
this wave); L.W9 S3 is the dispatch that GREENs it. Witness (the L.W4 gate's
behavior, restated for the consume edge):

```
npm ls --json 2>&1 | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const problems = JSON.stringify(d).includes('peerMissing') || JSON.stringify(d).includes('invalid');
process.exit(problems ? 1 : 0);
"
```

Today: glass-ui `^0.10.0||^0.11.0` rejects value.js `0.13.0` → ELSPROBLEMS → exit 1.
GREEN: glass-ui 4.1.x widens the peer range to admit 0.13.0+ → exit 0.

### `proof:boundary` extension (S9 arm)

`scripts/proof-boundary.mjs` gains a new assertion: scan every file in `src/animation/`
for `import … from "@mkbabb/parse-that"` and assert zero hits. Born-RED until S9
deletion lands. This extension is authored as part of L.W9 (the gate is already
maintained at that script; adding one assertion is a minimal delta).

---

## Deps

| Dep | Status | Gate |
|-----|--------|------|
| glass-ui 4.1.0 (SegmentedTabs aria, RF-17 dock, F-2 peer, GlassControlPoint, KF-OSCILLATOR) | IN-FLIGHT BB tranche | `proof:workaround-deletion` S1/S2; `proof:peer-satisfied` S3; `proof:boundary` S5 arm |
| value.js 0.14.0 Tranche O (VJ-O1 comma-list, VJ-L2 linear(), VJ-L1 flatLeaf, VJ-L3 parseCSSSubValue, VJ-O3 transform, VJ-O4 color(), VJ-O5 @property) | Tranche O (named, not yet open) | `proof:workaround-deletion` S6–S10; `proof:replay-equality` L.W1 color/transform arms |
| parse-that PT-WAVE-4a (typesVersions) | 0.9.x patch (self-contained) | `proof:workaround-deletion` S11 arm |
| parse-that PT-WAVE-4b (packrat soundness) | PT-WAVE-4b (gate-first BOOK) | parse-that `proof:packrat-sound` authored first |
| parse-that PT-WAVE-5 (permutation) | PT-WAVE-5 (after packrat) | value.js consume; kf via value.js |
| 4.3.0 published | CONFIRMED (`K/WZ`) | All consume-side deletions ride the stable kf surface |

**No glass-ui gate for S6–S11.** The value.js and parse-that dispatches are independent
of the BB tranche. Their consume gates on kf are `proof:workaround-deletion` arms that
resolve arm-by-arm as siblings publish — no coordination with the BB cadence required.

---

## Bite — what regression each gate catches

| Gate | Regression caught |
|------|-------------------|
| `proof:workaround-deletion` S1 (aria-suppress) | Re-introduction of `:aria-orientation="undefined"` at any pill strip site — the workaround fires again after the glass-ui fix, silently hiding a new glass-ui regression |
| `proof:workaround-deletion` S2 (pointerHandled) | Re-introduction of the pointerdown interim after a glass-ui regresses the dock click-strand fix — the gate would RED, making the regression visible before it ships |
| `proof:peer-satisfied` (F-2) | Any future glass-ui or value.js publish that re-introduces a peer-cycle in the kf install graph — the gate REDs immediately; the CI run surface shows the ELSPROBLEMS log |
| `proof:workaround-deletion` S7 (linear regex) | Rewriting the `getTimingFunction` path to add a NEW normalize step after VJ-L2 fixes the serialize — the workaround re-appears in a different form; the gate catches any `LINEAR_PAREN_PREFIX`-shaped pattern |
| `proof:workaround-deletion` S8 (FN_NAME) | Stamping any new private Symbol onto a published value.js class — the gate runs a broader `Symbol("kf.` pattern scan that catches the recurrence |
| `proof:workaround-deletion` S9 (parse-that dep) | A future import re-adding `@mkbabb/parse-that` to any production module after the dep is removed — the gate catches it before it reaches npm |
| `proof:boundary` S9 extension | A new HEAVY module importing `parse-that` directly (the inv-16 boundary violation), caught before the publish includes the transitive dep in the tarball |
| `proof:control-point-live` S4 (GlassControlPoint) | `GlassControlPoint` disappearing from a glass-ui publish (a removed export) after kf wires its curve editor — the gate reds before the wire-up ships |
| `proof:replay-equality` (L.W1) S10 color/transform arms | A value.js Tranche O VJ-O3/VJ-O4 regression that re-introduces the axis or serialize asymmetry — caught on kf's next `proof:replay-equality` run via the fixture set that exercises those parse paths |

---

## The dispatch documents (outbound)

L.W9 authors three new cross-repo ask documents alongside this wave spec:

1. **`docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md`** — the outbound glass-ui BB asks (S1–S5
   above: aria, RF-17, F-2 peer, GlassControlPoint, KF-OSCILLATOR). Mirrors the K-tranche
   `KF-TO-GLASSUI-BB-ASKS.md` form.

2. **`docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`** — the outbound value.js Tranche O asks
   (S6–S10 above: VJ-O1 comma-list, VJ-L2 linear(), VJ-L1 flatLeaf, VJ-L3
   parseCSSSubValue, VJ-O3 transform, VJ-O4 color(), VJ-O5 @property). Mirrors
   `KF-TO-VALUEJS-GRAMMAR-ASKS.md`.

3. **`docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md`** — the outbound parse-that asks (S11
   above: PT-WAVE-4a typesVersions, PT-WAVE-4b packrat, PT-WAVE-5 permutation).

Each document uses the `KF-TO-VALUEJS-GRAMMAR-ASKS.md` format: the acyclic-spine law up
front, the dispatch table, the per-ask §N with the precise gap + what the sibling ships +
how kf consumes, and a status ledger. **These are HAND-OFF documents** — kf does NOT write
the sibling trees; it names the ask, the sibling owns the implementation and version cut.
