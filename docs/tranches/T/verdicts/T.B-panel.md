# T.B-panel — TASTE-VERDICT (the two-floating-panel controls composition)

> The born-OWNER re-review surface for **OD-5 R1** ("Square is much better, but the
> controls need work" — verbatim). OD-5 ruled the DIRECTION (triad restore + pane
> removal + elision) APPROVED; rider R1 sends the controls COMPOSITION back for a
> reworked mid-drive re-review. This packet presents the T.B4 rework for that token.
> (R2 — the top-left easing-curve preview — rides the easing batch, NOT this lane.)

## Packet

- **Before (the rejected S state, owner shot 07):** three nested containers around
  the two control instruments — (1) the outer `.controls-pane` `glass-wash
  rounded-card` subject-stage wrap; (2) the `.controls-content` K.W4-F2 "ONE SUBTLE
  BORDER" grouping block (a 1px border + `--card 22%` tint plate + radius); (3) the
  two instruments (the AnimationControls facet body + the RibbonBar playback ribbon)
  inside. The owner: "remove the surrounding pane — it's superfluous" (VERDICT #7).

- **After (this drive — T.B4, the RULED mechanical half, LANDED):**
  - Tier 1 (the `glass-wash rounded-card` wrap) and Tier 2 (the `.controls-content`
    border/tint/radius block) are DELETED. The rail is now a **naked flex column**
    (`display:flex; flex-direction:column; gap:0.75rem`) — no border, no background,
    no radius, no glass on the column itself. The stage bleeds through the 0.75rem
    gap between the two plates.
  - **SQ-T3 folded in (no chrome without content):** the pane wrapper mounts iff
    `hasControlSurfaces` (`surfacesFor(scene).length > 0`) — `home` and any empty-set
    scene render ZERO `.controls-pane-wrapper` nodes at 375×812 AND after a 1440→375
    resize (the empty-sheet-over-a-void occlusion recurrence cannot mount).
  - The K.W4-F2 ↔ T-#7 reconciliation is RECORDED, not re-litigated (lane 10 §1.5):
    K's cure targeted two HEAVY cartoon cards competing; T ships LIGHT floating glass
    cards + zero wrappers. **Neither failed pole returns** (heavy twin cards /
    bordered enclosure).

- **Deltas claimed:** three nested containers → a naked column; the superfluous
  surrounding pane is gone; the stage wins hierarchy through the gap; empty-set
  scenes mount nothing.

- **The RULED facts are gated:** `proof:panel-naked-rail` (born-RED → GREEN this
  commit) asserts (a) no `glass-wash`/`rounded-card` on the column + no desktop
  border/background/radius on `.controls-content`/`.controls-pane`; (b) the SQ-T3
  `v-if="hasControlSurfaces"` mount gate; (c) live DFA-empty elision at 375×812 +
  across the resize flip; (d) the live naked-rail computed-style probe on cube
  desktop. It is INSTRUMENT authority (border/count/placement) — it deliberately does
  NOT stand as the composition BAR.

## The OPEN composition question (what the owner token decides — R1)

The RULED naked rail is landed and gated. What OD-5 R1 sends back for the owner's
reworked re-review is the **two-floating-GlassPanel composition itself** — NOT yet
authored as a born-RED oracle (`proof:panel-composition` is registered in
`APPEARANCE-WAVES.json` with `oracle: proof:panel-composition` but is NOT in
`package.json` — it awaits this token):

1. **The two plates as glass-ui `GlassPanel` instruments.** The direction (lane
   10 rec 4) is exactly two floating `GlassPanel`s — the facet body + the playback
   ribbon. This drive leaves the RibbonBar on its gated `Card surface="cartoon"
   tier="quiet"` register (proof:cartoon-is-panel-depth / proof:glass-and-cartoon
   still assert it) and the facet body unwrapped: converting BOTH to `GlassPanel`
   re-arms those two cartoon-card gates in lockstep — that conversion is part of THIS
   composition rework and is held for the token so the gate rewire and the owner
   verdict land together, not speculatively.
2. **The float/geometry/arrangement** — the gap rhythm, the plate widths against the
   `--rail-width` track, the vertical stacking of facet-over-ribbon, whether the two
   plates want distinct elevations or a shared light register.
3. **"Improve on the P-PANEL reference"** (task R1) — the blessed prototype
   (`wf_1e744f4d-2bb-2`) took only the naked-column step and kept the bespoke plates;
   the owner explicitly wants the composition REWORKED beyond it.

## Verdict

**Owner (___), ____-__-__: "___"**

Disposition: PENDING
Reference: OD-5 R1 (the controls-composition rework re-review); the RULED mechanical
half (naked rail + SQ-T3) is LANDED and gated by proof:panel-naked-rail; the
two-GlassPanel composition + the RibbonBar/facet `GlassPanel` conversion (with its
cartoon-card gate rewire) awaits this token before `proof:panel-composition` is
authored. Study the P-PANEL reference (`wf_1e744f4d-2bb-2`) and improve on it.


## OWNER VERDICT — FILLED 2026-07-06

> **Token (verbatim):** “Ratify all with your best judgment. We shall adopt the glass-ui drawer, but ensure that we identify any gaps in that implementation and forward any and all glass-ui suggestions to that working agent's tranche execution (with the exhortation to research, plan, and fold into our running BG/BH wave set--no prefunctory implementation)”
>
> **Disposition:** RATIFIED: R1 satisfied by the LANDED composition (naked rail + two floating GlassPanels + the honest derived triad — the rework of record). R2 (the top-left curve preview improved dramatically) FOLDS INTO the OD-7 easing terminal (the EasingPicker + gallery redesign replaces that surface).

## R2 — the top-left curve preview (DISCHARGED at the easing terminal, T.E8/OD-5-R2)

> The rider: **"the top-left curve preview improved dramatically."** Landed at the
> T.E terminal batch — this section is the before/after capture of record.

- **Before (the rejected surface):** the top-left of the Controls facet carried a
  tiny hand-plotted trigger curve (a bespoke inline SVG plot on the easing Select
  trigger, `AnimationControlsControls.vue`), backed by the 1,082L hand-rolled
  `instrument/easing/` cluster (`EasingCurveCanvas` + `DemoControlPoint` +
  `EasingEditor` + `EasingSelect`) wherever a curve was edited — cramped, non-glass,
  and its readout literal TRUNCATED (the F7 class: a copied `cubic-bezier(0.19, 1`
  that cannot re-parse).

- **After (T.E8 — ONE editor, the vendor instrument):**
  - The hand-rolled cluster is **DELETED from disk** (proof:easing-editor-live v2
    clause (s) witnesses the absence + zero dangling imports).
  - glass-ui's **`EasingPicker`** is the SOLE curve-authoring surface — the Curve
    facet body (`scenes/easing/EasingSidebar.vue`) and the `TimingFunctionPanel`
    detail body. Bezier handle-drag, native steps mode, and the **COMPLETE
    re-parseable readout literal with copy** (the F7 truncation is dead by
    construction — v2 clause (c) asserts the closing paren + four numbers).
  - The Controls easing row rides the standard grouped `Select`; the tiny
    hand-plotted trigger curve is gone with it.
  - The named-curve SELECTION surface is the T.E6 specimen gallery (33 tiles, one
    shared clock — proof:easing-gallery, OWNER authority); the picker is the
    bezier/steps AUTHORING surface. The bounce/elastic family division stays
    kf-owned (BG-8 lettered — the honest vendor-catalogue gap, surfaced as a quiet
    `data-register=code` caption, never a broken seed).

- **Witnesses (all green in-browser at the terminal batch):** `proof:easing-editor-live`
  v2 (mount-on-Curve-facet · real handle-drag re-times the preview through the one
  authoring seam · complete literals · steps native · re-mount round-trip · spring
  opens on Physics), `proof:easing-gallery` (the OD-7 oracle), and the re-armed
  neighbors (live-session B4 → the picker; suffusion (d) → the specimen portraits).

Disposition: **R2 DISCHARGED** — the top-left curve preview is now the published
glass-ui curve instrument, dramatically improved per the rider; the surface it
criticized no longer exists.
