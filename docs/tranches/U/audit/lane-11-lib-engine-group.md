# Lane 11 — lib-engine-group

Audit of `src/animation/engine/` (2530L across 12 files) + `src/animation/group/`
(1550L across 10 files) for the Tranche U corpus. Charter: cohesion, residual
god-class shape, DI seams, encapsulation, per-file carve proposals for every file
>350L, tick-path allocation / dispatch overhead, and NO-LEGACY residue.

Every finding carries file:line evidence read from the live tree (`master`,
post-T, 5.2.0). All proposals are gestalt transpositions, not patches.

---

## Standing assessment

The R.W2 / S.B2 carve was real and it holds. `animation.ts` is a facade over
`play-lifecycle` / `interpolate` / `option-setters` / `options` / `compile-bridge`
/ `composition` + the `PlaybackState` store; `group.ts` delegates transport to
`lifecycle` and the SoA fold to `soa`/`compositor`. The hot path is genuinely
zero-alloc: `interpFrames` (interpolate.ts:124) reuses the hoisted `_interpOut`,
`processFrame` is a module function (no per-call closure), the numeric SoA fold
(processFrame soa.ts) strides `Float64Array` in place. The DI-by-composition
posture (free functions over the concrete instance, no `PlaybackHost` cast) is
clean and consistent.

What the carve did NOT do — and what U must — is **notice that it built the same
machine three times.** `KeyframesAnimation`, `AnimationGroup`, and `Sequence` are
each a "playable" with a play/pause/resume/stop/settle/reset transport, a
`_playingPromise` re-entrancy guard, a `withReducedMotion` fork, and a
`resolvePromise` deferred — re-implemented independently in `engine/play-lifecycle.ts`,
`group/lifecycle.ts`, and `orchestration/sequence/{lifecycle,transport}.ts`. The
engine folded its run-state into a `PlaybackState` store; the group left its FSM
inline on the class body. There is no shared `Transport`/`Playable` contract
(`grep interface Transport|Playable` → zero hits). That is the load-bearing
conclusion of this lane.

---

## Findings

### F1 (CRITICAL) — Three transport machines, one skeleton, no shared contract

The play FSM is re-authored in three zones with byte-adjacent shape:

- Re-entrancy + PRM fork + held-promise clear:
  `play-lifecycle.ts:359-402` (`if (_playingPromise) return it; result =
  withReducedMotion(...); _playingPromise = result; result.finally(clear)`) is
  *structurally identical* to `group/lifecycle.ts:42-62`.
- `playing()` is the exact same expression in both:
  `play-lifecycle.ts:450` `!(!started || paused)` ≡ `group/lifecycle.ts:156`.
- `resolvePlay` (deferred resolve+null): `play-lifecycle.ts:259-263` ≡
  `group/lifecycle.ts:33-37`.
- `playReducedMotion` (started=true → snap-to-final → settle):
  `play-lifecycle.ts:318-328` ≡ `group/lifecycle.ts:66-86`.
- `settle`/`stop`/`reset` teardown differ only in the collaborator they iterate.
- `Sequence` re-implements the same `_playingPromise` guard again
  (`orchestration/sequence/transport.ts`, `sequence/lifecycle.ts`).

Each divergence is a latent bug surface: the engine's `play()` refuses a managed
child (play-lifecycle.ts:362) and threads WAAPI eligibility; the group's does
not — but the *promise-lifecycle scaffolding around them* is copy-authored, so a
fix to (say) the `finally`-clear ordering must be made in three places.

**Proposal (the gestalt cure).** Charter ONE `Transport` core in a new
value.js-free leaf (e.g. `internal/transport/`): a `PlaybackState`-shaped run-state
store + a family of free functions (`play`, `playing`, `resolvePlay`,
`settleFlags`) parameterized over a tiny **driver seam** — `{ boundFrame,
snapToFinal(), onSettle(), reducedMotion: boolean }`. `KeyframesAnimation`,
`AnimationGroup`, and `Sequence` each supply a driver; the transport skeleton is
authored once. This is the SAME DI-by-composition the existing carve already
trusts (free functions over a concrete collaborator) — not a mixin, not a cast —
extended one level up so the three playables share a spine instead of three
parallel copies. The reduced-motion fork, the held-promise identity contract
(`get finished`), and the re-entrancy guard become single-sourced and single-gated.

### F2 (MAJOR) — The FSM accessor-delegate block is deferred legacy that folds into U

`animation.ts:93-108` declares **sixteen** get/set accessor delegates
(`startTime`, `pausedTime`, `t`, `iteration`, `started`, `done`, `reversed`,
`paused`) whose SOLE reason to exist is that external drivers write raw FSM fields:

- `ingest/adopt.ts:337` `animation.started = true`, `:346` `animation.startTime = now - t`
- `orchestration/sequence/lifecycle.ts:56-57` `animation.startTime = at; animation.started = true`
- `orchestration/sequence/transport.ts:273-274` `animation.started = false; animation.startTime = undefined`
- `group/entries.ts:110` `anim.started = true`, `group/lifecycle.ts:103` `anim.pausedTime = now`

`playback-state.ts:32-33` names this exactly and defers it: *"The literal
single-WRITER hard fold (a public `seek(ms)` verb + MIGRATION) is a future
BREAKING wave (§8-3), out of S scope."* That is a chronic deferral. Owner edict U:
**no more deferrals; no legacy code.** The accessor block is the boilerplate tax of
letting every collaborator poke the FSM through a public back door.

**Proposal.** Charter the public transport seam the deferral names: a `seek(ms)` /
`adoptClock({startTime, t, started})` verb the external drivers (ingest, sequence,
group-pause) call instead of raw field writes. Then the 16 accessor delegates
collapse to the single `PlaybackState` store the internal hot path already reads
directly. This is a BREAKING change to the (undocumented) FSM-poke surface — which
is precisely why it was deferred and precisely why U is where it lands.

### F3 (MAJOR) — `group.ts` (440L) never carved its run-state store or its draw half — asymmetric with the engine

The engine carve produced: FSM → `PlaybackState` store, advance/play/render →
`play-lifecycle.ts` free functions, leaving `animation.ts` a facade. The group
carve stopped halfway:

- Run-state stays inline on the class body: `group.ts:52-54` (`paused/started/done`),
  `:85-96` (`lastTickTime/resolvePromise/_playingPromise/_boundFrame`). There is no
  `GroupPlaybackState` analogous to `PlaybackState` (`grep GroupPlaybackState` →
  zero hits).
- The draw/advance half stays as private methods, NOT free functions:
  `group.ts:265` `advanceTo`, `:288` `_frame`, `:296` `_renderFrame`, `:242`
  `render`, `:230` `transformFramesGrouped`. The engine's exact analogues
  (`advanceTo`/`playFrame`/`renderFrame`) are free functions in
  `play-lifecycle.ts:158/201/229`.

So `group.ts` still carries three concerns: the run-state FSM, the draw loop, and
the ~15 SoA/composite instance fields (`group.ts:98-133`), plus the thin
layer-api/transport delegates. At 440L it is the residual god-class of this lane.

**Proposal.** Mirror the engine carve to symmetry: (a) fold the group FSM into the
shared `Transport` store from F1 (or a `GroupPlaybackState` if F1 is not chartered);
(b) move `advanceTo`/`_frame`/`_renderFrame`/`render` into a `group/draw.ts`
free-function module beside `compositor.ts`, so `group.ts` becomes a pure
delegating facade like `animation.ts`. The SoA instance state (`_soaPlans`,
`_compositeBuf`, `_grouped`, `_groupedKeys`) is genuine per-instance draw state and
can stay, but it belongs to the draw module's contract, not scattered class fields.

### F4 (MINOR, NO-LEGACY) — Dead export: `play-lifecycle.ts` `toggle` is never called

`play-lifecycle.ts:432-436` exports `toggle<V>(anim)`. The class implements
`toggle()` inline instead (`animation.ts:444-446`
`this.paused ? this.resume() : this.pause()`), and no module imports the free
function (`grep` confirms zero callers). It is orphaned by its own facade.

**Proposal.** Delete the free-function `toggle` (NO-LEGACY). If F1 lands, `toggle`
becomes one line of the shared Transport core and both inline copies
(`animation.ts:444`, `group.ts:355`) delegate to it.

### F5 (MINOR, PERF) — Group compositor per-frame `delete` compaction defeats the shape-stability the SoA fold is built to protect

`compositor.ts:143-146` deletes every uncontributed key from `_grouped` each frame
(`if (groupedValues[key] === undefined) delete groupedValues[key]`). The comment
concedes it only no-ops "in the common case." The entire SoA apparatus
(`soa.ts`, the `_groupedKeys` null-fill at `compositor.ts:61-64`) exists to keep
`_grouped` in V8 fast-properties mode WITHOUT `delete` (F.W4 S2) — yet the final
compaction step reintroduces `delete` on exactly the frames where an enabled-set or
whitelist actually changes what contributes. A group that toggles a layer on/off
mid-play (`setLayerEnabled`, a real API — `group.ts:401`) hits this every frame the
set differs, dropping `_grouped` back to dictionary mode for the run.

**Proposal.** Carry a per-key "contributed-this-frame" epoch (bump on write,
compare on read) and let the group transform SKIP `undefined`/stale keys — the same
discipline `clearBuffer` consumers already use (interpolate.ts:221 leaves inactive
keys `undefined` and every consumer skips them). Keep `_grouped` shape-stable for
the instance lifetime; never `delete`.

### F6 (MINOR) — `composition.ts` underlying-base capture regex-scrapes inline style

`composition.ts:168-180` (`captureUnderlyingBase`) reads `target.style` and pulls
numbers with `raw.match(/-?\d*\.?\d+.../gi)` positionally to seed the `add`/
`accumulate` base. This is a string-scrape of a CSS value the library elsewhere
parses through value.js's real `ValueUnit` grammar. It is honest-refusal-guarded
(non-numeric → `COMPOSITION_FALLBACK` row) and niche, so severity is low, but it is
a legacy-shaped shortcut inconsistent with the "one grammar, value.js owns parsing"
precept.

**Proposal.** Route the base capture through the same value.js parse the forward
path uses (parse the inline value to `ValueUnit[]`, read `.value` per component),
so the composite base and the animated leaves come from ONE parser. Charter only if
`animation-composition` base-capture is on U's correctness surface; otherwise BOOK.

---

## Cohesion / DI / encapsulation notes (no separate finding)

- The `PlaybackState` single-STORAGE (C-15) is correct and the internal hot path
  reads `anim._playback.*` directly (interpolate.ts, play-lifecycle.ts) — good.
- `option-setters.ts` / `options.ts` (normalizer split) is a clean, cohesive seam;
  no residue. `composition.ts` and `compile-bridge.ts` are pure, well-scoped.
- `css/css-animation.ts` (274L) and `css/metadata.ts` (179L) are cohesive and
  under ceiling; no carve needed.
- Every file >350L is accounted for: `animation.ts` (483 — facade, shrinks by F2
  not by carve), `play-lifecycle.ts` (489 — a genuine cohesive transport unit;
  shrinks into F1's shared core), `group.ts` (440 — F3 carve). No file needs a
  NEW split for its own sake; the size is a symptom of F1/F2/F3, not of missing
  decomposition.
- The `dispatchAnimationEvent` double-surface (class method `animation.ts:177`
  delegating to free function `play-lifecycle.ts:56`, which is also called
  directly within the module) is a minor cohesion wrinkle, not worth a finding;
  it resolves naturally if F1 lands.

---

## What U must charter

1. **Charter a unified `Transport` core** (value.js-free leaf) shared by
   `KeyframesAnimation`, `AnimationGroup`, and `Sequence`: one run-state store + one
   family of transport free functions over a small driver seam, dissolving the
   three copied play FSMs (F1).
2. **Charter the single-writer fold** (the deferred `seek(ms)`/`adoptClock` public
   seam) so ingest/sequence/group stop poking raw FSM fields, retiring the 16
   accessor-delegate boilerplate lines on `animation.ts` (F2 — the chronic
   `playback-state.ts §8-3` deferral, folded per NO-MORE-DEFERRALS).
3. **Charter the `group.ts` carve to engine symmetry**: run-state → store (or the
   F1 Transport), draw/advance half → `group/draw.ts` free functions, leaving
   `group.ts` a pure facade (F3).
4. **Charter deletion of the dead `toggle` export** in `play-lifecycle.ts` and
   route both inline `toggle`s through the shared core (F4 — NO-LEGACY).
5. **Charter shape-stable group composition**: replace the per-frame `delete`
   compaction with a contributed-key epoch so `_grouped` never leaves
   fast-properties mode when a layer toggles enabled mid-play (F5 — performance
   edict).
6. **Decide (charter or BOOK) the composition base-capture reparse** through
   value.js instead of the inline-style regex scrape (F6).
