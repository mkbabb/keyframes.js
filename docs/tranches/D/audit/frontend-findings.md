# D audit — frontend lane (decomposition · colocation · vueuse)

The demo is well-built — 100% `<script setup>`, idiomatic stores, real
colocation. This lane is not a rescue; it is a refinement. Five units crossed
the size seam where one concern stopped being one concern, one CSS→AST adapter
was copied into two files instead of shared, three already-pure utils sit in a
`composables/` dir that lies about their nature, and four in-component
timer/rAF blobs re-implement what vueuse already is. Every figure below is
`wc -l`/`grep`-verified against the live tree (paths under
`demo/@/components/custom/animation-controls/`), not the plan's prose —
**verified, not asserted.**

All findings land in **D.W1** (the demo decomposed). Net-deletion of
duplication; zero behaviour change is the wave's hard gate.

## Findings

| # | Finding | Evidence (file:line) | Severity | Wave |
|---|---|---|---|---|
| F1 | `AnimationControlsGroup.vue` — 552L; orchestrator + ribbon markup + rainbow SVG defs + layout math in one SFC | `AnimationControlsGroup.vue` (552L total) | High | D.W1 |
| F2 | `KeyframesEditor.vue` — 487L; frame-card list markup + highlight.js DOM driving + brush/progress in one SFC | `keyframes/KeyframesEditor.vue` (487L) | High | D.W1 |
| F3 | `useKeyframesEditor.ts` — 383L; CSS-string parsing + UI/stored-control state + debounced update mixed | `keyframes/composables/useKeyframesEditor.ts` (383L) | High | D.W1 |
| F4 | `KeyframeTimeline.vue` — 441L; expand/collapse + diamond drag + hover-canvas + inline edit + import/export | `timeline/KeyframeTimeline.vue` (441L) | High | D.W1 |
| F5 | `useTimeline.ts` — 251L; timeline state + keyframe CRUD + scrub + rebuild + CSS import/export in one composable | `timeline/composables/useTimeline.ts` (251L) | Medium | D.W1 |
| F6 | `parseCSSAnimationKeyframes` **duplicated** — same CSS→`{keyframes, options, values}` AST adapter in two files | `keyframes/KeyframesStringControls.vue:55`; `keyframes/composables/useKeyframesEditor.ts:27` (`parseAnimationCSS`) | High | D.W1 |
| F7 | Three **pure** modules mis-filed under `timeline/composables/` (zero Vue reactivity) | `timeline/composables/timelineEngine.ts` (95L), `snapshotCapture.ts` (62L), `flattenVars.ts` (33L) | Medium | D.W1 |
| F8 | In-component `setTimeout` debounce/hover blobs — hand-rolled, should be `useTimeoutFn` | `KeyframesStringControls.vue:100,119,120,241`; `composables/usePaneHover.ts:20,24,36`; `editor-shell/EditorHeader.vue:50,56,63` | Low | D.W1 |
| F9 | In-component `requestAnimationFrame` one-shot for capture-settle — should be `nextFrame`/`useRafFn` idiom | `timeline/composables/useTimeline.ts:206`; `matrix-editor/useTransformState.ts:205` | Low | D.W1 |

## F1–F5 — the oversized units (split seam + colocation target)

The size figures are exact (`wc -l`): 552 / 487 / 383 / 441 / 251 = 2114L across
five units. Each is over its seam not for sprawl but because two genuinely
separable concerns share one file. The split target per unit (colocation-friendly
sub-dirs `components/ composables/ constants/`, the demo's existing idiom — cf.
the already-split `animation-controls/composables/` and `stores/`):

- **F1 `AnimationControlsGroup.vue` (552L)** — three concerns: (a) the
  `AnimationGroup` orchestration (scrub-pause-resume already delegated to
  `useAnimationGroupPlayback`/`useAnimationProgress` — good), (b) the ribbon/menu
  markup, (c) the rainbow-gradient SVG `<defs>` (lines 184–190) + the mask-fade
  scoped CSS (lines 548–549). Seam → a `ControlsPaneWrapper` shell + a `RibbonBar`
  child + a `useControlsLayout` composable; the SVG `<defs>` move with the rainbow
  idiom (see the styling lane — they reference `var(--rainbow-*)`).
- **F2 `KeyframesEditor.vue` (487L)** — the per-frame card list (already factored
  to `KeyframeCard`) plus a large imperative highlight.js block (`highlightCSS`,
  lines ~411–441) that reaches into the global DOM (see the brittleness lane,
  F-pre). Seam → keep the editor shell; lift the highlight driving into a
  `useHighlightCSS`-adjacent composable owning a scoped ref set (the composable
  already exists at `keyframes/composables/useHighlightCSS.ts` — the editor's
  inline `highlight`/`setHighlightingString` should consolidate onto it).
- **F3 `useKeyframesEditor.ts` (383L)** — the parsing adapter (`parseAnimationCSS`,
  F6) + the stored-control/UI state + the debounced-update machinery. Seam →
  extract the parsing adapter to the shared `utils/` module (F6); the residue
  splits parsing-orchestration vs UI-state cleanly.
- **F4 `KeyframeTimeline.vue` (441L)** — already delegates zoom/pan to `useZoomPan`
  (109L) and caret to `TimelineCaret`. The residual mixes diamond-drag, the
  hover-canvas preview (html2canvas), inline CSS edit, and import/export markup.
  Seam → a `TimelineTrack` (diamonds + playhead) + a `TimelineHoverPreview` child;
  the import/export buttons are thin slot-fillers over `timelineEngine.ts` (F7).
- **F5 `useTimeline.ts` (251L)** — state + CRUD + scrub + rebuild + I/O. Seam →
  the ops (CRUD/scrub) vs the build (rebuild/import/export over `timelineEngine`)
  split the plan names; the build half is mostly thin wrapping of the
  already-pure `timeline/composables/{timelineEngine,snapshotCapture}.ts` (F7).

These are encapsulation refinements, not rewrites — each child is lifted from a
contiguous region of its parent.

## F6 — the duplicated CSS→AST adapter

Two files carry the same `parse CSS → resolveKeyframes → extractAnimationOptions →
non-`animation` declarations as values` adapter, near byte-for-byte:

- `KeyframesStringControls.vue:55` — `const parseCSSAnimationKeyframes = (input) => { … return { keyframes: resolved.keyframes, options, values }; }`
- `useKeyframesEditor.ts:27` — `const parseAnimationCSS = (input) => { … return { keyframes: resolved.keyframes, options, values }; }`

Bodies verified equivalent. The only divergence is the anonymous-wrap guard in
`useKeyframesEditor.ts:28–31`
(`/@keyframes\b/i.test(input) ? input : \`@keyframes anonymous {\\n${input}\\n}\``),
absent from the `KeyframesStringControls.vue` copy — i.e. the StringControls copy
silently assumes a full `@keyframes` block and the Editor copy tolerates a bare
declaration list. That divergence is itself a latent inconsistency: the two
callsites parse the same surface with different leniency.

**Colocation target:** one pure `keyframes/utils/parseAnimationCSS.ts` exporting
the wrap-tolerant superset; both callsites import it. The non-animation `values`
loop and the option extraction live there once. This is the F3 parsing-extraction
seam and the F6 dedup in one move — the duplicate is the symptom, the shared
`utils/` module is the home.

## F7 — the mis-filed pure utils

`timeline/composables/` holds three modules with **zero** Vue surface — no
`from "vue"`, no `ref`/`reactive`/`computed`/`watch`/`onMounted`,
no `getCurrentInstance` (verified by grep, each returns "none — pure"):

- `timelineEngine.ts` (95L) — `buildAnimationFromTimeline` / `exportTimelineToCSS`
  / `importCSSToTimeline`; imports only `@mkbabb/value.js`, `@src/animation/*`,
  and the local pure siblings.
- `snapshotCapture.ts` (62L) — `captureSnapshot`; reads `getComputedStyle`, no
  reactivity.
- `flattenVars.ts` (33L) — `flattenVars`; a pure recursive object flattener.

(`timelineTypes.ts` 36L is types-only; `useZoomPan.ts` 109L IS a real composable —
both stay.) A `composables/` dir naming pure functions misleads the reader about
their nature and their test surface.

**Colocation target:** `timeline/utils/{timelineEngine,snapshotCapture,flattenVars}.ts`
— mirroring the demo's own convention that pure helpers live in `utils/`
(cf. `matrix-editor/transformMath.ts`, `controls/composables/timingCurveUtils.ts`
is the one remaining mis-file of the same shape — pure, named a composable —
noted for the same move). The import sites in `useTimeline.ts` / `KeyframeTimeline.vue`
update; no behaviour changes.

## F8/F9 — the timer/rAF blobs that should be vueuse

The demo already standardizes on vueuse and on the engine's own `RAFPlayback`
(via `useRafLoop`, 59L, a thin reactive skin). The residual hand-rolls:

- **`setTimeout` debounces/hover-intent** (F8) — `KeyframesStringControls.vue`
  (the 300ms format-flag, lines 100/119/120/241), `usePaneHover.ts` (the hover
  timer, lines 20/24/36), `EditorHeader.vue` (the hover-out timer, lines 50/56/63).
  Each manually declares a `ReturnType<typeof setTimeout>` handle and clears it on
  re-entry/unmount. `@vueuse/core`'s `useTimeoutFn`/`useDebounceFn` own the
  handle + the auto-cleanup; the manual bookkeeping deletes.
- **one-shot `requestAnimationFrame`** (F9) — `useTimeline.ts:206`
  (`await new Promise((resolve) => requestAnimationFrame(() => resolve()))` to let
  a scrub paint before html2canvas) and `useTransformState.ts:205` (a
  schedule-once-per-frame guard around `updateTransformations`). The first is a
  `nextFrame()` await; the second is `useRafFn` with `immediate:false` or a
  single-flight guard idiom. Both stay correct; the boilerplate shrinks.

These are **Low** — correctness is intact; the win is one idiom, not five
hand-rolls. (`app/scenes/AmigaScene.vue:102,111` keeps its own `requestAnimationFrame`
loop — it drives Three.js, outside the engine/vueuse surface; not in scope.)

## Verification (re-runnable)

```sh
cd demo
# F1–F5 — the size seam (exact, > the plan's prose):
wc -l @/components/custom/animation-controls/AnimationControlsGroup.vue \
      @/components/custom/animation-controls/keyframes/KeyframesEditor.vue \
      @/components/custom/animation-controls/keyframes/composables/useKeyframesEditor.ts \
      @/components/custom/animation-controls/timeline/KeyframeTimeline.vue \
      @/components/custom/animation-controls/timeline/composables/useTimeline.ts
# F6 — the duplicate adapter (two parse sites, same body):
grep -rn "parseCSSAnimationKeyframes\|parseAnimationCSS" @/components/custom/animation-controls/keyframes
# F7 — purity (each prints "none — pure"):
grep -L 'from "vue"' \
  @/components/custom/animation-controls/timeline/composables/{timelineEngine,snapshotCapture,flattenVars}.ts
# F8/F9 — timer/rAF blobs (src only, excludes dist):
grep -rn "setTimeout\|requestAnimationFrame" --include="*.vue" --include="*.ts" @/ | grep -v "/dist/"
```

**Hard gate for D.W1** — `proof:decompose`: a checked-in instrument asserting
(a) every renamed/extracted child is imported from exactly one parent (no orphan
re-exports), (b) `grep parseCSSAnimationKeyframes\|parseAnimationCSS` resolves to
a single `utils/` definition (the duplicate is GONE, count = 1 def + N imports),
(c) `timeline/composables/` contains no module lacking a Vue import (purity moved
to `utils/`), and (d) `npm test` is byte-for-byte green pre/post (zero behaviour
change). The gate reddens if any extracted seam re-introduces a second
`parseAnimationCSS` body or leaves a pure module in `composables/`.
