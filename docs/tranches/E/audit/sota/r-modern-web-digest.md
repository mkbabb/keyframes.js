# Modern-Web-Guidance Digest — keyframes.js demo + engine

**Lane:** modern-web-guidance comprehensive digest (Tranche E SOTA audit)
**Source of truth:** `modern-web-guidance@latest` (Baseline-dated platform guidance), W3C specs, live code (`file:line`).
**Scope:** every guide in the `modern-web-guidance` corpus relevant to an animation / CSS / perf demo, with its Baseline date and the *keyframes-demo applicability* of each.
**inv-16:** keyframes.js findings → `FOLD-E`; value.js findings → `FOLD-VALUEJS-HANDOFF`; this file only.

---

## 0. Method & corpus

`modern-web-guidance list` returns ~100 guides across `accessibility · built-in-ai · css · css-layout · forms · html · passkeys · performance · privacy · security · user-experience · webmcp`. I triaged the whole list against the keyframes.js surface (an SPA Vue 3 animation demo + a JS animation engine + value.js CSS parser), retrieved every guide that plausibly touches animation / CSS / perf / overlays / scroll / inputs, and grounded applicability in the live tree.

**The demo at a glance (grounded):**

- SPA, hash-routed (`createWebHashHistory`, GitHub Pages) — `demo/app/router.ts:26`. Scenes rendered via `KeepAlive` + `<component :is>` (`demo/app/router.ts:10` comment; `demo/app/App.vue`). Scenes lazy-loaded via `defineAsyncComponent` — `demo/app/scenes.ts:27`.
- Overlays via **reka-ui ^2.9.9** (radix-vue successor) + **vaul-vue** (drawer) + **@mkbabb/glass-ui** — `package.json`; Dialog/Popover/DropdownMenu/Tooltip come from glass-ui/reka, *not* native `<dialog>`/`popover`. Confirmed: `grep` for `<dialog>`/`showModal`/`::backdrop`/`popover` attr in source → **zero** hits (only z-index token names).
- CSS architecture already uses `@layer base`/`@layer utilities` — `demo/@/styles/style.css:207,240` — and design tokens. Good.
- Engine already ships first-class `prefers-reduced-motion` plumbing (`src/animation/internal/reduced-motion.ts`, consumed by `smooth/spring/group/engine/numeric/playback`) and a dev-only **LoAF observer** (`demo/app/loaf-observer.ts`) reading `long-animation-frame`.

**Headline:** the demo is largely modern in *architecture* (layers, tokens, lazy scenes, reduced-motion, INP instrumentation) but leaves a cluster of **declarative-CSS platform wins on the table** — native scroll-driven animation, View Transitions for scene switches, `@starting-style`/`allow-discrete` for overlays, `content-visibility` for the KeepAlive panes, `interpolate-size`, native `color-mix()`/`oklch()` in author CSS, and `fetchpriority`. None are correctness bugs; all are SOTA-leverage opportunities. See dispositions per row.

---

## 1. The authoritative checklist (Baseline dates + applicability)

Legend — disposition: **FOLD-E** (actionable in a keyframes.js tranche) · **GAP-NAMED** (real gap, named, may defer) · **BOOK** (worth a backlog note) · **ALREADY-SOTA** (we do this) · **N/A** (out of scope for this demo). Baseline dates are as reported by the guide at retrieval time.

### 1A. Scroll & motion (the engine's home turf)

| Guide id | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| `scrollytelling` | scroll-driven anim Baseline-ish, Safari 26 (Sep 2025) | The engine's `ScrollTimeline` (`src/animation/timeline.ts:163`) is a **JS rAF sampler** (`getScrollY`/`getViewportHeight` injectable, `:171`), NOT a delegate to native `view-timeline`/`animation-timeline`/`scroll()`/`view()`. No CSS scroll-driven animation anywhere (`grep animation-timeline\|view-timeline\|scroll()\|view()` in source → 0). Demo has no scrollytelling section to showcase the engine. | **FOLD-E** (see §2.1) |
| `scroll-entry-exit-effects` | Chrome 115 (Jul 2023), Safari 26 (Sep 2025) | Reveal-on-scroll for the long editor/sidebar content; pure-CSS `animation-timeline: view()`. Not used. | **GAP-NAMED** |
| `scroll-progress-indicator` | Chrome 115 (Jul 2023), Safari 26 (Sep 2025) | A pure-CSS `animation-timeline: scroll()` progress bar would be a *perfect dogfood demo* for "the platform does what keyframes.js does, declaratively" — and a teaching contrast. Not present. | **FOLD-E** (demo showcase) |
| `shrinking-header-on-scroll` | Chrome 115 (Jul 2023), Safari 26 (Sep 2025) | TopDock could shrink on scroll via scroll-driven anim. Low value (dock is fixed/compact already). | **BOOK** |
| `scroll-position-aware-elements` | Chrome 133 (Feb 2025) — `scroll-state()` container query | "Has the user scrolled at all" affordances via `@container scroll-state()`. Narrow support; niche here. | **N/A** |
| `scrollability-affordance-hints` | Chrome 133 (Feb 2025) — `scroll-state(scrollable:)` | Scroll-shadow / arrow hints on the scrollable control panels via `@container scroll-state()`. Currently nothing. | **BOOK** |
| `soft-edge-content-fade` | Masks Baseline 2023-12-07 (Chrome 120 / Safari 15.4) | Fade the scrollable sidebar/keyframe-list edges with `mask: linear-gradient(...)` instead of overlay divs. Widely available, cheap, classy. | **FOLD-E** (small) |
| `scroll-target-on-load` / `scroll-snap-*` | scroll-snap Baseline | Editor lists / carousels — no snap UX present. | **N/A** |
| `defer-work-until-scroll-ends` | `scrollend` event | If any per-scroll handler exists, debounce on `scrollend`. No heavy scroll handlers found. | **N/A** |

### 1B. Overlays, top-layer & entry/exit animation

| Guide id | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| `animate-element-entry-exit` | `@starting-style` + `transition-behavior: allow-discrete` Baseline **2024-08-06** (Chrome 117, FF 129, Safari 17.4/17.5) | Tab-panel enter is a hand-rolled `@keyframes enter` + `tw-animate-css` (`demo/@/styles/design-idioms.css:135`). Native `@starting-style`/`allow-discrete` is the SOTA way to animate display/DOM-insert toggles. Reka/Vue `<Transition>` handle most of this today, so this is *idiom alignment*, not a bug. | **GAP-NAMED** (idiom) |
| `animate-to-from-top-layer` | `@starting-style` 2024-08-06; `overlay` Chrome 117; Popover Baseline **2025-01-27** | Dialogs/Popovers/Dropdowns are reka-ui-portalled (JS top-layer emulation), not native top-layer + `overlay`/`@starting-style`. Migrating to native `popover`/`<dialog>` + CSS entry/exit would shed JS, but reka gives a11y for free — a deliberate trade. Worth a *named* evaluation, not a mandate. | **GAP-NAMED** |
| `animated-select-picker` / `branded-select-styling` / `custom-select-picker-layouts` / `rich-media-picker` | customizable `<select>` Chrome 135 (Apr 2025) | EasingSelect / ResponsiveSelect are custom reka selects (`demo/@/components/custom/EasingSelect.vue`). Native customizable `<select>` is too new (Chrome-only) to adopt; current approach is correct for cross-browser. | **N/A** |
| `animate-to-intrinsic-sizes` | `interpolate-size` / `calc-size()` **Chrome 129 only (Sep 2024)** | Collapsible panels / accordion (control panels) animating to `height: auto`. Chrome-only → progressive enhancement only. Low priority. | **BOOK** |

### 1C. Container queries, `:has()`, anchor positioning

| Guide id | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| `size-aware-styling` | Container queries Baseline **2023-02-14** (widely available) | Demo uses `container-type: inline-size` in exactly **one** place — `demo/@/styles/style.css:242` (the AnimationVisualizer cqw trick per MEMORY). The control panels / asset panels / editor shell are prime container-query candidates (they live in narrow sidebars and wide mains). Under-used given it's fully Baseline. | **FOLD-E** |
| `style-parent-with-has` | `:has()` Baseline 2023-12 (widely available); `:user-invalid` Baseline 2023 | **Zero** `:has()` in source (`grep :has(` → 0). Parent-state styling (e.g., editor-shell state, panel-open states) is done with explicit `data-*`/classes. `:has()` could remove some JS-driven class toggling. Opportunistic. | **BOOK** |
| `anchor-positioning-tab-underline` | **Not natively supported by any major browser yet** (per guide) | Animated tab underline / active-dock indicator. Anchor positioning is Chrome-only; reka handles positioning. Do NOT adopt anchor positioning yet. | **N/A** (not Baseline) |

### 1D. Performance — CRP / LCP / INP / CWV

| Guide id | Baseline / API | Demo applicability | Disposition |
|---|---|---|---|
| `optimize-script-priority` | `fetchpriority` (Chrome 102+, broad) | `index.html` bootstrap is `<script type="module" src="./main.ts">` (deferred-by-default — correct). No `fetchpriority`. Module script is the LCP-critical graph root; `fetchpriority="high"` would be a marginal, safe win. | **BOOK** |
| `optimize-image-priority` | `fetchpriority` on `<img>` | Scene icons are `<img>` in the dock (`demo/@/components/custom/dock/TopDock.vue:173,195,212`); timeline hover preview `<img>` (`.../TimelineHoverPreview.vue:5`); asset viewport `<img>` (`AssetViewport.vue:59`). These are tiny (`w-5 h-5`) — not LCP. The true LCP is the hero (canvas/cube). No image needs `fetchpriority`; none should get `loading="lazy"` (all above fold). **Correctly nothing to do** — note it. | **ALREADY-SOTA** (by absence) |
| `optimize-preload-priority` | `<link rel=preload fetchpriority>` | Instrument Serif font is loaded non-blocking via the `media="print" onload` swap (`demo/app/index.html:26-32`) — a *correct, idiomatic* non-blocking pattern. Fira Code self-hosted via glass-ui. No CSS-discovered LCP image to preload. Solid. | **ALREADY-SOTA** |
| `break-up-long-tasks` | `scheduler.yield()` Chrome 129 / FF 142 (Aug 2025), limited | The engine already references `scheduler.yield()` for INP relief (per `loaf-observer.ts` header: "the causal half of the engine's `scheduler.yield()` INP-relief claim, B.W4 §4"). Confirm fallback to `setTimeout` exists for non-Chromium. | **ALREADY-SOTA** (verify fallback — see §2.5) |
| `schedule-tasks-by-priority` | `scheduler.postTask()` Chrome 129 / FF 142 | Frame compilation / parse could be `postTask('background')`. Opportunistic; engine-side. | **BOOK** |
| `identify-heavy-scripts` / `identify-inp-causes` | `long-animation-frame` Chrome 123 (Mar 2024); Event Timing Baseline **2025-12-12** | `demo/app/loaf-observer.ts` already implements the LoAF `PerformanceObserver` with script attribution, buffered, feature-detected, dev-only DCE. **Textbook-correct** to the guide. | **ALREADY-SOTA** |
| `defer-rendering-heavy-content` | `content-visibility` Baseline **2025-09-15** (Chrome 108, FF 130, Safari 26) | The editor/control panels and (esp.) Monaco-backed CSS editor are heavy. `content-visibility: auto` + `contain-intrinsic-size` on off-screen panels would cut layout/paint. Currently only `contain: style` on `CubeTarget.vue:164`. | **FOLD-E** |
| `faster-spa-view-transitions` | `content-visibility: hidden` (same Baseline) | **Direct hit.** The KeepAlive scene switcher (3-5 scenes: cube/amiga/square/easing/spring) is the *exact* small-fixed-view-count case the guide blesses for `content-visibility: hidden` on inactive views (caches render state, instant switch-back). KeepAlive already retains VDOM; pairing with `content-visibility: hidden` on the inactive scene wrappers is the platform-level complement. | **FOLD-E** |
| `efficient-background-processing` | `contentvisibilityautostatechange` | Pause the **rAF render loops** (cube/amiga Three.js, spring/easing targets) when their scene scrolls/switches off — engine already has `managed`/visibility hooks; tie a pause to visibility. Battery/CPU win for the multi-scene SPA. | **FOLD-E** |
| `interactions-in-complex-layouts` | layout-thrash avoidance | Timeline scrubbing / matrix editor read-then-write batching. Spot-check for forced reflow in hot drag paths (orbital-drag, KeyframeTimeline). | **BOOK** |
| `batch-analytics-events` / `full-session-analytics` / `*-foreground-time` / `*-visibility-state` | telemetry | No analytics in demo. | **N/A** |

### 1E. View Transitions (cross-cutting — not a single guide but referenced)

| Topic | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| Same-document **View Transitions API** (`document.startViewTransition`) | Baseline-newly (Chrome 111 Mar 2023; Safari 18 Sep 2024; FF 144+ rolling) | Scene switching in `App.vue` (`switchScene`) is a JS swap with no morph. Wrapping the scene swap in `startViewTransition` + `view-transition-name` on shared chrome (dock, title) gives a free cross-fade/morph between scenes. **Strong demo win** and on-brand (an animation library whose own demo uses the platform's animation primitive). Feature-detect + progressive-enhance. `grep startViewTransition` → 0. | **FOLD-E** (see §2.2) |

### 1F. CSS authoring idioms (`css` guide cross-cuts)

| Topic | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| `color-mix()` / `oklch()` / `oklab()` in **author CSS** | color-mix Baseline 2023-05; oklch/oklab Baseline 2023-05 | **Zero** `color-mix`/`oklch`/`oklab` in demo styles (`grep` over `demo/@/styles/*.css` → 0,0,0). The engine *interpolates* in oklab internally (value.js), but the demo's own tints/hovers/glass tokens are not using native `color-mix()`. The `css` guide explicitly recommends `color-mix()` for tints and `currentColor`. Adopting `color-mix()` for hover/disabled/tint states would shrink the token table and is fully Baseline. | **FOLD-E** (small, idiom) |
| `text-wrap: balance` / `pretty` | balance Baseline 2023-09 (Safari 17.5); pretty newer | **Zero** `text-wrap` in source. Hero headline / descriptions / labels would benefit from `text-wrap: balance` (headlines) and `pretty` (body). Cheap polish. | **FOLD-E** (small) |
| Logical properties | Baseline (long) | Demo uses physical props predominantly (only 2 logical hits in `style.css`). The `css` guide recommends logical props *where RTL-flip is desired*. Most of this demo is LTR-canvas geometry where physical is correct — do NOT blanket-convert. Note as deliberate. | **ALREADY-SOTA** (deliberate) |
| `@layer` cascade architecture | Baseline | Already used (`style.css:207,240`). Matches the `css` guide's `@layer reset,base,...` recommendation. | **ALREADY-SOTA** |
| `@property` typed custom properties | Baseline-newly (Chrome 85; Safari 16.4; FF 128 Jul 2024) | **Zero** `@property` in source. Any custom property the demo *animates/transitions* (e.g. gradient angle, rainbow-ribbon vars, `--scale-hover`) should be registered with `@property` so it interpolates smoothly instead of discretely. The rainbow-gradient ribbon (`AnimationControlsGroup.vue:90`) is a candidate. | **FOLD-E** |
| `prefers-reduced-motion` in CSS | Baseline | `design-idioms.css:121` `.scale-on-hover` and `CubeTarget.vue:140` honor it; engine honors it pervasively. Good coverage; audit that scroll-driven additions (§2.1) also gate on it (the scrollytelling guide makes this MANDATORY). | **ALREADY-SOTA** (carry forward) |

### 1G. Forms / inputs / a11y / scrollbars (lower relevance — demo is not form-heavy)

| Guide id | Baseline | Demo applicability | Disposition |
|---|---|---|---|
| `forms`, `validate-input-after-interaction`, `required-field-feedback`, `accessible-error-announcement`, `select-menu-interaction` | `:user-valid`/`:user-invalid` Baseline 2023 | The demo's inputs are sliders/number-fields/editable-labels/CSS-paste textarea, not validated forms. `:user-invalid`-style deferred feedback applies only to the CSS-paste dialog if it validates. Low surface. | **N/A** (mostly) |
| `form-fields-automatically-fit-contents` | `field-sizing: content` Chrome 123 (Mar 2024) | `EditableLabel.vue` (rename labels) could use `field-sizing: content` to auto-grow instead of JS width measurement. Chrome-only → enhancement. | **BOOK** |
| `brand-consistent-forms` | `accent-color` Baseline | Range sliders / checkboxes in controls → `accent-color` to brand them without custom components. Quick. | **BOOK** |
| `adapt-scrollbar-to-contrast-preferences` | `scrollbar-color` Baseline **2025-12-12** (Chrome 121, FF 64, Safari 26.2) | Scrollable panels could set `scrollbar-color`/`scrollbar-width` to match the glass theme and high-contrast prefs. Newly Baseline; `::-webkit-scrollbar` fallback if targeting wider. | **BOOK** |
| `highlight-text-ranges` | Custom Highlight API Baseline **2026-03-24** (Chrome 105, FF 149, Safari 17.2) | The CSS code editor (Monaco) already does its own highlighting; the value.js *parser* could power a CSS-Custom-Highlight-API view of parsed tokens in a lightweight (non-Monaco) preview — niche, novel demo idea. | **BOOK** (novel demo) |
| `accessibility` (focus mgmt, semantic HTML, touch targets) | — | General hygiene; reka-ui provides most a11y. Scene-switch focus management is the one spot to verify (View-Transitions/`content-visibility:hidden` must keep focus correct — guide §"Manage Focus"). | **FOLD-E** (verify alongside §2.2/§2.3) |

### 1H. Out-of-scope categories (named for completeness)

`built-in-ai` (Prompt/Summarizer/Translator/language-detection), `passkeys` (all), `webmcp` (agentic-forms/-javascript-tools), `privacy`, `security`, `autofill-*`, `passkey-*`, `support-global-calendar-systems`, `swipe-to-remove`, `stack-drill-down`, `visually-stable-font-fallbacks`/`-mixed-fonts`, `visually-texture-content`, `shaped-cutouts`, `search-hidden-content` — **N/A** to an animation/CSS demo. (`visually-stable-font-fallbacks` is *marginally* relevant given the Instrument-Serif Google-Fonts swap — a `size-adjust`/`@font-face` descriptor on the fallback would prevent CLS during the print→all swap; **BOOK** that one.)

---

## 2. Named opportunities — the high-value cluster (FOLD-E detail)

### 2.1 — Native scroll-driven animation alongside the JS `ScrollTimeline`

- **Where:** `src/animation/timeline.ts:163` (`ScrollTimeline` is rAF-sampled JS; `getScrollY`/`getViewportHeight` injectable, `:171-173`). No CSS `animation-timeline`/`view-timeline`/`scroll()`/`view()` anywhere.
- **SOTA gap:** the platform now drives scroll-linked animation **off the main thread** declaratively (`animation-timeline: scroll()/view()`), Baseline-progressing (Chrome 115 Jul 2023; Safari 26 Sep 2025). keyframes.js's `ScrollTimeline` is a *general-purpose progress driver* (good — it works on any object, not just DOM, and is testable via injected callbacks), but the **demo** never showcases the native primitive, and the engine doesn't offer a "delegate to native when eligible" path the way `waapi.ts` delegates time-based animations.
- **Perf/elegance rationale:** native scroll-driven animation is compositor-threaded → zero main-thread cost, no rAF, no INP risk. A demo scene that contrasts "keyframes.js `ScrollTimeline` (JS, works on anything)" vs. "native `animation-timeline: scroll()` (CSS, DOM-only, free)" is *exactly* the library's teaching mission.
- **Disposition:** **FOLD-E** — (a) demo: add a scroll-progress / scrollytelling showcase using native `scroll()`/`view()` with `@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))` feature-detect and a `prefers-reduced-motion: reduce` kill-switch (MANDATORY per the scrollytelling guide); (b) engine BOOK: consider a WAAPI-eligibility extension where a DOM-target scroll animation can attach a native `ScrollTimeline`/`ViewTimeline` object.
- **Isomorphism:** additive. The JS `ScrollTimeline` stays the universal fallback / non-DOM path; native is an opt-in fast lane. Pixels stable.

### 2.2 — View Transitions for SPA scene switching

- **Where:** `demo/app/App.vue` `switchScene` + `demo/app/router.ts` (KeepAlive `<component :is>`). `grep startViewTransition` → 0.
- **SOTA gap:** same-document View Transitions (`document.startViewTransition`, Baseline-newly: Chrome 111, Safari 18, FF rolling) turn the abrupt scene swap into a morph/cross-fade with shared `view-transition-name` chrome — for free, GPU-composited.
- **Perf/elegance rationale:** removes any JS cross-fade bookkeeping; the browser snapshots old/new and tweens. On-brand: an animation lib whose demo uses the platform's transition primitive.
- **Disposition:** **FOLD-E** — wrap the scene swap in `startViewTransition` (feature-detected, progressive enhancement), name the persistent dock/title, gate on `prefers-reduced-motion`. Verify focus management on swap (a11y guide).
- **Isomorphism:** behavior-additive; if unsupported, falls back to today's instant swap. Stable.

### 2.3 — `content-visibility` for the KeepAlive scenes + heavy panels

- **Where:** inactive KeepAlive scene wrappers; Monaco editor + control/asset panels. Only `contain: style` exists today (`demo/cube/CubeTarget.vue:164`).
- **SOTA gap:** `faster-spa-view-transitions` guide blesses `content-visibility: hidden` on inactive views for *exactly* this small-fixed-view-count SPA (caches render state, instant switch-back, CPU-cheap). `defer-rendering-heavy-content` blesses `content-visibility: auto` + `contain-intrinsic-size` for off-screen heavy content. `content-visibility` is Baseline 2025-09-15.
- **Perf/elegance rationale:** skips layout+paint for hidden scenes/off-screen panels → big INP/CWV win on a multi-scene + Monaco-heavy demo. RAM trade-off is bounded (5 scenes) — within the guide's "DO" envelope, no eviction needed.
- **Disposition:** **FOLD-E** — `content-visibility: hidden` (+ `position: absolute` if needed) on inactive scene wrappers; `content-visibility: auto` + `contain-intrinsic-size` on off-screen panels. Pair with §2.4 to pause their rAF.
- **Isomorphism:** pixels stable when visible; only off-screen cost changes. Manage `aria-hidden`/focus per guide.

### 2.4 — Pause rAF loops off-screen via `contentvisibilityautostatechange`

- **Where:** scene render loops (Three.js cube/amiga, easing/spring targets) and `useRafLoop.ts` (`demo/@/components/custom/animation-controls/composables/useRafLoop.ts`).
- **SOTA gap/rationale:** `efficient-background-processing` — pause canvas/WebGL/rAF when the host is not being rendered; resume just-in-time. Battery + CPU + INP win for the SPA. The engine already has `managed` semantics; wire visibility → pause.
- **Disposition:** **FOLD-E** (demo-side wiring; engine already exposes the controls).
- **Isomorphism:** invisible work paused only; on return, resumes. Stable.

### 2.5 — Confirm `scheduler.yield()` has a non-Chromium fallback

- **Where:** engine INP-relief path referenced by `demo/app/loaf-observer.ts` header ("`scheduler.yield()` INP-relief claim").
- **SOTA note:** `break-up-long-tasks` flags `scheduler.yield()` as **limited** (Chrome 129 / Edge 129 / FF 142 Aug 2025) and makes a `setTimeout` fallback MANDATORY. The LoAF observer is already correctly feature-detected and dev-only DCE'd. Just *verify* the yield path degrades on Safari/older.
- **Disposition:** **FOLD-E** (verification + fallback if missing). Likely already handled — confirm.
- **Isomorphism:** N/A (perf-only).

### 2.6 — `@property`-register animated custom properties

- **Where:** rainbow-gradient ribbon (`AnimationControlsGroup.vue:90`, `RibbonBar.vue:47`) and any transitioned `--*` (e.g. `--scale-hover`). `grep @property` → 0.
- **SOTA gap/rationale:** unregistered custom properties interpolate **discretely**. `@property` (Baseline-newly; Chrome 85, Safari 16.4, FF 128) with `syntax`/`inherits`/`initial-value` makes them animate smoothly and type-check. Classic SOTA gradient-angle / value-tween enabler.
- **Disposition:** **FOLD-E** (small, targeted to actually-animated custom props).
- **Isomorphism:** smoother interpolation only; static pixels unchanged.

### 2.7 — `color-mix()` / `oklch()` in author CSS; `text-wrap` polish; `mask` edge-fades; container queries breadth

Bundled small FOLD-E idiom wins, each fully Baseline and low-risk:
- **`color-mix()`** for hover/disabled/tint states (`grep` → 0 in demo styles) — `css` guide recommended; shrinks token table. The engine already thinks in oklab; let the *author CSS* speak native `color-mix(in oklab, …)` too.
- **`text-wrap: balance`** (headlines) / **`pretty`** (body) — `grep` → 0.
- **`mask: linear-gradient()`** soft-edge fades on scrollable panels instead of overlay divs (`soft-edge-content-fade`, Masks Baseline 2023).
- **Container queries** beyond the single `style.css:242` site — the sidebar/main control & asset panels are textbook `size-aware-styling` candidates (Baseline 2023-02-14).
- **`scrollbar-color`/`scrollbar-width`** themed scrollbars (newly Baseline 2025-12-12; webkit fallback).

---

## 3. Where we are ALREADY SOTA (do not manufacture work)

- **Reduced-motion** is first-class and pervasive in the engine (`src/animation/internal/reduced-motion.ts` consumed by `smooth/spring/group/engine/numeric/playback`) and present in demo CSS (`design-idioms.css:121`, `CubeTarget.vue:140`). Carry this gate forward into any scroll-driven/View-Transition additions.
- **LoAF / INP instrumentation** (`demo/app/loaf-observer.ts`) is textbook-correct to `identify-heavy-scripts` / `identify-inp-causes`: `long-animation-frame`, `buffered:true`, script attribution, feature-detected, dev-only DCE.
- **Critical-path / font loading**: non-blocking Google-Fonts `media="print" onload` swap + `<noscript>` fallback (`demo/app/index.html:26-32`), self-hosted Fira via glass-ui, pre-paint dark-mode FOUC guard (`index.html:38-49`), real module-file bootstrap (not inline, to survive tree-shaking) — matches the `performance` CRP guide.
- **`@layer` cascade architecture** + design tokens (`style.css:207,240`) matches the `css` guide.
- **Lazy scene loading** via `defineAsyncComponent` (`scenes.ts:27`) — correct code-splitting.
- **Image priority**: scene icons are tiny and above-fold; LCP is the hero canvas → *correctly* no `fetchpriority`/`loading=lazy` needed. (Noted so it isn't "fixed" into a regression.)
- **Customizable `<select>` / anchor positioning**: *correctly avoided* — Chrome-only, not Baseline; reka-ui custom components are the right cross-browser call today.

---

## 4. value.js hand-off candidates (FOLD-VALUEJS-HANDOFF)

This lane is demo/platform-guidance-centric; value.js touches are light, but two surface:

- **`FOLD-VALUEJS-HANDOFF` — native `color-mix()` parse/serialize parity.** If the demo (§2.7) and engine begin emitting `color-mix(in oklab, …)` / `oklch()` in author-authored CSS that flows back through value.js parsing, confirm value.js's color parser round-trips `color-mix()` and `oklch()`/`oklab()` per CSS Color L4/L5 (it already computes in oklab internally; parsing the *function forms* is the question). Propose a value.js tranche to formalize `color-mix()` parse + serialize coverage.
- **`FOLD-VALUEJS-HANDOFF` — `@property` `syntax` grammar for registered custom props.** If keyframes.js animates `@property`-registered custom properties (§2.6), value.js's value parser should understand the `syntax` descriptor's component grammar (`<length>`, `<color>`, `<angle>`, `+`/`#` multipliers) to interpolate correctly. Propose a value.js tranche to align its value-type registry with the `@property` `syntax` grammar (CSS Properties & Values API L1).

*(Both are conditional on adopting §2.6/§2.7; flagged so the value.js owner can scope a tranche rather than us writing value.js.)*

---

## 5. One-line dispositions roll-up

- **FOLD-E (engine/demo, do):** native scroll-driven showcase (§2.1) · View Transitions scene-switch (§2.2) · `content-visibility` for KeepAlive + panels (§2.3) · pause rAF off-screen (§2.4) · verify `scheduler.yield` fallback (§2.5) · `@property` animated vars (§2.6) · `color-mix`/`text-wrap`/`mask`/container-queries-breadth/`scrollbar-color` idioms (§2.7) · container-query breadth (§1C) · scene-switch focus mgmt (§1G).
- **GAP-NAMED (real, may defer):** `scroll-entry-exit-effects` reveal · native top-layer overlays vs reka trade-off · `@starting-style`/`allow-discrete` idiom alignment.
- **BOOK:** `scheduler.postTask` prioritized frame-compile · `:has()` for parent-state · `interpolate-size` accordions (Chrome-only) · `field-sizing` for EditableLabel (Chrome-only) · `accent-color` form theming · scroll-state container queries · Custom-Highlight-API parser preview (novel) · `size-adjust` font fallback for the Serif swap · layout-thrash audit in drag paths.
- **ALREADY-SOTA:** reduced-motion · LoAF/INP · font/CRP loading · `@layer` · lazy scenes · image-priority (by correct absence) · avoiding non-Baseline `<select>`/anchor.
- **FOLD-VALUEJS-HANDOFF:** `color-mix()`/`oklch()` parse-serialize parity · `@property` `syntax` grammar in the value-type registry.
