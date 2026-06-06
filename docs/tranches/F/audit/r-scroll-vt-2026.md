# SOTA audit — Scroll-Driven Animations + View Transitions (F · 2026)

**Lane id:** `r-scroll-vt-2026`. **Branch at audit:** `tranche-e-impl` (post D+E+W11).
**Scope:** the View-Transitions API (same-doc `startViewTransition`, the NEW
**types API** `:active-view-transition-type()`, cross-doc `@view-transition`,
the Navigation API) + native scroll-driven CSS (`scroll()`/`view()`,
`animation-timeline`) across the engine (`src/animation/`) and the demo (`demo/`).
**inv-16:** keyframes findings → SHIP/BOOK/RECORD; value.js → HANDOFF;
**glass-ui findings → glass-ui-HANDOFF** (the VT/scroll-CSS substrate is
glass-ui-owned — §0.2). This lane writes only this doc; ZERO source changes.

**Diff target:** `docs/tranches/E/audit/sota/r-scroll-view-transitions.md` (the
PRE-E doc, written on `tranche-d-impl` BEFORE W9's native bridge and W11's VT
scene-nav landed). That doc's headline — "the demo dogfoods SpringProgress, NOT
VT; KEEP the dogfood" — was **made stale by E.W11**: the demo NOW ships VT
scene-nav (`useSceneTransition.ts`, `App.vue:309`). So this lane is not a
re-confirmation; it RE-MEASURES the landed W11 VT surface against the **2026
frontier**, and finds the one genuinely net-NEW SOTA layer the prior doc could
not have seen.

---

## 0. Executive verdict

**The single highest-signal finding: E.W11 shipped VT scene-nav with the
BARE-CALLBACK form of `startViewTransition` — and the View Transition *types*
API (`{ update, types }` + `:active-view-transition-type()`) became Baseline
Newly available 2026-01-13, AFTER W11 was authored.** The demo's scene-swap is
the demo's most-seen motion (`useSceneTransition.ts:7`); it currently runs a
single un-typed cross-fade for every nav. The types API is exactly the SOTA
layer that turns it into *directional / semantic* transitions (cube↔amiga↔easing
sliding by nav direction) — and the blocker is **upstream**: glass-ui 3.2.0's
`startViewTransition` only accepts a callback (`useViewTransition-CUJM7fXT.js`
`t.startViewTransition(() => e())`), it never forwards `{ update, types }`. This
is a **glass-ui-HANDOFF** (the substrate must grow a `types` param) + a small
**demo BOOK** (consume it once it lands). It is the correct next layer, and the
honest disposition is *not* "SHIP-in-F" because the enabler is not keyframes-owned.

Everything else re-confirms the prior doc's spine against the live, post-W11
state: the engine ships ZERO VT surface (correct boundary); the native
ScrollTimeline bridge that W9 landed (`timeline.ts:228`) is SOTA-shaped and the
JS-sampler ARCH-kill HOLDS; the demo has no document-scroll axis so native
scroll-driven is structurally N-A; cross-doc VT is N-A (hash router,
`router.ts:27`).

| Disposition | Count | Items |
|---|---|---|
| **glass-ui-HANDOFF** | 1 | H-1 · `startViewTransition` must accept `{ update, types }` so consumers can drive `:active-view-transition-type()` (the 2026 types API) |
| **BOOK** | 2 | B-1 · demo directional/typed scene-VT (consumes H-1) · B-2 · `easing`-scene `view()` reveal as shop-window (re-confirm prior B-1, still PE-only) |
| **ALREADY-SOTA** | 5 | A-1 native-bridge `createNativeTimeline` shape · A-2 engine ships zero VT (boundary) · A-3 demo VT scene-nav PE+a11y posture · A-4 demo no-scroll-surface · A-5 cross-doc VT N-A (hash router) |
| **KILL (re-affirm)** | 1 | K-1 · JS ScrollTimeline sampler ARCH-kill — re-confirmed against the LIVE W9 bridge |
| **value.js-HANDOFF** | 0 | — (no value.js scroll/VT surface) |

---

## 0.1 Baseline ground truth (2026) — the gate every disposition rides

Re-cited fresh; the deltas vs the prior doc's table are flagged.

- **View Transitions, same-doc:** Baseline Newly available **2025-10-14** (Chrome
  111, Edge 111, Firefox 144 Oct-2025, Safari 18). *(unchanged from prior doc §1.2.)*
- **View Transition *types* (`:active-view-transition-type()` + the
  `{ update, types }` object form of `startViewTransition` + `ViewTransition.types`
  set):** Baseline Newly available **2026-01-13** (Chrome 125, Edge 125, Firefox
  147 Jan-2026, Safari 18.2 Dec-2024). **← NET-NEW since the prior doc** — the
  prior doc named the Navigation API's 2026-01-13 Baseline (`r-scroll-…md:88`) but
  NOT the types API's same-date Baseline; W11 (authored before that date) used the
  bare form. Source: modern-web-guidance `directional-navigation-transitions`
  (baseline block: "Active view transition … Baseline since 2026-01-13"); MDN
  `:active-view-transition-type()` ("Since January 2026 … works across the latest
  devices and browser versions").
- **Cross-doc VT (`@view-transition { navigation: auto }`):** still **limited**
  (Chrome 126, Safari 18.2; **unsupported in Firefox**). N-A for this hash-router
  SPA. *(unchanged.)*
- **Scroll-driven (`animation-timeline: scroll()/view()`):** still **limited /
  Firefox-unsupported** (Chrome 115, Edge 115, Safari 26 Sep-2025; Interop-2026
  in-flight). Adoption MANDATES the `@supports ((animation-timeline: view()) and
  (animation-range: entry))` double-guard + IO/scroll fallback; the
  `scroll-timeline-polyfill` is guide-FORBIDDEN. *(unchanged from prior §1.1 — the
  scroll-driven story did NOT advance to Baseline in the D→F window.)*

→ The one Baseline that *moved* in this window is the **types API** (2026-01-13).
That is precisely where the net-NEW finding lives (H-1 / B-1).

## 0.2 The inv-16 boundary, re-stated for the live state

The VT/scroll-CSS substrate is **glass-ui-owned** and the engine correctly ships
zero VT surface. The demo consumes glass-ui's `startViewTransition` /
`supportsViewTransitions` (`useSceneTransition.ts:2`, `useSceneSwap.ts:2`,
imported from `@mkbabb/glass-ui/motion-core`). Therefore any VT *capability* gap
(like the types API) is a **glass-ui** concern, not a keyframes-engine concern —
the engine must NOT grow a `startViewTransition`. This is the same line the prior
doc drew (S-2); it is re-confirmed against the live import graph.

---

## 1. The net-NEW finding — the View Transition *types* API

### H-1 · `startViewTransition` is bare-callback-only — blocks the 2026 types API — **glass-ui-HANDOFF**

- **Live demo code:** `demo/app/useSceneTransition.ts:32` —
  `const { finished } = startViewTransition(() => mutate(id));`. The scene-swap is
  "the demo's most-seen motion" (`useSceneTransition.ts:7`); it fires once per dock
  nav (`App.vue:309` wires `runSceneSwitch`; `App.vue:11,25,235` call it).
- **Substrate (the blocker):** glass-ui 3.2.0
  `node_modules/@mkbabb/glass-ui/dist/useViewTransition-CUJM7fXT.js` — the helper
  body is `let n = t.startViewTransition(() => e());`. It takes a single `mutate`
  callback and **never** forwards an options object. There is no path through this
  helper to pass `{ update, types }`, so the demo **cannot** set a transition type,
  so it cannot drive `:active-view-transition-type()`.
- **The SOTA layer this blocks (the 2026 frontier):** the types API lets one
  `startViewTransition` categorize itself (`types: ["forward"]` / `["backward"]`),
  and CSS keys *different* animations off
  `html:active-view-transition-type(forward)::view-transition-old(root) {
  animation-name: slide-to-left }` (guide
  `directional-navigation-transitions`). For the keyframes demo this is the
  difference between **one generic cross-fade for every nav** (today) and a
  **direction-aware / semantic** swap (cube→amiga slides one way, the back-nav
  slides the other; the spring scene could even pick a "spring" type with a
  bouncier curve). It is the canonical, Baseline-2026 upgrade to exactly the
  surface W11 shipped.
- **Why glass-ui-HANDOFF, not SHIP-in-F:** the enabler is **not keyframes-owned**
  (inv-16, §0.2). glass-ui's `startViewTransition` must grow an overload — accept
  EITHER a bare `mutate` callback (today) OR `(mutate, { types })` / the spec's
  `{ update, types }` object — and forward `types` to
  `document.startViewTransition({ update, types })` where the object form is
  supported, falling back to the bare-callback form (and instant mutate) where it
  is not. The demo then consumes it (B-1). keyframes.js writes **no** glass-ui
  source; this lane RECORDS the proposal.
- **The exact hand-off shape (for the glass-ui repo):**
  1. Feature-detect the object form once: `document.startViewTransition.length`
     is unreliable; instead try the object form and accept the spec's graceful
     ignore — or gate on `CSS.supports("selector(:active-view-transition-type(x))")`
     (the precise probe for *types* support, distinct from base-VT support).
  2. Signature: `startViewTransition(mutate, options?: { types?: string[] })`.
     When `types` present AND supported → `document.startViewTransition({ update:
     () => mutate(), types })`; else → the current
     `document.startViewTransition(() => mutate())`; else (no VT) → run `mutate`
     synchronously, settle `finished` (the existing instant fallback,
     `useViewTransition-CUJM7fXT.js`).
  3. Keep the return contract `{ finished, transitioned }` unchanged. The PRM
     degrade (`::view-transition-group(root) { animation: none }` under
     `prefers-reduced-motion: reduce`) is already in glass-ui's `view-transition.css`
     (referenced `App.vue:328`) and applies to typed transitions unchanged.
- **Disposition:** **glass-ui-HANDOFF** (record in the F valuejs/substrate
  hand-off ledger as a glass-ui item, NOT a value.js item). Re-open trigger for
  the demo: the moment glass-ui ships the `types` param → B-1 becomes a one-line
  demo consume.
- **Isomorphism note:** the hand-off is purely additive (a new optional param);
  the bare-callback path stays byte-identical. The demo today is unchanged until
  B-1 lands.

### B-1 · Demo directional/typed scene-VT — **BOOK** (consumes H-1, measure-first)

- **File:** `demo/app/useSceneTransition.ts:31-32` (the call site), the scene host
  `App.vue:307-340` (the `view-transition-name: scene-subject` subject,
  `App.vue:332`), the dock nav `App.vue:11`.
- **The opportunity:** once H-1 lands, `runSceneSwitch(id)` can compute a
  direction (the demo has an ordered scene list — `scenes.ts`; forward = later in
  the list, backward = earlier) and pass `{ types: [direction] }`. Then a small
  demo-side (or glass-ui-side) CSS block keys slide-in/slide-out off
  `:active-view-transition-type(forward|backward)` per the guide. This makes the
  demo's most-seen motion *spatially meaningful* and is the textbook 2026 VT
  upgrade — a genuine shop-window for "the modern platform, feature-detected."
- **Why BOOK, not SHIP:**
  1. **Hard-blocked on H-1** — there is no keyframes-side way to do this until the
     glass-ui helper accepts `types`. Shipping demo CSS for a type that can never
     be set would be dead code.
  2. **inv-16** — the keyframes demo must CONSUME the glass-ui types param, not
     hand-roll `document.startViewTransition({...})` directly (that would bypass
     the substrate's feature-detect + instant fallback, re-introducing the exact
     duplication §0.2 forbids).
  3. **Measure-first** — a directional slide is more motion than the current calm
     cross-fade; verify against the existing scene cross-dissolve (it must not
     STACK with the `useSceneSwap` spring — recall that spring stands down only
     when `supportsViewTransitions()`, `useSceneSwap.ts:35`; a typed VT keeps that
     invariant, but verify on a no-types/has-base-VT engine the spring is still
     correctly stood-down). PRM-gate is already free (`view-transition.css`).
- **Disposition:** **BOOK** → a demo-motion-polish wave, gated on H-1. High value
  (the most-seen motion, Baseline-2026, dogfoods the platform) but correctly
  sequenced behind the substrate.
- **Isomorphism note:** additive on the VT-supporting path; the no-VT and
  reduced-motion paths keep the current behaviour exactly (instant swap / no-anim).

---

## 2. ENGINE findings — `src/animation/timeline.ts` (post-W9)

### A-1 · `createNativeTimeline` — the W9 native scroll bridge is SOTA-shaped — **ALREADY-SOTA**

- **File:** `src/animation/timeline.ts:207-260` — the `NativeTimelineSpec` union +
  `createNativeTimeline()` that W9 landed (the prior r-scroll doc, on
  `tranche-d-impl`, could NOT see this — it post-dates the doc). I RE-MEASURED it
  against the live 2026 spec:
  - **Feature-detect is correct and minimal:** `typeof globalThis.ScrollTimeline
    === "undefined"` / `globalThis.ViewTimeline` (`timeline.ts:242,252`) — the
    `in`/`typeof` global probe, returning `null` where absent (Firefox, SSR, jsdom)
    so the caller keeps the JS sampler. This is the exact "native where supported,
    JS fallback otherwise" discipline the guide mandates, and it is value.js-free
    (a window-global probe — `timeline.ts:225-227` documents the light-import
    property).
  - **The `globalThis.`-qualification foot-gun note** (`timeline.ts:233-240`) is a
    genuinely SOTA piece of care: the bare `ScrollTimeline` identifier would
    resolve to THIS module's own JS `ScrollTimeline` class, not the platform
    global; qualifying with `globalThis.` + deriving options via
    `ConstructorParameters<typeof globalThis.ScrollTimeline>` (`timeline.ts:243-245`)
    is the correct, type-safe way to bridge to lib.dom's native constructor while
    a same-named local class shadows the lib.dom option type. This is better than
    most libraries' native-timeline bridges.
  - **It is a pure ADDITIVE fast-lane** (`timeline.ts:222-223`): "a pure additive
    fast lane where supported + eligible. No polyfill." — matches the
    guide-forbidden-polyfill rule exactly.
- **SOTA gap:** none. The one thing a 2026 consumer might also want is a `view()`
  inset/range string passthrough — and it is ALREADY there (`spec.inset`,
  `timeline.ts:209,258`). The bridge covers `scroll()` (source+axis) and `view()`
  (subject+axis+inset). Nothing in the current spec is unmapped.
- **Disposition:** **ALREADY-SOTA**. The W9 bridge is the correct, complete,
  feature-detected shape; F adds nothing.
- **Isomorphism note:** n/a (no change proposed).

### K-1 · The JS `Timeline` sampler ARCH-kill — RE-CONFIRMED against the LIVE bridge — **KILL (re-affirm)**

- **File:** `src/animation/timeline.ts:36-197` (the `Timeline`/`ScrollTimeline`/
  `ManualTimeline` family). The arch record: D `deferred-ledger.md` ARCH-1, prior
  doc S-1.
- **Re-measured with the bridge LIVE:** the prior doc argued the kill on
  generality + baseline. Now that W9's `createNativeTimeline` actually SHIPS
  alongside the JS sampler, the kill is *demonstrated*, not just argued: the engine
  exposes **both** the native fast-lane (`timeline.ts:228`, DOM-CSS subset on
  Chromium/Safari) **and** the universal JS sampler (`timeline.ts:36-197`,
  any-object, all-engines), and the docstring itself states the kill holds —
  "this does NOT replace the JS sampler … the JS `Timeline` is a strictly more
  general caller-polled sampler (it also applies `SmoothProgress` smoothing +
  boundary snap the native `animation-range` path has none of)"
  (`timeline.ts:219-223`). The JS sampler carries three things native `scroll()`
  cannot: `SmoothProgress` exponential smoothing (`timeline.ts:64-68`), the
  `boundaryEpsilon` endpoint-snap (`timeline.ts:86-90`), and injectable
  `getScrollY`/`getViewportHeight` for DOM-free testing (`timeline.ts:171-173`).
- **Disposition:** **KILL (re-affirm)** — the native bridge is the additive
  fast-lane; the JS sampler is the irreplaceable general primitive. Do not re-open.
- **Isomorphism note:** n/a (re-affirmation only).

### A-2 · Engine ships zero VT surface — **ALREADY-SOTA** (boundary correct)

- **Verify:** `grep -rn "startViewTransition\|view-transition\|@view-transition"
  src/ --include="*.ts"` → **0**. The engine animates *values*, not document
  snapshots; the VT layer is glass-ui's (§0.2). Re-confirmed live on
  `tranche-e-impl` (the prior doc's S-2, still true). Adding a VT helper to the
  engine would be a layering violation.
- **Disposition:** **ALREADY-SOTA**.

---

## 3. DEMO findings — `demo/` (post-W11)

### A-3 · The W11 VT scene-nav posture (PE + a11y) — **ALREADY-SOTA** (re-measured; B-1 is its only upgrade)

This is the surface the prior doc said did NOT exist ("the demo dogfoods
SpringProgress, NOT VT; KEEP"). E.W11 **landed VT scene-nav**, so I re-measured
the *as-shipped* posture against the guide:

- **Progressive-enhancement is correct:** `useSceneTransition.ts:32` wraps ONLY
  the synchronous key mutation in `startViewTransition`, never the async
  `<Suspense>` loader (`useSceneTransition.ts:9`) — so the documented B.W3
  async-loader re-break (the prior doc's central objection to wrapping the scene
  swap) is structurally avoided. Where VT is absent, glass-ui's helper runs
  `mutate` synchronously and the engine's `SpringProgress` cross-dissolve takes
  over (`useSceneSwap.ts:44-51`) — the dogfood fallback is **preserved**, exactly
  as the prior doc demanded.
- **The two-motion invariant is honored:** the spring stands down precisely when
  `supportsViewTransitions()` is true (`useSceneSwap.ts:35,44`) — VT owns the
  motion where present, the spring owns it where absent, "never two stacked"
  (`useSceneSwap.ts:9`). This is the correct resolution of the prior doc's
  "snapshot-vs-active-animation" worry: the scene *host* gets the
  `view-transition-name` (`App.vue:332`, exactly ONE subject per state so names
  never collide), and the swap is a snapshot cross-fade only on the VT path.
- **a11y is handled — an UPGRADE over the spring fallback:** VT morphs layout but
  does not move focus; `useSceneTransition.ts:33-35` routes focus to the
  `tabindex="-1"` scene host on `finished` (`App.vue:120,338-340`), announcing the
  context change to AT — the guide's MANDATORY focus route. The spring fade lacked
  this (`useSceneTransition.ts:24`).
- **SOTA gap:** the ONE upgrade is the types API (H-1/B-1) — the as-shipped VT is
  un-typed (a single generic cross-fade). That is the net-NEW layer, correctly
  blocked on glass-ui. Everything else about the W11 posture is exemplary.
- **Disposition:** **ALREADY-SOTA** for the PE + a11y posture; the only forward
  motion is B-1 (typed transitions), gated on H-1. The prior doc's "KEEP the
  SpringProgress dogfood" is now **fulfilled-and-superseded**: the spring is KEPT
  as the no-VT fallback, AND VT was added on top — the best of both.
- **Isomorphism note:** n/a (re-measuring landed code).

### A-4 · Demo has NO document-scroll axis — native scroll-driven structurally N-A — **ALREADY-SOTA**

- **File:** the editor shell is a fixed full-viewport surface
  (`EditorShell.vue` `h-dvh max-h-dvh … overflow-hidden`, prior doc S-4-ctx); the
  router is hash-mode (`router.ts:1,27` `createWebHashHistory`). **Verify (live):**
  `grep -rn "@view-transition\|animation-timeline\|scroll-reveal\|useScrollProgress"
  demo/ --include="*.vue" --include="*.ts" --include="*.css"` (excl `/dist/`) →
  **0**. The demo ships no scroll-driven CSS, correctly — there is no page-scroll
  story; the only scrollers are component-local panel lists.
- **Disposition:** **ALREADY-SOTA** — the absence is correct, not a gap.
  Manufacturing a scrollytelling page against a fixed editor would be gold-plating.

### A-5 · Cross-document VT is N-A — hash router, no document navigation — **ALREADY-SOTA**

- **File:** `router.ts:27` `createWebHashHistory()` (GitHub-Pages constraint,
  `router.ts:6-7`). All scene "navigation" is in-document (`<component :is>` swap,
  `App.vue:325-340`) over hash routes — there is no cross-document navigation for
  `@view-transition { navigation: auto }` to fire on, and cross-doc VT is anyway
  not-Baseline / no-Firefox (§0.1). **Verify:** `grep -rn "@view-transition\|
  navigation:\s*auto\|pagereveal\|window.navigation" demo/` (excl dist) → **0**.
- **Disposition:** **ALREADY-SOTA** — structurally N-A; do not add. *(If the demo
  ever moved off hash routing to real multi-page GitHub-Pages routes — it will
  not, per `router.ts:6` — cross-doc VT + the `pagereveal`-driven types
  (`cross-document-transitions` guide) would re-open. RECORD only.)*

### B-2 · `easing`-scene `view()` reveal as a shop-window — **BOOK** (re-confirm prior B-1, still PE-only)

- **File:** the `easing` scene's multi-track list (`EasingTarget.vue`, the one
  demo surface with a real component-local scroll axis — prior doc B-1).
- **Re-measured:** unchanged from the prior doc. The native `view()` entry-reveal
  (glass-ui's `[data-scroll-reveal]` / `useStaggerReveal` recipe, with the
  `@supports ((animation-timeline: view()) and (animation-range: entry))` guard +
  IO fallback) could fade/scale the easing tracks in on scroll, dogfooding the
  constellation's scroll layer. Still BOOK (not SHIP) for the same three reasons:
  PE-only decorative (no fallback weight on an internal scroller), glass-ui owns
  the recipe (inv-16 — consume, never hand-roll), and measure-first against the
  existing track animations + INP. Scroll-driven did NOT advance toward Baseline
  in the D→F window (§0.1), so the urgency is unchanged (low).
- **Disposition:** **BOOK** → demo-motion-polish (trigger: a motion-polish wave OR
  the glass-ui reveal recipe becoming a one-line consume). Low value — the demo's
  story is the editor, not scrollytelling.

---

## 4. value.js hand-off — none

value.js carries no scroll-driven or view-transition surface — it is the
CSS-value/color/easing/math layer beneath the engine. The VT/scroll-CSS concerns
are split between the engine's `Timeline` family (progress physics) and glass-ui's
`motion-core` (DOM presentation). **value.js-HANDOFF: 0 items.** The one hand-off
this lane produces (H-1) is a **glass-ui** item, recorded distinctly from the
value.js ledger.

---

## 5. Disposition ledger

| # | Title | File:line | Disposition | Trigger / owner |
|---|---|---|---|---|
| H-1 | `startViewTransition` must accept `{ types }` (the 2026 types API) | demo `useSceneTransition.ts:32` · glass-ui `useViewTransition-CUJM7fXT.js` | **glass-ui-HANDOFF** | owner = glass-ui; enables B-1 |
| B-1 | demo directional/typed scene-VT | `useSceneTransition.ts:31` · `App.vue:307-340` | **BOOK** (measure-first) | gated on H-1; demo-motion wave |
| B-2 | `easing`-scene `view()` reveal shop-window | `EasingTarget.vue` (multi-track list) | **BOOK** (PE-only) | motion-polish / glass-ui consume |
| A-1 | `createNativeTimeline` W9 bridge — SOTA-shaped | `timeline.ts:207-260` | **ALREADY-SOTA** | — |
| A-2 | engine ships zero VT surface (boundary) | `src/` grep = 0 | **ALREADY-SOTA** | — |
| A-3 | W11 VT scene-nav PE + a11y posture | `useSceneTransition.ts` · `useSceneSwap.ts:35,44` · `App.vue:332` | **ALREADY-SOTA** | upgrade = B-1 only |
| A-4 | demo has no document-scroll axis | `EditorShell.vue` · `router.ts:27` | **ALREADY-SOTA** | — |
| A-5 | cross-doc VT N-A (hash router) | `router.ts:27` | **ALREADY-SOTA** (RECORD) | re-open: real MPA routing (won't happen) |
| K-1 | JS ScrollTimeline sampler ARCH-kill | `timeline.ts:36-197` | **KILL (re-affirm)** | demonstrated by the live W9 bridge |

**Net.** The prior r-scroll doc's central claim ("demo dogfoods SpringProgress,
NOT VT; KEEP") was **superseded by E.W11**, which shipped VT scene-nav with the
SpringProgress dogfood KEPT as the no-VT fallback — the best of both, and the PE
+ a11y posture is exemplary (A-3). The one genuinely net-NEW SOTA layer is the
**View Transition types API** (Baseline 2026-01-13, post-W11): the demo's
most-seen motion is an un-typed cross-fade and *should* become a directional /
semantic transition — but the enabler is **glass-ui-owned** (its
`startViewTransition` is bare-callback-only), so the honest disposition is a
**glass-ui-HANDOFF** (H-1) + a sequenced demo **BOOK** (B-1), not a keyframes
SHIP. The engine's W9 native-scroll bridge is SOTA-shaped and complete (A-1); the
JS-sampler ARCH-kill is now *demonstrated* by the live dual surface (K-1); the
demo correctly ships zero scroll-driven CSS (no scroll axis, A-4) and zero
cross-doc VT (hash router, A-5). **No keyframes source work is forced in F by this
lane — the stack is SOTA-aligned; the single forward motion lives upstream
(glass-ui types API) and is recorded as a clean hand-off.**

---

## 6. Evidence appendix (re-runnable)

```sh
# The demo's VT call is bare-callback (no types) — the H-1 blocker:
grep -n "startViewTransition" demo/app/useSceneTransition.ts          # :32 → (() => mutate(id))

# glass-ui's helper is bare-callback-only (the substrate blocker):
grep -n "startViewTransition" node_modules/@mkbabb/glass-ui/dist/useViewTransition-CUJM7fXT.js
# → let n = t.startViewTransition(() => e());   (no { update, types })

# The two-motion invariant: spring stands down only when VT is supported:
grep -n "supportsViewTransitions\|vtOwnsMotion" demo/app/useSceneSwap.ts   # :35,:44

# a11y focus route on VT finished:
grep -n "finished\|focus" demo/app/useSceneTransition.ts              # :32-35

# The VT subject (one stable name) + PRM degrade source:
grep -n "view-transition-name\|view-transition.css" demo/app/App.vue  # :325-332

# Engine ships zero VT surface (boundary clean):
grep -rn "startViewTransition\|view-transition\|@view-transition" src/ --include="*.ts"   # → 0

# The W9 native bridge (post-prior-doc) — feature-detected, additive:
sed -n '207,260p' src/animation/timeline.ts                          # createNativeTimeline

# Demo has no scroll axis / no scroll-driven CSS / no cross-doc VT:
grep -rn "@view-transition\|animation-timeline\|scroll-reveal\|useScrollProgress\|navigation:\s*auto\|pagereveal" \
  demo/ --include="*.vue" --include="*.ts" --include="*.css" | grep -v /dist/   # → 0

# Hash router (no document navigation → cross-doc VT N-A):
grep -n "createWebHashHistory" demo/app/router.ts                    # :1,27
```

Baseline cites (2026): modern-web-guidance `directional-navigation-transitions`
(Active view transition — Baseline 2026-01-13) · `cross-document-transitions`
(cross-doc limited, no Firefox) · `same-document-transitions` (Baseline
2025-10-14) · `scroll-entry-exit-effects` (scroll-driven limited,
Firefox-unsupported, `@supports` double-guard + IO fallback, polyfill forbidden).
WebSearch (Jun 2026, MDN): View Transition types API + `:active-view-transition-type()`
"works across the latest devices and browser versions since January 2026".
glass-ui 3.2.0 dist verified for the bare-callback signature.
