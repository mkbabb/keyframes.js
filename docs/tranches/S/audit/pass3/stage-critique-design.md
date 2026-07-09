# stage-critique-design — round-1 design critique of the SceneStage prototype

**Lane:** Fable design critic (Tranche S · pass 3) · **Date:** 2026-07-03 · **Round:** 1 of the iterative loop
**Judged:** `stage-proto-v1.md` (18 shots in `proto-shots/`) against `stage-design-v1.md`'s own aesthetic contract + the owner's DK-64 mandate + `demo/DESIGN.md` / `design-idioms.css` vocabulary.
**Verdict in one line:** the THEATER is real — the composition, the ring's 3-D read, and the footlight system land — but the LIGHTING PHYSICS is incoherent in three places (hierarchy inversion, gray beam, paper gone), the commit beat has no visual payoff, and the unlit tier is illegible. Round 2 is a tuning pass, not a rebuild. **Convergence: ~70%.**

---

## 1. Does it read as DK-64 THEATER — an event, not a menu? — YES, with one inversion

`desk-dark-03-carousel.png` is the proof shot: a warm shaft into dusk, eight dioramas on a
visibly tilted turntable, the front stage haloed in the scene's own crayon, live motion in
the lit three. That is an *event*. Nobody will mistake this for a Select dropdown. The
occlusion and recede are honest 3-D (back-higher, width 508→136 monotone — the geometry
gate numbers are visible in the pixels), and the fact that Easing's violet curve, Sequence's
green bars, and Spring's bob are *actually running* makes "light = life" legible even in a
still.

**But the light hierarchy is INVERTED (S1, blocking).** In the dark carousel the brightest,
most saturated objects on screen are the FLANK previews — Sequence's `--rainbow-green` bars
out-glow everything — while the FRONT card, the one supposedly under the tungsten key, has a
near-black interior (dark glass over dusk). The eye lands on the penumbra, not the stage.
DK-64's grammar is exactly the opposite: the lit lobby is the bright thing. The beam layer
paints *behind* the cards (correct z), but no light lands *on* the lit card.

**Prescription (v2, layer-level):**
- Front card interior gets a key-light wash keyed to the driver:
  `background-image: linear-gradient(178deg, color-mix(in srgb, var(--stage-key) calc(var(--stage-light) * 22%), transparent), transparent 60%)`
  on the front card's content layer (not the shell — keep glass-resting), so the stage floor
  visibly catches the beam.
- Flank falloff must hit CONTENT, not just the shell: the §6 `brightness(1 − 0.22d²)` is
  imperceptible against full-saturation preview fills. Add `saturate(0.65)` +
  `brightness(0.72)` on the flank preview-host (front = 1/1), springing with `|a|` so the
  penumbra desaturates as a card leaves the light. The bars should read *green-gray in
  shadow* until they swing into the beam — that transition IS the theater.

---

## 2. The drop-light stack, ruled per theme

### 2a. Dark theme — the shaft reads, the COLOR doesn't (S1, blocking)

The beam in every dark shot reads **gray-khaki, not tungsten** (`desk-dark-02` most
plainly: a dishwater trapezoid). `--stage-key: hsl(45 70% 82%)` at 34%→17% mix under
`screen` over near-black desaturates to institutional gray. Tungsten is *orange-amber* at
the filament and cream at the spill.

**Prescription (token-level):** two-stop chroma ramp inside the beam gradient instead of one
key: apex `color-mix(in srgb, hsl(38 85% 72%) …)` cooling to `hsl(46 60% 86%)` at 50%,
and raise the dark-theme apex mix 34% → ~44%. Give the pool the warmer stop (the pool is
the surface nearest the "filament's" target). The `--color-gold-light/dark` ramp is the
existing family to derive both stops beside (keep the §7 "beside the gold ramp" promise —
right now the beam sits beside no ramp at all).

### 2b. The RULING on the light-theme blend (the design's open tuning item)

Judged from `desk-light-01…06`: the prototype's deviation 3 (unified warm-dusk in both
themes; literal vellum fog abandoned) is **ACCEPTED as a direction — the white-card-on-white
failure was real, and "the house lights dim" is theatrically defensible even from a light
page.** `desk-light-03` in fact reads BETTER than dark at the front card: the white shell
makes the running spring legible, which dark never achieves.

Two conditions on the acceptance, both blocking:

1. **The paper must come back (S2).** The design's L0 contract — "the paper never leaves,"
   the dim is a vignette *over* `.grid-background` — is broken in BOTH themes: every overlay
   shot is a featureless near-black field. That erases the demo's identity; the stage
   currently reads as a generic dark modal that could belong to any app, and it violates the
   owner's own N-era correction ("grid paper background not pure black"). v2: the dusk scrim
   must let the graph grid ghost through — dark: grid lines re-tinted
   `color-mix(in srgb, var(--stage-key) 6%, transparent)` (warm graphite under tungsten);
   light: the paper darkens to the same dusk but the grid survives at ~8% toward the edges
   and brighter inside the pool ellipse (the light falling on ruled paper — that's the
   MATINEE image the design promised). If the proto harness simply lacks `.grid-background`,
   round 2 must prove the vignette over the real one — this is currently unverifiable and
   therefore unshipped.
2. **Warm the beam over white (S2).** Over the white front card the `normal`-blend beam
   reads as gray smoke (`desk-light-03/04`: the card's upper half is dingy). Halving the mix
   was right; the hue is wrong. Same two-stop warm ramp as 2a, and consider
   `mix-blend-mode: plus-lighter` on the beam *above the dusk scrim* in light theme so the
   shaft adds warmth rather than laying gray film on the shells.

### 2c. What must NOT regress in the stack

The pool + per-card contact shadows carry the floor beautifully; the **footlight tint is the
best idea in the build** — Spring's ember halo and Path's gold bloom
(`desk-dark-03` vs `desk-dark-04`) instantly re-key the whole stage to the scene's crayon.
Keep L3/L4 exactly; extend nothing onto them.

---

## 3. The ring's 3-D read

**Desktop: excellent.** Occlusion, recede, tilt all read; the counter-rotated billboards
avoid the bent-filmstrip look; z-order is correct in every shot. Do not touch §6's numbers.

**One flank defect (S4, blocking): the double-exposure.** The rear cards' labels sit
*behind* the translucent flank shells and read through them — in `desk-dark-03` the word
"Square" floats on top of Easing's curve, and "Amiga" hovers inside the right flank. A
first-time user reads mislabeled cards. Prescribe geometry+material, not vibes: raise the
flank shell's backdrop blur/opacity a step (`glass-resting` → a 12–16px backdrop-blur on
flank tier only), AND drop rear-card label opacity when `d > 0.5` (the silhouette's *name*
matters when the card is peripheral-visible, not when it's occluded by glass).

**Mobile: cramped collage (S6, blocking).** `mobile-03/04`: rear cards appear as
edge-clipped dark rectangles in the top corners, the flanks are sliced mid-glyph, and the
front card (~250px wide) floats small in a tall empty beam. It is honestly the SAME theater
(same tilt, same beam, same marquee — good), but the composition is cluttered where it
should be reduced. v2 parameter deltas: cull or fade rear cards beyond ±2 slots at <640px
(`opacity → 0.15` or `v-if` out — they're unlit anyway, and the LOD already unmounts their
previews); front card width 72vw → ~80vw; nudge `perspective-origin` y down so the ring
drops toward the pool and the top-half dead zone shrinks. The flanks peeking as *lit slivers*
is right — the corner rectangles are not.

---

## 4. Typography · labels · marquee

- **The marquee is the design's voice, verbatim** — Instrument Serif at display scale with a
  breath of glow, Fira Code `n / 8` beneath. Correct in all three viewports; the mobile
  marquee below the ring at display scale honors the "mobile type stays audacious" clause.
  MUST NOT REGRESS.
- **Front-card nameplate** (serif, bottom-left, shadowed) — right scale, right weight.
- **Rear/unlit labels fail their own AA contract (S4, blocking).** §13 pins unlit labels
  ≥4.5:1; `desk-dark-03/04`'s "Cube" / "Amiga" / "Morph" render as ~2:1 gray-on-black at
  ~10px. The glyph ghosts are worse — the design's "colorful inline-SVG at opacity .35" +
  `brightness(.5)` crushes them to invisibility in dark (Cube's card is an empty slab). The
  silhouette tier should read like DK-64's dark lobbies: *you can tell which door it is.*
  v2: label re-mixes toward `--foreground` per the `.status-badge` lineage (as §13 already
  says — implement it), min 12px; glyph ghost at `opacity .5, saturate(.4)` and DROP the
  brightness crush on the glyph (the falloff already darkens the card).
- Arrow buttons `‹ ›` in dark theme are near-invisible dark-on-dark circles
  (`desk-dark-02`). Non-text affordance contrast ≥3:1 — give them the same glass register as
  the × (which reads fine).

---

## 5. The state narrative — where the choreography sags

- **closed→opening: the best beat.** `*-02-opening`: house dims, empty shaft, pool blooming
  — genuinely theatrical. One defect: the dimmed scene-host ghost (`Spring` title + card)
  is still visible INSIDE the beam mid-transition, reading as a double-exposure bug rather
  than a hand-off. v2: front-load the host's opacity ramp (gone by p≈0.6) or ensure the dim
  scrim overpaints it.
- **fanning-in → carousel:** cannot judge stagger rhythm from stills; not ruled this round.
  Round 2 must ship a motion capture (GIF or trace) for the fan-in and the flick.
- **browsing → committing SAGS COMPLETELY (S3, blocking).** `04-browsing` and
  `05-committing` are pixel-near-identical in all three viewports; the only delta is a stray
  gold wedge in the front card's top-left corner (an artifact — the icon ghost peeking? —
  either intentionalize it or kill it). The commit is the DK-64 verb — *walking into the
  stage* — and right now the payoff frame is indistinguishable from idling. v2 flourish, all
  on existing primitives: on `committing`, spring `--stage-light → 1.12` (the beam flares),
  bloom the footlight (contact-shadow tint alpha ×1.5, scale 1.15), press the front card
  toward the viewer (`translateZ(+40px)` on the armed card via the orbit derive), and let
  the marquee swap to the armed scene's name *immediately* (it already does — keep). ~300ms
  of "the theater takes a breath" before the VT grows the scene.
- **committing → entered:** the VT growth can't be judged from stills; the entered posters
  (`desk-dark-06`, `desk-light-06`) are handsome stand-ins. The dock pill correctly shows
  the new scene — the loop closes legibly.

---

## 6. Affordance discoverability (S5, blocking)

A first-time user sees: arrows, ×, and a pretty ring. NOTHING communicates drag-to-spin,
tap-front-to-enter, or the keyboard grammar. The two dead attempts both died partly on "the
interaction never landed" — don't let discoverability be round 3's problem. v2, minimal and
in-vocabulary:

- `cursor: grab` on the disk / `grabbing` while dragging; `cursor: pointer` + a hover
  press-scale (the demo's existing press idiom) on the front card only.
- A one-time hint line under the front card in Fira Code mono-caption —
  `drag to spin · tap to enter` — that fades permanently after the first successful spin
  (localStorage flag). It sits at the pool line, lit by the beam: diegetic, not a tooltip.
- The front card's `Enter` affordance can also ride the marquee: a small `↵ enter` chip
  after the counter. Optional; the hint line is the load-bearing fix.

---

## 7. EXCELLENT — protected list (round 2 must not regress)

1. **The dark-carousel vision shot composition** — beam + tilted ring + dusk is the event.
2. **The footlight system** — per-scene crayon halo on the front card (ember Spring, gold
   Path); the single best translation of the demo's identity into the theater.
3. **Real 3-D** — occlusion/recede/tilt all verified in-pixel; §6 numbers are correct, keep
   them pinned.
4. **Light = life legibility** — live flank + front previews visibly running in stills;
   rear slabs dark. The LOD story is *readable*, which was the whole first-principles bet.
5. **Marquee typography** + mobile marquee-below-ring at display scale.
6. **The closed/entered poster cards** (glyph + serif name + mono breadcrumb + tone-tinted
   shell) — better than the design asked for; consider promoting this poster as the unlit
   silhouette's face (it already solves §4's legibility ask).
7. **The commit spine** (invisible in stills, load-bearing): observable, failsafed, both
   input paths — the thing both dead attempts lacked. Guard it with the named gates in
   round 2.

---

## 8. Severity table

| # | Severity | Defect | v2 prescription (anchor) |
|---|---|---|---|
| S1 | BLOCKING | Lighting hierarchy inverted (flanks out-glow the lit stage); beam gray-khaki not tungsten | §1 + §2a: two-stop warm beam ramp; front-card key-wash; flank content `saturate(.65) brightness(.72)` |
| S2 | BLOCKING | The paper never shows through (both themes) — identity + owner's "never pure black" broken; gray beam film over white cards | §2b: grid ghost through the dusk scrim (6–8% warm), pool-brightened; warm/plus-lighter beam over light shells; PROVE over real `.grid-background` |
| S3 | BLOCKING | Committing beat visually identical to browsing; stray gold wedge artifact | §5: beam flare + footlight bloom + front-card press on `committing`; kill/intentionalize the wedge |
| S4 | BLOCKING | Unlit tier illegible (labels <AA, glyphs crushed); rear labels double-expose through flank glass | §4 + §3: label → foreground remix ≥12px; glyph `opacity .5 saturate(.4)`, no brightness crush; flank backdrop-blur up, rear label fade at d>0.5 |
| S5 | BLOCKING | Zero drag/tap/keyboard discoverability | §6: grab/pointer cursors, front-card hover press, one-time mono hint at the pool line |
| S6 | BLOCKING | Mobile cramped: corner-clipped rear rectangles, small front card, top dead zone | §3: cull rear >±2 slots <640px; front 80vw; perspective-origin y down |
| P1 | polish | Beam clip edges read synthetic near the base | stronger feather mask / blur ramp toward bottom |
| P2 | polish | Opening ghost double-exposure of the old scene inside the beam | host opacity gone by p≈0.6 |
| P3 | polish | Dark-theme arrows near-invisible | × button's glass register on the arrows |
| P4 | polish | Desktop marquee→ring dead zone | lower marquee block or raise ring a step |
| P5 | polish | Fan-in rhythm + flick feel unjudged | round 2 ships motion captures (GIF/trace) for fan-in, flick-decay, commit |
| P6 | polish | PRM look never screenshot-verified | add the emulated-PRM shot pair (design §14's "the LOOK survives") |

---

## 9. Round-2 exit bar

Round 2 converges when: (a) a dark carousel shot where the front stage is unambiguously the
brightest object and the beam reads warm; (b) both themes show graph paper ghosting through
the dusk (over the REAL `.grid-background`, not the proto stand-in); (c) a committing shot
that is visibly the payoff frame; (d) rear silhouettes name-legible at arm's length; (e) a
mobile carousel without corner clutter; (f) the hint line present on first open. Everything
in §7 pixel-stable.
