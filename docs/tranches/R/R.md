# Tranche R — the surgical refactor (encapsulation · legacy excision · the honest "in")

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document + the
> `audit/` evidence (32 lanes) + `PROGRESS.md` (the board + the folded deferred-ledger +
> the prompt-recap) + `waves/R.W*.md` (the wave specs) ARE the R.W0 deliverable. **No
> library/demo source is refactored here.** The one IMPL motion already taken under R.W0 is
> the owner-directed corrective: **keyframes-vue removed in totality** (npm-revoked, repo-
> deleted, all refs scrubbed — commit `23a6867`). The refactor waves (R.W1–R.W8) open only on
> explicit authorization, exactly as D/E/O/P/Q's dev→impl boundary. inv-16 holds (write only
> keyframes.js).

## 0. The owner's questions, answered

The R ask opened with five pointed questions. The 32-lane audit answers each from the tree:

1. **"keyframes-vue was overfit nonsense — remove it."** ✅ Done (R.W0). It was a sibling Vue
   adapter shipped as Q's DM-7 "belt exit." npm-unpublished (within the 72h window), the
   `packages/keyframes-vue/` tree deleted, and all six reference sites scrubbed (the gate
   script, its package.json key, the ci.yml born-RED tripwire + aggregator, the release.yml
   publish job, the proof:ci-coverage roster, the README bullet). `proof:ci-coverage` re-greened.

2. **"Why did we remove `Animation`, what's our in to the library?"** Dropping the `Animation`
   NAME (5.0.0, Q.WE1) was **correct** — it collided with the DOM global `globalThis.Animation`
   (WAAPI), leaking `Animation_2` suffixes into the `.d.ts`/IDE hover. Re-adding it would be the
   global-shadowing legacy alias the precepts forbid. **But the audit confirms your instinct:**
   the "in" is broken at the first touch and over-engineered at the second
   (`audit/retro-api-in.md`). The README Quick Start instantiates `new CSSKeyframesAnimation(...)`
   — a class that 5.0.0 made **impossible to statically import** (it is type-only on the barrel,
   reachable only via `await loadAnimationEngine()`). The designed one-call front door `animate()`
   has **zero adoption** (0 demo sites vs 32 `new CSSKeyframesAnimation`). The fix is **R.W4**:
   a package subpath export (`@mkbabb/keyframes.js/engine`) gives the heavy class a static,
   synchronous, tree-shakeable home; collapse the four `load*` accessors to one; fix-or-excise the
   Quick Start; decide `animate()`'s fate (promote-and-dogfood, or excise as dead-by-disuse).

3. **"`src/` is a mess — what are these files, why no sub-dir encapsulation?"** `src/animation/`
   is a **flat tree of 56 files** (only `internal/` is a sub-dir). **Q branded a "decomposition
   close" but `engine.ts` is still 1420 lines** and Q spawned EIGHT flat hyphenated siblings
   (`engine-playback.ts`, `group-soa.ts`, `waapi-densify.ts`, `frame-compiler-numeric.ts`, …)
   instead of real directory sub-modules — and those siblings created **15 circular-import
   violations** (the `.dependency-cruiser-known-violations.json` baseline). The fix is **R.W1/R.W2**:
   a **seven-zone directory partition** (`physics/ orchestration/ engine/ group/ compile/ resolve/
   ingest/ scroll/` + `presets/ svg/`) with the two genuine god-classes (engine, group) carved
   into cohesive sub-modules that OWN their state. See `audit/gestalt-library.md`.

4. **"What of our readme, examples, documents?"** README is 928 lines with stale source paths
   (`src/easing.ts`, `src/parsing/`, `src/units/` — none exist post-value.js-externalization), a
   stale `Animation` class name, and a Project-Structure section showing a pre-K snapshot. CHANGELOG
   mixes user-facing entries with internal tranche-journal prose. Fix is **R.W7** (slim to ~720L;
   enforce the 5.0.0-format going forward). See `audit/retro-readme-docs.md`.

5. **"I removed a bunch of root files — most were junk."** Per-file verdict (`audit/retro-readme-docs.md`):
   **RESTORED** (load-bearing collateral, 4 broke CI) — `.dependency-cruiser.cjs`,
   `.dependency-cruiser-known-violations.json`, `CLAUDE.md`, `src/animation/CLAUDE.md`. **DELETION
   ENDORSED** (junk) — `CONTRIBUTING.md`. **KEPT DELETED** (generated artifacts; reclassify as
   build-output is an R fold) — `llms.txt`, `llms-full.txt`.

## 1. The audit (32 lanes, evidence on disk)

`docs/tranches/R/audit/` holds 32 evidence files (~9,600 lines), produced by a 32-agent workflow
(3-wide batches; Sonnet fanout, Opus for the legacy-sweep, retrospective, gestalt, and adversarial-
challenge lanes). Every load-bearing claim was re-checked against the live tree (`wc -l`, `grep`,
running the gates). The two most consequential claims **reproduce when the gates are run**:
`proof:decomposition` exits 1 (resolve-values.ts 796 > 600 cap) and `proof:chronic-closure` exits 1
(dangling `proof:keyframes-vue-published` after R.W0). **Q's FINAL "proof:decomposition FULLY GREEN"
was false at close.**

| Layer | Lanes | Headline |
|---|---|---|
| **Library (13)** | engine · group · animations · resolve · sequence · spring · compile · waapi · boundary · scroll-ingest · light · support · **legacy-sweep** | `engine.ts` is a real 1420L god-module with a *faked* playback seam (`this as unknown as PlaybackHost`); the flat-sibling families are pure-internal → directory-izable with zero public-API change; the cross-cutting legacy sweep is the spine of the no-legacy mandate. |
| **Demo (8)** | app-scenes · anim-controls · targets · composables-state · **scene-switcher** · brittleness · styling · legacy-sweep | The scene logic is scattered across THREE roots (`app/scenes/` + `demo/<name>/` + `@/.../animation-controls/`) → fuse to `demo/scenes/<name>/`; the broken `SceneSwitcherCarousel` (no-op `onScroll`) is a clean removal; `animation-controls/` is the *model* decomposition (NOT over-engineered); the state layer is coherent. |
| **Retro (6)** | plan-waves · q-changes · prompt-recap · deferred-ledger · readme-docs · api-in | Q's overclaims are FAIR + evidenced (not pile-on) with the genuine wins credited (SoA, MorphSVG, value.js consume); the prompt-recap is **zero-dropped**; the deferred-ledger gives a binding **10-item fold**. |
| **Gestalt (2)** | library · demo | One coherent target tree each, with service boundaries, the DI pattern, and the round-trip as directory-boundary pipelines. |
| **Challenge (3)** | library · demo · retro | Adversarial tempering — the corrections below OVERRIDE the raw findings. |

## 2. The challenge-tempered decisions (these OVERRIDE the raw findings)

The three adversarial-challenge lanes caught real overreach. R adopts the *tempered* positions:

- **The directory carve is NOT "zero-gate-change."** Three gates are hardcoded to `engine.ts` by
  literal path and BREAK on the move — they are **first-class R.W1 steps, each with a re-RED test**:
  (a) `proof-boundary.mjs:84` widen `isHeavyEngine` regex `engine\.ts$ → engine[\\/]` (else
  assertion-3 hard-reds + assertion-1 goes silently blind); (b) `proof-boundary.mjs:237` drop
  `loadEngine`/`loadCompiler`/`loadIngest` from `DYNAMIC_ACCESSORS` *in the same change* as their
  excision; (c) `proof-engine.mjs:33,79` retarget `engine.ts → engine/animation.ts`.
- **The decomposition keystone is the SIMPLE fix, not a meta-gate.** DELETE the
  `LIBRARY_CEILING_OVERRIDE` allowlist and set ONE hard ceiling — the resulting reds ARE the backlog.
  **REJECT** the proposed budget/diff meta-gate-governance machinery (over-engineering).
- **`useSceneSwap` STAYS.** View Transitions are Baseline only since **2025-10-14** (Firefox 144);
  the feature-gated `SpringProgress` dogfood fills a real coverage gap. `app-scenes F4`'s "excise
  entirely" is OVERREACH; `legacy-sweep 3a`'s "genuinely befitting, keep" is correct.
- **The subgrid same-cascade fallback STAYS.** It is the documented modern-web-guidance idiom
  (`css-layout`), zero-cost, not the silent-degrade the precept targets. `DT-6`'s "excise" is OVERREACH.
- **The render-fn-via-`defineExpose` slot protocol STAYS.** Scenes project into *sibling* slots; a
  render-fn bridge is the idiomatic cross-sibling teleport, not a workaround. Fix only the `any` typing
  (`SceneExposedApi`). `app-scenes F8`'s "fights Vue's model" framing is OVERREACH.
- **z-index comma-defaults: EXCISE, don't "normalize."** `var(--z-content, 10)` guards a never-
  occurring condition; per the precept the fix is `var(--z-content)` with NO fallback (fail-visible)
  — NOT harmonizing the magic default. `styling F2/F3` is itself a precept violation.
- **The scene-switcher removal stands — but on the no-op-`onScroll` reason ALONE.** The "carousel is
  inside the VT subject" rationale is factually false (it is a *sibling* of `.scene-host`); strike it.
- **`animate()` is charged as "dead-by-disuse (0/32)," not "effusive dynamicism."** A typed-union
  front door is genre-idiomatic; the evidenced charge is zero adoption + not-on-light-surface.
- **`internal/` is cited as a precedent but has NO barrel.** The barrel-per-directory rule is a
  deliberate NEW convention (justified by the LIGHT/HEAVY re-export seam) — argue it on its merits,
  or give `internal/` a barrel too for genuine consistency. Don't mis-cite the precedent.

## 3. The precept rubric — EXCISE vs KEEP (binding for the legacy waves)

The no-legacy/no-fallback mandate is sharp but not blanket. R.W3 applies one rubric so IMPL does not
over-excise (`audit/challenge-demo.md` E.2):

- **EXCISE (or fail-explicit):** silent error-swallows (`catch {}`), fallbacks guarding never-
  occurring conditions (z-index comma-defaults), dead no-op handlers (`useScrollSnapScene.onScroll`),
  deprecated APIs (`navigator.platform`), `this as unknown as` casts, param-bags of a caller's private
  fields, test-scaffold leaks on the public API (`forcePause`/`forcePlay`), dead components.
- **KEEP (genuinely befitting):** feature-gated graceful-degrade for a REAL, recent coverage gap
  (`useSceneSwap` on non-VT engines), zero-cost same-cascade progressive enhancement that IS the
  documented standard (subgrid), narrow *named* third-party-error suppression (Monaco `Canceled`,
  warmScene prefetch, html2canvas preview).

## 4. The path forward — bands · waves · DAG

| Band | Wave | Title | Phase | Scope |
|---|---|---|---|---|
| **A apparatus** | **R.W0** | Audit-fold + the keystone gate-truth reset | DEV (now) | This doc + the 32-lane audit + the deferred-ledger fold + the prompt-recap; the keyframes-vue corrective (done); the root-file dispositions; **the keystone**: DELETE `LIBRARY_CEILING_OVERRIDE` → reds = backlog. |
| **B lib structure** | **R.W1** | Directory-ize the flat tree (the 7-zone partition) | IMPL | Mechanical family moves (`physics/ orchestration/ engine/ group/ compile/ resolve/ ingest/ scroll/ presets/ svg/`) + barrel re-points + **the 3 gate co-edits with re-RED tests**. Zero public-API change. |
| | **R.W2** | The two god-class carves (engine, group) — DI not param-bags | IMPL (major) | `PlaybackState` + `Composition` OWN their state (kill the `PlaybackHost` cast); group demotes test-scaffold surface + the layer-springs junk-drawer 3-way split; the spring `types.ts` ring-break. |
| **C lib hygiene** | **R.W3** | The legacy/workaround/fallback excision sweep | IMPL | Apply the §3 rubric across `src/` + demo: excise-or-fail-explicit per the legacy-sweep lanes; reconcile the `leaves.ts → value.js/math` edge vs the `leaf-no-engine-no-valuejs` lint rule. |
| | **R.W4** | The honest API "in" + boundary slim | IMPL | `@mkbabb/keyframes.js/engine` subpath; collapse 4 `load*` → 1; delete the hand-mirrored `AnimationEngine` interface + drift-gate where the subpath replaces it; fix/gate the Quick Start; **decide `animate()`** (promote-and-dogfood OR excise); the agent-surface `Animation`/`ScrollTimeline` curation cleanup. |
| **D demo** | **R.W5** | Scene fusion + dead-code excision | IMPL | Fuse each scene to `demo/scenes/<name>/`; remove the `SceneSwitcherCarousel` + `useScrollSnapScene`; delete `Animated.vue`/`ResponsiveSelect.vue`; the cross-cutting extractions (`useContractAnimGroup`/`useSceneTransport`/`rafConstants`/`useTypedTrigger`). |
| | **R.W6** | Demo brittleness · state · styling | IMPL | The vueuse residuals (`DemoControlPoint`, `SpringHeatmap` RO+MutationObserver→`useGlobalDark`); callbacks-as-props → emits/expose; the typed `SceneExposedApi`; the z-index comma-default excision; the cube-3d.css extraction; the 3 state drift-points. |
| **E docs+close** | **R.W7** | Docs surface | IMPL | README slim (928→~720; stale paths + class name); CHANGELOG 5.0.0-format convention; reclassify `llms*.txt` as build-artifacts (gitignore + CI-generate); restore-list confirmed. |
| | **R.W8** | Close (deferred-ledger · prompt-recap · release) | IMPL (LAST) | Re-point the chronic ledger **Q→R** + DM-7 KILL (fold #1); discharge the 10-item fold; the prompt-recap confirmed; FINAL.md; version owner named (a major absorbing the breaking directory/subpath surface, or a careful minor — decided at close). |

**DAG.** R.W0 (now) → **R.W1 → R.W2** (the carve depends on the directories; sequential — they collide
on `engine.ts`/`group.ts`/the gates) · **R.W3 ∥ R.W4** (after the structure settles) · **R.W5 → R.W6**
(demo; fusion last, atomically per-scene) · **R.W7** (docs, parallel) · **R.W8** closes. The library
waves (R.W1–R.W4) and demo waves (R.W5–R.W6) are largely file-disjoint and parallelizable across the
two halves; the gate co-edits are owned centrally to avoid parallel-edit races.

## 5. The keystone precondition (R.W0)

Every retro lane converges on ONE precondition that must land FIRST: **DELETE the
`LIBRARY_CEILING_OVERRIDE` allowlist in `scripts/proof-decomposition.mjs`** and set a single hard
library ceiling. Today the override raises each cap to sit +1 above the file it measures (engine.ts
cap=1450 for a 1420L file; group.ts cap=925 for 924L) — a self-certifying gate that cannot bite, with a
prose essay arguing the god-module is a "cohesive gestalt." Once deleted, the gate reds on every
oversized file, and **those reds ARE the decomposition backlog** — measured by the gate, not by prose.
Without this, the next tranche re-spawns flat siblings under a self-raising cap (exactly what Q did).

## 6. The deferred-ledger fold + the prompt-recap

`PROGRESS.md` carries both in full. Headlines:

- **Prompt-recap: ZERO dropped** across A→Q→R (`audit/retro-prompt-recap.md`, re-verified). The one
  integrity item — the decomposition ask (a 12-tranche lineage) — is the HEADLINE of R, not a drop.
- **Deferred-ledger: 10 binding fold items** (`audit/retro-deferred-ledger.md`). Critical:
  **DM-1 (the dock click-strand) is now the 8th carry** — Q's register vowed "NO 8th carry," so R must
  land the glass-ui-BC delete OR fire the contingency KILL (a kf-internal replacement) — **no 9th
  carry**. DM-7 (keyframes-vue) is KILLED at R.W0; the ledger must record it. The glass-ui-BC-gated
  items (DM-1 S2, DM-5 S1, DM-24 N-Stage) stay correctly PENDING but aged a tranche.

## 7. What R explicitly does NOT do

- **No re-litigating settled ARCH kills** — Typed-OM (P2), the codegen/bbnf-lang spine (owner-retracted
  2026-06-22), SpanParser (V8-falsified), keyframes-vue (R.W0). The §4 "static-import home" is a package
  subpath, never a re-added `Animation` alias.
- **No over-engineering** — the 7 zone-dirs mirror the `internal/` shape (barrel + cohesive members),
  no registry/plugin/dispatch framework; the `presets/classic.ts` data-volume case takes a documented
  override, NOT a forced 3-way split; the demo keeps `animation-controls/`'s directory shape verbatim
  (it is the model) and resists intra-scene sub-dirs.
- **No churn-for-churn** — `demo/@/ → demo/shared/` rename is optional/cosmetic; the CHANGELOG history
  is not retroactively rewritten; pixels are isomorphic (stable) unless highly befitting.

## 8. DEV→IMPL boundary + verification

The R.W0 deliverable is verified by: (1) the 32-lane audit on disk + re-runnable (every cited RED
reproduces when the gate is run); (2) the deferred-ledger complete with a real disposition per item
(zero un-dispositioned punts); (3) the prompt-recap confirming full A→R coverage; (4) each wave spec
carrying a falsifiable born-RED gate. The IMPLEMENTATION (R.W1–R.W8) + its gates open in a later,
explicitly-authorized phase — exactly D/E/O/P/Q's dev→impl boundary, gated on keyframes' own green CI,
isomorphic + no-legacy throughout.

**The reds on `tranche-r-dev` ARE the charter** (the deferred-ledger's framing): `proof:decomposition`
(the keystone backlog), `proof:chronic-closure` (fold #1), the `leaves.ts` lint/boundary edge (R.W3),
and `proof:agent-surface` (the `Animation`/`ScrollTimeline` curation, R.W4). They go green wave-by-wave,
discharged by R's close — not papered by a self-raising cap.
