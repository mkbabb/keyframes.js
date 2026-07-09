# Amiga Scene — S.pass1 design audit

> Page: `demo/scenes/amiga/` (AmigaScene.vue + AmigaCrtOverlay + AmigaTelemetry + useAmigaThree/useSphereSpin/useAmigaBoot/useAmigaAnimations/utils)
> Screenshots: `docs/tranches/S/audit/pass1/design/screenshots/amiga-{mobile,laptop,desktop}.png`
> Prior treatment: `docs/frontend-design/demo/amiga.md` (the "CRT demoscene reliquary" doc — largely IMPLEMENTED; this audit measures the built page against it)
> Presentation mode: `subject` (`demo/app/scenes.ts:149` — the canvas IS the background)

---

## 1 · Product truth

This is the demo's homage page: the 1984 Amiga Boing Ball — the red-and-white checkered sphere that convinced a generation a desktop machine could do real-time 3D — re-staged as a Three.js room whose every motion is driven by the keyframes.js engine. Its job is to prove the engine drives a **non-DOM target**: the `CSSKeyframesAnimation` group moves the mesh (`useAmigaAnimations.ts:73-149`), a pointer-drag spins the sphere and the engine's analytic `decay()` closed form coasts it to rest (`useSphereSpin.ts:10,169`), and the `RAFPlayback` driver owns the present loop (`useAmigaThree.ts:84`). Layered on that proof are three engine-dogfooding delights: the double-click Boing arc (`AmigaScene.vue:19,141`), the flick-to-boing gesture egg (`useSphereSpin.ts:68`), and the power-on CRT boot on scene re-entry (`useAmigaBoot.ts:36`). The page is simultaneously a physics witness (the ω telemetry, `AmigaTelemetry.vue`) and a cultural reliquary (the CRT phosphor stack, `AmigaCrtOverlay.vue`).

## 2 · Usability · affordance discoverability · interactability

### What a first-time user finds unaided

- **The dock play button** (rainbow, bottom center) — the one loud affordance. The cold-entry contract holds the engine OFF until dock-play (`AmigaScene.vue:174-175`), so the first-visit stage is a **static ball in a gray room**. Legible, but motion-dead for an animation library's showcase.
- **`cursor: grab` on the canvas** (`AmigaScene.vue:274`) — the ONLY drag-to-spin signal, and desktop-pointer-only. There is no text, no glyph, no pulse. The scene's signature interaction (spin → decay glide → the ω readout draining) is discovered by accident or not at all.
- **The ω telemetry chip** (`AmigaTelemetry.vue:50-68`, bottom-left) — once found, it is an excellent feedback loop: drag → value climbs, release → the visible `decay()` drain with a velocity bar. This is the page's best moment of engine-made-legible.
- **The controls sidebar / sheet** — standard suite (duration/delay/iterations/direction/fill/easing + Play/Reverse + scrubber). It controls whichever animation the dock's "Rotations" select names; the mapping from "Rotations" to what will visibly happen is not explained anywhere on the stage.

### What stays hidden

- **Double-click → Boing** (`AmigaScene.vue:19`) — the crown-jewel egg has zero affordance. The prior design doc's P2 fix (a Fira Code micro-caption `drag to spin · double-click to boing`) was **never implemented**; the discoverability defect it named (A5) survives verbatim.
- **Flick-to-boing** (`useSphereSpin.ts:68,184`) — an 8.0 rad/s threshold no user can know exists. Delightful when tripped; invisible until then.
- **The power-on boot** (`useAmigaBoot.ts:36`) fires only on *re-entry* (sessionStorage-gated, `AmigaScene.vue:176-180`) — correct per the cold-entry contract, but it means the page's single most memorable moment is structurally unseeable on a first visit.
- **Sphere-hit vs orbit disjointness** (`useSphereSpin.ts:106-116`): a miss orbits the camera. Nothing signals that two different gestures live on one canvas; users who grab empty space and get camera orbit may never learn the ball itself is grabbable.

### Feedback loops & states

- Drag/glide feedback is strong (cursor grab→grabbing `AmigaScene.vue:293-295`, ω readout, spin-bloom flare `AmigaScene.vue:132-138`). Boing feedback is honest (cursor stands down, `:298-300`).
- Loading: the scene lazy-loads; there is no skeleton, but Three setup is fast and the stage backdrop gradient (`AmigaScene.vue:281-285`) covers the gap acceptably.
- Occlusion/visibility pausing (`AmigaScene.vue:200-237`) is exemplary plumbing — no battery burn, boot re-arms on each genuine re-entry.

### Touch targets & the 375px experience (mobile shot)

1. **The telemetry chip is occluded by the bottom sheet.** It is pinned `bottom: 1rem; left: 1rem` of the stage (`AmigaTelemetry.vue:52-54`); on 375px the controls sheet + dock cover the lower stage, so the decay() witness — the page's proof artifact — is invisible on exactly the platform where the flick gesture is most natural. (Desktop/laptop shots show it; the mobile shot does not.)
2. **No touch path to the Boing is advertised.** Double-tap does fire `dblclick` on most mobile browsers, but nothing says so; the flick threshold is unknowable. On touch, the egg is effectively sealed.
3. **The sphere is a small grab target** (~90px at 375px) and every miss is claimed by OrbitControls — accidental camera orbit will dominate first touches; `touch-action: none` (`AmigaScene.vue:273`) means those drags also never scroll, which can read as "the page is stuck."
4. **The dock overlaps the sheet's top edge** (mobile shot: Rotations/reset/trash/play sits over the sheet boundary) — the sheet's drag handle and the dock compete in the same thumb zone.
5. **The CRT identity nearly vanishes on mobile-light**: 9%-alpha multiply scanlines over the light-gray room (`AmigaCrtOverlay.vue:46-56` over `useAmigaThree.ts:167-169`) read as faint texture at best; the page presents as a generic gray 3D viewer.

## 3 · Aesthetic critique (against glass-ui)

- **Typography**: the stage itself carries almost none — the ω chip is the lone type on the glass (correctly in the Fira Code telemetry register, `AmigaTelemetry.vue:63-64`). The prior treatment's Instrument Serif "BOING" nameplate was dropped; the demo's most culturally-loaded page still introduces itself with zero words. The controls suite typography is the shared system and is fine.
- **Color**: the crayon red is now properly tokenized — `--amiga-red` aliases `--rainbow-red` (`design-idioms.css:104`) and `tesselateSphere` resolves the var at paint time (`utils.ts:14-27`, `useAmigaThree.ts:179`). The phosphor magenta (`--amiga-phosphor`, off `--primary` dark; `AmigaCrtOverlay.vue:35`) frames the red as atmosphere. This two-primary scheme is genuinely good — **but the room undercuts it**: walls are still the raw literal `rgb(220,220,220)` Lambert gray (`useAmigaThree.ts:167-169`), neither theme-aware nor dark enough for the phosphor to glow. In light mode the CRT stack reads as a faint smudge (visible in all three screenshots as a barely-magenta vignette on gray). The design doc's "CRT photographed in a dark room" (its P1 darken-the-room step) was implemented as overlay-only; the room itself never joined.
- **Motion quality**: what exists is excellent and honestly engine-driven — decay glide, spin-bloom easing (`AmigaScene.vue:137`, a clean exponential approach), the 900ms `crt-power-on` flash with scaleY tube-snap (`AmigaCrtOverlay.vue:111-124`). But at rest the page is **motion-dead**: the rotations group is dormant until dock-play, and no ambient life exists (the doc's P4 idle drift was not landed — defensible under the cold-entry contract, but the stillness reads as inert rather than poised).
- **Composition**: everything is dead-centered (subject = pivot = framing, deliberate per `useAmigaThree.ts:120-138`). The telemetry chip bottom-left is the only asymmetry. Fine, but the stage has no diagonal flow and no identity anchor; the doc's top-left nameplate would have supplied both.
- **Distinctiveness / memorability**: on RE-entry, with the boot flash and a flick-flared phosphor bloom, this page is memorable and unlike anything in competing libraries' docs. On a cold first visit in light mode it is a competent-but-generic Three.js orbit viewer with a nice readout. The distinctiveness is real but **gated behind secrets**.
- **Dogfooding visibility**: strong in substance (every motion path is engine-owned: `CSSKeyframesAnimation`, `AnimationGroup`, `decay`, `RAFPlayback` — no hand-rolled rAF), weak in *legibility*: only the ω chip tells the user the engine is doing it.

## 4 · Ranked tasteful refinements (wave-shaped)

1. **Un-occlude the telemetry on mobile** — *what*: move `.amiga-telemetry` to top-left on small viewports (or offset it above the sheet via the existing sheet-height custom property if one exists); *where*: `AmigaTelemetry.vue:50-54` (+ one `@media (max-width: …)` block); *why*: the page's proof artifact is currently invisible on touch, where the flick gesture lives — highest leverage, ~6 lines of CSS.
2. **Land the gesture caption (the dropped P2)** — *what*: a one-line Fira Code micro-caption in the telemetry register, e.g. `drag to spin · double-click to boing`, pinned near the ω chip, fading to 40% opacity after first successful spin; *where*: new sibling span in `AmigaScene.vue` template beside `AmigaTelemetry`, `.code-token`-style; *why*: fixes the A5 discoverability defect the prior pass named and never shipped — the crown jewel stops being a secret. (On coarse pointers, swap the copy to `drag ball to spin · flick hard to boing`.)
3. **PRM-gate the dblclick Boing** — *what*: add the same `prm.value === "reduce"` guard the flick path has (`AmigaScene.vue:93-96`) to `onBoing` itself (`AmigaScene.vue:141`); *why*: under reduced-motion a double-click currently fires the full 4.2s wall-slam arc — an accessibility contract break the flick path already avoids; 2 lines.
4. **Theme the room walls** — *what*: replace the raw `rgb(220, 220, 220)` Lambert literal (`useAmigaThree.ts:167-169`) with a value resolved from the theme (reuse the `resolveColor` var-resolution idiom from `utils.ts:14`; re-resolve on theme flip), darker in dark mode so the phosphor vignette actually glows; *why*: the last raw literal on the page, and the single change that makes the CRT identity survive both themes — the overlay was built for a dark tube that was never installed.
5. **Strengthen the CRT stack in light mode** — *what*: bump light-mode scanline alpha/vignette mix a notch and add the doc's grain layer at ~3% (`AmigaCrtOverlay.vue:46-89`; one more layer div, tokens only); *why*: in the light screenshots the entire atmosphere reads as near-nothing; the page's identity should not be dark-mode-only.
6. **Signal the two-gesture model on hover** — *what*: on sphere raycast-hover (the raycaster already exists, `useSphereSpin.ts:74,106`), nudge `--spin-bloom` to ~0.15 so the phosphor breathes when the pointer is over the ball; *where*: a `pointermove` hover check in `useSphereSpin` + the existing bloom var; *why*: differentiates ball-grab from orbit-grab without any new chrome — the CRT "notices" the ball.
7. **Peak-hold tick on the ω bar** — *what*: a 1px marker on `.amiga-telemetry-bar` holding the max of the last flick for ~2s, with the 8.0 rad/s boing threshold as a faint fixed notch (`AmigaTelemetry.vue:81-97`; `FLICK_BOING_RAD_S` imported from `useSphereSpin.ts:68`); *why*: makes the hidden threshold *learnable* — users see how close their flick came, converting the egg into a game.
8. **First-visit boot amnesty** — *what*: allow ONE PRM-gated boot flash (flash only, no engine arc — keeping proof:cold-entry inviolate, since the flash is pure CSS on `AmigaCrtOverlay`) on cold arrival; *where*: `AmigaScene.vue:176-193` gating + a flash-only path in `useAmigaBoot.ts`; *why*: first-time visitors currently get the page's weakest state; a 900ms phosphor snap-on costs nothing from the engine contract and stamps the CRT identity at first sight.

## 5 · The easter egg — "Guru Meditation"

**Over-flick the ball → the Amiga crashes.** If a release flick exceeds ~2.5× the boing threshold (≥ ~20 rad/s — the top of the calibrated hard-flick range, `useSphereSpin.ts:63-68`), the CRT throws the most Amiga thing there is: the **Guru Meditation** alert — a black band across the top of the stage with a blinking `--amiga-red` double border and Fira Code text `Software Failure.  Press left mouse button to continue.` / `Guru Meditation #00000004.0000AAC0` — held ~2.5s, then the existing `runBoot()` power-on sequence replays as the "reboot." Entirely in the page's own voice (1984 hardware, red-on-black, mono), built from what already exists (one absolutely-positioned overlay div + the boot composable + `--amiga-red`/`--font-mono` tokens), discovered exactly by the users already playing hardest with the flick gesture, and PRM-gated like every other egg (under reduced-motion: no blink, no reboot flash — or simply suppressed). Cheap, canonical, unforgettable: you didn't just spin the ball too hard — you crashed the Amiga, and it reboots itself.

## 6 · Accessibility notes (from source)

- **Reduced motion — good coverage, one hole**: boot suppressed (`useAmigaBoot.ts:39`), flick-to-boing suppressed (`AmigaScene.vue:94-95`), flash animation inside `@media (prefers-reduced-motion: no-preference)` (`AmigaCrtOverlay.vue:106-110`), telemetry bar transition disabled (`AmigaTelemetry.vue:98-102`). **The dblclick `onBoing` path is NOT gated** (`AmigaScene.vue:141`) — refinement #3.
- **Canvas semantics**: the interactive `<canvas>` has no `role`, no `aria-label`, no tab stop (`AmigaScene.vue:12-20`). Screen-reader and keyboard users get nothing — no accessible name for the scene subject, and **no keyboard path at all** to spin or boing (pointer + dblclick only). A `role="img"` + `aria-label="Amiga Boing Ball — drag to spin"` is the floor; a focusable canvas with arrow-key nudge + Enter→boing would be the honest fix.
- **ARIA that is right**: CRT overlay `aria-hidden="true"` (`AmigaCrtOverlay.vue:15`); telemetry `role="status" aria-live="off"` (`AmigaTelemetry.vue:11`) — present in the tree without chattering at 12Hz.
- **Contrast**: telemetry `--muted-foreground` on a 70% blurred `--background` chip (`AmigaTelemetry.vue:60-65`) is borderline over the busy stage in light mode — worth a contrast check; the value itself uses `--foreground` (fine). The scanline multiply layer slightly lowers everything's contrast on light; capped low enough to be acceptable.
- **Gesture escape**: `touch-action: none` on the full canvas (`AmigaScene.vue:273`) means the stage never scrolls on touch — acceptable for a `subject`-mode full-bleed stage, but combined with silent orbit-capture it can trap a confused first touch (see mobile #3).

---

**Verdict: B+.** The engineering under this page is the best kind of dogfooding — every motion is honestly engine-owned, the decay telemetry is a genuinely elegant proof-made-visible, and the CRT/boot/flick layer cake is distinctive work. But the page hides its three best interactions behind zero affordances (the caption that was designed for it was never shipped), its proof artifact is occluded on mobile, the room never got the dark tube the phosphor overlay was designed against, and reduced-motion has one honest hole. All fixable in small, on-system waves — no redesign warranted.
