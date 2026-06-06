# Tranche F SOTA audit — modern-web frontier (re-digest, post-D+E)

**Lane id:** `r-modern-web-2026` · **Branch at audit:** `tranche-e-impl` (D+E
IMPLEMENTED + CLOSED). **Scope:** the LATEST `modern-web-guidance` catalog +
developer.chrome.com guidance, diffed against what `docs/tranches/E/audit/`
already found. **inv-16:** I may PROPOSE value.js changes (hand-off); I write
ONLY this keyframes.js doc and make ZERO source edits. **inv ε:** every
keyframes claim is `file:line`-grounded; every Baseline date is the live guide
string at retrieval (`npx modern-web-guidance@latest retrieve <id>`, run this
audit).

This is a **re-digest, not a re-derivation.** Tranches D + E already digested the
corpus (E `audit/modern-web-findings.md`, `audit/sota/r-modern-web-digest.md`,
`audit/sota/r-scroll-view-transitions.md`) and E.W4/W9/W11 *shipped* the
high-value adoptions. My job is narrow and honest: **what is NEW or changed in
the catalog since the E digest, and does any of it move the post-E state.** The
headline answer is **the post-E demo is already exemplary** on the modern-web
axis — most of this doc is "ALREADY-SOTA / KEEP, do not manufacture work." Three
genuinely-NEW catalog items survive scrutiny as worth recording; one is a
SHIP-in-F demo candidate; the rest are RECORD/BOOK/KILL with stated reasons.

---

## 0. What E LANDED (the baseline this lane diffs against)

E did not leave the modern-web surface as gaps — it shipped them (E `FINAL.md`,
verified live):

- **View Transitions** (W11): `demo/app/useSceneTransition.ts:32` routes the
  scene-swap through glass-ui's `startViewTransition`, feature-detected, with
  `view-transition-name: scene-subject` on the scene host (`App.vue:332`), PRM
  degrade in glass-ui's `view-transition.css`, focus-route on `finished`
  (`useSceneTransition.ts:33-35`), and the `SpringProgress` dogfood preserved as
  the no-VT fallback (`useSceneSwap.ts:1-40`).
- **`@starting-style` + `transition-behavior: allow-discrete`** (W11): a whole
  dedicated scene — `demo/app/scenes/StartingStyleScene.vue` +
  `demo/spring/StartingStyleTarget.vue:140-158` — with the FROM-state, the
  discrete `display` exit, and the separate `transition-behavior` declaration
  exactly per the `css` guide MANDATORY.
- **`content-visibility: hidden`** for the inactive Monaco pane (W11 B-2):
  `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:286`
  with the `@supports not (content-visibility: hidden)` → `display:none`
  fallback (`:292`) — the guide's exact PE discipline.
- **Individual transform properties** (`translate`/`rotate`/`scale`) in author
  CSS: `StartingStyleTarget.vue:128-129`, `design-idioms.css:164`,
  `CubeScene.vue:195-197`.
- **`color-mix(in …)`** in author CSS: `StartingStyleTarget.vue:124-125` (+ the
  9-file set E recorded).
- **Engine reference-impl** primitives (D): `internal/scheduler.ts`
  (`scheduler.yield` ladder), `internal/reduced-motion.ts` (the PRM gate),
  `waapi.ts` (compositor delegation with a faithfulness gate),
  `springLinearStops.ts` (`linear()` physics).

**The E ARCH-kill that HOLDS:** native scroll-driven CSS
(`animation-timeline:scroll()/view()`) is re-confirmed KILL for the engine — the
`Timeline` family is a caller-polled progress sampler over *arbitrary objects*,
strictly more general than a DOM-CSS timeline, and the native path is still not
Baseline (Firefox-gated, Interop-2026). See E `r-scroll-view-transitions.md`
S-1; **do not re-litigate.** I re-verified the Baseline string this audit (below)
and it is unchanged-in-substance.

---

## 1. The catalog DELTA — what is NEW since the E digest

The E digest (`r-modern-web-digest.md`) enumerated ~100 guides. The live catalog
(`npx … list`, this audit) has **grown and re-organized** the `user-experience`
category in particular. The net-new / renamed guides that touch an
animation/CSS demo, with their LIVE Baseline strings:

| Guide id (live) | Was (E digest) | Baseline (live string) | Feature-detect |
|---|---|---|---|
| `declarative-button-actions` | (only `declarative-dialog-popover-control`, "H2 open/close") | **Invoker Commands: Newly available, Baseline 2025-12-12** (Chrome/Edge 135 Apr-25, FF 144 Oct-25, Safari 26.2 Dec-25) | `'commandForElement' in HTMLButtonElement.prototype`; `invokers-polyfill` (dynamic-import-if-absent) |
| `individual-transform-properties` | (mentioned in passing as a `css` bullet) | **Widely available, Baseline 2022-08-05** (Chrome 104, FF 72, Safari 14.1) | `@supports (translate: 0px)` |
| `directional-navigation-transitions` | (not present — VT was a single bare-callback row) | **VT types** ride View Transitions: **Newly available, Baseline 2025-10-14**. `types`/`:active-view-transition-type()` per-engine within that. | `'startViewTransition' in document` (the types arg degrades) |
| `group-element-transitions` | (not present) | same VT Baseline 2025-10-14; uses `view-transition-class` + `::view-transition-group(.class)` | as VT |
| `consistent-cross-document-transitions` | `cross-document-transitions` (limited) | Cross-doc VT **limited** (Chrome 126, Safari 18.2, **no Firefox**); `blocking="render"` + `<link rel=expect>` | N-A (SPA) |
| `interest-triggered-action-previews` / `interest-triggered-tooltips` | `interest-triggered-action-previews` (D-7, "limited") | **Interest invokers: limited** (Chrome/Edge 142 Oct-25 only, **no FF/Safari**) | `'interestForElement' in …`; `interestfor` polyfill |
| `child-state-based-styling` / `dynamic-sibling-styling` / `content-based-styling` | `style-parent-with-has` | `:has()` widely available (Baseline 2023-12) | `@supports selector(:has(*))` |
| `scrollability-affordance-hints` / `scroll-position-aware-elements` | same | **`container-type: scroll-state`** CQ — Chrome 133 Feb-25, **not Baseline** | `@supports (container-type: scroll-state)` |
| `design-token-reactivity` | (not present) | `@container style()` — **not Baseline** (Chrome-only) | `@supports` / selector fallback |
| `animate-to-intrinsic-sizes` | `animate-to-intrinsic-sizes` | **`interpolate-size`/`calc-size()`: limited** (Chrome/Edge 129 Sep-24 only, **no FF/Safari**) | `@supports (interpolate-size: allow-keywords)` |

The two **substantive** Baseline *changes* since the E digest authored
(2026-06-05): **Invoker Commands crossed into Baseline 2025-12-12** (all four
engines), and **same-document View Transitions are confirmed Baseline
2025-10-14** (E already noted this). Everything else is either unchanged-limited
(interest invokers, interpolate-size, scroll-state) or already-Baseline-and-
already-adopted (individual transforms, `:has()`, `@starting-style`,
`content-visibility`).

---

## 2. Findings (deep, grounded, dispositioned)

### F-MW-1 · Invoker Commands crossed into Baseline — the declarative-controls fit — **MEASURE-FIRST / BOOK**

- **NEW since E:** the E digest knew only `declarative-dialog-popover-control`
  ("H2 declarative open/close", `modern-web-findings.md:71`). The live guide
  `declarative-button-actions` documents the **custom-command** half of the
  Invoker Commands API: `command="--spin"` + `commandfor="id"` + a `command`
  event — declarative, application-specific actions with **zero JS listener
  wiring at the call site**, now **Baseline 2025-12-12** across all four engines.
- **The kf fit (verified):** the demo's animation controls are a cluster of
  imperative `@click` handlers — `AnimationMenuBar.vue` (5 `@click`),
  `PlaybackRibbon.vue` (2), plus `AnimationControlsControls.vue`,
  `TimingFunctionPanel.vue`, `KeyframeCard.vue`, `KeyframeTimeline.vue`. These
  are play/pause/reverse/reset/select-animation — exactly the "custom
  application action" shape the guide's *Custom Animation Controls* example
  (`command="--spin"` / `--grow` / `--reset`) demonstrates. There is currently
  **zero** `commandfor`/`command` in the demo (`grep` = 0, this audit).
- **Why NOT a forced SHIP:** three honest constraints.
  1. **Vue idiom collision.** `@click="play()"` in a `<script setup>` SFC is the
     *idiomatic Vue* binding; rewriting to `command="--play"` + a document-level
     `command` listener would *move* the wiring out of the template into a
     global registry — for a Vue SPA that is **less** legible, not more (the
     guide's value-prop is "interactivity as soon as HTML is parsed", which a
     hydrated Vue app does not need — the handlers are bound on mount anyway).
     The §Mandate forbids legacy *and* forbids gold-plating; a wholesale
     `@click`→Invoker rewrite is the latter.
  2. **glass-ui seam (inv-16).** The play/pause/reset buttons are glass-ui
     components in many places; a declarative-command refactor of the *button
     primitive* is glass-ui's call, not a demo patch (mirrors the D-13 dialog
     OUT).
  3. **No measured win.** There is no INP or correctness problem with the
     current `@click` handlers (the demo's heavy path is parse/format, already
     yielded — E.W4). Adopting Invokers buys *declarativeness*, not perf.
- **The narrow honest opportunity:** ONE teaching surface. keyframes.js is an
  *animation* library; a single, self-contained **"declarative controls"**
  showcase — a `<button command="--spin" commandfor="…">` panel that drives an
  `Animation` via the `command` event — would *dogfood the platform's
  declarative-action primitive against the engine* (the inv-ζ "demo eats the
  platform" posture), and is now Baseline-safe with the documented
  `invokers-polyfill` dynamic-import fallback. This is a **shop-window** demo,
  not a refactor of the existing controls.
- **Disposition:** **BOOK** (the wholesale rewrite — KILL it as gold-plating) +
  **MEASURE-FIRST/SHIP-candidate** for the single declarative-controls showcase
  IF a demo-content wave wants a new teaching scene. Trigger to SHIP: a
  demo-elevation wave with appetite for a new scene; gate behind the
  `'commandForElement' in HTMLButtonElement.prototype` detect + dynamic
  `invokers-polyfill` import (guide's exact ladder). Do NOT touch the existing
  `@click` controls.
- **value.js:** none.

### F-MW-2 · View-Transition **types** API — the demo ships the bare callback — **SHIP-in-F (small, demo) / MEASURE-FIRST**

- **NEW since E:** the E digest + E.W11 knew `document.startViewTransition(cb)`
  as a **bare callback**. The live catalog adds the **types frontier**:
  `directional-navigation-transitions` (`startViewTransition({update, types})` +
  the `:active-view-transition-type(forward|backward)` pseudo-class) and
  `group-element-transitions` (`view-transition-class` +
  `::view-transition-group(.class)`). Same VT Baseline (2025-10-14) — the
  *types* are an additive, progressively-degrading argument.
- **The kf fit (verified):** `demo/app/useSceneTransition.ts:32` calls
  `startViewTransition(() => mutate(id))` — the **bare-callback** form. The
  scene-swap is a *navigation between scenes* (cube → amiga → square → easing →
  spring), which is **precisely** the `directional-navigation-transitions` use
  case: a `types: ['forward'|'backward']` derived from the scene-order index
  would let the cross-fade become a **directional slide** (new scene slides in
  from the side the user is moving), reinforcing the spatial map. The glass-ui
  `startViewTransition` helper would need to forward a `types` array (it
  currently takes only a `mutate` fn — `useSceneTransition.ts:2` import).
- **The honest constraint:** the *transition definition* (the
  `:active-view-transition-type()` keyframes, the `::view-transition-group(root)`
  shared settings) is **CSS that lives in glass-ui's `view-transition.css`** (the
  demo deliberately adds no VT CSS — `App.vue:328` comment). And the glass-ui
  `startViewTransition` signature is glass-ui's API. So the *directional* upgrade
  is **mostly glass-ui-owned (inv-16)**: the demo can only pass a `types` array
  IF glass-ui's helper accepts one. **If it does** (verify against the installed
  glass-ui `motion-core` — out of this lane's keyframes-only write scope), this
  is a ≤5-line demo change (derive a direction from scene index, pass it). **If
  it does not,** it is a glass-ui hand-off, booked OUT.
- **Disposition:** **SHIP-in-F (small)** *conditional* on glass-ui's
  `startViewTransition` already accepting `types` (a one-call verification a
  wave can do); otherwise **value.js-adjacent OUT → glass-ui hand-off**. Either
  way **MEASURE-FIRST** against the three E objections that KEPT the spring
  dogfood (`r-scroll-view-transitions.md` S-4): the directional types ride the
  *root* group cross-fade, NOT the active per-scene animation, so the
  "snapshot-vs-active-animation" objection (the cube is mid-rotate) **still
  applies** — a directional slide of a *paused snapshot* of a spinning cube may
  read worse than the current calm cross-fade. **Verify it composes before
  shipping; PRM-gate (already in glass-ui's `view-transition.css`).**
- **value.js:** none (glass-ui seam if any).

### F-MW-3 · Individual transform properties — engine passes them through; demo uses them — **ALREADY-SOTA (with one engine-correctness note)**

- **NEW emphasis since E:** the live `css` guide and
  `individual-transform-properties` (Baseline **2022-08-05**, *widely
  available*) now make individual `translate`/`rotate`/`scale` the **MANDATORY**
  compositor-friendly way to animate a *single* transform axis, and the
  `directional-navigation-transitions` guide's keyframes use them too.
- **The kf fit (verified):**
  - **Demo:** already adopted — `StartingStyleTarget.vue:128-129,145-146`,
    `design-idioms.css:164`, `CubeScene.vue:195-197`. ALIGNED.
  - **Engine:** the default renderer `transformTargetsStyle`
    (`src/animation/utils.ts:363-377`) does `target.style.setProperty(key,
    value)` per flattened key — so an authored `@keyframes` using
    `translate: …` / `rotate: …` / `scale: …` as **separate properties** flows
    through *natively*, each its own animatable CSS property, with **no
    `transform`-shorthand stringification**. This is the SOTA-correct behaviour
    by construction (the engine is property-agnostic). The presets
    (`animations.ts:42-88`) use the `transform: translateX(…)` shorthand, which
    is *also* correct (it is what those presets express) — not a gap.
  - **The one note — WAAPI eligibility:** the WAAPI delegate
    (`waapi.ts`) keys eligibility on the default renderer + uniform timing + no
    computed units. Individual transform properties are **fully WAAPI-animatable
    and compositor-threaded** — confirm (MEASURE-FIRST, not asserted) that an
    animation authored with individual `translate`/`scale`/`rotate` keyframes
    *passes* the eligibility gate and rides the compositor (it should — they are
    plain CSS properties with no computed-unit or custom-renderer disqualifier).
    If a future micro-bench shows individual-transform keyframes silently
    falling back to rAF, that is a real eligibility bug; today there is **no
    evidence** of one, so this is a RECORD, not a finding.
- **Disposition:** **ALREADY-SOTA** (demo + engine). The WAAPI-eligibility
  pass-through is **RECORD** (verify-if-a-bench-lane-runs, do not manufacture).
- **value.js:** none.

### F-MW-4 · `interpolate-size` / `calc-size()` (animate-to-intrinsic-sizes) — **RECORD (still limited)**

- **State since E:** unchanged — **Chrome/Edge 129 only (Sep-24), no FF/Safari**
  ("limited availability", live guide). The E digest BOOKed this
  (`r-modern-web-digest.md` §1B, "Chrome-only → PE only").
- **The kf fit:** the demo's collapsible panels / accordions
  (`AnimationControls.vue` filing-tab, the keyframe lists) could animate to
  `height: auto` via `interpolate-size: allow-keywords`. But: (a) it is
  Chromium-only → a PE-only polish with an instant-jump fallback on FF/Safari;
  (b) the demo's panel transitions already work (Vue `<Transition>` / the
  engine's own springs); (c) the §Mandate forbids gold-plating a Chrome-only
  nicety onto a working surface.
- **Disposition:** **RECORD** — re-confirm the E BOOK; **do not adopt** until
  Baseline (no FF/Safari). Trigger to revisit: `interpolate-size` reaches
  Baseline. This is the honest "not-SOTA-but-correctly-deferred" call.
- **value.js:** none.

### F-MW-5 · Interest Invokers (`interestfor`) — **KILL/RECORD (still limited, polyfill weight)**

- **State since E:** the guide **split** into `interest-triggered-action-previews`
  + `interest-triggered-tooltips`, but the Baseline did **not** move:
  **Chrome/Edge 142 only (Oct-25), no Firefox, no Safari** — still "limited",
  needs the `interestfor` polyfill. The E digest recorded D-7 N-A "limited
  avail; reka-ui tooltips already cover hover-preview".
- **The kf fit:** the demo's hover-previews (timeline diamond previews, tooltips)
  are already covered by glass-ui/reka tooltips. `interestfor` would buy a
  *declarative* hover/focus relationship, but for a two-engine-only feature the
  polyfill weight is unjustified on a demo (the E call, unchanged).
- **Disposition:** **RECORD/KILL** — re-confirm E's N-A. The split into a
  tooltips-specific guide does not change the calculus (two engines, polyfill).
  Trigger to revisit: Firefox/Safari ship `interestfor`.
- **value.js:** none.

### F-MW-6 · Cross-document View Transitions + scroll-state CQ + `@container style()` — **N-A / RECORD (structural + not-Baseline)**

Bundled, each with a stated structural reason:

- **`consistent-cross-document-transitions`** (`@view-transition` +
  `blocking="render"` + `<link rel=expect>`): **N-A** — the demo is a hash-routed
  SPA (`router.ts` `createWebHashHistory`); there is **no document navigation**
  to transition. Cross-doc VT is also limited (no Firefox). Structurally
  inapplicable, exactly as E recorded.
- **`scrollability-affordance-hints` / `scroll-position-aware-elements`**
  (`container-type: scroll-state`): **RECORD** — Chrome 133+ only, **not
  Baseline**. The demo's internal panel scrollers *could* show scroll-shadows via
  the CQ, but (a) it is Chrome-only, (b) glass-ui owns the panel chrome (inv-16),
  (c) the `soft-edge-content-fade` `mask:` approach (Baseline 2023) is the
  cross-engine alternative the E digest already BOOKed. Prefer the mask fallback
  if a polish wave wants edge-fades; the scroll-state CQ stays RECORD until
  Baseline.
- **`design-token-reactivity`** (`@container style()`): **RECORD** — not Baseline
  (Chrome-only), no simple fallback (per the guide's own warning). Do not adopt.
- **Disposition:** **N-A** (cross-doc VT, structural) + **RECORD** (scroll-state,
  style-CQ — not Baseline).
- **value.js:** none.

---

## 3. Where the post-E state is exemplary (manufacture NO work)

Stated plainly so no wave invents work here:

- **View Transitions** are landed, feature-detected, focus-routed, PRM-gated,
  with the engine-dogfood fallback preserved (`useSceneTransition.ts`,
  `useSceneSwap.ts`). The only *additive* frontier is types (F-MW-2), and that is
  MEASURE-FIRST + mostly glass-ui-owned.
- **`@starting-style` + `allow-discrete`** is a *first-class dedicated scene*
  (`StartingStyleScene.vue` / `StartingStyleTarget.vue:140-158`) — the guide's
  MANDATORY separate-`transition-behavior` declaration is present
  (`StartingStyleTarget.vue:138`). Textbook.
- **`content-visibility: hidden`** with the `@supports not (...)` →
  `display:none` fallback (`AnimationControls.vue:286-292`) — the guide's exact
  PE + CLS discipline (paired with the offscreen-cache rationale in the comments).
- **Individual transform properties / `color-mix`** in author CSS — adopted
  (F-MW-3, F-MW-1's color note).
- **The engine** is the reference impl of `scheduler.yield` (C1), the PRM gate
  (CSS7), WAAPI compositor delegation (CSS5), and `linear()` physics (CSS6) — D's
  verdict, re-confirmed, untouched.
- **The ScrollTimeline native-CSS ARCH-kill** is re-confirmed (more correct now
  than recorded: the engine animates arbitrary objects; native `scroll()` is
  DOM-CSS-only and still not Baseline). Do not re-open.
- **`@property`** for animated custom props was a FOLD-E candidate in the E
  digest (`r-modern-web-digest.md` §2.6); a `grep @property` over **demo source**
  (excl `dist/`) returns **0** this audit. This is the one E-named idiom that
  appears **not** to have landed in demo source. It is **LOW-value** (smoother
  interpolation of a handful of transitioned custom props; no correctness or perf
  gap) → **BOOK** (re-confirm the E disposition; not a F obligation). If a wave
  registers the rainbow-ribbon gradient vars with `@property`, the value.js
  hand-off below applies; otherwise leave it.

---

## 4. value.js hand-offs (inv-16 — propose only, never write)

This lane is platform-guidance-centric; value.js touches are light and
**conditional** (both already named in E's `valuejs-sota-handoff.md` / the E
digest §4 — I re-affirm, I do not re-derive):

- **`@property` `syntax` grammar in the value-type registry** — *conditional on*
  adopting §3's `@property` BOOK. If keyframes.js animates `@property`-registered
  custom props, value.js's value parser should understand the `syntax`
  descriptor's component grammar (`<length>`/`<color>`/`<angle>`, `+`/`#`
  multipliers) to interpolate them correctly. **HAND-OFF** (already in the E
  handoff; F adds no new value.js surface here).
- **`color-mix()` / `oklch()` parse-serialize parity** — *conditional on* author
  CSS flowing `color-mix(in oklab, …)` back through the value.js parser. The demo
  now *emits* `color-mix(in srgb, …)` in author CSS (`StartingStyleTarget.vue`),
  but that is browser-rendered, not engine-parsed; the hand-off only bites if a
  `color-mix()` value enters a `@keyframes` the engine interpolates. **HAND-OFF**
  (re-affirm E; not newly triggered by F).

**No NEW value.js surface is opened by this lane.** The two are the E hand-offs,
re-confirmed, both still conditional.

---

## 5. Disposition roll-up

| # | Finding | NEW-since-E? | Baseline (live) | Disposition |
|---|---|---|---|---|
| F-MW-1 | Invoker Commands (`command`/`commandfor`) — declarative-controls fit | **YES** (crossed Baseline 2025-12-12; custom-command half newly documented) | Baseline 2025-12-12 | **BOOK** (kill wholesale rewrite) + MEASURE-FIRST showcase scene |
| F-MW-2 | View-Transition **types** (directional/group) — demo ships bare callback | **YES** (types frontier) | VT Baseline 2025-10-14 | **SHIP-in-F (small)** IF glass-ui helper takes `types`, else glass-ui OUT; MEASURE-FIRST |
| F-MW-3 | Individual transform props — engine passes through; demo uses | emphasis | Baseline 2022-08-05 | **ALREADY-SOTA** (+ WAAPI-eligibility RECORD) |
| F-MW-4 | `interpolate-size`/`calc-size()` | no | limited (Chrome 129 only) | **RECORD** (don't adopt until Baseline) |
| F-MW-5 | Interest Invokers (`interestfor`) | guide split only | limited (Chrome 142 only) | **RECORD/KILL** (re-confirm E N-A) |
| F-MW-6 | cross-doc VT · scroll-state CQ · `@container style()` | mixed | N-A / not Baseline | **N-A / RECORD** |
| §3 | VT · `@starting-style` · `content-visibility` · individual-transform · color-mix · engine reference-impl · ScrollTimeline kill | — | — | **ALREADY-SOTA — KEEP** |
| §3 | `@property` for animated custom props | E-named, not landed in demo src | Baseline-newly | **BOOK** (low value; re-confirm E) |
| §4 | `@property` `syntax` grammar · `color-mix()` parse parity | — | — | **value.js-HANDOFF** (conditional, re-affirm E) |

**Net.** The post-D+E stack is **exemplary** on the modern-web axis — E.W4/W9/W11
already shipped View Transitions, `@starting-style`, `content-visibility`,
individual transforms, and `color-mix`, and the engine is the reference impl of
the perf/PRM/compositor/easing guidance. The genuinely-NEW catalog deltas are
**two**: Invoker Commands crossed Baseline (F-MW-1 — a teaching-scene candidate,
NOT a controls rewrite), and the View-Transition **types** API (F-MW-2 — a small,
glass-ui-conditional, MEASURE-FIRST directional-swap upgrade). Everything else is
either correctly-deferred-not-Baseline (interpolate-size, interest invokers,
scroll-state CQ), structurally N-A (cross-doc VT on a hash SPA), or
already-landed. **The honest headline: there is very little not-SOTA left here —
F should NOT manufacture a modern-web wave; it should record the two deltas and
the one BOOK (`@property`), and ship only the VT-types upgrade IF it measures
clean and glass-ui's helper already accepts a `types` array.**

---

## 6. Re-runnable evidence

```sh
# Live Baseline strings (this audit):
npx -y modern-web-guidance@latest retrieve declarative-button-actions | grep -i baseline
#   → Invoker commands: Newly available. Baseline since 2025-12-12.
npx -y modern-web-guidance@latest retrieve same-document-transitions | grep -i baseline
#   → View transitions: Newly available. Baseline since 2025-10-14.
npx -y modern-web-guidance@latest retrieve individual-transform-properties | grep -i baseline
#   → Widely available. Baseline since 2022-08-05.
npx -y modern-web-guidance@latest retrieve animate-to-intrinsic-sizes | grep -i "limited\|Unsupported"
#   → interpolate-size limited; Unsupported in: Firefox and Safari.
npx -y modern-web-guidance@latest retrieve interest-triggered-action-previews | grep -i "Supported\|Unsupported"
#   → Chrome/Edge 142 only; Unsupported in: Firefox and Safari.

# Demo VT ships the BARE callback (no types):
grep -n "startViewTransition" demo/app/useSceneTransition.ts        # → :32 startViewTransition(() => mutate(id))
grep -rn "types:" demo/app/*.ts                                     # → 0 (no VT types arg)

# Demo already landed @starting-style / content-visibility / individual transforms:
grep -rln "@starting-style\|allow-discrete" demo --include=*.vue --include=*.css | grep -v dist
#   → StartingStyleScene.vue, StartingStyleTarget.vue
grep -n "content-visibility" demo/@/components/custom/animation-controls/controls/AnimationControls.vue  # → :286,:292
grep -n "translate:\|scale:" demo/spring/StartingStyleTarget.vue    # → :128-129,:145-146,:154-155

# Demo has ZERO declarative Invoker commands today (the F-MW-1 fit):
grep -rn "commandfor\|command=\|interestfor" demo --include=*.vue | grep -v dist   # → 0

# Engine default renderer passes individual transform props through natively:
sed -n '363,377p' src/animation/utils.ts        # → target.style.setProperty(key, value) per flattened key

# @property NOT in demo source (the one E-named idiom unland­ed; low value, BOOK):
grep -rn "@property" demo --include=*.css --include=*.vue | grep -v dist           # → 0
```

All cites are live on `tranche-e-impl`; all Baseline strings are the
`modern-web-guidance@latest retrieve` output at this audit. Verified, not
asserted.
