# H.W6 gate lane — IMPL notes (the W6 §Hard-gate, born-RED→GREEN)

**Branch:** `tranche-h-impl` · **Status:** the W6 gates landed in-tree (NOT committed) ·
tsc-clean · `proof:ci-coverage` green (all 57 gates wired).

This lane authors the W6 §Hard-gate SCRIPTS (the W6 IMPL note `impl-w6w4-w6.md` landed the
SOURCE; this lane lands the falsifiable proofs). My lane = `proof:typing-dots` (a/b/c/d + the
cascade lint) + `proof:dogfood-hero` (the inv-ζ static import). Wired into `package.json` +
`ci.yml`. Each BITES per the §Hard gate.

---

## What this lane added (4 files)

### 1. NEW — `scripts/proof-typing-dots.mjs` (the perceptual-break + cascade lock)

The H.W6 §Hard-gate clauses (a)/(b)/(c)/(d) + the cascade lint, one re-runnable gate. Mirrors
`scripts/proof-cartoon-specular-coexist.mjs` (`serveDist` + Playwright + the
`KF_REQUIRE_BROWSER` skip-or-fail plumbing, shared from `scripts/lib/demo-driver.mjs`).

**The isolation harness (WV-W6-HIGH-1).** The home route cannot mount the dots pre-render (the
D12 storm unmounts home in <1 rAF), so the gate mounts `<TypingDots/>` in ISOLATION — route-free.
It Vite-builds a tiny harness (`scripts/lib/typing-dots-harness/{index.html,main.ts}`) that mounts
ONLY `<TypingDots/>` through the SAME `@components`/`@src` aliases the demo uses (`configFile:false`
so it does not pull the multi-page gh-pages config), serves it, and rAF-samples each span's
COMPUTED opacity. The build is ~100ms (just the SFC + the engine). This exercises the REAL
production component (the per-dot `CSSKeyframesAnimation` loop, the `stagger()` distribution, the
`steppedEase` cadence) with zero FSM/router/design-language coupling — the SOURCE fix is
FSM-orthogonal, so the gate is too.

**Clauses (each verified to BITE — mutation-tested):**

| Clause | What it asserts | Measured GREEN | BITE (mutation → RED) |
|---|---|---|---|
| (a) 3 distinct dot spans | `count === 3` `.typing-dot` spans | 3 | `count:1` (the `split(/\s+/)` one-clump) → "found 1" reds |
| (b) left-to-right cadence | each dot's opacity rise-onset strictly later than the one left (≥60ms floor vs the 160ms stagger step) | onsets 396/571/729ms (+175/+158) | `count:1` (no stagger) → onset unmeasurable reds; a shared `dotFade` → ~0 deltas reds |
| (c) never vanish | `min opacity over the cycle >= 0.15` (+ a c-amplitude non-vacuity guard: peak ≥0.85, amplitude ≥0.4) | min 0.200, peak 1.000 | `REST_OPACITY:0` (the `0%/100% opacity:0` vanish) → min 0.000 reds |
| (d) short fixed cycle | dot-0 rise-to-rise period (median) `<= 1600ms` | ~1208–1217ms | `CYCLE_MS:2000` → 2000ms reds; `CYCLE_MS:2600` (title-sized) → no-completion reds |
| (e) cascade lint | STATIC: `AnimatedText.vue` declares exactly ONE `animation`-shorthand rule (`.lift-down`); NO `.dot-fade`/`@keyframes dotFade` residue (no-legacy); `TypingDots.vue` declares NO CSS `animation` shorthand. BROWSER: every dot resolves a SINGLE computed `animation-name` (`none`) | 1 shorthand, no legacy, all `none` | re-stack `.dot-fade` + `@keyframes dotFade` on `AnimatedText` → BOTH the no-legacy clause AND the shorthand-count (2 ≠ 1) red |

The cascade lint is FOLDED into `proof:typing-dots` (clause e) — it is W6's structural concern and
the contract groups it under the typing-dots gate row. Static half always runs (browser-free);
the runtime half (single resolved `animation-name` per dot) runs in the browser.

**Comment-strip (no-legacy precision).** `AnimatedText.vue` + `TypingDots.vue` legitimately NAME
the removed `.dot-fade`/`@keyframes dotFade` in their docstrings (explaining the H.W6 deletion).
The no-legacy + shorthand-count scans strip HTML/CSS/JS comments first (mirrors
`proof-dogfood.mjs`'s `stripComments`), so an explanatory mention does NOT red the clause — only a
return to LIVE code does.

### 2. NEW — `scripts/lib/typing-dots-harness/{index.html,main.ts}` (the isolation fixture)

A bare host (no router, no FSM, no design language). `main.ts` mounts `createApp({ render: () =>
h(TypingDots) })` through the `@components` alias. Lives UNDER `scripts/` (NOT `demo/`) so it is
outside the demo build AND outside the project tsconfig include (`["src/","demo/"]`) — it cannot
affect the library typecheck/dts build. The HTML root MUST be in-repo (a `/tmp` root breaks
rolldown's `emitFile` relative-path assert — verified).

### 3. NEW — `scripts/proof-dogfood-hero.mjs` (the inv-ζ static import lock · WV-W6-MED-1)

Static (browser-free). Asserts `TypingDots.vue` imports a kf ENGINE CLASS
(`CSSKeyframesAnimation`/`NumericAnimation`) from `@src/animation/(engine|index)` — mirrors
`proof-dogfood.mjs`'s `IMPORTS_*` regex shape. **The steppedEase trap (WV-W6-MED-1, load-bearing):**
`steppedEase` is a `@mkbabb/value.js` export, NOT a kf `@src` symbol — so a `steppedEase` import
ALONE does not prove inv-ζ. Clause 1 asserts the kf-engine class import; clause 2 makes the trap
explicit — IF `steppedEase` is referenced it MUST resolve from `@mkbabb/value.js`, never from
`@src/` (so a future author cannot pass the curve off as the dogfood by importing it from a wrong
`@src` path).

**BITE (mutation-tested):** strip the `CSSKeyframesAnimation` import (the pre-H pure-CSS path) →
"imports NO kf engine class" reds; import `steppedEase` from `@src/animation/easing` (the trap) →
"steppedEase from @src/ … is a value.js export, NOT a kf symbol" reds.

### 4. WIRING — `package.json` + `.github/workflows/ci.yml`

- `package.json` `scripts`: added `proof:typing-dots` + `proof:dogfood-hero` (after
  `proof:icon-idiom`), and appended both to the `proof:all` local chain (after `proof:icon-idiom`,
  before `proof:brittleness`).
- `ci.yml` `demo-smoke` job: `proof:dogfood-hero` (static — no env) after `proof:icon-idiom`;
  `proof:typing-dots` after it WITH `KF_REQUIRE_BROWSER: "1"` (it needs the harness Vite build +
  Playwright; the job already installs Playwright + builds the demo, so `vite`/`@vitejs/plugin-vue`
  resolve from devDeps). The browser env turns a playwright-absent skip into a hard CI fail — the
  perceptual fix cannot be reported green un-sampled.
- `proof:ci-coverage` GREEN: all 57 `proof:*` gates are invoked in CI (the wiring is complete).

---

## The skip-or-fail plumbing (verified both directions)

- No Playwright + no `KF_REQUIRE_BROWSER` → graceful `○ browser half skipped`; the STATIC cascade
  lint still runs + bites; gate PASSes on the static half (honest, not vacuous — CI never runs this
  mode).
- No Playwright + `KF_REQUIRE_BROWSER=1` → hard FAIL ("browser half REQUIRED … cannot pass
  vacuously") — matches `proof:demo-usability` / `proof:cartoon-specular-coexist`.

---

## What this lane did NOT touch (fences)

- The W6/W4 SOURCE (`TypingDots.vue`, `AnimatedText.vue`, `EditorStartScreen.vue`) — landed by the
  W6/W4 IMPL lanes (`impl-w6w4-w6.md` / `impl-w6w4-w4.md`); this lane only READS them. All source
  mutations during BITE-testing were restored byte-clean (diff-verified).
- The W4 gates (`proof:phi-leaf-zero`, `proof:icon-idiom`, the easing/hero gates) — the parallel
  gate lane owns those; this lane's `package.json`/`ci.yml` edits insert AROUND them without
  clobbering (verified: `proof:phi-leaf-zero` + `proof:icon-idiom` still present and wired).

---

## tsc / coverage

- `npm run check` (`tsc --noEmit`, full project incl. demo) — CLEAN.
- `node scripts/proof-ci-coverage.mjs` — PASS (57/57 gates wired, workflow hygiene green).
- `node scripts/proof-typing-dots.mjs` (KF_REQUIRE_BROWSER=1) — PASS (all 9 sub-clauses green).
- `node scripts/proof-dogfood-hero.mjs` — PASS.

## Files touched (4)

1. NEW `scripts/proof-typing-dots.mjs` — the (a/b/c/d) blink lock + the cascade lint.
2. NEW `scripts/lib/typing-dots-harness/index.html` + `main.ts` — the isolation mount fixture.
3. NEW `scripts/proof-dogfood-hero.mjs` — the inv-ζ kf-engine-import lock (steppedEase trap).
4. `package.json` (scripts + proof:all) + `.github/workflows/ci.yml` (demo-smoke wiring).
