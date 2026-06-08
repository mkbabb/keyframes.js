# impl-w8r-specular-reconcile — Lane A: the `no-orphan-specular ↔ W11 I5` reconciliation

**Lane:** A (the central, delicate fix) · **Window:** H.W8R (gate-regime close) ·
**File touched:** `scripts/proof-no-orphan-specular.mjs` (the gate only) · **tsc:** 0 ·
**Static half:** GREEN · **Browser half:** greens in CI/with playwright (KF_REQUIRE_BROWSER).

---

## The contradiction (the real defect)

`proof:no-orphan-specular` was authored at H.W9 F3/F6 asserting "EVERY kf-owned
`<Card>` is `surface="cartoon"`, exception set → ∅." That predates H.W11. At H.W11
I5 the lead — at the USER's EXPLICIT ask ("the easing/spring/sequence/path scenes
should have a standard, non-cartoon GLASS card encapsulation") — deliberately made
the four scene STAGES non-cartoon GLASS `<Card>`s, and authored
`proof:stage-glass-card` to REQUIRE those stages to resolve `surface="glass"`.

The two gates then DIRECTLY CONTRADICT: no-orphan-specular flagged the 5 stage
Cards (the W11-I5-sanctioned glass stages) as orphans —
`demo/easing/EasingTarget.vue`, `demo/spring/SpringTarget.vue`,
`demo/spring/StartingStyleTarget.vue`, `demo/sequence/SequenceTarget.vue`,
`demo/motion-path/MotionPathTarget.vue` (each `<Card :shadow="false">`,
default→glass) — while stage-glass-card required them to BE glass.

This is **NOT a glass-ui problem**. glass-ui is correctly pinned `~3.5.1` (the
3.5.0 hover-radial death → the glass stages are visually CLEAN, no bloom; the
3.5.1 dock-spring retune greens `proof:dock-morph-settled`). The defect is a
kf-INTERNAL gate contradiction.

## The new invariant (a refinement, not a workaround)

The gate now **PARTITIONS** every kf-owned `<Card>` into two cohorts and polices
each correctly:

1. **PANEL/sidebar Cards — the H.W9 F6 intent HOLDS, exception ∅.** Every panel
   `<Card>` is `surface="cartoon"` with NO `glass-specular-track`, NO
   `cartoon-specular`, NO manual `.glass-card` plate. (9 panel Cards today, all
   cartoon.)

2. **STAGE Cards — the W11-I5 SANCTIONED `surface="glass"` set.** A stage Card's
   unconditional `glass-specular-track` is **glass-ui-OWNED residue** — the
   `specular="off"` opt-out prop is UNPUBLISHED (the cosmetic glass-ui 3.8.0
   consume-edge; inv-16 forbids a fork/patch, kf consumes published `~3.5.1`). It
   is ALLOWED on the sanctioned stages ONLY. The deleted kf `cartoon-specular`
   recipe and a manual `.glass-card` plate remain forbidden EVEN on stages (those
   are kf-authored, not glass-ui residue).

The exception set is **NO LONGER ∅** — it is the W11-I5 stage Target set. The
gate's docstring was updated to cite `proof:stage-glass-card` + the user ask.

## The shared stage-set derivation (CONSISTENT-BY-CONSTRUCTION + DRY)

The sanctioned-stage set is NOT a second hardcoded list. `deriveSanctionedStageTargets()`
derives it **the SAME way `proof:stage-glass-card` derives its scene set**:

- `proof:stage-glass-card`'s stage SCENES are scenes.ts's NON-`subject`
  `STAGE_MODES` → `{easing, spring, sequence, motion-path}` (IDENTICAL set).
- The gate parses `demo/app/scenes.ts`'s `STAGE_MODES` literal, takes the
  non-`subject` ids, maps each id → its `<Pascal>Scene.vue` (resolved
  case-insensitively against `demo/app/scenes/`), and harvests the `*Target.vue`
  files each stage `*Scene.vue` imports.
- Result (verified live): exactly the 5 stage Target files —
  `EasingTarget`, `SpringTarget`, `StartingStyleTarget` (spring's two stage
  views), `SequenceTarget`, `MotionPathTarget`.

So a scene leaving/entering the stage set in `scenes.ts` moves BOTH gates at once;
neither can drift onto a different stage set. A broken derivation (empty / parse
failure) is itself a hard FAIL — the gate cannot silently degrade to "every Card
is a stage" (vacuity). A comment in the gate cross-references
`scripts/proof-stage-glass-card.mjs`.

## The browser half (the real W9 F6 user-facing invariant)

The hover `::before` check now sweeps BOTH cohorts (`[data-surface]` — panels AND
stages, across cube/easing/spring/sequence/motion-path) and asserts NO Card paints
a VISIBLE specular `::before` warm-white bloom (`rgba(255,255,255,0.55)` radial
core). At glass-ui `~3.5.1` the hover-radial is dead, so neither cohort blooms. If
a future glass-ui RE-INTRODUCES the visible bloom, this REDS (the re-pin guard).
The `.glass-specular-track` classification half records a stage track as sanctioned
residue (a glass `[data-surface=glass]` plate inside `.stage-cell`) but reds any
track on a PANEL Card (cartoon, or a glass Card outside a stage cell) as an orphan.
A non-vacuity floor fails under `KF_REQUIRE_BROWSER` if ZERO Cards were hovered.

## The bite-tests (the gate STILL BITES — verified live)

| # | Mutation | Expected | Result |
|---|----------|----------|--------|
| (a) | flip a PANEL (`EasingSidebar.vue`) to `surface="glass"` | RED | RED ✓ — "PANEL `<Card>` resolves surface=glass, NOT cartoon" |
| (b) | add `glass-specular-track` to a cartoon PANEL | RED | RED ✓ — "PANEL `<Card>` carries `glass-specular-track` … the PANEL exception set is ∅" |
| (b′) | a NEW default→glass `<Card>` in a panel file (orphan) | RED | RED ✓ — "If this is meant to be a glass STAGE, it must live in a stage Target file derived from scenes.ts STAGE_MODES" |
| (c) | the 5 sanctioned stages, untouched | PASS | PASS ✓ — "5 sanctioned STAGE `<Card>`(s) resolve glass across the W11-I5 stage set" |
| extra | a STAGE Card carrying `glass-specular-track` (sanctioned residue) | PASS | PASS ✓ — not flagged |
| extra | a STAGE Card carrying the deleted kf `cartoon-specular` recipe | RED | RED ✓ — "not even a sanctioned glass stage may re-introduce it" |

Every mutation reverted; `git status` shows the gate script as the ONLY change.

## Why it is NOT a workaround

- The invariant stays **FALSIFIABLE** — it still bites a panel→glass revert, a
  re-added tracked-specular class on a panel, a new orphan glass Card, and a
  re-introduced VISIBLE hover bloom (the original D2/F6 user-facing defect class).
- It is NOT weakened to vacuity: a glass Card is permitted ONLY inside the
  DRY-derived stage set; a broken derivation hard-fails rather than admitting all
  Cards.
- No `!important` suppression, no `display:none`, no glass-ui patch/fork (inv-16):
  the reconciliation lives entirely in the gate's classification logic. The stage
  track is RECORDED as glass-ui-owned residue (the same S5 HANDOFF discipline the
  `<Button>`/dock tracks ride on `proof:specular-handoff`).
- The two gates are now consistent-by-construction: they read the SAME
  `scenes.ts` `STAGE_MODES` source, so the contradiction is structurally
  impossible to re-introduce.

## Disposition

`proof:no-orphan-specular` is GREEN (static half) and `tsc` is 0. D5 (dock-lag
chronic) closes for real at glass-ui 3.5.1 via `proof:dock-morph-settled` (a
passing SYSTEM gate). The no-orphan-specular ↔ stage-glass-card contradiction is
resolved — both gates pass with no weakening of either.
