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
| 0 | **Q.W0** | NOW | 🟡 IN PROGRESS | `proof:record-truth` | record-hygiene + decision-JSON commit + CHRONIC substrate (already authored) |
| 1 | **Q.WA1** | NOW | ⬜ PENDING | `proof:lint-clean` | SLIM dep-cruiser lint tier (eslint KILLED) |
| 2 | **Q.WA2** | NOW | ⬜ PENDING | `proof:drag2d-light-certified` | drag2D LIGHT certification (NO-OP confirm; retire proof:control-point-live) |
| 3 | **Q.WA3** | NOW | ⬜ PENDING | `proof:ci-coverage`+`proof:deploy-roundtrip`+`proof:published-on-master` | **MASTER-MERGE the FIRST motion** + CI-green + deploy oracle + device-harden + decision-JSON deterministic-write |
| 4 | **Q.WA4** | NOW | ⬜ PENDING | `proof:wave-charter` | wave-charter contrivance gate + DAG manifest parse + pin-ledger witness |
| 5 | **Q.WG1** | DISPATCH | ⬜ PENDING | `proof:perf`+`proof:no-dead-combinator` | **parse-that 0.13.0** — dead-API delete, packrat re-entrancy, *Span decide → PUBLISH |
| 6 | **Q.WG2** | DISPATCH | ⬜ PENDING | (value.js-side) | **value.js 1.1.1 + 1.2.0** — contrast-color, if-multibranch, color out-params, .fnName, /math, dashed-call → PUBLISH |
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

## Resume pointer

**NEXT:** Q.W0 (in progress) → Q.WA1 → Q.WA2 → Q.WA3 (master-merge) → Q.WA4 → cross-repo spine.
