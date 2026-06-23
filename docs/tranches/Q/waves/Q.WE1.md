# Q.WE1 — the @deprecated alias DROP (the BREAKING 5.0.0 surface): `Animation` + `ScrollTimeline`/`ScrollTimelineOptions` + the 22-consumer migration + `MIGRATION-5.0.0.md` + `proof:alias-dropped` (gate-first, born-RED over the BUILT d.ts)

**Band:** E — no-legacy → 5.0.0 (the explicit owner NO-legacy directive; this band is its terminal).
**Phase:** **NOW** — every arm fires on today's installed tree (value.js 1.1.0 pinned; the three runtime/type aliases + the two interface-key aliases are live on `dist/keyframes.d.ts`). Zero sibling publish gates the landing — these are pure kf-owned surface cuts. The breaking renames are absorbed by the 5.0.0 cut at **Q.WZ** (the honest major home, USER-DOMAIN publish).
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile (NOW, all 3 repos to master) ─► Q.WA1 (the SLIM lint tier — the iterate-to-green floor) ─► **Q.WE1** (alias-drop + 22-consumer migrate) ─► Q.WF1 (engine.ts split — splits a CLEAN class, no trailing @deprecated re-export) ─► Q.WZ (the 5.0.0 cut absorbs the breaking renames; `proof:changelog-5.0.0` asserts the set)`. Q.WE1 lands the alias drop the moment the apparatus exists; Q.WF1 reads a class whose trailing `@deprecated Animation` re-export is already gone; Q.WZ cuts the version. **Q.WE1 BEFORE Q.WF1** is the breaking-cut spine (charter §3 friction-chain 1): the engine-split must not lift a class still carrying the alias re-export (a dirty seam).
**Owning DM / idea:** the **no-legacy mandate terminal** (O.W9 §S1/§S2 → P.W10 §S5, carried unchanged across O+P+the impl drive, never landed) + **DM-16** (the 5.0.0 major cut, the honest home for the breaking renames). Audit substrate: **B2-ow9-nolegacy** (the primary lane — "SHIP this wave in Q as Q.W-NOLEGACY, phase NOW … the migration surface is BIGGER than the brief's 22"), cross-checked by **B4-precept-reckoning** (the no-legacy VIOLATION RECORDED-but-DEFERRED) and **B6-crossrepo-versions** (the 5.0.0 is the ONLY breaking cut in the chain).

---

## Context

The owner directive is explicit and absolute: **NO legacy code; NO deferrals in Q.** The single largest legacy carry in the constellation is the published-surface `@deprecated` alias family — the PKG-3 rename (`Animation`→`KeyframesAnimation`, `ScrollTimeline`→`KeyframesScrollTimeline`) shipped its canonical names cleanly in **L.W8 §S4**, but the backward-compat aliases were left on the published d.ts and the breaking drop was deferred at O.W9, deferred again at P.W10/§S5, and the impl drive shipped **4.4.0 MINOR** rather than the planned 5.0.0 MAJOR — so the `@deprecated` aliases now point at a **phantom 5.0.0 the impl drive never cut** (B6 finding: "the @deprecated tags now point at a phantom 5.0.0"). Q is the terminal tranche; this wave lands the breaking cut.

**The live legacy surface (verified 2026-06-23 on the 4.4.0 tree).** Five `@deprecated` alias sites, all reaching the published roll-up `dist/keyframes.d.ts`:

| # | Site | The alias | Kind |
|---|------|-----------|------|
| 1 | `engine.ts:1205` | `export { KeyframesAnimation as Animation };` (`@deprecated` JSDoc at `:1192-1204`) | runtime value + type re-export |
| 2 | `timeline.ts:171` | `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions };` (`@deprecated` at `:163-169`) | TYPE-only re-export |
| 3 | `timeline.ts:218` | `export { KeyframesScrollTimeline as ScrollTimeline };` (`@deprecated` at `:209-216`) | runtime value + type re-export |
| 4 | `load-engine.ts:127` | `Animation: typeof Animation;` (`@deprecated` at `:126`) — the `AnimationEngine` interface key | runtime accessor key (flows via `Object.assign` at `:364`) |
| 5 | `load-engine.ts:258` | `Animation: typeof Animation;` (`@deprecated` at `:257`) — the `EngineCore` interface key | runtime accessor key |

These are exactly the legacy the no-legacy mandate bans. **The 5.0.0 cut (DM-16) is the honest home**: a consumer's `import { Animation }` / `import { ScrollTimeline }` value import stops resolving — a genuine BREAKING change. B2-ow9 / B6 are unambiguous: this MUST cut 5.0.0 MAJOR, not 4.5.0.

**The migration surface is BIGGER than the brief's 22 — but the type-only 22 is the demo-side enumeration (B2-ow9-nolegacy finding).** The brief's 22 are ALL `import type { Animation }` used only as a type annotation (`Animation<any>` in function params / `defineEmits` payload types / store-fn params) — **zero `new Animation()` / `instanceof Animation` runtime sites in demo** (verified: `grep -rn "new Animation\b\|instanceof Animation\b" demo/` → ZERO). But B2-ow9 found the true surface is ~33 sites: the 22 demo type-imports PLUS a **test-side value-import** (`test/group.test.ts:2` `import { CSSKeyframesAnimation, Animation } from "../src/animation/engine"` — a runtime value-import, NOT type-only) PLUS the kf-`ScrollTimeline` test/README sites PLUS the two interface-key aliases. **This wave ENUMERATES all 22 demo sites + the test + README sites NOW** (the scope below) so the migration cannot "discover 23 scattered consumers mid-tranche" (charter §3 friction-chain 1, the explicit pre-emption).

**The DISAMBIGUATION trap (the real footgun, B2-ow9 finding).** `ScrollTimeline` is overloaded: the kf JS class AND the ambient Houdini `globalThis.ScrollTimeline`. `test/platform-adopt.test.ts:28` ALREADY imports the kf class as `ScrollTimeline as JSScrollTimeline` to disambiguate from the global it deletes/installs (`:331`, `:348`). A blanket sed-rename of `ScrollTimeline`→`KeyframesScrollTimeline` would corrupt the native-bridge tests/README (which legitimately reference the PLATFORM global). The migration must operate ONLY on imports OF the kf class, never on `globalThis.ScrollTimeline` references.

**No gate exists over the deprecated-alias surface today (B2-ow9 + B7 finding).** The misleadingly-named `proof:no-deprecated-guard.mjs` gates an UNRELATED thing (vue-router's `next()` callback in `demo/app/router.ts`) — it does NOT touch the `Animation`/`ScrollTimeline` aliases. The no-legacy mandate must be GATED, not hoped — and the gate must read the **BUILT** `dist/keyframes.d.ts` (the consumer's actual surface), not a `src/**` proxy a roll-up could mask.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|----------------------------|
| B2-ow9 / B4-precept §4 | `src/animation/engine.ts:1205` | `export { KeyframesAnimation as Animation };` — `@deprecated` (`:1192-1204`), on the published d.ts |
| B2-ow9 | `grep -rln "import type {…Animation…}" demo/` | **22** demo consumers of the deprecated `Animation` type — ALL type-only `Animation<any>`, ALL under `demo/@/components/custom/animation-controls/`; zero runtime sites |
| B2-ow9 / B4-precept §4 | `src/animation/timeline.ts:171` | `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions };` — `@deprecated` (`:163-169`) |
| B2-ow9 / B4-precept §4 | `src/animation/timeline.ts:218` | `export { KeyframesScrollTimeline as ScrollTimeline };` — `@deprecated` (`:209-216`) |
| B2-ow9 (the bigger surface) | `src/animation/load-engine.ts:127, :258` | two interface-key aliases `Animation: typeof Animation;` (`@deprecated` `:126`, `:257`) — the `AnimationEngine` + `EngineCore` keys, flowing via `Object.assign({...}, engine)` at `:364` |
| B2-ow9 (the bigger surface) | `test/group.test.ts:2` | `import { CSSKeyframesAnimation, Animation } from "../src/animation/engine"` — a RUNTIME value-import of `Animation` (NOT type-only), the test site the brief's 22 omitted |
| B2-ow9 (the disambiguation trap) | `test/platform-adopt.test.ts:28, :331, :348` | `ScrollTimeline as JSScrollTimeline` import + `globalThis.ScrollTimeline` delete/install — the kf class vs the Houdini global; the migration must NOT touch the global references |
| README disambiguation | `README.md:484` (native global) vs `:633, :654` (kf class) | README uses `ScrollTimeline` for BOTH the platform global AND the kf class — the docs migration must disambiguate too |
| B7 (the gate gap) | `scripts/proof-no-deprecated-guard.mjs` (`package.json:136`) | MISLEADINGLY NAMED — gates the vue-router `next()` callback removal, NOT the kf @deprecated aliases; NO gate covers the deprecated-alias surface |
| B6 (the semver call) | `package.json:3` `"version": "4.4.0"` | the alias drop is BREAKING (`import { Animation }` stops resolving) → MUST cut 5.0.0 MAJOR; the @deprecated tags point at a phantom 5.0.0 the drive never cut |
| the canonical names (clean) | `engine.ts:101` `KeyframesAnimation`; `timeline.ts:189` `KeyframesScrollTimeline`; `:153` `KeyframesScrollTimelineOptions` | the PKG-3 canonical declarations shipped clean in L.W8 §S4 — the migration TARGETS, unchanged |
| the absent artifacts | `ls scripts/proof-no-legacy-surface.mjs scripts/proof-alias-dropped.mjs docs/MIGRATION-5.0.0.md` | ALL ABSENT — the gate + the migration doc are this wave's authored deliverables |
| precedent gate idiom | `scripts/proof-published-surface.mjs` | builds the lib + reads the rolled-up `dist/keyframes.d.ts` — the build-then-grep-the-BUILT-artifact idiom `proof:alias-dropped` mirrors |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they purge the published-surface legacy and land the breaking 5.0.0 surface — every move a no-legacy cut over a now-unblocked substrate, NONE a workaround, NONE a half-measure shim. The sub-step ordering (S2 migrate BEFORE S3 drop) keeps `npm run check` + `npm test` GREEN at every intermediate state.

### S1 — author `proof:alias-dropped` born-RED FIRST (the keystone, gate-first, over the BUILT d.ts)

**Breach (the gate-first law).** No gate asserts the published surface is `@deprecated`-free; the five aliases live on `dist/keyframes.d.ts` with no tripwire. The misnamed `proof:no-deprecated-guard` covers the vue-router callback, not these aliases. The no-legacy mandate must be GATED, not hoped.

**Cure (author the born-RED BEFORE any cut — S1 precedes S2/S3).** Author `scripts/proof-alias-dropped.mjs`, mirroring `proof:published-surface`'s build-then-read-the-BUILT-artifact idiom, with three clauses:
1. **`dts-deprecated-free`** (the KEYSTONE, the REAL consumer observable): run `npm run build` → `dist/keyframes.d.ts`, then assert the rolled-up published d.ts carries ZERO `@deprecated` JSDoc tags whose subject is `Animation` / `ScrollTimeline` / `ScrollTimelineOptions`. BITE: any such `@deprecated` on the published roll-up → red. This reads the ACTUAL built artifact the npm consumer's IDE hover + `import type` resolve against — NOT the source, so a `@deprecated` that survives API-Extractor (the genuine defect) is caught, and a source-only edit that the roll-up re-introduces cannot game it.
2. **`no-Animation-alias`** (the value-resolution observable): assert that `import { Animation } from "@mkbabb/keyframes.js"` (the runtime value import) FAILS to resolve against the published surface — i.e. `Animation` is no longer a named export of the built barrel. (This is the BREAKING observable: the alias drop removes a value-position name, not merely a JSDoc tag.) Companion source clause: `engine.ts` carries no `export { KeyframesAnimation as Animation }`; `demo/` + `test/` carry no `import { Animation }` / `import type { Animation }` from `@mkbabb/keyframes.js` or `../src/animation/engine` (comment-aware grep — the canonical `KeyframesAnimation` never triggers it).
3. **`no-scroll-timeline-alias`** (the disambiguation-aware observable): `timeline.ts` carries no `@deprecated ScrollTimeline` / `ScrollTimelineOptions` re-export; the built barrel has no `ScrollTimeline` / `ScrollTimelineOptions` value/type export. The clause is **disambiguation-aware**: it matches only imports OF the kf class (`import { ScrollTimeline } from "@mkbabb/keyframes.js"` / `from "../src/animation/timeline"`), NEVER `globalThis.ScrollTimeline` or the ambient Houdini reference (so `test/platform-adopt.test.ts`'s `globalThis.ScrollTimeline` install/delete and README's native-global mention stay GREEN).

Wire into `proof:hygiene` (beside `proof:published-surface`, `package.json:200`) AND into CI (the gate runs AFTER `build:lib`, same precondition as `proof:published-surface`). CI posture: **HARD** (`declarePosture(hard)`) — a correctness/precept invariant, structural and device-independent.

### S2 — migrate the ENUMERATED 22 demo + the test + README consumers (sequenced BEFORE S3)

**Breach.** 22 demo files + `test/group.test.ts` + README reference the old `Animation` / `ScrollTimeline` names; dropping the aliases (S3) before migrating would red `npm run check` + `npm test`.

**Cure (mechanical, ENUMERATED — the pre-emption of the mid-tranche-discovery deferral).** Rewrite every consumer from the old name to the canonical PKG-3 name. The migration is mechanical (the value + type both resolve to `KeyframesAnimation` / `KeyframesScrollTimeline` today — `instanceof`, `new`, and the type all carry over unchanged). **The complete 22 demo `import type { Animation }` → `KeyframesAnimation` enumeration** (ALL under `demo/@/components/custom/animation-controls/`, ALL type-position `Animation<any>`):

1. `controls/AnimationControls.vue` · 2. `controls/AnimationControlsControls.vue` · 3. `controls/AnimationVisualizer.vue` · 4. `controls/PlaybackRibbon.vue` · 5. `controls/TimingFunctionPanel.vue` · 6. `controls/composables/useAnimationSync.ts` · 7. `controls/composables/usePlaybackToggle.ts` · 8. `controls/composables/useSelectedControlSurface.ts` · 9. `controls/composables/useTimingFunctionEditor.ts` · 10. `components/ControlsPaneWrapper.vue` · 11. `composables/useAnimationGroupActions.ts` · 12. `composables/useAnimationGroupPlayback.ts` · 13. `keyframes/KeyframesEditor.vue` · 14. `keyframes/KeyframesStringControls.vue` · 15. `keyframes/composables/useApplyCSS.ts` · 16. `keyframes/composables/useKeyframeOps.ts` · 17. `keyframes/composables/useKeyframesEditor.ts` · 18. `keyframes/composables/useKeyframesParsing.ts` · 19. `keyframes/composables/useKeyframesState.ts` · 20. `stores/animationOptionsStore.ts` · 21. `stores/controlOptionsStore.ts` · 22. `stores/storeUtils.ts`

Each is a **type-position** rewrite: the import line `import type { Animation } from "@mkbabb/keyframes.js"` → `import type { KeyframesAnimation } from "@mkbabb/keyframes.js"` AND every `Animation<any>` / `Animation` type-annotation usage in the body → `KeyframesAnimation<any>` / `KeyframesAnimation` (a sed of the import line alone leaves dangling `Animation<any>` annotations — the B2-ow9 friction note; the wave rewrites BOTH the import and the usage).

**The non-demo consumers** (the surface beyond the 22, B2-ow9):
- `test/group.test.ts:2` — the RUNTIME value-import `import { CSSKeyframesAnimation, Animation } from "../src/animation/engine"` → `import { CSSKeyframesAnimation, KeyframesAnimation } from "../src/animation/engine"` + every `Animation` runtime usage → `KeyframesAnimation`. (This is the only value-position migration; the rest are type-only.)
- The kf-`ScrollTimeline` test sites (`test/timeline.test.ts`, `test/orchestration-api.test.ts`, `test/computed-resolution.test.ts`, `test/scroll-scene.test.ts`) — migrate `ScrollTimeline` → `KeyframesScrollTimeline` ONLY where it names the kf class; leave `test/platform-adopt.test.ts`'s `ScrollTimeline as JSScrollTimeline` import (already disambiguated) and its `globalThis.ScrollTimeline` references UNTOUCHED.
- README `:633, :654` — the kf-class `new ScrollTimeline({...})` examples → `new KeyframesScrollTimeline({...})`; `:484`'s native-global `ScrollTimeline` mention UNTOUCHED (it names the platform feature).

**Gate bite (the invariant).** AFTER S2 and BEFORE S3's alias drop, `npm run check` (tsc `--noEmit`) + `npm test` stay GREEN — the consumers reference the canonical names while the aliases STILL exist (so the old names also still resolve, harmlessly). This is the ordering proof: the demo/test build never sees a missing-name window. `proof:alias-dropped` is still RED after S2 (the aliases are present); it greens only after S3.

### S3 — drop all five `@deprecated` aliases (the breaking cut)

**Breach.** The five aliases are pure published-surface legacy.

**Cure.** Delete every alias site:
- `engine.ts:1192-1205` — the `@deprecated Animation` re-export block (deleting `:1205` also correctly drops the runtime `loadAnimationEngine().Animation` key — B2-ow9 friction note: the key flows via `Object.assign({...}, engine)` at `load-engine.ts:364`, so dropping the source export removes the runtime accessor; the interface-key edits in this same step keep the `AnimationEngine`/`EngineCore` type in lockstep).
- `timeline.ts:163-171` — the `@deprecated ScrollTimelineOptions` type re-export.
- `timeline.ts:209-218` — the `@deprecated ScrollTimeline` re-export.
- `load-engine.ts:126-127` — the `AnimationEngine.Animation` interface key + JSDoc.
- `load-engine.ts:257-258` — the `EngineCore.Animation` interface key + JSDoc.

The canonical `KeyframesAnimation` / `KeyframesScrollTimeline` / `KeyframesScrollTimelineOptions` (the LIGHT static barrel exports + the engine accessor keys) are unchanged; only the legacy aliases drop. Breaking → absorbed by the 5.0.0 cut at Q.WZ. **No CHANGELOG-shim, no `/** @deprecated kept for one more minor */` half-measure** (B2-ow9 explicit: the owner's NO-LEGACY + NO-DEFERRALS directive means the aliases are GONE in 5.0.0, full stop).

### S4 — author `docs/MIGRATION-5.0.0.md` (the one permitted legacy-adjacent artifact: documentation of a breaking change)

**Breach.** No CHANGELOG / MIGRATION doc exists; the semver-honesty requirement (B6 + IMPL-RUN-BOARD:23) demands the breaking change be documented for the consumer.

**Cure.** Author `docs/MIGRATION-5.0.0.md`: a single breaking-change note (the ONE permitted legacy-adjacent artifact — documentation of a breaking change is NOT legacy code, B2-ow9 §S5). It records the three renames the consumer must apply:
- `Animation` → `KeyframesAnimation` (the runtime + type name);
- `ScrollTimeline` → `KeyframesScrollTimeline` (the runtime + type name — note: the rename CLEARS the ambient `globalThis.ScrollTimeline` d.ts collision, so this is a strictly-better name);
- `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` (the type name — clears the lib.dom collision).

Each entry: the old form, the new form, and the one-line `find/replace` a consumer applies — with the **explicit disambiguation note** that `globalThis.ScrollTimeline` (the platform Houdini timeline) is UNRELATED and untouched by the rename. The doc is referenced from the 5.0.0 changelog entry (Q.WZ) so the consumer's upgrade path is gate-documented.

### S5 — wire `proof:alias-dropped` (+ `proof:changelog-5.0.0`) into CI + `proof:ci-coverage`

**Breach (the gate-first close).** A new gate that is not in the CI roster is a green-in-isolation gate the impl drive's `proof:ci-coverage` would flag RED (charter §1: the impl drive shipped 6 new gates unwired). The keystone must run in the deploy-of-record's CI.

**Cure.** Add `proof:alias-dropped` to `package.json:200`'s `proof:hygiene` chain (after `proof:published-surface`, same `build:lib` precondition) AND to the CI `proof:*` roster the `proof:ci-coverage` gate enumerates — so the gate is wired, the coverage gate stays GREEN, and the alias-free published surface is asserted on every CI run, not just locally. (This pre-empts the friction the impl drive fell into: a gate authored but unwired.) **Ownership note:** Q.WE1 is the SINGLE owner of BOTH breaking-surface gates — `proof:alias-dropped` (S1) AND the breaking-set CHANGELOG gate `proof:changelog-5.0.0` (authored gate-first HERE in Band E beside the alias drop). Both are wired into the CI roster here; Q.WA3 (CI-green) and Q.WZ (5.0.0 cut) only REFERENCE them, never co-author — this is the dual-ownership reconciliation the H1 cross-ref pass landed (no "Q.WE1/Q.WA3" co-authorship).

---

## Born-RED gate

**Gate:** `proof:alias-dropped` (NEW — `scripts/proof-alias-dropped.mjs`; this wave authors it gate-first per S1) — born-RED over THREE clauses, the keystone being `dts-deprecated-free` (the REAL consumer observable: zero `@deprecated`-aliased name on the published roll-up). Built AFTER `build:lib`, reading the EXACT artifact the npm consumer installs.

**The REAL runtime observable (observable-truth — the genuine defect, measured on the BUILT d.ts + the value-resolution, not a source proxy):**

| Clause | Witness on today's (2026-06-23) tree | Failure mode today (the REAL observable) | Expected after the cuts |
|--------|--------------------------------------|------------------------------------------|-------------------------|
| `dts-deprecated-free` (**KEYSTONE**) | `npm run build` → grep `@deprecated.*Animation\|ScrollTimeline\|ScrollTimelineOptions` in `dist/keyframes.d.ts` | the rolled-up published d.ts carries the five `@deprecated` alias JSDocs — the EXACT surface the npm consumer's IDE + `import type` resolve against | ZERO `@deprecated`-aliased name on the published roll-up |
| `no-Animation-alias` | the built barrel exports `Animation` (value + type); `engine.ts:1205` + 22 demo + `test/group.test.ts:2` reference it | `import { Animation } from "@mkbabb/keyframes.js"` RESOLVES (the breaking surface still present) + 23 consumers | the value-import fails to resolve; 23 consumers migrated to `KeyframesAnimation` |
| `no-scroll-timeline-alias` | the built barrel exports `ScrollTimeline` / `ScrollTimelineOptions`; `timeline.ts:171, :218` reference them | the two aliases resolve on the published surface; the kf-class consumers reference the old names | both dropped; kf-class consumers migrated; `globalThis.ScrollTimeline` references UNTOUCHED (disambiguation-aware) |

**How it is born-RED (plant-a-failure).** Today the gate exits 1 with no plant needed — the five `@deprecated` aliases are present on the published d.ts the instant the library builds, and the 23 consumers (22 demo + `test/group.test.ts`) are live. The keystone clause greps the BUILT `dist/keyframes.d.ts` (the consumer's actual surface), so it cannot be gamed by a source-only edit that the roll-up re-introduces.

- **Discriminating bite #1 (the build-artifact bite):** a cure that renames the alias in source but leaves a `@deprecated` re-export that API-Extractor rolls UP into the published d.ts still reds the keystone — proving the observable is the published surface, not the source intent.
- **Discriminating bite #2 (the value-resolution bite):** a cure that drops only the `@deprecated` JSDoc tag but KEEPS the `export { KeyframesAnimation as Animation }` value re-export reds `no-Animation-alias` — proving the observable is the BREAKING value-resolution (the name stops resolving), not the cosmetic tag. A type-only fix is not the cut.
- **Discriminating bite #3 (the disambiguation bite):** a cure that blanket-sed-renames `ScrollTimeline`→`KeyframesScrollTimeline` and accidentally rewrites `globalThis.ScrollTimeline` in `test/platform-adopt.test.ts` reds the native-bridge test (the platform global vanishes) — proving the clause is disambiguation-aware (it bites the kf-class alias, never the Houdini global).

**Green condition.** The five `@deprecated` aliases dropped (S3) + the 23 consumers (22 demo type-imports + `test/group.test.ts` value-import) + the kf-`ScrollTimeline` test/README sites migrated to the canonical names (S2); `proof:alias-dropped` THREE clauses GREEN incl. the `@deprecated`-free published d.ts; `docs/MIGRATION-5.0.0.md` authored (S4); the gate wired into `proof:hygiene` + CI (S5). The breaking renames absorbed by the 5.0.0 cut (Q.WZ) — `proof:changelog-5.0.0` asserts the set. `npm run check` + `npm test` GREEN at every intermediate state (S2 before S3).

---

## Dependencies

- **value.js 1.1.0 (already pinned) — NO sibling publish to land.** Every Q.WE1 arm (S1–S5) is a kf-side surface cut + a kf-side gate + a doc over the installed tree — phase NOW, zero sibling gate. This is the ONLY no-legacy wave that fires entirely on today's tree (no glass-ui BC, no value.js consume coupling).
- **Q.WA3 (master-merge-reconcile) — SEQUENCE precondition (charter §3, the FIRST motion).** All three published tranche tips merge to master BEFORE the 5.0.0 cut, so the deploy-of-record (CF Pages, branch `master`) is live-correct. The alias drop lands on a reconciled master, not a divergent tranche tip (B6 finding: the 4.4.0 tip is NOT yet an ancestor of master).
- **Q.WA1 (the SLIM lint tier) — soft precondition.** The dep-cruiser lint tier's sub-second per-save checks make the iterate-to-green on the 23-consumer migration faster; not a hard gate (Band A before Band E is the natural ordering).
- **Q.WF1 (the engine.ts split) — SEQUENCE-COUPLED, Q.WE1 BEFORE Q.WF1 (charter §3 friction-chain 1).** Q.WF1 lifts the standalone-play lifecycle out of the `KeyframesAnimation` class body in `engine.ts`; Q.WE1 deletes the `@deprecated Animation` re-export at `engine.ts:1205` (the trailing alias line, a disjoint region). **Sequence Q.WE1 (alias drop) BEFORE Q.WF1 (split)** so the alias line is already gone when Q.WF1 splits the class — they compose cleanly (Q.WF1 splits a CLEAN class with no trailing `@deprecated` re-export, not a dirty seam).
- **Q.WZ (the 5.0.0 cut) — the honest home for the breaking renames (USER-DOMAIN publish).** The alias drops (S3) are breaking; they belong in the 5.0.0 MAJOR (DM-16). `proof:changelog-5.0.0` (the breaking-set CHANGELOG gate, authored gate-first HERE in Band E beside `proof:alias-dropped` — Q.WE1 is the SINGLE owner of BOTH breaking-surface gates; Q.WA3/Q.WZ only REFERENCE them) asserts the breaking set incl. the deprecated-alias drops, referencing `docs/MIGRATION-5.0.0.md`. Q.WE1 lands the cuts + authors both gates; Q.WZ CONSUMES `proof:changelog-5.0.0` as a publish-block precondition and cuts the version that absorbs them — sequenced (Q.WE1 before Q.WZ).
- **Q.WE2 (the leaves externalization) — Band-E sibling, DISJOINT.** Q.WE2 touches `internal/leaves.ts` + the boundary gate; Q.WE1 touches the alias sites + demo/test consumers. No region collision.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WE1 — **DOCS ONLY** (inv-16: kf writes only keyframes.js; no cross-repo edit). The IMPLEMENTATION (the `proof:alias-dropped` gate authoring, the 23-consumer migration, the five alias drops, the `MIGRATION-5.0.0.md` doc, the CI wiring) opens ONLY on the owner's explicit authorization. Phase NOW: zero sibling publish gates the landing. When it opens it is:

- **gate-first** — `proof:alias-dropped` (S1) authored born-RED BEFORE any drop; the keystone reads the BUILT `dist/keyframes.d.ts`.
- **observable-truth** — the keystone greps the BUILT published d.ts (the consumer's surface, not the source); `no-Animation-alias` asserts the BREAKING value-resolution (the name stops resolving), not the cosmetic JSDoc tag; the scroll clause is disambiguation-aware (bites the kf class, never `globalThis.ScrollTimeline`).
- **no-legacy** — the explicit owner directive's terminal: the five `@deprecated` aliases PURGED from the published surface; NO CHANGELOG-shim, NO `kept for one more minor` half-measure; `MIGRATION-5.0.0.md` is documentation of a breaking change (NOT legacy code).
- **no-deferral** — the migration surface is ENUMERATED NOW (all 22 demo + the test + README sites listed in S2), so the cut cannot "discover 23 scattered consumers mid-tranche"; the breaking version has a named home (Q.WZ 5.0.0); the gate is wired into CI (S5) so it cannot be a green-in-isolation orphan.
- **gestalt / KISS** — the cut is deletion + mechanical migration + one new gate + one doc. The only enabling dependency is the master-merge (Q.WA3) and owner authorization of the 5.0.0 publish (Q.WZ).

**Mid-tranche-friction pre-emption.** This wave could spawn TWO frictions, each pre-empted NOW:
1. **The migration-discovery deferral** — "the 22-consumer migration uncovers a 23rd scattered consumer mid-tranche" (the classic P-inv-28 spring). **Pre-empted by the S2 enumeration**: all 22 demo sites + `test/group.test.ts` (the value-import) + the kf-`ScrollTimeline` test/README sites are LISTED NOW, so there is no mid-tranche discovery — the surface is closed before the cut.
2. **The disambiguation corruption** — a blanket `ScrollTimeline` rename corrupts `test/platform-adopt.test.ts`'s `globalThis.ScrollTimeline` native-bridge + README's platform-global mention. **Pre-empted by the disambiguation-aware S2 scope + the gate's discriminating bite #3**: the migration operates ONLY on imports of the kf class, never on the ambient Houdini global; the gate bites a cure that rewrites the global.

The born-RED witness (the five `@deprecated` aliases on the published d.ts, the 23 live consumers, the absent gate + migration doc) stands on today's tree; the cure opens on authorization. Gate-first, observable-truth (the keystone reads the BUILT published d.ts), no-legacy, no-deferral, gestalt throughout.
