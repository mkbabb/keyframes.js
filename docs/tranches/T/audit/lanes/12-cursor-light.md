# Lane 12 — cursor-light: the pointer-tracked key-light (VERDICT #22; no shot)

**Charter.** The owner: "strange light that follows the cursor, but only partially — if you're
going to implement this, it should be done right" (#22, no shot captured at review time). This
lane locates the implementation, characterizes every axis of its partiality live (surface
coverage, geometric clipping, device coverage, visual magnitude, main-thread cost), and specifies
both T options in full: DO-IT-RIGHT and REMOVE.

**Method.** Static grep across `demo/` for pointer-tracked light/glow/specular vocabulary (found
exactly one hit); live probes against the dev server (`localhost:5180/#/compose`, 1400×900,
Playwright MCP) — DOM/CSS forensics (`getComputedStyle`, `getBoundingClientRect`), synthetic
`PointerEvent` dispatch to verify tracking + measure visual delta (pixel-diffed screenshots), and
in-page microbenchmarks isolating the handler's per-event cost (`performance.now()`, N=500,
repeated). Cross-referenced against `node_modules/@mkbabb/glass-ui@4.0.1` dist `.d.ts` census (its
real exports, not assumed) and lane 07's compose-scene forensics (which independently flagged the
same code as a performance sibling of its own F1).

---

## F1 — the light exists on exactly ONE surface out of nine: `demo/scenes/compose/ComposeTarget.vue:74-141`

**Location.** The entire sitewide grep for cursor-tracking light vocabulary (`pointermove` /
`mousemove` joined with `light|glow|spotlight|specular|--mouse-x`) resolves to a single
implementation: the compose scene's "casting-floor key-light."

```
demo/scenes/compose/ComposeTarget.vue:74   const onFoundryPointerMove = (e: PointerEvent) => { ... }
demo/scenes/compose/ComposeTarget.vue:78-81  host.getBoundingClientRect() → setProperty('--mouse-x'/'--mouse-y')
demo/scenes/compose/ComposeTarget.vue:102-111 @property --mouse-x/--mouse-y { inherits: true; ... }
demo/scenes/compose/ComposeTarget.vue:119-141 .foundry-keylight { background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), …) }
demo/scenes/compose/ComposeScene.vue:118-129  onBindIgnition() re-settles the SAME --mouse-x/y toward a bound asset's centre
```

No other scene (cube, amiga, square, easing, spring, sequence, motion-path, morph) and no
app-shell chrome (dock, header, editor-shell, controls pane) implements anything resembling a
cursor-tracked light. `useCubeRelit.ts`'s "key light" (cube scene) is **rotation-coupled**, not
pointer-coupled — the light is pinned in the room and the die turns under it; it does not track
the cursor at all despite similar vocabulary in its comments. This is directly measured, not
inferred: the demo's OWN `.foundry`-scoped CSS comment names it "compose-scene-only" (line 95).

**This alone is a literal reading of "only partially."** The owner's phrase most plausibly reads
as encountering the effect once (in compose, positioned immediately before their own #23 verdict
on that scene) and expecting it to be a sitewide idiom — it is not; it is scoped to 183 lines of
one soon-to-be-adjudicated scene (lane 07 rules compose **PRUNE OUTRIGHT** — see coordination
note in the T recommendations below).

## F2 — geometric clipping: the light is hard-bounded to the `[data-foundry]` rect, not the viewport

**Measured** (dev, 1400×900): `[data-foundry].getBoundingClientRect()` → `{x:504, y:119, w:854,
h:662}`. The keylight div is `position:absolute; inset:0` **inside** that box
(`z-index:-10`, confirmed via computed style — sits behind the SVG comet-tail at `z:10` and the
`AssetViewport` at `z:40`, per the site's semantic z-stack: `--z-behind:-10` / `--z-content:10` /
`--z-dock:40`, `demo/@/styles/style.css:29-34`). The `@pointermove` listener is bound to that same
element (`ComposeTarget.vue:13`).

Consequence, confirmed by dispatching synthetic `PointerEvent`s at the DOM boundary: moving the
cursor into the Assets control pane (left ~500px of the 1400px viewport), the dock, the header, or
any area outside the 854×662 stage produces **zero effect** — `--mouse-x`/`--mouse-y` simply hold
their last in-bounds value (no `pointerleave` reset either). A user who moves the mouse across the
whole page sees the light snap alive only inside one rectangle and freeze dead everywhere else —
the second, geometric sense of "only partially."

## F3 — device coverage: the effect is desktop-mouse-only; touch gets a frozen default

The handler is a bare `@pointermove`, with no touch/hover distinction. On a touch device,
`pointermove` (per spec) fires **only while a contact point is down and moving** — there is no
ambient hover state. Practically: touch users never see the gliding wash the desktop mouse
produces; they see the light jump to wherever a drag starts and stay there between touches,
otherwise resting at the coded default pool, `--mouse-x:50% --mouse-y:38%` (`ComposeTarget.vue:115-116`).
Given the compose scene's own mobile-layout comment block (`AssetViewport.vue:9-14`) already
reasons carefully about the mobile control-sheet's effect on the CTA card's position, but never
about the light's touch behavior, this is an un-audited third axis of partiality — the feature was
authored and reasoned about as a desktop-hover affordance and never revisited for touch, which is
most of a public demo's traffic.

## F4 — visual magnitude: real, but authored at near-imperceptible intensity

The gradient's own stops: `color-mix(… 9%, transparent)` at the pointer, `3%` at the 28% radius,
fully transparent by 55% (`ComposeTarget.vue:124-129`). Measured directly: dispatching a full
diagonal sweep (top-left corner → geometric centre of the 854×662 stage) and pixel-diffing two
screenshots taken before/after (`compose-baseline.png` vs `compose-centered-light.png`, both in
this session's scratchpad) shows a real, correctly-bounded change — diff bounding box
`(504,119)-(1219,738)` (matches the foundry rect), **max single-channel delta 111/255**, but only
**223,011 of 1,260,000 pixels** (17.7%) register any visible change at all, and the mean delta
across the full frame is under 1/255. The effect is genuine and correctly wired; it is authored so
subtly that a static before/after comparison at typical screenshot fidelity is nearly a no-op —
consistent with a wash nobody explicitly signed off as a designed moment, which is the third,
qualitative sense in which "if you're going to implement this, it should be done right" reads:
right now it reads as an accident you might notice out of the corner of your eye, not a feature.

## F5 — measured cost: the naive read-after-write pattern forces synchronous layout on every pointer event

**This corroborates and sharpens lane 07's F1** ("the pointer-tracked key-light … repaints a
878×664 layer on every pointermove — a #19/#22 performance sibling"). Isolated, reproducible
in-page microbenchmarks (dev server, N=500 each, `performance.now()`):

| Operation | Cost/call | Note |
|---|---|---|
| `foundry.getBoundingClientRect()` alone, no interleaved writes | **0.80 µs** | clean, no pending invalidation |
| `foundry.style.setProperty(...)` ×2 alone, no interleaved reads | **1.00 µs** | clean write |
| **The handler's actual pattern**: `getBoundingClientRect()` immediately preceded by the prior call's `setProperty()` (i.e., what `onFoundryPointerMove` does on every consecutive event) | **1097–1671 µs** (two independent runs) | **~1,100–2,000× the isolated cost** |
| Same interleaving, but the geometry read targets `document.body` instead of `.foundry` (rules out "it's this element specifically") | **1192 µs** | confirms the stall is a **whole-document** forced style/layout flush, not a subtree-local one |

This is the textbook forced-synchronous-layout ("layout thrashing") anti-pattern: reading any
geometry property (`getBoundingClientRect`, `offsetTop`, etc.) after a style mutation anywhere in
the document forces the browser to resolve pending style + layout synchronously before it can
answer the read. `onFoundryPointerMove` does exactly `read → write` every single call
(`ComposeTarget.vue:77-81`), so **every consecutive pointermove pays for a full-document
synchronous style/layout resolve** on a page with ~2,859 DOM nodes at rest (measured, compose
scene, no assets). At a conservative 60 pointermove events/sec (vsync-throttled), that is
**66–100 ms of main-thread time per second of mouse movement**, spent entirely on a decorative
wash most users will not consciously register (F4). On higher-report-rate pointers this scales
worse. This is a live, load-bearing contributor to the "performance on every single page is god
awful" verdict (#19) specifically while the pointer is moving over the compose scene.

*Coordination note for the performance lane*: these are the load-bearing numbers for this one
surface; they are additive to whatever broader per-scene budget that lane establishes. The fix
(F6) is independent of any other performance work and does not require touching layout at all.

## F6 — root cause: a hand-rolled reinvention of a wheel glass-ui already turns internally — the SECOND occurrence of the exact pattern this codebase already tried and killed once

`demo/@/styles/design-idioms.css:446-456` records the demo's own history with this pattern
verbatim:

> "the tracked-specular subsystem is REMOVED (H.W9.F3+F6) … The W2 S2-COMPOSITE bezier card
> carried a tracked, cursor-following catch-light … The user read it as too-dramatic (F3) and
> **inconsistent — present on ONE card only (F6)** — and the lead adopted REMOVE."

`ComposeTarget.vue`'s `--mouse-x`/`--mouse-y` key-light is a **second, independently-authored
instance of the identical shape of defect**: a bespoke, hand-rolled, pointer-tracked radial-wash,
present on exactly one surface, using the exact same CSS-variable vocabulary (`--mouse-x`/
`--mouse-y`) the removed subsystem used. It was not restored from history — it is new code
(compose is an S.D3 fold-in) that re-derived the same idiom from scratch, and re-earned the same
verdict the first one got, this time from the owner directly instead of from "the user" cited
in H.W9.

Separately, and more actionably: **glass-ui itself ships the fix, just not publicly.** Its
internal composables (`node_modules/@mkbabb/glass-ui/dist/composables/glass/`,
`useSpecularTracking.d.ts` / `useSpecularPointer.d.ts` / `vSpecular.d.ts`) already solve this exact
problem for its own `Card`/`DockIconButton` catch-light: `createSpecularWriter()` is documented as
"the pointer write is **rAF-COALESCED**: `onPointerMove` only stashes the raw event + schedules
ONE `requestAnimationFrame`; the rAF callback does the single `getBoundingClientRect()` + style
write, so a 120–1000 Hz pointer collapses to ONE batched layout read + ONE style write per
animation frame" — plus a cached (not per-event) `prefers-reduced-motion` gate and scope-disposal.
This is the textbook fix for F5, already written, already battle-tested inside glass-ui, and it
even already uses `--mouse-x`/`--mouse-y` as its host-write vocabulary (its own doc: "`--mouse-x`/
`--mouse-y` is the HOST WRITE this seam owns"). **But it is not part of glass-ui's public API
surface** — grepping every top-level `.d.ts` in `dist/` and `package.json`'s `exports` map, none
of `useSpecularTracking`, `useSpecularPointer`, `vSpecular`, or `createSpecularWriter` is exported;
they are internal to `Card.vue`/`DockIconButton.vue`. This is a genuine glass-ui gap
(VERDICT #27's "delineate our gaps, and glass-ui's gaps") worth naming, not a demo mistake to
independently re-solve by hand-copying glass-ui's internal logic.

glass-ui separately ships a **fully public, purpose-built family of cursor-reactive ambient
background primitives** the demo currently uses zero times: `@mkbabb/glass-ui/aurora` (a
WebGL2 "painterly background," publicly exposing `setCursor(x, y, strength)` /
`injectCursorVelocity(dx, dy)` / `clearCursor()` plus a `useCursorInteraction` wiring composable),
`@mkbabb/glass-ui/goo-blob`, and `@mkbabb/glass-ui/constellation` — all confirmed as real
`package.json` `exports` subpaths (`./aurora`, `./goo-blob`, `./constellation`). `Aurora` in
particular is engineered exactly for "a light that follows the cursor, done right": adaptive
render substrate (`"auto"` resolves to a CSS-gradient fallback under
`prefers-reduced-motion`/`hardwareConcurrency<=4`/`saveData`, never fully retired, per its own
doc), a named DPR budget ceiling for decorative washes (`AV_AURORA_DPR_MAX = 1.5`, distinct from
the sharper `AV_DPR_MAX = 2` used for focal creatures), lazy WebGL arm past first paint, and a
`opacityCeiling` compositing envelope for "quiet content-over-aurora routes." None of this
machinery exists in the compose scene's hand-rolled version, and all of it is a straight `import`
away.

---

## T recommendations

### T-CL-1 — DO-IT-RIGHT: relocate the cursor light onto a surface that survives, driven by glass-ui's cursor-reactive ambient primitive, not a hand-rolled `--mouse-x` wash

**Design.**
- **Layer.** Retire the bespoke `.foundry-keylight` radial-gradient + `@property --mouse-x/--mouse-y`
  entirely (`ComposeTarget.vue:74-82, 94-141`). If product direction wants a signature
  cursor-reactive light, home it on a surface that is not slated for removal — the home hero is
  the only page every visitor sees and is already undergoing a from-scratch redesign per VERDICT
  #3, making it the natural, deliberate host rather than a rediscovered accident inside an inner
  scene.
- **Primitive.** Mount `@mkbabb/glass-ui/aurora`'s `Aurora` component (or `goo-blob`/`constellation`
  if a more focal, less atmospheric read is wanted) as the hero's background layer, wired via the
  public `useCursorInteraction` composable / the exposed `setCursor(x, y, strength)` API — not a
  reimplementation of glass-ui's internal `createSpecularWriter`. This is a straight import, not
  new physics: glass-ui already owns the rAF-coalescing, the PRM-safe substrate fallback, the DPR
  budget, and the lazy-arm-past-first-paint discipline.
- **Blend.** `opacityCeiling` tuned low (the component's own vocabulary for "quiet
  content-over-aurora routes," e.g. ~0.35–0.5) so the hero's uplifted per-char text (VERDICT #3)
  stays the dominant read; the aurora is atmosphere, not a competing subject.
- **Performance budget (falsifiable).** Zero synchronous `getBoundingClientRect()`/`setProperty`
  pairs in any pointermove handler outside glass-ui's own rAF-coalesced core; the surface must
  resolve to the CSS-gradient fallback substrate under `prefers-reduced-motion: reduce` (Aurora's
  own `"auto"` renderMode does this for free — no demo-side PRM branch needed, deleting the
  redundant one `ComposeTarget.vue` currently hand-rolls at lines 171-182).
- **Gap to flag (not to fix in this demo).** If a future surface wants the SUBTLER "wash following
  the cursor over ordinary DOM content" register (not a WebGL canvas), that specifically needs
  `createSpecularWriter`'s coalesced core made public — currently internal-only. Name this as a
  glass-ui ask, not a demo workaround: do not hand-copy the internal composable source into the
  demo (that recreates exactly the "second hand-rolled occurrence" this finding is about).

**Scope sketch.** Delete `ComposeTarget.vue:74-82` (handler), `:94-116` (registered properties +
default pool), `:119-141` (keylight layer + its box-shadow vignette), `:171-182` (its PRM branch);
delete the `onBindIgnition` key-light settle block (`ComposeScene.vue:119-129`, 11 lines) since its
target dies with it. Add `Aurora` + `useCursorInteraction` to the home hero surface (owned by
whichever T-wave redesigns the hero per VERDICT #3) with a low `opacityCeiling`.

**Falsifiable gate.** (a) `grep -rn "onFoundryPointerMove\|foundry-keylight\|--mouse-x" demo/` →
empty. (b) A new `proof:cursor-light-no-sync-layout` (or equivalent Performance-trace assertion)
recording zero "Recalculate Style"/"Layout" entries attributable to a bare (non-rAF-batched)
pointermove handler across the demo. (c) Home hero Lighthouse/CDP trace shows the aurora surface's
main-thread cost amortized to ≤1 style+layout pair per animation frame regardless of pointer
event rate (Aurora's own coalescing contract, machine-checkable by counting `setCursor` calls vs.
canvas uniform uploads per frame).

**Size.** M (new mount + wiring on the hero, contingent on that redesign's shape; the compose-side
deletion alone is S).

### T-CL-2 — REMOVE: excise the casting-floor key-light outright, no replacement

**Excision set (exact).**
- `demo/scenes/compose/ComposeTarget.vue:13` — the `@pointermove="onFoundryPointerMove"` binding.
- `demo/scenes/compose/ComposeTarget.vue:15-16` — the `<div class="foundry-keylight">` layer.
- `demo/scenes/compose/ComposeTarget.vue:70-82` — `onFoundryPointerMove` + its doc comment.
- `demo/scenes/compose/ComposeTarget.vue:94-141` — the `@property` registrations, `.foundry`'s
  default-pool custom properties, and the `.foundry-keylight` CSS block (including its inset
  vignette `box-shadow`).
- `demo/scenes/compose/ComposeTarget.vue:171-182` (partial) — the PRM branch lines that reference
  `.foundry-keylight`'s transition (the sibling `.comet-tail.is-igniting` PRM rule stays if the
  comet-tail survives its own adjudication).
- `demo/scenes/compose/ComposeScene.vue:118-129` — the key-light-settle half of `onBindIgnition`
  (the `host`/`el` rect math + the two `setProperty` calls); the comet-tail draw half of the same
  function is independent and may survive on its own merits.
- `demo/scenes/compose/ComposeScene.vue:83-89` — trim the block comment's "warm key-light bloom"
  clause to match.

**This excision is already subsumed if lane 07's PRUNE OUTRIGHT verdict for the whole compose
scene stands** (compose's core loop is independently dead per that lane's F1 — an unrelated
`:has()` CSS collapse bug — with zero unique dogfood surface). In that world T-CL-2 costs
literally nothing beyond what compose's removal already deletes; this recommendation exists as the
standalone answer **only if** a future wave preserves compose (or some successor casting-floor
surface) without the light.

**Falsifiable gate.** `grep -rn "mouse-x\|mouse-y\|foundry-keylight\|onFoundryPointerMove" demo/`
→ empty; `npm run check` clean; `proof:demo-no-oversize` unaffected (both files shrink, neither
was near the 500L ceiling).

**Size.** S.

### T-CL-3 — either way: fold the H.W9 lesson into a standing gate so a third occurrence doesn't ship silently

Whichever of T-CL-1/T-CL-2 is chosen, the recurrence itself (H.W9's `.cartoon-specular` →
compose's `.foundry-keylight`, same shape, same "present on one surface only" complaint, two
independent authors) is the real defect: nothing currently stops a THIRD hand-rolled
`--mouse-x`/`--mouse-y`-style pointer tracker from reappearing on some future scene. Add a grep-shaped
gate (sibling to `proof:no-orphan-specular`, which already exists for glass-ui's own specular
class) that fails CI if `demo/` defines a new `@property` pair matching `--*-x`/`--*-y` driven by a
bare (non-glass-ui-sourced) `pointermove`/`mousemove` handler, forcing any future cursor-reactive
effect through glass-ui's public surface (`aurora`/`goo-blob`/`constellation`) or an explicit,
reviewed exception.

**Scope sketch.** One `scripts/proof-*.mjs` AST/grep gate; no runtime code change.

**Falsifiable gate.** The gate itself, run against current `HEAD`: RED today (catches
`ComposeTarget.vue`'s pattern), GREEN after either T-CL-1 or T-CL-2 lands.

**Size.** S.
