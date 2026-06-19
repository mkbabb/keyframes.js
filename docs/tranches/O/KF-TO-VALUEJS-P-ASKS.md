# keyframes.js → value.js Tranche P — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-19 at the keyframes O development phase. value.js is the
> UPSTREAM library on the constellation spine (parse-that → value.js →
> keyframes.js → glass-ui). This is the handoff to value.js's **Tranche P** —
> the kf-dispatched follow-on to value.js O (which reached **1.0.2** and shipped
> VJ-L2, but **deferred VJ-L1 and VJ-L3**). It is a coordination record:
> value.js's P session formalizes the two ASK items into its own waves. **No
> value.js source is written from keyframes.js** (inv-16: kf writes only
> keyframes.js; every cross-repo need is a *dispatch*, never a foreign-tree
> edit). The consume-edge discipline holds: value.js publishes the API, kf
> re-pins, kf deletes the workaround — publish-then-re-pin, never cross-write.

This dispatch is the binding cross-repo contract behind kf wave **O.W10**
(the dispatch authoring) and **O.W16** (the value.js-P consume — the atomic
delete of S8/S9 on the publish). Both asks are **BC-additive** (no breaking
change to value.js's published 1.x surface) and small (VJ-L1 ~10 LoC, VJ-L3
~15 LoC) — a single value.js patch (e.g. **1.1.0**) closes both.

---

## The two ASKs

| # | ASK | kf consume-edge (file:line) | value.js API shape | kf workaround it deletes | proof arm that GREENs |
|---|-----|------------------------------|---------------------|---------------------------|------------------------|
| **VJ-L1** | **first-class `flatLeaf` provenance** — preserve the origin `FunctionValue.name` on each leaf `ValueUnit` that `flattenObject` produces, surviving `clone()`, typed as a real field. | `src/animation/utils.ts:45` `const FN_NAME = Symbol("kf.fnName")`; `:47` `type NamedValueUnit`; `:50-57` `fnNameOf`/`stampFnName`; `:64` stamp on clone; `:289-294` re-stamp after `parseAndFlattenObject` clone; `:342-363` the identity-pad read (`functionIdentityValue(fnName)`). | add an optional `fnName?: string` field to `ValueUnit` (`src/units/index.ts:30-31` ctor); copy it in `clone()` (`:120-127`); populate it inside `flattenObject` from the enclosing `FunctionValue.name` (`src/units/utils.ts:85`, the `FunctionValue` branch). | **S8** — the `FN_NAME` Symbol sidechannel (7 sites across `utils.ts`). | `proof:workaround-deletion` **S8** arm: `apiPresent` flips when `"fnName" in new ValueUnit(...)` (or `flatLeaf`-tagged leaves carry `.fnName`); kf deletes the Symbol; the gate's S8 row flips PENDING→GREEN. |
| **VJ-L3** | **`parseCSSSubValue` root helper** — a typed root export that parses a single CSS sub-value string in a property context, internalizing the `any(CSSFunction.FunctionArgs, CSSValues.Value)` parser composition kf currently reaches by importing `@mkbabb/parse-that` directly. | `src/animation/utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"`; `:229` `(CSSFunction.FunctionArgs as any).map(...)`; `:236` `(parseAny as any)(fnArgs, CSSValues.Value)`; `package.json` `"@mkbabb/parse-that"` production dep. | expose `parseCSSSubValue(value: string, opts?: { subProperty?: string }): ValueUnit \| ValueArray \| FunctionValue` at the value.js **root** export — wrapping the existing `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` composition value.js already owns internally. | **S9** — the direct `@mkbabb/parse-that` import + the two `as any` cross-realm casts + the production dep. | `proof:workaround-deletion` **S9** arm + the new `proof:boundary` **W96** parse-that-scan: kf deletes the import/casts, drops the dep, calls `parseCSSSubValue`; W96 asserts zero `@mkbabb/parse-that` specifiers in `src/animation/**`; both flip RED→GREEN. |

---

### VJ-L1 — the `flatLeaf` provenance API (the kf-S8 root fix)

**The kf need, grounded.** When kf flattens an author keyframe object, value.js's
`flattenObject` (`value.js/src/units/utils.ts:85`) dissolves a `FunctionValue`
wrapper (`scale(…)`, `translateX(…)`, `brightness(…)`) into bare leaf
`ValueUnit`s, **dropping `FunctionValue.name`**. kf needs that name back: the
identity-aware arity pad (`createInterpVarValue` → `padToLength`,
`utils.ts:347-363`) resolves the CSS **identity element** of an ABSENT function
(`scale → 1`, `translateX → 0px`, `brightness → 1`) via value.js's own
`functionIdentityValue(fnName)` — so a one-sided `transform` interpolates from
the right identity, not a silent `0` (the MCI-5 fix). Without the name, an
absent `scale` would lerp from black/zero.

**Today kf carries S8** — a `Symbol("kf.fnName")` stamped onto value.js
`ValueUnit` instances (`utils.ts:45-57`), re-stamped after every `clone()`
(`:64`, `:289-294`) because **`ValueUnit.clone()` does not preserve it**
(`value.js/src/units/index.ts:120-127` clones only the ctor fields). This is a
sidechannel onto a foreign-realm object — an inv-L-acyclic-purity violation
(B10/B11): kf is annotating value.js's data model from outside.

**The proposed value.js API (BC-additive).**

```ts
// value.js/src/units/index.ts — ValueUnit ctor, additive optional field
constructor(
    public value: T,
    public unit?: U,
    public superType?: string[],
    public subProperty?: string,
    public property?: string,
    public targets?: HTMLElement[],
    public fnName?: string,        // VJ-L1: origin FunctionValue.name (flatten provenance)
) {}

// clone() preserves it (the one line that retires the kf re-stamp)
clone(): ValueUnit<T, U> {
    return new ValueUnit<T, U>(
        clone(this.value), this.unit, clone(this.superType),
        this.subProperty, this.property, /*targets*/ undefined, this.fnName,
    );
}
```

`flattenObject`'s `FunctionValue` branch (`value.js/src/units/utils.ts`, the
`obj instanceof FunctionValue` arm) sets `leaf.fnName = obj.name` on each leaf it
emits. **`fnName` is distinct from `subProperty`** — B10 found `subProperty`
already conflates property-name with function-name semantics, so it cannot carry
this; a dedicated `fnName` field is the only clean home. (Naming is value.js's
call — `fnName`, `flatLeaf`, `originFn`; kf consumes whatever value.js publishes
and adapts `fnNameOf` to read `u.fnName`.)

**The kf consume-seam (O.W16).** On the value.js-P re-pin, kf's `utils.ts`:
- deletes `FN_NAME` / `NamedValueUnit` / `stampFnName` (`:45-57`),
- rewrites `fnNameOf(u)` to `u.fnName` (the public field),
- drops the re-stamp on every `clone()` (`:64`, `:289-294`) — `clone()` now
  carries it,
- the identity-pad (`:347-363`) reads `counterLeaf.fnName` directly.

**The proof arm.** `proof:workaround-deletion`'s **S8** row currently reports
`S8 PENDING — value.js 1.0.x is published but its VJ-L1 flatLeaf provenance API
has NOT landed` (its `apiPresent` guard probes the live API). When value.js P
ships, `apiPresent` flips, kf executes the delete, and the S8 row flips
PENDING→GREEN. The **REAL observable** the gate asserts: a flattened `scale(2)`
leaf carries `.fnName === "scale"` after a `.clone()` round-trip — value.js's
own API, not a kf Symbol — and the identity pad still resolves `scale → 1` for
an absent counterpart (the MCI-5 behaviour is preserved across the seam swap).

---

### VJ-L3 — the `parseCSSSubValue` helper (the kf-S9 root fix)

**The kf need, grounded.** kf's `tryParseLeaves` (`utils.ts:222-251`) parses a
single CSS sub-value string (e.g. `"scale(2) rotate(45deg)"`, a `translateX`
value, a color) into value.js's `ValueUnit | ValueArray | FunctionValue` tree.
To do so it reaches **directly into `@mkbabb/parse-that`** for the `any`
combinator and hand-composes value.js's own internal parsers:

```ts
// src/animation/utils.ts:1, :229-238 (today — the S9 violation)
import { any as parseAny } from "@mkbabb/parse-that";
// ...
const fnArgs = (CSSFunction.FunctionArgs as any).map(...);     // :229 cross-realm cast
const p = tryParse((parseAny as any)(fnArgs, CSSValues.Value), strValue); // :236 cross-realm cast
```

The `as any` casts exist because **value.js and kf each ship their own
`@mkbabb/parse-that` realm** under separate `node_modules` — the `Parser<T>`
classes are nominally distinct to TypeScript though byte-identical at runtime
(`utils.ts:226-233` documents exactly this). This is a constellation-spine
breach (B10/B11): kf should consume value.js's grammar through a value.js door,
never reach around it into value.js's own parser dependency. It also carries
`@mkbabb/parse-that` as a kf **production dep** (`package.json`) solely for this
one combinator.

**The proposed value.js API (BC-additive).**

```ts
// value.js root export
export function parseCSSSubValue(
    value: string,
    opts?: { subProperty?: string },
): ValueUnit | ValueArray | FunctionValue;
```

It internalizes the exact composition kf hand-rolls —
`tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` — inside
value.js's own realm, where `CSSFunction.FunctionArgs`, `CSSValues.Value`, and
`any` are all same-realm (no `as any` needed). The optional `subProperty`
threads the property context onto the parsed `ValueArray` (kf today calls
`v.setSubProperty(childKey)` on the `FunctionArgs` before parsing,
`utils.ts:230-232` — value.js does this internally). value.js already owns every
piece; this ASK is a thin, named, public wrapper over its existing internals.

**The kf consume-seam (O.W16) — one atomic commit.** On the value.js-P re-pin:
- delete `import { any as parseAny } from "@mkbabb/parse-that"` (`utils.ts:1`),
- replace the `tryParseLeaves` body's `(CSSFunction.FunctionArgs as any).map`
  + `(parseAny as any)(...)` composition (`:229-238`) with
  `parseCSSSubValue(strValue, { subProperty: childKey })`,
- remove `@mkbabb/parse-that` from `package.json` dependencies (one fewer
  production dep),
- both cross-realm `as any` casts vanish (the realm is now value.js-internal).

**The proof arms.** Two gates green together:
1. `proof:workaround-deletion`'s **S9** row (`S9 PENDING — value.js O shipped
   VJ-L2 only — held until VJ-L3 parseCSSSubValue helper ships`) flips
   PENDING→GREEN when `apiPresent` sees `typeof vj.parseCSSSubValue ===
   "function"` and the import is gone.
2. The new `proof:boundary` **W96** parse-that-scan (named since L.W9, **never
   implemented** — B11 found `proof-boundary.mjs:93-107`'s `holdsValueJsSpecifier`
   matches only `@mkbabb/value.js`): O.W16 authors it to scan **all**
   `src/animation/**` modules (not just the LIGHT surface) for any
   `from "@mkbabb/parse-that"` specifier and assert **zero**. It is **born-RED
   today** (`utils.ts:1` is the live violator) and flips GREEN exactly when S9
   deletes that import — a structural guard so S9 cannot silently recur.

The **REAL observable** (inv-O-observable-truth): the gate runs `parseCSSSubValue`
from the published value.js barrel over `"scale(2) translateX(10px)"` and
asserts it yields the same `ValueUnit`/`FunctionValue` tree kf's hand-rolled
composition produced — the round-trip equality, not a `typeof` proxy.

---

## INFORM (what value.js Tranche P must know — the kf timing + the gated waves)

1. **The kf 5.0.0 cut timing.** keyframes.js is cutting **5.0.0** at O.WZ (the
   npm registry is frozen at 4.3.0 since Tranche K; the Oscillator + the
   constellation-consume + the new gates are local-only). The 5.0.0 cut is the
   honest home for the no-legacy renames. **O.W16 (the S8/S9 delete) wants to
   land BEFORE the 5.0.0 cut** so the major includes a clean, parse-that-free,
   Symbol-free `utils.ts`. If value.js P ships VJ-L1/VJ-L3 before the kf O.WZ
   close, O.W16 consumes them and 5.0.0 ships the cure; if P slips, see the
   P-inv-28 belt window below.

2. **The kf engine-seam (O.W7) is blocked on VJ-L1.** kf's `engine.ts` is
   **1397 lines** (target ~900) — the god-object split the owner mandates
   (O.md Band D). The split is **VJ-L1-gated**: the `FN_NAME` Symbol stamp is
   threaded through the flatten/parse seam that O.W7 must relocate, and removing
   the Symbol (on the VJ-L1 consume) is the precondition for cleanly decomposing
   that seam. value.js P shipping VJ-L1 unblocks O.W7. (kf's
   `proof:decomposition` already carries the born-RED HANDOFF text for this
   chain; the wave ordering — O.W16 before O.W7 — is the mechanism, no extra
   gating needed.)

3. **The P-invariant-28 belt window (chronicity → 4 at kf-P if P slips).**
   DM-5 (the S8/S9 value.js-workaround chronic) is at **chronicity 3** entering
   kf O (carried K→L→M, rising to 3 at O). P-inv-28's mandatory-exit belt fires
   at **chronicity ≥4**. The **named terminal**: if value.js Tranche P does
   **not** ship VJ-L1 + VJ-L3 before the kf-P tranche, DM-5 hits chronicity 4 at
   kf-P and the P-inv-28 belt **forces a terminal** via one of two arms:

   - **(a) S8 two-arm kf-internal KILL (WeakMap carrier):** keep the `fnName`
     provenance as a kf-internal concern with a first-class non-Symbol carrier —
     a side `WeakMap<ValueUnit, string>` populated at flatten time. This is
     value.js-realm-clean (no foreign-object annotation, dissolves the B10/B11
     inv-L-acyclic-purity breach). HOWEVER: a WeakMap key is the `ValueUnit`
     instance, so it does NOT survive `ValueUnit.clone()` — the clone-restamp
     ceremony (`utils.ts:64`, `:289-294`) **stays**, and the map must be
     re-stamped on every clone. **kf-internal-sufficient — BUT VJ-L1 is still
     strictly preferred** because VJ-L1 eliminates the clone-restamp ceremony
     entirely by carrying `fnName` as a real ctor field.

   - **(b) S9 declared-edge quarantine:** the direct `@mkbabb/parse-that` import
     + the two `as any` cross-realm casts are **NOT eliminable without VJ-L3** —
     kf needs value.js's CSS sub-value grammar, and there is no kf-internal
     substitute. If VJ-L3 does not ship, the ONLY available fallback is a
     **DECLARED spine-edge quarantine**: allow-list the parse-that import in
     `proof:boundary` (the W96 scan), annotate it with a comment citing the
     unshipped VJ-L3 dependency, and let the breach persist as a **declared seam
     rather than a silent violation**. This does NOT dissolve the constellation-
     spine breach (B10/B11); it only makes it non-silent. Strictly inferior to
     VJ-L3.

   **(a-preferred, b-fallback — VJ-L1/VJ-L3 the intended exit):** value.js P
   shipping both APIs dissolves both arms cleanly (no WeakMap, no declared seam,
   no parse-that dep). This is the named terminal home the no-perpetual-punts
   precept demands; the window is **value.js P before kf-P**.

   **The tripwire (the consume signal).** kf's `proof:workaround-deletion`
   `apiPresent` guard is the live oracle: S8 exits PENDING when
   `"fnName" in new ValueUnit(0)` (or value.js's chosen carrier) is `true`; S9
   exits PENDING when `typeof require("@mkbabb/value.js").parseCSSSubValue ===
   "function"`. Both transition false→true on the value.js P publish — no manual
   coordination, the gate reads the installed surface.

---

## The pin/version state at this dispatch

| Package | Published | kf pins | kf re-pin on the P publish |
|---------|-----------|---------|-----------------------------|
| `@mkbabb/parse-that` | 0.11.0 | `^0.11.0` (production dep, **S9** — for the `any` combinator only) | **DROPPED** from `dependencies` once VJ-L3 lands (O.W16) |
| `@mkbabb/value.js` | **1.0.2** | `^1.0.x` | `^<P>.x` (the VJ-L1/VJ-L3 publish — e.g. `^1.1.0`) at O.W16 |

VJ-L2 (the `linear()` space-joined serializer) shipped in value.js O and is
**already consumed** (kf S7 GREEN, `utils.ts:185-198` — the former flat-comma
normalize fold is retired). VJ-L1 and VJ-L3 are the **remaining two** of the
three L.W9-anticipated asks; this dispatch is their formal sibling ask.

---

## Net actions

**value.js Tranche P (the sibling — to author in value.js's tree, never from kf):**
1. Ship **VJ-L1** — the `fnName?: string` provenance field on `ValueUnit`,
   preserved by `clone()`, populated by `flattenObject` from
   `FunctionValue.name`. BC-additive (~10 LoC).
2. Ship **VJ-L3** — the `parseCSSSubValue(value, opts?)` root helper wrapping
   `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)`.
   BC-additive (~15 LoC).
3. Publish (a patch — e.g. **1.1.0** — closes both; no full tranche ceremony
   required, per B10/B11).
4. (Adjacent, value.js's own ledger — not a kf ask) update value.js
   `docs/tranches/O/PROGRESS.md` from its stale `DEVELOPMENT — charter only`
   header to CLOSED-with-per-wave-status (B7 found it un-updated on a
   fully-executed tranche). This is value.js's record hygiene, noted for
   constellation-truth, not a kf deliverable.

**keyframes.js O (on the value.js P publish — the GATED consume, O.W16):**
1. Re-pin `@mkbabb/value.js` → `^<P>.x`.
2. Delete **S8** (the `FN_NAME` Symbol + helpers; rewrite `fnNameOf` → `.fnName`).
3. Delete **S9** (the parse-that import + the two `as any` casts; call
   `parseCSSSubValue`); drop `@mkbabb/parse-that` from `package.json`.
4. Author + green the `proof:boundary` **W96** parse-that-scan over
   `src/animation/**` (born-RED today on `utils.ts:1`).
5. Confirm `proof:workaround-deletion` S8/S9 rows flip PENDING→GREEN; unblock
   O.W7 (the engine-seam split) on the S8 delete.

**The contract.** value.js publishes; kf re-pins and deletes. Neither writes the
other's tree (inv-16). The gate roster (`proof:workaround-deletion` apiPresent +
the new W96 scan) is the binding oracle — the consume fires when the installed
value.js surface carries the APIs, observed at runtime, not asserted by
coordination.
