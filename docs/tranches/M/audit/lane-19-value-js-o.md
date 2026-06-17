# Lane 19 — value.js Tranche O (the kf consume-edge audit)

**Authored:** 2026-06-17 · **Branch:** `tranche-j-dev` (kf 4.2.0 tree) ·
**Verified against:** value.js 0.13.0 source at `/Users/mkbabb/Programming/value.js/` +
kf L-close tree (`tranche-l-dev` tip `4686aa4`) + `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`
(the 14-ask L-Band-B dispatch doc, authored 2026-06-16).

**Inv ε discipline.** Every claim below cites an OBSERVED oracle — a file:line anchor
or a live-probe result. The L audit shipped factual errors the L.W10 spike corrected
(CSS Nesting mis-attributed as "silent drop" when value.js actually THROWS; parse-that's
`cssParser` probed instead of value.js's `parseCSSStylesheet`). This lane applies the
same adversarial posture: claims that could be wrong are probed against source before
being asserted.

---

## §0 — VERDICT IN ONE PARAGRAPH

value.js is at **0.13.0** (published 2026-06-16). Its two kf-K-dispatched grammar items
(`sampleColorRamp` N.W11.D + the `CSSTimelineOptions` scroll grammar N.W11′) LANDED in
the 0.13.0 cut and are already consumed by kf `^0.13.0`. The **twelve L-Band-B asks** in
`KF-TO-VALUEJS-O-ASKS.md` are ALL OPEN at 0.13.0 — none landed in N. value.js has NO
Tranche O spec or PROGRESS.md (the `docs/tranches/O/` directory does not exist).
**Tranche M must be the kf-side consume-cadence owner**: born-RED-gated kf-side (L.W9
authored the gates, all born-RED at 0.13.0), pending value.js shipping a 0.14.0 cut that
closes the open items. The two HARD-CRASHES on Baseline-stable CSS (CSS Nesting THROWS §9
+ bare `linear-gradient(red,blue)` THROWS §13) are P0 — kf cannot work around them at the
consume seam without violating `inv-L-acyclic-purity`; they gate any kf demo or consumer
that feeds a nested stylesheet or bare gradient to the adapter.

---

## §1 — value.js version truth

**Installed pin:** `@mkbabb/value.js: ^0.13.0` (`package.json:212`).
**Published at:** `0.13.0` (CHANGELOG.md line 1: `[0.13.0] — 2026-06-16`).
**Tranche O:** `docs/tranches/O/` — DOES NOT EXIST in the value.js working tree.
value.js's Tranche N is the one closed at 0.13.0; the next successor is unnamed/unopened
as of 2026-06-17.

**What N.W11.D landed (VERIFIED):**

- `sampleColorRamp(from, to, n, opts)` — exported at `src/index.ts:158` + `units/color/mix.ts`
- 13 oracle tests in `test/color-ramp.test.ts` (CHANGELOG.md:25)
- Un-blocks kf-K.W10 CC-2 oklab densify (LANDED at kf 4.3.0, consumed)

**What N.W11′ landed (VERIFIED):**

- Full `CSSTimelineOptions` scroll grammar in `src/parsing/scroll-timeline.ts`
- Exported: `parseAnimationTimeline`, `parseAnimationRange`, `serializeAnimationTimeline`,
  `serializeTimelineOptions`, and 10 more symbols (`src/index.ts:283-308`)
- 55 oracle tests in `test/scroll-timeline.test.ts` (CHANGELOG.md:57)
- Un-blocks kf-K.W9 scroll-as-CSS parse round-trip (LANDED at kf 4.3.0, consumed)

**CHANGELOG.md NOTES section (0.13.0) — self-acknowledged open items:**

The 0.13.0 CHANGELOG explicitly acknowledges two defects in the stylesheet
parser, left open by design as out-of-scope for N's library track
(`CHANGELOG.md:66-75`):

1. `scroll(root block)` round-trips as `scroll(root, block)` — the
   comma-injection from `FunctionValue.toString()` (`src/units/index.ts:184`).
2. A property-level `#`-list (`timeline-scope: --a, --b`) is truncated to its
   first segment by `parseDeclarationValue` (`stylesheet.ts:212-235`).

Both are direct confessions of §5 (FunctionValue comma-injection) and §1
(comma-list silent truncation) in the L dispatch doc. The N authors knew
these were open; they deferred them.

---

## §2 — The 14 L-dispatch asks: open/closed status at 0.13.0

**Ground truth source:** `src/` of value.js 0.13.0 tree, probed file-by-file.

### §2.1 — §1 comma-list declaration grammar (OPEN)

`parseDeclarationValue` at `src/parsing/stylesheet.ts:212-235` still runs
`CSSValues.Values` over the value text, returns `status=true` on the
first comma-segment, silently dropping the remainder. The dead-code fallback
comment at `stylesheet.ts:219-220` still reads *"comma-separated lists like
`font-family: Arial, sans-serif`"* and still never fires (the `CSSValues.Values`
parse succeeds on the first segment before the fallback can run).

The CHANGELOG's NOTES section (0.13.0:70-74) confirms this is OPEN: *"A
property-level `#`-list declaration value (`timeline-scope: --a, --b`) is
truncated to its first segment by the stylesheet parser's `ValueArray`."*

**kf effect:** `adapter.ts` `declsToVarMap` reads `decl.value` verbatim into
the var map; multi-value box-shadow/transition/font-family/background tails are
GONE before any kf gate runs. No kf workaround is possible (re-parsing the
declaration text kf-side would re-implement value.js's grammar —
`inv-L-acyclic-purity` forbids it). The `proof:replay-equality` multi-value
arm is born-RED today.

### §2.2 — §2 transform axis semantics (OPEN)

`handleTransform()` at `src/parsing/index.ts:61-104` still EXPANDS
`rotate()`/`scale()`/`skew()` across X/Y/Z axes non-isomorphically: a
single-argument `rotate(45deg)` becomes `{rotateX: 45deg, rotateY: 45deg,
rotateZ: 45deg}` (the `values.length === 1` branch at `index.ts:87-90`
broadcasts to ALL three dimensions). CSS `rotate(45deg)` ≡ `rotateZ(45deg)` per
CSS Transforms spec — the expansion is a correctness breach.

The comment at `index.ts:76-79` says *"CSS has no skewZ() — skew only has X and
Y axes"*, confirming the axis semantics are hand-coded per-function, not
spec-derived. `scale(2)` similarly broadcasts to X+Y+Z rather than X+Y.

**kf effect:** kf's `parseAndFlattenObject` (`utils.ts:258`) sets `property` +
`subProperty` on each transform leaf for matrix lerp; a wrong axis expansion
makes kf lerp a wrong matrix and renders a wrong frame. No kf workaround (kf
cannot un-expand a value.js expansion — the axis identity is already lost).

### §2.3 — §3 color() replay-equal + var() inside color (OPEN)

`colorFunction` at `src/parsing/color.ts:508-543` parses `color(srgb 0 0 1)`
but converts the space-named components directly to an `RGBColor`/typed Color
object (line 533-542), losing the `color(…)` wrapper entirely. `.toString()` on
the result emits `rgb(0 0 255)`, not `color(srgb 0 0 1)` — the round-trip is
broken.

`colorValue` at `src/parsing/color.ts:257-269` parses ONLY `<percentage>`,
`<angle>`, `<number>`, and `none` — NO `var()` branch. A `var()` token inside
a color component (e.g. `oklch(var(--l) 0.2 180)`) falls through the `any(...)`
and is unmatched, causing the parent parser to fail with a THROW.

**kf effect:** a `var()` THROW aborts the whole keyframe parse
(`adapter.ts:201` calls `parseCSSStylesheet` which calls `colorValue`). No kf
workaround (a THROW cannot be worked around at the consume seam).

### §2.4 — §4 @property typed grammar (PARTIAL — serializer EXISTS at 0.13.0)

`buildPropertyDescriptor` at `src/parsing/stylesheet.ts:379-395` stores
`syntax` as a raw string (`:386` strips quotes only), not typed against the
`<syntax>` grammar. `initial-value` is parsed AS a CSS value (to a `ValueArray`
via `parseDeclarationValue`) but NOT validated against the `syntax` type.

**IMPORTANT CORRECTION vs L audit premise:** The L dispatch (`KF-TO-VALUEJS-O-ASKS.md §4.1`)
was careful to note that value.js's `serializeStylesheetItem` IS the existing
serializer for `@property` blocks — and this is VERIFIED: `serialize.ts:52-70`
`serializeProperty` re-emits `syntax:"<color>"` + `inherits: true` + the
`initial-value` as a ValueArray `.toString()`. kf's L.W1 already CONSUMES this
(`engine.ts:1225` wires `serializeStylesheetItem` — `FINAL.md §S1`). The typed
`<syntax>` widening (the O ask) is an ENHANCEMENT on top of the existing
working serializer — not a from-scratch fix.

**kf effect:** The `@property` backward-serialize is NOW WORKING at 0.13.0
(the L.W1 cure consumed the existing `serializeStylesheetItem`). The O ask
§4 is a typed-syntax widening, not a blocker.

### §2.5 — §5 linear() + FunctionValue comma-injection (OPEN — ACTIVE kf WORKAROUND)

`FunctionValue.toString()` at `src/units/index.ts:184` emits ALL function
arguments joined with `", "` — including `linear()` stops and `scroll()`
positional args that the CSS spec specifies as space-separated. The 0.13.0
CHANGELOG NOTES confirms this is OPEN (*"scroll(root block) round-trips through
Declaration.value.toString() as scroll(root, block)"* — CHANGELOG.md:69-70).

**The active kf workaround** is at `src/animation/utils.ts:193-196`:

```ts
const normalized = timingFunction.replace(
    /,\s*(-?[\d.]+%)/g,
    " $1",
);
```

This regex re-normalizes value.js's flat comma list back to the canonical
space-joined form before handing it to `parseLinearStops`. The comment at
`utils.ts:187-189` explicitly names this as a value.js 0.12.0 serialize/parse
asymmetry. This is a live `inv-L-acyclic-purity` violation — a consumer-side
correction of a published sibling bug, flagged as born-RED-pending-delete.

### §2.6 — §6 partial-input HONESTY (OPEN — inert sink)

`parseDeclarationValue` (`stylesheet.ts:212-235`) treats a partial parse as
SUCCESS. The `onParseError` sink at `adapter.ts:173-186` was authored in L.W3
to consume value.js's `OnParseError`/`ParseDiagnostic` channel — but value.js's
partial parse never REPORTS a failure (it succeeds on the first segment), so
the sink is born-inert. It will activate only when value.js ships the
no-partial-success contract (the O ask §6).

### §2.7 — §7 perf VJ.L1–L8 (OPEN)

The alloc hot paths are UNCHANGED at 0.13.0:

- `transformMat3` (`src/units/color/matrix.ts:19-26`): returns a NEW `[number, number, number]`
  tuple on every call (the `return [m[0]*x…]` inline tuple). Paid on every
  oklab/oklch conversion.
- `oklab2xyz`/`xyz2oklab` (`src/units/color/conversions/oklab.ts:28/57`): each allocates
  intermediate `Vec3` tuples via `const lms = transformMat3(...)` and `const lmsLinear: Vec3 = [...]`
  per call (lines 45-48 and 61-64).
- `mixColors` (`src/units/color/dispatch.ts:391-463`): allocates `resultComponents: number[] = []`
  at `:432` and calls `c1.keys().filter(k => k !== "alpha")` at `:424` on every call — a
  `filter` closure + array alloc paid on every `sampleColorRamp` stop.
- `normalizeColor` (`src/units/color/normalize.ts:40-51`): `color.keys().forEach(...)` hot-loop
  closure per call.
- `gamutMapToRgbSpace` (not directly named but the gamut-map path constructs OKLCHColor instances
  inside the binary-search loop at `gamut.ts`).

**No kf workaround to delete** — this is a missed opportunity (⚠34 / W122 in
L audit), not a precept violation. The BORN-RED-against-budget bench gate
(`proof:zero-alloc` extension) is in the L.W9 apparatus, waiting for the
value.js alloc-drop to land.

### §2.8 — §8 parseCSSSubValue + FN_NAME Symbol (OPEN — TWO ACTIVE workarounds)

**Workaround 1 — direct `@mkbabb/parse-that` dep:**
`src/animation/utils.ts:1`: `import { any as parseAny } from "@mkbabb/parse-that"`.
This is kf's only production use of parse-that — exclusively to compose
value.js's own parsers (`CSSFunction.FunctionArgs` + `CSSValues.Value`) via
parse-that's `any` combinator. The composition belongs in value.js (W94, viol24).
The `@mkbabb/parse-that: "^0.9.0"` line in `package.json:211` is the live dep.

**Workaround 2 — FN_NAME Symbol stamp:**
`src/animation/utils.ts:45-57`: `const FN_NAME = Symbol("kf.fnName")` +
`type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }`. kf stamps this
Symbol onto value.js `ValueUnit` instances because `flattenObject`/value.js's
parse tree dissolves the `FunctionValue` wrapper, dropping the function name,
and `ValueUnit.clone()` does NOT preserve the stamp (it is invisible to
value.js). kf re-stamps on every clone (`utils.ts:294-298`). This is writing
state onto a class it does not own (viol18).

**No value.js `parseCSSSubValue` API exists at 0.13.0.** Verified: `grep -n
"parseCSSSubValue\|parseCSSValueOrArgs" /Users/mkbabb/Programming/value.js/src/index.ts`
returns zero hits. The function is unpublished.

### §2.9 — §9 CSS Nesting THROWS (OPEN — HARD CRASH P0)

`parseCSSStylesheet(".a{color:red; & .b{color:blue}}")` THROWS
`Parse error at offset N`. VERIFIED via the L.W10 spike live-probe
(`W10-css-parity-spike.md §1 row 1`): *"value.js THROWS `Parse error at offset 17`
(the `&`). NOT a silent drop."*

Source: `stylesheet.ts:501` — `any(atRule, styleRule)` has NO `nestedRule` arm;
`stylesheet.ts:503-510` — the full-consume check fails at the `&`, aborting the
WHOLE parse.

**This is HIGH-severity P0.** Any kf consumer feeding a stylesheet containing
CSS Nesting (Baseline-2023) to `fromStyleSheets`/`adoptRunning` gets a hard
parse error. No kf workaround is possible (a THROW cannot be survived at the
consume seam without re-implementing value.js's grammar —
`inv-L-acyclic-purity` forbids it).

### §2.10 — §10 parseTransitionShorthand / reverseTransitionShorthand (OPEN)

`grep -n "reverseTransition\|parseTransition\|transitionShorthand"
/Users/mkbabb/Programming/value.js/src/` returns ZERO hits. value.js ships
`parseAnimationShorthand`/`reverseAnimationShorthand` at
`src/parsing/animation-shorthand.ts:201/219` (kf consumes
`reverseAnimationShorthand` at `format.ts:268`), but the `transition` twin
does not exist.

**kf effect:** `format.ts`/`compile.ts` can round-trip `animation` faithfully
but has no inverse to call for `transition` — the transition longhand⇄shorthand
leg is structurally absent.

### §2.11 — §11 animation-play-state (OPEN)

`CSSAnimationOptions` at `src/parsing/extract.ts:16-25` has NO `playState`
field. The `extractAnimationOptions` function does not read
`animation-play-state` from the shorthand. The L.W1 S5 split recorded this
dispatch-blocked state: *"0.13.0 `extract.d.ts:8-17` carries NO `playState`"*.
The L dispatch (`KF-TO-VALUEJS-O-ASKS.md §11`) asks value.js to surface it.

### §2.12 — §12 invalid-keyframe-decl DIAGNOSTIC (OPEN)

value.js spec-correctly DROPS keyframe-level `!important` at the AST level (the
L.W1 correction — `FINAL.md §S1`). But it emits NO diagnostic when it does so.
The kf `onParseError` sink (`adapter.ts:173`) receives nothing from this drop.
The O ask is to surface a `ParseDiagnostic` row naming the dropped declaration +
the spec reason, while STILL dropping it (spec-correct). kf's L.W6 `validate()`
can project it. Born-inert today.

### §2.13 — §13 structured-gradient crash (OPEN — HARD CRASH P0)

`parseCSSValue("linear-gradient(red, blue)")` → **`TypeError: t is not iterable`**.
VERIFIED via L.W10 spike (`W10-css-parity-spike.md §1 row 8`).

Source: `src/parsing/index.ts:188-205` `linearGradient` — the
`any(fromAngle, direction).skip(comma).opt()` arm has a bug when no direction
is present. With a direction it works: `linear-gradient(90deg, red, blue)`
→ typed `FunctionValue`.

**Radial/conic head is also corrupted (MEDIUM):** `radial-gradient(circle at
center, …)` parses but `.toString()` emits `"radial-gradient(circle, at, center,
…)"` — the head structure is shredded into raw comma-joined idents
(`W10-css-parity-spike.md §1 row 6`). `conic-gradient(from 90deg at center, …)`
silently drops `at center` (`row 7`).

**This is HIGH-severity P0 for bare linear-gradient.** Any kf consumer feeding
`background: linear-gradient(red, blue)` (the most common gradient — Baseline
CSS since forever) to the adapter gets a hard TypeError crash. No kf workaround.

### §2.14 — §14 @mkbabb/value.js/math subpath (OPEN)

value.js's `package.json:25-32` has a single `exports` entry — the root barrel
`"."`. There is no `"./math"` subpath.

As a consequence, `src/animation/internal/leaves.ts:68-79` inlines its own
`lerpArray` implementation — a hand-copy of `value.js/src/math.ts:60-76` —
because importing `lerpArray` from `@mkbabb/value.js` would pull value.js's
CSS-grammar static init into the LIGHT bundle and fail `proof:boundary`. The
comment at `leaves.ts:56-63` records the gap explicitly.

**kf effect:** a duplicated kernel (DRY/spine violation). The inline is
byte-equivalent to value.js's copy so behavior is identical; this is a MEDIUM
severity cleanliness issue, not a crash.

---

## §3 — SUMMARY TABLE: 14 asks, status at 0.13.0

| # | Ask | Status | kf workaround LIVE | Severity |
|---|---|---|---|---|
| §1 | comma-list grammar (multi-value `<X>#`) | OPEN | NONE (silent forward-loss; no band-aid possible) | HIGH |
| §2 | transform axis semantics (rotate≡Z, scale=X+Y) | OPEN | NONE (non-isomorphic expansion; kf can't un-expand) | HIGH |
| §3 | color() replay-equal + var() inside color | OPEN | NONE (THROW on var(); wrapper-drop on color()) | HIGH |
| §4 | @property typed grammar + backward serialize | PARTIAL — serializer EXISTS (L.W1 consumed it); typed syntax widening OPEN | NONE (the O ask is enhancement, not blocker) | MEDIUM |
| §5 | linear()/FunctionValue space-separated serialize | OPEN | **YES** — `utils.ts:193-196` regex normalize (`inv-L-acyclic-purity` violation, born-RED-pending-delete) | HIGH |
| §6 | partial-input HONESTY (full-consume-or-fail) | OPEN | NONE (the onParseError sink is inert) | HIGH |
| §7 | perf VJ.L1–L8 (alloc in color hot paths) | OPEN | NONE (missed-opportunity; bench gate born-RED) | MEDIUM |
| §8 | parseCSSSubValue + FN_NAME + drop parse-that dep | OPEN | **YES** — (1) direct parse-that import `utils.ts:1`; (2) FN_NAME Symbol `utils.ts:45-57` | HIGH |
| §9 | CSS Nesting recursive parse (THROW cure) | OPEN | NONE (THROW un-workable at consume seam) | HIGH (P0) |
| §10 | parseTransitionShorthand/reverseTransitionShorthand | OPEN | NONE (forward parity gap) | MEDIUM |
| §11 | animation-play-state on CSSAnimationOptions | OPEN | NONE (dispatch-blocked) | LOW |
| §12 | invalid-keyframe-decl DIAGNOSTIC | OPEN | NONE (inert sink) | LOW |
| §13 | structured-gradient crash (linear-gradient/radial/conic) | OPEN | NONE (THROW un-workable) | HIGH (P0) |
| §14 | @mkbabb/value.js/math subpath (lerpArray) | OPEN | **YES** — inline `lerpArray` copy in `leaves.ts:68-79` (DRY violation) | MEDIUM |

**5 active kf workarounds (inv-L-acyclic-purity violations):**
1. `utils.ts:1` — direct `@mkbabb/parse-that` import (`package.json:211` dep)
2. `utils.ts:45-57` — `FN_NAME` Symbol stamp onto `ValueUnit`
3. `utils.ts:193-196` — `linear()` regex normalize (the most flagrant: a consumer-side correction of a serializer bug)
4. `leaves.ts:68-79` — inline `lerpArray` copy (DRY; MEDIUM)
5. `adapter.ts:173-186` — `onParseError` sink (born-inert; not a workaround per se, but a pre-authored consume edge that cannot activate)

**2 genuine HARD-CRASHES on Baseline-stable CSS (P0 — kf cannot survive them):**
- CSS Nesting §9: `parseCSSStylesheet` THROWS on `&`-containing input
- bare `linear-gradient` §13: `parseCSSValue` THROWS `t is not iterable`

---

## §4 — M-wave proposals

### M-wave candidate: M.W-VJO-CONSUME (Band B — the value.js O consume wave)

**What it is:** The kf-side consume wave that fires when value.js publishes its
post-N Tranche O cut (proposed 0.14.0). This wave:

1. **Re-pins** `@mkbabb/value.js: "^0.13.0" → "^0.14.0"` in `package.json`.
2. **DELETES** the five active workarounds (born-RED-gated kf-side per L.W9):
   - `utils.ts:1` parse-that import + `package.json:211` dep line (§8)
   - `utils.ts:45-57` FN_NAME Symbol + restamp (`utils.ts:294-298`) (§8)
   - `utils.ts:193-196` linear() regex normalize (§5)
   - `leaves.ts:68-79` inline `lerpArray` → replaced by `import { lerpArray }
     from "@mkbabb/value.js/math"` (§14, requires the `./math` subpath)
3. **ACTIVATES** the inert sink: `adapter.ts:173` `onParseError` goes live when
   value.js's partial-parse emits an honest failure diagnostic (§6).
4. **EXTENDS** the ingest walker (L.W3 recursive group-rule walk) to handle the
   typed recursive `StylesheetItem` value.js O ships for
   `@media`/`@container`/`@layer` — so nested `@keyframes` are found (§9).
5. **GREENS** the born-RED gate arms:
   - `proof:replay-equality` multi-value box-shadow/transition/font-family arm (§1)
   - `proof:replay-equality` transform axis arm (§2)
   - `proof:replay-equality` color()/var()-in-color arm (§3)
   - `proof:replay-equality` transition-shorthand arm (§10/§12)
   - `proof:css-parity` nesting row: assert the THROW is GONE (§9)
   - `proof:css-parity` structured-gradient row: assert bare linear-gradient no longer throws (§13)
   - `proof:boundary` W96 extension: assert NO `@mkbabb/parse-that` import survives in `src/` (§8)
   - `proof:workaround-deletion` S7/S8/S9 arms: regex GONE + Symbol GONE + parse-that dep GONE (§5/§8)
   - budgeted bench arm: oklab densify alloc count DROPS against the 0.13.0 baseline (§7)

**Priority ordering for value.js O:**

- **FIRST (P0 — kf cannot serve Baseline CSS until fixed):** §9 CSS Nesting THROW + §13 bare
  `linear-gradient` THROW. Both crash any kf consumer feeding common CSS to the adapter.
- **SECOND (kf-owned workaround deletions):** §5 linear()/FunctionValue, §8 parse-that dep +
  FN_NAME, §14 math subpath. These are active precept violations.
- **THIRD (correctness, no workaround):** §1 comma-list, §2 transform axis, §3 color()/var(),
  §6 partial-input honesty, §10 transition shorthand, §12 diagnostic.
- **FOURTH (enhancement / perf):** §4 typed @property syntax, §7 perf VJ.L1–L8, §11 playState.

### M-wave candidate: M.W-VJO-GATE-LIVE (born-RED gate maintenance)

The L.W9 apparatus authored the born-RED deletion gates. M must VERIFY each gate
is still born-RED at M's open (not accidentally GREENed by an L implementation
or a tree-state change) and EXTEND the gate roster as needed:

- `proof:workaround-deletion` S7/S8/S9 — the linear-regex / FN_NAME / parse-that-dep
  deletion gates: verify still PENDING (not accidentally deleted or hidden).
- `proof:css-parity` nesting + structured-gradient rows — verify still RED
  (not accidentally suppressed by a try-catch wrapping the adapter parse).
- `proof:boundary` W96 extension — verify the parse-that import is still
  flagged by the gate (test the gate itself against the live `utils.ts:1` import).

---

## §5 — Precept findings (kf tree at L.W9 close)

The following are active `inv-L-acyclic-purity` / NO-WORKAROUND precept violations
in the kf tree, confirmed at the L.W9 close (`tranche-l-dev` tip `4686aa4`):

| Violation | File:line | Precept | Severity |
|---|---|---|---|
| direct `@mkbabb/parse-that` import — composition belongs in value.js | `src/animation/utils.ts:1` + `package.json:211` | inv-L-acyclic-purity / NO-workaround (viol24) | HIGH |
| `FN_NAME` Symbol stamp onto `ValueUnit` — writing state onto a class kf doesn't own; `.clone()` drops it silently | `src/animation/utils.ts:45-57`, `294-298` | inv-L-acyclic-purity / NO-workaround (viol18) | HIGH |
| `linear()` regex normalize — consumer-side correction of a published sibling serializer bug | `src/animation/utils.ts:193-196` | inv-L-acyclic-purity / NO-workaround (viol19/20) | HIGH |
| inline `lerpArray` copy — DRY violation forced by missing `./math` subpath | `src/animation/internal/leaves.ts:68-79` | inv-L-acyclic-purity spirit / DRY (viol34) | MEDIUM |
| inert `onParseError` sink — authored but never activated (value.js partial parses silently succeed) | `src/animation/adapter.ts:173-186` | inv-L-acyclic-purity (§6) | LOW (pre-authored consume edge, not a live patch) |

All five are L.W9 Band-B items: each carries a named tripwire (the value.js O publish)
and a born-RED deletion gate. They are NOT kf implementation bugs — they are correctness
gaps at the value.js seam that kf cannot fix without violating the spine law.

---

## §6 — Deferred folds for M

| Item | Owner | Tripwire | M action |
|---|---|---|---|
| DL-L8 FB-3 MorphSVG (`fromMorphSVG`/`getPointAtLength`) — absent in 0.13.0; the full arc-length sampler is value.js VJ.W4 | value.js O | value.js O (0.14.0) ships VJ.W4 remainder | `proof:morphsvg-consume` arm born-RED; kf ships `fromMorphSVG` on the publish |
| DL-L10 constellation workarounds (FN_NAME, linear-regex, parse-that-dep) — all 3 PENDING at L close | value.js O | value.js O VJ-L1/VJ-L2/VJ-L3 publish | M.W-VJO-CONSUME deletes all 3 in one commit with the re-pin |
| DL-L11 true-CSS-parity frontier (CSS Nesting/gradients/recursive at-rules) — spike LANDED, IMPL gated on value.js O + parse-that | value.js O + parse-that PT-WAVE-6 | coordinated publish | `proof:css-parity` nesting + gradient rows; M.W-VJO-CONSUME extends ingest walker for typed recursive tree |
| DL-L9 PT-2 parse-that packrat soundness — value.js consumes parse-that; kf re-pins on the cascade | parse-that PT-WAVE-6 → value.js → kf | parse-that PT-WAVE-6 ships `(id,offset)` rekey | `proof:packrat-sound` gate-first; greens on the cascade re-pin |

All four are HANDOFF items in L's `FINAL.md §The deferred fold` — carried
with their named tripwires and born-RED gates from L. M owns the consume-edge
execution; the sibling delivery is owned by value.js and parse-that respectively.

---

## §7 — Cross-repo asks (the kf outbound dispatch)

The 12 open asks (§1–§13 above, excluding the PARTIAL §4) are the kf outbound
dispatch to value.js, recorded in `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`.

**For M, the cross-repo coordination owns:**

1. **P0 crash fixes FIRST:** value.js O must fix the CSS Nesting THROW (§9) and
   the bare `linear-gradient` crash (§13) before kf M can close the css-parity gate.
2. **Workaround-deletion tripwires:** value.js O must publish
   `parseCSSSubValue`/`parseCSSValueOrArgs` (§8 VJ-L3) + fix
   `FunctionValue.toString()` for space-separated functions (§5 VJ-L2) + expose
   a typed fn-name field on `ValueUnit` (§8 VJ-L1) before the three kf
   workarounds can be deleted.
3. **The `./math` subpath** (§14 W-MATH-SUBPATH) is required before kf can delete
   its inline `lerpArray` copy and remain `proof:boundary`-green.
4. **The acyclic spine holds.** kf does NOT write value.js's tree. The wave
   numbering and 0.14.0 cut are value.js's to ship; kf's M role is the consume
   side only (`^0.13.0 → ^0.14.0`), never a `file:` link or vendored grammar.

**No value.js Tranche O spec exists yet** (2026-06-17). `docs/tranches/O/` is
absent in the value.js tree. The dispatch doc
(`docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md`) IS the authoritative kf outbound
ask set; value.js's own tranche-O wave-numbering is value.js's to assign.

---

## §8 — Performance numbers

No kf-side benchmark covers the value.js color-math alloc claims at 0.13.0
(⚠34 / W122 in L audit — *"NO bench covers the SOTA value.js color-math alloc
claims"*). The budgeted bench gate is born-RED (authored in L.W7 Band-A as a
gate shell, waiting for the alloc-drop to land):

- `transformMat3`: returns a `[number, number, number]` tuple per call —
  every oklab/oklch conversion path allocates one Vec3 (`matrix.ts:19-26`)
- `oklab2xyz`: allocates 2 intermediate Vec3 per call (`oklab.ts:45-48`)
- `mixColors`: allocates `resultComponents: number[]` + `keys().filter()` per
  call (`dispatch.ts:424-432`)

The `lerpArray` benchmark (value.js `bench/numeric-soa.mjs`) DOES exist on the
value.js side and documents the crossover at K≥2 (1.56× at K=2, 4.25× at K=64
— `value.js/src/math.ts:47-59`). kf's `lerpArray` consume (the `NumericAnimation`
SoA path, `frame-compiler.ts`) already benefits from the value.js bench's
documented gains. The gap is the COLOR-path alloc claim, which has NO
corresponding bench gate either kf-side or value.js-side at 0.13.0.

**M must author the bench taxonomy before asserting the alloc-drop claim:**
`proof:zero-alloc` extension (L.W7 S2) — a kf-side bench measuring per-stop
`sampleColorRamp` alloc count at 0.13.0 as a baseline, then asserting it DROPS
at the 0.14.0 consume. MEASURE-FIRST is value.js-side; the baseline measurement
is kf-side.
