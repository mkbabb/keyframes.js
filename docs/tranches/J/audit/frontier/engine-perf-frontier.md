# Frontier — the ENGINE-PERF frontier (beyond J.W6's reserves)

**Lane:** engine-perf-frontier (FRONTIER-RESEARCH, tranche-development; seeds a future K tranche)
**Date:** 2026-06-10
**Tree:** `tranche-i-dev` (engine source on `master` line @ `4072af9` post-WZ)
**Method:** read-only. Every internal claim carries `file:line` or a lane-doc cite; every
external claim a link. The mandate is strict: each perf-flavored direction names the
**bench + threshold** that would justify it, distinguishes itself from the recorded ARCH
KILL LIST where it brushes one, and earns a verdict from
{K-HEADLINE / K-CANDIDATE / J-FOLD / BOOK / KILL}. Honest KILLs are results.

This lane sits BEYOND what J.W6 already owns: FB-2 (async `advanceTo` probe-or-KILL), PF-8
SoA `lerpArray` bench-or-KILL, ENG-3/ENG-4 allocation escapes (MEASURE-FIRST), PF-1 Three
named imports (`perf-frontier.md §5`, `J.md §WAVE MAP`). I do not re-propose those.

---

## §0 The ground-truth hot path (what the engine actually does per frame)

The steady-state play loop is `RAFPlayback.loop` → `Animation._frame` → `advanceTo(t)` →
`interpFrames(t, true, buffer)` (`engine.ts:869`, `:886`, `:895`). `interpFrames`
(`engine.ts:657-741`) is genuinely zero-alloc and test-gated:

- binary-search seed (`engine.ts:668`), contiguous-run neighbor scan (`:692-701`),
- `processFrame` is a METHOD not a per-call closure (`engine.ts:769`, the D-RT-1 lock),
- the single-active-frame alias fast-path returns `frame.flatVars` with NO copy
  (`engine.ts:719-728`, the dominant 2-stop shape),
- the reused buffer is cleared by stable-key null-fill, NEVER `delete` (`engine.ts:754`,
  the F.W4 S1 dictionary-mode trap).

The per-value lerp is `lerpValue(eased, iv)` (`engine.ts:779`), which dispatches into
value.js. **The decisive fact for this lane** (verified in the installed dist): value.js's
`lerpValue` (`qo`, `node_modules/@mkbabb/value.js/dist/value.js:2746`) is

```js
function qo(e, t) {            // lerpValue(progress, iv)
  if (t._lerp) return t._lerp(e, t);   // ← monomorphic per-iv fast path
  ... // generic fallback by start.unit
}
```

and kf installs `_lerp` at compile time: `createInterpVarValue` →
`prepareInterpVar(normalizeValueUnits(...))` (`utils.ts:339`). `prepareInterpVar` (`Jo`,
value.js:2751) sets `e._lerp = e.computed ? Wo : e.start.unit==="color" ? Go : Ko` — the
three concrete lerp kernels (`lerpComputedValue` / `lerpColorValue` / `lerpNumericValue`).
**So the interp dispatch is ALREADY monomorphic-per-iv, specialized at `compile()`, today.**
This sharply constrains the "interpolation JIT" direction below (§2).

The computed-unit kernel `Wo` (`lerpComputedValue`, value.js:2709-2723) is the ONLY place a
DOM read happens in the hot path. It is epoch-cached: it calls `getComputedValue` (`Bo`,
value.js:2631) ONLY when `_computedCache` is absent / target-changed / epoch-bumped
(value.js:2713). On a cache hit it is a pure `lerp(startN, stopN, e)` (value.js:2723). The
epoch bumps on `window.resize` (auto, value.js:2630) or explicit `bumpLayoutEpoch()` (the
container-resize contract, `src/animation/CLAUDE.md §Computed-unit container contract`).
`getComputedStyle` appears NOWHERE in kf source — only transitively through `Bo`
(`grep getComputedStyle src` → 0 hits; it lives at value.js:2633/2637).

This §0 is the lens for all five directions: the hot path is already lean, already
monomorphic-per-iv, and already epoch-caches its one DOM read.

---

## §1 (a) Read/write phase separation — the engine-level fastdom discipline

### The idea
A frame scheduler that batches ALL DOM reads (computed-unit endpoint resolution) before ALL
writes (transform application) across EVERY running animation, so a frame with N
computed-unit animations does not interleave read→write→read→write (layout thrashing). This
is the [fastdom](https://github.com/wilsonpage/fastdom) `measure()`-then-`mutate()`
discipline lifted to engine level: fastdom batches reads then writes at the rAF turn so the
browser never recomputes layout mid-task (~600 B, the canonical layout-thrash eliminator).

### What the read actually is, and when it fires
The only forced-layout read in kf's pipeline is `getComputedValue` (`Bo`, value.js:2631) for
a `calc()`/`var()`/`cq*`/viewport-unit endpoint. For `calc()` it WRITES `target.style[prop]`
to a probe expression, READS `getComputedStyle(target).getPropertyValue(prop)`, then RESTORES
(value.js:2634-2648) — a textbook forced synchronous reflow. **But** it fires only on cache
miss (epoch change / first frame), NOT every frame (value.js:2713). In steady-state playback
the computed path is `lerp(startN, stopN, e)` with zero DOM contact (value.js:2723).

So the read/write interleave this direction targets is NOT a per-frame phenomenon — it is a
**per-epoch-boundary** one. The thrash window is: the first frame after a resize / dock
toggle / `bumpLayoutEpoch()`, where every running computed-unit animation re-resolves its
endpoints. With M such animations each carrying K computed endpoints, that frame does M·K
style-write→reflow-read→style-restore cycles, interleaved with the transform writes of the
animations already past their own re-resolution. THAT is the thrash a batched
read-all-then-write-all scheduler removes.

### Why only a CSS-source-of-truth engine could do it THIS way (the on-brand test)
GSAP/Motion/anime do not resolve `calc()`/`cq*` by probe-write-readback — they read numeric
inputs or delegate to native. kf's computed-unit animation IS the probe-readback round-trip
(the §1 unique axis: "container-query-unit animation with epoch-keyed DOM resolution",
`sota-landscape.md §3`). The fastdom batching is on-brand precisely because kf is the only
engine whose interpolation endpoints are resolved by forced layout — the read it would batch
is one no competitor even performs. A cross-animation "resolve-all-endpoints-then-paint-all"
phase is a capability that only this resolution model produces.

### Distinguish from the KILL list
- NOT Worker/OffscreenCanvas (the KILL): this is main-thread phase ordering, no thread hop.
- NOT Typed-OM-as-interp-carrier (the KILL): the carrier stays `ValueUnit`; only the
  *scheduling* of the existing `Bo` read changes.
- It also does NOT touch the data representation — `_computedCache` stays exactly as is
  (value.js owns the eviction/epoch policy, the DRY lock in `CLAUDE.md`).

### The honest problem
The batching only helps when M (concurrent computed-unit animations re-resolving in the same
frame) is large AND epoch bumps are frequent. The demo's reality: the AnimationVisualizer
animates ONE `calc(100cqw - 100%)` ball (`MEMORY.md §AnimationVisualizer`), and epoch bumps
are user-paced (resize, dock toggle) — not a hot loop. A batched scheduler is engine
machinery (a global read queue + a write queue + a frame-turn flush, touching `engine.ts`
+ `group.ts` + a new scheduler) earning its keep only under a workload that does not exist in
the demo and is not demonstrated as a real LIBRARY workload (the same gate the per-target
`ResizeObserver` BOOK already failed, `CLAUDE.md §RECORDED non-action`).

### Bench + threshold (MEASURE-FIRST)
Extend `bench/computed-real-dom.bench.ts` (the real-DOM computed corpus, already a Playwright
harness) to a NEW probe: M ∈ {8, 32, 128} concurrent `calc()`-endpoint animations on one
target subtree, drive a `bumpLayoutEpoch()` at frame F, and trace with the
[Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames)
(`startTime`→`renderStart` style/layout breakdown) the epoch-boundary frame's
forced-reflow time, current (interleaved) vs batched (reads first). **Threshold to ship:**
the batched scheduler must cut the epoch-boundary frame's layout time by **≥ 40%** AND keep
that frame **under the 50 ms LoAF floor** at M=32 (a realistic "panel-resize during a busy
scene" worst case). Below that delta, the machinery is not earned.

### Verdict: **BOOK** (premature; born-RED needs a real multi-computed workload)
The discipline is correct and uniquely on-brand, but the win is confined to epoch-boundary
frames whose frequency × M the demo does not exhibit. Record it; ship only behind the M=32
LoAF probe going born-RED on a real (not manufactured) multi-computed scene. If a future K
scroll-orchestration tier pins many `cq*`-driven elements through a panel-resize, this
direction's workload is finally born — re-evaluate then as a **K-CANDIDATE rider** to that
tier, not a standalone wave.

---

## §2 (b) The interpolation JIT — pre-compiled per-animation interp closures

### The idea (as briefed)
Pre-compile per-animation interp closures: monomorphic dispatch per frame-shape, researching
V8 inline-cache behavior for the "polymorphic `interpFrames`". DISTINGUISH from the killed
ValueUnit-monomorphization (a data-representation rewrite) — this is closure specialization at
`compile()`.

### What the research says about the premise
V8's inline caches: a call/access site caching ONE hidden class is monomorphic (fastest); 2–4
is polymorphic (a linear check chain); >4 is megamorphic — V8 falls back to a global hashtable
and TurboFan often refuses to optimize the site, a **10–50× cliff**
([thenodebook](https://www.thenodebook.com/node-arch/v8-engine-intro),
[Medium / inline caching](https://medium.com/@sunnywilson.veshapogu/how-v8-makes-javascript-fast-with-inline-caching-746a508e22c3)).
So the win exists IFF the hot dispatch site is actually polymorphic/megamorphic over many
shapes.

### The decisive finding: the dispatch is ALREADY monomorphic-per-iv
`processFrame`'s inner loop is `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`
(`engine.ts:778-779`). `lerpValue` (value.js `qo`:2746) immediately does
`if (t._lerp) return t._lerp(e, t)`. `_lerp` is installed once at compile by
`prepareInterpVar` (`utils.ts:339` → value.js `Jo`:2751) to ONE of three concrete kernels
(`Wo`/`Go`/`Ko`). For a given iv, `_lerp` never changes shape after compile — the call site
`t._lerp(e, t)` sees a stable function identity per-iv-class. **The "polymorphic
interpFrames" the brief hypothesizes is already specialized one level down, upstream.** The
JIT-closure idea's core mechanism (replace a polymorphic dispatch with a precompiled
per-shape closure) is, for the lerp dispatch, DONE — by value.js, at kf's `compile()`, via
`_lerp`.

### What a kf-side "compile a closure" would actually buy
Two residues remain that `_lerp` does NOT remove:
1. The `frame.allInterpVars` iterator itself (`engine.ts:778`) — a `for..of` over an array of
   ivs of MIXED kernel (`Wo`/`Go`/`Ko`). The `t._lerp(e,t)` call site is polymorphic across
   THREE function identities (3 ≤ 4, so still in V8's polymorphic-not-megamorphic band — the
   cheap linear-chain case, not the cliff). A per-animation precompiled closure could unroll
   this into straight-line `Ko(e,iv0); Wo(e,iv1); ...` removing the indirect call + the
   `_lerp` guard branch. **Expected magnitude: small** — it converts a 3-way polymorphic
   indirect call into direct calls; this is the difference the IC literature rates as
   "polymorphic → still pretty fast" vs monomorphic, NOT the 10–50× megamorphic cliff.
2. `frame.timingFunction.fn(scaled)` (`engine.ts:776`) — one indirect call per frame; a
   closure could inline a known curve. Marginal.

### Distinguish from the KILL (this is the load-bearing distinction)
The ARCH KILL of "ValueUnit monomorphization" killed a DATA-REPRESENTATION rewrite (making
`ValueUnit` a single hidden class / SoA-ing its fields). A `compile()`-emitted closure does
NOT touch `ValueUnit`'s shape — it emits `new Function`-or-arrow straight-line code over the
SAME `ValueUnit` carriers. So it is formally distinct. **However** — the honest read — it
brushes the *spirit* of the kill (chase V8 IC microstructure for a hot loop that is already
near-monomorphic) and it brushes the `eval`/`new Function` smell that KISS + the boundary
gates (`proof:boundary`) would reject, and CSP-strict consumers forbid.

### Bench + threshold (MEASURE-FIRST)
`bench/interpolation.bench.ts` already covers 2-stop / multi-prop / 11-stop `interpFrames`
(`perf-frontier.md §2`). Add a `%OptimizeFunctionOnNextCall` / `--allow-natives-syntax` probe
that asserts the current `processFrame` site's IC state (expect: polymorphic-3, NOT
megamorphic) and a closure-emitted variant on a K=10 transform animation (the real-world
shape, `sota-landscape.md §5`). **Threshold to ship:** the precompiled closure must show
**≥ 25%** wall-time reduction on the K=10 `interpFrames` bench. Given the dispatch is already
polymorphic-3 (cheap band), I predict the measured delta lands **well under 25%**.

### Verdict: **KILL** (researched and rejected)
The premise — a polymorphic/megamorphic interp dispatch worth JIT-specializing — is FALSE:
value.js's `_lerp` already monomorphizes per-iv at kf's `compile()` (value.js:2747,2751;
installed at `utils.ts:339`). The residue (a polymorphic-3 indirect call + one
`timingFunction.fn` call) sits in V8's cheap "still pretty fast" band, not the megamorphic
cliff the JIT story needs. A `new Function`/closure emitter would add an `eval`-class
construct (CSP-hostile, boundary-gate-hostile, KISS-hostile) for a sub-25% predicted win on a
loop the engine already proves zero-alloc. This is the killed-thing's spirit (chasing V8
microstructure on an already-lean hot loop) wearing a "closure not data-rep" disguise. KILL,
and record WHY: **the monomorphization the brief asks for already happened, one layer down.**

---

## §3 (c) GPU-amenable batching — single typed-array matrix-composition pass

### The idea
For the cube/amiga class (many elements, transform-heavy), compose all matrices in ONE
typed-array pass — overlaps the SoA `lerpArray` direction; the brief says defer to J.W6
UNLESS there is a frontier increment.

### The state of play
J.W6 already owns PF-8: SoA `lerpArray` bench-or-KILL (`perf-frontier.md §PF-8`,
`deferred-ledger.md:108`). The measured real-world K is 6–10 channels
(translate3d+scale+rotate+opacity), where value.js's `lerpArray` bites 2.5–4× over
per-channel dispatch (the G-2 finding, `sota-landscape.md §5`). The group composite path
(`transformFramesGrouped`, `group.ts:257`) already walks leaves in place, zero-alloc, with
three blend arms (`replace`/`add`/`weighted`, `group.ts:307-358`) — the unique weighted-layer
axis.

### Is there a FRONTIER INCREMENT beyond J.W6's SoA?
The candidate increment: a single `Float64Array` keyframe buffer where ALL channels of ALL
group children for a frame are laid out contiguously, lerped in one `lerpArray` call, and the
RESULT consumed as a `matrix3d()` per element — a "compose every element's transform in one
numeric pass." This is genuinely beyond PF-8 (which is per-animation SoA, not cross-element
batched).

But it founders on three facts:
1. **The composition is already not the bottleneck.** The b16 profile found the demo's cube
   hotspots were **Vue reactivity, not the engine** — 60 fps steady-state on cube under 4×
   throttle (`sota-landscape.md §5`, `perf-frontier.md §1`). The matrix pass is not where the
   frames go.
2. **`matrix3d()` is itself a computed-unit / serialization cost**, not a lerp cost. Batching
   the lerp does not batch the per-element `target.style.transform = matrix3d(...)` write —
   that is M individual style writes regardless, and (per §1) M style writes are the layout
   surface, not the arithmetic.
3. **It overlaps the killed bit-packing / SoA-rep direction's spirit** if pushed to a shared
   typed-array carrier across elements (a data-representation change to the group buffer).

### The on-brand test
A cross-element matrix batch is NOT something only a CSS-source-of-truth engine can do —
it is generic numeric batching any engine could add, and the field (Motion's WAAPI hybrid)
gets element-parallelism by delegating to the compositor instead. kf's unique axis here is
WEIGHTED blending, which the batch would have to preserve — and the weighted lerp is already
in-place zero-alloc (`group.ts:345-358`). There is no uniquely-kf increment.

### Bench + threshold
If ever revisited: extend `bench/interp-buffer.bench.ts` (already threaded K=2/5/12,
`perf-frontier.md §2`) to a cross-element `Float64Array` batch at M=200 elements × K=10, vs
the current per-child `transformFramesGrouped`. **Threshold:** ≥ 30% reduction in the
composite phase of the LoAF bench (`bench/playwright.bench.ts`, the 200-cell group) — AND the
reduction must survive the style-write phase being held constant (since §1 shows the writes,
not the lerp, dominate). I predict it fails the "survive the write phase" clause.

### Verdict: **J-FOLD → J.W6 (PF-8)** for the SoA core; **BOOK** for the cross-element increment
The numeric-batch core is PF-8, already owned by J.W6 — fold there, do not duplicate. The
cross-element-batch INCREMENT clears the "frontier" bar conceptually but fails the on-brand
test (generic numeric batching, not a kf-unique capability) and the bottleneck test (the b16
evidence says the engine is not the cube's limiter). BOOK the increment as a rider on PF-8's
bench: only if the PF-8 K=8 bench shows the per-child lerp dominating the composite (it
likely will not, given b16) does the cross-element batch become worth a probe.

---

## §4 (d) Idle-time pre-compilation — requestIdleCallback warming of parse/compile caches

### The idea
Warm the parse/compile caches in `requestIdleCallback` time so a first `fromString` /
first `play()` does not pay cold parse+compile on the interaction frame. The `tryParseCache`
eviction BOOK rides along.

### The substrate that exists
- `compile.bench.ts` measures cold `fromString` (parse→compile→`frames[]`) over
  2/6/11/50/200 stops — the "editing-session reality, a keystroke re-parses the whole
  stylesheet" (`bench/compile.bench.ts:1-40`). So the cold cost IS instrumented.
- The parse cache is `tryParseCache` (value.js-side, an unbounded `Map`, `.set` at
  `utils.ts:267`) — kf BOOKs the eviction because the BOUND lives in value.js VJ-7
  (`deferred-ledger.md:108,178`). All exported parsing fns are memoized (`CLAUDE.md
  §Conventions`).
- The boundary already does ROUTE-CHUNK warmup on pointer-enter (`warmScene`,
  `demo/app/scenes.ts:54-73`, `perf-frontier.md §4 C5`) — an established "warm before the
  user commits" pattern in this codebase. And `loadAnimationEngine()` is the dynamic edge a
  warmer would pre-fire (`index.ts:197-220`).

### The honest frontier shape
There are TWO distinct warmables, and they have different verdicts:

**(d1) Warm the ENGINE CHUNK + value.js** (`await loadAnimationEngine()` in
`requestIdleCallback`): a light-only consumer who will eventually call `fromString` pays the
36 KB engine + value.js parse on first call. Pre-firing the dynamic import in idle time is a
**real, on-brand, tiny** win — it is the route-warmup pattern (`scenes.ts:54-73`) applied to
the static/dynamic boundary the library OWNS. It does not touch the engine internals; it is a
consumer-facing `warmEngine()` helper that calls the existing `loadAnimationEngine()` under
`requestIdleCallback` with a `setTimeout` fallback (the same progressive-fallback shape as
`yieldToMain`, `internal/scheduler.ts:25-38`). This is genuinely useful and genuinely small.

**(d2) Warm the PARSE/COMPILE caches** for a known set of keyframe strings (precompile the
preset library / a passed CSS corpus in idle time): plausible but its win is bounded by
`compile.bench.ts`'s cold numbers — and cold compile of a 2–11-stop animation is sub-ms
(the dominant shape). The win is real only for 50–200-stop animations, which are rare. The
`tryParseCache` eviction BOOK rides along ONLY in the sense that a warmer would POPULATE the
cache it does not bound — making the unbounded-Map BOOK marginally more pressing, but the
bound still correctly lives in value.js VJ-7 (`deferred-ledger.md:178`). No new kf action.

### Distinguish from the KILL list
- NOT WASM-parser (the KILL): warming runs the SAME JS parser, just earlier.
- NOT idle-time as a thread hop: `requestIdleCallback` is main-thread, cooperatively
  scheduled — no Worker.
- d1 is just `loadAnimationEngine()` called earlier; it touches no internals.

### Bench + threshold
For d1: instrument first-`fromString` latency with the engine chunk COLD vs WARMED-in-idle,
on a throttled (4× CPU) profile — the interaction-frame cost of the dynamic import + value.js
parse. **Threshold to ship:** warming must move ≥ 80% of the first-call cost OFF the
interaction frame (the import is the bulk; the bar is easily clearable since the import is
deterministically pre-firable). This is less a "does it work" bench than a "confirm the
import dominates first-call" sanity probe.
For d2: `compile.bench.ts` already has the cold numbers — gate any precompile-warmer on a
50+-stop corpus showing > 4 ms cold compile that warming removes; below that, do not build it.

### Verdict: **K-CANDIDATE** for d1 (`warmEngine()` idle-warmer); **BOOK** for d2
d1 is the cleanest frontier increment in this lane: a tiny, on-brand, boundary-aware
`warmEngine()` that extends kf's OWN static/dynamic boundary discipline with the codebase's
OWN warmup idiom (`scenes.ts`), removing the one cold-import stall a light→heavy consumer
hits. It is small enough to question whether it is K or J — but it is NET-NEW public surface
(a new export), not a fix to an existing J wave, so it is a K wave, not a J-FOLD. d2 is BOOK:
its win lives only at 50+ stops, and the `tryParseCache` bound correctly stays in value.js.

---

## §5 (e) LoAF-driven ADAPTIVE quality — the engine sheds work under frame pressure

### The idea
The engine measures frame pressure (via the
[Long Animation Frames API](https://w3c.github.io/long-animation-frames/)) and SHEDS work
when over budget: lower computed-unit readout HZ, drop blend layers, coarsen sampling. The
brief asks to research adaptive-quality precedents in GAME ENGINES vs the web.

### The game-engine precedent (and the key disanalogy)
Game engines do Dynamic Resolution Scaling: the GPU runs on a frame-time budget and, on a
miss, REDUCES subsequent-frame render quality to claw back budget, devs setting min/max bounds
([Wayline](https://www.wayline.io/blog/adaptive-resolution-scaling-mobile-gaming),
[Intel DRR](https://www.intel.cn/content/dam/develop/external/us/en/documents/dynamicresolutionrendering-183334.pdf)).
Unreal exposes per-character animation BUDGETS that drop update rate / LOD when many
characters are on screen ([Arctic7](https://www.arctic7.com/post/optimizing-unreal-engine-animation)).
**The disanalogy that matters:** game adaptive quality degrades a perceptually-redundant
dimension (pixels, off-screen animation rate) where the user mostly cannot tell. kf animates
AUTHOR-DECLARED CSS — every keyframe is intentional. Shedding a blend LAYER changes the
*declared composite* (the weighted-blend axis IS the product); coarsening sampling changes the
*declared curve*. There is no perceptually-free dimension to shed — degrading kf output
degrades the author's stated intent, silently. That is a correctness violation dressed as a
perf feature.

### What kf already has (and why it is the RIGHT shape)
kf's existing pressure response is `AnimationGroup.YIELD_BATCH = 32` (`group.ts:76`): a large
group yields to the main thread between batches via `scheduler.yield()`
(`internal/scheduler.ts:40`), gated by the LoAF bench asserting ZERO > 50 ms blocking tasks on
a 200-cell composite (`bench/playwright.bench.ts`, `perf-frontier.md §2`). **This sheds
LATENCY (when the work runs) WITHOUT shedding WORK (what gets computed).** Every channel still
interpolates; the frame just doesn't monopolize the thread. That is the on-brand, correctness-
preserving form of pressure adaptation — and it already exists. Adaptive QUALITY (shedding
work) is the wrong axis for an engine whose output is declared-intent.

### The ONE narrow place adaptive readout is defensible
§1 established that computed-unit endpoint RE-resolution (`Bo`, the forced reflow) fires on
epoch change. Under sustained frame pressure (a measured LoAF storm), an engine COULD defer
non-boundary epoch re-resolution — i.e., coarsen the computed-unit READOUT HZ specifically
(serve the cached endpoint one extra frame under pressure). This sheds a READ, not a declared
value — the interpolation still runs against the (slightly stale) cached endpoint, which is
exactly what already happens between epoch bumps. This is the only "shed work" that does not
degrade declared intent (the endpoint is a layout-derived input, not an authored keyframe).
But its win is bounded by §1's finding: the read is already epoch-cached and rarely fires, so
deferring an already-rare read saves little.

### Distinguish from the KILL list
- NOT the ScrollTimeline-REPLACE kill: this is engine work-shedding, unrelated to the
  progress driver.
- NOT a Worker/OffscreenCanvas hop.
- The danger is it brushes "me-too feature chasing" (game-engine adaptive quality is a
  buzzword) and KISS — adding a pressure-measurement feedback loop + quality knobs to an
  engine whose discipline is "prove zero-alloc, prove no >50 ms task" is bloat in the values'
  exact terms.

### Bench + threshold
The LoAF bench (`bench/playwright.bench.ts`) is the instrument. Any adaptive-readout variant
must show, on a born-RED scene (sustained LoAF > 50 ms under a measured storm), that deferring
computed re-resolution recovers the frame UNDER budget WITHOUT a visible position error
exceeding ~1 px (the `PX_TOLERANCE` the computed corpus already uses,
`bench/computed-real-dom.bench.ts:46`). **Threshold:** recover ≥ 80% of over-budget frames at
< 1 px drift. But there is no born-RED scene today (the LoAF gate is GREEN at 200 cells), so
the probe has no failing baseline to justify it.

### Verdict: **KILL** for general adaptive-quality; **BOOK** for the narrow adaptive-readout
General "shed blend layers / coarsen sampling under pressure" is KILLed: it degrades
author-declared intent silently (the weighted-blend axis IS the product — shedding it is
shedding the feature), it is me-too game-engine buzzword chasing against KISS, and kf already
has the CORRECT pressure response (YIELD_BATCH sheds latency not work, `group.ts:76`). The
ONLY survivor — deferring already-epoch-cached computed READOUT under measured pressure — is
BOOK, not ship: it sheds a layout-derived input (not an authored value, so it is defensible),
but §1 shows that read is already rare, and there is no born-RED LoAF scene to justify the
feedback machinery. Record the narrow form; the general form is a values violation.

---

## §6 Synthesis — what the engine-perf frontier actually yields

The honest result of this lane is that **kf's engine hot path is already at or near the
frontier**, and most "go faster" directions either were already taken (one layer down, in
value.js's `_lerp`) or fail the on-brand / KISS / measure-first gates:

| # | Direction | Verdict | One-line reason |
|---|---|---|---|
| §1 | Read/write phase separation (fastdom) | **BOOK** | Uniquely on-brand, but the thrash is epoch-boundary-only; no real multi-computed workload exists yet. Re-evaluate as a rider when a K scroll tier pins many `cq*` elements. |
| §2 | Interpolation JIT (compiled closures) | **KILL** | The dispatch is ALREADY monomorphic-per-iv via value.js `_lerp` (installed at `utils.ts:339`). Residue is polymorphic-3 (cheap band), not the megamorphic cliff. A closure emitter is `eval`-class bloat for a sub-25% predicted win. |
| §3 | Cross-element matrix batch | **J-FOLD (PF-8)** + BOOK increment | Numeric-batch core = J.W6's PF-8. Cross-element increment fails on-brand (generic batching) + bottleneck (b16: engine is not the cube's limiter). |
| §4 | Idle-time pre-compilation | **K-CANDIDATE (d1)** + BOOK (d2) | `warmEngine()` idle-warming the `loadAnimationEngine()` boundary is small, on-brand, NET-NEW surface. Cache-precompile (d2) only pays at 50+ stops. |
| §5 | LoAF adaptive quality | **KILL** + BOOK narrow | Shedding layers/sampling degrades author-declared intent silently (the blend axis IS the product). kf's YIELD_BATCH already sheds latency-not-work — the correct shape. Narrow adaptive-readout is BOOK. |

**The headline finding for the future K tranche:** there is NO K-HEADLINE in raw engine
perf. The engine is already proof-gated zero-alloc, already monomorphic-per-iv, already
epoch-caches its one DOM read, already sheds latency-not-work under pressure. The single
genuinely shippable increment is the small `warmEngine()` idle-warmer (§4 d1) — a K wave, not
a headline. Two directions (§1 fastdom batching, §5 adaptive-readout) are real and uniquely
on-brand but BORN-PREMATURE: they need a workload (many concurrent `cq*` animations through a
panel-resize, or a sustained LoAF storm) that only a future K SCROLL-ORCHESTRATION tier would
create. **So the engine-perf frontier's true contribution to K is conditional: it is the
RIDER battery that the scroll-orchestration headline (the one NET-NEW capability
`sota-landscape.md §6` names) would activate** — not an independent K anchor. The strongest
honest verdict this lane returns is two KILLs that close speculative directions, one J-FOLD
that routes a duplicate back to J.W6, one small K-CANDIDATE, and a precise statement of the
condition under which the two BOOKed disciplines become live.

---

## §7 Sources

**Internal:** `perf-frontier.md` (§1 bundle, §2 benches, §5 PF-8/§PF-6 ENG-3) ·
`sota-landscape.md` (§3 capability matrix, §5 perf posture / K=6–10, §6 scroll-orchestration
as the one NET-NEW) · `deferred-ledger.md:108,178` (tryParseCache, lerpArray BOOKs) ·
`wave-I.W6.md` · `src/animation/CLAUDE.md` (computed-unit container contract, the per-target
ResizeObserver BOOK) · `MEMORY.md` (AnimationVisualizer, calc pipeline).
Source `file:line`: `engine.ts:657-741,769,778-779,840-863,869,886,895` ·
`group.ts:76,257-358,469-513` · `utils.ts:283-341` (esp. `:339` prepareInterpVar) ·
`frame-compiler.ts` · `internal/scheduler.ts:25-49` · `playback.ts` ·
value.js dist `2630` (resize epoch), `2631` (`getComputedValue`/`Bo`), `2709-2723`
(`lerpComputedValue`/`Wo`), `2746-2753` (`lerpValue`/`prepareInterpVar`/`_lerp`).

**External:**
[fastdom (wilsonpage)](https://github.com/wilsonpage/fastdom) ·
[Long Animation Frames spec (W3C)](https://w3c.github.io/long-animation-frames/) ·
[LoAF API (Chrome for Developers)](https://developer.chrome.com/docs/web-platform/long-animation-frames) ·
[V8 inline caching (thenodebook)](https://www.thenodebook.com/node-arch/v8-engine-intro) ·
[V8 inline caching (Medium / Wilson)](https://medium.com/@sunnywilson.veshapogu/how-v8-makes-javascript-fast-with-inline-caching-746a508e22c3) ·
[Adaptive resolution scaling (Wayline)](https://www.wayline.io/blog/adaptive-resolution-scaling-mobile-gaming) ·
[Dynamic Resolution Rendering (Intel)](https://www.intel.cn/content/dam/develop/external/us/en/documents/dynamicresolutionrendering-183334.pdf) ·
[Unreal animation budget (Arctic7)](https://www.arctic7.com/post/optimizing-unreal-engine-animation)
