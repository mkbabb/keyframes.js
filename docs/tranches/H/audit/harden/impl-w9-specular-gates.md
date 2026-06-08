# H.W9 — IMPL lane note · LANE (the SPECULAR gate deltas · F3/F6)

**Wave:** H.W9 — design-language refinement round 2 (the user-feedback fold F1–F9).
**Lane:** the SPECULAR gate deltas (F3/F6) — INVERT `proof:no-orphan-specular`,
RETIRE `proof:cartoon-specular-coexist` + `proof:specular-calm`, confirm the kept gates
+ the D2 chronic meta-gate parse hold.
**Contract:** `docs/tranches/H/waves/H.W9.md` §Hard gate (the INVERT/RETIRE rows) +
`_PLAN.md §2 F3/F6` + the H.W8 §S3 RETIRED-exclusion rule + the `PROGRESS.md §"Open
deferrals"` D2 row.
**Branch:** `tranche-h-impl`. **Status:** LANDED in the working tree, NOT committed (per
wave instruction). **tsc:** `npm run check:lib` → exit 0 (clean — this lane touches NO
`src/` TS, only `scripts/*.mjs` + `package.json` + `.github/workflows/ci.yml`).
**Files (file-disjoint from the register/layout/dock lanes):**
- `scripts/proof-no-orphan-specular.mjs` (INVERTED in place)
- `scripts/proof-cartoon-specular-coexist.mjs` (DELETED via `git rm`)
- `scripts/proof-specular-calm.mjs` (DELETED via `git rm`)
- `package.json` (drop the 2 retired script entries + remove them from `proof:all`)
- `.github/workflows/ci.yml` (drop the 2 retired `run:` steps → a RETIRE-rationale
  comment; re-label the inverted gate's step + comment)

This lane authors NO source; the register lane (Lane A) already DELETED the subject (the
W2 S2-COMPOSITE bezier card + the `.cartoon-specular` recipe + `useSpecularPointer`). This
lane reconciles the GATE SET to that deletion per the chronic-closure discipline.

---

## (1) INVERT — `proof:no-orphan-specular` (exception set → ∅)

The W2 gate enumerated ONE composite exception `{TimingFunctionPanel bezier}`: a Card was
allowed to carry `glass-specular-track` IF it co-carried `.cartoon-specular` AND its file
wired `useSpecularPointer`. H.W9 F3+F6 REMOVED that subsystem, so the exception COLLAPSES
to the EMPTY set. The inverted invariant:

> ZERO `.glass-specular-track` (and ZERO `.cartoon-specular`) on ANY kf-owned `<Card>`.
> No exception. No Card paints a tracked catch-light.

The three falsifiable halves were re-authored (the serveDist + Playwright + FSM-settle
plumbing is preserved — `openSceneFresh` waits on `localStorage` `activeScene`, mirroring
the W2/W3 settle-gate):

- **(1) source-invariant (static, always runs).** Every `<Card>` opening tag must be
  `surface="cartoon"` with NO `glass-specular-track`, NO `cartoon-specular`, NO manual
  `.glass-card`. The enumerated-composite branch is GONE — a Card carrying EITHER tracked
  class now reds. This is the deterministic, browser-free born-RED/green witness.
- **(2) no-orphan-card (browser, gated).** ZERO `.glass-specular-track` that is a kf-owned
  `<Card>` (`[data-surface]`) — no composite allowance. The `<Button>`/dock tracks are
  RECORDED S5 HANDOFF residue (inv-16), NOT failed.
- **(3) hover ::before (browser, gated).** EVERY `[data-surface="cartoon"]` Card is hovered
  (the `:not(.cartoon-specular)` exclusion is dropped — the composite is gone); NONE may
  paint the warm-white `rgba(255,255,255,0.55)` radial. Non-vacuity floor: ≥1 hovered.

**STRONGER than the W2 form:** it still bites a re-introduced `surface="glass"` (the orphan
default) AND now also bites any re-added composite (`glass-specular-track`/`cartoon-specular`
on a Card). It is the chronic-closure-discipline SYSTEM-property gate that REPLACES the two
retired ones: "no panel paints a tracked catch-light."

### BITE proven both directions (MEASURE-FIRST)
- **born-RED on the bezier composite that existed TODAY.** Temporarily swapped in
  `git show HEAD:…/TimingFunctionPanel.vue` (the pre-W9 `<Card … class="… cartoon-specular
  glass-specular-track …">`) → the source-invariant FAILS on that one Card → gate exit **1**.
- **GREEN on the W9 fixed tree.** Restored the working-tree (`tier="quiet"` plain cartoon)
  version → all 3 halves pass → gate exit **0**. With `KF_REQUIRE_BROWSER=1`: 14/14 Cards
  `surface="cartoon"` no-specular; 0 orphan Cards across cube/easing/spring; 8 cartoon
  panels hovered (non-vacuity met), 0 bloom. 15 `<Button>`/dock tracks RECORDED as S5
  HANDOFF residue.

## (2) RETIRE — `proof:cartoon-specular-coexist` + `proof:specular-calm`

Their subject (the W2 composite — the lone bezier card with the tracked, cursor-following
catch-light) was DELETED. `coexist` proved "cartoon depth AND a tracked catch-light
coexist on a real panel" — there is no such panel now. `calm` capped a retained `::before`
intensity — there is no retained `::before` now (the calm is by ABSENCE, not a lower
ceiling). Both gates are now subjectless, so both are removed entirely:

- `scripts/proof-cartoon-specular-coexist.mjs` + `scripts/proof-specular-calm.mjs` —
  `git rm` (no-legacy-beside-replacement; net deletion).
- `package.json` — both `"proof:*"` script entries removed AND both removed from the
  `proof:all` chain.
- `.github/workflows/ci.yml` — both `run:` steps removed, replaced by a single
  RETIRE-rationale comment (naming the gates in prose only — NOT a `run:` invocation, so
  it cannot satisfy a phantom coverage match).

## (3) Confirmations (the coherence the wave asked for)

- **`proof:cartoon-is-panel-depth` STAYS GREEN (tier-agnostic).** Re-ran on the fixed tree:
  5 contract-named Cards `surface="cartoon"`; 7 resolve `--shadow-cartoon-md` at rest; 5
  grow to `--shadow-cartoon-lg` on hover → PASS. The gate never asserts a tier, so the F8
  `tier="quiet"` flip is transparent to it.
- **`proof:specular-handoff` UNCHANGED (still born-RED HANDOFF).** Re-ran → green-reports
  (the born-RED witness held — glass-ui ^3.4.0 still ships the hot 0.35/0.6/55% default +
  the unwired Card seam; `consumeLegReady=false`). The gate's `kfRecipeStaged` NOTE now
  reads `false` (the `.cartoon-specular` recipe was deleted by Lane A) — but that is a NOTE,
  NOT a pass/fail axis; the readiness flip is driven solely by the INSTALLED glass-ui state.
  No edit made to this file (per the contract: UNCHANGED).
- **`proof:ci-coverage` stays coherent for THIS lane.** Removing the 2 gates from BOTH
  `package.json` AND `ci.yml` leaves no orphan (clause 0 looks for `npm run <g>` only for
  gates declared in `package.json`; the retired names are in neither). The inverted gate is
  wired in BOTH. The only remaining coverage miss is `proof:glass-and-cartoon` — the F8 gate
  the REGISTER lane authored (`scripts/proof-glass-and-cartoon.mjs` exists) but has not yet
  wired into `package.json`/`ci.yml`; that is the register lane's wiring step, NOT this lane.
  No my-lane gate appears in the missing list.
- **The H.W8 RETIRED-exclusion rule + the D2 chronic meta-gate parse hold.** The meta-gate
  is authored in H.W8 (not yet landed); this lane makes the SUBSTRATE coherent so the parse
  will hold. The `PROGRESS.md §"Open deferrals"` D2 row already states the parse contract:
  - LOAD-BEARING set RESOLVES (verified in `package.json` scripts):
    `proof:cartoon-is-panel-depth` ✓, `proof:no-orphan-specular` (inverted) ✓,
    `proof:specular-handoff` (paired) ✓. (`proof:glass-and-cartoon` — register lane's to
    wire; its script exists.)
  - RETIRED names are ABSENT (the dual — a RETIRED name that STILL resolves would red):
    `proof:cartoon-specular-coexist` ✓ ABSENT, `proof:specular-calm` ✓ ABSENT — from
    `package.json` scripts, `proof:all`, AND `ci.yml run:`; both script files deleted.
  The retire is COMPLETE (not half-done), so the dual-of-resolve clause is satisfied.

---

## Precepts honored
- **NO legacy beside replacement / net deletion:** the 2 subjectless gates are DELETED
  (files + script entries + chain + CI steps), not parked. The inverted gate is the single
  stronger replacement.
- **chronic-closure discipline (inv per a-deferred-chronic §3):** the D2 cartoon chronic
  exits via a STRONGER SYSTEM-property gate (`proof:no-orphan-specular` exception=∅), caught
  BEFORE H.W8's golden baseline locked the re-paper — NOT a re-open.
- **inv-16:** the `<Button>`/dock specular tracks stay RECORDED S5 HANDOFF residue (the
  paired `proof:specular-handoff` is UNCHANGED); no glass-ui patch in kf.
- **MEASURE-FIRST:** the INVERT's born-RED was demonstrated against the actual pre-W9
  `TimingFunctionPanel.vue` (HEAD) composite tag, not asserted; the green against the live
  fixed tree with `KF_REQUIRE_BROWSER=1` (non-vacuity floor met).
- **KISS / DRY:** the inverted gate REUSES the W2 plumbing (serveDist, `openSceneFresh`,
  FSM-settle, the `SPECULAR_RADIAL` signature) — it removes the exception branches, it does
  not re-author a parallel harness.

## Coordination / handoffs
- **Register lane (Lane A):** authored the SOURCE deletion this lane's gates police (the
  composite Card, the recipe, `useSpecularPointer`) + the F8 `proof:glass-and-cartoon` gate
  SCRIPT — but must still WIRE `proof:glass-and-cartoon` into `package.json` + `ci.yml` for
  the D2 LOAD-BEARING set to fully resolve and for `proof:ci-coverage` clause 0 to green.
- **H.W8 (gate-regime wave):** owns the chronic-closure meta-gate that PARSES the D2 row;
  this lane confirmed the substrate (load-bearing resolves, retired absent) so that parse
  holds. `H/PROGRESS.md §"Open deferrals"` D2 row already documents the exact contract.
- **NO source/glass-ui/dist touched.** This lane is gate-set reconciliation only.
