# Tranche-J Design Audit — Lane: GLASS-UI ABSTRACTION GAPS

> "What glass-ui items, if totally befitting, might we smoothen, refine, hone, and abstract out... Look for gaps."

Read-only audit. Every item is a **glass-ui-HANDOFF** (the work lands in the glass-ui repo, never patched in kf). Evidence is grounded in `docs/tranches/J/audit/design/screenshots/*.png` + demo source `file:line`. glass-ui version consumed: **3.9.0**.

The headline: kf has ALREADY done the hard abstraction work internally — `demo/@/styles/design-idioms.css` is a 660-line catalog of demo-owned primitives, many carrying *explicit* `inv-16 HANDOFF` / `glass-ui-owned` annotations. Several of these are pre-validated, cross-scene-proven candidates that glass-ui should absorb. The inverse is also live: glass-ui 3.9.0 already ships `MetricBadge`, `MetricCell`, `ToggleChip`, `ScrubberTimeline`, `ContinuousRail`, `StatusDot`, `LabeledField` — and kf is **hand-rolling local twins of several of them** because of small contract gaps. Closing those is a refine-in-glass-ui move that deletes kf code.

---

## A. ABSTRACT INTO GLASS-UI — kf primitives that other consumers would genuinely use

### A1 — `CurveEditorCanvas` / control-point-handle primitive (the real gap, P1-worthy)
**kf evidence:** `demo/@/components/custom/EasingCurveCanvas.vue` (full 373-line SVG curve editor) + `demo/motion-path/MotionPathTarget.vue:63-90` (the `.mp-handle` / `.mp-handle--anchor` / `.mp-handle--control` / `.mp-handle--active` draggable nodes). Screenshots: `easing-desktop-open.png` (the purple bezier canvas, top-left glass panel, draggable endpoint + handle circles) and `motion-path-desktop-open.png` (the green solid handles + dashed ghost-reset positions on the path).
**The gap:** glass-ui ships a whole `timeline/` family but has **NO** 2D-coordinate editing surface — no curve canvas, no draggable control-point-on-a-grid primitive. kf authored the entire idiom twice (the easing bezier handles AND the motion-path anchor/control handles share the *exact* grammar: a circle node, a hit-radius, pointer-capture drag, an SVG-space↔model-space coordinate transform, a `--active` state, a hover-grow `r`). The `pointerToSVG` CTM-inverse transform, the `rubberBand` overshoot damping (`EasingCurveCanvas.vue:189-197`), and the touch hit-radius widening (`:207`) are general-purpose.
**Proposed glass-ui shape:** a `GlassControlPoint` handle primitive (SVG `<circle>` with the node/active/hover affordance + the focus-ring + a slot for the glyph) AND a `useSvgPointer` composable (the `getScreenCTM().inverse()` model↔view transform + rubber-band clamp). Optionally a thin `CurveCanvas` shell (bounded square via container query, grid lines, axis labels, diagonal ref). Slides / data-viz / any "drag a point on a graph" consumer would use it.
**kf consume-edge after:** `EasingCurveCanvas` keeps the easing-specific bits (the traveling dot, the `f(t)`/`t` axis labels, the bezier `C` path) but mounts `<GlassControlPoint>` for its two handles; `MotionPathTarget` does the same for its anchors/controls — one handle grammar, one focus affordance, one hit-test. **Note:** this is the *only* item in this lane that is a genuine net-new glass-ui primitive (no existing twin); everything below is a consume-or-refine.

### A2 — `CopyableArtifact` / code-readout chip (3 hand-rolled copies today)
**kf evidence:** THREE byte-similar "label + copyable code value" chips:
- `demo/@/components/custom/EasingEditor.vue:44-59` — the `cubic-bezier(0.25, 0.10, 0.25, …)` readout + `CopyButton` (`easing-desktop-open.png`, under the dropdown).
- `demo/spring/SpringSidebar.vue:70-74` — `springLinearStops() → CSS` label + `CopyButton` (`spring-desktop-open.png`).
- `demo/motion-path/MotionPathTarget.vue:113-117` + `.artifact` style `:346-350` — the `offset-path` label + `CopyButton` over a `<code class="artifact">` muted-tint block (`motion-path-desktop-open.png`, the `OFFSET-PATH: PATH('M 60 200 …` block).
**The gap:** the same gestalt (a small label, a truncating/scrolling mono value, a copy affordance, a muted-tint surface) is authored three ways with three surfaces (`text-mono-caption italic` inline vs `.artifact` `radius-md` + `muted 50%` block vs the bare flex row). No glass-ui primitive owns "show a copyable code literal."
**Proposed glass-ui shape:** a `CopyableArtifact` (props: `label`, `value`, `appearance: "inline" | "block"`) bundling the truncate-with-title + scroll-x + the copy button + the sr-only live-region announce (kf's `CopyButton.vue:13-16` already nails the a11y). Pairs naturally with `MetricBadge`.
**kf consume-edge after:** all three sites collapse to `<CopyableArtifact label="offset-path" :value="…" />`; the `.artifact` scoped rule and the EasingEditor readout `<style>` override are deleted.

### A3 — promote `.progress-rail` / `.progress-ball` into glass-ui (kf already proved the DRY)
**kf evidence:** `demo/@/styles/design-idioms.css:363-409` — the rail-line + scrubber-ball pair, with the comment block documenting it was forked FOUR ways (SpringTarget / EasingTarget / SpringSidebar / sampler) before kf consolidated it into one parameterized idiom (`--rail-tint`, `--ball-glow`, `--ball-size`). Consumed in `SpringTarget.vue:48-55`, `SpringSidebar.vue:60-64`, the sequence/easing rails. Screenshots: the green travelling balls on tinted rails in `spring-desktop-open.png` (live rail + sampler + the 4 preset rows), `sequence-desktop-open.png` (master playhead).
**The gap:** this is the canonical "value-on-a-track" motion primitive and kf has *already done the consolidation work and named the variance axes* — exactly the shape glass-ui likes to absorb (its own `MetricCell`/`ToggleChip` headers cite "promoted FROM a consumer's repeated string"). It belongs beside glass-ui's `ScrubberTimeline`/`ContinuousRail` as the un-segmented, single-ball companion.
**Proposed glass-ui shape:** a `GlassRail` + `GlassRailBall` pair (or CSS `@utility progress-rail/progress-ball`) parameterized by the same three custom properties kf already exposes — verbatim adoption, zero redesign.
**kf consume-edge after:** kf imports the glass-ui utilities and deletes the `design-idioms.css:363-409` block + the per-scene `--ball-size`/`--ball-glow` modifiers stay (they're legitimate per-site deltas).

### A4 — promote the `.status-badge` family into glass-ui's `MetricBadge`/`Badge` (with the AA-contrast recipe)
**kf evidence:** `demo/@/styles/design-idioms.css:411-456` — `.status-badge`/`.settled-badge`/`.tracking-badge`/`.reverse-badge`, parameterized by `--badge-tone`, *carrying a documented AA-contrast color-mix recipe* (the comment records the bare green was 1.97:1 and the mix lifts it ≥4.5:1). Rendered as the `settled`/`tracking` pill in `spring-desktop-open.png` (`SETTLED`, top-right of the stage card), the `READY` pill in `sequence-desktop-open.png`, and `SpringTarget.vue:24-27` / `SequenceTarget.vue:32-33`.
**The gap:** glass-ui ships `Badge` and `StatusDot` but neither carries this *tone-driven AA-contrast pill recipe*. kf's recipe is load-bearing a11y work that other consumers re-derive by hand.
**Proposed glass-ui shape:** extend `Badge` (or `MetricBadge`'s label slot) with a `tone` + `auto-contrast` variant that bakes the `color-mix toward --foreground at 50%` AA lift. The hue-survives-the-mix property is the reusable insight.
**kf consume-edge after:** kf drops the four badge classes and uses `<Badge tone="progress" auto-contrast>settled</Badge>`.

---

## B. ADOPT — glass-ui already ships it; kf is hand-rolling a twin (consume-gaps)

### B1 — `MetricBadge` (xl rung): the stage-card stat readout is hand-rolled in 3 scenes (P1)
**kf evidence:** the identical `text-heading` serif title + `text-mono-caption text-muted-foreground tabular-nums` stat string is hand-rolled in THREE targets:
- `SpringTarget.vue:16-23` — `SpringProgress` + `x = 1.000 · v = 0.00` (`spring-desktop-open.png`).
- `SequenceTarget.vue:13-15` — `Sequence` + `STAGGER × 5 · PROGRESS 0%` (`sequence-desktop-open.png`).
- `MotionPathTarget.vue:12-14` — `MotionPath` + `OFFSET-DISTANCE = 0% · TANGENT -89°` (`motion-path-desktop-open.png`).
**The gap:** glass-ui's `MetricBadge` (`metric-badge.d.ts`) is *exactly* this — `amount` + `unit` + `label`, and its docstring explicitly names an **`xl` "audacious-poster rung" (`text-mono-prose` amount, `text-prose` unit) for hero placements that need to read at chassis distance.** That xl rung is the suffusion the J brief asks for, sitting unused while kf hand-rolls a quieter `text-mono-caption` version. `MetricCell` (icon + label + value + unit) is the same gestalt for the sidebar param rows.
**Proposed glass-ui shape:** none new — kf should CONSUME `MetricBadge size="xl"` for these readouts. If glass-ui wants to help, a `SceneHeader` molecule (serif title + `MetricBadge` row + a status `Badge` slot) would collapse the three repeated header blocks to one consume.
**kf consume-edge after:** the three `*Target.vue` header blocks become `<SceneHeader title="SpringProgress"><MetricBadge :amount="x" … size="xl"/></SceneHeader>` — and the readouts get LOUDER (the xl rung) per the J typography ask, for free.

### B2 — `ToggleChip variant="cell"`: the Spring preset grid is hand-rolled (P2)
**kf evidence:** `demo/spring/SpringSidebar.vue:35-48` — the Smooth/Snappy/Bouncy/Gentle preset grid is `<Button variant="outline">` cells with a name + value column + a `.preset-active` ring class (`:145-148`). Screenshot `spring-desktop-open.png` / `spring-mobile-open.png` (the 2×2 cards, Smooth ringed green).
**The gap:** glass-ui's `ToggleChip` ships `variant="cell"` described verbatim as "square icon + label cards" with proper `aria-pressed` + reka Toggle keyboard semantics — exactly this grid, but kf's `<Button>` version has no `aria-pressed` and re-authors the active ring.
**Proposed glass-ui shape:** none new — CONSUME `ToggleChip variant="cell"`. (Possible glass-ui refine: a two-line `cell` layout slot for the name+value the spring presets show.)
**kf consume-edge after:** the preset loop becomes `<ToggleChip variant="cell" v-model=…>`; `.preset-active` is deleted; the cards become keyboard-toggleable + screen-reader-pressed.

### B3 — `ToggleChip variant="chip"` / a `SegmentedControl`: `Live solver / Discrete transition` is hand-rolled (P2)
**kf evidence:** `demo/app/scenes/SpringScene.vue:7-32` — a hand-rolled `role="tablist"` with `.spring-view-switch` / `.spring-view-tab` / `.spring-view-active` classes and manual `aria-selected`. Screenshot `spring-desktop-open.png` (the pill segmented toggle top-center of the stage) and `spring-mobile-open.png` (where it floats and *overlaps the scene dropdown* — a minor incongruence noted for the hierarchy lane).
**The gap:** glass-ui ships both `ToggleChip variant="chip"` (inline horizontal) and `toggle-group` — but neither is presented as a *segmented control* (the connected-pill, single-active two-up the screenshot shows). kf re-authored the segmented look because the existing primitives don't have that posture out of the box.
**Proposed glass-ui shape:** a `SegmentedControl` wrapper over `ToggleGroup` (the connected-pill track + the sliding active indicator), OR document `ToggleChip variant="chip"` as the segmented-member. This is a small, broadly-useful add.
**kf consume-edge after:** the 26-line hand-rolled tablist + its three scoped classes collapse to a `<SegmentedControl>` with two `<ToggleChip>` members; the a11y (`role`/`aria-selected`) comes from the primitive.

### B4 — `ScrubberTimeline`: the PlaybackRibbon scrubber + AnimationVisualizer re-implement it (P2, refine-paired)
**kf evidence:** `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue:5-21` (`<Slider variant="timeline">` with scrub/commit/touch-gate plumbing) + `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue` (the full 256-line decorative scrubber: pointer-capture drag, velocity estimate, spring-coast inertia, `progressFromPointerX`, `setBallProgress`). Screenshots `easing-desktop-open.png` / `cube-desktop-open.png` (the green slider + the big red AnimationVisualizer ball below it).
**The gap:** glass-ui's `ScrubberTimeline` (`ScrubberTimeline.vue.d.ts`) IS a "single-track normalized 0..1 scrubber" with pointer-capture drag, `role=slider` keyboard a11y (arrow-step + shift-step), a `label` tooltip caret, and `scrubStart`/`scrubEnd`/`update:modelValue` events — the *exact* contract kf hand-rolls in the PlaybackRibbon Slider. **kf imports glass-ui's timeline family in ZERO files** (verified). It's a clean consume-gap.
**Proposed glass-ui shape:** kf CONSUMES `ScrubberTimeline` for the ribbon slider. The PAIRED REFINE (see C5): `ScrubberTimeline` would need an optional decorative-ball/overlay slot + an inertia-coast hook to fully absorb the `AnimationVisualizer` — that big red ball + the `SpringProgress`-driven fling-coast is genuinely befitting and would enrich the glass-ui primitive.
**kf consume-edge after:** PlaybackRibbon's Slider+gate becomes `<ScrubberTimeline>`; `AnimationVisualizer`'s scrub math is deleted in favor of the primitive, keeping only the decorative-ball overlay (which the refine lets it slot in).

---

## C. REFINE IN GLASS-UI — rough edges kf had to work around (from the consume-experience)

### C1 — `cartoon-surface` can still render square (the open inv-16 handoff, P1)
**kf evidence:** `demo/@/styles/design-idioms.css:514-523` documents the user catching "the card is NOT rounded — it should be impossible" on motion-path, traced to `cartoon-surface` carrying ZERO radius. **Verified still true in glass-ui 3.9.0:** `node_modules/@mkbabb/glass-ui/dist/styles/cards.css:33-48` — `@utility cartoon-surface` sets `border-width`, `box-shadow`, `translate`, `transition`, hover-lift, but **no `border-radius`.** kf's stage-card fix (swap the bare `cartoon-surface` div for `<Card>`) is a workaround, not the durable fix.
**Proposed glass-ui shape:** `@utility cartoon-surface` gains `border-radius: var(--radius-card)` by default, OR ship a `rounded-card`-carrying `cartoon-card` primitive (the design-idioms.css note proposes exactly this). A `cartoon-surface`-only element then can't render square from the primitive itself.
**kf consume-edge after:** kf can use `cartoon-surface` directly on any div without a `<Card>` wrapper or an ad-hoc `rounded-*`; the born-RED `proof:card-rounded-primitive` glass-ui half greens.

### C2 — headless typography / "brand-font-off" lever (the Plus-Jakarta force-apply, P1)
**kf evidence:** `demo/@/styles/style.css:100-117` — kf must override `--font-stack-text`/`--font-stack-sans`/`--font-text`/`--font-sans` at `:root` because "glass-ui's brand body font is Plus Jakarta Sans (tokens.css:51) … theme.css bridges via `@theme inline` so a plain `@theme` override of the BRIDGE loses." kf does NOT use Plus Jakarta (its identity is Instrument Serif + Fira Code over native sans, `home-desktop.png` the audacious serif). The override is a four-token force-apply working *around* glass-ui hard-wiring its brand font into the body register.
**Proposed glass-ui shape:** glass-ui should expose a first-class, documented consumer lever — a single `--font-stack-text` opt-out token that doesn't require knowing the `@theme inline` bridge internals, OR a "headless typography" build flag / `<GlassProvider brand-fonts="off">`. The brand font landing by default on every consumer surface (and half-loading a webfont the consumer doesn't serve) is the rough edge.
**kf consume-edge after:** kf sets one documented prop/token instead of reverse-engineering the four-token bridge override; no risk of a glass-ui token rename silently re-applying Plus Jakarta.

### C3 — `LabeledField orientation="horizontal"` + subgrid participation (the booked handoff, P2)
**kf evidence:** `demo/@/styles/design-idioms.css:525-590` — the `.labeled-field-grid` subgrid idiom kf authored so label columns align uniformly across rows, with the comment "THE DURABLE HOME is a glass-ui HANDOFF (inv-16): the W9-BOOKED `LabeledField orientation="horizontal"` extended to subgrid-participation." Also re-forked locally in `SpringSidebar.vue:134-143` as a `:deep(.labeled-field)` grid override. Screenshot: `cube-desktop-open.png` (the duration/delay/iterations rows — label-left, value-right, uniform column).
**The gap:** glass-ui's `LabeledField` has no `orientation="horizontal"` and no subgrid-ready mode, so every kf panel re-applies the `grid-template-columns: auto 1fr` (or the subgrid wrapper) by hand.
**Proposed glass-ui shape:** `LabeledField orientation="horizontal"` that is born subgrid-ready (`grid-template-columns: subgrid; grid-column: 1/-1` when inside a labeled-field-grid container), shipping the container utility too.
**kf consume-edge after:** kf deletes `design-idioms.css:567-590` + `SpringSidebar.vue:134-143` and just sets `orientation="horizontal"` on the fields.

### C4 — `--spring-snappy` token shadow (the motion-vocabulary consume-edge, P2)
**kf evidence:** `demo/@/styles/style.css:159-170` — kf had to RECONCILE its own `--spring-snappy: linear(…)` (a ζ=0.65 shadow) onto glass-ui's canonical spring token because "glass-ui already ships the spring family … the demo previously baked its OWN same-named token — the exact cross-repo token incoherence." The fix landed (kf now aliases the canonical curve), but the episode shows glass-ui's spring-timing tokens weren't discoverable/authoritative enough to prevent the shadow.
**Proposed glass-ui shape:** document the canonical `--spring-*` timing-function token family as the consumer-facing motion vocabulary (with the response/damping each was generated from), so consumers alias rather than re-bake. A small docs/naming refine, not a code change.
**kf consume-edge after:** kf (and the next consumer) reaches for `var(--spring-smooth)` knowingly instead of regenerating a `linear()` shadow.

### C5 — `ScrubberTimeline` lacks a decorative-overlay slot + inertia-coast hook (paired with B4, OPP)
**kf evidence:** `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue:121-190` — the release-coast inertia (velocity estimate via `SmoothProgress`, fling-to-boundary via `SpringProgress` + `RAFPlayback`) and the big decorative red ball + dashed target twin (`AnimationVisualizer.vue:30-36`, `calc(100cqw - 100%)` traveller). Screenshot `cube-desktop-open.png` (the red ball below the slider). This richness is why kf can't just drop in `ScrubberTimeline` today.
**The gap:** glass-ui's `ScrubberTimeline` is a clean slider but has no slot for a decorative oversized handle/overlay and no momentum/coast-on-release affordance. kf's inertia-coast is a genuinely delightful, broadly-useful interaction.
**Proposed glass-ui shape:** add (a) an optional `#handle` / `#overlay` slot to `ScrubberTimeline` so a consumer can render an oversized decorative ball, and (b) an optional `inertia` prop wiring the same `SmoothProgress`-velocity + `SpringProgress`-coast on release. This is the "smoothen/hone an extant component" the J brief invites — it absorbs the best of kf's scrubber.
**kf consume-edge after:** `AnimationVisualizer` shrinks to a slot template + an `inertia` flag on `<ScrubberTimeline>`; the 256-line custom scrubber math moves into the primitive where every consumer benefits.

### C6 — `RibbonBar` tab-content is a kf-side `Teleport` graft onto glass-ui's `HeaderRibbon` (OPP)
**kf evidence:** `demo/@/components/custom/animation-controls/components/RibbonBar.vue:6-9` — a hand-managed `id="controls-ribbon-target"` Teleport target inside a `<Card surface="cartoon">` that the controls Teleport INTO, with per-tab `v-if` branches (`:12-103`) for keyframes/timeline/slot content. glass-ui ships `HeaderRibbon` (consumed in `EditorShell.vue:10`) but the per-tab action-bar pattern (a row of pill `<Button variant="outline" rounded-full>` actions that swaps by active tab) is re-authored in kf with the `RIBBON_BUTTON_CLASS` literal (`:122`) and a `.ribbon-apply--active` scoped border escape (`:135-137`).
**The gap:** the "action ribbon that swaps its button set by the active tab" is a general molecule; kf grafts it with Teleport + `v-if` rather than consuming a glass-ui ribbon that takes tab→actions slots.
**Proposed glass-ui shape:** a `HeaderRibbon`/`ActionRibbon` variant that accepts named per-tab action slots (so the active tab drives the visible button row natively, no Teleport graft), with the pill-button styling as a built-in `ribbon` button variant (retiring the `RIBBON_BUTTON_CLASS` literal + the `border-color: transparent` escape).
**kf consume-edge after:** RibbonBar's Teleport target + `v-if` branches become slot fills; `RIBBON_BUTTON_CLASS` and `.ribbon-apply--active` are deleted.

---

## Verdict
glass-ui 3.9.0 and kf are *close* — most of this lane is "consume what already ships" (B1-B4) plus closing two long-open handoffs (C1 cartoon-radius, C2 brand-font lever) that kf currently works around with measurable debt (a four-token `:root` force-apply; a `<Card>`-wrapper workaround for square cards). The single genuine net-new abstraction is **A1 the curve-editor / control-point-handle primitive** — glass-ui has a rich timeline family but no 2D-point-on-a-graph editing surface, and kf authored that grammar twice (easing + motion-path) with identical bones. The pre-validated, kf-already-consolidated `design-idioms.css` primitives (A3 rail/ball, A4 status-badge, A2 copyable-artifact) are the lowest-risk promotions: kf did the DRY and named the variance axes; glass-ui just absorbs them. Proportion check: nothing here adds chrome — every item DELETES kf code (a `design-idioms.css` block, a hand-rolled tablist, a four-token override) by routing it to a primitive.
