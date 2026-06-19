# Tranche O — the 32-lane constellation re-audit (DIGEST)

> Source: the `kf-tranche-O-deep-audit` workflow (32 Sonnet agents, batches of 3, ~4M tokens, 2026-06-19).
> Full raw findings preserved in the workflow transcript. This digest is the on-disk evidence + the authoring reference.
> Severity counts: 15 BLOCKER · 97 HIGH · 123 MED · 71 LOW · 65 INFO. Kinds: 123 gap · 82 deferred · 37 workaround · 19 chronic · 16 legacy · 15 transposition · 11 risk · 9 verify · 59 strength.

## A1-bc-charter

BC is a 96-wave architectural-rebuild tranche for glass-ui, currently IN EXECUTION on branch `tranche/BC` (head `c93d0b88`). The charter is thorough, forensically grounded, and structurally sound: it correctly diagnoses the BB disease (single-terminal-reflect deferral + paint-blind gates + chronic patching), mandates per-wave paint verification via pixel-readback, and sequences bands in a proven-acyclic 29-tier DAG. EXECUTION GREENLIT 2026-06-19. As of the audit (also 2026-06-19), roughly 60% of tiers are DONE (Bands F/0/14/1/7/12/2/3 — the glass floor, dock, tabs, motion, customizability) and ~40% remain pending (Bands 13/4/6/5/9/11/10 — including all viz, controls, pages, perf, and the cut). The CUT version is explicitly USER-DOMAIN (not frozen); the peer range `@mkbabb/value.js "^0.13.0 || ^1.0.0"` + `@mkbabb/keyframes.js "^4.0.0"` is already live on 4.0.1. The kf-BC coordination contract (KF-INBOUND/KF-BC) is fully resolved: all 5 ASKs answered, the dock crossfade (`useDockClickIntegrity`) and aria-orientation are confirmed shipped, GlassControlPoint=NO is decided. kf M.W8 Phase-2, M.W-DESIGN-PAINT, M.W15, M.WZ remain BC-gated and cannot close until the BC cut publishes. The AX Band-15 absorption (7 waves) and fourier/kf Band-16 (3 waves) are incorporated into the 96-wave roster.

**Critical findings:**

- **[HIGH·deferred]** kf M.W8 Phase-2, M.W-DESIGN-PAINT, M.W15, M.WZ are BC-gated — cannot close until BC publishes
  - _ev:_ KF-TO-GLASSUI-BC.md:57-67 — 'M.W8 Phase-2 — the aria/RF-17 workaround deletions (ASK-1/ASK-2). M.W-DESIGN-PAINT — the born-RED pixel-readback visual-truth gate. M.W15 — demo-perf. M.WZ — the M close.' PROGRESS.md M.W8 ro
  - _→_ handoff · fold: BC.W-CUT (the unblock event); kf tranche-O owns the consuming waves
- **[HIGH·deferred]** Band 4 (WebGPU viz), Band 6 (controls), Band 5 (pages), Band 9 (storybook), Band 11 (perf) all pending — the cut is still far from executable
  - _ev:_ EXECUTION-PROGRESS.md:40-46 — Tiers 14-17 (viz), 18 (controls), 19-22.7 (pages), 23 (configurator suite), 24 (storybook), 25 (perf), 26 (deck), 27 (cut) all 'pending'. The cut gates on ALL bands' proof:ba-gestalt GREEN
  - _→_ fold-into-wave · fold: BC.W-CUT (terminal, user-gated — all pending tiers must complete first)

**Recommendations:**

- kf tranche-O must plan to unblock its 4 BC-gated waves (M.W8 Phase-2, M.W-DESIGN-PAINT, M.W15, M.WZ) immediately after the BC cut publishes — these are the constellation's remaining downstream coordination and the M close cannot execute without them.
- The BC CUT version is USER-DOMAIN (not frozen at 4.1.0) — kf tranche-O should NOT hard-pin a glass-ui version in its planning docs until the cut is announced; use '~<BC>.x' as the placeholder per M-RECONCILIATION §1.
- The Oscillator republish (INFORM-1) is the prerequisite for BC.W-VIZ-CHOREOGRAPHY and BC.W-TUNABLE-ANIM's full book-to-build path — kf tranche-O must ship Oscillator as a LIGHT export before those BC waves can fully close their booked seam.
- Band 13 (SCROLL-TRIGGER/SCROLL-CHROME/DOCK-SEARCH) is pending — the dock-as-search morph is a dependency of kf ASK-3 and the N Stage DM-24 tripwire; monitor for this tier landing to unshelf the N Stage impl on n-stage-impl.
- The value.js /color subpath footprint-shrink consume is booked at BC.W-PERF-PRODUCER/BC.W-CUT with a named trigger (value.js O 0.14.x+ /color subpath ships); kf tranche-O should coordinate the timing so the glass-ui consume lands in the same cycle as the value.js O publish.
- Confirm CLOSE-RUNBOOK.md is authored in tranche-dev before the CUT wave executes — it is listed as a BC.W-CUT tranche-dev deliverable but was not visible on disk during this audit.

---

## A2-bc-kf-seam

The BC<->kf seam is partially coherent but has three material gaps. ASK#2 (aria-orientation S1) has a MISLEADING "CONFIRMED" in KF-BC.md: the glass-ui BC HEAD at SegmentedTabs.vue:406 STILL emits aria-orientation unconditionally regardless of role (on role=group the ARIA 1.2 spec does not list aria-orientation as a supported state), and BC.W-TABS-IOS T4 explicitly byte-fences SegmentedTabs.vue as unchanged (CSS-only wave) — meaning no BC wave will fix the conditional. ASK#3 (the "scene-select dock affordance" for DM-24 N Stage unshelf) was silently DROPPED from KF-INBOUND.md — no BC wave delivers the scene-select affordance the DM-24 tripwire requires. The proof:workaround-deletion gate's 4.1.0 version check for S2 (dock) is stale: 4.0.1 already ships useDockClickIntegrity in dock.js (confirmed live), so S2 could be deleted now but the gate still blocks on 4.1.0. A documentation transposition error exists in M.W-DESIGN-PAINT which cites "DM-21" for the N Stage unshelf condition, but DM-21 is the @property/compileToCSS fix; the correct number per M-RECONCILIATION §7 is DM-24.

**Critical findings:**

- **[BLOCKER·gap]** ASK#2 aria-orientation S1: KF-BC.md 'CONFIRMED' is factually misleading — no BC wave fixes the conditional
  - _ev:_ glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406 emits `:aria-orientation="isVertical ? 'vertical' : 'horizontal'"` unconditionally — NOT conditioned on `isUnderline`. When variant="pill" → role=group, aria-orie
  - _→_ verify · fold: O.W-CONSUME-BC-SEAM
- **[HIGH·workaround]** proof:workaround-deletion S2 (dock) checks glass-ui@4.1.0 but useDockClickIntegrity already ships in 4.0.1
  - _ev:_ scripts/proof-workaround-deletion.mjs:228 hard-codes `sibling: { pkg: '@mkbabb/glass-ui', version: '4.1.0', name: 'BB W-DOCK-MORPH-FAMILY click-strand cure' }` for S2. But node_modules/@mkbabb/glass-ui/dist/dock.js:534 c
  - _→_ fold-into-wave · fold: O.W-CONSUME-BC-SEAM
- **[HIGH·gap]** ASK-3 (scene-select dock affordance for DM-24 N Stage unshelf) silently dropped from KF-INBOUND.md
  - _ev:_ KF-TO-GLASSUI-BC.md:46 asks for 'the dock base that hosts a scene-select affordance with a morph family (W-DOCK-MORPH-FAMILY)' as the DM-24 N Stage unshelf tripwire. KF-INBOUND.md's ask table (#1-#5) contains NO correspo
  - _→_ ask-sibling · fold: O.W-CONSUME-BC-SEAM

**Recommendations:**

- Resolve the ARIA spec disagreement before kf O deletes S1: verify ARIA 1.2 §6.3 'Inherited and Prohibited Properties' for role=group. If BC's interpretation (axis-derived aria-orientation acceptable on role=group) is agreed, delete both kf suppression sites immediately in O.W-CONSUME-BC-SEAM without waiting for a glass-ui fix. If kf's ARIA 1.2 reading is correct, BC must add a conditional guard ':aria-orientation="isUnderline ? (isVertical ? vertical : horizontal) : undefined"' in SegmentedTabs.vue — this requires a BC wave edit (not byte-fenced by BC.W-TABS-IOS T4).
- Update proof:workaround-deletion.mjs S2 arm (line 228) to check glass-ui@4.0.1 (or the currently-installed version) instead of the stale 4.1.0 reference. The useDockClickIntegrity composable is live in 4.0.1 dist. Alternatively, change the check from a version sentinel to a content-present check on the installed dist (grep for 'useDockClickIntegrity' in node_modules/@mkbabb/glass-ui/dist/dock.js).
- Explicitly map or KILL the scene-select dock affordance ask (KF-TO-GLASSUI-BC.md ASK-3) in a named BC wave, or update DM-24's tripwire in kf's docs to reflect what BC actually delivers (BC.W-DOCK-ENGINE buttery morph, not a scene-select affordance). If the N Stage unshelf genuinely requires a dedicated scene-select affordance in the dock, file an explicit cross-repo ask to BC and confirm whether BC.W-LIQUID-MORPH or a successor wave will deliver it.
- Fix the DM-21 transposition in M.W-DESIGN-PAINT.md at lines 189 and 279: replace 'DM-21 HANDOFF fires' with 'DM-24 HANDOFF fires' to match the M-RECONCILIATION.md §7 numbering.
- Add an explicit kf Tranche O wave for the Oscillator republish (the by-name cross-repo republish ask): assign a version bump target (e.g., 4.4.0 or 5.0.0) and record which BC waves (BC.W-VIZ-CHOREOGRAPHY, BC.W-MOTION-ONE-CLOCK, BC.W-TUNABLE-ANIM) are waiting on it, so the dependency chain is visible and P-invariant-28 can be satisfied.
- Author a named 'M.W8-Phase-2' or 'O.W-CONSUME-BC-SEAM' wave document that formally lists the kf-side actions on the BC cut: re-pin glass-ui ~<BC>.x, delete S1/S2 workarounds, confirm M.W-DESIGN-PAINT S4 baseline lock, update M.W15 lighthouse floors. Currently 'Phase-2' is only referenced informally across three wave docs with no owning wave file.

---

## A3-bc-dock

The BC dock redesign is in active execution on `tranche/BC` (head `c93d0b88`): Bands F, 0, 1, 2, 3, 7, 12, and 14 are all DONE per EXECUTION-PROGRESS.md. Critically, BC.W-DOCK-ENGINE and the full Band-2 fleet (DOCK-ARBITRARY, DOCK-SHRINK-BLUR, DOCK-VERTICAL-FIX, DOCK-COLLAPSED-BOTH, DOCK-STACK-RAIL, LIQUID-MORPH) are paint-verified as of commit `0aa16913`. The `useDockClickIntegrity` composable ships at glass-ui HEAD and is wired in GlassDock.vue:28,266. However, the BC cut (`BC.W-CUT`, tier 27) is still pending — glass-ui is pinned at published `4.0.1` with no `4.1.0` on npm. This means all three kf-side BC-gated actions (S2 `onPlayPointerDown`/`pointerHandled` delete, S1 `aria-orientation` suppress deletes, M.W8 Phase-2) remain PENDING, and the N Stage DM-24 unshelf tripwire is NOT yet fired. The DM-24 ledger row is documented in M-RECONCILIATION.md §7 but was NOT added to `deferred-ledger-M.md` or `PROGRESS.md §"Open deferrals"` — a doc-hygiene gap. The kf dispatch (KF-TO-GLASSUI-BC.md ASK-3) identifies W-DOCK-MORPH-FAMILY as the N Stage trigger, but the BC wave ecosystem uses the name `BC.W-DOCK-ENGINE` / the Band-2 family — the old BB name `W-DOCK-MORPH-FAMILY` was the contradicted/re-opened predecessor. The trigger condition is architecturally sound but the dock source code reveals a genuine residual: `useDockClickIntegrity` guards identity-changed clicks but does NOT prevent the crossfade-strand case kf's `TransportDock.vue` comment proves is still live (the K.W1 K.W0 re-observed S2 comment at line 313 says the integrity composable `did NOT subsume this twin`).

**Critical findings:**

- **[HIGH·gap]** BC cut still pending — glass-ui 4.1.0 not published, all kf BC-gated actions blocked
  - _ev:_ npm view @mkbabb/glass-ui versions shows [4.0.0, 4.0.1] only. proof-workaround-deletion.mjs output: 'S1=PENDING S2=PENDING … @mkbabb/glass-ui@4.1.0 is NOT YET published (E404)'. BC EXECUTION-PROGRESS.md tier 27 (CUT) = '
  - _→_ handoff · fold: BC.W-CUT → kf M.W8 Phase-2 consume
- **[HIGH·workaround]** useDockClickIntegrity does NOT cure the crossfade-strand case — S2 interim correctly retained
  - _ev:_ TransportDock.vue:313-338 — 'K.W1 RF-17 RE-OBSERVED + RETAINED. K.W1 net-DELETED this pointerdown twin on the premise that glass-ui 3.13.0's useDockClickIntegrity… subsumed it. It does NOT: with the twin removed… proof:l
  - _→_ verify · fold: BC.W-CUT → M.W8 Phase-2 S2 consume. kf must reverify that the BC-cut dock (buttery engine + DOCK-VERTICAL-FIX) eliminate
- **[HIGH·chronic]** DM-1 RF-17 chronicity violation if BC cut does not ship in Tranche O — P-invariant-28 at 4-tranche
  - _ev:_ deferred-ledger-M.md DM-1:131 — 'P-inv-28 (4-tranche): no-workaround forbids a 5th carry; MUST consume or KILL at M'. proof-workaround-deletion.mjs: S2 PENDING. The BC cut is NOT shipped (4.0.1 is the latest). If BC cut 
  - _→_ handoff · fold: BC.W-CUT (user-gated) is the unblocking action; if delayed past M.WZ, the P-inv-28 terminal must be re-negotiated with t

**Recommendations:**

- Execute the M-RECONCILIATION §7 doc actions: add the DM-24 N Stage HANDOFF row to docs/tranches/M/audit/deferred-ledger-M.md and docs/tranches/M/PROGRESS.md §Open deferrals §D before M.WZ closes, as specified but not executed.
- Update DM-24 and KF-TO-GLASSUI-BC.md ASK-3 to retire the stale BB wave name 'W-DOCK-MORPH-FAMILY' as the unshelf trigger and replace it with 'glass-ui BC cut published (≥4.1.0, BC Band-2 DONE)' — the current tripwire names a wave that was contradicted and rebuilt under different BC wave names.
- After BC.W-CUT publishes, run proof:live-session S5 (motion-path PLAY) explicitly BEFORE deleting the S2 `onPlayPointerDown`/`pointerHandled` interim, to verify that the buttery BC dock (IS-LEAVING pointer-events fix + DOCK-VERTICAL-FIX clickability) actually eliminates the crossfade-strand root, not just the identity-changed click case.
- Clarify in the N Stage DM-24 ledger row and Tranche O planning docs that the scene-select affordance is kf-owned (kf's ChromeDock composition), NOT a glass-ui BC API surface — BC ships the stable dock morph substrate; kf builds the scene-select atop it. No BC wave authors a scene-select slot.
- Add DM-1 P-invariant-28 terminal status to the Tranche O open risks: if BC.W-CUT does not publish before kf M.WZ closes, the 4-tranche DM-1 RF-17 cannot carry to a 5th tranche under the precept; the owner must either greenlight BC.W-CUT or issue a reasoned KILL with an observable-truth rationale for why the interim is acceptable permanently.

---

## A4-bc-aria-ax

The S1 aria-orientation workaround in kf is correctly staged PENDING (glass-ui@4.1.0 unpublished), but the BC coordination document (KF-BC.md ASK#2) misidentifies what "fix" is needed: it declares "CONFIRMED — emitting a real axis-derived value" as the fix, when the actual ARIA spec defect is that aria-orientation is DISALLOWED on role=group entirely (WAI-ARIA valid only for scrollbar/separator/slider/tablist/toolbar/treeitem). BC HEAD c93d0b88 still emits :aria-orientation unconditionally at SegmentedTabs.vue:406 on both role=tablist and role=group, so the S1 suppress in kf remains necessary after BC cuts. No gate in glass-ui or kf asserts this constraint. Meanwhile S2/RF-17 is correctly diagnosed: useDockClickIntegrity ships in BC HEAD and will make the kf TransportDock workaround deletable on publish. A secondary kf-side gap exists: AnimationControls.vue uses role=tabpanel on panel divs while the owning strip is role=group, violating ARIA ownership (tabpanel must be owned by tablist). The AX speedtest Band 15 absorption contains no kf-relevant a11y obligations beyond S1/S2 deletion and re-verify at cut.

**Critical findings:**

- **[BLOCKER·gap]** S1 aria-orientation fix misidentified in BC KF-BC.md — SegmentedTabs still emits disallowed attr on role=group
  - _ev:_ glass-ui/src/components/custom/tabs/SegmentedTabs.vue:406 — ':aria-orientation="isVertical ? 'vertical' : 'horizontal'"' emitted unconditionally, including when :role='"group"' (pill variant, line 405). BC KF-BC.md:37-43
  - _→_ ask-sibling · fold: sibling-dispatch: glass-ui BC must author an aria-orientation guard in SegmentedTabs.vue — ':aria-orientation' should be
- **[HIGH·gap]** No gate in glass-ui or kf asserts aria-orientation is absent on role=group
  - _ev:_ glass-ui/scripts/proof-tabs-ios.mjs T4 (lines 200-208) checks aria-pressed, aria-selected, rovingTabindex, onStripKeydown — NO clause asserts aria-orientation is absent when role=group. glass-ui/tests/components/custom/t
  - _→_ fold-into-wave · fold: sibling-dispatch: glass-ui BC.W-TABS-IOS (or a new BC.W-A11Y-ORIENTATION-GUARD wave) must author a born-RED gate clause 
- **[HIGH·deferred]** S1 + S2 workarounds PENDING — both present in kf source, glass-ui@4.1.0 unpublished
  - _ev:_ proof:workaround-deletion output (2026-06-19): 'S1 PENDING — PRESENT + sibling UNPUBLISHED … @mkbabb/glass-ui@4.1.0 is NOT YET published (E404)'. S1 hits: AnimationControls.vue:72 + SpringSidebar.vue:43. S2 hits: Transpo
  - _→_ handoff · fold: kf Tranche O M.W8-Phase2: fires on glass-ui BC publish (≥4.1.0) — delete S1 lines (SpringSidebar.vue:43 + AnimationContr
- **[HIGH·gap]** AnimationControls.vue uses role=tabpanel with a role=group owner — ARIA ownership violation
  - _ev:_ demo/@/components/custom/animation-controls/controls/AnimationControls.vue:90 — 'role="tabpanel"'; :121 — 'role="tabpanel"'; :141 — 'role="tabpanel"'. The owning strip at :66-73 is SegmentedTabs variant=pill which render
  - _→_ fold-into-wave · fold: kf Tranche O: fix by either (a) switching the AnimationControls strip to variant=underline (role=tablist + aria-selected
- **[HIGH·workaround]** BC.W-TABS-IOS T4 byte-fence locks SFC unchanged — the aria-orientation guard cannot land in BC Band 3
  - _ev:_ BC.W-TABS-IOS.md:69 — 'T4 — the engine + the ARIA contract are byte-untouched … SegmentedTabs.vue is likewise byte-untouched (this is a CSS-only material wave)'. BC.W-TABS-IOS is a CSS-only wave; its T4 acceptance criter
  - _→_ ask-sibling · fold: sibling-dispatch: glass-ui BC needs a net-new SFC wave (e.g. BC.W-ARIA-ORIENTATION-GUARD or fold into BC.W-AFFORDANCE-MA

**Recommendations:**

- Dispatch a glass-ui BC sibling ask (ASK#2 correction): the aria-orientation fix is NOT a CSS-only change — it requires SegmentedTabs.vue:406 to be conditional on !isUnderline (i.e., ':aria-orientation="isUnderline ? (isVertical ? "vertical" : "horizontal") : undefined"'). A new SFC wave must be authored in BC alongside or after BC.W-TABS-IOS (T4 byte-fence forbids it in Band 3). Without this, the kf S1 suppress lines are still correct and must NOT be deleted on BC cut.
- Add a born-RED glass-ui gate clause (in proof:tabs-ios T4 or a dedicated proof:aria-group-orientation) asserting that the rendered pill strip (role=group) does NOT carry aria-orientation — a computed-attr check on the mounted SegmentedTabs with variant=pill must return null/undefined for aria-orientation.
- Fix the kf AnimationControls.vue role=tabpanel / role=group ownership violation in Tranche O: either (a) switch the AnimationControls SegmentedTabs to variant=underline to get a proper role=tablist owner, or (b) replace role=tabpanel with role=region + aria-label on the panel divs. Author a born-RED gate clause.
- Add aria-labelledby to each role=tabpanel div in AnimationControls.vue referencing the controlling button element's id, matching the WAI-ARIA required labeling for tabpanel (which reka's TabsContent provided automatically but the manual divs do not).
- Update proof:workaround-deletion S1 scope documentation to explicitly cite BOTH suppress locations (SpringSidebar.vue:43 AND AnimationControls.vue:72) — the KF-BC.md claim 'kf finds only :43 live now' is factually wrong and risks incomplete deletion at Phase-2.
- In Tranche O M.W8-Phase2 spec, gate S1 GREEN on the glass-ui aria-orientation SFC fix landing in a published version — NOT merely on BC cut version number. The current tripwire '@mkbabb/glass-ui@4.1.0' is necessary but not sufficient if BC ships 4.1.0 without the SFC fix.

---

## A5-bc-deferral-control

BC's DEFERRAL-LEDGER.md is thorough and principled: 213 items across AX–BB + cross-cutting clusters, every row DECIDED to {BUILD, RETIRE, MET, HELD-with-rationale, SUPERSEDED}. The three control-focused waves (BC.W-CONTROL-CUSTOM Band 12, BC.W-CONTROL-SMOOTH Band 6, BC.W-TUNABLE-ANIM Band 7) are fully specced with born-RED gates, gestalt criteria, and boundary-law enforcement. The GlassControlPoint=NO decision is correctly grounded — zero grep hits in the published glass-ui dist, ≥2-consumer bar unmet — and kf's DM-2 terminal obligation (build-in Option B, DemoControlPoint) is documented. However, the audit reveals three material gaps: (1) The Oscillator is confirmed LOCAL-ONLY in kf — absent from the published 4.3.0 dist installed in glass-ui's node_modules (0 Oscillator hits in the installed dist vs 17 in the local dist/keyframes.d.ts, git-verified added at L.W9 commit 791b3bd which is not an ancestor of v4.3.0). The picker-loop seam comment in useEasingPicker.ts is a BOOKED interim — the EasingPicker loop playback is blocked until kf republishes, and there is no kf O plan yet for this republish. (2) kf M.W14 (DemoControlPoint build-in, the 7-tranche P-invariant-28 terminal) was DEVELOPED (planned) but NOT IMPLEMENTED: proof:control-point-live still exists on disk unchanged, proof:demo-control-point was never authored, and no DemoControlPoint.vue exists anywhere in kf's demo tree. The M tranche closed with only M.W1 + M.W9/W10 gates + consume-edge commits implemented out of 16 planned waves. (3) The S8 (FN_NAME Symbol workaround for VJ-L1 flatLeaf) and S9 (direct parse-that dep for VJ-L3 parseCSSSubValue) workarounds remain live in kf's utils.ts:45, :1 because value.js 1.0.2 did NOT ship VJ-L1/L3 — these are correctly deferred to a future value.js version but their terminal home in Tranche O is unplanned.

**Critical findings:**

- **[HIGH·gap]** Oscillator republish gap: LOCAL-ONLY in kf, ABSENT from published 4.3.0 dist — blocks EasingPicker loop seam
  - _ev:_ /Users/mkbabb/Programming/glass-ui/node_modules/@mkbabb/keyframes.js/dist/keyframes.d.ts: 0 Oscillator hits (installed 4.3.0); /Users/mkbabb/Programming/keyframes.js/dist/keyframes.d.ts: 17 hits (local); git log v4.3.0..
  - _→_ handoff · fold: kf Tranche O must republish Oscillator (+ Draggable snap/bounds/rubberBand) — a cheap by-name ask, no glass-ui peer-spin
- **[HIGH·gap]** DemoControlPoint (DM-2, 7-tranche P-inv-28 terminal) was NOT implemented in kf M
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/scripts/proof-control-point-live.mjs: STILL EXISTS (expected to be retired at M.W14); no proof:demo-control-point.mjs exists ('proof:demo-control-point NOT authored'); no DemoContro
  - _→_ handoff · fold: kf Tranche O must implement M.W14 (DemoControlPoint build-in over LIGHT drag2D + retire proof:control-point-live + autho

**Recommendations:**

- kf Tranche O must open with an explicit Oscillator + Draggable snap/rubberBand republish wave (a cheap tag-bump past 4.3.0). This is the prerequisite for: (a) BC.W-TUNABLE-ANIM steppedEase loop playback, (b) BC.W-VIZ-CHOREOGRAPHY §F four-beat clock, (c) useDragMorph.ts commitSnapOnRelease consume-and-delete in glass-ui. Without the republish, three glass-ui BC waves ship with interim workarounds rather than the idiomatic kf surface.
- kf Tranche O must implement M.W14 as a blocking early wave: build DemoControlPoint.vue in demo/@/components/ over LIGHT drag2D, retire proof:control-point-live.mjs, author proof:demo-control-point born-RED. This is not optional — P-invariant-28 designates M as the absolute terminus for the 7-tranche DM-2 GlassControlPoint chronic; a ninth ride would violate the governing precept.
- kf Tranche O must give S8 (FN_NAME Symbol) and S9 (parse-that direct dep) workarounds a terminal home: either (a) wait-on-value.js-O-successor that ships VJ-L1/L3 (named wave, explicit trigger), or (b) reassess whether FN_NAME can be eliminated via a different provenance approach and the parse-that dep replaced by a value.js-exposed API that already exists. Current state is an unresolved perpetual punt, which violates P-invariant-28 if these items have ridden ≥4 tranches.
- kf Tranche O must decide M.W13 (engine decomposition gated on VJ-L1 flatLeaf): either (a) reframe as VJ-independent if an alternative decomposition path exists, or (b) document as explicitly HELD pending a future value.js deliverable — not silently carried. The engine.ts LIBRARY_CEILING_OVERRIDE exception (1400L vs 550L base) represents a standing ceiling violation that should resolve in O.
- BC.W-TUNABLE-ANIM Band 7 should explicitly name kf O as the prerequisite for the loop-seam consume in its Fences section (currently the foreign-tree fence is stated but the dependency chain to kf's republish timeline is implicit). The §F 'BOOKED' entry should name a concrete expected-version range so the gate C6 in BC.W-VIZ-CHOREOGRAPHY has a measurable trigger.
- BC.W-CONTROL-CUSTOM's MetricRow data-protagonist fold (speedtest-AX Band 15) has a subtle over-engineering risk: the CP1 proportion fence ('protagonist is the ONE focal event per surface') + the two self-test bites (accept-without-emphasis no-op + two-rows-protagonist) are architecturally correct but the enforcement boundary with proof:suffuse d1-d3 should be verified to not double-gate the same proportion invariant. The gate-completeness carve-out discipline is correctly applied here.
- The kf M.W8 Phase-2 (aria S1 + dock RF-17 S2 workaround deletions) should be the FIRST wave in kf O's consumed-by-BC band — it is the only workaround-deletion that GREENs proof:workaround-deletion S1/S2, which is a blocking gate. Confirm the atomic commit shape: re-pin to ~<BC>.x + delete :aria-orientation suppression (SpringSidebar.vue:43) + delete pointerHandled/onPlayPointerDown interim (TransportDock.vue:181,227,387-411).

---

## B6-parsethat-A

parse-that Tranche A closed 2026-06-19 at 0.11.0 with all four wave gates GREEN and 108 tests passing. The CSS-parser deletion (A.W1), packrat WDM fix (A.W2), and subpath split (A.W3) all landed correctly. Three significant observable-truth deviations from the charter were correctly self-reported in PROGRESS.md: the A.W1 gate was initially unsound (grepping index.d.ts rather than the runtime surface), the A.W2 surgical key-swap broke left-recursion so the full WDM was implemented instead, and the A.W3 SpanParser perf hypothesis was falsified (10-14% SLOWER on V8). The SpanParser is correctly withheld from all public subpaths and tree-shaken from all runtime bundles. However, three deferred items now lack a terminal home, violating P-invariant-28: the all() drop-undefined footgun (D8/leaf.ts:125), the console.error diagnostic leak (parser.ts:50), and the proof gate CI-wiring gap. The CLAUDE.md is also stale at v0.8.2 with CSS still listed as a domain parser.

**Recommendations:**

- Wire the three proof scripts into CI: add a post-build step in .github/workflows/ci.yml running `cd typescript && npm run proof:manifest && npm run proof:no-css-surface && npm run proof:subpath`. The build step already runs (so dist exists); the gates take <1s and enforce inv-A-1/inv-A-3 on every push. Without CI wiring, a future contributor can re-add CSS symbols or break a subpath without triggering a gate failure.
- Charter parse-that Tranche B with a terminal home for the two P-invariant-28 violations: (1) all() drop-undefined footgun — introduce an all_strict() or fix all() semantics to not drop undefined, coordinated with value.js O workaround removal; (2) console.error diagnostic leak — add setDiagnosticLogger(fn) to utils.ts and export from the diagnostics subpath. Both are small, surgical, and have zero consumer blast radius when done correctly.
- Update CLAUDE.md: bump version reference from 0.8.2 to 0.11.0, remove CSS from both the TS parsers/ description (line 18) and the Rust parsers/ description (line 40). The stale version number misleads any contributor or tool reading the file.
- Extend proof:subpath gate to functionally load and probe ./diagnostics and ./utils subpaths, not just check file existence. Specifically: `import(diagnosticsPath).then(m => { if (typeof m.enableDiagnostics !== 'function') fail(...) })` and `import(utilsPath).then(m => { if (typeof m.skipBlockComments !== 'function') fail(...) })`.
- Record the Rust CSS parser (rust/parse_that/src/parsers/css/) explicitly in future-research.md as 'retained, Rust-only, different consumer base (bbnf-lang ecosystem)' to prevent future confusion. Currently the future-research.md §7 update does not acknowledge the Rust/TS asymmetry on CSS grammar ownership.

---

## B7-valuejs-O

value.js Tranche O shipped all six library waves (O.W0–O.W6) and reached 1.0.2 on master @ 15b0382. The core deliverables are confirmed green: P0 crashes fixed (proof:css-parity 8/8), subpath split live (proof:subpath-budget 11/11, proof:subpath-resolve 5/5), zero-alloc gamut (proof:gamut-alloc 5/5), 2026+ grammar comprehensive including @function/if()/system-colors/recursive bodies/CSS Nesting AST (proof:grammar-2026 58/58), semantic idempotence inv-O-2 (proof:round-trip-idempotent 6/6), and SOTA perf dispatch()+byte-scanners +23–32% (proof:perf-target GREEN portable ratio). Three critical gaps remain: VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) were never shipped — they are absent from 1.0.2 dist and were not part of O's wave plan, making the O.md charter internally inconsistent with the kf-consume-edge that expected them. O.W7-demo (Parse-Lab pane + gamut-truth indicator) was authored as a spec but never implemented. The PROGRESS.md was never updated from its born-PLANNED status, making the authoritative close record stale.

**Critical findings:**

- **[BLOCKER·gap]** VJ-L1 (flatLeaf provenance API) NEVER SHIPPED — kf FN_NAME Symbol workaround (S8) still present
  - _ev:_ proof:workaround-deletion output: 'S8 PENDING — @mkbabb/value.js@0.14.0 is published but its VJ-L1 flatLeaf provenance API has NOT landed (value.js O shipped VJ-L2 only)'; runtime confirms `typeof vj.flatLeaf === 'undefi
  - _→_ handoff · fold: tranche-O-kf (kf Tranche O Wave) — VJ-L1 must be scoped as a value.js P wave item or killed; kf M.W13 engine-seam transp
- **[BLOCKER·gap]** VJ-L3 (parseCSSSubValue helper) NEVER SHIPPED — kf direct parse-that import (S9) still present
  - _ev:_ proof:workaround-deletion: 'S9 PENDING — value.js O shipped VJ-L2 only — held until VJ-L3 parseCSSSubValue helper ships'; runtime: `typeof vj.parseCSSSubValue === 'undefined'`; src/animation/utils.ts:1 still carries `imp
  - _→_ handoff · fold: tranche-O-kf — VJ-L3 must be scoped as value.js P wave item; until then kf proof:boundary W96 stays RED and the direct p
- **[HIGH·legacy]** O.PROGRESS.md never updated — still reads 'DEVELOPMENT — charter only' on a fully-executed tranche
  - _ev:_ docs/tranches/O/PROGRESS.md header: 'O is DEVELOPMENT — charter only. O.W0 is DEV (authored 2026-06-18; the charter is O.md). O.W1–O.W6 dispatch on explicit user ratification AFTER N.W9' / v1.0.0 closes.' — git log shows
  - _→_ fold-into-wave · fold: kf-O Wave 0 docs update — update O PROGRESS.md to reflect CLOSED with per-wave delivered status; authoritative close rec
- **[HIGH·deferred]** O.W7-demo (Parse-Lab pane + gamut-truth indicator) NOT implemented — born-RED gate absent
  - _ev:_ O PROGRESS.md row: 'O.W7-demo — AUTHORED (2026-06-18; spec at waves/O.W7-demo.md) | proof:parse-lab-mount — born-RED NOW (pane absent; zero parseCSSColor calls on route)'; `find demo/ -name '*.vue' | xargs grep -l 'Parse
  - _→_ deferred · fold: value.js P tranche or kf-O demo band — the library is complete but the parser-identity visibility in the demo is zero; b

**Recommendations:**

- Scope VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) into value.js Tranche P.W0 as the FIRST wave — these are the direct blockers for kf M.W13 engine-seam transposition and kf proof:boundary W96 gate green. Without them, kf carries the FN_NAME Symbol sidechannel and the direct parse-that import indefinitely, violating P-inv-28 at 5+ tranches.
- Update value.js docs/tranches/O/PROGRESS.md from 'DEVELOPMENT — charter only' to CLOSED, with per-wave status: O.W0 SHIPPED 0.13.1, O.W1+O.W2 SHIPPED 0.14.0, O.W3 SHIPPED (integrated into 0.15.0), O.W4/O.W4b SHIPPED 0.15.0, O.W5 SHIPPED 0.16.0, O.W6 SHIPPED 1.0.0, O.W7-demo DEFERRED (P). The authoritative close record is required for kf-O's ground truth.
- Scope O.W7-demo (Parse-Lab pane + gamut-truth indicator) into value.js Tranche P.W1 as a standalone demo wave — the born-RED gate proof:parse-lab-mount needs to be scripted and the Parse-Lab Vue pane built. This is the only O-chartered item that makes the parser identity visible; without it the developer experience gap documented in the spec remains unfilled.
- Kill or scope lowerCustomFunction (@function lowering) into value.js P.W2 with an explicit terminal home per P-inv-28 — it is a bounded utility (parameter substitution only, per O.W5 spec), the parsing AST is the prerequisite (delivered), and the P-wave scoping is already noted in O.W5 §Excluded. Do not carry indefinitely.
- Scope mixColorsInto out-param zero-alloc API into value.js P.W3 — measurement baseline is in proof:gamut-alloc (84 allocs/call post-O.W3; the remaining allocs are color2() intermediates). The P-wave target is the fully scalar hot-path with no Color object allocation per gamut-map call.
- Add a committed bench baseline file (bench/perf-baseline.json) to value.js alongside proof:perf-target so the +23-30% A/B claim is verifiable from any machine. The current ratio gate is correct for CI portability but does not preserve the absolute baseline for historical comparison.

---

## B8-valuejs-arch

value.js 1.0.2 completed the Constellation O tranche in full: all five proof gates (css-parity, subpath-budget, gamut-alloc, round-trip-idempotent, perf-target) are GREEN on the live tree. The subpath split is clean — `dist/subpaths/color.js` and `dist/subpaths/units.js` carry zero parse-that in their closure (esbuild-traced); the 1.0.0/1.0.1 `dist/units.js ↔ dist/units/` shadow was cured by routing subpath chunks to `dist/subpaths/`. The dispatch() LUT + byte-scanner SOTA perf is measured-and-stable (portable ratio gate). Two architectural transpositions remain open and are the critical blocker for keyframes.js Tranche O: VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) were deferred from O and never shipped, holding kf's FN_NAME Symbol sidechannel (S8) and direct @mkbabb/parse-that import (S9) in PENDING state. One genuine code-quality bug exists: FunctionValue constructor has an O(N²) setSubProperty loop (v is unused; `this.setSubProperty(name)` called N times each triggering a full N-child walk). The `color2Into` out-param (24 per-loop Color allocs in gamutMapToRgbSpace during the egress step) is documented-deferred; the probe OKLCHColor alloc is already scratch-reused.

**Critical findings:**

- **[HIGH·deferred]** VJ-L1 (flatLeaf provenance API) deferred from O — kf FN_NAME Symbol workaround PENDING
  - _ev:_ /Users/mkbabb/Programming/value.js/docs/tranches/O/PROGRESS.md: 'O shipped VJ-L2 only — DEFERRED VJ-L1 (flatLeaf provenance) and VJ-L3'. kf proof-workaround-deletion.mjs line 150: 'VJ-L1 — a first-class flat-leaf provena
  - _→_ handoff · fold: value.js-O-successor (post-1.0.2); kf Tranche O M.W9 S8 fires on that publish
- **[HIGH·deferred]** VJ-L3 (parseCSSSubValue helper) deferred from O — kf direct parse-that import PENDING
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/src/animation/utils.ts:1: 'import { any as parseAny } from "@mkbabb/parse-that"'. proof-workaround-deletion.mjs line 152: 'VJ-L3 — a sub-value parse helper so kf need not reach pars
  - _→_ handoff · fold: value.js-O-successor (post-1.0.2); kf Tranche O M.W9 S9 fires on that publish

**Recommendations:**

- PRIORITY 1 (BLOCKER for kf Tranche O): Ship VJ-L1 (flatLeaf/first-class provenance API on parsed leaves) and VJ-L3 (parseCSSSubValue helper that absorbs kf's direct parse-that import). These are the two deferred O items that hold S8 and S9 in proof:workaround-deletion PENDING. Without them, kf cannot retire its FN_NAME Symbol sidechannel or its @mkbabb/parse-that production dependency, and M.W13 (engine-seam transposition) stays blocked. Version target: value.js 0.14.0 per the M.W9 trigger.
- FIX the O(N²) setSubProperty bug in FunctionValue constructor (src/units/index.ts:169-171): change `values.forEach((v) => { this.setSubProperty(name); });` to `values.forEach((v) => v.setSubProperty(name));`. The current form calls setSubProperty N times on `this`, each triggering a full N-child walk = O(N²). The one-liner fix is O(N) and byte-identical for all N=1 cases (the common case); the fix matters for gradient stops and large transform lists.
- Add a color2Into out-param to dispatch.ts to eliminate the remaining 24 per-bisection-step Color allocations in gamutMapToRgbSpace. The probe OKLCHColor is already scratch-reused (dispatch.ts:231); the `color2(probe, target)` call inside the loop still allocates one Color per step. A `color2Into(probe, target, outColor)` that mutates an out-param would reduce the 84 allocs/call baseline further. Gate: extend proof:gamut-alloc with a N_target_v2 clause at <= 40.
- Evaluate shipping a parse-that-free './timing' or './easing-fn' subpath exporting only the pure timing functions (easeInQuad, CSSCubicBezier, etc.) without parseLinearStops/parseSteps. This would allow kf's resolveEasing() to import from a parse-that-free surface, tightening the light boundary. The existing ./math subpath has lerp/clamp but not the easing functions. If kf's LIGHT easing path needs no CSS string parsing, this subpath is a natural gap.
- Clean the residual .d.ts-only directories in dist/ (dist/units/, dist/parsing/, dist/transform/, dist/quantize/) or add null exports entries to package.json to block deep imports for consumers on legacy moduleResolution. The current state is safe for bundler/node16+ consumers (exports map blocks them) but creates confusion for older toolchains. Recommend adding '"./units/*": null' style block-entries in the next structural release.
- Fix the glass-ui Tabs typecheck failure in value.js demo (demo/@/components/ui/tabs/index.ts): this is a BC-tranche dependency, but the immediate mitigation is to add a // @ts-ignore or await the glass-ui BC cut. The demo tsconfig cannot green until glass-ui BC ships SegmentedTabs/Tabs exports. Track this as a value.js O-successor demo-typecheck item, not a library item.

---

## B9-parsethat-arch

parse-that@0.11.0 (master 6487219) is architecturally sound post-Tranche A: the WDM (id,offset)-keyed packrat landed correctly with full HEADS/GROWING machinery (not the "surgical fix" originally spec'd, which was found unsound mid-wave); the dispatch() 128-entry LUT is in production; the SpanParser tagged-union is correctly held module-internal after the §7 jump-table hypothesis was falsified (10-14% slower on V8). The critical open items are: (1) kf utils.ts S9 — a direct @mkbabb/parse-that production dep that cannot be deleted until VJ-L3 ships (value.js O deferred it); (2) value.js consumes parse-that's root barrel, never the ./core subpath, pulling packrat+diagnostics+json/csv into every value.js consumer unnecessarily; (3) three Tranche-A deferred items (all() footgun, BBNF codegen tranche B, setDiagnosticLogger) have "tranche B" as terminal home but no Tranche B exists — P-invariant-28 risk; (4) the cross-realm comment in kf/utils.ts is factually stale (single shared module instance confirmed). The getCijKey key space is safe at current grammar scale (1140 parsers post-value.js load; overflow starts at 4096).

**Critical findings:**

- **[HIGH·workaround]** S9 workaround: kf direct @mkbabb/parse-that production dep + `any` cast
  - _ev:_ keyframes.js/src/animation/utils.ts:1 `import { any as parseAny } from "@mkbabb/parse-that"` + line 236 `(parseAny as any)(fnArgs, CSSValues.Value)` + package.json `"@mkbabb/parse-that": "^0.11.0"`. Docs: docs/tranches/M
  - _→_ handoff · fold: kf Tranche O — fires when value.js ships VJ-L3 parseCSSSubValue; deletes utils.ts:1 import + package.json dep atomically

**Recommendations:**

- kf Tranche O: add the W96 parse-that-scan clause to proof-boundary.mjs immediately (born-RED on utils.ts:1 today); it becomes the commit-gate for S9 deletion once VJ-L3 ships.
- kf Tranche O M.W9: delete the stale cross-realm comment in utils.ts:224-228 in the same atomic commit as S9; the `as any` cast still has a valid TypeScript motivation (nominal types) but not a runtime one.
- value.js next tranche: migrate all 10 `from "@mkbabb/parse-that"` imports in src/parsing/ to `from "@mkbabb/parse-that/core"` — the subpath exists and is correct; this eliminates the unnecessary packrat+json+csv pull for every value.js consumer.
- parse-that Tranche B charter: the `all()` footgun (D8), the BBNF codegen foundation (SpanParser), and the setDiagnosticLogger override are three items with 'tranche B' as terminal home but no tranche B plan. Per P-invariant-28 these need a concrete disposition: charter Tranche B with the `all()` fix as the founding wave (highest correctness impact), or individually KILL/ASSIGN each item.
- parse-that Tranche B W0: add `setDiagnosticLogger(fn)` (a module-level var + one-line change in parser.ts:50) — the deferred item is micro-scope and blocks nothing; it just needs to be scheduled.
- parse-that packrat.ts: add a runtime guard `if (PARSER_ID > 4090) throw new Error('parse-that: PARSER_ID approaching getCijKey overflow')` — the 4096 ceiling is currently silent; the guard costs nothing on the non-packrat path and prevents a future silent correctness bug as grammars grow.

---

## B10-vjl1-vjl3

VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) were explicitly DEFERRED by value.js Tranche O: O shipped VJ-L2 (linear() space-separated serializer, confirmed GREEN at S7) but did NOT ship VJ-L1 or VJ-L3, despite kf anticipating them at L.W9. Both are confirmed absent from value.js 1.0.2 by live API probe (`flatLeaf` in vjs === false, `parseCSSSubValue` in vjs === false). As a result, two active precept violations remain in kf src/animation/utils.ts: S8 (FN_NAME Symbol sidechannel, 7 sites, utils.ts:1/45/47/50/51/54/55/64/213/236/289/293/342/361) and S9 (direct @mkbabb/parse-that import, utils.ts:1 + package.json:215). The proof:workaround-deletion gate correctly shows 1 GREEN (S7) / 4 PENDING (S1, S2, S8, S9) at exit 0. M.W9 (value.js O consume) fires on VJ-L1+VJ-L3 ship; M.W13 (engine-seam transposition) is blocked on M.W9. The W96 parse-that scan extension in proof:boundary was named but NOT implemented (fires only when S9 is deletable). DM-5 chronicity is 2 (K,L→M), rising to 3 at kf O — below the P-inv-28 ≥4 mandatory-exit belt, but the governing precept (no perpetual punts) demands a terminal home in kf O. The DECIDE: value.js should ship VJ-L1 and VJ-L3 in a follow-on tranche (value.js P); kf deletes S8/S9 on re-pin — there is no viable kf-side architectural alternative because subProperty conflates property-name with function-name semantics (ValueUnit.clone() preserves subProperty but it is overloaded), and the as-any casts in tryParseLeaves are genuine constellation-spine violations per inv-L-acyclic-purity.

**Critical findings:**

- **[HIGH·deferred]** VJ-L1 flatLeaf provenance API absent from value.js 1.0.2 — S8 FN_NAME Symbol remains active
  - _ev:_ src/animation/utils.ts:45-55 — `const FN_NAME = Symbol("kf.fnName")`, `type NamedValueUnit = ValueUnit & { [FN_NAME]?: string }`, `fnNameOf`, `stampFnName`. Live probe: `"flatLeaf" in require("@mkbabb/value.js")` === fal
  - _→_ handoff · fold: kf-O-M.W9 (fires on value.js P shipping VJ-L1 flatLeaf + ValueUnit.fnName field)
- **[HIGH·workaround]** VJ-L3 parseCSSSubValue absent from value.js 1.0.2 — S9 direct parse-that dep remains active, breaking constellation spine
  - _ev:_ src/animation/utils.ts:1 — `import { any as parseAny } from "@mkbabb/parse-that"`. package.json:215 — `"@mkbabb/parse-that": "^0.11.0"` (production dependency). Usage at utils.ts:229,236: `(CSSFunction.FunctionArgs as an
  - _→_ handoff · fold: kf-O-M.W9 (fires on value.js P shipping VJ-L3 parseCSSSubValue)

**Recommendations:**

- DISPATCH VJ-L1 + VJ-L3 to value.js Tranche P explicitly. VJ-L1 = add optional `fnName?: string` field to ValueUnit, preserved by clone() (additive, BC-clean). VJ-L3 = expose `parseCSSSubValue(property: string, value: string): ValueUnit | ValueArray | FunctionValue | null` at the value.js root export, wrapping the existing tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), value) composition. These are the only idiomatic exits for S8 and S9 that honor inv-L-acyclic-purity.
- In kf O M.W9 (the value.js consume wave), implement the W96 proof:boundary extension: scan HEAVY source modules (utils.ts, frame-compiler.ts, adapter.ts, engine.ts) for direct @mkbabb/parse-that imports and assert zero. This gate prevents S9 from silently recurring after deletion. It should fire on any `from "@mkbabb/parse-that"` in src/animation/**. Add to scripts/proof-boundary.mjs as a new assertion clause.
- Update DM-5 in PROGRESS.md prose before kf O opens: replace 'value.js@0.14.0 E404' with 'value.js@0.14.0 PUBLISHED (0.15.0, 0.16.0, 1.0.0, 1.0.1, 1.0.2 also published) but VJ-L1 flatLeaf and VJ-L3 parseCSSSubValue APIs NOT in any published version'. The gate is the ground truth; the doc is the stale artifact.
- In the kf O deferred ledger (DO rows), record DM-5 arms S8+S9 as chronicity 3 (K,L,M→O) with terminal home = value.js P VJ-L1+VJ-L3 publish. Named tripwire: `flatLeaf in require('@mkbabb/value.js')` transitions from false to true. P-inv-28 does not formally trigger at chronicity 3, but the no-perpetual-punts precept demands a terminal home be named. This is that naming.
- In kf O M.W13 (engine-seam transposition), confirm the precondition chain: M.W9 (VJ-L1 ships, S8 deleted) MUST land before M.W13 dispatches. proof:decomposition.mjs already carries the BORN-RED HANDOFF text. No additional gating action needed beyond the existing chain — the wave ordering is the mechanism.
- Consider whether value.js P can ship VJ-L1 and VJ-L3 as a small additive patch rather than a full tranche wave. VJ-L1 is ~10 LoC (add fnName field to ValueUnit, copy in clone()), VJ-L3 is ~15 LoC (thin wrapper over existing parser internals). Both are BC-additive. A patch release (e.g. value.js 1.1.0) could close both without a heavyweight tranche ceremony. Flag to the value.js owner.

---

## B11-cross-realm-seams

The cross-realm seams in `src/animation/utils.ts` are three documented workarounds (S8: FN_NAME Symbol, S9: direct parse-that import, plus the lerpArray inline copy) held in the three-state PENDING model against value.js VJ-L1 (`flatLeaf`) and VJ-L3 (`parseCSSSubValue`) APIs. Live verification confirms: VJ-L2 (linear() serialize) shipped and S7 is GREEN; but VJ-L1 and VJ-L3 were DEFERRED by value.js's Tranche O and are absent from ALL published versions through 1.0.2. The `proof:workaround-deletion` gate correctly holds S8/S9 at PENDING via its `apiPresent` API-check guard. The critical gate gap is `proof:boundary` W96 — the parse-that-scan extension for HEAVY modules — named since L.W9 but never authored; a new HEAVY module importing `@mkbabb/parse-that` directly would not be caught today. The `lerpArray` inline copy in `leaves.ts` has a ready cure (`@mkbabb/value.js/math` subpath, confirmed live in node_modules), but its swap requires VJ-L3 to land first per the M.W9 atomic-commit discipline. The `memoize` keyFn comment in utils.ts line 244 is accurate: `JSON.stringify.apply(null, [childKey, strValue])` returns only `"childKey"` (second arg is treated as replacer), confirming the explicit `keyFn` is load-bearing.

**Critical findings:**

- **[HIGH·workaround]** S8 — FN_NAME Symbol sidechannel: acyclic-spine violation, PENDING (VJ-L1 unshipped)
  - _ev:_ src/animation/utils.ts:45-57 (Symbol declaration + stamp/read helpers), :289-293 (re-stamp after clone), :342-363 (identity-pad use). `proof:workaround-deletion` live output: 'S8 PENDING — value.js@0.14.0 is published bu
  - _→_ handoff · fold: M.W9 (fires on value.js VJ-L1 flatLeaf publish; one atomic commit)
- **[HIGH·workaround]** S9 — direct @mkbabb/parse-that production dep: spine architecture violation, PENDING (VJ-L3 unshipped)
  - _ev:_ src/animation/utils.ts:1 `import { any as parseAny } from '@mkbabb/parse-that'`; :229-236 `(CSSFunction.FunctionArgs as any).map(...)` and `(parseAny as any)(fnArgs, CSSValues.Value)`. package.json `'@mkbabb/parse-that':
  - _→_ handoff · fold: M.W9 (fires on value.js VJ-L3 parseCSSSubValue publish; atomic with S8)
- **[HIGH·gap]** proof:boundary W96 parse-that-scan: gate gap for HEAVY modules — authored in docs but NEVER implemented
  - _ev:_ scripts/proof-boundary.mjs:93-107 — `holdsValueJsSpecifier` regex matches only `@mkbabb/value.js` specifiers (confirmed: grep shows only `value\.js` pattern). The source-grep complement at :363-380 runs over LIGHT module
  - _→_ fold-into-wave · fold: Tranche-O M.W9 (the W96 scan must be authored before S9 deletion lands)

**Recommendations:**

- Author the proof:boundary W96 parse-that-scan for HEAVY modules NOW (born-RED against utils.ts:1). Extend `holdsValueJsSpecifier` to also match `@mkbabb/parse-that` specifiers, and run the grep over ALL src/animation/*.ts files (not just light surface), asserting zero hits except the known S9 violator. The gate must born-RED today and flip GREEN when S9 deletes utils.ts:1. This is the viol-M8 cure named in M.md:143 and M.W9 spec but never implemented.
- Update the M.W9 tripwire in docs (M.md:112, PROGRESS.md:135, KF-CONSUME-SEQUENCING-M.md:102-130, proof-workaround-deletion.mjs:260/273) from 'value.js@0.14.0 E404' / 'value.js O 0.14.0' framing to 'VJ-L1/VJ-L3 APIs absent from published value.js'. The gate's apiPresent guard already handles this correctly; the docs are the stale artifact. value.js@0.14.0 IS published (confirmed via npm show) but lacks the APIs — any doc that says '0.14.0 E404' is factually wrong.
- File a value.js VJ-L1 (flatLeaf / function-name provenance on ValueUnit) dispatch as a formal sibling ask for Tranche P/next. The ask is precisely scoped: a first-class API that preserves the origin FunctionValue.name on each leaf ValueUnit produced by flattenObject, survives ValueUnit.clone(), and is typed. This unblocks S8 deletion in kf AND unlocks M.W13 engine-seam transposition. CLAUDE.md §Dependencies and lane-22-constellation-dag.md §2.2 already have the full spec.
- File a value.js VJ-L3 (parseCSSSubValue) dispatch as a formal sibling ask for Tranche P/next. The ask: a `parseCSSSubValue(property: string, value: string): ValueUnit | ValueArray | FunctionValue` that internalizes the `(parseAny as any)(fnArgs, CSSValues.Value)` composition currently in kf utils.ts:229-237. This dissolves the direct parse-that dep (S9), shrinks kf's package.json by one production dep, and enables the lerpArray swap and proof:boundary W96 clean pass.
- Once VJ-L3 lands: execute M.W9 as ONE atomic commit — re-pin @mkbabb/value.js; delete utils.ts:1 (parse-that import) + the `(parseAny as any)` call + `(CSSFunction.FunctionArgs as any)` cast; replace with `parseCSSSubValue`; remove parse-that from package.json; swap leaves.ts:68-80 lerpArray inline for `import { lerpArray } from '@mkbabb/value.js/math'`; update leaves.ts:55-63 comment to remove stale './math absent' rationale. Then author and verify the W96 scan goes from RED to GREEN.

---

## C12-kf-M-waves

The Tranche M charter (M.md, PROGRESS.md, waves/M.W0–M.WZ) is fully DEVELOPED with 32-lane audit evidence and a sound 16-wave DAG. The campaign-authorized implementation phase ran partially: M.W1 (runner), M.W8 Phase-1 (lockfile), M.W9 partial (S7 only), M.W10 (packrat-sound), and M.W11 (css-parity) are IMPLEMENTED and gates pass. However the complete set of M.W2/W3/W4 Band-A apparatus waves (eslint, vitest browser, synthetic clock) are DEVELOPED-only. Band-B correctness waves M.W5 and M.W6 have partially wrong gates: proof:replay-equality S4 uses a source-shape regex proxy (not the real NaN-frame-times observable M.W5 mandates), and compile-color.ts:191 still calls colorToOklabCSS unconditionally (the oklch-emits-oklab bug). M.W7 cross-depth walk is implemented. Bands D/E (M.W12–M.W14) are all DEVELOPED-only. M.WZ is explicitly NOT closed: proof:chronic-closure still points at L/PROGRESS.md, proof:changelog-5.0.0 is absent, version is 4.3.0 not 5.0.0, and keyframes-vue remains unpublished (E404). The M-RECONCILIATION-mandated edits to PROGRESS.md (BB→BC re-target, Phase splits, DM-24/25/DM-W1-bridge rows) have not been applied. The two new BC-gated waves (M.W-DESIGN-PAINT, M.W15) are authored as stubs but have zero implementation scripts. The open handoffs to glass-ui BC (M.W8 Phase-2: S1/S2 workaround deletion) and to value.js (S8/S9: FN_NAME Symbol + parse-that direct dep) remain PENDING with their sibling unpublished (glass-ui 4.1.0 E404; value.js 0.14.0 not on registry — only 1.0.2 consumed its VJ-L2 piece).

**Critical findings:**

- **[HIGH·workaround]** M.W5 S4 named-selector gate uses SOURCE-SHAPE PROXY — NAMED_SELECTOR_NO_TIMELINE never thrown
  - _ev:_ scripts/proof-replay-equality.mjs:173 requireAll('named-selector', FRAME_COMPILER, [{re: /entry|exit|cover|contain/}]) — a regex check against frame-compiler.ts source; src/animation/frame-compiler.ts:114 'refuses with N
  - _→_ fold-into-wave · fold: Tranche-O: M.W5 impl — the S4 clause must be re-targeted to the NaN-frame-times observable (as M.md §⚠M1 + PROGRESS.md §
- **[HIGH·gap]** M.W5 first clause UNIMPLEMENTED — compileToCSS still drops @property block
  - _ev:_ grep -c '@property|propertyRegistry|CSSPropertyRegistry' src/animation/compile.ts → 0; M.md:⚠M1 + PROGRESS.md §1 M.W5 state '@property emitted by compileToCSS' as the first clause of proof:replay-equality extension; comp
  - _→_ fold-into-wave · fold: Tranche-O: M.W5 impl
- **[HIGH·gap]** M.W6 UNIMPLEMENTED — oklch space emits oklab() (viol-M2) + non-color props dropped (viol-M3)
  - _ev:_ src/animation/compile-color.ts:191 'stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) })' called unconditionally; densifyKey receives 'space: "oklab" | "oklch"' at line 165 but always calls colorToOklabCSS; M.
  - _→_ fold-into-wave · fold: Tranche-O: M.W6 impl
- **[HIGH·gap]** M.WZ NOT CLOSED — proof:chronic-closure points at L, no changelog gate, version 4.3.0
  - _ev:_ scripts/proof-chronic-closure.mjs:114 'CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md' (verified live); ls scripts/proof-changelog* → not found; package.json 'version': '4.3.0' (not 5.0.0); npm show @mkbabb/keyframes-vue →
  - _→_ fold-into-wave · fold: Tranche-O: M.WZ impl (substrate re-point L→M, proof:changelog-5.0.0, 5.0.0 cut, deploy round-trip)
- **[HIGH·chronic]** DM-1 RF-17 (4-tranche) + DM-2 GlassControlPoint (7-tranche, ABSOLUTE terminal) not exited at M
  - _ev:_ PROGRESS.md §Open-deferrals DM-1 chronicity '4 (I,J,K,L→M)' PENDING on glass-ui 4.1.0 (E404); DM-2 chronicity '7 (E,F,G,H,I,J,K,L→M)' proof:control-point-live exits RED-BY-DESIGN; P-invariant-28 mandates no 8th ride for 
  - _→_ fold-into-wave · fold: Tranche-O: M.W14 impl — DM-2 MUST EXIT (build-in DemoControlPoint or permanent KILL; no 9th ride permitted under P-invar

**Recommendations:**

- Open Tranche O with the M.WZ close as the FIRST action: author proof-changelog-5.0.0.mjs (the FOUR renames + multi-color refusal), re-point proof:chronic-closure CHRONIC_LEDGER from L/PROGRESS.md to M/PROGRESS.md with non-vacuity planted-row RED discipline, and apply all M-RECONCILIATION §11 edit-specs to PROGRESS.md + deferred-ledger-M.md (BB→BC re-target, DM-24/DM-25/DM-W1-bridge rows). This closes the dev→impl boundary formally and makes Tranche O the authoritative substrate.
- Implement M.W5 + M.W6 Band-B correctness waves immediately (no sibling dependency): (a) wire @property into compileToCSS/compileChild so the compile artifact emits the registry blocks (M.W5 clause 1); (b) dispatch colorToOklabCSS vs a colorToOklchCSS based on the space parameter in densifyKey (compile-color.ts:191 — the viol-M2 fix); (c) preserve non-color properties through the densified block (viol-M3); (d) extend proof:compile-replay with the real emitted-CSS assertions (oklch-densify-emits-oklch + densify-preserves-non-color); (e) retarget proof:replay-equality S4 from the source-shape regex to the actual NaN frame-times or NAMED_SELECTOR_NO_TIMELINE throw observable.
- Execute M.W14 DemoControlPoint build-in NOW (no sibling dependency): value.js 0.13.0+ ships PathGeometry with getTotalLength()/getPointAtLength() (verified at node_modules/@mkbabb/value.js/dist/transform/path.d.ts lines 36–67). Build fromMorphSVG as a kf-side compositor over PathGeometry; author proof:morphsvg-consume asserting a live morph sample differs from both endpoints. For GlassControlPoint (DM-2, 7-tranche ABSOLUTE terminal), build a thin DemoControlPoint over the LIGHT Draggable primitive — this is Option B from M.W14.md and the only P-invariant-28-compliant exit that does not require a sibling publish.
- M.W8 Phase-2 fires atomically on glass-ui BC publish: in ONE commit delete both :aria-orientation=undefined suppressions (SpringSidebar.vue:43 + AnimationControls.vue:72) AND delete the pointerHandled/onPlayPointerDown interim in TransportDock.vue (all 9 hits). Bump the pin from ~4.0.0 to ~<BC>.x. Then close-merge tranche-m→master, observe the CI→deploy-pages.yml→live-byte-equality round-trip, and record in M/FINAL.md.
- M.W9 S8+S9 fire on value.js VJ-L1 (flatLeaf provenance API) + VJ-L3 (parseCSSSubValue): when published, delete FN_NAME Symbol from utils.ts (45–55), delete the direct @mkbabb/parse-that import (utils.ts:1 + package.json), and replace the inline lerpArray with @mkbabb/value.js/math. Author proof:boundary W96 parse-that-scan in proof-boundary.mjs:holdsValueJsSpecifier to also scan light modules for parse-that specifiers (not just value.js). DM-5 S8/S9 arms GREEN.
- Implement Band A M.W2/W3/W4 in Tranche O (no sibling dependency): M.W2 — add eslint.config.ts with max-lines, import/no-restricted-paths, no-dup rules; M.W3 — install @vitest/browser-playwright, migrate the 72 runtime gates to *.browser.test.ts over the served dist (inv-M-one-runner); M.W4 — author proof:gate-is-data-model + proof:no-animation-sleep; replace the 264 waitForTimeout sleeps with synthetic-clock predicates. These transform the gate apparatus from O(N²) cold-boot per gate to a warm shared-browser model.
- Author proof-audit-artifacts-M.mjs (the M.W0 gate) and wire it into proof:hygiene. This is a pure node script (~50 LOC) with 5 clauses: (a) 32 lane files present + corpus ≥14000L; (b) three M-born invariants in M.md; (c) PROGRESS.md + prompt-recap-M.md + KF-CONSUME-SEQUENCING-M.md present; (d) git diff --stat <M.W0-base>..HEAD -- src/ demo/ is EMPTY; (e) deploy oracle hash recorded in M.W0.md. Without this gate the dev→impl boundary is only prose-asserted.
- M.W-DESIGN-PAINT + M.W15 implementation opens on glass-ui BC publish: after the BC consume, author scripts/proof-design-paint.mjs (per-scene pixel-readback matrix: zero-delta transform between rAF frames, glass specular ::before opacity, colour gamut checks, PRM stop check using getComputedStyle not getAnimations()); flip proof:lighthouse-mobile from observe-only to hard posture; author proof:content-visibility-gated using ContentVisibilityAutoStateChangeEvent with top-level .skipped (not detail.skipped) and asserting RAFPlayback.running === false.

---

## C13-kf-deferred-ledger

The DM-1..DM-23 deferred ledger in `docs/tranches/M/audit/deferred-ledger-M.md` + `docs/tranches/M/PROGRESS.md §"Open deferrals"` is coherently structured and rigorous, but is materially STALE as of the post-consume master state (aef3ef3). Five live discrepancies exist between the DOCS-PHASE snapshot the ledger froze at and the real runtime tree: (1) DM-5's S7 arm FIRED and is GREEN but the ledger still claims "0 GREEN / 5 PENDING"; (2) DM-6's tripwire FIRED (value.js 1.0.x shipped) and proof:css-parity is GREEN, yet the ledger says HANDOFF/UN-FIRED; (3) DM-4 disposition is KILL in both the deferred-ledger and PROGRESS.md, but M-RECONCILIATION.md §4 documents a D4 owner decision flipping it to FIX/FOLD and proof:packrat-sound is now GREEN (the fix shipped via parse-that A.W2 in 0.11.0); (4) DM-2 (7-tranche, ABSOLUTE terminal at M) and DM-3 (7-tranche, ABSOLUTE terminal at M) were never executed (DemoControlPoint absent, fromMorphSVG absent, proof:morphsvg-consume absent) — DM-2 is named in Tranche O ground truth but DM-3 has NO explicit O home, a P-inv-28 gap; (5) the proof:chronic-closure script has a stale LEDGER_LABEL of "K/PROGRESS.md" while CHRONIC_LEDGER points to L/PROGRESS.md, and the M.WZ substrate re-point (L→M) is still PENDING (blocked on glass-ui BC / M.WZ). Three rows specified in M-RECONCILIATION.md (DM-24 N-Stage, DM-25 consume-bundle, DM-W1-bridge) were never applied to either ledger document.

**Critical findings:**

- **[HIGH·gap]** DM-5 S7 claim stale: ledger says '0 GREEN / 5 PENDING' but S7 is already GREEN
  - _ev:_ docs/tranches/M/audit/deferred-ledger-M.md:134 — DM-5 claims 'proof:workaround-deletion 0 GREEN / 5 PENDING / 0 RED (re-run live)'. Live run shows 1 GREEN / 4 PENDING: S7 (linear() flat-comma regex in utils.ts) retired w
  - _→_ fold-into-wave · fold: Tranche-O W1 or intake — update deferred-ledger-M.md and PROGRESS.md DM-5 to reflect 1 GREEN / 4 PENDING; remove S7 arm 
- **[HIGH·gap]** DM-6 css-parity tripwire FIRED but ledger still says HANDOFF/UN-FIRED
  - _ev:_ docs/tranches/M/PROGRESS.md:292 — DM-6 disposition states 'HANDOFF (coordinated value.js-O + parse-that publish; M.W11 Band-A gate authored NOW, IMPL gated)' with tripwire un-fired. But proof:css-parity.mjs runs GREEN: '
  - _→_ fold-into-wave · fold: Tranche-O W1 intake — DM-6 should be marked as FIRED / gate GREEN; update the disposition from HANDOFF to FOLD-LANDED in
- **[HIGH·transposition]** DM-4 KILL vs FIX/FOLD: ledger says KILL but D4 owner decision + proof:packrat-sound GREEN mean FIX shipped
  - _ev:_ docs/tranches/M/audit/deferred-ledger-M.md:133 + PROGRESS.md:290 — DM-4 disposition is 'KILL (off the value.js-consumed path)'. But M-RECONCILIATION.md:128-168 documents D4 owner decision: 'FIX, not KILL — MEMO keyed on 
  - _→_ verify · fold: Tranche-O W1 intake — update DM-4 from KILL to FOLD-LANDED (parse-that A.W2 FIX per D4); update DM-17 from RESOLVED-BY-K
- **[BLOCKER·chronic]** DM-3 MorphSVG (7-tranche ABSOLUTE terminal) has NO home in Tranche O scope — P-inv-28 gap
  - _ev:_ docs/tranches/M/audit/deferred-ledger-M.md:141 — DM-3 says 'ABSOLUTE terminal at M. build-in NOW; no 8th BOOK'. But proof:morphsvg-consume.mjs is ABSENT (ls exit 1), fromMorphSVG does not exist in src/animation/ (grep re
  - _→_ handoff · fold: Tranche-O — must explicitly assign DM-3 a terminal home: either (a) build fromMorphSVG over the published PathGeometry (
- **[HIGH·deferred]** DM-2 GlassControlPoint (7-tranche ABSOLUTE terminal): M.W14 not executed, DemoControlPoint not built
  - _ev:_ docs/tranches/M/PROGRESS.md:288 — DM-2 is 'ABSOLUTE terminal at M (re-BOOK CLOSED since L.WZ)'. M-CONSUME-CLOSE.md lists M.W8-Phase2, M.W-DESIGN-PAINT, M.W15, M.WZ as BC-gated, but does NOT list M.W14. No DemoControlPoin
  - _→_ fold-into-wave · fold: Tranche-O — assign DemoControlPoint build-in to an explicit O wave; build a thin DemoControlPoint composable over the LI
- **[HIGH·gap]** DM-3/DM-2 not mentioned in M-CONSUME-CLOSE.md HANDOFF list — silent omission of 7-tranche ABSOLUTE-terminal items
  - _ev:_ docs/tranches/M/M-CONSUME-CLOSE.md §'HANDOFF / deferred' lists: M.W8-Phase2, M.W-DESIGN-PAINT, M.W15, M.WZ, N Stage (DM-24), keyframes-vue-published (DM-7). DM-2 (GlassControlPoint/DemoControlPoint) and DM-3 (MorphSVG) a
  - _→_ fold-into-wave · fold: Tranche-O scoping doc — add DM-2 and DM-3 explicitly to the 'open from M' list with their chronicity integer and P-inv-2

**Recommendations:**

- Tranche O MUST assign DM-3 (MorphSVG fromMorphSVG, 7-tranche) to an explicit O wave with a born-RED gate (proof:morphsvg-consume) — the 8th carry is forbidden under P-inv-28. The PathGeometry API is already published in value.js 1.0.2 (dist/transform/path.d.ts:36-67), so this is a kf-internal build requiring NO sibling gate. Execute M.W14 as part of the O scope.
- Tranche O W1 intake should apply all M-RECONCILIATION.md §11 edit-specs that remain IMPL-OPEN: (a) update DM-4 from KILL to FOLD-LANDED per D4 / parse-that A.W2; (b) update DM-17 from RESOLVED-BY-KILL to RESOLVED-BY-FIX; (c) update DM-5 from '0 GREEN / 5 PENDING' to '1 GREEN / 4 PENDING' (S7 RETIRED); (d) update DM-6 to FIRED/FOLD-LANDED (proof:css-parity GREEN); (e) add DM-24/DM-25/DM-W1-bridge rows.
- Execute the M.WZ substrate transition as the FIRST act of Tranche O: re-point proof-chronic-closure.mjs:114 CHRONIC_LEDGER from L/PROGRESS.md to M/PROGRESS.md, fix the LEDGER_LABEL from 'K/PROGRESS.md' to 'L/PROGRESS.md', and run the non-vacuity planted-probe proof (three malformed rows RED before cleaning). This is the ORCHESTRATOR'S ATOMIC FINAL MOTION that was deferred pending glass-ui BC.
- Retarget all DM-1/DM-5 S1/S2 tripwire references from 'glass-ui BB 4.1.0' to 'glass-ui BC cut' (BB closed at 4.0.1, never published 4.1.0) in both deferred-ledger-M.md and PROGRESS.md, as specified in M-RECONCILIATION.md §1 but never applied.
- Correct the MEMORY.md 'Oscillator republish (LOCAL-ONLY, absent from published 4.3.0 dist)' claim — Oscillator IS in the published 4.3.0 (verified via proof:published-surface.mjs and git show 529fcfd:src/animation/index.ts). Remove or correct this stale entry to avoid misdirecting Tranche O planning.
- Assign the 8 VERIFY-ONLY/RE-AFFIRM re-runs (DM-8 through DM-15) to an O.W0 health-check wave that executes independently of the BC gate, rather than parking them all at the BC-gated M.WZ. These are terminated chronics needing only a gate re-run, not a new sibling publish.
- Dispatch VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) as explicit asks to value.js in a Tranche O ASK document, and assign S8/S9 workaround deletions to an O wave tripwired on that value.js future publish. These are the only remaining constellation workarounds without a named O milestone.
- DM-2 (DemoControlPoint, 7-tranche) is correctly scoped for Tranche O per the ground truth, but needs an explicit O wave stub with a born-RED gate (proof:demo-control-point or proof:control-point-live re-pointed at the kf-built component). Add it to the O PROGRESS.md §'Open deferrals' substrate as a net-new O row rather than carrying the DM-2 glass-ui-HANDOFF framing.

---

## C14-cascade-soundness

The five-fix cascade (97c5eae..aef3ef3) is broadly sound. The value.js re-pins (1.0.1→1.0.2) are idiomatic consumer responses to sibling bugs — no kf-side workaround was introduced. The CLAUDE.md doc count uses a dynamic "derive, don't trust a frozen number" directive, which is architecturally better than the old frozen literal. The CI YAML quoting fix is correct and now verified by the I.WZ YAML-parse clause in proof:ci-coverage. The S7 deletion (flat-comma fold) is genuinely sound — value.js 1.0.0+ emits canonical space-joined linear() stops so the normalize regex is obsolete. The API-aware gate redesign correctly uses a capability probe (parseCSSValue().toString() round-trip) rather than version-publish alone. Two residual gaps exist: (1) the roundtrip-easing.test.ts PENDING arm at L169 uses a different probe condition than what S7 actually required, leaving the arm permanently stranded in PENDING; (2) S1/S2 in proof-workaround-deletion.mjs lack apiPresent capability probes, meaning a glass-ui 4.1.0 publish without the actual aria/RF-17 fixes would falsely red those arms.

**Recommendations:**

- In Tranche-O, update the `vjL2LinearLanded` probe in test/roundtrip-easing.test.ts (L44-54) to reflect what VJ-L2 actually fixed: the SERIALIZER now emits canonical form (already true), not that the PARSER now accepts flat-comma. Either activate the stranded PENDING arm by re-writing it to test the real post-S7 round-trip, or KILL the L162 describe block as legacy documentation — the S7 defect is resolved and the stranded arm cannot activate without a different (not-yet-planned) value.js change.
- In Tranche-O M.W8 Phase-2 wave, add behavioral apiPresent probes for S1/S2 in proof-workaround-deletion.mjs (analogous to vjsCaps.flatLeaf for S8). Concrete approach: import @mkbabb/glass-ui and check for a known BC-tranche export symbol (e.g., a 'useDockClickIntegrity' composable or similar named BC deliverable). If headless behavioral probing of CSS components is impractical, add an explicit comment documenting the version-only dependency as an acknowledged design constraint.
- Update the S8/S9 sibling version strings in proof-workaround-deletion.mjs from '0.14.0' (already published, causes PUBLISHED+API-absent ambiguity) to a not-yet-published semver (e.g., '2.0.0') so the three-state model is unambiguous: PRESENT+UNPUBLISHED = PENDING, not PRESENT+PUBLISHED+api-absent = PENDING via a different code path.
- The M.W8 Phase-1 lockfile update (npm update @mkbabb/glass-ui to resolve ~4.0.0 → 4.0.1) documented in M-RECONCILIATION.md is a quick-win for Tranche-O W1: it requires only a lockfile commit and immediately GREENs proof:peer-satisfied Phase-1 arm.
- The two remaining chronic workarounds S8 (FN_NAME Symbol sidechannel) and S9 (direct parse-that import) have their terminal home in value.js VJ-L1 + VJ-L3 respectively. These should be P-invariant-28 tracked in Tranche-O's open deferral ledger with explicit 'terminal home: value.js next tranche → kf consume wave' dispositions, not left as indefinite PENDING arms.

---

## C15-kf-engine

The post-M keyframes engine (engine.ts, group.ts, frame-compiler.ts, animate.ts, utils.ts) is structurally sound: the D.W4 transposition lineage (FrameCompiler split, zero-alloc group compositor, advanceTo canon) is intact and gated. The LIGHT/HEAVY boundary holds (proof:boundary GREEN). Three live precept-biting workarounds persist in utils.ts — FN_NAME Symbol sidechannel (S8), direct parse-that import (S9), both PENDING on value.js VJ-L1/VJ-L3 — and are correctly tracked by proof:workaround-deletion. One real correctness gap (DM-22) is carried but never cured: named scroll-selector frames produce NaN frame times that make the frame always-active, confirmed by test. The engine-seam transposition (M.W13, the largest structural debt) remains deferred, now blocked specifically on VJ-L1. Two CLAUDE.md trees are significantly stale (17 new files absent from root; 11+ from animation/CLAUDE.md). One dead code path in fromKeyframes and one V8 dictionary-mode risk in the group blend-buffer compaction delete are surface-level but not gated.

**Critical findings:**

- **[BLOCKER·gap]** DM-22 named-selector NaN-always-active frames: NAMED_SELECTOR_NO_TIMELINE typed but never thrown
  - _ev:_ frame-compiler.ts:128 stores `new ValueUnit('entry', undefined, ['named-selector'])` with string `.value`; utils.ts:398 computes `(start.value * duration) / 100` → NaN; binarySearch.ts:32-34 returns NaN-frame as seed=0 a
  - _→_ fold-into-wave · fold: Tranche-O wave resolving DM-22 (author born-RED gate on NaN frame times; fix: throw NAMED_SELECTOR_NO_TIMELINE at parse 
- **[HIGH·deferred]** M.W13 engine-seam transposition deferred: engine.ts at 1397L (3L under cap) blocked on VJ-L1
  - _ev:_ proof-decomposition.mjs:151-157 BORN-RED HANDOFF verbatim — 'the FULL engine-seam transposition the D.W4 audit named…DEFERRED future-tranche split'; engine.ts at 1397L (wc -l confirmed); M/PROGRESS.md:139 states M.W13 st
  - _→_ deferred · fold: Tranche-O M.W13 — execute only after VJ-L1 flatLeaf ships in value.js O
- **[HIGH·workaround]** S8 FN_NAME Symbol sidechannel on ValueUnit (utils.ts:45-57) — PENDING on VJ-L1
  - _ev:_ utils.ts:45 `const FN_NAME = Symbol('kf.fnName')` stamps a private Symbol onto published value.js ValueUnit objects; 7 lines involved (45,47,51,55,213,289,342). proof-workaround-deletion.mjs S8 output confirms PENDING: '
  - _→_ handoff · fold: Tranche-O DM-5 S8 — delete on value.js VJ-L1 (flatLeaf provenance API) publish + re-pin
- **[HIGH·workaround]** S9 direct @mkbabb/parse-that import in utils.ts:1 — PENDING on VJ-L3
  - _ev:_ utils.ts:1 `import { any as parseAny } from '@mkbabb/parse-that'`; used at utils.ts:229,236 to build a sub-CSS-value parser that value.js doesn't expose; two `as any` casts bypass cross-realm TypeScript type comparison. 
  - _→_ handoff · fold: Tranche-O DM-5 S9 — delete on value.js VJ-L3 (parseCSSSubValue helper) publish + re-pin

**Recommendations:**

- DM-22 MUST be resolved in Tranche O: the NAMED_SELECTOR_NO_TIMELINE error code is typed but dead — named scroll-selector frames produce NaN frame times making them always-active. Author born-RED gate (`proof:named-selector-no-nan`) that ingests `entry 0%` and asserts the frame time is NOT NaN. Fix: either throw at parse time in frame-compiler.ts addFrame (when no ScrollTimeline is present) or resolve to 0% as a safe default. The current 'opaque storage + deferred resolver' design has a missing resolver.
- Engine-seam transposition (M.W13) should be the first O-wave scheduled after VJ-L1 ships. The `FN_NAME` Symbol (S8) is the stated blocker. Track VJ-L1 readiness via proof:workaround-deletion S8 state; when S8 flips GREEN, the transposition is unblocked. Expected yield: engine.ts 1397→~900L, retiring the 1400 override; group.ts compositor split follows immediately.
- Both CLAUDE.md docs need a single update wave in Tranche O: root CLAUDE.md and animation/CLAUDE.md are missing 17 files added across L/M tranches (engine-composition.ts, load-engine.ts, oscillator.ts, compile.ts, ingest.ts, scroll-scene.ts, validate.ts, etc.). This is an agent/human navigation hazard — the project map misrepresents the real tree.
- Delete the dead branch in fromKeyframes (engine.ts:1256-1258): after `isObject(keyframes) → new Map(...)`, the `instanceof Map ? .entries() : Object.entries()` is always the Map path. Simplify to a single `.entries()` call on the resolved Map.
- The group.ts post-blend compaction `delete groupedValues[key]` (line 374) contradicts the F.W4 'delete-free' invariant comment 4 lines above it. Evaluate whether the compaction is needed (transforms that receive undefined for a key should be no-ops) or gate the risk with a proof that disabled-layer scenarios do not degrade _grouped to dictionary mode.
- Add a `Map<number, AnimationFrame>` keyed by `startIx * FRAME_ID_SCALE + endIx` inside `reconcileVars` to make the frame-dedup lookup O(1) instead of O(frames). The key formula is already computed as `id` in createFrame — reuse it.
- forcePause/forcePlay should either be demoted to `private` (if only used internally) or documented with JSDoc in group.ts matching the managed-child lifecycle contract in animation/CLAUDE.md. Currently they are public methods with no documentation and no demo usage.

---

## C16-kf-demo

The keyframes demo post-M is in a strong state: the E-tranche (W1–W11) landed fully across all six Baseline-checklist waves and five deep-SOTA waves. The vueuse listener/observer gestalt is complete (proof:brittleness GREEN, LISTENER_ALLOWLIST empty), styling is fully localized (gold-shimmer owned-then-deleted in favour of glass-ui's identical recipe, tokenized arbitrary values, dvh reconciled), Monaco is deferred off the static graph, View Transitions + CWV levers are shipped, and App.vue decomposed to 478L (under the 500L ceiling). The hero word-gap defect ("Selectananimation") is cured via per-word marginInlineEnd. Two structural gaps remain open for Tranche O: (1) proof:design-paint is authored in M.W-DESIGN-PAINT but the gate SCRIPT DOES NOT EXIST (scripts/proof-design-paint.mjs absent — visual-truth oracle is unvalidated for all 8 scenes); (2) proof:lighthouse-mobile posture remains observe-only in CI (M.W15 S1 posture flip to hard-gate is BC-gated and not yet executed). Three chronic workarounds in src/animation/utils.ts (FN_NAME Symbol S8, direct parse-that dep S9, plus demo-layer S1 aria-orientation + S2 RF-17 pointerHandled) are correctly PENDING on sibling publishes (VJ-L1/VJ-L3 absent from value.js 1.0.2; glass-ui BC not yet published). DM-2 GlassControlPoint (7-tranche) must exit at Tranche O via DemoControlPoint build-in over LIGHT Draggable.

**Critical findings:**

- **[BLOCKER·gap]** proof:design-paint gate script absent — visual-truth oracle entirely missing
  - _ev:_ scripts/proof-design-paint.mjs: No such file or directory (verified live). M.W-DESIGN-PAINT.md S1 mandates the gate authored born-RED; M.W-DESIGN-PAINT.md:220 'Born-RED today (by construction). scripts/proof-design-paint
  - _→_ fold-into-wave · fold: Tranche-O W-DESIGN-PAINT-IMPL (BC-gated impl; S1 gate authoring is pre-BC and should open immediately)
- **[HIGH·gap]** proof:lighthouse-mobile posture is observe-only in CI — M.W15 S1 posture flip never executed
  - _ev:_ scripts/proof-lighthouse-mobile.mjs:71 declarePosture('observe-only', ...); ci.yml:824-827 step labelled '[HYGIENE · observe-only-in-CI]' runs proof:lighthouse-mobile WITHOUT KF_REQUIRE_LH=1. M.W15 S1 specifies the postu
  - _→_ fold-into-wave · fold: Tranche-O M.W15-S1-IMPL (BC-gated posture flip: declarePosture('hard') + SCENE_CEILINGS update post-BC)
- **[HIGH·gap]** proof:content-visibility-gated absent — off-screen rAF loop-pause mechanism unverified
  - _ev:_ scripts/proof-content-visibility-gated.mjs: No such file or directory (verified live). M.W15 S2 specifies this gate: asserts that contentvisibilityautostatechange fires correctly for off-screen previews (the event expose
  - _→_ fold-into-wave · fold: Tranche-O M.W15-S2-IMPL (conditional on Stage unshelf via DM-24 HANDOFF; if no cv:auto in BC-consumed demo, deferred to 
- **[HIGH·chronic]** DM-2 GlassControlPoint: 8-tranche DemoControlPoint build-in still un-built — P-inv-28 absolute terminus not met at M
  - _ev:_ deferred-ledger-M.md:132 DM-2 'ABSOLUTE terminus at M... no 8th ride.' proof:control-point-live is RED-BY-DESIGN (ZERO hits in glass-ui@4.0.0 dist — verified live). No DemoControlPoint composable or component exists anyw
  - _→_ fold-into-wave · fold: Tranche-O W-DEMO-CONTROL-POINT (build-in Option B: thin DemoControlPoint composable over LIGHT Draggable; retire proof:c
- **[HIGH·workaround]** S8 (FN_NAME Symbol workaround) + S9 (direct parse-that dep) permanently pending — VJ-L1/VJ-L3 absent from value.js 1.0.2
  - _ev:_ proof-workaround-deletion.mjs output: 'S8 PENDING — @mkbabb/value.js@0.14.0 is published but its VJ-L1 flatLeaf provenance API has NOT landed (value.js O shipped VJ-L2 only)'; 'S9 PENDING — VJ-L3 parseCSSSubValue helper 
  - _→_ handoff · fold: sibling-dispatch: value.js Tranche P (VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue); kf S8/S9 PENDING until shipped + consume

**Recommendations:**

- Author scripts/proof-design-paint.mjs immediately (pre-BC, born-RED by construction): implement the 8-scene pixel-readback oracle (animation-live transform-delta, colour-sample, glass-specular opacity, PRM rAF-stop check) per M.W-DESIGN-PAINT S1-S3. Add to package.json proof:design-paint and proof:correctness roster. The BC baseline lock (S4) fires post-BC; the script authoring is kf-internal and unblocked now.
- Execute DemoControlPoint build-in (DM-2 Option B) in Tranche O: author a thin DemoControlPoint composable over the LIGHT Draggable primitive (already in the barrel at src/animation/drag.ts). This closes the 8-tranche P-inv-28 mandate. Retire or re-point proof:control-point-live at the kf-built component.
- Wire proof:ci-coverage to track proof:design-paint and proof:content-visibility-gated as expected registered gates (even when scripts are absent today) so proof:ci-coverage exits 1 on their absence — making the born-RED status explicit in the automated gate roster rather than only in documentation.
- After glass-ui BC publishes (W-DOCK-MORPH-FAMILY + SegmentedTabs aria): execute M.W8 Phase-2 (delete :aria-orientation='undefined' at AnimationControls.vue:72 + SpringSidebar.vue:43; delete pointerHandled/onPlayPointerDown at TransportDock.vue in one atomic commit); flip proof:lighthouse-mobile posture from observe-only to hard-gate after updating SCENE_CEILINGS to post-BC actuals; also add sequence and motion-path scene floors (currently absent from SCENE_CEILINGS).
- Dispatch VJ-L1 (flatLeaf provenance API) + VJ-L3 (parseCSSSubValue helper) to value.js as explicit numbered asks (they were DEFERRED from value.js Tranche O / Constellation Campaign — no ask is on record in KF-TO-VALUEJS-O-ASKS.md for these). Until shipped, S8 (FN_NAME Symbol in utils.ts:45) and S9 (direct parse-that import at utils.ts:1) cannot be deleted.
- Extend proof:crayon-preserved parseColor to handle oklch(L C H) and color-mix(in <space>, ...) before the codebase migrates a keeper token to oklch — a one-time latent-brittleness fix with a red-if-unresolvable planted test per the D-3 measure-first discipline.
- Obtain the USER-DOMAIN taste-packet verdict on the l-w11 packet (docs/frontend-design/taste-packets/l-w11/manifest.json verdict: null) as a prerequisite for any Tranche-O design wave. Expand the taste packet generator to cover the 5 missing scenes (amiga, square, easing, sequence, motion-path) if Tranche O opens a design band touching those scenes.
- Unshelf the N Stage scene-switcher (DM-24) in Tranche O once glass-ui BC ships the dock redesign: merge the n-stage-impl branch content (SceneStage.vue, CarouselDisk.vue, StageArrows.vue, composables/, previews/), author proof:design-paint S5 Stage visual clause, and author proof:content-visibility-gated for the Stage previews' contentvisibilityautostatechange loop-pause mechanism.

---

## D17-demo-gate-red

The demo-gate RED items break into five distinct defects with different severities and dispositions. (1) proof:control-point-live is a born-RED tripwire now permanently stale: BC answered NO to GlassControlPoint (glass-ui/docs/tranches/BC/coordination/KF-BC.md:75), so the gate's closure mechanism can never fire. The gate must be retired and replaced with proof:demo-control-point targeting kf's own DemoControlPoint (M.W14 spec), but that gate is absent and DemoControlPoint is unimplemented. (2) proof:keyframes-vue-published clause (b) is a genuine USER-DOMAIN born-RED tripwire: artifact exists, peer floor is correct, only npm publish is missing. (3) proof:demo-usability hero word-gap (X-5 'Selectananimation') IS cured in source at AnimatedText.vue:29-30 with marginInlineEnd:0.25em. (4) proof:engine-no-throw-on-play and proof:subject-animates carry a structural defect in their lib probe servers: both route only two vendor files but value.js 1.0.2 is a chunked bundle (12 sub-chunks) and parse-that 0.11.0 is also chunked - sub-chunk fetches from /__kf-vendor__/ return 404, causing the engine import to fail. This is the source of the 'Failed to fetch' class of failure. (5) proof:lighthouse-mobile is correctly observe-only; posture flip is BC-gated by design (M.W15 S1).

**Critical findings:**

- **[BLOCKER·gap]** proof:control-point-live stale tripwire: BC confirmed NO to GlassControlPoint, gate premise is dead
  - _ev:_ scripts/proof-control-point-live.mjs:132-137 — gate asserts GlassControlPoint in glass-ui dist; glass-ui/docs/tranches/BC/coordination/KF-BC.md:75 — 'ANSWER: NO — BC ships NO standalone GlassControlPoint primitive'; defe
  - _→_ KILL · fold: O-W14 (retire proof:control-point-live; author proof:demo-control-point born-RED on the absent DemoControlPoint; build D
- **[BLOCKER·gap]** proof:demo-control-point absent: DemoControlPoint unimplemented, no gate authored
  - _ev:_ ls scripts/proof-demo-control-point.mjs -> ABSENT (verified); grep -rn 'DemoControlPoint' demo/ src/ -> zero results (verified); M.W14.md:307-336 specifies the gate + component; deferred-ledger-M.md DM-2 disposition: 'BU
  - _→_ handoff · fold: O-W14 (author proof:demo-control-point born-RED on absent kf-side DemoControlPoint; build DemoControlPoint.vue in demo/@
- **[HIGH·gap]** proof:engine-no-throw-on-play lib probe server breaks on value.js 1.0.2 chunked dist
  - _ev:_ scripts/proof-engine-no-throw-on-play.mjs:150-158 — VENDOR map routes only /__kf-vendor__/value.js -> node_modules/@mkbabb/value.js/dist/value.js; node_modules/@mkbabb/value.js/dist/ has 12 chunk files (color-8HC0QdRX.js
  - _→_ fold-into-wave · fold: O-W9 or O-W10 (fix VENDOR routing in both proof scripts to serve the full dist/ directory for value.js and parse-that, n
- **[HIGH·gap]** proof:subject-animates same vendor sub-chunk 404 defect as proof:engine-no-throw-on-play
  - _ev:_ scripts/proof-subject-animates.mjs:67-76 — identical VENDOR map with only two entries; same value.js 1.0.2 chunked dist issue applies; gate runs loadAnimationEngine() which triggers lazy imports of engine chunks that in 
  - _→_ fold-into-wave · fold: O-W9 or O-W10 (same fix as engine-no-throw probe server; serve the full dist/ tree for both value.js and parse-that vend

**Recommendations:**

- O-W14 (first action, gate-first): author proof:demo-control-point.mjs born-RED on the absent demo/@/components/custom/DemoControlPoint.vue; then build DemoControlPoint.vue over drag2D LIGHT primitive; then retire proof:control-point-live from ci.yml (remove the step and the check-failures entry); update ci.yml:1687 commentary to reflect the BC NO decision
- O-W9 or O-W10: fix the VENDOR routing in both proof-engine-no-throw-on-play.mjs and proof-subject-animates.mjs to serve the full dist/ directory tree for value.js and parse-that, not just the barrel entry file; the fix is extending the server to route /__kf-vendor__/value.js/* -> node_modules/@mkbabb/value.js/dist/* and /__kf-vendor__/parse-that/* -> node_modules/@mkbabb/parse-that/dist/*; this is a Constellation consume side-effect that was not addressed when upgrading to value.js 1.0.2 + parse-that 0.11.0
- O-WZ (USER-DOMAIN): owner runs npm publish --access public in packages/keyframes-vue/ to green proof:keyframes-vue-published clause (b); add the third born-RED-by-design echo to ci.yml:1687
- O-W15 (post-BC): flip proof:lighthouse-mobile from observe-only to hard-gate after updating SCENE_CEILINGS to BC-consumed actuals; remove KF_REQUIRE_LH=1 guard from CI step
- The hero word-gap (demo-usability X-5) is already fixed in AnimatedText.vue:29-30; no action needed on that specific clause — the gate should pass on a current dist build

---

## D18-ci-device-dependence

The __kf-lib__ live-library-probe failures in proof:engine-no-throw-on-play and proof:subject-animates are NOT device-dependence flakes: they are a systematic server architecture gap introduced by the M consume (value.js 1.0.0+). The vendor server at scripts/proof-engine-no-throw-on-play.mjs:150-158 and scripts/proof-subject-animates.mjs:67-76 serves exactly two files (/__kf-vendor__/value.js and /__kf-vendor__/parse-that.js), but value.js 1.0.0+ changed dist/value.js from a 146kB monolith to a 184-line barrel that imports 10+ hashed sub-chunks (units-*.js, math-*.js, gamut-*.js, etc.) via relative paths, and parse-that's dist/parse.js similarly imports parser-*.js/diagnostics-*.js sub-chunks. Browser requests for /__kf-vendor__/units-7DbE92xn.js etc. fall through to the demo-dist fallback (dist/gh-pages) which has no vendor directory — 404 — cascading into "Failed to fetch /__kf-lib__/compile-*.js" error. These failures are masked by the simultaneously-expected born-RED tripwires (peer-satisfied, control-point-live) that already red the demo-smoke job. The portable-gate discipline (ratio vs JSON.parse normalizer) is correctly applied in the observe-only perf gates (perf-frame-budget, bench-taxonomy, drawer-spring); the probe harness failure is not a portability problem but a structural server gap. The check-failures report-all step is 90-for-90 today but no automated gate enforces this bijection. DM-23 (apparatus over-engineering: 276 waitForTimeout, 30 withBrowser calls) is unaddressed by M.W3 (the shared-chromium migration) which remains OPEN.

**Critical findings:**

- **[HIGH·gap]** vendor sub-chunk server gap: value.js 1.0.0+ dist/value.js is a barrel, not a monolith — sub-chunks 404
  - _ev:_ scripts/proof-engine-no-throw-on-play.mjs:150-158 VENDOR map has only 2 exact entries; node_modules/@mkbabb/value.js/dist/value.js:1-11 imports ./units-7DbE92xn.js/./math-UeasWV-i.js/./gamut-d96RN38X.js/./color-8HC0QdRX.
  - _→_ fold-into-wave · fold: Tranche-O: the fix is to expand the probe vendor server to serve ALL sub-chunks of value.js and parse-that from their di

**Recommendations:**

- FIX the __kf-lib__ vendor server (HIGH — Tranche O): replace the two-entry exact-match VENDOR map in scripts/proof-engine-no-throw-on-play.mjs and scripts/proof-subject-animates.mjs with a directory-serving handler that maps /__kf-vendor__/value-vendor/* → node_modules/@mkbabb/value.js/dist/* and /__kf-vendor__/parse-that-vendor/* → node_modules/@mkbabb/parse-that/dist/*; update the importmap to point @mkbabb/value.js → /__kf-vendor__/value-vendor/value.js (and @mkbabb/parse-that similarly). This is a kf-owned fix (inv-16 OK). The fix is born-RED testable: the J.W1 b clause in proof:engine-no-throw-on-play currently fails ('probeError: Failed to fetch') and should go GREEN after the vendor prefix expansion.
- CORRECT the misattribution in project_constellation_campaign_shipped.md and M-CONSUME-CLOSE.md: the probe failures are NOT 'device-dependence flakes' but a systematic 404 from a server gap that predates any Linux-vs-macOS difference; the architectural cure is the vendor directory-serve expansion, not an observe-only posture
- ADD a proof:ci-coverage clause that machine-checks the bijection between demo-smoke step IDs and check-failures entries: parse the ci.yml demo-smoke steps for all 'id: proof-' entries and verify each appears in the check-failures block; this gates the currently-manual 90-entry correspondence from silently breaking on any future gate addition
- ADVANCE M.W3 (shared chromium migration) in Tranche O: DM-23 (apparatus over-engineering) is at risk of P-invariant-28 (≥4 tranches = no further punt); 30 withBrowser() calls × up to 3 retries = 90 potential cold Chromium launches per CI run drives the 50m timeout pressure; the durable fix is ONE shared Chromium instance + server reuse across the correctness-tier gates
- RE-MEASURE the 50m demo-smoke wall-clock after M additions: the K.W5 measure-first projection did not account for M's new gates (proof:css-parity, proof:packrat-sound, proof:consume-bundle, the 3 born-RED tripwires); run on a Linux runner with KF_REQUIRE_BROWSER=1 and record actual elapsed; update the timeout-minutes comment with the M-measured projection
- ADD an explanatory note to the check-failures step for proof:engine-no-throw-on-play and proof:subject-animates (similar to the peer-satisfied and control-point-live notes) identifying WHAT the expected red is and WHEN it will resolve — after the vendor sub-chunk fix, these notes become unnecessary and should be removed

---

## D19-deploy-roundtrip

The deploy round-trip is structurally intact but the AUTO path (CI -> deploy-pages.yml) is permanently blocked by two born-RED tripwires in check-failures: proof:keyframes-vue-published (USER-DOMAIN, DM-7) and proof:control-point-live (BC-gated, DM-2). Glass-ui 4.0.1 already fired proof:peer-satisfied GREEN (the previously documented "sole deploy blocker" was an inv-eps overclaim — there are TWO live blockers). The master branch carries all M consume commits (tranche-m == master at aef3ef3); the site was redeployed MANUALLY via scripts/pages-deploy.sh, not via the auto round-trip. The release.yml publish-keyframes-vue job is fully authored and sequenced but has never fired (USER-DOMAIN trigger). The CI dts SYMS set is stale (15 of 35 actual exports checked), but proof:published-surface's clause (b) covers the full manifest. The check-failures step carries a stale annotation referencing proof:peer-satisfied as born-RED even though it now passes. Tranche O's primary deploy unblock is the USER-DOMAIN keyframes-vue publish (DM-7); the auto round-trip cannot fire until that clears AND proof:control-point-live is resolved.

**Critical findings:**

- **[BLOCKER·gap]** proof:peer-satisfied now GREEN but two remaining born-RED tripwires permanently block auto CI round-trip
  - _ev:_ ci.yml:1595-1596: both proof-keyframes-vue-published and proof-control-point-live in check-failures; proof-keyframes-vue-published exits 1 (E404 verified live); proof-control-point-live exits 1 (ZERO GlassControlPoint in
  - _→_ handoff · fold: Tranche-O M.WZ
- **[HIGH·deferred]** DM-20 deploy round-trip observable not claimed: the CI->deploy-pages auto path never fired on master merge
  - _ev:_ deferred-ledger-M.md DM-20: 'deploy round-trip not yet observed at L close... preconditions: (1) proof:all GREEN M.W1; (2) proof:peer-satisfied GREEN; (3) USER-DOMAIN cut'; current state: (1) gates job GREEN, (2) peer-sa
  - _→_ handoff · fold: Tranche-O M.WZ
- **[HIGH·deferred]** M.W8 Phase-2 aria S1 + RF-17 S2 workaround deletions BC-gated, glass-ui 4.1.0 E404, P-inv-28 at 4 tranches
  - _ev:_ proof-workaround-deletion.mjs: S1 PENDING (AnimationControls.vue:72, SpringSidebar.vue:43 :aria-orientation); S2 PENDING (TransportDock.vue:15,151,196,342,348,358,361,366,373 pointerHandled/onPlayPointerDown); @mkbabb/gl
  - _→_ handoff · fold: Tranche-O M.W8

**Recommendations:**

- Execute the USER-DOMAIN keyframes-vue publish (DM-7) as M.WZ's first gating action. This is the sole unilateral action (Mike Babb, no sibling dependency) that clears one of the two permanent CI demo-smoke blockers. Until it publishes, the auto CI->deploy-pages.yml round-trip CANNOT fire regardless of other fixes.
- M.WZ must explicitly name the two current CI blockers (DM-7 keyframes-vue-published + DM-2 control-point-live) with their independent exit conditions. DM-7 clears on USER-DOMAIN publish; DM-2 clears on BC ship GlassControlPoint + kf re-pin OR on kf building DemoControlPoint (Option B) and re-tiering proof:control-point-live from check-failures to observe-only.
- Build DemoControlPoint (M.W14, Option B: kf-owned composable over the LIGHT Draggable) NOW as a BUILD-IN rather than waiting for glass-ui BC to ship GlassControlPoint. This would allow proof:control-point-live to be re-pointed at the kf-side component, turning it GREEN, which would clear the second CI blocker and unblock the auto round-trip independently of glass-ui BC timing.
- Update the check-failures stale annotation (ci.yml:1686) to remove the 'proof:peer-satisfied is born-RED' echo now that glass-ui 4.0.1 has cleared it. Replace with a current-state annotation naming only the two active born-RED tripwires (DM-7 + DM-2).
- Update the CI dts SYMS set (ci.yml:84) to include Oscillator and waveformValue at minimum, or retire this inline check in favor of deferring entirely to proof:published-surface which covers the full manifest. The comment '15 PUBLIC runtime symbols' and '14 light barrel exports' are stale at 35 actual exports.
- Before the 5.0.0 publish, bump the packages/keyframes-vue/package.json peer floor and devDependencies from >=4.3.0 to >=5.0.0 and add an npm install retry step or delay in release.yml's publish-keyframes-vue job to mitigate registry propagation lag.
- M.WZ FINAL must correct the 'sole deploy blocker' claim (M.WZ.md and the proof:peer-satisfied annotation) to accurately state TWO independent blockers with their exit conditions. Record that the actual live deploy at M close was MANUAL (pages-deploy.sh) and the auto round-trip observable (DM-20) has NOT been claimed.

---

## D20-oscillator-republish

The Oscillator (class + waveformValue + OscillatorConfig/OscillatorWaveform types) is fully implemented at src/animation/oscillator.ts and correctly enumerated on the LIGHT static barrel (index.ts:74-75). proof:boundary is GREEN — zero static value.js edge confirmed. The implementation gap is zero. The PUBLISH gap is real: npm@4.3.0 (published at K close, before L.W9) contains none of these exports; the current local dist/keyframes.js export line confirms Oscillator and waveformValue present locally but absent from the published tarball (verified by extracting the 4.3.0 tarball — its export line has zero Oscillator/waveformValue). No gate currently bites on the delta between local dist and published npm surface. The terminal home is the M.WZ version cut (5.0.0 or 4.4.0, USER-DOMAIN), which is itself unimplemented — proof:changelog-5.0.0 is explicitly noted as non-existent (ls scripts/proof-changelog* → no matches). The Oscillator is NOT a standalone Tranche O wave; it folds into the M.WZ version cut. However, two derivative risks exist: (1) glass-ui BC is already building a glass-ui-local useOscillator mirror as interim (WAVE-IMPACTS.md:470), which becomes a no-workaround precept violation the moment kf ships to npm; (2) the broader surface gap (drag2D, warmEngine, loadEngine/loadCompiler/loadIngest, KeyframesScrollTimeline — all L-tranche additive exports) shares the same publish-gap status and folds into the same version cut.

**Critical findings:**

- **[HIGH·gap]** Oscillator absent from npm@4.3.0 — publish gap confirmed
  - _ev:_ dist/keyframes.js (local build): export { … O as Oscillator … D as waveformValue } — present. Extracted /tmp/package/dist/keyframes.js from the 4.3.0 tarball: export line has NEITHER Oscillator NOR waveformValue. Tarball
  - _→_ fold-into-wave · fold: O.W-VERSION-CUT (M.WZ implementation — the 5.0.0/4.4.0 npm publish carries all L+M additive exports automatically; no st
- **[HIGH·gap]** No gate bites on local-dist > published-npm surface delta
  - _ev:_ scripts/proof-published-surface.mjs checks LOCAL dist/keyframes.js against docs/published-surface.md manifest (both contain Oscillator) — gate PASSES. No gate reads the npm registry to assert 'Oscillator exists on the pu
  - _→_ fold-into-wave · fold: O.W-VERSION-CUT (the version cut itself closes the gap; a born-RED 'local-ahead-of-npm' gate is optional hardening but t
- **[BLOCKER·deferred]** proof:changelog-5.0.0 gate is unauthored — M.WZ wave unimplemented
  - _ev:_ docs/tranches/M/waves/M.WZ.md:13: 'proof:changelog-5.0.0 — does NOT exist today (ls scripts/proof-changelog* → no matches)'. M.WZ.md:92: 'proof:changelog-5.0.0 is the missing gate, authored here'. .github/workflows/relea
  - _→_ fold-into-wave · fold: O.W-VERSION-CUT (M.WZ implementation is the first Tranche O wave; authors proof:changelog-5.0.0, bumps package.json, wir
- **[HIGH·workaround]** glass-ui BC building a glass-ui-local useOscillator mirror as interim workaround
  - _ev:_ glass-ui/docs/tranches/BC/research/WAVE-IMPACTS.md:470: 'Idle/loop motion = the Oscillator (osc.tick(dtSec)→.phase/.value→shader uniform) — BLOCKED on a kf republish; interim is a glass-ui-local useOscillator mirror (the
  - _→_ handoff · fold: O.W-VERSION-CUT → BC must delete useOscillator mirror on their kf re-pin (BC.W-CUT Band 10); the kf publish is the unblo
- **[HIGH·gap]** 8 additive LIGHT exports absent from npm@4.3.0 share the same publish-gap
  - _ev:_ Comparing published tarball export line vs local dist: missing from 4.3.0 — KeyframesScrollTimeline (L.W8 S4 canonical rename), drag2D (L.W5 S4), warmEngine (L.W7 S1), loadEngine/loadCompiler/loadIngest (L.W7 S3), wavefo
  - _→_ fold-into-wave · fold: O.W-VERSION-CUT (single version cut ships all 8 missing exports atomically)

**Recommendations:**

- Make the M.WZ version cut (5.0.0 or 4.4.0) the FIRST wave of Tranche O: author proof:changelog-5.0.0, bump package.json to 5.0.0 (or 4.4.0 per USER-DOMAIN decision), wire the gate into release.yml before the publish step, advance keyframes-vue peer floor to >=5.0.0, push the v5.0.0 tag. This single wave atomically ships all 8 missing LIGHT exports (Oscillator, waveformValue, drag2D, warmEngine, loadEngine, loadCompiler, loadIngest, KeyframesScrollTimeline) and unblocks BC.W-MOTION-ONE-CLOCK/BC.W-VIZ-CHOREOGRAPHY.
- Re-open DLL-28 in the Tranche O deferred-ledger with disposition 'source-LANDED, npm-PENDING → terminal home O.W-VERSION-CUT'. The current L/M ledger 'SHIPPED' close is premature — it conflates source-land with npm-publish and the BC docs explicitly identify the published 4.3.0 as absent. Close the row ONLY after the 5.0.0 tarball is confirmed on the registry.
- Add a proof:npm-surface gate (or extend proof:published-surface clause (b)) to compare 'exports enumerated in local dist/keyframes.js' against 'exports in the installed node_modules/@mkbabb/keyframes.js/dist/keyframes.js' — so a future source-land-but-not-published gap cannot recur silently. This gates on the installed version resolving from the registry, not from a file: link.
- Coordinate with glass-ui BC: once kf 5.0.0 lands, glass-ui BC must delete the glass-ui-local useOscillator mirror (WAVE-IMPACTS.md:470) on their BC.W-CUT re-pin. Wire this as an explicit cross-repo handoff row in the O deferred-ledger pointing at BC.W-CUT.
- Scope the KF-OSCILLATOR demo scene as a Tranche O wave (tentatively O.W-DEMO-OSCILLATOR), gated on (a) the 5.0.0 publish and (b) BC's W-EASING-PRIMITIVE consume signal confirming the API shape. If the BC signal arrives before the O scene wave, evolve the oscillator.ts API accordingly (OscillatorConfig shape, output range). The demo scene should use the BARREL import path (not @src/animation/oscillator) to exercise the published surface.
- Advance the proof:keyframes-vue-published PEER_FLOOR constant from '4.3.0' to '5.0.0' (scripts/proof-keyframes-vue-published.mjs:63) and update packages/keyframes-vue/package.json peerDependencies['@mkbabb/keyframes.js'] to '>=5.0.0' before the version cut. These are inert doc/gate changes that must precede the publish to keep proof:keyframes-vue-published clause (c) correct post-cut.

---

## E21-kf-engine-perf

The keyframes.js engine hot path is structurally sound: binary search O(log N), stable-key null-fill (no delete), single-frame flatVars alias, hoisted _interpOut buffer, sync fast-path in RAFPlayback._run (J.W6 S1), and the AnimationGroup _grouped buffer with V8-safe null-fill. The SoA lerpArray path for NumericAnimation and SpringProgress vector sugar shipped in L.W7. Three genuine performance gaps surface in Tranche O scope: (1) the `lerpArray` inline in `internal/leaves.ts` is a proven workaround — value.js 1.0.2 (installed) ships `@mkbabb/value.js/math` with `lerpArray`/`lerp`/`clamp` but kf has NOT consumed the deletion; the inline is live and the workaround-deletion gate S8/S9 are PENDING; (2) `transformTargetsStyle` calls `unflattenObjectToString(vars)` without passing an `out` buffer on each rAF frame, allocating a fresh `Record<string,string>` per frame on the DOM-write path; the value.js API supports an `out` parameter that would make this zero-alloc; (3) a residual O(N) `this.frames.findIndex` scan remains inside `reconcileVars` for already-compiled frames despite the `buildVarIndex` O(1) pre-index — the inner findIndex is a compile-time cost only but degrades large-stop animations. The color-math VJ.L1–L8 dispatches are correctly staged as cross-repo; the EPF-1 ingest thrash is compile-time-only (not per-frame); the `bench/sync-step.bench.ts` is absent from `bench/taxonomy.json`.

**Critical findings:**

- **[HIGH·workaround]** lerpArray inline in leaves.ts is a live workaround — value.js 1.0.2 ships ./math subpath but kf has NOT consumed the deletion
  - _ev:_ src/animation/internal/leaves.ts:68-80 — 12-line lerpArray copy with comment 'value.js exposes ONLY its barrel export — no tree-shakeable ./math subpath'; node_modules/@mkbabb/value.js/dist/subpaths/math.d.ts:7 exports `
  - _→_ fold-into-wave · fold: Tranche-O M.W9 (workaround-deletion wave)

**Recommendations:**

- CONSUME value.js ./math subpath to delete lerpArray inline in leaves.ts: update src/animation/internal/leaves.ts to `export { lerpArray } from '@mkbabb/value.js/math'` and update src/animation/numeric.ts to import from value.js/math. Add a proof:workaround-deletion arm for the lerpArray inline (separate from S8/S9). Verify proof:boundary still passes (the ./math subpath must not import the CSS grammar). This is a standalone atomic change — not blocked by S8/S9.
- Add a reused `out` buffer to transformTargetsStyle to eliminate the per-frame unflattenObjectToString allocation: hoist a module-scope `const _styleOut: Record<string, string> = {}` and pass it as the second argument on the apply path. Gate with a proof:standalone-zero-alloc extension that asserts zero fresh objects created during the DOM-write phase of a 60-frame steady window.
- Fix the residual O(N) this.frames.findIndex inside reconcileVars (frame-compiler.ts:418) by building a Map<string,(startIx+endIx)> index alongside buildVarIndex so the already-compiled frame lookup is O(1). Add a bench case at N=1000 stops to make the quadratic regression observable. The CF-2 guard claimed O(N) reconcile but the inner scan defeats it.
- Add bench/sync-step.bench.ts to bench/taxonomy.json suites array with classifications: drive(SmoothProgress) and drive(SpringProgress) as run-check; play(Animation·K=8) and play(AnimationGroup·32cells) as observe-only. This closes the lane-29 Gap 1 that has been open through the M close.
- Author bench/color-interp.bench.ts with cases for `fromString('from{background-color:red}to{background-color:blue}').interpFrames(500,false)` and an oklab variant, categorized observe-only. Add to taxonomy.json. This gives kf-side baseline to validate VJ.L1–L8 value.js cross-repo dispatches once those APIs ship.
- Author a bench/numeric-soa.bench.ts suite measuring NumericAnimation.at() at K∈{2,5,12,32} over a 600-frame window, add to taxonomy.json as observe-only, and cross-check against the G-era 1.56× minimum. This closes lane-29 Gap 2 and makes the L.W7 S2 SoA claim verifiable kf-side.
- File VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) as explicit asks to value.js next tranche — they were NOT shipped in value.js 1.0.2 despite the constellation campaign closing. S8 and S9 in proof:workaround-deletion cannot close until these APIs exist. These are P-invariant-28 carries entering a second tranche.

---

## E22-demo-modern-web

The demo's modern-web alignment is substantially complete for the M-era deployed tree. View Transitions ride `startViewTransition` from glass-ui's `motion-core` with a `view-transition-name: scene-subject` on the scene host, a SpringProgress fallback for non-VT engines, and focus routing on `finished` — all implemented. The `proof:modern-web` gate (7 clauses, including checklist disposition rows) is authored and CI-wired in `proof:hygiene`. `proof:consume-bundle` EXISTS at `scripts/proof-consume-bundle.mjs` and is in `proof:hygiene` — counter to the M.W15 born-RED claim (M-RECONCILIATION §9 says it is absent, but the script is present on the current tree). The two BC-gated M.W15 gaps that remain genuinely open: (1) `proof:lighthouse-mobile` is `observe-only` in CI, never reds on a ceiling miss without `KF_REQUIRE_LH=1`, and the two un-ceilinged scenes (sequence, motion-path) remain uncovered; (2) `proof:design-paint` (the pixel-readback visual-truth gate) is entirely absent from `scripts/`; (3) `proof:content-visibility-gated` is absent — no gate verifies that the Monaco-pane `content-visibility: hidden` caching or any other cv usage behaves correctly. The VT implementation lacks `view-transition-class` or `:active-view-transition-type` for directional scene-swap semantics (only the cross-fade, no per-direction curve fork), but glass-ui's `view-transition.css` and `gl-list-item` group recipe are available and unused in the demo.

**Critical findings:**

- **[HIGH·gap]** proof:lighthouse-mobile posture is still observe-only in CI — never reds on ceiling miss
  - _ev:_ scripts/proof-lighthouse-mobile.mjs:71 — `declarePosture("observe-only", ...)`. CI step at .github/workflows/ci.yml:826 runs without `KF_REQUIRE_LH=1`. M.W15.md §S1 identifies this as the born-RED posture breach.
  - _→_ fold-into-wave · fold: M.W15 S1 (posture flip to hard-gate, BC-gated floor update required)
- **[HIGH·gap]** proof:design-paint is entirely absent — no pixel-readback visual truth gate exists
  - _ev:_ No `scripts/proof-design-paint.mjs` exists. `ls /Users/mkbabb/Programming/keyframes.js/scripts/proof-design-paint.mjs` → not found. `proof:design-paint` does not appear in `package.json` in any tier. M.W-DESIGN-PAINT.md 
  - _→_ fold-into-wave · fold: M.W-DESIGN-PAINT S1 (author gate-first, BC-gated baseline lock)

**Recommendations:**

- For Tranche O: author proof:design-paint gate-first (born-RED by absence) per M.W-DESIGN-PAINT §S1 before any BC consume lands. Gate should check zero-delta transform between frames (animation live), non-blank pixel at landmark regions, and glass specular ::before opacity in hover state — NOT source greps.
- For Tranche O (pre-BC): flip proof:lighthouse-mobile posture from 'observe-only' to 'hard' in scripts/proof-lighthouse-mobile.mjs:71 after updating SCENE_CEILINGS to include sequence and motion-path at BC-consumed actuals. Remove the KF_REQUIRE_LH env-var gate since posture becomes always-hard.
- For Tranche O (pre-BC — already authored but needs CI registration check): confirm proof:consume-bundle is correctly in proof:hygiene and not in proof:correctness (it is a node gate). Update M-RECONCILIATION §9 and M.W15 §S3 to note this gate is SHIPPED, not born-RED by absence.
- For Tranche O: add sequence and motion-path to SCENE_CEILINGS in proof-lighthouse-mobile.mjs after measuring BC-consumed actuals on a calibrated runner. Document the measured floors; do not guess.
- For Tranche O: upgrade the VT scene-swap to pass transition `types` (e.g. 'forward'/'back' based on scene index delta) through startViewTransition from glass-ui/motion-core. Then author `:active-view-transition-type(forward)` / `:active-view-transition-type(back)` asymmetric curve rules in the demo's scoped CSS, reusing glass-ui's `--spring-bouncy` token. This removes the symmetric cross-fade and delivers directional scene-swap motion.
- For Tranche O: add a browser clause to proof:modern-web UX1 (View Transitions) that drives a nav and confirms the VT pseudo-tree fires (use page.evaluate to check document.startViewTransition !== undefined AND probe a canary element's computed transition state), not just a source needle check.
- For Tranche O: surface LoAF entries from loaf-observer.ts to a gate that asserts no interaction-initiated LoAF exceeds the INP budget (200ms), or fold LoAF data into the proof:scene-transition-perf gate's p95 budget reporting.
- For Tranche O close docs: correct M-RECONCILIATION.md §9 and M.W15 §S3 to record proof:consume-bundle as SHIPPED (not born-RED by absence) — it is present at scripts/proof-consume-bundle.mjs and in proof:hygiene on master.

---

## E23-demo-frontend-design

The five demo scenes (cube, amiga, square, spring, easing) plus sequence and motion-path are in strong shape after L.W11 and J.W7a/W12 design passes: every scene has at least one on-aesthetic easter egg, instructional affordance text, and the shared glass-card (I5) protagonist plate. The design system is cohesive — design-idioms.css owns the rainbow family, the `.progress-ball`/`.progress-rail` idiom is canonicalized, per-scene `--ball-tone` tokens give each scene its hue-voice, and PRM brackets are present everywhere. However three categories of gap remain: (1) the proof:design-paint gate (M.W-DESIGN-PAINT) is completely absent — zero visual-truth oracle for any scene; (2) M.W15 Lighthouse floors are observe-only in CI; (3) the N Stage scene-switcher aesthetic (11-stage STAGE-SPEC) is shelved on n-stage-impl with no master path, pending glass-ui BC dock redesign. The OrbitalDrag component on the cube has a crude `cursor: move` instead of the grab/grabbing idiom that amiga and square correctly use, a minor affordance inconsistency. The easing Gallery egg is hidden behind an undiscoverable double-click on the bezier canvas with zero hint shown to the user even after a successful interaction — the square's progressive tumble-hint pattern is not mirrored here. Sequence has a discoverable Reel button but the hidden typed "reel" affordance is not hinted anywhere.

**Critical findings:**

- **[BLOCKER·gap]** proof:design-paint gate is completely absent — zero visual-truth oracle for all 8 scenes
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/docs/tranches/M/waves/M.W-DESIGN-PAINT.md:86-99 — 'scripts/proof-design-paint.mjs does not exist today. node scripts/proof-design-paint.mjs → file-not-found / exit 1. Born-RED by co
  - _→_ fold-into-wave · fold: M.W-DESIGN-PAINT (S1 gate-authoring, BC-gated baseline lock S4)
- **[HIGH·chronic]** M.W15 Lighthouse posture is observe-only in CI — ceiling misses are never failures
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/docs/tranches/M/waves/M.W15.md:82-88 — 'In CI (without KF_REQUIRE_LH=1): ceiling misses are RECORDED-WITHHELD, not failures.' Current SCENE_CEILINGS include sequence and motion-path
  - _→_ fold-into-wave · fold: M.W15 S1 (posture flip: observe-only → hard, post-BC)
- **[HIGH·deferred]** N Stage scene-switcher aesthetic shelved on n-stage-impl; 4 commits of impl exist but no path to master
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/docs/tranches/N/STAGE-SPEC.md:1-120 (the 11-atomic-stage spec); git log shows commits b271fa1, f14e943, 8606eec on n-stage-impl with `demo/@/components/custom/scene-stage/` tree (Sc
  - _→_ handoff · fold: Tranche O (DM-24 unshelf → N impl rebuild per STAGE-SPEC, post glass-ui BC)

**Recommendations:**

- Author scripts/proof-design-paint.mjs as the born-RED visual-truth oracle (M.W-DESIGN-PAINT S1) before any other design wave. Use the per-scene check matrix (S2): colour sample at ball centre, animation-live delta-frame transform, glass specular opacity. This is the most critical gap: no current gate bites visual failures.
- Flip proof:lighthouse-mobile posture from observe-only to hard-gate post-BC (M.W15 S1): change `declarePosture('observe-only', …)` to `declarePosture('hard', …)`. Also register sequence and motion-path in SCENE_CEILINGS (currently absent — `if (ceiling == null) continue` silently skips them).
- Fix OrbitalDrag cursor from `cursor: move` to `cursor: grab` with an `:active { cursor: grabbing }` rule — this is the idiomatic direct-manipulation cue. The current `move` cursor signals repositioning, not 3D rotation. One 2-line CSS change in OrbitalDrag.vue:328-333.
- Add progressive-disclosure hints for the dblclick easter eggs that currently have no hint: (a) easing Gallery — show 'double-click to tour' in the sidebar after the first bezier handle drag completes (mirror square's tumbleHintShown pattern); (b) cube Roll — show 'double-click to roll' in the cube-attitude readout area or as a legend after the first orbital drag completes; (c) amiga Boing — show a brief 'double-click to boing' whisper after the first spin-settle. These are Tranche O refinements, not blockers.
- For the N Stage scene-switcher (DM-24 HANDOFF): do NOT rebase the n-stage-impl branch onto master until glass-ui BC publishes the dock redesign (ASK-3). The STAGE-SPEC (11 atomic stages) is the correct rebuild plan. When the BC dock fires the DM-24 tripwire, rebuild the Stage impl one atomic stage at a time, each measurement-verified via Chrome DevTools MCP before advancing — the 'SLOW and WRONG' verdict on the current impl must be resolved by the STAGE-SPEC methodology, not by merging the current WIP.
- Register proof:consume-bundle (M.W15 S3) immediately — it is NOT BC-gated and gates the published dist tree-shaking. Author scripts/proof-consume-bundle.mjs: bundle a LIGHT-surface consumer from dist/keyframes.js with rolldown, assert zero value.js / engine.ts modules in the output. This is pre-BC work that can green now.
- For the Sequence Reel button: add an aria-description or tooltip 'or type reel' on the Clapperboard button (SequenceTarget.vue:31-38) to make the hidden typed trigger discoverable. This is a LOW-priority Tranche O refinement — the button exists as the discoverable twin, but exposing the keyboard shortcut improves the 'one on-aesthetic easter-egg per scene' contract.

---

## E24-constellation-perf

The "+23-30% SOTA via dispatch table + byte scanners" claim is real and gate-verified — value.js proof:perf-target uses a JSON.parse ratio normaliser (value/json >= 0.0100, sheet/json >= 0.0200) that is machine-independent by design, with the A/B numbers (4.55->5.6 MB/s value-parser, 9.40->12.0 MB/s stylesheet) documented in the gate script. However, the gate itself is NOT wired to value.js CI (proof:perf-target and proof:gamut-alloc are absent from ci.yml's npm run steps) — only the older, ABSOLUTE-threshold bench scripts (color-channel-access.mjs L8 >=5x, color2-direct-paths.mjs HSL->RGB >=2x, parser-namelookup.mjs nameParser >=5x) run in CI via shell-grep on stdout. The parse-that SpanParser tagged-union was faithfully measured and FALSIFIED (10-14% slower on V8/TS), correctly retired and re-scoped to codegen foundation, which is the honest MEASURE-FIRST outcome. The keyframes.js side uses ratio-relative floors (baselineCase x floorFraction) with declarePosture("observe-only") for all budgeted arms in CI — the gold standard. The main open risk: three value.js VJ-L1/L3 workarounds (FN_NAME Symbol, linear() regex, direct parse-that dep in kf utils.ts) are still live pending value.js 0.14.0 publication; the color interpolation hot path (VJ.L1-L8 per-frame allocs in oklab/mixColors/gamutMap) is entirely un-measured kf-side; and sync-step.bench.ts is not covered by the taxonomy manifest.

**Critical findings:**

- **[HIGH·gap]** proof:perf-target and proof:gamut-alloc are NOT wired to value.js CI
  - _ev:_ /Users/mkbabb/Programming/value.js/.github/workflows/ci.yml:165-181 — 'npm run bench | tee bench-output.txt' only runs color-channel-access.mjs + color2-direct-paths.mjs + parser-namelookup.mjs + computed-endpoint.mjs; n
  - _→_ fold-into-wave · fold: Tranche-O W1 (value.js CI hardening)
- **[HIGH·gap]** Color interpolation hot path (VJ.L1-L8: transformMat3/oklab2xyz/mixColors/gamutMap) entirely un-measured kf-side; cross-repo dispatch filed but value.js 0.14.0 un-published
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/bench/taxonomy.json:264-313 — VJ.L1-L8 marked 'cross-repo'; /Users/mkbabb/Programming/keyframes.js/docs/tranches/M/audit/lane-29-perf-numbers.md:239-259 — 'Every animation frame tha
  - _→_ fold-into-wave · fold: Tranche-O consume wave (after value.js 0.14.0 publishes)
- **[HIGH·workaround]** VJ-L1/L2/L3 workarounds still live in keyframes.js utils.ts — FN_NAME Symbol stamp, linear() regex, direct @mkbabb/parse-that production dep
  - _ev:_ /Users/mkbabb/Programming/keyframes.js/src/animation/utils.ts:1,45-57 — 'import { any as parseAny } from "@mkbabb/parse-that"'; 'const FN_NAME = Symbol("kf.fnName")'; /Users/mkbabb/Programming/keyframes.js/docs/tranches/
  - _→_ fold-into-wave · fold: M.W9 (value.js Tranche-O consume, blocked on 0.14.0 publish)

**Recommendations:**

- Wire proof:perf-target and proof:gamut-alloc into value.js CI (ci.yml) with observe-only posture on the slow Linux runner — they are currently scripted but entirely absent from the CI job matrix.
- Adopt value.js ci-env.mjs equivalent (IN_CI + declarePosture) for the bench gate steps in ci.yml; the current shell-grep on stdout absolute-threshold pattern (L8>=5x, HSL->RGB>=2x) is device-dependent and will flake RED on a slow runner without a posture declaration.
- Add bench/sync-step.bench.ts to bench/taxonomy.json suites[] with four run-check classifications — closes the proof:bench-runs vs proof:bench-taxonomy coverage gap.
- Author bench/color-interp.bench.ts (color interpolation integration bench at K=1 color stop, observe-only) as the kf-side measurement instrument for value.js VJ.L1-L8 post-repin validation; the cross-repo dispatch is correct but there is currently zero kf-side throughput signal for the oklab/mixColors/gamutMap hot path.
- Track M.W9 (VJ-L1/L2/L3 workaround deletions: FN_NAME Symbol, linear() regex, direct parse-that dep) against value.js 0.14.0 publication; once published, execute the atomic re-pin + workaround-deletion commit and confirm proof:workaround-deletion S7+S8+S9 GREEN.
- Add NumericAnimation.at() bench suite (bench/numeric-soa.bench.ts, K in {2,5,12,32}, observe-only) to close the G-era citation gap in L.W7.md:24 — the 1.56x-4.25x numbers are value.js-internal, not kf-measured.
- Dispatch to parse-that Tranche B: wire span-dispatch.bench.ts into parse-that CI with a budget assertion (the bench exists and runs locally but is never gated in CI — inv-16 prevents kf from writing parse-that's CI).

---

## F25-chronic-deferrals

The constellation's chronic-deferral landscape is largely well-governed by P-invariant-28, with 20 tracked DM rows each carrying a named terminal disposition. The most critical finding for Tranche O is that four of the five DM rows gated on sibling publishes remain PENDING: DM-1 (RF-17, 4-tranche) and DM-5 (S1/S2/S8/S9 workarounds) are BC-gated, while DM-8's S8 (FN_NAME Symbol) and S9 (direct parse-that dep) are gated on value.js VJ-L1/VJ-L3 which O has NOT shipped — confirmed by live probe showing value.js@1.0.2 lacks `flatLeaf`/`parseCSSSubValue`. DM-2 (GlassControlPoint, 7-tranche) has a clear BC decision (NO GlassControlPoint; kf builds DemoControlPoint) but M.W14 has not been executed — both the `DemoControlPoint` component and the `proof:demo-control-point` gate are absent. DM-3 (MorphSVG, 7-tranche) similarly has a clear BUILD-IN path over published `PathGeometry` but remains unbuilt. The phi-ladder A→B→C lineage terminated GENUINELY at H (CH-2 typography, confirmed GREEN, NOT re-litigated). The Oscillator LOCAL-ONLY issue is a real gap: it is in the local dist but absent from the published 4.3.0 tarball, making every downstream BC consume-seam reference to KF-OSCILLATOR a spec against vapor.

**Critical findings:**

- **[HIGH·deferred]** DM-1 RF-17 (4-tranche) — PENDING, BC-gated, P-inv-28 belt ACTIVE
  - _ev:_ demo/@/components/custom/animation-controls/TransportDock.vue:15,151,196,342,348,358,361,366,373 — onPlayPointerDown/pointerHandled workaround confirmed PRESENT; proof:workaround-deletion S2=PENDING (live run 2026-06-19)
  - _→_ handoff · fold: Tranche-O wave: kf consumes glass-ui BC cut (BC.W-DOCK-ENGINE + useDockClickIntegrity) → delete S2 arm + verify proof:wo
- **[HIGH·gap]** DM-2 GlassControlPoint (7-tranche) — decision made (NO), but build-in NOT executed
  - _ev:_ proof:control-point-live → RED (GlassControlPoint ABSENT from glass-ui@4.0.1 dist, confirmed live). KF-INBOUND.md:16 'ANSWER: NO — kf closes the chronic by building its own DemoControlPoint'. M.W14.md:24 'a DemoControlPo
  - _→_ fold-into-wave · fold: Tranche-O M.W14 execution: build DemoControlPoint composable over LIGHT Draggable in demo/@/; author proof:demo-control-
- **[HIGH·gap]** DM-3 MorphSVG (7-tranche) — BUILD-IN path clear but fromMorphSVG unbuilt, gate absent
  - _ev:_ grep -rn 'fromMorphSVG|MorphSVG' src/ → ZERO. ls scripts/proof-morphsvg-consume.mjs → ABSENT (module not found error confirmed). deferred-ledger-M.md §2b DM-3: 'BUILD-IN over the ALREADY-PUBLISHED value.js 0.13.0 PathGeo
  - _→_ fold-into-wave · fold: Tranche-O M.W14 execution: author proof:morphsvg-consume born-RED; build fromMorphSVG(from,to,t) over published PathGeom
- **[HIGH·workaround]** DM-5 S8/S9 workarounds (FN_NAME Symbol, direct parse-that dep) — VJ-L1/VJ-L3 NOT shipped in value.js 1.0.2
  - _ev:_ proof:workaround-deletion S8=PENDING, S9=PENDING (live run). S8 comment: '@mkbabb/value.js@0.14.0 is published but its VJ-L1 flatLeaf provenance API has NOT landed (value.js O shipped VJ-L2 only)'. grep flatLeaf|parseCSS
  - _→_ handoff · fold: Tranche-O coordination: VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) must be filed as explicit as
- **[HIGH·gap]** Oscillator LOCAL-ONLY — absent from published 4.3.0 tarball despite being in local dist and kf barrel
  - _ev:_ curl 4.3.0.tgz | grep -c Oscillator → 0 in both keyframes.js and keyframes.d.ts. Local dist/keyframes.js exports Oscillator (confirmed). src/animation/index.ts:74-75 exports Oscillator/waveformValue. KF-INBOUND.md:20: 't
  - _→_ handoff · fold: Tranche-O USER-DOMAIN: publish the Oscillator-containing kf release (5.0.0 cut per DM-16) so BC consume-seams can land; 

**Recommendations:**

- Execute DM-2 (DemoControlPoint) and DM-3 (fromMorphSVG) as the FIRST Tranche-O impl actions — both are 7-tranche P-inv-28 absolute-terminus items with clear specs (M.W14) and no sibling-publish dependency. DemoControlPoint goes in demo/@/; fromMorphSVG goes in src/animation/. Both gates (proof:demo-control-point, proof:morphsvg-consume) must be authored born-RED before any impl line is written.
- File explicit value.js asks for VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) as the HIGHEST-PRIORITY cross-repo asks — or architect their elimination without those APIs (e.g., restructure utils.ts to not need a Symbol sidechannel, eliminating S8). The current S8/S9 workaround state (PENDING since constellation launch) is the longest-running open workaround that value.js O DID NOT address.
- Execute the M.WZ USER-DOMAIN close actions as a single atomic event: (a) npm publish packages/keyframes-vue --access public [DM-7]; (b) version cut 4.x→5.0.0 with FOUR documented breaking changes [DM-16 viol-M4]; (c) rebuild dist including Oscillator and publish so BC consume-seams can land [Oscillator LOCAL-ONLY gap]. These three are interdependent and compose into one release motion.
- Re-point proof:chronic-closure CHRONIC_LEDGER constant (scripts/proof-chronic-closure.mjs:114) from docs/tranches/L/PROGRESS.md to docs/tranches/M/PROGRESS.md as the M.WZ substrate transition, and populate M/PROGRESS.md with the DM-row substrate from deferred-ledger-M.md §2. Run the non-vacuity planted-probe (three deliberately-malformed rows, then clean) before the final proof:chronic-closure exit-0 pass.
- The phi-ladder A→B→C chronic is genuinely closed (CH-2 terminated at H via proof:phi-leaf-zero + proof:hero-rung). Tranche O should re-verify proof:font-census on the M dist (DM-10) without re-litigating the typography design — the SYSTEM gate was honest and the user did not re-surface this in I/J/K/L feedback.
- Coordinate the BC execution greenlight with M.W8 Phase-2 (S1+S2 deletion) as a dependency graph: BC must execute BC.W-TABS-IOS (S1 cure) and BC.W-DOCK-ENGINE/useDockClickIntegrity (S2/RF-17 cure) and publish, THEN kf executes the atomic re-pin + workaround deletion. The no-workaround precept forbids carrying S1/S2 to a 5th tranche.

---

## F26-recent-deferrals

The M reconciliation correctly identified DM-24/DM-25/DM-W1-bridge as new ledger rows to add, but the §11 edit-spec was authored as DOCS-ONLY and those additions were never executed — neither PROGRESS.md §D nor deferred-ledger-M.md §2e carries those rows in the live tree. The M-RECONCILIATION.md §7/§9 intent is clear but the ledger state is stale. proof:consume-bundle (DM-25 closure oracle) is already GREEN on the live tree making DM-25 a born-closed item that still lacks a ledger record. VJ-L1 (flatLeaf) and VJ-L3 (parseCSSSubValue) were explicitly DEFERRED from value.js O and are absent from the published 1.0.2; S8 and S9 workarounds are therefore structurally blocked, need a value.js future-tranche owner or an alternative close path. The Oscillator was shipped in L.W9 (commit 791b3bd) but the 4.3.0 npm tag (4737ab3) predates it — the library export is LOCAL-ONLY, absent from the registry, and rides the BC-gated 5.0.0 cut with no independent deferral row. M.W8 Phase-2 (S1 aria + S2 RF-17), M.W-DESIGN-PAINT, M.W15, and M.WZ remain BC-gated; glass-ui BC is in EXECUTION at tier 11.5 of 28 tiers (dock DONE, tabs-ios DONE, but CUT at tier 27 still pending). M.WZ was recorded as "deployed" in M-CONSUME-CLOSE.md via the manual CF Pages deploy, but the formal gate-based round-trip observation (the CI→deploy→live-bytes chain with a recorded hash) is not yet closed. keyframes-vue@0.1.0 (DM-7) remains E404 in the npm registry.

**Critical findings:**

- **[HIGH·gap]** DM-24/DM-25/DM-W1-bridge ledger rows authored in M-RECONCILIATION but never inserted into live docs
  - _ev:_ docs/tranches/M/M-RECONCILIATION.md:§7,§9 specifies DM-24 (N Stage HANDOFF) and DM-25 (consume-bundle gate) as new rows to add to deferred-ledger-M.md §2e and PROGRESS.md §D; grep -c 'DM-24\|DM-25\|DM-W1' deferred-ledger
  - _→_ fold-into-wave · fold: O.W0 (or the M.WZ pre-requisite ledger-sync wave) — insert DM-24/DM-25/DM-W1-bridge rows into deferred-ledger-M.md §2e a
- **[HIGH·deferred]** VJ-L1 (flatLeaf provenance) and VJ-L3 (parseCSSSubValue) DEFERRED from value.js O — S8/S9 workarounds have no published consume-edge or alternative close path
  - _ev:_ scripts/proof-workaround-deletion.mjs:150-154,260-274 checks 'flatLeaf' in vjs and 'parseCSSSubValue' in vjs; both return false on installed value.js 1.0.2 (node_modules/@mkbabb/value.js/dist/index.d.ts: neither symbol p
  - _→_ handoff · fold: O.W9 (the value.js O consume wave) — requires either: (a) a value.js future tranche (P or beyond) that ships flatLeaf + 
- **[HIGH·gap]** Oscillator is LOCAL-ONLY: shipped in L.W9 (commit 791b3bd) after the 4.3.0 npm tag (4737ab3) — absent from the published registry; no dedicated deferral row exists
  - _ev:_ git show v4.3.0:src/animation/oscillator.ts → 'fatal: path does not exist in v4.3.0'. git log --oneline master -- src/animation/oscillator.ts → 791b3bd (L.W9, after 4.3.0). npm pack @mkbabb/keyframes.js@4.3.0 --dry-run →
  - _→_ fold-into-wave · fold: O.WZ (or a dedicated O.W-OSCILLATOR-PUBLISH wave) — the Oscillator republish rides the 5.0.0 USER-DOMAIN cut (M.WZ/DM-16

**Recommendations:**

- Author a ledger-sync pre-wave for Tranche O (O.W0 or as an M.WZ prerequisite) that inserts the three missing rows — DM-24 (N Stage HANDOFF, BC dock tripwire), DM-25 (consume-bundle born-closed record), DM-W1-bridge (proof:report-all GREEN verify-record) — plus the DM-4/DM-17 disposition corrections (KILL→FIX per D4) into deferred-ledger-M.md §2e and PROGRESS.md §D before re-pointing proof:chronic-closure from L→M.
- Scope a value.js API path for VJ-L1 (flatLeaf provenance) and VJ-L3 (parseCSSSubValue) in the first value.js post-1.0.2 tranche, OR author a kf-side architectural transposition that eliminates the FN_NAME Symbol sidechannel entirely (inlining the minimal provenance data structure into the PUBLISHED value.js surface without Symbol mutation) and removes the direct parse-that dep via a different parsing approach — the KISS/no-legacy precept favors resolution over indefinite carry.
- Add a dedicated Oscillator republish deferral row to the Tranche O chronic ledger (e.g. DM-26), assign it to O.WZ under the 5.0.0 USER-DOMAIN cut, and thread the BC W-TUNABLE-ANIM/W-VIZ-CHOREOGRAPHY/W-MOTION-ONE-CLOCK consume-seam booking explicitly into the O charter so glass-ui BC can consume the published Oscillator once the 5.0.0 cut fires.
- Author proof:design-paint S1 (the gate script, born-RED by construction) now as a kf-internal obligation independent of BC — only the S4 baseline lock requires the BC-consumed demo; the gate script itself is kf-owned and authoring it now satisfies the gate-first/born-RED discipline and closes the appearance/interaction/state blind-spot the M.W-DESIGN-PAINT wave identified.
- Track glass-ui BC tier cursor actively: BC.W-TABS-IOS (tier 12) and BC.W-DOCK-ENGINE (tier 8) are DONE, but the CUT (tier 27) and the publish are pending; set a tripwire in the O charter so that when glass-ui BC cuts and publishes, kf O fires M.W8 Phase-2 (S1/S2 delete + re-pin), M.W-DESIGN-PAINT S4 (baseline lock), M.W15 S1 (lighthouse posture flip), and M.WZ (formal close) in one coordinated atomic sequence.
- Decide and record the DM-7 (keyframes-vue) sequencing: whether the 0.1.0 publish happens alongside kf 5.0.0, or as a 1.0.0-compatible post-cut, before the O.WZ close; the packages/keyframes-vue/src/Keyframes.ts must be verified against the 5.0.0 renamed types (Animation→KeyframesAnimation etc.) BEFORE the publish to avoid a broken adapter on registry.

---

## F27-n-stage

The N Stage scene-switcher is shelved by owner directive (commit e2375b8: "the stage selector SHELVED per owner; impl preserved on this branch, spec kept"). The implementation on n-stage-impl is genuine and substantial — SceneStage.vue, CarouselDisk.vue, StageArrows.vue, ScenePreviewHost.vue, useCarouselOrbit.ts, useLivePreviewLOD.ts, useStageLight.ts, useSceneStage.ts, sceneStageRegistry.ts with 7 scene adapters — and correctly dogfoods the LIGHT barrel throughout (SpringProgress, RAFPlayback, stagger, NumericAnimation). The branch diverged from master 11 commits ago (before the M constellation consume), pinning old value.js ^0.13.0 and parse-that ^0.9.0, which means a rebase onto Tranche O master is required before any unshelf. The critical blocking gap is that zero N-specific proof gates exist — none of the 15 wave-chartered gates (proof:n-stage-shell, proof:n-carousel-ring, proof:n-stage-boundary, proof:no-keepalive, proof:no-raw-raf, proof:stage-previews-live, proof:stage-supersedes-dropdown, etc.) are authored or wired into package.json proof:correctness/hygiene rosters. A second structural gap: DM-24 (the N Stage HANDOFF row) is documented in M-RECONCILIATION.md §7 with explicit add-to-ledger instructions but was never actually written into docs/tranches/M/audit/deferred-ledger-M.md, violating P-invariant-28's terminal-home requirement. The unshelf tripwire is glass-ui BC (currently on branch tranche/BC, not merged to master), specifically the dock redesign wave BC.W-DOCK-ENGINE — which must ship before the dock morph integration makes sense. The N.WZ spec's pointerdown-intercept trigger design also conflicts with the current n-stage-impl integration which opens the stage via @update:model-value (post-selection), not on pointerdown of the dock Select trigger.

**Critical findings:**

- **[BLOCKER·gap]** DM-24 (N Stage HANDOFF) missing from the actual deferred ledger
  - _ev:_ docs/tranches/M/M-RECONCILIATION.md:289 — DM-24 row specified with explicit 'add to deferred-ledger-M.md' instruction; grep 'DM-24' docs/tranches/M/audit/deferred-ledger-M.md → 0 matches; grep 'DM-24' docs/tranches/M/PRO
  - _→_ fold-into-wave · fold: Tranche-O W0 (ledger hygiene before any N unshelf)
- **[BLOCKER·gap]** Zero N-specific proof gates authored or wired into proof:all
  - _ev:_ package.json on n-stage-impl: python audit shows n-stage/no-keepalive/no-raw-raf/stage-boundary/stage-previews/stage-supersedes all absent from proof:correctness and proof:hygiene. The 15 gates chartered in N.W1-N.WZ (pr
  - _→_ fold-into-wave · fold: N.WZ integration within Tranche-O
- **[HIGH·gap]** n-stage-impl branch 11 commits behind master; pins pre-constellation stack (value.js ^0.13.0, parse-that ^0.9.0)
  - _ev:_ git rev-list 5106416..master --count → 11; git rev-list 5106416..n-stage-impl --count → 4. package.json on n-stage-impl: '@mkbabb/value.js': '^0.13.0', '@mkbabb/parse-that': '^0.9.0'. Master is on value.js ^1.0.2 (conste
  - _→_ fold-into-wave · fold: Tranche-O W-N-UNSHELF pre-flight
- **[HIGH·transposition]** Stage invocation uses @update:model-value (post-selection) not pointerdown intercept as N.WZ specifies
  - _ev:_ demo/@/components/custom/dock/ChromeDock.vue:273 — '@update:model-value="(id) => emit('switchScene', String(id))"' is the trigger path; demo/app/App.vue:410-412 — onSceneSwitchRequest() opens the stage AFTER scene select
  - _→_ fold-into-wave · fold: N.WZ integration S1 (production integration switch)
- **[HIGH·gap]** proof:n-stage-boundary gate spec acknowledges existing proof:boundary does NOT cover demo/ — but no demo-graph walk gate exists
  - _ev:_ docs/tranches/N/waves/N.W2.md:213-237 — 'CORRECTION (adversarial audit): The EXISTING proof:boundary bundles each LIGHT export of the library barrel from source and asserts its static module set is value.js-free. It does
  - _→_ fold-into-wave · fold: N.WZ integration (author proof:n-stage-boundary before merge)
- **[HIGH·deferred]** glass-ui BC (unshelf tripwire) still on branch tranche/BC — not merged to glass-ui master
  - _ev:_ git -C /Users/mkbabb/Programming/glass-ui branch -a shows '* tranche/BC' (current dev branch, not master). The EXECUTION-DAG.md states 'BC is tranche-dev-COMPLETE; this map is consumed when the user greenlights the build
  - _→_ handoff · fold: glass-ui BC delivery (external blocker; N unshelf waits on this)
- **[HIGH·gap]** N.W5 (per-scene interactive idle states in live scenes) entirely unimplemented — no idle state in any scene component
  - _ev:_ docs/tranches/N/waves/N.W5.md:9-17 — 'Born-RED because no scene has an explicit idle state or interactive idle loop today (verified by scanning the scene files — none expose a data-idle attribute or an idle state in thei
  - _→_ fold-into-wave · fold: N.WZ integration Band B (N.W5 impl wave)

**Recommendations:**

- Before any N unshelf: write DM-24 into docs/tranches/M/audit/deferred-ledger-M.md AND docs/tranches/M/PROGRESS.md §'Open deferrals' as M-RECONCILIATION.md §7 specified. The P-invariant-28 terminal-home requirement is unmet until this lands in the machine-parseable ledger. This is a one-commit fix that must precede Tranche O close.
- Gate glass-ui BC (tranche/BC) as the hard tripwire for N unshelf. The N.WZ dock integration (pointerdown-intercept on the Select trigger, the dock-hold mutex extension) is only clean after BC.W-DOCK-ENGINE ships a rebuilt dock. Do not attempt the N unshelf until glass-ui BC has merged to master and a new glass-ui version is published.
- When Tranche O opens N.WZ integration: rebase n-stage-impl onto O master FIRST to pick up the constellation stack (value.js ^1.0.2, parse-that ^0.11.0, glass-ui post-BC). The 11-commit divergence is manageable (4 impl commits on n-stage-impl) but the package.json pin mismatch is a hard conflict.
- Author all 15 N-specific proof gates (proof:n-stage-boundary esbuild metafile walk, proof:no-keepalive and proof:no-raw-raf as runtime browser observables, proof:n-carousel-ring, proof:stage-previews-live, proof:stage-supersedes-dropdown, etc.) as born-RED scripts BEFORE the implementation is merged to master. The gate-first/born-RED discipline (inv-M-observable-truth) is non-negotiable for this feature.
- Fix the Stage invocation path during N.WZ integration: the current n-stage-impl opens the stage via @update:model-value (after the user picks a scene from the reka Select dropdown), but the N.WZ spec requires pointerdown intercept on the DockSelectTrigger (fire open-stage on pointerdown, kill the trailing click). The correct semantic is: clicking the Select trigger opens the Stage picker, NOT the reka dropdown.
- For the N.W5 per-scene live idle states: this is the heaviest unimplemented wave and should be scoped honestly at N.WZ as a deferred candidate if BC-timeline pressure is real. Each of the 7 live scene components needs an explicit idle state machine entry — a significant cross-scene change. If deferred, it must enter the Tranche-O deferred ledger with a terminal home (not a fourth carry).
- Reconcile the STAGE-SPEC (S0-S10 atomic stages) with the wave plan (N.W0-N.WZ) in a single mapping document before unshelf execution. The STAGE-SPEC is the chrome-devtools-mcp measurement oracle; the wave spec is the CI gate authority. Without explicit mapping, the unshelf implementation will have no clear 'stage S(n) = wave N.Wx' execution order.

---

## F28-prompt-recap

The prompt-recap spine from A through the M dev-phase (prompt-recap-M.md) is rigorously chain-trusted and shows zero drops across its intended scope. The lane-32 and prompt-recap-M.md docs together cover every owner request through the M.W0 dev phase (tranche-l-dev tip 4b3d2eb). However, four post-charter events documented in M-RECONCILIATION.md §6 (the N-tranche excursion, the "stop-stopping" reorient directive, the constellation campaign re-audit, and M.W1 implementation on tranche-l-dev) were NEVER folded into prompt-recap-M.md as required by the M-RECONCILIATION §11 edit-spec ("IMPL-OPEN"). Additionally, the ground truth's description of the Tranche O open-items list contains one stale error (M.W1 proof:report-all stated as "gate script unauthored" — both run-all.mjs and proof-report-all.mjs exist on master at commit 5d047ac). Two 7-tranche ABSOLUTE-terminal P-invariant-28 items (DM-3 MorphSVG and DM-2 GlassControlPoint/DemoControlPoint) were not implemented at M despite the absolute mandate; DM-3 is entirely absent from the Tranche O open-items list in the ground truth, constituting an unacknowledged chronic carry. The USER-DOMAIN publish legs (keyframes 5.0.0 cut, keyframes-vue 0.1.0, Oscillator in published dist) and TASTE verdict remain genuinely PENDING with no signs of being addressed yet.

**Critical findings:**

- **[HIGH·gap]** prompt-recap-M.md NOT updated with 4 post-charter events (N excursion, stop-stopping, constellation re-audit, M.W1 impl)
  - _ev:_ docs/tranches/M/M-RECONCILIATION.md:§6 (Events 1-4) + §11 edit-spec row: 'audit/prompt-recap-M.md — Add events 1–4 (N excursion, reorient, re-audit, M.W1-impl) — IMPL-OPEN'. Confirmed: prompt-recap-M.md ends at its M.W0 
  - _→_ fold-into-wave · fold: O.W0 (Tranche O audit/dev wave — extend prompt-recap-M.md per M-RECONCILIATION §11 edit-spec)
- **[BLOCKER·chronic]** DM-3 MorphSVG (7-tranche ABSOLUTE-terminal at M) — NOT implemented, NOT in Tranche O open-items list, P-invariant-28 violated
  - _ev:_ PROGRESS.md:289 says DM-3 = 'FOLD-LANDED (build-in over PUBLISHED PathGeometry) — ABSOLUTE terminal at M'. But: grep 'fromMorphSVG' src/ → ZERO; ls scripts/proof-morphsvg-consume.mjs → ABSENT; node -e 'PathGeometry': typ
  - _→_ fold-into-wave · fold: O (DM-3 must EXIT in Tranche O — build-in fromMorphSVG over value.js 1.0.2 PathGeometry; author proof:morphsvg-consume; 
- **[HIGH·chronic]** DM-2 GlassControlPoint/DemoControlPoint (7-tranche, ABSOLUTE-terminal at M) — M.W14 not implemented, silently absent from M-CONSUME-CLOSE deferred list
  - _ev:_ PROGRESS.md:288 says DM-2 = 'HANDOFF — consume on glass-ui BB publish OR build-in Option B OR named KILL (ABSOLUTE terminal at M)'. M-CONSUME-CLOSE.md does NOT list DM-2 under 'HANDOFF/deferred'. Ground truth correctly i
  - _→_ fold-into-wave · fold: O (build-in DemoControlPoint over LIGHT Draggable per M.W14 Option B; author proof:control-point-live GREEN path; exits 
- **[HIGH·deferred]** M.W5-W7 (Band B correctness: @property/compileToCSS, NaN named-selector, oklch/densify) — NOT implemented, NOT in O scope list
  - _ev:_ PROGRESS.md §1 rows M.W5-W7 all marked DEVELOPED (not IMPLEMENTED). Verified: grep '@property' src/animation/compile.ts → ZERO (compileToCSS does not emit @property blocks, gap persists from ⚠M1 M.W5 finding). NAMED_SELE
  - _→_ fold-into-wave · fold: O (M.W5-W7 Band B must be explicitly chartered as O waves; ⚠M1 NaN-named-selector and ⚠M2/M3 oklch/densify are active pr
- **[HIGH·gap]** Oscillator LOCAL-ONLY — present in dist/keyframes.js but absent from published npm 4.3.0 (released at K, pre-L.W9)
  - _ev:_ dist/keyframes.js:444 exports Oscillator; src/animation/index.ts:74 exports Oscillator/waveformValue. git log -- src/animation/oscillator.ts → '791b3bd feat(tranche-L W9): ... the Oscillator shipped'. Release commit 4737
  - _→_ handoff · fold: USER-DOMAIN (5.0.0 npm publish by Mike Babb — Oscillator becomes part of the published surface at next version cut)
- **[HIGH·deferred]** keyframes-vue 0.1.0 still unpublished (DM-7 USER-DOMAIN deploy blocker) — E404 on npm
  - _ev:_ npm show @mkbabb/keyframes-vue → E404 Not Found. proof:keyframes-vue-published clause (b) is RED-by-design. PROGRESS.md DM-7: 'HANDOFF (USER-DOMAIN — Mike Babb)'. M-CONSUME-CLOSE.md:58 lists it as 'a second USER-DOMAIN d
  - _→_ handoff · fold: USER-DOMAIN (Mike Babb npm publish of @mkbabb/keyframes-vue@0.1.0)

**Recommendations:**

- FOLD DM-3 (MorphSVG, 8-tranche at O) explicitly into the Tranche O charter as a NAMED wave with born-RED gate proof:morphsvg-consume over a live-morph frame sample; PathGeometry is present in value.js 1.0.2 so the build-in is immediately unblocked — no sibling publish required
- Extend prompt-recap-M.md with the 4 post-charter events from M-RECONCILIATION.md §6 (N-excursion, stop-stopping reorient, constellation re-audit D1-D11, M.W1 implementation at 5d047ac) per the M-RECONCILIATION §11 edit-spec marked IMPL-OPEN; these are unrecorded owner directives
- Correct deferred-ledger-M.md DM-4 (KILL→RESOLVED-BY-FIX per D4, parse-that A.W2 WDM) and DM-17 (RESOLVED-BY-KILL→RESOLVED-BY-FIX) per M-RECONCILIATION §4 edit-spec; proof:packrat-sound is already GREEN and the stale KILL framing is a false ledger state
- Correct the ground truth's stale claim about 'M.W1 proof:report-all gate script unauthored' — both scripts/run-all.mjs and scripts/proof-report-all.mjs exist on master (commit 5d047ac); this error in the ground truth could mislead O wave authoring
- Explicitly charter M.W5-W7 (Band B correctness: @property/compileToCSS gap ⚠M1, NaN named-selector ⚠M1, oklch/densify ⚠M2/M3) as Tranche O waves with born-RED gates; ⚠M1 (NAMED_SELECTOR_NO_TIMELINE typed at errors.ts:46 but never thrown) is an active precept violation
- Charter M.W2/W3/W4 (eslint LINT tier, @vitest/browser integration, synthetic clock) as explicit Tranche O waves; these are non-BC-gated apparatus improvements blocked only by implementation authorization and are the O tranche's primary DX win
- Track Oscillator npm publish gap explicitly in the O deferred ledger: the Oscillator/waveformValue are LIGHT exports in the local dist but absent from the npm 4.3.0 package; they will publish at the 5.0.0 cut (USER-DOMAIN)
- Ensure M.WZ close criteria are fully specified including the DM-3/DM-2 build-in exits and Band B/A apparatus waves; the current M-CONSUME-CLOSE deferred list is incomplete (DM-2/DM-3 absent)

---

## F29-precept-reckoning

The tree carries five live workaround families that the no-legacy/no-workaround mandate explicitly forbids and that Tranche O must transpose or consume. (1) The S8 FN_NAME Symbol sidechannel stamped onto value.js ValueUnit (utils.ts:45-57) is a kf-owned band-aid for the absent VJ-L1 flatLeaf provenance API — stamping a Symbol onto a published class is a textbook cross-library coupling antipattern. (2) The S9 direct @mkbabb/parse-that import (utils.ts:1) with dual `as any` casts (utils.ts:229,236) punches through value.js's parser abstraction — kf should never reach parse-that directly; value.js owns the grammar. (3) The S1/S2 glass-ui band-aids (`:aria-orientation="undefined"` in SpringSidebar.vue:43 + AnimationControls.vue:72; onPlayPointerDown/pointerHandled in TransportDock.vue:348-373) are precept violations held at kf-side pending BC publication. (4) The deprecated `Animation`/`ScrollTimeline`/`ScrollTimelineOptions` backward-compat aliases live in the published surface (engine.ts:1205, timeline.ts:218,171) and 22 demo files still import the old `Animation` type — exactly the legacy the no-legacy mandate bans. (5) The internal/leaves.ts leaf-duplicate family (clamp/scale/lerp/lerpArray/rAF shims) exists because value.js had no tree-shakeable math subpath; now that `@mkbabb/value.js/math` ships those exact functions (dist/subpaths/math.js confirmed), the duplicates have no architectural justification and violate KISS. The named-selector NaN-always-active dead-code path (DM-22: NAMED_SELECTOR_NO_TIMELINE typed but never thrown; named-selector frames produce NaN frame-times from calcFrameTime str*number) and the 276-call waitForTimeout settle-sleep apparatus (68 scripts spanning a 3-hour serial O(N²) runner) are the two structural transpositions the owner named and the gate evidence confirms.

**Critical findings:**

- **[HIGH·workaround]** S8 — FN_NAME Symbol sidechannel stamped onto published value.js ValueUnit
  - _ev:_ src/animation/utils.ts:45-57 — `const FN_NAME = Symbol("kf.fnName"); type NamedValueUnit = ValueUnit & { [FN_NAME]?: string };`. The proof-workaround-deletion.mjs:258 arm confirms PRESENT + PENDING (VJ-L1 `flatLeaf` abse
  - _→_ handoff · fold: Tranche-O M.W9 (value.js O VJ-L1 publish) — S8 arm of proof:workaround-deletion turns RED on VJ-L1 ship + kf must delete
- **[HIGH·workaround]** S9 — Direct @mkbabb/parse-that import punching through value.js's parser abstraction
  - _ev:_ src/animation/utils.ts:1 `import { any as parseAny } from "@mkbabb/parse-that";` + utils.ts:229,236 `(CSSFunction.FunctionArgs as any).map(...)` + `(parseAny as any)(fnArgs, CSSValues.Value)`. Cross-realm nominal-type se
  - _→_ handoff · fold: Tranche-O M.W9 — S9 arm turns RED on VJ-L3 parseCSSSubValue publish; kf deletes the parse-that direct dep + the two `as 
- **[HIGH·workaround]** S1 + S2 — glass-ui band-aids: :aria-orientation suppress + onPlayPointerDown/pointerHandled
  - _ev:_ demo/spring/SpringSidebar.vue:43 `:aria-orientation="undefined"`; demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72 same suppress. demo/@/components/custom/animation-controls/TransportDock.vue
  - _→_ handoff · fold: Tranche-O — consume glass-ui BC when it publishes (tripwire: W-DOCK-MORPH-FAMILY + SegmentedTabs aria fix ships); delete
- **[HIGH·gap]** DM-22 — named-selector frames produce NaN frame-times (NAMED_SELECTOR_NO_TIMELINE typed but never thrown)
  - _ev:_ src/animation/frame-compiler.ts:114,226 — comments claim 'refuses with NAMED_SELECTOR_NO_TIMELINE, never a silent invented number'. src/animation/internal/errors.ts:46 types it. grep across all .ts files: NAMED_SELECTOR_
  - _→_ fold-into-wave · fold: Tranche-O M.W5 — author born-RED gate on the NaN observable (not the proxy); make the NAMED_SELECTOR_NO_TIMELINE throw r
- **[HIGH·workaround]** 276 waitForTimeout settle-sleeps across 68 proof scripts — serial O(N²) gate apparatus
  - _ev:_ grep across scripts/: 276 `waitForTimeout` calls in 68 files (confirmed count). proof:hygiene string in package.json:194 chains 141 gates as a serial `&&` — a single red aborts on the first failure. proof-report-all.mjs:
  - _→_ fold-into-wave · fold: Tranche-O M.W1-W4 — parallel report-all runner (already authored in run-all.mjs); M.W2 proof:lint-tier (eslint config ab
- **[HIGH·deferred]** DemoControlPoint absent — 7-tranche GlassControlPoint chronic (DM-2) has no kf-side build yet
  - _ev:_ grep across demo/ and src/: zero hits for 'DemoControlPoint' or 'control-point'. proof-control-point-live.mjs is referenced in package.json. glass-ui@4.0.1 dist has no GlassControlPoint (proof:control-point-live born-RED
  - _→_ fold-into-wave · fold: Tranche-O M.W14 — build DemoControlPoint composable over LIGHT Draggable; proof:control-point-live greens on the kf buil

**Recommendations:**

- The three S-clause workarounds (S8 FN_NAME Symbol, S9 parse-that direct import, S1+S2 glass-ui band-aids) must each exit in ONE atomic commit per arm when the paired sibling publishes. Author `proof:workaround-deletion` arm-level tripwires that flip RED the moment the sibling ships — do not rely on manual tracking. The gate script already implements the correct three-state model; the tripwires just need the sibling publish to land.
- Transpose internal/leaves.ts math duplicates to @mkbabb/value.js/math subpath imports. First verify proof:boundary stays green with `import { clamp, scale, lerp, lerpArray } from '@mkbabb/value.js/math'` in the light modules — the subpath must not pull the CSS grammar. Keep the rAF shim local (it is not in the ./math subpath). Delete the four duplicated math functions from leaves.ts on a confirmed green boundary.
- DM-22 (named-selector NaN-always-active) must be fixed before the 5.0.0 cut. The fix is architectural: calcFrameTime must detect a named-selector ValueUnit (superType='named-selector') and either defer frame-time computation to attach time (when a ScrollTimeline/ManualTimeline phase mapper is present) or throw NAMED_SELECTOR_NO_TIMELINE immediately at parse time. The current 'refuse with NAMED_SELECTOR_NO_TIMELINE, never a silent invented number' comment is fiction — the throw path does not exist in the engine.
- Migrate all 22 demo `import type { Animation }` consumers to `KeyframesAnimation` on the 5.0.0 cut. Make the migration a CI gate: proof:no-deprecated-guard already exists for the router; author a parallel `proof:no-deprecated-Animation-import` grep gate over demo/ that fails on `import.*{ Animation }` from keyframes.js (the PKG-3 canonical name never triggers it). Drop both @deprecated aliases (Animation + ScrollTimeline + ScrollTimelineOptions) from the published surface in the same 5.0.0 commit.
- The gate apparatus transposition (DM-23 / M.W1-W4) is the largest measurable ROI item: replacing 276 waitForTimeout settle-sleeps with a synthetic rAF clock + moving 68 Chromium-spawning gates into @vitest/browser over a shared browser instance collapses a 3-hour serial run into a single-digit-minute parallel run. Author the lint tier (eslint config born-RED) in M.W2 — the no-eslint-config finding is a source-shape HYGIENE gap that proof:chronic-closure cannot see but the precept reckoning requires.
- DemoControlPoint (DM-2, 7-tranche P-inv-28 ABSOLUTE terminus) must be built in M.W14 or Tranche O. The LIGHT Draggable is already published and sufficient for a thin curve-control composable. Option B (kf-owned DemoControlPoint) avoids the glass-ui >=2-consumer bar entirely and is KISS-correct. No further BOOK is permissible — the ledger records 'ABSOLUTE terminus at M' and the chronicity is 7.
- Probe the published @mkbabb/keyframes.js@4.3.0 npm tarball for Oscillator before the 5.0.0 cut. If the published package lacks Oscillator (it was added after the last publish per ground truth), the 4.3.0 npm dist and the local dist/keyframes.js are desynchronized — a silent regression for any consumer who installed from npm. The 5.0.0 cut must include Oscillator; the 4.3.0 gap should be noted in the changelog.

---

## G30-tranche-O-shape

Tranche O is the keyframes.js "close everything M left open" tranche: it consumes glass-ui BC (M.W8 Phase-2 + M.W-DESIGN-PAINT + M.W15 S1/S2), executes the M apparatus transposition waves that were never implemented (M.W2 lint-tier, M.W3 vitest-browser, M.W4 synthetic-clock, M.W5 compile-surface, M.W6 multi-color, M.W7 ingest, M.W12 perf, M.W13 engine-seam, M.W14 terminal-belt), and closes M.WZ. The wave structure is strictly two-phased: kf-internal-now waves (gate-first, zero sibling dependency, can execute immediately) and BC-gated consume waves (fire atomically on BC publish). The M.md five-band DAG template is the model; O inherits it with re-numbered waves and two new BC-gate slots. The born-RED discipline (inv-M-observable-truth) and inv-M-one-runner apply to every O wave. Four chronic open items reach terminal status in O: DM-2 GlassControlPoint (7-tranche must BUILD-IN as DemoControlPoint), DM-3 MorphSVG (7-tranche must BUILD-IN via PathGeometry), S1/S2 workarounds (4-tranche BC-gated delete), S8/S9 value.js workarounds (pending VJ-L1/VJ-L3 which value.js O DID NOT ship — new O consume edge).

**Critical findings:**

- **[HIGH·gap]** O.W1 (Band A) — the LINT tier (M.W2 never executed): eslint + dependency-cruiser
  - _ev:_ scripts/proof-lint-tier.mjs ABSENT (verified ls); M.W2.md authored but proof:lint-tier never scripted; ~33 source-shape gates still run as hand-rolled node processes (deferred-ledger-M.md DM-23)
  - _→_ fold-into-wave · fold: O.W1 (Band A, kf-internal-now; born-RED: proof:lint-tier absent → exit 1; no sibling dep)
- **[HIGH·gap]** O.W2 (Band A) — @vitest/browser-playwright integration tier (M.W3 never executed): 72 cold-chromium gates consolidated
  - _ev:_ find /Users/mkbabb/Programming/keyframes.js/test -name '*.browser.test.ts' → empty (zero browser test files); M.W3.md authored but no migration occurred; 72 proof:*.mjs scripts still spawn fresh chromium per process (def
  - _→_ fold-into-wave · fold: O.W2 (Band A, kf-internal-now; born-RED: zero *.browser.test.ts files → the shared-chromium tier is absent; use @vitest/
- **[HIGH·gap]** O.W4 (Band B) — compile-surface totality: @property into compileToCSS + named-selector NaN cure (M.W5 never executed)
  - _ev:_ deferred-ledger-M.md DM-21/DM-22; frame-compiler.ts:128 NAMED_SELECTOR_SUPERTYPE written never read; errors.ts:46 NAMED_SELECTOR_NO_TIMELINE typed never thrown; M.md:136 ⚠M1; PROGRESS.md §0 confirmed these as net-new M c
  - _→_ fold-into-wave · fold: O.W4 (Band B, kf-internal-now; born-RED: proof:replay-equality compileToCSS @property row + proof:named-selector-nan-fra
- **[HIGH·gap]** O.W5 (Band B) — multi-color densify fidelity: oklch space dispatch + non-color property preservation (M.W6 never executed)
  - _ev:_ M.md:137-138 ⚠M2+⚠M3; compile-color.ts:191 colorToOklabCSS called unconditionally; densify drops non-color properties with eligible:true; these engine defects were documented in M.W6.md but never cured
  - _→_ fold-into-wave · fold: O.W5 (Band B, kf-internal-now; born-RED: proof:compile-replay oklch fixture asserts 'oklch(' + color+opacity fixture ass
- **[HIGH·deferred]** O.W7 (Band C) — glass-ui BC consume Phase-2: aria/RF-17 workaround deletion (M.W8 Phase-2 pending)
  - _ev:_ proof-workaround-deletion.mjs output: S1=PENDING (SpringSidebar.vue:43 + AnimationControls.vue:72 :aria-orientation), S2=PENDING (TransportDock.vue:15/151/196/342/348/358/361/366/373 pointerHandled); glass-ui@4.1.0 E404;
  - _→_ fold-into-wave · fold: O.W7 (Band C, BC-gated; born-RED: proof:workaround-deletion S1+S2 PENDING; fires on glass-ui BC publish + ONE atomic re-
- **[HIGH·workaround]** O.W8 (Band C) — value.js VJ-L1/VJ-L3 workaround deletion: FN_NAME Symbol + parse-that direct dep (S8/S9 still PENDING)
  - _ev:_ proof-workaround-deletion.mjs: S8=PENDING (src/animation/utils.ts:45,47,51,55,213,289,342 FN_NAME Symbol; value.js O shipped VJ-L2 only, VJ-L1 flatLeaf NOT landed); S9=PENDING (utils.ts:1 direct parse-that import; VJ-L3 
  - _→_ fold-into-wave · fold: O.W8 (Band C, value.js-gated; born-RED: proof:workaround-deletion S8+S9 PENDING; fires when value.js ships VJ-L1 flatLea
- **[HIGH·chronic]** O.W11 (Band E) — terminal belt exits: DemoControlPoint BUILD-IN + MorphSVG BUILD-IN (M.W14 never executed)
  - _ev:_ find /Users/mkbabb/Programming/keyframes.js/demo -name 'DemoControlPoint*' → empty; grep fromMorphSVG src/ → empty; deferred-ledger-M.md DM-2 (7-tranche GlassControlPoint) + DM-3 (7-tranche MorphSVG) still OPEN; PathGeom
  - _→_ fold-into-wave · fold: O.W11 (Band E, kf-internal-now — no sibling publish required for either; DM-3 PathGeometry IS published at 1.0.2; born-R
- **[HIGH·deferred]** O.WZ — close: M.WZ (never executed) + 5.0.0 cut + Oscillator republish + chronic-closure re-point
  - _ev:_ M.WZ.md §context: LAST in M; proof:changelog-5.0.0 ABSENT; CHRONIC_LEDGER at scripts/proof-chronic-closure.mjs:114 still points L/PROGRESS.md (verified); Oscillator in local dist but NOT in published 4.3.0 (v4.3.0 tag 47
  - _→_ fold-into-wave · fold: O.WZ (DAG: LAST; gated on all O bands green + BC consume-or-circled; USER-DOMAIN: 5.0.0 cut + Oscillator republish + key
- **[HIGH·gap]** Oscillator LOCAL-ONLY: shipped in src + local dist but absent from published 4.3.0 (P-inv-28 violation risk)
  - _ev:_ git show v4.3.0 -- src/animation/oscillator.ts → empty (tag predates L.W9 commit 791b3bd); dist/keyframes.d.ts line 2477 has Oscillator; npm show @mkbabb/keyframes.js@4.3.0 version → 4.3.0 (latest published); KF-INBOUND.
  - _→_ fold-into-wave · fold: O.WZ (the 5.0.0 publish is the republish vehicle; proof:published-surface must gate Oscillator is in the published dist;
- **[HIGH·gap]** VJ-L1/VJ-L3 NOT shipped in value.js O (constellation ground truth overclaim vs actual O.md content)
  - _ev:_ proof-workaround-deletion.mjs S8: '@mkbabb/value.js@0.14.0 is published but VJ-L1 flatLeaf provenance API has NOT landed (value.js O shipped VJ-L2 only)'; S9: 'VJ-L3 parseCSSSubValue helper has NOT landed'; M-CONSUME-CLO
  - _→_ handoff · fold: ask-sibling (dispatch to value.js Tranche P: VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue are the two missing API items; kf O

**Recommendations:**

- Author O.W0 DEV charter NOW: enumerate the M-as-built delta (the 10 never-executed M waves), re-target all BB→BC references, add the VJ-L1/VJ-L3 missing-API dispatch as a new sibling ask (value.js Tranche P), and record the Oscillator republish obligation. Use M.md as the template — 12 waves + WZ, two-band DAG.
- O.W1 through O.W3 are IMMEDIATELY executable (zero sibling dependencies). Start O.W1 (proof:lint-tier authoring) gate-first: `npx eslint --init` over src/ + the dependency-cruiser src→demo boundary rule. These make every subsequent O wave iterate in seconds, not minutes.
- O.W4/W5/W6 (the M.W5/W6/W7 correctness cures) are also kf-internal-now: frame-compiler.ts:128 NAMED_SELECTOR_SUPERTYPE + errors.ts:46 NAMED_SELECTOR_NO_TIMELINE are the targets. Author born-RED gates first (proof:named-selector-nan-frame, proof:oklch-densify-space). value.js 1.0.2 is sufficient for all three.
- O.W11 (MorphSVG BUILD-IN + DemoControlPoint BUILD-IN) must fire before O.WZ — these are 7-tranche P-inv-28 ABSOLUTE terminal items. PathGeometry is confirmed published at value.js 1.0.2 (dist/transform/path.d.ts:36-67). Author proof:morphsvg-consume (born-RED on absent fromMorphSVG) as the first gate-first step. No sibling publish required.
- O.W7 (BC Phase-2 consume) + O.W12 (visual-truth + lighthouse posture flip) are BC-gated — author their born-RED gate scripts NOW (proof:design-paint.mjs structure from M.W-DESIGN-PAINT.md) so the script exists and the born-RED state is proven, even though the IMPL awaits the BC publish.
- Dispatch a sibling ask to value.js for VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) as the O.W0 cross-repo output. These gate O.W8 (FN_NAME Symbol deletion in utils.ts:45-57 and parse-that direct dep at utils.ts:1) and O.W10 (engine-seam transposition). Without them, two O waves must remain STAGED-PENDING.
- O.WZ must close with the 5.0.0 publish that includes Oscillator (absent from 4.3.0; v4.3.0 tag predates L.W9 commit 791b3bd). proof:published-surface must gate Oscillator is in the published dist before the WZ close is claimed. Also wire proof:changelog-5.0.0 (absent today) to assert FOUR breaking changes + the multi-color refusal semantic break.
- The close criteria for O are: all O.W1–O.W6 gates GREEN (kf-internal), O.W7 GREEN on BC publish, O.W8 GREEN on VJ-L1/L3 publish, O.W11 BUILD-IN gates GREEN, O.W12 lighthouse posture flipped + design-paint passes on BC-consumed demo, proof:chronic-closure re-pointed M→O with non-vacuity planted-row RED discipline, 5.0.0 cut + Oscillator + keyframes-vue published (USER-DOMAIN), deploy round-trip observed with exact build hash.

---

## G31-branch-version-topology

The branch/version/publish topology is complex but mostly coherent. master (aef3ef3) and tranche-o-dev share the same HEAD tip — the Tranche O dev branch was created at master with zero divergence, which is correct. The campaign chain (parse-that 0.11.0 → value.js 1.0.2 → keyframes.js consume, deployed) is complete and correct on master. The two live topology risks are: (1) n-stage-impl is a shelved branch that diverged at commit 5106416b — BEFORE the M.W1 runner, BEFORE the M consume cascade, and carrying OLD deps (parse-that ^0.9.0, value.js ^0.13.0) plus the S7 workaround that master has since deleted, creating a non-trivial merge/rebase conflict surface when DM-24 is eventually unshelved; (2) the npm registry is frozen at v4.3.0 (tagged at Tranche K close — 4737ab39, 40 commits ago), so every feature shipped since then — the Oscillator, the constellation consume, the new M gates, the keyframes-vue adapter, the value.js 1.0.2 re-pin — is LOCAL-ONLY and absent from the published tarball. The 5.0.0 version cut (DM-16) and two USER-DOMAIN publishes (keyframes + keyframes-vue) are the sole path to close this gap, and both are gated on glass-ui BC completing its remaining pending tiers (11.5, 16–22.7, 24–28) before the publish chain can start.

**Critical findings:**

- **[HIGH·gap]** n-stage-impl diverged at 5106416b (BEFORE M.W1 + M consume cascade) — stale deps + S7 revert create merge conflict risk on DM-24 unshelf
  - _ev:_ git merge-base master n-stage-impl = 5106416b; git diff master n-stage-impl -- package.json shows parse-that ^0.9.0 / value.js ^0.13.0; git diff master n-stage-impl -- src/animation/utils.ts line 183+: S7 flat-comma norm
  - _→_ handoff · fold: Tranche O — DM-24 unshelf prep: rebase n-stage-impl onto master (or cherry-pick Stage files), resolve S7 revert conflict
- **[HIGH·gap]** npm registry frozen at v4.3.0 (tagged 4737ab39, Tranche K close) — 40 commits of features are LOCAL-ONLY
  - _ev:_ npm view @mkbabb/keyframes.js dist-tags = {latest: '4.3.0'}; git log 4737ab39..aef3ef3 --oneline | wc -l = 40; Oscillator added in 791b3bd (L.W9, AFTER the tag); constellation consume (value.js 1.0.2, parse-that 0.11.0) 
  - _→_ handoff · fold: Tranche O M.WZ: 5.0.0 version cut (DM-16, USER-DOMAIN) → tag push → release.yml fires → npm publish; gated on glass-ui B
- **[HIGH·risk]** glass-ui BC executing with many tiers pending (11.5, 16-22.7, 24-28) — BC publish is not imminent; Tier 27 (the CUT) remains pending
  - _ev:_ /Users/mkbabb/Programming/glass-ui/docs/tranches/BC/EXECUTION-PROGRESS.md tier table: Tier 11.5 = 'pending', Tier 16-17 = 'pending', Tier 19-22.7 = 'pending', Tier 23 = 'pending', Tier 24 = 'pending', Tier 25 = 'pending'
  - _→_ handoff · fold: Tranche O: all BC-gated kf-M waves (M.W8 Phase-2, M.W-DESIGN-PAINT, M.W15, M.WZ, DM-24, DM-1, DM-5 S1/S2) remain blocked

**Recommendations:**

- Before ANY Tranche O impl work on n-stage-impl content, rebase n-stage-impl onto master (or cherry-pick only the Stage component files: demo/@/components/custom/scene-stage/**, test/scene-stage-previews.test.ts). Resolve the utils.ts S7 conflict by KEEPING master's deletion. Update package.json deps to the current constellation pins.
- Author proof:changelog-5.0.0 gate script (currently MISSING from scripts/) as the first M.WZ gate obligation in Tranche O. It must assert the FOUR breaking changes (@deprecated annotations in engine.ts:1192, timeline.ts:163/209, animations.ts:133) in a born-RED posture on the 4.3.0 tree.
- Execute the M.WZ atomic ledger re-point: update proof-chronic-closure.mjs CHRONIC_LEDGER constant from 'docs/tranches/L/PROGRESS.md' to 'docs/tranches/M/PROGRESS.md' in ONE commit with the DM-24/DM-25 rows added to PROGRESS.md §D and deferred-ledger-M.md. Run the non-vacuity planted-probe proof first.
- Update proof:workaround-deletion S1/S2 sibling version check from '4.1.0' (never published) to the BC CUT version (to be determined). The gate correctly fires PENDING but for a phantom version number that can never be satisfied.
- Dispatch to value.js a follow-up ask for VJ-L1 (flatLeaf provenance API) and VJ-L3 (parseCSSSubValue helper) so S8 and S9 workarounds in src/animation/utils.ts can be deleted. These were anticipated at L.W9 but were not shipped in Tranche O (value.js 1.0.2). Until they ship, the direct parse-that import in utils.ts:1 and the FN_NAME Symbol sidechannel persist.
- Confirm with glass-ui BC team whether DOCK-ENGINE (Tier 8, DONE) satisfies the DM-24 ASK-3 'scene-select affordance' requirement, or whether the dock design specifically needs a scene-switcher affordance that is still pending in a later tier. Update the DM-24 tripwire wording accordingly.
- The Tranche O branch (tranche-o-dev = master HEAD) is correctly positioned. Tranche O impl should proceed on this branch. The 5.0.0 version cut and npm publish (DM-16) should be executed as the terminal step after glass-ui BC publishes and kf re-pins (M.W8 Phase-2). Do NOT bump the version prematurely before the BC consume is done.

---

## G32-constellation-coherence

The constellation's acyclic DAG (parse-that -> value.js -> keyframes.js -> glass-ui) is correctly oriented and the three upstream libraries are published (parse-that 0.11.0, value.js 1.0.2, kf 4.3.0), but the downstream edges are incomplete and four sequencing hazards remain open. glass-ui BC is ~60% through execution (tiers 0-14 done, tiers 15-28 pending including the CUT), meaning M.W8-Phase2, M.W-DESIGN-PAINT, M.W15, and M.WZ remain BC-gated and kf Tranche O cannot fully close. Two specific API gaps (VJ-L1 flatLeaf, VJ-L3 parseCSSSubValue) were never shipped in value.js O and have no tranche home in value.js, leaving S8/S9 workarounds permanently PENDING with no unblock path. The proof:workaround-deletion S1/S2 gate targets glass-ui@4.1.0 which never published and never will; the fixes are already live on 4.0.1 but the stale version check will suppress the GREEN flip even after BC cuts. A positive strength: the acyclic-spine discipline holds perfectly (no cycles, no cross-writes, no file: pins), and all consumed gate outputs (proof:peer-satisfied, proof:css-parity, proof:packrat-sound, proof:consume-bundle, proof:boundary) are GREEN on master.

**Critical findings:**

- **[HIGH·gap]** S1/S2 workaround-deletion gate targets glass-ui@4.1.0 — a version that never published and never will
  - _ev:_ scripts/proof-workaround-deletion.mjs:216,228 — `sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0" }` for both S1 and S2. BB closed at 4.0.1; the BC cut will be 4.2.0 or higher (USER-DOMAIN). KF-BC.md confirms: '4.0.1
  - _→_ fold-into-wave · fold: kf-O M.W8-Phase2: retarget S1/S2 sibling version check from '4.1.0' to a semver-range check (`>=4.0.1`) or replace with 
- **[HIGH·deferred]** VJ-L1 (flatLeaf) and VJ-L3 (parseCSSSubValue) were never shipped in value.js O — S8/S9 have no unblock path
  - _ev:_ scripts/proof-workaround-deletion.mjs output: 'S8 PENDING — @mkbabb/value.js@0.14.0 is published but its VJ-L1 flatLeaf provenance API has NOT landed (value.js O shipped VJ-L2 only)'; 'S9 PENDING — VJ-L3 parseCSSSubValue
  - _→_ handoff · fold: kf-O M.W9: dispatch VJ-L1/VJ-L3 to value.js as explicit asks for Tranche P/next. Until they ship, S8/S9 remain PENDING i
- **[HIGH·deferred]** glass-ui BC is ~60% through execution — BC CUT (tier 27/28) still pending 7 remaining tiers including per-viz, pages, perf, cut
  - _ev:_ glass-ui docs/tranches/BC/EXECUTION-PROGRESS.md tier cursor: tiers 0-14 DONE (F, 0, 14, 1 spine+fan, 7, 12, 2 engine+fleet, 3, 4-substrate, 6); tiers 15-28 PENDING: Band 13 scroll (11.5), Band 4 per-viz 9 waves (16-17), 
  - _→_ verify · fold: kf-O M.WZ: the BC CUT is the unblock event for kf's Phase-2 consume. Track BC execution progress; kf O opens its final w

**Recommendations:**

- Retarget proof:workaround-deletion S1 and S2 from a hard-coded @mkbabb/glass-ui@4.1.0 version probe to a content-aware check (does the installed glass-ui dist contain the aria fix / useDockClickIntegrity?). The fixes are already live on 4.0.1; the workarounds in AnimationControls.vue:72, SpringSidebar.vue:43, and TransportDock.vue can be deleted NOW against the installed 4.0.1 without waiting for the BC cut.
- Add a proof:workaround-deletion arm for the inline lerpArray in src/animation/internal/leaves.ts:68-80. The ./math subpath shipped in value.js 1.0.2 and exports lerpArray; the inline copy is unblocked and should be swapped to `import { lerpArray } from '@mkbabb/value.js/math'` in an early kf-O wave. The comment on leaves.ts:56-58 is stale and should be removed.
- Publish a new kf version (>=4.4.0) that includes the Oscillator in the npm dist before glass-ui BC reaches BC.W-VIZ-CHOREOGRAPHY and BC.W-MOTION-ONE-CLOCK execution. The Oscillator is in the local source and local dist but absent from the registry 4.3.0. This is USER-DOMAIN (Mike Babb) but time-sensitive relative to BC band 4/7 waves.
- Charter kf Tranche O: create docs/tranches/O/ with O.md and O.W0. Scope: (a) BC-gated waves (M.W8-Phase2 S1/S2 deletion, M.W-DESIGN-PAINT pixel-readback gate, M.W15 lighthouse hard-gate, M.WZ close); (b) unblocked kf-internal items (lerpArray swap, DemoControlPoint over Draggable, Oscillator npm republish); (c) dispatch asks to value.js for VJ-L1 and VJ-L3 with a P-inv-28 tracking row (chronicity 2 at O → triggers the belt at P if unresolved).
- Apply the M-RECONCILIATION.md §1 edit-spec to M.WZ.md: replace all 'glass-ui BB' references with 'glass-ui BC' and add the Phase-1 (4.0.1 FIRED) / Phase-2 (BC-gated) split. Also update M-RECONCILIATION.md §2 to note that M.W1 (proof:report-all, run-all.mjs) IS present on n-stage-impl (commit 5d047ac) and PASSES — the 'bridge gap' note is stale.
- Dispatch a VJ-L1 / VJ-L3 ask to value.js via the established kf-to-value.js dispatch protocol (a KF-TO-VALUEJS-P-ASKS.md). These two APIs (first-class flatLeaf / parseCSSSubValue) have been PENDING since the L tranche dispatch and were not addressed in O. S8 and S9 workarounds will remain PENDING indefinitely without this dispatch. At chronicity 2 entering kf-O, P-inv-28 fires at chronicity 4 (kf-P or kf-Q) if unresolved — name the terminal window explicitly.

---

