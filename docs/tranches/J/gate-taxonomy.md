# Gate taxonomy — the device-dependence postures (J.W3 S2b · P6 made mechanical)

**Status:** BINDING manifest. The posture authority is `scripts/lib/ci-env.mjs` (the ONE
`IN_CI` + `declarePosture` helper — no per-script re-implementation); this document is the
named TABLE the S2c hygiene clause (`proof:ci-coverage` clause 4) machine-checks against the
declarations in the gate scripts, both directions: every `observe-only` declaration must have
a row here with a reason, and every `observe-only` row here must be backed by a live
declaration (no stale manifest rows).

## The three postures (ci-cd.md §5, named)

| Posture | Meaning | Mechanism |
|---|---|---|
| **hard** | device-INDEPENDENT oracle — red on any failure, CI and local. The default; the overwhelming majority (~the whole DOM/geometry/CSS estate + the actuating correctness gates). | bite normally (`fail` everywhere) |
| **observe-only** | device-DEPENDENT measurement (throttled frame ms, cross-OS pixel, absolute timing) — RECORDED in CI (never red there), HARD on-device/local. | `declarePosture("observe-only", { reason })` → `observeOnlyInCI` |
| **runner-calibrated** | the absolute threshold is KEPT; only the STRESS SIZE is sized to the runner. Misses are hard everywhere. | calibrate the stress (e.g. `KF_LOAF_COUNT`), threshold unchanged |

## The third taxonomy state, NAMED: **on-device**

An **on-device** annotation on a CORRECTNESS-tier gate means its CI run is OBSERVATIONAL —
the observe-only posture on a correctness-class oracle (WZ-postclose §C, wave-I.W7 §10).
**"proof:correctness GREEN in CI" must NEVER be over-read as the felt timing / exact-pixel
budget holding in CI** — the felt budget hard-gates ON-DEVICE only. `proof:perf-frame-budget`
is the canonical instance: correctness-class on-device, observe-only in CI. A future close
that cites a green CI correctness run as evidence the felt budget holds is re-committing the
over-read this section exists to forbid.

**The policy decision (WZ-postclose c2, decided at J.W3):** device-dependent gates are
**observe-only** in CI — NOT CI-excluded. `proof:lighthouse-mobile`'s full CI-exclusion was the
legacy ad-hoc; **J.W4 S6 discharged its tier entry**: it left the `proof:ci-coverage`
EXCLUDED set, declares `observe-only` through the one helper (hard on-device via
`KF_REQUIRE_LH=1` — the calibrated-runner half bypasses the CI softening), runs in the
HYGIENE tier (`proof:hygiene` + the ci.yml demo job), and its green observe-only CI run is
NEVER over-read as "mobile perf held in CI" (the correctness owner of "mobile works" is the
S1 mobile-input battery, `proof:live-session-mobile`).

## The posture manifest (the S2c-checked table)

Every gate that declares a non-`hard` posture through `scripts/lib/ci-env.mjs` is listed here
with its declared reason — the reason string in this table is the declaration's `reason`,
byte-for-byte. Gates not listed are **hard** (the default; no declaration needed).

Each `observe-only` row also carries a **Category** (`inv-L-device-honesty`, L.md §invariant set
— the named class of the device-dependence: `wall-clock` timing-dependent settle budgets,
`pixel-render` cross-OS rasterization differences, `physics-settle` spring/easing convergence
measurements, `forced-layout` synchronous reflow timing, `touch-emulation` the Playwright
hasTouch-context Touch-API-vs-Pointer-Events bridge gap) and an **Architectural cure** (the
durable fix that would promote the gate from `observe-only` to `hard`). `proof:ci-coverage`
clause 4 machine-asserts every `observe-only` row carries a non-empty Category AND Architectural
cure — the inv-L-device-honesty declaration is no longer an informal note inside the reason string.

| Gate | Posture | Category | Architectural cure | Reason (the declared device-dependence) |
|---|---|---|---|---|
| `proof:perf-frame-budget` | observe-only | wall-clock | A synthetic-time clock injected into the rAF driver (the engine reads a fake monotonic time the test advances deterministically), so the felt frame budget is measured against virtual elapsed ms, not the runner's wall-clock under load. | re-measure on-device |
| `proof:scene-transition-perf` | observe-only | wall-clock | Drive the scene transition under a deterministic synthetic clock (fake-time rAF) so the settle-within-budget assertion reads virtual ms, decoupling the transition-perf verdict from the shared-runner CPU. | re-measure on-device |
| `proof:lighthouse-mobile` | observe-only | wall-clock | A calibrated or real-device Lighthouse host (the KF_REQUIRE_LH=1 on-device path), where the CPU/network throttle multipliers map to a known hardware baseline, so absolute mobile scores are reproducible rather than shared-runner artifacts. | mobile Lighthouse CPU/network throttle assumes a calibrated or real-device host — absolute scores are environment artifacts on shared runners; hard on-device via KF_REQUIRE_LH=1 (J.W4 S6) |
| `proof:drawer-spring` | observe-only | physics-settle | A deterministic spring simulator that advances the SpringProgress integrator on a synthetic clock (a fixed-step physics solver gated by a virtual-time predicate), so the settle-ms is a closed-form virtual elapsed, not a real-time measurement throttle-sensitive on a loaded runner. | the (b) SETTLE clause is an absolute wall-clock spring-settle ms (~176ms physics vs a 350ms budget) — throttle-sensitive on a loaded GitHub-Actions Linux runner (K.WZ CI-greenify); RECORDED in CI, hard on-device/local. The device-INDEPENDENT clauses (ζ<1 overshoot-shape, single-frame PRM snap, static no-CSS-ease-on-height) carry the hard spring-vs-ease verdict. |
| `proof:live-session-mobile` (M2) | observe-only | touch-emulation | A CDP-level true-touch driver (Input.dispatchTouchEvent emitting a touchstart→touchmove→touchend sequence that the Pointer Events bridge synthesizes into pointerdown→pointerup on the reka SelectItem), or real-device verification — either dispatches the pointerup reka's onPointerup commits on, retiring the .click() faithful-fallback. | the M2 reka SelectItem commit path uses a Playwright `.click()` in a hasTouch context because `touchscreen.tap()` / locator `.tap()` dispatch ONLY the Touch-API events (touchstart/touchend) and emit NO pointerdown/pointerup — reka's `onPointerup` never fires and the value never commits, while reka's `touchend` preventDefault swallows the synthesized click. The `.click()` (pointerdown→pointerup→click) is the FAITHFUL reka commit a real finger generates; real-device verification is the authoritative oracle. A PLAYWRIGHT touch-emulation gap, NOT a product break (L.W4 S6, audit W19). |
| `proof:bench-taxonomy` | observe-only | wall-clock | A throughput floor measured on a calibrated or dedicated host where `hz` maps to known hardware, so the budgeted floors (the lerpArray SoA win at K=8, the spring-vector ADOPT ratio, the warmEngine pre-resolve) are reproducible rather than shared-runner artifacts; the device-INDEPENDENT half (the manifest STRUCTURE — every case classified, every cross-repo ask present, the budgeted cases NAMED) stays hard everywhere. | the budgeted arm is the ONE device-DEPENDENT clause — a wall-clock throughput floor (L.W7 S6); the slow Linux runner reports a lower `hz`, so a miss is RECORDED in CI (never red there) and HARD on-device/local. The taxonomy STRUCTURE clauses carry the hard verdict. |
| `proof:epf1-measure` | observe-only | forced-layout | The batch-reads-first/batch-writes-second pass over `ingest-cssom.ts`'s interleaved `getComputedStyle`/style-write CSSOM walk (the `flip.ts` read-mutate-read discipline applied to the ingest path), which would drop the read↔write phase-boundary count ≥50% and promote the gate to a hard `EPF1_CURE=1` floor. | MEASURE-FIRST baseline only (L.W7 S5): the gate records the device-INDEPENDENT layout-thrash COUNT (scripts/epf1-baseline.json) and exits 0 regardless (observe-only). No cure ships in L.W7; the 50%-reduction floor opens under EPF1_CURE=1 once the ingest batches its reads/writes. |

**Named non-instances (recorded so the postures are decisions, not drift):**

- `proof:scene-perf-budget` — **hard**, by prose-documented decision
  (`proof-scene-perf-budget.mjs` header): every clause is a device-INDEPENDENT fact (a
  fillRect call count, a replayed-canvas pixel grid, a backing-store ratio, computed-style
  declarations), not a timing measurement — per the no-workaround rule it may NEVER route
  through `observeOnlyInCI`. A Linux flake here is the `ci-linux-open-item` lane's
  gate-robustness work (the OPEN Linux-posture FLAG), not an observe-only demotion.
- the **LoAF >50ms-trace bench** (`ci.yml` "LoAF >50ms-trace gate", `KF_LOAF_COUNT: 48`) —
  **runner-calibrated**: the strict 50 ms threshold is UNCHANGED; only the composite cell
  count is sized to the shared-VM runner (~6× slower than real hardware). The full 200-cell
  stress is the local/dedicated `npm run bench` authority.

## No-workaround prohibition (J.md §spine; S2)

The helper is NOT an escape hatch. A device-INDEPENDENT gate may NEVER route through
`observe-only` to paper a flake (the `scene-control-dfa` lesson: "NOT an `IN_CI` escape on a
correctness gate"). A device-independent gate that flakes is a determinism bug in the gate or
a real product bug — **fixed (J.W0-class work), never silenced**. An `observe-only`
declaration without a `reason` throws at declaration time (`ci-env.mjs`); a declaration whose
gate is missing from the table above — or a table row with no live declaration behind it —
reds `proof:ci-coverage` clause 4 (S2c).
