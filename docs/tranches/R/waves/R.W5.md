# R.W5 — Demo scene fusion + dead-code excision

**Phase:** IMPL (authorized when explicitly opened)
**Depends on:** R.W3 legacy sweep (the `inject(KEY)!` explicit-throw guards, the `animationState`
dead-field delete, and the `navigator.platform` excision are clean prerequisites) — the fusion
itself is file-move only and does not depend on the library waves (R.W1–R.W4).

---

## 1. Scope

The demo's scene logic is split across three unrelated directory roots: `demo/app/scenes/*Scene.vue`
(shell entry), `demo/<name>/` (domain — Target, composables, keys, presets, geometry), and
`demo/@/components/custom/animation-controls/` (shared control surface). Every scene SFC reaches
across via a `../../<name>/` relative climb (verified: `demo/app/scenes/EasingScene.vue:13-16`).

This wave fuses each split scene into one `demo/scenes/<name>/` directory, excises dead parallel
surfaces, and extracts three triplicated patterns into shared helpers — in the ordered sequence
that gestalt-demo §11 specifies (dead code first, cross-cutting extractions second, per-scene
fusion last). The shared control surface (`animation-controls/`) is NOT touched — it is the model
decomposition (gestalt-demo §5).

Work is grouped into three ordered bands:

- **Band A — Dead-code excision** (zero risk): delete `SceneSwitcherCarousel.vue` +
  `useScrollSnapScene.ts`, trim `App.vue` + `scene-transition.css`; delete `Animated.vue` +
  `ResponsiveSelect.vue`.
- **Band B — Cross-cutting extractions** (low risk, high leverage): author
  `useContractAnimGroup`, `useSceneTransport`, `rafConstants.ts`, `useTypedTrigger` — each kills
  a triplication AND shrinks multiple files toward sub-500L.
- **Band C — Scene fusion** (the structural headline — do LAST, atomic per scene): relocate
  `demo/<name>/*` + `demo/app/scenes/<Name>Scene.vue` → `demo/scenes/<name>/`, fix imports to
  local, uniformize `superKey` sourcing, add a `stageMode` field to `SceneDescriptor` and generate
  the router list from the registry.

---

## 2. Concrete work

### Band A — Dead-code excision

#### A.1 DELETE `SceneSwitcherCarousel.vue` + `useScrollSnapScene.ts`

**Evidence:**

- `demo-scene-switcher.md` Finding 1: `useScrollSnapScene.ts:56-61` — `onScroll` is a documented
  no-op (`void nearestCenterId;` — discards the read, writes no Vue state). The swipe-settle
  commit was never implemented; only the explicit `@click="onPick(scene.id)"` path works.
- `demo-scene-switcher.md` Finding 4: `useScrollSnapScene` has ONE consumer
  (`SceneSwitcherCarousel.vue:40`). After the carousel goes, the composable is dead.
- `challenge-demo.md` A.1 (verified): `ChromeDock.vue:124-128,269-305` emits `switchScene` with
  NO breakpoint gate — the dock Select is always present. `App.vue:12` wires
  `@switch-scene="runSceneSwitch"`. Navigation is unbroken after deletion.

**EXCISE (dead no-op handler + dead parallel surface):**

```
DELETE  demo/@/components/custom/SceneSwitcherCarousel.vue          (178L)
DELETE  demo/@/composables/useScrollSnapScene.ts                    (72L)
```

In `demo/app/App.vue`:
- DELETE line 209: `import SceneSwitcherCarousel from "@components/custom/SceneSwitcherCarousel.vue";`
- DELETE lines 168-179: the `<!-- Q.WC3 S2 -->` comment + `<div class="scene-carousel-host">` +
  `<SceneSwitcherCarousel ...>` block (demo-scene-switcher §6).
- KEEP line 192: `import "./scene-transition.css";` — the VT directional keyframes are load-bearing.

In `demo/app/scene-transition.css`:
- DELETE lines 61-81: the S2 carousel visibility block (`.scene-carousel-host { display: none }`
  + the `@media (max-width: 720px)` rule — demo-scene-switcher §3 + CSS-to-delete inventory).
- UPDATE lines 1-6: remove "phone-narrow carousel visibility" from the file header comment; the
  file becomes VT-keyframes-only.

The `-webkit-overflow-scrolling: touch` property (demo-legacy-sweep 6a) in
`SceneSwitcherCarousel.vue` is eliminated with the file deletion.

Also EXCISE the `var(--z-content, 2)` comma-default in the deleted `scene-transition.css` S2
block — it dies automatically. The z-index comma-default sweep across surviving files is R.W6.

> **Why this removal stands on A.1 alone:** challenge-demo.md A.2 establishes that the
> "carousel is inside the VT subject" rationale in `demo-scene-switcher.md` Finding 2/5 is
> FACTUALLY WRONG — the carousel `<div class="scene-carousel-host">` at `App.vue:174` is a
> SIBLING of `.scene-host` (which closes at App.vue:167), not a descendant. The `scene-subject`
> VT name on `.scene-host` does not capture siblings. The removal stands entirely on the
> no-op-`onScroll` + dead-parallel-surface reasons from A.1.

#### A.2 DELETE `Animated.vue` + `ResponsiveSelect.vue`

**Evidence:**

- `challenge-demo.md` D.4 (verified): `Animated.vue` has ZERO importers (the `AnimatedText`
  grep matches a different component). `ResponsiveSelect.vue` has zero importers — its only
  tree reference is a stale comment in `usePaneRegister.ts:27`.
- `gestalt-demo.md` §6: both listed as "dead and excised outright (R-legacy 1a/1b)."

**EXCISE (dead components — zero consumers):**

```
DELETE  demo/@/components/custom/Animated.vue
DELETE  demo/@/components/custom/ResponsiveSelect.vue
```

No import-site cleanup required (zero live importers).

---

### Band B — Cross-cutting extractions

#### B.1 `useContractAnimGroup` — kills the three-way contractAnim triplication

**Evidence:**

- `demo-composables-state.md` F2 (lines cited): identical six-step "dummy transport host"
  recipe in:
  - `demo/easing/useEasingDemo.ts:400-456`
  - `demo/spring/useSpringDemo.ts:391-432`
  - `demo/sequence/useSequenceDemo.ts:158-193`
- `challenge-demo.md` B.2 (verified SOUND): real triplication, confirmed at the cited line ranges.

**NEW FILE** `demo/app/composables/useContractAnimGroup.ts`:

```ts
// Signature (exact shape owned here; comment explaining WV-W1 "lane escape hatch" lives once)
export function useContractAnimGroup(opts: {
    duration: MaybeRefOrGetter<number>;
    timingFunction: MaybeRefOrGetter<string>;
    name: string;
    superKey: string;
    isPlaying: Ref<boolean>;
    startPaused?: boolean;
}): { contractAnim: CSSKeyframesAnimation; animationGroup: AnimationGroup<CSSKeyframesAnimation> }
```

Each scene composable replaces its ~56-line copy with a 2-3 line call. `useEasingDemo` drops
from 511L to sub-500L; `useSpringDemo` and `useSequenceDemo` both drop below their 499L mark.

The new file lives at `demo/app/composables/` (the cross-scene shared location in the target
tree, gestalt-demo §2). If `demo/app/composables/` does not yet exist, create it — it is the
canonical home for app-level cross-scene composables (gestalt-demo §2 full listing).

#### B.2 `useSceneTransport` — kills the play/pause/togglePlay triplication

**Evidence:**

- `demo-composables-state.md` F3 (lines cited): byte-for-byte identical `play`/`pause`/
  `togglePlay` in:
  - `demo/easing/useEasingDemo.ts:268-279`
  - `demo/spring/useSpringDemo.ts:335-346`
  - `demo/sequence/useSequenceDemo.ts:270-286`
- `challenge-demo.md` B.2 (verified SOUND).

**NEW FILE** `demo/app/composables/useSceneTransport.ts`:

```ts
// Signature
export function useSceneTransport(
    machine: ReturnType<typeof useSceneMachine>
): { isPlaying: ComputedRef<boolean>; play(): void; pause(): void; togglePlay(): void }
```

The `resume = () => play()` alias in `useSequenceDemo` folds into the helper.

#### B.3 `rafConstants.ts` — kills the `PROGRESS_READOUT_HZ` duplication

**Evidence:**

- `demo-composables-state.md` F4: identical `const PROGRESS_READOUT_HZ = 6;` at:
  - `demo/easing/useEasingDemo.ts:181`
  - `demo/spring/useSpringHotPath.ts:46`

**NEW FILE** `demo/app/rafConstants.ts`:

```ts
/** Reactive readout cadence — a few Hz, not 60 (avoids reactive storm on hot-path). */
export const PROGRESS_READOUT_HZ = 6;
```

Both `useEasingDemo` and `useSpringHotPath` import from `demo/app/rafConstants.ts`. This is a
root-level constant file (not inside `composables/`) because it contains no Vue composable logic.

#### B.4 `useTypedTrigger` — extracts the reelBuffer ring-buffer pattern

**Evidence:**

- `demo-targets.md` DT-10: `demo/sequence/SequenceTarget.vue:248-263` — a 15-line generic
  "typed sequence detector" (ring-buffer on `window.keydown`, skip editable targets) that calls
  `demo.playReel()` when the buffer matches `"reel"`. Inline `let reelBuffer` is a module-level
  mutable in a SFC setup function.

**NEW FILE** `demo/@/composables/useTypedTrigger.ts`:

```ts
// Signature
export function useTypedTrigger(code: string, onMatch: () => void): void
// Uses useEventListener; scopes cleanup to caller's effect scope; handles editable-target guard.
```

`SequenceTarget.vue` becomes a two-liner; the `let reelBuffer = ""` is gone.

The new file lives at `demo/@/composables/` because it is a shared demo primitive (gestalt-demo
§2 target tree explicitly names it there, alongside `useDragScrub.ts` and
`gestureSelectSuppression.ts`).

---

### Band C — Scene fusion (the headline structural move — do LAST, atomic per scene)

#### C.1 New directory shape

The target `demo/scenes/<name>/` layout follows the colocation contract in gestalt-demo §3. Each
scene becomes a flat directory of 4-13 files. No intra-scene sub-dirs (`components/`,
`composables/` sub-dirs inside a scene are over-nesting at this grain — KISS, gestalt-demo §3
explicitly).

All eight scenes follow the same fusion pattern:

```
BEFORE                                      AFTER
─────────────────────────────────────────   ────────────────────────────────────────────
demo/app/scenes/<Name>Scene.vue        ─┐   demo/scenes/<name>/<Name>Scene.vue
demo/<name>/<Name>Target.vue           ─┤   demo/scenes/<name>/<Name>Target.vue
demo/<name>/use<Name>Demo.ts           ─┤   demo/scenes/<name>/use<Name>Demo.ts
demo/<name>/<name>Keys.ts              ─┘   demo/scenes/<name>/<name>Keys.ts
demo/<name>/[remaining domain files]        demo/scenes/<name>/[same files, local imports]
```

All `../../<name>/…` relative climbs in `*Scene.vue` become local (`./EasingTarget.vue`, etc.).
No `@`-alias changes are needed for the fused scene files (they are not aliased today).

#### C.2 Ordered per-scene execution (verified eight scenes)

Execute one scene at a time, in ascending complexity order, verifying the gate after each:

1. `morph` — `MorphSVGScene.vue` + `MorphTarget.vue` + `useMorphDemo.ts` + `morphShapes.ts` +
   `morphKeys.ts` (5 files; the simplest fusion)
2. `motion-path` — 6 files
3. `easing` — 9 files (after Band B extractions reduce `useEasingDemo.ts` to sub-500L)
4. `sequence` — 8 files
5. `square` — after Band B extractions (`useEnvelopeTour.ts` + `useSquareDrag.ts` are R.W6 scope
   for the oversize extraction but the fusion itself moves all files atomically)
6. `spring` — 13 files
7. `amiga` — 8 files
8. `cube` — 7 files (plus `cube.png`)

#### C.3 Import fixups per scene (the mechanical work)

For each scene, every `../../<name>/…` import in `*Scene.vue` becomes `./…`:

```ts
// BEFORE (e.g. EasingScene.vue:13-16)
import EasingTarget from "../../easing/EasingTarget.vue";
import EasingSidebar from "../../easing/EasingSidebar.vue";
import { useEasingDemo } from "../../easing/useEasingDemo";
import { EASING_DEMO_KEY } from "../../easing/easingKeys";

// AFTER
import EasingTarget from "./EasingTarget.vue";
import EasingSidebar from "./EasingSidebar.vue";
import { useEasingDemo } from "./useEasingDemo";
import { EASING_DEMO_KEY } from "./easingKeys";
```

All peer-file imports within a scene directory (`useSpringDemo.ts` importing from
`springKeys.ts`) are already local and unchanged.

`demo/app/scenes/` directory is deleted when it is empty (after all 8 scenes are moved). The
`demo/<name>/` source directories are deleted when empty.

#### C.4 `superKey` DRY fix — single authority per scene

**Evidence:** `demo-app-scenes.md` F7: `scenes.ts:104` `superKey: "Amiga"` AND
`AmigaScene.vue:70` `const superKey = "Amiga";` — eight scenes repeat this pattern with no
import linking them.

In each `<name>Keys.ts`, export the scene's `superKey` as a named constant:

```ts
// amigaKeys.ts (NEW — or add to existing file if one exists)
export const AMIGA_SUPER_KEY = "Amiga";
export const AMIGA_DEMO_KEY: InjectionKey<ReturnType<typeof useAmigaScene>> = Symbol("amigaDemoKey");
```

Both the `SceneDescriptor` factory in `scenes.ts` (or `sceneRegistry.ts`) AND the `*Scene.vue`
import from `<name>Keys.ts`. No string literal is declared in a file that does not own it.
Evidence: gestalt-demo §3 (the colocation contract "single source of superKey").

#### C.5 `SceneDescriptor` + `scenes.ts` — add `stageMode`, generate router list

**Evidence:** `demo-app-scenes.md` F5 + F6.

- F6: `STAGE_MODES: Record<string, StageMode>` at `scenes.ts:223-236` is a parallel string-keyed
  record mirroring the scene list. A missing id silently falls through to `"subject"` with no error.
- F5: `router.ts:16-29` — 9 route entries are a manual copy of `scenes.ts`; the `Stub` component
  is repeated.

**In `scenes.ts` (or the renamed `sceneRegistry.ts`):**

Add `stageMode: StageMode` to `SceneDescriptor`. Inline each scene's `stageMode` in its
descriptor object. DELETE `STAGE_MODES` record + `stageModeFor` function; replace callers with
`currentScene.value.stageMode ?? "subject"` where a TS-satisfying fallback is needed on nullable
paths only.

**In `router.ts`:**

Replace the hand-written route list with a generated form:

```ts
const routes: RouteRecordRaw[] = [
    ...allScenes.map((s) => ({
        path: s.id === HOME_SCENE_ID ? "/" : `/${s.id}`,
        name: s.id,
        component: Stub,
    })),
    { path: "/:pathMatch(.*)*", redirect: "/" },
];
```

The `Stub` component is declared once; the list is not maintained manually.

#### C.6 `demo/@/` → `demo/shared/` rename — SKIP (cosmetic only)

**Per R.md §7** and `challenge-demo.md` B.3: the `@`-alias rename is explicitly cosmetic; it
risks the vite + tsconfig path aliases for zero structural payoff. Skipped in this wave. The
`@components` / `@composables` / `@utils` / `@styles` aliases continue to point at `demo/@/*`.

---

## 3. Born-RED gate

**Name:** `proof:scene-colocated`

**Script location:** `scripts/proof-scene-colocated.mjs`

**Asserts (three assertions):**

1. **Colocation:** For each scene `<name>`, the entry `demo/scenes/<name>/<Name>Scene.vue` exists,
   and at least one peer file (`*Target.vue` or `use<Name>Demo.ts`) exists in the same directory.
   The old scatter paths (`demo/app/scenes/<Name>Scene.vue` and `demo/<name>/<Name>Target.vue`)
   do NOT exist.

2. **No relative climbs:** Zero `*.ts` or `*.vue` files under `demo/scenes/` contain the pattern
   `../../` in an `import` statement (every cross-directory import within a scene must now be
   local `./` or an `@`-alias).

3. **Dead-code deleted:** Neither `SceneSwitcherCarousel` nor `useScrollSnapScene` appears as an
   identifier or import path in any source file under `demo/`. Specifically:
   - No file under `demo/` contains `SceneSwitcherCarousel` as an import or JSX/template tag.
   - No file under `demo/` contains `useScrollSnapScene` as an import or call.
   - `Animated.vue` and `ResponsiveSelect.vue` do NOT exist on disk under `demo/`.

**Plant test (what RED-state proves the gate bites):**

Before the fusion, copy `demo/app/scenes/EasingScene.vue` back to
`demo/scenes/easing/EasingScene.vue` but LEAVE the `../../easing/` relative climbs in its
imports unchanged. Run `proof:scene-colocated`. Assertion (2) must RED listing the `../../easing/`
violations in `EasingScene.vue`. Fix the imports to local `./`; confirm GREEN.

For assertion (3): before deleting `SceneSwitcherCarousel.vue`, run `proof:scene-colocated`.
Assertion (3) must RED (file present AND still referenced in `App.vue:209`). Delete the file and
the import; confirm GREEN.

---

## 4. Challenge-tempered cautions

- **The "carousel inside VT subject" rationale is STRUCK.** `challenge-demo.md` A.2 established
  it is factually false — the carousel `<div class="scene-carousel-host">` is a SIBLING of
  `.scene-host` (App.vue:174 after scene-host closes at App.vue:167), never captured by the
  `scene-subject` VT name. The removal stands on A.1 alone (no-op `onScroll`, dead parallel
  surface). This spec does not propagate the phantom VT constraint.

- **`useSceneSwap` STAYS.** `challenge-demo.md` D.3 / R.md §2: View Transitions is Baseline
  only since 2025-10-14 (Firefox 144); the `SpringProgress` cross-dissolve is genuinely befitting
  (real coverage gap + engine dogfood). `demo-app-scenes.md` F4's "excise entirely" is overreach.
  This wave does not touch `useSceneSwap.ts`.

- **Subgrid same-cascade fallback STAYS.** `challenge-demo.md` D.2 / R.md §2: the
  `grid-template-columns: var(--label-col) 1fr; grid-template-columns: subgrid;` pair in
  `demo/sequence/SequenceTarget.vue:325-327,333-334` is the modern-web-guidance recommended idiom
  (css-layout guide explicitly recommends this two-declaration pattern). DT-6's "excise it" is
  overreach. This wave preserves the pair.

- **`demo/@/` → `demo/shared/` rename is NOT done.** R.md §7 marks it optional/cosmetic; the
  challenge confirms the vite/tsconfig alias risk outweighs zero structural payoff. Skip.

- **No intra-scene sub-dirs.** The KISS constraint is hard: `demo/scenes/<name>/` stays a flat
  directory. At 4-13 files per scene, `components/`/`composables/` sub-dirs are over-nesting
  (gestalt-demo §3 explicit). The `animation-controls/` subtree shape is the model for that
  large shared surface — not a blueprint to apply inside individual scenes.

- **Render-fn slot protocol (`defineExpose` + `h()`) STAYS.** `challenge-demo.md` C.3 /
  R.md §2: scenes expose `tabsContent`/`ribbonContent`/`headerLeft` as render functions because
  they project into SIBLING slot positions (App.vue structure) — a render-fn bridge is the
  idiomatic cross-sibling teleport, not a workaround. The only fix needed is the `any` typing
  (`SceneExposedApi` interface), which is R.W6 scope. This wave moves the files without touching
  the protocol.

- **`AmigaScene.vue` Three.js extraction + `SquareScene.vue` easter-egg extractions** (F1/F2 in
  `demo-app-scenes.md`) target the 538L and 504L oversize files. These decompositions are
  coherent within the scene fusion (they produce files colocated in the scene directory) but are
  specifically NOT in Band C scope — they are independent R.W6 concerns that can happen before
  or after the fusion without blocking it. This wave MOVES the existing 538L `AmigaScene.vue` as
  a single file; it does not carve it during the move.

- **Gate co-edits in this wave are self-contained.** Unlike R.W1's three gate co-edits to the
  library gates, R.W5 introduces a NEW gate (`proof:scene-colocated`) with no path-literal
  hardcoding to maintain. No existing gate has a `demo/app/scenes/` or `demo/<name>/` path
  literal that breaks on the move.

---

## 5. Verification + DEV/IMPL boundary

**This spec is authored now (R.W0 DEV phase). IMPL opens on explicit authorization.**

Verification steps post-IMPL (in Band order):

**After Band A:**

1. `grep -r "SceneSwitcherCarousel\|useScrollSnapScene" demo/` — zero hits.
2. `grep -r "Animated\.vue\|ResponsiveSelect\.vue" demo/` — zero file-system hits (files gone).
3. `demo/app/scene-transition.css` contains zero `.scene-carousel-host` rules; the S2 block
   (lines 61-81 in the pre-R.W5 file) is gone.
4. `npm run build` — zero TypeScript errors.
5. Demo dev server: navigate between all 8 scenes via the ChromeDock Select — transitions
   work on every scene; no console errors.

**After Band B:**

6. `useContractAnimGroup.ts`, `useSceneTransport.ts`, `rafConstants.ts`,
   `useTypedTrigger.ts` all exist at their specified paths.
7. `grep -r "PROGRESS_READOUT_HZ" demo/` — exactly ONE definition (in `rafConstants.ts`);
   two import sites (easing, spring).
8. `wc -l demo/easing/useEasingDemo.ts` (or post-Band-C path) — strictly less than 500.
9. `npm run build` — GREEN.

**After Band C (per-scene, after each scene):**

10. `node scripts/proof-scene-colocated.mjs` — GREEN (all three assertions pass).
11. `demo/app/scenes/` directory does not exist.
12. All `demo/<name>/` domain directories do not exist.
13. `grep -rn "\.\.\/\.\.\/" demo/scenes/` — zero hits.
14. `npm run build` — zero TypeScript errors.
15. Demo dev server: navigate to every scene; verify scene loads, animations play, sidebar
    content renders correctly. Pay particular attention to the `defineExpose` scene-slot protocol
    (tabs content, ribbon content, header left) — these use `sceneRef?.tabsContent` etc. and
    must resolve correctly after the path change.
16. `node scripts/proof-scene-colocated.mjs` — GREEN final confirmation.
17. All existing `proof:*` gates that were GREEN before R.W5 remain GREEN.
