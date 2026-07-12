# Defect Dossier — Amiga Animation + Scene Suspend/Resume

**Tranche U · first-principles defect investigation · 2026-07-10**
**Status: ROOT-CAUSED (read-only investigation — nothing fixed). Fix charter at the end.**

> Owner report (2026-07-10, verbatim): *"our amiga animation, and our scene
> suspend/resume facilities have been broken for many tranches. These need to be
> investigated from first principles and fixed within this tranche."*
>
> The gates are green. This is a **vacuous-green** class defect.

---

## Executive summary

Two owner complaints resolve to **one dominant root cause** plus **one secondary
architectural gap**:

- **DEFECT A — the amiga animation freezes ~2 s into *every* play.** The boing
  ball's spin and wall-to-wall X-sweep advance for the first ≈2000 ms, then
  **freeze permanently**, pinned at the 25 %-keyframe pose (spun to `π`, parked
  hard-right at `+WALL_X`); the vertical bounce degrades to an erratic stutter.
  This is a **LIBRARY bug** in the `AnimationGroup` single-target compositor's
  *plain-vars projection* (`src/animation/compile/plain-vars.ts` +
  `src/animation/group/compositor.ts`): the projection caches `ValueUnit[]` leaf
  references that go **stale the instant a child animation crosses a keyframe
  segment boundary**. Reproduced live in the demo AND in an isolated
  built-engine harness.

- **DEFECT B — scene suspend/resume.** The suspend/resume **machinery is
  actually sound** — the cube group scene resumes and keeps animating across a
  round-trip, raw-rAF scenes (easing) suspend/resume cleanly, there is **no
  orphaned-rAF accumulation**, and teardown on leave is clean (7→1 loops). The
  owner's "suspend/resume broken" perception is **DEFECT A wearing a
  suspend/resume mask**: when you leave amiga and return, the *restored* group
  freezes at its restore segment within ~1 s, so resume *looks* dead. There is a
  genuine but **secondary** gap: amiga's tab-visibility pause governs only its
  WebGL render loop, never its animation-group simulation (§Defect B).

Amiga is singled out because it is the **only scene** that hits the buggy path: a
`singleTarget` group with a **custom object transform** (`unflatten = true`) over
**multi-segment (≥3-keyframe)** children. Cube uses the DOM/flat path; square uses
the multi-target path; both dodge the bug.

---

## Method / harness (trust nothing the gates claim)

- Built `dist/gh-pages` (`npm run gh-pages`), served statically, drove **chromium
  headless via playwright-core** (`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`).
- Instrumented `requestAnimationFrame` (wrapped before app load) to count live
  loops; sampled the scene's own non-DOM witness `window.__kfAmigaProbe.pose()`
  (`{px,py,spin,playing,...}`); pixel-diffed `canvas.amiga-canvas` element
  screenshots across time (the `drawImage`-into-2D approach returns blank for a
  `preserveDrawingBuffer:false` WebGL canvas — element screenshots are the honest
  pixel signal).
- Built an **isolated library reproduction** (`dist/engine/index.js` + an import
  map for `@mkbabb/value.js`/`@mkbabb/parse-that`) that rebuilds the amiga group
  setup byte-for-byte and mirrors the demo's `restoreGroupPlaybackState`, so the
  defect could be nailed to a library seam free of all Vue/scene machinery.
- Throwaway probe scripts live in the session scratchpad (not the repo).

> Harness footgun recorded: `npm run build` (the **library** build) wipes
> `dist/gh-pages`. A probe run against a stale gh-pages silently measures an
> empty app (probe absent, 0 rAF pending). Rebuild `gh-pages` after any `npm run
> build`.

---

## DEFECT A — the amiga sphere freezes ~2 s into play

### Measured evidence

**Live demo** (`#/amiga`, fresh load, press "Play animation", sample pose every
500 ms — `__kfAmigaProbe.pose()`):

| t after play | px (Bouncing X) | py (Bouncing Y) | spin (Spin) | playing |
|---|---|---|---|---|
| 500 ms  | 2.00 | −4.00 | 1.26 | true |
| 1000 ms | 4.04 | −4.00 | 2.54 | true |
| 1500 ms | 4.97 | −3.08 | 3.13 | true |
| **2000 ms** | **5.00** | −4.00 | **3.14** | true  ← last honest frame |
| 2500 ms | **5.00** | −4.00 | **3.14** | true  ← **FROZEN** |
| 3000 ms | **5.00** | −1.30 | **3.14** | true |
| 3500 ms | **5.00** | −4.00 | **3.14** | true |
| 4000 ms | **5.00** | −4.00 | **3.14** | true |
| 4500 ms | **5.00** | −0.22 | **3.14** | true |

`px` pins at `+5` (`WALL_X`) and `spin` pins at `π` (3.14) — **exactly the 25 %
keyframe values** — from t≈2000 ms onward, while the FSM still reports
`playing:true`. `py` (Bouncing Y) is not frozen but **erratic** (−4.0, −1.3,
−0.22 — jumping, not a smooth bounce).

Note the segment structure: Spin/Bouncing X have `duration = 8000 ms` with
keyframes at 0/25/50/75/100 % → segment frames `[0,2000] [2000,4000] [4000,6000]
[6000,8000]`. The freeze lands **exactly at the first boundary, t = 2000 ms**.

**Scene round-trip** (amiga → cube → amiga ×3, then measure — the "does it resume?"
test): after return, `playing:true`, but `pxRange = 0`, `spinRange = 0` over a
1.2 s window while `pyRange = 5.57`. Same freeze, reached faster because the
restore re-seats the clock past a boundary. Persisted snapshot confirms the
clocks: `Spin.t = 7115.7 (it 1)`, `Bouncing X.t = 7115.7 (it 1)`, `Bouncing Y.t =
532.5 (it 9)`.

**Isolated library repro** (no Vue, no scene machine — pure `AnimationGroup`):
the child clocks **advance correctly** (`Spin.t` 1751→2001→2260→…→3510) AND a
*direct* `interpFrames(t)` returns the **correct** value at every t
(`direct_interp(restored) == direct_interp(fresh) == 2.762, 2.369, 1.977, …` —
tracking the triangle wave down from π). But the **composited `pose.spin`
freezes** at 3.14 the moment t crosses 2000. This isolates the fault: it is
**not** the clock, **not** `interpFrames` — it is the group compositor's
**output projection** feeding the transform a stale leaf.

### Root cause (the exact broken seam)

The amiga group is `singleTarget = true` (children share no DOM target) and
`unflatten = true` (the custom `transform(vars)` reads `vars.position.x` /
`vars.rotation.y` as plain **numbers**). That combination routes each composite
through the **plain-vars projection**:

`src/animation/group/compositor.ts:172-182`
```ts
if (group.unflatten) {
    let proj = group._plainProj;
    if (proj === null) {
        proj = buildPlainProjection(groupedValues);   // built ONCE, caches leaf refs
        group._plainProj = proj;
    } else {
        refreshPlainProjection(proj);                  // re-reads the CACHED refs
    }
    group.transform(proj.root as V, t);
}
```

`src/animation/compile/plain-vars.ts` — the projection **captures the leaf array
reference** at build time and re-reads *that same reference* every frame:

- `plain-vars.ts:109` — `writers.push({ obj, key, units, numeric });`
  → `units` is the live `ValueUnit[]` **taken from `_grouped[key]` at build time**.
- `plain-vars.ts:120-126` — `refreshPlainProjection` writes
  `w.obj[w.key] = (w.units[0] as ValueUnit<number>).value` — dereferencing the
  **cached** `w.units`, never re-reading `_grouped[key]`.

The false assumption is stated verbatim in the module's own docstring:
> *"The projection is built ONCE (structure is stable across ticks — **only
> `.value` changes**)"*

That holds for a **single 2-stop** animation, but **not** for a multi-segment
one. Here is why it breaks:

Each frame, the compositor refreshes each child then reference-assigns into
`_grouped` (the `replace` arm, `compositor.ts:98-108`):
```ts
animation.interpFrames(animation.t, false, values);   // fills entry.values
...
for (const key in values) groupedValues[key] = values[key];   // _grouped[key] = a leaf ref
```
And `interpFrames`'s single-active-frame path **re-points** the buffer to a
**different `AnimationFrame`'s** leaf array whenever `t` crosses a segment
boundary (`src/animation/engine/interpolate.ts:187-194`):
```ts
if (lo === hi) {
    const fv = frames[seedIdx]!.flatVars;   // the ACTIVE frame's leaves
    ...
    Object.assign(out, fv);                  // out[key] now points at frame[seedIdx]'s leaf
}
```

So the identity of `_grouped["rotation.y"]` **changes** when Spin advances from
segment `[0,2000]` into `[2000,4000]`. But `group._plainProj` was built over the
`[0,2000]` leaf and is only rebuilt on a **structural change** (`_groupedKeysDirty`,
set by `invalidateEntries()`). Crossing a keyframe boundary is **not** a
structural change, so the projection keeps reading the **now-orphaned** `[0,2000]`
leaf — which `processFrame` no longer touches (only the active frame is
interpolated), so it stays frozen at its last value (the `π` / `+5` endpoint at
t=2000). → the transform receives a frozen number → the mesh freezes.

**Per-channel consequence.** Each channel freezes at the value it held when its
animation last left **its own frame[0]**:
- Spin & Bouncing X (8000 ms): leave frame[0] at t=2000 and effectively never
  return → **hard-frozen**.
- Bouncing Y (1600 ms): wraps every 1600 ms, briefly re-entering frame[0] each
  cycle → **erratic stutter** (animates the 0–400 ms slice of each loop, frozen
  the rest). This is the erratic `py` in the table.

### Why only amiga

| Scene | Group shape | Composite path | Affected? |
|---|---|---|---|
| **amiga** | `singleTarget=true`, `unflatten=true`, multi-segment children | `compositeFrame` → `group._plainProj` (stale) | **YES — freezes** |
| cube | `singleTarget=true`, `unflatten=false` (DOM target) | flat `_grouped` DOM apply, no projection | no |
| square | `singleTarget=false` (`SquareScene.vue:180`) | `renderMultiTarget` → each child's **own per-frame** `frame._plainProj` | no |
| easing/spring/sequence | raw-rAF, no `AnimationGroup` pose | — | no |

The **standalone** (non-group) plain-vars path is correct because each
`AnimationFrame` owns its *own* projection (`interpolate.ts:297`,
`frame._plainProj`) and `processFrame` uses the **active** frame's projection —
so a segment crossing swaps to the right projection. Only the **group
compositor's single shared projection over `_grouped`** is stale-prone, because
`_grouped`'s leaf identities are re-pointed under it.

Empirical confirmation of the isolation: **cube round-trips and keeps animating**
(6/6 distinct transform frames after cube→amiga→cube), proving the fault is the
projection, not the group lifecycle.

### Introducing commits

- **`efcb244`** — *"T.A6 (LIBRARY): plain-vars frame.transform contract"*
  (2026-07-05 05:59). Introduced `compile/plain-vars.ts` AND the group
  compositor's `unflatten` projection block. This is where the group's
  **single-shared-projection-never-rebuilt-on-segment-crossing** bug was born.
  (T.A6 itself *fixed* an earlier amiga defect — the mesh vanishing to `NaN` from
  arithmetic on array-boxed `ValueUnit`s — so amiga went from *NaN-vanish* to
  *segment-freeze*: it has not animated correctly across either form.)
- **`f060c17`** — *"T.A7–A12: amiga coupled rebuild — group-compositor ride…"*
  (2026-07-05 11:39). Made the amiga group **ride the single-target compositor**
  with `unflatten=true` + multi-segment authored arcs — i.e. the exact shape that
  triggers the `efcb244` bug. Amiga has frozen ~2 s into play since this commit.

Both land in **Tranche T** (2026-07-05); the freeze shipped live in 5.2.0 with
all gates green — hence "broken for many tranches."

---

## DEFECT B — scene suspend/resume

### The machinery is sound (measured)

- **Cube (group scene) resumes AND keeps animating** across cube→amiga→cube: 6/6
  distinct 3D-transform frames after the round-trip (vs 1/1 at cold rest). The
  snapshot/restore/`group.resume()` path works.
- **Raw-rAF scenes suspend/resume cleanly**: easing (autoPlays) → 1 live loop;
  navigate away → loop stopped; return → 1 live loop. No throw, no blank mount.
- **No orphaned-rAF accumulation.** Live-loop count across an 8-scene mixed switch
  sequence stayed bounded; the decisive orphan test — amiga playing (7 live
  loops) → leave to square — dropped to **1** loop, with `window.__kfAmigaProbe`
  gone (scene unmounted). Teardown is clean; the machine's `captureActive` →
  `adapter.suspend()` → `group.pause()` plus the scene's `onBeforeUnmount` +
  `useAmigaThree` `dispose()` release both of amiga's two loops.
- **Play-state is preserved** across switches (persisted snapshot round-trips
  `playing/started/per-child t/iteration`).

The historical raw-rAF suspend crash (the unbound `playback.stop` → `this._gen++`
throw) is genuinely fixed by `useRafScene`'s bound callbacks — `proof:fsm-suspend-
resume-live` witnesses that correctly.

**Therefore the owner's "suspend/resume broken" is, in the main, DEFECT A on
amiga's *resume*:** you leave a playing amiga, return, the restored group re-seats
its clock **past a segment boundary**, and the stale projection freezes it within
~1 s — indistinguishable from "resume didn't work."

### The genuine secondary gap: amiga's group is never suspended on tab-hide

Amiga runs **two independent rAF loops**:
1. the **WebGL present/render loop** (`useAmigaThree.ts` — `RAFPlayback`), and
2. the **AnimationGroup simulation loop** (`useAmigaDemo.ts` — drives the pose).

Its tab-visibility wiring governs **only loop 1**:

`demo/scenes/amiga/AmigaScene.vue:202-206`
```ts
useSceneVisibilityPause(
    () => three.running,   // probes the PRESENT loop
    () => three.stop(),    // stops the PRESENT loop
    () => three.start(),   // starts the PRESENT loop
);
```

The machine's `TAB_HIDDEN`/`TAB_SHOWN` is **status-only** (deliberately drives no
adapter — `useSceneMachine.ts:241-243`, to avoid double-acting the raw-rAF
scenes' own visibility pause). So on tab-hide, amiga's **group keeps ticking**
(advancing its wall-clock `startTime` clock) until the browser's own background
rAF throttle stops it. Consequences: (a) a **forward clock jump** on return (the
group used wall-clock `startTime`, so `effectiveT` leaps by the hidden duration —
the render loop resumes onto a teleported pose), and (b) wasted simulation while
occluded-but-not-throttled. This is real but minor vs DEFECT A, and is *masked*
today by DEFECT A freezing the sphere anyway.

(Also note: amiga's present loop is co-governed by an `IntersectionObserver`
(`AmigaScene.vue:212-223`) AND `useSceneVisibilityPause`; the "only resume what
IT paused" honesty contract keeps them from fighting, and probes show no stuck
state — but it is two authorities over one loop, worth folding.)

---

## Why the green gates missed both

The gates assert **adjacent/structural** properties, never the **core temporal
invariant** ("the composited pose advances continuously across every keyframe
segment for the full loop"). All three relevant gates sample *inside* the first
2000 ms segment or probe a *different* subsystem:

- **`proof:amiga-subject-is-pivot`** — asserts the sphere is centred and a
  centre-drag HITS it, via a **MAD (mean-absolute-difference) between two frames
  taken around a DRAG gesture**. It verifies "the centre re-textures" (a spin
  changes the centre) but is driven by the gesture and compares near-adjacent
  frames within the opening seconds — it never watches the **autonomous** bounce/
  spin over a ≥2 s window, so the freeze at t=2000 is outside its gaze.
- **`proof:amiga-decay-visible`** — asserts the **drag→`decay()` glide** via
  `window.__kfAmigaProbe.omega()`. `omega` reads the **gesture layer**
  (`useSphereSpin`), which is entirely independent of the frozen group pose — a
  flick still produces a decaying `omega` while the group animation is frozen. It
  passes regardless of the freeze.
- **`proof:fsm-suspend-resume-live`** — asserts **no-throw on visibilitychange +
  non-blank controls mount + the FSM `playing` flag round-trips** (clauses a/b/c).
  It checks the **state machine's flag**, not that pixels *move over time* after
  resume, and it primarily targets the raw-rAF scenes (the historical `_gen`
  crash). A scene that "resumes" (status=playing, loop armed) and then freezes
  **passes**.

Net vacuous-green: pivot-centering + gesture-decay + FSM-flag-round-trip are all
green while the one thing that matters — **the boing ball actually boinging past
2 seconds** — is unasserted.

---

## Git archaeology

```
efcb244  2026-07-05 05:59  T.A6 (LIBRARY): plain-vars frame.transform contract   ← bug BORN (group projection)
f060c17  2026-07-05 11:39  T.A7–A12: amiga coupled rebuild — group-compositor ride ← amiga starts TRIGGERING it
440e5c3  S.D1: partition demo/app/ into scene/·transition/·runtime/ (atomic move) ← useSceneVisibilityPause current home
b649ce3  T.B1-α: SceneFacility descriptor + group/sequence migration              ← facilityFromGroup / group adapter
```

- The freeze defect is entirely a Tranche-T introduction (`efcb244` +
  `f060c17`), shipped live in 5.2.0.
- `demo/app/runtime/useSceneVisibilityPause.ts` has only ever moved (S.D1 atomic
  partition), never changed behaviour — the tab-hide "group not suspended" gap is
  original to the two-loop amiga design, not a regression.
- The suspend/resume *machine* (`sceneMachine.ts` / `useSceneMachine.ts` /
  `scenePlaybackAdapters.ts`) is post-H.W1 and tested sound here.

---

## The U fix charter

### Fix A (PRIMARY — the freeze): make the group's plain-vars projection track live leaf identity

The defect is a **cached-reference-vs-re-pointed-source** mismatch. The idiomatic
cure keeps the zero-alloc intent while removing the staleness. Options, best-first:

1. **Re-resolve from `_grouped` each refresh, not from a cached `units` ref.**
   Have `refreshPlainProjection` read the *current* `_grouped[flatKey]` leaf (the
   writer stores the **flat key + the source map**, not the leaf array), so when
   the compositor re-points `_grouped[key]` at the new active frame's leaf, the
   refresh follows it. This is the smallest correct change and preserves the
   numeric fast path (still a bare `.value` read once the live leaf is resolved).
   *Seam:* `plain-vars.ts:96-126` (writer holds `{obj,key,sourceMap,flatKey}`);
   `compositor.ts:172-182` passes `_grouped` as the live source each frame.

2. **Invalidate the group projection on active-frame change, not only on
   structural change.** Drop `group._plainProj` (like the `_soaPlans`/
   `_groupedKeysDirty` seam) whenever any child's active-frame set changes, so the
   next composite rebuilds it. Coarser (rebuild cost per boundary) but a minimal
   diff at `compositor.ts` + a per-child "active frame changed" signal.

3. **Rebuild-free identity check.** In `refreshPlainProjection`, if
   `_grouped[key] !== w.units`, re-descend that one writer. A guard rather than a
   redesign.

Option **1** is the gestalt cure — it makes the projection a *view* over the live
composite rather than a snapshot of it, which is what "refresh" already claims to
be. Whatever the choice, the fix belongs in the **library** (`plain-vars.ts` +
`compositor.ts`), not the demo — every future `unflatten` multi-segment group
would otherwise re-hit it.

**Born-RED gate to add:** a library test that plays a `singleTarget`+`unflatten`
group whose child has ≥3 keyframes for **> its first segment duration** and
asserts the transform receives values that **continue changing after the first
boundary** (assert `Set(sampledValues).size` grows across ≥2 segments). Plus a
demo/runtime gate: navigate `#/amiga`, press Play, sample `__kfAmigaProbe.pose()`
for **≥3 seconds**, assert `spin` and `px` each show motion in the **[2000ms,
3000ms]** window (not just [0,2000ms]). This is the exact assertion all three
current gates omit.

### Fix B (SECONDARY — suspend/resume symmetry): govern amiga's group with its render loop

The suspend/resume *machinery* needs no change. Close the amiga-specific gap so
"suspend" means both loops, symmetric with the raw-rAF scenes:

- Make amiga's tab-visibility pause suspend **both** the present loop **and** the
  animation group (pause the group on hide, resume on show), so the group's
  wall-clock does not drift while hidden and there is no forward jump on return —
  the same "genuine suspend, jump-free resume" contract `useRafScene` already
  honours for raw-rAF scenes. Route it through the group adapter's
  `suspend()/resume()` rather than a second bespoke mechanism.
- Fold amiga's **two loop authorities into one suspend contract** (the
  `IntersectionObserver` occlusion-pause + `useSceneVisibilityPause` + the
  machine's `TAB_HIDDEN`), so a single "should this scene be simulating right
  now?" predicate governs both the render loop and the group — mirroring the
  consolidated `useRafScene` recipe the other scenes already share.

Once Fix A lands, Defect B's user-visible symptom (resume looks dead) disappears;
Fix B is the correctness/battery tidy-up that makes suspend/resume honest for the
two-loop WebGL scene.

---

## Appendix — reproduction artifacts (session scratchpad, not committed)

- `repro.html` — isolated built-engine reproduction of the amiga group + the
  demo's `restoreGroupPlaybackState`, with direct `interpFrames` introspection.
  Proves child clocks advance + `interpFrames` is correct while the composited
  pose freezes at the first segment boundary.
- `uprobe2.mjs` — live-demo pose + canvas pixel-diff across cold-rest / play /
  tab-hide / scene round-trip.
- `uprobe3.mjs` — live 4 s fresh-play freeze series + suspend/resume facility
  characterization (easing resume, rAF-leak sweep, amiga orphan check).
- `cube-probe.mjs` — cube (DOM group) cold-rest / play / round-trip motion,
  proving the suspend/resume machinery + the projection-isolation.
