# Lane 18 — demo/instrument (keyframes · timeline · shell) + @/state

**Fleet:** Tranche U development audit (32 lanes) · **Scope:** DEVELOPMENT ONLY (corpus, no impl)
**Charter:** deep-read `instrument/keyframes/` (Monaco editor family), `instrument/timeline/`
(KeyframeTimeline + composables + utils), `instrument/shell/` (EditorShell family + eggs), and
`@/state/` (sceneMachine, controlSurfaceDFA, stores, hashSharing). Recursive-colocation targets,
long-file carves, Monaco lazy-chunk discipline, whether `@/state` is honestly global, legacy residue.

The editors carry the oldest demo code and the residue shows: **three divergent CSS-keyframe
authoring surfaces with three parse/serialize paths**, a **shell peer that conflates editor chrome
with app home-hero pieces and a fully-dead component**, and **store-model + easter-egg duplication**
that the S.D2/T.F5/T.F6 colocation waves cohered structurally but never fused semantically.

Standing gates in the area are GREEN (`proof:colocation` PASS w/ 2 deferred residuals;
`proof:no-dead-export` PASS w/ 26 deferred rows; `proof:no-orphan-module` PASS;
`proof:control-surface-single-writer` PASS) — but the owner's **NO MORE DEFERRALS** edict makes
those carried deferrals U's to close, and the green masks the semantic duplication below (the
gates answer local shape predicates, not "is there one keyframe-authoring core?").

---

## Findings

### F1 (MAJOR · correctness/legacy) — THREE CSS-keyframe authoring cores, three parse/serialize paths

There are three surfaces that each parse CSS `@keyframes` into the live animation and serialize it
back, and **each rolls its own path**:

1. **`keyframes/KeyframesStringControls.vue`** (309L, the Monaco editor — the ONLY editor
   `AnimationControls.vue:137` mounts). It re-implements serialize+parse INLINE:
   `updateCSSAnimationKeyframesStringFromAnimation` (KeyframesStringControls.vue:100-125),
   `onEditorChange` (:163-209), `syncStoredOptionsFromAnimation` (:144-161). **It does not use
   `useKeyframesEditor`/`useKeyframesParsing`/`useKeyframeOps` at all** — the very composable trio
   (keyframes/composables/) that its sibling card editor was carved into at S.D2.
2. **`keyframes/KeyframesEditor.vue`** (291L, the per-stop card editor, mounted by the spring
   scene) — the one that DOES consume the composable trio (`useKeyframesEditor.ts` →
   `useKeyframesState`+`useKeyframesParsing`+`useKeyframeOps`).
3. **`timeline/KeyframeTimeline.vue`** — its inline keyframe editor **hand-parses CSS
   declarations with raw string splitting** on `:` and `;` (KeyframeTimeline.vue:229-248,
   `onKeyframeCSSChange`), instead of value.js's `parseCSSValueUnit`/`parseAnimationCSS` that (1)
   and (2) both route through.

So the same "CSS text ⇄ animation" fact has three implementations, one of which (the Monaco editor,
the primary surface) is the legacy monolith the composable extraction never reached, and one of
which (timeline) is a brittle hand-parser.

**Evidence:** KeyframesStringControls.vue:100-209 (inline) vs useKeyframesParsing.ts:30-63 +
useKeyframeOps.ts:44-176 (the composable core); KeyframeTimeline.vue:229-248 (string-split parser);
AnimationControls.vue:137 mounts only StringControls.

**Proposal (gestalt):** Elevate `useKeyframesEditor` (the state+parsing+ops trio) to the **single
keyframe-authoring core** and drive ALL THREE surfaces from it — the Monaco string editor, the card
editor, and the timeline inline editor become thin views over one `animation ⇄ CSS` engine. Delete
KeyframesStringControls' inline `updateCSS…`/`onEditorChange`/`syncStoredOptions` and the timeline's
`onKeyframeCSSChange` string-splitter; both become `core.updateFromString(...)` calls. This is the
architectural transposition the S.D2 carve started and stopped halfway.

### F2 (MAJOR · colocation/legacy) — `shell/` conflates editor chrome + app home-hero + a dead component

`instrument/shell/` is billed as "the EditorShell chrome" but its 10 files are three unrelated
tenants:

- **Editor chrome** (cohesive): EditorShell.vue, EditorStartScreen.vue, SharePopover.vue,
  KeyboardShortcutsModal.vue, useShareState.ts.
- **App home-hero pieces** consumed by `app/App.vue`, NOT by EditorShell: **HeroAurora.vue**
  (app/App.vue:44,139), and AnimatedText.vue + TypingDots.vue (imported only by
  EditorStartScreen.vue — home-screen typing effect). These are the app's landing-page identity, not
  the shared editor facility.
- **Fully dead:** **EditorHeader.vue** (108L) — **zero importers anywhere in the repo**; it is only
  re-exported by shell/index.ts:2, and that barrel re-export is what hides it from
  `proof:no-dead-export` (the barrel is consumed for OTHER symbols, so the gate scores EditorHeader
  "used"). A collapsible header-ribbon component orphaned by a prior chrome rework.

**Evidence:** `grep -rn EditorHeader` → only shell/EditorHeader.vue + shell/index.ts (no consumer);
HeroAurora importer = app/App.vue:139; AnimatedText/TypingDots importers = EditorStartScreen.vue
only; shell/index.ts:1-4.

**Proposal (gestalt):** (a) **Delete EditorHeader.vue** and its barrel line — no legacy code. (b)
Move the home-hero trio (HeroAurora, and the AnimatedText/TypingDots pair) OUT of the shared
instrument facility and colocate them under `app/` beside App.vue (the home hero is an app-shell
concern, one consumer). (c) `shell/` then holds only the genuine editor chrome. This makes the peer
name honest and removes the cross-owner reach (a shared-library facility currently owning the app's
landing identity).

### F3 (MAJOR · colocation) — `shell/` is FLAT while its sibling peers are tiered

`keyframes/` and `timeline/` each carry `components/` + `composables/` (+ `utils/`) sub-tiers per the
GRAND COLOCATION EDICT; **`shell/` is flat** — sub-components (AnimatedText, TypingDots,
KeyboardShortcutsModal) and the `useShareState.ts` composable sit at the module root beside
EditorShell.vue. `proof:colocation`'s "satellite colocation" clause fires on a `use*.ts` flat at a
root that already sub-folders `composables/`; shell escapes only because it has NO `composables/`
tier yet — a structural gap, not compliance.

**Evidence:** `ls shell/` (flat, 10 files, no subdirs) vs keyframes/{components,composables,utils}
+ timeline/{components,composables,utils}.

**Proposal:** After F2's split, give the residual editor-chrome shell a `components/`
(KeyboardShortcutsModal, EditorStartScreen, SharePopover) + `composables/` (useShareState) tier so
it matches its peers. Enforced by extending `proof:colocation` to require the tier once a peer has
≥1 sub-component AND ≥1 composable (today it only fires on the flat-satellite direction).

### F4 (MAJOR · efficiency/duplication) — `applyCSS` + paintbrush easter-egg duplicated across the two editors

Both keyframe editors carry a near-identical `applyCSSStyles()` that toggles `useApplyCSS` and
plays/pauses a hand-built paintbrush `CSSKeyframesAnimation`, with **divergent class-name
derivation**: KeyframesStringControls uses `getClassName: () => getTmpAnimationName()`
(KeyframesStringControls.vue:214) while KeyframesEditor uses `getClassName: () => keyframesStyleId`
(KeyframesEditor.vue:235). Two brush animations (`paintbrushStroke` vs `paintbrushWipe`) and two
apply-toggle wirings for one behavior.

**Evidence:** KeyframesStringControls.vue:211-249 vs KeyframesEditor.vue:231-290; useApplyCSS.ts is
the shared codec but the toggle+brush wrapper is copy-pasted, not.

**Proposal:** Fold the apply-toggle-plus-brush into a single `useKeyframeBrushApply(animation,
opts)` composable in `keyframes/composables/` that owns BOTH the `useApplyCSS` wiring and the brush
lifecycle, and settle ONE class-name derivation (the divergence is a latent apply-collision bug when
both editors mount against the same animation). Both editors call it; the paintbrush stays one asset.

### F5 (MAJOR · legacy/model) — `selectedKeyframesControl` is duplicated in the store (two authorities, divergent defaults, component-seeded)

`StoredAnimationGroupControlOptions` declares `selectedKeyframesControl: string` at the TOP level
(controlOptionsStore.ts:18, default `"string"` at :39) **and again nested inside `keyframeControls`**
(controlOptionsStore.ts:20-25). The nested copy's default (`"keyframes"`) is set **by a component**
— `KeyframesStringControls.vue:71-80` hand-seeds `defaultKeyframeControls` and does
`storedControls.keyframeControls ??= defaultKeyframeControls`, i.e. a UI component owns the store's
optional sub-shape (altitude inversion, the mirror of the a24-F2 concern the state barrel was cured
of). Since `AnimationControls.vue` only ever mounts the string editor, the top-level string/card
toggle these fields drive is largely vestigial.

**Evidence:** controlOptionsStore.ts:18 + :20-25 + :39; KeyframesStringControls.vue:71-80.

**Proposal:** Collapse to ONE authority. The store module owns the full default (including any
`keyframeControls` shape) — no component `??=` seeding. If the string/card toggle is dead (only
StringControls mounts), delete the field entirely; if it is meant to survive, host it once at the top
level and delete the nested duplicate. NO component-seeded store shape.

### F6 (MINOR · legacy/brittleness) — the `Ï` magic-char format shortcut, hardcoded in three files

The macOS Option+Shift+F composed keycode `Ï` is hardcoded as the "format CSS" hotkey in
KeyframesEditor.vue:190, KeyframesStringControls.vue:135, and KeyframesAddDialog.vue — a
platform-brittle magic character (breaks on non-Mac layouts; invisible in review) that bypasses
glass-ui's `registerShortcut` registry every other shortcut in the demo uses.

**Evidence:** `grep -rln $'Ï'` → the three keyframes files.

**Proposal:** Route "format" through `registerShortcut` from `@mkbabb/glass-ui/keyboard` (as
EditorShell.vue:190 already does for `?`), with a named, discoverable binding — no raw composed-key
comparison.

### F7 (MINOR · colocation) — `CSSCodeEditor` (Monaco wrapper) is a facility-shared leaf homed inside one peer

`timeline/KeyframeTimeline.vue:156` statically imports `../keyframes/CSSCodeEditor.vue` — the Monaco
wrapper is consumed by BOTH `keyframes/` and `timeline/` peers but lives inside `keyframes/`, so the
timeline peer reaches across a sibling boundary into another peer's internals (not through its
barrel).

**Evidence:** KeyframeTimeline.vue:156 (`../keyframes/CSSCodeEditor.vue`);
KeyframesStringControls.vue:53 (`./CSSCodeEditor.vue`).

**Proposal:** Hoist `CSSCodeEditor.vue` (+ its `monaco-themes/`) to a facility-level shared leaf at
`instrument/` (a `monaco/` or `code-editor/` member), re-exported lazily from `instrument/index.ts`,
so both peers consume the shared Monaco primitive through one boundary. The lazy-chunk split stays
correct (both consumers already ride `defineAsyncComponent` barrels — Monaco discipline is otherwise
sound: keyframes/index.ts + timeline/index.ts both `defineAsyncComponent`).

### F8 (MINOR · state discipline) — `hashSharing` is a second, undisciplined writer into the option stores

`restoreStateFromParam` does `Object.assign(useAnimationGroupsOptionsStore().value, state.options)`
(hashSharing.ts:59-67), writing the option stores directly — outside the single-writer / DFA
discipline the rest of `@/state` enforces (useSceneMachine's MED-4 mutation boundary). It also
shares `options`+`controls` but ignores the scene-machine `perScene` playback snapshots, so a shared
URL restores control state but not playback position — an honest-but-undocumented asymmetry. `@/state`
is otherwise honestly global (the machine, the two option stores, storeUtils are true global state).

**Evidence:** hashSharing.ts:20-27 (getAllState) + :51-72 (restore, direct Object.assign);
useSceneMachine.ts:9-14 (the boundary the option stores lack a hash-side equivalent of).

**Proposal:** Give the option stores a small `applySharedState(patch)` entry that validates + assigns
under the store's own authority, and have hashSharing call THAT rather than reach into `.value`. Note
the playback-position omission explicitly (or extend the share payload to carry the machine
snapshot). Low urgency, but it is the one seam where `@/state`'s write discipline leaks.

---

## Colocation verdict for `@/state`

`@/state` is **honestly global** for: `sceneMachine.ts` (pure reducer), `useSceneMachine.ts` (effect
layer), `scenePlaybackAdapters.ts`, `animationOptionsStore.ts`, `controlOptionsStore.ts`,
`storeUtils.ts`, `hashSharing.ts` — true cross-scene/global state, correctly hoisted at S.D2.

**One partial-colocatable seam:** `controlSurfaceDFA.ts` (309L) is two things fused — (a) the pure
control-surface DERIVATION (`surfacesFor`, `selectedSurfaceFrom`, the machine's third axis; genuinely
global, correctly here) and (b) **UI presentation of the dock** — `SURFACE_META` tab labels/icons
(controlSurfaceDFA.ts:145-160), `dockCardinality` select-vs-inline-vs-absent chrome logic (:266-309),
`ControlSurfaceTab` render descriptors. (b) is instrument/dock presentation living in the state layer.
It is shared by both the app dock and the transport, so it earns a shared home — but the honest split
is **derivation → `@/state`, tab-metadata/cardinality → the instrument facility**. Consider carving
`controlSurfaceDFA.ts` into a pure-state `controlSurfaces.ts` (the derivation) + a facility-level
`surfaceTabs.ts` (SURFACE_META + dockCardinality). Not a defect — a colocation refinement U may
charter.

---

## What U must charter

1. **Unify the keyframe-authoring core (F1):** one `useKeyframesEditor` engine drives all three
   surfaces (Monaco string editor, card editor, timeline inline); delete KeyframesStringControls'
   inline parse/serialize and the timeline's hand-rolled CSS string-splitter.
2. **Delete EditorHeader.vue (F2)** — dead, masked by a barrel re-export; drop its shell/index.ts line.
3. **Move the home-hero trio (HeroAurora/AnimatedText/TypingDots) out of the shared shell into
   `app/` (F2)** so `instrument/shell/` holds only editor chrome.
4. **Tier the residual `shell/` (F3):** give it `components/` + `composables/` to match keyframes/ &
   timeline/; extend `proof:colocation` to require the tier once a peer has sub-components + a composable.
5. **Fold apply+paintbrush into one `useKeyframeBrushApply` composable (F4)** and settle one
   apply class-name derivation.
6. **Collapse the duplicated `selectedKeyframesControl` store field to one store-owned authority
   (F5);** remove the component-seeded `keyframeControls` default; delete if the string/card toggle
   is vestigial.
7. **Retire the `Ï` magic-char format shortcut (F6)** in favor of glass-ui `registerShortcut`.
8. **Hoist `CSSCodeEditor` (+ monaco-themes) to an `instrument/`-level shared Monaco leaf (F7)** so
   timeline stops reaching into keyframes' internals.
9. **Give the option stores a disciplined `applySharedState` entry and route hashSharing through it
   (F8);** document/close the shared-URL playback-position omission.
10. **Close the carried deferrals in-area (NO MORE DEFERRALS):** the `proof:no-dead-export` rows and
    `proof:colocation` residuals touching instrument/state must ratchet to zero this tranche.
11. **Refine `controlSurfaceDFA.ts`:** split the pure derivation (stays in `@/state`) from the dock
    tab-metadata + cardinality presentation (moves to the instrument facility).
12. **Fix CLAUDE.md drift:** `demo/CLAUDE.md` lists `useHeroSourceEgg` in shell — the file no longer
    exists.
