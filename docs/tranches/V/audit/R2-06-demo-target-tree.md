# R2-06 — THE DEMO TARGET TREE (final adjudication blueprint)

**Lane:** R2-06 (adjudicator) · **Prefix:** `DT-` · **Date:** 2026-07-17
**Subject:** `/Users/mkbabb/Programming/keyframes.js/demo` (196 source files: `.vue`/`.ts`/`.css`) @ HEAD `a59d3a22` + in-flight transaction
**Idiom authority (READ-ONLY):** `glass-ui/docs/tranches/BI/STRUCTURE-ADDENDA.md` §1
**Inputs:** R1-05 (DC-01..07), R1-07 (DD-4, DC-02 shims), R1-11 (PR-1, PR-5), AUDIT-REGISTRY FAM-06, ORIGINAL-PROMPT V-29..31.

## Verdict

This is the DECIDED terminal shape for `demo/`, total-coverage, wave-spec-ready. Round 1
surveyed; this lane adjudicates. Six rulings carry the load:

1. **DT-01 — the casing grammar is settled: all directories are `kebab-case`, `.vue`
   files keep `PascalCase`.** This is the glass idiom verbatim (`button/`, `metric-badge/`,
   `sortable-list/`) and the demo's own scenes-tier exemplar (`matrix-editor/`,
   `orbital-drag/`). The four Pascal-case component dirs the half-migration created
   (`AnimationControlsGroup/`, `ControlsPaneWrapper/`, `KfPillTabs/`, `TransportDock/`) are
   the anomaly, not the target. Every dir-move below applies this grammar.
2. **DT-02 — `app/dock/` extirpates to `demo/components/chrome/`** (PR-1 false-close cured),
   `app/` reduced to shell wiring. One consumer to repoint (`App.vue:141`).
3. **DT-03 — the transport split-brain collapses**: each `.vue`/`.css` moves INTO its
   same-named kebab component dir; `controls-pane/` merges into `controls-pane-wrapper/`.
4. **DT-04/05/06 — the `{components,composables,utils}` kind-dirs dissolve** across
   `transport/`, `keyframes/`, `timeline/`, `channel-controls/`, colocating each member with
   its owner; two dead/aliasing shims retire; **three mis-homed transport composables
   re-home by true consumer census (a DELTA that corrects R1-05).**
5. **DT-07 — `ChannelOptions.vue` (609L) carves by TEMPLATE extraction** (the 402L template
   is the bloat, not the 143L script), one `EasingField.vue` sub-component clears the U-500
   ceiling; a second extraction clears a 400 ceiling if formation picks it.
6. **DT-09 — the two single-file dirs flatten/fold.**

**Two corrections to R1-05 this lane owns with fresh evidence:**
- **DC-02 "zero consumers" is WRONG.** The "dead" shim
  `transport/composables/useAnimationGroupPlayback.ts` has a live TEST consumer
  (`test/demo/state/no-shadow-playback-authority.test.ts:21`) — R1-05 grepped `demo/` only.
  Retirement stands but carries a lockstep test-repoint (DT-04).
- **DC-02's "keep the 4 genuine composables as transport shared" is WRONG.** Consumer census
  proves only 1 of 4 (`useScrollFade`) is transport-shared; `useRafLoop`+`useDemoTicker` are
  demo-global raf primitives (3-module span) and `useDragCapture` is playback-local (DT-04).

**HARD FENCE (c):** every move below sequences strictly AFTER the K6 65-path consumer slice
lands (R1-03) — the in-flight transaction MODIFIES 7 transport files + both dock files, so
any move now clobbers it. `scenes/` is the exemplar and is KEPT untouched. No glass-ui
behavior patches. Total findings: 11 (`DT-01..DT-11`).

---

## (a) THE COMPLETE MOVE / MERGE / SPLIT / RENAME TABLE

Total-coverage rule: every one of the 196 source files is in a disposition row below OR in
the KEEP summary (§KEEP). `→` = final path. Component `.vue` filenames unchanged (Pascal);
only their containing DIR is kebab.

### DT-02 — `app/dock/` extirpation → `demo/components/chrome/` (P1, family: green-over-broken)

OD-U19 ordered `app/dock/` "straight up extirpated … app/ keeps only the shell, never
components." Tree still carries it (`git ls-files demo/app/dock/` = 3 files). Sole consumer:
`App.vue:141` `import { ChromeDock, MbabbMenu } from "@app/dock"`. `controlSurfaces.ts` refs
are prose comments only (no import).

`chrome/` is the correct home (not `instrument/`): ChromeDock is app-chrome that WRAPS the
instrument (`App.vue:2-24`), not an instrument member. It mirrors the established composable-
less-siblings grouping idiom of `demo/components/playback/` (two flat `.vue`, no per-component
subdirs) — so it stays FLAT, no single-file-dir wrap.

| From | → To |
|---|---|
| `demo/app/dock/ChromeDock.vue` | `demo/components/chrome/ChromeDock.vue` |
| `demo/app/dock/MbabbMenu.vue` | `demo/components/chrome/MbabbMenu.vue` |
| `demo/app/dock/index.ts` | `demo/components/chrome/index.ts` |
| — repoint | `App.vue:141` → `from "@components/chrome"` |

Gate (born-RED): `git ls-files demo/app | grep -E '\.vue$'` returns zero. `app/` retains
`App.vue`, `App.skeleton.vue`, `main.ts`, `index.html`, `public/`, `lifecycle/`, `scene/`,
`transition/` — all router/machine/lifecycle shell wiring. ✔ OD-U19.

### DT-03 — transport split-brain: `.vue`/`.css` INTO kebab component dirs; `controls-pane/` merges (P1, family: half-migrated-colocation)

Each transport component's `.vue`(+`.css`) moves into its (kebab-renamed) same-named dir;
`controls-pane/` (kebab, holds the `.vue`+`.css`+RibbonBar) merges into the composables' dir,
renamed kebab. RibbonBar (consumer: `ControlsPaneWrapper.vue` only) + DemoGlobalChrome
(consumer: `AnimationControlsGroup.vue` only, currently in `transport/components/`) colocate in.

| From | → To |
|---|---|
| `transport/AnimationControlsGroup.vue` | `transport/animation-controls-group/AnimationControlsGroup.vue` |
| `transport/AnimationControlsGroup.css` | `transport/animation-controls-group/AnimationControlsGroup.css` |
| `transport/AnimationControlsGroup/useAnimationGroupActions.ts` | `transport/animation-controls-group/useAnimationGroupActions.ts` |
| `transport/AnimationControlsGroup/useAnimationGroupPlayback.ts` | `transport/animation-controls-group/useAnimationGroupPlayback.ts` |
| `transport/AnimationControlsGroup/useAnimationProgress.ts` | `transport/animation-controls-group/useAnimationProgress.ts` |
| `transport/AnimationControlsGroup/useControlsKeyboardShortcuts.ts` | `transport/animation-controls-group/useControlsKeyboardShortcuts.ts` |
| `transport/components/DemoGlobalChrome.vue` | `transport/animation-controls-group/DemoGlobalChrome.vue` (repoint `AnimationControlsGroup.vue:129`) |
| `transport/controls-pane/ControlsPaneWrapper.vue` | `transport/controls-pane-wrapper/ControlsPaneWrapper.vue` |
| `transport/controls-pane/ControlsPaneWrapper.css` | `transport/controls-pane-wrapper/ControlsPaneWrapper.css` |
| `transport/controls-pane/RibbonBar.vue` | `transport/controls-pane-wrapper/RibbonBar.vue` |
| `transport/ControlsPaneWrapper/useControlsLayout.ts` | `transport/controls-pane-wrapper/useControlsLayout.ts` |
| `transport/ControlsPaneWrapper/usePaneHover.ts` | `transport/controls-pane-wrapper/usePaneHover.ts` |
| `transport/ControlsPaneWrapper/usePaneRegister.ts` | `transport/controls-pane-wrapper/usePaneRegister.ts` |
| `transport/KfPillTabs.vue` | `transport/kf-pill-tabs/KfPillTabs.vue` |
| `transport/KfPillTabs/useKfPillTabs.ts` | `transport/kf-pill-tabs/useKfPillTabs.ts` |
| `transport/TransportDock.vue` | `transport/transport-dock/TransportDock.vue` |
| `transport/TransportDock/useIconSpin.ts` | `transport/transport-dock/useIconSpin.ts` |
| `transport/TransportDock/useMenubarMeasure.ts` | `transport/transport-dock/useMenubarMeasure.ts` |
| `transport/TransportDock/usePlayActuation.ts` | `transport/transport-dock/usePlayActuation.ts` |

Delete emptied dirs: `transport/components/`, `transport/controls-pane/`. Repoint the
`controls-pane/ControlsPaneWrapper.vue:172-173` up-and-over imports (`../ControlsPaneWrapper/…`)
to same-dir `./useControlsLayout`, `./usePaneRegister`, `./usePaneHover`. Repoint
`transport/index.ts` lazy re-exports (`./AnimationControlsGroup.vue` →
`./animation-controls-group/AnimationControlsGroup.vue`, `./TransportDock.vue`,
`./KfPillTabs.vue` likewise).

### DT-04 — transport `composables/` kind-dir dissolves; shared members re-home by census; shims retire (P1/P2, family: kind-dir-over-colocation + masked-fallback)

After the DC-02 shims retire, the 4 genuine members re-home by TRUE consumer census (verified
this lane — a DELTA correcting R1-05's "keep all 4 as transport shared"):

| Member | Consumers (verified) | Verdict → To |
|---|---|---|
| `useScrollFade.ts` (129L) | `controls-pane-wrapper/useControlsLayout`, `channel-controls/ChannelControls.vue`, `channel-controls/…/useTabStripScroll` — all transport | **transport `_shared/`** (the one genuine transport-cross-component composable) → `transport/_shared/useScrollFade.ts` |
| `useRafLoop.ts` (19L) | `scenes/square/useSquareDemo`, `transport/…/useAnimationProgress`, `playback/AnimationVisualizer.vue` — **3 top-level modules** | **demo-global** → `demo/composables/useRafLoop.ts` |
| `useDemoTicker.ts` (50L) | `useRafLoop` (→ now global) + `channel-controls/…/useAnimationSync` | **demo-global** (raf primitive; dependency of the global `useRafLoop`; moving it keeps layering global→module correct) → `demo/composables/useDemoTicker.ts` |
| `useDragCapture.ts` (70L) | `playback/PlaybackRibbon.vue`, `playback/AnimationVisualizer.vue` — **both playback, zero transport** | **colocate to playback** → `demo/components/playback/useDragCapture.ts` |

Shim retirements:
| `transport/composables/useAnimationGroupPlayback.ts` | 1-line re-export. **NOT dead** — consumed by `test/demo/state/no-shadow-playback-authority.test.ts:21` (R1-05 missed test/). **DELETE + repoint that test** to `@components/instrument/transport/animation-controls-group/useAnimationGroupPlayback`. |
| `transport/composables/useKfPillTabs.ts` | aliasing type re-export. **DELETE + repoint** `channel-controls/ChannelControls.vue:230` `import type { KfPillTabOption }` → `../kf-pill-tabs/useKfPillTabs`. |

Delete emptied dir `transport/composables/`. `transport/_shared/` (holding `useScrollFade.ts`)
is a legitimate module substrate — NOT a DC-05 single-file-dir violation (a `_shared/`
substrate is the designated module-shared grouping in the glass idiom, judged by role not
count; contrast the *accidental* encapsulation-of-one in DT-09).

### DT-05 — `keyframes/` + `timeline/` kind-dirs dissolve FLAT into the module (P1, family: kind-dir-over-colocation)

Both are genuine multi-component modules whose internal composables are mutually entangled
(no clean per-component partition). KISS ruling: dissolve `{components,composables,utils}` FLAT
into the module dir; do NOT sub-carve `KeyframesEditor/` (rejected — see §KISS). Composables
colocate flat beside the `.vue` they serve, exactly as glass atoms hold `coalesceMetric.ts`
flat beside `metric-badge.vue`.

| From (all under `demo/components/instrument/`) | → To |
|---|---|
| `keyframes/components/KeyframeCardList.vue` | `keyframes/KeyframeCardList.vue` |
| `keyframes/components/KeyframesAddDialog.vue` | `keyframes/KeyframesAddDialog.vue` |
| `keyframes/composables/{useApplyCSS,useHighlightCSS,useKeyframeBrushApply,useKeyframeOps,useKeyframesEditor,useKeyframesParsing,useKeyframesState,useToolbarKeyboard}.ts` (8) | `keyframes/{same}.ts` |
| `keyframes/utils/contenteditable.ts` | `keyframes/contenteditable.ts` |
| `keyframes/utils/parseAnimationCSS.ts` | `keyframes/parseAnimationCSS.ts` |
| `timeline/components/TimelineHoverPreview.vue` | `timeline/TimelineHoverPreview.vue` |
| `timeline/components/TimelineTrack.vue` | `timeline/TimelineTrack.vue` |
| `timeline/composables/{useTimeline,useTimelineBuild,useTimelineOps,useZoomPan}.ts` (4) | `timeline/{same}.ts` |
| `timeline/utils/{flattenVars,snapshotCapture,timelineEngine}.ts` (3) | `timeline/{same}.ts` |

Delete emptied `keyframes/{components,composables,utils}/`, `timeline/{components,composables,utils}/`.
Repoint intra-module relative imports (all `./composables/x`→`./x`, `./utils/x`→`./x`,
`./components/X.vue`→`./X.vue`) + the `@components/instrument/keyframes/composables/…` alias
imports in `test/demo/instrument/kf-toolbar-keyboard.test.ts:24` and
`test/demo/instrument/timeline-undo.test.ts:4`. `monaco-themes/{Dracula,GitHub}.json` stays
colocated under `keyframes/` (KEEP).

### DT-06 — `channel-controls/composables/` colocates; `ChannelOptions` becomes an encapsulated sub-module (P1, family: kind-dir-over-colocation)

Census (R1-05, re-confirmed): the 6 composables are cleanly single-owner —
`useAnimationSync`/`usePlaybackToggle`/`useTimingFunctionEditor` → `ChannelOptions.vue`;
`useKeyframesPaneReveal`/`useSelectedControlSurface`/`useTabStripScroll` → `ChannelControls.vue`.
`LayerConfigPanel.vue`+`TimingFunctionPanel.vue` → `ChannelOptions.vue` only. ChannelOptions
thus owns 2 sub-components + 3 composables + (post-carve) `EasingField.vue` → it earns
encapsulation as a nested sub-module (justified exactly like glass `sortable-list/` folding
`sortable/` in). ChannelControls is the module top; its `.vue` + 3 composables sit flat.

Terminal `channel-controls/`:
```
channel-controls/
  ChannelControls.vue
  useKeyframesPaneReveal.ts   useSelectedControlSurface.ts   useTabStripScroll.ts
  channel-options/
    ChannelOptions.vue  LayerConfigPanel.vue  TimingFunctionPanel.vue  EasingField.vue(new)
    useAnimationSync.ts  usePlaybackToggle.ts  useTimingFunctionEditor.ts
  index.ts   (if present — none today; ChannelControls barrelled via transport/index.ts)
```
| From | → To |
|---|---|
| `channel-controls/composables/useKeyframesPaneReveal.ts` | `channel-controls/useKeyframesPaneReveal.ts` |
| `channel-controls/composables/useSelectedControlSurface.ts` | `channel-controls/useSelectedControlSurface.ts` |
| `channel-controls/composables/useTabStripScroll.ts` | `channel-controls/useTabStripScroll.ts` |
| `channel-controls/ChannelOptions.vue` | `channel-controls/channel-options/ChannelOptions.vue` |
| `channel-controls/LayerConfigPanel.vue` | `channel-controls/channel-options/LayerConfigPanel.vue` |
| `channel-controls/TimingFunctionPanel.vue` | `channel-controls/channel-options/TimingFunctionPanel.vue` |
| `channel-controls/composables/useAnimationSync.ts` | `channel-controls/channel-options/useAnimationSync.ts` |
| `channel-controls/composables/usePlaybackToggle.ts` | `channel-controls/channel-options/usePlaybackToggle.ts` |
| `channel-controls/composables/useTimingFunctionEditor.ts` | `channel-controls/channel-options/useTimingFunctionEditor.ts` |

Delete emptied `channel-controls/composables/`. Repoint `ChannelOptions.vue` imports
(`./composables/x`→`./x`; `./TimingFunctionPanel.vue`,`./LayerConfigPanel.vue`→`./`) and
`ChannelControls.vue` imports of its 3 composables (`./composables/x`→`./x`) + its
`./ChannelOptions.vue`→`./channel-options/ChannelOptions.vue`.

### DT-08 — `instrument/utils/` → `instrument/_shared/` (P3, family: shared-substrate-misplacement)

Both members are genuinely cross-sub-module (`iosTextEntry` → shell + keyframes; `toastGuard`
→ keyframes + timeline), so they correctly do NOT colocate — but the glass idiom houses
ownerless cross-cutting helpers in `_shared/`, not a `utils/` kind-dir.

| `instrument/utils/iosTextEntry.ts` | `instrument/_shared/iosTextEntry.ts` |
| `instrument/utils/toastGuard.ts` | `instrument/_shared/toastGuard.ts` |

Repoint `EditorShell.vue`, `CSSCodeEditor.vue` (iosTextEntry); `KeyframesAddDialog.vue`,
`CSSPasteDialog.vue` (toastGuard); and `test/demo/instrument/ios-text-entry.test.ts:5`
(`…/instrument/utils/iosTextEntry` → `…/instrument/_shared/iosTextEntry`). Also demote
`iosTextEntry.ts`'s `isIOSLikePlatform` export (DD-4, same-file-only) while touching the file.

### DT-09 — single-file dirs flatten/fold (P2, family: single-file-dir)

| `demo/composables/scene-facility/index.ts` (127L, 8 consumers) | **flatten** → `demo/composables/scene-facility.ts`. `@composables/scene-facility` keeps resolving (Vite resolves both dir-barrel and file); no consumer edit. Test `test/demo/scenes/scene-facility.test.ts:21` imports the dir path `…/demo/composables/scene-facility` → still resolves to the `.ts`. ✔ |
| `transport/components/DemoGlobalChrome.vue` | **folded** into `animation-controls-group/` (DT-03) — self-resolves. |

### KEEP — everything else (total-coverage closure)

Verified colocation-compliant or correctly-global; NO row demands action (fence: `scenes/` is
the exemplar, kept whole):

- **`demo/scenes/**` (74 files)** — THE exemplar. Every scene module colocates `.vue` +
  `use<Scene>Demo.ts` + `<scene>Keys.ts` + `*.css` + assets; nested widgets
  (`cube/matrix-editor/`, `cube/orbital-drag/` incl. its legit `composables/`) properly
  encapsulated; all dirs already kebab. **UNTOUCHED.**
- **`demo/app/**` minus `dock/`** — `App.vue`, `App.skeleton.vue`, `main.ts`, `index.html`,
  `public/`, `lifecycle/{2}`, `scene/{5}`, `transition/{2}` — shell wiring, correctly zoned.
- **`demo/components/instrument/shell/**` (10 files)** — flat module, `useShareState.ts`
  colocated flat, no kind-dirs. Compliant.
- **`demo/components/instrument/{index.ts, surfaceTabs.ts}`** — module barrel + shared const.
- **`demo/components/playback/{AnimationVisualizer,PlaybackRibbon}.vue`** — flat sibling
  grouping (gains `useDragCapture.ts` per DT-04).
- **`demo/components/CopyButton.vue`** — see DT-10 (KEEP loose).
- **`demo/composables/**`** minus scene-facility flatten — `useDoubleTap`, `useDragScrub`,
  `useThrottledReadout`, `scene-runtime/{4}` — genuinely multi-owner global. Gains
  `useRafLoop.ts`+`useDemoTicker.ts` (DT-04).
- **`demo/utils/**` (8 files incl. `reference-data/{3}`)** — cross-sub-module global
  (`clipboard`,`formatEditorCSS`,`keyframeSelector`,`gestureSelectSuppression`,`rafConstants`).
- **`demo/state/**` (9 files)** — Pinia global grouping, coherent.
- **`demo/styles/**` (6 css)** — global sheets, `@import`-chained. `demo/kf-engine.ts`,
  `demo/env.d.ts`, `demo/DESIGN.md` — root module files.

---

## (b) The `ChannelOptions.vue` 609L carve + scene composable ruling

### DT-07 — carve by TEMPLATE extraction (P2, family: godmodule/>500L)

Measured (this lane): template **1-403 (402L)**, script **405-548 (143L)**, style ~59L. The
script ALREADY delegates to 3 composables + 2 panels — it is not the bloat. The 402L TEMPLATE
is. The template is a `panel-stack` of discrete rows: main-controls panel (label rows +
**easing field 140-279, ~140L**), timing-detail panel (→ `TimingFunctionPanel`), advanced
sub-pane (→ `LayerConfigPanel`), teleported playback row.

**Ruling:** extract the self-contained easing field (the `easing-edit-btn` seam + dropdown,
lines ~140-279) into a sibling **`EasingField.vue`** inside `channel-options/` (DT-06),
matching the existing per-panel sub-component grammar (LayerConfigPanel/TimingFunctionPanel).
This drops `ChannelOptions.vue` to ~470L — **under the U-500 ceiling**. If formation adopts a
400 ceiling (owner "no godmodules"/Aristotelian edict), extract a SECOND partial — the uniform
duration/timing **label rows (17-139, ~122L)** into `ChannelLabelRows.vue` — landing
ChannelOptions at ~350L. Recommend the **400-ceiling / two-extraction** target for
proportionality; either is grammar-matching and needs no new composables (the 3 already exist).

Gate: no `demo/**/*.vue` over the ruled ceiling. Fold into the DT-06 sub-module wave (same dir).

### DT-11 — scene `use*Demo.ts` composables: NO ACTION (P3, family: long-file)

`useSpringDemo.ts` (499L) and `useSequenceDemo.ts` (482L) are the two 480-499L scene
god-composables. Under EITHER candidate ceiling they matter only at a 400 bound — but they
live in `scenes/`, the exemplar the fence keeps untouched, and they are internally coherent
per-scene orchestrators. **Ruling: census-only, no wave.** Splitting them would fragment a
coherent scene orchestrator against the owner's anti-fragmentation edict and violate the
`scenes/`-untouched fence. Explicitly retired as a non-defect. (If a future ceiling is set AND
applied to scenes, they re-book under that named ceiling — not here.)

---

## (c) FENCES (binding constraints on every wave above)

1. **ORDERING (hard):** ALL DT moves sequence AFTER the K6 65-path consumer slice lands
   (R1-03). The in-flight transaction currently MODIFIES `channel-controls/{ChannelControls,
   ChannelOptions}.vue`, `controls-pane/RibbonBar.vue`, and BOTH `app/dock/*.vue` (`git
   status`) — moving any of these now clobbers the transaction. Precondition on every DT wave:
   `git status --porcelain demo/` clean at rest (QUIESCE-TREE).
2. **NO glass-ui behavior patches.** DT rows are demo-internal file topology only; the Glass-7
   consume rail (FAM-01) is a separate producer-gated wave. Stale Glass provenance comments
   (DD-5) are R2-08's doc lane, not a colocation move.
3. **`scenes/` is the exemplar — UNTOUCHED.** No DT row moves a `scenes/**` file. DT-11
   explicitly declines the two 480-499L scene composables on this fence.
4. **`.vue` filenames never change** (Pascal) — only their containing DIR is kebab. No
   component rename (out of scope; API/behavior).

---

## (d) SEQUENCING — dependency-ordered batches

Each batch is atomic (move + all import repoints + test-lockstep in ONE commit) so no batch
lands red. `mirror.test.ts` (FAM-12/TC-4) is **LIBRARY-only** (it maps `test/` areas to
`src/animation` zones and explicitly excludes `demo`) — verified `test/support/mirror.test.ts:8`
`infrastructureDirs` includes `"demo"`; **demo restructure is NOT gated by it** (negative). The
vitest **demo project glob** (`vitest.config.ts:60` `include:["test/demo/**/*.test.ts"]`) is a
path-glob on the TEST tree, unaffected by demo-SOURCE moves; but the demo TEST *import
specifiers* that name moved source paths MUST move in the same commit (listed per batch).

**Dir aliases move in lockstep, but stay STABLE across these moves** (all four affected
aliases are DIR aliases resolving subpaths): `@app`→demo/app, `@components`→demo/components,
`@composables`→demo/composables, `@utils`→demo/utils (vite.config.ts:47-58, mirrored
vitest.config.ts:23-30). No alias VALUE changes — only the subpath after the alias changes in
consumer imports. **No `vite.config.ts`/`vitest.config.ts` edit is required by any DT batch**
(confirmed: no alias points inside a moved dir).

| Batch | Waves | Moves | Test/import lockstep |
|---|---|---|---|
| **B1** (independent, any order) | DT-02, DT-08, DT-09 | dock→chrome; instrument/utils→_shared; scene-facility flatten; DemoGlobalChrome fold rides DT-03 | `App.vue:141`; `ios-text-entry.test.ts:5`; (scene-facility test resolves unchanged) |
| **B2** (after B1; the transport core) | DT-03 then DT-04 | all transport `.vue`/`.css`→kebab dirs; controls-pane merge; composables kind-dir dissolve + re-home; 2 shims retire | `transport/index.ts` re-exports; `ControlsPaneWrapper.vue:172-173`; `ChannelControls.vue:230`; `no-shadow-playback-authority.test.ts:21`→animation-controls-group |
| **B3** (parallel to B2; independent modules) | DT-05, DT-06+DT-07 | keyframes/ + timeline/ kind-dirs flat-dissolve; channel-controls colocate + channel-options sub-module + EasingField carve | `kf-toolbar-keyboard.test.ts:24`; `timeline-undo.test.ts:4`; intra-module relative imports |

DT-04's `useDragCapture`→playback and `useRafLoop`+`useDemoTicker`→demo/composables land
within B2 (they leave transport). DT-10/DT-11 are KEEP/no-action — no batch. B2 and B3 touch
disjoint dirs (transport vs keyframes/timeline/channel-controls) and can run concurrently
provided B1 landed; `channel-controls` is under `transport/` so if a single worktree is used,
run B2 then B3 to avoid the shared parent `transport/index.ts` (which only names
AnimationControlsGroup/TransportDock/KfPillTabs — NOT channel-controls, so they are in fact
independent; concurrency is safe).

---

## KISS — rejected R1-05 proposals (with rationale)

- **REJECT "carve one encapsulated sub-module per top component" for `keyframes/`/`timeline/`
  (R1-05 DC-03 option b).** Their internal composables are mutually entangled (8 keyframes
  composables cross-reference; no clean per-component partition), so sub-carving `KeyframesEditor/`
  would either duplicate shared composables or re-create a `composables/` grab-bag one level
  down — fragmentation the owner's edict forbids. FLAT dissolution is fewer moves and
  idiomatic (glass atoms hold composables flat). ChannelOptions IS sub-moduled (DT-06) because
  its ownership is CLEAN (2 panels + 3 composables single-owner) — the distinction is
  consumer-census clarity, not file count.
- **REJECT giving `CopyButton.vue` a `copy-button/` dir (DC-07) — DT-10, KEEP loose (P3).** A
  single composable-less shared atom wrapped in a dir-of-one is the exact DC-05 anti-pattern
  it would purport to fix; a loose global atom at `demo/components/` root is strictly simpler.
  KEEP as-is.
- **REJECT R1-05's "_shared/ OR leave as transport shared grouping" ambiguity for the 4
  composables** — decided precisely by census (DT-04): 1 transport-shared, 2 demo-global, 1
  playback-local. No ambiguity survives.

## Negatives (checked, found SOUND)

- `mirror.test.ts` does NOT gate demo topology (`test/support/mirror.test.ts:8` excludes
  `demo`); demo restructure is unblocked by the FAM-12 topology gate.
- No `vite.config.ts`/`vitest.config.ts` alias edit is required by any DT batch (all four
  affected aliases are stable dir-aliases; only consumer subpaths change).
- `scenes/` colocation is exemplary and needs zero moves (re-confirmed against the file list).
- `shell/` module is already colocation-compliant (flat, composable colocated, no kind-dir).
- `demo/composables/`, `demo/utils/`, `demo/state/`, `demo/styles/` membership is honest
  global surface (multi-owner censuses hold) — NOT colocation defects.

## Coverage gaps

- I did not run `vue-tsc`/`npm run check` in the audit copy to enumerate EVERY relative-import
  repoint site (the fence forbids mutating the real tree, and the moves themselves aren't
  landed). Each batch's repoint list above is grep-derived and load-bearing but the executing
  wave must run `npm run check` post-move to catch any indirect barrel consumer I treated as
  direct. The DC-02 test-consumer miss (found this lane by grepping `test/` not just `demo/`)
  is the cautionary precedent — the executing agent must grep `test/ bench/` too, not `demo/`
  alone.
- The exact line count of `ChannelOptions.vue` after ONE vs TWO extractions is estimated from
  section boundaries (140L easing field, 122L label rows), not from a performed extraction;
  the carve wave verifies against the chosen ceiling.
- Whether the in-flight transaction itself intends to fix any of the split-brain is unknown
  (its modified files add/move no dirs → it appears NOT to); DT waves assume the transaction
  lands the 65-path slice unchanged and the topology defects remain for V to own.
