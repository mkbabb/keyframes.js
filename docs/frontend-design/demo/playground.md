# Playground — frontend-design treatment

> Scope: the standalone playground app — `demo/playground/App.vue` + `demo/playground/usePlaygroundAnimations.ts`, rendering through `demo/@/components/custom/editor-shell/EditorShell.vue` and the `demo/@/components/custom/asset-manager/*` suite (`AssetViewport.vue`, `AssetLayerPanel.vue`, `AssetLayer.vue`, `AssetPropertiesPanel.vue`), riding the demo design language (`demo/@/styles/{style.css,design-idioms.css,brand.css}`, `demo/DESIGN.md`) over `@mkbabb/glass-ui` tokens. This is a PROPOSAL — no source is written outside this doc.

---

## §Aesthetic direction

**The bold POV: a MOTION FOUNDRY — a luminous casting floor where inert shapes are poured into living animation.** Every other scene in this demo *demonstrates* a single primitive on a fixed subject. The playground is the only page where **you are the author**: you drop shapes onto a stage and *bind motion to them by hand*. So it must not read like the other scenes' instrument plates — it must read like a **creative sandbox with the lights on**: an inviting, slightly theatrical stage where dropping a shape feels like placing it under a spotlight and binding `bounce` feels like flipping a switch that brings it to life. The register is **luminous-industrial editorial**: the demo's Instrument-Serif display voice and Fira Code telemetry, pushed toward a foundry control room — a darkened casting floor lit from a single warm key-light, shapes that *land* with weight, and a binding act that visibly *ignites* the asset.

The page already DOGFOODS the engine (five presets bound live via `AnimationGroup`, `usePlaygroundAnimations.ts:56`). The design must make that dogfooding the *signature*: this is a CSS-animation engine, so the act of **authoring motion** — not just watching it — is the thing nobody else owns.

**The ONE unforgettable thing:** when you bind a preset to an asset, the asset doesn't just *start* animating — it **ignites**. A pulse of warm key-light blooms from the asset, a fine motion-trail ghosts behind its first cycle, and its layer row in the panel lights an animated "live" filament. Binding is a *ceremony*, not a dropdown change. And the empty stage isn't a blank card with a centered hint — it's a **dark casting floor under a pointer-tracked key-light**, so the very first thing you do (move your mouse over an empty stage) already feels like the lights are following you, inviting the first drop. **The playground is the one page where motion is something you POUR, not something you watch.**

This is the right signature *for this page specifically*: the playground's entire reason to exist is the per-asset bind (`AssetPropertiesPanel.vue:114-132` → `App.vue:98-116` `setTargets`). Making the bind a luminous *ignition* makes the design signature and the core interaction the same artifact — exactly as the square scene's tether visualises its spring. No other scene has a moment of *authorship*; this one does, and the design should celebrate it.

---

## §Current-state audit (generic/weak vs the SOTA bar)

The playground is the demo's most *functional* surface and its least *designed* one. It inherits the full editor chrome but spends none of it on the one thing it uniquely offers — authoring. Concretely, against the SOTA bar and its own siblings:

1. **The empty state is the textbook AI-slop "centered card on a blank canvas."** `AssetViewport.vue:8-32`: a `Card surface="cartoon" tier="quiet"` floating dead-centre with a generic `<Shapes>` Lucide glyph, two lines of prose, and an outline "Add a shape" button. This is the *most generic possible* first impression — it could be any no-code tool's empty state. For a page whose whole pitch is "compose a scene and animate it," the inviting blank stage is doing zero invitation work. Worse, it duplicates the same message twice: the viewport card (`:13-29`) AND the layer-panel placeholder (`AssetLayerPanel.vue:49-54`) both say "Add shapes, text, or images." The SOTA bar (Rive, Framer, Figma's empty boards) makes the *stage itself* the invitation — a lit, textured, alive surface — not a paragraph on a plate.

2. **The bind — the page's whole point — is a silent `<Select>` change with NO feedback.** `AssetPropertiesPanel.vue:114-132` is a bare glass `<Select>` emitting `animationName`; `App.vue:98-116` then quietly calls `setTargets`. The single most important act on this page — *bringing a shape to life* — produces no visual event whatsoever. The asset just… starts moving (or doesn't, depending on group play state). There is no ignition, no confirmation, no celebration. The library's headline capability is triggered through the blandest control on the page. This is the "looks done, says nothing" failure at the worst possible site.

3. **Adding an asset is an instant pop-in — no entrance, no weight.** `AssetViewport.vue:35-46`: assets render via plain `v-for` with `v-show`. A new shape appears at `{x:100,y:100}` (`assetTypes.ts` `defaultTransform`) with zero entrance animation. On a page *built by a CSS-animation engine*, the act of adding an element doesn't use animation at all. Every shape teleports in. The SOTA bar (and the engine sitting right here) makes objects *arrive* — scale-from-nothing, settle with overshoot, land with a soft shadow drop.

4. **The asset chrome is hard-edged dev-tool blue, off the demo's motion-colour authority.** Selection outline is `2px solid var(--primary)` (`AssetViewport.vue:150`), resize handles are `border-primary` (`:78`), the rotation handle is `border-primary` (`:90`), the layer selection rail is `border-primary` (`AssetLayer.vue:9`). `--primary` is glass-ui's generic brand blue — but the demo deliberately collapsed *every motion surface* to the **red-dashed motion authority** (`style.css:350-371`: `--color-progress → --accent-red`; the green was killed system-wide). The playground is the most motion-centric page in the demo, yet its entire manipulation chrome ignores that authority. The selection affordances read like a generic vector editor, not like *this* engine's editor.

5. **Bound assets are visually indistinguishable from inert ones in the layer list.** `AssetLayer.vue` shows a kind-icon, name, eye, and lock — but **nothing indicates whether a layer is animated**. A user who has bound `bounce` to three of five layers has no way to read that from the panel. The one datum the playground exists to manage — *which assets are alive* — is invisible in the very list meant to manage them. (`AssetLayer.vue:21-24` renders only the static kind-icon; `asset.animationName` is never surfaced.)

6. **The text-asset default font is a stale ghost of a deleted face.** `AssetViewport.vue:53` defaults text to `var(--font-display)` (correct — Instrument Serif), but `AssetPropertiesPanel.vue:100` defaults the editable font field to the literal `'Fraunces'` — a face the demo **no longer uses** (`style.css:50-58` records Fraunces as a since-corrected lie; the display authority is Instrument Serif). A user adding text sees a font name that resolves to nothing the system ships. Small, but it's a broken default on the one creative input that invites typing.

7. **No drop-zone affordance — the stage never says "drop here."** `AssetViewport.vue:1-6` is `pointer-events-none` over the stage with `@pointerdown.self="deselectAll"`. There is no drag-over highlight, no drop target, no spatial cue when adding. For a "drag-and-drop playground," the canvas gives no feedback that it *is* a drop target. (Note: the add flow today is dropdown-driven, not literal file/shape drag-onto-canvas — see §The one unforgettable moment for the upgrade that closes this gap.)

8. **The stage is the same graph-paper substrate as every other scene — no playground identity.** `EditorShell.vue:213-235` paints the shared two-tier engineering graph paper for all seven scenes plus the playground. That's correct as a *baseline*, but the playground — the one *authoring* surface — gets zero atmospheric differentiation. It looks identical to the cube's measurement field. The casting-floor identity (warm key-light, depth) has nowhere to live yet.

**What's already RIGHT (preserve):** the glass-ui chrome consumption (`EditorShell`, the `SegmentedTabs` Assets tab `App.vue:69`, the cartoon `Card` panels), the `useDragCapture`/`useDragScrub` gesture seam with `select-none` suppression, the `setPointerCapture`-backed transform drags (`AssetViewport.vue:174-275`), the `role`/`aria-label` toggles on layer controls (`AssetLayer.vue:39,57`), the `markRaw` animation discipline + reactive-bridge `watch` (`App.vue:98-116`), the SVG `<script>` sanitization (`AssetViewport.vue:155-158`), the single-source `defaultTransform`. The plumbing is solid; the page is under-lit and under-celebrated.

---

## §Refinements

Each item is concrete, respects the cascade-ownership rules (tokens in `design-idioms.css`/`style.css`; shared component rules in the asset-manager SFC scoped blocks; the playground-only atmosphere scoped to a wrapper the playground owns), and extends the language rather than swapping it. **Critical constraint:** the asset-manager suite is *shared* `@/components` (the App scenes can mount it too) — so playground-only flourishes must be gated behind a `data-foundry` / class on the playground's own subtree (`App.vue` target slot), NOT baked unconditionally into the shared components. Generic improvements (motion-authority colour, bound-layer indicator) are safe to land in the shared components directly.

### TYPOGRAPHY

- **Give the empty stage a display-voice headline, not a paragraph.** Replace the generic two-line prose card (`AssetViewport.vue:13-29`) with a single oversized Instrument-Serif call to action at the `text-display` rung — *"Pour something in."* — over one `text-mono-caption` sub-line ("Add a shape, then bind it to motion"). One characterful display line beats two sentences of body copy; it matches the home/easing/spring scenes' display-headline register (`EditorStartScreen.vue` lineage) instead of reading like a SaaS empty state.
- **Fix the stale font default.** `AssetPropertiesPanel.vue:100`: change the `'Fraunces'` fallback to `'Instrument Serif'` (or read `var(--font-display)`'s family name) so the editable font field reflects the face the system actually ships. The render path already uses `var(--font-display)` (`AssetViewport.vue:53`) — align the *control's* default to it. One-line correctness fix.
- **Surface the bound preset name in the layer row in mono.** When `asset.animationName` is set, render it as a `text-mono-caption normal-case` chip beside the name in `AssetLayer.vue` (see COLOR + MICRO below for the live filament). The mono caption rung is the demo's telemetry voice; the preset name *is* telemetry ("what motion is this layer running").

### COLOR

- **Move the entire manipulation chrome onto the red motion authority — the named system-coherence fix.** The selection/handle/rail chrome should ride `--color-progress` (= `--accent-red`, `style.css:370`), the demo's single motion colour, not glass-ui's generic `--primary` blue:
  - `AssetViewport.vue:150` selection `outline: 2px solid var(--primary)` → `var(--color-progress)`.
  - `AssetViewport.vue:78` resize handles `border-primary` → a `--color-progress` border.
  - `AssetViewport.vue:90,93` rotation handle + stem `border-primary`/`bg-primary/50` → `--color-progress` family.
  - `AssetLayer.vue:9` selected-row `border-primary` → `border-[var(--color-progress)]` (or a `.layer-row--selected` idiom).
  This is the spatial-colour analog of the W2/W4 system collapses: the playground's chrome finally agrees with the motion identity every other surface already wears. **Result:** selecting an asset feels like arming it for motion, not editing a vector path. (Safe to land in the shared components — `--color-progress` is the system authority; nothing app-side depends on the blue.)
- **A "live" tone for bound layers.** Give bound layer rows + the bound asset a faint `--color-progress` presence: the layer's kind-icon tints toward `--color-progress` when `animationName` is set, and the preset-name chip uses the `.status-badge` AA-contrast lineage (`design-idioms.css:620-641`) — reuse `settled-badge`'s tone seam, no new contrast math. Inert layers stay `--muted-foreground`. Now the panel *reads* which shapes are alive at a glance — closing audit gap #5.
- **The playground stage gets a warm key-light wash (playground-only).** On the playground's stage wrapper (gated, not shared), add a single warm radial wash — a low-alpha `radial-gradient` keyed to the pointer (see BACKGROUND) over the existing graph paper. This is the *one* place the playground earns a colour identity distinct from the measurement scenes: a warm foundry key-light vs. the cool engineering grid. Built from existing tokens (`--color-gold` ramp `design-idioms.css:104-112` as the warm key, mixed low over `--background`), so it's a configuration of the demo palette, not a new theme.

### MOTION

- **Assets ARRIVE — dogfood the engine on add.** When an asset is added (`AssetViewport.vue` render of a new id), it should scale-and-settle in, not pop. The cleanest, framework-coherent path is a **View Transition** on the add (modern-web `group-element-transitions`): wrap the `addAsset` call in `document.startViewTransition()` (feature-detected, plain fallback when absent — Baseline Newly available 2025-10), give each asset a `view-transition-name`, and define a `::view-transition-new(.asset):only-child` scale-in keyframe with a spring-ish ease. PRM-guarded via the guide's `::view-transition-group(*) { animation: none }` bracket. The same mechanism gives **reorder FLIP for free** (layer drag-reorder, `AssetLayerPanel.vue:141-163`) and **exit animation on delete**. This is the highest-leverage motion win: the engine's own page finally animates its own object lifecycle.
- **The BIND IGNITION (signature — see §The one unforgettable moment).** On `animationName` transitioning from unset→set (`App.vue` watch, or an emitted bind event), fire a one-shot **ignition**: a key-light bloom pulse from the asset's centre + a brief motion-trail ghost of its first cycle + the layer filament lighting. Net-new motion that visualises the *exact* act the page exists for. PRM collapses it to an instant state flip (badge lights, no bloom).
- **Selection handles breathe on grab.** On `pointerdown` of an asset (`AssetViewport.vue:199`), a one-shot ring pulse from the selection outline confirms capture (PRM-guarded single keyframe) — the same tactile "captured" beat the square treatment prescribes, here in the red motion colour.
- **The empty-stage headline drifts under the key-light.** The "Pour something in" display line gets a slow, subtle parallax/float tied to the pointer key-light position (a few px of translate), so the empty stage is alive before the first drop — the lights-following-you invitation, not a static centered card.

### SPATIAL

- **Darken and frame the casting floor (playground-only).** The shared graph substrate stays, but the playground stage wrapper adds a subtle vignette + a faint inner border so the stage reads as a *contained floor*, not an infinite plane — a place where things land. This is the asymmetric, intentional framing the empty centered card lacks. Generous negative space at the centre (where shapes land) with the key-light drawing the eye; structure (graph + vignette) at the edges.
- **Anchor the empty-state CTA off-centre under the key-light, not dead-centre.** Instead of `flex items-center justify-center` (`AssetViewport.vue:10-11`), place the headline in the upper-third where the key-light pools, leaving the lower casting floor open — the editorial off-centre composition that signals "this space is for *your* content," not "here is a message."
- **The layer panel gets a live/inert visual split.** In `AssetLayerPanel.vue:36-47`, bound (live) layers read with the motion-authority filament; inert layers stay quiet — a deliberate two-register list (alive vs. raw material) that mirrors the foundry metaphor (molten vs. cold).

### MICRO-INTERACTIONS

- **Pointer-tracked key-light on the empty stage.** The casting-floor key-light follows the pointer across the empty stage (registered-custom-property mask/gradient, modern-web `interactive-content-reveal`: `@property --mouse-x/--mouse-y` + a transitioned radial wash, smooth even on infrequent pointer events). `pointer-events: none` on the light layer so it never intercepts the first drop. PRM disables the transition smoothing. This is the "lights follow you" invitation — the single best reason to move your mouse onto an empty stage.
- **Hover-arm on assets.** On `:hover` an unselected asset lifts a hair (`--scale-hover` idiom, `design-idioms.css:118`) and its eventual selection outline ghosts in at low alpha — the shape "warms up" under the pointer before you grab it.
- **Add-button anticipation.** The empty-state "Add a shape" button (`AssetViewport.vue:22-29`) and the panel `+ add` dropdown (`AssetLayerPanel.vue:7-30`) get a subtle key-light-coloured hover glow — the entry points to authoring glow warmly, consistent with the foundry key-light.
- **Bind dropdown preview-on-hover.** In the animation `<Select>` (`AssetPropertiesPanel.vue:114-132`), hovering a preset name briefly *previews* that motion on the selected asset (a single ghosted cycle), so choosing motion is a *try-before-commit* act — the playground's whole value (rapid motion authoring) made tactile. Commit on select fires the full ignition.
- **Live filament in the layer row.** A bound layer's row shows a tiny animated "live" indicator — a `.progress-dot`-family conic filament (`design-idioms.css:482-494`) or a slow pulsing red dot — so the panel visibly *runs* alongside its assets. Reuses the existing playing-ring idiom; PRM holds it static-lit.

### BACKGROUND

- **The casting-floor key-light (playground-only atmosphere).** Over the shared graph paper (`EditorShell.vue:213-235`, untouched), the playground wrapper layers a pointer-tracked warm radial key-light + a soft vignette. Built from `--color-gold`/`--color-gold-light` (`design-idioms.css:104-111`) mixed *very* low over `--background` (e.g. `color-mix(in oklab, var(--color-gold) 6%, transparent)`) so it reads as warm lighting, not a colour wash — coherent with glass-ui's material/depth vocabulary, not a theme swap. Dark mode deepens the floor and warms the key (the gold ramp already lifts in `.dark`, `design-idioms.css:288-291`).
- **Depth via layered transparency, not noise.** The stage gets dimensionality from three stacked layers — graph paper (deepest), warm key-light wash (mid), vignette frame (front) — each low-alpha. The glass cartoon panels finally have a *lit* floor to cast their offset-stamp shadows against (the W6-3 substrate-depth thesis, applied as *lighting* on the one authoring stage). No grain/noise asset needed; the graph paper carries the texture, the key-light carries the depth.
- **The key-light pools where the action is.** Empty stage → key-light follows the pointer (invitation). Once assets exist → the key-light can settle toward the most-recently-bound (live) asset, gently spotlighting whatever you just brought to life. The atmosphere *responds to authorship*.

---

## §The one unforgettable moment

**THE BIND IGNITION — pouring an asset into motion.**

You've dropped a rectangle on the dark casting floor. It sits there, cold, raw material under the warm key-light. You select it; the selection outline arms in the red motion-authority colour. You open the `animation` dropdown — and as you *hover* `bounce`, the rectangle gives a single ghosted preview cycle, a try-before-commit tease. You click it.

**The asset ignites.** A pulse of warm key-light blooms outward from its centre. A fine motion-trail ghosts behind its very first animation cycle, so the *first* bounce leaves a comet-tail you can see. Its layer row in the panel lights a live red filament — a small conic ring that now visibly *runs*, telling you "this layer is alive." The key-light, until now following your pointer, settles toward the asset you just brought to life, spotlighting your creation. The cold rectangle is now a living, bouncing thing — and you *made* it move.

It is unforgettable because it makes **authorship into a visible event**. Every other scene shows you motion the library produced; this is the one page where *you* pour motion into an object you placed, and the design treats that act as the ceremony it is — ignition, trail, filament, spotlight. The design signature (the foundry key-light + the ignition bloom) and the library's headline capability (per-asset preset binding, `AssetPropertiesPanel.vue:114-132` → `App.vue:setTargets`) are **one artifact**. No other page in the demo lets you *author* motion; this one does, and the whole design exists to celebrate that the dropdown change is, in fact, a small act of creation.

*(Every motion guard stays: PRM collapses the ignition bloom, motion-trail, preview-on-hover, and key-light smoothing to instant state flips — the badge lights, the filament shows static-lit, no bloom; the View-Transition lifecycle animations honour the guide's `::view-transition-group(*) { animation: none }` PRM bracket; the key-light layer is `pointer-events: none` so it never gates the first drop or any underlying control; the animation engine remains the single paint authority — the ignition reads existing `AnimationGroup` state, it does not add a second writer.)*

---

## §Implementation plan (priority order)

**P0 — Make the bind speak + put the chrome on the motion authority. Highest impact, lowest risk; #2/#4 are the core failures.**
1. **Bind ignition feedback** — the page's whole point made visible. Emit a bind event on `animationName` unset→set (from `AssetPropertiesPanel.vue:114-132`'s `<Select>` / `App.vue` watch), and in the playground target subtree fire a one-shot key-light bloom + first-cycle trail. Land the *state* half (the live indicator) in the shared `AssetLayer.vue`; gate the *bloom* half behind the playground wrapper. PRM-guarded.
2. **Motion-authority chrome** (shared, safe): `AssetViewport.vue:150` (selection outline), `:78` (resize handles), `:90,93` (rotation handle/stem), `AssetLayer.vue:9` (selected-row rail) — `var(--primary)` → `var(--color-progress)` family. The named system-coherence fix.
3. **Bound-layer indicator** (shared): `AssetLayer.vue` — render `asset.animationName` as a `.status-badge`-lineage chip + tint the kind-icon toward `--color-progress` when bound; add the live conic filament (`design-idioms.css:482-494`). Closes audit gap #5.

**P1 — Light the stage (the playground's identity) + fix the empty state.**
4. **Casting-floor key-light + vignette** (playground-only, gated wrapper in `App.vue` target slot): pointer-tracked warm radial wash (`@property --mouse-x/--mouse-y` + transitioned `radial-gradient`, modern-web `interactive-content-reveal`) built from `--color-gold` low over `--background`, + a soft vignette/inner-border frame, over the untouched shared graph paper. PRM disables smoothing; `pointer-events: none`.
5. **Empty-state redesign** (`AssetViewport.vue:8-32`): replace the generic centered card with the off-centre Instrument-Serif "Pour something in" display headline + one mono sub-line + the key-light-glowing add button. De-duplicate against `AssetLayerPanel.vue:49-54`.
6. **Stale font default fix** (`AssetPropertiesPanel.vue:100`): `'Fraunces'` → `'Instrument Serif'`. One line.

**P2 — Dogfood the engine on the object lifecycle.**
7. **View-Transition asset lifecycle**: wrap `addAsset` / delete / layer-reorder DOM updates in feature-detected `document.startViewTransition()`; `view-transition-name` per asset; `::view-transition-new(.asset):only-child` scale-in, `::view-transition-old` exit, FLIP reorder for free (modern-web `group-element-transitions`). PRM bracket. Plain fallback when unsupported.
8. **Grab-pulse + hover-arm** (`AssetViewport.vue:199` pointerdown ring pulse; `:hover` `--scale-hover` lift) — tactile capture/warm-up beats, PRM-guarded.

**P3 — Authoring delight + atmosphere response.**
9. **Bind dropdown preview-on-hover** (`AssetPropertiesPanel.vue:114-132`): ghosted single-cycle preview while hovering a preset; full ignition on commit.
10. **Key-light pools to the live asset**: after a bind, settle the key-light toward the most-recently-bound asset (spotlight your creation); on empty stage it follows the pointer.
11. **Empty-headline pointer-float**: subtle key-light-tracked parallax on the "Pour something in" line.

**Touch list:**
- `demo/playground/App.vue` — the gated playground wrapper (`data-foundry`) around the target slot: key-light/vignette atmosphere + bind-ignition orchestration (the playground-only flourishes live here, NOT in the shared suite); wire the bind event from the existing `setTargets` watch (`:98-116`).
- `demo/@/components/custom/asset-manager/AssetViewport.vue` — motion-authority chrome (`:78,90,93,150`), empty-state redesign (`:8-32`), View-Transition `view-transition-name` per asset + scale-in, grab-pulse/hover-arm.
- `demo/@/components/custom/asset-manager/AssetLayer.vue` — bound-layer indicator (preset chip + live filament + icon tint), selected-row rail to `--color-progress` (`:9`).
- `demo/@/components/custom/asset-manager/AssetPropertiesPanel.vue` — font default fix (`:100`), bind preview-on-hover (`:114-132`).
- `demo/@/components/custom/asset-manager/AssetLayerPanel.vue` — de-duplicate empty-state copy (`:49-54`), live/inert list split, View-Transition reorder wrap (`:141-163`).
- `demo/@/styles/design-idioms.css` — IF a reusable `.layer-live-filament` / `.foundry-keylight` idiom is extracted (one token home for the playground key-light magnitude), it lands here, behind a playground-scoped selector; otherwise no token churn.

**Guards to honour throughout:** the asset-manager suite is SHARED — playground-only atmosphere (key-light, vignette, ignition bloom) must be gated behind the playground's own wrapper/class, never baked unconditionally into the shared components; generic wins (motion-authority colour, bound-layer indicator, font fix) land in the shared components directly. PRM collapses every flourish (ignition, trail, preview, key-light smoothing, View-Transition lifecycle via the `::view-transition-group(*) { animation: none }` bracket) to instant state. The animation engine is the single paint authority — the ignition/filament READ existing `AnimationGroup` state, never add a second writer. View Transitions are feature-detected with a plain fallback (Baseline Newly available 2025-10). Tokens live in `design-idioms.css`/`style.css`; shared rules in the asset-manager SFC scoped blocks; playground atmosphere scoped to the `App.vue` wrapper. `--color-progress` (red) is the motion authority for chrome + ignition; `--color-gold` is the warm key-light; the existing graph paper is untouched as the deepest substrate layer.
