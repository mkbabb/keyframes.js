# Lane 17 — browser-coldboot

**Tranche M charter SEED — ANALYSIS ONLY.**
Status: READ-ONLY investigation. No gate changed, no code written.
All counts verified against the tranche-l-dev close tree (commit `529fcfd`).
Date of investigation: 2026-06-17.

---

## Headline verdict

The gate suite's browser-tier wall-clock cost has TWO separable roots — both
architectural, both unbuilt cures named in `ci.yml:327–329` — and they compound:

1. **Per-gate cold browser + server** (~80 chromium launches × ~210 ms fixed
   launch tax + lost warm-cache amortization): every gate boots the SPA fresh.
2. **264 `waitForTimeout` animation-settle sleeps** that are wall-clock waits for
   real animation time — NOT removed by L.W4 (L.W4 landed `waitForRender` for
   the *state-predicate* settle class in `openControlsPanel` only; the animation-
   duration settle class is entirely intact on the L close tree).

Root 2 is the direct wall-clock load: `proof:live-session` alone carries
**40 `waitForTimeout` calls** (200 ms → 2600 ms each) across an 8-scene sweep.
The sum of those waits inside a single `proof:live-session` run is measurably
**> 30 s of pure sleep** (20 calls × ≥ 300 ms + 8 calls × ≥ 700 ms + outliers
of 1500/1600/2600 ms). Root 1 multiplies this across 72 browser gates: every
gate re-boots, re-hydrates Vue, re-runs the scene machine, then re-sleeps through
its own settle windows.

The M-wave cure is two composable steps: a **shared browser + server fixture**
(one boot, amortize warm-cache) and a **synthetic clock injected into the rAF
driver** (deterministic settle — no wall-clock sleep; already named as the
"Architectural cure" for `proof:perf-frame-budget` and `proof:scene-transition-perf`
in `docs/tranches/J/gate-taxonomy.md:54–55`).

---

## 1. The measurement — verified ground truth (tranche-l-dev close tree)

### 1.1 Gate classification and counts

Source: `gate-apparatus-A-taxonomy.md` + verified against the L close tree.

| Class | Count (in `proof:all`) | Evidence |
|---|---:|---|
| **(c) BROWSER/PLAYWRIGHT** | **72** | 67 proof scripts import `demo-driver.mjs` + 2 self-chromium (`proof-easing-sidebar-minimal.mjs:66`, `proof-easing-sidebar-normalized.mjs`) = 69 gate scripts drive a browser; the 72 figure includes multi-browser gates like `proof:live-session-mobile` (2× launch) |
| **(a) SOURCE-SHAPE node grep** | 36 | no browser, no vitest, pure `fs.readFileSync` + grep |
| **(b) NODE + VITEST** | 18 | `node scripts/proof-x.mjs && vitest run test/x.test.ts` |
| **(b′) PURE-VITEST** | 16 | `vitest run test/x.test.ts` only |

Verification: `ls scripts/proof-*.mjs | wc -l` → **128** gate scripts on the L
close tree. `package.json` → **150** `proof:*` keys, **4** aggregators, **146**
leaf gates; `proof:all` = `proof:correctness && proof:hygiene` runs **142**
distinct leaf gates. **72 of 142 (51%) spawn a browser.**

### 1.2 The cold-boot lifecycle — no warm reuse (verified)

`scripts/lib/demo-driver.mjs` (the single source, `withBrowser` at line 432,
`withPage` at line 513):

- `withBrowser` calls `resolveChromium()` → `chromium.launch()` (line 463), with
  a 3-attempt crash-retry loop (lines 450–495).
- `withPage` calls `serveDist(distDir)` which does `server.listen(0)` (line 340)
  — a fresh OS-assigned ephemeral port every invocation — then `browser.newContext`
  (line 534) + `newPage()` (line 537).
- `finally` (lines 539–544) closes context, closes server, closes browser. **Full
  teardown every call.**
- `grep` for `connectOverCDP|wsEndpoint|launchServer|reuseExisting` on the L close
  tree → **0 hits**. There is no warm-browser reuse path anywhere in the harness.

Because each `proof:<x>` is its own `npm run` → its own node process, not even
module-level state carries across gates. **Every gate spawns a fresh chromium +
a fresh `node:http` server from zero.**

Fixed launch+serve cost (measured in `gate-apparatus-A-taxonomy.md §2`): **~210 ms**
per `withPage` lifecycle call. Some gates call `withBrowser` multiple times
internally: `proof:live-session` (2× — desktop + mobile width contexts),
`proof:live-session-mobile` (2×), `proof:font-census`, `proof:appearance-suffusion`,
`proof:fsm-suspend-resume-live`, `proof:lighthouse-mobile` each spawn 2+ chromium
instances in one process. **Total chain launches: ~80+.**

Raw launch waste: ~80 × 0.21 s ≈ **~17 s** — small. The real loss is the
**warm-cache amortization**: every gate cold-boots the SPA, re-hydrates Vue,
re-runs the scene machine, re-pays first paint, before it can assert. A shared
warm browser + server would let small layout gates run as cheap `goto` + assert
against an already-booted page.

### 1.3 The `waitForTimeout` census — the wall-clock core

**Total `waitForTimeout` calls across all proof scripts on the L close tree: 264.**

Verification: `grep -rn "waitForTimeout" scripts/proof-*.mjs | wc -l` on the L
close tree (via `git show tranche-l-dev:<path>`) → **264**.

This is the same number reported by the L audit's ★HIGH-severity finding
(`PROGRESS.md §2.2 W28`): "259 fixed-ms `waitForTimeout()` sleeps are the
macOS-pass/Linux-fail render-race root" — the small delta (259 vs 264) reflects
gate additions between the L dev-phase count and the L close tree.

**Distribution (top scripts, L close tree):**

| Script | `waitForTimeout` count |
|---|---:|
| `proof-live-session.mjs` | **40** |
| `proof-scene-machine-irrefragable.mjs` | 27 |
| `proof-fsm-suspend-resume-live.mjs` | 20 |
| `proof-live-session-mobile.mjs` | 13 |
| `proof-appearance-suffusion.mjs` | 11 |
| `proof-scene-parity.mjs` | 10 |
| `proof-easter-egg.mjs` | 9 |
| `proof-settle-is-predicate.mjs` | 8 |

**L.W4's `waitForRender` — what it covered and what it did NOT (critical
ground-truth, not in the L audit):**

L.W4 landed `waitForRender` (a `waitForFunction`-predicate settle primitive,
`demo-driver.mjs:695–720`) and `proof:settle-is-predicate` (a source-shape gate
asserting `openControlsPanel` contains zero `waitForTimeout`). `waitForRender` is
called in **12 places** on the L close tree — all in `openControlsPanel` (the
state-predicate settle: "Select materialised", "selection committed", "pane open",
"idle-fade present"). `openControlsPanel`'s former 4 `waitForTimeout` calls
(500/800/600/800 ms) were eliminated.

**What L.W4 did NOT address** (verified):
- The **animation-duration settle class** — the 264 `waitForTimeout` calls that
  exist to wait for an animation to complete a frame sweep or reach a settled
  visual state. These are in the gate scripts themselves (not in `openControlsPanel`),
  and none were converted to `waitForRender` predicates. Example: `proof-live-
  session.mjs` lines 527/531/574/600/700/704/712/729/782/785/952/… carry
  `waitForTimeout(700)`, `waitForTimeout(1500)`, `waitForTimeout(2600)`.
- The precept for the animation-duration class: a `waitForTimeout(700)` after
  "trigger the animation" waits for the *animation to reach visual settlement*,
  not for a DOM-state predicate. A predicate-settle (`waitForRender(page, () =>
  element.getBoundingClientRect().width > 0)`) would be sound for the VISIBILITY
  class, but not for "wait for a spring/duration animation to complete its motion"
  — the terminal position can be reached at `t < 700 ms` (fast box) or overrun
  (slow box). The CORRECT cure for this class is a **synthetic clock** that
  advances the animation deterministically, not a longer ceiling predicate.

### 1.4 Sampled wall-clock (from `gate-apparatus-A-taxonomy.md §2`)

| Gate | Class | Real wall-clock |
|---|---|---:|
| `proof:no-dup-utility` | source-shape | 0.16 s |
| `proof:single-writer` | source-shape | 0.17 s |
| `proof:boundary` | source-shape | 0.69 s |
| `proof:blend` | node+vitest | 0.76 s |
| `proof:dock-popover-opens` | browser (1 scene) | 1.98 s |
| `proof:single-toggle` | browser (1 scene) | 2.76 s |
| `proof:layout-cluster` | browser (multi-scene) | 11.29 s |
| `proof:drag-gesture` | browser (multi-surface drag) | 27.18 s |
| `proof:live-session` | browser (full 8-scene sweep) | 80.85 s |

**Browser class: 2 s → 81 s, a 40× spread. Mean ≈ 24.8 s, median ≈ 11.3 s.**
Source-shape gates: mean 0.32 s; vitest gates 0.8–1.0 s.

Single-pass `proof:all` estimate: **~15–31 min** (median- vs mean-weighted).
Non-browser 70 gates + full vitest: **~70 s** — essentially free.
Browser share: **92–96% of total wall-clock.**

### 1.5 The O(N²) serial-chain iterate cost

`proof:all` = `proof:correctness && proof:hygiene` is a pure serial `&&` chain
(verified: `proof:hygiene` = **124 `&&`, 0 `;`, 0 `||`; no parallel runner in
`package.json` — `concurrently`/`npm-run-all`/`run-p`/`turbo`/`xargs -P` →
**0**). `&&` aborts on the first non-zero exit, reports ONE failure. Re-run
re-pays every prior green (no caching, no skip). With reds distributed through
the chain: **O(N²)** re-run cost. **5–6 reds × ~30-min full prefix = ~2.5–3 h**
— the owner's measured 3 hours. The cold-boot and sleep costs compound: every
prefix re-run re-pays every cold boot and every settle sleep for every green gate
before the red.

---

## 2. The synthetic clock — taxonomy, hook point, scope

### 2.1 Existing naming in the gate taxonomy

`docs/tranches/J/gate-taxonomy.md:54–55` (the BINDING posture manifest,
machine-checked by `proof:ci-coverage` clause 4) already names the synthetic
clock as the **Architectural cure** for two `observe-only` gates:

> `proof:perf-frame-budget` — Architectural cure: "A synthetic-time clock injected
> into the rAF driver (the engine reads a fake monotonic time the test advances
> deterministically), so the felt frame budget is measured against virtual elapsed
> ms, not the runner's wall-clock under load."

> `proof:scene-transition-perf` — Architectural cure: "Drive the scene transition
> under a deterministic synthetic clock (fake-time rAF) so the settle-within-budget
> assertion reads virtual ms, decoupling the transition-perf verdict from the shared-
> runner CPU."

The synthetic clock is **already the named M-target**. Lane 17's job is to
generalize this prescription to the full 264-sleep class.

### 2.2 The rAF driver hook point

`src/animation/internal/leaves.ts:87–104` — the rAF shim:

```typescript
export function requestAnimationFrame(callback: FrameRequestCallback) {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }
    // setTimeout fallback for non-DOM environments
    return setTimeout(() => { callback(Date.now()); }, delay);
}
```

`src/animation/playback.ts:113–150` — `RAFPlayback._run` calls
`requestAnimationFrame(frame)` (line 150) from `./internal/leaves`. This is the
**single dispatch point** — "No other module owns a rAF handle" (`CLAUDE.md`
architecture note). ALL three loop shapes (`play`/`drive`/`loop`) converge here.

The hook: `leaves.ts:requestAnimationFrame` delegates to `window.requestAnimationFrame`
when the window is present. In a Playwright browser context, `window.requestAnimationFrame`
IS the real browser rAF. A synthetic clock injects a **test-controlled
`requestAnimationFrame`** via `page.evaluate` / `page.addInitScript`, replacing
`window.requestAnimationFrame` with a fake that:
1. queues callbacks without scheduling them to the GPU compositor;
2. exposes a `tick(virtualMs)` function the test calls to advance virtual time and
   fire the queued callbacks with `now = virtualMs`;
3. allows the test to call `tick(16.667)` repeatedly to advance by N frames
   deterministically, with no wall-clock dependency.

**The injection point is entirely in the browser context** (the page's JavaScript
environment) — no changes to `leaves.ts` are required for the browser gate case.
For the jsdom/unit-test case, the `setTimeout` fallback already routes through
Node's timer system, so `vitest.useFakeTimers()` / `vi.advanceTimersByTime()`
can drive it without any source change.

### 2.3 The two classes of `waitForTimeout` sleeps

Not all 264 sleeps are equivalently addressable. They divide into two classes:

**Class A — animation-duration settle (the synthetic clock target):**
The gate triggers an animation, then waits for it to complete. Example
(`proof-live-session.mjs:527`): "trigger the scene transition → `waitForTimeout(700)` →
assert the subject is visible." The 700 ms is the animation's duration. With a
synthetic clock: replace with `tick(700)` → assert immediately. **This class is
the overwhelming majority** — the 40 sleeps in `proof:live-session`, the 27 in
`proof:scene-machine-irrefragable`, the 20 in `proof:fsm-suspend-resume-live`, etc.

**Class B — GPU/compositing warm-up sleeps (NOT addressable by synthetic clock):**
A small number of sleeps are not animation settles but GPU warm-up budgets. The
canonical instance is `proof-live-session.mjs:697` (comment: `// warm the shared
GPU process (UNBUDGETED)`) and line 704 (`// ≥2s STEADY-STATE present loop on a
warm GPU, NO readback`). These are explicit comments that the sleep is NOT waiting
for virtual animation time — it is waiting for the real GPU process to warm up.
A synthetic clock cannot replace these; they must either remain as `waitForTimeout`
or be demoted to `observe-only` hygiene notes.

**Estimate:** Class B is a small fraction (~10–15 calls out of 264). Class A
is ~250 calls, and those are the wall-clock load.

### 2.4 The settle-sum arithmetic for `proof:live-session`

`proof-live-session.mjs` `waitForTimeout` values (lines 271, 281, 308, 527, 531,
574, 600, 628, 641, 697, 704, 712, 726, 729, 782, 785, 952, 1025, 1088, 1091,
1103, 1147, 1174, 1205, 1217×2, 1253, 1311, 1333, 1341, 1378, 1384, 1386, 1392,
1397, 1398, 1400, 1480, 1483, 1485):

Summing the Class A settle waits (excluding lines 697/704 — the GPU warm-up
class): the sum of `waitForTimeout` values on those 38 calls is on the order of
**20,000–25,000 ms of declared sleep** (dominated by the 1500/1600/2600 ms
outliers and the repeated 700/900/1000 ms calls). This is the floor of the 80 s
wall-clock — even a perfectly fast host cannot beat the declared sleep sum.

With a synthetic clock: the gate fires `tick(virtualMs)` instead of sleeping,
each tick completes in a single JavaScript microtask, and the entire suite of
animation asserts runs in **< 1 s of wall-clock** for the same 38 animation
settle windows.

**Expected per-gate speedup (Class A replaced):**

| Gate | Current wall-clock | With synthetic clock (estimated) | Speedup |
|---|---:|---:|---:|
| `proof:live-session` | ~81 s | ~2–3 s (38 ticks + assert overhead) | ~30–40× |
| `proof:scene-machine-irrefragable` | ~30–40 s (est.) | ~1–2 s | ~20–30× |
| `proof:fsm-suspend-resume-live` | ~20–30 s (est.) | ~1–2 s | ~15–20× |
| Median browser gate (~11 s) | ~11 s | ~1–3 s | ~5–10× |

**Full `proof:all` browser tier:** 72 gates × median 11 s = ~13.5 min today.
With synthetic clock on the Class A majority: 72 gates × ~2 s = ~2.4 min.
**Net speedup of the browser tier alone: ~5–6×** (median estimate).

Combined with shared browser + server (eliminates per-gate cold-boot + warm-cache
re-pay): the shared-fixture amortizes the ~210 ms launch tax and, more importantly,
the SPA cold-boot cost (Vue hydration + scene machine init: ~0.5–1 s per gate).
That adds another ~0.5–1 s back from each gate's non-sleep overhead.

**Projected total `proof:all` wall-clock:**

| | Today | With shared fixture | With shared + synthetic clock |
|---|---|---|---|
| Browser tier (72 gates) | ~13.5–30 min | ~8–15 min (1 cold boot amortized) | ~2–4 min |
| Non-browser (70 gates + vitest) | ~70 s | ~70 s (unchanged) | ~70 s |
| **Total** | **~15–31 min** | **~10–17 min** | **~3–5 min** |
| Iterate-to-green (5–6 reds × prefix re-run) | **~2.5–3 h** | **~2.5–3 h (O(N²) unchanged)** | **minutes (if serial is also fixed)** |

Note: the iterate cost is driven by the serial `&&` chain (O(N²) prefix re-run),
not pass-time alone. Fixing cold-boot + sleep without fixing the chain halves
pass-time but does not kill the iterate loop. The three fixes compose; they should
all land in M.

---

## 3. The M-wave design

### M-wave α — Shared browser + server fixture

**What:** Replace the per-gate `withPage`/`withBrowser` cold-boot lifecycle with a
**globally shared browser + a globally served `dist/gh-pages`**, so the chromium
launch and Vue SPA hydration are amortized once across the full gate run instead of
paid ~80+ times.

**Design:**
- A `globalSetup` fixture (or a per-suite `beforeAll` block) launches ONE chromium
  instance and starts ONE `serveDist` server before any browser gate runs.
- Each browser gate receives the live browser handle (or opens a new context +
  page from it) and calls `page.goto(base + '/#/' + scene)`.
- A shared browser does not reset tab-level state automatically; each gate is
  responsible for navigating to its required scene via `navToScene` (already the
  contract) and optionally resetting localStorage for state it cares about.
- The `withBrowser` lifecycle in `demo-driver.mjs` is replaced by
  `getBrowserFixture()` / `releaseContext()` — the shared fixture returns a
  browser handle; the gate opens its own context (for isolation) but does not
  launch chromium.

**Precept compliance:**
- The `gate-is-runtime` precept demands the gate actuate the **built dist**, not
  source. A shared browser still navigates to the served built `dist/gh-pages/` —
  the precept is unchanged.
- Gate isolation: each gate opens its OWN context (for localStorage, viewport, CDP
  session isolation) — it does not share a page with other gates. **A context is
  cheap (~5 ms); a chromium launch is ~210 ms; a Vue hydration is ~500–1000 ms.**
  Per-gate contexts, shared browser — this is the correct granularity.
- The `KF_REQUIRE_BROWSER` / `harnessUnavailable` / `W7-1` rule is unchanged: a
  gate that requires the browser still hard-fails if the harness is unavailable.

**Implementation target:** `scripts/lib/demo-driver.mjs` — add `launchGlobalBrowser()`
/ `getGlobalBrowser()` / `closeGlobalBrowser()` alongside the existing `withBrowser`,
and wire the new functions into the `proof:all` entry via a pre/post script or an
explicit `proof:browser-setup` / `proof:browser-teardown` script pair.

**Complication — per-process architecture:** Today each gate is its own `npm run`
process. Module-level shared state (a browser handle) cannot cross process
boundaries. Therefore shared browser + server requires EITHER:
- Migrating gates to a unified runner (the full `@vitest/browser` migration from
  `gate-apparatus-VERDICT.md`) — the clean solution; or
- A lightweight process-spanning IPC: write the browser's WebSocket endpoint to a
  temp file at `proof:browser-setup`, have each gate connect via
  `chromium.connect({ wsEndpoint: ... })`, and close at `proof:browser-teardown`.

The WebSocket-endpoint approach is a pragmatic M.W1 step that does NOT require
the full `@vitest/browser` migration. It decomposes the cure into:
  - M.W1: shared browser via `launchServer`/`connect` protocol
  - M.W2 (or later): full `@vitest/browser` migration (the long game, highest ROI)

### M-wave β — Synthetic clock injected into the rAF driver

**What:** Expose a test-injectable fake `requestAnimationFrame` in the browser
context so gate scripts can advance animation time deterministically instead of
sleeping through it.

**Design:**
A `page.addInitScript` (injected before any page load) replaces
`window.requestAnimationFrame` / `window.cancelAnimationFrame` with a test-
controlled queue:

```javascript
// addInitScript payload — injected by demo-driver.mjs helpers
(function installSyntheticRaf() {
    let t = 0;
    const queue = [];
    window.__syntheticRaf = true;
    window.requestAnimationFrame = (cb) => {
        const id = queue.length;
        queue.push({ id, cb });
        return id;
    };
    window.cancelAnimationFrame = (id) => {
        const idx = queue.findIndex(e => e.id === id);
        if (idx !== -1) queue.splice(idx, 1);
    };
    window.__tick = (dtMs) => {
        t += dtMs;
        const cbs = queue.splice(0);
        cbs.forEach(({ cb }) => cb(t));
    };
})();
```

The gate then replaces `page.waitForTimeout(N)` with:

```javascript
await page.evaluate((ms) => window.__tick(ms), 700);
// or for multi-frame animations:
for (let i = 0; i < 42; i++) {
    await page.evaluate(() => window.__tick(16.667));
}
```

Because `RAFPlayback._run` routes through `window.requestAnimationFrame` (via the
`leaves.ts` shim, which checks `window.requestAnimationFrame` first), injecting the
fake rAF at the `window` level is sufficient to control ALL animation timing.
`SpringProgress`/`SmoothProgress`/`NumericAnimation`/`AnimationGroup` all ride
`RAFPlayback`, which rides `leaves.ts:requestAnimationFrame`, which delegates to
`window.requestAnimationFrame`. **No source change is required.**

**Scope of applicability:**
- Class A animation-settle sleeps: fully addressable. Replace
  `page.waitForTimeout(700)` with `page.evaluate(() => window.__tick(700))`.
- Class B GPU warm-up sleeps (the ~10–15 calls with explicit comments like
  "warm the shared GPU process"): NOT addressable by synthetic clock. These wait for
  the real GPU/compositor process, not for virtual animation time. Leave as
  `waitForTimeout` or demote to `observe-only` notes.
- `proof:perf-frame-budget` and `proof:scene-transition-perf` (the two `observe-only`
  gates whose Architectural cure is already named as "synthetic-time clock injected
  into the rAF driver"): these ARE the primary targets. Implementing the synthetic
  clock here is the DIRECT discharge of the named cure, promoting these two gates
  from `observe-only` to `hard` — a genuine correctness upgrade.

**Gate precedent:** `proof:settle-is-predicate` (L.W4) established the principle
that a gate MUST NOT use `waitForTimeout` for a state predicate. The synthetic clock
extends this to: a gate MUST NOT use `waitForTimeout` for an animation-settle
predicate either. The M gate (`proof:no-animation-sleep` or an extension of
`proof:settle-is-predicate`) asserts this structurally.

**Complication — the amiga scene and Three.js animations:** The amiga canvas uses
Three.js with its own rAF loop (a `three.js` renderer, not `RAFPlayback`). The
synthetic clock injection replaces `window.requestAnimationFrame` globally, which
WILL intercept Three.js's rAF calls too. The amiga `waitForTimeout` GPU warm-up
sleeps (lines 697/704) are in the Class B category precisely because Three.js's
renderer depends on real GPU frame time, not virtual animation time. **Mitigation:**
the synthetic clock injection must be opt-in per gate, not injected globally by
`withPage`. Gates that probe the amiga canvas rAF behavior continue to use real
time (or are demoted to `observe-only`). The injection helper is
`injectSyntheticRaf(page)` (called explicitly by each gate that needs it), not
part of the default `withPage` lifecycle.

**Expected outcome (the two `observe-only` discharges):**

| Gate | Today | After synthetic clock |
|---|---|---|
| `proof:perf-frame-budget` | `observe-only` (wall-clock category; re-measure on-device) | **`hard`** — the frame budget is measured in virtual ms, device-independent |
| `proof:scene-transition-perf` | `observe-only` (wall-clock category; re-measure on-device) | **`hard`** — the transition settle is measured in virtual ms, device-independent |

These are listed in `gate-taxonomy.md:54–55` as "Architectural cure: synthetic-time
clock." M is where that cure lands.

**Note on `proof:drawer-spring` (`observe-only`, physics-settle category):** The
taxonomy names a different cure for this gate — "A deterministic spring simulator
that advances the `SpringProgress` integrator on a synthetic clock (a fixed-step
physics solver gated by a virtual-time predicate)." This is the jsdom/unit-test
side of the same synthetic-clock family: `vitest.useFakeTimers()` +
`vi.advanceTimersByTime(dt)` drives the `setTimeout`-based rAF fallback in
`leaves.ts:87–104`, which `SpringProgress` uses in the jsdom test environment. The
M wave generalizes both: the in-browser injection (for browser gates) and the timer-
mock approach (for jsdom tests) share the same conceptual cure, different injection
layers.

### M-wave γ — Structural gate for the animation-sleep class

**What:** Extend `proof:settle-is-predicate` (currently scoped to `openControlsPanel`
only) to assert that **no gate script contains a `waitForTimeout` call followed
immediately by an assertion about animation state**.

This is a heuristic structural gate (source-shape, no browser), not a complete
check. Its form: grep gate scripts for `waitForTimeout` calls; for each, check the
following 10 lines for a visual/animation assertion. A positive match is a
`fail` — the gate must either convert the sleep to a `__tick` + predicate or
document it as Class B with an explicit comment.

Alternatively: a blanket ceiling — `proof:no-animation-sleep` asserts that the
total count of `waitForTimeout` calls across all gate scripts never exceeds the
Class B count (to be established once the Class A migrations complete).

---

## 4. Precept audit — L-as-built

### 4.1 Violations

**VIOLATION 1 — inv-L-device-honesty (the gate-suite law):**
L.W4 landed `waitForRender` for the state-predicate settle class in
`openControlsPanel` (12 calls) and `proof:settle-is-predicate` as a structural
gate asserting zero `waitForTimeout` in `openControlsPanel`. However, the
**264 `waitForTimeout` calls in the gate scripts themselves** — the animation-
duration settle class — are entirely intact on the L close tree. The L-born
invariant `inv-L-device-honesty` states: "A CI gate asserts a device-INDEPENDENT
predicate, or declares `observe-only` with a CATEGORY and a recorded architectural
cure. No gate passes on the fast dev box yet fails on the slow runner."

The 264 remaining animation-duration `waitForTimeout` sleeps are exactly the
macOS-pass/Linux-fail render-race root that L.W4 was chartered to fix
(`PROGRESS.md §2.2 W28`). L.W4's partial cure (state-predicate class) is a
necessary foundation but not the complete answer. **The L close tree violates
inv-L-device-honesty for the animation-duration settle class.**

Evidence: `PROGRESS.md §2.2 W28` ("259 fixed-ms `waitForTimeout()` sleeps are the
macOS-pass/Linux-fail render-race root"); L close tree count = 264 `waitForTimeout`
in gate scripts (verified above); `proof:settle-is-predicate` scope is
`openControlsPanel` only (`scripts/proof-settle-is-predicate.mjs` header).

**VIOLATION 2 — NO quick-solution / workaround precept (the cold-boot pattern):**
`withBrowser` carries a hand-written 3-attempt launch-crash retry loop
(`demo-driver.mjs:450–495`) that re-implements `vitest`'s `retry` fixture. This is
a workaround for Playwright browser instability — a runner-environment issue
addressed by re-launching a fresh chromium rather than by sharing a stable long-
lived browser. The cure named in the taxonomy (`ci.yml:327`: "one shared
chromium+server, withBrowser reuse") is the idiomatic solution; the retry loop is
the workaround around the fragility that cold-boot amplifies. With a shared warm
browser, transient GPU/network-service crashes during launch are rare (one shared
warm browser vs 80+ cold launches) and the retry loop becomes vestigial.

Evidence: `demo-driver.mjs:450–495` (the 3-attempt retry loop, comment "a transient
ENVIRONMENT instability, NOT an oracle failure"); `ci.yml:327–329` (the named cure,
unbuilt).

### 4.2 Sound principles (keep)

- The `gate-is-runtime` precept (real browser over the built dist, actuated, zero
  budget): justified by the over-removal blank-out (`docs/tranches/I/audit/
  rootcause-rc-gate-blindspot.md:164`) and ROOT-A appearance misses. **Keep
  unchanged** — the M-wave shared fixture preserves it (gates still navigate the
  built `dist/gh-pages/`, they just share the browser that opens it).
- The `observe-only` / device-honesty taxonomy (`gate-taxonomy.md`) and the
  `proof:ci-coverage` machine-check: principled, earned, orthogonal to the
  runner. **Keep unchanged** — the synthetic clock discharge promotes two gates
  from `observe-only` to `hard` via the recorded architectural cure.
- The `waitForRender` primitive landed in L.W4: the RIGHT abstraction for the
  state-predicate settle class. **Keep and extend** — the synthetic clock extends
  the same discipline to the animation-duration settle class.

---

## 5. Deferred folds (chronic items this lane surfaces for M)

| Item | Born | Chronicity | Disposition | M owning wave |
|---|---|---|---|---|
| **DL-M17-α The 264 animation-duration `waitForTimeout` sleeps** — the animation-settle class NOT addressed by L.W4's `waitForRender`; inv-L-device-honesty violation on the L close tree; the macOS-pass/Linux-fail render-race root for ~250 of the 264 calls. | L (L.W4 partial cure; the animation-duration class left open) | 1 (first tranche to name it as a structural violation, not just a metric) | **FOLD TARGET → M synthetic clock wave** | M.Wx (synthetic clock injection) |
| **DL-M17-β Shared browser + server fixture** — `ci.yml:327–329` names the cure ("one shared chromium+server, withBrowser reuse") as the durable fix; unbuilt through J/K/L. The 3-attempt cold-launch retry loop in `withBrowser` is the symptom. | J (`ci.yml` authored the named cure at J.W5 calibration; unbuilt) | 3 (J, K, L → M) | **FOLD TARGET → M shared fixture wave** | M.Wx (shared browser fixture) |
| **DL-M17-γ `proof:perf-frame-budget` + `proof:scene-transition-perf` `observe-only` discharge** — `gate-taxonomy.md:54–55` names the synthetic-clock Architectural cure; both gates remain `observe-only` on the L close tree. The cure is chartered but unbuilt. | J (taxonomy authored at J.W3) | 3 (J, K, L → M) | **HANDOFF TARGET → M synthetic clock wave** (discharge via implementation) | M.Wx (synthetic clock injection) |

---

## 6. Cross-repo asks

**None** — this lane is entirely kf-internal. The synthetic clock injection acts
at `window.requestAnimationFrame` in the browser page context and at the
`leaves.ts:requestAnimationFrame` shim; both are kf-owned. The shared browser
fixture is a `demo-driver.mjs` harness change, also kf-owned.

**Adjacent ask** (not a blocker): if glass-ui or value.js animations run in the
demo page with their own rAF loops (separate from `RAFPlayback`), the synthetic
clock injection will also advance those animations. This is CORRECT behavior (the
test wants deterministic time for ALL animations on the page, not just kf's), but
it should be verified that glass-ui's dock spring animations do not have Class B
GPU warm-up dependencies similar to the amiga Three.js case. The `proof:perf-frame-
budget` dock-expand clause uses real rAF to measure frame intervals — that clause
explicitly requires real GPU time and must NOT inject a synthetic clock (it is
already `observe-only`; the synthetic clock is for the `observe-only` → `hard`
upgrade of the *felt budget* clause, not the raw-interval measurement clause).

---

## 7. Performance numbers summary

| Metric | Current (L close tree) | With M cures |
|---|---|---|
| `waitForTimeout` calls in gate scripts | **264** | **~10–15** (Class B only) |
| Per-gate chromium launches | **~80+ cold** | **1 shared warm** |
| `proof:live-session` wall-clock | **~81 s** | **~2–3 s** (38 `__tick` calls) |
| `proof:all` browser tier | **~13.5–30 min** | **~2–4 min** |
| `proof:all` total (single pass) | **~15–31 min** | **~3–5 min** |
| Iterate-to-green (5–6 reds, serial chain) | **~2.5–3 h** | **~2.5–3 h** (unchanged if serial `&&` not fixed) |
| `proof:perf-frame-budget` posture | `observe-only` | **`hard`** |
| `proof:scene-transition-perf` posture | `observe-only` | **`hard`** |

**The serial `&&` chain is the separate lever** — the per-gate timings above
improve the pass-time; the O(N²) iterate cost requires the parallel report-all
fix (a separate M-wave, not this lane). The interaction is multiplicative: a 5×
faster single pass × no O(N²) iterate → the full iterate loop drops from
~2.5–3 h to ~minutes.

---

## 8. Evidence index (every claim reproducible)

- `waitForTimeout` total count (L close tree): `git show tranche-l-dev:<path> |
  grep -c waitForTimeout` per script, sum = **264** (verified 2026-06-17).
- `waitForRender` call count (L close tree): `git show tranche-l-dev:scripts/lib/
  demo-driver.mjs | grep -n waitForRender` → 8 lines; 12 calls in the gate scripts
  (all in `openControlsPanel`). Verified.
- `proof:settle-is-predicate` scope: `scripts/proof-settle-is-predicate.mjs` header
  ("greps the `openControlsPanel` function body … asserts ZERO `waitForTimeout`
  calls") — scope is `openControlsPanel` only.
- `withBrowser`/`withPage` lifecycle: `demo-driver.mjs:432–548` (launch line 463,
  `serveDist` line 532, teardown lines 539–544).
- No shared browser: `grep` for `connectOverCDP|wsEndpoint|launchServer|
  reuseExisting` on L close tree → **0 hits** (verified).
- Fixed launch tax ~210 ms: `gate-apparatus-A-taxonomy.md §2` (measured via
  `/tmp/probe-overhead.mjs`).
- `leaves.ts` rAF shim: `src/animation/internal/leaves.ts:87–104` — delegates to
  `window.requestAnimationFrame` when present; `setTimeout` fallback otherwise.
- `RAFPlayback._run` rAF dispatch: `src/animation/playback.ts:150`
  (`requestAnimationFrame(frame)`).
- Synthetic clock taxonomy naming: `docs/tranches/J/gate-taxonomy.md:54–55`
  (the "Architectural cure" columns for `proof:perf-frame-budget` and
  `proof:scene-transition-perf`).
- `proof:live-session` settle-sum: `scripts/proof-live-session.mjs` lines 271,
  281, 308, 527, 531, 574, 600, 628, 641, 697, 704, 712, 726, 729, 782, 785,
  952, 1025, 1088, 1091, 1103, 1147, 1174, 1205, 1217(×2), 1253, 1311, 1333,
  1341, 1378, 1384, 1386, 1392, 1397, 1398, 1400, 1480, 1483, 1485 = **40 calls**.
  Class B GPU warm-up: lines 697, 704 (explicit comments). Class A: 38 calls.
- Serial `&&` chain: `proof:hygiene` = **124 `&&`, 0 `;`, 0 `||`** (verified on
  L close tree via `package.json` `proof:hygiene` value).
- Wall-clock samples: `gate-apparatus-A-taxonomy.md §2` (9 gates sampled via
  `time npm run proof:<x>`, darwin, dist warm).
- CI named-but-unbuilt cure: `ci.yml:327–329` ("one shared chromium+server,
  withBrowser reuse … F-7's static-gate migration out of demo-smoke").
- Gate-taxonomy posture manifest: `docs/tranches/J/gate-taxonomy.md` (BINDING,
  machine-checked by `proof:ci-coverage` clause 4 on the L close tree).
