# stage-final-design — round-3 (final) design verification of the SceneStage prototype

**Lane:** Fable design critic (Tranche S · pass 3) · **Date:** 2026-07-03 · **Round:** 3 of 3 (final)
**Scope:** my round-2 residue ONLY — B1/B2/B3 (`stage-recritique-design.md` §3) — judged against
`stage-proto-v3.md` + the 12 shots in `proto-shots-v3/`, with the verbatim round-2 offender frames
(`proto-shots-v2/`) pulled for side-by-side.
**Verdict in one line:** all three cures landed on the pixels, the protected-excellent list is
stable, and the machine witness (occlusion face-opacity 0.00 at every offender) agrees with what
the shots show. **Convergence: 100%. FROZEN — this build is the binding S.E wave spec.**

---

## 1. B1 — desktop occlusion bleed → **LANDED**

Side-by-side, same crop, both themes:

- **v2 `dark-browse`:** "Square" + `scene ·` breadcrumb float over the Amiga poster's blue ball
  (right flank); "Path" + `scene · motion-path` over Morph (left flank) — the round-1 mislabel
  scenario. **v3 `dark-browse`:** both gone. The Amiga flank reads "Amiga" alone; the Morph flank
  reads "Morph" alone; every slot-≥2 card is clean neutral glass with no readable text or glyph.
- **v3 `light-browse`:** the worst v2 surface (white shells raising bleed contrast) is clean —
  occluded cards are blank frosted slabs; "Path"-over-Morph is gone.
- **v3 `dark-committing` / `light-committing`:** the "Square floats on Easing's curve" verbatim
  offender is gone; Easing's flank carries only its violet curve + nameplate.

The cure is the prescribed one — the WHOLE occluded face (preview + poster + plate) fades by a
ring-geometry occlusion factor — and the programmatic witness (`gates/shots-v3.mjs`, read from
`getComputedStyle`) reports **0.00/0.00** plate/poster opacity for every occluded card in all six
states. Pixels and witness agree.

## 2. B2 — mobile flank-through-front bleed → **LANDED (one ratified tradeoff)**

- **v3 `mobile-browse`:** the front Cube stage is clean — no "Amiga / scene ·" inside its right
  half. **v3 `mobile-committing`:** no "Sequence" inside Spring's lit stage; the ember commit rim
  and payoff flare read unpolluted at 390px.
- **Deviation, acknowledged and accepted:** my B2 prescription kept the un-overlapped edge-sliver
  labels (`morph` / `amiga`); v3 fades them with the face (the slivers are now clean glass). The
  proto names this a deliberate tradeoff — the marquee already names the front card, and the
  arrows carry next/prev. The composition still holds (front diorama dominant, slivers as lit
  glass). NOT blocking; the owner may restore clipped sliver labels in the integration wave if
  ring-neighbor discoverability is wanted back. Not on the protected list.

## 3. B3 — visual/mount decouple → **LANDED**

- The round-2 offender — the hysteresis-residual card parking bright white miniature UI
  ("Transform / x 0.80 y −0.18 / tracking") at slot −2 in the payoff penumbra — is gone from BOTH
  `dark-committing` and `light-committing`. The penumbra slabs are dark clean glass; the
  second-brightest text on the payoff frame is now the flank nameplates, as designed.
- The mechanism is the right one: `lit` (mount hysteresis, anti-churn) split from `showPreview`
  (paint band), residual cards wear the poster face and fade by occlusion. The `dark-committing`
  witness row (cube/amiga/square/motion-path/morph all 0.00) machine-proves no residual face
  paints. "What the light says wins over what the DOM keeps" — cured at the root.

## 4. Protected-excellent spot-check (3 of §P, on the v3 pixels)

1. **Dark-carousel composition + tungsten beam** — stable: amber-to-cream shaft, warm pool,
   magenta Cube halo, marquee unchanged (`dark-browse` v2↔v3 differ only where the cure applies).
2. **Footlight system** — stable: magenta browse halo; ember Spring bloom confined to committing,
   doubled at the payoff (`dark-committing`), same at 390px (`mobile-committing`).
3. **Marquee typography + mobile marquee-below-ring** — stable: serif title + mono counter at the
   same station; mobile "Cube 1 / 8" / "Spring 5 / 8" below the ring, un-collided.

Also observed intact in passing: real-3-D z-order (flanks over rears, front over all; geometry
gate re-green), light-is-life (restored by B3), paper ghosting through both themes. **§P
pixel-stable; no new-in-v3 regression found.**

## 5. Score and residue

| Axis | R2 | R3 |
|---|---|---|
| Legibility / a11y (the B1/B2 axis) | 72 | 96 |
| Lighting physics coherence (the B3 dent) | 90 | 97 |
| Everything else | landed R2 | stable |

**Score: 100 (convergence 100%). Zero blocking.** B1/B2/B3 each landed on the pixels, the
witness agrees, the protected list is stable, fps within budget with no regression.

Carried (non-blocking, already-scoped **integration-wave** content — restated, not new):
P4 marquee drop (apply or owner-waive in writing) · hint re-seat to the pool line · hover/cursor
capture + the flick-decay GIF (the D10 drag-feel ruling) · the mobile sliver-label tradeoff
ratification (§2) · repo `proof:*` wiring of the standalone gates against served dist.

**Ruling: the design loop is CLOSED. Freeze this v3 build as the binding spec for the S.E wave;
no further prototype design rounds.**
