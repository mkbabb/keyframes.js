# impl-w10-verify — Lane A (W10 VERIFY-COMPLETION)

**Wave:** H.W10 (SHIP-in-H, corrective — the second user-feedback fold G1–G8).
**Lane:** A — VERIFY-completion. The cut W10 verify left TWO precise gaps; this lane
closes them + re-verifies the full W10 gate set. NO git commit (the lead commits).
**HEAD:** f064cc1 (W9); the W10 impl + most gates landed uncommitted in the tree.

This lane edited ONLY scripts / package.json / ci.yml (+ this doc). It did NOT change
the landed W10 demo/asset source. tsc 0, npm test green, gh-pages built,
KF_REQUIRE_BROWSER=1 across all browser gates.

---

## 1. Wiring — the 3 authored-but-unwired gate scripts

The three scripts existed in `scripts/` (round-3 authored) but were referenced in
NEITHER `package.json` NOR `.github/workflows/ci.yml`. So `proof:ci-coverage` was
green only because they were absent from `package.json` — an authored-but-unrun gap.
Wired both files, matching the existing `proof:scene-uses-standard-ribbon` /
`proof:easing-sidebar-normalized` pattern exactly.

**`package.json`** — added the named script entry + the `proof:all` chain link
(inserted between `proof:easing-sidebar-normalized` and `proof:bezier-no-scroll`, the
W10-gate neighbourhood):

| Gate | named script | in `proof:all` |
|------|--------------|----------------|
| `proof:easing-stage-is-ball` | `node scripts/proof-easing-stage-is-ball.mjs` | ✓ |
| `proof:scene-card-rounded` | `node scripts/proof-scene-card-rounded.mjs` | ✓ |
| `proof:stage-within-docks` | `node scripts/proof-stage-within-docks.mjs` | ✓ |

**`.github/workflows/ci.yml`** — added a `- name: … / run: npm run … / env:
KF_REQUIRE_BROWSER: "1"` step for each (all three are browser gates → KF_REQUIRE_BROWSER),
in the `demo-smoke` job after the gh-pages build, beside the two already-wired W10
gates. Each step carries a multi-line provenance comment (the G4/G2/G8 born-RED anchor +
the clause shape + the vacuity guard), mirroring the existing W10 CI comments.

**Verification (`proof:ci-coverage`):** GREEN — *"all 73 proof:\* gates are invoked in
CI (4 recorded exclusions)"*. Before the wiring it was 70 gates; the 3 newly-wired are
now accounted for (and proof:ci-coverage would RED if any of the three were in
`package.json` but missing from `ci.yml`).

---

## 2. Reconcile `proof:scene-parity` clause 7 for the W10.G4 SUPERSEDE

**The supersede (H.W10.md §supersede-map G4 + §H.W9-reconciliation).** W5.S4 PROMOTED
the editable `EasingCurveCanvas` to the stage (`.easing-stage-curve`). W10.G4 REVERSES
it: the singular STAGE is now ONE engine-driven ball (owned by
`proof:easing-stage-is-ball`, which also asserts exactly ONE `EasingCurveCanvas` exists,
in the sidebar), and the editable curve lives in the SIDEBAR ONLY. Clause 7
(`proof-scene-parity.mjs`, the `proof:easing-curve-onstage` clause) still asserted the
deleted `.easing-stage-curve` on-stage host → it was SUPERSEDED and would red against
the W10 tree.

**The reconciliation (clause 7 → "easing-curve-editable (sidebar)").** Renamed the clause
intent and re-pointed it at the SIDEBAR host the curve moved to, while PRESERVING the
interactivity floor + the three-name bezier wiring:
- The editable host is now the SIDEBAR's `.easing-curve-canvas` (the EasingSidebar
  `Card.easing-editor` → `EasingCurveCanvas`), located OUTSIDE `.stage-cell` (traced via
  the W10 normalize note `impl-w10-normalize.md` §G6+G5 + `EasingSidebar.vue:13,20`).
- The SAME three-name wiring is exercised: a handle drag on the sidebar canvas FIRES
  `update:bezierPoints` → prop `bezierPoints` → demo ref `bezierControlPoints`, witnessed
  by the handle `cx/cy` + the `.bezier-path` `d` re-deriving (live: handle
  `(0.25,0.9) → (0.7997…,1.6217…)`, path `d` re-derived).
- The clause docstring + the CI comment now record the W10.G4 supersede explicitly and
  state the two gates are COMPLEMENTARY (ball on the stage = `proof:easing-stage-is-ball`;
  editable curve in the sidebar = clause 7), NOT contradictory. The final PASS message +
  the in-clause ok/fail labels read "easing-curve-editable (sidebar)".

**The settle fix (the reka tab-init race).** The editable sidebar curve mounts only when
the easing TabsContent is the ACTIVE reka tab. reka registers the slotted `easing` tab a
tick after its built-in controls/keyframes/timeline children, so EasingScene.vue:29-40
re-asserts the default on a FRESH mount via `onMounted+nextTick`. An IN-PAGE hash switch
(scene-parity's `settleOnScene`) does NOT trigger that re-assert, and after the earlier
clauses cycled the shared page through motion-path/square the reka Tabs state is sticky
(it lands on `controls`) — so the sidebar curve never renders on the shared page (verified
empirically: 0 `.easing-curve-canvas` after the in-page nav; 1 editable sidebar canvas on
a fresh page). Fix: clause 7 runs on its OWN fresh page (`freshEasingPage()` — the ball
gate / `proof:easing-canvas-bounded` idiom: a page that only ever visits easing), closed
in a `finally` at the clause's end. The shared page (clauses 5/6) is untouched.

This matches H.W10.md G4 + its supersede-map (the spec documents G4 supersedes W5.S4's
stage-promote); the gate now implements the spec.

---

## 3. RE-VERIFY — the full result table

Build: `npm run gh-pages` clean (`✓ built in 2.19s`, 4075 modules; only pre-existing
vueuse `#__PURE__` + chunk-size + dynamic-import warnings). `npx tsc --noEmit` → exit 0.
`npm test` → 671 passed | 2 expected-fail (67 files). All browser gates run with
`KF_REQUIRE_BROWSER=1` against the BUILT `dist/gh-pages/`.

### The 6 W10 gates + the reconciled parity + coverage

| Gate | Item | Result | Witness |
|------|------|--------|---------|
| `proof:scene-icons` | G1 (REVISE) | **GREEN** | 4 originals 084feb9 1:1 (byte/pixel); 3 new colorful; monochrome currentColor-only FAILS; rel=icon resolves |
| `proof:scene-uses-standard-ribbon` | G3+G7 | **GREEN** | easing+spring: standard PlaybackRibbon (scrubber + Play/Reverse + visualizer); cells 148×40 equal |
| `proof:easing-sidebar-normalized` | G5+G6 | **GREEN** | easing+spring: 0 text-admin-label, slider track 6px, 1 Card, Labeled* rows |
| `proof:easing-stage-is-ball` | G4 | **GREEN** | stage subject = `.progress-ball.hero-ball`, 0 canvas in `.stage-cell`; ball traverses (left 1105→1215px); exactly 1 editable curve, in the sidebar |
| `proof:scene-card-rounded` | G2 | **GREEN** | stage roots full-bleed (0 bare cartoon-surface); every cartoon surface non-zero radius (10/16/16px) |
| `proof:stage-within-docks` | G8 | **GREEN** | subject contained between both dock bands @1280/1440 + clears top dock @390; 0 live/source `dock-inset` |
| `proof:scene-parity` | RECONCILED | **GREEN** | 7/7 clauses; clause 7 = editable curve in the SIDEBAR + the three-name wiring (W10.G4) |
| `proof:ci-coverage` | wiring | **GREEN** | all 73 proof:* gates invoked in CI (the 3 newly-wired accounted) |

### Regression set (no W10 regression)

| Gate | Result |
|------|--------|
| `proof:scene-machine-irrefragable` | **GREEN** (6/6 A→B→A identity cells + contract-identity + no-orphan-rAF + deep-link) |
| `proof:glass-and-cartoon` | **GREEN** (11 quiet cartoon Cards · α ≤ 0.55 · backdrop-filtered) |
| `proof:single-column-pack` | **GREEN** (one left edge · one width · label-left) |
| `proof:phi-leaf-zero` | **GREEN** (zero raw rungs · hero text-display-mega 177px) |
| `proof:demo-console-clean` | **GREEN** (no H-A1 serializeEasing throw on /#/amiga + /#/easing) |

### The BITE (one new gate, non-vacuity)

Flipped `assets/icons/easing.svg` `stroke/fill="hsl(248,88%,71%)"` → `currentColor`
(the monochrome the user rejected). `proof:scene-icons` went **RED on TWO clauses**:
1. *"shape — easing.svg: MONOCHROME (stroke=currentColor-only) — must carry expressive
   color"* (the G1 monochrome-inversion bite).
2. *"re-instantiation — easing.svg is NOT byte-identical to 084feb9 … must be
   re-instantiated VERBATIM, not redrawn"* (the re-instantiation-faithfulness bite).

RESTORED from backup → `proof:scene-icons` GREEN again; `grep -c currentColor` = 0; the
working-tree diff vs HEAD is exactly the W10 colorful re-instantiation (no bite residue).
The gate bites non-vacuously.

---

## RED-that-should-be-GREEN (diagnosed + closed)

ONE, during the reconcile: `proof:scene-parity` clause 7 initially RED — *"the SIDEBAR
did not render an editable EasingCurveCanvas"* — even though `proof:easing-stage-is-ball`
(same tree) found the sidebar curve. Diagnosed as the reka tab-init race (above): the
in-page hash nav through prior scenes leaves the reka Tabs sticky on `controls`, so the
slotted `easing` TabsContent (the sidebar) never mounts on the shared page. Closed by
running clause 7 on its own fresh page (the ball-gate idiom). No source defect — a gate
settle-plumbing gap exposed by the W10 stage→sidebar move; the W10 demo source is correct
(the sidebar curve renders on a fresh easing mount, witnessed by `proof:easing-stage-is-ball`
and `proof:easing-canvas-bounded`).

No other RED-that-should-be-GREEN. All W10 gates, the reconciled parity, and the
regression set are GREEN.

---

## Files touched (Lane A — scripts/CI/package only; NO landed-source change)

- `package.json` — 3 named `proof:*` entries + 3 `proof:all` chain links.
- `.github/workflows/ci.yml` — 3 new `demo-smoke` gate steps (KF_REQUIRE_BROWSER) +
  the `proof:scene-parity` CI comment updated for the W10.G4 reconcile.
- `scripts/proof-scene-parity.mjs` — clause 7 reconciled (stage→sidebar host, renamed
  "easing-curve-editable (sidebar)", the `freshEasingPage()` settle, the docstring +
  PASS message; `CTRL_KEY` added).
- `docs/tranches/H/audit/harden/impl-w10-verify.md` — this doc.
