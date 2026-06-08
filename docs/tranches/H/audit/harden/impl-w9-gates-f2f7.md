# impl-w9-gates-f2f7 — the F2 + F7 browser gates (bezier-no-scroll · cartoon-shadow-unclipped)

**Wave:** H.W9 — design-language refinement round 2 (feedback fold F1–F9).
**Lane:** GATES (F2 + F7) — author the two NEW browser gates, wire them, verify they bite.
**Branch:** `tranche-h-impl`. **Status:** LANDED. Both gates GREEN on the fixed tree, both BITE
born-RED on the reverted form. tsc-clean (lib `check:lib` exit 0 — all edits are gate scripts +
package.json + ci.yml). **git:** NOT committed (per wave instruction).

**Files authored/touched (file-disjoint from the impl lanes A/B/C + the other gate lanes):**
- `scripts/proof-bezier-no-scroll.mjs` — NEW (F2).
- `scripts/proof-cartoon-shadow-unclipped.mjs` — NEW (F7).
- `package.json` — 2 script entries + both added to `proof:all`.
- `.github/workflows/ci.yml` — both wired into the demo-smoke job, browser-gated (`KF_REQUIRE_BROWSER: "1"`).

The two NEW gates mirror the panel-measurement / viewport-containment plumbing of their W4/W3
siblings (`proof:easing-canvas-bounded`, `proof:stage-not-clipped`): the same serveDist + Playwright +
in-page `#/cube` hash pin + pane-open + viewport-re-assert settle, all settle-gated on the H.W1 FSM
resting. Browser-only (a scroll / a clip is a rendered fact — no static half); under
`KF_REQUIRE_BROWSER` a playwright-absent skip becomes a hard fail.

---

## proof:bezier-no-scroll (F2 — the bezier-panel fit + header-bake lock) — NEW

**Subject:** the cubic-bézier detail panel, opened via a REAL click on the live `.easing-edit-btn`
pencil (the `detailPanelDismissed` ref is component-internal — no localStorage backing — so a trusted
click is the correct driver, the `proof:dock-popover-opens` idiom). Two clauses at **1280×720 AND
1440×900** (the shorter 720 viewport is the harsher case for the `min(50vh,480px)` cap → 360px at 720):

1. **NO VERTICAL OVERFLOW.** The detail-panel host `.panel-row--detail.panel-row--active >
   .panel-content` (the `max-height: min(50vh,480px); overflow-y:auto` cap, AnimationControlsControls.vue:331-334)
   resolves `scrollHeight ≤ clientHeight + 1` AND `overflowY !== 'scroll'`.
2. **HEADER-RIGHT BAKE.** The `[aria-label="back to controls"]` ghost button is INSIDE the bezier
   panel host, to the RIGHT of the `cubic-bézier` CardTitle (`backLeft > titleRight`), and shares a
   header-row ancestor with the title (a header sibling, not an external pre-card button).

**Settle subtlety (fixed during impl):** the `.panel-row` row-expand `grid-template-rows: 0fr→1fr`
transition means a too-early measure catches a transient collapsed host (`clientHeight ≈ 4px` = just
the `.panel-content` 2px padding, while `scrollHeight` already reads the full content → a FALSE
overflow). The opener now waits for the host's `clientHeight` to STOP CHANGING across consecutive
samples (the animated row settled) — this works whether the final state FITS or OVERFLOWS, so the
born-RED overflow case still measures a real, stable, capped host (not masked as "never opened").

**BITE proof (verified live):** revert the header to the pre-F2 born-RED form (an external top-LEFT
`<Button>` ABOVE the Card + a title-only header), rebuild, run →
- no-scroll REDS at 1280×720 (`scrollHeight 365 > clientHeight 360` — the external button row pushes
  the panel past the 360px short-viewport cap → a scrollbar);
- header-bake REDS at BOTH viewports (`backLeft 83/88 ≤ titleRight 215/220` — the external top-LEFT
  button is to the LEFT of the title);
- gate exits 1. Restore → both GREEN at both viewports, gate exits 0.

**NAMED-delta finding (MEASURE-FIRST):** the F2 spec lists the tighter in-panel canvas ceiling
(`clamp(160px,38cqi,220px)`, TIGHTER than W4's full-rail 280) as a fit lever. Live, the canvas renders
at the clamp FLOOR **160px** at the detail-panel rail width (`38cqi` of the ~332px panel ≈ 126px <
160px floor), so the 220-vs-280 ceiling is MOOT — the dominant fit term is the HEADER-BAKE removing
the external button row, not the canvas clamp. The canvas ceiling stays a documented NAMED
panel-context delta (square law preserved — the canvas keeps `aspect-ratio:1`); it is simply not what
the no-scroll bite turns on. This does NOT contradict `proof:easing-canvas-bounded` (W4's full-rail
280 ceiling + square law hold on the EasingSidebar full-rail render).

---

## proof:cartoon-shadow-unclipped (F7 — the cartoon-stamp clearance lock) — NEW

**Subject:** the active panel Card (`.controls-content [data-surface="cartoon"]`, hovered so the
WORST-CASE `--shadow-cartoon-lg` -6px + `--lift-sm` -1px translate ≈ 8px left throw is in effect) at
**1280×900 AND 1440×900**. The resolved `box-shadow` is parsed browser-side for its leftmost extent
(the most-negative `offsetX − blur − spread` across all layers; comma-split is paren-aware so
`color()/color-mix()` commas don't confuse the layer split). Two clauses + three non-vacuity guards:

- **CLAUSE (a) F7 MECHANISM:** `.controls-content` resolves `padding-left ≥ 8px` (the defensive
  clearance F7 adds ≥ the ~8px worst-case throw).
- **CLAUSE (b) CONTAINMENT:** the shadow's leftmost pixel (`cardLeft − leftThrow`) is ≥ the
  `.controls-pane-wrapper` box-left (the load-bearing `overflow:hidden` clip boundary the bottom-LEFT
  lobe must not cross).
- **NON-VACUITY:** (a) the Card has real area; (b) the shadow genuinely casts LEFT (a real positive
  throw — a glass-ui rename to a non-left-casting family fails LOUD); (c) the wrapper actually resolves
  a left-clipping overflow (`hidden`/`clip`/`scroll`/`auto`) — a non-clipping wrapper (which could not
  slice anything) reds.

### MEASURE-FIRST FINDING (the load-bearing honesty — read this)

The §Hard-gate framed `proof:cartoon-shadow-unclipped` as **born-RED today**, assuming a Card flush
against the pane edge so a left-throwing shadow would exit the clip. **The live LANDED tree does not
reproduce that slice**, and I verified it with rendered screenshots of both states:

- The active panel Card already carries a **~16px inner inset** from the wrapper's clip edge — the
  `AnimationControls` filing-tab content wrapper is `pl-4 pr-7` (`padding-left:16px`). That inset ALONE
  exceeds the ~8px worst-case shadow throw, so the shadow's left lobe clears the `overflow:hidden`
  boundary **even with `.controls-content padding-left:0`** (born-RED state: card-left 59, clip-left
  43.2, shadow leftmost ≈52 ≥ 43.2 — NOT sliced; screenshot `/tmp/pane-bornred.png` shows the full
  left lobe rendered).
- F7's `.controls-content padding-left:12px` is therefore a **DEFENSIVE** clearance that widens the
  margin (16→28px), not the sole barrier against a slice.
- Geometrically, a `.controls-content` padding-left change **translates the Card AND any
  `.controls-content`-relative reference IDENTICALLY**, so NO purely-geometric containment clause can
  born-RED on that toggle (the spec's `.controls-pane content-box left` reference is itself fixed at
  43.2 regardless of the child's padding — both states pass it). I confirmed this: the first gate
  draft, written against the padded `.controls-content` interior, passed in BOTH the fixed and the
  padding-stripped states — it did NOT bite.

**Honest disposition (recorded, not a faked red):** the faithful, biting reference is the wrapper's
`overflow:hidden` box edge (the clip boundary that does NOT move with the child padding). The gate is a
**STRUCTURAL-INVARIANT CONTAINMENT GUARD** — exactly the class of `proof:stage-not-clipped`, which the
§Hard-gate itself names as the plumbing to mirror, and which ALSO ships GREEN on the landed [stage]
form and bites on a regression (the col-end-4 fallback). This gate:
- ships GREEN on the landed tree (the containment invariant holds with margin), AND
- BITES via the F7-mechanism clause (a) — `padding-left` dropped below the 8px throw REDS — which is
  the load-bearing assertion that distinguishes the fixed tree from the pre-F7 tree, AND
- BITES on the containment clause (b) for any future regression that pushes the lobe past the clip
  (Card shoved flush + throw widened, the inner inset removed, the clip moved, or the rail narrowed so
  the clearance falls below the throw).

**BITE proof (verified live):** strip `.controls-content padding-left:12px`, rebuild, run → the
F7-mechanism clause (a) REDS at BOTH viewports (`padding-left 0px < 8px`); gate exits 1. Restore →
GREEN, gate exits 0. (The containment clause (b) stays green in both states — correctly: the
pre-existing `pl-4` inset keeps the lobe inside the clip regardless; clause (a) is what locks the F7
fix itself.)

This finding is also recorded inline in the gate's header comment (so a future lane reads the reason
the "born-RED" framing became a containment-guard disposition, and does not "fix" the gate to fake a
red).

---

## Wiring + coverage

- **package.json:** `proof:bezier-no-scroll` added after `proof:easing-canvas-bounded` (its W4 panel
  sibling); `proof:cartoon-shadow-unclipped` after `proof:stage-not-clipped` (its containment
  sibling). Both added to `proof:all` at the same positions.
- **ci.yml (demo-smoke job):** both wired browser-gated (`KF_REQUIRE_BROWSER: "1"`), each beside its
  sibling, each with a BITE-citing comment.
- **proof:ci-coverage:** PASS — all 68 `proof:*` gates invoked in CI (the 2 new ones included; the 4
  recorded exclusions unchanged; the H.W9 RETIREd `proof:cartoon-specular-coexist`/`proof:specular-calm`
  correctly no longer expected — the retire lane removed them from `proof:all` + `package.json`). The
  H.W8 RETIRED-exclusion + the proof:ci-coverage clauses stay coherent (no version-literal drift, no
  glass-ui clone, all 3 workflows carry `concurrency:`).

## Precepts honored
- **MEASURE-FIRST:** both gates' references + thresholds set from LIVE measurement, not the spec's
  assumed numbers; the F7 "born-RED" assumption was tested against rendered screenshots, found
  non-reproducing, and the gate re-grounded as a containment guard with the finding recorded (NOT a
  faked red) — the gate-redteam discipline in action.
- **The gate BITES:** F2 reds on the external-button + overflow born-RED; F7 reds on the F7-mechanism
  (padding-left dropped). Neither passes vacuously (real-area + real-left-throw + real-clip guards).
- **Mirror existing harness idioms:** serveDist + Playwright + the H.W1 settle plumbing, the
  panel-measurement (`proof:easing-canvas-bounded`) and viewport-containment (`proof:stage-not-clipped`)
  templates, the `KF_REQUIRE_BROWSER` skip-or-fail posture.
- **inv-16:** no glass-ui patch, no engine source, no dist-build change beyond the demo gh-pages used
  to exercise the gates; the gates are kf-authored (NOT a HANDOFF).

## Coordination
- File-disjoint from the impl lanes (A register, B layout, C dock) and the other gate lanes
  (`impl-w9-gates.md`, `impl-w9-gates-dock.md`, `impl-w9-specular-gates.md`): this lane authored ONLY
  the 2 F2/F7 gate scripts + the 4 lines into package.json + the 2 steps into ci.yml. The specular
  invert/retire lane's package.json + ci.yml edits (the coexist/calm RETIRE, the
  `proof:glass-and-cartoon` add) landed in parallel; verified no conflict (disjoint insertion points;
  ci-coverage green over the union).
- The fix files (`ControlsPaneWrapper.vue`, `TimingFunctionPanel.vue`) were touched ONLY transiently
  for the BITE proofs and restored byte-identical (diff-clean against backups); the dist was rebuilt
  clean on the restored tree.
