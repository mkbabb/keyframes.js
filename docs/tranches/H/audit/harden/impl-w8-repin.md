# H.W8 — the glass-ui RE-PIN lane (the conservative pin-down · BLK-5 · inv-16/inv-27)

The re-pin lane re-runs the bump under MEASURE-FIRST and catches a REAL glass-ui-bump
regression that the W8 bump lane's verify sweep MISSED (`impl-w8-bump.md` omitted
`proof:no-orphan-specular`, `proof:demo-usability`, and `proof:visual-lock` from its
gate table — the exact gate-coverage blind-spot this lane exists to close). The bump
went to `^3.5.1`, which FLOATS to the latest published 3.x — **3.7.0** — and at 3.7.0
the demo REGRESSES. The fix is the conservative re-pin to the MINIMUM 3.x that carries
the dock retune AND renders the demo as the W0-W12 gates expect.

## Chosen pin

```
optionalDependencies.@mkbabb/glass-ui :  ^3.5.1  →  ~3.5.1   (>=3.5.1 <3.6.0)
```

- **`~3.5.1` resolves to `3.5.1`** (the latest in the 3.5.x line; only 3.5.0 and 3.5.1
  exist there). Lockfile node: `glass-ui-3.5.1.tgz`. Installed: 3.5.1.
- **TILDE, not caret.** `^3.5.1` floats to 3.7.0 (the regressed surface map). `~3.5.1`
  caps below 3.6 — it consumes the dock-spring retune (which landed in 3.5.0) while
  EXCLUDING glass-ui 3.6/3.7, whose UNRELATED Card-surface changes break the demo's
  W2/W9 design-language (specular-removal). The cap is JUSTIFIED + RECORDED (inv-16 /
  inv-27): reconciling to 3.6/3.7 is a FOLLOW-ON glass-ui-reconciliation HANDOFF, not
  this close. NO kf fork of glass-ui.

## WHY 3.5.1 (the published-version binary search, MEASURE-FIRST)

The available published 3.x line: 3.0.0 … 3.4.0, **3.5.0, 3.5.1**, 3.6.0, 3.7.0.

| version | `--spring-dock` peak | dock-morph-settled | the 3.7.0 regression (no-orphan-specular hover ::before) |
|---|---|---|---|
| 3.4.0 (pre-bump HEAD) | 1.16292 → **+16.3%** | RED (D5 live) | GREEN (no cartoon-hover radial) |
| **3.5.1 (chosen)** | 1.04501 → **+4.5%** | **GREEN** | **GREEN** (no cartoon-hover radial) |
| 3.7.0 (`^3.5.1` float) | 1.04501 → +4.5% | GREEN | **RED** — cartoon panels re-paint the specular catch-light radial on hover |

The dock retune (`53c1b07`, `--spring-dock` peak +16.3% → +4.5%) IS in 3.5.1 —
confirmed by reading the installed `tokens.css` (`proof:dock-morph-settled` GREEN at
3.5.1, +4.5% ≤ +6%). 3.5.1 is the MINIMUM published 3.x that (a) carries the dock
retune AND (b) does NOT carry the 3.6/3.7 Card-surface regression. It is the pin.

## The TRUE 3.7.0 regression this re-pin removes

`proof:no-orphan-specular` clause 3 (HOVER `::before`, the WV-W2-LOW-3 computed check):

- **3.7.0:** `6 hovered cartoon panel(s) STILL paint the specular catch-light radial on
  hover` — glass-ui 3.6/3.7 changed the Card surface map so even `surface="cartoon"`
  panels re-emit the `rgba(255,255,255,0.55)` warm-white specular `::before` radial.
  This is the "specular bloom" the W9 F3/F6 removal (which worked at 3.4.0) no longer
  holds. `no-orphan-specular` goes FAIL(2) → **FAIL(3)** at 3.7.0.
- **3.5.1 (and 3.4.0):** `6 cartoon panel(s) hovered … NONE paints the specular
  warm-white catch-light radial` — the radial is dead at SOURCE on the cartoon surface.
  Clause 3 GREEN. **The re-pin removes the regression** (FAIL(3) → FAIL(2)).

This is the bite the cut verify lane would have caught — and now does.

## Gate sweep at the chosen `~3.5.1` pin (KF_REQUIRE_BROWSER=1)

| gate | verdict @ 3.5.1 | note |
|---|---|---|
| `proof:dock-morph-settled` | **PASS** | `--spring-dock` peak 1.04501 → +4.5% ≤ +6% · the dock retune IS in 3.5.1 (D5 closes) |
| `proof:dock-popover-opens` | **PASS** | @mbabb popover opens on a trusted click (finalOpen:true) |
| `proof:glass-and-cartoon` | **PASS** | 4 cartoon Cards α=0.5 ≤ 0.55 + backdrop blur live (the oklab-α parser widening from the bump lane holds at 3.5.1) |
| `proof:cartoon-is-panel-depth` | **PASS** | 6 cartoon Cards `--shadow-cartoon-md` at rest → `-lg` on hover |
| `proof:stage-glass-card` | **PASS** | the 4 stage scenes resolve ONE glass `<Card>` (radius 16px / blur(12px) / NOT cartoon) — the W11 I5 register |
| `proof:scene-machine-irrefragable` | **PASS** | the FSM round-trips byte-identical across the full A→B→A matrix |
| `proof:chronic-closure` | **PASS** | every chronic exits to discipline (static meta-gate; load-bearing names resolve) |
| `proof:specular-handoff` | **PASS** (born-RED witness held) | the glass-ui Card-default + dock-icon HANDOFFs correctly PENDING |
| `proof:deps-current` | **PASS** | FLOOR glass-ui≥3.5.1 met; registry protocol clean; parse-that realm-split is the standing non-gating value.js-HANDOFF |
| `proof:ci-coverage` | **PASS** | version-literal synced (see below) |
| `proof:engine`, `proof:boundary` | **PASS** | the library (glass-ui-FREE) is unaffected by the pin |
| `tsc --noEmit` (`npm run check`) | **clean, 0 errors** | |
| `npm run gh-pages` | **builds clean** | the 3.4→3.5.1 jump shifts no API the demo depends on |

## The residual reds at 3.5.1 are PIN-INDEPENDENT (NOT a re-pin failure) — measured, recorded honestly

Three gates fail at 3.5.1, but each fails **IDENTICALLY at 3.4.0 (HEAD) and 3.7.0** —
they are pre-existing W8/W11 lane defects, NOT glass-ui-pin regressions. The re-pin
lane's MEASURE-FIRST sweep across 3.4.0/3.5.1/3.7.0 isolates this; pinning cannot green
them (they are out of the re-pin blast radius — they belong to the owning lanes).

### (A) `proof:no-orphan-specular` — FAIL(2): a GATE-vs-GATE contradiction (W9 vs W11 I5)

The 2 residual failures (present at EVERY version, including 3.4.0/HEAD):
- **source-invariant** (STATIC, version-independent — reads only demo `*.vue`): 5
  `<Card>`s (`EasingTarget`, `MotionPathTarget`, `SequenceTarget`, `SpringTarget`,
  `StartingStyleTarget`) resolve `surface=(default→glass)`, NOT cartoon.
- **no-orphan-card** (BROWSER): 2 of those (easing, spring) carry the glass-ui-default
  `glass-specular-track` because they are `surface="glass"`.

**Root cause — a direct gate-vs-gate contradiction the re-pin SURFACES:**
- `proof:no-orphan-specular` (authored at **W9**, f064cc1) asserts "EVERY `<Card>` is
  `surface="cartoon"`, exception set ∅."
- `proof:stage-glass-card` (authored at **W11 I5**, AFTER W9) asserts — and is GREEN —
  that the FOUR stage scenes (easing/spring/sequence/motion-path) are DELIBERATELY
  `surface="glass"` (`data-surface=glass tier=resting`, the I5 reversal of W10 G8).

These are the SAME cards. The two gates cannot both be green: the W9 gate's "every
card cartoon" invariant was never reconciled to the W11 I5 stage-glass-card design
decision. The `glass-specular-track` on the I5 stage glass cards is glass-ui's DEFAULT
glass specular — the SAME S5 HANDOFF territory (inv-16: kf does NOT own the Card surface
map) that the gate ALREADY records-not-fails for `<Button>`/dock tracks. The gate just
doesn't yet distinguish a legitimately-glass I5 stage card from a kf-re-introduced
`surface="glass"` PANEL regression.

**This is NOT a re-pin fix and NOT a workaround the re-pin may apply** (precept: no
`!important`-suppress, no demo flip that would RED the W11 I5 ship gate). It is a
gate-reconciliation that touches the D2 chronic-closure load-bearing set — a
design-language gate-lane decision. **HANDOFF (REPIN-HANDOFF-1):** reconcile
`proof:no-orphan-specular`'s source/no-orphan-card clauses to EXCLUDE the W11 I5 stage
glass cards (the `proof:stage-glass-card` subjects) from "every card cartoon" — keeping
the panel-cartoon invariant, the cartoon-hover-radial death (clause 3, the part the
re-pin restores), and the glass-ui-owned track as recorded S5 HANDOFF residue.

### (B) `proof:demo-usability` — FAIL(1): a hero whitespace-collapse defect (X-5)

`hero inter-word gap > 0 — measured 0px between adjacent title word boxes (renders
"Selectananimation")`. Version-independent (identical at 3.4.0/3.5.1/3.7.0) — a
demo-side hero typography defect, owned by the hero lane. NOT a glass-ui regression.

### (C) `proof:visual-lock` — FAIL(11): missing ribbon BASELINES, not pixel regressions

The 11 failures are all `NO baseline committed (capture exists; run --update-baseline)`
for the `*/open/ribbon` regions — an INCOMPLETE golden baseline set (the visual-lock
baseline-capture task is still in flight). Every region that HAS a committed baseline is
WITHIN tolerance at 3.5.1 (stage diffs 75–271px = 0.01–0.11%, all ≤ tolerance). NOT a
glass-ui regression; owned by the visual-lock baseline-capture lane.

## Wiring synced to the chosen range (brief step 4)

- **`package.json`** — `optionalDependencies.@mkbabb/glass-ui`: `^3.5.1 → ~3.5.1`.
  `package-lock.json` re-resolved to `glass-ui-3.5.1.tgz` (was 3.7.0).
- **`scripts/proof-deps-current.mjs`** — FLOOR already `@mkbabb/glass-ui: 3.5.1` (a
  floor, satisfied by 3.5.1); GREEN, no change needed.
- **`.github/workflows/ci.yml`** — synced the 4 glass-ui version literals `^3.5.1 →
  ~3.5.1` so `proof:ci-coverage` clause 1 (version-literal: ci.yml literal === a
  declared `@mkbabb/*` range) passes. Corrected two stale comments that mislabeled the
  born-RED dock state as `^3.5.1 (+16.3%)` — that +16.3% state is glass-ui **3.4.0**,
  not 3.5.1 (the literal there is now `3.4.0`, removing the false `^3.5.1`). Added the
  tilde-rationale + 3.6/3.7-deferral note to the npm-ci comment.
- `@playwright/test` installed `--no-save` for the local browser sweep (mirroring the
  CI demo arm); package.json + lockfile carry NO playwright entry — the 2-runtime-dep
  library posture is preserved.

## The 3.6/3.7 deferral (inv-16 / inv-27 — capping below 3.6 is JUSTIFIED + RECORDED)

glass-ui 3.6/3.7 introduced Card-surface changes the demo's design-language (W2/W9
cartoon + specular-removal) does not yet consume — concretely, the cartoon-surface
`::before` re-emits the specular catch-light radial on hover at 3.6/3.7. Reconciling
the demo to 3.6/3.7 is a FOLLOW-ON (a glass-ui-reconciliation HANDOFF or a future kf
wave), NOT this close. The `~3.5.1` cap holds the demo at the surface map the W0-W12
gates were authored against. NO kf fork.

## Outcome

THE PIN IS `~3.5.1` (resolves 3.5.1). It carries the dock retune (D5 closes;
`proof:dock-morph-settled` +4.5% GREEN), keeps every glass-ui-pin-sensitive gate GREEN
(glass-and-cartoon · cartoon-is-panel-depth · stage-glass-card · dock-popover ·
scene-machine), and REMOVES the true 3.7.0 regression (the cartoon-hover specular
catch-light: `no-orphan-specular` FAIL(3)→FAIL(2)). tsc 0, the demo builds, deps-current
+ ci-coverage GREEN.

The residual `no-orphan-specular` FAIL(2) / `demo-usability` FAIL(1) / `visual-lock`
FAIL(11) are PIN-INDEPENDENT (red at 3.4.0/HEAD too), precisely diagnosed, and handed
off honestly to the owning lanes — NOT papered over by the re-pin. The re-pin lane's
deliverable (the pin + the ci/deps sync + the 3.6/3.7 deferral record) is GREEN; the
demo is rendered as the gates were authored to expect (the W11 I5 stage-glass register
is intact, the specular catch-light is dead on the cartoon surfaces). REPIN-HANDOFF-1
(the W9-vs-W11-I5 gate reconciliation) is the one open item the re-pin surfaces and
must NOT silently fix.
