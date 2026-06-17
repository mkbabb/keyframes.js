# L.W11 — Design refinement (the instrument language, deftly folded)

**Band A · kf-internal · value.js-independent.** Refines — never abrogates — the
TASTE-approved demo into one coherent **instrument** language. Authored from an
11-page Opus frontend-design fleet (`docs/frontend-design/demo/*.md` + the value.js
pair), then hardened to the user's design verdict (2026-06-17). DEV-only; impl on
authorization.

## Context — the verdict that governs this wave

The fleet first over-reached toward *abrogation* (kill the crayon primaries, replace
the ball-on-a-rail, swap the HSL square). The user's binding verdict: **refine, do
not abrogate** — "Glass, paper, audacious typography and mathematics. Easter eggs
like the breathing sRGB gamut boundary is great." So every clause here REVERSES the
kills and TEMPERS the re-themes into surgical refinements of the extant language. The
reconciliation is recorded per-treatment (`## Design verdict reconciliation`) and
distilled in `audit/design-fold-clauses.txt`.

## The thesis — four pillars REFINED + AMPLIFIED, the crayons KEPT by register

| Pillar | What it is | The refinement (never a swap) |
|---|---|---|
| **GLASS** | the glass-ui cards / dock / Select surfaces | tinted + layered, never traded for a bespoke plate; the cartoon Card depth kept |
| **PAPER** | the ONE shipped `--graph-*` drafting substrate (`EditorShell.vue:213-235`) | deepened in place — a focus vignette, a fixed ~2-3% feTurbulence grain, a ~60s drift on the **major** line only; honor the J verdict "two math backgrounds is one too many" — no second pattern |
| **AUDACIOUS TYPOGRAPHY** | Instrument-Serif display + Fira-Code mono | pushed bolder + more mathematical (`tnum` gauge figures, engraved channel names, titleblock cartouches); **no new face** |
| **MATHEMATICS** | the bezier / spring / matrix / perceptual-color math | made beautifully VISIBLE as overlays on the kept subjects — never replacing the ball, the curve, the die |

**The crayon-preservation discipline (load-bearing — the user's explicit keeper).**
The saturated primaries (`--rainbow-*` six-stop family `design-idioms.css:78-90`,
`--accent-red`→`--color-progress` `style.css:347/370`, the cube facet rgbs
`CubeTarget.vue:124-130`) are **KEPT, every hue intact, no token muted or removed.**
Coherence comes by **REGISTER, not collapse**: the vivid crayons own the *signal*
surfaces (the six cube facets, the play-CTA ring, the spring/sequence lane hues, the
bound-preset swatch), the muted axis-HSLs own the *frame*. The only token work is a
hygiene lift of raw literals into named tokens (`--face-1…6`, `--spring-lane-*`,
`--amiga-red`) — one-for-one, hue-preserving.

## Scope — the S-clauses (one per scene; each a refinement + its proportionate egg)

- **S1 home** — crayon-red proportioned to the live `t=0→1` readouts + the typed caret;
  the full rainbow concentrated on the **play-CTA hover ring** (the one sanctioned
  multi-color pop, `style.css:368`). Promote the hero `liftDown` (`AnimatedText.vue:78-91`,
  **kept** as the a11y + PRM fallback) to an engine-clocked `CSSKeyframesAnimation` lift.
  **Egg:** a quadrant glass card that **types its own `@keyframes` block** in Fira Code
  (red caret), the hero word lifting to each `translateY`, then `format.ts` serializes
  it back on a ~6s round-trip loop — the moat, made visible.
- **S2 cube** — re-material the **kept** six crayon facets: lift the rgbs into `--face-1…6`
  (no hue touched), give each a lit-lacquer inset-gradient keyed to a fixed key-light;
  drafting-stamp face markings (serif `tnum` numeral + Fira axis tag) + a live
  `rx ry rz` Euler chip in `.readout-accent`. **Egg:** the orientation-coupled **re-lit
  die** — faces toward the pinned light brighten + catch specular as it orbits (rides
  `syncRotationToModel`, no second rAF); the kept dblclick ROLL lands with a `--spin-energy`
  bloom thunk.
- **S3 amiga** — tokenize the **kept** crayon-red ball (`--amiga-red: var(--rainbow-red)`,
  retire the raw `'red'` literal `AmigaScene.vue:229`); magenta proportioned from subject
  to **atmosphere** (CRT phosphor bloom/scanline tint, the `--graph-*` paper composited
  behind the overlay). **Egg:** the once-on-enter **power-on boot** (flash → H-hold roll →
  3 wall-slam Boing bounces) off the IntersectionObserver re-entry; PRM-snapped.
- **S4 square** — the draggable box's **kept** spring-chase made physical: a visible
  elastic rubber-band tether; a draughtsman's crosshair/telemetry rig in the glass language.
  **Egg:** the kept tumble dblclick gains a palette-sweep on the barrel-roll.
- **S5 easing** — the violet `--ppmycota-primary` curve **kept** (hairline → glowing
  signal trace via scene-scoped `--trace-glow`); the flat 3-line grid promoted to the
  demo's own two-tier `--graph-pitch/--graph-major` graticule **inside** the GlassPanel
  wash (kept). **Egg:** drag-bend smears the trace proportional to per-frame velocity,
  decaying via the engine's SmoothProgress; a once-on-enter graticule + self-drawing
  trace (DrawSVG dogfood); PRM-snapped.
- **S6 spring** — the live `.spring-ball` on its rail **KEPT** as the cursor; add a
  vertical axis + a `y=1` target line the ball's trace crests over (clampSweep relaxed on
  the trace axis only); the `linear()` Fira-Code block **kept** as the copyable deliverable,
  the SVG plot of its 26 stops drawn beside it. **Egg:** the four-lane **derby** (gated on
  the kept dblclick) — four SpringProgress solvers race four rainbow lanes (`--spring-lane-*`
  from `--rainbow-*`), ζ=0.45 ringing past the line, ζ=1.0 never crossing; a quiet red-dashed
  settle pulse on `liveSettled`.
- **S7 sequence** — the **kept** `.progress-ball`s + rainbow lanes + real
  progress-driven `.seq-playhead` refined into a phosphor master playhead; `.seq-row-name`
  set in Instrument Serif (engraved channels), `@…ms` in Fira Code. **Egg:** scrubbing the
  master clock **detonates the rainbow lanes in a diagonal cascade** chasing the thumb
  (violet→green), cooling in reverse on drag-back; an orchestrated ~700ms power-on (ruler
  clip-wipe + staggered lane drop); PRM-guarded.
- **S8 motion-path** — the traveller-on-its-line (🙂↔️) **KEPT** (no dot/trace swap),
  bound to bank into the live path tangent; the D17 cyan wash **kept** as the base, the
  two-tier `--graph-*` layered over it (one-crayon-per-table discipline — cyan owns this
  page). **Egg:** *author-the-curve, the-creature-obeys* — deform a handle and the traveller
  banks into the new tangent with the ants still flowing; the wink (😎) lap-egg flashes one
  warm `--rainbow-*` spark; the guide self-builds via DrawSVG on mount.
- **S9 playground** — the **kept** per-asset preset bind made a luminous event over the
  **untouched** graph-paper casting floor (PAPER pillar deepest layer); the rainbow codes
  the bound preset as a 1-em layer-chip swatch (crayon as authorship signal, in proportion).
  **Egg:** **bind-ignition** — binding lights the asset (key-light bloom + a first-cycle
  comet-tail tracing the preset's actual bezier/spring curve, drawn back onto the page); the
  warm key-light **follows the pointer** over the empty stage; PRM-static.

## The TASTE boundary (the K precedent)

Per the K TASTE-boundary invariant, **the design verdict is USER-DOMAIN.** L.W11 closes
ONLY on the user's verdict on the refined treatments (the before/after packet under
`docs/frontend-design/`), scheduled before the L close — an agent "designer-eye PASS"
is corroboration, never the verdict. This wave is the proposal; the user's "meets the
bar" is its gate, as in K.

## The born-RED gate

- **`proof:crayon-preserved` (NEW, born-RED on regression):** asserts every keeper token
  hue is UNCHANGED — `--rainbow-*` (6 stops), `--accent-red`/`--color-progress`, and the
  hoisted `--face-1…6`/`--spring-lane-*`/`--amiga-red` resolve to the SAME computed
  color as 4.3.0. RED if any clause mutes, removes, or recolors a crayon (the user's
  explicit keeper); green when the hygiene lift is hue-exact. This is the wave's spine —
  refinement may never abrogate the palette.
- **`proof:design-refinement` (per-scene arms):** each scene's new instrument layer +
  easter-egg DOM is present + engine-dogfooded (mirrors `proof:easter-egg`: the trigger
  fires the observable off-the-normal-path effect; no hand-rolled rAF).
- **`proof:visual-lock` re-baseline (HYGIENE/observe-only):** the refined appearance is
  re-captured per the I.W7 self-baseline drift discipline — corroboration, not authority.
- **`proof:taste-packet`:** the before/after packet is well-formed (the K.W5 generator).

## Deps + the value.js cross-repo design note

**Deps: none** — Band A, kf-internal, value.js-0.13.0-and-glass-ui-sufficient. The
demo refinements touch only `demo/` styles + components (the four pillars are already
shipped). The **value.js pair** (`color-picker`, `hero-lab` — `value.js/docs/frontend-design/`,
hardened to the same verdict: the HSL square KEPT with the breathing sRGB-gamut contour
as an overlay egg; the crayons KEPT as calibration ticks on the oklch dial) is a
**cross-repo design DISPATCH** to value.js (value.js owns its own demo design under
inv-16) — recorded in `KF-TO-VALUEJS-O-ASKS.md` as a design suggestion, not a kf wave.

## Bite

`proof:crayon-preserved` reds the instant a refinement recolors or mutes a keeper token
(the abrogation the user forbade); the per-scene refinement arms red if an easter-egg
hand-rolls a rAF instead of dogfooding the engine (inv ζ); the TASTE gate holds the wave
open until the user's verdict — no agent self-certifies the design.
