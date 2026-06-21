# keyframes.js → value.js Tranche P — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-20 at the keyframes **Tranche P** development phase (the
> Constellation Optimization Campaign — `P/CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`).
> This **supersedes and extends** the O dispatch (`docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md`):
> O carried the two **API** asks (VJ-L1 `flatLeaf` + VJ-L3 `parseCSSSubValue`)
> that value.js O **deferred**; P **inherits them unchanged** and **adds the
> optimization frontier** — the `color2Into` gamut zero-alloc tail, the typed
> Float64 channel view, the `: any` property/subProperty seam narrowing, and the
> **CODEGEN-CONSUME** (value.js generates its CSS-value parser from `css/l4/*.bbnf`
> over the parse-that-B codegen edge). value.js is the UPSTREAM library on the
> constellation spine (parse-that → value.js → keyframes.js → glass-ui); this is
> the formal handoff to value.js's **Tranche P** session.
>
> **inv-16 holds: no value.js source is written from keyframes.js.** value.js's P
> session schedules these ASKs into its own waves; kf re-pins and deletes its
> workarounds on the publish. Publish-then-re-pin, never cross-write. The proven
> O fence pattern (kf authored the dispatch, value.js's session implements).

This dispatch is the binding cross-repo contract behind kf wave **P.W11**
(the VJ-L1 WeakMap early-cure — the NOW arm that unblocks O.W7 if value.js P
slips), the inherited **O.W16** (the GATED S8/S9 delete on the publish), and
**P.W4** (the GATED codegen-consume). The version split: value.js **1.1.0**
(API — VJ-L1 + VJ-L3, BC-additive, the kf-unblock) **then 1.2.0** (perf — the
allocation + seam + codegen frontier, non-breaking). Per the DAG, value.js P
sequences **AFTER parse-that B** (which ships `@mkbabb/parse-that/codegen`, the
codegen substrate value.js's 1.2.0 codegen-consume depends on) and **BEFORE
keyframes P** (the consumer).

---

## The ASK roster

| # | ASK | value.js file:line (grounded) | proposed API / mechanism | kf consume-seam it dissolves | born-RED gate | ver |
|---|-----|-------------------------------|---------------------------|------------------------------|---------------|-----|
| **P.W0** | **commit the uncommitted O docs + reconcile the stale PROGRESS** to CLOSED-as-built | `value.js/docs/tranches/O/` is **untracked** (`git status` → `?? docs/tranches/O/`); `O/PROGRESS.md:1-3` reads `DEVELOPMENT — charter only` on a fully-executed tranche (1.0.2 on master) | `git add docs/tranches/O/` + rewrite the PROGRESS header to **CLOSED** with per-wave SHIPPED status (record-as-built honesty) | n/a (value.js record hygiene; constellation-truth precondition) | `proof:progress-honesty` (value.js-side): the PROGRESS header is not `DEVELOPMENT — charter only` while master serves ≥1.0.0 | — |
| **VJ-L1** | **first-class `flatLeaf` provenance** — `FunctionValue.name` survives `flattenObject` + `clone()` as a typed field | `units/index.ts:26-31` (6-positional ctor, NO `fnName`); `:120` `clone()`; `utils.ts:85,92` `flattenObject` `FunctionValue` branch | optional `fnName?: string` (or a `meta` record) on `ValueUnit`, copied by `clone()`, populated by `flattenObject` from the enclosing `FunctionValue.name` | **S8** — the `FN_NAME` Symbol sidechannel (`kf utils.ts:45-57,64,289-294`) | `proof:workaround-deletion` **S8** arm: `apiPresent` flips when a flattened `scale(2)` leaf carries `.fnName === "scale"` after `.clone()` | **1.1.0** |
| **VJ-L3** | **`parseCSSSubValue` root helper** — typed re-entry parser internalizing `any(CSSFunction.FunctionArgs, CSSValues.Value)` | `parsing/index.ts:1` (`any` from parse-that); `parseCSSSubValue` ABSENT (`grep` → ZERO) | `parseCSSSubValue(value, opts?)` root export wrapping the **FunctionArgs-FIRST** composition (the V4 truncation trap) | **S9** — the direct `@mkbabb/parse-that` import + 2 `as any` casts + the production dep (`kf utils.ts:1,229,236`) | `proof:workaround-deletion` **S9** + the new `proof:boundary` **W96** parse-that-scan | **1.1.0** |
| **VJ-P1** | **`color2Into` out-param** — gamut bisection writes channels into a caller-owned scratch `Color` | `color/dispatch.ts:245` (`'eliminating it requires a color2Into out-param (deferred, O.W5 scope)'`); `:257` `color2(probe, target)` in the 24-step loop; `gamut.ts:247,283,307` already tuple-based | `color2Into(src, to, out)` mirroring `matrix.ts` `transformMat3Into` scratch — `gamutMapToRgbSpace` reuses one egress scratch | **(no kf delete)** — kf inherits the GC win on the rAF wide-gamut egress (faster `lerpColorValue`) | `proof:gamut-alloc` tightened: `gamutMapToRgbSpace` allocs/call ≤ 15 (born-RED on today's ~84) | **1.2.0** |
| **VJ-P2** | **typed Float64 channel view** — kill string-keyed megamorphic channel reads in the interp/conversion loops | `color/index.ts:286` (`[key: string]: any` index signature — KEEP, public); `interpolate.ts` `lerpColorValue` reads `color[k]` | optional packed `_ch: Float64Array` lazily materialized; interp/conversion read `_ch[i]` (SoA-adjacent, AoS public shape preserved) | **(no kf delete)** — kf inherits faster per-frame color interpolation | `proof:perf-target` color-channel-access clause: the Float64-view interp ≥ the named-field baseline | **1.2.0** |
| **VJ-P3** | **narrow the `: any` property/subProperty seam → `string`** (strict-mode invariant) | `units/index.ts:57` `setSubProperty(subProperty: any)`; `:61` `setProperty(property: any)`; `:174,178,274,278` (the container mirrors) | type the params `string` (BC — callers already pass strings); the kf consume-edge gains a typed seam | **(strengthens)** — kf's `parseAndFlattenObject` `setSubProperty`/`setProperty` calls type-check (`MEMORY.md` calc/computed pipeline) | `proof:any-seam` (value.js-side): `tsc` rejects `vu.setSubProperty(42)` | **1.2.0** |
| **VJ-P4** | **CODEGEN-CONSUME** — value.js generates its CSS-value parser from `css/l4/*.bbnf` over the parse-that-B codegen edge | `parsing/grammars/css-values.bbnf:6` (`not yet wired to the runtime`); `parsing/grammars/css-color.bbnf`; `parsing/index.ts:14,29,63` (~700 lines hand-maintained combinators) | consume `@mkbabb/parse-that/codegen` (parse-that B) → emit ONE straight-line `charCodeAt` scanner per grammar at BUILD time; the `.bbnf` becomes the parser | **(no kf delete)** — kf inherits faster frame-compilation; resolves the `.bbnf` "not wired" limbo | `proof:grammar-parity` + a throughput bench — parity over every `constants.ts UNITS` item, throughput ≥0.85× hand-rolled, **guarded against the A.W3 runtime-dispatch falsification** | **1.2.0** |

All ASKs are **BC-additive** to value.js's published 1.x surface (no breaking
change). The 1.1.0 pair (VJ-L1 + VJ-L3) is the kf-unblock; the 1.2.0 quartet
(VJ-P1–P4) is the optimization frontier and rides after.

---

## P.W0 — commit the O docs + reconcile the stale PROGRESS (the FIRST P action)

**The need, grounded (record-as-built honesty).** value.js Tranche O executed
all six library waves (O.W0–O.W6) and reached **1.0.2 on master**, but two
record-truth breaches persist, both verified this session (2026-06-20):

1. **`value.js/docs/tranches/O/` is uncommitted** — `git -C value.js status`
   reports `?? docs/tranches/O/` (untracked). The entire O tranche record (the
   charter, the wave specs, the PROGRESS, the dispatch ANCHORS this packet cites)
   lives only in the working tree. value.js P's **first action** is `git add` of
   the O docs so the constellation record is durable.
2. **`O/PROGRESS.md:1-3` reads `DEVELOPMENT — charter only`** on a fully-executed,
   shipped tranche — the authoritative close record is permanently stale (V5
   `[HIGH·legacy]`). The cure: rewrite the header to **CLOSED** with per-wave
   SHIPPED status (O.W0–O.W6 → the 1.0.x publish lineage).

**Why it is a kf-facing ASK (not just value.js hygiene).** This dispatch packet
**cites** `value.js/docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md` as its supersede
anchor and `O/PROGRESS.md` as the close-state oracle. If those docs are not
committed, the constellation-truth contract (the cross-repo coordination record)
rests on an uncommitted tree — a record-honesty breach the campaign's §1
"record-as-built honesty" precept forbids. P.W0 is the precondition for every
downstream ASK reading a durable O record.

**The adjacent one-liner (value.js's own ledger, noted for completeness).** While
in `units/index.ts`, value.js P should fix the O(N²) `setSubProperty` no-op in
the `FunctionValue` ctor (`index.ts:169-171` — `values.forEach((v) => { this.setSubProperty(name); })`
walks N values calling `setSubProperty(N)` N times; the fix is
`values.forEach((v) => v.setSubProperty(name))`, V5 `[HIGH·correctness]`). Not a
kf deliverable; recorded so value.js P's W0 doc-wave folds it in.

**Born-RED gate (value.js-side, `proof:progress-honesty`).** RED today:
`O/PROGRESS.md` header matches `/DEVELOPMENT — charter only/` while
`package.json` version ≥ `1.0.0`. GREEN when the header reads CLOSED-as-built.
Plant-a-failure: revert the header to the stale string → the gate reds. (This is
value.js's gate to author; kf names it for the coordination contract.)

---

## VJ-L1 — the `flatLeaf` provenance API (the kf-S8 root fix — inherited from O, unchanged)

**The kf need, grounded.** When kf flattens an author keyframe object, value.js's
`flattenObject` (`value.js/src/units/utils.ts:85`, the `obj instanceof FunctionValue`
arm at `:92`) dissolves a `FunctionValue` wrapper (`scale(…)`, `translateX(…)`,
`brightness(…)`) into bare leaf `ValueUnit`s, **dropping `FunctionValue.name`**.
kf needs that name back: the identity-aware arity pad
(`kf utils.ts:341-363`, `createInterpVarValue` → `padToLength`) resolves the CSS
**identity element** of an ABSENT function (`scale → 1`, `translateX → 0px`,
`brightness → 1`) via value.js's own `functionIdentityValue(fnName)` — so a
one-sided `transform` interpolates from the right identity, not a silent `0` (the
MCI-5 fix). Without the name, an absent `scale` would lerp from black/zero.

**Today kf carries S8** — a `Symbol("kf.fnName")` stamped onto value.js
`ValueUnit` instances (`kf utils.ts:45-57`), re-stamped after every `clone()`
(`:64`, `:289-294`) because **`ValueUnit.clone()` does not preserve it**
(`value.js/src/units/index.ts:120` clones only the ctor fields). This is a
sidechannel onto a foreign-realm object — an inv-L-acyclic-purity violation
(B10/B11): kf annotates value.js's data model from outside.

**The proposed value.js API (BC-additive). The V2/V4 transposition note — `fnName`
as a meta-record field, NOT a 7th positional arg.** The audit (V2 novelIdea #3,
V4 critical finding) flagged that the `ValueUnit` ctor is **already 6 positional
optionals** (`units/index.ts:26-31`) and `clone()`/`coalesce()` re-thread all by
index — bolting a 7th positional `fnName` makes `clone()` pass `undefined` for
`targets` to reach it (the V4 wart). value.js P has two equally-valid shapes;
**kf consumes whichever value.js publishes** and adapts `fnNameOf` to read it:

```ts
// Option A (minimal, O-anchored): a 7th optional field
constructor(
    public value: T, public unit?: U, public superType?: string[],
    public subProperty?: string, public property?: string,
    public targets?: HTMLElement[],
    public fnName?: string,          // VJ-L1: origin FunctionValue.name (flatten provenance)
) {}

// Option B (V2/V4-preferred transposition): a meta record (collapses the
// positional accretion — VJ-L1's fnName becomes one field with zero ctor churn)
//   new ValueUnit(1, 'px', { fnName: 'scale' }).meta?.fnName === 'scale'
```

Either way: `clone()` preserves it (the one line that retires the kf re-stamp),
and `flattenObject`'s `FunctionValue` branch (`utils.ts:92`) sets the provenance
on each leaf from `obj.name`. **`fnName` is distinct from `subProperty`** — B10
found `subProperty` already conflates property-name with function-name semantics
(`setSubProperty` is overloaded across the container mirrors), so it cannot carry
this; a dedicated home is the only clean carrier. The **flatLeaf-first value
model** (the radical V2 framing): make the provenance-carrying leaf the canonical
parsed shape so `flattenObject` is a *projection*, not a tree-dissolve that drops
the name — which **dissolves the entire kf S8 sidechannel class intrinsically**
(VJ-L1 becomes the model, not an add-on).

**The kf consume-seam (inherited O.W16, GATED).** On the value.js-P re-pin, kf's
`utils.ts`:
- deletes `FN_NAME` / `NamedValueUnit` / `stampFnName` (`:45-57`),
- rewrites `fnNameOf(u)` to `u.fnName` (the public field) (`:50-51`),
- drops the re-stamp on every `clone()` (`:64`, `:289-294`) — `clone()` carries it,
- the identity-pad (`:341-363`) reads `counterLeaf.fnName` directly.

**The proof arm.** `proof:workaround-deletion`'s **S8** row currently reports
`S8 PENDING — value.js 1.0.x is published but its VJ-L1 flatLeaf provenance API
has NOT landed` (its `apiPresent` guard probes the live API: `"fnName" in new
ValueUnit(0)` is `false` today). When value.js P ships, `apiPresent` flips, kf
executes the delete, S8 flips PENDING→GREEN. The **REAL observable** (not a
`typeof` proxy): a flattened `scale(2)` leaf carries `.fnName === "scale"` after a
`.clone()` round-trip — value.js's own API, not a kf Symbol — and the identity pad
still resolves `scale → 1` for an absent counterpart (the MCI-5 behaviour
preserved across the seam swap).

---

## VJ-L3 — the `parseCSSSubValue` helper (the kf-S9 root fix — inherited, with the V4 truncation guard)

**The kf need, grounded.** kf's `tryParseLeaves` (`kf utils.ts:222-251`) parses a
single CSS sub-value string (`"scale(2) rotate(45deg)"`, a `translateX` value, a
color) into value.js's `ValueUnit | ValueArray | FunctionValue` tree. To do so it
reaches **directly into `@mkbabb/parse-that`** for the `any` combinator and
hand-composes value.js's own internal parsers:

```ts
// kf src/animation/utils.ts:1, :229-236 (today — the S9 violation)
import { any as parseAny } from "@mkbabb/parse-that";
const fnArgs = (CSSFunction.FunctionArgs as any).map(...);          // :229 cross-realm cast
const p = tryParse((parseAny as any)(fnArgs, CSSValues.Value), strValue); // :236 cross-realm cast
```

The `as any` casts exist because **value.js and kf each ship their own
`@mkbabb/parse-that` realm** under separate `node_modules` — the `Parser<T>`
classes are nominally distinct to TypeScript though byte-identical at runtime.
This is a constellation-spine breach (B10/B11): kf should consume value.js's
grammar through a value.js door, never reach around it into value.js's own parser
dependency. It also carries `@mkbabb/parse-that` as a kf **production dep**
(`package.json:215`) solely for this one combinator.

**The proposed value.js API (BC-additive) — the V4 truncation guard is load-bearing.**

```ts
// value.js root export
export function parseCSSSubValue(
    value: string,
    opts?: { subProperty?: string },
): ValueUnit | ValueArray | FunctionValue;
```

**CRITICAL (V4 `[HIGH·correctness]`):** VJ-L3 **MUST internalize the exact
`tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` composition with
`FunctionArgs` FIRST** — it must **NOT** delegate to the shipped `parseCSSValue`
(= `tryParse(ValuesValue)`). The V4 probe proved `parseCSSValue("scale(2)
rotate(45deg)")` parses only the FIRST sub-value (yields `scaleX/Y/Z(2)`,
**truncating `rotate`**), whereas kf's `FunctionArgs`-first composition parses the
full list. The ordering is itself load-bearing: `FunctionArgs`-first always wraps
in a `ValueArray` (even for bare `"10px"`), which is exactly what kf's
`flattenToValueUnits` consumes. The optional `subProperty` threads the property
context (kf today calls `v.setSubProperty(childKey)` on the `FunctionArgs` before
parsing, `kf utils.ts:230` — value.js does this internally). value.js already owns
every piece (`parsing/index.ts` `CSSFunction`/`CSSValues`/`any`); this ASK is a
thin, named, public wrapper over its existing internals — same-realm, so no
`as any` is needed.

**The kf consume-seam (inherited O.W16) — one atomic commit.** On the re-pin:
- delete `import { any as parseAny } from "@mkbabb/parse-that"` (`kf utils.ts:1`),
- replace the `tryParseLeaves` body (`:229-236`) with
  `parseCSSSubValue(strValue, { subProperty: childKey })`,
- remove `@mkbabb/parse-that` from `package.json:215` (one fewer production dep),
- both cross-realm `as any` casts vanish (the realm is now value.js-internal).

**The proof arms — two gates green together.**
1. `proof:workaround-deletion`'s **S9** row (`S9 PENDING — value.js O shipped
   VJ-L2 only — held until VJ-L3 parseCSSSubValue helper ships`) flips when
   `apiPresent` sees `typeof vj.parseCSSSubValue === "function"` and the import is
   gone.
2. The new `proof:boundary` **W96** parse-that-scan (named since L.W9, **never
   implemented**): O.W16 authors it to scan **all** `src/animation/**` modules
   for any `from "@mkbabb/parse-that"` specifier and assert **zero**. **Born-RED
   today** (`kf utils.ts:1` is the live violator); GREEN exactly when S9 deletes
   the import — a structural guard so S9 cannot silently recur.

The **REAL observable** (the V4 mandate): the gate runs `parseCSSSubValue` from
the published value.js barrel over the **MULTI-function input**
`"scale(2) rotate(45deg)"` (or `"translateX(10px) translateY(20px)"`) and asserts
the FULL `ValueArray` — NOT a single-function input a truncating delegation would
pass — matching kf's hand-rolled composition exactly. A `typeof` proxy is
insufficient; the round-trip equality over a multi-function string is the gate.

---

## VJ-P1 — `color2Into` out-param (the deferred O.W3/O.W5 alloc tail — the campaign §5 headline)

**The need, grounded.** value.js's gamut hot path still allocates **~84 Color
objects/call** (V1, V5): O.W3 only got 104→84, and the `color2Into` out-param
that closes it is **explicitly DEFERRED** at `color/dispatch.ts:245`
(`'eliminating it requires a color2Into out-param (deferred, O.W5 scope)'`). The
residual allocations are the per-step `color2(probe, target)` XYZ-hub conversion
intermediates inside the 24-step `gamutMapToRgbSpace` bisection loop
(`dispatch.ts:257`). This is the single largest remaining GC win on the rAF
**wide-gamut egress** path (P3/rec2020 color animation), and the matrix layer one
level down **already proves the scratch pattern** (`matrix.ts` `transformMat3Into`).

**The mechanism is already half-built.** The gamut math is **already tuple-based**
and allocation-free: `gamut.ts:247` `gamutMapOKLab`, `:283` `srgbToOKLab`, `:307`
`oklabToLinearSRGB` all return `[number, number, number]`. The waste is the
**wrapper**: `color2()` (`dispatch.ts:164`) boxes each tuple in a fresh `Color`.
The ASK: add `color2Into(src, to, out)` that writes `r/g/b` (or `l/c/h`) into a
reused `out` Color, and route `gamutMapToRgbSpace`'s 24-step loop through a
module-scoped egress scratch. Re-entrancy-safe (the single-threaded argument is
already documented + accepted at `dispatch.ts:226-228`).

**The kf payoff (no kf delete — an inherited perf win).** kf's rAF color
interpolation rides value.js's egress path; `color2Into` collapses ~84 → <12
allocs/call, cutting per-frame GC pressure for wide-gamut color animation across
the whole engine. kf consumes the faster value.js transparently (no API change to
the kf consume-edge).

**Born-RED gate (value.js-side — the gate already exists, just tighten N_TARGET).**
The `proof:gamut-alloc` gate (`value.js/scripts/proof-gamut-alloc.mjs`) already
instruments Color-constructor calls over a display-p3 egress animation. RED today:
`N_TARGET = 90`, residual ~84. The ASK tightens `N_TARGET` **90 → 15** over the
BUILT `dist/subpaths/color.js`. Born-RED via the existing instrumentation:
revert `color2Into` → the loop re-allocates → ≥84 → the tightened gate reds.
**TEMPTING-BUT-WRONG (the V1 guard):** do NOT mutate the input Color in place — the
out-param must be a CALLER-OWNED scratch, never the source (aliasing would corrupt
the bisection probe).

---

## VJ-P2 — typed Float64 channel view (kill string-keyed megamorphic channel reads)

**The need, grounded.** `Color<T>` keeps a `[key: string]: any` index signature
(`color/index.ts:286`) for its public dynamic shape — KEEP-documented (`:211`).
But the per-frame color interp (`interpolate.ts` `lerpColorValue`) and the
conversion converters read `color[k]` through that dynamic signature, driving
**megamorphic property reads** in the hottest loops (V1-N3, V2). V8 cannot
monomorphize a string-keyed read on a class with an index signature.

**The mechanism (SoA-adjacent without breaking the public AoS shape).** Give each
`Color` an optional packed `_ch: Float64Array` (r,g,b,alpha) **lazily
materialized**, and have `lerpColorValue` + the conversion converters read/write
`_ch[i]` instead of `color[k]`. The named fields stay (the `[key:string]:any`
public shape is preserved); the typed view is **strictly internal** to the
interp/conversion loops. **TEMPTING-BUT-WRONG (V1 guard):** do NOT replace the
named fields — the index signature is KEEP-documented public surface; this is an
additive internal fast-path, not a shape change.

**The kf payoff (no kf delete).** kf's per-frame color interpolation
(`engine.ts` → value.js `lerpColorValue`) inherits the monomorphic typed-array
read path — faster color animation with zero kf-side change. Sequence this
**AFTER VJ-P1** (V1 rec) so the new internal scratch Colors from `color2Into`
inherit the packed view from birth.

**Born-RED gate.** `proof:perf-target` color-channel-access clause (over
`value.js/bench/color-channel-access.mjs` + `color-interp.mjs`, which exist):
assert the Float64-view interp throughput ≥ the named-field baseline. Born-RED:
the bench runs against the un-viewed path today → no improvement → the asserting
clause reds until the view lands. Portable (a ratio bench, not an absolute ms
threshold — the device-dependence lesson).

---

## VJ-P3 — narrow the `: any` property/subProperty seam → `string` (the strict-mode precept)

**The need, grounded.** `ValueUnit.setSubProperty(subProperty: any)`
(`units/index.ts:57`) and `setProperty(property: any)` (`:61`) — and the container
mirrors at `:174,178` (`ValueArray`) and `:274,278` (`FunctionValue`) — type their
params `any`. Every caller already passes a string; the `any` is unnecessary
slack on a strict-mode (`strict: true`) library and the **single most-traversed
kf consume seam** (kf's `parseAndFlattenObject` sets both `property` AND
`subProperty` on every ValueUnit — `MEMORY.md` calc/computed pipeline). The
campaign §5 lists this as the `: any` property/subProperty seam → `string`
[precept] correction.

**The mechanism (BC — callers already conform).** Type the four signatures
`string` (or `string | undefined` to match the optional ctor fields). No runtime
change; the public surface narrows from `any` to `string`. The kf consume-edge
gains a type-checked seam — a `vu.setSubProperty(42)` becomes a `tsc` error, not a
silent coercion.

**The kf payoff (strengthens, no delete).** kf's frame-pairing (sets `property` +
`subProperty` for `getComputedValue` DOM resolution) type-checks at the seam.
Sequence as a 1.2.0 precept-correction (low-risk, additive-to-strictness).

**Born-RED gate (value.js-side, `proof:any-seam`).** A type-fixture: `tsc`
rejects `new ValueUnit(1,'px').setSubProperty(42)` (a `number`). Born-RED:
today the `any` param accepts it (the fixture compiles clean — RED, the gate
WANTS a compile error); GREEN when the param is `string` and `tsc` errors.

---

## VJ-P4 — the CODEGEN-CONSUME (value.js generates its CSS parser from `css/l4/*.bbnf` — the campaign §4 SPINE)

**The need, grounded — the `.bbnf` "not wired" limbo.** value.js carries two BBNF
grammars — `parsing/grammars/css-values.bbnf` and `css-color.bbnf` — that
explicitly say **`not yet wired to the runtime`** (`css-values.bbnf:6`). They are
spec-only documentation; the **hand-written ~700-line combinator table**
(`parsing/index.ts:14,29,63` — the `transformFunctions`/`transformDimensions`/
`gradientNames` arms) is the real source of truth. The two silently drift (V2
novelIdea #4: "a unit added to the grammar is not added to the parser"). This is a
**codegen-or-delete fork** the audit flagged across four lanes (V1-N2, P1, P4, X2).

**The mechanism (the campaign §4 spine — parse-that B → value.js P).** parse-that
Tranche B ships `@mkbabb/parse-that/codegen` (the SpanParser-tree-walk / **bbnf-lang
`TsEmitter`** edge — bbnf-lang EXISTS at `/Users/mkbabb/Programming/bbnf-lang`
with a `CompileTarget::Ts` emitter + `css/l4/*.bbnf` grammars + parity tests, so
this is **wiring, not greenfield**). value.js's 1.2.0 codegen-consume:

1. emit, at **BUILD TIME**, ONE specialized straight-line `charCodeAt` scanner per
   grammar from `css-values.bbnf` / `css-color.bbnf` — no closures, no `callSpan`
   recursion, every call site monomorphic by construction;
2. replace the ~700 lines of hand-maintained combinators with the generated
   parser (**the spec becomes the parser**; the "not wired" limbo resolves);
3. keyframes inherits faster frame-compilation for free.

This re-wires the DEAD O.W6 SpanParser-jump-table consume edge into a **LIVE
codegen edge** — the surviving form of the §7 falsified thesis.

**THE FALSIFICATION GUARD (born-RED on every codegen idea — DO NOT re-litigate).**
A.W3 falsified the SpanParser tagged-union as a *runtime* recursive switch
(~10–14% slower on V8 — V8 monomorphic-inlines per-site closures better than a
hand-rolled dispatch loop). **Codegen sidesteps this entirely** by emitting
build-time straight-line source, NOT a runtime interpreter. The gate must assert
the emitter produces STRAIGHT-LINE source, **never a runtime interpreter dressed
as a generated function**. (This is also why VJ-P4 is GATED on parse-that B's
`@mkbabb/parse-that/codegen` shipping the emitter — kf's P.W4 codegen-consume
sits one layer further down the same DAG edge.)

**The kf payoff (no kf delete — an inherited compile-perf win + kf's own P.W4).**
kf's `FrameCompiler` rides value.js's CSS-value parse on every `addFrame`; the
generated monomorphic scanner cuts frame-compilation cost. kf's **P.W4
codegen-consume** (kf Band B, GATED) is the kf-side terminal of the same edge.

**Born-RED gate (value.js-side, `proof:grammar-parity` + a throughput bench).**
- **Parity:** for **every** unit in `value.js/src/constants.ts UNITS`, assert the
  `.bbnf`-generated parser and the live hand-written parser produce
  byte-identical `ValueUnit`/`FunctionValue` trees over a corpus. Born-RED: no
  generated parser exists today (the `.bbnf` is "not wired") → the parity harness
  has nothing to compare → RED until the codegen edge lands.
- **Throughput:** a bench (`css-parse-perf.mjs`) running the CODEGEN parser over
  the value corpus, gated in `proof:perf-target` to close the documented **0.58×
  BBNF-vs-hand-rolled gap toward ≥0.85×**, measured portable (the ratio-bench
  device-independence discipline).
- **The falsification guard clause:** the gate fails if the emitted parser is a
  runtime dispatch loop (assert: zero `switch (kind)` / `callSpan`-shaped
  recursion in the generated source) — guarding against re-running the A.W3
  falsified play.

---

## INFORM (what value.js Tranche P must know — the DAG, the early-cure, the version split)

1. **The DAG — value.js P sequences AFTER parse-that B, BEFORE keyframes P.**

   ```
   parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
     (0.12.0 codegen)         (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
           │                         │                            │
           └── the CODEGEN SPINE ────┴──── generated parser ──────┘
   ```

   The hard edge: VJ-P4 (the codegen-consume) is **GATED on parse-that B** shipping
   `@mkbabb/parse-that/codegen` (the bbnf-lang `TsEmitter` edge). The 1.1.0 API pair
   (VJ-L1 + VJ-L3) has **no parse-that dependency** — it can ship the moment value.js
   P opens, unblocking kf immediately. The 1.2.0 perf quartet rides after (VJ-P1/P2/P3
   are kf-internal-to-value.js with no sibling gate; **only VJ-P4 waits on parse-that B**).

2. **The VJ-L1 WeakMap early-cure kf is doing NOW (so kf O.W7 is not hard-blocked).**
   kf's `engine.ts` god-object split (O.W7, 1397→~900) is VJ-L1-gated — it sequences
   AFTER value.js P ships `flatLeaf` (which dissolves the S8 `FN_NAME` sidechannel
   threaded through the flatten/parse seam O.W7 must relocate). To avoid a hard block
   if value.js P slips, **kf is shipping P.W11 NOW**: a kf-internal
   `WeakMap<ValueUnit, string>` `FN_NAME` carrier populated at flatten time — the
   X4-radical / P-inv-28-chronicity-3 early exit that lifts O.W7's VJ-L1 gate **without
   waiting for value.js P**.

   **What this means for value.js P:** the WeakMap early-cure is value.js-realm-clean
   (no foreign-object annotation — it dissolves the B10/B11 inv-L-acyclic-purity
   breach) **BUT a WeakMap key is the `ValueUnit` instance, so it does NOT survive
   `ValueUnit.clone()`** — the clone-restamp ceremony (`kf utils.ts:64,289-294`)
   **stays**. **VJ-L1 is therefore still strictly preferred**: it carries `fnName` as
   a real ctor field that `clone()` preserves, eliminating the restamp ceremony
   entirely. The WeakMap is the *kf-side accelerant* (unblocks O.W7 now); **VJ-L1 is
   the *intended terminal*** (eliminates the ceremony). value.js P shipping VJ-L1 lets
   kf retire BOTH the Symbol (S8) AND the WeakMap fallback in one consume.

3. **The version split — 1.1.0 (API) then 1.2.0 (perf).**

   | value.js publish | contents | gates kf consume | blocked on |
   |---|---|---|---|
   | **1.1.0** | VJ-L1 `flatLeaf` + VJ-L3 `parseCSSSubValue` (BC-additive, ~10+15 LoC) | kf O.W16 S8/S9 delete + W96 boundary scan | nothing (no parse-that dep) — the kf-unblock |
   | **1.2.0** | VJ-P1 `color2Into` + VJ-P2 Float64 channel view + VJ-P3 `: any`→string + VJ-P4 codegen-consume | kf inherits perf (no kf-side delete); kf P.W4 codegen-consume (GATED) | VJ-P4 GATED on parse-that B `@mkbabb/parse-that/codegen` |

   P.W0 (commit O docs + reconcile PROGRESS) is the **first action**, predating both
   publishes. The 1.1.0 pair is the critical-path kf-unblock; the 1.2.0 quartet is the
   optimization frontier and is non-breaking (kf rides it transparently except for the
   GATED P.W4 codegen edge).

4. **The P-invariant-28 belt window (DM-5 → chronicity 4 at kf-P if P slips).** The
   S8/S9 value.js-workaround chronic (DM-5) is at **chronicity 3** entering kf-P;
   P-inv-28's mandatory-exit belt fires at **chronicity ≥4**. The named terminals:
   - **VJ-L1/VJ-L3 (the intended exit):** value.js P ships both before kf-P closes →
     S8/S9 dissolve cleanly (no WeakMap, no parse-that dep).
   - **(a) the WeakMap early-cure (kf-internal, P.W11):** unblocks O.W7 NOW but leaves
     the clone-restamp ceremony — kf-internal-sufficient, VJ-L1 still preferred.
   - **(b) S9 declared-edge quarantine (last-resort):** if VJ-L3 does not ship, the
     parse-that import is NOT eliminable kf-internally (kf needs value.js's CSS
     sub-value grammar, no substitute) — the fallback is a DECLARED W96 allow-list with
     a comment citing the unshipped VJ-L3, making the breach non-silent. Strictly
     inferior to VJ-L3.

   **The tripwire (the consume signal).** kf's `proof:workaround-deletion` `apiPresent`
   guard is the live oracle: S8 exits PENDING when `"fnName" in new ValueUnit(0)` is
   `true`; S9 exits PENDING when `typeof require("@mkbabb/value.js").parseCSSSubValue
   === "function"`. Both transition false→true on the value.js P publish — no manual
   coordination, the gate reads the installed surface.

---

## The pin/version state at this dispatch

| Package | Published | kf pins | kf re-pin on the P publish |
|---------|-----------|---------|-----------------------------|
| `@mkbabb/parse-that` | 0.11.0 | `^0.11.0` (production dep, **S9** — for the `any` combinator only) | **DROPPED** from `dependencies` once VJ-L3 lands |
| `@mkbabb/value.js` | **1.0.2** | `^1.0.2` | `^1.1.0` (the VJ-L1/VJ-L3 publish) at O.W16; `^1.2.0` (the perf frontier) at P Band B/P.W4 |

VJ-L2 (the `linear()` space-joined serializer) shipped in value.js O and is
**already consumed** (kf S7 GREEN). VJ-L1 and VJ-L3 are the **remaining two** of
the three L.W9-anticipated asks — inherited from the O dispatch unchanged; VJ-P1–P4
are the **new P optimization frontier** this packet adds.

---

## Net actions

**value.js Tranche P (the sibling — to author in value.js's tree, never from kf):**
1. **P.W0 (FIRST):** `git add docs/tranches/O/` (commit the uncommitted O docs);
   reconcile `O/PROGRESS.md` header `DEVELOPMENT — charter only` → CLOSED-as-built
   (record honesty); fold the `index.ts:169-171` O(N²) `setSubProperty` one-liner.
2. **1.1.0 — the kf-unblock (no parse-that dep, ships first):**
   - **VJ-L1** — the `fnName` provenance carrier on `ValueUnit` (field or meta-record
     per V2/V4), preserved by `clone()`, populated by `flattenObject` from
     `FunctionValue.name`. BC-additive (~10 LoC).
   - **VJ-L3** — `parseCSSSubValue(value, opts?)` wrapping
     `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` —
     **FunctionArgs-FIRST** (the V4 truncation guard). BC-additive (~15 LoC).
3. **1.2.0 — the perf frontier (rides after):**
   - **VJ-P1** `color2Into` out-param (gamut ~84 → <12 allocs/call).
   - **VJ-P2** the typed Float64 channel view (kill megamorphic channel reads).
   - **VJ-P3** narrow the `: any` property/subProperty seam → `string`.
   - **VJ-P4** the CODEGEN-CONSUME (generate the CSS parser from `css/l4/*.bbnf` over
     parse-that B's `@mkbabb/parse-that/codegen` — GATED on parse-that B).

**keyframes.js (on the value.js publishes — the GATED consumes):**
1. **On 1.1.0 (O.W16, inherited):** re-pin `^1.1.0`; delete S8 (the `FN_NAME`
   Symbol + helpers; rewrite `fnNameOf` → `.fnName`) AND retire the P.W11 WeakMap
   fallback; delete S9 (the parse-that import + the two `as any` casts; call
   `parseCSSSubValue`); drop `@mkbabb/parse-that` from `package.json`; author + green
   the `proof:boundary` **W96** parse-that-scan; confirm `proof:workaround-deletion`
   S8/S9 flip PENDING→GREEN; unblock O.W7.
2. **On 1.2.0 (P Band B/P.W4):** re-pin `^1.2.0`; inherit the perf wins
   transparently (VJ-P1/P2/P3 — no kf-side delete); execute kf P.W4 codegen-consume
   (GATED on parse-that B + value.js VJ-P4).

**The contract.** value.js publishes; kf re-pins and deletes. Neither writes the
other's tree (inv-16). The gate roster — `proof:workaround-deletion` apiPresent +
the new W96 scan (1.1.0) + the inherited-perf benches (1.2.0) — is the binding
oracle. The consume fires when the installed value.js surface carries the APIs,
observed at runtime, not asserted by coordination.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT dispatch packet — **DOCS ONLY**. It writes
zero value.js source (inv-16: kf writes only keyframes.js; every cross-repo need
is a *dispatch*, never a foreign-tree edit). value.js's P session implements the
ASKs in value.js's own tree; kf re-pins and deletes its workarounds on each
publish. Every ASK carries a **falsifiable born-RED gate** (the API asks: an
`apiPresent` runtime probe over the published surface, RED today, GREEN on the
publish; the perf asks: a PORTABLE ratio bench, RED on today's allocation/read
profile, GREEN on the optimization; the codegen ask: a parity + throughput bench
guarded against the A.W3 runtime-dispatch falsification). Implementation opens
only on the owner's explicit go, per-repo, DAG-ordered (parse-that B → value.js P
→ keyframes P). observable-truth, no-legacy, gestalt, P-inv-28 hold throughout.
