# Lane R2-02 — Live verification of U's behavior claims (amiga · suspend/resume · compositor)

**Auditor lane:** R2-02 · **Prefix:** BV- · **Model:** opus · **Date:** 2026-07-17
**Subject:** the audit copy (`…/scratchpad/kf-audit-copy`, fresh Glass linkage), dev server `:5197`
**Method:** playwright-core@1.53.1 `channel:'chrome'`, headless; live `#/amiga` drive + library-level
`AnimationGroup` harness imported from the running vite graph
(`/@fs/…/src/animation/index.ts` → `loadAnimationEngine()`); probes in session scratchpad
(`probe{1,2,6,7,8,9}.mjs`, `shots.mjs`).

## Verdict

R1-11 (PR lane) flagged OD-U13 (*"amiga + scene suspend/resume … fixed from first principles"*)
and OD-U14 (*"compositing/stacking/layering assayed + fixed in U.C"*) as **UNVERIFIED — coverage
gaps** that must not ride a third close unexercised. **I exercised every load-bearing claim live and
they HOLD.** The amiga freeze the U dossier root-caused (`defect-amiga-suspend-resume.md` DEFECT A /
`assay-compositor-behavior.md` D1) is **gone**: the sphere's `px`/`spin` keep moving continuously
across the t=2000 ms segment boundary and for the full loop (the exact window all three shipped U
gates omitted). The two compositor defects the behavioral assay added beyond the dossier — **D2**
(`add`/`weighted` layer contribution collapsing to the base at the first boundary) and **D3** (a
removed layer's keys staying frozen-applied) — are **both fixed** at the library seam: `add` composites
exactly (22 / 33 / 27.5 / 22 across the boundary), and a removed layer's key leaves the composite. The
U.C14 `CompositeState` cure is present in source (`src/animation/group/composite-state.ts`, owned
leaf store + `pruneInactive`) and behaves as chartered. Suspend/resume across scene switches is sound
(resumes + moves, rAF bounded 3↔5, zero orphan growth over 10 switches). Tab-visibility shows **no
forward-jump drift** and resumes playing.

**No primary claim failed live — there is no P1 green-over-broken row in this lane.** The three
findings below are low-severity formation notes (a charter-vs-code divergence with no live symptom, a
weighted-op numeric anomaly worth a spot-check, and a demo-unreachable D3 path). The dominant
deliverable is the **negatives**: R1-11's two coverage gaps are CLOSED with live evidence.

---

## Confirmed-fix negatives (the core charge)

### BV-N1 — OD-U13 amiga freeze (D1) is FIXED live — motion continues past 2 s

**Family:** vacuous-green-now-cured (was FAM-adjacent behavior)

`probe1/probe2.mjs`: navigate `#/amiga`, click `[aria-label="Play animation"]`, sample
`window.__kfAmigaProbe.pose()` every 500 ms for 4.5 s:

```
t=0    px=0.038 py=-0.823 spin=0.0241 playing=true
t=1000 px=3.106 py=-3.751 spin=1.9515 playing=true
t=1500 px=4.676 py=-0.030 spin=2.9379 playing=true
t=2000 px=4.951 py=-2.779 spin=3.1105 playing=true   ← the dossier's freeze point
t=2500 px=3.952 py=-1.430 spin=2.4832 playing=true   ← MOVING (dossier: px pinned 5.00, spin pinned 3.14)
t=3000 px=1.929 py=-0.356 spin=1.2120 playing=true   ← MOVING
t=3500 px=0.340 py=-4.000 spin=0.2136 playing=true
t=4000 px=-0.044 py=1.225 spin=-0.0275 playing=true
t=4500 px=-1.048 py=-2.000 spin=-0.6584 playing=true
```

LATE-window `[2000,3500]`: px distinct = 4, spin distinct = 4 → **MOTION_PAST_2s**. The dossier's
signature freeze (`px` pinned at `+5.00` / `spin` pinned at `π=3.14` from t≈2000 onward) does not
reproduce. Six rapid frames at ~80 ms are all distinct (`-0.6757 -0.8816 -1.0863 -1.3259 -1.5277
-1.7751`) → smooth motion, not a stutter. ≥5-frame motion on the boundary-crossing transition
confirmed (task minimum met and exceeded: 9 half-second samples + 6 rapid samples).

Source corroboration: `src/animation/group/composite-state.ts` implements the U.C14 owned
`CompositeState` (leaf store the compositor writes, `copy`/`mark`/`pruneInactive`), and
`compositor.ts:34,231` threads it — the stale-leaf cache class is cured at its root.
`src/animation/compile/plain-vars.ts` (the D1 stale-writer file) is **deleted** (`git status: D
src/animation/compile/plain-vars.ts`).

### BV-N2 — OD-U14 D2 (`add`/`weighted` blend collapse) is FIXED

**Family:** compositor stale-leaf (assay-compositor-behavior §b/§c′)

Library harness (`probe7.mjs`) built through the running engine: base `{0%:1,50%:3,100%:1}` +
`add` layer `{0%:10,50%:30,100%:10}`, both 4000 ms (boundary 2000), driven synchronously
`advanceTo`/`render`; composite read from `g._composite.compositeState.values`:

```
t=1000 v=22   (base 2 + add 20)   ✓
t=2000 v=33   (base 3 + add 30)   ✓  boundary
t=2500 v=27.5 (base 2.5 + add 25) ✓  PAST boundary — add contribution PERSISTS
t=3000 v=22   (base 2 + add 20)   ✓  PAST boundary
```

The assay's failure was `t=2000 v=3`, `t=3000 v=2` (add gone, composite = base alone). Now the add
layer contributes exactly across and past the boundary. A single-layer control (`baseAlone`)
returns `2 / 3 / 2` — confirming the +20/+30/+20 delta is the live add contribution. The flat/SoA
`add` path (the one the dossier declared safe only because cube used `replace`) is correct.

### BV-N3 — OD-U14 D3 (layer-removal key leak) is FIXED

**Family:** compositor union-membership (assay-compositor-behavior §h)

`probe7.mjs`: group of `base{o:0.5}` + `extra{x:10→20→10}`; render at t=1000 → composite keys
`["o","x"]`; remove `base`; render at t=6000 → composite keys `["x"]` only. The removed layer's
`o` key **leaves the composite** (the assay's failure was `o` staying frozen-applied). The
`CompositeState.pruneInactive()` / union recompute closes it.

### BV-N4 — Scene suspend/resume across switches is SOUND (no leak, resumes + moves)

**Family:** suspend/resume machinery (dossier Defect B — "machinery sound")

`probe2.mjs`:
- **Round-trip** amiga→cube→amiga ×3, then play: post-round-trip `playing=true`, 6 distinct spin
  and 6 distinct px samples over a 2 s window → **RESUMES + MOVES** (the dossier's "resume looks
  dead" symptom was DEFECT A on resume; with A fixed, resume is live).
- **rAF leak sweep** (10 alternating switches): live-loop count `3,5,3,5,3,5,3,5,3,5` — bounded,
  per-scene growth = **0**. amiga steady-state = 5 loops, cube = 3; leaving amiga drops cleanly.
  No orphaned-rAF accumulation.

### BV-N5 — Compositor stacking/layering renders clean at 1280 and 390 (no z-fights)

**Family:** layering / stacking (OD-U14 "stacking and layering" — the owner's named primary issue)

`shots.mjs` z-index probe + screenshots. Explicit z-order is a clean monotone stack with no equal-z
overlap contention over the stage:

```
1280: dock/timeline/menubar z=40 · header-ribbon z=35 · bar z=30 · controls-pane-wrapper z=20 · stage z=10
 390: dock z=40 · glass-drawer(controls) z=39 · header-ribbon z=35 · bar z=30 · stage z=10
```

Captures (into `docs/tranches/V/audit/design-captures/`):
- `bv-amiga-controls-over-stage-1280.png` — controls glass card + transport dock over the live 3D
  stage; sphere mid-animation (checkerboard, contact shadow), Pause toggled → playing. No z-fight.
- `bv-amiga-controls-over-stage-390.png` — mobile controls drawer (z=39 glass-overlay) peeking over
  the stage, dock above it, sphere rendered above the drawer. Clean sheet stacking.
- `bv-amiga-stage-{1280,390}.png`, `bv-cube-controls-1280.png`, `bv-square-controls-1280.png` —
  DOM-group (cube) and multi-target (square) stages both composite cleanly with the controls pane.

---

## Findings (low-severity formation notes)

### BV-1 — Fix B (U.B13) not folded into the source as chartered, though no live symptom — P3

**Family:** charter-vs-code divergence / suspend-symmetry

The U.B13 charter (`waves/U.B.md:143,695`) and the dossier Fix B required amiga's tab-visibility to
suspend **both** the WebGL present loop **and** the animation-group clock through ONE symmetric
suspend seam, "no drift-then-jump on tab return." In source the group is still **not** governed by
visibility — `AmigaScene.vue:202-206` `useSceneVisibilityPause` probes/stops/starts only
`three` (the render loop); the group is paused only in `onBeforeUnmount` (`:226`). So the literal
"fold both loops into one suspend contract" wave did not land as written.

**However the predicted symptom is absent live.** `probe8.mjs`: play, note pre-hide `spin=2.6612`,
dispatch `visibilitychange→hidden` (rAF drops 5→1), wait 2000 ms, `→visible`, sample immediately:
first post-show `spin=2.6919` — **firstPostShowJump=0.0308**, well under one normal 50 ms frame delta
(0.135). No forward teleport. `probe9.mjs`: after a 1500 ms hide the group resumes `playing=true` and
keeps moving (`spin -0.043 → -0.365`). The group's managed play loop evidently halts with the render
frame rather than free-running a wall clock, so the dossier's drift-then-jump does not occur.

One inconsistency worth a formation spot-check: at a longer (2000 ms) hide, `probe8` observed the
post-show `spin` decaying `2.69→0.13→0.08→…→0.004` (the T.A8 settle-home glide, i.e. `playing`
briefly read false), whereas the 1500 ms hide resumed cleanly. This is a minor, non-user-breaking
edge, likely an artifact of the synthetic `visibilitychange` override; flag for a formation
re-measure, not a wave.

**Disposition (note/retire):** the OD-U13 *user-visible* mandate is discharged (no jump, resumes).
Decide in V formation whether the U.B13 "one suspend seam" is still owed as a correctness/battery tidy
(group ticks while occluded-not-throttled) or retired as satisfied-by-behavior — with the settle-on-
long-hide edge re-measured first.

### BV-2 — `weighted`/explicit-`weight` composite grows monotonically past the peak — P3

**Family:** composition-vocabulary semantics (U.C15)

`probe7.mjs` D2weight: two layers `a{0→100→0}` + `b{0→200→0}` (triangle, peak at t=2000), each
`op:'add', weight:0.5`. The composite is **non-collapsing** (the D2 defect is cured) but the values
are `t1000=150, t2000=450, t2500=675, t3000=825` — **monotonically increasing** while both
underlying waves are symmetric about t=2000 and descending after it. A static-weight `add` should be
symmetric (peak at 2000), not climbing to 825 at 3000. This smells like the explicit `weight`
engaging the K.W11 weight-spring ramp (`advanceLayerSprings(dt)`) or a weight-normalization path
accumulating across frames. It is **not** a freeze/collapse (the lane's failure criterion), so it does
not fail the OD-U14 claim — but the numbers are semantically suspect.

**Disposition (spot-check):** V formation should confirm the `op+weight` fold's steady-state math
(static weight → symmetric composite) with a born-checked golden; the pure `op:'add'` path (BV-N2) is
already correct, so this is isolated to the `weight` axis.

### BV-3 — No public layer-removal API; D3 fix is demo-unreachable — P3

**Family:** dead/absent affordance

`probe6/7.mjs`: the `AnimationGroup` prototype exposes
`setLayerConfig / setLayerEnabled / getLayerConfig / transitionLayer / crossfade` but **no**
`remove`/`removeAnimation`/`drop` method (removal required direct `delete g.animations[key]` +
`invalidateEntries()`). The D3 fix (BV-N3) is correct, but — matching the assay's own note that D3 is
reachable "only via direct `group.animations` mutation" — no demo control can remove a layer, so D3 is
untriggerable by a user. Harmless (correct when it happens) but the born-RED D3 gate the U charter
specified must drive removal through the same private seam, not a public API.

**Disposition (note):** informational; fold into the OD-U14 gate-authoring row if V mints one.

---

## Negatives (checked, sound)

- **amiga freeze fixed** (BV-N1) — motion past 2 s, 15 distinct samples across the loop.
- **D2 `add` blend fixed** (BV-N2) — exact 22/33/27.5/22 across boundary; control isolates the delta.
- **D3 removal fixed** (BV-N3) — removed key leaves the composite.
- **suspend/resume machinery sound** (BV-N4) — resumes+moves, rAF bounded, zero orphan growth (10 switches).
- **stacking/layering clean** (BV-N5) — monotone z-stack, no z-fight, at 1280 and 390; cube (DOM
  group) and square (multi-target) stages composite cleanly with controls.
- **tab-visibility: no forward-jump drift** (BV-1) — firstPostShowJump 0.0308 « normal frame delta.
- **`CompositeState` cure present in source** — `composite-state.ts` owned leaf store + `pruneInactive`;
  `plain-vars.ts` (the D1 stale file) deleted; `soaPlans` live in `_composite`.
- **op vocabulary landed** — `op: 'replace'|'add'|'accumulate'` (`constants/defaults.ts:91-96`,
  `emit/backward-walk.ts:82-85`), the U.C15 axis.

## Coverage gaps (out of this lane)

1. **Weighted/`accumulate` op steady-state semantics** (BV-2) — needs a dedicated golden; I verified
   non-collapse but not numeric correctness of the `weight` axis.
2. **Group WAAPI lowering (U.C16)** — not exercised; the assay flagged "no group WAAPI path." Whether
   U.C16 landed a per-layer eligibility + native `target.animate(composite)` delegation is unverified
   here (the group children still run rAF in every probe). → a WAAPI-parity lane.
3. **Blend on `singleTarget=false` (multi-target) groups** — the assay noted `add`/`weighted` are a
   no-op there yet the `LayerConfigPanel` selector is exposed (square is multi-target). Not re-driven
   live. → an appearance-axis lane.
4. **The settle-on-long-hide inconsistency** (BV-1) — re-measure with a real background tab, not a
   synthetic `visibilitychange`, to rule out probe artifact.
