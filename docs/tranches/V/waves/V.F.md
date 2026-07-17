# V.F — DESIGN PROPORTION (W11)

The owner's design lens, executed on the rendered real-Glass demo. Evidence
base: `../audit/R2-01-visual-design.md` (DP2 rows + 28 captures),
`../audit/R3-03-residual-gaps.md` (RG rows + closed-state captures),
`../audit/R3-01-fresh-eyes.md` (FE-4). The banked BEFORE set (40 PNGs) lives at
`../audit/design-captures/` and is COPIED to `../audit/screenshots/before/` at
W11 open; AFTER captures go to `../audit/screenshots/after/`.

---

# V.W11 - Proportion & Affordance

**Name**: W11 - Proportion & Affordance
**Opens after**: W1 (rendering demo); full fidelity after W2 (real registry
Glass 7)
**Agents**: 2 (design-fix unit; π/DELTA unit). ALL design adjudication routes
through the orchestrator (Fable) with the frontend-design discipline; the
units execute ratified refinements only.
**Hard gate**: π (≥3 viewports, ≥5 timing samples per modified transition,
AA contrast on touched surfaces) + `DELTA.md` pairing before/after for EVERY
page; owner decisions resolved, never proxied
**Status**: blocked (W1); born RED (the BEFORE baseline exists; no AFTER)

### Goal criterion

The demo's cards, spacing, dividers, and small controls read as one
proportional system with glass-ui suffusion, with every superfluous element
removed and every invisible affordance surfaced — to the owner's taste, not
a critic proxy's.

### Scope

1. DP2-04: Select trigger renders the easing NAME only (custom SelectValue
   slot in `ChannelOptions.vue:219-222`); the name+description collapse
   ("ease-in-outslow start & end") dies.
2. DP2-05: the easing PRESET card's ~130px dead band — tighten the card's
   vertical distribution to the panel's 16px rhythm.
3. DP2-07: spring physics sliders — confirm the solid-orange lozenge styling
   against the scene's heatmap accent intent; refit to the slider family
   palette if unintentional (source: `demo/scenes/spring/`).
4. DP2-06 **OWNER DECISION ROW** (present, do not decide): one transport home
   per scene class — the in-panel transport card AND the floating pill
   currently duplicate play controls on cube/amiga/square/easing. Options
   packet with captures goes to the owner; implementation follows the ruling.
5. RG-2 demo-side rest affordance: at narrow/collapsed dock the Open-controls
   toggle is hidden (host layer `pe:none/opacity:0` + button off-screen at
   x=441/390). The dock internals are glass-root (batch packet); the demo-side
   question — whether the drawer peek (top=743/844 grab handle) suffices as
   the at-rest reopen affordance at 390 — is part of the owner packet.
6. FE-4: dev favicon 404 (`demo/app/index.html:31` path outside the dev
   root) — move under the served dir.
7. π/DELTA: the AFTER capture of EVERY page at 390/1280/1440 (+375 if the
   glass matrix demands), paired against the BEFORE set — the 40 PNGs banked at
   `docs/tranches/V/audit/design-captures/`, COPIED to
   `docs/tranches/V/audit/screenshots/before/` at W11 open, with AFTER captures
   landing in `docs/tranches/V/audit/screenshots/after/`; `DELTA.md` naming
   the intended change per page and asserting no unintended regression
   (occlusion/overlap/clipping, contrast, layout shift). The harness is W1's,
   re-run — one scripted instrument for open and close.
8. The FAM-10 a11y quintet (R1-13): AY-1 amiga passes `respectReducedMotion:true`
   to its three infinite animations + gates the sphere spin on `matchMedia`;
   AY-2 Monaco `accessibilitySupport` → `'auto'` (`CSSCodeEditor.vue:144`);
   AY-3 MatrixEditor 16 cell aria-labels from `matrixCellMeta` + aria-hidden
   axis; AY-4 TimelineCaret input aria-label; AY-5 LayerConfigPanel
   `aria-errormessage` wired to `aria-invalid` or retired.

### Triumvirate Dispatch

Triggers: a refinement that needs a glass primitive change (halt → packet);
DELTA showing an unintended cross-page regression; owner ruling pending
beyond the band window (the wave closes `complete_with_misses` rather than
proxying); a third diagnostic loop on one unit of work halts into triumvirate.

### File Bounds

| File | Access |
|---|---|
| `demo/components/instrument/transport/channel-controls/**` (DP2-04/05) | modify |
| `demo/scenes/spring/**` (DP2-07) + `demo/scenes/easing/**` (DP2-05 card) | modify |
| `demo/app/index.html` (FE-4 favicon) | modify |
| the AY quintet targets: `demo/scenes/amiga/**` (AY-1), `CSSCodeEditor.vue:144` (AY-2), MatrixEditor + TimelineCaret + LayerConfigPanel (AY-3/4/5) | modify |
| `docs/tranches/V/audit/screenshots/**` + `DELTA.md` | create |

Do NOT touch: glass-ui; the transport duplication (until ruled); `scenes/`
beyond the named rows.

### Disjointness

The design-fix unit writes demo source only; the π/DELTA unit writes only
`audit/screenshots/**` and `DELTA.md`. No shared paths.

### Worktree Plan

Parallel units either commit-before-parallelize on the shared line or take
sibling worktrees `/Users/mkbabb/Programming/keyframes-v-w11<unit>` per
WAVE_SPEC §4b; the orchestrator runs `git worktree list` before dispatch.

### Agent Units

#### V.W11.a Ratified Refinements
- Goal: the ratified proportion/affordance/a11y rows land demo-side.
- Sub-gate: check + test:demo green, AY quintet verified.

#### V.W11.b The π/DELTA Instrument
- Goal: every page's before/after paired and adjudicated.
- Sub-gate: DELTA.md complete, zero unintended regressions or triaged reds.

### Hard Gate

1. `DELTA.md` complete: every page paired, intended changes named, unintended
   regressions zero (or triaged red).
2. π coverage: 3 viewports; ≥5 frames on each modified transition; AA
   contrast measurements for touched surfaces.
3. The DP2-06 + RG-2 owner packet exists with captures and options; rulings
   recorded verbatim when given.
4. The AY quintet verified per row (attribute present + one manual/axe check).

### Format And Lint Cadence

check + test:demo after fixes; capture harness identical open/close.

### Verification Artefacts

`screenshots/{before,after}/`, `DELTA.md`, the owner packet, contrast table.

### Commit Plan

`refine(demo/design): proportion + affordance (V.F)` per ratified batch;
owner-ruled items commit separately citing the ruling.

### Dependencies

- **Depends on**: W1 (rendering demo), W2 (real Glass fidelity), W8 (stable
  component anchors). **Blocks**: W13.
