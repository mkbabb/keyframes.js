# S.G — Demo design refinement fleet (mobile stage-visibility · per-scene refinements · affordance layer)

**Band:** S.G — Demo design refinement fleet. **Track:** design (SPEC §3, §3 DAG; +E3/E5 share the
design track).
**Phase:** DEVELOPMENT ONLY. This document + the SPEC-v3 evidence + PROGRESS.md's board ARE the S.G
deliverable. **No demo/library source is rewritten here.** The three live waves (S.G1–S.G3) open only
on explicit owner authorization of the impl drive; **S.G4 is DE-SCOPED to §8 Recorded-future** and
authors nothing in S. A wave is CLOSED only when its born-RED gate is GREEN *re-run on the merged
tree*, exit code recorded in PROGRESS.md (T4; SPEC §7), and S.Z2 re-executes that oracle at close.
inv-16 holds (write only keyframes.js).

**Charter.** S.G is the demo's design-refinement fleet — the altitude layer over the structural
demo work of S.D (band S.E was SHELVED by owner ruling 2026-07-03 — see `waves/S.E.md`). Two systemic pathologies dominate it, both found in all ten design lanes and
both now probe-answered:

1. **Mobile-sheet occlusion is systemic (10/10 pages) and the cure is probe-PROVEN (SPEC §2.1-7,
   fold row 66).** Every design lane found the bottom sheet occluding the scene's thesis; p10
   landed the one-contract cure in a worktree (78+/18− over 6 files) and measured **12.1% → 72%**
   stage visible at rest, all five sheet-coupled gates green after one gate re-arm. S.G1 lands that
   contract fleet-wide.
2. **The hidden-affordance systemic (10/10 pages; SPEC §2.1-8, fold row 67).** The demo's best
   interactions are sealed — cube's gesture grammar is invisible, spring's derby and easing's
   gallery are dblclick-only (nonexistent on touch), sequence's headline drag-to-retime has no
   tell, amiga's boing threshold is unknowable. S.G3 lands a machine-readable per-scene gesture
   manifest with an on-stage tell + a browser-actuated touch path per entry, pinned to reliable
   primitives (never native `dblclick` synthesis).

Between them, **S.G2** lands each design lane's highest-leverage refinement as one wave — including
two real correctness defects (motion-path traveller scaling, the square lying panel) named as
per-item born-RED oracles, and the forced Oscillator decision (C-13). Every S.G wave is verified
live via chrome-devtools-mcp (T8), not by source-shape gate alone.

**Mode declarations (C-14 — every wave states REWRITE or REFINE):**
- **S.G1 — REWRITE** (the mobile stage-visibility contract; structure/layout).
- **S.G2 — REWRITE** (per-scene design refinements + two correctness fixes).
- **S.G3 — REWRITE** (the affordance/touch-parity layer).
- **S.G4 — DE-SCOPED to §8 Recorded-future** (x2 prune; no wave, no gate in S).

**Band DAG (from SPEC §3 "The DAG"):**

```
S.A4 + S.D1 ──► S.G1 ──► S.D2 ──► S.D3 ──► S.G2(compose items)
S.G1 ──► S.G2 ──► S.G3        (S.G4 → §8)
```

- **S.G1** deps **A4, D1** — A4 because G1 reds a layout/appearance gate (the FROZEN-set declaration
  must precede any demo wave that reds a layout/appearance gate — D3/E/G; SPEC §3 DAG); D1 because
  G1's contract lands on the app-shell layout D1 partitions. **G1 PRECEDES D2 (C-24):** both waves
  mutate the same `animation-controls/` files (`ControlsPaneWrapper.vue` 497L, `useSheetState.ts`,
  `useControlsLayout.ts`) — G1 lands FIRST on the current tree (its 78+/18− diff is probe-proven),
  D2's carve follows and re-runs `proof:stage-visible` green on the post-carve tree.
- **S.G2** deps **G1** (the `--stage-strip`/`--stage-reserve` tokens G1 introduces are the substrate
  G2's telemetry-anchor item projects into) **+ D3** for the compose-scene items (compose does not
  exist as a scene until D3 folds it).
- **S.G3** deps **G2**.
- **S.G4** → §8 (de-scoped; the D3 S9 egg re-point still ships as a D3 gate re-point, not a G4 egg).
- **Cross-band constraint (compose-fleet close):** compose auto-enrolls in the
  occlusion/a11y/font/stage-visible runtime fleet — DAG edge **S.G1/G2 → compose-fleet-green →
  `proof:compose-scene` close** (SPEC §3 S.D3, C-4). `proof:compose-scene` (authored at D3) CLOSES
  after S.G, not at D3.

**Fold rows this band terminalizes (SPEC §4):**
- Row **66** — Mobile-sheet occlusion systemic (10/10 pages) → **S.G1** (probe-PROVEN cure, p10:
  12.1%→72%).
- Row **67** — Hidden-affordance systemic (10/10 pages) → **S.G3** (gesture-manifest-gated).
- Row **68** — Motion-path traveller offset-path scaling defect → **S.G2** (named oracle: traveller
  rect ⊂ stage rect at 375px).
- Row **69** — Square lying controls panel → **S.G2** (named oracle: Play obeys duration/easing OR
  the panel is collapsed).
- Row **56** — Oscillator fictional demo claim; `reseatToSpring` unconsumed → **S.G2** (the ONE
  decision wave — C-13 pinned, se-B7) **+ S.F5a** (the `reseatToSpring`-vs-`decayRest` bench —
  landed in S.F, not here).
- Row **5 backlog carve (partial)** — the S.A0 enumerated demo-smoke backlog rows owned by S.G:
  **`easing-sidebar-minimal` → S.G2**, **`scene-perf-budget`-A2 → S.G2** (the amiga
  `setPixelRatio` cap), **`icon-paint-live` → S.G2** (with the glass-ui-home check per S.A0),
  **`drag-gesture` → S.G3** (userSelect held through the gesture).

**Rulings this band executes (SPEC §2.2):** **C-13** (the Oscillator decision pinned to S.G2 — ONE
wave; the bench to S.F5a), **C-14** (per-wave mode declaration), **C-24** (G1 before D2;
`proof:stage-visible` re-run after the carve).

**Tenets referenced (SPEC §7):** **T1** (runtime-tier closure — every G gate opens the running demo
and actuates), **T4** (DEVELOPED ≠ SHIPPED — gates ship born-RED; a wave CLOSES only when its gate
is GREEN re-run on the merged tree), **T7** (gate follows code — including gates that ARM on the
deleted behavior; the p10 arming-audit class is G1's S4), **T8** (interaction-axis tests for
hand-rolled primitives; live verification via chrome-devtools-mcp for every stage of S.G).

**Probes:** **p10 → S.G1/G2** (three writers; one axis; mode tokens; expanded detent; arming audit;
telemetry-anchor + pane-scroll to G2 — SPEC §7 probe-adjustment index).

---

## S.G1 — The mobile stage-visibility contract (probe-PROVEN, p10 — the systemic cure)

**Mode: REWRITE.** ONE contract, fleet-wide, exactly as landed in the p10 probe worktree (78+/18−
over 6 files) (SPEC §3 S.G1, §2.1-7).

### Charter

The mobile bottom sheet occludes the scene's thesis on all ten design lanes (fold row 66). p10
landed the one-contract cure and measured stage visibility rise from **12.1% → 72%** at rest, with
all five sheet-coupled gates green after one gate re-arm. Three binding lessons the probe surfaced
are load-bearing and each becomes a scope item: the re-opener chain is **three-headed**; the open
intent must stay **ONE writable axis**; and stage **MODES**, not scenes, declare the reserved band.
S.G1 replaces the per-pixel occlusion locks with the layout-invariant `proof:stage-visible` system
gate (which feeds A4's FROZEN migration).

### Scope items

- **S1 — The three-writer peek cure (p10 F4).** The re-opener chain is three-headed; all three
  writers are cured:
  - **(a)** the host mobile mount-reset in `useSheetState` (born-at-peek per scene entry — the
    wrapper remounts per scene via the `superKey` key);
  - **(b)** the `useControlsLayout.ts:64` auto-open watch is **DESKTOP-GATED** (on mobile it fires
    on the machine's entry-time `selectedControl` projection, not a user pick);
  - **(c)** the two born-open scene pokes are **DELETED** (`SpringScene.vue:47`, `EasingScene.vue:36`
    — dead writes).
  **The store default `isControlsPanelOpen: true` STAYS** — desktop relies on the shell force-open
  at `useSceneMachineApp.ts:84`, already ≥1024px-gated (SG-1).
- **S2 — The one-open-axis mandate (p10 F3 — a gate guard clause).** The open intent is ONE
  writable model over the store fact; a **per-layout fork of the intent reds
  `proof:live-session-mobile`'s touch battery** (observed: 3 clauses — the "close" tap toggles the
  un-synced axis open) (SG-2).
- **S3 — The band is declared per stage MODE, not per scene (p10 adj3).** The derived token pair
  `--stage-strip`/`--stage-reserve` lives in the shared host — **subject 52dvh** (behavior-identical
  to the former 0.48 calc), **editor/storyboard 26dvh** (replacing the 70dvh ceiling); **≤70dvh
  holds by construction**; the per-scene `SceneDescriptor` declaration remains the DECLARED escape
  hatch, **unused so far** (SG-3). (Both worst scenes passed on mode defaults — SPEC §2.1-7.)
- **S4 — The arming audit sub-task (p10 F5; T7).** Grep the gate roster for `.controls-pane--open`
  born-open arming waits and **re-arm them via a handle tap** (`proof:sheet-reopen-scroll:185` was
  one). Existing gates encode the behavior the contract deletes; **without this audit the wave's
  reds get mis-triaged as regression** (SG-4; the p10 arming-audit class — SPEC §7 T7).
- **S5 — Replace the per-pixel occlusion locks** with the layout-invariant `proof:stage-visible`
  system gate, which **feeds A4's FROZEN migration** (the successor-gate mapping that discharges the
  frozen occlusion keys — SPEC §3 S.A4).

### The enumerated co-edit set

The p10 diff is **78+/18− over 6 files** — the mutated surface:
- `ControlsPaneWrapper.vue` (497L — shared with S.D2; C-24 orders G1 first),
- `useSheetState.ts` (the host mount-reset — S1a),
- `useControlsLayout.ts` (`:64` auto-open watch desktop-gate — S1b),
- `SpringScene.vue` (`:47` born-open poke DELETE — S1c),
- `EasingScene.vue` (`:36` born-open poke DELETE — S1c),
- the shared host stylesheet (the `--stage-strip`/`--stage-reserve` mode tokens — S3).

**Gate arming co-edit (S4):** `proof:sheet-reopen-scroll:185` (named) + every other gate whose
`.controls-pane--open` born-open arming wait must be re-armed via a handle tap. These gates encode
the pre-contract behavior; they are re-armed in the SAME wave so their reds are read as the intended
contract change, not as regression (T7).

### The HARD GATE — `proof:stage-visible` (born-RED, layout-invariant system gate)

**Gate name:** `proof:stage-visible` (NEW system gate; replaces the per-pixel occlusion locks;
feeds A4's FROZEN migration).

**What it asserts (three clauses, p10 F6).** At **375×667 across all 9 scenes**:
- **(a) at rest** — `--sheet-t == 0` AND `sheet.top / viewportH ≥ 0.65`;
- **(b) after a handle tap** — `sheet.top ≥ resolved --stage-reserve` (the **expanded-detent
  clause** — SG-4);
- **(c)** the subject's **live rect intersects the band** (via the existing transform-sampling
  oracle).

**Born-RED witness plan.** The gate is **born-RED today**: on the current tree the sheet sits open
at scene entry (the three-writer chain fires), so clause (a) reds (`--sheet-t != 0`, stage
visibility ~12.1% < 0.65). After S1 cures the three writers, clause (a) greens (measured ~72% at
rest). Clause (b) is red until S3's `--stage-reserve` token exists and the handle-tap detent
resolves against it. A non-vacuity plant: re-add either born-open scene poke (`SpringScene.vue:47`
or `EasingScene.vue:36`) → clause (a) REDs on that scene; fork the open intent per layout (violating
S2) → `proof:live-session-mobile`'s touch battery reds (the "close" tap toggles the un-synced axis
open — the observed 3-clause failure).

**Falsifiability.** The gate reads the running demo at a fixed viewport (runtime-tier — T1); it is
layout-invariant (asserts resolved token values + live rect intersection, not pixel constants), so
it survives D2's later carve and reds honestly on any runner. A source-shape stub cannot satisfy the
"subject live rect intersects the band" clause — it requires the actual transform-sampled DOM.

### Cost

**78+/18− over 6 files** (the p10 probe diff, executed in a worktree — SPEC §3 S.G1). Probe-proven;
LOW risk. One gate re-arm (S4) is the only non-mechanical step, and it is enumerated
(`proof:sheet-reopen-scroll:185` named).

### DAG

**Deps: A4, D1.** A4 (G1 reds a layout/appearance gate; the FROZEN-set declaration must precede it —
SPEC §3 DAG); D1 (the app-shell layout G1's contract lands on). **G1 PRECEDES D2 (C-24)** — both
mutate the same `animation-controls/` files; G1 lands first on the current tree, D2's carve follows
and re-runs `proof:stage-visible` green post-carve. **G1 ──► S.G2.**

### Verification

Impl sequence: (1) author `proof:stage-visible` (the three-clause system gate) FIRST — born-RED on
the current tree (stage visibility ~12.1% at rest fails clause (a)); (2) run the S4 arming audit —
grep `.controls-pane--open` born-open arming waits, re-arm each via a handle tap (`proof:sheet-
reopen-scroll:185` named); (3) land the three-writer cure (S1 a/b/c) + the one-open-axis model (S2)
+ the mode tokens (S3) across the 6 files; (4) run `proof:stage-visible` (must be GREEN — ~72% at
rest across all 9 scenes) + `proof:live-session-mobile` (touch battery green — the one-axis mandate
holds); (5) confirm the re-armed sheet gates green and are NOT mis-triaged as regression; (6) live
verification via chrome-devtools-mcp at 375×667 (T8). **Note (recorded, not gated):** the mobile
mount-reset discards a returning user's expanded preference per scene entry — accepted as the "peek
by default" reading (SPEC §8-10; recorded in this wave doc, not a gate).

---

## S.G2 — Per-scene W1 batch, per-item born-RED oracles

**Mode: REWRITE.** Each design lane's highest-leverage refinement, landed as one wave — **with the
rubric gate replaced by per-item born-RED oracles (sg-#6); the two correctness items named** (SPEC
§3 S.G2, §7 p10 index).

### Charter

S.G2 lands each design lane's highest-leverage refinement as one wave. Two of these items are **real
correctness defects** (not aesthetic polish) and are named as per-item born-RED oracles — the rubric
gate v1 proposed is REPLACED by these concrete oracles (SG-6). The wave also carries the forced
**Oscillator decision** (C-13), the S.A0 demo-smoke backlog rows assigned to G2, and a per-scene
scroll-reach sanity check that guards against the 26dvh strip shrinking dense panes below reach.

### Scope items — the two named correctness oracles

- **S1 — motion-path traveller scaling (a real defect; fold row 68).** **Oracle:** at 375px the
  traveller's rendered rect ⊂ the stage rect. The unscaled `offset-path` in user units detaches the
  creature on any stage <~400px; the fix is a **real `scalePathD` + ResizeObserver** (the artifact
  keeps the author `d`); + hit-halos.
- **S2 — square honest controls (fold row 69).** **Oracle:** Play visibly obeys duration/easing OR
  the lying panel is collapsed to the live controls with the mono caption. (The panel today edits a
  `CSSKeyframesAnimation` that paints nothing.)

### Scope items — per-scene refinements

- **S3 — home:** directional-copy fix + first-visit dock reveal.
- **S4 — cube:** showroom rest-attitude + readout anchor.
- **S5 — amiga:** telemetry relocation + gesture caption + the **`setPixelRatio(min(dpr, 2))` cap**
  — **discharges the `scene-perf-budget` A2 backlog row** (SPEC §3 S.G2; fold row 5 backlog).
- **S6 — easing:** sheet cap + un-truncated literal + **the telemetry-anchor-into-`--stage-reserve`
  item** (p10 F7 — the hero ball's rest position sits below the live strip; the scene anchors its
  primary telemetry INTO the reserved band — SG-7). **Discharges the `easing-sidebar-minimal`
  backlog row.**
- **S7 — morph:** shape-ring picker.
- **S8 — sequence:** scrubber unburied + axis-label collision.
- **S9 — spring:** Race button + peek sheet.
- **S10 — compose:** chrome-red (a compose item — deps D3).
- **S11 — `icon-paint-live` backlog row discharged** — with the **glass-ui-home check per S.A0** (if
  the fix belongs in glass-ui root, it is a HANDOFF, not patched in the demo — MEMORY
  glass-ui-root-changes) (fold row 5 backlog).
- **S12 — The Oscillator decision (C-13; fold row 56).** Build its promised demo home **here** OR
  strip the fictional header and ledger it as an intentional public leaf. This is the ONE decision
  wave (se-B7); the `reseatToSpring`-vs-`decayRest` bench lands separately in **S.F5a** (not here).
- **S13 — Per-scene sheet-pane scroll-reach sanity check (p10 risk c).** The 26dvh strip shrinks
  editor/storyboard sheet content to ~298px — dense panes like the **spring heatmap** must remain
  **scroll-reachable** (SG-7). Verified per-scene.

### The HARD GATE — per-item born-RED oracles (rubric REPLACED — sg-#6)

**Gate:** each item's **named oracle green via the demo-correctness harness** — there is **no rubric
gate** (v1's rubric is replaced by per-item oracles). The two correctness items carry the explicit
oracles above:
- **motion-path:** at 375px the traveller's rendered rect ⊂ the stage rect (S1);
- **square:** Play visibly obeys duration/easing OR the lying panel is collapsed to the live
  controls with the mono caption (S2).

**FROZEN-set discharge.** The FROZEN-set reds this wave triggers are discharged **per A4's
machine-distinguishable migration/KILL rule** — each frozen key is discharged EITHER by (a)
migration to a named successor system gate (`stage-visible`/`occlusion-free`/`a11y`/`dogfood`) OR
(b) an owner-ratified S-ledger KILL row with a re-run witness. **Free-prose "deletion-with-cause" is
banned** (SPEC §3 S.A4; §7 T2/T3).

**Born-RED witness plan.** Both correctness oracles are born-RED today:
- **motion-path:** on the current tree at 375px the unscaled `offset-path` detaches the traveller —
  its rendered rect is NOT ⊂ the stage rect (the creature escapes on any stage <~400px). After the
  `scalePathD` + ResizeObserver fix lands, the rect is contained → green. Plant: remove the
  `scalePathD` scaling → the traveller rect escapes the stage rect at 375px → REDs.
- **square:** on the current tree the panel edits a `CSSKeyframesAnimation` that paints nothing —
  Play does NOT obey duration/easing and the panel is not collapsed → red. After the fix (either
  Play made honest OR the panel collapsed to live controls with the mono caption) → green. Plant:
  re-expand the lying panel while Play still paints nothing → REDs.

**Falsifiability.** Each oracle reads the running demo (runtime-tier — T1); "rect ⊂ stage rect" and
"Play visibly obeys duration/easing" are both DOM/behavior assertions a source-shape stub cannot
fake. Live verification via chrome-devtools-mcp (T8).

### Cost

Per-scene batch — one W1-style refinement per lane plus the two correctness fixes. The two
correctness items (motion-path `scalePathD` + ResizeObserver; square honest-panel) are the
non-trivial work; the rest are per-lane polish. LOW–MODERATE.

### DAG

**Deps: G1** (the `--stage-strip`/`--stage-reserve` tokens G1 introduces are the substrate S6's
telemetry-anchor projects into) **+ D3 for the compose items** (S10 — compose does not exist as a
scene until D3 folds it). **G2 ──► S.G3.** G2 also feeds the **compose-fleet-green** DAG edge that
closes `proof:compose-scene` (SPEC §3 S.D3).

### Verification

Impl sequence: (1) author each item's named oracle in the demo-correctness harness — the two
correctness oracles born-RED today; (2) land the two correctness fixes (motion-path `scalePathD` +
ResizeObserver keeping author `d` + hit-halos; square honest-panel-or-collapse) and the per-scene
refinements S3–S11; (3) make the Oscillator decision S12 (build home OR strip + ledger as
intentional public leaf) — no carry (C-13); (4) run the per-item oracles (each must be GREEN via the
demo-correctness harness); (5) discharge the triggered FROZEN-set reds per A4's migration/KILL rule
(never free prose); (6) run the per-scene scroll-reach check S13 (dense panes remain scroll-reachable
at 26dvh); (7) live verification via chrome-devtools-mcp (T8).

---

## S.G3 — The affordance layer + touch parity, manifest-gated

**Mode: REWRITE.** One drafting-stamp-proportion gesture legend per scene + touch parity for every
dblclick/keyboard-only delight, gated by a machine-readable per-scene gesture manifest (SPEC §3
S.G3, §2.1-8; SG-8).

### Charter

The hidden-affordance systemic (10/10 pages; fold row 67): the demo's best interactions are sealed —
cube's entire gesture grammar is invisible; spring's derby and easing's gallery are dblclick-only
(nonexistent on touch); sequence's headline drag-to-retime has no tell; amiga's boing threshold is
unknowable. S.G3 surfaces every affordance with an on-stage tell and a touch path, and makes the
census machine-readable so the claim is falsifiable (replacing v1's unfalsifiable "README'd gesture
set").

### Scope items

- **S1 — One drafting-stamp-proportion gesture legend per scene** (fade after first use).
- **S2 — Touch parity for every dblclick/keyboard-only delight.** Touch mechanisms pinned to
  **reliable primitives** — spring's pointer-based 300ms double-tap (`spring.md:193`), easing's
  visible gallery-door button — **NEVER native `dblclick` synthesis** (unreliable across mobile
  browsers; `easing.md:44`, `amiga.md:39`) (SG-8).
- **S3 — Focus rings on the primary instruments:** sequence sliders, spring rail, motion-path
  handles.
- **S4 — 44px floors** on the primary instruments.
- **S5 — The `drag-gesture` backlog row discharged** — userSelect held through the gesture (SPEC §3
  S.G3; fold row 5 backlog).
- **S6 — Author the gate artifact (SG-8):** a **machine-readable per-scene gesture manifest** (the
  census source-of-truth) in which EVERY entry carries an **on-stage tell + a browser-actuated touch
  path**.

### The HARD GATE — `proof:gesture-manifest` (born-RED, census-shaped — sg-#8)

**Gate name:** `proof:gesture-manifest` (NEW; replaces v1's unfalsifiable "README'd gesture set").

**What it asserts.** The machine-readable per-scene gesture manifest **exists** and **every entry's
tell + touch path is browser-actuated green**; **a manifest entry without a tell REDs**. Touch paths
are actuated via reliable primitives only — the pointer-based double-tap / visible gallery-door
button class — never native `dblclick` synthesis.

**Born-RED witness plan.** Born-RED today: no gesture manifest exists, and the sealed affordances
(cube gesture grammar, spring derby, easing gallery, sequence drag-to-retime, amiga boing) have no
on-stage tell and no touch path. As each scene's entries gain a tell + a browser-actuated touch path
and are entered into the manifest, the gate greens. Plant: add a manifest entry with a touch path
but **no on-stage tell** → the entry REDs (the tell requirement bites); wire a touch path via native
`dblclick` synthesis → it fails to actuate reliably across mobile browsers → REDs.

**Falsifiability.** The manifest is the census source-of-truth — the gate browser-actuates every
entry's touch path (runtime-tier — T1/T8), so a documented-but-unreachable gesture cannot pass (the
"README'd gesture set" laundering is structurally impossible). An entry without a tell is a hard RED,
so surfacing the affordance is mandatory, not optional.

### Cost

Per-scene affordance authoring (legend + tell + touch path per entry) across the design lanes, plus
the focus-ring/44px-floor pass on the primary instruments. The reliable-primitive constraint (no
native `dblclick`) is the pinned engineering discipline. MODERATE.

### DAG

**Deps: G2.** **G3 ──► §8 (S.G4)** — the de-scoped easter-egg wave is sequenced after G3 so touch
eggs have a touch path (SPEC §8-1).

### Verification

Impl sequence: (1) author `proof:gesture-manifest` — born-RED (no manifest exists); (2) author the
per-scene gesture legend (S1), touch parity via reliable primitives (S2 — never native `dblclick`),
focus rings + 44px floors on the primary instruments (S3/S4), and discharge the `drag-gesture` row
(S5 — userSelect held through the gesture); (3) populate the machine-readable manifest with each
entry's on-stage tell + browser-actuated touch path (S6); (4) run `proof:gesture-manifest` (must be
GREEN — every entry's tell + touch path actuated); (5) live verification via chrome-devtools-mcp on
touch emulation (T8).

---

## S.G4 — DE-SCOPED to §8 Recorded-future (x2 prune)

**Status: DE-SCOPED.** The ten authored easter eggs are **observe-tier altitude atop a red
substrate** — de-scoping them is the strongest de-risk of S's breadth signature (SPEC §1, §3 S.G4,
§8-1). **S.G4 authors no wave and no gate in S** and is NOT counted as a closable born-RED (x2).

**The carried shape (§8-1 — nothing silently vanishes).** The successor entry in §8
Recorded-future carries sg-#9's **repaired gate shape** for the successor tranche:
- each egg **FIRES on its browser-actuated trigger**,
- is **PRM-snapped** (PRM-off collapses it),
- **dogfoods a named engine primitive**,
- the **"or-documented" reachability escape is DELETED** (the laundering escape v1 allowed),
- **sequenced after the affordance/touch-parity wave (S.G3)** so touch eggs have a touch path.

The ten authored egg designs (`design/*.md`) remain the content; the wave **lifts cleanly when
scheduled** (SG-9 — both critics' intents honored: the gate is restated to checkable clauses AND
the wave is de-scoped per x2's prune).

**What STILL ships in S:** the **D3 S9 egg re-point** — it is a **gate re-point, not a new egg**
(SPEC §3 S.G4; §3 S.D3 six-item touch set item 5: `proof:design-refinement` S9 egg re-pointed to
compose source — an UPGRADE, the egg becomes live-drivable in the SPA for the first time).

---

## Cross-wave provenance (SPEC §9 absorption — sg-design + the p10 index)

Every §9 blocking edit this band absorbs, for traceability:

| §9 edit | Substance | Home in this doc |
|---|---|---|
| SG-1 | Reword G1 to the three-writer peek cure; store default `isControlsPanelOpen: true` stays | S.G1 S1 (a/b/c) + the store-default clause |
| SG-2 | One-open-axis mandate as a gate guard clause (per-layout fork reds the touch battery) | S.G1 S2 + gate born-RED plant |
| SG-3 | "Every scene declares a band" → every stage MODE declares `--stage-strip`/`--stage-reserve` (52dvh/26dvh); per-scene = unused escape hatch | S.G1 S3 |
| SG-4 | Add the expanded-detent clause (`sheet.top ≥ resolved --stage-reserve` after handle tap) + the gate-arming audit sub-task | S.G1 gate clause (b) + S4 arming audit |
| SG-5 | Repair the DAG: sequence G1 with D2 (shared 497L animation-controls files) | Band DAG + S.G1 DAG (C-24; G1 → D2; `stage-visible` re-run post-carve) |
| SG-6 | Replace G2's rubric gate with per-item born-RED oracles; name motion-path rect⊂stage + square honest-panel | S.G2 gate (rubric REPLACED) + S1/S2 named oracles |
| SG-7 | Add the easing telemetry-anchor-into-`--stage-reserve` item + per-scene sheet-pane scroll-reach check | S.G2 S6 (telemetry-anchor) + S13 (scroll-reach) |
| SG-8 | Replace G3's gate with a machine-readable per-scene gesture manifest; reliable touch primitives, not native `dblclick` synthesis | S.G3 gate (`proof:gesture-manifest`) + S2/S6 |
| SG-9 | Restate G4's gate to checkable clauses; drop "or-documented"; sequence G4 after G3 | S.G4 (de-scoped; the repaired gate is the §8-1 carried shape — both critics' intents honored) |

**Probe absorption (SPEC §7 index — p10 → S.G1/G2):** three writers (S.G1 S1) · one axis (S.G1 S2)
· mode tokens (S.G1 S3) · expanded detent (S.G1 gate clause (b)) · arming audit (S.G1 S4) ·
telemetry-anchor + pane-scroll to G2 (S.G2 S6/S13). Also folded: p10 F6 (the three-clause
`proof:stage-visible` gate), p10 F7 (the telemetry-anchor item), p10 risk c (the 26dvh scroll-reach
check), the §8-9/§8-10 record-future notes (26dvh per-mode tuning; the mount-reset preference note —
recorded in S.G1, not gated).

**Rulings referenced:** C-13 (Oscillator decision pinned to S.G2; bench to S.F5a), C-14 (per-wave
mode declaration), C-24 (G1 before D2; `proof:stage-visible` re-run after the carve).
**Tenets referenced:** T1 (runtime-tier closure — every G gate opens the running demo and actuates),
T4 (DEVELOPED ≠ SHIPPED; gates ship born-RED), T7 (gate follows code; the p10 arming-audit class —
S.G1 S4), T8 (interaction-axis tests + chrome-devtools-mcp live verification for every stage of
S.G). **Probe:** p10 (S.G1/G2 — three writers; one axis; mode tokens; expanded detent; arming audit;
telemetry-anchor + pane-scroll).
