# E.W11 — Demo elevation (View Transitions · a11y uniformity · idiom r3 · first-paint)

The demo elevated — one native-motion upgrade for scene nav, the a11y patterns
the demo *invented but applies unevenly* made uniform, the D.W2/W3
idiom-ownership pass finished into the layers it missed, and the first paint
hardened. This wave is the implementation charter for `d-demo-elevate.md` — the
deep-SOTA lane that already distilled the 24 demo findings (from `a-demo-ux.md`
+ `a-demo-design.md`) into one coherent four-theme design direction, sharpened
by the `r-cwv-perf.md` re-exec's three fully-Baseline CWV levers and
`r-interpolation.md` F-4's teaching scene. W11 does **not** re-derive that
synthesis; it grounds each move against live source and folds it.

This is the demo-band twin of the E engine band (W7/W8/W9/W10): it is **demo
`@/` only**, file-disjoint from every engine wave, parallel to W1/W2/W3 (and
rebases onto the shells those waves restructure, the same sequencing-allowance
D used). It is gated by **inv ο** — *the demo meets the SOTA bar it set itself,
uniformly* — whose `proof:demo-elevate` clauses STAY in CI after the wave
closes.

This is NET-NEW post-D demo residual, not folded debt. The deferred ledger is
CLEAN (D terminated every keyframes-owned deferral; zero KFE). E.W11's items
are findings of the post-D **deep** SOTA assay — surfaced by comparing the demo
against the W3C platform frontier (View Transitions, `@starting-style`,
`content-visibility`, metric-matched font fallback) and the demo's *own*
gold-standard a11y/idiom templates, not against the Baseline-capability
checklist E.W0–W6 already cleared. The FINAL states that provenance plainly.

## § Provenance

The §E.W11 distillation of `audit/sota/_SYNTHESIS-E-augmentation.md`, which folds:
- **`d-demo-elevate.md`** — the four-theme synthesis of `a-demo-ux.md` +
  `a-demo-design.md` (the 24 demo findings → one design direction). **W11
  consumes this lane as its charter.**
- **`d-modern-platform.md`** (D-DEMO-1/2/3) — the View-Transitions scene-nav
  move, the native scroll-driven showcase, the thin PRM CSS coverage.
- **`r-modern-web-digest.md`** — VT / `@starting-style` / soft-edge content-fade
  digest.
- **`r-cwv-perf.md`** (B-1 LCP/CLS metric-matched font fallback; B-2
  `content-visibility: hidden` on the inactive Monaco tab for INP; B-3
  `visibilitychange` scene-loop pause for battery) — **plus the two cross-lane
  corrections** that the demo has **no `KeepAlive`** (one scene mounted at a
  time via a keyed `<Suspense>`) and is **already native-`color-mix()`-idiomatic**
  (both recorded ALREADY-SOTA so no work is manufactured).
- **`r-interpolation.md`** (F-4 — the `@starting-style` + spring-`linear()`
  copy-paste artifact scene, named the highest-ROI demo addition in that lane).

The CWV **loading critical path is already at-or-ahead of SOTA** (`r-cwv-perf.md`
A-3..A-9: inlined critical CSS, non-render-blocking stylesheet+fonts,
Monaco/Three code-split + `modulepreload`-excluded, the editor double-gated, a
live-probed `yieldToMain`, bf-cache unobstructed, `fetchpriority` correctly
absent for the text LCP) — recorded ALREADY-SOTA in §Folds so W11 manufactures
no loading work. The two remaining fully-Baseline-safe CWV wins are
interaction- and battery-shaped (Theme 5), not loading-path.

## § State, verified (not asserted)

The live facts — `grep`/`Read` against demo source (excluding `dist/`) + the
pinned glass-ui dist, read-confirmed:

1. **`CommandPalette.vue` is dead — defined, unimported, advertising a phantom
   Cmd+K.** It exists at `demo/@/components/custom/CommandPalette.vue`; a
   reference-grep over demo `.vue`/`.ts` (excluding `dist/`) finds **zero
   importers**. The `demo/CLAUDE.md:19` tree still documents it as "Cmd+K
   palette." It is a phantom affordance — code the build carries, the shipped
   surface never mounts. A zero-cost first commit.

2. **Scene nav rides a JS opacity ramp; glass-ui ships `useViewTransition`
   UNUSED.** `switchScene` is wired through `App.vue` (the `@switch-scene`
   handler at `:11`, the `SharePopover` restore at `:24`, wrapping
   `rawSwitchScene` from `demo/app/useSceneRouter.ts` at `App.vue:197`). The
   scene-swap is an **engine-dogfooding `SpringProgress` cross-dissolve**
   (`App.vue:231-249`): a keyed `<Suspense>` hard-cuts the scene, then a
   `new SpringProgress({ respectReducedMotion: true })` (the iOS "smooth"
   preset, response 0.5 / ζ 0.86) ramps `sceneOpacity` 0→1 over a sibling style
   binding (`sceneSwapStyle`, `:239-243` — opacity + a `scale(0.97→1)`
   settle). Meanwhile glass-ui ships `useViewTransition`
   (`node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts`)
   **plus** `view-transition.css`
   (`node_modules/@mkbabb/glass-ui/dist/styles/view-transition.css`, which
   carries the PRM degrade) — both **unused** by the demo. The structural
   reason `<Transition>` was rejected (it re-broke the async `<Suspense>`
   loader — `App.vue:111-135` documents the KeepAlive/Transition removal "for
   cause") does NOT apply to `startViewTransition`, which wraps only the *key
   mutation*, not the loader.

3. **The a11y gold-standard exists but is applied unevenly.** The demo
   *invented* a correct keyboard-accessible custom slider:
   `demo/spring/SpringTarget.vue:25-30` carries `role="slider"` +
   `:aria-valuenow="Math.round(demo.target.value * 100)"` + `tabindex="0"`.
   But that template is **not replicated** onto the other interactive custom
   surfaces, and `:focus-visible` is owned in exactly one place
   (`demo/@/components/custom/animation-controls/controls/playback-button.css`)
   rather than as a demo-wide contract. Concrete uneven sites verified:
   - **`CopyButton.vue:2`** is a `<span … @click>` (not a `<button>`), with no
     `role`, no `aria-label`, no keyboard handler — an interactive-looking
     element invisible to AT and the keyboard.
   These are *consistency* deficits: replication of an in-repo template, not
   invention.

4. **The D.W2/W3 idiom pass left motion-layer + utility-layer residue.**
   - **`--spring-snappy` is a demo-local token shadow at the WRONG damping.**
     `demo/@/styles/style.css:106-133` defines `--spring-snappy: linear(…)` — a
     baked `linear()` curve whose header comment records it was emitted from
     `springLinearStops({ response: 0.35, dampingFraction: 0.65 })`
     (`style.css:100-106`). glass-ui's canonical spring damping is ζ=0.85; this
     demo shadow is ζ=0.65 — the exact cross-repo token incoherence D.W2 fought
     (inv λ), surviving in the **motion layer** D.W2's `var()`-tier sweep did
     not reach.
   - **`.dock-inset` is a dead no-op class.** Referenced as a layout class on
     two scene targets — `demo/easing/EasingTarget.vue:2` and
     `demo/spring/SpringTarget.vue:2` — but a `grep` for a `.dock-inset`
     *definition* across all demo CSS/Vue (excluding `dist/`) is **EMPTY**. It
     resolves to nothing: a latent layout bug (the intended dock-band inset is
     silently absent on those two scenes).
   - **The `progress-dot` recipe is component-local, not promoted.**
     `demo/@/components/custom/animation-controls/AnimationMenuBar.vue` applies
     `.progress-dot` (`:53`) and defines it in its own scoped block (`:284`) —
     a progress-rail/dot recipe living in component scope rather than the owned
     `design-idioms.css` idiom layer D.W2/W3 established (the same promotion
     E.W3 §S4 did for `.progress-bar`).
   - **No Spring dock icon** — the dock has scene icons but the Spring scene
     lacks PNG↔SVG parity (a-demo-design finding; BOOK the asset).

5. **The first paint is unguarded + uncalibrated, and the LCP node is the
   worst-placed CLS risk.**
   - **`AnimatedText.vue` runs a perpetual hero animation with an invalid
     stop.** The hero applies `.lift-down` (`:4`) and `.dot-fade` (`:83`),
     infinite decorative motion with **no PRM guard**; and a keyframe block
     carries an out-of-range **`200%` stop** (`AnimatedText.vue:78`) — invalid
     per the keyframes grammar (stops are 0–100%; `200%` clamps/degrades).
   - **The LCP node renders in a CDN font with zero metric-matched fallback —
     the headline CWV gap (`r-cwv-perf.md` B-1).** The hero
     `<h1 class="text-display-4">` (`EditorStartScreen.vue:5-6`, at
     `demo/@/components/custom/editor-shell/`) IS the **LCP element**, rendered
     in Instrument Serif (`--font-display: "Instrument Serif", Georgia, serif`,
     `style.css:48`) loaded `&display=swap`. A `grep` over `demo/@/styles` +
     `demo/app` for `size-adjust`/`ascent-override`/`descent-override` is
     **0** — there is **no calibrated `@font-face` fallback**. Instrument Serif
     is a condensed display serif whose metrics differ markedly from the
     Georgia fallback → the *largest text on the page reflows on font arrival*
     = a CLS contribution that lands on the **LCP node itself** (the worst
     placement).
   - **The start-screen signpost points the wrong way.**
     `EditorStartScreen.vue:51` sets `subtitleSuffix: "above."` — it points
     "above" at the controls list, and the primary action (Play) is unmentioned.

6. **The two heavy CWV levers are absent; the loading path is already SOTA.**
   - **The inactive Monaco editor tab is *unmounted*, not cached (INP).** The
     `Keyframes`/`Timeline` tab panes
     (`demo/@/components/custom/animation-controls/controls/AnimationControls.vue:43-73`,
     `<TabsContent value="keyframes">` / `value="timeline">`) host the heavy
     Monaco/timeline DOM; reka `<TabsContent>` **unmounts** inactive panes, so
     every switch-back pays Monaco re-instantiation (model, themes, worker
     spin-up) — a classic INP spike. (The lightweight `controls` pane at `:28`
     is fine.)
   - **The active scene's rAF/WebGL loop never pauses when the tab is hidden
     (battery).** `demo/app/scenes/AmigaScene.vue` drives a Three.js loop —
     `startRenderLoop`/`animate` (`:98-106`) calls `requestAnimationFrame` +
     `renderer.render` every frame, gated only on `onActivated`/`onDeactivated`
     (`:115-122`), with **no `visibilitychange`/`document.hidden` pause**. A
     backgrounded tab still drives a full WebGL render per frame. **Correction
     (`r-cwv-perf.md` over the digest): there is NO `KeepAlive`** —
     `App.vue:108-137` ships a keyed `<Suspense>` with KeepAlive removed for
     cause, so exactly **one** scene is mounted at a time; the "pause N
     offscreen loops" framing collapses to the *single active scene's* loop.

7. **No `@starting-style` anywhere; the spring `linear()` is emitted but never
   surfaced as a copy-paste artifact.** A `grep` for `@starting-style` /
   `allow-discrete` / `transition-behavior` across demo source (excluding
   `dist/`) is **EMPTY**. The engine's strongest asset — the spring→`linear()`
   round-trip — IS exercised in `demo/spring/` (`useSpringDemo.ts:103,108`
   builds and samples a `springTimingFunction(...)` string) but **never
   rendered as the copy-pasteable CSS `linear(...)` artifact** a designer would
   paste into their own stylesheet.

The wave's job is to delete the dead palette, route scene nav through the
platform's native View Transitions (keeping the engine-dogfood fallback),
replicate the demo's own a11y template uniformly, finish the idiom-ownership
pass into the motion/utility layers it missed, and harden the first paint — each
either invisible (Theme 0), a named befitting motion delta (Themes 1/3), AT-/
PRM-/CLS-only (Themes 2/4), or cost-only (Theme 5).

## § Goal

**What lands (demo-only; every native path feature-detected with the JS/CSS
fallback preserved):**

- **`CommandPalette.vue` deleted** — the dead, unimported, phantom-Cmd+K
  component removed; `demo/CLAUDE.md`'s tree line updated. (BOOK a *real*
  palette over the existing shortcut registry — Invoker Commands API, Baseline
  2025-12-12 — as a follow-up, NOT this wave.)
- **Scene nav routed through native View Transitions.** `switchScene` wraps its
  key mutation in glass-ui's shipped-but-unused `useViewTransition`
  (`view-transition.css` carries the PRM degrade free); the existing
  `SpringProgress` cross-dissolve (`App.vue:244`) is **kept as the no-VT
  fallback** (still dogfoods the engine); a shared-element morph (dock icon ↔
  scene subject, ≤1-per-state) is added; focus routes to the new scene heading
  on `transition.finished` (an a11y upgrade the current spring lacks).
- **The demo's gold-standard a11y patterns applied uniformly.** One demo-owned
  `:focus-visible` contract in `design-idioms.css` (the keystone), then the
  `SpringTarget` `role="slider"` template replicated onto the
  timeline markers/playhead + the visualizer; `CopyButton`
  `<span>`→`<button aria-label>`; `.is-disabled`→`aria-disabled`; one
  `aria-live` status sink; `<img>` alt discipline; ≥24px touch targets (the
  16px timeline diamonds are the impactful one); bare `title`→`IconTooltip`.
- **The idiom pass finished into the motion/utility layers.** The divergent
  `--spring-snappy` shadow killed (resolved to glass-ui's canonical ζ=0.85
  token, no demo shadow); the `progress-rail`/`progress-dot` recipe promoted to
  `design-idioms.css`; `.dock-inset` defined-or-deleted (no dead reference); the
  missing Spring dock icon added (BOOK PNG→SVG parity).
- **The first paint hardened.** `AnimatedText` hero wrapped in a PRM guard + the
  invalid `200%` stop deleted; a calibrated metric-matched `@font-face` fallback
  for the Instrument-Serif `--font-display` (CLS on the LCP `<h1>`, via the
  `@capsizecss/core` / Fontaine approach glass-ui already uses, `display=swap`
  kept); the start-screen signpost reworded to name the primary action.
- **The two heavy CWV levers landed (Theme 5).** `content-visibility: hidden`
  caches the inactive Monaco panes (`forceMount` + `.inactive` toggle behind an
  `@supports not`→`display:none` fallback, with `aria-hidden` + focus-move); the
  active scene loop pauses on `document.hidden` and re-bases its clock on resume.
- **The `@starting-style` + spring-`linear()` artifact scene added** — a small
  scene that animates an element in/out via `@starting-style` + `allow-discrete`
  *eased by a keyframes.js-generated spring `linear()`*, and renders the emitted
  `springLinearStops(...)` string behind a copy button (PRM-guarded). BOOK the
  native scroll-driven showcase + thin PRM CSS coverage as opt-in pedagogical
  surfaces (D-DEMO-2/3).
- **`proof:demo-elevate` (inv ο)** EXTENDED with the five falsifiable clauses
  below — each BITES on the exact residue this wave removes; the gate STAYS in
  CI.

**Why:** the demo is the product's face and the engine's dogfood, and the deep
SOTA assay found it meets a high bar *unevenly*. The a11y deficit (S3) and the
idiom residue (S4) are the demo failing the standard it *itself set* — the
gold-standard `role="slider"` slider exists but is not replicated; the D.W2/W3
idiom-ownership pass (which closed the `var()`-tier rents) left a ζ-divergent
motion-layer token shadow and a dead utility class. The first-paint gap (S5) is
a measurable CWV defect landing on the LCP node — the worst placement. The two
heavy levers (S6) are the only remaining fully-Baseline CWV wins after the
loading path's SOTA close. View Transitions (S2) is the single highest-leverage
*befitting* upgrade — a compositor-driven native cross-fade replacing a JS
opacity ramp, with glass-ui's helper already shipped and unused. KISS: delete
the dead palette, replicate an existing template, promote an existing recipe,
adopt platform features behind feature-detects with the current path as the
proven fallback — fold only warranted SOTA work, manufacture none where the demo
already leads (§Folds).

## § Scope

### S1 — Theme 0: delete `CommandPalette.vue` (the desk-clear) — d-demo-elevate

**WHAT:** delete `demo/@/components/custom/CommandPalette.vue` (verified
unimported, §State 1) and update the `demo/CLAUDE.md:19` tree line that still
documents it as the Cmd+K palette. BOOK a *real* command palette over the
existing shortcut registry (Invoker Commands API, Baseline 2025-12-12) as a
named follow-up — NOT this wave.

**WHY:** dead code advertising a phantom affordance is the no-legacy precept's
clearest violation — it carries build weight, documents a feature the shipped
surface never mounts, and misleads the reader. Zero-cost first commit, pure
net-deletion. The real-palette BOOK keeps the elegant idea without manufacturing
the work into this wave.

### S2 — Theme 1: View Transitions for scene nav (the befitting motion upgrade) — d-demo-elevate / D-DEMO-1 / r-modern-web-digest

**WHAT:** route `switchScene` (`App.vue`, wrapping `rawSwitchScene` from
`useSceneRouter.ts`) through glass-ui's shipped `useViewTransition`
(`node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts`),
which calls `document.startViewTransition` and degrades via the shipped
`view-transition.css`. Feature-detect: where `startViewTransition` is absent,
fall through to the **existing** `SpringProgress` cross-dissolve (`App.vue:244`)
unchanged — the engine-dogfood path is the no-VT fallback, not removed. Wrap
**only** the key scene-id mutation (compatible where `<Transition>` was not —
the async `<Suspense>` loader at `App.vue:137` stays bare, untouched). Add a
shared-element morph (`view-transition-name` on the active dock icon ↔ the scene
subject, ≤1-per-VT-state so names never collide). Route focus to the new scene
heading on `transition.finished`. The directional `types` API (Baseline
2026-01-13) is a progressive layer, not required. `startViewTransition` Baseline
2025-10-14.

**WHY:** the scene-swap is the demo's most-seen motion, today a JS opacity ramp
(§State 2); native View Transitions give a compositor-driven cross-fade
(+ shared-element morph) with the PRM degrade free in glass-ui's CSS — the single
highest-leverage demo move, named HIGH by both source audits. The structural
objection that killed `<Transition>` (it re-broke the `<Suspense>` async loader,
documented at `App.vue:111-135`) does NOT apply: `startViewTransition` wraps the
key mutation, not the loader. Keeping the `SpringProgress` fade as the
feature-detected fallback means the demo still dogfoods the engine where VT is
unsupported (the three structural objections to making VT the *sole* path stand
— recorded in §Folds). This is a deliberate, named, befitting motion delta:
PRM users get an instant cut either way.

### S3 — Theme 2: apply the demo's own a11y gold-standard uniformly — d-demo-elevate

**WHAT:** establish ONE demo-owned `:focus-visible` contract in
`design-idioms.css` (the keystone — today owned only in `playback-button.css`,
§State 3), then replicate the `SpringTarget.vue:25-30` `role="slider"` +
`aria-valuenow` + `tabindex` template onto the other custom interactive
surfaces: the timeline markers/playhead + the `AnimationVisualizer` (or mark the
visualizer `aria-hidden` if it is a redundant twin of a real control). Convert
`CopyButton.vue:2`'s `<span @click>` → a `<button aria-label="…">` with keyboard
activation; `.is-disabled` → `aria-disabled`; add one `aria-live` status sink for
play/copy feedback; enforce `<img>` alt discipline; ensure ≥24px touch targets
(the 16px timeline diamonds are the impactful one); replace bare `title`
attributes with the demo's `IconTooltip`.

**WHY:** this is a *consistency* deficit, not invention — the demo authored the
correct keyboard-accessible slider (`SpringTarget`, §State 3) but applies it
unevenly, and `CopyButton` is an interactive `<span>` invisible to AT and the
keyboard. Replicating an in-repo template + one owned focus contract is the
elegant, KISS close: every custom interactive surface inherits the same proven
semantics, and the gate (§S8 clause 2) bites if any bare-role control returns.

### S4 — Theme 3: finish the idiom-ownership pass into the layers it missed — d-demo-elevate / a-demo-design

**WHAT:** four idiom closes, each completing the D.W2/W3 pass (gated by
`proof:idioms`/inv λ — E.W3 §S5 is the sibling close at the utility tier):
- **Kill the `--spring-snappy` shadow** (`style.css:106-133`, §State 4): resolve
  `--spring-snappy` to glass-ui's canonical spring token (ζ=0.85), removing the
  demo-local ζ=0.65 `linear()` shadow. If the demo genuinely needs a snappier
  curve, name it as a *deliberate* demo-owned token (not a shadow of the
  canonical name) — but the default reconcile is to the canonical token.
- **Promote `progress-rail`/`progress-dot`** from `AnimationMenuBar.vue`'s scoped
  block (`:284`) to `design-idioms.css` (the owned idiom layer), single-sourced
  — the same promotion E.W3 §S4 did for `.progress-bar`. The call site keeps the
  class; the definition moves.
- **Define-or-delete `.dock-inset`** (§State 4): it is referenced at
  `EasingTarget.vue:2` + `SpringTarget.vue:2` with ZERO definition. Either define
  the intended dock-band inset in `design-idioms.css` (if the inset is wanted —
  the likely fix, since two scenes expect it) or delete the dead class from both
  templates (if not). No dead reference survives.
- **Add the missing Spring dock icon** (BOOK PNG→SVG parity for the dock asset
  set).

**WHY:** the D.W2/W3 idiom-ownership pass closed the `var()`-tier rents but left
two residues the deep assay surfaced (§State 4): a ζ-divergent token *shadow* in
the **motion layer** (the exact cross-repo incoherence D.W2 fought, inv λ,
surviving where the `var()`-shaped sweep did not reach) and a **dead utility
class** that silently drops a layout inset on two scenes. Killing the shadow is
motion-coherence (the calmer canonical spring — a named befitting delta);
promoting the recipe is single-sourcing; defining-or-deleting `.dock-inset`
fixes a latent layout bug. Net-neutral or net-deletion throughout; the only pixel
deltas are the named ζ reconcile + (if `.dock-inset` is *defined*) the intended
inset appearing on the two scenes that already expect it.

### S5 — Theme 4: harden the first paint (PRM guard + CLS-stable LCP + signpost) — d-demo-elevate / r-cwv-perf B-1

**WHAT:** three first-paint hardenings:
- **`AnimatedText` PRM guard + invalid-stop fix** (§State 5): wrap the perpetual
  infinite `.lift-down`/`.dot-fade` (`AnimatedText.vue:4,83`) in
  `@media (prefers-reduced-motion: reduce) { animation: none }` (or the engine's
  `withReducedMotion` mirror), and delete the out-of-range `200%` keyframe stop
  (`:78`).
- **Calibrated metric-matched font fallback for the LCP heading** (the headline
  CWV gap, §State 5 / `r-cwv-perf.md` B-1): add a metric-adjusted `@font-face`
  for the Georgia fallback under `--font-display` (`style.css:48`), sized to
  Instrument Serif via the `@capsizecss/core` / Fontaine approach glass-ui
  already uses — `size-adjust` + `ascent-override` + `descent-override`
  descriptors so the fallback occupies the *same box* as the web font. Keep
  `display=swap`. Descriptors are **Baseline widely available**, ignored where
  unsupported (no feature-detect needed). Pixel-*stabilizing*: the LCP `<h1>`
  (`EditorStartScreen.vue:5-6`) lands in its final box from first paint; only the
  inter-swap reflow is removed.
- **Reword the start-screen signpost** (§State 5): `EditorStartScreen.vue:51`'s
  `subtitleSuffix: "above."` points "above" at a list below the action and never
  names the primary action — reword to name **Play** (or the correct directional
  cue for the actual layout).

**WHY:** the first paint is the demo's first impression, and three defects sit on
it. The unguarded perpetual hero motion ignores `prefers-reduced-motion` (an
accessibility regression on the very first frame); the `200%` stop is invalid per
the grammar the demo *teaches*. The font gap is the **measurable headline CWV
finding** (§State 5): the largest text on the page (the LCP node) reflows on font
arrival with zero metric-matched fallback — a CLS contribution at the worst-placed
node. The metric-adjusted `@font-face` is the exact, Baseline, feature-detect-free
fix (the LCP heading stable from first paint). The signpost fix is correctness.
All three are AT-/PRM-/CLS-only — pixel-isomorphic for the mouse/motion-OK/
font-loaded case; the `size-adjust` fallback is pixel-*stabilizing* (removes a
shift, adds none).

### S6 — Theme 5: the CWV interaction/battery levers — r-cwv-perf B-2 / B-3

**WHAT:** the two remaining fully-Baseline-safe CWV wins (the loading critical
path is already SOTA — §Folds):
- **B-2 — `content-visibility: hidden` to cache the inactive Monaco tab (INP).**
  The `Keyframes`/`Timeline` panes
  (`AnimationControls.vue:43-73`) host the heavy Monaco/timeline DOM; today reka
  `<TabsContent>` **unmounts** inactive panes, paying Monaco re-instantiation on
  every switch-back (§State 6). `forceMount` the Monaco-heavy panes + toggle a
  `.inactive` class applying `content-visibility: hidden` (cache the rendered
  state, skip layout/paint while hidden — superior to unmount), behind an
  `@supports not (content-visibility: hidden)` → `display:none` fallback.
  **MANDATORY a11y:** `aria-hidden` the hidden pane + move focus into the revealed
  pane on switch; verify reka roving focus survives `forceMount` and Monaco's
  deferred `ResizeObserver` re-measures on reveal. **Scope to the Monaco panes
  only** — the lightweight `controls` pane (`:28`) stays unmounted. Baseline
  2025-09-15.
- **B-3 — pause the active scene's rAF/WebGL loop when the tab is hidden
  (battery).** Add a `visibilitychange` gate to the scene loops (the Amiga
  Three.js loop at `AmigaScene.vue:98-106`; the cube/easing/spring rAF demos):
  on `document.hidden`, pause (`Animation.pause()` / Three
  `setAnimationLoop(null)` or cancel the rAF); resume on visible. The engine
  already re-bases the rAF clock on resume (`startTime`/`pausedTime`, reused by
  `restoreGroupPlaybackState`) — reuse it so the animation doesn't jump. Start
  with the universal `visibilitychange` gate (biggest battery win); BOOK the
  scroll-out `content-visibility`/`IntersectionObserver` path. **Correction
  (§State 6): there is NO `KeepAlive`** — one scene mounted via keyed
  `<Suspense>`, so this is the single active scene's loop, not N offscreen loops.

**WHY:** these are the only two fully-Baseline CWV wins left after the loading
path's SOTA close (§Folds — `r-cwv-perf.md` A-3..A-9). The Monaco unmount-on-tab-
switch is a classic INP spike (re-spinning the worker/model/themes on every
switch-back); `content-visibility: hidden` caches the *same* rendered pane and is
blessed for a small fixed view count (`faster-spa-view-transitions`). The
unpaused backgrounded WebGL loop is pure battery waste. Both are **cost-only**:
pixel-stable when active/visible (the cached pane is the same pane; the paused
scene resumes the same animation) — only switch-back latency and offscreen
CPU/GPU change.

### S7 — The `@starting-style` + spring-`linear()` copy-paste artifact scene — r-interpolation F-4

**WHAT:** a small new scene (in `demo/spring/` or `demo/easing/`) that (a)
animates an element in/out via `@starting-style` + `allow-discrete` +
`transition-behavior` *eased by a keyframes.js-generated spring `linear()`*, and
(b) renders the emitted `springLinearStops(...)` string (the same path
`useSpringDemo.ts:103,108` already builds) behind a **copy button** — the
copy-pasteable CSS `linear(...)` artifact a designer would paste into their own
stylesheet. Mandatory `@media (prefers-reduced-motion: reduce) { transition:
none }` (the engine has `withReducedMotion` to mirror it).
`@starting-style`/`allow-discrete` Baseline 2024-08-06. Pairs with W10's F-8
spring-eased presets. (BOOK D-DEMO-2/3: the native scroll-driven showcase + thin
PRM CSS coverage — opt-in pedagogical surfaces; `r-scroll-view-transitions.md`
S-4 confirms the editor is a fixed-viewport non-scrolling surface, so the scroll
showcase is a *new* surface, NOT a retrofit.)

**WHY:** zero `@starting-style` usage exists in the demo today (§State 7), and
the engine's strongest asset — the spring→`linear()` round-trip — is exercised in
`demo/spring/` but never *surfaced* as the copy-pasteable artifact. This scene
dogfoods the standardized physics-easing path AND teaches the modern entry/exit
primitive in one surface — the highest-ROI demo addition `r-interpolation.md` F-4
named. A new surface (no existing pixel moves).

### S8 — The `proof:demo-elevate` extension (the falsifiable close) — inv ο

**WHAT:** the `proof:demo-elevate` gate carries five clauses, each a real
build+grep/capture instrument that reds on its negative case (verbatim from the
§Hard gate below). Add them to the demo CI job alongside the existing
`proof:idioms`/lighthouse/occlusion gates.

**WHY:** the close is only honest if a gate BITES on each residue's return (inv ε
analogue). Each clause reds on the exact site this wave removes and stays in CI as
inv ο's standing proof.

## § Hard gate — `proof:demo-elevate` (inv ο)

The wave closes when every clause VERIFIES (each BITES — a real build+grep/
capture, not an assertion). **BITE: revert any one fix and the named clause
reds.** Measure-first/feature-detect discipline: every native adoption (VT,
`content-visibility`, `@starting-style`, the metric-matched `@font-face`) is
feature-detected with the current path preserved as the proven fallback, and the
CWV/CLS deltas are *measured* via the existing capture harness — not asserted.

1. **VT clause.** `switchScene` routes through the feature-detected helper
   (greps to the `useViewTransition` form); the no-VT `SpringProgress` fallback
   path is preserved + tested; the shared-element name is ≤1-per-state; the PRM
   degrade is asserted (`::view-transition-*` `animation: none` under `reduce`);
   focus routes to the new scene heading on `transition.finished`.
   **BITE:** stub `startViewTransition` → the fallback path must run (the spring
   fade); revert the focus-route → the focus-on-`finished` test reds.

2. **a11y-uniformity clause (extends the demo a11y sweep).** Every
   `role`/`tabindex`-bearing custom control inherits the demo-owned
   `:focus-visible`; the timeline/visualizer/`CopyButton` carry correct
   role+keyboard or `aria-hidden`; zero interactive-looking `<div>`/`<span>` with
   no role in the swept set (`CopyButton` is now a `<button>`).
   **BITE:** strip one `role` (or revert `CopyButton` to `<span>`) → the sweep
   reds.

3. **idiom-r3 clause (extends `proof:idioms`/inv λ).** `--spring-snappy` resolves
   to glass-ui's canonical token (no demo ζ=0.65 shadow);
   `progress-rail`/`progress-dot` resolve demo-local (in `design-idioms.css`, not
   a component scoped block); `.dock-inset` is defined-or-absent (no dead
   reference); the Spring dock icon exists.
   **BITE:** re-introduce the `--spring-snappy` shadow → the clause reds.

4. **first-paint clause.** `AnimatedText` carries a PRM guard + no `200%` stop
   (grep); the calibrated `@font-face` fallback is present with `size-adjust` +
   `ascent-override` + `descent-override` on the `--font-display` Georgia fallback
   (grep the descriptors); CLS on the LCP `<h1>` held (**measured** via the
   existing capture harness); the start-screen copy names the primary action.
   **BITE:** delete the `size-adjust` descriptors → the CLS capture regresses;
   re-add the `200%` stop → the grep clause reds.

5. **CWV-levers + artifact clause.** The Monaco-heavy editor panes are
   `forceMount`ed + `content-visibility: hidden` when inactive behind the
   `@supports`/`display:none` fallback, with `aria-hidden` + focus-move asserted;
   the active scene loop pauses on `document.hidden` and re-bases its clock on
   resume (no visible jump); the `@starting-style` artifact scene renders the
   emitted `linear(...)` behind a copy button + carries the PRM `transition: none`
   guard.
   **BITE:** background the tab → the scene's rAF must stop ticking (a tick-count
   probe reds if the loop keeps running); revert `forceMount` → the switch-back
   re-instantiates Monaco (the INP probe regresses).

The lighthouse + occlusion gates from E.W4 stay green over the FINAL surface
(now including the VT scene-swap and the `content-visibility` panes — E.W4
lighthouses the final surface, per the augmentation DAG).

## § Folds

Retires (by finding id):
- **`d-demo-elevate.md`** (the four-theme synthesis) — S1 (Theme 0 delete) + S2
  (Theme 1 VT) + S3 (Theme 2 a11y) + S4 (Theme 3 idiom-r3) + S5 (Theme 4
  first-paint) + S8 (the gate). W11 is its implementation charter.
- **`d-modern-platform.md` D-DEMO-1** (View Transitions scene nav) — S2.
  D-DEMO-2/3 (scroll showcase + thin PRM CSS) BOOKED as opt-in pedagogical
  surfaces (S7 note).
- **`r-cwv-perf.md` B-1** (LCP/CLS metric-matched font fallback) — S5;
  **B-2** (`content-visibility: hidden` Monaco tab) — S6; **B-3**
  (`visibilitychange` scene-loop pause) — S6.
- **`r-interpolation.md` F-4** (the `@starting-style` + spring-`linear()`
  copy-paste artifact scene) — S7.
- **`r-modern-web-digest.md`** VT/`@starting-style` digest items — S2 + S7.

This wave folds NO chronic deferral — zero KFE (`audit/deferred-ledger.md`; D
terminated every keyframes-owned deferral). E.W11 is net-new post-D deep-assay
demo residual.

**ALREADY-SOTA — manufactures NO work here (`r-cwv-perf.md` A-3..A-9 + the two
corrections):**
- **The CWV loading critical path is at-or-ahead of SOTA** — inlined critical CSS
  + non-render-blocking stylesheet/fonts, Monaco/Three/Prettier code-split AND
  `modulepreload`-excluded, the editor double-gated (async + tab unmount), a
  textbook live-probed `yieldToMain`, a dev-only-DCE'd LoAF observer, bf-cache
  unobstructed (zero `unload`/`beforeunload`), `fetchpriority` correctly absent
  (text LCP). W11 adds only the interaction/battery levers (S6), no loading work.
- **The demo is already native-`color-mix()`-idiomatic** (verified live in author
  CSS/Vue — corrects the `r-modern-web-digest` "zero color-mix" claim). No
  color-mix modernization manufactured.
- **There is NO `KeepAlive`** — one scene mounted via a keyed `<Suspense>`,
  KeepAlive removed for cause (`App.vue:108-137`) — narrows the B-3 scene-pause
  to the single active loop (S6).
- **The `0fr→1fr` grid-row height animation is PREFERABLE on today's Baseline**
  — do NOT modernize it into the Chromium-only `interpolate-size`
  (`r-interpolation.md` F-7; that's a W9 GAP-NAMED BOOK, not a W11 demo move).
- **The gold-standard keyboard slider, the tokenized z-contract, the singleton
  shortcut registry, the dvh/`@supports`/safe-area discipline, the D.W2/W3 idiom
  layer (real + holds)** — S3 *replicates* the slider template, S4 *completes* the
  idiom layer; neither re-authors the SOTA core.

**Routed OUTWARD / RECORDED (not this wave):**
- **A real command palette** over the existing shortcut registry (Invoker
  Commands API, Baseline 2025-12-12) — BOOK (S1 follow-up). W11 only deletes the
  dead `CommandPalette.vue`.
- **The native scroll-driven showcase + thin PRM CSS coverage** (D-DEMO-2/3) —
  BOOK as opt-in pedagogical surfaces (the editor is non-scrolling,
  `r-scroll-view-transitions.md` S-4; a scroll showcase is a *new* surface, not a
  retrofit — do not manufacture scroll work into the editor).
- **The directional VT `types` API** (Baseline 2026-01-13) — a progressive layer
  on S2, not required for the close.
- **The scroll-out `content-visibility`/`IntersectionObserver` scene-pause** —
  BOOK (S6 ships the universal `visibilitychange` gate first).
- **The Spring dock icon PNG→SVG parity** — BOOK the asset (S4).

## § Isomorphism

Per-theme, with the named deltas enumerated (the precept: pixels unchanged unless
highly befitting + named):

- **Theme 0 (S1) — invisible.** `CommandPalette.vue` has zero consumers; deleting
  it moves no pixel and no behaviour. Pure net-deletion.
- **Theme 1 (S2) — a named befitting motion delta.** The scene-swap becomes a
  compositor-driven native View Transition (+ shared-element morph) replacing a
  JS opacity ramp — a deliberate motion upgrade flagged in the changeset. The
  no-VT fallback (the `SpringProgress` cross-dissolve) is byte-identical to
  today's behaviour. PRM users get an instant cut either way (the VT PRM degrade
  + the spring's `respectReducedMotion`).
- **Theme 2 (S3) — AT-only.** The a11y replication adds roles/labels/keyboard +
  one focus contract; the `CopyButton` `<span>`→`<button>` is visually identical
  (the demo styles the element regardless of tag). Pixel-isomorphic for the
  mouse/sighted case; the focus ring is a `:focus-visible`-only paint
  (keyboard-only).
- **Theme 3 (S4) — two named befitting deltas + net-neutral promotions.** The
  `--spring-snappy` reconcile to ζ=0.85 is a named motion-coherence delta (a
  calmer canonical spring). If `.dock-inset` is *defined* (not deleted), the
  intended dock-band inset appears on the two scenes that already expect it — a
  named layout-correctness delta. The `progress-rail`/`progress-dot` promotion is
  pixel-identical (same computed values, definition relocated).
- **Theme 4 (S5) — PRM-/CLS-only, pixel-stabilizing.** The PRM guard changes only
  the `reduce` case (toward correctness); the invalid-`200%`-stop removal fixes a
  degraded keyframe; the `size-adjust` fallback is pixel-*stabilizing* — the LCP
  `<h1>` lands in its final box from first paint, only the inter-swap shift is
  removed (no shift added). The signpost reword is copy-only.
- **Theme 5 (S6) — cost-only.** Pixel-stable when active/visible:
  `content-visibility: hidden` caches the *same* rendered pane; the scene pause
  resumes the *same* animation (the engine re-bases the clock — no visible jump).
  Only switch-back latency and offscreen CPU/GPU change.
- **The artifact scene (S7) — a new surface.** No existing pixel moves; the scene
  is new pedagogical content, PRM-guarded.

Every native path (VT, `content-visibility`, `@starting-style`, the
metric-matched `@font-face`) is **feature-detected** and falls back exactly to
today's behaviour where unsupported — zero regression on engines without the
feature. Every CWV/CLS claim is **measured** via the existing capture/lighthouse
harness, not asserted (measure-first). inv-16 holds: every change lands in the
demo's own tree (`@/`, `demo/`); no glass-ui token, no dock behaviour, no engine
or library source is patched here — the demo OWNS its `useViewTransition` call,
its `design-idioms.css` idiom promotions, and its scene-pause wiring; glass-ui
remains the source of `useViewTransition` + the canonical spring token + the dock
(any glass-ui change is a glass-ui ASK, never patched demo-side).

## § Design decisions

1. **VT primary, the `SpringProgress` fade KEPT as the no-VT fallback — not
   ripped out.** RESOLVED + HONEST: native View Transitions become the *primary*
   scene-swap, but the engine-dogfooding `SpringProgress` cross-dissolve
   (`App.vue:244`) is **kept** as the feature-detected fallback. The three
   structural objections to making VT the *sole* path stand (recorded in §Folds):
   the demo must dogfood its own engine somewhere, VT is not universal, and the
   spring fade is the proven current behaviour. This is the correctly-KEPT
   DECLINE-record from the augmentation's "do not make VT the only path" finding —
   W11 makes VT primary, keeps the dogfood fallback. The structural reason
   `<Transition>` was rejected (it re-broke the `<Suspense>` loader) does NOT
   apply to `startViewTransition` (it wraps the mutation, not the loader).

2. **a11y is REPLICATION of an in-repo template, not invention.** RESOLVED: the
   demo authored the gold-standard keyboard slider (`SpringTarget.vue:25-30`);
   the deficit is *uneven application* (the `CopyButton` `<span>`, the
   single-site `:focus-visible`). The fix is one owned `:focus-visible` contract
   in `design-idioms.css` + the `role="slider"` template copied onto the other
   surfaces — the same "own it once, gate the consistency" discipline D.W2 used
   for `var()`-idioms. The FINAL claims "E.W11 made the demo's own a11y standard
   uniform," NOT "the demo was inaccessible" (the standard exists; it was applied
   unevenly).

3. **The idiom-r3 close completes D.W2/W3 into the motion/utility layers it
   missed.** RESOLVED: D.W2/W3 closed the `var()`-tier idiom rents; the deep
   assay found a ζ-divergent token *shadow* in the **motion layer**
   (`--spring-snappy`, the exact inv-λ incoherence at a layer the `var()`-shaped
   sweep did not reach) and a **dead utility class** (`.dock-inset`). E.W11
   reconciles the shadow to the canonical token, promotes the
   `progress-rail`/`progress-dot` recipe to the owned layer (the E.W3 §S4
   precedent), and defines-or-deletes `.dock-inset`. The default reconcile is to
   glass-ui's canonical spring; if the demo genuinely needs a snappier curve it is
   named as a *deliberate* demo-owned token, never a shadow of the canonical name.

4. **The font fallback is the metric-matched `@font-face`, NOT a font swap.**
   RESOLVED: the LCP `<h1>` reflows on Instrument-Serif arrival because the
   Georgia fallback occupies a different box (§State 5). The fix is a calibrated
   `@font-face` for the fallback (`size-adjust`/`ascent-override`/
   `descent-override` via the `@capsizecss/core` approach glass-ui already uses) —
   `display=swap` is KEPT, the web font is unchanged, the *fallback's box* is
   matched to it. Descriptors are Baseline widely available, ignored where
   unsupported (no feature-detect needed). Pixel-stabilizing, not a visual change.

5. **`content-visibility: hidden` over unmount; `visibilitychange` over `KeepAlive`
   framing.** RESOLVED: the Monaco panes are `forceMount`ed + cached via
   `content-visibility: hidden` (blessed for a small fixed view count) rather than
   reka's default unmount — superior because Monaco isn't destroyed. The
   `@supports not`→`display:none` fallback + the MANDATORY `aria-hidden` +
   focus-move are non-negotiable (an INP win must not be an a11y regression). The
   scene-pause is corrected to the single active loop (there is NO `KeepAlive`,
   §State 6) — the universal `visibilitychange` gate first, the scroll-out path
   BOOKED.

6. **Isomorphic except the named befitting deltas.** RESOLVED: every E.W11 change
   preserves pixels EXCEPT the enumerated, deliberate, befitting deltas (§Isomorphism):
   the VT scene-swap (Theme 1), the `--spring-snappy` ζ reconcile + the
   `.dock-inset` inset-if-defined (Theme 3) — each named in the changeset. Themes
   0/2/4/5 + the artifact scene are invisible / AT-only / PRM-CLS-only / cost-only
   / new-surface. Pixels unchanged unless highly befitting + named — the precept,
   held; every native adoption feature-detected, every CWV/CLS claim measured.
