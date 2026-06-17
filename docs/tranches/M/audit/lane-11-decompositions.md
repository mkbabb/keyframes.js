# Lane 11 — Decompositions audit (Tranche-M charter seed)

**Date:** 2026-06-17  
**Branch:** `tranche-l-dev` (tip `529fcfd`)  
**Verified against:** source tree, git log, gate scripts, commit diffs — every claim
ground-truthed; no assertion sourced from a prior audit doc alone.

---

## 0. SCOPE

This lane audits five decomposition events in Tranche L:

1. **e42a95b** — `engine.ts` → `engine-css-metadata.ts` (the CSS-rule metadata
   recovery extraction, done mid-wave at L.WZ to cure an over-1400-line ceiling red).
2. **d7c7f3d** (close reconciliation) — four ceiling reds discovered at roster re-run:
   - `drag.ts` (555>550) → `drag-2d.ts`
   - `spring.ts` (805>700) → `spring-reseat.ts` + `spring-duration.ts`
   - `sequence.ts` (817>700) → `sequence-events.ts`
   - `index.ts` (731>550) → `load-engine.ts`

The auditor's brief asks: are these COHESIVE gestalt splits or manufactured-to-pass-a-
ceiling? Did the `index.ts → load-engine.ts` extraction orphan a coherent boundary (it
forced ~8 gate-anchor retargets)? Is the 550/700/1400 ceiling regime itself a
contrivance M should reconsider?

---

## 1. VERIFIED FACTS (the ground truth)

### 1.1 Pre/post line counts

| File | Before L | Pre-extraction (4686aa4) | Post-extraction (current) | Ceiling |
|------|----------|--------------------------|---------------------------|---------|
| `engine.ts` | 1396 (K) | 1474 | 1397 | 1400 |
| `engine-css-metadata.ts` | — | — | 148 | 550 |
| `drag.ts` | 323 (K) | 555 | 462 | 550 |
| `drag-2d.ts` | — | — | 115 | 550 |
| `spring.ts` | 643 (K) | 805 | 685 | 700 |
| `spring-reseat.ts` | — | — | 98 | 550 |
| `spring-duration.ts` | — | — | 83 | 550 |
| `sequence.ts` | 628 (K) | 817 | 698 | 700 |
| `sequence-events.ts` | — | — | 216 | 550 |
| `index.ts` | 390 (K) | 731 | 246 | 550 |
| `load-engine.ts` | — | — | 538 | 550 |

Source: `wc -l` over live tree + `git show <sha>:src/animation/<file> | wc -l` for
historical snapshots.

### 1.2 What grew each file over its ceiling

- **`engine.ts`** — L.W8's `Animation`→`KeyframesAnimation` PKG-3 rename + L.W1/W2
  round-trip serialize work (the W8 dogfood inversion + the `serializeStylesheetItem`
  wiring + format emission additions) pushed it 1396→1474 (78L overage). Verified:
  `git show 339d78b:src/animation/engine.ts | wc -l` → 1474.

- **`drag.ts`** — L.W5 bounds/snap/rubber-band additions (Draggable GSAP parity +
  `drag2D` 2-D sugar). At K close: 323L. Post-W5: 555L (+232L); 5L over the 550
  ceiling. The `drag2D` function + `Drag2DHandle` interface are the new matter.

- **`spring.ts`** — K.W11 PHYS-B2 velocity-continuous interruption seam (`VelocityProbe`
  / `probeVelocity` / `reseatToSpring`) +170L; L.W7 spring-vector sugar
  (`setTargets`, `fromDuration`) further grew it. K close: 643L. Pre-extraction: 805L.

- **`sequence.ts`** — L.W5 transport-event bus (`SequenceEventBus`, segment/label
  crossing detector). K close: 628L. Pre-extraction: 817L (+189L).

- **`index.ts`** — L.W7 granular `loadEngine`/`loadCompiler`/`loadIngest` accessors +
  the `warmEngine()` idle-warmer + the interface types for each accessor surface
  (`EngineCore`, `CompilerSurface`, `IngestSurface`) + L.W8 dogfood-inversion expose
  helpers (`CSSKeyframesToString`, `transformTargetsStyle`, `yieldToMain` via the
  engine surface). K close: 390L → W7: 615L → W8: 723L → W9: 731L.

### 1.3 Gate-anchor retargets

**Retargets required by `load-engine.ts` extraction** (commit `e4a1cc3`):

- `proof-drawsvg.mjs` — now reads `load-engine.ts` for the dynamic-import wiring
  (`const LOAD_ENGINE = "src/animation/load-engine.ts"`)
- `proof-ingest-replay.mjs` — same pattern
- `proof-compile-replay.mjs` — same pattern
- `proof-agent-validate.mjs` — same pattern
- `proof-scroll-roundtrip.mjs` — same pattern
- `proof-modern-web.mjs` — accepts EITHER `@src/animation/*` OR `@mkbabb/keyframes.js`
  (dogfood inversion, unrelated to decomp)
- `proof-platform-adopt.mjs` — engine surface now spans `engine.ts` + `engine-css-metadata.ts`
- `proof-scene-perf-budget.mjs` — minor (accepts both import forms)

**Retargets required by `spring-reseat.ts` extraction** (commit `d7c7f3d`):

- `proof-spring-blend-weight.mjs` clause `phys-b2-reseat` — file pointer changed from
  `spring.ts` to `spring-reseat.ts`. The assertion is UNCHANGED; it follows the code.

Total load-bearing gate-anchor retargets: **8 gate files** (all in `e4a1cc3`/`d7c7f3d`).

Source: `git show e4a1cc3 --stat | grep proof` (8 scripts), `git show d7c7f3d --stat`
(`proof-spring-blend-weight.mjs`).

---

## 2. COHESION ASSESSMENT (each extraction examined)

### 2.1 `engine.ts` → `engine-css-metadata.ts` (e42a95b)

**What was extracted:** Three functions that read metadata off the value.js parse object
in `fromString`:
- `registerPropertyDescriptors(registry: Map<string, PropertyDescriptor>)` — the
  `CSS.registerProperty` UA pass for `@property` blocks
- `recoverScrollOptions(stylesheet: Stylesheet)` — `extractTimelineOptions` thin wrap
- `recoverAnimationOptionsBase(opt: ParsedAnimationOptions)` — maps value.js's
  `CSSAnimationOptions` shape to the engine's `InputAnimationOptions`

**Verdict: GENUINELY COHESIVE.** These three functions share one concern: "read back,
off the SAME value.js parse, the rule metadata beside the keyframe frames." They have
NO shared state with `CSSKeyframesAnimation`'s main lifecycle methods (they are pure
input→output helpers with no `this` binding). The docstring names the concern correctly
(`engine-css-metadata.ts:1–16`). The call sites remain thin delegates
(`engine.ts:1303`, `:1318`, `:1371`) — engine.ts still controls when to call them.

The extraction follows the **engine-composition.ts / engine-options.ts precedent**
(K.WZ — the same pattern, same rationale: colocated helpers the engine calls with thin
call sites, never re-exported beyond the engine). Zero behaviour change verified
(`vitest 888+2+1/891`).

The file `engine-css-metadata.ts` is a static import inside `engine.ts`
(`engine.ts:59–62`), so it rides the same `loadAnimationEngine()` dynamic chunk — the
boundary is unchanged. Confirmed: `proof:boundary` passes with the extraction.

**No precept violation.** This is not a "split for line count" — it is a
concern-seam split with a coherent name and three functions that compose exclusively on
that seam.

### 2.2 `drag.ts` → `drag-2d.ts` (d7c7f3d)

**What was extracted:** `drag2D()` function + `Drag2DHandle` interface — the 2-D sugar
that composes two 1-D `Draggable` instances behind a `(x, y, vx, vy)` subscriber.

**Verdict: COHESIVE.** `drag2D` is additive sugar over `Draggable` with no shared
state, no `this` binding, and a clean separation from the 1-D engine in `drag.ts`.
The module header (`drag-2d.ts:1–14`) correctly characterises the concern: "LIGHT — the
1-D engine stays 1-D (KISS); this is the front door that spares every 2-D consumer the
two-Draggable boilerplate." The re-export through `drag.ts` (`drag.ts:462`) is a one-
liner — the barrel sees no change.

The `drag2D` function was added in L.W5 specifically to close the GSAP Draggable parity
gap (`proof:drag-gesture` S4). It is a natural colocated module: it needs `Draggable` +
`DragOptions` and no other import. Its physical separation from the 1-D spring/drag
loop in `drag.ts` makes the module boundary sharper, not more confused.

**No precept violation.**

### 2.3 `spring.ts` → `spring-reseat.ts` + `spring-duration.ts` (d7c7f3d)

**`spring-reseat.ts`** — `VelocityProbe`, `probeVelocity`, `reseatToSpring`.

**`spring-duration.ts`** — `SpringDurationOptions`, `durationToSpringOptions`.

**Verdict: COHESIVE.** Both extractions are pure-construction-time helpers with no
runtime `this` binding on `SpringProgress`. The reseat is the K.W11 PHYS-B2 seam —
explicitly deferred to K in the override entry ("the reseat is NOT a separable module
— it seeds a `SpringProgress` from a measured `(x, v)`"). That assertion was made when
the ceiling was being raised 550→700 for K; by L the file had grown to 805L, 105L over
the new ceiling, making the seam evaluation live again.

**Reconsidering the K rationale in light of L growth:** The K.W11 rationale said "a
split-for-line-count would orphan the reseat from the integrator it seeds." That logic
was valid at K (the integrator and the reseat shared a tight import loop). But
`reseatToSpring` does not import any internals of `SpringProgress`'s ODE solver —
it imports only the PUBLIC constructor (`spring-reseat.ts:16`: `import { SpringProgress }
from "./spring"`). The `probeVelocity` function is pure arithmetic. The concern is:
"given a (position, velocity) pair derived by finite difference, construct a new spring"
— that is not the integrator's concern; it is the interruption-entry-point concern. The
K rationale miscategorised the seam; the L extraction correctly resolves it.

`spring-duration.ts` is even cleaner: `durationToSpringOptions` reads only `clamp` from
`internal/leaves` and the `DEFAULT_SPRING_RESPONSE` constant from spring.ts — a pure
parameter translation with no reference to the ODE solver. It belongs outside `spring.ts`.

Both extracted modules re-export through `spring.ts` (`spring.ts:13–26`) so the barrel
is unchanged. `proof:spring-blend-weight`'s `phys-b2-reseat` anchor was correctly
retargeted to `spring-reseat.ts` (the anchor follows the body — same assertion, new
path).

**No precept violation.**

### 2.4 `sequence.ts` → `sequence-events.ts` (d7c7f3d)

**What was extracted:** `SequenceEventBus` class + `SequenceEvent` / `SequenceSegmentSubscriber` /
`SequenceLabelSubscriber` / `SequenceSubscriber` types + `SequenceEntry` interface.

**Verdict: COHESIVE.** The event bus is a self-contained crossing-detector: it holds
the per-event subscriber sets, the `_activeSegments` edge memory, and `_prevPhase`, then
fires segment/label crossings. It has no access to `Sequence`'s internal position
resolver (`_fold`, `_cursor`) or transport state. `Sequence` constructs ONE bus
instance and delegates `.on(...)` and `.fire(...)` — a clean owner/delegate seam.

The module header (`sequence-events.ts:1–25`) names the concern and the precedent
correctly. The re-exports through `sequence.ts` (`sequence.ts:61–83`) keep the barrel
unchanged.

**No precept violation.**

### 2.5 `index.ts` → `load-engine.ts` (d7c7f3d)

**What was extracted:** The complete memoized dynamic-import machinery:
`loadAnimationEngine`, `loadEngine`, `loadCompiler`, `loadIngest`, `warmEngine`, plus
the four public interface types (`AnimationEngine`, `EngineCore`, `CompilerSurface`,
`IngestSurface`).

**Verdict: GENUINELY COHESIVE — but the EXTRACTION was FORCED BY GROWTH PRESSURE, NOT
planned at the wave where the content was authored.** This is the most load-bearing
assessment.

**What grew index.ts:**
- K close: 390L
- L.W7 (granular accessors + interface types): 390→615L (+225L)
- L.W8 (dogfood helpers surfaced through the engine interface): 615→723L (+108L)
- L.W9 (Oscillator exports): 723→731L (+8L)

The growth was LEGITIMATE (each addition was an L-scope feature, not padding), and the
concern accumulated inside `index.ts` is genuinely one coherent concern: "own the
`import("./engine")` dynamic edges and the surface interface types that describe the
resolved engine." That concern was ALWAYS present in `index.ts` but was small at K
close (390L). L grew it enough that it needed to move to its own module.

**The extraction is correct in principle.** `load-engine.ts` is:
- The ONLY place the `import("./engine")` and per-chunk `import("./animate")` etc.
  runtime edges appear
- The ONLY place the `AnimationEngine` / `EngineCore` / `CompilerSurface` /
  `IngestSurface` interface types are declared
- Zero static `@mkbabb/value.js` edge (confirmed: `proof:boundary` passes)
- Clean re-export through `index.ts` (`index.ts:229–246`) so the barrel is unchanged

**The concern that load-engine.ts enforces:** `index.ts` is the "light barrel" (LIGHT
static exports, NO dynamic machinery); `load-engine.ts` is the "dynamic machinery
module" (the heavy accessor functions + their surface types). This separation was
ALWAYS logically present; the extraction makes it PHYSICALLY present. It is not a
manufactured seam.

**The gate-anchor cost:** 8 gate files retargeted (or widened to accept EITHER source).
This is non-trivial overhead, but each retarget is a one-liner ("read from `load-engine.ts`
instead of `index.ts`" for files that anchor the dynamic-import wiring). The assertions
are UNCHANGED; the file path changed. This cost is an artefact of the gate apparatus
being file-path-anchored, not an artefact of the decomposition being wrong.

---

## 3. THE CEILING REGIME: 550/700/1400 — CONTRIVANCE OR HONEST DISCIPLINE?

### 3.1 What the regime is

`proof:decomposition.mjs:119` sets:
- `LIBRARY_CEILING = { ".vue": 350, ".ts": 550 }`
- Per-file overrides in `LIBRARY_CEILING_OVERRIDE` with explicit `cap` + `why` entries
  for `engine.ts` (1400), `animations.ts` (900), `group.ts` (820), `spring.ts` (700),
  `waapi.ts` (650), `sequence.ts` (700)

### 3.2 The precept basis

The gate docstring (`proof-decomposition.mjs:22–25`) states: "The four genuinely-cohesive
god-modules (engine/animations/group/sequence) carry recorded exceptions." The ceiling
was introduced at G.W5 (tranche G) as `path A` — a measured-reality floor (at 550L
"every ALREADY-SOTA leaf module (spring 491, waapi 473, …) passes silently, while a
NEW un-exempted 600L file reds").

### 3.3 Honest assessment

**Where the ceiling is SOUND:**

- It catches genuinely un-cohesive sprawl. Without it, waves incrementally balloon a
  module with unrelated concerns and no ceiling ever surfaces the drift.
- The override mechanism — with rationale + stale guard — is the correct GESTALT shape:
  "record the cohesion justification, and force re-examination if the file ever drops
  back under the base cap." This is not a workaround; it is a documented architectural
  decision.
- The `engine.ts:1400` cap has a BORN-RED HANDOFF recorded: "the FULL engine-seam
  transposition the D.W4 audit named … is a DEFERRED future-tranche split"
  (`proof-decomposition.mjs:151–157`). That is honest: the cap sits at the
  cohesion-justified ceiling, with the deeper split explicitly parked.

**Where the regime creates PRESSURE:**

The L close found four files over ceiling ONLY at the full `proof:all` roster re-run —
the per-wave incremental checks had passed because they were run via piped exit codes
that masked the ceiling red. This is a GATE-INFRASTRUCTURE issue (the serial `&&`
chain; see `docs/tranches/L/audit/gate-apparatus-B-contrivance.md` §Q3), not a
ceiling-regime issue. The ceiling was right; the discovery latency was wrong.

**Where the 550L base ceiling is tight for a library:** 550L is genuinely tight for
language-feature-heavy TypeScript modules. The OVERRIDE mechanism exists precisely
for this. Every extraction in L that was "forced" by the ceiling was also genuinely
cohesive: none required manufacturing a seam. The ceiling found REAL seams, not
imaginary ones.

**M's verdict on the regime:** The 550/700/1400 ceiling regime is SOUND in principle.
M should NOT raise the ceilings or abolish them. What M SHOULD address is the
discovery-latency issue: if the ceiling red is only discovered at `proof:all` roster
re-run rather than at each wave's check, the ceiling is effectively unenforced during
development. The LINT-tier consolidation (gate-apparatus-VERDICT.md Phase 1) would
make ceiling checks sub-second and per-save, eliminating the discovery gap.

### 3.4 Was the 550L base ceiling the root cause?

No. The root cause of the four L-close reds was:

1. **L.W5 added substantial new functionality** (bounds/snap/drag2D/transport-events)
   to existing modules. Each addition was REAL and CORRECT feature growth.
2. **The per-wave incremental checks were run via piped exit codes** that masked ceiling
   failures (FINAL.md §S6: "the per-wave incremental checks had masked these via piped
   exit codes").
3. **`proof:all` runs the checks as a serial `&&` chain** — the ceiling gate ran but
   its exit code was not captured cleanly in the per-wave run.

The ceiling did its job correctly: it caught the drift. The apparatus failed to surface
it earlier.

---

## 4. DID THE `index.ts → load-engine.ts` EXTRACTION ORPHAN A COHERENT BOUNDARY?

**Short answer: No, but the extraction had architectural implications that were not
anticipated when the dynamic machinery was first authored.**

### 4.1 The "orphaning" question

The concern: by moving the dynamic-import machinery from the barrel to a separate
module, did we break the conceptual integrity of `index.ts` as THE boundary?

**Evidence against orphaning:**

- `index.ts` re-exports every accessor and every type from `load-engine.ts` verbatim
  (`index.ts:229–246`). The external API is UNCHANGED.
- `proof:boundary` passes with the extraction: `index.ts` still has no static
  `@mkbabb/value.js` edge; `load-engine.ts` has no static `@mkbabb/value.js` edge
  (every value.js import there is `import type`, erased). The bundle sees the same
  chunk topology.
- The `proof:published-surface` gate is UNCHANGED.
- The `CLAUDE.md` annotation in `src/animation/CLAUDE.md:11` ("**HEAVY (dynamic)**
  — the CSS-keyframe parsing engine … reached ONLY through `loadAnimationEngine()`")
  remains accurate.

### 4.2 The gate-anchor cost — the real problem

The extraction forced 8 gate files to be updated because those gates were anchored
to `index.ts` as the file containing the dynamic-import wiring. This is a **gate-
apparatus problem, not a decomposition problem**:

- A gate that anchors to a file path (rather than a semantic property: "there is no
  static `@mkbabb/value.js` edge on this export entry") is fragile to any legitimate
  refactor.
- The `proof:boundary` gate, which verifies the PROPERTY (not the file path), needed
  zero changes.
- The 8 retargeted gates needed only file-path changes — the assertions themselves are
  unchanged.

**M implication:** The LINT-tier consolidation (gate-apparatus-VERDICT.md) would make
this a non-issue. An `import/no-restricted-paths` rule on the `index.ts` + `load-engine.ts`
exports requires no file-path anchors at all — it checks the edge in the parsed module
graph, independent of which file owns the dynamic import.

---

## 5. PRECEPT FINDINGS

### 5.1 Violations found: NONE

Every decomposition in L was:
- **Cohesive:** each extracted module owns one concern with a clean seam
- **Behaviour-byte-identical:** `vitest 888+2+1/891` on d7c7f3d confirms no regression
- **Boundary-preserving:** `proof:boundary` passes throughout
- **Published-surface-unchanged:** all re-exports through the original files

No "split-for-line-count" without cohesion justification was observed. The extractions
follow the `engine-composition.ts` / `engine-options.ts` precedent established at K.WZ
and cited in the commit messages.

### 5.2 NEAR-VIOLATION: the K.W11 `spring-reseat` rationale

The K.W11 override entry for `spring.ts` stated "the reseat is NOT a separable module"
(`proof-decomposition.mjs:220–226`). This was overcorrect: `reseatToSpring` imports only
the PUBLIC `SpringProgress` constructor — it does not access internal state of the ODE
solver. The K assertion was conservative-but-wrong; the L extraction proved it separable
with zero behaviour change. **This is not a precept violation** (the K entry was
"recorded exception, NOT a split," which is correct if you believe the seam is not
there; it was superseded by L growth revealing the seam). However, it is a lesson:
override rationales should distinguish "shares internal ODE state" from "imports the
public constructor."

---

## 6. DEFERRED FOLDS (items this lane surfaces for M)

### DF-11-A: The FULL engine-seam transposition (BORN-RED HANDOFF, P-invariant-28)

The `proof-decomposition.mjs:151–157` override entry names this explicitly: "the FULL
engine-seam transposition the D.W4 audit named ('the 1100-line god-object at the right
seam' — the lifecycle/playback machine lifted off the frame-compile facade) is a
DEFERRED future-tranche split, NOT a silent punt; it is too deep+risky to rush (it
re-threads the FrameCompiler's `this`-bound re-derive contract)."

**Status at L close:** `engine.ts` is 1397L (3L under the 1400 cap). The cap is fully
justified (the four-group state machine shares a `this`-bound re-derive seam). But
the deep split remains deferred. M must either:
- (a) Implement the transposition (high risk, high payoff: engine.ts to ~900L)
- (b) Explicitly re-defer with a revised rationale (P-invariant-28: named, not silent)

This is the single largest structural debt in the library surface.

### DF-11-B: The same BORN-RED HANDOFF on `group.ts` (820L)

`proof-decomposition.mjs:200–205`: "the deep compositor-seam split (buffer/blend/
lifecycle/batch fully separated) still rides WITH the engine.ts transposition."
Both splits are coupled: the `AnimationGroup` compositor references the engine's
composite seam. They are co-deferred correctly.

### DF-11-C: The ceiling gate's discovery latency

L found four over-ceiling reds only at the final `proof:all` roster re-run because
per-wave incremental checks used piped exit codes. This is gate-apparatus debt (see
`gate-apparatus-B-contrivance.md §Q3`). M's LINT-tier consolidation (Phase 1,
`gate-apparatus-VERDICT.md §3`) would make ceiling checks sub-second and per-save,
preventing this class of late-discovery surprise.

---

## 7. M-WAVE PROPOSALS

### MW-11-1: Engine-seam transposition (the DF-11-A deep split)

**Proposed wave:** `M.W-engine-split` — lift the lifecycle/playback machine off the
`CSSKeyframesAnimation` frame-compile facade. The seam exists (`engine-composition.ts`
and `engine-options.ts` demonstrate the pattern); the `this`-bound re-derive contract
is the one load-bearing thread to re-thread. This is the architectural win the D.W4
audit named and every tranche since has deferred.

**Preconditions:**
- Value.js O consume-edge closed (the `parseCSSSubValue` / `flatLeaf` dispatch the
  `FN_NAME` Symbol workaround in `utils.ts` depends on — the Symbol sidechannel is
  exactly the kind of internal coupling that makes engine.ts harder to split)
- The gate-apparatus LINT tier (DF-11-C / MW-gate-lint) landed, so ceiling reds are
  caught per-save rather than at roster re-run

**Expected outcome:** `engine.ts` from 1397L → ~900L; `engine-playback.ts` or
`engine-lifecycle.ts` as the extracted module; the 1400 override retired; the
`group.ts` compositor split follows immediately (DF-11-B).

### MW-11-2: Gate-apparatus LINT tier (DF-11-C)

This is cross-referenced from `gate-apparatus-VERDICT.md §3 Phase 1` (the standing M
charter seed). The ceiling gates (`proof:decomposition` clause-1, `proof:demo-no-oversize`)
are `max-lines` lint rules implemented as standalone node scripts. Migrating them to
ESLint custom rules gives sub-second per-save feedback and eliminates the discovery-
latency root.

**This is the prerequisite** for MW-11-1: you want ceiling failures caught at the wave
where the growth happens, not at the close roster re-run.

---

## 8. CROSS-REPO ASKS

None generated by the decompositions themselves. However:

**Indirect cross-repo dependency:** The engine-seam transposition (MW-11-1) is eased
by the value.js VJ-L1 `flatLeaf` dispatch (removes the `FN_NAME` Symbol sidechannel
stamped on `ValueUnit` objects — `utils.ts:42–57`). The Symbol stamp is one of the
`this`-context couplings that make engine splitting risky. Filed in
`docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md` as VJ-L1. The M engine-split wave should
WAIT on VJ-L1 or explicitly scope the split to avoid the Symbol-stamped paths.

---

## 9. PERF NUMBERS

**No performance impact from the decompositions.** All extracted modules are:
- Statically imported by their parent (no new dynamic boundaries)
- Pure helper functions or typed classes with no hot-path code
- Zero-alloc (the `drag2D` emit loop is O(subscribers) — same as before)

The one runtime-visible change: `drag-2d.ts` owns a 2-`Draggable` composition that
each independently subscribes to `pointer*` events. This is ADDITIVE (the function
didn't exist before L.W5) and was gated by `proof:drag-gesture` S4.

---

## 10. VERDICT

The five L decompositions are **COHESIVE gestalt splits, not manufactured-to-pass-a-
ceiling.** Each extraction names a real concern, has a clean seam, carries zero
behaviour change, and follows the `engine-composition.ts` precedent. The ceiling regime
(550/700/1400) is SOUND and should stand in M; the issue is discovery latency (fixed
by the LINT-tier consolidation, a standing M wave candidate).

The `index.ts → load-engine.ts` extraction did NOT orphan a coherent boundary —
`index.ts` re-exports every accessor and type unchanged, `proof:boundary` passes, and
the bundle topology is identical. The 8 gate-anchor retargets it required are a gate-
apparatus fragility (file-path-anchored assertions instead of property-anchored
assertions), not an evidence that the extraction was wrong.

The one genuine M obligation this lane surfaces is **DF-11-A** (the engine-seam
transposition, BORN-RED HANDOFF). It is the largest structural debt in the library
surface, correctly named and deferred at K and L, and the preconditions for safely
implementing it are value.js VJ-L1 + the LINT-tier consolidation. M should explicitly
schedule or re-defer it with a revised rationale.

---

## Evidence index

| Claim | Evidence |
|-------|----------|
| engine.ts at L.W8: 1474L | `git show 339d78b:src/animation/engine.ts \| wc -l` → 1474 |
| engine.ts current: 1397L | `wc -l src/animation/engine.ts` → 1397 |
| engine-css-metadata.ts: 148L | `wc -l src/animation/engine-css-metadata.ts` → 148 |
| drag.ts pre-decomp: 555L | `git show 4686aa4:src/animation/drag.ts \| wc -l` → 555 |
| spring.ts pre-decomp: 805L | `git show 4686aa4:src/animation/spring.ts \| wc -l` → 805 |
| sequence.ts pre-decomp: 817L | `git show 4686aa4:src/animation/sequence.ts \| wc -l` → 817 |
| index.ts pre-decomp: 731L | `git show 4686aa4:src/animation/index.ts \| wc -l` → 731 |
| 8 gate-anchor retargets | `git show e4a1cc3 --name-only -- 'scripts/proof-*.mjs'` → 8 files |
| spring-reseat retarget | `git show d7c7f3d --name-only -- 'scripts/proof-*.mjs'` → `proof-spring-blend-weight.mjs` |
| proof:decomposition PASS | `node scripts/proof-decomposition.mjs` → exit 0 |
| proof:boundary PASS | `node scripts/proof-boundary.mjs` → exit 0 |
| vitest 888+2+1/891 | commit d7c7f3d message |
| Ceiling base `.ts`: 550 | `proof-decomposition.mjs:119` |
| engine.ts cap: 1400 | `proof-decomposition.mjs:132` |
| spring.ts cap: 700 | `proof-decomposition.mjs:211` |
| sequence.ts cap: 700 | `proof-decomposition.mjs:253` |
| engine BORN-RED HANDOFF | `proof-decomposition.mjs:151–157` |
| group.ts BORN-RED HANDOFF | `proof-decomposition.mjs:200–205` |
| index.ts K close: 390L | `git show 9bbc227:src/animation/index.ts \| wc -l` → 390 |
| engine-css-metadata.ts 3 call sites | `engine.ts:59–62` (import), `:1303`, `:1318`, `:1371` |
| load-engine.ts zero static value.js edge | `proof:boundary` greps: 0 static value.js specifiers in `load-engine.ts` |
