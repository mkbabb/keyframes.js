# F.W9 — Complete the `Sequence` transport (pause/resume/reverse/timeScale/progress/repeat/yoyo)

**Phase:** IMPL · **Class:** MINOR (the published library — purely-additive transport
methods + one scalar `rate` field on the just-shipped `Sequence`; no break, the existing
`play`/`stop`/`seek`/`add`/`label` semantics byte-stable) · **Scope:**
`src/animation/sequence.ts` (the E.W10 orchestrator) — Band 3, the orchestration-finish ·
**DAG: F9 leads Band 3** (`F.md §The DAG` — F10's dogfood scene depends on this
transport + the demo band; F11's arch folds are independent) · **Gated on:** keyframes'
own green CI (inv-27); the `proof:orchestration` gate F3 authors is the regression baseline
this rides.

**Title.** *The just-shipped `Sequence` names GSAP's `Timeline` as its gold standard but
ships only `play`/`stop`/`seek` — a one-shot scrubber, not a transport. Complete it via
scalar-field arithmetic over the existing `seek` + `RAFPlayback` managed-pause.*

`Sequence` (E.W10) docstrings itself as "GSAP-`Timeline`-class position sequencing"
(`sequence.ts:2`) but is transport-INCOMPLETE: it has `add`/`label`/`seek`/`play`/`stop`
and NO `pause`/`resume`/`reverse`/`timeScale`/`progress`/`repeat`/`yoyo` — the one thing a
sequencing primitive exists to provide. The substrate is already there: `seek(masterClock)`
is the synchronous scrub (`sequence.ts:202-218`), `_frame` maps the master clock to each
child over `advanceTo` (`sequence.ts:273-312`), and `RAFPlayback` already owns the
analogous managed-pause re-anchor for `Animation`/`AnimationGroup`. The gaps are arithmetic
over the existing `seek` + a re-anchor, not new machinery.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO
workaround: complete the transport via scalar-field arithmetic over the existing
substrate, reusing `RAFPlayback`'s managed-pause re-anchor (the exact `pausedTime`-style
re-anchor `AnimationGroup` already does, `src/animation/CLAUDE.md`) — NOT a parallel
hand-rolled pause clock. NO legacy: `play`/`stop`/`seek` keep their semantics; the new
methods compose with them. Measure-first BINDS on the two felt-continuity claims:
`reverse`/`timeScale` must be verified C⁰-continuous BEFORE shipping — the segment
`onEnd`-clears-`startTime` window (`sequence.ts:287-288`) was reasoned for the forward
monotone case; reverse re-enters finished segments. Isomorphic-unless-named: additive
methods + one scalar `rate` field; `play`/`stop`/`seek` move zero behaviour. inv ε: every
claim cites `file:line` against live `tranche-e-impl`.

**Provenance.** `r-anim-libs-2026 F26-2` (the `Sequence` transport-incomplete vs the GSAP
`Timeline` it names — SHIP-in-F, MEASURE-FIRST on reverse/timeScale C⁰-continuity).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **`Sequence` ships `add`/`label`/`seek`/`play`/`stop` + `duration`/`time` getters —
   and NO transport.** Verified surface (`sequence.ts`): `label` (`:145`), `add` (`:156`),
   `seek` (`:202`), `setTargets` (`:220`), `play` (`:238`), `stop` (`:325`), getters
   `duration` (`:130`) + `time` (`:140`). **Absent** (grep
   `pause|resume|reverse|timeScale|playbackRate|progress\(|repeat|yoyo` over
   `sequence.ts` → zero matches): `pause`, `resume`, `reverse`, `timeScale`/`playbackRate`,
   a `progress` getter/setter, `repeat`, `yoyo` (`r-anim-libs-2026 F26-2`).

2. **The substrate is already there — `seek` is the synchronous scrub.** `seek(masterClock)`
   (`sequence.ts:202-218`) sets `this._time = masterClock` (`:203`) and applies each child
   at `clamp(masterClock − at, 0, duration)` via `interpFrames(local, …)` (the docstring
   `:197` `clamp(masterClock − at, 0, duration)`). The scrub the `progress` setter needs
   is `seek(p * duration)`; the `progress` getter is `_time / duration`. Pure division —
   the scrub already exists.

3. **`_frame` maps the master clock with a wall-clock origin.** `_frame(clock)`
   (`sequence.ts:273-312`): `if (this._playOrigin === undefined) this._playOrigin = clock`
   (`:276`), `const masterClock = clock - this._playOrigin` (`:277`), `this._time =
   masterClock` (`:278`). The loop (`:290-302`) advances each child by `clamp(masterClock −
   at, 0, duration)` over `advanceTo` (`:299`), and `if (masterClock >= this.duration)`
   settles (`:304`). The fields `_time` (`:112`) + `_playOrigin` (`:121`) are the
   pause/resume + rate substrate.

4. **`RAFPlayback` already owns the analogous managed-pause re-anchor.** The
   `AnimationGroup` managed-pause contract — pause records the group's LAST rAF timestamp
   on each child's `pausedTime`, resume adjusts `startTime` without a forward jump
   (`src/animation/CLAUDE.md` §Managed-child lifecycle) — is the EXACT re-anchor `Sequence`
   pause/resume needs: stop the `playback.loop`, retain `_time`, re-anchor `_playOrigin` on
   resume so `masterClock` continues from where it paused (`r-anim-libs-2026 F26-2`).

5. **The C⁰-continuity caveat is REAL — `onEnd` clears `startTime`.** `_frame`'s docstring
   (`sequence.ts:283-288`): a finished segment (`masterClock − at >= duration`) had its
   `onEnd` fire ONCE (which clears `startTime`); re-advancing would re-run `onStart` and
   re-anchor, so the loop "holds the final frame directly instead" (`:296-297`
   `animation.interpFrames(duration, true)`). This window was reasoned for the FORWARD
   monotone case; `reverse` re-enters finished segments (a negative `rate` walks
   `masterClock` back through them), so the `advanceTo`-based `_frame` map must be verified
   C⁰-continuous under a negative/scaled `rate` BEFORE `reverse`/`timeScale` ship
   (`r-anim-libs-2026 F26-2` inv-ε caveat).

The wave's job: complete the transport via scalar-field arithmetic over the existing
`seek` + a `RAFPlayback` managed-pause re-anchor, gated by a seek↔play parity test that
locks the C⁰-continuity at `reverse`/`timeScale` flips.

---

## § Goal

**What lands** (additive transport methods + one scalar `rate` field —
`proof:orchestration` + `proof:boundary` green):
- **`pause()` / `resume()`** — `pause` stops the `playback.loop` and retains `_time`;
  `resume` re-anchors `_playOrigin` so `masterClock` continues from `_time` without a
  forward jump (the `RAFPlayback` managed-pause re-anchor, `src/animation/CLAUDE.md`).
- **`progress` getter/setter** — `get progress() { return this._time / this.duration; }`;
  `set progress(p) { this.seek(p * this.duration); }`. Pure division over the existing
  `seek`.
- **`reverse()` / `timeScale(n)`** — a single scalar `rate` field scaling the master clock
  in `_frame`: `masterClock = (clock − _playOrigin) * rate`. `reverse()` is `rate =
  −|rate|` + a reflected origin; `timeScale(n)` sets `rate = n` (slow-mo `< 1` /
  fast-forward `> 1`). No per-child change — `advanceTo` already takes any masterClock.
- **`repeat` / `yoyo`** — modulo the master clock by `duration` in `_frame`; `yoyo`
  reflects the phase. (The repeat-count field + the settle condition `:304` generalize from
  "settle at `duration`" to "settle after `repeat` cycles".)
- **`proof:orchestration` Sequence-transport clauses** (the F3-authored gate, extended) —
  a seek↔play parity test (the C⁰-continuity at `reverse`/`timeScale` flips) + a
  pause/resume no-jump test + a `progress` round-trip test.

**Why:** a `Sequence` that can only `play`/`stop`/`seek` is a one-shot scrubber, not the
transport a sequencing primitive exists to provide (`r-anim-libs-2026 F26-2`). The GSAP
`Timeline` the docstring names ships `pause`/`resume`/`reverse`/`timeScale`/`progress`/
`repeat`/`yoyo` — these are not bolt-ons, they ARE the timeline transport. The substrate
(`seek` + `RAFPlayback` managed-pause + the `advanceTo` map) is already there; the gaps are
scalar arithmetic over it. This finishes a primitive E *just* shipped — completion, not new
scope — and it is the single largest ergonomic gap in the new public API.

---

## § Scope

Each sub-move is additive and unit-testable; the `Sequence` carries zero static value.js
edge (it is light-side, `sequence.ts:52` — the boundary holds throughout).

### S1 — `pause()` / `resume()` over the `RAFPlayback` managed-pause re-anchor (`r-anim-libs-2026 F26-2`) — SHIP-in-F

**WHAT:** `pause()` stops the `playback.loop` (`sequence.ts:263` `this.playback.loop(...)`)
and retains `_time` (do NOT `_settle()` — that releases children and clears the playhead).
`resume()` restarts the loop and re-anchors `_playOrigin` so the FIRST resumed frame's
`masterClock` equals the retained `_time` (`_frame:276` seeds `_playOrigin = clock` on the
first frame → on resume, seed it to `clock − _time / rate` so `(clock − _playOrigin) * rate
= _time`). Reuse the `RAFPlayback` managed-pause re-anchor pattern (`src/animation/CLAUDE.md`
§Managed-child lifecycle — pause records the loop's last rAF timestamp, resume adjusts the
origin without a forward jump), NOT a parallel hand-rolled pause clock.

**WHY:** `Sequence` holds `_playOrigin`/`_time` already (`:121`,`:112`); `pause`/`resume`
is re-anchoring the origin, not new machinery. The no-jump re-anchor is exactly the
contract `AnimationGroup` already implements — reuse it (no second pause-clock). The
substrate is solved; this is the input wiring.

### S2 — `progress` getter/setter over the existing `seek` (`r-anim-libs-2026 F26-2`) — SHIP-in-F

**WHAT:** `get progress(): number { return this.duration === 0 ? 0 : this._time /
this.duration; }` and `set progress(p: number) { this.seek(clamp(p, 0, 1) * this.duration);
}` — pure division over the existing `seek(masterClock)` (`sequence.ts:202`). (Reuse
`leaves.clamp`, the codebase's clamp authority — `sequence.ts:59` already imports it.)

**WHY:** the scrub `progress` needs already exists (`seek`); `progress` is `_time /
duration` and its setter is `seek(p * duration)`. The normalized-scrub surface is the GSAP
`Timeline.progress(0..1)` idiom; it is a getter/setter pair over a solved scrub. Zero new
machinery.

### S3 — `reverse()` / `timeScale(n)` via a scalar `rate` field — SHIP-in-F, MEASURE-FIRST on C⁰-continuity

**WHAT:** add a single `private _rate = 1` field; scale the master clock in `_frame`
(`sequence.ts:277`): `const masterClock = (clock − this._playOrigin) * this._rate`.
`timeScale(n: number)` sets `this._rate = n` (and re-anchors `_playOrigin` so the clock is
continuous at the rate-change instant — the same re-anchor as S1's resume). `reverse()` is
`this._rate = −Math.abs(this._rate)` + a reflected origin so the playhead walks backward
from `_time`. The settle condition (`sequence.ts:304` `masterClock >= this.duration`)
generalizes to a directional bound (forward: `>= duration`; reverse: `<= 0`).

**MEASURE-FIRST — the C⁰-continuity is VERIFIED BEFORE ship.** The segment
`onEnd`-clears-`startTime` window (`sequence.ts:283-288,296-297`) holds the final frame
directly for a finished forward segment; a negative `rate` re-enters that window walking
backward. Before `reverse`/`timeScale` ship, the seek↔play parity test (gate clause 1)
MUST confirm a reverse sweep is pixel-IDENTICAL to a reversed `seek` sweep (the `_frame`
map and the `seek` map agree at every sampled master clock, forward AND reverse). A
divergence at a segment boundary is the C⁰ break the caveat names; it reds the parity test
and BLOCKS the ship of S3 (S1/S2 ship independently — they are forward-monotone). This is
the `r-anim-libs-2026 F26-2` inv-ε caveat made into a gate.

**WHY:** `reverse`/`timeScale` are a single scalar field scaling `masterClock` in the
existing `_frame` arithmetic (`r-anim-libs-2026 F26-2`) — zero per-child change (`advanceTo`
takes any masterClock). But the `onEnd` window was reasoned forward-monotone; reverse
re-enters finished segments, so the felt-continuity is a MEASURE-FIRST claim, not an
assertion — the parity test is the proof.

### S4 — `repeat` / `yoyo` via master-clock modulo — SHIP-in-F

**WHAT:** add `repeat(count: number)` (a `_repeat` field) and `yoyo(on: boolean)` (a
`_yoyo` field). In `_frame`, before the per-child loop, fold the master clock by the
sequence duration: the effective playhead is `masterClock mod duration` for `repeat`, and
for `yoyo` the phase reflects on odd cycles (`cycle % 2 === 1 ? duration − phase : phase`).
The settle condition (`:304`) generalizes from "settle at `duration`" to "settle after
`_repeat` cycles" (`Infinity` → never settles, the looping case).

**WHY:** `repeat`/`yoyo` are a modulo of the master clock by `duration` in `_frame`, with
`yoyo` reflecting the phase (`r-anim-libs-2026 F26-2`) — the GSAP `Timeline` looping idiom.
The per-child `advanceTo` map is unchanged (it receives the folded playhead). Zero new
allocation; the zero-alloc `interpFrames` buffers carry over unchanged.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real unit test, not an
assertion):

1. **Seek↔play parity, forward AND reverse (S3 — the C⁰-continuity lock).** A test sweeps
   a 3-segment `Sequence` two ways — (a) `seek(m)` at a dense set of master clocks `m ∈
   [0, duration]`, (b) `_frame` driven at the same clocks — and asserts the per-child
   `interpFrames` output is pixel-IDENTICAL at every `m`, INCLUDING across a segment
   boundary and at `m = duration`. Then it does the same under `reverse()` (a negative
   `rate` sweep vs a reversed `seek` sweep). **BITE:** the `onEnd`-clears-`startTime`
   window diverging on reverse re-entry (the held-final-frame `:296-297` vs the re-advanced
   value) reds the reverse parity assert. This is the MEASURE-FIRST gate — S3 ships only
   when it greens.

2. **Pause/resume no-jump (S1).** A test plays a `Sequence`, `pause()`s at a known
   `_time`, advances wall-clock, `resume()`s, and asserts the first resumed frame's
   `masterClock` equals the retained `_time` (no forward jump). **BITE:** re-anchor
   `_playOrigin` to the raw resume timestamp (the forward-jump bug) → the `masterClock`
   leaps by the paused wall-clock interval and the no-jump assert reds.

3. **`progress` round-trip (S2).** A test asserts `seq.progress = 0.5` lands `seq.time ===
   0.5 * seq.duration`, and `seq.progress` after a `seek(0.3 * duration)` reads `0.3`.
   **BITE:** invert the setter (`seek(p)` instead of `seek(p * duration)`) → the round-trip
   reds.

4. **`repeat`/`yoyo` phase (S4).** A test with `repeat(2)` asserts the playhead at
   `masterClock = 1.5 * duration` maps to phase `0.5 * duration` (cycle 1), and with
   `yoyo(true)` maps to `0.5 * duration` REFLECTED (`duration − 0.5*duration`). **BITE:**
   drop the yoyo phase reflection → the odd-cycle assert reds.

5. **No regression — `play`/`stop`/`seek` move zero behaviour; the boundary holds.** `npm
   test` stays green; the existing `Sequence` `play`/`stop`/`seek` semantics are
   byte-stable (the new methods compose with them, the default `rate = 1` /`repeat = 1`
   /`yoyo = off` is the existing forward-monotone single-play). `proof:boundary` stays
   green (`Sequence` carries no new static value.js edge). `proof:orchestration` (F3) is
   the regression baseline. **BITE:** any existing `Sequence` test regression reds; a
   static value.js import added to `sequence.ts` reds `proof:boundary`.

---

## § Folds

Retires (by finding id):
- **`r-anim-libs-2026 F26-2`** (the `Sequence` is transport-incomplete vs the GSAP
  `Timeline` it names) — S1 (`pause`/`resume`) + S2 (`progress`) + S3 (`reverse`/
  `timeScale`, MEASURE-FIRST) + S4 (`repeat`/`yoyo`) + gate clauses 1–4.

**Routed OUTWARD / RECORDED (not this wave):**
- **The `.finished` getter** (`E8` / charter `NEW-10`) — **BOOK** (a Promise-returning
  completion handle across the transport; the `play()` promise `:261-270` is the substrate,
  but the surface earns a deliberate design pass).

---

## § Design decisions

1. **Reuse `RAFPlayback`'s managed-pause re-anchor — do NOT hand-roll a second pause
   clock.** RESOLVED: `pause`/`resume`/`timeScale`/`reverse` all re-anchor `_playOrigin` so
   the master clock is continuous across the transport change — the EXACT re-anchor
   `AnimationGroup` already does for its managed children (`src/animation/CLAUDE.md`
   §Managed-child lifecycle: pause records the loop's last rAF timestamp, resume adjusts
   without a forward jump). `Sequence` already holds `_playOrigin`/`_time`
   (`sequence.ts:121,112`); the transport is arithmetic over them. Trade-off: a separate
   pause-clock would be "simpler to read in isolation" — but it is a second time authority
   the Mandate's no-legacy/no-workaround forbids; the re-anchor reuses the one substrate.

2. **`reverse`/`timeScale` C⁰-continuity is MEASURE-FIRST — the parity test BLOCKS the
   ship.** RESOLVED + named: the segment `onEnd`-clears-`startTime` window
   (`sequence.ts:283-288`) was reasoned forward-monotone; a negative `rate` re-enters
   finished segments. So the felt-continuity is a claim to VERIFY, not assert
   (`r-anim-libs-2026 F26-2` inv-ε caveat). The seek↔play parity test (gate clause 1) is
   the proof — a reverse sweep must be pixel-identical to a reversed `seek` sweep. If it
   reds, S3 does not ship; S1/S2/S4 (forward-monotone) ship independently. This is
   measure-first applied to a correctness claim, the D-3 / E.W7 posture one tier up.

3. **The transport is scalar arithmetic — zero per-child change, zero new allocation.**
   RESOLVED: every addition is a scalar field read/multiply in the existing `_frame`
   arithmetic (`r-anim-libs-2026 F26-2`): `rate` scales `masterClock`, `progress` divides
   `_time`, `repeat`/`yoyo` modulo the playhead. The per-child `advanceTo` map
   (`sequence.ts:290-302`) is unchanged — it receives a different master clock, nothing
   more. The zero-alloc `interpFrames` buffers carry over unchanged. Trade-off: none — the
   transport is the cheapest possible completion of a primitive whose substrate already
   exists.

4. **Additive only — `play`/`stop`/`seek` keep their semantics.** RESOLVED: every new
   method composes with the existing surface; the defaults (`rate = 1`, `repeat = 1`,
   `yoyo = off`) ARE the existing forward-monotone single-play, so an existing caller moves
   zero behaviour (gate clause 5). The release escalates to MINOR (observable new public
   API) but stays minor — no break, no removed surface, no changed default. This finishes
   E.W10's primitive; it does not re-open it.
