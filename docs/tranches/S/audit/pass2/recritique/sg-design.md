# Re-critique (Pass-2) — Band S.G (Demo design refinement fleet)

**Agent:** sg-design (re-critique) · **Date:** 2026-07-02 · **Scope:** S.G1–S.G4
**Inputs:** Pass-1 critique (`pass1/critique/sg-design.md`, 9 blocking edits, 40/100) ·
SPEC-v3 §3 S.G (L1084–1154) + §2 C-24 (L441–445) + §6 (L1420–1503) + §8-1 (L1577–1582)
+ DAG (L1272–1294) + §9 SG rows (L1682–1690) + Pass-2 addendum P2-1.5 (L1812) ·
probes p10-stage-visibility.md + pass2/p2-1-demo-shared-carve.md.

**Verdict: CONVERGED — 100/100. Blocking: empty.** All nine Pass-1 blocking edits are
absorbed with real band-text delivery (not merely table-claimed); every p10 adjustment
and the P2-1 D2⟵G1 edge is folded; no mis-absorption, no new v3 contradiction, no dropped
evidence.

---

## 1. Blocking-edit absorption — verified line-by-line in v3 band text

**SG-1 (three-writer peek cure; store default stays) — ABSORBED, REAL.**
v3 L1088–1094 enumerates all three writers verbatim: "(a) the host mobile mount-reset in
`useSheetState` … (b) the `useControlsLayout.ts:64` auto-open watch DESKTOP-GATED … (c) the
two born-open scene pokes DELETED (`SpringScene.vue:47`, `EasingScene.vue:36` — dead
writes). **The store default `isControlsPanelOpen: true` STAYS** (desktop relies on the
shell force-open at `useSceneMachineApp.ts:84`, already ≥1024px-gated)." Matches p10 F4/adj1
exactly.

**SG-2 (one-open-axis mandate as gate guard clause) — ABSORBED, REAL.**
v3 L1095–1097: "**The one-open-axis mandate (p10 F3 — a gate guard clause):** the open
intent is ONE writable model over the store fact; a per-layout fork of the intent reds
`proof:live-session-mobile`'s touch battery (observed: 3 clauses — the 'close' tap toggles
the un-synced axis open)." The constraint the Pass-1 critic flagged as entirely absent from
v1 is now an explicit gate guard clause.

**SG-3 (per stage MODE, not per scene; 52dvh/26dvh; per-scene = escape hatch) — ABSORBED,
REAL.** v3 L1098–1102: "**The band is declared per stage MODE, not per scene (p10 adj3):**
the derived token pair `--stage-strip`/`--stage-reserve` in the shared host — subject 52dvh
(behavior-identical to the former 0.48 calc), editor/storyboard 26dvh (replacing the 70dvh
ceiling); ≤70dvh holds by construction; per-scene `SceneDescriptor` declaration remains the
DECLARED escape hatch, unused so far." The v1 "every scene declares a band" mis-framing is
reversed.

**SG-4 (expanded-detent gate clause + arming-audit sub-task) — ABSORBED, REAL.**
Expanded-detent clause: v3 L1109–1110 gate clause (b): "**after a handle tap, `sheet.top ≥
resolved --stage-reserve`** (the expanded-detent clause)." Arming audit: v3 L1103–1106:
"**The arming audit sub-task (p10 F5):** grep the gate roster for `.controls-pane--open`
born-open arming waits and re-arm them via a handle tap (`proof:sheet-reopen-scroll:185` was
one) …" Both halves delivered. (Also cross-absorbed by X2-10, §9 L1746.)

**SG-5 (repair DAG; sequence G1 with D2) — ABSORBED, REAL.**
C-24 ruling, v3 L441–445: "Both waves mutate the same `animation-controls/` files
(`ControlsPaneWrapper.vue` 497L, `useSheetState.ts`, `useControlsLayout.ts`). **RULING:**
S.G1 lands FIRST on the current tree … S.D2's carve follows and must re-run
`proof:stage-visible` green on the post-carve tree (T7). DAG: A4 + D1 → G1 → D2." Rendered in
the DAG (L1277 `S.A4 + S.D1 ──► S.G1 ──► S.D2`) and the band tail (L1112 "**Precedes D2
(C-24).**"). The v1 file race is repaired.

**SG-6 (per-item born-RED oracles; motion-path + square named) — ABSORBED, REAL.**
v3 L1116–1122 names both correctness oracles: motion-path — "at 375px the traveller's
rendered rect ⊂ the stage rect"; square — "Play visibly obeys duration/easing OR the lying
panel is collapsed to the live controls with the mono caption." Gate is now per-item
(L1134–1136): "each item's named oracle green via the demo-correctness harness." The v1
rubric ("per-item live-verified") is replaced.

**SG-7 (easing telemetry-anchor item + per-scene pane scroll-reach check) — ABSORBED,
REAL.** Telemetry-anchor: v3 L1125–1127 "**the telemetry-anchor-into-`--stage-reserve` item**
(p10 F7 — the hero ball's rest position sits below the live strip; the scene anchors its
primary telemetry INTO the reserved band)." Pane scroll-reach: L1132–1134 "**Per-scene
sheet-pane scroll-reach sanity check** (p10 risk c: the 26dvh strip shrinks
editor/storyboard sheet content to ~298px — dense panes like the spring heatmap must remain
scroll-reachable)." Both p10 residuals (M1 + M2) delivered.

**SG-8 (machine-readable gesture manifest; reliable primitives) — ABSORBED, REAL.**
v3 L1141–1148: "**The gate artifact, authored (sg-#8):** a **machine-readable per-scene
gesture manifest** (the census source-of-truth — replacing v1's unfalsifiable 'README'd
gesture set') in which EVERY entry carries an on-stage tell + a browser-actuated touch path;
touch mechanisms pinned to **reliable primitives** — spring's pointer-based 300ms
double-tap (spring.md:193), easing's visible gallery-door button — NEVER native `dblclick`
synthesis (unreliable … easing.md:44, amiga.md:39). Gate: … a manifest entry without a tell
REDs." The §6 double-tap pinning is folded here too. v1's no-artifact rubric is gone.

**SG-9 (G4 checkable clauses; drop "or-documented"; sequence after G3) — ABSORBED, REAL.**
v3 resolves this via a cross-critic reconciliation: G4 is DE-SCOPED to §8 (x2's x2 prune),
and the sg intent is carried in the successor shape. §8-1 L1577–1582: "each egg FIRES on its
browser-actuated trigger, is PRM-snapped (PRM-off collapses it), and dogfoods a named engine
primitive; the 'or-documented' reachability escape is DELETED; sequenced after the
affordance/touch-parity wave so touch eggs have a touch path." All three sg-#9 asks
(checkable clauses / drop or-documented / after G3) are honored in the carried gate shape;
§9 L1690 records "both critics' intents honored." Per this round's scoring clarification (a),
a pre-booked de-scope with a recorded carried shape is the correct development-phase
disposition, not an open uncertainty — no deduction.

## 2. Probe-adjustment folding (p10 + P2-1)

- **p10 (Pass-1E, adjusts-spec):** four VERDICT adjustments (three-writer / one-axis / mode
  tokens / arming audit) + expanded-detent clause + F7 telemetry-anchor + risk-c pane-scroll
  — all folded (§1 SG-1..4, SG-7 above). Q10 closed in §6.1 L1447–1448. Probe index §9 L1796
  confirms "p10 → S.G1/G2 (three writers; one axis; mode tokens; expanded detent; arming
  audit; telemetry-anchor + pane-scroll to G2)."
- **P2-1 (Pass-2 D2 carve, confirms-spec):** the C-24 D2⟵G1 edge is the band-adjacent
  Pass-2 finding. Addendum P2-1.5 L1812: "KEEP the D2 ⟵ G1 DAG edge (`proof:stage-visible`
  does not exist pre-G1 …) — **ABSORBED** §3 S.D2 + C-24 (edge marked CONFIRMED load-bearing,
  not relaxable), §6.2." §6.2 L1465–1467 records the stays-green clause was "vacuously N/A in
  the probe tree … which is itself the confirmation that the C-24 edge must not be relaxed."
  Folded; the edge is strengthened, not weakened.

## 3. New-contradiction / mis-absorption / dropped-evidence scan (admissibility gate)

- **Mis-absorption:** none. Every §9 SG "ABSORBED" claim is delivered in the band text
  (quoted in §1). No table-only claims.
- **New v3 contradiction:** none. DAG is acyclic and consistent — `G1 → D2 → D3 → E1c,
  G2(compose)` and `G1 → G2 → G3` (L1277, L1283); G2 deps "G1 (+ D3 for the compose items)"
  (L1136) create no cycle (D3 is downstream of G1, not of G2). The EN-a/EN-b hoist is
  confined to S.B3 (L429) with no S.G edge, so no cross-band collision reaches this band.
  C-24's edge is the intended collision cure, not a break.
- **Dropped evidence:** none. p10 risk-b (26dvh per-mode tuning) → §8-9 L1600; the
  mount-reset preference note → §8-10 L1602; §6.4 L1499 affirms zero dropped adjustments.

## 4. Score

Every Pass-1 deducted item is resolved: DAG collision (C-24 + DAG), G2 rubric (per-item
oracles), G3 rubric (gesture manifest artifact), G4 laundering (or-documented deleted;
de-scoped with carried shape), M1 telemetry-anchor (added to G2). No admissible new blocking
item exists.

**convergence_pct = 100. blocking = [] (empty).**

## 5. Polish (non-blocking)

- G2 still carries ~11 heterogeneous items in one wave; now falsifiable per-item (each named
  oracle green), so this is no longer a gate honesty concern — purely a scheduling-granularity
  observation for the impl-drive, not a spec defect.
- SG-9's absorption is a reconciliation (de-scope to §8-1) rather than an in-place gate
  restatement; a reader must cross-reference §8 to recover G4's repaired gate shape. The §9
  L1690 disposition row flags this, so traceability holds; noting only for reader ergonomics.
