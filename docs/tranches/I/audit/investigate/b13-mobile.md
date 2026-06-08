# b13-mobile — Investigation: the mobile surface (overlay · drawer spring · dock)

**Agent:** INVESTIGATION [b13-mobile]
**Harness:** Playwright (`playwright-core` via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`)
serving the **BUILT** `dist/gh-pages/` on an ephemeral port; `chromium.launch()`;
mobile contexts (`isMobile:true`, `hasTouch:true`) at **390×844** (iPhone-12/13/14)
and **375×667** (iPhone-SE/8).
**Probes (runnable, committed):**
- `docs/tranches/I/audit/investigate/probes/b13-mobile.mjs` — 7 scenes × 2 viewports: console + pageerror + overlay geometry + sheet-spring trace + screenshot.
- `docs/tranches/I/audit/investigate/probes/b13-mobile-deep.mjs` — scene-switch crash, dock interactivity, seeded sheet-body visibility.
- (ad-hoc) dock single-vs-double-tap + menubar/sheet z-order overlap.
**Raw results:** `b13-mobile.result.json`, `b13-mobile-deep.result.json`.
**Screenshots:** `docs/tranches/I/audit/investigate/shots/b13-*.png`.

> Bottom line: the mobile **single-page overlay structurally works** (the stage IS
> the full-bleed `position:fixed inset:0` background; the docks ARE affixed; the
> spring IS a real underdamped `SpringProgress`). But it ships on top of the SAME
> engine/FSM rot the desktop has, **plus** three mobile-specific defects the
> source-shape gates never saw: a **menubar that occludes the sheet's bottom edge**,
> a **sheet-body that clips its own controls** (the editor/easing row is cut off),
> and **`transition: all` on every dock** (the B8 "supremely broken/slow" smell).

---

## What WORKS on mobile (do not regress)

| Surface | Evidence (390×844 unless noted) | Verdict |
|---|---|---|
| Full-bleed stage | `.stage-cell` is `position:fixed`, `top:0 bottom:667/844` across ALL 7 scenes | ✅ S1 holds |
| Subject visible-fraction | cube/amiga/square `visibleFrac ≈ 0.48` (sheet open) ≥ 0.45 floor | ✅ |
| Affixed docks | top pill + top-left dock + bottom menubar ALL `position:fixed` | ✅ inv δ |
| Spring drawer shape | `--sheet-t` trace: settle **169–175ms** (<350ms budget), **overshoot 0.0152** (ζ<1 ring), 105–109 frames | ✅ genuine `SpringProgress`, not a CSS ease |
| Grab handle | present + clickable across all 7 scenes; drives `--sheet-t` 1→0 | ✅ BLK-6 |

The drawer **spring physics are correct** — `proof:drawer-spring`'s claims are real.
The mobile rebuild's *bones* survived. The breakage is at the edges + on the shared engine.

---

## DEFECT 1 — the bottom menubar OCCLUDES the sheet's lower edge (mobile-specific, NEW)

**Captured (390×844, cube, sheet OPEN):**
```
sheet (.controls-pane-wrapper):  top 457  bottom 762   z-index 20
bottom menubar (.menubar-safe-pb): top 750  bottom 814   z-index 40
```
The sheet bottom (762) extends **12px BELOW** the menubar top (750), and the
menubar sits at **z 40 vs the sheet's z 20** → the menubar paints **on top of the
sheet's bottom 12px**. The sheet is anchored `bottom: var(--dock-menubar-reserve)`
(ControlsPaneWrapper.vue:251), but the resolved reserve does **not** clear the
menubar's rendered height at this viewport — the anchor under-reserves.

**Intended:** the sheet rides ABOVE the menubar band, never under it
(ControlsPaneWrapper.vue comment: "anchored ABOVE the bottom menubar band so the
sheet … never occludes the menubar (inv δ)"). The realized geometry inverts it —
the *menubar* occludes the *sheet*.

**Source trace:** `ControlsPaneWrapper.vue:251` (`bottom: var(--dock-menubar-reserve)`)
vs the menubar's actual rendered height (`.menubar-safe-pb`, h 64, includes
`menubar-safe-pb` safe-area padding). The token `--dock-menubar-reserve` is
narrower than the menubar's painted box.

**Root-cause hypothesis:** `--dock-menubar-reserve` is a static token that does
not account for the `menubar-safe-pb` safe-area inset (`env(safe-area-inset-bottom)`)
added to the menubar's actual height — so the reserve is short by the safe-area
pad. The proof:mobile-single-page gate measures `sheet.top` occlusion of the STAGE
(top edge) and never checks the **sheet.bottom vs menubar.top** seam — a gate
blindspot. **Fix axis:** derive the sheet's bottom anchor from the menubar's
*measured* height (or a `ResizeObserver`-fed CSS var), not a hand-tuned token;
gate the sheet.bottom ≤ menubar.top seam.

---

## DEFECT 2 — the sheet body CLIPS its controls; the easing editor row is cut off (B4 from the mobile vantage)

**Captured (390×844, easing, sheet seeded OPEN):** sheet `h 591`, `--sheet-t 1`.
But the editor mode's sheet expands to ~0.70·vh and the **content overflows**:

- Cube (seeded open, screenshot `b13-deep-cube-open-seeded.png`): the controls
  body shows duration/delay/iterations/direction/fill-mode then the **`easing ✏`
  label is sliced at the sheet's bottom edge** — the easing control itself is below
  the fold, inside the sheet's `overflow:hidden` clip.
- Of **36** control elements in the cube pane, only **7** are visible within the
  viewport (`b13-mobile-deep.result.json` → `sheetBody.visibleControlsInViewport: 7`).

**Intended:** the open sheet is the controls surface; its inner `.controls-pane`
is `overflow-y:auto` (scrollable) once `isPanelTransitionDone`. On mobile the body
should scroll to reveal the easing editor + the rest.

**Source trace:** `ControlsPaneWrapper.vue:50-55` — the inner pane is
`overflow-y-auto` ONLY when `isPanelTransitionDone && isControlsPanelOpen`, else
`overflow-hidden`. On the spring drawer there is **no `transitionend` event** (the
height is driven by `--sheet-t`, not a CSS transition), so `onPanelTransitionEnd`
(ControlsPaneWrapper.vue:4) **may never fire** → `isPanelTransitionDone` can stay
false → the pane stays `overflow-hidden` → the body **cannot scroll** to the
clipped easing row. This is a direct consequence of the S2 spring transposition:
the scroll-enable was wired to a CSS `transitionend` that the spring deleted.

**Root-cause hypothesis:** `isPanelTransitionDone` is gated on a `@transitionend`
that the SpringProgress drawer never emits (the height transition was replaced by
`--sheet-t`). The scroll-affordance is dead on mobile → the controls below the
fold are unreachable. **Fix axis:** drive `isPanelTransitionDone` off the spring's
settle (the `sheetT` reaching terminal), not a CSS `transitionend`; or make the
mobile pane unconditionally `overflow-y:auto` when open. This also folds B4 (the
"easing editor went missing"): on mobile the editor isn't *removed*, it's *clipped
unreachable*.

---

## DEFECT 3 — `transition: all` on every dock (B8 "supremely broken / slow")

**Captured:** 3 of the 4 `.z-dock` elements compute `transition: all`:
```
.z-dock (top pill)         transition: all   z 40
.z-dock (top-left)         transition: all   z 40
.menubar-safe-pb (bottom)  transition: all   z 40
.timeline-expanded-cell    transition: max-height 0.45s …, opacity 0.45s …  (scoped — OK)
```
`transition: all` animates **every** changed property — including layout
(width/height/top), paint, and composite — on every reactive class/style flip.
On a mobile GPU this is the "supremely broken, slow, errored" smell B8 names:
a dock that re-lays-out (icon morph, label swap, safe-area shift) re-animates the
*whole box* through layout, not just `transform`/`opacity`.

**Source trace:** the docks are glass-ui `<ChromeDock>` instances
(`demo/@/components/custom/dock/ChromeDock.vue`) — the `transition: all` is not in
the demo's dock CSS (grep is clean), so it is **glass-ui-owned** (the dock
primitive ships `transition: all`). Per MEMORY (`feedback_glass_ui_root_changes`,
`project_dock_doubleclick`) glass-ui/dock changes must land in the glass-ui repo,
not be patched in the demo.

**Root-cause hypothesis:** glass-ui ~3.5.1's dock primitive uses a broad
`transition: all` (and/or animates layout properties) — the mobile cost is the B8
jank. This is a **glass-ui version/handoff** axis (ties to B7 "are we on the latest
glass-ui?" — kf is pinned `~3.5.1`). **Fix axis:** scope dock transitions to
`transform`/`opacity` in glass-ui (born-RED handoff, NOT a demo patch); re-evaluate
the glass-ui pin.

---

## SHARED engine/FSM rot, REPRODUCED on mobile (these are NOT mobile-only — they ride the same source as desktop B1/B2/B3)

### B1 — the "......" parse crash fires on mobile too
**Console (cube, BOTH viewports):**
```
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
[error]    Err x     0
 1 |
     ^^^
```
**Pageerror (on scene switch, deep probe):**
```
Error: Parse error at offset 0: "......"
  at bo (engine-Do5bTwuK.js:19:62788)        ← value.js parseState (empty input)
  at cn.keyFn (engine-Do5bTwuK.js:19:63848)  ← getAnimationId keyFn
  at c (engine-Do5bTwuK.js:19:19351)
```
Confirms the report: the H.W0 "......" guard was incomplete — the
`CSSKeyframesToString → processFrame` path (and the `getAnimationId` keyFn over a
blank selector) still feeds empty input to value.js's `parseState`. Mobile hits
it on first cube load AND on every scene switch.

### B2 — the `_gen` suspend/resume crash reproduces on direct editor-scene load
**Console (easing AND spring, BOTH viewports, on load):**
```
TypeError: Cannot read properties of undefined (reading '_gen')
  at stop (engine-Do5bTwuK.js:1:2437)          ← RAFPlayback.stop() — this._gen undefined
  at index-TG-qwxf6.js:76:208
  at In/Ln (vendor-reka-ui …)                  ← a reka-ui lifecycle callback fires it
```
`_gen` is `RAFPlayback`'s private generation counter (`src/animation/playback.ts:78`),
read in `stop()`. The crash = `stop()` invoked where `this` (the `RAFPlayback`) is
`undefined` — i.e. `group.playback` (or a raw-rAF handle's playback) is undefined
at suspend time. The suspend path is `scenePlaybackAdapters.ts:73`
(`group.playback.stop()`) reached from `useSceneMachine.captureActive` on a scene
that has no live `playback` yet (the FSM captures-active a scene whose group/loop
never constructed). The original report's `this._gen` at `suspend
(scenePlaybackAdapters.ts:36)` is the SAME defect; mobile triggers it by mounting
easing/spring (whose `createRafAdapter` handle's `stopLoop` calls into a
not-yet-armed RAFPlayback).

### B3 — amiga is broken AND the FSM fails to reconcile controls on switch
**Screenshot `b13-deep-after-switch-amiga.png` (cube → easing → amiga, 390×844):**
the amiga stage is a **gray gradient void** (the 3D sphere never paints), AND the
controls sheet **still shows the CUBE's controls** — the "Rotations" selector and
the cube's `duration 5s / delay 0ms / direction alternate` — while the top dock
reads "Amiga". The scene route switched but **the playback/controls state never
reconciled** to amiga. This is the visible face of the B2 FSM suspend/resume
failure: the switch threw mid-reconcile, leaving stale controls bound to the new
route. (amiga's own "floats around / totally broken" is the WebGL stage; the
`GL_CLOSE_PATH_NV … GPU stall due to ReadPixels` warnings on amiga corroborate a
sick render path.)

### B9 — asset/sourcemap request failures
Across scenes: `net::ERR_ABORTED` on `vendor-monaco-*.js`, `vendor-highlight-*.js`
(lazy chunks aborted — likely the route teardown cancelling an in-flight async
component), and a blocked Google-fonts `instrumentserif` `.woff2`. No
`easing-icon-sm.svg` ENOENT in the BUILT dist (that B9 ENOENT is **dev-server-only**
— the built bundle resolves the icon; confirms the report's "dev-vs-build
icon-resolution discrepancy"). The aborted lazy chunks are worth a second look but
are not a mobile-specific crash.

---

## Mobile-specific summary for the root-cause + authoring phases

| ID | Defect | Mobile-specific? | Source trace | Fix axis |
|---|---|---|---|---|
| **M1** | menubar (z40) occludes sheet (z20) bottom 12px | **YES** | `ControlsPaneWrapper.vue:251` under-reserves `--dock-menubar-reserve` (no safe-area) | derive bottom anchor from *measured* menubar height; gate sheet.bottom ≤ menubar.top |
| **M2** | sheet body clips controls; easing row unreachable (no scroll) | **YES** | `ControlsPaneWrapper.vue:50-55` scroll gated on a `@transitionend` the spring never emits | enable scroll off the spring settle, not CSS transitionend; folds B4 |
| **M3** | `transition: all` on every dock (B8 jank) | partly (cost is mobile-acute) | glass-ui ~3.5.1 dock primitive; NOT demo CSS | scope dock transitions to transform/opacity in glass-ui (handoff, B7 pin) |
| B1 | "......" parse crash | no (shared) | `CSSKeyframesToString → processFrame`; `getAnimationId keyFn` over blank selector | guard the serialize/keyFn empty-input path (H.W0 was incomplete) |
| B2 | `_gen` suspend crash | no (shared) | `scenePlaybackAdapters.ts:73 group.playback.stop()` on a not-yet-armed RAFPlayback | null-guard playback in suspend; the FSM must not capture-active an unarmed scene |
| B3 | amiga void + stale controls on switch | no (shared FSM) | the switch throws mid-reconcile (B2) → controls never rebind to the new route | fix B2's reconcile so the switch completes |
| B9 | aborted lazy chunks + dev-only icon ENOENT | no | route teardown cancels in-flight async components; dev icon path differs from build | (book) confirm build icon resolves (it does); investigate abort-on-teardown |

**Headline for the gate-regime overhaul:** every mobile defect above is a
**RUNTIME / INTERACTION / GEOMETRY** fact that the green source-shape gates
(`proof:mobile-single-page`, `proof:drawer-spring`, `proof:dock-zorder`) **passed
over**: they assert the stage is full-bleed, the spring overshoots, the docks are
affixed — all TRUE — while never measuring **sheet.bottom vs menubar.top** (M1),
**whether the controls body can actually scroll to its content** (M2), or **the
dock's transition cost / single-tap responsiveness** (M3/B8). The I-tranche gates
must click, switch, drag, and **measure the occlusion + reachability seams**, not
the source shape.
