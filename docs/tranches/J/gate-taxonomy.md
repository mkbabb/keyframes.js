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

| Gate | Posture | Reason (the declared device-dependence) |
|---|---|---|
| `proof:perf-frame-budget` | observe-only | re-measure on-device |
| `proof:scene-transition-perf` | observe-only | re-measure on-device |
| `proof:visual-lock` | observe-only | cross-OS render; re-baseline in-container |
| `proof:lighthouse-mobile` | observe-only | mobile Lighthouse CPU/network throttle assumes a calibrated or real-device host — absolute scores are environment artifacts on shared runners; hard on-device via KF_REQUIRE_LH=1 (J.W4 S6) |
| `proof:drawer-spring` | observe-only | the (b) SETTLE clause is an absolute wall-clock spring-settle ms (~176ms physics vs a 350ms budget) — throttle-sensitive on a loaded GitHub-Actions Linux runner (K.WZ CI-greenify); RECORDED in CI, hard on-device/local. The device-INDEPENDENT clauses (ζ<1 overshoot-shape, single-frame PRM snap, static no-CSS-ease-on-height) carry the hard spring-vs-ease verdict. |

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
