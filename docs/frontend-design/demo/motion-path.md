# MotionPath — frontend-design treatment

> Page: `demo/app/scenes/MotionPathScene.vue` → `demo/motion-path/MotionPathTarget.vue`
> Design system: glass-ui tokens + `demo/@/styles/{style.css, design-idioms.css, brand.css}` + `demo/DESIGN.md`
> Scope: a design PROPOSAL. No source is written outside this doc.

---

## §Aesthetic direction

**The POV: a vector-illustration drafting table that breathes.** This scene is not a "demo of `offset-path`" — it is a *pen-tool surface*, the one place in the whole demo where the user is an **author**, not a spectator. Illustrator and Figma's pen tool, Rive's editor, the Bézier scaffolds of an animation rig — that is the lineage. The page should feel like you walked up to a cyan blueprint pinned to a light-table, and the thing you draw immediately comes alive and starts *walking the line you just drew*.

Everything else in the demo is a finished animation you scrub. This one you **shape**, and the engine answers in real time. So the bold commitment is **technical-blueprint draftsmanship**: precision graph ground, hairline tethers, anchor/control nodes that read like a real vector editor's net — but warmed by ONE living character (the traveller) so it never goes cold-CAD.

**The ONE unforgettable thing:** *the line you bend, the character walks.* You grab a control handle, the figure-loop deforms like a wire under your finger, and the little 🙂↔️ face — which is mid-stroll — **leans into the new curve**, its body tilting to the live tangent as the path reshapes beneath it. The traveller is not a dot riding a rail. It is a *creature that lives on your line and reacts to you re-drawing its world.* Drag it a full lap and it winks 😎. That coupling — **edit-the-geometry → the character physically responds** — is something no other scene, and frankly no other motion demo on the web, lets you *feel*.

This extends the TASTE-approved glass-ui language; it does not swap it. The cyan (`--rainbow-cyan`) the scene already owns becomes a **full blueprint identity**: cyan ground, cyan ink, cyan glow. The Instrument-Serif display voice and Fira Code mono stay. The cartoon-quiet chrome and glass-resting stage card stay. We are turning the volume up *within* the system — bolder accent saturation, a designed graph field, signature path-deform motion — not introducing a foreign theme.

---

## §Current-state audit — what reads generic vs. the SOTA bar

The scene is *correct, accessible, and well-tokenized* — but it reads like a **diagram of a feature**, not an **instrument you want to touch**. The SOTA bar here is a vector editor (Figma pen tool, Rive). Against that bar:

1. **The stage field is a flat tinted square — no draftsman's ground.**
   `MotionPathTarget.vue:291-303` (`.mp-stage`) is a single `color-mix(… 4% …)` cyan wash over `--background` with a card radius. It deliberately *kills* the global crosshatch (the D17 fix), but replaces it with **nothing** — a blank plate. A vector-authoring surface without measurement structure (a graph field, a centerline crosshair, corner ticks) reads as a placeholder, not a drafting table. The demo already owns `.stage-field-x/-y` (`design-idioms.css:579-594`) and `--graph-pitch/--graph-major` (`design-idioms.css:268-272`) — they are **defined and consumed nowhere on this stage.** That is the single biggest "AI-slop empty-box" tell on the page.

2. **The guide path is a static dashed line — it does not read as "the track being traversed."**
   `.mp-guide-path` (`MotionPathTarget.vue:320-325`): `stroke-dasharray: 6 7`, 35%-tint cyan, no motion. The dashes are *frozen*. In a motion-engine demo, the one element that exists purely to say *"a thing travels along me"* is itself dead. The SOTA move (every pen-tool / map-route UI) is a **marching-ants dash flow** so the line reads as a live conveyor.

3. **The handles are generic SVG circles with a 120ms fill fade.**
   `.mp-handle` (`MotionPathTarget.vue:337-364`): a hollow circle, `r: 9/7`, `transition: r 120ms, fill 120ms`. Anchors vs. controls differ only by a fill-tint and a dasharray — a *subtle* delta the audit comments themselves admit is weaker than the GSAP convention ("square-ish anchors, round controls; here a fill/tint delta keeps the SVG simple"). A real vector editor makes **anchors square diamonds and controls round** — instantly legible, zero cognitive cost. Right now you cannot tell at a glance which node is on-path. The hover is a quiet fill swap; SOTA is a *spring-scale pop* with a focus halo.

4. **The traveller is a glyph in a glowing ball — but it does not USE the tangent it computes.**
   The composable computes `tangentDeg` (`useMotionPathGesture.ts:88-96`) and the header *prints it as a number* (`MotionPathTarget.vue:37-44`) — but the **traveller body never rotates to it.** The engine sets `offset-rotate: auto` on the element wrapper, yet the visible glyph (`.mp-traveller-glyph`) sits bolt-upright. The character has a heading and ignores it. That is the exact place the page is *leaving its signature on the table.* SOTA: the face banks into the curve.

5. **The header math is published well, but the title is doing nothing distinctive.**
   `<span class="text-display">MotionPath</span>` (`MotionPathTarget.vue:27`) is good (Instrument Serif), and the `MetricBadge` poster numbers (`:28-44`) are genuinely strong — this is the page's best-resolved region. But "MotionPath" set flush-left as a label misses the *blueprint titleblock* opportunity: a vector drafting sheet has a **titleblock** (drawing name + live spec) in a cartouche, not a flush web heading.

6. **The copy-paste artifact + caption are competent but flat** (`MotionPathTarget.vue:156-170`). Mono `offset-path` declaration over a muted plate. Fine. Not a weakness, but it could read more like a *spec callout on a blueprint* (a leader line / corner-tagged code block).

The bones are excellent — single-source geometry, real a11y (`role="slider"` on every node, keyboard parity), the wink egg, PRM degrades. **Nothing here needs re-architecting.** Every refinement below is a *surface + motion* pass over the existing structure and tokens.

---

## §Refinements

### TYPOGRAPHY — the titleblock voice

The system gives us exactly two faces — Instrument Serif (`--font-display`, `style.css:63`) display + Fira Code (`--font-mono`, `:64`) — and that pairing (a warm condensed serif against a precise technical mono) is *already perfect* for "draftsman's titleblock + spec annotations." Lean all the way in; add **no new face.**

- **Titleblock cartouche.** Wrap the title + badges (`MotionPathTarget.vue:25-45`) in a left-rule "titleblock" treatment: a 2px `--ball-tone` left border, the serif title at the `text-title` rung (φ^(3/2), `--type-title: 2.058rem`), and a Fira Code **eyebrow** above it reading `OFFSET-PATH · EDITABLE` in `--type-mono-caption`, `letter-spacing: 0.14em`, `text-transform: uppercase`, `color: --muted-foreground`. The serif/mono register-clash IS the blueprint look (engineering drawings pair a script title with stamped technical labels).
- **Tabular figures on the live math.** The `MetricBadge` numbers and the `tangentDeg` readout must use `font-variant-numeric: tabular-nums` so the digits don't jitter width as you scrub (a `47°` → `131°` width jump is the cheap-readout tell). Glass-ui's MetricBadge likely already does this; if the tangent readout is hand-rolled mono, add it explicitly.
- **The `offset-path` artifact** keeps Fira Code (`.artifact`, `MotionPathTarget.vue:433-437`) — correct — but bump it to a *drawing-callout* by prefixing a non-selectable mono tag `╴ d` (a leader stub) so it reads as a dimension annotation, not a generic code block.

### COLOR — commit the cyan to a full blueprint identity

The scene already declares `--ball-tone: var(--rainbow-cyan)` at the stage root (`MotionPathTarget.vue:267-269`; `--rainbow-cyan: hsl(180 80% 50%)`, `design-idioms.css:90`). Today that cyan only paints the path, net, and ball. **Promote it to the whole ground.**

- **Blueprint ground.** Replace the flat `.mp-stage` wash (`:297-302`) with a layered cyan field: keep the `color-mix(… --stage-field-tint 4% …)` base, then **add** a two-tier graph using the *existing* `--graph-pitch` (1rem fine) + `--graph-major` (5rem major) tokens, but **tinted from `--ball-tone`** instead of `--border`, at low alpha (~`4%` fine / `8%` major). This is the `.stage-field-*` idiom's intent, recolored to the scene tone — coherent, not a new system.
- **Centerline crosshair.** A single horizontal + vertical `--ball-tone` hairline at 12% through the stage center (the viewBox origin cross at `200,200`) — the registration mark that says "drafting datum."
- **Accent saturation on active state.** The active handle (`.mp-handle--active`, `:361-364`) and dragging traveller (`.mp-traveller--dragging`, `:397-400`) should push toward a *brighter, more saturated* cyan, not just glow up — e.g. `color-mix(in srgb, var(--ball-tone) 100%, white 12%)` so the touched element is unmistakably "hot."
- **Keep `--accent-red` out of this scene.** Note `--color-progress` resolves to `--accent-red` globally (`style.css:370`); this scene correctly shadows it with cyan via `--ball-tone`. Preserve that — the blueprint identity is cyan, the only scene that owns it. Do **not** reintroduce the red.

### MOTION — the signature deform-and-respond

This is where the page earns its place. All compositor-friendly (transform / opacity / `stroke-dashoffset` / `offset-rotate`), all PRM-degrading.

1. **Marching-ants guide flow.** Animate `.mp-guide-path` `stroke-dashoffset: 0 → 13` (= one `6 7` dash cycle) on a slow infinite `linear` loop (~3s). The track now *reads as a conveyor* — the line is alive even before you touch it. Under PRM: hold static (the existing PRM block, `:441-448`, extends to cover it).
2. **The traveller banks into the tangent (THE signature).** The `tangentDeg` value already exists in the composable. Apply it as `rotate(var(--tangent))` on the **glyph** (or an inner banking wrapper) so the 🙂↔️ face *leans into the curve* as it travels and as you reshape the path. Damp it (lerp toward target, or `transition: rotate 120ms`) so it banks smoothly, not snappily — a character leaning into a turn, not a compass needle. The bidirectional-arrow emoji (↔️) is *designed* for this: it literally points along the path it walks.
3. **Live deform reaction.** When a control handle moves (`demo.movePoint` → `pathD` re-emit, `useMotionPathGesture.ts:173-183`), the guide path's `d` snaps. Add a one-shot **rubber-band settle**: a 180ms `cubic-bezier(0.34, 1.56, 0.64, 1)` (the same overshoot curve the wink already uses, `:416`) `scale` micro-pulse on the touched handle so the net feels *elastic*, like wire springing into place.
4. **Orchestrated load reveal.** On scene mount, stagger the entrance: (a) the graph field fades up, (b) the guide path **draws itself** via `stroke-dashoffset` from `totalLen → 0` (a 600ms self-draw — dogfooding the very `DrawSVG` technique the library ships), (c) the control net nodes pop in staggered along the path (60ms each, the `stagger` primitive the library exports), (d) the traveller drops onto the line and begins its first lap. The load *demonstrates the engine* — the page builds itself out of its own primitives.
5. **Keep the wink.** `mp-wink-spin` (`:414-428`) stays — it is already a delightful overshoot. Now it lands in a fuller motion vocabulary instead of being the *only* motion on the page.

### SPATIAL — the drafting table, not a centered box

- The stage is currently a centered square (`.mp-stage`, `aspect-ratio: 1`, `:291-303`) — keep the square (the projection invariant depends on it, `motionPathGeometry.ts:113-139`). But **reframe** it: drop the titleblock to a thin band *over the top-left corner* of the stage (overlapping the graph field by ~8px) so the title plate sits *on the blueprint* like a real drawing's titleblock cartouche, breaking the flush-header symmetry.
- **Corner registration ticks.** Four small `--ball-tone` L-brackets at the stage corners (pure CSS `::before/::after` or 4 tiny SVG marks) — the "crop marks" of a drafting sheet. Cheap, and they sell the blueprint read instantly.
- Keep the existing flex rhythm and `p-4` padding (`MotionPathTarget.vue:71`, the U7 alignment) — the spatial change is *additive framing*, not a layout teardown.

### MICRO-INTERACTIONS

- **Anchors → diamonds, controls → circles.** Render anchors as `<rect transform="rotate(45)">` diamonds (`:106-126` loop branches on `pt.kind`), controls stay circles. Instant on-path/off-path legibility — the real vector-editor convention the audit comment (`:352-354`) wishes it had.
- **Handle hover = spring-pop + halo.** Replace the `transition: r 120ms` fill fade (`:343-346`) with a `scale` spring-pop (`cubic-bezier(0.34,1.56,0.64,1)`, ~160ms) plus a soft `--ball-tone` focus halo ring on `:hover`/`:focus-visible`. The node should feel *grabbable*.
- **Tether emphasis on active segment.** When a handle is active (`activeHandle`, `:115`), brighten *that segment's two tethers* (`:331-335`) from 22% → ~45% so the cubic structure you're editing lights up — the editor "shows its work."
- **Cursor affordance.** `.mp-handle` is `cursor: grab` (`:341`) — good. Add `cursor: crosshair` to the empty stage field so the *whole surface* reads as a drawing canvas, not just the nodes.
- **Traveller idle "breathing."** When paused/idle, a 2% scale breathe on the traveller (very slow, PRM-off) so the character reads as *alive and waiting*, not frozen.

### BACKGROUND — atmosphere + depth

- **The blueprint field IS the background** (the cyan two-tier graph + crosshair + corner ticks above) — that does the atmospheric heavy lifting, on-theme, using owned tokens.
- **Depth via the glass card.** The stage already nests inside a `glass-resting` `<Card :shadow="false">` (`MotionPathTarget.vue:10`) on the page's `--graph-*` substrate (EditorShell). Add a **subtle inner vignette** on `.mp-stage` (an `inset box-shadow` of `--ball-tone` at ~6%, or a radial mask darkening the corners ~4%) so the drafting field has a *recessed table* depth — the glass plate refracts against it (the W6-3 substrate-depth intent, `design-idioms.css:242-272`).
- **Glow bloom under the traveller.** The traveller already carries `--ball-glow: 40%` (`:386`). Add a faint, larger, *slower-following* cyan bloom beneath it (a blurred pseudo-element lagging the offset position) so it leaves a soft comet-glow on the blueprint as it travels — atmosphere that *traces the motion*.

---

## §The one unforgettable moment

**"The line bends and the walker leans."**

The traveller (🙂↔️) is mid-lap, banking smoothly into each curve of the figure-loop. You reach in, grab a control handle, and **pull**. The cubic segment deforms under your finger like a wire — its two tethers light up cyan to show the structure you're bending — and in the same frame the guide path re-draws, the marching ants keep flowing along the *new* shape, and **the little face tilts to follow the new tangent**, leaning into the curve you just carved. You let go; the handle rubber-bands into place with a tiny overshoot, the traveller resumes its sweep along your re-authored line, and the `offset-path` mono declaration at the bottom updates live to exactly the `d` you shaped — copy it and you own it.

No other scene in this demo — and very few tools anywhere — let you *physically deform a motion path and watch a character respond to the geometry change in real time.* This page alone owns **author-the-curve, the-creature-obeys.** It is the thesis of keyframes.js made tactile: *the browser owns the geometry; you own the shape; the engine animates the answer.*

---

## §Implementation plan (priority order)

All changes are scoped to the two scene files + the one composable, consuming existing tokens. No glass-ui patch, no new face, no new dependency.

1. **The blueprint ground** *(highest impact, lowest risk)* — `MotionPathTarget.vue` `<style scoped>` `.mp-stage` (`:291-303`): layer the `--graph-pitch`/`--graph-major` two-tier graph tinted from `--ball-tone`, the centerline crosshair, the inner vignette, the corner registration ticks, and `cursor: crosshair`. Pure CSS over the existing tinted base. Retire the "blank plate" audit finding #1.

2. **The traveller banks into the tangent** *(the signature)* — bind `tangentDeg` (`useMotionPathGesture.ts:57`, already returned) as a `--tangent` custom property on the traveller; apply `rotate(var(--tangent))` to an inner banking wrapper (a new `<span>` inside `.mp-traveller`, `MotionPathTarget.vue:132-147`) with `transition: rotate 120ms`; add the active-segment tether brighten and the live-deform handle rubber-band. PRM: no rotation transition (extend `:441-448`).

3. **Marching-ants guide flow + handle spring-pop** — `.mp-guide-path` (`:320-325`) `stroke-dashoffset` loop; `.mp-handle` (`:337-364`) swap the fill-fade for a `scale` spring-pop + focus halo; anchors → diamonds (the `:106-126` SVG loop branches `pt.kind` to `<rect rotate(45)>` vs `<circle>`). Extend the PRM block.

4. **Titleblock cartouche + tabular figures** — `MotionPathTarget.vue:25-45`: the left-rule titleblock, the Fira Code uppercase eyebrow, `tabular-nums` on the live readouts; overlap the titleblock onto the stage's top-left corner; tag the `offset-path` artifact as a drawing callout.

5. **Orchestrated load reveal** *(polish; dogfood the library)* — on mount, stagger: graph field fade → guide self-draw (`stroke-dashoffset totalLen→0`, dogfooding `DrawSVG`) → control-net stagger-in (the exported `stagger` primitive) → traveller drop + first lap. Glow-bloom comet trail under the traveller. Gate behind PRM (snap to final state).

**Tokens consumed (all existing):** `--rainbow-cyan` / `--ball-tone`, `--graph-pitch` / `--graph-major` / `--stage-field-tint`, `--font-display` / `--font-mono`, `--type-title` / `--type-mono-caption`, `--radius-card`, the wink's `cubic-bezier(0.34,1.56,0.64,1)`. **New tokens proposed:** none required — optionally `--mp-bank-damp` (the tangent-lerp factor) if the banking is JS-smoothed rather than CSS-transitioned. The library primitives dogfooded in the load reveal (`DrawSVG`, `stagger`) are already shipped exports.
