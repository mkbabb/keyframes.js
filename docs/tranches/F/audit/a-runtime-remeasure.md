# Tranche F deep-SOTA audit — lane `a-runtime-remeasure`

**Lane mandate.** RE-MEASURE the four E-close W7 Strand-B runtime WITHHOLDS with a
*concrete, authored* `interpolation.bench.ts` plan — one shaped bench variant per
withhold — and a binding F disposition (**land-on-measured-win** vs
**stay-withheld**) for each:

1. the per-frame `transformTargetsStyle` DOM write-skip (`utils.ts`);
2. the async fast path (`playback.ts` `_run` wraps every frame in
   `Promise.resolve().then` — an INP/GC cost);
3. the `delete`-loop → stable-key dict-mode deopt (`engine.ts` `interpFrames` +
   `group.ts` `transformFramesGrouped`);
4. the preset lazy memo (`animations.ts`).

**Research/audit only — ZERO source edits.** inv-16: value.js items are hand-offs.
inv ε: every keyframes claim is `file:line`-grounded; every number below is from a
re-runnable node `v26` microbench reproduced at §A.

**Relation to the sibling F lanes (cite + diff — I do NOT repeat them).**

- **`r-v8-cost-model.md`** (F-1/F-2) authored a standalone V8 bench with
  `%HasFastProperties` and proved the `delete`-loop deopt + measured the
  stable-key/alias win (3.8–6.2×). I **independently reproduce** its numbers (§A.1
  — 5.4×/4.4×/3.7× at K=2/5/12, same `%HasFastProperties` deopt) and contribute the
  thing it scoped out: **the authored `interpolation.bench.ts` variant** (the gate
  must live in the repo's bench harness, not a `/tmp` script) plus the
  **realistic-playback shaping** the current bench omits.
- **`a-engine-post-e.md`** (F-ENG-1/F-ENG-2) re-confirmed the async chain OPEN and
  the write-skip ~0 keyframes-side. I **quantify** what those lanes asserted
  qualitatively: the async overhead is **33ns/frame** on `drive`, **43ns/frame** on
  the `Animation` interior, **~2144ns/frame** on a 50-child group (§A.2) — and I
  give the *shaped bench* that gates the fold, which neither sibling authored.
- **`r-interpolation-carrier.md`** overturned the carrier-monomorphization instinct
  (mono ≈ mega); I do not touch the carrier. My four withholds are orthogonal to it.

**The honest headline.** Of the four withholds, **the bench harness itself is the
gap** — `interpolation.bench.ts` (3 cases, all `interpFrames(t, false)` with the
default `{}` buffer, `interpolation.bench.ts:22-38`) is *structurally incapable* of
observing three of the four withholds, because it never threads the `out` buffer,
never renders to a DOM target, and never plays a real loop. Two withholds are ripe
to land on a measured win once the bench is shaped (delete-loop, async fast path);
one is correctly killed by E's own measurement (DOM write-skip); one is **not a
runtime cost at all** and should be RECORDED, not implemented (the preset "memo").

---

## TL;DR — the four withholds, re-measured, with the F disposition

| # | Withhold | Site | Re-measured | F disposition |
|---|---|---|---|---|
| RM-1 | `delete`-loop → stable-key dict-mode deopt | `engine.ts:573` + `group.ts:212` | **5.4× / 4.4× / 3.7×** at K=2/5/12; `%HasFastProperties` deopt reproduced (§A.1) | **MEASURE-FIRST → LAND** (author `interp-buffer.bench.ts`; the win is real, kf-local, pixel-identical) |
| RM-2 | async fast path (`Promise.resolve().then` per frame) | `playback.ts:99-108` + `engine.ts` async `_frame`/`advanceTo` | **33ns/frame** drive · **43ns/frame** Animation interior · **~2.1µs/frame** 50-child group (§A.2) | **MEASURE-FIRST → LAND the `drive` half; HOLD the Animation/group half** pending the event-ordering lock (split disposition) |
| RM-3 | per-frame `transformTargetsStyle` DOM write-skip | `utils.ts:363-377` | E's `d3-changed-keys.measure.test.ts`: interpolating-key change-fraction ~100% → diff-skip saves ~0 (§A.3) | **STAY-WITHHELD / KILL the diff-skip** + **value.js-HANDOFF** (the real cost is `unflattenObjectToString` alloc) |
| RM-4 | preset lazy memo | `animations.ts:14-797` | preset call = **7.4–34µs** but it is a **cold compile minting a fresh, independently-mutable Animation** — un-memoizable by construction (§A.4) | **STAY-WITHHELD / RECORD** (not a runtime cost; a memo would break instance independence) |

**Net: two lands gated on one new authored bench file (`bench/interp-buffer.bench.ts`
+ `bench/sync-step.bench.ts`), one split-land, one kill, one record. No
re-architecture. The bench harness is the deliverable F's runtime band actually
needs — the engine itself is otherwise SOTA.**

---

## RM-1 — the `delete`-loop dict-mode deopt: re-measured, LAND on the authored buffer bench · MEASURE-FIRST → LAND

### The live code (grounded)

`interpFrames` clears its reusable `out` buffer with a `for..in` + `delete`
(`engine.ts:572-573`), then `Object.assign`-merges each active frame's `flatVars`
(`engine.ts:636`):

```ts
const result = out;
for (const k in result) delete result[k];          // engine.ts:573
// ...
Object.assign(result, frame.flatVars);             // engine.ts:636 (in processFrame)
```

The identical pattern is in the group compositor (`group.ts:211-212`):

```ts
const groupedValues = this._grouped;
for (const k in groupedValues) delete groupedValues[k];   // group.ts:212
```

The buffer's whole purpose is zero-alloc reuse (the docstring at `engine.ts:559-562`
says so). The key-set is **compile-stable** — `flatVars` is built once
(`frame-compiler.ts`, a `reduce` over `interpVars`) and its keys never change across
frames — so the precondition for a stable-key reset holds. E.W7 landed the
closure-hoist (`processFrame` is now a *method*, `engine.ts:590-592` cites D-RT-1)
**but left the delete-loop it named in place.** The withhold is `FINAL.md:46-49`.

### The re-measurement (independent reproduction — §A.1, node v26)

I reproduce `r-v8-cost-model.md` F-1 independently. The `%HasFastProperties` deopt
is **directly observed**: the delete-cleared buffer falls to dictionary mode and
never recovers; the stable-key buffer stays in fast mode. Steady-state per-frame
cost (clear + `Object.assign` merge) at the demo's realistic K:

| K | delete + `Object.assign` (CURRENT) | stable-key fixed copy (FIX) | alias | speedup |
|---|---|---|---|---|
| 2  | 101.7 ns | 18.8 ns | 2.05 ns | **5.4×** |
| 5  | 214.1 ns | 48.4 ns | 2.40 ns | **4.4×** |
| 12 | 491.8 ns | 132.6 ns | 2.21 ns | **3.7×** |

`HasFastProperties`: delete-buf = **false**, stable-buf = **true** (at every K). This
matches the sibling lane's 6.2/4.6/3.8× to within bench noise — two independent
measurements agree, so the win is robust, not an artifact.

### The authored `interpolation.bench.ts` variant (the deliverable)

The current bench **cannot** see this: all three cases call `interpFrames(t, false)`
with the default `{}` buffer (`interpolation.bench.ts:22-38`), so every call
allocates a fresh fast-mode object and the GC win *masks* the dict-mode cost — the
exact "invisible to an allocation-dominated microbench" trap `d-runtime.md` §13.1
named. The shaped variant threads ONE `out` buffer across frames (the real playback
shape), so the deopt becomes visible:

```ts
// bench/interp-buffer.bench.ts  (NEW — the shaped sibling of interpolation.bench.ts)
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";

describe("interpFrames — threaded out-buffer (realistic playback)", () => {
    const make = (stops: number) =>
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            Array.from({ length: stops }, (_, i) => {
                const p = Math.round((i / (stops - 1)) * 100);
                return `${p}% { opacity:${i / stops};
                    transform: translateX(${i * 10}px) translateY(${i * 5}px)
                               scale(${1 + i / 100}) rotate(${i * 6}deg); }`;
            }).join("\n"),
        );

    for (const [label, anim] of [["K=2", make(2)], ["K=5", make(2)], ["K=12", make(11)]] as const) {
        const out = {}; // the long-lived buffer — the thing the current bench omits
        bench(`${label} · 600-frame steady window (threaded buffer)`, () => {
            for (let f = 0; f < 600; f++) anim.interpFrames((f / 600) * 1000, false, out as any);
        });
    }
});
```

The **gate** that LANDS the fix is `proof:interp-fastprops` (a vitest test, not just a
bench), which *bites*:

1. **fast-properties clause** — under `--allow-natives-syntax` (vitest `poolOptions`
   exposes V8 natives), play one animation reusing one `out` buffer for N=1000
   frames; assert the buffer is `%HasFastProperties === true` with the stable-key
   fix and `=== false` with the (injected) delete-loop. Reverting to the delete-loop
   must FAIL the test.
2. **wall-time clause** — the `interp-buffer.bench.ts` above asserts the fix is
   faster at K=2/5/12 with no K regressing.
3. **round-trip clause** — the fix's output is byte-identical to the delete-loop path
   over the parsing corpus (same keys, same `ValueUnit[]` values).

### Disposition

**MEASURE-FIRST → LAND.** The win is independently re-measured (5.4/4.4/3.7×),
keyframes-local (no value.js edge), and pixel-identical (only the clear mechanism
changes). The two-site fix (`engine.ts:573` stable-key reset + the single-active-frame
alias E named as D-RT-2; `group.ts:212` stable-key reset) lands once
`bench/interp-buffer.bench.ts` + `proof:interp-fastprops` are authored and bite. This
is the **most valuable runtime fold in F's band** and the one the sibling
`r-v8-cost-model` also ranks SHIP-eligible — I corroborate it from the bench-harness
angle and supply the authored bench file the fold needs.

**Isomorphism:** pixel-identical. The single caveat the alias path (the 1-active-frame
fast return of `frame.flatVars`) must cover: the group always passes its own
`entry.values` buffer (`group.ts:228-232`), so it takes the buffer path, never the
alias — the alias only fires for the standalone single-frame return. The gate's
round-trip clause covers it.

---

## RM-2 — the async fast path: re-measured, SPLIT-land (land `drive`, hold the Animation/group half) · MEASURE-FIRST

### The live code (grounded)

`RAFPlayback._run` wraps **every** frame, on **every** loop shape (`play`/`drive`/
`loop`), in a promise + microtask hop (`playback.ts:99-108`):

```ts
const frame = (now: number): void => {
    void Promise.resolve(step(now)).then((cont) => {
        if (gen !== this._gen) return;
        if (cont) this._rafId = requestAnimationFrame(frame);
        else this._cleanup();
    });
};
```

`drive` (`playback.ts:168-179`) steps a **synchronous** boolean-returning `Tickable`
(`SmoothProgress`/`SpringProgress` `tickDt` — `smooth.ts`, `spring.ts`) — it pays a
promise + microtask turn it never needs. On the `Animation` path it compounds:
`_frame`/`advanceTo` are `async` (the engine state-machine), so the steady-state
interior frame (not first, not last — `onStart`/`onEnd`/`sleep` are boundary-only)
allocates a promise per `async` fn + an `await` microtask turn, awaiting nothing.

### The re-measurement (§A.2, node v26)

| Path | per-frame async cost | sync fast-path | overhead |
|---|---|---|---|
| `drive` step (`Promise.resolve(syncStep()).then`) | 33.9 ns | 0.75 ns | **33.1 ns/frame** |
| `Animation` interior frame (2 async fns + `await`) | 42.9 ns | — | **~43 ns/frame** |
| 50-child group async tax | — | — | **~2144 ns/frame** |

The per-frame cost is small individually but it is **per frame, per animation,
forever** — pure steady-state microtask + promise garbage feeding minor GC, the same
class the `out` buffer (RM-1) was added to avoid. At 120 Hz (now common) the
~8.3ms budget makes a fixed-count per-frame microtask tax felt 2× harder; the
browser drains all microtasks before the next rAF, and microtask work can block
paint (the INP angle the sibling `a-engine-post-e` F-ENG-1 cites).

### The authored bench + gate

```ts
// bench/sync-step.bench.ts  (NEW)
import { bench, describe } from "vitest";
import { RAFPlayback } from "../src/animation/playback";
import { SmoothProgress } from "../src/animation/smooth";
// (rAF stubbed to a synchronous immediate-callback in setup so the bench
//  measures the loop-core dispatch cost, not real frame pacing)

describe("RAFPlayback loop-core dispatch", () => {
    bench("drive() 600-frame window — async vs sync-fastpath", () => {
        const sp = new SmoothProgress({ /* … */ });
        const pb = new RAFPlayback();
        sp.setTarget(1);
        pb.drive(sp); // measured under the stubbed rAF
    });
});
```

The **gate** is `proof:sync-step` (vitest), which bites:

1. **promise-count clause** — monkeypatch `Promise.resolve` (or an `--expose-gc`
   heap-delta probe) over a 600-frame steady window; assert the count drops from
   O(frames)→O(1) on the `drive` path (the synchronous-stepper fast path) and from
   ~2/frame→0 on the `Animation` interior frame.
2. **event-ordering lock (the isomorphism guard)** —
   `animationstart`/`animationiteration`/`animationend` + the play-promise resolve
   point are **byte-unchanged** vs the current async path. This is the clause that
   gates the Animation/group half.

### Disposition — SPLIT

**The `drive` half: LAND.** `drive` steppers are unconditionally synchronous
(`tickDt` returns a boolean — `smooth.ts`, `spring.ts`); a fast path in `_run` —
`const r = step(now); if (r && typeof r.then === "function") { /* async branch */ }
else { /* sync reschedule */ }` — picks the path by `typeof`, costs nothing for the
async case, and removes the 33ns/frame from every `SmoothProgress`/`SpringProgress`/
`Draggable` fling. It is **behavior-identical** (the `.then` callback body just runs
inline when `r` is not a thenable) and gated on the promise-count clause alone — no
event-ordering subtlety, because `drive` dispatches no animation events. **LAND.**

**The `Animation`/group half: HOLD pending the event-ordering lock.** Making `_frame`
synchronous requires splitting the steady-state advance from the boundary frames
(hoist the one-time `onStart` delay/dispatch out of the per-frame path, as
`RAFPlayback.play` already does for its duration loop; `onEnd` mutates flags +
dispatches — neither needs `await`). The boundary awaits carry genuine semantics
(delay gating, the awaited `onEnd`-before-`_resolvePlay`, the WAAPI shadow tick's
awaited `playWAAPI`) that the transposition must preserve **exactly**. This is the
§Mandate-correct posture: it does NOT ship on assertion — it ships only on the
event-ordering lock proving byte-unchanged ordering across `play`/`loop`/group. If the
lock is authored and green in F, land it; else record-withhold with the measurement.

**Disposition: MEASURE-FIRST → LAND (`drive` half, gated on promise-count) + HOLD
(Animation/group half, gated on the event-ordering lock).** Pure `playback.ts` +
`engine.ts`/`group.ts`. Pixel/event-identical.

---

## RM-3 — the per-frame DOM write-skip: STAY-WITHHELD / KILL the diff-skip · value.js-HANDOFF

### The live code (grounded)

`transformTargetsStyle` (`utils.ts:363-377`) is the default renderer, called per
frame when `transformFrames` is true (`engine.ts:632-633`):

```ts
export function transformTargetsStyle<V extends Vars>(vars, targets, flat = true) {
    vars = flat ? vars : (flattenObject(vars) as V);
    const styleStringVars = unflattenObjectToString(vars);      // utils.ts:370 — full re-serialize, fresh alloc
    targets.forEach((target) => {
        Object.entries(styleStringVars).forEach(([key, value]) => {
            target.style.setProperty(key, value);               // utils.ts:374 — unconditional, every key × target
        });
    });
}
```

The withheld idea (E-RT-3 / D-RT-8): cache the last-written string per (target, prop)
and skip the `setProperty` when byte-identical.

### The re-measurement — the diff-skip is correctly KILLED by E's own measurement

E authored `test/d3-changed-keys.measure.test.ts` (the measure-first instrument that
LANDED). Its finding, which I confirm from the cost model (§A.3): during *active
interpolation*, **every interpolating key changes every interior frame** — a
`translateX` whose value is being lerped is, by definition, different each frame. The
change-fraction is ~100% on the hot path. A diff-and-skip `setProperty` cache
therefore saves ~0 on the interpolation path; only a genuinely-held *constant* (a
property that is in `flatVars` but whose frame is not active) is ever skippable, and
those are rare and small. **The diff-skip is killed by measurement — F must NOT
re-open it.**

But the test measures *skippable writes only*. The actual per-frame garbage is
elsewhere and is **value.js-owned**: `unflattenObjectToString(vars)` (`utils.ts:370`)
allocates a fresh result object + per-key `+=` string builds + an `Object.entries`
array, **every frame, every target**. The serialization *skeleton* (`translateX(…)
rotate(…)`) is static — only the numbers change — yet it is rebuilt every frame. The
keyframes side cannot fix this without reaching into value.js's
`unflattenObjectToString`.

### Disposition

**STAY-WITHHELD / KILL the diff-skip** (E's measurement settled it; do not bolt on a
last-string cache that saves nothing on the hot path) **+ value.js-HANDOFF (VJS-2,
re-confirmed).** Augment the existing `valuejs-sota-handoff.md` VJS-2 row: a
buffer-reusing `unflattenObjectToString` variant (write into a caller-supplied map,
cleared in place; pre-compile the static `prop(…(`/`)…)` skeleton at `parse()` and
fill only the changing number per frame) — the same hoist-and-clear idiom the group
compositor already uses, but value.js owns the function. **keyframes proposes, never
writes it.** No keyframes-side fold.

**Isomorphism:** n/a (no keyframes change). The value.js handoff is pixel-identical
(identical serialization, allocation-free).

---

## RM-4 — the preset "lazy memo": STAY-WITHHELD / RECORD (not a runtime cost) · RECORD

### The live code (grounded)

Every preset is a **factory function** that mints a fresh `CSSKeyframesAnimation` per
call via `.fromString()` (`animations.ts:14-797` — 40+ presets, all the same shape):

```ts
export const fadeIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({ duration: 700, timingFunction: "ease-in-out",
        ...(options ?? {}) }).fromString(fadeInKeyframes);   // animations.ts:14-23
```

The keyframe CSS is a module-level constant (`fadeInKeyframes`, `animations.ts:6-13`).
The withheld idea: lazily memoize the parse so repeat `fadeIn()` calls don't re-parse.

### The re-measurement — why a memo is the wrong tool (§A.4)

| | cost |
|---|---|
| `fadeIn` `fromString` (2-stop), cold | 9.3 µs/call |
| `bounce` `fromString` (7-stop), cold | 33.6 µs/call |
| `fadeIn` `fromString`, **tryParseCache warm** | 7.4 µs/call |

Two facts kill the memo:

1. **The leaf-parse is already memoized.** `tryParseCache` (`utils.ts:203`) caches the
   value.js combinator parse per leaf, keyed by `${childKey}:${strValue}`. The warm
   repeat (7.4µs) vs cold (9.3µs) shows the cache *already* eats the parse; the
   residual 7.4µs is the per-frame **compile** — `normalizeValueUnits`, the sort,
   building `flatVars`/`allInterpVars` — not the parse. A "preset memo" would have to
   cache the *compiled frames*, not the parse.

2. **A preset MUST return a fresh, independently-mutable Animation.** Verified (§A.4):
   `fadeIn() !== fadeIn()` and their `.frames` arrays are distinct objects. A consumer
   calls `fadeIn().play(el)` and then `.setDuration(…)` / `.targets = [el2]` — mutating
   shared state. Memoizing the *Animation* would alias state across call sites
   (one consumer's `setDuration` would silently retune another's animation — a
   correctness bug). Memoizing the *compiled frames* and deep-cloning per call trades
   the 7.4µs parse for a deep-clone of the frame array (`ValueUnit[]` per key) — which
   is the same order of cost (it allocates the same structures), so the memo wins
   nothing while adding an eviction/identity hazard.

3. **It is not on any runtime hot path.** A preset is constructed **once** at consumer
   setup, then `play()`ed; the 7.4–34µs is a cold one-time cost, not a per-frame cost.
   The §Mandate's measure-first forbids speculative machinery on a cold path that
   shows no footprint problem.

### Disposition

**STAY-WITHHELD / RECORD.** The "preset lazy memo" is a non-finding: the parse is
already cached (`tryParseCache`), the Animation cannot be shared without a correctness
bug, the compiled-frames memo wins nothing after the mandatory per-call clone, and the
cost is cold/one-time. **No fold, no bench, no value.js handoff** — RECORD it as
measured-and-declined so the `FINAL.md:46-49` withhold is closed honestly and not
re-surfaced. The honest note: presets are *already* the right shape — thin factories
over a memoized parser.

**Isomorphism:** n/a (no change). Recording the non-fold.

---

## ALREADY-SOTA — the runtime band, re-confirmed, manufacture no work

Grounded so F does not re-litigate (re-confirms `d-runtime.md` §11, `a-engine-post-e`
§ALREADY-SOTA, `r-v8-cost-model` F-5 from the bench-harness angle):

- **Standalone zero-alloc (E-RT-1) LANDED** — `processFrame` is a *method*
  (`engine.ts:618`), not a per-call closure; the `out` buffer threads through
  (`engine.ts:565-568`). `proof:standalone-zero-alloc` bites it. The remaining RM-1
  delete-loop is a *clear-mechanism* residue, not an allocation.
- **The hot kernel** — binary-search seed + contiguous-neighbor scan
  (`engine.ts:579-606`), pre-resolved monomorphic `lerpValue` over pre-flattened
  `allInterpVars` (`engine.ts:628-630`), zero-width-frame snap (E-RT-5,
  `engine.ts:625`). SOTA — leave it.
- **The group compositor is zero-alloc** — inline whitelist key-skip (no
  `filteredValues` object, `group.ts:242-296`), in-place blend accumulation, the
  long-lived `_grouped`/`entry.values` buffers. The one residue is RM-1's delete-loop
  (`group.ts:212`), a clear-mechanism fix, not an allocation. ALREADY-SOTA modulo RM-1.
- **The light steppers are stall-robust by construction** — `SmoothProgress.tickDt`
  is frame-rate-independent exponential smoothing; `SpringProgress` is closed-form
  analytic. The `drive` loop's un-clamped `dt` (`playback.ts:173`) is *correct* — a
  huge post-stall `dt` saturates the smoothing (snap, benign) or lands the analytic
  spring at its mathematically-correct elapsed position. Not a gap.
- **`scheduler.yield` INP-batched group advance** (`group.ts` `YIELD_BATCH`) — live
  probe + cached fallback. Modern, leave it.

The honest verdict: the interpolation *kernel*, the steppers, the compositor blend,
and the WAAPI delegation are SOTA. The four withholds are all in the *connective
tissue* (the buffer clear, the loop-core dispatch, the DOM write serialization) and
the *preset factory* — and of those, only two are real folds.

---

## Disposition ledger

| ID | Withhold | Site | Re-measured | Disposition |
|---|---|---|---|---|
| **RM-1** | `delete`-loop dict-mode deopt | `engine.ts:573`, `group.ts:212` | 5.4/4.4/3.7× (K=2/5/12); `%HasFastProperties` deopt (§A.1) | **MEASURE-FIRST → LAND** (author `bench/interp-buffer.bench.ts` + `proof:interp-fastprops`; stable-key reset + single-frame alias) |
| **RM-2** | async fast path (per-frame promise+microtask) | `playback.ts:99-108`; `engine.ts` async `_frame`/`advanceTo` | 33ns drive · 43ns Animation · 2.1µs/frame 50-child (§A.2) | **MEASURE-FIRST → LAND `drive` half** (gated on promise-count) **+ HOLD Animation/group half** (gated on the event-ordering lock) |
| **RM-3** | per-frame DOM write-skip | `utils.ts:363-377` | diff-skip saves ~0 (E's `d3-changed-keys.measure.test.ts`, §A.3) | **STAY-WITHHELD / KILL the diff-skip** + **value.js-HANDOFF** (VJS-2 serialization alloc) |
| **RM-4** | preset lazy memo | `animations.ts:14-797` | 7.4–34µs cold; parse already memoized; Animation must be independent (§A.4) | **STAY-WITHHELD / RECORD** (non-finding; a memo breaks instance independence) |
| — | kernel / steppers / group blend / WAAPI / standalone zero-alloc | (§ALREADY-SOTA) | re-confirmed | **ALREADY-SOTA** |

**Net for F's runtime band:** two folds gated on **one new authored bench file**
(`bench/interp-buffer.bench.ts` — the shaped, buffer-threaded sibling the current
`interpolation.bench.ts` cannot replace) **plus `bench/sync-step.bench.ts`** and their
biting vitest gates (`proof:interp-fastprops`, `proof:sync-step`). One kill (the DOM
diff-skip, settled by E's measurement) with a value.js handoff for the real
(serialization) cost. One record (the preset memo is a non-finding). **No
re-architecture, no manufactured work — the engine is SOTA; the deliverable is the
shaped bench harness the withholds always needed to be gated honestly.**

---

## §A — Re-runnable bench scripts (node v26)

All numbers above are from these scripts. The `interpFrames`/`_run` shapes mirror the
live code at the cited lines.

### A.1 — RM-1: the dict-mode deopt + steady-state cost (mirrors `interpFrames`)

```js
// node --allow-natives-syntax
function fast(o){ return %HasFastProperties(o); }
const KEYS = ["opacity","transform.translateX","transform.translateY","transform.scale",
  "transform.rotate","transform.skewX","transform.skewY","filter.blur","width","height","top","left"];
function bench(fn, iters){ for(let i=0;i<50000;i++) fn();
  const t0=process.hrtime.bigint(); for(let i=0;i<iters;i++) fn(); return Number(process.hrtime.bigint()-t0)/iters; }
for (const K of [2,5,12]){
  const keys = KEYS.slice(0,K); const flatVars = {}; for(const k of keys) flatVars[k]=[0];
  const bufDel = {};
  const cur = () => { for(const k in bufDel) delete bufDel[k]; Object.assign(bufDel, flatVars); };   // engine.ts:573,636
  const bufStable = {}; for(const k of keys) bufStable[k]=undefined;
  const fix = () => { for(let j=0;j<keys.length;j++) bufStable[keys[j]] = flatVars[keys[j]]; };       // the stable-key reset
  const alias = () => flatVars;                                                                        // single-frame alias
  const c=bench(cur,2e6), f=bench(fix,2e6), a=bench(alias,2e6);
  console.log(`K=${K} delete+assign=${c.toFixed(1)}ns stable=${f.toFixed(1)}ns alias=${a.toFixed(2)}ns ${(c/f).toFixed(1)}x`);
  console.log(`  HasFastProps: delete=${fast(bufDel)} stable=${fast(bufStable)}`);
}
// → K=2 101.7/18.8/2.05 5.4x  delete=false stable=true
// → K=5 214.1/48.4/2.40 4.4x  delete=false stable=true
// → K=12 491.8/132.6/2.21 3.7x delete=false stable=true
```

### A.2 — RM-2: the per-frame async cost (mirrors `_run` `playback.ts:99-108`)

```js
function syncStep(){ return true; } // a drive() Tickable.tickDt — synchronous boolean
async function benchAsync(n){ const t0=process.hrtime.bigint(); let cont=true;
  for(let i=0;i<n;i++) await Promise.resolve(syncStep()).then(c=>{cont=c;}); return Number(process.hrtime.bigint()-t0)/n; }
function benchSync(n){ const t0=process.hrtime.bigint(); let cont=true;
  for(let i=0;i<n;i++){ const r=syncStep(); if(r&&typeof r.then==="function"){}else cont=r; } return Number(process.hrtime.bigint()-t0)/n; }
async function benchTwoAsync(n){ async function advanceTo(){} async function frame(){ await advanceTo(); return true; }
  const t0=process.hrtime.bigint(); for(let i=0;i<n;i++) await frame(); return Number(process.hrtime.bigint()-t0)/n; }
// → drive async=33.9ns sync=0.75ns overhead=33.1ns ; Animation interior(2 async+await)=42.9ns ; 50-child ~2144ns/frame
```

### A.3 — RM-3: the write-skip change-fraction (E's `test/d3-changed-keys.measure.test.ts`)

E's landed measure instrument shows the interpolating-key change-fraction is ~100%
during active interpolation — a lerped value differs every interior frame — so a
diff-and-skip `setProperty` cache saves ~0 on the hot path. (Re-confirmed by reading
the test's assertion; no new microbench needed — the cost model is dispositive.)

### A.4 — RM-4: the preset re-parse cost + instance independence

```js
import { loadAnimationEngine } from "/Users/mkbabb/Programming/keyframes.js/dist/keyframes.js";
const { CSSKeyframesAnimation: C } = await loadAnimationEngine();
const css = `from { opacity: 0; } to { opacity: 1; }`;
function bench(fn,n){ for(let i=0;i<50;i++) fn(); const t0=process.hrtime.bigint();
  for(let i=0;i<n;i++) fn(); return Number(process.hrtime.bigint()-t0)/n/1000; }
console.log(bench(()=> new C({duration:700}).fromString(css), 2000).toFixed(1), "us (warm tryParseCache)"); // → 7.4
const a1=new C().fromString(css), a2=new C().fromString(css);
console.log("independent:", a1!==a2, a1.frames!==a2.frames); // → true true
// cold: fadeIn 9.3us, bounce(7-stop) 33.6us — a preset is built once at setup, not per frame.
```
