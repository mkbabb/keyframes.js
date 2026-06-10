# Pane Audit — Amiga Scene
**Lane:** pane-amiga  
**Tranche:** J  
**Date:** 2026-06-10  
**Screenshots:** `docs/tranches/J/audit/design/screenshots/amiga-{mobile,laptop,desktop}.png` + `-open` variants

---

## Scene Overview

The Amiga pane is a Three.js boing-ball homage: a red-and-white checkerboard sphere inside a monochrome geometric room. The animation engine drives multi-axis rotations + a hue-cycling color animation; a hidden "boing" easter egg fires the full bounce arc on double-click. The scene uses `stageMode="subject"` — the Three.js canvas is the full-bleed background, the glass sheet overlays it on mobile, and the rail-stage grid hosts it on desktop.

---

## Screenshot Analysis

### Mobile (375w) — closed + open

**Closed (`amiga-mobile.png`):**
- The sphere sits at the lower-center of the Three.js room, visually small (roughly 50px diameter against a 375×350 canvas). The room geometry — the trapezoidal perspective walls — fills most of the frame, but without the sphere animating, the static read is gray geometry with a small red ball.
- The scene title "Amiga" in the header chip is the only typographic element in view; it is small (chip-size sans-serif), carrying the correct scene icon (the red checkerboard emoji), but no display-scale type names or contextualizes the scene.
- The dock menubar shows "Rotations ↓ ↺ 🗑 ▶" pill — the rainbow play button is present but in the **pastel/idle** variant (grayed rainbow), blending into the dock rather than popping.
- The sheet peek sliver is visible at the bottom; the grab pill is clear.

**Open (`amiga-mobile-open.png`):**
- The controls sheet rises to ~50% of the viewport. The sphere is **partially cut off** at the bottom edge of the visible canvas above the sheet — only the upper hemisphere protrudes above the sheet top edge. The subject loses protagonist status at the exact moment the user is interacting with its controls.
- The sheet occupies the lower half; the stage above shows the top third of the room (the ceiling trapezoid) and a fragment of sphere. This is the critical mobile hierarchy defect: the animation target and the controls are fighting for space rather than composing.
- The sheet itself is clean glass-card (correct token). Internal controls hierarchy is legible (duration/delay/iterations/direction/fill mode labels at mono-small weight, values in pill inputs). No visual differentiation between primary fields (duration — the most-edited) and secondary fields (fill mode — rarely touched) beyond label order alone.

### Laptop (1280w) — closed + open

**Closed (`amiga-laptop.png`):**
- The rail-stage split is working: controls pane left, canvas right. The sphere is clearly visible and centered in the Three.js room.
- The canvas fills the right column but the **sphere is small relative to the stage area** (~80px visible diameter in a ~790×580 canvas). The room geometry frames it correctly but the subject reads as a decorative embellishment, not a protagonist — the gray walls dominate the visual field.
- Controls card: `surface="cartoon" tier="quiet"` — the cartoon offset stamp registers as depth but it is subtle. The easing `pencil ✏` icon in amber/gold stands out as the only warm-spectrum accent in the entire controls pane. No other color accents in the chrome.
- Playback ribbon card: the progress ball (red `bg-accent-red`) and the pink progress bar read as a clear accent. The Play/Reverse buttons are outline-only (no fill), low visual weight.

**Open (`amiga-laptop-open.png`):**
- Same layout. The controls panel is visually open and functional. The sphere remains centered. The rainbow play button now shows the full gradient (playing state) — the strongest accent in the viewport. The panel composition is correct; the stage does not fight the controls.

### Desktop (1440w) — closed + open

**Closed (`amiga-desktop.png`):**
- At 1440w the stage area (~900px wide, ~700px tall) frames a sphere of the same small absolute size. The proportional read worsens: the subject is a 90px ball in a 900×700 room. The room's perspective geometry creates a dramatic architectural container but the ball is visually meager inside it.
- Left-side controls pane floats free (two stacked cards). No scene title or display-type anchor visible from the stage's perspective — the scene identity is only the "Amiga" chip at the top center.
- The room color is a single monochrome gradient (grey walls, `rgb(220,220,220)` Lambert material). There is **no environmental color reference** in the Three.js scene until the ball's hue-cycling kicks in. The canvas background CSS uses `var(--muted)→var(--background)` for the transparent clear compositing — the correct theming — but this means the out-of-room area (corners behind the perspective walls) blends into the page background seamlessly, potentially making the stage boundary ambiguous.

**Open (`amiga-desktop-open.png`):**
- Controls are open; the sphere has shifted slightly in the room (animation was running at capture time). The playing state rainbow dot on the dock is the brightest visual element. Everything else is grey-on-grey.

---

## Findings Table

| ID | Sev | Title | Evidence | Source File |
|----|-----|-------|----------|-------------|
| A-01 | P1 | Mobile open state occludes the sphere | `amiga-mobile-open.png`: only the top hemisphere is visible above the sheet | `ControlsPaneWrapper.vue` (sheet spring detent) |
| A-02 | P1 | Sphere is visually undersized as a protagonist at all breakpoints | `amiga-desktop.png`: ~90px ball in 900px stage; `amiga-laptop.png`: ~80px in 790px | `AmigaScene.vue`: `camera.position.z = BOX_SIZE` + `BOX_SIZE=12` |
| A-03 | P2 | No display-type scene identity on the stage | All screenshots: "Amiga" appears only in the 28px header chip | No Vue template; an on-stage text node or subtitle is missing |
| A-04 | P2 | The idle/stopped play button (rainbow-pastel) reads as inactive chrome | `amiga-mobile.png`, `amiga-desktop.png`: the rainbow gradient is washed and blends with the dock background | `AnimationMenuBar.vue`: `rainbow-pastel` class when `!isPlaying` |
| A-05 | P2 | Controls pane has no internal hierarchy differentiation — all fields equal weight | `amiga-laptop.png`: duration, delay, iterations, direction, fill mode, easing all render at identical mono-small muted weight | `AnimationControlsControls.vue`: uniform `label-class="text-mono-small text-muted-foreground"` |
| A-06 | P2 | Room color monochrome — no environmental color accent to support the brand identity | `amiga-desktop.png`, `amiga-laptop.png`: all walls and floor are `rgb(220,220,220)` grey with no color accent until hue-cycling plays | `AmigaScene.vue`: `boxMaterial = new THREE.MeshLambertMaterial({ color: "rgb(220, 220, 220)" })` |
| A-07 | P2 | Canvas stage boundary is invisible — no glass/card framing differentiates the Three.js stage from the background | All desktop/laptop screenshots: the canvas bleeds into the page's `--background` via the `linear-gradient(--muted, --background)` clear | `AmigaScene.vue` `<style>`: `.amiga-canvas { background: linear-gradient(...) }` |
| A-08 | OPP | Display-scale "Amiga" scene identity should anchor the stage, not hide in the header chip | `amiga-desktop.png` — the large empty stage has no scene identifier except the chip | No source — opportunity to add a positioned large-type anchor |
| A-09 | OPP | Mathematical/physics motifs from the engine (easing curve, bounce parameters) could be surfaced as a subtle stage decoration | All screenshots: the room interior is entirely empty except the sphere | `useAmigaAnimations.ts`: the `BOX_SIZE=12`, `BOUNCE=5`, `cubic-bezier(0.2,0.65,0.6,1)` values exist but are invisible |
| A-10 | OPP | The sphere's checkerboard saturation could be amplified toward the red-and-white canonical Amiga Boing Ball read | `amiga-desktop.png`: the sphere reads as pink-grey at distance rather than a vivid red-and-white | `utils.ts`: `tesselateSphere("white", "red", 1)` — canonical colors present but the camera/lighting washes them |
| A-11 | OPP | The dock's idle play button could carry a more audacious accent, befitting the "proportionate color pop" language | `amiga-mobile.png`: rainbow-pastel pill blends into the dock | `AnimationMenuBar.vue`: `rainbow-pastel` class — glass-ui utility |
| A-12 | OPP | The "∞ iterations" readout is a hidden typographic gem — could be displayed larger/bolder as a brand-coherent math accent | `amiga-laptop.png` controls pane: `∞` character renders at the same mono-small size as all other values | `AnimationControlsControls.vue`: `iterationCount === 'infinite' ? '∞'` |
| A-13 | OPP | The boing easter egg has no visual hint — a subtle grab affordance or double-click hint text would keep the discoverable surprise alive | All screenshots: no visible indication the stage is double-clickable for the boing arc | `AmigaScene.vue`: `@dblclick="onBoing"` on the canvas — no hint in the UI |

---

## Detailed Findings

### A-01 — P1 — Mobile open state occludes the sphere
**File:** `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`  
**Evidence:** `amiga-mobile-open.png` — the spring-driven sheet rises to its `--sheet-detent-expanded` (calculated as `0.52 * 100dvh - reserves`). At 375w the sphere, which renders near the center of the canvas, is right at the sheet boundary. The 0.45 visible-stage-fraction floor (documented in the CSS comment) is being met by the layout math, but the sphere's **Three.js position** happens to sit at the exact border: the lower third of the room (where `SPHERE_HOME=0` places the sphere in the perspective projection) is exactly where the sheet meets the canvas.  
**Proposal:** Two complementary fixes: (1) AmigaScene — raise the sphere slightly in camera space by adjusting `camera.position.y` from `BOX_SIZE/3` to `BOX_SIZE/2` so the sphere projects to the upper-center of the canvas (above the sheet), not the center; (2) ControlsPaneWrapper — this scene's `stageMode="subject"` sheet detent could be tightened to 0.48 * 100dvh (4% reduction) with a named comment so the sphere clears for all phone heights.

### A-02 — P1 — Sphere undersized as protagonist
**File:** `demo/app/scenes/AmigaScene.vue` — `camera.position.z = BOX_SIZE` (=12), sphere radius=1  
**Evidence:** `amiga-desktop.png` center area; `amiga-laptop.png` center area.  
The sphere has `radius=1` and the box is `BOX_SIZE=12`. The camera is placed at `z=12` (one box-length away), which is already a moderate zoom. The sphere subtends a very small field-of-view angle. With Three.js `PerspectiveCamera(75, ...)` at z=12, an object of radius 1 at origin subtends roughly `2 * atan(1/12) ≈ 9.5°` — less than 13% of the 75° FOV width. Narrowing the camera FOV (from 75° to ~45°) or pulling `camera.position.z` closer (from BOX_SIZE to BOX_SIZE * 0.65) would substantially increase the apparent sphere size without changing the artistic framing of the room.  
**Proposal:** In `AmigaScene.vue`, change `camera = new THREE.PerspectiveCamera(50, ...)` (from 75) and `camera.position.z = BOX_SIZE * 0.7` (from BOX_SIZE). This makes the sphere fill roughly 20% of the vertical FOV — protagonist scale — while keeping the room walls in frame as a contextual surround.

### A-03 — P2 — No display-type scene identity on the stage
No Vue template in the current codebase places a display-scale label on the amiga stage. The scene identity "Amiga" appears only in the EditorHeader chip.  
**Proposal:** Add a positioned overlay element inside `AmigaScene.vue`'s `<div class="scene-root">` — an absolutely-positioned bottom-left or top-right text block using `text-display` or `text-title` (Instrument Serif, large) with `opacity: 0.12` so it reads as a typographic watermark behind the Three.js canvas (the canvas is `position: relative`, the overlay is `position: absolute` with `pointer-events: none`). "AMIGA 500" or "1984" in Instrument Serif italic at text-display-4 scale would be on-brand (the math/art-history register of the demo).

### A-04 — P2 — Idle play button too muted
**File:** `demo/@/components/custom/animation-controls/AnimationMenuBar.vue`  
**Evidence:** `amiga-mobile.png` bottom dock: the `rainbow-pastel` pill is nearly invisible against the glass dock.  
The `rainbow-pastel` glass-ui utility is intentionally a muted gradient (low-saturation suggestion of rainbow). When the ball is idle, this reads as an inert decoration. **The problem is that the stopped state is also the INVITATION state** — the button should attract attention (play me!) rather than recede.  
**Proposal:** Glass-ui handoff: expose a `rainbow-vivid-outlined` variant (a border drawing the rainbow, not the fill) that is more presence-appropriate for the idle state without the full saturated fill. As a demo-side workaround: apply a subtle `ring-2 ring-primary/30 scale-on-hover` to the play button when `!isPlaying` to add minimal idle presence.

### A-05 — P2 — Controls pane lacks internal hierarchy
**File:** `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue`  
**Evidence:** `amiga-laptop.png` controls panel: all six fields (duration, delay, iterations, direction, fill mode, easing) render at identical visual weight (`text-mono-small text-muted-foreground` labels, pill inputs of the same height).  
**Proposal:** In the `AnimationControlsControls.vue` template, elevate the `duration` field to `text-body font-medium text-foreground` (one rung up the φ-ladder from mono-small) since duration is the most-edited field and the one most visually tied to the animation identity. This creates a clear P1/P2/P3 hierarchy: duration (primary, slightly bolder label) → delay/iterations (secondary, current weight) → direction/fill/easing (tertiary, current style). No glass-ui token changes needed — uses existing text-scale rungs.

### A-06 — P2 — Monochrome room interior
**File:** `demo/app/scenes/AmigaScene.vue` — `boxMaterial.color = "rgb(220, 220, 220)"`  
**Evidence:** All desktop/laptop screenshots — the three visible walls of the box are undifferentiated grey.  
The original Amiga Boing demo had a specific floor/wall color contrast (white/grey stripes). The demo's room is entirely flat grey.  
**Proposal:** In `AmigaScene.vue`, introduce a second Lambert material for the floor face with a slightly warmer tint — `hsl(30, 8%, 88%)` — and leave the walls at their current grey. This creates a subtle floor/wall separation matching the original source material, with no cost to the transparent-canvas compositing (the scene is still alpha-composited over the CSS background). Alternatively, the back wall (the face the sphere is viewed against) could carry `hsl(210, 12%, 86%)` — a cool grey that complements the red checkerboard sphere without fighting it.

### A-07 — P2 — Canvas stage boundary is invisible
**File:** `demo/app/scenes/AmigaScene.vue` `<style scoped>` — `.amiga-canvas { background: linear-gradient(to bottom, var(--muted), var(--background)) }`  
**Evidence:** `amiga-desktop.png` — the canvas merges with the page's grid-background seamlessly. The Three.js room geometry ends at the canvas boundary but that boundary has no visual frame.  
**Proposal:** Add a subtle `box-shadow: inset 0 0 0 1px var(--border)` to `.amiga-canvas` — a 1px inset hairline on the glass token color defines the stage boundary without introducing a DOM layer or blocking the transparent composite. The canvas is already `rounded-lg`; the hairline would follow that radius.

### A-08 — OPP — Display-scale scene identity watermark
**Evidence:** `amiga-desktop.png` — large empty grey walls, no typographic presence.  
**Proposal:** See A-03 for the mechanism. The text "AMIGA" in Instrument Serif at `text-display-4` (the φ-ladder's largest rung), absolute-positioned at bottom-left of the stage root with `opacity: 0.07 text-foreground`, `font-style: italic`, `pointer-events: none`, `user-select: none`. Renders as a typographic watermark behind and below the sphere's travel path. Befitting: large + audacious typography, the demo's own brand identity, the math/art register, proportionate (7% opacity).

### A-09 — OPP — Mathematical motifs from the engine
**Evidence:** `useAmigaAnimations.ts` — `BOX_SIZE=12`, `BOUNCE=5`, `cubic-bezier(0.2,0.65,0.6,1)`, `duration: 700ms` for the bounce Y axis.  
**Proposal:** On desktop, a subtle caption overlay (bottom-right of the stage, `text-mono-caption text-muted-foreground opacity-40`) showing the current animation's key values — `"20s · cubic-bezier(0.2, 0.65, 0.6, 1)"` or `"∞ iterations"` — rendered as a monospaced callout. This dogfoods the engine (the values are live from the animation object), surfaces the math, and uses the `font-mono` identity. Opt into this with a hover-on affordance so it's zero visual noise at rest.

### A-10 — OPP — Amplify sphere saturation / lighting
**Evidence:** `amiga-desktop.png` — the sphere reads as a dim pinkish-grey ball at typical viewport sizes. At 90px the checkerboard is barely legible as a pattern.  
**Cause:** `HemisphereLight("white", "#b0b0b0", 1.8)` + `SpotLight("white", 0.6)`. The red color of the checkerboard squares gets washed by the hemisphere's white fill. The `THREE.MeshLambertMaterial` is diffuse-only with no specular punch.  
**Proposal:** Change the sphere material to `THREE.MeshPhongMaterial({ map: texture, shininess: 80, specular: new THREE.Color(0x550000) })` so the red squares hold their saturation under white light and a specular highlight catches on the sphere's top. Additionally, reduce `HemisphereLight` intensity to 1.2 (from 1.8) and increase the SpotLight intensity to 1.0 (from 0.6) to create more directional contrast — the Amiga Boing had distinct top-lit shading.

### A-11 — OPP — Dock idle play button accent
See A-04. This is the glass-ui handoff dimension of the same finding.  
**Glass-ui handoff:** The `rainbow-vivid` / `rainbow-pastel` utility pair currently only differs in saturation/opacity. A third variant `rainbow-outlined` that renders the gradient as a border/ring on a transparent fill would be the appropriate idle-invitation affordance for the play button — present and branded but not competing with the playing state's vivid fill.

### A-12 — OPP — ∞ iterations as math accent
**Evidence:** `amiga-laptop.png` controls pane: the `∞` character is rendered at 14px mono-small alongside the other field values.  
**Proposal:** In `AnimationControlsControls.vue`, when `iterationCount === 'infinite'`, render the `∞` symbol at `text-title` (Instrument Serif, the display register, ~24px) inside the input pill rather than the same mono-small. This creates a brief mathematical moment — a proportionate serif infinity symbol inside the pill — that signals the math identity of the engine without changing the input behavior. The pill is sized to accommodate (the current pill height is `h-8` / 32px).

### A-13 — OPP — Boing easter egg discoverability
**Evidence:** All screenshots — no affordance cue that the stage is double-clickable.  
**Proposal:** In `AmigaScene.vue`, add a `<span>` absolutely positioned at the bottom-right of the `scene-root` with `class="text-mono-caption text-muted-foreground/30 pointer-events-none select-none"` containing "double-click to boing ↩". Show it only on first mount (cleared to localStorage after first activation) so it self-discovers then recedes. Proportionate: 30% opacity muted caption text, never interferes.

---

## Glass-UI Idiom Gap Summary

| Kind | Item | Proposal |
|------|------|----------|
| REFINE-IN-GLASS-UI | `rainbow-pastel` play button idle state is too muted for an invitation affordance | Add `rainbow-outlined` variant: gradient border + transparent fill; the invitation read without the playing-state weight |
| REFINE-IN-GLASS-UI | `cartoon-surface` does not carry `border-radius` by default | As documented in design-idioms.css §STAGE-CARD: `@utility cartoon-surface` should gain `border-radius: var(--radius-card)` so bare cartoon divs cannot render square |
| ABSTRACT-INTO-GLASS-UI | The `.progress-ball` + `.progress-rail` idiom pair in `design-idioms.css` is already a candidate for glass-ui promotion as a `<ProgressRail>` primitive | The three-token parameterization (`--ball-size`, `--ball-glow`, `--rail-tint`) is the correct API surface; promote with those props |
| ADOPT | `glass-ui`'s `DarkModeToggle passive` indicator pattern (used in the App.vue dropdown) could be adopted as the canonical "indicator-only" mode for the progress dot too — a passive ring that shows state without being an interactive target | Apply `passive` prop pattern to the progress conic ring when it is used as a readout |
