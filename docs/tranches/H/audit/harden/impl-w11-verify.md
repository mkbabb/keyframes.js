# impl-w11-verify — H.W11 VERIFY LANE (builds/tests + all W11 gates + no-regression + MEASURE-FIRST numbers)

**Wave:** H.W11 · **Lane:** VERIFY · **Branch:** `tranche-h-impl` · **HEAD:** `f7fcc40`
**Contract:** `docs/tranches/H/waves/H.W11.md` (§Hard gate) · `i-_PLAN.md §2/§4`
**Status:** VERIFIED GREEN. tsc 0 · tests green · gh-pages clean · all 7 NEW W11 gates GREEN ·
all named no-regression gates GREEN. ONE legit gate-floor adjustment (`proof:glass-and-cartoon`,
noted §3). ONE pre-existing RED unrelated to W11 surfaced + reported (`proof:easing-canvas-bounded`,
RED at HEAD too — §5). NOT committed.

---

## §0 — Verify charge (verbatim from the lane brief)

(1) `npx tsc --noEmit` → 0 · (2) `npm test` green (update a size-ceiling only if legit, noting it)
· (3) `npm run gh-pages` · (4) all NEW W11 gates with `KF_REQUIRE_BROWSER=1` GREEN · (5)
`proof:ci-coverage` · (6) NO regression on the named set · BITE: revert one stage scene to
full-bleed → `proof:stage-glass-card` reds; restore. Confirm the easing scene shows ONLY easing
(DFA), labels are uniform-width, bezier is single-card + grown + no subtitle.

---

## §1 — BUILDS + TESTS (1)–(3)

| Step | Command | Result |
|------|---------|--------|
| (1) tsc | `npx tsc --noEmit` | **EXIT 0** (clean, before + after the §3 gate edit) |
| (2) tests | `npm test -- --run` (vitest) | **68 files passed · 682 passed \| 2 expected fail (684)** |
| (3) build | `npm run gh-pages` | **EXIT 0** — `✓ built in ~1.4s`; `dist/gh-pages/index.html` present |

**The 2 "expected fail"** are PRE-EXISTING `it.fails()` born-RED witnesses, NOT W11:
`test/interpolate-anything.test.ts:256` (the MCI-5 identity-pad witness) +
`test/group-snapshot-identity.test.ts:75` (the engine serialize/hydrate seam — inv-16 handoff,
born-RED until the engine ships the seam). Both pre-date this wave; vitest counts them GREEN
(a `test.fails` that fails IS the pass). No real test failure. No size-ceiling needed updating
(the test suite carries no count-ceiling that W11 perturbs).

**gh-pages build warnings** (pre-existing, NOT errors): the `@vueuse/core` `/* #__PURE__ */`
rolldown annotation note + the >500kB chunk-size advisory + the INEFFECTIVE_DYNAMIC_IMPORT notes
(CubeScene / engine.ts dual import). All present on HEAD; build exits 0.

---

## §2 — THE 7 NEW W11 GATES (4) — all GREEN with `KF_REQUIRE_BROWSER=1`

Run against the freshly-built `dist/gh-pages/`, playwright-core + chromium resolved locally,
each browser half settle-gated on the W1 FSM resting.

| Gate | Item | EXIT | Verbatim GREEN summary |
|------|------|------|------------------------|
| `proof:stage-glass-card` | I5 | **0** | all four {easing, spring, sequence, motion-path} resolve ONE standard glass Card — data-surface=glass · tier=resting · radius **16px** · backdrop `blur(12px) saturate(1.05)` · NOT cartoon; the four-scene convergence clause passes (three states → one register) |
| `proof:card-rounded-primitive` | I4 | **0** | static: zero bare-class `cartoon-surface` stage roots · computed: 4×16px radius (motion-path's named defect closed) · glass-ui HANDOFF **PENDING** (born-RED witness held — `@utility cartoon-surface` still carries no radius; flips RED on the glass-ui ship) |
| `proof:scene-control-dfa` | I2 | **0** | D1+D2 static (table-driven triad, reka hacks dead, totality) · D3 **7/7** per-scene (easing → only Easing, no keyframes/timeline node; sequence/path → no panel) · D4 **7/7** nav-matrix total · 11/11 unit |
| `proof:scene-transition-perf` | I2 | **0** | **p95 = 49.5 ms ≤ 120 ms** budget (p50 = 32.6 ms over 18 transitions) · round-trip `{selectedControl,isControlsPanelOpen}` byte-identical · reducer untouched (DFA EXTENDS, not re-authors) |
| `proof:label-subgrid` | I1 | **0** | main grid: 5 labels all **86.16px** (Δ=0), one shared right edge x=175.36, every row `subgrid` · LayerConfig: 3 labels all **43.19px** (Δ=0), every row `subgrid` · ≥3 differing-text non-vacuity met |
| `proof:bezier-single-card` | I6 | **0** | EXACTLY **1** glass-ui Card (`data-surface="cartoon"`) between the bezier canvas and the controls-layout root — the inner TimingFunctionPanel Card is de-nested |
| `proof:bezier-grown` | I7 | **0** | static: no `editing: {{ }}` subtitle interpolation · canvas grew to **223px@1280×720 / 232px@1440×900** (> the W9 220px ceiling) · no "editing:" text node · still fits (scrollHeight ≤ clientHeight, overflow-y ≠ scroll) at BOTH viewports |

---

## §3 — (2)/(6) LEGIT GATE-FLOOR ADJUSTMENT: `proof:glass-and-cartoon` (W9 F8)

**The verify lane CAUGHT `proof:glass-and-cartoon` born-RED on the W11 working tree** and diagnosed
it as a STALE NON-VACUITY FLOOR (correct W11 consequence), NOT a design regression. Fixed at the
gate (the only source edit this lane made), noted here per the brief's "update a ceiling only if
legit, noting it."

**The failure (W11 working tree, before the fix):**
- static clause `total < 10` → **9** cartoon-Card sites found → RED.
- browser clause `≥5` translucent witnesses → **4** found → RED.

**The diagnosis (HEAD vs working-tree differential — a fresh HEAD worktree built + probed):**
- **HEAD (committed `f7fcc40`): the gate was GREEN** — 11 cartoon sites (≥10), 5 translucent
  witnesses (≥5). Verified by running the gate against a built HEAD worktree: **PASS exit 0**.
- **The static drop 11 → 9** is exactly **I6**: the de-nested inner `TimingFunctionPanel` Cards
  (the bezier + steps card-in-card) carried 2 `<Card surface="cartoon">`; I6 deleted them. The
  surviving 9 (RibbonBar · AnimationControlsControls · KeyframesEditor · KeyframeTimeline ·
  AssetLayerPanel · AssetViewport · MatrixEditor · EasingSidebar · SpringSidebar) all still carry
  `tier="quiet"`.
- **The browser drop 5 → 4** is exactly **I2's DFA**: at HEAD the **easing** scene rendered 2
  visible cartoon Cards (per-scene probe), because pre-DFA it spun up the extra control card; under
  the W11 DFA the easing scene is gated to ONLY its own surface → 1 cartoon Card. The sweep
  (cube ×2 + easing ×1 + spring ×1) now witnesses 4, not 5.

**Why this is NOT a regression:** the panels that DO render are still cartoon+quiet+translucent —
the gate's load-bearing assertion (`tier="quiet"` on all + **0 of 4 opaque**) holds. Only the
non-vacuity *floors* (a guard against a mis-rooted sweep, not the design lock) were stale. The
sibling `proof:cartoon-is-panel-depth` (shares the cube/easing/spring sweep, counts via the
named-contract box-shadow set not the translucency filter) stayed **GREEN** at 6 cards — confirming
the panel register is intact.

**The fix (`scripts/proof-glass-and-cartoon.mjs`, +30/-12):** static floor `< 10` → `< 8` (a
1-site margin under the landed 9 — a single accidental removal still passes, losing 2+ reds);
browser floor `≥5` → `≥4` (the post-W11 reality). The opaque-regression BITE (the real F8 lock —
any panel reverting to the resting 0.65 tier reds) is UNTOUCHED. Doc-comments updated to record the
I6/I2 cause. **Re-run: PASS exit 0** — `all 9 … carry tier="quiet"` · `0 of 4 opaque` · `4 …
translucent (≥4 floor met)`.

---

## §4 — (6) NO-REGRESSION + (5) ci-coverage — all GREEN

| Gate | Wave it guards | EXIT | Note |
|------|----------------|------|------|
| `proof:scene-machine-irrefragable` | W1 keystone | **0** | the DFA EXTENSION did NOT break it — 6/6 irrefragable matrix · scene-isolation `selectedControl==='easing'` · suspend-no-orphan-raf · deep-link-wins · no-timing-heuristic. The RECONCILE requirement holds. |
| `proof:scene-parity` | W5/W10 | **0** | ball-on-stage + sidebar-curve hold UNDER the glass card — motionpath-drag · square-drag · easing-curve-editable (sidebar) all live |
| `proof:stage-within-docks` | W10 G8 | **0** | the `.stage-cell` primitive SURVIVES the full-bleed→glass-card reversal — subject contained in the dock band at 1280/1440/mobile · zero `.dock-inset` (live + source) |
| `proof:glass-and-cartoon` | W9 F8 | **0** | panels stay cartoon+quiet (after the §3 legit floor fix) |
| `proof:single-column-pack` | W3/W9 F1 | **0** | the one-column / label-left invariant holds UNDER I1's subgrid — 8 leaf rows share one left edge x=89, label LEFT of control |
| `proof:bezier-no-scroll` | W9 F2 | **0** | fit-without-scroll holds UNDER I7's grow — the grown canvas still fits at 1280×720 AND 1440×900; the title-left/dismiss-right header re-homed (backLeft > titleRight) |
| `proof:demo-console-clean` | W0 | **0** | no serializeEasing throw resting on /#/amiga + /#/easing |
| `proof:ci-coverage` | F.W2/G.W6 | **0** | all 80 proof:* gates invoked in CI (4 recorded exclusions) · version-literal · registry-glass-ui · concurrency hygiene |

Also re-verified GREEN (touched-area sanity, not in the named set): `proof:easing-stage-is-ball`
(0 — the hero ball traverses, editable curve in sidebar only), `proof:scene-card-rounded` (0 — the
W10 gate stays green; its full-bleed disjunct is folded OUT only in H.W8), `proof:cartoon-is-panel-depth`
(0 — 6 cartoon cards resolve `--shadow-cartoon-md`).

---

## §5 — A PRE-EXISTING RED, surfaced + reported: `proof:easing-canvas-bounded` (W4)

**This is a RED-that-should-be-GREEN that PRE-DATES W11 (RED at HEAD too) — NOT a W11 regression,
and OUTSIDE W11's scope. Reported per the brief.**

- `proof:easing-canvas-bounded` (a W4 gate, `084feb9`) fails its **`header clearance`** clause:
  it asserts `.easing-editor > h2` exists; the panel (`TimingFunctionPanel.vue:17,22`) uses
  `<h3 class="text-title">cubic-bézier</h3>`, not `<h2>`. The other four clauses (container
  context · panel-height ratio 0.446 · square law · block-size ceiling) all PASS.
- **Verified RED at HEAD:** ran the gate against a built HEAD worktree → **FAIL exit 1, SAME
  `.easing-editor > h2: false` clause** (canvas 160px in a 371px panel — identical shape). So it
  was already failing on the committed W0–W10 baseline before any W11 edit.
- **Scope:** the `<h3>` (not `<h2>`) title is the W9 F2 "title-left" pattern that `proof:bezier-no-scroll`
  GREENs; the W4 gate's `h2` expectation went stale at W9 (a prior wave). It is **NOT in `proof:all`**
  (excluded), but it **IS wired in `ci.yml:484`** — so it would red that CI step. Fixing it means
  reconciling the W4 gate's `h2` assumption with the W9 `<h3>` header (or adding the parity `<h2>`),
  which touches the W4 gate / the bezier panel header I6/I7 just legitimately reshaped — explicitly
  **out of W11's mandate**. **Recommend the IMPL lead route it to H.W8 (the gate-regime wave)** to
  reconcile the stale W4 `h2` clause with the landed `<h3>` header, OR an earlier-wave hardening
  follow-up. Left UNCHANGED by this lane (no out-of-scope edit).

---

## §6 — THE BITE (revert one stage scene → reds; restore → greens)

Reverted `MotionPathTarget.vue:10,61` from the I5 `<Card :shadow="false">` … `</Card>` to its W10
baseline (bare `<div class="glass-resting cartoon-surface …">` … `</div>`), rebuilt `dist/gh-pages`
(exit 0), ran the gate, restored byte-identically.

| Step | `proof:stage-glass-card` |
|------|--------------------------|
| **BITE (motion-path reverted to bare-cartoon/full-bleed)** | **FAIL exit 1** — `motion-path — the stage glass Card never mounted (cell:true, glassCard:false) … still FULL-BLEED (no card) or BARE-CARTOON`; easing/spring/sequence stayed ✓ |
| **RESTORE (byte-identical, md5 `6ef5328e90a02f7ef9c136e13d584531` re-verified) + rebuild** | **PASS exit 0** — all four resolve the glass card again + the four-scene convergence clause |

The gate BITES exactly on the I5 defect and is not vacuous. `dist/gh-pages` is left rebuilt at the
proper W11 state (the final §2 run was against it).

---

## §7 — THE THREE CONFIRMATIONS (the brief's explicit asks)

1. **The easing scene shows ONLY the easing surface (the DFA).** Live DOM probe (built dist,
   FSM-rested per scene): `easing → control-tabs=[Easing]` (NO Controls/Keyframes/Timeline node);
   `spring → [Spring]`; `cube → [Controls]`; `sequence → none`; `motion-path → none`. Exactly the
   user's example. (Cross-checked by `proof:scene-control-dfa` D3 7/7.)
2. **The labels are uniform-width.** `proof:label-subgrid`: 5 main-grid labels all 86.16px (Δ=0,
   one shared right-edge track via `subgrid`); 3 LayerConfig labels all 43.19px. The `w-20` magic
   literal is gone; the column is subgrid-derived.
3. **The bezier is single-card + grown + no subtitle.** `proof:bezier-single-card`: exactly 1 Card.
   `proof:bezier-grown`: 223px@720 / 232px@900 (> 220), no "editing:" text node, still fits.

---

## §8 — THE MEASURE-FIRST NUMBERS (named, captured live)

| Quantity | Value | Source |
|----------|-------|--------|
| **I2 transition perf budget** | **p95 = 49.5 ms ≤ BUDGET_MS = 120** (p50 = 32.6 ms over 18 transitions; baseline p95 ≈ 46 ms) | `proof:scene-transition-perf` T1, live (1280×900, built dist) |
| **I7 bezier canvas grow** | **223px @ 1280×720** (host-cap bound) · **232px @ 1440×900** (78cqi floor) — both > the W9 220px ceiling, both still fit | `proof:bezier-grown` browser half |
| **FORK I5-shadow choice** | **`shadow={false}`** on all four stage cards (uniform / isomorphic) — the cleaner protagonist-plate read; measured both variants in the stage lane (`impl-w11-stage.md §FORK I5-shadow`); confirmed live (data-surface=glass · NOT cartoon · no `shadow-card` drop) | `impl-w11-stage.md` + `proof:stage-glass-card` |
| **I5 stage card radius / backdrop** | **16px** (`rounded-card` → `--radius-2xl`) · `blur(12px) saturate(1.05)` — all four scenes | `proof:stage-glass-card` / `proof:card-rounded-primitive` |
| **I1 uniform label width** | main grid 86.16px (5 rows) · LayerConfig 43.19px (3 rows), Δ=0 | `proof:label-subgrid` |

---

## §9 — RED-that-should-be-GREEN ledger (honest)

1. `proof:glass-and-cartoon` — was born-RED on the W11 tree (stale non-vacuity floors after I6/I2);
   **FIXED legit** (§3 — floor `<10`→`<8`, `≥5`→`≥4`, the design BITE untouched), now GREEN.
2. `proof:easing-canvas-bounded` — **RED at HEAD too** (pre-existing, the W4 `.easing-editor > h2`
   clause stale since W9's `<h3>` header); NOT a W11 regression, OUTSIDE W11 scope; reported §5;
   left UNCHANGED — recommend reconcile in H.W8 / earlier-wave follow-up.

No other RED-that-should-be-GREEN. The glass-ui HANDOFF half of `proof:card-rounded-primitive` is a
CORRECT born-RED witness (held PENDING, by design — inv-16).

---

## §10 — FINAL STATE

- **tsc:** 0. **tests:** 682 pass / 2 expected-fail (pre-existing). **gh-pages:** clean.
- **7 NEW W11 gates:** all GREEN (browser-required).
- **no-regression set:** all GREEN (W1 keystone, scene-parity, stage-within-docks, glass-and-cartoon,
  single-column-pack, bezier-no-scroll, demo-console-clean) + ci-coverage GREEN.
- **BITE:** confirmed (reds on revert, greens on restore; byte-identical).
- **The verify lane's only source edit:** `scripts/proof-glass-and-cartoon.mjs` (the §3 legit
  floor adjustment). `MotionPathTarget.vue` restored byte-identical. NOT committed.
</content>
</invoke>
