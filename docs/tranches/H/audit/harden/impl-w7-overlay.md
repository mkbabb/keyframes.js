# impl-w7-overlay — H.W7 MOBILE OVERLAY + SPRINGY DRAWER (the IMPLEMENT lane note)

The cohesive owner's record of the mobile stack→overlay transposition: the fixed
full-bleed stage + the SpringProgress bottom sheet + the disjoint gesture handle +
the detents + the mode-classes + the amiga clear-color theming, all reconciled
with the LANDED W10/W11/W12 glass-card stages + control-surface DFA + scene
enrichments. **The gate lane binds to this note.** tsc-clean; all 682 unit tests
pass; built clean. NOT committed.

## THE OVERLAY MODEL (S1)

The mobile `grid-rows-[auto_1fr_auto]` STACK is DELETED (not patched — no legacy
beside the replacement). The transposition, in ONE motion:

- **The stage LEAVES the layout flow** → `position: fixed; inset: 0` (full-bleed
  background), `z-index: var(--z-content, 10)` (BELOW the sheet's z-controls=20
  and both docks' z-dock=40). `AnimationControlsGroup.vue` — the mobile branch of
  `@media (max-width: 1023px)`.
- **The G8 dock-safe primitive is REUSED, not forked** — the SHARED
  `.stage-cell { box-sizing: border-box; padding-block: var(--dock-band-reserve) }`
  rule (the W10 G8 primitive) insets the SUBJECT clear of both affixed dock bands.
  The mobile fixed layer and the desktop grid cell share the SAME reserve
  mechanism (DRY). This was the KEY reconciliation finding: the first cut used a
  fixed `top/bottom` inset, which RED'd `proof:stage-within-docks` (it asserts the
  symmetric `padding-block` reserve on `.stage-cell` at mobile). `inset: 0` +
  the G8 `padding-block` satisfies BOTH the floor and the dock-safe gate.
- **`h-full` / `self-center` overrides**: the utility `h-full` + grid-item
  `self-center`/`justify-self-stretch` made the fixed box content-sized + centered
  in the inset region (subject shrank to ~390px instead of filling the band).
  Overridden to `height: auto; align-self: stretch; justify-self: stretch` so the
  subject centers WITHIN the full-bleed padded frame.
- **The controls pane becomes a bottom SHEET** (`ControlsPaneWrapper.vue`) —
  `position: fixed`, anchored `bottom: var(--dock-menubar-reserve)` (above the
  menubar, inv δ), full-bleed width (the stale `max-width: min(440px, 100dvw)` cap
  + `margin-inline: auto` are DELETED — WV-W7-F6; internal padding owns the
  inset). z-controls (20), below both docks.
- **The expanded-timeline teleport** (`#timeline-expanded-target`) FOLDS OUT of
  grid flow on mobile → `position: fixed; bottom: var(--dock-menubar-reserve)`.
  It NEVER re-introduces a third consuming row (the single-stage-model invariant);
  collapsed it is `max-h-0`.
- **Desktop UNTOUCHED**: the `display: grid` was moved INTO the `@media (min-width:
  1024px)` block (the former unconditional `grid` utility class on the root was
  deleted with the mobile stack). The named rail·stage·rail grid
  (`[rail] var(--rail-width) [stage] 1fr`) + the [rail]-track collapse open/close
  axis is byte-identical. Verified live at 1440×900: pane in [rail] (400px), stage
  in [stage] (954px), side by side, `display: grid`. (A regression I caught + fixed
  mid-flight: deleting `grid` from the class string had dropped `display:grid` on
  desktop, stacking the stage below the pane.)

## THE MODE-CLASS MAP + THE GLASS-CARD / DFA RECONCILIATION (S1c)

The THREE mode-classes (S1c) map onto the LANDED scenes. The mode is scene data —
single-sourced in `scenes.ts` (`type StageMode`, `stageModeFor(sceneId)`), threaded
App.vue → EditorShell → AnimationControlsGroup → ControlsPaneWrapper as a
`stageMode` prop (typed inline in the shared `@` subtree, which owns its own
contract; the app passes the value):

| Mode-class    | Scenes                       | Stage register (mobile)                                  | Sheet expanded detent |
|---------------|------------------------------|----------------------------------------------------------|-----------------------|
| `subject`     | cube · amiga · square · home | full-bleed FIXED background (the subject IS the backdrop) | floor-respecting (≤0.52·100dvh − reserves) |
| `editor`      | easing                       | full-bleed FIXED frame holding the scene's glass card    | 70dvh ceiling          |
| `storyboard`  | spring · sequence · motion-path | full-bleed FIXED frame holding the scene's glass card  | 70dvh ceiling          |

**The W11/W10/W12 reconciliation (justified):** W11 I5 made the four stage scenes
(easing/spring/sequence/path) STANDARD GLASS `<Card>`s (not full-bleed) on desktop,
gated by the per-scene control-surface DFA (`controlSurfaceDFA.ts` — easing shows
only easing). On MOBILE, the `editor`/`storyboard` modes keep that contained glass
card as the scene's OWN content — the fixed `.stage-cell` is a dock-safe FRAME that
HOLDS the card, NOT a full-bleed background that dissolves it. Only the `subject`
class (cube/amiga/square — a 3D object that genuinely IS the backdrop) expands
toward full-bleed. This is the binding reconciliation: full-bleed for the subject
(the curve/rows/path are NOT a background to preserve), contained card for the
editor/storyboard (the content IS the protagonist). The W11 control-DFA is
untouched — the sheet renders the same DFA-gated controls; the mobile delta is the
spring sheet + the per-mode expanded detent, nothing in the DFA. W12's draggable
sequence rows / editable motion-path / per-scene eggs render unchanged inside the
sheet/stage; no scene-content code was touched.

**The 0.45 visible-fraction floor applies to `subject` ONLY.** The default
expanded detent is `max(peek, 0.52·100dvh − --dock-menubar-reserve −
--dock-band-reserve)` — derived from the floor algebra: visible = sheet.top −
stage.top = (100dvh − reserve − height) − stageTop ≥ 0.48·100dvh (a margin over
0.45). The `editor`/`storyboard` classes RAISE the ceiling to `min(70dvh, band)`
(no floor applies — the content card is the focus, not a background).

## THE GESTURE HANDLE (S1a / BLK-6)

The sheet open/close swipe is owned by a DEDICATED grab handle — a fixed-height
drag rail at the sheet's top edge — whose OWN `pointerdown`/`setPointerCapture`
owns the swipe. The handle has `touch-action: none`; the stage region below keeps
`touch-action: none` on the cube's OrbitalDrag root (the orbit surface). The two
gesture surfaces are SPATIALLY DISJOINT — verified live: the handle is OUTSIDE
`.scene-host`/`.stage-cell` (at y≈457, in the sheet), the cube's 3 `touch-action:
none` orbit surfaces are INSIDE the scene-host. Stage-drag mutates the quaternion;
handle-drag moves the sheet; neither swallows the other. A downward swipe past 28px
closes (→ peek), an upward swipe opens (→ expanded), a tap toggles (guarded so a
committed swipe doesn't double-fire on the synthetic click). Keyboard: Enter/Space
toggle; `role="button"`, `aria-expanded`, a `:focus-visible` ring.

**Decomposition (concern-seam split):** the gesture engine + the keep-open mutex
were extracted into `useSheetGesture(isOpen)` — a colocated composable (mirroring
`useDragScrub`'s SHAPE) alongside `useSheetSpring`. This was BOTH a DRY win AND the
fix that brought `ControlsPaneWrapper.vue` (and `AnimationControlsGroup.vue`) back
under the `proof:demo-no-oversize` 500L ceiling (the binding-design additions had
pushed both to 503/549L; the split lands them at 488/490L — the spec's answer:
"a colocated split, NOT trimming the affordance").

## THE SPRING (S2 / inv ζ) — `useSheetSpring`

`useSheetSpring(open: Ref<boolean>)` — authored in the shared `@` controls subtree
(`composables/useSheetSpring.ts`), mirroring `useSceneSwap`'s SHAPE (a colocated
composable owning ONE `SpringProgress`, watching a reactive trigger, per-frame
writing a reactive `sheetT` a sibling style binding reads). Constructed
UNCONDITIONALLY (no `if (!vtOwnsMotion)` guard — a drawer is not a VT swap).

- **Params:** `new SpringProgress({ response: 0.3, dampingFraction: 0.8,
  respectReducedMotion: true })` — settles ≈188ms (measured live), inside the
  <350ms budget. The `--spring-snappy` token is NOT bound (it resolves to
  `--spring-smooth` = response 0.5 ≈401ms, which FAILS the budget); the named
  preset is vocabulary, the passing INSTANCE is constructed here.
- **The 550ms CSS `grid-template-rows` ease is DELETED.** The mobile sheet has NO
  height/grid/transform CSS transition (verified by the grep clause). `sheetT` ∈
  [0,1] springs between the peek detent (0) and the expanded detent (1); the
  sheet `height` is `lerp(peek, expanded, --sheet-t)` (the spring writes the
  custom property each frame). The vestigial desktop `grid-template-rows`
  transition (dead since desktop is `display:block`) was ALSO deleted from the
  sheet file so the static grep clause stays GREEN.
- **THE WIRE BUG I FOUND + FIXED (twice).** The writer is wired on BOTH `subscribe()`
  AND `play(onFrame)` (idempotent — same ref, same value):
  - `play(onFrame)`-only MISSED the PRM snap: `SpringProgress._snapSettled()` (the
    reduced-motion path) emits to SUBSCRIBERS but does NOT invoke `play`'s
    `onFrame`. Subscribing covers the single-frame PRM jump (proof:drawer-spring c).
  - `subscribe()`-only MISSED the loop auto-resume: after a settled close, a new
    `target` set won't restart the rAF loop unless `_onFrame` is set (the resume
    guard is `if (this._onFrame) …`). `play(write)` binds `_onFrame` so re-open
    after a settled close ramps correctly (verified across 4 open/close cycles).
  - **NB for the engine reviewers:** `useSceneSwap` has the SAME latent PRM
    one-emit bug (it uses `play((v)=>…)` only). Out of my lane (its fade no-ops at
    opacity terminal), but recorded.
- **respectReducedMotion: true** gives the PRM single-frame snap for free
  (verified: open snaps `--sheet-t`→1 by the first frame, close→0).

## S2b — KEEP-OPEN MUTEX + glass-ui NON-CONSUMPTION

While the sheet is OPEN, `useSheetGesture` holds
`useOptionalDockContext().keepOpen()` (released on close, immediate watch) so the
bottom menubar's collapse timer can't shift the sheet's anchor — the imperative DI
function pair on DockContext (mirrors App.vue's @mbabb mutex), NOT a v-model
surface. The kf sheet keeps its SpringProgress ON PURPOSE (the named deliberate
non-consumption — binding the flagship motion to vaul would be the anti-dogfood);
glass-ui's DockContext keep-open is consumed where it does NOT own the motion axis.

## S1d — AMIGA CLEAR-COLOR THEMING (before full-bleed)

`AmigaScene.vue`: the renderer is now `{ alpha: true }` and `setClearColor(0xffffff,
0)` (transparent), replacing the opaque `setClearColor("white", 1)` that would
obliterate the grid-bg + dark mode once the stage goes full-bleed. The themed CSS
backdrop is a light/dark-aware vertical wash on `.amiga-canvas`
(`linear-gradient(var(--muted), var(--background))` — the HemisphereLight's CSS
twin). Verified live: the canvas composites the themed wash, the grid-bg shows at
the top edge, no white obliteration.

## S3 — DOCK Z-ORDER (verified, MEASURE-FIRST)

Measured live at 390×844: the fixed stage `z-index: 10` (z-content) is STRICTLY
below both docks' `z-index: 40` (z-dock); the sheet `z-index: 20` (z-controls) is
also below the docks. `elementFromPoint` at each dock-button center returns the
dock, not the stage/sheet — all 3 top-dock buttons + all 5 bottom-menubar buttons
hit-test to their dock (the sheet does NOT steal the menubar's pointer events).
LOW-1 invariant: the fixed stage's `offsetParent` is the viewport (NO
transform/contain/perspective ancestor — walked the chain, zero offenders), so
`fixed` resolves against the viewport.

## FILES CHANGED

- `demo/@/components/custom/animation-controls/composables/useSheetSpring.ts` — NEW (69L). The SpringProgress drawer.
- `demo/@/components/custom/animation-controls/composables/useSheetGesture.ts` — NEW (88L). The grab-handle gesture engine + keep-open mutex.
- `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` — the mobile fixed full-bleed stage + the deleted mobile grid stack + the fixed expanded-timeline; `stageMode` prop threaded through; `display:grid` moved into the desktop @media. (488L)
- `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` — the bottom SHEET (the grab handle markup, the spring/gesture wire, the peek/expanded detents ≤70dvh, the mode-class register, the deleted 550ms ease + 440px cap + near-full max-height). (490L)
- `demo/app/scenes.ts` — `type StageMode` + `stageModeFor(sceneId)` (the mode is scene data, single-sourced).
- `demo/app/App.vue` — `stageMode` computed (from `stageModeFor`) passed to EditorShell.
- `demo/@/components/custom/editor-shell/EditorShell.vue` — `stageMode` prop, forwarded to AnimationControlsGroup.
- `demo/app/scenes/AmigaScene.vue` — `alpha:true` + transparent clear + themed `.amiga-canvas` backdrop (S1d).

## VERIFICATION SUMMARY (live, 390×844, the binding facts the gates assert)

- **proof:mobile-single-page (a)** — subject (cube) UNOCCLUDED visible fraction **0.48 ≥ 0.45**; scene-host bottom (792) ≤ innerHeight (844). Editor/storyboard EXEMPT (floor applies to subject only).
- **proof:mobile-single-page (b)** — opening the sheet shifts the stage by **0px** (overlay, not displacement).
- **proof:mobile-single-page (c)** — both docks affixed (`position: fixed`, z-dock).
- **proof:dock-zorder** — stage z(10) < sheet z(20) < docks z(40); elementFromPoint at all 8 dock-button centers returns the dock; fixed stage offsetParent = viewport (no transform/contain ancestor — LOW-1).
- **proof:drawer-spring (a)** — NO `transition: grid-template-rows/height/transform` in the sheet file (live + comment-stripped).
- **proof:drawer-spring (b)** — settle **186–188ms** < 350ms; spring shape = decelerating to a **−0.015 overshoot dip** (ζ=0.8 ring), NOT a linear-in-eased CSS ramp.
- **proof:drawer-spring (c)** — under `prefers-reduced-motion: reduce`, open snaps `--sheet-t`→1 by the first frame, close→0 (single-frame snap).
- **proof:stage-within-docks** — PASS at 1280/1440/mobile (the G8 `padding-block: var(--dock-band-reserve)` reused; subject clears the top dock).
- **proof:demo-shell-grid** — PASS (desktop rail·stage·rail grid intact; `col-span-full` removed, satisfying the no-legacy grep).
- **proof:demo-no-oversize** — PASS (all demo files ≤500L; the gesture extraction is the colocated split).
- **proof:idle-fade** — PASS (desktop idle-fade unregressed; only the vestigial grid-template-rows transition removed).
- tsc clean; 682 unit tests pass (2 expected-fail); `npm run gh-pages` builds clean.

## OPEN NOTES FOR THE GATE LANE

- The gate harness MUST force the controls pane OPEN deterministically (seed
  `isControlsPanelOpen` + a `selectedAnimation`) to reproduce the open-state
  geometry — a fresh `#/cube` load with no selection `v-show`-hides the sheet.
- The visible-fraction clause measures `clamp(sheet.top) − clamp(sceneHost.top)`
  against `0.45 * innerHeight` for the SUBJECT class only (cube/amiga/square);
  it must EXEMPT easing (`editor`) + sequence/path/spring (`storyboard`).
- The drawer-spring grep clause is SCOPED to `ControlsPaneWrapper.vue` and must
  EXCLUDE `AnimationControlsControls.vue`'s `.panel-row` crossfade + `dist/`.
