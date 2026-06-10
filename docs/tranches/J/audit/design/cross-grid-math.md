# Tranche-J Design Audit — Lane: GRID + MATH

The mathematical brand made visible, the grid made disciplined. Read-only audit; evidence grounded in `docs/tranches/J/audit/design/screenshots/*` + demo source.

---

## Verdict (summary)

The rail·stage·rail grid is *structurally* sound — one `--rail-width: 400px` token, one named `[rail] var(--rail-track) [stage] 1fr` grid, one `.stage-cell` dock-safe primitive. But it is **broken by a second, competing centering axis**: the bottom dock and the top scene-selector are `fixed left-0 right-0 justify-center` (viewport-centered), while the rail cards and stage card live on the grid axis. On every desktop scene the dock floats at viewport-center (~720px) with no relationship to the rail (~73-400px) or the stage card's left edge (~448px) — three different vertical reference lines, none aligned. The spacing system is *nominally* a φ ladder for type, but **space itself is ad-hoc** (`gap-6`/`gap-8`/`px-6`/`lg:px-8`/`max-w-3xl` chosen per-scene, not a shared modular scale). The single largest **MATH** opportunity: this is an easing/spring/bezier engine whose *signature mathematical object* — the EasingCurveCanvas (grid paper + `f(t)`/`t` axes + diagonal reference + draggable bezier) — is exiled to a ~280-360px sidebar card, while the ~960px protagonist stage shows only a green ball sliding on a flat gray line. The math is hidden behind generic chrome exactly where the brand should shout. The grid-paper background exists (1rem corner-tick at 0.10α) but is so faint and uniform it reads as the transparent checkerboard, never as intentional graph paper. Stage framing follows no deliberate ratio (`max-w-3xl` content centered in a 1fr cell → asymmetric slack). Top opportunities: promote the curve specimen onto the stage; ghost axes/grid into the stage plates; set readouts in proper function notation at display scale; reconcile the dock to the grid; extend the φ ladder to a spacing scale.

---

## A. GRID DISCIPLINE — the alignment system

### A1 [P1] Two competing centering axes: dock/selector on viewport-center, rails/stage on the grid
- **Evidence:** `easing-desktop.png`, `cube-desktop-open.png`, `spring-desktop.png`, `square-desktop.png`, `amiga-desktop.png` — on EVERY scene the bottom dock pill and the top "Easing/Cube/Spring…" scene-selector sit at horizontal viewport-center (~720px on 1440w). The two control cards on the left sit at the [rail] track (left edge ~73px). The stage card's left edge is ~448px. None of these three vertical lines coincide.
- **Source:** `AnimationMenuBar.vue:5` `'fixed left-0 right-0 z-dock'` + `:4` `justify-center` → the dock is centered on the VIEWPORT, not on the [stage] track or the rail. The grid (`AnimationControlsGroup.vue:460`) is `[rail] var(--rail-track) [stage] 1fr` — a structural axis the dock ignores.
- **Why it's a defect:** the dock is the primary action surface; it should anchor to one of the grid's authoritative lines (the [stage] track center, or the [rail]→[stage] boundary). Floating it at raw viewport-center means when the rail is open the dock visually "belongs" to nothing — it bisects the stage off-center relative to the stage card it controls.
- **Owner:** kf-demo.

### A2 [P1] The stage protagonist plate's content is `max-w-3xl`-centered inside a 1fr cell → asymmetric, undisciplined slack
- **Evidence:** `easing-desktop.png` / `spring-desktop.png` — the stage `<Card>` fills the [stage] track (~448→1390px) but its inner content column (`max-w-3xl` = 768px) is `items-center`-centered, so the "SpringProgress / ease" heading, the rail, and the readout all sit in a 768px column floated in a ~940px card. The left gutter (~86px) and right gutter (~86px) are equal but *accidental* — they're whatever `1fr − 768px` resolves to, not a chosen ratio.
- **Source:** `EasingTarget.vue:19,64,82` + `SpringTarget.vue:12,15,31,65` — `w-full max-w-3xl` on every inner block, `items-center justify-center` on the card root.
- **Why it's a defect:** the protagonist plate is the hero; its internal composition should follow a deliberate measure (a golden-section column, or full-bleed for the animated subject + measured column for prose), not "3xl, centered, whatever's left." The green ball on the rail (the actual *subject*) is full-width, but the heading/readout are 3xl-capped — so the subject and its label live in two different width systems inside one card.
- **Owner:** kf-demo.

### A3 [P2] The empty rail card persists when a scene has no sidebar controls, leaving an orphaned panel + a non-collapsed rail
- **Evidence:** `motion-path-desktop.png` + `sequence-desktop.png` — top-left shows an EMPTY rounded rail-width card (just a blank pill outline) while the stage card is shoved right. The rail track did not collapse to 0 even though there's no control content to show.
- **Source:** `AnimationControlsGroup.vue:464` `.controls-layout--closed { --rail-track: 0px }` — the collapse depends on the `--closed` class; motion-path/sequence render the wrapper but with empty/near-empty content, so the rail holds open at 400px showing a vacant card.
- **Why it's a defect:** a blank 400px card is the worst grid citizen — it claims a full track and aligns to nothing the eye can use. Either the rail should collapse (stage reflows to fill) or the card should carry content.
- **Owner:** kf-demo.

### A4 [P2] The scene-selector and the dock are the same component family but live on different rows with no shared vertical rhythm
- **Evidence:** `cube-desktop-open.png` — the top "Cube ▾" selector pill (top ~52-92px) and the bottom dock pill (bottom ~785-825px) are both glass pills, both viewport-centered, but their vertical insets from the work-area edges differ (top selector ~52px from top; dock ~`--work-area-bottom-offset` from bottom). They read as a matched pair that isn't quite symmetric.
- **Source:** scene-selector rendered in scene header area; dock `AnimationMenuBar.vue:7` `bottom: var(--work-area-bottom-offset)`. Top inset is not derived from the same offset token.
- **Owner:** kf-demo.

---

## B. SPACING RHYTHM — is there a modular scale?

### B1 [P2] Type rides a φ ladder; SPACE does not — gaps/padding are per-scene ad-hoc
- **Evidence (source):** `EasingTarget.vue:16` `gap-6 … px-6 lg:px-8`; `SpringTarget.vue:12` `gap-8 … px-6 lg:px-8`; `EasingTarget.vue:84` `gap-3`; sidebar `EasingSidebar.vue:22` `px-4 py-3`. Same family of panels uses gap-3 / gap-6 / gap-8 / px-4 / px-6 / px-8 with no derivation rule.
- **Contrast:** `style.css:39-53` + `design-idioms.css` establish a disciplined φ TYPE ladder (`text-display-mega` φ^(9/2), `text-display-4`, `text-title`, `text-heading`…). The spacing has no equivalent named scale — Tailwind's linear 4px scale (gap-3=12px, gap-6=24px, gap-8=32px) is used directly.
- **Proposal:** define a `--space-*` ladder (even a φ or √2 progression: 8 / 12 / 20 / 32 / 52) as tokens in `design-idioms.css`, mirroring how the type ladder is single-sourced, and route the stage/sidebar gaps through it. The brand IS math; the spacing should be mathematically derived too. **OPP** below covers this as suffusion.
- **Owner:** kf-demo.

### B2 [P2] Rail-card vertical gap to the playback card differs from the sidebar-card internal rhythm
- **Evidence:** `easing-desktop.png` / `cube-desktop-open.png` — the gap between the upper sidebar card (controls) and the lower playback card (slider+reverse) is ~30-40px, but the internal row gaps inside each card are ~16-24px. The inter-card gutter isn't a multiple of the intra-card rhythm, so the two stacked rail cards don't read as one rhythmic column.
- **Owner:** kf-demo.

---

## C. MATH AS MOTIF — where the math shows vs. hides

### C1 [P1 / OPP] The signature bezier specimen is exiled to a 280-360px sidebar; the 960px stage shows a ball on a plain line
- **Evidence:** `easing-desktop.png` — the EasingCurveCanvas (the beautiful curve with grid lines, `f(t)`/`t`/`0`/`1` axis labels, the diagonal `y=x` reference, draggable purple bezier) is the ~230px card top-left. The STAGE (the ~940px protagonist plate) shows ONLY: a small "ease  f(0.40)=0.686" caption + a green ball on a flat gray horizontal line. The single most expressive mathematical object in the whole app is the smallest element on screen; the largest surface shows the least math.
- **Source:** `EasingCurveCanvas.vue:6-90` (the full specimen) is mounted in `EasingSidebar.vue` clamped to `block-size: clamp(260px, 64cqi, 360px)` (`EasingSidebar.vue:179`). The stage `EasingTarget.vue:60-75` is `viewMode==='singular'` → one `.progress-rail` + `.progress-ball`, no curve.
- **Proposal:** promote (or ghost) the curve specimen onto the stage plate — the ball traverses ALONG the rendered curve, not a flat line; the curve is large, the grid paper visible, `f(t)` rendered in Instrument Serif at heading scale. The math becomes the hero. (This is the inv-ζ dogfood at full volume: the timing function IS the picture.)
- **Owner:** kf-demo.

### C2 [OPP] Stage plates have NO ghosted axes/grid — the protagonist plate is a blank white card
- **Evidence:** `spring-desktop.png` / `easing-desktop.png` / `sequence-desktop.png` — the stage `<Card surface="glass">` is a flat near-white plate. The animation subject floats with no spatial reference. The sequence stage (`sequence-desktop.png`) has a single faint green vertical playhead line but no time grid behind the staggered dots.
- **Proposal:** ghost a faint coordinate frame into each stage plate (a 0→1 t-axis baseline + value gridlines at 0.25/0.5/0.75, matching the curve canvas's own `[0.25,0.5,0.75]` gridlines at `EasingCurveCanvas.vue:21-37`). Reuse the EXACT grid-line treatment so the sidebar specimen and the stage share one visual language. Spring stage: ghost the displacement-over-time axes the spring solver actually computes.
- **Owner:** kf-demo (consume the existing grid-line CSS; possibly **glass-ui-handoff** if abstracted — see Glass-UI items).

### C3 [P2] Timing/value readouts are set in plain mono caption, not function notation at display scale
- **Evidence:** `easing-desktop.png` `f(0.40) = 0.686` is tiny mono caption beside a heading; `spring-desktop.png` `X = 1.000 · V = 0.00` mono caption; `motion-path-desktop.png` `OFFSET-DISTANCE = 0% · TANGENT -89°` mono caption; `sequence-desktop.png` `STAGGER × 5 · PROGRESS 0%`.
- **Source:** `EasingTarget.vue:24-26` `text-mono-caption text-muted-foreground`.
- **Proposal:** these ARE the live math of the engine — they deserve typographic prominence. Set the function-form readout (`f(t) = …`, `x(t)`, `v(t)`) in a larger mono or in Instrument Serif italic as a *specimen label*, with the variable names as proper math italic. The notation as typographic ornament (the brand asked-for "function notation as typographic ornament") — proportionate, not kitsch: ONE large readout per stage, not many.
- **Owner:** kf-demo.

### C4 [OPP] The spring CSS output (`springLinearStops() → CSS`) is the math made visible — but boxed in a tiny yellow code well, not celebrated
- **Evidence:** `spring-desktop.png` — the sidebar shows `springLinearStops() → CSS` with `--spring-easing: linear(0, 0.28457 4.000%, …)` in a small highlighted code box. This is *exactly* the math-is-the-brand moment (generated easing stops from spring physics), but it's a cramped 6-line scroll well at the bottom of the rail.
- **Proposal:** this is on-brand and should be amplified — but in the stage register, not the sidebar. A "the physics → the CSS" specimen on the stage (the curve + its generated `linear()` stops) would make the engine's core trick legible at a glance. Keep it proportionate: one specimen, generously set.
- **Owner:** kf-demo.

### C5 [OPP] The grid-paper background is too faint and uniform to read as intentional graph paper
- **Evidence:** `home-desktop.png` and every scene — the 1rem corner-tick pattern at 0.10α (`EditorShell.vue:181-183`) is nearly invisible against the transparent-checkerboard capture; it reads as noise, not as the "GRID" brand pillar.
- **Source:** `EditorShell.vue:180-183` single 1rem tile, `fill-opacity='0.10'`, uniform `repeat`.
- **Proposal:** make the grid a *deliberate* motif: a two-tier graph paper (fine 1rem lines + bolder 5rem major lines, like engineering graph paper), or densify/brighten it behind the stage plate region only (a radial/linear mask that strengthens the grid where the subject moves). The grid should feel chosen, not defaulted. Proportionate: keep it calm in the field, let it concentrate near the stage.
- **Owner:** kf-demo.

### C6 [OPP] The matrix editors / transform inputs are plain number fields — no matrix notation
- **Evidence:** `cube-desktop-open.png` / `square-desktop.png` — duration/delay/iterations/direction are plain `<input>` rows. The cube's `Rotations` and `Transform` (the 4×4 matrix3d editor, per CLAUDE.md `matrix-editor/`) is the most overtly mathematical control in the app, yet (per the open screenshots) the controls panel shows generic labeled inputs, not a matrix grid with bracket notation.
- **Proposal:** the matrix editor cells are a 4×4 grid — frame them with the mathematical bracket `[ ]` notation (large square brackets as the panel's left/right ornament), tabular-nums alignment, and a ghosted identity-matrix watermark. The transform readout could echo `matrix3d(…)` as a typographic caption. (Per source: `matrix-editor/MatrixEditor.vue` exists; verify the live render — the brackets are a small, befitting amplification.)
- **Owner:** kf-demo.

### C7 [OPP] The motion-path scene already exposes the path math (`M 60 200 C …`) — extend the same honesty to the other scenes
- **Evidence:** `motion-path-desktop.png` — the stage shows the dashed bezier path WITH its control-point handles AND the literal `offset-path: path('M 60 200 C 60 80, 200 80, …')` below. This is the BEST math-made-visible moment in the app: geometry + handles + the generating string, all on the stage.
- **Proposal:** this is the *reference pattern* the other scenes should match. Easing should show its curve + `cubic-bezier(…)`; spring should show its curve + `linear(…)` stops; on the stage, at scale. Motion-path proves the demo CAN do this beautifully — propagate it.
- **Owner:** kf-demo.

---

## D. THE BENCH — does each stage frame follow a deliberate ratio?

### D1 [P2] Stage cards have no governing aspect ratio; the subject parks by optical-bias offset, not by a framed composition
- **Evidence:** `amiga-desktop.png` (the 3D sphere in a wide perspective room), `easing-desktop.png` (ball mid-card), `square-desktop.png` (the teal box parked right-of-center). Each stage card is `h-full w-full` (`EasingTarget.vue:16`, `SpringTarget.vue:12`) — it fills the [stage] cell, which is whatever `1fr` resolves to minus the dock-band-reserve. There's no chosen frame ratio (16:9, golden, 1:1); the subject's vertical position comes from `--work-area-vertical-bias-top: 0.42 / bottom: 0.58` (`style.css:131-135`), an optical-center bias applied globally.
- **Source:** `AnimationControlsGroup.vue:476` `.stage-cell { grid-column: stage; grid-row: stage }`; cards are `h-full w-full`. The 0.42:0.58 bias is the ONLY compositional cue and it's a vertical-only offset.
- **Proposal:** give the stage a *deliberate* framing ratio per subject class — the bezier/spring curve stages want a near-square or golden frame (a curve reads in a square); the 3D/cube stages want a wider cinematic frame. A `--stage-aspect` token per scene (or a golden-section content box inside the card) would make each bench a composed picture, not a stretched fill. The 0.42:0.58 bias is good optical instinct — extend that intentionality to the horizontal/aspect axis.
- **Owner:** kf-demo.

### D2 [P2] The square scene's subject parks far right with vast empty left — no compositional intent
- **Evidence:** `square-desktop.png` — the teal "drag me" box sits at ~825-1015px (right third), with the entire left ~2/3 of the stage empty. With the rail open, the box is off in a corner; the composition is accidental (it's wherever the drag last left it / its default transform).
- **Owner:** kf-demo.

---

## GLASS-UI items (idioms to adopt / refine / abstract)

### G1 [ABSTRACT-INTO-GLASS-UI] The grid-line / axis-label coordinate-frame treatment should be a glass-ui primitive
- **Evidence:** `EasingCurveCanvas.vue:17-43` hand-rolls grid lines (`.grid-line` at 0.25/0.5/0.75), a `.diagonal-ref`, and axis labels (`f(t)`, `t`, `0`, `1`). The sequence stage (`sequence-desktop.png`) re-hand-rolls a playhead line. C2/C5 want this same coordinate frame on stage plates.
- **Proposal:** abstract a `<GraphFrame>` / `.graph-paper` glass-ui primitive (axes + gridlines + optional diagonal ref + axis-label slots, tokenized opacity/pitch) so the curve canvas, the stage plates, and the sequence timeline all share ONE coordinate-frame vocabulary instead of three hand-rolls. This is the GRID+MATH brand made into a reusable system primitive.
- **Owner:** glass-ui-handoff.

### G2 [ADOPT] The `<Card surface="glass" tier="resting">` protagonist-plate vs `surface="cartoon" tier="quiet"` control-panel two-altitude split is good — extend it with a third "specimen/math" register
- **Evidence:** `design-idioms.css:480-523` documents the deliberate two-altitude split (glass-resting stage; cartoon-quiet chrome). `easing-desktop.png` shows it working. But there's no register for "this card IS a mathematical specimen" — the curve canvas uses `GlassPanel variant="wash"` (`EasingCurveCanvas.vue:2`), a third ad-hoc choice.
- **Proposal:** formalize a third glass-ui surface/tier for specimen plates (graph-paper-backed, axis-framed) so the math surfaces are a named register, not `variant="wash"` improvised per scene.
- **Owner:** glass-ui-handoff.

### G3 [REFINE-IN-GLASS-UI] The grid-background SVG tile should be a tokenized glass-ui graph-paper utility, not an inline data-URI in the demo
- **Evidence:** `EditorShell.vue:181` inlines a `data:image/svg+xml` corner-tick at hardcoded `fill-opacity='0.10'` + `background-size: 1rem`, duplicated for `.dark` at `:186`. The pitch and opacity are magic literals (debt per the design-tokens rule).
- **Proposal:** glass-ui ships a `.bg-graph-paper` utility with `--graph-pitch` / `--graph-opacity` / `--graph-major` tokens (fine + major lines), so the GRID brand pillar is a tokenized system idiom the demo consumes — and C5's two-tier graph paper falls out for free.
- **Owner:** glass-ui-handoff.

### G4 [ADOPT] The motion-path stage (geometry + handles + generating string) is the gold-standard specimen pattern — codify it as the stage-specimen contract
- **Evidence:** `motion-path-desktop.png` — path + control handles + `offset-path: path('…')` string + WAAPI-eligibility prose, all composed on the stage plate.
- **Proposal:** adopt this as the canonical "math specimen on stage" composition across scenes (the kf side, C7) AND consider abstracting the "live-geometry + draggable handles + generating-CSS readout" wiring into a reusable glass-ui specimen scaffold.
- **Owner:** kf-demo (propagate) + glass-ui-handoff (scaffold).

---

## Proportion notes (the user's brief)
- **Amplify where timid:** the grid-paper background (C5), the curve-on-stage (C1), the function-notation readouts (C3/C6) — the math field is currently too quiet; concentrate the audacity in the stage region.
- **Restrain where it crept:** the rainbow play-button + per-scene SVG icons + the home cube already carry the saturated pops well — do NOT add more color to chrome; keep the dock/rails calm. The audacious color stays on the animation TARGETS and the icons (proportionate, as built).
