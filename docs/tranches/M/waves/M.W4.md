# M.W4 — Synthetic-clock settle · superfluity prune · two-axis taxonomy

- **Band:** A · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** none
  (entirely kf-internal — no value.js / parse-that / glass-ui edge; the rAF hook,
  the prune targets, and the taxonomy are all kf-owned). Parallel with M.W2 ∥ M.W3;
  does NOT require M.W1 (composes with it — M.W1's report-all runner schedules the
  new gates as nodes it no longer aborts the chain on; the synthetic clock's wall-clock
  win compounds with the runner's iterate-count win).
- **Gate (new):** `proof:gate-is-data-model` — the AXIS-2 meta-gate (inv-M-two-axis).
  Born-RED on today's tree because **no `proof:data-model` sub-aggregator exists, no
  assertion that the AXIS-2 hygiene gates load the compiled engine vs. grep source,
  and no machine-readable second axis in `proof:chronic-closure`** (`proof:gate-is-data-model`
  and `proof:data-model` are both ABSENT from `package.json` and `scripts/` — verified
  2026-06-17). The synthetic-clock settle and the prune carry their own born-RED gates
  (below); `proof:gate-is-data-model` is the wave's NAMED born-RED per the M.md row.
- **Folds (lane #):** L16 (superfluity — the firm 3-clause prune, each subsumption-cited) ·
  L17 (browser-coldboot — the 264 settle-sleep census + the synthetic-clock hook point +
  the two `observe-only` discharges) · L18 (precept-contrivance — the runtime-ONLY
  precept reformed to inv-M-two-axis, the `proof:gate-is-data-model` meta-gate, the
  AXIS-2 reclassification)
- **Precept cure:** ⚠M7 (the 264 `waitForTimeout` settle-sleeps — inv-L-device-honesty,
  only partially cured by L.W4) · the V1/V2/V3/V4 axis-conflation violations (lane-18 §6)

---

## Context

M.W4 is the third Band-A consolidation wave. M.W1 kills the O(N²) iterate (runner
topology); M.W2 builds the LINT tier (source-shape gates → static rules); M.W3
migrates the 72 runtime gates to a shared-browser INTEGRATION tier. **M.W4 cures
the three residuals those waves do not own:** the wall-clock floor inside each
browser gate (the 264 animation-settle sleeps), the redundant browser clauses that
re-measure a sibling's oracle, and the precept gap that has no name for the
data-model correctness class. Each is an architectural transposition for elegance,
simplicity, and device-honesty — none a workaround.

### (a) The 264 `waitForTimeout` settle-sleeps — the wall-clock floor (lane-17)

`proof:all`'s browser tier is 92–96% of total wall-clock; inside that tier the
**264 `waitForTimeout` sleeps** are the irreducible floor — even a perfectly fast
host cannot beat the declared sleep sum. Verified live (2026-06-17):

```
grep -rn "waitForTimeout" scripts/proof-*.mjs | wc -l   → 264
  proof-live-session.mjs                40    (≥20 s of declared sleep in one run)
  proof-scene-machine-irrefragable.mjs  27
  proof-fsm-suspend-resume-live.mjs     20
  proof-live-session-mobile.mjs         13
  proof-appearance-suffusion.mjs        11
  proof-scene-parity.mjs                10
```

L.W4 landed `waitForRender` (the `waitForFunction`-predicate settle primitive,
`demo-driver.mjs`, 7 references) and `proof:settle-is-predicate` — but its scope is
**`openControlsPanel` ONLY** (`proof-settle-is-predicate.mjs:8,22-23`: "greps the
`openControlsPanel` function body … asserts ZERO `page.waitForTimeout(...)` calls").
The **animation-duration settle class** — the 264 sleeps in the gate scripts
themselves — is entirely intact. This is the `PROGRESS.md §2.2 W28`
macOS-pass/Linux-fail render-race root for ~250 of the 264 calls: a
`waitForTimeout(700)` after "trigger the animation" waits for the animation to reach
**visual settlement**, and the terminal position can be reached at `t < 700ms` (fast
box) or overrun (slow box). A longer ceiling predicate is unsound for this class —
**the correct cure is a synthetic clock that advances the animation deterministically.**

**The hook point is verified and single (lane-17 §2.2).** ALL animation timing
converges on ONE rAF dispatch:

```
src/animation/internal/leaves.ts:87-89   requestAnimationFrame shim — delegates to
                                          window.requestAnimationFrame when present,
                                          else setTimeout(Date.now()) fallback
src/animation/playback.ts:119            RAFPlayback._run → requestAnimationFrame(frame)
                                          — the single dispatch; "No other module owns
                                          a rAF handle" (CLAUDE.md). play/drive/loop all
                                          converge here; SpringProgress / SmoothProgress /
                                          NumericAnimation / AnimationGroup all ride it.
```

The synthetic clock injects a **test-controlled `window.requestAnimationFrame`** via
`page.addInitScript` (browser-context only — NO source change to `leaves.ts`, because
the shim already delegates to `window.requestAnimationFrame` when present). The fake
queues callbacks without scheduling the compositor and exposes a `__tick(virtualMs)`
the test calls to advance virtual time and fire the queue with `now = virtualMs`. For
the jsdom/unit side, the `setTimeout` fallback already routes through Node timers, so
`vi.useFakeTimers()` + `vi.advanceTimersByTime()` drives the same family — different
injection layer, one conceptual cure.

**The taxonomy ALREADY prescribes this** (`gate-taxonomy.md:54-55`, the BINDING posture
manifest, machine-checked by `proof:ci-coverage` clause 4):

> `proof:perf-frame-budget` — Architectural cure: "A synthetic-time clock injected
> into the rAF driver … the felt frame budget is measured against virtual elapsed ms,
> not the runner's wall-clock under load."
> `proof:scene-transition-perf` — Architectural cure: "Drive the scene transition under
> a deterministic synthetic clock (fake-time rAF) so the settle-within-budget assertion
> reads virtual ms, decoupling the transition-perf verdict from the shared-runner CPU."

M.W4 is where that named cure LANDS. Implementing it promotes both gates from
`observe-only` to `hard` — a genuine correctness upgrade, not just a speedup.

**Two classes of sleep, only one addressable (lane-17 §2.3 — the trap):**

- **Class A — animation-duration settle (the synthetic-clock target):** trigger an
  animation, wait for it to complete. `waitForTimeout(700)` → `__tick(700)` → assert
  immediately. ~250 of 264 calls. This class is the wall-clock load.
- **Class B — GPU/compositing warm-up (NOT addressable):** waits for the real GPU
  process to warm, not for virtual animation time. Verified live: `proof-live-session.mjs:697`
  (`// warm the shared GPU process (UNBUDGETED)`) and `:704` (`// ≥2s STEADY-STATE present
  loop on a warm GPU, NO readback`). The amiga Three.js renderer rAF is the canonical
  Class-B case (real GPU frame time). A synthetic clock CANNOT replace these — they stay
  `waitForTimeout` or carry an `observe-only` note. **The injection must be opt-in
  per-gate** (`injectSyntheticRaf(page)` called explicitly), NOT a default `withPage`
  hook, so amiga/GPU-probing gates keep real time. Class B is ~10–15 calls.

### (b) The ~13 redundant clauses — the firm prune (lane-16)

Lane-16 separated the audit-C "~24–28 collapsible" claim into TWO kinds: **R4
shared-cold-boot amortization** (~10–11 clauses — these require the M.W3 shared-browser
runner and are NOT standalone-safe, deferred to M.W3) and **firm R1/R2 clause
duplicates** (the standalone prune, provable zero coverage loss). The firm,
M.W4-local prune is **3 clause removals (1 gate browser-retired)**, each with its exact
subsumer cited and verified live (2026-06-17):

| Pruned clause | Type | Subsumed by (live anchor) | Coverage loss |
|---|---|---|---|
| `card-rounded-primitive` browser half — the `computedHalf` 4-scene `[data-surface="glass"]` non-zero-radius sweep (`proof-card-rounded-primitive.mjs:180,205-216`, `maxRadius > 0`) | R1 exact | `stage-glass-card` (`proof-stage-glass-card.mjs:117`, identical `[data-surface="glass"]` in `.stage-cell`, same 4 scenes, same `maxRadius > 0`) | **None** |
| `easing-sidebar-minimal` B4 — exactly 1 `.rounded-card.text-card-foreground` in the sidebar (`proof-easing-sidebar-minimal.mjs:293-294`) | R2 nested | `easing-sidebar-normalized` (exactly 1 Card on the same sidebar — 1 Card ⊇ 1 Card; B4 cannot red while normalized's flatten clause is green) | **None** |
| `bezier-grown` clause 3 — `scrollHeight ≤ clientHeight + TOL` + `overflow-y !== 'scroll'` on the grown panel (`proof-bezier-grown.mjs:34,36`, the file's own header admits "composes with proof:bezier-no-scroll") | R1 exact | `bezier-no-scroll` (identical scroll-fit assertion on the identical panel host selector) | **None** |

The defended-EARNED clauses are NOT pruned (lane-16 §5.1): `card-rounded-primitive`
clause 1 (static source grep of 5 Target.vue files — CHEAP, no browser) and clause 3
(the `cards.css` consume-leg witness that flips RED when glass-ui ships
`cartoon-surface { border-radius }` — the ONLY gate that owns this primitive-publish
signal); the `hero-rung`/`hero-balance`/`hero-cls` trio (3 orthogonal oracles on one
`<h1>`); `bezier-no-scroll`/`bezier-single-card` + `bezier-grown` clauses 1–2 (3
distinct invariants); `scene-card-rounded` (scopes the SIDEBAR `.controls-layout`, NOT
the stage cell); `appearance-suffusion`/`scene-parity`/`cohesion` (partitioned). After
the prune `card-rounded-primitive` keeps clauses 1+3 and runs as a source-shape +
consume-leg gate in ~0.1s instead of an ~11s browser sweep — `stage-glass-card` is the
named browser owner of the radius assertion.

> **Subsumption-cited, not count-chased.** The audit-C "~13" figure conflated R4
> amortization with R1/R2 duplicates. The honest M.W4-local prune is **3 firm clause
> removals** (each with a live subsumer + a planted-violation witness in the born-RED
> gate). The R4 surface-consolidation (bezier/sidebar/hero into shared-browser test
> files) folds into M.W3 where the shared browser exists; it is NOT a standalone prune
> and is excluded from this wave (see Excluded).

### (c) The runtime-ONLY precept reform → inv-M-two-axis (lane-18)

The `proof:gate-is-runtime` precept is **correct and is NOT weakened.** It is the
right answer to the UI/interaction correctness class — it caught the over-removal
blank-out (`rootcause-rc-gate-blindspot.md:164`) and the ROOT-A appearance misses
(`a-gate-blindspots.md:21,82`) that jsdom/grep cannot see. The 18-member all-browser
correctness tier stays verbatim.

**The contrivance is the absence of a NAMED data-model-correctness axis.** L's
data-model gates (`proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`,
`proof:transport-events`, `proof:orchestration`, `proof:blend`) assert behavioural
correctness of the COMPILED engine — round-trip identity, serialize/parse symmetry, API
contract — yet they live in `proof:hygiene` beside lint-class source-shape gates
(`proof:boundary`, `proof:decomposition`, `proof:no-dup-utility`). Verified live: all six
data-model gates are `correctness: false, hygiene: true`. They are neither source-shape
(they run the real engine and fail if its output is wrong) nor UI/interaction (no DOM,
no pixel, no pointer). L resolved the tension with a **prose escape** —
`proof:chronic-closure`'s `nonGateMechanism` keyword grep (`proof-chronic-closure.mjs:408`:
`/…|node probe|…|fixture|corpus/i`) plus plain-prose (non-backtick) citation in the
ledger. It works, but it is architecturally silent: not machine-enforced, not a precept,
and it caused the `proof:transport-events` mis-tiering incident (`FINAL.md:295-300` — the
author naturally tiered a correctness-significant data-model gate into `proof:correctness`;
`proof:gate-is-runtime` rightly rejected it for lacking a browser; the cure was to demote
it). That incident recurs for every future data-model gate.

The reform formalizes the **second axis** (lane-18 §5):

```
CORRECTNESS-AXIS-1 (UI/interaction): browser over built dist, actuate, zero budget.
  Tier proof:correctness · Meta-gate proof:gate-is-runtime (UNCHANGED).
CORRECTNESS-AXIS-2 (data-model): round-trip identity / serialize-parse symmetry / API
  contract over the COMPILED engine (dist or vitest-over-src), NOT source grep.
  Tier proof:data-model (a named sub-aggregator within proof:hygiene) ·
  Meta-gate proof:gate-is-data-model (NEW — imports dist + runs off-DOM; the AXIS-2
  mirror of "opens a browser AND actuates").
LINT axis: source text wrong → eslint/depcruise (M.W2), not a correctness axis.
```

The device-honesty win is **untouched**: AXIS-1 device-dependent gates keep
`declarePosture("observe-only", CATEGORY)`; AXIS-2 gates are structurally
device-independent (no rendering, no timing, no viewport) so they require no posture
by construction. The reform makes that property machine-readable rather than implicit.

### Audit evidence

| Ref | Source location (verified 2026-06-17) | Fact |
|-----|---------------------------------------|------|
| lane-17 §1.3 | `grep -rn waitForTimeout scripts/proof-*.mjs \| wc -l` | **264** settle-sleeps; `proof-live-session.mjs` carries 40 |
| lane-17 §2.2 | `src/animation/internal/leaves.ts:87-89`; `src/animation/playback.ts:119` | the single rAF dispatch — `RAFPlayback._run → requestAnimationFrame(frame)` → the shim delegates to `window.requestAnimationFrame` |
| lane-17 §2.1 | `docs/tranches/J/gate-taxonomy.md:54-55` | the synthetic-time clock is the NAMED Architectural cure for `proof:perf-frame-budget` + `proof:scene-transition-perf` |
| lane-17 §2.3 | `proof-live-session.mjs:697,704` | Class B GPU warm-up sleeps — explicit `// warm the shared GPU process (UNBUDGETED)` / `// …STEADY-STATE present loop on a warm GPU` comments |
| L.W4 precedent | `proof-settle-is-predicate.mjs:8,22-23,27` | `waitForRender` + `proof:settle-is-predicate` scoped to `openControlsPanel` ONLY; the 264 gate-script sleeps are out of scope |
| lane-16 §5.3 | `proof-card-rounded-primitive.mjs:180,205-216` vs `proof-stage-glass-card.mjs:117` | identical `[data-surface="glass"]` non-zero-radius sweep, same 4 scenes |
| lane-16 §5.3 | `proof-easing-sidebar-minimal.mjs:293-294` | B4 `cardCount === 1` on `.rounded-card.text-card-foreground`; subsumed by `normalized`'s 1-Card |
| lane-16 §5.3 | `proof-bezier-grown.mjs:34,36` | clause 3 re-measures `bezier-no-scroll`'s scroll-fit (header admits the reuse) |
| lane-18 §1 | `node -e` over `package.json` | the six data-model gates are all `correctness:false, hygiene:true` |
| lane-18 §6 | `proof-gate-is-runtime.mjs:108`; `proof-chronic-closure.mjs:408` | roster derived from `proof:correctness` `matchAll(/proof:[a-z0-9-]+/g)` (AXIS-2 gates invisible); `nonGateMechanism` keyword grep is the prose escape |
| born-RED | `ls scripts/proof-gate-is-data-model.mjs` ABSENT; `grep -c "proof:data-model\|proof:gate-is-data-model" package.json` → 0 | the AXIS-2 meta-gate + sub-aggregator do NOT exist today |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute the
synthetic clock injected + the 264 sleeps reduced to Class B, the 3 firm clauses
pruned with zero coverage loss, and `proof:gate-is-data-model` GREEN over a reformed
two-axis taxonomy.

### S1 — The synthetic clock is injectable and routes ALL kf animation timing

**Breach.** No test-controllable clock exists. Every browser gate that triggers an
animation sleeps a fixed `waitForTimeout(N)` for the animation to settle — the
device-dependent render-race root (lane-17 §1.3).

**Cure.** A `demo-driver.mjs` helper `injectSyntheticRaf(page)` calls `page.addInitScript`
(injected BEFORE any page load) that replaces `window.requestAnimationFrame` /
`window.cancelAnimationFrame` with a test-controlled queue exposing `window.__tick(dtMs)`
(advances virtual time `t += dt`, fires the queued callbacks with `now = t`) and a
`window.__syntheticRaf = true` flag. Because `RAFPlayback._run` routes through the
`leaves.ts` shim, which delegates to `window.requestAnimationFrame` when present
(`leaves.ts:88`), injecting at the `window` level controls ALL kf animation timing —
**NO source change to `leaves.ts` or `playback.ts` is required.** The helper is
**opt-in per-gate** (called explicitly), NOT part of the default `withPage` lifecycle
(the Class-B / amiga-Three.js constraint).

**Falsifiable check.** With `injectSyntheticRaf(page)` active: start a kf animation,
assert it has NOT advanced (the real rAF would have fired); call
`page.evaluate(() => window.__tick(700))`; assert the animation's `effectiveT` /
subject style has advanced to the 700ms-equivalent frame deterministically. Without
the helper, the same page uses real `window.requestAnimationFrame` (amiga/GPU gates
unaffected). `window.__syntheticRaf === true` only on opt-in pages.

### S2 — The Class-A settle-sleeps are replaced by `__tick` (the 264 → Class-B-only reduction)

**Breach.** 264 `waitForTimeout` calls; ~250 are Class A (animation-duration settle).

**Cure.** Every Class-A `page.waitForTimeout(N)` that waits for a kf animation to
settle is replaced by `await page.evaluate((ms) => window.__tick(ms), N)` (single-frame
settle) or a bounded `__tick(16.667)` loop (multi-frame). The settle becomes
**virtual-time deterministic** — the assertion reads the settled state after the exact
virtual elapsed, with no wall-clock dependency. Class-B sleeps (the ~10–15 GPU warm-up
calls — `proof-live-session.mjs:697,704` + the amiga Three.js cases) are LEFT as
`waitForTimeout` and each carries an explicit `// Class B: real GPU warm-up, NOT
addressable by synthetic clock` comment (the disambiguation the structural gate S3
reads).

**Falsifiable check.** `grep -rn "waitForTimeout" scripts/proof-*.mjs | wc -l` drops
from 264 to the Class-B residual (~10–15); every surviving `waitForTimeout` is within N
lines of a `Class B` comment OR is in the named GPU/amiga allowlist. The migrated
gates (`proof:perf-frame-budget`, `proof:scene-transition-perf`, `proof:live-session`,
…) still GREEN with the same oracles, now in virtual time.

### S3 — `proof:no-animation-sleep` — the structural settle gate (the born-RED settle gate over the REAL observable)

**Breach.** `proof:settle-is-predicate` (L.W4) asserts ZERO `waitForTimeout` ONLY in
`openControlsPanel`. The 264 gate-script sleeps are unguarded — a future contributor
re-adds a fixed sleep and the device-dependence regresses silently.

**Cure.** Extend the L.W4 discipline to the animation-duration class. The gate
(`proof:no-animation-sleep`, or an extension of `proof:settle-is-predicate`) asserts:
across ALL `scripts/proof-*.mjs`, every `waitForTimeout` call is EITHER (i) within the
named Class-B allowlist (GPU warm-up + amiga Three.js, each carrying its explicit
comment) OR (ii) replaced by a `__tick` settle. The total `waitForTimeout` count never
exceeds the established Class-B ceiling.

**The REAL observable (inv-M-observable-truth — NOT a proxy).** The L.W1 S4 lesson
binds: that gate tested a PROXY (no-throw + string round-trip) and missed the NaN-frame
breach. The proxy to AVOID here would be a source-grep asserting `__tick` appears in the
scripts (a contributor could `__tick` once and still `waitForTimeout(700)` elsewhere —
the grep greens while the sleep regresses). **The genuine observable is virtual-time
determinism: the settle reaches the SAME state under `__tick(N)` as under the old
`waitForTimeout(N)`, on a host with no real rAF advancing.** The gate's born-RED witness
runs a migrated gate (e.g. `proof:scene-transition-perf`) with `injectSyntheticRaf`
active and the page's real rAF SUPPRESSED (no compositor frames), and asserts the
animation settles deterministically via `__tick` alone — on today's tree this is RED
because no synthetic clock exists and the gate sleeps real wall-clock. (See Born-RED gate.)

### S4 — The 3 firm clauses pruned, each subsumption-proved (zero coverage loss)

**Breach.** Three browser clauses re-measure a sibling gate's exact oracle on the
identical selector (lane-16 §5.3, verified): `card-rounded-primitive` `computedHalf`,
`easing-sidebar-minimal` B4, `bezier-grown` clause 3.

**Cure.** Delete each per the lane-16 §6 surgical plan: (1) delete
`card-rounded-primitive`'s `computedHalf` function + its call — the gate keeps clause 1
(static source grep) and clause 3 (the `cards.css` consume-leg witness), runs in ~0.1s,
and gains a comment naming `stage-glass-card` as the radius browser owner; (2) delete
`easing-sidebar-minimal` B4 (`:293-294`) — `normalized`'s 1-Card clause survives; (3)
delete `bezier-grown` clause 3 (`:34,36`) — `bezier-no-scroll`'s fit clause survives.

**Constraint (the no-coverage-loss invariant, named per clause).** For each pruned
clause the EXACT subsumer is cited (the table in Context (b)) AND a planted-violation
witness proves it: the surviving sibling gate REDs on the regression the pruned clause
guarded (e.g. force a square `[data-surface="glass"]` plate → `stage-glass-card` reds;
nest a double Card in the sidebar → `normalized` reds; grow the bezier canvas into
scroll → `bezier-no-scroll` reds). The pruned clause's own selector + tolerance are
identical to the survivor's — the regression cannot pass the survivor while it would
have failed the pruned clause.

**Falsifiable check.** Post-prune: `card-rounded-primitive` does NOT spawn chromium
(`grep -c "demo-driver\|chromium\|computedHalf" proof-card-rounded-primitive.mjs` shows
the browser half gone); `easing-sidebar-minimal` has no `cardCount` B4 block;
`bezier-grown` has no `scrollHeight`/`overflow-y` clause. `proof:all` GREEN (no
regression). The 3 planted violations each red on the named survivor.

### S5 — `proof:gate-is-data-model` — the AXIS-2 meta-gate (the wave's named born-RED)

**Breach.** No meta-gate enforces AXIS-2. `proof:gate-is-runtime` derives its roster
from `proof:correctness` membership (`proof-gate-is-runtime.mjs:108`) so AXIS-2 gates in
`proof:hygiene` are invisible to it — a data-model gate could be a pure source grep and
nothing detects it (lane-18 §6 V3). `proof:gate-is-data-model` and `proof:data-model`
are both ABSENT (verified: `grep -c` → 0).

**Cure.** Author `proof:gate-is-data-model` (the AXIS-2 mirror of `proof:gate-is-runtime`).
It derives the AXIS-2 roster from a `proof:data-model` sub-aggregator membership (S6) and
asserts each member: (i) imports the compiled `dist/keyframes.js` OR runs `vitest` over
`src` — NOT a bare `fs.readFileSync` source grep; (ii) does NOT import
`scripts/lib/demo-driver.mjs` (that would make it AXIS-1); (iii) has a named vitest
fixture / a node script that loads the compiled engine. This is the AXIS-2 equivalent of
"opens a browser AND actuates": **imports dist + runs off-DOM.**

**The REAL observable (inv-M-observable-truth).** The proxy to AVOID is asserting the
gate FILE merely exists or that the sub-aggregator key is present (a source-shape check
that says nothing about whether the gates load the real engine). The genuine observable
is the AXIS-2 contract biting: plant a data-model gate whose body is a pure
`fs.readFileSync` grep (no dist import, no vitest-over-src) into the `proof:data-model`
roster → `proof:gate-is-data-model` REDs (it caught a source-grep masquerading as a
data-model gate). And the inverse: a genuine AXIS-2 gate (`proof:replay-equality`, which
runs the compiled `fromString`/`CSSKeyframesToString` over fixtures) passes. Today the
meta-gate is RED by construction (the sub-aggregator and the assertion do not exist).

**Falsifiable check.** `proof:gate-is-data-model` exists in `package.json` + `scripts/`;
on the reformed tree it exits 0 and its derived AXIS-2 roster is NON-EMPTY (the
reclassified gates); a planted source-grep gate in the roster REDs it; a genuine
dist-importing gate passes. Today: the gate does not exist → RED.

### S6 — The `proof:data-model` sub-aggregator + the `proof:chronic-closure` typed axis

**Breach.** The AXIS-2 gates (`proof:replay-equality`, `proof:compile-replay`,
`proof:ingest-replay`, `proof:transport-events`, `proof:orchestration`, `proof:blend`,
`proof:agent-validate`, `proof:spring-vector`, …) are scattered in `proof:hygiene` beside
lint-class gates with no way to tell them apart (lane-18 §6 V2). `proof:chronic-closure`'s
`nonGateMechanism` keyword grep (`:408`) is the only acknowledgment the class exists — a
prose escape, not a typed axis (lane-18 §6 V1).

**Cure.** (i) Create a `proof:data-model` sub-aggregator within `proof:hygiene` whose
value enumerates the AXIS-2 gates as a `proof:[a-z0-9-]+`-matchable membership (the
machine-readable roster `proof:gate-is-data-model` reads, the same regex contract M.W1's
runner preserves). The AXIS-2 gates' membership in `proof:hygiene` is via this
sub-aggregator. (ii) Reform `proof:chronic-closure`: a typed `DATA-MODEL` disposition band
in the ledger that the parser reads as "apply AXIS-2 rules" (the cited gate must import the
compiled engine, not be a source grep), with the `nonGateMechanism` keyword grep RETAINED
for backward compat but the new axis machine-readable. The `proof:gate-is-runtime` precept
text, enforcement, and roster are **UNTOUCHED** (lane-18 §7 — the reform adds an orthogonal
axis, it does not weaken AXIS-1).

**Constraint.** The reclassification MOVES no gate to `proof:correctness` (AXIS-2 gates
stay in `proof:hygiene`, now grouped) and changes NO gate's oracle — it only names the
axis. The device-honesty `declarePosture` mechanism is untouched (AXIS-2 gates are
device-independent by construction). M.W1's parseable-membership contract is preserved
(the sub-aggregator value is a matchable list).

**Falsifiable check.** `proof:data-model` is a `package.json` key whose value enumerates
the AXIS-2 gates; `proof:gate-is-runtime` STILL derives the unchanged 18-member
correctness roster and exits 0 (untouched); `proof:chronic-closure` reads the `DATA-MODEL`
band AND still passes its existing rows; a data-model FOLD row that backtick-cites its
AXIS-2 gate no longer falsely demands a browser runtime gate (the V1 false-requirement is
cured).

---

## Born-RED gate

**The wave's named born-RED gate (per the M.md row):** `proof:gate-is-data-model`
(NEW — ABSENT from `package.json` + `scripts/` today, verified 2026-06-17). The
synthetic-clock settle and the prune carry their own born-RED witnesses (S3
`proof:no-animation-sleep`, S4 the planted-violation matrix); they are stated below
alongside the named gate so each of the three threads bites a REAL observable.

### Thread 1 — `proof:gate-is-data-model` (AXIS-2, S5/S6)

**Tier:** hygiene (a node meta-gate over the AXIS-2 roster — no browser; it is itself
the AXIS-2 enforcer, so it imports dist / reads scripts off-DOM).

**The REAL observable.** The genuine defect today: **there is no AXIS-2 enforcement —
a data-model correctness gate can be a pure source grep and nothing detects it**
(lane-18 §6 V3). The proxy to AVOID: a file-presence / key-presence check. The gate
must construct a SANDBOX AXIS-2 gate whose body is a bare `fs.readFileSync` grep, plant
it into the `proof:data-model` roster, and assert `proof:gate-is-data-model` REDs (it
caught the masquerade); then assert a genuine dist-importing AXIS-2 gate
(`proof:replay-equality`) passes.

| Clause | Input | Today | After cure |
|---|---|---|---|
| C1 — roster derived | the `proof:data-model` sub-aggregator membership | sub-aggregator ABSENT → empty roster → cannot run | non-empty AXIS-2 roster derived |
| C2 — masquerade caught | a planted source-grep gate (bare `fs.readFileSync`, no dist import) in the roster | n/a (gate absent) | `proof:gate-is-data-model` REDs |
| C3 — genuine passes | `proof:replay-equality` (runs compiled `fromString`/`CSSKeyframesToString`) | n/a | passes the AXIS-2 contract |
| C4 — no demo-driver | any roster member imports `demo-driver.mjs` | n/a | REDs (that would make it AXIS-1) |
| C5 — AXIS-1 untouched | `proof:gate-is-runtime` roster + exit | 18 members, exit 0 | 18 members, exit 0 (UNCHANGED) |

**Today's tree result:** RED by construction — `scripts/proof-gate-is-data-model.mjs`
does not exist, `proof:data-model` is not a `package.json` key (C1 cannot pass), and no
`DATA-MODEL` band exists in `proof:chronic-closure`.

### Thread 2 — `proof:no-animation-sleep` (synthetic clock, S1/S2/S3)

**The REAL observable.** The genuine defect: **a Class-A animation-settle
`waitForTimeout(N)` is device-dependent — it passes on the fast dev box and races on
the slow runner** (the `PROGRESS.md §2.2 W28` root). The proxy to AVOID: a source-grep
asserting `__tick` appears (greens while a stray `waitForTimeout` regresses). The gate's
witness runs a migrated gate with `injectSyntheticRaf` active AND the real rAF
suppressed (no compositor frames advancing), and asserts the animation reaches its
settled state via `__tick(N)` alone — the **virtual-time determinism** is the real
observable. On today's tree this is RED: no synthetic clock exists, so the animation does
NOT advance without real rAF, and the gate falls back to a wall-clock sleep.

**Today's tree result:** RED — `injectSyntheticRaf` does not exist; `grep -c
waitForTimeout` is 264 (over the Class-B ceiling); `window.__tick` is undefined on every
page.

### Thread 3 — the prune planted-violation matrix (S4)

**The REAL observable.** Each pruned clause's exact regression REDs on its named survivor
(zero coverage loss is the observable, not the deletion). Force a square
`[data-surface="glass"]` → `stage-glass-card` REDs; nest a double Card in the easing
sidebar → `easing-sidebar-normalized` REDs; grow the bezier canvas into scroll →
`bezier-no-scroll` REDs. **Today's tree result:** these three survivors already RED on
their respective planted violations (the prune does not change THAT — it removes the
duplicate measurement while proving the survivor still catches the regression). The
born-RED here is the matrix asserting the survivor's bite BEFORE the duplicate is
removed, so the removal is provably loss-free.

**Why these are genuine defects, not proxies.** Thread 1's C2 plants a real source-grep
masquerade and observes the real meta-gate output. Thread 2 suppresses real rAF and
observes whether `__tick` alone settles the real animation — the exact device-dependence
the sleep hides. Thread 3 observes the real survivor gate reddening on the real
regression. No file-presence check, no source-grep-for-a-token, no string round-trip
stands between any gate and its real behavior.

---

## Dependencies

- **None (kf-internal, no sibling edge).** The rAF hook (`leaves.ts`/`playback.ts`), the
  3 prune targets + their survivors, the AXIS-2 taxonomy, and the meta-gate are all
  kf-owned (lane-16 §9, lane-17 §6, lane-18 §9 — all three lanes confirm zero cross-repo
  ask). value.js, parse-that, and glass-ui have NO role.
- **Does NOT require M.W1 / M.W2 / M.W3 (composes with each).** M.W1's report-all runner
  schedules the new gates as nodes it no longer aborts on (the synthetic-clock wall-clock
  win compounds with the iterate-count win). M.W2's S6 places package.json-shape gates on
  the AXIS-2 NODE/VITEST axis; M.W4 AUTHORS that axis (`proof:gate-is-data-model`) — M.W2
  names the seam, M.W4 fills it; neither blocks the other. M.W3's shared-browser runner
  enables the R4 surface-consolidation (the deferred ~10 clauses) — M.W4 does the firm 3
  prunes that need no shared browser.
- **The two `observe-only` discharges (in-wave).** Implementing the synthetic clock (S1/S2)
  discharges the NAMED architectural cure for `proof:perf-frame-budget` +
  `proof:scene-transition-perf` (`gate-taxonomy.md:54-55`), promoting both from
  `observe-only` to `hard`. The `gate-taxonomy.md` manifest is updated in the SAME wave
  commit (the `proof:ci-coverage` clause-4 machine-check must stay green).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 synthetic clock | The animation-settle class has no deterministic driver; a gate must sleep a fixed wall-clock window — the device-dependent render-race returns |
| S2 `__tick` migration | A Class-A `waitForTimeout(N)` re-appears as a real-time settle (macOS-pass/Linux-fail) instead of a virtual `__tick` — the 264-sleep floor regrows |
| S3 `proof:no-animation-sleep` | A contributor re-adds a fixed animation-settle sleep; the structural gate reds (the L.W4 discipline extended past `openControlsPanel` to the whole gate corpus) — and the REAL observable (virtual-time determinism) is asserted, not a `__tick`-token grep proxy |
| S4 the firm prune | A duplicate browser clause re-measures a sibling's oracle on the identical selector (an ~11s sweep paid per O(N²) re-run for zero added coverage); the prune is loss-free because the survivor reds on the same regression |
| S5 `proof:gate-is-data-model` | A data-model correctness gate is a pure source grep masquerading as a behavioural assertion (it cannot see the compiled engine's output) — the `proof:transport-events` mis-tiering recurrence; the AXIS-2 contract catches it |
| S6 two-axis taxonomy | A data-model correctness invariant is forced through the wrong axis (a browser it does not need, or a lint rule that cannot see engine output); the `nonGateMechanism` prose escape's false-requirement / false-positive recurs (lane-18 §6 V1) |

---

## Excluded from this wave

- **The R4 surface-consolidation** (bezier/sidebar/hero into shared-browser
  `*.browser.test.ts` files, sharing ONE cold boot — lane-16 §6.WB, ~10–11 clauses) —
  M.W3 scope. It REQUIRES the shared-browser runner; it is NOT a standalone prune. M.W4
  does only the 3 firm R1/R2 prunes that need no shared browser.
- **The serial `&&` → parallel report-all runner** — M.W1 scope. M.W4's new gates run
  under whatever runner is current; the synthetic clock's wall-clock win compounds with
  M.W1's iterate-count win but is not owned here.
- **The eslint + dependency-cruiser LINT tier** — M.W2 scope. M.W2's S6 places the
  package.json-shape gates on the AXIS-2 axis M.W4 authors; M.W4 does not touch the LINT
  tier.
- **The @vitest/browser INTEGRATION tier** (the 72 runtime gates → one shared chromium) —
  M.W3 scope. M.W4 injects the synthetic clock into the EXISTING `demo-driver.mjs`
  browser path; the clock helper migrates trivially when M.W3 lands (it is an
  `addInitScript` payload, runner-agnostic).
- **Class-B GPU/compositing warm-up sleeps** (the ~10–15 real-GPU + amiga-Three.js calls,
  `proof-live-session.mjs:697,704`) — NOT addressable by a synthetic clock (they wait for
  real GPU process time). They REMAIN `waitForTimeout` with explicit `Class B` comments;
  S3's ceiling counts them as the permitted residual.
- **Moving any data-model gate to `proof:correctness`** — the AXIS-2 gates stay in
  `proof:hygiene` (grouped under `proof:data-model`). The reform names the axis; it does
  not re-tier oracles. `proof:gate-is-runtime`'s precept text, enforcement, and 18-member
  roster are untouched.
- **The `proof:drawer-spring` physics-settle discharge** (`gate-taxonomy.md:58` — a
  deterministic SpringProgress integrator on a synthetic clock) — the jsdom/unit side of
  the same clock family; named here as adjacent but its `(b)` SETTLE clause is an absolute
  wall-clock spring-settle ms that M.W4 does not re-home (the device-independent clauses
  already carry the hard verdict). A candidate fold for a later wave, not M.W4 scope.
