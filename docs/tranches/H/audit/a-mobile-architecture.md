# Tranche H Deep Audit — Lane `a-mobile-architecture`

**Charge:** D10 (mobile redesign — single page, affixed top/bottom docks, page contextually
changes by mode, **background = the current animation area**) and D13 (the mobile drawer
collapse/expand is not springy + too slow — must dogfood kf `SpringProgress`, must be fast).

**Method:** Live-audited the running demo (`http://localhost:5174/`) resized to 390×844
via Playwright MCP; measured DOM rects + computed styles; cross-read source. Every claim
below carries a `file:line` or a live-observation anchor.

**Verdict headline:** D10 is **not a styling nudge — it is an architectural transposition**.
The mobile layout *stacks* controls **above** the animation in grid rows; it does not *overlay*
controls **atop a full-bleed animation background**. With the drawer open the animation stage
collapses to ~30 px (effectively invisible). The mandate "BACKGROUND = the animation area"
is **structurally impossible in the current grid** and must be rebuilt. D13 is a clean,
already-precedented dogfood swap. A **major H theme**, as flagged.

---

## Live evidence (390×844, mobile viewport)

Measured DOM rects at `#/cube?anim=Rotations` and `#/spring` with the controls pane OPEN
(`controls-pane--open`), viewport confirmed `{w:390,h:844}`:

| Element | rect (x,y,w,h) | reading |
|---|---|---|
| `.controls-pane-wrapper` (drawer) | `0, 78, 390, 710` | **84 % of viewport height** |
| `.scene-host` (the CUBE / animation) | `0, 788, 390, 30` | **30 px tall, parked below the fold** |
| top dock (`.z-dock`) | top band, y≈47 | affixed top ✓ |
| bottom menubar (`.menubar-safe-pb`) | `bottom: var(--work-area-bottom-offset)` | affixed bottom ✓ |

The screenshot at this viewport shows **zero cube** — the entire visible area is the controls
panel; the animation it is supposed to be controlling is absent. This is the ground-truth of
the user's D10 report.

**Drawer transition (D13), measured computed style on `.controls-pane-wrapper`:**

```
transition: grid-template-rows 0.55s cubic-bezier(0.4, 0, 0.2, 1)
--duration-panel: 0.55s
```

→ A **550 ms CSS `ease-standard`** ramp on `grid-template-rows: 0fr ↔ 1fr`
(`ControlsPaneWrapper.vue:147-155`). Confirmed: **not a spring, and slow.** This is the
*only* major motion in the demo still on a hand-rolled CSS curve — `SpringProgress` already
drives the scene-swap and the visualizer coast (precedent below).

---

## Root-cause: the mobile grid is a STACK, not an OVERLAY

`AnimationControlsGroup.vue:5` defines the layout grid:

```
grid grid-cols-1 grid-rows-[auto_1fr_auto]
   lg:grid-rows-[1fr_auto] lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]
```

On mobile (`grid-cols-1`, three stacked rows):

- **row 1 (`auto`)** = the controls-pane wrapper (`ControlsPaneWrapper.vue:6`, `col-start-1 row-start-1`)
- **row 2 (`1fr`)** = the animation stage (`AnimationControlsGroup.vue:54-57`, `col-span-full row-start-2`)
- **row 3 (`auto`)** = the expanded-timeline teleport target (`:66`)

The pane's own mobile max-height (`ControlsPaneWrapper.vue:142-146`) is
`calc(100dvh − dock-margin − dock-icon-height − dock-menubar-reserve)` — i.e. it claims
*nearly the whole viewport*. The `auto` row 1 then takes that height and **starves the `1fr`
row-2 stage to ~0** — exactly the 30 px we measured. The source even *documents* this as a
known residual: `style.css:202-208` — *"with the controls pane OPEN the row-2 stage `1fr`
is starved by the capped controls-pane-wrapper… a tall/animated subject can still reach the
dock band."* The audit confirms it is far worse than "reach the dock band": the subject is
**evicted from the viewport entirely**.

The desktop layout is correct *by a different mechanism*: there the stage spans the full
3-col grid (`lg:col-start-1 lg:col-end-4`) and the controls pane is `position: relative,
z-controls` overlaying col-1 *on top of* the centered stage (`AnimationControlsGroup.vue:42-53`
commentary). **Desktop already overlays; mobile stacks.** The mobile transposition is to
make mobile do what desktop already does — overlay, not consume.

---

## FINDINGS

### F1 — D10 — Mobile must OVERLAY controls on a full-bleed animation background (the transposition) — SHIP-in-H

**Anchor:** `AnimationControlsGroup.vue:5,54-57`; `ControlsPaneWrapper.vue:6,142-146`;
live rects (stage `h=30` while pane `h=710`).

**Gestalt fix (one motion, no workaround):** Promote the **animation stage to a full-bleed
fixed background layer** that fills the dock-free band, and re-cast the controls pane as a
**bottom sheet that overlays it** (the desktop overlay idiom, isomorphic to mobile). The grid
stops being a vertical stack:

- The stage layer is `position: fixed; inset: 0` (behind the docks, `z` below `z-controls`),
  honoring `--work-area-top-offset` / `--dock-band-reserve` so the subject parks in the
  dock-free band — it is **always visible**, the literal background the user asked for.
- The controls pane becomes a **bottom sheet** anchored above the bottom menubar, sliding up
  *over* the stage (translateY / sheet height), `pointer-events` only on the sheet — the cube
  remains visible (and, per D11/F4, draggable) behind a partially-open sheet.
- This **collapses the mobile-vs-desktop divergence**: both are now "stage fills, controls
  overlay." The `grid-rows-[auto_1fr_auto]` mobile branch is *deleted*, not patched — the
  desktop `1fr` full-bleed stage becomes the single stage model; the pane's open/closed
  transform is the only mobile-specific delta (a named, befitting delta — KISS/DRY).
- The teleport-timeline (`row-start-3`) folds into the sheet's scroll body or becomes a second
  sheet detent — it must never re-introduce a third consuming row.

**Why idiomatic, not a workaround:** desktop *already* proves the overlay model in the same
component; this removes a divergent code path rather than adding one. It is the "replaced
surface replaced in ONE motion" the spine demands.

**Falsifiable instrument (`proof:mobile-stage-visible`):** at 390×844 with the controls pane
OPEN, assert `getBoundingClientRect()` of `.scene-host` has `height >= 0.45 * innerHeight`
AND `bottom <= innerHeight` (the stage occupies a real, on-screen fraction with the sheet
open). Today this fails hard (`height=30`, `bottom=818`). Add a Playwright visual lock
screenshot of the cube-with-sheet-open.

**Disposition: SHIP-in-H.**

---

### F2 — D13 — The mobile drawer must dogfood `SpringProgress`, fast — SHIP-in-H

**Anchor:** `ControlsPaneWrapper.vue:147-155` (`transition: grid-template-rows 0.55s
var(--ease-out|--ease-standard)`); live computed `0.55s cubic-bezier(0.4,0,0.2,1)`.
Precedent: `useSceneSwap.ts:45` and `AnimationVisualizer.vue:143` already construct
`new SpringProgress(...)` as the demo's motion authority.

**The premise correction (for the synthesis):** the drawer is **neither vaul-vue nor a
glass-ui Sheet** — `grep` for `vaul`/`<Sheet` in `editor-shell/` + `app/` returns nothing.
It is a **bespoke CSS `grid-template-rows: 0fr→1fr` drawer** hand-rolled in
`ControlsPaneWrapper.vue`. So D13 is not "swap the library's spring" — it is "replace the
hand-rolled CSS ease with the engine's own spring," which is *purer* dogfooding and aligns
with F1's sheet rebuild.

**Gestalt fix:** Drive the sheet's transform/height from a `SpringProgress` instance
(0→1 open, 1→0 close), per-frame writing a reactive `sheetT` exactly as
`useSceneSwap.ts:46-50` does for `sceneOpacity`. Use a **snappy, fast** preset — the
canonical `response ≈ 0.3, dampingFraction ≈ 0.8` family (the `--spring-snappy`/`--spring-smooth`
vocabulary in `style.css:133-147`) — *fast settle, slight life, no sluggish 550 ms ramp*.
`respectReducedMotion: true` (the spring's built-in snap, `spring.ts:43`,
`useSceneSwap.ts:45`) gives the instant clean open under PRM for free. Extract a tiny
`useSheetSpring(open: Ref<boolean>)` composable colocated with the sheet (mirrors
`useSceneSwap`), keeping the shell a thin host.

**Why not just shorten the CSS duration:** that would be the quick fix the spine forbids, and
it would re-fork the demo's motion story (one drawer on CSS, everything else on the engine).
The product *is* a spring engine; its own drawer must be sprung by it. This is dogfood-as-mandate.

**Falsifiable instrument (`proof:drawer-spring`):** (1) grep-gate — no
`transition:.*grid-template-rows` on the sheet in source; the open/close motion comes from a
`SpringProgress` subscription. (2) runtime probe: measure the sheet's settle time
(first frame → within 1 px of terminal) is `< 350 ms` and the position trace is monotone-to-
overshoot (spring shape), not the linear-in-eased-time of a CSS `cubic-bezier`. (3) PRM probe:
under `prefers-reduced-motion`, open/close is a single-frame snap.

**Disposition: SHIP-in-H.**

---

### F3 — D10 — Top + bottom docks are affixed but the page does NOT contextually re-flow as a single page — MEASURE-FIRST → SHIP-in-H

**Anchor:** top dock `ChromeDock.vue:106-109` (`fixed left-1/2 z-dock`, top via
`--work-area-top-offset` + safe-area); bottom menubar `AnimationMenuBar.vue:2-8`
(`fixed left-0 right-0 z-dock`, `bottom: var(--work-area-bottom-offset)`); the
`@supports not (height: 100dvh)` fallbacks already exist (`EditorShell.vue:158-171`,
`AnimationMenuBar.vue:283-293`).

**Reading:** the *skeleton* of D10 ("affixed top + bottom docks") is **already present and
correct** — both docks are `position: fixed`, both honor safe-area insets, both consume
`--work-area-*-offset`. This is honest **ALREADY-SOTA** scaffolding. What is missing is the
*body between them being a single contextual page over the animation background* (F1).
Once F1 lands the full-bleed stage + overlay sheet, the docks need no structural change — only
their `z` ordering must sit **above** the new fixed stage layer (verify no `z-dock`/`z-controls`
inversion once the stage goes `fixed`).

**The "page contextually changing by mode" half** is partially served by `useSceneSwap`'s
cross-dissolve, but the *controls content* per scene is keyed by `superKey` and the docks
already swap their scene icon/label (`ChromeDock.vue:170-200`). The gap is that switching modes
on mobile currently lands you in the all-consuming drawer (F1) rather than on the live
animation. F1 resolves this transitively.

**Falsifiable instrument (`proof:dock-zorder`):** after F1, assert the fixed stage layer's
computed `z-index` is strictly below both docks' `z-dock`, and that hit-testing the dock
buttons (elementFromPoint at each dock-button center) returns the dock, not the stage.

**Disposition: MEASURE-FIRST** the z-ordering interaction with F1, then **SHIP-in-H** as part
of the F1 rebuild (no separate workstream).

---

### F4 — D10/D11 — A full-bleed background stage makes the mobile scenes interactive for free — BOOK (feeds D11)

**Anchor:** F1's fixed stage; cube drag precedent `orbital-drag/OrbitalDrag.vue`
(Pointer Events + `setPointerCapture`, per demo CLAUDE conventions).

**Reading:** today the cube is uninteractable on mobile because it is a 30 px sliver behind
the drawer. The moment F1 makes the stage full-bleed and `pointer-events`-live behind a
partial sheet, the existing `OrbitalDrag` pointer handling applies on mobile as it does on
desktop — the user's D11 ask ("more interactive: clickable, draggable, like the cube orbital
drag") is *unlocked by F1*, not a separate feature. This lane flags it; D11's own lane owns
the per-scene interaction design.

**Falsifiable instrument:** a touch-drag gesture on the stage (Playwright `browser_drag` at
mobile viewport) mutates the cube quaternion (read `useTransformState` matrix) — proves the
stage receives pointer events through the partial sheet.

**Disposition: BOOK** (cross-references D11 lane; the *enablement* is F1, owned here).

---

### F5 — The mobile hero ("Select an animation…") is not mobile-tuned — RECORD (cross-ref D7)

**Anchor:** `EditorStartScreen.vue:2-3` — `absolute … mt-28 … h-0 … px-6 lg:mt-24`,
`text-display-4` hero, `pointer-events-none`. The overlay is `z-controls` over the start
screen (`EditorShell.vue:46-52`).

**Reading:** the hero uses the φ-ladder `text-display-4`/`text-title` tokens (good — D7's
lane owns the φ-typography audit), but its positioning (`mt-28`, `h-0` collapsed grid) was
tuned for desktop centering; on a 390-wide viewport the title + prose need verification
against the affixed top dock and the new sheet. This is **primarily D7's lane** (hero sizing +
φ-typography) and **D6's lane** (the `dot-fade` typing dots, `EditorStartScreen.vue:18`
`class="dot-fade"`, reported broken). I note only the **mobile placement interaction**:
once F1 makes the background the live stage, the start-screen hero must sit legibly over the
animation, not over a blank stacked row.

**Disposition: RECORD** — hand the sizing/typography to D7, the dot-fade to D6; this lane
asserts only that the hero must be placed over the full-bleed stage post-F1.

---

### F6 — Mobile drawer width is capped at 440 px but the sheet model wants full-width — RECORD

**Anchor:** `ControlsPaneWrapper.vue:215-219` — mobile `.controls-pane-wrapper { max-width:
min(440px, 100dvw); margin-inline: auto; padding-inline: 0.75rem; }`. At 390 px the
`min(440px,100dvw)` resolves to 390 (full width) — fine today. But under F1's bottom-sheet
model, the sheet should be **full-bleed width with internal padding**, and the single-column
controls (D1's lane forces one column) should flow naturally. Flag so F1's sheet does not
inherit a stale `max-width: 440px` that would float the sheet oddly on a 430–440 px device
(e.g. iPhone Pro Max logical 430).

**Disposition: RECORD** — fold the width rule into F1's sheet styling; verify on 430-wide.

---

## glass-ui interaction note (handoff-adjacent, do NOT patch in kf)

The bottom **menubar and top dock are `GlassDock`** (`@mkbabb/glass-ui/dock`). F1's fixed
stage layer sits *behind* them; F2's sheet sits *between* the stage and the docks. None of
this requires a glass-ui change — the docks are consumed as-is. **However**, D5's dock LAG and
the `DockDropdownTrigger`/`@mbabb` popover-not-opening (App.vue:18-72) are **glass-ui-HANDOFF**
(their AW tranche) and out of this lane's scope; I touch them only to note the bottom-sheet
must not steal pointer events from the bottom menubar's `GlassDock` (verify hit-testing per
F3's instrument). **Tag: glass-ui-HANDOFF** for the dock lag; **kf-owned** for the sheet z-order.

---

## Summary table

| ID | Defect | Anchor | Disposition |
|---|---|---|---|
| F1 | Mobile stacks controls over a ~0 stage; must overlay on full-bleed animation bg | `AnimationControlsGroup.vue:5,54`; `ControlsPaneWrapper.vue:142`; live `stage h=30` | **SHIP-in-H** |
| F2 | Drawer is a 0.55 s CSS `grid-rows` ease; must dogfood `SpringProgress`, fast | `ControlsPaneWrapper.vue:147-155`; precedent `useSceneSwap.ts:45` | **SHIP-in-H** |
| F3 | Affixed docks ✓ but page doesn't re-flow as single page over the bg; z-order vs new stage | `ChromeDock.vue:106`; `AnimationMenuBar.vue:7` | MEASURE-FIRST → SHIP-in-H |
| F4 | Full-bleed stage unlocks mobile interactivity (cube drag) for free | F1 + `OrbitalDrag.vue` | BOOK (feeds D11) |
| F5 | Hero placement must sit over the live stage post-F1 | `EditorStartScreen.vue:2-3` | RECORD (→ D7/D6) |
| F6 | Stale `max-width:440px` pane cap vs full-bleed sheet | `ControlsPaneWrapper.vue:215-219` | RECORD |

**Already-SOTA (honest):** affixed fixed docks with safe-area insets + `@supports not (dvh)`
fallbacks (`EditorShell.vue:158`, `AnimationMenuBar.vue:283`), and the cycle-free
work-area token chain (`style.css:96-131`) — exemplary; keep.

**The one sentence for synthesis:** mobile must stop *stacking* and start *overlaying* — make
the animation the full-bleed fixed background and the controls a `SpringProgress`-driven bottom
sheet over it (F1+F2 are one rebuild), which transitively delivers the single-page,
contextual, interactive mobile the user asked for.
