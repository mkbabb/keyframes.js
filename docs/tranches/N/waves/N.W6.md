# N.W6 — Hover-brighten · focus-shift · commit handoff

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** N.W1 (the
  stage shell — the `--stage-light` @property and `StageDownlight.vue` must exist for the
  hover-brighten to have a target); N.W2 (the carousel ring engine — the hover event is
  emitted by a ring item, and the commit triggers `spin-to-front` before the VT fires);
  N.W3 (the arrows — their press recoil and `decay()` lunge are part of the commit
  choreography pre-condition for the spin-to-front settle). N.W4 and N.W5 are NOT
  required — the commit path works without live previews, though the morph quality
  degrades.
- **Gate (born-RED, the commit-path roster):**
  - `proof:stage-hover-brighten` — **does NOT exist today** (no `--stage-light` CSS
    `@property` is registered; no `useStageLight.ts` composable exists; no hover listener
    on ring items lifts `--stage-light`). Born-RED: the `--stage-light` registered
    `@property` is absent from the codebase (`grep -rn "stage-light" demo/` → 0 matches,
    verified 2026-06-17).
  - `proof:stage-commit-path` — **does NOT exist today** (`SceneStage.vue` ABSENT; the
    `runSceneSwitch` integration from the stage is not wired). The gate asserts: a commit
    from the stage (clicking the front ring item or pressing Enter) routes through the
    EXISTING `runSceneSwitch` / `startViewTransition` path (not a forked nav); the new
    scene mounts; `data-scene-state` on the scene root is `'idle'` after the transition
    settles; and the `sceneMachine` snapshot (the K-era state preservation mechanism)
    persists the prior scene's state across the commit — NOT KeepAlive.

---

## Context

N.W6 is the payoff wave: it wires the `--stage-light` intensity authority to user intent,
delivers the choreographic lock-in moment, and validates that the commit exits through the
existing infrastructure with state preserved.

Three threads:

**(a) Hover-brighten / focus-shift** — hovering a non-front ring item lifts `--stage-light`
toward it (+0.22) and de-emphasises the front centre (−0.12) via a translating secondary fill
pool. The effect is subtle (~200ms `SpringProgress`), reading as "attention turning, not
camera moving" (design-synthesis §"Hover-brighten / focus-shift quantified"). `warmScene(id)`
fires on hover to prefetch the scene chunk.

**(b) Focus-shift** — the secondary fill pool is a `<div class="stage-fill-light">` inside
`StageDownlight.vue`; its `radial-gradient` translates ~40% toward the hovered item's
screen-X via a `SpringProgress`-driven `translateX`. This pool is separate from the main
`--stage-light` cone (which stays centred) — only the secondary fill and the per-item
brightness move.

**(c) Commit handoff** — click front item OR press Enter → (1) spin settles (if not already
front); (2) lock-in beat (floor pool +0.15 brightness pulse, 240ms); (3)
`runSceneSwitch(id)` fires inside `startViewTransition`; (4) the front preview's
`view-transition-name` is set to `scene-subject` BEFORE the VT mutation, removed on
`finished.finally()`; (5) the stage exits via the reverse liquid-glass VT; (6) the new scene
mounts and enters its idle state. Scene state is preserved via `sceneMachine` snapshot (the
existing K-era mechanism) — NO KeepAlive.

### The `--stage-light` authority model

`--stage-light` is the single registered `@property` that scales the cone+pool intensity
(design-synthesis §4 locked decision). `useStageLight.ts` is its SOLE WRITER — no
component writes `--stage-light` directly. The composable exposes:

```ts
interface StageLightState {
  baseLine: number;      // 1.0 — the cone at rest
  hoverLift: number;     // +0.22 on hovered flank item's own card
  frontDim: number;      // −0.12 on front card when a flank is hovered
  fillTranslateX: number; // 0–1 toward hovered item's screen-X
}
```

The `--stage-light` CSS variable on the stage root is `baseLine * (1 + hoverLift)` for a
hovered item's card and `baseLine * (1 + frontDim)` for the front card when a flank is
hovered. `fillTranslateX` drives the secondary fill pool's `translateX` via a derived
Spring.

A `SpringProgress` (response 0.35, damping 0.85 — a slow, smooth reaction per the
design-synthesis quantification) drives all four values from their current state to their
hover target, and back to rest on `mouseleave` (return ~300ms). The spring re-seats from
current (x, v) on any mid-hover state change — interruptible.

### The VT name discipline for the commit morph

The commit morph reuses the EXISTING `view-transition-name: scene-subject` on the scene
host (`App.vue:461`).

> **⚠N4 HAZARD — CORRECTED (adversarial audit, 2026-06-17).** The scene host carries
> `scene-subject` PERMANENTLY (`App.vue:461`; the comment at `App.vue:454` is explicit:
> "`view-transition-name` on the scene host means exactly ONE element per VT"). The VT spec
> SILENTLY SKIPS the whole transition if **two** elements share one `view-transition-name`
> in the SAME captured state — so assigning `scene-subject` to the front preview while the
> host STILL holds it is the collision, NOT a benign "coexist for one frame" (the original
> wording was wrong: same-name coexistence IS the skip condition). The old-state snapshot
> can have exactly one `scene-subject` holder, and the new-state snapshot exactly one.

The CORRECT handoff procedure (one name, one holder per captured state):

1. Before calling `startViewTransition`, in the SAME synchronous frame: assign
   `scene-subject` to the front carousel preview AND remove it from the *old* scene host
   so the OLD captured state has exactly one `scene-subject` holder (the preview). Use a
   distinct transient name if the old host must remain captured (e.g. `scene-subject-out`)
   — but the simplest correct form is preview-holds-old, host-holds-new.
2. Inside the VT `mutate()` callback: `runSceneSwitch(id)` mounts the new scene; the new
   host (re-)acquires `scene-subject` so the NEW captured state has exactly one holder.
3. In `transition.finished.finally()`: clear `frontPreviewEl.style.viewTransitionName = ''`
   and restore the host's `scene-subject` to its resting single-holder invariant.

This is the "dynamic name technique" from the same-document-transitions guide; the
load-bearing rule is **at most one element per name per captured snapshot**, not "transient
names never collide". `proof:stage-commit-path` MUST assert this mid-transition uniqueness
(see C6 below), not merely the post-`finally` cleanup.

### The KeepAlive hard rule

The commit path MUST NOT add a `KeepAlive` or `Transition` wrapper around the keyed
`<Suspense>` scene host. The B.W3 async-loader blank-viewport blocker is the documented
footgun: wrapping a keyed Suspense over a `defineAsyncComponent` prevents the chunk from
ever being fetched. State preservation rides the `sceneMachine` snapshot (the K-era
mechanism: `sceneMachine.context` is persisted to localStorage; per-scene stores restore
on fresh mount).

The `proof:stage-commit-path` gate includes a clause asserting the keyed Suspense host
has NO `KeepAlive` or `Transition` ancestor in the mounted component tree
(verified via `page.evaluate(() => document.querySelector('.scene-host').closest('[data-component="KeepAlive"]'))
=== null`).

---

## Scope

### S1 — `@property --stage-light` registered + `StageDownlight.vue` wired to it

**Breach.** `--stage-light` is not a registered `@property` today (`grep -rn "stage-light"
demo/` → 0 matches). Without registration as `syntax: '<number>'; inherits: true;
initial-value: 1`, the CSS property cannot interpolate natively and `@property`-gated hover
transitions are impossible.

**Cure.** `StageDownlight.vue` includes in its `<style>`:

```css
@property --stage-light {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --front-dim {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
```

The cone and pool `background` computations reference `--stage-light` (as designed in
research-glass-vt-modernweb.md §"Downlight cone — concrete CSS"). The `--front-dim`
property scales the front card's brightness (computed as `1 - var(--front-dim) * 0.12`).
The stage root element has `--stage-light: 1` in its inline style by default; `useStageLight`
updates it per-frame during hover via a `SpringProgress`-driven value written on the
`requestAnimationFrame` tick owned by `RAFPlayback`.

**Falsifiable check.** `getComputedStyle(stagePlaneEl).getPropertyValue('--stage-light')`
returns `'1'` at rest; after a `pointerenter` event on a flank ring item and a
`__tick(250)`, the value has changed toward `1.22`. `CSS.supports('@property --stage-light',
'...')` is true on the test browser.

### S2 — `useStageLight.ts` — the `--stage-light` SpringProgress authority

**Breach.** No composable manages the hover-brighten state. Individual ring items write
`--stage-light` directly → race conditions on hover-leave / multi-item hover sequencing.

**Cure.** Author `demo/@/components/custom/scene-stage/composables/useStageLight.ts`:

- Owns ONE `SpringProgress` (response 0.35, damping 0.85) over a 3-vector target:
  `[hoveredBrightness, frontDim, fillTranslateX]`.
- Exposes `onItemHover(idx: number, itemScreenX: number)` and `onItemLeave()`.
- On `onItemHover`: sets the spring target to `[baseLine + 0.22, 0.12, normalizedScreenX]`;
  fires `warmScene(sceneId)` for prefetch.
- On `onItemLeave`: sets target to `[baseLine, 0, 0.5]` (centre fill).
- On each `RAFPlayback` tick: writes `stage.style.setProperty('--stage-light',
  String(spring.x[0]))` and `stage.style.setProperty('--front-dim', String(spring.x[1]))`
  and sets the fill-pool's inline `transform: translateX(...)` from `spring.x[2]`.
- The `RAFPlayback` is the SAME instance owned by `useRingOrbit` (passed in as a dep) OR
  an independent `RAFPlayback` that `useStageLight` owns — either way, no hand-rolled rAF
  (inv-ζ).

**Falsifiable check.** `onItemHover(2, 0.75)` sets the spring target to `[1.22, 0.12,
0.75]`; after `__tick(300)`, `spring.x[0]` is within 0.05 of `1.22` (converged);
`--stage-light` on the stage root reflects the spring's current value. `onItemLeave()`
returns to `[1.0, 0, 0.5]` within `__tick(300)`.

### S3 — Per-item brightness lift (the `.ring-item[data-hovering="true"]` brightness delta)

**Breach.** Per-item brightness is uniform (`opacity` only from the ring falloff). The
hover-brighten per the design-synthesis is a +0.22 BRIGHTNESS lift on the HOVERED item's
CSS `filter: brightness()`, distinct from the global `--stage-light` cone change.

**Cure.** `CarouselRing.vue` / `RingItem.vue` applies a CSS variable `--item-hover-boost`
(0 at rest, written by `useStageLight` on hover). The ring item's host applies:
`filter: brightness(calc(1 + var(--item-hover-boost, 0))) blur(...)`. On hover:
`--item-hover-boost: 0.22`; on leave: `0`. This is a CSS-only property (the variable
transition is handled by the `@property` mechanism or a short CSS `transition`) — the
`useStageLight` spring drives `--stage-light` globally AND sets `--item-hover-boost` on the
individual item's host style.

The `translateZ +28px` "closer look" lift is a CSS variable `--item-hover-z: 28px` applied
on the ring item's 3D transform when `data-hovering="true"` — a layout-free compositor
property (transform only).

**Falsifiable check.** After `onItemHover(idx)`: `ringItemEl.style.getPropertyValue
('--item-hover-boost')` is `'0.22'` (or resolves to that); `ringItemEl` has `translateZ`
28px above its base value. After `onItemLeave()`: both return to 0. The front card
simultaneously has `--item-hover-boost: −0.12` (or the `--front-dim` mechanism applies
to it) — verifiable by querying the front ring item's computed brightness.

### S4 — The commit choreography (spin-settle → lock-in → VT → state preserved)

**Breach.** No commit path exists from the stage to `runSceneSwitch`. The stage overlay has
no way to trigger a scene change and is isolated from the existing routing.

**Cure.** `useSceneStage.ts` exposes `commit(sceneId: string)`:

1. If the ring's `frontScene !== sceneId`: call `useRingOrbit.spinTo(sceneId)` and `await
   ringSettled` (a `Promise` that resolves when `SpringProgress.velocity < SETTLE_THRESH`).
2. Lock-in beat: set `--stage-light: 1.15` (the +0.15 floor-pool pulse) via
   `useStageLight.lockIn()`, hold 240ms of virtual time via `__tick(240)` (in test) or a
   `setTimeout(resolve, 240)` (in prod — real 240ms lock-in feel, not animation-settled).
3. Set `frontPreviewEl.style.viewTransitionName = 'scene-subject'`.
4. Call `useSceneTransition.runSceneSwitch(sceneId)` (the EXISTING path — `startViewTransition`
   wraps the `sceneMachine.send('SWITCH', { id: sceneId })` mutation).
5. In `transition.finished.finally()`: clear `frontPreviewEl.style.viewTransitionName = ''`;
   close the stage overlay.

The `sceneMachine` snapshot preserves the previous scene's state (the K-era mechanism:
`sceneMachine.context` is persisted to localStorage via the existing `usePersist` composable).
No KeepAlive. The new scene mounts fresh and restores its state from the snapshot on mount.

**Falsifiable check.** The `proof:stage-commit-path` gate:

```
1. Open the stage overlay.
2. Click a non-front ring item (e.g. index 2).
3. Assert ring spins to front (spring settles, data-front-id === the clicked scene id).
4. Click the front item (or dispatch Enter on the stage).
5. Assert document.startViewTransition was called (spy on the function OR check
   the 'scene-subject' VT name was transiently set via MutationObserver).
6. Assert the new scene's root is present in the DOM (the Suspense resolved).
7. Assert data-scene-state on the new scene root === 'idle' after settle.
8. Assert sceneMachine.context persists across the transition (localStorage key unchanged).
9. Assert NO KeepAlive ancestor on the scene host.
```

**Falsifiable check — state preservation.** Navigate to SpringScene; set a specific
`response` value (e.g. `0.3`); commit to CubeScene; navigate back to SpringScene via a
second commit; assert the `response` slider reads `0.3` (the snapshot restored). Today: no
commit path exists → born-RED.

### S5 — No-VT fallback path (the `useSceneSwap` cross-dissolve)

**Breach.** In browsers where `document.startViewTransition` is absent (Firefox), the commit
has no fallback and the stage stays open indefinitely.

**Cure.** `useSceneTransition.runSceneSwitch` (the existing path) already falls back to the
`useSceneSwap` `SpringProgress` cross-dissolve when `supportsViewTransitions()` is false. The
stage commit via `commit(sceneId)` uses this same path — no fork. In the no-VT path: skip the
`frontPreviewEl.style.viewTransitionName` assignment (there is no VT to snap), call
`runSceneSwitch(sceneId)` directly, and the `useSceneSwap` dissolve handles the cross-fade.
The lock-in beat (240ms) still fires; the stage closes after the `useSceneSwap` transition
settles.

**Falsifiable check.** Stub `document.startViewTransition = undefined` in the test page;
execute `commit(sceneId)`; assert the scene transitions (the DOM changes to the new scene's
content) and the stage closes. Assert `viewTransitionName` was NOT set on the front preview
element (no VT, no name assignment needed). Today: the fallback path does not exist in a
stage context.

---

## Born-RED gate

**The wave's named born-RED gates:** `proof:stage-hover-brighten` AND
`proof:stage-commit-path` — both ABSENT today, verified 2026-06-17.

### `proof:stage-hover-brighten` (AXIS-1 browser integration)

**The REAL observable (inv-M-observable-truth).** The genuine defect: hovering a ring item
produces NO change in the `--stage-light` CSS property on the stage root and NO change in the
hovered item's `filter: brightness()`. The proxy to AVOID: asserting `useStageLight.ts` exists
and calls `setProperty` somewhere (greens if the function is present but the spring never
settles or the rAF is never called). The gate's born-RED witness fires a `pointerenter` on a
flank ring item, advances 250ms of virtual time via `__tick(250)`, and asserts
`getComputedStyle(stageRootEl).getPropertyValue('--stage-light')` differs from `'1'`.

| Clause | Today's tree | After cure |
|---|---|---|
| C1 — `@property --stage-light` registered | absent (`grep → 0`) | present; `CSS.supports` confirms |
| C2 — hover lifts value | n/a | `--stage-light > 1.0` after `pointerenter` + `__tick(250)` |
| C3 — leave returns to 1.0 | n/a | `--stage-light ≈ 1.0` after `pointerleave` + `__tick(300)` |
| C4 — front dims simultaneously | n/a | `--front-dim > 0` on front item while flank hovered |
| C5 — `warmScene` fires | n/a | `scenes.ts:warmScene` called with the hovered scene id |

**Today's tree result:** RED — `--stage-light` ABSENT, composable ABSENT.

### `proof:stage-commit-path` (AXIS-1 browser integration)

**The REAL observable.** The genuine defect: clicking the front ring item produces no scene
transition — the stage has no wiring to `runSceneSwitch`. The proxy to AVOID: asserting
`commit()` calls `runSceneSwitch` in a unit test without mounting the real SPA (greens if
the call is present but the VT mutation fails silently). The gate actuates the REAL SPA.

| Clause | Today's tree | After cure |
|---|---|---|
| C1 — commit triggers VT | `SceneStage.vue` absent → no commit | `startViewTransition` called (or `useSceneSwap` fallback) |
| C2 — new scene mounts | n/a | scene root present in DOM, Suspense resolved |
| C3 — scene enters idle | n/a | `data-scene-state === 'idle'` after settle |
| C4 — state preserved | n/a | `sceneMachine.context` unchanged across transition |
| C5 — no KeepAlive ancestor | n/a | no `[data-component="KeepAlive"]` ancestor on scene host |
| C6 — VT name UNIQUENESS (⚠N4) | n/a | at the VT capture (snapshot) instant, AT MOST ONE element holds `scene-subject` (the gate spies the captured state — e.g. wraps `startViewTransition` and counts `[style*="view-transition-name: scene-subject"]` + the host's computed name inside the `mutate` callback); AND the transition is NOT silently skipped (`transition.ready` resolves, `transition.skipTransition` was not the path) — the REAL collision observable, not just post-cleanup |
| C6b — VT name cleanup | n/a | front preview `viewTransitionName === ''` after `finished.finally`; host restored to its single resting `scene-subject` |
| C7 — no-VT fallback | n/a | commit succeeds with `startViewTransition` stubbed |

**Today's tree result:** RED — `SceneStage.vue` ABSENT; no commit wiring to `runSceneSwitch`.

**GREEN condition.** `proof:stage-hover-brighten` exits 0 (all 5 clauses pass); `proof:stage-commit-path`
exits 0 (all 7 clauses pass); `proof:boundary` stays GREEN (no new heavy import introduced by
N.W6 code paths — the hover and commit are in the stage overlay which is LIGHT-barrel-only for
the interaction layer; `runSceneSwitch` is called via the composable import, not a direct engine
import).

---

## Dependencies

| Dep | Required state |
|-----|----------------|
| **N.W1** (stage shell + `StageDownlight.vue`) | `@property --stage-light` host; the stage root element that `useStageLight` writes to |
| **N.W2** (carousel ring engine) | `useRingOrbit.spinTo()` and `ringSettled` promise; the per-item `effectiveAngle` for `onItemHover` screenX calc |
| **N.W3** (arrows — soft dep) | arrows' `decay()` lunge is part of the commit pre-choreography; N.W6 assumes the spin from an arrow press is the same `spinTo` path as a direct click — arrows may be absent and commit still works |
| **N.W5** (live scene idle states — soft dep) | `data-scene-state === 'idle'` in the commit gate's C3 clause; N.W6 authors the commit path; N.W5 authors the state that C3 reads. If N.W5 is absent, C3 is relaxed to `data-scene-state !== 'playing'` |
| **`useSceneTransition.runSceneSwitch`** (existing) | the commit must route through this path; it already exists |
| **`sceneMachine`** (existing) | state snapshot preservation; must not be wrapped in KeepAlive |
| **glass-ui `~4.0.0`** | `startViewTransition` from `@mkbabb/glass-ui/motion-core` (already used in `useSceneTransition`) |
| inv-16 | holds — all changes under `demo/` |

---

## Bite — what regression each S-clause prevents

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `@property --stage-light` | Without `@property` registration, `--stage-light` is a string and cannot interpolate natively; the hover-brighten produces no transition (silent failure) |
| S2 `useStageLight` | Multiple ring items independently write `--stage-light` → race condition; or the global cone brightens instead of the item-local filter lifting → wrong visual (camera moving instead of attention turning) |
| S3 per-item brightness | A hover produces only the global cone change with no per-item brightness lift — the DK64 "one protagonist brightens" effect is absent |
| S4 commit choreography | The stage has no path to `runSceneSwitch` → clicking the front item does nothing; OR the commit forks a second nav path (bypassing `sceneMachine` reconcile, focus routing, the no-VT fallback) → the KeepAlive footgun risk returns |
| S5 no-VT fallback | On Firefox (no `startViewTransition`), the commit freezes the stage open — the `useSceneSwap` fallback is the existing cross-dissolve that the design explicitly preserves |
