# Tranche H Deep Audit — Lane `a-glassmorphism-perf`

**Charge (D2/D5 perf angle).** Is the glassmorphism (`backdrop-filter`) + the
radial-blur glow + per-element `box-shadow` the cause of the LAG? Live-measure
paint/composite cost and the dock animation FPS; weigh `content-visibility`,
`will-change`, blur-radius cost. MEASURE-FIRST. Propose perf transpositions
(demo-side) + a glass-ui-HANDOFF for the dock.

**Method.** Live demo at `http://localhost:5174/` driven via Playwright MCP
(branch `tranche-h-dev`). Source grep/read over `demo/` and
`node_modules/@mkbabb/glass-ui@3.4.0/dist/styles/*`. Every FPS / frame-time
number below is a `requestAnimationFrame`-delta histogram captured in-page (the
falsifiable instrument is reproduced under each finding). Host is high-end
(~120 Hz refresh, `devicePixelRatio = 1`) — see the **DPR caveat** which is the
single most important framing of this whole lane.

---

## TL;DR — the honest, measured verdict

**The blur is NOT the bottleneck on this host, and probably not the primary
bottleneck of the lag the user reports.** Every glassmorphism path I stressed
held **~121 fps with zero frames > 20 ms** at `dpr = 1`:

| Trial (live, in-page rAF histogram) | avg fps | p95 ms | p99 ms | frames > 16.7 ms |
|---|---|---|---|---|
| Idle, `/easing` (593 els) | 121 | 10.0 | 10.4 | 0 |
| Specular pointer-storm on a dock-icon (`mix-blend:screen` `::before`) | 121 | 10.1 | 10.3 | 0 |
| Dock-recipe synth: animate `padding`+`box-shadow` OVER `blur(11px)` | 121 | 9.5 | 10.0 | 0 |
| Backdrop raster sweep `blur(0/8/12/16/24px)`, 80% viewport | — | — | — | flat **8.3 ms median at every radius** |
| Backdrop raster `blur(16px)` at FULL viewport | — | — | — | 8.3 ms median |

The backdrop-filter raster cost was **flat across 0→24 px blur** — the GPU
absorbs it entirely at `dpr = 1`. This is the load-bearing measurement of the
lane: **on a capable GPU at logical resolution, glassmorphism blur is free.**

So the user's "everything lags" is **device-class-dependent** (the cost is real
but only bites on integrated-GPU / high-DPR / mobile, where backdrop re-raster
scales by *physical* pixels ≈ `dpr²`), and the **dock lag is a JS/layout-morph
coupling inside glass-ui**, not the blur. The findings below disposition each
mechanism accordingly. This lane refuses to claim a perf win it could not
measure (inv ε).

---

## Finding G1 — Backdrop blur is free at dpr=1; the risk is the dpr² scaling nobody is guarding (D2/D5)

**Anchor (measured + source).** Live: backdrop raster sweep above — flat 8.3 ms
median for `blur(0)` through `blur(24px)` at 80% viewport, and still 8.3 ms at
`blur(16px)` full-viewport. Source: glass-card uses
`backdrop-filter: var(--glass-blur-quiet)` =
`blur(10px) saturate(1.05) brightness(1.02)` (`glass.css:182`,
`tokens.css --glass-blur-quiet`); the dock uses `blur(11px)`
(`--glass-blur-dock-radius: 11px`); overlay tier reaches `blur(24px)`
(`--glass-blur-overlay-radius: 24px`, the second definition). Live inventory at
desktop: **8 backdrop-filter layers**, radii {10×3, 11×2, 12×3}.

**Why it still matters (the honest nuance).** A backdrop-filter rasterizes over
*physical* pixels. My host is `dpr = 1`; a Retina laptop is `dpr = 2` (4× the
pixels), a phone `dpr = 3` (9×). The same `blur(16px)` overlay that costs 8.3 ms
here can cost 30–70 ms on an integrated-GPU Retina machine when stacked
(overlay-blur over card-blur over dock-blur = glass-on-glass double-raster). The
demo has **no upper guard** on simultaneous blurred layers and **no
`@media (prefers-reduced-transparency)`** fallback that drops blur for a flat
tint — the two idiomatic escape hatches. The blur is *also* re-rasterized every
frame it (or its backdrop) changes; see G2.

**Gestalt fix (demo-side + glass-ui-side).**
1. **glass-ui-HANDOFF:** add a `@media (prefers-reduced-transparency: reduce)`
   arm in `glass.css`/`tokens.css` that swaps `--glass-blur-*` → `none` and
   lifts `--glass-bg-*` opacity to a solid tint (the accessibility-and-perf
   escape the spec was minted for). glass-ui owns the tokens; this is one rule
   at the source, not a demo patch.
2. **Demo-side (SHIP-in-H):** stop *stacking* blurred surfaces. The overlay
   scrim (`--z-overlay`) need not blur when a blurred dock + blurred cards are
   already painting beneath it — pick ONE blur plane per stacking context. Audit
   the 8 live layers and demote the redundant ones to a flat `--glass-bg-*`
   tint (no `backdrop-filter`).

**Disposition.** glass-ui-HANDOFF (the PRT media arm) + MEASURE-FIRST
(demo-side layer demotion — re-run the histogram on a `dpr=2` emulation before
claiming the win).

**Falsifiable instrument (`proof:glass-dpr`).** A Playwright bench that loads
each route at `dpr ∈ {1,2,3}` (Playwright `deviceScaleFactor`) on a
CPU-throttled context and asserts `p95 frame-time < 20 ms` during a 1.5 s pointer
hover-storm. Gate: no route may exceed the budget at `dpr=2`.

---

## Finding G2 — The hover treatment animates `box-shadow` over a blurred card → per-frame paint of the blur region (D2/D14)

**Anchor (source + measured).** `AnimationControlsControls.vue:3` and
`KeyframeTimeline.vue:3` apply `class="… transition-shadow duration-normal
glass-card"`. Live computed: `.glass-card` resolves
`transition-property: box-shadow` over `backdrop-filter: blur(10px) saturate
brightness`, `will-change: auto`, `contain: layout style`, `isolation: auto`.
On hover the card grows its `box-shadow` — and because the card carries a
backdrop-filter, that shadow transition **dirties the card's compositing layer
every frame, re-running the 10 px backdrop raster** for the transition's full
`--duration-normal`. This is the demo-side half of the "hover blur" the user
sees in D2/D14: a *painted* hover effect, not a free composite. (Measured cheap
at `dpr=1` — G1 — but it is the textbook anti-pattern that bites at `dpr=2`.)

**Why it is the wrong idiom (spine: idiomatic, not workaround).** The depth
affordance that D2 *wants back* is the **cartoon-shadow** (a flat, offset,
hard-edged drop shadow — closed in Tranche C, regressed). A cartoon shadow is a
**static, pre-rendered `box-shadow`** that can be promoted with the hover
*scale/translate* (compositor-only) instead of animating the shadow blur itself.
The current `transition-shadow` animates the expensive axis (shadow geometry +
its underlying blur re-raster); the cartoon-shadow idiom animates the cheap axis
(transform).

**Gestalt fix (demo-side, SHIP-in-H).** Restore the cartoon-shadow as the demo's
depth/hover idiom in `design-idioms.css`: a `.cartoon-shadow` utility with a
fixed offset hard shadow at rest and a *larger* fixed shadow on hover, where the
hover *transition is on `translate`/`scale`* (the lift), NOT on `box-shadow`.
Pair it with `:hover` lifting the element via `translate: -2px -2px` so the
shadow "pops" by relative motion (compositor) rather than by repainting the
shadow. Replace the `transition-shadow` class on the two `.glass-card` panels.
This reconciles with D14: the **specular radial stays** (the glass is good — G3),
the **cartoon-shadow becomes the depth layer**, and the hover no longer repaints
a blurred surface.

**Disposition.** SHIP-in-H (demo-owned idiom; pairs with the cartoon-shadow
restoration the D2/D14 design lane owns).

**Falsifiable instrument (`proof:hover-composite`).** A test that hovers each
`.glass-card` and asserts (a) the hover transition-property set contains no
`box-shadow` and no `backdrop-filter`, only `transform`/`translate`/`scale`; and
(b) a 600 ms hover holds `p95 < 16.7 ms` at `dpr=2`.

---

## Finding G3 — The specular `::before` is cheap and correct; the defect is its tuning/blend, not its perf (D2/D14)

**Anchor (source + measured).** `glass-ui/dist/styles/glass-specular-track.css`:
the `.glass-specular-track::before` is a masked
`radial-gradient(circle at var(--specular-x) var(--specular-y) …)` with
`mix-blend-mode: screen`, transitions on typed `@property` `--specular-x/-y` +
`opacity`, intensity `0.35` rest → `0.6` hover → `0.85` active. Live: **7
specular `::before` layers** with `mix-blend-mode: screen`. Pointer-storm trial
(above) held **121 fps, 0 long frames** — the catch-light is GPU-cheap because
it is a small gradient layer, not a backdrop pass.

**Verdict — ALREADY-SOTA on perf (inv ε honesty).** The specular implementation
is exemplary: it explicitly avoids a second `backdrop-filter` ("no glass-on-glass
— the specular is a LIGHT layer"), drives intensity via *layer opacity* (not a
per-stop `calc()` that Chromium drops to 0 — documented in the file), uses typed
`@property` for smooth position interpolation, and ships a
`prefers-reduced-motion` static pin. There is **no perf defect here.**

**The actual D2/D14 defect is perceptual, not performance.** What the user calls
a "circular/radial blur artifact" is this `screen`-blended radial catch-light
reading as a soft glowing disc instead of a tight specular highlight. That is a
*tuning* concern (gradient stop radii 0/22/55%, the `screen` blend lifting hard
on light surfaces) owned by the D14 hover-refinement design lane — **not** this
perf lane. From the perf seat: keep it; it is free.

**Gestalt note for the design lane.** If D14 narrows the catch-light (smaller
mask radius, lower mid-stop alpha), perf is unaffected (smaller gradient = same
or cheaper). The `mix-blend-mode: screen` is the only mild cost-amplifier (it
forces the `::before` into its own blending pass); if the refined highlight can
use plain `normal` blend with a baked warm tint, that removes a blend pass — a
marginal, dpr²-scaling win worth measuring.

**Disposition.** glass-ui-HANDOFF (any blend-mode change is glass-ui's
file) + RECORD (perf is already SOTA; the visual refinement is the D14 lane's,
not this lane's).

**Falsifiable instrument (`proof:specular-noblend`).** If D14 drops `screen`:
assert `getComputedStyle(el,'::before').mixBlendMode === 'normal'` and re-run the
pointer-storm at `dpr=2` to confirm the blend-pass removal holds frame budget.

---

## Finding G4 — The dock lag is a JS width-FLIP + `padding`/`background`/`box-shadow` transition over a blurred surface — glass-ui-owned (D5, the headline lag)

**Anchor (source + live).** Live: 2 `.glass-dock.horizontal` elements,
`transition-property: padding, box-shadow, transform, background, border-color`
@ `0.3s` each, `backdrop-filter: blur(11px)`, **`will-change: auto`**,
**`contain: none`**. Source confirms the mechanism is *layered*:
- `dock.css:262` horizontal docks transition `padding/box-shadow/transform/
  background/border` (the comment at `:257` notes width is deliberately NOT in
  the transition — it is driven separately).
- `dock.css:466` + `dock-controls`/`useLayerTransition`: `.dock-layers` width is
  driven by a **`SpringProgress` FLIP writing inline `width` per frame**
  (`dock.js:156`,`:210`,`:572` read `getBoundingClientRect()` each transition).
- `dock.css:527-529` carries a documented history: *"the items appeared to
  lag"* — a known prior dock-morph fragility.

**Why this lags (root cause).** Three per-frame costs stack on the *same* dock
element during expand/collapse: (1) the inline `width` FLIP forces **layout**
every frame; (2) `padding` is also in the CSS transition — a **second layout
trigger**; (3) `box-shadow` + `background` transitions force **paint**; and all
of it sits on a `backdrop-filter: blur(11px)` surface with **no `contain` and no
`will-change`** to bound the invalidation. Layout → paint → backdrop-re-raster,
every frame, on the largest chrome element on screen. At `dpr=1` this is masked
(synthetic dock-recipe trial held 121 fps); at `dpr=2`/mobile it is exactly the
"broken / slow / laggy" the user reports (D5). The route-change I observed firing
on a `.collapsed` toggle (it destroyed the JS context mid-measure) also points to
**JS coupling** between dock state and scene routing — overlapping with the D12
scene-state corruption lane.

**Gestalt fix (glass-ui-HANDOFF — DO NOT patch in kf).** glass-ui's active AW
dock tranche should:
1. Drive the morph on **compositor-only axes**. `width` and `padding` are both
   layout-dirtying; a FLIP should animate `transform: scaleX()` (with a
   counter-scaled inner content) or use the native
   `interpolate-size: allow-keywords` / `calc-size()` width interpolation
   (Baseline-ish 2024+) *without* the parallel inline-`width` spring — the
   retired `@supports` arm at `dock.css:469` shows they already know the
   dual-driver race; the lesson is to pick ONE driver, not to layout-animate.
2. Drop `background` and `box-shadow` from the per-frame transition during the
   morph (snap them, or cross-fade via opacity of a sibling) so the blurred
   surface is not repainted every frame.
3. Add `will-change: transform` (scoped to the *transitioning* state only, then
   removed) and `contain: layout paint` on the dock so the invalidation is
   bounded and the surface is pre-promoted to its own layer.

**Disposition.** glass-ui-HANDOFF (the dock is glass-ui's, actively worked in
their AW tranche; this lane SUGGESTS, does not patch — per the cross-repo
mandate). Tag the lag root-cause for their tranche.

**Falsifiable instrument (`proof:dock-morph-fps`).** A Playwright bench (in
glass-ui's repo, referenced from H) that triggers the dock expand→collapse cycle
under `dpr=2` + 4× CPU throttle and asserts `p95 frame-time < 16.7 ms` and
**zero** layout-trigger entries in the transition window (verify via
`PerformanceObserver` `layout-shift` / a `getBoundingClientRect` call-count
probe stays flat during the animation, proving no per-frame layout read).

---

## Finding G5 — No `will-change` discipline on the moving/hovered glass surfaces; `content-visibility` opportunity off-screen scenes (D5/D10 perf)

**Anchor (live).** `.glass-card` → `will-change: auto`; dock → `will-change:
auto`; specular `::before` → `will-change: auto`. The only `will-change` in the
demo source is `EasingTarget.vue:304 will-change: transform` (one site). Live
inventory found `content-visibility: hidden` on exactly **1** element. The demo
has **2 fixed docks + N scene panels all mounted simultaneously** (the route
cycled cube→easing→starting-style→sequence during measurement with everything
apparently retained).

**Why it matters.** (1) A blurred surface that is about to animate benefits from
a *transient* `will-change` (promote → animate → release) so the compositor
pre-allocates the layer and skips the first-frame promotion hitch — but
`will-change` left ON permanently is itself a memory/raster cost, so the
discipline is "on during transition, off at rest," which nothing here does.
(2) Off-screen scene targets (the inactive routes' `.glass-card` stages) keep
their `backdrop-filter` alive even when not visible; `content-visibility: auto`
+ `contain-intrinsic-size` on the non-active scene roots would skip their
rendering work entirely (rasterization + the backdrop pass) until routed in —
directly relevant to D10's "page contextually changing by mode" and the
multi-scene mount.

**Gestalt fix (demo-side, SHIP-in-H).**
- Add a transient `will-change: transform` only while a surface is mid-transition
  (Vue: bind it on the transition-active state, drop on `transitionend`), or via
  a `.is-animating` class the existing playback state toggles. Do NOT bake it on.
- Apply `content-visibility: auto` + `contain-intrinsic-size` to the *inactive*
  scene-target roots so a non-routed scene's blurred stage costs nothing. This
  composes with the D12 scene-state-machine work (the machine knows which scene
  is active → it can toggle the visibility hint).

**Disposition.** SHIP-in-H (demo-owned, `design-idioms.css` + scene roots),
MEASURE-FIRST on the `content-visibility` win (instrument below).

**Falsifiable instrument (`proof:offscreen-cv`).** With ≥2 scenes mounted,
assert the inactive scene root computes `content-visibility: auto` and that a
`dpr=2` idle histogram on the active scene improves (fewer backdrop layers in
the paint tree — verify via `chrome://tracing` layer count or a
`PerformanceObserver` paint-duration delta) versus the all-mounted baseline.

---

## Finding G6 — `progress-dot` glow animates `box-shadow` blur/spread via custom-property `calc()` every frame (D5/D6 perf-adjacent)

**Anchor (source).** `design-idioms.css:263-269`:
```css
--glow-spread: calc(2px + var(--dot-p) * 3px);
--glow-blur:   calc(var(--dot-p) * 1.5px);
box-shadow: 0 0 var(--glow-spread) var(--glow-blur)
            color-mix(in srgb, var(--color-progress) 40%, transparent);
```
`--dot-p` (0–1) is updated per frame by the playing-progress rAF loop, so the
`box-shadow` blur+spread+color-mix **re-evaluates and repaints every animation
frame** for the duration of playback. This is the candidate D2 cited for the
"radial blur." It is small (a status dot), so the *cost* is minor, but it is the
same anti-pattern as G2: animating shadow geometry instead of a transform.

**Honest scope note.** This is small and the file's own comment correctly notes
the *gradient* is driven allocation-free by one custom property (true, good).
The remaining issue is only the `box-shadow` *blur/spread* axis being animated.
For a tiny dot this is unlikely to be the user's headline lag — flagging it for
completeness and consistency with the cartoon-shadow idiom (G2): the demo should
animate glow via *opacity of a pre-blurred layer* or *scale of a fixed glow*, not
via animated `box-shadow` blur.

**Disposition.** RECORD (low-cost; fold into the G2 cartoon-shadow idiom pass so
the demo has ONE glow strategy: animate opacity/scale of a fixed shadow, never
the shadow's blur radius).

**Falsifiable instrument (`proof:dot-glow`).** Assert the `progress-dot`'s
animated property during playback is `opacity` or `transform`, not `box-shadow`,
and that a 2 s playback at `dpr=2` adds < 1 ms p95 over a static-dot baseline.

---

## Cross-cutting note for the synthesis (the framing this lane most wants carried)

The user's "everything lags" is **plausibly NOT the blur** — it is (a) the
**glass-ui dock morph** doing per-frame layout+paint over a blurred surface (G4,
glass-ui-HANDOFF, their active AW tranche), and (b) **device-class scaling**
(`dpr²`) that this dpr=1 host cannot reproduce (G1). The demo-side glassmorphism
is mostly *correctly* built (the specular track is SOTA — G3); the demo-side
SHIP work is small and idiomatic: stop animating `box-shadow`/`backdrop-filter`
on hover (cartoon-shadow instead — G2), don't stack blur planes (G1), add
transient `will-change` + off-screen `content-visibility` (G5), unify the glow
strategy (G6). **No quick fixes proposed; no measurement claimed beyond what was
instrumented (inv ε).** H must re-measure at `dpr=2` + CPU throttle before
shipping any "perf win," because at `dpr=1` there is nothing to fix in the blur.
