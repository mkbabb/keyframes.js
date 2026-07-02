# Critique — S.E Scene-stage resurrection (se-scene-stage)

**Agent:** adversarial critique · **Band:** S.E (DM-24 REVIVED — orbit spring + LOD clock +
Teleport-sibling stage · commit-on-settle · single-authority guardrails · glass-ui-gated dock wave)
**Inputs read:** SPEC-v1 §1 charter, §2.1 facts 6/9, §2.2 rulings C-6/C-7/C-12/C-13, §3 S.E1–E6 (+
S.D3/S.B7 deps), §4 fold rows 17/18/51/52/53/55/56, §6 Q5, §7 T1/T4/T8/T12, the DAG; research r7
(A-1…A-10, B-1…B-5); prototype **p05-nstage-rebase** (my band's probe); a12 (KfPillTabs) via DIGEST.
**Probe evidence:** p05 tested Q5/C-7 at the compile+boundary layer and returned **confirms-spec** —
the salvage is a mechanical re-path (5 files / 23 lines), `check` 0-error, `proof:boundary` green.

**Verdict.** The **spine is sound and evidence-proven**: C-7's salvage assumption is not merely
plausible, p05 *executed* it (18 files lifted, re-pathed, `tsc` clean, boundary green) and the FAILURE
branch (fusion severed standalone Targets) did **not** fire. The three charter guardrails (one
authority; chrome outside the VT subject; commit-on-settle) are the correct transposition of the two
dead attempts' cardinal defects, and **S.E4's `proof:scene-stage-commits` is a genuinely
runtime-honest born-RED gate that would have caught the exact R residue** (the `void`-discarded
`onScroll` no-op). Bank all of that.

**But** the band ships one device-dependent fps "gate" that cannot close honestly under S's own C-10
discipline, three unresolved design questions the probe/evidence surface, a DAG defect (E1 enumerates
a scene E1 does not wait for), and two evidence-demanded scope items the wave text silences (the
interim dock-arrow surface; the new morph/compose adapters that are *authored*, not "re-homed"). Nine
mandatory SPEC-v2 edits below. **Convergence 48%.**

---

## 1. What is sound (bank it; do not re-litigate)

- **C-7 salvage is proven, not assumed.** p05 lifted the shelf's `scene-stage/` verbatim, re-pathed
  (registry `../../../../<scene>/` → `.../scenes/<scene>/`, previews one dir deeper, amiga's special
  move), and drove `tsc --noEmit` from 16×TS2307 → **0 errors**; `proof-boundary.mjs` PASS both sides
  (p05:33-38, F1-F3). All four consumed kf imports are LIGHT-barrel and survive R unchanged —
  `SpringProgress`, `RAFPlayback`, `stagger`, `NumericAnimation` (p05:47). Zero API-signature drift.
- **The FAILURE branch of Q5 does not fire.** Q5 worried fusion made Targets un-mountable → a new
  per-scene adapter layer needed. p05 F4 shows the shelf *already carries* that adapter layer
  (PROP-adapters vs INJECT-adapters, `sceneStageRegistry.ts:17-23`), its `use<Scene>Demo`/`<Scene>Keys`
  dependencies survived fusion, and all 15 re-pathed targets type-resolve (p05:53). The scaffolding
  the failure clause would demand is pre-built.
- **The guardrails are the right transposition, not band-aids.** One nav authority (ChromeDock opens,
  `runSceneSwitch` commits), Teleport-to-body sibling *outside* `view-transition-name: scene-subject`,
  commit-on-settle wired — each is the structural inverse of a named dead-attempt defect (r7 A-9
  pitfalls 1/2/3; A-6 confirms the shelf already got DOM position right where both dead attempts got
  it wrong). This satisfies the "no quick solutions / owner-binding precept" test.
- **S.E4's gate is the model the whole tranche wants.** `proof:scene-stage-commits` asserts a
  swipe/arrow COMMITS a scene, reading the shelf's `frontIndex`/`spinning` reactive mirror — a
  functional/DOM observable, deterministic, browser-actuated, demo-correctness-tiered. It is
  falsifiable, device-independent, and **directly falsifies the historical failure** (Q.WC3's
  commit-never-wired). Credit it explicitly (r7 A-9.1).
- **E6 is honestly externally-gated.** It is the plan's only external wave, flagged as such under T12,
  with a named re-entry condition (joint glass-ui 5.0.0 publish) and a structured-HANDOFF escape.
  C-12's tilde-never-caret discipline is preserved. Correct.

---

## 2. Deductions (each explicit)

### D1 — DISHONEST/FRAGILE GATE: the absolute ≥55fps perf gate (E2, E3) −15

**S.E2 gate** = "perf trace ≥55fps with all previews mounted (STAGE-SPEC S6)"; **S.E3 gate** = "live
computed-style/rect assertions … (geometry + **fps**)". A raw absolute frame-rate threshold is the
**exact anti-pattern S's own charter and rulings forbid**:

- Fact 2 (SPEC:69-71) and r8 establish master CI is red partly on the *device-dependence plane* —
  "gates that pass on macOS fail on the slow Linux runner (render-races, **absolute frame/ms
  thresholds**)". The amiga preview is WebGL and "counts double" (E2); on a Linux CI runner with
  SwiftShader software GL, ≥55fps with all previews mounted is **structurally unattainable** — the
  gate is either a chronic red source or gets quietly marked observe-only (self-defeating).
- **C-10 (SPEC:203-207)** already ruled the fix for exactly this class: "convert … to **budgeted
  device-independent ratios** (the taxonomy's own recipe)." S.E2/E3 reintroduce the raw absolute the
  band next door is deleting.
- Per **T4** (SPEC:794-796) a wave CLOSES only when its born-RED gate is GREEN *re-run on the merged
  tree*, exit code recorded. A number that only holds on the author's Mac (the STAGE-SPEC method
  verified fps *manually* via chrome-devtools-mcp — r7 A-4) cannot satisfy T4. It is presented as a
  wave gate but is really a local acceptance observation.

This is precisely the r2 failure class — "gate-shaped but not runtime-honest as a *closure*" — that
Tranche S exists to end.

### D2 — OPEN DESIGN QUESTION: the geometry/fps gate has no named oracle (E3) −10

"live computed-style/rect assertions per STAGE-SPEC's measurable acceptance" is prose, not a
falsifiable oracle (§3's own rule: "Gate: lines name the falsifiable oracle, not prose", SPEC:240).
There is a live contradiction the spec has not resolved: the STAGE-SPEC geometry/fps acceptance was
verified by the shelf's scratch `probe.mjs`/`verify-candidate-c.mjs` capture scripts (r7 A-1), and
S.E's charter explicitly says **"the shelf's scratch `*.mjs` probes are NOT resurrected — real gates
only"** (SPEC:438-439). So the spec forbids the only mechanism the STAGE-SPEC method used to check
geometry, and does not name the replacement. Is E3's gate a `playwright-core` demo-smoke gate? A
`proof-*.mjs` driving chrome-devtools? A local chrome-devtools-mcp acceptance (not a CI gate)? Unnamed
→ not implementable-as-written. (The *rect* half is device-independent and gateable; the *fps* half is
D1. They must be split — see B4.)

### D3 — OPEN DESIGN QUESTION: Oscillator (C-13) placement undecided (E5) −10

E5: "Oscillator's decision (C-13) lands **here or in S.G**." Fold row 56 compounds it: "WAVES
**S.G/S.E5 decision** + S.F5 bench." C-13 (SPEC:222-226) mandates "forced to a decision inside S, **no
carry**" — but a decision split across two candidate waves *is* an un-terminal placement, the soft
deferral the charter forbids (§1: "S folds every open deferral … no un-dispositioned rows"). Pin it to
one wave.

### D4 — OPEN DESIGN QUESTION: KfPillTabs "the stage standardizes on" is unjustified + gate
misattributed (E5) −10

E5 folds "KfPillTabs promoted to the tested, focus-correct panel primitive **the stage standardizes
on** (a12)" and gates E5 partly on "**KfPillTabs.test.ts green**". Two problems:

1. **r7's entire resurrection brief (A-1…A-10) never mentions KfPillTabs.** a12 (DIGEST) shows
   KfPillTabs is the DM-1/DM-5 *control-strip* replacement used in `AnimationControls.vue:314`
   (`stripOptions`) — a scene's internal view-option tabs, **not** the scene-nav surface. If the
   *mobile stage* genuinely standardizes on KfPillTabs for anything, the spec must say WHERE — and
   must show it does not re-create the "second nav authority" the same wave's guardrail forbids
   (SPEC:459-460). As written this reads as an a12 demo-primitive item folded into E5 for scheduling
   convenience, not stage-load-bearing scope.
2. **Gate misattribution.** `KfPillTabs.test.ts` is *authored* in **S.B7** (SPEC:356-357, "KfPillTabs.test.ts
   + the interaction-axis fixes … for the DM-1/DM-5 replacements"). Gating E5's closure on a test that
   belongs to a dependency (E5 deps B7) means E5 can red on a defect it does not own. E5's gate should
   be the mobile-stage commit at 375px, full stop; the KfPillTabs test stays B7's.

### D5 — MISSING ITEM (DAG defect): E1 enumerates `compose`, but E1 does not wait for D3 which
creates `compose` −5

E1: "Enumerate the preview registry from demo/app/scenes.ts (**all 9 fused scenes incl. morph and
compose**)". `compose` does not exist yet — it is *created* by **S.D3** ("register the ninth scene …
delete demo/playground/", SPEC:418-426). But E1's deps are **"D1, D2"** (SPEC:444) and the DAG places
E1 as a *sibling* of D3 under D2 (`S.A4 ──► S.D1 ──► S.D2 ──► S.D3, S.E1`, SPEC:588). So E1 is
authorized to run *before/parallel to* the wave that mints the scene E1 enumerates. Missing edge
**D3 → E1** (or E1 enumerates the 8 real scenes and a compose row is appended when D3 lands). Mechanical
but a real correctness bug in the dependency graph.

### D6 — MISSING ITEM: "re-homed" hides that morph + compose adapters are AUTHORED-NEW, not lifted −5

E1: "per-scene idle-state adapters **re-homed** (r7 A-7)." The shelf froze at **7** preview adapters
(p05 F5: registry ids = cube/amiga/square/easing/spring/sequence/motion-path; **`morph` absent**,
`grep morph` = 0). p05 F5 confirms morph needs "**one registry row + one `previews/morph.ts`
adapter**" — *additive*, not a re-path. `compose` is a brand-new scene (D3) → its preview adapter is
wholly new. So E1 is "7 re-homed **+ 2 authored-new** adapters", not "adapters re-homed." The verb
undercounts real work and the p05 F5 morph gap is not surfaced in the wave text. Spell it.

### D7 — MISSING ITEM: the interim in-dock arrow controls are never scoped, yet the E4/E5 gate needs
them and E6 "retires" them −8

The E4 gate is "a swipe/**arrow** COMMITS a scene" and E5 is "open→spin→commit on touch"; E6 speaks of
"**retiring the interim in-dock arrows**" (SPEC:466). So an interim arrow surface *must exist* before
E6. But p05 F6 is explicit that the shelf's `StageArrows.vue`/`TransportDock.vue`/`stageDockKey.ts`
dock-arrow wiring is **deliberately NOT lifted** (correct — it is the second-authority surface r7 A-8
/ C-7 rule out), and "the S-band expresses arrows through the existing ChromeDock." **No wave scopes
building that interim expression** (ordinary `DockIconButton`s inside the single `ChromeDock`, per r7
A-10). E4 says only "ChromeDock opens the stage" — it does not author the spin controls the gate then
asserts. This is real, un-probed build work (r7 A-10 "dock integration by dogfooding"), and its
absence means the E4 gate has no arrow to actuate on desktop.

### D8 — MISSING ITEM: CI-budget for the new browser-actuating gates is unaccounted −5

Fact 2 / r8: the demo-smoke plane is already at the edge — "~50 chromium launches under a 50-minute
ceiling", "14 blocking demo-smoke gates", the flake source S.A0 is trying to un-red. S.E adds **at
least three** browser-actuating gates (E2 fps trace, E4 `proof:scene-stage-commits`, E5 mobile
375px), plus E3's live rect check. The spec never costs these against the ceiling S.A is simultaneously
trying to bring green. T7 ("gate follows code — including its own coverage set") and the honesty
charter demand this accounting: which run in the CI demo-smoke roster (and at what launch cost), which
are local chrome-devtools-mcp acceptances. Unstated → the band could re-red the plane A0 just fixed.

---

## 3. What is NOT wrong (pre-empting over-correction)

- **E1's "not grep" runtime gate is the *right instinct*** — p05 F2/§2 notes tsc resolves stale
  `.vue` paths through the `*.vue` wildcard and *under-reports* drift, so a runtime-resolution gate
  catches what `check` misses. Keep "runtime, not grep." (But strengthen it — see B3 below: "resolves
  a non-null target" only proves the async thunk imports; p05 F4 flags runtime **mount/render** of the
  inject-adapter Targets as out-of-scope-unproven. The gate should assert the target *mounts and
  renders a non-error idle preview*, closing the one residual risk p05 could only clear at the type
  layer.)
- **Geometry NOT re-derived** (E3, "the empirically verified rotateX(-15deg)/perspective geometry
  (NOT re-derived)") is correct discipline (r7 A-4 — the numbers are live-pinned; re-deriving reopens
  the `+deg` inversion bug). Do not touch it.
- **The `proof:boundary` re-verify (E2)** is proven-green by p05 and is a real, device-independent
  gate. Fine as-is.
- **bare-`tsc` caveat** (p05 §2 caveat, adjustment (a)): the project ships **no `vue-tsc`**, so
  `check` verifies the salvage *engine* (`.ts`) fully but the 4 `.vue` `<script setup>` blocks only at
  import-resolution. This is absorbable by one clause on E1's gate (see B2) — not a design blocker.

---

## 4. Blocking edits for SPEC-v2 (each one mechanical unless noted)

- **B1 (D1 defect).** Add DAG edge **D3 → E1** (or change E1 to enumerate the 8 shipped scenes and
  append the `compose` row when D3 lands). Update E1's deps line from "D1, D2" to include the scene
  that mints `compose`.
- **B2 (D2/D6).** Rewrite E1 scope: "7 shelf adapters **re-pathed** (p05: 5 files / 23 lines) **+ 2
  adapters authored new** — `previews/morph.ts` (p05 F5) and the compose adapter (from D3)." Add a
  clause to E1's gate noting `check` is bare `tsc` (no `vue-tsc`); the `.vue` render path is exercised
  only by the browser-actuating gate, not by compile.
- **B3 (§3 / p05 F4).** Strengthen E1's gate from "registry resolves a non-null target per scene row"
  to "**each scene row mounts and renders a non-error idle preview**" — closing p05's one residual
  risk (inject-adapter Targets provisioning `use<Scene>Demo` at runtime), which "resolves non-null"
  does not cover.
- **B4 (D1/D2).** Split the E2/E3 perf criterion: the **device-independent** half (geometry rect /
  computed-style at fixed 375/desktop viewports; commit observable) is the CI born-RED gate; the
  **fps** half is either (a) a declared **local chrome-devtools-mcp acceptance** (not a T4-closing CI
  gate, stated as such per T12-style honesty) **or** (b) converted to a **budgeted device-independent
  ratio** per C-10's taxonomy recipe. Delete the raw "≥55fps" as a CI closure.
- **B5 (D2).** Name E3's oracle concretely (harness + assertion form) and reconcile it with the
  "no scratch `*.mjs`" charter line — state what replaces the STAGE-SPEC probe scripts.
- **B6 (D4).** Either specify exactly where/how the *mobile stage* consumes KfPillTabs (and show it is
  not a second nav authority), or remove the KfPillTabs promotion from E5's scope. Move
  "KfPillTabs.test.ts green" out of E5's gate — it belongs to B7. E5's gate = the mobile
  open→spin→commit at 375px only.
- **B7 (D3).** Pin the Oscillator (C-13) decision to **one** wave (E5 **or** S.G), delete "here or in
  S.G"; align fold row 56.
- **B8 (D7).** Add explicit scope to E4 (or a new sub-wave): author the **interim in-dock spin
  controls** as ordinary `DockIconButton`s inside the single `ChromeDock` (r7 A-10), the surface E6
  later retires for the glass-ui dock morph. Without it the E4 arrow-commit gate has nothing to
  actuate.
- **B9 (D8).** Add a one-line CI-budget accounting: which E-band gates enter the demo-smoke roster
  (and their chromium-launch cost against the ~50-min ceiling) vs. which are local acceptances — so
  S.E does not re-red the plane S.A0 is greening.

---

## 5. Prune / record-future

- **Prune the fps-as-CI-gate ceremony** (folds into B4) — it reads as rigor but cannot close under
  T4; keeping it as a local acceptance is the honest form.
- **Record-future, not S.E:** E6's "re-baseline demo-smoke visual-lock gates against BG's specular
  floor + unified 8px blur" is bundled into the one externally-gated wave; fine to book as a HANDOFF
  line item, but flag that the visual-rebaseline is its own multi-gate effort (r7 B-2/B-3) that will
  not "flip" atomically with the pin bump.

---

*Convergence 48%. Deductions: −15 (fps device-dependent gate, D1) −10 (E3 oracle unnamed, D2) −10
(Oscillator placement, D3) −10 (KfPillTabs justification + gate misattribution, D4) −5 (D3→E1 DAG
edge, D5) −5 (authored-vs-re-homed undercount, D6) −8 (interim arrow surface unscoped, D7) −5
(CI-budget unaccounted, D8) = −68 → but D5/D6 are fully mechanical (spelled in B1/B2) and D1's
salvage-spine is probe-PROVEN, so I credit +16 for the executed, confirmed core (p05 confirms-spec;
E4 gate is the tranche's model), landing at 48. The band is close: its spine is the most
evidence-grounded in the fleet, but it cannot be authorized as-written until B1–B9 land — chiefly the
fps-gate honesty (B4), the unscoped interim arrow surface the acceptance gate depends on (B8), and
the compose/D3 DAG edge (B1).*
