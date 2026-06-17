# Lane 02 — L.W2 Compiler Completeness Audit

**Tranche:** M (development only — no implementation)
**Subject:** L.W2 as-shipped (commit `4863446`): multi-color per-key densify,
scroll-grammar emit, static-weight pre-multiply, `reverseMs`→`reverseCSSTime` unify.
**Date:** 2026-06-17
**Branch at audit:** `tranche-l-dev` (tip `529fcfd`)
**Method:** source read + gate execution + live value.js probes against
`node_modules/@mkbabb/value.js/dist/value.js` (0.13.0). All claims cite
file:line or a re-runnable command; no claim is a re-assertion of L-phase intent.

---

## §0 — VERDICT (the honest headline)

All four L.W2 S-clauses LANDED and gate-verified GREEN (`node
scripts/proof-compile-replay.mjs` → exit 0; all 11 clauses ✓). The compile
surface is materially more faithful than the pre-L 4.3.0 state. However, the
audit finds one NEW residual bug in the as-shipped code — the oklch densify
emit path — and two deferred Band-B cross-repo gaps (color() asymmetry, the
transition-shorthand mirror) that M must either consume or carry forward with
honest tripwires. One PRECEPT VIOLATION is recorded.

---

## §1 — VERIFICATION OF EACH S-CLAUSE

### S1 — CC-6: scroll-grammar emit

**Verdict: SHIPPED and GATED.**

`compile.ts:53` imports `reverseCSSTime` from `@mkbabb/value.js` (S4 also done
here). `compile.ts:65` imports `serializeScrollOptions` from `./scroll-grammar`.
`compile.ts:460-471` defines `scrollLonghands()` — reads
`animation.scrollOptions` (cast, since it lives on `CSSKeyframesAnimation` not
on the base `Animation` type) and calls `serializeScrollOptions(opts)`, appending
each returned longhand as `\n  ${prop}: ${value};`.

`compile.ts:443-445` calls `scrollLonghands(animation)` and appends the result
to the `.class` rule body, alongside `animation-composition` and the stagger
`animation-delay`. The pattern is architecturally correct: longhands are NOT
folded into the `animation` shorthand (not a shorthand sub-property per CSS
Animations L2).

`engine.ts:1287-1305` defines `scrollOptions?: CSSTimelineOptions` on
`CSSKeyframesAnimation`, populated via `recoverScrollOptions` from
`engine-css-metadata.ts:89-93` — a thin wrapper over `extractTimelineOptions`
that returns `undefined` (not `{}`) when no scroll grammar is present
(honoring `exactOptionalPropertyTypes`).

**Gate clause `scroll-compile-emit` BITES:** requires
`/animation-timeline|serializeScrollOptions|scrollOptions/` in `compile.ts` →
satisfied at all three sites. The fixture arm D (`test/fixtures/compile/scroll-driven.css`
— `animation-timeline: view(); animation-range: entry 0% cover 40%`) exercises
the full ingest→compile round-trip via `test/compile-roundtrip.test.ts:491-512`.
17 tests pass including the scroll arm (`npx vitest run
test/compile-roundtrip.test.ts` → 17 passed).

**Evidence anchors:**
- `src/animation/compile.ts:53,65,443-445,460-471`
- `src/animation/engine.ts:1280-1305`
- `src/animation/engine-css-metadata.ts:89-93`
- `src/animation/scroll-grammar.ts:116-123`
- `test/fixtures/compile/scroll-driven.css`
- `test/compile-roundtrip.test.ts:491-512`

---

### S2 — CC-3.5: multi-color honest densify (Option A)

**Verdict: SHIPPED and GATED. Option A (per-key densify) implemented.**

`compile-color.ts:161-214` defines `densifyKey()` — densifies ONE changing
color key independently, returning `{ cssProp, stops, worstDelta }`. The loop
iterates segment pairs of `animation.templateFrames` and calls
`sampleColorRamp(fromColor, toColor_, stopCount, { space, ...hueOpt })` per
pair.

`compile-color.ts:248-318` defines `densifyColorBlock()`. The former silent
early-out (`if (colorKeys.length > 1) return null;` — the L.W2 breach) is
REPLACED by a loop over `colorKeys` (line 291: `for (const key of colorKeys)`)
that calls `densifyKey()` per key, accumulates `worstDelta = Math.max(...)` over
all keys, and merges the per-key stop sets by percentage into a `Map<number,
string[]>`. The block is REFUSED when `worstDelta > epsilon`; ships only if
EVERY key holds under ΔE-ε.

**Gate clause `multi-color-honest` BITES:** requires `for (const \w+ of
colorKeys\b)` in `compile-color.ts` → satisfied at line 291. The anti-vacuous
absence check (`colorKeys.length > 1 ) return null;`) NO LONGER matches — the
early-out is gone. The fixture `test/fixtures/compile/multi-color-scroll.css`
exercises two simultaneously-changing color tracks (`color: rgb(255 0 0)`→`rgb(0
0 255)`, `background-color: rgb(0 255 0)`→`rgb(255 0 255)`) — endpoints chosen
to maximize sRGB-vs-oklab divergence. The vitest arms assert: tight ε →
`eligible:false` (refuses); default ε → densified `oklab()` stops present OR
refused (never the silent verbatim sRGB ship).

**Evidence anchors:**
- `src/animation/compile-color.ts:161-214,248-318`
- `test/fixtures/compile/multi-color-scroll.css`
- `test/compile-roundtrip.test.ts:424-486`

---

### S3 — CC-5: static-weight pre-multiply

**Verdict: SHIPPED and GATED.**

`compile.ts:196-217` (`walkGroup`) now partitions:
- `springWeighted = blend === "weighted" && entry.layer.weightSpring != null` →
  the live crossfade case (no static CSS twin → refusal via `weighted: true`).
- `staticWeighted = blend === "weighted" && entry.layer.weightSpring == null` →
  the constant-scalar case (pre-multiply into `accumulate`).
- `composition: CompositeOperator = ... staticWeighted ? "accumulate" : "replace"`.

`CompileChild` gains `staticWeight?: number` at `compile.ts:169-172`.

`compile.ts:371-389` (inside `compileChild`): when `child.staticWeight != null`,
calls `premultipliedKeyframesBlock(animation, name, child.staticWeight)` from
`format.ts:298-351`. This function clones each `ValueArray` leaf and scales
numeric values by `weight`; returns `{ refused: true, key }` for non-numeric
(color/string) leaves. The block is the `@keyframes` body with pre-multiplied
values. Non-numeric leaves in a static-weight animation still refuse with
`"weighted-blend"`.

`format.ts:298-351` defines `premultipliedKeyframesBlock` — CLONE-only (iterates
cloned `ValueArray`, never touches `parsedVars` in place). This honors the
read-only-over-animation invariant.

**Gate clause `static-weight-compile` BITES:** requires
`/springWeighted|staticWeighted|staticWeight/` in `compile.ts` → all three
appear (lines 202, 204, 171, 213). The vitest arm
(`test/compile-roundtrip.test.ts:516-547`) asserts a `weight:0.5` numeric layer
compiles with `animation-composition: accumulate` and pre-multiplied values
(`translateY(20px)` from `40px × 0.5`), eligible:true, no refusals.

**Evidence anchors:**
- `src/animation/compile.ts:171-172,196-217,371-389`
- `src/animation/format.ts:298-351`
- `test/compile-roundtrip.test.ts:516-547`

---

### S4 — Time-serialization unify

**Verdict: SHIPPED and GATED.**

`compile.ts:53` imports `reverseCSSTime` from `@mkbabb/value.js`. The private
`const reverseMs` definition is ABSENT from `compile.ts` (grep confirms zero
matches). Line 431 uses `reverseCSSTime(child.delay)` for the stagger/sequence
delay emit.

`format.ts:5` also imports `reverseCSSTime`; `format.ts:178,190` use it for
duration and delay in `animationShorthand`. The two sites are now unified on
the same value.js inverse serializer.

Live probe: `reverseCSSTime(1000)` → `"1000ms"` (NOT `"1s"` — the old
`reverseMs` behavior). `reverseCSSTime(2000)` → `"2000ms"`. The canonical form
is always milliseconds.

**Gate clause `no-reverseMs` BITES:** asserts `\bconst\s+reverseMs\b` is ABSENT
→ confirmed absent. The delay emit at `compile.ts:431` uses `reverseCSSTime`.

**Evidence anchors:**
- `src/animation/compile.ts:53,431` (no `reverseMs`)
- `src/animation/format.ts:5,178,190`
- `node -e "require('/Users/mkbabb/Programming/value.js/dist/value.js').reverseCSSTime(1000)"` → `"1000ms"`

---

## §2 — RESIDUAL GAP FOUND: oklch densify emits oklab() CSS

**Severity: HIGH (compile fidelity breach, not gated)**
**Status: NEW finding — NOT present in L.W2 spec, NOT in deferred-ledger-L.md**

### The bug

`compile-color.ts:161-214` (`densifyKey`) accepts a `space: "oklab" | "oklch"`
parameter and passes it to `sampleColorRamp()` at lines 185/197, so the COLOR
MATH is computed in the correct space. However, line 191:

```ts
stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) });
```

calls `colorToOklabCSS()` REGARDLESS of `space`. There is NO
`colorToOklchCSS()` function anywhere in `compile-color.ts`. When a user sets
`colorSpace: "oklch"` on their animation, `densifyColorBlock` at line 274-275:

```ts
const space = (
    animation.options.colorSpace === "oklch" ? "oklch" : "oklab"
) as "oklab" | "oklch";
```

correctly selects `"oklch"`, passes it to `densifyKey`, and `densifyKey`
correctly samples the ramp in oklch space — but then silently emits the samples
as `oklab()` CSS, losing the hue-interpolation semantics. The browser's
piecewise-linear `oklab()` lerp between those emitted stops does NOT match the
oklch-space curve kf's JS playback used.

### Consequences

1. A user who sets `colorSpace: "oklch"` on their animation and calls
   `compileToCSS` receives an artifact whose color interpolation is NOT
   semantically equivalent to the JS playback — the densify is ostensibly
   perceptually-accurate (the stops are computed on the oklch ramp) but the
   EMITTED CSS space is wrong. The ΔE proof measures the BROWSER-vs-kf drift
   on the EMITTED stops — since the emitted stops are oklab, the midpoint
   comparison uses `channelMidpoint` (an oklab channel average), which is NOT
   the correct model for a browser interpolating oklab-encoded oklch points.

2. The gate does NOT catch this: `proof:compile-replay`'s `densify-delta-proof`
   clause only locks the ΔE-ε arm; the test suite
   (`test/compile-roundtrip.test.ts`) only tests `colorSpace: "oklab"` (the
   default). There is no test with `colorSpace: "oklch"`.

3. The `hueMethod` option (for oklch chroma interpolation: `"shorter"`,
   `"longer"`, etc.) is also lost in the emit — it affects the oklch ramp path
   but the emitted `oklab()` stops would bake in the wrong hue trajectory.

### Cure (M-wave candidate)

Add `colorToOklchCSS(c: Color): string` in `compile-color.ts` using the
internal oklch representation from `color2(c, "oklch")` plus the `COLOR_SPACE_RANGES.oklch`
denormalization (C is [0, 0.5], H is [0, 360] in CSS oklch). Then in `densifyKey`,
dispatch:

```ts
const toCSSColor = space === "oklch" ? colorToOklchCSS : colorToOklabCSS;
// ...
stops.push({ pct: round(pct), css: toCSSColor(ramp[s]!) });
```

The ΔE proof also needs fixing for the oklch case: `channelMidpoint` is an oklab
channel average (correct for oklab CSS emit); for oklch CSS emit the browser
interpolates oklch channels (L, C, H) piecewise-linearly, so the midpoint is an
oklch channel average (not an oklab channel average). The `channelMidpoint`
function at `compile-color.ts:108-112` is oklab-hardcoded.

**Born-RED gate:** a fixture with `colorSpace: "oklch"` + `compileToCSS` →
asserts emitted CSS contains `oklch(` (not `oklab(`). Today: emits `oklab()`.
After cure: emits `oklch()`.

**Evidence anchors:**
- `src/animation/compile-color.ts:76-80` (`colorToOklabCSS` — no oklch twin)
- `src/animation/compile-color.ts:165,185,191,197` (space param used for ramp, ignored for emit)
- `src/animation/compile-color.ts:108-112` (`channelMidpoint` — oklab-hardcoded)
- `src/animation/compile-color.ts:273-275` (space selector at densifyColorBlock call site)
- `test/compile-roundtrip.test.ts` — zero tests with `colorSpace: "oklch"`
- Live probe: `grep -n "colorToOklchCSS" src/animation/compile-color.ts` → zero hits

---

## §2b — ADDITIONAL RESIDUAL GAP: mixed animation non-color property drop

**Severity: HIGH (silent correctness failure on the common mixed-animation case)**
**Status: NEW finding — NOT in L.W2 spec, NOT in deferred-ledger-L.md**

### The bug

`densifyColorBlock` at `compile-color.ts:309-316` builds a `@keyframes` block whose
stops contain ONLY color declarations:

```ts
body += `${pct}% {\n  ${decls.join("\n  ")}\n}\n`;
```

`decls` is populated exclusively from `traced.cssProp: css` pairs (the densified color
declarations). No non-color properties (`opacity`, `transform`, `filter`, etc.) are
included.

In `compileChild` at `compile.ts:395-399`:

```ts
const block =
    staticBlock ??
    (densify && "block" in densify
        ? densify.block
        : keyframesBlock(animation, name));
```

When `densify.block` is chosen, it REPLACES `keyframesBlock(animation, name)`. The
`keyframesBlock` function at `format.ts:240-266` is the correct projection authority
— it projects ALL declared template properties via `declaredKeyframeBody` (which
calls `unflattenObjectToString` over the full `parsedVars[i]` map). By skipping it,
the densified path silently drops every non-color property.

### Example

Animation with `background-color: red → blue` + `opacity: 0 → 1`:
- Compiled output `@keyframes` block: contains only `background-color: oklab(…)` stops.
- `opacity` is silently absent.
- The browser replays the compiled CSS with correct color but static opacity.
- `eligible: true` — consumer has no signal of the loss.

No test in `compile-roundtrip.test.ts` exercises a color + non-color mixed animation
through the densify path. All existing color tests are color-only animations
(`{ 0% { background-color: rgb(…) } }`).

### Cure (M-wave candidate)

The densify should AUGMENT the declared template stop bodies, not replace them.
Architectural integration path:

1. `densifyColorBlock` returns per-stop color declarations as a `Map<number, Map<string, string>>`
   (pct → cssProp → css), not a complete block.
2. `keyframesBlock` (or a new `keyframesBlockWithColorOverride`) merges: for each
   template stop, use `declaredKeyframeBody` as the base, then overlay the densified
   color declarations for that stop's closest percentage match.
3. The current `DensifyResult = { block: string } | { refused: true; delta: number } | null`
   shape changes: the `block` form is replaced by `{ stops: Map<number, Map<string, string>> }`.

**Born-RED gate:** a fixture with `background-color` + `opacity` both changing through
`compileToCSS` asserts the emitted `@keyframes` block contains BOTH `oklab(` stops
(densified color) AND `opacity:` declarations. Today: `opacity:` is absent → gate RED.
After cure: both present → GREEN.

**Evidence anchors:**
- `src/animation/compile-color.ts:309-316` (color-only stop building)
- `src/animation/compile.ts:395-399` (densify.block replaces keyframesBlock)
- `src/animation/format.ts:240-266` (keyframesBlock — the full projection authority bypassed)
- `test/compile-roundtrip.test.ts` — zero tests with color + non-color mixed animation

---

## §3 — DEFERRED CROSS-REPO GAPS

### Gap A — color() CSS function round-trip asymmetry (DLL-26(d), value.js-O)

The value.js `color()` function parser (`color.ts:494-542`) parses
`color(srgb 0.5 0.3 0.7)` to an internal `RGBColor` object. Its `toString()`
emits `rgb(127.5 76.5 178.5)` — the `color(` wrapper is DROPPED.

Live probe: `parseCSSValue("color(srgb 0.5 0.3 0.7)").toString()` →
`"rgb(127.5 76.5 178.5)"` (confirmed against value.js 0.13.0 dist).

The kf compile path (`densifyColorBlock`) processes CSS colors. If a user authors
a keyframe with `color(display-p3 0.5 0.3 0.7)`, the compile path receives the
parsed form and calls `toColor()` → `normalizeColorUnit()`, then
`colorToOklabCSS()` which calls `color2(c, "oklab")`. The ROUND-TRIP breaks: the
re-emitted CSS will be `oklab(…)` not `color(display-p3 …)`, so a consumer who
pastes the compiled artifact back in does not see the original color space.
Separately, `color()` with a `var()` inside (`color(srgb var(--r) 0.3 0.7)`)
throws in value.js (documented in `KF-TO-VALUEJS-O-ASKS.md §3`).

This is an upstream value.js defect. The kf compile path cannot faithfully round-
trip `color()` syntax until value.js-O fixes the wrapper-drop. No kf band-aid is
available (the information is lost at ingest). This is already DLL-26(d) in the
deferred ledger, with tripwire value.js-O 0.14.0.

**M action:** carry forward as Band-B-gated, consume on value.js-O publish. Add
a `proof:replay-equality` fixture with `color(srgb …)` that REDs today (the
emitted CSS lacks the wrapper) and GREENs on the upstream fix + re-pin.

**Evidence anchors:**
- `/Users/mkbabb/Programming/value.js/src/parsing/color.ts:494,526-542` (colorFunction parse path)
- `node -e "require('/Users/mkbabb/Programming/value.js/dist/value.js').parseCSSValue('color(srgb 0.5 0.3 0.7)').toString()"` → `"rgb(127.5 76.5 178.5)"`
- `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md:§3`
- `docs/tranches/L/audit/deferred-ledger-L.md:DLL-26`

### Gap B — `transition` shorthand mirror absent (DLL-49, value.js-O)

`format.ts:4` imports `reverseAnimationShorthand` from value.js (line 268 in
`animationShorthand()`). There is NO `reverseTransitionShorthand` equivalent in
value.js 0.13.0:

Live probe: `grep "(parse|reverse)TransitionShorthand"
node_modules/@mkbabb/value.js/dist/value.js` → ZERO hits (confirmed).

A stylesheet with a `transition` property (e.g.
`.box { transition: opacity 300ms ease-in-out; }`) cannot be round-tripped
via `compileToCSS` because the compiler has no inverse serializer for
`transition` longhands. The ingest path (`ingest.ts`) may capture `transition`
declarations; the compile path emits only `animation` shorthand. This is a
forward-parity gap: `animation` ↔ `reverseAnimationShorthand` exists; `transition`
↔ `?` is absent.

This is already DLL-49 in the deferred ledger. The fix requires value.js-O to
ship `parseTransitionShorthand` / `reverseTransitionShorthand`, mirroring the
shipped animation pair (`parsing/animation-shorthand.ts`). The kf consume would
add it to `format.ts:4` import and a `transitionShorthand()` emit beside
`animationShorthand()`.

**M action:** carry DLL-49 forward as Band-B-gated with existing tripwire.
Consider adding a `proof:replay-equality` `transition`-shorthand fixture that
REDs today and GREENs when the pair publishes.

**Evidence anchors:**
- `src/animation/format.ts:4,268` (`reverseAnimationShorthand` consume — no transition mirror)
- `grep "(parse|reverse)TransitionShorthand" node_modules/@mkbabb/value.js/dist/value.js` → 0
- `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md:§12`
- `docs/tranches/L/audit/deferred-ledger-L.md:DLL-49`

---

## §4 — PRECEPT VIOLATIONS

### VIOLATION — oklch densify emit mismatch (compile-color.ts:191, the as-shipped bug)

**Precept violated:** NO quick solutions / GESTALT — the compile surface claims
`colorSpace: "oklch"` is supported, but the densify emit path silently converts
oklch-space samples to `oklab()` CSS. This is a sin of silent commission: the
API accepts the option, no error, but the emitted CSS uses the wrong space. The
correct gestalt is: if you accept the option, honor it end-to-end through the
CSS emit.

**Classification:** NOT a workaround (there is no workaround — this is an
implementation oversight in the oklch→CSS step). It is a genuine residual bug.
The precept violation is that it was shipped without a gate covering the oklch
emit path, allowing the oversight to go undetected.

**File:line:** `src/animation/compile-color.ts:191` — `colorToOklabCSS(ramp[s]!)`
called regardless of `space`.

---

## §5 — GATE APPARATUS ASSESSMENT

### Current gate coverage

`proof:compile-replay` (11 clauses, all GREEN on today's tree):
- Structural: compiler-exists, parser-run-backward, four-refusals-named, heavy-boundary
- Behavioral: replay-equality, densify-delta-proof, no-source-edit
- L.W2 additions: multi-color-honest, scroll-compile-emit, static-weight-compile, no-reverseMs

`test/compile-roundtrip.test.ts` — 17 tests, all pass.

### Gap: oklch densify not gated

The `densify-delta-proof` clause in `proof:compile-replay` bites only on the ΔE
assertion lock (the `dE(...).toBeLessThan(DEFAULT_DELTA_E_EPSILON)` pattern). It
does NOT assert WHICH CSS space the emitted stops use. A test with
`colorSpace: "oklch"` that asserts `out.css.includes("oklch(")` (not `"oklab("`)
would catch the bug; it does not exist.

The `test/compile-roundtrip.test.ts` densify tests use `colorSpace: "oklab"` (the
default) throughout. The oklch path is untested.

### M gate additions needed

1. A `proof:compile-replay` clause `oklch-densify-emits-oklch` that REDs today
   (the `space === "oklch"` emit still uses `colorToOklabCSS`) and GREENs only
   when `colorToOklchCSS` is added and dispatched.

2. A `test/compile-roundtrip.test.ts` test: an animation with `colorSpace: "oklch"`
   compiled through `compileToCSS` asserts the emitted `@keyframes` block
   contains `oklch(` and not `oklab(`.

---

## §6 — M-WAVE PROPOSALS

### M-wave candidate: CC-7 oklch densify CSS emit (kf-internal, Band A)

**Rationale:** The oklch emit gap is a pure kf-internal fix — no sibling
dependency, no new value.js API required. `color2(c, "oklch")` is already
available in value.js 0.13.0 (confirmed live). The fix is a small function
`colorToOklchCSS` + a dispatch in `densifyKey`'s stop-push loop + a
`channelMidpoint` variant for oklch CSS space. The `COLOR_SPACE_RANGES.oklch`
channel ranges are already imported. This is the correct architectural
completion of the oklch path that L.W2 initiated.

**Scope:**
- Add `colorToOklchCSS(c: Color): string` using `color2(c, "oklch")` +
  denormalization via `COLOR_SPACE_RANGES.oklch` (c in [0, 0.5], h in [0, 360]).
- Add `channelMidpointOklch(c1: Color, c2: Color): Color` for the oklch-space
  ΔE proof midpoint (the browser interpolates `oklch()` stops by channel-linear
  oklch lerp, not oklab).
- Dispatch in `densifyKey`: `const toCSSColor = space === "oklch" ? colorToOklchCSS : colorToOklabCSS;`
  at line 191; similarly dispatch the midpoint function at line 200.
- Born-RED gate: a fixture with `colorSpace: "oklch"` compiled through
  `compileToCSS` asserts `oklch(` in emitted CSS. Today: emits `oklab(` → RED.
  After cure: emits `oklch(` → GREEN.

**Precept alignment:** This is the idiomatic gestalt completion — the code
already accepts the option, samples correctly, but drops the space on emit. One
dispatch function pointer closes the gap without architectural change.

**Dep:** value.js 0.13.0 (currently pinned `^0.13.0`). No new sibling gate.

### M-wave candidate: CC-7b densify architecture — non-color property merge (kf-internal, Band A)

**Rationale:** The mixed animation non-color property drop (§2b) is a HIGH-severity
silent correctness failure requiring an architectural change to `densifyColorBlock`'s
output type. The current `DensifyResult = { block: string }` shape bypasses the
established `keyframesBlock` projection authority. The gestalt fix: `densifyColorBlock`
becomes a per-stop color OVERRIDE map, not a block builder. `keyframesBlock` (or a
variant) merges them with the full declared template.

**Scope:**
- Change `DensifyResult`'s success case to `{ stops: Map<number, Map<string, string>> }`.
- In `compileChild`, pass the color-override map to `keyframesBlock` via a `bodyOverride`
  arg that already exists at `format.ts:240-266` (the `bodyByStop?: ReadonlyMap<number, string>`
  parameter — augment it to accept per-stop property additions).
- Born-RED gate: mixed color + opacity animation through `compileToCSS` asserts both
  `oklab(` and `opacity:` in the emitted block.

**Dep:** kf-internal. No new value.js API.

### M-wave candidate: CC-8 transition-shorthand emit (Band B, gated on value.js-O)

**Rationale:** The `animation` shorthand has a faithful inverse in value.js
(`reverseAnimationShorthand`); `transition` has none. A user authoring
`transition` longhands in their keyframe source cannot compile them back to CSS
via `compileToCSS`. DLL-49 carries this as a Band-B-gated consume-edge. M's role
is to add the kf-side consume wiring (one new import + one new emit path in
`format.ts`/`compile.ts`) ONCE value.js-O publishes
`parseTransitionShorthand`/`reverseTransitionShorthand`.

**Action:** Add a born-RED `proof:replay-equality` fixture with a
`transition: opacity 300ms ease-in-out` property that REDs today (no inverse
serializer) and GREENs on value.js-O + re-pin. This fires the DLL-49 tripwire
into a gate rather than a prose comment.

---

## §7 — DEFERRED FOLD CANDIDATES

| Item | Disposition | Tripwire |
|---|---|---|
| oklch densify emit gap (§2) | FOLD-in-M Band A — kf-internal fix, no sibling dep | born-RED gate asserting `oklch(` in emitted CSS |
| mixed animation non-color prop drop (§2b) | FOLD-in-M Band A — densify architecture fix | born-RED gate asserting non-color props present in densified block |
| color() wrapper-drop (§3 Gap A) | Band-B-gated consume (DLL-26(d)) | value.js-O 0.14.0 publishes `color()` replay-equal serializer |
| transition-shorthand mirror (§3 Gap B) | Band-B-gated consume (DLL-49) | value.js-O publishes `parseTransitionShorthand`/`reverseTransitionShorthand` |

---

## §8 — CROSS-REPO ASKS

### value.js-O (0.14.0) asks born from this audit

1. **color() round-trip fidelity (DLL-26(d)):** `colorFunction` serializer must
   preserve the `color(srgb …)` wrapper. Live proof of breakage at
   `value.js/dist/value.js` 0.13.0: `parseCSSValue("color(srgb 0.5 0.3 0.7)").toString()` →
   `"rgb(127.5 76.5 178.5)"` (wrapper lost). Filed in
   `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md §3`.

2. **`parseTransitionShorthand`/`reverseTransitionShorthand` (DLL-49):**
   Mirror the shipped `reverseAnimationShorthand` pattern for the `transition`
   property. Filed in `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md §12`.

No parse-that asks from this lane.

---

## §9 — PERF

No new performance findings from this lane. The densify path (`densifyKey`)
calls `sampleColorRamp` twice per segment per key: once for the stop ramp (N
stops) and once for the ΔE proof reference ramp (1024 stops). The 1024-stop
call at `compile-color.ts:196-199` is called in a per-stop inner loop — `N-1`
times per segment. This is `O(N × 1024)` color conversions per segment per
key, which is acceptable for a compile-time-only path but could be reduced by
sampling the 1024-stop reference ramp once outside the inner loop (it is
independent of `s`). A minor cleanup opportunity, not a blocking perf issue.

**Evidence anchor:** `src/animation/compile-color.ts:193-202` (the inner-loop
double-sample).

---

## Summary Table

| Finding | Severity | Status | M action |
|---|---|---|---|
| S1 scroll-grammar emit | — | SHIPPED + GATED | none |
| S2 multi-color honest densify | — | SHIPPED + GATED | none |
| S3 static-weight pre-multiply | — | SHIPPED + GATED | none |
| S4 reverseCSSTime unify | — | SHIPPED + GATED | none |
| oklch densify emits oklab() CSS (§2) | HIGH | RESIDUAL BUG, ungated | M Band-A wave CC-7, born-RED gate |
| mixed animation: non-color props dropped (§2b) | HIGH | RESIDUAL BUG, ungated | M Band-A wave CC-7 (or companion), born-RED gate |
| color() wrapper-drop (§3 Gap A) | MED | Band-B-gated (DLL-26(d)) | carry DLL-49, add born-RED fixture |
| transition shorthand mirror absent (§3 Gap B) | MED | Band-B-gated (DLL-49) | carry DLL-49, add born-RED fixture |
| densifyKey inner-loop double-sample (§9) | LOW | cosmetic perf | note only |
