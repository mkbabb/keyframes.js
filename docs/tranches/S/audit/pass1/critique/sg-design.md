# Critique — Band S.G (Demo design refinement fleet)

**Agent:** sg-design (adversarial) · **Date:** 2026-07-02 · **Scope:** S.G1–S.G4
**Probe evidence:** p10-stage-visibility.md (Q10 — VERDICT **adjusts-spec**) + the 10 design
lanes (`design/*.md`).
**Convergence: 40 / 100.** Band verdict: **AMBER — G1 is a validated, runtime-honest systemic
cure; G2/G3/G4 ride rubric-shaped gates that would not have caught R residue, and G1's edits collide
with D2's carve.**

---

## 1. What holds (credit before challenge)

**S.G1 is the strongest wave in the band and one of the strongest in the tranche.** The probe drove
the contract end-to-end in a worktree (p10 §2), landed it in 78+/18− over 6 files, and the gate
clauses it derived (p10 F6) are genuinely runtime-honest: computed `--sheet-t`, `sheet.top /
viewportH` ratio, and a rect-intersection over the existing transform-sampling oracle — no
per-pixel lock, tokens-as-spec. This is exactly the "layout-invariant system property" gate the
charter (§2.1 #7) and A4's migration demand. The transposition (one contract, not ten CSS nudges)
is real, not a band-aid. The measured cure is decisive: **12.1% → 72% stage visible at rest**
(p10 F1/F2). This wave is implementable-as-written *after* the four probe adjustments below are
folded — none of which is a re-design, all mechanical.

**G4's ten eggs are real evidence.** All ten design lanes supplied exactly one on-aesthetic,
PRM-gated, primitive-dogfooding egg (`grep -c "easter"` across `design/*.md`); the spec's G4 list
matches them one-for-one. The concept is sound and cheap.

The band correctly took transpositions over patches at G1 (contract, not forks) and correctly
routed the two genuine *correctness* defects (motion-path traveller scaling, square lying panel) as
priority-W1 items rather than polish — those are real defects (motion-path.md §4.1, square.md §4.1),
not decoration.

---

## 2. Challenge — the probe adjustments SPEC-v1 has NOT absorbed (G1)

p10 predates SPEC-v1's freeze and its VERDICT is **adjusts-spec** with four adjustments the spec
still reads as if it did not know (p10 §4). All four are mechanically absorbable; all four are
MANDATORY because the spec's current G1 wording is *factually wrong* about the cure:

**A1 — "Sheets open at peek by default" is a three-writer cure, not a sheet-host CSS change**
(p10 F4/adj#1). SPEC-v1 G1 says the contract is "expressible in the shared sheet host." The probe
proves it is NOT: the re-opener chain is three-headed — (a) the store default
`isControlsPanelOpen: true` (`controlOptionsStore.ts:35`), (b) the `useControlsLayout.ts:64`
auto-open watch firing on the machine's entry-time `selectedControl` projection, (c) the two
born-open scene pokes (`SpringScene.vue:47`, `EasingScene.vue:36`). Deleting the pokes alone is
insufficient. The spec must name all three writers and state that the store default STAYS (desktop
relies on the ≥1024px-gated shell force-open at `useSceneMachineApp.ts:84`).

**A2 — MANDATE one open axis** (p10 F3/adj#2). The probe's hardest lesson: the first cut forked the
open intent per layout (`mobileExpanded` beside the store fact) and REDded 3 clauses of
`proof:live-session-mobile`'s touch battery — the "close" tap toggled the un-synced axis open. The
spec contains **no mention** of this constraint. Any impl that forks the open intent per layout
reds the touch battery. This must land as an explicit G1 gate guard clause.

**A3 — "every SCENE declares a band" is wrong; every stage MODE declares one** (p10 F6/adj#3).
SPEC-v1 G1: "every scene declares a reserved stage band." The probe cure is mode-level tokens
(`--stage-strip`/`--stage-reserve`: subject 52dvh ≡ today's 0.48 calc, editor/storyboard 26dvh
replacing the 70dvh ceiling). Both worst scenes passed with mode defaults; per-scene declaration is
the *unused escape hatch* Q10's failure clause named. The spec's "per scene" framing would send
impl toward nine declarations that the evidence shows are unnecessary.

**A4 — a gate-arming audit sub-task is missing** (p10 F5/adj#4). Existing runtime gates that ARM by
waiting for the born-open sheet ENCODE the behavior the contract deletes — `proof:sheet-reopen-scroll`
REDded on its arming assumption (`proof-sheet-reopen-scroll.mjs:185`) until re-armed with a handle
tap. The wave must grep the roster for `.controls-pane--open` born-open arming waits and re-arm
them. SPEC-v1 has no such sub-task; without it, G1 silently reds sheet-coupled gates during impl and
gets mis-triaged as regression.

**A5 — the G1 gate is under-specified: it only tests at-rest.** SPEC-v1's gate clause is "subject
visible + primary control reachable with the sheet at rest." The probe's F6 gate has THREE clauses:
(a) at-rest `--sheet-t==0` and `sheet.top/vh ≥ 0.65`; (b) **after a handle tap, `sheet.top ≥
resolved --stage-reserve`** (the expanded-detent band clause — missing from the spec); (c) subject
live-rect intersects the band. Fold clause (b).

---

## 3. Challenge — the DAG is dishonest: G1 collides with D2 (blocking)

SPEC-v1 DAG: `S.G1 (after A4, D1)`. But the probe's own file list (p10 §5) is
`ControlsPaneWrapper.vue` + `useSheetState.ts` + `useControlsLayout.ts` — **all inside
`demo/@/components/custom/animation-controls/`**, which **S.D2 rewrites and carves** (D2 explicitly
carves `ControlsPaneWrapper` 497L — a11 F1; sub-zones animation-controls into transport /
keyframes-editor / timeline peers). G1 and D2 are declared parallel siblings both after D1, yet both
mutate the same 497L host file and the same two composables. This is exactly the file-collision the
critique axis (3) is meant to catch. Either G1 depends on D2 (edit the post-carve files) or D2
depends on G1 (carve after the contract lands), or the G1 host edits fold into D2's carve. The DAG
must be repaired; as written it races two waves over one file.

---

## 4. Challenge — G2/G3/G4 gates are rubric-shaped, not born-RED (the r2-F1 failure mode)

This is the band's core weakness and the reason for the score. Would these gates have caught the R
residue? No — each is a rubric or points at no artifact.

**G2 gate is a rubric.** "per-item live-verified via the demo-correctness harness; the FROZEN-set
reds discharged with cause." "Live-verified per item" is not a falsifiable oracle — it is the exact
gate-shaped-but-not-runtime pattern T1 forbids. G2 batches ~11 heterogeneous items (a copy fix
beside a `ResizeObserver`-scale correctness defect) under ONE vague gate. The two CORRECTNESS items
have concrete born-RED oracles that the spec must name:
- **motion-path scaling:** at 375px the traveller's rendered rect must lie inside the stage rect
  (motion-path.md §4.1 — the unscaled `offset-path` in user units detaches the creature on any
  stage < ~400px; `useMotionPathGesture.ts:107-116`, `:212-222`). Testable: rect ⊂ stage.
- **square honest panel:** Play visibly obeys duration/easing OR the lying panel is collapsed to the
  live controls with the mono caption (square.md §4.1 — the panel edits a
  `CSSKeyframesAnimation` that paints nothing). Testable: either the tumble pacing changes with the
  control, or the dead controls are absent.

**G3 gate points at no artifact.** "every scene's README'd gesture set has an on-stage tell + a
touch path (browser-actuated spot checks)." There is no machine-readable per-scene gesture manifest
— the lanes describe gestures in prose. "README'd gesture set" is unfalsifiable until a per-scene
gesture registry exists as the census source-of-truth. "Spot checks" is non-exhaustive by
admission. G3 must author the manifest and gate every entry.

**G4 gate has a laundering escape.** "each egg reachable by a discoverable-or-**documented** path"
+ observe-tier. "Reachable by a discoverable path" is not machine-checkable, and the "or-documented"
clause lets an undiscoverable egg pass behind a doc — reintroducing the exact hidden-affordance
systemic S.G exists to cure (easing.md:44 warns both easing eggs are already effectively
undiscoverable on touch). The honest, checkable clauses are: the egg FIRES when its trigger is
browser-actuated, it is PRM-snapped (PRM-off collapses it), and it dogfoods a named primitive. Drop
"or-documented"; restate to the actuated clauses.

---

## 5. Challenge — missing items the evidence demands (G2)

**M1 — the easing telemetry-anchor item is missing** (p10 F7, explicit routing). The probe found
that with the sheet expanded on easing, the live strip carries `f(t)=` + curve top but the hero
BALL's rest position (y 455–511) sits below the strip; the full lane ask needs the scene to anchor
its primary telemetry INTO the reserved band — "the G1 spec's own 'scene-critical telemetry anchored
above the fold' item, **landing per-scene in G2**." G2's easing item is only "easing sheet cap +
un-truncated literal." The telemetry-anchor-into-`--stage-reserve` item must be added to G2.

**M2 — no per-scene sheet-pane scroll-reach sanity check** (p10 risk c). The 26dvh strip shrinks
editor/storyboard sheet content from ~467px to ~298px; the body scrolls (verified: 280px scroll on
easing), but dense panes (spring heatmap) become scroll-reached. G2's per-scene batch must sanity-
check each pane; the spec omits this.

---

## 6. What is idiomatic vs smuggled

- **G1: idiomatic-gestalt.** Ownership-inversion of the occlusion problem into a token contract;
  the two scene edits are DELETIONS of per-scene hacks (p10). No band-aid.
- **G2 motion-path scaling: idiomatic** (a real `scalePathD` + `ResizeObserver`, artifact keeps the
  unscaled author `d` — motion-path.md §4.1). Not a workaround.
- **G3 touch mechanisms: mostly idiomatic but one smuggled assumption.** The spec took the right
  primitive for easing (a visible "gallery door button", NOT dblclick) and spring's real
  pointer-based 300ms double-tap (spring.md:193). Good. But the G3 list phrase "derby double-tap"
  must be pinned to the *pointer-based synthesized* path, because native `dblclick`-synthesis is
  unreliable across mobile browsers (easing.md:44, amiga.md:39) — leaving it as "double-tap"
  smuggles the unreliable native path.

---

## 7. Prune / record-future

- **Prune** G4's "or-documented" path — ceremony escape that defeats the wave's purpose.
- **Record-future (not a wave):** p10 risk (b) — 26dvh per-mode tuning once all 9 scenes are gated;
  it is a one-line token change, not scope.
- **Record in the wave doc (not a gate):** the mobile mount-reset discards a returning user's
  expanded preference per scene entry (p10 risk, accepted as the "peek by default" reading).

---

## 8. Scoring ledger (100 → 40)

| Deduction | Reason | Amount |
|---|---|---|
| Open design Q | G1↔D2 file collision; DAG omits the D2 dependency over the shared 497L host (§3) | −10 |
| Unfalsifiable gate | G2 "per-item live-verified" is a rubric; correctness oracles unnamed (§4) | −15 |
| Unfalsifiable gate | G3 "README'd gesture set" points at no manifest; "spot checks" non-exhaustive (§4) | −15 |
| Unfalsifiable gate | G4 "discoverable-or-documented" laundering escape; discoverability uncheckable (§4) | −15 |
| Missing evidence item | G2 lacks the p10-F7 easing telemetry-anchor-into-band item (§5 M1) | −10 |
| **(not deducted)** | The four p10 G1 adjustments ARE mechanically absorbable (§2) — no probe-adjustment penalty | 0 |
| **Total** | | **40** |

(M2 pane-scroll and the §6 double-tap-pinning are folded into blocking edits below rather than
separately deducted, to avoid double-counting the same G2/G3 waves.)

---

## 9. Blocking edits for SPEC-v2

1. Reword S.G1 "sheets open at peek" to the **three-writer cure** (host mobile mount-reset in
   `useSheetState`; desktop-gate the `useControlsLayout.ts:64` auto-open watch; delete the born-open
   pokes at `SpringScene.vue:47`/`EasingScene.vue:36`) and state the store default
   `isControlsPanelOpen:true` STAYS (p10 F4/adj#1).
2. Add the S.G1 **one-open-axis mandate** as a gate guard clause: the open intent is ONE writable
   model over the store fact; a per-layout fork reds `proof:live-session-mobile`'s touch battery
   (p10 F3/adj#2).
3. Change S.G1 "every scene declares a band" → **every stage MODE declares the derived token pair
   `--stage-strip`/`--stage-reserve`** in the shared host (subject 52dvh, editor/storyboard 26dvh),
   with per-scene `SceneDescriptor` declaration as the unused escape hatch (p10 adj#3).
4. Add the S.G1 gate's **expanded-detent clause** (`sheet.top ≥ resolved --stage-reserve` after a
   handle tap) and the **arming-audit sub-task** (grep the roster for `.controls-pane--open` born-open
   arming waits; re-arm via handle tap) (p10 F5/adj#4).
5. Repair the DAG: **sequence S.G1 with S.D2** (or fold G1's `ControlsPaneWrapper`/`useSheetState`/
   `useControlsLayout` edits into D2's carve) — the two waves mutate the same 497L animation-controls
   files (p10 §5 vs a11 F1 / SPEC D2).
6. Replace S.G2's rubric gate with **per-item born-RED oracles**; name at minimum the two correctness
   oracles — motion-path traveller rect ⊂ stage rect at 375px (motion-path.md §4.1), and square Play
   visibly obeys duration/easing OR the lying panel is collapsed (square.md §4.1).
7. Add to S.G2 the **easing telemetry-anchor-into-`--stage-reserve`** item (p10 F7) and a **per-scene
   sheet-pane scroll-reach sanity check** (p10 risk c — dense panes like the spring heatmap now get
   ~298px).
8. Replace S.G3's gate with a **machine-readable per-scene gesture manifest** (the census
   source-of-truth) whose every entry has an on-stage tell + a browser-actuated touch path; pin each
   touch mechanism to a reliable primitive (spring pointer-based 300ms double-tap; easing a visible
   gallery button, NOT native dblclick synthesis — easing.md:44, amiga.md:39).
9. Restate S.G4's gate to the **checkable clauses** (each egg FIRES on its actuated trigger, is
   PRM-snapped, dogfoods a named primitive), **drop "or-documented"**, and **sequence G4 after G3**
   so touch eggs have a touch path.

---

*End of critique. G1 is close to shippable-as-written; the band's score is gated by three
rubric-shaped gates (G2/G3/G4) and one DAG collision, all repairable by the mechanical edits above.*
