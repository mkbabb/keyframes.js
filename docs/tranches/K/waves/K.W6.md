# K.W6 — TERMINATIONS (PARALLEL · the P-invariant-28 wave: every ≥4-tranche rider exits with a MEASUREMENT ARTIFACT or a reasoned KILL — zero bare MEASURE-FIRST rows survive the close)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** TERMINATE-in-K (the ledger
  hygiene wave; NOT a product-defect wave — those are W0/W2/W3/W4). K.W6 is the wave that makes
  the K open-deferrals ledger TERMINAL: it takes the `deferred-ledger-k.md` 32-row substrate
  and drives every exit-only row to a discharge that is a measurement artifact (a recorded
  number from a quiet host, a born-RED→GREEN gate, a published consume-edge), a tracked
  HANDOFF/BOOK with a NAMED tripwire, or a reasoned KILL — never a perpetual "MEASURE-FIRST"
  punt re-deferred to a never-coming successor (P-invariant-28; there is no residual L). ·
  **DAG-deps:** **PARALLEL throughout** (`K.md §WAVE MAP`: "K.W6 is
  parallel" / "W6 parallel throughout"). W6 does NOT block any other wave and is NOT blocked by
  any: its rows are the ledger residue the design/cold-path waves do NOT own. It CONSUMES three
  things the leading waves produce — (i) the **K ledger substrate** that K.W0's first motion
  grooms onto disk (`proof:chronic-closure` re-points I→J→K, `precepts-k.md §P16`), so W6's
  §Hard gate has a parse target; (ii) the **cold-path P0 fix** (W0) so the deferred mobile
  Lighthouse re-run measures the FIXED product, not a frozen-subject home (DL-K11 must not
  re-measure a broken cold path); (iii) the **calibrated CI posture** the gate-truth wave (W5)
  owns. W6's own deliverables (the drag-seam closures, the dev-mode parity disposition, the
  U-K19 playground decision, the editor-LCP re-measure, the type-hygiene fold-on-touch) gate
  NOTHING downstream — which is exactly why it parallelizes. **It MUST land before K.WZ:** the
  close (`K.md §CLOSE`) requires the K ledger TERMINAL and `proof:chronic-closure` GREEN on the
  K substrate, and W6 is the wave that earns that terminality.

## §Provenance (the folded root causes + the booked follow-ups)

- `audit/deferred-ledger-k.md` — **THE decisive input, the whole substrate.** The consolidated
  J→K ledger: 32 DL-K rows across 7 bands (§1a RE-OPENED P0/P1 chronics · §1b glass-ui/AX · §1c
  perf + wall-clock · §1d J.W\* residual/BOOK · §1e sibling-handoff/value.js · §1f K-SEED
  charter · §1g RE-AFFIRM/RECORD/KILL), with the P-invariant-28 exposure roll-up (§2): **ten
  ≥4-tranche riders (`‡`) live**, headed by DL-K2 (≥9-tranche gate-blindspot). W6 owns the
  rows the cluster waves do NOT — the ledger RESIDUE: DL-K11 (mobile Lighthouse floors), DL-K13
  (demo-smoke wall-clock), DL-K12 (editor LCP lever), DL-K14 (DS-2/DS-5 type retype), DL-K15
  (the drag-seam gaps + OrbitalDrag BOOK), DL-K19 (A7/A9 cohesion BOOKs), the chronic-by-design
  sibling-handoff tail (DL-K20/K21/K22/K23/K24/K25), the BOOK/KILL bands (DL-K31/K32), and the
  §1g RE-AFFIRM/RECORD/KILL roll-up — PLUS the P-invariant-28 audit itself (the §2 roll-up: W6
  asserts each `‡` rider's exit FORM is on the record, whether W6 owns the exit or a cluster
  wave does).
- `audit/completeness-critic.md` — the critic that found the fleet's TWO under-rooted residues
  W6 dispositions: **§3 GAP-1 / §4 / CC-1** (U-K19 "dragging resizes the container" — the lone
  under-rooted U-K finding; the critic rooted it to `AssetViewport.vue:45` (move) vs `:82`
  (resize), mounted ONLY in `demo/playground/App.vue:22`, ABSENT from the deployed `demo/app`
  SPA — so U-K19 is NOT a deployed-site defect: it is a playground drag-vs-resize hit-conflict
  OR a new-feature request, gated on whether the playground ships at all); **§3 GAP-3 / CC-4**
  (dev-mode parity / the value.js `development`-export gotcha — every fleet probe drove the
  BUILT `dist/gh-pages`, so an HMR-only export-condition defect would be invisible; the critic
  probed value.js 0.11.2's `exports` and found the gotcha DORMANT at 4.2.0 — a latent-watch,
  not an active defect). W6 closes both with a disposition, not a re-litigation.
- `audit/wave-J.W2.md §F2/§F3` + the J.W2 census (`§1`) — the **drag-seam gaps**. The I.W4
  B6-a invariant ("every drag seam routes select-suppression through `gestureSelectSuppression`",
  `demo/CLAUDE.md`) was claimed at "TRUE zero" at J.W2 S1 for the THREE spec-named bypasses
  (EasingCurveCanvas — DONE, PlaybackRibbon — DONE, OrbitalDrag — live-verified-safe BOOK). The
  audit found THREE MORE `setPointerCapture` surfaces NOT in that roster and NOT covered by
  `proof:drag-gesture`'s 6-item `DRAG_SURFACES` (`scripts/proof-drag-gesture.mjs:111-136`):
  **F2 (P2) `TimelineTrack.vue:170,194`** (diamond markers; `grep
  acquireSelectSuppression|body.is-dragging|useDragCapture = 0`), **F3 (P2) `useSphereSpin.ts:96`**
  (the amiga Three.js canvas; `grep = 0`, low live risk — WebGL surface has no selectable text).
- `audit/live-amiga-breakage.md §gate-blindspot` — corroborates F3: `proof:amiga-subject-is-pivot`
  exercises `useSphereSpin` as the SPIN gesture, never as a select-suppression seam; the amiga
  drag surface is uncovered by `proof:drag-gesture`.
- `audit/ci-cd-k.md §F-2` — the **demo-smoke wall-clock**, MATERIALLY RECONCILED. DL-K13 names a
  "20-minute" ceiling from the J.W0-era baseline; ci-cd-k F-2 confirms the ceiling was ALREADY
  re-sized to **35m at J.W4** (`ci.yml:213` `timeout-minutes: 35`), the CICD-7 comment
  (`ci.yml:207-213`) recording the `19m13s` measured baseline (run `27310054675`, commit
  `c6c3c37`) against the OLD 20m. F-2's finding: the 35m ceiling has NOT been re-measured since
  J.W4, ~8 new browser gates landed after the recalibration, the projected total is ~42m which
  EXCEEDS 35m, and "there is no recent measured run after J.W7c's close". W6's DL-K13 is
  therefore the MEASUREMENT obligation (record a current wall clock), reconciling DL-K13's stale
  "20m/47s-headroom" framing with the live 35m artifact — and binding the cold-fact that K's NEW
  gates (W0 cold-entry, W4 panes, W5 truth legs) will eat the margin further.
- `audit/ci-cd-k.md §F-1` — `release.yml` has **no `timeout-minutes`**; GitHub's default is 360m
  (6h), so a stuck `npm publish` blocks for six hours (`grep -n "timeout-minutes"
  .github/workflows/release.yml` → no output). F-1 is a P1 single-line chore the ledger needs
  homed — ci-cd-k routes it to "K-W1 chore", but the gate-truth/CI legs partition (`K.md §W5`
  names "release.yml `timeout-minutes` (F-1)" as a W5 leg). W6 RECORDS F-1's terminal home as
  W5 (`§Hand-off`), not W6 — it is not a W6 deliverable; W6's job is only to confirm the row is
  not orphaned.
- `docs/tranches/J/audit/perf-battery-2026-06-10.md §3` — the **mobile Lighthouse floors** and
  the contention-tainted probe. The B-era floors: home ≥63, cube ≥64, amiga ≥49, square ≥62,
  easing ≥61, spring ≥52. The J probe (load ≈ 10, "CONTENTION-TAINTED (directional only)")
  read home 62 / cube 51 / amiga 37 / square 55 (all under floor) but easing 62✓ / spring 54✓
  (over floor) — uniformly ~7–13pts under floor, "consistent with uniform contention inflation
  … NOT asserted as regressions". The lane's terminal sentence: "The mobile floors re-assert on
  a quiet host (or the calibrated CI runner with `KF_REQUIRE_LH=1`) at J impl" — DEFERRED, never
  measured-quiet. DL-K11 makes that the W6 obligation.
- `scripts/proof-lighthouse-mobile.mjs:60-74,88,301-324` (verified) — the floor gate is ALREADY
  authored and re-runnable; it `declarePosture("observe-only", …)` (`:71`), routes each ceiling
  miss to RECORDED-in-CI / HARD-on-device / HARD-on-`KF_REQUIRE_LH=1` (the canonical third
  state, `:60-74`), and reads `REQUIRE_LH = !!process.env.KF_REQUIRE_LH` (`:88`). The B-era
  floors are baked as the no-regression source (`:95-97`). So DL-K11's exit is NOT a new gate —
  it is a MEASUREMENT (run the existing gate on a quiet host / calibrated runner and RECORD the
  numbers, asserting the floors hold or filing the regressions).
- `audit/precepts-k.md §P16` (P-invariant-28) + `§P17` (born-RED discipline) — the binding
  precepts. P16: "Every ≥4-tranche rider exited J via a measurement artifact or a reasoned KILL";
  the K carry is the substrate grooming landing as K.W0's first motion so the K ledger is the
  authoritative `proof:chronic-closure` parse target. P17: "every new K gate MUST carry a
  born-RED witness for the exact defect its oracle is written to catch."
- `scripts/proof-chronic-closure.mjs:7-15,53-102` (verified) — the substrate-parse gate that
  mechanizes P-invariant-28: it parses the canonical `## Open deferrals` chronic table and
  asserts each row carries (Disposition | Owning wave | gate/evidence). The J.WZ substrate
  transition moved the parse target I→J in ONE motion (`:53-60`); K.WZ re-points it J→K. W6's
  §Hard gate is anchored on this gate biting the K substrate with ZERO bare MEASURE-FIRST rows.

## §The state, verified (file:line / command+output / probe anchors)

- **The three uncovered drag seams (B6-a bypasses) — confirmed at HEAD:**
  | Seam | file:line | suppression count | `proof:drag-gesture` covered? |
  |---|---|---|---|
  | TimelineTrack diamond markers | `demo/@/components/custom/animation-controls/timeline/components/TimelineTrack.vue:170,194` (`setPointerCapture`) | `grep -c "acquireSelectSuppression\|body.is-dragging\|useDragCapture"` → **0** | NO (roster has 6, none timeline-diamond) |
  | useSheetGesture sheet swipe | `demo/@/components/custom/animation-controls/composables/useSheetGesture.ts:52` (`setPointerCapture`) | `grep -c "acquireSelectSuppression\|gestureSelectSuppression\|body.is-dragging\|useDragCapture"` → **0** | NO |
  | useSphereSpin amiga canvas | `demo/amiga/useSphereSpin.ts:96` (`canvasEl!.setPointerCapture`) | `grep -c "acquireSelectSuppression\|gestureSelectSuppression\|body.is-dragging"` → **0** | NO |
  The `demo/CLAUDE.md` convention is unambiguous: "EVERY drag seam routes select-suppression
  through `gestureSelectSuppression` (`useDragScrub` + `useDragCapture`)". All three violate it
  structurally. **NOTE on the third seam's NAME:** the task names "useSheetGesture" — verified
  this is the mobile bottom-sheet open/close swipe (`useSheetGesture.ts:48-75`, the BLK-6 grab
  handle); the SheetGrabHandle's own static `user-select:none` affordance (`SheetGrabHandle.vue:68-69`,
  the J.W2 census `§1`) suppresses ON the handle only — chrome OUTSIDE it during a swipe is
  unprotected, identical to the TimelineTrack class.
- **`proof:drag-gesture` roster (verified `scripts/proof-drag-gesture.mjs:111-136`):** six
  surfaces — `square/.demo-box`, `spring/.spring-rail`, `sequence/.seq-scrub`,
  `motion-path/.mp-traveller`, `easing/bezier-handle`, `easing/ribbon-slider`. The clause-(a)
  oracle (`:143-150`) drives a real `page.mouse` drag from each grab handle, sweeps across a
  chrome label, and asserts BOTH `getSelection()` empty AND structural `userSelect` suppression
  mid-gesture. The three seams above are absent from the roster — the gate is structurally
  blind to a regression on them.
- **The mobile Lighthouse floor gate (verified `scripts/proof-lighthouse-mobile.mjs`):**
  `declarePosture("observe-only", …)` (`:71-74`); `REQUIRE_LH = !!process.env.KF_REQUIRE_LH`
  (`:88`); the B-era floors are the no-regression source (`:95-97`); a ceiling miss is
  RECORDED-not-red in CI (observe-only, `:310-324`), HARD locally/on-device (`:315-318`), HARD
  under `KF_REQUIRE_LH=1` on a calibrated runner (`:301-308`). The gate is AUTHORED and
  re-runnable; DL-K11 is the MEASUREMENT, not a build.
- **The J mobile probe (verified `perf-battery-2026-06-10.md:36-55`):** load ≈ 10, directional
  only; home 62 (≥63) / cube 51 (≥64) / amiga 37 (≥49) / square 55 (≥62) / easing 62 (≥61) ✓ /
  spring 54 (≥52) ✓; spring LCP 29.4s (the Monaco lazy-path pathology, attributed
  load-independently). "NOT asserted as regressions … re-assert on a quiet host" — DEFERRED.
- **The demo-smoke wall-clock (verified `ci-cd-k.md §F-2`, `ci.yml:207-213`):** the CICD-7
  comment records `19m13s` (run `27310054675`, `c6c3c37`) against the OLD 20m ceiling; the
  ceiling was raised to **35m at J.W4**; ~8 new browser gates landed post-recalibration;
  projected ~42m > 35m; "no recent measured run after J.W7c's close" (the last recorded run
  `27378354065` on `f0822a1` carries no demo-smoke timing annotation). **This reconciles
  DL-K13's stale "20m / ~47s headroom" text** — the live ceiling is 35m, and the open obligation
  is a fresh measured wall-clock before K's gates ship.
- **U-K19's deployed-vs-playground rooting (verified `completeness-critic.md §4`):**
  `grep -rniE 'resize:\s*(both|horizontal|vertical)' demo/ src/` → zero hits; the only
  resize-on-drag is `AssetViewport.vue` (8 resize handles at `:82` `@pointerdown.stop` + a move
  gesture at `:45` `@pointerdown.stop`), mounted ONLY in `demo/playground/App.vue:22` —
  `grep -rniE 'AssetViewport' demo/app` → zero hits. The deployed build is `npm run gh-pages` =
  `vite build --mode gh-pages` (`package.json:42`) over `demo/app`, NOT the playground. So
  U-K19 cannot be a defect on the deployed `keyframes.babb.dev` SPA.
- **The dev-mode parity gotcha (verified `completeness-critic.md §3 GAP-3 / CC-4`):**
  `grep -rE 'dev-mode|development.*export|HMR|self-alias'` across the 32 lanes hits only
  `packaging-k.md` + `live-session-gap-analysis.md`, and only the value.js *pin* angle — the
  dev-vs-prod *parity* question was never swept (every fleet probe drove the BUILT dist, correct
  per mandate). The critic's own probe: value.js 0.11.2's `exports` did not surface a
  `development` condition → the gotcha is DORMANT at 4.2.0. The MEMORY constellation pin
  (`project_valuejs_dev_export_gotcha.md`) is the standing watch.
- **`proof:chronic-closure` substrate (verified `:53-102`):** parses `## Open deferrals`, asserts
  Disposition|Owning-wave|gate/evidence per row; the parse target moved I→J at J.WZ; the K close
  re-points it J→K. W6's gate rides this.

## §Goal

Make the K open-deferrals ledger TELL THE TRUTH about its own terminality: every exit-only row
the cluster waves do not own crosses its boundary with a **discharge a future reader can
re-derive** — a recorded number from a named quiet host, a born-RED→GREEN gate diff, a published
consume-edge, a tracked HANDOFF/BOOK with a NAMED tripwire, or a reasoned KILL — and **zero rows
survive the close as a bare "MEASURE-FIRST"** that simply re-defers the measurement to a never-coming
successor (there is no residual L). This
is P-invariant-28 applied to the ledger residue: the §2 roll-up's ten ≥4-tranche riders each
have their exit FORM on the record (W6 owns some; W6 AUDITS that the cluster-wave-owned ones
discharged), and the perpetual-punt class (DL-K11 "remain UNASSERTED pending a calibrated host",
the J terminal sentence) is terminated by ACTUALLY MEASURING. Eight moves, each at the ledger
altitude — NO new product surface where a measurement suffices, NO new gate where the authored
gate re-runs, NO re-litigation of a J-terminal RE-AFFIRM/KILL:

1. **Re-point the chronic-closure substrate (T0):** confirm K.W0's substrate-grooming landed the
   K ledger on disk as the `proof:chronic-closure` parse target (J→K), so W6's §Hard gate has a
   K substrate to bite. (CONSUMED from W0; W6 verifies, does not author the grooming.)
2. **The P-invariant-28 exit roll-up (T1):** for each of the ten `‡` ≥4-tranche riders, record
   the exit FORM and WHO owns it — a measurement artifact, a born-RED gate, a published
   consume-edge, or a KILL. Riders owned by cluster waves (DL-K1/K2 W0, DL-K6/K7/K9 W1,
   DL-K10 W2, DL-K16/K17/K18 W0/value.js, DL-K20 value.js, DL-K24 W1) are AUDITED-present; the
   W6-owned exits land in this wave. The roll-up is the gate's evidence table.
3. **The mobile Lighthouse floors re-assertion (T2 — DL-K11, MEASUREMENT):** run the
   already-authored `proof:lighthouse-mobile` on a quiet host AND/OR the calibrated CI runner
   (`KF_REQUIRE_LH=1`) AFTER the W0 cold-path fix, and RECORD the per-scene scores against the
   B-era floors. The contention-tainted J probe (all ~7–13pts under) is REPLACED by a
   quiet-host artifact: either the floors hold (the rider exits as a clean measurement) or a
   genuine regression is filed against a named scene (the rider exits as a born-RED gate
   target). No "pending a calibrated host" survives.
4. **The demo-smoke wall-clock re-bound (T3 — DL-K13, MEASUREMENT, reconciled to 35m):** record
   a current demo-smoke wall clock on the K tree (a triggered CI run, observed), reconcile
   DL-K13's stale 20m framing with the live 35m ceiling (`ci-cd-k §F-2`), and DECLARE the
   headroom against K's incoming gates. If the measured run is already >30m, re-bound or shard
   BEFORE K's W0/W4/W5 gates ship (the deploy-block class, `K.md` DL-K13). The artifact is the
   measured number, not a guess.
5. **The drag-seam gaps dispositioned (T4 — DL-K15 + W2 §F2/§F3):** the three uncovered
   `setPointerCapture` seams exit by the I.W4 born-RED-or-leave rule — **TimelineTrack diamonds
   (F2, born-RED-able)** route through `useDragCapture`/`acquireSelectSuppression` and JOIN the
   `proof:drag-gesture` roster (a born-RED witness on a real diamond→dock-label drag); **the
   amiga canvas (F3) and the OrbitalDrag third bypass (DL-K15) are measure-first BOOKs** —
   verify live (`getSelection()` after a canvas-to-chrome sweep); convert iff non-empty, else
   the BOOK STANDS with the live measurement on record (a WebGL canvas's `setPointerCapture`
   likely routes the pointer stream away from text-selection — the OrbitalDrag precedent).
6. **The U-K19 playground disposition (T5 — CC-1/GAP-1):** RECORD U-K19's correct rooting (a
   playground-only `AssetViewport` drag-vs-resize hit-conflict, NOT a deployed-SPA defect) and
   make the ONE decision the critic flagged: **is the playground in deployed scope?** If NO
   (the default, per the deployed build = `demo/app`), U-K19 is OUT of the K product-repair band
   and RECORDED as a playground-gesture refinement / new-feature for a future tranche — it does
   NOT ride W3 (layout) or W4 (panes). If YES, the gesture-arbitration fix is named with its
   seam (`AssetViewport.vue:45` move vs `:82` resize). Either way U-K19 stops being orphaned.
   **CC-2 absorbed:** the phantom "square / asset-manager lane" that `live-spring-sequence-mp-verdict.md
   F8` + `gate-estate-k.md` HANDOFF'd to was never spawned — so U-K19 AND the asset-playground
   viewport were roster-orphaned (`completeness-critic.md §FOLD CC-2`). This U-K19 decision IS the
   absorption: the playground-scope decision homes both, so no phantom-lane handoff remains open.
7. **The dev-mode parity chronicle (T6 — CC-4/GAP-3):** RECORD the dev-vs-prod parity / value.js
   `development`-export gotcha as a latent-watch (DORMANT at 4.2.0 per the critic's probe), NOT
   a gate. The terminal disposition: re-watch IFF value.js republishes a `development` exports
   condition (the named tripwire); the MEMORY pin (`project_valuejs_dev_export_gotcha.md`) is
   the standing watch. No gate is built for a dormant defect.
8. **The fold-on-touch + sibling-handoff + BOOK/KILL roll-up (T7):** the latent rows exit with a
   named terminal home — DL-K12 (editor LCP lever) re-measured on a quiet host THEN BOOKed
   (measurement-before-book, never a bare MEASURE-FIRST); DL-K14 (DS-2 `selectedControl:string`
   + DS-5 `storedControls:any`) BOOK→fold-on-touch (typed when the K control work touches the
   store); DL-K19 (A7 idle-bob / A9 `acos` cohesion BOOKs) BOOK-reaffirm with the A7 gate-exclude
   noted as W0's confound (not W6's edit); DL-K20/K21/K22/K23/K24/K25 (value.js next-slice,
   MorphSVG, parse-that, `{types}` VT, dock-double-click, deploy) HANDOFF chronic-by-design,
   kept consume-edge-shaped — W6 RECORDS the consume-edge form (the AUDIT roll-up); the OWNING
   waves are K.W1 (DL-K20/K21/K23/K24), K.W6 (DL-K22 parse-that, W6's own gate-first BOOK), K.WZ
   (DL-K25 deploy); DL-K31 (the 6 K-SEED BOOKs) tripwire-gated; DL-K32 (the 12 K-SEED
   KILLs) + the §1g RE-AFFIRM/RECORD/KILL band KILL-reaffirmed, non-re-litigable.

## §Scope

- **T0 — substrate re-point verification (VERIFY-ONLY; CONSUMED from K.W0).** Confirm
  `scripts/proof-chronic-closure.mjs`'s `CHRONIC_LEDGER` parse target points at the K substrate
  (`docs/tranches/K/PROGRESS.md §"Open deferrals"` or the K ledger home K.W0 grooms), per
  `precepts-k.md §P16` ("the substrate grooming must land as K.W0's first motion so the K ledger
  is the authoritative parse target"). W6 does NOT author the grooming (that is W0's first
  motion); W6 VERIFIES the parse target is the K ledger and that the K ledger's table carries the
  W6-owned rows in the canonical (chronic-name | Disposition | Owning-wave | gate/evidence) shape
  the parser locates (`:85`). **WHY:** the W6 §Hard gate is `proof:chronic-closure` GREEN on the
  K substrate — it cannot bite the right substrate until the parse target is the K ledger.
  **BINDING boundary (→ K.W0):** W0 OWNS the substrate transition (the grooming + the re-point);
  W6 CONSUMES it. If at IMPL the grooming has not landed, W6 BLOCKS on it (W6 cannot terminate a
  ledger that is not yet the parse target) — this is the one ordering dependency in an otherwise
  parallel wave, and it is on W0, the LEAD.

- **T1 — the P-invariant-28 exit roll-up (the gate's evidence table; AUDIT + W6-owned exits).**
  The §2 roll-up's ten `‡` riders, each with its REQUIRED exit form and owner:
  | Rider | Chronicity | Exit form | Owner |
  |---|---|---|---|
  | DL-K2 gate-blindspot | ≥9 | a SYSTEM gate counting engine-driven (not idle-CSS) motion on the COLD path | **K.W0** (audited-present in W6) |
  | DL-K1 cold play race | ≥4 | born-RED cold-path gate (clear localStorage → hero CTA → slider advances) | **K.W0** |
  | DL-K3 CH-3 mobile | 5 | born-RED mobile oracle (spring slider smooth-not-stepped) | **K.W4** |
  | DL-K4 CH-8 amiga | 4 | born-RED appearance/amplitude/persistence oracle | **K.W0** |
  | DL-K6 glass-ui re-pin | 3 (riders E→J) | the 3.13.0 consume sweep (publish-edge exit) | **K.W1** |
  | DL-K7 AX-1 control-point | 5 | consume-on-3.13.0 OR reasoned build-in-kf | **K.W1** |
  | DL-K10 typography root | 4 | ROOT seam fix (RF-2 lever) + dock-voice gate | **K.W2** |
  | DL-K16 FB-1 composition | 5 | K.W0 LAND (the fidelity-floor lead) | **K.W0** |
  | DL-K17 diagnostics sink | 5 | K.W0 channel OR value.js VJ.W3 producer | **K.W0 / value.js** |
  | DL-K18 parse-cache bound | 6 | consume value.js VJ-4 `{maxCacheSize}` | **value.js** |
  | DL-K20 value.js next-slice | 8 | published-consume-edge form | **value.js (chronic-by-design)** |
  | DL-K24 dock double-click | 10 | VERIFY-ONLY re-confirm on the re-pin | **K.W1** |
  W6 OWNS the exits NOT claimed by a cluster wave (the ones below in T2–T7); for the
  cluster-owned riders, W6's gate clause (b) asserts the owning wave's exit artifact EXISTS
  before the close — the roll-up is the AUDIT that no `‡` rider rides a 5th time as a bare BOOK.
  **WHY:** P-invariant-28 forbids a ≥4-tranche rider riding again as a bare BOOK; the roll-up is
  the mechanized check that every such rider's exit is on the record (the J close discharged its
  four named riders — `40fc605` — and K must do the same for these ten).

- **T2 — the mobile Lighthouse floors re-assertion (DL-K11; the perpetual-punt terminator;
  MEASUREMENT artifact).** Run the AUTHORED `scripts/proof-lighthouse-mobile.mjs` on a quiet host
  (load near 0) AND/OR a calibrated CI runner with `KF_REQUIRE_LH=1`, AFTER the W0 cold-path fix
  is live in the built dist (so a scene that was FROZEN at cold-mount measures its real animating
  paint, not a stalled engine). RECORD the per-scene mobile scores against the B-era floors
  (home ≥63, cube ≥64, amiga ≥49, square ≥62, easing ≥61, spring ≥52). The J probe's
  contention-tainted reading (`perf-battery §3`: all ~7–13pts under at load ≈ 10, "NOT asserted
  as regressions") is SUPERSEDED by the quiet-host artifact. Two terminal outcomes, NO third:
  (i) the floors HOLD on the quiet host → the rider exits as a clean measurement, the J terminal
  sentence ("re-assert on a quiet host") DISCHARGED; (ii) a scene genuinely sits below its floor
  on a quiet host → the miss is filed as a born-RED regression against THAT named scene with the
  recorded number (a real lever, e.g. the spring/Monaco LCP path, named in W4 or a perf book).
  **NO "pending a calibrated host" survives** — that exact phrase is the punt P-invariant-28
  forbids. **WHY:** "a measure-first that has never measured-quiet rides indefinitely"
  (`deferred-ledger-k §1c`); the cure is to actually measure on the quiet host the posture has
  always promised. **P6 posture (declared):** Lighthouse mobile scores are device-DEPENDENT —
  the gate is observe-only in CI by its `declarePosture` (`:71`); the W6 artifact is the
  on-device / calibrated-runner HARD reading (the legitimate hard half), recorded with its host
  load per inv ε.
  **CC-3 absorbed (the deployed-origin dimension):** the completeness-critic flagged that every
  perf probe in the fleet served LOCAL `dist/gh-pages`, never the DEPLOYED `keyframes.babb.dev`
  origin (`completeness-critic.md §FOLD CC-3`). The DL-K11 quiet-host re-assertion RUNS over the
  deployed origin (or the byte-identical local cut) AFTER the W0 cold-path fix is live — so the
  measured paint is the live site's REAL animating paint, not a stalled-engine reading. This is the
  post-4.2.0 perf/SOTA posture the critic named having no owning lane; DL-K11's measurement IS that
  posture, now origin-explicit. (K.WZ S5 does the cold-path ANIMATE verify over the deployed origin;
  W6/DL-K11 does the PERF-SCORE re-run — the two halves of CC-3.)

- **T3 — the demo-smoke wall-clock re-bound (DL-K13; MEASUREMENT, reconciled to the live 35m).**
  Trigger a CI run on the K tree and OBSERVE the demo-smoke job's actual wall clock; RECORD it.
  Reconcile DL-K13's stale "20m / ~47s headroom" (the J.W0-era framing) with the live ceiling
  `ci.yml:213 timeout-minutes: 35` and the F-2 projection (~42m > 35m on slow runners). DECLARE
  the headroom against K's INCOMING gates (W0 cold-entry + appearance, W4 panes, W5 truth legs).
  If the measured run is already >30m, the re-bound/shard is REQUIRED before those gates ship —
  the cure is the F-7 lever (move the ~15 static source-grep gates from demo-smoke to the
  `gates` job, `ci-cd-k §F-7`, `ci.yml:538-570`) and/or a job shard, MEASURE-FIRST per CICD-7,
  no pre-optimization. **WHY:** "every K gate ADDED to `demo-smoke` eats the margin; K must
  re-bound or shard the job before it times out (a silent deploy-blocker recurrence)"
  (`deferred-ledger-k §1c`); a timeout-killed CI run blocks every PR and the auto-deploy gate.
  **BINDING boundary (→ K.W5):** the gate-truth wave (W5) owns the CI-leg INSTRUMENTATION (the
  `proof:ci-wallclock` hygiene gate ci-cd-k F-2 proposes, the F-7 migration, the release.yml F-1
  timeout). W6 owns ONLY the DL-K13 MEASUREMENT obligation (record the current number, declare
  the headroom, name the lever) — it does NOT build the ci-wallclock gate (that is a W5 leg).
  W6 hands W5 the measured number; W5 instruments it.

- **T4 — the drag-seam gaps dispositioned (DL-K15 + W2 §F2/§F3; born-RED-or-leave).** The three
  uncovered `setPointerCapture` seams, each by the I.W4 rule:
  - **TimelineTrack diamonds (F2, P2, born-RED-able) — FOLD + gate.** Route the diamond-marker
    drags (`TimelineTrack.vue:170,194`) through `useDragCapture` /
    `acquireSelectSuppression`+`releaseSelectSuppression` (the ONE shared seam, `demo/CLAUDE.md`),
    and EXTEND `proof:drag-gesture`'s `DRAG_SURFACES` roster (`:111-136`) with the timeline-diamond
    surface (a `land` assertion on the diamond's position attr). **Born-RED witness:** before the
    fix, a real `page.mouse` drag from a diamond marker sweeping across a dock label selects text
    (`getSelection()` non-empty, `getComputedStyle(body).userSelect === "auto"` mid-gesture — the
    I.W4 clause-(a) scenario, `wave-J.W2.md §F2`); the new roster entry reds on the unfixed tree,
    greens on the suppression+capture fix. **NO workaround:** the local `.timeline-track`
    Tailwind `select-none` (`:24`) is INSUFFICIENT — it suppresses ON the track only; chrome
    OUTSIDE the boundary is unprotected; the cure is the GLOBAL `body.is-dragging` token, not a
    second local class.
  - **useSphereSpin amiga canvas (F3, P2) + OrbitalDrag third bypass (DL-K15) — measure-first
    BOOK.** Verify LIVE on the built dist: drive a canvas-to-chrome sweep and read
    `getSelection()`. **Convert IFF non-empty** (route through `acquireSelectSuppression`);
    **else the BOOK STANDS with the live measurement on the record** (the OrbitalDrag precedent:
    `getSelection()` was verified EMPTY live at J — `wave-J.W2.md §8`; a WebGL/canvas
    `setPointerCapture` routes the pointer stream away from text-selection machinery). The
    artifact is the recorded `getSelection()` reading, NOT a bare "BOOK". **WHY low-risk for
    F3:** the Three.js canvas has no selectable text; the risk is structural (a future amiga
    change putting DOM beside the canvas), born-RED-or-leave per `wave-J.W2.md §F3`.
  - **The useSheetGesture sheet swipe** rides the SAME disposition as F2 if a live sweep selects
    chrome (the handle's own `user-select:none` is the SheetGrabHandle local class,
    `SheetGrabHandle.vue:68-69` — track-local, same insufficiency as F2's), else BOOK with the
    measurement. **BINDING boundary (→ K.W3/W4):** if the layout/pane waves TOUCH the timeline
    or sheet surfaces, the suppression fix lands THERE on touch; W6 owns the disposition + the
    born-RED gate-roster extension, the cluster wave owns the edit if it is already editing the
    component. Disjoint by default: W6's edit is the suppression seam + the roster, not the
    component's layout/voice.

- **T5 — the U-K19 playground disposition (CC-1/GAP-1; RECORD + ONE decision).** RECORD U-K19's
  material correction: the only resize-on-drag is `AssetViewport.vue` (move `:45` vs resize `:82`,
  both `@pointerdown.stop`), mounted ONLY in `demo/playground/App.vue:22`, ABSENT from the
  deployed `demo/app` build (`package.json:42`). **The ONE decision (the K-decision-gate the
  critic flagged): is the playground in deployed scope?** Default (verified) = NO — the deployed
  surface is the multi-scene SPA, not the playground. So U-K19 is **OUT of the K product-repair
  band** (it does NOT ride W3 layout or W4 panes as a deployed defect) and is RECORDED as a
  playground-only drag-vs-resize hit-conflict (a gesture-arbitration refinement at
  `AssetViewport.vue:45/:82`) OR a new-feature request — both for a FUTURE tranche, not K. If the
  decision flips to YES (the playground ships), the named exit is the hit-target arbitration fix
  with its seam. **WHY:** "an unrooted user finding is exactly the class the K-seed reconciliation
  says K exists to terminate" (`completeness-critic §3`); the termination is the rooting + the
  scope decision, not a forced fix on a surface that is not deployed. **NO workaround:** do NOT
  fold U-K19 into the deployed-repair wave (it would manufacture work on a non-deployed surface —
  an inv-ε violation: claiming a deployed-defect fix where no deployed defect exists).

- **T6 — the dev-mode parity chronicle (CC-4/GAP-3; RECORD-only latent-watch).** RECORD the
  dev-vs-prod parity / value.js `development`-export gotcha as DORMANT at 4.2.0 (the critic's
  probe found no `development` condition in value.js 0.11.2's `exports`). The terminal
  disposition: **RECORD-only, NOT a gate** — re-watch IFF value.js republishes a `development`
  exports condition (the NAMED tripwire); the MEMORY constellation pin
  (`project_valuejs_dev_export_gotcha.md`) is the standing watch. **WHY:** every fleet probe drove
  the BUILT dist (correct per mandate), so an HMR-only defect was invisible — but the probe shows
  none surfacing, so building a dev-parity gate for a dormant condition is gate-for-gate's-sake
  (a phantom-gate, the I/J class of retired proxy gates). The artifact is the recorded dormancy +
  the tripwire, not a gate. **NO workaround:** do NOT add a `npm run dev` HMR smoke gate — it
  would assert a condition that does not surface, a vacuous oracle.

- **T7 — the fold-on-touch + sibling-handoff + BOOK/KILL roll-up (the latent residue, terminal
  homes).** Each row exits with a NAMED home, NO bare MEASURE-FIRST:
  - **DL-K12 (editor LCP lever, cube 58 / spring 73, Monaco's ~8MB lazy):** re-measure on a quiet
    host FIRST (the artifact), THEN BOOK with the recorded number (measurement-before-book). NOT
    a bare "MEASURE-FIRST" — the measurement IS the exit; the book carries it. Tripwire: the
    K-era editor work (if any) or a Baseline shift. `perf-battery §3` (the J reading: 4.8–5.9s
    LCP under load, a REAL relative observation).
  - **DL-K14 (DS-2 `selectedControl:string` retype + DS-5 `storedControls:any`):** BOOK→fold-on-touch
    — typed-narrow when the K control-surface work (W2/W4) touches the dock store; the artifact is
    the named seam (`controlOptionsStore.ts:6`, `useAnimationGroupPlayback.ts:16`) + the
    fold-on-touch rule. Latent type-hygiene, not a defect.
  - **DL-K19 (A7 cube idle-bob CSS dogfood / A9 matrix `acos` Euler recovery, 10-tranche cohesion
    BOOKs):** BOOK-reaffirm (cohesion, NOT defects) — BUT A7's `.idle-hover` (`CubeTarget.vue:207-214`)
    is the EXACT mechanism that false-GREENs the B1 vacuity (`deferred-ledger-k §1d`); the
    gate-exclude (or engine-driven idle replacement) is **K.W0's** edit (the engine-write
    disambiguation), NOT W6's — W6 RECORDS the confound and points at W0.
  - **DL-K20/K21/K22/K23/K24/K25 (value.js next-slice 8-tranche, MorphSVG, parse-that packrat,
    `{types}` VT, dock-double-click, deploy):** HANDOFF chronic-by-design, kept consume-edge-shaped
    — each born-RED-able the instant its sibling primitive publishes (the published-consume-edge
    FORM is the P-inv-28 exit, NOT a bare BOOK). DL-K24 (dock-double-click) carries a re-verify
    rider on the 3.13.0 dock-taxonomy rewrite (the W1 re-pin could re-open it) — W6 RECORDS the
    re-verify obligation, W1 executes it.
  - **DL-K31 (the 6 K-SEED BOOKs: CC-5/CC-6/VT-D/K4/K5/EPF-1/EPF-4):** BOOK tripwire-gated —
    each non-blocking, rides a future wave when its NAMED tripwire (a Baseline/workload) fires.
  - **DL-K32 (the 12 K-SEED KILLs) + the §1g RE-AFFIRM/RECORD/KILL band:** KILL-reaffirm /
    RECORD-terminal, **non-re-litigable** — the carried ARCH kills, the J-terminal RE-AFFIRMs
    (EXCEPT the three the K live audit re-falsified — CH-3→DL-K3, CH-8→DL-K4, cold-play→DL-K1,
    which are cluster-wave-owned), the RECORD historicals. W6 does NOT re-open these; it
    CARRIES them for completeness so the ledger is the single substrate.

## §Hard gate (the proof:* that BITES — the ledger-terminality oracle: every rider exits with a MEASUREMENT ARTIFACT or a reasoned KILL · ZERO bare MEASURE-FIRST rows)

**The oracle:** `proof:chronic-closure` GREEN on the K substrate, with the W6-specific
strengthening that **no row's disposition is a bare "MEASURE-FIRST" / "pending a calibrated
host" / "TBD"** — every exit-only row carries a re-derivable discharge. The gate is the
mechanized P-invariant-28 check (`scripts/proof-chronic-closure.mjs:53-102`) plus the W6 evidence
artifacts that fill its (Disposition | Owning-wave | gate/evidence) columns.

- **clause (a) — `proof:chronic-closure` GREEN on the K substrate, ZERO bare MEASURE-FIRST
  (CORRECTNESS).** The gate parses the K ledger's `## Open deferrals` table (the parse target
  re-pointed J→K by W0, verified T0) and asserts every row carries a Disposition, an Owning-wave,
  and a gate/evidence cite (`:85`). The W6 strengthening: the disposition vocabulary may NOT
  contain a bare deferring token — every W6-owned row's disposition is one of {a recorded
  measurement, a born-RED gate id, a published consume-edge, a tracked BOOK-with-tripwire, a
  HANDOFF-with-owner, a KILL}; the strings "MEASURE-FIRST" / "pending a calibrated host" /
  "re-assert later" / "TBD" appear in NO W6-owned row's disposition column. **BORN-RED WITNESS:**
  on the K substrate BEFORE the W6 measurements land, the DL-K11 row reads "FOLD/VERIFY — re-assert
  on a quiet host" (a bare deferral inherited from `perf-battery §3` / `deferred-ledger-k §1c`),
  the DL-K12 row reads "MEASURE-FIRST", and the DL-K15/F2 row reads "FOLD K (unproven)" — the
  W6-strengthened gate REDS on these bare-deferral strings. **BITE:** reds on a row whose
  disposition is a bare punt; greens once T2's quiet-host measurement, T3's wall-clock number,
  T4's born-RED roster extension + live `getSelection()` readings, and T7's
  measurement-before-book replace the punts with artifacts. **NO escape:** the gate is
  device-INDEPENDENT (it parses a markdown table on disk) — it HARD-gates; there is no `IN_CI`
  branch and no `continue-on-error`.

- **clause (b) — the P-invariant-28 exit roll-up is COMPLETE (CORRECTNESS, the audit half).**
  For each of the ten `‡` ≥4-tranche riders (§2 roll-up / T1), the K ledger row names an exit
  FORM that is NOT a bare BOOK: a measurement artifact, a born-RED gate, a published
  consume-edge, or a KILL — AND for the cluster-wave-owned riders (DL-K1/K2/K4/K16/K17 → W0,
  DL-K6/K7/K9/K24 → W1, DL-K10 → W2, DL-K3 → W4, DL-K18/K20 → value.js), the named owning wave's
  exit artifact EXISTS before the close (W6's gate clause reads the owning wave's discharge cite,
  not a promise). **BORN-RED WITNESS:** on the pre-W6 K ledger, the §2 roll-up exists as PROSE
  (the audit's narrative) but is not asserted row-by-row against the disposition column — a rider
  could ride as a bare BOOK undetected; the roll-up gate clause reds if any `‡` row's disposition
  is a bare BOOK or names an owning wave whose artifact is absent. **BITE:** reds if a ≥4-tranche
  rider survives as a bare BOOK (the J close discharged its four named riders at `40fc605` —
  K must do the same for these ten); greens when every `‡` row's exit form is on the record.

- **clause (c) — the mobile Lighthouse floors are MEASURED on a quiet host, NOT deferred
  (CORRECTNESS of the measurement obligation; the artifact is observe-only-tier in CI).** The W6
  artifact records `proof:lighthouse-mobile`'s per-scene mobile scores from a quiet host (load
  near 0) and/or a `KF_REQUIRE_LH=1` calibrated runner, AFTER the W0 cold-path fix, against the
  B-era floors. The gate clause asserts the artifact EXISTS (the DL-K11 row cites a recorded
  number per scene, not "pending"). **BORN-RED WITNESS:** the J probe is the born-RED-adjacent
  baseline — load ≈ 10, all scenes ~7–13pts under floor, "NOT asserted as regressions"
  (`perf-battery §3`); the W6 measurement REPLACES it with a quiet-host reading. **BITE:** the
  DL-K11 row reds under clause (a) while its disposition is "pending a calibrated host"; greens
  when the quiet-host artifact lands (floors hold → clean exit; a floor genuinely missed →
  born-RED regression filed against the named scene). **P6 posture (declared):** the scores are
  device-DEPENDENT — `proof:lighthouse-mobile` is observe-only in CI by its `declarePosture`
  (`:71`); this clause asserts the ON-DEVICE / calibrated-runner MEASUREMENT artifact exists, NOT
  a CI hard-gate on absolute scores (the artifact is hard on-device, recorded with its host load
  per inv ε — `perf-battery §0`'s "every number carries its measurement load").

**The §spine bar — MUST bite.** Clauses (a) and (b) are the CORRECTNESS oracle: (a) asserts the
ledger is structurally terminal (every W6 row carries a re-derivable discharge, zero bare punts)
and (b) asserts P-invariant-28 holds (every ≥4-tranche rider's exit form is on the record). Each
asserts an EXACT property a markdown-parse can verify (no disposition column contains a deferral
token; every `‡` row names a non-BOOK exit). Clause (c) is the device-DEPENDENT measurement
artifact (observe-only-tier in CI, hard on-device) — it certifies the DL-K11 perpetual punt is
terminated by a recorded number, the FORM the P6 boundary demands. **The born-RED witness is
CONCRETE:** the pre-W6 K ledger carries the inherited bare-deferral strings ("re-assert on a
quiet host" / "MEASURE-FIRST" / "unproven") on the DL-K11/K12/K15 rows — the W6-strengthened
`proof:chronic-closure` reds on those strings and greens only when the measurements and
dispositions replace them. **Two-tier taxonomy:** the wave's GREEN depends on the CORRECTNESS
clauses (a)+(b); clause (c)'s measurement artifact is the device-dependent evidence that
discharges DL-K11 — it is observe-only-tier in CI and may NEVER substitute for the ledger-parse
correctness, but its ABSENCE reds clause (a) (the DL-K11 row stays a bare punt). **P6 posture
(declared per clause):** (a)/(b) device-INDEPENDENT (markdown parse) — HARD; (c) device-DEPENDENT
(Lighthouse scores) — the artifact is hard on-device / `KF_REQUIRE_LH=1`, observe-only in CI.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO bare MEASURE-FIRST row survives the close.** This is the wave's defining prohibition. A
  disposition of "MEASURE-FIRST", "pending a calibrated host", "re-assert later", or "TBD" is the
  perpetual-punt class P-invariant-28 forbids (`precepts-k §P16`); every W6-owned exit-only row
  carries a re-derivable artifact (a recorded number, a born-RED gate id, a published
  consume-edge, a BOOK-with-tripwire, a HANDOFF-with-owner, or a KILL). DL-K11 and DL-K12 exit by
  ACTUALLY MEASURING on a quiet host, NOT by re-promising the measurement.
- **NO raising the `distinct-count` threshold to "fix" a perf or drag reading.** (The charter's
  named forbidding for the engine-write axis — `K.md §MANDATE`: "the B1 vacuity dies by
  DISAMBIGUATING engine writes from CSS animation, NOT by raising the distinct-count threshold".)
  W6's measurements read the REAL property (a quiet-host Lighthouse score, a real
  `getSelection()` after a sweep, a real wall clock), never a relaxed threshold that papers over
  a defect.
- **NO new gate for a dormant defect (the dev-mode parity gate).** T6 is RECORD-only with a named
  tripwire; building an `npm run dev` HMR-parity smoke gate for a value.js `development`-export
  condition that does NOT surface at 4.2.0 (the critic's probe) is a phantom/vacuous gate — the
  exact I/J-class retired-proxy-gate footgun. The watch is the MEMORY pin + the republish
  tripwire, not a gate.
- **NO folding U-K19 into the deployed-repair band.** U-K19's only surface is the playground-only
  `AssetViewport` (verified absent from `demo/app`); folding it into W3/W4 as a deployed defect
  manufactures work on a non-deployed surface (an inv-ε violation — claiming a deployed-defect
  fix where none exists). The termination is the rooting + the scope decision, OUT of the
  deployed band by default.
- **NO local-class drag-suppression "fix".** T4's TimelineTrack cure is the GLOBAL
  `body.is-dragging` token via `useDragCapture`/`acquireSelectSuppression`, NOT a second
  element-local `select-none` class — the local `.timeline-track select-none` (`:24`) is exactly
  the insufficiency the audit named (chrome OUTSIDE the boundary is unprotected); adding another
  local class repeats the bug.
- **NO converting a measure-first BOOK without the live measurement.** T4's amiga/OrbitalDrag
  seams convert to suppression ONLY if a live `getSelection()` sweep is non-empty (born-RED-or-leave);
  converting on suspicion (the OrbitalDrag precedent showed `getSelection()` EMPTY live) would add
  suppression machinery a real device does not need — a workaround in the opposite direction.
- **NO re-litigating a J-terminal RE-AFFIRM/KILL.** The §1g band (the carried ARCH kills, the
  genuinely-closed RE-AFFIRMs, the RECORD historicals) is non-re-litigable; W6 CARRIES them for
  completeness, does NOT re-open them. (The three K-re-falsified RE-AFFIRMs — CH-3/CH-8/cold-play
  — are cluster-wave-owned, not W6's re-litigation.)

## §Folds (every K.md-assigned fold, with its evidence citation)

- **DL-K11** (mobile Lighthouse floors UNASSERTED; recurring punt, never measured-quiet) — T2
  (the quiet-host / `KF_REQUIRE_LH=1` measurement artifact replaces "pending a calibrated host").
  `deferred-ledger-k §1c`, `perf-battery-2026-06-10.md:36-55`, `proof-lighthouse-mobile.mjs:60-74`.
  The §Hard gate clause (c) born-RED witness.
- **DL-K13** (demo-smoke wall-clock; K's new gates eat the margin) — T3 (the measured current
  wall clock, reconciled to the live 35m ceiling; the headroom declared; the lever named).
  `deferred-ledger-k §1c`, `ci-cd-k §F-2` (`ci.yml:207-213`, the CICD-7 35m recalibration),
  `§F-7` (the static-gate migration lever). The CI-leg instrumentation HANDS to W5.
- **DL-K15** (the W2-noted drag-seam gaps + OrbitalDrag third bypass) — T4 (TimelineTrack
  born-RED FOLD + roster; amiga/OrbitalDrag/sheet measure-first BOOK with live `getSelection()`).
  `wave-J.W2.md §F2/§F3/§8`, `live-amiga-breakage.md §gate-blindspot`,
  `proof-drag-gesture.mjs:111-136`, `TimelineTrack.vue:170,194`, `useSheetGesture.ts:52`,
  `useSphereSpin.ts:96`.
- **DL-K12** (the editor-pane LCP lever; cube 58 / spring 73, Monaco lazy ~8MB) — T7
  (measurement-before-book: re-measure quiet, THEN BOOK with the number; tripwire = K editor work
  / Baseline shift). `deferred-ledger-k §1d`, `perf-battery §3`.
- **DL-K14** (DS-2 `selectedControl:string` retype + DS-5 `storedControls:any`) — T7
  (BOOK→fold-on-touch; named seams `controlOptionsStore.ts:6` / `useAnimationGroupPlayback.ts:16`).
  `deferred-ledger-k §1d`, `wave-J.W2.md §8`.
- **DL-K19** (A7 cube idle-bob CSS dogfood / A9 matrix `acos`; 10-tranche cohesion BOOKs) — T7
  (BOOK-reaffirm; A7's `.idle-hover` confound RECORDED as K.W0's gate-exclude, not W6's edit).
  `deferred-ledger-k §1d`, `CubeTarget.vue:207-214`.
- **DL-K20/K21/K22/K23/K24/K25** (value.js next-slice 8-tranche; MorphSVG; parse-that packrat;
  `{types}` VT; dock-double-click; deploy) — T7 (HANDOFF chronic-by-design, consume-edge-shaped).
  **This is W6's AUDIT ROLL-UP of the consume-edge FORM (RECORD), not the owning disposition** — the
  owning waves are: DL-K20/K21/K24 → **K.W1** (re-pin re-confirm / VERIFY-ONLY), DL-K23 → **K.W1**
  (RF-3/RF-4 fold into the DL-K6 re-pin), DL-K22 → **K.W6** (the parse-that `proof:packrat-position`
  gate-first BOOK, W6's own), DL-K25 → **K.WZ** (deploy-owned, confirm). W6 RECORDS that every row
  keeps the published-consume-edge form (the P-inv-28 exit), never a bare BOOK; DL-K24 carries a
  3.13.0 re-verify rider handed to W1. `deferred-ledger-k §1e`, `PROGRESS.md §"Open deferrals"`.
- **DL-K31** (the 6 K-SEED BOOKs, tripwire-gated) + **DL-K32** (the 12 K-SEED KILLs) + the §1g
  RE-AFFIRM/RECORD/KILL band — T7 (BOOK tripwire-gated / KILL-reaffirm / RECORD-terminal,
  non-re-litigable). `deferred-ledger-k §1f/§1g`, `k-seed-reconciliation.md`.
- **U-K19** (dragging resizes the container) — T5 (RECORD the playground-only rooting + the
  scope decision; OUT of the deployed-repair band by default). `completeness-critic §3 GAP-1/§4/CC-1`,
  `AssetViewport.vue:45/:82`, `demo/playground/App.vue:22`, `package.json:42`.
- **The dev-mode parity chronicle** (value.js `development`-export gotcha) — T6 (RECORD-only
  latent-watch; DORMANT at 4.2.0; tripwire = value.js republishes a `development` condition).
  `completeness-critic §3 GAP-3/CC-4`, MEMORY `project_valuejs_dev_export_gotcha.md`.
- **The P-invariant-28 §2 roll-up** (ten ≥4-tranche `‡` riders) — T1 + §Hard gate clause (b)
  (every rider's exit form on the record; cluster-owned ones audited-present). `deferred-ledger-k §2`,
  `precepts-k §P16`.
- **The substrate transition** (the K ledger becomes the `proof:chronic-closure` parse target) —
  T0 (CONSUMED from W0; W6 verifies). `proof-chronic-closure.mjs:53-102`, `precepts-k §P16`.

## §Hand-off / cross-wave boundaries (BINDING)

- **← K.W0 (the substrate + the cold-path fix, BINDING):** W0's first motion grooms the K ledger
  onto disk + re-points `proof:chronic-closure`'s parse target J→K (T0); W6 CONSUMES and VERIFIES
  it (W6 cannot terminate a ledger that is not yet the parse target). W0 also OWNS the cold-path
  P0 fix (DL-K1/K2) and the A7 idle-bob gate-exclude (DL-K19's confound) and the FB-1 composition
  LAND (DL-K16) and the diagnostics channel (DL-K17) — W6 AUDITS these exits present (clause b),
  does NOT author them. **W6's one ordering dependency is on W0** (the substrate); otherwise W6
  is parallel. DL-K11's measurement (T2) RUNS AFTER the W0 cold-path fix is live (measure the
  fixed product).
- **→ K.W5 (the gate-truth wave, BINDING):** W5 owns the CI-leg INSTRUMENTATION — the
  `proof:ci-wallclock` hygiene gate (ci-cd-k F-2), the F-7 static-gate migration, the release.yml
  F-1 `timeout-minutes` (`K.md §W5` names "release.yml `timeout-minutes` (F-1)" + "the demo-smoke
  19m13s/20m wall-clock hazard dispositioned" as W5 legs). W6 owns ONLY the DL-K13 MEASUREMENT
  (record the current number, declare the headroom, name the lever); it HANDS W5 the number; W5
  instruments. The F-1 row's terminal home is W5 (W6 confirms it is not orphaned).
- **→ K.W1 (the re-pin, BINDING):** the sibling-handoff consume-edge riders that ride the 3.13.0
  re-pin — DL-K6/K7/K9 (glass-ui), DL-K24 (dock-double-click re-verify on the dock-taxonomy
  rewrite) — are W1's exits; W6 RECORDS the consume-edge form + the DL-K24 re-verify obligation in
  the ledger, W1 executes. The value.js handoffs (DL-K18/K20/K21/K22) ride value.js' own tranche
  process (consume on publish); W6 keeps them consume-edge-shaped.
- **→ K.W2 / K.W4 (the control-surface waves, BINDING):** DL-K14 (the dock-store type retype) and
  the T4 drag-seam suppression edits fold-on-touch IF W2/W4 are already editing the timeline /
  sheet / dock-store component; disjoint by default (W6 owns the suppression seam + the
  `proof:drag-gesture` roster extension; the cluster wave owns the layout/voice edit). DL-K3
  (CH-3 mobile / spring slider steps) is W4's born-RED oracle — W6 audits it present (clause b).
- **→ K.WZ (the close, BINDING):** the close requires the K ledger TERMINAL + `proof:chronic-closure`
  GREEN on the K substrate (`K.md §CLOSE`: "the chronic-closure substrate transition J→K … the K
  ledger terminal"). W6 is the wave that EARNS that terminality (clauses a+b GREEN, zero bare
  MEASURE-FIRST); W6 MUST land before WZ. The J→K substrate re-point itself fires AT the WZ close
  motion (`proof-chronic-closure.mjs:53-60` precedent — the I→J transition fired at J.WZ); W6
  verifies the K substrate is parse-ready, WZ executes the terminal re-point.
- **OUT / sibling (do NOT touch):** the value.js VJ.W0–W4 producers (DL-K18/K20/K21 — value.js'
  own tranche); the deploy CNAME/template/roster (DL-K25 — deploy-repo-owned); the glass-ui root
  AX/RF items (DL-K8 tail — glass-ui via the handoff ledger). W6 keeps these consume-edge-shaped
  in the ledger; it never edits the sibling.

## §Design decisions (trade-offs RESOLVED)

- **The wave is LEDGER HYGIENE, not product repair — RESOLVED.** Every product-defect rider
  (DL-K1/K2/K3/K4/K6/K7/K9/K10/K16/K17) is owned by a CLUSTER wave (W0/W1/W2/W4); W6 owns the
  RESIDUE — the measurements, the drag-seam closures, the dispositions, the type-hygiene folds,
  the BOOK/KILL roll-up. W6 AUDITS the cluster exits present (clause b) but does NOT author them.
  This is why W6 parallelizes (`K.md §WAVE MAP`): it gates nothing downstream except the WZ
  ledger-terminality.
- **DL-K11 and DL-K12 exit by MEASURING, not re-promising — RESOLVED.** The perpetual-punt class
  ("re-assert on a quiet host" carried D→J without ever measuring) is terminated by ACTUALLY
  running the authored gates on a quiet host / calibrated runner and RECORDING the numbers. The
  artifact is the recorded score, not a stronger promise. This is the §No-workaround defining
  prohibition made the wave's purpose.
- **DL-K13 reconciled to 35m, not 20m — RESOLVED.** DL-K13's "20m / ~47s headroom" is the
  J.W0-era framing; the live ceiling is 35m (raised at J.W4, `ci-cd-k §F-2`). W6's obligation is
  a CURRENT measured wall clock + the headroom declaration against K's incoming gates, NOT a
  re-statement of the stale 20m. The CI instrumentation (the `proof:ci-wallclock` gate, the F-7
  migration) is W5's, not W6's — W6 measures, W5 instruments.
- **The three drag seams split born-RED vs measure-first — RESOLVED.** TimelineTrack diamonds are
  born-RED-able (a real DOM-chrome drag selects text) → FOLD + roster. The amiga canvas + the
  OrbitalDrag bypass + (conditionally) the sheet swipe are measure-first BOOKs (a WebGL canvas
  likely routes the pointer stream away from selection; OrbitalDrag was verified EMPTY live) →
  convert iff a live `getSelection()` sweep is non-empty, else BOOK with the measurement on
  record. The I.W4 born-RED-or-leave rule decides each, not a blanket convert.
- **U-K19 is OUT of the deployed band — RESOLVED.** The only resize-on-drag is playground-only
  (`AssetViewport`, absent from `demo/app`); folding it into the deployed-repair wave would
  manufacture a deployed-defect fix where no deployed defect exists. The termination is the
  rooting + the scope decision (playground in deployed scope? default NO), OUT by default. The
  fix (if the playground ever ships) is the named hit-target arbitration at `AssetViewport.vue:45/:82`.
- **The dev-mode parity gotcha is RECORD-only, not a gate — RESOLVED.** The condition is DORMANT
  at 4.2.0 (the critic's value.js 0.11.2 `exports` probe); a gate for a non-surfacing condition
  is vacuous (the retired-proxy-gate class). The exit is the recorded dormancy + the named
  republish tripwire + the MEMORY pin, not an HMR smoke gate.
- **The §Hard gate is the chronic-closure parse, strengthened — RESOLVED.** W6 does NOT author a
  new gate; it RIDES `proof:chronic-closure` on the K substrate (the AUTHORED P-invariant-28
  mechanizer) and STRENGTHENS its assertion: zero bare MEASURE-FIRST/pending tokens in any
  W6-owned disposition column. The born-RED witness is the pre-W6 K ledger carrying the inherited
  bare-deferral strings on DL-K11/K12/K15 — the gate reds on them and greens when the artifacts
  replace them. This keeps W6 within the dev/impl boundary (no new product surface, no new gate
  where a re-run + a parse strengthening suffices).
