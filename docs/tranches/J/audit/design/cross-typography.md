# Cross-Audit — TYPOGRAPHY lane (Tranche-J)

Large and audacious, suffused with proportion. READ-ONLY audit; proposals only.

## The type system as built (ground truth)

φ-ladder is single-sourced from glass-ui `typography.css` (display rungs use
`--font-display` = **Instrument Serif**; `text-title`/`text-heading`/`text-subheading`
use `--font-text` = the demo's reclaimed native **sans**; `font-mono` = **Fira Code**):

| rung | size | family token | resolves to |
|---|---|---|---|
| `text-display-audacious` | clamp → 352px | `--font-display` | Instrument Serif |
| `text-display-mega` | clamp → 177px | `--font-display` | Instrument Serif |
| `text-display-4` | clamp → 86px | `--font-display` | Instrument Serif |
| `text-title` | 32.9px / φ^(3/2) | **`--font-text`** | **native sans** (700) |
| `text-heading` | 25.9px / φ | **`--font-text`** | **native sans** (700) |
| `text-subheading` | 20.4px / √φ | `--font-text` | native sans (600) |
| `text-mono-caption` / `text-mono-small` | 12 / 14px | `--font-mono` | Fira Code |
| `text-admin-label` | 10px caps | `--font-text` | native sans, tracked caps |

Demo rung census (`grep` over `demo/**/*.{vue,ts}`): `text-small` ×31,
`text-admin-label` ×29, `dock-label` ×10, `text-body` ×9, `text-heading` ×8,
`text-subheading` ×6, `text-title` ×5, `text-display-mega` ×3, `text-display-4` ×1,
`text-display` ×1, `text-hero` ×1. The mass sits at 10–14px; the display tier is
used in exactly ONE place.

**The headline finding:** Instrument Serif (the brand display face) appears at
**exactly one moment in the entire app** — the start-screen `<h1 class="text-display-mega">`
(`EditorStartScreen.vue:16`). Everywhere else the "big" text is `text-title`/`text-heading`,
which resolve `--font-text` (native sans, bold). So every per-scene stage name —
"SpringProgress", "ease", "Sequence", "MotionPath" — is **bold native sans, not the
display serif**. The identity face is concentrated in one hero and absent from all 8
scene stages. (typography.css:250/259 — `text-title`/`text-heading` `font-family:
var(--font-text)`.)

---

## Where the display register lands today, and whether it's audacious enough

- **Hero start screen — GOLD STANDARD** (`home-desktop.png`, `home-laptop.png`):
  "Select an animation..." at `text-display-mega` (peak 177px), Instrument Serif,
  carrying the glass-ui `.depth-text` cartoon offset-shadow (`depth-text` in
  glass-ui `utilities.css:264`), with the saturated cube as the color pop to its
  right. This is the single best typographic moment — audacious scale, distinctive
  face, calm field, sharp accent. `hero-display { line-height: 0.92 }` tightens the
  two-line poster block (`EditorStartScreen.vue:78`). Keep exactly as is.

- **Start-screen subtitle** — `text-title` italic (`EditorStartScreen.vue:32`).
  Reads as a SANS italic at 32.9px. It works as a calm secondary line, but it is
  NOT the display serif (a near-miss many would assume is serif). Fine as-is; noted
  for the record.

- **Scene stage headers — the recurring idiom, ALL SANS** (`spring-desktop.png`,
  `easing-desktop-open.png`, `sequence-desktop.png`, `motion-path-desktop.png`):
  every stage opens with `<span class="text-heading text-foreground">{name}</span>`
  + a `text-mono-caption` live readout + a `text-admin-label` status pill. Confirmed
  in `SpringTarget.vue:17`, `EasingTarget.vue:21`, `SequenceTarget.vue`,
  `MotionPathTarget.vue`. This idiom is clean and consistent — but it is the timid
  register. φ (25.9px) bold sans on a half-empty stage under-uses both the space and
  the brand face.

**Verdict:** the display tier is used once, beautifully; the scenes never reach for
it. The brand's "large and audacious" promise is delivered at the front door and
withdrawn the moment you enter any scene.

---

## Rung discipline & incongruences

- **Mobile hero collides with the subject** (`home-mobile.png`): at 375w
  `text-display-mega` "Select an / animation..." wraps to two lines and physically
  **overlaps the cube**, and the `text-title` subtitle "from the list below, then
  press Play." overprints the cube's red face. This is a real hierarchy defect — two
  focal elements fighting in the same pixels. The mega rung's mobile floor
  (`clamp(5.382rem … )` = 86px) is too large for the 375px stage that also hosts the
  subject. (`EditorStartScreen.vue:16`; the host is `pointer-events-none` absolute
  overlay so it can't even be pushed by the cube.)

- **Stage-name face split: serif hero vs sans scene-names.** The hero is serif; the
  scene "title" (`text-heading`) is sans. A first-time visitor reads the front door
  as serif-brand, then every scene as a different (sans) voice. Not wrong, but the
  display identity does not carry inward — an incongruence of register, not of size.

- **Two near-identical "name + readout" headers with subtly different weights**
  (`spring-desktop.png` "SpringProgress x = 1.000 · v = 0.00" vs
  `easing-desktop-open.png` "ease F(0.95) = 0.999"): both `text-heading` + mono, but
  the easing readout renders `F(...)` capitalized by the mono-caption rung's
  uppercasing while spring shows lowercase `x =`/`v =` — the same idiom reads
  inconsistently cased across scenes. Minor, but it's the kind of drift the
  mono-readout idiom should standardize. (`EasingTarget.vue:24` vs
  `SpringTarget.vue:20`.)

- **Square subject label is timid mono** (`square-desktop.png`): "drag me" in
  `font-mono` at default size on a large mint card surrounded by empty stage
  (`SquareScene.vue:5,15`). The subject is a confident color pop; the call-to-action
  on it whispers.

---

## SUFFUSION — proportionate opportunities for LARGER / more audacious type

1. **Easing scene: the curve NAME as a display-scale specimen behind/beside the
   stage** (OPP, `easing-desktop-open.png`). The stage is ~70% empty whitespace with
   only the tiny "ease" label top-left and one green ball. The easing name is the
   single most brand-defining word on this scene — the math IS the brand. Render
   "ease" / "easeInOutQuad" / "cubic-bezier" as a `text-display-mega`/`-hero`
   Instrument Serif specimen, ghosted (low-opacity, behind the moving ball) or
   anchored bottom-left as a poster watermark. One audacious word, calm field, the
   ball as the sharp accent. Owner: kf-demo (`EasingTarget.vue:21` header → add a
   display-scale specimen layer in the empty stage region).

2. **Live numeric readouts as confident mono displays, not 12px captions** (OPP,
   `spring-desktop.png` "x = 1.000 · v = 0.00", `easing` "F(0.95) = 0.999",
   `motion-path` "OFFSET-DISTANCE = 0% · TANGENT -89°"). These are the engine's
   live math — the inv-ζ dogfood, the thing the product DOES. Today they're
   `text-mono-caption` (12px). Promote the headline value to a confident mono
   display (e.g. `text-display-2`/`-3` Fira Code, `tabular-nums`, the unit/label
   staying small) so the number wins — exactly the `--metric-row-value-clamp-max:
   var(--type-display-hero)` pattern glass-ui already ships for dashboard metrics
   (tokens.css:1641). Owner: kf-demo (`SpringTarget.vue:20`, `EasingTarget.vue:24`,
   `MotionPathTarget.vue` header).

3. **Scene stage names in the DISPLAY register** (OPP, all `*-desktop.png` stages).
   Lift "SpringProgress"/"Sequence"/"MotionPath" from `text-heading` sans (25.9px)
   to a real display rung in Instrument Serif (`text-display`/`-2`, 42–53px) so the
   brand face carries inward and each scene earns a poster title proportionate to its
   empty stage. This is the highest-leverage single change for suffusing the display
   identity. Owner: kf-demo (the four `*Target.vue` header spans).

4. **Square "drag me" as an audacious display invitation** (OPP, `square-desktop.png`).
   The empty stage + the bold mint card invite one confident word. Replace the small
   mono "drag me" with a `text-display`/`text-title` Instrument Serif "drag me"
   centered on (or ghosted behind) the card — the type as the affordance. Owner:
   kf-demo (`SquareScene.vue:15`).

5. **404 / honest-not-found + empty states as display moments** (OPP). The hero
   already proves the demo nails the empty-state poster; the 404 (B9/K honest 404 per
   commit log) and any "no animation selected" fallbacks should reuse the SAME
   `text-display-mega` Instrument Serif treatment for one-line continuity of the
   audacious voice. Owner: kf-demo (404 route view + EditorStartScreen variants).

6. **Spring sidebar preset names as a small display ladder** (OPP, `spring-desktop.png`
   "Smooth / Snappy / Bouncy / Gentle" preset cards with "0.5 / 0.86" mono below).
   The preset NAME is currently small bold sans; the response/ζ pair is small mono.
   This is a natural "display name + mono spec" pairing — bump the preset name to
   `text-subheading`/`text-heading` Instrument Serif so the four physics presets read
   as a typographic ladder, the mono spec as the technical sub-line. Proportionate:
   sidebar, not stage, so a modest rung. Owner: kf-demo (`SpringSidebar.vue`).

7. **springLinearStops() / OFFSET-PATH code readouts — confident mono code blocks**
   (OPP→P2, `spring-desktop.png` bottom card, `motion-path-desktop.png` bottom).
   These dogfood-the-engine code dumps are the best mono moments in the app but sit
   at caption size in a cramped scrolling box. Give the generated CSS a slightly
   larger mono (`text-small`/`text-body` Fira Code) and more breathing room — the
   generated-CSS-as-product deserves to read as a confident artifact, not a debug
   log. Owner: kf-demo (`SpringTarget.vue` sweep card, `MotionPathTarget.vue` readout).

8. **Sequence `@0MS … @1040MS` row labels at a stronger mono** (OPP,
   `sequence-desktop.png`). The stagger timestamps are the scene's quantitative
   spine but render at `text-mono-caption` muted. A touch larger + higher contrast
   (`text-mono-small`, foreground not muted) would let the time-ladder read as the
   structural device it is. Owner: kf-demo (`SequenceTarget.vue` row labels).

---

## Anti-goals — where big type would FIGHT the subject

- **Amiga scene** (`amiga-desktop.png`): the red checkered boing-ball in the grey
  room is a faithful Amiga homage with NO stage header by design. Adding display
  type here would break the iconic minimal aesthetic. Leave headerless. (This is the
  one scene that correctly has no title — a deliberate, on-brand silence.)

- **Motion-path stage interior** (`motion-path-desktop.png`): the bezier path +
  handles already fill the stage as the math-on-display. A display watermark behind
  it would compete with the live geometry. Confine any display amplification to the
  HEADER name + the readout NUMBER, not the path canvas.

- **Mobile generally** (`*-mobile.png`): the stages are subject-dominant at 375w;
  display-scale specimens proposed above must be desktop/laptop-only or heavily
  down-clamped on mobile, or they'll repeat the hero's mobile-overlap defect (#1).

---

## glass-ui handoff items (typography)

- **REFINE-IN-GLASS-UI:** the mono-readout uppercasing inconsistency (finding §3:
  `text-mono-caption` uppercases, surfacing "F(...)" vs lowercase "x ="). glass-ui's
  mono-caption rung should expose a case-preserving variant (the demo already
  invented `.code-token` locally for exactly this — design-idioms.css:465 — which is
  a signal the rung needs a `none`-transform sibling upstream). Owner: glass-ui-handoff.

- **ABSTRACT-INTO-GLASS-UI:** the demo's recurring "name + live mono readout + status
  pill" stage-header is a reusable metric-header primitive (4 byte-similar copies:
  spring/easing/sequence/motion-path). glass-ui already ships `--metric-row-value-clamp-max`
  (tokens.css:1641) — a `MetricHeader` / `.metric-header` utility pairing a display
  name + a clamped mono value + a status badge would let the demo consume it and pick
  up the display-scale readout (#2) for free. Owner: glass-ui-handoff.

- **ADOPT (in kf):** glass-ui's `text-display-hero`/`-audacious` + `--metric-row-value-clamp-max`
  poster-metric idiom is already shipped and built for exactly the "make the number
  win" stage scenario — the demo should adopt it for the readout displays (#2) rather
  than hand-rolling a new size. Owner: kf-demo consuming glass-ui.
