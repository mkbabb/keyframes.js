# Lane r4 — Demo Deep Audit (content + layout)

**Branch:** `tranche-s-dev` · **Scope:** `demo/` post-R.W5 scene-fusion · **Date:** 2026-07-02
**Method:** static import-graph analysis (grep/wc/git, read-only) + vite.config mode reading. No source touched.

---

## Executive summary

The R.W5 scene-fusion (`scenes/<name>/`) is genuinely clean and cohesive — every scene dir is self-contained and the fused layout holds. The mess the owner smells is **`demo/app/`**, which is NOT a mess of *content* but a mess of *altitude*: it is a flat pile of 17 files that silently mixes four distinct concerns (app-shell · scene-machine reconcile · router reconcile · scene-swap transition) with **five cross-scene utility files that no app-shell file imports at all** — they are scene-tier code parked in the shell root. `cubeTransformStore.ts` is the flagship: a cube-scene-only store sitting in the app root.

`demo/playground/` is the real liability. It is a **second-class standalone app with a structurally broken production build** (inline `<script type=module>` bootstrap = the exact B.W4 blank-build footgun `main.ts` was created to fix — and its stale `dist/` proves it shipped the 698-byte blank shim), a **missing `outDir` pin** (the I.W5.S1 landmine, fixed for `app/` but never for `playground/`), and it is the **sole consumer of the entire 7-file `asset-manager/` suite + `EditableLabel.vue`**. It is CI-gated (two proof gates read `playground/App.vue`) but never deployed (absent from `gh-pages`). Its identity is unresolved: fuse-as-scene, uplift, or kill — all three are live.

`demo/@/` is mostly genuinely-shared, but harbors three colocation misplacements (`CSSPasteDialog`, `useTypedTrigger`, the `orbital-drag`+`matrix-editor`+`cubeTransformStore` cube-cluster) and one legacy remnant: the **16-file `ui/menubar/` shadcn-vue dir with a single consumer**, dragging `utils.ts`(`cn`) along as its only dependent.

Legacy sweep is **clean** on the excised-feature axis (no `animate()`, no color-picker, no real carousel) — the codebase's "no-legacy" convention held. The one legacy scar: `scenes.ts:239` documents a "mobile scroll-snap carousel" **that does not exist** — a stale comment describing the shelved scene-switcher Tranche S wants to resurrect.

---

## Part 1 — `demo/app/` (17 flat files + `composables/` + `public/`)

### Finding 1.1 — `cubeTransformStore.ts` is cube-scene-only, misplaced in app root — **HIGH**
**Evidence:** `demo/app/cubeTransformStore.ts` · sole importer `demo/scenes/cube/CubeScene.vue` (plus `CubeTarget.vue` transitively via the same store). No app-shell file imports it.
The file's own header (`cubeTransformStore.ts:6-8`) says "The home screen CubeTarget and CubeScene both read/write" — but *home's backdrop IS the CubeScene component* (App.vue:206 imports `CubeScene` directly), so both readers are the cube scene. This is scene-tier state living in the shell root purely for a historical reason.
**Proposal:** move to `scenes/cube/cubeTransformStore.ts`. It is the cleanest single win — a file the owner flagged by name.

### Finding 1.2 — Four more scene-tier files masquerade as app-shell — **HIGH**
None of these is imported by any app-shell/machine/router file; every importer is a scene (or another scene-util):

| File | Real importers | Verdict |
|---|---|---|
| `app/useRafScene.ts` | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringDemo.ts` | scene recipe, 0 app importers |
| `app/rafConstants.ts` | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringHotPath.ts` | 1-const cross-scene, 0 app importers |
| `app/useSceneVisibilityPause.ts` | 6 scenes + `app/useRafScene.ts` + the machine | cross-scene shared |
| `app/composables/useContractAnimGroup.ts` | `scenes/easing`, `scenes/spring`, `scenes/sequence` (transport host) | cross-scene recipe |
| `app/composables/useSceneTransport.ts` | same three scenes | cross-scene recipe |

**Evidence:** importer maps grepped across `demo/` — e.g. `useRafScene` header (`useRafScene.ts:11-42`) itself calls it "THE raw-rAF *scene* recipe". `useContractAnimGroup.ts:11-13` calls itself the killer of "the three-way contractAnim triplication across useEasingDemo / useSpringDemo / useSequenceDemo" — three *scenes*.
**Proposal:** these are shared-across-scenes but NOT app-shell. Relocate to a scene-shared home — either `demo/@/composables/` (uniform with `useDragScrub`/`gestureSelectSuppression`, which are exactly this: cross-scene primitives) or a new `demo/scenes/_shared/`. `app/` should hold only app-lifetime code.

### Finding 1.3 — The remaining 12 files ARE app-shell but are un-sub-zoned — **MEDIUM**
After removing 1.1+1.2, the honest app residue partitions into four concerns that are currently flat:

- **shell:** `App.vue` (488L), `main.ts`, `index.html`, `scenes.ts`, `sceneExposedApi.ts`, `public/`
- **machine reconcile:** `useSceneMachineApp.ts` (253L), `useSceneMachineRouter.ts` (137L)
- **router:** `router.ts`
- **transition:** `useSceneSwap.ts`, `useSceneTransition.ts`, `scene-transition.css`
- **diagnostics:** `loaf-observer.ts`, `useMonacoCancellationGuard.ts`

**Evidence:** the machine-reconcile pair is one cohesive concern (`useSceneMachineApp.ts:1-9` header: "THE SCENE-MACHINE ↔ APP-SHELL RECONCILE"; `useSceneMachineRouter.ts:1-20` header: "THE ROUTE RECONCILE"). The transition trio all wrap the same scene-key mutation. This is real sub-structure hidden in a flat dir.
**Proposal:** `app/{shell,machine,router,transition,diagnostics}/` OR at minimum `app/machine/` + `app/transition/`. Mirrors exactly the src/animation zone-partition ethos Tranche S extends to the library.

### Finding 1.4 — There is ONE scene machine, not two (non-finding, confirmed) — **INFO**
The reducer lives at `@/components/custom/animation-controls/stores/sceneMachine.ts` + `useSceneMachine.ts`. The `app/useSceneMachine*` files are *reconcile adapters* over it (machine↔shell, machine↔router), not a duplicate machine. This is correct layering. The naming collision (`useSceneMachineApp` vs `useSceneMachine`) is the only smell — worth a rename to `useSceneMachineShellBinding` / `useSceneMachineRouterBinding` under an `app/machine/` sub-zone.

### Finding 1.5 — App.vue statically imports CubeScene (home-backdrop coupling) — **LOW**
**Evidence:** `App.vue:205-206` — `import { CUBE_ANIMATION_NAMES } from "../scenes/cube/useCubeAnimations"` + `import CubeScene from "../scenes/cube/CubeScene.vue"`. The shell hard-codes cube as the home backdrop, and `useSceneMachineApp.ts:183-188` special-cases `home`/`cube` as a shared pair throughout the ready/remount logic. Intentional (home's hero IS the cube) but it's a scene→shell static coupling the other 7 scenes don't have; note it before any home-scene rework.

---

## Part 2 — `demo/playground/` (identity unresolved)

### Finding 2.1 — Playground production build is structurally broken (blank-build footgun) — **HIGH**
**Evidence:** `demo/playground/index.html:22-35` bootstraps via an inline `<script type="module">` importing `./App.vue`. This is the EXACT anti-pattern `demo/app/main.ts:1-9` documents and fixes: *"The bootstrap formerly lived as an inline `<script type="module">` in index.html — a graph LEAF rolldown was free to (and did) tree-shake, which shipped a blank production build: a 698-byte preload shim."* The playground never received the `main.ts` named-entry fix.
**Confirmation:** the stale `demo/playground/dist/assets/index-Dezn_h7o.js` is **698 bytes** — the exact blank-shim signature. The playground's last build shipped blank.
**Proposal:** if playground survives (2.4), it needs its own `main.ts` graph-root entry, byte-for-byte the `app/main.ts` remedy.

### Finding 2.2 — Playground vite mode has no `outDir` pin (the I.W5.S1 landmine, unfixed) — **HIGH**
**Evidence:** `vite.config.ts:686-705` — the `playground` mode sets `root: "./demo/playground/"` with **no `build.outDir`**. `vite.config.ts:365-374` documents that this exact shape ("`root: "./demo/app/"` with NO explicit `outDir`") was the landmine that wrote builds beside source; it was pinned to `dist/demo-app/` for `app/` (default mode) but **the playground mode was left with the original defect**. Any `vite build --mode playground` writes to `demo/playground/dist/` inside the source tree.
**Confirmation:** `demo/playground/dist/` exists (9.6 MB: monaco workers + the 698B shim), gitignored (`git check-ignore` confirms) but physically present — build debris in the source tree, mtime Jun 17.
**Proposal:** pin `outDir: dist/playground/` in the playground mode (or delete the mode entirely per 2.4). Delete the current `demo/playground/dist/` debris regardless.

### Finding 2.3 — Playground is the SOLE consumer of the entire `asset-manager/` suite + `EditableLabel` — **MEDIUM**
**Evidence:**
- `asset-manager/` (7 files: `AssetLayer/AssetLayerPanel/AssetPropertiesPanel/AssetViewport` + `useAssetManager` + `assetTypes` + `index`) — importers outside itself: `playground/App.vue` only, plus a store-reset tie `stores/index.ts:74,81` (`_resetAssetManagerStore()` in `resetAllStores`).
- `EditableLabel.vue` — sole importer `asset-manager/AssetLayer.vue`.
So `asset-manager` + `EditableLabel` are a playground-only cluster, currently living in the shared `@/` tree.
**Proposal:** if playground survives, colocate `asset-manager/` + `EditableLabel.vue` into `playground/` (or a fused `scenes/assets/`). If killed, they die with it (and the `stores/index.ts:74,81` reset hook is removed). Either way they leave `@/`.

### Finding 2.4 — Playground identity: CI-gated but un-deployed, capability-overlapping — **MEDIUM (decision)**
**Evidence:**
- **Reachable only via** `dev:playground` (`package.json:43`). **Absent from** `gh-pages` build — it is NOT deployed to keyframes.babb.dev.
- **But CI-gated:** `scripts/proof-design-refinement.mjs:210-214` (S9 bind-ignition) and `scripts/proof-demo-elevate.mjs:309-315` (a11y-w15 asset `:alt`) both read `playground/App.vue`. So it cannot be silently deleted without touching gates.
- **Capability overlap:** it rides the SAME `EditorShell` (`playground/App.vue:2`) + control-store surface as the main demo; its only unique capability is the asset-manager drag-drop viewport (2.3) and the S9 "foundry" bind-ignition atmosphere (`playground/App.vue:239-328`).
**Disposition (pick one in wave design):**
1. **Fuse-as-scene** — bring the asset-manager viewport into the main SPA as `scenes/assets/` (or `playground/`), registered in `scenes.ts`, deployed, and drop the standalone app + its broken build/mode entirely. Highest coherence; the asset-manager finally ships to users.
2. **Uplift** — keep standalone but fix 2.1 (main.ts entry) + 2.2 (outDir pin) + colocate 2.3. Preserves the "second app" story the CLAUDE.md tells.
3. **Kill** — delete `playground/` + `asset-manager/` + `EditableLabel` + the playground vite mode + the two proof-gate clauses. Smallest surface.
The broken build + un-deployed + second-class-config trifecta argues for **1 (fuse)** or **3 (kill)**; option 2 keeps a permanently-orphaned app alive.

---

## Part 3 — `demo/@/` inventory (shared vs. colocate-worthy)

Genuinely-shared (2+ cross-tree consumers, keep in `@/`): `animation-controls/` (the whole control suite — dozens of internal + scene consumers), `editor-shell/` (App + playground), `dock/ChromeDock` (App + controls), `styles/`, `@/composables/{gestureSelectSuppression,useDragScrub}` (6+ scenes each), `@/utils/{kfEngine,clipboard,iosTextEntry,toastGuard}` (multi-consumer). No dead files found — an automated zero-importer scan produced false positives that targeted re-checks disproved (e.g. `useShareState`←SharePopover, `useHeroSourceEgg`←EditorStartScreen, `kfEngine`←20+). The tree is import-live.

### Finding 3.1 — `CSSPasteDialog.vue` has a single consumer — colocate — **LOW**
**Evidence:** sole importer `animation-controls/timeline/KeyframeTimeline.vue`. It sits at `@/components/custom/` top level (a "single").
**Proposal:** move into `animation-controls/timeline/` (or `animation-controls/keyframes/`) beside its only user.

### Finding 3.2 — `useTypedTrigger.ts` is a "shared" composable with exactly one scene consumer — colocate — **LOW**
**Evidence:** `@/composables/useTypedTrigger.ts` · sole importer `scenes/sequence/SequenceTarget.vue:136`.
**Proposal:** move into `scenes/sequence/`. It is scene-specific, not shared.

### Finding 3.3 — The 3D cube-cluster (`orbital-drag/` + `matrix-editor/`) is effectively cube-only — **MEDIUM**
**Evidence:** every consumer traces to the cube scene:
- `matrix-editor/` importers: `scenes/cube/CubeScene.vue`, `orbital-drag/OrbitalDrag.vue`
- `orbital-drag/` importers: `scenes/cube/CubeTarget.vue`, `scenes/cube/useCubeRelit.ts`, `app/cubeTransformStore.ts` (itself cube-only, Finding 1.1), `matrix-editor/useTransformState.ts`
- The two dirs **cross-import each other** (`matrix-editor`↔`orbital-drag`), forming one coupled 3D-transform unit whose only external entry is the cube scene.
**Proposal:** these read as *shared 3D primitives* but have exactly one feature consumer. Two options: (a) colocate the whole cluster (`orbital-drag/` + `matrix-editor/` + `cubeTransformStore`) into `scenes/cube/` as the cube's 3D-transform sub-package; or (b) keep in `@/` explicitly as reusable primitives IF Tranche S plans a second 3D consumer. Absent a second consumer, (a) is the honest call and pairs with Finding 1.1.

### Finding 3.4 — `ui/menubar/` — 16-file shadcn-vue remnant with a single consumer — **MEDIUM**
**Evidence:** `@/components/ui/menubar/` (16 files) — the CLAUDE.md already flags it as "the ONE remaining shadcn-vue component dir; the rest migrated to @mkbabb/glass-ui". Sole importer: `animation-controls/keyframes/KeyframesEditor.vue`. And `@/utils/utils.ts` (`cn()`) is imported by **menubar files only** — `cn` is dead the moment menubar goes.
**Proposal:** replace the one `KeyframesEditor` menubar usage with glass-ui's menubar (per the migration the rest already took), then delete all 16 `ui/menubar/` files + `utils.ts`(`cn`). Net −17 files, kills the last shadcn island and its lone utility.

---

## Part 4 — Legacy sweep

### Finding 4.1 — Excised-feature axis is CLEAN — **INFO (good)**
**Evidence:** zero `animate(` references in `demo/` (the R animate() excision held); zero `color-picker`/`ColorPicker` references (the deprecated demo color-picker per MEMORY.md is fully removed); no real carousel implementation. The "no-legacy beside the replacement" convention is visible in ~40 narrative deletion-notes across the tree — these are *intentional documentation of removals*, not dead code.

### Finding 4.2 — `scenes.ts:239` documents a non-existent "mobile scroll-snap carousel" — **MEDIUM**
**Evidence:** `scenes.ts:237-241` — *"the mobile scroll-snap carousel reads the SAME order — no second hard-coded order list"*. A grep for `scroll-snap|scrollSnap|snap-mandatory|carousel|scene-switcher` implementation finds **none** — the actual scene switcher is a reka/glass-ui `<Select>` dropdown in `dock/ChromeDock.vue:12-16`. The comment describes a shelved feature as if it exists.
**Proposal:** this IS the "shelved scene-switcher" Tranche S wants to resurrect. Either build the mobile scroll-snap carousel the comment promises (consuming `sceneIndex`) or correct the comment. The `sceneIndex`/`sceneOrder` seam (`scenes.ts:243-251`) is already the single order-source the carousel would consume — the substrate is ready.

### Finding 4.3 — `design-idioms.css` carries tombstone comment-blocks (era archaeology) — **LOW**
**Evidence:** `design-idioms.css:412` (`.scale-on-hover — DELETED`), `:459` (`.gold-shimmer — DELETED`), `:545` (four scoped blocks REMOVED) — multi-line comment blocks documenting *removed* rules. These are archaeology, not active CSS. Also `DESIGN.md` "Migration Tasks" holds two stale unchecked boxes (upstream `tab-trigger-*`, evaluate card layouts).
**Proposal:** under Tranche S's "NO legacy/era-comments" charter, collapse the DELETED-block tombstones to at most a one-line changelog reference (or drop them — git history is the record). Reconcile the `DESIGN.md` migration checklist.

---

## Tranche-S implications (wave-shaped)

**Wave D1 — app/ altitude correction (the owner's headline).**
1. Move `cubeTransformStore.ts` → `scenes/cube/` (1.1).
2. Move the 5 scene-tier utils out of `app/` → `@/composables/` or `scenes/_shared/` (1.2): `useRafScene`, `rafConstants`, `useSceneVisibilityPause`, `composables/useContractAnimGroup`, `composables/useSceneTransport`.
3. Sub-zone the honest app residue: `app/{shell,machine,router,transition,diagnostics}/` (1.3); rename `useSceneMachineApp`→`…ShellBinding` to break the `useSceneMachine` collision (1.4).

**Wave D2 — playground disposition (decide first, then execute).**
4. Resolve the trilemma (2.4): **fuse-as-scene** (register asset-manager viewport in `scenes.ts`, deploy it, delete the standalone app + playground vite mode) is the recommended coherence play; **kill** is the recommended minimal play. Only pick "uplift" if the second-app narrative is load-bearing.
5. Whichever: delete `demo/playground/dist/` debris and fix/remove the un-pinned `outDir` mode (2.2); if uplifting, add a `main.ts` graph-root entry (2.1).
6. Relocate/kill `asset-manager/` + `EditableLabel` with the decision (2.3); update `stores/index.ts:74,81` reset hook + the two proof-gate clauses (`proof-design-refinement.mjs` S9, `proof-demo-elevate.mjs` a11y-w15).

**Wave D3 — @/ colocation + legacy-island removal.**
7. Colocate `CSSPasteDialog`→`animation-controls/timeline/` (3.1); `useTypedTrigger`→`scenes/sequence/` (3.2).
8. Cube-cluster: colocate `orbital-drag/`+`matrix-editor/`(+`cubeTransformStore` from D1) into `scenes/cube/` unless a second 3D consumer is planned (3.3).
9. Kill the shadcn island: migrate `KeyframesEditor`'s menubar to glass-ui, delete `ui/menubar/` (16 files) + `utils.ts`(`cn`) (3.4).

**Wave D4 — scene-switcher resurrection + legacy-comment sweep.**
10. Build the mobile scroll-snap carousel the `scenes.ts:239` comment already promises, consuming the ready `sceneIndex` seam — this is the shelved-switcher resurrection (4.2).
11. Collapse `design-idioms.css` DELETED-tombstones + reconcile `DESIGN.md` migration checklist under the no-era-comment charter (4.3).
