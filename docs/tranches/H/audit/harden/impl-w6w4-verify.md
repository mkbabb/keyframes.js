# H.W6→H.W4 IMPLEMENT — VERIFY LANE (builds · tests · gh-pages · gates · regression · BITE)

**Branch:** `tranche-h-impl` · **Phase:** IMPL · **Lane:** VERIFY (run builds/tests; integrate
only obvious lane seams). **NOT committed** — all edits left in tree.

The two waves landed in ONE shared-file lane per the W6→W4 hard partition (W6 FIRST on
`EditorStartScreen.vue` — deletes the dot-fade ellipsis node; W4 then sizes the survivor):
the W6 source (`impl-w6w4-w6.md`), the W4 source (`impl-w6w4-w4.md`), the W6 gates
(`impl-w6w4-w6-gates.md`), the W4 easing/hero gates (`impl-w6w4-w4-gates.md`), and the
φ/icon gates (`impl-w6w4-gates-phi-icon.md`). This lane VERIFIES the whole.

No lane seam needed integration — every gate the contracts name (`proof:typing-dots`,
`proof:dogfood-hero` + the folded cascade lint, `proof:easing-canvas-bounded`,
`proof:hero-rung`, `proof:hero-balance`, `proof:hero-cls`, `proof:phi-leaf-zero`,
`proof:icon-idiom`) is authored, wired into `package.json` + `ci.yml`, and GREEN.

---

## §Result table (verbatim measurements)

| # | step | command | result |
|---|------|---------|--------|
| 1 | tsc | `npx tsc --noEmit` | **0** (clean — re-confirmed twice: after the landed tree, and again after the two BITE restores + the final gh-pages rebuild) |
| 2 | unit tests | `npm test` / `npm test -- --run` | **GREEN** — 66 files, **666 passed \| 2 expected-fail** (668). Exit **0**. No size-ceiling test in the suite references a W6/W4-touched file (W6/W4 touched only `demo/` + `scripts/` + `package.json`/`ci.yml`, NOT `src/`); `boundary-cohesion.test.ts` is the nearest cohesion lock and is GREEN. **NO size-ceiling test needed updating** — no wave legitimately shifted a tracked source-size the suite asserts. |
| 3 | demo build | `npm run gh-pages` | **0** — `✓ built in 1.22s`. Only PRE-EXISTING warnings: the vueuse `/* #__PURE__ */` INVALID_ANNOTATION noise + the monaco/three chunk-size >500kB notices. One NEW (benign) `INEFFECTIVE_DYNAMIC_IMPORT` line now lists `TypingDots.vue` among the static importers of `@src/animation/engine` — that is EXACTLY the inv-ζ dogfood seam (TypingDots imports the kf engine class), expected + harmless. Built CSS verified to carry the icon `@utility` family with the SVG cascade (`.icon-{xs,sm,md,lg},.icon-N svg{…}`). |

### New gates (the W6/W4 §Hard-gate set) — all GREEN, browser gates under `KF_REQUIRE_BROWSER=1`

| gate | env | result | key verbatim measurements |
|---|---|---|---|
| `proof:typing-dots` | `KF_REQUIRE_BROWSER=1` | **PASS** (9/9) | (a) 3 distinct `.typing-dot` spans · (c) min opacity **0.200 ≥ 0.15**, peak 1.000, amplitude 0.800 · (b) rise-onsets **407/573/732ms** (+167/+158, strictly increasing ≥60ms) · (d) dot-0 period **1217ms ≤ 1600ms** · (e) cascade: AnimatedText 1 shorthand, no `.dot-fade`/`@keyframes dotFade` legacy, TypingDots 0 CSS animation shorthand, every dot resolves a single `animation-name: none` |
| `proof:dogfood-hero` | static | **PASS** (2/2) | TypingDots imports `CSSKeyframesAnimation` from `@src/animation/engine` (the inv-ζ kf-engine class); `steppedEase` resolves from `@mkbabb/value.js` (the CURVE, not the dogfood symbol) |
| `proof:easing-canvas-bounded` | `KF_REQUIRE_BROWSER=1` | **PASS** (5/5) | `.easing-editor` containerType **inline-size** (was `normal`) · canvas÷panel **0.391 ≤ 0.55** (was 0.77) · `aspect-ratio: 1/1` · header→canvas gap **12.0px ≥ 8px** · block-size **160px ≤ 280px** (was 680px) |
| `proof:hero-rung` | `KF_REQUIRE_BROWSER=1` | **PASS** (6/6) | source + resolved `<h1>` carries `text-display-mega`, NOT `text-display-4`, no leaf-tail rung · font-size **177.4px ≥ 140px @1440×900** |
| `proof:hero-balance` | `KF_REQUIRE_BROWSER=1` | **PASS** (5/5) | `display:block`, `grid-template-rows: none` (orphan-grid mechanism gone) at 1440 + 390 · title balances 1 line @1440 / 2 lines @390 · TypingDots band overlaps last title word **+157px** (inline-adjacent, no orphan row) |
| `proof:hero-cls` | `KF_REQUIRE_BROWSER=1` | **PASS** (2/2) | hero-attributed steady-state CLS **0.00000 ≤ 0.02** at the 177px mega rung · positioned ancestor `position:absolute` + 0px in-flow height (overlay non-displacement) |
| `proof:phi-leaf-zero` | static | **PASS** (3/3) | **0** raw `text-(xs..8xl)` rungs · **0** bare numeric font-size (SVG `.axis-label` L4 excluded) · hero on `text-display-mega` (top φ rung). BOTH M1 halves load-bearing |
| `proof:icon-idiom` | static | **PASS** (4/4) | **62** `icon-*` refs (xs×3/sm×34/md×13/lg×12) all resolve to the `@utility` family · strictly increasing (3.5<4<5<6) · wrapper callsite (`TimingFunctionPanel.vue:41 CopyButton.icon-md`) + direct glyph (`KeyframeTimeline.vue:96 X.icon-xs`) both resolve through the `& svg` cascade |
| `proof:ci-coverage` | static | **PASS** (4/4) | all **61** `proof:*` gates invoked in CI (4 recorded exclusions); version-literal + registry-glass-ui + concurrency hygiene green |

### Regression — the four named pre-existing gates STILL GREEN (no W6/W4 regression)

| gate | env | result |
|---|---|---|
| `proof:demo-console-clean` | `KF_REQUIRE_BROWSER=1` | **PASS** (5/5) — the H-A1 serializeEasing crash stays dead on `/#/amiga` + `/#/easing` |
| `proof:scene-machine-irrefragable` | `KF_REQUIRE_BROWSER=1` | **PASS** (all) — no route storm, 6/6 ordered A→B→A identity-preserving, suspend no orphan rAF, deep-link wins, deterministic restore |
| `proof:demo-shell-grid` | `KF_REQUIRE_BROWSER=1` | **PASS** (4/4) — one named `[rail] 400px [stage] 1fr` grid, one `--rail-width` token, no two-track/subgrid/col-span legacy, dead `--controls-pane-width` gone |
| `proof:cartoon-is-panel-depth` | `KF_REQUIRE_BROWSER=1` | **PASS** (4/4) — 7 cartoon Cards rest on `--shadow-cartoon-md`, 5 grow to `--shadow-cartoon-lg` on hover |

---

## §BITE (the contract-mandated falsifiability proofs)

Both BITEs confirmed the gates actually bite, then both source files were restored
**byte-identical** to backup (`diff -q` → IDENTICAL; tsc re-confirmed 0; final gh-pages rebuilt).

1. **Stash the hero mega bump** — `EditorStartScreen.vue:16` `text-display-mega` → `text-display-4`.
   `proof:hero-rung` → **FAIL (2)**: "✗ source — the hero `<h1>` does NOT carry `text-display-mega`
   (class=…`text-display-4`…); born-RED: text-display-4" + "✗ source — still carries the MIDDLE
   rung text-display-4 (no legacy beside replacement)". The STATIC source-shape clauses bit
   immediately (they read source live; the resolved/px-floor clauses still read the stale dist, which
   is correct — the source-shape clauses are the load-bearing born-RED anchor without a rebuild).
   **Restored → re-verified PASS 6/6.**

2. **Stash the TypingDots re-point** — `TypingDots.vue` `count` default `3` → `1` (the one-clump
   regression — the `split(/\s+/)` ONE-span substrate the wave replaced). `proof:typing-dots` →
   **FAIL (2)**, exit 1: "✗ (a) three distinct dot spans — found 1 `.typing-dot` span(s) (the
   `split(/\s+/)` substrate yields ONE span)" + "✗ (b) left-to-right cadence — could not measure a
   rise-onset for every dot (onsets: 403)". The isolation harness re-builds the live SFC each run, so
   the mutation bit through the REAL component. **Restored → re-verified PASS 9/9.**

## §No-legacy DELETE + leaf-tail SWEEP (grep-confirmed)

- **`.dot-fade` rule + `@keyframes dotFade` are DELETED.** Source-scoped grep (excl. all `/dist/`)
  for `@keyframes\s+dotFade | \.dot-fade\s*\{ | animation:\s*dotFade` returns the SINGLE explanatory
  COMMENT at `EditorStartScreen.vue:22` (the no-legacy docstring) — NO live CSS rule, NO `@keyframes`,
  NO `animation: dotFade` anywhere in source. The `proof:typing-dots` cascade lint (clause e) strips
  comments and verified this byte-clean (1 shorthand, no legacy). (The earlier raw grep "match" on
  `@keyframes dotFade` was `demo/app/dist/` build-artifact noise — an unrelated minified keyframes,
  not a source `dotFade`.)
- **The 2 raw rungs (L1/L2) are SWEPT.** L1 `AnimationMenuBar.vue:102` is now `icon-lg` (no `text-xl`
  — the play/pause Button glyph routed to the owned idiom; all sibling glyphs already `icon-lg`).
  L2 `MotionPathTarget.vue:122` is now `font-size: var(--type-subheading)` (no `1.25rem` literal).
  `proof:phi-leaf-zero` HALF 1 confirms **0** raw rungs across the demo SOURCE roots.

---

## §RED-that-should-be-GREEN — NONE

Every gate the W6/W4 contracts name is GREEN on the landed tree; the two BITE mutations RED exactly
the documented clauses and restore to GREEN; the four named regression gates hold. No gate reported
RED that should be GREEN, so there is nothing to diagnose or paper over.

One observed-and-explained non-issue (not a RED): under BITE #1 the `proof:hero-rung` BROWSER clauses
(resolved-className + px-floor) stayed GREEN while the STATIC source clauses RED'd — because the
mutation was not rebuilt into `dist/gh-pages/` (the browser half reads the built bundle). This is
correct gate design: the source-shape clauses are the rebuild-free born-RED anchor (mirrors the
gate-author lane's verification matrix), so the gate bit truthfully and the post-restore PASS is on a
fresh build.

---

## §Environment / harness

- Playwright resolves from `node_modules` (`@playwright/test` + `playwright-core` both present);
  chromium installed (`~/Library/Caches/ms-playwright/chromium-1224`). `KF_REQUIRE_BROWSER=1` turns
  any Playwright-absent skip into a hard fail, so no browser gate was reported green un-exercised.
- `proof:typing-dots` Vite-builds the `scripts/lib/typing-dots-harness` isolation fixture (~100ms),
  mounts `<TypingDots/>` route-free, and rAF-samples each span's computed opacity (WV-W6-HIGH-1).

## §Files this lane touched

NONE persisted. Two temporary BITE mutations (`EditorStartScreen.vue`, `TypingDots.vue`) were applied
and restored byte-identical. `dist/gh-pages/` was rebuilt (git-ignored output). This note is the only
new artifact. The working tree is the landed W6/W4 set: 9 tracked-file edits + the new untracked
`TypingDots.vue`, `scripts/lib/typing-dots-harness/`, and the 7 new `scripts/proof-*.mjs` gates.
