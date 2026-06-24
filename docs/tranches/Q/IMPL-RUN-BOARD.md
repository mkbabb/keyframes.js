# Tranche Q — IMPL-RUN-BOARD (the resumable drive state)

**Branch:** `tranche-q-impl` (cut from `tranche-p-dev` @ 42f661a — carries the Q docs + the 4.4.0 impl-drive tip).
**Drive opened:** 2026-06-23 (owner authorization — the full constellation impl drive; publish + deploy authorized).
**Resume contract:** read this board → find the first row NOT `✅ DONE` in DAG order → continue. The cron
`4890f187` (fires on idle) re-invokes the drive against this board. Every wave: born-RED gate FIRST → cure → GREEN.

**DAG source of record:** `docs/tranches/Q/DAG.md` (machine-readable, Kahn-validated). Topological order below.

---

## Phase ledger (DAG topological order — the spine)

| # | Wave | Phase | State | Gate(s) | Notes |
|---|---|---|---|---|---|
| 0 | **Q.W0** | NOW | ✅ DONE | `proof:record-truth` ✅ | record-hygiene + decision-JSON commit + CHRONIC substrate; gate GREEN (6 clauses) |
| 1 | **Q.WA1** | NOW | ✅ DONE | `proof:lint-clean` ✅ | SLIM dep-cruiser lint tier (eslint KILLED; 11-cycle blessed baseline; boundary rules zero-debt) |
| 2 | **Q.WA2** | NOW | ✅ DONE | `proof:drag2d-light-certified` ✅ | drag2D LIGHT cert + proof:control-point-live RETIRED (all refs) |
| 3 | **Q.WA3** | NOW | ✅ DONE | `proof:ci-coverage`✅+`proof:deploy-roundtrip`✅+`proof:published-on-master`✅ | MASTER-MERGE ✅ + CI-green (6-gate wire + F-7 + report-all hygiene) + deploy oracle + decision-JSON determinism. **Band A committed ac40f72** |
| 4 | **Q.WA4** | NOW | ✅ DONE | `proof:wave-charter` ✅ + `proof:pin-ledger-current` ✅ | wave-charter (DAG Kahn + no-unpublished-consume + 7Q) + pin-ledger (registry leg env-gated) |
| 5 | **Q.WG1** | DISPATCH | ✅ DONE | `proof:perf`+`proof:no-dead-combinator` | **parse-that 0.13.0 PUBLISHED** (registry-confirmed, tagged v0.13.0, pushed). 115 tests, 10/10 gates GREEN. *Span→DEPRECATE, subTable→RETRACT. commit 2c806fb |
| 6 | **Q.WG2** | DISPATCH | ✅ DONE | (value.js-side) | **value.js 1.2.0 PUBLISHED** (registry-confirmed, cumulative — contains 1.1.1 contrast-color; tags v1.1.1+v1.2.0, pushed). 1934 tests, 12 gates GREEN. VJ-Q1…Q9 done incl. ColorChannelPlan (5.1× fold), .fnName (S8 terminal), /math, dashed-call, if-multibranch. commit e80b359. ⚠️ **VJ-Q9 changed color serialization** (display-p3(…)→color(display-p3 …)) — WATCH the kf consume edge at re-pin (Stage 5) |
| 7 | **Q.WB1** | NOW | ⬜ PENDING | `proof:emerging-css-resolve-P2` | emerging-CSS Phase-2 element-aware arm |
| 8 | **Q.WB3-numeric** | NOW | ⬜ PENDING | `proof:processframe-soa` | SoA processFrame Float64 numeric fold |
| 9 | **Q.WB4** | NOW | ⬜ PENDING | `proof:waapi-adaptive-densify` | WAAPI curvature-adaptive densify |
| 10 | **Q.WC1** | NOW | ⬜ PENDING | `proof:demo-control-point` | **DemoControlPoint** (DM-2 9th-carry terminal) |
| 11 | **Q.WC2** | NOW | ⬜ PENDING | `proof:easing-curve-editor` | easing curve-editor dogfoods DemoControlPoint |
| 12 | **Q.WC3** | NOW | ⬜ PENDING | `proof:live-session-mobile`/`proof:scene-switcher-mobile` | N-Stage + mobile scroll-snap carousel + typed VT |
| 13 | **Q.WC4** | NOW | ⬜ PENDING | `proof:morph-orients` | MorphSVG demo scene + on-DOM render contract |
| 14 | **Q.WC5** | NOW | ⬜ PENDING | `proof:amiga-decay-visible` | amiga telemetry (decay made visible) |
| 15 | **Q.WD1-bind** | NOW | ⬜ PENDING | (interlock of proof:nan-frame) | attach-time deferred-resolution seam |
| 16 | **Q.WD1** | NOW | ⬜ PENDING | `proof:nan-frame` | NaN-frame play-time guard (NEVER a parse-throw) |
| 17 | **Q.WD2** | NOW | ⬜ PENDING | `proof:grammar-fuzz`+`proof:kf-differential` | grammar-fuzz + differential-vs-browser oracle |
| 18 | **Q.WE1** | NOW | ⬜ PENDING | `proof:alias-dropped`+`proof:changelog-5.0.0` | @deprecated alias DROP + ~33-consumer migration + MIGRATION-5.0.0.md |
| 19 | **Q.WF2** | NOW | ⬜ PENDING | `proof:decomposition`(+blend) | group.ts SoA decomposition → group-soa.ts |
| 20 | **Q.WF1** | NOW | ⬜ PENDING | `proof:decomposition` | engine.ts 1397→~900 → engine-playback.ts (clean post-alias class) |
| 21 | **Q.WG-S1S2-HYGIENE** | NOW | ⬜ PENDING | `proof:workaround-deletion`(S1/S2 content-probe) | retarget false-RED S1/S2 to content-probes |
| 22 | **Q.WG3** | USER-DOMAIN | ⛔ PENDING (owner) | (glass-ui-side) | glass-ui BC publish — NOT executed (live owner WIP on prototype/liquid-dock); kf consume stays GATED |
| 23 | **Q.WG-GATED-CONSUMES** | GATED | ⬜ PENDING | (re-pin orchestrator) | re-pin value.js ^1.2.0 → fire the consume set |
| 24 | **Q.WG4 / Q.WB2 / Q.WB3-color / Q.WE2** | GATED | ⬜ PENDING | `proof:emerging-css-resolve-fn`,`proof:color-soa`,`proof:no-cross-realm-cast` | @function inline + ColorChannelPlan SoA + leaves externalize + S8 .fnName consume |
| 25 | **Q.WC3-NSTAGE-UNSHELF** | GATED | ⬜ DEFERRED (glass-ui BC) | (arch decision) | N-Stage unshelf — gated on glass-ui BC (USER-DOMAIN); NOW layer ships without it |
| 26 | **Q.WZ** | NOW-author·USER-DOMAIN publish | ⬜ PENDING | `proof:chronic-closure` | 5.0.0 breaking cut + 5.1.x additive + ledger terminate + deploy round-trip |

**Legend:** ✅ DONE · 🟡 IN PROGRESS · ⬜ PENDING · ⛔ blocked-on-owner (USER-DOMAIN, not auto-executed).

---

## USER-DOMAIN / blocked rows (the owner's hand — NOT auto-executed)

- **Q.WG3 glass-ui BC** — glass-ui is on `prototype/liquid-dock` @ 4.1.0 with **heavy live uncommitted WIP**
  (AppShell/BottomDock/SidebarDock). inv-16 + active-work respect: I do NOT edit glass-ui. The kf-side
  consumes (S1/S2 deletes, N-Stage unshelf) stay GATED-PENDING per plan. Surfaced to owner at close.
- **The npm publishes** (parse-that 0.13.0, value.js 1.1.1/1.2.0, kf 5.0.0/5.1.x) — owner authorized
  ("publish, push, and pull whatever items you need") → executed by the drive, each AFTER its repo's green CI.

---

## Decisions / deviations log

- (Q.W0) decision-JSON churn is benign (verdict stable ADOPT; noisy ratios). Committed in W0; root-cause
  (gates rewriting on every run) fixed deterministically in Q.WA3 CI-harden.
- (Q.WG3) glass-ui publish held USER-DOMAIN — see above.

## In-flight (background tasks)

- **WC4 MorphSVG** `ae6f1409…` (kf tree) — the deferred Band-C wave: the on-DOM render contract O.W6 left
  vapor + the MorphSVGScene + orient-along-path. Touches engine.ts+morph-svg.ts+scenes.ts → runs ALONE
  (Stage 4 must wait — it also touches engine.ts). Returns gate entries for central wiring.

**DONE:** Band A (ac40f72) · parse-that 0.13.0 PUBLISHED (2c806fb/v0.13.0) · value.js 1.2.0 PUBLISHED
(e80b359/v1.2.0, cumulative) · **Stage 3 Band B/C/D committed (090c7b0)** — engine-perf (WB1/WB3-num/WB4) +
demo-fleet (WC1-3,WC5) + correctness (WD1/WD2); **DM-2 ninth-carry GENUINELY EXITS** (browser-verified
pointer-drag); 940 tests, ci-coverage GREEN.

**Stage-3 rate-limit recovery (recorded):** the demo-main lane hit a 529 wall mid-verification; a demo-finish
agent verified+completed WC1-3,WC5 in-browser (SwiftShader WebGL fix for amiga). Lesson: a workflow lane can
die on a transient 529 — its work survives on disk; re-launch a finish agent rather than re-run from scratch.

**LIVENESS NOTE:** judge background-agent progress by GIT STATE (commits/uncommitted files), NOT the
transcript output-mtime (it buffers — a 17-min gap was a false "stuck" alarm; the agent had committed + moved on).

## Stage-3 contention map (the file-disjoint lane partition — engine.ts is the bottleneck)

`src/animation/engine.ts` is touched by **WB1, WB3-numeric, WC4, WD1, WE1, WF1** → these CANNOT run
parallel on it. Demo registry files `demo/app/scenes.ts` (WC3/WC4/WC5) + `demo/easing/EasingSidebar.vue`
(WC1/WC2/WC5) force demo coordination. **Safely parallel:** WB4 (waapi.ts+springLinearStops.ts), WD2
(test/grammar-fuzz). **Stage-3 plan:** 1 engine-core-NOW owner lane (WB1+WB3-numeric+WD1-bind+WD1, sequential
in engine.ts) ∥ WB4 ∥ WD2 ∥ a demo owner (WC1→WC2 pipeline; WC3; WC4 after engine settles; WC5) — demo/ tree
disjoint from src/ tree so the demo workflow runs concurrent with the engine one.

## Resume pointer

**NEXT (on WC4 completion):** wire WC4 gate entries → verify → commit WC4 (completes Band C). Then **Stage 4 —
the breaking-cut spine**: Q.WE1 (@deprecated alias DROP + ~33-consumer migration + MIGRATION-5.0.0.md +
proof:alias-dropped/changelog-5.0.0 gate-first) → Q.WF2 (group.ts SoA decomposition → group-soa.ts,
proof:decomposition baseline) → Q.WF1 (engine.ts 1397→~900 split → engine-playback.ts, a CLEAN post-alias
class). All NOW/kf-internal, sequential (engine.ts spine). Then Stage 5 (re-pin value.js ^1.2.0 → fire the
GATED consumes: Q.WB2 @function, Q.WB3-color ColorChannelPlan, Q.WE2 leaves, S8 .fnName; ⚠️ watch the VJ-Q9
serialization change at re-pin) + Q.WG-S1S2-HYGIENE. Then Stage 6 (Q.WZ: 5.0.0/5.1.x cut + chronic-ledger
terminate + deploy round-trip).
