# I.W4 — THE DRAG + PERF TRANSPOSITION (Band 2 · one drag seam owns "gesture-in-flight" · one composed frame driver)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (HIGH; B6 the
  `/square` drag highlights chrome text + does not persist — appearance + interaction + state,
  zero console, source-shape GREEN; B8 ALL dock animations "supremely broken, slow, errored" —
  a composite of four mechanisms, three kf-owned + one B1-bleed.) · **Perf thresholds BOUND
  (H-5):** the §Hard gate runs under a NAMED **4× CPU throttle** with CONCRETE ceilings —
  **dock-expand `dropped ≤ 2`** (HEAD drops 12/114, p95 25 ms, max 49 ms) and **easing-play
  `dropped ≤ 3`** (HEAD drops 36 / ~46 fps, 62 under 4×) — born-RED REQUIRES HEAD to fail the
  number, GREEN is the cube-parity ≈ 0 dropped at 60 fps (`b16 §1`/`§3`). No symbolic N. ·
  **Scope (demo + glass-ui
  consume-edge; NO kf-side glass-ui patch):** `demo/@/composables/useDragScrub.ts` +
  `demo/@/components/.../composables/useDragCapture.ts` (lift a GLOBAL select-suppression token
  + a `releasePolicy`) + `demo/app/scenes/SquareScene.vue` + `demo/square/useSquareAnimations.ts`
  (migrate the hand-rolled `window`-drag onto the seam; `settle()` not `reseat(0,0)`) +
  `demo/easing/useEasingDemo.ts` (the per-rAF Vue render storm → non-reactive write + one
  composed driver) + the glass-ui pin/dock `transition` posture (consume-edge, coupled to
  **I.W6**). · **DAG-deps:** after **I.W0** (the B1 console bleed is the "errored" half — it
  dies when I.W0 lands, NO dock change). The dock width-morph / `transition: all` retune is
  glass-ui-owned and rides the SAME v3.8.0 cut as the specular default-off → COUPLED to I.W6.
  RC-2 (amiga WebGL `content-visibility`) shares the "right occlusion primitive" principle with
  this wave (I.W3 owns the amiga locus).

## §Provenance (the folded root cause + investigation)

- `rootcause-rc-drag-perf.md` — the TWO confirmed root causes and their single shared seam:
  - **B6-a text-select:** NO global select-suppression on drag-start. `SquareScene.vue:2`
    scopes `select-none` to `.square-stage`; the drag listens at `window` (`:94`) and the
    pointer legitimately sweeps the chrome (dock + control labels), which stay
    `user-select:auto`. The CSS audit (`b6-square-drag.mjs`) proves it structurally:
    `html=auto · body=auto · dock=auto · controls=auto` for the WHOLE gesture; 18/18 chrome
    text elements `user-select:auto`. (The synthetic Playwright drag read 0 selected chars — an
    artifact of `setPointerCapture` routing the pointer stream away from the document
    text-select machinery; the CSS audit is the decisive proof.)
  - **B6-b non-persist:** `SquareScene.vue:99-107` `pointerup → reseat(0,0)` (`:104`) hard-codes
    spring-home-on-release. `reseat(nx,ny)` (`useSquareAnimations.ts:162-166`) sets
    `springX/Y.target`; `reseat(0,0)` drives both springs to 0 — the box springs back to centre.
    The composable has NO "settle in place" mode. The `Home`/`End` key → `reseat(0,0)` (`:118-124`)
    already gives an explicit recenter, so removing the implicit recenter-on-release loses no
    capability.
  - **The single shared seam:** the per-scene hand-rolled `window`-drag in `SquareScene.vue` is
    the ONLY one in the scenes (the lone `window, "pointermove"` in `demo/app/scenes/**`), and it
    bypasses the shared `useDragScrub` composable entirely. There is NO seam in the codebase
    that owns "a drag is in flight" — so neither global select-suppression nor a persist/recenter
    policy has any home. That absence is the root cause behind BOTH B6 defects. The class is
    LATENT across every drag surface: `useDragScrub.ts` and `useDragCapture.ts` BOTH lack any
    global select-suppression (read in full).
- `rootcause-rc-drag-perf.md §2` — B8 "supremely broken, slow, errored" is a composite of FOUR
  mechanisms:
  - **2a the dock width-morph (the primary measured dock hitch):** `dock.css:512`
    `transition: width …` on the SAME element carrying `backdrop-filter: var(--dock-surface-blur)`
    (`:90`). Animating an intrinsic-size property forces LAYOUT → backdrop re-blur → composite
    EVERY frame → 12/114 dropped on expand (b16 §3: p95 25ms, max 49ms). The contradiction that
    IS the finding: the JS `SpringProgress` FLIP short-circuits to a near-no-op (`b8-spring-engine-dump.json`:
    `springEngineEngaged:false, widthWriteCount:0` — the dock is `fit-content` + `start-collapsed`,
    sub-pixel width delta, the engine bails) leaving the CSS `transition: width` + backdrop
    re-blur as the sole, layout-bound animator. The slowness is in the CSS compositor path, NOT
    the keyframes.js engine.
  - **2b the `/easing` per-rAF Vue render storm (the dominant felt "slow"):**
    `useEasingDemo.ts:153-161` writes `progress.value = sweep.at(phase).p` EVERY frame; `progress`
    is a Vue `ref` with multiple reactive consumers → a full re-render of 31 `<path>` + 22 `<svg>`
    (243 nodes) per frame. Measured: playing = 21.6ms / 36 dropped (~46fps); paused = 8.3ms / 0
    dropped; under 4× CPU throttle easing = 23.8ms / 62 dropped vs cube 8.3ms / 0. The dock
    shares the screen with it → "the dock is slow."
  - **2c stacked rAF loops:** `/easing` runs 4 concurrent rAF loops/frame, `/amiga` 6 — each
    concern spins its own rAF and they stack onto the hot frame, where the engine already ships
    `RAFPlayback` as THE single managed driver, under-used by the demo's per-scene loop stacking.
  - **2d the "errored" half is B1 bleed:** `[error] Err x 0 …` + `[warning] [KeyframesString] …
    "......"` on every probe, on cube mount, triggered by NO dock action (`b8 §H1`,
    `b8-spring-engine-dump.json › consoleErr`). NO dock-originated `pageerror` on any run.
- `b16-perf-profile.md` — the measured budgets (the source of the throttle numbers + the
  backdrop-surface census: 30 `backdrop-filter` surfaces on cube). `recap-chronic CH-4` — the
  D5 dock SPRING is genuinely CLOSED (120fps clean, gated, honest); the "broken dock" the user
  MEANS is B1 + M3 (`transition: all`) + RC-2.

## §The state, verified (file:line / live anchors)

- **B6-a:** `SquareScene.vue:2` (`select-none` on `.square-stage` only); `:89`
  (`setPointerCapture` captures the pointer STREAM only); `:94-97` (`useEventListener(window,
  "pointermove", …)` — window scope, cursor travels over all chrome); NO `document`/`body`/`<html>`
  `user-select:none` for the gesture duration. Source-wide grep: the only `user-select:none`
  declarations are scoped surface-local guards (`EasingCurveCanvas.vue:370`, `OrbitalDrag.vue:331`,
  `ControlsPaneWrapper.vue:304-305`) — ZERO global gesture-scoped toggle.
- **B6-b:** `SquareScene.vue:99-107` (`pointerup` → `dragging=false; reseat(0,0); springReadout
  = "0.00"`). The b6 probe: `heldAtDragEnd = translate(-110px, 88.4px) … scale(1.12)` →
  `after700ms = translate(0,0) … scale(1)` (springs back to centre).
- **B8-2a:** `dock.css:90` (`backdrop-filter: var(--dock-surface-blur)`); `:512`
  (`transition: width var(--dock-motion-resize)`); `:305-309`/`:338-341` (the
  padding/transform/background transitions). b16 §3: dock expand = 12/114 dropped, p95 25ms,
  max 49ms while the rest of the route holds a clean 8.3ms.
- **B8-2b:** `useEasingDemo.ts:153-161` (per-rAF `progress.value` write); the 243-node SVG
  re-render; `watch(progress)` → `contractAnim.t` (`:394`).
- **B8-2c:** `useAnimationSync.ts:40-70`, `useTimelineBuild.ts:71` — the stacked polls;
  `src/animation/playback.ts:61` `RAFPlayback` — the single managed driver under-used.
- **The target shape ALREADY in the tree:** `useSquareAnimations.ts` runs ONE `RAFPlayback` loop
  that ticks all springs and writes `style.transform` DIRECTLY, NO per-frame Vue write — the
  easing scene should adopt the same discipline.

## §Goal

A drag on ANY scene surface does not highlight the chrome it sweeps and PERSISTS where released
(the spring still chases-to-rest at the dragged target, so the lively feel is preserved); and
the dock + the `/easing` preview hold a clean frame budget under load (no 49ms dock-expand
hitch, no 46fps easing storm). The cure is STRUCTURAL: give the shared drag composable the
single authority over "a gesture is in flight" (so global select-suppression + a persist policy
have ONE home, inherited by every drag surface), drive the hot positional update OFF the Vue
render graph, collapse the stacked rAF loops to ONE composed driver per scene, and move the dock
morph off the layout path (glass-ui consume-edge). No patch, no workaround, no legacy.

## §Scope

- **D1 — fold the square drag into the shared `useDragScrub` seam, and make THAT seam own a
  global "gesture-in-flight" body token (closes B6-a for ALL drags, the gestalt).** Locus:
  `useDragScrub.ts` (+ `useDragCapture.ts`) + `SquareScene.vue` + `useSquareAnimations.ts`.
  1. **Lift global select-suppression into the shared composable.** On `onPointerDown` set a
     single document-level token (toggle a `body.is-dragging` class whose rule is
     `* { user-select: none }`, OR set `document.documentElement.style.userSelect = "none"`);
     clear it on `pointerup`/`pointercancel`. vueuse already owns the listener lifecycle and the
     `dragging` ref exists (`useDragScrub.ts:56,81`) — ONE place, inherited by EVERY drag surface
     (square, spring rail, sequence scrub, motion-path). Closes the latent class, not just square.
  2. **Migrate `SquareScene`'s hand-rolled `window`-drag onto `useDragScrub`.** Its `project(e)`
     is exactly the `reseatFromEvent` math (`SquareScene.vue:77-83`); its `onScrub` is
     `reseat(nx,ny)`. This removes the lone bespoke `window` drag (the one
     `proof:dragscrub-single` permits-but-does-not-inspect) and subsumes it under the seam that
     now owns select-suppression. **Caveat for IMPL:** square is 2-axis (`{x,y}`) and the
     home-centre is captured per-gesture (`captureFrame` at `:67-75`); `useDragScrub`'s `project`
     is generic `<T>`, so `T={nx,ny}` fits — but if generic `project` does not cleanly carry the
     per-gesture `captureFrame`, the seam grows a typed `onStart` capture hook (already present:
     `onStart?(e)` at `:39/67`). The gesture engine lands IN the composable (honors
     `proof:composable-encapsulation`). **WHY:** there is no seam that knows "a drag is live," so
     global select-suppression has nowhere to live — give the shared composable that single
     authority.

- **D2 — persistence is a POLICY on the drag seam, not a hard-coded home (closes B6-b).** Locus:
  `SquareScene.vue:104` + `useSquareAnimations.ts`. `pointerup` must NOT call `reseat(0,0)`.
  `useSquareAnimations` exposes a `settle()` verb (OR `reseat` gains a `persist` mode) that
  leaves the spring TARGETS at their last dragged value — the spring still chases-to-rest at
  THAT target, so the lively spring feel is preserved while the box stays where released. The
  explicit `Home`/`End` recenter (`:118`) remains the deliberate "return home" affordance. Stated
  as a seam concept: the shared drag composable carries a `releasePolicy: "persist" | "recenter"`
  so this is a DECLARED choice, not a buried `reseat(0,0)`. **WHY:** spring/MotionPath already
  PERSIST on release — square is the outlier hard-coding recenter; D2 brings square into line
  with the rest of the rail scenes (the gestalt-consistency win).

- **D3 — the dock must not animate an intrinsic-size property under a backdrop-filter (closes the
  measured dock hitch; glass-ui consume-edge, COUPLED to I.W6).** Locus: `dock.css:512`
  (`transition: width`) on a `backdrop-filter` element (`:90`) — GLASS-UI-OWNED. The
  transpositions, in preference order:
  - **D3-a (preferred, glass-ui-owned):** the morph is driven by a COMPOSITOR-ONLY transform
    (`transform: scaleX()` / clip-path / a FLIP where the steady frames are `transform`, not
    `width`), so no per-frame layout + no per-frame backdrop re-sample. This is glass-ui's
    `useLayerTransition` province — the kf `SpringProgress` FLIP path is the RIGHT mechanism but
    it short-circuits on the sub-0.5px `fit-content` width delta. The architectural call: give
    the dock layout a real width delta to drive (so the engine FLIP actually composes transforms)
    OR drive the reveal off transform/clip rather than `width`. **inv-16: the engine is NOT
    fenced** — if the FLIP needs the `SpringProgress` consume-edge re-shaped, that is in-bounds.
  - **D3-b (glass-ui version re-pin, B7-adjacent):** kf pins `~3.5.1`; the dock-perf fix may ride
    the glass-ui v3.8.0 cut (which carries "the AX dock+...+spring cut"). This is a glass-ui
    consume-edge re-pin, NOT a kf patch/fork (honors "all glass-ui changes go in glass-ui"). The
    wave must verify whether v3.8.0's dock already moves width off the layout path before bumping.
    **COUPLED to I.W6:** the same v3.8.0 publish carries BOTH the specular default-off (B7) and
    the dock-spring/transition retune (M3) — one publish, two wins; sequence the pin bump as a
    single measured motion in I.W6. **WHY:** `width` is intrinsic-size; transitioning it under a
    backdrop-filter is the textbook "animating layout under a backdrop-filter" cost.

- **D4 — one composed frame driver per scene; drive the hot positional update OFF the Vue render
  graph (closes 2b + 2c, the dominant felt "slow").** Locus: `useEasingDemo.ts:153-161` + the
  stacked polls. `/easing` must NOT write a reactive `ref` per frame to move a dot. Drive the
  sweep dot via a DIRECT, non-reactive `style.transform` write on the dot element inside the rAF
  callback (reactivity is the wrong tool for a 60Hz positional update), and write `progress`
  reactively at most a few Hz for the readouts. Collapse the 4-6 stacked rAF loops to ONE
  composed driver per scene by leaning on the engine's existing `RAFPlayback`
  (`src/animation/playback.ts:61`) — the single managed driver the demo already ships but
  under-uses. **WHY:** this is the largest measured win (46fps → 60fps on easing) and an
  architectural-simplicity win (one tick per scene). Square already models the target shape (one
  `RAFPlayback` loop, direct `style.transform`, no per-frame Vue write) — the easing scene adopts
  the same discipline. (Couples to I.W1's `useRafScene` consolidation — the composed driver and
  the bound visibility-pause should be the same composable seam where they overlap.)

- **D5 — the "errored" half folds into B1 (no dock change).** The dock console errors are B1
  bleed (2d). NO dock-source change closes them — they die when I.W0's S1+S2 land. Cross-ref
  I.W0. **WHY:** the user reads "the dock is errored" because the console is full of B1 errors
  while the dock is on screen; the dock itself emits no `pageerror`.

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/INTERACTION)

**Gate-ORACLE precept (CHARTER INVARIANT, mechanically prior — NOT asserted backward).** Both
this wave's gates are RUNTIME/INTERACTION gates by construction: every correctness clause DRIVES
the running product through the human's surface (a real `page.mouse` drag, a hover/click on the
dock, a PLAY on the easing preview) and asserts a FELT product property under an error budget.
This wave's §Hard gate therefore SATISFIES the I.W7 `proof:gate-is-runtime` meta-gate (which FAILS
any wave whose §Hard gate is not interaction-driven) — the precept is enforced by machine, not by
authorial fiat. The perf-budget clauses additionally INHERIT the I.W7 structured error-budget
allowlist (H-2: `console.error`/`pageerror`/`unhandledrejection`/`"......"` = 0, hard) as the
zero-error floor underneath the dropped-frame ceiling.

**`proof:drag-gesture`** + **`proof:perf-frame-budget`** — a Playwright session over the BUILT
`dist/gh-pages/` (the `proof-no-orphan-specular.mjs` harness):

- **clause (a) — a real drag over a chrome label selects no text (B6-a).** Drive a REAL pointer
  drag (CDP/`page.mouse.down → move → up` over the document, NOT a synthetic `dispatchEvent` +
  `setPointerCapture` drag) starting on the square box and SWEEPING the pointer across a
  dock/control label, then assert `window.getSelection().toString()` is EMPTY (zero selected
  chars). **The born-RED witness is dual, because the synthetic-drag artifact would false-green
  a naive gate:** (i) the PRIMARY runtime assertion — a real `page.mouse` drag over a chrome
  label leaves a non-empty `getSelection()` on HEAD; (ii) the STRUCTURAL corroborator (the
  decisive proof per `rc-drag-perf §1a` / `b6-square-drag.mjs`) — `getComputedStyle(html/body/
  dock/controls).userSelect === "auto"` for the WHOLE gesture (18/18 chrome text elements
  `user-select:auto`), which is WHY the live drag highlights. The gate must use the real
  `page.mouse` path so the live selection actually accrues; if `setPointerCapture` routes the
  pointer stream away from the document text-select machinery (the synthetic-drag artifact that
  read 0 chars), the gate FALLS BACK to assertion (ii) as the born-RED-of-record — never passes
  on a synthetic 0-char read. Run against EVERY drag surface (square, spring rail, sequence,
  motion-path) — the seam owns it, so the gate covers it. **BITE:** reds TODAY (real drag selects
  chrome text AND `userSelect:auto` everywhere — `b6-square-drag.mjs`); greens on D1 (the global
  `is-dragging` token sets `* { user-select: none }` for the gesture → both assertions go empty).
- **clause (b) — the dragged element PERSISTS after settle (B6-b).** Drag the square box to a
  measured non-centre offset, release, wait for the spring to settle (the `settle()` chase-to-rest
  completes — poll until the transform stops changing or a ≥ 700 ms bound), assert its
  `transform` ≠ identity (it stayed where released, NOT recentred). **BITE:** reds TODAY —
  `pointerup → reseat(0,0)` (`SquareScene.vue:104`) springs it back to centre (the b6 probe:
  held `translate(-110px, 88.4px) scale(1.12)` → after 700 ms `translate(0,0) scale(1)`); greens
  on D2 (`releasePolicy: persist` / `settle()` leaves the spring TARGETS at the dragged value, so
  the box chases-to-rest THERE). The explicit `Home`/`End` recenter remains the deliberate
  return-home affordance — assert it still recentres (no capability lost).
- **clause (c) — the dock expand holds a frame budget under the NAMED 4× CPU throttle (B8-2a/D3).**
  Under a CDP CPU throttle of **4×** (`Emulation.setCPUThrottlingRate {rate:4}` — the same
  device-class proxy the b16 floor was measured against, `b16 §0`), hover/CLICK the dock to expand
  and sample rAF intervals over the expand window → assert **dropped frames ≤ 2** (a 60 fps frame
  is missed when an interval > 24 ms — clock-invariant per the b16 headless caveat). **The
  born-RED number, bound from `b16 §3`:** the CURRENT HEAD MUST FAIL — the unthrottled dock expand
  already drops **12 / 114** with **p95 25 ms, max 49 ms** on the otherwise-idle cube route; under
  the 4× throttle (which only worsens a layout-bound CSS transition + per-frame backdrop re-sample)
  it cannot meet a ≤ 2 ceiling. **GREEN requires ≈ 0 dropped at 60 fps** once D3 moves the morph
  off the layout path (compositor-only transform/clip-driven, OR the glass-ui v3.8.0 re-pin); the
  gate PASSES at `dropped ≤ 2` (a 2-frame slack for first-paint/JIT jitter, NOT the 12 it drops
  today). **No symbolic N — the threshold is the concrete `≤ 2` ceiling; the born-RED witness is
  the measured 12.** **Supersedes** the token-peak `proof:dock-morph-settled` (a `--spring-dock`
  ramp number on a fast headless machine cannot witness a 49 ms expand frame —
  `rc-gate-blindspot §2.5`); the token gate is RETIRED, not kept beside it.
- **clause (d) — the `/easing` preview holds a frame budget under the NAMED 4× CPU throttle
  (B8-2b/D4).** Under the **4×** CDP throttle, switch to `/easing`, PLAY the preview, sample rAF
  over a ≥ 70-frame window → assert **dropped frames ≤ 3** (target ≈ 60 fps; intervals > 24 ms are
  a missed frame). **The born-RED number, bound from `b16 §1`:** the CURRENT HEAD MUST FAIL — easing
  PLAYING measures **21.6 ms / 36 dropped (~46 fps)** at the headless clock and **23.8 ms / 62
  dropped under the 4× throttle**, vs cube **8.3 ms / 0 dropped** on the identical throttle. 62
  dropped under 4× cannot meet a ≤ 3 ceiling. **GREEN requires ≈ 0 dropped at 60 fps** (the cube
  parity number — cube holds 8.3 ms / 0 dropped under the same 4×, `b16 §1`) once D4 lands the
  non-reactive
  `style.transform` write + one composed `RAFPlayback` driver. **No symbolic N — the threshold is
  the concrete `≤ 3` ceiling; the born-RED witness is the measured 62-under-4× (36 unthrottled).**
  This is the gate that would have failed H's 46 fps easing RED.
- **clause (e) — backdrop-surface budget (HYGIENE tier · NON-LOAD-BEARING · on-device flag):**
  count live `backdrop-filter` surfaces per route (30 on cube — b16 §6) and assert a ceiling;
  FLAG the on-device GPU/Retina re-measure that headless masks. *(Labeled HYGIENE per the
  two-tier taxonomy CHARTER INVARIANT — a count, not a felt budget; it FLAGS, it does not gate.
  The wave's GREEN depends on the RUNTIME clauses (a)–(d) ALONE; clause (e) may NEVER substitute
  for a red runtime clause nor count toward correctness, and its flag failing does NOT red the
  wave. The felt budget is clauses (c)/(d).)*

**Two-tier discipline (H-4, the CHARTER INVARIANT applied to THIS wave's NEW gates).** Per the
two-tier taxonomy every wave inherits: the wave is GREEN iff clauses (a), (b), (c), (d) — the
RUNTIME/INTERACTION clauses — all bite born-RED and turn green on the fix. Clause (e) is strictly
a HYGIENE corroborator (a backdrop-surface count + an on-device re-measure FLAG); it carries NO
correctness authority and cannot hold the wave's green hostage. There is NO source-shape escape
hatch in any correctness clause — clauses (a)/(b)/(c)/(d) assert a FELT product property (selected
text, persisted transform, dropped-frame ceiling under the named throttle), not a code shape.

**The §spine bar — MUST bite.** Clauses (a)/(b) DRIVE a real pointer drag over a chrome label and
assert `getSelection()` empty + transform-persists-after-settle; clauses (c)/(d) apply the NAMED
**4× CDP CPU throttle**, hover/CLICK the dock / PLAY the preview, and sample rAF intervals →
assert **dock dropped ≤ 2** and **easing dropped ≤ 3** (concrete ceilings, NOT a symbolic N — bound
from `b16 §1`/`§3`: born-RED REQUIRES HEAD's measured 12-dropped dock expand and 36-dropped/62-under-4×
easing to FAIL the ceiling; GREEN requires ≈ 0 dropped at 60 fps, the cube-parity number). These
are the gates that would have failed H's 46 fps easing and 49 ms dock expand RED — superseding the
`proof:dragscrub-single` count (it counted drag blocks, never DROVE a drag) and the
`proof:dock-morph-settled` token (it read a ramp peak, never the live morph). RED on `b934a08`
(the chrome highlights, the box recenters, the dock drops 12 frames, easing runs 46 fps), GREEN
only when the seam owns select-suppression + persist, the hot write leaves the Vue graph, and the
dock morph leaves the layout path. These gates are CLAUSES of the I.W7 `proof:live-session`
battery (the drag + perf legs); the perf-budget clauses INHERIT the I.W7 structured error-budget
allowlist (the `console.error`/`pageerror`/`"......"` hard-zeros) AS A CHARTER INVARIANT, and add
their own dropped-frame ceiling ON TOP — the budget is one definition (I.W7), the frame ceiling
is this wave's measured leg.

## §Folds

- **B6-a** (drag selects chrome text) — D1 (global `is-dragging` token in the shared seam).
- **B6-b** (drag does not persist) — D2 (`releasePolicy: persist` / `settle()`).
- **B8-slow-dock** (the dock width-morph hitch) — D3 (transform/clip morph OR glass-ui v3.8.0
  re-pin, COUPLED to I.W6).
- **B8-slow-easing + B8-slow-stack** (the per-rAF render storm + stacked loops) — D4 (non-reactive
  write + one composed `RAFPlayback` driver; couples to I.W1's `useRafScene`).
- **B8-errored** (the dock console flood) — D5: folds into B1 (I.W0). No dock change.
- **RC-2 / amiga `content-visibility`** (the WebGL GPU stall) — shares the "right occlusion
  primitive over live-painting surfaces" principle; the amiga locus is owned by I.W3.
- **glass-ui-HANDOFF (D3-b):** the dock `transition: width`/`transition: all` retune is
  glass-ui-owned and rides the v3.8.0 cut (I.W6). kf consumes via the bump, never patches the
  dock in kf (honors `feedback_glass_ui_root_changes`). PAIRED with the born-RED
  `proof:perf-frame-budget` clause (c) that REDs while the consumed dock animates layout.

## §Design decisions (trade-offs RESOLVED)

- **One drag seam owns "gesture-in-flight" — RESOLVED.** The absence of a seam that knows "a drag
  is live" is the root cause behind BOTH B6 defects. Lifting global select-suppression AND the
  persist policy into the shared composable (D1+D2) gives both a single home, inherited by every
  drag surface — the gestalt single-seam, not a per-scene `user-select:none` sprinkle.
- **`settle()` over `reseat(0,0)` — RESOLVED.** The hard-coded recenter discards the drag BY
  DESIGN. The spring should chase-to-rest at the dragged TARGET (persist), preserving the lively
  feel while honoring the user's "stay where released." The explicit `Home`/`End` recenter
  remains — no capability is lost. Square joins spring/MotionPath, which already persist.
- **The dock perf is glass-ui-owned; kf does not patch it — RESOLVED.** `transition: width`
  under `backdrop-filter` is glass-ui's `dock.css`. The fix is glass-ui-side (transform/clip
  morph) consumed via the v3.8.0 bump (D3-b, I.W6), NOT a kf-side `dock.css` override (which would
  violate `feedback_glass_ui_root_changes`). The kf-side engine work (D3-a: give the FLIP a real
  width delta to drive, if the engine consume-edge needs re-shaping) is in-bounds per inv-16 — but
  the CSS `transition` declaration is glass-ui's.
- **Non-reactive `style.transform` write for the hot path — RESOLVED.** Reactivity is the wrong
  tool for a 60Hz positional update — a per-frame `ref` write re-renders 243 SVG nodes. The dot
  moves via a direct `style.transform` write inside the rAF callback; `progress` writes
  reactively at a few Hz for the readouts only. Square already models this; easing adopts it. The
  largest measured win.
- **One composed driver per scene — RESOLVED.** 4-6 stacked rAF loops per scene are an
  architectural smell; the engine already ships `RAFPlayback` as the single managed driver. One
  tick per scene is the KISS/perf win. Couples to I.W1's `useRafScene` (the composed driver + the
  bound visibility-pause are the same composable seam where they overlap).
- **The dropped-frame thresholds + throttle factor are BOUND from `b16`, not symbolic (H-5) —
  RESOLVED.** A gate with an unbound `N` cannot be born-RED (you can't prove HEAD fails without a
  number) and invites the "tune N until green" anti-pattern measure-first forbids. The numbers are
  fixed from the measured baselines: **throttle = 4×** (the single named factor — `b16` measured
  the easing floor at 4× CPU throttle and the charter cites it as the device-class proxy; NOT a
  "4-6×" range); **dock ceiling = `dropped ≤ 2`** (born-RED witness: HEAD's measured **12 / 114**
  dock-expand drops, p95 25 ms, max 49 ms — `b16 §3`); **easing ceiling = `dropped ≤ 3`**
  (born-RED witness: HEAD's **36 dropped (~46 fps)** unthrottled / **62 dropped under 4×** —
  `b16 §1`). GREEN is the cube-parity number (≈ 0 dropped at 60 fps; cube holds 8.3 ms / 0 dropped
  under the same 4×). The small `≤ 2`/`≤ 3` slack absorbs first-paint/JIT jitter ONLY — it is an order of
  magnitude below the 12/36/62 the defect drops, so it cannot be tuned-to-pass on the broken tree.
  The thresholds were DERIVED from the measurement, not chosen to make the fix pass.
- **The "errored" half is B1, not the dock — RESOLVED.** The dock emits no `pageerror`; the
  console flood is B1's `"......"` bleed while the dock is on screen. It dies when I.W0 lands.
  Conflating it with the dock would chase a phantom dock bug. (`rc-specular-glassui §3` also
  confirms the specular is NOT B8's cause — separate root causes, do not conflate.)
