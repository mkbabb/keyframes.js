# U.C — THE LIBRARY TRANSPOSITION

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Band role (charter §2).** *"The unified value.js-free Transport core (dissolving the
> three copied play FSMs — engine/group/sequence); group.ts carved to engine symmetry;
> the spring closed-form unified into ONE modal kernel (the vector.ts verbatim copy
> deleted); SmoothProgress's managed-play carve completed; physics/spring/{solver,css}/ +
> compile/{emit,easing}/ carves (LIGHT/HEAVY preserved); the surface collapse —
> `loadAnimationEngine = () => import("./public")`, AnimationEngine type derived not
> hand-spelled, index.ts's 150-line type re-list deleted; presets 34×4 hand-lists → data;
> ingest's seekAndPlay primitive; env.d.ts → demo."*
>
> **The one-sentence thesis.** The library is ~80% mature (R.W1's 11-zone partition +
> S.B's sub-zone carves landed cleanly) — but it built the same *play machine three times*,
> the same *spring ODE twice* (a correctness hazard, not hygiene), spells its *HEAVY surface
> five times* behind a fleet of drift-gates that a single composition barrel already
> obviates, hand-maintains *34 presets × 4 parallel lists*, and lets ingest/sequence/group
> *poke raw FSM fields* through a public back door the carve deferred. U.C transposes each
> duplication into ONE source of truth. **No new features; every wave is a pure
> transposition or a defect cure a lane found.**
>
> **Ring-fences that bind this band (charter §4).** (2) **LIGHT/HEAVY is a HARD constraint** —
> `physics/`, `orchestration/`, the Transport leaf stay value.js-free (`proof:boundary`);
> HEAVY (`engine`/`group`/`compile`/`resolve`/`ingest`/`scroll`/`waapi`/`svg`/`presets`)
> stays behind `loadAnimationEngine()`/`./engine`. **No carve crosses the static/dynamic
> boundary.** (1) **value.js internals are OFF-LIMITS** — U.C10's two consume-edges are
> ASKS routed through U.F's letter, never a parallel arm of an upstream fix. (5) The two
> package "in"s (`.` + `./engine`) remain the only entries; U.H's characterization net locks
> their observable behavior BEFORE any move here.
>
> **The OD-U8 COMPATIBILITY CONSTRAINT (RULED 2026-07-10 — 5.3.0).** The owner ruled the
> close version **5.3.0**, which BINDS this band to a COMPATIBLE published surface: **no
> published symbol or entry may be REMOVED or RE-SHAPED.** U.C's exports rationalization,
> dead-export excisions, and transport-verb additions land **ADDITIVELY / internally** — a
> NEW symbol (`seek`/`adoptClock`/`seekAndPlay`, `driveScrollCSS`) is fine; the FSM-poke
> retirement touches only the UNDOCUMENTED internal raw-field surface (all callers
> internal). The waves once flagged "potentially BREAKING" (C2/C11/C13) carry this as a
> HARD constraint; anything that would truly break the published surface is OUT of U's
> scope (the breaking major is later, NOT U).
>
> **Provenance lanes:** 11-lib-engine-group (F1–F6), 12-lib-compile-resolve-validate
> (F1–F8), 13-lib-physics-orchestration (F1–F7), 14-lib-ingest-scroll-waapi-svg-presets
> (F1–F8), 15-lib-surface-boundary (F1–F8), 16-lib-colocation-map (F1–F7).

---

## The load-bearing conclusion (why this band exists)

Four duplications, each verified on the live tree (`master`, 5.2.0), each with ONE gestalt cure:

1. **Three transport machines, one skeleton, no shared contract** (lane 11 F1). The
   play/pause/resume/stop/settle FSM — re-entrancy guard, `withReducedMotion` fork,
   `resolvePromise` deferred, held-promise identity contract — is copy-authored in
   `engine/play-lifecycle.ts`, `group/lifecycle.ts`, and `orchestration/sequence/{lifecycle,
   transport}.ts`. `grep 'interface Transport|Playable'` → **zero hits**. A fix to the
   `finally`-clear ordering must be made in three places.
2. **The spring closed-form ODE implemented twice** (lane 13 F1 — **CORRECTNESS HAZARD**).
   `solver.ts:36-77` is the single kernel `solveDampedHarmonic`; the scalar path consumes
   it (`progress.ts:39`), but `vector.ts:126-151` **re-inlines the identical three-case
   algebra** (verified — the `z<1 / z===1 / else` branch is a byte-copy of `solver.ts:47-76`).
   The docstrings assert they "ring the SAME closed form"; the code copies it. No gate
   catches algebraic divergence.
3. **The HEAVY surface spelled five times** (lane 15 F1–F3). `load-engine.ts` (interface +
   `Promise.all`/`Object.assign` roster), `public.ts` (the composition barrel), `index.ts`
   (~150-line type re-list), + two CLAUDE.md prose inventories — coherent only via an
   ~8-gate drift-belt. `public.ts` *already is* the single source of truth; every heavy
   front door today = 5 hand-edits + a green run of 8 gates.
4. **Presets: DATA masquerading as CODE** (lane 14 F1). 34 near-identical factory closures
   (`classic.ts`) over 34 raw string consts (`classic-data.ts`), a 34-name barrel
   (`index.ts`), a 28-name taxonomy (`taxonomy.ts`) — four lists kept in lockstep by hand;
   adding one preset is a 4-file edit; a name typo silently drops a surface.

Plus the deferred single-writer fold (16 accessor delegates the engine exposes only so
external drivers can poke raw FSM fields — `playback-state.ts:32-33` names and defers it),
and a cluster of NO-LEGACY carves the two long-flat zones owe.

---

## Wave index

| id | title | size | oracle (existing mechanism — no new standalone gate) | lanes |
|---|---|---|---|---|
| **U.C1** | **THE TRANSPORT CORE — one FSM, three drivers** · KEYSTONE | XL | vitest (transport behavior net, U.H) + `proof:boundary` (leaf stays LIGHT) | 11 F1/F4; 13 F5 |
| **U.C2** | The single-writer seam: `seek`/`adoptClock`/`seekAndPlay`; retire the 16 FSM-poke delegates | L | vitest (ingest/sequence/adopt goldens, U.H) + tsc (the poke surface is gone) | 11 F2; 14 F2/F7 |
| **U.C3** | `group.ts` carved to engine symmetry + shape-stable composition | M | vitest (group blend goldens) + `bench` (idle-toggle stays fast-props) | 11 F3/F5 |
| **U.C4** | **THE SPRING MODAL KERNEL — one ODE, both perf profiles** | M | vitest (scalar≡vector trajectory equality, the hazard oracle) + `proof:boundary` | 13 F1/F4/F6 |
| **U.C5** | SmoothProgress managed-play completion — the `ManagedStepper` contract | M | vitest (smooth/spring managed-play parity) + `proof:boundary` | 13 F2 |
| **U.C6** | Engine correctness hygiene: `_out` reentrancy + composition base-capture reparse | S | vitest (reentrant `.at()` witness; composite-base parity) | 13 F7; 11 F6 |
| **U.C7** | `physics/spring/` colocation — `solver/` + `css/` sub-modules | M | `proof:boundary` (both sub-modules LIGHT) + `proof:zone-cohesion` re-anchor | 16 F1 |
| **U.C8** | `compile/emit/` + `compile/easing/` colocation — the emitter trio under one roof | L | `proof:boundary` (HEAVY preserved) + a18 FORWARD↔`emit/` re-anchor | 16 F2; 12 F3 |
| **U.C9** | compile backward de-accretion — `refusal-probes.ts` + >350L carves + primitive dedup | L | vitest (compileToCSS/Entry/VT emit goldens unchanged) | 12 F2/F4/F7 |
| **U.C10** | value.js consume-edge honesty — excise dead `PARSE_ERROR`; BOOK the WAAPI unit literal | S | vitest (`validate.parseable` contract corrected) + U.F letter | 12 F1; 14 F3 |
| **U.C11** | scroll drive symmetry — `driveScrollCSS` + dispatch de-dup + `ScrollBackend` re-home | M | vitest (scroll round-trip) + `bench` (one eligibility scan/dispatch) | 14 F4/F8 |
| **U.C12** | presets → ONE `PRESET_SPECS` table + `definePreset` generator | M | vitest (34-preset catalog parity + barrel/taxonomy derivation) | 14 F1/F6 |
| **U.C13** | **THE SURFACE COLLAPSE — one composition barrel, derived type** | L | `proof:publish`/`proof:published-surface` (re-armed) + tsc d.ts roll-up | 15 F1/F2/F3/F5/F6/F7 |
| **U.C14** | **THE PLAIN-VARS PROJECTION CURE (OD-U13 Fix A)** — the live 5.2.0 freeze: `compile/plain-vars.ts:109` caches a `ValueUnit[]` LEAF REFERENCE that `engine/interpolate.ts:194` re-points on every keyframe-segment crossing, so a `singleTarget`+`unflatten` group's projection reads an orphaned frozen leaf from t≈2s on (the amiga sphere pins at the 25% pose; dossier: `audit/defect-amiga-suspend-resume.md`). The cure: the projection becomes a VIEW, not a snapshot — `refreshPlainProjection` re-resolves the live `_grouped` leaf per frame (flat-key + source identity, zero-alloc), and the "built ONCE (structure is stable)" premise is struck from the docstring | M | vitest — a born-RED characterization: play a `singleTarget`+`unflatten` ≥3-keyframe group past its first segment boundary and assert values KEEP CHANGING (the exact window every green gate skipped); + one demo-smoke clause sampling `#/amiga` ≥3s | 11 F5-adjacent; the OD-U13 dossier; ↔ U.B13 (the demo consumer — Fix B rides this) |

**Sequencing (band-internal DAG, charter §3 "library-first within C: anchors before
dependents").**

```
U.C1 (Transport core) ──┬──> U.C2 (single-writer seam — drivers call verbs)
                        ├──> U.C3 (group carve — folds the group FSM into the store)
                        └──> (Sequence driver rides C1)
U.C4 (modal kernel) ────────> U.C7 (spring dir carve — moves the settled kernel into solver/)
U.C5, U.C6  ── independent (LIGHT physics; parallel from day 1)
U.C8 (emit/ + easing/ dirs) ──> U.C9 (refusal-probes + carves land in the emit/ home)
U.C10 ── independent (excision; the ASK is U.F's letter)
U.C11, U.C12 ── independent (scroll / presets)
U.C14 (plain-vars projection cure) ── independent; EARLY (a live 5.2.0 product freeze —
       the highest-priority correctness wave in the band); U.B13's demo half consumes it
U.C13 (surface collapse) ── LAST of the surface work; re-arms the gate belt → feeds U.A
```

Keystones: **U.C1 first** (C2/C3 depend on the shared store). **U.C4 before U.C7** (unify
the kernel, *then* move it into `solver/` — never carve a directory around code that is
about to change). **U.C8 before U.C9** (the `emit/` home exists before `refusal-probes.ts`
and the >350L carves land in it). Per charter §3: **the CI-trim (U.A) and every C carve
touch the same path-pinned gate scripts — ONE coordinated re-anchor pass, never two.**

---

## The waves

### U.C1 — THE TRANSPORT CORE: one FSM, three drivers · **KEYSTONE**

- **Substance.** Charter ONE value.js-free Transport core in a new leaf `internal/transport/`
  (the `internal/` tier is C-5 barrel-free and LIGHT by construction — lane 16 F5 affirms it
  as the correct global home): a `PlaybackState`-shaped run-state store + a family of
  transport free functions (`play`, `playing`, `resolvePlay`, `settleFlags`, `toggle`)
  parameterized over a tiny **driver seam** — `{ boundFrame, snapToFinal(), onSettle(),
  reducedMotion: boolean }`. `KeyframesAnimation`, `AnimationGroup`, and `Sequence` each
  supply a driver; the transport skeleton is authored once. This is the SAME
  DI-by-composition the R.W2/S.B2 carve already trusts (free functions over a concrete
  collaborator — no mixin, no `PlaybackHost` cast), extended one level up.
- **Dissolves** the three copied FSMs: `engine/play-lifecycle.ts:359-402,450,259-263,318-328`
  (re-entrancy guard / `playing()` / `resolvePlay` / `playReducedMotion`) ≡ `group/
  lifecycle.ts:42-62,156,33-37,66-86` ≡ `orchestration/sequence/{lifecycle,transport}.ts`
  (the third `_playingPromise` guard). The reduced-motion fork, the held-promise identity
  contract (`get finished`), and the re-entrancy guard become single-sourced.
- **Folds in** the dead-export deletion (lane 11 F4): `play-lifecycle.ts:432-436`'s free
  `toggle<V>` has zero callers (the class implements `toggle()` inline, `animation.ts:444`);
  it becomes ONE line of the shared core and both inline copies (`animation.ts:444`,
  `group.ts:355`) delegate — NO-LEGACY.
- **Folds in** the `Sequence.duration` memoize (lane 13 F5): `sequence.ts:200-208` recomputes
  the O(entries) segment-max on **every play-frame** (`transport.ts:219` `ctx.duration *
  _repeatCount`); `entries` mutates only in `add()` (`sequence.ts:275-283`). Maintain
  `_duration` as a field updated in `add()`; the Sequence driver reads the cached value. An
  invariant-between-mutations quantity recomputed per frame is exactly the "free" cost the
  performance edict targets.
- **Size.** XL. **LIGHT** — the leaf is value.js-free (verified: the FSM touches no
  `ValueUnit`/`Color`); `proof:boundary` proves it.
- **Oracle.** U.H's characterization net goldens play/pause/resume/stop/settle observable
  behavior through the two package "in"s BEFORE the move; the three drivers must reproduce
  it byte-for-byte after. `proof:boundary` proves the leaf stays LIGHT. No new gate — the
  transport contract is proven by the existing behavior net (charter §3 U.H).
- **Edges.** → **U.C2** (the single-writer verbs are authored ON this store), → **U.C3**
  (the group FSM folds INTO this store, not a parallel `GroupPlaybackState`), → **U.H**
  (the characterization net must land first — ring-fence 5). ↔ **U.D** (the SoA blend fold
  reads the group's run-state; the store's field layout is coordinated so the hot path is
  unchanged).

### U.C2 — The single-writer seam: `seek`/`adoptClock`/`seekAndPlay`; retire the 16 FSM-poke delegates

- **Substance.** Charter the public transport seam the deferral names (`playback-state.ts:
  32-33`, chronic since S — *"a future BREAKING wave (§8-3), out of S scope"*; owner edict U:
  no more deferrals). Three verbs owning the ordering contract that today lives OUTSIDE the
  engine:
  - `seek(ms)` — the single-WRITER for `t`/`iteration`.
  - `adoptClock({ startTime, t, started })` — the atomic clock-baseline poke.
  - `seekAndPlay(t)` — the continuity-seed the comment `adopt.ts:280-281` *already assumes
    exists* (`grep seekAndPlay src/` → only that comment). It owns the five-step
    delay-strip → `onStart` → `startTime = now − t` → kick sequence `adopt.ts:319-348`
    open-codes today, INCLUDING the load-bearing "`setDelay(0)` must precede `onStart()`
    else the paused-sleep early-out freezes forever" knowledge (adopt.ts:321-336) — hoisted
    INTO the engine, tested by the engine's own net.
- **Retires** the 16 get/set accessor delegates on `animation.ts:93-108` (`startTime`,
  `pausedTime`, `t`, `iteration`, `started`, `done`, `reversed`, `paused`) whose SOLE reason
  to exist is external raw-field writes: `ingest/adopt.ts:337,346`, `orchestration/sequence/
  lifecycle.ts:56-57` + `transport.ts:273-274`, `group/entries.ts:110` + `group/lifecycle.ts:
  103`. Each caller re-points to a verb; the delegates collapse to the `PlaybackState` store
  the hot path already reads directly.
- **Folds in** the CSSOM regex-escape correctness bug (lane 14 F7 — same ingest zone, same
  motion): `cssom.ts:214-216` interpolates the raw `CSSKeyframesRule.name` into a `RegExp`;
  a name like `a.b` or an escaped `(` either mis-matches the sibling style rule (dropping its
  `animation-*` options) or throws an uncaught `SyntaxError` mid-`walkSheet` (the try/catch at
  `:263-293` does NOT wrap it). Route the sibling-link through value.js's shorthand parser
  (the zone's stated idiom — `cssom.ts:184-187` "the SAME pipeline `fromString` uses, never a
  bespoke options parser"), removing the last hand-rolled parser in the walk.
- **Owns lane 29 F2's `serialize()`/`hydrate()` engine-state codec.** The demo's eight-field
  `SceneFacility` hand-reseat is replaced by the engine's own `seek`/`adoptClock`/`seekAndPlay`
  verbs — the S6 chronic handoff discharged HERE (the library owns the state codec its consumers
  were open-coding; **U.B7** is the demo consumer of this codec).
- **Must land ADDITIVELY (OD-U8 — 5.3.0 binds a compatible surface).** The new
  `seek`/`adoptClock`/`seekAndPlay` verbs land ADDITIVELY; the FSM-poke retirement touches
  only the UNDOCUMENTED internal raw-field surface (all callers are internal —
  ingest/sequence/group), so the PUBLISHED surface stays compatible. Any variant that would
  REMOVE or RE-SHAPE a published symbol/entry is OUT of U's scope (the breaking major is
  later, not U). Feeds the U.Z close ledger as an additive-only delta.
- **Size.** L. **HEAVY** (engine/ingest). **Depends U.C1.**
- **Oracle.** U.H goldens for ingest adopt-running, sequence timing, and group-pause behavior
  (the three drivers whose raw writes are being replaced) — the observable takeover/seek
  behavior must be identical. `tsc` proves the poke surface is gone (the setters no longer
  exist; any surviving raw write fails to compile). No new gate.
- **Edges.** → **U.C1** (verbs authored on the store), → **U.H** (ingest/sequence goldens),
  → **U.F** (the diagnostics letter is separate; this is the ingest-continuity seam only),
  ↔ **U.B7** (the demo consumer of this codec — the eight-field hand-reseat retires onto these verbs).

### U.C3 — `group.ts` carved to engine symmetry + shape-stable composition

- **Substance.** The engine carve produced FSM→`PlaybackState`, advance/play/render→free
  functions, leaving `animation.ts` a facade. The group carve stopped halfway (lane 11 F3):
  run-state stays inline on the class body (`group.ts:52-54,85-96`; `grep GroupPlaybackState`
  → zero hits), and the draw half stays as private methods (`group.ts:265 advanceTo`, `:288
  _frame`, `:296 _renderFrame`, `:242 render`, `:230 transformFramesGrouped`) where the
  engine's analogues are free functions (`play-lifecycle.ts:158/201/229`). Mirror the engine:
  (a) fold the group FSM into the **U.C1 Transport store** (not a parallel state); (b) move
  the draw/advance half into `group/draw.ts` free functions beside `compositor.ts`; `group.ts`
  becomes a pure delegating facade like `animation.ts`. At 440L it is this lane's residual
  god-class — the size is a symptom of the missing carve, not missing decomposition.
- **Folds in** shape-stable composition (lane 11 F5 — performance edict): `compositor.ts:
  143-146` deletes every uncontributed key from `_grouped` each frame — the exact `delete`
  the entire SoA apparatus (`soa.ts`, the `_groupedKeys` null-fill `compositor.ts:61-64`)
  exists to avoid, dropping `_grouped` out of V8 fast-properties mode on every frame a layer
  toggles enabled mid-play (`setLayerEnabled`, `group.ts:401` — a real API). Carry a per-key
  "contributed-this-frame" epoch (bump on write, compare on read) and SKIP stale keys — the
  same discipline `clearBuffer` consumers already use (`interpolate.ts:221` leaves inactive
  keys `undefined`). Never `delete`; `_grouped` stays shape-stable for the instance lifetime.
- **OPTIONAL sub-carve** (lane 16 F6, gated by the directory-density disposition): `group/`
  is 10 flat; `soa.ts`/`compositor.ts`/`springs.ts`/`yield-batch.ts` are a natural
  `group/blend/` sub-module. Charter only if the density clause (Risks §R3) brings it in
  scope; the `group.ts`→`blend/` import resolves at module-load (hot-path safe).
- **Size.** M. **HEAVY.** **Depends U.C1.**
- **Oracle.** vitest group blend-mode goldens (replace/add/weighted) unchanged; a `bench`
  witness that a mid-play `setLayerEnabled` toggle does NOT collapse `_grouped` to dictionary
  mode (allocation-count stable across the toggle — coordinates with U.D's alloc harness).
- **Edges.** → **U.C1** (folds the group FSM in), ↔ **U.D** (the SoA blend fold + the
  shape-stability assertion; U.D owns the alloc harness this wave's F5 cure is measured by).

### U.C4 — THE SPRING MODAL KERNEL: one ODE, both perf profiles

- **Substance (the correctness-hazard cure).** Transpose `solver.ts` into a **two-phase modal
  kernel** — ONE source of truth serving both the per-frame scalar step and the per-tick-
  hoisted vector step:
  - `prepareSpringModal(omega, zeta, omegaD, t) → SpringModal` — evaluates the transcendentals
    ONCE (`decay`, `cos`, `sin`, or `r1/r2/e1/e2`) + the case tag + coefficients.
  - `applySpringModal(modal, x0, v0) → { x, v }` — pure arithmetic per (x0, v0), NO
    transcendentals.

  The scalar path calls `prepare` then `apply` (identical cost to today's single
  `solveDampedHarmonic`). The vector path calls `prepare` ONCE per tick, then `apply` per lane
  in the hot loop — the exact hoisting `vector.ts:126-151` hand-rolls today, now over the ONE
  kernel. **Delete the copied ODE** (`vector.ts:126-151`, verified byte-identical to
  `solver.ts:47-76`). `solveDampedHarmonic` becomes the trivial `apply(prepare(...))`
  composition for the two existing scalar call sites. One algebra, both perf profiles; the
  "rings identically" claim (`vector.ts:11-13`, `progress.ts:316-318`) becomes true by
  construction rather than by comment.
- **This is a CORRECTNESS hazard, not hygiene** (lane 13 F1): a future overdamped-branch fix
  (`disc → 0` as ζ→1⁺) applied to `solveDampedHarmonic` reaches every scalar spring +
  `springLinearStops`/`springTimingFunction`, but the SoA vector path keeps the stale
  math — a scalar-vs-vector trajectory divergence the "rings identically" gate assumption
  actively hides. No `proof:boundary` edge catches algebraic inequivalence.
- **Folds in** the stale kernel comment (lane 13 F4): `progress.ts:316-318` points at
  `./sample`; the kernel is `./solver` (split at R.W2c to break the `progress↔sample` ring).
  Correct to `./solver`; the F1 unification lets it truthfully say "shared with the vector
  path" not "inlined by it". And the `scaledTarget` cache (lane 13 F6): `evaluateAt`
  (`progress.ts:310-313`) + `checkSettled` (`:339-341`) recompute `originValue + s·(target−
  origin)` every frame though it changes only on re-seat — derive it once per re-seat into a
  field (the modal `prepare` step is also per-re-seat and can carry it).
- **Size.** M. **LIGHT** (the spring family is value.js-free; the twins emit CSS *strings*,
  they do not parse — `proof:boundary` proves it). **Precedes U.C7.**
- **Oracle.** The hazard oracle: a vitest property test asserting the scalar `.evaluateAt(t)`
  trajectory ≡ the vector `tickVector` lane trajectory across the underdamped/critical/
  overdamped regimes to float tolerance — the equality the current copy makes UN-testable.
  **U.H1 OWNS this oracle** — it is U.H1's named deliverable (`U.H1's spring trajectory oracle`),
  authored in the characterization tier BEFORE this wave; **C4 may NOT delete the copied ODE
  (`vector.ts:126-151`) until that test is green-on-equality.** One unambiguous owner (U.H1
  authors, U.C4 consumes), the ordering stated on both sides. Not a new standalone gate.
- **Edges.** → **U.C7** (the unified kernel moves into `solver/` AFTER it settles), ↔ **U.D**
  (the per-lane velocity-reseat surface `vector.ts` needs for `drag2D` is a small extension
  ON the unified vector path — U.D's drag2D wave owns `reseatLane(i, value, velocity)` as its
  sole consumer; this wave delivers the ONE kernel it reseats over — lane 13 F3 cross-band).

### U.C5 — SmoothProgress managed-play completion: the `ManagedStepper` contract

- **Substance.** Complete the S.B5 carve the tranche left half-finished (lane 13 F2). At S.B5
  the SpringProgress `.play()`/`.stop()`/auto-resume lifecycle was lifted into
  `spring/managed-play.ts` free functions over the `SpringPlayback` contract
  (`spring/types.ts:86-101`); SmoothProgress is the identical shape but **hand-rolls the
  entire lifecycle inline** (`smooth.ts:156-200` `.play`/`.stop`/`_startLoop` + `_snapSettled`
  `:100-113`, self-documented as "contract-equivalent" to the spring's). They share the rAF
  *core* (`RAFPlayback.drive`) but copy the managed-play *orchestration* (PRM routing,
  auto-resume-on-retarget, idempotent rebind, snap-and-stop). Generalize `SpringPlayback` into
  a zone-level `ManagedStepper` contract (both extend `Tickable`; the only real difference is
  the callback shape — spring reads `value`/`velocity`, smooth reads `current` and has no
  velocity). Home ONE `physics/managed-stepper.ts` (or fold beside `Tickable` in
  `playback.ts`) both delegate to via thin methods; `spring/managed-play.ts` becomes the
  concrete binding; `smooth.ts` loses ~45 hand-rolled lines. Makes the "byte-siblings delegate
  here" claim (`playback.ts:58-61`) literally true.
- **Size.** M. **LIGHT** (physics tier; `proof:boundary`).
- **Oracle.** vitest parity: the auto-resume-on-retarget, idempotent-rebind, and "no scheduled
  `drive` frame after a reduced-motion snap" invariants (asserted equal today, enforced in
  neither shared place — `smooth.ts:104-107`) hold identically for both steppers through the
  ONE contract.
- **Edges.** ↔ **U.C4** (both are physics/spring; can land in parallel — C5 touches the
  managed-play lifecycle, C4 the ODE kernel, no overlap), → **U.C7** (the `managed-play.ts`
  binding stays at `physics/spring/` root per lane 16 F1's target tree).

### U.C6 — Engine correctness hygiene: `_out` reentrancy + composition base-capture reparse

- **Substance (lane 13 F7).** `NumericAnimation._out` is a module-scope `Float64Array` reused
  across EVERY instance's `.at()` (`numeric.ts:25,198-206`) — zero-alloc and safe
  single-threaded/non-reentrant, but a hidden cross-instance shared-mutable: if `.at()` is
  entered reentrantly (a `timingFunction` that itself samples another `NumericAnimation` —
  fully legal, easings are arbitrary callables; or `ElementMorph.at` composed within a stagger
  callback), the inner call overwrites `_out` before the outer copies it out. Make the scratch
  **per-instance** (a `private _out` grown per animation — the alloc is one-per-instance, not
  per-frame, so the zero-alloc hot path is preserved; the instance already holds
  `keyframes`/`segments`, marginal footprint negligible). Preferred over documenting `.at()`
  non-reentrant — it removes the footgun rather than papering it.
- **Folds in** the composition base-capture reparse (lane 11 F6): `composition.ts:168-180`
  regex-scrapes `target.style` positionally (`raw.match(/-?\d*\.?\d+.../gi)`) to seed the
  `add`/`accumulate` base — a string-scrape of a value the library elsewhere parses through
  value.js's `ValueUnit` grammar (inconsistent with "one grammar, value.js owns parsing").
  Route the base capture through the same value.js parse the forward path uses so the
  composite base and the animated leaves come from ONE parser. It is honest-refusal-guarded
  (`COMPOSITION_FALLBACK`) and niche, hence bundled here as low-severity engine hygiene —
  CHARTERED (not BOOK'd): NO-legacy covers a shortcut inconsistent with the parsing precept.
- **Size.** S. **HEAVY** (composition is engine/CSS) — the `_out` half is LIGHT-adjacent
  (`numeric.ts` is physics, value.js-free); both preserve their zone's boundary.
- **Oracle.** A one-shot reentrant `.at()` witness (an easing that samples a second
  `NumericAnimation` produces correct output for both) — the failure the shared global hides;
  vitest composite-base parity (the reparsed base ≡ the scraped base on the numeric common
  case, and is correct where the scrape drops non-leading-number components).
- **Edges.** Independent (LIGHT physics + isolated engine method); parallel from day 1.

### U.C7 — `physics/spring/` colocation: `solver/` + `css/` sub-modules

- **Substance (lane 16 F1).** `physics/spring/` is 11 flat files across three concerns.
  Recursively colocate into two sub-modules mirroring `engine/css/`, both LIGHT:

  ```
  physics/spring/
  ├── index.ts · progress.ts (hot-path class) · managed-play.ts · types.ts
  ├── solver/   { solver.ts · sample.ts · vector.ts · duration.ts · reseat.ts · index.ts }
  └── css/      { linear-stops.ts · timing-function.ts · index.ts }
  ```

  The CSS twins emit `linear()` *strings* — they do not parse — so `css/` stays value.js-free
  (verified no value.js edge in either cluster). Hot-path safe: `progress.ts`→`solver/`
  imports resolve at module load, NOT per frame.
- **Sequence.** AFTER **U.C4** — the modal-kernel unification rewrites `solver.ts`/`vector.ts`
  contents; carve the directory around the SETTLED kernel (never carve then re-edit).
- **Size.** M. **LIGHT — HARD constraint** (ring-fence 2); `proof:boundary` proves both
  sub-modules carry no value.js specifier.
- **Oracle.** `proof:boundary` (LIGHT preserved) + `proof:zone-cohesion`'s JUSTIFIED-allowlist
  re-anchor: the `progress.ts` (492L) hot-path entry stays justified; the 5 solver siblings'
  and the twins' justifications are RETIRED BY STRUCTURE (lane 16 F4 — carve, don't declare).
- **Edges.** → **U.C4** (kernel settles first). **Re-anchor in the same motion** every
  path-literal gate that names `physics/spring/*.ts` basenames (charter §3: gates anchor
  literal basenames — the S-drive lesson).

### U.C8 — `compile/emit/` + `compile/easing/` colocation: the emitter trio under one roof

- **Substance (lane 16 F2 + lane 12 F3).** `compile/` is 11 flat root files + a SPLIT emitter
  trio: three "→ zero-runtime CSS" emitters, one concern, three homes — `compileToCSS`
  (`backward/backward.ts`), `compileToEntry` (`entry.ts`, 434L, flat root), `compileToViewTransition`
  (`view-transition.ts`, 393L, flat root). The two root emitters import UPWARD into
  `./backward` (`entry.ts:46-50`, `view-transition.ts:43-55`) — backward-direction code in the
  FORWARD home, violating the zone's own charter (`backward/index.ts:8-13`: "zero forward↔
  backward edges"). Two carves; the FORWARD pipeline stays at root:

  ```
  compile/
  ├── index.ts · parse-flatten · frame-compiler · numeric-plan · selector · plain-vars · adapter   (FORWARD, root)
  ├── easing/   { easing-registry · easing-option · index }
  └── emit/     { backward (compileToCSS) · backward-walk · backward-color · format · format-options
                · easing-serialize · densify · entry · view-transition · index }   (rename backward/ → emit/)
  ```

  Gathers the trio under ONE roof (its shared substrate `format`/`densify`/`backward-color`/
  `cssIdent` is already there), turning the UPWARD root→`backward/` dependency into intra-module
  colocation. The a18 FORWARD↔BACKWARD zero-edge invariant survives as **FORWARD↔`emit/`** —
  same seam, renamed to its true concern. All HEAVY; no boundary crossing.
- **Sequence.** BEFORE **U.C9** — the `emit/` home + `refusal-probes.ts` sibling slot must
  exist before C9's extraction lands in it.
- **Size.** L. **HEAVY — HARD constraint**; `proof:boundary` proves the carve stays behind
  `loadAnimationEngine()`.
- **Oracle.** vitest compile round-trip goldens (compileToCSS/Entry/ViewTransition emit
  byte-identical output before/after the pure move) + the a18 invariant re-anchored to
  FORWARD↔`emit/` in `compile/index.ts` and the backward-anchored gates.
- **Edges.** → **U.C9** (the de-accretion lands in `emit/`). **Re-anchor** every gate naming
  `compile/backward/*` or the two root emitter basenames — one coordinated pass with U.A.

### U.C9 — compile backward de-accretion: `refusal-probes.ts` + >350L carves + primitive dedup

- **Substance (lane 12 F2/F4/F7).** The three backward emitters copy-paste ONE refusal-probe
  vocabulary (`backward.ts:206 findComputedDrift` ≡ `entry.ts:171 emptyDeclared`; the
  custom-renderer loop ≡ across all three; the scroll-grammar sniff `entry.ts:220-228` ≡
  `view-transition.ts:184-198`; the color-track probe; the `formatCSS` try/catch tail
  duplicated verbatim at `backward.ts:466-472` ≡ `entry.ts:428-433` ≡ `view-transition.ts:
  387-391`). Extract `compile/emit/refusal-probes.ts` — the per-animation eligibility
  predicates (`emptyDeclared`, `usesCustomRenderer`, `scrollGrammar`, `colorTrack`,
  `computedDrift`) as ONE typed vocabulary + a `formatOrRaw(raw, printWidth)` tail helper.
  Each emitter COMPOSES the shared probes and adds only its role-specific refusals (entry's 6,
  VT's 4). ONE place the trust-surface semantics live.
- **The >350L carves** (each a concern-seam, not a mechanical split): `backward.ts` (475L,
  `compileChild` alone 165L) → refusal blocks into `refusal-probes.ts`, residual becomes a thin
  project-or-refuse composition; `frame-compiler.ts` (458L) → carve `compile/reconcile.ts`
  (the `buildVarIndex`/`reconcileVars` graph, `:263-331`) leaving the class template-in→
  frames-out; `entry.ts`/`view-transition.ts` → split refusal-DETECTION from rule-ASSEMBLY
  (the detection half largely dissolves into the shared probes).
- **Primitive dedup** (lane 12 F7): consume value.js's exported `isColorUnit` (not the local
  `backward-color.ts:52-55` copy); hoist ONE `percentOf` (`backward-color.ts:136` ≡
  `densify.ts:23`); drop the no-op self-assign `frame-compiler.ts:127-128`.
- **Co-located comment truth-restoration** (lane 12 F5/F6/F8 — the compile-zone slice of the
  NO-LEGACY sweep, done in the SAME motion these files are edited): re-point the dead
  `resolve-values.ts` refs (`adapter.ts:112-113`, `element-resolve.ts:18`) to `resolve/core.ts`;
  correct the stale "value.js-P-gated no-op"/"BOOKed, not half-wired" comments that contradict
  LIVE code (`@function` inlining IS live — `core.ts:87`→`resolve-function.ts`; composition IS
  wired — `css-animation.ts:250`); re-anchor the version-pinned historical prose (0.12.0…2.0.x)
  to the installed value.js 3.1.0. The **wholesale** tranche-tag archaeology purge is U.E's
  charter; this wave cures only the comments in the files it already opens.
- **Size.** L. **HEAVY.** **Depends U.C8** (`emit/` home).
- **Oracle.** vitest emit goldens unchanged (the extraction is behavior-preserving); tsc (the
  local `isColorUnit`/`percentOf`/no-op are gone).
- **Edges.** → **U.C8** (home exists first), → **U.E** (the wholesale comment-archaeology
  purge; this wave is the compile-zone co-located slice), → **U.C10** (the `PARSE_ERROR`
  excision touches `validate`/`adapter` — sequence so the two adapter edits don't collide).
- **OPTIONAL adjacency** (lane 16 F7): `resolve/` is 6 flat resolvers under `core.ts`
  dispatch → a `resolve/resolvers/` cluster; charter only if the directory-density disposition
  (Risks §R3) sets its N ≤ 5. Lowest priority; HEAVY, `core.ts`→`resolvers/` module-load safe.

### U.C10 — value.js consume-edge honesty: excise dead `PARSE_ERROR`; BOOK the WAAPI unit literal

- **Substance (lane 12 F1).** The `PARSE_ERROR` diagnostics channel is **dead scaffold**
  (chronic since K): `adapter.ts:246-249` declares an `onParseError` sink then `void
  onParseError` — never passed to a parser; value.js 3.1.0's `parseCSSStylesheet: (input:
  string) => Stylesheet` (`stylesheet.d.ts:3`) accepts **no error callback**, so a
  `PARSE_ERROR` Diagnostic can never fire. Downstream it silently weakens trust:
  `validate.ts:156-159` branches `parseable` on `d.code === "PARSE_ERROR"` (never fires) → a
  block with a malformed declaration value.js partially parses reports `parseable: true`.
  **Excise** the un-fireable branch NOW: the `DiagnosticCode.PARSE_ERROR` member, the
  `OnParseError` import + `onParseError`/`void onParseError` pair, and correct `validate`'s
  `parseable` contract + doc. "NO legacy code" applies to dead honesty channels most of all.
  The value.js diagnostics-returning-parse ASK (an `onParseError`-accepting `parseCSSStylesheet`
  or a `{ ast, diagnostics }` return) is a **U.F letter row**, wired in one motion the moment
  value.js exposes the producer (ring-fence 1 — no parallel upstream arm).
- **BOOK the WAAPI unit literal (lane 14 F3).** `waapi/eligibility.ts:27-62`'s
  `WAAPI_INELIGIBLE_UNITS` re-enumerates value.js's viewport/container unit taxonomy by hand
  (`vh…dvmax cqw…cqmax`) — the sv/lv/dv/cq families are precisely the part of CSS that GROWS;
  each new spec unit must be manually appended or the compositor guard silently under-rejects
  (a wrong-pixel WAAPI animation, the one failure the guard exists to prevent). value.js
  already owns the model (`RELATIVE_LENGTH_UNITS`, `constants.d.ts:2`) and the file already
  imports `COMPUTED_UNITS`. The ASK — a semantic grouping (`VIEWPORT_LENGTH_UNITS` +
  `CONTAINER_LENGTH_UNITS`, or `isLayoutTrackingUnit(unit)`) — is a **U.F letter row**; until
  value.js publishes it, the literal is a BOOK'd tripwire (a `deadlined external covenant`,
  NOT a manufactured copy), NOT a kf-internal re-derivation. On landing, kf derives
  `WAAPI_INELIGIBLE_UNITS = new Set([...COMPUTED_UNITS, "%", ...VIEWPORT_LENGTH_UNITS,
  ...CONTAINER_LENGTH_UNITS])` and the literal vanishes.
- **Size.** S. **HEAVY.** **Sequence with U.C9** (shared `adapter.ts`/`validate` edits).
- **Oracle.** vitest: `validate.parseable` now reflects the honest contract (a partially-parsed
  malformed block is no longer reported `parseable: true` on the false-PARSE_ERROR branch).
- **Edges.** → **U.F** (both ASKs are letter rows — the deadlined covenants, no vacuous
  tripwire), → **U.C9** (adapter/validate co-edit sequencing).

### U.C11 — scroll drive symmetry: `driveScrollCSS` + dispatch de-dup + `ScrollBackend` re-home

- **Substance (lane 14 F8).** The scroll PARSE side is one call (`parseScrollCSS` →
  `CSSTimelineOptions { timeline, range, timelineScope, trigger }`) but the DRIVE side needs
  three manually-wired entries: `createScrollScene` (reads only `.range`, silently drops
  `.timeline`/`.trigger`, casts `spec as ScrollSceneOptions` `scene.ts:318`),
  `createTriggerScene` (reads only `.trigger`), `dispatchScrollBackend` (the native-vs-JS
  decision). Introduce ONE composition entry `driveScrollCSS(opts, target?, driverOptions?)`
  that fans a parsed `CSSTimelineOptions` into scene + trigger + backend-dispatch internally
  and returns a unified handle (`{ scene, trigger?, backend, reason? }`) — the parse side is
  one call; the drive side should mirror it. Re-home `ScrollBackend` (`"native"|"js"`,
  declared/exported at `scene.ts:69` but never USED there — the concept lives in `dispatch.ts`)
  beside `ScrollDispatch` in `dispatch.ts` (cohesion follows use).
- **Folds in** the dispatch de-dup (lane 14 F4 — performance edict): the native fast path
  computes eligibility TWICE (`dispatch.ts:100` `isWAAPIEligible` then `delegation.ts:122`
  again) and constructs the native ScrollTimeline TWICE (`dispatch.ts:107` to feature-detect,
  discarded; `delegation.ts:127` to actually attach). The eligibility scan is
  O(frames×interpVars×ivs) (`eligibility.ts:228-266`) — not free. Make
  `attachNativeScrollTimeline` accept the already-computed `{ eligible, timeline }` (or invert:
  dispatch is the SOLE eligibility/feature-detect site handing `attach` a pre-validated pair).
  ONE eligibility computation, ONE native construction per dispatch; the conservative-correct
  queryable-reason contract preserved.
- **Size.** M. **HEAVY** (scroll). New public export `driveScrollCSS` lands ADDITIVELY (a
  NEW symbol — no existing entry removed or re-shaped, OD-U8-compatible) → joins the U.C13
  surface roster; the additive delta feeds the U.Z close ledger.
- **Oracle.** vitest scroll round-trip (parse→drive→observed timeline identical);
  a `bench` witness that a native dispatch runs the eligibility scan exactly once.
- **Edges.** → **U.C13** (the new `driveScrollCSS` symbol joins the surface roster the
  collapse derives), ↔ **U.B** (the demo scroll scenes consume `driveScrollCSS` if any).

### U.C12 — presets → ONE `PRESET_SPECS` table + `definePreset` generator

- **Substance (lane 14 F1/F6; OD-U6 RECO-DEFAULT DATA).** Collapse the four hand-lockstep
  lists into ONE source of truth. Every classic preset is the SAME shape 34 times (a
  `(options?) => new CSSKeyframesAnimation({ duration, timingFunction, ...options })
  .fromString(css)` closure) varying only by a data tuple `{ name, css, duration,
  timingFunction, iterationCount?, fillMode?, direction?, group }`. Charter ONE `PRESET_SPECS`
  table (array/record of rows); a single `definePreset(spec)` factory-generator produces the
  closure; the **barrel and taxonomy both DERIVE** from the table (taxonomy becomes
  `groupBy(specs, s => s.group)`, not a hand-curated second copy). `timingFunction` values that
  are `CSSCubicBezier(...)`/`steppedEase(...)` calls stay inline in the row (they are data — a
  resolved `Easing`). `spring.ts:20-93`'s four springs fold into the same shape (the fifth copy
  of the closure). A new preset is ONE row; the barrel/taxonomy cannot drift.
- **Folds in** the data normalization (lane 14 F6): 4 of 34 constants carry full `@keyframes
  keyframeDelete {…}`/`keyframeShift {…}` wrappers with dead historical rule names
  (`classic-data.ts:172,196,427,443`) surviving only because `fromString` tolerates both forms.
  Normalize ALL rows to bare keyframe bodies (the 30-const majority idiom); the inconsistency
  cannot recur inside one table.
- **Size.** M. **HEAVY** (presets ride the engine surface). The 34-symbol named barrel is
  preserved (derived from the table) so the published surface is UNCHANGED — no OD-U8 delta.
- **Oracle.** vitest: the 34-preset catalog produces byte-identical `CSSKeyframesAnimation`
  configs before/after (each derived closure ≡ its former hand-written closure); the barrel
  exports exactly the same 34 names; the taxonomy groups match. A declarative coverage/uniqueness
  assertion over the table replaces any hand-list drift check (net-neutral — folds into the
  catalog vitest, not a new standalone gate).
- **Edges.** Independent (presets zone); parallel from day 1. → **U.E** (if any preset was a
  dead export, its excision is U.E's dead-export sweep — the table makes coverage auditable).

### U.C13 — THE SURFACE COLLAPSE: one composition barrel, derived type

- **Substance (lane 15 F1/F2/F3/F5/F6/F7).** The HEAVY surface is spelled five times, coherent
  only via an ~8-gate drift-belt; `public.ts` is already the single source of truth. Collapse:
  1. **`loadAnimationEngine = () => import("./public")`** returning `Promise<typeof
     import("./public")>` — delete the `Promise.all`/`Object.assign` hand-roster
     (`load-engine.ts:265-379`) entirely. The subpath entry and the dynamic accessor become the
     SAME module reached two ways (static `import` vs `await import`) — what the two-in always
     meant. `warmEngine` reduces to `void import("./public")` (KEEP only against a proven demo
     consumer — lane 15 F5; else remove the speculative export).
  2. **Derive/codegen the `AnimationEngine` type from `public.ts`.** The interface
     (`load-engine.ts:131-226`) exists ONLY to route around API Extractor's `typeof import()`
     limitation and needs its own oracle (`proof:published-surface` clause (d)) to stay in sync
     — the definition of legacy scaffolding. The repo ALREADY owns a bespoke Extractor pass
     (`engineDtsRollupPlugin`, `vite.config.ts:38-183`, running over `public.ts`); extend it to
     emit the barrel engine TYPE from `public.ts`'s real shape so `.`'s d.ts references the
     generated type. Delete the hand-spelled interface AND `proof:published-surface` clause (d).
     If tooling truly cannot, the interface must be CODEGEN'd (a `gen:*` step like
     `gen:agent-surface`), never hand-edited — but the generated-dts path is the honest cure.
  3. **`index.ts` → LIGHT values + one `export type * from "./public"` + the two accessors.**
     Delete the ~150-line hand heavy-TYPE re-list (`index.ts:159-310`) and its per-symbol
     paragraphs; types are erased under `verbatimModuleSyntax`, so no static value.js edge is
     introduced (`proof:boundary` verifies file-by-file). The per-symbol explanations collapse
     to one boundary note.
  4. **`package.json` exports rationalization** (lane 15 F7): drop the CJS-era `main` (ESM-only,
     `exports.".import` authoritative — no CJS artifact is emitted); collapse each entry's
     `import`/`default` twins pointing at the same file to one `default` unless a genuine
     condition split is intended; keep top-level `types` only if a non-`exports`-aware
     typechecker in the consumer matrix needs it (verify). ONE ESM resolution surface.
  5. **`env.d.ts` → `demo/env.d.ts`** (lane 15 F6). `src/env.d.ts` declares `*.vue`/`*.svg?
     component`/`vite/client` — DEMO-only, yet it sits in `src/` so `tsconfig.lib.json`'s graph
     sees a Vue/SVG ambient the library never ships. Move it to the demo; purify the lib graph;
     fix the CLAUDE.md path drift (it lists `src/animation/env.d.ts`; the file is `src/env.d.ts`).
  6. **Strip the 53 tranche-tag / FLAGGED-ADDITIVE archaeology comments** from the three surface
     files (index 20, load-engine 24, public 9) — provenance lives in `docs/tranches/`, not
     shipped source (this is the surface-file slice of U.E's NO-LEGACY purge, done in the same
     motion the collapse rewrites these files).
- **The reference idiom (lane 15 F8, AFFIRM).** `internal/leaves.ts:34` re-exports
  `clamp`/`scale`/`lerp` from `@mkbabb/value.js/math` — a thin, gate-verified re-export of the
  upstream's canonical code, NOT a hand-mirror. It is the model F1/F2's hand-rosters are the
  anti-pattern against; record it in the charter as the surface's target idiom.
- **The root-tier terminal keep (lane 32 F2).** `index.ts`/`load-engine.ts`/`public.ts`/
  `easing.ts` REMAIN at the `src/animation/` root tier — NOT encapsulated into a `boundary/`
  sub-module. They ARE the package entry seam (the two "in"s + the static/dynamic boundary); a
  `boundary/` directory would be a vestigial path segment (a layer stating no contract the seam
  does not already state by position). A recorded terminal KEEP, not a default.
- **Size.** L. **HEAVY-surface** — the collapse preserves the two-in LIGHT/HEAVY boundary
  exactly (F1–F3 collapse the *bookkeeping*, not the boundary; the tree-shaking property is the
  surface's best asset and is untouched). **Sequence LAST** of the surface work.
- **Oracle.** `proof:publish`/`proof:published-surface` (re-armed — see Risks §R1) proves the
  published surface is intact through the collapse; tsc + the d.ts roll-up proves the derived
  `AnimationEngine` type matches the runtime barrel. U.H's two-package-"in" characterization net
  proves `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` and the dynamic
  `await loadAnimationEngine()` resolve identically.
- **Edges.** → **U.A** (the collapse RETIRES `proof:engine-subpath-mirror`, `proof:published-
  surface` clause (d), and vacates `proof:claude-paths-live`/`proof:dts-rollups-agree`'s
  triplication policing — several become vacuous once there is ONE roster; feed the
  now-redundant belt to U.A's genre-deletion — charter §3 "one coordinated pass"), → **U.C11**
  (the new `driveScrollCSS` symbol is in the roster the derived type picks up), → **OD-U8** (the
  collapse must land ADDITIVELY/internally — 5.3.0 binds a compatible surface; the CJS-era
  `main` drop removes a NON-EMITTED dead artifact, not a published symbol; any change that
  would remove/re-shape a published symbol is OUT of U's scope. The additive delta is the U.Z
  close-ledger input).

---

## Risks + the re-arm map

The stale-era re-arm class is **EXPECTED** (charter §5): every U deletion invalidates some
gate's expectation — re-arm or delete WITH the wave, citing the ruling. Net gate count **only
goes DOWN** (charter §6); a new standalone `proof-*.mjs` requires owner sign-off — this band
authors **zero** new standalone gates. Each carve co-schedules its gate re-anchor with U.A.

**R1 — The surface-integrity gate belt largely dissolves (U.C13 → U.A).** `proof:engine-subpath-
mirror`, `proof:published-surface` clause (d), `proof:claude-paths-live`, `proof:dts-rollups-
agree`, `proof:in-is-importable`, `proof:no-any-default`, `proof:alias-dropped` (~8 gates)
exist largely to police the five-fold triplication (lane 15). Once there is ONE composition
barrel + a derived type: clause (d) is DELETED WITH the interface it diffs; `engine-subpath-
mirror` (diffing subpath keys vs interface keys) is vacuous (they are the same module);
`claude-paths-live`'s HEAVY-list-⊆-AnimationEngine-keys clause re-anchors to the derived type or
retires. **Disposition:** these are handed to **U.A** for genre-deletion in the SAME coordinated
pass (charter §3); `proof:publish` (boundary/surface/deps — one of U's three surviving
mechanisms) absorbs the residual real check (the published surface is what it claims). Do NOT
leave a gate diffing a hand-roster that no longer exists.

**R2 — Every path-literal gate anchors basenames (U.C7/U.C8 carves).** `proof:boundary`,
`proof:published-surface`, `proof:zone-cohesion`'s JUSTIFIED map, and the backward-anchored
gates name literal file basenames (the S-drive lesson). The `physics/spring/{solver,css}/` and
`compile/{emit,easing}/` moves re-point every such literal — in the SAME motion as the move,
citing lane 16's target tree. The a18 FORWARD↔BACKWARD invariant re-anchors to FORWARD↔`emit/`.

**R3 — The colocation ENFORCEMENT GAP is a lint rule / existing-gate clause, NOT a new gate**
(lane 16 F3/F4; lane 14 F5). No gate today covers intra-zone long-flat dirs
(`proof:no-flat-siblings` guards only the zone ROOT; `proof:zone-cohesion` measures per-FILE
line count). The edict's "long dirs → encapsulated modules" wants a per-DIRECTORY concern-
density check, and the stale filename headers (lane 14 F5) want a path-truth check — BUT U.A's
anti-sprawl covenant forbids new standalone `proof-*.mjs`. **Disposition:** (a) the two long-flat
dirs are cured BY STRUCTURE here (U.C7/U.C8), retiring the JUSTIFIED-allowlist entries by carve
not declaration (lane 16 F4); (b) the standing enforcement — directory-density + header-path-truth
— lands as **ESLint rules** (U.A's "~16 legacy greps → lint rules" genre) OR as a clause folded
into `proof:publish`'s structural check, its exact home decided by U.A's apparatus design. This
band delivers the CARVES; the enforcement re-home is U.A's, co-scheduled. The current header
drift (`cssom.ts:3`, `adopt.ts:7`, `grammar.ts:11`, `scene.ts:15`, `densify.ts:19`,
`waapi/index.ts:8`) is cured in-motion as each carve wave opens those files.

**R4 — U.C2 + U.C13 + U.C11 must land ADDITIVELY (OD-U8 RULED — 5.3.0).** U.C2 ADDS
`seek`/`adoptClock`/`seekAndPlay` and retires the UNDOCUMENTED internal FSM-poke surface (all
callers internal — no published symbol removed); U.C13 rationalizes `exports` and drops the dead
CJS-era `main` (a NON-EMITTED artifact, ESM-only); U.C11 ADDS `driveScrollCSS`. None changes the
two package "in"s, the LIGHT/HEAVY boundary, or any PUBLISHED symbol/entry in a
removing/re-shaping way. **Disposition:** OD-U8 RULED the close version **5.3.0** and BINDS U to a
compatible published surface — every C surface change lands ADDITIVELY / internally; anything
that would REMOVE or RE-SHAPE a published symbol/entry is OUT of U's scope (the breaking major is
later, NOT U). Feed U.C13's additive exports delta + U.C11's new symbol + U.C2's new transport
verbs to the U.Z close ledger as the ADDITIVE-only surface record.

**R5 — The correctness-hazard oracle must be authored, not assumed (U.C4).** The scalar≡vector
trajectory-equality test is the ONE thing that makes the modal-kernel unification falsifiable —
it must land as a U.H characterization test that REDS on a divergence BEFORE the copy is deleted
(prove the current copy already rings identically, then prove the unified kernel keeps it so).
Deleting `vector.ts:126-151` without that oracle re-opens the hazard silently. This is the "born
an oracle that reds on the measured defect" discipline (T.G lesson) applied to a correctness
copy rather than a perf regression. **U.H1 OWNS it** as its named deliverable
(`U.H1's spring trajectory oracle`); C4 may not delete the copy until it is green-on-equality —
one unambiguous owner, the ordering stated on both sides (U.H1 authors, U.C4 consumes).

**R6 — Two consume-edges are ASKS, not kf-internal work (U.C10 → ring-fence 1).** The
`PARSE_ERROR` diagnostics producer and the WAAPI layout-tracking-unit grouping are value.js's to
publish (its tranche is active in its own session). U.C10 EXCISES the dead PARSE_ERROR scaffold
now (honest — a block that partially parses stops lying `parseable: true`) and BOOKs the WAAPI
literal as a deadlined external covenant in **U.F's `KF-TO-VALUEJS-U.md` letter** — NOT a
parallel arm of an upstream fix, NOT a vacuous tripwire (charter's covenant discipline: every
external edge is a deadlined covenant, none carries to V). The kf-side wire-in is one motion the
moment value.js exposes each producer.

**R7 — Hot-path integrity across every carve (ring-fence 2 + performance edict).** Every
directory carve (U.C7/U.C8) and the group/blend + resolve/resolvers optionals are PURE moves
whose new imports resolve at MODULE LOAD, never per frame — the zero-alloc tick paths
(`interpFrames`'s hoisted `_interpOut`, the `Float64Array` SoA stride, `progress.ts`→`solver/`)
are untouched. The Transport core (U.C1) reads the store directly on the hot path exactly as
`anim._playback.*` does today (no new indirection). U.C4's modal `prepare`/`apply` split is
cost-neutral scalar (one call → prepare+apply) and cost-POSITIVE vector (transcendentals hoisted
once/tick — the hoisting `vector.ts` hand-rolls, now over ONE kernel). Coordinate the
alloc-count assertions with U.D's regression harness so "pure move, no per-frame cost" is proven,
not asserted.
