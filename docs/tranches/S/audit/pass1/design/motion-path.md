# motion-path — design audit (Tranche S · pass 1)

> Page: `demo/scenes/motion-path/` (MotionPathScene.vue → MotionPathTarget.vue + useMotionPathDemo/Gesture + motionPathGeometry)
> Screenshots: `docs/tranches/S/audit/pass1/design/screenshots/motion-path-{mobile,laptop,desktop}.png`
> Prior treatment: `docs/frontend-design/demo/motion-path.md` (the "blueprint drafting table" doc — largely IMPLEMENTED at L.W11 S8)
> Scope: analysis only. No source modified.

---

## 1. What the page IS and what it is FOR

MotionPath is the demo's **pen-tool scene** — the one page where the user is an author, not a spectator. A cyan blueprint stage hosts an editable cubic figure-loop (3 anchors + 6 control points, single-sourced in `motionPathGeometry.ts:54-109`); a glowing traveller (the 🙂↔️ "creature") walks the loop via the engine's `fromMotionPath` factory, which sets an author `offset-path` and sweeps `offset-distance` (`useMotionPathGesture.ts:107-116`). Drag the traveller to scrub (through `ManualTimeline` + the group scrub seam — the same pipeline the bottom-bar transport rides, `useMotionPathGesture.ts:191-204`); drag a handle to re-author the curve, and the guide, the traveller's path, and the copyable `offset-path:` declaration all re-read the ONE `d` in lockstep (`useMotionPathDemo.ts:98-130`). It exists to prove the library's CSS-native MotionPath primitive tactilely: *the browser owns the geometry, you own the shape, the engine animates the answer.*

## 2. Usability · affordance discoverability · interactability

### Found unaided (desktop/laptop)

- **The traveller** reads as grabbable: largest ball on the field (2.75rem), glow, `cursor: grab` (`MotionPathTarget.vue:407-423`), and the caption spells it out ("Drag the traveller to scrub, or a handle to reshape the path", `:181-187`). Good closed loop: drag → the xl `offset-distance` MetricBadge counts live, the tangent badge follows (`:28-44`).
- **The handles** are discoverable-by-hover at best: 15–19px circles (`r` 9/7 in a 400-unit viewBox on a ≤416px stage, `:119`) with `cursor: grab` and a quiet fill swap (`:383-386`). The tether net + dashed-vs-solid node delta hints at "vector editor," but nothing pops to say "pull me" — the caption carries the whole teaching load.
- **Reset path** (`:50-58`), the copy button + live `offset-path` artifact (`:173-179`), and the bottom-bar "Path traversal" transport are all visible and labeled.
- **Feedback loops are excellent**: scrub → number; deform → guide + ants + traveller bank + artifact, all same-frame (the `watch(pathD)` re-seat, `useMotionPathGesture.ts:212-222`). Pause-for-gesture / resume-on-release routes through the scene machine (`:263-279`), so the sweep never fights a drag.

### Hidden

- **Keyboard paths are invisible**: the traveller and every node are `tabindex="0"` sliders with arrow/Home/End parity (`useMotionPathGesture.ts:283-295`; `MotionPathTarget.vue:263-276`) — genuinely good, but nothing on the page advertises it.
- **The wink egg** (full-lap drag → 😎 + spin + yellow spark, `useMotionPathGesture.ts:224-249`) is properly hidden — correct for an egg.
- **Empty/loading state**: none needed — the DrawSVG self-build (`useMotionPathGesture.ts:132-154`) doubles as the entrance, so the page never shows a dead frame. PRM users get the path pre-drawn (correct snap).

### Touch targets (the interactability defect)

Handles at r=9/7 user units render at ~19px/15px diameter on the 416px desktop stage — **below the WCAG 2.5.8 24px minimum** — and at ~6-9px on the mobile stage: effectively untappable. The traveller (44px) is the only compliant target. There is no invisible hit-halo; `pointer-events: auto` is on the visible circle only (`:372-381`).

### The mobile experience (375px shot) — where the page breaks

1. **THE DEFECT — the traveller escapes the stage.** The mobile capture shows the emoji ball floating over the caption text, entirely outside the blueprint square. Root cause is structural, not a capture race: the traveller's `offset-path: path('M 60 200 …')` is written in raw user units (`useMotionPathGesture.ts:107-116` and the `watch` rewrite `:212-222`), which CSS resolves as **px in the stage's box** — while the SVG guide scales the same coordinates through `viewBox="0 0 400 400"` (`MotionPathTarget.vue:75`). They coincide only when the stage side = 400px. Desktop caps at `--mp-stage-max: 26rem` = 416px (`:296-297`) — a 4% drift hidden under the ball. On the ~120px mobile stage, the unscaled (60, 200)px start lands ~200px *below* the stage — exactly where the screenshot shows the ball. Every stage below ~400px detaches the creature from its line; the scene's entire thesis ("the line you bend, the character walks") visibly fails at 375px. Note `clientToUserUnits` (`motionPathGeometry.ts:126-139`) already normalizes by the live side for *input*, so drags still project correctly — only the *rendered* position is wrong, which makes the bug read as haunted.
2. **The header eats the card.** At 375px the flex-wrap header (`:25-26`) stacks title / xl badge / tangent badge / Reset into ~4 rows, consuming roughly a third of the card and starving the stage square (the actual subject) down to ~120px.
3. **Handles are untappable** (~6-9px, see above) and cluster within ~40px of each other and of the traveller — fat-finger conflicts between scrub-drag and reshape-drag are guaranteed.
4. **The artifact clips mid-token** — `OFFSET-PATH: PATH('M 60 200 C 60 8…` — with `overflow-x-auto whitespace-nowrap` (`:178`) but no right-edge fade or scroll cue; it reads broken rather than scrollable.
5. **The bottom sheet + dock occlude the caption/copy row** at 667px height; the one sentence that teaches the two drag affordances is half-hidden exactly on the device class that most needs it.

## 3. Aesthetic critique (against glass-ui)

This is one of the demo's **most distinctive pages** — the prior design treatment landed and it shows.

- **Typography**: Instrument Serif `text-display` title against Fira Code metric badges + artifact (`:27-44`, `:178`) — the titleblock-vs-stamp register clash the blueprint direction called for. The xl `offset-distance` poster number wearing the scene cyan is the best-resolved region. (The doc's eyebrow-cartouche `OFFSET-PATH · EDITABLE` tag was never built — the header is still a flush web heading, the one typographic residue.)
- **Color**: exemplary **single-crayon discipline** — `--ball-tone: var(--rainbow-cyan)` cascades from one declaration (`:285-287`) to ground, graph, crosshair datum, guide, tethers, handles, ball glow, and badge accent. The stage is a designed field, not a tinted box: two-tier graph + centerline crosshair + inner vignette, all `color-mix`ed off the one token over the kept D17 wash (`:295-316`). The one warm exception (`--rainbow-yellow` wink spark, `:462-467`) earns its appearance at a delight moment. This is the token vocabulary (`design-idioms.css:268-302`, `:576-584`) consumed idiomatically, not re-forked.
- **Motion quality**: the page **visibly dogfoods the engine** — `fromMotionPath` drives the traversal, `fromDrawSVG` self-draws the guide on mount then hands back to the CSS marching-ants (`useMotionPathGesture.ts:132-154`; `MotionPathTarget.vue:333-360`), `ManualTimeline` owns the scrub clamp. The traveller banks into the live tangent with a damped 120ms rotate (`:430-437`) — the signature "author-the-curve, the-creature-obeys" moment is real and it is the demo's single best interaction. Wink spin uses the house overshoot bezier. All compositor-friendly; comprehensive PRM block (`:486-491`).
- **Composition**: clean vertical rhythm (titleband → stage → artifact → caption) inside one standard `Card` register (`:10`) — converged with sibling stage scenes. Slightly *safe*: the stage is still a centered square under a flush header; the doc's titleblock-overlapping-the-field and corner registration ticks (the moves that would break symmetry) were not built.
- **Memorable or generic?** Memorable — the blueprint field, the banking creature, and the live-authored copyable declaration make it the page people will remember. The residual generic tells are the handle nodes (plain circles; anchor/control legibility is a subtle fill/dash delta the source comments themselves call weaker than the diamond/circle convention, `:388-394`) and the flush header.

## 4. Ranked tasteful refinements (wave-shaped)

1. **Scale the traveller's `offset-path` to the live stage side** — WHAT: emit a scaled `d` (coords × side/VIEW) for the traveller's `offsetPath` (and the `fromMotionPath` build), recomputed via a `ResizeObserver` on the stage that calls `remeasure()` + `applyDistance(distance.value)`; the copyable artifact keeps the unscaled author `d`. WHERE: `useMotionPathGesture.ts:107-116`, `:212-222`; a small `scalePathD(d, k)` helper beside `buildPathD` in `motionPathGeometry.ts`. WHY: fixes the mobile traveller-escape defect and the 4% desktop drift — the scene's thesis depends on ball-on-line at every size. (Correctness, not decoration — rank 1 by a mile.)
2. **Invisible hit-halos on the handles** — WHAT: a transparent companion `<circle r="22">` per node carrying the `pointerdown`/`keydown` + slider ARIA (visible twin becomes `aria-hidden` decoration). WHERE: the handle loop `MotionPathTarget.vue:114-134`. WHY: 15-19px targets fail the 24px minimum on desktop and are untouchable on mobile; the visual stays exactly as designed.
3. **Mobile header compaction** — WHAT: below `sm`, step MetricBadges to `lg`/`md`, make Reset icon-only (keep the aria-label), keep title + xl badge on one row. WHERE: `:25-59`. WHY: returns ~60-80px of card height to the stage square — the subject — at 375px.
4. **Anchors → diamonds** — WHAT: branch `pt.kind` to a 45°-rotated `<rect>` for anchors, circles for controls. WHERE: `:114-134` + `.mp-handle--anchor` styles `:390-392`. WHY: instant on-path/off-path legibility (the vector-editor convention the source comment already concedes); the design doc's one unbuilt micro-interaction with real usability payoff.
5. **Real focus-visible + hover pop on nodes and traveller** — WHAT: a soft `--ball-tone` halo ring (`box-shadow`/SVG outer stroke) on `:focus-visible`, and swap the `r` hover transition for a compositor `transform: scale()` spring-pop; give the traveller a focus ring too. WHERE: `:372-399` (note `outline: none` at `:385` with only a fill swap), `:407-423`. WHY: keyboard operability exists but is nearly invisible — WCAG 2.4.7 wants an unmistakable indicator, and the pop makes the nodes read "pickable."
6. **Active-segment tether brighten** — WHAT: when `activeHandle` matches a segment, lift its two tethers 22% → ~45%. WHERE: `.mp-tether` `:366-370` + an `--active` class off the `tethers` computed `:238-259`. WHY: the editor "shows its work" — you see the cubic structure you're bending; pure CSS, one token.
7. **Artifact scroll affordance** — WHAT: right-edge fade (`mask-image: linear-gradient`) on the overflowing `code.artifact`; allow wrap (`whitespace-normal break-all`) below `sm`. WHERE: `:178`. WHY: the clipped declaration currently reads broken on mobile; the copyable spec is the page's take-home.
8. **The titleblock eyebrow** — WHAT: a Fira Code uppercase eyebrow `OFFSET-PATH · EDITABLE` (`--type-mono-caption`, 0.14em tracking, muted) above the serif title. WHERE: `:26-27`. WHY: the cheapest surviving piece of the doc's cartouche — names the mechanism *and* the editability (affordance #1's discoverability) in one stamped line.

## 5. The easter egg — "the draftsman's stamp"

On **Reset path**, a small cyan drafting stamp — `FIG. 1 — DEFAULT LOOP` in Fira Code caps inside a hairline rounded rect, rotated ~-8° — **thumps** into the stage's bottom-right corner with the house overshoot bezier (`cubic-bezier(0.34, 1.56, 0.64, 1)`, the wink's own curve), holds ~900ms, and fades. One `::after`-style overlay element + a one-shot class toggled by `demo.resetPath()` (`useMotionPathDemo.ts:121-123`); pure CSS animation, `--ball-tone` ink, `aria-hidden`, PRM-snapped (appear/fade, no thump). It is discoverable (Reset is a visible button, so everyone eventually fires it), cheap (~15 lines), and speaks the page's exact voice: an engineering drawing getting its approval stamp when you revert to the canonical figure — the blueprint identity's punctuation mark, sitting beside (never replacing) the existing full-lap wink.

## 6. Accessibility notes

- **ARIA**: traveller + all 9 nodes are `role="slider"` with `aria-valuenow/min/max`, the 2D nodes adding `aria-valuetext` announcing both coordinates (`MotionPathTarget.vue:126-131`, `:147-152`); Reset's accessible name starts with its visible text (WCAG 2.5.3, `:53`). Decorative SVG (`path`, tethers) is `aria-hidden` (`:89`, `:101`). Solid.
- **Keyboard**: full parity — traveller arrows ±5% + Home/End (`useMotionPathGesture.ts:283-295`), nodes arrow-nudge by 6 user units (`MotionPathTarget.vue:263-276`); keyboard scrub pauses the sweep through the machine. Gap: `Enter`/`Space` do nothing on the traveller (play/pause toggle would complete slider posture).
- **Focus**: the weak spot — `.mp-handle:focus-visible` sets only a fill tint and removes the outline (`:383-386`); the traveller has no focus style at all. See refinement 5.
- **Contrast**: cyan (`hsl(180 80% 50%)`) as the xl badge value on the light card is borderline for a data-bearing number (~2.5-3:1); the guide/tethers/graph are decorative and exempt. Caption/mono text ride the theme's `muted-foreground` — fine.
- **Reduced motion**: exemplary — one PRM block holds ants/wink/bank/handle transitions (`:486-491`), the DrawSVG self-build is skipped entirely (`useMotionPathGesture.ts:135-138`), `will-change` hints drop (`:354-357`), and the tangent still applies as a static state read.
- **Touch**: sub-minimum handle targets (see §2) are the one WCAG 2.5.8 failure.

## Verdict

**B+.** The demo's most distinctive, most honestly engine-dogfooding page — blueprint identity, banking creature, single-source authored geometry — held back from an A by a real correctness defect (the unscaled `offset-path` detaches the traveller from its line on any stage under ~400px, i.e. all of mobile) and untappable handle targets. Fix refinements 1-3 and this is the demo's flagship interaction.
