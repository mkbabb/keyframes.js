# Tranche H — Deep Audit · Lane `a-scene-square-easing`

**Charge:** per-scene deep audit of `/square` (the custom-transform demo) and
`/easing` (the curve editor — D3). Quality, defects, easing-editor
sizing/border/header. Live-audit on the running demo (kf 4.1.0 + Tranche G,
`http://localhost:5174/`, hash router so the live routes are `#/square` /
`#/easing`).

**Method:** read the source tree (cited file:line) + drove the live demo with
Playwright MCP at 1440×900 (desktop). Screenshots: `h-square-scene.png`,
`h-easing-scene.png` (repo root, written during the live pass). Every claim is
anchored to a file:line or a live measurement.

**Binding mandate carried:** idiomatic / gestalt only · no workarounds · no
legacy · KISS · DRY · MEASURE-FIRST for perf · honest ALREADY-SOTA where
deserved · cite-or-it-didn't-happen.

---

## 0. Reachability blocker — both scenes are hard/impossible to deep-link (D12, CRITICAL)

This is the headline live finding and it gates the whole lane: **on a fresh page
load / deep-link, `/square` and `/easing` are not reliably reachable.** The
scene the app lands on is non-deterministic and *walks forward through the
registry* under repeated navigation.

**Live reproduction (verbatim observations):**

| Action | Requested | Landed on |
|---|---|---|
| `goto #/square` (cold) | square | redirected to `#/cube` |
| `goto #/square` again | square | `#/spring?anim=Spring+Preview` |
| `goto #/easing` | easing | `#/starting-style?anim=Discrete+Preview` |
| `goto #/easing` again | easing | `#/sequence?anim=Sequence+Preview` |
| `goto #/square` (localStorage=square) | square | `#/cube?anim=Rotations` |

The drift advances in **scenes-registry order** (`scenes.ts:54-123`:
cube→amiga→square→easing→spring→sequence→motion-path→starting-style). Even an
in-page `setInterval` poll advanced the active scene mid-sample (the square box
vanished from the DOM between two 300ms ticks). When `localStorage` is cleared
**and** the route is set IN-PAGE (`location.hash = '#/square'`, no full reload),
the scene is stable — so the corruption is bound to the **full-load /
persisted-scene restore path**, not in-session hash changes.

**Root-cause candidates (anchored):**
- `useSceneRouter.ts:19-32` — `router.isReady().then(...)` redirects `home → stored`
  from `localStorage["keyframes-js-active-scene"]`. On a deep-link to a *named*
  route this should not fire (guarded by `route.name === "home"`), yet the
  persisted scene (`useSceneRouter.ts:46-52` writes it on every `currentSceneId`
  change) and the explicit URL fight during the async `<Suspense>` chunk resolve.
- `router.ts:42-54` — the `beforeEach` `?state=` interceptor + the deprecated
  `next(value)` calls (4× `[Vue Router warn] next() callback ... is deprecated`
  in the live console) — a fragile guard that can re-route during the initial nav.
- `useSceneGroupSync.ts:44-97` — the `sceneRef.value?.animationGroup` watcher
  fires twice per superKey change ("the double-fire codec") and restores
  per-scene playback + `autoPlayNext`; combined with `warmScene` hover-prefetch
  (`scenes.ts:39-42`) the group-mount + route can desync.

**Disposition: SHIP-in-H (gate to the D12 scene-state-machine lane).** The
gestalt fix is the one D12 charge asks for: a single, irrefragable scene +
playback state machine (a formal machine + one store — recommend
`createGlobalState` over the current ad-hoc localStorage singletons, matching
`useKeyboardShortcuts.ts`'s pattern). My lane records that **square + easing are
its two most-broken victims** (square sits late in the registry, so the
forward-walk overshoots it most often; easing's contract-anim errors, §3.1,
fire during the same churn).

**Instrument (proof gate the machine must pass):**
`proof:scene-deeplink` — for EVERY `scenes.ts` id, in a fresh context:
`page.goto('#/'+id)`, `waitForLoadState`, assert `location.hash` still names
`id` after 2 s AND `localStorage["keyframes-js-active-scene"] === id`. A
falsifiable lock that the registry-walk is dead.

---

## 1. `/square` scene — the custom-transform demo

Source: `app/scenes/SquareScene.vue`, `square/useSquareAnimations.ts`.

### 1.1 The animation does not run on mount — the box sits dead (HIGH)

In the one clean reachable pass (cleared localStorage + in-page hash), the box
was found, **perfectly centered** (`centerOffsetX/Y = 0`, 192×192), but with
**`inlineTransform: "" `** and **`backgroundColor: rgb(127,255,212)`** — the
*static* `aquamarine` from `SquareScene.vue:55`, NOT any keyframe colour
(`#C462D8 / #6280D8 / #52E898 / #E85252`, `useSquareAnimations.ts:48-65`). The
`transformFunc` (`useSquareAnimations.ts:14-32`) was never invoked → the
animation never played.

**Root cause:** `SquareScene.vue:32-35` exposes only
`{ animationGroup, superKey }`. Every other interactive scene
(`CubeScene.vue:208-216`, `EasingScene.vue:91-100`) ALSO exposes `isPlaying` /
`isStarted` / `tabsTrigger` / `ribbonContent` / `extraControlTabs`, which is how
the bottom-bar transport and `useSceneGroupSync` drive `group.play()`. Square
exposes none of it, so nothing starts the group on mount; the box renders its
CSS-default fill and waits. (The group is also `singleTarget = false`,
`SquareScene.vue:21`, to force the per-animation nested-object transform path —
correct, but moot if the loop never starts.)

**Gestalt fix (SHIP-in-H):** square must honor the SAME scene contract as cube /
easing — expose `isPlaying`/`isStarted` and let the group transport own start.
This is the *idiomatic* fix (one scene contract, no special-casing), not a
square-local `onMounted(() => group.play())` workaround. Pairs with the §0 state
machine: scene start/suspend should be the machine's job, uniformly.

**Instrument:** `proof:square-runs` — mount square, advance 800 ms, assert the
box's computed `background-color` has left `rgb(127,255,212)` (it is mid-cycle on
one of the four keyframe colours) AND `style.transform` is non-empty.

### 1.2 The nested-object transform is the demo's whole point but reads as a gimmick (MED)

`useSquareAnimations.ts:21` —
`scale(${transform.a.b.c.d})` over keyframe vars `a: { b: { c: { d: "75%" } } }`
(lines 37, 43). This deep-nest exists *only* to prove the engine pairs
arbitrarily-nested object keyframes by key path. That's a genuine, distinctive
capability — but the demo presents it with zero narration: a box labelled
`"heyyyy"` (`SquareScene.vue:3`) and no on-screen hint that the scale is coming
from a 4-deep object. The "custom transform fn + nested object interpolation"
headline (`demo/CLAUDE.md`) is invisible to a viewer.

**Disposition: SHIP-in-H (content/quality).** Keep the nested object (it's the
proof), but the scene should *show* what it proves — surface the live
`transform.a.b.c.d` value, or a caption. Replace the placeholder `"heyyyy"`
copy with something intentional. This also feeds D11 (make surviving modes more
interactive): a draggable handle that writes into the nested object would make
the capability tangible.

**Instrument:** visual-lock screenshot diff once captioned; no perf gate needed.

### 1.3 `transformFunc` clobbers `transform` then appends `rotate` — fragile ordering (MED)

`useSquareAnimations.ts:20-31`: the `transform` branch SETS
`el.style.transform = translate(...) scale(...)`, then the `rotate` branch does
`el.style.transform += ' rotate(...)'`. This only works because `transform`
fires before `rotate` in the destructured order (line 18) AND because both keys
happen to be present together at the 0%/100% frames. At the 50%/75% frames
(`useSquareAnimations.ts:53-59`) ONLY `backgroundColor`/`fontSize` change, so
`transform`/`rotate` are `undefined` and the box keeps its last transform — fine
by luck, but the `+=` pattern is a foot-gun: a frame with `rotate` but no
`transform` would append to a stale string.

**Disposition: SHIP-in-H (robustness).** Build the transform string once from
all present vars (compose `translate`/`scale`/`rotate` into a single assignment),
not assign-then-append. Idiomatic, DRY, removes the implicit ordering contract.

**Instrument:** unit test on the transform composer — feed `{rotate}` alone and
`{transform}` alone, assert no stale-string leakage.

### 1.4 Layout: box is correctly centered, but occluded by the controls overlay (LOW; cross-lane)

`SquareScene.vue:1-2` (`flex h-full w-full items-center justify-center`) +
`.demo-box` (`SquareScene.vue:44-57`) center the box correctly (measured
`centerOffsetX/Y = 0`). In `h-square-scene.png` the green box is shoved to the
right edge and half-hidden behind the controls sidebar — but that is the
**controls-pane overlay** (D1 two-column sidebar + D4 full-width ribbon)
covering the centered target, NOT a square-scene bug. Confirmed: those surfaces
belong to `a-controls-sidebar` (D1) and the mobile/ribbon lanes (D4). The
`box-shadow: 0 0 0 0.5rem color-mix(...)` ring (`SquareScene.vue:56`) is a fine
isomorphic depth cue and is unrelated to the D2/D14 radial-blur artifact
(that's `design-idioms.css`, the `a-glow-artifact` lane).

**Disposition: RECORD (cross-references D1/D4/D2 lanes).** No square-local action.

### 1.5 `useSquareAnimations.ts` exports a dead `SUPER_KEY` (LOW / KILL)

`useSquareAnimations.ts:4` exports `SUPER_KEY = "Square"`, but `SquareScene.vue`
declares its own local `const superKey = "Square"` (`:12`) and never imports the
export. Dead export — KILL it (DRY: one source of the superKey, the scene).

---

## 2. `/easing` scene — D3 the editor is FAR too big (quantified)

Source: `app/scenes/EasingScene.vue`, `easing/EasingSidebar.vue`,
`easing/EasingTarget.vue`, `@/components/custom/EasingCurveCanvas.vue`,
`easing/useEasingDemo.ts`.

### 2.1 The curve canvas has no upper bound → 680 px, the sidebar overflows the viewport (HIGH — D3 core)

Live measurements (1440×900):
- `.easing-curve-canvas` (the SVG): **680 × 680 px**, `aspect-ratio: 1 / 1`,
  `min-height: 140px`, **no max** (`EasingCurveCanvas.vue:269-273`).
- `.easing-curve-canvas-wrapper` (GlassPanel): **698 × 698 px**, `border 1px`,
  `padding 8px` (`EasingCurveCanvas.vue:4` — `p-2`).
- EasingSidebar card (`EasingSidebar.vue:2`, `glass-card p-3`): **724 × 883 px**.
- Sidebar **bottom = 961 px > viewport 900 px** → the duration control
  (`EasingSidebar.vue:72-91`, the *last* child) is clipped below the fold.

So the curve eats the entire column and pushes the CSS-value bar, the selector,
the step options, and the duration slider off-screen. `h-easing-scene.png`
shows exactly this: a viewport-filling curve, everything else below the fold.

**Root cause:** `aspect-ratio: 1` with only a `min-height` and a `w-full`
wrapper means the canvas takes the full column width (here the sidebar is ~700 px
wide) and squares it → 680 px tall. The comment at `EasingCurveCanvas.vue:266-268`
*intends* container-query-friendly intrinsic sizing, but with no `max-height` /
no container cap the intrinsic size IS the column width.

**Gestalt fix (SHIP-in-H):** cap the canvas with a `max-height` (or, idiomatic
per modern-web-guidance, a `clamp()`-bounded `aspect-ratio` block inside a
container query so the curve scales between a floor and a ceiling). The whole
sidebar must fit one viewport without scroll on desktop. This is the
container-query / intrinsic-sizing idiom D3 explicitly calls for. **Note the
sibling lane `a-easing-editor` owns D3's sizing fix directly** — this lane
*quantifies* it (680/883/961 px) and supplies the falsifiable numbers.

**Instrument:** `proof:easing-fits` — at 1440×900 assert the EasingSidebar
card's `getBoundingClientRect().bottom <= innerHeight` AND the curve canvas
height `<= some ceiling (e.g. 360px)`. A hard visual lock against regrowth.

### 2.2 Inner border touches the curve / no header inside the canvas (MED — D3 detail)

D3: "an inner border that touches the top of the 'cubic-bézier' header; the
header should be LARGER." Live: the curve canvas itself has **no internal
header** — it is a bare SVG (`EasingCurveCanvas.vue:6-101`) inside a GlassPanel
whose `1px border` + `p-2` (`:4`) draws an inner frame **2 px** off the curve's
top control point (the `f(t)` handle sits flush against the bezier path at the
top edge — visible in `h-easing-scene.png`). The "cubic-bézier header" D3 refers
to is the **curve NAME** shown in the EasingTarget header
(`EasingTarget.vue:8-10`, `text-heading`, measured text `"ease"`) and in the
CSS-value bar (`EasingSidebar.vue:14-25`) — both are small (`text-mono-caption` /
`text-heading`), not a prominent editor title.

**Gestalt fix (SHIP-in-H):** give the editor a real, larger header (the curve
name as `text-title` from the glass-ui φ-ladder, per D7's typography mandate),
and give the curve breathing room from the wrapper border (the canvas at full
680 px leaves the control handles kissing the frame). With the §2.1 size cap the
border-touch resolves naturally; pair the two.

**Instrument:** visual-lock + assert the curve's max control-point Y has ≥ N px
clearance from the wrapper inner edge.

### 2.3 EasingTarget is a near-empty 704×953 card with a 6 px hairline scrubber (HIGH)

Live: `.easing-target` (the RIGHT column, `EasingTarget.vue:4`) = **704 × 953 px**
(overflows the 900 px viewport), and in **singular** view-mode its only content
is the `.t-scrubber` Slider — measured **638 × 6 px**, a hairline. In
`h-easing-scene.png` the entire right half of the screen is a blank glass card
with one faint horizontal line. That is a huge dead pane for a 6 px control.

**Root cause:** `EasingTarget.vue:39-56` — singular mode is *just* a centered
`Slider` in a `flex-1` card. The card is sized by the scene wrapper
(`EasingScene.vue:1-4`, `h-full w-full items-center justify-center`) to fill the
column, but holds almost nothing. The interesting content (the traveling dot,
the comparison tracks) only appears in non-singular view modes
(`EasingTarget.vue:58-95`).

**Gestalt fix (SHIP-in-H):** the EasingTarget pane is redundant with the curve
canvas's own traveling dot (`EasingCurveCanvas.vue:93-100`) and CSS-value
readout. Either (a) collapse EasingTarget into the curve editor so the scene is
ONE coherent panel (the curve IS the demo target — the dot traveling the curve
is the animation), or (b) make the singular pane carry a real animated subject
(a box eased by the selected curve — dogfooding) instead of a bare 6 px slider.
Option (a) is the simpler, more cohesive KISS answer and removes a whole
empty-card surface. This also feeds D11 interactivity: drag the dot ON the curve.

**Instrument:** `proof:easing-target-density` — assert no scene pane > 50 % of
viewport area contains a single < 12 px-tall control as its only child; or a
visual-lock after the merge.

### 2.4 The `dock-inset` + `max-w-3xl` clamp fights the full-width sibling layout (LOW)

`EasingTarget.vue:2` wraps in `max-w-3xl mx-auto ... dock-inset`
(`dock-inset` defined `design-idioms.css:379-390`). Combined with the
viewport-filling sizing (§2.1, §2.3) the constraints partially cancel — the card
is centered-and-clamped yet still overflows vertically. Once §2.1/§2.3 land,
re-verify this clamp is still needed (it may be redundant).

**Disposition: RECORD (re-verify post-fix).**

---

## 3. `/easing` — engine / correctness defects

### 3.1 The contract-anim feeds a raw custom `TimingFunction` → repeated `AnimationOptionError` (HIGH)

Live console (desktop, easing scene): **4× `AnimationOptionError: Invalid value
for animation option "timingFunction": [function anonymous] — a custom
TimingFunction has no CSS animation-timing-function representation`**, thrown at
`format.ts:30-44` (`serializeEasing`), via `CSSKeyframesToString`
(`format.ts:82`), via
`KeyframesStringControls.vue:46` (`updateCSSAnimationKeyframesStringFromAnimation`).

**Root cause:** `useEasingDemo.ts:268-275` builds the scene-contract
`CSSKeyframesAnimation` with `timingFunction: currentEasingFn.value` — and
`currentEasingFn` (`useEasingDemo.ts:71-85`) returns a **bare closure**
(`CSSCubicBezier(...)`, `steppedEase(...)`, or a registry function). When the
Keyframes-tab string serializer runs against this contract animation, a closure
that carries no `.css` twin and isn't a `===`-identity registry entry hits the
by-design fail-explicit throw (`format.ts:36-43`, confirmed correct by
`src/animation/format.ts` + `animation/CLAUDE.md`). The serializer is right; the
**demo is feeding it an unserializable easing.**

**Gestalt fix (SHIP-in-H):** the easing demo MUST pass a *typed* `Easing`
(`{ fn, css }`) to the contract animation, not a bare `TimingFunction`. For a
cubic-bezier curve the `css` twin is `cubic-bezier(x1,y1,x2,y2)` (already
computed as `cssValue`, `useEasingDemo.ts:87-98`); for steps it's the `steps(...)`
literal; for a named registry curve, pass the NAME (which `serializeEasing`
hyphenates). i.e. construct `contractAnim` from `{ fn: currentEasingFn.value,
css: cssValue.value }` — and keep it in sync via the existing
`watch(isPlaying, ...)` neighbourhood. This is the round-trip-symmetric path the
engine already supports (the `Easing.css` twin), used idiomatically.

**Instrument:** `proof:no-console-throw` on the easing scene — mount, switch
across cubic-bezier / steps / a named curve, assert ZERO `AnimationOptionError`
in the console. Falsifiable, cheap, locks the regression.

### 3.2 The typing-dots `"......"` parse error surfaces through the lerp engine (cross-lane, value.js-HANDOFF)

While churning through scenes I also caught **`Error: Parse error at offset 0:
"......"`** from value.js's parser (`@mkbabb_value__js.js`), via
`CSSKeyframesAnimation.processFrame` (`engine.ts:576`) → `interpFrames`
(`engine.ts:516`). The `"......"` (six dots) is the **typing-dots `...` content**
(D6) being lerped as a CSS value and failing to parse.

**Disposition: cross-lane — primary owner is `a-typing-dots` (D6); the parser
hardening is a value.js-HANDOFF.** It is NOT square/easing-specific, but it fires
during the same scene-churn the §0 corruption causes, polluting the easing
console. Recorded here as a live corroboration of D6 + a robustness signal: the
engine's `processFrame` should fail soft (skip/keep) on an unparseable string
var rather than throw into the rAF loop. Falsifiable instrument lives in the D6
lane.

### 3.3 `useEasingDemo.ts` carries a hand-rolled rAF sweep instead of dogfooding the engine transport (MED)

`useEasingDemo.ts:131-192` builds a `NumericAnimation` sweep but then drives it
with a **hand-rolled `RAFPlayback.loop` + manual `startTime`/phase math**
(`:138-151`), plus a *separate dummy* `AnimationGroup`/`contractAnim` purely so
the bottom bar has something to toggle (`:262-290`, the source's own comment
admits "it drives no motion"). So the easing scene runs TWO parallel clocks: the
real sweep, and a placeholder group whose `paused` flag is mirror-synced
(`:288-290`). That duplication is the seam where §3.1's error and §0's
play/pause-restore confusion live.

**Disposition: MEASURE-FIRST → SHIP.** The gestalt direction: drive the easing
preview from ONE transport (the engine's own `NumericAnimation.play()` managed
loop, or the group), so the bottom-bar play/pause and the sweep are the same
clock — eliminating the placeholder group. This dovetails with §0's state
machine (one play/pause authority per scene). MEASURE-FIRST only to confirm the
single-clock path keeps the per-curve multi-track sweep cheap.

**Instrument:** after unification, `proof:easing-one-clock` — assert there is no
second `AnimationGroup` whose sole purpose is the paused-flag mirror (grep + a
state-shape assertion), and the play button toggles the actual sweep.

---

## 4. Quality notes (both scenes) — honest dispositions

- **ALREADY-SOTA — the bezier drag interaction.** `EasingCurveCanvas.vue:167-262`
  is exemplary: `getScreenCTM().inverse()` SVG-space mapping, rubber-band past
  `[0,1]` (`:186-197`), exponential smoothing (`:199, 253-254`), pointer-capture
  with iOS try/catch (`:230-232, 236-240`), touch vs mouse hit radius (`:207`).
  Clamped viewBox against overshoot blow-up (`:141-165`). No action — cite as the
  bar the rest of the scene should meet.
- **ALREADY-SOTA — EasingTarget's ref-owned measurement.** `EasingTarget.vue:200-234`
  replaced brittle `.closest()/.querySelector()` class-string DOM walks with
  owned template refs + `useResizeObserver` (vueuse lifecycle). Good gestalt.
  The `getComputedStyle`-read ball-size tokens (`:266-274, 302-315`) keep CSS the
  single source of truth — DRY done right.
- **ALREADY-SOTA — the visibility-pause discipline.** `useEasingDemo.ts:182-192`
  idles the preview rAF on tab-hide without disturbing the user's play intent,
  and `onScopeDispose(() => playback.stop())` (`:185`) is the genuine unmount
  seam (no `<KeepAlive>` leak). Correct, cited approvingly.
- **MED — `SquareScene.vue` placeholder copy `"heyyyy"`** (`:3`) ships to prod.
  KILL/replace.
- **LOW — `Vue Router warn: next() callback is deprecated`** (4× live console)
  from `router.ts:42-54`. Idiomatic fix: return the route value instead of
  calling `next(value)`. Tidy-up, pairs with the §0 router rework.
- **LOW — `parseCSSValue` regex duplicates value.js's CSS grammar**
  (`useEasingDemo.ts:219-260` hand-rolls `cubic-bezier(...)`/`steps(...)` regex).
  DRY candidate: value.js already parses these (it's the dep that throws in
  §3.2). MEASURE-FIRST whether reusing value.js's parser is lighter than the
  regex; BOOK if not.

---

## 5. Disposition summary

| # | Finding | Severity | Disposition | Owner / Pairs with |
|---|---|---|---|---|
| 0 | square+easing unreachable on deep-link; registry-walk drift | CRITICAL | SHIP-in-H | D12 scene-state-machine lane |
| 1.1 | square animation never auto-starts (box dead) | HIGH | SHIP-in-H | this lane + scene contract |
| 1.2 | nested-object transform unnarrated (gimmick) | MED | SHIP-in-H | content; feeds D11 |
| 1.3 | `transformFunc` assign-then-`+=` ordering foot-gun | MED | SHIP-in-H | this lane |
| 1.4 | box occluded by controls overlay | LOW | RECORD | D1/D4/D2 lanes |
| 1.5 | dead `SUPER_KEY` export | LOW | KILL | this lane |
| 2.1 | curve canvas 680px, sidebar 883px > viewport | HIGH | SHIP-in-H | D3 / `a-easing-editor` |
| 2.2 | inner border touches curve; no editor header | MED | SHIP-in-H | D3 / D7 typography |
| 2.3 | EasingTarget 704×953 empty card, 6px scrubber | HIGH | SHIP-in-H | this lane; feeds D11 |
| 2.4 | `dock-inset` + `max-w-3xl` clamp redundancy | LOW | RECORD | re-verify post-fix |
| 3.1 | contract-anim raw fn → AnimationOptionError ×4 | HIGH | SHIP-in-H | this lane |
| 3.2 | `"......"` typing-dots parse error in lerp | HIGH | cross-lane | D6 + value.js-HANDOFF |
| 3.3 | dual-clock sweep + placeholder group | MED | MEASURE-FIRST → SHIP | pairs w/ §0 |
| 4 | bezier drag / ref-measurement / vis-pause | — | ALREADY-SOTA (no action) | cite as bar |
| 4 | `"heyyyy"`, `next()` deprecation, parseCSSValue regex | LOW | SHIP / BOOK | tidy |

**Proof gates this lane hands to H:** `proof:scene-deeplink` (§0),
`proof:square-runs` (§1.1), `proof:easing-fits` (§2.1),
`proof:easing-target-density` (§2.3), `proof:no-console-throw` (§3.1),
`proof:easing-one-clock` (§3.3).

**Live artifacts:** `h-square-scene.png`, `h-easing-scene.png` (repo root).
