# LIQUID-GLASS + VIEW-TRANSITIONS + MODERN-WEB

> Research lane brief — DK64 carousel scene-switcher (Tranche N), 2026-06-17.

## Summary

The DK64 barrel-selector reference (verified: dark void, a trapezoidal downlight cone narrowing at top, a bright elliptical floor pool, the front character lit while side characters sit dim, glassy red/yellow prev/next arrows below) maps cleanly onto glass-ui's shipped material system plus the View Transitions substrate the demo already runs. The "liquid glass" stage chrome, arrows, and carousel cards should be built from glass-ui's five-rung ladder (`.glass-floating`/`.glass-overlay`) plus the `.glass-refract` convex-lens filter and the pointer-tracked `::before` specular catch-light — no new material recipes needed; only token re-points. The downlight cone + floor pool are best rendered as a pure-CSS hybrid: a `clip-path` trapezoid filled with a `linear-gradient` for the volumetric cone, a `radial-gradient` ellipse for the floor pool, and a `--stage-light` custom-property intensity scalar driven on hover; the ~15° tilt is one `perspective` + `rotateX(15deg)` on a 3D stage layer. The three morph moments (dropdown→stage entry, spin-to-front, fade-into-scene) ride glass-ui's `startViewTransition`/`navigate` helpers (which already expose the `types` array → `:active-view-transition-type()` directional curves) with the existing SpringProgress fallback preserved; the ring orbit and spin-to-front should DOGFOOD MotionPath + SpringProgress rather than VT-morph a spinning ring (VT crossfades rasterized snapshots and is wrong for continuous rotation — the same lesson glass-ui's own dock-collapse retired). Performance hinges on `content-visibility:auto` + `contain-intrinsic-size` for off-stage previews (the demo already has the `contentvisibilityautostatechange`/visibility-pause pattern to gate their rAF loops), a disciplined `will-change` budget, and GPU-compositing the cone. PRM and light/dark degrades are largely free because glass-ui's CSS already pins the specular static, drops VT animation, and the stage's theatrical darkness needs an explicit light-mode dimming token rather than the default cream surface.

## Findings

### Reference image decode (DK64 barrel)

The stage is: pure-black void; ONE selected character lit center, large, in a bright pool; TWO adjacent characters dim at left/right (the carousel ring neighbors, lit much lower); a faint ghosted '?' / silhouette behind for far ring members. The DOWNLIGHT is a hard-edged TRAPEZOID, NARROWER at top, wider at the floor, semi-opaque gray fill = a volumetric light shaft seen from a low/front angle. The FLOOR POOL is a bright white horizontal ELLIPSE where the cone meets the ground. Arrows are glossy beveled chevrons (red body, yellow fill) at bottom-left/right. This is the literal recipe to reproduce: cone trapezoid + floor ellipse + center-lit/neighbors-dim + glassy arrows.

_Evidence:_ /Users/mkbabb/Downloads/Donkey+Kong+64_Character+Barrel_2.png.webp (Read visually)

### Glass material ladder (the stage chrome + cards)

glass-ui ships a 5-rung ladder in dist/styles/glass/ladder.css: `.glass-wash`(~0.30α blur1px) `.glass-quiet`(~0.50α blur8px) `.glass-resting`(~0.65α blur10px) `.glass-floating`(~0.80α blur13px) `.glass-overlay`(~0.95α blur13px, heaviest). Stage SHELL/backdrop = `.glass-overlay` (it self-engages the bright-backdrop AA darken + sits in the overlay z-band). Carousel CARDS = `.glass-floating` or `.glass-card` (rim + under-shadow + grain). DO NOT nest a glass PANEL inside a glass panel (glass.css 'No-PLATE-on-PLATE' rule, depth-3 ceiling, contain:paint budget); a glass CONTROL (arrow button) on a glass plate is SANCTIONED. Every rung already carries the `--glass-material-rim` (=`--glass-edge-light`: `inset 0 0 0 0.75px hsl(0 0% 100%/0.18)`, dark arm 0.22) and a `::after` grain overlay at `--glass-grain-opacity` (0.025 light / 0.045 dark).

_Evidence:_ node_modules/@mkbabb/glass-ui/dist/styles/glass/ladder.css:36-113; glass/material.css:36-49; tokens/glass.css:43-46,190,224,231

### Specular catch-light (the premium sheen — pointer-tracked)

glass-ui's UNIFIED `.glass-material::before` (glass/material.css:65-136) is a masked `radial-gradient(circle var(--glass-specular-size,36%) at var(--specular-x) var(--specular-y), hsl(40 35% 92%/0.5) 0%, .../0 70%)` with `mix-blend-mode: plus-lighter` (HDR-clamped, Safari 16.4+; degrades to low-alpha warm overlay). The consumer writes `--mouse-x`/`--mouse-y` (%) on the host inline-style → mapped to typed `@property --specular-x/-y` (smoothed by a 150ms `--ease-standard` transition between samples). Intensity is a 3-rung @property cohort: `--glass-specular-intensity-rest:0`, `-hover:0.1`, `-active:0.16` (dark arm 0.08/0.12). THIS is the literal hardware to drive the 'hover brightens the stage' ask AND to give arrows/cards their lit-glass register. Set `--specular-intensity` higher on the hovered card to brighten it.

_Evidence:_ glass/material.css:65-136,150-236; tokens/property-regs.css:88,152-161; tokens/glass.css:357

### Glass refraction (the convex-lens 'liquid' read)

glass-ui ships `.glass-refract` (glass-refract.css) — a complete inline data-URI SVG filter `#glass-refract` (feImage displacement map from Apple's ⁴√ squircle profile + feDisplacementMap scale=28 + screen-blended specular). It composes OVER the blur via `backdrop-filter: var(--glass-blur-resting) var(--glass-refract-filter)` and is gated behind `@supports (backdrop-filter: url(#glass-refract))` (Chromium-only; WebKit/FF paint the plain blur — graceful). RE-HOMED at AW.W23 onto `.glass-material.glass-refract`. USE IT on the arrows + the front selection plate for the premium lens edge; keep it OFF the orbiting cards (the displacement map is resize-expensive — only `scale` animates without rebuilding). This is the single most 'liquid' primitive available.

_Evidence:_ glass-refract.css:42-61 (the shipped filter + @supports gate); glass-specular-track.css:22-25

### motion-core VT helpers (already the demo's path)

`@mkbabb/glass-ui/motion-core` exports `startViewTransition(mutate, {types?, instantUnderReducedMotion?})`, `navigate(asyncNav, {types?})`, `supportsViewTransitions()`, `supportsRouteTransitions()`. Returns `{finished:Promise<void>(never rejects), transitioned:boolean}`. `types` (Chrome 140+, absent FF144) tags the transition for `:active-view-transition-type(<t>)` CSS direction curves; feature-detected → degrades to one symmetric curve. The demo's useSceneTransition.ts already calls `startViewTransition(() => mutate(id))` then routes focus on `.finished`. The no-VT fallback path already cross-dissolves via useSceneSwap (SpringProgress on a sibling div's opacity+scale). The instant path is built into the helper (calls mutate synchronously when document.startViewTransition absent).

_Evidence:_ dist/composables/motion/useViewTransition.d.ts (full export surface); dist/useViewTransition-COsPjQVZ.js:16-45; demo/app/useSceneTransition.ts:1-39; demo/app/useSceneSwap.ts

### VT name discipline + existing scene-host wiring

App.vue scene host is `<div ref=sceneHostEl class='scene-host' tabindex='-1' :style='sceneSwapStyle'>` carrying `view-transition-name: scene-subject` (App.vue:461) wrapping a keyed `<Suspense>` over the lazy `<component :is>`. NO KeepAlive / NO wrapping <Transition> (both broke the async loader — a hard constraint). The VT MANDATE: ≤1 element per `view-transition-name` per state or the transition silently skips. For the spin-to-front shared-element morph use the 'dynamic name' technique: the clicked carousel card and the front selection slot share a transient `view-transition-name` (assigned on click, removed on `finished`), exactly the same-document-transitions pattern. glass-ui ships `view-transition.css` with the `.gl-list-item` group recipe (`::view-transition-group(.gl-list-item)` animation-duration `--vt-duration`/`--spring-bouncy-duration`(0.69s), timing `--vt-ease`/`--spring-bouncy`) + the `:only-child` slide-in/out for added/removed members + the PRM `animation:none` bracket + `::view-transition{pointer-events:none}`.

_Evidence:_ demo/app/App.vue:149-167,454-461; view-transition.css:27-67; same-document-transitions guide (dynamic name technique)

### Downlight cone — concrete CSS

Volumetric cone = a `clip-path` trapezoid (narrow top, wide base) on a div filled with a vertical `linear-gradient` from a low-alpha light at top to a brighter wash at the floor, plus a soft `blur()`/`mask` feather on the edges. Recipe: `.cone{ position:absolute; top:0; width:var(--cone-top-w); /* via clip-path the base flares */ clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%); background: linear-gradient(to bottom, hsl(0 0% 100% / calc(0.04*var(--stage-light,1))), hsl(0 0% 100% / calc(0.16*var(--stage-light,1)))); mix-blend-mode: screen; filter: blur(2px); will-change: opacity; }`. Floor pool = `.pool{ position:absolute; bottom:0; aspect-ratio:3/1; border-radius:50%; background: radial-gradient(ellipse at center, hsl(0 0% 100% / calc(0.9*var(--stage-light,1))) 0%, transparent 70%); filter: blur(6px); }`. The hover-brighten is ONE custom-property write: bump `--stage-light` from 1 → ~1.25 on the hovered item's stage and dim the front via a second `--front-dim` scalar. Use `@property --stage-light{syntax:'<number>';inherits:true;initial-value:1}` so it interpolates.

_Evidence:_ DK64 image geometry; CSS approach derived from the masks/gradients idioms; glass-ui @property pattern (property-regs.css)

### The ~15° downward tilt

One 3D-context wrapper: `.stage-3d{ perspective: 1200px; perspective-origin: 50% 30%; } .stage-plane{ transform: rotateX(15deg); transform-style: preserve-3d; transform-origin: center bottom; }`. Put the cone + floor pool + carousel ring on `.stage-plane` so they all share the tilt. The ring orbit then reads as a true elliptical orbit under the tilt (a circle rotateX-projected = an ellipse, which is exactly the DK64 ring read). Keep the front card counter-rotated (`rotateX(-15deg)`) if you want it to face the user flat while the ring stays tilted. modern-web `individual-transform-properties` guide confirms animating `rotate`/`translate`/`scale` independently (Baseline) is the performant path vs a monolithic matrix.

_Evidence:_ individual-transform-properties guide (id retrieved); DK64 ~15° downward-angle ask

### Carousel ring orbit — DOGFOOD the engine, NOT VT

The circular ring + spin-to-front is continuous rotation; VT crossfades RASTERIZED snapshots and is the WRONG primitive for it (glass-ui RETIRED its own `::view-transition-group(.gl-dock-layer)` morph for exactly this — 'taffy-stretch + text-blur + uncaptured-animating-ancestor desync', view-transition.css:50-61). Instead: orbit each card with the library's MotionPath/fromMotionPath sweeping `offset-distance` over a CSS `offset-path` ellipse (natural ring), and drive the spin-to-front + settle with SpringProgress (iOS response/dampingFraction — the overshoot reads alive). Use `stagger` for the per-card ring-index delay. This is the demo's culture (inv ζ: NO hand-rolled rAF; every loop rides RAFPlayback). VT is reserved for the DISCRETE moments (dropdown→stage entry, fade-into-scene-on-commit), not the rotation.

_Evidence:_ view-transition.css:50-61 (the retired dock morph lesson); CLAUDE.md engine surface (MotionPath/SpringProgress/stagger/RAFPlayback); demo inv ζ

### VT moment (a): dropdown → stage entry

Clicking the dock scene Select opens the stage. Wrap the open in `startViewTransition(() => openStage(), { types: ['stage-enter'] })`. Author the liquid-glass fade on `html:active-view-transition-type(stage-enter)::view-transition-new(stage-root){ animation: stage-bloom var(--spring-bouncy-duration) var(--spring-bouncy); }` with a keyframe that fades opacity 0→1 and eases backdrop-blur/scale (scale 0.96→1 reads as the glass 'inflating' in). The dropdown trigger and the stage can share a transient `view-transition-name` for a true morph-from-the-trigger if desired (anchor the stage's VT-name onto the trigger element pre-transition).

_Evidence:_ directional-navigation-transitions guide (types + :active-view-transition-type); tokens/scheme-motion.css:184,206 (--spring-bouncy + 0.69s duration)

### VT moment (c): fade-into-scene on commit

On final selection, the front card fades into the live scene. This is the EXISTING scene swap — reuse useSceneTransition.runSceneSwitch (already `startViewTransition(()=>switchScene(id))` with focus-routing on finished). To make the front carousel preview MORPH into the scene host, give the front preview a transient `view-transition-name: scene-subject` BEFORE the mutation (the host already owns `scene-subject`, App.vue:461) — then the snapshot of the front card morphs into the new scene paint. Remove the transient name on `.finished` to avoid the ≤1-per-name collision on the next switch.

_Evidence:_ demo/app/useSceneTransition.ts:31-36; App.vue:461 (view-transition-name: scene-subject); same-document-transitions Step 2 (dynamic name + cleanup on finished)

### Carousel scroll-driven option (if not a discrete ring)

If the ring is realized as a horizontal scroller rather than a MotionPath orbit, the carousel-slide-effects guide gives the native path: `animation-timeline: view(inline)` with a `@keyframes` that scales/fades each card 0.5→1→0.5 across the scrollport, gated behind `@supports ((animation-timeline: view()) and (animation-range: entry))`. Scroll-driven animations are LIMITED availability (Chrome 115/Safari 26, NO Firefox), so a fallback is required (Element.animate paused + scroll-listener driving currentTime). For THIS design the MotionPath/SpringProgress dogfood path is preferred (cross-browser, on-brand), with scroll-driven as a progressive garnish only.

_Evidence:_ carousel-slide-effects guide (id retrieved); carousel-snap-highlights guide

### Performance — off-stage previews

Apply `content-visibility:auto; contain-intrinsic-size: auto <w> auto <h>` to carousel cards NOT near the front (the far ring members) — the browser skips their layout/paint. CRITICAL: the demo ALREADY has the gating pattern — useSceneVisibilityPause.ts uses vueuse useDocumentVisibility to pause a scene's rAF/WebGL loop; the analogous `contentvisibilityautostatechange` event (efficient-background-processing guide) should pause each off-stage LIVING preview's animation loop (event.skipped → stop the preview's RAFPlayback; else resume). MANDATORY: pair content-visibility with contain-intrinsic-size or cards collapse to 0px and the ring jumps. Do NOT put content-visibility on the front/near cards (above-fold penalty).

_Evidence:_ defer-rendering-heavy-content guide; efficient-background-processing guide (contentvisibilityautostatechange, .skipped); demo/app/useSceneVisibilityPause.ts (the existing pause pattern to mirror)

### Performance — will-change budget + GPU compositing

Budget: set `will-change: transform` ONLY on the cards currently orbiting (the front + immediate neighbors), and REMOVE it when they settle (a permanent will-change on all 8 cards burns GPU memory). The cone + floor pool should be promoted to their own compositor layer (will-change:opacity or a transform:translateZ(0)) since their only animated property is the `--stage-light`-driven opacity — pure GPU, no layout. Animate ONLY transform/opacity/the typed @property scalars (the carousel guide + directional guide both mandate transform/opacity over inset/width to avoid layout thrash). The tilt's perspective/rotateX is a static transform (no per-frame cost). Avoid animating backdrop-filter blur radius per-frame (expensive) — scale the glass via the `--glass-level` knob or opacity instead.

_Evidence:_ carousel-slide-effects best-practices (compositor-only props); directional-navigation-transitions (animate transform not inset); glass ladder --glass-level seam (ladder.css)

### Anchor positioning — stage relative to the dropdown trigger

To tether the stage panel to the dock scene-Select trigger, the resilient-context-menus guide gives CSS Anchor Positioning: `position-anchor: --scene-trigger; position-area: block-start span-inline-end; position-try-fallbacks: flip-block, flip-inline`. BUT Baseline: anchor-positioning is NOT natively supported by any major browser yet (the guide's words) — requires the @oddbird/css-anchor-positioning polyfill (no implicit anchors, no position-area on popovers). RECOMMENDATION: the stage is a near-fullscreen theatrical takeover, NOT a small tethered popover, so a PORTAL/fixed-overlay (the Popover API `popover='auto'` → top layer, Baseline 2025-01-27) is the safer primitive than anchor-positioning. Use the VT morph (trigger→stage shared name) to give the 'grows from the dropdown' feel WITHOUT depending on un-shipped anchor positioning. Popover may need @oddbird/popover-polyfill on Safari<17.

_Evidence:_ resilient-context-menus-and-nested-dropdowns guide (anchor not natively supported; popover Baseline 2025-01-27 + polyfill); persistent-app-tours guide

### Reduced motion degrade — mostly free

glass-ui ALREADY ships the PRM brackets: view-transition.css:27-33 sets `animation:none !important` on all VT pseudos under PRM (the swap still runs, instantly); glass-specular-track.css:34-48 pins the specular static (`--specular-x/y:50%`, transition:none); the helper's `instantUnderReducedMotion` option (useViewTransition.d.ts) takes the JS instant path (NO snapshot captured) for navigation. ADD: under PRM, skip the MotionPath ring spin (snap the new front card directly), freeze `--stage-light` at 1 (no hover-brighten pulse), and disable the cone's any idle shimmer. respectReducedMotion is first-class in the demo culture. The existing useSceneSwap SpringProgress fallback should also short-circuit to an instant set under PRM.

_Evidence:_ view-transition.css:27-33; glass-specular-track.css:34-48; useViewTransition.d.ts (instantUnderReducedMotion); paper.css:62-67 (PRM grain guard)

### Light/dark — the theatrical-dark problem

The stage is intentionally DARK (black void, white cone). In DARK mode this is native. In LIGHT mode the default glass cream surface (--card warm-white) FIGHTS the theatrical read. SOLUTION: the stage backdrop must use an EXPLICIT dark scrim token (e.g. a `--stage-void: hsl(0 0% 4%)` painted UNDER the glass cone, NOT relying on the cream substrate), OR set `.glass-opaque` escape is wrong here — instead paint a fixed dark `::backdrop`/scrim div and keep the glass cards on top. glass-ui's overlay band already self-darkens over bright (the @container style(--glass-backdrop:light) AA tint), but the STAGE wants a CONSTANT dark regardless of theme — author it as a theme-invariant scrim with its own token, and let only the GLASS CARDS pick up the light/dark specular cohort (specular intensity is lower in .dark: 0.08/0.12 vs 0.1/0.16). The arrows + cards stay glass; the void stays dark in both themes.

_Evidence:_ ladder.css:115-152 (@container style(--glass-backdrop:light) AA darken), :200-219; tokens/property-regs.css:152-161 (dark specular cohort); glass.css:224,231 (edge-light light/dark)

### Glass tokens to reuse verbatim (no new values)

Springs (CSS linear() stops, ready): `--spring-bouncy`(0.69s, the VT default + spin-to-front settle), `--spring-snappy`(0.34s, crisp press/arrow), `--spring-smooth`(0.36s, hover scale), `--spring-dock`(0.28s). Easing doctrine (scheme-motion.css:153-180): ENTER=spring-bouncy/snappy, EXIT=ease-out/standard (no overshoot), SURFACE props (bg/opacity/color)=--ease-standard bezier, TRANSFORM hover/press=--spring-smooth, position-tracked specular=--ease-standard. Press scale: `--scale-press`(0.96)/`--scale-press-btn`(0.97). VT overrides: `--vt-duration`, `--vt-ease`, `--vt-rise`(8px). Specular size: `--glass-specular-size`(36% plate / 22% dock control). Apply these — do not invent new spring curves.

_Evidence:_ tokens/scheme-motion.css:182-208 (the 5 spring curves + durations), :153-180 (easing doctrine), :211-227; tokens/scale-paper.css:26-36; tokens/glass.css:357; view-transition.css:40-43

## Recommendations

- **[Material composition]** Stage shell = `.glass-overlay`; carousel cards = `.glass-floating`/`.glass-card`; arrows = glass control buttons (`.glass-floating` + `.glass-refract`) on the plate (CONTROL-on-plate is sanctioned, PANEL-on-panel is banned). Wire `--mouse-x/--mouse-y` on each card host to drive the existing `::before` specular; raise `--specular-intensity` on the hovered card via `--glass-specular-intensity-hover` to brighten it.
  - _Rationale:_ Zero new material recipes — reuses glass-ui's shipped, a11y-bracketed, light/dark-aware specular+rim+refraction system; respects the depth-3/contain:paint nesting budget gated by proof:glass-cohesion.
- **[Downlight rendering]** Pure-CSS hybrid: clip-path trapezoid + linear-gradient (cone, mix-blend-mode:screen, blur(2px)) and radial-gradient ellipse (floor pool) on a tilted `.stage-plane` (perspective:1200px + rotateX(15deg)). Drive brightness with ONE registered `@property --stage-light` scalar (hover bumps it ~1.25, front dims via `--front-dim`). Promote cone+pool to their own compositor layer (will-change:opacity).
  - _Rationale:_ CSS gradients+clip-path GPU-composite cheaply, need no SVG/canvas, and a single interpolable custom property gives the 'subtly brightens on hover' light-intensity behaviour the owner asked for without rAF.
- **[Motion architecture]** DOGFOOD the engine for the RING + spin-to-front (MotionPath/fromMotionPath over an offset-path ellipse + SpringProgress settle + stagger for ring-index delay, all on RAFPlayback). Reserve View Transitions for the DISCRETE moments only: (a) dropdown→stage entry via startViewTransition({types:['stage-enter']}), (c) fade-into-scene via the existing runSceneSwitch with a transient shared `scene-subject` VT-name on the front card.
  - _Rationale:_ VT crossfades rasterized snapshots — wrong for continuous rotation (the exact reason glass-ui retired its own dock-layer VT morph). Dogfooding the ring also satisfies the demo's inv ζ (no hand-rolled rAF) and showcases the library this demo exists to sell.
- **[Positioning / portal]** Render the stage as a near-fullscreen Popover-API top-layer overlay (Baseline 2025-01-27, +@oddbird/popover-polyfill for Safari<17), NOT CSS anchor-positioning. Give the 'grows from the dropdown' feel via a VT shared-element morph (trigger↔stage transient name), not anchor().
  - _Rationale:_ Anchor positioning is not natively supported in ANY major browser yet (per the modern-web guide) and would force a polyfill on the critical path; the stage is a theatrical takeover, not a tethered tooltip, so the top-layer portal + VT morph is both shipped-Baseline and visually superior.
- **[Performance gating]** Put `content-visibility:auto` + `contain-intrinsic-size: auto W auto H` on the far (off-front) ring cards; gate each LIVING preview's animation loop on `contentvisibilityautostatechange` (event.skipped → pause its RAFPlayback) mirroring the existing useSceneVisibilityPause pattern. Scope `will-change:transform` to only the actively-orbiting cards and remove on settle.
  - _Rationale:_ 8 simultaneously-animating live previews is the headline perf risk; content-visibility skips off-screen layout/paint and the event lets each preview pause its own loop just-in-time, while a bounded will-change avoids GPU-memory blowup.
- **[Light/dark theatrical read]** Paint the stage void as a THEME-INVARIANT dark scrim with its own token (e.g. --stage-void ~hsl(0 0% 4%)) UNDER the glass cards in BOTH themes, rather than inheriting the cream --card. Let only the glass cards/arrows pick up the light/dark specular cohort.
  - _Rationale:_ The DK64 look requires a dark stage; in light mode glass-ui's default warm-cream surface would destroy the theatrical contrast, so the void must be an explicit constant-dark layer while the glass chrome stays theme-reactive.
- **[Reduced motion]** Lean on glass-ui's existing PRM brackets (VT animation:none, specular pinned static) and additionally: under PRM snap the ring (no MotionPath spin), freeze --stage-light at 1, use the helper's instantUnderReducedMotion path for the stage entry, and short-circuit the SpringProgress fallback to an instant set.
  - _Rationale:_ Most of the PRM degrade ships for free in view-transition.css/glass-specular-track.css; only the new bespoke motions (ring spin, stage-light pulse) need explicit guards, and respectReducedMotion is a first-class demo requirement.

## Risks

- ⚠ **8 simultaneous LIVING previews (each a real keyframes.js scene-in-miniature, some Three.js/WebGL like Amiga) tank frame rate and battery on the ring.**
  - _Mitigation:_ content-visibility:auto + contentvisibilityautostatechange-gated loops on off-front cards; render distant ring members as a STATIC poster/last-frame snapshot and only wake the live loop for the front + immediate neighbors; cap concurrent live previews to ~3.
- ⚠ **VT name collisions: the transient `scene-subject` shared between front card and scene host, if not cleaned up on .finished, silently skips the NEXT transition (≤1 element per name per state).**
  - _Mitigation:_ Assign the transient view-transition-name immediately before the mutation and REMOVE it in `.finished.finally()` (the same-document-transitions cleanup contract); the helper's finished never rejects so cleanup always runs.
- ⚠ **backdrop-filter blur on a fullscreen tilted stage with refraction + multiple glass cards is GPU-expensive and can stack-muddy (the No-PLATE-on-PLATE failure) and may drop the refraction silently on WebKit/Firefox.**
  - _Mitigation:_ Keep .glass-refract ONLY on arrows + front plate (gated @supports, degrades to plain blur); cards use plain ladder rungs; honor the depth-3 nesting ceiling + contain:paint; the dark void is a flat scrim (no blur) so only the chrome blurs.
- ⚠ **Anchor positioning is not shipped in any browser; relying on it to tether the stage to the trigger would force a polyfill and could break placement.**
  - _Mitigation:_ Use a top-layer Popover portal + a VT shared-element morph from the trigger instead of anchor(); reserve anchor positioning only as a progressive nicety behind @supports(anchor-name).
- ⚠ **VT `types`/`:active-view-transition-type()` is Chrome 140+/Safari 18.2+ and ABSENT on Firefox 144 — directional stage-enter/exit curves won't apply there.**
  - _Mitigation:_ The helper feature-detects and degrades to one symmetric curve (functionally identical swap); author a sensible symmetric default so FF still gets a clean fade, with the directional fork as enhancement.
- ⚠ **The ~15° rotateX tilt can clip/foreshorten card hit-targets and break pointer hover math (the specular --mouse-x/y mapping assumes an untransformed plane).**
  - _Mitigation:_ Counter-rotate the front card to face the user; compute pointer→specular coordinates from the card's own getBoundingClientRect (post-transform box), not the tilted-plane coords; verify tap-target geometry in the running demo via chrome-devtools-mcp.

## Open questions

- Is the carousel ring realized as a true 3D MotionPath orbit (recommended, cross-browser, on-brand) or as a horizontal scroll-snap scroller (carousel-slide-effects, but scroll-driven animations have NO Firefox support)? This decides whether scroll-driven CSS or MotionPath+SpringProgress is the spine.
- Do all 7 scenes need a genuinely LIVE animated preview simultaneously, or can distant ring members be last-frame poster snapshots that wake on approach? This is the single biggest perf lever.
- Should the stage be a full-screen theatrical takeover (favors a top-layer Popover portal + VT morph) or a smaller panel anchored to the dock trigger (would want anchor-positioning, which is unshipped)? The owner's 'UI smoothly fades into the stage downlighting view' reads as full-takeover.
- What is the 'NEW idle animation state' per scene concretely — a slow ambient loop of each scene's hero motion, or a distinct micro-interaction? This affects the preview loop budget and whether stagger/Sequence orchestrates idle choreography.
- Does the owner want the spin-to-front to be a literal 3D barrel rotation of the whole ring (MotionPath sweep of every card) or just the clicked card flying to center while others reflow? The DK64 reference rotates the whole ring.
