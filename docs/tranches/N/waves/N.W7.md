# N.W7 — a11y · reduced-motion · no-VT fallback · perf budget

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** N.W1–N.W6
  (all preceding Stage waves must be in a testable state — the a11y and PRM gates
  actuate the FULL stage overlay). N.W7 is the quality-totality wave; it runs last in
  Band B and gates the Stage's readiness for production integration (N.WZ).
- **Gate (born-RED, the a11y + PRM + perf roster):**
  - `proof:stage-a11y` — **does NOT exist today** (the stage overlay is absent; no
    keyboard carousel, no `aria-live`, no roving tabindex, no focus routing has been
    implemented). Born-RED: the stage component does not exist (`ls
    demo/@/components/custom/scene-stage/SceneStage.vue` → ABSENT, verified 2026-06-17).
  - `proof:stage-prm` — **does NOT exist today** (no `prefers-reduced-motion` branches in
    any stage composable; `useRingOrbit` does not call `SpringProgress.respectReducedMotion`;
    `--stage-light` has no PRM freeze). Born-RED: `grep -rn "prefers-reduced-motion\|
    respectReducedMotion" demo/@/components/custom/scene-stage/` → 0 matches (directory
    absent).
  - `proof:stage-perf-budget` — **does NOT exist today** (the concurrent `RAFPlayback`
    cap gate from N.W4 exists only as N.W4's `proof:stage-previews-live`; the FULL-stage
    frame budget — ring + previews + downlight + arrows simultaneously — has no gate). Born-RED
    by construction (the stage does not exist to measure).

---

## Context

N.W7 is the accessibility, correctness-under-PRM, and perf-finality wave. It closes the
three quality axes that must be green before the stage supersedes the dropdown (N.WZ). Each
axis has distinct failure modes that a source-shape gate would miss — all three are AXIS-1
browser gates per inv-M-two-axis.

### (a) Keyboard carousel + focus routing (the a11y thread)

The carousel ring must be operable by keyboard alone. The design-synthesis §7 locked decision
specifies: `ArrowLeft` / `ArrowRight` spin prev/next, `Home` / `End` jump to first/last, `Enter`
commits, `Escape` dismisses. The ring is semantically a `role="listbox"` / `role="radiogroup"`
(carousel = a set of mutually exclusive options; Enter selects) with roving tabindex (one tab
stop at the currently-centred item). The a11y guide marks focus routing in view transitions as
MANDATORY — focus must route INTO the stage on open and to the new scene host on commit (or to
the dock trigger on dismiss).

The `aria-live` region announces the centred scene: "Now showing: Spring, 5 of 7" on every ring
rotation. It uses `aria-live="polite"` (not assertive — spinning is not an emergency) with
`aria-atomic="true"` (the whole announcement updates). The arrow buttons have `aria-label="Previous
scene"` / `"Next scene"` and `>=44px` hit targets (the WCAG 2.1 §2.5.5 recommendation; the gate
measures computed `offsetWidth × offsetHeight`).

Brightness/blur falloff is NOT the sole selection indicator. The selection is carried by:
(1) the name-plate (Instrument Serif, bottom-centre, always visible); (2) the `aria-live`
announcement; (3) a CSS focus ring on the front item (`outline: 2px solid var(--ring)`);
(4) the `aria-selected="true"` on the front radio item. Brightness is decorative only.

### (b) Reduced-motion (the PRM thread)

PRM branches for every motion in the stage:

| Motion | PRM degrade |
|---|---|
| Ring orbit (SpringProgress) | Snap ring to front item: `SpringProgress.respectReducedMotion` snaps to `target` instantly; `stagger` reveal collapses to `delay: 0` |
| `--stage-light` hover-brighten | Freeze at `1`; `useStageLight` reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and short-circuits the spring (no lift, no fill translate) |
| Stage entry / exit VT | The glass-ui `startViewTransition` helper's `instantUnderReducedMotion: true` option takes the instant path (mutates synchronously, no snapshot); glass-ui's `view-transition.css:27-33` rule `animation: none !important` on all `::view-transition-*` pseudos handles the CSS side |
| Arrow idle shimmer + drift | CSS `animation: none` under `@media (prefers-reduced-motion: reduce)` (a CSS rule in `StageArrows.vue <style>`) |
| Arrow hover swell + press recoil | `SpringProgress.respectReducedMotion` on arrow springs → instant scale snap (no bounce) |
| Idle loop previews (N.W4) | Each preview checks `window.matchMedia` or receives a `prefersReducedMotion` prop; freezes at a static representative pose (last keyframe of the idle loop, not mid-animation) |
| Commit morph VT | The `instantUnderReducedMotion` path; `useSceneSwap` cross-dissolve fallback uses `SpringProgress.respectReducedMotion` → instant opacity set |
| Specular catch-light shimmer | `glass-specular-track.css:34-48` already pins specular static under PRM (glass-ui-owned; no N-wave work required) |

**The static pose discipline.** A PRM-frozen preview that is mid-animation reads broken. Each
preview component defines a `idlePosterPose` CSS class that sets the subject to its most
representative static position (spring needle at rest, dots at the wave crest, traveller at
the path midpoint). Under PRM this class is applied immediately on mount instead of starting
the loop. It is NOT a screenshot or captured frame — it is an authored CSS state.

### (c) No-VT fallback (the engine-fallback thread)

`document.startViewTransition` is absent in Firefox (all versions as of 2026-06-17). The stage
must be fully functional without VT:

- Stage ENTRY: the `startViewTransition` helper takes the instant path (the existing no-VT
  branch of `motion-core`). The stage opens without a morph — a plain opacity fade
  (`useSceneSwap`-style, implemented via a CSS `transition` on the stage's `opacity` and
  `scale` with `transition: opacity 0.2s, scale 0.2s`).
- Stage EXIT: same — plain fade out.
- COMMIT morph: `useSceneSwap` cross-dissolve already exists and handles this.
- Arrow recoil / ring orbit / hover-brighten: fully engine-driven (no VT dependency).

The no-VT fallback is NOT a degraded experience — it is the designed fallback that the
`useSceneSwap` substrate already implements. The stage is fully FUNCTIONAL in Firefox; the
shared-element morph is a progressive enhancement.

### (d) Perf budget (the frame-budget thread)

The design-synthesis §"Compositor performance budget" specifies the mitigations. N.W7 MEASURES
the result on a real browser. The gate asserts relative budget thresholds (not absolute ms,
per the CI device-dependence lesson):

- **`will-change` lifecycle:** `will-change: transform` is set ONLY on the front + adjacent
  ring items during an active spin, removed when the spring velocity drops below
  `SETTLE_THRESH`. The gate asserts `will-change === 'auto'` on all 7 items at rest.
- **Backdrop-filter count:** Only ONE element has `backdrop-filter: blur(...)` at any time
  during idle (the stage shell's `::backdrop` / the glass overlay blur — NOT per ring item).
  The gate asserts `getComputedStyle(el).backdropFilter !== 'none'` on the stage shell and
  `=== 'none'` on each ring card at rest (plain `glass-floating` — no backdrop blur on
  cards; research-glass-vt-modernweb §"Performance" — blur not per item).
- **Concurrent previews cap ≤ 5:** inherited from N.W4's `proof:stage-previews-live`; N.W7
  re-asserts it as part of the full-stage budget gate.
- **Rear blur cap at 8px:** The ring falloff applies `filter: blur(...)` to ring items; the
  maximum applied is `blur(8px)` for the farthest VISIBLE items (the research warns `>10px
  backdrop blur tanks the slow Linux CI runner`). The gate asserts `parseFloat(blur) ≤ 8`.

---

## Scope

### S1 — `useStageA11y.ts` — keyboard carousel + focus routing

**Breach.** The stage overlay has no keyboard event handlers. A keyboard-only user cannot
operate the carousel, commit to a scene, or dismiss the stage.

**Cure.** Author `demo/@/components/custom/scene-stage/composables/useStageA11y.ts`:

- Attaches a `keydown` listener on the stage root (capture phase, so it fires before any
  child handles the key).
- `ArrowLeft` / `ArrowRight`: calls `useRingOrbit.spinBy(-1)` / `spinBy(+1)` (the
  shortest-delta advance by one position).
- `Home` / `End`: calls `useRingOrbit.spinTo(scenes[0].id)` / `spinTo(scenes[6].id)`.
- `Enter`: calls `useSceneStage.commit(frontScene.id)` (the N.W6 commit path).
- `Escape`: calls `useSceneStage.close()`.
- Roving tabindex: the front ring item has `tabindex="0"`; all other items have
  `tabindex="-1"`. On ring spin settle, `tabindex` is updated (the front item gets 0,
  the departing front gets −1). `el.focus()` is called on the new front item's card
  element on spin settle (not during the spin — focus follows the settled state).
- Focus routing on OPEN: `stageRootEl.focus()` is called inside `transition.finished`
  of the entry VT (or immediately on open in the no-VT path). The `tabindex="-1"` on
  `stageRootEl` ensures it is focusable but not in the natural tab order.
- Focus routing on DISMISS: `dockTriggerEl.focus()` is called in `useSceneStage.close()`.
- Focus routing on COMMIT: `sceneHostEl.focus()` is called in the existing
  `useSceneTransition.runSceneSwitch` `finished` handler (App.vue already does this
  per the research finding at `useSceneTransition.ts:33`).

**Falsifiable check.** `proof:stage-a11y` keyboard-carousel arm:
- Open stage; assert `document.activeElement` is inside the stage overlay.
- Dispatch `ArrowRight`; await spin settle; assert front item changed.
- Dispatch `Home`; await spin settle; assert first scene is front.
- Dispatch `Enter`; await VT / fallback settle; assert stage is closed; assert
  `document.activeElement` is the scene host.
- Open stage again; dispatch `Escape`; assert stage closed; assert
  `document.activeElement` is the dock trigger.

### S2 — ARIA semantics: `role="listbox"`, `aria-live`, hit-target sizing

**Breach.** The ring has no ARIA role. Screen readers enumerate it as generic `div` elements
with no relationship. The selection signal is brightness-only (visual; fails AT).

**Cure.**

Ring semantic structure (applied in `CarouselRing.vue` + `RingItem.vue`):

```html
<div role="listbox" aria-label="Scene selector" aria-orientation="horizontal">
  <div
    v-for="(scene, i) in scenes"
    role="option"
    :aria-selected="scene.id === frontSceneId"
    :aria-label="`${scene.label}, ${i + 1} of ${scenes.length}`"
    :tabindex="scene.id === frontSceneId ? 0 : -1"
  >
    <!-- ring card content -->
  </div>
</div>
```

`aria-live` region (in `SceneStage.vue`):

```html
<div
  class="sr-only"
  aria-live="polite"
  aria-atomic="true"
  ref="liveRegionEl"
>
  <!-- text content updated reactively:
       `Now showing: ${scene.label}, ${frontIdx + 1} of ${scenes.length}` -->
</div>
```

The `aria-live` text is updated on EVERY ring settle (not on every spin frame — only when
the spring velocity has dropped below `SETTLE_THRESH`). Updating on every pixel-change would
spam AT; updating on settle is the correct granularity.

Arrow ARIA:
```html
<button aria-label="Previous scene" class="stage-arrow stage-arrow--prev">
<button aria-label="Next scene" class="stage-arrow stage-arrow--next">
```

Hit-target sizing: the arrow buttons have a minimum `min-width: 44px; min-height: 44px`
in CSS (the `>=44px` design-synthesis requirement). The gate asserts
`el.getBoundingClientRect().width >= 44 && height >= 44`.

**Falsifiable check.** `proof:stage-a11y` ARIA arm:
- Assert `[role="listbox"]` is present on the ring container.
- Assert the front `[role="option"]` has `aria-selected="true"`.
- Assert the non-front items have `aria-selected="false"`.
- After a spin settle: assert the `aria-live` region's `textContent` contains the
  front scene's label and index.
- Assert both arrow buttons have `getBoundingClientRect().width >= 44`.
- Assert `aria-label` on each arrow button matches the expected string.

### S3 — PRM: ring snap · `--stage-light` freeze · idle static poses

**Breach.** Under `prefers-reduced-motion: reduce`, the ring still orbits (SpringProgress
overshoot visible), `--stage-light` still pulses on hover (translating fill pool visible),
and idle previews animate mid-loop (frozen at an arbitrary frame).

**Cure.**

`useRingOrbit.ts`: reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
at construction time; if true, calls `ringAngleSpring.setInstant()` before every `spinTo()` /
`spinBy()` call (SpringProgress `respectReducedMotion` API — snaps to the target instantly
without spring physics). The `stagger` delays on the entry reveal are collapsed to `0ms`
under PRM.

`useStageLight.ts`: under PRM, `onItemHover()` and `onItemLeave()` no-op (returns immediately);
`--stage-light` stays at `1` on the stage root; the fill-pool translate is `50%` (centre).

Stage entry VT: `startViewTransition(..., { instantUnderReducedMotion: true })`.

Each preview component: a `usePrefersReducedMotion()` composable (or `vueuse useMediaQuery`)
reactive ref; when `prefersReducedMotion.value === true`, the preview's `RAFPlayback` is
never started and the `idlePosterPose` CSS class is applied to the subject.

Arrow CSS (`StageArrows.vue <style>`):
```css
@media (prefers-reduced-motion: reduce) {
  .stage-arrow { animation: none; transition: opacity 0.1s; }
  .stage-arrow:hover { transform: none; opacity: 0.85; }
}
```

**Falsifiable check.** `proof:stage-prm` gate:

The gate emulates PRM via `page.emulateMedia({ reducedMotion: 'reduce' })` (Playwright API —
device-independent, no OS-level PRM config required):

- Open stage under PRM; assert ring snaps to front item without transition (ring item's
  `transformStyle` / `transform` equals the settled value within one synchronous tick —
  no intermediate frames).
- Hover a flank item; assert `--stage-light` on stage root stays `'1'` (unchanged).
- Assert no arrow CSS `animation` running (via `getAnimations()` on the arrow button
  returning an empty array or PRM-blocked animations).
- Assert a preview component's subject has the `idlePosterPose` class and no
  `RAFPlayback.running === true`.
- Commit under PRM: assert the scene transition fires (commit is never blocked under
  PRM — only the animation degrades) and the new scene mounts.

### S4 — No-VT fallback: stage functional on Firefox-equivalent (`startViewTransition` absent)

**Breach.** Stubbing `document.startViewTransition = undefined` makes the stage non-functional
if the entry/exit and commit are hardwired to the VT path.

**Cure.** The no-VT fallback is the same `supportsViewTransitions()` check already used by
`useSceneTransition`. For the stage entry/exit CSS fade:

```css
.stage-overlay {
  transition: opacity 0.2s var(--ease-standard), scale 0.2s var(--ease-standard);
  @starting-style { opacity: 0; scale: 0.96; }
}
@supports (transition-behavior: allow-discrete) {
  .stage-overlay { transition-behavior: allow-discrete; }
}
```

Under the no-VT path (`supportsViewTransitions() === false`):
- Entry: the `@starting-style` CSS transition fires the fade-in (no VT snap required).
- Exit: a `close()` method sets `opacity: 0; scale: 0.96` on the overlay, waits for
  `transitionend`, then removes the overlay from the DOM.
- Commit: `useSceneSwap` cross-dissolve (existing — `SpringProgress` on the scene host's
  `opacity + scale`).

**Falsifiable check.** `proof:stage-a11y` no-VT arm:
- Stub `document.startViewTransition = undefined` via `page.addInitScript`.
- Open stage; assert overlay is present and visible (the CSS fade ran).
- Click front item to commit; assert new scene mounts; assert stage is closed.
- Assert no JavaScript errors in the console (the VT code path gracefully fell back).

### S5 — Perf budget: `will-change` lifecycle · backdrop-filter count · blur cap

**Breach.** Permanent `will-change: transform` on all 7 ring items burns GPU memory. Multiple
`backdrop-filter: blur()` layers stack GPU expense. Ring item blur exceeds 8px.

**Cure.**

`will-change` lifecycle (in `useRingOrbit.ts`):
- On spin start: `ringItems.forEach(el => el.style.willChange = 'transform')`.
- On spin settle (`velocity < SETTLE_THRESH`): `ringItems.forEach(el => el.style.willChange = 'auto')`.
- At rest (no spin in flight): all ring items have `will-change: auto`.

Backdrop-filter count: the stage shell (`SceneStage.vue`) applies `backdrop-filter: blur(24px)
saturate(0.6) brightness(0.35)` on the overlay's `::backdrop` or on the `.stage-void` scrim div.
Ring cards (`RingItem.vue`) use `.glass-floating` which has `backdrop-filter` ONLY if
`--glass-backdrop` triggers it at the ring-card rung. Per the research (research-glass-vt-modernweb
§"Performance — will-change budget"), ring cards must NOT have a per-item backdrop-filter at rest.
The fix: the ring card `backdrop-filter` is suppressed via `--glass-blur-resting: 0px` on the
`.ring-item` host WHEN the stage is open AND the item is not the front item (the front plate has
`.glass-refract` and its refraction filter; non-front cards use plain fill + rim only).

Rear item blur cap: the `useRingOrbit` falloff function returns `Math.min(blurPx, 8)` for all
items regardless of angle. The gate reads the computed `filter` string on each ring item and
`parseFloat(blur) <= 8`.

**Falsifiable check.** `proof:stage-perf-budget`:
- At rest (ring settled): assert all 7 ring items have `computedStyle.willChange === 'auto'`.
- Assert `queryAll('.ring-item').every(el => !getComputedStyle(el).backdropFilter.includes('blur'))` — no per-item backdrop blur at rest.
- Assert stage shell has `backdropFilter` containing `blur`.
- Spin the ring 360°; during the spin assert ring items have `willChange === 'transform'`; after settle assert `willChange === 'auto'` again.
- Assert `Math.max(...ringItems.map(el => parseFloat(getComputedStyle(el).filter.match(/blur\((.+)px\)/)?.[1] ?? '0'))) <= 8`.

---

## Born-RED gate

**The wave's named born-RED gates:** `proof:stage-a11y`, `proof:stage-prm`, and
`proof:stage-perf-budget` — all ABSENT today, verified 2026-06-17.

### `proof:stage-a11y` (AXIS-1 browser integration)

**The REAL observable (inv-M-observable-truth).** The genuine defect: keyboard users cannot
operate the carousel — `ArrowRight` produces no ring spin (no handler), `Enter` produces no
commit. The proxy to AVOID: a source grep asserting `@keydown` exists in `useStageA11y.ts`
(greens if the handler exists but is never attached, or is attached to the wrong element).
The gate fires a real `keydown` event and asserts the ring's `frontSceneId` changes.

**Today's tree result:** RED — `SceneStage.vue` ABSENT; `useStageA11y.ts` ABSENT.

### `proof:stage-prm` (AXIS-1 browser integration)

**The REAL observable.** The genuine defect: under PRM the ring orbits with spring physics
(overshoot, overshoot visible at `~0.15rad/s max velocity`) when `spinTo()` is called.
The proxy to AVOID: asserting `respectReducedMotion` is called somewhere in source.
The gate uses `page.emulateMedia({ reducedMotion: 'reduce' })` and measures the ring
position BEFORE and AFTER `spinTo()` with a `__tick(1)` — under PRM the position must
equal the settled value after 1 tick (instant snap); without the cure it would only partially
advance (spring step).

**Today's tree result:** RED — stage absent; emulated PRM path has no PRM branches.

### `proof:stage-perf-budget` (AXIS-1 browser integration)

**The REAL observable.** The genuine defect: after a ring settle, `will-change: transform`
remains on all 7 items permanently (GPU memory leak pattern). The proxy to AVOID: asserting
the `will-change` cleanup call exists in source (greens if the cleanup is unreachable due to
a settle condition bug). The gate measures computed `willChange` on the real mounted ring items
AFTER a real spin and settle.

**Today's tree result:** RED — stage absent; no ring items to measure.

**GREEN condition.** All three gates exit 0: keyboard carousel fully operable (all 5 key
bindings work, focus routes correctly); PRM path snaps ring + freezes `--stage-light` + static
previews; no-VT fallback opens, commits, closes on Firefox-equivalent; `will-change` lifecycle
managed; backdrop-filter count = 1 (shell only); blur cap ≤ 8px. `proof:all` stays GREEN (no
existing gate regressed by N.W7 changes).

---

## Dependencies

| Dep | Required state |
|-----|----------------|
| **N.W1–N.W6** | The full stage overlay must be present to actuate the a11y, PRM, and perf gates; partial mocks are insufficient for AXIS-1 correctness |
| **`page.emulateMedia({ reducedMotion: 'reduce' })`** | Playwright API — available in the existing browser test harness (M.W3 integration tier or the current `demo-driver.mjs`); no OS PRM configuration required |
| **`SpringProgress.respectReducedMotion`** (engine) | The `setInstant()` / `respectReducedMotion` API — already in `spring.ts:107-115`; N.W7 calls it from the ring orbit composable |
| **glass-ui `~4.0.0` PRM brackets** | `view-transition.css:27-33` (animation: none under PRM) + `glass-specular-track.css:34-48` (static specular under PRM) — glass-ui-owned, already shipped; N.W7 does not modify glass-ui (inv-16) |
| **`instantUnderReducedMotion`** (glass-ui `motion-core`) | the stage-entry VT's PRM instant path; already in `useViewTransition.d.ts` |
| inv-16 | holds — all changes under `demo/` |

---

## Bite — what regression each S-clause prevents

| Clause | Regression it prevents |
|--------|------------------------|
| S1 keyboard carousel | A keyboard / AT user cannot navigate the stage at all — the demo's a11y gate culture requires every interactive surface to be keyboard-operable; a spotlight UI with brightness-only selection fails entirely for screen-reader users |
| S2 ARIA semantics | Screen readers enumerate the ring as unlabeled `div` elements; the selection change produces no AT announcement; focus routing after commit leaves focus stranded on the now-closed overlay |
| S3 PRM path | Under PRM the ring orbits with full spring physics (overshoot visible, vestibular-trigger risk); `--stage-light` pulses on hover; idle previews animate — all three are defined PRM-noncompliant motions; the WCAG 2.3.3 requirement (animation from interactions can be disabled) |
| S4 no-VT fallback | Firefox users see a broken stage that hangs open after a commit (no fallback close path); the `startViewTransition` hardcoded call throws `undefined is not a function` |
| S5 perf budget | Permanent `will-change: transform` on 7 ring items causes GPU memory pressure on constrained devices (especially the slow Linux CI runner); per-item backdrop-filter blur creates N stacked GPU layers (the PLATE-on-PLATE failure mode the design explicitly bans); blur > 8px tanks the Linux runner (the CI device-dependence lesson — the cap is the direct consequence of the MEMORY project_ci_device_dependence_greening finding) |
