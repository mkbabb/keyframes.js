# O.W16 — value.js-P consume: S8 FN_NAME + S9 parse-that delete + W96 boundary scan GREEN

> **CANON #9 scope note.** The `leaves.ts` → `@mkbabb/value.js/math` `lerpArray`/§14 swap has been STRUCK from this wave — it belongs to **O.W9 §S3 ONLY** (the four-function `clamp`/`scale`/`lerp`/`lerpArray` swap + the stale `leaves.ts:56–61` comment delete, phased NOW). O.W16 keeps ONLY the S8 FN_NAME delete + the S9 parse-that delete + the `proof:boundary` W96 parse-that source-scan. No `leaves.ts` edit lands in this wave.

**Band:** G — value.js-P consume
**Phase:** GATED (value.js Tranche P — fires atomically on VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue publish)
**Sequence:** O.W10 (the KF-TO-VALUEJS-P-ASKS dispatch authored) → *value.js P VJ-L1/L3 publish fires* → **O.W16** (S8 FN_NAME + S9 parse-that delete) → **O.W7** (engine-seam transposition unblocked) → O.WZ (close; `proof:chronic-closure` reads DF-11-A discharged). The value.js-P spine edge is `O.W16 → O.W7 → O.WZ` — O.W7 sits BETWEEN this wave and the close, NOT a dangling "(VJ-L1)" label.
**Owning chronic/DM:** DM-5 S8 + S9 arms (chronicity 3 at O: K, L, M → O; P-inv-28 terminal window named — the `P-inv-28 >=4` belt fires at **kf-P** (the NEXT kf tranche after O, NOT kf-Q) if value.js P slips, and the two-arm fallback applies — S8 → a realm-CLEAN kf-side `WeakMap<ValueUnit,string>` populated at flatten time (does NOT survive `.clone()`, so VJ-L1 stays strictly preferred); S9 → a DECLARED `proof:boundary`-allow-listed spine-edge quarantine, NOT eliminable without VJ-L3)

---

## Context

M.W9 developed the value.js-O consume spec in full (docs/tranches/M/waves/M.W9.md). The campaign implemented S7 (the `linear()` flat-comma normalize regex — deleted on value.js 1.0.0 VJ-L2 consume, now GREEN). But VJ-L1 (`flatLeaf` provenance API) and VJ-L3 (`parseCSSSubValue` helper) were DEFERRED by value.js Tranche O and are absent from ALL published versions through 1.0.2 (confirmed by live probe: `"flatLeaf" in vjs === false`, `"parseCSSSubValue" in vjs === false`; audit B10, B11). As a result, two active precept violations remain in kf's `src/animation/utils.ts`:

- **S8 — the `FN_NAME` Symbol sidechannel** (`utils.ts:45–57`): kf stamps a private `Symbol("kf.fnName")` onto published `ValueUnit` instances to carry the flatten-origin function name. `flattenObject`/value.js dissolves `FunctionValue` wrappers into bare leaf `ValueUnit`s, dropping the function-token name (`scale`, `translateX`, `brightness`, …); the identity-aware arity pad in `createInterpVarValue` (`utils.ts:347–366`) needs `scale → 1`, `translateX → 0px`, `brightness → 1` (not a bare `0`) when the opposing keyframe lacks that function. `ValueUnit.clone()` does NOT preserve the stamp, so kf re-stamps on every clone (`:64`, `:218`, `:294`, `:298`). This is writing state onto a published class kf does not own — the canonical `"owned-Symbol-on-external-class"` anti-pattern; ⚠18 in the M.md precept reckoning.

- **S9 — the direct `@mkbabb/parse-that` production dep** (`utils.ts:1`): `import { any as parseAny } from "@mkbabb/parse-that"`. Used at `utils.ts:229,236` inside `tryParseLeaves` to compose value.js's OWN parsers (`CSSFunction.FunctionArgs` + `CSSValues.Value`) via parse-that's `any` combinator, because value.js exposes no public `parseCSSSubValue(property, str)` entrypoint (live-probed: `grep "parseCSSSubValue" node_modules/@mkbabb/value.js/dist/index.d.ts` → zero hits). `package.json` carries `"@mkbabb/parse-that": "^0.11.0"` as a live production dep. This breaks the acyclic spine (parse-that → value.js → kf → glass-ui) at the `package.json` level; the cross-realm nominal-type mismatch is papered with `(parseAny as any)` casts; ⚠24 in M.md.

Both are correctly held PENDING by `proof:workaround-deletion`'s three-state model. The W96 parse-that scan — named in L.W9.md §S9 and M.W9 §S5 as the gate-completeness cure — has NEVER been implemented: `scripts/proof-boundary.mjs`'s `holdsValueJsSpecifier` (`:93–107`) matches only `@mkbabb/value.js` specifiers; the two `parse-that` mentions in the file (`:54`, `:192`) are prose-only — no assertion scans any kf source module for a direct parse-that import (audit B10, B11, C15). The W96 hole is the M.md viol-M8 cure: O.W16 authors the scan **born-RED on today's tree**, then it flips GREEN when S9 deletes `utils.ts:1`.

The `src/animation/internal/leaves.ts:68–80` inline `lerpArray` copy (and the byte-equivalent `clamp`/`scale`/`lerp` inlines + the stale `leaves.ts:56–61` "no ./math subpath" comment) is NOT this wave's concern — the four-function `@mkbabb/value.js/math` swap belongs to **O.W9 §S3** (phased NOW; the `./math` subpath is confirmed live at `node_modules/@mkbabb/value.js/dist/subpaths/math.d.ts`, audit E21). O.W16 touches `src/animation/utils.ts` + `scripts/proof-boundary.mjs` + `package.json` ONLY; it does not edit `leaves.ts` (CANON #9).

**The O.W10 dispatch is the upstream action.** O.W10 dispatches `KF-TO-VALUEJS-P-ASKS.md` to the value.js owner, requesting VJ-L1 (a first-class `fnName` field on `ValueUnit`, preserved by `.clone()`) and VJ-L3 (a `parseCSSSubValue(property, value)` thin wrapper over the existing internal parser). O.W16 is the kf-side consume that fires once value.js P publishes those APIs. kf cannot write value.js (inv-16). The dispatch text is precise (see O.W10); this wave is the delete.

### Audit evidence

| Lane / ref | Source location | Fact (live-probed 2026-06-19) |
|---|---|---|
| B10, B11 | `src/animation/utils.ts:45–57` | `FN_NAME = Symbol("kf.fnName")`, `NamedValueUnit`, `fnNameOf`, `stampFnName` — 7+ call-sites; S8 PENDING |
| B10, B11 | `src/animation/utils.ts:1` | `import { any as parseAny } from "@mkbabb/parse-that"` — the live production dep; S9 PENDING |
| B10, B11 | `package.json:~215` | `"@mkbabb/parse-that": "^0.11.0"` — the dep to remove |
| B7, B8 | `node -e "'flatLeaf' in require('@mkbabb/value.js')"` | `false` — VJ-L1 absent from 1.0.2 |
| B7, B8 | `node -e "'parseCSSSubValue' in require('@mkbabb/value.js')"` | `false` — VJ-L3 absent from 1.0.2 |
| B11, C15 | `scripts/proof-boundary.mjs:93–107` | `holdsValueJsSpecifier` — matches only `@mkbabb/value.js`, NOT `@mkbabb/parse-that`; W96 ABSENT |
| B9 | `scripts/proof-workaround-deletion.mjs` live | `S8=PENDING S9=PENDING` (1 GREEN / 4 PENDING, exit 0) |

---

## Scope

### S1 — Author the `proof:boundary` W96 parse-that source-scan (born-RED, gate-first, TODAY)

**Breach (viol-M8 / gate-completeness).** L.W9.md:368–381 NAMED the extension; M.W9 §S5 developed it in full. Never implemented. `holdsValueJsSpecifier` scans only value.js specifiers; a HEAVY module importing parse-that directly evades the gate silently.

**Cure.** Extend `scripts/proof-boundary.mjs` with a `holdsParseThatSpecifier(src)` companion — the same `(?:import|export)\b…from ["']@mkbabb\/parse-that(?:\/[^"']*)?["']` + bare side-effect-import regex, with `import type` stripped first. Run it over the SAME module sets the existing assertions derive (the full `src/animation/**` tree, not a hand-maintained name list). The new assertion joins the existing source-grep complement (assertion 4 in the gate's four-clause structure) — no new script entry needed, the assertion is added to the existing gate.

**Born-RED witness.** With the assertion added and `utils.ts:1`'s import STILL present, `node scripts/proof-boundary.mjs` exits 1 naming `src/animation/utils.ts`. This is the genuine `inv-L-acyclic-purity` violation — not a proxy. The gate GREENs only when S3 deletes the import.

**Two-witness sequencing.** Author S1 FIRST — before S2/S3/S4 and before value.js P publishes. The gate must bite the live violation (the L.W1 NaN-frame lesson: gate-first, observable-truth). The GREEN state is achieved in S4's atomic commit.

### S2 — Re-pin `@mkbabb/value.js` to the P-publish semver

**Cure.** On value.js Tranche P publishing with VJ-L1 + VJ-L3 (and optionally the `./math` subpath if it was not shipped in earlier versions), bump the pin in `package.json` to `^<P-version>` and re-install. NO `file:` pin, NO `overrides`, NO vendored grammar.

**Gate bite.** `proof:workaround-deletion` S8/S9 arms transition from PENDING (PRESENT + sibling UNPUBLISHED) to truly RED (PRESENT + PUBLISHED), signaling the cure exists but kf has not yet consumed. S3+S4 then flip both GREEN by deleting the workarounds.

### S3 — Delete the `FN_NAME` Symbol sidechannel (S8 arm — VJ-L1 consumed)

**Breach (S8).** `const FN_NAME = Symbol("kf.fnName")` (`utils.ts:45`), `type NamedValueUnit` (`:47`), `fnNameOf` (`:50–51`), `stampFnName` (`:54–55`), and seven re-stamp/read sites.

**Cure.** On the VJ-L1 consume (the `fnName` field, or first-class `flatLeaf` constructor, preserved by `.clone()`):
1. Delete `const FN_NAME`, `type NamedValueUnit`, `fnNameOf`, `stampFnName` (`utils.ts:45–57`).
2. Replace `stampFnName(v.clone(), fnName ?? fnNameOf(v))` call-sites (`:64`, `:218`, `:294`, `:298`) with the value.js first-class construction (`flatLeaf(v, { fnName })` or the typed `.fnName` field assignment — exact form per the VJ-L1 API shape that ships).
3. Replace `fnNameOf(counterLeaf)` (`:366`) with the first-class `.fnName` read.

**The real observable.** The arity pad is the functional invariant: a `transform: scale(2)` keyframe interpolated against an absent-scale opposing keyframe must resolve `scale → 1` (the CSS identity), not a bare `0` (which produces a wrong matrix and a wrong frame). `proof:interpolate-anything`'s arity-pad fixture must stay GREEN through the deletion.

**Gate bite.** `proof:workaround-deletion` S8 arm asserts zero `FN_NAME|Symbol\("kf\.` pattern in `src/animation/utils.ts`. PENDING today; GREEN after VJ-L1 publish + delete.

### S4 — Delete the direct parse-that dep (S9 arm — VJ-L3 consumed)

**Breach (S9).** `src/animation/utils.ts:1` imports `{ any as parseAny }` from `@mkbabb/parse-that`; `package.json` carries it as a production dep. `tryParseLeaves` (`:227–246`) uses `(parseAny as any)(fnArgs, CSSValues.Value)` to compose value.js's parsers.

**Cure (S9).** On the VJ-L3 consume:
1. Delete `import { any as parseAny } from "@mkbabb/parse-that"` (`utils.ts:1`).
2. Replace the `(parseAny as any)(fnArgs, CSSValues.Value)` composition in `tryParseLeaves` with `parseCSSSubValue(childKey, strValue)` (the VJ-L3 value.js root-export).
3. Remove `"@mkbabb/parse-that"` from `package.json` `dependencies` (it survives ONLY as a `devDependency` if the test suite still needs it directly; else remove entirely).

**Constraint.** S3 + S4 (the Symbol delete + the parse-that delete) should land in ONE atomic commit alongside S2's re-pin. The `leaves.ts` → `@mkbabb/value.js/math` swap (the former §14) is NOT in this wave — it is O.W9 §S3 (CANON #9).

**Gate bite.** `proof:workaround-deletion` S9 arm asserts zero `from "@mkbabb/parse-that"` pattern in `src/animation/utils.ts`. PENDING today; GREEN after VJ-L3 publish + delete. The W96 boundary scan (S1) flips from exit 1 to exit 0 on the same delete.

### S5 — Verify the full workaround-deletion state + unblock O.W7

**Deliverable.** After S2–S4 land atomically:
1. `node scripts/proof-workaround-deletion.mjs` → S8 + S9 GREEN (`3 GREEN (S7, S8, S9) / 2 PENDING (S1, S2 — BC-gated glass-ui arms) / 0 RED` — the glass-ui arms are O.W12's surface, independent of this wave).
2. `node scripts/proof-boundary.mjs` (extended per S1) → exit 0 — zero direct parse-that specifier across the reachable kf source set.
3. `proof:interpolate-anything` arity-pad fixture → GREEN (the S3 observable).
4. O.W7 (engine-seam transposition) is now UNBLOCKED: the `FN_NAME` Symbol was the stated blocker (`proof-decomposition.mjs` BORN-RED HANDOFF text; audit C15); its deletion clears the FN_NAME stamp from every split-candidate path so the engine-seam can refactor cleanly.

---

## Born-RED gate

**Two gates, one new + one existing extended.**

`proof:boundary` **W96 parse-that-scan** (AUTHORED HERE — S1, born-RED on today's tree against `utils.ts:1`'s live import). This is the viol-M8 cure: the named-but-unbuilt gate now actually bites. **Author S1 as the first impl action of this wave, before S2–S4 and before value.js P publishes.** The born-RED state is observed today (the import is present, the assertion does not yet exist — adding the assertion immediately produces exit 1 from the live violation).

`proof:workaround-deletion` S8 + S9 arms (EXISTING — verified PENDING today; `S8=PENDING S9=PENDING`; exit 0 in three-state model). These flip GREEN when S3/S4 delete the workarounds on the VJ-L1/L3 consume.

| Gate / clause | Witness today | Failure mode (the real observable) | Expected after VJ-P consume |
|---|---|---|---|
| S1 `proof:boundary` W96 (AUTHORED) | `utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"` live | exit 1 — `holdsValueJsSpecifier` extended to `holdsParseThatSpecifier`; reads the real `utils.ts` source; the genuine `inv-L-acyclic-purity` violation (not a proxy) | exit 0 — zero direct parse-that specifier in kf source (after S4 deletes `utils.ts:1`) |
| S3 `proof:workaround-deletion` S8 | `grep 'FN_NAME\|Symbol("kf\.' src/animation/utils.ts` → 7+ hits | PENDING (PRESENT + VJ-L1 unshipped); arity pad resolves `scale → 1` ONLY via the Symbol stamp — delete it without VJ-L1 and the pad resolves a bare `0` (wrong matrix → wrong frame, caught by `proof:interpolate-anything`) | S8 arm GREEN — zero `FN_NAME`; VJ-L1 `.fnName` field carries provenance through `.clone()` |
| S4 `proof:workaround-deletion` S9 | `grep '@mkbabb/parse-that' src/animation/utils.ts` → `:1` | PENDING (PRESENT + VJ-L3 unshipped); `tryParseLeaves` composes value.js's parsers via parse-that's `any` because VJ-L3 `parseCSSSubValue` does not exist | S9 arm GREEN — zero `from "@mkbabb/parse-that"`; VJ-L3 `parseCSSSubValue` is called instead; dep removed from `package.json` |

**Born-RED on today's tree (the keystone).** S1's W96 assertion does not yet exist. Adding it produces an immediate exit 1 against the live `utils.ts:1` import — the gate is born-RED by construction. S8/S9 are PENDING (the three-state model exits 0 in PENDING state). The born-RED form for S8/S9 is: after S2's re-pin (value.js P published), the arms transition from PENDING → truly RED (present + sibling published) before S3/S4 delete them — the GENUINE defect, not a proxy.

**Green condition.** value.js Tranche P publishes VJ-L1 (`fnName` field on `ValueUnit`, preserved by `.clone()`) and VJ-L3 (`parseCSSSubValue(property, value)` root export); kf re-pins (S2), deletes `FN_NAME` Symbol + replaces with `.fnName` field (S3), deletes parse-that import + removes production dep (S4), all in one atomic commit; W96 boundary scan (S1) flips exit 1 → exit 0; `proof:workaround-deletion` S8+S9 → GREEN; `proof:interpolate-anything` arity-pad fixture → GREEN; O.W7 engine-seam is UNBLOCKED. (The `leaves.ts` → `@mkbabb/value.js/math` swap is O.W9 §S3, not this wave — CANON #9.)

---

## Dependencies

- **value.js Tranche P VJ-L1 + VJ-L3 publish — THE blocking HANDOFF.** kf cannot write value.js (inv-16). The triggering event is external. The P-cut must carry VJ-L1 (`fnName` field + `.clone()` preservation) and VJ-L3 (`parseCSSSubValue` wrapper). kf's role is the consume side only — re-pin + delete. Named tripwire (from `proof:workaround-deletion` three-state model): `"flatLeaf" in require('@mkbabb/value.js')` OR `vj.flatLeaf !== undefined` transitions from false to true.
- **O.W10 (the KF-TO-VALUEJS-P-ASKS dispatch).** The ask must be filed before this wave can be triggered. O.W16 is the consume; O.W10 is the upstream ask.
- **Independent of the glass-ui BC track (O.W12).** S1/S2 (aria + dock) are O.W12's surface. File collision: none. The workaround-deletion gate shows `3 GREEN (S7+S8+S9) / 2 PENDING (S1+S2) / 0 RED` after this wave; the BC arms are independent.
- **O.W7 (engine-seam transposition) is UNBLOCKED by this wave.** The `FN_NAME` stamp was the stated blocker for the engine-seam split (`proof-decomposition.mjs` BORN-RED HANDOFF; M.W13 spec). After S3 deletes it, the transposition precondition is met and O.W7 can proceed.
- **P-invariant-28 terminal window.** DM-5 S8/S9 are at chronicity 3 (K, L, M → O). The S8/S9 belt window (`P-inv-28 >=4`) fires at **kf-P** (the NEXT kf tranche after O), NOT kf-Q. The governing precept (no perpetual punts) demands a terminal home in kf O. This is it. The two-arm fallback if value.js P slips: **S8** (the `FN_NAME` Symbol) → a kf-side `WeakMap<ValueUnit, string>` populated at flatten time (realm-CLEAN, dissolves the foreign-object-annotation breach, kf-internal-sufficient — BUT does NOT survive `ValueUnit.clone()`, so the clone-restamp ceremony stays; VJ-L1 is therefore still strictly preferred); **S9** (the direct parse-that import) → NOT eliminable without VJ-L3 (kf needs value.js's CSS sub-value grammar), the only fallback being a DECLARED spine-edge quarantine (allow-listed in `proof:boundary`, the breach persists but is not silent). Both fallbacks are strictly inferior to the value.js-P consume. If value.js P slips past kf-P, the belt fires at chronicity 4.
- **The `leaves.ts` → `@mkbabb/value.js/math` swap is NOT this wave (CANON #9).** The four-function `clamp`/`scale`/`lerp`/`lerpArray` swap + the stale `leaves.ts:56–61` comment delete is O.W9 §S3 (phased NOW; the `./math` subpath is live at `node_modules/@mkbabb/value.js/dist/subpaths/math.d.ts`). O.W16 does not edit `leaves.ts`.

---

## dev→impl boundary

This wave is **GATED** — it does not open for implementation until value.js Tranche P publishes VJ-L1 + VJ-L3. **Exception: S1 (the W96 boundary scan authoring) is executable NOW** — it is a kf-internal gate addition with no sibling dependency. Author S1 in the O.W16 implementation wave's first commit, gate-first, before any deletion lands. S2–S4 wait on the value.js P publish.

The M.W9 substrate (docs/tranches/M/waves/M.W9.md) remains the authoritative deep-context reference for the deletion mechanics (per-clause impact, round-trip constraints, constellation spine law). O.W16 deltas M.W9 only on the trigger version (value.js P, not 0.14.0) and re-anchors the W96 gate as still-absent and still-named (audit B11 confirms it was never implemented). No re-authoring of M.W9's rationale is needed.
