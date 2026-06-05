# SOTA Audit — Demo: Usability / UX

Lane: **demo — usability / UX**. Scope: the editor shell, the controls /
keyframes / timeline editors, the five scenes (cube / square / easing / spring /
amiga), and the playground. Read-only research; **no implementation** (tranche
development). Dispositions per inv-16: keyframes.js demo findings → **FOLD-E**;
value.js findings → **FOLD-VALUEJS-HANDOFF**.

Guidance authority: the `modern-web-guidance` skill (Baseline-dated platform
guidance) plus the W3C specs. Every finding is grounded at `file:line`.

## Headline

The demo is a **mature, largely SOTA editor** with several genuinely
best-in-class patterns: `0fr→1fr` grid-row height animation (no JS measurement),
engine-dogfooded spring scene-swap with `respectReducedMotion`, dynamic-viewport
(`dvh`/`dvw`) sizing with `@supports`-gated fallbacks, safe-area insets,
`touch-action`/`overscroll-behavior` discipline, a singleton keyboard-shortcut
registry with a discoverable `?` modal, and an exemplary keyboard-accessible
custom slider in `SpringTarget.vue`. The gaps are **localized, not systemic**:
an a11y *consistency* deficit (the team knows the slider/role pattern but applies
it unevenly), one piece of **dead/broken** code, the absence of **View
Transitions** for a navigation that is otherwise hand-rolling a cross-dissolve,
and a handful of discoverability/touch-target polish items.

Honest framing: most of the highest-leverage interaction work is **already
done**. The findings below are sharpening passes, not a rebuild.

---

## FOLD-E findings

### E-UX-1 · CommandPalette is dead, half-built, and advertises a phantom Cmd+K — DELETE or rebuild · HIGH

- **Where**: `demo/@/components/custom/CommandPalette.vue` (whole file).
  Verified unused: no import or `<CommandPalette` tag anywhere in the demo
  (grep over `demo/**` returns only the file itself).
- **Gap**: The component renders a `⌘K` hint (lines 4-10) and wires
  `useMagicKeys()["Cmd+K"]` (line 83), but: (a) it is mounted nowhere; (b) its
  three `@select` handlers (`handleSelectControl`, `handleToggleDarkMode`,
  `handleSelectAnimation`, lines 93-103) are **no-op stubs** that only
  `toggleOpen()` — selecting a command does nothing; (c) it imports
  `Command`/`CommandDialog` (lines 60-68) but renders the list **inline**, not in
  a dialog, so even if mounted it would not be a palette. Meanwhile the
  actual shortcut surface is the `?` modal
  (`EditorShell.vue:117`) and the per-scene registry in
  `AnimationControlsGroup.vue:262-277` — there is **no real Cmd+K** in the app.
  Shipping a file that promises a command palette is a discoverability lie and a
  maintenance trap.
- **SOTA / rationale**: A command palette IS a SOTA discoverability affordance
  (it is how power users find the 16 registered shortcuts and the scene/animation
  switchers without memorizing them). The right move is **one of two**: delete
  the dead file (KISS, no-legacy), OR rebuild it for real and wire Cmd+K to the
  existing `registerShortcut` registry + `useRegisteredShortcuts()` (the data is
  already there — `KeyboardShortcutsModal.vue:55` reads it). Given the registry
  already exists, a real palette is high-value, low-cost.
- **Disposition**: **FOLD-E**. Recommend: delete now; book a *real* palette as a
  follow-up E item (it would meaningfully raise discoverability for the deep
  shortcut set).
- **Isomorphism**: Deleting is invisible (no consumer). A real palette is
  additive (new affordance), not a behavior change to existing surfaces.

### E-UX-2 · No View Transitions for scene navigation — hand-rolled cross-dissolve, no directionality · HIGH

- **Where**: `demo/app/App.vue:231-249` (the `SpringProgress`-driven
  `sceneSwapStyle` opacity/scale fade) + `demo/app/useSceneRouter.ts` /
  `useSceneUrl.ts` (the `?anim=` query-param navigation). Grep confirms **zero**
  `startViewTransition` / `view-transition` / `viewTransition` usages in the
  demo.
- **Gap**: Scene switching is a SPA navigation between five distinct scenes, plus
  Home. The current swap is a bare opacity+scale cross-dissolve driven by an
  engine spring on a sibling `<div>`. It is *clever* (and the comment at
  `App.vue:108-135` documents why a `<Transition>` wrapper was removed for cause),
  but it is the exact use case the platform now owns natively: a same-document
  View Transition. Two SOTA wins are left on the table: (1) the transition is
  **non-directional** — Home→Cube and Amiga→Square fade identically, with no
  sense of forward/back flow; (2) shared elements (e.g. the scene icon in the
  dock, the subject card) cannot **morph** across the swap.
- **SOTA / guidance**: guide `same-document-transitions` (featuresUsed: *View
  transitions*) and `directional-navigation-transitions` (featuresUsed: *View
  transitions, Active view transition*) — the latter is exactly "slide new
  content in from the right when advancing, from the left when returning."
  `view-transition-name` + `document.startViewTransition()` is the idiomatic
  replacement for a hand-rolled DOM-swap fade, and it **composes with**
  `prefers-reduced-motion` natively (no manual `respectReducedMotion` plumbing).
- **Rationale / perf**: VT snapshots are compositor-driven; replacing the
  per-frame rAF spring that writes `opacity`/`transform` on every swap with a
  declarative `::view-transition-*` animation removes a JS rAF loop from the
  navigation hot path. The engine-spring approach is a defensible *fallback*, but
  the modern primary path is VT.
- **Disposition**: **FOLD-E**. Adopt `startViewTransition` for `switchScene`,
  gate on `document.startViewTransition` support (fall back to the existing
  spring), and add `view-transition-name` to the dock scene-icon + the subject
  for a shared-element morph. Honor direction via the
  `directional-navigation-transitions` recipe.
- **Isomorphism**: **Befitting departure**, not isomorphic — this is a
  deliberate motion upgrade. Pixels change *by design* (directional slide +
  shared-element morph). The reduced-motion path stays an instant cut, preserving
  the current reduced-motion behavior.

### E-UX-3 · Timeline keyframe markers and playhead scrubber are pointer-only — no keyboard, no slider semantics · HIGH

- **Where**: `demo/@/components/custom/animation-controls/timeline/components/TimelineTrack.vue`.
  The diamond markers (lines 58-83) are `<div>`s with `@pointerdown` drag only —
  no `tabindex`, no `role`, no `@keydown`. The track itself (lines 21-35) scrubs
  the playhead via `@pointerdown`/`@pointermove` with no ARIA. `TimelineCaret.vue`
  has keydown only for the *inline percent edit* (commit/cancel), not for moving
  the keyframe.
- **Gap**: The timeline is a core editing surface (move keyframes, scrub the
  playhead) and it is **entirely inaccessible to keyboard and AT users**. Compare
  `SpringTarget.vue:22-33` — the *same team* built a custom rail there with
  `role="slider"`, `aria-valuenow/min/max`, `tabindex="0"`, and full arrow/Home/End
  keyboard handling (`SpringTarget.vue:111-125`). The timeline should meet that
  bar.
- **SOTA / guidance**: guide `accessibility` §5 — "Custom Trigger Keyboards:
  Attach Enter/Space handlers… choose `tabindex="0"`… Manage Toggle States"; and
  §2 — "If you set `role="slider"`/`role="…"`, the element must behave like it,
  including keyboard interactions." The playhead is a slider; each keyframe is a
  draggable thumb. A focusable marker + arrow-key nudge (mirroring the existing
  global `ArrowLeft/Right` 1%/10% scrub at
  `AnimationControlsGroup.vue:265-268`) is the idiomatic fit.
- **Disposition**: **FOLD-E**. Give the playhead `role="slider"` +
  `aria-valuenow` (% of duration) and the track keyboard scrub; make each diamond
  `tabindex="0"` with `role="slider"` (its `percent` is the value) and arrow-key
  move, reusing the `moveKeyframe` emit. The pattern already exists in
  `SpringTarget` — this is replication, not invention.
- **Isomorphism**: Isomorphic for pointer users (pixels/behavior unchanged);
  purely additive keyboard/AT path.

### E-UX-4 · AnimationVisualizer scrub ball is pointer-only and has no slider semantics · MED

- **Where**: `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue:13-23`.
  The draggable ball is a `<div>` with `@pointerdown` (gated through the touch
  gate) and a fling-coast spring — **no `role`, no `aria-*`, no `tabindex`, no
  keyboard**.
- **Gap**: This is the headline "drag the ball to scrub" affordance in the
  playback ribbon. It duplicates the function of the sibling glass-ui `<Slider>`
  (`PlaybackRibbon.vue:10-21`, which *is* keyboard-accessible), so a keyboard
  user is not fully locked out of scrubbing — but the visualizer itself announces
  nothing and cannot be operated by AT. It should at minimum be
  `aria-hidden="true"` (decorative twin of the real slider) **or** promoted to a
  real `role="slider"` with keyboard.
- **SOTA / guidance**: `accessibility` §5 (slider semantics + keyboard) and §2
  (don't ship interactive-looking `<div>`s with no role). Given the real
  `<Slider>` sits directly above it, the *cheapest correct* move is
  `aria-hidden="true"` + `tabindex="-1"` so AT ignores the redundant visual twin;
  the *richer* move is full slider semantics.
- **Disposition**: **FOLD-E**. Prefer `aria-hidden` (the canonical slider is
  adjacent) unless the visualizer becomes the sole scrubber on mobile, in which
  case promote it.
- **Isomorphism**: `aria-hidden` is pixel-isomorphic and AT-only. Promotion would
  add a keyboard path (additive).

### E-UX-5 · CopyButton is a non-focusable `<span>` and the copy result is visual-only · MED

- **Where**: `demo/@/components/custom/CopyButton.vue:2-12`. The control is a
  `<span class="cursor-pointer" @click>` wrapping two Lucide icons — **not a
  `<button>`**, so it is not in the tab order and has no accessible name; the copy
  "check" is a scale/opacity animation with no `aria-live` announcement. Used in
  `KeyframeCard.vue:20`, `TimingFunctionPanel`, the easing/spring sidebars.
- **Gap**: An icon-only copy action that keyboard users cannot reach and AT users
  cannot perceive (no name, no success announcement). Note: actual *toast*
  copies (`@utils/clipboard.ts:6` → `toast.success`) do surface a message, but
  `CopyButton` itself does not route through that and is silent.
- **SOTA / guidance**: `accessibility` §2 ("Prefer HTML elements… `<button>`
  already implies `role="button"`"), §3 ("visually hidden text… for icon-only
  buttons"), §6 ("Describe the purpose… 'Search', not 'Magnifying glass'"). A
  `<button aria-label="Copy CSS">` with a `role="status"`/`aria-live="polite"`
  confirmation is the idiomatic fix.
- **Disposition**: **FOLD-E**. Promote to `<button>` with `aria-label`; announce
  "Copied" via a polite live region (or route through the existing `vue-sonner`
  toast for consistency with `clipboard.ts`).
- **Isomorphism**: Pixel-isomorphic (a `<button>` reset to the same styling);
  additive keyboard + AT semantics.

### E-UX-6 · `.is-disabled` uses `pointer-events:none` + opacity — hides disabled controls from keyboard/AT · MED

- **Where**: `demo/@/styles/style.css:252-255` (`.is-disabled { opacity:.5;
  pointer-events:none }`). Applied to the scrubber slider + visualizer when the
  animation is not started (`PlaybackRibbon.vue:3,54`).
- **Gap**: `pointer-events:none` removes mouse interaction but **leaves the
  control in the tab order with no disabled semantics** — a keyboard user can
  still Tab to the glass-ui `<Slider>` thumb and it will look enabled to AT, yet
  do nothing (or the surrounding wrapper swallows it). The guidance explicitly
  warns about `disabled` vs `aria-disabled` here.
- **SOTA / guidance**: `accessibility` §2 — "Be deliberate about `disabled` vs
  `aria-disabled`… `disabled` removes the element from the focus order;
  `aria-disabled="true"` keeps it focusable so users learn it's disabled."
  `pointer-events:none` is neither — it is a *visual* disable that lies to AT.
- **Disposition**: **FOLD-E**. When a control is in the `.is-disabled` state, also
  set `aria-disabled="true"` (or the native `disabled` where the control is a real
  form element) so the disabled state is announced and the no-op is explained.
- **Isomorphism**: Pixel-isomorphic; corrects an AT-only lie.

### E-UX-7 · No global `:focus-visible` ring — focus indication is entirely outsourced to glass-ui/reka defaults · MED

- **Where**: Grep over `demo/**` finds `:focus-visible` at only **one** site
  (`controls/playback-button.css:34`) and `:focus` at one more
  (`easing/EasingSidebar.vue:181`). There is **no demo-level focus-ring contract**
  in `style.css` / `design-idioms.css`, despite the demo owning many custom
  interactive `<div>`s (timeline markers, visualizer ball, the
  `role="button"` advanced row at `AnimationControlsControls.vue:91-103`, the
  spring rail).
- **Gap**: The demo's custom interactive elements rely on inheriting a focus ring
  that the demo does not define. If glass-ui's reset or a Tailwind base strips
  outlines (a common pattern), these custom controls become invisibly focusable —
  the guidance's named anti-pattern ("Don't disable outlines without
  replacements"). The `design-idioms.css` file already exists precisely to *own
  what the demo depends on* (its own header comment, lines 4-24) — a focus-ring
  idiom belongs there for the same reason the `.scale-on-hover` idiom does.
- **SOTA / guidance**: `accessibility` §5 — "Always style `:focus-visible` states
  explicitly. If disabling defaults, provide overrides with sufficient contrast,"
  with the `:where(a, button):focus-visible { outline: 3px solid …; outline-offset }`
  example. Baseline: `:focus-visible` is Baseline-stable.
- **Disposition**: **FOLD-E**. Add a single demo-owned `:focus-visible` idiom to
  `design-idioms.css` covering the demo's custom interactive elements (the
  `role`/`tabindex`-bearing `<div>`s), mirroring how that file already owns the
  hover-lift and tab-slide idioms.
- **Isomorphism**: Additive — only changes the *focused-via-keyboard* state, which
  is currently undefined/inherited. No mouse-path pixel change.

### E-UX-8 · `<img>` previews missing `alt` — decorative vs informative not declared · LOW

- **Where**: `demo/@/components/custom/animation-controls/timeline/components/TimelineHoverPreview.vue:5`
  (the html2canvas keyframe snapshot) and
  `demo/@/components/custom/asset-manager/AssetViewport.vue:59` (the asset image)
  both render `<img>` with **no `alt`**. (Scene icons in `TopDock.vue:173,195`
  *do* carry `alt` — the team gets this right elsewhere.)
- **Gap**: The timeline hover preview is decorative (it duplicates the diamond's
  own label/state) → should be `alt=""` to drop it from the a11y tree. The asset
  image is user content → should carry a meaningful `alt` (e.g. the asset name).
- **SOTA / guidance**: `accessibility` §6 — `alt=""` for decorative, informative
  `alt` for content; "Don't use 'Image of…' prefixes."
- **Disposition**: **FOLD-E**. `alt=""` on the hover preview; `:alt="asset.name"`
  on the asset image.
- **Isomorphism**: Pixel-isomorphic; AT-only.

### E-UX-9 · Start-screen "how do I begin?" discoverability — the first gesture is under-signposted · MED

- **Where**: `demo/@/components/custom/editor-shell/EditorStartScreen.vue` (the
  Home overlay: "Select an animation … from the list above," hint "or drag M.
  cubert"). The actual first interaction on Home is documented at
  `App.vue:257-271`: pressing Play navigates Home→Cube and auto-plays. The
  overlay is `pointer-events:none` (`EditorShell.vue:27`).
- **Gap**: A first-time visitor lands on Home with a non-interactive overlay that
  says "select from the list above" — but the "list" is the scene/animation
  selector buried in the bottom menubar / top dock, which a newcomer has not yet
  located, and the *primary* path (just press Play) is not mentioned. The cube is
  draggable but the only cue is the small italic "or drag M. cubert" hint. The
  highest-value first action (Play) is the least signposted.
- **SOTA / rationale**: This is pure discoverability — no spec, a usability
  heuristic (visibility of system status + clear primary action). A start screen
  for an interactive demo should point at the *one* primary affordance (the Play
  button / the cube) rather than at a secondary list. Consider an arrow/cue toward
  the Play control, or making the cube itself the obvious clickable hero.
- **Disposition**: **FOLD-E** (BOOK as a UX-copy + cue pass). Low code, high
  first-impression value.
- **Isomorphism**: Copy/cue change; befitting, not a behavior change.

### E-UX-10 · No `aria-live` status region for playback/scene/copy state changes · LOW

- **Where**: Grep finds **zero** `aria-live` / `role="status"` / `role="alert"`
  in `demo/**`. State changes that are visually obvious — play↔pause, scene
  switch, "copied", reset — are announced to AT only insofar as a button's own
  `aria-label` flips (e.g. `AnimationMenuBar.vue:95` toggles "Play"/"Pause"
  animation label, which *is* good).
- **Gap**: Cross-cutting status (scene changed to "Amiga", animation reset,
  CSS copied, keyframe deleted) has no polite live region, so an AT user gets no
  confirmation that their action took effect. This compounds E-UX-1/3/5.
- **SOTA / guidance**: `accessibility` §1/§5 and the SPA note "Update document
  title on Page Transitions in SPAs; shift focus to updated titles." A single
  app-level `role="status" aria-live="polite"` sink for transient confirmations is
  the idiomatic, low-cost fix.
- **Disposition**: **FOLD-E**. Add one polite live region in `EditorShell`; route
  scene-switch + reset + copy confirmations through it (the `vue-sonner` toast can
  double as this if its viewport is a proper live region — verify, since
  `useToastGuard.ts` already reaches into its private DOM).
- **Isomorphism**: AT-only; pixel-isomorphic.

### E-UX-11 · Touch-target sizing on icon-only controls — several fall below 24×24 / 44×44 · MED

- **Where**: Multiple icon-only buttons sized below the comfortable touch
  target: `KeyframeTimeline.vue:11-12,21-22` (clear/expand buttons `h-7 w-7` =
  28px); `KeyframeTimeline.vue:62-69` (remove keyframe `h-6 w-6` = 24px);
  `KeyframeCard.vue:16-17` (remove `X` icon `w-6 h-6`), `:20` (CopyButton `h-6
  w-6`); the collapsed timeline diamonds `w-4 h-4` = 16px
  (`TimelineTrack.vue:64`).
- **Gap**: On touch, 24px (and especially the 16px collapsed diamonds) are below
  the WCAG 2.2 "Target Size (Minimum)" 24×24 floor and well below the comfortable
  44×44. The diamonds are the *primary* timeline drag handles on mobile, so this
  is the most impactful one — a 16px rotated square is hard to grab with a thumb.
  The timeline *does* grow diamonds to `w-6 h-6` (24px) when `expanded`, which
  helps, but the default in-pane size is 16px.
- **SOTA / guidance**: guide `css`/`accessibility` + WCAG 2.2 SC 2.5.8 (Target
  Size Minimum, 24×24 CSS px; AAA 2.5.5 wants 44×44). The fix is either a larger
  hit area or an invisible expanded `::before` hit-box on the small diamonds, and
  bumping the `h-6 w-6` icon buttons to a ≥24px *interactive* box (padding can
  enlarge the target without enlarging the glyph).
- **Disposition**: **FOLD-E**. Enlarge the collapsed-timeline diamond hit area
  (transparent padding / pseudo-element) to ≥24px; audit the `h-6 w-6` icon
  buttons for a ≥24px target.
- **Isomorphism**: Hit-area enlargement via transparent padding is visually
  isomorphic (glyph unchanged); only the touch target grows.

### E-UX-12 · Tooltip-on-`title` for several non-icon-button affordances — not touch/keyboard discoverable · LOW

- **Where**: `EasingTarget.vue:77` (`:title="curve.name"` on a track label),
  `SpringSidebar.vue:68` (`:title="t.preset.blurb"`), `EasingSelect.vue:25`
  (`:title="modelValue"`), plus the many `DockIconButton title="…"` (these are
  fine — they pair with `IconTooltip`). The bare `title=` on labels/values is the
  concern.
- **Gap**: Native `title` tooltips do not appear on touch and are unreliable for
  keyboard/AT. Where `title` carries *real* information (the preset blurb, the
  full curve name when truncated), it is invisible on mobile and to many AT users.
  The demo already has a proper `IconTooltip`/reka `Tooltip` primitive — the bare
  `title`s are the off-pattern stragglers.
- **SOTA / guidance**: `accessibility` §3 — "Don't use `title` or `placeholder`
  as a naming mechanism," and `interest-triggered-tooltips` (featuresUsed:
  *Interest invokers, `popover="hint"`, Anchor positioning*) is the emerging
  native path (`interestfor` wires AT automatically). Baseline: `interestfor` is
  newly-available (not yet Baseline-wide) — the reka `Tooltip` already in use is
  the pragmatic choice today; `interestfor`/`popover="hint"` is the forward path.
- **Disposition**: **FOLD-E**. Replace information-bearing bare `title`s with the
  existing `IconTooltip`/`Tooltip` (works on focus + touch-long-press); keep
  `title` only where it is a redundant convenience.
- **Isomorphism**: Behavior-preserving for mouse-hover; adds touch/keyboard
  discoverability.

### E-UX-13 · `<pre contenteditable>` CSS editors lack label/role and are pointer-keyboard only · LOW

- **Where**: `demo/@/components/custom/animation-controls/keyframes/KeyframeCard.vue:35-40`
  — a `<pre contenteditable="true">` for per-frame CSS editing, with no
  `aria-label`, `role="textbox"`, or `aria-multiline`. (The Monaco-based
  `CSSCodeEditor` paths are fine — Monaco brings its own a11y.)
- **Gap**: A bare `contenteditable` `<pre>` is an unlabeled editing surface; AT
  announces it as generic editable text with no name ("CSS for keyframe N"). The
  `insertTabAtCursor` helper (`contenteditable.ts`) handles tab insertion
  correctly, so the *editing* is sound — only the *labeling/semantics* are
  missing.
- **SOTA / guidance**: `accessibility` §2/§3 — name editable controls; a
  `contenteditable` region used as a code field should carry `role="textbox"`
  `aria-multiline="true"` and an `aria-label`.
- **Disposition**: **FOLD-E**. Add `aria-label` + `role="textbox"`
  `aria-multiline="true"` to the contenteditable CSS panes (low cost). Longer-term,
  consider routing all CSS editing through the single Monaco wrapper for
  consistency.
- **Isomorphism**: AT-only; pixel-isomorphic.

---

## ALREADY-SOTA (verified — do not manufacture work here)

- **`0fr→1fr` grid-row height animation** —
  `ControlsPaneWrapper.vue:148-154`, `AnimationControlsControls.vue:295-301`. The
  modern, JS-measurement-free collapse/expand. This is *preferable* to
  `interpolate-size: allow-keywords` / `calc-size()` (guide
  `calculate-with-intrinsic-sizes`) on today's Baseline because `grid-template-rows`
  interpolation has broader support and needs no `@supports` guard. **Keep as-is.**
- **Engine-dogfooded scene-swap with reduced-motion** — `App.vue:231-249`,
  `SpringProgress({ respectReducedMotion: true })`. A defensible hand-rolled
  fade (the `<Transition>`-around-`<Suspense>` async-loader hazard is documented
  at `App.vue:108-135`). E-UX-2 proposes VT as the *primary* path but this remains
  a correct, reduced-motion-aware fallback.
- **Dynamic-viewport sizing + `@supports`-gated fallbacks** —
  `EditorShell.vue:135-148` (`@supports not (height:100dvh)` → `vh`/`vw`),
  `AnimationMenuBar.vue:269-279` (safe-area `env()` with `@supports not`). Exactly
  the resilient pattern the `css` guide prescribes.
- **Safe-area insets + `touch-action`/`overscroll-behavior` discipline** —
  `TopDock.vue:114` (`env(safe-area-inset-top)`), `style.css:215-216`,
  `CubeScene.vue:4`, `OrbitalDrag.vue:295`. Correct mobile gesture containment.
- **Keyboard-accessible custom slider (the gold standard the others should match)**
  — `SpringTarget.vue:22-33,111-125`: `role="slider"`, `aria-valuenow/min/max`,
  `tabindex="0"`, arrow/Home/End. This is the template for E-UX-3/E-UX-4.
- **glass-ui `<Slider>` for easing/spring scrubbing** — `EasingTarget.vue:43-55`
  (`aria-label`, keyboard for free), `PlaybackRibbon.vue:10-21`. Real,
  keyboard-accessible sliders where it counts most.
- **Discoverable shortcut system** — singleton registry
  (`AnimationControlsGroup.vue:262-277`, 16 shortcuts grouped) surfaced by the `?`
  modal (`KeyboardShortcutsModal.vue`); editable-target skip is handled in the
  registry. Strong.
- **`prefers-reduced-motion` honored in the idiom layer + cube** —
  `design-idioms.css:121-125` (`.scale-on-hover` transition removed under reduce),
  `CubeTarget.vue:140`, plus the engine springs. Real reduced-motion support.
- **`lang="en"` + non-restrictive viewport** — `app/index.html`,
  `playground/index.html` (no `maximum-scale`/`user-scalable=no` — zoom not
  disabled). Meets the `accessibility` §4 metadata bar.
- **Single `<main>` landmark, deliberately a real box** —
  `EditorShell.vue:34-41` (the comment documents *why* it is not
  `display:contents` — preserving the implicit `main` role). Landmark-correct.
- **Reduced color-contrast remediation already done** —
  `SpringTarget.vue:196-205` (the settled-badge AA fix, with the contrast math
  noted). Shows an active a11y-contrast discipline.

---

## value.js hand-off candidates

None this lane. The demo's UX gaps are demo-DOM / demo-CSS concerns; the only
value.js touchpoints from the demo (the easing curve catalog at
`EasingTarget.vue:114`, `SpringProgress`/`SmoothProgress` consumed for inertia)
are working as intended and surfaced no value.js-side issue from a UX read.
(No `FOLD-VALUEJS-HANDOFF` items.)

---

## Disposition summary

| ID | Title | Severity | Disposition |
|----|-------|----------|-------------|
| E-UX-1 | Dead/broken CommandPalette + phantom Cmd+K | HIGH | FOLD-E (delete; book real palette) |
| E-UX-2 | No View Transitions for scene nav | HIGH | FOLD-E (befitting motion upgrade) |
| E-UX-3 | Timeline markers/playhead pointer-only | HIGH | FOLD-E |
| E-UX-4 | Visualizer scrub ball no slider semantics | MED | FOLD-E |
| E-UX-5 | CopyButton non-focusable `<span>`, silent | MED | FOLD-E |
| E-UX-6 | `.is-disabled` lies to AT (pointer-events) | MED | FOLD-E |
| E-UX-7 | No demo-owned `:focus-visible` ring | MED | FOLD-E |
| E-UX-8 | `<img>` previews missing `alt` | LOW | FOLD-E |
| E-UX-9 | Start-screen first-gesture under-signposted | MED | FOLD-E (BOOK copy/cue) |
| E-UX-10 | No `aria-live` status region | LOW | FOLD-E |
| E-UX-11 | Sub-24px touch targets (timeline diamonds) | MED | FOLD-E |
| E-UX-12 | Bare `title` tooltips not touch/kbd discoverable | LOW | FOLD-E |
| E-UX-13 | `contenteditable` CSS panes unlabeled | LOW | FOLD-E |

All findings are **FOLD-E** (keyframes.js demo). No value.js hand-offs.
The through-line: the demo already *has* the SOTA patterns (keyboard slider,
reduced-motion springs, dvh/safe-area, grid-row animation) — the work is
**applying them consistently** to the custom interactive surfaces, deleting one
dead file, and taking the native View-Transitions upgrade for navigation.
