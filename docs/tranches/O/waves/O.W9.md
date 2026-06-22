# O.W9 — The no-legacy cuts (deprecated aliases dropped · `leaves.ts` math RE-SCOPED to P.W10)

**Band:** D — Transposition + no-legacy
**Phase:** NOW (kf-internal; zero sibling publish gate — the renames are breaking, absorbed by the 5.0.0 cut at O.WZ)
**Sequence:** O.W0 (charter) → A{O.W1, O.W2} → **O.W9** (parallel with O.W8 NOW; precedes the GATED O.W7) → O.WZ (the 5.0.0 cut absorbs the breaking renames; `proof:changelog-5.0.0` asserts the set)
**Owning chronic/DM:** the no-legacy mandate (F29 family 4 + 5: the deprecated published-surface aliases + the `internal/leaves.ts` math duplicates) + DM-16 (the 5.0.0 major cut, the honest home for the renames)

M-substrate: this wave has **no single M wave** — it consolidates the no-legacy obligations M
distributed across M.WZ (the 5.0.0 alias drops) and M.W9 (the `leaves.ts`→`/math` consume). The O
re-audit (F29 §4/§5, E21, G32) found the legacy carries live on the 2026-06-19 tree:
- the published-surface `@deprecated` aliases (S1/S2) are pure kf-owned cuts, fully present and
  unblocked;
- the `leaves.ts` math swap (former §S3) is **RE-SCOPED OUT and DEFERRED to P.W10** — the full-loop
  proved the naive `@mkbabb/value.js/math` re-export WOULD RED `proof:boundary` (the gate regex
  matches the subpath specifier), so the leaves are STRUCTURALLY FORCED, not legacy; P.W10 owns the
  externalization-trap resolution (Arm A externalize / Arm B documented-keep,
  `leaves-externalization-decision.json`);
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

**(5) The `internal/leaves.ts` math-duplicate family (F29 §5, E21) — RE-SCOPED OUT of O.W9, DEFERRED
to P.W10 (full-loop, ledger line 589).** `internal/leaves.ts` carries local copies of `clamp`
(`:23`), `scale` (`:28`), `lerp` (`:46`), and `lerpArray` (`:68-80`), written value.js-free so the
LIGHT engines carry zero static value.js edge. The file's docstring (`:56-61`) records part of the
WHY: *"value.js exposes ONLY its barrel export … no tree-shakeable `./math` subpath."* That SPECIFIC
clause is now stale — value.js 1.0.2 DOES ship `@mkbabb/value.js/math` (`dist/subpaths/math.d.ts:7`,
parse-that-FREE + CSS-grammar-FREE by construction).

> **THE TRAP (full-loop RE-SCOPE, ledger line 581-589).** O.W9's original §S3 read this as pure
> KISS debt — "swap the local defs for `export { … } from "@mkbabb/value.js/math"`, just verify
> `proof:boundary` holds." **That is FALSIFIED.** RAN the `proof:boundary` spec regex
> `@mkbabb\/value\.js(?:\/[^"']*)?` in node: it **MATCHES `@mkbabb/value.js/math`** → the naive
> re-export WOULD RED `proof:boundary` assertion 4. So the leaves are **STRUCTURALLY FORCED, not
> legacy** — the boundary gate bans EVEN the subpath specifier in a LIGHT source module, regardless
> of whether the subpath is grammar-clean. The operative rationale of the comment is still TRUE (a
> LIGHT module must carry zero static `@mkbabb/value.js*` edge); only the "no `./math` subpath"
> sub-clause is stale. **P.W10 already correctly transposes this** into a gate-verified resolution:
> Arm A (bundle-externalize `@mkbabb/value.js/math` via a `vite.config.ts` external-widen + the W97
> `math-subpath-clean` graph-clean gate + the H4 rolldown external smoke-test) OR Arm B
> (documented-keep with a corrected comment), verdict recorded in
> `scripts/leaves-externalization-decision.json`. **O.W9 references P.W10's resolution; it does NOT
> carry the leaves cut.** The ONLY true O.W9-side action on `leaves.ts` is correcting the stale "no
> `./math` subpath" sub-clause to cite the real gate-forced rationale (the duplication is not legacy
> when the boundary gate bans even the subpath specifier in LIGHT source). The **rAF shim stays
> local** (`requestAnimationFrame`/`cancelAnimationFrame`, `leaves.ts:87-124`) regardless of which
> arm P.W10 picks.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19) |
|-----|-----------------|----------------------------|
| F29 §4 / G32 | `src/animation/engine.ts:1205` | `export { KeyframesAnimation as Animation }` — `@deprecated` (`:1191-1204`), on the published d.ts |
| F29 §4 | `grep -rln "import type {…Animation…}" demo/` | **22** demo consumers of the deprecated `Animation` type (O re-audit count; O.md §2 cites 19) |
| F29 §4 / G32 | `src/animation/timeline.ts:171` | `export { type KeyframesScrollTimelineOptions as ScrollTimelineOptions }` — `@deprecated` (`:163-169`) |
| F29 §4 / G32 | `src/animation/timeline.ts:209-218` | the `@deprecated ScrollTimeline` re-export alias (value + type) of `KeyframesScrollTimeline` (`:189`) |
| F29 §5 / E21 — **RE-SCOPED to P.W10** | `src/animation/internal/leaves.ts:23,28,46,68-80` | local `clamp`/`scale`/`lerp`/`lerpArray` duplicates; the `:56-61` "no `./math` subpath" sub-clause is stale, BUT the leaves are STRUCTURALLY FORCED (the swap reds `proof:boundary` — the regex matches `@mkbabb/value.js/math`). O.W9's only action: correct the comment. The swap is P.W10's. |
| **the TRAP (full-loop)** | `scripts/proof-boundary.mjs` regex `@mkbabb\/value\.js(?:\/[^"']*)?` | MATCHES `@mkbabb/value.js/math` (RAN → TRUE) → a LIGHT re-export of the subpath WOULD RED assertion 4 → the leaves are forced, not legacy → P.W10 externalize-or-document |
| `./math` subpath (clean, but banned in LIGHT source) | `node_modules/@mkbabb/value.js/dist/subpaths/math.d.ts:7` | `export { clamp, scale, lerp, lerpArray, … }` — SHIPPED (1.0.2), parse-that-FREE + CSS-grammar-FREE; the W97 probe confirmed 2 modules / 533 bytes / 0 parse-that-grammar-engine. Grammar-clean ≠ boundary-allowed in LIGHT source. |
| `leaves` consumers | `numeric.ts`, `smooth.ts`, `spring-duration.ts`, `playback.ts`, `drag.ts`, `stagger.ts`, `timeline.ts`, `sequence.ts`, `motion-path.ts`, `waapi.ts` | the LIGHT modules that read `leaves.ts` math — unaffected by O.W9 (they keep importing `internal/leaves.ts`; P.W10's resolution, if Arm A, re-points the four leaves to the externalized subpath) |
| the cut | O.md §2 / §6 (DM-16) | the 5.0.0 major cut is the honest home for the breaking renames; `proof:changelog-5.0.0` (O.WZ) asserts the breaking set |
| F29 rec | `proof:no-deprecated-guard` (router) | the precedent gate shape — a grep over a surface asserting a deprecated form is absent; O.W9 authors the parallel published-surface gate |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they purge the published-surface
legacy — every move a no-legacy cut over a now-unblocked substrate, NONE a workaround. (The
`leaves.ts` math duplication is NOT an O.W9 cut — it is STRUCTURALLY FORCED by `proof:boundary` and
RE-SCOPED to P.W10; O.W9's only `leaves.ts` action is correcting the stale "no `./math` subpath"
comment. Full-loop, ledger line 589.)

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

### ~~S3 — Swap `internal/leaves.ts` … for `@mkbabb/value.js/math`~~ — RE-SCOPED OUT, DEFERRED to P.W10

**Full-loop RE-SCOPE (ledger line 581-589).** O.W9's original S3 treated the `leaves.ts` math as
pure KISS debt curable by a re-export-from-subpath swap (with `proof:boundary` "verified to hold").
**That premise is FALSIFIED.** The `proof:boundary` spec regex
`@mkbabb\/value\.js(?:\/[^"']*)?` MATCHES `@mkbabb/value.js/math` (RAN in node → TRUE), so the naive
`export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math"` in a LIGHT module would RED
assertion 4 — the leaves are **STRUCTURALLY FORCED, not legacy.** The boundary gate bans even the
subpath specifier in LIGHT source, independent of whether the subpath is grammar-clean (it is —
`dist/subpaths/math.d.ts` parse-that-free; the W97 probe confirmed the graph at 2 modules / 533 bytes
/ 0 parse-that-grammar-engine).

**Disposition.** This cut is **NOT an O.W9 deliverable.** It is owned by **P.W10** (the
externalization-trap fix), which already correctly transposes it into a gate-verified resolution:
- **Arm A** — bundle-externalize `@mkbabb/value.js/math` via a `vite.config.ts` external-widen + the
  `proof:boundary` W97 `math-subpath-clean` graph-clean gate + the H4 rolldown external smoke-test
  (the bare `@mkbabb/value.js` external string does NOT pre-resolve the `/math` subpath — H4 verifies
  the externalized subpath resolves in a real consumer build), threading the W97 allow-list through
  BOTH boundary assertions (1 source-grep + 4 bundle-graph), OR
- **Arm B** — documented-keep with a corrected `leaves.ts` comment,

with the verdict recorded in `scripts/leaves-externalization-decision.json` (the P-inv-28 / DP-6
terminal home, beside `spring-vector-decision.json`).

**The ONLY O.W9-side action on `leaves.ts`.** Correct the stale `:56-61` "no `./math` subpath"
sub-clause so it cites the REAL gate-forced rationale — the duplication is NOT legacy: it is forced
because `proof:boundary` bans even the `@mkbabb/value.js/math` specifier in LIGHT source (cite the
`proof-boundary.mjs` regex line explicitly so a future reader sees the gate-forced reason). The
operative invariant of the comment (a LIGHT module carries zero static `@mkbabb/value.js*` edge) is
TRUE and stays; only the "no subpath exists" sub-clause is corrected. This is a comment edit, not a
math-export swap. The actual swap (if Arm A) lands in P.W10 with its own gates.

**Gate bite.** `proof:no-legacy-surface` (S4) carries NO `leaves.ts` math-re-export clause (the swap
is P.W10's, gated by `proof:boundary` W97). O.W9's gate asserts only the published-surface
`@deprecated`-free observable (S1/S2/S4); the `leaves.ts` math disposition is P.W10's
`proof:boundary` W97 + the decision JSON.

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

*(The original clause 4 `leaves-math-from-subpath` is REMOVED — the `leaves.ts` math disposition is
RE-SCOPED to P.W10, gated by `proof:boundary` W97 + `leaves-externalization-decision.json`, NOT by
`proof:no-legacy-surface`. Full-loop, ledger line 589.)*

Wire into `proof:hygiene` (beside `proof:no-deprecated-guard`, `package.json:194`). The keystone
clause (1) is the REAL consumer observable — the published d.ts the npm consumer installs.

**Constraint (observable-truth — the keystone reads the BUILT artifact, not the source).** The proxy
trap is grepping `src/**` for `@deprecated` (a source-shape proxy that a roll-up transform could mask
or that misses a re-export aliased deprecation). The keystone clause builds the library and greps the
rolled-up `dist/keyframes.d.ts` — the EXACT surface the consumer's IDE hover + `import type` resolve
against. A `@deprecated` that survives API-Extractor into the published d.ts is the genuine defect;
the gate bites THAT, not the source intent.

**Gate bite.** `node scripts/proof-no-legacy-surface.mjs` → exit 1 today (the three aliases are on
`dist/keyframes.d.ts`; 22 demo `Animation` imports). After S1+S2+S4: every clause greens — the
published d.ts is `@deprecated`-free, the demo migrated. (The `leaves.ts` math disposition is NOT a
clause here — it is P.W10's `proof:boundary` W97 + `leaves-externalization-decision.json`.)

---

## Born-RED gate

**Gate:** `proof:no-legacy-surface` (NEW — `scripts/proof-no-legacy-surface.mjs`; this wave authors
it, gate-first per S4) — born-RED over THREE clauses, the keystone being `d.ts-deprecated-free` (the
REAL consumer observable: zero `@deprecated` on the published roll-up). *(The former 4th clause
`leaves-math-from-subpath` is REMOVED — the `leaves.ts` math disposition is P.W10's, gated by
`proof:boundary` W97 + `leaves-externalization-decision.json`, full-loop line 589.)*

**The REAL runtime observable (observable-truth — the genuine defect, measured on the BUILT
artifact, not a source proxy).**

| Clause | Witness on today's (2026-06-19) tree | Failure mode today (the REAL observable) | Expected after the cuts |
|--------|--------------------------------------|------------------------------------------|-------------------------|
| `d.ts-deprecated-free` (**KEYSTONE**) | `npm run build` → grep `@deprecated` in `dist/keyframes.d.ts` | the rolled-up published d.ts carries the three `@deprecated` alias JSDocs — the EXACT surface the npm consumer's IDE + `import type` resolve against | ZERO `@deprecated` on the published roll-up |
| `no-Animation-alias` | `engine.ts:1205` + `grep -rln "import type {…Animation…}" demo/` | the `export { KeyframesAnimation as Animation }` alias + 22 demo consumers | alias dropped, 22 consumers migrated to `KeyframesAnimation` |
| `no-scroll-timeline-alias` | `timeline.ts:171,209-218` | the `@deprecated ScrollTimeline` / `ScrollTimelineOptions` re-exports | both dropped |
| ~~`leaves-math-from-subpath`~~ — **RE-SCOPED to P.W10** | `leaves.ts:23,28,46,68-80` (local defs) | the four math functions are STRUCTURALLY-FORCED local defs (the `@mkbabb/value.js/math` re-export reds `proof:boundary` — the regex matches the subpath); the "no subpath" comment is stale | O.W9: correct the comment to cite the gate-forced rationale. The swap (Arm A) + its `proof:boundary` W97 gate live in P.W10 |

**How it is born-RED (plant-a-failure).** Today the gate exits 1 with no plant needed — the three
`@deprecated` aliases are present on the published d.ts the instant the library builds and the 22 demo
`Animation` imports are live. The keystone clause greps the BUILT `dist/keyframes.d.ts` (the
consumer's actual surface), so it cannot be gamed by a source-only edit that the roll-up would
re-introduce. **Discriminating bite:** a cure that renames the alias in source but leaves a
`@deprecated` re-export that API-Extractor rolls UP into the published d.ts still reds the keystone —
proving the observable is the published surface, not the source.

**Green condition.** The `@deprecated Animation` alias dropped + 22 demo consumers migrated (S1); the
`@deprecated ScrollTimeline`/`ScrollTimelineOptions` aliases dropped (S2); `proof:no-legacy-surface`
THREE clauses GREEN incl. the `@deprecated`-free published d.ts (S4). The breaking renames absorbed by
the 5.0.0 cut (O.WZ) — `proof:changelog-5.0.0` asserts the set. (The `leaves.ts` math swap is P.W10's
deliverable — its GREEN condition is `proof:boundary` W97 GREEN +
`leaves-externalization-decision.json` recorded, NOT an O.W9 clause.)

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling publish to land.** Every O.W9 arm (S1/S2/S4) is a
  kf-side surface cut over the installed tree — phase NOW, zero sibling gate. (The `./math` subpath
  is shipped — `dist/subpaths/math.d.ts:7`, parse-that-free — but consuming it from LIGHT source is
  P.W10's externalization-trap concern, NOT an O.W9 arm: the `proof:boundary` regex bans the subpath
  specifier in LIGHT source. Full-loop, ledger line 589.)
- **P.W10 (the externalization-trap fix) — OWNS the `leaves.ts` math disposition.** The former O.W9
  §S3 swap is RE-SCOPED to P.W10 (Arm A externalize via `vite.config.ts` external-widen + the W97
  `math-subpath-clean` gate + H4 smoke-test, OR Arm B documented-keep), verdict in
  `scripts/leaves-externalization-decision.json`. O.W9's only `leaves.ts` action is correcting the
  stale "no `./math` subpath" comment to cite the gate-forced rationale.
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
keyframes.js; no cross-repo edit). The IMPLEMENTATION (the two alias drops — `Animation` +
`ScrollTimeline`/`ScrollTimelineOptions`, the 22-consumer migration, the `proof:no-legacy-surface`
gate authoring, and the one `leaves.ts` COMMENT correction) opens ONLY on the owner's explicit
authorization. Phase NOW: zero sibling publish gates the landing — the renames are kf-owned. The
breaking renames are absorbed by the 5.0.0 cut at O.WZ (the honest major home). Gate-first, born-RED,
observable-truth (the keystone reads the BUILT published d.ts, not the source), no-legacy, KISS,
gestalt throughout. The born-RED witness (the three `@deprecated` aliases on the published d.ts, the
22 demo `Animation` imports) stands on today's tree; the cure opens on authorization. **The
`leaves.ts` math swap is NOT an O.W9 implementation deliverable — it is RE-SCOPED to P.W10** (the
externalization-trap fix); O.W9 only corrects the stale "no `./math` subpath" comment.

---

**Full-loop disposition (`docs/tranches/P/FULL-LOOP-LEDGER.md` O.W7-9-engine / [RE-SCOPE] O.W9,
line 581-589):** RE-SCOPE. **KEEP S1** (drop `@deprecated Animation` + migrate 22 demo consumers —
`grep -rln 'import type.*Animation' demo/` = 22, EXACTLY the wave's count, verified), **S2** (drop
`ScrollTimeline`/`ScrollTimelineOptions` aliases — both present at `timeline.ts:171,209-218`,
verified), and **S4** (`proof:no-legacy-surface`, keystone reading the BUILT `dist/keyframes.d.ts`) —
all born-RED witnesses verified real, all clean no-legacy cuts. **RE-SCOPE S3 (`leaves.ts`→`/math`)
OUT of O.W9 and DEFER to P.W10**, which already correctly transposes it: the naive
`export from '@mkbabb/value.js/math'` would RED `proof:boundary` (the gate regex
`@mkbabb\/value\.js(?:\/[^"']*)?` MATCHES the subpath — RAN → TRUE), so the leaves are STRUCTURALLY
FORCED, not legacy. P.W10's gate-verified resolution (Arm A bundle-externalize via vite external-widen
+ W97 graph-clean gate + H4 smoke-test, OR Arm B documented-keep with a corrected comment; verdict in
`leaves-externalization-decision.json`) is the sound form. The ONLY true O.W9-side action on
`leaves.ts` is correcting the stale "no `./math` subpath" comment to cite the real gate-forced
rationale (the duplication is not legacy when the boundary gate bans even the subpath specifier in
LIGHT source). On the P tree, S1/S2 are already carried unchanged by P.W10/S5.
