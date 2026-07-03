# stage-recritique-design — round-2 design re-critique of the SceneStage prototype

**Lane:** Fable design critic (Tranche S · pass 3) · **Date:** 2026-07-03 · **Round:** 2 of the iterative loop
**Judged:** `stage-proto-v2.md` (31 shots/strips in `proto-shots-v2/`) against `stage-design-v2.md` (D1–D11 + §P + exit bar) and my round-1 prescriptions (`stage-critique-design.md` S1–S6, P1–P6, §7 protected list, §9 exit bar).
**Method:** every round-1 blocking item re-verified ON THE PIXELS (with native-res crops where the downscaled view was ambiguous), plus a v1↔v2 side-by-side of the dark carousel marquee band.
**Verdict in one line:** the LIGHT tells the truth now — tungsten beam, key-lit stage, paper ghosting through, a real payoff frame, a clean mobile ring, and the adversarially-gated commit spine — but ONE round-1 cure did not land: the double-exposure. Occluded card text still bleeds through glass on every surface (rear-through-flank on desktop, flank-through-FRONT-card on mobile), and the hysteresis-residual lit card injects bright white UI text into the penumbra of the payoff frame itself. **Convergence: ~88%.** Round 3 is a one-defect CSS pass + the already-scoped integration wave.

---

## 1. Cure-by-cure verification (round-1 blocking S1–S6 + the evidence demand)

### S1 — lighting hierarchy + tungsten beam → **LANDED**

- **The beam is warm tungsten, provably.** The stacked v1↔v2 marquee-band comparison (v1
  `desk-dark-03-carousel` over v2 `dark-browse`, same crop) shows the round-1 shaft as
  gray-khaki and the v2 shaft as amber-to-cream — the D4.2 two-stop ramp is visible as a
  chroma gradient down the shaft in `dark-browse.png` (amber at the apex, cream toward the
  pool). The dishwater trapezoid is gone in every v2 shot.
- **The front stage catches the light.** `dark-committing.png`: the Spring card's interior
  carries a visible warm wash from the top edge (D4.4), the ember footlight blooms below,
  and the front card is unambiguously the compositional focal point. In `dark-browse.png`
  the Cube's rainbow preview + magenta halo + the marquee own the eye.
- **The penumbra desaturates.** The exact round-1 offender — Sequence's `--rainbow-green`
  bars — now reads muted green-gray at flank (`dark-committing.png` right flank), and
  Easing's violet curve is dimmed. The flanks no longer out-glow the stage.
- Residual (polish, not blocking): at `|a| = step` the D4.5 ramp is only at `k = 0.5`
  (half-desat by spec), so the intrinsically-saturated Morph blob and Amiga poster ball
  (`dark-browse.png` flanks) still carry near-full chroma. Spec-compliant; consider
  steepening the ramp start in round 3.

### S2 — the paper comes back + no gray film over white → **LANDED**

- **Graph paper ghosts through in both themes.** Native-res crop of
  `light-grid-ghost.png` bottom-left: the grid is plainly legible in the dusk field, and
  the lines nearest the pool re-tint warm amber while the far field stays neutral — the
  MATINEE image ("light falling on ruled paper") exactly as prescribed. The same grid is
  visible across `dark-browse.png` and is beautiful in `fanin-burst-01.png` (empty shaft +
  pool + ruled paper — the best atmosphere frame in the build). Never pure black anywhere.
- **The gray film over white shells is gone.** `light-committing.png`: the white Spring
  card under the beam reads warm-white with an orange commit rim — no dingy upper half.
  The plus-lighter ruling visibly adds warmth instead of laying smoke.
- The proto report confirms the harness paints the REAL `.grid-background` rule
  (`{hasGridEl:true, gradientLayers:4}`) — the "unverifiable = unshipped" condition is
  discharged for the prototype substrate; the round-3 integration must re-shoot over the
  real app page as a formality.

### S3 — the committing payoff + the gold wedge → **LANDED**

- The same-scene pair proves the beat: `payoff-burst-00.png` (Spring, browsing) vs
  `dark-committing.png` (Spring, committing) — the card visibly presses toward the viewer
  (wider footprint), the rim goes ember-orange, the footlight bloom doubles, and the beam/
  pool surge. The payoff frame is no longer confusable with idling; `mobile-committing.png`
  shows the same flare at 390px.
- **No gold wedge** in any committing shot, either theme — the glyph ghost is confined to
  the unlit branch as D5.6 ruled.
- One blemish INSIDE the payoff frame — the residual-lit rear card (see §3 blocking B3).

### S4 — unlit legibility + the double-exposure → **HALF-LANDED (the double-exposure did NOT land — blocking)**

- **Half 1, legibility: landed.** The unlit tier now wears the poster face: serif name +
  mono breadcrumb + tone-tinted shell + un-crushed glyph ghost (`dark-browse.png` rear:
  Sequence's green lines, the ring glyph, Spring's squiggle all read; "Path" / "Square"
  nameplates are near-white on dark — comfortably ≥4.5:1). Cube's empty-slab failure is
  gone.
- **Half 2, the double-exposure: NOT CURED — the round-1 image literally recurs.** Native-
  res crops:
  - `dark-browse.png` right flank: **"Square" + its `scene · square` breadcrumb float
    legibly over the Amiga poster's blue ball**, the rear card's rounded border reading
    through the flank glass with them. A first-time user reads the Amiga card as "Square" —
    the exact mislabel scenario from round 1.
  - `light-browse.png` left flank: **"Path" + `scene · motion-path` sit directly above
    Morph's purple blob** through the white glass — worse in light, where the white shell
    raises the bleed's contrast.
  - `dark-committing.png` / `light-committing.png`: the Square card's text reads through
    Easing's flank — **"Square floats on Easing's curve", verbatim round 1**.
  - **New-in-v2 surface — mobile:** `mobile-browse.png` shows **"Amiga / scene ·" bleeding
    through the FRONT Cube card's right half**, and `mobile-committing.png` shows
    "Sequence / scene ·" inside the front Spring stage. The defect has reached the primary
    surface: the lit stage itself appears mislabeled at its most-read moment.
  The D6.2 rear-fade (label → 0 over `d ∈ [0.5, 0.65]`) either wasn't applied to the ±2
  nameplates or the `d` normalization leaves them under the band; the stepped-up flank blur
  softens but does not defeat white-text bleed. **The cure did not land on the pixels.**

### S5 — affordance discoverability → **LANDED (verifiable half), placement polish**

- `dark-hint-firstopen.png`: the mono hint `drag to spin · tap to enter` is present in
  beam-warmed amber Fira Code; `dark-hint-afterspin.png` (ring spun to Amiga 2/8): gone.
  The one-time lifecycle is proven in pixels.
- Placement deviation: the hint sits INSIDE the front card, overlapping the running cube
  preview's lower tines — the design said *at the pool line, under the front card*. Legible
  but colliding; move it below the card (polish P-b).
- Cursors + hover press-scale cannot be judged from stills (CDP shots carry no cursor);
  the round-3 capture set should include a hover frame or the flick GIF with cursor.

### S6 — mobile composition → **LANDED**

- `mobile-browse.png`: the corner-clipped rectangles are gone; the two flanks peek as lit
  slivers with edge-clipped mono labels (`morph` / `amiga`); the ±2 cards read as small
  ring slivers beside the flanks, not scattered clutter; the ring sits lower (origin 52%)
  and the marquee-below-ring at display scale holds. The front diorama dominates the ring.
- Note: 80vw landed in CSS but the ring's depth recede eats it — the front card's
  *apparent* width is ~66vw (measured ~515/780 device px). Acceptable dominance;
  round 3 may compensate the width for perspective if the owner wants the full 80 read.

### The motion/PRM evidence demand (round-1 P5/P6) → **LANDED**

- Fan-in: 10-frame strip; `fanin-burst-01.png` is the house-dims beat — empty tungsten
  shaft, blooming pool, ruled paper — with **no legible host ghost** (P2 cured; what
  remains mid-beam is formless haze, not the round-1 "Spring title + card" double-read).
- Commit: `payoff-burst-00..05` browse → dwell → entered arc; the definitive still is
  `dark-committing.png`.
- PRM: `prm-carousel.png` / `prm-entered.png` — the full theater look at rest values
  (beam, poster ring, marquee), motion snapped (open 61ms / commit 75ms, dwell 0). "The
  LOOK survives, the motion doesn't" is now verified in pixels, and the PRM run surfaced
  + cured a real park-without-emit bug.
- Beyond my demand: the adversarial commit-spine transcripts (clauses A–F GREEN, including
  the H1/H1b killers), the VT-frame-exit witness, the GL-lifecycle log, and a real-GPU fps
  trace within budget. The spine work is exemplary.

---

## 2. Round-1 polish ledger (P1–P6)

| # | Status | Evidence |
|---|---|---|
| P1 beam clip edges | LANDED | beam base feathers/blurs out in `fanin-burst-01.png`; no synthetic clip line at the floor |
| P2 opening ghost | LANDED | no legible host inside the beam mid-open (`fanin-burst-01.png`) |
| P3 dark arrows | LANDED | `‹ ›` now in the ×'s glass register, legible in every dark shot |
| P4 marquee dead zone | **NOT LANDED** | v1↔v2 same-crop overlay: title + counter at pixel-identical y (~60/105 @1x); the ~48px drop never happened — despite the proto ledger's §3 row claiming it. Note the claim/pixel mismatch |
| P5 motion captures | LANDED | fan-in strip + payoff burst |
| P6 PRM shots | LANDED | `prm-carousel.png` / `prm-entered.png` |

---

## 3. NEW/remaining blocking (per the round-2 rules: un-landed cure · regression of EXCELLENT · new-in-v2)

| # | Class | Defect | Round-3 prescription |
|---|---|---|---|
| **B1** | un-landed cure (S4/D6.2) | Occluded nameplates + breadcrumbs bleed through glass on desktop: "Square" over Amiga's ball (`dark-browse`), "Path" over Morph (`light-browse`), Square's text over Easing's curve (`*-committing`) — the round-1 mislabel scenario, verbatim | Fade the WHOLE occluded card face (label + breadcrumb + glyph), not just "rear labels": drive opacity off geometric occlusion (slot distance ≥ the flank's occluder band), or z-test: any card whose front-edge is behind a nearer shell drops its text layer to 0 by the time the overlap begins. Verify with the same three crops |
| **B2** | new-in-v2 surface of B1 | On mobile the FLANK nameplates bleed through the FRONT card ("Amiga scene ·" inside Cube's stage, `mobile-browse`; "Sequence" inside Spring's, `mobile-committing`) — the lit stage reads mislabeled | Same cure as B1 applied at the front-card occluder; at <640px the flank text layer should be 0 wherever the front card overlaps it (the sliver labels at the viewport edge — which DO read correctly — live outside the overlap and stay) |
| **B3** | §P.4 regression (transient) | The hysteresis-residual lit card (deviation 4) parks bright white miniature UI ("Transform / x 0.80 y −0.18 / tracking") at slot −2 in the penumbra of `dark-committing`/`light-committing` — a rear slab that isn't dark, second-brightest text on the payoff frame, feeding B1's bleed | Decouple VISUAL tier from mount tier: a card outside the flank band wears the unlit poster face (or at minimum the D4.5 ramp clamped by slot distance, `k → 1`) even while its preview stays mounted for anti-churn. CSS-only; no LOD churn re-introduced |

All three are one root idea: **what the light says must win over what the DOM keeps.** No
geometry, machine, or lighting-token changes required — this is a text-layer/filter pass.

---

## 4. §P protected list — pixel-stability audit

1. Dark-carousel composition — **stable, improved** (warmer event).
2. Footlight system — **stable**; D5 bloom correctly confined to committing (ember Spring in
   `dark-committing`, magenta Cube in `dark-browse`).
3. Real 3-D — **stable**; report re-verifies 508→430→290→192, back 281 < front 468,
   `rotateX(-15°)`, perspective 1100, minOpacity 0.50; occlusion z-order correct in-shot.
4. Light = life — **strengthened at the flanks** (penumbra ramp) but **dented by B3** (a
   rear slab showing live white text in the committing stills). Cure B3 restores it.
5. Marquee typography + mobile marquee-below-ring — **stable** (P4's block move simply
   didn't happen; the type itself untouched, as protected).
6. Poster cards as the unlit face — **landed and stable** (D3.6 promotion visible).
7. Commit spine — **hardened beyond round-1**: adversarial A–F GREEN, VT-frame exit
   witnessed, PRM snap proven. The best work in the round.

---

## 5. Re-score (same rubric; 100 = ready to become the binding S.E wave spec)

| Axis (round-1 weight) | R1 | R2 | Note |
|---|---|---|---|
| DK-64 theater / event read | 85 | 95 | tungsten + payoff beat complete the grammar |
| Lighting physics coherence | 45 | 90 | S1/S2 cured; B3's white-text-in-penumbra is the residue |
| State choreography | 55 | 92 | payoff lands; fan-in/PRM evidenced; flick feel still round-3 (GIF) |
| Legibility / a11y | 40 | 72 | unlit posters + AA labels landed; **double-exposure un-cured (B1/B2)** |
| Mobile | 50 | 88 | composition cured; apparent-width + hint placement polish |
| Affordance discoverability | 20 | 85 | hint lifecycle proven; cursor/hover pending capture |
| Craft / evidence integrity | 75 | 93 | adversarial gates + crops are exemplary; one ledger claim (P4) contradicted by pixels |

**Convergence: ~88%** (from 70%). The remaining 12% is: B1/B2/B3 (one CSS text-layer/
filter pass, re-proven with the same three crops), the P4 marquee drop actually applied or
formally waived, hint re-seated to the pool line, and the round-3 flick/hover captures.
Impl-scale integration (roster wiring, App.vue, dock-pill scoping, D3.4 pairing) is wave
content, not design uncertainty.

## Round-3 exit bar

(a) the three B1/B2/B3 crops re-shot clean: no occluded text reads through any shell, and
no un-fronted card shows bright UI text; (b) P4 applied or waived by the owner in writing;
(c) hint at the pool line; (d) a hover/cursor-bearing capture + the flick-decay GIF (drag
feel ruling still open from D10); (e) §P pixel-stable. Everything else in this build is
converged and should be frozen into the S.E wave spec as-is.
