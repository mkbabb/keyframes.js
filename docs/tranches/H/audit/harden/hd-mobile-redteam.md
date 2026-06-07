# Tranche H DEEP harden — lane `hd-mobile-redteam`

**Charge:** deep adversarial red-team of the mobile architecture (D10/D13, H.W7). Attack
the overlay model: gesture conflict between the cube orbital-drag and the bottom sheet;
does the affixed-docks + sheet leave enough stage on 390×844; is "animation as background"
feasible for ALL mode-classes (easing curve, sequence, Three.js amiga); propose the
concrete mobile layout per mode-class.

**Method:** read H.W7, `a-mobile-architecture`, `_SYNTHESIS-frontend-mobile`,
`_SYNTHESIS-gap-scorecard §1.1/§3 H.W7`; re-verified every load-bearing `file:line`
against the working tree on `tranche-h-dev`; drove the live demo at 390×844 via Playwright
(`/#/cube`, `/#/amiga`, `/#/easing`); checked the glass-ui 3.4.0 API in `node_modules`.

**Verdict headline:** the overlay TRANSPOSITION is architecturally sound and the F1/F2/F3
fixes are correct + feasible — the stack→overlay move is the right gestalt, the
`SpringProgress` dogfood is real, and the dock scaffolding genuinely is ALREADY-SOTA.
**BUT the wave ships one BLOCKER and three HIGH defects that will surface at
implementation time:** (1) a **gesture conflict** the wave declares a "free win" but which
is structurally a COLLISION — `OrbitalDrag`'s `touch-action: none` + `setPointerCapture`
will swallow the sheet's swipe-to-open/close on the very mode it claims to unlock; (2) the
**"animation as background" mandate is mode-class-DEPENDENT** and the wave applies it
uniformly — it is wrong for the easing mode-class (the curve editor is the content, not a
background) and visually broken for the **amiga** (opaque white WebGL clear + a second
OrbitControls touch surface); (3) `proof:mobile-single-page (a)` is **mis-calibrated**
against the actual closed-pane baseline (the stage is already 877% — sorry, 0.877 of the
viewport — when the pane is closed, so the gate as written can pass without the rebuild);
(4) the sheet has **no detent/dismiss model**, so a full-height sheet re-creates the exact
30px eviction the wave is deleting. The charge's deliverable — a per-mode-class layout —
is in §B below.

---

## A. FINDINGS

### A1 — BLOCKER — the gesture conflict is a COLLISION, not a "free win" (H.W7 §S1, §Folds F4; `a-mobile-architecture` F4)

**Doc location:** `H.W7.md:25 (goal point 2)`, `:29 (S1: "the stage receives pointer events
through the partial sheet")`, `:54 (F4 BOOK: "unlocks mobile cube-drag for free")`;
`a-mobile-architecture.md:99,197-205`.

**The claim under attack:** "the cube stays visible — and, per F4/D11, **draggable** —
behind a partial sheet"; "the full-bleed `pointer-events`-live stage makes the existing
`OrbitalDrag` pointer handling apply on mobile **for free**."

**The defect, with evidence (verified live + source):**

- `OrbitalDrag.vue:328-333` sets `cursor: move; user-select: none; **touch-action: none**`
  on the drag container. Verified LIVE at 390×844 on `/#/cube`: the scene-host drag
  element computes `touchAction: "none"` and spans the **full 390×740/792** stage rect
  (measured `{x:0,y:78,w:390,h:740}`).
- `useOrbitalPointer.ts:218-222`: `onPointerDown` calls `event.preventDefault()` AND
  `containerRef.value!.setPointerCapture(event.pointerId)` on the FIRST touch — it
  immediately captures the pointer to the cube and registers document-level
  `pointermove`/`pointerup` listeners (`:225-232`).

  The consequence the wave never reckons with: **a swipe that starts on the full-bleed cube
  (i.e. anywhere on the stage not covered by a partial sheet) is captured by the cube on
  the first `touchstart`/`pointerdown` and `preventDefault`'d.** A bottom-sheet that wants a
  swipe-up-to-expand / swipe-down-to-dismiss gesture (the canonical bottom-sheet
  affordance, and the natural mobile gesture once the 550ms CSS drawer is replaced by a
  spring) **cannot receive that gesture** — the cube ate it. `touch-action: none` further
  tells the browser to do no native gesture interpretation on that region, so even a
  browser-driven scroll/drag handoff is suppressed.

- This is the SAME class of bug the spine forbids ("NO quick solutions… a wave may not
  mask an occlusion"): the wave's S1 hand-waves "`pointer-events` live only on the sheet;
  the stage receives pointer events through the partial sheet" — but pointer-events
  routing does NOT resolve a `touch-action`/`setPointerCapture` ownership conflict. Whoever
  the touch lands on FIRST owns the whole gesture. There is no z-order or pointer-events
  declaration that makes a single `touchstart` simultaneously a cube-orbit AND a
  sheet-drag.

- The amiga (`/#/amiga`) is WORSE: it uses Three.js `OrbitControls` attached to the
  `<canvas>` (`AmigaScene.vue:14,` `OrbitControls` import + instantiation), which installs
  its OWN `touchstart`/`touchmove`/`pointer` handlers with `preventDefault`. That is a
  THIRD independent gesture landlord on the same full-bleed region.

**Why this is a BLOCKER (not HIGH):** F4 is BOOKED as the headline payoff of the whole
rebuild ("unlocks mobile interactivity for free… the user's 'more interactive: draggable
like the cube orbital drag' is UNLOCKED by S1") and `a-mobile-architecture.md:203-205`
makes a touch-drag-mutates-quaternion the FALSIFIABLE INSTRUMENT. As written, the instrument
will PASS (a touch on the exposed cube DOES rotate it) while the sheet's own drag gesture is
DEAD — i.e. the wave will ship a mobile UI where the user can rotate the cube but cannot
swipe the sheet, OR (if the sheet is given the swipe) cannot rotate the cube. The two are
mutually exclusive on the overlapping region and the wave has no arbitration model.

**Concrete doc edit (H.W7 §Design decisions + §Scope S1, NEW decision + NEW S-clause):**

Add a RESOLVED design decision and a new sub-clause to S1:

> **Gesture arbitration — the sheet owns a DEDICATED grab affordance; the stage owns the
> rest — RESOLVED (the gesture conflict).** `OrbitalDrag.vue:332` `touch-action: none` +
> `useOrbitalPointer.ts:220-222` `preventDefault`/`setPointerCapture` mean the
> full-bleed cube captures any touch that lands on it on the first `pointerdown`; the
> Three.js `OrbitControls` on the amiga canvas is a second such landlord. A bottom sheet
> CANNOT share a swipe gesture with the stage underneath it. Therefore the sheet's
> open/close is driven by an explicit **grab handle** (a fixed-height drag rail at the
> sheet's top edge, the canonical bottom-sheet affordance) whose own
> `pointerdown`/`setPointerCapture` owns the swipe — NOT a swipe anywhere on the stage. The
> stage region BELOW the sheet keeps `touch-action: none` and remains the cube/amiga
> orbit surface. The two gesture surfaces are spatially DISJOINT (handle vs stage),
> resolving the collision without a workaround. The `useSheetSpring(open)` composable's
> `open` Ref is toggled by the handle drag (or the menubar control), never by a
> stage-region swipe. **F4's instrument is re-scoped:** a touch-drag on the EXPOSED stage
> (below the sheet) mutates the quaternion; a separate drag on the HANDLE moves the sheet —
> the two never share a `touchstart`.

This also forces H.W7 to declare a sheet HANDLE in S1 (today S1 has no handle — see A4).

---

### A2 — HIGH — "animation IS the background" is mode-class-dependent; the wave applies it uniformly (H.W7 §Goal, §S1; `a-mobile-architecture` F1)

**Doc location:** `H.W7.md:25 ("the animation IS the full-bleed background")`, `:29 (S1)`;
`a-mobile-architecture.md:84-117 (F1, written entirely against the cube)`;
`_SYNTHESIS-gap-scorecard.md:68,160`.

**The defect:** the entire F1 transposition is reasoned from the CUBE (a centered 3D subject
that genuinely wants to be a full-bleed background). It is then declared "the single stage
model" for ALL scenes. But the eight scenes are NOT one mode-class. Verified by reading each
scene component:

1. **Subject-as-background class (cube, amiga, square):** the subject is a centered visual.
   Full-bleed background is RIGHT for these. ✓ — but see the amiga caveat (A3).

2. **Editor-as-content class (easing):** `EasingScene.vue:26-27` sets
   `storedControls.isControlsPanelOpen = true` on entry and the SCENE'S ENTIRE POINT is the
   curve editor (`EasingSidebar`/`EasingCurveCanvas`), which lives in the CONTROLS pane. The
   "stage" (`EasingTarget.vue`) is a `.glass-card` preview (a bordered card,
   `EasingTarget.vue:4` `class="glass-card easing-target"`), not a full-bleed visual. Making
   this card the full-bleed BACKGROUND and shoving the curve editor into a bottom sheet
   INVERTS the scene: the content (curve) goes into the overlay, the chrome (a preview card)
   becomes the background. H.W5 (`H.W5.md:35`) is concurrently trying to PROMOTE
   `EasingCurveCanvas` to be the easing scene's PRIMARY STAGE element — which directly
   CONTRADICTS H.W7 putting all controls (incl. the curve) into a bottom sheet on mobile.
   These two waves disagree about where the easing curve lives on mobile.

3. **Storyboard class (sequence, motion-path, starting-style):** `SequenceScene.vue:26` sets
   `isControlsPanelOpen = false` — these are passive shop-windows with the transport on the
   target. Full-bleed background is plausible here, but the sheet is then near-empty
   (transport only), so a full-height sheet is pure occlusion (A4).

**Why HIGH:** the wave's gate `proof:mobile-single-page (a)` (`.scene-host height >= 0.45 *
innerHeight`) is asserted across ALL scenes via the H.W8 re-sourced SCENES manifest at
390×844 (`H.W7.md:37,39`). For easing, a 45%-tall `.glass-card` preview as background with
the curve editor in a sheet is a worse UX than today, yet it would GREEN the gate — the gate
rewards the wrong thing for that mode-class.

**Concrete doc edit (H.W7 §Design decisions, NEW decision; and §Scope S1):**

> **The full-bleed-stage model applies to the SUBJECT-AS-BACKGROUND class; editor/storyboard
> classes get a NAMED delta — RESOLVED.** The eight scenes are three mode-classes (verified:
> cube/amiga/square = subject-as-background, `isControlsPanelOpen` user-driven; easing =
> editor-as-content, `EasingScene.vue:27` forces the pane open; sequence/motion-path/
> starting-style = passive storyboard, `SequenceScene.vue:26` pane closed). The
> full-bleed-fixed-stage + bottom-sheet model is the default for the subject class. For the
> **easing** class the PRIMARY surface is the curve editor — on mobile it stays in the sheet
> as the EXPANDED (tall-detent) default, and the H.W5 "promote `EasingCurveCanvas` to stage"
> move is the mobile resolution (the curve IS the stage; the scrubber preview is the sheet);
> H.W7 and H.W5 are reconciled HERE so they do not ship contradictory mobile homes for the
> easing curve. For the storyboard class the sheet defaults to the COLLAPSED detent
> (transport only). The `proof:mobile-single-page (a)` gate's 0.45 floor is asserted ONLY for
> the subject class; the editor/storyboard classes assert their own befitting layout.

---

### A3 — HIGH — the amiga as a full-bleed background is visually broken: opaque white WebGL clear + a second touch landlord (H.W7 §S1 applied to amiga; cross-ref H.W5)

**Doc location:** `H.W7.md:29 (S1, "the single stage model")` applied to every scene incl.
amiga via `proof:mobile-single-page` over the SCENES manifest (`:37`).

**The defect (source-verified):**
- `AmigaScene.vue` (the onMounted block I read): `renderer.setClearColor("white", 1)` — the
  WebGL canvas clears to **opaque white**. As a `position: fixed; inset: 0` full-bleed
  BACKGROUND, this paints an opaque white rectangle over the entire viewport behind the
  sheet. The demo's `grid-background` (`EditorShell.vue:5-8`, a fixed dotted backdrop) and
  any dark-mode theming are OBLITERATED by a white WebGL fill. In dark mode this is a
  blazing white full-screen background — a regression, not a feature.
- The amiga canvas carries Three.js `OrbitControls` (`AmigaScene.vue` imports + instantiates
  `OrbitControls`), a second independent gesture landlord (compounds A1).
- H.W5 already books the amiga's `setPixelRatio(window.devicePixelRatio * 2)` /
  `AmigaScene.vue:47` dpr cap as MEASURE-FIRST scene-perf and "sphere-drive-or-KILL". A
  full-bleed `inset:0` amiga at `dpr*2` on a 390×844 retina viewport is ~390·844·(2·dpr)²
  pixels — a far larger WebGL surface than today's clipped canvas; the perf budget H.W5
  measures must account for the H.W7 full-bleed promotion, but neither wave cross-references
  the other on this.

**Why HIGH:** the wave's own `proof:visual-lock` (H.W8) pixel baseline at 390×844 will
capture a white-rectangle amiga as the "correct" background — locking in the defect. And the
full-bleed dpr blow-up is a perf interaction H.W5's budget does not yet model.

**Concrete doc edit (H.W7 §Folds, extend the RECORD; add a cross-ref to H.W5):**

> **amiga full-bleed caveat — RECORD + cross-ref H.W5.** `AmigaScene.vue` clears to opaque
> white (`setClearColor("white", 1)`); promoting it to a `fixed; inset:0` background
> obliterates the grid-background and dark-mode theming and clashes in dark mode. Before the
> amiga joins the full-bleed model: (a) drive `setClearColor` from the theme (transparent
> clear `setClearColor(0x000000, 0)` + a themed CSS backdrop, or the foreground/background
> token) so the WebGL canvas composites over the demo background instead of painting over
> it; (b) the full-bleed `dpr*2` surface area is a perf interaction H.W5's amiga
> scene-perf-budget MUST measure at 390×844 full-bleed (not the current clipped canvas) —
> cross-reference H.W5 S6 so the budget reflects the H.W7 geometry. Tag the amiga clear-color
> as a NAMED delta on the subject-class background model.

---

### A4 — HIGH — the sheet has NO detent/dismiss model; a full-height sheet re-creates the exact 30px eviction the wave deletes (H.W7 §S1; gate `proof:mobile-single-page (a)/(b)`)

**Doc location:** `H.W7.md:29 (S1)`, `:64 (teleport "folds into the sheet body or a second
detent")`, `:39-40 (gate a/b)`.

**The defect:** S1 says "the controls pane becomes a bottom SHEET" and mentions "a second
sheet detent" only for the teleport-timeline. It never specifies the sheet's RESTING
height/detents. The controls content is substantial (per-animation controls + keyframes +
ribbon + timeline — `ControlsPaneWrapper.vue:26-86`). Today's pane claims `max-height:
calc(100dvh − dock-margin − dock-icon-height − dock-menubar-reserve)`
(`ControlsPaneWrapper.vue:142-146`) — i.e. **nearly the whole viewport when open**. If the
new "sheet" simply slides that same near-full-height pane up as an overlay, then with the
sheet OPEN it covers ~84% of the viewport (the exact `h=710` the audit measured at
`a-mobile-architecture.md:27`) — the stage is fully occluded again, just by an overlay
instead of a grid row. The user's complaint ("the cube I'm controlling is invisible") is
unchanged; only the CSS mechanism differs. That is precisely the symptom-relocation the
spine forbids.

The gate does NOT catch this: `proof:mobile-single-page (a)` checks `.scene-host` *layout
height* `>= 0.45 * innerHeight` AND `bottom <= innerHeight`. A `fixed; inset:0` stage has
layout height ≈ full viewport REGARDLESS of whether a sheet visually covers it — so the
geometric gate passes even when an 84%-tall opaque sheet hides the stage. The gate measures
the wrong thing (stage LAYOUT box, not stage VISIBLE-fraction-under-the-sheet).

**Why HIGH:** the wave's central promise — "the cube is ALWAYS visible" — is unverified by
its own gate, and the obvious naive implementation (slide the existing tall pane up)
satisfies every clause while delivering the original defect.

**Concrete doc edit (H.W7 §Scope S1 + §Hard gate, two edits):**

1. S1: specify the sheet detents explicitly —
> The sheet has bounded resting detents: a **peek** detent (collapsed — handle + transport
> visible, stage ≥ ~60% visible) and an **expanded** detent (≤ ~70dvh, never full-height —
> the stage's dock-free band stays partially visible above the sheet). The
> `ControlsPaneWrapper.vue:142-146` near-full-viewport `max-height` is DELETED with the
> stack (it is the source of the 84% cover); the sheet's expanded detent is capped so the
> stage is never fully occluded. `useSheetSpring` snaps between detents; `sheetT` maps to
> the detent translateY, not 0fr↔1fr.

2. Gate: re-calibrate `proof:mobile-single-page (a)` to measure VISIBLE stage —
> `proof:mobile-single-page (a)` asserts the stage's UNOCCLUDED fraction (the stage rect
> minus the sheet's overlapping rect) `>= 0.45 * innerHeight` with the sheet at its EXPANDED
> detent — not merely the stage's layout-box height (a `fixed; inset:0` stage has full-height
> layout regardless of the sheet covering it, so the layout-box form passes vacuously).
> Compute `visible = clamp(sheet.top, 0, innerHeight) - clamp(stage.top, 0, innerHeight)`.

---

### A5 — MED — `proof:mobile-single-page (a)` is mis-calibrated against the live CLOSED-pane baseline; it can be GREEN today (H.W7 §Hard gate)

**Doc location:** `H.W7.md:39 ("reds TODAY (live height=30, bottom=818)")`;
`a-mobile-architecture.md:111-116`.

**The defect (verified live):** the "30px stage" baseline the gate cites is the
**controls-pane-OPEN** state. But the demo's DEFAULT mobile landing at 390×844 has the
controls pane CLOSED (no animation auto-selected for cube; `selectedAnimation` empty on
`__home__`), and in that state I measured `.scene-host` = `{y:78, h:740}`, **visible
fraction 0.877 of the viewport** — the stage is ALREADY 88% of the screen. The 30px
eviction only occurs when an animation is selected AND `isControlsPanelOpen` flips true (I
had to set the localStorage flag manually to even approach the open state, and the
route-storm reset it on reload).

The gate says "at 390×844 with the controls pane OPEN" — but the gate harness must
DETERMINISTICALLY force the open state, which on the live tree is hard to reach (the route
storm and the home↔cube alias keep resetting it, observed live). If the harness measures the
default (closed) state, it reads `h=740` and GREENS without any rebuild — a false pass.

**Why MED (not HIGH):** the defect IS real and IS reproducible; the risk is gate-harness
calibration, downstream of H.W1's FSM landing (which stabilizes the open state). But the
wave should state the precondition explicitly so the gate is not written against a state
that is flaky to reach.

**Concrete doc edit (H.W7 §Hard gate, `proof:mobile-single-page (a)` precondition):**

> The harness MUST first drive the controls pane to its OPEN/expanded state
> deterministically (select an animation + set `isControlsPanelOpen`), then assert — because
> the CLOSED-pane stage is already ~0.88 of the viewport live (measured `h=740` at 390×844),
> so a gate that reads the default closed state passes vacuously. This precondition depends
> on H.W1's FSM holding the open state (the route storm currently resets it); sequence the
> gate authoring after H.W1, consistent with `_SYNTHESIS-frontend-mobile §4` (H-FE-0 gates
> all visual locks).

---

### A6 — MED — glass-ui 3.4.0 SHIPS a Sheet with a `spring` prop; the wave's "BESPOKE, so no glass-ui dependency" framing is half-true and the inv-16 reasoning should be tightened (H.W7 §S1/§Folds; `a-mobile-architecture` F2)

**Doc location:** `H.W7.md:18 (state)`, `:31 (S2)`, `:56 (glass-ui-HANDOFF: "The glass-ui
DrawerContent spring prop ask is a BOOK")`; `a-mobile-architecture.md:128-134`.

**The check (node_modules, verified):** glass-ui 3.4.0 EXPORTS a Sheet
(`node_modules/@mkbabb/glass-ui/dist/sheet.d.ts`, `components/ui/sheet/SheetContent.vue.d.ts`)
whose `SheetContentProps extends DialogContentProps` and ALREADY declares
`spring?: boolean | SpringPreset` with "spring-physics entrance via `useSpringMount`". So the
wave's premise statement "the glass-ui `DrawerContent` spring prop ask is a BOOK" is
INACCURATE — the spring prop already EXISTS on the shipped Sheet. The demo drawer is indeed
bespoke (no `<Sheet>`/`vaul` import — I confirmed `grep` finds none in source), so the wave's
DECISION (build a kf-owned sheet driven by the kf engine) can still stand, but the
JUSTIFICATION is now: "we deliberately do NOT consume glass-ui's Sheet because we want the kf
ENGINE (`SpringProgress`) to drive the sheet as dogfood — not because glass-ui lacks a
spring." That is a stronger, honest framing AND it must reckon with inv-16 (consume glass-ui;
do not re-author what it provides): the wave is choosing to NOT consume a glass-ui surface
that exists, on dogfood grounds. That choice is defensible (the demo IS a spring engine
shop-window) but it must be NAMED as a deliberate non-consumption, not papered as
"glass-ui doesn't have it (BOOK)."

**Why MED:** does not block implementation, but an inv-16 reviewer will catch the demo
hand-rolling a sheet when glass-ui ships one; the wave must pre-empt that with the dogfood
rationale and drop the inaccurate "DrawerContent spring prop ask is a BOOK" claim.

**Concrete doc edit (H.W7 §S1 + §Folds glass-ui-HANDOFF):**

> Replace the "the glass-ui `DrawerContent` spring prop ask is a BOOK" note with: glass-ui
> 3.4.0 ALREADY ships `<SheetContent spring>` (`sheet.d.ts`,
> `SheetContent.vue.d.ts: spring?: boolean | SpringPreset` via `useSpringMount`). H.W7
> deliberately does NOT consume it: the demo is a spring-engine shop-window, so its own
> most-visible structural motion must be driven by the kf ENGINE (`SpringProgress`) as
> dogfood (inv ζ), not by glass-ui's spring. This is a NAMED deliberate non-consumption of an
> existing glass-ui surface (the one exception to inv-16's "consume, don't re-author" — a
> dogfood delta), not a gap in glass-ui. The bottom-sheet STRUCTURE (overlay, detents,
> backdrop, focus trap) should still consume glass-ui's `Sheet`/reka primitives where they
> do not own the motion axis — verify the sheet does not re-author the focus-trap/dismiss
> machinery glass-ui's `SheetContent`/reka `DialogContent` already provides.

---

### A7 — MED — sheet vs bottom-menubar pointer overlap is asserted as a verification clause but the menubar is a `GlassDock` with its own collapse timer; the keep-open mutex is unspecified (H.W7 §S3, §Folds)

**Doc location:** `H.W7.md:33 (S3: "The bottom sheet must NOT steal pointer events from the
bottom menubar's GlassDock")`, `:42 (proof:dock-zorder)`;
`a-mobile-architecture.md:251-253`.

**The defect:** S3 verifies the sheet does not steal the menubar's pointer events (z-order +
hit-test). But there is a deeper interaction: the bottom `AnimationMenuBar` IS a `GlassDock`
with a timer-based collapse (the dock collapses when not held; the very `collapse-delay`
H.W8 tunes). When the bottom SHEET is open ABOVE the menubar, the dock's collapse timer can
fire and collapse the menubar OUT from under the sheet, shifting `--work-area-bottom-offset`
/ `--dock-band-reserve` and yanking the sheet's anchor. glass-ui 3.4.0 exposes exactly the
mutex for this: `useOptionalDockContext().keepOpen()/release()` (verified in
`dockContext.d.ts` — `keepOpen`/`release`/`held` on `DockContext`). The popover wave
(`_SYNTHESIS-frontend-mobile §H-FE-4`, D9) already uses this pattern. H.W7's sheet should
acquire a dock keep-open token while the sheet is open, mirroring D9 — but S3 only checks
pointer-event stealing, not the collapse-timer interaction.

**Why MED:** a real interaction, glass-ui-consumable (no handoff), but only bites once the
sheet anchors above a live collapsing dock.

**Concrete doc edit (H.W7 §S3, extend):**

> Extend S3: while the sheet is open, acquire a dock keep-open token on the bottom menubar's
> `GlassDock` via `useOptionalDockContext().keepOpen()` and `release()` on close (the exact
> mutex D9's popover uses — verified `keepOpen`/`release` on `DockContext`,
> `dockContext.d.ts`), so the menubar's collapse timer cannot collapse the dock out from
> under the open sheet and shift `--work-area-bottom-offset`/`--dock-band-reserve` (the
> sheet's anchor). Add a clause to `proof:dock-zorder`: with the sheet open, the menubar
> stays expanded past its `collapse-delay` (no anchor shift while the sheet is open).

---

### A8 — LOW — "the sheet's open/closed transform is the ONLY mobile-specific delta" overstates the isomorphism (H.W7 §S1, §Design decisions)

**Doc location:** `H.W7.md:29 (S1)`, `:60 ("Overlay, not a shorter stack")`, `:66 (F1+F2 are
ONE rebuild)`.

**The defect:** the wave repeatedly frames mobile as desktop's overlay model with "the
sheet's open/closed transform [as] the ONLY mobile-specific delta." But the deltas are
several: (1) desktop pane slides from the LEFT (`ControlsPaneWrapper.vue:188-200`
`translateX(-110%) rotate(-2deg)`), mobile from the BOTTOM (translateY); (2) desktop has no
detents/handle, mobile needs both (A4); (3) desktop has no gesture conflict (mouse, no
`touch-action`), mobile does (A1); (4) the amiga clear-color delta (A3). Calling it "the
ONLY delta" undersells the work and risks a reviewer treating the mobile sheet as a trivial
re-parameterization when it has its own gesture + detent + dismiss machinery. Per the spine's
"NAMED, befitting delta" rule, the mobile deltas should be enumerated, not collapsed to one.

**Concrete doc edit (H.W7 §Design decisions, amend the "F1+F2 are ONE rebuild" decision):**

> Enumerate the mobile-specific deltas honestly: (i) sheet slides from the bottom (translateY)
> vs desktop's left slide; (ii) peek/expanded detents + a grab handle (desktop has neither);
> (iii) gesture arbitration handle-vs-stage (A1); (iv) the amiga clear-color background delta
> (A3). These are the named, befitting mobile deltas on the shared `rail·stage·rail` grid —
> the grid + `--rail-width` authority is shared; the sheet's bottom-anchored, detented,
> handle-driven, gesture-arbitrated behavior is the mobile layer.

---

### A9 — NIT — H.W7 declares independence from H.W1 but the live route storm makes the mobile gates un-authorable (H.W7 §Design decisions "Sequenced after H.W3, independent of H.W1")

**Doc location:** `H.W7.md:67 ("It has no dependency on the FSM (H.W1)…")`.

**The defect:** H.W7 claims no H.W1 dependency. But (a) A5 shows the open-pane state — the
state every `proof:mobile-single-page` clause measures — is flaky to reach live BECAUSE of
the route storm (I observed `/#/cube` rendering "Easing" labels; the pane state reset on
reload). `_SYNTHESIS-frontend-mobile §4` is explicit: "H-FE-0 (D12 state machine) gates ALL
visual locks (route must hold)." H.W7's mobile gates ARE visual locks at a specific route
(`/#/cube` at 390×844). So H.W7's GATES depend on H.W1 even if its CODE does not. The "no
dependency on the FSM" claim is true for the rebuild but false for the gates — a small but
real inconsistency with the synthesis's own sequencing spine.

**Concrete doc edit (H.W7 §Design decisions, amend the sequencing decision):**

> Amend: H.W7's CODE re-parameterizes H.W3's grid and is independent of H.W1; but H.W7's
> GATES (`proof:mobile-single-page` at `/#/cube` 390×844) are visual locks that — per
> `_SYNTHESIS-frontend-mobile §4` ("H-FE-0 gates all visual locks; route must hold") — cannot
> be authored or run deterministically until H.W1's FSM holds the route + the open-pane
> state. Sequence the gate authoring after H.W1; the rebuild itself may proceed after H.W3.

---

## B. THE DELIVERABLE — concrete mobile layout per mode-class (390×844)

The charge asks for the per-mode-class layout. Three classes (verified from the scene
components), one shared frame:

**Shared frame (all classes):** top `ChromeDock` (affixed, ALREADY-SOTA) · `[stage]`
full-bleed `fixed; inset:0` honoring `--work-area-top-offset`/`--dock-band-reserve` ·
bottom `AnimationMenuBar` `GlassDock` (affixed) · a bottom SHEET with a **grab handle** +
**peek/expanded detents**, `SpringProgress`-driven (`useSheetSpring`), acquiring a dock
keep-open token while open. Gesture arbitration: the HANDLE owns the sheet swipe; the
EXPOSED stage owns the orbit.

| Mode-class | Scenes | Stage (full-bleed bg) | Sheet default detent | Sheet content | Gesture model |
|---|---|---|---|---|---|
| **Subject-as-background** | cube, amiga, square | the 3D subject, centered in the dock-free band; cube via CSS-3D, amiga via WebGL (clear-color themed → transparent, A3), square via transform | **peek** (handle + transport; stage ≥60% visible) | per-animation controls + keyframes + ribbon (scroll body) | handle = sheet swipe; exposed stage = OrbitalDrag (cube) / OrbitControls (amiga); the two are spatially disjoint (A1) |
| **Editor-as-content** | easing | the curve editor PROMOTED to stage (H.W5 reconciliation, A2) — `EasingCurveCanvas` full-bleed, draggable handles | **expanded** (the scrubber/preview + view-mode select) | scrubber preview + view-mode + easing tabs | the CURVE handles own drag on the stage; the sheet's handle owns the sheet; no cube-style `touch-action:none` conflict here since the canvas owns its own pointer handlers — verify they coexist with the sheet handle |
| **Storyboard** | sequence, motion-path, starting-style | the traveller/sequence/discrete subject, full-bleed | **collapsed/peek** (transport only — these set `isControlsPanelOpen=false`) | transport + (motion-path: drag-the-traveller per H.W5) | sheet handle owns swipe; motion-path traveller drag (H.W5 `ManualTimeline`) on the exposed stage |

**Key cross-wave reconciliations this layout forces (and the audit currently misses):**
- easing: H.W7 (controls→sheet) and H.W5 (curve→stage) MUST agree the curve lives on the
  STAGE on mobile, not the sheet (A2).
- amiga: clear-color must be themed/transparent before full-bleed promotion, and the
  full-bleed dpr surface feeds H.W5's perf budget (A3).
- every subject-class scene needs the handle-vs-stage gesture split (A1), so S1 must declare
  a sheet handle (not a stage-swipe) as the sheet's open/close affordance.

---

## C. WHAT IS SOUND (honest — no manufactured findings)

- **The stack→overlay transposition is the correct gestalt.** The mobile grid genuinely
  cannot make the stage a background (the `auto` row1 starves the `1fr` row2 — verified the
  audit's mechanism in `style.css:202-208` and `AnimationControlsGroup.vue:5`). Overlay is
  right.
- **The `SpringProgress`/`useSheetSpring` dogfood is real and feasible.** `useSceneSwap.ts:45`
  + `StartingStyleTarget.vue:94` are genuine in-tree precedents; `spring.ts`
  `respectReducedMotion` exists; the snappy preset vocabulary (`--spring-snappy`/
  `--spring-smooth`) is real (`style.css:147`). F2 is correct.
- **The affixed-dock ALREADY-SOTA claim is honest.** Both docks are `position:fixed` honoring
  `--work-area-*-offset` with `@supports not (dvh)` fallbacks; the cycle-free token chain
  (`style.css:96-131`) is real and exemplary. F3's "verify z-order only, do not touch" is
  the right posture.
- **The `--rail-width` re-use (sheet width = rail track) is sound** given H.W3 lands first.
- **The 30px eviction defect itself is real** (reproduced the mechanism live; the open-pane
  state evicts the stage). The wave is fixing a genuine defect.

The defects above are about HOW the fix is specified (gesture arbitration, mode-class
uniformity, amiga background, detents, gate calibration), not whether the rebuild is
warranted. It is.

---

## D. SEVERITY ROLL-UP

| ID | Sev | One-line | Fix location |
|---|---|---|---|
| A1 | **BLOCKER** | gesture conflict: cube `touch-action:none`+`setPointerCapture` swallows the sheet swipe; F4 "free win" is a collision | H.W7 §Design decisions + §S1 (dedicated handle, disjoint gesture surfaces) |
| A2 | HIGH | "animation as background" is mode-class-dependent; wrong for easing (curve = content); contradicts H.W5 | H.W7 §Design decisions + §S1 (3 mode-classes; reconcile with H.W5) |
| A3 | HIGH | amiga full-bleed = opaque white WebGL clear (kills grid bg/dark mode) + dpr blow-up; 2nd touch landlord | H.W7 §Folds RECORD + cross-ref H.W5 perf budget |
| A4 | HIGH | no detent/dismiss model; naive tall sheet re-creates the 30px eviction; gate passes vacuously | H.W7 §S1 (peek/expanded detents) + §Hard gate (visible-fraction) |
| A5 | MED | gate (a) mis-calibrated vs live closed-pane baseline (stage already 0.88 viewport closed) | H.W7 §Hard gate (force open-state precondition) |
| A6 | MED | glass-ui 3.4.0 ships `<SheetContent spring>`; "BOOK" claim inaccurate; name the dogfood non-consumption | H.W7 §S1 + §Folds glass-ui-HANDOFF |
| A7 | MED | sheet-over-`GlassDock`-menubar needs `keepOpen`/`release` mutex; S3 only checks pointer steal | H.W7 §S3 (extend) |
| A8 | LOW | "ONLY mobile delta" overstates isomorphism; enumerate the named deltas | H.W7 §Design decisions |
| A9 | NIT | "independent of H.W1" true for code, false for gates (route storm) | H.W7 §Design decisions (sequencing) |

**Cross-repo reality checks performed:** glass-ui 3.4.0 `DockContext.keepOpen/release/held`
EXISTS (`dockContext.d.ts`); `<SheetContent spring?: boolean | SpringPreset>` EXISTS
(`sheet.d.ts`, `SheetContent.vue.d.ts`); both load-bearing for A6/A7. No wave assumes a
non-existent API — the inv-16 consume-vs-author posture is the issue, not a missing surface.
