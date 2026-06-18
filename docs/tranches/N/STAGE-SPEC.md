# Tranche N — the Stage switcher: first-principles ATOMIC stage spec

> Authored from the owner's prompts (the last several turns), 2026-06-18. The prior
> fleet bake produced a working-but-WRONG, SLOW selector. This resets to first
> principles: each choreography stage is an **atomic unit** with (a) a precise
> correct-behaviour definition, (b) the **dogfood** mechanism (which of OUR libraries
> drives it — `SpringProgress`/`NumericAnimation`/`stagger`/`Sequence`/`decay` on
> `RAFPlayback`, inv ζ: no hand-rolled rAF), and (c) a **measurable** acceptance
> criterion verified LIVE in Chrome via chrome-devtools-mcp (a perf trace / a
> computed-style read / an observed frame sequence — not a vibe). Stages are built +
> verified **one at a time, in order**; a stage is not "done" until its measurement passes.

## The choreography (the owner's vision, distilled)

From the cube view, activating the scene switcher: a grand, sweeping, smooth **zoom-out**;
the controls + docks **fade**; the bottom dock becomes the **L/R arrows**; the scenes
**animate into place** as a downward-tilted carousel disk (back higher than front, ~15°) of
**real, live, interactive, LOD-throttled previews**; hover **brightens** the stage toward the
hovered item + shifts focus off-centre; clicking/arrowing **spins** a card to front then
**fades into** that scene; the selected scene's state is preserved; each scene has a new
interactive idle. Smooth liquid-glass throughout. The two failures named: **SLOW** (perf) and
**WRONG** (the motion/geometry/feel is not right).

## The atomic stages (built + measured in order)

### S0 — Baseline measurement (no code; establish the truth)
- **Do:** open the current Stage in Chrome, record a **performance trace** during open +
  spin, read the FPS + long tasks + scripting cost; screenshot each phase.
- **Measure:** the actual FPS during the carousel (the "slow" quantified); the per-phase
  timing; which work dominates (the amiga WebGL? the previews? layout?). This is the number
  every later stage is judged against.

### S1 — The invocation (atomic: click → open)
- **Behaviour:** clicking the scene-switch affordance opens the Stage **immediately** (no lag,
  no dropdown). The affordance must be obvious + reliable.
- **Dogfood:** n/a (state toggle).
- **Measure:** click → `.scene-stage` becomes visible within 1 frame; a clean console.

### S2 — The zoom-out (atomic: the live scene recedes)
- **Behaviour:** the live scene scales down + recedes **grandly, smoothly** toward the front
  carousel slot — a single continuous motion, no snap, no jank.
- **Dogfood:** a `SpringProgress` drives the scene-host `scale`/`translate` (response ~0.6,
  damping ~0.85 — calm, no overshoot). NOT a CSS transition guessed by eye.
- **Measure:** the scene-host transform samples a smooth monotonic scale curve across ≥30
  frames at ≥58 FPS (perf trace); the spring `.value` matches the painted transform.

### S3 — The chrome fade + the dock→arrows morph (atomic)
- **Behaviour:** controls + `ChromeDock` fade out; the bottom `TransportDock` morphs its cells
  into the two glassy L/R arrows (same shell), smoothly.
- **Dogfood:** the arrow micro-motion (idle shimmer / hover swell / press recoil) rides
  `SpringProgress`/`decay`.
- **Measure:** controls `opacity` → 0; the two `[aria-label="Previous/Next scene"]` arrows
  present + ≥44px; no layout thrash in the trace.

### S4 — The carousel GEOMETRY (atomic: the disk is correct at rest)
- **Behaviour:** a disk tilted **back-higher ~15°** (verified `rotateX(-15deg)`); 7 cards on a
  ring; front = nearest/largest/**lowest** on screen, back = smallest/**highest**; the falloff
  (scale/opacity/brightness) is monotonic by |angle|; darks LIFTED (flanks clearly visible).
- **Dogfood:** the per-card transform is pure trig off ONE ring-angle (no per-card animation).
- **Measure:** read each card's `getBoundingClientRect().top` — the back card's top < the
  front card's top (back higher); front card width > flank width > rear width (depth); no card
  opacity < ~0.4.

### S5 — The fan-in (atomic: cards animate into place)
- **Behaviour:** on open, the cards stagger INTO the ring (from centre outward), the cube
  landing front — a smooth, deliberate settle.
- **Dogfood:** `stagger(from:'center')` distributes the per-card reveal delay; each card's
  entry rides the ring-angle `SpringProgress` settle (no separate timers).
- **Measure:** the reveal delays are monotonic from centre; the settle completes < ~900ms at
  ≥58 FPS.

### S6 — The live LOD previews (atomic: real previews, FAST) — THE "SLOW" FIX
- **Behaviour:** each card shows the **real** scene subject, live + interactive in small form;
  the FRONT runs full-rate, flanks throttled (~15–20 FPS), rear paused (content-visibility);
  the amiga WebGL is the outlier (low-fps or single-frame poster when not front).
- **Dogfood:** ONE shared throttled clock (`NumericAnimation`/`SpringProgress` tick on a single
  `RAFPlayback`) gates every preview's advance — no preview owns a rAF.
- **Measure (the crux):** a perf trace during the open carousel holds **≥55 FPS** with all 7
  cards; the amiga ReadPixels stall is gone; total scripting per frame < ~8ms. This is the
  number the owner called "slow" — it must be quantified GREEN here.

### S7 — The spin-to-front (atomic: smooth, interruptible)
- **Behaviour:** arrow / flank-click / ←→ spins the chosen card to front by the **shortest
  signed angular delta**, a hair of overshoot, fully interruptible mid-spin.
- **Dogfood:** ONE `SpringProgress` on the ring angle; `setTarget` re-seats from live
  (value, velocity).
- **Measure:** the ring-angle spring samples a smooth curve to the target at ≥58 FPS; a
  mid-spin re-target does not snap (velocity continuous); ~420–520ms per adjacent step.

### S8 — Hover-brighten + focus-shift (atomic)
- **Behaviour:** hovering a flank slides the downlight toward it (`--stage-light` up locally)
  and de-emphasises the centre, ~200ms, smooth.
- **Dogfood:** a `SpringProgress` drives `--stage-light` + the pool-x.
- **Measure:** `--stage-light` / `--stage-pool-x` interpolate (registered `@property`); the pool
  centroid moves toward the hovered card.

### S9 — The commit (atomic: spin-to-front → zoom INTO the scene)
- **Behaviour:** Enter / centre-click spins to front (if needed) then **reverse-zooms** the
  front card up into the live scene; controls/docks fade back; state preserved; routes through
  the existing `runSceneSwitch`.
- **Dogfood:** the reverse zoom mirrors S2's `SpringProgress`.
- **Measure:** post-commit `machine.activeScene` = the picked id; the controls return; 0 errors.

### S10 — The liquid-glass + downlight aesthetic (atomic: the LOOK)
- **Behaviour:** a genuinely theatrical volumetric downlight cone → glowing floor pool over the
  dimmed grid-paper (never black); premium glass cards; refraction/specular on front + arrows.
  Crisp, not murky; reads in light AND dark.
- **Measure:** visual judgment from a high-res Chrome screenshot at each of dark + light; the
  cone is a clear shaft; the cards read as premium glass; no murk.

## Working method (the owner's mandate)

1. **One stage at a time, in order.** Do not start S(n+1) until S(n)'s measurement passes.
2. **Chrome DevTools MCP is the oracle** — every stage is verified in a real Chrome against the
   running demo (http://localhost:8766), with a perf trace where FPS matters (S2,S5,S6,S7) and a
   computed-style / rect read where geometry matters (S4,S8). Screenshots for the aesthetic (S10).
3. **Dogfood our libraries** — every motion is driven by `@mkbabb/keyframes.js` LIGHT-barrel
   primitives on `RAFPlayback` (inv ζ). No hand-rolled rAF, no eyeballed CSS-transition timings
   for the load-bearing motion.
4. **Atomic commits** — one stage, one verified commit, on `n-stage-impl`.
