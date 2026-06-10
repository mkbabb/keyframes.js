# Tranche J Audit — tests-bench lane

**Date:** 2026-06-09  
**Branch:** master (post tranche-I merge a4b1472)  
**Lane:** test + bench estate

---

## State of the Fleet

| Metric | Value | Source |
|---|---|---|
| Test files (`test/*.test.ts`) | 69 | `ls test/*.test.ts \| wc -l` |
| Tests via `vitest list` | **685** | `npx vitest list 2>/dev/null \| wc -l` |
| Of which `it.fails` (born-RED witnesses) | 2 | `grep -rn "it\.fails" test/*.test.ts` |
| Passing per I docs (I.W4.md) | 683 | `docs/tranches/I/impl/I.W4.md:4` |
| Bench files (`bench/*.bench.ts`) | 8 | `ls bench/*.bench.ts \| wc -l` |
| Bench cases | ~25 | `grep -rn "^\s*bench(" bench/*.bench.ts \| wc -l` |
| Test lines total | 11,354 | `wc -l test/*.test.ts` |

The "683 pass + 2 expected-fail" from I docs is consistent with the `vitest list` count of 685 — `vitest list` includes `it.fails` entries.

---

## (a) Coverage vs Engine Surface

All `src/animation/` modules are reachable via imports in at least one test file. The only gap at the internal level:

| Module | Direct import count | Notes |
|---|---|---|
| `internal/binarySearch.ts` | **0** | Hot path — `binarySearchRange` is the O(log N) frame locator used by every `interpFrames` call; tested only transitively through higher-level animation tests |
| `playback.ts` (`RAFPlayback`) | 2 (`engine-modern-web.test.ts`, `sync-step.test.ts`) | Present but not the I.W1 bind-proof property specifically |
| `format.ts` | 5 | Adequate for round-trip; the I.W0 S2 var() case is absent (see §c) |
| `decay.ts` | 2 (`drag.test.ts`, `orbital-inertia-parity.test.ts`) | Adequate direct coverage |
| `group.ts` | 13 | Heavy coverage; NOOP_TRANSFORM fix is only covered by the diagnostic `iw0-cube-composite.test.ts` |

The periphery modules added in Tranches F–I all have direct test files:
`adapter-capture.test.ts`, `animate.test.ts`, `draw-svg.test.ts`, `drag.test.ts`, `flip.test.ts`, `motion-path.test.ts`, `sequence.test.ts`, `spring.test.ts`, `stagger.test.ts`.

---

## (b) Tranche I Engine Changes — Unit Test Pyramid

| I Change | Unit test? | Browser gate only? |
|---|---|---|
| **I.W0 S1** — value.js empty-input contract (B1) | value.js unit test (separate repo); `w0-crashes.test.ts:69` covers the typed-error wrap | `proof:engine-no-throw-on-play` |
| **I.W0 S2** — serialize-from-template (CSSKeyframesToString reads `templateFrames` not `at()`) | **NO unit test for var()/matrix3d() verbatim round-trip** — fixture corpus (`test/fixtures/keyframes/`) has no `var()` or `matrix3d()` fixture; `roundtrip-fidelity.test.ts` + `roundtrip-easing.test.ts` don't cover this path | `proof:engine-no-throw-on-play` |
| **I.W0 S3** — `NOOP_TRANSFORM` + lazy resolution + empty-group short-circuit (B5) | `iw0-cube-composite.test.ts` — DIAGNOSTIC only (see §c); no unit test for the "transform is not a function" crash path | `proof:engine-no-throw-on-play` |
| **I.W1** — bind-proof `RAFPlayback` (arrow class fields) | **NO unit test** — no test destructures `playback.stop` or passes it as a callback to verify bind-safety; `sync-step.test.ts` tests the sync-step path, not the bind contract | `proof:fsm-suspend-resume-live` |
| **I.W2** — EasingEditor single authority | Covered by `control-surface-dfa.test.ts`, `scene-machine-reducer.test.ts` | `proof:easing-editor-live` |

The pyramid is inverted for I.W0 S2 and I.W1: the ONLY oracle is a browser gate that takes minutes to run. A regression would not be caught by `npm test`.

---

## (c) Test Quality

### `iw0-cube-composite.test.ts` — diagnostic masquerading as a unit test

`test/iw0-cube-composite.test.ts:11–45` asserts `seen.size >= 3` (at least 3 distinct transform strings written to a DOM element). The assertion is valid (jsdom does honour `style.setProperty("transform", ...)`), but:

1. The test has a bare `console.log("[iw0] distinct target transforms:", ...)` on line 43 that fires on EVERY run — this is architectural noise in a CI suite.
2. The assertion (`>= 3`) is far weaker than what the fix requires. The specific regression is "transform is not a function" TypeError; the test only proves the composite produced *some* output, not that the NOOP_TRANSFORM lazy resolution specifically works. A different rendering path could pass this while the actual fix is absent.
3. The test name `I.W0 cube group composite` signals a diagnostic, not a contract — it was authored as a live diagnostic at commit `107236d` and was never hardened.

### `d3-changed-keys.measure.test.ts` — measurement artifact in the live test run

`test/d3-changed-keys.measure.test.ts:48–51` intentionally calls `console.log` for a measurement artifact. The test is included in `test/*.ts` and runs in every `npm test`. It does have a real assertion (fraction < 0.5) and is documented as a D.W4 WITHHOLD measurement. The noise is low but architecturally it belongs in `bench/` with the other measurement shapes, not in the passing test gate.

### `it.fails` witnesses — correct and documented

Both `it.fails` cases (`group-snapshot-identity.test.ts:75`, `interpolate-anything.test.ts:256`) are born-RED handoffs with documented positive controls. They are NOT perpetual punts (inv-27): each has an explicit flip-RED mechanism and a positive control that bites on stale deletion. No remediation needed.

### No `.skip` or `.todo` residue

`grep -rn "\.skip\b\|\.todo\b" test/*.test.ts` returns nothing. Clean.

### No tautological assertions found

Reviewed `d3-changed-keys.measure.test.ts`, `iw0-cube-composite.test.ts`, and `performance.test.ts`. The assertions are meaningful (fraction bounds, size thresholds, timing budgets). Not tautological.

---

## (d) Bench — Runability + Wiring

| Bench file | Requires browser? | Self-skip guard? | Wired in CI? |
|---|---|---|---|
| `compile.bench.ts` | No | n/a | `npm run bench` |
| `interp-buffer.bench.ts` | No | n/a | `npm run bench` |
| `interpolation.bench.ts` | No | n/a | `npm run bench` |
| `parser.bench.ts` | No | n/a | `npm run bench` |
| `spring-tick.bench.ts` | No | n/a | `npm run bench` |
| `sync-step.bench.ts` | No | n/a | `npm run bench` |
| `playwright.bench.ts` (LoAF gate) | Yes (`KF_PLAYWRIGHT_DIR`) | YES — skips locally, `KF_REQUIRE_BROWSER=1` hard-fails in CI | CI `gates` job |
| `computed-real-dom.bench.ts` | Yes (`KF_PLAYWRIGHT_DIR`) | YES — same convention | CI `gates` job |

Playwright is NOT installed in `node_modules` (`@playwright/` dir is empty); `node_modules/.bin/playwright` absent. The `KF_PLAYWRIGHT_DIR` convention resolves from a sibling repo or CI install. The self-skip guards are correct. The bench tier is runnable headlessly (`npm run bench`) with the six non-browser benches; the two browser benches skip gracefully.

The bench config in `vitest.config.ts:28` (`benchmark: { include: ["bench/*.bench.ts"] }`) has no explicit `environment` — it inherits `jsdom` from the `test` config. The browser benches self-skip under jsdom via the chromium-resolution guard.

---

## (e) Test Count — "683" Claim Verification

The I-era docs claim "683 tests pass" at I.W4.md:4, I.W0.md:4, I.W1.md:3, and I-WZ-verify.md:279. This is consistent with the current `vitest list` output of **685**: `vitest list` includes `it.fails` tests in its listing, and `683 + 2 = 685`. There is **no discrepancy**; the counts describe the same estate.

CLAUDE.md claims **15 files / 261 tests** (`CLAUDE.md:63`). Actual: **69 files / 685 tests**. The CLAUDE.md test tree section is severely stale — it also references deleted files (`editor-parsing.test.ts`, `parsing.test.ts`, `units.test.ts`, confirmed deleted in commit `58e7576`) and undercounts bench files (claims 3, actual 8). This is a P1 documentation debt.

---

## Findings Summary

| ID | Sev | Title | Evidence | Disposition |
|---|---|---|---|---|
| TB-1 | P1 | I.W0 S2 serialize-from-template has NO unit test | No `var()` fixture; no test calls `CSSKeyframesToString` on a `var()`-containing animation and asserts verbatim round-trip | FOLD |
| TB-2 | P1 | I.W1 bind-proof RAFPlayback has NO unit test | No test destructures `{stop}=playback` or passes control methods as callbacks; gate is live-only | FOLD |
| TB-3 | P1 | `internal/binarySearch.ts` has zero direct tests | `binarySearchRange` is the O(log N) hot path used by every `interpFrames` call; edge cases (empty array, single element, exact boundary) are untested directly | FOLD |
| TB-4 | P1 | CLAUDE.md test tree is severely stale (15 files / 261 tests) | `CLAUDE.md:63` vs actual 69 files / 685 tests; lists 3 deleted files | FOLD |
| TB-5 | P2 | `iw0-cube-composite.test.ts` is a diagnostic with a bare `console.log` | `test/iw0-cube-composite.test.ts:43`; the NOOP_TRANSFORM crash regression is not assertable from its `>= 3` check | FOLD |
| TB-6 | P2 | `d3-changed-keys.measure.test.ts` runs in `npm test` with a `console.log` | `test/d3-changed-keys.measure.test.ts:48`; a measurement artifact belongs in `bench/` or behind a `MEASURE=1` flag | FOLD |
| TB-7 | BOOK | Two born-RED `it.fails` witnesses are properly documented | `group-snapshot-identity.test.ts:75`, `interpolate-anything.test.ts:256`; each has a positive control and a documented flip trigger | RECORD |
