---
"@mkbabb/keyframes.js": major
---

Tranche D — the demo refined, the engine transposed to its gestalt, the deferrals terminated.

This release ships alongside the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
(`tranche-c`)** changesets — both cut, never published — folded here so one
provenance-signed publish ships the whole B+C+D engine transposition. D's
published-library surface is the **engine transposition (W4)**; the demo refinement
(W1 decomposition · W2 design-language localization · W3 brittleness hardening) lands
in the demo + CI gates and does not change the published API.

**The version owner** for the combined B+C+D publish is **Mike Babb** (`mike@babb.dev`),
who finalizes the SemVer tier and drives `changeset version` → tag → `release.yml`.
The publish leg is **user-domain, confirm-first** — identical to A/B/C.

**The engine transposed to its gestalt (W4).** A `major` because the renames are
intentional and unaliased — a removed name is removed, not shimmed (no-legacy).

- **`tick(t)` → `advanceTo(t)` at the driver layer.** `Animation.tick(absoluteClock)`
  and `AnimationGroup.tick(absoluteClock)` — the absolute-rAF-clock advance — are
  renamed to `advanceTo(t)`, so `tick` now means exactly one thing across the engine
  (the `tickDt(dt)` stepper surface C canonicalized). `advanceTo(t)` reads as what it
  does. No compat alias.
- **`AnimationGroup.pause` is honest.** The method that secretly toggled (pause when
  playing, resume when paused) splits into idempotent `pause()` / `resume()` + an
  explicit `toggle()`; `Animation` gains the same `toggle()` and its `pause(draw)`
  toggle-branch + `draw` parameter are retired. A method named `pause` pauses.
- **The `Animation` god-object split at the `FrameCompiler` seam.** The ~1019-line
  class is decomposed: a standalone, run-state-free `FrameCompiler` owns the
  template→sampled-frames pipeline (`addFrame`/`parse`/reconcile/compile), unit-testable
  without a clock; `Animation` retains the playback state-machine and composes one.
  The public barrel is **byte-stable** — `Animation`/`CSSKeyframesAnimation`/
  `AnimationGroup`/`getAnimationId` and every property the group reads
  (`frames`/`templateFrames`/`interpFrames`/`options`/`t`/`done`) are unchanged
  (delegated where the data now lives).
- **The `AnimationGroup` compositor allocates zero bytes/frame.** The per-frame
  `groupedValues` object literal and the per-layer `filteredValues`
  `Object.fromEntries` are gone — a hoisted instance buffer (cleared in place) + an
  inlined property-whitelist key-skip. The headline group path now honors the
  zero-alloc discipline the class's `_entries`/`interpFrames` buffers were built for.
- **Retirements (no-legacy).** The deprecated value.js path-compat re-exports
  (`lerpColorValue`/`lerpComputedValue`/`lerpNumericValue`/`lerpValue` from
  `animation/utils`, `formatCSS` from `animation/format`) are **deleted** — import
  from `@mkbabb/value.js` directly. `internal/leaves.ts`'s `| any` widening is
  tightened to the precise opaque-handle union. The reduced-motion `_snapSettled`
  snap is symmetric across both steppers (smooth now stops its loop, as spring did).

A computed-unit "changed-keys write" optimization (D-3) was **measured and withheld**
— the keyframes-local benefit is ~0 on the interpolation hot path (every animating
key changes every frame; only held constants are cache-skippable) and the real
re-serialization cost lives in value.js, outside this package. The measurement is
recorded (`test/d3-changed-keys.measure.test.ts`) rather than a speculative
optimization shipped.

New standing CI gates: `proof:engine` (tick-canon · FrameCompiler seam · pause-honest
· snap-symmetry · no-legacy) and `proof:zero-alloc` (the compositor allocation probe).
