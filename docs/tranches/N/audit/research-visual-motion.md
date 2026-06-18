# VISUAL + MOTION + INTERACTION design-language research

> Research lane brief — DK64 carousel scene-switcher (Tranche N), 2026-06-17.

## Summary

The DK64 barrel selector is a theatrical-spotlight UI: a top-wide→bottom-narrow downlight cone, a hot white floor-pool ellipse, ONE fully-lit protagonist standing in the pool, shadowed half-scale neighbours fading to black, a chunky bottom-centre name-plate, and two flanking prev/next arrows — depth read entirely through darkness. Translated to our idiom it becomes a deliberate dark theatre that reads in both themes via a smoked-glass backdrop-filter (blur+brightness-down over the dimmed live scene), a CSS radial/clip-path volumetric cone, an Instrument Serif name-plate, and crayon accent tints on the floor-pool rim per scene. The 7 scenes ride a horizontal turntable tilted ~15° toward the user (perspective + rotateX + per-item rotateY/translateZ at ~340px radius); front-centre + two flanks each side are visible, two rear items fade fully out, with scale/opacity/blur/brightness falloff by angle driven by ONE SpringProgress vector lane set — the engine's measured-cheap multi-channel mode (no hand-rolled rAF, inv ζ). The dropdown→stage bloom and the commit-into-live-scene are shared-element View Transitions over glass-ui's existing startViewTransition (already wired in useSceneTransition, with a SpringProgress cross-dissolve fallback in useSceneSwap), the stage hosted as a top-layer popover (@starting-style/overlay/allow-discrete) SEPARATE from the keyed Suspense scene host so the async-loader blocker can't recur. Every scene gets a new, cheap, engine-dogfooding idle loop (spring→needle, motion-path→traveller, easing→curve-draw, sequence→stagger wave, …), the two glassy arrows shimmer/swell/recoil to express intent, hover subtly brightens the hovered item +0.22 while de-emphasising the centre −0.12 via a translating fill-light, and reduced-motion + a11y (keyboard spin, focus routing, aria-live, 44px arrows) are first-class so every beat is gate-writable.

## Findings

### DK64 reference decomposition

FLOOR POOL: a hot white horizontal ellipse (~210x70px) at the cone base, the brightest element, a soft radial bloom the subject stands ON. SUBJECT (Diddy): fully lit, saturated, mid-idle-pose, centred in the pool, largest. NEIGHBOURS: two ~half-scale characters at the left/right edges dropped to ~25-35% brightness fading toward black silhouettes; a faint green '?' and a tiny dim character sit BEHIND the subject inside the cone (ring-depth cue). LABEL: 'DIDDY KONG' bottom-centre, chunky display caps, green->yellow vertical gradient + red drop-shadow (we keep the POSITION + weight, NOT the gradient). ARROWS: red-outline/yellow-fill chevrons flanking the label at the very bottom = prev/next. Black surround = the void that makes depth. Feeling: theatrical spotlight, single protagonist, depth via darkness.

_Evidence:_ reference image at /Users/mkbabb/Downloads/Donkey+Kong+64_Character+Barrel_2.png.webp

### Existing switch path to augment

The dock scene Select (ChromeDock.vue:269-305, reka-ui Select) emits @switch-scene -> App.vue runSceneSwitch(id). The scene host (App.vue:149-167) is a keyed <Suspense><component :is> in div.scene-host carrying view-transition-name: scene-subject (App.vue:461) + contain:paint (App.vue:469) + sceneSwapStyle. NO KeepAlive/Transition may wrap the Suspense (B.W3 async-loader blocker). warmScene(id) (scenes.ts:77) already hover-prefetches chunks — wire it to carousel hover.

_Evidence:_ ChromeDock.vue:269-305; App.vue:149-167,461,469; scenes.ts:77-80

### Engine primitives to dogfood (inv ζ)

SpringProgress VECTOR mode (spring.ts:480-613): setTargets(Float64Array)+tickVector(dt) steps K lanes in one buffer (2.97-3.78x over K scalars) — drives all 7 ring items in ONE spring. Defaults = iOS smooth: response 0.5, dampingFraction 0.86 (spring.ts:107-115); respectReducedMotion snaps/amplitude-scales. fromMotionPath (motion-path.ts:105-156) sweeps offset-distance 0%->100% over an author offset-path, WAAPI-eligible. stagger (stagger.ts:40,127) gives construction-time per-index delays with from:'center'|'edges' + ease reshape. NumericAnimation (numeric.ts) is zero-alloc keyframe interp for cheap idle loops. RAFPlayback is the ONE managed rAF driver every loop must ride.

_Evidence:_ spring.ts:480-613,107-115; motion-path.ts:105-156; stagger.ts:40,80,127; numeric.ts; src/animation/CLAUDE.md

### Our-idiom translation — palette, glass, type

Stage = deliberate dark theatre in BOTH themes: radial vignette near-black centre (oklch ~0.14) -> true black edges. Reads in LIGHT mode via a smoked-glass backdrop-filter blur(24px) saturate(0.6) brightness(0.35) over the dimmed live scene + a thin GlassPanel border on theme --border (not an opaque slab). CONE: radial-gradient(ellipse at top, oklch(0.95 0 0 /0.18), transparent 70%) clip-path: polygon(38% 0,62% 0,58% 100%,42% 100%) + mask-image edge feather + ~3% noise grain. FLOOR POOL: radial-gradient oklch(0.98 0 0 /0.5)->transparent, mix-blend screen. Name-plate = Instrument Serif --foreground clamp(1.5rem,4vw,2.4rem); Fira Code mono index '3 / 7'; crayon accent tints the pool rim per scene (cube->--face-*, amiga->--amiga-red, spring->--spring-lane-*). Redolent, not replicated — no pixel-art, no DK gradient.

_Evidence:_ design-idioms.css:78-120 (--rainbow-*,--amiga-red,--spring-lane-*,--color-progress); project CLAUDE.md design language

### Carousel ring geometry + falloff

7 scenes on a horizontal turntable tilted ~15deg toward user: parent perspective:1200px + rotateX(15deg); items translateZ(~340px) rotateY(angle), 360/7≈51.43deg spacing. VISIBLE: front (0deg) + 2 flanks each side (±51.4,±102.8deg); 2 rear (±154deg) fade fully out (the DK 'behind the subject' cue). FALLOFF by |angle|: scale 1.0->0.62->0.42; opacity 1.0->0.55->0.18->0; blur 0->2->5->8px; brightness 1.0->0.5->0.28->0. Z-order by cos(angle) so front paints last. Resting rotation snaps the selected item to 0deg. All 7 falloff channels ride ONE SpringProgress vector lane set.

_Evidence:_ 7 items=51.43deg; perspective+rotateX+rotateY turntable per modern-web css guide; spring.ts vector mode

### Spin-to-front choreography

Click a flank / press an arrow -> ring rotation target advances by the shortest signed angular delta to bring that item to 0deg, driven by ONE scalar SpringProgress on the rotation angle (response 0.55, dampingFraction 0.82 — a hair of overshoot = satisfying click-into-place). Adjacent step ~420-520ms perceived; a far jump uses the same spring so it feels physically consistent. During the spin each item's scale/opacity/blur/brightness re-derive per-frame from its live effective angle (no separate per-item animation), so the incoming item GROWS+BRIGHTENS into the pool while the outgoing DIMS+SHRINKS+BLURS — one coherent motion. Interruptible mid-spin: SpringProgress re-seats from current (x,v).

_Evidence:_ spring.ts:265-300 (set target re-seats continuously); shortest-angle turntable logic

### Two glassy arrows — express intent

Glass chevrons (GlassPanel+refract) flanking the name-plate, >=44px hit target. IDLE SHIMMER: a slow specular sweep across the glass every ~3.2s + a 6px directional drift loop (NumericAnimation 2.4s ping-pong, ±3px toward its direction) to telegraph prev/next. HOVER SWELL: scale 1.0->1.12 + glass brightness +18% + drift doubles to ±6px @1.4s (SpringProgress response 0.4 damping 0.7, tiny bounce). PRESS RECOIL: scale dips 0.92 then springs back through 1.06 to 1.0 (SpringProgress response 0.3 damping 0.55) + an 8px lunge in its direction that decays via decay() as the ring spins — the arrow throws the ring. PRM: shimmer/drift off, hover=opacity only, press=instant.

_Evidence:_ SpringProgress + decay (decay.ts closed-form glide) are LIGHT exports; glass-ui refract/specular; 44px per a11y guide

### Liquid-glass dropdown->stage transition

Stage = top-layer popover (@starting-style + transition-behavior:allow-discrete + overlay, animate-to-from-top-layer guide). Bloom = same-document View Transition (glass-ui startViewTransition, already in useSceneTransition): SHARED dynamically-assigned view-transition-name morphs the dock trigger label into the stage name-plate, cleaned on transition.finished. BEATS ~520ms: (0-120) dock pill refracts+scales 1.0->1.04, popover @starting-style fires (opacity 0->1, scale 0.92->1, backdrop blur 0->24px + saturate 1->0.6 = world goes smoky); (120-340) void darkens (::backdrop 0->0.55 allow-discrete) while the cone wipes ON top->bottom (clip-path inset 100%->0); (200-520) 7 ring items fan IN with stagger from:'center' (~60ms each) each on a small SpringProgress pop. Reverse on dismiss. PRM: cross-fade only, transform:none, 0.1s.

_Evidence:_ animate-to-from-top-layer guide (@starting-style/overlay/allow-discrete Baseline 2024-08); same-document-transitions guide (shared name morph + finished cleanup); useSceneTransition.ts; stagger.ts:80-81

### Hover-brighten + focus-shift quantified

Hovering a NON-front item (SpringProgress response 0.35 damping 0.85): hovered item brightness +0.22 (flank 0.5->0.72) + scale +0.06; SIMULTANEOUSLY front-centre brightness -0.12 (1.0->0.88) and a secondary dimmer fill-light radial pool (oklch(0.9 0 0 /0.12)) translates ~40% from centre toward the hovered item's screen-x over 280ms. The global cone stays put; only the fill pool + per-item brightness move, so it reads as attention turning, not camera moving. mouseleave returns to rest in ~300ms. Hover also fires warmScene(id) + a 'closer look': the item lifts translateZ +28px out of the ring plane. PRM: brightness deltas only, no translate, instant.

_Evidence:_ owner ask verbatim; SpringProgress (spring.ts); warmScene (scenes.ts:77)

### Per-scene idle states (7 + front living preview)

Each preview gets a NEW idle loop (NumericAnimation/SpringProgress on RAFPlayback, paused off-screen, transform/opacity/filter only). CUBE: slow continuous tumble (rotateY+rotateX ~0.15 rev/6s, --face-* colors), hover 2x. AMIGA: Boing-ball sine hop (translateY 0->-18->0, squash scaleY 0.9 at floor, ~1.8s, checkerboard hue cycling). SQUARE: a box that breathes (border-radius 8<->20px + 2deg rock) and is grabbable on hover (decay() fling). EASING: a bezier curve that draws itself (stroke-dashoffset L->0, DrawSVG-style) then a ball traces it, ~3s loop. SPRING: a SpringProgress needle flicking to a random target every 2.5s and ringing to rest (overshoot visible — dogfoods the primitive). SEQUENCE: 3-4 dots staggered up in a wave (stagger from:'first', each 120ms) then fade. MOTION-PATH: a traveller sweeping an offset-path figure-8 (fromMotionPath, rotate:auto banks it). FRONT living preview = same loop at full brightness/scale + interactive; the selected scene's idle is its 'wake' pose.

_Evidence:_ scenes.ts ids; engine primitives map 1:1; demo/CLAUDE.md scene table (CubeScene 3D cube, AmigaScene Boing ball, etc.)

### Selected->active handoff

On commit (click front item / press enter): (1) ring spring settles chosen item to 0deg; (2) lock-in beat — floor pool +0.15 brightness one pulse (240ms), name-plate 1px weight/letter-spacing settle; (3) stage dismisses via the reverse liquid-glass VT — the front preview's view-transition-name is shared with the scene-host's existing 'scene-subject' so the preview MORPHS into the mounted live scene. runSceneSwitch(id) fires inside the VT mutate() so the keyed Suspense swaps the chunk; useSceneSwap's SpringProgress cross-dissolve is the no-VT fallback (already wired). State preserved: sceneMachine context (persists to localStorage) + per-scene stores mount the destination with its prior animation-group state; the idle 'wake' is the entry. Focus routes to scene-host on finished (useSceneTransition.ts:33). PRM: instant swap, no morph.

_Evidence:_ App.vue:461 scene-subject name; useSceneTransition.ts:31-36; useSceneSwap.ts; sceneMachine.ts persistence

### Compositor performance budget (7 live previews)

Mitigations, all gate-able: (a) only the ~5 visible items run idle loops, the 2 rear (opacity 0) paused (mirrors useSceneVisibilityPause). (b) per-item anims are transform/opacity/filter ONLY; will-change:transform applied during a spin and REMOVED at rest (never left on). (c) ring rotation + all 7 falloff lanes + hover deltas ride ONE SpringProgress vector (tickVector) — one rAF, one buffer write, not 7 springs. (d) backdrop-filter blur applied ONCE on the void backdrop, not per item; scene-host already contain:paint (App.vue:469). (e) idle loops PAUSE during the open/close VT (the guide warns active animations freeze during a VT). Cap rear blur at 8px (>~10px backdrop blur tanks the slow Linux CI runner).

_Evidence:_ spring.ts vector mode; App.vue:469; same-document-transitions guide ('DO NOT transition elements with active animations'); MEMORY project_ci_device_dependence_greening

## Recommendations

- **[One vector spring for the whole ring]** Drive ring rotation (scalar spring) + the 7 items' (scale,opacity,blur,brightness) falloff + hover-brighten deltas through SpringProgress vector mode (setTargets/tickVector) on ONE RAFPlayback. Re-derive each item's visual state per-frame from its live effective angle rather than animating each item independently.
  - _Rationale:_ Dogfoods the engine (inv ζ — no hand-rolled rAF), gives interruptible-mid-spin continuity (spring re-seats from current x,v), and is the measured 2.97-3.78x cheaper path that keeps 7 live previews within the compositor budget on the slow CI runner. One physics law governs the whole ring, so the motion reads coherent.
- **[Liquid-glass transition via shared-element VT]** Use glass-ui's startViewTransition (already in useSceneTransition) with a SHARED, dynamically-assigned view-transition-name between the dock trigger label and the stage name-plate (open) and between the front preview and the scene-host's existing 'scene-subject' name (commit). Clean temporary names up on transition.finished. The 'liquid' is a backdrop-filter blur+saturate ramp, not a literal shader.
  - _Rationale:_ Reuses the substrate's exact VT machinery and the scene-host's existing view-transition-name, so the morph composites on the compositor thread with the SpringProgress cross-dissolve already wired as the no-VT fallback. The shared-element morph IS the dropdown 'bloom' and the preview 'fade into' the live scene — the owner's two headline beats — with zero new transition framework.
- **[Per-scene idle states as engine showcases]** Author each of the 7 idle loops to dogfood the primitive its scene teaches (spring->SpringProgress needle, motion-path->fromMotionPath traveller, easing->DrawSVG curve-draw, sequence->stagger wave, cube->3D tumble, amiga->Boing hop, square->decay fling), transform/opacity/filter only, one animation per item, paused when not visible. The front living preview is the same loop at full intensity + interactive.
  - _Rationale:_ Each preview becomes a tiny advertisement for the library feature behind it — on-brand (the demo's whole purpose is showcasing keyframes.js), cheap, and visually distinct per the owner's ask. Visibility-gating + compositor-only properties keep all 7 within frame budget.
- **[Reduced-motion as a first-class, gate-written path]** Give every motion (open bloom, ring spin, arrow shimmer/swell/recoil, hover-brighten, idle loops, commit morph) a defined PRM degrade: snap/cross-fade only, no transforms, <=0.1s, idle loops static at a representative pose. Use SpringProgress respectReducedMotion (snap or amplitude-scale) + the ::view-transition-* {animation:none} rule already in glass-ui view-transition.css. Write a wave gate asserting each motion has a PRM branch.
  - _Rationale:_ respectReducedMotion is engine-level first-class here, the retrieved guides mark it MANDATORY, and the demo's proof:* gate culture expects every motion born with its reduced-motion contract. Quantifying the PRM pose for the idle loops prevents 7 silently-frozen-mid-frame previews.
- **[a11y — keyboard, focus, tap targets, announcement]** Make the carousel keyboard-operable (ArrowLeft/Right spin prev/next, Enter commits, Esc dismisses), arrows >=44px, focus routed into the stage on open and back to the dock trigger on dismiss (scene-host on commit, already done), with an aria-live region announcing the front scene ('Now showing: Spring, 5 of 7'). Treat the ring as a listbox/radiogroup. Brightness/blur falloff must NOT be the only selection signal — the name-plate + aria-live + a focus ring carry the truth.
  - _Rationale:_ The accessibility and same-document-transitions guides mark focus routing MANDATORY for view transitions; a hover-only spotlight fails the demo's a11y gate culture (MEMORY gate-blindspots: green source-shape gates miss interaction/state — audit the running demo). Brightness is decorative reinforcement, not a contrast-safe indicator.
- **[Stage hosting topology]** Host the stage as a top-layer popover SIBLING to the scene host, never as a wrapper around the keyed Suspense. Invoke it from the dock scene-Select trigger following the App.vue @mbabb pattern (synthesise click on pointerdown, kill trailing native click) and surface stage-open to ChromeDock's dock-hold mutex (the itemsPopupOpen pattern) so the dock stays expanded while the stage is open.
  - _Rationale:_ Wrapping the Suspense re-breaks the async scene loader (B.W3 blank-viewport blocker), and the dock trigger's :active press-scale historically swallowed pointerup (BLK-8/D9) — both are recorded footguns the existing fix patterns already neutralise.

## Risks

- ⚠ **Wrapping the keyed Suspense in any Transition/KeepAlive to host the carousel re-breaks the async scene loader (B.W3 headline blocker — blank viewport, chunk never fetched).**
  - _Mitigation:_ The stage is a SEPARATE top-layer popover sibling to the scene host. The commit VT mutates the scene-id inside startViewTransition's callback exactly as runSceneSwitch does today; the bare Suspense stays untouched.
- ⚠ **overlay (the top-layer transition property) is Chromium-only (unsupported in Firefox/Safari); @starting-style/transition-behavior are Baseline but overlay is not.**
  - _Mitigation:_ overlay is a progressive-enhancement nicety (prevents premature exit clipping) — without it the popover still opens/closes, just without the held-in-top-layer exit polish. Feature-detect CSS.supports('overlay','auto'). View Transitions themselves are Baseline 2025-10 and degrade to instant swap.
- ⚠ **A view transition operates on snapshots and freezes active animations during the transition (same-document guide), so the ring/idle loops would visibly hitch during the open/commit morph.**
  - _Mitigation:_ Pause all idle loops + the ring spring at the start of the VT and resume on finished. Sequence the commit so the spin SETTLES (morphing elements at a stable resting pose) before the dismiss VT captures.
- ⚠ **The dock scene-Select press-scale (:active scale .96) historically swallowed pointerup and broke trigger actuation (BLK-8/D9); reusing that trigger to invoke the stage could re-trip it.**
  - _Mitigation:_ Follow the App.vue @mbabb fix (synthesise click on pointerdown, kill trailing native click) or invoke from a distinct affordance; surface stage-open to ChromeDock's dock-hold mutex (itemsPopupOpen) so the dock stays expanded.
- ⚠ **Brightness/blur falloff as the primary 'which item is selected' signal fails color-contrast and is invisible to AT — a green source-shape gate would miss it (MEMORY gate-blindspots).**
  - _Mitigation:_ The name-plate (Instrument Serif), the mono index counter, an aria-live announcement, and a discrete focus ring on the front item carry the selection truth; brightness is decorative reinforcement only.
- ⚠ **7 simultaneous idle loops + ring rotation + backdrop-filter blur could blow the frame budget, especially on the slow Linux CI runner where absolute frame/ms thresholds fail (MEMORY ci-device-dependence).**
  - _Mitigation:_ Visibility-pause the 2 rear items, transform/opacity/filter-only animations, ONE vector spring for the ring, single backdrop-filter on the void (not per item), cap rear blur at 8px, will-change only during active spins. Gate on relative not absolute frame thresholds where possible.

## Open questions

- Invocation: replace the dock scene-Select dropdown entirely with the stage, or keep the Select for quick switching and add a 'browse' affordance that opens the stage? (Affects whether the BLK-8 press-scale path is touched.)
- Mobile/touch: the ~15deg tilted 3D turntable + hover-brighten assume a pointer and width — what is the phone-narrow layout (a flat swipeable carousel? the existing mobile stage sheet?) and does hover collapse to focus/tap there?
- Does the front 'living preview' run the FULL live scene component (heavy — Three.js for amiga, Monaco-adjacent for editor scenes) or a lightweight idle proxy, and at what point does the real chunk mount (on hover-warm, on spin-to-front, or only on commit)?
- Scope of 'each animation gains a NEW idle state': is the idle loop ONLY in the carousel preview, or does the live mounted scene ALSO gain a persistent interactive idle when at rest (the owner's wording suggests the latter — a per-scene change beyond the switcher)?
- Light-mode treatment: is a near-black smoked-glass theatre acceptable UX in light mode, or should light mode use an inverted 'bright studio' lighting model (dark cone on light void) — needs a TASTE call against the owner's 'still reads in light mode' ask?
