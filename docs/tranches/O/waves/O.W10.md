# O.W10 — the value.js-P ask: VJ-L1 flatLeaf provenance + VJ-L3 parseCSSSubValue (the S8/S9 terminal home)

**Band:** E — sibling dispatch (inv-16: kf asks, never writes the foreign tree).
**Phase:** DISPATCH — a cross-repo ask; the wave authors the dispatch DOC, not engine source. Its consume half is **GATED** at G.W16 (fires on the value.js-P publish).
**Sequence:** `O.W0 charter ─► E.W10 value.js-P ask` (this wave) — authored alongside `E.W11 glass-ui aria ask`; both are leaf DISPATCH nodes off the charter. The DAG edge it feeds: `E.W10 ──► G.W16 (VJ-L1/L3 publish) ──► O.WZ close` and `E.W10 ──► D.W7 engine-seam (VJ-L1-gated)` (`O.md:97,100,120`).
**Owning chronic/DM:** **DM-5 S8/S9 value.js workarounds** — chronicity 2 (K→M), rising to **3 at O**. Below the P-inv-28 ≥4 mandatory-exit belt, but the no-perpetual-punts precept demands a NAMED terminal home; this wave is that naming. The P-inv-28 belt fires at chronicity 4 (**kf-P** — the next kf tranche after O) if value.js P slips — the terminal window is named explicitly, not left open (`O.md:112`).

This wave authors the outgoing dispatch **`KF-TO-VALUEJS-P-ASKS.md`** (the `KF-TO-GLASSUI-BC.md` sibling-dispatch format, `O.md:115-120`). It **supersedes M.W9 §S8–S9** (the value.js-consume slice): M.W9 framed S8/S9 as firing on a `value.js@0.14.0` publish — but value.js Tranche O shipped through **1.0.2** and **VJ-L1/VJ-L3 were never in any published version** (`AUDIT-DIGEST.md` B7/B8/B10, verified live: `typeof vjs.flatLeaf === "undefined"`, `typeof vjs.parseCSSSubValue === "undefined"`). O.W10 deltas the ONE fact that changed: the trigger is no longer a version number (`0.14.0` is stale and over-reports — `proof-workaround-deletion.mjs:260,273`) but the **API-present capability probe** value.js Tranche **P** must turn true. The S7 (VJ-L2 linear-serialize) half of M.W9 already GREENed on consume (`O.md:32`); only S8/S9 remain.

---

## Context

### The two consume-edge workarounds, grounded in source

kf's `src/animation/utils.ts` carries two precept violations that exist **only because the value.js APIs that would dissolve them are absent** (`AUDIT-DIGEST.md` B10 — "there is no viable kf-side architectural alternative because subProperty conflates property-name with function-name semantics … and the as-any casts in `tryParseLeaves` are genuine constellation-spine violations per inv-L-acyclic-purity").

**S8 — the `FN_NAME` Symbol sidechannel (VJ-L1's absence).** When value.js's `flattenObject` dissolves a `FunctionValue` wrapper (`scale`, `translateX`, `brightness`, …) into bare `ValueUnit` leaves, it **drops the origin-function name** — the provenance kf's identity-aware arity pad needs to resolve the CSS identity element of an ABSENT function (`scale → 1`, `translateX → 0px`) instead of the bare numeric `0`. kf re-attaches that name with a private `Symbol` stamped onto the published value.js class:

| Site | `utils.ts` | What it is |
|------|-----------|-----------|
| the Symbol | `:45` `const FN_NAME = Symbol("kf.fnName")` | a private key stamped onto a foreign-realm `ValueUnit` |
| the augment type | `:47` `type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }` | a structural widen of the published class |
| read | `:50-51` `fnNameOf` | reads the stamp off a leaf |
| write | `:54-57` `stampFnName` | writes the stamp onto a leaf |
| re-stamp on clone | `:64`, `:289-293` | `ValueUnit.clone()` DROPS the stamp, so every clone re-applies it from the master |
| consume | `:342`, `:361` `fnNameOf(counterLeaf)` | the identity-pad reads the origin function |

This is a sidechannel on a class kf does not own — a constellation-spine breach. The root fix is a **first-class provenance field on `ValueUnit`** that `flattenObject` populates and `clone()` preserves: **VJ-L1**.

**S9 — the direct `@mkbabb/parse-that` import (VJ-L3's absence).** kf reaches **past** value.js into its own transitive `parse-that` to compose a sub-value parser inline:

| Site | Source | What it is |
|------|--------|-----------|
| the import | `utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"` | a direct dep on value.js's parser-combinator substrate |
| the prod dep | `package.json` `"@mkbabb/parse-that": "^0.11.0"` | a SECOND production dependency that should be transitive-only |
| the use + cast | `utils.ts:229,236` `(CSSFunction.FunctionArgs as any).map(…)` + `(parseAny as any)(fnArgs, CSSValues.Value)` | a cross-realm `as any` over two nominally-distinct `parse-that` copies (`utils.ts:224-228`) |

The stale cross-realm comment (`utils.ts:224-228`) is factually wrong — value.js + kf resolve a **single shared module instance** today (`AUDIT-DIGEST.md` B9). The `as any` retains a TypeScript motivation (nominal types across the augment) but no runtime one. The root fix is a **value.js-owned sub-value parse helper** that absorbs the `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` composition, so kf imports it from value.js and DROPS the direct parse-that dep + the cast: **VJ-L3**.

### Why the M.W9 trigger is stale (the over-report)

`proof:workaround-deletion`'s S8/S9 arms pin `sibling: { version: "0.14.0" }` (`proof-workaround-deletion.mjs:260,273`). value.js published `0.14.0`, `0.15.0`, `0.16.0`, `1.0.0`, `1.0.1`, `1.0.2` — so a **version-publish probe alone over-reports** (it would flip S8/S9 RED on the mere existence of `0.14.0+`). The gate already guards against this with an **API-present capability probe** (`proof-workaround-deletion.mjs:127-155`): an arm is RED only when the REPLACEMENT API is genuinely consumable — "version published but API absent" is PENDING. Live probe today:

```
"flatLeaf"        in (await import("@mkbabb/value.js"))  →  false   (vjsCaps.flatLeaf       = false)
"parseCSSSubValue" in (await import("@mkbabb/value.js")) →  false   (vjsCaps.parseCSSSubValue = false)
```

So S8/S9 sit correctly **PENDING** at value.js 1.0.2 — the workaround is PRESENT, the replacement API ABSENT (`AUDIT-DIGEST.md` B10 — "proof:workaround-deletion correctly shows 1 GREEN (S7) / 4 PENDING (S1, S2, S8, S9) at exit 0"). This wave's first NOW-executable act (folded into O.W2 ledger re-point per `O.md:82`) is to **retarget** the stale `0.14.0` version sentinel to a NAMED value.js-P expected-version placeholder (`~<value.js-P>`) so the gate stops asserting a falsehood — the API-capability probe is already the load-bearing condition; the version string is documentation.

### The exact ask (the two minimal additive APIs)

The audit scoped both as small, BC-additive, zero-consumer-blast deltas (`AUDIT-DIGEST.md` B10 — "VJ-L1 is ~10 LoC … VJ-L3 is ~15 LoC … Both are BC-additive. A patch release could close both"):

| Ask | Shape (the value.js surface kf will consume) | The kf deletion it unblocks |
|-----|----------------------------------------------|------------------------------|
| **VJ-L1** flatLeaf provenance | an optional `fnName?: string` field on `ValueUnit`, **populated by `flattenObject` at dissolve time** (the origin `FunctionValue.name` threads onto each leaf) AND **preserved by `ValueUnit.clone()`** | delete `FN_NAME`/`NamedValueUnit`/`fnNameOf`/`stampFnName` (`utils.ts:45-57`) + every re-stamp (`:64,289-293`); read `leaf.fnName` directly at `:342,361` |
| **VJ-L3** parseCSSSubValue | a root export `parseCSSSubValue(property: string, value: string): ValueUnit \| ValueArray \| FunctionValue \| null` wrapping the existing `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` composition | delete `utils.ts:1` parse-that import + the `package.json` `@mkbabb/parse-that` prod dep + the `(parseAny as any)` cast (`:229,236`); call `parseCSSSubValue(childKey, strValue)` instead |

**inv-16 holds:** O.W10 writes ONLY the kf dispatch doc + (the NOW slice) the gate-retarget folded at O.W2. It writes ZERO value.js source. value.js Tranche P formalizes VJ-L1/VJ-L3 into its own waves; kf consumes on publish (G.W16).

---

## Born-RED gate

**Gate (NEW):** `proof:valuejs-p-ask` — `scripts/proof-valuejs-p-ask.mjs`, authored by this wave; wired into `proof:hygiene` (the dispatch-integrity arm, NOT the blocking-correctness roster — a DISPATCH wave's gate asserts the ask is COHERENT + the consume-edge is still live, not that a foreign repo shipped).

**The FALSIFIABLE clause — `dispatch-live` (the REAL runtime observable).** The gate imports the INSTALLED `@mkbabb/value.js` and runs the two capability probes the consume-edge actually depends on, then cross-checks the kf source still carries the workaround:

1. **`vj-l1-absent`** — `("flatLeaf" in vjs) === false` AND `("fnName" in new ValueUnit(...))`-shape provenance is unreachable (the leaf carries no origin-function field). **Today: RED-clause-TRUE** (the API is absent → the ask is LIVE). When value.js P ships VJ-L1, this flips → the ask is DISCHARGED.
2. **`vj-l3-absent`** — `("parseCSSSubValue" in vjs) === false`. **Today: RED-clause-TRUE** (absent → ask LIVE).
3. **`workaround-still-present`** (the cross-check — observable-truth, not a grep proxy of the ABSENCE): the kf HEAVY source STILL carries S8 (`grep FN_NAME src/animation/utils.ts` → present) AND S9 (`grep 'from "@mkbabb/parse-that"' src/animation/utils.ts` → present). This asserts the dispatch is NOT prematurely closed — the workaround the ask exists to delete is genuinely still in the tree.

**How it is born-RED (the plant-a-failure).** The gate's GREEN condition is **"the ask is DISCHARGED"** — i.e. value.js P shipped VJ-L1+VJ-L3 (`flatLeaf`/`parseCSSSubValue` present) **AND** kf deleted S8/S9 (the consume landed at G.W16). On today's tree, EVERY one of those is false: the APIs are absent (probe returns `false`/`false`) and the workarounds are present. So `proof:valuejs-p-ask` exits non-zero — born-RED — and stays RED until the round-trip (P publish → kf consume) completes. The RED is the GENUINE observable: a real `await import("@mkbabb/value.js")` returns objects WITHOUT the provenance API, and a real `grep` finds the `Symbol("kf.fnName")` stamp still on the published class. It is NOT a source-grep proxy for "did value.js ship" — it runs the live capability probe a consumer would.

| Clause | Witness on today's tree (1.0.2) | Failure mode TODAY (the REAL observable) | GREEN condition |
|--------|----------------------------------|-------------------------------------------|-----------------|
| `vj-l1-absent` | `"flatLeaf" in (await import("@mkbabb/value.js"))` | `false` — no first-class provenance; the leaf forgets its origin function | VJ-L1 published; `flatLeaf`/`ValueUnit.fnName` present |
| `vj-l3-absent` | `"parseCSSSubValue" in (await import("@mkbabb/value.js"))` | `false` — no sub-value helper; kf must reach parse-that directly | VJ-L3 published; `parseCSSSubValue` present |
| `workaround-still-present` | `grep -n "FN_NAME\|@mkbabb/parse-that" src/animation/utils.ts` | `utils.ts:1,45,47,50,54,64,213,289,293,342,361` — S8/S9 LIVE | S8/S9 deleted at G.W16 (the consume) |

**Anti-proxy note (inv-observable-truth).** The forbidden proxy here would be a gate that greps the kf docs for the string "VJ-L1 dispatched" and greens — asserting the ASK was authored, not that the API is genuinely absent. `proof:valuejs-p-ask` instead runs the live `import()` + `in` probe (the exact capability `proof:workaround-deletion` consumes at `:151,154`) so a phantom "we asked" can never green it; only a real value.js publish + a real kf delete can.

---

## Dependencies

- **value.js Tranche P (the dispatched sibling) — NOT YET CHARTERED.** This wave's ASK is its trigger. The audit recommends value.js P.W0 ship VJ-L1+VJ-L3 FIRST as a small additive patch (`AUDIT-DIGEST.md` B7/B10 — "value.js 1.1.0 could close both without a heavyweight tranche ceremony"). The NAMED tripwire: `("flatLeaf" in require("@mkbabb/value.js"))` transitions `false → true` AND `("parseCSSSubValue" in …)` likewise.
- **G.W16 (the consume wave) — GATED on this dispatch's discharge.** O.W16 deletes S8/S9 + adds the `proof:boundary` W96 parse-that-scan clause (born-RED on `utils.ts:1` today, becomes the commit-gate for the S9 deletion — `AUDIT-DIGEST.md` B9/B10). G.W16 is where the consume half lands; O.W10 is the ask half. They are the same DM-5 terminal, split by phase (DISPATCH → GATED).
- **D.W7 (engine-seam transposition) — VJ-L1-gated.** The `engine.ts` 1397→~900 split is blocked on removing the `FN_NAME` stamp the decomposition cannot carry across module boundaries (`O.md:30,120`; `AUDIT-DIGEST.md` B7 — "kf M.W13 engine-seam transposition stays blocked"). VJ-L1 ships → S8 deleted (G.W16) → D.W7 unblocked.
- **O.W2 (ledger re-point) — the NOW slice this wave folds.** The `0.14.0` → `~<value.js-P>` version-sentinel retarget in `proof:workaround-deletion` S8/S9 arms (`proof-workaround-deletion.mjs:260,273`) lands at O.W2 so the gate stops over-reporting on a stale version (`O.md:82`).
- **No glass-ui dep, no parse-that-publish dep.** parse-that is terminal for O's needs at 0.11.0 (`O.md:144`); the S9 fix is a value.js-side ABSORPTION of the parse-that reach, not a parse-that change. The packrat-soundness item is a separate DM-4 KILL (`O.md:32`), not part of this ask.

---

## dev→impl boundary

This wave's DELIVERABLE is the dispatch doc `docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md` (authored in this phase) + the `proof:valuejs-p-ask` gate SPEC (born-RED, falsifiable) + the O.W2-folded gate-retarget SPEC. The IMPLEMENTATION — writing `scripts/proof-valuejs-p-ask.mjs`, retargeting the `proof:workaround-deletion` version sentinels, and (at G.W16) deleting S8/S9 — opens only on the owner's explicit authorization, gate-first, born-RED, observable-truth, no-legacy. **inv-16:** kf authors the ASK + its own gate; value.js Tranche P writes the value.js source. The cross-repo need is a DISPATCH, never a foreign-tree edit.
