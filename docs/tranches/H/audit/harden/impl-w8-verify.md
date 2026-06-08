# H.W8 — the RE-BASELINE + VERIFY lane (the gate-regime close · post-re-pin)

This lane re-baselines `proof:visual-lock` against the NOW-PINNED demo (glass-ui
`~3.5.1`, not the floated 3.7.0 the bump produced) and runs the full close
verification. It depends on the re-pin lane (`impl-w8-repin.md`) having landed the
conservative `~3.5.1` pin; this lane confirms the demo renders as the W0-W12 gates
expect at that pin, re-captures the golden visual-lock baseline against it, and
records every residual RED honestly with ownership (NO paper-over, NO workaround).

## The pin under verification (confirmed installed)

```
optionalDependencies.@mkbabb/glass-ui :  ~3.5.1   (>=3.5.1 <3.6.0)
  package.json range : ~3.5.1
  installed          : 3.5.1
  lockfile node      : glass-ui-3.5.1.tgz
```

`~3.5.1` resolves 3.5.1 — the MINIMUM published 3.x carrying the dock-spring retune
(`--spring-dock` peak +4.5% ≤ +6%) WITHOUT the 3.6/3.7 Card-surface specular
regression. `proof:dock-morph-settled` confirms `--spring-dock` peak = 1.04501 →
+4.5% at glass-ui@3.5.1 (D5 closes). The dist under test (`dist/gh-pages/`) was
REBUILT from a clean `npm run gh-pages` against the 3.5.1 install before re-capture.

## (1) RE-BASELINE — the visual-lock golden, re-captured against 3.5.1

The pre-existing baseline set was captured against the **stale 3.7.0** float — deleted
(`rm scripts/baselines/visual-lock/*.png`), then re-captured against the freshly-built
3.5.1 demo via the gate's own capture pipeline:

| step | result |
|---|---|
| `--measure` noise-floor 3× | worst same-render mismatch **0.0340%–0.0679%** (spring/desktop/open/stage) — under the committed `TOLERANCE_FRAC=0.5%` with ≥0.43 points headroom. The PRM+mask+settle freeze is robust at 3.5.1. |
| `--update-baseline` golden capture | **49 baseline PNGs** written → `scripts/baselines/visual-lock/` (commit-ready, all timestamped this session). 11 `*/open/ribbon` regions absent on their scene/state (see below) — the writer skips them, as designed. |
| gate vs own fresh baseline | **PASS** — 49 regions diffed (all 0px or ≤0.07%, an order of magnitude under tolerance) · 11 absent-skipped. |
| BITE — re-run twice | **STABLE GREEN** ×3 (spring/desktop/open/stage jitters 519–528px = 0.069–0.070%, every other region 0px). |

The committed golden baseline count is **49 PNGs**.

### The visual-lock gate-logic fix (a RED-that-should-be-GREEN, fixed at source — NOT papered over)

Re-capturing surfaced a real gate defect that made `proof:visual-lock` unable to be
GREEN against its OWN freshly-written baseline (the FAIL(11) the re-pin lane flagged
as "missing ribbon BASELINES … baseline-capture still in flight"). Root-caused with a
`regionGeometry` probe across all scene×viewport×state: the `#controls-ribbon-target`
region is **geometrically absent** (geom-null) in 11 of 14 `*/open/ribbon` cells, for
three legitimate design reasons —

- **easing / spring** (4 cells): ribbon `display:none` — those scenes' `selectedControl
  ≠ 'controls'`, so the `v-show` on the teleport target collapses it.
- **sequence / motion-path** (4 cells): the `defer`-teleport target renders at
  height 0 (content not yet teleported; on mobile the pane stays closed).
- **cube / amiga / square MOBILE** (3 cells): the ribbon renders BELOW the fold
  (top=827px > the 667px mobile viewport) → fails the gate's `inViewport` clip.

The `--update-baseline` writer SKIPS exactly these null-buffer regions (writes no PNG),
but `diffOne` checked `!fs.existsSync(baseline)` BEFORE checking whether a capture even
existed — so a region the writer can never baseline RED-ed forever as `no-baseline`.
The two modes were ASYMMETRIC.

**Fix** (`scripts/proof-visual-lock.mjs`, `diffOne` + `runGate`): read the four
(baseline × capture) quadrants symmetrically with the writer —

| baseline | capture (geom) | verdict |
|---|---|---|
| absent | absent | **`absent-skip`** — genuinely-absent region (writer skipped it too); skipped, not red |
| absent | present | `no-baseline` — a NEW region rendered, never golden-captured → RED (lock must be complete) |
| present | absent | `no-capture` — a region that USED to render disappeared → RED (D-class regression) |
| present | present | diffed |

Only the first row changed. Every non-vacuity guarantee is PRESERVED: a new
uncaptured region still reds (`no-baseline`); a vanished region still reds
(`no-capture`); a pixel/dimension shift still reds. This is a correctness fix to the
gate's absent-region handling so it is self-consistent — NOT a suppression, NOT a
tolerance widening, NOT a baseline fudge. The 3 ribbon cells that DO render and lock
(cube/amiga/square DESKTOP) remain fully diffed at 0px.

## (2) FULL VERIFICATION

| check | verdict | note |
|---|---|---|
| `npx tsc --noEmit` | **0 errors** | the library + scripts typecheck clean |
| `npx vitest run` (`npm test`) | **GREEN** | 68 files · **682 passed + 2 expected-fail (684)** — engine + library unaffected by the pin or the gate fix |
| `npm run gh-pages` | **builds clean** | `✓ built` — only the standing pure-annotation / chunk-size / ineffective-dynamic-import WARNINGS (pre-existing, non-error) |
| `proof:visual-lock` | **PASS** (×3 stable) | 49 regions ≤ tolerance · 11 absent-skipped (see §1) |
| `proof:dock-morph-settled` | **PASS** | `--spring-dock` peak +4.5% ≤ +6% @ 3.5.1 (D5) |
| `proof:dock-popover-opens` | **PASS** | @mbabb popover opens on a trusted click |
| `proof:glass-and-cartoon` | **PASS** | 4 cartoon Cards α≤0.55 + live backdrop blur |
| `proof:cartoon-is-panel-depth` | **PASS** | cartoon `--shadow-cartoon-md`→`-lg` on hover |
| `proof:stage-glass-card` | **PASS** | the 4 stage scenes resolve ONE glass `<Card>` (the W11 I5 register) |
| `proof:scene-machine-irrefragable` | **PASS** | the FSM round-trips deterministic across timing-perturbed mounts |
| `proof:scene-control-dfa` | **PASS** | every scene renders exactly its DFA set; nav matrix total |
| `proof:scene-uses-standard-ribbon` | **PASS** | easing+spring mount the standard PlaybackRibbon, equal-dim cells |
| `proof:mobile-single-page` | **PASS** | 390×844 full-bleed fixed stage; controls overlay |
| `proof:drawer-spring` | **PASS** | the bottom-sheet is SpringProgress; single-frame PRM snap |
| `proof:easter-egg` | **PASS** | every scene's hidden on-aesthetic egg fires |
| `proof:easing-sidebar-minimal` | **PASS** | the minimal controls-like sidebar; grown bezier fits sans scroll |
| `proof:phi-leaf-zero` | **PASS** | zero raw rungs + hero on the top φ rung |
| `proof:demo-console-clean` | **PASS** | the H-A1 serializeEasing crash is dead |
| `proof:ci-coverage` | **PASS** | 97 gates covered (5 recorded exclusions); version-literal synced; registry clean; concurrency present |
| `proof:browser` (local meta-target) | **FAIL (2)** | **visual-lock is now GREEN inside it**; the ONLY 2 reds are `demo-usability` + `no-orphan-specular` — both PIN-INDEPENDENT (see §residuals) |

## (3) CHRONIC-CLOSURE + MANIFEST-SOURCED

| gate | verdict | note |
|---|---|---|
| `proof:chronic-closure` | **PASS** | the 4 chronics each close to discipline — cartoon-shadow D2 (load-bearing: cartoon-is-panel-depth, no-orphan-specular, glass-and-cartoon, specular-handoff · HANDOFF-paired born-RED), φ-hero D7 (phi-leaf-zero, hero-rung), mobile D10 (mobile-single-page, drawer-spring), dock D5+@mbabb D9 (dock-morph-settled, dock-popover-opens, single-toggle · HANDOFF-paired born-RED). All load-bearing names resolve. |
| `proof:manifest-sourced` | **PASS** | SCENES keys ≡ scenes.ts ids (8 scenes, bidirectional set-equality, derived from scenes.ts): home, cube, amiga, square, easing, spring, sequence, motion-path. |
| `proof:deps-current` | **PASS** | glass-ui≥3.5.1 floor met; registry-range protocol clean; the parse-that realm-split is the STANDING non-gating value.js-HANDOFF (G-HANDOFF-1, KF_REALM_STRICT unset). |

## (4) proof:all (the non-browser sweep) — 86 PASS / 5 FAIL

`proof:all` was run as a per-gate inventory (the `&&`-chained one short-circuits on
the first red and masks the rest). **86 of 91 gates PASS.** The 5 reds are ALL
PRE-EXISTING demo-lane defects, version-independent, and OUTSIDE the re-pin /
re-baseline blast radius — every cited source file is git-clean (unmodified by this
lane; the ONLY content change this lane makes is `scripts/proof-visual-lock.mjs` + the
49 baseline PNGs). None is introduced or worsened by the 3.5.1 pin.

| RED gate | cause | owner / disposition |
|---|---|---|
| `proof:decomposition` | 5 demo `.vue` over the 350L ceiling (EasingCurveCanvas 373L, AnimationControlsGroup 488L, ControlsPaneWrapper 490L, AnimationControls 367L, AnimationControlsControls 364L) — none in `CEILING_OVERRIDE` | **decomposition lane (D.W1/E.W1)** — split at the concern seam or add a rationale-bearing override. Pre-existing at HEAD (last touched H.W7 d287f7e). |
| `proof:no-orphan-specular` | **FAIL(2)** — the W9-vs-W11-I5 gate contradiction (REPIN-HANDOFF-1) | **REPIN-HANDOFF-1** (see §residuals). Clause 3 — the pin-restored hover-radial death — is GREEN. |
| `proof:timeline-rail-width` | **FAIL(3)** — the D4 rail-width three-regime spread (root cap 768px ≠ 400px budget; mobile cap-leak; ribbon≈pane) | **layout/rail lane (D4)** — single `--rail-width` authority not yet resolved. |
| `proof:easing-canvas-bounded` | **FAIL(2)** — canvas÷panel 0.654 > 0.55 + missing parity header | **easing lane (H.W4 S1/S2)** — the canvas block ceiling. |
| `proof:brittleness` | **FAIL** — `useSquareAnimations.ts` raw `new RAFPlayback()` with no dispose-time stop + an `AmigaScene.vue` addEventListener reach | **brittleness lane (G.W9 §S3)** — own the raw playback dispose. |

These 5 are recorded HONESTLY, not papered over. The re-baseline lane does NOT fix
them — they belong to their owning lanes, and reaching into demo decomposition / rail
width / canvas ceilings / RAFPlayback dispose from the verify lane would be scope
creep against KISS and the chronic-closure discipline. They are the standing demo-lane
debt the H.W8 gate regime now SEES (the gate-lattice doing its job), to be closed by
those lanes or carried as recorded handoffs into the close.

## The two PIN-INDEPENDENT browser residuals (the proof:browser FAIL(2))

Both were measured-first by the re-pin lane to fail IDENTICALLY at 3.4.0 (HEAD) /
3.5.1 / 3.7.0 — they are NOT glass-ui-pin regressions and the re-pin cannot green
them. Confirmed still-red at the verified 3.5.1 pin:

### (A) `proof:no-orphan-specular` — FAIL(2) — REPIN-HANDOFF-1 (a gate-vs-gate contradiction)

The 2 residual failures are the W11-I5 stage glass cards:
- **source-invariant**: 5 `<Card>`s (EasingTarget, MotionPathTarget, SequenceTarget,
  SpringTarget, StartingStyleTarget) resolve `surface=(default→glass)`, NOT cartoon.
- **no-orphan-card**: 2 of those (easing, spring) carry the glass-ui-default
  `glass-specular-track` because they ARE `surface="glass"`.

These are the SAME cards `proof:stage-glass-card` (W11 I5, GREEN) DELIBERATELY asserts
must be `surface="glass"` (the I5 reversal of W10 G8). The W9 `no-orphan-specular`
"every Card cartoon, exception set ∅" invariant was never reconciled to the LATER
W11 I5 stage-glass decision — a direct gate-vs-gate contradiction. The two cannot both
be green. The `glass-specular-track` is glass-ui's OWN default glass specular (the
inv-16 S5 HANDOFF territory the gate already records-not-fails for `<Button>`/dock).

**Crucially, clause 3 — the part the RE-PIN owns and restores — is GREEN:** "6 cartoon
panel(s) hovered … NONE paints the specular warm-white catch-light radial". That is
the 3.7.0 regression (FAIL(3): cartoon panels re-painted the hover radial) the
`~3.5.1` pin REMOVES. The re-pin did its job: FAIL(3) → FAIL(2). The remaining FAIL(2)
is REPIN-HANDOFF-1 — reconcile `no-orphan-specular`'s source/no-orphan-card clauses to
EXCLUDE the `proof:stage-glass-card` subjects from "every card cartoon". This is a
design-language gate-reconciliation touching the D2 chronic-closure load-bearing set —
a gate-lane decision, NOT a re-pin/verify fix. The precept holds: NO `!important`
suppression, NO flipping the I5 stage cards to cartoon (that would RED the W11 I5 ship
gate `proof:stage-glass-card`).

### (B) `proof:demo-usability` — FAIL(1) — the X-5 hero whitespace collapse

`hero inter-word gap > 0 — measured 0px between adjacent title word boxes (renders
"Selectananimation")`. Version-independent. The sr-only a11y mirror is CORRECT ("Select
an animation") and the text-wrap:balance substrate is intact — it is a hero-typography
inter-word-gap defect, **owned by the hero lane**, not a glass-ui regression.

## Outcome

The re-pin is VERIFIED at `~3.5.1` (3.5.1, glass-ui-3.5.1.tgz). The visual-lock golden
baseline is RE-CAPTURED against the pinned demo (49 PNGs, commit-ready) and the gate is
GREEN against its own fresh baseline, STABLE across 3 runs (BITE met). A real gate-logic
defect (the absent-region capture/baseline asymmetry) was fixed at source — making
visual-lock GREEN inside `proof:browser` for the first time.

tsc 0 · vitest 682+2 GREEN · gh-pages builds · ci-coverage GREEN (version-literal
synced) · chronic-closure GREEN (the 4 chronics close) · manifest-sourced GREEN
(8 scenes) · deps-current GREEN (glass-ui≥3.5.1; parse-that realm-split the standing
value.js-HANDOFF). The dock retune is consumed (D5, +4.5%); the true 3.7.0 specular
regression is removed (no-orphan-specular hover-radial clause GREEN); the W11 I5
stage-glass register is intact.

The residual reds — `proof:browser` FAIL(2) (`no-orphan-specular` REPIN-HANDOFF-1 +
`demo-usability` X-5) and `proof:all` FAIL(5) (the above two + decomposition + rail-width
+ easing-canvas-bounded + brittleness) — are ALL PIN-INDEPENDENT pre-existing demo-lane
defects (red at 3.4.0/HEAD too), precisely diagnosed, each handed to its owning lane,
and NOT papered over. The 3.6/3.7 reconciliation remains a FOLLOW-ON handoff
(glass-ui-reconciliation), NOT this close. NO kf fork of glass-ui.

The re-baseline + verify lane deliverable (the fresh 49-PNG baseline · the gate-logic
correctness fix · the stable-green visual-lock · the full verification table with the
honest residual ledger) is COMPLETE.
