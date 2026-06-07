# Tranche H DEEP harden — FIX-APPLIER report: [HANDOFF-SYNTHESIS] partition

**Scope (hard boundary):** `valuejs-parsethat-glassui-handoff.md` + the 6
`audit/_SYNTHESIS-*.md`. Applied all HS-* fixes from `_HARDEN-LEDGER.md` tagged
[HANDOFF-SYNTHESIS]; the gap-scorecard kept authoritative + self-consistent.

## Verifications done (byte/registry level, this pass)
- **BLK-5 CONFIRMED:** `npm view @mkbabb/glass-ui versions` = `…3.5.0, 3.5.1, 3.6.0` (ALL
  published). `git merge-base --is-ancestor 53c1b07 v3.5.0` → YES (`53c1b07` = the AW.W2
  dock-retune commit). Installed glass-ui still `3.4.0`, pinned `^3.4.0` (`package.json:103`).
  Installed `--spring-dock` ramp peak = `1.16292` (**+16.3%**, not +18.5%; +18.5% is the
  analytic (0.5,0.5) overshoot).
- **HS-HIGH-2 CONFIRMED:** `grep -rn 'from "reka-ui"' demo/` = 0 matches in source (only
  `demo/app/dist/*.js` build artifacts). The `SelectIcon` direct-reka reach is already retired
  → GH-5 downgraded to RECORD/ALREADY-RESOLVED.
- **HS-LOW-1 CONFIRMED:** real lerp seam = `engine.ts:18` (import) / `:779`
  `lerpValue(eased, iv)` in `processFrame` (via `:657 interpFrames`); `iv._lerp` form +
  `:516,576` are stale.
- **HS-HIGH-3 CONFIRMED:** in-scope raw `text-{rung}` survivors = **2** (L1
  `AnimationMenuBar.vue:102`, L2 `MotionPathTarget.vue:119`) once `ui/`+`dist/` excluded; the
  "37" counted vendored shadcn; literal repo-wide grep ≈320 (mostly `dist/`).

## Fixes applied
- **HS-BLK/BLK-5** — un-staled GH-1 across `handoff` (header, "work DONE/PUBLISHED" block,
  LIVE/+16.3% block, disposition→consume-leg BUMP `^3.4.0→^3.5.1`, gate→token-peak ≤+6%,
  sequencing, §5 DAG line, §5 ordering #1, §6 evidence block) + gap-scorecard §1.1/§4 +
  dock-perf-modes (§2 lag-roots, §6 mechanism table, §6 morph spec, §7 DK-1 + I-8). Added
  MEASURE-FIRST blast-radius + demo self-alias notes; demoted morph-geometry form to
  RECORD-WITHHELD (181 samples, no morph captured).
- **HS-HIGH-1/BLK-3** — RETIRED the conflated `proof:dock-live` everywhere → split to
  `proof:dock-morph-settled` (D5 spring, kf consume-leg) + `proof:dock-popover-opens` (D9,
  kf SHIP, H.W1). Reconciled the 3 superseded provisional gate names in deferred-ledger §1
  (`proof:mobile-composition`→`proof:mobile-single-page`+`proof:drawer-spring`;
  `proof:motion-timing`→`proof:drawer-spring`;
  `proof:scene-state-machine`→`proof:scene-machine-irrefragable`) with a canonical-name
  reconciliation note + the "PROGRESS.md is the SINGLE parse substrate, §1 is descriptive
  history" caveat. Fixed the §-roll-up rows, the dock summary row, and the HANDOFF
  classification roll-up (D5→kf bump, D9→kf SHIP).
- **HS-HIGH-2** — GH-5 downgraded to RECORD/ALREADY-RESOLVED; gate reframed to a
  no-NEW-raw-reka invariant (the bare repo-wide grep is infeasible — reds on vendored
  `ui/menubar/` shadcn). Updated §5 DAG line.
- **HS-HIGH-3** — propagated φ-leaf "37→2" into gap-scorecard φ-gate, deferred-ledger
  (LIVE block, gate, §inv-16 evidence) with explicit `ui/`+`dist/` exclusion rationale.
- **HS-MED-1** — softened `proof:deep-link-wins` (overlaps `proof:no-route-storm`; deep link
  honored on LOAD, storm walks it away) + re-shaped the route-storm clause cross-ref
  (RE-RENDER/INTERACTION-driven, non-home start, drive-the-loop — WV-W1-HIGH-1 cross-ref).
- **HS-MED-2** — re-anchored `engine.ts:516,576`→`:769/:779` in gap-scorecard §1.1 +
  §3 H.W0/H.W6 + frontend-mobile:387; re-classified H-A2 to a value.js-HANDOFF
  (`parseCSSValueUnit('...')`); corrected the false "hero ellipsis → CSSKeyframesAnimation"
  root cause (AnimatedText is pure CSS).
- **HS-MED-5** — removed "else BOOK" on the `useSpecularPointer` wire in design-language
  DL-3 + §1 W2; added the calmer-intensity half + `proof:specular-calm` (rest ≤0.25 / hover
  ≤0.4, RED today 0.35/0.6).
- **HS-LOW-1** — named BOTH morph arms in the §H-dock-4 caveat (native VT
  `::view-transition-*` arm vs FLIP `SpringProgress` pixel-space arm; demo forks on
  `'startViewTransition' in document`); dropped the `iv._lerp` form everywhere
  (re-anchored to `engine.ts:18/:779`) across handoff + gap-scorecard + deferred-ledger.
- **HS-LOW-2** — homed the demo-side D5 contributors (`collapse-delay`
  `ChromeDock.vue:116`; ~1M px² backdrop) to a kf-demo wave with
  `proof:dock-actions-reachable` + `proof:demo-backdrop-budget` (latent-M3 note in GH-1).
- **HS-LOW-3** — added the user-phrasing alias table to prompt-recap §P10
  (easing-modern-web→D3, specular-refine→D14, scene-corruption→D12, drawer-spring→D13).

## Out-of-partition (RECORDED, not silently dropped — gap-scorecard §8 ledger)
These HS fixes target `a-*` EVIDENCE files (outside my hard boundary). The `_SYNTHESIS`
docs are already free of the mis-reads; recorded for the `a-*` owner/impl:
- **HS-MED-3** → `a-hero-typography:115-116`: flex-wrap → GRID-ROW stacking.
- **HS-MED-4** → `a-animations-quality F1`: "two competing clocks" mis-read (both = SAME
  2.6s; bug is one title-sized duration on a 3-glyph string).
- **HS-HIGH-3 (a-* half)** → `a-deferred-chronic:62,113,164`: propagate "37→2".

## Verdict
HANDOFF-SYNTHESIS partition is internally self-consistent post-pass: 0 stale
`unpublished`/`release-then-bump` framing; `proof:dock-live` only in RETIRED notes; canonical
dock-gate names consistent across 4 files; φ raw-rung count = 2 everywhere; lerp seam
re-anchored to `:779`. The single largest correction (BLK-5) collapses GH-1 from a glass-ui
release-wait to a one-line kf `package.json` bump — a shippable fix the stale framing would
have punted.
