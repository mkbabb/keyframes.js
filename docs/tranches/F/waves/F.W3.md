# F.W3 — Author `proof:orchestration` + the two public-API tests (charter F3)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F — test/gate-only
(closes the gate-coverage asymmetry the retro named; ZERO engine behaviour change —
the orchestration tier is correct, it is the GATE that is missing) · **Scope:**
`scripts/proof-orchestration.mjs` (new) + `package.json` (the `proof:*` chain) +
two new `test/*.test.ts` files · **DAG-deps:** depends on F.W0 (the spine); the
gate it authors is a DAG predecessor for Band 3 (F9/F10 finish + dogfood the
orchestration tier F3 gates — `F.md §The DAG · §BAND 3`). Independent of
F1/F2.

The §Mandate (F.W0) is the spine; this wave most tests **inv ε** — the orchestration
tier (E.W10) shipped as the highest-profile new public API with the WEAKEST gate
posture: every OTHER E surface got a named biting gate (`proof:engine-correctness`,
`proof:standalone-zero-alloc`, `proof:compile-deterministic`, `proof:platform-adopt`),
but stagger/flip/drag/decay/Sequence/animate run only under the bare `vitest run` at
the tail of `proof:all` — no `proof-*.mjs` script references them (`a-tranche-retro-F
§3.1`). This wave specs `proof:orchestration` and the two missing public-API
behavioural tests `a-test-quality §3` named.

This is net-new (a gate-coverage asymmetry, NOT inherited debt — the tier LANDED clean
in E.W10; the gap is the gate, not the delivery). Verified not asserted (inv ε) against
`tranche-e-impl`.

**Provenance.** `a-tranche-retro-F §3.1` (the orchestration tier shipped without a named
`proof:*` gate — the single biggest gate-quality gap from E), `a-test-quality §3/§4`
(the two un-isolated public-API surfaces; the orchestration behavioural tests are honest
but ungated as a named instrument).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The orchestration tier shipped WITHOUT a named `proof:*` gate.** The W10 tier has
   unit tests (`test/{stagger,flip,drag,sequence,animate}.test.ts` exist — verified live)
   but **no `proof-*.mjs` script references stagger/flip/drag/sequence/animate as an
   orchestration behaviour gate** (`a-tranche-retro-F §3.1`: "grep over `scripts/proof-*.mjs`:
   zero hits"). The tier runs only under the bare `vitest run` at the tail of `proof:all`
   (`package.json:55`). The E FINAL itself states the orchestration proof is only "unit tests
   + `proof:boundary`" (`a-tranche-retro-F §3.1`) — the *boundary* (light helpers carry
   value.js:0) is gated, but the orchestration BEHAVIOUR is not a named gate.

2. **The unit tests are HONEST — the gap is the named instrument, not the bite.**
   `a-test-quality §0` verifies the orchestration-tier tests assert behaviour with named
   negative controls: `flip.test.ts` asserts the FLIP inversion identity at t=0, lands at
   identity at t=1, counts exactly one mutate between two measurements (the layout-thrash
   lock), with an explicit no-op bite; `drag.test.ts` exercises `decay`/`decayRest`
   closed-form against the analytic `v0·e^(−kt)` to 9 places + the release-velocity → spring
   C¹-continuity handoff. The §ALREADY-SOTA record protects these. The gap is the ABSENCE
   of a named `proof:orchestration` that chains them as a standing instrument — so a future
   regression to the tier has no named gate, only the bare glob.

3. **Two LIGHT public surfaces have no isolated public-API test.** (a) `createNativeTimeline`
   is a public barrel export (`src/animation/index.ts:46`) exercised in `platform-adopt.test.ts`
   only as part of the S5 bridge clauses — there is NO test that it returns the documented
   `null`/fallback when `globalThis.ScrollTimeline` is absent *in isolation* (the contract a
   consumer calling it directly depends on — `a-test-quality §3`). (b) `toEasing` (the light
   normalizer, `index.ts:79`) has no dedicated test — `resolveEasing` is covered
   (`test/resolve-easing.test.ts`, verified) but its synchronous sibling `toEasing` —
   which normalizes a callable/typed `Easing`/string into the `{ fn, css? }` shape every
   light engine consumes — has no isolated lock (`a-test-quality §3`). Verified: `index.ts:79`
   exports both `resolveEasing` and `toEasing`; only `resolveEasing` has a dedicated test file.

4. **`decay` is a non-finding (recorded for honesty).** `a-test-quality §3` checked `decay`
   first and was WRONG to flag it — it is exported at `index.ts:68` and thoroughly tested
   inside `drag.test.ts` (the analytic locks). A locality/naming quibble, not a coverage gap.
   RECORDED so F does not manufacture a `decay.test.ts`.

The wave's job: author `proof:orchestration` (the stagger-distribution / FLIP-rect /
decay-rest / Sequence-ordering bite clauses), add the two isolated public-API tests, and
close it with a gate that bites the exact orchestration regression it forbids.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **`proof:orchestration` authored** — a named `scripts/proof-orchestration.mjs` (chained
  into `proof:all` and the CI `gates` job, F2's surface) that bites if any orchestration
  behaviour clause regresses: the stagger distribution (origin-weighted delay spread), the
  FLIP inversion identity (rect-to-rect transform at t=0/t=1 + the one-mutate-between-two-
  measurements layout-thrash lock), the decay-rest closed-form (`v0·e^(−kt)` analytic), and
  the Sequence ordering (label/seek/play boundary-frame event order). (SHIP-in-F.)
- **The two isolated public-API tests** — `createNativeTimeline` guard-absent (returns the
  documented `null`/fallback when `globalThis.ScrollTimeline` is absent, in isolation) +
  `toEasing` normalizer (what `css` it emits for a callable/typed/string input; how it
  rejects an unparseable string). (SHIP-in-F.)

**Why:** the highest-profile E public API has the weakest gate posture (`a-tranche-retro-F
§3.1`) — closing it is low-cost and removes the asymmetry where every other E surface is
named-gated. The two public-API edges are exercised transitively but not in isolation; their
isolated contract is the kind E.W7 elsewhere insisted on locking (`a-test-quality §3`). F3's
gate is also a DAG predecessor: Band 3's F9 (Sequence transport) + F10 (dogfood) need
`proof:orchestration` to exist as the standing instrument that gates their new behaviour
(`F.md §BAND 3`).

---

## § Scope

### S1 — Author `proof:orchestration` — `a-tranche-retro-F §3.1`

**WHAT:** a named `scripts/proof-orchestration.mjs` gate (wired into `package.json`'s
`proof:all` chain at `:55`, and into the CI `gates` job via F2) with biting behaviour
clauses over the E.W10 tier:
- **stagger** — the distribution clause: origin-weighted delays spread as specified
  (`from: "center"`/`"edges"`/index), summing/ordering correctly (bites: a uniform delay
  where a weighted spread is specified).
- **flip** — the inversion-identity clause: the FLIP transform is identity at t=0 (the
  inverted-to-first state) and lands at identity at t=1 (the play-to-last), with the
  one-mutate-between-two-measurements layout-thrash lock (bites: a second forced measurement,
  or a non-identity endpoint). Mirrors `flip.test.ts`'s existing assertions as a named gate.
- **decay/decayRest** — the closed-form clause: `decay` samples match `v0·e^(−kt)` analytic
  and `decayRest` returns the analytic rest point (bites: a Euler-integrated drift off the
  closed form). Mirrors `drag.test.ts`'s analytic lock.
- **Sequence** — the ordering clause: `add`/`label`/`seek`/`play` produce the specified
  boundary-frame event order (bites: a reordered or dropped boundary event).

Each clause carries an explicit injected bite (the inject-once-to-redden discipline the
other gates use, `proof-brittleness.mjs:166`).

**WHY:** the orchestration tier is the single biggest gate-quality gap from E
(`a-tranche-retro-F §3.1`). A named gate makes the tier's behaviour a standing instrument
(not just a bare-glob tail), closes the asymmetry with the other named E gates, and gives
Band 3 the predecessor gate F9/F10 need. The §Mandate forbids a workaround — this is not
"the unit tests are enough"; the asymmetry is that every other surface is named-gated and
this one is not, so the fix is the named instrument. KISS: the gate chains the EXISTING
honest test assertions as a named clause-set; it does not re-implement them.

### S2 — `createNativeTimeline` guard-absent test — `a-test-quality §3`

**WHAT:** an isolated behavioural test that `createNativeTimeline` (the public barrel export,
`index.ts:46`) returns the documented `null`/fallback when `globalThis.ScrollTimeline` is
absent — the contract a consumer calling it directly depends on (currently exercised only
inside `platform-adopt.test.ts`'s S5 bridge clauses, never in isolation).

**WHY:** it is a PUBLIC API edge whose isolated contract is untested; a consumer calling it
directly (not through the bridge) depends on the guard-absent fallback. Low cost; closes a
public-API edge (`a-test-quality §3`).

### S3 — `toEasing` normalizer test — `a-test-quality §3`

**WHAT:** an isolated test for `toEasing` (the light, value.js-free boundary normalizer,
`index.ts:79`) — its normalization contract: what `{ fn, css? }` shape it emits for a
callable input, a typed `Easing`, and a string; how it rejects an unparseable string.
(`resolveEasing` is covered by `test/resolve-easing.test.ts`; its synchronous sibling
`toEasing` is not.)

**WHY:** `toEasing` is the value.js-free boundary primitive (the whole point of the
LIGHT/HEAVY split, `animation/CLAUDE.md` "Boundary ergonomics") that EVERY light engine
consumes; its normalization contract deserves a direct lock (`a-test-quality §3`).

### S4 — Close: `proof:orchestration` bites + the two tests run — `F.md §F.W3`

**WHAT:** wire `proof:orchestration` into `proof:all` (and CI via F2); assert it bites on
each behaviour clause's negative; assert the two new tests run green and red on their
injected negatives.

**WHY:** inv ε — the close must BITE. `proof:orchestration` is the falsifiable form of
"the orchestration tier is gated"; the two tests are the falsifiable form of "the two
public-API edges have isolated locks."

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **`proof:orchestration` bites on every orchestration behaviour clause.** Inject the
   negative per clause (a uniform stagger delay; a non-identity FLIP endpoint; a Euler-drift
   `decayRest`; a reordered Sequence boundary event) → `proof:orchestration` reds. BITES:
   if any clause stays green on its negative → the gate is narration, reds the wave.
2. **The two public-API tests run and bite.** `createNativeTimeline` returns `null`/fallback
   with `globalThis.ScrollTimeline` absent (bites: a thrown error or a non-null return);
   `toEasing` emits the documented `{ fn, css? }` shape per input and rejects an unparseable
   string (bites: a wrong `css` emit or a silent accept). BITES: revert the contract → reds.
3. **Named-gate parity.** `proof:orchestration` is a NAMED gate in `package.json`'s
   `proof:all` chain (and CI via F2), matching the named-gate posture of every other E
   surface. BITES: the tier left under the bare-glob tail only → reds (the asymmetry persists).
4. **No engine behaviour change.** The orchestration tier source (`stagger.ts`/`flip.ts`/
   `drag.ts`/`decay.ts`/`sequence.ts`/`animate.ts`) is byte-unchanged — F3 adds tests + a gate,
   not a fix (the tier is correct, §ALREADY-SOTA). BITES: an orchestration source edit in F3 → reds.

---

## § Folds

Retires (by finding id):
- **`E3`/`NEW-1`/`V2`/`NEW-6`** — `proof:orchestration` + the two public-API tests
  (`F.md §F.W3`) — S1 (gate) + S2/S3 (tests) + S4 (close).
- **`a-tranche-retro-F §3.1`** — the orchestration tier shipped without a named `proof:*`
  gate (the single biggest gate-quality gap from E) — S1.
- **`a-test-quality §3`** (MED) — `createNativeTimeline` guard-absent + `toEasing` have no
  isolated public-API test — S2 + S3.

**RECORD (carried so no future lane re-raises):**
- **`decay` is a non-finding** (`a-test-quality §3`) — exported at `index.ts:68`, thoroughly
  tested in `drag.test.ts`; a locality/naming quibble, not a coverage gap. RECORDED so F
  manufactures NO `decay.test.ts`.
- **The orchestration unit tests are SOTA-honest** (`a-test-quality §0`) — behaviour-locks
  with named negative controls (the FLIP identity, the analytic decay, the layout-thrash
  lock). RECORDED: `proof:orchestration` CHAINS them as a named gate; it does NOT re-implement
  or replace them.
- **The library line-ceiling DECISION is a band-0 BOOK** (`NEW-3`/`a-engine-post-e F-ENG-5`,
  carried from F.W0 §Folds) — MEASURE-FIRST → BOOK: DECIDE (extend the ceiling to
  `src/animation/**` OR gate an explicit exception); do NOT reflexively split the ~913L
  cohesive `Animation`. RECORDED here as the band-0 standing decision F3's gate-coverage
  framing surfaces but does not resolve.

**Routed to demo-smoke (BOOK, not this wave):**
- **A browser-driven VT/focus a11y assertion** (`a-test-quality §2`) — belongs in the
  existing Chromium demo-smoke job, not a new gate. BOOK; F3's scope is the orchestration
  + public-API vitest tier.

---

## § Design decisions

1. **Chain the honest tests as a named gate — do NOT re-implement them — RESOLVED.** The
   orchestration unit tests are SOTA-honest (`a-test-quality §0`); the gap is the absence of
   a NAMED instrument, not the bite. `proof:orchestration` chains the existing behaviour
   assertions (the FLIP identity, the analytic decay, the Sequence order) as a named
   clause-set, matching the named-gate posture of every other E surface. Trade-off: a named
   gate that wraps existing tests reads as "redundant" — but the named instrument is the
   thing the asymmetry is about (the tier had no named gate), and Band 3 needs it as a
   predecessor; KISS favors chaining the honest tests over a parallel re-implementation.

2. **The two public-API tests lock the ISOLATED contract — RESOLVED.** Both surfaces are
   exercised transitively (`createNativeTimeline` in the bridge clauses, `toEasing`
   incidentally), but a consumer calling them DIRECTLY depends on the isolated contract
   (the guard-absent fallback; the `{ fn, css? }` normalization). E.W7 elsewhere insisted on
   locking exactly such isolated public-API edges. Trade-off: the transitive coverage
   "already exercises" them — but the isolated contract (what happens when called alone, at
   the boundary) is the public guarantee, and it has no lock today.

3. **F3 adds tests + a gate, NOT a fix — RESOLVED + HONEST (inv ε).** The orchestration tier
   LANDED clean in E.W10 (`a-tranche-retro-F §0`: F-1…F-5 from the A→E retro were delivered,
   not deferred); the tier is correct and §ALREADY-SOTA. F3 does NOT re-table the tier as
   open or manufacture a fix — it closes the GATE-COVERAGE asymmetry. Trade-off: a wave that
   only adds gates/tests reads as "less work" — but the §Mandate forbids manufacturing a
   deficit where the delivery is exemplary; the honest F3 surface is the missing named gate
   and two isolated locks, nothing more.
