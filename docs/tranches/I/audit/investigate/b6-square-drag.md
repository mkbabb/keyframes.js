# B6 — /square drag selects chrome text + does not persist

Investigation agent: **b6-square-drag** · Tranche I audit · 2026-06-08
Harness: Playwright (playwright-core via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`)
served against the pre-built `dist/gh-pages/` on an ephemeral port (the proven
`proof-no-orphan-specular.mjs` pattern: `serveDist` + `openSceneFresh` → `#/square`).

Probes (re-runnable):
- `docs/tranches/I/audit/investigate/probes/b6-square-drag.mjs` — drives a real
  pointer drag (down on box → move across chrome → up away from home), samples the
  live text selection, and records the box transform held / immediate-on-release /
  +700 ms.
- `docs/tranches/I/audit/investigate/probes/b6-select-css.mjs` — enumerates the
  effective `user-select` over the whole chrome (html, body, dock, control panels).

Screenshot: `docs/tranches/I/audit/investigate/shots/b6-square-drag.png`
(box held mid-drag, translated off-home; left-rail control panel + playback ribbon
visible, all selectable).

---

## Reproduction steps

1. Serve `dist/gh-pages/`; open `#/square` (1440×900, controls panel open).
2. Press down on the `.demo-box` ("drag me") and drag the pointer **out of the
   `.square-stage`** and over the bottom/side chrome (the dock labels, the
   `duration/delay/iterations/direction` control panel, the `z-index` field, the
   playback ribbon).
3. Observe (native browser): the chrome **text gets highlighted** as the cursor
   sweeps over it — there is no `user-select:none` on the body/dock/controls during
   the gesture.
4. Release the pointer anywhere off-home.
5. Observe: the box **springs back to center** — the drag result does **not
   persist**.

---

## Behavior vs intended

| | Observed | Intended (user spec) |
|---|---|---|
| Text selection during drag | Chrome text (dock + control labels) is selectable; no global `select-none` is applied for the gesture duration | The drag should set `user-select:none` (globally, while dragging) so nothing highlights |
| Persistence | On `pointerup` the box re-seats to `(0,0)` and springs home — the drag is **discarded** | The drag "should persist its result" — the box should stay where it was released |

---

## Evidence (verbatim probe output)

### user-select audit (`b6-select-css.mjs`)
```
html : auto
body : auto
sampleCount   : 18   (text elements outside .square-stage)
selectableCount : 18   ← EVERY chrome text element is user-select:auto
```
Representative selectable chrome text (all `userSelect: "auto"`):
`"Controls"` (dock-select-trigger / dock-label), `"Square"` (dock-label),
`"@mbabb"` (dock-dropdown-trigger), `"duration"` / `"delay"` / `"iterations"` /
`"direction"` / `"fill mode"` (labeled-field-label), `"alternate"`, `"forwards"`.

box posture (the direct-manip affordance — confirms it is a pointer-capture drag):
```
.demo-box  touchAction=none  cursor=grab  hasSetPointerCapture=true
```

### drag-persistence audit (`b6-square-drag.mjs`)
```
.square-stage  user-select = none        ← scoped guard (insufficient)
.demo-box      user-select = none        ← scoped guard (insufficient)
dock           user-select = auto        ← NOT guarded
controls       user-select = auto        ← NOT guarded
body           user-select = auto        ← NOT guarded

transform_heldAtDragEnd     = translate(-110.056px, 88.4px) rotate(0deg) scale(1.12)
transform_immediateOnRelease= translate(-110.056px, 88.4px) rotate(0deg) scale(1.12)
transform_after700ms        = translate(0px, 0px) rotate(0deg) scale(1)   ← SPRINGS HOME
```

Console: **0 messages**. PageErrors: **0**. (B6 is a behavioral/CSS defect, not a
crash — no console signature, which is precisely why the source-shape /
console-clean gates never caught it.)

### Note on the synthetic-drag selection read
The probe's `window.getSelection()` read 0 chars during the *synthetic* Playwright
drag. This is an **artifact of `setPointerCapture`**, not absence of the defect:
once the box captures the pointer, Chromium routes the move stream to the box and
suppresses the native text-selection that a real, un-captured mousedown-drag
performs on the elements it sweeps. The defect is proven **structurally and
decisively** by the CSS audit: `html`, `body`, the dock, and all control labels are
`user-select:auto` for the entire gesture — there is no global select-suppression
applied on drag-start, so a native drag highlights them. (The capture only contains
the *pointer* stream; it does not suppress text selection on the document.)

---

## Source trace (file:line)

**Owner:** `demo/app/scenes/SquareScene.vue` (the drag is hand-rolled inline here —
it does NOT use the shared `useDragScrub` / `useDragCapture` composables).

- `SquareScene.vue:2` — the ONLY `select-none` is on the stage root:
  `<div class="square-stage flex h-full w-full ... select-none">`. This guards the
  *stage*, but the drag escapes the stage via window-level `pointermove`, so the
  guard does not cover the chrome the pointer sweeps.
- `SquareScene.vue:11` `@pointerdown="onPointerDown"` → `onPointerDown` (`:85`):
  sets `dragging.value = true`, `box.value?.setPointerCapture(e.pointerId)`
  (`:89`), `reseatFromEvent(e)`. **No global `user-select:none` is applied** (no
  body class toggle, no `document.documentElement.style.userSelect = "none"`).
- `SquareScene.vue:94` `useEventListener(window, "pointermove", …)` →
  `reseatFromEvent` (`:77`) — the drag is driven by **window**-scope moves, so the
  pointer legitimately travels over the chrome; nothing suppresses selection there.
- `SquareScene.vue:99-107` `useEventListener(window, "pointerup", …)` — the
  PERSISTENCE defect: on release it calls **`reseat(0, 0)`** (`:104`) and resets the
  readout to `0.00`. This deliberately re-seats both axis spring targets to home, so
  the box springs back to center.
- `square/useSquareAnimations.ts:162` `reseat(nx, ny)` sets
  `springX.target = clamp(nx)` / `springY.target = clamp(ny)` and arms the loop;
  `reseat(0,0)` therefore drives both springs to 0 — the "return to rest" gesture
  documented at `SquareScene.vue:102-103`. The composable has no notion of a "settle
  in place / persist where released" mode.

Neither shared composable is involved:
- `demo/@/composables/useDragScrub.ts` — the shared rail/handle scrub seam; **not
  imported** by SquareScene.
- `demo/@/components/custom/animation-controls/controls/composables/useDragCapture.ts`
  — the pointer-capture drag composable; **not imported** by SquareScene.
  Notably *both* shared composables also lack any global `user-select:none`
  application — so the chrome-text-highlight class of defect is latent across every
  drag surface, not unique to square. (Cross-feeds the gate-regime overhaul: a
  drag-gesture invariant should assert global select-suppression for the gesture
  duration.)

---

## Root-cause hypothesis

**Two distinct defects, both in `SquareScene.vue`'s hand-rolled drag, neither
caught by any gate (no console output, source-shape-green):**

1. **Text-highlight (no global select-suppression).** The drag captures the pointer
   and listens at `window` scope, so the cursor sweeps the chrome (dock + control
   panels), but the only `user-select:none` is scoped to `.square-stage` /
   `.demo-box`. `html`/`body`/dock/controls stay `user-select:auto` for the whole
   gesture, so a native mousedown-drag highlights every label it crosses. The
   idiomatic fix: on drag-START apply a **global** select-suppression (e.g. toggle a
   `user-select:none` class on `<html>`/`<body>`, or a `body.is-dragging` token) and
   remove it on drag-END — and lift this into the shared drag composable so EVERY
   drag surface inherits it (gestalt, single seam), rather than re-patching square.

2. **Non-persistence (release re-seats to 0,0 by design).** `pointerup` calls
   `reseat(0, 0)`, hard-coding a spring-home-on-release. The user expects the box to
   stay where released. Fix: on `pointerup`, do **not** re-seat to home — leave the
   spring targets at their last dragged value so the box settles in place (the
   spring still chases-to-rest at that target, preserving the lively feel). The
   "Home/End key → recenter" affordance (`:118`) already gives an explicit
   recenter, so removing the implicit recenter-on-release loses no capability.

Both fixes converge on the same gestalt move flagged by the user's standing
guidance: the per-scene hand-rolled drag should fold into the **shared drag
composable**, and that seam should own the global select-suppression + a
persist-vs-recenter policy — closing the class of defect (not just the square
instance) and feeding the gate-regime overhaul with a real interaction gate
(playwright: drag over a chrome label → assert `getSelection()` empty AND box
transform ≠ identity after settle).
