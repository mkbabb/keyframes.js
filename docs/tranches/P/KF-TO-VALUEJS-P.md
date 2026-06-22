# keyframes.js → value.js Tranche P — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-20 at the keyframes **Tranche P** development phase (the
> Constellation Optimization Campaign — `P/CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`).
> This **supersedes and extends** the O dispatch (`docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md`):
> O carried the two **API** asks (VJ-L1 `flatLeaf` + VJ-L3 `parseCSSSubValue`)
> that value.js O **deferred**. Under the CONTRIVANCE-AUDIT (`P/CONTRIVANCE-AUDIT.md`)
> reformulation this dispatch is **trimmed to the grounded in-realm core**: VJ-L3
> `parseCSSSubValue` (a real cross-realm breach kf cannot self-solve) is the surviving
> API ask; VJ-L1 `flatLeaf` is **DEMOTED-TO-SPIKE** (kf's P.W11 realm-clean WeakMap is
> the terminal S8 cure — VJ-L1's only residual is retiring the clone-restamp ceremony,
> a nice-to-have re-opened on a measured need); and the perf frontier narrows to the
> grounded `color2Into` gamut zero-alloc tail (VJ-P1) + the `: any` property/subProperty
> seam narrowing (VJ-P3). **The typed Float64 channel view (VJ-P2) is DROPPED** — its
> premises are falsified by shipped value.js (the string-keyed read it claimed to cure is
> already routed around).
> value.js is the UPSTREAM library on the constellation spine
> (parse-that → value.js → keyframes.js → glass-ui); this is the formal handoff
> to value.js's **Tranche P** session.
>
> **inv-16 holds: no value.js source is written from keyframes.js.** value.js's P
> session schedules these ASKs into its own waves; kf re-pins and deletes its
> workarounds on the publish. Publish-then-re-pin, never cross-write. The proven
> O fence pattern (kf authored the dispatch, value.js's session implements).

This dispatch is the binding cross-repo contract behind kf wave **P.W11**
(the realm-clean WeakMap that is the TERMINAL S8 cure — in-realm, no sibling
API needed) and the inherited **O.W16** (the GATED S9 delete on the publish).
**O.W7's engine-seam split is NOT VJ-L1-gated** — it is executable NOW on the
current tree; the file-split itself (and the P.W11 WeakMap) makes the flatten/parse
seam in-realm, so VJ-L1 is not a precondition for it. The version split: value.js
**1.1.0** (API — VJ-L3 `parseCSSSubValue`, BC-additive, the surviving kf-unblock;
VJ-L1 demoted-to-spike) **then 1.2.0** (perf — the `color2Into` allocation tail +
the `: any` seam narrowing, non-breaking). value.js P sequences **BEFORE
keyframes P** (the consumer).

---

## The ASK roster

| # | ASK | value.js file:line (grounded) | proposed API / mechanism | kf consume-seam it dissolves | born-RED gate | ver |
|---|-----|-------------------------------|---------------------------|------------------------------|---------------|-----|
| **VJ-P.W0** | **commit the uncommitted O docs + reconcile the stale PROGRESS** to CLOSED-as-built | `value.js/docs/tranches/O/` is **untracked** (`git status` → `?? docs/tranches/O/`); `O/PROGRESS.md:1-3` reads `DEVELOPMENT — charter only` on a fully-executed tranche (1.0.2 on master) | `git add docs/tranches/O/` + rewrite the PROGRESS header to **CLOSED** with per-wave SHIPPED status (record-as-built honesty) | n/a (value.js record hygiene; constellation-truth precondition) | `proof:progress-honesty` (value.js-side): the PROGRESS header is not `DEVELOPMENT — charter only` while master serves ≥1.0.0 | — |
| **VJ-L1** *(DEMOTE-TO-SPIKE)* | **`flatLeaf` provenance** — `FunctionValue.name` survives `flattenObject` + `clone()` as a typed field. **NOT the terminal S8 cure** (P.W11's realm-clean WeakMap is); residual payoff = retire the clone-restamp ceremony only | `units/index.ts:26-31` (6-positional ctor, NO `fnName`); `:120` `clone()`; `utils.ts:85,92` `flattenObject` `FunctionValue` branch | optional `fnName?: string` (or a `meta` record) on `ValueUnit`, copied by `clone()`, populated by `flattenObject` from the enclosing `FunctionValue.name` — **re-opened only on a measured need** | **(no kf delete required)** — P.W11 WeakMap closes S8 in-realm; VJ-L1 would additionally retire the `utils.ts:64,289-294` restamp ceremony | spike-gated (re-open on a measured need); NOT the O.W7 unblocker | spike |
| **VJ-L3** | **`parseCSSSubValue` root helper** — typed re-entry parser internalizing `any(CSSFunction.FunctionArgs, CSSValues.Value)` | `parsing/index.ts:1` (`any` from parse-that); `parseCSSSubValue` ABSENT (`grep` → ZERO) | `parseCSSSubValue(value, opts?)` root export wrapping the **FunctionArgs-FIRST** composition (the V4 truncation trap) | **S9** — the direct `@mkbabb/parse-that` import + 2 `as any` casts + the production dep (`kf utils.ts:1,229,236`) | `proof:workaround-deletion` **S9** + the new `proof:boundary` **W96** parse-that-scan | **1.1.0** |
| **VJ-P1** | **`color2Into` out-param** — gamut bisection writes channels into a caller-owned scratch `Color` | `color/dispatch.ts:245` (`'eliminating it requires a color2Into out-param (deferred, O.W5 scope)'`); `:257` `color2(probe, target)` in the 24-step loop; `gamut.ts:247,283,307` already tuple-based | `color2Into(src, to, out)` mirroring `matrix.ts` `transformMat3Into` scratch — `gamutMapToRgbSpace` reuses one egress scratch | **(no kf delete)** — kf inherits the GC win on the rAF wide-gamut egress (faster `lerpColorValue`) | `proof:gamut-alloc` set to the MEASURED post-cure residual + a small margin (run the existing `proof-gamut-alloc.mjs` over the `color2Into` branch; not a guessed `≤15`) | **1.2.0** |
| **VJ-P3** | **narrow the `: any` property/subProperty seam → `string`** (strict-mode invariant) | `units/index.ts:57` `setSubProperty(subProperty: any)`; `:61` `setProperty(property: any)`; `:174,178,274,278` (the container mirrors) | type the params `string` (BC — callers already pass strings); the kf consume-edge gains a typed seam | **(strengthens)** — kf's `parseAndFlattenObject` `setSubProperty`/`setProperty` calls type-check (`MEMORY.md` calc/computed pipeline) | the existing repo-wide `tsc` strict build catches regressions (no bespoke `proof:any-seam` gate needed) | **1.2.0** |

All surviving ASKs are **BC-additive** to value.js's published 1.x surface (no
breaking change). The 1.1.0 ask (VJ-L3) is the surviving kf-unblock; the 1.2.0 pair
(VJ-P1 + VJ-P3) is the grounded optimization frontier and rides after. **VJ-L1 is
demoted-to-spike** (a measured-need re-open, not a binding ask); **VJ-P2 is dropped**
(falsified premises — see below).

**The two namespaces (distinct by design).** The **VJ-L\*** asks are the **API**
asks — VJ-L3 (`parseCSSSubValue`), the surviving binding ask; VJ-L1 (`flatLeaf`/`fnName`
provenance) is **DEMOTED-TO-SPIKE** (P.W11's WeakMap is the terminal S8 cure, so VJ-L1
is a residual ceremony-retirement nicety, not a precondition for anything). The
**VJ-P\*** asks are the **perf** frontier — VJ-P1 (`color2Into` out-param) + VJ-P3
(the `: any`→string seam narrowing). `color2Into` is **VJ-P1** (NOT "VJ-L4"); it
belongs to the VJ-P perf namespace, never the VJ-L API namespace.

**VJ-P2 (typed Float64 channel view) is DROPPED.** The CONTRIVANCE-AUDIT found its
premises are falsified by shipped value.js: the string-keyed megamorphic read it
claimed to cure is **already routed around** in the shipped interpolate path. If a
residual read is ever *suspected* on a measured bottleneck, the in-realm move is
**widening value.js's own `interpolate.ts buildColorChannels`**, NOT a new public
`Color._ch` shape addition. No new public Color surface is sanctioned.

---

## VJ-P.W0 — commit the O docs + reconcile the stale PROGRESS (the FIRST value.js-P action)

> **Wave-naming note (P.W0 disambiguation).** This is **VJ-P.W0** — value.js
> Tranche P's first (record-hygiene) wave. It is NOT a kf wave: **there is NO kf
> P.W0** — the kf P-wave roster starts at **P.W1**. The `VJ-` prefix keeps
> value.js's first wave from colliding with the kf P-wave namespace.

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
"record-as-built honesty" precept forbids. VJ-P.W0 is the precondition for every
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

## VJ-L1 — the `flatLeaf` provenance API (DEMOTE-TO-SPIKE — NOT the S8 terminal, NOT the O.W7 unblocker)

> **CONTRIVANCE-AUDIT reformulation (2026-06-22).** VJ-L1 is **demoted-to-spike**.
> kf's **P.W11 realm-clean WeakMap is the TERMINAL S8 cure** — in-realm, no sibling
> API needed (it dissolves the B10/B11 foreign-object-annotation breach without
> waiting on value.js). VJ-L1's **only residual payoff** is retiring the 5-line
> clone-restamp ceremony (`utils.ts:64,289-294`) — a nice-to-have, **NOT the O.W7
> unblocker** (O.W7's split is executable NOW; the WeakMap and the file-split itself
> make the seam in-realm). VJ-L1 is therefore **re-opened only on a measured need**;
> the prose below records the original ask shape for that contingent re-open.

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

**The proposed value.js API — the COMMITTED path is the CONSERVATIVE gated form.**
VJ-L1's committed ask is **purely additive**: value.js adds an **additive `fnName`
field** to `ValueUnit` (preserved by `clone()`, populated by `flattenObject` from
the enclosing `FunctionValue.name`), and **`FunctionValue` STAYS the serialize
source-of-truth** — the flatten leaf is a *provenance carrier*, NOT a re-rooting of
the value model. The V2/V4 transposition note flagged that the `ValueUnit` ctor is
**already 6 positional optionals** (`units/index.ts:26-31`) and `clone()`/`coalesce()`
re-thread all by index — bolting a 7th positional `fnName` makes `clone()` pass
`undefined` for `targets` to reach it (the V4 wart). value.js P has two equally-valid
*additive* shapes for WHERE `fnName` lives; **kf consumes whichever value.js
publishes** and adapts `fnNameOf` to read it:

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
this; a dedicated home is the only clean carrier.

**The RADICAL "make flat leaf canonical" reshape is DEMOTED to a SPIKE-GATED
investigation (NOT the committed ask).** The V2-radical framing — make the
provenance-carrying leaf the canonical parsed shape so `flattenObject` becomes a
*projection* rather than a tree-dissolve, dissolving the kf S8 sidechannel class
intrinsically — would re-root value.js's value model and **displace `FunctionValue`
as the serialize source-of-truth**. That is a breaking re-architecture, not a
BC-additive field, and value.js P does **NOT** commit it. It is a SPIKE-GATED
investigation with a hard **precondition**: a **`FunctionValue.toString` round-trip
corpus** must prove that a canonical-flat-leaf model re-serializes every
`FunctionValue` (`scale(2) rotate(45deg)`, nested `calc()`, multi-arg gradients)
byte-identically to the current `FunctionValue`-rooted `toString` — BEFORE any
reshape is authorized. Absent that corpus + a GREEN round-trip, the **conservative
additive `fnName`** is the only sanctioned form.

**The S8 terminal is P.W11 (in-realm), NOT this dispatch.** S8 closes the moment
kf swaps the `Symbol("kf.fnName")` for a kf-local `WeakMap<ValueUnit, string>`
(P.W11, gated `proof:no-foreign-symbol-stamp`) — no value.js publish required. The
WeakMap keeps the same `fnNameOf`/`stampFnName` API but stores the provenance
off-realm-object, dissolving the foreign-annotation breach. The clone-restamp
ceremony (`utils.ts:64,289-294`) **stays** under the WeakMap (a WeakMap key is the
`ValueUnit` instance, which does not survive `clone()`).

**The contingent VJ-L1 consume-seam (only if VJ-L1 is later spiked + shipped).** If a
measured need re-opens VJ-L1 and value.js ships an additive `fnName` field, kf would
additionally:
- rewrite the WeakMap `fnNameOf(u)` to `u.fnName` (the public field),
- drop the re-stamp on every `clone()` (`:64`, `:289-294`) — `clone()` carries it,
- the identity-pad (`:341-363`) reads `counterLeaf.fnName` directly.
This is the **ceremony-retirement nicety** — strictly additive to the P.W11 terminal,
never a precondition for it.

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

**Born-RED gate (value.js-side — the gate already exists; set N_TARGET to the MEASURED
residual, not a guessed `15`).** The `proof:gamut-alloc` gate
(`value.js/scripts/proof-gamut-alloc.mjs`) already instruments Color-constructor calls
over a display-p3 egress animation. RED today: `N_TARGET = 90`, residual ~84. Per the
CONTRIVANCE-AUDIT (MEASURE-FIRST), the ASK sets `N_TARGET` to the **MEASURED post-cure
residual + a small margin** — captured by running the existing `proof-gamut-alloc.mjs`
instrumentation over the BUILT `color2Into` branch, NOT a guessed `≤15` floor. Born-RED
via the existing instrumentation: revert `color2Into` → the loop re-allocates → ≥84 →
the measured-target gate reds. **TEMPTING-BUT-WRONG (the V1 guard):** do NOT mutate the
input Color in place — the out-param must be a CALLER-OWNED scratch, never the source
(aliasing would corrupt the bisection probe).

---

## VJ-P2 — typed Float64 channel view — **DROPPED (CONTRIVANCE-AUDIT, 2026-06-22)**

> **VJ-P2 is DROPPED, not dispatched.** The CONTRIVANCE-AUDIT (`P/CONTRIVANCE-AUDIT.md`)
> found its premises **falsified by shipped value.js**: the string-keyed megamorphic
> `[key:string]:any` channel read it claimed to cure is **already routed around** in
> the shipped `interpolate.ts` path. The justification (V8 cannot monomorphize the
> read) no longer holds against the live tree. There is therefore no measured
> bottleneck, and a new public `Color._ch` Float64Array shape would be speculative
> surface against a non-default, non-real path (smell-test Q1/Q2/Q3 fail).
>
> **The contingent in-realm move (NOT this ask).** If a residual megamorphic read is
> ever *suspected* on a measured bottleneck, the cure is **widening value.js's own
> `interpolate.ts buildColorChannels`** (an internal, same-realm refactor value.js
> owns) — **NOT** a new public `Color._ch` shape. No new public Color surface is
> sanctioned by this dispatch; the AoS `[key:string]:any` public shape is KEEP-documented
> and untouched.

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

**Verification (no bespoke gate — the existing strict build catches it).** Per the
CONTRIVANCE-AUDIT, do NOT stand up a dedicated `proof:any-seam` gate: rely on the
existing repo-wide `tsc` strict build. Once the param is `string`, a regression that
re-widens it to `any` (or a `vu.setSubProperty(42)` callsite) surfaces as an ordinary
`tsc` error in the strict build — no new CI surface required for a trivially-BC
strictness improvement.

---

## INFORM (what value.js Tranche P must know — the DAG, the early-cure, the version split)

1. **The DAG — value.js P sequences BEFORE keyframes P.**

   ```
   value.js Tranche P  ─►  keyframes Tranche P (consumer)
   (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
   ```

   The 1.1.0 API ask (VJ-L3 `parseCSSSubValue`) has no external sibling gate — it
   can ship the moment value.js P opens, unblocking kf's S9 immediately. The 1.2.0
   perf pair (VJ-P1/P3) rides after with no external dependency. **VJ-L1 is
   demoted-to-spike** (not on the publish critical path); **VJ-P2 is dropped**.

2. **The P.W11 WeakMap is the TERMINAL S8 cure — and O.W7 is NOT VJ-L1-gated.**
   kf's `engine.ts` god-object split (O.W7, 1397→~900) is **executable NOW** on the
   current tree — the same phase as O.W8/W9, NOT VJ-L1-gated. The flatten/parse seam
   O.W7 relocates is made in-realm by **kf's own P.W11 realm-clean
   `WeakMap<ValueUnit, string>`** (the `FN_NAME` carrier, populated at flatten time) —
   or simply by the file-split itself. The **P-inv-28 chronicity-4 belt exit** (S8 is
   at chronicity 4 — K,L,M,O→P — and the belt fires THIS tranche, P) is the WeakMap,
   in-realm, with **zero dependency on value.js P**.

   **What this means for value.js P:** the WeakMap is the **TERMINAL S8 cure** — it
   dissolves the B10/B11 inv-L-acyclic-purity breach (no foreign-object annotation)
   without any value.js publish. **A WeakMap key is the `ValueUnit` instance, so it
   does NOT survive `ValueUnit.clone()`** — the clone-restamp ceremony
   (`kf utils.ts:64,289-294`) stays. **VJ-L1's ONLY residual payoff** is retiring
   that 5-line ceremony (a real ctor field `clone()` preserves) — a **nice-to-have**,
   **NOT a precondition for O.W7 and NOT the S8 terminal**. VJ-L1 is therefore
   **demoted-to-spike**: re-open it only on a measured need (the ceremony itself is not
   a measured bottleneck). value.js P is **not blocked on, and does not block,** kf's
   S8 close.

3. **The version split — 1.1.0 (API) then 1.2.0 (perf).**

   | value.js publish | contents | gates kf consume |
   |---|---|---|
   | **1.1.0** | VJ-L3 `parseCSSSubValue` (BC-additive, ~15 LoC) | kf O.W16 **S9** delete + W96 boundary scan (S8 closes in-realm at P.W11 — no value.js publish needed) |
   | **1.2.0** | VJ-P1 `color2Into` + VJ-P3 `: any`→string | kf inherits perf (no kf-side delete) |
   | *(spike)* | VJ-L1 `flatLeaf` `fnName` field | re-opened only on a measured need; retires the kf clone-restamp ceremony (NOT a precondition) |
   | *(dropped)* | ~~VJ-P2 Float64 channel view~~ | falsified premises — the string-keyed read is already routed around in shipped value.js |

   VJ-P.W0 (commit O docs + reconcile PROGRESS) is the **first action**, predating both
   publishes. The 1.1.0 ask (VJ-L3) is the critical-path kf-unblock for S9; the 1.2.0
   pair (VJ-P1/P3) is the grounded optimization frontier and is non-breaking (kf rides
   it transparently). S8's terminal is kf-internal (P.W11), off the value.js publish path.

4. **The P-invariant-28 belt FIRES THIS tranche (S8/S9 at chronicity 4 — K,L,M,O→P).**
   The S8/S9 value.js-workaround chronic (DM-5) is at **chronicity 4** entering kf-P
   (the K,L,M,O carries → P); P-inv-28's mandatory-exit belt fires **THIS tranche (P)**.
   The two chronics exit by DIFFERENT, INDEPENDENT terminals:
   - **S8 EXIT = P.W11 (kf-internal, the chronicity-4 belt exit, the TERMINAL):** the
     realm-clean `WeakMap<ValueUnit, string>` swap fires the belt for S8 THIS tranche
     with **zero dependency on value.js P** — it dissolves the foreign-symbol-stamp
     breach in-realm (gated `proof:no-foreign-symbol-stamp`). It leaves the clone-restamp
     ceremony; that residual is VJ-L1's only payoff, and VJ-L1 is **demoted-to-spike**
     (re-opened only on a measured need, never a precondition).
   - **S9 EXIT = O.W16 — VJ-L3 (the intended exit):** value.js P ships `parseCSSSubValue`
     before kf-P closes → S9 dissolves cleanly (no parse-that dep). The parse-that import
     is NOT eliminable kf-internally (kf needs value.js's CSS sub-value grammar, no
     substitute), so VJ-L3 is the real cross-realm cure.
   - **(b) S9 declared-edge quarantine (last-resort):** if VJ-L3 does not ship, the
     fallback is a DECLARED W96 allow-list with a comment citing the unshipped VJ-L3,
     making the breach non-silent. Strictly inferior to VJ-L3.

   **The tripwire (the consume signal).** kf's `proof:workaround-deletion` `apiPresent`
   guard is the live oracle for **S9** (the value.js-gated chronic): S9 exits PENDING
   when `typeof require("@mkbabb/value.js").parseCSSSubValue === "function"`, transitioning
   false→true on the value.js P publish — no manual coordination, the gate reads the
   installed surface. **S8 is NOT value.js-gated** — it exits at P.W11 in-realm, oracled
   by `proof:no-foreign-symbol-stamp` (no `apiPresent` probe on a value.js publish).

---

## The pin/version state at this dispatch

| Package | Published | kf pins | kf re-pin on the P publish |
|---------|-----------|---------|-----------------------------|
| `@mkbabb/parse-that` | 0.11.0 | `^0.11.0` (production dep, **S9** — for the `any` combinator only) | **DROPPED** from `dependencies` once VJ-L3 lands |
| `@mkbabb/value.js` | **1.0.2** | `^1.0.2` | `^1.1.0` (the VJ-L1/VJ-L3 publish) at O.W16; `^1.2.0` (the perf frontier) at P Band B |

VJ-L2 (the `linear()` space-joined serializer) shipped in value.js O and is
**already consumed** (kf S7 GREEN). **VJ-L3** is the surviving binding API ask
(inherited unchanged); **VJ-L1 is demoted-to-spike** (P.W11's WeakMap is the S8
terminal). **VJ-P1** (`color2Into`) + **VJ-P3** (`: any`→string) are the grounded P
optimization frontier; **VJ-P2 is dropped** (falsified premises).

---

## Net actions

**value.js Tranche P (the sibling — to author in value.js's tree, never from kf):**
1. **VJ-P.W0 (FIRST):** `git add docs/tranches/O/` (commit the uncommitted O docs);
   reconcile `O/PROGRESS.md` header `DEVELOPMENT — charter only` → CLOSED-as-built
   (record honesty); fold the `index.ts:169-171` O(N²) `setSubProperty` one-liner.
2. **1.1.0 — the kf-unblock (no parse-that dep, ships first):**
   - **VJ-L3** — `parseCSSSubValue(value, opts?)` wrapping
     `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` —
     **FunctionArgs-FIRST** (the V4 truncation guard). BC-additive (~15 LoC). The
     surviving binding API ask (unblocks kf's S9).
3. **1.2.0 — the perf frontier (rides after):**
   - **VJ-P1** `color2Into` out-param (gamut ~84 → the measured post-cure residual;
     `proof:gamut-alloc N_TARGET` set to that measurement + margin).
   - **VJ-P3** narrow the `: any` property/subProperty seam → `string` (verified by the
     existing repo-wide strict `tsc`, no bespoke gate).
4. **Spike / dropped (NOT binding asks):**
   - **VJ-L1** `flatLeaf` `fnName` field — **DEMOTE-TO-SPIKE**: P.W11's WeakMap is the
     terminal S8 cure; VJ-L1's residual is retiring the kf clone-restamp ceremony, a
     nice-to-have re-opened only on a measured need. The radical canonical-flat-leaf
     reshape stays a corpus-gated investigation.
   - **VJ-P2** typed Float64 channel view — **DROPPED**: premises falsified by shipped
     value.js (the string-keyed read is already routed around); a residual suspicion
     widens value.js's own `interpolate.ts buildColorChannels`, NOT a new public Color
     shape.

**keyframes.js (the in-realm S8 close + the GATED S9 consume):**
1. **NOW (P.W11, in-realm, no value.js publish):** close S8 by swapping the
   `Symbol("kf.fnName")` for a kf-local `WeakMap<ValueUnit, string>` (same
   `fnNameOf`/`stampFnName` API); green `proof:no-foreign-symbol-stamp`; this is the
   S8 terminal and it also makes the O.W7 seam in-realm (O.W7 is NOT VJ-L1-gated).
2. **On 1.1.0 (O.W16, the GATED S9 consume):** re-pin `^1.1.0`; delete S9 (the
   parse-that import + the two `as any` casts; call `parseCSSSubValue`); drop
   `@mkbabb/parse-that` from `package.json`; author + green the `proof:boundary` **W96**
   parse-that-scan; confirm `proof:workaround-deletion` S9 flips PENDING→GREEN.
3. **On 1.2.0 (P Band B):** re-pin `^1.2.0`; inherit the perf wins transparently
   (VJ-P1/P3 — no kf-side delete).
4. **(spike, only if VJ-L1 is ever shipped):** retire the clone-restamp ceremony
   (`utils.ts:64,289-294`) by reading `u.fnName` directly — strictly additive to the
   P.W11 WeakMap terminal.

**The contract.** value.js publishes the surviving asks; kf re-pins and deletes.
Neither writes the other's tree (inv-16). The gate roster — `proof:workaround-deletion`
apiPresent for **S9** + the new W96 scan (1.1.0/VJ-L3) + the inherited-perf benches
(1.2.0/VJ-P1) — is the binding cross-repo oracle. The **S8 terminal is in-realm**
(P.W11 WeakMap, oracled by `proof:no-foreign-symbol-stamp`), off the value.js publish
path entirely. The cross-repo consume fires when the installed value.js surface carries
the APIs, observed at runtime, not asserted by coordination.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT dispatch packet — **DOCS ONLY**. It writes
zero value.js source (inv-16: kf writes only keyframes.js; every cross-repo need
is a *dispatch*, never a foreign-tree edit). value.js's P session implements the
ASKs in value.js's own tree; kf re-pins and deletes its workarounds on each
publish. Every ASK carries a **falsifiable born-RED gate** (the API asks: an
`apiPresent` runtime probe over the published surface, RED today, GREEN on the
publish; the perf asks: a PORTABLE ratio bench, RED on today's allocation/read
profile, GREEN on the optimization). Implementation opens only on the owner's
explicit go, per-repo, DAG-ordered (value.js P → keyframes P).
observable-truth, no-legacy, gestalt, P-inv-28 hold throughout.
