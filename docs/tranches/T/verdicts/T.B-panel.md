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
