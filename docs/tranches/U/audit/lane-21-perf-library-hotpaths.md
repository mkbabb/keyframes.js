# Lane 21 — perf-library-hotpaths

**Fleet:** Tranche U development audit (32-lane) · **Charter:** THE PERFORMANCE EDICT,
library half — profile-read the tick path (RAFPlayback → KeyframesAnimation.update →
interpolation dispatch → renderer), the SoA compositor fold, spring steppers, WAAPI
delegation; find allocations-per-frame, megamorphic dispatch, computed-unit DOM cost,
the group blend fold; run `bench/` and report numbers; propose the U perf frontier +
the regression harness it needs.

**Discipline:** read-only over the LIVE tree (v5.2.0, `tranche-t-impl`). Numbers are
from `npm run bench` executed this session (M-class macOS, jsdom, vitest/tinybench) +
the recorded `scripts/*-decision.json` device-independent A/B ratios.

---

## HEADLINE

The entire SoA optimization campaign (P/Q) tuned **interpolation** — roughly **5 % of a
tick** — while the **apply/render half (~95 %, measured ~45–49× the interp cost)**
remains an un-batched, per-frame-allocating, string-re-serializing, one-`setProperty`-
per-property path. **That render seam, not interpolation, is the U library perf
frontier.**

---

## What I read (hot-path map, with evidence)

| Path | File | Verdict |
|---|---|---|
| rAF driver + sync fast-path | `physics/playback.ts:113-151` | Excellent — generation-guarded core, inline sync reschedule (no microtask) |
| standalone play frame | `engine/play-lifecycle.ts:201-257` | Sync steady path; but per-frame closure alloc (F6) |
| interp fold (sample) | `engine/interpolate.ts:124-312` | Excellent — zero-alloc alias fast-path, numeric SoA fold |
| numeric SoA plan | `compile/numeric-plan.ts` | Float64 endpoints built once at parse; one `lerpArray`/frame |
| **default DOM renderer (apply)** | `compile/parse-flatten.ts:306-320` | **The bottleneck (F1)** |
| group SoA blend fold | `group/soa.ts`, `group/compositor.ts` | Excellent — zero-alloc, precomputed carriers/boxedKeys Set |
| spring stepper | `physics/spring/progress.ts` | Analytic closed-form; `emit()` Set iteration (minor) |
| WAAPI shadow loop | `waapi/delegation.ts:38-49` | Opts out of the sync fast-path (F3) |
| computed-unit resolution | value.js `value.js:73-118` (consume edge) | Warm-cached; wholesale-clear on resize (F7) |

The interp/sample side is genuinely SOTA and I found nothing to add there: the single-
active-frame alias path returns `frame.flatVars` with no clear and no copy
(`interpolate.ts:187-196`); `processFrame` mints no per-frame closure and folds the
numeric subset through one `lerpArray` into reused `out`/`Float64Array` buffers
(`interpolate.ts:259-273`); `prepareInterpVar` caches `_lerp`/`_colorPlan` at compile
(`parse-flatten.ts:279`), so the boxed dispatch is NOT re-resolved per frame. The
allocation and dispatch debt has migrated **downstream of interpolation, into apply.**

---

## Measured numbers (live `npm run bench`, this session)

Interp is fast; **apply is 45–49× slower**; interp SoA wins are real but below the
frozen decision-JSON claims:

| Bench | hz (per window) | Note |
|---|---|---|
| `interpFrames` 2-frame opacity SAMPLE (60f) | **281,988** | sample-only, zero-alloc |
| `2-frame opacity REPLACE APPLY (60f)` | **5,755** | **49× slower than sample** |
| `2-frame opacity composite:add APPLY (60f)` | 5,793 | ≈ replace → composition adds ~0 |
| `processFrame SoA vs boxed` K=8 | 150,946 vs 7,291 → **20.7×** | decision-JSON claims **60×** (drift, F2) |
| `SoA lerpArray dispatch-only` K=8 | 254,613 vs 10,275 → **25×** | single `lerpArray` vs per-channel `lerpValue×8` |
| `colorTail SoA vs boxed` K=8 | 5,291 vs 464 → **11.4×** | matches `color-soa-decision.json` 10.9× |
| `colorTail SoA` K=12 | **3,026** | vs numeric processFrame SoA K=12 = 120,481 → color ≈ **40× costlier/channel** (F5) |
| `SpringProgress.tickDt` underdamped 600 steps | 60,816 | analytic solver — excellent |
| `spring vector K=8` vs `scalar K=8×indep` | 42,130 vs 6,973 → **6×** | beats `L.W7` recorded 2.97–3.78× |
| `AnimationGroup 32-cell K=8 composite` 600f | 5.43 → **0.31 ms/frame**; max 4.15 ms | well within 16.7 ms budget; `no >50ms frame` passes |
| `cold LIGHT SpringProgress construct+settle` | 2,063,027 | value.js-free boundary intact |
| `cold HEAVY fromString` | 103,813 | value.js parse |
| `curvature-adaptive densify` vs `fixed-8 uniform` | 7,347 vs 1,115,171 → **150×** | WAAPI emission, once/play (fine) |

**Harness anomaly (F4):** this `npm run bench` also executed **4 stale
`.claude/worktrees/` copies** (232 output lines; `wf_1e744f4d-2bb-{1,2,3}`,
`wf_558e7859-5ca-3`) — ~4× the intended work. `tinyglobby` from root matches only the
12 live files, so the leak is via vitest's config/project discovery, not the include
glob.

---

## Findings (file:line evidence; each cure is a gestalt transposition, not a patch)

### F1 [CRITICAL] — the apply/render half is the tick bottleneck; the SoA campaign optimized the wrong 5 %
**Evidence:** `compile/parse-flatten.ts:306-320` (`transformTargetsStyle`, the default
DOM renderer on the rAF apply hot path):
```ts
const styleStringVars = unflattenObjectToString(vars, _styleOut);   // re-serialize EVERY prop → CSS string, every frame
targets.forEach((target) => {
    Object.entries(styleStringVars).forEach(([key, value]) => {     // per-frame array + closure ALLOC, per target
        target.style.setProperty(key, value);                       // N separate writes → N style invalidations
    });
});
```
Per apply frame this (a) re-serializes every animated property from `ValueUnit`s to a
CSS string via value.js `unflattenObjectToString`, (b) allocates an `Object.entries`
array and a `.forEach` closure **per target per frame** (the zero-alloc gate never sees
it — it fires only on the SAMPLE path, `transformFrames=false`), and (c) writes each
property separately, so a K-component transform is K style mutations/recalcs. Bench:
REPLACE apply **5,755 hz** vs sample **281,988 hz** — **49×**; `composite:add` apply is
identical (5,793), proving the cost is the write, not the blend. In a real browser
(recalc, not jsdom) the gap is larger.

**Proposal (the U frontier's largest real-world win):** transpose the render seam.
(1) Kill the per-frame `Object.entries`/`forEach` alloc — walk a compile-stable key
array with an indexed loop (the same discipline `clearBuffer`/`_stableKeys` already
uses on the sample side). (2) **Coalesce the transform family** (`translate*`/`scale*`/
`rotate*`/`skew*`) into ONE `transform` string committed as a single `style.transform`
write — one mutation, one recalc, instead of N. (3) Land a **CSS Typed-OM apply path**
(`element.attributeStyleMap.set(prop, CSSUnitValue)`) for numeric leaves that bypasses
string serialization entirely — the Typed-OM work booked in Tranche P never reached the
default render path. The renderer, not the interpolator, is where "performance above
all" pays.

### F2 [MAJOR] — the perf gates are frozen A/B ratios; no CI-wired allocation-regression harness, no absolute floor, and value.js has moved under them
**Evidence:** `scripts/processframe-soa-decision.json` records `soaOverBoxed: 60.28` at
`2026-06-24`; the LIVE bench measures **20.7×** (150,946/7,291). The bench suite runs
only **relative** A/B (SoA vs boxed, `bench/interp-buffer.bench.ts`) — it cannot catch a
regression that slows BOTH arms, nor a per-frame allocation creeping back (the exact
`F.W4` dictionary-mode 3.8–6.2× regression the codebase already paid once). value.js is
now **3.1.0** (was 1.2.0 when the ratios were cut) and its tranche is active — every
re-pin can silently move these numbers.

**Proposal:** U charters a two-part standing harness. (1) An **allocation-count
assertion** — heap-delta == 0 over ~1000 **apply** frames (not just sample), so F1's
per-frame allocs and any future regression fail RED. (2) An **absolute-throughput
floor** per hot path, pinned to a device-class with tolerance, **auto-re-baselined on
every value.js re-pin** (the consume-edge is the drift source). Wire both into the
trimmed CI as the perf gate that replaces the tautological source-shape checks.

### F3 [MAJOR] — the WAAPI shadow loop opts out of the engine's flagship sync fast-path
**Evidence:** `waapi/delegation.ts:38` — `animation.playback.loop(async (now) => { ...
await animation.advanceTo(now); ... })`. Because the callback is `async`, it ALWAYS
returns a Promise, so `RAFPlayback._run`'s sync fast-path (`physics/playback.ts:139-147`
— the J.W6 headline zero-microtask optimization) **never applies to WAAPI playback**:
every shadow frame does a `.then(reschedule)` microtask hop and awaits a value that is
synchronous on the steady path (`advanceTo` returns a plain number post-first-tick,
`play-lifecycle.ts:158-172`).

**Proposal:** mirror the rAF path's own shape (`play-lifecycle.ts:222-225`) — make the
shadow callback a plain function that inspects `advanceTo`'s return type and defers only
on the genuine thenable (the first-tick delay sleep). The pause/resume compositor nudge
is synchronous. This restores the sync fast-path to the WAAPI lane so the two loops
share one scheduling idiom, not two.

### F4 [MAJOR] — `npm run bench`/`npm test` traverse stale `.claude/worktrees/` copies (~4× the work)
**Evidence:** this session's `npm run bench` produced 232 lines from 4 stale worktrees
(`.claude/worktrees/wf_1e744f4d-2bb-{1,2,3}`, `wf_558e7859-5ca-3`, dated Jul 5–7).
`vitest.config.ts:45,49` declares `test.include`/`benchmark.include` with **no
`exclude`** for `.claude/**`; vitest's default exclude covers `node_modules`/`dist` but
not the worktree dir. `tinyglobby` from root matches only the 12 live bench files, so
the leak is vitest's config/project discovery of the nested `vitest.config.ts` in each
worktree — not the include glob. This quadrupled the run (~7 min) and makes the F2
harness impractical to gate. Directly germane to the owner's CI-trim edict.

**Proposal:** add explicit `exclude: ['**/.claude/**', '**/node_modules/**',
'**/dist/**']` to BOTH the `test` and `benchmark` blocks and pin vitest `root`, so the
runner never descends into fleet worktrees; and the orchestration must GC stale
worktrees after a lane closes (a fleet-hygiene charter, not just a config line).

### F5 [MINOR] — color is the residual interp hot spot (~40× the numeric-channel cost) even after the fold
**Evidence:** bench colorTail SoA K=12 = **3,026 hz** vs numeric processFrame SoA K=12 =
**120,481 hz** — color is ~40× costlier per channel. Every demo color scene has an
EMPTY numeric plan (`numeric-plan.ts:25-30` excludes `unit === "color"`), so ALL leaves
ride the boxed `lerpValue` dispatch (`interpolate.ts:266-272`) into value.js's
`lerpColorValue`. The `_colorPlan` fold is already consumed transparently
(`color-soa-decision.json` = DECLINE the kf-side arm, correctly — no-legacy).

**Proposal (consume-edge charter, NOT a kf parallel arm):** the coordination letter to
value.js's active tranche asks for a per-frame **color-batch fold** — fold ALL color
ivs of a frame into ONE contiguous channel-batch lerp (the numeric fold's analogue for
color), amortizing the per-iv `_lerp` indirection across a frame's color leaves. kf
charters the letter; the fold lives in the value.js leaf by the no-duplicate precept.

### F6 [MINOR] — per-frame closure allocation on the standalone play path
**Evidence:** `play-lifecycle.ts:211-215` — `playFrame` allocates two arrow closures
`() => true` / `() => false` every frame for `withReducedMotion`, even when
`respectReducedMotion` is off (the dominant path, which `reduced-motion.ts:158` short-
circuits WITHOUT invoking them — pure allocation waste). V8 usually hoists non-capturing
arrows, but the zero-alloc gate can't see this (it lives on the apply path).

**Proposal:** hoist the two to module constants, OR gate the whole live-flip
re-consultation behind `if (anim.options.respectReducedMotion)` so the 99 % path is one
field read + branch, zero closures. Fold into the F2 allocation harness so it can never
silently return.

### F7 [MINOR] — computed-unit resolution wholesale-clears the memo cache on any window resize
**Evidence (consume edge):** value.js `dist/value.js:73` — `K = () => (W++,
Y.cache.clear(), W)` wired to `window.addEventListener("resize", …)`. kf's default
renderer + the C1 endpoint memo (bench: calc leaf 14,047 hz warm) fall to a
getComputedStyle-per-iv COLD path on every epoch bump; a resize-drag of a `cq*`/`calc`
animation cold-misses every frame. kf's own CLAUDE.md books the "RECORDED non-action"
(no per-target `ResizeObserver`).

**Proposal (consume-edge charter):** request value.js **epoch-scoped incremental
invalidation** — bump the epoch and lazily re-resolve + re-cache each iv on its next
read, rather than clearing the whole cache — so a steady computed animation during a
continuous resize re-resolves each iv once per SETTLED layout, not once per frame. kf
supplies the container-resize signal it already contracts (`bumpLayoutEpoch` on a
container `ResizeObserver`); value.js owns the eviction policy (DRY).

---

## What U must charter

1. **Transpose the render seam (F1)** — kill the per-frame `Object.entries`/`forEach`
   alloc in `transformTargetsStyle`, coalesce transform-family components into one
   `transform` write, and land a CSS Typed-OM numeric-apply path that bypasses string
   serialization. This is the grand-edict's largest real-world library win.
2. **Charter the perf regression harness (F2)** — an allocation-count assertion over
   steady APPLY frames (heap-delta == 0) + an absolute-throughput floor per hot path,
   auto-re-baselined on every value.js re-pin; wire it into the trimmed CI as the perf
   gate. Re-cut the stale decision-JSON ratios (60× → measured 20×) against v5.2.0 /
   value.js 3.1.0.
3. **Restore the sync fast-path to the WAAPI lane (F3)** — replace the `async` shadow
   callback with the plain-function return-type-inspecting shape the rAF path uses.
4. **Anchor the test/bench runner off `.claude/worktrees/` (F4)** — explicit `exclude`
   in both vitest blocks + pinned `root`, and fleet-worktree GC; a load-bearing row of
   the CI-trim edict.
5. **Charter the value.js consume-edge coordination letter (F5, F7)** — a per-frame
   color-batch fold in `lerpColorValue`, and epoch-scoped incremental (not wholesale)
   computed-cache invalidation. No kf-side parallel arms (no-legacy).
6. **Fold the standalone-play closure alloc (F6)** into the F2 allocation harness so it
   cannot silently regress.
