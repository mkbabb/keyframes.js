# engine-core-k.md — Engine Core Audit (Tranche K)

**Lane:** engine-core  
**Scope:** `src/animation/engine.ts`, `frame-compiler.ts`, `group.ts`, `playback.ts`, and their
direct collaborators (`utils.ts`, `format.ts`, `constants.ts`, `internal/leaves.ts`,
`internal/binarySearch.ts`).  
**Branch / commit:** `tranche-j-dev` @ `4f1fc4c` (= master, Tranche J closed 2026-06-11,
4.2.0 published).  
**Date:** 2026-06-11.  
**Auditor:** engine-core lane.

All claims cite `file:line` or a command + observed output (inv ε). Severity: P0 = product
broken for a human; P1 = real defect or design failure; P2 = refinement.

---

## §1 — Sync-step conversion: final shape (FB-2 LANDED, J.W6 S1)

**Status: SOUND. The LAND is real and complete.**

`advanceTo(t)` returns `number | Promise<number>`: a plain `number` on every post-start steady
frame, a thenable ONLY on the genuinely-async first-tick delay sleep
(`engine.ts:849`, `group.ts:461`).  
`RAFPlayback._run` reschedules inline on the sync fast-path (no microtask hop) and defers only
for a thenable result (`playback.ts:126-148`). This matches the J.W6 S1 LAND exactly, gated by
`test/sync-step.test.ts` and `test/event-ordering.test.ts`.

One residual note: `Animation._frame` still checks `typeof stepped === "number"` to branch
(`engine.ts:904-908`). The branch is correct, but the thenable fast-path check
(`typeof (result as Promise<boolean>).then === "function"`) in `RAFPlayback._run` and the number
check in `_frame` are subtly dual guards over the same invariant. Both are correct as written; no
defect.

---

## §2 — SoA `lerpArray` adoption: ELECTED but not yet implemented (J.W6 S2 ADOPT decision)

**Status: ADOPTED (decision), IMPL NOT YET LANDED. Active K-scope work item.**

The J.W6 S2 bench artifact (`bench/interp-buffer.bench.ts`, committed) measured:

```
K=8  current per-channel _lerp : 0.0928 ms/window (10,772 Hz)
K=8  SoA Float64Array+lerpArray: 0.0056 ms/window (179,142 Hz)
delta = 16.6× faster = 94.0% wall-time reduction  (threshold: ≥20%)
```

The ADOPT decision was recorded in `docs/tranches/J/waves/J.W6-impl.md §S2`. The corresponding
`test/lerparray-adopt.test.ts` guards the API lock, semantics, and equivalence oracle. But:

```
grep -r lerpArray src/
(no output)
```

The `FrameCompiler` still emits `interpVars: Record<string, InterpolatedVar[]>` and
`interpFrames` dispatches per-channel `lerpValue` closure calls (`engine.ts:778-779`). The
per-channel loop is the cost center the bench measured. The SoA transposition (pack per-frame
channels into `Float64Array`; replace the per-channel loop with a single `lerpArray(from, to,
t, out)` call in `interpFrames`) has not landed.

**Finding EC-1 (P1):** The ADOPT decision from J.W6 carries over as a K.W-class engine motion.
The bench oracle (`test/lerparray-adopt.test.ts`) and the bench arm (`bench/interp-buffer.bench.ts`)
are the correctness harness the implementation must land behind. The FrameCompiler refactor is
HIGH-risk (it changes the `AnimationFrame.interpVars` type from `Record<string, InterpolatedVar[]>`
to a parallel `Float64Array` SoA shape, or keeps the existing shape and adds a compiled SoA shadow
buffer). The J.W6 spec (`J.W6-impl.md §S2`) chose the "emit a shadow `Float64Array` consumed by
`lerpArray` in `interpFrames`" form — lowest-blast-radius. The impl must land in a dedicated K wave
with a born-RED gate that reds if `grep -r lerpArray src/` remains zero after the motion.

---

## §3 — `reconcileVars` index semantics: subtle but correct (compile-time only)

**Status: CORRECT. A naming clarity gap worth documenting.**

`frame-compiler.ts:399` calls `this.frames.forEach((_, ix) => this.reconcileVars(ix, varIndex))`.
The parameter `ix` is the **compiled-frame array index**, not a template-frame index. But for the
initial N−1 compiled frames created by the adjacency loop (`frame-compiler.ts:393-395`),
`frames[i].ixs.start === i` by construction (adjacent frames start at template index 0, 1, …, N−2).
So `parsedVars[ix]` inside `reconcileVars` correctly reads the template frame at the same
index. Non-adjacent frames created DURING `reconcileVars` are pushed to `this.frames` after
`forEach` snapshotted the array — they are never visited by the outer loop — which is intentional
and correct: `reconcileVars(ix)` for template index `ix` already emits ALL non-adjacent segments
rooted at that index; no second pass is needed.

**Finding EC-2 (P2):** The `frames.forEach` call's `ix` reads as a compiled-frame index but
functions as a template-frame index. This dual reading is safe only because of the adjacency-loop
invariant. The comment at `frame-compiler.ts:397-399` says "variable reconciliation using
pre-built index for O(1) lookups" but does not state the index coincidence assumption. A future
refactor that breaks adjacency order would silently misread `parsedVars[ix]`. Recommend naming
the index explicitly: iterate `for (let ix = 0; ix < this.parsedVars.length - 1; ix++)` instead
of via `frames.forEach` to make the template-frame intent unambiguous.

---

## §4 — `reconcileVars` compile-time `findIndex` is O(N) over compiled frames

**Status: P2 compile-time-only cost; not a hot-path regression.**

`frame-compiler.ts:348-350`:
```ts
const frameIx = this.frames.findIndex(
    (f) => f.ixs.start === startIx && f.ixs.stop === endIx,
);
```

This is called once per variable per template frame during `parse()`. For a keyframe with K
variables and N stops, the cost is O(K × N × frames_so_far). For typical animations (N=2 stops,
K≤12 properties) this is negligible. For pathological inputs (N=20 stops, K=50 properties) it
is quadratic in N. The content-derived `id = startIx * FRAME_ID_SCALE + endIx`
(`frame-compiler.ts:280`) is already available as the unique key. A `Map<number, AnimationFrame>`
keyed on `id` would replace the `findIndex` with an O(1) lookup and make the
"frame already exists?" check explicit at the frame-creation seam.

**Finding EC-3 (P2):** Replace the `frames.findIndex` in `reconcileVars` with a
`Map<number, AnimationFrame>` keyed on `startIx * FRAME_ID_SCALE + endIx`. The map is local to
`parse()`, not a persistent field. Cost: one extra Map allocation per `parse()` call (amortized
irrelevant; parse is not on any hot path). Benefit: the quadratic case disappears, the
"already exists" check is an O(1) lookup, and the intent is explicit.

---

## §5 — Serialize authority: SOUND, ONE projection, two surfaces (J.W1 S1 ENG-1 DONE)

**Status: SOUND.**

Both `CSSKeyframesToString` and `CSSKeyframesToStrings` project through `declaredKeyframeBody`
(`format.ts:74-96`), which reads `animation.parsedVars[i]` (the DECLARED template values, not
DOM-resolved `flatVars`). The pre-J defect (reading `frame.flatVars` — the interp-mutated live
buffer) is retired. `serializeEasing` is the one faithful easing→CSS path for both surfaces. The
`F.W7` per-keyframe easing round-trip emits `animation-timing-function` only when the frame
easing differs from the default (`format.ts:87-90`).

One minor surface gap:

**Finding EC-4 (P2):** `format.ts:219` applies a post-formatter regex:
`out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}")`. This is a silent workaround for
a Prettier formatting artifact where `@keyframes` `{...}` blocks are wrapped in parentheses
by the `formatCSS` call. If the `formatCSS` (value.js's Prettier wrapper) changes its output
shape, this regex silently produces malformed CSS without any test catching it. A more robust
approach is to assert post-format that the output does NOT contain `({` or `})` before the
regex fires, or to eliminate the need for the fixup at the value.js/Prettier seam. Filed as P2
because the test suite does not currently cover this post-format normalization.

---

## §6 — `tryParseCache` module-level singleton has no eviction

**Status: P2 — functional, but a latent memory pressure issue in long-running consumers.**

`utils.ts:203`: `const tryParseCache = new Map<string, ValueArray>();` — module-level,
never cleared. The key is `"${childKey}:${strValue}"`. For the demo SPA (same animations
re-parsed on scene switch, bounded CSS vocabulary), this is a win: parse results are amortized
across all re-parses of the same keyframes. For a library consumer that programmatically
generates unique CSS values (e.g. a generative art canvas, an animation editor that compiles
thousands of unique keyframe strings), the cache grows without bound.

**Finding EC-5 (P2):** The cache correctly clones on hit (`cached.clone()` — the consumer owns
the returned ValueArray), so cache safety is not the concern. The concern is unbounded growth.
A `WeakRef`-based LRU or a fixed-capacity eviction (e.g. cap at 10 000 entries, oldest-evict)
would bound memory without observable behavior change. Low priority for the current use pattern;
worth noting as the consumer surface grows.

---

## §7 — `_advanceBatched` allocates a slice per batch iteration

**Status: P2 compile-time-equivalent cost; negligible in practice but inconsistent with the
zero-alloc discipline elsewhere.**

`group.ts:483`:
```ts
await this._advanceSlice(entries.slice(i, i + batch), t);
```

`entries.slice(i, i + batch)` allocates a fresh Array per batch (YIELD_BATCH = 32; only
reached when `entries.length > 32`). This is on the genuinely-async batch path — it only fires
for groups larger than 32 children and only when yielding to the main thread is warranted. The
per-batch alloc is dominated by the `yieldToMain()` Promise overhead. But it is inconsistent
with the zero-alloc hot-path discipline.

**Finding EC-6 (P2):** Pass start/end indices instead of a slice: `_advanceSlice(entries, lo,
hi, t)` with a loop `for (let j = lo; j < hi; j++)`. Eliminates one Array allocation per batch
iteration. Trivial refactor; no behavior change.

---

## §8 — Hot-path analysis: `interpFrames` is correct and zero-alloc on the steady path

**Status: SOUND. The F.W4 alloc-discipline is intact.**

Steady path (single active frame, `lo === hi`):
1. `binarySearchRange` — O(log N), no alloc (`internal/binarySearch.ts:21-37`).
2. `processFrame` — mutates `frame.allInterpVars[k].value` in place via `lerpValue`
   (`engine.ts:769-785`). One `scale` call (value.js import, not leaves.ts) for the
   time-normalized `scaled`. The zero-width guard (`start === stop ? 1 : scale(…)`) is correct
   and prevents the `scale` throw on equal bounds (`engine.ts:775`).
3. The single-frame fast-path aliases `frames[seedIdx]!.flatVars` directly — no copy, no clear
   (`engine.ts:719-728`). This aliasing is safe because standalone callers (no `out` buffer)
   get the reference and the buffer-path callers (group's `entry.values`, the play loop's
   `_interpOut`) always pass an explicit `out` and take the copy+clear branch.
4. `clearBuffer` uses the stable-key null-fill (F.W4 S1) — no `delete`, V8 fast-properties
   preserved (`engine.ts:754-759`).

The group's composite path (`transformFramesGrouped`) uses `_groupedKeys` null-fill (F.W4 S2) and
the post-blend compaction `delete` only for keys with `undefined` values — rare, fast-properties-
safe in the common case (`group.ts:378-381`).

No P0/P1 findings in the hot path. The two P2 open items (EC-1 lerpArray impl, EC-3 findIndex
replacement) do not touch the hot path.

---

## §9 — `composition` field in `ResolvedKeyframes` is captured but not honored

**Status: P2 — intentional BOOK, but the half-wire creates a silent no-op surface.**

`adapter.ts:29,107,120-125` captures `animation-composition` per keyframe into
`ResolvedKeyframes.composition`. `engine.ts` never reads `resolved.composition` when calling
`addFrame` in `fromString`. The field was added in F.W8 with the explicit note: "honoring it
(→ WAAPI composite / rAF accumulate) is BOOKed, not half-wired" (`adapter.ts:25-27`).

A CSS author who writes `animation-composition: add` in a `@keyframes` block gets silent
replace-blending. This is consistent with the BOOK note but a potential surprise if the author
imports a CSS file that already worked in the browser (where `animation-composition: add` in a
`@keyframes` rule IS honored by the UA).

**Finding EC-7 (P2):** The `composition` field is present in `ResolvedKeyframes` and populated,
but no consumer reads it. Either: (a) wire it to a per-frame layer blend mode at the
`addFrame` call site in `fromString` (the `add` CSS value maps to `blendMode: "add"` in
`AnimationLayerConfig`), or (b) add a comment at `engine.ts:fromString` explicitly noting the
non-consumption and cross-referencing the BOOK item. The current posture is silent: a debug
user reading `fromString` does not know `composition` exists.

---

## §10 — `setTargets` allocates `Object.values` and nested `forEach` chains

**Status: P2 — not hot path but unnecessarily allocates at every `setTargets` call.**

`engine.ts:1161-1173`:
```ts
this.frames.forEach((frame) => {
    Object.values(frame.interpVars).forEach((values) => {
        values.forEach(({ start, stop, value }) => {
            start.setTargets(this.targets);
            stop.setTargets(this.targets);
            value.setTargets(this.targets);
        });
    });
});
```

`Object.values(frame.interpVars)` allocates a values array each call. `frame.allInterpVars` is
already the pre-flattened union of all interp vars (built in `finalizeFrameVars`,
`frame-compiler.ts:437`). `setTargets` is already called once at compile time via
`parseAndFlattenObject` → `values.setTargets(targets)`. The `setTargets` call here is the
live-targets-rebind (on DOM node swap). Using `allInterpVars` would remove the intermediate array:

```ts
for (const frame of this.frames) {
    for (const iv of frame.allInterpVars) {
        iv.start.setTargets(this.targets);
        iv.stop.setTargets(this.targets);
        iv.value.setTargets(this.targets);
    }
}
```

**Finding EC-8 (P2):** Replace the `setTargets` implementation with the `allInterpVars`
iteration above. Zero behavior change; eliminates one `Object.values` allocation per frame per
`setTargets` call.

---

## §11 — `leaves.ts` `scale` throws on equal bounds; `engine.ts` guards; no parity test

**Status: P2 — the guard is correct but untested as a unit.**

`leaves.ts:35-37`: `scale` throws `"fromMax and fromMin cannot be equal"`.
`engine.ts:775`: `const scaled = start === stop ? 1 : scale(t, start, stop, 0, 1)` guards the
zero-width case. The leaves-parity test (`test/leaves-parity.test.ts`) tests `clamp`/`lerp`/`scale`
against value.js's copies but does NOT test the `scale` throw case or the engine's zero-width
guard. A degenerate two-keyframe `fromKeyframes({ "50%": {...}, "50%": {...} })` would produce a
zero-width frame; the guard at `processFrame` catches it but no test pins that path.

**Finding EC-9 (P2):** Add a test case to `test/engine-correctness.test.ts` (or a new
`test/zero-width-frame.test.ts`) that builds a zero-width frame (two keyframes at the same
percentage) and asserts that `interpFrames` returns the endpoint value without throwing. This
pins the `E-RT-5` degenerate guard.

---

## §12 — `AnimationGroup.pause()` uses `performance.now()` fallback; resume clock drift

**Status: P2 — a subtle jump-free contract gap on the very first pause.**

`group.ts:656`: `const now = this.lastTickTime || performance.now()`.

`lastTickTime` is 0 before the first rAF frame. If `pause()` is called before the first `_frame`
tick (e.g. immediately after `play()`, before rAF fires), `now` falls back to
`performance.now()`. That value is then stored as each child's `pausedTime` (`group.ts:663-665`).
When `resume()` adjusts `startTime` (`engine.ts:867-870`), it computes `dt = t - pausedTime`
where `t` is the rAF timestamp and `pausedTime` is `performance.now()`. rAF timestamps
(`DOMHighResTimeStamp`) and `performance.now()` share the same origin so the difference is
typically ≤1 frame; in practice the resume is nearly correct but the comment at `group.ts:661`
says "Use the last rAF timestamp (not performance.now()) so resume correctly adjusts startTime
without a forward jump." The code contradicts this comment for the pre-first-frame pause case.

**Finding EC-10 (P2):** The guard should be `const now = this.lastTickTime !== 0 ? this.lastTickTime : performance.now()`.
`this.lastTickTime || performance.now()` has the same behavior (`0` is falsy) so this is actually
correct — but the comment claims `performance.now()` is NOT used. The comment is misleading.
The true fix is to accept the `performance.now()` fallback here (it is functionally correct
within 1-2 ms) and update the comment to clarify the fallback case. No behavior change needed.

---

## §13 — `animationOptionsToString` omits `useWAAPI` and `respectReducedMotion`

**Status: P2 — informational omission only; these options have no CSS equivalents.**

`format.ts:145-171` serializes `AnimationOptions` to a CSS `.class { animation-* ... }` block.
`useWAAPI` and `respectReducedMotion` are engine-internal options with no CSS equivalent. They
are correctly omitted from the CSS output. However, there is no comment stating this omission
is intentional. A contributor adding a new option to `AnimationOptions` might not notice that
`animationOptionsToString` must be updated if the new option has a CSS form.

**Finding EC-11 (P2):** Add a comment at `format.ts:145` noting that `useWAAPI`,
`respectReducedMotion`, `colorSpace`, and `hueMethod` are deliberately omitted (no CSS equivalents)
so the function's partial serialization is explicit-by-design, not accidental.

---

## §14 — `RAFPlayback.drive` idempotency vs multi-arm scenario

**Status: P2 — correct but surprisingly brittle for multi-consumer.**

`playback.ts:208-209`:
```ts
drive = (tickable: Tickable, onFrame?: () => void): void => {
    if (this._rafId !== null) return;
```

The idempotency guard means a second call to `drive` while the loop is running is a no-op. This
is documented and expected (consumers re-arm freely). But if a consumer calls `drive(a)` then
immediately `drive(b)` with a different `Tickable`, `b` is silently dropped. The contract says
one `Tickable` per `RAFPlayback` — but nothing enforces this. `SmoothProgress` and
`SpringProgress` each own their own `_playback = new RAFPlayback()`, so collision is not possible
today. If a future class shares a `RAFPlayback` across two `Tickable`s, the second is silently
lost.

**Finding EC-12 (P2):** The idempotency behavior of `drive` is correct for the current usage
pattern but undocumented as "one Tickable per RAFPlayback." Add a comment to `drive` stating
this invariant so a future multi-tickable consumer is warned.

---

## §15 — `fromString` per-keyframe clone is O(N properties) per keyframe

**Status: P2 — acceptable for parse time, but the comment understates what is cloned.**

`engine.ts:1292-1298`:
```ts
const frame = Object.fromEntries(
    Object.entries(cachedFrame).map(([k, v]) => [
        k,
        hasClone(v) ? v.clone() : v,
    ]),
) as Record<string, unknown>;
```

This clones every property in the memoized parsed frame. The comment says "Clone the frame to
avoid mutating the memoized parse cache" which is correct. But `ValueArray.clone()` is a deep
clone that rebuilds the entire value structure. For a keyframe with 20 properties, this is 20
deep clones per `fromString` call (once per animation construction). In a scene that creates
animations dynamically (the easing gallery creates ~50 animations), this is 50 × N-keyframes ×
M-properties deep-clone calls at mount time. The cost is bounded by parse time (not playback
time) and is dominated by the CSS stylesheet parse itself.

No finding above P2. The existing cache clone is the correct approach; no change required. The
observation is for the K-perf lens: if parse time becomes a measured bottleneck in the easing
gallery scene, this is the hot spot.

---

## §16 — `AnimationGroup` constructor inherits transform from first PARSED frame only

**Status: P1 for cold-construction sequences where parse happens after group construction.**

`group.ts:133-136`:
```ts
if (this.transform === NOOP_TRANSFORM && animation.frames[0] != null) {
    this.transform = animation.frames[0].transform;
}
```

If the animation is constructed before `parse()` is called (e.g. the demo's cube/amiga pattern
where `new CSSKeyframesAnimation(opts)` precedes `fromString`), `frames[0]` is `null` and the
constructor sets `transform = NOOP_TRANSFORM`. The I.W0 S3 lazy-resolve in
`transformFramesGrouped` (`group.ts:392-400`) recovers this — it walks the entries on the first
draw and picks up the frame's transform. The recovery is idempotent and correct.

BUT: the orchestrator triage cites "subjects freeze while the playhead/slider advances" as the
cold-path symptom (U-K2, U-K3 in the K-register). This is consistent with
`transform === NOOP_TRANSFORM` surviving through to `transformFramesGrouped` and the lazy-resolve
never firing because `entry.animation.frames[0]` is still `null` when the draw starts. The root
cause may be the J.W7c U4 conditional-select deletion: if the scene builds its `animationGroup`
before any animation is parsed (or before the selected animation is parsed), the group draws with
a NOOP_TRANSFORM for the first several frames until `markSceneReady` → `bindSceneAdapter` fires
and the selected animation's group is wired.

**Finding EC-13 (P1):** The `group.ts` lazy-resolve in `transformFramesGrouped` (I.W0 S3) is the
correct long-term fix — it recovers the transform on the first draw tick. But the lazy-resolve
checks `entry.animation.frames[0] != null`, which is null if the animation was constructed without
`parse()` being called. The suspect cold path: the demo's `autoPlayNext` + `bindSceneAdapter`
sequence creates the `AnimationGroup` eagerly (before `fromString`/`parse` on the selected
animation), then calls `play()`. The group draws with NOOP_TRANSFORM because no frame exists yet.
The fix is to ensure `parse()` is called before the group's first `play()`, or to defer `play()`
until `SCENE_READY` fires with targets attached. The scene machine's `markSceneReady` already
gates on targets-attached (`useSceneMachineApp.ts:112-113`), but the `autoPlayNext` path
dispatches PLAY immediately after SCENE_READY — if `sceneRef.value?.animationGroup` is stale at
that moment, the group has no frames. This is the J.W7c U4 deletion side-effect the orchestrator
triage identifies: the U4 `v-if="animationNames.length > 1"` guard removed a reactive `select`
that may have been triggering an animation re-parse on first render. The cold path needs a
dedicated K.W0 probe to confirm.

---

## §17 — Hot-path alloc audit summary

| Seam | Status | Finding |
|---|---|---|
| `interpFrames` steady (single frame) | Zero-alloc — aliases `flatVars` | Sound |
| `interpFrames` steady (multi-frame) | Zero-alloc — reuses `out` buffer | Sound |
| `clearBuffer` | Zero-alloc null-fill (no delete) | Sound |
| `processFrame` | Zero-alloc — mutates `iv.value` in place | Sound |
| `transformFramesGrouped` | Zero-alloc — reuses `_grouped`, null-fill key sweep | Sound |
| `_advanceBatched` slice | Allocates Array per batch | EC-6 (P2) |
| `setTargets` Object.values | Allocates values array per frame | EC-8 (P2) |
| `tryParseCache` | Unbounded growth | EC-5 (P2) |
| `lerpArray` SoA path | Not yet implemented | EC-1 (P1) |

---

## §FOLD — Finding register

| ID | Summary | Sev | Seam | Suggested wave-class |
|---|---|---|---|---|
| EC-1 | `lerpArray` SoA impl not yet landed (ADOPT decision from J.W6 S2) | P1 | `engine.ts:interpFrames` + `frame-compiler.ts:finalizeFrameVars` | K.W1 (engine totality wave); born-RED gate required |
| EC-2 | `frames.forEach` ix reads as compiled-frame index but functions as template-frame index; comment gap | P2 | `frame-compiler.ts:399` | K.W0 or K.W1 (1-liner comment + index refactor) |
| EC-3 | `reconcileVars` `findIndex` is O(N) over compiled frames; replace with `Map<id, frame>` | P2 | `frame-compiler.ts:348` | K.W1 (part of the FrameCompiler motion) |
| EC-4 | `CSSKeyframesToString` post-formatter regex `(\{` / `})` is a silent brittle workaround | P2 | `format.ts:219` | K.W0 (add assertion or upstream fix at value.js seam) |
| EC-5 | `tryParseCache` module-level singleton has no eviction | P2 | `utils.ts:203` | K.W2+ (needs design decision on cap/LRU strategy) |
| EC-6 | `_advanceBatched` `entries.slice(i, i + batch)` allocates per batch | P2 | `group.ts:483` | K.W0 (trivial index-range refactor) |
| EC-7 | `animation-composition` captured in `ResolvedKeyframes` but never consumed in `fromString` | P2 | `engine.ts:fromString`, `adapter.ts:29` | K.W1 (BOOK wire-in or explicit KILL comment) |
| EC-8 | `setTargets` uses `Object.values` per frame; use `allInterpVars` instead | P2 | `engine.ts:1163` | K.W0 (trivial loop refactor) |
| EC-9 | No test pins the zero-width frame guard (E-RT-5) | P2 | `test/engine-correctness.test.ts` | K.W0 (add test) |
| EC-10 | `group.ts:pause()` comment contradicts behavior for pre-first-frame pause | P2 | `group.ts:661` | K.W0 (comment-only fix) |
| EC-11 | `animationOptionsToString` omits `useWAAPI`/`respectReducedMotion` without comment | P2 | `format.ts:145` | K.W0 (comment-only) |
| EC-12 | `RAFPlayback.drive` idempotency contract undocumented ("one Tickable per RAFPlayback") | P2 | `playback.ts:208` | K.W0 (comment-only) |
| EC-13 | Group cold-path NOOP_TRANSFORM survives when animation is un-parsed at `play()` time; likely root of U-K2/U-K3 subject-freeze | P1 | `group.ts:133`, `useSceneMachineApp.ts:128` | K.W0 (targeted probe + demo-side SCENE_READY guard) |
