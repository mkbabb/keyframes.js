# E audit — engine lane (core primitives · the published library)

**Verdict: EXEMPLARY post-D.** Tranche D transposed the engine to its gestalt —
the `FrameCompiler` split, the zero-alloc compositor, the `advanceTo` canon, the
honest `pause`/`resume`/`toggle`, the deprecated-re-export retirement, the
`_snapSettled` symmetry, the `| any` tightening. The E mandate asked the assay to
re-compare the core primitives + the last-tranche items against
developer.chrome.com's modern-web guidance. The finding is that the engine
**barely needs E** — inv-16 holds and E writes only keyframes.js, but the
published library is at gestalt and E records, it does not re-architect.

This lane is therefore short by design. It first DISCHARGES the "is the engine
still exemplary?" question against the live tree (each claim `file:line`-grounded,
**verified not asserted**), then BOOKS the two trivial residuals the E assay
surfaced — neither hot, neither a defect, both LEAVE-or-document. There are **zero
FOLD items** in this lane; the engine's E home (E.W5) is housekeeping-only.

This is **net-NEW** content. D's deferred ledger is clean — D terminated every
keyframes-owned engine deferral (D-1..D-6 all landed or were measure-first
withheld; P-invariant-28). The two BOOK items below are NOT folded debt; they are
fresh observations from the E assay, recorded honestly as such.

## The exemplary discharge (each claim grounded · LEAVE)

| Claim | Evidence (file:line) | Verdict |
|---|---|---|
| No hot-path allocations — `interpFrames` writes a caller-owned buffer; no fresh per-frame object | `engine.ts:547-555,589` | **LEAVE** |
| The compositor honours its own zero-alloc discipline — `_grouped` instance buffer, cleared in place | `group.ts:91,211-212` | **LEAVE** |
| WAAPI maximally delegated — the reference-guard fix unblocked `CSSKeyframesAnimation` | `waapi.ts:54` (`usesDefaultRenderer`) | **LEAVE** |
| `scheduler.yield` live-probed + cached; the group batches + yields for INP relief | `internal/scheduler.ts:17`, `group.ts:60,368,379` | **LEAVE** |
| Reduced-motion unified — ONE detector + ONE `withReducedMotion` gate | `internal/reduced-motion.ts:23,44,49` | **LEAVE** |
| `ScrollTimeline` correctly JS-driven (injectable `getScrollY`/`getViewportHeight`), NOT native CSS scroll-timeline | `timeline.ts:158-160,165-171` | **LEAVE** |
| `will-change` / `content-visibility` = consumer responsibility, not engine-owned | (engine emits no such CSS; renderer writes only animated keys) | **LEAVE** |
| D-3 (computed-unit changed-keys write) correctly withheld — measure-first, recorded | `docs/tranches/D/waves/D.W4.md:92-118` | **LEAVE** |

### No hot-path allocations

`Animation.interpFrames` (`engine.ts:547`) takes a caller-supplied `out`
record (`:550`), clears it **in place** every frame (`for (const k in result)
delete result[k]`, `:555`), and fills it via `Object.assign(result,
frame.flatVars)` (`:589`) — `flatVars` is the pre-flattened NATIVE object
compiled once by the `FrameCompiler` (D.W4), so the per-frame path copies into a
long-lived buffer and allocates no fresh object. The group passes each entry's
own `entry.values` buffer in (per the D.W1/D.W4 zero-alloc contract). Steady-state
GC pressure on the interp path is zero. **LEAVE** — no E action; aligns with
modern-web "avoid layout thrash / allocator churn in the rAF loop".

### The compositor honours zero-alloc

`AnimationGroup.transformFramesGrouped` (D-1's headline fix) uses `private
_grouped: Record<string, unknown> = {}` (`group.ts:91`) — an instance buffer
fetched (`const groupedValues = this._grouped`, `group.ts:211`) and cleared in
place (`for (const k in groupedValues) delete groupedValues[k]`, `group.ts:212`)
each frame; the property whitelist is a key-skip `continue` inside the blend
switch (no `Object.fromEntries(Object.entries(…).filter(…))`). The lone hot loop
that D-1 targeted now allocates nothing in steady state. **LEAVE.**

### WAAPI maximally delegated

`waapi.ts:54` gates eligibility on `animation.usesDefaultRenderer(frame.transform)`
— the bind-proof reference comparison (the D-era fix that replaced the Symbol tag
`Function.prototype.bind` silently dropped, which had read every `fromString`
animation as "custom transform" and left the WAAPI path dead in practice). With
the guard fixed, `CSSKeyframesAnimation` correctly rides the compositor thread
when eligible (DOM targets, uniform timing, no computed units, no color interp),
falling back to rAF with a queryable `waapiIneligibleReason`. The engine delegates
to the platform compositor as far as the platform's own WAAPI restrictions allow.
**LEAVE** — this IS the modern-web "prefer compositor-thread animation" guidance,
already maximally honored.

### scheduler.yield live-probed + INP relief

`internal/scheduler.ts:17` documents `yieldToMain()` probing native
`scheduler.yield` LIVE on each call (a polyfill or late-installed scheduler is
always honored) with a cached fallback. `AnimationGroup` ticks children in
batches of `YIELD_BATCH = 32` (`group.ts:60`), `await yieldToMain()` between
batches (`group.ts:368,379`) — INP relief for large groups, exactly the
modern-web "break long tasks, yield to the main thread" guidance. **LEAVE.**

### Reduced-motion unified

`internal/reduced-motion.ts` is the ONE detector (`prefersReducedMotion()`,
`:23`) + the ONE response gate (`withReducedMotion(respect, snap, run)`, `:44`,
returning `respect && prefersReducedMotion() ? snap() : run()`, `:49`). Every
surface (Animation, AnimationGroup, the steppers, RAFPlayback) routes its snap
through this single gate — the formerly hand-rolled per-surface copies are
collapsed. **LEAVE** — modern-web accessibility-motion guidance, unified at one
seam.

### ScrollTimeline correctly JS-driven

`ScrollTimeline` (`timeline.ts:163`) takes injectable `getScrollY`/
`getViewportHeight` callbacks (`:158-160`), defaulting to `window.scrollY` /
viewport height (`:171`) but overridable for testing without DOM. It is a
JS-driven progress sampler — NOT a wrapper over the native CSS `ScrollTimeline`
API. This is the recorded ARCH decision (D's ledger: "ScrollTimeline-native =
permanent KILL, do not re-litigate"): the JS driver gives the engine's
sample→clamp→easing→snap→smooth pipeline + the caller-owns-the-loop contract that
the native API cannot. **LEAVE** — the divergence from native is deliberate and
documented; not a modern-web gap.

### will-change / content-visibility = consumer responsibility

The engine's DOM renderer writes ONLY the animated style keys (the interp
output) to the target — it emits no `will-change`, no `content-visibility`, no
`contain`. That is correct: these are layout/compositing HINTS the CONSUMER owns
for its own elements (the demo's `OrbitalDrag.vue:57` sets `willChange:
'transform'` on its own container, for instance). An animation engine that
injected `will-change` would fight the consumer's own layering budget. **LEAVE**
— the `content-visibility` opportunity the lighthouse lane names is a DEMO-side
optimization (E.W4), NOT an engine responsibility.

### D-3 correctly withheld

D-3 (the computed-unit DOM round-trip → changed-keys-only write) was a
MEASURE-FIRST item: `docs/tranches/D/waves/D.W4.md:92-118` specifies it lands
ONLY if a bench shows a real per-frame `setProperty` reduction, else it is
"withheld with the measurement recorded" (the C.W4 "proven or not shipped"
discipline). The live `utils.ts` renderer carries no `WeakMap` changed-keys cache
— D-3 was correctly withheld. **LEAVE** — E does not re-open it; a withheld
measure-first perf item stays withheld until a measurement warrants it, and the E
assay surfaced no new evidence that it does.

## BOOK items (the two trivial residuals)

### B1 — `tryParseCache` unbounded growth (`utils.ts:145`) — BOOK

**State.** `utils.ts:145` — `const tryParseCache = new Map<string, ValueArray>()`
— a module-level memo keyed by `${childKey}:${strValue}` (`utils.ts:182`),
populated at `utils.ts:209` (`tryParseCache.set(cacheKey, parsed.clone())`) and
read at `utils.ts:183`. It has **no eviction**: every distinct
`(subProperty, value-string)` pair ever parsed stays cached for the process
lifetime.

**Why it is NOT a defect (and not hot).** The cache is populated at
`parseAndFlattenObject` time — the COMPILE path (`addFrame`/`parse`), not the
per-frame interp path. The hot rAF loop never touches it. For a real consumer the
key-set is bounded by the distinct CSS values across the loaded animations — a
small, naturally-finite set (the demo's whole animation library is a few hundred
distinct value-strings). Unbounded growth only matters for a pathological
consumer that parses an unbounded stream of distinct never-repeated CSS values
(a CSS fuzzer, say) — which is not a real workload. The `.clone()` on both set
and get (`:185,209`) keeps cached entries immutable, so there is no correctness
hazard, only a theoretical memory ceiling.

**E-disposition: BOOK — eviction is measure-first, else recorded-withheld.** Per
the D measure-first discipline (a perf/footprint change is proven or not shipped),
E.W5 may add a bounded eviction (an LRU cap, or a `WeakRef`-keyed scheme) ONLY if
a measurement demonstrates the unbounded `Map` is a real footprint problem under
a real workload. The E assay found no such workload — the cache is on the cold
compile path, bounded by the consumer's distinct-value count in practice. **Most
likely E.W5 records this as "verified-unbounded-but-not-hot, eviction withheld
pending a workload that warrants it"** — the honest disposition, not a
speculative LRU bolted onto a cold path that does not need one (KISS, no
gold-plating). Not a FOLD; the engine ships as-is unless measured otherwise.

### B2 — the managed-animation pause contract — BOOK (document)

**State.** The `pause`/`resume`/`toggle` verbs are already HONEST after D-5 —
`Animation.pause()` (`engine.ts:821-826`) is idempotent (pauses, never secretly
resumes; documented `:817-819`), `Animation.resume()` (`:828-844`) is idempotent,
`Animation.toggle()` (`:847-849`) is the explicit flip; `AnimationGroup` mirrors
all three (`group.ts:523-568`, each with the matching "a method named `pause`
pauses" docstring). The toggle-for-back-compat legacy smell D-5 named is GONE.

**The residual: the MANAGED contract is under-documented at the seam.** The
interaction between a child's `pause`/`resume` and the group that OWNS its rAF
loop is subtle and correct but not spelled out in one place:
- A managed child has `managed = true` (`engine.ts:131`), set by the group
  (`group.ts:126`); `Animation.play()` on a managed child THROWS
  (`engine.ts:779-782` — "the AnimationGroup owns the rAF loop. Call group.play()
  instead.").
- `AnimationGroup.pause()` (`group.ts:523`) propagates to every child via
  `anim.pause()` (`group.ts:532`) AND seeds `pausedTime` from the last rAF tick
  (`group.ts:535-537`) so resume adjusts `startTime` without a forward jump — the
  group's clock, not `performance.now()`.
- `AnimationGroup.resume()` (`group.ts:552`) unpauses children DIRECTLY
  (`entry.animation.paused = false`, `group.ts:557`) — NOT via `child.resume()`,
  which would start each child's own rAF loop and race the group's draw loop
  (documented `group.ts:546-551`). The group's `playback.loop` owns the ticking.

This is the correct contract — but a consumer (or a future maintainer) reading
`Animation.resume()` alone would not know that on a MANAGED child it must never
be called directly (the group flips `paused` for it). The asymmetry between
"standalone resume reschedules the rAF loop" and "managed resume is just a flag
flip the group's loop observes" is load-bearing and currently inferable only by
reading both files.

**E-disposition: BOOK — document, do not change.** E.W5 adds a COMMENT (not code)
at the `managed` flag declaration (`engine.ts:131`) and/or the `resume` seam
stating the managed contract in one place: a managed child's lifecycle is owned
by its `AnimationGroup` — `play`/`resume` are the group's to drive (the child's
`pause`/`resume` set flags the group's loop observes; calling `child.play()`
throws by design, `child.resume()` directly is a no-op-or-race the group's loop
supersedes). Zero behaviour change — the contract is already correct and
test-covered; E only makes it self-documenting. Not a FOLD; a doc comment, the
engine's E ceiling.

## Disposition summary

| Item | Tag | Evidence | E home | Disposition |
|---|---|---|---|---|
| No hot-path allocs | — | `engine.ts:555,589`, `group.ts:91,212` | — | **LEAVE** (exemplary) |
| WAAPI reference-guard | — | `waapi.ts:54` | — | **LEAVE** (exemplary) |
| scheduler.yield + INP batch | — | `scheduler.ts:17`, `group.ts:60,379` | — | **LEAVE** (exemplary) |
| Reduced-motion unified | — | `reduced-motion.ts:23,44,49` | — | **LEAVE** (exemplary) |
| ScrollTimeline JS-driven | ARCH | `timeline.ts:158-171` | — | **LEAVE** (recorded KILL) |
| will-change/content-visibility | — | (consumer-owned) | E.W4 (demo) | **LEAVE** (not engine) |
| D-3 withheld | — | `D.W4.md:92-118` | — | **LEAVE** (measure-first) |
| **B1** `tryParseCache` unbounded | BOOK | `utils.ts:145,183,209` | E.W5 | **BOOK** — eviction measure-first, likely recorded-withheld |
| **B2** managed-pause contract | BOOK | `engine.ts:131,779`, `group.ts:126,546-557` | E.W5 | **BOOK** — document (a comment, not code) |

## Verification (re-runnable)

```sh
cd /Users/mkbabb/Programming/keyframes.js

# The exemplary discharge — each claim is one grep:
grep -n "for (const k in result) delete result\[k\]\|Object.assign(result, frame.flatVars)" src/animation/engine.ts  # zero-alloc interp
grep -n "private _grouped\|for (const k in groupedValues) delete" src/animation/group.ts                            # compositor buffer
grep -n "usesDefaultRenderer" src/animation/waapi.ts                                                                 # WAAPI guard
grep -n "scheduler.yield\|YIELD_BATCH" src/animation/internal/scheduler.ts src/animation/group.ts                   # yield + INP batch
grep -n "withReducedMotion\|prefersReducedMotion" src/animation/internal/reduced-motion.ts                          # unified PRM
grep -n "getScrollY\|getViewportHeight" src/animation/timeline.ts                                                   # JS-driven scroll

# B1 — the unbounded cache (no eviction; no .delete/.clear/cap):
grep -n "tryParseCache" src/animation/utils.ts
grep -n "tryParseCache.delete\|tryParseCache.clear\|MAX_CACHE" src/animation/utils.ts   # expect: nothing (unbounded)

# B2 — the managed contract spread across two files:
grep -n "managed" src/animation/engine.ts | head
grep -n "managed = true\|managed = false\|entry.animation.paused = false" src/animation/group.ts

# The engine ships green (the exemplary verdict is test-backed):
npm test
```

**E.W5 gate** — `proof:engine-housekeeping`: tests green + no regression (the
engine is at gestalt — E records, barely edits). The B2 doc-comment lands (a
`grep` asserts the managed-contract comment exists at the `managed`/`resume`
seam); B1's eviction lands ONLY if a footprint measurement warrants it, else the
wave records "verified-unbounded-not-hot, withheld" — the measure-first honest
close. The gate reds if E.W5 ships an unmeasured LRU (gold-plating a cold path) or
silently changes a `pause`/`resume`/`toggle` behaviour (the contract is correct;
E documents it, it does not re-litigate it).
