# W6 — The encapsulation-sweep demotion table (recomputed on the SETTLED tree)

**Wave:** V.W6 · **Branch:** `v/w5-carves` @ `c1a0da2f` (W5 settled) · **Date:** 2026-07-17 ·
**Mechanism of record:** R2-05 LT-13 / A33 (library half only; DD-4 demo is W8's).

This table is the **recomputed** DD-3 set — R1-07's flat-tree list (§DD-3, ~32 symbols) was
**re-derived from scratch** on the post-W5 moved tree per the XB-02 lesson (test/bench/scripts
consumers count), never trusted as-is. The recomputation is mechanised: it is exactly the
output of the new `proof:structure` **R6** rule (`--rule=R6`), whose semantics are documented
in `scripts/gates/structure/index.mjs`. Each row below was independently cross-verified with a
word-boundary, module-resolved grep across `src/ test/ bench/ scripts/` (and `demo/` as a
build-safety check, though demo is out of R6's consumer domain).

## Classification key

- **(a) true file-local** → the `export` has zero consumers outside its own file; used ≥1× inside
  it. **Action: DEMOTE** (drop the `export` keyword; keep the declaration).
- **(a-dead) fully dead** → exported, used nowhere at all (not even own file); R1-07's dead-code
  census (DD-1/DD-2) missed it. **Action: DELETE** the declaration (DD-1 family).
- **(b) module-internal cross-file** → imported by a SIBLING inside its own module dir. **KEEP the
  `export`, stay barrel-EXCLUDED.** Not an R6 violation; listed for completeness / verification.
- **(c) genuinely consumed** → cross-zone / test / bench / public. **KEEP.** (Not tabulated —
  everything not below is (c).)

---

## §1 — DEMOTE: true file-local over-exports (32) — `refactor(lib): encapsulation sweep (W6)`

| # | file (post-W5) | symbol | consumers found (outside own file) | own-file uses | verdict | action |
|---|---|---|---|---|---|---|
| 1 | `compile/emit/backward/color.ts` | `DensifyResult` | none | 1 | (a) | demote |
| 2 | `compile/emit/format/format.ts` | `PremultiplyResult` | none | 1 | (a) | demote |
| 3 | `compile/frame/interp-slot.ts` | `ColorInterpSlot` | none | 2 | (a) | demote |
| 4 | `compile/frame/interp-slot.ts` | `ComputedInterpSlot` | none | 2 | (a) | demote |
| 5 | `compile/frame/interp-slot.ts` | `DiscreteInterpSlot` | none | 1 | (a) | demote |
| 6 | `compile/frame/interp-slot.ts` | `InterpSlotOptions` | none | 3 | (a) | demote |
| 7 | `engine/composition.ts` | `CompositionRuntime` | none | 2 | (a) | demote |
| 8 | `engine/composition.ts` | `emitCompositionFallback` | none | 1 | (a) | demote |
| 9 | `engine/composition.ts` | `endValueFor` | none | 1 | (a) | demote |
| 10 | `engine/play-lifecycle/frame.ts` | `renderFrame` | none (barrel comment only) | 2 | (a) | demote |
| 11 | `engine/play-lifecycle/strategies.ts` | `playRAF` | none | 2 | (a) | demote |
| 12 | `engine/play-lifecycle/strategies.ts` | `playReducedMotion` | none (≠ group/lifecycle's) | 1 | (a) | demote |
| 13 | `engine/play-lifecycle/strategies.ts` | `playViaWAAPI` | none | 1 | (a) | demote |
| 14 | `group/waapi.ts` | `GroupWAAPIEligibility` | none | 1 | (a) | demote |
| 15 | `internal/animation-id.ts` | `AnimationIdentity` | none | 1 | (a) | demote |
| 16 | `internal/errors.ts` | `AnimationOptionErrorCode` | none | 2 | (a) | demote |
| 17 | `internal/leaves.ts` | `FRAME_RATE` | none | 2 | (a) | demote |
| 18 | `internal/transport-core.ts` | `HeldPlayState` | none | 1 | (a) | demote |
| 19 | `internal/transport-core.ts` | `RunFlags` | none | 2 | (a) | demote |
| 20 | `orchestration/sequence/transport.ts` | `isForwardMonotone` | none | 1 | (a) | demote |
| 21 | `orchestration/sequence/transport.ts` | `restPhase` | none | 1 | (a) | demote |
| 22 | `orchestration/sequence/transport.ts` | `seedOrigin` | none | 2 | (a) | demote |
| 23 | `physics/spring/solver/sample.ts` | `NormalizedSpringSampleOptions` | none | 1 | (a) | demote |
| 24 | `physics/spring/solver/solver.ts` | `SpringModalStep` | none | 2 | (a) | demote |
| 25 | `physics/spring/solver/solver.ts` | `SpringSolution` | none | 3 | (a) | demote |
| 26 | `presets/catalog.ts` | `definePreset` | none | 1 | (a) | demote |
| 27 | `presets/catalog.ts` | `PresetFactory` | none | 3 | (a) | demote |
| 28 | `presets/catalog.ts` | `PresetGroup` | none | 2 | (a) | demote |
| 29 | `resolve/browser.ts` | `ResolvedBrowserScalar` | none | 4 | (a) | demote |
| 30 | `resolve/element-resolve.ts` | `resolveElementAwareValues` | none | 1 | (a) | demote |
| 31 | `svg/morph-geometry.ts` | `fmtNum` | none | 4 | (a) | demote |
| 32 | `waapi/delegation.ts` | `NativeScrollDispatchContext` | none | 1 | (a) | demote |

## §2 — DELETE: fully-dead exports R1-07's census MISSED (3) — same sweep commit

Used **nowhere** in the repo (only the declaration line; verified `grep -rInw` across
`src/ test/ bench/ scripts/`). Same family as DD-1/DD-2 (`isObject`/`cloneInterpSlot`, already
deleted in W4). Demoting-to-private would strand dead code; the honest disposition is deletion.

| # | file | symbol | evidence | verdict | action |
|---|---|---|---|---|---|
| 33 | `internal/helpers.ts` | `debounce` | def line only; the demo's `debounce` resolves to **`@mkbabb/value.js`**, not this | (a-dead) | **delete** |
| 34 | `internal/helpers.ts` | `hyphenToCamelCase` | def line only; the demo's `hyphenToCamelCase` resolves to **`@mkbabb/value.js`**, not this | (a-dead) | **delete** |
| 35 | `resolve/browser.ts` | `convertPixelsToCh` | def line only; no caller anywhere | (a-dead) | **delete** |

## §3 — KEEP (b): module-internal cross-file — NOT flagged, verified barrel-excluded

R1-07 listed these as flat-tree over-exports; the W5 carves turned them into legitimate
module-internal cross-file exports (imported by a sibling inside their module dir). R6 correctly
does **not** flag them. Verified they keep `export` and stay out of the module barrel.

| file (post-W5) | symbol | sibling consumer (evidence) | LT prediction |
|---|---|---|---|
| `compile/value/ast.ts` | `CompileValueOptions` | `compile/value/compile.ts:12,159` (LT-05 split) | LT-05 ✓ |
| `engine/play-lifecycle/transport.ts` | `cancelWAAPI` | `engine/play-lifecycle/strategies.ts:13` (LT-07 carve) | LT-07 ✓ |
| `engine/play-lifecycle/strategies.ts` | `snapToReducedMotion` | `engine/play-lifecycle/frame.ts:14` (LT-07 carve) | LT-07 ✓ |

**LT-07 trio verification (verify, don't redo):** the prompt expected `renderFrame` / `cancelWAAPI`
/ `snapToReducedMotion` to already be handled by W5.b as (b). Verified: `cancelWAAPI` and
`snapToReducedMotion` **are** (b) — kept, barrel-excluded, correct. But `renderFrame` is **(a)**,
not (b): it is used only inside `frame.ts` (lines 144-145 call it; the barrel doc-comment at
`frame.ts:10` calling it "a module-internal cross-file export" is aspirational — no sibling imports
it). So `renderFrame` is demoted here (row 10). This is the one place the W5.b prediction diverged
from ground truth.

---

## §4 — DIVERGENCE FROM R1-07 (>20% — triumvirate-threshold note, PROCEEDING)

**The recomputed set (35) diverges from R1-07's DD-3 list (32) by 9 symbols ≈ 28%**, over the 20%
triumvirate-trigger threshold. Per the wave spec I **note it prominently and proceed**, because
the divergence is **fully explained** by (i) the W5 moves and (ii) R1-07's self-declared
non-exhaustiveness ("Suspected-not-confirmed"; "Treat the list as 'drop export unless a barrel/
test names it'").

**Symmetric difference = 3 dropped + 6 added = 9.**

**Dropped from R1-07 (3) — move-explained, now (b):** `CompileValueOptions` (LT-05 value-ast
split → cross-file), `cancelWAAPI` + `snapToReducedMotion` (LT-07 play-lifecycle carve →
cross-file; LT-07 explicitly predicted this). All three are correct KEEP-(b)s (§3).

**Added over R1-07 (6):**
- `playRAF`, `playViaWAAPI`, `playReducedMotion` (`strategies.ts`) — file-local over-exports the
  flat `play-lifecycle.ts` already carried (only `play` calls them, same file); R1-07 tabulated
  only `renderFrame`/`cancelWAAPI`/`snapToReducedMotion` from that file. **R1-07 non-exhaustive.**
- `debounce`, `hyphenToCamelCase` (`internal/helpers.ts`), `convertPixelsToCh` (`resolve/browser.ts`)
  — three **fully-dead** exports R1-07's dead-code census (which found only `isObject`/
  `cloneInterpSlot`) missed. **R1-07 non-exhaustive on the dead axis.**

None of the 9 divergent items reflect a moved symbol becoming newly leaked, a broken carve, or a
public-surface breach — they are the expected product of an honest recomputation over a
list R1-07 itself flagged as a starting point, not a closed set.

## §5 — Fence safety (verified before any edit)

- **Public-surface disjointness:** the 35 flagged NAMES were set-intersected with the frozen `.` +
  `./engine` d.ts roster (`dist/keyframes.d.ts` + `dist/engine/index.d.ts`, 268 export lines) —
  **intersection empty.** No demotion touches a public export. R6 also cannot flag a public symbol
  by construction (the barrel re-export chain to `index.ts`/`public.ts` is a consumption edge).
- **Demo build safety:** none of the 35 are imported from keyframes `src` by any `demo/` file (the
  only demo hits — `debounce`, `hyphenToCamelCase` — resolve to `@mkbabb/value.js`, a different
  package). Demoting/deleting breaks no demo consumer.
- **`TimingFunction`** (`constants/types.ts:45`, atlas IN-ATLAS-3) is untouched — not in the set.
