# Morph — design audit (Tranche S, pass 1)

> Page: `demo/scenes/morph/` — `MorphSVGScene.vue` → `MorphTarget.vue` (+ `useMorphDemo.ts`, `morphShapes.ts`)
> Evidence: `docs/tranches/S/audit/pass1/design/screenshots/morph-{mobile,laptop,desktop}.png`
> Scope: analysis only. No source modified.

---

## 1. Product truth — what the page IS and is FOR

The morph scene is the showcase of the library's third HEAVY geometry front door: `fromMorphSVG(from, to)` over value.js's `PathGeometry` (`useMorphDemo.ts:16-37`). A live SVG `<path>` has its `d` written **by the engine every frame** via the Q.WC4 render contract (`d:` + the `--morph-d` custom-property fallback, `MorphTarget.vue:265-288`) — no per-frame Vue binding — while a small yellow glyph rides a body point of the morphing outline and **banks to its live tangent** (the S2 orient-along-path dogfood, `useMorphDemo.ts:126-136`). The scene loops alternately and infinitely through a curated four-shape ring (triangle → square → star → blob, `morphShapes.ts:78-83`), is alive the moment you land (`autoPlays: true`, `MorphSVGScene.vue:39-43`), and is deliberately **panel-less**: `CONTROL_SURFACES.morph = []` (`controlSurfaceDFA.ts:85-88`), so the only chrome is the shared bottom transport plus one in-card affordance, the "Next shape" button. It exists to prove, at a glance, that topology-mismatched path morphing (3-vertex → 5-point star → cubic blob) is engine-valid and paints directly on the DOM.

## 2. Usability · affordance discoverability · interactability

### What a first-time user finds unaided

- **The morph itself** — it plays on entry, so the core value proposition is delivered in zero clicks. Correct call for a showcase scene.
- **"Next shape"** (`MorphTarget.vue:45-53`) — visible, labeled, icon-carrying, and its effect is immediate (the `MORPH Triangle → Square` badge re-labels and both ghosts re-draw). Good.
- **The transport dock** (bottom pill: count · restart · reset · rainbow play) — the shared cross-scene transport drives play/pause of the contract group (`MorphSVGScene.vue:21-23`).
- **The two readouts** — the `MORPH from → to` headline badge and the live `TANGENT n°` sibling (`MorphTarget.vue:25-40`). The tangent number visibly ticking is the one always-on proof the engine is writing per-frame values.

### What is hidden or under-signaled

1. **The ring has no shape.** There are four shapes and a cyclic order, but nothing on screen says so — no position indicator, no count, no preview of what "Next" yields. The button reads as *shuffle* (the icon is literally `Shuffle`, `MorphTarget.vue:51`) when the behavior is a deterministic ring advance (`useMorphDemo.ts:112-115`). A user cannot get *back* to a pair they liked except by cycling all four.
2. **The ghosts are unexplained and nearly indistinguishable.** The `from`/`to` endpoint ghosts differ only by dasharray (`4 5` vs `2 6`) and a 0.7 opacity (`MorphTarget.vue:247-259`) — at stage scale they read as one faint decorative outline, not as "the two extremes the morph travels between." The badge's `Triangle → Square` arrow never visually connects to them.
3. **The stage is inert.** Nothing on the canvas responds to pointer or keyboard. Sibling scenes let you *shape* the subject (motion-path's draggable net) or scrub it in place; here the only temporal control is the distant transport. There is no drag-to-scrub on the stage even though the shared seam exists (`@composables/useDragScrub.ts`). For a scene whose whole story is "watch `t` sweep the topology," not being able to *hold* `t` mid-morph is the biggest interactability gap.
4. **Feedback on advance is a hard cut.** `nextShape` rebuilds the morph in place (`useMorphDemo.ts:107-108` → fresh `AnimationGroup`); the subject snaps to the new `from` shape with no transition, which reads as a glitch on a page that is otherwise 100% about smooth interpolation. The one moment the user acts, the engine appears to *stop* dogfooding.
5. **No keyboard path to the one affordance beyond Tab.** The button is reachable and correctly labeled (`aria-label="Next shape pair"` starts with the visible text, WCAG 2.5.3 — `MorphTarget.vue:44-49`), but there is no registered shortcut (glass-ui `registerShortcut`) the way other scenes bind their primary verb.

### Feedback loops, empty/loading states

- The subject is seeded at `t=0` before play (`anim.interpFrames(0, true)`, `useMorphDemo.ts:102-106`), so there is **no empty-`d` flash** — a well-handled loading state.
- The glyph poll is a gated rAF bridging the `markRaw` engine to Vue (`MorphTarget.vue:167-176`) — the demo's standing pattern, correctly paused on unmount.

### The mobile experience (375px shot)

- **The caption is occluded.** At 375px the explanatory caption ("A HEAVY `fromMorphSVG(from, to)` …") is cut mid-sentence behind the collapsed bottom sheet + transport band. The scene's one piece of teaching prose is unreadable on a phone.
- **The header stacks three rows tall** (title / MORPH badge / TANGENT badge / button all wrap, `MorphTarget.vue:15-54` `flex-wrap`), eating roughly a quarter of the viewport before the stage begins; the stage square is correspondingly compressed.
- **Touch target:** "Next shape" is `h-7` (28px) — well under the 44px guideline; on mobile it is the *only* in-card affordance and the hardest to hit.
- **The collapsed bottom sheet renders its handle + an empty content pill** on a scene whose control surface is intentionally empty (`morph: []`) — an affordance that opens onto nothing (verify live; the DFA is supposed to suppress the dock affordance, but the sheet chrome is present in the shot).
- The glyph (`font-size: 0.9rem`, `MorphTarget.vue:304-306`) is a fixed size that gets proportionally lost on the small stage.

## 3. Aesthetic critique against the glass-ui system

**Verdict: on-system, coherent, and quietly handsome — but the most spectator-y of the stage scenes, one register below memorable.**

- **Color.** The single-crayon discipline is executed exactly per the demo's D10 `--ball-tone` seam: one token at the stage root (`--ball-tone: var(--rainbow-violet)`, `MorphTarget.vue:188-190`) cascades to the field tint, hairline graph, ghosts, subject fill/stroke/glow — the scene keeps its icon's violet promise, and the `--rainbow-yellow` glyph (`:302`) is a genuinely good complementary pop (yellow on violet is the strongest two-tone pairing in the demo). This is the motion-path "blueprint ground" idiom re-keyed to violet (`:195-234`) — systemic, not derivative.
- **Typography.** The header rhythm (Instrument Serif `text-display` title + Fira Code `MetricBadge` metrics + `.code-token` prose, `MorphTarget.vue:22-40, 107-114`) matches MotionPath/Sequence by design (the comment at `:11-14` says so). Correct — but it also means the page has **no typographic moment of its own**; the display word "MorphSVG" is doing nothing morph-like on a page about shape-shifting.
- **Motion quality.** The morph itself is excellent — 2200ms alternate breathing (`useMorphDemo.ts:97-99`) at a calm cadence, the glyph's 90ms-damped bank (`MorphTarget.vue:310-312`) reads as a creature leaning, not a needle snapping. But motion is confined to the subject: the ghosts are frozen dashes (the same critique the motion-path treatment leveled at its guide path), the badge value swap is unanimated, and the next-shape cut is abrupt. The engine dogfood is **visible but singular**.
- **Composition.** Centered card, centered square stage, centered caption — the safest layout in the fleet. The inset glow (`box-shadow: inset … 32px`, `:233`) gives the plate some atmosphere; the ghost-against-subject layering is the one compositional idea, and it is under-sold (see §2.2).
- **Distinctiveness.** A visitor will remember "the violet shape that breathes" — that clears the generic bar. They will not remember an *interaction*, because there isn't one. Beside the spring derby, the easing gallery, and the motion-path pen tool, morph is the scene you watch from the doorway.

## 4. Ranked tasteful refinements (wave-shaped, on-system)

1. **Un-hide the ring: a shape-ring indicator that is also the picker.**
   *What:* a row of four small inline-SVG thumbnails (the actual `MORPH_SHAPES[i].d` strokes, ~20px, violet at 30%/100% for idle/active) between header and stage, current pair highlighted; click a thumb → `shapeIndex = i` + rebuild.
   *Where:* `MorphTarget.vue` header band; state already exists (`demo.shapes`, `demo.shapeIndex`, `useMorphDemo.ts:145-149`); reuse the ring-advance path of `nextShape`.
   *Why:* converts the scene's one hidden structure (a 4-ring) into its navigation, kills the shuffle-vs-ring ambiguity, and multiplies interactability for the cost of one small component. Highest leverage on the page.

2. **Fix the mobile occlusion + header stack.**
   *What:* at the mobile breakpoint, drop the caption behind a `line-clamp`/collapse or move it above the transport reserve; demote `MetricBadge size="xl"` → `lg` and let TANGENT hide under `sm:`; give the stage cell bottom padding equal to the sheet band.
   *Where:* `MorphTarget.vue:3-5, 25-40, 107-114` (classes only).
   *Why:* the page's only prose is currently unreadable at 375px and the stage — the protagonist — is the element paying for the header's appetite.

3. **Soften the next-shape cut with the engine's own vocabulary.**
   *What:* on advance, morph the *current* rendered `d` into the new `from` over ~250ms (a one-shot `fromMorphSVG(currentD, newFrom)` before installing the new loop), or minimally cross-fade ghosts + pulse the MORPH badge.
   *Where:* `useMorphDemo.ts:112-115` (`nextShape`) or a CSS-only fallback in `MorphTarget.vue`.
   *Why:* the single user action on the page should demonstrate the library, not bypass it — the hard cut is the one off-brand frame in the loop.

4. **Make the ghosts legible as endpoints.**
   *What:* tag each ghost with a tiny mono label (`from` / `to`, `--type-caption`, 40% tint) anchored at its topmost vertex, and raise the `to` ghost's distinction beyond dasharray — e.g. `to` at 30% tint solid-hairline, `from` dashed.
   *Where:* `MorphTarget.vue:69-78, 247-259`.
   *Why:* the badge's `Triangle → Square` arrow finally lands on the canvas; the layered composition starts earning its keep.

5. **Stage scrub — hold the morph in your hand.**
   *What:* horizontal pointer-drag on the stage scrubs the group's `t` (pause-on-grab, resume-on-release), routed through the shared `useDragScrub` seam (select-suppression included).
   *Where:* `MorphTarget.vue` stage div (`:60-105`) + a small `scrubTo(t)` on `useMorphDemo`.
   *Why:* sibling parity (spring/sequence/motion-path all offer a hand); freezing mid-morph is precisely how a user inspects the topology story this scene exists to tell.

6. **Touch-target and shortcut for the primary verb.**
   *What:* keep the visual `h-7` but add hit-slop (min 44px pointer area via padding/pseudo-element) on coarse pointers; register `n` via glass-ui `registerShortcut` for next-shape.
   *Where:* `MorphTarget.vue:45-53`; scene setup in `MorphSVGScene.vue`.
   *Why:* the only in-card control should be the easiest thing on the page to hit, on every input.

7. **Tabular figures on the tangent readout.**
   *What:* ensure `font-variant-numeric: tabular-nums` on the TANGENT `MetricBadge` value (if glass-ui doesn't already) so `7°`→`178°` doesn't jitter the header width each frame.
   *Where:* `MorphTarget.vue:33-40`.
   *Why:* a per-frame-live number that reflows its container is the cheap-readout tell.

## 5. The easter egg — "the fifth shape"

**Double-click the morphing subject and the ring briefly reveals a hidden fifth member: a violet heart.** The current rendered `d` one-shot-morphs (the engine's own `fromMorphSVG`, ~600ms, one alternate beat) into a heart path authored in the same `0 0 200 200` space, the yellow glyph sweeping a full lap of the outline as it forms — then it melts back into the ring exactly where it left off. No UI, no badge change except `MORPH … → ♥` for the beat. It is discoverable by the demo's established gated-dblclick convention (the spring derby precedent), costs one `d` string in `morphShapes.ts` plus a one-shot build in `useMorphDemo.ts`, is PRM-suppressed, and speaks purely in the page's own voice: the reward for poking the morph is *more morph* — the engine morphing into affection for the person who found it.

## 6. Accessibility notes (from source)

- **Semantics:** the SVG stage and glyph are `aria-hidden` (`MorphTarget.vue:65, 100`) — the canvas is correctly decorative; state is carried textually by the two `MetricBadge`s. The one control has an accessible name that starts with its visible label (`:44-49`, WCAG 2.5.3 honored).
- **Focus:** "Next shape" is a glass-ui `Button` riding `.btn-interactive` (`:47`, `playback-button.css` import at `:131`) — inherits the demo's single-sourced `:focus-visible` contract (`design-idioms.css:340-343`). No custom interactive surfaces exist, so no focus gaps.
- **Reduced motion:** the scoped PRM block holds the glyph transition and `will-change` (`MorphTarget.vue:321-328`) — but the scene `autoPlays` an infinite alternate loop (`MorphSVGScene.vue:39-43`) and nothing scene-side gates that on PRM. Whether PRM users see a perpetually morphing shape depends entirely on the library's reduced-motion snap (`src/animation/internal/reduced-motion.ts`); **verify live** that the loop degrades (a static mid-shape or the `from` pose would satisfy). If it does not, this is the page's one real PRM exposure.
- **Contrast:** all text rides tokens (`text-muted-foreground` caption, badge AA lineage); the violet subject on the 4%-tinted field is decorative so its contrast is not load-bearing. The 22%-tint ghosts (`:247-251`) are *intentionally* faint and `aria-hidden` — fine for AT, but see refinement 4 for sighted legibility.
- **Touch:** the 28px button height is below both WCAG 2.5.8 (24px min — passes) and the 44px platform guideline (fails) — hit-slop recommended (refinement 6).

---

*Grade rationale:* correct, token-clean, no empty states, real a11y hygiene, a genuinely good two-tone identity — held back by spectator-only interaction, an unexplained ring, a hard-cut advance, and a mobile caption occlusion. **B.**
