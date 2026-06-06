# Tranche F deep-SOTA audit — lane `a-test-quality`

**Scope:** the test + gate suite of keyframes.js post-D+E. Coverage gaps, gate
QUALITY (do they BITE, or narrate?), gate-locking of the new E surfaces
(orchestration tier · platform adoption · View-Transitions), bench coverage, and
the verification discipline F should add. Every code claim is file:line-grounded;
every disposition is tagged.

**Method.** Read the 40 test files + 10 `proof-*.mjs` source-gates + the 3 bench
files + `package.json` `proof:all` chain + `.github/workflows/ci.yml`. Cross-read
the E close (`docs/tranches/E/FINAL.md`) so this lane DIFFS E rather than repeats
it. Per the §Mandate I manufacture no work: where the post-E state is exemplary I
say so plainly (§0).

---

## 0. ALREADY-SOTA — what is exemplary (manufacture no work here)

The bite-discipline is, lane-wide, genuinely SOTA and I am not inventing a deficit
where none exists. Concretely:

- **The vitest proof-tests assert BEHAVIOUR with named negative controls, not
  presence.** `test/zero-alloc.test.ts` proves zero-alloc by BUFFER IDENTITY
  (`expect(r1).toBe(r2)`, zero-alloc.test.ts:58) and ships an in-file `LeakyGroup`
  bite (zero-alloc.test.ts:92-104) that reds the moment a per-frame literal returns
  — a deterministic, env-independent proof, not a heap sniff. `test/engine-correctness.test.ts`
  (5 Strand-A locks) documents the BITE per test and asserts the *difference* a fix
  restores (e.g. FC-1: `expect(afterLab).not.toBe(before)`, engine-correctness.test.ts:35;
  round-trips oklab back, :38). `test/compile-deterministic.test.ts:42-43` proves
  true idempotence by a THIRD compile, not first-pair luck.
- **The `.mjs` source-gates red on the exact negative they forbid, and SAY so.**
  `proof:engine` greps for `tick(` residue → "the absolute-clock advance must be
  `advanceTo(`" (proof-engine.mjs:37), a regrowing god-object ceiling
  (proof-engine.mjs:72), a reduced-motion snap that leaves a scheduled frame
  (proof-engine.mjs:102). `proof:dogfood` word-boundaries `\brequestAnimationFrame\b`
  and subtracts an EXPLICIT reviewable allowlist (proof-dogfood.mjs:53,59) so a new
  raw-rAF site is a deliberate diff, not a silent slip.
- **The LoAF playwright bench is a real assertion, not a throughput vanity.**
  `bench/playwright.bench.ts` asserts NO >50ms BLOCKING frame during a 200-cell
  `AnimationGroup` composite (playwright.bench.ts:257,274), correctly keys on
  `blocking` not total `duration` (paint vs main-thread monopoly, :248-256), and
  ships TWO bite controls — `KF_LOAF_INJECT_BLOCK=1` (synthetic 120ms block) and
  `KF_LOAF_NO_OBSERVER=1` (a dead-observer green is itself a failure, :241-246).
  This is the rare bench that *gates*.
- **The orchestration-tier behavioural tests are honest.** `flip.test.ts` asserts
  the FLIP inversion identity at t=0 (flip.test.ts:69-72), lands at identity at t=1
  (:91-95), counts exactly one mutate between exactly two measurements
  (:137-145, the layout-thrash lock), and carries an explicit no-op bite (:98-112).
  `drag.test.ts` exercises `decay`/`decayRest` closed-form against the analytic
  `v0·e^(−kt)` to 9 places (drag.test.ts:47-53) AND the release-velocity → spring
  C¹-continuity handoff (:131-145).
- **No silent coverage holes:** zero `.skip`/`.todo`/`.only` across `test/`
  (verified). No test is parked.

This is a strong baseline. The findings below are about the *seam* between gates
and CI, two genuine coverage gaps, and the bench frontier — not the bite quality
of the gates that run.

---

## 1. FINDING (HIGH) — the gate/CI seam: 8 of 13 `proof:*` gates never run in CI;
the only View-Transitions lock is author-runtime-only

**Disposition: SHIP-in-F (wire the author-only gates into CI; cheap, high-leverage).**

`package.json` `proof:all` chains 13 gates + `vitest run`. But `.github/workflows/ci.yml`
runs only a SUBSET, and `proof:all` itself is **never invoked in CI** (grep count
= 0). The precise split (verified gate-by-gate against ci.yml):

| Gate | Kind | Runs in CI? | How |
|---|---|---|---|
| `proof:boundary` | .mjs grep+bundle | YES | ci.yml:93 |
| `proof:engine` | .mjs grep | YES | ci.yml:95 |
| `proof:zero-alloc` | vitest | YES | ci.yml:97 |
| `proof:decomposition` | .mjs grep | YES | ci.yml:163 (demo job) |
| `proof:idioms` | .mjs grep | YES | ci.yml:165 (demo job) |
| `proof:brittleness` | .mjs grep | YES | ci.yml:167 (demo job) |
| `proof:engine-correctness` | vitest | YES* | via `npm test --run` (ci.yml:92) |
| `proof:platform-adopt` | vitest+grep | PARTIAL | the vitest half runs via `npm test`; the **.mjs source-grep half is NOT named** |
| `proof:standalone-zero-alloc` | vitest | YES* | via `npm test --run` |
| `proof:compile-deterministic` | vitest | YES* | via `npm test --run` |
| **`proof:dogfood`** | .mjs grep | **NO** | named nowhere in ci.yml |
| **`proof:demo-elevate`** | .mjs grep | **NO** | named nowhere in ci.yml |
| **`proof:modern-web`** | .mjs grep | **NO** | named nowhere in ci.yml |

\* The four vitest-named proof scripts (`engine-correctness`, `standalone-zero-alloc`,
`compile-deterministic`, the `platform-adopt.test.ts` half) DO bite in CI because
`vitest run` globs all `test/*.test.ts` — confirmed: those four files live in `test/`
and CI runs `npm test -- --run` (ci.yml:92). So the *behavioural* E locks are safe.

The genuine hole is the three **`.mjs` source-grep gates** — `proof:dogfood` (inv ζ,
the rAF-dogfood lock), `proof:demo-elevate` (inv ο, the E.W11 demo close), and
`proof:modern-web` — plus the **.mjs half of `proof:platform-adopt`** (inv ξ, ci-named
nowhere). These execute ONLY when a human types `npm run proof:all` locally. Nothing
in CI reds if a future edit:

- adds a raw `requestAnimationFrame` to a non-allowlisted demo file (dogfood would
  catch it — proof-dogfood.mjs:53 — but CI never calls dogfood);
- **deletes the View-Transitions route** in `demo/app/useSceneTransition.ts`. The
  *only* lock on the entire E.W11 VT surface is `proof:demo-elevate`'s VT clause
  (proof-demo-elevate.mjs:25-46), and it is author-only. There is no behavioural
  VT test (`grep -rln startViewTransition test/` = NONE) — defensible, since VT
  needs a real browser and is a demo-only concern (no engine VT API exists). But
  with the sole structural lock off-CI, the VT surface is effectively **ungated in CI**.
- reverts the platform-adopt source forms (the `.mjs` clauses at
  proof-platform-adopt.mjs:83-278 that check `CSS.registerProperty` is feature-detected,
  the reduced-motion change-listener exists, the WAAPI densification loop exists).
  The behavioural half in `platform-adopt.test.ts` still bites for the runtime
  contracts, but the *source-shape* clauses (feature-detect present, no bare call,
  no polyfill dep) go unchecked.

**Why this matters (not narration):** the E close (FINAL.md:86-94) asserts
"`npm run proof:all` … exits non-zero on any failure … Each gate is bite-proven."
True — but the regression AUTHORITY in practice is CI, and CI runs `proof:all`
nowhere. The bite-proof is a one-time author act; the standing guarantee is only as
strong as what CI executes. Three inv-tagged gates (ζ, ο, ξ-source-half) currently
have no standing enforcement.

**F should:** add one CI step `npm run proof:all` (or, to keep the demo/library job
split, add the three `.mjs` gates to the `gates` job — they are grep-only, no browser,
fast). `proof:lighthouse-mobile` legitimately stays browser-gated/CI-calibrated
(FINAL.md:54); the other three have no such excuse. This is the single highest-leverage,
lowest-cost verification-discipline F can add. **Grounding:** ci.yml:44-199;
package.json `proof:all`; proof-demo-elevate.mjs:25-46; proof-dogfood.mjs:53,59.

---

## 2. FINDING (MED) — `proof:demo-elevate` is structurally a NARRATION-RISK gate
(presence-grep, not behaviour); compounded by being author-only (§1)

**Disposition: RECORD (acknowledge the limit) + MEASURE-FIRST (a browser-driven
a11y/VT assertion is the real fix, but it belongs in the existing demo-smoke browser
job, not a new instrument).**

Unlike the vitest proofs, `proof:demo-elevate` (and its siblings `proof:idioms`,
`proof:decomposition`, parts of `proof:modern-web`) are pure file-content greps. They
assert a *form exists in a file*, not that the *behaviour holds*. Examples from
proof-demo-elevate.mjs:

- a11y clause (proof-demo-elevate.mjs:48-77): asserts `CopyButton.vue` contains
  `<button` and no `<span @click>` (:52); asserts `TimelineTrack.vue` contains the
  string `role="slider"` + `aria-valuenow` (:59). It does NOT verify the slider is
  keyboard-operable, focus-reachable, or that the role is on the right element —
  a `role="slider"` string in a comment or a dead branch passes.
- VT clause (:25-46): asserts `useSceneTransition.ts` contains `startViewTransition`
  + the glass-ui import (:29). It cannot verify the transition actually runs, routes
  focus on `.finished`, or falls back when VT is absent — only that the tokens are present.
- first-paint clause (:108-122): greps the `@font-face` for `size-adjust` /
  `ascent-override` / `descent-override` strings. A wrong numeric value passes.

This is **inherent** to a static gate and is not a defect to "fix" by deleting the
gate — a presence-grep is a legitimate cheap tripwire. But two things compound it:
(a) being author-only (§1) removes even the tripwire from CI; (b) the gate's own
docstring (proof-demo-elevate.mjs:1-8) claims it "reds on the exact regression it
forbids" — true only for *structural deletion*, not behavioural regression. The
honest framing: these are **shape locks**, and the demo-smoke browser job
(ci.yml:100-168, which already runs Chromium + `occlusion-gate` + `lighthouse-gate`)
is where the *behavioural* a11y/VT assertion belongs. The `lighthouse-gate`
(ci.yml:154, A11y=100) already covers part of the a11y surface behaviourally in CI —
which makes the author-only structural a11y clause partly redundant and partly a gap
(VT and focus-routing are NOT in the lighthouse gate).

**F should:** RECORD that `proof:demo-elevate`/`idioms`/`decomposition` are shape
locks (rename the docstring claim from "behaviour" to "structural form"), and BOOK a
browser-driven VT/focus assertion into the existing demo-smoke job (it already has
Chromium) rather than spawning a new gate. **Grounding:** proof-demo-elevate.mjs:1-8,
29,52,59,117; ci.yml:154 (lighthouse a11y already in CI).

---

## 3. FINDING (MED) — coverage gaps in two LIGHT public surfaces

**Disposition: SHIP-in-F (two small behavioural tests; the API is public + untested-in-isolation).**

Cross-checking the public barrel (`src/animation/index.ts`) export-by-export against
the test suite surfaces two genuine gaps. (I checked `decay` first and was WRONG to
flag it — it is exported at index.ts:68 and thoroughly tested, just *inside*
`drag.test.ts:34-95` rather than a `decay.test.ts`; that is a locality/naming quibble,
not a coverage gap. I record it as a non-finding for honesty.)

The real gaps:

1. **`createNativeTimeline` has no GUARD-absent unit test of its own.** It is a public
   barrel export (index.ts:46) and is exercised in `platform-adopt.test.ts` (imported
   at platform-adopt.test.ts:30), but only as part of the S5 bridge clauses. There is
   no test that `createNativeTimeline` returns the documented `null`/fallback when
   `globalThis.ScrollTimeline` is absent *in isolation* — the contract a consumer
   calling it directly depends on. Low cost; closes a public-API edge.

2. **`toEasing` (the light normalizer, index.ts:79) has no dedicated test.** `resolveEasing`
   is covered (`resolve-easing.test.ts`, 8 tests) but its synchronous sibling `toEasing`
   — which normalizes a callable/typed `Easing`/string into the `{ fn, css? }` shape
   that EVERY light engine consumes — has no `grep toEasing test/` hit beyond incidental
   use. Given it is the value.js-free boundary primitive (the whole point of the
   LIGHT/HEAVY split, animation/CLAUDE.md "Boundary ergonomics"), its normalization
   contract (what `css` it emits, how it rejects a string) deserves a direct lock.

Neither is a correctness HOLE today (both are exercised transitively), but both are
PUBLIC API edges whose isolated contract is the kind E.W7 elsewhere insisted on
locking. **Grounding:** index.ts:46,79; platform-adopt.test.ts:30; resolve-easing.test.ts
(covers resolveEasing, not toEasing); drag.test.ts:34-95 (decay IS covered — non-finding).

---

## 4. FINDING (MED) — the bench tier has a coverage frontier + zero regression budget
(except the LoAF gate)

**Disposition: MEASURE-FIRST (the orchestration + FrameCompiler benches are net-new
surface; add throughput baselines BEFORE claiming a perf win) + RECORD (the
no-budget posture is intentional but should be stated).**

`bench/` has three files. `interpolation.bench.ts` covers `interpFrames` (2-frame,
multi-prop, 11-stop) + the 3-animation group composite (interpolation.bench.ts:5-82).
`parser.bench.ts` covers `parseCSSKeyframes` cold + the `fromString` end-to-end
(parser.bench.ts:14-35). `playwright.bench.ts` is the LoAF gate (§0).

The frontier — net-new E surfaces with NO bench at all:

- **The entire orchestration tier** (`spring`, `stagger`, `flip`, `sequence`, `drag`,
  `decay`, `animate`) — shipped E.W10 as public API (FINAL.md:79) — has zero throughput
  coverage. `SpringProgress.tick` and the `springLinearStops`/`springTimingFunction`
  emit are hot-path-shaped and unmeasured.
- **`FrameCompiler`** (the E.W8 determinism seam, `src/animation/frame-compiler.ts`)
  has correctness locks (`frame-compiler.test.ts`, `compile-deterministic.test.ts`)
  but no *compile-throughput* bench — directly relevant to E's WITHHELD W8 S1/S2/S3
  (typed time index, slot map, incremental `updateSegments`), which were
  measure-first-deferred (FINAL.md:46-49). **F cannot re-measure E's W8 withhold
  without a FrameCompiler bench that doesn't exist.** This is the load-bearing gap:
  the E close says the SoA micro-reps are "withheld … for a negligible gain" — but
  there is no bench harness in-tree to confirm the gain is negligible *or* to detect
  if it became non-negligible after D+E's changes. Same for W7 Strand-B micro-perf
  (the flatVars dict / monomorphic access, FINAL.md:43-45): no bench measures it.

Second, the bench posture: only `playwright.bench.ts` ASSERTS (it gates). The two
vitest benches are pure throughput reporters with no budget — a 2× interp regression
prints a slower number and stays green. That is a defensible default (micro-benches
are noisy in CI), but it means the "measure-first" discipline E invokes has, for the
interpolation/parse paths, **no standing measurement** to compare against — each
re-measure starts from zero.

**F should:** (a) add a `FrameCompiler` compile-throughput bench + a `SpringProgress.tick`
bench — these are the harnesses required to honestly re-measure (or finally retire)
E's W8/W7 withholds rather than re-asserting "negligible"; (b) RECORD that the vitest
benches are intentionally budget-free reporters (so a future lane doesn't mistake
green for "no regression"). **Grounding:** interpolation.bench.ts:5-82; parser.bench.ts:14-35;
FINAL.md:43-49 (W7/W8 withholds); src/animation/frame-compiler.ts (no bench); the
orchestration sources at src/animation/{spring,stagger,flip,sequence,drag,decay,animate}.ts.

---

## 5. FINDING (LOW) — `vitest run` globs every `test/*.test.ts`; a stray name silently
joins (or escapes) `proof:all` — make the gate↔test mapping explicit

**Disposition: RECORD (a real fragility, but low-blast-radius; document the convention).**

The four vitest-based proof scripts name their files explicitly (e.g.
`proof:engine-correctness` → `vitest run test/engine-correctness.test.ts`,
package.json). But CI's coverage of them is INCIDENTAL: they run because
`npm test -- --run` globs all of `test/` (ci.yml:92), not because CI names them. Two
consequences: (a) a new `test/*.test.ts` auto-joins the CI surface with no review of
*which gate* it belongs to (good for coverage, but the gate↔file mapping is implicit
and undocumented); (b) if a proof test file were ever renamed to not match `*.test.ts`,
its `proof:*` script would still pass while CI silently dropped it. Neither is a live
bug. It is a verification-discipline note: the **gate-to-file map is undocumented**,
so the "13 gates" headline (FINAL.md:92) and the 40 files have no single source of
truth tying them together. **Grounding:** package.json `proof:*` scripts; ci.yml:92.

---

## 6. The E-withhold re-measure ledger (what F can/can't re-measure today)

Per the brief, I checked whether E's measure-first WITHHOLDS are re-measurable from
the current test/bench tooling:

| E withhold (FINAL.md) | Re-measurable now? | Blocker |
|---|---|---|
| W7 Strand-B micro-perf (flatVars dict, monomorphic access) | NO | no bench targets the per-frame DOM-write path in isolation (§4) |
| W8 S1/S2/S3 (SoA time index, slot map, incremental compile) | NO | no FrameCompiler compile-throughput bench exists (§4) |
| W5 `tryParseCache` eviction | N/A | working-set assumption; not a perf bench question |
| W4 lighthouse-mobile | PARTIAL | author/CI-gated already (proof:lighthouse-mobile, FINAL.md:54) — honest |

So F's *first* job to honestly re-measure E's two perf withholds is to **build the
two missing benches** (§4) — without them, any F claim that "the SoA win is still
negligible" would be assertion, not measurement, violating inv ε. This is the through-
line connecting §4 to the brief's "RE-MEASURE E's withholds" mandate.

---

## 7. value.js hand-off (inv-16) — none net-new from this lane

This lane surfaces no NEW value.js proposal. The existing E hand-offs
(`valuejs-sota-handoff.md` W9 S4/S6, and VJ-1 the canonical `decay` closed-form noted
at decay.ts:16-18) are unaffected by test/gate posture. The one adjacency:
`decayRest`/`decay` ship keyframes-local pending the value.js VJ-1 canonical surface
(decay.ts:16-18) — when that lands, the existing `drag.test.ts:34-95` decay coverage
becomes the byte-equality contract for the collapse-to-thin-caller, so no NEW test is
needed there. RECORD only.

---

## Disposition summary

| # | Finding | Severity | Disposition |
|---|---|---|---|
| 0 | Bite-discipline is genuinely SOTA (vitest behaviour-locks, LoAF gate, orchestration tests) | — | ALREADY-SOTA (manufacture no work) |
| 1 | 3 `.mjs` gates (dogfood/demo-elevate/modern-web) + platform-adopt source-half never run in CI; VT lock is author-only | HIGH | **SHIP-in-F** (wire proof:all / the 3 grep gates into CI) |
| 2 | `proof:demo-elevate` is presence-grep (shape lock, not behaviour); docstring overclaims | MED | RECORD + MEASURE-FIRST (browser a11y/VT assertion into demo-smoke job) |
| 3 | `createNativeTimeline` guard-absent + `toEasing` have no isolated public-API test | MED | **SHIP-in-F** (two small behavioural tests) |
| 4 | No bench for the orchestration tier or FrameCompiler → E's W7/W8 withholds are not re-measurable | MED | MEASURE-FIRST (add the 2 benches) + RECORD (vitest benches are budget-free) |
| 5 | gate↔test-file mapping is implicit (vitest globs); undocumented | LOW | RECORD |
| 6 | E perf-withhold re-measure is blocked on §4's missing benches | — | (synthesis of §4) |
| 7 | No net-new value.js hand-off from this lane | — | RECORD |

**The honest headline:** the gates that RUN are strong and bite; the problem is the
*seam* — `proof:all` is never invoked in CI, so 3 inv-tagged grep gates (incl. the
sole View-Transitions lock) have no standing enforcement (§1), and E's two perf
withholds cannot be re-measured because the benches to do so don't exist (§4, §6).
Both are cheap, high-leverage F work; neither is manufactured.
