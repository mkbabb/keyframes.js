# Lane 09 — L.W9 Band-B Dispatch: the five workarounds, Oscillator, and the dispatch docs

**Lane:** 09 · **Tranche:** M (seed audit) · **Date:** 2026-06-17  
**Branch audited:** `tranche-l-dev` (tip `529fcfd`) · **Commit containing W9:** `791b3bd`  
**Subject:** `proof:workaround-deletion` five-arm gate, `Oscillator` LIGHT primitive,
`proof:control-point-live`, the three dispatch docs  
**Gates re-run this session:**
- `node scripts/proof-workaround-deletion.mjs` → exit 0, 0 GREEN / 5 PENDING / 0 RED (confirmed)
- `node scripts/proof-control-point-live.mjs` → exit 1, RED by design (confirmed)
- `node scripts/proof-boundary.mjs` → exit 0, PASS (Oscillator LIGHT confirmed)

---

## §0 — Verdict summary

L.W9 is CORRECTLY framed and implemented. The three-state gate model is sound and
the five PENDING arms accurately reflect the inv-L-acyclic-purity framing. No arm is
miscategorized. One structural gap exists: `proof:boundary` does NOT yet extend its
`holdsValueJsSpecifier` check to catch direct `@mkbabb/parse-that` imports in heavy
modules (W96 — the extension is named in the dispatch but not yet authored in the
gate script). This is a known deferred item, not a framing error.

Two L-audit factual errors that implementation caught are properly recorded in
FINAL.md (the `!important` premise and CSS Nesting silent-drop-vs-THROW) — the W9
framing did not carry either error; both were in W1 and W10 scope, not W9.

The `Oscillator` LIGHT primitive shipped correctly at `src/animation/oscillator.ts`
and is verified LIGHT by `proof:boundary` GREEN. The `OscillatorOptions` naming
collision trap (the Web Audio API global) was caught proactively and resolved as
`OscillatorConfig`.

M owns the following on the consume-edge side: execute one of the two re-pin
commits (the glass-ui 4.1.x re-pin and the value.js 0.14.x re-pin) as each sibling
publishes, delete the corresponding workarounds, and flip the PENDING arms to GREEN.
M also owns the `proof:boundary` W96 extension (scan HEAVY modules for direct
`@mkbabb/parse-that` imports) — born-RED until S9 deletion lands.

---

## §1 — The five kf workarounds: ground-truth verification

Each workaround was verified against the live tree at `529fcfd`. The
`proof:workaround-deletion.mjs` gate was re-run and the output is recorded below.

### S1 — aria-orientation suppress (glass-ui SegmentedTabs pill-variant)

**Workaround present:** confirmed.

```
demo/spring/SpringSidebar.vue:43   :aria-orientation="undefined"
demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72
                                   :aria-orientation="undefined"
```

The L.W9 dispatch finalize COMPLETED the interim by adding the second suppress
(AnimationControls.vue:72) — the wave spec's §S1 "Interim posture — DECISION"
correctly chose the "suppress BOTH" path so the demo emits NO invalid
`aria-orientation` fleet-wide. A disk grep of `variant="pill"` across `demo/`
returns exactly two RENDER-SITE strips (SpringSidebar.vue:41,
AnimationControls.vue:67) and three non-render-site comment/composable hits — the
fleet-wide blast radius is precisely two strips, both suppressed. No third leak.

**Framing correctness:** the framing is accurate. The ARIA spec forbids
`aria-orientation` on `role=group` (the pill variant); the fix belongs in glass-ui
(inv-16); the consume-side deletion is gated on `@mkbabb/glass-ui@4.1.0` (E404
confirmed — unpublished). Gate arm: PENDING (PRESENT + UNPUBLISHED = exit 0).

**inv-L-acyclic-purity:** the interim is a workaround for a glass-ui defect,
correctly held at the consume seam while the sibling is un-published. No kf-local
cure is possible without re-implementing glass-ui's SegmentedTabs pill-branch logic.

**M obligation:** on glass-ui BB shipping the pill-branch guard: re-pin to the
published cut, delete BOTH `:aria-orientation="undefined"` lines (SpringSidebar.vue:43
and AnimationControls.vue:72) in ONE commit. Gate turns GREEN permanently.

### S2 — pointerHandled / onPlayPointerDown (RF-17 dock click-strand)

**Workaround present:** confirmed.

```
demo/@/components/custom/animation-controls/TransportDock.vue:15   comment
demo/@/components/custom/animation-controls/TransportDock.vue:151  @pointerdown="onPlayPointerDown($event)"
demo/@/components/custom/animation-controls/TransportDock.vue:196  @pointerdown.stop="onPlayPointerDown($event)"
demo/@/components/custom/animation-controls/TransportDock.vue:342  comment
demo/@/components/custom/animation-controls/TransportDock.vue:348  let pointerHandled = false;
demo/@/components/custom/animation-controls/TransportDock.vue:358  function onPlayPointerDown(e: PointerEvent)
demo/@/components/custom/animation-controls/TransportDock.vue:361  pointerHandled = true;
demo/@/components/custom/animation-controls/TransportDock.vue:366  pointerHandled = false;
demo/@/components/custom/animation-controls/TransportDock.vue:373  if (pointerHandled) return;
```

The comment at TransportDock.vue:313 documents the K.W1 revert history: the
`useDockClickIntegrity` attempt was reverted and the `pointerdown` interim retained.
The interim itself is a valid technical solution for the symptom (the click is
swallowed mid-morph crossfade) but it is at the WRONG LAYER — the cure belongs in
glass-ui's dock, not kf's consumer.

**Framing correctness:** DL-K9 chronicity is correctly stated as 3 (I, J, K → L).
P-invariant-28 bars a fourth BOOK. The gate arm is PENDING (PRESENT + glass-ui@4.1.0
UNPUBLISHED). The gate pattern matches the implementation correctly (L.W9.md's S2
gate spec matches the grep pattern in the mjs file).

**NOTE — gate naming discrepancy.** The L.W9 wave spec's S2 section (L.W9.md:150)
names the gate arm "`proof:workaround-deletion` S2" and the pattern
`grep -rn 'pointerHandled\|onPlayPointerDown' demo/`. However, the gate arm
in `proof-workaround-deletion.mjs` is labelled S2 (CORRECT). But the
`KF-TO-GLASSUI-BB-ASKS.md §2` block calls the kf gate `proof:rf17-net-deletion`
(not `proof:workaround-deletion S2`). The gate is correctly implemented as S2 in
`proof-workaround-deletion.mjs`; the `proof:rf17-net-deletion` name in the dispatch
doc is a reference alias, not a separate gate script. M should reconcile the name:
the implementation name (`proof:workaround-deletion S2`) is the ground truth.

**M obligation:** on glass-ui 4.1.0 + RF-17 dock cure: re-pin `~4.1.0`, delete the
entire `pointerHandled`/`onPlayPointerDown` block in TransportDock.vue. Gate arm
turns GREEN.

### S7 — linear() flat-comma normalize regex (value.js VJ-L2)

**Workaround present:** confirmed.

```
src/animation/utils.ts:119   const LINEAR_PAREN_PREFIX = /^\s*linear\s*\(/i;
src/animation/utils.ts:185   if (LINEAR_PAREN_PREFIX.test(timingFunction)) {
src/animation/utils.ts:194   const normalized = timingFunction.replace(/,\s*(-?[\d.]+%)/g, " $1");
```

The comment at utils.ts:187-189 is the correct ground truth: "value.js's own
stylesheet serializer emits a `linear()`'s stops as a FLAT comma list …
not the canonical space-joined … form its OWN `parseLinearStops` rejects."

**Framing correctness:** accurate. This is the serialize/parse asymmetry in
`value.js/src/units/index.ts:142` `FunctionValue.toString()` and
`value.js/src/parsing/easing.ts:65` `parseLinearStops`. The kf regex is a pure
consumer-side workaround for a sibling serializer bug. `@mkbabb/value.js@0.14.0`
E404 confirmed — unpublished. Gate arm: PENDING.

**Correction to the wave spec.** L.W9.md §S7 cites the gate pattern as:
```
grep -n 'LINEAR_PAREN_PREFIX\|,\\s\*\(-\?.*%\)' src/animation/utils.ts
```
The `proof-workaround-deletion.mjs` arm matches only `LINEAR_PAREN_PREFIX`
(not the raw regex pattern string) — a tighter but sufficient match, since the
regex `const` and the `if` branch are only present when the workaround is active.
The simplified grep is correct.

**M obligation:** on value.js 0.14.0 shipping VJ-L2: delete utils.ts:119
(`LINEAR_PAREN_PREFIX` const), utils.ts:185-197 (the normalize branch and
`try/catch`), re-pin `^0.14.0`. Gate arm turns GREEN.

### S8 — FN_NAME Symbol sidechannel (value.js VJ-L1)

**Workaround present:** confirmed.

```
src/animation/utils.ts:45   const FN_NAME = Symbol("kf.fnName");
src/animation/utils.ts:47   type NamedValueUnit = ValueUnit & { [FN_NAME]?: string };
src/animation/utils.ts:51   (u as NamedValueUnit)[FN_NAME];
src/animation/utils.ts:55   if (fnName !== undefined) (u as NamedValueUnit)[FN_NAME] = fnName;
src/animation/utils.ts:218  (comment: FN_NAME stamp)
src/animation/utils.ts:294  (comment: ValueUnit.clone() drops the FN_NAME stamp — re-apply it)
src/animation/utils.ts:347  (comment: FN_NAME stamped at flatten time)
```

The utils.ts:43-44 comment accurately describes WHY: `flattenObject`/value.js's
parse tree dissolves the `FunctionValue` wrapper into bare leaves, dropping the
function name; kf re-attaches it via a private Symbol. The `.clone()` drop at
utils.ts:294-298 is a correct description — `ValueUnit.clone()` does not preserve
Symbol-keyed properties.

**Framing correctness:** accurate. kf is writing private state onto a published
class it does not own (⚠18). The stamp-at-flatten + re-stamp-at-clone pattern is
a two-site workaround for a provenance gap in value.js's `ValueUnit` API. The
gate pattern `FN_NAME|Symbol\(\s*["']kf\.` is deliberately broader than the
specific constant to catch recurrences.

**M obligation:** on value.js 0.14.0 shipping VJ-L1 (a typed `flatLeaf` factory or
a documented `fnName` field on `ValueUnit`/`FunctionValue`): delete utils.ts:45-57
(FN_NAME const + NamedValueUnit type + fnNameOf + stampFnName functions), replace all
call sites with value.js's first-class API, delete the clone re-stamp at
utils.ts:294-298. Gate arm turns GREEN.

### S9 — direct @mkbabb/parse-that import (value.js VJ-L3)

**Workaround present:** confirmed.

```
src/animation/utils.ts:1   import { any as parseAny } from "@mkbabb/parse-that";
```

The `any` combinator is used at utils.ts:228-250 to compose value.js's typed parsers
across the cross-realm nominal-type boundary. `package.json` carries
`"@mkbabb/parse-that": "^0.9.0"` as a production dep. This is the only HEAVY module
with a direct parse-that import — utils.ts is HEAVY (it imports from `@mkbabb/value.js`
at line 2).

**Framing correctness:** accurate as an acyclic-spine violation (⚠24). The
`any` composition belongs in value.js (which already owns all the parsers); kf
reaching through value.js's parser abstraction to parse-that primitives is the wrong
layer. The cure is value.js exposing `parseCSSSubValue(property, str)`.

**CRITICAL GAP — `proof:boundary` does NOT cover this.** The dispatch doc
(L.W9.md §S9, line 381-382) names the needed extension: "extend
`holdsValueJsSpecifier` to also catch direct `@mkbabb/parse-that` imports in
HEAVY modules (audit W96)." But `proof-boundary.mjs` at `529fcfd`:
- `holdsValueJsSpecifier` (lines 93-107) only checks for `@mkbabb/value.js`
  specifiers — NOT `@mkbabb/parse-that` specifiers.
- The source-grep complement (lines 363-380) runs `holdsValueJsSpecifier` only over
  LIGHT source modules — not HEAVY modules.
- There is NO assertion anywhere in `proof-boundary.mjs` that scans HEAVY modules
  for direct parse-that imports.

This means **a new HEAVY module importing `@mkbabb/parse-that` directly would NOT
be caught by `proof:boundary`** today. The W96 extension is NAMED but NOT
AUTHORED. This is a born-RED deferred item that M must author before the S9
deletion lands — otherwise the deletion gate (the `proof:workaround-deletion` S9
arm) could turn GREEN while a new HEAVY parse-that import sneaks in unreported.

The S9 arm of `proof:workaround-deletion` is correctly scoped to `utils.ts` only
(the current known violator). After the deletion lands, the boundary gate extension
is the PERMANENT guard against recurrence.

**M obligation:** (1) Author the `proof:boundary` W96 extension — add a scan of ALL
HEAVY source modules for direct `@mkbabb/parse-that` imports to
`proof-boundary.mjs`, born-RED today (utils.ts:1 fires it); (2) on value.js 0.14.0
shipping VJ-L3: delete utils.ts:1 (the parse-that import), replace the
`parseAny([...])` composition with `parseCSSSubValue(property, value)`, remove
`"@mkbabb/parse-that"` from `package.json` `dependencies`; (3) the boundary gate
turns GREEN permanently.

---

## §2 — The Oscillator LIGHT primitive

### Implementation fidelity

`src/animation/oscillator.ts` was verified against the L.W9.md §S5 specification.

**API shape matches spec:**
- `class Oscillator` with `readonly phase: number` (actually `phase = 0`, mutable
  only via `tick`) — `tick(dt: number): number` + `sample(t: number): number` +
  `get value(): number` (spec-matched).
- Constructor takes `OscillatorConfig` (not `OscillatorOptions`) — the naming
  choice documented at oscillator.ts:30-38 is CORRECT and M-audit-worthy: the Web
  Audio API `lib.dom.d.ts` declares a global `interface OscillatorOptions`, and a
  kf `OscillatorOptions` type would collide in the API-Extractor d.ts roll-up
  (the same PKG-3 defect that `proof:published-surface` clause (h) gates; the same
  collision L.W8 S4 renamed `Animation`/`ScrollTimeline` away from). The `Config`
  suffix is the correct non-colliding choice.

**Additional export:** `waveformValue(phase, waveform)` is exported alongside
`Oscillator` (index.ts:74-75) as a value.js-free pure function. This is a useful
primitive the spec did not explicitly charter but is coherent (a consumer who wants
the waveform without the stepper state gets it). NOT a precept violation — a small,
cohesive addition.

**LIGHT boundary verified:** `node scripts/proof-boundary.mjs` → exit 0, PASS.
oscillator.ts carries ZERO static value.js edge (pure trig/floor math). The gate's
source-grep complement confirms 24 light source modules, 0 dormant static
specifiers — oscillator.ts is among those 24, so the LIGHT assertion is machine-
confirmed, not just grep-level.

**Index export:** `src/animation/index.ts:74-75` exports `Oscillator`,
`waveformValue`, `OscillatorConfig`, `OscillatorWaveform` — correctly on the LIGHT
static surface. `proof:agent-surface` was RED (stale index post-W9) and cured at
`529fcfd` via `gen-agent-surface.mjs` — the orchestrator's close action.

**Gate arm for `proof:boundary`:** The L.W9.md §S5 spec states "assertion-3 must
enumerate `Oscillator` as a LIGHT named export with zero static value.js edge". The
existing `proof:boundary` gate covers this via the source-grep complement — every
light source module is scanned for value.js specifiers. No separate assertion-3 was
authored; the existing gate is sufficient (the `Oscillator` entry in the LIGHT
barrel means oscillator.ts is in `lightSourceModules`; the scan confirms no
value.js edge). This is fine — the spec overspecified a new assertion that the
existing coverage already provides.

### M assessment

The Oscillator primitive is COMPLETE and CORRECT. M has no obligation here
except: if glass-ui BB's `W-EASING-PRIMITIVE` wave confirms an API shape that
diverges from the current signature (e.g., needs a `reset()` method, a different
`waveform` enum, or a `.value` property returning `[0, 1]` instead of `[-1, 1]`),
kf should evolve the shape in M to match the consume signal. The current shape
(`[-1, 1]` per waveform) is canonical for oscillator output in audio/animation
conventions, but the glass-ui BB confirmation may specify differently. Track via
the named tripwire in `KF-TO-GLASSUI-BB-ASKS.md §5`.

---

## §3 — proof:control-point-live

### Gate implementation

`scripts/proof-control-point-live.mjs` was read and the gate re-run.

Exit code: 1, RED by design. Output:
```
GlassControlPoint is ABSENT from the published @mkbabb/glass-ui@4.0.0 dist tree
(grep -rn 'GlassControlPoint' node_modules/@mkbabb/glass-ui/dist/ → ZERO).
```

The gate implementation is sound:
1. Checks that `@mkbabb/glass-ui` is installed.
2. Greps the dist tree for `GlassControlPoint` — zero hits → fail with precise reason.
3. If the name IS present, additionally checks for co-located SVG handle + pointer
   drag markers (`pointerdown`/`setPointerCapture`) to assert the shape.
4. Attempts a dynamic barrel import to confirm importability.

**CI posture:** `proof:control-point-live` rides the report-all `continue-on-error`
lane (ci.yml:391-392), NOT the blocking `proof:hygiene` chain. Confirmed correct —
the expected RED does not abort the CI run.

**P-invariant-28 compliance:** DL-K7 chronicity is correctly stated as 6 (E, F, G,
H, I, J, K → L). The `KF-TO-GLASSUI-BB-ASKS.md §4` dispatch correctly presents
three options (A/B/C) and records "Option C (KILL)" as the terminal exit if glass-ui
does not scope it. M is the next tranche — if GlassControlPoint is still absent at
M.WZ, the row MUST exit as KILL (Option C). M cannot BOOK it for a seventh tranche
under P-invariant-28.

**M obligation:** (a) if glass-ui BB ships `GlassControlPoint` and kf re-pins:
consume the published primitive, wire the keyframes-editor view over it — the gate
turns GREEN. (b) If glass-ui BB records Option C (KILL): close DL-L7/DL-M-analog
as KILL, delete the gate (or tombstone it), document the permanent KILL decision.
(c) The gate MUST NOT be weakened or removed without a stated KILL decision.

---

## §4 — The three dispatch documents

### KF-TO-GLASSUI-BB-ASKS.md

Five asks verified. §1 (aria fix), §2 (RF-17 dock), §3 (F-2 peer-cycle), §4
(GlassControlPoint), §5 (KF-OSCILLATOR co-schedule).

**§3 F-2 peer-cycle — current evidence:** `npm show @mkbabb/glass-ui version` →
`4.0.0`. The `peerDependencies` for glass-ui 4.0.0 carry
`"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` per the dispatch doc. kf pins
`^0.13.0`. The peer conflict is LIVE. `proof:peer-satisfied` (L.W4 S8 gate, not
W9) is born-RED and runs with `continue-on-error`.

**§5 KF-OSCILLATOR framing gap.** The dispatch says kf "ships Oscillator once the
BB consume signal confirms the wave + API shape." But at commit `791b3bd`
(L.W9) the Oscillator was SHIPPED unconditionally — the wait-for-consume-signal
discipline was not honored in the implementation. The FINAL.md §S5 confirms
"The Oscillator LIGHT primitive shipped at L.W9." The FINAL also records
`proof:agent-surface` RED because the shipped Oscillator was not in the index —
a symptom of the ship-before-signal decision.

This is not a precept violation per se (the Oscillator is value.js-free and
LIGHT; shipping it early is safe), but it IS an inv ε discrepancy between the
wave spec ("ship once BB confirms") and the implementation ("shipped immediately").
M should note this as a framing tension: the wave spec prescribed a consume-signal
gate that was not enforced. If glass-ui BB's W-EASING-PRIMITIVE requires a
DIFFERENT API shape than what shipped, kf has a breaking change obligation in M.

### KF-TO-VALUEJS-O-ASKS.md

Fourteen asks verified (§1–§14 counting the gap items). The five active workaround
deletions (§5 linear regex, §8 FN_NAME + parse-that dep) are correctly described and
match the live source. The nine "no kf workaround to delete" items (§1–§4, §6–§7,
§9–§10, §12–§14) are correctly characterized — for each, either the loss is
upstream of kf's gates (silent forward-leg loss), or the failure is a hard THROW
that cannot be worked around at the consume seam.

**Factual accuracy on the L-audit factual errors the task names:**

1. `!important` premise: the original L.W9 framing (in the audit skeleton) stated
   kf should round-trip `!important` inside keyframes. This was a WRONG premise
   caught at L.W1 implementation. The KF-TO-VALUEJS-O-ASKS.md §12 correctly
   records the spec-faithful verdict (CSS Animations §3 — keyframe `!important` is
   invalid and dropped). The L.W9 wave spec's §S8 does NOT reference `!important`
   at all — the W9 framing did not carry this error; it was a W1-scope correction.

2. CSS Nesting "silent-drop" mis-attribution: KF-TO-VALUEJS-O-ASKS.md §9.1
   contains the CORRECTION itself: "CSS Nesting is NOT a silent drop — it is a
   hard THROW (L.W10 §1 row 1 correction, RE-CONFIRMED 2026-06-17)." The doc
   records both the original audit finding (silent drop) and the implementation-
   discovered truth (hard THROW: `Parse error at offset N` on `parseCSSStylesheet`
   when `&` is in the input). This is an inv ε correction, not a framing error in
   W9 — W9 consumed the spike result from W10 research and correctly updated.

Both audit-factual errors are cited in the dispatch documents AS CORRECTIONS, not
as live errors. The dispatch docs are accurate.

**§14 lerpArray inline — M framing note.** The dispatch correctly characterizes the
inline `lerpArray` in kf's LIGHT tier as a "DRY/spine-cleanliness band-aid forced by
the missing `@mkbabb/value.js/math` subpath." This is accurately framed as a
missing-subpath forcing function, NOT a defect workaround. The inline copy
(`src/animation/internal/leaves.ts` — confirmed LIGHT, no value.js edge) is
small (~10 LOC) and low-risk. M should consume the subpath and delete the inline
when value.js 0.14.0 ships the `./math` entry.

### KF-TO-PARSE-THAT-ASKS.md

Six asks verified. The acyclic-spine law is correctly stated (§7): the one active
kf→parse-that direct edge is the `any` combinator at utils.ts:1, and the correct
cure is value.js exposing `parseCSSSubValue` (not kf rolling its own `any`).

**§1 architectural unification:** The L.W10 spike chose Option B → rephrase:
`docs/tranches/L/audit/W10-css-parity-spike.md §3.2` records "delete parse-that's
`parsers/css/` STRUCTURAL grammar, keep the value readers, consolidate the one CSS
grammar in value.js" — which is Option A (delete), not Option B (promote). The
dispatch doc's §1 offers A and B as open choices; the W10 spike decided Option A.
The dispatch doc was authored BEFORE the spike decision landed; it is not wrong, it
is pre-decision. M should update `KF-TO-PARSE-THAT-ASKS.md §1` to record the
W10-spike direction: **Option A chosen** (parse-that's `parsers/css/` to be
deleted; value.js is the sole grammar authority). This is a docs-only update.

---

## §5 — inv-L-acyclic-purity framing audit

The core question the task poses: are the five workarounds correctly framed as
"sibling-fix-and-re-pin" (inv-L-acyclic-purity), not kf-local fixes?

### S1 (aria-orientation suppress)

**Correctly framed.** The fix is at glass-ui's `SegmentedTabs` pill-branch — one
conditional guard that makes ALL consumers correct at once. A kf-local fix would
require per-call-site suppression on every `variant="pill"` strip, indefinitely,
which is exactly what the current interim does. The sibling-fix-and-re-pin path
makes two suppression lines disappear entirely. inv-16: the demo writes no
glass-ui source. Correct.

### S2 (pointerHandled interim)

**Correctly framed.** The dock collapse-crossfade race is at the glass-ui layer
(GlassDock + W-DOCK-MORPH-FAMILY). A kf-local cure that worked would be a deeper
reimplementation of the dock timing — impossible without copying glass-ui's collapse
animation logic into the demo, which inv-16 forbids. The current interim patches the
symptom (the click swallowing) at the consumer. Correctly a glass-ui fix. Correct.

### S7 (linear() regex)

**Correctly framed.** The asymmetry is in `value.js/src/units/index.ts:142`
`FunctionValue.toString()` serializing `linear()` stops with commas where
`parseLinearStops` expects spaces. A kf-local "fix" would be to always call the
regex before calling `parseLinearStops` — which is exactly what the workaround
already is. There is no more correct kf-local approach; the only correct fix is at
value.js's serializer. Correct.

### S8 (FN_NAME Symbol)

**Correctly framed.** The gap is that value.js's `ValueUnit.clone()` drops all
Symbol-keyed properties (it does a field-copy of known typed properties, not a full
object clone). A kf-local fix that "solved" this would need to either: (a) not use
`ValueUnit.clone()` at all and re-parse every value on each use (expensive,
wasteful), or (b) maintain a parallel Map<ValueUnit, string> from instance to
function name (complex, brittle, not GC-friendly). Both options are worse than the
current Symbol stamp + re-stamp pattern. The correct fix is value.js exposing a
typed `fnName` field or a `flatLeaf` constructor. Correct.

### S9 (parse-that direct dep)

**Correctly framed.** The `any` combinator is needed to compose value.js's parsers
across cross-realm module instances. A kf-local "fix" would be to inline value.js's
`any` combinator in kf's source — re-implementing a parse-that primitive AT the
consume seam, which is exactly what inv-L-acyclic-purity and the no-workaround
precept forbid. The correct fix is value.js exposing `parseCSSSubValue` internally
composing its own parsers. Correct.

**All five workarounds pass the acyclic-purity framing test.** No kf-local cure
is more idiomatic than the current interim. The sibling-fix-and-re-pin path is the
only gestalt (KISS / no-workaround) path in each case.

---

## §6 — Three-state model correctness

The `proof-workaround-deletion.mjs` three-state model was re-verified against the
gate design spec (L.W9.md §Born-RED gate):

**ABSENT → GREEN** (workaround gone, cure consumed): zero hits in grep → exit 0.
**PRESENT + UNPUBLISHED → PENDING** (staged Band-B state, not a failure): grep hits +
`npm show <pkg>@<version>` → E404 → exit 0 with PENDING notice.
**PRESENT + PUBLISHED → RED** (sibling fixed the root, kf has not consumed): grep hits +
`npm show` → exit 0 with version → exit 1.

The INDETERMINATE case (network failure / registry unreachable) correctly collapses
to PENDING, not RED. This is the critical guardrail: a flaky npm registry must not
cause a workaround-that-is-still-needed to appear as overdue-and-safe-to-delete.

Current state: all five arms PENDING. Exit 0. Confirmed correct.

**CI posture for `proof:workaround-deletion`:** The gate is a member of
`proof:hygiene` (package.json:190 confirms it is in the `proof:hygiene` chain).
This is CORRECT — today every arm is PENDING → exit 0 → does not abort the
blocking chain. The gate only turns RED (exit 1) when a sibling publishes the fix
and kf has not consumed — which is exactly the case when an action IS safe and IS
required. The PENDING state means the gate adds zero blocking friction until it
is actually needed.

---

## §7 — Precept findings

### NO-quick-solution / no-workaround violations found IN THE W9 IMPLEMENTATION

None. The five workarounds are all correctly held at the consume seam with a
PENDING gate. No workaround was deleted before the sibling published. The
`proof:workaround-deletion` three-state model itself IS the no-quick-solution
discipline for the Band-B lifecycle.

### Legacy code violations

None found in W9 scope.

### inv ε violations

**One gap:** The KF-TO-GLASSUI-BB-ASKS.md §5 KF-OSCILLATOR framing says "kf ships
Oscillator once the BB consume signal confirms the wave + API shape" — but the
Oscillator shipped unconditionally at `791b3bd`. This is an inv ε tension: the wave
spec prescribed a consume-signal gate that was not enforced. The FINAL.md §S5
records "The Oscillator LIGHT primitive shipped at L.W9" without noting the
consume-signal precondition. Since the Oscillator is LIGHT, value.js-free, and
has a sound API, the early ship is LOW risk. M should note the open API-shape
confirmation obligation.

### Non-gestalt / altitude issues

None. The dispatch documents are well-structured and each ask is layered correctly
(kf names the gap + the cure's layer; never re-implements the sibling).

---

## §8 — Performance numbers

No performance metrics are applicable to W9. The workaround deletions are source-
only changes with no runtime hot path effect (the regex normalize and the Symbol
stamp are called at parse time, not per-frame). The Oscillator is LIGHT and
tiny (~120 LOC); its steady-state cost is floor/multiply/trig — the same as any
WebAudio oscillator. No bench was authored for the Oscillator, nor is one
warranted for a construction-time gate.

The `proof:boundary` gate (bundle analysis) exits 0, confirming the Oscillator
adds no static value.js edge to the light bundle. Bundle size impact: ~120 LOC ≈
~2 KB unminified; negligible.

---

## §9 — M ownership summary

| Item | M wave | Tripwire | Gate state today |
|------|--------|----------|-----------------|
| S1 aria-orient deletion | M consume | glass-ui 4.1.x (4.1.0 E404) | PENDING → GREEN |
| S2 pointerHandled deletion | M consume | glass-ui 4.1.0 RF-17 (E404) | PENDING → GREEN |
| S7 linear regex deletion | M consume | value.js 0.14.0 VJ-L2 (E404) | PENDING → GREEN |
| S8 FN_NAME Symbol deletion | M consume | value.js 0.14.0 VJ-L1 (E404) | PENDING → GREEN |
| S9 parse-that dep deletion | M consume | value.js 0.14.0 VJ-L3 (E404) | PENDING → GREEN |
| `proof:boundary` W96 ext | M Band A | none (kf-internal) | UNAUTHORED (no gate exists) |
| GlassControlPoint | M consume or KILL | glass-ui BB (P-inv-28 terminal) | RED by design |
| Oscillator API confirm | M (shape validation) | glass-ui BB W-EASING-PRIMITIVE | open |
| KF-TO-PARSE-THAT §1 Option A | M docs | W10-spike decided | docs update only |

**Priority ordering for M:**
1. **`proof:boundary` W96 extension** — author it now (kf-internal, no sibling dep);
   it gates the S9 deletion's correctness guarantee.
2. **glass-ui 4.1.x consume** — one commit that simultaneously deletes S1 (BOTH
   suppress lines), S2 (pointerHandled block), and re-pins `~4.1.x`. If F-2
   peer-cycle is in the same cut, `proof:peer-satisfied` turns GREEN in the same
   commit.
3. **value.js 0.14.0 consume** — one commit (or two if VJ-L1/VJ-L3 are in different
   cuts) deletes S7 (linear regex), S8 (FN_NAME block), S9 (parse-that import + dep).
4. **GlassControlPoint decision** — confirm Option A (consume) or Option C (KILL)
   with BB. No seventh tranche BOOK under P-invariant-28.
5. **Oscillator API shape confirm** — get BB's W-EASING-PRIMITIVE wave + API spec;
   evolve `OscillatorConfig` if needed before glass-ui consumes it.
