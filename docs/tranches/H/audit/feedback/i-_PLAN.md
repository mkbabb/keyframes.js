# i-_PLAN — the round-3 user-feedback fold (I1–I12) · the consolidated plan (PLAN LANE, triumvirate #3)

**Branch:** `tranche-h-impl` · **HEAD:** `f064cc1` (W0–W6 + W5 + W9 committed) · **In-flight:**
W10 (`H.W10.md`) LANDING CONCURRENTLY in the working tree (the easing/spring/motion-path/sequence
stage files are `M` = modified-uncommitted — the full-bleed G8 baseline is uncommitted and
immediately-superseded by I5; see §0).

**Charge (PLAN LANE).** Synthesize the user's round-3 feedback I1–I12 into ONE idiomatic plan,
decide the wave structure, and emit the gate list + supersede-map + the I5/G8 reversal + the genuine
USER-DECISION forks. DOCS-ONLY (write only under `docs/tranches/H/`); NO demo/src/scripts edit; NO
dist build (W10 impl owns dist). Grounds on SOURCE READS (cited `file:line`) + git history + the
frontend-design lens + the binding charter (`H.md §Mandate`).

**Research-lane note (honest provenance).** Of the five round-3 research notes, **only `i-r5`
(sequence + path, I3 focus) had LANDED at plan-author time**; `i-r1..i-r4` were being written
concurrently by the other research lanes and were MISSING. This plan therefore grounds I1/I2/I4/I5/
I6/I7/I8/I9/I10/I11/I12 on **direct source reads + git history + the landed W9/W10 specs + the deep-
audit lane notes** (`a-scene-state-machine`, `a-styling-idioms`, `a-easing-editor`, `a-demo-
architecture`, `a-scene-square-easing`), and folds `i-r5` in full for I3-sequence/path. When
`i-r1..i-r4` land, the IMPL lead reconciles them against this plan; nothing here contradicts i-r5
(the §I3/I5/I8 clauses are co-authored with it).

---

## §0 — The binding state at plan time (read first)

**The landed + in-flight ground truth (verified `file:line`):**

1. **W10 is uncommitted-in-flight.** `git status` shows `demo/easing/{EasingTarget,EasingSidebar,
   useEasingDemo}.vue`, `demo/spring/{SpringTarget,SpringSidebar,StartingStyleTarget,useSpringDemo}`,
   `demo/motion-path/MotionPathTarget.vue`, `demo/sequence/SequenceTarget.vue` all `M`. The W10 wave
   doc `eff11bf` is committed; the impl is mid-flight. **This plan's I-items SUPERSEDE specific W10
   decisions whose impl is still settling** — most importantly **I5 reverses W10 G8 full-bleed.**

2. **The four STAGE scenes are in THREE different states today (the load-bearing fact, from i-r5
   §0 + verified live):**
   - **easing/spring → FULL-BLEED, no card** (W10 G8 just applied): `EasingTarget.vue:2-10`
     ("FULL-BLEED stage … card is DROPPED"), `SpringTarget.vue:2-8`, `StartingStyleTarget.vue`.
   - **sequence/path → `glass-resting cartoon-surface` bare-class card** (W10 G8 NEVER reached
     them): `SequenceTarget.vue:3`, `MotionPathTarget.vue:3` — both `<div class="glass-resting
     cartoon-surface w-full flex-1 …">`, which carries **NO `border-radius`** (the glass-ui
     `cartoon-surface` `@utility` is decoration-only — 2px border + offset-stamp shadow + hover-lift,
     no radius; the radius lives on the `<Card>` root's `rounded-card`, verified
     `node_modules/@mkbabb/glass-ui/dist/styles/cards.css:33-48`). So sequence/path are SQUARE-
     corner cartoon panels — the exact I4 defect.
   - **I5's target → ALL FOUR on ONE standard non-cartoon glass `<Card>`** (glass, resting,
     `rounded-card` by construction).
   **This three-way split converging to ONE card register is the I5/I8/I12 isomorphism win.**

3. **The control PANELS keep cartoon+quiet** (W2/W9 register survives — `surface="cartoon"
   tier="quiet"` on the ~14 sidebar/ribbon Cards). **The STAGE scenes get a standard NON-cartoon
   glass `<Card>`.** Two registers, cleanly separated: cartoon = the control chrome (the
   direct-manipulation panels); glass-resting = the protagonist plate (the stage subject).

4. **The W1 FSM is the keystone (committed `256f6fe`).** `useSceneMachine` (`createGlobalState` +
   pure `transition(state,event)` reducer; states `idle|loading|playing|paused|suspended`; the route
   reconciled via one reader + one writer + echo-guard; the dock/`?anim=`/localStorage one-way
   projections). **I2 EXTENDS it (a per-scene control-VISIBILITY DFA + a transition perf budget) — it
   does NOT re-author it.** The W1 machine owns the scene+playback axes; I2 adds the orthogonal
   control-surface axis (which of `{controls|keyframes|timeline|easing|spring|matrix|...}` is VALID
   per scene) as an enumerated, gated table.

5. **The engine is fenced (`H.md §Mandate inv ζ`).** The only >500-line files are `src/animation/`
   (engine.ts 1375, animations.ts 870, group.ts 772, sequence.ts 628, spring.ts 491) — ALREADY-SOTA,
   NOT touched. **I10 targets DEMO components only**, where the max file is 418L (`useSpringDemo.ts`)
   — already under 500, D-tranche-decomposed. So I10 is verify + colocate, NOT manufacture splits.

**The binding spine (`H.md §Mandate`):** NO quick solutions / NO workarounds — idiomatic gestalt; NO
legacy beside its replacement; KISS · DRY; styling ISOMORPHIC unless a HIGHLY befitting NAMED delta;
MEASURE-FIRST (name a bench, do not assert — I2's perf budget); **inv-16** (glass-ui consumed
PUBLISHED; sibling items are HANDOFFs — the I4 rounded-card-primitive is a glass-ui HANDOFF); **inv
ζ** (chrome dogfoods the engine — the new I3 affordances dogfood `Sequence.add`/`ManualTimeline`/
`setChildTime().render()`, NO hand-rolled rAF); the chronic-closure discipline; every gate BITES
(born-RED today → GREEN on fix) + cites a `file:line`.

---

## §1 — The wave structure DECISION (recommendation + rationale)

**RECOMMENDED: TWO waves — H.W11 + H.W12.** (Forks documented in §7.)

This is a D/E-scale refinement layer (12 items, course-corrections + enrichment). A single wave
would be ~2× the size of W9/W10 and would conflate two distinct gestalts at two distinct altitudes —
the same reasoning that kept W9 (material register) and W10 (component/stage normalization) as two
waves rather than one. The clean cut is **the STAGE-and-layout gestalt** (the register/encapsulation/
DFA/layout-grid items that converge the four stage scenes + the control-surface state machine) vs
**the standardize/decompose/audit gestalt** (the share/encapsulation/brittleness/styling sweep +
the sequence/path enrichment + easter eggs):

| Wave | Headline | Items | Why these cohere |
|------|----------|-------|------------------|
| **H.W11 — the stage-card register + the control-surface DFA + the layout refinements** | the four stage scenes converge to ONE standard glass `<Card>` (I5 reverses W10 G8); the per-scene control-visibility DFA + transition perf budget (I2 extends W1); the uniform label subgrid (I1 refines W9 F1); the bezier panel de-nest + grow (I6/I7 refine W10/W9); rounding consumed-not-patched (I4) | ONE gestalt: **the rendered STAGE + the layout grid + the state that gates what renders.** I5 (card), I4 (rounded), I1 (subgrid), I6/I7 (bezier panel) are all "what the stage/panel surfaces look like"; I2 is "what surfaces are VALID per scene." They touch the SAME files (the four `*Target.vue`, the AnimationControls tab host, the stage-cell primitive) and MUST land together so the golden baseline locks the final stage state. |
| **H.W12 — component standardization · decomposition · encapsulation · brittleness/styling audit · sequence+path enrichment + easter eggs** | extract `useDragScrub` (I8); the composable/store encapsulation audit (I9); the colocation/decomposition verify (I10); the deep-nesting/brittle-selector audit (I11); the styling-idiom localization sweep (I12); the sequence draggable rows + editable motion-path + copy artifact + tangent readout (I3); one easter egg per scene (I3) | ONE gestalt: **the DRY/encapsulation/de-brittle sweep + the affordance enrichment that dogfoods it.** I8's `useDragScrub` is the seam I3's new affordances (sequence row-drag, path control-points) consume; I9/I10/I11/I12 are the audit lanes that share/colocate/de-brittle the SAME code I3 enriches. Doing I3 enrichment AFTER I8's extraction means the new affordances are born on the shared seam — no churn-then-delete. |

**Why NOT one wave:** the two gestalts have different supersede ledgers (W11 supersedes W10 G8 + W9
F1/F2; W12 RE-OPENS the W5-BOOKed `useDragScrub` + the F4 editable-path elevation) and different
risk profiles (W11 is mostly markup/CSS register swaps verified by computed-style gates; W12 is
behavioral extraction + new interactive affordances verified by interaction gates). Splitting keeps
each supersede-map honest and each gate set coherent.

**Why W11 BEFORE W12:** I5's card register (W11) is the container the W12 enrichments live inside;
I8's `useDragScrub` (W12) is consumed by I3's affordances (W12, same wave) so they co-land; the I2
DFA (W11) must enumerate sequence/path as `{stage-only}` BEFORE W12 enriches their self-contained
transport. W11 lands the structure; W12 fills it.

**Sequencing (the convergent landing):** `… W9 → W10 (full-bleed baseline, superseded) → **H.W11 →
H.W12** → H.W8 golden capture`. Both land AFTER W10, BEFORE the H.W8 `proof:visual-lock` baseline so
the golden state is the I5 glass-card stage + the enriched sequence/path + the localized idioms.

---

## §2 — H.W11 items (the stage-card register + the control-surface DFA + layout refinements)

### I5 — GLASS-CARD ENCAPSULATION (REVERSES W10 G8 full-bleed) — the headline

- **WHAT + WHY.** The easing, spring, sequence, AND path STAGE scenes get a STANDARD, NON-cartoon
  glass `<Card>` (default `tier="resting" surface="glass"`). The control PANELS stay cartoon+quiet
  (W2/W9). WHY: the user observed the W10 full-bleed easing stage live and wants a card background —
  "a standard, non-cartoon glass one" — on all four stage scenes. This is a SIMPLER state than
  today's three-way split (§0.2): one card register for all four protagonists.
- **file:line target.** REVERT the full-bleed on `EasingTarget.vue:2-10` (the `easing-target` div
  → wrap in/become `<Card>`), `SpringTarget.vue:2-8`, `StartingStyleTarget.vue`; SWAP `glass-resting
  cartoon-surface` → `<Card>` on `SequenceTarget.vue:3`, `MotionPathTarget.vue:3`. The card sits in
  the `[stage]` track, dock-contained by the `.stage-cell` primitive (`AnimationControlsGroup.vue:
  58,364-366` — `padding-block: var(--dock-band-reserve)`).
- **idiomatic approach.** Consume the glass-ui `<Card>` primitive (rounded by construction, glass-
  resting). Keep each scene's inner flex column + header/body/footer structure exactly — only the
  OUTER container changes (full-bleed div / bare cartoon div → `<Card>`). The four stage scenes
  converge to ONE card register — the I8/I12 isomorphism. **NAMED delta to consider (IMPL/MEASURE-
  FIRST):** the stage card may earn `shadow={false}` since it is the protagonist plate, not nested
  chrome — lead's call, set MEASURE-FIRST against the live render, not asserted here.
- **SUPERSEDE.** **I5 SUPERSEDES W10 G8's full-bleed-no-bg CONSEQUENCE.** W10 G8 had two altitudes:
  (a) the `.stage-cell` dock-band-reserve LAYOUT PRIMITIVE, and (b) the full-bleed SURFACE
  consequence. **I5 reverses ONLY (b)** — the card returns; **(a) the `.stage-cell` primitive
  SURVIVES** (it contains any stage subject — card or full-bleed — between the docks; the per-scene
  `dock-inset` STAYS deleted, no legacy beside the replacement). FORK A of W10 (full-bleed vs
  contained-card-with-bg) is now RESOLVED by the user toward the contained card. Treat W10 G8 full-
  bleed as the immediately-superseded baseline.
- **proof gate (born-RED today → green on fix):** `proof:stage-glass-card` — for each of {easing,
  spring, sequence, path} the stage SUBJECT root resolves a non-cartoon glass `<Card>`: computed
  `border-radius` is non-zero (the `rounded-card` token resolves) AND `backdrop-filter !== 'none'`
  AND the root is NOT `cartoon-surface` AND NOT the bare full-bleed div. **Reds TODAY** on
  easing/spring (full-bleed, no card → no radius/no backdrop) AND on sequence/path
  (`cartoon-surface` → `border-radius: 0`). Greens only when all four resolve a standard glass card.

### I4 — CARD ROUNDING baked into the PRIMITIVE

- **WHAT + WHY.** Every card rounded by default at the primitive level — "motion-path's card is NOT
  rounded — it should be impossible." WHY: a `cartoon-surface`-only `<div>` is square because the
  radius lives on the `<Card>` root, not the utility — leaving a bare-class card square is too easy.
- **file:line target.** The DEFECT is `SequenceTarget.vue:3` + `MotionPathTarget.vue:3` (bare
  `cartoon-surface` divs, `border-radius: 0`). The PRIMITIVE is the glass-ui `cartoon-surface`
  `@utility` (`cards.css:33-48` — no `border-radius` by design).
- **idiomatic approach.** TWO altitudes: **(in-demo, lands in W11)** — the I5 swap to `<Card>` makes
  sequence/path rounded with ZERO ad-hoc `rounded-*` literal (consume the primitive, don't patch the
  demo). I4 closes FOR FREE alongside I5 for the stage scenes. **(the deeper ask — a glass-ui
  HANDOFF, inv-16)** — bake rounding so a `cartoon-surface`-only div is impossible to leave square
  (e.g. `cartoon-surface` gains a `border-radius: var(--radius-card)` default, OR a `rounded-card`-
  carrying `cartoon-card` primitive). This is glass-ui-owned (consumed published, sibling = HANDOFF)
  — RECORD it as a born-RED-paired HANDOFF, do NOT patch in kf.
- **SUPERSEDE.** None landed (the un-rounded cartoon div was never a decided form — it is the W10 G8
  defect for sequence/path that G8 never reached). Composes into I5.
- **proof gate:** `proof:card-rounded-primitive` — (kf demo half) ZERO bare-class `cartoon-surface`
  `<div>` stage roots remain (grep: no `class="…cartoon-surface…"` on a stage `*Target.vue` root);
  every stage card resolves non-zero `border-radius`. (glass-ui HANDOFF half, born-RED) — a
  `cartoon-surface`-only element resolves a non-zero `border-radius` from the primitive itself (reds
  until glass-ui ships the default). The HANDOFF gate stays born-RED until the published bump; the kf
  half greens on the I5 `<Card>` swap.

### I1 — LABELS: uniform width via a CLEAN GRID + SUB-GRID

- **WHAT + WHY.** All labels the same width; a clean grid/subgrid for the label/input-value rows —
  refines W9 F1. WHY: W9 F1 restored label-LEFT/value-RIGHT rows via per-row `grid-cols-[auto_1fr]`,
  but each row derives its OWN `auto` label width — so labels are NOT uniform across rows. The user
  wants a UNIFORM label column across all rows (one derived width, not per-row auto).
- **file:line target.** The per-row `[auto_1fr]` rules: `EasingSidebar.vue:144-150` (`.panel-content
  :deep(.labeled-field){ grid-template-columns: auto 1fr }`), the standard `AnimationControlsControls
  .vue` rows (the W9 F1 site), `LayerConfigPanel.vue`; AND the manual fixed-width sequence labels
  `SequenceTarget.vue:25-27` (`w-20 text-right` — uniform-by-magic-literal, not by subgrid).
- **idiomatic approach.** Promote the per-row `grid-cols-[auto_1fr]` to a PARENT `grid` whose rows
  share ONE label track via CSS **`subgrid`**: parent `display: grid; grid-template-columns: [label]
  auto [value] 1fr`, each `.labeled-field` row `display: grid; grid-template-columns: subgrid;
  grid-column: 1 / -1`. The label column then derives from the WIDEST label across all rows — uniform
  by construction, the `w-20` magic literal dies. **The durable home is a glass-ui HANDOFF** (the
  W9-BOOKed `LabeledField orientation="horizontal"` extended to subgrid-participation); the demo-side
  parent-subgrid wrapper lands TODAY (born-GREEN path B, mirroring `AssetPropertiesPanel.vue:6`).
- **SUPERSEDE.** **I1 REFINES W9 F1** (per-row `[auto_1fr]` → parent subgrid, ONE uniform label
  column). The W9 F1 row-shape direction (label-left/value-right, one column) is PRESERVED and
  STRENGTHENED; only the per-row-auto-width is replaced by the subgrid-derived uniform width.
- **proof gate:** `proof:label-subgrid` — within each `Labeled*`-bearing panel, ALL leaf-row label
  cells resolve the SAME computed width (within ±1px tolerance) AND the parent uses `subgrid` (the
  rows participate in a shared track, not independent `auto`). Reds TODAY (per-row `auto` → labels of
  different widths across rows; sequence `w-20` is a magic literal not a derived track); greens on
  the subgrid. Non-vacuity: assert ≥3 rows with differing label text so the uniform width is a real
  constraint, not a one-row trivial pass.

### I2 — THE SCENE-STATE DFA (the per-scene control-VISIBILITY machine; EXTENDS W1)

- **WHAT + WHY.** Fully map every scene's valid states + which controls/views it shows, via a state
  machine/DFA. Example: the easing page shows ONLY "easing" — NOT keyframes, NOT timeline, NOT the
  full controls set. NO undefined behavior navigating between scenes AND all controls; proper STATE
  SUSPENSION + FULL RESUME on transition; MONITOR PERFORMANCE. WHY: today `AnimationControls.vue:
  20-22` hard-codes Controls|Keyframes|Timeline triggers for EVERY scene, and each scene poke-sets
  `isControlsPanelOpen`/`selectedControl` ad-hoc with reka-tab-fallback HACKS (`EasingScene.vue:
  27,29-32` "reka falls back to its first built-in tab"; `MotionPathScene.vue:25` `isControlsPanelOpen
  = false`; `SpringScene.vue:63-66`). The easing scene shows keyframes/timeline tabs that mean
  nothing for it. This is the per-scene control-surface VISIBILITY that has no formal owner.
- **file:line target.** `AnimationControls.vue:20-22` (the hard-coded 3-tab list),
  `AnimationControls.vue:8-9` (`selectedControl` model); the per-scene poke-sets
  `EasingScene.vue:27,29-32`, `SpringScene.vue:63-66`, `MotionPathScene.vue:25`,
  `CubeScene.vue:78-80,204` (matrix-controls tab). The W1 machine `useSceneMachine.ts` is the host.
- **idiomatic approach.** EXTEND the W1 FSM with an orthogonal **control-surface axis**: a static,
  per-scene table `controlSurfaces: Record<SceneId, ControlSurface[]>` where `ControlSurface ∈
  {controls, keyframes, timeline, easing, spring, matrix-controls, ...}`. The DFA enumerates EXACTLY
  which surfaces are VALID per scene (easing → `[easing]`; cube → `[controls, keyframes, timeline,
  matrix-controls]`; sequence → `[]` / `[transport-only]` (self-contained, `isControlsPanelOpen =
  false`); path → `[]`). `AnimationControls.vue` renders the tab triggers FROM this table (not the
  hard-coded list), so the easing scene shows ONLY easing — the reka-fallback hacks DIE (the table
  is the explicit owner the hacks were standing in for). The transition through the table routes
  through the W1 `SCENE_READY` event (state suspend on leave, full resume on the explicit ready
  event — the W1 contract, NOT re-authored). **This is the W1 keystone EXTENDED, not duplicated:** W1
  owns scene+playback; I2 adds the control-surface DFA keyed by scene.
- **MEASURE-FIRST (the I2 perf budget — name a bench, do not assert).** A NAMED transition perf
  bench, NOT an assertion: `bench:scene-transition` (vitest bench, or a Playwright `performance.
  measure` harness gated in `proof:scene-transition-perf`) measures the cross-scene navigate +
  control-surface re-render cost and asserts a BUDGET (e.g. transition settle < N ms at 1280/1440,
  the budget bound MEASURE-FIRST from the current W1 baseline). The budget number is set from a
  measured baseline during impl, not guessed here.
- **SUPERSEDE.** **I2 EXTENDS W1** (does NOT supersede). W1 owns the scene+playback machine + the
  one-way projections; I2 adds the control-VISIBILITY DFA as a third orthogonal axis. The W1 §Design-
  decision "two orthogonal axes (scene, playback)" becomes THREE (scene, playback, control-surface).
  The reka-tab-fallback hacks (`EasingScene.vue:29-32` etc.) are SUPERSEDED by the explicit table.
- **proof gates (two):**
  - `proof:scene-control-dfa` — for EVERY scene, the rendered control-surface set EXACTLY equals the
    DFA table entry (no extra, no missing): easing renders ONLY the easing surface (NO keyframes/
    timeline tab node exists); sequence/path render NO control panel (`isControlsPanelOpen=false`);
    cube renders its full set + matrix-controls. AND the navigation matrix is TOTAL: for every
    (scene → scene) pair the resulting control-surface set is DEFINED (no undefined behavior — every
    cell in the scene×control-surface table resolves). Reds TODAY (easing shows the hard-coded
    keyframes/timeline triggers via `AnimationControls.vue:20-22`); greens on the table-driven
    render. Builds on the W1 `proof:scene-isolation` plumbing.
  - `proof:scene-transition-perf` — the NAMED `bench:scene-transition` budget: cross-scene transition
    + control-surface re-render settles within the measured budget; state suspends on leave and FULLY
    resumes on `SCENE_READY` (round-trip identity, reusing the W1 `proof:scene-machine-irrefragable`
    identity-field-set, EXTENDED with the control-surface projection). Reds if the transition exceeds
    budget OR loses control-surface state across a round-trip.

### I6 — CUBIC BÉZIER double card (remove the INNER-MOST card)

- **WHAT + WHY.** The bezier panel nests a card inside a card — drop the inner one. WHY: the bezier
  detail editor is rendered as a `<Card surface="cartoon" tier="quiet">` (`TimingFunctionPanel.vue:
  15`) INSIDE the `AnimationControlsControls.vue` host (`:119` renders `<TimingFunctionPanel>` within
  the controls panel Card) — card-in-card.
- **file:line target.** `TimingFunctionPanel.vue:15` (the inner `<Card surface="cartoon"
  tier="quiet">`) rendered inside the controls host at `AnimationControlsControls.vue:119`. (The
  steps variant `:87` is the same shape.)
- **idiomatic approach.** Drop the INNER `<Card>` wrapper — the bezier editor's `CardHeader`/
  `CardContent` flow into the parent controls Card's content directly (the detail panel is a VIEW
  within the controls Card, not its own card). Verify the host already provides the framed surface
  (`AnimationControlsControls.vue` is itself a `Card surface="cartoon"`) so the inner card is pure
  duplication. NO legacy beside the replacement (delete the inner Card, don't `display:none` it).
- **SUPERSEDE.** **I6 REFINES the W9 F2 / W10 bezier-panel form** (W9 F2 baked the back-button into
  the inner Card's header; I6 removes that inner Card entirely — the header/back move to the parent
  flow). The W9 F2 "title-left / dismiss-right" header pattern is PRESERVED, just re-homed onto the
  parent content (no inner card).
- **proof gate:** `proof:bezier-single-card` — the cubic-bézier detail panel has EXACTLY ONE `<Card>`
  ancestor between the bezier canvas and the controls-pane root (no card-in-card). Reds TODAY (the
  inner `TimingFunctionPanel.vue:15` Card nested inside the `AnimationControlsControls` Card → 2
  cards); greens on the inner-card removal. Static parse + computed-depth check.

### I7 — the EASING PANEL is too small (make the bezier controls BIG; remove the "editing:" subtitle)

- **WHAT + WHY.** The easing panel is too small — make the bezier controls as BIG as possible within
  the container, make it TALLER; and REMOVE the "editing: ease-in-out" sub-title. WHY: W9 F2 TIGHTENED
  the in-panel canvas ceiling to `clamp(160px, 38cqi, 220px); max-block-size: 220px`
  (`TimingFunctionPanel.vue:251-252`) to fit-without-scroll, which made it SMALL; the user wants it
  bigger. The "editing: …" subtitle is `TimingFunctionPanel.vue:33` (`<p v-if="editingCurveName">
  editing: {{ editingCurveName }}</p>`).
- **file:line target.** `TimingFunctionPanel.vue:251-252` (the `:deep(.easing-curve-canvas)` ceiling
  `clamp(160px,38cqi,220px); max-block-size:220px`) — GROW it; `TimingFunctionPanel.vue:33` (the
  "editing:" subtitle) — DELETE.
- **idiomatic approach.** RAISE the in-panel canvas ceiling so the editor fills the container height
  (the I6 inner-card removal frees vertical space — the two compose: remove the inner card → more
  room → grow the canvas to fill it). The square LAW (`aspect-ratio: 1` from `EasingCurveCanvas`) is
  PRESERVED — only the `block-size`/`max-block-size` ceiling rises. DELETE the "editing:" subtitle row
  (it is redundant — the curve + the live `cubic-bezier(...)` readout already say what is being
  edited). MEASURE-FIRST: confirm the grown canvas still fits the detail-panel cap without re-
  introducing scroll (compose with W9's `proof:bezier-no-scroll`).
- **SUPERSEDE.** **I7 REFINES W9 F2** (which tightened the in-panel ceiling to 220px for fit) AND
  W4's `proof:easing-canvas-bounded`. The W9 F2 fit-without-scroll invariant is PRESERVED (the grown
  canvas must still fit), but the ceiling rises within that constraint. The "editing:" subtitle (a
  W4/W9-era element) is removed.
- **proof gate:** `proof:bezier-panel-taller` — the in-panel `.easing-curve-canvas` resolved
  `block-size` is GREATER than the W9 220px ceiling (the panel grew) AND no "editing:" text node
  exists in `TimingFunctionPanel` (grep: the `editing:` subtitle removed) AND the panel still fits
  (`scrollHeight ≤ clientHeight`, reusing W9 `proof:bezier-no-scroll` plumbing). Reds TODAY (canvas
  capped at 220px; the "editing:" `<p>` at `:33` present); greens on the grow + subtitle removal.

---

## §3 — H.W12 items (standardize · decompose · encapsulate · de-brittle · style · enrich)

### I8 — STANDARDIZE components (share more between scenes; extends W10 G3/G6)

- **WHAT + WHY.** Share more between scenes, normalize them. WHY: sequence/path/spring/easing each
  hand-roll the SAME pointer-drag scrub dance (the rect→ratio + pointer-capture + window-listener
  pattern); the transport buttons diverge; the stage cards diverged (closed by I5). The biggest
  share-win is the drag seam (i-r5 §3.2).
- **file:line target.** The drag-scrub copies: `SpringTarget.vue:88-93` (`positionFromEvent`),
  `SequenceTarget.vue` (master-scrub `progressFromEvent`), `MotionPathTarget.vue:124-147`
  (`projectPointer`). The transport skin: sequence's bespoke `grid-cols-4` transport vs the standard
  `PlaybackRibbon.vue:26,73-76` `.btn-playback` skin.
- **idiomatic approach.** Extract **`useDragScrub({ el, onScrub, project })`** into `demo/@/
  composables/` (the I9 encapsulation seam) — owns pointer-capture + window pointermove/up + clamp;
  each scene supplies only its `project` (rect-ratio for rails; nearest-point-on-path for motion-
  path). Spring/sequence/path all consume it; I3's new affordances (sequence row-drag, path control-
  points) are BORN on it. Share the `.btn-playback` SKIN for sequence Play/Reverse (keep its domain-
  specific timeScale/Reset as `.btn-interactive` extras — the cube model: domain verbs beside the
  standard transport; do NOT force sequence onto `PlaybackRibbon` which lacks timeScale). **Share the
  idioms, keep the scene-specific structure that earns its difference.**
- **SUPERSEDE.** EXTENDS W10 G3/G6 (component normalization) to the last two un-normalized scenes
  (sequence/path) WITHOUT forcing them onto `PlaybackRibbon`. RE-OPENS the W5-BOOKed `useDragScrub`
  extraction (`H.W5.md:66` BOOKed at 2 consumers / MEASURE-FIRST threshold; now at 3–5 consumers,
  over threshold — i-r5 §3.2).
- **proof gate:** `proof:dragscrub-single` — ≤1 hand-rolled `getBoundingClientRect()`-ratio +
  `setPointerCapture` + `window.addEventListener('pointermove')` drag block across spring/sequence/
  motion-path (the shared `useDragScrub` is the single home). Reds TODAY (3–4 hand-rolled copies);
  greens on the single extraction. Static grep across the scene targets.

### I9 — ENCAPSULATION audit (composables, useX's, state + store management)

- **WHAT + WHY.** Better encapsulation + consistency across composables/useX's/state-store
  management. WHY: `useMotionPathDemo.ts` (49L) is anomalously thin — ALL the drag/projection/
  ManualTimeline logic lives in `MotionPathTarget.vue:79-220`, unlike sequence/spring whose
  composables own the engine + transport (i-r5 §W-MP-5). Store-management consistency post-W1.
- **file:line target.** `useMotionPathDemo.ts` (thin), `MotionPathTarget.vue:79-220` (gesture engine
  in the Target); the W1 stores (`scenePlayback.ts`, `controlOptionsStore.ts`, `animationOptionsStore
  .ts`) for the single-writer / pure-reads consistency the W1 ST-7/ST-9 findings began.
- **idiomatic approach.** Move the motion-path projection + scrub-seam + ManualTimeline logic from
  the Target into `useMotionPathDemo.ts` (or into the shared `useDragScrub` of I8 with a path
  `project`) — the Target holds refs + markup, the composable holds the gesture engine, matching
  sequence/spring's shape. Audit the W1 stores for the single-writer / pure-getter discipline (the
  exported surface is `dispatch()` + readonly refs; no read-with-write-side-effect getters). KISS —
  consistency, not a rewrite (W1 already landed the FSM; this is the consistency tail).
- **SUPERSEDE.** None — verify + tidy the W1/W10 encapsulation. Composes with I8 (the `useDragScrub`
  home is the I9 seam) and I3 (the gesture engine moves to the composable BEFORE I3 enriches it).
- **proof gate:** `proof:composable-encapsulation` — `useMotionPathDemo` owns the project/scrub/
  ManualTimeline logic (the Target's `<script>` holds NO `getBoundingClientRect`/`getTotalLength`
  projection math); AND no store getter outside `useSceneMachine`/the store modules has a write side-
  effect (pure reads). Structural + grep. Reds TODAY (the gesture engine in `MotionPathTarget.vue`);
  greens on the lift.

### I10 — DECOMPOSITION (break large components; colocate; modern Vue patterns)

- **WHAT + WHY.** Break large components (>500L especially) into smaller sub-components when
  befitting; colocate components + composables; logical grouping WITHOUT contrivance; KISS. WHY: the
  NOTE in the feedback itself — the only >500-line files are `src/animation/` ENGINE files (FENCED,
  ALREADY-SOTA); this targets DEMO components, which D-tranche largely decomposed.
- **file:line target (VERIFIED).** NO demo file exceeds 500L (max: `useSpringDemo.ts` 418,
  `AnimationControlsGroup.vue` 417, `useEasingDemo.ts` 389, `EasingCurveCanvas.vue` 373,
  `useSequenceDemo.ts` 372, `AnimationControlsControls.vue` 371, `EasingTarget.vue` 339). The engine
  files (engine.ts 1375, animations.ts 870, group.ts 772, sequence.ts 628, spring.ts 491) are FENCED
  — do NOT touch (`H.md inv ζ`; I10 NOTE).
- **idiomatic approach.** VERIFY (do NOT manufacture splits — the demo is already decomposed). Where
  BEFITTING: colocate a scene's component + composable + constants into its dir (sequence/path
  already have `useXDemo.ts` + `*Keys.ts` + geometry beside the Target — confirm coherent); a
  complex component → a sub-component dir (components/composables/constants) ONLY if a genuine
  cohesion ceiling is crossed. KISS — no contrivance, no over-engineering. This is largely a CONFIRM-
  GREEN lane with targeted colocation, not a split campaign.
- **SUPERSEDE.** None — verify the D-tranche decomposition holds; colocate the I8/I9 extractions
  (`useDragScrub` beside its consumers' shared home).
- **proof gate:** `proof:demo-no-oversize` — every DEMO `.vue`/`.ts` (excluding `src/`,
  `node_modules/`, `dist/`) is ≤500L; AND each scene dir colocates its Target + composable + keys
  coherently (no orphan composable in a wrong dir). Reds if any demo file crosses 500L OR a manufac-
  tured split leaves an orphan; greens on the verified-decomposed + colocated state. (Born-GREEN on
  the 500L clause TODAY — the bite is the REGRESSION guard: a future I3 enrichment must not push a
  Target over 500L without a colocated split.)

### I11 — BRITTLENESS audit (deeply-nested / brittle selectors in CSS OR reactivity)

- **WHAT + WHY.** Deeply-nested or brittle selector usage in CSS OR reactivity. WHY: the motion-path
  `SAMPLE_STEP = 5` nearest-point search + the implicit-square-viewBox client→user scale
  (`MotionPathTarget.vue:118-147`) is magic-number + coupling-brittle; `:deep()` chains and `.closest
  (".class")` DOM walks are selector-brittle (the W3/W10 era already replaced some with owned refs).
- **file:line target.** `MotionPathTarget.vue:118-147` (the `SAMPLE_STEP` + scale coupling),
  `:131-134` (the client→user-unit scale assuming a square viewBox); any residual `.closest()`/
  `querySelector(".class")` DOM walks; brittle `:deep()` chains in the scene styles.
- **idiomatic approach.** Name `SAMPLE_STEP` as a documented coarse-search resolution OR replace the
  linear walk with coarse-then-refine; assert the square-viewBox invariant explicitly (`.mp-stage`
  is `aspect-ratio: 1` — document the coupling so a future non-square stage cannot silently mis-
  project). Replace any class-string DOM walk with owned `useTemplateRef`s (the established W3/W10
  pattern). De-brittle, don't rewrite.
- **SUPERSEDE.** None — a de-brittle tail on the W5/W10 affordances (composes with I8's `useDragScrub`
  which absorbs the projection math).
- **proof gate:** `proof:no-brittle-selector` — ZERO `.closest("…class…")` / `querySelector(".…")`
  class-string DOM walks in the scene targets (owned refs instead); AND the motion-path projection
  has a NAMED constant + a documented viewBox invariant (no bare magic `5` step + implicit square
  coupling). Reds TODAY (the `SAMPLE_STEP` magic + scale coupling); greens on the named constant +
  documented invariant.

### I12 — STYLING audit (isomorphic unless HIGHLY befitting; localize idioms; idiomatic Tailwind)

- **WHAT + WHY.** (1) non-idiomatic Tailwind; (2) monolithic/global stylesheet → colocate/component-
  scope; (3) deprecated/archaic CSS; (4) fragile rules (magic numbers, brittle calc()/min()/max()
  chains, viewport-unit traps, z-index coupling, browser breakage). Idiomatic Tailwind `@apply`s for
  style/anim/color; a LOCALIZED area defining design idioms while leveraging proper COLOCATION;
  design cohesion. WHY: `a-styling-idioms` found the OWNED-IDIOMS contract under-enumerated — e.g.
  `icon-sm/md/lg/xs` were 61 SILENT NO-OP classes. **HARDEN CORRECTION: that finding is STALE — W4
  (`084feb9`) ALREADY DEFINED all four `@utility icon-(xs|sm|md|lg)` in `design-idioms.css:209-232`
  AND authored the live gate `scripts/proof-icon-idiom.mjs` (`proof:icon-idiom`, GREEN). The icon
  no-op is CLOSED.** The genuinely-open remainder: the contract MEMBERSHIP only polices those four;
  `depth-text`/`text-mono-caption` resolve transitively via glass-ui (grace rents), NOT through the
  kf-owned contract — so the membership should extend to the FULL referenced-idiom set.
- **file:line target.** `a-styling-idioms.md:43-87` (the 61-site `icon-*` no-op idiom — a PRE-W4
  finding W4 CLOSED); the `design-idioms.css` OWNED-IDIOMS contract (`:209-232` the W4 `icon-*`
  family lives here) for the membership extension; the scene-scoped styles for the magic-number /
  brittle-calc / isomorphism / colocation review.
- **idiomatic approach.** The icon-sizing idiom is ALREADY OWNED (W4) — do NOT re-author it. EXTEND
  the OWNED-IDIOMS contract membership from the four `icon-*` (already defined + gated) to the full
  referenced-idiom set (so a referenced-but-undefined idiom-shaped class reds). Audit scene styles:
  colocate component-scoped idioms, hoist truly-shared ones to the localized `design-idioms.css`
  area, kill magic numbers / brittle calc chains / viewport-unit traps. Idiomatic Tailwind `@apply`
  for the shared style/anim/color idioms. ISOMORPHIC unless a HIGHLY befitting NAMED delta.
- **SUPERSEDE.** None — a styling-idiom localization sweep extending the W4 `proof:icon-idiom` +
  G.W10 + D.W2 contract; co-authored with the design-cohesion of I5's new card register.
- **proof gate:** `proof:styling-idioms` — (a) the OWNED-IDIOMS contract membership covers the FULL
  referenced-idiom set beyond the W4-owned `icon-*` four — a referenced-but-undefined idiom-shaped
  class reds (MEASURE-FIRST whether ≥1 such class exists; the four `icon-(xs|sm|md|lg)` ALREADY
  resolve via `design-idioms.css:209-232`, so they do NOT bite here); (b) no NEW magic-number /
  brittle-calc regressions in the scene styles. **Born-RED on (a) ONLY if the membership probe finds
  a referenced-but-undefined idiom-shaped class; if NONE, (a) reduces to a born-GREEN regression
  guard (recorded honestly, NOT papered as a born-RED that does not bite).** EXTENDS the W4
  `proof:icon-idiom` plumbing (already green for the four `icon-*`) to the full referenced set.

### I3 — SEQUENCE + PATH greatly refined + frontend-design usability pass + EASTER EGGS (folds i-r5)

- **WHAT + WHY.** Sequence + path greatly refined; a frontend-design pass auditing every scene for
  usability/affordance/interactability; a few easter eggs per scene. WHY: sequence rows are READ-ONLY
  (the `stagger`/`at:` distribution is invisible-as-tunable — i-r5 §W-SEQ-4); the motion-path AUTHOR
  PATH is FIXED (control points not editable — i-r5 §W-MP-2, the BOOKed F4 elevation); no copy-the-
  `offset-path` artifact (i-r5 §W-MP-3). i-r5 is the binding research note for this item.
- **file:line target (from i-r5).** Sequence: `SequenceTarget.vue` (the storyboard rows :19-38, the
  bespoke `grid-cols-4` transport :68-106, the `w-20` labels :25-27); `useSequenceDemo.ts:117-120`
  (the `at:` re-sort the row-drag re-emits into). Motion-path: `MotionPathTarget.vue` (the SVG guide
  host :18-24, `projectPointer` :124-147, the traveller :42); `motionPathGeometry.ts:1-11` (the
  single-source `PATH_D` the editable control-points re-emit).
- **idiomatic approach (the headline refinements, from i-r5 §1.3 / §2.3):**
  - **Sequence:** draggable storyboard rows that re-author each child's `at:` offset live (the GSAP-
    timeline gesture, H-MI-4 re-opened) — dogfooding `useDragScrub` (I8) + the engine `Sequence.add`/
    re-sort (`useSequenceDemo.ts:117-120`, inv ζ). FLOOR (MEASURE-FIRST): a single stagger-amount
    slider re-deriving all five `at:` from one `each`. PLUS a swept master-playhead line across the
    rows (the stagger SEEN as a swept playhead, pure CSS). PLUS share the `.btn-playback` skin (I8).
  - **Motion-path:** editable path via draggable SVG control points (the F4 elevation, landed at
    last) — a handle drag re-emits `PATH_D` and BOTH the guide `<path>` `d` AND the traveller's
    `offset-path` re-read it in lockstep (the single-source invariant `motionPathGeometry.ts:1-11`
    guarantees no drift). PLUS a "copy `offset-path`" artifact (the second copy-paste output beside
    Discrete's `linear()`). PLUS a tangent-angle readout. FLOOR (MEASURE-FIRST): 2–3 named preset
    paths. Dogfood `useDragScrub` (I8) with a path `project`.
  - **Frontend-design pass:** the `frontend-design` skill audits EVERY scene (not just sequence/path)
    for usability/affordance/interactability — recorded as a per-scene usability checklist within the
    wave, the refinements folded where befitting.
- **EASTER EGGS (one per scene; i-r5 recommends the primary; lead selects):** Sequence → **EE-SEQ-1
  "the reel"** (a hidden trigger replays the five balls as a cascading Mexican-wave overshoot, reusing
  the engine children); Motion-path → **EE-MP-2 "the emoji winks"** (a full-lap drag — 0%→100% on the
  closed loop — swaps the 🙂‍↔️ glyph). One egg per other scene divined in the frontend-design pass.
- **SUPERSEDE.** Composes with I5 (sequence/path gain the standard card), I8 (the affordances are
  born on `useDragScrub`), I9 (the motion-path gesture engine moves to the composable first). RE-OPENS
  the W5-BOOKed H-MI-4 (sequence row-drag, `a-scene-spring-sequence.md:273-277`) + the F4 editable-
  path elevation (`a-scene-path-discrete.md:135-137`).
- **proof gates (from i-r5 §4):**
  - `proof:sequence-rows-draggable` — drag a sequence row handle → its `at:`/`delays[i]` changes AND
    the `Sequence` re-sorts (reds today: rows read-only).
  - `proof:motion-path-editable` — drag a control handle → the guide `<path>` `d` AND the traveller's
    `offset-path` BOTH change to the SAME `d` (reds today: fixed `PATH_D`).
  - `proof:motion-path-copy` — a copy affordance emits `offset-path: path(…)` (reds today: none).
  - `proof:easter-egg` — EACH scene has its egg: a hidden trigger produces an observable, off-the-
    normal-path effect (sequence reel, path emoji-wink, + one per other scene). Reds today (no eggs);
    greens when each scene's trigger fires its effect.

---

## §4 — The consolidated gate list (every gate BITES, born-RED today → green on fix)

| Gate | Item(s) | Wave | BITE (born-RED today → green on fix) |
|------|---------|------|--------------------------------------|
| `proof:stage-glass-card` | I5 | W11 | all four stage scenes resolve a standard glass `<Card>` (non-zero radius + backdrop-filter + NOT cartoon + NOT full-bleed); reds on easing/spring (full-bleed) AND sequence/path (`cartoon-surface`, radius 0) |
| `proof:card-rounded-primitive` | I4 | W11 (+glass-ui HANDOFF) | ZERO bare-class `cartoon-surface` stage roots; every stage card non-zero radius; (HANDOFF born-RED) a `cartoon-surface`-only element rounds from the primitive |
| `proof:label-subgrid` | I1 | W11 | ALL leaf-row label cells share ONE computed width (±1px) via `subgrid`; ≥3 differing-text rows; reds on per-row `auto` + the `w-20` literal |
| `proof:scene-control-dfa` | I2 | W11 | each scene renders EXACTLY its DFA control-surface set (easing → only easing; no keyframes/timeline node); the (scene→scene) navigation matrix is TOTAL (no undefined); reds on the hard-coded 3-tab list |
| `proof:scene-transition-perf` | I2 | W11 | the NAMED `bench:scene-transition` budget met; state suspends-and-fully-resumes across a round-trip (EXTENDS W1 identity-field-set with the control-surface projection) |
| `proof:bezier-single-card` | I6 | W11 | EXACTLY ONE `<Card>` between the bezier canvas and the controls-pane root; reds on the inner `TimingFunctionPanel.vue:15` card nested in the host card |
| `proof:bezier-panel-taller` | I7 | W11 | in-panel canvas `block-size` > the W9 220px ceiling AND no "editing:" text node AND still fits (no scroll); reds on the 220px cap + the `:33` subtitle |
| `proof:dragscrub-single` | I8 | W12 | ≤1 hand-rolled rect-ratio+pointer-capture+window-listener drag block across spring/sequence/path; reds at 3–4 copies |
| `proof:composable-encapsulation` | I9 | W12 | `useMotionPathDemo` owns the gesture engine (Target holds no projection math); pure store getters; reds on the gesture engine in the Target |
| `proof:demo-no-oversize` | I10 | W12 | every demo file ≤500L + coherent colocation (regression guard; born-GREEN on 500L today, bites a future over-split) |
| `proof:no-brittle-selector` | I11 | W12 | ZERO class-string DOM walks in scene targets; named motion-path constant + documented viewBox invariant; reds on `SAMPLE_STEP` magic + scale coupling |
| `proof:styling-idioms` | I12 | W12 | OWNED-IDIOMS contract covers the FULL referenced-idiom set (a referenced-but-undefined idiom-shaped class reds) + no NEW magic-number/brittle-calc regressions. NB — the four `icon-(xs\|sm\|md\|lg)` ALREADY resolve (W4 `084feb9`, `design-idioms.css:209-232`, gate `proof:icon-idiom` GREEN); the "61 no-op" finding is W4-CLOSED, so this gate does NOT re-litigate it. Born-RED only if the membership probe finds a referenced-but-undefined idiom beyond `icon-*`; else reduces to a born-GREEN regression guard (recorded honestly — `i-_HARDEN.md` FORK-I12) |
| `proof:sequence-rows-draggable` | I3 | W12 | drag a row handle → `at:`/`delays[i]` changes + `Sequence` re-sorts; reds on read-only rows |
| `proof:motion-path-editable` | I3 | W12 | drag a control handle → guide `d` AND traveller `offset-path` both change to the SAME `d`; reds on fixed `PATH_D` |
| `proof:motion-path-copy` | I3 | W12 | a copy affordance emits `offset-path: path(…)`; reds on none |
| `proof:easter-egg` | I3 | W12 | EACH scene has its egg (hidden trigger → observable effect); reds on no eggs |

**Gate-authoring home:** per `H.W8.md §Scope` the gate-regime wave OWNS authoring; W11/W12's NEW
born-RED clauses wire into `proof:*` + `proof:all`; the H.W8 `proof:visual-lock` named-region matrix
captures the FINAL state (glass-card stages, uniform subgrid, enriched sequence/path) AFTER W12 lands.
Every browser gate settle-gates on the W1 FSM resting. No gate passes by `display:none`/`!important`
suppression — the inner card DIES (subtree deleted), the drag copies COLLAPSE (one extraction), the
icon idiom RESOLVES (defined, not suppressed).

---

## §5 — The supersede-map + the I5/G8 reversal (the honest ledger)

| Item | Landed/in-flight decision SUPERSEDED or EXTENDED | The revision | Why precept-consistent |
|------|--------------------------------------------------|--------------|------------------------|
| **I5** | **W10 G8 full-bleed-no-bg CONSEQUENCE** (`EasingTarget.vue:2-10`, `SpringTarget.vue:2-8` full-bleed; `SequenceTarget.vue:3`/`MotionPathTarget.vue:3` un-rounded cartoon) — W10 FORK A's full-bleed default | ALL FOUR stage scenes → ONE standard non-cartoon glass `<Card>` (rounded by construction) | the user's direct round-3 direction (observed live); W10 FORK A explicitly flagged "needs the user's call ONLY if they reject full-bleed" — they did; consume the `<Card>` primitive (KISS·DRY, no ad-hoc `rounded-*`); the four scenes converge to ONE register (the I8/I12 isomorphism); **the `.stage-cell` LAYOUT PRIMITIVE half of G8 SURVIVES** (only the surface consequence reverses; `dock-inset` stays deleted — no legacy beside the replacement) |
| **I4** | (no landed decision) the bare `cartoon-surface` divs miss `rounded-card` | sequence/path consume `<Card>` (rounded by construction, via I5); the deeper primitive default is a glass-ui HANDOFF | REUSE the primitive (one radius token); the cross-repo half is inv-16 HANDOFF (sibling = handoff), born-RED-paired |
| **I1** | **W9 F1** — per-row `grid-cols-[auto_1fr]` (each row its own `auto` label width) | parent `subgrid` → ONE uniform label column across rows; the `w-20` literal dies | REFINES, doesn't fork — the F1 label-left/one-column direction is PRESERVED + strengthened; the durable home is the glass-ui `LabeledField` HANDOFF |
| **I2** | **W1 FSM** (EXTENDS, not supersedes) + the per-scene reka-tab-fallback HACKS (`EasingScene.vue:29-32` etc.) | a per-scene control-VISIBILITY DFA (a 3rd orthogonal axis on W1) + a transition perf budget; the table-driven render REPLACES the hard-coded 3-tab list + the fallback hacks | the W1 keystone is EXTENDED not re-authored (the spine: I2 deepens W1); the hacks are SUPERSEDED by the explicit owner they stood in for; MEASURE-FIRST (the named bench, not an assertion) |
| **I6** | **W9 F2 / W10** bezier-panel form (the inner `<Card>` with the baked-in header) | drop the inner Card; the header/back flow into the parent controls Card | KISS·DRY — no card-in-card; the F2 title-left/dismiss-right pattern is PRESERVED, re-homed; no legacy beside the replacement |
| **I7** | **W9 F2** (the 220px in-panel ceiling) + the "editing:" subtitle (W4/W9-era) | grow the canvas within the fit-without-scroll constraint; delete the subtitle | REFINES F2 (the fit invariant holds; the ceiling rises); the subtitle is redundant clutter (the curve + readout already say it) |
| **I8** | **W10 G3/G6** (EXTENDS) + the W5-BOOKed `useDragScrub` (`H.W5.md:66`) | extract `useDragScrub`; share the `.btn-playback` skin to sequence | RE-OPENS the BOOK now over its 3-consumer threshold (MEASURE-FIRST satisfied); share idioms, keep earned differences |
| **I9/I10/I11/I12** | (no landed decision) | verify/tidy/de-brittle/localize | consistency tails on W1/W5/W10; ISOMORPHIC unless a NAMED delta (the icon-size differentiation) |
| **I3** | **W5-BOOKed** H-MI-4 (sequence row-drag) + the F4 editable-path elevation | land both (the headline refinements) + easter eggs | RE-OPENS the deferred enrichments under the user's "greatly refined" mandate; dogfood the engine (inv ζ) + the shared seam (I8) — no churn |

**THE I5/G8 REVERSAL (stated explicitly, the load-bearing supersede):** W10 G8 = `.stage-cell` dock-
band-reserve PRIMITIVE (altitude a) + full-bleed-no-bg SURFACE (altitude b). **I5 reverses ONLY
altitude (b):** the full-bleed easing/spring stage GAINS a standard glass `<Card>` back; the un-
rounded cartoon sequence/path cards SWAP to the same standard glass `<Card>`. **Altitude (a) — the
`.stage-cell` primitive — SURVIVES untouched** (it contains any stage subject, card or not, between
the docks; the `dock-inset` deletion STAYS — no legacy beside the replacement). The four stage scenes
converge from THREE states (full-bleed / cartoon-square / target) to ONE standard glass-card register.
Treat W10's full-bleed as the immediately-superseded baseline.

---

## §6 — Reconciliation with W1 (DFA extends it) + W9/W10 (the supersedes)

- **W1 (the keystone) — I2 EXTENDS, never re-authors.** W1's `useSceneMachine` owns the scene +
  playback axes + the route reconcile + the one-way projections. I2 adds the control-VISIBILITY axis
  (a per-scene `controlSurfaces` table) as a THIRD orthogonal axis on the SAME machine — the W1
  `SCENE_READY` suspend/resume contract carries the control-surface state (the round-trip identity
  EXTENDS the W1 `proof:scene-machine-irrefragable` field set with `{selectedControl, control-
  surfaces}`). The W1 `proof:single-writer`/`proof:no-route-storm`/`proof:scene-isolation` plumbing
  is REUSED, not duplicated. **Do NOT touch `useSceneMachine`'s reducer beyond adding the orthogonal
  table + the surface-projection.**

- **W9 — I1/I6/I7 REFINE its F1/F2.** I1 refines F1's per-row split to a parent subgrid (uniform
  label column); the F1 label-left/one-column invariant is PRESERVED (`proof:single-column-pack`
  stays green; `proof:label-subgrid` ADDS the uniform-width clause). I6 removes the inner card F2
  baked the header into; the F2 header pattern re-homes to the parent flow. I7 grows the canvas F2
  tightened to 220px, within F2's fit-without-scroll invariant (`proof:bezier-no-scroll` stays green;
  `proof:bezier-panel-taller` ADDS the grow clause). **The W9 calm cartoon+quiet PANEL register is
  UNTOUCHED** — I5's glass-card is the STAGE register, orthogonal to the panel register.

- **W10 — I5 SUPERSEDES G8 (b); I8 EXTENDS G3/G6.** The full-bleed reversal is §5's headline. W10's
  colorful-icon reversal (G1), the standard-ribbon normalization (G3/G7), the engine-ball easing
  stage (G4), the normalized sidebars (G5/G6) all SURVIVE — I5 only changes the stage CONTAINER
  (full-bleed div → glass `<Card>`), keeping the engine-driven ball, the standard ribbon, the
  normalized sidebar inside it. I8 extends G3/G6's normalization to sequence/path via the shared
  `useDragScrub` + `.btn-playback` skin (NOT forcing them onto `PlaybackRibbon`).

---

## §7 — USER-DECISION forks (genuine forks; each with a RECOMMENDED default)

1. **FORK W (wave structure) — TWO waves (W11 + W12) vs ONE large wave.** RECOMMENDED: TWO (§1
   rationale — two gestalts, two supersede ledgers, two risk profiles). Adopt unless the user prefers
   a single consolidated wave. **Lead-tuning, not a hard user fork** — the IMPL lead may merge if the
   scope measures small; documented so the user can pivot.

2. **FORK I5-shadow (NAMED delta) — the stage `<Card>` with `shadow` vs `shadow={false}`.**
   RECOMMENDED: MEASURE-FIRST against the live render — the protagonist plate may read cleaner without
   a nested shadow. Lead's call set during impl, NOT asserted here. Not a hard user fork.

3. **FORK I3-rung (the enrichment floor vs full).** Sequence: full per-row drag (I3-faithful) vs the
   stagger-amount-slider FLOOR. Motion-path: full editable cubic control-points (I3-faithful) vs the
   2–3 preset-paths FLOOR. RECOMMENDED: the FULL target for both (the user said "greatly refined");
   the FLOOR is the MEASURE-FIRST scope-guard if the wave slips. Lead picks the rung; documented as
   the explicit guard.

4. **FORK I4-handoff timing — wait for the glass-ui rounded-primitive vs land the in-demo `<Card>`
   swap now.** RECOMMENDED: land the in-demo `<Card>` swap in W11 (closes I4 for the stage scenes via
   consumption); RECORD the glass-ui primitive default as a born-RED-paired HANDOFF (inv-16). The kf
   gate greens now on the swap; the HANDOFF gate stays born-RED until the published bump. No user
   decision needed unless they want kf to block on the glass-ui bump (not recommended).

**No other item needs a user decision** — I1/I2/I6/I7/I8/I9/I10/I11/I12 are decisive (the source-
grounded idiomatic fix is unambiguous). The I2 perf-budget NUMBER, the I1 subgrid column-gap, the I7
canvas ceiling, and the easter-egg selection are MEASURE-FIRST / lead-tuning calls set during impl,
not user forks.

---

## §8 — Convergence + sequencing (the landing order)

```
… W9 (committed)
   → W10 (full-bleed G8 baseline — IN-FLIGHT, immediately superseded by I5)
      → H.W11  (I5 stage-card · I4 rounding · I1 label-subgrid · I2 control-DFA+perf-budget · I6/I7 bezier)
         → H.W12  (I8 useDragScrub · I9 encapsulation · I10 colocate-verify · I11 de-brittle · I12 style-idioms · I3 sequence/path enrichment + easter eggs)
            → H.W8 golden  (proof:visual-lock captures the FINAL glass-card / subgrid / enriched state)
```

- **W11 first** lands the STRUCTURE: the glass-card register all four stage scenes converge to (I5/
  I4), the uniform label grid (I1), the control-surface DFA that gates what renders per scene (I2),
  and the bezier panel form (I6/I7). It supersedes the W10 full-bleed baseline and refines W9 F1/F2.
- **W12 second** fills the structure: extracts `useDragScrub` (I8) FIRST so I3's new affordances are
  BORN on it (no churn-then-delete); audits encapsulation/decomposition/brittleness/styling (I9/I10/
  I11/I12); then GREATLY REFINES sequence/path (I3 — the draggable rows + editable path + copy
  artifact + easter eggs) on the shared seam inside the I5 cards.
- **Both BEFORE H.W8's golden baseline** so the lock captures the final state (glass-card stages,
  uniform subgrid labels, enriched sequence/path, localized idioms). Every gate born-RED on
  `tranche-h-impl` today, green on the W11/W12 fixes — every gate BITES + cites a `file:line`.

**The chronic-closure discipline in action:** the user caught the W10 full-bleed (I5), the W9 per-row-
auto labels (I1), the W9/W10 bezier double-card + tightness (I6/I7), and the un-rounded cartoon cards
(I4) BEFORE the H.W8 golden baseline locked them — the running demo is the truth. W11/W12 fold the
round-3 feedback idiomatically, supersede the superseded, extend the keystone, and converge the four
stage scenes to ONE register — the I5/I8/I12 isomorphism. No engine touched (inv ζ / fenced); all
DEMO-side (I10); the glass-ui rounded-primitive + LabeledField-subgrid are inv-16 HANDOFFs.
