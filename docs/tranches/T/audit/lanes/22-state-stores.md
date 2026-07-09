# Lane 22 — state/store/composable consistency (VERDICT #28)

**Scope.** Every file under `demo/@/state/` (9 files, 1,512 LOC) + every
`use*.ts` composable in the demo tree (`find demo -iname "use*.ts" | wc -l` =
**77 files**, spanning `@/state`, `@/components/custom/**/composables/`,
`@/composables/`, `app/{runtime,scene,transition}/`, and all 9
`scenes/<name>/`). Evidence gathered by full-text census (`grep`/`wc -l` over
the live tree), direct reads of `@/state/*.ts` in full, and a live
`resetAllStores()`-exercising unit test (`test/demo/asset-store-singleton.test.ts`)
that already proves the failure MODE this lane's headline finding reports —
independently, for a sibling store, one tranche ago.

**Method note.** This lane does not vibe-check names; every claim below is
grep-verified against the current tree (paths + line numbers cited) or
demonstrated by reading the cited file in full. Where a pattern looked like a
violation but turned out to be a documented, deliberate design choice (e.g.
the provide/inject vs. props DI split across scenes), it is recorded as a
**positive** finding — VERDICT #28 asks for the ruleset AND the violations,
not violations invented to fill a quota.

## The consistency ruleset (derived from the tree's own best example)

`@/state/sceneMachine.ts` + `useSceneMachine.ts` + `controlSurfaceDFA.ts` is
the one part of this surface that is unambiguously **GOOD** (lane 14 already
named it "a model for the rest of the tree"): a pure reducer (no Vue, no `use`
prefix) driven by a co-located reactive shell, a single documented mutation
boundary (readonly refs out, `dispatch()` the only writer), and an
adapter-registry DI seam (`register`/`adapterFor`) that lets two structurally
different playback architectures (`AnimationGroup` scenes vs. raw-rAF scenes)
satisfy one `ScenePlayback` contract. Generalizing that example plus the
demo's own stated conventions (`demo/CLAUDE.md`: *"Stores: vueuse
`createGlobalState` + `useStorage`… never Pinia"*, *"Animation objects are
`markRaw`"*) into an explicit ruleset:

1. **Pure core / effect-layer split.** A stateful domain with non-trivial
   transition logic gets a pure, Vue-free module (no `use` prefix — it is not
   a composable) plus a co-located `use*` reactive shell that drives it. The
   pure module is unit-testable with zero DOM.
2. **Three composable buckets, one visible in the name:**
   - **`use*Store`** — a `createGlobalState` singleton holding passive data
     (options/settings), persisted or not.
   - **`use*Machine`** — a `createGlobalState` singleton holding an
     event-driven FSM (`dispatch`/`transition`), not a bag of settings.
   - **plain `use*`** — a per-instance factory: fresh state on every call,
     never shared across call sites. This is the default; ~90% of the 77
     files are this bucket, correctly.
   A reader should be able to tell which bucket a `use*` export is in from
   its name alone, without opening the file or checking for
   `createGlobalState` in the import list.
3. **One registry, not three.** Every cross-cutting concern that needs "the
   full roster of global stores" (reset-on-clear, hash-share-on-export, a
   future devtools panel) reads from the SAME enumeration. Today there are
   three independent, hand-maintained enumerations that happen to overlap
   (see F1) — the ruleset says there must be one.
4. **markRaw is a construction-time invariant, not a per-site memory.** Every
   `new (CSSKeyframesAnimation|AnimationGroup|SpringProgress|RAFPlayback|
   NumericAnimation|SmoothProgress|Sequence|ElementMorph|Timeline)(…)` call is
   wrapped at the point of construction, unconditionally — not only when the
   author happens to remember it is about to be handed to `ref()`.
5. **A single-writer mutation boundary is stated, not implied.** `useSceneMachine`
   does this explicitly (readonly refs + one `dispatch`). Any other
   `createGlobalState` singleton that exposes a writable `.value` directly
   (both option stores do — see F2's "OK, but…" note) is a lesser but
   accepted variant; the ruleset does not retroactively fail them, but any
   NEW global store should default to the stricter shape.

## Census

| Layer | Files | Pattern |
|---|---|---|
| `@/state/sceneMachine.ts` + `useSceneMachine.ts` + `controlSurfaceDFA.ts` | 3 | pure-core/effect-layer split, `Machine` bucket, single-writer — the model |
| `@/state/animationOptionsStore.ts`, `controlOptionsStore.ts` | 2 | `Store` bucket, `createGlobalState`+`useStorage`, TTL-expired via `storeUtils.checkAndResetExpiredStore` |
| `@/state/hashSharing.ts`, `scenePlaybackAdapters.ts`, `storeUtils.ts`, `index.ts` | 4 | pure helpers / the adapter contract / the reset+registry composer |
| `scenes/compose/asset-manager/useAssetManager.ts` | 1 | `createGlobalState`+`useStorage` singleton, registers with `@state` via `registerStoreReset` (F1) — but named as a plain composable, not `*Store` |
| `scenes/cube/cubeTransformStore.ts` | 1 | `createGlobalState` singleton (no persistence), filename says `Store`, export does not (F2) — and is absent from every registry (F1) |
| Remaining 72 `use*.ts` | 72 | plain per-instance composables — correctly the default bucket |

## Findings

### F1 — three independent, hand-rolled "list of every global store," none complete (the root cause behind F2/F5)

**Defect.** The app has (at least) **five** `createGlobalState` singletons:
`useAnimationGroupsOptionsStore`, `useAnimationGroupsControlOptionsStore`,
`useSceneMachine`, `useAssetManager`, `useCubeTransform`
(`demo/scenes/cube/cubeTransformStore.ts:13`). Three different call sites each
maintain their OWN partial enumeration of "the stores":

- `storeUtils.ts:5-9` `STORE_KEYS` — 3 localStorage keys (the 2 option stores
  + `asset-manager-state`). Missing: the scene-machine's own key (handled
  separately, see below) and `useCubeTransform` (has no key — it isn't
  persisted).
- `@/state/index.ts:86-99` `resetAllStores()` — calls the 2 option-store
  resets + iterates `externalResetHooks` (currently 1 registrant:
  `useAssetManager`'s `_resetAssetManagerStore`, wired via
  `registerStoreReset` at `useAssetManager.ts:213`) + wipes
  `[...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]` from localStorage. **Never
  touches `useCubeTransform`.**
- `hashSharing.ts:20-27` `getAllState()` — hardcodes exactly the 2 option
  stores (`useAnimationGroupsOptionsStore().value` +
  `useAnimationGroupsControlOptionsStore().value`) plus the caller-supplied
  `activeScene`. It does not know the scene-machine's per-scene playback
  snapshots, the compose scene's asset layout, or the cube transform exist —
  despite being named `getAllState`, not `getSomeState`. A "share this
  session" link therefore silently drops a compose-scene composition's
  layer/asset state and the cube's live transform.

**Root cause.** Each of these three concerns (reset, hash-share, persistence
TTL) was authored at a different tranche, against however many global stores
existed *at that time*, and none of the three was retrofitted when a later
tranche added `useAssetManager` (S.D3) or `useCubeTransform`
(`cubeTransformStore.ts`'s own comment cites "R.W6 C.1"). `registerStoreReset`
(the `index.ts:77-94` comment calls it "the app-level reset composer") is the
ONE seam that was built to solve exactly this class of drift — but only the
asset-manager was ever plumbed through it; `useCubeTransform` is the same
shape of singleton and was never wired in.

**Evidence this is a recurring, previously-caught bug class, not a hypothetical.**
`test/demo/asset-store-singleton.test.ts:1-16` documents that the
asset-manager store had EXACTLY this defect once before ("clause 3:
`resetAllStores()` returns the LIVE asset ref to defaults — reds pre-G.W8
(only the storage key was removed, the live ref stayed stale)") and was fixed
by adding `_resetAssetManagerStore` + `registerStoreReset`. The fix pattern
generalizes to any `createGlobalState` singleton; it was applied to exactly
one of the two later-added singletons.

**T recommendation.** Reify a single `GLOBAL_STORES` registry (an array of
`{ key: string | undefined; reset: () => void }` entries, populated by each
store module calling one `registerGlobalStore(...)` at its own definition
site — the same inversion `registerStoreReset` already models, generalized).
`resetAllStores()`, `getAllState()`, and `STORE_KEYS` all derive from this ONE
collection instead of hand-enumerating it three times. `useCubeTransform`
registers alongside `useAssetManager`. Falsifiable: a
`proof:global-store-registry` gate asserts every `createGlobalState(` call
site in `demo/` (grep-discoverable) has a matching `registerGlobalStore` call
in the same file.

### F2 — the `Store` naming bucket is applied to 2 of 5 `createGlobalState` singletons, ad hoc

**Defect.** Of the five singletons named in F1, exactly two carry `Store` in
BOTH filename and exported name (`animationOptionsStore.ts` →
`useAnimationGroupsOptionsStore`; `controlOptionsStore.ts` →
`useAnimationGroupsControlOptionsStore`). One carries it in the filename only
(`cubeTransformStore.ts` → `useCubeTransform` — the file's own header comment
at line 10 even says *"uniform with all other stores"*, asserting a
uniformity the export name itself does not have). Two carry it nowhere
(`useAssetManager`, `useSceneMachine`). A reader cannot tell "is this shared
app-global state or a per-component composable?" from the export name alone
for 3 of the 5 — they have to know to check for `createGlobalState` in the
body, which is exactly the kind of inconsistency VERDICT #28 names.

**Root cause.** No lint/gate ties the `Store` suffix to the `createGlobalState`
wrapper; the suffix is applied by whichever author happened to be modeling
their new file on `animationOptionsStore.ts` (F2 struck) vs. modeling it on
the surrounding plain-composable convention (F2 not struck). `useSceneMachine`
is arguably a DIFFERENT bucket, not a naming miss (see the ruleset's bucket 2,
`*Machine`) — it is an FSM, not a settings bag, so `useSceneMachineStore`
would be a worse name, not a better one. But `useAssetManager` and
`useCubeTransform` are architecturally identical to the two `*Store` files
(a `createGlobalState`-wrapped `useStorage`/`ref` bag of settings with CRUD
methods) and are unnamed for no principled reason.

**T recommendation.** Adopt the ruleset's 3-bucket naming (Store / Machine /
plain) explicitly: rename `useAssetManager` → `useAssetManagerStore` and
`useCubeTransform` → `useCubeTransformStore` (2-file renames + import-site
repoints, mechanical); leave `useSceneMachine` as-is (correctly bucket 2, not
bucket 1). Falsifiable: `proof:store-naming` — every `createGlobalState(`
call's bound export name matches `/Store$|Machine$/`.

### F3 — `markRaw` on engine-object construction is convention-by-imitation, not enforced (VERDICT #19 + #28 crosscut)

**Defect.** `demo/CLAUDE.md` states, unconditionally: *"Animation objects are
`markRaw`."* Grepping every `new (CSSKeyframesAnimation|AnimationGroup|
SpringProgress|RAFPlayback|NumericAnimation|SmoothProgress|Sequence)(` call
site in `demo/` shows the rule is followed in some scenes and skipped in
others, with no functional line separating the two groups:

- **Followed religiously** (`shallowRef(markRaw(new AnimationGroup(...)))` or
  bare `markRaw(new X(...))`): `useCubeDemo.ts` (4 sites), `useMorphDemo.ts`,
  `useMotionPathDemo.ts`, `useEasingTraceSmear.ts:20`, `useSpringDemo.ts`
  (`liveSpring` + all 4 preset tracks), `useSequenceDemo.ts` (`sequence`,
  `mirror`), `useAmigaThree.ts:84`, `useRafScene.ts:78`,
  `useContractAnimGroup.ts:58`.
- **Skipped entirely** — plain `new X(...)`, no `markRaw` anywhere in the
  file: `useAmigaDemo.ts` (`rotations`, `bouncingX/Y/Z`, `animationGroup` —
  5 sites, `useAmigaDemo.ts:73-160`), `useSquareDemo.ts` (`springX`,
  `springY`, `springSpin`, `playback`, `anim` — 5 sites,
  `useSquareDemo.ts:51-52,119,181,332`), `useSpringPaneDrag.ts:40`
  (`playback`), `useCompiledEntry.ts:43` (`enter`),
  `useSpringKeyframesEditor.ts:57`, `useSceneSwap.ts:45`
  (`sceneSwapSpring`), `AnimationVisualizer.vue:135,143,148`
  (`velocityEstimator`/`coastSpring`/`coastPlayback`), `timelineEngine.ts:45`,
  `TransportDock.vue:396,405`, `CopyButton.vue:75,88,101`,
  `KeyframesEditor.vue:226,256`, `KeyframesStringControls.vue:167,229`.

**Root cause.** Today, MOST of the "skipped" sites happen not to be
functionally harmed: they are bare top-level `<script setup>` `const`s or
`let`s (never passed through `ref()`/`reactive()`), and Vue's `computed()`
does not deep-wrap its return value the way `ref()`/`reactive()` do — so no
proxy is actually created around these instances today. But that is an
accident of how each file happens to use its variable, not a property of the
variable itself — `markRaw` is a permanent flag ON THE OBJECT precisely so
that a LATER refactor (e.g. "let's put `springX`/`springY` in a `ref` so a
sibling component can read the live value reactively" — exactly what
`useCubeDemo.ts` and `useMorphDemo.ts` already did for their own animations)
cannot silently reintroduce a deep-reactive Proxy around a per-frame hot-path
object. `SpringProgress`/`RAFPlayback` tick every animation frame; a Proxy
wrapper on every property read/write on that path is a plausible contributor
to VERDICT #19 ("the performance on every single page is god awful… rethought
from the ground up") wherever a future edit (or an existing one this audit
did not fully trace) does put one of the un-marked instances behind `ref()`.
The inconsistency itself — half the scenes treat this as an absolute
invariant, half don't — is the VERDICT #28 finding regardless of whether a
live perf bug is provably attached to a specific site today.

**T recommendation.** Stop relying on every call site remembering `markRaw`.
Either (a) a thin factory module (`@/state/engineObjects.ts` or similar)
exporting `createSpring`, `createGroup`, `createPlayback`, … that call
`markRaw(new X(...))` internally, so construction and marking can never
separate, or (b) a `proof:markraw-engine-objects` grep gate: every
`new (CSSKeyframesAnimation|AnimationGroup|SpringProgress|RAFPlayback|
NumericAnimation|SmoothProgress|Sequence|ElementMorph|Timeline)\(` must be
immediately wrapped by `markRaw(`. (b) is cheaper and catches the same class
of regression without adding an indirection layer the litany would flag as
its own kind of superfluous wrapper.

### F4 — `useAmigaDemo.ts` duplicates its scene's `SUPER_KEY` as an orphaned second literal (a live DRY regression of the R.W5 C.4 rule)

**Defect.** `amigaKeys.ts:5` declares `export const AMIGA_SUPER_KEY = "Amiga";`
— imported and consumed by `AmigaScene.vue:71,73` and `app/scene/scenes.ts:36,156`,
per the documented rule (every `<name>Keys.ts`'s own header comment): *"the
registry descriptor AND the Scene SFC both import it, so no string literal is
declared in a file that doesn't own it"* (R.W5 C.4). But `useAmigaDemo.ts:32`
separately declares `export const SUPER_KEY = "Amiga";` — a second,
independent literal, **never imported from `amigaKeys.ts`**, used only
internally within the same file (tagging `.superKey` on the four
`CSSKeyframesAnimation` instances at lines 152-158) and exported but consumed
by nobody outside the file (`grep` across every `.ts`/`.vue` importer of
`useAmigaDemo` shows only `useAmigaBoot.ts`/`useAmigaThree.ts` importing the
UNRELATED `SPHERE_HOME`/`BOUNCE`/`BOX_SIZE` constants — never `SUPER_KEY`).

`cubeKeys.ts`'s own header comment explicitly documents that this exact
pattern was found and fixed for cube ("S.D2 S5 (a10)… cube was the lone scene
carrying its superKey inline in `useCubeDemo.ts`… rather than a `cubeKeys.ts`
peer", closing "8/8 scene-key parity") — and `useCubeDemo.ts:12` now carries
`export const SUPER_KEY = CUBE_SUPER_KEY;`, a re-export BY REFERENCE that
cannot drift. `useAmigaDemo.ts` has the identical shape of problem the a10 fix
targeted, but as an independent literal, not a re-export — it can drift, and
the "8/8 parity" claim is not actually true today: amiga is the only scene of
the 6 that HAVE a `use*Demo.ts` + a `*Keys.ts` pair where the two disagree
on which file owns the string.

**Failure scenario.** A future rename of the Amiga scene's identity (the
kind of edit `amigaKeys.ts`'s single-source contract exists to make safe —
change `AMIGA_SUPER_KEY`'s value once, everything downstream follows) leaves
`useAmigaDemo.ts`'s independent `"Amiga"` literal stale. Every animation this
composable builds then carries the WRONG `superKey`, and
`getAnimationSuperKey`/`getStoredAnimationOptions` (`storeUtils.ts:23-34`,
`animationOptionsStore.ts:63-100`) silently key the amiga animations' stored
options into the OLD superKey's bucket — a live per-scene options-store
corruption indistinguishable, from the user's side, from "my duration/easing
settings randomly reset."

**T recommendation.** Delete `useAmigaDemo.ts:32`'s literal; import
`AMIGA_SUPER_KEY` from `./amigaKeys` instead (mirroring `useComposeDemo.ts`'s
`import { COMPOSE_SUPER_KEY } from "./composeKeys"` — the pattern every OTHER
scene already follows). Falsifiable: a one-line addition to whatever gate
checks "8/8 scene-key parity" (if one exists) or a new
`proof:scene-superkey-single-source` grep — every `use*Demo.ts` file
containing the substring `SUPER_KEY =` (an assignment, not an import) fails
unless it is a `= <NAME>_SUPER_KEY` re-export (cube's shape), never a raw
string literal.

### F5 — `resetAllStores()` fully resets 3 of 4 registered stores' LIVE state; the scene-machine only wipes its persisted copy, relying on an un-enforced "caller always reloads" contract

**Defect.** `resetAllStores()` (`@/state/index.ts:96-108`) does three kinds
of work: (1) calls `_resetAnimationGroupsOptionsStore()` /
`_resetAnimationGroupsControlOptionsStore()`, each of which reassigns the
LIVE `createGlobalState` ref's `.value` back to defaults
(`animationOptionsStore.ts:113-116`, `controlOptionsStore.ts:71-74`); (2)
runs every `externalResetHooks` entry, currently just
`_resetAssetManagerStore`, which does the identical live-ref reassignment
(`useAssetManager.ts:204-207`); (3) removes
`[...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]` from `localStorage`. Step (3)
deletes the scene-machine's PERSISTED key, but there is no
`_resetSceneMachine()` anywhere in `useSceneMachine.ts` (the file's full 331
lines were read for this audit — the only exported mutators are `dispatch`,
`register`, `adapterFor`, `gcOrphans`) — so the LIVE `machine` `shallowRef`
(holding the current `activeScene` + every scene's `perScene` playback
snapshot) is untouched by `resetAllStores()`. The `index.ts:100-104` comment
even names the escape hatch explicitly: *"Wiping it here means a reset
**reload** boots the machine to its HOME_SCENE_ID default"* — the fix works
ONLY because `resetAllStores()`'s one production caller
(`useAnimationGroupActions.ts:66-67`) immediately follows it with
`window.location.reload()`.

**This is not a hypothetical asymmetry — it is a previously-fixed bug class,
unfixed for a sibling.** `test/demo/asset-store-singleton.test.ts:1-16`'s own
header documents that `useAssetManager` had EXACTLY this defect before G.W8
("`resetAllStores()` returns the LIVE asset ref to defaults — reds pre-G.W8
(only the storage key was removed, the live ref stayed stale)") and the SAME
test file proves `resetAllStores()` is already called directly, with no
reload, from a non-production context (`beforeEach`/`afterEach` in a Vitest
suite that stubs `localStorage` and never touches `window.location`). The
scene-machine has the identical shape of persisted-vs-live split as the
pre-G.W8 asset store, and the identical fix was never applied to it.

**Failure scenario.** Any future `resetAllStores()` caller that does not
immediately reload — a "Reset all" menu affordance that intentionally stays
on the page (a very plausible ask, and arguably a BETTER UX than a hard
reload — the litany's whole ask is to stop reaching for the blunt
`window.location.reload()` instrument), or a test exercising
`useSceneMachine` alongside `resetAllStores()` — leaves the live
`activeScene`/`perScene` state dirty while every sibling store is clean,
producing a state that never occurred before the reset ran through a path
whose defaults it should have restored. This is precisely a state/store
CONSISTENCY defect: 3 of 4 registered resets are total, 1 is partial, and the
partial one is partial silently.

**T recommendation.** Add the symmetric live-ref reset:
`useSceneMachine`'s effect layer exports a `reset()` (or the `index.ts`
composer calls `useSceneMachine().dispatch({ type: "RESET" })` for the active
scene and separately clears `perScene` — whichever matches the machine's own
mutation-boundary discipline, likely a dedicated internal write since `RESET`
is scoped to one scene, not the whole map) and registers it through the SAME
`registerStoreReset`/`GLOBAL_STORES` seam F1 proposes, rather than leaning on
`STORE_KEYS`+reload. Falsifiable: extend
`test/demo/asset-store-singleton.test.ts`'s exact pattern (clause 3) as
`test/demo/scene-machine-reset.test.ts` — dispatch a `NAVIGATE`/`PLAY` to
dirty `useSceneMachine()`'s live state, call `resetAllStores()` with NO
reload, assert `activeScene.value === HOME_SCENE_ID` and `perScene.value`
is empty/default. This test should RED today (falsifying the "reload always
saves us" assumption) and GREEN after the fix.

### F6 — a stale placeholder default value (`selectedKeyframesControl: "string"`) sits in the shared control-options store

**Defect.** `controlOptionsStore.ts:33`'s
`defaultStoredAnimationGroupControlOptions` sets
`selectedKeyframesControl: "string"` — the literal word "string", not a real
tab id. Every other place this field is set uses the real value:
`KeyframesEditor`'s own composable `useKeyframesState.ts:19` defaults it to
`"keyframes"`, and `KeyframesStringControls.vue:72` does the same. The type
(`controlOptionsStore.ts:11`, `:15`) is `string` — it reads as though someone
typed the TYPE annotation into the VALUE position.

**Root cause.** A copy-paste or placeholder default that was never exercised
because the two real consumers both override it unconditionally on their own
mount before anything reads the store's default — so it has never been
user-visible, but it is dead-wrong data sitting in the one place
(`@/state/`) whose entire job is to be the honest source of default state.

**T recommendation.** Change the default to `"keyframes"` (matching both real
consumers) in the same motion as F1's registry work, since this file is
already being touched. Falsifiable: trivial — a snapshot/unit assertion that
`defaultStoredAnimationGroupControlOptions.selectedKeyframesControl` is a
member of whatever finite tab-id union `useKeyframesState`/
`KeyframesStringControls` actually accept (today an unconstrained `string` —
tightening that union is a natural companion fix, optional/out of this
lane's scope).

### F7 (positive) — the provide/inject vs. props DI split across scenes is real, principled, and documented — but only in prose, not in a gate

**Observation.** 5 of 9 scenes (easing, morph, motion-path, sequence, spring)
wire their `use<Name>Demo()` context to descendant components via a typed
`InjectionKey<…Demo>` (`<name>Keys.ts` + `provide()`/`inject()`); the other 4
(cube, amiga, square, compose) wire it via direct props. This is NOT
inconsistency-as-defect: `amigaKeys.ts` and `squareKeys.ts` each carry an
explicit one-line comment stating why ("wires its sub-components directly in
the Scene SFC, not via an inject key" / "wires its instrument via props, not
an inject key"), and the split tracks a real structural fact — the
provide/inject scenes have deeper or branching component trees (e.g. easing's
`EasingSidebar` + `EasingTarget` + `EasingHeroStage` + `EasingCurvePhysics`
all need the shared context) where props would mean drilling through
intermediate layers; the props scenes have one or two direct children. Every
scene that DOES use `InjectionKey` types it correctly (`Symbol(...)`, not a
raw string) with zero exceptions found. **No T recommendation for the split
itself** — it is correctly drawn. The one gap: the "why" lives in a comment a
future scene author has to go read, not in anything that would fail CI if a
10th scene picked the wrong DI shape for its tree depth. Worth folding into
whatever documentation artifact records the ruleset in F-above (a doc line,
not a gate — this is a judgment call, not a mechanical property).

## T recommendations

1. **Reify one global-store registry (`registerGlobalStore`), derive `resetAllStores`/`getAllState`/`STORE_KEYS` from it.**
   Scope: `@/state/index.ts` + `storeUtils.ts` + a one-line registration call added to each of the 5 `createGlobalState` singleton definitions (`animationOptionsStore.ts`, `controlOptionsStore.ts`, `useSceneMachine.ts`, `useAssetManager.ts`, `cubeTransformStore.ts`).
   Gate shape: `proof:global-store-registry` — every `createGlobalState(` call site in `demo/` has a matching `registerGlobalStore`/equivalent call in the same file; `resetAllStores`/`getAllState` contain no store-specific literal beyond the registry iteration.
   Size: **M**.

2. **Normalize the `use*Store`/`use*Machine`/plain `use*` naming across all 5 singletons.**
   Scope: rename `useAssetManager` → `useAssetManagerStore`, `useCubeTransform` → `useCubeTransformStore` (2 files + import-site repoints); leave `useSceneMachine` (correct as `*Machine`) and the 2 existing `*Store` names untouched.
   Gate shape: `proof:store-naming` — grep every `createGlobalState(` binding name against `/Store$|Machine$/`.
   Size: **S**.

3. **Make `markRaw` a construction-time invariant instead of a per-site memory.**
   Scope: either a thin `createSpring`/`createGroup`/`createPlayback` factory module, or (cheaper, preferred) a grep gate over every engine-constructor call site in `demo/`.
   Gate shape: `proof:markraw-engine-objects` — every `new (CSSKeyframesAnimation|AnimationGroup|SpringProgress|RAFPlayback|NumericAnimation|SmoothProgress|Sequence|ElementMorph|Timeline)\(` is immediately wrapped in `markRaw(`.
   Size: **S** (gate) or **M** (factory module + call-site migration).

4. **Fix the amiga `SUPER_KEY` duplicate-literal regression.**
   Scope: `useAmigaDemo.ts` — one import added, one literal deleted.
   Gate shape: `proof:scene-superkey-single-source` — every `use*Demo.ts` containing a `SUPER_KEY =` assignment is either absent or a `= <NAME>_SUPER_KEY` re-export, never a raw string literal.
   Size: **S**.

5. **Give `useSceneMachine` a live-ref reset symmetric with its 3 siblings; stop relying on the "caller always reloads" accident.**
   Scope: `@/state/useSceneMachine.ts` (add the reset export) + `@/state/index.ts` (wire it through recommendation 1's registry).
   Gate shape: new `test/demo/scene-machine-reset.test.ts` mirroring `asset-store-singleton.test.ts` clause 3 — dirty the live machine, call `resetAllStores()` with no reload, assert defaults. RED before the fix, GREEN after.
   Size: **S**.

6. **Correct the stale `selectedKeyframesControl: "string"` default.**
   Scope: one-line change in `controlOptionsStore.ts`.
   Gate shape: folded into recommendation 1's touch of the same file, or a trivial standalone assertion.
   Size: **S**.
