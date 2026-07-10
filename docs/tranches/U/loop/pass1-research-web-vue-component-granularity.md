# Pass 1 Research — web-vue-component-granularity

Lane: `web-vue-component-granularity` (owner 5-step loop, step 1, pass 1).
Scope: Vue 3.5+ component-module granularity norms — SFC size, sub-component
extraction, composable extraction vs premature fragmentation,
`defineAsyncComponent` seam placement, `<script setup>` organization. Web-cited
rules, then grounded against the demo tree so the synthesis (step 2) can rule
per-module under OD-U16 (granularity, BOTH directions).

---

## 1. SFC size — there is NO line-count law; the axis is responsibility/comprehension

The consistent finding across every authoritative source: **no numeric line
limit exists; the split trigger is single-responsibility and comprehension, not
size.**

- Vue's own docs frame SFC splitting as a *tooling* affair (`<script src>` /
  `<template src>` external blocks) once a file "becomes overwhelming," never a
  line count — <https://vuejs.org/guide/scaling-up/sfc.html>.
- Michael Thiessen (12 Design Patterns in Vue): *"What's 'too long'… It's when
  it becomes too hard to understand"* — the determinant is comprehension, not
  length. His **Hidden Components** heuristic is the concrete, cite-able split
  signal: *"if different sets of properties are used together exclusively, it
  indicates potential for component division"* —
  <https://michaelnthiessen.com/12-design-patterns-vue>.
- The vue-best-practices skill corpus gives the practical trigger list: split
  when a component **owns both orchestration/state AND substantial presentational
  markup for multiple sections**, has **3+ distinct UI sections** (form / filters
  / list / footer), or **a template block repeats or could become reusable** (item
  rows, cards, list entries) — <https://skills.sh/hyf0/vue-skills/vue-best-practices>.

**Rule shape:** extract a sub-component when a template region is (a) reused, or
(b) exclusively driven by a distinct prop cluster, or (c) one of ≥3 independent
sections in a file that also carries orchestration. Size alone never triggers a
split, and never blocks one.

## 2. Sub-component: own file vs inline `<template>` region

- Prefer **many small components + composables over one "mega component"**; allow
  a single-file all-inline implementation *only* for throwaway demos, and then
  justify why splitting is unnecessary —
  <https://skills.sh/hyf0/vue-skills/vue-best-practices>,
  <https://delvingdeveloper.com/posts/vuejs-sfc-structure-practices>.
- BUT a region that is **used once, has no independent prop cluster, and shares
  the parent's reactive state** should stay inline — pulling it into a child file
  only manufactures a props/emits contract (prop-drilling + event plumbing) with
  no reuse payoff. This is the presentational-only counter-force to §1: a child
  file earns itself with a *contract that pays for itself* (reuse or a clean
  data-down/events-up boundary), not with markup volume.

## 3. Composable extraction — the anti-premature-fragmentation bound

The strongest, most-cited threshold in the corpus, and the one directly serving
OD-U16's "absurdly small modules abrogated for superfluity":

- **The extraction trigger is REUSE, not size:** *"Move a composable to its own
  file once you reuse it across components"* — alexop, Inline Vue Composables
  Refactoring — <https://alexop.dev/posts/inline-vue-composables-refactoring/>.
  Before that, use the **inline composable** pattern: group related state /
  watchers / async logic into a well-named function *inside* `<script setup>`
  (the `<script setup>` RFC explicitly sanctions local composables using
  `watch`/`computed`/`onMounted`). Extraction to a file is the *second*
  refactoring step, reached only when reuse or unit-test-in-isolation demands it.
- **Soft readability gut-check:** extract when the composable logic makes the
  `.vue` hard to navigate — *"somewhere around 50+ lines of composable logic is a
  reasonable gut check"* — but this is a nudge to *inline-group first*, not a
  mandate to make a file —
  <https://vuejs.org/guide/reusability/composables.html>.
- **State vs logic distinction (decides file-worthiness):** *only one component
  uses this state* → plain local `ref`/`reactive`, **no abstraction**;
  *reusable logic (not shared state)* → composable —
  <https://vueschool.io/articles/vuejs-tutorials/composables-vs-provide-inject-vs-pinia-when-to-use-what/>.
- **Explicit anti-pattern:** premature/speculative extraction *"makes codebases
  harder to follow, not easier"*; avoid over-abstraction in hot list paths for
  performance — alexop (above), Cloudinary Vue Best Practices —
  <https://cloudinary.com/guides/web-performance/vue-best-practices>.

**Rule shape (the OD-U16 inline direction):** a single-use, single-consumer unit
of logic or a <~15-line helper should be an inline named function in
`<script setup>`, NOT a standalone module. A standalone composable file earns
itself with (a) ≥2 real consumers, or (b) a genuine need to unit-test it without
mounting a component, or (c) publishable/documentable reuse. A one-consumer
`useX.ts` of a handful of lines is exactly the "absurdly small module" to inline.

## 4. `defineAsyncComponent` seam placement

- **Routes are NOT async-component seams.** Route-level splitting uses dynamic
  `import()` in the router config; *do not* wrap route components in
  `defineAsyncComponent` — <https://v3-migration.vuejs.org/breaking-changes/async-components>,
  <https://oneuptime.com/blog/post/2026-01-24-vue-async-components/view>.
- **The correct seam is an expensive panel INSIDE a route** that isn't needed for
  first paint: *"tab panels, charts, editors, and admin-only tools that do not
  need to block the first render"* — the canonical example is a heavy code
  editor mounted only when its tab is shown —
  <https://oneuptime.com/blog/post/2026-01-24-vue-async-components/view>.
- **Measure, don't assume:** *"use async components for genuinely heavy UI…
  measure the impact instead of assuming every split improves performance. Avoid
  wrapping components unnecessarily"* — wrapping a light component adds a
  loading-state machine and a network round-trip for no gain.

This is the exact web-warrant for OD-U11's spirit (owner ask row 4: "each scene
should only bring in monaco when the keyframes editor is shown… we should not
have an inline monaco editor for spring"): the Monaco/keyframes editor is the
textbook `defineAsyncComponent` payload — a heavy, opt-in editor gated behind a
facet/tab — and scenes that never show it (cube/amiga/square) must not pull it
into their initial chunk.

## 5. `<script setup>` organization

Consensus canonical order — <https://alexop.dev/posts/mastering-vue-3-composables-a-comprehensive-style-guide/>,
<https://siriphonnot.medium.com/how-to-order-and-structure-the-features-in-a-composition-api-component-db0c43b4e5c1>:
1. imports → 2. `defineProps`/`defineEmits`/`defineModel` → 3. reactive state
(`ref`/`reactive`) → 4. `computed` → 5. functions/methods → 6. `watch` →
7. lifecycle hooks. For a long `<script setup>`, prepend a brief comment outline
of the major blocks; split cohesive chunks into **inline named composables early**
rather than dumping flat logic.

**Composable conventions to enforce as gates** (VueUse-derived —
<https://alexop.dev/posts/vueuse_composables_style_guide/>): named exports only
(no default — tree-shaking + honest imports); `use`-prefix; one clear
responsibility per composable; accept `MaybeRefOrGetter<T>` + normalize with
`toValue()`; return an object of refs (tuple only when order matters);
auto-cleanup side effects (`tryOnCleanup`); `shallowRef` for primitives /
wholesale-replaced objects, deep `ref` only for in-place nested mutation.

## 6. Vue 3.5+ features that change the granularity calculus

- **Reactive Props Destructure (stable in 3.5)** — destructure `defineProps`
  with defaults directly; lowers the friction of splitting into child components
  because the child's prop surface is cheaper to declare —
  <https://blog.vuejs.org/posts/vue-3-5>.
- **`useTemplateRef()`** — template refs now work *inside composables*, so
  DOM-touching logic can be extracted to a composable without keeping it inline
  purely to reach a `ref`. This raises the ceiling for legitimate composable
  extraction of DOM/animation logic (directly relevant to the scene rAF/target
  composables) — <https://blog.vuejs.org/posts/vue-3-5>.
- **`useId()`** — stable IDs for a11y wiring, replaces hand-rolled id
  composables/props (candidate inlines).
- **`defineModel<T>({ required: true })`** returns `Ref<T>` (not `T|undefined`) —
  removes boilerplate two-way-binding composables.

---

## Codebase grounding (evidence for the step-2 per-module rulings)

The demo has 58 SFCs, 12,094 SFC lines total. Concrete granularity smells the
rules above flag:

**Over-fragmentation / stutter-naming (carve-the-wrong-way smell):** the transport
control family is split into a stuttering trio — `AnimationControls.vue` (456 L),
`AnimationControlsControls.vue` (432 L), `AnimationControlsGroup.vue` (334 L)
under `demo/@/components/custom/instrument/transport/`. "ControlsControls" is a
name that betrays a split made on volume, not on a responsibility boundary (§1) —
a prime step-2 re-carve-or-merge target.

**Redundant nesting:** cohesive zone dirs each re-nest a `components/`
subdirectory — `instrument/transport/components/`,
`instrument/timeline/components/`, `instrument/keyframes/components/`. A
`components/` dir *inside* a component dir is the shadcn-`@/`-vestige pattern the
owner is dissolving (OD-U2, ask rows 3–4); the grand-colocation edict wants
recursive colocation, not a redundant taxonomy layer.

**Inline candidates (OD-U16 small-module direction):** `demo/@/composables/` holds
four tiny single-purpose composables — `useDoubleTap.ts`, `useDragScrub.ts`,
`useThrottledReadout.ts`, `gestureSelectSuppression.ts`. Each must be assayed for
consumer-count: any with exactly one consumer and no isolation-test need is an
"absurdly small module" to inline per §3. `TimelineHoverPreview.vue` (38 L) is
the only sub-40-line SFC — check whether it has an independent prop cluster
(§2) before ruling keep vs inline.

**`defineAsyncComponent` seam — already correct at the route boundary, verify the
panel boundary:** scenes load via `defineAsyncComponent` in
`demo/app/scene/scenes.ts:106` (route-panel split — legitimate, these are heavy
scene payloads, not vue-router route components, so the async-wrap is the right
tool per §4). The open item the owner raised (ask row 4): confirm Monaco/keyframes
editor is itself an async seam *within* a scene facet so cube/amiga/square never
eager-load it — the `SpringPhysicsFacet.vue` / facet model
(`CubeScene.vue`, `SpringScene.vue`) is where that gate belongs.

---

## Rules/verdicts for the spec

1. **No line-count law.** Do not adopt a numeric SFC line ceiling as a gate. The
   split axis is single-responsibility + comprehension (Vue docs; Thiessen). Any
   "proof:sfc-max-lines"-style gate is overfit junk — reject it.
2. **Sub-component earns its own file only with a paying contract:** reuse, OR an
   exclusive prop cluster (Thiessen's Hidden Components), OR being one of ≥3
   independent sections in an orchestration-bearing file. A single-use,
   shared-state-only region stays an inline `<template>` region — a child file
   there only manufactures prop-drilling.
3. **Composable extraction trigger = REUSE (≥2 consumers) or isolation-test need,
   never speculation.** First step is an *inline named composable* in
   `<script setup>` (RFC-sanctioned); a standalone `useX.ts` file with one
   consumer and a handful of lines is the OD-U16 "absurdly small module" — inline
   and delete it. Single-consumer *state* is a plain `ref`, no abstraction.
4. **`defineAsyncComponent` belongs at the expensive-panel-within-a-route seam,
   never at the vue-router route seam (use dynamic `import()` there) and never
   around light components.** Monaco/keyframes-editor is the canonical async
   payload — gate it behind its facet so non-editor scenes don't eager-load it
   (serves owner ask row 4 / the dropped OD-U11 restated honestly).
5. **`<script setup>` canonical order** (imports → macros → state → computed →
   methods → watch → lifecycle) + inline-composable grouping for long blocks —
   adopt as an ordering convention, prettier-organize-imports already covers
   step 1.
6. **Composable house-style gates** (enforceable, cheap, non-overfit): named
   exports only, `use`-prefix, one responsibility, `MaybeRefOrGetter`+`toValue`
   inputs, object-of-refs return, `tryOnCleanup` side-effect disposal,
   `shallowRef` default for primitives. These are structural, not size-based.
7. **Exploit Vue 3.5 to shrink, not multiply, modules:** reactive props
   destructure (cheaper child prop surfaces), `useTemplateRef` (DOM logic can
   leave the SFC without staying inline-for-ref-access), `useId`/`defineModel`
   (delete hand-rolled id / v-model composables).
8. **Concrete step-2 targets flagged:** re-carve or merge the
   `AnimationControls*` stutter-trio on a real responsibility boundary; dissolve
   the redundant `*/components/` nesting layer (OD-U2 shadcn-vestige); assay the
   four `demo/@/composables/*` for single-consumer inlining; verify Monaco is an
   async facet seam.
