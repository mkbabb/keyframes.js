# H.W3 IMPLEMENT — gate lane: `proof:timeline-rail-width` (+ the mobile full-bleed companion)

**Branch:** `tranche-h-impl` · **Phase:** IMPL · **Lane:** gate-author (the width-binding lock).
**NOT committed** — edits left in tree. The gate file is `.mjs` (out of tsc scope); the full
project is `npx tsc --noEmit` clean (exit 0, re-run after the transposition + this lane).

The transposition itself (S3/S1/S2/S3b/S4) landed in the working tree under the cohesive-owner
pass (see `impl-w3-changes.md` + `impl-w3-impl.md`). This lane AUTHORS + WIRES the
`proof:timeline-rail-width` gate per H.W3.md §Hard gate + WV-W3-MED-3, and PROVES it bites.

---

## §The gate (file: `scripts/proof-timeline-rail-width.mjs`)

Pure-measurement browser gate (no static half — the source-shape no-cap / `width`-not-
`min-width` lock is `proof:demo-shell-grid`'s grep). Mirrors `proof-dock-popover-opens.mjs` /
`proof-demo-usability.mjs`: a `serveDist` http server over `dist/gh-pages/` + Playwright; the
`KF_REQUIRE_BROWSER=1` skip→hard-fail discipline (a playwright-absent or dist-absent skip
becomes a hard CI failure so the binding cannot pass vacuously).

### Clause 1 — RAIL-WIDTH BINDING (1440×900, `#/cube`, pane OPEN, settled)

The four surfaces the user perceives as "the controls column" all resolve to ONE width:

- **border-box budget (±2px):** `#timeline-expanded-target` === `.controls-content` ===
  `parseFloat(--rail-width)` — all `400px` live.
- **content-box / root (±2px):** the `AnimationControls` root === `.controls-content`
  CONTENT-box, AND within the rail budget (`rail − 14 ≤ acW ≤ rail`). Live: the root is
  `388px` = `400 − 0 padL − 12 padR` — it `w-full`s into the pane MINUS the documented 12px
  shadow-clearance padding (S3 `box-sizing: border-box` keeps that pad INSIDE the budget,
  `impl-w3-changes.md` S3 item 2). The 768 cap is dead.

**Why content-box, not a flat four-way `=== --rail-width ±2px`:** the literal four-way equality
the prompt sketches CANNOT hold against the landed tree — the root is intentionally inset 12px
(the shadow-clearance pad lives on `.controls-content`, the root sits inside it). A flat
`±2px === 400` on the root would FAIL spuriously (Δ=12) on a CORRECT transposition. The honest,
biting form binds the root to the thing it actually fills (the pane content-box = `400 − 12`)
AND asserts it is within the rail budget (≤ rail, ≥ rail − 14). This kills the 768 regression
(the root at 768 fails BOTH the content-box equality AND the budget clause) without manufacturing
a false-RED on the deliberate pad. The two source lanes frame it both ways —
`a-timeline-width §5(1)` says `root === parseFloat(--rail-width) ±2`; `a-demo-architecture F2`
says `#timeline-expanded-target === .controls-content ±1`; the content-box form reconciles them:
the border-box surfaces (timeline, pane) === `--rail-width`; the root === pane content-box.

### Clause 2 — MOBILE RIBBON FULL-BLEED companion (390×740, `#/cube`)

The desktop fixed `width: var(--rail-width)` (a `@media (min-width:1024px)` rule) must NOT leak
into mobile:
- **no-cap-leak:** `.controls-content` (`296px` live) scales WELL below the desktop
  `--rail-width` (`400px`) and ≤ viewport — the desktop fixed width does not apply at 390.
- **ribbon ≈ pane:** the ribbon card (`252px` live) tracks `.controls-content` (`296px`) within
  the RibbonBar `pl-4/pr-7` inset (≤48px slack) — full-bleed retained for the H.W7 bottom-sheet.

### Settle-gate (WV-W3-MED-3 / §Hard gate harness note)

- `#/cube` via direct hash (the H.W1 FSM reconciles the hash on cold load; pane-open is the
  store default `isControlsPanelOpen: true`). Verified: direct goto lands the named grid clean.
- viewport **re-asserted AFTER navigation** (`setViewportSize`) — Playwright resets to 390 on
  navigate; the named desktop grid only applies ≥1024.
- the settle PREDICATE is the named grid resolving: poll until
  `getComputedStyle('.controls-layout').gridTemplateColumns` first px track === `--rail-width`.
  This single predicate witnesses route-rested + desktop + open in one shot.
- **`.controls-pane--mobile` is NOT the desktop witness.** That class is UNCONDITIONAL in the
  `ControlsPaneWrapper.vue:7` markup (a static string in the class array) — desktop vs mobile
  is decided by the @media-applied grid, not a JS class. WV-W3-MED-3's "assert no
  `controls-pane--mobile`" is therefore WRONG against this implementation; the resolved
  `[rail] var(--rail-width) [stage]` grid is the correct desktop-state witness. (Recorded so a
  future audit does not "fix" the gate toward the dead class assertion.)
- `≥500ms` rest after the grid resolves; cross-refs H.W1 `proof:no-route-storm` as the
  flake-defeat (D12 churn cannot flap once the grid has resolved).

---

## §Proof it BITES (born-RED-today / GREEN-on-fix)

Validated by reverting the 7 W3 files to pre-W3 (`HEAD` = 256f6fe, after W0+W1, before W3),
rebuilding `dist/gh-pages`, running the gate, then restoring the working-tree W3 edits via a
saved `git diff` patch (tree byte-identical after restore; the dead `--controls-pane-width`
token grep is empty).

| tree | clause 1 | clause 2 | exit |
|---|---|---|---|
| **pre-W3** (cap + `min-width` floor + 3-track grid) | ✗ (named grid never resolves — `--rail-width` undefined) | ✗ (no-cap-leak: `--rail-width` = NaN) | **1 (RED)** |
| **W3** (the transposition) | ✓ `400/400/400` border-box · `388/388` content-box | ✓ `296` content / `252` ribbon at 390 | **0 (GREEN)** |

**The pre-W3 three-regime spread, measured directly** (1440×900, `#/cube`, pane open):

| surface | pre-W3 | W3 |
|---|---|---|
| grid `gridTemplateColumns` | `1353.59px 0px 0px` (the vestigial `1fr 1fr` collapsed to 0) | `[rail] 400px [stage] 953.594px` |
| `#timeline-expanded-target` | `1353.59px` (`col-span-full`) | `400px` ([rail] track) |
| `.controls-content` | `1353.59px` (the `min-width` floor stretched) | `400px` (`width`) |
| `AnimationControls` root | **`768px`** (`lg:max-w-screen-md`) | `388px` (content-box) |
| `--rail-width` | `""` (token was still `--controls-pane-width` = 400, honored by nothing) | `400px` |

Three numbers, zero agreement (`1353.59 / 768 / 400`) — the §Hard gate's "1272/768/400 today"
spread (the lane's `1272` was its pane-open content capture; my cube measurement reads `1353.59`
because the cube stage is wider — the BITE is identical: root ≠ content ≠ rail). Greens only when
all four resolve to the one token.

Skip-vs-hard-fail semantics verified: clean skip (exit 0) without `KF_REQUIRE_BROWSER`; hard-fail
(exit 1) with `KF_REQUIRE_BROWSER=1` when playwright/dist absent.

---

## §Wiring

- **`package.json`** — added `"proof:timeline-rail-width": "node scripts/proof-timeline-rail-width.mjs"`
  (the named script) AND chained it into `proof:all` (after `proof:single-toggle`, before
  `proof:scene-machine-irrefragable` — beside the other H.W1/W3 browser gates).
- **`.github/workflows/ci.yml`** — added the step to the demo browser-gate job (after
  `proof:single-toggle`, before `proof:computed-real-dom`) with `KF_REQUIRE_BROWSER: "1"`, so it
  rides the existing `npm run gh-pages` build + the `npm i --no-save @playwright/test` + chromium
  install already in that job.

## §Files touched (this lane)

- `scripts/proof-timeline-rail-width.mjs` (NEW)
- `package.json` (named script + `proof:all` chain)
- `.github/workflows/ci.yml` (the CI step)
- `docs/tranches/H/audit/harden/impl-w3-gate-rail-width.md` (this note)

## §Notes for adjacent gate lanes (de-dup)

- The AnimationControls-root selector is `.controls-content .z-content.isolate` (visible).
  Caution: the visualizer balls are also `.z-content` but NOT `.isolate` — scope to `.isolate`.
- This gate does NOT assert the source-shape (no-cap / `width`-not-`min-width`); that is
  `proof:demo-shell-grid`'s grep half (the no-legacy lock). Keep them disjoint — this lane is the
  live numeric binding only.
- `proof:stage-not-clipped` (the S4 MEASURE-FIRST guard) is a SEPARATE gate (pane open AND closed,
  stage within viewport at 1280/1440) — not this lane.
