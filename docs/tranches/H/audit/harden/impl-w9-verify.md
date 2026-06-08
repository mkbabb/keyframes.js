# impl-w9-verify — H.W9 VERIFY lane (builds · tests · gates · BITEs)

The VERIFY lane for H.W9 (the design-language refinement round-2 / user-feedback fold F1–F9).
Run + reported verbatim on `tranche-h-impl` with all lanes landed (working-tree, uncommitted).
Browser gates run with `KF_REQUIRE_BROWSER=1` (playwright-core resolved from the repo root).

## (1)–(3) Build/test gates

| Step | Command | Result |
|------|---------|--------|
| (1) typecheck | `npx tsc --noEmit` | **0** (clean, exit 0) |
| (2) tests | `npx vitest run` | **GREEN** — Test Files 67 passed (67); Tests 671 passed \| 2 expected fail (673). No size-ceiling needed updating. |
| (3) demo build | `npm run gh-pages` | **GREEN** — `✓ built in ~1.3s`; `dist/gh-pages/index.html` written. Only pre-existing non-error warnings (`@vueuse/core` rolldown `/* #__PURE__ */` annotation position; chunk-size > 500kB; ineffective-dynamic-import notices) — no errors, exit 0. |

The 2 expected-fail tests are pre-existing `it.fails`/`test.fails` markers in
`test/interpolate-anything.test.ts` + `test/group-snapshot-identity.test.ts` (NOT new, NOT
H.W9-introduced).

## (4) H.W9 gates (new / amended / inverted) — all GREEN

| Gate | Item | Disposition | Result |
|------|------|-------------|--------|
| `proof:no-orphan-specular` | F3+F6 | INVERT (exception set → ∅) | **GREEN** — source-invariant 14/14 Cards `surface="cartoon"`, NO `glass-specular-track`/`cartoon-specular`/`.glass-card`; ZERO orphan-card tracks across cube/easing/spring; 8 cartoon panels hovered, none blooms the warm-white radial. S5 HANDOFF residue recorded (15 `<Button>`/dock tracks, `anyPointerWrite=false`) NOT failed (inv-16). |
| `proof:single-column-pack` | F1 | AMEND (label-left clause) | **GREEN** — 8 visible leaf rows: ONE left edge (x=89), one width (Δ=0px); all 8 place label LEFT of control (`labelRect.right ≤ controlRect.left`). The one-column invariant STAYS true; the label-left clause added. |
| `proof:glass-and-cartoon` | F8 | NEW | **GREEN** — all 14 `surface="cartoon"` sites carry `tier="quiet"`; 0/5 visible Cards opaque (α > 0.55); 5 Cards translucent (α ≤ 0.55) + backdrop-filtered glass over the cartoon depth. |
| `proof:bezier-no-scroll` | F2 | NEW | **GREEN** — at 1280×720 & 1440×900: detail host fits (scrollHeight 321 ≤ clientHeight 321), overflow-y `auto` (≠ scroll); back control baked into CardHeader RIGHT of the title (backLeft > titleRight, shared flex justify-between row). |
| `proof:cartoon-shadow-unclipped` | F7 | NEW | **GREEN** — at 1280 & 1440: `.controls-content` padding-left 12px ≥ 8px throw; the cartoon shadow left lobe lands INSIDE the load-bearing `overflow:hidden` clip (leftmost ≥ clip box-left by ~19px); the clip is kept. |
| `proof:pp-logo-svg` | F4 | NEW (static) | **GREEN** — the ppmycota item mounts `.ppmycota-logo-sm`; ZERO emoji codepoints (the `<p>` emoji line gone); resolves to a real `assets/ppmycota-logo-3.svg` (10KB on disk). |
| `proof:darkmode-row-toggle` | F5 | NEW | **GREEN** — the dark-mode `DropdownMenuItem` carries row-level `@click="toggleDark()"`; `<DarkModeToggle passive>` (pure indicator); clicking the LABEL gutter flips `<html>.dark` light→dark→light, exactly ONE toggle per click (no double-toggle). |
| `proof:idle-fade` | F9 | NEW | **GREEN** — `--controls-idle-opacity` resolves 0.35 (< 1); active OPEN pane opaque (opacity 1.000 — real delta); after >10s idle the wrapper carries `.controls-pane--idle` + opacity drops to 0.350; hovering returns to 1.000. |

## (4) Retirements + meta-gate

- `proof:cartoon-specular-coexist` + `proof:specular-calm` — **RETIRED**, confirmed ABSENT:
  - scripts deleted on disk (`scripts/proof-cartoon-specular-coexist.mjs`, `scripts/proof-specular-calm.mjs` — `No such file`).
  - ABSENT from `package.json` (no `proof:cartoon-specular-coexist`/`proof:specular-calm` script entry; absent from `proof:all`).
  - ABSENT from `.github/workflows/ci.yml` invocation list (the only match is the H.W9 retirement COMMENT documenting the removal).
- `useSpecularPointer.ts` — **DELETED** (file gone; the only remaining references are doc-comment mentions in `design-idioms.css` describing the removal, not live code).
- `proof:ci-coverage` — **GREEN**: "all 68 proof:* gates are invoked in CI (4 recorded exclusions)"; version-literal, registry-glass-ui, concurrency hygiene all green. The retirements + new gates are consistently wired.

## (5) No-regression gates — all STILL GREEN

| Gate | Result |
|------|--------|
| `proof:cartoon-is-panel-depth` (tier-agnostic) | **GREEN** — 5 contract Cards `surface="cartoon"`; resting box-shadow === `--shadow-cartoon-md` (7/7), grows to `--shadow-cartoon-lg` on hover (5). F8's tier flip leaves it green. |
| `proof:scene-machine-irrefragable` | **GREEN** — no orphan rAF across 4 easing⟷cube cycles; deep-link-wins; deterministic restore. |
| `proof:demo-console-clean` | **GREEN** — H-A1 serializeEasing crash dead on /#/amiga + /#/easing. |
| `proof:demo-shell-grid` | **GREEN** — ONE rail·stage·rail grid, ONE `--rail-width`, no two-track/subgrid/col-span apparatus. |
| `proof:scene-icons` | **GREEN** — favicon 200; inline `<svg>` icon stroke tracks currentColor in both themes. |
| `proof:phi-leaf-zero` | **GREEN** — zero raw type rungs in demo source; hero on `text-display-mega`. |

## BITE (the stash-and-falsify checks)

| BITE | Stash | Expected | Observed |
|------|-------|----------|----------|
| 1 (glass-and-cartoon bites the tier) | dropped `tier="quiet"` from `RibbonBar.vue:3` Card → rebuilt dist | `proof:glass-and-cartoon` REDS | **REDS** — source-shape: 1 of 14 Cards missing `tier="quiet"`; computed: 3 visible Cards opaque at resting 0.65 α (> 0.55). FAIL (2). |
| 2 (single-column-pack bites the F1 label-left) | removed the `.panel-content :deep(.labeled-field){display:grid;grid-template-columns:auto 1fr}` rule from `AnimationControlsControls.vue` → rebuilt dist | `proof:single-column-pack` label-left clause REDS | **REDS** — 8 of 8 rows STACK label-above-value (`label.right > control.left`). Clauses (a)/(b) — one left edge, one width — STAYED GREEN (the intra-row split is orthogonal to the one-column invariant). FAIL (1). |

Both stashes RESTORED (`git checkout --`; `tier="quiet"` count = 1, grid-rule count = 1), dist
rebuilt, and BOTH gates re-verified **GREEN** post-restore. Working tree returned to the
lane-landed state (empty diff on the two files).

Note on the spec's specular-deletion BITE: the inverted `proof:no-orphan-specular` proves the
ABSENCE invariant (exception set → ∅), so stashing the deletion (re-adding the bezier composite)
makes it RED — and an absent subsystem keeps it green by absence. The two actionable
re-introduce-the-defect stashes (the glass-and-cartoon tier + the F1 row rule) were run as above;
both bite on the exact live measurement.

## Verdict

**ALL GREEN.** No RED-that-should-be-GREEN. tsc 0 · 67 test files / 671 pass + 2 expected-fail ·
gh-pages built · all 8 H.W9 gates (1 inverted, 1 amended, 6 new) GREEN · 2 specular gates RETIRED
(absent from `proof:all`/`package.json`/`ci.yml`) · `proof:ci-coverage` GREEN with the retirements ·
6 no-regression gates STILL GREEN · both BITEs fire RED on the stash and recover GREEN on restore.
H.W9 is verify-clean. (No git commit per the contract.)
