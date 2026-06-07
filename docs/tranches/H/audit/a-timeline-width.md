# Tranche H Audit — Lane `a-timeline-width`

**Charge (D4):** The PlaybackRibbon / timeline scrubber renders FULL-WIDTH; it should
match the controls-sidebar width. Propose the width-binding transposition (a shared
width token / container).

**Verdict:** CONFIRMED defect, reproduced live. The ribbon is unbound; the sidebar is
bound to a *different* cap. There is no single width authority — there are **three
competing width regimes** inside one column. The fix is a one-token gestalt
unification. **Disposition: SHIP-in-H.**

---

## 1. Live reproduction (1440×900 desktop, `#/cube`, controls pane open)

Measured via `getBoundingClientRect()` over the live DOM (playwright `browser_evaluate`):

| Element | Selector | Width | Bound by |
|---|---|---|---|
| Grid first track | `.controls-layout` track 1 | **1353.59px** | `gridTemplateColumns: "1353.59px 0px 0px"` |
| Controls sidebar | `AnimationControls` root (`controls/AnimationControls.vue:4`) | capped **768px** | `lg:max-w-screen-md` |
| **Timeline ribbon target** | `#controls-ribbon-target` | **1272px** | *nothing* (stretches to `.controls-content`) |
| PlaybackRibbon slider wrapper | `.timeline-green` | **1272px** | `w-full` |
| AnimationVisualizer track | `.container-inline-size` | **1256px** | `w-full` + `100cqw` |
| Token value | `--controls-pane-width` | **400px** | *nominal only — not honored* |

So the timeline ribbon is **1272px** while the sidebar caps at **768px**, and the
design token says the column should be **400px**. Three numbers, zero agreement. This
is exactly the user's report: the scrubber is full-width, the sidebar is narrower.

(Mobile at 390px is fine and SHOULD stay full-width — verified ribbon 296px ≈ content
366px. D10 wants the mobile docks full-bleed. The fix below is desktop-scoped.)

---

## 2. Root cause — three width regimes, no single authority

The teleport pipeline is sound: `AnimationControlsControls.vue:154` teleports
`PlaybackRibbon` into `#controls-ribbon-target`, which lives in `RibbonBar`
(`components/RibbonBar.vue:7`), which is a **sibling** of `AnimationControls` inside
`.controls-content` (`components/ControlsPaneWrapper.vue:26-86` — the `v-show`-wrapped
`<AnimationControls>` at 33-68 and `<RibbonBar>` at 73-85 share the
`controls-content h-full flex flex-col` parent at line 26). The DOM placement is
*correct*. The widths are not.

**Regime A — the grid track (the intended authority, not enforced).**
`AnimationControlsGroup.vue:5` declares
`lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]`. The token is `400px`
(`styles/design-idioms.css:106`). But the live grid resolves to
`1353.59px 0px 0px` — track 1 is *not* 400px. The stage spans the FULL grid
(`AnimationControlsGroup.vue:56`, `lg:col-start-1 lg:col-end-4`) and the pane is
`position: relative; z-controls` overlaying col 1 — so cols 2-3 collapse to `0fr` and
the `400px` track behaves as if it has been allowed to grow (the only authority that
would have pinned the ribbon to 400px is dissolved by the overlay layout). The
"COUPLED layout invariant" comment at `design-idioms.css:106-111` describes the
*intent* but the runtime does not realize it.

**Regime B — the sidebar cap.** `controls/AnimationControls.vue:4` ends with
`lg:max-w-screen-md` = **768px**. This is what visually narrows the sidebar — and it
is a *different* number than both the token (400) and the ribbon (1272). It is a magic
Tailwind cap unrelated to `--controls-pane-width`.

**Regime C — the ribbon (uncapped).** `RibbonBar.vue:2` is
`flex-shrink-0 pl-4 pr-7 pb-2` with no width cap; `PlaybackRibbon.vue:2` is
`w-full grid`; `AnimationVisualizer.vue:13` rides `w-full` + `translate-x-[calc(100cqw_-_100%)]`.
Each happily fills whatever the flex parent grants — which is the full 1272px
`.controls-content` box. The `min-width: var(--controls-pane-width)` on
`.controls-content` (`ControlsPaneWrapper.vue:206`) is a **floor, never a cap** — it
guarantees ≥400px and does nothing to stop the stretch to 1272.

**Net:** the column has a nominal token (400), a sidebar cap (768), and an uncapped
ribbon (1272). No element treats `--controls-pane-width` as the *width*. The token is
decorative.

---

## 3. The gestalt fix — make `--controls-pane-width` the SINGLE width authority

Idiomatic, KISS/DRY, one motion. The token already exists and is already named the
"COUPLED layout invariant." Honor it as a real `width`, not a floor, and delete the
two competing magic caps so every element in the column inherits ONE number.

**(i) Pin the pane box to the token (replace the floor with an actual width).**
`ControlsPaneWrapper.vue` `.controls-content` desktop block (lines 203-210): replace
`min-width: var(--controls-pane-width)` with `width: var(--controls-pane-width)` (and
keep `box-sizing: border-box` so the `padding-right/-bottom` for shadow clearance
stay inside the budget). Now the flex box that parents BOTH the sidebar and the
ribbon is exactly the token width — the ribbon's `w-full` and the visualizer's
`100cqw` resolve against 400px, automatically matching the sidebar. The container
query already established by `AnimationVisualizer.vue:13` (`container-inline-size`)
makes `100cqw` track the new box for free.

**(ii) Delete the sidebar's divergent cap.** `controls/AnimationControls.vue:4`:
remove `lg:max-w-screen-md`. With (i) in force, the parent box is already 400px and
`w-full` fills it — the 768px cap is now dead weight that only *re-introduces* a
mismatch if the column ever widens. One width source, not two.

**(iii) Make the grid track non-growing so the visual column equals the token.**
`AnimationControlsGroup.vue:5`: the `var(--controls-pane-width)` track should not be
absorbing the leftover. Because the stage overlays cols 1-4 (`col-end-4`) and cols
2-3 are `0fr`, the cleanest expression is a two-intent grid where the controls track
is fixed and the stage spans everything: keep `col-end-4` on the stage but ensure
the controls track is `var(--controls-pane-width)` with the remainder explicitly
inert. Concretely, since the pane is a `position: relative; z-controls` overlay that
*frames* the centered stage (per the `AnimationControlsGroup.vue:42-53` rationale),
the track only needs to be a stable 400px reservation. The min(100dvw) width on
`.controls-layout` (`AnimationControlsGroup.vue:330`) plus the 400px fixed track gives
a deterministic column; the `1fr 1fr` remainder simply soaks the rest under the
overlaid, centered stage. This step is the one to MEASURE-FIRST (see §5) because the
overlay/centering interplay (B.W3's "cube half-clipped" blocker, cited in the
component's own comment) must not regress — (i)+(ii) alone already make the ribbon
match the sidebar; (iii) is the belt-and-suspenders that makes the *token* literally
equal the *rendered* column.

**Why a token, not a wrapper component:** the coupling already lives in a token
(`--controls-pane-width`) consumed by the grid track and the pane. Adding a
width-binding *container* would be a new abstraction (god-wrapper) over a value that a
single CSS custom property already expresses — KISS says collapse onto the token, do
not invent a `<TimelineWidthProvider>`. "Two files, one token" (the existing comment's
own phrasing) becomes "N files, one token, actually honored."

**Net diff surface:** one line changed in `ControlsPaneWrapper.vue` (min-width→width),
one class removed in `AnimationControls.vue` (`lg:max-w-screen-md`), and an audited
track expression in `AnimationControlsGroup.vue`. No new files, no new components, no
compat shim. A replaced surface replaced in one motion.

---

## 4. Notes / adjacencies (not this lane's to fix, flagged for synthesis)

- **D12 interference (observed live, repeatedly):** every `page.goto` to a route
  bounced the SPA back through a *restored* scene (`#/cube` → `#/easing?anim=…` →
  `#/?anim=Rotations`), and the desktop grid measured `390px` mid-swap before
  settling. The scene-state restore churn made width measurement flaky and will make
  a width **visual-lock test flaky too** unless the test pins the scene + waits for
  the grid to settle. The width fix should land *with* an awareness of D12, but the
  width binding itself is independent. Flag to the D12 lane.
- `AnimationControls.vue:4` `lg:max-w-screen-md` (768px) is almost certainly a
  pre-token vestige (predates `--controls-pane-width`, G.W10.S4). Its removal is part
  of the fix, not a separate cleanup — leaving it is the "legacy code beside its
  replacement" the spine forbids.
- `--visualizer-track-gutter: 3rem` (`design-idioms.css:99`) already couples the
  visualizer rail inset; it composes cleanly with a 400px box (3rem of a 400px box is
  a sane gutter; today it is 3rem of 1256px — visually thin). The fix *improves* the
  gutter proportion as a side effect.

---

## 5. Falsifiable instruments (gates for H to enforce)

1. **`proof:timeline-width-binds-sidebar` (visual + numeric lock).** Playwright at
   1440×900, navigate to `#/cube`, open the controls pane, wait until
   `getComputedStyle('.controls-layout').gridTemplateColumns.split(' ')[0]` parses to
   the `--controls-pane-width` value (settle-gate for the D12 churn). Assert:
   `width(#controls-ribbon-target) === width(AnimationControls root) (±2px)` AND both
   `=== parseFloat(--controls-pane-width) (±2px)`. This single assertion kills all
   three regimes at once. Today it fails: 1272 vs 768 vs 400.
2. **`proof:no-orphan-width-cap` (source grep gate).** Assert
   `lg:max-w-screen-md` no longer appears in `controls/AnimationControls.vue`, and
   that `.controls-content` desktop rule uses `width:` (not bare `min-width:`) of
   `var(--controls-pane-width)`. Prevents the divergent cap from creeping back.
3. **`proof:mobile-ribbon-full-bleed` (regression guard for D10).** At 390px,
   assert the ribbon ≈ controls-pane width (full-bleed retained) — the desktop cap
   must not leak into mobile. Today passes (296≈366); lock it so the desktop fix
   doesn't break mobile.
4. **`proof:stage-not-clipped` (MEASURE-FIRST guard for step (iii)).** At 1280 and
   1440 with the pane OPEN and CLOSED, assert the stage subject's bounding box is
   fully within the viewport (re-asserting the B.W3 "cube half-clipped" invariant the
   grid comment guards) — the gate that lets step (iii) ship safely.

---

## 6. Anchors (file:line)

- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:4` — sidebar `lg:max-w-screen-md` (768px) divergent cap → DELETE.
- `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue:206` — `.controls-content { min-width: var(--controls-pane-width) }` floor → CHANGE to `width:`.
- `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue:73-85` — RibbonBar (sibling of AnimationControls inside `.controls-content`), the uncapped ribbon host.
- `demo/@/components/custom/animation-controls/components/RibbonBar.vue:2,7` — uncapped `flex-shrink-0` wrapper + `#controls-ribbon-target`.
- `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue:2` — `w-full grid` ribbon root.
- `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue:13,15` — `w-full` + `container-inline-size`, `100cqw`/`calc(100%-var(--visualizer-track-gutter))`.
- `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue:154` — `Teleport to="#controls-ribbon-target"`.
- `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:5` — `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]` (live: `1353.59px 0px 0px`).
- `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:56` — stage `lg:col-start-1 lg:col-end-4` overlay (dissolves track-1 enforcement).
- `demo/@/styles/design-idioms.css:106-111` — `--controls-pane-width: 400px` "COUPLED layout invariant" (intent stated, runtime not honored).
- `demo/@/styles/design-idioms.css:99` — `--visualizer-track-gutter: 3rem`.

**Disposition: SHIP-in-H** for (i)+(ii) (the ribbon↔sidebar binding, low-risk,
one-token); **MEASURE-FIRST** for (iii) (the grid-track tightening, gated by
`proof:stage-not-clipped`).
