# H.W3 IMPLEMENT — VERIFY LANE (builds · tests · gates · regression)

**Branch:** `tranche-h-impl` · **Phase:** IMPL · **Lane:** VERIFY (run builds/tests, integrate
obvious lane seams). **NOT committed** — edits left in tree.

The S3/S1/S2/S3b/S4 transposition + the three gate-author lanes
(`proof:timeline-rail-width`, `proof:demo-shell-grid`, `proof:stage-not-clipped`) landed under
the cohesive-owner pass (`impl-w3-changes.md`, `impl-w3-impl.md`, `impl-w3-gate-*.md`). This
lane VERIFIES the whole and integrates ONE lane seam (the `proof:single-column-pack` gate —
named in the contract / charter / PROGRESS as one of THREE born-RED §Hard-gate gates, but
left UN-AUTHORED by every gate lane; see §Seam below).

---

## §Result table (verbatim measurements)

| # | step | command | result |
|---|------|---------|--------|
| 1 | tsc | `npx tsc --noEmit` | **0** (clean — re-confirmed after the gate + package.json + ci.yml edits) |
| 2 | unit tests | `npm test -- --run` | **GREEN** — 66 files, **666 passed \| 2 expected-fail** (668). `e-w1-encapsulation` (3) + `boundary-cohesion` (7) GREEN — NO size-ceiling shift (the test set references NO W3-touched demo file; the layout change did not legitimately move a tracked file size) |
| 3 | demo build | `npm run gh-pages` | **0** (`✓ built in ~1.2s`; warnings = pre-existing rolldown/vueuse `#__PURE__` + chunk-size noise, not W3) |
| 4a | `proof:single-column-pack` | `KF_REQUIRE_BROWSER=1` | **GREEN** — 8 visible leaf rows, ONE left edge x=76, ONE width 306px (Δ=0); ≥6 non-vacuity guard met (**AUTHORED THIS LANE** — see §Seam) |
| 4b | `proof:timeline-rail-width` | `KF_REQUIRE_BROWSER=1` | **GREEN** — border-box 400=400=400; root 388=388 in-budget (768 cap dead); **mobile-ribbon-full-bleed** companion GREEN (296 content / 252 ribbon at 390, no desktop-cap leak) |
| 4c | `proof:demo-shell-grid` | `KF_REQUIRE_BROWSER=1` | **GREEN** — no-legacy grep clean (6 files); dead-token grep clean (197 files, `--controls-pane-width` gone tree-wide); columns `[rail] 400px [stage] 1fr`; rows `[top] auto [stage] 1fr [bottom] auto` |
| 4d | `proof:stage-not-clipped` | `KF_REQUIRE_BROWSER=1` | **GREEN** — 4/4 cases (1280 & 1440 × open & closed) the stage subject fully within the viewport; **the cube is NOT clipped** (S4 ships the stronger `[stage]`-track form, no `col-end-4` fallback) |
| 5 | `proof:ci-coverage` | `npm run proof:ci-coverage` | **GREEN** — all **47** `proof:*` gates invoked in CI (4 recorded exclusions); the new `proof:single-column-pack` is covered |
| 6a | `proof:demo-console-clean` (W0) | `KF_REQUIRE_BROWSER=1` | **GREEN — NO regression** — 5/5 (no H-A1 serializeEasing throw on /#/amiga, /#/easing) |
| 6b | `proof:scene-machine-irrefragable` (W1) | `KF_REQUIRE_BROWSER=1` | **GREEN — NO regression** — no-route-storm (0 navs / 4 driven frames), 6/6 A→B→A matrix identity cells, scene-contract-identity, deep-link-wins, no-timing-heuristic all GREEN |
| 7 | `proof:idioms` | `npm run proof:idioms` | **GREEN** — incl. `[scene-refork]` confirming scenes consume `--rail-width` (the S3 rename honored); the gate's `--controls-pane-width → --rail-width` self-edit is the W3 propagation |

**Mobile/grep gates confirmed:** `proof:single-column-pack`, `proof:timeline-rail-width`
(carries `proof:mobile-ribbon-full-bleed` as clause 2), `proof:demo-shell-grid`,
`proof:stage-not-clipped` — all GREEN. `proof:mobile-ribbon-full-bleed` is a clause of
`proof:timeline-rail-width` (not a standalone script — correct, it shares the serveDist run).

---

## §Seam INTEGRATED — `proof:single-column-pack` was named everywhere, authored nowhere

**Diagnosis (not papered over).** The contract (`H.W3.md:41`), charter (`H.md:396`), and
`PROGRESS.md:112` all name THREE born-RED §Hard-gate gates: `proof:single-column-pack` +
`proof:timeline-rail-width` + `proof:demo-shell-grid`. The impl lane MEASURED
`proof:single-column-pack` by hand (`impl-w3-impl.md:28-36` — PASS, left-edge {76}, width 306,
8 visible) but **never authored a runnable script nor wired it** — it fell between the gate
lanes: `impl-w3-gate-shell-grid.md:53` ("the third gate, `proof:single-column-pack`, … is OTHER
lanes' — I did not touch them"); `impl-w3-gate-rail-width.md` scoped itself to the width
binding only. Neither claimed it. So a binding §Hard-gate gate had no `.mjs`, no `package.json`
entry, no CI step. A RED-that-should-be-GREEN: the gate did not exist, so it could neither
witness the SHIP nor catch a regression.

**Fix (this lane).** Authored `scripts/proof-single-column-pack.mjs` faithful to the contract
(`H.W3.md:41`) + the impl lane's measured spec (WV-W3-MED-2): measure the LEAF rows
`.controls-content .labeled-field` (NOT `CardContent.children` — vacuous), filter to VISIBLE
real-area rows (inactive 0fr-collapsed crossfade panels excluded), PIN `#/cube`, `fieldCount>=6`
non-vacuity guard, assert ONE left edge + width Δ≤2px. Settle-gated on the H.W1 FSM resting
(in-page hash nav, viewport re-asserted post-navigate, pane open, named grid resolved) — the
same plumbing as `proof-stage-not-clipped.mjs`. Wired into `package.json` (named script +
`proof:all` chain, beside `proof:single-toggle`) and `.github/workflows/ci.yml` (a new step with
`KF_REQUIRE_BROWSER: "1"`, beside the other W3 browser gates). `proof:ci-coverage` re-greens
(47 gates, the new one covered).

**Proof it BITES (born-RED-today / GREEN-on-fix — the contract's "stash one fix, gate reds,
restore"):**

| tree | left edges | width spread | exit |
|------|-----------|--------------|------|
| **pre-W3** (the two-track `grid-cols-[auto_1fr]` + subgrid chain) — reverted the 7 W3 scope files to `HEAD` (256f6fe), rebuilt `dist/gh-pages` | **{76, 306}** (size 2) | min=218 max=460 (**Δ=242px**) | **1 (RED)** |
| **W3** (the transposition restored byte-identically from the saved 498-line patch, rebuilt) | **{76}** (size 1) | min=306 max=306 (**Δ=0px**) | **0 (GREEN)** |

The pre-W3 spread (`{76, 306}` / Δ=242) matches the lane's documented `{76, 300}` / Δ=254
within sub-pixel render variance. The restore is byte-identical (the post-restore scope diff is
498 lines = the saved patch line count). Greens ONLY after the two-track grid + subgrid chain
collapse to the single-column stacked flow.

---

## §Notes

- The `proof:idioms` script edit in the tree (`--controls-pane-width → --rail-width` in clause
  8) is the impl lane's correct propagation of the S3 global rename into the idioms gate — it is
  GREEN, and `[scene-refork]` now asserts scenes consume `--rail-width`.
- `translateX(-110%)` survives ONLY in a `ControlsPaneWrapper.vue:167` COMMENT documenting the
  deletion (WV-W3-HIGH-2 satisfied — the overlay slide IS deleted; the [rail]-track collapse is
  the open/close axis). `max-w-screen-md` survives NOWHERE in source (the 768 cap is dead);
  residual hits are only in stale `demo/app/dist/` build artifacts + an unrelated
  `--header-max-width` token.
- `playwright-core` + `@playwright/test` + chromium are resolvable in-repo; gates ran with the
  default `KF_PLAYWRIGHT_DIR=REPO`. CI installs `@playwright/test` `--no-save` + chromium in the
  demo-gate job (matches the lib's 2-runtime-dep posture).

**Verdict.** H.W3 is VERIFIED GREEN across tsc / tests / build / the four §Hard-gate gates /
ci-coverage, with W0 + W1 regressions confirmed clean. The one RED-that-should-be-GREEN (the
un-authored `proof:single-column-pack`) is diagnosed and integrated, and proven to bite.
