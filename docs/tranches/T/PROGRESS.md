# Tranche T — PROGRESS (the board)

> Phase: **IMPL DRIVE** (opened 2026-07-05; the row-2 hold LIFTED per OWNER-ASKS row 3,
> execution ordered by the owner post-compaction). Branch `tranche-t-impl` off
> `tranche-s-impl` @ `76d4278`. Board discipline per T.md §5 + lane 27 rec 4: every
> entry is appended at the event, never reconstructed; a board row citing state that a
> re-run contradicts is a defect (`proof:board-live` is a T.M1-adjacent deliverable —
> until it lands, treat this board as claims, verify by git + gate runs).

## State

| Band | State | Notes |
|---|---|---|
| T.M | **IN-DRIVE ①** | mechanism first — M1/M2/M6/M7-ledger/M8/M9/M10 batch ①; M3 awaits T.A/T.D renders; M4/M5 land born-RED (backlog posture) |
| T.A | DEVELOPED-HARDENED | lanes 02/03/04/07 · queued after T.M |
| T.B | DEVELOPED-HARDENED | lanes 23/10/06/04/30/21 · OD-5 riders R1/R2 born-OWNER |
| T.C | DEVELOPED-HARDENED | lanes 08/30/20 |
| T.D | DEVELOPED-HARDENED | lanes 09/31/01/12/17/19 · OD-2 more-subtle amendment binds T.D13 |
| T.E | **IN-DRIVE ①** | OD-1 = PRUNE FINAL → T.E3 executes (T.E2 DEAD); batch ① = E1/E3/E4/E5/E11-partial; easing redemption (E6–E10) later batch, OD-7 still pending-owner |
| T.F | DEVELOPED-HARDENED | THE GRAND COLOCATION EDICT (23 waves) · after E+B settle the survivor set |
| T.G | DEVELOPED-HARDENED | lanes 11/32/26/12 · measures the final surface |
| T.H | **IN-DRIVE ①** | batch ① = H1 gap-ledger/H2 letter/H4 LabeledSelect; H3 Drawer rides with T.B; H5/H6 gated-on-publish tripwires |
| T.S | DEVELOPED-HARDENED | lanes 27/32/28 · parallel; unblocks the S.Z close |
| Prototypes | SERVED (blessed) | P-HERO/P-PANEL/P-THEME = the born-OWNER baselines; kept worktrees, NEVER purged |

## Session log

- **2026-07-04** — T opened by the owner verdict (OWNER-ASKS row 4). Evidence preserved
  (ORIGINAL-PROMPT.md verbatim + VERDICT.md + 18 shots) at `68c9a5d`.
- **2026-07-05** — the 32-lane audit fleet COMPLETE (`wf_66c7e419-23f`: 32/32 lanes,
  0 errors, 4.87M tokens, ~2h45m; 3-at-a-time per the owner's batch spec; design lanes
  01–10 on Fable + frontend-design, tech lanes on Opus/Sonnet). Lane reports + shot
  evidence committed at `9cfbd0d`. One probe side-effect (epf1-baseline.json) reverted.
- **2026-07-05** — the Fable synthesis: `T.md` charter authored (3 root causes, 10 bands,
  DAG, owner-decision register OD-1..6, non-goal ring-fence, orchestration spec).
  Wave-doc fan-out launched (batches of 3, Opus/Sonnet, file-disjoint).
- **2026-07-05** — **THE GRAND COLOCATION EDICT** received mid-authoring (OWNER-ASKS.md
  row 1, verbatim): recursive colocation for ALL directories, shared dirs only for true
  module/global-level members, long dirs always → encapsulated modules, the LIBRARY given
  the same treatment befittingly, the demo AGGRESSIVELY purged. T.F ELEVATED (charter §1
  row rewritten, §4 ring-fence reconciled: zone BOUNDARIES protected, zone INTERNALS in
  scope); edict-fold agent amending waves/T.F.md (+3 waves: the recursive-colocation
  enforcement gate, the library half, the aggressive purge) + the PROMPT-RECAP row.
- **2026-07-05** — the corpus workflow COMPLETE (`wf_2266905f-245`: 15 agents, 0 errors —
  10 authors, trace over 206 recs, 3-lane harden, 13 findings applied / 4 skipped-with-reason).
  The two residuals closed by the post-harden synthesizer ruling: lane 25 recs 2-7 assigned
  owners (dated addenda in T.B/T.E/T.F/T.H/T.M + index + charter lane columns); the KfPillTabs
  double-own verified already cured (T.B6 consumer / T.H5 single deletion owner / T.F16 rename).
  Corpus state: 10 band docs (23 waves in T.F alone), PROMPT-RECAP, KF-TO-GLASSUI-BG,
  OWNER-DECISIONS (OD-1..7), SYNTHESIS-INDEX 206/206 covered, 3 harden reports.
  PROTOTYPE PHASE OPENED: P-HERO (OD-4+OD-2), P-PANEL (OD-5), P-THEME (OD-6) — one batch of 3
  Fable+frontend-design worktree agents; kept branches; captures → audit/prototypes/.
- **2026-07-05** — **PROTOTYPES COMPLETE + SERVED** (`wf_1e744f4d-2bb`: 3/3 Fable lanes, 0
  errors). Review board (baseline :5180 = the current rejected tree):
  · **P-HERO** (OD-4+OD-2) → http://localhost:5181 — `#/` the ink-on-graph-paper hero
    (per-char wave, φ-band seat, honest 400 ink, serif deck, egg excised, play-first);
    `/?light=1#/` the Aurora cursor-light fork. Branch `worktree-wf_1e744f4d-2bb-1` @ 88bde55.
  · **P-PANEL** (OD-5) → http://localhost:5182 — `#/square` the honest triad returns (Play
    tours ±90px/360°, knobs govern paint), pane deleted → two floating GlassPanels, docks
    elide, stage stripped, teal tether. Branch `worktree-wf_1e744f4d-2bb-2` @ 031fd1e.
  · **P-THEME** (OD-6) → http://localhost:5183 — sitewide faux-bold kill + Jakarta body +
    mono demotion + ONE violet oklch authority (red → destructive-only). Branch
    `worktree-wf_1e744f4d-2bb-3` @ cc3e64d.
  Captures + PROTO-NOTES committed per-branch under docs/tranches/T/audit/prototypes/.
  AWAITING OWNER TOKENS: OD-1 (svg fuse-vs-prune), OD-2 (Aurora vs remove), OD-3 (ppMode),
  OD-4/5/6 (the served prototypes). Tokens land in OWNER-DECISIONS.md; per T.M's mechanism
  they unlock the born-OWNER design-wave oracles. T development is otherwise COMPLETE.
- **2026-07-05** — OWNER TOKENS (first tranche): **OD-2 = AURORA-ON-HERO** ("Aurora on
  hero"), **OD-3 = KEEP** ("Keep ppmycota"), **OD-1 = PROVISIONAL-PRUNE** ("Prune morph and
  motion path unless you can convince me otherwise" — the FUSE case presented once; PRUNE
  executes absent a reversal). OD-4/5/6 pending the live prototype review
  (:5181/:5182/:5183 vs :5180, all verified LIVE).
- **2026-07-05** — **ALL OD TOKENS LANDED + THE CORPUS RATIFIED** (OWNER-ASKS row 2,
  verbatim): OD-1 PRUNE FINAL · OD-2 Aurora AMENDED more-subtle · OD-3 KEEP · OD-4
  APPROVED · OD-5 APPROVED-DIRECTION (+2 named reworks: the controls composition; the
  top-left curve preview "improved dramatically" — born-OWNER riders on T.B4/T.B6/T.D) ·
  OD-6 APPROVED. Every born-OWNER design oracle now has its reference (the P-HERO /
  P-PANEL / P-THEME branches are the blessed baselines; P-HERO's aurora setting is a
  CEILING per the amendment). **T = DEVELOPED + RATIFIED. IMPL EXPLICITLY HELD** ("Do not
  begin dev yet"). Standing: the 4 servers stay live for reference; the S.Z close remains
  queued behind the T impl drive (T.S band).

- **2026-07-05 — THE DRIVE OPENS.** Post-compaction, per the owner's execution order
  ("Begin and continue the current tranche … completed the plan IN TOTALITY"). Branch
  `tranche-t-impl` cut off `tranche-s-impl` @ `76d4278`; board flipped to IMPL DRIVE;
  draft PR onto master opened. **Batch ① launched** (3 Opus worktree lanes per T.md §5):
  **T.M** (the mechanism — M1/M2/M6/M9/M10 full + M7 retirement ledger + M8 FROZEN
  discharge + M4/M5 born-RED backlog posture; M3 deferred to post-T.A/T.D renders) ∥
  **T.E prune** (E1 compose-delete + E3 morph/motion-path-prune per OD-1 PRUNE FINAL +
  E4 utility-keyed-layout kill + E5 narrowed + E11 partial retirement execution) ∥
  **T.H** (H1 gap-ledger+tripwire + H2 letter-shipped+caps + H4 LabeledSelect; H5/H6
  ledgered gated-on-publish). Register note at entry: OD-1..6 carry tokens; **OD-7
  (easing gallery design) is the one PENDING-OWNER row** — T.E6's oracle stays
  unauthored until its token; the easing batch will build+serve the surface for the
  mid-drive owner review alongside OD-5's R1/R2 riders.

- **2026-07-05 — BATCH ① MERGED + VERIFIED (T4/T5).** Fleet `wf_c448d25e-99e`, 3/3 Opus
  lanes, 1.02M tokens. **T.M** (`1307e09`): M1/M2/M6/M7-ledger/M9/M10 landed GREEN +
  plant-tested; M4/M5/M8-count landed born-RED into the NEW `T_BORNRED_BACKLOG`
  mechanism (gate-bands.mjs) + ci-coverage clause 11; the F9 fold executed (3 orphaned
  S.B6 gates → hygiene-chain + ci gates job); M3 deferred to post-render. **T.E**
  (`9eef50b`): compose+morph+motion-path deleted in totality (routes 9→6), OD-1 PRUNE
  executed, 7 gate keys retired through every aggregator, `.z-dock:has()` utility-keyed
  layout class killed → `[data-dock-tether]`, persisted-state boot migration, ~28 gates
  re-armed, CLAUDE.md counts re-derived (109 files / 1028 tests). **T.H** (`e0ce640`):
  `demo/glass-ui-gaps.ts` 9-entry registry + `proof:glass-ui-gap-tripwire` (single
  glassCaps source, lane-25-rec-2 clause), the 12-ask letter SHIPPED + PIN-LEDGER ask
  rows + 2 new caps (dockDismissHold/dockDropdownPointerdown), LabeledSelect consumed,
  H5/H6 terminal-on-publish tripwires; H3 Drawer rides T.B. **Merge composition:**
  package.json/TransportDock conflicts resolved as unions; merged-tree re-runs — tsc
  clean, 1026/1043 tests, build+gh-pages green, 15 gates green incl. all six mechanism
  gates, occlusion/mobile-single-page/live-session/scene-control-dfa green.
  **Adjudications:** (a) `computed-real-dom` red = worktree-glob contamination → batch
  + stale S worktrees removed, green; (b) `scene-transition-perf` red = machine-load
  noise — interleaved A/B vs base: merged 87.9/94.0 vs base 97.8/95.0 p95, PASS (the
  T.G CDP re-home motivation, recorded); (c) `visual-lock` was red AT BASE
  pixel-identically (environment drift since the S-era capture) → re-baselined per its
  own protocol AFTER correctness corroborators verified green, stale pruned-scene +
  square-open baselines deleted, and the residual nondeterministic cube open-stage POSE
  FLAP (the easeInBounce mount intro) declared into `T_BORNRED_BACKLOG` (discharge:
  T.A3 deterministic settle + T.M3 supersession); the roster runner now composes
  `T_BORNRED_BACKLOG` into its expected set; (d) T.E3↔T.M5 lockstep executed at merge:
  the SUBJECTS.json morph clause retired; (e) phi-leaf GestureLegend literal → φ-token
  idiom. **Posture: failing ⊆ backlog exactly** (backlog: stage-inventory,
  subject-legible, subject-full, roster-ceiling-count, visual-lock, drag-gesture→T.S2,
  ci-coverage version-literal→T.S1). glass-ui is mid-BG (dirty tree) — the letter
  dispatch rests on kf's shipped copy per the write-boundary; the BG session consumes.

- **2026-07-05 — BATCH ② HIT THE WALL; SALVAGE MERGED (T4/T5).** Fleet `wf_66940164-6e2`
  died on the session limit (reset 9:10am ET) with 1/3 lanes reporting. **Salvage
  (committed work only, drive lesson 4):** the amiga lane landed **T.A6** (`efcb244` —
  `compile/plain-vars.ts`: the plain-vars projection, BOTH consumer paths, zero-alloc
  held, 5/5 unit oracle + full library-gate re-verification) and deferred A7–A12 as one
  coupled rebuild with resume recipes; the T.S lane landed **T.A14** (MorphSVG
  attribute-first + writes-suppressed oracle), **T.S4** (DM-22 de-deferred — the
  resolution EXISTS at bindTimeline; comment retired), **T.S1-partial** (tier-check fix
  + the ci.yml stale-literal fix → `proof:ci-coverage` FULLY GREEN first time;
  chronic-closure 52→3 residuals), **T.S3** (KF-TO-VALUEJS-T.md letter + 2 born-RED
  tripwires registered in the backlog; pin still ^2.0.1 — the gated 3.0.0 evaluation
  is remainder), **T.S6** (deploy auto-path mechanism, firing gated on T.M); the cube
  lane died empty. **Merge composition:** ONE real cross-lane integration fault found
  by the merged-tree suite — MorphSVG's transform still unwrapped array-boxed
  ValueUnits under T.A6's plain-vars contract → aligned to plain numbers
  (fail-explicit kept); visual-lock un-ledgered from RETIREMENT_LEDGER (the
  either-retired-or-greened model clause — T.M3 owns the terminal call);
  chronic-closure registered in the backlog (discharge: rows 69→T.A13+T.B3,
  71→T.H5/T.F16, 72→ratify). Merged tree: tsc clean, 1035/1052 tests, builds green,
  ci-coverage/retirement-ledger/prompt-recap-t/board-live/pin-ledger/morph-renders-d/
  zero-alloc/boundary/amiga-browser-pair all green (decay-visible's batched-loop
  exit-1 was startup contention — isolation re-run PASS). **Remainder relaunched**
  (post-reset): cube T.A1–A5 (full) ∥ amiga A7–A12 (coupled rebuild) ∥ T.S remainder
  (S1 residual triage, S2 drag-gesture, S5 backfill, S7 row-4 transfer, S3 pin
  evaluation).

- **2026-07-05 — BATCH ②′ MERGED + VERIFIED (T4/T5).** Fleet `wf_da0354ca-c67`, 3/3.
  **T.A CUBE COMPLETE** (A1–A5): the `--spin-energy` 3D-flattener DELETED — all six
  faces render (proof:cube-silhouette browser-verified 6/6, `.cube` 225×225 honest);
  stage stripped per #5/#8 (readout/legend/tags/rainbow-corpse gone, cube
  gesture-manifest row re-cut); ONE settle language (ease-out-back, ≤1 overshoot,
  PRM-snap — the visual-lock pose-flap CAUSE removed; terminal re-baseline rides
  T.M3); re-light writes quantized (~2.6× dedup, honest deviation from the
  aspirational 5× documented in the gate); SUBJECTS.json cube leg verified.
  **T.A AMIGA COMPLETE** (A7–A12): rides the group compositor via ONE plain-vars
  pose adapter + ADDITIVE gesture offset (one mesh writer, no stomp); the Boing IS
  the scene (timers/egg/boot/flags deleted, SpringProgress re-seat stop,
  grep-zero setTimeout); honest arc (fit apparatus deleted, max|py|=3.998 ≥
  2.5·radius, linear tilted-axis spin); CRT/telemetry/legend dead + grid-room in
  (composition PENDING-OWNER); decay-visible KEYSTONE re-armed to the non-DOM ω
  probe in the same motion; render-on-demand at rest. SUBJECTS.json amiga leg
  verified → **proof:subject-full GREEN, backlog row DISCHARGED**. **T.S COMPLETE**:
  chronic rows 71/72 green (69 waits on square-honest v2, batch ③; honest count
  correction: ~30 missing-witness FOLD rows remain, each owned by its landing wave);
  **drag-gesture SEAM defect FIXED** (glass-ui useTouchGate swallowed mouse presses
  under Chromium's ontouchstart=true — mouse/pen now bypass; the residual is a
  dock-occlusion half riding T.C); S session log backfilled to terminus; OWNER-ASKS
  row 4 → terminal-by-transfer (the S.Z unblock); **THE VALUE.JS RE-PIN FIRED:
  ^3.1.0** (isolated-clone verified, then independently re-verified on the merged
  tree: check/tests/builds/boundary/zero-alloc/replay-equality/color-fidelity all
  green; `proof:no-nested-self-dependency` DISCHARGED — 3.1.0 fixed the phantom;
  KF-7 still unfixed → `no-collision-rename` stays the external born-RED).
  **Merge composition:** gesture-manifest resolved as the union of BOTH scene-row
  cuts (5 rows); APPEARANCE-WAVES union (3 PENDING-OWNER packets); two roster
  UNEXPECTED reds adjudicated — design-refinement's S3 amiga arm re-cut (its
  power-on egg was owner-ruled removed; lockstep executed at merge) + the
  OrbitControls change-listener allowlisted (THREE.EventDispatcher, not DOM).
  Roster: 83 gates, failing set = exactly the declared backlog.

- **2026-07-05 — BATCH ③ MERGED + VERIFIED (T4/T5).** Fleet `wf_7b5aaf03-e2b`, 3/3.
  **THE SQUARE JOINT MOTION LANDED (T.A13+T.B3 — VERDICT #12/#25 CLOSED):** the
  unit-honest num() normalizer (both writers — spring raw numbers + T.A6 plain
  strings; the "0pxpx" kill-class impossible), REAL diamond-tour keyframes (±90px/
  360°/nested-d swell), the {idle,drag,playback} FSM with jump-free DOMMatrix
  pose-capture takeover, tumble demoted to gesture-egg; the DFA square row
  []→triad; ALL FOUR collapse-locked gates INVERTED in one lockstep motion
  (square-honest v2 measured +95.9px displacement, browser-verified; cold-entry
  re-armed to the persistent-playhead path); chronic row 69 GREEN. **T.B4 landed**
  (pane deleted → naked rail; SQ-T3 mount-iff-content; composition PENDING-OWNER
  per OD-5 R1 — proof:panel-composition registered but NOT authored, correct T.M2
  discipline). **T.G1 landed born-RED-backlog with the drive's most consequential
  empirical finding:** NO pure-CSS kf-side blur decoupling exists (isolation/
  z-index/radius/geometry all measured neutral) — the live backdrop-filter
  re-samples the moving stage structurally (easing 26→66fps when neutralized);
  **glass-ui BG-5 (blur-source="static") is the ONLY cure and is now the
  highest-leverage constellation ask**; proof:blur-not-resampled rides the backlog
  until the BG-5 publish + re-pin. **Honest deferrals (protect-the-green-build):**
  T.B1/T.B2 (the SceneFacility keystone rip — ~20 files) + T.A15 (autoplay + the
  fleet driver re-derivation) + T.H3 (Drawer swap) → batch ④ as DEDICATED lanes.
  **Merge composition:** SquareScene template/CSS split (the ACG idiom, 340+159);
  mobile-single-page's sequence expectation re-derived (SQ-T3: surfaces-empty →
  NO sheet — the zero-content grab handle was the defect; T.B2 flips it back).
  Roster 84 gates → failing ⊆ backlog exactly.

- **2026-07-05 — BATCH ④: RECON, NOT CODE (honest no-op; the deliverables are maps).**
  Fleet `wf_a3ff09d5-d1b`: the keystone lane found T.B1's decoy-deletion INTERLOCKED
  with T.B7's easing/spring channel-RENDERING (ControlsPaneWrapper v-for over
  group.animations :61; PlaybackRibbon bound to contractAnim as its time-source) +
  the whole ACG transport (useAnimationGroupPlayback is group-based) — a 30–40-file
  motion, not one lane; it produced the VERIFIED COUPLING MAP + a 4-stage split and
  changed nothing (clause-10 protect-the-green). The Drawer lane found a glass-ui
  STRUCTURAL capability gap: a detented Drawer is forced height:100%/bottom:0
  (drawer.css [data-glass-drawer-snap-points=true]) — its full detent covers the
  viewport + overlaps the menubar band at ANY snap, no blessed inset/max-detent
  lever exists; adopting as-is would REGRESS the owner-verified occlusion cure
  (52dvh stage-reserve / ≤70dvh / never-occlude-menubar). The theme lane died on the
  session limit before starting. **BATCH ④′ RE-DEPLOYED (owner order, post-reset,
  `wf_b977ef4e-a08`):** T.B1-α facility stage-1 (descriptor + group scenes +
  sequence + the ACG seam per the coupling map; the easing/spring decoy-zero clause
  born-RED → the T.B1-β/T.B7 joint motion, batch ⑤) ∥ T.D theme core (Fable,
  P-THEME graft — relaunched verbatim) ∥ T.H3→GATED-ON-PUBLISH (new ask **BG-11**:
  --drawer-inset-block-end + max-detent cap; ledger row + tripwire; the geometry
  decision recorded PENDING-OWNER, hold-the-cure recommended) + T.C5 (GU-1/GU-2
  born-RED acceptance gates) + T.B10 (the ordered transport-action model).

- **2026-07-05 — BATCH ④′ MERGED + VERIFIED (T4/T5) @ `5ef73cf`.** Fleet
  `wf_b977ef4e-a08`, 3/3. **T.B1-α LANDED**: the additive SceneFacility descriptor;
  cube/amiga/square expose facility from REAL group members; SEQUENCE OFF THE DECOY
  (its useContractAnimGroup call site deleted; transport rides facility.playback,
  live-session S5 verified); the shell binding prefers facility; transport labels
  derive from channels. proof:scene-facility EXITS 1 BY DESIGN (a registered
  born-RED backlog row): its decoy-zero clause reds on the two remaining
  easing/spring call sites, dischargedBy the batch-⑤ T.B1-β/T.B7 joint motion —
  the descriptor/group-scene/sequence clauses pass within that red run. **T.D CORE LANDED (Fable, OD-6 packet FILLED with "Good.")**: T.D7 the
  red-kill + ONE violet oklch authority (--accent-kf light-dark ramp grafted from
  P-THEME; new BLOCKING OWNER oracle proof:accent-census — ~2,230 rendered
  paints/theme, zero red outside destructive); T.D2 honest weight
  (font-synthesis:none + BG-6 @layer); T.D3 Jakarta body (system-stack pin +
  .dock-label serif force DELETED); T.D4 mono→data; T.D1 the style-TUPLE census
  REWRITTEN over the committed font-roles.json manifest; the arming-audit re-cut
  suffusion/ribbon/crayon probes; visual-lock re-captured on-theme. **T.H3 →
  GATED-ON-PUBLISH**: BG-11 authored (drawer bottom-reserve + max-detent cap,
  dist-css evidence) + drawerDetentInset cap/tripwire; the geometry decision
  PENDING-OWNER (hold-the-cure recommended). **T.C5 LANDED born-RED MEASURED**
  (dock-rest-crisp blur(3px) + morph-continuity jump-cut, OWNER+blocking-not-
  OBSERVE, dischargedBy GU-1/GU-2 publish). **T.B10 LANDED** (actions model GREEN;
  the play-first RENDER clause born-RED dischargedBy T.C1). Merge: ci-coverage +
  gate-authority unions; 1037 tests; the batch-⑤ running order = T.B1-β/B7/B2/B5-model
  ∥ T.D hero (Fable, P-HERO) ∥ T.C dock recut (consumes the B5 contract + B10).

- **2026-07-05 — BATCH ⑤ MERGED + VERIFIED (T4/T5).** Fleet `wf_08a80d91-4c1` (one
  full-fleet API-outage relaunch mid-batch; recovered via scriptPath+resume). **THE
  HERO REBORN (Fable; OD-4/OD-2 packets FILLED):** T.D9 φ-band seat + the
  hero-rung/-balance/-cls FROZEN locks RETIRED via machine-witnessed MIGRATION
  discharges into the new OWNER oracle proof:hero-two-focal (GREEN);
  appearance-suffusion clause (c) INVERTED; T.D10 per-CHAR two-tier uplift with the
  sr-only mirror (demo-usability clause 2 re-armed GREEN); T.D11 serif-italic deck;
  T.D12 typing-card EXCISED (design-refinement S1 arm re-cut); T.D13 Aurora-on-hero
  MORE SUBTLE (public @mkbabb/glass-ui/aurora, ceiling below 0.15 encoded); T.D14
  proof:no-hand-rolled-cursor-tracker recurrence guard; + the ②′-merge INDEX.json
  conflict-marker debris cured. **THE DOCK RECUT LANDED:** T.C1 both docks on the
  glass-ui grammar (zone-derived separators, play FIRST — transport-play-first-render
  DISCHARGED); T.B5-RENDER single-option elision (the "Spring│Spring" dup DEAD;
  static labels deleted; no-single-option-select RE-CHARTERED single⇒NOTHING); T.C2
  home=compass-only + Clear-all into MbabbMenu; T.C3 ONE tooltip authority; T.C4
  verified-discharged (T.D3 had killed the serif flip); T.C7 three dock oracles
  wired. **T.B5-MODEL landed on the DFA** (dockCardinality + the cross-axis clause,
  16/16 tests). **Merge composition:** the flagged dockZones.ts stand-in DELETED —
  both docks + proof:no-single-option-select repointed onto the DFA projection (ONE
  count authority, the lane-18 dual-formula rule); hygiene-chain unioned. 1042
  tests; dock/hero/theme oracles all green. **The facility joint motion
  (B1-β/B2/B7/E7) deferred a SECOND time** by protect-the-green lanes — batch ⑥
  gives it a dedicated max-effort Fable lane with the staged recipe; alongside: the
  T.F LIBRARY half (src-only, collision-free) ∥ the P-GALLERY prototype (OD-7's
  vehicle, kept worktree, never merges).

- **2026-07-06 — BATCH ⑥ MERGED (2/3) + THE WALL AGAIN; ⑥′ RE-DEPLOYED (owner
  order).** Fleet `wf_558e7859-5ca`. **T.F22 LANDED (the edict's library half):**
  proof:zone-cohesion (per-zone internal cohesion, 400L concern threshold below the
  500L hard ceiling, justified-single-concern declarations machine-checked; the §4
  ring-fence machine-verified) + 3 genuine intra-zone carves (backward/format →
  format-options; scroll/scene → dispatch; svg/morph-svg → morph-geometry — all
  pure, public surface byte-identical, 3 path-anchored gates rewired) + 11 honest
  single-concern justifications; library gate set green; the lane's 2 flagged
  "pre-existing reds" adjudicated at merge as DIST-ORDERING ARTIFACTS
  (published-surface + claude-paths-live both exit 0 after the build+gh-pages
  sequence). **P-GALLERY LANDED-PENDING-OWNER (the OD-7 vehicle):** kept worktree
  `worktree-wf_558e7859-5ca-3` @ `8414cb5` — 33 specimen tiles on ONE shared clock
  over the surviving registerDotPainter seam, native to the landed OD-6 theme;
  singular hero deleted in-prototype; 8 captures + PROTO-NOTES under
  audit/prototypes/P-GALLERY/; proof:easing-gallery correctly UNAUTHORED (T.M2).
  **NEVER purge `wf_558e7859-5ca-3` — it joins the three blessed prototypes in the
  protected set.** The FACILITY joint-motion lane hit the session wall with ZERO
  commits (max-effort recon burned the window) — ⑥′ relaunches it (Fable, HIGH
  effort, HARD per-stage commit mandate) ∥ T.G6 (the perf-oracle re-home,
  scripts-only) ∥ T.F23-gates (no-dead-export + any-ceiling ratchet at honest
  current thresholds + the glass-ui-usage census; the demo sweeps ride the
  facility-settled batch).

## State of play — the T impl-drive entry anchor (2026-07-05, written at compaction-prep)

**AUTHORIZATION: the owner's row-3 ask lifts the row-2 hold — execution begins immediately
post-compaction.** Everything needed to open the drive without re-derivation:

1. **Branch + phase 0**: create `tranche-t-impl` off `tranche-s-impl` (tip `701fb47`+);
   flip this board's bands to IN-DRIVE as they open; draft PR onto master (the CI carrier,
   the S pattern). The S board is closed history; S.Z rides T.S.
2. **The DAG (T.md §2)**: T.M (mechanism, FIRST — its born-OWNER instruments gate every
   wave-close) ∥ T.E (prune early — compose + morph + motion-path DELETE per OD-1 PRUNE
   FINAL; removals with lockstep gate-rewires) ∥ T.H (dispatch KF-TO-GLASSUI-BG.md to the
   glass-ui session; land the kf acceptance gates born-RED now). Then T.A → T.B → T.C ∥
   T.D; T.F after E+B settle the survivor set; T.G measures the final surface; T.S
   parallel throughout (it unblocks S.Z = tasks #292/#297); T.Z last.
3. **Orchestration (T.md §5)**: Fable = orchestration/design/synthesis; Opus/Sonnet =
   fan-out; batches of 3 worktree agents; EVERY batch prompt carries merge-tranche-t-impl-
   first + the arming-audit clause + path-anchored-gate greps + the SFC+sibling-.css rule;
   the orchestrator independently re-runs every claimed gate (T4/T5), merges, boards,
   pushes per batch. Wall recovery: committed salvage → merge → edit the persisted script
   → relaunch scriptPath+resumeFromRunId. Guard cron a202e1af (2-hourly at :23) is armed
   with exactly this recipe.
4. **The blessed references (born-OWNER baselines)**: kept worktrees
   `worktree-wf_1e744f4d-2bb-1` (P-HERO — aurora at 0.15 = the CEILING; OD-2 demands MORE
   SUBTLE), `-2` (P-PANEL — OD-5 riders: the controls composition REWORK + the top-left
   curve preview improved DRAMATICALLY, both born-OWNER mid-drive re-reviews), `-3`
   (P-THEME — approved as-is). Waves may graft prototype code but land production-grade
   with gates + lockstep. NEVER purge these three worktrees in wall-recovery cleanup.
5. **Environment**: dev servers :5180 (baseline) / :5181/:5182/:5183 (prototypes) were
   live at compaction — respawn on demand post-compaction (`npx vite --port NNNN
   --strictPort`, prototype ports cd into their worktree first). KF_PLAYWRIGHT_DIR=
   /Users/mkbabb/Programming/glass-ui for all browser gates. Build: `npm run build &&
   npm run gh-pages`. Test-count clause: re-derive, never trust a frozen number.
6. **Binding tokens**: OWNER-DECISIONS.md — OD-1 PRUNE FINAL · OD-2 AURORA MORE-SUBTLE ·
   OD-3 KEEP ppmycota · OD-4 APPROVED · OD-5 APPROVED+2 riders · OD-6 APPROVED. The GRAND
   COLOCATION EDICT (OWNER-ASKS row 1) = T.F's 23 waves. OWNER-ASKS rows 1-3 all
   dispositioned; `proof:prompt-recap-t` teeth arm in T.M.
