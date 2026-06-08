# impl-w12-seam — the SEAM lane (S1 + S2): `useDragScrub` extraction + the motion-path gesture lift + the store-discipline audit

**Lane:** H.W12 SEAM (S1 — I8 `useDragScrub` + the `.btn-playback` skin share; S2 — I9
the motion-path gesture-engine lift + the W1 store single-writer/pure-getter audit). This is
the SPINE the I3 affordances are BORN on (the §sequencing mandates it FIRST). All Build lanes
(S3–S7, the I3 enrichment) BIND to this note.

**Status:** LANDED, tsc-clean (`npm run check` PASS). No engine touched (`src/animation`
FENCED, inv ζ). No git commit (per directive). The new affordances DOGFOOD the engine through
the shared seam.

**Files (the seam surface — all absolute):**
- NEW `/Users/mkbabb/Programming/keyframes.js/demo/@/composables/useDragScrub.ts` (86L) — the
  single drag-scrub home (`@composables/useDragScrub`, the vite/tsconfig alias already maps
  `@composables` → `demo/@/composables/`; the dir is created by this lane).
- NEW `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/useMotionPathGesture.ts` (186L)
  — the lifted motion-path gesture engine (colocated beside its Target + `useMotionPathDemo` +
  geometry, per I10 colocation).
- M `/Users/mkbabb/Programming/keyframes.js/demo/spring/SpringTarget.vue` (169L) — consumes
  `useDragScrub`; the hand-rolled `positionFromEvent` + drag flag + window listeners DELETED.
- M `/Users/mkbabb/Programming/keyframes.js/demo/sequence/SequenceTarget.vue` (245L) —
  master-scrub consumes `useDragScrub`; Play/Reverse on the shared `.btn-playback` skin; the
  bespoke `progressFromEvent` + `.transport-active` style DELETED.
- M `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/MotionPathTarget.vue` (157L,
  `<script>` now 22L) — shrunk to refs + markup + ONE `useMotionPathGesture(...)` call; the
  whole `:79-220` gesture engine LIFTED out.

---

## 1. `useDragScrub` — the API the Build lanes bind to

```ts
// demo/@/composables/useDragScrub.ts  — import via `@composables/useDragScrub`
export interface UseDragScrubOptions<T = number> {
    el: Ref<HTMLElement | null>;        // the element that captures the pointer (rail / handle)
    project: (e: PointerEvent) => T;    // PURE scene geometry → the scrub value (clamp lives here if needed)
    onScrub: (value: T) => void;        // apply the projected value
    onStart?: (e: PointerEvent) => void;// optional: fired after capture, before first onScrub
    onEnd?: (e: PointerEvent) => void;  // optional: fired when a live drag ends
}
export interface UseDragScrub {
    dragging: Ref<boolean>;             // true while the gesture is live (drives `--dragging` affordances)
    onPointerDown: (e: PointerEvent) => void; // attach to the capture el's @pointerdown
}
export function useDragScrub<T = number>(o: UseDragScrubOptions<T>): UseDragScrub
```

**What it OWNS (the collapsed dance):** pointer-capture on `el` (try/catch — iOS/synthetic
pointers may throw, the drag still works via window listeners), window `pointermove` +
`pointerup` via `useEventListener` (vueuse owns the lifecycle — auto-cleanup on scope dispose,
no add/remove bookkeeping that can leak on a mid-drag unmount), the dragging flag, and the
early-return-unless-live guard on the move/up handlers.

**What the SCENE supplies:** ONLY its `project` (the geometry) + `onScrub` (the apply) +
optionally `onStart`/`onEnd` (the pause-for-gesture / resume hooks). It is generic over `T`
(the projected value type) — today every consumer uses `number`, but the generic keeps the
door open for a richer projection (e.g. an `{x,y}` control-point handle for the I3 editable
path) without re-typing the seam.

**Consumers (the 3 that LANDED on it; the I3 affordances add 2 more — see §4):**

| Consumer | `el` | `project` | hooks | rename |
|---|---|---|---|---|
| `SpringTarget.vue` | `railEl` | bare rect-ratio `(clientX-left)/width` (`demo.reseat` owns the clamp) | none | `onPointerDown` |
| `SequenceTarget.vue` master-scrub | `scrubEl` | `clamp01((clientX-left)/width)` | none | `onPointerDown: onScrubDown` |
| `useMotionPathGesture.ts` (path traveller) | `travellerEl` | `projectPointer` = nearest-point-on-`<path>` length ratio | `onStart`/`onEnd` (pause/resume the group sweep) | `onPointerDown` |

**Behavioral equivalence is VERIFIED LIVE:** `proof:scene-parity` PASS after the lift —
`motionpath-drag` still lands offset-distance ≈ 50% at the path's 50% point (computed
"50.3939%"); `square-drag` + `easing-curve-editable` unaffected. The seam is isomorphic to the
three former hand-rolled copies.

**`proof:dragscrub-single` (I8) is GREEN-shaped:** `setPointerCapture` and
`useEventListener(window, 'pointermove'|'pointerup')` now exist in EXACTLY ONE file
(`useDragScrub.ts`). The three scene targets carry ZERO standalone drag blocks. The
`getBoundingClientRect` reads that remain (spring rail, sequence rail, the motion-path stage
scale) are pure `project` GEOMETRY closures — the gate's `project`-callback carve-out — not the
capture+window-listener+ratio drag DANCE the gate counts.

---

## 2. The `.btn-playback` skin share (S1 / R-SEQ-C)

Sequence's transport is legitimately domain-specific (timeScale is unique to the temporal
orchestrator) — it is NOT forced onto `PlaybackRibbon` (which lacks timeScale). Instead the
SHARE is the SKIN:
- Play/Pause → `btn-playback btn-playback-accent` (the accent-red playback verb, matching the
  ribbon's Play); `:aria-pressed="demo.isPlaying.value"`.
- Reverse → `btn-playback`; `:aria-pressed="demo.isReversed.value"` — the skin's
  `[aria-pressed="true"]` rule carries the active tint (the SAME affordance the ribbon's
  Reverse uses). The former bespoke `.transport-active` scoped style is DELETED (no legacy
  beside its replacement).
- timeScale + Reset → KEEP `.btn-interactive` (the domain extras — the cube model: domain
  verbs beside the standard transport).
- The skin lives in the non-scoped colocated partial
  `@components/custom/animation-controls/controls/playback-button.css` — imported into
  `SequenceTarget.vue`'s `<script>` (the same partial the standard ribbon +
  EasingScene/SpringScene import; non-scoped so the classes match reka-ui's `<Button>` DOM).
- `text-small` is a NAMED per-site retention on the two skin-bearing buttons (the skin's
  `--type-body` would overflow the dense `grid-cols-4` row) — recorded honestly, not silent.

The `grid grid-cols-4` transport layout SURVIVES (it earns its difference — four domain verbs).

---

## 3. The lifted motion-path composable shape (S2 / I9 / R-MP-D)

`useMotionPathGesture(demo, { stageEl, guidePathEl, travellerEl })` — the gesture engine,
matching sequence/spring's shape (the composable owns the engine; the Target holds refs +
markup). It OWNS, all formerly inline in `MotionPathTarget.vue:79-220`:
- `onMounted` → `fromMotionPath(...)` build + `demo.registerAnimation` (the engine sets the
  author `offset-path` + `offset-rotate: auto` on the live traveller).
- `projectPointer` — the nearest-point-on-`<path>` search (`getTotalLength`/`getPointAtLength`).
- `applyDistance` — the `ManualTimeline` re-seat through the group scrub seam
  (`setChildTime → render`), the SAME pipeline the bottom bar rides (inv ζ — no bespoke clamp).
- the `useDragScrub` wiring (`el: travellerEl`, `project: projectPointer`,
  `onScrub: applyDistance`, `onStart`/`onEnd` = the pause-for-gesture / resume-on-release that
  mirror the bottom bar's onScrubStart/onScrubEnd).
- `onKeydown` (the slider-posture keyboard parity).

Returns `{ distance, dragging, onPointerDown, onKeydown }` — the Target binds these in markup.

**`proof:composable-encapsulation` (I9) is GREEN-shaped:** the Target's `<script>` (22L) holds
NO `getBoundingClientRect`/`getTotalLength`/`getPointAtLength`/`ManualTimeline`/`fromMotionPath`/
`setChildTime` — all 16 projection-math sites moved to the composable. The two grep hits in the
Target are comment TEXT only.

**Why a NEW colocated composable (not folded into `useMotionPathDemo.ts`):**
`useMotionPathDemo()` is the PROVIDE-side composable (group + register), called once in
`MotionPathScene.vue` and injected via the key — it has NO access to the Target's live template
refs. The gesture engine NEEDS those refs (the stage box, the guide `<path>`, the traveller).
So the faithful "composable owns the engine, Target holds refs" shape is a SECOND composable the
Target calls WITH its refs — colocated in `demo/motion-path/` beside `useMotionPathDemo` +
`motionPathGeometry` (I10 colocation honored). `useMotionPathDemo` stays the thin group/register
provider it is; the W-MP-5 "anomalously thin / engine-in-the-Target" defect is closed because
the engine now lives in a composable, not the Target.

**I3 / S6 NOTE (the editable path is born here):** `motionPathGeometry.ts` `PATH_D` is still a
const. When S6 makes it editable (the F4 elevation), the single-source invariant lives in this
composable's orbit: a control-handle drag (a 4th `useDragScrub` consumer with an `{x,y}`-or-
length `project`) re-emits `PATH_D`, and BOTH the guide `<path>` `d` AND the traveller's
`offset-path` re-read it. The `useMotionPathGesture` seam already centralizes the geometry reads
(`projectPointer` re-measures `getTotalLength` on each `onStart`), so the editable path drops in
without re-plumbing the gesture engine.

---

## 4. I3 affordances bind to the seam (the spine handoff to the Build lanes)

The seam is shaped so the I3 enrichments are BORN on it (no churn-then-delete):
- **Sequence row-drag (R-SEQ-D, proof:sequence-rows-draggable):** each storyboard row gets a
  draggable start-handle → a NEW `useDragScrub` consumer (`el` = the row's timeline track,
  `project` = rect-ratio → an `at:` offset, `onScrub` = re-emit `delays[i]` + `sequence.add`/
  re-sort via `useSequenceDemo.ts:117-120`). The seam needs NO change — supply a row `project`.
- **Motion-path control points (R-MP-B, proof:motion-path-editable):** each cubic control point
  is a draggable SVG handle → a NEW `useDragScrub` consumer on `useMotionPathGesture`'s seam
  (`el` = the handle, `project` = client→user-units via the SAME stage-rect scale `projectPointer`
  already computes, `onScrub` = update a control point → re-emit `PATH_D`). The generic `T` on
  `useDragScrub` accommodates an `{x,y}` projection if the handle needs both axes.

Both dogfood `useDragScrub` (S1) + the engine (`Sequence.add`/re-sort, `setChildTime().render()`,
inv ζ). The §sequencing order holds: the seam landed FIRST.

---

## 5. Store-discipline findings (S2 — the W1 store audit)

The contract named `scenePlayback.ts`/`controlOptionsStore.ts`/`animationOptionsStore.ts`. Note
the W1 FSM refactor renamed/replaced `scenePlayback.ts` — the active store surface is now
`stores/sceneMachine.ts` (pure reducer) + `stores/useSceneMachine.ts` (reactive shell) +
`stores/scenePlaybackAdapters.ts` (the per-scene adapters); plus the two option stores. Audited
all of them:

- **`useSceneMachine.ts` — single-writer/pure-getter discipline HOLDS (no change needed).** The
  exported surface is `dispatch()` (the LONE write) + READONLY refs (`status`, `activeScene`,
  `perScene`, `machine`, `controlSurfaces`) + the adapter registry (`register`/`adapterFor`/
  `gcOrphans`). There is no writable activeScene/status surface. The control-surface projection
  (`controlSurfaces`/`controlSurfacesFor`) is a PURE reactive derivation of `activeScene` — no
  write side-effect. **VERIFIED LIVE:** `proof:single-writer` PASS ("no `.activeScene`/`.status`
  assignment in any of 162 demo source files outside the FSM core; the only mutation surface is
  dispatch(); the axes are readonly refs"). `proof:scene-machine-irrefragable` PASS (the FSM
  identity, suspend-no-orphan-raf, deep-link-wins, deterministic restore all hold).

- **`controlOptionsStore.ts` / `animationOptionsStore.ts` — clean; ONE recorded-and-accepted
  pattern.** These are NOT W1-FSM reactive stores — they are lazy-localStorage keyed accessors
  (`createGlobalState` + `useStorage`). `getStoredAnimationGroupControlOptions` and
  `getStoredAnimationOptions` DO write the store on a cache MISS (default-seeding a missing
  key/animationId via `structuredClone(default...)`). That is a read-with-write-side-effect in
  the literal sense — BUT it is the established memoize-on-read / lazy-singleton idiom (seed the
  default once, idempotent thereafter), NOT a reactive getter with a hidden reactive mutation. It
  is the SAME pattern every scene wrapper relies on (e.g. `MotionPathScene.vue` reads then sets
  `isControlsPanelOpen = false`). It is NOT a W1-FSM getter and NOT in the single-writer axes.
  Disposition: **accepted as-is** (idiomatic lazy-init, not a defect); recorded honestly so the
  Build lanes do not "fix" it into eager seeding (which would regress the lazy-load behavior).

- **No read-with-write-side-effect getter exists on any reactive/FSM store.** The discipline the
  W1 ST-7/ST-9 findings began is intact; this lane found nothing to re-author (KISS — consistency,
  not a rewrite, as the contract §Design-decision states).

---

## 6. Out-of-lane finding (handoff to S4/I11)

`proof:brittleness` reports ONE pre-existing `✗` NOT in this lane's changeset:
`demo/square/useSquareAnimations.ts` — a raw `new RAFPlayback()` with no dispose-time `stop()`
(the loop leaks past unmount). Confirmed via `git status`: `useSquareAnimations.ts` is unmodified
by this lane (the seam touches spring/sequence/motion-path + the two new composables only). This
is a SQUARE-scene brittleness chronic, pre-dating W12 — recorded here for the I11/S4 (de-brittle)
lane to fold (add `onScopeDispose(() => playback.stop())` or ride `useRafLoop`'s auto-cleanup).
NOT introduced by, and NOT in scope for, the seam lane.

---

## 7. tsc / gate status at lane close

- `npm run check` (tsc --noEmit) — PASS (baseline was clean; clean after).
- `proof:single-writer` — PASS.
- `proof:scene-machine-irrefragable` — PASS.
- `proof:scene-parity` — PASS (incl. live `motionpath-drag` post-lift equivalence).
- `proof:brittleness` — the lone `✗` is the pre-existing square-scene leak (§6), out of lane.

The W1 FSM + the W10 normalization + the W11 card/DFA all hold (no regression). The seam is
ready; the Build lanes (S3 colocate-verify, S4 de-brittle, S5 idioms, S6 I3 enrichment, S7 J
easing-minimalism) build on `useDragScrub` + `useMotionPathGesture`.
