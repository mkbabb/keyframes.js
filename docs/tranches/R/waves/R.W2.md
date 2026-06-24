# R.W2 — The two god-class carves (engine, group) — DI not param-bags

**Band:** B — lib structure.
**Phase:** IMPL (major) — opens on authorization, sequenced after R.W1 (directory partition + 3 gate
co-edits) lands. R.W1 moves the flat siblings into `engine/` and `group/` directories and widens the
`isHeavyEngine` regex; R.W2 performs the structural carve inside those directories.
**DAG:** R.W1 → **R.W2** (the carve targets files R.W1 produced; they collide on `engine.ts`,
`group.ts`, and the gate scripts — sequential, not parallel).

---

## 1. Scope

`engine.ts` is 1420 lines hosting two exported classes and a privacy-inversion workaround
(`this as unknown as PlaybackHost<V>`) that proves the playback seam is faked, not real. `group.ts` is
924 lines with test-scaffold surface (`forcePause`/`forcePlay`) leaking onto the public API, a misnamed
junk-drawer sibling (`group-layer-springs.ts`), and a `soaBlendLayer` private wrapper kept solely for
bench monkey-patching. This wave dissolves both god-classes into cohesive sub-modules that OWN their
state via DI, kills the `PlaybackHost` `this as unknown as` cast and its two reverse counterparts, and
demotes the test-scaffold surface and hollow stubs. The result is that every file in `engine/` and
`group/` falls under the decomposition ceiling — verified post-carve by `proof:decomposition` and
`proof:engine` (retargeted), not pre-assumed by prose.

---

## 2. The concrete work

### 2A. Engine — `PlaybackState` owns the run-state; kill the `PlaybackHost` cast

**The defect (cited evidence).**

`src/animation/engine.ts:218–237` declares five private fields that are logically the play machine's
run-state:

```ts
// engine.ts:218-220 (private run-state fields kept on the class body)
private resolvePromise: ... | null = null;
private _playingPromise: Promise<void> | null = null;
private _boundFrame = this._frame.bind(this);
private _interpOut: Record<string, ValueUnit[]> = {};
// (+ _waAnimations, declared elsewhere on the class)
```

`src/animation/engine-playback.ts:50–100` (`PlaybackHost` interface) re-publishes every one of them as
public interface members so the extracted free functions can write them. The `this as unknown as`
cast at `engine.ts:918` is the workaround:

```ts
// engine.ts:917-918  — EXCISE this cast
private get _host(): PlaybackHost<V> {
    return this as unknown as PlaybackHost<V>;
}
```

Two reverse casts in `engine-playback.ts` reach back through the abstraction to the concrete class:

```ts
// engine-playback.ts:287 — EXCISE
await playWAAPI(host as unknown as KeyframesAnimation<V>);
// engine-playback.ts:378 — EXCISE
host as unknown as KeyframesAnimation<V>,
```

These three are the only `as unknown as` casts in `engine/` that are structural workarounds. (The
remaining `as unknown as` in `engine.ts` at lines 362, 745, 782, 818 are type-narrowing casts on value
structures — not the workaround cast; they are NOT touched by this wave.)

**The cure (DI, not param-bag).**

After R.W1 moves files into `engine/`, the play-machine run-state is extracted into a `PlaybackState`
class/struct defined in `engine/playback.ts`:

```ts
// engine/playback.ts — NEW struct (replaces PlaybackHost interface)
export class PlaybackState {
    resolvePromise: (() => void) | null = null;
    _playingPromise: Promise<void> | null = null;
    _waAnimations: globalThis.Animation[] = [];
    readonly _boundFrame: (t: number) => boolean | Promise<boolean>;
    readonly _interpOut: Record<string, unknown> = {};

    constructor(frameCb: (t: number) => boolean | Promise<boolean>) {
        this._boundFrame = frameCb;
    }
}
```

`KeyframesAnimation` composes it as a field (DI by construction, not param-bag):

```ts
// engine/animation.ts — replaces the five private fields
readonly _playback: PlaybackState;

constructor(...) {
    ...
    this._playback = new PlaybackState(this._frame.bind(this));
}
```

The free functions in `engine/playback.ts` receive `PlaybackState` directly — no cast needed, no
`PlaybackHost` interface, no re-publication of private fields. The `_host` getter and the
`PlaybackHost` exported interface are both deleted. `playWAAPI` is called from within `engine/playback.ts`
or receives the concrete type through a local import (no cross-module `as unknown as` cycle).

**F-3 (DRY) is fixed in the same pass:** the `shouldReverse(direction, iteration)` predicate
(`engine.ts:490–498` vs `engine-playback.ts:107–115`, two copies of the same three-way test) is
extracted to a single three-line pure function in `engine/playback.ts` and called from both sites.

**`PlaybackHost` export: EXCISE.** `engine-playback.ts:50–100` exports the interface; after the carve
the interface does not exist. No downstream consumer imports `PlaybackHost` (it was `export
interface` but used only as a cast target within the engine family). Zero public-API change.

**`dispatchAnimationEvent` (F-6):** the `private` method at `engine.ts:277` is published on
`PlaybackHost:98` solely for the cast protocol. After the carve, `dispatchAnimationEvent` stays on
the class and the playback functions call it via the passed animation reference or a local shared
helper — no private-then-cast pattern.

**`CSSKeyframesAnimation` (F-4):** moves to `engine/css-animation.ts`. The base `KeyframesAnimation`
moves to `engine/animation.ts`. `engine/index.ts` barrel re-exports both. The re-export block at
`engine.ts:1410–1420` (which makes `engine.ts` a barrel AND a class module, F-5) moves into
`engine/index.ts`.

**`_resolveElementAwareValues` + `_buildElementAwareEnv` (F-7):** extracted from `engine.ts:1061–1168`
to `engine/element-resolve.ts` as a free function `resolveElementAwareValues(animation)`. The
`setTargets` call site becomes a one-line delegate.

**Before/after (engine):**

```
BEFORE (R.W1 output, still needing the carve):
  engine/
    index.ts              (placeholder barrel)
    animation.ts          (KeyframesAnimation — 1420L, two classes, privacy-inversion intact)
    playback.ts           (engine-playback.ts moved; PlaybackHost interface + casts intact)
    composition.ts        (engine-composition.ts moved; unchanged)
    options.ts            (engine-options.ts moved; unchanged)
    css-metadata.ts       (engine-css-metadata.ts moved; unchanged)

AFTER (R.W2):
  engine/
    index.ts              (~30L barrel: re-exports both classes + AnimationGroup + getTimingFunction + constants)
    animation.ts          (~500L: KeyframesAnimation with _playback: PlaybackState field; NO _host getter; NO PlaybackHost cast)
    css-animation.ts      (~230L: CSSKeyframesAnimation; moved from engine.ts:1175–1402)
    playback.ts           (~510L: PlaybackState struct + free functions; NO PlaybackHost export; NO as-unknown-as cast)
    composition.ts        (~221L: unchanged content)
    options.ts            (~193L: unchanged content)
    css-metadata.ts       (~148L: unchanged content)
    element-resolve.ts    (~90L: resolveElementAwareValues free function)
```

Sizing is an ESTIMATE (challenge-library section 5 explicitly flags this); the gate verifies
post-carve — see §3.

---

### 2B. Group — demote test-scaffold surface; split the junk-drawer; make `transformFramesGrouped` private

**`forcePause` / `forcePlay` — EXCISE (test-scaffold leak).**

`group.ts:793–801` defines both:
```ts
// group.ts:793-801 — EXCISE (test-scaffold leaks on public API; zero src/demo usage)
forcePause() {
    this.paused = true;
    setChildrenPaused(this.getEntries(), true);
}
forcePlay() {
    this.paused = false;
    setChildrenPaused(this.getEntries(), false);
}
```

These are called only from `test/group.test.ts:204–221`. There are zero src/ or demo/ call sites.
Rubric §3: test-scaffold leaks are EXCISE. The tests rewrite to use `pause()`/`resume()` (the real
lifecycle API); the behavior they assert is already covered by the honest lifecycle path.

**`onStart` / `onEnd` hollow stubs — inline and delete.**

`group.ts:255–262`:
```ts
// group.ts:255-262 — inline and delete (hollow stubs; onEnd is a pure no-op)
onStart() {
    this.started = true;
    return this;
}
onEnd() {
    return this;
}
```

`onEnd` is a pure no-op. `onStart` sets `this.started = true`; its two callers (`advanceTo:557`,
`_playReducedMotion:669`) inline `this.started = true` directly, and the hook is deleted. Nothing
overrides these methods. Rubric §3: dead semantic surface is EXCISE.

**`soaBlendLayer` private wrapper — EXCISE (effusive-dynamicism anti-pattern).**

`group.ts:505–507`:
```ts
// group.ts:505-507 — EXCISE (kept only for bench/group-composite.bench.ts monkey-patch via as any)
private soaBlendLayer(plan: SoALayerPlan): void {
    groupSoABlendLayer(this._compositeBuf!, plan);
}
```

The bench (`bench/group-composite.bench.ts:103,110`) monkey-patches this private method via `as any`
casts to inject test inputs. Production source must not be shaped by bench hackery. The bench
rewrites to call `groupSoABlendLayer` (now in `group/soa.ts`) directly with explicit args — it has
no `this` dependency, only the buffer and plan. Rubric §3: effusive-dynamicism anti-pattern (bending
production source shape to serve test infrastructure) is EXCISE.

**`transformFramesGrouped` — demote to `protected`/private.**

`group.ts:274` is `public` but is called from the demo at
`demo/@/components/custom/animation-controls/stores/scenePlaybackAdapters.ts:130`:
```ts
group.transformFramesGrouped(now);
```
This is a demo consumer reaching into group internals. The correct public API is `render()`. The demo
call site is fixed to use `render()` (which accepts an optional `t` argument post-carve).
`transformFramesGrouped` is demoted to `private`. This is an internal-encapsulation fix with zero
public library API change (the method is not on the exported type surface of the library).

**`group-layer-springs.ts` junk-drawer 3-way split.**

`group-layer-springs.ts:36` has an honest admission: "Also colocated (the cohesive blocks lifted
alongside to clear the base ceiling)." Only 3 of its 7 exports are spring-related:

| Export | Is spring-related? | Move to |
|---|---|---|
| `resolveEntryKey`, `requireEntry` | No (entry lookup) | `group/entries.ts` |
| `computeGroupedKeys` | No (key-union fold) | `group/entries.ts` |
| `advanceSlice`, `advanceBatched` | No (scheduler-yield) | `group/scheduler.ts` |
| `renderMultiTarget` | No (multi-target render) | `group/entries.ts` |
| `snapChildrenToFinal` | No (reduced-motion snap) | `group/entries.ts` |
| `setChildrenPaused` | No (broadcast pause) | `group/entries.ts` |
| `seedLayerSpring` | Yes | `group/springs.ts` |

`advanceLayerSprings` (currently private on `group.ts:906–923`) moves to `group/springs.ts` alongside
`seedLayerSpring` (lib-group C2 confirms it has no `_grouped`/`_compositeBuf`/`_soaPlans` dependency —
only iterates entries and touches `layer.weight`/`layer.weightSpring`).

**Before/after (group):**

```
BEFORE (R.W1 output, after directory move):
  group/
    index.ts              (placeholder barrel)
    group.ts              (AnimationGroup — 924L; forcePause/forcePlay + onStart/onEnd + soaBlendLayer intact)
    soa.ts                (group-soa.ts moved; unchanged)
    layer-springs.ts      (group-layer-springs.ts moved; junk-drawer intact)

AFTER (R.W2):
  group/
    index.ts              (~25L barrel)
    group.ts              (~750L: AnimationGroup; forcePause/forcePlay excised; onStart/onEnd inlined+deleted; soaBlendLayer excised; transformFramesGrouped private; advanceLayerSprings moved out)
    soa.ts                (~254L: unchanged content; buildSoAPlans + groupSoABlendLayer)
    entries.ts            (~120L: resolveEntryKey, requireEntry, computeGroupedKeys, renderMultiTarget, snapChildrenToFinal, setChildrenPaused)
    scheduler.ts          (~50L: advanceSlice, advanceBatched — the INP-yield logic)
    springs.ts            (~80L: seedLayerSpring + advanceLayerSprings)
```

**`render()` optional-t fix.** `group.ts:517` has `const now = this.lastTickTime || performance.now()`
— a silent fallback when called before `play()`. `render()` is updated to accept an optional `t`
parameter; when called with no `t` on a never-started group, it throws explicitly instead of
substituting `performance.now()`. The silent `||` fallback is EXCISE per rubric §3. The three
occurrence sites (lines 517, 670, 702) are each addressed: the internal callers (`_frame`,
`_playReducedMotion`) always have `t` in context; the external `render()` call in the demo
scenePlaybackAdapters passes the explicit `now`.

---

### 2C. Gate co-edits (required — established by challenge-library §8)

R.W1 performs the three gate co-edits that the directory MOVE requires (boundary regex widen,
DYNAMIC_ACCESSORS prune, proof:decomposition override delete). R.W2 adds two retargetings that the
class-CARVE requires:

1. **`scripts/proof-engine.mjs:33`** — the tick-canon loop hardcodes
   `"src/animation/engine.ts"`. Retarget to `"src/animation/engine/animation.ts"`.
2. **`scripts/proof-engine.mjs:79`** — `read("src/animation/engine.ts")` for the class-ceiling
   check. Retarget to `read("src/animation/engine/animation.ts")`. The `ANIMATION_CLASS_CEILING`
   value is LOWERED from 1100 to 500 (the post-carve target), which is what makes the gate bite on
   the new file. If `animation.ts` exceeds 500 post-carve the gate reds — that is the designed
   check.

Both retargetings are authored BEFORE the carve lands (born-RED discipline: the gate reds on the old
`engine.ts` path once the file is gone, confirming the test infrastructure is live).

---

## 3. The born-RED gate — `proof:engine` (retargeted + assertion-extended)

**Gate name:** `proof:engine` (EXISTING — `scripts/proof-engine.mjs`, retargeted at R.W2).

**What it asserts post-R.W2 (four clauses):**

**(a) tick-canon** (existing D-2) — retargeted: `engine/animation.ts` and `group/group.ts` carry zero
`tick(` driver calls. Reds if the carve re-inlines the WAAPI shadow tick.

**(b) engine-seam / class-ceiling** (existing D-4, assertion change) — retargeted: reads
`engine/animation.ts` (not `engine.ts`); asserts `KeyframesAnimation` class body ≤ 500 lines (lowered
from 1100). Reds if the carve leaves the class over the new ceiling, proving the god-module shrank.

**(c) zero `as unknown as` in `engine/`** (NEW clause) — asserts ZERO occurrences of the string
`as unknown as PlaybackHost` across all files under `src/animation/engine/`. Specifically:
```
grep -r "as unknown as PlaybackHost" src/animation/engine/ → zero matches
```
Reds if the `PlaybackHost` cast survives in any form inside the engine directory. A stub that removes
only the getter name but retains a structurally-equivalent cast (e.g. renamed interface) still reds
because the clause scans for the INTERFACE NAME, not the cast syntax alone.

**(d) `PlaybackHost` not exported** (NEW clause) — asserts that no file in `src/animation/engine/`
has `export interface PlaybackHost` or `export type PlaybackHost`. Reds if the interface is renamed
and re-exported (the privacy-inversion re-instated under a different name).

**The NON-VACUOUS plant test (born-RED proof).**

The gate is born-RED on the carve day in this sequence:

1. R.W2 IMPL opens. FIRST STEP: edit `proof-engine.mjs:79` to read
   `src/animation/engine/animation.ts`. The file does not yet exist (the carve hasn't landed).
   `readFileSync` throws → the gate HARD REDS (not a soft assertion — a thrown exception). This
   confirms the retargeted gate is live before the code moves.

2. After the carve lands, the gate reads the new file. If `animation.ts` is still over 500 lines
   (the sizing was an estimate), clause (b) REDS — measured failure, not prose excuse.

3. Clause (c) RED demonstration: before excising the `_host` getter, run
   `grep -r "as unknown as PlaybackHost" src/animation/engine/` — it finds `engine/animation.ts:X`
   (the `_host` getter body still present) → clause (c) REDS. After excision, the grep returns
   empty → GREEN. The planted RED is the state BEFORE excision.

4. Clause (d) RED demonstration: `engine/playback.ts` (after R.W1's move of `engine-playback.ts`)
   still exports `PlaybackHost` → clause (d) REDS. After the interface is excised, GREEN.

This is a genuine born-RED gate: the retargeted path throws on the pre-carve tree; the `as unknown
as` assertions red on the pre-excision tree; neither is satisfied by a source grep over a string a
stub could fake.

---

## 4. Challenge-tempered cautions

**Sizing is ESTIMATE, not proof (challenge-library §5 — binding override).**

The `animation.ts ~500L` and `playback.ts ~510L` figures in the lib-engine audit are estimates with
thin margins. The challenge lane is explicit: "the `→<500` depends on the playback-delegate +
element-resolve lifts netting ~50L beyond the named extractions." R.W2 IMPL treats these as targets,
not pre-proven facts. The gate (clause b) verifies post-carve; if `animation.ts` lands over 500, the
gate reds and IMPL continues carving — it does not raise the ceiling. The same posture applies to
`group/group.ts ~750L`: post-carve, `proof:decomposition` verifies it under the hard 500L library
ceiling; if it is over, the remaining density is `transformFramesGrouped` (146L) + `boxedBlendArm`
(70L) and a further pass carves them. Do NOT raise `LIBRARY_CEILING_OVERRIDE`; those reds ARE the
backlog (R.md §5).

**Three gate co-edits in R.W1 MUST land first (R.md §2 — binding).**

`proof-boundary.mjs:84` (`isHeavyEngine` regex widen), `proof-boundary.mjs:237` (DYNAMIC_ACCESSORS
prune of the three excised accessors), and `proof-engine.mjs:33` (tick-canon file list first entry)
are R.W1 steps with re-RED tests. R.W2 inherits a GREEN boundary gate from R.W1; it does not
re-perform those co-edits.

**The directory carve is NOT zero-gate-change for `proof:engine` (challenge-library §1b — binding).**

The gestalt's §5 claim "proof:boundary survives unchanged" was corrected by the challenge lane for
R.W1 (the `isHeavyEngine` regex). The analogous finding for `proof:engine` is that its literal
`engine.ts` paths (`:33`, `:79`) break on the move. R.W2 owns the two engine-path retargetings;
R.W1 owns only the boundary-script co-edits. The carve is sequential — R.W1 regex widen → R.W2
path retarget.

**`internal/` has no barrel (challenge-library §2 — noted, not acted on here).**

The challenge lane correctly observes that the "barrel-per-directory" rule is a NEW convention
introduced by this wave family, not a continuation of `internal/`'s barrel-less shape. R.W2 authors
`engine/index.ts` and `group/index.ts` on their own merits (the LIGHT/HEAVY re-export seam requires
the barrel), not by citation of `internal/`. The inconsistency is acknowledged; giving `internal/` a
barrel for consistency is an optional follow-on (R.W3 or later), not a R.W2 blocker.

**`presets/classic.ts` data-volume case — documented override, not forced split (R.md §7, challenge-library §4b).**

`animations.ts` / `presets/classic.ts` (if the preset data lands there) is ~700L of 54% raw CSS
string data. The challenge lane rules: splitting a flat list of preset factory constants three ways
by taxonomy group, purely to satisfy a line gate on string-literal data, is contrivance. R.W2 does
not touch the presets. The correct disposition (a documented data-volume override in
`proof:decomposition`) is R.W1's responsibility or a follow-on note.

**`useSceneSwap` stays; subgrid stays; `animate()` not touched here (R.md §2).**

These are demo and API concerns owned by R.W5 and R.W4 respectively. R.W2 touches only `src/animation/engine/`
and `src/animation/group/`.

---

## 5. Verification + DEV/IMPL boundary

**This spec is the DEV deliverable.** Every claim above is grounded in the 32-lane audit: the god-module
size (`engine.ts` 1420L, `group.ts` 924L) is `wc -l`-verified this session; the three `as unknown as`
cast locations (`engine.ts:918`, `engine-playback.ts:287`, `engine-playback.ts:378`) are `grep`-verified;
`forcePause`/`forcePlay`'s zero src/demo usage is `grep`-verified; `transformFramesGrouped`'s demo call
site at `scenePlaybackAdapters.ts:130` is `grep`-verified; the junk-drawer finding in `group-layer-springs.ts`
is substantiated by the file's own comment at line 36.

**IMPL opens on explicit authorization.** When it opens, the sequence is:

1. Edit `proof-engine.mjs:33,79` to the new paths (born-RED: the files don't exist yet — the gate reds
   immediately, proving it is live).
2. Move `CSSKeyframesAnimation` to `engine/css-animation.ts`; extract `element-resolve.ts`;
   restructure `KeyframesAnimation` to compose `PlaybackState`; delete `_host` getter and
   `PlaybackHost` interface; fix the two reverse casts in `engine/playback.ts`; fix `shouldReverse`
   DRY violation; update `engine/index.ts` barrel. Run `proof:engine` — clauses (b/c/d) must be GREEN.
3. Excise `forcePause`/`forcePlay` from `group/group.ts`; inline `onStart`/`onEnd`; excise
   `soaBlendLayer`; demote `transformFramesGrouped` to private; split `group/layer-springs.ts` into
   `entries.ts` / `scheduler.ts` / `springs.ts`; move `advanceLayerSprings`; fix `render()` silent
   fallback. Fix demo call site in `scenePlaybackAdapters.ts`. Fix bench in
   `bench/group-composite.bench.ts` to call `groupSoABlendLayer` directly.
4. Run `proof:decomposition` — engine/ and group/ files must be under the 500L hard ceiling.
   If any file is over, continue carving; do NOT raise the override map.
5. Run `npm test` — all existing tests green (the forcePause/forcePlay tests are rewritten to use
   `pause()`/`resume()`; behavior is preserved).
6. Run `proof:boundary` (inherited GREEN from R.W1) — confirmed no regression from the engine-family
   barrel re-point.
