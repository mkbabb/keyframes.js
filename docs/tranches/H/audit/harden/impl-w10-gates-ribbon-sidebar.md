# impl-w10-gates-ribbon-sidebar — Gate lane (G3/G7 + G5/G6 browser gates)

**Wave:** H.W10 (SHIP-in-H, corrective — the second user-feedback fold G1–G8).
**Lane:** the two browser-gated proofs for the scene-normalization spine:
`proof:scene-uses-standard-ribbon` (G3 + G7) + `proof:easing-sidebar-normalized`
(G5 + G6). File-disjoint from Lane A (icons) + Lane B (impl). NO git commit.
tsc-clean (exit 0 — these are `.mjs` gates + `package.json`/`ci.yml` wiring, no TS).

## Files authored / touched

| File | Change |
|------|--------|
| `scripts/proof-scene-uses-standard-ribbon.mjs` | NEW — the G3+G7 standard-transport browser gate |
| `scripts/proof-easing-sidebar-normalized.mjs` | NEW — the G5+G6 normalized-sidebar browser gate |
| `package.json` | wire both `proof:*` scripts + append both to the `proof:all` chain (after `proof:easing-canvas-bounded`, keeping the easing/scene browser gates grouped) |
| `.github/workflows/ci.yml` | wire both as named CI steps with `KF_REQUIRE_BROWSER: "1"` (a playwright-absent skip becomes a hard CI fail), inserted after the `proof:easing-canvas-bounded` step |

Verified `proof:ci-coverage` GREEN with both new gates ("all 70 proof:* gates are
invoked in CI") — no orphan gate.

## proof:scene-uses-standard-ribbon (H.W10 S2 — G3 + G7)

**What it asserts (per scene: easing + spring·solver), scoped to the live ribbon.**
1. STANDARD RIBBON SIGNATURE (the component IDENTITY): the standard
   `PlaybackRibbon`'s DOM marks are all present — the scrubber `.timeline-green`
   Slider, the `grid-cols-2` transport row of exactly 2 cells with a Play
   `.btn-playback` button, and the `AnimationVisualizer` `.bg-accent-red` ball.
   This proves the scene mounts the SAME component cube/amiga mount (the ribbon is
   byte-identical because it IS cube's component).
2. PLAY/REVERSE NOT PLAY/RESET: a "Reverse" cell exists; NO "Reset" cell lives in
   the ribbon (the bottom dock owns Reset — de-duplicated, matching cube).
3. EQUAL DIMS (G7): the two `grid-cols-2` transport cells have equal
   `getBoundingClientRect()` width AND height within 2px. NON-VACUITY: both cells
   must have real area.

**The component-identity probe.** The standard ribbon skins ONLY Play
`.btn-playback` (Reverse rides `.btn-interactive`), so the gate measures the
grid-cols-2 transport ROW (exactly 2 cells, ≥1 of them `.btn-playback`), NOT a
naive `.btn-playback`-count ≥ 2 (which would false-RED the correct fix — caught
+ corrected during authoring: the first draft required ≥2 `.btn-playback` and
red on the GREEN tree).

**The harden caveat honored.** The gate does NOT forbid `ribbonContent` per se
(it is the standard scene-extension slot cube uses for its Matrix verbs); it
forbids the PRIMARY playback transport living there instead of in the standard
ribbon. Spring's domain verbs (Re-seat in solver, Reveal/Dismiss in discrete) are
PERMITTED — the gate only asserts the standard-ribbon signature + the equal-dims
of the standard cells, it does not count extra domain buttons. Spring is measured
in its SOLVER view (where the standard sweep transport mounts); the DISCRETE
sub-view is a CSS-transition toggle (no sweep transport), out of scope.

**BITE (verified on the pre-W10 tree at `f064cc1` via a temp worktree).**
- easing: `scrubber:false`, `visualizer:false`, the bespoke fork's `Pause 148×40`
  vs `Reset 148×32` (Δh=8px UNEQUAL), Play/RESET verb → 3 clauses RED.
- spring: same, plus the bespoke `grid grid-cols-1` fork → `transportCellCount:0`
  → "cannot measure equal dims" RED.
- All 6 clauses GREEN on the W10 fix (both scenes: 148×40 equal cells, full
  PlaybackRibbon signature, Play/Reverse).

## proof:easing-sidebar-normalized (H.W10 S4 — G5 + G6)

**What it asserts (per sidebar: easing + spring), scoped to the active controls
tabpanel.**
(a) STANDARD RUNG (G5): ZERO `.text-admin-label` labels AND the param-row Slider
    track height ≥ 5px (the default md ~6px track — NOT the bespoke `size="sm"`
    4px track).
(b) BOUNDED NESTING (G6): exactly ONE glass-ui Card — the Card-root signature is
    `.rounded-card.text-card-foreground` (verified from glass-ui
    `CardFooter-*.js`), which DISTINGUISHES a real `<Card>` component from a plain
    div that merely uses the `rounded-card` radius UTILITY (the
    `.easing-curve-canvas-wrapper` HERO carries `glass-panel rounded-card` but NOT
    `text-card-foreground`, so it is correctly excluded). The born-RED ×2 easing /
    ×3 spring inner sub-Cards → ≥3 → RED.
(c) Labeled* ROWS (G6 row idiom): ≥1 glass-ui `.labeled-field` row (the param
    fields are the H.W9 F1 label-left rows, not hand-classed grid divs).

**NOT over-constrained.** The easing curve canvas stays the lone HERO (a domain
control, not asserted as a `.labeled-field`); the spring preset CHIPS keep
`size="sm"` (a compact button cluster, not the param-row control rung the G5
clause measures — the clause reads the Slider TRACK, not a button). The mount
guard waits only for the sidebar to PAINT (not for `.labeled-field`), so the three
clauses each bite on their SPECIFIC born-RED fact rather than hiding the BITE
behind a timeout (caught + corrected during authoring).

**The two `.rounded-card` discovery (the Card-root distinction).** First draft
counted bare `.rounded-card` and false-RED easing (2 found: the parent Card + the
curve-canvas wrapper's radius utility). Tightened to `.rounded-card.text-card-foreground`
(the glass-ui Card-component root signature) — now the curve-canvas HERO wrapper
is correctly excluded, easing = exactly 1 Card.

**BITE (verified on the pre-W10 tree at `f064cc1`).**
- easing: bare-class root `easing-editor glass-resting cartoon-surface p-3`,
  `text-admin-label:1`, `labeled-field:0` → rung + rows clauses RED.
- spring: `text-admin-label:10`, `3 glass-ui Cards`, `labeled-field:0` → all 3
  clauses RED.
- All 6 clauses GREEN on the W10 fix (both sidebars: 1 Card, 0 text-admin-label,
  6px slider track, 2 labeled-field rows).

## The settle-gate (browser clauses on the H.W1 FSM)

Both gates mirror `proof:easing-canvas-bounded`'s serveDist + Playwright + settle
plumbing (the canonical easing/scene browser-gate idiom):
- serve the BUILT `dist/gh-pages/` over a throwaway http server.
- pin `#/<scene>` via an IN-PAGE `location.hash` assignment (NOT `page.goto` —
  goto clears storage + the H.W1 reconcile trap).
- poll the scene machine (`keyframes-js-scene-machine`) to rest on the scene
  (`activeScene === scene`) — the H.W1 FSM-resting settle-gate.
- re-assert the viewport AFTER navigation (Playwright resets on navigate).
- force the controls pane OPEN + the scene tab selected
  (`animation-groups-control-options-store` → `isControlsPanelOpen` +
  `selectedControl`) so the ribbon / full-rail sidebar mounts.
- `KF_REQUIRE_BROWSER=1` → a playwright-absent skip is a hard fail (the rendered
  facts cannot be reported green un-exercised).

## Verification

- `node --check` — both gates syntax-clean.
- `npx tsc --noEmit` — clean (exit 0).
- `python3 yaml.safe_load(ci.yml)` — valid YAML.
- `proof:ci-coverage` — GREEN (both new gates invoked in CI; no orphan).
- `KF_REQUIRE_BROWSER=1 npm run proof:scene-uses-standard-ribbon` — PASS (W10).
- `KF_REQUIRE_BROWSER=1 npm run proof:easing-sidebar-normalized` — PASS (W10).
- BITE proof: both gates RED on `f064cc1` (pre-W10) via a temp `git worktree` +
  symlinked `node_modules` + its own `npm run gh-pages` dist; worktree removed
  after.

## Notes for the H.W8 golden-baseline lane

- These two gates lock the SCENE-NORMALIZATION SPINE (G3/G5/G6/G7) — the 4th and
  5th of the 6 H.W10 gates. The 4 sibling gates are owned/authored by the other
  lanes: `proof:scene-icons` REVISE (icon lane, already in CI line 492),
  `proof:scene-card-rounded` (G2), `proof:easing-stage-is-ball` (G4),
  `proof:stage-within-docks` (G8 — amends `proof:stage-not-clipped`).
- Both gates measure at 1440×900 (the canonical desktop measure, matching the
  sibling easing browser gates). If H.W8's golden matrix wants 1280 coverage too,
  the loop is trivially widenable (the settle + probe are width-parametric).
