# Square scene — frontend-design treatment

> Scope: `demo/app/scenes/SquareScene.vue` + `demo/square/useSquareAnimations.ts`, riding the demo design language (`demo/@/styles/{style.css,design-idioms.css,brand.css}`, `demo/DESIGN.md`) over `@mkbabb/glass-ui` tokens. This is a PROPOSAL — no source is written outside this doc.

---

## §Aesthetic direction

**The bold POV: a SPRING-LOADED INSTRUMENT PLATE.** Not a toy box on a card — a calibrated physics rig you operate. The square scene exists to prove ONE library primitive: a *custom transform function reading deeply-nested object vars* (`transform.a.b.c.d`) driven live by two per-axis springs. So the page must read like the bench instrument that primitive deserves — an engineering-graph field, a tethered crosshair, a numeric telemetry strip, and a subject that visibly *fights back* against your hand. The aesthetic register is **instrument-deco**: the demo's existing Instrument-Serif display voice + Fira Code telemetry, pushed toward a draughtsman's measuring rig — quarter-tick coordinate frames, a tether line from home to subject, a live readout that *is* the colour.

**The ONE unforgettable thing:** you grab the box and a **taut elastic tether snaps into view** between its home centre and your pointer — the box lags behind your hand on its spring, the tether bows and stretches, and the deeper you pull the more the box *swells and tilts into the pull* like it has mass. Release, and the tether recoils the box home with a visible overshoot. **The drag has a rubber band.** Nobody forgets a UI that pulls back.

This is the right signature *for this page specifically*: keyframes.js IS a CSS-animation engine, and the square's whole reason to exist is the live spring chase feeding a nested-object transform every frame. Making the spring *visible as a physical tether* dogfoods the exact primitive the scene proves — the design signature and the library feature are the same artifact.

---

## §Current-state audit (generic/weak vs the SOTA bar)

The square scene is the **barest** of the seven scenes — and not in a confident-minimal way, in an *unfinished* way. Concretely, against the SOTA bar and against its own siblings:

1. **No telemetry, no header — the page is a single word on a plate.** `SquareScene.vue:10-33` is a `Card` containing exactly one `<div>` reading "drag me". Compare `SpringTarget.vue:33-52`: a display-rung scene title (`SpringProgress`), a live primary readout (`.spring-readout-primary` wearing the scene accent), a status badge (`settled`/`tracking`), a velocity caption. The square *computes* `springReadout.x/.y` (`SquareScene.vue:138-139`) purely for `aria-valuetext` and **never shows them to a sighted user**. The single most distinctive datum this scene owns — two springs chasing two targets through a nested transform — is invisible. That is the AI-slop "looks done, says nothing" failure.

2. **No coordinate frame — the box floats on blank glass.** Spring's rail carries `.stage-field-x` (quarter ticks, `design-idioms.css:588-594`); the easing/sequence stages carry `.stage-field-y`. The square — the one scene that is *literally a 2-axis coordinate space* (`nx, ny ∈ [-1,1]`, `SquareScene.vue:132-135`) — has NO field at all. `overflow: hidden` on `.square-stage` (`:192-196`) is the only stage treatment. A 2D drag arena with no axes is the clearest "designer didn't finish" tell on the page.

3. **The drag is invisible while it happens.** The spring lag is real (`useSquareAnimations.ts:46-47`, response 0.32 / ζ 0.62) but reads as a vague wobble. There is no tether, no trail, no deflection cue beyond a 1→1.12 scale swell (`:120`) too subtle to notice. The single best interaction on the page is under-sold to the point of looking like a plain `position: absolute` drag.

4. **The egg sweep is a LOVED violet→green ramp wearing raw hex — keep the colours, source them honestly.** `EGG_HUES = ["#C462D8","#7E6BE8","#52E898"]` (`useSquareAnimations.ts:83`) and the contract keyframes (`:209-215`) are **raw hex literals** — three of the very few in the scene corpus. This is NOT a palette to abolish: the violet→green tumble ramp is a genuine signature delight and it lives in the SAME family as the demo's loved crayon spectrum (the `--rainbow-*` six, `design-idioms.css:78-90`). The only real defect is *provenance, not hue*: three literals that must be kept byte-identical to `--subject-teal: #52E898` (`design-idioms.css:240`) by hand, drifting silently. The fix is therefore a **source move, not a colour kill** — point the exact-same sweep at the `--rainbow-violet → … → --rainbow-green` tokens so the pixels are preserved (the rainbow tokens ARE the spectrum the demo already paints) and the rest-hue/landing-hue stay one identity by construction. The crayon primaries and this rainbow sweep are the demo's *sanctioned* multi-colour pop and they STAY; what changes is that the egg now reads off the named family instead of dangling three drift-prone literals.

5. **The subject is generic.** A 12rem solid-fill rounded square with `box-shadow: 0 0 0 0.5rem` halo (`SquareScene.vue:216-218`). It has the `--radius-lg` corner and the teal fill and nothing else — no depth, no material, no edge light. Against glass-ui's offset-stamp cartoon surfaces and the graph substrate, the box reads flatter than the chrome around it. The protagonist is the least-designed element on its own stage.

6. **"drag me" type is doing affordance work but not identity work.** It correctly lifts to `text-display` (`:21`, the J.W7a S2 decision) — good — but it's static. The one word of display serif never reacts to the drag it's inviting.

**What's already RIGHT (preserve):** the glass `Card` stage register (I5), `:shadow="false"`, the `select-none` + `useDragScrub` gesture seam, the `role="slider"` + keyboard nudge a11y, the single-paint-authority discipline (one spring loop, no double-writer), `will-change: transform`, `touch-action: none`. The bones are correct; the scene is under-dressed.

---

## §Refinements

Each item is concrete, respects the cascade ownership rules (tokens in `design-idioms.css`/`style.css`, scene rules in `SquareScene.vue` scoped block, motion in `useSquareAnimations.ts`), and extends the language rather than swapping it.

### TYPOGRAPHY

- **Add a telemetry strip in the existing display+mono register.** Mirror `SpringTarget.vue:33-52` exactly — do NOT invent a new type system. In `SquareScene.vue` template, above the box inside the `Card`, add an absolutely-positioned top-left header:
  - Scene title `transformFunc` (or `Transform` — matches `anim.name`) at the `text-display` rung (Instrument Serif), `leading-none`.
  - A two-axis readout where `x` / `y` labels are `text-mono-small text-muted-foreground` and the **values wear the scene accent** via `.readout-accent` (`design-idioms.css:564-566`) — the existing "the number that proves the engine runs carries the colour" idiom. Bind to `springReadout.x/.y` (already reactive, `:82`).
  - A `.status-badge` pair (`design-idioms.css:620-641`): `settled-badge` when both springs `.settled`, `tracking-badge` while chasing. This reuses the proven AA-contrast lineage; zero new CSS.
- **Make "drag me" breathe with the gesture.** Keep `text-display`. Add a scoped rule: while `.demo-box--dragging`, letter-spacing opens slightly and the word fades toward the box ink — a one-line `transition` on `letter-spacing` + `opacity`. The label *is* the affordance (the J.W7a S2 thesis); now it acknowledges being grabbed.

### COLOR

- **KEEP the violet→green egg sweep; re-source it onto the rainbow family by construction (provenance fix, not a colour kill).** The three `EGG_HUES` hues (`useSquareAnimations.ts:83`) and the contract-keyframe stops (`:209-215`) are KEPT — they are a loved signature and they already match the rainbow spectrum the demo paints elsewhere. The change is purely *where the bytes come from*: resolve `--rainbow-violet → --rainbow-cyan → --rainbow-green` (the demo's chosen 3-stop slice of `--rainbow-*`, `design-idioms.css:78-90`) once at module/mount via `getComputedStyle(document.documentElement)` into the existing `EGG_HUES` array shape. The lerp math is untouched; the pixels are preserved (these tokens ARE the spectrum). **Result:** the same beloved tumble ramp now rides the demo's sanctioned crayon family — one named source, zero drift-prone literals, the rainbow pop firing exactly where it earns its place (the double-click tumble easter egg), nowhere else.
- **Re-home `--subject-teal` as a derived rest hue, not a hardcoded terminal stop.** Today `--subject-teal: #52e898` (`design-idioms.css:240`) is a literal that must be kept byte-identical to `EGG_HUES[2]` by hand. Repoint it to the *same* rainbow token the egg now terminates on (e.g. `--subject-teal: var(--rainbow-green)`), so the box's rest hue and the egg's landing hue stay one identity by *construction* (the original D13 goal) without a second literal to drift.
- **Give the box a two-tone material, not a flat fill.** Keep the teal identity but add depth: a subtle top-down `linear-gradient` in `oklab` from `color-mix(in oklab, var(--subject-teal) 100%, white 8%)` to `var(--subject-teal)` plus an inset edge-light (`box-shadow: inset 0 1px 0 …`). This reads as a physical chip under the graph light, coherent with glass-ui's material vocabulary — not a theme swap.
- **The halo becomes a deflection-reactive aura.** The existing `box-shadow: 0 0 0 0.5rem color-mix(... --background ...)` (`:218`) is static. Drive its spread + a faint accent ring off the live deflection: at rest it's the quiet background halo; under a hard pull a thin `--color-progress` (the red motion authority) ring blooms — tying the subject to the system's *one* motion colour at exactly the moment motion happens.

### MOTION

- **The signature: a live elastic TETHER (see §The one unforgettable moment).** A dedicated SVG or pseudo-element line from home-centre to box-centre, bowed by deflection, visible only while `dragging` or while springs are un-settled. Drawn in `--color-progress` (the red authority) at low alpha. This is net-new motion *that visualises the exact primitive the scene proves*.
- **Tilt into the pull.** Extend the nested transform (`useSquareAnimations.ts:115-130`) to add a small `rotate` proportional to the *horizontal* spring velocity (not the egg's full barrel-roll `rotate` — compose additively, preserving the single-paint-authority). The box banks like it has inertia. The spin egg already owns `transform.rotate`; add a separate small lean term so a drag-tilt and a tumble-spin sum cleanly in the one `transformFunc`.
- **Squash-and-stretch the swell.** The current isotropic `scale` swell (`a.b.c.d`, 1→1.12, `:120`) is the *nested-object proof* — keep that channel. ADD a directional stretch: scaleX/scaleY skewed by the pull direction so the box elongates *along* the drag and pinches across it — classic animation squash-stretch, sold through the same custom transform. This makes the nested-object primitive visibly *do more* while staying the one paint authority.
- **Recoil overshoot on release.** Already present in spirit (persist policy + spring chase), but make it legible: on `Home`/`End` recenter the tether *snaps* and the box overshoots home then settles — the spring's natural ζ 0.62 already does this; the tether makes it *visible*.

### SPATIAL

- **Lay a coordinate field on the stage — the scene's missing axes (MATHEMATICS pillar, amplified).** Add the shared `.stage-field-x` AND a centred crosshair to `.square-stage` (`SquareScene.vue:192`). The square is a true 2D space; it earns BOTH axes (Spring uses only `-x`). Draw a faint centre crosshair (the `(0,0)` home) and quarter-tick frame using the same `var(--border)` hairline language (`design-idioms.css:579-594`) so the stage matches the easing-curve canvas and spring rail by construction. Now the drag reads *against graduated space*, and the home point is marked. **Easter-egg overlay (proportionate, opt-in):** when the springs are un-settled, a faint phase-trace ghost — the box's recent (position, velocity) path plotted against the graticule at very low alpha — can bloom for the dwell of the chase and fade on settle. This is the spring math made *beautifully visible* (the four-pillar mandate) layered ON the existing crosshair frame, never replacing it; it is a quiet draughtsman's annotation, not a chart that takes over the plate.
- **Break the dead-centre symmetry deliberately.** The box is geometric-centre by construction (SQ-1 fix). Keep that for the box, but anchor the telemetry strip top-left and a small axis-label legend (`x` / `y`, `[-1, 1]`) bottom-right — asymmetric chrome around a centred subject is the instrument-plate composition, not a floating toy.
- **Generous, intentional negative space.** The graph field + crosshair fill the plate with *structure*, so the box can stay small (12rem) inside a large field and read as a precise instrument rather than a cramped widget. Density at the edges, calm at the centre.

### MICRO-INTERACTIONS

- **Hover-arm.** Before grab, on `:hover` the box lifts a hair (the `--scale-hover` idiom, `design-idioms.css:118`) and the crosshair brightens — the rig "powers on" under the pointer.
- **Grab-pulse.** On `pointerdown`, a one-shot ring pulse from the box edge (a single keyframe, PRM-guarded) confirms capture — tactile feedback the moment the tether engages.
- **Quarter-tick snap-glow.** As the box's normalized target crosses a quarter mark (±0.25/±0.5/±0.75), the corresponding field tick flashes briefly — the instrument shows you where you are in its coordinate space.
- **Settle blink.** When both springs cross into `.settled` (`useSquareAnimations.ts:140`), the status badge flips `tracking → settled` and the readout values do a single subtle scale-tick — the "measurement locked" beat.
- **Tumble teaser.** Since double-click tumbles (the egg), add a tiny `text-mono-caption text-muted-foreground` hint near the legend ("double-click to tumble") that only appears after the first successful drag-settle — progressive disclosure of the easter egg.

### BACKGROUND

- **Let the box refract the substrate.** The page already draws the two-tier engineering graph paper (`EditorShell.vue:213-233`, `--graph-pitch`/`--graph-major`). The square plate currently just `overflow: hidden`s over it. Add a `--stage-field-tint` (`design-idioms.css:272`, 4%) accent wash to `.square-stage` keyed to the *current deflection* — at rest neutral, under a pull a faint `--color-progress` field-tint blooms behind the subject, so the whole stage breathes with the drag. This reuses the existing per-stage field-tint idiom (MP-OPP1 lineage) rather than inventing atmosphere.
- **Crosshair as depth, not decoration.** The centre crosshair + quarter ticks ARE the background structure — the glass plate finally has something to refract against on *this* stage (the W6-3 substrate-depth thesis, applied locally). No noise/grain needed; the graph paper already carries the draughtsman grain.

---

## §The one unforgettable moment

**THE RUBBER-BAND TETHER.**

You press the box. An elastic line snaps taut between its home crosshair and your pointer, drawn in the red motion-authority colour at low alpha. As you drag, **the box lags behind your hand on its spring** — the tether *stretches and bows*, taut as a slingshot. The box **banks into the pull** (velocity-tilt) and **stretches along the drag axis** (squash-stretch through the nested-object transform), so it visibly has mass and direction. Pull to a quarter mark and that field tick **flashes**. Release: the tether **recoils**, the box **overshoots home and settles** on its ζ 0.62 spring, and the status badge blinks `tracking → settled`.

It is unforgettable because it makes the *invisible visible*: the two springs feeding the nested-object transform — the exact primitive this scene exists to prove — become a physical rubber band you can feel pulling back. The design signature and the library feature are **one artifact**. This refines the scene's existing draggable subject (the `useDragScrub` seam + the ζ 0.62 spring chase that already exist) — it does not re-theme the page. The tether is a *derived read* of state the scene already computes, drawn at low alpha in the system's own red motion-authority; it amplifies the four pillars (MATHEMATICS made visible, the instrument-deco TYPOGRAPHY register) rather than introducing a new aesthetic. It earns the page's signature moment by proportion: one taut line that appears on grab and recoils on release, quiet at rest.

(Every motion guard stays: PRM collapses the tether/tilt/stretch to an instant snap, the single spring-loop paint authority is preserved, the tether is a derived read of existing spring state — no second rAF, no second writer.)

---

## §Implementation plan (priority order)

**P0 — Tell the truth about the springs (telemetry + axes). Highest impact, lowest risk, pure reuse.**
1. `SquareScene.vue` template (`:10-33`): add the top-left header — `text-display` title + two `.readout-accent` axis values (bind `springReadout.x/.y`, already reactive `:82`) + `.status-badge` settled/tracking pair driven by `springX.settled && springY.settled`. All idioms exist (`design-idioms.css:564,620-641`); zero new CSS.
2. `SquareScene.vue` scoped `.square-stage` (`:192-196`): add `.stage-field-x` + a centred crosshair + quarter-tick frame using `var(--border)` hairlines (mirror `design-idioms.css:588-594`). Add a bottom-right `x`/`y` `[-1,1]` legend.

**P1 — The signature tether + reactive subject.**
3. `useSquareAnimations.ts`: expose live `springX.value`/`springY.value` deflection (already returned) to the scene; in `SquareScene.vue` add an SVG/pseudo tether line home→box driven by those values, visible while `dragging || !settled`, stroked in `--color-progress` low-alpha. PRM-guarded.
4. `SquareScene.vue` `.demo-box` (`:198-224`): two-tone `oklab` gradient fill + inset edge-light; deflection-reactive halo (static→accent ring under pull); `:hover` arm-lift via `--scale-hover`.

**P2 — Motion enrichment through the one transform.**
5. `useSquareAnimations.ts:115-130`: add a velocity-proportional `rotate` lean term + directional squash-stretch (scaleX/scaleY) into the nested-object `transformFunc`, composing additively with the existing isotropic `a.b.c.d` swell and the egg spin (preserve single-paint-authority).
6. `SquareScene.vue`: grab-pulse keyframe on `pointerdown`, quarter-tick snap-glow, settle-blink — all PRM-guarded one-shots.

**P3 — Palette reconciliation (the named cross-repo cleanup) + atmosphere.**
7. `useSquareAnimations.ts:83,209-215`: KEEP the violet→green egg hues; re-source them from the `--rainbow-*` family (resolve tokens at mount; lerp unchanged — pixels preserved). `design-idioms.css:240`: repoint `--subject-teal` to the matching `--rainbow-*` token so rest-hue and egg-landing stay one identity by construction. This is a provenance cleanup, not a palette change — the crayon/rainbow pop is loved and stays.
8. `SquareScene.vue` `.square-stage`: deflection-keyed `--stage-field-tint` accent wash (`design-idioms.css:272`).
9. `SquareScene.vue`: progressive "double-click to tumble" hint after first drag-settle.

**Touch list:** `demo/app/scenes/SquareScene.vue` (template + scoped style — most changes), `demo/square/useSquareAnimations.ts` (transform enrichment + palette reconcile), `demo/@/styles/design-idioms.css` (one token repoint: `--subject-teal`). No new files; no glass-ui patches; every new visual reuses an existing demo idiom or the sanctioned rainbow/red palettes.

**Guards to honour throughout:** single spring-loop paint authority (no second rAF/writer); PRM snap-collapse on tether/tilt/stretch/pulses; `prefers-reduced-motion` global bracket already drops `scale`/`transform` transitions; tokens live in `design-idioms.css`/`style.css`, scene rules in the SFC scoped block (per the cascade-ownership contract); the rainbow family is the ONLY sanctioned multi-colour pop, red is the motion authority — the egg rides rainbow, the live drag rides red.

---

## §Design verdict reconciliation

The fleet-wide design verdict is binding; this treatment was *already* mostly aligned (it folded the egg sweep into the rainbow family rather than killing it). The revisions made here, and what they reverse or temper:

- **REVERSED the "orphan / off-system / replace" framing on the egg palette (audit §4, COLOR clause 1, plan step 7).** The original prose read as crayon-adjacent abolition ("exists nowhere else", "orphaned", "*replace* the three raw `EGG_HUES` literals"). Per verdict #1 (KEEP THE CRAYON PRIMARIES — the user loves `rgb(255,0,0)` and the `--rainbow-*`/`--accent-red` tokens), the violet→green tumble ramp is now explicitly KEPT and re-framed as a **provenance fix, not a colour change**: the same beloved hues, sourced from the `--rainbow-*` tokens so the pixels are preserved and the byte-drift between `EGG_HUES[2]` and `--subject-teal` is removed by construction. The crayon/rainbow pop fires exactly where it earns its place (the tumble easter egg), proportioned, never eliminated.
- **TEMPERED the signature-tether rhetoric toward proportion (verdict #3/#4).** The "it's the whole point of the page" / "no other scene owns it" framing was softened to a *refinement of the existing draggable subject + spring chase*, drawn at low alpha in the system's own red authority — a delight that appears on grab and recedes at rest, not a dominant re-theme. The rubber-band tether stays the scene's signature because it dogfoods the exact primitive the page proves, but it is now framed as amplifying the four pillars rather than replacing the aesthetic.
- **AMPLIFIED the four pillars per verdict #2 (refine, do not abrogate).** No wholesale replacement clause remained, but the SPATIAL coordinate-field clause now KEEPS the crosshair/quarter-tick frame and ADDS a proportionate phase-trace ghost as a *mathematical overlay easter egg* (spring math made visible, opt-in, fades on settle) — KEEP-and-enhance, never swap. GLASS (the `Card`/plate register, I5), PAPER (the engineering graph-paper substrate the box now refracts against), and TYPOGRAPHY (the Instrument-Serif display title + the `.readout-accent` mono telemetry, "drag me" breathing with the gesture) are all refined-in-place.
- **Signatures kept as proportionate easter eggs (verdict #3):** the double-click tumble (rainbow sweep) is disclosed progressively after first drag-settle; the phase-trace blooms only during the chase; the grab-pulse/quarter-tick snap-glow/settle-blink are one-shot PRM-guarded delights. None is a default-on re-theme.
