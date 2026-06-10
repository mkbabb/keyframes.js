# The live perf + animation-quality battery — 2026-06-10 (audit ADDENDUM)

**Method:** load-gated sequential battery against the BUILT `dist/gh-pages` (the design-audit
build, source == `tranche-j-dev` tip). The host was CONTENDED for most of the window (another
active session; load peaked 47); the battery waited 2h for quiet, proceeded at load ≈ 10, and
the felt-frame gate was RE-RUN at load ≈ 8 (the cleanest reading). **Per inv ε every number
below carries its measurement load** — the P6 boundary in action: timing numbers from a
contended host are annotated, not asserted. Raw log: `/tmp/j-perf-battery.log` (session-local).

## 1. The felt frame budget — `proof:perf-frame-budget` · load ≈ 8 · **PASS**

| Clause | Reading | Budget | Verdict |
|---|---|---|---|
| (c) dock expand @4× CPU throttle | n=119 · mean 8.4 ms · p95 10.2 ms · max 18.1 ms · **dropped 0** | ≤ 2 | **GREEN** |
| (d) /easing preview @1× (real experience, best-of-3) | n=79 · mean 14.0 ms · p95 18.2 ms · max 25.2 ms · **dropped 3** | ≤ 3 | **GREEN** |

The I.W4 closes HOLD live: D3 (the consumed glass-ui ~3.9.0 dock) and D4 (the reactive storm
dead — non-reactive `style.transform`). Two earlier runs at load 28–47 read dropped 3–67 on
identical bytes — recorded here as the canonical demonstration of WHY felt-timing gates are
on-device/quiet-host measurements (P6), never CI or contended-host assertions.

## 2. Transition perf — `proof:scene-transition-perf` · load ≈ 10

- **Timing: GREEN even under load** — cross-scene navigate + control-surface re-render
  **p95 = 70.9 ms** ≤ the 120 ms budget (p50 39.8 ms over 18 transitions; the I baseline was
  p95 ≈ 46 ms unloaded — the delta is contention, within budget regardless).
- **✗ A REAL, LOAD-INDEPENDENT failure (a STATE assertion, not timing):** the easing↔cube
  round trip did NOT preserve the control projection —
  `before: {"selectedControl":"spring"}` (stale from a prior scene!) →
  `after: {"selectedControl":"controls"}`; expected restore to `easing`.
  **This is a recorded live reproduction of the J.W0-S3 / J.W2-S2 defect family** (the
  control-surface projection lagging/latching across hash-nav transitions; the
  `selectedControl` single-writer half-migration). It is now a BORN-RED WITNESS OF RECORD
  for both wave gates — the J charter owned this band before the battery reproduced it.

## 3. Lighthouse MOBILE probe · load ≈ 10 · **CONTENTION-TAINTED (directional only)**

| Scene | Perf (floor) | LCP |
|---|---|---|
| home | 62 (≥63) | 7.5 s |
| cube | 51 (≥64) | 12.6 s |
| amiga | 37 (≥49) | 15.5 s |
| square | 55 (≥62) | 10.6 s |
| easing | **62 (≥61) ✓** | 7.9 s |
| spring | **54 (≥52) ✓** | 29.4 s (bound <15 s) |

Scores sit uniformly ~7–13 points under the B-era floors — consistent with uniform
contention inflation (Lighthouse lantern MULTIPLIES an observed trace; the observed trace was
load-10-slowed). **NOT asserted as regressions.** The one alarming shape — spring LCP 29.4 s
matching the pre-E.W4 Monaco pathology (28.5 s) — was ATTRIBUTED load-independently: the
static bundle-graph probe walked the eager import closure of the CURRENT build
(`index.html` → 10 files) and **vendor-monaco is NOT in it** — the E.W4 static-edge
isolation HOLDS. **PF-3 (J.W6) is hereby VERIFIED on the current tree** — the J.W6 spec's
re-verify item can cite this probe. The mobile floors re-assert on a quiet host (or the
calibrated CI runner with `KF_REQUIRE_LH=1`) at J impl.

## 4. Lighthouse DESKTOP · load ≈ 10

| Scene | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| home | **94** | 1.4 s | **0 ms** | 0 |
| easing | **93** | 1.4 s | **0 ms** | 0.002 |
| cube | 58 | 5.9 s | 20 ms | 0 |
| spring | 73 | 4.8 s | 10 ms | 0.019 |

home/easing at 93–94 with ZERO total blocking time under load is genuinely excellent — the
B-band (89–96) holds where the scene is light. cube 58 / spring 73 with 4.8–5.9 s LCP under
the SAME load as home's 1.4 s is a REAL relative observation (not pure contention): on the
editor-bearing scenes the LCP element waits on the lazy editor chain (Monaco is off the
EAGER path but its lazy ~8 MB sits on the perceived-complete path of the visible pane).
Candidate lever (recorded, not folded — measure on a quiet host first): editor-pane
skeleton/progressive paint, or the K-era CSSCodeEditor question. Re-measure at J impl.

## 5. The engine bench · load ≈ 10 · **HOLDS the recorded levels**

| Kernel | hz | vs recorded (G-era) |
|---|---|---|
| interpFrames 2-frame opacity (60-frame window) | **937,586** | 996k — within ~6 % env noise ✓ |
| interpFrames 2-frame multi-property | 719,771 | — |
| interpFrames 11-stop complex | 536,398 | — |

The engine kernels are unaffected by the demo-side findings — the SOTA-landscape verdict's
"perf credible" line is re-confirmed under load.

## The verdict line

The PRODUCT's animation quality holds live (frame budgets GREEN at quiet load; transition
p95 within budget even loaded; engine kernels at recorded levels; Monaco isolation intact).
The battery's one REAL red — the control-projection round-trip — is a fresh witness for the
defect family J.W0/J.W2 already own. The mobile Lighthouse floors remain the weak flank and
remain UNASSERTED pending a calibrated host — exactly the J.W4/P6 posture. Nothing in this
battery contradicts the J charter; two items gained recorded evidence (the J.W0/W2 witness;
the PF-3 verification).
