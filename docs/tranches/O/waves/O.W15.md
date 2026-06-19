# O.W15 — N Stage scene-switcher unshelf (DM-24, the pointerdown-intercept production switch + the boundary gate)

**Band:** F — glass-ui BC consume
**Phase:** GATED (glass-ui BC cut published — version placeholder `~<BC>.x`; the BC cut version is USER-DOMAIN and NOT frozen at authoring time; per O.md §7 use `~<BC>.x` as the pin placeholder until the cut is announced)
**Sequence:** O.W12 (S1+S2 workaround deletes + BC re-pin) → O.W13 (design-paint baseline lock) → **O.W15** (N Stage unshelf) [parallel with O.W14 lighthouse posture flip, which has no dependency ordering with O.W15]
**Owning chronic/DM:** DM-24 (N Stage scene-switcher HANDOFF, born N 2026-06-18; BC dock tripwire; chronicity 1 at O: N→O; now fires at BC cut)

M-substrate: **N.WZ** (the production integration — dock Select → Stage; the `pointerdown`-intercept design; the `proof:stage-supersedes-dropdown` gate chartered) + **N.W2** (the `proof:n-stage-boundary` import-graph walk gate chartered). Both are the authoritative design references for what this wave builds. Key delta from N.WZ to O.W15:
- N was SHELVED by owner directive (commit `e2375b8`: "the stage selector SHELVED per owner; impl preserved on this branch, spec kept"). O.W15 is the unshelf — the N impl merges to master at the BC cut.
- The n-stage-impl branch diverged from master at commit `5106416b` (11 commits behind master at O audit time), carrying stale deps (`@mkbabb/parse-that: "^0.9.0"`, `@mkbabb/value.js: "^0.13.0"`) and the S7 flat-comma normalize workaround (`utils.ts:183-200`) that master has since deleted (M consume, proof:workaround-deletion S7 GREEN). The rebase MUST resolve the S7 conflict by KEEPING master's deletion.
- N.WZ specifies the **`pointerdown`-intercept** wiring for the dock scene-select: fire `open-stage` on `pointerdown`, kill the trailing `click`. The current n-stage-impl wiring is `@update:model-value` (post-selection from the reka Select dropdown) in `ChromeDock.vue:273`. This is the production switch O.W15 authors (AUDIT-DIGEST F27 §[HIGH·gap]: "the N.WZ spec requires pointerdown intercept on the DockSelectTrigger…but the current n-stage-impl opens the stage via `@update:model-value`").
- The `proof:n-stage-boundary` gate (N.W2 §born-RED) was chartered but never authored — zero N-specific proof gate scripts exist on either branch (AUDIT-DIGEST F27: "15 N-specific proof gates chartered in N.W1-N.WZ — none authored"). O.W15 authors the boundary gate as its born-RED gate-first obligation.
- ASK-3 (the "scene-select dock affordance") was silently dropped from `KF-INBOUND.md` and no BC wave delivers a scene-select slot (AUDIT-DIGEST A2/A3). O.W15 clarifies that the scene-select affordance is **kf-owned** (kf's ChromeDock composition), not a BC API surface — BC ships the stable buttery dock morph substrate; kf builds the scene-select atop it. No BC wave authors a scene-select slot.

---

## Context

DM-24 was born at Tranche N (2026-06-18) when the owner shelved the Stage scene-switcher pending the glass-ui BC dock redesign. The tripwire was the BC dock morph substrate: once BC.W-DOCK-ENGINE + Band-2 fleet ship (`DOCK-ARBITRARY`, `DOCK-SHRINK-BLUR`, `DOCK-VERTICAL-FIX`, `DOCK-COLLAPSED-BOTH`, `DOCK-STACK-RAIL`, `LIQUID-MORPH`) the buttery dock expand/collapse is stable enough to host the Stage invocation path without the crossfade-strand race (the S2 DM-1 root). BC Band-2 is confirmed paint-verified at BC HEAD `c93d0b88` (AUDIT-DIGEST A3). The BC CUT (tier 27, glass-ui BC) is the unblock event.

**The production integration plan (from N.WZ §S1, adopted here verbatim):**

1. In `App.vue`, `<SceneStage>` is already mounted via `<Teleport to="body">` on `n-stage-impl` (confirmed: `demo/app/App.vue:184` on branch). The `runSceneSwitch` prop wiring is present. No re-authoring needed.
2. The stage open path currently fires via `@switch-scene="onSceneSwitchRequest"` in `App.vue` (line 13 on n-stage-impl), where `onSceneSwitchRequest` calls `sceneStageRef.value?.open(currentSceneId.value)`. This is triggered by `ChromeDock.vue:273`'s `@update:model-value="(id) => emit('switchScene', String(id))"`. The semantic: the user opens the reka Select, picks a scene, the `@update:model-value` fires, and THEN the Stage opens. This is the **post-selection** path — the wrong semantic.
3. **The O.W15 production switch.** Replace the `@update:model-value` post-selection trigger with a `@pointerdown`-intercept on the `DockSelectTrigger` in `ChromeDock.vue`. The new semantic: the user's `pointerdown` on the dock's scene-select trigger fires `emit('switchScene')` immediately (opening the Stage), and the trailing native `click` is killed via `event.preventDefault()` / `event.stopPropagation()` in a capture-phase handler so the reka Select dropdown does NOT open simultaneously. The AT/keyboard fallback: `Tab` → `Space`/`Enter` on the trigger opens the reka Select dropdown (Stage is NOT triggered by keyboard focus — only by pointer). This mirrors the BLK-8 fix pattern documented in N.WZ §S1 and the `@mbabb` menu trigger in `App.vue:45-47`.

**The n-stage-impl component inventory (AUDIT-DIGEST F27, verified on branch):**
```
demo/@/components/custom/scene-stage/
├── CarouselDisk.vue            # the 7-item tilted carousel ring (the disk geometry)
├── ScenePreviewHost.vue        # LOD-gated preview host, mounts per-scene preview
├── SceneStage.vue              # the overlay SHELL — Teleport-to-body top-layer
├── StageArrows.vue             # the glassy step-left/step-right arrow buttons
├── composables/
│   ├── useCarouselOrbit.ts     # SpringProgress ring-angle + shortest-delta spin + falloff
│   ├── useLivePreviewLOD.ts    # level-of-detail gate for preview rendering
│   ├── useSceneStage.ts        # orchestration: phase machine + open/close + commit
│   └── useStageLight.ts        # CSS --stage-light + --stage-pool-x drive
├── previews/
│   ├── cube.ts                 # CubeScene preview adapter
│   ├── easing.ts               # EasingScene preview adapter
│   ├── index.ts                # barrel
│   ├── motionPath.ts           # MotionPathScene preview adapter
│   ├── sequence.ts             # SequenceScene preview adapter
│   ├── spring.ts               # SpringScene preview adapter
│   ├── square.ts               # SquareScene preview adapter
│   └── types.ts                # preview adapter contract
├── sceneStageRegistry.ts       # 7 scene entries (id + preview factory)
└── stageDockKey.ts             # InjectionKey<StageDockControl> + interface
```

**LIGHT-barrel discipline (locked decision 1, N.md).** The Stage dogfoods ONLY LIGHT-barrel exports: `SpringProgress` (`spring.ts`), `NumericAnimation` (`numeric.ts`), `SmoothProgress` (`smooth.ts`), `stagger` (`stagger.ts`), `RAFPlayback` (`playback.ts`). It never imports `loadAnimationEngine`, `fromMotionPath`, `fromDrawSVG`, `animate`, or any `@mkbabb/value.js` path. This is the boundary law the `proof:n-stage-boundary` gate enforces.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19 unless noted) |
|-----|-----------------|------------------------------------------|
| AUDIT-DIGEST F27 | `n-stage-impl` branch HEAD | 4 impl commits (`b271fa1`, `f14e943`, `8606eec`, `e2375b8`) carrying `SceneStage.vue`, `CarouselDisk.vue`, `StageArrows.vue`, composables, previews — implementation is substantial but shelved |
| AUDIT-DIGEST F27 | `git diff master n-stage-impl -- package.json` | `@mkbabb/parse-that: "^0.9.0"` (master: `"^0.11.0"`); `@mkbabb/value.js: "^0.13.0"` (master: `"^1.0.2"`) — pre-constellation pins must be updated |
| AUDIT-DIGEST F27 | `git diff master n-stage-impl -- src/animation/utils.ts` | S7 flat-comma normalize present on `n-stage-impl` (`utils.ts:183-200`); DELETED on master (proof:workaround-deletion S7 GREEN); the conflict surface on rebase |
| AUDIT-DIGEST F27 | `ChromeDock.vue:273` (n-stage-impl) | `@update:model-value="(id) => emit('switchScene', String(id))"` — the post-selection trigger; N.WZ requires `pointerdown`-intercept instead |
| AUDIT-DIGEST F27 | `package.json` on both branches | Zero `proof:n-stage-boundary`, `proof:stage-supersedes-dropdown`, `proof:no-keepalive`, `proof:no-raw-raf` in `proof:correctness` or `proof:hygiene` — 15 chartered N gates; 0 authored |
| AUDIT-DIGEST A3 | BC `EXECUTION-PROGRESS.md` | BC.W-DOCK-ENGINE + Band-2 fleet paint-verified at BC HEAD `c93d0b88`; BC CUT (tier 27) still pending |
| AUDIT-DIGEST A2 | `KF-INBOUND.md` ask table | ASK-3 ("scene-select dock affordance") silently DROPPED — no BC wave delivers a scene-select slot; kf owns the scene-select integration |
| AUDIT-DIGEST G31 | `git rev-list 5106416..master --count` | 11 commits behind master at audit time |

---

## Scope

### S1 — Rebase `n-stage-impl` onto O-master + resolve S7 conflict + update pins (pre-unshelf, gate-first prerequisite)

**Breach.** `n-stage-impl` diverged at commit `5106416b` (BEFORE the M consume cascade). It carries stale deps and the S7 flat-comma normalize workaround that master has deleted. A direct merge would re-introduce the S7 breach.

**Cure.** Before any integration commit:
1. Rebase `n-stage-impl` onto O-master (after O.W12 BC re-pin is committed — so the rebase base has the correct constellation deps).
2. Resolve the `src/animation/utils.ts` S7 conflict by **KEEPING master's deletion** — the 9-line normalized-flat-comma block is the retired workaround; master's canonical space-joined `parseLinearStops(timingFunction)` direct call is correct.
3. Update `package.json` deps to the O-master constellation pins (`"@mkbabb/parse-that": "^0.11.0"`, `"@mkbabb/value.js": "^1.0.2"`, `"@mkbabb/glass-ui": "~<BC>.x"` matching the O.W12 re-pin).
4. Verify `npm install` resolves cleanly; `npm run build` exits 0; `npm run check` exits 0.

**Constraint.** DO NOT rebase before O.W12 is committed (the BC re-pin must be on master before the rebase base is set). Rebase only the four impl commits (`b271fa1`, `f14e943`, `8606eec`, `e2375b8`) — the earlier commits carry M-dev docs that are already on master.

**Gate bite (S1 is not independently gated — it is the prerequisite for S2/S3).** `npm run check` and `npm run proof:all` must pass on the rebased tree before S2/S3 proceed. The S7 conflict resolution is the critical correctness gate; `proof:workaround-deletion` S7 must remain GREEN after the rebase (the deletion is kept, not reverted).

---

### S2 — Author `scripts/proof-n-stage-boundary.mjs` (born-RED, gate-first, kf-internal NOW)

**Breach (N.W2 §born-RED, AUDIT-DIGEST F27).** The `proof:n-stage-boundary` gate is chartered in `N.W2.md` with a precise esbuild metafile-walk mechanism, but was never authored. No gate asserts the Stage's demo-graph is HEAVY-import-free. The existing `proof:boundary` scans the LIBRARY barrel (`src/animation/index.ts`) only — it does NOT traverse `demo/` components; a HEAVY import in any stage module leaves `proof:boundary` GREEN while silently violating the boundary law (N.W2 §S8, adversarial correction).

**Cure (gate-first — the script only; no scene changes).** Author `scripts/proof-n-stage-boundary.mjs`:
- Uses `esbuild.build({ entryPoints: ['demo/@/components/custom/scene-stage/SceneStage.vue'], bundle: true, write: false, metafile: true, plugins: [vue, the demo @-alias resolver] })` — the same esbuild/metafile-walk shape `proof:boundary` uses for the library barrel.
- Walk `result.metafile.inputs` (the resolved STATIC module graph) and assert:
  - `src/animation/engine.ts` NOT in inputs (the heavy split entry).
  - `src/animation/animate.ts` NOT in inputs.
  - `src/animation/motion-path.ts` NOT in inputs.
  - `src/animation/draw-svg.ts` NOT in inputs.
  - Any path matching `@mkbabb/value.js` NOT in the STATIC inputs (value.js-free at the static surface; a dynamic `import()` edge is marked a separate output by esbuild — NOT a static input — so `loadAnimationEngine()` called from outside the stage graph does not violate this).
- Exits 1 naming the offending module if any heavy static edge is found.
- **Born-RED by construction on today's tree:** `demo/@/components/custom/scene-stage/` does NOT exist on master. `SceneStage.vue` is absent. The esbuild entry resolves to a missing file → exit 1 (file not found). After S1 merges the stage tree to master, the gate runs against the real component tree — if any impl file carries a HEAVY static import, it exits 1 naming the module.
- Wire into `package.json` under `proof:n-stage-boundary`; add to `proof:hygiene` (AXIS-2 import-graph scan, not a browser gate — same classification as the existing `proof:boundary`).

**Planted violation test (born-RED in two modes):**
1. Pre-S1 (today): `node scripts/proof-n-stage-boundary.mjs` → exit 1 (file not found: `SceneStage.vue`). The gate is absent-and-born-RED.
2. Post-S1, planted: add `import { loadAnimationEngine } from "@src/animation/index"` to any stage composable → the gate walks the graph, finds `engine.ts` as a static input → exit 1 naming the file. Remove the planted import → exit 0.

---

### S3 — The `pointerdown`-intercept production switch (the `@update:model-value` → `@pointerdown` migration in `ChromeDock.vue`)

**Breach (AUDIT-DIGEST F27, N.WZ §S1).** `ChromeDock.vue:273` (on n-stage-impl) uses `@update:model-value="(id) => emit('switchScene', String(id))"` to trigger the scene switch. This fires AFTER the reka Select dropdown has opened and the user has picked a scene. The N.WZ design specifies `pointerdown`-intercept: the Stage opens the instant the user's pointer goes down on the dock scene-select trigger — the reka dropdown never opens. The current impl opens the Stage AFTER the user has already interacted with the dropdown, which is the wrong UX.

**The correct semantic (N.WZ §"The production integration — dock Select → Stage").** The dock's scene-select trigger acquires a `@pointerdown` handler that:
1. Calls `event.preventDefault()` to suppress the default pointer behavior.
2. Emits `'switchScene'` (or a dedicated `'open-stage'` event) immediately on `pointerdown`, before the reka Select opens.
3. A capture-phase `@click.capture` handler kills the trailing native `click` so the reka dropdown does NOT open simultaneously (the same pattern as the `@mbabb` menu trigger in `App.vue:45-47`).
4. The AT/keyboard fallback: `Tab` focuses the trigger; `Space`/`Enter` opens the reka Select dropdown (Stage NOT triggered by keyboard — only by pointer).

**Cure.** In `ChromeDock.vue` (on the rebased n-stage-impl/O-master tree):
- On the `DockSelectTrigger` element wrapping the scene Select (around line 100 on n-stage-impl): add `@pointerdown="onSceneSelectPointerdown"` and `@click.capture="onSceneSelectClickCapture"`.
- `onSceneSelectPointerdown(event)`: primary button + non-ctrl check; `event.preventDefault()`; emit `'switchScene'` (signals App.vue to open the Stage); set a `sceneSynthClick = true` sentinel.
- `onSceneSelectClickCapture(event)`: if `sceneSynthClick` → allow through (the keyboard-synthesized path); else `event.preventDefault(); event.stopPropagation()` (kill the trailing native click from the pointerdown).
- REMOVE (or leave inactive) the `@update:model-value="(id) => emit('switchScene', String(id))"` line — it is the post-selection path; after the switch to `pointerdown`-intercept the Stage opens before any selection is made.

**App.vue `onSceneSwitchRequest` (already correct on n-stage-impl).** The handler `function onSceneSwitchRequest(): void { if (isHome.value) return; sceneStageRef.value?.open(currentSceneId.value); }` is the correct Stage-open action. No change needed.

**AT fallback invariant.** `Tab` + `Space`/`Enter` on the scene Select trigger must still open the reka dropdown (the Stage is pointer-primary; keyboard users get the full accessible Select). Verify: synthesize a `keydown Space` on the trigger without a preceding `pointerdown` — the reka Select opens; the Stage does NOT.

**Constraint.** The `@pointerdown`-intercept approach is the ONLY correct semantic here. A `@click` handler is wrong because it fires AFTER the reka Select opens and the user has already interacted. An `@update:model-value` wrapper is wrong for the same reason. The `pointerdown`-wins pattern is already established in this codebase (BLK-8 / D9 discipline; `@mbabb` menu trigger; `TransportDock.vue`'s `onPlayPointerDown` pattern).

---

### S4 — `proof:stage-supersedes-dropdown` gate authored (born-RED, N.WZ §S2)

**Breach.** No gate asserts the Stage is the active production path for the dock scene-select. The integration could be reverted (the reka Select re-takes over) with no CI signal.

**Cure.** Author `scripts/proof-stage-supersedes-dropdown.mjs` (mirroring N.WZ §S2 exactly):

```
C1 — Stage opens on dock trigger pointerdown (not click)
     Load the SPA; fire pointerdown on the DockSelectTrigger (scene Select trigger).
     Assert: [data-component="SceneStage"] or the stage-void element is present in DOM.
C2 — reka Select dropdown NOT opened simultaneously
     Assert: the reka Select content ([data-radix-select-content] or equivalent) is absent.
C3 — dock-hold mutex active while Stage is open
     Assert: the dock stays in expanded state (the Stage isOpen flag pins the dock-hold).
C4 — commit routes to runSceneSwitch (VT fires or useSceneSwap fallback)
     Step the carousel to a new scene; commit. Assert the scene host updates (new scene mounts).
C5 — new scene mounts + reaches idle state
     Assert data-scene-state === 'idle' after the VT settles.
C6 — state preserved (no KeepAlive)
     Assert no KeepAlive ancestor on the scene host. sceneMachine context is preserved.
C7 — keyboard AT fallback intact
     Tab to the scene Select trigger; dispatch keydown Space. Assert reka Select opens. Assert
     the Stage is NOT opened (no [data-component="SceneStage"] in DOM after keyboard-only path).
```

Wire into `package.json` under `proof:stage-supersedes-dropdown`; add to `proof:correctness` (AXIS-1 browser gate — this is a production-path integration assertion).

**Born-RED today by construction:** `SceneStage` is not mounted in `demo/app/App.vue` on master (`grep -rn "SceneStage" demo/app/App.vue` → 0 hits on master). C1 is immediately RED — the gate fires a `pointerdown` on the dock Select trigger and the Stage overlay is absent.

---

### S5 — Update `proof:design-paint` with the Stage visual clause (conditional on S2/S3/S4 GREEN)

Once the Stage is integrated and `proof:n-stage-boundary` is GREEN (the Stage graph is HEAVY-import-free), `proof:design-paint` gains the Stage-specific S5 clause from O.W13 §S5:

- **Stage open**: the `.stage-void` scrim is painted — sampled pixel at the center of the stage background is in the dark gamut (`hsl(0 0% ≤ 8%)`).
- **Front card lit**: `--stage-light` computed value > 0.8 on the front card's ancestor (the spotlight cone illuminates it).
- **Ring item visible**: ≥5 ring items have `opacity > 0` and non-zero `transform` matrix.

This S5 clause activates ONLY after the Stage is unshelfed. If O.W15 does not close before O.WZ, S5 is deferred to a future unshelf wave with a named terminal home (DO-24 row in the O close ledger).

---

## Born-RED gate

**Primary gate: `proof:n-stage-boundary`** (NEW — `scripts/proof-n-stage-boundary.mjs`; does NOT exist today on master or on `n-stage-impl`)
**Secondary gate: `proof:stage-supersedes-dropdown`** (NEW — `scripts/proof-stage-supersedes-dropdown.mjs`; does NOT exist today)

**The REAL observable (inv-M-observable-truth — NOT a proxy):**

| Gate / clause | Witness today (master) | Failure mode today | Expected after O.W15 |
|---|---|---|---|
| `proof:n-stage-boundary` esbuild metafile | `SceneStage.vue` absent on master | exit 1 (entry not found) — the REAL observable: the Stage graph cannot be walked because the Stage does not exist on master; this is NOT a grep proxy | exit 0 — esbuild walks the STATIC module graph of SceneStage.vue and finds zero heavy-engine or value.js static input edges; the LIGHT boundary holds |
| `proof:n-stage-boundary` planted-violation arm | (cannot plant — stage absent) | After S1: add `import { loadAnimationEngine }` to any stage composable → exit 1 naming the file (esbuild finds `engine.ts` as a static input) | exit 0 after removing the planted import |
| `proof:stage-supersedes-dropdown` C1 | `grep "SceneStage" demo/app/App.vue` → 0 hits on master; Stage absent | C1 RED — `pointerdown` fires on dock trigger; no Stage overlay in DOM | C1 GREEN — Stage overlay present in DOM on `pointerdown` |
| `proof:stage-supersedes-dropdown` C7 (AT fallback) | n/a (Stage absent) | After S3: if `@pointerdown` mistakenly fires on keyboard path → C7 RED (Stage opens on Tab+Space) | C7 GREEN — keyboard path opens reka Select dropdown only; Stage NOT opened |

**Born-RED today (by construction — the script does not exist + the Stage is not on master).**
`node scripts/proof-n-stage-boundary.mjs` → exit 1 (file not found: `SceneStage.vue`). This is the genuine born-RED state: the boundary oracle is absent AND the component it would gate is absent from master. Adding the gate script in S2 immediately reveals the born-RED state; merging the Stage component tree (S1) exposes the real static graph to the gate.

**Green condition.**
1. O.W12 complete (BC re-pin, S1/S2 workaround deletes GREEN, O-master base set).
2. S1: rebase `n-stage-impl` onto O-master; S7 conflict resolved by KEEPING master's deletion; deps updated to constellation pins; `npm run check` exits 0.
3. S2: `scripts/proof-n-stage-boundary.mjs` authored (esbuild metafile walk); born-RED on absent entry (pre-S1) and on any planted heavy static import (post-S1); GREEN on the real stage tree with LIGHT-only imports.
4. S3: `ChromeDock.vue` `@pointerdown`-intercept authored; `@update:model-value` post-selection trigger removed; AT fallback intact (keyboard → reka Select, not Stage).
5. S4: `scripts/proof-stage-supersedes-dropdown.mjs` authored; C1–C7 GREEN.
6. `proof:n-stage-boundary` → GREEN (zero heavy static edges in `SceneStage.vue` import graph).
7. `proof:stage-supersedes-dropdown` → GREEN (all 7 clauses pass).
8. `proof:workaround-deletion` S7 → still GREEN (the S7 conflict resolved by keeping master's deletion, not reverting it).
9. `proof:boundary` (existing library gate) → still GREEN (the Stage merge does not touch `src/animation/`; the library boundary is unchanged).
10. `npm run proof:all` → GREEN.

---

## Dependencies

- **O.W12 (BC re-pin + S1/S2 workaround deletes GREEN) — BLOCKING.** The rebase base for n-stage-impl must be O-master after the BC re-pin commit. Rebasing onto a pre-BC-pin master is wrong: the stage tree would pin `~4.0.1` while the rest of the tree is at `~<BC>.x`. S1 is the unshelf prerequisite; it does not fire before O.W12 is done.
- **O.W13 (design-paint baseline lock) — S5 only.** The Stage visual clause (S5) integrates into `proof:design-paint`. The S5 clause is CONDITIONAL on O.W15 unshelf; O.W13's baseline lock must be re-run after the Stage is integrated (the Stage adds new paint surfaces to the demo). O.W15 adds a Stage row to the S4 baseline lock run.
- **glass-ui BC cut (USER-DOMAIN, `~<BC>.x`) — THE blocking GATED event.** Same trigger as O.W12. The BC dock morph substrate must be live before the Stage's dock-hold mechanism (the `itemsPopupOpen` mutex extension with `stageOpen`) is meaningful. Do NOT rebase n-stage-impl before BC cut.
- **`proof:n-stage-boundary` S2 (gate-first, NOW)** — the gate script (`proof-n-stage-boundary.mjs`) is kf-internal and can be authored NOW on master (born-RED on the absent component). This is the pre-BC gate-first obligation per the born-RED discipline: author the gate first, then the cure. The gate authoring does NOT wait for BC cut.
- **`proof:stage-supersedes-dropdown` S4 (post-S3)** — the gate cannot pass until S3's `@pointerdown`-intercept is wired. Author born-RED alongside or after S2; wire to `proof:correctness` only after the integration is complete.
- **N.W2.md** — the authoritative born-RED gate spec for `proof:n-stage-boundary`. O.W15's S2 implements N.W2's gate-first obligation. The N.W2 spec is NOT re-authored here — it is the upstream reference.
- **N.WZ.md** — the authoritative production-integration design (dock Select → Stage; `pointerdown`-intercept; dock-hold mutex; AT fallback). O.W15's S3/S4 implement N.WZ's S1/S2 scope. The N.WZ spec is NOT re-authored here — it is the upstream reference.
- **O.W14 (lighthouse posture flip)** — no dependency ordering with O.W15. Both fire on the BC cut; they can land in either order.
- **O.WZ (close + 5.0.0 cut)** — O.W15 must be GREEN before O.WZ. The Stage unshelf is a Band-F BC-consume item; the close requires all Band-F gates GREEN.
- **Scene-select affordance ownership clarification (AUDIT-DIGEST A3).** The DM-24 ledger and KF-TO-GLASSUI-BC.md ASK-3 referenced `W-DOCK-MORPH-FAMILY` as the trigger — a stale BB wave name. The correct trigger is: glass-ui BC cut published (BC.W-DOCK-ENGINE + Band-2 fleet DONE). The scene-select affordance is kf-owned (kf's `ChromeDock.vue` composition), NOT a BC API surface. No BC wave authors a scene-select slot. O.W15 corrects the DM-24 tripwire wording on impl.

---

## dev→impl boundary

**S2 (gate authoring, `proof:n-stage-boundary`)** is kf-internal and may be authored NOW on master — born-RED on the absent `SceneStage.vue` entry. This is the pre-BC gate-first action.

**S1, S3, S4, S5** open ONLY when the glass-ui BC cut is published at the USER-DOMAIN-announced version AND O.W12 is committed. The rebase (S1) must be the first impl action after O.W12 GREENs; S2/S3/S4 follow in that order (gate before cure).

The impl sequence:
1. NOW (pre-BC): author `scripts/proof-n-stage-boundary.mjs` (S2 gate script only) — exit 1 by construction (entry absent).
2. BC cut fires + O.W12 complete: rebase `n-stage-impl` (S1), verify `npm run check` exits 0, verify `proof:workaround-deletion` S7 still GREEN.
3. S3: `ChromeDock.vue` `@pointerdown`-intercept — gate S2 first (will bite planted violations), then cure.
4. S4: `scripts/proof-stage-supersedes-dropdown.mjs` authored and wired; run C1–C7.
5. S5: `proof:design-paint` Stage clause added; baseline lock re-run.
6. `npm run proof:all` → GREEN.
