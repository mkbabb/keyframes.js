# D.W4 — The engine transposed to its gestalt (elegance · perf)

**Phase:** IMPL · **Class:** MAJOR · **Scope:** `src/animation/` (library `src/`)
· **Parallel to:** every demo wave (W1/W2/W3 are demo-side, file-disjoint) ·
**Gated on:** keyframes' own green CI (inv-27).

C.W4 folded the steppers + the loop core to one `RAFPlayback._run`
(`playback.ts:96`) and one canonical `tickDt(ms)`. The close was honest (inv ε)
but it named a gestalt tail: the group compositor still allocates per-frame,
`tick` still carries two meanings at the driver layer, the computed-unit
round-trip re-serializes every frame, `Animation` is a 1100-line god-object at
the wrong seam, and deprecated path-compat re-exports linger. D.W4 is the
terminal transposition — net-deletion, isomorphic, no-legacy. Evidence:
`audit/engine-transposition.md`.

The user's mandate is the spine of this wave: **elegance · simplicity ·
performance above all; architectural transpositions necessary + desirable; NO
legacy/deprecated codepaths (this is a development product); KISS.** The wave
declares MAJOR up front so the renames (`tick(t)`→`advanceTo(t)`, the
`FrameCompiler` extraction) are absorbed without a back-compat shim — a removed
name is removed, not aliased.

---

## The transpositions

### D-1 [PERF] — AnimationGroup compositor goes allocation-free

`AnimationGroup.transformFramesGrouped` (`group.ts:198`) is the lone hot loop
that violates the class's own zero-alloc discipline. The class already
hoists the `_entries` field (`group.ts:81`) behind a dirty flag, surfaced via
`getEntries()` (`group.ts:136`), and refreshes each child's `values` in place
(`group.ts:196`, "no fresh object is allocated per entry per frame"; the
in-place `animation.interpFrames(...)` refresh call is at `group.ts:214`) — but
the composite itself still allocates two fresh objects on **every** frame:

1. **`groupedValues`** — a fresh `Record` literal at `group.ts:199`, rebuilt
   per frame and handed to `this.transform` (`group.ts:287`).
2. **The whitelist filter** — the full `filteredValues` construct at
   `group.ts:221-228` (`Object.fromEntries` opening at `:222`, the `: values`
   fallback closing at `:228`), allocating an entries array + a filtered object
   per *enabled layer* per frame whenever `layer.properties` is set.

**The transposition:**
- Hoist `groupedValues` to a long-lived instance buffer (`_groupedValues:
  Record<string, unknown>`), cleared in place at the top of
  `transformFramesGrouped` exactly as `interpFrames`'s `out` buffer is cleared
  (`engine.ts:790`, `for (const k in result) delete result[k]`) — the same
  zero-alloc idiom already proven in the hot path.
- Inline the `properties.has()` whitelist: iterate `values` keys directly and
  `continue` on `layer.properties && !layer.properties.has(key)`, instead of
  materializing a `filteredValues` object. The three blend arms (`replace` /
  `add` / `weighted`, `group.ts:230-282`) read the whitelist inline; no
  intermediate collection survives the frame.

`render()` (`group.ts:302`) and `_playReducedMotion` (`group.ts:474`) call
`transformFramesGrouped` too (`group.ts:489`) — both inherit the buffer reuse
for free
(neither is hot, but neither must allocate to stay correct: the buffer is
cleared on entry, so no stale key leaks across the scrub/snap/draw callers).

**Isomorphism:** the composited values are byte-identical; only the allocation
disappears. The blend semantics (in-place numeric accumulation for `add`,
in-place `lerp` for `weighted`, `group.ts:245`/`group.ts:269`) are unchanged —
they already mutate carriers in place, so the buffer reuse is purely additive.

### D-2 [SIMPLICITY] — finish `tick` canonicalization at the DRIVER layer

C.W4 unified the *stepper* tick to one `tickDt(ms)`. The **driver** layer still
overloads `tick`: `Animation.tick(t)` (`engine.ts:889`) and
`AnimationGroup.tick(t)` (`group.ts:345`) both take an **absolute clock
timestamp** (the rAF `now`), not a delta — `this.t = t - this.startTime`
(`engine.ts:905`). Reading `tick` across the engine, one name means two things:
a dt-step (`tickDt`) and an absolute-clock advance (`tick`). KISS demands one
meaning per name.

**The transposition:** rename the absolute-clock advance to `advanceTo(t)` on
both `Animation` and `AnimationGroup`. `tick` is then reserved for the dt
family (`tickDt`), and `advanceTo(absoluteClock)` reads as exactly what it does.
Call sites move with it:
- `Animation._frame` (`engine.ts:919`, `t = await this.tick(t)` →
  `await this.advanceTo(t)`).
- `AnimationGroup._tickSlice` (`group.ts:385`, `anim.tick(t)` →
  `anim.advanceTo(t)`) and `_frame` (`group.ts:398`, `await this.tick(t)` →
  `await this.advanceTo(t)`).

Because the wave is MAJOR, the old `tick` driver name is **deleted**, not
aliased — a `tick`/`advanceTo` pair would re-introduce the two-meanings
ambiguity this fold exists to retire (no-legacy). Demo call sites (the
group-playback composables) move in the same wave; the demo is now in-tree.

### D-3 [PERF] — the computed-unit DOM round-trip writes changed keys only

`transformTargetsStyle` (`utils.ts:323`) is the renderer for every default
DOM animation: it `unflattenObjectToString(vars)` then, for **every** target,
`Object.entries(styleStringVars).forEach(target.style.setProperty(...))`
(`utils.ts:332-336`) — the full key-set re-serialized and re-written each frame,
even for keys whose string value did not change since the previous frame. For
computed units (`vh`/`calc`/`var`/`cqw`) this is the costly path: each
`setProperty` can force a style recalc on read-back.

**MEASURE-FIRST — the gate is a benchmark delta, not an assertion.** D-3 lands
ONLY if `bench/interpolation.bench.ts` (extended with a default-renderer
computed-unit case) shows a real, reproducible reduction in per-frame
`setProperty` count + wall-time on the changed-keys path. If the measured delta
is within noise, D-3 is **withheld with the measurement recorded** (the C.W4
"default css-twin VERIFIED-then-WITHHELD" discipline — a perf claim is proven or
it is not shipped).

**The transposition (if it measures):**
- Cache the unflattened key→string map per target on the renderer (a
  `WeakMap<HTMLElement, Map<string, string>>` keyed by target, so multiple
  targets each carry their own last-written set and GC tracks element lifetime).
- Each frame, diff the freshly-serialized `styleStringVars` against the cached
  map; call `setProperty` only for keys whose string changed, then update the
  cache. Unchanged keys are skipped — no DOM write, no recalc.

**Isomorphism:** the rendered CSS is identical after every frame (the cache
holds exactly what the DOM holds); only redundant writes are elided. The first
frame writes the full set (cold cache), matching today's behavior exactly.

### D-4 [ELEGANCE] — split the ~1100-line `Animation` god-object at the right seam

`engine.ts` is 1277 lines; `Animation` itself spans `engine.ts:126-1145` — the
deepest re-architecture in D. The class fuses two responsibilities that change
for different reasons and at different rates:

1. **Frame compilation + option carriage** — `addFrame` (`engine.ts:263`),
   `createFrame` (`engine.ts:304`), `buildVarIndex` (`engine.ts:357`),
   `reconcileVars` (`engine.ts:380`), `parse` (`engine.ts:427`), and the ten
   fail-explicit option setters (`setTimingFunction`…`setHueMethod`,
   `engine.ts:494-692`) + `setOptions` (`engine.ts:694`). These build the
   compiled `AnimationFrame[]` and own `AnimationOptions`; they do not touch the
   playback clock.
2. **The playback state-machine** — `play`/`pause`/`resume`/`stop`/`reset`/
   `settle` (`engine.ts:1005-1124`), `advanceTo` (was `tick`, `engine.ts:889`),
   `_frame`/`_playRAF`/`_playWAAPI`/`_playReducedMotion`
   (`engine.ts:918-1003`), `onStart`/`onEnd` (`engine.ts:844-887`), and the
   clock/iteration/`reversed` flags (`engine.ts:158-167`).

**The seam (the right one — not a mechanical line-count split):**
- Extract a **`FrameCompiler`** that owns `templateFrames`, `parsedVars`,
  `frames`, and the compile pipeline (`addFrame`/`createFrame`/`buildVarIndex`/
  `reconcileVars`/`parse`/`interpFrames`). It is a pure value-in → frames-out
  unit with no clock and no rAF — directly unit-testable without a playback
  loop. The `AnimationOptions` carrier (the setters + `restPosition`/`paintRest`
  derivation, `engine.ts:737-751`) rides with it, since duration/easing/fill are
  compile inputs.
- `Animation` retains the **playback state-machine** and *composes* a
  `FrameCompiler` (delegating `interpFrames`/`frames`/`parse` to it). The class
  shrinks to the clock + lifecycle it actually owns.

**Net-deletion + scoped carefully.** `CSSKeyframesAnimation` (`engine.ts:1147`)
extends `Animation` and adds only the `from*` parsing entry points
(`fromString`/`fromKeyframes`/`fromVars`) — it composes the same `FrameCompiler`
unchanged. The public surface (`Animation`, `CSSKeyframesAnimation`,
`getAnimationId`, the heavy re-exports at `engine.ts:1267-1277`) is **byte-stable
on the barrel**: the split is internal. `AnimationGroup` reads
`animation.frames`, `animation.interpFrames`, `animation.options`,
`animation.t`, `animation.done` (`group.ts:206-484`) — every one of those stays
a property/method of `Animation` (delegated to the compiler where it now lives),
so the group is untouched. The boundary (`proof:boundary`) is unaffected:
`engine.ts` stays the single heavy module; `FrameCompiler` lives beside it
behind the same dynamic edge.

### D-5 — `AnimationGroup.pause` → honest pause/resume + toggle

`AnimationGroup.pause()` (`group.ts:506`) currently TOGGLES — "Calling pause()
when playing pauses; calling pause() when paused resumes" (`group.ts:498`), with
the docstring admitting it is "preserved for backward compatibility with demo's
toggleAnimationGroup." That back-compat is now dead weight: **the demo is
in-tree** (D's premise), so the consumer moves with the engine. A method named
`pause` that secretly resumes is exactly the two-meanings-per-name defect D-2
retires, in a second place.

**The transposition:**
- `pause()` pauses (idempotent — pausing a paused group is a no-op).
- `resume()` resumes (idempotent — resuming a running group is a no-op),
  mirroring `Animation.pause`/`Animation.resume` (`engine.ts:1043`/`1053`).
- `toggle()` is the explicit flip, for the transport button that genuinely wants
  toggle semantics. The per-child propagation (`group.ts:513-527`), the
  loop-stop + final-frame `render()` on pause (`group.ts:529-538`), and the
  loop-restart on resume are split across `pause`/`resume` honestly; `toggle`
  dispatches to one or the other on `this.paused`.

The demo's `toggleAnimationGroup` re-points to `group.toggle()` — same behavior,
honest name. No alias for the old toggling `pause` (no-legacy).

### The leaf retirements (folded into this wave)

- **Deprecated path-compat re-exports — DELETE.**
  - `src/animation/utils.ts:34-42` re-exports `lerpColorValue`/`lerpComputedValue`/
    `lerpNumericValue`/`lerpValue` from value.js purely so old import paths keep
    resolving — the comment itself says "New code should import from
    @mkbabb/value.js directly" (`src/animation/utils.ts:34-36`, reiterated at
    `:159-161`). With the demo in-tree, the consumers move to the value.js path;
    the re-export block is **deleted**.
  - `src/animation/format.ts:12-16` re-exports `formatCSS` "for the convenience of
    consumers that already import animation-class helpers from this module"
    (the `export { formatCSS }` at `:16`)
    — same deprecated-convenience pattern, **deleted**; the value.js-direct
    `formatCSS` import replaces it at the (now in-tree) call site.
- **`leaves.ts | any` — tighten.** `cancelAnimationFrame(handle: number |
  undefined | null | any)` (`leaves.ts:75`) collapses to `any` via the trailing
  `| any`. The shim accepts either a numeric rAF handle (browser) or a
  `NodeJS.Timeout` (the `setTimeout` fallback, `leaves.ts:63`) — the honest type
  is `ReturnType<typeof requestAnimationFrame> | undefined | null`, matching the
  return type the shim itself produces (`leaves.ts:55`). The `| any` is removed;
  `clearTimeout`/`cancelAnimationFrame` accept the precise union.
- **Stale post-W4 docstrings — sweep.** The `tick`→`advanceTo` rename, the
  `FrameCompiler` extraction, and the `pause`/`toggle` split invalidate
  docstrings that name the old shapes (e.g. `group.ts:498` "Toggle pause state
  … backward compatibility", `engine.ts:889` `tick` prose, the `src/animation/
  CLAUDE.md` method lists). The sweep is mechanical and part of the wave's
  net-deletion accounting — a renamed thing's prose is corrected, never left to
  drift.

---

## Hard gate (falsifiable · re-runnable · MUST bite)

A re-runnable instrument set, not a narration. The wave is **not done** until
each passes locally (= CI):

### 1. `proof:zero-alloc` — the group composite allocates 0 bytes/frame in steady state

A new checked-in bench (`bench/zero-alloc.bench.ts`, wired as
`proof:zero-alloc` in `package.json` alongside `proof:boundary`/`proof:dogfood`)
drives a single-target `AnimationGroup` (≥3 children, mixed blend modes incl. a
`layer.properties` whitelist so the inlined filter is exercised) through ≥120
steady-state composite frames and asserts **zero heap growth attributable to the
composite**. Falsifiable two ways, both required to bite:

- **Allocation-count** — wrap `transformFramesGrouped` so a counting proxy (or a
  V8 `--expose-gc` heap-delta sample taken after a forced GC, before/after the
  steady-state window) records bytes allocated per frame. Steady-state
  (post-first-frame, no layer-config mutation) MUST be `0`.
- **Bite proof** — a sibling assertion re-introduces a per-frame literal (the
  injected `KF_ALLOC_INJECT=group` path constructs a throwaway object inside the
  loop) and confirms the gate **reddens** — so a future regression that
  re-allocates `groupedValues` or the filter object is caught, not silently
  tolerated. (Mirrors `KF_OCCLUSION_INJECT`'s bite proof, C.W1.)

### 2. The engine tests stay green

`npm test` — the engine suite (`test/{animation,group,engine-modern-web}.test.ts`
+ the stepper/playback/timeline files) stays **green** across the `advanceTo`
rename, the `FrameCompiler` split, and the `pause`/`resume`/`toggle` API. The
no-regression baseline at D.W4-open is **320 tests passing across 24 files**
(live `npm test`, matching the C-close figure); D.W4 adds direct `FrameCompiler`
unit tests (compile-without-a-clock) and `pause`/`resume`/`toggle` idempotence
tests, raising the count, and the gate is **no-regression + the new cases
pass**.

### 3. No-deprecated-reexport grep = 0

A checked-in grep (folded into `proof:boundary` or a sibling `proof:no-legacy`)
asserts:
- `src/animation/utils.ts` exports **no** value.js lerp re-export block (the
  `export { lerpColorValue, lerpComputedValue, lerpNumericValue, lerpValue }` at
  `src/animation/utils.ts:34-42` is gone).
- `src/animation/format.ts` exports **no** `formatCSS` convenience re-export (the
  `export { formatCSS }` at `src/animation/format.ts:16` gone).
- `leaves.ts` contains **no** `| any` (`leaves.ts:75` tightened).
- no driver-layer `tick(` survives (`advanceTo` is the only absolute-clock
  advance); no `AnimationGroup.pause` toggling docstring survives.

The grep returns `0` matches for the retired patterns or the gate fails.

---

## Isomorphism + no-legacy ledger

| Change | Pixels / behavior | Legacy removed |
|---|---|---|
| D-1 buffer hoist + inline filter | identical composite values | per-frame object literals |
| D-2 `tick`→`advanceTo` | identical clock advance | the overloaded `tick` name |
| D-3 changed-keys write (if it measures) | identical CSS after each frame | redundant `setProperty` writes |
| D-4 `FrameCompiler` split | byte-stable public barrel | the wrong-seam god-object |
| D-5 `pause`/`resume`/`toggle` | identical transport behavior | the secretly-toggling `pause` |
| re-export retirement | n/a (compile-time) | `src/animation/utils.ts:34-42`, `src/animation/format.ts:12-16` |
| `leaves.ts` type tighten | n/a (compile-time) | the `\| any` widening |

Net-deletion at the core (the major absorbs the renames; the re-exports and the
god-object seam are removed, not aliased). Verified not asserted: D-1 by
`proof:zero-alloc` (bite-proven), D-3 by a measured bench delta (or withheld),
the retirements by the no-legacy grep, the whole by `npm test` green.
