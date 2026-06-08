# impl-w11-gates-layout — H.W11 LANE: the layout-refinement gates (I1 label-subgrid + I6/I7 bezier)

**Wave:** H.W11 · **Lane:** gates-layout (the I1/I6/I7 proof:* set) · **Branch:** `tranche-h-impl`
· **Scope:** AUTHOR three browser-gated proofs — `proof:label-subgrid` (I1), `proof:bezier-single-card`
(I6), `proof:bezier-grown` (I7) — each born-RED on the W9/W10 baseline, GREEN on the W11 fix; CONFIRM
`proof:bezier-no-scroll` (W9 F2) + `proof:single-column-pack` (W9 F1 / W3) STAY green; WIRE all into
`package.json` + `ci.yml`. File-disjoint from the stage lane (I5/I4), the DFA lane (I2), and the
gates-dfa lane (stage/DFA gates). The I1/I6/I7 IMPLEMENTATION was landed by the prior impl pass; this
lane is the GATE-AUTHOR half + the ONE MEASURE-FIRST impl correction it surfaced (the I7 720-viewport
overflow — see §3).

**Status:** LANDED. tsc-clean (`tsc --noEmit` exit 0). All 5 gates GREEN on the W11 dist; all 3 NEW
gates verified born-RED on the HEAD baseline. NOT committed.

---

## §1 — THE THREE NEW GATES (born-RED on the baseline → GREEN on the W11 fix)

| Gate | Item | Born-RED baseline (HEAD) | GREEN (W11) | Mirrors |
|------|------|--------------------------|-------------|---------|
| `proof:label-subgrid` | I1 (S3) | NO `.labeled-field-grid` container exists; the parent `.panel-content` is `flex flex-col`, the rows are per-row `auto 1fr` grids (each its OWN label width) | within each `.labeled-field-grid`, all leaf-row label cells resolve the SAME width AND right-align to ONE track AND the parent is subgrid | `proof:single-column-pack` (settle plumbing) |
| `proof:bezier-single-card` | I6 (S5) | 2 glass-ui Card ancestors (the inner `TimingFunctionPanel.vue:15` Card nested inside the controls Card) | EXACTLY 1 Card ancestor (the inner Card de-nested) | `proof:bezier-no-scroll` (panel-open driver) |
| `proof:bezier-grown` | I7 (S6) | canvas block-size = 160px (W9 `clamp(160px,38cqi,220px)` floor); the `editing: {{ … }}` subtitle renders | block-size > 220px (223px@720 / 232px@900); no "editing:" text node; STILL fits | `proof:bezier-no-scroll` (panel-fit plumbing) |

### `proof:label-subgrid` (I1) — `scripts/proof-label-subgrid.mjs`
Settles on `#/cube` (the canonical 5-row host), pane open, FSM rested. Three falsifiable BROWSER
clauses per `.labeled-field-grid`, measured live:
1. **UNIFORM LABEL WIDTH** — all leaf `.labeled-field-label` cells the SAME computed width (max−min ≤ 1px).
2. **ONE SHARED RIGHT EDGE** — all labels' right edges resolve the same x (max−min ≤ 1px) — the labels
   right-align to ONE track boundary (proving the column is shared, not coincidentally equal).
3. **THE PARENT IS SUBGRID** — each row resolves `grid-template-columns: subgrid` AND the parent is
   `display:grid` — the uniform width is structural, not coincidental.

**Non-vacuity (§Mandate bar):** the subject grid must carry ≥3 leaf rows with DIFFERING label text
(the canonical `#/cube` main grid carries 5: duration/delay/iterations/direction/fill mode). The
LayerConfig grid (blend/z-index/enabled) is a second qualifying subject. A grid with <3 differing rows
is skipped; the gate fails LOUD if NO grid meets the bar. **Born-RED narration:** under W9 NO
`.labeled-field-grid` element exists at all → the non-vacuity clause reds (the uniform track is
missing) — the gate BITES on the absent mechanism, not a vacuous pass.

GREEN measurement (live, 1440×900): main grid — 5 labels all 86.16px, right-edge x=175.36, every row
`subgrid`; LayerConfig — 3 labels all 43.19px, right-edge x=132.39, every row `subgrid`.

### `proof:bezier-single-card` (I6) — `scripts/proof-bezier-single-card.mjs`
Opens the cubic-bézier detail panel via a REAL `.easing-edit-btn` pencil click (the trusted-input
driver `proof:bezier-no-scroll` uses), then counts glass-ui `<Card>` ancestors between the
`.easing-curve-canvas` and the `.controls-layout` root. **A glass-ui Card is identified by its
`data-surface` attribute** — the Card root ALWAYS emits it (`cartoon`/`glass`/…), whereas the
decorative `.easing-curve-canvas-wrapper` carries `rounded-card` but NO `data-surface`, so it is
correctly NOT counted (this distinction is load-bearing — a naive `rounded-card` count would
false-positive on the wrapper). The count MUST be EXACTLY 1 (the controls-pane Card).
**Non-vacuity:** the panel must actually open (fails LOUD otherwise) AND ≥1 Card must be found (a
zero-card render cannot pass as "exactly 1"). **Born-RED:** 2 Card ancestors (`data-surface="cartoon"`
inside `data-surface="cartoon"`) — the exact card-in-card defect.

### `proof:bezier-grown` (I7) — `scripts/proof-bezier-grown.mjs`
A STATIC half (a source grep that the `editing: {{ … }}` subtitle interpolation is GONE from
`TimingFunctionPanel.vue` — belt-and-braces, catches a re-add even when the browser half is skipped;
the regex matches the `editing: {{`-mustache TEMPLATE node, NOT the doubly-quoted `"editing: …"`
narration comments) + a BROWSER half at 1280×720 AND 1440×900 with three clauses:
1. **THE CANVAS GREW** — `.easing-curve-canvas` resolved `block-size` > the W9 220px ceiling.
2. **NO "editing:" SUBTITLE** — no `editing:` text node in the open panel host (the subtree DELETED,
   not `display:none`-suppressed).
3. **STILL FITS** — `scrollHeight ≤ clientHeight` AND `overflow-y ≠ 'scroll'` (the W9
   fit-without-scroll invariant holds — composes with `proof:bezier-no-scroll`).

**Born-RED:** block-size = 160px ≤ 220 (the W9 floor) + the subtitle present (static + browser).

---

## §2 — RECONCILE: the two reference gates STAY GREEN

- **`proof:bezier-no-scroll` (W9 F2)** — GREEN at 1280×720 AND 1440×900 (after the §3 fix). The I6
  de-nest PRESERVED the W9 title-LEFT / dismiss-RIGHT header pattern (re-homed from a `<CardHeader>`
  onto a plain `<div class="flex items-center justify-between">` containing `<h3>cubic-bézier</h3>`
  + the back `<Button aria-label="back to controls">`), so the gate's header-bake clause
  (`backLeft > titleRight`, shared `flex justify-between` header-row ancestor) still resolves true.
- **`proof:single-column-pack` (W9 F1 / W3)** — GREEN. The I1 subgrid keeps ONE left edge per row
  (8 visible leaf rows share x=89, Δwidth=0px, label-left holds) — the one-column invariant is
  PRESERVED and STRENGTHENED (the subgrid ADDS the uniform-label-width clause `proof:label-subgrid`
  locks; it does not relax the one-column-pack).
- **`proof:scene-machine-irrefragable` (W1 keystone)** — GREEN (RECONCILE sanity — the I7 CSS-only
  fix does not touch the FSM; the keystone the new browser gates settle-gate on holds).

---

## §3 — THE MEASURE-FIRST FINDING + FIX (the I7 720-viewport overflow)

**The gate BIT a real impl defect.** Authoring `proof:bezier-grown` at the SAME two viewports
`proof:bezier-no-scroll` uses (1280×720 + 1440×900) surfaced that the landed I7 grow
(`block-size: clamp(232px, 78cqi, 300px); max-block-size: min(300px, 46vh)`) FIT at 1440×900 but
OVERFLOWED at **1280×720** — and broke `proof:bezier-no-scroll` (which the contract requires to STAY
GREEN). Root cause, MEASURED live:

- The detail-panel host caps at `min(50vh, 480px)` — **viewport-HEIGHT bound**: 360px at a 720-tall
  viewport, 450px at 900.
- The non-canvas chrome (title/readout header + preset Select + grid gaps + the wrapper's 0.5rem
  padding) measured 136px (`scrollHeight − canvasBlockSize`, identical at both viewports).
- The `78cqi` term ties the canvas height to the RAIL inline width (296px → 231px), IDENTICAL at 720
  and 900 — so it cannot self-correct for the shorter 360px cap. At 720 the 232px floor + 136px chrome
  = 368 > 360 → 8px overflow → scrollbar.

**The fix (the only impl edit this lane made — `TimingFunctionPanel.vue:271`):**
`max-block-size: min(300px, 46vh)` → `max-block-size: calc(min(50vh, 480px) - 137px)`. The
max-block-size now TRACKS the viewport-height host budget (the host cap minus the measured 136px chrome
minus a 1px sub-pixel guard). Resolved live:

| Viewport | host cap | canvas block-size | scrollH / clientH | grown >220? | fits? |
|----------|----------|-------------------|-------------------|-------------|-------|
| 1280×720 | 360px | **223px** (cap-bound) | 359 / 359 | ✓ (223 > 220) | ✓ |
| 1440×900 | 450px | **232px** (78cqi floor) | 368 / 368 | ✓ (232 > 220) | ✓ |

Both `proof:bezier-grown` AND `proof:bezier-no-scroll` now GREEN at BOTH anchors. The square LAW
(`aspect-ratio:1` from `EasingCurveCanvas` — the 280px-wide canvas) is preserved; the height clamp only
bounds the block axis. The TimingFunctionPanel doc-comment was updated to record the corrected
MEASURE-FIRST math (the prior comment cited a 1440×806 single-viewport measurement that missed the
720 cap). This is the chronic-closure discipline: the gate caught the I7 overshoot BEFORE the H.W8
golden baseline could lock it.

---

## §4 — FILE FOOTPRINT (lane-disjoint)

NEW:
- `scripts/proof-label-subgrid.mjs` — the uniform-label-column subgrid gate (browser).
- `scripts/proof-bezier-single-card.mjs` — the bezier de-nest / single-Card-depth gate (browser).
- `scripts/proof-bezier-grown.mjs` — the bezier-grow + no-subtitle + still-fits gate (static + browser).

MODIFIED:
- `package.json` — the 3 new `proof:*` script entries + their inclusion in `proof:all` (seated next
  to their reuse-siblings: `proof:label-subgrid` after `proof:single-column-pack`; the two bezier
  gates after `proof:bezier-no-scroll`).
- `.github/workflows/ci.yml` — the 3 new gate steps (each `KF_REQUIRE_BROWSER: "1"`, each with a
  BITE-narrating comment), seated next to their reuse-siblings. `proof:ci-coverage` GREEN (all 80
  proof gates invoked in CI).
- `demo/@/components/custom/animation-controls/controls/TimingFunctionPanel.vue` — the ONE
  MEASURE-FIRST impl correction (§3): the I7 `max-block-size` now tracks the viewport-height host
  budget so the grown canvas fits at 720 too. CSS-only; tsc-clean.

NOT touched: the engine (`src/animation` — FENCED, inv ζ); the W1 reducer; the stage/DFA files
(other lanes); glass-ui (inv-16 — the LabeledField subgrid-participation primitive is the durable
HANDOFF recorded in design-idioms.css §LABEL-subgrid; the demo-side `.labeled-field-grid` wrapper is
the born-GREEN path-B fix that lands now).

---

## §5 — VERIFICATION LEDGER

- `tsc --noEmit` — exit 0 (after the §3 fix).
- `npm run gh-pages` — builds clean.
- born-RED verification (the 3 new gates, run against a HEAD-restored dist — the gate-target files
  temporarily restored to HEAD via `git checkout HEAD -- …`, built, gates run, then restored
  byte-identical via md5-verified backups, the non-invasive idiom the stage lane used):
  - `proof:label-subgrid` exit=1 (no `.labeled-field-grid` container).
  - `proof:bezier-single-card` exit=1 (2 Card ancestors).
  - `proof:bezier-grown` exit=1 (block-size 160px ≤ 220 + subtitle present, static + browser).
- GREEN verification (all 5 against the proper W11 dist): `proof:label-subgrid` / `proof:bezier-single-card`
  / `proof:bezier-grown` / `proof:bezier-no-scroll` / `proof:single-column-pack` — all exit 0.
- `proof:scene-machine-irrefragable` — exit 0 (W1 keystone holds — RECONCILE).
- `proof:ci-coverage` — exit 0 (all 80 proof:* gates invoked in CI; concurrency + version-literal +
  registry hygiene green).

**Coordination note:** at impl time the stage lane (I5/I4), the DFA lane (I2), and the gates-dfa lane
(stage/DFA gate wiring + ci.yml) had landed their working-tree changes concurrently. This lane's
ci.yml + package.json edits are append-disjoint from theirs (new steps/scripts seated beside the W9
reuse-siblings, not overlapping the W11 stage/DFA gate blocks). No other lane's content was altered.
