# G.W7 — Vue idiom convergence (the template-ref + file-kind drift)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the demo surface — a Vue-idiom convergence; no
library/public-API surface; pixel- and behaviour-isomorphic, named-delta only:
declaration form + file location) · **Scope:** `demo/**` only — the 7 legacy
template-ref sites (`demo/app/scenes/CubeScene.vue`, `demo/playground/App.vue`,
`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue`,
`demo/@/components/custom/editor-shell/EditorShell.vue`,
`demo/@/components/custom/animation-controls/controls/AnimationControls.vue`,
`demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue`),
the `use*`-misnamed pure predicate (`demo/@/utils/useToastGuard.ts`), the two
pure modules under `composables/`
(`demo/@/components/custom/animation-controls/timeline/composables/timelineTypes.ts`,
`demo/@/components/custom/animation-controls/controls/composables/timingCurveUtils.ts`),
+ the gate script (`scripts/proof-decomposition.mjs` — extend its presence-grep
family with the new `proof:demo-template-refs` + the pure-`use*` detector clauses)
— ZERO library (`src/**`), test (beyond the gate), or CI edit · **DAG: independent
of Bands 0/1** (the re-pin `G.W2` touches no `demo/**` SFC source; runs in parallel)
— Band-4 sibling of `G.W8` (state) + `G.W9` (brittleness), file-disjoint from both ·
**Gated on:** keyframes' own green CI (inv-27).

**Title.** *The demo adopted `useTemplateRef` broadly (28 files) but the legacy
`ref<…>(null)` + `ref="…"` template-ref pattern survives in 7 sites — and in 2 files
it ships side-by-side with its own replacement. Two file-kind mislocations ride
along: a pure predicate wearing a `use*` name, and two pure modules filed under
`composables/`. Converge to ONE idiom in one motion; gate the convergence so the
old shape reds on re-introduction.*

This is the §Mandate's **"no deprecated path beside its replacement,"** expressed in
Vue idiom (`a-frontend-encapsulation §1`). It is the only frontend-encapsulation
finding that rises to a clean SHIP — the rest of the demo's encapsulation is
~90% ALREADY-SOTA (`a-frontend-encapsulation §6`: per-scene colocation, the
animation-controls 6-sub-dir concern tree, `injectionKeys.ts` typed keys,
`defineModel`/`toRef(()=>props.x)` adoption, no god-unit). The fix is to finish a
migration the demo already made everywhere else, and to lock the corners it reached
partway. NOT a restructure.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the convergence is to the SINGLE idiom
(`useTemplateRef`), not a half-migration that leaves the legacy shape as a tolerated
"alternative" — shipping both is exactly the legacy-shape the Mandate excises. NO
legacy: every converted site reads `.value` identically (the legacy `ref<…>(null)` +
`ref="x"` and `useTemplateRef("x")` expose the same ref surface), so there is no
second spelling of the same access. KISS · DRY: ONE template-ref idiom, ONE file-kind
rule (composables consume reactivity/lifecycle; pure modules live in `utils/` or as
`*Types.ts`). Measure-first does NOT bind (this is an idiom-correctness convergence,
not a perf claim) — the gate is a falsifiable presence-grep, not a bench. Isomorphic:
named delta only — the declaration form changes and two files move; every render path,
every `.value` read, every `defineExpose` of these refs is byte-stable; no pixel
moves (`a-frontend-encapsulation §1` isomorphism note). inv ε: every site below cites
`file:line`, source-verified on `tranche-g-dev`, not asserted. The §4 app-root
composable colocation (the 8 `useScene*` flat in `demo/app/`) is MEASURE-FIRST /
RECORD-default — NOT folded here; the §5 `h()` slot-projection is DECLINED (correct
architecture). Do NOT manufacture either.

**Provenance.** `a-frontend-encapsulation §1` (two template-ref idioms side-by-side;
MED SHIP — the §Mandate "no deprecated path beside its replacement"), `§2` (the
`use*`-named pure predicate; LOW SHIP), `§3` (the `*Types.ts`/`timingCurveUtils`
under `composables/`; LOW SHIP). Synthesised at `_SYNTHESIS-frontend §2 TIER 3`
(F-V1/F-V2/F-V3) + `_SYNTHESIS-gap-scorecard §1` (frontend-encapsulation row:
"~90% ALREADY-SOTA … converge to `useTemplateRef`") + `§2 Band 4 G.W7`.

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **`useTemplateRef` is the demo's broad idiom — 28 files.** Verified live: a
   `useTemplateRef` grep over `demo/**` source (`.vue` + `.ts`, `dist/` excluded)
   resolves the broad-adoption count `a-frontend-encapsulation §1` recorded (28; a
   `.vue`-only narrow grep returns 27 — the delta is the one `.ts` consumer). The
   Vue-3.5-stable `useTemplateRef(name)` accessor (Vue 3.5.0, 2024-09) is the idiom
   the demo lives under.

2. **Seven legacy template-ref sites survive — `ref<…>(null)` bound via `ref="…"`.**
   Verified each `file:line` (`grep -n "ref<\(HTML\|SVG\|InstanceType\)"` over
   `demo/**`, then confirmed bound in-template):
   - `app/scenes/CubeScene.vue:52` `cubeTargetRef`, `:53` `cubeElRef` (bound
     `ref="cubeTargetRef"`/`ref="cubeElRef"`) — legacy-only.
   - `playground/App.vue:72` `viewportRef`, `:73` `layerPanelRef` (bound in template)
     — legacy-only.
   - `animation-controls/AnimationControlsGroup.vue:220` `controlsPaneEl`, `:231`
     `menuBarRef` (bound `ref="menuBarRef"`) — legacy-only.
   - `editor-shell/EditorShell.vue:137` `headerRibbonRef` (bound) — legacy-only.
   - `animation-controls/controls/AnimationControls.vue:180` `keyframesControlsRef`,
     `:181` `timelineRef` (bound `ref="keyframesControlsRef"`/`ref="timelineRef"`)
     **+ `:227` `tabsListElRef`** (`ref<HTMLElement | null>(null)`, also a bound
     template ref — verified live, NOT in the `a-frontend-encapsulation §1` table;
     a third legacy site IN this file, folded here so the convergence is total) —
     **mixed in one file** with `useTemplateRef` at `:182-204`.
   - `animation-controls/keyframes/KeyframesStringControls.vue:76`
     `editorRef = ref<InstanceType<typeof CSSCodeEditor> | null>(null)` —
     **mixed in one file** with 2 `useTemplateRef` sites.

3. **`AnimationControls.vue` is the sharpest mix — three legacy refs two lines from
   the modern idiom.** `:180-181` (`keyframesControlsRef`, `timelineRef`) + `:227`
   (`tabsListElRef`) are `ref<…>(null)` template refs; `:182-204` (`tabsContentEl`,
   `tabsHeaderEl`, `tabsListRef`, `keyframesPaneEl`) are `useTemplateRef`. The reader
   cannot tell from the declaration which is which — the "weaker-alternative escape
   hatch beside the real fix" the §Mandate names (`a-frontend-encapsulation §1`).

4. **`Animated.vue:16` is a DATA ref, NOT a template ref — correctly EXCLUDED.**
   `const children = ref<HTMLElement[]>([])` is manually populated (`el.value?.children`),
   not a `ref="…"` target. Converting it would be manufactured work
   (`a-frontend-encapsulation §1` inv-ε note). The gate (§S1) must exclude data refs.

5. **`useToastGuard.ts` is a pure predicate wearing a `use*` name.**
   `demo/@/utils/useToastGuard.ts:26` exports a single pure function
   `isInsideToaster(el): boolean` — no `ref`/`computed`/`watch`/lifecycle. The `use*`
   prefix is the Vue convention for COMPOSABLES (functions consuming the reactivity/
   lifecycle API in `setup`); this is neither — its two consumers call it as a plain
   predicate in event handlers (`a-frontend-encapsulation §2`). The file correctly
   already lives in `@/utils/` (beside `clipboard.ts`/`iosTextEntry.ts`, plain-noun
   names) — the LOCATION is right, the NAME lies.

6. **Two pure modules are mis-filed under `composables/`.** Verified live paths:
   - `animation-controls/timeline/composables/timelineTypes.ts` — a pure-types module
     (`interface TimelineKeyframe`, `interface TimelineState`,
     `const DEFAULT_CAPTURE_PROPERTIES`; no reactivity, `:1-15`), sitting beside the
     genuine composables `useTimeline.ts`/`useTimelineBuild.ts`/`useTimelineOps.ts`
     (`a-frontend-encapsulation §3`).
   - `animation-controls/controls/composables/timingCurveUtils.ts` — pure SVG-path
     functions (`generateCurveSVGPath`, no reactivity), the SAME mislocation
     (`a-frontend-encapsulation §3` inv-ε note).
   The demo's OWN rule (verified) colocates types under `utils/` or as `*Types.ts`
   at the surface root (`asset-manager/assetTypes.ts`, `orbital-drag/types.ts`); these
   two break it.

7. **The gate family the demo already lives under is presence-grep SHAPE-locks.**
   `proof:decomposition` (`scripts/proof-decomposition.mjs`) + `proof:idioms` exist in
   `package.json:44-45` and are in `proof:all` (`:64`); the decomposition script is the
   demo's re-runnable grep instrument family (`a-frontend-encapsulation §1` cites the
   `F/audit/_SYNTHESIS` NEW-7 presence-grep shape). G extends it with two clauses; it
   does NOT author a bespoke new gate (KISS/DRY).

The wave's job: convert all 7 (the §2 enumeration — including the `:227` third site
verified in §State 2) legacy template-ref sites to `useTemplateRef`, rename the
`use*`-misnamed pure predicate, re-home the two pure modules out of `composables/`,
and lock the convergence with a presence-grep that BITES today on all three shapes.

---

## § Goal

**What lands:**

- **All legacy template-ref sites → `useTemplateRef("name")`.** Convert the 7
  enumerated sites (CubeScene ×2, playground ×2, AnimationControlsGroup `menuBarRef`
  + `controlsPaneEl`, EditorShell `headerRibbonRef`, AnimationControls
  `keyframesControlsRef`/`timelineRef`/`tabsListElRef`, KeyframesStringControls
  `editorRef`). Component refs type via `useTemplateRef<InstanceType<typeof Child>>("…")`
  (Vue 3.5 supports the generic param); element refs via `useTemplateRef<HTMLElement>("…")`.
  Each binding's `ref="x"` attribute stays (the name keys the `useTemplateRef` call);
  every `.value` read + every `defineExpose` of these refs is byte-stable.
- **`useToastGuard.ts` → `toastGuard.ts`** (stays in `@/utils/`, beside the plain-noun
  pure utils). Export name `isInsideToaster` is already correct. Update the 2 import
  sites.
- **The two pure modules out of `composables/`.** Move
  `timeline/composables/timelineTypes.ts` → `timeline/timelineTypes.ts` (the surface
  root, matching `asset-manager/assetTypes.ts`/`orbital-drag/types.ts`) and
  `controls/composables/timingCurveUtils.ts` → `controls/timingCurveUtils.ts` (or a
  `controls/utils/`). Update the intra-surface import paths.
- **`proof:demo-template-refs`** (new clause, folded into the `proof:decomposition`
  presence-grep family) — asserts ZERO `ref<(HTML|SVG|InstanceType)…>(null)`
  declaration bound via a `ref="…"` attribute in any `demo/**` SFC; only
  `useTemplateRef` is permitted. Distinguishes data refs (`Animated.vue:16` — not a
  `ref="…"` target — passes).
- **The pure-`use*` detector + the types-under-`composables/` clause** (folded into the
  same gate) — no `@/utils/use*.ts` (nor any `use*.ts`) whose exports contain ZERO
  `ref`/`computed`/`reactive`/`watch`/`on[A-Z]` tokens; no `**/composables/*Types.ts`
  and no `**/composables/` file whose exports are types-only (zero runtime export).

**Why:** the demo made the `useTemplateRef` migration everywhere it counts (28 files)
but left 7 sites — and 2 files ship BOTH idioms — so a reader cannot tell the
intended pattern, and a contributor copying a nearby site re-forks the legacy shape.
Converging in one motion + gating it is the §Mandate's "no deprecated path beside its
replacement." The two file-kind moves make the demo's OWN colocation rule (composables
in `composables/`, pure modules in `utils/`/`*Types.ts`) hold without exception — the
name and the location stop lying about the module kind.

**What does NOT land (recorded so no future lane re-raises):**
- **`Animated.vue:16` `children` ref** — NOT a template ref (a manually-populated data
  ref); excluded by the gate, NOT converted (`a-frontend-encapsulation §1`).
- **The 8 `useScene*` composables flat in `demo/app/`** — MEASURE-FIRST / RECORD-default
  (`a-frontend-encapsulation §4`): a `demo/app/composables/` sub-dir matches the
  everywhere-else rule but costs ~8 import edits; SHIP only on explicit user judgment,
  else RECORD a deliberate flat-host choice. A gate forcing every `use*` into a dir is
  the reflexive over-engineering the Mandate forbids. NOT this wave.
- **The `h()`-render-tree slot helpers** (Cube/Spring/Easing, 19/14/11 calls) —
  DECLINED (`a-frontend-encapsulation §5`): the deliberate scene→host slot-projection
  through `<component :is>`; converting to `<template>` slots re-introduces the static
  coupling the `:is`-indirection avoids. Do NOT "fix."

---

## § Scope

### S1 — converge the 7 legacy template-ref sites to `useTemplateRef` (`a-frontend-encapsulation §1`) — SHIP-in-G (MED, the spine of this wave)

**WHAT:** convert every enumerated legacy template-ref site (§State 2 — CubeScene ×2,
playground ×2, AnimationControlsGroup `menuBarRef` + `controlsPaneEl`, EditorShell
`headerRibbonRef`, AnimationControls `keyframesControlsRef`/`timelineRef`/`tabsListElRef`,
KeyframesStringControls `editorRef`) from `const x = ref<…>(null)` + template `ref="x"`
to `const x = useTemplateRef<…>("x")`. The template `ref="x"` attribute is RETAINED (it
keys the `useTemplateRef` call); only the script declaration changes. Type component
refs `useTemplateRef<InstanceType<typeof Child>>("x")`, element refs
`useTemplateRef<HTMLElement>("x")`. Verify each `.value` access + each
`defineExpose({ x })` is byte-stable after conversion.

**WHY:** §State 2/3 — the legacy shape ships side-by-side with its replacement, and in
`AnimationControls.vue` three legacy refs sit two lines from the modern idiom. The
convergence is the §Mandate's "no deprecated path beside its replacement" — one idiom,
in one motion. Behaviour-isomorphic (the `.value` surface is identical), pixel-stable.

### S2 — rename `useToastGuard.ts` → `toastGuard.ts` (`a-frontend-encapsulation §2`) — SHIP-in-G (LOW)

**WHAT:** rename `demo/@/utils/useToastGuard.ts` → `demo/@/utils/toastGuard.ts` (stays
in `@/utils/`). The export name `isInsideToaster` is already predicate-shaped — unchanged.
Update the two import sites (the dialog consumers) to the new path.

**WHY:** §State 5 — the `use*` prefix signals a composable; this file is a pure predicate
with no reactivity. The name mis-signals the module kind; the rename makes the demo's
otherwise-universal "plain-noun name for pure exports" rule hold without exception. Pure
rename + 2 import edits; zero behaviour change.

### S3 — re-home the two pure modules out of `composables/` (`a-frontend-encapsulation §3`) — SHIP-in-G (LOW)

**WHAT:** move
`animation-controls/timeline/composables/timelineTypes.ts` →
`animation-controls/timeline/timelineTypes.ts` (the surface root, matching the
`asset-manager/assetTypes.ts`/`orbital-drag/types.ts` precedent) and
`animation-controls/controls/composables/timingCurveUtils.ts` →
`animation-controls/controls/timingCurveUtils.ts` (or `controls/utils/`). Update the
intra-surface import paths. Two files, one rule, one motion.

**WHY:** §State 6 — both are pure modules (types-only / pure SVG-path functions) filed
beside genuine composables, breaking the demo's own types→`utils/`/`*Types.ts` rule. The
move makes the file kind match its location. File move + import-path edits within the
surface; zero behaviour.

> **MEASURE-FIRST / DECLINED in this band — so no future lane re-litigates:**
> - **`§4` the 8 `useScene*` flat in `demo/app/`** — MEASURE-FIRST → RECORD-default. A
>   `demo/app/composables/` sub-dir matches the everywhere-else rule but costs ~8 import
>   edits and 8-files-at-a-flat-host-root is not egregious; SHIP only on explicit user
>   judgment, else RECORD. NO gate (a gate forcing every `use*` into a dir is the
>   reflexive over-engineering the Mandate forbids — `cube/useCubeAnimations.ts`
>   correctly keeps a single composable flat). `loaf-observer.ts`/`cubeTransformStore.ts`
>   are NOT `use*` and correctly stay at root.
> - **`§5` the `h()` slot helpers** (Cube/Spring/Easing) — DECLINED (already-befitting):
>   the scene→host slot-projection through `<component :is>` is correct architecture;
>   `<template>` slots cannot cross the `:is`-indirection cleanly. The ONE bounded
>   refinement (extract the largest static `h()` trees to colocated SFCs) is BOOK-only,
>   not now. Do NOT "fix."

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable presence-grep,
not an assertion). **All three clauses fold into the `proof:decomposition` grep family
(KISS/DRY — no bespoke gate):**

1. **`proof:demo-template-refs` PASSES — zero legacy template-ref shape.** The clause
   greps every `demo/**` SFC (comment-blanked, `dist/` excluded) for a
   `ref<(HTML|SVG|InstanceType)…>(null|undefined)` declaration whose name is bound via a
   `ref="…"` attribute in the SAME file's template, and asserts ZERO. **BITE:** reds
   TODAY on the 7 sites (§State 2); green after S1. Reverting any one conversion (or a
   contributor re-introducing the legacy shape) reds. Data refs (`Animated.vue:16`,
   not a `ref="…"` target) pass — the clause distinguishes them.

2. **The pure-`use*` detector PASSES — no composable-named pure module.** The clause
   asserts no `demo/**/use*.ts` whose export bodies contain ZERO
   `ref`/`computed`/`reactive`/`watch`/`watchEffect`/`on[A-Z]` (lifecycle/composable)
   tokens. **BITE:** reds TODAY on `useToastGuard.ts` (`isInsideToaster`, pure
   predicate); green after S2. Re-naming a pure module `use*` reds.

3. **The types-under-`composables/` clause PASSES — no pure module under `composables/`.**
   The clause asserts no `demo/**/composables/*Types.ts` and no `demo/**/composables/`
   file whose exports are types-only (zero runtime export) or carry zero reactivity
   tokens. **BITE:** reds TODAY on `timelineTypes.ts` + `timingCurveUtils.ts`; green
   after S3. Filing a pure module under `composables/` reds.

4. **No regression — the convergence is inert on behaviour + pixels.** `npm test`,
   `proof:brittleness`, `proof:idioms`, and the rest of `proof:all` stay green; the
   converted SFCs render byte-stable (every `.value` read + `defineExpose` unchanged);
   the demo builds (`npm run gh-pages`). **BITE:** any test regression, any pixel diff
   attributable to the conversion, or any `src/**` edit attributed to this wave reds
   (the wave is `demo/**`-only).

---

## § Folds

Retires (by finding id):
- **`a-frontend-encapsulation §1`** (two template-ref idioms side-by-side; 2 files mix
  both — the MED) — S1 + gate clause 1. The convergence is total (including the
  `AnimationControls.vue:227` third site verified in §State 2, beyond the audit table).
- **`a-frontend-encapsulation §2`** (the `use*`-named pure predicate) — S2 + gate clause 2.
- **`a-frontend-encapsulation §3`** (`timelineTypes.ts` + `timingCurveUtils.ts` under
  `composables/`) — S3 + gate clause 3.

**RECORDED / DECLINED in this band (see S3 callout):**
- **`a-frontend-encapsulation §4`** (8 `useScene*` flat in `demo/app/`) — MEASURE-FIRST
  → RECORD-default (no gate; user-judgment move).
- **`a-frontend-encapsulation §5`** (`h()` slot helpers) — DECLINED (already-befitting
  scene→host slot-projection).
- **`a-frontend-encapsulation §6`** (per-scene colocation / animation-controls tree /
  injectionKeys / `defineModel` / `toRef`-getter / no god-unit) — ALREADY-SOTA,
  untouched.

**DOC-TRUTH RECORD (out of source write-scope, named for the owner):** `demo/CLAUDE.md`
is stale at the finest grain — documents a `@/composables/` dir that does not exist, an
`animationStores/` dir (live: `stores/`), removed components, and (per `a-frontend-state
§2` / `G.W8`) the dead `stateVersion` counter. A doc-housekeeping pass prevents a
contributor mis-placing a file by following the stale doc (`a-frontend-encapsulation`
doc-truth note). NOT this wave's source surface.

---

## § Design decisions (the trade-offs RESOLVED)

1. **Converge to `useTemplateRef`, not the reverse — the demo already chose.** RESOLVED:
   both idioms are valid Vue (3.5 still honours implicit name-matching for back-compat),
   so "which wins" is a real call. The demo answered it: 28 files use `useTemplateRef`,
   7 use the legacy shape (`a-frontend-encapsulation §1`). Converging the minority to the
   majority is the one-motion, lowest-churn move; the reverse would re-fork 28 files and
   re-adopt the implicit name-coupling Vue 3.5 stabilised AWAY from. The gate (clause 1)
   binds the OUTCOME (zero legacy shape), permitting only the demo's chosen idiom.

2. **The gate distinguishes template refs from DATA refs — `Animated.vue:16` passes.**
   RESOLVED + named: a naive `ref<…>(null)` grep would red `Animated.vue:16`
   (`ref<HTMLElement[]>([])`, a manually-populated data ref) — manufactured work. The
   clause keys on the BINDING: only a `ref<…>` whose variable is the target of a
   `ref="…"` attribute in the same SFC's template is a template ref and is gated; a data
   ref is not bound that way and passes. This is the precise scope `a-frontend-encapsulation
   §1` carved (the inv-ε exclusion).

3. **One gate family, three clauses — NOT three bespoke scripts.** RESOLVED: the
   template-ref convergence (S1), the pure-`use*` detector (S2), and the
   types-under-`composables/` clause (S3) are all presence-grep SHAPE-locks — the exact
   shape `proof:decomposition` already runs (`F/audit/_SYNTHESIS` NEW-7). Folding all
   three into that family (KISS/DRY) reuses the script's `dist/`-exclusion +
   comment-blanking + stale-guard machinery rather than authoring three new gates. The
   `proof:demo-template-refs` name is the public clause name; it rides the
   `proof:decomposition` runner.

4. **This wave is `demo/**`-only — ZERO library surface.** RESOLVED: every site is a
   demo Vue-idiom or demo file-organisation concern; no `src/**`, no public-API, no
   value.js/parse-that/glass-ui touchpoint (`a-frontend-encapsulation` cross-repo: NONE).
   The `h()` slot helpers consume glass-ui components but the PATTERN is kf-demo's own
   architecture (DECLINED, not a glass-ui concern). The wave's gate edits
   `scripts/proof-decomposition.mjs` (the gate, not source) — the only non-`demo/**`
   file touched, and it is the lock, not a behaviour change.
