# Square scene — design audit (Tranche S, pass 1)

> Scope: the live `/square` page (screenshots: `square-mobile.png` 375px, `square-laptop.png` 1280px, `square-desktop.png` 1440px) + source under `demo/scenes/square/` on `tranche-s-dev`. Analysis only; no source modified.

---

## 1. Product truth — what the page IS and is FOR

The square scene is the **custom-transform-function-over-nested-object-vars dogfood**: the one page that proves keyframes.js can compose `transform` from deeply-nested vars (`transform.a.b.c.d`) that map to no CSS property, driven live rather than by a canned loop (`useSquareAnimations.ts:7-31`). Two `SpringProgress` trackers (response 0.32, ζ 0.62 — `useSquareAnimations.ts:51-52`) own the box's position; a pointer drag re-seats their targets through the shared `useDragScrub` seam (`SquareScene.vue:228-251`), and one self-terminating `RAFPlayback` loop rebuilds the nested vars every frame and paints through the single `transformFunc` (`useSquareAnimations.ts:184-272`). The page is presented as a **draughtsman's instrument plate**: a glass Card stage carrying a coordinate field, a rubber-band tether from home to subject, a serif "Transform" telemetry strip with live x/y readouts and a settled/tracking badge, and a mint chip that says "drag me" (`SquareInstrument.vue`, `SquareScene.vue:10-77`). Its job is to make the invisible spring math *feel physical* — the design signature (the tether, the velocity bank, the squash) and the library primitive are the same artifact.

## 2. Usability · affordance discoverability · interactability

### What a first-time user finds unaided

- **The primary verb is self-labeling.** "drag me" in the Instrument-Serif display rung on a 12rem chip (`SquareScene.vue:44-76`) is the clearest affordance in the whole demo fleet — the type IS the affordance. `cursor: grab`/`grabbing` (`SquareScene.vue:349,370`) plus the hover-arm ring (`:357-361`) confirm interactability before commitment. Grade-A discoverability on the core gesture.
- **Feedback loops are genuinely excellent.** Grab → one-shot `@starting-style` capture-pulse (`SquareScene.vue:390-408`); drag → the tether bows (`SquareInstrument.vue:74-89`), the chip banks with real spring velocity and squashes along the drag axis (`useSquareAnimations.ts:196-232`), the edge ring brightens with `--spring-tilt` (`SquareScene.vue:369-380`), and the telemetry flips `settled → tracking` while x/y count live. Release → visible overshoot-and-settle, badge flips back. This is a complete perceive-act-confirm loop with no dead frames.
- **Progressive disclosure works.** The two egg hints ("double-click to tumble", "press C to trace the field") appear only after the first drag-settle (`SquareScene.vue:117-119,137-140`; `SquareInstrument.vue:35-48`) — a correct earn-the-secret rhythm.

### What stays hidden

- **The keyboard layer is invisible until you already know it.** Arrow-nudge (±0.25), Home/End recenter, and the `C` envelope tour (`useSquareKeyboard.ts:71-95`) require focusing the box first; nothing on the page says the box is focusable. The `.focus-ring` (`design-idioms.css:340-342`) appears only via `:focus-visible`, i.e., only after a Tab the user has no reason to press.
- **The left options panel is the page's one honesty gap.** Duration/delay/iterations/direction/fill/easing (visible in both laptop and desktop shots) edit the *transport-contract* `CSSKeyframesAnimation` — which by design paints nothing (`SquareScene.vue:92-103`: "group.play() painted NOTHING — a dead Play"). Play is honestly rewired to fire `tumble()` (`SquareScene.vue:152-154`; App pushes `isPlaying`, `useSceneMachineApp.ts:215-216`), but the *rest* of the panel still implies a parameterized animation the box never runs. A first-time user who sets duration to 1s and presses Play sees a barrel-roll whose speed ignores them — the classic controls-that-lie failure. The Reverse button and the progress scrubber in the playback card are in the same boat.
- **Touch users have no path to either egg.** `dblclick` on a `touch-action: none` element under `setPointerCapture` is unreliable-to-dead on mobile, and `press C` is keyboard-only; the hint text doesn't adapt to coarse pointers.

### Touch targets & mobile (375px shot)

The chip itself is a superb touch target (192px square). But the mobile composition has real problems — see §Mobile issues below: the bottom controls sheet occludes roughly the lower half of the stage, swallowing the box's lower travel envelope, the legend, and both egg hints; the fixed `--size: 12rem` (`SquareScene.vue:320`) chip is >51% of viewport width, so the ±110px travel (`useSquareAnimations.ts:55`) runs the chip under the sheet or against the plate edge with little visible field left.

### Empty/loading states

None needed and none broken: `paintRest()` seats the chip and instrument at rest on mount (`SquareScene.vue:180-185`; `useSquareAnimations.ts:355-364`); the spring loop is idle until armed, so there is no first-frame jank and no loading spinner to design.

## 3. Aesthetic critique against glass-ui

- **Typography — on-system and confident.** Instrument-Serif `text-display` for "Transform" and "drag me", Fira Code mono for the x/y readout and legend (`SquareInstrument.vue:22-36`), `.readout-accent` on exactly the numbers that prove the engine runs (`design-idioms.css:588-595`). The register matches Spring/Sequence siblings byte-for-byte — cohesive, not generic.
- **Color — disciplined.** One subject hue (`--subject-teal`, `design-idioms.css:270`) with an oklab two-tone material + inset edge-light (`SquareScene.vue:337-346`) so the chip reads as a physical piece, not a flat fill; red `--color-progress` reserved for motion authority (tether, capture-pulse, velocity glow); the rainbow family fires only in the tumble egg, sourced from the sanctioned `--rainbow-*` tokens at mount (`useSquareAnimations.ts:124-147`) — the L.W11 provenance fix landed. The ink derives from the fill token (`:343`), never a second literal.
- **Motion quality — the best on the fleet.** The velocity bank/squash is real spring state surfaced as geometry (`useSquareAnimations.ts:196-232`), not a cosmetic keyframe; the tether is a derived read of the same springs (no second rAF, no second writer — the inv-ζ law held throughout). The `@starting-style` capture-pulse degrades gracefully (`SquareScene.vue:389`).
- **Composition** — asymmetric instrument chrome (telemetry top-left, legend bottom-right) around a geometrically-centred subject on the crosshair field: the instrument-plate composition the prior treatment specified (`docs/frontend-design/demo/square.md` §SPATIAL), executed.
- **Distinctive or generic?** Distinctive. The rubber-band tether + banking chip is a memorable, page-specific signature, and it *is* the library primitive made visible — the page dogfoods keyframes.js at 60fps in a way a screenshot can't fake. Weakest aesthetic beat: the coordinate field's quarter-ticks are inert (they never acknowledge the chip crossing them), and the stage tint never breathes with deflection — both were specified in the prior treatment (P2/P3, `square.md:73,79`) and remain unshipped, so the field reads slightly like a printed backdrop rather than a live instrument.

**Verdict: the desktop page has earned an A-tier scene identity; the composite grade is dragged by the dishonest options panel and the occluded mobile stage.**

## 4. Ranked tasteful refinements (wave-shaped)

1. **Make the options panel honest for this scene.** WHAT: either (a) wire the easing/duration selections onto the tumble spin (`springSpin` response/target pacing) so Play visibly obeys them, or (b) collapse the panel to the controls that ARE live here (the Keyframes-string readout) with a one-line mono caption ("this box is spring-driven — Play tumbles it"). WHERE: `SquareScene.vue` exposed API + `AnimationControls` pane gating; no library change. WHY: controls that visibly do nothing are the page's only trust break — worse than absent controls.
2. **Reclaim the mobile stage.** WHAT: make `--size` and `TRAVEL` responsive (`clamp(7rem, 40cqw, 12rem)`; travel derived from stage rect instead of the 110px constant), and float the legend/hints top-right on small viewports so the sheet can't swallow them. WHERE: `SquareScene.vue:320` scoped CSS + `useSquareAnimations.ts:55` (accept a travel getter). WHY: at 375px the sheet occludes the lower travel envelope and both egg hints — half the instrument is unreadable on the device class most likely to be shown the demo.
3. **Touch parity for the eggs.** WHAT: long-press (≈500ms hold without movement, inside the existing drag seam's threshold) fires `tumble()`; hint text swaps by `(pointer: coarse)` — "hold to tumble". WHERE: `SquareScene.vue` pointer wiring + `SquareInstrument.vue:38-47`. WHY: both delights are currently mouse/keyboard-locked; touch users get the drag but none of the reward.
4. **Quarter-tick snap-glow** (prior-treatment P2, unshipped). WHAT: when a spring target crosses ±0.25/±0.5/±0.75, the corresponding field hairline flashes once (a `data-tick` attribute + one PRM-guarded transition). WHERE: `SquareInstrument.vue` field + a threshold check in the existing `onTick` mirror (`SquareScene.vue:132-141`). WHY: the graticule becomes a live instrument instead of a printed backdrop — the page's one inert layer starts answering the hand.
5. **Settle-blink** (prior-treatment P2, unshipped). WHAT: on the `tracking → settled` badge flip, the x/y readout does a single subtle scale-tick ("measurement locked"). WHERE: `SquareInstrument.vue:29-33` + one scoped keyframe. WHY: the settle is the spring's punchline; today it lands silently in the telemetry.
6. **"drag me" acknowledges the grab** (prior-treatment TYP, unshipped). WHAT: while `.demo-box--dragging`, letter-spacing opens ~0.02em and the word fades toward the ink — one transition, PRM-guarded. WHERE: `SquareScene.vue` scoped block. WHY: the label is the affordance; it should react to being taken.
7. **Deflection-keyed stage tint** (prior-treatment P3, unshipped). WHAT: drive the existing `--stage-field-tint` idiom (`design-idioms.css:296-302`) off `Math.hypot(deflX, deflY)` so a hard pull blooms a faint red field wash behind the subject. WHERE: `SquareScene.vue` — one style binding on the Card. WHY: the whole plate breathes with the drag; reuses the MP-OPP1 idiom, zero new vocabulary.
8. **Advertise the keyboard layer.** WHAT: add "⇥ focus · arrows nudge" as a third `text-mono-caption` legend line, shown alongside the existing hints after first settle. WHERE: `SquareInstrument.vue:35-48`. WHY: arrow-nudge/Home/envelope-tour are fully built and completely undiscoverable.

## 5. ONE on-aesthetic easter egg — "FIELD CALIBRATED"

**Manually drag the chip through all four corners of the envelope (each visit ≥0.85 deflection on both axes, in any order, without pressing `C`) → the graticule's quarter-ticks glow once in sequence and a tiny serif stamp — `field calibrated` — appears beside the legend with a one-shot rotation-settle, like a draughtsman's approval seal; the settled badge reads `calibrated` for its next settle.** It is in the page's own voice (the measuring-instrument register — you *calibrated the rig by hand*), discoverable purely through play (corner-seeking is the natural thing to do with a bounded field), cheap (four booleans in the existing `onTick` mirror, reset on Home; one CSS class; PRM collapses the glow to an instant stamp), and it honors the eggs' existing economy: the tumble reveals the color twin, the `C` tour reveals the envelope, the calibration stamp rewards *mastering* it. No new rAF, no new writer — pure derived reads of `deflX/deflY`.

## 6. Accessibility notes (from source)

- **ARIA — exemplary 2D-drag contract.** The chip is `role="group"` holding two visually-hidden per-axis `role="slider"` children, each with a complete WCAG 4.1.2 contract (`aria-valuemin/max/now` + live `aria-valuetext`, `SquareScene.vue:55-74`), updated at event cadence not paint cadence (`:169-178`). This is the correct shape (a scalar slider would misrepresent 2D).
- **Nit:** the sr-only sliders carry `role="slider"` without `tabindex`/keyboard handling of their own (intentional — the group is the single keyboard target, `SquareScene.vue:301`); some AT heuristics flag non-focusable sliders. Consider `aria-roledescription` on the group ("two-axis spring slider") as belt-and-braces.
- **Keyboard:** full parity for the core interaction (arrows/Home/End, `useSquareKeyboard.ts:71-95`) + `.focus-ring` visible focus (`design-idioms.css:340`). The dblclick tumble has a keyboard path via the dock Play button. Good.
- **Live announcements:** the settled/tracking badge and telemetry are `aria-hidden` (`SquareInstrument.vue:21,35`) with the data mirrored into `aria-valuetext` — correct de-duplication; no `aria-live` needed since slider value changes announce natively.
- **Reduced motion:** thorough — tether fade snaps, box transitions off, grab-pulse suppressed, tumble bloom dropped while the functional motion (spring chase, color sweep) remains (`SquareScene.vue:422-445`; `SquareInstrument.vue:199-203`). Matches the "suppress decoration, keep meaning" doctrine.
- **Contrast:** chip ink is derived at 25% teal / 75% black on the teal fill (`SquareScene.vue:343`) — comfortably AA in both themes by construction; the badge family single-sources its AA color-mix lineage (`design-idioms.css:626-666`). The tether at 0.45 alpha and the field hairlines at 30-70% `--border` are decorative (`aria-hidden`) so contrast minima don't apply.

---

*Grade: B+ — an A-tier desktop scene (the fleet's best motion feel, real dogfood, disciplined tokens) held back by a dishonest options panel and a mobile stage half-swallowed by the sheet.*
