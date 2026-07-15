# Home / Start Screen — frontend-design treatment

> Page: the landing — the first impression + the moat pitch. The home state is
> `CubeScene` rendered with `hideLoader` + the `EditorStartScreen` overlay
> (App.vue:107, 114–116; scenes.ts:85–90). It is the only screen a first-time
> visitor sees before they touch a control. Today it reads: *"Select an
> animation from the list below, then press Play."* — a caption, not a pitch.

---

## §Aesthetic direction

**The POV: THE DRAFTING TABLE — the four pillars the demo already owns (GLASS,
PAPER, AUDACIOUS TYPOGRAPHY, MATHEMATICS), refined and amplified until the
landing reads as an instance of its own engine.**

keyframes.js IS a CSS `@keyframes` engine. The landing must not *describe* that;
it must *be* an instance of it — but by **sharpening the language already on the
page**, not by re-theming it. The page stays what it is: a sheet of engineering
graph PAPER (the `--graph-*` substrate already shipped, EditorShell.vue:213)
carrying GLASS cards (the glass-ui surface register), AUDACIOUS TYPOGRAPHY
(Instrument Serif display + Fira Code mono, style.css:63–64) and visible
MATHEMATICS (the bezier/spring/matrix/perceptual-color the engine actually
computes). The refinements push each pillar bolder; they do not swap any of
them. The serif display voice reads as the *authored intent*; the Fira Code mono
reads as the *machine output*; the page is the conversation between the two
faces.

**The proportionate signature (a delight, not the theme):** a **small living
`@keyframes` block in the lower-left whose typed-out rules drive the hero word in
real time** — you watch `transform: translateY(...)` get written
character-by-character in mono, and the hero word lifts in lock-step. Source and
result, on the same clock. It is the page's *one* unforgettable easter egg — a
quiet quadrant-sized delight that rewards a second look, NOT a full-canvas
re-theme. It sits *beside* the hero and cube; it never displaces them. That
restraint is the point: every other animation-library landing shows you a
finished demo; this one *also* lets you catch it compiling, if you look.

This direction does not theme-swap glass-ui and does not evict a single extant
idiom. It leans into what the demo already owns — the graph-paper plate
(EditorShell.vue:213), Instrument Serif + Fira Code (style.css:63–64), the
**KEPT crayon signature** (`--accent-red` motion authority collapsing to
`--color-progress`, style.css:347/370; the `--rainbow-*` six-stop family,
design-idioms.css:78–90), the `depth-text` cartoon shadow, and the
genuinely-dogfooded `AnimatedText` / `TypingDots` engine seams — and refines
their *proportion, placement, and timing*. Refine, never abrogate.

---

## §Current-state audit — generic / weak vs the SOTA bar

The home overlay is `EditorStartScreen.vue`. It is *competently typeset* but
*pitch-less and motion-flat* for a page whose entire reason to exist is to prove
a motion engine.

1. **The copy is an instruction label, not a value proposition.**
   `EditorStartScreen.vue:111–115`: `title: "Select an animation"`,
   `subtitle: "from the list"`, `subtitleSuffix: "below, then press Play."`.
   This is microcopy for an *empty state*, not a *landing*. A first-time visitor
   gets zero signal about what keyframes.js *is* ("CSS keyframe animations for
   anything in JavaScript" — the actual moat, per CLAUDE.md) or why it is
   different (parse real `@keyframes`, animate any object *or* DOM, round-trip
   back to CSS). SOTA landings (Motion, GSAP, Theatre.js) lead with the
   capability. This leads with a chore.

2. **The hero motion is a 3s perpetual idle twitch — decorative, not narrative.**
   `AnimatedText.vue:78–91`: `@keyframes liftDown` lifts each word `-10px` for
   ~5% of a 3s cycle, then rests for 90%. It is a gentle word-by-word bob on an
   infinite loop. It proves nothing about the engine — it could be a 4-line CSS
   file on any landing page. The *engine is literally running it* (great!) but
   **the visitor cannot tell**, because there is no visible source, no readout,
   no "this is compiled CSS" tell. The dogfood is invisible, so it does no
   marketing work.

3. **The lower-left quadrant was deliberately *vacated* and left blank.**
   `EditorStartScreen.vue:78–82` + `:182–185`: the J-era `FourierField` was
   removed and the spot is now "HONEST blank grid." Honest, yes — but it is
   prime hero real estate (the lower-left of an asymmetric composition) sitting
   empty on the most important page. The audit verdict at the time was "two math
   backgrounds is one too many." Correct — but the answer isn't *nothing*, it's
   *the right one thing*: the live source panel (see §The one unforgettable
   moment). The vacancy is an opportunity the page is currently wasting.

4. **The graph-paper substrate is flat and inert — depth without atmosphere.**
   `EditorShell.vue:213–235` draws a fine (1rem) + major (5rem) two-tier grid at
   3% / 11% opacity (design-idioms.css:270–271). It is a *good* substrate but it
   is perfectly uniform and perfectly still — no vignette, no perspective, no
   atmospheric falloff. On a 5K cinema panel it tiles to the horizon as flat
   wallpaper. The SOTA bar (Linear, Vercel, Rive) gives the backdrop *depth*: a
   radial focus toward the subject, a subtle drift, grain. The grid is a stage
   floor with no lighting.

5. **No orchestrated load.** When the page mounts, `AnimatedText` words begin
   their idle loop and `TypingDots` blink — but there is no *arrival*. The hero,
   the subtitle, the hint, the cube, the (proposed) source panel all just exist
   at t=0. SOTA landings open with one choreographed reveal that establishes
   hierarchy in the first 900ms. This page has no curtain-up.

6. **The CTA is invisible.** "then press Play" points at the bottom
   `TransportDock`, off in the chrome. There is no actual button on the landing,
   no rainbow play-pop (the demo *owns* a gorgeous `--rainbow-*` gradient,
   design-idioms.css:459–471, used nowhere on the landing). The single most
   important action — *start an animation* — has no on-canvas affordance.

**What is already SOTA and must be preserved:** the Instrument-Serif/Fira-Code
pairing (genuinely characterful, never Inter/Roboto — style.css:63–64); the
metric-matched Capsize fallback so the LCP hero has ~0 CLS (style.css:97–104);
the *genuine* engine dogfood of `TypingDots` (per-dot `CSSKeyframesAnimation` +
`stagger`, TypingDots.vue:84–98); the `--accent-red` motion-color collapse
(style.css:370); φ-derived layout; the PRM guards on every motion seam. The
refinements ride **on top of** this, never replace it.

---

## §Refinements

### TYPOGRAPHY

The display/mono pairing is the page's secret weapon and is currently
under-exploited. Make the **two faces do narrative work**: serif = human intent,
mono = machine output.

- **Hero recomposition (`EditorStartScreen.vue:45–49`).** Keep
  `text-display-mega` + `hero-display` but change the *content* from an
  instruction to a claim. The hero word becomes the thing being animated —
  e.g. **"motion"** or **"keyframes"** — driven live by the source panel
  (§moment). Set the word in Instrument Serif (already the `--font-display`
  binding via `text-display-mega`), but render a **mono "stage-direction"
  superscript label** above it in Fira Code at `text-mono-caption`, all-caps,
  letter-spaced: `@keyframes hero {` — so the eye reads the CSS *rule name*
  sitting over its *rendered result*. This is one new `<span>` above the
  `<AnimatedText>`, styled with the existing `--font-mono` token and the
  `--accent-red` accent at ~0.6 alpha.

- **Subtitle = the moat sentence, set in italic serif (already italic —
  `:67`).** Replace `"from the list below, then press Play."` with the actual
  pitch: *"Parse real `@keyframes`. Animate any object — or the DOM. Get the CSS
  back."* Keep the `text-heading` italic rung (the φ-ladder step-down at :61–66
  is good). Wrap the three API verbs (`@keyframes`, *any object*, *the CSS back*)
  in the existing `.code-token` mono idiom (design-idioms.css:650) so the
  sentence itself alternates serif-prose ↔ mono-API — the typographic thesis of
  the page in one line.

- **Mono micro-labels everywhere a value is live.** The `.readout-accent` idiom
  (design-idioms.css:564) already says "the number that proves the engine runs
  carries the colour." Apply it: a tiny live `t=0.00 → 1.00` progress readout in
  Fira Code, `--accent-red`, pinned under the hero, ticking with the loop. It
  costs one `requestAnimationFrame`-fed `<span>` and screams "this is computed,
  not canned."

### COLOR

The palette is already cohesive and *not* AI-slop (no purple-on-white — the
motion authority is a deliberate **crayon red**, style.css:347/370). The crayons
are a TASTE-APPROVED signature; the work is **proportion**, not replacement —
keep every token, refine *when and where* it fires:

- **The crayon red IS the page's signature accent — keep it, give it
  discipline.** The hero mono label, the live `t` readout, the typed-source
  caret, and the play CTA's *ring* all draw `--accent-red` / `--color-progress`
  (style.css:347/370). One dominant crayon, fired with restraint — the
  antithesis of a gradient mush. This is the crayon used *proportionately*: a few
  load-bearing strokes of pure red, never a wash.

- **Keep the full `--rainbow-*` six-stop family — concentrate its one big
  appearance on the play CTA.** design-idioms.css:78–90 (the six HSL stops +
  cyan mid) and the :459–471 spectrum recipe stay exactly as authored; nothing is
  removed or muted. The landing simply *places* its single largest rainbow
  moment on the primary CTA (§MICRO-INTERACTIONS) — the *one sanctioned
  multi-color pop* the codebase already names (style.css:368) — so the full
  spectrum lands with maximum impact rather than being diluted across the page.
  Rainbow on the CTA, crayon red on the readouts: that deliberate contrast *is*
  the color story. (The HSL spectrum and primaries elsewhere in the fleet — the
  cube's axis crayons, the spring badges' `--rainbow-violet`, the color-picker's
  spectrum square — are KEPT untouched; this page just doesn't duplicate them.)

- **Dark mode is the hero context.** The graph-paper retints for free over
  `--foreground` (EditorShell.vue:207). Author the new atmosphere (§BACKGROUND)
  with `color-mix(... var(--background) ...)` so it follows the `.dark` class
  with zero forked values, exactly as the existing tokens do.

### MOTION

This is the page's whole job. The refinement: **make the dogfood VISIBLE and
turn the idle twitch into a round-trip narrative.**

- **KEEP the idle `liftDown`; PROMOTE it from hand-rolled CSS to an
  engine-driven lift.** Today `AnimatedText`'s `liftDown` (AnimatedText.vue:78–91)
  is a hand-rolled CSS `@keyframes` — a little ironic on a `@keyframes`-engine
  landing. The refinement does NOT delete it: `AnimatedText` stays the
  a11y/word-split substrate AND `liftDown` remains the reduced-motion / no-engine
  fallback (so the hero still bobs gracefully if the heavy split never loads).
  The enhancement layers *on top*: once `await loadAnimationEngine()` resolves
  (index.ts boundary; the page is already async-scene-loaded so this fits), the
  hero word's transform is driven by a **real `CSSKeyframesAnimation`** whose
  keyframes are the *same string being typed in the source panel*. Same lift,
  same final frame — now source text and rendered motion share one clock. This is
  the difference between "we use CSS animations" and "watch our engine compile
  one," achieved by *upgrading* the existing motion rather than replacing it.

- **One orchestrated load (≤900ms), staggered, using the library's own
  `stagger`.** On mount, reveal in sequence: (1) the graph-paper vignette fades
  up, (2) the mono `@keyframes hero {` label types in, (3) the hero word lifts
  into place word-by-word (the existing `AnimatedText` per-word `animationDelay`
  at `:25` already does this — retime it as an *entrance*, not an infinite
  idle), (4) the subtitle API sentence wipes in, (5) the source panel's first
  line begins typing, (6) the cube backdrop settles. Distribute the delays with
  `stagger(...)` (the same primitive TypingDots.vue:66 uses) so the orchestration
  is *itself* a dogfood. Curtain-up in under a second, hierarchy established.

- **Scroll-driven is N/A but the round-trip loop is the substitute.** The shell
  is `overflow: hidden` (style.css:551) — there is no scroll. So the "scroll
  story" becomes a **timed round-trip loop**: type the source → play the hero
  lift → serialize back to a mono "output" line → flash a "copied to clipboard"
  affordance → clear → repeat. The CSS-in/animation-out/CSS-back narrative on an
  ~6s loop. (`format.ts` already serializes `Animation → CSS string` — the
  "CSS back" half is a real engine call, not faked.)

- **Every new motion gets a PRM guard**, matching the page's existing discipline
  (AnimatedText.vue:99, TypingDots `respectReducedMotion: true` at :89). Under
  `prefers-reduced-motion: reduce`: no typing, no lift loop — the hero rests in
  its final frame with the source panel showing the *completed* block statically.
  The narrative still reads (source + result both visible), just without motion.

### SPATIAL

The current composition is a centered title ladder over a centered cube with a
blank lower-left (EditorStartScreen.vue:23–24, the `grid ... place items
center`). Break the symmetry into a **drafting-table diagonal**.

- **Asymmetric three-zone diagonal.** Top-left: the mono `@keyframes hero {`
  label + hero word (intent). Center-right / mid: the cube backdrop, receded
  (CubeScene already supports `cube-stage--hero-recede`, CubeScene.vue:246).
  Bottom-left (the *vacated* quadrant, EditorStartScreen.vue:78–82): the **live
  source panel** — a small `surface="cartoon" tier="quiet"` glass card pinned to
  the lower-left, holding the typing `@keyframes` block in Fira Code. The eye
  travels top-left → center → bottom-left along the page's diagonal: *intent →
  motion → source*. The blank quadrant gets its rightful one thing.

- **Overlap, don't box.** The source panel should *overlap* the graph major-grid
  lines and sit half-under the receded cube's shadow — layered transparency, not
  a tidy grid cell. Use the existing `z-controls` rung (style.css:26) for the
  hero, place the source card just under it so the cube can cast onto it.

- **Generous negative space at desktop, controlled density at mobile.** Desktop
  keeps the airy diagonal. Mobile already splits hero-band/cube-band disjointly
  (`--start-hero-band`, design-idioms.css:230; CubeScene.vue:246) — on mobile,
  *collapse the source panel into a single typed line* beneath the subtitle
  rather than a floating card, so the round-trip story survives in one column
  without fighting the cube for pixels (the exact TYP-1 collision the J-tranche
  already solved for the hero — respect it).

### MICRO-INTERACTIONS

The page currently has *zero* hover affordances and no on-canvas CTA. Add three,
all surprising, all cheap:

- **The play CTA — a rainbow-ringed serif "Play" pill, lower-center.** A real
  `<button>` (not "press the dock"). Idle: ghost glass. Hover: the `--rainbow-*`
  gradient (design-idioms.css `.progress-bar` recipe) sweeps *around the ring*
  (animate `background-position`), the label nudges, the cube backdrop spins up
  ~10% faster — a pre-commit "preview" of motion. Click: it actually starts the
  cube animation (the real `Play` the dock fires) **and triggers a View
  Transition** into the cube scene. The CTA *is* the round-trip's "play" step.

- **Hover the source panel → the hero re-compiles.** Pointer-enter the live
  `@keyframes` card: the typing restarts from line 0 and the hero word re-lifts
  from rest — "scrub the compilation." A delightful, on-brand reason to hover.
  Pointer-leave resumes the ambient loop.

- **The cube as a draggable invitation (already half-built).** The hint copy is
  *"or drag M. cubert"* (App.vue:115) — but nothing on the landing *signals*
  draggability. On first idle (~3s no interaction), have the cube do one slow
  15° "nudge-and-return" wobble (a real `CSSKeyframesAnimation`, one-shot) — the
  universal "you can grab me" tell. PRM: skip the nudge.

### BACKGROUND

Give the flat graph paper depth and atmosphere *without* a second pattern (the
J-tranche's "two math backgrounds is one too many" verdict stands — we *enhance*
the one grid, not add another):

- **Radial focus vignette toward the subject.** Add one
  `radial-gradient(... at 55% 45%, transparent 0%, color-mix(in srgb,
  var(--background) 70%, transparent) 100%)` over `.grid-background`
  (EditorShell.vue:213) so the grid is crisp at the cube/hero focal point and
  falls toward the edges — instant depth, theme-following via `--background`,
  zero new tiles. This kills the "flat wallpaper to the horizon" 5K problem.

- **A whisper of grain.** A single fixed SVG `feTurbulence` noise layer at
  ~2–3% opacity over the whole shell — the texture every premium dark UI (Linear,
  Vercel) uses to defeat gradient banding and give the plate a "paper" tooth that
  matches the blueprint metaphor. One element, `pointer-events:none`,
  `mix-blend-mode: overlay`, PRM-static (it doesn't move). It earns the
  "drafting table" feeling the graph grid only half-delivers.

- **Slow parallax drift on the major grid only.** Animate the 5rem major-line
  layer's `background-position` by ~40px over ~60s (the fine 1rem layer stays
  pinned) — a near-imperceptible drift that makes the substrate feel *alive* and
  gives the static cube something to sit *against*. One `@keyframes`, PRM-off.
  Subtle enough to never compete with the hero; present enough that the page is
  never truly still.

---

## §The one unforgettable moment

**THE LIVE SOURCE PANEL: a `@keyframes` block that writes itself and drives the
hero in real time — the compilation, rendered.**

In the lower-left quadrant (today vacant — EditorStartScreen.vue:78–82) sits a
small glass card (`surface="cartoon" tier="quiet"`, the demo's owned control
register). Inside, in Fira Code with a blinking `--accent-red` caret:

```
@keyframes hero {
  0%   { transform: translateY(0);     }
  20%  { transform: translateY(-22px); }   ← caret typing here
  100% { transform: translateY(0);     }
}
```

The block **types itself out, character by character**, on the engine's clock.
As each `translateY(...)` value lands, **the hero word above lifts to exactly
that value, live** — because the same string is parsed by a real
`CSSKeyframesAnimation` (`loadAnimationEngine()` → `engine.ts`) and applied to
the hero. Source and result share one playhead. Then the loop *completes the
round-trip*: a mono line slides in below — `// serialized →` — and the engine's
own `format.ts` prints the animation **back to a CSS string**, with a brief
"copied" flash (it's actually copyable). Pause. Clear. Retype. ~6s loop.

No other animation library's landing lets you *catch* its **compiler**. Motion
shows a finished demo. GSAP shows a timeline. Theatre.js shows an editor.
keyframes.js alone surfaces the **CSS → engine → motion → CSS round-trip** as a
quiet quadrant-sized loop *beside* the hero — the literal, single-sentence pitch
from CLAUDE.md ("Parse `@keyframes`, animate any object… get the CSS back")
rendered as a self-driving easter egg. It is the page's delight, not its
dominant theme: the hero word, the serif voice, the graph paper and the cube
still carry the composition; the source panel is the reward for looking closer.
*You watch the keyframes get written, and the word moves as they're written.*
That is the thing the visitor screenshots and sends to a coworker — and it earns
that by being proportionate, not by taking over the page.

It is also a **structural truth, not a gimmick**: it uses the real engine
(`CSSKeyframesAnimation`, `stagger`, `format`), the real fonts (serif intent +
mono machine), the real accent (`--accent-red`), and fills the real vacancy
(lower-left) with the real product. The page becomes a working instance of
itself.

---

## §Design verdict reconciliation

The user's binding verdict on the fleet — **keep the crayons (proportioned),
refine-not-abrogate the four pillars (GLASS, PAPER, AUDACIOUS TYPOGRAPHY,
MATHEMATICS), fold the signature moments as proportionate easter eggs, deftness
throughout** — was applied to this treatment. What changed:

- **TEMPERED — the signature moment from "the whole page" to a proportionate
  easter egg.** The original `§Aesthetic direction` framed the live source panel
  as the page's dominant identity ("the hero itself", "the whole page is…").
  Re-scoped to a *quadrant-sized delight beside* the hero/cube/serif — a reward
  for looking closer, never a re-theme. The hero word, the graph paper, the
  glass, and the cube carry the composition; the panel is the easter egg (verdict
  §3, §4).

- **REVERSED — "Replace the idle `liftDown`" → "KEEP `liftDown`, promote it."**
  The MOTION clause now preserves `AnimatedText`'s `liftDown`
  (AnimatedText.vue:78–91) as the a11y substrate AND the reduced-motion / pre-load
  fallback, and layers the engine-driven `CSSKeyframesAnimation` lift *on top* —
  same lift, same final frame, now engine-clocked. Refine, not abrogate (verdict
  §2). The implementation-plan step 2 was corrected to match.

- **SHARPENED — the crayons are KEPT and proportioned, never minimized.** The
  COLOR section now states explicitly that `--accent-red` / `--color-progress`
  (style.css:347/370) and the full `--rainbow-*` six-stop HSL family
  (design-idioms.css:78–90) are TASTE-APPROVED and stay exactly as authored. The
  work is *proportion* — a few load-bearing crayon-red strokes on the readouts,
  the one big rainbow appearance concentrated on the play CTA — not muting or
  replacing any token (verdict §1). A note was added that the fleet-wide
  primaries this clause does NOT touch (the cube's axis crayons, the spring
  `--rainbow-violet` badge, the color-picker spectrum square) stay KEPT.

- **HELD — already verdict-aligned, amplified not changed.** The four pillars
  were already the treatment's spine: graph PAPER + vignette/grain/drift
  (BACKGROUND), GLASS source/CTA cards (SPATIAL), the Instrument-Serif/Fira-Code
  AUDACIOUS TYPOGRAPHY pairing pushed bolder (TYPOGRAPHY), and the visible
  MATHEMATICS of the live `t` readout + the compile loop. These were kept and
  their *proportion* tightened. The remaining signature moments (orchestrated
  ≤900ms load, the rainbow play-pop, the cube nudge-and-return, the hover-
  recompile) read as proportionate easter eggs as written.

---

## §Implementation plan (priority order)

All source changes are PROPOSALS — this doc writes no code outside itself.

1. **Copy → pitch (highest leverage, lowest risk).**
   `EditorStartScreen.vue:103–116` props: change `title` to the animated hero
   word (e.g. `"keyframes"`), rewrite `subtitle`/`subtitleSuffix` into the moat
   sentence with `.code-token` (design-idioms.css:650) wrapping the API terms.
   Add the mono `@keyframes hero {` stage-direction `<span>` above the
   `<AnimatedText>` at `:45`. *No new components; pure content + two spans.*
   Immediately upgrades the page from "empty-state label" to "landing."

2. **The live source panel + engine-driven hero (the signature moment).**
   New SFC `demo/components/editor-shell/HeroSourcePanel.vue`:
   types a `@keyframes` string (Fira Code, `--accent-red` caret), parses it via
   `await loadAnimationEngine()` → `CSSKeyframesAnimation`, applies the transform
   to the hero word, and serializes back via `format.ts` on loop. Mount it in
   the vacated lower-left of `EditorStartScreen.vue:78–82`. Drive the hero lift
   from this panel's animation once the engine loads; KEEP `AnimatedText`'s
   `liftDown` (AnimatedText.vue:78–91) as the entrance + reduced-motion / pre-load
   fallback (never deleted). PRM: static completed block, no typing, hero rests in
   its `liftDown` final frame.

3. **Orchestrated load via `stagger`.**
   In `EditorStartScreen.vue` `<script setup>`, compute entrance delays with
   `stagger(...)` (mirror TypingDots.vue:66) and apply them as `animationDelay`
   to the label → hero → subtitle → source-panel → cube sequence. Retime
   `AnimatedText` from infinite idle to a one-shot entrance. ≤900ms curtain-up,
   PRM-guarded.

4. **The play CTA pill (rainbow ring + View Transition).**
   New element in `EditorStartScreen.vue`, lower-center: a `<button>` using the
   `--rainbow-*` ring (design-idioms.css:459–471) on hover, wired to App.vue's
   `runSceneSwitch('cube')` (App.vue:373) so click both starts the animation and
   rides the existing native View Transition. Red elsewhere, rainbow here only.

5. **Background depth: vignette + grain + major-grid drift.**
   `EditorShell.vue:213–235` `.grid-background`: add the radial focus vignette
   (one `radial-gradient` layer, `--background`-mixed), a fixed `feTurbulence`
   grain layer (~2–3%, `pointer-events:none`, PRM-static), and a ~60s
   `background-position` drift on the major-line layer only (PRM-off). Tokens via
   `--graph-*` / `--background` so dark mode follows for free.

6. **Micro-interactions: source-panel hover-recompile + cube draggability nudge.**
   Hover the source panel → restart the typing/lift loop. First-idle (~3s) cube
   nudge-and-return wobble (one-shot `CSSKeyframesAnimation` in CubeScene/
   CubeTarget) to signal the *"or drag M. cubert"* hint (App.vue:115). Both
   PRM-guarded.

**Sequencing note:** ship 1 first (it stands alone and de-risks the rest), then
2 (the moment), then 3–6 as polish. Every step respects the existing system —
glass-ui surfaces, `--font-*`/`--accent-red`/`--rainbow-*`/`--graph-*` tokens,
the `loadAnimationEngine()` boundary, φ-layout, and the page-wide PRM
discipline — extending the language, never swapping it.
