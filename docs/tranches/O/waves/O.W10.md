# O.W10 — the value.js-P ask: VJ-L3 parseCSSSubValue (the SOLE binding S9 terminal) + VJ-L1 flatLeaf (DEMOTED-TO-SPIKE)

> **RE-SCOPE (FULL-LOOP-LEDGER `O.W12-WZ-consume` / `valuejs-P-asks`, 2026-06-22).** The loop RE-SCOPED this dispatch: **VJ-L3 `parseCSSSubValue` is RETAINED as the SOLE binding API ask** (the S9 terminal — S9 is genuinely not self-solvable in-realm; live probe confirms `parseCSSValue` TRUNCATES `'scale(2) rotate(45deg)'` to `scaleX/Y/Z` only, so kf's FunctionArgs-first composition is non-substitutable). **VJ-L1 `flatLeaf` provenance is DEMOTED to a value.js SPIKE** — P.W11's in-realm `WeakMap<ValueUnit,string>` (validated realm-clean: ZERO kf own-symbols on the `ValueUnit` post-swap, byte-equivalent over 20 arity-pad interp vars) is the **S8 terminal**, with ZERO value.js dependency. VJ-L1's only residual is retiring the clone-restamp ceremony — re-opened on a measured clone-restamp bottleneck, never on the critical path. The loop also **STRUCK the claim that VJ-L1 unblocks O.W7**: the engine-seam split is NOT VJ-L1-gated (P CONTRIVANCE-AUDIT — executable NOW on the current tree). Evidence base: `docs/tranches/P/FULL-LOOP-LEDGER.md`.

**Band:** E — sibling dispatch (inv-16: kf asks, never writes the foreign tree).
**Phase:** DISPATCH — a cross-repo ask; the wave authors the dispatch DOC, not engine source. Its consume half is **GATED** at G.W16 (fires on the value.js-P **VJ-L3** publish — the S9 binding edge; S8 closes in-realm at P.W11, not gated on this dispatch).
**Sequence:** `O.W0 charter ─► E.W10 value.js-P ask` (this wave) — authored alongside `E.W11 glass-ui aria ask`; both are leaf DISPATCH nodes off the charter. The DAG edge it feeds: `E.W10 ──► G.W16 (VJ-L3 publish → S9 delete) ──► O.WZ close` (`O.md:97,100,120`). The former `E.W10 ──► D.W7 engine-seam (VJ-L1-gated)` edge is **STRUCK** — O.W7 is NOT VJ-L1-gated (P CONTRIVANCE-AUDIT; the engine-seam split is in-realm by the file-split itself + P.W11's WeakMap).
**Owning chronic/DM:** **DM-5 S8/S9 value.js workarounds** — chronicity 2 (K→M), rising to **3 at O**. Below the P-inv-28 ≥4 mandatory-exit belt, but the no-perpetual-punts precept demands a NAMED terminal home; this wave is that naming for **S9** (VJ-L3). **S8's terminal is no longer this dispatch** — it is P.W11's in-realm WeakMap (the FULL-LOOP-LEDGER `P.W11-weakmap` ADOPT: realm-clean, the S8 terminal). The P-inv-28 belt fires at chronicity 4 (**kf-P** — the next kf tranche after O) if value.js P slips on VJ-L3 — the S9 terminal window is named explicitly, not left open (`O.md:112`).

This wave authors the outgoing dispatch **`KF-TO-VALUEJS-P-ASKS.md`** (the `KF-TO-GLASSUI-BC.md` sibling-dispatch format, `O.md:115-120`). It **supersedes M.W9 §S8–S9** (the value.js-consume slice): M.W9 framed S8/S9 as firing on a `value.js@0.14.0` publish — but value.js Tranche O shipped through **1.0.2** and **VJ-L1/VJ-L3 were never in any published version** (`AUDIT-DIGEST.md` B7/B8/B10, verified live: `typeof vjs.flatLeaf === "undefined"`, `typeof vjs.parseCSSSubValue === "undefined"`). O.W10 deltas the ONE fact that changed: the trigger is no longer a version number (`0.14.0` is stale and over-reports — `proof-workaround-deletion.mjs:260,273`) but the **API-present capability probe** value.js Tranche **P** must turn true. Post-RE-SCOPE the binding probe is `"parseCSSSubValue" in vjs` (VJ-L3 — the S9 terminal); `"flatLeaf" in vjs` (VJ-L1) is a secondary-informational spike probe, NOT a blocker. The S7 (VJ-L2 linear-serialize) half of M.W9 already GREENed on consume (`O.md:32`); only S8 (now P.W11-terminal) / S9 (VJ-L3-terminal) remain.

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

### The exact ask (VJ-L3 binding · VJ-L1 spike)

The audit scoped both as small, BC-additive, zero-consumer-blast deltas (`AUDIT-DIGEST.md` B10 — "VJ-L1 is ~10 LoC … VJ-L3 is ~15 LoC … Both are BC-additive. A patch release could close both"). Post-RE-SCOPE the loop partitions them by bindingness:

| Ask | Status | Shape (the value.js surface kf will consume) | The kf deletion it unblocks |
|-----|--------|----------------------------------------------|------------------------------|
| **VJ-L3** parseCSSSubValue | **BINDING (the SOLE API ask · 1.1.0)** | a root export `parseCSSSubValue(value: string, opts?: { subProperty?: string }): ValueUnit \| ValueArray \| FunctionValue \| null` internalizing `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value)` with **FunctionArgs FIRST** (probe-confirmed: the shipped `parseCSSValue` TRUNCATES `'scale(2) rotate(45deg)'` to `scaleX/Y/Z` only — a naive delegation would silently break kf) | delete `utils.ts:1` parse-that import + the `package.json` `@mkbabb/parse-that` prod dep + the `(parseAny as any)` cast (`:229,236`); call `parseCSSSubValue(childKey, strValue)` instead. **S9 is NOT self-solvable in-realm** — kf cannot replicate value.js's CSS sub-value grammar without VJ-L3 (FULL-LOOP-LEDGER `valuejs-P-asks` VJ-L3 KEEP) |
| **VJ-L1** flatLeaf provenance | **DEMOTED-TO-SPIKE (non-binding)** — re-opened only on a measured clone-restamp bottleneck; if re-opened, prefer the meta-record (Option B) shape over a 7th positional ctor field | an optional `fnName?: string` field on `ValueUnit`, **populated by `flattenObject` at dissolve time** AND **preserved by `ValueUnit.clone()`** | would retire the **clone-restamp ceremony** only — NOT the S8 root fix. **S8's terminal is P.W11's in-realm `WeakMap<ValueUnit,string>`** (realm-clean, zero value.js dependency, the FULL-LOOP-LEDGER `P.W11-weakmap` ADOPT); VJ-L1 is strictly preferred for ceremony-retirement but never on the critical path |

**inv-16 holds:** O.W10 writes ONLY the kf dispatch doc + (the NOW slice) the gate-retarget folded at O.W2. It writes ZERO value.js source. value.js Tranche P formalizes VJ-L3 (binding) + the VJ-L1 spike into its own waves; kf consumes the **VJ-L3** publish on G.W16 (S8 is already closed in-realm at P.W11, not gated on this dispatch).

---

## Born-RED gate

**Gate (NEW):** `proof:valuejs-p-ask` — `scripts/proof-valuejs-p-ask.mjs`, authored by this wave; wired into `proof:hygiene` (the dispatch-integrity arm, NOT the blocking-correctness roster — a DISPATCH wave's gate asserts the ask is COHERENT + the consume-edge is still live, not that a foreign repo shipped).

**The FALSIFIABLE clause — `dispatch-live` (the REAL runtime observable).** The gate imports the INSTALLED `@mkbabb/value.js` and runs the capability probe the consume-edge actually depends on (VJ-L3 — the SOLE binding ask), then cross-checks the kf source still carries the workaround. Post-RE-SCOPE the **VJ-L3 probe is the PRIMARY blocker**; the VJ-L1 probe is **secondary-informational** (it asserts the ceremony-retirement spike is live, NOT a binding edge — S8 already has its terminal in P.W11's WeakMap):

1. **`vj-l3-absent`** (PRIMARY) — `("parseCSSSubValue" in vjs) === false`. **Today: RED-clause-TRUE** (absent → the BINDING ask is LIVE; S9 cannot delete without it). When value.js P ships VJ-L3, this flips → the S9 ask is DISCHARGED.
2. **`vj-l1-absent`** (SECONDARY-INFORMATIONAL, non-blocking) — `("flatLeaf" in vjs) === false` AND `("fnName" in new ValueUnit(...))`-shape provenance is unreachable. **Today: clause-TRUE** (the spike is open) — but this does NOT block the gate's GREEN: S8's terminal is P.W11's in-realm WeakMap, not VJ-L1. The clause records the ceremony-retirement spike's liveness for tracking only.
3. **`workaround-still-present`** (the cross-check — observable-truth, not a grep proxy of the ABSENCE): the kf HEAVY source STILL carries S9 (`grep 'from "@mkbabb/parse-that"' src/animation/utils.ts` → present). (S8's `FN_NAME` may already be swapped to the P.W11 WeakMap in-realm — the S8 presence is no longer this dispatch's GREEN condition.) This asserts the S9 dispatch is NOT prematurely closed — the parse-that workaround the binding ask exists to delete is genuinely still in the tree.

**How it is born-RED (the plant-a-failure).** The gate's GREEN condition is **"the BINDING ask is DISCHARGED"** — i.e. value.js P shipped **VJ-L3** (`parseCSSSubValue` present) **AND** kf deleted S9 (the consume landed at G.W16). VJ-L1/S8 are NOT in the GREEN condition (S8 closes in-realm at P.W11; VJ-L1 is a non-blocking spike). On today's tree the binding pair is false: the VJ-L3 API is absent (probe returns `false`) and the S9 workaround is present. So `proof:valuejs-p-ask` exits non-zero — born-RED — and stays RED until the round-trip (P VJ-L3 publish → kf S9 delete) completes. The RED is the GENUINE observable: a real `await import("@mkbabb/value.js")` returns an object WITHOUT `parseCSSSubValue`, and a real `grep` finds the direct `@mkbabb/parse-that` import still in the source. It is NOT a source-grep proxy for "did value.js ship" — it runs the live capability probe a consumer would.

| Clause | Witness on today's tree (1.0.2) | Failure mode TODAY (the REAL observable) | GREEN condition |
|--------|----------------------------------|-------------------------------------------|-----------------|
| `vj-l3-absent` (PRIMARY) | `"parseCSSSubValue" in (await import("@mkbabb/value.js"))` | `false` — no sub-value helper; kf must reach parse-that directly | VJ-L3 published; `parseCSSSubValue` present (the BINDING discharge) |
| `vj-l1-absent` (SECONDARY-INFORMATIONAL) | `"flatLeaf" in (await import("@mkbabb/value.js"))` | `false` — spike open; does NOT block GREEN (S8 terminal is P.W11 WeakMap) | tracked only; VJ-L1 re-opened on a measured clone-restamp bottleneck |
| `workaround-still-present` | `grep -n "@mkbabb/parse-that" src/animation/utils.ts` | `utils.ts:1` — S9 LIVE (S8 may already be P.W11-WeakMap-swapped in-realm) | S9 deleted at G.W16 (the VJ-L3 consume) |

**Anti-proxy note (inv-observable-truth).** The forbidden proxy here would be a gate that greps the kf docs for the string "VJ-L3 dispatched" and greens — asserting the ASK was authored, not that the API is genuinely absent. `proof:valuejs-p-ask` instead runs the live `import()` + `in` probe for `parseCSSSubValue` (the exact capability `proof:workaround-deletion` consumes at `:151,154`) so a phantom "we asked" can never green it; only a real value.js VJ-L3 publish + a real kf S9 delete can.

---

## Dependencies

- **value.js Tranche P (the dispatched sibling) — NOT YET CHARTERED.** This wave's BINDING ASK (VJ-L3) is its trigger. The audit recommends value.js P ship VJ-L3 FIRST as a small additive 1.1.0 patch (`AUDIT-DIGEST.md` B7/B10 — "value.js 1.1.0 could close both without a heavyweight tranche ceremony"). The NAMED tripwire: `("parseCSSSubValue" in require("@mkbabb/value.js"))` transitions `false → true` (the binding edge). The VJ-L1 spike's `("flatLeaf" in …)` transition is tracked but non-blocking.
- **G.W16 (the consume wave) — GATED on this dispatch's VJ-L3 discharge.** O.W16 deletes S9 (the parse-that dep) + adds the `proof:boundary` W96 parse-that-scan clause (born-RED on `utils.ts:1` today, becomes the commit-gate for the S9 deletion — `AUDIT-DIGEST.md` B9/B10). **S8's `FN_NAME` swap is EXTRACTED out of the VJ-L1-gated band into a NOW wave** (P.W11's WeakMap — see O.W16 RE-SCOPE). G.W16 is where the S9 consume half lands; O.W10 is the S9 ask half. They are the same DM-5/S9 terminal, split by phase (DISPATCH → GATED).
- **O.W7 (engine-seam transposition) — NOT VJ-L1-gated (the STRUCK dependency).** The `engine.ts` 1397→~900 split is **executable NOW** on the current tree (P CONTRIVANCE-AUDIT; FULL-LOOP-LEDGER `O.W7` KEEP — "FN_NAME confirmed scoped to concern 1, never read in concern 3"). The former claim that VJ-L1 unblocks O.W7 is FALSIFIED: the seam is in-realm by the file-split itself + P.W11's WeakMap. This dispatch carries NO O.W7-unblock edge.
- **O.W2 (ledger re-point) — the NOW slice this wave folds.** The `0.14.0` → `~<value.js-P>` version-sentinel retarget in `proof:workaround-deletion` S8/S9 arms (`proof-workaround-deletion.mjs:260,273`) lands at O.W2 so the gate stops over-reporting on a stale version (`O.md:82`).
- **No glass-ui dep, no parse-that-publish dep.** parse-that is terminal for O's needs at 0.11.0 (`O.md:144`); the S9 fix is a value.js-side ABSORPTION of the parse-that reach, not a parse-that change. The packrat-soundness item is a separate DM-4 KILL (`O.md:32`), not part of this ask.

---

## dev→impl boundary

This wave's DELIVERABLE is the dispatch doc `docs/tranches/O/KF-TO-VALUEJS-P-ASKS.md` (authored in this phase) + the `proof:valuejs-p-ask` gate SPEC (born-RED, falsifiable) + the O.W2-folded gate-retarget SPEC. The IMPLEMENTATION — writing `scripts/proof-valuejs-p-ask.mjs`, retargeting the `proof:workaround-deletion` version sentinels, and (at G.W16) deleting S8/S9 — opens only on the owner's explicit authorization, gate-first, born-RED, observable-truth, no-legacy. **inv-16:** kf authors the ASK + its own gate; value.js Tranche P writes the value.js source. The cross-repo need is a DISPATCH, never a foreign-tree edit.
