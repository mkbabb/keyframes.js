# P.W11 — the VJ-L1 WeakMap early-cure: the P-inv-28 chronicity-4 belt exit that UNBLOCKS O.W7 NOW (without waiting for value.js P)

**Band:** F — unblock (the P-inv-28 belt exit).
**Phase:** **NOW** — a PURE kf-internal refactor; no value.js API needed, no sibling publish gates it. Replaces the `Symbol("kf.fnName")` sidechannel with a kf-internal `WeakMap<ValueUnit, string>` populated at flatten time. (The VJ-L1 `flatLeaf` consume — the STRICTLY-PREFERRED cure that retires the S8 tripwire — remains dispatched at O.W16, VJ-L1-GATED; P.W11 is the kf-internal early-exit if value.js P slips.)
**Sequence:** `P.W11 (the WeakMap early-cure NOW) ─► O.W7 (engine-seam split, UNBLOCKED) ─► P.WZ (close; the engine arm exited, the P-inv-28 chronicity-4 belt discharged)`. The DAG edge this wave creates: **P.W11 dissolves the foreign-object breach NOW**, so O.W7's `engine-playback.ts` split no longer reads a `Symbol`-stamped foreign `ValueUnit` through the `utils.ts` seam — the split's one load-bearing cross-realm-state coupling is GONE, with or without value.js P.
**Owning DM/idea:** **the X4 `[radical·correctness]` "VJ-L1 WeakMap fallback gate"** (`AUDIT-DIGEST.md` X4-correctness :1115-1118 — "author the P-inv-28 belt fallback NOW as a parallel cure to unblock O.W7 engine-seam split") + the K5 fallback spec (`AUDIT-DIGEST.md` K5-defer-O :609-611) + the deferred-ledger-P **DP-5** (VJ-L1 WeakMap early-cure) fold. The two-arm S8 fallback the O.W16 §Dependencies + deferred-ledger-O named (arm (a) — "a realm-CLEAN kf-side `WeakMap<ValueUnit,string>` populated at flatten time (does NOT survive `.clone()`, so VJ-L1 stays strictly preferred)").

---

## Context

The hardest coupling in the constellation is kf's `engine.ts` god-object split (O.W7, 1397→~900L): the single largest structural debt in the library, named by the D.W4 audit and deferred through D→E→F→G→H→I→J→K→L→M→O. It is BLOCKED — not on the split's own complexity, but on a **cross-realm invisible-state coupling** the split would otherwise relocate unsafely: kf stamps a private `Symbol("kf.fnName")` onto **published value.js `ValueUnit` instances it does not own** (S8), re-stamped on every `.clone()` because `ValueUnit.clone()` drops it. Splitting the playback machine off the compile-facade while that Symbol sidechannel is live on a foreign class risks exactly the invisible-state coupling the D.W4 audit flagged. The canonical cure is value.js's VJ-L1 `flatLeaf(valueUnit, { fnName })` — but value.js O DEFERRED it (B7/B10 BLOCKER: `"flatLeaf" in require("@mkbabb/value.js") === false` on 1.0.2), so S8 is at **chronicity 4** (K, L, M, O → P) and the **P-inv-28 belt FIRES this tranche** (deferred-ledger-P:160: "P-inv-28 belt active at chronicity 4").

P.W11 is the **P-inv-28 chronicity-4 belt EXIT**: a kf-internal early-cure that dissolves the foreign-object breach NOW, unblocking O.W7 immediately, without waiting for value.js P's VJ-L1 publish (which has no timeline). It is strictly INFERIOR to the VJ-L1 consume in ONE specific way (it does NOT survive `.clone()`, so the re-stamp ceremony stays, so the S8 *tripwire* is NOT retired) — but it is strictly SUPERIOR to the Symbol in the ONE way that matters for O.W7: it is **realm-CLEAN** (no foreign-object annotation), so the split's cross-realm coupling is GONE.

### What S8 is, grounded (the foreign-object breach)

kf flattens value.js's parse tree to bare leaf `ValueUnit`s for interpolation. value.js's `flattenObject` dissolves the `FunctionValue` wrapper, DROPPING `FunctionValue.name` (`scale`, `translateX`, `brightness`, …). But kf's identity-aware arity pad (`createInterpVarValue`, `utils.ts:347-366`) NEEDS that name: when one keyframe has `scale(2)` and the opposing keyframe lacks `scale`, the pad must fill the absent slot with the function's CSS IDENTITY element (`scale → 1`, `translateX → 0px`, `brightness → 1`) via value.js's `functionIdentityValue` — NOT a bare `0` (which would silently lerp from black/zero, MCI-5). So kf re-attaches the dropped name at flatten time. The mechanism (the breach):

- `utils.ts:45` — `const FN_NAME = Symbol("kf.fnName")` — a private Symbol.
- `utils.ts:47` — `type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }` — the foreign class, annotated.
- `utils.ts:50-51` — `fnNameOf(u)` reads the stamp off a leaf.
- `utils.ts:54-55` — `stampFnName(u, name)` WRITES the Symbol onto a `ValueUnit` instance.
- `utils.ts:64` — stamp-on-clone inside `flattenToValueUnits` (`stampFnName(value.clone(), fnName ?? fnNameOf(value))`).
- `utils.ts:289-294` — re-stamp after `tryParseLeaves`' bounded-LRU cache returns master clones (`stampFnName(m.clone(), fnNameOf(m))`).

This is **writing state onto a published class kf does not own** — the canonical "owned-Symbol-on-external-class" anti-pattern (⚠18 in the M.md precept reckoning, O.W16 §S8). The Symbol is invisible to value.js, invisible to any value.js maintainer, and survives across the realm boundary as a property on a foreign object.

### The transposition — a kf-internal `WeakMap<ValueUnit, string>` (realm-CLEAN, populated at flatten time)

The X4 / K5 cure (`AUDIT-DIGEST.md` X4 :1116, K5 :609-611): replace the foreign-object Symbol with a kf-INTERNAL side table keyed by the `ValueUnit` instance:

```ts
//                                  the leaf       the fnName
const FN_NAME_MAP = new WeakMap<ValueUnit, string>();
const fnNameOf   = (u: ValueUnit) => FN_NAME_MAP.get(u);
const stampFnName = (u: ValueUnit, name: string | undefined): ValueUnit => {
    if (name !== undefined) FN_NAME_MAP.set(u, name);
    return u;
};
```

The call-sites (`utils.ts:64`, `:289-294`, and the reads in `createInterpVarValue`) are UNCHANGED in shape — `stampFnName`/`fnNameOf` keep their signatures; only their bodies swap the `[FN_NAME]` property access for a `WeakMap.set`/`.get`. The `NamedValueUnit` intersection type (`:47`) is DELETED (no foreign-object annotation type remains). The provenance now lives ENTIRELY on the kf side — value.js's `ValueUnit` is never mutated, never annotated, never carries a kf Symbol across the realm.

**Why it is realm-CLEAN (the O.W7-unblock the whole wave exists for).** The Symbol stamp is a property ON the foreign object — it crosses the realm boundary as object state, the exact invisible cross-realm coupling O.W7's split must not relocate blindly. The WeakMap is a kf-MODULE-LOCAL table — the `ValueUnit` is merely a KEY (a reference, never mutated). The provenance never leaves the kf realm. So when O.W7 lifts the playback machine off the compile-facade, the `utils.ts` interp seam it reaches through carries NO foreign-object state — the split's one load-bearing cross-realm coupling is DISSOLVED. O.W7 can proceed with or without value.js P.

### Why it is STRICTLY INFERIOR to VJ-L1 (the honest accounting — the S8 tripwire is NOT retired)

A `WeakMap` keyed by `ValueUnit` does **not survive `ValueUnit.clone()`**: a clone is a NEW instance, absent from the map, so the provenance does not carry. kf's pipeline clones constantly (the bounded-LRU `tryParseLeaves` returns master clones per use-site, `utils.ts:289-294`; `flattenToValueUnits` clones at `:64`). So the **re-stamp ceremony STAYS** — every clone must `stampFnName(m.clone(), fnNameOf(m))` to copy the provenance from the master to the clone, exactly as today. This is the same ceremony the Symbol required, for the same reason (clone drops the provenance).

VJ-L1 `flatLeaf` is strictly preferred because value.js's `ValueUnit.clone()` would PRESERVE a native `fnName` field — dissolving the re-stamp ceremony ENTIRELY, AND moving the provenance into value.js's owned API (no kf-side carrier at all). So:

- **VJ-L1 (O.W16, the canonical cure):** retires the foreign-object breach (the field is value.js's own) AND the re-stamp ceremony (clone preserves it) AND retires the S8 *tripwire* (`proof:workaround-deletion` S8 → GREEN, probed `"fnName" in new ValueUnit(0,'px') === true`).
- **P.W11 (the WeakMap early-cure):** retires the foreign-object breach (realm-CLEAN) BUT keeps the re-stamp ceremony (WeakMap doesn't survive clone) AND does NOT retire the S8 *tripwire* (the tripwire greens only on VJ-L1 api-present; the WeakMap is not VJ-L1). The `proof:workaround-deletion` S8 arm STAYS PENDING after P.W11 — deferred-ledger-P:214 is explicit: "P.W11: S8 arm stays PENDING (WeakMap doesn't retire the tripwire)."

**The P-inv-28 honesty (the belt-exit, not the chronic close).** P.W11 is the chronicity-4 belt EXIT for the O.W7-BLOCKING arm of S8 — it dissolves the breach that BLOCKS the engine split, so the split lands THIS tranche (the structural debt named since D.W4 finally cleared). It is NOT the S8 chronic CLOSE — that requires VJ-L1 (the tripwire-retiring cure), which stays dispatched at O.W16. P.W11 is the early-exit that says "the breach is dissolved kf-internally, the split is unblocked, and the canonical cure is still preferred and still dispatched" — the P-inv-28-compliant terminal disposition for THIS tranche, never a perpetual punt.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-20) |
|-----|-----------------|------------------------------|
| the breach | `src/animation/utils.ts:45` | `const FN_NAME = Symbol("kf.fnName")` — a private Symbol stamped onto published value.js `ValueUnit` instances (the foreign-object annotation) |
| the foreign type | `src/animation/utils.ts:47` | `type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }` — the annotated foreign class (DELETED by the WeakMap cure) |
| the read/write | `src/animation/utils.ts:50-51,54-55` | `fnNameOf(u)` reads `(u as NamedValueUnit)[FN_NAME]`; `stampFnName(u, name)` writes it — the side-table interface (signatures UNCHANGED by the cure) |
| stamp-on-clone | `src/animation/utils.ts:64` | `stampFnName(value.clone(), fnName ?? fnNameOf(value))` — the clone re-stamp inside `flattenToValueUnits` (the ceremony that STAYS) |
| re-stamp after cache | `src/animation/utils.ts:289-294` | the bounded-LRU returns master clones; each re-stamped per use-site (`stampFnName(m.clone(), fnNameOf(m))`) — the ceremony the WeakMap does NOT dissolve |
| the consumer (why provenance matters) | `src/animation/utils.ts:347-366` | `createInterpVarValue`'s identity-aware arity pad: `scale → 1`, `translateX → 0px`, `brightness → 1` via `functionIdentityValue` off the stamped name — NOT a bare `0` (MCI-5) |
| VJ-L1 unshipped | live probe on `@mkbabb/value.js@1.0.2` | `"flatLeaf" in require("@mkbabb/value.js") === false` AND `"fnName" in new ValueUnit(0,'px') === false` — VJ-L1 DEFERRED by value.js O (B7/B10 BLOCKER) |
| the O.W7 block | `docs/tranches/O/waves/O.W7.md:59-70` | the FN_NAME-stamp split is BLOCKED on VJ-L1 — "splitting the playback machine off the facade WHILE that Symbol sidechannel is live on a class kf does not own risks exactly the invisible-state coupling the D.W4 audit flagged" |
| the fallback named | `docs/tranches/O/waves/O.W16.md:120` | "the two-arm fallback if value.js P slips: S8 → a kf-side `WeakMap<ValueUnit, string>` populated at flatten time (realm-CLEAN, dissolves the foreign-object-annotation breach … BUT does NOT survive `ValueUnit.clone()`, so the clone-restamp ceremony stays; VJ-L1 is therefore still strictly preferred)" |
| the chronicity | `audit/deferred-ledger-P.md:160` | "S8 FN_NAME … chronicity 4 (K,L,M,O→P) — P-inv-28 belt FIRES. P.W11 WeakMap fallback is the kf-internal early exit … clone-restamp ceremony STAYS … strictly inferior to VJ-L1 but P-inv-28-compliant for THIS tranche" |
| the X4 cure | `audit/AUDIT-DIGEST.md` X4-correctness :1115-1118 | `[radical·correctness]` "VJ-L1 WeakMap fallback gate … unblocks O.W7 (engine.ts 1397→~900 LoC god-object split) … Pure kf-internal refactor. No value.js API needed" + the born-RED grep gate |
| DP-5 fold | `audit/deferred-ledger-P.md:173,218` | "DP-5 VJ-L1 WeakMap early-cure → FOLD → P.W11 … P-inv-28-compliant kf-internal exit for S8 if value.js P slips. Does NOT retire S8 tripwire" |

---

## Scope

### S1 — author the `proof:no-foreign-symbol-stamp` born-RED gate FIRST (the realm-cleanliness keystone)

**Breach.** No gate asserts kf carries no Symbol stamped onto a foreign value.js class. The S8 breach is caught today only by `proof:workaround-deletion`'s S8 arm — which is RETIRED only by VJ-L1 (api-present), so it cannot certify the WeakMap cure (which keeps S8 PENDING). The realm-cleanliness — the actual O.W7-unblock — is UN-GATED.

**Cure (gate-first — author the RED before the swap).** Author `scripts/proof-no-foreign-symbol-stamp.mjs`: scan `src/animation/**` for a `Symbol(…)` whose value is then used as a COMPUTED-KEY property on an imported value.js type (`(u as … )[SYMBOL]` over a `ValueUnit`/`Color`/value.js class) — assert ZERO. Born-RED today (`utils.ts:45-64` is the live violator: a `Symbol` stamped onto `ValueUnit`). GREEN after the WeakMap swap (the Symbol is gone; the WeakMap keys the `ValueUnit`, never mutates it). This is the gate that certifies the **realm-cleanliness** the WeakMap delivers and the Symbol violated — distinct from `proof:workaround-deletion` S8 (which gates the VJ-L1 tripwire). Wire into `proof:hygiene`.

### S2 — swap the `Symbol` sidechannel for the kf-internal `WeakMap<ValueUnit, string>`

**Breach (S8).** `const FN_NAME = Symbol("kf.fnName")` (`:45`), `type NamedValueUnit` (`:47`), `fnNameOf`/`stampFnName` reading/writing the Symbol property (`:50-55`), stamped at `:64`, `:289-294`.

**Cure.**
1. Replace `const FN_NAME = Symbol("kf.fnName")` with `const FN_NAME_MAP = new WeakMap<ValueUnit, string>()`.
2. DELETE `type NamedValueUnit` (`:47`) — no foreign-object annotation type remains.
3. Re-body `fnNameOf` as `FN_NAME_MAP.get(u)` and `stampFnName` as `if (name !== undefined) FN_NAME_MAP.set(u, name)` — signatures UNCHANGED, so every call-site (`:64`, `:289-294`, the `createInterpVarValue` reads) is untouched.
4. **The re-stamp ceremony STAYS** (the honest inferiority): `stampFnName(m.clone(), fnNameOf(m))` at `:64`/`:289-294` is unchanged — the WeakMap doesn't survive `.clone()`, so the provenance must still copy master→clone exactly as today. (This is the ONE way the WeakMap is strictly inferior to VJ-L1; documented, not hidden.)

The provenance now lives ENTIRELY kf-side; value.js's `ValueUnit` is never mutated. The realm is clean.

### S3 — UNBLOCK O.W7: the engine-seam split reads a realm-CLEAN `utils.ts` seam (the wave's payoff)

**Breach.** O.W7's `engine-playback.ts` split is BLOCKED because the `utils.ts` interp seam it reaches through carries the foreign-object Symbol state — the split would relocate the cross-realm coupling blindly.

**Cure (the unblock, not a new edit — O.W7 owns the split).** With S2 landed, the `utils.ts` seam carries NO foreign-object state. O.W7's split precondition (a realm-clean seam) is MET — with or without value.js P. P.W11 does NOT perform the split (O.W7 owns it); it DISSOLVES the precondition blocker. The O.W7 spec's "blocked on VJ-L1" gate is satisfied by EITHER VJ-L1 (O.W16, the canonical) OR P.W11's WeakMap (the early-exit) — whichever lands first. P.W11 makes it the early-exit.

### S4 — record the P-inv-28 belt-exit verdict (the honest disposition)

Record in `PROGRESS.md §"Open deferrals"` (and the chronic ledger the close reads): the S8 O.W7-BLOCKING arm EXITED via the WeakMap early-cure (the breach dissolved, the engine split unblocked THIS tranche); the S8 TRIPWIRE arm STAYS PENDING on VJ-L1 (O.W16) — the canonical cure still preferred, still dispatched. This is the P-inv-28-compliant disposition: the belt-blocking obligation discharged, the tripwire-retiring obligation named with its terminal home (value.js P VJ-L1), neither a perpetual punt.

---

## Born-RED gate

### `proof:no-foreign-symbol-stamp` (NEW — `scripts/proof-no-foreign-symbol-stamp.mjs`) + `proof:decomposition` (the O.W7-unblock acceptance)

| Clause | Witness on today's (2026-06-20) tree | The REAL observable | GREEN condition |
|---|---|---|---|
| `no-foreign-symbol-stamp` (S1 — **KEYSTONE realm-cleanliness**) | `grep -n 'Symbol("kf\.\|FN_NAME' src/animation/utils.ts` → `:45,47,50-55,64,289-294` (7+ hits) | a `Symbol("kf.fnName")` is stamped onto published value.js `ValueUnit` instances — the foreign-object-annotation breach (state ON a class kf does not own, crossing the realm) | ZERO `Symbol(…)`-stamped-onto-`ValueUnit` hits; the provenance lives on a kf-internal `WeakMap<ValueUnit, string>` (the `ValueUnit` is a KEY, never mutated) |
| `provenance-preserved` (S2 — correctness, the non-negotiable) | the arity pad resolves `scale → 1`, `translateX → 0px` via the stamped name today | the WeakMap swap MUST preserve the identity-pad provenance byte-for-byte — a clone whose provenance is lost resolves a bare `0` (wrong matrix → wrong frame, MCI-5), caught by `proof:interpolate-anything` | `proof:interpolate-anything`'s arity-pad fixture GREEN through the swap — the re-stamp ceremony (kept, S2.4) copies master→clone provenance exactly as the Symbol did |
| `O.W7-unblocked` (S3 — the wave's payoff) | `wc -l src/animation/engine.ts` → 1397L; `proof-decomposition.mjs` exits 0 ONLY because the 1400 override masks the god-object; the split is BLOCKED on the foreign-Symbol coupling | the engine split is gated on a realm-clean `utils.ts` seam; today the seam carries the foreign Symbol, so the split's cross-realm coupling is un-relocatable | the `utils.ts` seam is realm-clean (S2); O.W7's split precondition MET; O.W7 lands engine.ts 1397→~900L, `proof:decomposition` exits 0 WITHOUT the 1400 override — with or without value.js P |
| `S8-tripwire-honest` (S4 — the inferiority, declared) | `proof:workaround-deletion` S8 arm: `"flatLeaf" in vjs === false` → PENDING | the WeakMap does NOT retire the S8 tripwire (it is not VJ-L1 api-present) — claiming otherwise would be a record-as-built lie | `proof:workaround-deletion` S8 STAYS PENDING after P.W11 (honest); it flips GREEN only on VJ-L1 (O.W16) — the disposition recorded (S4), the inferiority not hidden |

### How it is born-RED via a planted failure

- **`no-foreign-symbol-stamp` is born-RED with NO plant needed** — `utils.ts:45` (`Symbol("kf.fnName")`) stamped onto `ValueUnit` is live the instant the gate runs (7+ hits). **The discriminating bite (the proxy-trap guard):** a cure that merely RENAMES the Symbol (`Symbol("kf.origin")`) or moves it to a `const` in another module STILL reds — the gate matches the SHAPE (`Symbol(…)` used as a computed-key property on a value.js-imported type), not the literal string `kf.fnName`. The genuine green requires the Symbol-stamp PATTERN gone (the WeakMap keys the object instead of mutating it). A cure that swaps `Symbol` for a string-keyed `(u as any).__fnName = name` (a different foreign-object-mutation) ALSO reds — the gate bites "any kf-owned property/symbol written onto a foreign value.js instance," not just `Symbol`.
- **`provenance-preserved` is the correctness floor** — born-RED via a PLANTED break: drop the re-stamp at `:289-294` (so a clone loses its provenance) → `proof:interpolate-anything`'s arity-pad fixture REDs (the pad resolves a bare `0`, the matrix wrong). This proves the gate measures the GENUINE observable (the interpolated frame is correct), not the source shape — the WeakMap cure MUST keep the ceremony, and the fixture certifies it.
- **`O.W7-unblocked` is born-RED via the existing decomposition witness** — remove the `engine.ts:1400` override → `proof:decomposition` exits 1 naming engine.ts at 1397L over the 550 base (the O.W7 §S4 born-RED). The discriminating bite: the unblock is the REALM-CLEAN seam, not the line count — a split that drops the line count but leaves the foreign Symbol live (a partial extraction that still reads `(u as NamedValueUnit)[FN_NAME]` in `engine-playback.ts`) reds `no-foreign-symbol-stamp` even though `proof:decomposition` greened. The two gates COMPOSE: the split is accepted only when BOTH the file shrinks AND the seam is realm-clean.
- **`S8-tripwire-honest` is born-RED-by-truth** — `proof:workaround-deletion` S8 is PENDING today (`flatLeaf in vjs === false`) and STAYS PENDING after P.W11 (the WeakMap is not VJ-L1). The "born-RED" here is the HONESTY gate: a record-as-built check (S4) that the WeakMap cure does NOT claim the S8 tripwire retired — any PROGRESS note asserting "S8 GREEN" after P.W11 (without VJ-L1) is the lie the gate forbids. The disposition is "belt-exit, tripwire-pending."

**Structural / behavioural gates (not perf floors).** `no-foreign-symbol-stamp` is a source-shape structural scan (device-independent); `provenance-preserved` is the existing `proof:interpolate-anything` behavioural fixture; `O.W7-unblocked` is the existing `proof:decomposition` line-count witness. No perf-ratio, no CI device-dependence. CI posture: HARD via `declarePosture(hard)`.

---

## Dependencies

- **NO value.js API needed — the defining fact.** P.W11 is a PURE kf-internal refactor (`AUDIT-DIGEST.md` X4 :1117). The `WeakMap<ValueUnit, string>` is idiomatic TS; `ValueUnit` is imported as a TYPE (already on the static barrel via the heavy surface). No `flatLeaf`, no value.js publish, no re-pin. Phase NOW, zero sibling gate. This is precisely why it is the P-inv-28 belt EXIT — it cannot slip on a sibling's timeline.
- **O.W7 (the engine-seam split) — the wave UNBLOCKS it; sequence P.W11 → O.W7.** O.W7's split precondition is a realm-clean `utils.ts` seam. Today that seam carries the foreign Symbol; P.W11 dissolves it. So O.W7's "blocked on VJ-L1" gate is satisfied by P.W11 (the early-exit) OR VJ-L1 (O.W16, the canonical) — whichever lands first. P.W11 makes it landable NOW. (O.W7 itself re-sequences under P as the engine split; its acceptance is the O.W7/M.W13 behavioural suite, unchanged.)
- **O.W16 (the VJ-L1 consume) — the STRICTLY-PREFERRED cure, NOT replaced.** P.W11 is the EARLY-EXIT, not the terminal close. O.W16 stays dispatched (VJ-L1-GATED): when value.js P ships VJ-L1, O.W16 deletes the WeakMap (replacing it with the native `.fnName` field), dissolves the re-stamp ceremony (clone preserves the field), AND retires the S8 tripwire (`proof:workaround-deletion` S8 → GREEN). P.W11's WeakMap is a WAYPOINT — the canonical cure supersedes it. The sequence: P.W11 (WeakMap, NOW) → [if VJ-L1 ships] O.W16 (replace WeakMap with `.fnName`, retire tripwire). If VJ-L1 NEVER ships, the WeakMap STANDS as the realm-clean cure (the breach dissolved, the ceremony the documented cost) — the belt-exit is permanent-if-necessary.
- **`proof:interpolate-anything` — the correctness oracle (existing).** The arity-pad fixture is the regression oracle for `provenance-preserved`. P.W11 keeps it GREEN through the swap. No new fixture needed (the existing one bites a lost-provenance clone).
- **`proof:workaround-deletion` S8 arm — STAYS PENDING (the honest accounting).** P.W11 does NOT touch the S8 tripwire (which retires only on VJ-L1). The `no-foreign-symbol-stamp` gate (S1) is the SEPARATE realm-cleanliness certification the WeakMap cure DOES satisfy — the two gates are distinct (tripwire-retirement vs realm-cleanliness), and P.W11 greens the latter while the former stays VJ-L1-pending.
- **DP-5 fold (deferred-ledger-P:173).** DP-5 (VJ-L1 WeakMap early-cure) folds to this wave. The disposition: belt-exit (the O.W7-block dissolved), tripwire-pending (VJ-L1, O.W16). No 5th carry — the obligation has a gate-verified terminal (the engine split lands; the canonical cure stays named).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W11 — **DOCS ONLY** (inv-16: kf writes only keyframes.js; the WeakMap is a kf-INTERNAL refactor, no cross-repo edit; the VJ-L1 canonical cure is dispatched at O.W16/KF-TO-VALUEJS-P.md). The IMPLEMENTATION (the `proof:no-foreign-symbol-stamp` gate, the `Symbol`→`WeakMap` swap, the `NamedValueUnit` type deletion, the O.W7-unblock, the belt-exit disposition record) opens ONLY on the owner's explicit authorization. Phase NOW: zero sibling publish gates the landing — the WeakMap is pure kf-internal. When it opens it is:

- **gate-first** — `proof:no-foreign-symbol-stamp` (S1) authored born-RED BEFORE the `Symbol`→`WeakMap` swap; the realm-cleanliness witness (the Symbol on `ValueUnit`) live on today's tree.
- **observable-truth** — `no-foreign-symbol-stamp` bites the foreign-object-mutation SHAPE (any kf-owned property/symbol written onto a value.js instance), not the literal `kf.fnName` string; `provenance-preserved` is the `proof:interpolate-anything` behavioural fixture (a lost-provenance clone resolves a wrong matrix, the genuine defect), not a source proxy; `S8-tripwire-honest` forbids the record-as-built lie that P.W11 retired the S8 tripwire (it did not — VJ-L1 does).
- **gestalt (the transposition)** — the foreign-object Symbol sidechannel is dissolved into a kf-MODULE-LOCAL side table (the `ValueUnit` a key, never mutated) — a realm-cleanliness transposition that UNBLOCKS the largest structural debt in the library (the O.W7 engine split, deferred since D.W4) WITHOUT waiting for a sibling. The deepest no-workaround move available NOW.
- **KISS** — the swap is a `Symbol`→`WeakMap` body change with UNCHANGED `fnNameOf`/`stampFnName` signatures (every call-site untouched) + one type deletion. The re-stamp ceremony is KEPT (the WeakMap's honest cost), not engineered around.
- **P-invariant-28 (the chronicity-4 belt EXIT)** — S8 is at chronicity 4 (the belt FIRES this tranche). P.W11 is the kf-internal EXIT for the O.W7-BLOCKING arm: the breach dissolved, the engine split landable THIS tranche, the canonical VJ-L1 cure still preferred + still dispatched (O.W16). The disposition (belt-exit + tripwire-pending) is recorded (S4) — a gate-verified terminal for the O.W7-block, never a perpetual punt; if VJ-L1 never ships, the realm-clean WeakMap STANDS as the permanent cure (the ceremony its documented cost). The S8 tripwire's terminal home (value.js P VJ-L1) is NAMED, not dropped.

**Full-loop disposition (`docs/tranches/P/FULL-LOOP-LEDGER.md` P.W11-weakmap): [ADOPT] as specified — no augmentation needed.** The full-loop ran three in-realm probes (`npx tsx`, kf source imports, project-root node_modules resolution) that VALIDATED the cure end-to-end:
- **PROBE 1 (correctness-neutral / byte-equivalent):** the real `utils.ts` pipeline `parseAndFlattenObject({transform:'scale(2) translateX(10px)'})` → 4 leaves; `createInterpVarValue` padded the opposing 1-leaf frame up to 4 via the stamped name → 4 well-formed interp vars, no throw (2/2 PASS — the provenance pipeline works TODAY under the Symbol, and the WeakMap swap is byte-equivalent over the 4-leaf + 20-arity-pad interp vars).
- **PROBE 2 (realm-cleanliness):** the WeakMap stamp leaves the `ValueUnit` with ZERO kf own-symbols (`Object.getOwnPropertySymbols` empty) — vs the Symbol's own-property breach. This is the realm-cleanliness the `no-foreign-symbol-stamp` gate (S1) certifies and the O.W7-unblock turns on.
- **PROBE 3 (VJ-L1 absence):** `flatLeaf in vjs === false`, `'fnName' in new ValueUnit(0,'px') === false` on value.js@1.0.2 — confirming the honest-inferiority accounting (the WeakMap doesn't survive `.clone()`, so the re-stamp ceremony stays and the S8 tripwire is NOT retired).

This is the **S8 TERMINAL for the O.W7-BLOCKING arm**: VJ-L1 is NOT needed and O.W7 is NOT VJ-L1-gated — corroborated by the O.W7 spec itself (`docs/tranches/O/waves/O.W7.md:67-74` names P.W11's in-realm `WeakMap<ValueUnit,string>` "the TERMINAL cure — realm-clean, no cross-realm owner"). The S8 *tripwire* arm stays PENDING on VJ-L1 (O.W16, strictly preferred, still dispatched) — that inferiority is accurate and not hidden. The VJ-L1 `flatLeaf` canonical cure remains a DISPATCH finding for O.W16, not authored here (inv-16).

The born-RED witness (the `Symbol("kf.fnName")` stamped onto published value.js `ValueUnit` instances at `utils.ts:45-64,289-294`; the foreign-object `NamedValueUnit` annotation; engine.ts at 1397L blocked by the live Symbol seam) stands on today's tree; the cure opens on authorization.
