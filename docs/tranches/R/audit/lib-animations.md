# Tranche R Audit — Lane: lib-animations

**File:** `src/animation/animations.ts` (886 lines)
**Date:** 2026-06-24
**Auditor:** Tranche R lane agent

---

## 1. What the file is

`animations.ts` is the **preset library**: 38 factory functions, each returning a
`CSSKeyframesAnimation` built from a literal CSS keyframe string. It is **not** a
registry, not a dispatcher, and carries no state. The presets are exclusively
distributed through the `presets` property on `AnimationEngine` (via
`loadAnimationEngine()` / `load-engine.ts:158` → `import("./animations")` at
`load-engine.ts:464`). There is no static import edge from the public barrel
(`index.ts`) to this file; the barrel re-exports it only as an `import type`
for typing `AnimationEngine.presets`.

### Consumers

| Consumer | How accessed |
|---|---|
| `load-engine.ts:101,158,464` | `import type *`, dynamic `import("./animations")`, merged as `presets` on engine surface |
| `demo/playground/usePlaygroundAnimations.ts` | `presets.bounce / .fadeIn / .pulse / .rotateScale / .shake` via `kfEngine()` |
| `demo/cube/useCubeAnimations.ts` | `presets.hover` |
| `demo/@/components/custom/Animated.vue` | `presets.fadeIn / .fadeOut` |
| `demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue` | `presets.shake` |
| `demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue` | `presets.jumpUp` |
| `test/presets.test.ts` | Direct import of all 38 named factories |
| `test/spring-presets.test.ts` | Direct import of spring presets + taxonomy objects |

---

## 2. Line breakdown

| Section | Lines (approx) |
|---|---|
| Imports | 4 |
| Keyframe CSS strings (474 = 53%) | 474 |
| Factory functions (38 × ~6 lines) | 245 |
| Spring-preset constants (4 `const SPRING_*`) | 4 |
| Taxonomy objects + `presetTaxonomy` | 46 |
| Comments / blank | 113 |
| **Total** | **886** |

The file exceeds the 500-line god-module threshold by 77%. The majority of
bulk (474 lines, 54%) is **raw CSS string data**, not logic. The file has two
semantically distinct halves that do not need to cohabit:

- **Classic presets** (lines 1–729): cubic-bezier / stepped / named-easing factories
- **Spring-eased presets** (lines 731–886): the four `SPRING_*` constants + four
  spring factories + the taxonomy index

---

## 3. Findings

### F1 — God module: 886 lines, split into at least two cohesive sub-modules (high)

**Category:** god-module / decomposition

The 500-line ceiling is exceeded. The natural split is already named in the
file's own comment at line 731:

```
// ── Spring-eased presets (E.W10 §S6) ─────────────────────────────────────
```

**Proposed directory:** `src/animation/presets/`

```
src/animation/presets/
  index.ts           — re-exports everything (backward-compat barrel, 1:1 with current animations.ts exports)
  classic.ts         — the 34 cubic-bezier/stepped/named-easing presets (lines 1–729)
  spring.ts          — the 4 SPRING_* constants + 4 spring factories (lines 731–816)
  taxonomy.ts        — enterPresets / exitPresets / attentionPresets / loopPresets / presetTaxonomy (lines 818–886)
```

`load-engine.ts:464` switches from `import("./animations")` to `import("./presets")`.
The `AnimationEngine.presets` type stays `typeof AnimationPresets` — no API surface
change.

This is a genuine sub-module directory decomposition, not a flat hyphenated sibling.

---

### F2 — Two raw CSS strings accidentally exported (`slideInLeftKeyframes`, `slideInRightKeyframes`) (medium)

**Category:** api-surface / encapsulation

```
// animations.ts:591
export const slideInLeftKeyframes = /*css*/ `…`;
// animations.ts:626
export const slideInRightKeyframes = /*css*/ `…`;
```

Every other keyframe string in the file is `const` (module-private). These
two are `export const` with no consumer outside `animations.ts` itself — zero
hits in `src/`, `demo/`, or `test/` excluding the definition file. They leak
raw implementation strings onto the `presets` namespace surfaced through
`AnimationEngine.presets`.

**Proposal:** Make both `const` (remove `export`). No callers break.

---

### F3 — Six presets absent from the preset taxonomy (medium)

**Category:** dead-code / api-surface

The `presetTaxonomy` (`enter / exit / attention / loop`) is the public discovery
index. Six presets are excluded:

| Preset | Absent from |
|---|---|
| `accordionExpand` | all four groups |
| `blurInOut` | all four groups |
| `progressBar` | all four groups |
| `rotateScale` | all four groups |
| `textFocusBlur` | all four groups |
| `typewriter` | all four groups |

These are also **not consumed by any demo or library code** (neither via
`presets.X` nor direct import in production paths) — only present in
`test/presets.test.ts`.

`accordionExpand` carries the `max-height: 1000px` hack (see F5); `progressBar`
is a UI-widget preset of dubious library value.

**Proposal:**
1. For `blurInOut`, `rotateScale`, `textFocusBlur`, `typewriter`: assign to
   appropriate taxonomy group (attention or loop) so they are discoverable.
2. For `accordionExpand` and `progressBar`: evaluate excision or move to a
   `"misc"` taxonomy bucket — they are the weakest presets in the library.

---

### F4 — Four presets use `"bounce-in-ease"` as a string easing name (low)

**Category:** brittleness

Lines `299, 327, 703, 727`:
```ts
timingFunction: "bounce-in-ease",
```
Used by `warpLeft`, `warpRight`, `jumpUp`, `jumpDown`.

`"bounce-in-ease"` is a value.js registry name that resolves through
`getTimingFunction` → `timingFunctions["bounce-in-ease"]` at construction time.
It has no faithful CSS twin (confirmed by `easing.ts:44`, `cssTwinFor`). That
means these four presets **silently fall back to the rAF path** when WAAPI
delegation is attempted, with no compositor acceleration.

This is not a crash risk — `resolveEasingOption` throws on unknown names — but
it is a hidden performance degradation boundary that isn't obvious to a preset
consumer. More importantly, all other spring-influenced presets use typed
`springTimingFunction(...)` objects directly. The inconsistency should be
explicit.

**Proposal:** Replace the string with the resolved `Easing` object directly,
using `CSSCubicBezier` or `springTimingFunction` as appropriate for the
motion character of each preset (the bouncy spring at ζ=0.5 matches the bounce
character). This makes the lack of a CSS twin structurally visible.

---

### F5 — `accordionExpand` uses `max-height: 1000px` workaround (medium)

**Category:** workaround / legacy

```
// animations.ts:510–520
const accordionExpandKeyframes = /*css*/ `
0% {
  max-height: 0;
  opacity: 0;
}
100% {
  max-height: 1000px;   // ← magic constant workaround
  opacity: 1;
}
`;
```

`max-height: 1000px` is the classic CSS accordion hack — animate from 0 to a
large sentinel value rather than `auto`. The CSS `interpolate-size: allow-keywords`
property (Baseline 2025) plus `height: auto` makes this unnecessary in 2026.

This preset is in **no taxonomy group** (F3), used by **no demo or library code**,
and has a known-broken implementation. It is a candidate for excision.

**Proposal:** Either excise `accordionExpand` entirely, or rewrite using
`height: auto` + `interpolate-size: allow-keywords` if the library explicitly
targets supporting accordion-style content-height transitions.

---

### F6 — `SPRING_*` constants in `animations.ts` are silently diverged from `demo/spring/springPresets.ts` (low)

**Category:** dry / brittleness

The file comment at line 740 says the four constants "mirror the four glass-ui
`--spring-*` token presets." They do not:

| Preset | `animations.ts` ζ | `demo/spring/springPresets.ts` ζ |
|---|---|---|
| smooth | 0.86 | 0.86 (match) |
| snappy | **0.78** | **0.65** |
| bouncy | **0.5** | **0.45** |
| gentle | **0.95** | **1.0** |

`demo/spring/springPresets.ts` was retuned to glass-ui's `G-AJ / AC.W*`
token values; `animations.ts` was not updated. There are now three diverged
copies of the spring canon: `animations.ts`, `demo/spring/springPresets.ts`,
and the glass-ui CSS tokens themselves.

**Proposal:** After the `presets/spring.ts` split (F1), export the
`SPRING_SMOOTH / SNAPPY / BOUNCY / GENTLE` constants from
`src/animation/presets/spring.ts` and import them in `demo/spring/springPresets.ts`
so there is one authoritative source. The comment claiming glass-ui mirror parity
must be either corrected or the values reconciled.

---

### F7 — Four presets use `@keyframes <name>` wrappers with dummy name strings (low)

**Category:** brittleness / dry

`warpLeft` / `warpRight` use `@keyframes keyframeDelete {…}` (lines 273, 305).
`jumpUp` / `jumpDown` use `@keyframes keyframeShift {…}` (lines 683, 707).

All other 34 presets use bare `%`-rule blocks (no `@keyframes` wrapper).
`fromString` tolerates both forms (the value.js grammar handles them
uniformly), but:
1. The dummy names `keyframeDelete` and `keyframeShift` are **implementation
   artifacts** that appear in the parsed animation's name if no explicit name
   is set on the `CSSKeyframesAnimation`.
2. The inconsistency with the other 34 bare-block presets is an undocumented
   divergence with no explanation.

**Proposal:** Strip the `@keyframes <name>` wrappers from all four and use
bare `%` blocks like the rest of the library. The parser is indifferent; the
dummy names disappear from the object model.

---

## 4. Summary table

| # | Finding | Severity | Category |
|---|---|---|---|
| F1 | God module: 886 lines — split into `presets/` directory | high | god-module / decomposition |
| F2 | `slideInLeftKeyframes` / `slideInRightKeyframes` accidentally exported | medium | api-surface |
| F3 | Six presets absent from `presetTaxonomy` (four also dead in production) | medium | dead-code / api-surface |
| F4 | Four presets use string `"bounce-in-ease"` — opaque, no CSS twin | low | brittleness |
| F5 | `accordionExpand` uses `max-height: 1000px` hack (workaround) | medium | workaround |
| F6 | `SPRING_*` constants silently diverged from demo springPresets and glass-ui tokens | low | dry |
| F7 | Four presets use `@keyframes <dummy-name>` wrappers inconsistently | low | brittleness |

---

## 5. What this file is NOT

- **Not a god module in the complexity sense**: every export is a leaf factory
  with zero internal state and a 3-line body. The over-length is purely
  **data volume** (CSS strings), not tangled logic. A single-pass read produces
  no hidden control-flow surprises.
- **Not legacy**: the factories are actively consumed (F3 identifies the ones
  that are NOT). The taxonomy index (lines 818–886) was added deliberately as
  a discovery aid.
- **No deprecated/fallback behavior** beyond the workarounds flagged in F4, F5,
  and F7.
