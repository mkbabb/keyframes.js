# r5 — SOTA Research: Web Animation (mid-2026) vs keyframes.js 5.1.0

**Lane:** r5 (SOTA RESEARCH — web animation) · **Tranche S pass1 · research**
**Subject:** keyframes.js 5.1.0 (branch `tranche-s-dev`, HEAD 18e8617) measured against the mid-2026 web-animation frontier.
**Method:** web research (Motion/GSAP/anime.js/Rive/Lottie/Theatre.js + the CSS/WAAPI platform frontier) cross-checked against the actual kf surface (README.md, `src/animation/**` zone barrels, `waapi/eligibility.ts`, `scroll/grammar.ts`, `compile/backward.ts`).

---

## Executive summary

keyframes.js 5.1.0 sits in a genuinely differentiated position: it is the **only** engine in the field whose internal model *is* parsed CSS `@keyframes`, which is what makes its round-trip (ingest live CSS → drive with physics/perceptual-color/scroll → compile back to zero-runtime CSS with honest refusals) structurally possible. Against the two libraries it most resembles — **Motion** (motion.dev) and **GSAP** — kf is competitive-to-leading on three axes SOTA cannot touch: (1) CSS-grammar-native bidirectional `@keyframes`, (2) `animate-anything` over a value.js-typed model, (3) the emerging-CSS resolver (`if()`/`@function`/`env()` handled in JS *ahead* of platform ubiquity). Its light/heavy boundary (a ~2–4 kB value.js-free physics tier behind a dynamic engine split) directly mirrors Motion's mini/hybrid strategy and is arguably cleaner (CI-gated by `proof:boundary`).

Where kf **lags** is not in its core engine but in the **authored-motion and platform-integration surface** that shipped or matured across 2025–2026 while kf was refactoring internals (Tranches Q/R):

1. **View Transitions** (same-doc now Baseline; cross-doc + typed + `view-transition-class` shipping) — kf has **zero** integration (`grep startViewTransition` → nothing). This is the single biggest 2025–26 platform primitive kf ignores.
2. **Text-splitting / SplitText** — GSAP's SplitText went free + a11y-rewritten (April 2025); anime.js v4 shipped a `text` module. kf has **no** text primitive. This is the most-requested "one thing every animation lib has" that kf lacks.
3. **`@starting-style` + `transition-behavior: allow-discrete`** entry/exit (Baseline Newly Available across all three engines) — kf's presets (`fadeIn`, `slideIn`) predate and don't emit/leverage the native discrete-transition path; `compile/backward.ts` has no `@starting-style` awareness.
4. **`animation-trigger`** (Chrome 145) — kf *parses and round-trips* the grammar token (`scroll/grammar.ts:120`) but does not **drive** it; the type carries `trigger` without a scene backend proven for it.
5. **Anchor-positioned motion** (Baseline 2026) — no kf surface composes `anchor()`/`position-anchor` with motion.

None of these are architectural blockers; all are additive uplifts that ride kf's existing zones. kf ships **no legacy/deprecated live code** — the `@deprecated` PKG-3 aliases were correctly dropped in 5.0.0 (`index.ts:62`, `engine/animation.ts:51`). The one hygiene defect found is **doc drift**: `src/animation/CLAUDE.md` still describes the *pre-R flat-file* layout (`engine.ts`, `group.ts`, `waapi.ts`, `numeric.ts` at the root) that no longer exists — it was not refreshed for the 7-zone partition.

Severity note: the "lags" are **medium/high leverage, low risk** — they are net-new surface, not corrections. The single **high**-severity finding is the CLAUDE.md drift (it actively misleads agent-authoring, which is a stated kf value). Everything else is opportunity.

---

## Capability matrix — kf 5.1.0 vs SOTA (mid-2026)

| Capability | keyframes.js 5.1.0 | Motion (motion.dev) | GSAP (free, post-Webflow) | anime.js v4 | Platform / other |
|---|---|---|---|---|---|
| CSS `@keyframes` **parse** (author-grammar native) | ✅ **Unique** — value.js grammar, memoized (`README:215`) | ❌ bespoke tween model | ❌ bespoke | ❌ bespoke | native (CSSOM) |
| **Ingest** live CSS / running animation (takeover) | ✅ **Unique** — `fromStyleSheets`/`fromLiveAnimations`/`adoptRunning` (`ingest/`) | ❌ | ❌ | ❌ | `getAnimations()` (read-only) |
| **Compile → zero-runtime CSS** (parser run backward) | ✅ **Unique** — `compileToCSS` + honest refusals (`compile/backward.ts`) | ❌ | ❌ | ❌ | — |
| animate **anything** (objects, DOM, data) | ✅ value.js-typed | ✅ hybrid (DOM/three/canvas) | ✅ (any prop) | ✅ | — |
| Spring physics | ✅ analytic solver, SwiftUI + Motion `fromDuration` idioms (`physics/spring/`) | ✅ | ✅ (Inertia/physics2) | ✅ `createSpring` | proposed `spring()` (not shipped) |
| Spring → **CSS `linear()`** serialization | ✅ **one solver, two emissions** (`springLinearStops`/`springTimingFunction`) | ✅ auto-generates `linear()` | via helpers | — | `linear()` Baseline (Chrome/FF; Safari lagging) |
| WAAPI delegation + eligibility gate | ✅ rich gate + WebKit `linear()` carve-out (`waapi/eligibility.ts`) | ✅ hybrid engine core | partial (CSSPlugin) | partial | native |
| Native `ScrollTimeline`/`ViewTimeline` bridge | ✅ additive (`createNativeTimeline` + `attachNativeScrollTimeline`) | ✅ scroll() | ScrollTrigger (JS) | ✅ | Chrome/Edge only; FF/Safari ❌ |
| Scroll grammar parse/round-trip | ✅ `animation-timeline`/`-range`/`-scope`/`-trigger` (`scroll/grammar.ts`) | ❌ (imperative) | ❌ (imperative) | ❌ | native CSS |
| Group / Sequence (WAAPI L2 model) | ✅ `AnimationGroup` + `Sequence` + weighted blend | timelines | ✅ **timeline (best-in-class)** | ✅ `createTimeline` | polyfill-only |
| Perceptual color (oklab) + densify | ✅ **Unique** ΔE-gated densify on compile | sRGB | sRGB | sRGB | native mixes sRGB |
| Layout animation (FLIP) | ✅ `flip`/`flipShared` over `ElementMorph` | ✅ **layout + LazyMotion** | Flip plugin | — | — |
| Drag / gesture / inertia | ✅ `drag`/`drag2D`/`decay` over spring | ✅ gestures | Draggable + Inertia | ✅ `createDraggable` | — |
| MotionPath / DrawSVG / MorphSVG | ✅ all three (`svg/`) | path | ✅ MotionPath/DrawSVG/**MorphSVG** | ✅ svg module | `offset-path` native |
| **Text split / SplitText** | ❌ **GAP** | (via utils) | ✅ **SplitText (free, a11y, −50%)** | ✅ `text` module | — |
| **View Transitions** integration | ❌ **GAP** (no `startViewTransition`) | (guides) | (guides) | — | Baseline same-doc; cross-doc/typed shipping |
| **`@starting-style`/allow-discrete** entry/exit | ❌ **GAP** (presets predate it) | — | — | — | Baseline Newly Available |
| **`animation-trigger`** driving | ⚠️ parsed, not driven | — | ScrollTrigger callbacks | — | Chrome 145 only |
| **Anchor-positioned** motion | ❌ **GAP** | — | — | — | Baseline 2026 |
| Emerging-CSS resolve (`if()`/`@function`/`env`) | ✅ **Unique** JS resolver (`resolve/`) | ❌ | ❌ | ❌ | `if()` Chrome 137, `@function` Chrome 139 |
| Authored/visual-editor runtime | ❌ (by design) | — | — | — | Rive (WASM/state-machines), Lottie, Theatre.js |
| Light bundle (value.js-free tier) | ✅ ~2–4 kB, `proof:boundary`-gated | ✅ mini 2.3 kB / hybrid 17 kB | ~monolithic (tree-shakes) | ✅ tree-shakable ESM | — |
| Framework `scope` isolation helper | ❌ | React `m`/`LazyMotion` | — | ✅ `createScope` | — |

**Reading the matrix:** kf's five "Unique" cells (parse, ingest, compile, perceptual color, emerging-CSS resolve) are the moat and are *real*. The five ❌ **GAP** rows (SplitText, View Transitions, `@starting-style`, `animation-trigger` driving, anchor motion) are the Tranche-S uplift target. Everything else is at parity or a defensible design choice.

---

## Findings

### F1 — [HIGH · hygiene/doc-drift] `src/animation/CLAUDE.md` describes the dead pre-R flat-file layout

**Evidence:** `src/animation/CLAUDE.md` "## Files" block lists `engine.ts`, `group.ts`, `waapi.ts`, `numeric.ts`, `spring.ts`, `timeline.ts`, `animate.ts`, `motion-path.ts`, … at the animation/ root. The actual 5.1.0 tree (verified `ls src/animation/`) is the **7-zone partition**: `engine/`, `group/`, `waapi/`, `physics/`, `orchestration/`, `compile/`, `resolve/`, `ingest/`, `scroll/`, `svg/`, `presets/`, `internal/`. The doc's dependency note even says value.js is imported "in `engine.ts`, `frame-compiler.ts`, `group.ts`…" — none of those paths exist post-R.

**Why it matters (SOTA lens):** kf explicitly markets an agent-authoring surface (`llms.txt`, `validate()`/`explain()`). A stale architecture doc is the *most* load-bearing thing to keep true, because agents read it as ground truth. This is the one finding that is a defect, not an opportunity.

**Proposal:** Refresh `src/animation/CLAUDE.md` to the zone layout as part of Tranche S's "deeper sub-zoning" wave (it will be re-touched anyway when `compile/backward/`, `compile/easing/`, `engine/css/` sub-zones land). Fold into the same wave that re-writes the zone map.

**Severity:** HIGH (correctness of the authoritative internal doc; actively misleads).

---

### F2 — [HIGH · GAP/leverage] No View Transitions integration — the biggest 2025–26 platform primitive kf ignores

**Evidence:** `grep -rn "startViewTransition\|ViewTransition\|view-transition" src/` → **zero hits**. kf has no wrapper over `document.startViewTransition()`, no `view-transition-name` orchestration, no typed-transition (`:active-view-transition-type`) helper.

**SOTA state (mid-2026):** Same-document View Transitions are **Baseline** (Chrome 111, Safari 18, Firefox 144). Cross-document (`@view-transition { navigation: auto }`) ships in Chromium 126 (FF/Safari ignore the at-rule). `view-transition-class` (shared-group styling) is in Chromium 125+/Safari 18.4+. Typed transitions (`ViewTransition.types` + `:active-view-transition-type`) ship in Chromium + Safari (not FF 144). This is *the* modern way to do shared-element / page transitions — the exact territory kf's `flipShared` (shared-element FLIP) occupies with a JS FLIP.

**The kf angle (why this is high-leverage, not just catch-up):** kf's `flipShared` and View Transitions are **the same idea at two altitudes**. kf can (a) offer a `viewTransition(mutate, opts)` light helper that feature-detects `startViewTransition` and **falls back to `flipShared`** where unavailable (FF/Safari cross-doc gap) — a *conservative-correct dispatch* exactly like its scroll backend `dispatchScrollBackend`; and (b) — the moat move — teach `compileToCSS` to **emit `::view-transition-*` `@keyframes` + `view-transition-class`** from a kf group, so an authored kf transition compiles to a zero-runtime native View Transition. No other library can compile *to* View Transitions because none has a CSS-native backward half.

**Where it lands:** new `orchestration/view-transition/` (light dispatch + FLIP fallback) + a `compile/` emitter branch. Risk: **low-medium** (feature-detect + existing FLIP fallback; the compile emitter is additive and refusal-gated).

**Severity:** HIGH (leverage).

---

### F3 — [MEDIUM-HIGH · GAP] No text-splitting / SplitText primitive — the one thing every peer now ships

**Evidence:** `grep -rln "splitText\|SplitText\|split("` in `src/animation/` → only incidental `.split()` string ops in resolve/compile, no text-splitting primitive. kf's `presets` include `typewriter`/`typingCursor`/`rainbowText` (`presets/`) but those animate a single element, not split graphemes/words/lines.

**SOTA state:** GSAP's **SplitText** was rewritten in 2025 (−50% size, native screen-reader a11y via `aria`, masking for reveals) and is now **free** — the headline of the Webflow-free release. anime.js v4 ships a first-class **`text`** module. Split-into-chars/words/lines + staggered reveal is the single most common "hero animation" recipe on the web.

**The kf angle:** kf already has the two hard halves — `stagger` (the distribution) and the physics/CSS engine (the per-fragment animation). A `splitText(el, { by: "chars"|"words"|"lines", a11y: true })` LIGHT primitive in `orchestration/` that returns fragment elements + a ready `stagger` cohort would close the gap with *less* new code than GSAP needed, and the fragments animate through the exact same engine. a11y (preserve the readable text for screen readers) is the part to get right — GSAP's rewrite proves it's the hard part.

**Where it lands:** new `orchestration/split-text/` (light — pure DOM partition + returns a `stagger`-ready cohort). Risk: **low** (DOM-only; a11y is the care-item).

**Severity:** MEDIUM-HIGH.

---

### F4 — [MEDIUM · GAP] No `@starting-style` / `transition-behavior: allow-discrete` entry-exit path; presets predate the native primitive

**Evidence:** `grep -rn "starting-style\|allow-discrete\|transition-behavior" src/animation/` → **zero hits**. kf's entrance/exit presets (`fadeIn`, `slideIn`, `blurIn/Out`, `README:270`) are pure `@keyframes` and don't know about `@starting-style`. `compile/backward.ts` emits `@keyframes` + `animation` shorthand but never emits an `@starting-style` block or `allow-discrete`.

**SOTA state:** `@starting-style` + `transition-behavior: allow-discrete` became **Baseline Newly Available** (Chrome 117+, Safari 17.5+, Firefox 129+). Animating *in from* `display: none` (popovers, dialogs, toasts) without JS is now the native idiom — web.dev "Now in Baseline: animating entry effects."

**The kf angle:** two moves. (1) An entry/exit *authoring* helper that emits the `@starting-style { … }` + `transition-behavior: allow-discrete` couplet (the boilerplate everyone gets wrong — you need *both*). (2) Teach **`compileToCSS`** to recognize an entrance preset targeting a toggled/`display`-driven element and emit the `@starting-style` form — i.e. kf's compile can produce the *modern* zero-runtime entry animation, not just an `animation` shorthand. This is squarely in the moat: compile-to-*current*-CSS.

**Where it lands:** `compile/` emitter option + a small `presets`/authoring helper. Risk: **low** (additive, feature-detect on the consume side).

**Severity:** MEDIUM.

---

### F5 — [MEDIUM · partial impl] `animation-trigger` is parsed and round-tripped but not driven

**Evidence:** `scroll/grammar.ts:120` types `"animation-trigger"?: string` and `serializeScrollOptions` round-trips it; `scene.ts:427` comment lists `trigger` on `CSSTimelineOptions`. But there is no `ScrollScene` backend that *drives* a trigger (play-forwards / play-backwards on scroll-offset crossing) — the grammar is parsed, the behavior is not realized.

**SOTA state:** `animation-trigger` (with `play-forwards`/`play-backwards`/`repeat`/`alternate`) lands in **Chrome 145** (Chrome/Edge only, mid-2026) per the `animation-triggers-1` draft; it's the "fire once when it enters view" primitive the community has wanted (distinct from scrub-linked timelines).

**The kf angle:** kf's `ScrollScene` already resolves scroll ranges against the DOM (`scroll/scene.ts`). Driving a *trigger* (a discrete state machine — idle→active→done on range crossing, with backward/repeat) is a small extension of the same scroll resolution, and it gives kf a **cross-browser** `animation-trigger` (Chrome-only natively) — a real "kf does it everywhere" story, mirroring how kf's `ScrollScene` fills the FF/Safari scroll-timeline gap.

**Where it lands:** `scroll/scene.ts` trigger backend + `dispatchScrollBackend` picking native when available. Risk: **low-medium** (the grammar already exists; this is the driver).

**Severity:** MEDIUM.

---

### F6 — [LOW-MEDIUM · GAP] No anchor-positioned motion; `env()`/emerging-CSS resolve is ahead of platform but under-marketed

**Evidence:** `grep -rn "anchor" src/animation/` → only "gate-anchored" prose in comments; no `anchor()`/`position-anchor`/`@position-try` surface. Conversely, kf's `resolve/` zone (`resolveFunctionCall`, `hasPhase2Node`) resolves `if()`/`@function`/`env()` in JS.

**SOTA state:** CSS Anchor Positioning is **Baseline 2026** (Chrome 125+, Firefox 132+, Safari 18.2+). Motion tied to an anchor (a tooltip that springs from its trigger, a popover that morphs from its anchor rect) is an emerging pattern. Separately, `if()` (Chrome 137) and `@function` (Chrome 139) are **Chromium-only** — kf's JS resolver for these is *ahead* of cross-browser platform support, which is a marketing asset kf under-states.

**The kf angle:** (a) low-priority: an anchor-aware `ElementMorph`/`flipShared` variant that reads an anchor's rect as the source (composes cleanly with existing FLIP). (b) higher-value + zero-code: **surface the emerging-CSS resolver as a headline** — "kf resolves `if()`/`@function`/`env()` in animations *today*, cross-browser, while the platform is Chromium-only." This is a positioning finding more than a code finding.

**Where it lands:** (a) `orchestration/` optional; (b) README/`llms.txt` framing. Risk: **low**.

**Severity:** LOW-MEDIUM.

---

### F7 — [LOW · parity confirmation] Light/heavy split ≈ Motion's mini/hybrid — kf is at or ahead of the bundle-strategy SOTA

**Evidence:** kf's `proof:boundary`-gated split (`README:397`; `index.ts` LIGHT set) yields a value.js-free physics tier (`SpringProgress`, `SmoothProgress`, `NumericAnimation`, `ElementMorph`, timelines, `stagger`/`flip`/`drag`/`decay`/`Sequence`) reached statically, with the CSS engine behind one `await loadAnimationEngine()`.

**SOTA state:** Motion's headline strategy is exactly this — `animate` mini (2.3 kB) vs hybrid (17 kB), and `m` + `LazyMotion` (~4.6 kB initial). kf's boundary is *stricter* (CI-enforced zero static value.js edge, not just tree-shaking hope) and its light tier is broader (full spring/drag/sequence physics, not just DOM tween).

**Proposal:** No code change — this is a **confirmed lead**. Tranche S should *market* it against Motion's numbers explicitly (README already gestures at it). Consider publishing a measured light-entry byte count next to Motion's 2.3 kB for a head-to-head.

**Severity:** LOW (info / positioning).

---

### F8 — [LOW · info] No authored-runtime story (Rive/Lottie/Theatre.js) — correctly out of scope, but the *export* seam is a latent moat

**Evidence:** kf has no Lottie/Rive importer and no visual timeline editor (by design — kf is a code-first engine).

**SOTA state:** Rive (WASM state-machines, data-binding, GPU) and Lottie (AE→JSON, ~300k weekly downloads) own the *designer-authored* runtime niche; Theatre.js owns visual-timeline editing for R3F/3D. These are a different product category and kf should **not** chase them.

**The latent angle:** kf's `Sequence` transport + `compileToCSS` is the one engine that could **import a Lottie/Theatre keyframe set and compile it to zero-runtime CSS** (Lottie→CSS is a real unmet need — Lottie is heavy JSON + a runtime). This is a *future* moat extension, not a Tranche-S ask; flagged so it isn't lost.

**Severity:** LOW (info / roadmap seed).

---

### F9 — [LOW · watch-item] `linear()` Safari support + the WebKit HW-accel carve-out remain the spring-on-compositor soft spot

**Evidence:** `waapi/eligibility.ts:210` holds any `linear()`-twinned easing on the rAF path for WebKit (CE-1.0 — WebKit refuses HW-accel for custom `linear()`). Research corroborates Safari's `linear()` support lagging Chrome/Firefox.

**SOTA state:** Chrome/Edge 113+ and Firefox 112+ support `linear()`; Safari trails. kf's compile output and its spring→`linear()` compositor path are therefore *degraded on WebKit* — correctly and honestly (kf falls back to the true rAF spring), but it means kf's headline "springs on the compositor" is a Chrome/FF story, not universal.

**Proposal:** No fix (the carve-out is correct). **Re-verify the WebKit behavior each Safari release** during Tranche S — if Safari ships HW-accel `linear()`, the CE-1.0 carve-out (`eligibility.ts:210`) becomes removable, unlocking compositor springs on WebKit. Add a dated re-check note.

**Severity:** LOW (watch-item).

---

## Obsolete / legacy audit (explicit)

**kf ships no deprecated live code.** The only `@deprecated` references in `src/animation/` are *tombstone comments* recording that the PKG-3 aliases (`Animation`, `ScrollTimeline`/`ScrollTimelineOptions`) were **removed** in 5.0.0 (`index.ts:62`, `index.ts:236`, `group/group.ts:4`, `orchestration/timeline/index.ts:179`, `engine/animation.ts:51`). This is the NO-LEGACY posture done right.

**Nothing kf ships is made obsolete by SOTA** in the sense of "delete it." Two soft calls:

- **`Sequence`/`AnimationGroup` mapping to WAAPI Level 2** (`README:689`): the README already correctly notes `SequenceEffect` is proposed for *deletion* upstream (csswg-drafts#9557) and that kf deliberately does **not** mirror the unsettled L2 class shapes. This is the right posture — keep it, don't pin to L2 names. No action.
- **The JS `ScrollScene` fallback** is *not* obsoleted by native scroll-driven timelines because FF/Safari still don't ship them (mid-2026). Keep the fallback; it's load-bearing. The `createNativeTimeline` additive fast-lane is already the correct dispatch.

**One thing to *reframe*, not remove:** the preset catalog's entrance/exit animations (`fadeIn`, `slideIn`, `blurIn`) are not *obsolete*, but they're now the "old way" relative to `@starting-style` entry effects (F4). Tranche S should position them as "works everywhere / compiles to `@starting-style` where supported," not silently leave them pre-2024.

---

## Tranche-S implications (wave-shaped recommendations)

Ordered by **leverage ÷ risk**. Each names the zone it lands in and the kf-moat tie-in (so it's a kf move, not generic catch-up).

**Wave S-A · Doc & architecture truth (do first, cheap, unblocks agents)**
- Refresh `src/animation/CLAUDE.md` to the 7-zone layout (F1). Fold into the same wave as the deeper sub-zoning (`compile/backward/`, `compile/easing/`, `engine/css/`) so the doc is rewritten once against the *final* S structure, not the R one. **Risk: none.**

**Wave S-B · View Transitions as the flagship uplift (highest leverage)**
- `orchestration/view-transition/`: a light `viewTransition(mutate, opts)` that feature-detects `startViewTransition` and falls back to existing `flipShared` (F2) — a `dispatchScrollBackend`-style conservative-correct dispatch.
- `compile/` emitter branch: compile a kf group → native `::view-transition-*` `@keyframes` + `view-transition-class`, refusal-gated like the oklab densify. **This is the moat move** — kf is the only engine that can compile *to* View Transitions. **Risk: low-medium.**

**Wave S-C · Text-splitting primitive (closes the most-visible gap)**
- `orchestration/split-text/`: `splitText(el, { by, a11y })` → fragment cohort + ready `stagger`; fragments animate through the existing engine (F3). Get a11y right (GSAP's rewrite is the reference). **Risk: low.**

**Wave S-D · Modern-CSS entry/exit + compile currency**
- Teach `compileToCSS` + a small authoring helper to emit `@starting-style` + `transition-behavior: allow-discrete` (F4). Reframe the entrance presets as "compiles to the native entry-effect where supported." **Risk: low.**

**Wave S-E · Scroll trigger driver (finish what the grammar started)**
- `scroll/scene.ts`: drive `animation-trigger` (idle→active→done, backward/repeat) so the already-parsed token (`grammar.ts:120`) *does* something; native where Chrome 145+ ships, kf-scene everywhere else (F5). **Risk: low-medium.**

**Wave S-F · Positioning & measurement (near-zero code, real narrative)**
- Market the emerging-CSS resolver (`resolve/`) as "kf animates `if()`/`@function`/`env()` cross-browser *today*, platform is Chromium-only" (F6b). Publish a measured light-entry byte count vs Motion's 2.3 kB mini (F7). Add the dated WebKit-`linear()` re-check note to `eligibility.ts` (F9). **Risk: none.**

**Deferred / roadmap seeds (not S waves — recorded so they aren't lost)**
- Anchor-positioned `ElementMorph`/FLIP source (F6a) — nice-to-have, low demand.
- Lottie/Theatre → `compileToCSS` importer (F8) — a *future* moat extension; genuinely differentiated but out of S scope.

**The through-line:** every S-B..S-E wave is chosen because kf's existing moat (CSS-native bidirectional model, honest-refusal compile, conservative-correct backend dispatch, `stagger`/`flip` physics) makes kf's version *structurally better* than the SOTA library's — not merely a copy. kf should not chase Rive/Lottie/Theatre (authored-runtime is a different product) nor GSAP's plugin breadth wholesale; it should ship the handful of primitives (View Transitions, SplitText, `@starting-style`, `animation-trigger`) that its round-trip engine can do in a way no one else can: **compile them back to zero-runtime, current-spec CSS.**
