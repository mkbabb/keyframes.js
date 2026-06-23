# Q.WC3 — the N-STAGE scene-switcher + the unbuilt MOBILE (the shelf-driver; scroll-snap + typed-directional VT)

**Band:** C — the demo-fleet (the app-shell scene-switcher + the responsive/mobile layout — the most structural Band-C wave).
**Phase:** NOW (kf-internal) + GATED (the N-Stage unshelf architecture decision). Two phases in one wave: **(NOW)** the responsive/mobile scroll-snap carousel + the typed-directional View-Transition scene-switch ride entirely on today's installed tree (the live `scene-subject` VT at `App.vue`, glass-ui 4.0.1's *already-installed* `startViewTransition(mutate,{types})`, kf's LIGHT primitives — NO sibling publish). **(GATED)** the N-Stage *unshelf* decision is GATED on the glass-ui BC cut (the `n-stage-impl` branch carries stale `^0.9.0` parse-that + `^0.13.0` value.js + `~4.0.0` glass-ui pins it must rebase off — DM-24 / O.W15). The N-Stage unshelf stays a **GATED spec** with a named-on-cut `proof:n-stage-boundary`; the NOW layer ships without it.
**Sequence (DAG edges):** `Q.WA3 master-merge (FIRST) ─► Q.WC3-SCENE-INDEX (the sceneIndex seam) ─► Q.WC3-SCENE-SWITCHER-MOBILE-GATE (gate-FIRST) ─► {Q.WC3-MOBILE-SWITCHER ‖ Q.WC3-VT-DIRECTIONAL}`. The GATED unshelf (`Q.WC3-NSTAGE-UNSHELF`) sequences after the BC cut. Q.WC3 is independent of every other Band-C wave (Q.WC1/Q.WC2 easing, Q.WC4 MorphSVG, Q.WC5 amiga). (`Q.md:54,82`; the GATED edge is `BC-cut → Q.WC3-NSTAGE-UNSHELF`; the NOW edges are intra-repo.)
**Owning ideas:** the audit **B2-pw8-nstage-mobile** lane (the D6 shelf-driver + NI-1 typed-directional VT) + **B5-kf-demo-arch** ("P.W8 shipped NOTHING — no directional/typed VT, no mobile scroll-snap scroller"). The frontend-design precept: a phone layout that is phone-CORRECT (native swipe/snap), not a shrunk 3D ring; a scene switch that carries spatial meaning.

This wave's spine is the D6 BLOCKER: **mobile is ENTIRELY unbuilt in the scene-stage subtree** — zero `max-width` breakpoints (only `prefers-reduced-motion` queries). The shelved N "Stage" switcher is NOT a paper prototype: ~3,500 LOC of real implementation exists on `n-stage-impl` (geometry-correct turntable, a single shared `RAFPlayback` LOD clock, dogfooded `SpringProgress` orbit/arrows, unit tests), shelved on FOUR identifiable blockers, not a fundamental flaw. Q.WC3 confronts them via TRANSPOSITION (a native scroll-snap carousel for phone — the NOW layer) + the GATED unshelf gate.

---

## Context

### The four shelf-blockers (D6 + the N harden findings, verified `file:line`)

| # | Blocker | Source location | The defect (verified 2026-06-23) |
|---|---|---|---|
| 1 | **mobile ENTIRELY unbuilt** (THE shelf-driver) | the whole scene-stage subtree carries only `@media (prefers-reduced-motion)`; `grep max-width demo/app/` returns ONLY `CubeScene.vue` (a scene-internal rule, NOT the switcher) | the 3D ring cannot shrink to a phone — flanks clip at the viewport edges, the nameplate/arrows/hint collide. The prototype's 720px rule only tightens the radius + adds `flex-wrap`, which CAUSES the collision (`harden-findings.md:[med] MOBILE LAYOUT BROKEN at 390px`). |
| 2 | **light-mode contrast cure unverified in the impl** | the prototype CURED it (nameplate/arrows `oklch(0.96)` on the dark void); the transposition to the impl is untested | the on-stage ink must be pinned light over the theme-invariant-dark void in BOTH themes; unverified that the impl carries the cure. |
| 3 | **the signature shared-element VT morph never wired** | the dock trigger carries `view-transition-name:dock-select-trigger`, the nameplate carries `stage-nameplate` (DISTINCT names), so the open VT "only blooms stage-root opacity 0→1" — no trigger→nameplate morph | the "grows from the dropdown" liquid-glass beat that justifies the whole feature is the missing piece. |
| 4 | **the "SLOW" S0 baseline never quantified** | `STAGE-SPEC.md:26` (S0) mandates a perf trace of the carousel FPS as "the number every later stage is judged against" — never recorded | the 7 live previews remain an UNMEASURED perf risk; the owner named TWO failures (SLOW + WRONG) and SLOW was never measured. MEASURE-FIRST is the governing precept. |

### The transposition that dissolves blockers 1 + 4 at once (the D6 headline play — NOW phase)

The phone layout is NOT a shrunk 3D ring — it is a **native CSS scroll-snap carousel**. On phone-narrow, replace the 3D turntable with a horizontal `overflow-x: scroll; scroll-snap-type: x mandatory` scroller of preview cards; each card animates scale/opacity/brightness via a **scroll-driven `view-timeline`** (`animation-timeline: view(inline)`), NOT a JS spring. This: **(blocker 1)** dissolves the mobile gap (native swipe/snap IS the phone-correct gesture, zero bespoke shrink-the-ring layout) and **(blocker 4)** dissolves most of the perf risk (the falloff runs on the compositor, not 7 reactive Vue style recomputations per spring frame).

The modern-web carousel pattern gives the floor: a `view-timeline: --card inline` per card driving a `scale`/`opacity` `@keyframes` — with the MANDATORY guard: `@supports ((animation-timeline: view()) and (animation-range: entry))` (the `animation-range` arm filters partial-support browsers) and a `prefers-reduced-motion` guard. Scroll-driven animations are Baseline-newly (Chrome 115+, Firefox 144, Safari 26) — so the `@supports` gate + a static-fallback scroller (cards visible, no scale-falloff) is the progressive-enhancement floor, exactly the demo's established `@supports(anchor-name)` pattern.

### The typed-directional VT (blocker 3, NOW-phase — independent of the carousel)

The current scene-switch runs ONE static VT name (`scene-subject`, `App.vue`) with NO direction — `useSceneTransition.ts:32` calls `startViewTransition(() => mutate(id))` with no `types` (verified: `grep forward|backward|view-transition-type demo/` → empty; the helper is `startViewTransition` from `@mkbabb/glass-ui/motion-core`). **glass-ui 4.0.1 is ALREADY INSTALLED and ALREADY ships `startViewTransition(mutate, { types })`** (`node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts` — `types` is feature-detected) — so the typed VT is a pure-NOW kf consume, NO glass-ui publish needed. The upgrade: compute `sign(targetIndex − currentIndex)` from the `scenes[]` order and pass `{ types: ['forward'|'backward'] }`, then CSS keys the slide on `:active-view-transition-type(forward|backward)`. The scene switch gains spatial meaning (next/prev) for free; the dock order becomes legible in motion. `view-transition-type` is Baseline-newly (Chrome 125+) so the no-type degrade is free (an untyped cross-fade) under the established `@supports` floor; PRM degrade rides glass-ui's `view-transition.css` (already loaded).

### The scene-index seam (the precise machine seam — NOW-phase enabler)

`useSceneTransition(mutate, sceneHost)` does NOT receive the current scene id, and `scenes.ts` exports NO `sceneIndex(id)` helper (verified: `scenes.ts:92` exports the ordered `scenes[]` + `:165` `allScenes` + `:166` `sceneMap` for id→descriptor, but no ordered-index function). To compute `sign(targetIndex − currentIndex)` for the directional VT, the composable must read both the current and target index. **Q.WC3-SCENE-INDEX** adds the ordered-index seam FIRST (export `sceneIndex(id):number` over `allScenes` + thread `currentSceneId` into `useSceneTransition`) — without it, `Q.WC3-VT-DIRECTIONAL` is UNBUILDABLE (this is the pre-empted friction; see the note below).

### The unshelf decision (GATED — the gate-first rebase, blockers 1+2+3+4 together)

The N-Stage UNSHELF is a **scoped finishing tranche, NOT a rebuild** — the `n-stage-impl` branch (~3,500 LOC, dogfooded, geometry-correct, tested) carries STALE pins (`^0.9.0` parse-that, `^0.13.0` value.js, `~4.0.0` glass-ui) it must rebase off the constellation re-pin — which is WHY it is GATED on the BC cut. The unshelf is gate-first: author `proof:n-stage-boundary` (the bundled-DEMO import-graph walk asserting the HEAVY engine chunk is absent from the static stage-module graph, rooted at `SceneStage.vue`) BEFORE the rebase; then MEASURE-FIRST (the STAGE-SPEC S0 perf trace, blocker 4) DECIDES the architecture — 3D-ring unshelf (Arm B) if FPS meets the budget, dock-Select+stage-portal-VT enhancement (Arm C) if not. The CONTRIVANCE-AUDIT names Arm C as the conservative expected winner. This wave SPECS that gated sequence; it does not execute it (the BC cut is unshipped). The reuse is real: `StageArrows.vue` on `n-stage-impl` already implements prev/next/`fire(dir)` directional semantics with aria-labels — the direction vocabulary the unshelf needs already exists.

### The top-layer reachability caveat (a recorded unshelf precondition)

`harden-findings.md:[med] TOOLBAR UNREACHABLE WHILE STAGE OPEN`: the stage is a Popover-API top-layer element painting ABOVE all normal-layer z-index, so the normal-layer toolbar (Theme + Reduce-motion toggles) is unreachable by a real pointer while the stage is open. Recorded as an unshelf precondition (a chrome-devtools-mcp hit-test before unshelf), NOT a NOW-layer blocker (the toolbar is reachable today; the stage is shelved).

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| mobile unbuilt | `grep max-width demo/app/` → only `CubeScene.vue` (a scene rule); the scene-stage subtree carries only `@media (prefers-reduced-motion)` | THE shelf-driver — zero responsive breakpoint anywhere in the switcher |
| current VT (no direction) | `demo/app/useSceneTransition.ts:32` (`startViewTransition(() => mutate(id))`, no `types`) | one static VT name, no directional/typed transition (NI-1's RED) |
| glass-ui types ALREADY shipped | `node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts` | `startViewTransition(mutate,{ types })` is on the INSTALLED 4.0.1 surface — the typed VT is a NOW kf consume, NO glass-ui publish |
| no sceneIndex seam | `demo/app/scenes.ts:92,165,166` (`scenes`, `allScenes`, `sceneMap`) | the ordered array exists but NO `sceneIndex(id)` helper; `useSceneTransition` does not receive the current id (the `Q.WC3-SCENE-INDEX` seam) |
| harness viewport | `scripts/lib/demo-driver.mjs` (`withPage` `context` → `browser.newContext`) | a real 390px mobile-viewport context is a harness capability (the live mobile-layout assertion's substrate) |
| mobile precedent | `scripts/proof-mobile-single-page.mjs`, `proof-live-session-mobile.mjs` | existing mobile-viewport runtime gates — the harness shape `mobile-layout` mirrors |
| VT precedent | `scripts/proof-scene-transition-perf.mjs` | the existing scene-VT runtime gate the `vt-directional` clause extends |
| reuse (StageArrows) | `n-stage-impl:StageArrows.vue` (prev/next/`fire(dir)`, aria-labels) | the direction vocabulary the unshelf (Arm B/C) needs already exists in the shelved code |
| stale pins | `n-stage-impl:package.json` | `^0.9.0` parse-that, `^0.13.0` value.js, `~4.0.0` glass-ui — must rebase off the constellation re-pin (WHY it is BC-gated) |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable, split by phase. **NOW (no sibling gate): S1** the ordered-index seam (`sceneIndex(id)` + thread `currentSceneId` — the directional-VT enabler). **S2** the responsive mobile layout (the scroll-snap transposition — the shelf-driver cure that ships independent of the carousel). **S3** the typed-directional scene-switch View Transition (NI-1, over the live `scene-subject` VT + glass-ui 4.0.1's already-installed `{types}`). **S4** the born-RED gate `proof:scene-switcher-mobile` (gate-FIRST): a live mobile-viewport layout assertion + the VT scene-switch observable. **GATED (the BC-cut trigger): S5** the N-Stage unshelf decision (gate-first `proof:n-stage-boundary` → MEASURE-FIRST GATE-ZERO → Arm B 3D-ring or Arm C dock-Select). Every NOW move ships on today's tree; every GATED move is specced against a NAMED sibling trigger, never executed pre-cut.

---

### S1 — The ordered-index seam (NOW): `sceneIndex(id)` + thread `currentSceneId` (the directional-VT enabler)

**Breach.** `useSceneTransition(mutate, sceneHost)` does NOT receive the current scene id, and `scenes.ts` exports NO `sceneIndex(id)` helper (`scenes.ts:92,165,166` — only `scenes`/`allScenes`/`sceneMap`). To compute `sign(targetIndex − currentIndex)` for the directional VT, the composable must read both indices.

**Cure.** Export `sceneIndex(id): number` (or an ordered id list) from `demo/app/scenes.ts` over `allScenes`, and thread `currentSceneId` into `useSceneTransition` so the composable can compute the index delta. This is the pure-construction seam S3's directional pass reads; it is built FIRST so S3 is never built ad-hoc against a missing helper.

**Constraint (no-legacy, single source of order).** The `sceneIndex` helper is the ONE source of scene-order truth (over the existing `allScenes` array); S3 reads it, the mobile carousel (S2) reads the same order. No second hard-coded order list.

**Gate bite (S4 coverage).** `proof:scene-switcher-mobile` `vt-directional` clause is UNBUILDABLE until the composable can read both indices — S1 is the precondition; the gate asserts the directional type, which requires this seam.

---

### S2 — The responsive MOBILE layout (NOW): the scroll-snap transposition (the shelf-driver cure)

**Breach.** Mobile is ENTIRELY unbuilt — zero `max-width` breakpoints in the scene-stage subtree (`grep max-width demo/app/` → only `CubeScene.vue`, a scene rule). At 390px the prototype collides (console over hint, arrow wraps below nameplate, flanks clip). This is THE shelf-driver.

**Cure.** Build the phone-narrow layout by TRANSPOSITION, not by shrinking the ring. On a phone-narrow container query (`@container` / `@media (max-width: 720px)`), render the scenes as a **native horizontal scroll-snap carousel**:

- A scroller: `overflow-x: scroll; scroll-snap-type: x mandatory;` of preview cards, each `scroll-snap-align: center`. A NEW `useScrollSnapScene` composable + a scroller component (`demo/@/components/custom/`).
- The card falloff (scale/opacity/brightness) driven by a **scroll-driven `view-timeline`** per card: `view-timeline: --card inline` + `animation-timeline: --card` over a `@keyframes` that scales/brightens the centered card and dims the flanks — on the COMPOSITOR, not a JS spring (zero per-frame Vue recompute).
- The MANDATORY modern-web floor: `@supports ((animation-timeline: view()) and (animation-range: entry))` gates the scroll-driven falloff; the static fallback is a plain scroll-snap scroller (all cards visible at uniform scale — still a usable phone carousel). PRM: `@media (prefers-reduced-motion: reduce)` disables the scale/brightness falloff.
- The phone layout uses the SAME scene model + the SAME scene-switch commit (a snapped card → tap → switch scene via the same `runSceneSwitch`/`mutate` seam), so it is the phone VIEW of the same switcher, not a parallel feature.

**Constraint (NOW, no sibling gate — the scroll-snap is shippable today).** A pure demo-CSS + `useScrollSnapScene` composable layer; it rides ZERO carousel-unshelf dependency — it ships as the phone switcher whether or not the 3D Stage ever unshelves (the desktop keeps the current dock Select until the GATED unshelf). KISS: the platform owns the gesture + the snap; the demo owns the cards + the falloff `@keyframes`.

**Gate bite (S4 coverage).** `proof:scene-switcher-mobile` `mobile-layout` clause: at a real 390px emulated viewport, assert the scene-switcher renders a horizontally-snapping scroller whose cards do NOT clip at the viewport edge AND no two chrome elements overlap. Today: there is no mobile layout → red.

---

### S3 — The typed-directional scene-switch View Transition (NOW): NI-1 over the live `scene-subject` VT

**Breach.** The scene-switch runs ONE static VT name (`scene-subject`, `App.vue`) with NO direction — `useSceneTransition.ts:32` calls `startViewTransition(() => mutate(id))` with no `types` (verified `grep forward|backward|view-transition-type demo/` → empty). The cross-fade is directionless.

**Cure.** Pass a directional `view-transition-type` derived from the scene-index delta (over S1's `sceneIndex` seam):

1. In `useSceneTransition.ts`, compute `sign(targetIndex − currentIndex)` and pass `{ update: mutate, types: [delta > 0 ? 'forward' : 'backward'] }` to `startViewTransition` — using glass-ui 4.0.1's ALREADY-INSTALLED `startViewTransition(mutate, { types })` (`useViewTransition.d.ts`); NO glass-ui publish.
2. CSS (demo-side, beside the existing `scene-subject` rule): key the slide on the type — `html:active-view-transition-type(forward) ::view-transition-old(scene-subject) { animation-name: slide-to-left }` / `::view-transition-new(scene-subject) { animation-name: slide-from-right }`, and the mirror for `backward`. Animate `transform` (translateX) only — compositor-performant.
3. PRM: `@media (prefers-reduced-motion: reduce) { ::view-transition-group(scene-subject) { animation: none !important } }` — the directional slide degrades to an instant cut (also rides glass-ui's `view-transition.css` PRM degrade).

**Constraint (NOW — the single-name invariant is PRESERVED).** This does NOT add a second VT name — it drives DIRECTION via `view-transition-type` on the SAME `scene-subject` name. `view-transition-type` is Baseline-newly (Chrome 125+); where absent, the untyped cross-fade is the free degrade under the established `@supports` floor.

**Gate bite (S4 coverage).** `proof:scene-switcher-mobile` `vt-directional` clause: a real nav from `scene[i] → scene[i+1]` reads the active `view-transition-type` (or the `::view-transition-old(scene-subject)` animation-name) as `forward`, and `scene[i] → scene[i−1]` as `backward`. Today: no type is passed → the active type is empty → red.

---

### S4 — `proof:scene-switcher-mobile` born-RED gate-FIRST (the keystone — APPEARANCE/INTERACTION axis, NOT a source-grep)

**Breach.** No gate covers the mobile scene-switcher layout NOR the directional VT. The existing mobile gates (`proof:mobile-single-page`, `proof:live-session-mobile`) cover the single-page shell, not the scene-switcher carousel; `proof:scene-transition-perf` covers VT perf, not direction.

**Cure.** Author `scripts/proof-scene-switcher-mobile.mjs` **gate-FIRST** (born-RED BEFORE S2+S3 land), a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the mobile-viewport harness (`scripts/lib/demo-driver.mjs` `withPage` with `context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }`). Wire it into the `proof:correctness` roster (`package.json`, beside the other live mobile gates). Two clauses, both born-RED on today's tree:

1. **`mobile-layout`** (THE KEYSTONE — the APPEARANCE-axis observable): at a real 390px emulated viewport, assert the scene-switcher renders a horizontally-snapping scroller (`scroll-snap-type: x mandatory` resolved on the scroller element), the cards do NOT clip at the viewport edge (every card's `getBoundingClientRect()` is within `[0, 390]` ± a small bleed), and NO two chrome elements overlap (the `harden-findings.md:[med]` collision signature — arrow.top vs nameplate.bottom vs hint.top — does NOT recur). BITE: re-introduce the 3D-ring shrink (no scroll-snap scroller) or a colliding stack → red.
2. **`vt-directional`** (the INTERACTION-axis observable): a real nav `scene[i] → scene[i+1]` reads the active directional VT type as `forward`; `scene[i] → scene[i−1]` reads `backward`. (Where `view-transition-type` is unsupported in the headless runner, the clause asserts the type-keyed CSS rule EXISTS in the stylesheet AND the untyped cross-fade still completes — the degrade is honest, not a silent skip.) BITE: a directionless `startViewTransition` with no `types` → empty active type → red.

**Constraint (observable-truth — the keystone).** The `mobile-layout` clause MUST bite the GENUINE defect (the phone layout collides / clips), not a proxy. The proxy trap is asserting only that a `@media (max-width: 720px)` rule EXISTS in the source — which the prototype's broken radius-tweak rule would pass while still colliding at 390px. The clause forbids that: it drives a REAL 390px viewport and asserts the RENDERED rects do not clip and do not overlap — the observable a phone user sees. A green "a max-width rule exists" over a colliding layout must STILL red `mobile-layout`. This is the exact green-source-shape-gates-miss-appearance lesson — a responsive-layout defect closes via a RUNTIME viewport gate over the live rendered geometry, never a source-grep stand-in.

**Gate bite.** `node scripts/proof-scene-switcher-mobile.mjs` → exit 1 today (no mobile scroll-snap layout, no directional VT type). After S2+S3 land: both clauses green; `mobile-layout` confirms a real 390px scroll-snap carousel that does not clip or collide, `vt-directional` confirms the scene-switch carries forward/backward direction.

---

### S5 — The N-Stage unshelf decision (GATED on the BC cut): gate-first `proof:n-stage-boundary` + MEASURE-FIRST GATE-ZERO

**Breach.** The full theatrical 3D-ring Stage switcher (~3,500 LOC on `n-stage-impl`, geometry-correct + tested) is shelved on the BC cut (stale `~4.0.0` glass-ui + `^0.9.0` parse-that + `^0.13.0` value.js pins it must rebase off the constellation re-pin).

**Cure (SPEC — NOT executed this wave).** When the BC cut publishes + the constellation re-pins:

**Arm A — GATE-ZERO first (applies regardless of which architecture wins):**
1. **Author `proof:n-stage-boundary` BEFORE the rebase** — the bundled-DEMO import-graph walk rooted at `SceneStage.vue` asserting the HEAVY `engine.ts`/`value.js` chunk is ABSENT from the static stage-module graph (`loadAnimationEngine()` reachable only via dynamic `import()`) — the genuine oracle (a real bundled-graph walk, NOT a source-grep proxy). Born-RED on a planted heavy import in a stage module.
2. **MEASURE-FIRST (the GATE-ZERO go/no-go):** open the rebased Stage in Chrome via chrome-devtools-mcp, record the carousel-open + spin FPS. This QUANTIFIES the "SLOW" the owner named and DECIDES architecture — not merely documents a committed unshelf.

**Arm B — If GATE-ZERO clears (3D-ring FPS ≥ budget → proceed with unshelf):** transpose mobile (S2's scroll-snap becomes the phone view; 3D ring is desktop-only); verify the light-mode cure (chrome-devtools-mcp screenshot at light + dark); wire the stage-portal shared-element VT (the SAME `view-transition-name: stage-portal` on the dock trigger AND the stage nameplate before `startViewTransition`, cleared on `finished`); top-layer hit-test.

**Arm C — If GATE-ZERO fails (FPS insufficient → adopt dock-Select enhancement):** enhance the existing dock Select with a `SpringProgress` transition + a `stage-portal` morph (trigger→content) — the "grows from the dropdown" beat without the 7-preview perf risk; blockers 1/2/4 dissolve structurally; `n-stage-impl` is formally RETIRED as a live track. The CONTRIVANCE-AUDIT names this the conservative expected winner.

**Constraint (GATED — never executed pre-cut, inv-16).** S5 is a SPEC of the gated decision sequence; this wave does NOT execute the rebase, the perf trace, or the VT wiring (the BC cut is unshipped). The gate (`proof:n-stage-boundary`) is NAMED here as born-RED-on-unshelf; it is authored when the trigger fires. The NOW layer (S1–S4) is independent of S5. The mobile scroll-snap build (S2) is the phone VIEW the GATED 3D-ring would reuse (Arm B step "transpose mobile") — so splitting the NOW carousel from the GATED unshelf does not duplicate work.

**Gate bite (GATED).** On GATE-ZERO: `proof:n-stage-boundary` exits 1 on a planted heavy import; the S0 trace produces the go/no-go number. On unshelf (Arm B): the `stage-portal` VT observable asserts a single `::view-transition-group(stage-portal)` morphs trigger→nameplate. On dock-Select path (Arm C): the stage-portal VT observable asserts trigger→content morph with no 7-preview render. Pre-cut: SPECCED, not run.

---

## Born-RED gate

**Gate:** `proof:scene-switcher-mobile` (NEW — `scripts/proof-scene-switcher-mobile.mjs`; this wave authors it gate-FIRST) — born-RED over two NOW-phase clauses: `mobile-layout` (the KEYSTONE — a live 390px scroll-snap layout that does not clip or collide) + `vt-directional` (the VT scene-switch observable — forward/backward direction on the live `scene-subject` VT). The GATED unshelf gate (`proof:n-stage-boundary` + the `stage-portal` VT observable) is NAMED as born-RED-on-unshelf (authored when the BC cut fires), NOT run this wave.

**The REAL observable (observable-truth).** Each NOW clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the NOW layer |
|---|---|---|---|
| `mobile-layout` (**KEYSTONE**) | 390px emulated viewport (`withPage` `context: { viewport: { width: 390 }, isMobile: true }`) | NO mobile layout exists (the scene-stage subtree has zero `max-width`; the prototype's 720px rule COLLIDES at 390px — arrow wraps below nameplate, flanks clip) | a horizontally-snapping scroll-snap scroller; cards within `[0,390]±bleed`; no chrome overlap |
| `vt-directional` | a real `scene[i]→scene[i±1]` nav, read the active VT type | `useSceneTransition.ts:32` passes NO `types` → the active `view-transition-type` is empty (directionless cross-fade) | `forward` for next, `backward` for prev (or, where unsupported, the type-keyed CSS rule exists + the untyped cross-fade completes — honest degrade) |
| `proof:n-stage-boundary` (GATED, named) | (on unshelf) the bundled stage-module import graph | (pre-cut) the branch is shelved on stale pins; the gate is authored on unshelf | the HEAVY engine chunk absent from the static stage graph; reachable only via dynamic `import()` |
| S0 GATE-ZERO (GATED, named) | (on unshelf) carousel-open + spin FPS via chrome-devtools-mcp | (pre-cut) the "SLOW" is unquantified; the architecture is undecided | measured FPS decides: ≥ budget → 3D-ring unshelf (Arm B); < budget → dock-Select enhancement (Arm C) |
| `stage-portal` VT (GATED, named) | (on unshelf) the VT pseudo-tree on stage-open | (pre-cut) the trigger/nameplate carry DISTINCT names → no morph | one `::view-transition-group(stage-portal)` morphs the trigger geometry into the nameplate (under both Arm B and Arm C) |

**Born-RED kf-side TODAY (the keystone).** Verified this session: the scene-stage subtree has ZERO `max-width` breakpoint (`grep max-width demo/app/` → only `CubeScene.vue`, a scene rule), so there is NO mobile scene-switcher layout — at 390px the prototype collides; `useSceneTransition.ts:32` passes no `types`, so the scene-switch is directionless (`grep forward|backward|view-transition-type demo/` → empty). The `mobile-layout` clause's RED is the GENUINE defect (the phone layout collides/clips), not a proxy.

**Plant-a-failure (born-RED proof).** Before the NOW layer: `proof:scene-switcher-mobile` exits 1 because at 390px there is no scroll-snap scroller (`mobile-layout` reds) and the scene-switch carries no direction (`vt-directional` reds). The dual born-RED structure: even if a future stub adds a bare `@media (max-width:720px)` rule that greens a source-grep, the `mobile-layout` clause STILL reds (it drives a REAL 390px viewport and asserts the rendered rects do not clip/collide) — the gate NEVER false-greens on a source-grep proxy (the prototype's radius-tweak rule existed yet the layout collided).

**Green condition.** The `sceneIndex` seam (S1), the native scroll-snap mobile carousel (S2), the typed-directional scene-switch VT over the live `scene-subject` name + glass-ui 4.0.1's installed `{types}` (S3), `proof:scene-switcher-mobile` two clauses GREEN incl. a live 390px non-clipping non-colliding layout + a directional scene-switch (S4), and the GATED unshelf decision SPECCED gate-first (S5). The mobile gap (THE shelf-driver) is dissolved NOW; the theatrical switcher — in its measured-and-decided form — lands gate-first on the cut.

---

## Dependencies

- **NOW (S1–S4) — zero sibling dependency.** The scroll-snap mobile carousel + the typed-directional VT ride entirely on today's installed tree: the live `scene-subject` VT (`App.vue`), **glass-ui 4.0.1's ALREADY-INSTALLED `startViewTransition(mutate, { types })`** (`useViewTransition.d.ts` — NO glass-ui publish needed for the typed VT, a regression-DOWN on the old P.W8 dependency claim), glass-ui's published `view-transition.css` PRM degrade (already loaded), the modern-web Baseline-newly scroll-driven/VT-type primitives under the established `@supports` floor, the harness's 390px viewport context. NO glass-ui publish, NO value.js publish, NO parse-that dep.
- **GATED (S5) — the BC cut + the constellation re-pin (DM-24 / O.W15).** The GATED architecture decision (3D-ring unshelf Arm B vs dock-Select enhancement Arm C) gates on glass-ui's BC cut publishing + the re-pin (the `n-stage-impl` branch carries stale pins it must rebase off). A NAMED sibling trigger; the decision sequence is SPECCED here, executed on the cut. The NOW layer does NOT wait on it.
- **Couples to Q.WC1/Q.WC2 only at the design-language level** (both are Band-C demo-design) — no file collision. Q.WC3 owns the app-shell scene-switcher (`demo/app/`, the `scene-stage` subtree, the mobile layout); Q.WC1/Q.WC2 own the easing curve-editor.
- **Independent of the engine-perf / correctness / consume waves.** File surfaces: `demo/app/scenes.ts` (the `sceneIndex` seam), `demo/app/useSceneTransition.ts` (the `types` directional pass), `demo/app/App.vue` (the directional VT CSS beside `scene-subject`), a NEW phone-narrow scroll-snap layer (`demo/@/components/custom/` + a `useScrollSnapScene` composable), `scripts/proof-scene-switcher-mobile.mjs` (NEW), `package.json` (gate roster), and (GATED, on unshelf) the `n-stage-impl` rebase + `scripts/proof-n-stage-boundary.mjs`.
- **The top-layer toolbar caveat** is a recorded UNSHELF precondition (a chrome-devtools-mcp hit-test), NOT a NOW-layer blocker (the toolbar is reachable today; the stage is shelved).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WC3 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the GATED unshelf decision is a SPEC against a NAMED sibling trigger, never a foreign-tree edit nor a pre-cut rebase). The IMPLEMENTATION splits by phase: the NOW layer (the `sceneIndex` seam, the scroll-snap mobile carousel, the typed-directional VT, the `proof:scene-switcher-mobile` authoring) opens on the owner's explicit go with zero sibling dependency; the GATED layer (`proof:n-stage-boundary` gate-first, MEASURE-FIRST GATE-ZERO deciding architecture, then whichever arm the FPS measurement selects) opens only AFTER the glass-ui BC cut + the constellation re-pin. When the NOW layer opens it is gate-first (S4 `proof:scene-switcher-mobile` authored born-RED BEFORE S2+S3 land), observable-truth (the `mobile-layout` keystone over a real 390px rendered geometry; the `vt-directional` over the live scene-switch), modern-web-idiomatic (native scroll-snap + scroll-driven `view-timeline` under the MANDATORY `@supports ((animation-timeline: view()) and (animation-range: entry))` floor + PRM guard; `view-transition-type` over the preserved single `scene-subject` name + glass-ui 4.0.1's installed `{types}`), no-legacy (the phone gesture is the platform's, not a bespoke shrink-the-ring), KISS (the platform owns swipe/snap; the demo owns the cards + the falloff `@keyframes`), gestalt (one scene model behind the dock Select, the phone scroll-snap, and the GATED measured switcher), and MEASURE-FIRST (the GATED path begins with the S0 GATE-ZERO — the SLOW the owner named, quantified before any architectural commitment).

---

## Mid-tranche-friction pre-emption

- **FRICTION: `Q.WC3-VT-DIRECTIONAL` needs `sign(targetIndex − currentIndex)` but `useSceneTransition` does not receive the current id + `scenes.ts` exports no `sceneIndex`.** If built ad-hoc, it would hard-code a scene order (a no-legacy duplication) or stall. **PRE-EMPT:** S1 (`Q.WC3-SCENE-INDEX`) authors the ordered-index seam FIRST — the named enabling sub-wave that pre-empts the missing-helper deferral. The DAG hard-orders S1 before S3.
- **FRICTION: the keystone `mobile-layout` clause could regress to a source-grep ("a `@media` rule exists") that false-greens over a still-colliding 390px layout** (the exact prototype trap — the radius-tweak rule existed yet collided). **PRE-EMPT:** the clause drives a REAL 390px viewport and asserts the RENDERED rects do not clip/overlap (the gate-FIRST authoring at S4 locks this born-RED before the build).
- **FRICTION: `Q.WC3-NSTAGE-UNSHELF` is GATED on the glass-ui BC cut + re-pin (stale pins) — if left as a bare "deferred" it would spawn a mid-tranche scramble when the cut lands.** **PRE-EMPT:** the full GATED terminal SPEC is authored NOW (S5, gate-first `proof:n-stage-boundary` named-on-cut + MEASURE-FIRST GATE-ZERO deciding Arm B/C) — never a bare punt.
- **FRICTION: `Q.WC3-MOBILE-SWITCHER` and `Q.WC3-NSTAGE-UNSHELF` both touch the scene-switcher; the mobile scroll-snap is the phone VIEW the GATED 3D-ring would reuse.** If run in disjoint waves they could collide. **PRE-EMPT:** the split is explicit — the NOW mobile build (S2) ships independent of the GATED unshelf, AND it IS Arm B step "transpose mobile" (so the GATED arm reuses it, never re-builds it).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `sceneIndex` seam | The directional VT is built ad-hoc against a hard-coded scene order (a no-legacy duplication) or stalls on the missing helper |
| S2 `mobile-layout` | The scene-switcher has NO phone layout (the shelf-driver) OR a shrunk-3D-ring that collides at 390px (arrow wraps below nameplate, flanks clip) — a phone user gets a broken switcher |
| S3 `vt-directional` | The scene-switch is a directionless cross-fade — the dock order carries no spatial meaning, despite `view-transition-type` being free on glass-ui 4.0.1's installed `{types}` (NI-1 left on the floor) |
| S4 `mobile-layout` keystone | A bare `@media (max-width:720px)` source rule greens a source-grep while the RENDERED 390px layout still clips/collides (the EXACT prototype trap) — the runtime gate that should bite the real rendered geometry is silently green |
| S5 `proof:n-stage-boundary` (GATED) | The N-Stage unshelf rebases WITHOUT the demo-graph boundary gate, letting the HEAVY engine chunk leak into the static stage-module graph |
| S5 MEASURE-FIRST GATE-ZERO (GATED) | The architecture is decided WITHOUT quantifying the "SLOW" — the 7-preview perf risk is assumed acceptable rather than measured (MEASURE-FIRST decides, not convention) |

---

## Excluded from this wave

- **Executing the N-Stage unshelf or the dock-Select enhancement** (the `n-stage-impl` rebase, the S0 GATE-ZERO perf trace, the architecture decision, the `stage-portal` VT wiring) — GATED on the glass-ui BC cut + the constellation re-pin (DM-24 / O.W15); SPECCED here (S5), not run.
- **Editing the glass-ui dock / the press-scale pointerdown-synthesis** — any glass-ui dock press-scale / flicker issue routes to the glass-ui BC handoff lane (all dock changes go in the glass-ui repo, never patched in the demo), NOT a Q.WC3 demo edit.
- **A second VT name** beyond `scene-subject` for the directional transition — the single-name invariant is PRESERVED; direction rides `view-transition-type`, not a name.
- **The desktop 3D-ring carousel as the default switcher** — the desktop keeps the current dock Select until the GATED unshelf; the NOW layer adds the phone scroll-snap view + the directional VT, not a desktop Stage.
- **The easing curve-editor / DemoControlPoint** — that is Q.WC1/Q.WC2 (a SEPARATE Band-C wave). The MorphSVG scene is Q.WC4; the amiga refinements are Q.WC5.
- **The `CSS.paintWorklet` carousel falloff** (Chromium-only as of 2026) — the scroll-driven `view-timeline` falloff is the cross-browser path; a paint-worklet variant rides as a documented progressive-enhancement EXCLUSION.
