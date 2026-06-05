# SOTA audit — Scroll-Driven Animations + View Transitions

**Lane:** native CSS scroll-driven animations (`scroll()`/`view()` timelines,
`animation-timeline`, `@property`-driven) + the View Transitions API
(same-document `document.startViewTransition`, cross-document `@view-transition`,
`view-transition-name`). **Scope:** keyframes.js engine `src/animation/` +
the Vue demo `demo/`. **inv-16:** keyframes.js findings → FOLD-E;
value.js findings → FOLD-VALUEJS-HANDOFF. This file is the only one this lane
writes.

**Branch at audit:** `tranche-d-impl`. Every line cite is the live state.

---

## 0. Executive verdict — SOTA-aligned, with a re-confirmed ARCH-kill

This lane was explicitly chartered to **re-examine the engine's ScrollTimeline
ARCH-kill with the current baseline** (D `deferred-ledger.md:185` ARCH-1, "do
not re-litigate"). The honest answer after re-examination against live 2026
baseline data: **the ARCH-kill holds, and it holds for a stronger reason than D
recorded.** The native scroll-driven CSS path is *still not Baseline* (Firefox
partial/flagged, Interop-2026 in-flight), and — more fundamentally — the engine's
`Timeline` is a **caller-polled progress sampler over arbitrary objects**, a
strictly more general primitive than `animation-timeline:scroll()`, which can
only drive *CSS animations on DOM elements*. They are not substitutes. This is
a genuine **ALREADY-SOTA / ARCH-correct** result, not manufactured work.

The one genuinely net-NEW, defensible finding in this lane is **demo-side and
already substrate-owned**: the constellation's scroll-driven + view-transition
layer lives in **glass-ui** (`startViewTransition`, `useScrollProgress`,
`useViewTransition`, `supportsScrollTimeline`/`supportsViewTimeline`,
`useIntersectionPause`, `useStaggerReveal` — all exported from
`@mkbabb/glass-ui` `motion-core`), with a **native-CSS-first / JS-fallback**
discipline that is itself SOTA. The keyframes demo *consumes* glass-ui but does
**not** dogfood VT for its scene-swap (it dogfoods the engine's own
`SpringProgress` instead — a deliberate, documented call). Whether that should
change is the one live question, and the evidence says **KEEP the dogfood**
(detailed in §3).

| Disposition | Count | Items |
|---|---|---|
| **ALREADY-SOTA** | 4 | S-1 ScrollTimeline arch · S-2 glass-ui VT/scroll layer · S-3 scroll-morph recipe · S-4 demo VT-free posture (fixed viewport) |
| **GAP-NAMED** | 1 | G-1 publish-surface: no `supportsScrollTimeline` feature-detect helper / no native-`view()` reveal recipe shipped from the engine (low value — see rationale) |
| **BOOK** | 1 | B-1 demo `easing` multi-track list — optional `view()`-driven reveal as a shop-window demo (PE-only, measure-first) |
| **FOLD-E** | 1 | F-1 `docs/scroll-morph.md` — add the native-`view()` feature-detect fallback note (doc-only, isomorphic) |
| **FOLD-VALUEJS-HANDOFF** | 0 | — (this lane touches no value.js surface) |

---

## 1. Baseline ground truth (2026) — the gate every disposition rides

Cited so no disposition rests on a stale memory of support tables.

### 1.1 Scroll-driven animations — **NOT Baseline** (Firefox-gated)

- **modern-web-guidance** `scroll-entry-exit-effects` / `scrollytelling`
  (baseline block): *"Scroll-driven animations has limited availability.
  Supported by: Chrome 115 (Jul 2023), Edge 115 (Jul 2023), and Safari 26
  (Sep 2025). **Unsupported in: Firefox.** Therefore, a fallback strategy is
  typically required."*
- **WebSearch (Jun 2026, MDN/sitepoint):** *"The `animation-timeline` property
  is **not Baseline** because it does not work in some of the most widely-used
  browsers… part of **Interop 2026**. Firefox support remains **partial** as of
  mid-2026 (`animation-timeline` works, but `::scroll-button()`/`::scroll-marker()`
  remain behind the `layout.css.scroll-driven-animations.enabled` flag; Firefox
  requires a non-zero `animation-duration`)."*
- **Guidance MANDATE for any adoption:** feature-detect with
  `@supports ((animation-timeline: view()) and (animation-range: entry))` (the
  `animation-range` clause is **mandatory** to filter partial-support engines),
  `prefers-reduced-motion` gate, and **DO NOT** use the `scroll-timeline-polyfill`
  package (the guide explicitly forbids it — "not feature complete, lots of known
  issues"). The fallback is `IntersectionObserver` (`view()`) or a scroll listener
  (`scroll()`).

→ **Implication:** any native scroll-driven CSS in the *publish surface* would be
a non-isomorphic, partially-supported path requiring a JS fallback anyway — i.e.
exactly what the engine's `ScrollTimeline` already *is*, only the engine's
version works on **all** engines and on **non-DOM** objects. The arch-kill is
baseline-correct.

### 1.2 View Transitions — same-doc **Baseline Newly available (2025-10-14)**; cross-doc **NOT Baseline**

- **modern-web-guidance** `same-document-transitions`: *"Baseline status for
  View transitions: **Newly available. Baseline since 2025-10-14.** Chrome 111,
  Edge 111, **Firefox 144 (Oct 2025)**, Safari 18 (Sep 2024)."*
- **modern-web-guidance** `cross-document-transitions`: *"Cross-document view
  transitions has **limited availability.** Chrome 126, Edge 126, Safari 18.2.
  **Unsupported in: Firefox.**"* (Navigation API: Baseline 2026-01-13.)
- **WebSearch (Jun 2026):** same-document VT is "available in all three major
  browser engines, Baseline Newly available as of 2025-10-14"; cross-document
  "ships in Chromium from Chrome 126, Firefox and Safari [cross-doc] do not yet
  support it… expected in 2026". Firefox 144 ships `startViewTransition` +
  `view-transition-name` but **not** transition *types*.

→ **Implication:** same-document VT is now safe-with-progressive-enhancement
(the API degrades to an instant DOM update). Cross-document VT is structurally
**N-A** for this demo (it is a hash-routed SPA — §3.3 — there is no document
navigation to transition).

---

## 2. ENGINE findings — `src/animation/`

### S-1 · ScrollTimeline native path — ARCH-kill RE-CONFIRMED (stronger than D recorded) — **ALREADY-SOTA**

- **File:** `src/animation/timeline.ts:36-197` (the `Timeline`/`ScrollTimeline`/
  `ManualTimeline` family). The arch record: D `audit/deferred-ledger.md:185-195`
  (ARCH-1), corroborated by `A/audit/constellation-grand-audit-2026-06-02.md:87`
  and `E/audit/modern-web-findings.md:101` (E-5 "ALIGNED by-design JS").
- **Spec/guide:** `scroll-entry-exit-effects` baseline block (Firefox-unsupported);
  CSS Scroll-Driven Animations Module L1 (`scroll()`/`view()` are CSS-only,
  DOM-only).
- **SOTA gap / opportunity:** *none* — re-examined and the kill is correct. The
  charter asked to re-litigate "with current baseline"; doing so **strengthens**
  the kill on two independent axes:
  1. **Generality.** `animation-timeline:scroll()` binds a **CSS animation** to a
     **DOM scroller's** progress on the compositor thread. The engine's
     `Timeline.sample()→clamp→easing→boundary-snap→smoothing→progress`
     (`timeline.ts:80-111`) emits a raw `progress ∈ [0,1]` the **caller** maps onto
     *anything* — a Three.js sphere, a WebGL uniform, a matrix3d cell, a plain
     `{x,y}` object. keyframes.js's whole thesis is "animate **any object**, not
     just DOM" (`CLAUDE.md` headline). A native timeline cannot drive a non-DOM
     target, so it is **not a replacement** — feature-detecting it would not
     remove the JS sampler (the exact ARCH-1 rationale, now baseline-grounded).
  2. **Baseline.** Even for the DOM-only subset, native scroll-driven is
     *not Baseline* (§1.1) — adopting it in the publish surface would *add* a
     Firefox fallback, not remove JS. The engine's `ScrollTimeline` already **is**
     the universal fallback, and it carries SOTA niceties the native API lacks:
     injectable `getScrollY`/`getViewportHeight` (`timeline.ts:171-173`) for
     DOM-free testing, the `boundaryEpsilon` endpoint-oscillation snap
     (`timeline.ts:86-90`), and `SmoothProgress` exponential smoothing
     (`timeline.ts:64-68`) that native `scroll()` has no analog for.
- **Perf/elegance rationale:** native `scroll()` runs on the compositor; the
  engine's poll runs on rAF in the main thread. That is a real perf delta **only
  for the DOM-CSS-animation subset on a Chromium/Safari engine** — i.e. the
  narrow case glass-ui already covers natively (S-2). For the engine's actual job
  (arbitrary-object progress, cross-engine), main-thread polling is the *only*
  correct primitive. KISS: one sampler, all engines, all targets.
- **Disposition:** **ALREADY-SOTA** — re-affirm ARCH-1 KILL. *Do not re-open.*
  The trigger ARCH-1 names ("an off-thread scroll consumer of a DOM-CSS animation
  appears") is now **explicitly owned by glass-ui's native-CSS recipes** (S-2),
  so even that trigger is satisfied **outward**, not in the engine.
- **Isomorphism note:** zero pixel/behaviour change. Re-affirmation only.

### S-2 · The scroll/VT substrate lives in glass-ui — engine correctly defers — **ALREADY-SOTA**

- **File (engine boundary):** keyframes.js exports **no** VT/scroll-CSS surface
  (`src/animation/index.ts` — `grep startViewTransition|view-transition|scroll()|
  animation-timeline` = 0). **File (substrate):**
  `node_modules/@mkbabb/glass-ui/dist/motion-core.js:290` exports
  `startViewTransition`, `supportsViewTransitions`, `useScrollProgress`,
  `useIntersectionPause`, `useStaggerReveal`, `supportsScrollTimeline`,
  `supportsViewTimeline`; `dist/index.d.ts:49` re-exports the VT surface.
- **Spec/guide:** `same-document-transitions` (the `startViewTransition` +
  focus-routing recipe); `scroll-entry-exit-effects` (the native-CSS-first +
  `IntersectionObserver`-fallback discipline).
- **What glass-ui ships (verified from dist):**
  - `useViewTransition.ts` (`dist/useViewTransition-BONrMedQ.js:1-16`):
    `startViewTransition(mutate)` wraps `document.startViewTransition` with an
    **instant fallback** — `mutate` runs synchronously in **both** paths so the
    post-mutation DOM is identical (the guide's exact PE contract), returns
    `{ finished, transitioned }`, and the d.ts documents the a11y-MANDATORY focus
    routing (`await …finished; el.focus()`).
  - `supportsCssTimeline.ts` (`dist/platformSupport-ByFnknMm.js:12-18`): genuine
    feature-detect for `scroll()` and `view()` via the
    **`CSS.supports("animation-timeline", X) && !CSS.supports(…, "gl-not-a-real-timeline")`**
    double-probe (filters the partial-support engines the guide warns about — §1.1).
  - `useScrollProgress.ts` (`dist/composables/motion/useScrollProgress.d.ts`):
    a `Ref<number> ∈ [0,1]` scroll-position mapper whose own docstring records the
    **native-CSS-first** discipline: *"on an engine with native scroll-driven
    animations, the listener + ResizeObserver machinery does NOT attach — prefer
    the `.scroll-progress` CSS recipe (scroll-driven.css)… This composable is the
    feature-detected fallback (the sole writer when the native feature is absent)."*
  - `useStaggerReveal` + the `[data-scroll-reveal]` recipe (referenced in
    `supportsViewTimeline`'s d.ts) — the native `view()` entry-reveal with the
    IntersectionObserver fallback.
- **Constellation confirmation:** glass-ui `docs/constellation/MODERN-WEB-CLOSE.md:52`
  records `useViewTransition`/`startViewTransition` reaching **≥3 real consumers**
  (muster verdict-reveal, fourier route-morph, speedtest) — substrate-with-consumer,
  not demo-only. The dock itself rides VT
  (`glass-ui/dist/dock.js:129,248-250,401-403` — `view-transition-name`/
  `view-transition-class: gl-dock-layer`, support-gated).
- **SOTA gap / opportunity:** *none in the engine.* This is the inv-16 line drawn
  perfectly: the VT/scroll-CSS layer is a **DOM-presentation** concern (glass-ui's
  domain), the **progress-physics** layer is keyframes.js's domain. keyframes.js
  correctly ships zero VT surface and lets glass-ui own the platform-DOM
  recipes. Any "add startViewTransition to keyframes.js" finding would be a
  layering violation — the engine animates *values*, not document snapshots.
- **Disposition:** **ALREADY-SOTA** — the boundary is correct; no engine change.
- **Isomorphism note:** n/a (no change proposed).

### S-3 · `docs/scroll-morph.md` recipe — JS-driven morph is SOTA-correct for its job — **ALREADY-SOTA** (one doc-fold, F-1)

- **File:** `docs/scroll-morph.md:1-115` — the published "scroll-driven morph"
  recipe (hero-logo → navbar-slot), built on `ScrollTimeline` + `ElementMorph`
  for the external **bbnf.babb.dev** playground.
- **Spec/guide:** `same-document-transitions` (VT could morph rect→rect);
  `scroll-entry-exit-effects` (`view()` could drive the progress).
- **Analysis — is VT or native `view()` the SOTA move here?** No, and the recipe
  is *more* honest than a naive VT swap:
  - **View Transitions are snapshot-based and discrete** — they morph between
    two *committed DOM states*, not a *continuous scroll-linked* position. A
    scroll-morph is a **continuous** rect→rect lerp keyed to `progress` every
    frame; VT cannot do continuous scroll-linking (it animates *once* per state
    change). The guide is explicit: *"DO NOT transition elements with active
    animations — view transitions operate on snapshots, any animations appear
    paused"* (`same-document-transitions.md`). The morph element is *always*
    animating during scroll → VT is the wrong primitive.
  - **Native `view()`** could drive the *progress* (replacing `ScrollTimeline`),
    but the morph itself (the `position:fixed` swap, the transformed-ancestor
    containing-block fix, the sub-pixel `getBoundingClientRect` snap — the four
    documented pitfalls, `scroll-morph.md:29-59`) is **JS rect-measurement** that
    native `view()` does not address. `view()` gives you a 0..1; the hard part is
    the DOM-rect plumbing, which stays JS regardless. And `view()` is not Baseline
    (§1.1).
- **SOTA gap / opportunity:** the recipe could *mention* that on a native-`view()`
  engine the progress source could be swapped to the compositor (perf headroom for
  the DOM-only case), with the `@supports` guard + IO fallback — a doc nicety, not
  a code change. This is the only actionable item and it is **doc-only** (F-1).
- **Disposition:** **ALREADY-SOTA** for the engine; the doc note is **F-1**.
- **Isomorphism note:** the recipe's pixels are unchanged; F-1 adds a note only.

#### F-1 · scroll-morph.md — note the native-`view()` progress-source option — **FOLD-E** (doc-only)

- **File:** `docs/scroll-morph.md` (after the §Pitfalls or in §Example).
- **Change:** a short note that the `ScrollTimeline` progress source MAY be
  swapped for a native `view()` timeline behind
  `@supports ((animation-timeline: view()) and (animation-range: entry))` (with
  the JS poll as the universal fallback) when the morph target is DOM-only and
  compositor-thread progress is worth it — citing that this is Chromium/Safari-only
  (not Baseline, §1.1) so the JS path stays the default. **Do NOT** suggest the
  `scroll-timeline-polyfill` (guide-forbidden).
- **Rationale:** documents the one place native scroll-driven *could* add value
  (DOM-only, off-thread progress) without overclaiming — keeps the recipe honest
  against 2026 baseline.
- **Disposition:** **FOLD-E** (E-tail doc-polish; low priority, zero code).
- **Isomorphism note:** doc-only, no pixel change.

### G-1 · No engine-shipped `view()`/`scroll()` feature-detect or reveal recipe — **GAP-NAMED** (low value, recorded-not-forced)

- **File:** `src/animation/index.ts` (the publish barrel) — exports the
  `Timeline` family but **no** `supportsScrollTimeline()`/`supportsViewTimeline()`
  helper and **no** native-`view()` reveal recipe.
- **Spec/guide:** `scroll-entry-exit-effects` (the recommended `@supports`
  double-detect + IO fallback pattern).
- **The "gap":** a consumer wanting "native scroll-driven where available, my
  `ScrollTimeline` poll otherwise" must hand-roll the `CSS.supports` double-probe
  themselves. glass-ui already ships exactly this
  (`supportsScrollTimeline`/`supportsViewTimeline`,
  `platformSupport-ByFnknMm.js:12-18`).
- **Why this is NOT a forced FOLD-E:**
  1. **Already owned outward.** The double-probe + native-first discipline is a
     glass-ui motion-core export with ≥3 consumers (S-2). Duplicating it in the
     engine would be substrate-without-consumer (the demo has no scroll surface —
     §3.2 — and no external keyframes consumer has asked).
  2. **Layering.** A `CSS.supports("animation-timeline", …)` probe is a
     **DOM-platform** detect, not a **progress-physics** concern — it belongs to
     the presentation layer (glass-ui), matching the S-2 boundary. Putting it in
     the value-animation engine blurs the line the engine deliberately keeps clean
     (the heavy/light boundary; the engine is even DOM-free in its light tier).
  3. **No Baseline pull.** Native scroll-driven is not Baseline (§1.1); there is
     no urgency to make it ergonomic from the engine.
- **Disposition:** **GAP-NAMED** — recorded so it is not a perpetual silent
  punt, with the explicit owner (glass-ui, already shipping it) and the re-open
  trigger: *a real keyframes-direct consumer (not via glass-ui) asks for a
  native-timeline feature-detect helper.* Until then, **do not fold** — it would
  be redundant substrate. (Mirrors the ARCH-1 discipline: recorded, owned, not
  built absent a consumer.)
- **Isomorphism note:** n/a (nothing built).

---

## 3. DEMO findings — `demo/`

### S-4 · Demo scene-swap dogfoods `SpringProgress`, not VT — re-examined, KEEP — **ALREADY-SOTA** (with one optional BOOK)

- **File:** `demo/app/App.vue:108-149` (scene host), `:231-249` (the
  `SpringProgress` cross-dissolve), `:238-243` (`sceneSwapStyle`). The prior
  position: E `modern-web-findings.md:172` (D-5 "N-A-with-reason / record-withheld").
- **Spec/guide:** `same-document-transitions` (SPA `startViewTransition` +
  `view-transition-name`); glass-ui `startViewTransition` (the available wrapper).
- **The mechanism (re-read live):** the keyed `<Suspense :key="activeSceneKey">`
  (`App.vue:137`) hard-cuts the async scene chunk; a `SpringProgress` (iOS
  "smooth" preset, `respectReducedMotion: true`, `App.vue:244`) drives
  `sceneOpacity` 0→1 on a **sibling** wrapper `<div :style="sceneSwapStyle">`
  (`App.vue:136`) — a plain reactive style binding, **not** a `<Transition>`
  around the `<Suspense>`.
- **Why VT is the WRONG move here (re-confirmed, three independent reasons):**
  1. **The async-loader re-break.** The extensive `App.vue:108-135` comment
     records that a `<Transition mode="out-in">` / `<KeepAlive>` around the keyed
     `<Suspense>`-of-`defineAsyncComponent` **never fired the async loader** —
     amiga/square/easing/spring shipped a **BLANK viewport** (B.W3's headline
     blocker). A VT scene-swap would need to wrap the same swap and re-introduce
     the exact wrapper that broke the loader. The dogfooded sibling-style fade is
     the *fix* for that break.
  2. **Snapshot-vs-active-animation conflict.** The guide forbids transitioning
     elements with active animations (*"view transitions operate on snapshots;
     any animations will appear paused"*, `same-document-transitions.md`). Every
     keyframes scene is a **live animation host** (the cube rotates, the amiga
     sphere spins, the easing tracks animate). A VT would snapshot a *paused*
     frame mid-animation → visibly wrong. The engine-driven cross-dissolve
     composites the *live* paint instead.
  3. **inv-ζ dogfood posture.** The demo's mandate is "the engine eats its own
     dog food" — the scene-swap fading via `SpringProgress` (the engine's own
     spring) **is** the shop-window demonstrating the engine drives real
     transitions. Replacing it with the platform VT API would *remove* a
     dogfood, not add modernity. The cube `cqw` visualizer and the spring
     scene-swap are the inv-ζ exemplars (E `modern-web-findings.md:214`).
- **SOTA gap / opportunity:** none that survives the three constraints. The
  *honest* opportunity is narrower and optional (B-1).
- **Disposition:** **ALREADY-SOTA / KEEP the dogfood.** Re-confirm D-5's
  record-withheld with the current-baseline lens: same-document VT is now
  Baseline (§1.2) so the *availability* objection is gone, but the *three
  structural* objections (async-loader, snapshot-vs-active, dogfood) stand
  unchanged → KEEP. The PRM contract is already honored (`respectReducedMotion:
  true`, `App.vue:244`).
- **Isomorphism note:** keeping the dogfood = zero pixel change. The withheld VT
  swap would *change* the transition (snapshot cross-fade vs live spring
  cross-dissolve) and *risk* the async-load regression — not befitting.

### S-4-context · The demo has NO scroll surface — native scroll-driven is structurally N-A — **ALREADY-SOTA**

- **File:** `demo/@/components/custom/editor-shell/EditorShell.vue:3` —
  `class="editor-shell relative grid h-dvh max-h-dvh w-dvw overflow-hidden …"`.
  The router is hash-mode (`demo/app/router.ts:1,27` `createWebHashHistory`).
- **Finding:** the entire demo is a **fixed, non-scrolling full-viewport editor**
  (`h-dvh max-h-dvh overflow-hidden`). There is **no page-scroll axis** for a
  native `scroll()` timeline to bind to. The only scroll surfaces are *internal
  panel lists* (`overflow-y-auto` on `EasingTarget.vue`, the keyframe timeline,
  the asset panel — `grep` hits in §evidence) — component-local scrollers, not a
  document scroll a scrollytelling/reveal effect would key on. Confirmed:
  `grep @view-transition|::view-transition|animation-timeline|scroll-reveal|
  useScrollProgress demo/` (excl dist) = **0** — the demo ships **no** scroll-driven
  CSS and **no** scroll-reveal, correctly, because it has no scroll story.
- **SOTA gap / opportunity:** none — a non-scrolling editor *should not* carry
  scroll-driven animations. Manufacturing a scrollytelling page would be
  gold-plating against the demo's actual shape (a fixed editing surface).
- **Disposition:** **ALREADY-SOTA** — the absence is correct, not a gap.
- **Isomorphism note:** n/a.

#### B-1 · OPTIONAL — an `easing`-scene `view()`-driven reveal as a shop-window demo — **BOOK** (PE-only, measure-first)

- **File:** `demo/easing/EasingTarget.vue:58` — *"Multi-track mode: scrollable
  list"* (an `overflow-y-auto` list of easing tracks).
- **Spec/guide:** `scroll-entry-exit-effects` (the `view()` entry-reveal recipe
  with the `@supports` guard + IO fallback).
- **The opportunity (narrow, optional):** the easing multi-track list is the one
  demo surface that *has* a real (component-local) scroll axis. As a **shop-window**
  for native scroll-driven CSS, the tracks *could* fade/scale-in on scroll via the
  glass-ui `[data-scroll-reveal]` recipe / `useStaggerReveal`
  (native `view()` where supported, IO fallback otherwise — glass-ui already ships
  both, S-2). This would dogfood the *constellation's* scroll-driven layer in the
  keyframes demo.
- **Why BOOK, not SHIP:**
  1. **PE-only / decorative.** The reveal is pure decoration on an *internal*
     scroller — the guide says decorative effects should be **progressive
     enhancement with NO fallback** (don't pay the IO-fallback weight). It must
     not gate any content.
  2. **glass-ui owns the recipe** (inv-16) — the keyframes demo would *consume*
     `useStaggerReveal`/`[data-scroll-reveal]`, never hand-roll the
     `animation-timeline:view()` CSS. If glass-ui's recipe isn't yet trivially
     consumable here, that's a glass-ui adoption edge (book OUT), not a demo patch.
  3. **Measure-first.** It adds motion to a dense list — verify it doesn't fight
     the existing track animations or hurt INP; gate behind `prefers-reduced-motion`.
- **Disposition:** **BOOK** → E demo-polish (trigger: a demo-motion-polish wave
  OR the glass-ui scroll-reveal recipe becoming a one-line consume). Low value —
  the demo's primary story is the editor, not scrollytelling.
- **Isomorphism note:** additive decoration on one internal scroller; gated by
  `@supports` + PRM so non-supporting/reduced-motion users see the current
  static list (isomorphic on those paths).

---

## 4. value.js hand-off — none

This lane audited scroll-driven + view-transition surfaces. Those are
**DOM-platform / presentation** concerns owned by keyframes.js's `Timeline`
family (engine) and glass-ui's motion-core (substrate). **value.js carries no
scroll-driven or view-transition surface** — it is the CSS-value/color/easing/
math layer beneath the animation engine. `grep` for `scroll`/`view-transition`/
`animation-timeline` in the value.js consumption surface returns nothing
relevant to this lane. **FOLD-VALUEJS-HANDOFF: 0 items.** (Easing L2 `linear()`
— which *would* be value.js's — is out of this lane's scope; it belongs to the
easing/units lane.)

---

## 5. Disposition summary (the ledger)

| # | Title | File:line | Disposition | Trigger / owner |
|---|---|---|---|---|
| S-1 | ScrollTimeline native ARCH-kill — re-confirmed stronger | `timeline.ts:36-197` · D `deferred-ledger.md:185` | **ALREADY-SOTA** (re-affirm KILL) | re-open: off-thread DOM-CSS consumer → now glass-ui-owned |
| S-2 | scroll/VT substrate lives in glass-ui; engine defers | `index.ts` (0 VT exports) · glass-ui `motion-core.js:290` | **ALREADY-SOTA** | — (boundary correct) |
| S-3 | scroll-morph recipe — JS morph SOTA-correct | `docs/scroll-morph.md:1-115` | **ALREADY-SOTA** | — |
| F-1 | scroll-morph.md — note native-`view()` progress-source option | `docs/scroll-morph.md` | **FOLD-E** (doc-only) | E-tail doc-polish |
| G-1 | no engine `supportsScrollTimeline`/reveal recipe | `index.ts` | **GAP-NAMED** (low; do-not-build) | re-open: keyframes-direct consumer asks; owner = glass-ui |
| S-4 | demo scene-swap dogfoods SpringProgress not VT — KEEP | `App.vue:108-149,231-249` | **ALREADY-SOTA** (re-confirm D-5) | — (3 structural objections stand) |
| S-4-ctx | demo has no scroll surface (fixed viewport) | `EditorShell.vue:3` · `router.ts:27` | **ALREADY-SOTA** | — |
| B-1 | optional `easing` `view()` reveal as shop-window | `EasingTarget.vue:58` | **BOOK** (PE-only, measure-first) | demo-motion-polish wave / glass-ui consume |

**Net.** ENGINE: zero GAP that forces work — the ScrollTimeline arch-kill is
**re-confirmed and strengthened** against live 2026 baseline; the VT/scroll-CSS
substrate is correctly owned by glass-ui (≥3 consumers); one doc-fold (F-1) and
one recorded-not-built GAP (G-1, owned outward). DEMO: the scene-swap VT
withholding is **re-confirmed KEEP** (same-doc VT is now Baseline but the three
structural objections stand); the demo correctly ships zero scroll-driven CSS
(no scroll surface); one **optional** PE-only reveal demo booked (B-1).
**This lane found the stack SOTA-aligned — honestly, not by manufacturing
work.** The single highest-signal result is that the charter's "re-examine the
ScrollTimeline kill with current baseline" resolves to *the kill is more correct
now than when recorded*, on generality + baseline grounds both.

---

## 6. Evidence appendix (re-runnable)

```sh
# Engine ships zero VT/scroll-CSS surface (boundary clean):
grep -rn "startViewTransition\|view-transition\|animation-timeline\|scroll()\|view()" \
  src/ --include="*.ts" | grep -v "scrollY\|getScrollY"     # → only ScrollTimeline JS poll

# glass-ui owns the substrate (motion-core exports):
grep "startViewTransition\|useScrollProgress\|supportsScrollTimeline\|supportsViewTimeline" \
  node_modules/@mkbabb/glass-ui/dist/motion-core.js          # → line 290

# glass-ui native-first feature-detect (the @supports double-probe):
sed -n '12,18p' node_modules/@mkbabb/glass-ui/dist/platformSupport-ByFnknMm.js

# Demo has no scroll surface + no scroll-driven CSS:
grep -n "h-dvh max-h-dvh w-dvw overflow-hidden" \
  demo/@/components/custom/editor-shell/EditorShell.vue       # → :3 (fixed viewport)
grep -rn "@view-transition\|animation-timeline\|scroll-reveal\|useScrollProgress" \
  demo/ --include="*.vue" --include="*.css" --include="*.html" | grep -v dist   # → 0

# Demo scene-swap is SpringProgress, not VT:
sed -n '231,249p' demo/app/App.vue                            # → SpringProgress dogfood

# Hash router (no document navigation → cross-doc VT N-A):
grep -n "createWebHashHistory" demo/app/router.ts             # → :1,27
```

Baseline cites: modern-web-guidance `scroll-entry-exit-effects` /
`scrollytelling` (scroll-driven = limited, Firefox-unsupported, Interop 2026) ·
`same-document-transitions` (VT same-doc Baseline 2025-10-14) ·
`cross-document-transitions` (cross-doc limited, no Firefox). WebSearch (Jun
2026, MDN/web.dev) corroborates both.
