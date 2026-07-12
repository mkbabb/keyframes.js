# Lane 24 — design-restructure-system

**Charter:** the restructure's design-system implications — component API surfaces
(instrument facility, scenes, glass-ui consumption) audited AS a design system:
naming, prop grammars, slot/emit conventions, the skeleton tier (T.F8's deferred
half); then THE house COMPONENT MODULE SKELETON defined precisely enough for U to
charter as the standard, with a worked example from the existing tree.

**Method:** full-tree census of every `defineProps`/`defineEmits`/`defineModel`/
`defineExpose`/`defineSlots` site in `demo/` (60 SFCs), the CSS-wiring modes, the
provide/inject keyspace, per-member consumer counts inside the instrument facility
and the timeline module, the T.F8 record (T/PROGRESS.md:343 "T.F8-partial"), and
the standing gates (`proof:colocation`, `proof:scene-colocated`,
`proof:style-file-ceiling`). Frontend-design skill loaded per charter. All claims
below are read from the tree, file:line cited.

---

## §1 The design-system verdict in one paragraph

The demo is *structurally* colocated (T.F5's instrument facility, R.W5's fused
scenes) but *grammatically* incoherent: four prop-declaration styles, two emit
declaration styles crossed with three event-name grammars, two context-delivery
mechanisms inside single scenes, three CSS-wiring modes, zero typed slot
contracts, and a skeleton "tier" that consists of exactly one component living in
precisely the kind of category bin (`@/components/skeletons/`) the GRAND
COLOCATION EDICT forbids. Meanwhile the facility's internal shape contradicts the
edict it was built under: `transport/composables/` is a 21-file generic bin whose
members are mostly single-owner satellites, and the timeline module's nesting is
*inverted* (a child's private sub-component sits at the module root while the
child itself sits in a `components/` bin). None of this is fixable by moves alone
— it needs ONE ratified component-module skeleton (§9) plus ONE API grammar
(§10), enforced by extending the already-standing `proof:colocation` gate.

---

## §2 Finding — the skeleton tier is one orphan in a forbidden kind-bin (T.F8's deferred half) — MAJOR

**Evidence.**
- The whole tier is ONE file: `demo/@/components/skeletons/SceneSkeleton.vue`
  (the only file under `@/components/skeletons/`). Its own header says so:
  "SceneSkeleton — T.F8 (the skeletons tier; lane 13 rec 8) … THE shared loading
  placeholder for the app-shell `<Suspense>` fallback"
  (SceneSkeleton.vue:2–9).
- It has exactly ONE consumer: `demo/app/App.vue:140`
  (`import SceneSkeleton from "@components/skeletons/SceneSkeleton.vue"`),
  used at App.vue:95. A single-consumer component in a shared category dir is the
  exact shape `proof:colocation` exists to forbid (scripts/proof-colocation.mjs:5–7:
  "components COLOCATE their private sub-components / composables / **skeletons**
  / constants / styles — recursively").
- T's own record marks the item partial: docs/tranches/T/PROGRESS.md:343
  ("**T.F8-partial** (SceneSkeleton replaces the bare loading span)").
- The OTHER lazy seams have NO skeleton at all: the Monaco-bearing panes are
  `defineAsyncComponent(() => import("../../keyframes/KeyframesStringControls.vue"))`
  and `…KeyframeTimeline.vue` with **no `loadingComponent`**
  (transport/controls/AnimationControls.vue:252–253) — the pane region renders
  *nothing* for the duration of the Monaco/highlight.js chunk fetch. The same
  holds for every lazy barrel export (instrument/transport/index.ts:8–12,
  instrument/keyframes/index.ts:7–11, instrument/timeline/index.ts:6) and the
  scene descriptors, which deliberately carry no loadingComponent
  (app/scene/scenes.ts:226–227: "the app shell owns the <Suspense> #fallback
  slot, so the descriptors carry no loadingComponent").

**Why this is a design-system defect, not a polish gap.** Perceived performance
is part of PERFORMANCE-the-grand-edict; a lazy seam with no placeholder is a
layout-shifting blank. And a "tier" with one member in a kind-bin is a design
system that was named but never instantiated.

**Proposal (gestalt).** The skeleton is a MEMBER OF THE COMPONENT MODULE, not a
category. Ratify (§9): every lazily-delivered module owns
`<Name>.skeleton.vue` beside `<Name>.vue`, and the module's OWN lazy barrel wires
it — `defineAsyncComponent({ loader, loadingComponent: NameSkeleton, delay: 150 })`
— so the placeholder ships in the eager barrel chunk while the payload stays
split. `SceneSkeleton.vue` moves to its sole consumer's module
(`app/` beside App.vue, or `app/scene/` if scenes.ts adopts per-descriptor
skeletons); `@/components/skeletons/` is deleted. The skeleton inherits
SceneSkeleton's already-correct a11y contract (role=status, aria-busy,
prefers-reduced-motion static plate — SceneSkeleton.vue:28–99) as the house
skeleton spec.

---

## §3 Finding — four prop-declaration grammars coexist — MAJOR

**Evidence (one exemplar per grammar; census covered all 60 SFCs).**

| Grammar | Exemplar |
|---|---|
| Runtime-object props | `CopyButton.vue:27` `defineProps({ text: { type: String, required: true }, … })` — the ONLY runtime-object site in the tree |
| Plain typed, `const props =` | `transport/controls/AnimationVisualizer.vue:54`, `timeline/KeyframeTimeline.vue:162`, `app/dock/ChromeDock.vue:62`, ~20 more |
| `withDefaults(defineProps<…>(), {…})` | `keyframes/CSSCodeEditor.vue:76–77`, `shell/EditorShell.vue:135–136`, `shell/AnimatedText.vue:55–56`, `timeline/CSSPasteDialog.vue:43–44`, `SceneSkeleton.vue:18–19` |
| Reactive destructure w/ inline defaults (Vue 3.5) | `transport/AnimationControlsGroup.vue:138`, `transport/TransportDock.vue:369`, `transport/controls/AnimationControls.vue:257`, `keyframes/KeyframesEditor.vue:131` (`framed = true`), `transport/KfPillTabs.vue:54–59` (`orientation = "horizontal"`) |

The memory-ratified narrowing (J·T5) already blesses reactive destructure as
idiomatic post-Vue-3.5 (gated only when a destructured prop is passed into a
composable — cured by getter fns, exactly as KfPillTabs.vue:74–79 already does:
`options: () => options`).

**Proposal.** ONE house grammar: **reactive destructure with inline defaults**;
`withDefaults` and runtime-object props are legacy (the owner's NO-legacy edict
covers grammar, not just dead code). Getter-fn threading into composables is the
mandated companion (the KfPillTabs.vue:74–79 pattern is the reference). CopyButton
is the single runtime-object holdout — it converts as part of its module-ization
(§9 worked-example sibling). Enforce with a static gate clause (extend
`proof:colocation` or a sibling `proof:component-grammar`): no `withDefaults`, no
object-literal `defineProps` argument.

---

## §4 Finding — emit grammar: two declaration styles × three event-name grammars, and hand-rolled v-model — MAJOR

**Evidence.**
- Declaration styles: the call-signature style dominates
  (`(e: "switchScene", id: string): void` — ChromeDock.vue:152–157,
  TimelineTrack.vue:128–133, PlaybackRibbon.vue:118–127,
  AnimationControlsGroup.vue:218–221, OrbitalDrag.vue:33–41, MatrixEditor.vue:119),
  while KfPillTabs.vue:67 uses the named-tuple style
  (`defineEmits<{ "update:modelValue": [value: string] }>()`).
- Event-NAME grammars for the same "X changed" concept, three ways:
  - noun+`Update`: `sliderUpdate` (AnimationControls.vue:353,
    AnimationControlsControls.vue:338, KeyframesEditor.vue:142,
    PlaybackRibbon.vue:124), `keyframesUpdate` (KeyframesStringControls.vue:61,
    KeyframesEditor.vue:146), `layerConfigUpdate` (ControlsPaneWrapper.vue:311);
  - verb-first: `updateMatrixCell` (MatrixEditor.vue:119), `moveKeyframe`
    (TimelineTrack.vue:130), `switchScene`/`warmScene` (ChromeDock.vue:153–154),
    `toggleControlsPanel`/`updateSelectedControl` (ChromeDock.vue:155–156);
  - bare noun state-report: `pressedKeys` (OrbitalDrag.vue:40), `scrubbed`
    (PlaybackRibbon.vue:123).
- Hand-rolled v-model channels where `defineModel` is the house primitive
  elsewhere: TimelineTrack emits `update:scrubT` manually (TimelineTrack.vue:129)
  and KfPillTabs emits `update:modelValue` manually (KfPillTabs.vue:67, 70) —
  while CSSCodeEditor.vue:93, CubeTarget.vue:124, OrbitalDrag.vue:43,
  MbabbMenu.vue:135, KeyboardShortcutsModal.vue:53, CSSPasteDialog.vue:58 all use
  `defineModel`. Two mechanisms for the identical contract.

**Proposal.** ONE emit grammar, ratified in DESIGN.md and gate-enforced:
(a) named-tuple declaration exclusively (`defineEmits<{ event: [args] }>`), the
call-signature form is legacy; (b) every `update:*` channel is a `defineModel` —
manual `update:*` emits are banned; (c) ONE event-name grammar — **verb-first
camelCase commands** for requests (`switchScene`, `moveKeyframe`) and
**past-participle facts** for notifications (`scrubbed` is already correct);
the noun+`Update` family (`sliderUpdate`, `keyframesUpdate`, `layerConfigUpdate`)
renames into it during the restructure's file moves (the moves already touch
every import — the rename is free at that moment, and NEVER cheaper later).

---

## §5 Finding — the facility's internal shape contradicts the edict: kind-bins full of single-owner satellites — MAJOR

**Evidence.**
- `transport/composables/` holds **21 files** (T.F6's flatten), but member-by-member
  consumer census shows most are single-owner:
  `useSheetGesture` → only ControlsPaneWrapper.vue; `useTimingFunctionEditor` →
  only AnimationControlsControls.vue; `useTabStripScroll` → only
  AnimationControls.vue; `usePlayActuation` → only TransportDock.vue;
  `useKfPillTabs` → only KfPillTabs.vue (KfPillTabs.vue:44). (Multi-consumer
  members exist too — `useSheetSpring` ← useControlsLayout + useRafLoop +
  ControlsPaneWrapper; `useSheetState` ← ControlsPaneWrapper + EasingScene +
  SpringScene — those EARN a facility-level tier seat.)
- The timeline module's nesting is **inverted**: `TimelineCaret.vue` sits at the
  module ROOT yet is consumed only by `components/TimelineTrack.vue`; meanwhile
  TimelineTrack itself (a real sub-component of KeyframeTimeline) sits in a
  generic `components/` bin. `useZoomPan` (composables/) is single-owner to
  TimelineTrack; `useTimelineOps` is consumed only by `useTimeline`;
  `utils/timelineEngine.ts` is consumed only by `useTimelineBuild`. Ownership is
  a clean chain; the dirs are kind-bins that hide it.
- Contrast the tree's OWN best practice: the cube scene encapsulates by NAME —
  `scenes/cube/matrix-editor/` and `scenes/cube/orbital-drag/` are real modules
  with barrels (matrix-editor/index.ts, orbital-drag/index.ts). Two shapes, one
  edict.
- The gate knows: proof-colocation.mjs:27–30 has a "CLAUSE (colocate)" but it only
  fires on a `use*.ts` sitting FLAT at a module root beside an existing
  composables/ tier — it cannot see a single-owner member *inside* the tier, so
  the 21-file bin is invisibly green.

**Proposal.** Ratify the ownership rule of §9: a satellite lives at the LOWEST
directory that contains all its consumers — beside its single owner when it has
one; in the owning module's tier when shared inside the module; promoted ONE
level (to the nearest-common-ancestor's tier) when shared across modules.
Kind-bins (`composables/`, `utils/`, `components/`) survive ONLY at
facility/shared level and ONLY with multi-consumer members. Extend
`proof:colocation` with the inverse clause (single-owner member inside a shared
tier → RED), which turns the standing gate into the skeleton's enforcement arm.

---

## §6 Finding — three CSS-wiring modes with no threshold rule — MAJOR

**Evidence.**
- Mode A — scoped sibling split, `<style scoped src="./X.css">`: exactly 6 of ~60
  SFCs — AnimationControlsGroup.vue:334, ControlsPaneWrapper.vue:320,
  CubeTarget.vue:239, EasingTarget.vue:309, SequenceTarget.vue:255,
  SquareScene.vue:331.
- Mode B — inline `<style scoped>`: everyone else, including SFCs LARGER than
  mode-A members: SpringTarget.vue (471L, style at :272), TransportDock.vue
  (464L, style at :437), ChromeDock.vue (386L, style at :373). No size or
  concern rule distinguishes A from B.
- Mode C — script-imported UNSCOPED skin sheets living inside a component dir:
  `import "./tab-trigger.css"` (AnimationControls.vue:214) and
  `import "./playback-button.css"` (PlaybackRibbon.vue:82) — global-cascade CSS
  whose classes are consumed by OTHER components/scenes
  (playback-button.css:7: "…(EasingScene / SpringScene). As with tab-trigger.css,
  the classes land on…"), i.e. cross-component design-idiom vocabulary parked in
  one module's private directory. DESIGN.md:12–20 already names both as
  candidate glass-ui upstreams.

**Proposal.** ONE rule, three tiers: (1) component-private style is the
`<Name>.css` scoped sibling (mode A) once it exceeds a ratified threshold
(~40 lines; below it, inline `<style scoped>` is fine — a threshold, not taste);
(2) cross-component idiom vocabulary NEVER lives in a module — it is design-system
tier: `@/styles/design-idioms.css` (already the named home for idiom recipes) or
upstream to glass-ui per DESIGN.md's own migration rows — `tab-trigger.css` and
`playback-button.css` move at restructure time; (3) `proof:style-file-ceiling`
gains the companion clause: no unscoped `.css` file under a component module.

---

## §7 Finding — two context-delivery grammars inside single scenes; scene-key files are half a convention — MINOR

**Evidence.**
- The spring scene BOTH provides `SPRING_DEMO_KEY` (SpringScene.vue:32; injected
  by SpringTarget.vue:168 and StartingStyleTarget.vue:96) AND passes the same
  context object as a prop (`demo: SpringDemoContext` — SpringHeatmap.vue:64,
  SpringPhysicsFacet.vue:139). The easing scene repeats the split:
  EasingScene.vue:20 provides, EasingTarget.vue:127 injects, but
  EasingSidebar.vue:82 takes `props.demo`. Two mechanisms, one object, no rule.
- The context TYPE is derived, not declared: springKeys.ts:4
  `export type SpringDemoContext = ReturnType<typeof useSpringDemo>` — the scene's
  component API is whatever the composable happens to return (a 496-line
  useSpringDemo.ts return shape as an implicit interface).
- The `<scene>Keys.ts` convention (amigaKeys/cubeKeys/easingKeys/sequenceKeys/
  springKeys/squareKeys — all six exist) is a good half-convention: the key file
  is uniform, the *usage* of it is not.
- The good counter-example the rule should bless: leaf components take scoped
  scalars — SpringTrace.vue:37 (`response: number; dampingFraction: number`),
  SequencePlayhead.vue:15 (`progress: number`).

**Proposal.** One delivery grammar per scene module: the scene entry `provide()`s
its context under the scene key; every scene-family member that needs the whole
context `inject()`s it; **props are reserved for leaf-scoped data** (the
SpringTrace shape). The context interface is DECLARED (an explicit
`interface SpringDemoContext` in the keys file) and the composable returns it —
the API stops being a ReturnType accident. This is a scene-module clause of §9.

---

## §8 Finding — no typed slot contracts anywhere; naming grammar drift — MINOR

**Evidence.**
- `defineSlots` count across the entire demo: **zero** (full-tree grep). The
  slot-heaviest surfaces — EditorShell.vue (9 slot sites),
  AnimationControlsGroup.vue (4), ControlsPaneWrapper.vue (3), EditorHeader.vue
  (3) — expose undeclared, untyped slot APIs. Meanwhile the render-fn projection
  protocol IS typed (sceneExposedApi.ts:32–35 — `tabsContent`/`ribbonContent`
  (with `slotProps: { selectedControl: string }`)/`headerLeft`), so the exotic
  half of the slot system has a contract and the ordinary half doesn't.
- Naming drift: `AnimationControlsControls.vue` (a stutter),
  `AnimationControlsGroup` / `TransportDock` / `SquareInstrument.vue` /
  `SequenceScrubber` — four vocabularies (Controls, Transport, Instrument,
  Scrubber) for the one control-surface concept the state layer already names
  (facility / channels — sceneExposedApi.ts:20–23, `app/scene/sceneFacility.ts`);
  the `Kf` prefix appears on exactly one component (KfPillTabs).
- Barrel discipline drift: orbital-drag/index.ts defines ~100 lines of domain
  model inline (`TransformState`, `defaultTransformState`,
  `defaultTransformBounds`, `defaultVelocityState`) while a sibling `types.ts`
  exists — the barrel is a definition site, not a surface.

**Proposal.** (a) `defineSlots` becomes a mandatory member of the skeleton for
any slotted component — the slot API is declared where the prop API is.
(b) The restructure ratifies ONE component lexicon drawn from the already-won
state-layer vocabulary (facility, transport, channel, instrument, scene, target,
facet) in DESIGN.md, and the rename pass rides the file-move pass
(`AnimationControlsControls` → e.g. `TransportChannelControls`).
(c) Barrels are re-export-only — definitions live in named members
(orbital-drag's model moves into `types.ts`/`constants.ts`).

---

## §9 THE HOUSE COMPONENT MODULE SKELETON (the charterable standard)

The recursive colocation unit. `proof:colocation`'s header already states the
edict (proof-colocation.mjs:5–8); this section makes it a SHAPE.

### 9.1 The shape

```
<component-name>/                     # kebab-case dir = one component module
├── <ComponentName>.vue               # THE entry SFC. Present tense, PascalCase,
│                                     #   drawn from the ratified lexicon (§8b)
├── <ComponentName>.css               # scoped style sibling, wired
│                                     #   <style scoped src="./<ComponentName>.css">
│                                     #   MANDATORY once style > ~40L; else inline
├── <ComponentName>.skeleton.vue      # loading placeholder. MANDATORY iff the
│                                     #   module is delivered lazily (async barrel,
│                                     #   Suspense child, or loadingComponent seam);
│                                     #   a11y per SceneSkeleton (role=status,
│                                     #   aria-busy, reduced-motion static plate)
├── <sub-component>/                  # each private child that itself owns
│   └── …                             #   satellites is RECURSIVELY this shape
├── <SubLeaf>.vue                     # a satellite-less private child may stay flat
├── use<Concern>.ts                   # single-owner composables sit FLAT beside
│                                     #   their owner — no composables/ bin inside
│                                     #   a component module
├── types.ts                          # the module's declared contracts (context
│                                     #   interfaces DECLARED, never ReturnType-derived)
├── constants.ts                      # defaults/frozen data (never in the barrel)
└── index.ts                          # RE-EXPORT ONLY. Lazy (defineAsyncComponent
                                      #   { loader, loadingComponent: Skeleton,
                                      #   delay }) when the module is heavy;
                                      #   plain re-export otherwise. Types via
                                      #   `export type`. Zero definitions.
```

### 9.2 The placement rule (ownership, stated once)

A member lives at the **lowest directory containing all of its consumers**:

1. one consumer → flat beside that consumer (or inside the consumer's own module
   dir if the consumer is itself a module);
2. shared within one module → the module root (NOT a kind-bin);
3. shared across sibling modules → promoted exactly ONE level, into the
   nearest common ancestor's tier — which is the ONLY place kind-bins
   (`composables/`, `utils/`, `components/`) may exist, and only with
   ≥2-consumer members (the existing `proof:shared-has-n-consumers` bar);
4. shared across areas (instrument ↔ scenes ↔ app) → the `@/` shared tier,
   kind-appropriate per proof-colocation's CLAUSE (kind).

### 9.3 The API grammar (every member SFC)

- **Props:** reactive destructure with inline defaults; getter-fns into
  composables (KfPillTabs.vue:74–79 is the reference). No `withDefaults`, no
  runtime-object props.
- **Models:** every `update:*` channel is a `defineModel`. No manual
  `update:*` emits.
- **Emits:** named-tuple declaration; verb-first camelCase commands +
  past-participle facts (§4c).
- **Slots:** `defineSlots` on every slotted component.
- **Expose:** `defineExpose` only against a NAMED interface (the
  SceneExposedApi precedent, sceneExposedApi.ts:18).
- **Style:** per §6's three-tier rule.
- **Skeleton:** per §2 — wired by the module's own barrel.

### 9.4 Worked example — the timeline module, recut

Current (kind-binned, ownership inverted — §5 evidence):

```
instrument/timeline/
├── KeyframeTimeline.vue         ├── components/TimelineHoverPreview.vue
├── TimelineCaret.vue            ├── components/TimelineTrack.vue
├── CSSPasteDialog.vue           ├── composables/{useTimeline,useTimelineBuild,
├── timelineTypes.ts             │       useTimelineOps,useZoomPan}.ts
├── index.ts                     └── utils/{flattenVars,snapshotCapture,
                                         timelineEngine}.ts
```

Recut under the skeleton (every move justified by the §9.2 census — consumer
counts read from the tree, §5):

```
instrument/timeline/
├── KeyframeTimeline.vue              # the entry (295L → its inline style may split)
├── KeyframeTimeline.css              # (split at threshold)
├── KeyframeTimeline.skeleton.vue     # NEW — the Monaco-adjacent lazy pane gets a
│                                     #   placeholder; wired in index.ts (§2 cure)
├── useTimeline.ts                    # ← composables/ (owner: KeyframeTimeline)
├── useTimelineOps.ts                 # ← composables/ (sole consumer: useTimeline)
├── build/                            # the CSS build/export/import engine module
│   ├── useTimelineBuild.ts           # ← composables/
│   ├── timelineEngine.ts             # ← utils/ (sole consumer: useTimelineBuild)
│   ├── flattenVars.ts                # ← utils/
│   └── snapshotCapture.ts            # ← utils/
├── track/                            # TimelineTrack is a module — it owns satellites
│   ├── TimelineTrack.vue             # ← components/
│   ├── TimelineCaret.vue             # ← MODULE ROOT (sole consumer: TimelineTrack
│   │                                 #   — the inversion cured)
│   ├── useZoomPan.ts                 # ← composables/ (sole consumer: TimelineTrack)
│   └── TimelineHoverPreview.vue      # ← components/ (consumer: TimelineTrack)
├── CSSPasteDialog.vue                # stays flat: satellite-less leaf, sole
│                                     #   consumer is the entry (9.1 flat-leaf rule)
├── types.ts                          # ← timelineTypes.ts (named to the standard)
└── index.ts                          # lazy barrel + loadingComponent wiring
```

Zero kind-bins remain; every file's position states its ownership; the lazy seam
gained its skeleton. The same recut discharges: `transport/composables/`'s
single-owner members (§5), CopyButton (→ `copy-button/` module or flattened into
its consumers' tier with §3 grammar conversion), and the scenes (spring's 6
components + 6 composables flat → `target/`, `heatmap/`, `physics-facet/`
sub-modules as ownership dictates — the cube scene's matrix-editor/orbital-drag
shape generalized).

---

## §10 Gate posture (how the standard stays true)

The skeleton is enforceable by EXTENDING standing gates, not new apparatus —
consonant with U's CI-trim band:

- `proof:colocation` gains: (a) the inverse-colocate clause (single-owner member
  inside a shared tier → RED, §5); (b) the barrel-purity clause (definitions in
  index.ts → RED, §8c); (c) the skeleton clause (lazy barrel without
  loadingComponent → RED, §2).
- `proof:style-file-ceiling` gains the no-unscoped-css-in-module clause (§6).
- A single new static grammar check (or a clause of the above): no
  `withDefaults`, no object-literal defineProps, no manual `update:*` emits
  (§3/§4) — one AST pass, no browser.

---

## What U must charter

| # | Imperative |
|---|---|
| U-24.1 | Ratify §9 as THE house component module skeleton (shape 9.1 + placement rule 9.2 + API grammar 9.3) in DESIGN.md; all restructure move-waves cut to it. |
| U-24.2 | Complete T.F8 as the skeleton-tier clause: `<Name>.skeleton.vue` colocated per lazily-delivered module, wired via the module barrel's `loadingComponent`; delete `@/components/skeletons/` (SceneSkeleton re-homes to its sole consumer); give the Monaco panes (AnimationControls.vue:252–253) their skeletons. |
| U-24.3 | Converge prop declarations on reactive-destructure-with-inline-defaults; convert the withDefaults and runtime-object (CopyButton.vue:27) sites during their modules' moves; ban both grammars by gate. |
| U-24.4 | Converge emits: named-tuple declarations, `defineModel` for every `update:*` channel (TimelineTrack.vue:129, KfPillTabs.vue:67), ONE event-name grammar — the noun+Update family renames ride the restructure's import-touching moves. |
| U-24.5 | Dissolve the facility kind-bins per the ownership rule: single-owner members of `transport/composables/` (21 files) and `timeline/{components,composables,utils}/` colocate to their owners; multi-consumer members earn facility-tier seats; recut the timeline module per §9.4 as the reference implementation. |
| U-24.6 | Ratify the three-tier CSS rule: `<Name>.css` scoped sibling above ~40L; cross-component skins (`tab-trigger.css`, `playback-button.css`) leave component dirs for `@/styles/design-idioms.css` or the glass-ui upstream DESIGN.md already names. |
| U-24.7 | One context-delivery grammar per scene: provide/inject via the `<scene>Keys.ts` key for the scene context; props only for leaf-scoped scalars; declare context interfaces explicitly (kill the `ReturnType<typeof useSpringDemo>` implicit API). |
| U-24.8 | Mandate `defineSlots` on every slotted component and re-export-only barrels; ratify the component lexicon (facility/transport/channel/scene/target/facet) and rename the drifted names (`AnimationControlsControls`) during the moves. |
| U-24.9 | Extend `proof:colocation` + `proof:style-file-ceiling` with the §10 clauses so the skeleton is a STANDING gate, not a one-time move (the edict's own enforcement doctrine, proof-colocation.mjs:10–12). |
