# a10 · R.W5 — Demo scene-fusion audit

**Lane:** a10-w5-scene-fusion (32-lane DEEP AUDIT of Tranche R)
**Scope:** `demo/scenes/<name>/` colocation vs `demo/@/` residue; dead-file excision; internal-shape consistency; SPEC (`docs/tranches/R/waves/R.W5.md`) vs SHIPPED (`master` a15cd48..18e8617) vs GESTALT.
**Method:** read-only git/grep/gate-run on `tranche-s-dev`. Ran `scripts/proof-scene-colocated.mjs` (PASS).

---

## Executive summary

**Grade: B+ (honest, substantively idiomatic fusion; a handful of consistency residues + one genuine colocation miss).**

R.W5 is **real, not cosmetic**. All eight scenes are physically fused into `demo/scenes/<name>/`; the old three-root scatter (`demo/app/scenes/*Scene.vue`, `demo/<name>/*`, ad-hoc `@/`) is gone; the born-RED gate `proof:scene-colocated` is wired into the hygiene chain and GREEN. The three headline invariants hold under direct verification:

- **Zero `../../` parent-climbs** anywhere under `demo/scenes/` (grep-clean).
- **Zero cross-scene imports** — no scene reaches into another scene's dir; each scene directory is genuinely self-contained.
- **Dead code truly deleted** — `SceneSwitcherCarousel.vue`, `useScrollSnapScene.ts`, `Animated.vue`, `ResponsiveSelect.vue` are gone from disk with no dangling references in live source (only a stale mention in `demo/CLAUDE.md:42`).

The Band-B cross-cutting extractions are **live and consumed** (not dead scaffolding): `useContractAnimGroup` (3 consumers), `useSceneTransport` (3), `rafConstants`/`PROGRESS_READOUT_HZ` (2) — the triplications the spec claimed to kill are actually killed. The Band-C DRY moves landed: `superKey` single-sourced in `<name>Keys.ts` for 7/8 scenes; `STAGE_MODES` parallel record removed and `stageMode` inlined per descriptor; `router.ts` route list generated from `allScenes` instead of hand-mirrored.

Deductions are all polish/consistency, none structural: (1) `cubeTransformStore.ts` is a cube-private store still sitting in `demo/app/` root — a real colocation miss; (2) `useTypedTrigger.ts` is a single-consumer scene-private composable parked in `@/composables/` under an aspirational "shared primitive" rationale; (3) cube is the lone scene with no `<name>Keys.ts` (its `SUPER_KEY` lives inside `useCubeAnimations.ts`); (4) the per-scene demo-composable name splits two ways (`use<Name>Demo` vs `use<Name>Animations`); (5) stale old-scatter paths linger in a few gate comments/baseline labels (non-functional).

**Biggest GESTALT inheritance for S:** Band A *deleted* the scene-switcher carousel as a dead no-op. Tranche S's charter explicitly wants the scene-switcher "resurrected properly." R.W5 correctly removed the broken artifact; S owns building the real one — this is a clean hand-off, not a regression.

---

## Findings

### 1. `cubeTransformStore.ts` is cube-private but still lives in `demo/app/` root — colocation miss  ·  MEDIUM

`demo/app/cubeTransformStore.ts` has exactly one live consumer: `demo/scenes/cube/CubeScene.vue` (grep for `cubeTransformStore`/`cubeTransform` returns only that SFC + `demo/CLAUDE.md`). It is cube-scene-private state (a `createGlobalState` store, touched in R.W6 `598b4ff`) yet sits at the app root rather than in `demo/scenes/cube/`.

This is the one genuine violation of the colocation contract the wave set out to enforce: a scene-private piece that did NOT get colocated. It escaped the fusion because it lived in `demo/app/` (app-scoped) rather than the `demo/<name>/` domain folder that Band C swept — so it was outside C's move set by construction, but the *contract* ("everything a scene owns is colocated") is not satisfied.

**Proposal (S):** relocate `demo/app/cubeTransformStore.ts` → `demo/scenes/cube/cubeTransformStore.ts`; fix the single import in `CubeScene.vue`. If it must stay a global singleton for the matrix-editor handshake, document that cross-surface tie explicitly; otherwise it is scene-local.

---

### 2. `useTypedTrigger.ts` is single-consumer scene-private, parked in `@/composables/`  ·  LOW

R.W5 Band B.4 extracted the `reelBuffer` ring-buffer out of `SequenceTarget.vue` into `demo/@/composables/useTypedTrigger.ts`, justified (spec §B.4) as a "shared demo primitive … alongside `useDragScrub.ts` and `gestureSelectSuppression.ts`." But the reality diverges from its two cited siblings:

- `useDragScrub` — 6 call-sites across 4 scenes (square, motion-path, sequence, spring) + shared surface. Genuinely shared.
- `gestureSelectSuppression` — multi-consumer (spring scene + `useDragScrub` + `DemoControlPoint` + `useDragCapture`). Genuinely shared.
- `useTypedTrigger` — **exactly one consumer**: `demo/scenes/sequence/SequenceTarget.vue`.

So the "shared primitive" framing was aspirational. The util is genuinely generic ("type a code → fire a callback"), so parking it in `@/` is defensible on reuse-potential grounds — but by the *current* dependency graph it is scene-private and by the colocation contract belongs in `demo/scenes/sequence/`.

**Proposal (S):** either (a) accept it as a shared primitive and add a second real consumer (e.g. a global keyboard-egg) to justify the `@/` home, or (b) colocate it into `demo/scenes/sequence/` until a second scene needs it. Do not leave a one-consumer file in the "shared" tree under a shared label — that is exactly the drift the colocation gate was meant to prevent, and the gate does NOT catch it (see Finding 6).

---

### 3. Cube is the only scene without a `<name>Keys.ts` — shape asymmetry  ·  LOW

7 of 8 scenes carry a `<name>Keys.ts` that owns the scene's `<NAME>_SUPER_KEY` (and, for inject-based scenes, its `<NAME>_DEMO_KEY`). Cube has **no `cubeKeys.ts`**; its `SUPER_KEY = "Cube"` and `CUBE_ANIMATION_NAMES` live inside `demo/scenes/cube/useCubeAnimations.ts:8`, and `demo/app/scenes.ts:36` reaches into the composable: `import { SUPER_KEY as CUBE_SUPER_KEY } from "../scenes/cube/useCubeAnimations"`.

The C.4 contract ("each scene's keys module OWNS its superKey constant") is met in spirit (single source) but the *file shape* is inconsistent: the registry imports cube's key from a composable, every other scene from a `*Keys.ts`. A reader scanning `demo/scenes/*/` for the keys file finds a hole at cube.

**Proposal (S):** add `demo/scenes/cube/cubeKeys.ts` exporting `CUBE_SUPER_KEY` (and move `CUBE_ANIMATION_NAMES` if it is key-like), re-point `scenes.ts:36`. Uniform 8/8 shape.

---

### 4. Demo-composable naming splits two ways  ·  INFO

The per-scene "demo controller" composable is named inconsistently:

| Scene | Composable |
|-------|-----------|
| easing, spring, sequence, morph, motion-path | `use<Name>Demo.ts` |
| cube, amiga, square | `use<Name>Animations.ts` |

R.W5 C.2 listed `use<Name>Demo.ts` as the standard peer for the fusion, but the shipped tree has a two-tier split (interactive full-controls scenes vs. showcase/animation scenes). This may be intentional (cube/amiga/square are direct-wire showcases with no inject-key demo context — cf. `amigaKeys.ts` / `squareKeys.ts` carrying only the superKey), but it is undocumented and reads as drift.

**Proposal (S):** decide the taxonomy explicitly. Either normalize to `use<Name>Scene.ts` for the controller across all 8, or document the `Demo` (interactive) vs `Animations` (showcase) distinction in `demo/CLAUDE.md` so it is a rule, not an accident.

---

### 5. Stale old-scatter paths linger in gate comments + baseline labels  ·  LOW (cosmetic; non-functional)

The "re-pointed 24 gate scripts" (PROGRESS.md:40) missed several *descriptive* references to the pre-fusion paths. All are comments or informational JSON fields — the gates read the correct new paths — but they are stale residue that will mislead:

- `scripts/proof-decomposition.mjs:180` — comment `AmigaScene is in demo/app/scenes/` (now `demo/scenes/amiga/`).
- `scripts/proof-scene-parity.mjs:194` — comment `The spring surface = demo/spring/` (the code walks recursively from the demo root, so it still functions; comment is stale).
- `scripts/proof-morph-scene.mjs:30` — born-RED note references `ls demo/app/scenes/` (historical; harmless).
- `scripts/baselines/crayon-preserved.json:66–106` — six `"source": "demo/cube/CubeTarget.vue"` labels. **Verified non-functional**: `proof-crayon-preserved.mjs:161` reads the *correct* `demo/scenes/cube/CubeTarget.vue` via a hardcoded map; the `source` field is informational only.
- `scripts/baselines/amiga-checkerboard.json:2` — `_doc` cites `demo/amiga/utils.ts` (now `demo/scenes/amiga/utils.ts`).

**Proposal (S):** sweep these five stale strings during the S gate-hygiene pass (they cost nothing to fix and one is a JSON field a future maintainer could trust).

---

### 6. `proof:scene-colocated` cannot catch scene-private-in-@/ drift  ·  LOW (gate-coverage gap)

The born-RED gate asserts three things: (1) each scene entry+peer exists and old scatter is gone, (2) no `../../` climbs under `demo/scenes/`, (3) named dead files deleted. It does **not** assert that a scene-private file (single consumer under `demo/scenes/<name>/`) is absent from `demo/@/` or `demo/app/`. That is precisely why Findings 1 and 2 slipped through green. The gate proves the *positive* (scenes are fused) but not the *negative* (nothing a scene solely owns lives outside it).

**Proposal (S):** extend the gate with a fourth assertion — a reference-count pass: any file under `demo/@/composables/` or `demo/app/` whose only importer is a single `demo/scenes/<name>/` file is flagged (allowlist the deliberate globals). Turns the colocation contract from convention into an invariant.

---

### 7. `MorphSVGScene.vue` entry name vs `morph` scene id — minor naming asymmetry  ·  INFO

Seven scene entries are `<TitleCaseId>Scene.vue`; the morph scene's entry is `MorphSVGScene.vue` (id `morph`, dir `morph`). Defensible (MorphSVG is the feature name) but the odd one out. Non-blocking; note only if S normalizes entry naming.

---

## Positives worth banking (so S does not "fix" what is already right)

- **Do NOT re-add the scene-switcher carousel as-was.** Its `onScroll` was a documented no-op (`useScrollSnapScene.ts` swipe-settle never implemented); deletion was correct. S's "resurrect properly" is a *new build*, not a revert.
- **`useSceneSwap.ts` (SpringProgress cross-dissolve) STAYS** — genuine engine dogfood + VT coverage gap; do not excise.
- **The subgrid two-declaration fallback in `SequenceTarget.vue` STAYS** — modern-web idiom, not a workaround.
- **The render-fn slot protocol (`defineExpose` + `h()`) STAYS** — idiomatic cross-sibling teleport; the only debt was `any` typing, already addressed by `SceneExposedApi` in R.W6.
- **Flat scene dirs (4–14 files, zero intra-scene subdirs)** — the KISS constraint held; do not introduce `components/`/`composables/` subfolders inside a scene.

---

## Tranche-S implications (wave-shaped)

1. **Wave S·demo-colocation-close** — finish what R.W5 started: move `cubeTransformStore.ts` → `scenes/cube/` (F1); resolve `useTypedTrigger` placement (F2, colocate-or-justify); add `scenes/cube/cubeKeys.ts` for 8/8 keys-file parity (F3). Small, mechanical, closes the honest residue.
2. **Wave S·colocation-gate-teeth** — add the reference-count fourth assertion to `proof:scene-colocated` (F6) so scene-private-in-`@/` drift is an invariant, not a convention. This is the structural upgrade that makes the deeper S sub-zoning safe.
3. **Wave S·scene-switcher-resurrect** — the charter item. Build a real scene-switcher (working scroll/swipe commit + typed VT) as a first-class `demo/app/` surface or a proper `scenes/`-adjacent widget. Explicitly does NOT reinstate `SceneSwitcherCarousel.vue`/`useScrollSnapScene.ts`.
4. **Wave S·demo-taxonomy-doc** — settle and document the `use<Name>Demo` vs `use<Name>Animations` split (F4) and the `<Name>Scene.vue` entry-naming rule (F7); fold the stale gate-comment/baseline sweep (F5). Cheap, prevents future drift being read as intent.
5. **Feeds S's "demo/app is a mess / playground identity unclear" charter** — R.W5 only touched the eight fused scenes; `demo/app/` (21 files) and `demo/playground/` were untouched by the fusion and remain the S structural frontier. The colocation *method* proven here (physical move + born-RED gate + reference-count) is the template to apply to app/playground.

---

## Verdict

R.W5 delivered the structural headline it promised: eight genuinely-colocated, self-contained scene directories, dead code excised, triplications killed, DRY registry wiring, all gate-enforced. The wave was **honest** — the shipped tree matches the spec's claims under direct verification, and the extractions are live rather than ornamental. It is **idiomatic**, not cosmetic. The residue S inherits is a short, concrete polish list (one real colocation miss, one aspirational placement, one keys-file hole, naming/label drift) plus one gate-coverage gap — none of which undermine the fusion, all of which are cleanly wave-addressable.

**Grade: B+.**
