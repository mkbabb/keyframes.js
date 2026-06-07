# Tranche G — Audit: frontend state + store management (lane `a-frontend-state`)

**Scope.** The demo's state + store tier on `tranche-g-dev` (D+E+F implemented +
released; kf 4.0.0, vueuse 14.3.0, Vue 3.5.35): the pinia-shaped `stores/` cohort,
`markRaw` + manual-reactive-sync (the `AnimationGroup` bridge), provide/inject
seams, `useX` composable consistency (naming, return-shape, the
getter-fn-for-composables rule, the never-destructure-`defineProps` rule), vueuse
storage idioms (`useStorage`/`useRefHistory`/`createGlobalState`), and the
reactivity patterns (`watch` flush, `watchEffect`, `computed`). Read-only; ZERO
source edits (tranche development).

**Method.** Read every file under `demo/@/components/custom/animation-controls/stores/`,
the App-level scene-state composables (`useSceneGroupSync`, `usePlaybackSnapshot`,
`useSceneRouter`, `useShareState`), the `markRaw`-bridge composables
(`useAnimationSync`, `useTimelineBuild`, `useTimeline`), `useAssetManager`, the
provide/inject keys + their consumers, and every `defineProps` destructure
callsite (census via grep over source-only, `dist/` excluded). Grounded every
claim at `file:line` against the live tree. Verified the Vue version (3.5.35 —
**reactive-props-destructure is STABLE**, not experimental) and the vueuse version
(14.3.0) because the dispositions hinge on both. Extends — does not repeat —
`F/audit/a-demo-post-e.md` (the structural/usability demo lane), which booked the
F.W14 undo/redo seam now landed.

---

## Headline

**The frontend-state tier is ~95% ALREADY-SOTA and the Mandate's hardest rules are
HONORED, not violated.** The thing this lane was most likely to find — destructured
`defineProps` feeding composables and losing reactivity (the memory feedback's
explicit ban) — is **NOT a bug here**: every destructured prop that crosses a
composable/store boundary is wrapped in a **getter function** (`() => animationGroup`,
`() => animation`, `getAnimation: () => animation`), which is exactly the
getter-fn-for-composables rule, correctly applied on Vue 3.5's stable
reactive-props-destructure. The provide/inject seams are textbook
(`InjectionKey<T>` + `Symbol`, defaults at inject sites). The store cohort, the
`markRaw` bridge with its documented settle-gate, the `useRefHistory` undo, the
`flush: 'post'` + `nextTick` markRaw-projection watch — all are deliberate and
well-reasoned.

The residual is **one genuine SHIP** (a store-idiom inconsistency: `useAssetManager`
is the only stateful store NOT wrapped in `createGlobalState`, and it is
instantiated twice — parent + child — creating two reactive refs over one
localStorage key), **one small SHIP** (a dead exported `stateVersion` ref with zero
consumers), and **two RECORDs** of implicit-invariant patterns that are correct but
unasserted (the eager prop-read-at-setup that relies on per-instance prop
stability). Nothing is a rebuild; nothing manufactures a deficit.

---

## §1 — `useAssetManager` is the ONE store outside the `createGlobalState` idiom — and is double-instantiated `[MED — SHIP-in-G]`

**The inconsistency is verified against the established store idiom.** The two
animation stores wrap `useStorage` in `createGlobalState` so the reactive ref is a
**process singleton** — every caller shares ONE ref:

- `animationOptionsStore.ts:58` — `useAnimationGroupsOptionsStore = createGlobalState(() => { const store = useStorage(...); ...; return store; })`
- `controlOptionsStore.ts:35` — `useAnimationGroupsControlOptionsStore = createGlobalState(() => { const store = useStorage(...); ...; return store; })`

`useAssetManager` does **not**:

- `useAssetManager.ts:38-42` — `export function useAssetManager() { const state = useStorage<AssetManagerState>("asset-manager-state", {...}); ... }` — a **raw** `useStorage`, no `createGlobalState` wrap.

And it is called **TWICE** — once in the parent and once in a descendant component:

- `playground/App.vue:70` — `} = useAssetManager();`
- `AssetLayerPanel.vue:133` — `} = useAssetManager();` (a child of the same `playground/App.vue` tree — `playground/App.vue:13` renders `<AssetLayerPanel>`).

Each call constructs a **separate** deep-reactive ref + its own storage write
subscription over the **same** `"asset-manager-state"` key. vueuse 14.3.0's
`useStorage` does auto-synchronize same-document instances on a key (an internal
per-key event bus), so this is **functionally correct today** — but it is (a) an
idiom break (the only stateful store not made a singleton), (b) redundant — two
deep-reactive proxies + two serializers fire on every asset mutation
(`addAsset`/`updateTransform`/`selectAsset` push through `state.value.*` on
`useAssetManager.ts:71,107,119` etc.), and (c) **silently fragile**: the
correctness is load-bearing on an undocumented vueuse same-document-sync detail,
exactly the "graceful-handling we did not author" the Mandate names. The
selection/transform state diverging between the layer panel and the viewport would
be a latent bug if that sync path ever changed.

- **Disposition.** **SHIP-in-G.** Wrap `useAssetManager` in `createGlobalState`
  (or `createSharedComposable`), matching `animationOptionsStore`/`controlOptionsStore`
  one-for-one — the store cohort's own established idiom. The `useStorage` body,
  the `STORE_KEYS`/TTL discipline (note: `"asset-manager-state"` is already in
  `storeUtils.ts:8`), and the public return-shape are unchanged; only the
  singleton wrap is added. This makes the parent + child provably share ONE ref,
  kills the redundant subscription, and removes the dependence on the
  same-document-sync internal.
- **Isomorphism.** Behaviour-isomorphic for the happy path (the refs already sync);
  the named delta is "two refs → one ref" (fewer subscriptions, no functional
  pixel change). No template/markup change.
- **Falsifiable instrument (SHIP gate).** A `proof:asset-store-singleton` clause:
  `useAssetManager() === useAssetManager()` returns the **same** `state` ref
  identity (bites today — two `useStorage` calls yield two distinct refs); plus a
  behavioural assert that a mutation through one handle is observed by the other
  WITHOUT a storage round-trip (the singleton guarantee, not the same-doc-sync
  accident). Apply the TTL/reset path too: `resetAllStores` (`stores/index.ts:46`)
  already `localStorage.removeItem`s `"asset-manager-state"` via `STORE_KEYS` but
  does NOT reset the live `useAssetManager` ref (it has no `_reset` like the other
  two — `index.ts:42-43` only resets the two animation stores); the singleton wrap
  makes a `_resetAssetManagerStore` symmetric and wireable into `resetAllStores`.

> **inv ε note.** Verified: two raw `useStorage` callsites (`App.vue:70`,
> `AssetLayerPanel.vue:133`) over the key declared at `storeUtils.ts:8`; the two
> sibling stores use `createGlobalState` (`animationOptionsStore.ts:58`,
> `controlOptionsStore.ts:35`); `resetAllStores` resets only the two animation
> stores (`index.ts:42-43,46-53`). The asset store is the asymmetry.

---

## §2 — `useShareState` exports a dead `stateVersion` reactive counter `[LOW — SHIP-in-G]`

**A vestigial hand-rolled reactivity-bump ref with zero live consumers.**
`useShareState` declares, increments, and returns a `stateVersion` ref:

- `useShareState.ts:17` — `const stateVersion = ref(0);`
- `useShareState.ts:78` — `stateVersion.value++;` (on a successful load-from-input)
- `useShareState.ts:96` — returned in the public shape.

A source-only grep for `stateVersion` returns **only those three lines** — nothing
consumes it (no watcher, no template binding, no computed). `demo/CLAUDE.md` still
documents it ("no-reload state restore via `stateVersion` counter"), so this is a
**maintenance lie**: a counter that once drove a re-render signal and is now dead
weight. The restore path it was meant to signal now works through the store refs
directly (`restoreStateFromParam` `Object.assign`s into the reactive store values,
`hashSharing.ts:59-67`, which triggers reactivity without a manual version bump) +
the `onSceneRestore` callback (`useShareState.ts:81-83`). A hand-rolled version
counter beside genuine reactivity is precisely the legacy-shape the Mandate forbids
(a workaround beside the real mechanism).

- **Disposition.** **SHIP-in-G.** Delete `stateVersion` (the `ref`, the `++`, the
  return entry) and strike its mention from `demo/CLAUDE.md`. Verify no
  cross-package consumer first (the grep says none in `demo/`).
- **Isomorphism.** Pixel- and behaviour-identical — it drives nothing.
- **Falsifiable instrument.** A `proof:no-dead-export` grep clause (or a tsprune/
  knip pass over `demo/@`) asserting `useShareState`'s return has no unconsumed
  member; bites today on `stateVersion`. (Low-cost: the deletion is its own proof —
  the build stays green because nothing references it.)

---

## §3 — RECORD: the eager prop-read-at-setup pattern relies on an UNASSERTED per-instance prop-stability invariant `[RECORD]`

**Two callsites read a destructured prop EAGERLY at setup (not through a getter) to
resolve a store handle** — correct today, but the correctness is an implicit,
unasserted invariant:

- `AnimationControlsGroup.vue:154` — `const storedControls = getStoredAnimationGroupControlOptions(superKey);` (`superKey` is a destructured prop, `:147`).
- `AnimationControls.vue:155` — `const storedControls = getStoredAnimationGroupControlOptions(animation);` (`animation` is a destructured prop, `:147`).

Neither re-resolves `storedControls` if its source prop changes after setup. This
is **safe** because both components are guaranteed a STABLE prop for their instance
lifetime — but by two DIFFERENT mechanisms, neither asserted at the seam:

1. **ACG** is keyed `:key="superKey"` (`EditorShell.vue:63`), so a superKey change
   **remounts** the component → a fresh setup re-reads it. The two-fire remount
   choreography is documented in `useSceneGroupSync.ts:44-97` (the "stable fire"
   detection). The eager read is correct *because* of the key.
2. **AnimationControls** is created in a `v-for` over
   `Object.entries(animationGroup.animations)` (`ControlsPaneWrapper.vue:28-47`),
   so each instance has a 1:1 stable binding to ONE `groupObject.animation`
   (`:animation="groupObject.animation"`, `:43`) for its lifetime — the `animation`
   prop never mutates for a given instance.

Both are deliberate and consistent with the codebase's reactive pattern (compare
`App.vue:218`, which CORRECTLY makes the same resolution reactive via
`computed(() => getStoredAnimationGroupControlOptions(currentSuperKey.value))` —
because at App level the super-key DOES change in place). The gap is only that the
"prop is stable for this instance" invariant is **implicit** — a future refactor
that removed the `:key` on ACG, or made AnimationControls swap its `animation` prop
in place, would silently produce a stale `storedControls` with no gate to catch it.

- **Disposition.** **RECORD** (do not SHIP a getter rewrite — it would be a
  weaker, non-idiomatic alternative to the real per-instance-stability design, and
  the Mandate forbids manufacturing work where the kernel already leads). The
  pattern is ALREADY correct. If a hardening is ever wanted, the idiomatic move is
  not a getter but an explicit `:key` assertion (ACG already has one) — i.e. make
  the stability contract a keyed-mount invariant in BOTH cases, not a getter
  wrapper. Recorded so no future lane "fixes" the eager read into a getter and
  thereby re-resolves a store handle every reactive tick for no benefit.

---

## §4 — RECORD: `useSceneRouter` uses raw `localStorage` rather than the `useStorage` idiom `[RECORD]`

`useSceneRouter.ts:23,48` reads/writes `localStorage.getItem/setItem` for the
last-visited-scene persistence (`STORAGE_KEY = "keyframes-js-active-scene"`,
`:11`), wrapped in try/catch, instead of vueuse `useStorage` (the idiom the stores
+ `useAssetManager` use). This is a **defensible** non-idiom: (a) the boot read at
`:19-32` is a ONE-SHOT inside `router.isReady().then()` that drives a
`router.replace` redirect — it is not reactive state to bind, and a `useStorage`
ref would be over-engineering for a single imperative read; (b) the persist at
`:46-52` is a `watch(currentSceneId)` side-effect, which `useStorage` could absorb
but only by binding the route name to a storage ref (a different, more coupled
shape). The raw access is the simpler, correct choice for a router-coupled
boot-redirect + side-effect-persist; converting it to `useStorage` would add a
reactive ref no one reads.

- **Disposition.** **RECORD** (already-appropriate). Not a SHIP — flagged only for
  completeness of the storage-idiom census so a future lane does not reflexively
  "vueuse-ify" it and add a dead reactive ref. Note: this key is NOT in `STORE_KEYS`
  (`storeUtils.ts:5-9`), so `resetAllStores` does not clear it — intentional (the
  last-visited scene is a navigation preference, not animation state), and correct.

---

## §5 — ALREADY-SOTA — the bulk; manufacture NO work (verified `file:line`)

Confirmed exemplary on the frontend-state axis; calling these gaps would be
manufactured deficit:

- **The never-destructure-`defineProps` rule is HONORED via the getter-fn idiom.**
  The memory feedback's ban is satisfied: every destructured prop that crosses a
  composable/store boundary is getter-wrapped —
  `useAnimationGroupPlayback(() => animationGroup, ...)` +
  `useAnimationProgress(() => animationGroup, isPlaying)` (`AnimationControlsGroup.vue:198,200`),
  `useKeyframesEditor(() => animation, emit)` (`KeyframesEditor.vue:129`),
  `getAnimation: () => animation` (`KeyframesEditor.vue:197`,
  `KeyframesStringControls.vue:188`), `watch(() => animationGroup, ...)`
  (`AnimationControlsGroup.vue:205`). On Vue **3.5.35** reactive-props-destructure
  is STABLE, so the in-template/in-computed reads are reactive too; the getter wrap
  carries that reactivity across the function boundary exactly as the rule
  prescribes. This is the rule applied correctly, not violated.

- **The provide/inject seams are textbook.** Every key is a typed
  `InjectionKey<T>` + `Symbol`: `injectionKeys.ts:3-4`
  (`CONTROLS_PANE_HOVER_KEY: InjectionKey<Ref<boolean>>`,
  `TABS_EXTERNALLY_MANAGED_KEY: InjectionKey<boolean>`), the four per-demo context
  keys (`springKeys.ts`, `easingKeys.ts`, `sequenceKeys.ts`, `motionPathKeys.ts`),
  each typed `InjectionKey<ReturnType<typeof useXDemo>>`. Injects supply defaults
  at the site (`usePaneHover.ts:18` `inject(CONTROLS_PANE_HOVER_KEY, ref(false))`,
  `AnimationControls.vue:158` `inject(TABS_EXTERNALLY_MANAGED_KEY, false)`,
  `TopDock.vue:76` `inject(CONTROLS_PANE_HOVER_KEY, null)`), and the providers
  (`App.vue:161,166`, the four scene `provide(X_DEMO_KEY, demo)` at
  `SpringScene.vue:22` et al.) are paired. No string-key injection, no untyped
  inject, no missing default — this is the idiom in full.

- **The `markRaw` + manual-reactive-sync bridge is deliberate and gated.**
  `useAnimationSync.ts` (the central `markRaw`-Animation→Vue bridge) is the model:
  it polls `effectiveT`/`started`/`reversed` off a `markRaw` object via
  `useRafFn`, and the D.W3.S4 settle-gate (`useAnimationSync.ts:27,40-93`) pauses
  the loop when the animation is provably static and resumes on INPUTS the loop
  does not own (`isPlaying` rising edge, document visibility) — explicitly avoiding
  the deadlock of gating on a loop-OUTPUT. The `wake()` export
  (`useAnimationSync.ts:72-100`) re-arms the loop for scrub entry. The reasoning is
  documented at the seam and is correct.

- **`markRaw` is applied consistently at every engine-object boundary.** Every
  `AnimationGroup`/`Animation`/`CSSKeyframesAnimation` stored in Vue reactive state
  is `markRaw`'d: `App.vue:188`, `useSceneGroupSync.ts:76`,
  `useTimelineBuild.ts:44`, `StartingStyleScene.vue:24,38`, `SquareScene.vue:19`,
  `usePlaygroundAnimations.ts:56`. Combined with `shallowRef` for the holders
  (`App.vue:188-189`, `useTimelineBuild.ts:29`), Vue never deep-tracks the engine's
  internal mutation — the correct boundary discipline for a `markRaw` engine.

- **Undo/redo is idiomatic vueuse `useRefHistory`, not a hand-rolled stack.**
  `useTimeline.ts:77-103` (F.W14) wraps the single centralized keyframe `state` ref
  with `useRefHistory(state, { deep: true, clone: true, capacity: 50, eventFilter:
  debounceFilter(100) })` — the `deep`+`clone` (in-place mutation safety), the
  `debounceFilter` (commit-not-keystroke), and the `capacity` bound are each
  reasoned at the seam (`:66-76`). `undo`/`redo` re-`rebuild()` so an undo through a
  `clear()` re-materializes the engine object (`:90-103`). This is the vueuse
  primitive used as designed.

- **The store cohort is cohesively split.** `stores/` is a concern-split directory
  module behind a barrel (`index.ts`): `animationOptionsStore` (options +
  defaults), `controlOptionsStore` (UI control state, a TYPED shape — no index
  signature on `StoredAnimationGroupControlOptions`, `controlOptionsStore.ts:5-19`),
  `hashSharing` (URL codec), `scenePlayback` (ephemeral playback CRUD),
  `storeUtils` (TTL/reset/superkey helpers). The TTL self-reset
  (`storeUtils.ts:11-21`) + the timestamp-strip-for-stable-hash
  (`hashSharing.ts:21-26`) are clean. No god module (largest is
  `animationOptionsStore.ts` at ~120L).

- **`scenePlayback` is correctly a non-reactive module-global Map.**
  `scenePlayback.ts:16` — `new Map<string, ScenePlaybackState>()` — is ephemeral
  imperative state consumed by the playback codec (`usePlaybackSnapshot.ts`), never
  bound to a template. Using a plain Map (not a reactive store) is the right call —
  reactive overhead would be wasted on state nothing renders.

- **Watch flush + ordering is precise where it matters.** The two non-default
  `flush: 'post'` watches are both load-bearing and documented:
  `AnimationControlsGroup.vue:205-210` (re-sync play state after a group-prop swap,
  post-flush so it reads the settled group) and `useKeyframesParsing.ts:93-100`
  (the markRaw `templateFrames` STRUCTURAL projector — `flush: 'post'` + `nextTick`
  so derived strings don't reproject off a half-applied array; the rationale at
  `:83-92` honestly distinguishes the structural projector from the explicit edit
  projector). The `watchEffect` at `AnimationControlsGroup.vue:172-181` guards
  stale-selection clearing on group change with an explicit "skip when empty" gate
  — no spurious clears. No watch is mis-flushed or hiding an ordering bug.

- **Composable naming + return-shape are consistent.** `useX`-prefixed throughout;
  composables that COMPOSE sub-composables re-export an explicitly-named flat shape
  to preserve the callsite contract (`useKeyframesEditor.ts:27-55`,
  `useTimeline.ts:105-128` — both document "public surface unchanged"). The
  build/ops concern split (`useTimelineBuild`/`useTimelineOps` under `useTimeline`;
  `useKeyframesState`/`useKeyframesParsing` under `useKeyframesEditor`) is the same
  decomposition discipline the engine uses. Per-demo context composables
  (`useSpringDemo` etc.) return a typed object consumed via the typed
  `InjectionKey`. No inconsistent return shape surfaced.

- **The keyboard-shortcut singleton registry is correctly glass-ui-owned.**
  `registerShortcut` now imports from `@mkbabb/glass-ui/keyboard`
  (`AnimationControlsGroup.vue:142`) — the singleton `createGlobalState` registry
  left the demo for glass-ui (consistent with the memory feedback that glass-ui
  changes live in the glass-ui repo). Not a demo-state concern.

---

## §6 — Cross-repo hand-offs

**NONE in this lane.** The frontend-state surface is pure demo concern (vueuse
`useStorage`/`createGlobalState`/`useRefHistory`, Vue `provide/inject`/`markRaw`/
`defineProps`). The §1 fix consumes `createGlobalState` (a vueuse primitive,
already a dep). No value.js / parse-that touchpoint surfaced. The one adjacent
glass-ui item (the keyboard registry, §5) is ALREADY correctly resident in glass-ui
— not a hand-off, a confirmation.

---

## Disposition summary

| # | Finding | Sev | Disposition | Instrument |
|---|---------|-----|-------------|-----------|
| 1 | `useAssetManager` is the only stateful store NOT in `createGlobalState`; double-instantiated (parent+child) → two refs over one key, correctness load-bearing on vueuse same-doc-sync internal; not in `resetAllStores` symmetry | MED | **SHIP-in-G** | `proof:asset-store-singleton` — `useAssetManager()===useAssetManager()` ref identity; bites today |
| 2 | `useShareState.stateVersion` is a dead exported reactive counter (zero consumers; CLAUDE.md still documents it) | LOW | **SHIP-in-G** | `proof:no-dead-export` grep / knip clause; bites today |
| 3 | Eager prop-read-at-setup (`ACG:154`, `AnimationControls:155`) relies on an unasserted per-instance prop-stability invariant (keyed-mount / v-for-1:1) | — | **RECORD** | (do not getter-wrap; the design is correct) |
| 4 | `useSceneRouter` uses raw `localStorage` not `useStorage` | — | **RECORD** | (appropriate; one-shot boot read + router-coupled persist) |
| 5 | getter-fn rule / provide-inject / markRaw-bridge / useRefHistory / store split / watch-flush / composable shapes | — | **ALREADY-SOTA** | verified `file:line` |

**The one-paragraph thesis.** The frontend-state tier proves the F close right:
the Mandate's hardest frontend rules — never-destructure-`defineProps`,
getter-fn-for-composables, typed provide/inject, disciplined `markRaw` bridging —
are HONORED across the board on Vue 3.5's stable reactive-props-destructure, not
violated. The audit's hypothesis (lost-reactivity from bare destructured props
feeding composables) is FALSIFIED by the code: every cross-boundary prop is
getter-wrapped. The single real SHIP is a store-idiom consistency fix —
`useAssetManager` is the lone stateful store outside the `createGlobalState`
singleton idiom its two siblings use, and it is double-instantiated, leaving
correctness resting on an undocumented vueuse same-document-sync detail; wrapping it
in `createGlobalState` (one-for-one with the sibling stores, and symmetrizing
`resetAllStores`) is the idiomatic, gestalt fix. A dead `stateVersion` counter is a
trivial cleanup. Everything else — the bridge, the seams, the undo, the store
split, the watch flush — is already-SOTA and left untouched.

## inv-16 / inv ε compliance

This doc wrote ONLY `docs/tranches/G/audit/a-frontend-state.md` — ZERO source edits.
Every claim cites a `file:line` against the live `tranche-g-dev` tree, verified not
asserted (the two `createGlobalState` store wraps vs the raw `useAssetManager`
`useStorage`; the two `useAssetManager` callsites; the getter-fn wraps at the named
composable callsites; the typed `InjectionKey` definitions; the `useRefHistory`
config; the two `flush: 'post'` watches; the dead `stateVersion` triple). The
Vue/vueuse versions (3.5.35 / 14.3.0) were verified from `node_modules` because the
reactive-props-destructure-is-stable and the same-document-sync dispositions depend
on them. No value.js/parse-that/glass-ui item surfaced as a hand-off in this lane.
