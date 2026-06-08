# H.W3 IMPL — gate lane: `proof:demo-shell-grid` + `proof:stage-not-clipped`

**Branch:** `tranche-h-impl` · **Phase:** IMPL · **Lane:** gate (the WV-W3-HIGH-1
architecture lock + the WV-W3-HIGH-3 / S4 MEASURE-FIRST stage guard).
**NOT committed** — edits left in tree. `npx tsc --noEmit` = 0 errors (whole tree).
The S1–S4 transposition itself landed via the `implement` lane (see
`impl-w3-changes.md`); THIS lane authors the two gates that lock it, reconciles the
one existing gate the global rename broke, and wires everything into
`package.json` + `.github/workflows/ci.yml`.

---

## §What this lane owns

Two of the three H.W3 §Hard-gate gates:

1. **`proof:demo-shell-grid`** (WV-W3-HIGH-1) — `scripts/proof-demo-shell-grid.mjs`.
   THREE clauses (mirrors `proof-demo-usability.mjs` / `proof-dock-popover-opens.mjs`
   — a STATIC half that always runs + a BROWSER half gated on playwright, hard-fail
   under `KF_REQUIRE_BROWSER`):
   - **(1) no-legacy grep** (static) over the S1–S4 rewrite files PLUS
     `TimingFunctionPanel.vue` (in scope via S3b), EXCLUDING
     `AssetPropertiesPanel.vue` by NOT being in the file set (WV-W3-HIGH-1 — a
     separate tree). ZERO surviving `grid-cols-[auto_1fr]`, `grid-cols-[subgrid]`,
     `col-span-2`, `col-end-4`, `col-span-full`, `grid-template-columns: subgrid`.
     Source is COMMENT-BLANKED first (the `blankComments` idiom borrowed from
     `proof-idioms.mjs`) so the doc-comments naming the deleted apparatus (the
     `AnimationControlsControls.vue:300-301` crossfade note, the
     `AnimationControlsGroup.vue:54` `col-end:-1` fallback note) do NOT
     false-positive — only LIVE markup/CSS counts.
   - **(2) dead-token grep** (static, TREE-WIDE) — `--controls-pane-width` survives
     NOWHERE in the live source tree (`demo/` + `src/`, comment-blanked). 197 files
     scanned. The scope deliberately EXCLUDES `scripts/` + `dist/` + `docs/`: gate
     scripts legitimately carry the literal as a search pattern (self-reference),
     and `docs/` is historical. The deletion clause is the global-rename lock per
     the contract ("0 occurrences anywhere [in the live tree]; W4/W5 must never
     reference the dead token").
   - **(3) named-template computed** (browser) — at ≥1024 the shell root
     `.controls-layout` resolves EXACTLY to `[rail] var(--rail-width) [stage] 1fr` ×
     `[top] auto [stage] 1fr [bottom] auto`: the `[rail]`/`[stage]` column line
     names + exactly TWO column tracks (the dead `1fr 1fr` is gone) + the first
     track px == resolved `--rail-width` (±2px) + the three named row tracks.

2. **`proof:stage-not-clipped`** (WV-W3-HIGH-3 / the S4 MEASURE-FIRST guard) —
   `scripts/proof-stage-not-clipped.mjs`. ONE browser clause: at 1280 AND 1440,
   pane OPEN AND CLOSED (4 cases), the `[stage]` cell (`.stage-cell`) bbox is FULLY
   within the viewport (left ≥ 0, right ≤ innerWidth, top ≥ 0, bottom ≤ innerHeight,
   ±1px), with a `width·height > 0` non-vacuity guard. This is the B.W3
   "cube half-clipped" invariant; it is the gate that lets S4 ship the stronger
   `[stage]`-track form, with the `col-end-4` conservative span as the documented
   fallback if it ever clips.

(The third §Hard-gate gate, `proof:single-column-pack`, and the
`proof:timeline-rail-width` width-binding gate, are OTHER lanes' — see
`impl-w3-gate-rail-width.md`. I did not touch them.)

---

## §Settle-gate (every browser clause, WV-W3-MED-3)

Both gates SETTLE-GATE on the H.W1 FSM resting:

- **In-page hash assignment, NOT `page.goto`** — the scene switch is
  `location.hash = "#/cube"` (funnels through the H.W1 `afterEach` reader →
  `NAVIGATE` → echo-guarded writer, the same reconcile fixed point as the in-app
  combobox). `goto` clears storage + kills the reconcile trap (the WV-W1 harness
  note), so it is forbidden mid-test.
- **Wait for the machine to rest on `cube`** — `waitForFunction` on
  `localStorage[keyframes-js-scene-machine].activeScene === "cube"`.
- **Viewport RE-ASSERTED after navigation** — `setViewportSize` AFTER the hash nav
  (Playwright can reset to 390 on a navigation; ≥1024 is the desktop-branch
  precondition).
- **Pane OPEN** (and CLOSED, for the stage gate) — set EXPLICITLY by persisting the
  `isControlsPanelOpen` control-store flag + toggling the live
  `controls-layout--open/--closed` class (the SSOT for the `[rail]`-track collapse).
- **Route rested ≥500ms** + **grid settled to `--rail-width`** before measuring
  (`waitForFunction` until the `[rail]` line names are present + the first track px
  == `--rail-width`).
- Cross-ref H.W1's `proof:no-route-storm` as the flake-defeat (the D12 churn cannot
  flap the measurement).

**On the `controls-pane--mobile` precondition (a divergence from the literal
contract phrasing):** the contract says "assert the JS DESKTOP state (no
`controls-pane--mobile` class)." LIVE-VERIFIED: `controls-pane--mobile` is a STATIC
class on `ControlsPaneWrapper.vue:7` (always present, every viewport) — it is NOT a
JS desktop/mobile discriminator. So a class-absence check would be born-RED
vacuously and never green. The CORRECT, equivalent desktop assertion (and the one
both gates use) is the COMPUTED named grid: the `[rail] var(--rail-width) [stage]
1fr` line-named template is emitted ONLY by the `@media (min-width: 1024px)` branch,
so its resolution IS the desktop-state witness. Recorded here so the divergence is
explicit, not silent.

---

## §MEASURE-FIRST (the S4 gate is gated by a live measure)

Per S4's MEASURE-FIRST discipline I measured the live built demo (`#/cube`, route
rested, JS desktop, both pane states) BEFORE finalizing the gate's GREEN bounds.
Live capture (matches `impl-w3-changes.md §Resolved shell-root grid-template`):

| viewport | state | grid-template-columns | stage bbox x | within viewport |
|---|---|---|---|---|
| 1280×900 | open  | `[rail] 400px [stage] 803.188px`  | `[438,1242] ⊂ [0,1280]` | YES |
| 1280×900 | closed| `[rail] 0px [stage] 1203.19px`    | `[38,1242]  ⊂ [0,1280]` | YES |
| 1440×900 | open  | `[rail] 400px [stage] 953.594px`  | `[443,1397] ⊂ [0,1440]` | YES |
| 1440×900 | closed| `[rail] 0px [stage] 1353.59px`    | `[43,1397]  ⊂ [0,1440]` | YES |

grid-template-rows = `[top] 0px [stage] 792px [bottom] 0px` (the named `auto/1fr/
auto` form; empty `auto` rows collapse to 0). `--rail-width` = `400px`.

**Decision (WV-W3-HIGH-3):** the stronger `[stage]`-track form is un-clipped in all
4 cases → S4 SHIPS the `[stage]`-track form; the `col-end-4` conservative span
fallback is NOT needed. `proof:stage-not-clipped` is the gate of record for that
decision (it reds if a future change reintroduces a clip).

---

## §BITE (each gate bites; verified)

- **no-legacy grep** — injected `grid-cols-[auto_1fr]` into `LayerConfigPanel.vue`
  → RED (1 occurrence, `:N — grid-cols-[auto_1fr] (the two-track grid — S1/S3b)`);
  reverted → GREEN. (The pre-W3 tree had all six tokens live — born-RED-today,
  GREEN-on-fix, as the lanes attest.)
- **dead-token grep** — injected `var(--controls-pane-width)` into
  `design-idioms.css` → RED (1 live occurrence); reverted → GREEN. (The pre-S3 tree
  defined + consumed the token — born-RED, GREEN-on-rename.)
- **named-template computed** — bites on a revert to
  `grid-cols-[var(--controls-pane-width)_1fr_1fr]` (the line names + the 2-track
  count vanish; the lane-attested born-RED on the pre-W3 3-track grid).
- **stage-not-clipped** — bites on any stage span that pushes the subject off-screen
  (`right > innerWidth`); the B.W3 born-RED. The non-vacuity guard (`w·h > 0`)
  forbids a green on a missing/zero-size `.stage-cell`.

All clauses run GREEN against the freshly-built `dist/gh-pages/` (rebuilt with the
landed S1–S4 edits): `proof:demo-shell-grid` = 4/4 ✓, `proof:stage-not-clipped` =
4/4 ✓.

---

## §Reconciled — the existing gate the global rename broke

The S3 `--controls-pane-width` → `--rail-width` rename is GLOBAL; an EXISTING gate
consumed the dead token in LIVE assertions and would have (a) gone RED on the
landed transposition and (b) carried the dead token string tree-wide (violating the
deletion clause). Reconciled as part of the one cohesive change:

**`scripts/proof-idioms.mjs` clause 8 (the G.W10 token-coupling lock):**
- `8a` owned-token: `--controls-pane-width (layout token)` → `--rail-width (layout
  token)` (the def-presence assertion + the regex).
- `8c` tokenized-coupling: the GROUP grid-track assertion moved from the Tailwind
  `lg:grid-cols-[400px…]` / `var(--controls-pane-width)` form to the scoped-CSS
  `grid-template-columns: … 400px` / `var(--rail-width)` form; the PANE assertion
  moved from `min-width: var(--controls-pane-width)` (a floor) to `width:
  var(--rail-width)` (the exact width — the S3 floor→width change).
- Comments + the success-log line de-referenced the dead token.

`proof:idioms` re-run = PASS (the `--rail-width` coupling is honored, zero scene
re-fork). After this, the ONLY live-source-tree occurrence of the dead literal is
the search-pattern strings inside the gate scripts themselves (out of the
`demo/`+`src/` dead-token grep scope, by design).

---

## §Wiring

- **`package.json` scripts:** added `proof:demo-shell-grid` +
  `proof:stage-not-clipped` (after `proof:timeline-rail-width`); both added to
  `proof:all` (after `proof:timeline-rail-width`).
- **`.github/workflows/ci.yml`** (demo job, after `proof:timeline-rail-width`): both
  as named steps with `KF_REQUIRE_BROWSER: "1"` (a playwright-absent skip becomes a
  hard CI fail — the browser halves cannot pass vacuously). They ride the demo job
  AFTER the `npm run gh-pages` build (they serve the built `dist/gh-pages/`).
- **`proof:ci-coverage`** re-run = PASS — now counts 46 invoked `proof:*` gates (was
  44), confirming both new gates are recognized as wired into BOTH `package.json`
  AND `ci.yml`.

---

## §Files touched (this lane)

- `scripts/proof-demo-shell-grid.mjs` (NEW)
- `scripts/proof-stage-not-clipped.mjs` (NEW)
- `scripts/proof-idioms.mjs` (clause 8 reconciled to `--rail-width` + the new
  grid/width forms)
- `package.json` (2 script entries + `proof:all`)
- `.github/workflows/ci.yml` (2 demo-job steps)

NOT touched: the S1–S4 `.vue`/`.css` transposition (the `implement` lane's),
`proof-timeline-rail-width.mjs` / `proof:single-column-pack` (other lanes'),
`AssetPropertiesPanel.vue` (out of scope), the panel crossfade (ALREADY-SOTA).
