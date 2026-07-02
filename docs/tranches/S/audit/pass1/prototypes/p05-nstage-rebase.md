# p05 — n-stage salvage rebase probe

**Probe:** p05-nstage-rebase (Pass-1E prototype fleet) · **Date:** 2026-07-02 · **Worktree branch:** master (fused-scene tree; identical to tranche-s-dev for the demo scene layout)
**Question:** SPEC-v1 §6 **Q5** + r7 Part A (r7-scene-switcher-glassui.md)

---

## 1. The question + the spec's assumption

**Q5 (SPEC-v1 §6:738-743):** *"Is the n-stage salvage actually rebasable — what is the path-drift cost? Extract scene-stage/ from `n-stage-impl` onto tranche-s-dev; re-path the registry onto demo/scenes/<name>/; mount behind a dev flag. SUCCESS: compiles; proof:boundary green (SpringProgress/RAFPlayback imports hold)… FAILURE: Target components no longer mountable standalone (fusion coupled them to Scene shells) → the ScenePreviewHost needs a per-scene adapter layer; cost that into S.E1."*

**The spec assumes salvage** (ruling **C-7**, SPEC-v1:182-188): *"DM-24 is REVIVED, not re-litigated… the salvage source is the `n-stage-impl` shelf (orbit + LOD engines lifted near-verbatim)."* r7 A-7 predicted the only obstruction is *"a mechanical re-path, not a redesign"*: R.W5 fused scenes moved `demo/<scene>/` → `demo/scenes/<scene>/`, staling every registry path.

This probe tests that assumption at the **compile** layer (wiring/rendering explicitly out of scope): extract the shelf's `scene-stage/`, re-path onto the fused tree, and drive it to a clean `check`.

---

## 2. What I actually did (commands + exit codes)

Worktree: `.claude/worktrees/wf_f9faf42c-6b8-5` (symlinked `node_modules`; never `git add`ed).

1. **Extracted** the shelf's `scene-stage/` tree verbatim (`git show n-stage-impl:<path>`) — **18 files, 3387 LOC**, under `demo/@/components/custom/scene-stage/`. Deliberately did **not** extract the shelf's `App.vue` (+117) / `TransportDock.vue` (+86) wiring — that is the bespoke dock-arrow swap r7 A-8 rules out (dogfood glass-ui BG dock-morph instead), and Q5 needs only the engine + registry.

2. **`npx tsc --noEmit`** (this is the project's `check` gate — `package.json:40`) with the raw shelf paths:
   - **16 errors, ALL `error TS2307` (cannot find module), ALL in scene-stage** — the current demo tree is otherwise clean (total==scene-stage==16). Every error is a stale `.ts` import (`../../../../easing/easingKeys` …). Notably the stale **`.vue`** target paths did **not** error (tsc resolves them through the `*.vue` wildcard declaration), so tsc under-reports drift — the `.ts` module imports are the tell.

3. **Re-pathed** with two `sed` rewrites: registry `../../../../<scene>/` → `../../../../scenes/<scene>/`; previews (one dir deeper) `../../../../../<scene>/` → `../../../../../scenes/<scene>/`; plus amiga's special move `app/scenes/AmigaScene.vue` → `scenes/amiga/AmigaScene.vue`. **5 files, 23 import lines rewritten** (registry 15, four previews 2 each). Verified all 15 re-pathed targets exist on disk.

4. **`npx tsc --noEmit`** after re-path: **0 errors (exit 0)**.

5. **`node scripts/proof-boundary.mjs`**: **PASS (exit 0)** — *"every barrel light entry is value.js-free… inv α holds."*

| Command | Before re-path | After re-path |
|---|---|---|
| `tsc --noEmit` (== `npm run check`) | 16 × TS2307 (all scene-stage) | **0 errors, exit 0** |
| `proof-boundary.mjs` | PASS | **PASS, exit 0** |

Diff --stat of the salvage vs raw shelf: **5 files changed, 23 import lines** (pure path substitution — no logic edits).

> Caveat recorded honestly: the project ships **no `vue-tsc`** (confirmed `node_modules/.bin/vue-tsc` MISSING; `check` is bare `tsc`). So neither the project gate nor this probe type-checks the 4 `.vue` `<script setup>` blocks. tsc *does* fully check the 14 `.ts` files (composables, registry, previews) — the entire salvage **engine** (orbit + LOD) is `.ts` and is fully compile-verified. The `.vue` files' *import specifiers* were verified to resolve (below); their internal template/type-inference was not (and is not gated in this repo).

---

## 3. Findings with file:line evidence

**F1 — The drift is 100% path drift; zero API-signature drift.** All four keyframes.js imports the shelf pulls are LIGHT-barrel and still live post-R:
`SpringProgress` (`useCarouselOrbit.ts:3`, `useStageLight.ts:3`, `StageArrows.vue:6`), `RAFPlayback` (`useLivePreviewLOD.ts:9`), `stagger` (`CarouselDisk.vue:4`), `NumericAnimation` (`previews/cube.ts:3`, `previews/square.ts:2`). All resolved under tsc — **no dead keyframes.js API was hit.** This confirms r7 A-2/A-3 ("imports survive unchanged post-R").

**F2 — The stale imports were exactly the fusion re-path r7 A-7 predicted, and nothing else.** The 16 TS2307s were all `demo/<scene>/…` → now `demo/scenes/<scene>/…`. Registry `.vue` async-component thunks (`sceneStageRegistry.ts:220-276`) + the inject-adapter key/composable dynamic imports (`:126-172`) + the `previews/*.ts` adapters (`easing.ts:26-27`, `spring.ts:22-23`, `sequence.ts:21-22`, `motionPath.ts:29-30`). Fix = one `sed` per depth. No file needed structural change.

**F3 — proof:boundary holds (Q5's named success criterion met).** `proof-boundary.mjs` PASS. Note the gate scans `src/` (the library), so it is green independent of the demo; but the *demo-side* boundary claim r7 makes — that the salvage is value.js-free — is separately confirmed by F1 (only LIGHT specifiers imported).

**F4 — The FAILURE branch does NOT trigger: the per-scene adapter layer already exists in the shelf and survived fusion.** Q5's failure clause worries that fused Targets "no longer mountable standalone." But the shelf already ships that adapter layer: `sceneStageRegistry.ts:17-23` documents PROP-adapters (`CubeTarget`, `SquareInstrument`) vs INJECT-adapters (`EasingTarget`/`SpringTarget`/`SequenceTarget`/`MotionPathTarget`, which `inject(SOME_DEMO_KEY)!` and would throw bare), and the registry provisions the inject targets by dynamically importing each scene's `<scene>Keys` + `use<Scene>Demo` (`:126-172`). Those composables **survived fusion unchanged** — all 15 re-pathed targets exist (verified on disk) and type-resolve. So R's fusion did not sever standalone-mountability at the type layer; the scaffolding the failure clause would demand is **pre-built**. (Runtime mount/render is out of scope per the probe charter — but the adapter contract compiles.)

**F5 — One real gap, cheap: the registry enumerates 7 scenes, the fused tree has 8.** `sceneStageRegistry.ts` ids = cube, amiga, square, easing, spring, sequence, motion-path — **`morph` is absent** (`grep morph` = 0; `demo/scenes/morph/MorphTarget.vue` exists). This is r7 A-7's "9th scene" note (morph was added after the shelf froze). Adding one registry row + one `previews/morph.ts` adapter is additive, not a re-path. Does not block compile.

**F6 — The un-extracted wiring is the part r7 says to rewrite anyway.** The shelf's `App.vue`/`TransportDock.vue` deltas (the `stageDockKey` bespoke dock-arrow swap) are the second-authority dock surface r7 A-8 / SPEC C-7 rule OUT of the salvage. Leaving them on the shelf is correct; the S-band expresses arrows through the existing `ChromeDock` / glass-ui BG dock-morph. So "files touched" for the real wave legitimately excludes them.

---

## 4. VERDICT: **confirms-spec**

The spec's salvage assumption (C-7 / Q5-SUCCESS) is **correct and cheap**. The shelf rebases onto the fused tree with a **pure mechanical path substitution — 5 files, 23 import lines — after which `check` is 0-error and `proof:boundary` is green.** Zero dead upstream APIs; zero API-signature drift; the FAILURE branch (fusion broke standalone Targets → needs a new adapter layer) does **not** fire, because the shelf already carries that adapter layer and its dependencies survived R's fusion intact. This is *rebasable-salvage*, decisively — not rewrite-from-spec.

**Adjustment to spell out:** none to the ruling. Two clarifying refinements for SPEC-v2 / S.E1:
- **(a)** Q5's success criterion should note that the project's `check` is **bare `tsc` (no `vue-tsc`)** — so the compile gate verifies the salvage *engine* (`.ts`) fully but the 4 `.vue` script blocks only at the import-resolution level. The S-band's born-RED `proof:scene-stage-commits` (a browser-actuating gate, SPEC:456-458) is what actually exercises the `.vue` render path; do not expect `check` alone to catch a `.vue` template regression.
- **(b)** Fold the `morph` scene into the registry as wave-1 work (F5) — the shelf's frozen 7-scene list must be re-derived from `demo/app/scenes.ts` (8 scenes), exactly as r7 A-7 / SPEC-v1:108 already direct.

---

## 5. Implementation-cost estimate for the real wave (S.E `scene-stage`)

**Files touched (salvage-lift portion, W-orbit-lod-lift + W-registry-repath):**
- **18 files lifted verbatim** from `n-stage-impl:demo/@/components/custom/scene-stage/` (3387 LOC).
- **5 files re-pathed** (23 lines) — the entire drift cost, `sed`-scriptable.
- **+2 files** to close the morph gap (`previews/morph.ts` + one registry row); enumerate from `scenes.ts`.
- **NOT lifted:** the shelf's `App.vue`/`TransportDock.vue`/`stageDockKey.ts` dock-arrow wiring (F6) — rewritten through `ChromeDock` in a later wave (W-commit-on-settle / the gated dock-morph dogfood).

**Gates affected:**
- `proof:boundary` — **stays GREEN** (LIGHT-only imports; confirmed). No risk.
- `npm run check` (`tsc`) — **green after re-path** (proven here). No risk.
- `proof:scene-colocated` ASSERTION 3 — its carousel-absence clause dies in S.A (C-6); the re-homed `scene-stage/` lives under `demo/@/components/custom/` (not `demo/scenes/`), so the location/no-climb clauses are unaffected. Verify at impl.
- `proof:scene-switcher-mobile` → reborn as **`proof:scene-stage-commits`** (C-6, born-RED until S.E lands) — the browser-actuating acceptance gate. This is where the `.vue`/render + commit-on-settle risk actually lands (not in `check`).

**Risk: LOW for the salvage-lift; MEDIUM concentrated downstream.**
- *Compile/boundary rebase:* de-risked to near-zero by this probe (mechanical, proven).
- *Residual risk sits entirely in the un-probed layers:* (1) `.vue` template/render correctness (no `vue-tsc` gate — must be caught live via `proof:scene-stage-commits`); (2) runtime standalone-mount of the inject-adapter Targets (the composables resolve, but whether provisioning `use<Scene>Demo` yields a rendering idle preview is a runtime question this probe did not drive); (3) the dock-integration rewrite (F6) — a genuine redesign, gated on the glass-ui 5.0.0 consume-edge (r7 Part B).

**One-line cost:** the salvage engine rebases for **~half a day of mechanical re-path + morph-row** (this probe did the re-path in minutes); the *real* S.E effort is the deliberately-excluded wiring (commit-on-settle, single-authority dock, live-verified stages) — which the spec already scopes as separate waves.
