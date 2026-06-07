# Tranche G — Audit: demo frontend encapsulation + colocation + modern-Vue idiom (lane `a-frontend-encapsulation`)

**Scope.** `demo/**` (the `@/` shared library + the per-scene component libraries
`cube/`, `spring/`, `easing/`, `sequence/`, `motion-path/`, `square/`, `amiga/` +
the unified host `demo/app/` + the standalone `demo/playground/`) on
`tranche-g-dev` (D+E+F released — kf 4.0.0). Read-only; **zero source edits** —
propose, never write. This lane owns the **finer-than-line-count** encapsulation
axis F's `a-demo-post-e` could not reach: F established "nothing >350L, no legacy
orphans, scenes complete" (`F/audit/a-demo-post-e.md:33,255-261`) and F.W14-W16
landed the demo SHIPs (undo/redo, contenteditable a11y, asset alt, shortcut
discovery — `F/FINAL.md:81-87`). So G assays the **sub-file** grain: multi-concern
composables, components/utils mislocated relative to the demo's own colocation
discipline, and Vue-3.5 idiom drift (the legacy template-ref pattern surviving
*beside* its `useTemplateRef` replacement — the §Mandate's "no deprecated path
beside its replacement").

**Method (inv ε).** `wc -l` over all 157 non-`dist` `.vue`/`.ts` (top file 349L,
`EasingCurveCanvas.vue`); greps scoped source-only (`dist/` build artifacts
pollute naive greps — every claim below is source-verified at `file:line`). Vue
idiom grounded on the live `vue ^3.5.35` pin (`package.json`) +
`modern-web-guidance` (the Vue guides are framework-specific adaptations of its
Baseline corpus; no Vue-API guide in its set, so the API-version claims are
grounded directly on the Vue 3.5 changelog — `useTemplateRef`/`toValue` are 3.5/3.4
stable, cited inline). Diffed against `F/audit/a-demo-post-e.md` + the
`F/audit/_SYNTHESIS-deferred-ledger.md` (XR-2 the stale-tree row) — extends, does
not repeat.

---

## Headline

**The demo's encapsulation is ~90% SOTA and F was right that the architecture is
clean — but the assay at sub-file grain surfaces ONE coherent idiom-drift band that
F's line-count lens could not see.** The demo carries **two template-ref idioms
side-by-side**: `useTemplateRef("name")` (the Vue-3.5 idiom, in 28 files) AND the
legacy `const x = ref<InstanceType<...>>(null)` + `ref="x"` pattern — and in
**three files the two coexist within one component** (`AnimationControls.vue`,
`KeyframesStringControls.vue`, `Animated.vue`). This is the precise shape the
§Mandate forbids: a replaced surface NOT replaced in one motion. It is the only
finding here that rises to a clean SHIP-in-G with a falsifiable gate.

The remaining findings are smaller and honest: **two genuinely-mislocated files**
(`useToastGuard.ts` — a pure predicate wearing a `use*` composable name in
`@/utils/`; `timelineTypes.ts` — a types module filed under `composables/` while
its sibling types live under `utils/`), **one app-root colocation gap** (8
`useScene*` composables flat in `demo/app/` beside `main.ts`/`router.ts`, where
every *other* multi-file surface in the demo uses a sub-dir), and **one
architectural smell I name but DECLINE to flag as a defect** (the imperative
`h()`-render-tree slot helpers in `CubeScene`/`SpringScene`/`EasingScene` — 19/14/11
calls — exposed via `defineExpose` for the host shell to project; this is the demo's
deliberate scene→host slot architecture and KISS says leave the seam, see §5). The
bulk is ALREADY-SOTA — the per-scene colocation (`{Target.vue, Sidebar.vue,
*Keys.ts, *Presets.ts, use*Demo.ts}`), the animation-controls sub-dir tree
(`{components, composables, controls, keyframes, stores, timeline}`), `defineModel`
adoption, `toRef(() => props.x)` getter-style, and the `injectionKeys.ts` typed-key
convention are exemplary and left alone.

---

## §1 — Two template-ref idioms ship side-by-side; three files mix both `[MED — SHIP-in-G]`

**This is the §Mandate's "no deprecated path beside its replacement" expressed in
Vue idiom.** Vue 3.5 stabilized `useTemplateRef(name)` as the idiomatic template-ref
accessor (Vue 3.5.0 release, 2024-09; it replaces the implicit "declare a ref whose
variable name matches the `ref=` attribute" coupling with an explicit string key
and correct typing). The demo **adopted it broadly** — 28 files call
`useTemplateRef` (verified: grep `useTemplateRef` over `demo/**` source). But the
**legacy pattern survives in seven files**, and in three of them it sits *inside the
same component* as the modern idiom:

| File | Legacy `ref<…>(null)` + `ref=` | `useTemplateRef` in SAME file | Verdict |
|---|---|---|---|
| `controls/AnimationControls.vue` | `:180` `keyframesControlsRef`, `:181` `timelineRef` (bound `ref="keyframesControlsRef"` `:60`, `ref="timelineRef"` `:102`) | YES — `:182-204` (`tabsContentEl`, `tabsHeaderEl`, `tabsListRef`, `keyframesPaneEl` all `useTemplateRef`) | **mixed in one file** |
| `keyframes/KeyframesStringControls.vue` | `:76` `editorRef = ref<InstanceType<typeof CSSCodeEditor>>(null)` | YES (2 sites) | **mixed in one file** |
| `Animated.vue` | — (its `:16` `children = ref<HTMLElement[]>([])` is a DATA ref, manually populated — NOT a template ref; correctly excluded) | YES (2 sites) | not a real mix — RECORD |
| `app/scenes/CubeScene.vue` | `:52` `cubeTargetRef`, `:53` `cubeElRef` (bound `ref="cubeTargetRef"` `:8`) | no | legacy-only |
| `AnimationControlsGroup.vue` | `:220` `controlsPaneEl`, `:231` `menuBarRef` (bound `ref="menuBarRef"` `:75`) | no | legacy-only |
| `editor-shell/EditorShell.vue` | `:137` `headerRibbonRef = ref<InstanceType<typeof HeaderRibbon>>(null)` (bound `:10`) | no | legacy-only |
| `playground/App.vue` | `:72` `viewportRef`, `:73` `layerPanelRef` (bound `:14,:23`) | no | legacy-only |

`AnimationControls.vue` is the sharpest instance: a single `<script setup>` declares
`keyframesControlsRef`/`timelineRef` via `ref<InstanceType>(null)` (`:180-181`) and
`tabsContentEl`/`tabsHeaderEl`/`tabsListRef`/`keyframesPaneEl` via `useTemplateRef`
(`:182-204`) — the reader cannot tell from the declaration which is which, and the
two-line-apart split *within one file* is exactly the "weaker-alternative escape
hatch beside the real fix" the §Mandate names. The legacy pattern is not wrong (Vue
3.5 still honours implicit name-matching for back-compat), but shipping both is the
legacy-shape the Mandate excises: **converge to one in a single motion.**

- **Disposition. SHIP-in-G.** Convert all 6 genuine legacy template-ref sites
  (CubeScene ×2, AnimationControlsGroup `menuBarRef`, EditorShell `headerRibbonRef`,
  playground ×2, AnimationControls ×2, KeyframesStringControls ×1 —
  `controlsPaneEl` at `AnimationControlsGroup.vue:220` is also a `ref<HTMLElement>(null)`
  template ref, bound in template; convert it too) to `useTemplateRef("…")`. Type via
  `useTemplateRef<InstanceType<typeof Child>>("…")` for component refs — Vue 3.5
  supports the generic param. Pixel- and behaviour-isomorphic (the `.value` access
  surface is identical).
- **Falsifiable instrument (the gate that BITES).** A `proof:demo-decomposition`-sibling
  grep gate — `proof:demo-template-refs` — asserting **zero** `ref<(HTML|SVG|InstanceType)`
  declarations that are bound via a `ref="…"` attribute in any `demo/**` SFC (i.e. the
  legacy template-ref shape is absent), allowing only `useTemplateRef`. It bites the
  moment a contributor re-introduces the old pattern. (Distinguish data refs like
  `Animated.vue:16` — those are not bound via `ref=` and pass.) This rides the existing
  `proof:decomposition`/`demo-elevate` grep-gate family the demo already lives under
  (`F/audit/_SYNTHESIS` NEW-7 records that family is presence-grep SHAPE-locks — this is
  the same shape).
- **Isomorphism.** Named delta only: the declaration form changes; every render path,
  every `.value` read, every `defineExpose` of these refs is byte-stable. No pixel
  moves.
- **inv ε note.** Every site cited `file:line` and verified bound in-template (the
  `Animated.vue:16` data-ref correctly excluded — it is `ref<HTMLElement[]>([])`
  populated by `el.value?.children`, not a `ref=` target; calling it a mix would be
  manufactured work).

---

## §2 — `useToastGuard.ts` is a pure predicate wearing a composable name `[LOW — SHIP-in-G]`

`@/utils/useToastGuard.ts` exports a **single pure function** `isInsideToaster(el):
boolean` (`:26`) — no reactive state, no lifecycle, no `ref`/`computed`/`watch`. The
`use*` prefix is the Vue convention for **composables** (functions that consume the
reactivity/lifecycle API and are called inside `setup`). This file is neither: its
two consumers call it as a plain predicate inside event handlers
(`CSSPasteDialog.vue:6,41`; `KeyframesAddDialog.vue:15,68` — both `import {
isInsideToaster } from "@utils/useToastGuard"`). The filename mis-signals the kind
of module it is, and it correctly *already lives* in `@/utils/` (the pure-util home)
— so the file location is right but the name lies. (The file's own header doc is
exemplary — it documents the vue-sonner private-DOM coupling precisely; the name is
the only defect.)

- **Disposition. SHIP-in-G.** Rename `useToastGuard.ts` → `toastGuard.ts` (it stays
  in `@/utils/`, beside `clipboard.ts`/`iosTextEntry.ts` which correctly carry
  plain-noun names for their pure exports). Update the two import sites. The export
  name `isInsideToaster` is already correct (predicate-shaped, not `use*`).
- **Falsifiable instrument.** Fold into the same `proof:demo-template-refs`/decomposition
  grep wave: assert no `@/utils/use*.ts` file exists whose exports contain zero
  `ref`/`computed`/`reactive`/`watch`/`on[A-Z]` tokens (a pure-module-named-`use*`
  detector). Cheap, bites on regression.
- **Isomorphism.** Pure rename + 2 import-path edits. Zero behaviour change.

---

## §3 — `timelineTypes.ts` is filed under `composables/`, splitting the demo's own types-colocation rule `[LOW — SHIP-in-G]`

The animation-controls tree colocates **types** under `utils/` or as a top-level
`*Types.ts`:
`asset-manager/assetTypes.ts`, `orbital-drag/types.ts`, `matrix-editor/transformMath.ts`
(math), and the `timeline/utils/` dir (`flattenVars.ts`, `snapshotCapture.ts`,
`timelineEngine.ts`). But **`timelineTypes.ts` lives under
`timeline/composables/`** (`timeline/composables/timelineTypes.ts`) — verified to be
a **pure-types module** (`interface TimelineKeyframe`, `interface TimelineState`,
`const DEFAULT_CAPTURE_PROPERTIES` — no reactivity, `:1-15`). It sits beside the
genuine composables `useTimeline.ts`, `useTimelineBuild.ts`, `useTimelineOps.ts`,
`useZoomPan.ts`. A types file under `composables/` mis-signals its kind and breaks
the demo's own otherwise-consistent rule (types → `utils/` or `*Types.ts` at the
surface root).

- **Disposition. SHIP-in-G.** Move `timeline/composables/timelineTypes.ts` →
  `timeline/utils/timelineTypes.ts` (beside the other pure timeline modules) OR to
  the `timeline/` root as a sibling of `KeyframeTimeline.vue` (matching the
  `asset-manager/assetTypes.ts` / `orbital-drag/types.ts` root-level convention).
  Prefer the root-`timelineTypes.ts` form for symmetry with the two existing
  precedents. Update the (intra-`timeline/`) import paths.
- **Falsifiable instrument.** A decomposition-grep clause: no `**/composables/*Types.ts`
  and no `**/composables/` file whose exports are types-only (zero runtime export).
- **Isomorphism.** File move + import-path edits within `timeline/`. Zero behaviour.
- **inv ε note.** `timingCurveUtils.ts` ALSO lives under a `composables/` dir
  (`controls/composables/timingCurveUtils.ts`) and is pure SVG-path functions
  (`:3` `generateCurveSVGPath`, no reactivity) — the SAME mislocation. Fold it into
  this move (→ `controls/` root or a `controls/utils/`). Two files, one rule, one
  motion. (Recorded here rather than a separate §; same disposition + gate.)

---

## §4 — The 8 `useScene*` composables sit flat in `demo/app/` beside the entrypoints `[LOW — MEASURE-FIRST]`

`demo/app/` holds the unified host. Its root is **flat**: `App.vue`, `main.ts`,
`router.ts`, `scenes.ts`, `index.html` (the genuine app shell) sit beside **eight
composables** — `usePlaybackSnapshot.ts`, `useSceneGroupSync.ts`, `useSceneRouter.ts`,
`useSceneSwap.ts`, `useSceneTransition.ts`, `useSceneUrl.ts`,
`useSceneVisibilityPause.ts` (+ `loaf-observer.ts`, `cubeTransformStore.ts`). Every
*other* multi-file surface in the demo uses a sub-dir to separate composables from
their host: `animation-controls/composables/`, `orbital-drag/composables/`,
`keyframes/composables/`, `timeline/composables/`. `demo/app/` is the one host that
does not — 7 `useScene*` files dilute the entrypoint dir, and these are all
**app-internal** (grep confirms zero cross-app imports of `usePlaybackSnapshot`,
`useSceneGroupSync`, `useSceneUrl`, `useSceneVisibilityPause` — they are consumed
only by `App.vue`/`useScene*` siblings).

- **Disposition. MEASURE-FIRST (befitting, not reflexive).** A `demo/app/composables/`
  sub-dir collecting the 7 `useScene*` + `usePlaybackSnapshot` would match the demo's
  own everywhere-else rule and de-clutter the host root to its genuine shell. **But**
  the §Mandate's "KISS — no contrived directory nesting" cuts both ways: 8 files at a
  flat host root is not egregious, and the move touches ~8 import statements in
  `App.vue`. SHIP **only if** the user agrees the symmetry-with-the-rest-of-demo is
  worth the import churn; otherwise RECORD as a deliberate flat-host choice. This is a
  judgment call, not a defect — hence MEASURE-FIRST, not SHIP.
- **Falsifiable instrument (if SHIPped).** None needed beyond the move; the
  consistency is the deliverable. (No gate — a gate forcing every `use*.ts` into a
  `composables/` dir would be the reflexive over-engineering the Mandate forbids; the
  scene-app dirs like `cube/useCubeAnimations.ts` correctly keep a *single* composable
  flat.)
- **inv ε note.** `loaf-observer.ts` (LoAF/INP observer) and `cubeTransformStore.ts`
  (a shared store) are NOT `use*` composables and correctly stay at root — the move is
  scoped to the `useScene*` family + `usePlaybackSnapshot` only.

---

## §5 — The `h()`-render-tree slot helpers: NAMED, DECLINED (KISS — leave the seam) `[RECORD — already-befitting]`

**I name this so a future pass does not "fix" it into a regression.**
`CubeScene.vue` (19 `h()` calls), `SpringScene.vue` (14), `EasingScene.vue` (11)
build slot content — header hovercards, `TabsContent`/`MatrixEditor`, ribbon
buttons — as **imperative `h()` render trees inside `<script setup>`**, then expose
them via `defineExpose({ headerLeft, startScreen, tabsContent, ribbonContent, … })`
(`CubeScene.vue:208-219`). The host `App.vue` projects them with
`<component :is="sceneRef?.tabsContent">` (`App.vue:89-104`). At first glance this
reads as a smell — markup-as-`h()` where a `<template>` with named slots is more
idiomatic.

**It is NOT a defect, and converting it would be the wrong move.** The architecture
is a deliberate **scene → shared-host slot-projection**: scenes are not rendered in
their own page, they are *adopted* by `demo/app/`'s single `EditorShell`-based host,
which needs to pull named render fragments (`tabsContent`, `ribbonContent`,
`headerLeft`) out of whichever scene is active. A function-returning-VNodes exposed
via `defineExpose` is the idiomatic Vue way to hand a *dynamic, host-projected* slot
across the scene/host boundary when the slot owner (the scene) and the slot consumer
(the host) are sibling components reached through `<component :is>` — `<template>`
slots cannot cross that `:is`-indirection cleanly because the host does not statically
know the scene. Some of the `h()` content (the ppmycota hovercard,
`CubeScene.vue:105-131`) is genuinely scene-specific imperative UI. Forcing these
into colocated SFCs would multiply files for content used at exactly one call-site,
and re-introduce the static-slot coupling the `:is`-projection deliberately avoids —
the contrived-nesting the §Mandate's KISS clause forbids.

- **Disposition. RECORD (already-befitting).** Leave the slot-projection seam. The
  ONE bounded refinement worth a BOOK (not a SHIP): the *largest, most-static* `h()`
  trees — the ppmycota hovercard in CubeScene, the ribbon button groups — could be
  extracted to colocated `*.vue` sub-components imported and rendered with a single
  `h(PpmycotaHover)` if they grow further. Not now: at 19/14/11 calls the cost-to-clarity
  is negative, and the seam is correct. This is the "MEASURE-FIRST, not reflexive"
  discipline F.md NEW-3 applied to the Animation class, applied here.
- **inv ε note.** Verified the pattern is scene-only (`AmigaScene`/`MotionPathScene`/
  `SequenceScene`/`SquareScene`/`StartingStyleScene` have **0** `h()` calls — they
  expose data only), so this is not a creeping demo-wide anti-pattern; it is localized
  to the three richest scenes precisely because they have host-projected slot content.

---

## §6 — Where the demo encapsulation is ALREADY-SOTA (verified — manufacture NO work)

- **Per-scene colocation is exemplary.** Each scene library colocates its full
  surface: `spring/{SpringTarget.vue, SpringSidebar.vue, StartingStyleTarget.vue,
  springKeys.ts, springPresets.ts, useSpringDemo.ts}`,
  `easing/{EasingTarget.vue, EasingSidebar.vue, easingGroups.ts, easingKeys.ts,
  useEasingDemo.ts}`, `motion-path/{MotionPathTarget.vue, motionPathGeometry.ts,
  motionPathKeys.ts, useMotionPathDemo.ts}`. Component + composable + typed-injection-keys
  + presets, each beside its scene — textbook colocation. No reach-across.
- **The animation-controls tree is a clean concern-decomposition.** Six cohesive
  sub-dirs (`components/`, `composables/`, `controls/`, `keyframes/`, `stores/`,
  `timeline/`), each with its own `composables/` + `utils/` where warranted; the
  `stores/` barrel split by concern (`animationOptionsStore`, `controlOptionsStore`,
  `hashSharing`, `scenePlayback`, `storeUtils`, `index`). This is the F-recorded
  "decomposed by concern" discipline (`F/audit/a-demo-post-e.md:259-261`) holding at
  the finest grain.
- **`injectionKeys.ts` typed-key convention is correct.** `InjectionKey<Ref<boolean>>`
  symbols (`animation-controls/injectionKeys.ts:3-4`) + the per-scene `*Keys.ts`
  (`easingKeys.ts`, `springKeys.ts`, `sequenceKeys.ts`, `motionPathKeys.ts`) — typed,
  symbol-keyed provide/inject, colocated. SOTA Vue provide/inject hygiene.
- **`defineModel` adopted idiomatically.** 6 files (`CubeTarget`, `ResponsiveSelect`,
  `KeyboardShortcutsModal`, `CSSPasteDialog`, `OrbitalDrag`, `CSSCodeEditor`) — the
  Vue-3.4 two-way-binding idiom, no manual `modelValue` prop + `update:modelValue`
  emit boilerplate. Matches `demo/CLAUDE.md`'s stated convention.
- **`toRef(() => props.x)` getter-style is present** (`AnimationControlsControls.vue:253`
  `toRef(() => props.isPlaying ?? false)`) — the Vue-3.3+ reactive-prop-forwarding
  idiom, NOT a destructure (honours the user's MEMORY "NEVER destructure defineProps"
  feedback). Verified: `props.X` access throughout, no `const { x } = defineProps()`.
- **`@/utils/` correctly holds the genuine pure utils** — `clipboard.ts` (`copyText`),
  `iosTextEntry.ts` (`isIOSLikePlatform`/`clampIOSNoZoomFontSize`/`initIOSPlatformClass`),
  `utils.ts` (`cn`). Plain-noun names for pure exports — the rule §2's `useToastGuard`
  violates is otherwise universally held.
- **Nothing >350L; no god-component, no god-composable.** Largest unit
  `EasingCurveCanvas.vue` 349L; largest composable `useEasingDemo.ts` 321L — both at
  cohesive gestalt (single demo concept each). No split warranted (the F.md NEW-3
  measure-first discipline: a split here would be the legacy-shape extract-for-line-count).
- **The orbital-drag composable decomposition is clean.** `orbital-drag/composables/`
  splits the drag concern into `useOrbitalPointer` (249L), `useOrbitalPinch` (201L),
  `useOrbitalInertia` (142L, dogfooding the engine's `decay()` per F.W10), +
  `inertiaDecay.ts` pure helper — concern-per-composable, the right grain.

---

## Disposition summary

| # | Finding | Sev | Disposition | Gate |
|---|---------|-----|-------------|------|
| 1 | Two template-ref idioms ship side-by-side; 3 files mix both (`AnimationControls.vue:180-204`, `KeyframesStringControls.vue:76`, +5 legacy-only) | MED | **SHIP-in-G** | `proof:demo-template-refs` (zero bound `ref<…>(null)`; only `useTemplateRef`) |
| 2 | `@/utils/useToastGuard.ts` is a pure predicate wearing a `use*` name (`:26` `isInsideToaster`) | LOW | **SHIP-in-G** | fold into the decomposition grep (pure-module-named-`use*` detector) |
| 3 | `timeline/composables/timelineTypes.ts` (+ `controls/composables/timingCurveUtils.ts`) are pure modules mis-filed under `composables/` | LOW | **SHIP-in-G** | grep: no types-only / no-reactivity file under `**/composables/` |
| 4 | 8 `useScene*` composables flat in `demo/app/` vs the demo's everywhere-else sub-dir rule | LOW | **MEASURE-FIRST** (move to `demo/app/composables/` iff symmetry worth the import churn; else RECORD) | none (consistency is the deliverable) |
| 5 | Imperative `h()` slot helpers in Cube/Spring/Easing scenes (19/14/11) | — | **RECORD (already-befitting)** — scene→host slot-projection is correct; BOOK only the largest extractions | — |
| 6 | Per-scene colocation / animation-controls tree / injectionKeys / `defineModel` / `toRef`-getter / pure-util naming / no god-units | — | **RECORD (already-SOTA)** | verified exemplary |

**Cross-repo hand-offs: NONE in this lane.** Every finding is demo-local Vue idiom +
demo file organization — no value.js / parse-that / glass-ui touchpoint surfaced
(the §1 template-ref idiom, §2/§3 colocation, §4 directory shape are all
`demo/**`-internal; the §5 `h()` consumes glass-ui components but the *pattern* is
kf-demo's own architecture, not a glass-ui concern).

**Doc-truth note (carries XR-2 forward, not a finding here).** `demo/CLAUDE.md` is
stale at the finest grain — it documents a `@/composables/` directory that does NOT
exist (the composables live colocated under `animation-controls/`, scene dirs, etc.),
and lists components/composables that have moved or no longer exist
(`CubicBezierControls.vue`, `ColorInterpolationPanel.vue`, `useExclusiveSelect.ts`,
`LabeledInput.vue`/`LabeledSelect.vue`/`IconTooltip.vue` at the documented paths,
`useKeyboardShortcuts.ts` under `@/composables/`, the `animationStores/` dir name —
live dir is `stores/`). This is the demo sibling of the
`F/audit/_SYNTHESIS-deferred-ledger.md` XR-2 root-`CLAUDE.md` stale-tree row — a
doc-housekeeping RECORD for the owner, out of audit write-scope, noted so the demo's
own colocation story is documented truthfully (it would have made this audit faster
and prevents a contributor mis-placing a file by following the stale doc).

**The one-paragraph thesis.** F's "the demo architecture is clean" verdict holds at
the line-count grain and G does not re-litigate it. At the sub-file grain the demo
is ~90% SOTA — the colocation discipline, `defineModel`/`toRef`/`injectionKeys`
idiom, and concern-decomposition are exemplary and left alone. The single coherent
G band is **idiom convergence**: collapse the two co-existing template-ref idioms to
`useTemplateRef` in one motion (§1, the only MED, with a biting grep gate), and fix
the two genuine file-kind mislocations (§2 the `use*`-named pure predicate, §3 the
types/pure modules under `composables/`). The app-root composable colocation (§4) is
a judgment-call symmetry move, and the `h()` slot-projection (§5) is correct
architecture I explicitly DECLINE to "fix". This is a finishing pass on a
disciplined surface — extending the demo's own idiom to the corners it reached
partway — NOT a restructure.
