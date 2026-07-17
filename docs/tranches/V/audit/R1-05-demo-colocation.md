# R1-05 — DEMO COLOCATION + COMPONENT-STRUCTURE CENSUS

Lane prefix: `DC-`. Target: `/Users/mkbabb/Programming/keyframes.js/demo` (206 files). Date 2026-07-16.
Idiom reference (READ-ONLY): `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/STRUCTURE-ADDENDA.md`.

## Verdict

The `demo/` tree is **partially** compliant with the Grand Colocation Edict but carries one
structurally serious defect and a cluster of kind-dir residue. The **scenes tier is the exemplar** —
per-scene modules (`amiga/`, `cube/`, `easing/`, `sequence/`, `spring/`, `square/`) colocate their
`.vue` + `use*Demo.ts` + `*Keys.ts` + `*.css` + assets, and the two genuinely nested widgets
(`cube/matrix-editor/`, `cube/orbital-drag/` with its own `composables/`) are correctly encapsulated
sub-modules. `demo/composables/` and `demo/utils/` membership is mostly HONEST — the members I
consumer-censused are genuinely multi-owner/global, so they legitimately survive as shared groupings.

The failure is concentrated in `demo/components/instrument/transport/`, which is a **half-migrated
colocation transaction frozen in the committed tree** (not the in-flight working-set transaction — the
split dirs are tracked, only 7 files under transport are `M`). It simultaneously carries (a) new
component-named composable dirs, (b) the old `.vue` files stranded OUTSIDE those dirs, (c) a
Pascal-vs-kebab dir-name schism for the same component, (d) the OLD `composables/` kind-dir still
present with two dead/aliasing re-export shims, and (e) a `components/` kind-dir holding one file. This
is the exact "alias smuggling / masked fallback / declared-move-not-on-disk" close-class pattern the
audit hunts, so it is filed P1 for the next tranche to own. The instrument sub-modules
(`keyframes/`, `timeline/`) and `channel-controls/` also retain `{components,composables,utils}`
kind-dirs that the edict says to dissolve — lower severity because they are internally consistent, but
they are the same anti-pattern at rest.

Total findings: 7 (1×P1 structural + 1×P1 pervasive-pattern, 3×P2, 2×P3).

---

## DC-01 — transport/ split-brain: components stranded outside their colocated composable dirs (P1)

**Family:** half-migrated-colocation / declared-move-not-completed

The colocation migration pulled each transport component's composables into a component-named dir but
left the `.vue` (and `.css`) at the module root — or, worse, in a *differently named* sibling dir.
Evidence (`find demo/components/instrument/transport -maxdepth 2`):

- `AnimationControlsGroup.vue` + `AnimationControlsGroup.css` are FILES at transport root; the dir
  `AnimationControlsGroup/` beside them holds only the 4 composables
  (`useAnimationGroupActions/Playback/Progress.ts`, `useControlsKeyboardShortcuts.ts`). Component is
  NOT inside its own dir.
- `KfPillTabs.vue` (root file) + `KfPillTabs/useKfPillTabs.ts` (dir). Same split.
- `TransportDock.vue` (root file) + `TransportDock/` (dir: `useIconSpin/useMenubarMeasure/usePlayActuation.ts`). Same split.
- **Worst:** `controls-pane/ControlsPaneWrapper.vue` + `controls-pane/ControlsPaneWrapper.css` live in
  a **kebab-case `controls-pane/`** dir, while the component's composables live in a **Pascal-case
  `ControlsPaneWrapper/`** dir at transport ROOT. The component reaches up-and-over to its own
  composables: `controls-pane/ControlsPaneWrapper.vue:172-173` imports
  `../ControlsPaneWrapper/usePaneRegister` and `../ControlsPaneWrapper/useControlsLayout`. Two dirs,
  one component, mismatched casing.
- Cross-placement smell: `AnimationControlsGroup.vue` imports `DemoGlobalChrome` which lives in the
  `components/` kind-dir (see DC-05), i.e. a sibling component fished out of a kind-dir.

The idiom (STRUCTURE-ADDENDA §1) makes a component dir hold its `.vue` + composables + sheet directly
(e.g. `metric-badge/{…, coalesceMetric.ts}`, `sortable-list/{…, sortable/ folded in}`). The correct
target is one dir per component containing everything:

```
transport/
  AnimationControlsGroup/  { AnimationControlsGroup.vue, AnimationControlsGroup.css,
                             useAnimationGroupActions.ts, useAnimationGroupPlayback.ts,
                             useAnimationProgress.ts, useControlsKeyboardShortcuts.ts, DemoGlobalChrome.vue }
  ControlsPaneWrapper/     { ControlsPaneWrapper.vue, ControlsPaneWrapper.css, RibbonBar.vue,
                             useControlsLayout.ts, usePaneHover.ts, usePaneRegister.ts }   # drop controls-pane/
  KfPillTabs/              { KfPillTabs.vue, useKfPillTabs.ts }
  TransportDock/           { TransportDock.vue, useIconSpin.ts, useMenubarMeasure.ts, usePlayActuation.ts }
  channel-controls/        { …colocated, see DC-03 }
  index.ts  injectionKeys.ts  transportSource.ts
```

**Disposition — BUILD (V wave, transport-colocate-complete):** move each `.vue`/`.css` into its
same-named component dir; delete the `controls-pane/` dir by folding into `ControlsPaneWrapper/`; repoint
the ≤3 sibling imports. Note the migration was already *started* here, so this is finishing a
transaction, not opening one. Sequence AFTER the in-flight working-set transaction lands (channel-controls
`.vue` files are currently `M`).

---

## DC-02 — dead + aliasing re-export shims in the old transport/composables/ kind-dir (P2)

**Family:** masked-fallback / alias-smuggling (committed dead code)

The pre-migration `transport/composables/` kind-dir survived the DC-01 move and now holds shim files
that re-export the relocated composables:

- `transport/composables/useAnimationGroupPlayback.ts` — a 1-line re-export
  `export { useAnimationGroupPlayback } from "../AnimationControlsGroup/useAnimationGroupPlayback";`.
  **Zero consumers.** `grep -rn "composables/useAnimationGroupPlayback" demo` returns nothing outside
  the shim itself → committed dead code.
- `transport/composables/useKfPillTabs.ts` — a re-export of
  `{ useKfPillTabs, type KfPillTabOption }` from `../KfPillTabs/useKfPillTabs`. The *real* consumer
  `KfPillTabs.vue:43-44` correctly imports the colocated file directly, but
  `channel-controls/ChannelControls.vue:230` still imports the TYPE through the stale shim path
  (`import type { KfPillTabOption } from "../composables/useKfPillTabs";`). This is a masked
  cross-module import routed through a kind-dir alias — exactly the smell that hides an incomplete move.

The remaining `composables/` members (`useDemoTicker`, `useDragCapture`, `useRafLoop`, `useScrollFade`)
are real multi-owner composables (`useRafLoop` → AnimationProgress + AnimationVisualizer; `useScrollFade`
→ ControlsPaneWrapper + channel-controls) and belong in a transport-level shared grouping, not deleted.

**Disposition — RETIRE the two shims (fold into DC-01 wave):** delete
`composables/useAnimationGroupPlayback.ts`; repoint `ChannelControls.vue:230` to
`../KfPillTabs/useKfPillTabs` and delete `composables/useKfPillTabs.ts`. Keep the 4 genuine composables
(rename the dir to `_shared/` per idiom, or leave as the transport shared grouping).

---

## DC-03 — pervasive `{components,composables,utils}` kind-dirs inside instrument sub-modules (P1)

**Family:** kind-dir-over-colocation (edict violation at rest)

The edict: sub-components/composables/utils colocate WITH their owner; only true module/global members
go to a shared dir; kind-name subdivisions dissolve. The instrument sub-modules keep them wholesale:

| Kind-dir | Members | Consumer census | Verdict |
|---|---|---|---|
| `keyframes/components/` | KeyframeCardList.vue, KeyframesAddDialog.vue | both single-owner → KeyframesEditor.vue (AddDialog also useToolbarKeyboard.ts) | DISSOLVE — colocate into keyframes module flat |
| `keyframes/composables/` | 8 use*.ts (useApplyCSS/useHighlightCSS/useKeyframeBrushApply/useKeyframeOps/useKeyframesEditor/useKeyframesParsing/useKeyframesState/useToolbarKeyboard) | keyframes-internal | DISSOLVE into module (or split KeyframesEditor sub-module) |
| `keyframes/utils/` | contenteditable.ts, parseAnimationCSS.ts | keyframes-internal | DISSOLVE |
| `timeline/components/` | TimelineHoverPreview.vue, TimelineTrack.vue | timeline-internal | DISSOLVE |
| `timeline/composables/` | useTimeline/useTimelineBuild/useTimelineOps/useZoomPan.ts | timeline-internal | DISSOLVE |
| `timeline/utils/` | flattenVars.ts, snapshotCapture.ts, timelineEngine.ts | timeline-internal (+ formatEditorCSS cross-use) | DISSOLVE |
| `transport/components/` | DemoGlobalChrome.vue (1 file) | AnimationControlsGroup.vue only | DISSOLVE (see DC-05) |
| `transport/composables/` | 6 (2 dead shims — DC-02) | mixed | RENAME `_shared/` + retire shims |
| `channel-controls/composables/` | 6 use*.ts | each single-owner: useAnimationSync/usePlaybackToggle/useTimingFunctionEditor→ChannelOptions.vue; useKeyframesPaneReveal/useSelectedControlSurface/useTabStripScroll→ChannelControls.vue | DISSOLVE — colocate into ChannelControls/ChannelOptions dirs |
| `instrument/utils/` | iosTextEntry.ts, toastGuard.ts | cross-module (see DC-06) | promote to `_shared/` substrate |

Consumer evidence captured via `grep -rl` per member (e.g. `KeyframeCardList` → only `KeyframesEditor.vue`;
`useAnimationSync` → only `ChannelOptions.vue`). The kind-dirs are the anti-pattern regardless of the
members being internally single-owner.

**Disposition — BUILD (V wave, instrument-colocate-dissolve), one sub-module at a time:** because
`channel-controls/composables/` members are cleanly single-owner they should fold into per-component
dirs (`ChannelControls/`, `ChannelOptions/`), mirroring DC-01. `keyframes/` and `timeline/` are true
multi-component modules — dissolve the kind-dirs into the module (flat) OR carve one encapsulated
sub-module per top component (`KeyframesEditor/`, `KeyframeTimeline/`). This is P1 (structural, next
tranche owns) but lower urgency than DC-01 because each kind-dir is at least internally coherent.

---

## DC-04 — oversized `.vue` files (P2)

**Family:** long-file-should-encapsulate

`find demo -name '*.vue' -exec wc -l` (>400):

- `channel-controls/ChannelOptions.vue` — **609**
- `scenes/spring/SpringTarget.vue` — 470
- `channel-controls/ChannelControls.vue` — 456
- `transport/TransportDock.vue` — 403

Notable non-vue over-length: `spring/useSpringDemo.ts` 499, `sequence/useSequenceDemo.ts` 482,
`easing/useEasingDemo.ts` 410, `square/useSquareDemo.ts` 404. The `use*Demo.ts` cluster is the
per-scene god-composable pattern.

**Disposition — BUILD (fold into DC-03 channel-controls sub-modularization):** ChannelOptions (609) is
the primary candidate — its 6 colocated composables already exist; extract the panel bodies
(LayerConfigPanel/TimingFunctionPanel are already separate) and push template partials into an
encapsulated `ChannelOptions/` module. Census-only for the `use*Demo.ts` files (scene-owned, coherent).

---

## DC-05 — encapsulation-of-one single-file dirs (P2)

**Family:** single-file-dir

Dirs holding exactly one file (`find demo -type d` + per-dir count):

- `transport/components/` → only `DemoGlobalChrome.vue` (consumed solely by
  `AnimationControlsGroup.vue`). A kind-dir wrapping a single single-owner component. Colocate into
  `AnimationControlsGroup/`.
- `transport/KfPillTabs/` → only `useKfPillTabs.ts` (becomes ≥2 files once `KfPillTabs.vue` moves in
  under DC-01 — self-resolving).
- `demo/composables/scene-facility/` → only `index.ts`. Verify whether the barrel earns a dir or should
  be `scene-facility.ts`.

**Disposition — FOLD:** `transport/components/` → `AnimationControlsGroup/` (with DC-01);
`scene-facility/` → flatten to a single file unless it is a public grouping. `KfPillTabs/` resolves
under DC-01.

---

## DC-06 — cross-module helpers parked in `instrument/utils/` kind-dir (P3)

**Family:** shared-substrate-misplacement

`instrument/utils/{iosTextEntry,toastGuard}.ts` ARE genuinely cross-sub-module:
`iosTextEntry` → shell/EditorShell.vue + keyframes/CSSCodeEditor.vue; `toastGuard` →
keyframes/KeyframesAddDialog.vue + timeline/CSSPasteDialog.vue. So they correctly do NOT colocate into
a single owner — but the glass idiom houses ownerless cross-cutting helpers in a `_shared/` substrate
(STRUCTURE-ADDENDA §1 `_shared/`), not a `utils/` kind-dir.

**Disposition — BUILD (rename):** `instrument/utils/` → `instrument/_shared/` to match the idiom's
substrate naming. Trivial, do alongside DC-03.

---

## DC-07 — `demo/components/` tier flatness / CopyButton placement (P3)

**Family:** tier-placement

`demo/components/` root holds one loose file `CopyButton.vue` plus `instrument/` (the big module) and
`playback/` (AnimationVisualizer.vue, PlaybackRibbon.vue). CopyButton is broadly shared (6 importers
spanning scenes + instrument sub-modules → genuinely global). `playback/` members are shared across
scenes + channel-controls. Both placements are defensible as demo-global groupings; the nit is the lone
loose `CopyButton.vue` at the components root without a home dir.

**Disposition — census / optional FOLD:** either keep `CopyButton.vue` as an acknowledged global atom
or give it a `copy-button/` dir to match the per-component-dir idiom. Low priority.

---

## Negatives (checked and found SOUND)

- **scenes/ recursive colocation is the exemplar.** Each scene module colocates `.vue` + `use<Scene>Demo.ts`
  + `<scene>Keys.ts` + `*.css` + assets (`checkerboard.jpg`, `cube.png`). Nested widgets are properly
  encapsulated: `cube/matrix-editor/{MatrixEditor.vue, transformMath.ts, useTransformState.ts}` and
  `cube/orbital-drag/{OrbitalDrag.vue, index.ts, quaternionEuler.ts, types.ts, composables/}` — the
  latter even has a legitimate nested `composables/` (4 members, orbital-internal). No action.
- **Component-local styles ARE colocated** where they exist: `CubeTarget.css`, `EasingTarget.css`,
  `SequenceTarget.css`, `SquareScene.css`, `AnimationControlsGroup.css`, `ControlsPaneWrapper.css` each
  sit next to (and are imported only by) their `.vue`. Global sheets correctly live in `demo/styles/`
  (brand/layout/design-idioms/playback-idiom/tab-idiom/style). Style colocation is sound.
- **`demo/composables/` membership is honest global surface.** `useDoubleTap` (3 scene consumers),
  `useDragScrub` (5 consumers across scenes + transport), `useThrottledReadout` (2 consumers:
  easing + spring), `scene-runtime/*` and `scene-facility/` (consumed by ≥8 scenes + app + transport).
  All genuinely multi-owner → correctly NOT colocated.
- **`demo/utils/` membership is mostly multi-consumer:** `clipboard` (3), `formatEditorCSS` (4 across
  keyframes + timeline), `keyframeSelector` (5 across keyframes + timeline), `gestureSelectSuppression`
  (2), `rafConstants` (2). These cross sub-modules → legitimately global.
- **`app/` tier is reasonably zoned:** `dock/`, `scene/`, `transition/`, `lifecycle/` sub-dirs each hold
  coherent members; no kind-dir smell. No `.DS_Store` beyond the known `demo/.DS_Store` (already an
  addenda W-DELETE-CLASS item).
- **`demo/state/` (Pinia stores)** is a coherent global grouping — not audited as a colocation defect.

## Coverage gaps

- I did NOT run a build/typecheck to confirm the DC-02 shims are the ONLY stale import paths; a full
  `vue-tsc` import-graph would find any other kind-dir aliases. Recommend the next lane run
  `npm run check` and diff unresolved/duplicate-path imports.
- Consumer censuses used `grep -rl` on identifier substrings; a symbol-precise import-graph tool could
  catch re-exports I treated as direct imports (barrels `index.ts` in keyframes/timeline/transport were
  not fully traced for indirect consumption).
- The in-flight working-set transaction touches `channel-controls/*.vue` + `controls-pane/RibbonBar.vue`
  (`M`); DC-01/DC-03 dispositions must sequence AFTER it lands to avoid clobbering. I audited the tree
  as-committed per the lane instruction; whether the transaction itself intends to fix the split-brain
  is unknown (the modified files do not add/move dirs, so it appears NOT to).
- Glass-7 dependency: none of my findings depend on the Glass-7 migration — they are demo-internal
  structure. The demo consumes glass-ui via `@mkbabb/glass-ui`; no demo file placement is gated on the
  sibling migration.
