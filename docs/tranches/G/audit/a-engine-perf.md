# Tranche G deep-SOTA audit — lane `a-engine-perf`

**Lane mandate.** Post-F engine + compile/runtime perf SOTA. Re-examine the F
Band-1 KILL/RECORD ledger (`F.md` F.W6 / the §"KILL/RECORD ledger for Band 1")
against the LIVE `tranche-g-dev` tree now that **value.js 0.11.0 is published**
(the SoA `lerpArray` D2 primitive + the computed-endpoint cache C1/C2/C4/C7 — the
F.W6 win — both shipped). The question the brief asks: **with 0.11.0 published,
which withholds graduate?** Read `src/animation/{engine,frame-compiler,group}.ts`
+ the F benches. MEASURE-FIRST every claim.

**Research/audit ONLY — ZERO source edits.** inv-16 RELAXED for G impl (the user
drives value.js too), but each repo is audited as its own surface and cross-repo
items are tagged HAND-OFF. inv ε: every claim is `file:line`-grounded against the
live tree; every number is from a re-runnable node v26 / V8 probe or a shipped
bench, and I say so. Branch: `tranche-g-dev`.

**Relation to the F lanes (cite + EXTEND — I do NOT repeat them).** The F runtime
band is the most thoroughly-measured surface in the audit corpus:
`p-runtime-perf-F` (P-1..P-5, live-engine), `r-v8-cost-model` (the synthetic
mirror), `a-runtime-remeasure` (the four W7 withholds), `r-interpolation-carrier`
(the carrier dispute + SoA re-point), `a-framecompiler-remeasure` (the compile
side). **F landed the kf-local folds (F.W4, F.W5) and handed the cross-repo wins
to value.js (F.W6 = C1; D2 = the SoA primitive).** My distinct G contribution is
**the post-publish reconciliation none of them could run**: F's dispositions were
authored when value.js was 0.10.0 and *unpublished*; 0.11.0 now ships the
primitives, so I (1) verify what kf actually consumes today, (2) re-measure the
withholds against the *published* primitive numbers, and (3) name the one finding
the whole F arc structurally could not surface — **kf 4.0.0 never re-pinned, so
the F.W6 win it claims to consume is not in the shipped artifact.**

---

## The honest headline (read this first)

**The single highest-leverage post-F engine-perf finding is not a new fold — it
is that the F.W6 win is not in the shipped product.** `package.json` pins
`@mkbabb/value.js ^0.10.0` (`package.json:` deps), `package-lock.json` resolves
`0.10.0`, and `node_modules/@mkbabb/value.js/package.json` is `0.10.0` — while
**value.js 0.11.0 is published** (`npm view @mkbabb/value.js version` → `0.11.0`)
and is the version that carries the computed-endpoint cache (C1/C2/C4/C7, the
F.W6 win) AND the D2 SoA `lerpArray` primitive (`value.js src/math.ts:48`,
`src/units/interpolate.ts:84`). `FINAL.md:11-12,93,118` asserts kf "consumes them
unchanged through the `lerpValue → iv._lerp` seam on re-pin" — **the re-pin never
happened.** kf 4.0.0 was published consuming 0.10.0. The F.W6 −94% computed-frame
win, and the entire D2 carrier substrate value.js shipped *for* kf, are dark in
the shipped artifact. This is a clean, falsifiable, SHIP-in-G graduate (G-1).

Beyond that: the kf-local folds (F.W4 buffer/alias, F.W5 sync-step) **landed
correctly and are ALREADY-SOTA** — I re-confirmed them live and they are exemplary
(§4). The Band-1 RECORD/BOOK ledger holds on **W8 S1** (typed time index — still a
negative at the dominant N), the **F.W5 held half** (the Animation/group async
interior is load-bearing — correctly NOT graduated), and **S3 incremental
updateSegments** (still unjustified). The two ledger items that **graduate to a
measured SHIP/MEASURE-FIRST candidate** now that 0.11.0 is published are the
**re-pin (G-1, SHIP)** and the **kf-side D2 SoA-segment consumption (G-2,
MEASURE-FIRST → SHIP at K≥6, re-measured BITING)** — because the live K
distribution is bimodal and the *interesting* shape (any transform animation) is
K=6–10, exactly the regime where the published `lerpArray` bites 2.5–4×, not the
"absent at the dominant K=1" the F charter recorded. **VJ-F4** (the per-frame
`unflattenObjectToString` alloc in the DOM-write path) was **NOT addressed in
0.11.0** and holds open as a value.js-HANDOFF, re-grounded live (G-3).

---

## TL;DR — findings + disposition

| # | Finding | Site | Measured (live) | Disposition |
|---|---------|------|------|-------------|
| **G-1** | kf 4.0.0 pins/ships value.js **0.10.0**; the F.W6 computed-endpoint win + the D2 SoA primitive live in the **published 0.11.0** kf never re-pinned to. The shipped product does not have the win FINAL.md claims it consumes | `package.json` dep `^0.10.0`; `package-lock.json` `0.10.0`; `node_modules/@mkbabb/value.js` `0.10.0` vs `npm view` `0.11.0` | pin lag verified ×3 (manifest/lock/installed); 0.11.0 carries C1 (`vj interpolate.ts:15-63`) + `lerpArray` (`vj math.ts:48`) | **SHIP-in-G** (re-pin to `^0.11.0`, re-lock, re-publish; gate `proof:vj-pin-current`) |
| **G-2** | kf hot loop dispatches **per numeric channel** through the indirect `_lerp` closure (`engine.ts:730-732`); the live K distribution is **bimodal** — K=1 trivial (alias handles it) but **every transform animation is K=6–10** (translate3d+scale+rotate+opacity = **10** numeric channels/frame, measured), exactly where the published `lerpArray` BITES 2.5–4×. The F "absent at dominant K=1" framing under-counts the real shape | kf `engine.ts:730`, `frame-compiler.ts:360-371`; vj `math.ts:48` | live K-probe: K=1 / K=10 / K=1 across 3 shapes; vj `numeric-soa.mjs`: 0.73× (K=1) → 3.13× (K=8) → 4.14× (K=16) | **MEASURE-FIRST → SHIP** (kf numeric-segment SoA compile consuming `lerpArray`; gate `proof:interp-soa` on the demo's real-K corpus) |
| **G-3** | `unflattenObjectToString` allocates a fresh result object + per-key `.split(".")` + string concat **every frame** in the DOM-write path (`transformTargetsStyle`, run per-frame via `processFrame → frame.transform`). VJ-F4 was **NOT** addressed in 0.11.0 | kf `utils.ts:370`, `engine.ts:735`; vj `units/utils.ts:115-148` | per-frame alloc confirmed live; no buffer-reuse in 0.11.0 (`git log` value.js — no VJ-F4 commit) | **value.js-HANDOFF** (buffer-reusing `unflattenObjectToString(flat, out?)`; the real MF-4 per-frame garbage) + kf consumes on the same re-pin |
| **G-4** | F.W4 (stable-key null-fill buffer + single-frame alias) and F.W5 (sync-step drive half) **landed correctly and are exemplary** | `engine.ts:606-711`, `playback.ts:96-132` | re-confirmed live: benches green, `proof:interp-fastprops` gate present, threaded-buffer fast | **ALREADY-SOTA** — manufacture no work; G-2 SoA is the only further lever and it's gated |
| **G-5** | The Band-1 RECORD/BOOK ledger HOLDS: W8 S1 (typed time index — neg at dominant N), the F.W5 held Animation/group half (the async interior is load-bearing for `yieldToMain` INP relief + event ordering), S3 incremental updateSegments (still unjustified) | `numeric.ts:8-15`, `engine.ts:821-838`, `group.ts:422-475`, `frame-compiler.ts:350` | re-confirmed live; the held async interior carries the scheduler yield + event dispatch | **RECORD** (the withholds hold; do not re-raise) |

**Net for G's engine-perf band:** ONE clean SHIP-in-G (G-1, the re-pin — the
biggest leverage-per-line in the lane, and a *correctness-of-the-shipped-product*
fix, not a micro-opt); ONE re-measured graduate from MEASURE-FIRST to a biting
SHIP candidate (G-2, the kf SoA consumption, now that the K shape is measured
biting); ONE re-grounded value.js-HANDOFF (G-3); and a SOTA kf-local engine left
alone (G-4) with a ledger that holds (G-5). **No re-architecture. No manufactured
deficit.**

---

## 1. G-1 — the re-pin that never landed · SHIP-in-G

### 1.1 The lag, verified three ways

```
package.json          (dep manifest)  "@mkbabb/value.js": "^0.10.0"
package-lock.json     (resolved lock)  "version": "0.10.0", registry tarball
node_modules/.../value.js  (installed) "version": "0.10.0"
```
vs the published registry state:
```
npm view @mkbabb/value.js version   → 0.11.0
npm view @mkbabb/parse-that version → 0.9.0
npm view @mkbabb/keyframes.js version → 4.0.0
```
and the value.js repo HEAD (`/Users/mkbabb/Programming/value.js/package.json`):
`0.11.0`, whose changelog commit is `e8cc1fb chore(release): value.js 0.11.0 —
the Tranche F hand-off (A2/C5/B1b/A1/B3+B5/D2/F7 + the computed-endpoint cache)`.

So **kf 4.0.0 was published resolving value.js 0.10.0** — the version *before* the
F.W6 / D2 work. `parse-that` is similarly at `^0.8.2` installed (`0.8.2`) vs
published `0.9.0`.

### 1.2 What 0.11.0 carries that kf is not getting (grounded in the live vj tree)

- **The F.W6 win — the computed-endpoint cache (C1/C7).** `vj
  interpolate.ts:15-63`: `lerpComputedValue` now caches the resolved
  `(startN, stopN, unit)` on the iv and collapses to a bare lerp while the layout
  epoch is stable (`getLayoutEpoch()`, `vj normalize.ts:154-187`); invalidated by
  `bumpLayoutEpoch()` (auto-installed on `window.resize`). This is the −94%
  computed-frame win `FINAL.md:39-44` says kf consumes through `iv._lerp` "on
  re-pin." It is reachable through the **unchanged** kf seam (`engine.ts:731`
  `lerpValue(eased, iv)`) — but only once the dep is 0.11.0. **Today kf is on
  0.10.0's per-frame re-resolve + per-hit `value.toString()` key (the exact
  P-3/D-3 thrash `p-runtime-perf-F §3.2` measured).** The demo's
  `calc(100cqw - 100%)` AnimationVisualizer (MEMORY.md) pays it every tick.

- **The D2 SoA primitive.** `vj math.ts:48` `lerpArray(start, stop, t, out)` is
  published with a measured K-gate (§2.3) — the carrier substrate value.js shipped
  *expressly for kf's numeric core* (`vj math.ts:39` "the carrier primitive a
  numeric-animation SoA substrate adopts"). kf imports it **nowhere** (grep
  `lerpArray` over `src/` → NONE). It is dark until G-2 + the re-pin.

### 1.3 Disposition

**SHIP-in-G.** Re-pin `@mkbabb/value.js` to `^0.11.0` and `@mkbabb/parse-that` to
`^0.9.0`, re-lock, run the full proof suite, re-publish kf (the version owner's
domain). This is the **lowest-cost, highest-leverage engine-perf action in the
tranche**: it lights up the entire F.W6 computed-frame win and the C5
length-unit correctness fix (the 24 no-op relative length units, `vj` commit
`8383bd8`) with ZERO kf source edit — the boundary was designed for exactly this
(`proof:boundary`, `src/animation/CLAUDE.md` §boundary). It is also a *shipped-
product correctness* fix: FINAL.md documents a win the artifact does not contain.

**Falsifiable instrument — `proof:vj-pin-current`:** a CI gate asserting the
installed `@mkbabb/value.js` major.minor is **≥** the latest published (or an
explicit recorded pin-floor with rationale); bites today (`0.10.0 < 0.11.0`).
Pairs with a `lerpComputedValue` call-counter behavioural test (the F-specced
`proof:computed-frame`) that now passes *because* the cache is in the consumed
dep, not just in value.js's own test suite. **The §Mandate edge:** this is the
"no legacy path beside its replacement" precept applied to a *dependency pin* — a
stale pin is the legacy surface; the replacement (0.11.0) exists and is replaced
in one motion.

**Isomorphism:** pixel-identical (value.js gated all of 0.11.0 byte-identical for
the stable-epoch case; `vj` 1607 tests green per `FINAL.md:93`).

---

## 2. G-2 — the kf-side D2 SoA consumption, re-measured BITING · MEASURE-FIRST → SHIP

### 2.1 The F ledger entry, and why the K framing under-counted

The F charter recorded (`F.md` Band-1 KILL/RECORD ledger, **D1 frozen-shape
`ValueUnit`**): *"The lever is D2 SoA `Float64Array` (~2.0–2.3× at K≥16) →
value.js-HANDOFF (re-pointed Wave D). The kf-local numeric-segment compile is
MEASURE-FIRST/BOOK (gated on representative-K, **absent at the dominant K=1**)."*
`r-interpolation-carrier F-3` and `p-runtime-perf-F P-4` concur: SoA is the lever,
gate on real-K, it's K-dependent.

**The value.js half graduated — it's published (0.11.0).** So the only open
question for G is the kf-side consumption, which the F charter held as
MEASURE-FIRST pending the real-K corpus. **I measured the real K.**

### 2.2 The live K distribution is bimodal — the interesting shape is K=6–10

The kf hot loop dispatches **one `_lerp` closure call per numeric channel**:
```ts
// engine.ts:730-732  (processFrame, the per-frame interior)
for (const iv of frame.allInterpVars) {
    lerpValue(eased, iv);   // → iv._lerp(t, iv), an indirect call per channel
}
```
Each `iv` in `allInterpVars` is ONE `ValueUnit` channel (`frame-compiler.ts:370`
`Object.values(frame.interpVars).flat()`). Live K-probe (re-runnable: construct
`CSSKeyframesAnimation.fromString`, count `allInterpVars` by dispatch class):

| animation | numeric K/frame | regime |
|---|---|---|
| `opacity: 0→1` (the dominant trivial 2-stop) | **1** | alias handles it; SoA SLOWER (0.73×) |
| `translate3d(…) scale(…) rotate(…) + opacity` | **10** | SoA BITES ~3.5× |
| `background-color + translateX` | 1 numeric (+1 color, separate path) | mixed |

The F charter's "dominant K=1" is true *only for the trivial fade* — which the
F.W4 single-frame alias already serves at near-zero cost (`engine.ts:671-679`).
**Every animation that does real motion is K≥6**: a single `translate3d` is 3
channels, a full `transform` chain 6–10. The cube demo, the amiga sphere, every
3D scene, every preset with a transform — all land in the K≥6 regime. The
relevant K for the SoA decision is **not** the trivial fade; it is the transform
animation, and that is decisively in the biting regime.

### 2.3 The published primitive's measured K-gate (live, value.js bench)

`node bench/numeric-soa.mjs` on this machine (node v26 / V8), `lerpArray` vs the
AoS per-iv closure dispatch, 2M frames/scenario:

| K | AoS (ms) | SoA (ms) | speedup |
|---|---|---|---|
| 1 | 7.31 | 10.04 | **0.73× SLOWER** |
| 2 | 22.31 | 12.80 | 1.74× |
| 4 | 30.90 | 14.16 | 2.18× |
| 8 | 53.62 | 17.14 | **3.13×** |
| 16 | 97.13 | 23.47 | **4.14×** |
| 32 | 193.17 | 41.41 | 4.66× |
| 64 | 392.67 | 75.04 | 5.23× |

The K=10 transform shape interpolates to **~3.5×**. The crossover is K=2: SoA
wins from the second channel onward. So the gate is clean: **K=1 → alias (F.W4);
K≥2 → SoA-segment.**

### 2.4 The transposition (the idiomatic, gestalt shape — not a workaround)

kf already owns the in-tree SoA reference: `NumericAnimation`'s `NumericSegment`
(`numeric.ts:8-15`) is a *slot map* — `startVals: number[]`, `stopVals: number[]`,
`keys: string[]` — and its inner loop (`numeric.ts:175-181`) is a flat per-key
lerp. That is the W8 S2 "slot-map" shape the F ledger named (MEASURE-FIRST+BOOK).
The gestalt move for the CSS engine is the **same discipline on the
`CSSKeyframesAnimation` carrier**:

1. At compile (`finalizeFrameVars`, `frame-compiler.ts:360`), partition each
   frame's numeric `allInterpVars` into a `Float64Array startN` / `stopN` / `outN`
   (the channels whose `_lerp === lerpNumericValue`), keeping the color/computed
   channels on the existing per-iv path (they have their own SoA in value.js B3 +
   the computed cache C1). Hold a parallel `ValueUnit[]` scatter-target array.
2. In `processFrame`, for K≥2 numeric frames: one `lerpArray(startN, stopN, eased,
   outN)` call, then scatter `outN[i] → carrier[i].value` so the serialize
   boundary (`unflattenObjectToString`, the `value.value` read) is **byte-
   unchanged**. K=1 / single-frame stays on the F.W4 alias.

This is NOT a carrier-shape change (D1 monomorphization — a *measured non-win*,
`r-interpolation-carrier F-1`, NOT shipped in 0.11.0 either, `vj math.ts:43`); it
is the layout move both F lanes agreed is the real lever, now with a published
primitive to consume. `numeric.ts` upgrades its own `number[]` slots to
`Float64Array` in the same motion (consume `lerpArray` instead of the hand-rolled
per-key loop) — DRY, one SoA discipline across both numeric cores.

### 2.5 Disposition

**MEASURE-FIRST → SHIP at K≥2** (the value.js half is published; the kf shape is
measured biting). The MEASURE-FIRST gate the F charter required is now satisfiable
on real data, not a synthetic K=64.

**Falsifiable instrument — `proof:interp-soa`** (the gate `r-interpolation-carrier
§A.3` sketched): a bench over the **demo's real-K corpus** (the cube/sphere/
playground transform animations, NOT a synthetic K) asserting the SoA-segment path
is faster than the AoS dispatch for the K≥2 frames AND **byte-identical output** (a
pixel-lock comparing the scatter result to the per-iv path); plus a `lerpArray`
call-counter asserting K=1 frames take the alias (never the SoA setup). The bench
bites if the SoA fold regresses the K≥6 transform shape OR if a refactor drops to
the per-iv loop.

**Isomorphism:** pixel-identical (`lerpArray` is K independent `lerp`s; the scatter
restores the same `value.value` numbers the per-iv path writes — same serialize
boundary). **Risk-honest:** this is the structural carrier change `p-runtime-perf-F
P-4` flagged as "the riskiest" — it must land behind the byte-lock and the real-K
bench, not asserted. The win is real and measured; the discipline is the gate.

---

## 3. G-3 — the per-frame `unflattenObjectToString` alloc (VJ-F4) · value.js-HANDOFF

### 3.1 The cost, re-grounded live

The DOM-write path runs **every frame** during default-renderer playback:
```ts
// engine.ts:735  (processFrame, when transformFrames)
frame.transform(this.unflatten ? frame.vars : frame.flatVars, t);
// → _defaultTransform (engine.ts:195-196) → transformTargetsStyle (utils.ts:363)
// → unflattenObjectToString(vars)  (utils.ts:370)
```
and `unflattenObjectToString` (`vj units/utils.ts:115-148`) allocates **per
call**: a fresh `result = {}`, a `flatKey.split(".")` array per key, and string
concatenation per key. For a K=10 transform frame that is ~10 split-arrays + a
result object + the concat garbage, **per frame, forever** — the per-frame
serialization garbage the F `R5`/`MF-4` ledger explicitly re-pointed to
value.js: *"The real per-frame garbage is `unflattenObjectToString` alloc →
value.js-HANDOFF (VJ-F4/VJS-2)"* (`F.md` Band-1 ledger). It is ALSO on the WAAPI
sub-segment sampling path (`waapi.ts:267`) and the format/serialize paths
(`format.ts:97,134` — those are not per-frame, so out of scope).

### 3.2 0.11.0 did NOT address it

`git log` over the value.js repo (the 0.11.0 changelog `e8cc1fb`) lists
A2/C5/B1b/A1/B3+B5/D2/F7 + the computed cache — **no VJ-F4 / VJS-2**. The 0.11.0
`unflattenObjectToString` is byte-identical to the 0.10.0 allocating form
(`vj units/utils.ts:115`). The withhold holds open as an unaddressed HANDOFF.

### 3.3 Disposition

**value.js-HANDOFF** (carried from the F charter, re-grounded as still-live). The
idiomatic shape mirrors what value.js already did for the *interp* buffer (C1) and
what kf did for the *lerp* buffer (F.W4): a **caller-owned out-buffer overload**
`unflattenObjectToString(flat, out?)` that null-fills a stable-key string buffer
(the property-key set is compile-stable — same argument as kf's `clearBuffer`,
`engine.ts:706`) instead of minting `{}` + split-arrays per frame. kf consumes it
on the **same G-1 re-pin** by threading a per-animation string buffer through
`transformTargetsStyle`. Both halves are zero-source-churn at the seam.

**Falsifiable instrument (value.js side):** a `%HasFastProperties` + alloc-count
bench on the threaded string buffer (the C1/F.W4 template); kf side, fold the
DOM-write into the existing `proof:zero-alloc` / `proof:standalone-zero-alloc`
contract (the write path is currently outside the zero-alloc lock — a gate gap
worth naming: `proof:standalone-zero-alloc` gates the *interp* buffer identity,
NOT the *write* path, `p-runtime-perf-F §1.1`).

**Isomorphism:** pixel-identical (same CSS strings; only the allocation site
changes).

---

## 4. G-4 — F.W4 + F.W5 landed and are ALREADY-SOTA · manufacture no work

Re-confirmed live on `tranche-g-dev`:

- **F.W4 — the dict-mode buffer fold + single-frame alias.** `engine.ts:632-711`:
  the `delete`-loop is GONE; `clearBuffer` (`engine.ts:706-711`) null-fills the
  compile-stable `_stableKeys` (fast-properties preserved, zero-alloc); the
  single-active-frame path aliases `frame.flatVars` directly with no clear/copy
  (`engine.ts:671-679`); the group/multi-frame path takes the stable-key buffer
  (`engine.ts:687-692`). The aliasing-correctness clause is honored (a caller with
  its own buffer never gets the alias, `engine.ts:677`). `proof:interp-fastprops`
  is wired (`package.json:57`, `scripts/proof-interp-fastprops.mjs` +
  `test/interp-fastprops.test.ts`) and in `proof:all` (`package.json:64`). Live
  bench (`bench/interp-buffer.bench.ts`, threaded buffer): K=2 34.1k hz / K=5
  18.3k hz / K=12 8.4k hz over a 600-frame window — the dict-mode regression is
  eliminated (the F headline). **Exemplary. Leave it.**

- **F.W5 — the sync-step drive half.** `playback.ts:96-132`: the unified `_run`
  feature-detects the thenable (`typeof result.then === "function"`) and
  reschedules **inline** for synchronous `drive` steppers (no `Promise.resolve`
  microtask hop), while the genuinely-async draw frame keeps the `.then`
  rescheduler — and the `.then` callback body *is* `reschedule`, so behaviour is
  byte-identical across both shapes. This is the idiomatic gestalt (one loop, one
  feature-detect), not a special-case fork. **Exemplary. Leave it.**

The interpolation **kernel** — binary-search seed + contiguous-neighbor scan
(`engine.ts:619-653`), pre-resolved monomorphic `_lerp` over pre-flattened
`allInterpVars` (`engine.ts:730`, `frame-compiler.ts:370`), zero-width snap
(`engine.ts:727`), the method-not-closure `processFrame` (`engine.ts:721`) — is
SOTA, re-confirmed (concurs `p-runtime-perf-F §5`, `a-framecompiler-remeasure`).
**The only further runtime lever is G-2 (SoA), and it is gated.**

---

## 5. G-5 — the Band-1 RECORD/BOOK ledger HOLDS · RECORD (do not re-raise)

Re-examined each named ledger item against the live tree + the 0.11.0 publish:

- **W8 S1 — typed time index** (`MF-6`, RECORD). The F verdict: "~4 ns of a
  128–168 ns tick, NEGATIVE at the dominant N=2." Nothing in 0.11.0 changes the
  tick denominator; the time-index lookup is `frame.time.start/stop` reads on the
  AoS `frames` (`engine.ts:623-624,646,651`), and N (active frames at t) is 1–2
  for the dominant shape. **HOLDS — RECORD.**

- **W8 S2 — slot map** (`MF-7`, MEASURE-FIRST+BOOK "after the carrier lane; the
  shape exists at `numeric.ts:8-15`"). The carrier lane is now resolved (the SoA
  primitive shipped). S2 is **subsumed by G-2**: the slot-map *is* the SoA-segment
  consumption shape, and `numeric.ts`'s `NumericSegment` (`numeric.ts:8-15`,
  `number[]` slots) is the in-tree reference that upgrades to `Float64Array` +
  `lerpArray` in the same G-2 motion. **Graduated INTO G-2** (no longer a separate
  withhold).

- **W8 S3 — incremental `updateSegments`** (`MF-8`, BOOK). The F verdict:
  "compiles in 0.039% of the editor's 1000 ms debounce at 80 stops; trading the
  FC-2 byte-determinism lock for a dirty-state machine is unjustified." Live: the
  compile is still a full `parse → finalizeFrameVars` (`frame-compiler.ts:350`,
  no `dirty`/`incremental`/`updateSegments` machinery — grep returns nothing).
  `NumericAnimation.updateKeyframe` (`numeric.ts:187-205`) does the *bounded*
  adjacent-segment recompute where it's cheap and correct; the CSS compiler
  rightly does not. **HOLDS — BOOK** (the byte-determinism lock is worth more than
  the saved 0.039%).

- **F.W5 held half — the Animation/group async interior** (the F.W5 spec held the
  `Animation`/group sync-step half "behind the event-ordering lock"). Re-examined:
  `Animation._frame` (`engine.ts:821-838`) genuinely awaits `onStart` /
  `advanceTo` / `_snapToReducedMotion`; the group `_frame` (`group.ts:474-475`)
  awaits `advanceTo` → `_advanceSlice` → `Promise.all` + `yieldToMain`
  (`group.ts:453-465,439-441`). These awaits are **load-bearing**: the
  `yieldToMain` is the INP-relief scheduler yield (`group.ts` `YIELD_BATCH`), and
  the awaited boundary carries the `animationstart`/`iteration`/`end` event
  ordering. The unified `_run` (§4) already serves them correctly via the async
  branch (the `.then` path is byte-unchanged). **There is nothing to graduate** —
  the held half is correctly held, and the design needs no separate fast-path
  because the feature-detect unifies both. **HOLDS — RECORD.**

- **`tryParseCache` bound** (`MF-9`, RECORD "the bound belongs in value.js
  `memoize`, Band V F3"). This is a parse-side cache, not engine-runtime; out of
  this lane's hot-path scope, but confirmed: the bound is a value.js-HANDOFF (the
  `memoize` primitive's FIFO→LRU), unaddressed in 0.11.0 (no `memoize` eviction
  commit in the changelog). **HOLDS — value.js-HANDOFF** (carried).

**None of these re-open.** The two items that moved did so toward *consumption*
(S2 → G-2) or *correctness-of-shipped-artifact* (the F.W6 win → G-1), not toward
re-raising a killed micro-opt.

---

## ALREADY-SOTA — the bulk (binding; manufacture no work)

Re-confirmed live, concurring with `p-runtime-perf-F §5`,
`a-framecompiler-remeasure`, `r-interpolation-carrier §5`, and the `F.md
§ALREADY-SOTA` record:

- **The interpolation kernel** — binary-search + contiguous scan, monomorphic
  `_lerp` over pre-flattened `allInterpVars`, zero-width snap, method-not-closure
  `processFrame`, the F.W4 stable-key buffer + single-frame alias (`engine.ts`).
- **The FrameCompiler** — clock-free value-in→frames-out split, compile-once
  pre-flatten (`finalizeFrameVars`, `frame-compiler.ts:360`), targeted color
  re-normalize without re-flatten/re-sort (`renormalizeColors:387`),
  content-derived idempotent ids. SOTA at its scale.
- **The group compositor** — inline whitelist key-skip, in-place blend, long-lived
  `_grouped`/`entry.values` (zero-alloc modulo the F.W4 fold which landed),
  `scheduler.yield` INP-batched advance (`group.ts` `YIELD_BATCH` + `yieldToMain`).
- **The steppers** — `SmoothProgress`/`SpringProgress`/`Draggable` zero-alloc
  `tickDt` over the F.W5 sync `drive` loop; the closed-form spring/decay analytics.
- **`NumericAnimation`** — the in-tree zero-alloc SoA reference (`numeric.ts`); the
  only further move is the G-2 `Float64Array` + `lerpArray` upgrade (DRY with the
  CSS-engine SoA-segment), and it is gated.
- **The WAAPI harness** — compositor delegation, eligibility gate, the value.js
  rejection (correct by reasoning). The narrowness of eligibility is *why* the
  rAF-path costs (G-1/G-2/G-3) matter for the rAF majority.
- **The value.js boundary** — the single `lerpValue → iv._lerp` seam
  (`engine.ts:731`) means the entire 0.11.0 win (C1 + D2) is consumable with ZERO
  kf source edit; `proof:boundary` self-enforces. The boundary did its job — the
  only thing missing is the **pin** (G-1).

---

## Disposition ledger

| ID | Finding | Site | Measured | Disposition | Instrument |
|----|---------|------|----------|-------------|-----------|
| **G-1** | kf ships value.js 0.10.0; the F.W6 win + D2 live in unconsumed published 0.11.0 | `package.json`/`-lock.json`/`node_modules` vs `npm view`; `vj interpolate.ts:15-63`, `math.ts:48` | pin lag ×3; 0.11.0 carries C1 + `lerpArray` | **SHIP-in-G** (re-pin `^0.11.0`/`^0.9.0`, re-publish) | `proof:vj-pin-current` + `proof:computed-frame` (now green via the consumed dep) |
| **G-2** | per-channel `_lerp` dispatch; live K bimodal — transform animations K=6–10 where `lerpArray` BITES 2.5–4× | `engine.ts:730`, `frame-compiler.ts:360`; `vj math.ts:48` | live K-probe K=1/10/1; `numeric-soa.mjs` 0.73×(1)→4.14×(16) | **MEASURE-FIRST → SHIP** (kf numeric-segment SoA, K≥2) | `proof:interp-soa` (real-K corpus + byte-lock + K=1-alias counter) |
| **G-3** | per-frame `unflattenObjectToString` alloc in DOM-write path; VJ-F4 unaddressed in 0.11.0 | `utils.ts:370`, `engine.ts:735`; `vj units/utils.ts:115-148` | per-frame `{}`+split+concat confirmed; no VJ-F4 commit | **value.js-HANDOFF** (buffer-reusing overload) + kf consumes on re-pin | `%HasFastProperties`/alloc bench (vj) + fold into `proof:zero-alloc` (kf write path) |
| **G-4** | F.W4 buffer/alias + F.W5 sync-step landed, exemplary | `engine.ts:606-711`, `playback.ts:96-132` | benches green; `proof:interp-fastprops` wired; threaded-buffer fast | **ALREADY-SOTA** | — |
| **G-5** | W8 S1 (typed time index), F.W5 held async half, S3 incremental — withholds HOLD | `numeric.ts:8-15`, `engine.ts:821-838`, `group.ts:422-475`, `frame-compiler.ts:350` | re-confirmed; async interior load-bearing | **RECORD** (do not re-raise) | — |

---

## §A — re-runnable probes (node v26, `tranche-g-dev`)

- **A.1 — the pin lag (G-1).** `grep '"@mkbabb/value.js"' package.json` → `^0.10.0`;
  `grep -A1 'node_modules/@mkbabb/value.js' package-lock.json` → `0.10.0`;
  `cat node_modules/@mkbabb/value.js/package.json | grep version` → `0.10.0`; vs
  `npm view @mkbabb/value.js version` → `0.11.0`; `cat
  /Users/mkbabb/Programming/value.js/package.json` (repo HEAD) → `0.11.0`.
- **A.2 — the live K distribution (G-2).** Construct `new CSSKeyframesAnimation();
  a.fromString(css)`, then for each `f` of `a.frames` count `f.allInterpVars` by
  dispatch class (computed / `start.unit==="color"` / else numeric). Results:
  `opacity:0→1` → K=1 numeric; `translate3d+scale+rotate+opacity` → **K=10
  numeric**; `background-color+translateX` → K=1 numeric + 1 color.
- **A.3 — the published SoA K-gate (G-2).** `node bench/numeric-soa.mjs` in the
  value.js repo: 0.73× (K=1, SLOWER) → 1.74× (K=2) → 3.13× (K=8) → 4.14× (K=16) →
  5.23× (K=64). Crossover at K=2.
- **A.4 — the F benches run green (G-4).** `npx vitest bench --run
  bench/interp-buffer.bench.ts bench/interpolation.bench.ts`: threaded-buffer K=2
  34.1k hz / K=5 18.3k hz / K=12 8.4k hz; `interpFrames` 2-frame opacity 996k hz.
  The F.W1 type-only-barrel unblock holds; the F.W4 dict-mode regression is gone.

## Sources

- Live kf (`tranche-g-dev`): `src/animation/{engine,frame-compiler,group,
  numeric,playback,utils}.ts`, `bench/{interp-buffer,interpolation,numeric-soa}`,
  `package.json`/`package-lock.json`, `scripts/proof-interp-fastprops.mjs`.
- Live value.js 0.11.0 (`/Users/mkbabb/Programming/value.js`):
  `src/math.ts:48` (`lerpArray`), `src/units/interpolate.ts:15-63,84,171-227`,
  `src/units/normalize.ts:139-187`, `src/units/utils.ts:115-148`,
  `bench/numeric-soa.mjs`; `git log` (the 0.11.0 changelog `e8cc1fb`).
- F evidence (cited + EXTENDED, not repeated): `F.md` (Band 1 + the KILL/RECORD
  ledger), `FINAL.md:11-12,39-44,93,118` (the re-pin claim), `audit/p-runtime-perf-F`
  (P-1..P-5), `audit/r-interpolation-carrier` (F-1/F-3, the SoA re-point + real-K
  gate), `audit/a-runtime-remeasure`, `audit/r-v8-cost-model`,
  `audit/a-framecompiler-remeasure`.
- V8 object model + SoA (re-confirmed by the direct `numeric-soa.mjs` measurement,
  not re-derived): `Float64Array` dense single-type layout eliminates the AoS
  pointer-chase + the per-element closure dispatch; the same corpus the E/F lanes
  cited.

## inv-16 / inv ε compliance

This doc wrote ONLY `docs/tranches/G/audit/a-engine-perf.md` — ZERO source edits
to keyframes.js or value.js. Every kf claim cites a `file:line` against the live
`tranche-g-dev` tree; every value.js claim cites a `file:line` against the live
0.11.0 repo; every number is from a re-runnable node v26 probe or a shipped bench
(named in §A). The value.js items (D2 consumption is kf-side / G-2; VJ-F4 / G-3;
the `tryParseCache` bound / G-5) are tagged HAND-OFF where they cross the boundary.
**G IMPLEMENTATION awaits explicit authorization — this is TRANCHE DEVELOPMENT,
docs ONLY.**
