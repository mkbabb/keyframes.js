# O.W9 — The no-legacy cuts (deprecated aliases dropped · `leaves.ts` math → value.js `/math`)

**Band:** D — Transposition + no-legacy
**Phase:** NOW (kf-internal; zero sibling publish gate — the renames are breaking, absorbed by the 5.0.0 cut at O.WZ)
**Sequence:** O.W0 (charter) → A{O.W1, O.W2} → **O.W9** (parallel with O.W8 NOW; precedes the GATED O.W7) → O.WZ (the 5.0.0 cut absorbs the breaking renames; `proof:changelog-5.0.0` asserts the set)
**Owning chronic/DM:** the no-legacy mandate (F29 family 4 + 5: the deprecated published-surface aliases + the `internal/leaves.ts` math duplicates) + DM-16 (the 5.0.0 major cut, the honest home for the renames)

M-substrate: this wave has **no single M wave** — it consolidates the no-legacy obligations M
distributed across M.WZ (the 5.0.0 alias drops) and M.W9 (the `leaves.ts`→`/math` consume, which M
gated on a value.js subpath that has SINCE shipped). The O re-audit (F29 §4/§5, E21, G32) found all
three legacy carries live on the 2026-06-19 tree with the unblock fully present:
- the value.js `./math` subpath SHIPPED in value.js 1.0.2 (`dist/subpaths/math.d.ts` exports
  `clamp, scale, lerp, lerpArray` — verified), so the `leaves.ts` math duplicates have **no
  remaining architectural justification** (KISS violation);
- glass-ui BC is NOT a gate for ANY arm here (these are pure kf-owned surface cuts).

This wave is delta-noted against F29's evidence; it does NOT re-author a non-existent M.W body.

---

## Context

The no-legacy / no-workaround mandate explicitly forbids legacy on the published surface and KISS
forbids unjustified duplication. The O re-audit (F29 — "the precept reckoning") names two of the
five live workaround families this wave terminates (the other three — S8/S9 value.js, S1/S2 glass-ui
— are sibling-gated, O.W16/O.W12):

**(4) Legacy on the published surface (F29 §4, G32).** Three `@deprecated` backward-compat aliases
live on the rolled-up `dist/keyframes.d.ts`:
- `engine.ts:1205` — `export { KeyframesAnimation as Animation }` (`@deprecated`, the PKG-3 rename
  L.W8 §S4). **22 demo files** still `import type { Animation }` (verified live 2026-06-19:
  `grep -rln "import type {…Animation…}" demo/` → 22; O.md §2 cites 19, the O re-audit count is 22).
- `timeline.ts:171` — `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions }`
  (`@deprecated`, `timeline.ts:163-171`).
- `timeline.ts:209-218` — the `@deprecated ScrollTimeline` re-export alias (value + type) of
  `KeyframesScrollTimeline` (`timeline.ts:189`).
These are exactly the legacy the no-legacy mandate bans. The 5.0.0 cut (DM-16, the major cut) is the
honest home: the renames are breaking, so they belong in a major bump, not a patch.

**(5) The `internal/leaves.ts` math-duplicate family (F29 §5, E21).** `internal/leaves.ts` carries
local copies of `clamp` (`:23`), `scale` (`:28`), `lerp` (`:46`), and `lerpArray` (`:68-80`),
written value.js-free so the LIGHT engines carry zero static value.js edge. The file's own docstring
(`:56-61`) records the WHY: *"value.js exposes ONLY its barrel export … no tree-shakeable `./math`
subpath — so a static `import { lerpArray } from "@mkbabb/value.js"` here would pull value.js's
CSS-grammar static init into the LIGHT bundle and red `proof:boundary`."* **That premise is now
FALSE.** value.js 1.0.2 ships `@mkbabb/value.js/math` — a parse-that-FREE, CSS-grammar-FREE subpath
exporting exactly `clamp, scale, lerp, lerpArray` (verified: `dist/subpaths/math.d.ts:7`,
`/** parse-that-FREE … zero CSS grammar */`, B7/B8 strength: the subpath split is esbuild-traced
clean of parse-that). So the local duplicates have NO architectural justification — they are KISS
debt held only by a now-stale comment.

The boundary subtlety (the load-bearing constraint). The `leaves.ts` duplicates exist to keep
`proof:boundary` GREEN — a LIGHT module must carry zero static `@mkbabb/value.js` edge. The swap
replaces `export function lerpArray(…)` with `export { lerpArray } from "@mkbabb/value.js/math"`
(and `clamp`/`scale`/`lerp` likewise) — a static value.js SUBPATH specifier. **The wave's invariant
is that `proof:boundary` STILL holds after the swap**: the `./math` subpath must NOT pull the CSS
grammar into the LIGHT bundle. This is verifiable (the subpath is parse-that-free + CSS-grammar-free
by construction) but it MUST be the gate-verified observable, not an assumption — because the whole
reason the duplicates existed was a boundary breach. The **rAF shim stays local** (`requestAnimation
Frame`/`cancelAnimationFrame`, `leaves.ts:87-124`) — it is NOT in the `./math` subpath; only the four
math leaves are swapped.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19) |
|-----|-----------------|----------------------------|
| F29 §4 / G32 | `src/animation/engine.ts:1205` | `export { KeyframesAnimation as Animation }` — `@deprecated` (`:1191-1204`), on the published d.ts |
| F29 §4 | `grep -rln "import type {…Animation…}" demo/` | **22** demo consumers of the deprecated `Animation` type (O re-audit count; O.md §2 cites 19) |
| F29 §4 / G32 | `src/animation/timeline.ts:171` | `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions }` — `@deprecated` (`:163-169`) |
| F29 §4 / G32 | `src/animation/timeline.ts:209-218` | the `@deprecated ScrollTimeline` re-export alias (value + type) of `KeyframesScrollTimeline` (`:189`) |
| F29 §5 / E21 | `src/animation/internal/leaves.ts:23,28,46,68-80` | local `clamp`/`scale`/`lerp`/`lerpArray` duplicates, value.js-free, held by the stale `:56-61` "no `./math` subpath" comment |
| **the unblock** | `node_modules/@mkbabb/value.js/dist/subpaths/math.d.ts:7` | `export { clamp, scale, lerp, lerpArray, … }` — the `./math` subpath SHIPPED (1.0.2), parse-that-FREE + CSS-grammar-FREE (`:1-6` docstring) |
| boundary gate | `scripts/proof-boundary.mjs` | bundles every LIGHT barrel export as its own entry; asserts zero static value.js / `engine.ts` edges per entry — the gate that MUST stay GREEN after the swap |
| `leaves` consumers | `numeric.ts`, `smooth.ts`, `spring-duration.ts`, `playback.ts`, `drag.ts`, `stagger.ts`, `timeline.ts`, `sequence.ts`, `motion-path.ts`, `waapi.ts` | the LIGHT modules that read `leaves.ts` math — their import path is unchanged (they still import from `internal/leaves.ts`, which now RE-EXPORTS from `@mkbabb/value.js/math`) |
| the cut | O.md §2 / §6 (DM-16) | the 5.0.0 major cut is the honest home for the breaking renames; `proof:changelog-5.0.0` (O.WZ) asserts the breaking set |
| F29 rec | `proof:no-deprecated-guard` (router) | the precedent gate shape — a grep over a surface asserting a deprecated form is absent; O.W9 authors the parallel published-surface gate |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they purge the published-surface
legacy and the `leaves.ts` math duplication — every move a no-legacy cut over a now-unblocked
substrate, NONE a workaround.

### S1 — Drop the `@deprecated Animation` alias; migrate the 22 demo consumers to `KeyframesAnimation`

**Breach.** `engine.ts:1205` exports `KeyframesAnimation as Animation` (`@deprecated`); 22 demo
files import the old `Animation` type — the no-legacy mandate bans it.

**Cure.** Delete the `engine.ts:1191-1205` `@deprecated Animation` re-export. Migrate all 22 demo
`import type { Animation }` consumers to `KeyframesAnimation` (the canonical PKG-3 name). The
migration is mechanical (the value + type both resolve to `KeyframesAnimation` today — `instanceof`,
`new`, and the type all carry over unchanged). The break is breaking → absorbed by the 5.0.0 cut
(O.WZ, DM-16).

**Gate bite.** `proof:no-legacy-surface` (NEW, S4) asserts zero `@deprecated` on the published
`dist/keyframes.d.ts`; a companion clause asserts zero `import type { Animation }` from
`@mkbabb/keyframes.js` across `demo/`. Born-RED today (the alias is present + 22 consumers).

### S2 — Drop the `@deprecated ScrollTimeline` / `ScrollTimelineOptions` aliases

**Breach.** `timeline.ts:171` (`ScrollTimelineOptions` alias) and `:209-218` (`ScrollTimeline`
alias) are `@deprecated` re-exports of the PKG-3 `KeyframesScrollTimeline*` names — on the published
surface.

**Cure.** Delete both `@deprecated` re-export blocks. The canonical `KeyframesScrollTimeline` /
`KeyframesScrollTimelineOptions` (the LIGHT static barrel exports) are unchanged; only the legacy
aliases drop. Any demo consumer of the old names migrates to the canonical (the O re-audit found the
demo already imports the canonical names — the aliases are pure published-surface legacy with no
internal consumer). Breaking → 5.0.0 cut.

**Gate bite.** `proof:no-legacy-surface` S4 — the same zero-`@deprecated` published-d.ts clause
catches these two aliases. Born-RED today (both present).

### S3 — Swap `internal/leaves.ts` `clamp`/`scale`/`lerp`/`lerpArray` for `@mkbabb/value.js/math` (verify `proof:boundary` holds)

**Breach.** `leaves.ts:23,28,46,68-80` duplicates `clamp`/`scale`/`lerp`/`lerpArray` from value.js's
`src/math.ts`, held only by the now-stale `:56-61` "no `./math` subpath" comment. value.js 1.0.2
ships the parse-that-free `./math` subpath — the duplicates are KISS debt.

**Cure.** Replace the four local math functions in `leaves.ts` with re-exports from the subpath:
`export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math"`. The LIGHT consumers
(`numeric.ts`, `playback.ts`, `spring-duration.ts`, …) keep importing from `internal/leaves.ts`
unchanged (the file now RE-EXPORTS rather than defines — a single seam, DRY). Delete the stale
`:56-61` comment. **Keep the rAF shim local** (`requestAnimationFrame`/`cancelAnimationFrame`,
`:87-124`) — it is NOT in `./math`; only the four math leaves move.

**Constraint (the boundary invariant — the REAL observable).** The swap introduces a static
`@mkbabb/value.js/math` specifier into a LIGHT module. `proof:boundary` MUST stay GREEN: it bundles
every LIGHT barrel export as its own entry and asserts the `./math` subpath pulls NO CSS grammar /
parse-that / `engine.ts` into the LIGHT bundle. This is the gate-verified observable, NOT an
assumption — the whole reason the duplicates existed was a boundary breach. Verifiable because the
subpath is parse-that-free + CSS-grammar-free by construction (B7/B8 strength), but the wave is DONE
only when `proof:boundary` confirms it on the post-swap bundle.

**Gate bite.** `proof:no-legacy-surface` S4 — a `leaves.ts` clause asserts the four math functions
are RE-EXPORTS from `@mkbabb/value.js/math`, not local definitions (born-RED today: they are local
definitions). The boundary invariant is the `proof:boundary` GREEN check (the acceptance oracle).

### S4 — `proof:no-legacy-surface` born-RED on the published d.ts (the keystone)

**Breach (the gate-first law).** No gate asserts the published surface is `@deprecated`-free; the
three aliases live on `dist/keyframes.d.ts` with no tripwire. F29 names the precept-reckoning
obligation: the no-legacy mandate must be GATED, not hoped.

**Cure (author the born-RED FIRST — before S1–S3).** Author `scripts/proof-no-legacy-surface.mjs`,
mirroring `proof:no-deprecated-guard`'s comment-aware grep idiom over a surface, with clauses:
1. **`d.ts-deprecated-free`** (the KEYSTONE, the REAL observable): build the library
   (`npm run build` → `dist/keyframes.d.ts`), then assert the rolled-up d.ts carries ZERO
   `@deprecated` JSDoc tags. BITE: any `@deprecated` on the published surface → red. This reads the
   ACTUAL built artifact (the API-Extractor roll-up the consumer receives), not the source — so a
   `@deprecated` that survives the roll-up (the real consumer observable) is caught.
2. **`no-Animation-alias`** (source): `engine.ts` carries no `export { KeyframesAnimation as
   Animation }`; `demo/` carries no `import type { Animation }` from `@mkbabb/keyframes.js`
   (comment-aware grep — the PKG-3 canonical `KeyframesAnimation` never triggers it).
3. **`no-scroll-timeline-alias`** (source): `timeline.ts` carries no `@deprecated ScrollTimeline` /
   `ScrollTimelineOptions` re-export.
4. **`leaves-math-from-subpath`** (source): `internal/leaves.ts` `clamp`/`scale`/`lerp`/`lerpArray`
   are RE-EXPORTS from `@mkbabb/value.js/math`, not local definitions.

Wire into `proof:hygiene` (beside `proof:no-deprecated-guard`, `package.json:194`). The keystone
clause (1) is the REAL consumer observable — the published d.ts the npm consumer installs.

**Constraint (observable-truth — the keystone reads the BUILT artifact, not the source).** The proxy
trap is grepping `src/**` for `@deprecated` (a source-shape proxy that a roll-up transform could mask
or that misses a re-export aliased deprecation). The keystone clause builds the library and greps the
rolled-up `dist/keyframes.d.ts` — the EXACT surface the consumer's IDE hover + `import type` resolve
against. A `@deprecated` that survives API-Extractor into the published d.ts is the genuine defect;
the gate bites THAT, not the source intent.

**Gate bite.** `node scripts/proof-no-legacy-surface.mjs` → exit 1 today (the three aliases are on
`dist/keyframes.d.ts`; 22 demo `Animation` imports; the `leaves.ts` math is local). After S1–S3:
every clause greens — the published d.ts is `@deprecated`-free, the demo migrated, the `leaves.ts`
math sourced from the subpath, `proof:boundary` GREEN.

---

## Born-RED gate

**Gate:** `proof:no-legacy-surface` (NEW — `scripts/proof-no-legacy-surface.mjs`; this wave authors
it, gate-first per S4) — born-RED over four clauses, the keystone being `d.ts-deprecated-free` (the
REAL consumer observable: zero `@deprecated` on the published roll-up). The companion acceptance
oracle for S3 is `proof:boundary` STAYING GREEN through the `leaves.ts`→`/math` swap.

**The REAL runtime observable (observable-truth — the genuine defect, measured on the BUILT
artifact, not a source proxy).**

| Clause | Witness on today's (2026-06-19) tree | Failure mode today (the REAL observable) | Expected after the cuts |
|--------|--------------------------------------|------------------------------------------|-------------------------|
| `d.ts-deprecated-free` (**KEYSTONE**) | `npm run build` → grep `@deprecated` in `dist/keyframes.d.ts` | the rolled-up published d.ts carries the three `@deprecated` alias JSDocs — the EXACT surface the npm consumer's IDE + `import type` resolve against | ZERO `@deprecated` on the published roll-up |
| `no-Animation-alias` | `engine.ts:1205` + `grep -rln "import type {…Animation…}" demo/` | the `export { KeyframesAnimation as Animation }` alias + 22 demo consumers | alias dropped, 22 consumers migrated to `KeyframesAnimation` |
| `no-scroll-timeline-alias` | `timeline.ts:171,209-218` | the `@deprecated ScrollTimeline` / `ScrollTimelineOptions` re-exports | both dropped |
| `leaves-math-from-subpath` (+ `proof:boundary`) | `leaves.ts:23,28,46,68-80` (local defs) + `proof:boundary` on the LIGHT bundle | the four math functions are LOCAL duplicates (KISS debt) held by a stale comment | RE-EXPORTS from `@mkbabb/value.js/math`; `proof:boundary` GREEN (the subpath pulls no CSS grammar) |

**How it is born-RED (plant-a-failure).** Today the gate exits 1 with no plant needed — the three
`@deprecated` aliases are present on the published d.ts the instant the library builds, the 22 demo
`Animation` imports are live, and the `leaves.ts` math is local. The keystone clause greps the BUILT
`dist/keyframes.d.ts` (the consumer's actual surface), so it cannot be gamed by a source-only edit
that the roll-up would re-introduce. **Discriminating bite:** a cure that renames the alias in source
but leaves a `@deprecated` re-export that API-Extractor rolls UP into the published d.ts still reds
the keystone — proving the observable is the published surface, not the source.

**Green condition.** The `@deprecated Animation` alias dropped + 22 demo consumers migrated (S1); the
`@deprecated ScrollTimeline`/`ScrollTimelineOptions` aliases dropped (S2); `leaves.ts`
`clamp`/`scale`/`lerp`/`lerpArray` re-exported from `@mkbabb/value.js/math` with `proof:boundary`
GREEN (S3); `proof:no-legacy-surface` four clauses GREEN incl. the `@deprecated`-free published d.ts
(S4). The breaking renames absorbed by the 5.0.0 cut (O.WZ) — `proof:changelog-5.0.0` asserts the set.

---

## Dependencies

- **value.js 1.0.2 (already pinned) — the `./math` subpath SHIPPED; NO sibling publish to land.**
  `@mkbabb/value.js/math` is in the installed surface (`dist/subpaths/math.d.ts:7`, parse-that-free).
  S3's swap consumes it directly. This is the wave's defining fact: every arm is a kf-side surface
  cut over the installed tree — phase NOW, zero sibling gate.
- **O.WZ (the 5.0.0 cut) — the honest home for the breaking renames.** The alias drops (S1/S2) are
  breaking; they belong in the major cut (DM-16). `proof:changelog-5.0.0` (O.WZ, born-RED) asserts
  the breaking set incl. the deprecated `Animation`/`ScrollTimeline` alias drops. O.W9 lands the cuts;
  O.WZ cuts the version that absorbs them — sequenced (O.W9 before O.WZ), the renames recorded in the
  changelog.
- **O.W7 (engine-seam) — Band-D sibling, SEQUENCE-COUPLED, no collision.** O.W7 lifts concern 3 out
  of the `KeyframesAnimation` class body in `engine.ts`; O.W9 deletes the `@deprecated Animation`
  re-export at `engine.ts:1205` (a disjoint region — the alias line, not the class body). **Sequence
  O.W9 (NOW) before O.W7 (GATED)** so the alias line is already gone when O.W7 moves the class body —
  they compose cleanly (O.W7 reads a class with no trailing deprecated alias).
- **O.W8 (perf) — Band-D sibling, no collision.** O.W8's S8 hoists a DOM-write `out` buffer in
  `engine.ts`; O.W9 touches `engine.ts:1205` (the alias) + `timeline.ts` + `leaves.ts`. Disjoint.
- **Independent of every glass-ui BC / value.js-P gate.** This is the ONLY no-legacy wave that fires
  entirely on today's installed tree — no S1/S2 (glass-ui), no S8/S9 (value.js) coupling. (The
  `leaves.ts` math swap is sometimes conflated with the value.js consume band; it is NOT gated on
  VJ-L1/L3 — the `./math` subpath already shipped, distinct from the un-shipped flatLeaf/
  parseCSSSubValue.)

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W9 — DOCS ONLY (inv-16: kf writes only
keyframes.js; no cross-repo edit — the `./math` subpath is CONSUMED, value.js owns it). The
IMPLEMENTATION (the three alias drops, the 22-consumer migration, the `leaves.ts`→`/math` swap, the
`proof:no-legacy-surface` gate authoring) opens ONLY on the owner's explicit authorization. Phase NOW:
zero sibling publish gates the landing — the `./math` subpath shipped, the renames are kf-owned. The
breaking renames are absorbed by the 5.0.0 cut at O.WZ (the honest major home). Gate-first, born-RED,
observable-truth (the keystone reads the BUILT published d.ts, not the source), no-legacy, KISS,
gestalt throughout. The born-RED witness (the three `@deprecated` aliases on the published d.ts, the
22 demo `Animation` imports, the local `leaves.ts` math) stands on today's tree; the cure opens on
authorization.
