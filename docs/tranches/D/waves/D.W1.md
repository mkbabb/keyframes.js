# D.W1 — The demo decomposed (encapsulation · KISS)

The refinement wave. The demo is well-built — 100% `<script setup>`, idiomatic
stores, good colocation — but *un-refined*: five units are oversized at the
wrong seam, the keyframe-string parse adapter is *duplicated* (two bodies of one
function), three pure utils are mis-filed under `composables/`, and async
primitives are hand-rolled where a vueuse composable already is the thing. W1
decomposes the five units into colocated sub-components/sub-composables, dedups
the parse adapter to ONE pure module, re-homes the mis-filed utils, and
transposes the rAF/timeout blobs onto vueuse — **net-deletion of duplication,
zero behaviour change**. Grounds: `audit/frontend-findings.md` (the five
oversized units, the parse dup, the mis-filed utils, the rAF/timeout blobs —
each `wc`/`grep`-verified at W0).

## § Goal

The five oversized units are split at their natural seams into colocated
sub-units, each under a stated line ceiling; the parse adapter has exactly ONE
definition (a `utils/` pure module both call sites import); the three pure
timeline utils live under `timeline/utils/`, not `composables/`; the
in-component rAF/timeout blobs run on `useRafFn`/`useTimeoutFn`. Every change is
net-deletion (decomposition removes duplication, it does not add surface) and
behaviour-isomorphic (the demo gate suite + a component-render smoke stay
green). KISS: the smallest sub-unit boundary that makes each file legible — no
over-fragmentation, no premature abstraction. No legacy, no alias, no
behaviour drift.

## § Scope

### S1 — AnimationControlsGroup decomposed (552L → wrapper + ribbon + layout composable) — frontend 1

**What:** split `animation-controls/AnimationControlsGroup.vue` (552L) at its
two natural seams. The component is a layout shell wrapping a ribbon of
playback/transport controls; the pane-layout logic (sizing, the controls-open
state, the responsive collapse) is extractable. Split into a thin
`ControlsPaneWrapper` (the layout shell), a `RibbonBar` (the transport ribbon),
and a `useControlsLayout` composable (the sizing/open-state reactivity) under
the existing `animation-controls/{components,composables}/` sub-dirs. The
`!border-transparent` `!`-override the styling lane flags (a W2 concern) is left
in place here — W1 is structural only.

**Why:** 552L is the demo's largest component and conflates three concerns
(shell · ribbon · layout state). Splitting at the wrapper/ribbon/layout seam
makes each legible and brings the file under the ceiling. The seam is real —
the layout reactivity is a composable's shape, the ribbon is a child component's
shape — so the split is encapsulation, not file-shuffling. Seams:
`AnimationControlsGroup.vue` (the 552L source → wrapper),
`animation-controls/components/{RibbonBar}.vue` (new child),
`animation-controls/composables/useControlsLayout.ts` (new composable).

### S2 — KeyframesEditor + useKeyframesEditor decomposed + the parse adapter deduped (487L + 383L) — frontend 2/3

**What:** two coupled changes.
- **Split the parsing core from the UI.** `keyframes/KeyframesEditor.vue` (487L)
  and `keyframes/composables/useKeyframesEditor.ts` (383L) tangle the
  CSS-keyframes parsing/serialization with the editor UI state. Split the
  parsing concern (the AST adapter, the style-injection, the keyframe-string
  round-trip) from the UI concern (the editor panel, the tab state, the input
  handling) into colocated sub-composables under
  `keyframes/composables/` + sub-components under `keyframes/components/`.
- **Dedup `parseCSSAnimationKeyframes` → ONE pure `utils/` module.** The demo
  carries TWO bodies of the same adapter:
  `KeyframesStringControls.vue:55` `parseCSSAnimationKeyframes` and
  `useKeyframesEditor.ts:27` `parseAnimationCSS` — both
  `parseCSSStylesheet → resolveKeyframes → extractAnimationOptions → {keyframes,
  options, values}`. Extract ONE pure function into
  `keyframes/utils/parseAnimationCSS.ts` (the superset body — keep
  `useKeyframesEditor.ts:28`'s anonymous-`@keyframes` wrapper branch, which
  `KeyframesStringControls` lacks, so the single definition covers both call
  sites' inputs); both call sites import it; the two inline copies are DELETED.

**Why:** the parse adapter is real duplication (two functions, one behaviour) —
a future grammar change must touch both copies or drift. Deduping to one pure
module is net-deletion AND removes a drift class. Splitting the editor's
parsing-vs-UI seam brings both files under the ceiling. The pure-`utils/`
placement is correct: the adapter takes a string, returns a shape, touches no
reactivity. Seams: `KeyframesStringControls.vue:55-69` (delete the inline copy
→ import), `useKeyframesEditor.ts:27-44` (delete the inline copy → import),
`keyframes/utils/parseAnimationCSS.ts` (the ONE definition),
`keyframes/{components,composables}/` (the UI/parsing split).

### S3 — KeyframeTimeline + useTimeline decomposed + the timeline utils re-homed (441L + 251L) — frontend 4/5/6

**What:** two coupled changes.
- **Split the ops from the build.** `timeline/KeyframeTimeline.vue` (441L) and
  `timeline/composables/useTimeline.ts` (251L) conflate the track-rendering UI,
  the keyframe-ops (add/move/delete), and the timeline-build (the
  state→animation pipeline). Split into colocated sub-components
  (`timeline/components/`) + the ops/build sub-composables
  (`timeline/composables/`).
- **Re-home the mis-filed pure utils.** `timeline/composables/timelineEngine.ts`
  (95L), `snapshotCapture.ts` (62L), `flattenVars.ts` (33L) are plain functions
  — zero `ref(`/`reactive`/`watch`/`onMounted` (verified at W0). They are NOT
  composables. Move all three to `timeline/utils/` and fix the importers
  (`timelineEngine.ts:12` already imports `flattenVars` by relative path — the
  move keeps them adjacent).

**Why:** the 441L/251L pair has the same parsing-vs-UI shape as S2 (here:
ops-vs-build-vs-render). The mis-filing is a correctness-of-vocabulary issue: a
`composables/` file that is a pure function lies about its contract — re-homing
to `utils/` makes the directory tree honest (composables own reactivity; utils
are pure). Seams: `KeyframeTimeline.vue` (441L → render + ops split),
`useTimeline.ts` (251L → ops/build split),
`timeline/composables/{timelineEngine,snapshotCapture,flattenVars}.ts` →
`timeline/utils/` (the move + importer fixes).

### S4 — The rAF/timeout blobs transposed onto vueuse — frontend 7

**What:** replace the three hand-rolled async primitives with their vueuse
equivalents.
- `useTimeline.ts:206` `requestAnimationFrame(() => resolve())` (a one-shot
  next-frame await) → `useRafFn` (or `nextFrame` from vueuse) with the lifecycle
  cleanup vueuse provides.
- `KeyframesStringControls.vue:100/120` the `formattingTimeoutId` +
  `setTimeout(() => { isFormatting.value = false; }, 300)` debounce-reset →
  `useTimeoutFn` (auto-cleanup on unmount, `start`/`stop` handles).
- `composables/usePaneHover.ts:20/36` the `hoverTimer` `setTimeout` →
  `useTimeoutFn`.

**Why:** the hand-rolled rAF/timeout blobs leak on unmount (no cleanup), carry
manual id-bookkeeping, and re-implement what vueuse already is — the same inv ζ
"do not hand-roll what a shipped engine is" discipline C applied to the
*animation* rAF loops, here applied to the *demo-utility* async primitives.
vueuse handles the lifecycle (`tryOnScopeDispose`), so the transposition is
net-deletion + a leak-fix. Seams: `useTimeline.ts:206`,
`KeyframesStringControls.vue:100/120`, `usePaneHover.ts:20/36`.

## § Hard gate — `proof:decomposition`

A re-runnable instrument (`scripts/proof-decomposition.mjs`, or the equivalent
CI step) that BITES on every regression:

- **No demo component/composable exceeds its line ceiling.** `wc -l` over the
  demo tree (`demo/@/components/custom/**/*.{vue,ts}`) — every file ≤ the stated
  ceiling (**350L for `.vue` components, 250L for `.ts` composables**, the
  ceiling D.W1 establishes). The five W0-flagged units (552/487/441/383/251)
  each drop under it. Re-adding a 400L component reddens the gate.
- **The parse adapter has exactly ONE definition.**
  `grep -rn 'parseCSSStylesheet.*resolveKeyframes\|export.*parseAnimationCSS'
  demo/` finds ONE `parseAnimationCSS` body (the `keyframes/utils/` module); the
  two inline copies (`KeyframesStringControls.vue:55`, `useKeyframesEditor.ts:27`)
  are GONE — both call sites import the single definition. Re-inlining a second
  copy reddens the gate.
- **The mis-filed utils are re-homed.**
  `test ! -f demo/@/components/custom/animation-controls/timeline/composables/timelineEngine.ts`
  (and `snapshotCapture.ts`, `flattenVars.ts`) — the three pure functions live
  under `timeline/utils/`; `grep` finds zero `ref(`/`watch(`/`onMounted(` in any
  `timeline/utils/*.ts`.
- **The rAF/timeout blobs are gone.**
  `grep -rn 'requestAnimationFrame\|setTimeout\|setInterval' demo/@/components/custom/`
  returns ZERO matches in the four W0-flagged sites (the demo's hand-rolled
  async primitives run on `useRafFn`/`useTimeoutFn`); the vueuse imports are
  present.
- **Zero behaviour change.** The demo gate suite (`demo-smoke` / `occlusion` /
  `lighthouse` / `proof:dogfood`) stays green, AND a component-render smoke
  (mount each decomposed root + its new children in jsdom, assert no throw +
  the parse adapter round-trips one fixture) passes. The capture harness AFTER
  is pixel-identical to BEFORE (decomposition is structural — `audit/DELTA.md`
  records no intended pixel change for W1).
- **Net-deletion of duplication.** The W1 diff is net-negative on the demo's
  custom-component LOC (the dedup + the rAF/timeout transposition remove more
  than the sub-unit scaffolding adds); `git diff --stat` shows a net `-` on the
  decomposed files' aggregate.

Every clause is a `wc`/`grep`/test instrument that reddens on its negative case
— verified not asserted.

## § Folds

Retires: frontend-1 (AnimationControlsGroup 552L → S1); frontend-2/3
(KeyframesEditor 487L + useKeyframesEditor 383L + the parse dup → S2); frontend-4/5/6
(KeyframeTimeline 441L + useTimeline 251L + the mis-filed timeline utils → S3);
frontend-7 (the rAF/timeout blobs → S4). The `parseCSSAnimationKeyframes`
duplication (W0.1) closes here as ONE pure module.

NOT retired here (named, routed): the `!border-transparent` `!`-override on
AnimationControlsGroup + any arbitrary-value tailwind on the decomposed units →
D.W2 (the styling lane); the brittle selectors any decomposed component still
carries → D.W3.

## § Design decisions

1. **Decompose at the natural seam, not to a number.** RESOLVED: the ceiling
   (350L `.vue` / 250L `.ts`) is the *forcing function*, but the split follows
   the real concern boundary (shell/ribbon/layout; parse/UI; ops/build/render),
   not an arbitrary line-cut. KISS — the smallest legible sub-unit, no
   over-fragmentation, no premature abstraction. A unit that is genuinely one
   cohesive concern under the ceiling is NOT split.
2. **The parse adapter is ONE pure module — the superset body.** RESOLVED:
   `useKeyframesEditor.ts:28`'s anonymous-`@keyframes` wrapper branch is the
   superset (`KeyframesStringControls` always receives a full stylesheet); the
   ONE definition keeps the wrapper so both call sites' inputs are covered. Pure
   placement (`keyframes/utils/`) because the function touches no reactivity. No
   alias re-export of the old names — both call sites import the canonical name.
3. **`composables/` means reactivity; `utils/` means pure.** RESOLVED: the
   three mis-filed timeline files are plain functions, so they move to
   `utils/`. The directory vocabulary becomes honest — a precondition for the
   `proof:decomposition` grep (a `composables/` file with no `ref(` is a
   mis-file the gate can catch in future).
4. **vueuse owns the async lifecycle.** RESOLVED: the hand-rolled rAF/timeout
   blobs leak on unmount; `useRafFn`/`useTimeoutFn` provide
   `tryOnScopeDispose` cleanup. The transposition is the inv ζ discipline
   (do-not-hand-roll-what-a-shipped-engine-is) applied to demo-utility async
   primitives — net-deletion + a leak-fix, zero behaviour change.
5. **Structural only — styling + brittleness route to W2/W3.** RESOLVED: W1
   does not touch the `!`-overrides, arbitrary values, or brittle selectors the
   decomposed units carry — those are W2/W3 lanes (file-disjoint where possible,
   sequenced where the same file is touched). W1's pixel-isomorphism is the
   `proof:decomposition` zero-behaviour-change clause.
