# Tranche G — Demo Usability + Affordance Audit (Playwright, live)

**Lane:** G Playwright demo-usability audit (audit-only, zero source/demo edits).
**Branch:** `tranche-g-dev`
**Method:** LIVE — Playwright MCP (`@plugin_playwright`), Chromium, dev server `npm run dev`.
**Server note:** CLAUDE.md says `:8080`; the actual Vite dev server bound `:5174` (5173 was in use). Base URL audited: `http://localhost:5174/#/<scene>`.
**Viewports:** desktop 1440×900 + mobile 390×844 (`browser_resize`).
**Date:** 2026-06-06.

## Honesty / coverage caveats

- **WebGL is UNAVAILABLE in this headless Chromium** (`canvas.getContext('webgl2')` → null). The **Amiga** scene (Three.js) therefore **cannot be visually verified live** — it renders grey WebGL-fallback shapes here. Its chrome/affordances were audited; its 3D subject was not.
- `requestAnimationFrame` IS alive (61 ticks / 500ms ≈ 120fps), and the cube/square animations visibly advanced between frames — so the engine dogfood runs. One scene (Sequence) did **not** advance its clock under synthetic playback; flagged below as needing manual confirmation rather than asserted as a definite bug.
- Console across every scene: **0 errors**. The only repeated warning is a Vue Router `next()`-deprecation (from `router.ts` nav guard). One **caught** value.js parse error was logged on the home/amiga path (see X-2).

---

## Scene: Home / start screen — `#/`

The LCP landing: hero "Select an animation …", a 3D cube ("M. cubert"), axis lines, a bottom transport (scene-selector pill, reset, clear-all, play). All 10 focusables carry accessible names; keyboard Tab works and lands a visible focus ring (outline auto, blue `rgb(153,200,255)`).

- **SHIP-in-G — Hero LCP renders "Selectananimation" (inter-word spaces collapse to 0px).**
  `AnimatedText.vue` splits the title into per-word `inline-block` spans (line 63) and inserts a literal space between them via `<template v-if=…> </template>` (line 23). Because the gap is a whitespace-only text node *between two `inline-block` boxes*, HTML whitespace-collapsing eats it. Measured: "Select" right-edge = 178px, "an" left-edge = 178px → **0px gap** (verified for both word boundaries). The decorative aria-hidden layer reads "Selectananimation"; only the `sr-only` mirror is correct. This is the single most visible defect in the demo and it's on the most important element. Fix: give the word spans a real gap that survives `inline-block` (e.g. `margin/padding-inline`, or a non-collapsing separator), or set the run container to preserve spaces. File: `demo/@/components/custom/AnimatedText.vue`.

- **BOOK — Start-screen overlay does not dismiss after select+play (home route only).** After choosing "Rotations" the cube starts playing and the menubar updates to Pause, yet the instructional overlay ("Select an animation… then press Play.") stays on top of the now-playing subject. Likely intentional for the showcase landing, but it reads as a stuck state once the user has clearly completed the first gesture. Route `#/?anim=Rotations`.

- **ALREADY-SOTA — First-gesture cue + keyboard discovery.** The hero copy explicitly instructs "from the list below, then press Play" + "or drag M. cubert", and the `?` shortcuts modal (see X-4) is one click away. Clear first-gesture cueing.

---

## Scene: Cube — `#/cube`

The canonical editor: orbital-drag cube, EditorShell, controls panel (duration/delay/iterations/direction/fill/easing + advanced), a PlaybackRibbon (progress slider, Pause/Reverse, large draggable keyframe markers). Engine motion is smooth (visible rotation motion-blur). All controls labeled.

- **SHIP-in-G (root in glass-ui) — Top dock + header are NOT mouse-clickable at rest (occlusion + collapsed dock).** `elementFromPoint` over **every** top-dock/header control returns the full-bleed scene viewport (`div.grid.h-full.w-full` / `main.grid.place-items-center`), not the control:
  - Open controls, Controls-tab, **Scene combobox (primary nav!)**, @mbabb menu — blocked by the scene viewport.
  - Share — blocked by the scene `<main>`.
  Root cause: the top dock is glass-ui `collapsed` by default; its expanded button layers (`.dock-layer--full`, `.dock-layer-group`, `.dock-layer-stack`) are `pointer-events:none` until hover-expand, and the dock carries `z:auto` everywhere (the `--z-dock:40` token is not actually applied to these glass-ui internal layers), so the later-painted scene-host wins the hit test. After `:hover` expands the dock the buttons become clickable — but the expansion lapses the instant the pointer drifts, so a real click is a sustained-hover race (Playwright's actionability check times out repeatedly clicking "Open controls"). Per MEMORY (`project_dock_doubleclick`, `feedback_glass_ui_root_changes`) the fix belongs in the glass-ui root, not the demo. This gates the two most important top-level affordances (scene switching + open-controls) behind a fiddly hover on desktop and a double-tap on touch.

- **SHIP-or-BOOK — Collapsed top dock renders as an unreadable ~15px vertical sliver.** The collapsed dock is `fit-content` + `overflow:hidden` and computes to **15px wide** while its inner label ("Controls"/"Cube"/"Home") is 118px — clipped to a faint vertical strip at top-center. It appears in EVERY scene screenshot as what looks like a rendering glitch, and gives a first-time user essentially no affordance that a navigation/controls dock exists there. (Root likely glass-ui per MEMORY.)

- **BOOK — Open controls panel occludes the subject.** On cube (and square/sequence/motion-path) the controls overlay is a large glass card centered over the viewport; the animating subject sits behind it and bleeds through the translucent glass (bright cube faces show through the panels). You can edit OR watch, not both. On mobile (390) the panel + ribbon consume nearly the whole viewport and push the cube to the bottom edge.

- **ALREADY-SOTA — Mobile layout + dock-open-by-default.** At 390px the dock is expanded by default (solving the hover problem for touch), the 2-col controls grid is clean, the keyframe markers are large touch targets. The "Close controls" toggle has a correctly-flipping `title` (a11y).

---

## Scene: Amiga — `#/amiga`  (WebGL-blocked here)

- **NOT-LIVE-TESTABLE — 3D subject.** WebGL unavailable in the audit browser; the sphere can't render (grey fallback shapes). 4 `<canvas>` present. The control chrome (Controls panel, Play/Reverse, PlaybackRibbon, menubar) rendered and is labeled. 0 console errors. Recommend a manual pass in a GPU browser for motion quality / subject cohesion.

---

## Scene: Square — `#/square`

Custom-transform-fn demo: a periwinkle rounded square reading "heyyyy", animating smoothly through a rotate/transform when played. Clean subject once controls are closed.

- **SHIP-in-G — Duplicate "Play animation" accessible name.** Two buttons share `aria-label="Play animation"` simultaneously — the PlaybackRibbon transport (w-10 h-10) and the bottom-menubar play (w-8 h-8 rainbow). A screen-reader user hears two identical "Play animation" buttons with no way to tell them apart. Disambiguate (e.g. "Play (transport)" vs "Play"). This is structural to the shared control suite, so it recurs on every editor scene.

- **ALREADY-SOTA — Subject + motion.** Smooth transform interpolation; the subject is centered and legible once the panel is closed.

---

## Scene: Easing — `#/easing`

A large cubic-bezier curve editor: purple curve on an f(t)/t grid with the diagonal reference, two big draggable white control-point handles with dashed tangent lines, an "ease" text input + CopyButton, an easing-function select, a DURATION slider, a live `F(0.31) = 0.534` readout, and a "Singular" mode dropdown. 0 console errors.

- **ALREADY-SOTA.** Best-in-class discoverability: the draggable handles are unmistakable, the live function readout dogfoods the engine, and the mobile layout (390) stacks the square editor + all controls cleanly with the dock expanded. No real usability gap found.

---

## Scene: Spring — `#/spring`

Spring designer: `response` + `dampingFraction (ζ)` sliders, preset chips (smooth/snappy/bouncy/gentle, each with a descriptive name), a `springLinearStops() → CSS` `linear(...)` output + Copy, Pause/Re-seat/Reset, a live `SpringProgress x=1.000 · v=0.00 / settled` readout, and a draggable rail ("Drag to re-seat the spring target" + helper prose). Exemplary labeling. 0 console errors.

- **BOOK — Monaco accessible-textarea announces "The editor is not accessible at this time."** The CSS-output `code` block embeds a Monaco editor whose hidden a11y textarea carries Monaco's default placeholder; a screen reader will read that string. Known Monaco quirk; worth a label/aria-hidden pass on read-only code surfaces. (Same Monaco surface recurs in the CSS keyframes editor.)

- **ALREADY-SOTA — Affordance + helper text.** Sliders, presets, copy, and the live energy readout are all clearly labeled with inline guidance. Strong.

---

## Scene: Sequence — `#/sequence`

Stagger storyboard: header "Sequence — STAGGER × 5 · PROGRESS n% · READY/PLAYING", 5 children labeled by stagger offset (@0/@260/@520/@780/@1040 MS), a master-playhead timeline + readout, and a transport (Play / Reverse / 1× timeScale / Reset, text+icon). Clean, well-labeled layout once controls are closed.

- **FLAG (needs manual confirm) — clock does not advance under synthetic playback.** After clicking the transport Play the header flips to "PLAYING" and Play→Pause, but `PROGRESS` stayed `0%` and the master playhead stayed `0.000` across 1.2s, with the page `visibilityState:visible` and `document.hasFocus():true` and rAF confirmed alive. Cube/square DID advance, so this is not a global rAF failure. I could not 100% exclude a Playwright/CDP focus nuance (the demo's `useSceneVisibilityPause`/blur handling vs. a synthetic click), so this is flagged for a manual human-driven Play, not asserted as a ship bug. If it reproduces under real input it's a SHIP-in-G broken-transport.

- **BOOK — Resting children are very low-contrast.** At progress 0% the 5 child dots are faint green (~30% opacity) on the near-black bg; hard to perceive before motion starts.

- **SHIP-in-G — "Open controls" overlay fully hides the storyboard.** With the panel open, the entire sequence (the point of the scene) is behind the glass card; only "2700ms" fragments peek out at the panel edges. (Instance of the cross-cutting panel-occlusion pattern, but here it hides the whole subject.)

---

## Scene: MotionPath — `#/motion-path`

A traveller (glowing dot + emoji) swept along a dashed author `offset-path` loop. Header "MotionPath — OFFSET-DISTANCE SWEEP OVER AN AUTHOR OFFSET-PATH". Excellent explainer prose: "A WAAPI-eligible offset-distance: 0% → 100% over an author offset-path — the browser owns the geometry, keyframes.js sweeps the scalar. Scrub from the bar below." 0 errors.

- **SHIP-or-BOOK — Collapsed dock sliver clips the centered header text.** The 15px dock sliver sits at top-center on top of the header title row and overlaps a header word ("…OVER [th]AN…"), so the header reads with a glyph collision. Same root as the cube dock-sliver finding; visible specifically here because the header is a centered single line.

- **ALREADY-SOTA — Concept communication.** The dashed path makes the geometry legible, the traveller is obvious, and the explainer text tells the user exactly how to interact ("Scrub from the bar below").

---

## Scene: Discrete / @starting-style — `#/starting-style`  (BROKEN — unreachable)

- **SHIP-in-G — The "Discrete" scene is registered but has NO route → completely unreachable.** `scenes.ts` registers `{ id:"starting-style", label:"Discrete", … }` and `useSceneRouter` passes the full `scenes` list to `TopDock`, so the scene-switcher offers "Discrete" and `switchScene("starting-style")` calls `router.push({ name:"starting-style" })`. But `router.ts` declares routes only through `motion-path`; there is **no** `starting-style` route. Verified: navigating `#/starting-style` hits the catch-all `{ path:"/:pathMatch(.*)*", redirect:"/" }` and **redirects to home (`#/`)**. So selecting "Discrete" in the switcher cannot land the scene. One-line fix: add `{ path:"/starting-style", name:"starting-style", component: Stub }` to `demo/app/router.ts`. (The scene's own affordances couldn't be audited because it can't be reached.)

---

## Cross-scene patterns

### Consistent / SOTA (do not touch)
- **Accessible names everywhere.** Every interactive control I probed had an aria-label/title; toggles flip their labels ("Open/Close controls", "Switch to light/dark mode"). F.W15/W16 clearly landed.
- **Visible focus rings.** Keyboard Tab traverses controls with a clear blue `outline:auto` focus-visible ring.
- **Keyboard-shortcuts discovery (X-4).** `?` opens a proper `role="dialog"` with GENERAL/PLAYBACK/NAVIGATION sections and 26 `<kbd>` keys, headed "Press ? to toggle this panel". Excellent.
- **Explainer prose** on the conceptual scenes (motion-path, spring) tells users exactly how to interact.
- **Mobile** expands the dock by default and stacks controls cleanly (390px) on every scene tested.
- **Zero console errors** on every route; smooth engine motion where GPU/clock allowed.

### Inconsistent / the real gaps
- **X-1 — The top dock is the weakest affordance, system-wide (collapsed sliver + hover-gated + occluded).** Three compounding issues converge on the SAME element: (a) it collapses to an unreadable 15px sliver at rest; (b) its full buttons are `pointer-events:none` until a fragile hover-expand; (c) the full-bleed scene viewport wins the hit-test because the `--z-dock` token isn't applied to glass-ui's internal dock layers. Net effect: scene navigation + open-controls are hard to find AND hard to click on desktop, and require a double-tap on touch. Highest-leverage fix (root = glass-ui per MEMORY).
- **X-2 — Caught value.js parse error in the engine pipeline.** `Parse error at offset 0: "......"` thrown from `value.js` parser via `CSSKeyframesAnimation.processFrame → interpFrames → _lerp` — the engine is being handed the literal ellipsis text ("......", almost certainly the start-screen "…" hero string) as a keyframe value. Caught (app doesn't crash), but it's a real broken-data signal worth tracing. BOOK.
- **X-3 — Duplicate "Play animation" a11y name** on every editor scene (transport + menubar). SHIP-in-G (shared control suite).
- **X-4 — Open controls panel occludes the animating subject** on cube/square/sequence/motion-path; on sequence it hides the entire storyboard. BOOK (consider a docked/side panel or auto-shrink subject).
- **X-5 — Hero word-spacing bug** (Home, SHIP-in-G) — see Home.
- **X-6 — Discrete scene unreachable** (SHIP-in-G) — see Discrete.
- **X-7 — Minor a11y nit:** the theme toggle is action-labeled ("Switch to light mode") yet carries `aria-pressed="true"`, which conflicts semantically (pressed=true reads as "light is on" while the label means "currently dark"). BOOK.

## Top SHIP-in-G fixes (ranked)
1. **Discrete scene route** — add the missing `starting-style` route to `router.ts` (1 line). A whole registered scene is dead.
2. **Hero "Selectananimation"** — fix inter-word gap in `AnimatedText.vue`. Most-visible defect, on the LCP.
3. **Top-dock occlusion / `--z-dock` not applied + collapsed sliver** — root in glass-ui; gates navigation + open-controls. (BOOK to glass-ui, but it's the #1 usability gap.)
4. **Duplicate "Play animation" name** — disambiguate the two transport/menubar play buttons.
