# H.W9 — Lane (impl-w9-gates): proof:single-column-pack AMEND + proof:glass-and-cartoon NEW

**Lane:** the gate-authoring lane (F1 AMEND + F8 NEW). **Branch:** `tranche-h-impl`.
**Status:** LANDED, tsc-clean (`check:lib` EXIT 0 — gate-only edits, no `src/`/`demo/` source),
both gates GREEN on the landed tree + BORN-RED verified, both WIRED (package.json + ci.yml).
**git:** NOT committed (per wave instruction).

**Scope (file-disjoint from Lanes A/B/C):**
- `scripts/proof-single-column-pack.mjs` (AMEND — add clause (c))
- `scripts/proof-glass-and-cartoon.mjs` (NEW)
- `package.json` (the `proof:glass-and-cartoon` script entry + `proof:all` wire)
- `.github/workflows/ci.yml` (the `proof:glass-and-cartoon` demo-job step)

This lane authors the two F1/F8 gates; the SUBJECT both gates measure was landed by Lane A
(the register: `tier="quiet"` on the 14 cartoon Cards) and Lane B (the F1 intra-row
`[auto_1fr]` `.labeled-field` grid). I authored the gates AGAINST the landed subject and
verified each greens on it AND reds on the pre-fix shape.

---

## (1) proof:single-column-pack — F1 AMEND (the label-left/value-right clause)

**The amend (born-RED clause (c)).** Added to the existing browser half, AFTER the two W3
clauses (a) one-left-edge + (b) one-width. The probe now also collects, per visible leaf
row, the `<label>` and the first non-label/non-error control child's rects, and clause (c)
asserts `labelRect.right ≤ controlRect.left` for EVERY visible leaf row — the label sits
LEFT of the value (the intra-row `[auto_1fr]` split F1 restores, the `AssetPropertiesPanel.vue:6`
row idiom).

**Why the one-column invariant STAYS true (the contract's hard constraint).** Clauses (a)/(b)
measure the `.labeled-field` ROW element (one left edge, one width ±2px); the split lives
INSIDE each row, so the ROW box is unchanged — (a)/(b) still GREEN. The amend is purely
ADDITIVE; it does not relax the single-column-pack invariant. Verified live: 8 visible leaf
rows still share ONE left edge (x≈77–89 across runs) and ONE width (Δ=0px).

**Non-vacuity.** Re-uses the H.W3 `fieldCount >= 6` bar, but over the rows that expose BOTH a
`<label>` AND a measurable control (8 such rows on `#/cube` — duration/delay/iterations/
direction/fill + the LayerConfigPanel blend/z-index/enabled, proving Lane B's DRY parent rule
reaches the LayerConfigPanel fragment). A field-less or missing-child render reds the
non-vacuity guard.

**BORN-RED witness (verified).** A bite-check forced the rows to `display:block` (the pre-F1
W3 `flex flex-col` label-ABOVE stack): all 8 measurable rows violated (`label.right >
control.left`), `violators=8` → clause (c) reds correctly. On the landed intra-row grid,
`violators=0` → green.

**Live (`#/cube`, 1440×900, KF_REQUIRE_BROWSER=1):** every visible leaf row resolves
`display:grid; grid-template-columns: auto 1fr` (e.g. duration `68.9px 211.1px`) and
`labelRect.right ≤ controlRect.left` (158.1 ≤ 170.1 …) → clause (c) GREEN.

Settle plumbing UNCHANGED (the existing `settleOnCube` + `openPane` + `waitGridSettled` on the
H.W1 FSM resting; `#/cube` pinned in-page; viewport re-asserted; grid resolved before measuring).

## (2) proof:glass-and-cartoon — F8 NEW (the "glass is back" lock)

**The gate.** Two falsifiable halves, mirroring `proof-cartoon-is-panel-depth.mjs`'s plumbing
(serveDist + Playwright + the IN-PAGE-hash FSM settle + the cube/easing/spring sweep):

- **(1) SOURCE-SHAPE (static, always runs).** Sweeps the demo `.vue` tree for every opening
  `<Card surface="cartoon" …>` tag and asserts each carries `tier="quiet"`. 14 sites found, 0
  without quiet → GREEN. A `total < 10` guard forbids a mis-rooted vacuous sweep. BITE: drop
  `tier="quiet"` from any cartoon panel Card → it falls back to the resting 0.65 tier → reds.
- **(2) COMPUTED-TRANSLUCENCY (browser, gated).** In the NON-reduced-transparency case
  (asserted LIVE via `matchMedia('(prefers-reduced-transparency: reduce)')` — under reduce
  glass-ui maps α→1 + blur→none per the spec's `glass.css:367-383`, so the panels SHOULD be
  opaque and the gate would mis-bite; it skips/fails-honestly there), every VISIBLE
  `[data-surface="cartoon"]` Card resolves (a) background-color α ≤ 0.55 AND the ≥5 floor of
  (b) translucent witnesses (α < 1 AND backdrop-filter ≠ none).

**MEASURE-FIRST — the α threshold (the contract's "bind the α threshold MEASURE-FIRST").**
Probed the LIVE landed tree: every visible cartoon Card resolves
`background-color: color(srgb 0.984 0.980 0.976 / 0.5)` (α=**0.50**) + `backdrop-filter:
blur(10px) saturate(1.05) brightness(1.02)` (≠ none). The W2 resting tier was **0.65**. So the
ceiling binds at **α ≤ 0.55** — it BITES the 0.65 resting regression with margin and PASSES the
0.50 quiet tier with margin, WITHOUT depending on the exact 0.50 (a glass-ui tier re-tune
within (0, 0.55] stays green; a regression to resting reds). `const ALPHA_CEILING = 0.55`.

**The deliberate-borderless Card handled (no false positive).** `KeyframeTimeline.vue:3`
conditionally goes `border-0 shadow-none bg-transparent` when expanded — α≈0, backdrop none.
That is NOT an opaque regression (α ≤ 0.55 holds, so clause (a) passes) and it simply does not
COUNT toward the ≥5 translucent witnesses (it is not translucent-with-backdrop). A panel is a
VIOLATOR only if α > 0.55 (too opaque); a transparent panel is a deliberate state, not a
violation.

**Non-vacuity + the ≥5 floor.** ≥5 distinct cartoon Cards must be witnessed translucent
(α<1 AND backdrop≠none) across the swept routes — the same ≥5 panel floor
`proof:cartoon-is-panel-depth` uses. Live: 5 translucent witnesses, 0 opaque → GREEN.

**BORN-RED witness (verified).** A bite-check forced
`[data-surface="cartoon"] { background-color: rgba(250,250,249,0.65) }` (the resting-tier
regression): 2 visible cards both resolved α=0.65 > 0.55, `opaque=2` → clause (a) reds
correctly.

**Relationship to the KEPT gate.** `proof:cartoon-is-panel-depth` covers the cartoon DEPTH
(`--shadow-cartoon-md`/`-lg`) tier-agnostically and STAYS GREEN under the tier flip (the contract
KEEPs it). `proof:glass-and-cartoon` is the ORTHOGONAL TRANSLUCENCY half — depth ∧ glass = the
calm register. No overlap, no double-counting.

Settle-gated on the H.W1 FSM resting (`settleOnScene` waits the `activeScene` predicate; IN-PAGE
hash; viewport re-asserted; pane forced open; 700ms rest). `reducedMotion: 'no-preference'`
pinned for determinism.

---

## Wiring (per the contract: "Wire EACH into package.json + ci.yml")

- **package.json:** `proof:glass-and-cartoon` script added beside `proof:cartoon-is-panel-depth`
  (line 93); wired into `proof:all` immediately after `proof:cartoon-is-panel-depth`, before
  `proof:no-orphan-specular`. The AMENDED `proof:single-column-pack` script entry is UNCHANGED
  (the amend is internal to the script), so its existing `proof:all` + ci.yml wiring carries the
  new clause for free.
- **ci.yml:** `proof:glass-and-cartoon` step added to the `demo-smoke` job (it needs the demo
  build + browser) right after the `proof:cartoon-is-panel-depth` step, `KF_REQUIRE_BROWSER: "1"`
  (a playwright-absent skip becomes a hard CI fail — the F8 lock cannot pass vacuously).

## RECONCILE with the landed gate-set (per the contract)

- **proof:ci-coverage:** my two gates are coverage-CLEAN (neither appears in any coverage
  complaint). The RETIRED `proof:cartoon-specular-coexist` + `proof:specular-calm` are fully gone
  (scripts deleted, 0 package.json refs, 0 CI run-steps) — Lane A's work; coverage no longer
  expects them. The INVERTED `proof:no-orphan-specular` (exception set → ∅) is present + wired —
  Lane A's work.
- **proof:cartoon-is-panel-depth (KEPT):** confirmed it stays GREEN under the tier flip
  (tier-agnostic — it resolves the `--shadow-cartoon-md` TOKEN, not a tier-bound bg) by leaving
  it untouched; `proof:glass-and-cartoon` is the new orthogonal lock, not a replacement.

## OPEN ITEM for the dock/idle lanes (NOT this lane's scope — flagged for handoff)

`proof:ci-coverage` currently FAILS with: `proof:darkmode-row-toggle`, `proof:idle-fade`,
`proof:pp-logo-svg` are declared in package.json (by Lanes B/C) but NOT YET invoked in ci.yml.
Those are the F4/F5/F9 gates owned by the dock + idle lanes — each must wire its gate into the
ci.yml `demo-smoke` job (with `KF_REQUIRE_BROWSER: "1"` for the two browser gates; `proof:pp-logo-svg`
is static and may ride either job). Until they do, `proof:ci-coverage` reds on those three — NOT
on either of MY two gates.

## Precepts honored
- **MEASURE-FIRST:** the α ceiling (0.55) bound from the live resting-0.65-vs-quiet-0.50 delta
  before authoring the assertion; the F1 geometry measured live before amending.
- **born-RED-today:** both new clauses verified to RED on the pre-fix shape (forced label-above
  stack → 8 violators; forced resting α=0.65 → 2 opaque violators) and GREEN on the landed fix.
- **Browser-gated + settle on the FSM:** both gates use the H.W1-FSM-rested IN-PAGE-hash settle;
  `KF_REQUIRE_BROWSER=1` makes a playwright-absent skip a hard fail.
- **Reuse existing harness idioms:** AMEND extends the existing single-column probe in place;
  NEW mirrors `proof-cartoon-is-panel-depth.mjs` (serveDist + sweep + token/Card plumbing) — no
  new harness invented.
- **One-column invariant STAYS true (inv from the contract):** clause (c) is additive; the
  ROW-box clauses (a)/(b) are unchanged and stay green.

## Files touched
- `scripts/proof-single-column-pack.mjs` (AMEND clause (c) + docstring + titles/PASS message)
- `scripts/proof-glass-and-cartoon.mjs` (NEW)
- `package.json` (script entry + proof:all)
- `.github/workflows/ci.yml` (demo-smoke step)
