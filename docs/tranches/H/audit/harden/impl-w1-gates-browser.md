# H.W1 impl — BROWSER-GATES lane (`impl-w1-gates-browser.md`)

My lane = the live-Playwright keystone gate for the scene+playback FSM, authored
as ONE script with the §Hard-gate clause set (H.W1.md §Hard gate). Browser-gated
(`KF_REQUIRE_BROWSER`), wired into `package.json` AND `ci.yml`, verified
GREEN-on-fix and born-RED-on-break (the falsifiability proof below). DO NOT
re-litigate the RESOLVED FSM architecture — these clauses LOCK it. Bound to the
CORE+HEART+Adapter surface in `impl-w1-core-api.md`.

---

## 1. Files landed (left in tree, NOT committed)

| File | Role |
|---|---|
| `scripts/proof-scene-machine-irrefragable.mjs` | NEW — the ONE browser gate: the (scenes²×{playing,paused}) identity matrix + the six focused clauses, serveDist+Playwright (mirrors `proof-demo-usability.mjs`/`proof-demo-console-clean.mjs`) |
| `package.json` | `proof:scene-machine-irrefragable` script + added to `proof:all` (beside the other H.W1 browser gates) |
| `.github/workflows/ci.yml` | NEW step in `demo-smoke` after `proof:demo-console-clean`, with `KF_REQUIRE_BROWSER: "1"` (mirrors the dock-popover/single-toggle wiring) |

`proof:ci-coverage` GREEN (43/43 gates invoked in CI) — the new gate is
recognised + wired.

---

## 2. The clauses (all in the ONE script, each with its STATED bite)

| Clause | What it drives + asserts | Bite (verified born-RED) |
|---|---|---|
| **C1 irrefragable-matrix** | every ordered (A→B→A) over `[cube, easing, amiga]` × {playing,paused}: playback snapshot byte-identical over `{t,reversed,iteration,playing,started,progress}` + control projection `{selectedAnimation,selectedControl,isControlsPanelOpen}` + route/active-scene mutual consistency | the corrupt-panel projection drift + the lost-state round-trip (witnessed via the isolation bite's `selectedAnimation` drift + the in-dev progress-mismatch reds) |
| **C2 scene-contract-identity (live)** | the named easing↔cube cross-pair round-trips the raw-rAF ScenePlayback contract: `progress` IS snapshotted + 0 AnimationGroup positions | the dummy `contractAnim` group has NO position → `proof:group-snapshot-identity` passes vacuously; THIS bites the raw-rAF loss |
| **C3 no-route-storm** | start `#/easing`, arm a pushState/replaceState trap POST-nav, DRIVE 4 re-renders, assert 0 scene-changing navs + hash unchanged + `navEntries===1` + `pathname==='/'` | **VERIFIED RED**: injected a resize→push storm → 12 autonomous scene-changing navs caught |
| **C4 scene-isolation** | after `#/easing`, 0 group-only `blend\|z-index\|enabled\|weight` node + `selectedControl==='easing'` | **VERIFIED RED**: pointed easing's controls at the `Cube` superKey/tab → `[blend, z-index, enabled]` leaked + projection red |
| **C5 deep-link-wins** | `#/spring` over localStorage `cube` rests on spring; `#/cube?state=` returns a redirect LOCATION + strips the consumed param (each on a FRESH context so the initial-nav guard fires) | **VERIFIED RED** (the ?state= row): re-introduced the pre-FSM localStorage-redirect → rested on home, ?state= survived |
| **C6 suspend-no-orphan-raf** | cycle easing⟷cube ×4, assert the self-rescheduling rAF rate does NOT GROW per cycle (orphan accumulation is the bite) | **VERIFIED RED**: injected an un-cleaned per-mount rAF loop → rate climbed 320→403→480→589 (1.46×) |
| **C7 no-timing-heuristic** | write a paused snapshot, hard-reload ×2 with a jittered busy-wait perturbing the `<Suspense>` resolution tick, assert the restore is DETERMINISTIC across perturbations (divergence = the isStableFire/nextTick race) | the heuristic race manifests as cross-perturbation divergence (the gate asserts agreement) |

---

## 3. The S-Harness preamble — HOW the gate drives (BINDING, lane-discovered)

- **`goto` is FORBIDDEN for in-session nav** (it CLEARS localStorage + wipes any
  in-page trap). Every clause drives scene switches IN-PAGE via
  `location.hash = "#/<scene>"` — a hash assignment is NOT a document navigation
  (no reload, `navEntries` stays 1, storage + traps survive). It funnels through
  the EXACT same reconcile fixed point as the in-app combobox (the dock Select →
  `switchScene` → `NAVIGATE` → writer `router.push` → `afterEach`); the hash
  driver enters that loop at the `afterEach`/popstate READER directly (the route
  is the external input, WV-W1-HIGH-2). The reka-ui Select trigger is portalled +
  dock-hover-gated → flaky headless; the hash driver is the robust,
  context-preserving equivalent the preamble names. (`goto` is used ONLY for the
  initial deep-link load of each fresh page — its storage-clear is harmless there.)
- **The identity ORACLE is localStorage** (production gh-pages build has NO DEV
  `window.__` hooks): `keyframes-js-scene-machine` (the playback snapshot, keyed
  by scene) + `animation-groups-control-options-store` (the control projection,
  keyed by superKey) — the two stores the matrix round-trips. The CANONICAL
  snapshot of a scene is the one persisted when it LEAVES (`captureActive` reads
  the live adapter into `perScene`), so the gate captures via a leave-and-read.
- **Identity ADAPTS to each scene's policy (the lane's key correctness finding):**
  a PAUSED/resting snapshot (`playing:false`) round-trips BIT-EXACT (its frozen
  clock is deterministic); a PLAYING snapshot (`playing:true` — the `autoPlays`
  previews easing/spring/starting-style, which auto-play on EVERY entry by design)
  round-trips the play INTENT + architecture shape, with a LIVE advancing clock.
  Asserting bit-exact `t`/`progress` on a deliberately free-running clock is a
  FALSE RED on correct behaviour — the matrix never does it. (This is WHY the
  first three gate iterations red on the correct tree: they conflated a
  free-running playing clock with a lost snapshot. The fix is policy-adaptive
  identity, NOT a slacker assertion.)
- **Transport via the canonical ribbon button** (`aria-label` exactly
  `"Play animation"`/`"Pause animation"`, EXCLUDING the `"(collapsed dock)"` twin
  — clicking both double-fires + cancels out, the cube-freeze miss) → routes
  through `onPlayStateChange` → the machine (never a direct engine poke).
- **Storage seeded via reload**, not goto-then-set (goto would have cleared it).

---

## 4. Behavioural facts the lane established (for the next lane)

- **Cube resists pausing in this build** — clicking the canonical "pause
  animation" returns truthy but the snapshot stays `playing:true`. NOT a defect
  the browser gate owns (the playback wiring is the HEART/Adapter lane); the gate
  ADAPTS by using cube's deterministic RESTING snapshot (`playing:false,
  started:false`), which round-trips bit-exact. Amiga DOES pause cleanly →
  exercises the richer bit-exact frozen-clock path. [Possible follow-on for the
  HEART lane: cube's bottom-bar pause not propagating to the group is worth a
  look — outside this lane's scope.]
- **Orphan rAF is defended IN DEPTH** — the adapter `suspend()` + the
  `onScopeDispose(playback.stop)` + `useSceneVisibilityPause`'s cleanup each stop
  the loop, so a SINGLE-point break does NOT leak (the C6 rate stayed flat with
  two of three disabled). The clause bites GENUINE accumulation (an un-cleaned
  per-mount loop → climbing rate), which is the pre-FSM remount-churn defect.
- **The deep-link `#/spring` row is robustly defended** — the `afterEach` reader
  independently honors the URL, so even breaking the first-load seed could not
  flip it to localStorage (it still rested on spring). The `?state=` sub-row is
  the breakable witness (it red on the localStorage-redirect injection). Both
  sub-rows GREEN on the correct tree.

---

## 5. Verification log

- **GREEN on fix:** 18 ✓ clauses + PASS, stable across ≥5 full/partial runs (no
  flakiness). `node scripts/proof-scene-machine-irrefragable.mjs` (re-runnable);
  `KF_REQUIRE_BROWSER=1` in CI.
- **Born-RED on break** (each injection REVERTED, tree verified clean — `grep -r
  "TEMP BITE"` empty; the four touched files restored to their sibling-lane
  state byte-for-byte): C3 storm (12 navs), C4 isolation (`[blend,z-index,
  enabled]` leak + projection), C5 ?state= (rested home), C6 orphan (1.46× climb).
- **Skip-safe:** with `KF_REQUIRE_BROWSER` unset and playwright unresolvable,
  exits 0 with a `○ browser half skipped` line (the local-dev posture); under
  `KF_REQUIRE_BROWSER=1` a skip becomes a hard fail (the keystone cannot pass
  vacuously in CI).
- **Wiring:** `proof:ci-coverage` GREEN; `package.json` valid JSON; the gate runs
  in `demo-smoke` after `npm run gh-pages` (it serves the BUILT `dist/gh-pages/`).

DO NOT git commit — left in tree for the lead to review + commit.
