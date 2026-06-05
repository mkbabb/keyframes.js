# SOTA Audit — Demo Elevation (synthesis lane · FOLD-E)

**Lane.** Demo elevation — DEEP. This document **synthesizes** the two sibling
demo audits — `a-demo-ux.md` (usability / interaction / a11y) and
`a-demo-design.md` (design cogency / motion / token coherence) — into a single
**cohesive elevation proposal**: a coherent design *direction* with sequenced
moves, not a scatter of 24 independent tweaks. Read-only tranche research; **no
implementation**. Dispositions per inv-16: keyframes.js demo findings →
**FOLD-E**; value.js → **FOLD-VALUEJS-HANDOFF** (none in this lane).

**Method.** Read both source audits in full, then re-verified every load-bearing
claim against live code (`file:line` below) and re-grounded the platform claims
against the `modern-web-guidance` skill (Baseline-dated) and the glass-ui
substrate the demo already ships. Citations are exact; where the two source
audits overlap (View Transitions appears in both), I reconcile to a single
proposal.

---

## Headline

The demo is a **mature, deeply disciplined editor that is already ~85% SOTA** —
and both source audits agree on this with receipts: `0fr→1fr` grid-row height
animation (no JS measurement), engine-dogfooded reduced-motion springs, dvh +
`@supports`-gated fallbacks, safe-area discipline, a singleton keyboard-shortcut
registry, a tokenized z-contract, near-zero raw color/sizing literals in chrome,
and a gold-standard keyboard-accessible custom slider (`SpringTarget.vue`). **The
work is not a rebuild — it is consolidation and one native-platform upgrade.**

Synthesizing the two lanes, the residual gaps **collapse into four coherent
themes**, each of which is a *single design decision* applied across several
sites rather than N isolated fixes:

1. **The native-motion upgrade** — replace the hand-rolled scene cross-dissolve
   with native **View Transitions** (the glass-ui substrate is already shipped,
   unused). This is the single highest-leverage move and the only "be FULLY
   modern" lever; both audits independently named it as the headline.
2. **Apply the a11y patterns the team already owns, uniformly** — the demo
   *invented* the gold-standard `role="slider"` + arrow-key pattern in
   `SpringTarget`, then left the timeline, the visualizer ball, and the copy
   button as bare interactive `<div>`/`<span>`s. This is a *consistency* deficit,
   not a knowledge deficit — one focus-ring contract + replicating one slider
   pattern closes most of it.
3. **Finish the idiom-ownership pass (D.W2/3) into the layers it missed** — the
   D-tranche single-sourced rainbow/gold/hover-lift, but the **motion layer**
   (a divergent shadowed spring token) and the **two newest scenes** (a
   re-authored progress-rail idiom, a dead `dock-inset` class, a missing scene
   icon) still carry copy-drift rent. Same pattern, three more sites.
4. **Harden the first paint** — the hero (`AnimatedText`) runs perpetual
   unguarded motion with an invalid keyframe, the start-screen copy points the
   wrong direction, and the display font swaps without a calibrated fallback
   (hero CLS). The most identity-bearing surface is the least hardened.

Delete one dead file (`CommandPalette.vue`) and the picture is clean.

The honest verdict: **`gaps-found`, localized — a focused elevation, not a
rebuild.** Where the demo is already SOTA, §6 says so plainly.

---

## The coherent design direction

Read top-to-bottom, the four themes are a single arc: **make the platform do the
motion (1), make every interactive surface meet the bar the demo already set
(2), finish single-sourcing the visual recipes (3), and harden the first
impression (4).** Each theme is sequenced so the high-leverage, gestalt-shifting
moves land first and the polish follows. Severities and the source-audit IDs are
preserved for traceability.

---

## Theme 1 — The native-motion upgrade: View Transitions for scene navigation

**The single biggest lever.** Both `a-demo-ux.md` (E-UX-2, HIGH) and
`a-demo-design.md` (§4.1, OPPORTUNITY-MAJOR) independently identified this as the
headline modernization, from different angles (UX: directionality + shared-element
morph; Design: compositor-thread motion + the unused glass-ui substrate). They
reconcile to **one move**.

### 1.1 — Adopt `startViewTransition` for `switchScene`, reusing the shipped glass-ui substrate `[HIGH / MAJOR]`

- **Where today.** `demo/app/App.vue:231-249` drives scene swaps with a
  `SpringProgress` binding (`sceneSwapStyle`: opacity + `scale(0.97→1)`) on a
  sibling wrapper `<div>` (verified live: App.vue:238-249). The navigation itself
  is `?anim=` query-param routing (`useSceneRouter.ts` / `useSceneUrl.ts`). Grep
  confirms **zero** `startViewTransition` / `view-transition` in `demo/`.
- **The substrate is already in the tree, unused.** glass-ui ships both halves:
  - `node_modules/@mkbabb/glass-ui/dist/styles/view-transition.css` — a
    token-first `gl-list-item` group recipe with **PRM `animation: none` degrade
    baked in** (verified: the `@media (prefers-reduced-motion: reduce)` block
    zeroes every `::view-transition-*` pseudo) and a documented "≤1 element per
    `view-transition-name` per state" runtime contract.
  - `@mkbabb/glass-ui/motion-core` → `useViewTransition` — verified at
    `node_modules/@mkbabb/glass-ui/dist/useViewTransition-BONrMedQ.js`: it
    feature-detects `document.startViewTransition`, and on absence **calls the
    mutation synchronously** and returns `{ finished: resolved, transitioned:
    false }`. The ≤20-LOC instant fallback the design audit described is real.
- **Why it's SOTA (perf + elegance).** VT snapshots run on the **compositor
  thread**, off the per-frame rAF/Vue-reactive path the `SpringProgress` binding
  currently occupies — it removes a JS rAF loop from the navigation hot path
  (the design audit's perf rationale) AND unlocks **shared-element morphs** (the
  UX audit's prize): tag the active dock scene-icon and the incoming scene's
  subject with a shared `view-transition-name` and the browser morphs
  position/size between them, so cube ↔ "Cube" dock-icon visually connect instead
  of a flat cross-dissolve.
- **The architectural compatibility — verified, and decisive.** App.vue:108-135
  documents why a `<Transition>` around the keyed `<Suspense>` broke the async
  loader (the chunk was never requested → blank viewport, "B.W3's headline
  blocker"). **View Transitions sidestep that exact trap**: `startViewTransition(()
  => mutate())` wraps only the `activeSceneKey` DOM mutation, not a component that
  intercepts the async loader. So VT is architecturally compatible *where
  `<Transition>` was not* — this is the gestalt insight that makes the upgrade
  safe, not just desirable.
- **Guidance + Baseline (re-dated honestly).** Guide `same-document-transitions`
  (featuresUsed: *View transitions*) — View Transitions are **Baseline Newly
  Available since 2025-10-14** (Chrome 111, Edge 111, Firefox 144, Safari 18).
  Guide `directional-navigation-transitions` (featuresUsed: *View transitions,
  Active view transition*) gives the forward/back recipe via the
  `:active-view-transition-type(forward|backward)` pseudo + a `types: [...]`
  array passed to `startViewTransition`. **NOTE — re-dated:** *Active view
  transition* (the `types`/`:active-view-transition-type` mechanism the
  directional recipe needs) is **Baseline Newly Available only since 2026-01-13**
  (Firefox 147 shipped it Jan 2026). It is fresh; treat directionality as the
  progressive layer on top of the base cross-fade, which has the wider support.
- **Disposition.** **FOLD-E** — adopt as a scoped experiment:
  1. Route `switchScene` through `useViewTransition` (glass-ui), keep the
     `SpringProgress` fade as the **no-VT fallback** (belt-and-suspenders — the
     helper's `transitioned: false` return tells you when to run it).
  2. Adopt the `view-transition.css` substrate (PRM degrade comes free — drops
     the manual `respectReducedMotion` plumbing for this surface).
  3. Add a shared-element morph: `view-transition-name` on the dock scene-icon +
     the incoming subject (MANDATORY ≤1 per name per state).
  4. (Stretch) Directionality via `:active-view-transition-type()` once the
     2026-01-13 Baseline is comfortable — Home→scene "forward", scene→Home
     "back".
- **Isomorphism.** **Befitting departure, by design.** The supported-path swap
  changes (a compositor VT cross-fade/morph, optionally directional, replacing a
  JS opacity ramp). The unsupported path is unchanged (existing spring fade). PRM
  users get an instant cut either way. Flag in the changeset as a deliberate
  motion upgrade.

---

## Theme 2 — Apply the a11y patterns the demo already owns, uniformly

The through-line both audits converge on: **the demo knows the right patterns and
applies them unevenly.** `SpringTarget.vue:22-33,111-125` is a gold-standard
custom slider (`role="slider"`, `aria-valuenow/min/max`, `tabindex="0"`,
arrow/Home/End). The glass-ui `<Slider>` is used where it counts. The gaps are the
*other* custom interactive surfaces that never received that treatment. Closing
this theme is mostly **replication of an in-repo template**, not invention.

### 2.1 — A single demo-owned `:focus-visible` contract (the keystone) `[MED → enables the rest]`

- **Where.** Grep: `:focus-visible` exists at exactly **one** site
  (`controls/playback-button.css:34`); `:focus` at one more
  (`easing/EasingSidebar.vue:181`). There is **no demo-level focus-ring contract**
  in `style.css` / `design-idioms.css`, despite the demo owning many custom
  interactive `<div>`s (timeline markers, visualizer ball, the `role="button"`
  advanced row at `AnimationControlsControls.vue:91-103`, the spring rail).
  Source: E-UX-7.
- **Why it's the keystone.** Every other item in this theme adds focusable custom
  controls (timeline markers, visualizer, copy button). Without a focus-ring
  contract they become *invisibly* focusable — the guidance's named anti-pattern.
  `design-idioms.css` exists precisely to own what the demo depends on (its own
  header comment); a focus idiom belongs there beside `.scale-on-hover`. Fix this
  **first** and every subsequent `tabindex`-bearing control inherits a correct
  ring.
- **Guidance.** `accessibility` §5 — "Always style `:focus-visible` states
  explicitly… provide overrides with sufficient contrast," with the
  `:where(a, button):focus-visible { outline: 3px solid …; outline-offset }`
  recipe. Baseline: `:focus-visible` is Baseline-stable.
- **Disposition.** **FOLD-E.** Add one `:focus-visible` idiom to
  `design-idioms.css` covering the demo's `role`/`tabindex`-bearing custom
  elements, mirroring the existing hover-lift/tab-slide idioms.
- **Isomorphism.** Additive — only the keyboard-focused state changes (currently
  undefined). No mouse-path pixel change.

### 2.2 — Replicate the SpringTarget slider pattern onto the timeline + visualizer `[HIGH + MED]`

- **Timeline markers & playhead — pointer-only (E-UX-3, HIGH).**
  `timeline/components/TimelineTrack.vue`: diamond markers (lines 58-83) are
  `<div>`s with `@pointerdown` drag only — no `tabindex`/`role`/`@keydown`; the
  track (lines 21-35) scrubs via pointer with no ARIA. The timeline is a **core
  editing surface** and is entirely inaccessible to keyboard/AT.
- **Visualizer scrub ball — pointer-only (E-UX-4, MED).**
  `controls/AnimationVisualizer.vue:13-23`: the draggable ball is a `<div>` with
  `@pointerdown` + fling-coast, no `role`/`aria`/`tabindex`. It *duplicates* the
  sibling glass-ui `<Slider>` (`PlaybackRibbon.vue:10-21`, already accessible).
- **Why one move.** Both want the **same** template that already exists in
  `SpringTarget.vue:111-125`. The global `ArrowLeft/Right` 1%/10% scrub
  (`AnimationControlsGroup.vue:265-268`) is the keyboard semantics to mirror.
- **Guidance.** `accessibility` §2 ("don't ship interactive-looking `<div>`s with
  no role") + §5 (slider semantics + keyboard).
- **Disposition.** **FOLD-E.**
  - Timeline: playhead `role="slider"` + `aria-valuenow` (% of duration) + track
    keyboard scrub; each diamond `tabindex="0"` `role="slider"` (its `percent` is
    the value) + arrow-key move reusing the existing `moveKeyframe` emit.
  - Visualizer: **prefer `aria-hidden="true"` + `tabindex="-1"`** — the canonical
    `<Slider>` sits directly above it, so the cheapest *correct* move is to let AT
    ignore the redundant visual twin (promote to a real slider only if it ever
    becomes the sole mobile scrubber).
- **Isomorphism.** Isomorphic for pointer users; additive keyboard/AT path
  (timeline) or AT-suppression of a redundant twin (visualizer).

### 2.3 — Promote icon-only actions to real, announced controls `[MED + LOW]`

- **CopyButton is a non-focusable `<span>`, silent (E-UX-5, MED).**
  `CopyButton.vue:2-12` — `<span class="cursor-pointer" @click>` wrapping two
  icons, not in tab order, no accessible name, success is visual-only (scale/
  opacity). Used in `KeyframeCard.vue:20`, `TimingFunctionPanel`, the
  easing/spring sidebars. Note the *toast* copies (`@utils/clipboard.ts:6` →
  `toast.success`) do announce — `CopyButton` just doesn't route through them.
- **`.is-disabled` lies to AT (E-UX-6, MED).** `style.css:252-255`
  (`opacity:.5; pointer-events:none`) on the scrubber/visualizer when not started
  (`PlaybackRibbon.vue:3,54`): removes mouse interaction but leaves the control in
  the tab order with no disabled semantics. `accessibility` §2 warns precisely
  about `disabled` vs `aria-disabled` vs a *visual* disable that lies to AT.
- **`contenteditable` CSS panes unlabeled (E-UX-13, LOW).**
  `keyframes/KeyframeCard.vue:35-40` — `<pre contenteditable>` with no
  `aria-label`/`role="textbox"`/`aria-multiline`.
- **Disposition.** **FOLD-E.** CopyButton → `<button aria-label="Copy CSS">`
  reset to identical styling, announce "Copied" via the existing `vue-sonner`
  toast (consistency with `clipboard.ts`) or a polite live region (see 2.4). On
  `.is-disabled`, also set `aria-disabled="true"` (or native `disabled` on real
  form controls). Add `role="textbox" aria-multiline="true"` + `aria-label` to the
  contenteditable panes.
- **Isomorphism.** All pixel-isomorphic; additive keyboard/AT semantics.

### 2.4 — One polite `aria-live` status sink + decorative `alt` discipline `[LOW]`

- **No `aria-live` region (E-UX-10).** Grep: zero `aria-live`/`role="status"`/
  `role="alert"` in `demo/**`. Cross-cutting status (scene→"Amiga", reset, copied,
  keyframe deleted) is unannounced. A single app-level `role="status"
  aria-live="polite"` sink in `EditorShell` is the idiomatic low-cost fix; the
  `vue-sonner` toast viewport can double as it **if** it is a proper live region
  (verify — `useToastGuard.ts` already reaches into its DOM). Ties 2.1/2.2/2.3
  together (every action then has an audible confirmation).
- **`<img>` previews missing `alt` (E-UX-8).**
  `timeline/components/TimelineHoverPreview.vue:5` (html2canvas snapshot —
  decorative → `alt=""`) and `asset-manager/AssetViewport.vue:59` (user content →
  `:alt="asset.name"`). Scene icons in `TopDock.vue:173,195` already carry `alt` —
  the team gets this right elsewhere.
- **Disposition.** **FOLD-E.** One live region; `alt=""` on the preview,
  `:alt="asset.name"` on the asset. `accessibility` §1/§5/§6.
- **Isomorphism.** AT-only; pixel-isomorphic.

### 2.5 — Touch-target sizing + touch/keyboard-discoverable tooltips `[MED + LOW]`

- **Sub-24px targets (E-UX-11, MED).** `KeyframeTimeline.vue:11-12,21-22`
  (`h-7 w-7` = 28px), `:62-69` (`h-6 w-6` = 24px); `KeyframeCard.vue:16-17,20`
  (`w-6 h-6`); the collapsed timeline diamonds `w-4 h-4` = **16px**
  (`TimelineTrack.vue:64`) — the *primary* mobile drag handle, the most impactful.
  WCAG 2.2 SC 2.5.8 floor is 24×24. (The timeline grows diamonds to 24px when
  `expanded`, but the in-pane default is 16px.)
- **Bare `title` tooltips not touch/keyboard-discoverable (E-UX-12, LOW).**
  `EasingTarget.vue:77`, `SpringSidebar.vue:68` (the preset blurb — real info!),
  `EasingSelect.vue:25`. Native `title` doesn't appear on touch and is unreliable
  for AT. The demo already has `IconTooltip`/reka `Tooltip` — these are the
  off-pattern stragglers. `accessibility` §3 ("don't use `title` as naming");
  `interest-triggered-tooltips` (`interestfor`/`popover="hint"`) is the forward
  path but **not yet Baseline-wide** — reka `Tooltip` is the pragmatic choice now.
- **Disposition.** **FOLD-E.** Enlarge the collapsed-diamond hit area to ≥24px via
  transparent padding / `::before` (glyph unchanged); audit `h-6 w-6` icon buttons
  for a ≥24px interactive box. Move information-bearing bare `title`s to
  `IconTooltip`.
- **Isomorphism.** Hit-area enlargement is visually isomorphic (transparent
  padding); tooltip swap is behavior-preserving for mouse, additive for touch/kbd.

---

## Theme 3 — Finish the idiom-ownership pass into the layers D.W2/3 missed

The D-tranche idiom-ownership work (single-sourcing rainbow/gold/hover-lift into
`design-idioms.css`) is **real and holds** (both audits verify it). This theme is
its **completion** — the same single-source discipline applied to the three sites
it didn't reach: the motion-token layer, the two newest scenes, and the dock
icon set. All from `a-demo-design.md`.

### 3.1 — Kill the stale, divergent `--spring-snappy` shadow `[HIGH]`

- **Where.** `style.css:106-133` redefines `--spring-snappy` in the demo `:root`
  (OUTSIDE `@layer` → overrides glass-ui). Verified: the regen comment at
  style.css:99-105 derives it from `(response: 0.35, dampingFraction: 0.65)`.
- **The gap.** glass-ui's canonical `--spring-snappy` (its `tokens.css`) is
  generated from **ζ=0.85**, a different damping and stop cadence. The **sole**
  demo consumer is the controls-pane slide (`ControlsPaneWrapper.vue:193`) — the
  most-visible structural transition in the app springs on a curve that **matches
  no glass-ui spring** and diverges from the dependency's own "snappy". This is
  exactly the cross-repo token incoherence D.W2 set out to eliminate, surviving in
  the motion layer.
- **Disposition.** **FOLD-E.** Prefer (a) **delete the override**, consume
  glass-ui's canonical `--spring-snappy` (the regen comment becomes glass-ui's
  responsibility — KISS, no-legacy). If a bouncier pane slide is deliberately
  wanted, (b) rename to `--spring-pane` / consume `--spring-bouncy` and document
  the deviation. Do **not** keep a same-named silent shadow.
- **Isomorphism.** Adopting (a) calms the pane-slide curve (less overshoot) — a
  befitting motion-coherence delta; flag as a deliberate isomorphism break toward
  system cohesion.

### 3.2 — Promote the re-authored `progress-rail` / `progress-dot` idiom `[MED]`

- **Where.** `spring/SpringTarget.vue:128-194` and `easing/EasingTarget.vue:268-345`
  independently re-build the **same** visual recipe: a 2px `--color-progress`
  rail line (`color-mix … 8/12%`), a filled progress ball with a glow `box-shadow`
  (`color-mix … 35/40%`), a muted companion ball (`color-mix … 20/65%`), same
  `will-change` + centering math — typed twice with small drift (rail tint 8% vs
  12%; glow 35% vs 40%; ball 1.75rem vs 36px).
- **The gap.** This is the **same latent rent** D.W2.S1 named for rainbow/gold/
  hover-lift — a recurring recipe with no single source, resolving by copy. The
  two newest (E-tranche) scenes re-introduced it; the drift means a user moving
  Spring→Easing sees two slightly different greens/glows for the conceptually
  identical primitive.
- **Disposition.** **FOLD-E.** Promote a `progress-rail` / `progress-dot` idiom
  pair to `design-idioms.css`, parameterized by the `--track-ball-size-*` custom
  props `EasingTarget.vue:274-277` already exposes; both targets consume it. One
  green, one glow recipe, one source — extends the exact pattern the demo already
  owns.
- **Isomorphism.** Pick one canonical tint/glow (recommend EasingTarget's — it
  carries the AA-contrast lineage); a tiny one-scene pixel delta toward cohesion.

### 3.3 — `dock-inset` is a dead no-op class (and a latent layout bug) `[MED]`

- **Where.** Applied on `spring/SpringTarget.vue:2` and `easing/EasingTarget.vue:2`
  (verified live — both carry `… overflow-hidden dock-inset`). Grep across the
  entire demo tree **and** glass-ui's built CSS returns **zero** definitions of
  `.dock-inset`.
- **The gap.** The name promises bottom-dock clearance (the reserve tokens
  `--dock-band-reserve` / `--dock-menubar-reserve`, style.css:85-97). Both cards
  are `flex-1` full-height; today the inset silently does **not** apply, so on
  small viewports a tall target card can reach under the dock band — a dead-class
  smell **and** a latent layout bug.
- **Disposition.** **FOLD-E.** Either define `.dock-inset` in `design-idioms.css`
  (`padding-bottom: var(--dock-band-reserve)`) so the clearance is real and
  single-sourced, OR delete the class if the editor-shell grid already handles it
  (decide by observing the running small-viewport layout).
- **Isomorphism.** Defining it is a small intentional layout improvement;
  deleting it is a pure no-op cleanup.

### 3.4 — Complete the scene-icon set (spring) + format parity `[MED + LOW]`

- **Spring has no dock icon (§2.2, MED).** `dock/TopDock.vue:27-32` `sceneIcons`
  maps cube/amiga/square/easing but has **no `spring` entry**; the scene is
  registered (`app/scenes.ts:56-59`). So Spring uniquely renders the generic
  `Home` glyph (TopDock.vue:173,195 `v-if="sceneIcons[currentSceneId]" … :else
  Home`), breaking the icon-column rhythm. The Spring scene is otherwise the most
  polished E-tranche surface — the missing icon undersells it.
- **Format drift (§2.3, LOW).** TopDock.vue:22-25 imports cube/amiga/square as
  `*-icon-sm.png` but easing as `.svg`. SVG is the SOTA choice (crisp at any DPR,
  dark-mode-themeable); the PNGs soften on hi-DPR.
- **Disposition.** **FOLD-E** (spring icon) + **BOOK** (PNG→SVG migration). Add a
  `spring-icon-sm.svg`, register it in `sceneIcons`; migrate the three `.png`
  marks to `.svg` for retina parity. New icon is `.svg` from the start.
- **Isomorphism.** Additive (spring icon); near-identical, sharper on retina (SVG).

---

## Theme 4 — Harden the first paint (the most identity-bearing surface)

The start screen is the demo's first paint, and it is — paradoxically — the least
hardened surface. Three issues (one HIGH a11y+validity, two discoverability/perf)
converge on the same screen. From both audits.

### 4.1 — `AnimatedText` hero: perpetual unguarded motion + an invalid keyframe `[HIGH]`

- **Where.** `AnimatedText.vue` (verified live): `.lift-down` is
  `animation: liftDown 3s … infinite` (line 61), `.dot-fade` is
  `animation: dotFade … infinite` (line 85) — both run forever on **every
  character** of the hero title (`EditorStartScreen.vue:9-20`), with **no**
  `prefers-reduced-motion` guard in the file (grep-confirmed: PRM lives in
  App.vue, CubeTarget, AnimationVisualizer, design-idioms.css — not here).
- **Two defects.** (1) **PRM violation** — a perpetual infinite hero animation
  ignoring reduced-motion is the canonical PRM miss, and the rest of the demo is
  scrupulous about this (scene-swap is `respectReducedMotion: true`;
  `.scale-on-hover` has a PRM block). (2) **Invalid CSS** — `@keyframes liftDown`
  has a `200% { … }` stop (verified at line 78). Keyframe selectors are `[0%,
  100%]`; `200%` is dropped by every engine — dead text that misleads the reader.
- **Disposition.** **FOLD-E.** Wrap `.lift-down` / `.dot-fade` in
  `@media (prefers-reduced-motion: reduce)` parked at their resting frame (the
  demo's established idiom, design-idioms.css:121-125); delete the `200%` stop.
  Optional dog-fooding: re-express the per-char stagger via the engine (it already
  drives the scene-swap via `SpringProgress`).
- **Isomorphism.** Pixel-identical for motion-OK users; correct degrade for PRM;
  the `200%` deletion is a pure no-op cleanup.

### 4.2 — Calibrated fallback face for the CDN display font (hero CLS) `[MED]`

- **Where.** `app/index.html:22-30` (and `playground/index.html:14-19`) load
  Instrument Serif from Google Fonts with `display=swap` (correct non-blocking
  `media="print"/onload` + `<noscript>`). `--font-display` / `--font-serif` →
  `"Instrument Serif", Georgia, serif` (style.css:40-48).
- **The gap.** Instrument Serif is the demo's **display** face — it paints the
  largest text (`text-display-4` hero, every glass-ui display/title rung). With
  `font-display: swap` and **no metric-calibrated fallback `@font-face`**, it
  swaps directly to Georgia (very different metrics) → the hero title **reflows**
  on every cold load: a CLS on the largest element. glass-ui self-hosts Fira Code
  + Plus Jakarta Sans with `@capsizecss/core`-derived
  `size-adjust`/`ascent-override`/`descent-override` fallbacks (zero-CLS swap);
  Instrument Serif gets none because it lives outside glass-ui's font subsystem
  (index.html:20 documents this). CLS is a Core Web Vital; the demo is otherwise
  scrupulous (the critical-CSS inline at index.html:51-54 exists for
  layout-stable first paint).
- **Disposition.** **FOLD-E.** Add a calibrated
  `@font-face { font-family: "Instrument Serif Fallback"; src: local("Georgia");
  size-adjust/ascent-override/descent-override: … }` (derive via
  `@capsizecss/core` — the tool glass-ui already uses) and append it to the
  `--font-display`/`--font-serif` stacks. Optionally self-host the woff2 to drop
  the CDN round-trip on the LCP path (the calibrated fallback is the high-value
  half). **No value.js touchpoint** — this is demo/glass-ui font territory.
- **Isomorphism.** Resting (font-loaded) pixels identical; the **swap window**
  becomes metrically neutral (no reflow). Pure stability win.

### 4.3 — First-gesture discoverability: signpost the primary action `[MED — BOOK copy/cue]`

- **Where.** `EditorStartScreen.vue` (verified): the overlay is `pointer-events:
  none` (EditorShell.vue:27) and reads "Select an animation … **from the list
  above**" (default props, EditorStartScreen.vue:48-52). But the animation
  selector lives in the **bottom** menubar dock (`AnimationMenuBar.vue`), and the
  *primary* first action — pressing Play navigates Home→Cube and auto-plays
  (App.vue:257-271) — is **not mentioned**. The cube is draggable but the only cue
  is a small italic "or drag M. cubert" hint.
- **The gap (synthesized — both audits).** E-UX-9 (UX): the highest-value first
  action (Play) is the least signposted; the overlay points at a secondary list a
  newcomer hasn't located. §2.4 (Design): "above" is *literally wrong* — the list
  is below (menubar) on most scenes. Same screen, same root cause: the copy points
  at the wrong affordance in the wrong direction.
- **Disposition.** **FOLD-E (BOOK as a copy + cue pass).** Reword to point at the
  actual affordance ("from the dock below" / make it scene-aware), and add a cue
  toward the **primary** action — the Play control or the cube-as-hero. Low code,
  high first-impression value. Usability heuristic (visibility of system status +
  clear primary action) — no spec, but high-leverage.
- **Isomorphism.** Copy/cue only; befitting, not a behavior change.

---

## Theme 0 — Delete the dead file (do this first, costs nothing)

### 0.1 — `CommandPalette.vue` is dead, half-built, advertises a phantom Cmd+K `[HIGH]`

- **Where.** `demo/@/components/custom/CommandPalette.vue` (whole file).
  **Re-verified unused:** grep for `CommandPalette` across `demo/` returns **only
  the file itself** — zero imports, zero `<CommandPalette` tags.
- **The gap.** It renders a `⌘K` hint (verified, lines 4-10) and wires
  `useMagicKeys()["Cmd+K"]`, but (a) is mounted nowhere; (b) its `@select`
  handlers are no-op stubs that only `toggleOpen()`; (c) it imports
  `Command`/`CommandDialog` but renders inline, not as a dialog — so even if
  mounted it would not be a palette. The real shortcut surface is the `?` modal
  (`KeyboardShortcutsModal.vue`, reading the registry at
  `AnimationControlsGroup.vue:262-277`). There is **no real Cmd+K** in the app.
- **Disposition.** **FOLD-E — delete now** (KISS, no-legacy). **BOOK a *real*
  palette** as a follow-up: a genuine Cmd+K palette is a SOTA discoverability
  affordance for the 16-shortcut registry (the data already exists —
  `KeyboardShortcutsModal.vue:55` reads it). The forward-modern wiring would be
  the Invoker Commands API (guide `declarative-button-actions`, *Invoker commands*
  = **Baseline Newly Available 2025-12-12**) for declarative trigger buttons —
  named here as the modern path, not required for the delete.
- **Isomorphism.** Deleting is invisible (no consumer). A real palette is purely
  additive.

> Sequencing note: I list this as **Theme 0** because deletion is a zero-cost,
> zero-risk first commit that shrinks the surface before the four real themes
> begin. It is the "clear the desk" move.

---

## §6 — Where the demo is ALREADY SOTA (verified — do not manufacture work)

Both source audits independently confirm a high baseline. Consolidated, so the
elevation work is honestly scoped:

- **`0fr→1fr` grid-row height animation** (`ControlsPaneWrapper.vue:148-154`,
  `AnimationControlsControls.vue:295-301`) — JS-measurement-free collapse, and
  *preferable* to `interpolate-size`/`calc-size()` on today's Baseline (broader
  support, no `@supports` guard). Keep.
- **Engine-dogfooded reduced-motion scene-swap** (`App.vue:231-249`,
  `SpringProgress({ respectReducedMotion: true })`) — a defensible fallback;
  Theme 1 makes VT the *primary* path and keeps this as the no-VT fallback.
- **Dynamic-viewport sizing + `@supports`-gated fallbacks**
  (`EditorShell.vue:135-148`, `AnimationMenuBar.vue:269-279`), **safe-area insets
  + `touch-action`/`overscroll-behavior` discipline** (`TopDock.vue:114`,
  `style.css:215-216`, `CubeScene.vue:4`, `OrbitalDrag.vue:295`).
- **Gold-standard keyboard-accessible custom slider** (`SpringTarget.vue:22-33,
  111-125`) — the template Theme 2 replicates. **glass-ui `<Slider>`** used where
  it counts (`EasingTarget.vue:43-55`, `PlaybackRibbon.vue:10-21`).
- **Discoverable shortcut registry** (`AnimationControlsGroup.vue:262-277`, 16
  shortcuts) surfaced by the `?` modal; editable-target skip handled centrally.
- **`prefers-reduced-motion` honored in the idiom layer + engine**
  (`design-idioms.css:121-125`, `CubeTarget.vue:140`) — the only blind spot is
  AnimatedText (Theme 4.1).
- **`lang="en"` + non-restrictive viewport** (no `maximum-scale`/
  `user-scalable=no`), **single real `<main>` landmark** (`EditorShell.vue:34-41`,
  documented), **AA contrast remediation already done** (`SpringTarget.vue:
  196-205`).
- **Token discipline** — effectively zero arbitrary Tailwind sizing and zero raw
  color literals in chrome; the **D.W2/3 idiom-ownership layer is real and holds**
  (rainbow/gold/hover-lift/tab-slide/z-contract all single-sourced). Theme 3 is
  its *completion*, not a contradiction.
- **Layout math is sophisticated** — optical-balance offset pair (0.42:0.58,
  style.css:64-75), cycle-free dock-band reserve (style.css:83-97), documented
  mobile work-area cap (style.css:172-205).
- **Glass-ui consumption is idiomatic** — `glass-card`, `text-*` φ-ladder rungs,
  `--color-progress`/`color-mix` tinting, dock variants, semantic radius/shadow
  tokens.
- **Scroll-driven substrate (`scroll-driven.css`) correctly UNUSED** — the demo is
  a fixed-viewport editor (`overflow: hidden` on html/body, style.css:214); there
  is no page scroll to drive. **Do not manufacture scroll-driven work into a
  non-scrolling editor.** (The one marginal candidate — the Easing comparison
  list's `overflow-y-auto`, EasingTarget.vue:59-95 — is not worth it.) Named only
  for exhaustiveness; revisit only if a scrolling docs/landing surface is added.
- **`grid-background` two-fork data-URI** (`EditorShell.vue:150-157`) — data-URI
  SVG can't reference custom props; the literal black/white fork is the pragmatic
  pattern. Leave it.
- **Cube face raw primaries** (`CubeTarget.vue:124-129`) — deliberate Rubik-style
  *content* identity, not chrome. ALREADY-SOTA as content; an optional
  jewel-palette re-tone (glass-ui `--section-color-*`) is a discretionary
  identity decision only, not a token-migration obligation.

---

## Disposition summary (synthesized)

Organized by the four themes (+ Theme 0). Severities and source IDs preserved.

| Theme | # | Finding | Sev | Source | Disposition |
|-------|---|---------|-----|--------|-------------|
| 0 | 0.1 | Delete dead `CommandPalette` (phantom Cmd+K) | HIGH | UX E-UX-1 | FOLD-E (delete; BOOK real palette) |
| 1 | 1.1 | View Transitions for scene nav (glass-ui substrate) | HIGH/MAJOR | UX E-UX-2 + Design §4.1 | FOLD-E (befitting motion upgrade) |
| 2 | 2.1 | Demo-owned `:focus-visible` contract (keystone) | MED | UX E-UX-7 | FOLD-E |
| 2 | 2.2 | Slider semantics → timeline + visualizer | HIGH+MED | UX E-UX-3/4 | FOLD-E |
| 2 | 2.3 | CopyButton `<button>`; `.is-disabled` AT lie; contenteditable label | MED+LOW | UX E-UX-5/6/13 | FOLD-E |
| 2 | 2.4 | One `aria-live` sink + `<img>` alt discipline | LOW | UX E-UX-10/8 | FOLD-E |
| 2 | 2.5 | Touch targets ≥24px; bare `title` → tooltip | MED+LOW | UX E-UX-11/12 | FOLD-E |
| 3 | 3.1 | Kill divergent `--spring-snappy` shadow | HIGH | Design §1.1 | FOLD-E |
| 3 | 3.2 | Promote `progress-rail`/`progress-dot` idiom | MED | Design §1.3 | FOLD-E |
| 3 | 3.3 | `dock-inset` dead no-op class (latent layout bug) | MED | Design §2.1 | FOLD-E |
| 3 | 3.4 | Spring dock icon + PNG→SVG parity | MED+LOW | Design §2.2/2.3 | FOLD-E + BOOK |
| 4 | 4.1 | AnimatedText perpetual motion + invalid `200%` keyframe | HIGH | Design §1.2 | FOLD-E |
| 4 | 4.2 | Calibrated fallback face for CDN display font (hero CLS) | MED | Design §4.3 | FOLD-E |
| 4 | 4.3 | Start-screen first-gesture copy + cue | MED | UX E-UX-9 + Design §2.4 | FOLD-E (BOOK) |

**All findings are FOLD-E (keyframes.js demo). No value.js hand-offs in this
lane** — the demo consumes glass-ui + the engine, and the value.js touchpoints
(easing catalog, `Color`, `SpringProgress`/`SmoothProgress`) are correct usage,
not gaps. Both source audits independently reached the same null result.

### The one-paragraph elevation thesis

Delete the dead palette (0). Then take the **one native-platform upgrade** that is
both higher-fidelity and lower-cost than what it replaces — View Transitions for
scene navigation, on a substrate already in the tree (1). Then spend the bulk of
the effort **applying the demo's own gold-standard patterns uniformly** — one
focus-ring contract unlocks a sweep of `role="slider"`/`<button>`/`aria-live`
replications that close the a11y consistency gap (2). **Finish the D.W2/3
idiom-ownership pass** into the three layers it missed — the spring token, the
progress-rail recipe, the dock icon set (3). And **harden the first paint** — the
hero's PRM guard + valid CSS, the display-font CLS fallback, the start-screen
signpost (4). None of it is a rebuild; all of it is the same disciplined system,
extended to the surfaces that were left behind.
