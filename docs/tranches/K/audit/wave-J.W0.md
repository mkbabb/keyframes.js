# J.W0 — Plan-vs-Delivery Audit (THE DEPLOY BOUNDARY)

- **Lane:** K/audit/wave-J.W0.md — Tranche K audit fleet
- **Subject:** J.W0 spec (`docs/tranches/J/waves/J.W0.md`) vs impl record
  (`docs/tranches/J/waves/J.W0-impl.md`) vs the living tree
- **Branch audited:** tranche-j-dev @ 4f1fc4c (= master post-close 4.2.0)
- **Date:** 2026-06-11
- **Method:** file:line reads of all cited artifacts + `gh run view` on the
  four named CI/deploy runs + `gh secret list` re-verification + source trace
  of the cold-path play flow

---

## §1 — §Scope delivery verdict (every S-item)

### S1 — 8-commit post-close tail adopted

**DELIVERED.** `J.W0.md §S1` holds the terminal disposition table for all
eight commits (`f93e731` … `4072af9`). The impl record (`J.W0-impl.md §S1`)
confirms adoption as-specced: RE-AFFIRM ×5, SUPERSEDED-BY-S2 for `66855c2`,
RE-AFFIRM for `feb39c3` (booking discharged), DISCHARGED-BY-J.W0 for
`4072af9`. P-invariant-28 satisfied — no commit remains unrooted.

No finding; delivery matches spec.

### S2 — navToScene per-expected-state primitive + gate migrations

**DELIVERED.** Verified against tree:

| Claim | Verification |
|---|---|
| `export const SCENE_MACHINE_KEY` lands in `demo-driver.mjs` | `scripts/lib/demo-driver.mjs:650` — confirmed |
| `export async function navToScene(...)` lands in `demo-driver.mjs` | `scripts/lib/demo-driver.mjs:671-713` — confirmed; signature + predicate match spec §S2 exactly |
| Per-expected wait: trigger text == expected OR trigger-absent for `null` | `demo-driver.mjs:700-712` — confirmed; `.catch(()=>{})` oracle-honesty guard present |
| NO fixed `settleMs` anywhere | `grep settleMs scripts/proof-scene-control-dfa.mjs` → 0 hits — confirmed |
| `proof-scene-control-dfa.mjs` migrated; local `navByHash` + `MACHINE_KEY` deleted | `:52` import; `:215,:261-262` call sites; `grep navByHash scripts/proof-scene-control-dfa.mjs` → 0 — confirmed |
| `proof-scene-transition-perf.mjs` migrated; local `navByHash` + `MACHINE_KEY` deleted | `:56` import; `:254-257` call sites; `grep navByHash scripts/proof-scene-transition-perf.mjs` → 0 — confirmed |

**NOTE — impl line numbers are a pre-J.W3 point-in-time snapshot.** The impl
record cites `SCENE_MACHINE_KEY` at `:330` and `navToScene` at `:332-355`.
J.W3's `withPage`/`withBrowser` consolidation grew `demo-driver.mjs` from ~400
to 756 lines; the live positions are `:650` and `:671-713`. No correctness
impact; the functions are present and correct. **[F-W0-1, P2]**

### S3 — dock trigger projection born-correct from the DFA

**DELIVERED.** The two lag mechanisms documented in `J.W0-impl.md §witness`
(the label CONTENT lag + the affordance PRESENCE lag) are both cured:

| Cure | Location | Verified |
|---|---|---|
| `extraControlTabsFor(sceneId, activeConditionals)` — derives tab metadata from the DFA, not the mounted scene component | `controlSurfaceDFA.ts:181-195` | `grep extraControlTabsFor controlSurfaceDFA.ts` → function at :181 — confirmed |
| Machine exposes `extraControlTabs(activeConditionals?)` reactive projection | `useSceneMachine.ts:244-262` (per impl; confirmed present) | `grep extraControlTabs demo/app/App.vue` → :281-283 machine-projected computed — confirmed |
| `sceneRef?.extraControlTabs ?? []` re-bind (the lag) is DELETED | `App.vue` — `grep "sceneRef.*extraControlTabs" App.vue` → 0 hits | confirmed |
| `hasControlPanel = allControlTabs.value.length > 0` — no `hasSelectedAnimation` AND-clause | `ChromeDock.vue:101` | confirmed; comment at `:96-100` records the deletion rationale |
| Per-scene `extraControlTabs` computes removed from EasingScene/SpringScene/CubeScene | `grep extraControlTabs demo/app/scenes/EasingScene.vue SpringScene.vue CubeScene.vue` → 0 hits | confirmed |
| Post-cure frame-granular proof: 265/265 unthrottled, 228/228 6× CPU-throttle frames read `"Spring"` | `J.W0-impl.md §witness` | born-RED discipline honored; the NEVER-PROJECTS reconciliation is the honest pre-cure shape |

**Residual sceneRef usage is CORRECT:** `App.vue` still uses `sceneRef` for
`tabsTrigger`, `tabsContent`, `ribbonContent` (`:120-134`) — these are
scene-specific SLOT components, not the control-tab projection. The lag the
spec targeted was `sceneRef?.extraControlTabs`, which is gone. No finding.

### S4 — GH secrets VERIFY + sanctioned deploy path

**DELIVERED.** `gh secret list` re-run for this audit:

```
CLOUDFLARE_ACCOUNT_ID   2026-06-07
CLOUDFLARE_API_TOKEN    2026-06-07
NPM_TOKEN               2026-06-03
```

Both Cloudflare secrets present. `deploy-pages.yml:66-68` consumes them via
`scripts/pages-deploy.sh`. Sibling-`.env` bypass retired. Clause (d) satisfied.

### S5 — never-run Linux tail triage protocol

**DELIVERED.** The triage protocol produced five CI attempts over five master
pushes; every surface layer was fixed at the product or gate seam — zero
`continue-on-error` added, zero device-independent gate demoted:

| Round | SHA | CI run | Layer surfaced | Disposition (P6 audit) |
|---|---|---|---|---|
| #1 | `09a56bf` | `27298506458` | `scene-control-dfa` GREEN on Linux for the first time (the W0 cure held); fail-stop: `scene-transition-perf` round-trip identity (`selectedControl` drift, easing↔cube) | Device-INDEPENDENT product defect; owned by J.W2 — correct P6 classification |
| #2 | `e9f2f8a` | `27303418544` | `proof:ci-coverage` (3 new gates unwired) + lighthouse `label-content-name-mismatch`×2, `aria-required-attr` | Gates wired; ARIA defects fixed at product seam (`af5b7e7`) — correct |
| #3 | `af5b7e7` | `27305120296` | `proof:demo-no-oversize` (`ControlsPaneWrapper.vue` 514L, `useSpringDemo.ts` 553L) | Colocated re-decomposition at natural seams — correct |
| #4 | `890e2b7` | `27306845701` | `proof:easing-sidebar-normalized` (stale `tabpanel` mount predicate vs J.W2 flat-mount grammar) | Gate predicate evolved to the spec'd grammar + corpus-swept — correct |
| #5 | `c6c3c37` | `27310054675` | NONE — GREEN end-to-end | Auto-deploy fired |

Verification: `grep "continue-on-error" .github/workflows/ci.yml` → 0 hits.
`grep "IN_CI" scripts/proof-scene-control-dfa.mjs` → 0 hits. Protocol honored.

---

## §2 — §Hard gate clause verdicts

### clause (a) — scene-control-dfa GREEN on Linux, ZERO escapes

**GREEN.** CI run `27298506458` (the first W0 push on master) shows
`proof:scene-control-dfa` passing end-to-end — all six previously-failing
cells (D3 easing, D3 spring, D4 cube→easing, sequence→easing,
motion-path→spring, cube→spring) GREEN, trigger text matches per-expected
label in every case. Gate wall-clock under load: 4.42 s vs prior 34 s floor.
No IN_CI escape, no continue-on-error, no settleMs bump — confirmed.

### clause (b) — product projection born-correct mid-transition

**GREEN.** Post-cure frame-granular probe over the built `dist/gh-pages/`:
265/265 post-rest frames unthrottled and 228/228 under 6× CPU throttle read
`"Spring"` — never `"Controls"`, never `null`. The two lag mechanisms cured at
the DFA seam (`controlSurfaceDFA.ts:181`, `ChromeDock.vue:101`).

### clause (c) — observed auto-deploy round-trip via workflow_run-on-push arm

**GREEN AND FULLY OBSERVED.** Four links in the chain:

| Link | Record | Verified |
|---|---|---|
| Master push | `c6c3c37` | `gh run view 27310054675` — `Triggered via push` |
| Green CI | run `27310054675` — `demo gate` 19m13s, `library gate` 2m54s, both SUCCESS | `gh run view 27310054675` → both jobs SUCCESS |
| Auto-fire | run `27310920981` — `Triggered via workflow_run` | `gh run view 27310920981` → "Triggered via workflow_run about 1 day ago" |
| Served bytes | `index-DiVbdzH3.js` at `keyframes.babb.dev` | recorded in FINAL.md §3 |

The trigger is `workflow_run`, NOT `workflow_dispatch` — the auto arm, not a
manual substitute. INVE-1 RECORD-CURED.

**Close-merge RE-observation also confirmed:** FINAL.md §Commit ledger records
master `f0822a1` → CI `27378354065` (green, 22m32s) → deploy `27379501160`
(`event == workflow_run`) → live `index-xIYGAIrv.js`. Independently verified:
`gh run view 27378354065` → SUCCESS, `gh run view 27379501160` → SUCCESS,
trigger = workflow_run. The oracle was observed TWICE, as J.md §WZ required.

### clause (d) — secrets exist, sanctioned path only

**GREEN.** Confirmed in §S4 above.

### clause (e) — scene-transition-perf honest p95

**GREEN (observe-only).** Impl records p95=67.5 ms ≤ 120 ms budget at W0
local measurement. The known J.W2-owned round-trip defect (`selectedControl`
not round-tripping) is noted in the impl record without being papered; the gate
stayed observe-only per device-dependent posture.

---

## §3 — §No-workaround compliance

Every prohibition from `J.W0.md §No-workaround` verified:

| Prohibition | Verified clean |
|---|---|
| NO `settleMs` bump | `grep settleMs scripts/proof-scene-control-dfa.mjs` → 0 |
| NO `continue-on-error` | `grep "continue-on-error" .github/workflows/ci.yml` → 0 |
| NO `IN_CI` escape on `scene-control-dfa` | `grep IN_CI scripts/proof-scene-control-dfa.mjs` → 0 |
| NO sibling-`.env` deploy | FINAL.md §3 + S4 above |
| NO `workflow_dispatch` substitute | deploy run `27310920981` trigger = `workflow_run` — confirmed |
| NO `nextTick` re-assert | `grep nextTick demo/app/App.vue` → 0 next-tick in extraControlTabs chain |

---

## §4 — Findings

### F-W0-1 — CICD-7 "validated" verdict is a pre-J.W4 snapshot  [P2]

**What the spec said:** "the 20-minute wall-clock VALIDATION: the first
complete Linux run BINDS the real wall-clock" (`J.W0.md §S5`, `ci-cd.md §8`).

**What the impl recorded:** "the complete `demo-smoke` tail runs 19m13s against
the `timeout-minutes: 20` budget — VALID but with only ~47s headroom"
(`J.W0-impl.md §S5`).

**What happened after J.W0:** J.W4 (the axes battery) added the mobile-touch
and appearance-certification legs to `demo-smoke`, which pushed wall-clock past
the original 20-minute budget. J.W4-impl.md:126 records the explicit
measurement-first extension: "demo-smoke timeout re-sized 20→35m, measure-first
(the pre-W4 roster measured 19m13s, run 27310054675; + mobile battery + axes
legs + observe-only Lighthouse matrix)." Current `ci.yml:213` confirms
`timeout-minutes: 35`.

**Current state (WZ close-merge runs):** CI runs `27378354065` (22m32s) and
`27379624875` (23m34s) — both within 35m budget but well beyond the original
20m that the impl called "VALID." The CICD-7 discharge record in the impl is
accurate for its moment; the 35m budget has not been re-validated at the
K-era corpus load.

**Seam:** `ci.yml:213` (`timeout-minutes`), `J.W0-impl.md §CICD-7`.

**For K:** the K-era corpus will add further gates. The 35m budget may become
tight. The measure-first protocol should be re-applied before any K gate
additions push the wall-clock past 30m. No immediate fix needed; this is a
headroom watch, not a breakage.

---

### F-W0-2 — The hero CTA cold-path play defect is unexercised by J.W0's gates  [P0]

**The symptom (orchestrator triage, U-K2/U-K3, user-observed 2026-06-11):**
From the hero start screen, clicking the rainbow play button does NOT smoothly
transition to the cube animating — subjects freeze while the playhead/slider
advances.

**Root cause (traced to source, this audit):** The cold-path play flow is:

1. `onPlayStateChange(true)` in `useSceneMachineApp.ts:155` — detects home +
   empty group → sets `autoPlayNext.value = true` + calls `switchScene("cube")`
2. `switchScene` → `machine.dispatch({type:"NAVIGATE", to:"cube"})` → status
   becomes `"loading"` (`sceneMachine.ts:117`)
3. `<Suspense>` resolves on "cube" (cube and home share Suspense key `"cube"` so
   CubeScene is ALREADY mounted from initial load — no remount occurs)
4. `watch(sceneRef.animationGroup)` fires → `markSceneReady()` →
   `bindSceneAdapter()` (registers `createGroupAdapter`) → `machine.dispatch`
   `{type:"SCENE_READY"}` → snap is `freshSnapshot()` (started=false, playing=false)
   → SCENE_READY effect: `if (snap.started || snap.playing) adapter.restore(snap)` →
   FALSE → no-op
5. `markSceneReady` calls `machine.dispatch({type:"PLAY"})` → status
   `"paused"→"playing"` (changed=true) → `applyEffects PLAY`:
   `if (changed) adapter?.resume()`
6. `createGroupAdapter.resume()` (`scenePlaybackAdapters.ts:76-79`):
   `if (group.started && group.paused) group.resume()` — for a cold-path fresh
   cube group, `group.started = false` → **resume() is a NO-OP**.

The machine writes "playing" to its state and the slider advances (the machine's
snapshot has `playing: true`), but the actual `AnimationGroup` loop never starts.
No code path in the cold-path transition calls `group.play()` on a fresh group.

Additionally, `AnimationControlsGroup.vue:219-222` (the `onMounted` autoPlay
path) fires at INITIAL APP LOAD when home is shown — at that moment
`animationGroup` has zero animations, so the guard
`Object.keys(animationGroup.animations).length > 0` is false and the branch is
skipped. When the animationGroup prop later changes (home→cube), the
`watch(() => animationGroup)` at `:211-216` only calls `syncPlayState()` if
`group.started` — which is false for a cold group. Neither path calls
`group.play()`.

**The orchestrator's hypothesis ("J.W7c U4 conditional-select deletion may have
killed an auto-binding side-effect") is NOT confirmed.** U4 only changed the
SELECT rendering for single-animation scenes (static span vs dropdown); it does
not affect the group play path. The defect is in `createGroupAdapter.resume()`'s
guard, which is correct for RESUME semantics but wrong for the COLD-START case
where the group must be STARTED (not resumed).

**Why J.W0's gates miss it:** `proof:live-session` B1 (`scripts/proof-live-
session.mjs:380-413`) clicks rainbow play on home, then navigates via
`location.hash = "#/cube"` MANUALLY (`evaluate` call at :395) — it does NOT
drive the actual `autoPlayNext → switchScene("cube") → VT → CubeScene` path.
The `openControlsPanel + select + play` CHOREOGRAPHED path the orchestrator
describes (101 distinct transforms) uses a pre-seeded, manually-navigated
context where the group was already started or seeded by `openControlsPanel`.
The hero CTA cold path — click rainbow play on the start screen and land in a
smoothly-animating cube — is an unexercised axis in every J gate.

`proof:engine-no-throw-on-play` clause (c) at `:297-330` also uses
`location.hash = "#/cube"` (`evaluate` at :316), navigating directly and then
sampling the deterministic on-mount autoplay window (the cube's own
`useCubeAnimations` idle-rotation). This gate confirms the cube ROTATES when
navigated to, but the idle rotation is driven by the cube's own rAF composable
(`useIdleAnimation`), not the machine's PLAY dispatch. So the gate can be green
while the machine-dispatched cold-path play is silently broken.

**Seam:**
- `demo/@/components/custom/animation-controls/stores/scenePlaybackAdapters.ts:76-79`
  (`createGroupAdapter.resume()` — guard should also handle `!group.started`)
- `scripts/proof-live-session.mjs:390-413` (B1 gate — uses manual hash nav,
  not the VT-wrapped `switchScene` path)
- `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:219-223`
  (onMounted autoPlay fires on home, not on the subsequent group-prop change)

**For K:** This is a P0 defect the user observes at the very first interaction
with the live site. The fix has two components: (a) a product fix at the adapter
(`createGroupAdapter.resume()` should call `group.play()` when `!group.started`,
mirroring `toggleAnimationGroup`'s `!started` branch); (b) a gate fix —
`proof:live-session` B1 must exercise the ACTUAL cold path: click hero play,
assert the cube is smoothly animating WITHOUT a manual `location.hash` nav.

---

### F-W0-3 — S5 triage rounds span W0→W3 integration; the impl attribution is
accurate but the protocol scope conflates the wave boundary  [P2]

**Observation:** The spec defines S5 as "a PROTOCOL applied per gate AS it
surfaces" — but the four surface-layer rounds (#2 `af5b7e7`, #3 `890e2b7`,
#4 `3727382` for the easing-sidebar grammar evolution) include fixes that belong
to J.W2 and J.W3 scope (the ARIA defects are J.W2 product fixes;
`ControlsPaneWrapper` decomposition is J.W2; the easing-sidebar predicate
evolution is a J.W3 gate-harness fix). The W0 spec intended these as "J.W0
consumes the posture; J.W3 industrializes" but the impl executed them as W0-S5
rounds under the W0 commit trail.

**No correctness failure here:** every fix was correctly triaged (device-
independent → fixed, not silenced), and the W0 impl record documents them
honestly. The conflation is documentation altitude, not a delivery gap.

**Seam:** `J.W0-impl.md §S5 tail-triage ladder` vs `J.W2-impl.md`, `J.W3-impl.md`.

---

### F-W0-4 — CICD-7 budget headroom watch: K must re-measure before adding gates  [P2]

**Status (current tree):** The two most-recent CI runs (`27378354065` at 22m32s,
`27379624875` at 23m34s) are trending toward 24m+ with natural variance.
The 35m ceiling has ~10m headroom today, but K-planned gate additions (the
U-K-series axess battery, any new correctness gates) will eat into that.

**The spec says** "measure-first, then shard/share/cache" (`J.W0.md §S5`,
`ci-cd.md §8`). J.W3's `withPage`/`withBrowser` consolidation (the documented
headroom mechanism) was already applied. The next lever is either gate
parallelization or a per-gate Chrome re-use strategy.

**Seam:** `ci.yml:213`, `J.W3-impl.md`, `ci-cd.md §8`.

---

## §5 — §FOLD table

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| **F-W0-1** — CICD-7 "validated" closure is a pre-J.W4 point-in-time snapshot; 35m budget has not been re-validated at K corpus load; WZ runs at 22–23m leave ~10m headroom | P2 | `ci.yml:213`, `J.W0-impl.md §CICD-7`, `J.W4-impl.md:126` | K.WZ (close) or K.W0 if a new gate battery lands first |
| **F-W0-2** — Hero CTA cold-path play defect: subjects freeze while slider advances; `createGroupAdapter.resume()` is a no-op on fresh group; B1 gate uses manual hash-nav, not the VT-wrapped switchScene path; U-K2/U-K3 confirmed user-visible | P0 (product broken at first interaction) | `scenePlaybackAdapters.ts:76-79`, `proof-live-session.mjs:390-413`, `AnimationControlsGroup.vue:219-223` | K.W0 (LEADS the tranche — the cold-path P0 mirrors J.W0's gate-oracle born-RED shape; fix the adapter + add the born-RED hero-CTA gate before any other K wave) |
| **F-W0-3** — S5 triage round attribution conflates W0/W2/W3 scope in the impl record; no delivery failure | P2 (doc altitude) | `J.W0-impl.md §S5` vs `J.W2-impl.md`, `J.W3-impl.md` | K docs only; no wave needed |
| **F-W0-4** — CICD-7 budget headroom watch for K; 35m ceiling, K gate additions will reduce headroom | P2 | `ci.yml:213`, `ci-cd.md §8` | K.W0 or K (before adding major gate batteries) |

---

## §6 — Overall delivery verdict

J.W0 is **substantially delivered** against spec. Every named §Scope item (S1–
S5) landed; every §Hard gate clause (a)–(e) was discharged with observed
evidence; every §No-workaround prohibition was honored. The S5 triage protocol
was executed correctly under P6: five layers, zero escapes added, zero device-
independent gates silenced. The INVE-1 cure is genuine — the deploy round-trip
was observed twice via the auto arm, not asserted.

The P0 finding (F-W0-2) is not a J.W0 delivery failure — it is a pre-existing
unexercised-axis gap that J.W0's gate harness did not cover (the hero CTA cold
path was never in scope for J.W0, which addressed CI determinism and gate
migration). The gap surfaces now as a user-visible product defect (U-K2/U-K3)
and is the natural K.W0 leading charge: a cold-path born-RED gate + the adapter
fix, structured exactly as J.W0 structured the trigger-lag fix (fix the product
seam + add the gate that bites on the regression).

The P2 findings are documentation accuracy issues (line-number staleness,
CICD-7 headroom watch) with no correctness impact on the delivered gates.
