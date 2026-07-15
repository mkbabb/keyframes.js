# Amiga Scene — frontend-design treatment

> Page: `demo/app/scenes/AmigaScene.vue` (+ `demo/amiga/{useAmigaAnimations,useSphereSpin,utils}.ts`)
> Design system: glass-ui tokens via `demo/styles/{style.css,design-idioms.css,brand.css}` + `demo/DESIGN.md`
> Presentation mode: `subject` (the canvas IS the background — `demo/app/scenes.ts:195`)

---

## §Aesthetic direction

**THE POV: CRT demoscene reliquary.** This is the one page in the entire demo whose namesake is a *thing* — the 1984 Amiga Boing Ball, the single most iconic graphics demo in computing history, the red-and-white checkered sphere that made a generation believe a desktop computer could do real-time 3D. Every other scene is an abstraction (a cube, a curve, a path). This scene has a *legend* sitting in the middle of it. Right now it's rendered like a stock Three.js boilerplate room and the legend is mute.

The direction is to treat the canvas as **a powered-on CRT monitor from 1985, photographed in a dark room** — the Boing Ball is not floating in a neutral void, it is *being displayed* on phosphor glass. That means: scanlines raked across the whole stage, an aperture-grille shadow mask shimmer, a vignette + bloom halo that says "this surface emits light," a faint horizontal-hold jitter on wake, and the chromatic-aberration fringe of a consumer Trinitron — all built as a `pointer-events: none` overlay off existing tokens, never a theme swap.

**KEEP THE CRAYON RED CHECKER.** The current `"red"` at the `utils.ts` callsite is *correct* — it is a deliberate, beloved crayon primary, the same restrained signature family as `--accent-red`/`--rainbow-red` that the demo draws on everywhere. We do *not* magenta-swap the icon. The single honest defect is that `"red"` is a **raw named-color literal** — exactly the un-tunable, dark-blind species the demo already retired once (`aquamarine` → `--subject-teal`, `design-idioms.css:234`). So we **tokenize the red, we don't replace it**: promote `"red"` to a per-scene identity token `--amiga-red` derived off the crayon `--accent-red` / `--rainbow-red`, keeping the exact stoplight-red the user loves while finally giving it a dark variant and a name. The Amiga's real magenta then returns *not* as the checker but as a **proportionate phosphor accent** — the bloom/scanline tint and the nameplate `!` — riding the demo's own `--primary` dark token (`oklch(0.739 0.134 318.1)`, a magenta/violet) so the CRT's glow and the brand accent share a hue *around* the red ball, framing the crayon rather than overwriting it. Red sphere, magenta phosphor halo: the two primaries co-star.

**The ONE unforgettable thing:** you don't look at a 3D ball on a page — you look *into a CRT*, and the demo's signature engine motion (the Boing arc) plays as a **boot sequence**: power-on flash → horizontal-hold roll → the red-and-white ball drops in and bounces with its authentic `clack`-cadence, all behind real scanlines and bloom. The page *remembers being a 1984 demo*. The boot is a proportionate signature *easter egg* — a power-on delight on entry/re-entry, not a permanent re-theme of the page.

This is bold (retro-futurism / demoscene) but **measured**: it *refines and amplifies* the four pillars rather than replacing them. GLASS — the CRT bezel is still a `rounded-card` glass plate, now read as a monitor surround. PAPER — the drafting-table grid-bg substrate stays behind the themed clear-color (`AmigaScene.vue:208`); the CRT atmosphere composites *over* it, it does not delete it. TYPOGRAPHY — Instrument Serif + Fira Code, pushed bolder into a computer-magazine masthead register. MATHEMATICS — the bounce/decay/orbit math the engine already runs is made *visible* as light. It is context-specific (only the Amiga page earns scanlines + a Boing boot), and every CRT layer is mixed from existing theme tokens.

---

## §Current-state audit

What's actually on screen today, and where it reads generic vs. the SOTA bar:

| # | Observation (file:line) | Verdict |
|---|---|---|
| A1 | **No identity, no text, no HUD whatsoever.** `AmigaScene.vue:12-18` is a *bare* `<canvas>`. There is no scene title, no "Boing Ball" caption, no readout, no demoscene framing. `grep` for `<h1|<p|caption|readout` returns nothing. The demo's most culturally loaded page introduces itself with *zero words*. | AI-slop-by-omission. A SOTA hero would name the legend. |
| A2 | **The checker red is a RAW NAMED-COLOR LITERAL.** `AmigaScene.vue:229` → `tesselateSphere("white", "red", SPHERE_RADIUS)`. The *red is right* — it's a crayon primary, kin to `--accent-red`/`--rainbow-red`, the demo's beloved signature accent — but `"red"` is an un-named, un-tunable, dark-blind literal, the exact species the demo already retired once (`aquamarine` → `--subject-teal`, `design-idioms.css:234`). The hue stays; only the *plumbing* is the defect. | Right color, raw plumbing. Tokenize, don't swap. |
| A3 | **The room is undesigned gray.** Walls: `MeshLambertMaterial({ color: "rgb(220,220,220)" })` (`:221-224`); CSS backdrop is a flat `linear-gradient(--muted → --background)` (`:380-384`). Lighting is a neutral `HemisphereLight("white","#b0b0b0")` + a `0.6` spot (`:212-218`). The result is a featureless light-gray box — the *opposite* of a glowing CRT. | Generic. No atmosphere, no depth, no emission. |
| A4 | **The hue-cycle was surgically removed (K4-A).** `useAmigaAnimations.ts:54-69` — `colorT` is gone, so the ball is a static texture. The page that *demonstrates a CSS-animation engine* has, on its signature subject, **no ambient motion** until you touch it. The rotating group (`rotations`, `:70`) exists but is dormant; only drag-spin + the hidden Boing run. | Under-motion for an animation showcase. |
| A5 | **The signature interaction is invisible.** The Boing easter egg (`onBoing`, `:142-158`) fires on `@dblclick` with **no affordance** — no hint, no glyph, no label. The single best moment this page owns is hidden behind an undiscoverable gesture. The comment even calls it "A hidden, on-aesthetic trigger" (`:132`). Hidden = nobody sees it. | The crown jewel is buried. |
| A6 | **Cursor is the only affordance.** `:372-374` gives `cursor: grab`. That's it. Good instinct, but a static checkered ball with a grab cursor reads as "a 3D viewer," not "a demoscene relic you can spin." | Thin. |
| A7 | **`amplitude tuned DOWN to a polite hover.** `BOUNCE_FIT_MARGIN = 0.35` (`:72`) deliberately makes the Boing a "tasteful hover arc, NOT edge-kiss." Tasteful is the wrong adjective for a *Boing Ball*. The original demo's whole point was the ball SLAMMING the walls with a sound effect. We've sanded the icon's edges off. | Over-corrected; lost the soul. |

**The SOTA bar** for a demoscene tribute (think: the Bruce Lee / Shadertoy / pouet.net aesthetic, or Lenovo's "Retropop" microsites): scanlines + bloom + grille shimmer, a typographic title set in a *period-correct* display face, a boot-up reveal, and a sound-coupled or at least cadence-coupled bounce. We are nowhere near it; we're at "default Three.js orbit demo."

---

## §Refinements

Each is concrete, token-respecting, and lands at a named file:line. Nothing here is a wholesale swap — every CRT layer is built from existing glass-ui tokens and existing engine primitives.

### TYPOGRAPHY — a vertical-set CRT nameplate

The demo's display face is **Instrument Serif** (`style.css:63`) and its mono is **Fira Code** (`:64`). Neither is generic (rule satisfied — no Inter/Roboto). For *this* page, Instrument Serif's high-contrast condensed serif is doubly right: it reads as a 1980s *computer-magazine masthead* (Byte, Amiga World) when set large and tight.

- **Add a scene nameplate** as an absolutely-positioned overlay sibling to the canvas in `AmigaScene.vue` (the canvas is bare today — A1). Set the word **`BOING`** in `text-display-3`/`-4` Instrument Serif, tracked tight, in the **top-left** of the stage. The display face is pushed *bolder and more characterful* here — full optical-size masthead weight, tight tracking, period-correct (the TYPOGRAPHY pillar, amplified). The **`!`** is the **magenta `--amiga-phosphor` accent** — the single proportionate flash of the Amiga's own pink in the type, a deft easter-egg that nods to the icon's heritage while the ball stays crayon red. (If the brand prefers, the `!` may instead read `--amiga-red` to rhyme with the ball — author's call; both honor the kept crayon.) Beneath it, a Fira Code micro-caption: `AMIGA · 1984 · drag to spin · double-click to boing`. This simultaneously *names the legend* (A1) AND *advertises the hidden gesture* (A5) — two audit fixes, one element.
- The micro-caption uses `.code-token` register (`design-idioms.css:650`, `var(--font-mono)` at `--type-caption`) — already a demo-owned idiom, so the readout reads off ONE palette.
- Wrap the nameplate in a `prefers-reduced-motion`-respecting fade-in (see MOTION) and a subtle `text-shadow` phosphor glow (see BACKGROUND).

### COLOR — tokenize the crayon red, frame it in magenta phosphor

The highest-leverage change is *naming the red the user already loves* — and letting the Amiga magenta co-star as the CRT's glow, not as a replacement for the ball.

- **`AmigaScene.vue:229`** → `tesselateSphere("#ffffff", "var(--amiga-red)", SPHERE_RADIUS)`. The checker stays **crayon red** — same stoplight hue, now named and dark-aware. Introduce the per-scene identity token in `design-idioms.css :root`, *beside* `--subject-teal` (`:234`, the established per-scene-identity-hue precedent), derived off the crayon family so it is one of the family, not an orphan:
  ```css
  /* The 1984 Boing Ball checker red — the crayon primary the icon has always
     worn (kin to --accent-red / --rainbow-red), finally tokenized off the
     family so it tunes + earns a dark variant. Retires the raw `"red"` literal
     at AmigaScene.vue:229 (the last raw named-colour after aquamarine→teal). */
  --amiga-red: var(--rainbow-red);          /* hsl(0 85% 60%) — the kept crayon */
  /* The CRT phosphor glow/scanline tint — the demo's --primary magenta/violet
     (oklch(0.739 0.134 318.1)) made literal as the BLOOM around the red ball,
     NOT as the ball. The Amiga magenta returns as atmosphere; the crayon red
     stays the subject. Two primaries, co-starring. */
  --amiga-phosphor: oklch(0.78 0.14 318);   /* the bloom/scanline tint, off --primary */
  ```
  `tesselateSphere` takes CSS color strings (`utils.ts:6-7,15,24`) so a `var(--amiga-red)` resolves straight to the 2D canvas `fillStyle`. **Zero structural change** — same red, named.
- **The room walls** (`:221-224`): drop the flat `rgb(220,220,220)` to a near-black **deep charcoal/navy** so the red ball *glows against the dark* (a CRT in a dark room) — this is contrast for the crayon, not a recolor of it. Use a dark Three color (`#0d0b14`); keep `BackSide`. Light mode keeps a lighter wall via a themed value so the room isn't dark-only.
- **CSS backdrop** (`:380-384`): replace the flat `--muted → --background` wash with a **radial phosphor vignette** centered behind the ball — `radial-gradient(circle at 50% 42%, color-mix(in oklab, var(--amiga-phosphor) 18%, var(--card)) 0%, var(--background) 70%)` — so the dark stage has a warm magenta-tinged glowing center *around* the red sphere, light/dark-token-aware. This is the bloom halo: the magenta frames the red.
- **Scanline tint** (see BACKGROUND) is mixed from `--amiga-phosphor`, so the whole CRT chrome reads off the magenta phosphor pair — coherent with `--primary`, while the subject stays the crayon `--amiga-red`. The palette is deliberately two-primary by design: red icon, magenta atmosphere.

### MOTION — the Boing BOOT sequence + ambient drift

Right now the page is motion-dead until you touch it (A4) and its best motion is hidden (A5). Fix both, and DOGFOOD the engine harder:

- **Ambient idle drift:** re-enable a *slow* version of the dormant `rotations` group (`useAmigaAnimations.ts:70`) at scene-mount on a long, low-amplitude tick — a 60s `rotation.y` creep so the ball *breathes* and the checker subtly turns. This is the animation engine quietly proving it runs (the whole demo's thesis), under `prefers-reduced-motion` guard. Drive it through the existing `animationGroup` so it's all one engine path.
- **The BOOT reveal (the signature — see below):** on first mount / on re-entry (the `IntersectionObserver` at `:314` already fires on re-entry), play a one-shot **power-on**: a 1-frame white flash (CSS overlay opacity 1→0), a brief horizontal-hold *roll* (translate the canvas content vertically with wrap, ~250ms), then the ball drops from above-frame and does **3 authentic bounces** before settling — driving the *existing* `bouncingY` keyframes (`useAmigaAnimations.ts:110-130`).
- **Restore the SLAM (A7):** raise `BOUNCE_FIT_MARGIN` from the polite `0.35` (`AmigaScene.vue:72`) to **`~0.6`** *for the boot sequence only* (a transient amplitude), then ease back to `0.35` for the ambient rest. The icon gets its wall-kiss back at the dramatic moment without permanently filling the frame.
- All keyframe motion stays on the engine (`CSSKeyframesAnimation`/`AnimationGroup`) — no new rAF, no hand-rolled tweens. The boot is *staggered* (flash → roll → drop → settle) — the "one orchestrated load with staggered reveals" the methodology demands.
- **MATHEMATICS made visible (proportionate easter egg):** the page runs real bounce + decay math but shows none of it. Add an *optional, opt-in* faint Fira Code **bounce-trace graticule** — a thin baseline + decaying apex tick marks that the boot DROP draws as the ball falls, reading the *same* `bouncingY` keyframe apexes the engine computes (`useAmigaAnimations.ts:110-130`). It is a CRT-style on-screen overlay in `--amiga-phosphor` at low alpha, fading out after `READY` — the engine briefly *showing its work*, a demoscene-correct "the math is the art" flourish. KEEP the ball and room as the subject; the graticule is an additive overlay, never the focus, and is the first thing dropped under `prefers-reduced-motion`.

### SPATIAL — break the centered-ball symmetry

Today everything is dead-centered (subject = pivot = framing, per the comments). That's *correct* for the orbit math but *boring* for composition.

- **Off-center the nameplate** to top-left, the caption hugging it — asymmetry against the centered ball creates the editorial tension. The ball stays centered (don't fight the orbit math); the *type* breaks the grid.
- **Add a bottom-right "signal" cluster:** a tiny Fira Code stat readout — `decay glide · friction 2.4` (read off `useSphereSpin.ts:40`) or a live `rotation.y` degrees readout — pinned bottom-right, like a CRT's on-screen-display menu corner. Diagonal flow: title top-left → ball center → telemetry bottom-right.
- The **CRT bezel**: keep the `rounded-card` glass plate + `inset 0 0 0 1px var(--border)` hairline (`:390`) — the GLASS pillar, refined not replaced — and thicken it *conceptually* into a *monitor bezel*: a second inset shadow ring in `--amiga-phosphor` at low alpha reading as the glass curvature edge. The glass surface remains a glass-ui card; the bezel is an additive read, not a new chrome.

### MICRO-INTERACTIONS — reward the spin, hint the boing

- **Spin trails:** while `useSphereSpin.isGliding()` is true (`useSphereSpin.ts:219`), bump bloom intensity — a faster spin = brighter phosphor (drive a CSS var off the glide velocity). Releasing a hard flick makes the CRT *flare*. Cheap (one custom-property → `filter`/box-shadow), and it makes the decay glide *visible* as light, not just rotation.
- **Boing hint pulse:** every ~20s of idle, the `double-click to boing` caption does a 1.5s opacity pulse — a *come-hither* for the hidden gesture (fixes A5's discoverability without a permanent button).
- **Hover the stage** → scanlines intensify subtly + the vignette tightens (the CRT "leans in"). Pointer-leave relaxes it. Compositor-cheap (opacity/transform only).
- **The grab → grabbing** states already exist (`:392-394`); add a faint **chromatic-aberration kick** on `:active` (a 1px R/B split via `text-shadow`/`filter`) so grabbing the ball feels like touching a live tube.

### BACKGROUND — the CRT atmosphere stack

This is where the page earns its identity. A layered overlay *on top of* the canvas (a sibling `<div>` with `pointer-events: none`, so it never blocks the spin gesture):

1. **Scanlines:** `repeating-linear-gradient(to bottom, transparent 0 2px, color-mix(in oklab, var(--amiga-phosphor) 8%, transparent) 2px 3px)` — fine horizontal raster, fixed pitch. Reads off the new token. Mix-blend or low alpha so it doesn't crush the ball.
2. **Aperture-grille shimmer (Trinitron):** a *very* faint vertical `repeating-linear-gradient` at 3px pitch, even lower alpha — the subliminal RGB stripe.
3. **Vignette + bloom:** the radial phosphor gradient from COLOR, as a `::before` — the emitting-glass halo.
4. **Grain/noise:** a subtle noise overlay (SVG `feTurbulence` data-URI or the demo's existing grain idiom if present) at ~3% — analog signal noise, kills the digital flatness the methodology warns against.
5. **Curvature edge:** a hard inset `box-shadow` ring in near-black so the corners darken like a curved tube face.

ALL five compose under `prefers-reduced-motion` (the shimmer/flicker animation disables; the static scanlines + vignette stay — they're texture, not motion). The whole stack is `pointer-events: none` so `useSphereSpin` and `OrbitControls` are untouched.

---

## §The one unforgettable moment

**THE POWER-ON BOING.** When you arrive at the Amiga scene (or scroll it back into view — the `IntersectionObserver` re-entry at `AmigaScene.vue:314-321` is the *perfect* existing hook), the page **boots like a real Amiga**:

1. **`POWER`** — a single-frame white phosphor flash floods the CRT (CSS overlay `opacity: 1 → 0` over ~120ms), the scanlines snap on.
2. **`SYNC`** — a ~250ms horizontal-hold *roll* (the picture rolls vertically and catches), the classic CRT lock-on.
3. **`DROP`** — the **red-and-white** crayon Boing Ball drops in from above-frame and does **three escalating-decay bounces** against the room walls (driving the *real* `bouncingY` engine keyframes at the boosted `~0.6` amplitude), each bounce timed to the authentic ~700ms `bouncingY` period (`useAmigaAnimations.ts:113`). The faint bounce-trace graticule sketches each apex as it falls, then fades.
4. **`READY`** — it settles to the centered rest pose, the magenta `--amiga-phosphor` bloom blooms *around* the red ball, and the `BOING` nameplate fades in top-left with its phosphor `!`.

No other page in the demo — or, frankly, in most animation libraries' docs — *boots*. This is the keyframes.js engine narrating its own origin myth: the Boing Ball, re-staged behind a CRT, driven by the very engine the library ships. It is impossible to forget because it's *the thing the page is named after, finally doing the thing it's famous for.* And because it rides the `IntersectionObserver` re-entry, it replays every time you scroll back — a gift that keeps giving, not a one-shot.

Double-click still fires the full sustained Boing (the existing `onBoing` at `:142`), now with its amplitude soul restored — so the boot is the *trailer* and the double-click is the *feature*.

---

## §Design verdict reconciliation

This treatment was revised to honor the binding design verdict. What changed and why:

- **REVERSED the magenta checker swap.** The prior draft replaced the crayon `"red"` ball with Boing magenta (`tesselateSphere(…, "var-magenta")`, an `--amiga-magenta` token, "this alone makes the ball *canon*"). The verdict KEEPS the crayon primaries: the red is a beloved, intentful signature accent (kin to `--accent-red`/`--rainbow-red`). The checker now **stays red** — the only change is tokenizing the raw `"red"` literal into `--amiga-red` *derived off the crayon family* (a plumbing fix exactly like `aquamarine`→`--subject-teal`, not a recolor). The hue is untouched.
- **TEMPERED the magenta from subject to atmosphere.** The Amiga magenta is genuinely on-brand (`--primary` dark is magenta/violet), so it is KEPT — but **proportioned**: it returns as the CRT bloom/scanline tint (`--amiga-phosphor`) and the nameplate `!`, *framing* the red ball rather than *being* it. Red icon, magenta halo — the two primaries co-star.
- **REFRAMED the A2 audit verdict** from "weak / off-canon" to "right color, raw plumbing" — the red was never the defect; the literal was.
- **AMPLIFIED, did not abrogate, the four pillars.** GLASS (the `rounded-card` bezel is refined into a monitor surround, still a glass card), PAPER (the grid-bg drafting substrate is explicitly preserved *behind* the CRT overlay, never deleted), TYPOGRAPHY (Instrument Serif pushed to masthead-bold + the magenta `!`), MATHEMATICS (a new opt-in **bounce-trace graticule** makes the engine's `bouncingY` apex math visible as a faint CRT overlay — the "keep the element, ADD the math as an easter egg" pattern, not a replacement of ball/room).
- **FOLDED the signature moments as proportionate easter eggs.** The power-on BOOT and the wall-slam restore are framed as *delights on entry/double-click*, never a permanent re-theme; the bounce-trace graticule, the spin→bloom flare, and the boing-hint pulse are all additive, low-alpha, and the first things dropped under `prefers-reduced-motion`.

Net: a measured, surgical CRT refinement of the taste-approved language — crayon red kept and named, magenta proportioned to atmosphere, every pillar enhanced rather than swapped.

---

## §Implementation plan (priority order)

**P0 — Tokenize the crayon red (5 min, highest leverage, color-PRESERVING).**
- `AmigaScene.vue:229` — `tesselateSphere("white", "red", …)` → `tesselateSphere("#ffffff", "var(--amiga-red)", …)`. The red is KEPT; only the raw literal is retired. Add `--amiga-red` (off `--rainbow-red`/`--accent-red`) + `--amiga-phosphor` (off `--primary`) tokens to `design-idioms.css :root`, beside `--subject-teal` at `:241` (the established per-scene-identity-hue precedent). This finally gives the crayon red a name and a dark variant — it does NOT recolor the ball.

**P1 — The CRT atmosphere overlay.**
- `AmigaScene.vue` template — add a `pointer-events: none` overlay `<div>` sibling to `<canvas>` (inside `.scene-root`). Author the scanline + grille + vignette + grain + curvature stack in the scoped `<style>` reading the new phosphor tokens.
- Darken the room: `:221-224` wall material → deep charcoal/navy; `:212-218` lighting → cooler, lower-key so the ball glows.
- Replace the flat CSS backdrop (`:380-384`) with the radial phosphor vignette.

**P2 — The nameplate + telemetry (identity + gesture discoverability).**
- `AmigaScene.vue` template — top-left `BOING!` nameplate (`text-display-3` Instrument Serif, masthead-bold + tight-tracked + `--amiga-phosphor` `!`) + Fira Code caption (`.code-token`). Bottom-right Fira Code telemetry corner (`decay · friction 2.4` or live rotation readout).
- Idle pulse on the `double-click to boing` caption (fixes A5).

**P3 — The power-on BOOT sequence (the signature).**
- New small composable `demo/amiga/useAmigaBoot.ts` (or inline) — orchestrates flash → roll → drop → settle, driving the *existing* `bouncingY`/`rotations` engine groups; hooked to the `IntersectionObserver` re-entry (`:314`). Transient `BOUNCE_FIT_MARGIN` boost to `~0.6` for the boot, easing back to `0.35`.
- All under `prefers-reduced-motion` guard (snap to rest pose, no flash/roll).

**P4 — Motion polish.**
- Re-enable slow ambient `rotations` drift (`useAmigaAnimations.ts:70`) at mount (PRM-guarded).
- Spin-velocity → bloom-intensity coupling (read `useSphereSpin.isGliding()`/velocity, drive a CSS bloom var).
- Hover-intensify scanlines/vignette; `:active` chromatic-aberration kick.

**P5 — Restore the slam permanently for double-click.**
- `onBoing` (`:142`) uses the boosted amplitude so the *feature* Boing kisses the walls (A7 fix), distinct from the polite ambient rest.

Guardrails honored throughout: the **crayon red checker is KEPT** (tokenized, not swapped); the magenta is **proportionate atmosphere** (bloom/scanline/`!`), framing the red, never overwriting it. Every CRT layer is `pointer-events: none` (the spin/orbit gesture model at `useSphereSpin.ts` is untouched); all motion stays on the engine (`CSSKeyframesAnimation`/`AnimationGroup`/`decay`) — no new rAF; `--amiga-red` is a token off the crayon `--rainbow-red`/`--accent-red` family and `--amiga-phosphor` off `--primary` (coherent, not a theme swap); `prefers-reduced-motion` disables flicker/flash/roll/graticule while keeping static texture. The four pillars are amplified, not abrogated: GLASS (the `rounded-card` bezel), PAPER (the grid-bg substrate behind the themed clear), TYPOGRAPHY (Instrument Serif masthead + Fira Code), MATHEMATICS (the bounce-trace graticule). The glass-ui register (`rounded-card`, Instrument Serif, Fira Code, `--type-*` rungs, `.code-token`) is extended, never broken.
