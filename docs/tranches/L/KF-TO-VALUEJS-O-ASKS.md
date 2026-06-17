# KF-TO-VALUEJS-O-ASKS — the kf-side OUTBOUND dispatch to value.js Tranche O (the post-0.13.0 grammar + perf + seam totality)

**Provenance:** authored 2026-06-16 by the kf Tranche-L Band-B CONSTELLATION lane
(`L.md §The two bands` → "Band B — CONSTELLATION coordination (gated on sibling
publishes) … **value.js is Tranche N (0.13.0) heading to O**"). This is the **OUTBOUND**
ask — the kf-side spec value.js's **Tranche O** consumes, the successor to the K-era
`docs/tranches/K/KF-TO-VALUEJS-GRAMMAR-ASKS.md` (VJ.W1 scroll grammar + VJ.W2 perceptual
ramp, both LANDED in the 0.13.0 cut as N.W11′/N.W11.D). Where the K dispatch asked for
the **two net-new grammar items that gated K's frontier**, this L dispatch asks for the
**ten totality items the 36-lane L audit found OPEN at 0.13.0** — each one a value.js
defect kf currently WORKS AROUND at the consume seam, in violation of
`inv-L-acyclic-purity` (`L.md §invariant set`: "a defect in a published sibling is fixed
AT THE SIBLING and consumed via re-pin — NEVER corrected at the kf consume seam").

**This doc is the canonical record of every kf→value.js workaround the L audit indicted,
and the value.js cure that DELETES it.** Each ask below names (1) the value.js producer
seam (line-anchored against the `tranche-f-handoff` @ 0.13.0 tree), (2) the kf consume
edge, and (3) the **literal kf workaround the cure retires** — the born-RED deletion gate
that bites on the value.js publish. The whole set is the `L.W9` Band-B value.js leg
(`L.md §wave map`, L.W9 row: "**value.js Tranche O:** comma-list grammar (W74), transform
axis fix (⚠12), color() replay-equal (W71), @property syntax (W73), linear()/FunctionValue
serialize (VJ-L2/⚠23), partial-input honesty (⚠10/13), perf VJ.L1-L8 (W78-85),
parseCSSSubValue to **drop kf's direct parse-that dep** (W94)").

**The acyclic-spine law (charter-binding — `L.md §invariant set`).** value.js ships
VALUES (grammar, parse/serialize, color science, interp kernels); kf consumes ONE tranche
behind, born-RED-gated kf-side. Every item below lands in value.js's own tree, on its own
authorization and wave numbering; **kf does NOT write value.js's tree.** The consume is a
PUBLISHED re-pin (`^0.13.0 → ^0.14.0`), **NEVER a `file:` link or a vendored copy** (the
named forbidding — `L.md` inv-16). No cycle: value.js → kf (grammar); kf → glass-ui
(spring); no back-edge. kf currently pins `@mkbabb/value.js: ^0.13.0` and
`@mkbabb/parse-that: ^0.9.0` (`package.json`, registry-probed 2026-06-16); ask §8 below
RETIRES the direct parse-that dependency entirely.

**The honest-refusal frame (why these are CORRECTNESS, not nice-to-have).** kf's house law
is the `format.ts:38` `serializeEasing` THROW idiom — *"what cannot round-trip faithfully
is REFUSED with a NAMED reason, never silently approximated"* (`compile.ts:36`). Five of
these ten asks (§1 comma-list, §2 transform axis, §3 color(), §5 linear()/FunctionValue,
§6 partial-input) are **silent-loss defects on the FORWARD leg** — value.js parses lossily
and returns `status=true`, so the loss is INVISIBLE to kf's compile-side refusal gates
(it happens upstream of `compile.ts`). The L audit's headline (Lane 33, ⚠13): *"this loss
happens UPSTREAM of compile, on the forward leg, invisibly."* These cannot be cured
kf-side without re-implementing value.js's grammar — they are value.js's to fix.

---

## §0 — The dispatch in one table (ten asks · the kf workaround each DELETES)

| # | Ask | value.js producer seam | The kf consume edge | The kf workaround it DELETES | Audit anchor |
|---|---|---|---|---|---|
| **1** | **comma-list declaration grammar** — multi-value `<X>#` lists | `src/parsing/stylesheet.ts:212` `parseDeclarationValue` / `index.ts` `CSSValues.Values` | `adapter.ts` `declsToVarMap` · `resolveKeyframes`/`parseAndFlattenObject` | — (no workaround possible; SILENT forward-leg loss — the band-aid would be a kf re-parse) | viol10/13/14, W74, ★multi-box-shadow |
| **2** | **transform axis semantics** — `rotate`≡`rotateZ`, `scale`=X+Y not Z | `src/parsing/index.ts:61` `handleTransform` | `parseAndFlattenObject` (utils.ts) → matrix lerp | — (non-isomorphic EXPANSION; kf cannot un-expand a wrong transform) | viol12, W72, ★ |
| **3** | **color() replay-equal + var() inside color** | `src/parsing/color.ts:494/257` `colorFunction`/`colorValue` | adapter ingest · `compile.ts` color leg | — (THROW + `color(` wrapper drop; no kf re-wrap exists) | W71, ★color()/★var() |
| **4** | **@property typed grammar** — `<syntax>` + typed `initial-value` + backward serialize | `src/parsing/stylesheet.ts:379` `buildPropertyDescriptor` · `serializeStylesheetItem` | `engine.ts:1225` propertyRegistry · `compileToCSS`/`CSSKeyframesToString` | — (the registration never re-emits; the kf cure L.W1 needs the typed producer) | viol15, W73/W103, ★@property |
| **5** | **linear() + FunctionValue space-separated serialize** | `src/parsing/serialize.ts:17` `serializeDeclaration` · `units/index.ts:142` `FunctionValue.toString` · `parsing/easing.ts:65` | `utils.ts:175-196` `getTimingFunction` | **the `linear()` comma-list normalize regex** (`utils.ts:185-193`) + the `FunctionValue` comma-injection workaround | viol19/20/23, VJ-L2, ★ |
| **6** | **partial-input HONESTY** — fail, don't silently truncate | `src/parsing/stylesheet.ts:212-245` (per-decl parse accepts PARTIAL) | adapter `onParseError:173` (authored, inert) | — (the truncation IS the loss in §1; this is its honesty half) | viol10, ★OnParseError-inert |
| **7** | **the perf set VJ.L1–L8** — per-call alloc in the color hot paths | `units/color/matrix.ts:19`, `conversions/oklab.ts:28/57`, `color/dispatch.ts:391/223`, `normalize.ts:34` | `compile-color.ts` densify · oklab playback lerp | — (perf; no workaround — a budgeted bench gates the claim) | W78-85, ★transformMat3/oklab2xyz/mixColors/gamutMap |
| **8** | **`parseCSSSubValue`/`parseCSSValueOrArgs`** — ELIMINATE kf's direct parse-that dep + the FN_NAME stamp gap | a value.js root export composing its OWN parsers + a typed-construct / preserved-name surface | `utils.ts:1` `import { any } from "@mkbabb/parse-that"` · `FN_NAME` Symbol (`utils.ts:45`) | **the whole `@mkbabb/parse-that` production dependency** + **the `FN_NAME` Symbol re-stamp** (`utils.ts:45-57,294-298`) | viol18/24, W88/W94, ★FN_NAME/★parse-that-dep |
| **9** | **nesting/container/layer recursive parse** | `src/parsing/stylesheet.ts` (unknown at-rule body = opaque string) | adapter ingest · `fromStyleSheets` totality | — (silently dropped; the kf cure needs the typed recursive producer) | W101-102, ★CSS-Nesting/★@container |
| **10** | **`parseTransitionShorthand`/`reverseTransitionShorthand`** — the `transition` mirror of the shipped `reverseAnimationShorthand` | a value.js `transition`-family parse + inverse-serialize pair (mirror `parsing/animation-shorthand.ts`) | `compile.ts`/`format.ts` (consume the inverse for `transition` longhand⇄shorthand the way `reverseAnimationShorthand` is consumed at `format.ts:268`) | — (value.js ships NO `transition` shorthand pair; kf has no inverse to call — the FORWARD parity gap) | W104, animation-shorthand mirror |

**The decisive ground truth.** value.js 0.13.0 closed the K frontier (scroll grammar +
perceptual ramp) — the K dispatch's two items LANDED. But the 36-lane L audit, probing the
FULL CSS surface (not just the animation core), found ten OPEN totality defects, **eight
of them silent-loss or replay-equality breaches on the forward leg** that kf cannot cure
without re-authoring value.js's grammar. §1–§9 + §12 carry each in full; §10 records the cadence;
§11 the status ledger.

---

## §1 — comma-list declaration grammar (multi-value lists SILENTLY truncate)

### §1.1 The precise gap (line-anchored, 0.13.0 tree)

value.js's `parseDeclarationValue` (`value.js/src/parsing/stylesheet.ts:212`) runs
`CSSValues.Values` over the declaration value text. For a comma-separated multi-value list
— `box-shadow: 0 0 0 red, 0 0 0 blue`, `transition: a 1s, b 2s`, `font-family: Arial,
sans-serif`, layered `background` — `CSSValues.Values` parses the FIRST top-level
comma-segment and **returns `status=true`**, silently dropping the remainder. The empirical
probe (audit viol13): *"`box-shadow: 0 0 0 red, 0 0 0 blue` parses to a 4-leaf ValueArray
`0 0 0 rgb(255 0 0)`, the second shadow gone."*

Worse, the dead-code comment at `stylesheet.ts:219-220` documents a fallback for
*"comma-separated lists like `font-family: Arial, sans-serif`"* — but `CSSValues.Values`
**succeeds on the first segment** (`status=true`), so the fallback NEVER fires (viol14: *"a
thought-handled gap that is actually open"*). The top-level stylesheet parse requires full
input consumption (`stylesheet.ts:503-510`), but the **per-declaration value parse does
NOT** — the asymmetry that hides the loss.

### §1.2 What kf asks value.js to ship

A comma-aware declaration-value LIST grammar (W74). `parseDeclarationValue` returns a
**segmented list** (a `CSSValues.ValueList` node — N `ValueArray` segments) for any
top-level-comma declaration, with an **inverse serializer** that re-joins the segments with
`, ` (so the round-trip is the parser run backward). The grammar must REQUIRE full input
consumption on the per-declaration parse (mirror `stylesheet.ts:503` to the value level) so
a partial parse is a FAILURE, not a truncating success (§6 is this ask's honesty half).

### §1.3 How kf consumes it · the workaround it deletes

kf's `adapter.ts` `declsToVarMap` reads `decl.value` (a `ValueArray`)
verbatim into the var map; `resolveKeyframes`/`parseAndFlattenObject` flattens it. **There
is NO kf workaround to delete here — because no workaround is POSSIBLE**: the loss is silent
on the forward leg, upstream of every kf gate. The only kf-side "cure" would be to RE-PARSE
the declaration text with kf's own comma splitter — exactly the band-aid `inv-L-acyclic-purity`
forbids (re-implementing value.js's grammar at the consume seam). The consume edge: when
value.js ships the segmented `ValueList`, kf's `declsToVarMap` consumes N segments and
`proof:replay-equality` (the NEW L.W1 gate) greens its multi-box-shadow/transition/font-family
fixtures — which **RED today** because the tail is gone before any kf gate runs.

---

## §2 — transform rotate/scale/skew axis semantics (non-isomorphic)

### §2.1 The precise gap

`handleTransform` (`value.js/src/parsing/index.ts:61-105`) EXPANDS `rotate()`/`scale()`/
`skew()` across X/Y/Z axes, producing a transform that does NOT match CSS semantics
(viol12): CSS `rotate(45deg)` ≡ `rotateZ(45deg)` (Z axis), but the expansion treats it
otherwise; CSS `scale(2)` sets X+Y (NOT Z), but the expansion mis-distributes. The comment
at `index.ts:78` correctly notes *"CSS has no skewZ() — skew only has X and Y axes"* —
proving the axis model is partially hand-coded and partially wrong. The result is **a
different rendered transform** than the author's CSS — a gestalt/isomorphism breach: *"the
transposition is non-isomorphic to the source CSS"* (viol12).

### §2.2 What kf asks value.js to ship

The full transform-function grammar with CORRECT axis semantics (W72): `rotate`→Z,
`scale`→X+Y, `skew`→X+Y, the explicit `*X`/`*Y`/`*Z`/`*3d` forms, `matrix`/`matrix3d`/
`perspective` typed, and a replay-equal serializer. The 2-D/3-D distinction must be
isomorphic to the CSS Transforms spec, not an axis-broadcast heuristic.

### §2.3 How kf consumes it · the workaround it deletes

kf's `parseAndFlattenObject` (utils.ts) sets `property`+`subProperty` on each transform
leaf for matrix lerp; a WRONG axis expansion means kf lerps a wrong matrix and renders a
wrong frame. **No kf workaround exists** (kf cannot un-expand value.js's expansion — it
has already lost the axis identity). The consume edge: the corrected grammar lands, kf's
transform fixtures in `proof:replay-equality` green (they RED today against the
non-isomorphic expansion).

---

## §3 — color() replay-equal + var() inside color

### §3.1 The precise gap

Two defects in `value.js/src/parsing/color.ts`:

1. **`color()` not replay-equal** (`colorFunction:494-543`, W71): the `color(srgb 0 0 1)`
   wrapper is dropped and the space-name leaks as a function name on serialize — `parse →
   serialize → parse` is not identity. The audit: *"`color(` wrapper dropped, space-name
   leaks as function name."*
2. **`var()` inside a color function THROWS** (`colorValue:257-269`): `oklch(var(--l) 0.2
   180)` — extremely common real-world CSS — throws rather than carrying the `var()` token
   through as an unresolved-component placeholder.

### §3.2 What kf asks value.js to ship

(W71) A replay-equal `color()` serializer that preserves the `color(<space> …)` wrapper and
round-trips the space name as a SPACE not a function name; and a `var()`/`calc()`
substitution-token grammar INSIDE color components — the `var()` survives as a typed
unresolved-component node (the same way `calc()` survives as `ValueUnit("expression",
"calc")`, per MEMORY: *"flattenObject treats calc() as atomic"*), so kf's `getComputedValue`
DOM-resolution can resolve it at sample time.

### §3.3 How kf consumes it · the workaround it deletes

kf's adapter ingests color leaves and `compile.ts`'s color leg densifies them. A `var()`
THROW aborts the whole keyframe parse; a non-replay-equal `color()` breaks the compile-back
leg. **No kf workaround** (a THROW cannot be worked around at the consume seam — the parse
is already dead). The consume edge: the `color()`/`var()` fixtures green in
`proof:replay-equality` on the value.js publish.

---

## §4 — @property typed grammar (the backward-serialize enabler)

### §4.1 The precise gap

`buildPropertyDescriptor` (`value.js/src/parsing/stylesheet.ts:379-407`) parses
`@property --x { syntax: "<color>"; … }` but the `syntax` string is OPAQUE
(`stylesheet.ts:386` strips quotes only) and the `initial-value` is **untyped against it**
(W73/W103): the registration carries `syntax?: string` (`stylesheet.ts:38`) but no typed
`<syntax>` grammar, and no parse of `initial-value` AS that syntax. Separately, the audit's
replay-equality headline (viol15): a parsed `@property` registration **never re-emits
backward** — kf registers it with the UA (`engine.ts:1225`) but neither `CSSKeyframesToString`
nor `compileToCSS` calls value.js's **block serializer `serializeStylesheetItem`** (the real
0.13.0 export — `value.js/dist/parsing/serialize.d.ts`; note value.js exports NO per-`@property`
serializer function, despite a K-era phantom cite that named one), so a compiled artifact
animating a registered `--custom-prop` LOSES its typing and breaks on re-ship.

### §4.2 What kf asks value.js to ship

(W73/W103) A typed `@property syntax`-string grammar (CSS Properties & Values API Level 1):
parse `<syntax>` into a typed descriptor, parse `initial-value` AS that syntax (a typed
`<color>`/`<length>`/`<integer>`/… interpolation domain). value.js 0.13.0 ALREADY exposes
the **block serializer `serializeStylesheetItem`** (the real export — it round-trips a
parsed `StylesheetItem`, `@property` block included, as the untyped string it ingested); kf's
L.W1 cure consumes THAT today. The O ask is the **typed widening**: either teach
`serializeStylesheetItem` to re-emit the `<syntax>`-typed `initial-value` faithfully, OR — if
value.js prefers a dedicated entry point — a **typed `@property`-descriptor serializer** (a
new function, e.g. `serializeAtPropertyDescriptor`) that emits the typed descriptor +
initial-value backward. The ask is for the TYPED-SYNTAX round-trip on top of the EXISTING
`serializeStylesheetItem` block serializer, NOT a claim that any per-`@property` serializer
already exists.

### §4.3 How kf consumes it · the workaround it deletes

kf's L.W1 cure wires `@property` backward serialization into `compileToCSS`/
`CSSKeyframesToString` (consuming value.js's `serializeStylesheetItem` — `L.md §wave map` L.W1
"@property backward-serialize (W75)"). **No kf workaround to delete** — the registration is
simply LOST today; the cure is enabled BY this ask. The kf L.W1 source half lands born-RED
against the typed producer; `proof:replay-equality`'s `@property` arm greens on the publish.

---

## §5 — linear() + FunctionValue space-separated serialize (the ACTIVE workaround deletion)

### §5.1 The precise gap

This is the **most consequential ask** — it is the one with a LIVE, line-anchored kf
workaround the audit flagged as a NO-WORKAROUND violation. Two coupled defects:

1. **`linear()` serialize/parse asymmetry** (viol19): value.js's `serializeDeclaration`
   (`value.js/src/parsing/serialize.ts:17`) emits `linear()` stops as a FLAT comma list —
   `linear(0, 0.5, 25%, 1)` — but its OWN `parseLinearStops` (`value.js/src/parsing/easing.ts:65`)
   requires the canonical space-joined form `linear(0, 0.5 25%, 1)` and REJECTS the flat
   form. The serializer run forward is NOT the parser run backward.
2. **`FunctionValue.toString()` comma-injection** (viol23): `FunctionValue.toString`
   (`value.js/src/units/index.ts:142`) serializes space-separated CSS function arguments
   (`linear()`/`scroll()` positional args) WITH commas, breaking `parse(serialize(parse(s)))`
   identity. The value.js 0.13.0 CHANGELOG explicitly acknowledges this for `scroll()` as a
   known limitation.

### §5.2 The kf workaround it DELETES (line-anchored)

kf carries the fix in `getTimingFunction` (`src/animation/utils.ts:175-196`): a comment-flagged
regex that **re-normalizes value.js's flat `linear()` comma list back to the canonical
space-joined form** before handing it to `parseLinearStops`, with the explicit comment
(`utils.ts:187-189`): *"`linear()`'s stops as a FLAT comma list — `linear(0, 0.5, 25%, 1)`
— not the canonical space-joined `linear(0, 0.5 25%, 1)`. That form its OWN `parseLinearStops`
rejects."* The audit (viol20): *"a workaround living in the consumer; it must be deleted once
VJ-L2 lands."* This is the single most direct `inv-L-acyclic-purity` deletion in the
dispatch — **a consumer-side correction of a sibling serialize bug.**

### §5.3 What kf asks value.js to ship

(VJ-L2, W87/W95) Fix `serializeDeclaration`/`FunctionValue.toString` so `linear()` (and all
space-separated-argument CSS functions — `scroll()`/`view()`/the easing/timeline families)
serialize in the canonical space-joined form their own parsers accept. Add a
`linearStopsToCSS` producer if the round-trip needs a dedicated serializer. After VJ-L2,
`parse(serialize(s)) === parse(s)` for `linear()` and the FunctionValue family.

### §5.4 How kf consumes it · the workaround deletion gate

On the value.js publish, kf's L.W9 consume edge **DELETES the regex normalize at
`utils.ts:185-193`** and calls value.js's serializer directly. The **workaround-deletion
gate** (`L.md §wave map`, L.W9: "the workaround-deletion gates (linear-regex, FN_NAME,
parse-that-dep, aria-suppress) bite on consume") asserts the regex is GONE from
`utils.ts` AND the `linear()` round-trip is byte-identical — RED until VJ-L2 lands, GREEN
on the deletion.

---

## §6 — partial-input HONESTY (fail, don't silently truncate)

### §6.1 The precise gap

This is §1's honesty half, and the structural root of the silent-loss class (viol10).
`parseDeclarationValue` (`value.js/src/parsing/stylesheet.ts:212-245`) treats a PARTIAL
parse — first comma-segment only — as SUCCESS and emits it as the whole declaration. The
top-level stylesheet requires full consumption (`stylesheet.ts:503-510`); the per-declaration
value parse does NOT. Compounding: the `OnParseError`/`ParseDiagnostic` sink kf authored in
`adapter.ts:173-176` is **inert** — value.js parse failures do not flow to it (the audit:
*"authored but inert — value.js parse failures do not flow to it"*), because the partial
parse never REPORTS a failure (it succeeds lossily).

### §6.2 What kf asks value.js to ship

The no-silent-degrade contract (the Mandate's honest-refusal clause, viol13): a
declaration-value parse either (a) FULLY consumes its input and returns `status=true`, or
(b) FAILS with a `ParseDiagnostic` naming the unconsumed remainder. **Never a partial
success.** This couples to §1: the comma-list grammar makes the common partial case
(multi-value lists) a SUCCESS by parsing all segments; this ask makes the residual partial
cases (genuinely unparseable tails) an honest FAILURE that flows to the diagnostics sink.

### §6.3 How kf consumes it · the workaround it deletes

kf's `adapter.ts:173` `onParseError` sink — authored, currently dead — LIGHTS: value.js's
honest failure flows to it, surfaces as a typed `Diagnostic[]` (the channel the agent-author
verb L.W6 `validate(css)` projects). **No kf workaround to delete** — the sink was built
ahead of the producer (a born-RED consume edge); it activates on the publish. The consume
edge: `proof:replay-equality`'s "honest-refusal-on-unparseable-tail" arm greens (RED today
because a partial parse silently succeeds).

---

## §7 — the perf set VJ.L1–L8 (per-call alloc in the color hot paths)

### §7.1 The precise gaps (line-anchored, the SOTA frontier)

The L audit's SOTA-perf lane found the engine perf exemplary but the **value.js color-math
hot paths allocate per-call** — paid on every `sampleColorRamp` stop (the kf densify) and
every oklab playback frame. The line-anchored set:

- **VJ.L1 `transformMat3`** (`value.js/src/units/color/matrix.ts:19-27`): returns a NEW
  `[number, number, number]` tuple every call — the inner kernel of ALL oklab/oklch/lab
  conversions. Ask: scalar-inlined, zero-allocation 3×3 MVM (write into a caller scratch or
  return-by-out-param) (W78).
- **VJ.L2/L3 `oklab2xyz`/`xyz2oklab`** (`conversions/oklab.ts:28,57`): each allocates TWO
  intermediate `Vec3` tuples per call (`lms` + `lmsLinear`, lines 45/48/61/64) inside every
  XYZ-hub conversion. Ask: scratch-buffer the intermediates.
- **VJ.L4 `mixColors`** (`color/dispatch.ts:391`, alloc at `:424` `c1.keys().filter(...)`,
  `:432` `resultComponents: number[] = []`, `:460` `new ResultClass(...resultComponents)`):
  allocates a `resultComponents` array AND calls `c1.keys()` + `filter()` on EVERY call —
  paid on every `sampleColorRamp` stop and every `color-mix()` parse. Ask: per-space scratch
  buffer, indexed channel write, drop the `keys().filter()` closure (W79).
- **VJ.L5 `gamutMapToRgbSpace`** (`color/dispatch.ts:223-306`): constructs a NEW `OKLCHColor`
  + calls `color2()` twice inside each of `CHROMA_SEARCH_STEPS` (≈24) binary-search iterations
  — ≈48 Color allocations per out-of-gamut wide-gamut pixel. Ask: scalar probe, no
  per-iteration Color allocation (W80).
- **VJ.L6 `normalizeColor`** (`color/normalize.ts:34-45`): `color.keys().forEach(...)`
  hot-loop closure allocation per call. Ask: indexed channel write, drop the `forEach`
  closure (W81).
- **VJ.L7/L8** (W82-85): the `memoize` fast-path (skip LRU delete/re-set when
  `maxCacheSize` is `Infinity`), `DIRECT_PATHS` expansion (oklch↔oklab, hsl↔oklch for the
  gamut-map/`sampleColorRamp` hot paths), intra-bucket dispatch refinement, and `scale()`
  constant-range fast paths.

### §7.2 What kf asks value.js to ship

The VJ.L1–L8 zero-alloc rewrite of the color hot paths above, each MEASURE-FIRST (a budgeted
bench proving the alloc-count drop with no correctness regression). **The MEASURE-FIRST
discipline is value.js-side** — kf does not write value.js's bench; kf's ask is the alloc
claim + the consume-side budget.

### §7.3 How kf consumes it · the gate

**No kf workaround to delete** (this is a missed-OPPORTUNITY, not a violation — viol34). kf's
`compile-color.ts` densify calls `sampleColorRamp` (which fans into `mixColors`→`oklab2xyz`→
`transformMat3`); fewer allocations there = a faster densify + a faster oklab playback frame.
The consume edge is the value.js re-pin; the gate is a **budgeted bench taxonomy** kf-side
(`L.md §wave map` L.W7: "a budgeted bench taxonomy (no kf bench covers the value.js
color-math alloc claims today)") that asserts the per-stop densify alloc count DROPS on the
0.14.0 consume — RED-against-budget today.

---

## §8 — parseCSSSubValue/parseCSSValueOrArgs (ELIMINATE kf's direct parse-that dep + the FN_NAME gap)

### §8.1 The precise gaps (the two acyclic-spine breaches)

1. **kf's DIRECT `@mkbabb/parse-that` dependency** (viol24): kf imports `any` from
   `@mkbabb/parse-that` (`src/animation/utils.ts:1` `import { any as parseAny } from
   "@mkbabb/parse-that"`) SOLELY to compose value.js's parsers (the cross-realm `any`
   combinator over value.js's typed parsers — `CLAUDE.md §Dependencies`: *"consumed directly
   only in `src/animation/utils.ts`"*). This reaches THROUGH value.js's parser abstraction to
   compose primitives from parse-that — *"this composition belongs in value.js (which already
   owns the parsers)"* (viol24). It makes kf carry a first-class production dependency it
   should not have (`package.json: @mkbabb/parse-that: ^0.9.0`).
2. **the `FN_NAME` Symbol stamp gap** (viol18): kf stamps a `FN_NAME` Symbol
   (`src/animation/utils.ts:45-57`) onto value.js `ValueUnit` instances — *"kf is writing
   state onto a class it does not own"* — and RE-STAMPS it on every clone
   (`utils.ts:294-298`) because `ValueUnit.clone()` DROPS the stamp (it's invisible to
   value.js, untyped, undocumented). kf works the restamp around correctly but OWNS a gap
   value.js should close.

### §8.2 What kf asks value.js to ship

(W88/W94) `parseCSSSubValue(property, str)` / `parseCSSValueOrArgs` exposed at the value.js
package root — a single entry point that parses a sub-value or a function-arg list using
value.js's OWN composed parsers, so kf calls value.js's API instead of reaching through to
parse-that's `any`. AND (the FN_NAME half, VJ-L1-adjacent / W90): either a typed `ValueUnit`
construct that PRESERVES a function name through `.clone()`, or a documented `fnName` field
on `FunctionValue`/`ValueUnit` so kf reads it from value.js instead of side-channel-stamping
it. The two together let kf DROP both the direct parse-that import and the Symbol stamp.

### §8.3 How kf consumes it · the workarounds it deletes

The two biggest acyclic-spine deletions in the dispatch:

- **DELETE the `@mkbabb/parse-that` production dependency** entirely (`package.json` — the
  dep line removed; `utils.ts:1` import removed; the `any`-composition replaced by value.js's
  `parseCSSSubValue`). The **workaround-deletion gate** (`proof:boundary` extended per W96:
  "catch direct `@mkbabb/parse-that` imports in light modules") RED until the value.js
  surface lands, GREEN on the removal — AND `proof:boundary`'s `holdsValueJsSpecifier`
  widens to assert NO `@mkbabb/parse-that` import survives in `src/`.
- **DELETE the `FN_NAME` Symbol stamp + restamp** (`utils.ts:45-57,294-298` removed; kf reads
  the name from value.js's preserved field). The deletion gate asserts the Symbol is gone
  from `utils.ts` and the function-name survives a value.js `.clone()`.

Both RED today (the producer surface is unpublished); both bite on the 0.14.0 consume. This
is the ask that makes kf's dependency graph the clean `value.js → kf` edge the spine claims,
with NO direct parse-that reach-through.

---

## §9 — nesting/container/layer recursive parse

### §9.1 The precise gap

value.js's stylesheet parser treats every unknown at-rule body as an OPAQUE string — no
recursive parse of `@media`/`@supports`/`@layer`/`@container` contents (W101-102, ★). The
audit live-probes: CSS Nesting (Baseline-2023) is *"silently DROPPED — nested rules inside a
declaration block are lost with no error"*; `@container (min-width:200px){…}` *"degrades to
genericAtRule with an UNPARSED string prelude"*; the `@container` condition is not typed
(not merely an opaque prelude — no size-query / `style()` branch parse). For kf's live-ingest
(`fromStyleSheets`/`adoptRunning`) totality, a stylesheet that nests `@keyframes` inside a
`@media`/`@layer`/`@container` (extremely common) has its inner `@keyframes` LOST.

### §9.2 What kf asks value.js to ship

(W101/W102) Recursive stylesheet parse: `@media`/`@supports`/`@container`/`@layer` as a typed
recursive `StylesheetItem` (the body parsed AS a nested stylesheet, not an opaque string), and
a TYPED `@container` condition parse (size queries + the `style()` branch). This is the
producer half of kf's L.W3 ingest-deepening ("recursive group-rule walk for nested
@keyframes" — `L.md §wave map` L.W3, W7) — kf's walker needs value.js to hand it a typed
recursive tree, not a string it would have to re-parse (the forbidden band-aid).

### §9.3 How kf consumes it · the consume edge

kf's L.W3 `recursive group-rule walk` (the ingest cure) consumes the typed recursive
`StylesheetItem` tree: a `@keyframes` nested inside `@media`/`@layer`/`@container` is
WALKED, not dropped. **No kf workaround to delete** (the inner rule is simply lost today —
the kf walker can't reach into an opaque string without re-parsing it). The consume edge:
`proof:ingest-replay`'s NEW nested arm (`L.md §wave map` L.W3) greens on the publish — RED
today because the nested `@keyframes` never surfaces from value.js's opaque-string body.

---

## §12 — `parseTransitionShorthand`/`reverseTransitionShorthand` (the animation-shorthand mirror)

### §12.1 The precise gap (the FORWARD parity hole)

value.js 0.13.0 ships the `animation` shorthand parse+inverse pair —
`parseAnimationShorthand`/`reverseAnimationShorthand` (`value.js/dist/parsing/animation-shorthand.ts`,
exported at the package root) — which kf consumes on the compile-back leg: `format.ts:268`
calls `reverseAnimationShorthand(cssOptions)` to emit the per-child `animation` shorthand,
and `compile.ts` rides the same inverse. There is **NO `transition` equivalent**: value.js
exposes neither `parseTransitionShorthand` nor `reverseTransitionShorthand`
(`grep '(parse|reverse)TransitionShorthand' value.js/dist = 0`). The `transition` property
is the structural twin of `animation` (a comma-list of `<property> <duration> <timing>
<delay> <behavior>` segments), and the L audit's grammar-parity lane (W104) flags the
asymmetry: kf can round-trip `animation` faithfully but has **no inverse to call for
`transition`** — so a stylesheet authored with `transition` longhands cannot be re-emitted
as the shorthand value.js already knows how to emit for `animation`.

### §12.2 What kf asks value.js to ship

(W104) The `transition`-family mirror of the shipped animation pair: a
**`parseTransitionShorthand`** that segments a `transition` value into typed per-property
descriptors (property, duration, timing-function, delay, transition-behavior), and a
**`reverseTransitionShorthand`** inverse-serializer that re-joins typed longhands into the
canonical comma-list shorthand — `parse(serialize(s)) === parse(s)`, exactly as
`reverseAnimationShorthand` already guarantees. Author it beside
`parsing/animation-shorthand.ts` so the two families share the segment grammar.

### §12.3 How kf consumes it · the gate

kf's `format.ts`/`compile.ts` consume `reverseTransitionShorthand` the way they already
consume `reverseAnimationShorthand` (`format.ts:268`), closing the `transition`
longhand⇄shorthand leg. **No kf workaround to delete** — this is a FORWARD parity gap (value.js
ships no `transition` pair, so kf has no band-aid, only an absent inverse). The consume edge:
a `proof:replay-equality` `transition`-shorthand arm REDs today (no inverse exists) and greens
on the 0.14.0 publish.

---

## §10 — The cadence (the dispatch does not block L's Band A)

Per `L.md §The two bands`: **Band A — kf-internal TOTALITY (value.js-0.13.0-and-4.3.0-sufficient)
proceeds immediately.** L.W1–L.W8 do NOT block on this dispatch:

- **L.W1's `!important`/per-stop-composition/named-selector floor** is value.js-0.13.0-sufficient
  (value.js already exposes `Declaration.important`, `rule.composition`, the named-keyframe
  selector — `adapter.ts:67/224`, ⚠31/16/17). Those cures are Band A, engine-internal, NOW.
  Only the **@property backward-serialize** leg (§4) gates on the typed-syntax producer, and
  even that has value.js's existing `serializeStylesheetItem` to consume at 0.13.0 (the typed
  widening is the O ask).
- **L.W2's scroll-compile + multi-color densify/refuse** rides the SHIPPED 0.13.0
  `sampleColorRamp`/`deltaEOK`/scroll grammar (the K dispatch's LANDED items). Band A.
- **L.W7's perf** is gated by §7 but the kf-side bench taxonomy + the LIGHT-tier `lerpArray`
  consume (already published) land Band A; the value.js alloc-drop is the consume widening.

So this dispatch is the Band-B value.js leg: **kf authorizes and runs Band A while value.js
ships Tranche O in its own interval** — the same acyclic cadence value.js's 0.13.0 cut just
demonstrated for the K dispatch. Each kf consume edge is **born-RED-gated kf-side**: the
source half (or the workaround-deletion gate) lands NOW against the recorded 0.13.0 absence,
the edge LIGHTS on the 0.14.0 publish. **NEVER a `file:` link, NEVER a vendored grammar.**

The named fallback (mirroring the K dispatch's "Tranche O as the named fallback"): if any O
item slips, kf's affected gate stays RED and the wave circles back at L.WZ (the deferred
ledger carries it as a Band-B consume-edge with a named tripwire — `L.md §The deferred fold`).

---

## §11 — Status ledger (for value.js's Tranche-O re-anchor)

| O ask | What | The kf consume edge | The workaround DELETED | Born-RED-gated kf-side? |
|---|---|---|---|---|
| **§1 comma-list grammar** | segmented `ValueList` + inverse serializer (W74) | `adapter.ts` `declsToVarMap`; `proof:replay-equality` multi-value arm | — (silent forward-loss; no band-aid was possible) | YES — gate REDs on multi-box-shadow/transition/font-family until publish |
| **§2 transform axis** | correct rotate≡Z/scale=X+Y grammar + serializer (W72) | `parseAndFlattenObject` matrix lerp; `proof:replay-equality` transform arm | — (non-isomorphic expansion; kf can't un-expand) | YES |
| **§3 color() + var()** | replay-equal `color()` + var()-in-color token (W71) | adapter color ingest; `compile.ts` color leg | — (THROW / wrapper-drop; un-workable-around) | YES |
| **§4 @property typed grammar** | typed `<syntax>` + `initial-value` + `serializeStylesheetItem` (W73/W103) | `engine.ts:1225`; `compileToCSS`/`CSSKeyframesToString` (L.W1) | — (registration LOST; the cure is enabled BY this) | YES — L.W1 source half born-RED on the typed producer |
| **§5 linear()/FunctionValue serialize** | canonical space-joined serialize (VJ-L2, W87/W95) | `utils.ts:175-196` `getTimingFunction` | **the `linear()` regex normalize** (`utils.ts:185-193`) + FunctionValue comma-fix | YES — `proof:` workaround-deletion gate (regex GONE + byte-identical) |
| **§6 partial-input honesty** | full-consume-or-fail + diagnostic on tail (viol10) | `adapter.ts:173` `onParseError` (inert→live) | — (the inert sink ACTIVATES; no band-aid to delete) | YES — honest-refusal arm REDs today (partial silently succeeds) |
| **§7 perf VJ.L1–L8** | zero-alloc color hot paths (W78-85) | `compile-color.ts` densify; oklab playback | — (missed-opportunity, not a violation) | YES — budgeted bench REDs against the alloc budget |
| **§8 parseCSSSubValue + FN_NAME** | root parser API + preserved fn-name (W88/W94/W90) | `utils.ts:1` import; `FN_NAME` stamp | **the whole `@mkbabb/parse-that` dep** + **the `FN_NAME` Symbol** | YES — `proof:boundary` (W96) REDs on any surviving parse-that import |
| **§9 nesting/container/layer** | typed recursive `StylesheetItem` + typed @container (W101-102) | L.W3 recursive group-rule walk; `proof:ingest-replay` nested arm | — (inner `@keyframes` LOST; can't reach into opaque string) | YES — nested-`@keyframes` arm REDs today |
| **§12 transition shorthand** | `parseTransitionShorthand`/`reverseTransitionShorthand` mirroring the shipped animation pair (W104) | `format.ts`/`compile.ts` (the `transition` longhand⇄shorthand leg, beside `reverseAnimationShorthand` at `format.ts:268`) | — (FORWARD parity gap; value.js ships no `transition` pair, so there's no kf band-aid to delete — only an absent inverse) | YES — a `proof:replay-equality` `transition`-shorthand arm REDs until the pair publishes |

**The acyclic spine holds.** value.js publishes Tranche O VALUES (grammar totality + the
perf set + the parser-API surface); kf consumes one tranche behind (`^0.13.0 → ^0.14.0`),
born-RED-gated kf-side; glass-ui consumes spring FROM kf. The ten asks DELETE four named kf
workarounds (the `linear()` regex, the `FN_NAME` Symbol, the direct parse-that dep, the
inert-sink dead-end) and CLOSE five silent-loss forward-leg breaches that kf cannot cure at
the consume seam without violating `inv-L-acyclic-purity`. No cycle, no `file:` link, no
vendored grammar. **kf does NOT write value.js's tree** — the wave numbering and the 0.14.0
cut are value.js's to ship; this is the outbound edge of the dispatch the L charter names.
