# Tranche U — Audit Lane 19: demo-scenes

**Lane:** 19/32 · **Slug:** demo-scenes · **Scope:** `demo/scenes/**` (all six fused scene dirs) + the cross-scene runtime recipes they consume (`demo/app/runtime/`, `demo/app/scene/sceneFacility.ts`).

**Discipline:** read-only; every claim below carries a `file:line` cite read from the live tree at `master`/`tranche-t-impl` (5.2.0). Development-only — proposals are charter asks, not edits.

---

## Headline

The six scenes are individually SOTA but collectively **un-converged**: the raw-rAF "sweep scene" recipe (`useRafScene`) that was extracted to kill the easing↔spring duplication was only wired into **2 of the 4** rAF-owning scenes — `sequence` and `square` each re-hand-roll the identical RAFPlayback + adapter + visibility-pause + start/stop recipe, and `sequence` even regresses the very 60 Hz-reactive-write anti-pattern the extraction cured. There is a real, nameable **"sweep scene" skeleton** (phase∈[0,1] + sampler + painter-registry + throttled readout + `useRafScene` + RESET) latent across easing/spring, plus a **painter-registry** primitive duplicated byte-for-byte, plus a **dogfood inversion** where scenes hand-roll unit- and color-parsing the constellation (value.js `ValueUnit`/`Color`) already owns.

---

## The scene inventory (as read)

| Scene | rAF owner | machine-gated | painter registry | reactive-progress cadence |
|---|---|---|---|---|
| easing | `useRafScene` (`useEasingDemo.ts:238`) | yes (`:211`) | `registerDotPainter` (`:192`) | throttled `PROGRESS_READOUT_HZ` (`:181,226`) |
| spring | `useRafScene` (`useSpringDemo.ts:253`) | yes (`:196`) | `registerSpringPainter` (`useSpringHotPath.ts:106`) | throttled (`useSpringHotPath.ts:137`) |
| sequence | **bespoke** `mirror = new RAFPlayback()` (`useSequenceDemo.ts:188`) + hand-wired adapter (`:392`) + hand-wired visibility-pause (`:438`) | yes (`:194`) | none | **UN-throttled 60 Hz** (`:180,191`) |
| square | **bespoke** `new RAFPlayback()` (`useSquareDemo.ts:217`) + own `startLoop` (`:325`) | n/a (host FSM) | single `transformFunc` (no registry) | painted only |
| cube | `AnimationGroup`-owned loop (`useCubeDemo.ts:88`) | via group | — | — |
| amiga | three.js `present` loop (`useAmigaThree.ts:97,200`) + render-on-demand (`:206`) | via group | — | — |

Five scenes, **four different rAF-ownership idioms**. `useRafScene`'s own docstring (`useRafScene.ts:14-22`) states the recipe was consolidated because "the easing + spring scenes HAND-WIRED the identical recipe … BOTH made the SAME binding mistake" — yet the consolidation was never carried to `sequence`/`square`, which re-hand-wire it today.

---

## Findings

### F1 (major, structural-duplication) — `useRafScene` extraction stopped at 2 of 4 raw-rAF scenes

`useRafScene` (`demo/app/runtime/useRafScene.ts`) owns, for a raw-rAF scene: the `markRaw(RAFPlayback)`, bound idempotent `startLoop`/`stopLoop`, the `createRafAdapter` wiring, `onScopeDispose(stopLoop)`, and `useSceneVisibilityPause` registration with bound callbacks. Easing (`useEasingDemo.ts:238`) and spring (`useSpringDemo.ts:253`) consume it.

`useSequenceDemo.ts` re-implements every one of those seams by hand: `mirror = markRaw(new RAFPlayback())` + `startMirror`/`stopMirror` (`:188-196`), a hand-rolled `startLoop`/`stopLoop` pair (`:215-241`), a hand-built `createRafAdapter` (`:392-405`), a hand-wired `useSceneVisibilityPause(...)` (`:438-442`), and its own `onScopeDispose` (`:447-450`). `useSquareDemo.ts` likewise owns `new RAFPlayback()` (`:217`), a bespoke `startLoop` (`:325-330`), and `onScopeDispose(dispose)` (`:468`). This is the exact class of duplication (down to the visibility-pause binding hazard the docstring memorializes) the recipe exists to abolish.

**Proposal (gestalt):** the raw-rAF recipe must be the *single* home for rAF ownership across ALL rAF scenes. `sequence` has a genuine wrinkle — it drives TWO concurrent loops (the `Sequence`'s own play loop + a progress mirror) — so `useRafScene` should be generalized to a **`useManagedLoop`** primitive (own the RAFPlayback + bound start/stop + dispose + visibility-pause) that both the sequence mirror and the sweep scenes compose, rather than sequence forking the whole recipe. `square` is a pure sweep-less paint loop and should consume the same `useManagedLoop` for its RAFPlayback lifecycle. No scene should ever again type `new RAFPlayback()` at scene scope.

---

### F2 (major, perf) — sequence writes the reactive `progress` ref every frame at 60 Hz, the exact anti-pattern easing/spring were refactored away from

The sequence mirror loop calls `syncFromSequence()` every frame (`useSequenceDemo.ts:191-195`), and `syncFromSequence` writes the reactive ref `progress.value = ...` unconditionally (`:179-181`). Easing and spring were explicitly restructured (I.W4 D4 / J.W2 S5) so the reactive progress ref is written at most `PROGRESS_READOUT_HZ` (~6–12 Hz) with the 60 Hz truth living in a non-reactive snapshot (`useEasingDemo.ts:161-230`, `useSpringHotPath.ts:27-46`). Sequence never got that treatment: its reactive `progress` (consumed by the storyboard readout + any `computed` off it) re-renders at the full frame rate, plus it runs a *second* whole rAF loop (the mirror) alongside `Sequence`'s internal play loop purely to poll one scalar.

**Proposal:** fold sequence onto the same hot/cold split. The mirror loop is redundant if the sequence's own `RAFPlayback` frame can expose a throttled-readout hook; route the reactive `progress` write through `useThrottledReadout(PROGRESS_READOUT_HZ)` (already shared — `useEasingDemo.ts:181`, `useSpringHotPath.ts:52`), and drive any continuous position (the scrubber thumb) off a non-reactive channel exactly as spring's `scrubberPhase` does (`useSpringHotPath.ts:85,144`). One loop, one throttle, parity with siblings.

---

### F3 (major, structural-duplication) — the painter-registry is a duplicated primitive with no shared home

Easing's `dotPainters` (`useEasingDemo.ts:186-201`) and spring's `springPainters` (`useSpringHotPath.ts:101-117`) are the identical construction: a `new Set<Painter>()`, a `register(paint)` that adds + paints-once + returns an unregister closure, and a `repaint()` that iterates the set. Consumers are symmetric (`EasingTarget.vue:284`, `SpringTarget.vue:199`, `SpringPhysicsFacet.vue:152`). Square is the degenerate one-target case (a single `transformFunc`, `useSquareDemo.ts:97`).

**Proposal:** extract `usePainterRegistry<P>()` beside `useRafScene`/`useThrottledReadout` in `demo/app/runtime/` — `{ register, repaintAll }` over a `Set<P>`, paint-once-on-register baked in. Easing and spring consume it; the "hot path off the Vue render graph" idiom becomes ONE audited primitive instead of two hand-copies, and the pattern is available for any future moving-dot scene.

---

### F4 (major, architecture) — there is a latent "sweep scene" skeleton; easing and spring re-assemble it in full

Easing and spring's Sweep channel are the *same machine*: a phase∈[0,1], a `NumericAnimation`/sampler ping-ponging 0→1→0 (`useEasingDemo.ts:155`, `useSpringDemo.ts:165-174`), a `frame()` that gates on `machine.status !== "playing"` and reconciles-on-stop (`useEasingDemo.ts:208-218`, `useSpringDemo.ts:190-205`), an `onArm` `startTime` rebase from live phase (`useEasingDemo.ts:243`, `useSpringDemo.ts:259-261`), a `scrubTo`/`setProgress` that repaints while idle, a `reset()` that `machine.dispatch({type:"RESET"})`, and a `SceneFacility` whose channel `progress/setProgress` clamps a phase. Both also derive `isPlaying` via `useSceneTransport(machine)` (`useEasingDemo.ts:76`, `useSpringDemo.ts:182`).

That's ~120 lines of near-identical control-plane re-typed per scene, and it is why `useEasingDemo.ts` (442L) and `useSpringDemo.ts` (496L) are both near the 500L ceiling.

**Proposal (architectural transposition):** promote the shape to a **`useSweepScene({ sample, duration, onScrub })`** recipe layered over `useRafScene`, owning: the phase clock + `startTime` rebase, the machine gate + reconcile-on-stop, the `useSceneTransport` wiring, the `useThrottledReadout` cold path, the `usePainterRegistry` hot path, and the `RESET` dispatch. Easing becomes `sample = phase => sweep.at(phase).p`; spring supplies its multi-track sampler. The scenes shrink to their genuinely-distinct payload (easing's curve catalog; spring's solver + presets + heatmap), and the control-plane has one authority.

---

### F5 (major, dogfood/no-legacy) — scenes hand-roll unit- and color-parsing the constellation already owns

`useSquareDemo.ts` hand-writes a `num()` unit normalizer that parses `"42px"→42` and `"108%"→1.08` (`:75-87`) — the exact job of value.js `ValueUnit`. It also hand-rolls sRGB color parsing + a manual channel lerp: `toRGB()` (hex/`rgb()` parsing, `:187-202`) and `sweepHue()` (a linear RGB mix, `:206-214`), plus `resolvePaletteSweep()` reading `--rainbow-*` tokens (`:167-183`). The demo already imports value.js `Color` (per `demo/CLAUDE.md` Key Dependencies) and the *library's* headline is perceptual (oklab) color interpolation — which `SpringHeatmap.vue:169` correctly uses via `color-mix(in oklab, …)`. So the demo is internally inconsistent: one scene dogfoods perceptual color, another hand-rolls a naive sRGB lerp for the same "sweep across rainbow tokens" job.

**Proposal:** the square tumble palette-sweep must consume value.js `Color` (perceptual mix) instead of `toRGB`/`sweepHue`, and `num()` must be deleted in favor of `ValueUnit` parsing. This is a NO-legacy / dogfood ask: the demo cannot hand-roll primitives the constellation ships and that the demo exists to showcase.

---

### F6 (minor, colocation-consistency) — the square easter-egg was never colocated out, unlike its siblings

Spring extracted its egg to `useSpringDerby.ts` (`useSpringDemo.ts:309`), sequence keeps its reel egg inline but small, and square's "Tumble palette-sweep" egg is ~90 lines inlined into `useSquareDemo.ts` (the `springSpin` tracker `:155`, `PALETTE_SWEEP_FALLBACK`/`paletteSweepHues` `:160-161`, `resolvePaletteSweep`/`toRGB`/`sweepHue` `:167-214`, the per-frame sweep + `data-palette-sweep` marker `:269-292`). This inlined egg is the single largest reason `useSquareDemo.ts` is 471L.

**Proposal:** colocate the tumble egg into `scenes/square/useSquareTumble.ts` (the derby precedent), which also localizes the F5 color-parsing so its cure is contained. This drops `useSquareDemo.ts` well under ceiling and makes the egg-colocation policy uniform across all scenes.

---

### F7 (minor, duplication) — animation→channel `progress/setProgress` boilerplate is re-hand-rolled per raw-rAF scene

`facilityFromGroup` already derives, for a group member, the `progress: () => clamp(anim.t/dur)` / `setProgress: t => anim.t = clamp(t)*dur` channel pair (`sceneFacility.ts:96-106`). The raw-rAF scenes re-type that same clamp-by-duration math inline: spring's Entry channel (`useSpringDemo.ts:414-424`) and its Sweep channel's scrub, sequence's channel (`useSequenceDemo.ts:418-423`). Duplicated numeric clamp/duration logic across the facility surface.

**Proposal:** extract a `channelFromAnimation(anim, name)` helper in `sceneFacility.ts` and have both `facilityFromGroup` and the raw-rAF scenes construct channels through it — one clamp-by-duration authority.

---

### F8 (minor, lifecycle-consistency) — teardown seam differs across scenes (`onBeforeUnmount` vs `onScopeDispose`)

`useAmigaThree.ts:252` uses `onBeforeUnmount(dispose)` while every composable-tier scene uses `onScopeDispose` (`useRafScene.ts:112`, `useSquareDemo.ts:468`, `useSequenceDemo.ts:447`). Both fire on unmount, but the scenes have no `<KeepAlive>` (per `useRafScene.ts:31`), so `onScopeDispose` is the house idiom for "genuine unmount teardown." The amiga three.js dispose itself is exemplary (full geometry/material traverse, `:223-237`; render-on-demand gating `:206`) — this is purely the registration-seam inconsistency.

**Proposal:** standardize teardown on `onScopeDispose` across all scene units (amiga included) so the "no KeepAlive → scope-dispose is the teardown" contract reads uniformly.

---

## What U must charter

1. **Generalize `useRafScene` into a `useManagedLoop` primitive** and route `sequence` + `square` through it — no scene may own a bare `new RAFPlayback()` at scene scope (F1).
2. **Kill sequence's 60 Hz reactive-progress write**: fold it onto the hot/cold split (`useThrottledReadout` cold path + non-reactive position channel), eliminating the redundant second mirror loop (F2).
3. **Extract `usePainterRegistry<P>()`** into `app/runtime/` and consume it from easing + spring, retiring the two byte-identical hand-copies (F3).
4. **Charter a `useSweepScene` recipe** over `useRafScene` that owns the phase-clock + machine-gate + transport + readout + painter + RESET control-plane; refactor easing + spring onto it to drop both composables under the 500L ceiling (F4).
5. **Mandate dogfood for unit/color parsing**: delete `num()` (use `ValueUnit`) and replace `toRGB`/`sweepHue` with value.js `Color` perceptual mix — NO hand-rolled primitives the constellation ships (F5).
6. **Colocate the square tumble egg** into `useSquareTumble.ts`, uniform with the derby precedent, localizing the F5 color cure (F6).
7. **Extract `channelFromAnimation`** in `sceneFacility.ts` as the single clamp-by-duration channel authority for both group and raw-rAF facilities (F7).
8. **Standardize scene teardown on `onScopeDispose`** across all scene units, amiga included (F8).
