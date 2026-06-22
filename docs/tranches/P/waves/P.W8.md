# P.W8 — the frontend-design fleet, scene 4: the N-STAGE scene-switcher + MOBILE (the shelf-driver)

**Band:** C — the demo-frontend-design fleet (this wave is the app-shell scene-switcher + the responsive/mobile layout — the most structural Band-C wave).
**Phase:** NOW (kf-internal) + GATED (the architecture-decision trigger). Two phases in one wave: **(NOW)** the responsive/mobile layout + the typed-directional View-Transition scene-switch ride entirely on today's installed tree (the live `scene-subject` VT at `App.vue:461`, the glass-ui-published `view-transition.css`, kf's LIGHT primitives — NO sibling publish). **(GATED)** the switcher architecture decision is GATED on the glass-ui BC cut (the `n-stage-impl` branch carries stale `~4.0.0` glass-ui + `^0.9.0` parse-that + `^0.13.0` value.js pins it must rebase off — per DM-24 / O.W15). On the cut: MEASURE-FIRST GATE-ZERO (S0 perf trace) decides the architecture — 3D-ring unshelf (Arm B) if FPS meets the budget, dock-Select+stage-portal-VT enhancement (Arm C) if not. The CONTRIVANCE-AUDIT names Arm C as the conservative expected winner. The named sibling trigger is the BC cut + the constellation re-pin; the NOW layer ships without it.
**Sequence:** `P.W1 apparatus (NOW) ─► C{P.W5 cube+amiga ‖ P.W6 square+spring ‖ P.W7 curve-editor ‖ P.W8 N-Stage+mobile (this wave)}` — the four Band-C waves are independent of each other. P.W8's NOW layer (mobile + typed VT) has zero sibling dependency; its GATED layer (switcher architecture decision → Arm B or C) sequences after the BC cut. (`P.md:137,163-164`; the GATED edge is `BC-cut → P.W8-gated-decision`, the NOW edge is none.)
**Owning ideas:** the AUDIT-DIGEST **D6-shell-switcher** lane (`AUDIT-DIGEST.md:858-897`) + the **X3-modern-web** scene-VT ideas (`AUDIT-DIGEST.md:1043-1070`, NI-1 typed-directional VT) + the **K5** N-Stage unshelf framing (`AUDIT-DIGEST.md:621-624`). The frontend-design precept: a theatrical-but-FAST switcher that IS the library's orchestration tier on display, and a phone layout that is phone-CORRECT (native swipe/snap), not a shrunk 3D ring.

This wave's spine is the D6 BLOCKER: **mobile is ENTIRELY unbuilt in the scene-stage subtree** — zero `max-width` breakpoints anywhere (only `prefers-reduced-motion` queries — verified on `n-stage-impl`, the disk + stage carry only `@media (prefers-reduced-motion)` rules). The shelved N "Stage" switcher is NOT a paper prototype: ~3,500 LOC of real implementation exists on `n-stage-impl` (CarouselDisk 404L, SceneStage 498L, StageArrows 245L, useCarouselOrbit 232L, useLivePreviewLOD 299L) with correct `rotateX(-15deg)` turntable geometry, a single shared `RAFPlayback` LOD clock, dogfooded `SpringProgress` orbit/arrows, and unit tests. It was shelved on FOUR identifiable blockers (`AUDIT-DIGEST.md:860`), not a fundamental flaw. P.W8 confronts them via TRANSPOSITION (a native scroll-snap carousel for phone) + the unshelf gate.

---

## Context

### The four shelf-blockers (D6 + the N harden findings, verified `file:line`)

The `n-stage-impl` branch was shelved on four specific, identifiable blockers — recorded in `docs/tranches/N/audit/prototype-harden-findings.md` and re-verified by the 32-lane re-audit:

| # | Blocker | Source location | The defect (verified 2026-06-20) |
|---|---|---|---|
| 1 | **mobile ENTIRELY unbuilt** (THE shelf-driver) | `n-stage-impl:.../scene-stage/CarouselDisk.vue` (`grep -c max-width` = **0**); the whole scene-stage subtree carries only `@media (prefers-reduced-motion)` (`SceneStage.vue:439,462`) | the 3D ring cannot shrink to a phone — flanks clip at the viewport edges, the nameplate/arrows/hint collide. The prototype's claimed 720px rule only tightens the radius + adds `flex-wrap:wrap`, which CAUSES the collision (`harden-findings.md:[med] MOBILE LAYOUT BROKEN at 390px`: console.bottom 793 > stage-hint.top 771, the next-arrow wraps below the nameplate, the ring flanks clip hard). (`AUDIT-DIGEST.md:864-866`.) |
| 2 | **light-mode contrast cure unverified in the impl** | the prototype CURED it (`harden-findings.md` screenshot 11 — nameplate/arrows `oklch(0.96)` on the dark void); the transposition to the impl is untested | the on-stage ink must be pinned light over the theme-invariant-dark void in BOTH themes (design decision 4); unverified that the impl carries the cure (`AUDIT-DIGEST.md:860`). |
| 3 | **the signature shared-element VT morph never wired** | `harden-findings.md:[low]` — the dock trigger carries `view-transition-name:dock-select-trigger`, the nameplate carries `stage-nameplate` (DISTINCT names), so the open VT "only blooms stage-root opacity 0→1" — no trigger→nameplate morph | the "grows from the dropdown" liquid-glass beat that justifies the whole feature is the missing piece (`AUDIT-DIGEST.md:867-869,880-883`). |
| 4 | **the "SLOW" S0 baseline never quantified** | `docs/tranches/N/STAGE-SPEC.md:26` (S0) mandates a perf trace of the carousel FPS as "the number every later stage is judged against" — never recorded | the 7 live previews remain an UNMEASURED perf risk; the owner named TWO failures (SLOW + WRONG) and SLOW was never measured. MEASURE-FIRST is the governing precept (`AUDIT-DIGEST.md:870-872`). |

### The transposition that dissolves blockers 1 + 4 at once (the D6 headline play)

The phone layout is NOT a shrunk 3D ring — it is a **native CSS scroll-snap carousel** (`AUDIT-DIGEST.md:876-879`). On phone-narrow, replace the 3D turntable with a horizontal `overflow-x: scroll; scroll-snap-type: x mandatory` scroller of preview cards; each card animates scale/opacity/brightness via a **scroll-driven `view-timeline`** (`animation-timeline: view(inline)`), NOT a JS spring. This:

- **(blocker 1) dissolves the mobile gap** — native swipe/snap IS the phone-correct gesture; zero bespoke shrink-the-ring layout.
- **(blocker 4) dissolves most of the perf risk** — the falloff runs on the compositor (scroll-driven `transform`/`opacity`/`scale` animations are GPU-composited), not 7 reactive Vue style recomputations per spring frame.

The modern-web carousel guide (`carousel-slide-effects`) gives the exact pattern — a `view-timeline: --item inline` per card driving a `scale`/`opacity` `@keyframes` — with the MANDATORY floor: `@supports ((animation-timeline: view()) and (animation-range: entry))` (the `animation-range` arm filters partial-support browsers) and a `prefers-reduced-motion` guard. Scroll-driven animations are Baseline-newly (Chrome 115+, Firefox 144, Safari 26) — so the `@supports` gate + a static-fallback scroller (cards visible, no scale-falloff) is the progressive-enhancement floor, exactly the demo's established `@supports(anchor-name)` pattern (`X3-modern-web` `style.css:448`).

### The typed-directional VT (blocker 3, NOW-phase — independent of the carousel)

The current scene-switch runs ONE static VT name (`scene-subject` at `App.vue:461`) with NO direction (`AUDIT-DIGEST.md:1049-1052` NI-1; `useSceneTransition.ts:32` calls `startViewTransition(() => mutate(id))` with no `types`). The modern-web `directional-navigation-transitions` guide gives the exact upgrade: compute `sign(targetIndex − currentIndex)` from the `scenes[]` order (`scenes.ts:92`) and pass `{ types: ['forward'|'backward'] }`, then CSS keys the slide on `:active-view-transition-type(forward|backward)` (slide-to-left/from-right vs slide-to-right/from-left). The scene switch gains spatial meaning (next/prev) for free; the dock order becomes legible in motion. This is **NOW-phase** — it rides the EXISTING `scene-subject` VT, needs zero carousel, zero sibling publish; `view-transition-type` is Baseline-newly (Chrome 125+) so the no-type degrade is free (an untyped cross-fade) under the established `@supports` floor. PRM degrade rides glass-ui's `view-transition.css` (already loaded). It is the highest-leverage NOW improvement and it ships independent of the unshelf gate.

### The shared-element "grows from the trigger" beat (blocker 3 continued — NOW-phase scaffolding, GATED finish)

The signature beat (`AUDIT-DIGEST.md:880-883`, `design-synthesis.md:76` "grows from the dropdown"): set the SAME `view-transition-name` (e.g. `stage-portal`) on the dock Select trigger AND the stage nameplate immediately before `startViewTransition(open)`, so a single `::view-transition-group(stage-portal)` morphs the trigger geometry into the nameplate. The `same-document-transitions` guide gives the pattern (transient shared name set in the pre-transition synchronous callback, cleared on `finished`). The NOW layer can scaffold the directional VT + the `view-transition-type` plumbing; the FULL stage-portal morph (trigger→nameplate→front-card→scene-host) lands with the carousel UNSHELF (GATED) — the nameplate is a stage element. So this wave wires the **directional VT NOW** and **records the stage-portal morph as the unshelf's signature gate** (GATED).

### The unshelf decision (the gate-first rebase — blockers 1+2+3+4 together)

The N-Stage UNSHELF is a **scoped finishing tranche, NOT a rebuild** — the `n-stage-impl` branch (~3,500 LOC, dogfooded, geometry-correct, tested) is 11 commits behind / 4 ahead of master, carrying STALE pins (`^0.9.0` parse-that, `^0.13.0` value.js, `~4.0.0` glass-ui) it must rebase off the constellation re-pin (parse-that 0.12.0, value.js 1.2.x, glass-ui post-BC) — which is WHY it is GATED on the BC cut (`AUDIT-DIGEST.md:583` "shelved and awaits the glass-ui BC cut unshelf trigger per DM-24/O.W15"). The unshelf is gate-first: author `proof:n-stage-boundary` (the demo import-graph walk asserting the HEAVY engine chunk is absent from the stage modules — `harden-findings.md` corrected the L.W11 source-grep proxy to a real bundled-graph walk) BEFORE the rebase; then MEASURE-FIRST (the STAGE-SPEC S0 perf trace, blocker 4); then transpose mobile (blocker 1); then verify the light-mode cure (blocker 2); then wire the stage-portal VT (blocker 3). This wave SPECS that gated sequence; it does not execute it (the BC cut is unshipped).

### The top-layer reachability caveat (a recorded unshelf precondition)

`harden-findings.md:[med] TOOLBAR UNREACHABLE WHILE STAGE OPEN`: the stage is a Popover-API top-layer element painting ABOVE all normal-layer z-index, so the normal-layer toolbar (Theme + Reduce-motion toggles) is unreachable by a real pointer while the stage is open. Any chrome that must stay operable over a top-layer popover must itself be in the top layer (its own popover) or inside the stage. Recorded as an unshelf precondition (a chrome-devtools-mcp hit-test before unshelf), NOT a NOW-layer blocker (the toolbar is reachable today because the stage is shelved).

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|------------------------------|
| mobile unbuilt | `n-stage-impl:.../scene-stage/CarouselDisk.vue` `grep -c max-width` = 0; `SceneStage.vue:439,462` only `@media (prefers-reduced-motion)` | THE shelf-driver — zero responsive breakpoint anywhere in the scene-stage subtree |
| mobile broken @390 | `docs/tranches/N/audit/prototype-harden-findings.md` `[med] MOBILE LAYOUT BROKEN at 390px` | console overlaps the hint, the next-arrow wraps below the nameplate, the flanks clip — the 720px rule's `flex-wrap` CAUSES it |
| current VT (no direction) | `demo/app/App.vue:461` (`view-transition-name: scene-subject`) + `demo/app/useSceneTransition.ts:32` (`startViewTransition(() => mutate(id))`, no `types`) | one static VT name, no directional/typed transition (NI-1's RED) |
| scene order | `demo/app/scenes.ts:92` (the `scenes[]` array) | the index order the directional `sign(Δindex)` derives from |
| dock trigger / nameplate | `harden-findings.md:[low]` | `view-transition-name:dock-select-trigger` ≠ `stage-nameplate` → no morph, only a fade-bloom |
| light-mode cure | `harden-findings.md:[high] LIGHT-MODE CONTRAST FAILURE` + screenshot 11 | the prototype cured it (ink `oklch(0.96)` on dark void); the impl transposition is unverified |
| S0 baseline | `docs/tranches/N/STAGE-SPEC.md:26` (S0) | the perf trace "the number every later stage is judged against" — never recorded (SLOW unquantified) |
| top-layer toolbar | `harden-findings.md:[med] TOOLBAR UNREACHABLE` | the Popover top-layer stage paints above the normal-layer toolbar — an unshelf hit-test precondition |
| branch position | `git rev-list --count n-stage-impl..master` = 11; `master..n-stage-impl` = 4 | 11 behind / 4 ahead — a scoped finishing rebase, not a rebuild |
| stale pins | `n-stage-impl:package.json` | `^0.9.0` parse-that, `^0.13.0` value.js, `~4.0.0` glass-ui — must rebase off the constellation re-pin (WHY it is BC-gated) |
| boundary gate (corrected) | `harden-findings.md` (the N.W2 correction) | the EXISTING `proof:boundary` scans only the library barrel; the genuine oracle is a NEW `proof:n-stage-boundary` walking the bundled DEMO import graph from `SceneStage.vue` |
| harness viewport | `scripts/lib/demo-driver.mjs:508` (`withPage` `context` → `browser.newContext`, "viewport etc.") | a real 390px mobile-viewport context is a harness capability (the live mobile-layout assertion's substrate) |
| mobile precedent | `scripts/proof-mobile-single-page.mjs`, `proof-live-session-mobile.mjs`, `proof-lighthouse-mobile.mjs` | existing mobile-viewport runtime gates — the harness shape this wave's `mobile-layout` clause mirrors |
| VT precedent | `scripts/proof-scene-transition-perf.mjs` | the existing scene-VT runtime gate — the harness the `vt-directional` clause extends |
| dogfood claim | `STAGE-SPEC.md` (S2/S5/S7 `SpringProgress`/`stagger` dogfood) | the switcher IS the library's orchestration tier on display (the design rationale) |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable, split by phase. **NOW (no sibling gate): S1** the responsive mobile layout (the scroll-snap transposition — the shelf-driver cure that ships independent of the carousel). **S2** the typed-directional scene-switch View Transition (NI-1, over the live `scene-subject` VT). **S3** the born-RED gates: a live mobile-viewport layout assertion + the VT scene-switch observable. **GATED (the BC-cut trigger): S4** the MEASURE-FIRST GATE-ZERO architecture decision (RE-SCOPED: `proof:n-stage-boundary` → S0 FPS GATE-ZERO decides Arm B 3D-ring unshelf vs Arm C dock-Select enhancement → stage-portal VT under whichever arm). Every NOW move ships on today's tree; every GATED move is specced against a NAMED sibling trigger, never executed pre-cut. The CONTRIVANCE-AUDIT names Arm C (dock-Select+stage-portal-VT) as the conservative expected winner.

---

### S1 — The responsive MOBILE layout (NOW): the scroll-snap transposition (the shelf-driver cure)

**Breach.** Mobile is ENTIRELY unbuilt — zero `max-width` breakpoints in the scene-stage subtree (`CarouselDisk.vue` `grep -c max-width` = 0; only `@media (prefers-reduced-motion)`). At 390px the prototype collides (console over hint, arrow wraps below nameplate, flanks clip — `harden-findings.md:[med]`). This is THE shelf-driver (`AUDIT-DIGEST.md:864-866`).

**Cure.** Build the phone-narrow layout by TRANSPOSITION, not by shrinking the ring. On a phone-narrow container query (`@container` / `@media (max-width: 720px)`), render the scenes as a **native horizontal scroll-snap carousel** (`AUDIT-DIGEST.md:876-879`):

- A scroller: `overflow-x: scroll; scroll-snap-type: x mandatory;` of preview cards, each `scroll-snap-align: center`.
- The card falloff (scale/opacity/brightness) driven by a **scroll-driven `view-timeline`** per the `carousel-slide-effects` guide: `view-timeline: --card inline` + `animation-timeline: --card` over a `@keyframes` that scales/brightens the centered card and dims the flanks — on the COMPOSITOR, not a JS spring (zero per-frame Vue recompute).
- The MANDATORY modern-web floor: `@supports ((animation-timeline: view()) and (animation-range: entry))` gates the scroll-driven falloff (the `animation-range` arm filters partial-support browsers — guide-mandated); the static fallback is a plain scroll-snap scroller (all cards visible at uniform scale — still a usable phone carousel). PRM: `@media (prefers-reduced-motion: reduce)` disables the scale/brightness falloff (cards static), per the guide.
- The phone layout uses the SAME scene model + the SAME `runSceneSwitch` commit (a snapped card → tap → `runSceneSwitch(id)`), so it is the phone VIEW of the same switcher, not a parallel feature.

**Constraint (NOW, no sibling gate — the scroll-snap is shippable today).** This is a pure demo-CSS + a `useScrollSnapScene` composable layer; it rides ZERO carousel-unshelf dependency — it can ship as the phone switcher whether or not the 3D Stage ever unshelves (the desktop keeps the current dock Select until the GATED unshelf). The native scroll-snap dissolves the mobile gap on its own (`AUDIT-DIGEST.md:878` "the mobile blocker dissolves — native swipe/snap IS the phone-correct gesture"). KISS: the platform owns the gesture + the snap; the demo owns the cards + the falloff `@keyframes`.

**Gate bite (S3 coverage).** `proof:scene-switcher-mobile` `mobile-layout` clause: on a 390px emulated viewport, assert the scene-switcher renders a horizontally-snapping scroller whose cards do NOT clip at the viewport edge AND no two chrome elements (arrow/nameplate/hint) overlap (no element wraps below another). Today: there is no mobile layout (the scene-stage subtree has zero breakpoint) and at 390px the prototype collides → red.

---

### S2 — The typed-directional scene-switch View Transition (NOW): NI-1 over the live `scene-subject` VT

**Breach.** The scene-switch runs ONE static VT name (`scene-subject`, `App.vue:461`) with NO direction — `useSceneTransition.ts:32` calls `startViewTransition(() => mutate(id))` with no `types`. The cross-fade is directionless; the dock order carries no spatial meaning (`AUDIT-DIGEST.md:1049-1052` NI-1).

**Cure.** Pass a directional `view-transition-type` derived from the scene-index delta:

1. In `useSceneTransition.ts`, compute `sign(targetIndex − currentIndex)` from the `scenes[]` order (`scenes.ts:92`) and pass `{ update: mutate, types: [delta > 0 ? 'forward' : 'backward'] }` to `startViewTransition` (the `directional-navigation-transitions` guide pattern — the type matches the CSS `:active-view-transition-type()` selector).
2. CSS (demo-side, beside the existing `scene-subject` rule): key the slide on the type — `html:active-view-transition-type(forward) ::view-transition-old(scene-subject) { animation-name: slide-to-left }` / `::view-transition-new(scene-subject) { animation-name: slide-from-right }`, and the mirror for `backward`. Animate `transform` (translateX) only — compositor-performant, per the guide. The shared `::view-transition-group(scene-subject)` carries the duration/easing.
3. PRM: `@media (prefers-reduced-motion: reduce) { ::view-transition-group(scene-subject) { animation: none !important } }` — the directional slide degrades to an instant cut (guide-mandated; this also rides glass-ui's `view-transition.css` PRM degrade, not a duplicate).

**Constraint (NOW — the single-name invariant is PRESERVED).** This does NOT add a second VT name (`App.vue:454` mandates exactly ONE element per VT state) — it drives DIRECTION via `view-transition-type` on the SAME `scene-subject` name (`AUDIT-DIGEST.md` X3 rec "keep the single `view-transition-name: scene-subject` invariant untouched — drive direction via TYPE"). `view-transition-type` is Baseline-newly (Chrome 125+); where absent, the untyped cross-fade is the free degrade (the type is simply ignored), under the established `@supports`/feature-detect floor (`startViewTransition` already feature-detects in glass-ui's helper). NOW-phase: zero carousel, zero sibling publish.

**Gate bite (S3 coverage).** `proof:scene-switcher-mobile` `vt-directional` clause (the VT scene-switch observable): a real nav from `scene[i] → scene[i+1]` reads the active `view-transition-type` (or the `::view-transition-old(scene-subject)` animation-name) as `forward`, and `scene[i] → scene[i−1]` as `backward`. Today: no type is passed (`useSceneTransition.ts:32`) → the active type is empty → red.

---

### S3 — The born-RED gates: live mobile-viewport layout + the VT scene-switch observable (the keystone — observable-truth)

**Breach.** No gate covers the mobile scene-switcher layout NOR the directional VT. The existing mobile gates (`proof:mobile-single-page`, `proof:live-session-mobile`) cover the single-page shell, not the scene-switcher carousel; `proof:scene-transition-perf` covers VT perf, not direction.

**Cure.** Author `scripts/proof-scene-switcher-mobile.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the mobile-viewport harness (`scripts/lib/demo-driver.mjs` `withPage` with `context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }` — the harness forwards `context` to `browser.newContext`, `demo-driver.mjs:508`). Wire it into the `proof:correctness` roster (`package.json`, beside the other live mobile gates). Two clauses, both born-RED on today's tree:

1. **`mobile-layout`** (THE KEYSTONE — observable-truth): at 390px, assert the scene-switcher renders a horizontally-snapping scroller (`scroll-snap-type: x mandatory` resolved on the scroller element), the cards do NOT clip at the viewport edge (every card's `getBoundingClientRect()` is within `[0, 390]` ± a small bleed), and NO two chrome elements overlap (the `harden-findings.md:[med]` collision signature — arrow.top vs nameplate.bottom vs hint.top — does NOT recur). BITE: re-introduce the 3D-ring shrink (no scroll-snap scroller) or a colliding stack → red.
2. **`vt-directional`** (the VT scene-switch observable): a real nav `scene[i] → scene[i+1]` reads the active directional VT type as `forward`; `scene[i] → scene[i−1]` reads `backward`. (Where `view-transition-type` is unsupported in the headless runner, the clause asserts the type-keyed CSS rule EXISTS in the stylesheet AND the untyped cross-fade still completes — the degrade is honest, not a silent skip.) BITE: a directionless `startViewTransition` with no `types` → empty active type → red.

**Constraint (observable-truth — the keystone).** The `mobile-layout` clause MUST bite the GENUINE defect (the phone layout collides / clips), not a proxy. The proxy trap is asserting only that a `@media (max-width: 720px)` rule EXISTS in the source — which the prototype's broken radius-tweak rule would pass while still colliding at 390px. The clause forbids that: it drives a REAL 390px viewport and asserts the RENDERED rects do not clip and do not overlap — the observable a phone user sees. A green "a max-width rule exists" over a colliding layout must STILL red `mobile-layout`. This is the inv-two-axis classification: a responsive-layout defect closes via a RUNTIME viewport gate over the live rendered geometry, never a source-grep stand-in (the EXACT lesson the gate-blindspot feedback records — green source-shape gates miss appearance/interaction/state).

**Gate bite.** `node scripts/proof-scene-switcher-mobile.mjs` → exit 1 today (no mobile scroll-snap layout, no directional VT type). After S1+S2 land: both clauses green; `mobile-layout` confirms a real 390px scroll-snap carousel that does not clip or collide, `vt-directional` confirms the scene-switch carries forward/backward direction.

---

### S4 — The N-Stage unshelf decision (GATED on the BC cut): MEASURE-FIRST GATE-ZERO + dock-Select path (RE-SCOPED)

**Breach.** The full theatrical 3D-ring Stage switcher (~3,500 LOC on `n-stage-impl`, geometry-correct + tested) is shelved on the BC cut (stale `~4.0.0` glass-ui + `^0.9.0` parse-that + `^0.13.0` value.js pins it must rebase off the constellation re-pin — `AUDIT-DIGEST.md:583`).

**RE-SCOPE (loop harden, 2026-06-22).** The original spec assumed the 3D-ring unshelf as the decided architecture and placed the STAGE-SPEC S0 perf trace as step 2. The CONTRIVANCE-AUDIT RE-SCOPES the N-Stage unshelf itself: "when the BC glass-ui cut unblocks the rebase, ENHANCE THE EXISTING DOCK SELECT with a SpringProgress transition + a view-transition morph rather than reviving the bespoke 7-component carousel." The audit's conservative winner over the 3D-ring revival delivers blocker 3's signature "grows from the trigger" morph for a fraction of the LOC (structurally dissolving blockers 1/2/4 — no ring to shrink, no on-ring ink, no 7-preview perf risk, no top-layer-toolbar conflict).

**MEASURE-FIRST is the GATE-ZERO.** The STAGE-SPEC S0 perf trace MUST be the decision oracle, not a documentation step after an assumed unshelf. The S0 trace (carousel-open + spin FPS on the rebased `n-stage-impl`) DECIDES the architecture:
- If the 7-preview loop meets the FPS budget → the full 3D-ring unshelf proceeds (gate-first sequence below).
- If the 7-preview loop fails the FPS budget → the dock-Select enhancement is the ADOPTED architecture (it structurally dissolves the perf risk by eliminating 7 live previews).

The dock-Select+stage-portal-VT path is the EXPECTED outcome based on the audit; the 3D-ring unshelf remains the contingency if MEASURE-FIRST clears it.

**Gated sequence (SPEC — NOT executed this wave).** When the BC cut publishes + the constellation re-pins:

**Arm A — GATE-ZERO first (applies regardless of which architecture wins):**
1. **Author `proof:n-stage-boundary` BEFORE the rebase** — the bundled-DEMO import-graph walk rooted at `SceneStage.vue` asserting the HEAVY `engine.ts`/`value.js` chunk is ABSENT from the static stage-module graph (`loadAnimationEngine()` reachable only via dynamic `import()`) — the genuine oracle the N.W2 correction established (`harden-findings.md`). Born-RED on a planted heavy import in a stage module.
2. **MEASURE-FIRST (the GATE-ZERO go/no-go):** open the rebased Stage in Chrome via chrome-devtools-mcp, record the carousel-open + spin FPS. This QUANTIFIES the "SLOW" the owner named and DECIDES architecture — not merely documents a committed unshelf.

**Arm B — If GATE-ZERO clears (3D-ring FPS ≥ budget → proceed with unshelf):**
3. **Transpose mobile (blocker 1):** the S1 scroll-snap layout becomes the phone view of the Stage (3D ring is desktop-only; phone gets the scroll-snap view).
4. **Verify the light-mode cure (blocker 2):** chrome-devtools-mcp screenshot at light + dark asserting on-stage ink reads (prototype's `oklch(0.96)` cure — `harden-findings.md:[high]` + screenshot 11).
5. **Wire the stage-portal shared-element VT (blocker 3):** set the SAME `view-transition-name: stage-portal` on the dock Select trigger AND the stage nameplate before `startViewTransition(open)` (`same-document-transitions` pattern), so a single `::view-transition-group(stage-portal)` morphs the trigger into the nameplate. Clear the transient name on `finished`.
6. **Top-layer hit-test:** chrome-devtools-mcp hit-test confirming chrome operable over the top-layer Popover (`harden-findings.md:[med]`).

**Arm C — If GATE-ZERO fails (FPS insufficient → adopt dock-Select enhancement):**
3. **Enhance the existing dock Select** with a `SpringProgress` transition (the orbit gesture) + a `view-transition-name: stage-portal` morph (trigger→content) — the "grows from the dropdown" beat (`AUDIT-DIGEST.md:880-883`) without the 7-preview perf risk.
4. Blockers 1/2/4 dissolve structurally (no ring to shrink, no ring ink, no 7 live previews). The `n-stage-impl` branch is formally RETIRED as a live development track.

**Constraint (GATED — never executed pre-cut, inv-16).** S4 is a SPEC of the gated decision sequence; this wave does NOT execute the rebase, the perf trace, or the VT wiring (the BC cut is unshipped). The gate (`proof:n-stage-boundary`) is NAMED here as born-RED-on-unshelf; it is authored when the trigger fires. The NOW layer (S1+S2+S3) is independent of S4.

**Gate bite (GATED).** On GATE-ZERO: `proof:n-stage-boundary` exits 1 on a planted heavy import; the S0 trace produces the go/no-go number. On unshelf (Arm B): the `stage-portal` VT observable asserts a single `::view-transition-group(stage-portal)` morphs trigger→nameplate. On dock-Select path (Arm C): the stage-portal VT observable asserts trigger→content morph with no 7-preview render. Pre-cut: SPECCED, not run.

---

## Born-RED gate

**Gate:** `proof:scene-switcher-mobile` (NEW — `scripts/proof-scene-switcher-mobile.mjs`; this wave authors it) — born-RED over two NOW-phase clauses: `mobile-layout` (the KEYSTONE — a live 390px scroll-snap layout that does not clip or collide) + `vt-directional` (the VT scene-switch observable — forward/backward direction on the live `scene-subject` VT). The GATED unshelf gates (`proof:n-stage-boundary` + the `stage-portal` VT observable) are NAMED as born-RED-on-unshelf (authored when the BC cut fires), NOT run this wave.

**The REAL observable (observable-truth).** Each NOW clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the NOW layer |
|---|---|---|---|
| `mobile-layout` (**KEYSTONE**) | 390px emulated viewport (`withPage` `context: { viewport: { width: 390 }, isMobile: true }`) | NO mobile layout exists (the scene-stage subtree has zero `max-width`; the prototype's 720px rule COLLIDES at 390px — arrow wraps below nameplate, flanks clip — `harden-findings.md:[med]`) | a horizontally-snapping scroll-snap scroller; cards within `[0,390]±bleed`; no chrome overlap |
| `vt-directional` | a real `scene[i]→scene[i±1]` nav, read the active VT type | `useSceneTransition.ts:32` passes NO `types` → the active `view-transition-type` is empty (directionless cross-fade) | `forward` for next, `backward` for prev (or, where unsupported, the type-keyed CSS rule exists + the untyped cross-fade completes — honest degrade) |
| `proof:n-stage-boundary` (GATED, named) | (on unshelf) the bundled stage-module import graph | (pre-cut) the branch is shelved on stale pins; the gate is authored on unshelf | the HEAVY engine chunk absent from the static stage graph; reachable only via dynamic `import()` |
| S0 GATE-ZERO (GATED, named) | (on unshelf) carousel-open + spin FPS via chrome-devtools-mcp | (pre-cut) the "SLOW" is unquantified; the architecture (3D-ring vs dock-Select enhancement) is undecided | measured FPS decides: ≥ budget → 3D-ring unshelf (Arm B); < budget → dock-Select enhancement adopted (Arm C) |
| `stage-portal` VT (GATED, named) | (on unshelf) the VT pseudo-tree on stage-open | (pre-cut) the trigger/nameplate carry DISTINCT names → no morph (`harden-findings.md:[low]`) | one `::view-transition-group(stage-portal)` morphs the trigger geometry into the nameplate (applies under both Arm B and Arm C) |

**Born-RED kf-side TODAY (the keystone).** Verified this session: the scene-stage subtree has ZERO `max-width` breakpoint (`CarouselDisk.vue` `grep -c max-width` = 0; only `@media (prefers-reduced-motion)`), so there is NO mobile scene-switcher layout — at 390px the prototype collides (`harden-findings.md:[med]`); `useSceneTransition.ts:32` passes no `types`, so the scene-switch is directionless. The `mobile-layout` clause's RED is the GENUINE defect (the phone layout collides/clips), not a proxy.

**Plant-a-failure (born-RED proof).** Before the NOW layer: `proof:scene-switcher-mobile` exits 1 because at 390px there is no scroll-snap scroller (the cards clip / the chrome collides — `mobile-layout` reds) and the scene-switch carries no direction (`vt-directional` reds). The dual born-RED structure: even if a future stub adds a bare `@media (max-width:720px)` rule that greens a source-grep, the `mobile-layout` clause STILL reds (it drives a REAL 390px viewport and asserts the rendered rects do not clip/collide) — the gate NEVER false-greens on a source-grep proxy (the prototype's radius-tweak rule existed yet the layout collided).

**Green condition.** The native scroll-snap mobile carousel (S1), the typed-directional scene-switch VT over the live `scene-subject` name (S2), `proof:scene-switcher-mobile` two clauses GREEN incl. a live 390px non-clipping non-colliding scroll-snap layout + a directional scene-switch (S3), and the GATED unshelf decision SPECCED gate-first (S4 — `proof:n-stage-boundary` + MEASURE-FIRST GATE-ZERO + architecture decided by FPS → either 3D-ring unshelf Arm B or dock-Select enhancement Arm C + the `stage-portal` VT morph under whichever arm, authored on the BC cut). The mobile gap (THE shelf-driver) is dissolved NOW; the theatrical switcher — in its measured-and-decided form — lands gate-first on the cut.

---

## Dependencies

- **NOW (S1+S2+S3) — zero sibling dependency.** The scroll-snap mobile carousel + the typed-directional VT ride entirely on today's installed tree: the live `scene-subject` VT (`App.vue:461`), glass-ui's published `view-transition.css` PRM degrade (already loaded), the modern-web Baseline-newly scroll-driven/VT-type primitives under the established `@supports` floor, the harness's 390px viewport context (`demo-driver.mjs:508`). NO glass-ui publish, NO value.js publish, NO parse-that dep.
- **GATED (S4) — the BC cut + the constellation re-pin (DM-24 / O.W15).** The GATED architecture decision (3D-ring unshelf Arm B vs dock-Select enhancement Arm C) gates on glass-ui's BC cut publishing + the re-pin (the `n-stage-impl` branch carries stale `~4.0.0` glass-ui + `^0.9.0` parse-that + `^0.13.0` value.js it must rebase off — `AUDIT-DIGEST.md:583`). This is a NAMED sibling trigger; the decision sequence (GATE-ZERO → architecture → stage-portal VT) is SPECCED here, executed on the cut. The NOW layer does NOT wait on it. Note: the CONTRIVANCE-AUDIT names the dock-Select+stage-portal-VT path (Arm C) as the conservative expected winner, dissolving blockers 1/2/4 structurally; the 3D-ring unshelf (Arm B) remains available contingent on the GATE-ZERO FPS measurement.
- **Couples to P.W7 only at the design-language level** (both are Band-C demo-design) — no file collision. P.W8 owns the app-shell scene-switcher (`demo/app/`, the `scene-stage` subtree, the mobile layout); P.W7 owns the easing curve-editor.
- **Independent of the engine-perf (P.W2–P.W4) / correctness (P.W9) / consume (P.W12) waves.** File surfaces: `demo/app/useSceneTransition.ts` (the `types` directional pass), `demo/app/App.vue` (the directional VT CSS beside `scene-subject`), a NEW phone-narrow scroll-snap layer (`demo/@/components/custom/` + a `useScrollSnapScene` composable), `scripts/proof-scene-switcher-mobile.mjs` (NEW), `package.json` (gate roster), and (GATED, on unshelf) the `n-stage-impl` rebase + `scripts/proof-n-stage-boundary.mjs`. It BENEFITS from P.W1's apparatus (the `mobile-layout` clause reuses the viewport harness) but does not depend on it.
- **The top-layer toolbar caveat** (`harden-findings.md:[med]`) is a recorded UNSHELF precondition (a chrome-devtools-mcp hit-test), NOT a NOW-layer blocker (the toolbar is reachable today; the stage is shelved).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W8 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the GATED unshelf decision is a SPEC against a NAMED sibling trigger, never a foreign-tree edit nor a pre-cut rebase). The IMPLEMENTATION splits by phase: the NOW layer (the scroll-snap mobile carousel, the typed-directional VT, the `proof:scene-switcher-mobile` authoring) opens on the owner's explicit go with zero sibling dependency; the GATED layer (`proof:n-stage-boundary` gate-first, MEASURE-FIRST GATE-ZERO deciding architecture, then whichever arm the FPS measurement selects) opens only AFTER the glass-ui BC cut + the constellation re-pin. When the NOW layer opens it is gate-first (S3 `proof:scene-switcher-mobile` authored born-RED BEFORE S1+S2 land), observable-truth (the `mobile-layout` keystone over a real 390px rendered geometry; the `vt-directional` over the live scene-switch), modern-web-idiomatic (native scroll-snap + scroll-driven `view-timeline` under the MANDATORY `@supports ((animation-timeline: view()) and (animation-range: entry))` floor + PRM guard; `view-transition-type` over the preserved single `scene-subject` name), no-legacy (the phone gesture is the platform's, not a bespoke shrink-the-ring), KISS (the platform owns swipe/snap; the demo owns the cards + the falloff `@keyframes`), gestalt (one scene model behind the dock Select, the phone scroll-snap, and the GATED measured switcher — Arm B or C), and MEASURE-FIRST (the GATED path begins with the S0 GATE-ZERO — the SLOW the owner named, quantified before any architectural commitment, deciding 3D-ring vs dock-Select).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `mobile-layout` | The scene-switcher has NO phone layout (the shelf-driver) OR a shrunk-3D-ring that collides at 390px (arrow wraps below nameplate, flanks clip) — a phone user gets a broken or unusable switcher (the D6 BLOCKER) |
| S2 `vt-directional` | The scene-switch is a directionless cross-fade — the dock order carries no spatial meaning, despite `view-transition-type` being free on the existing `scene-subject` VT (NI-1 left on the floor) |
| S3 `mobile-layout` keystone | A bare `@media (max-width:720px)` source rule greens a source-grep while the RENDERED 390px layout still clips/collides (the EXACT prototype trap — the radius-tweak rule existed yet collided) — the runtime gate that should bite the real rendered geometry is silently green |
| S4 `proof:n-stage-boundary` (GATED) | The N-Stage unshelf rebases WITHOUT the demo-graph boundary gate, letting the HEAVY engine chunk leak into the static stage-module graph (the L.W11 source-grep proxy the N.W2 correction retired) |
| S4 MEASURE-FIRST GATE-ZERO (GATED) | The architecture is decided WITHOUT quantifying the "SLOW" — the 7-preview perf risk is assumed acceptable rather than measured; the 3D-ring is unshelved into a slow render, OR the dock-Select path is rejected without data (MEASURE-FIRST decides, not convention) |
| S4 `stage-portal` / dock-Select path (GATED) | The switcher lands WITHOUT the "grows from the trigger" morph (the signature beat, left as a bare fade-bloom) — applies whether the unshelf goes 3D-ring (Arm B) or dock-Select (Arm C) |

---

## Excluded from this wave

- **Executing the N-Stage unshelf or the dock-Select enhancement** (the `n-stage-impl` rebase, the S0 GATE-ZERO perf trace, the architecture decision, the `stage-portal` VT wiring) — GATED on the glass-ui BC cut + the constellation re-pin (DM-24 / O.W15); SPECCED here (S4), not run. The branch carries stale pins it must rebase off; the architecture is decided by MEASURE-FIRST at GATE-ZERO, not by a prior commitment to the 3D ring.
- **Editing the glass-ui dock / the press-scale pointerdown-synthesis** (`App.vue:378-449`) — any glass-ui dock press-scale / flicker issue routes to the glass-ui BC handoff lane (`feedback_glass_ui_root_changes` — all dock changes go in the glass-ui repo, never patched in the demo), NOT a P.W8 demo edit.
- **A second VT name** beyond `scene-subject` for the directional transition — the single-name invariant (`App.vue:454`) is PRESERVED; direction rides `view-transition-type`, not a name.
- **The desktop 3D-ring carousel as the default switcher** — the desktop keeps the current dock Select until the GATED unshelf; the NOW layer adds the phone scroll-snap view + the directional VT, not a desktop Stage.
- **The curve-editor / DemoControlPoint** — that is P.W7 (a SEPARATE Band-C wave over the easing scene).
- **The `CSS.paintWorklet` carousel falloff** (Chromium-only as of 2026) — the scroll-driven `view-timeline` falloff is the cross-browser path; a paint-worklet variant rides as a documented progressive-enhancement EXCLUSION, never a Baseline regression.
