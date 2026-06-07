# G.W5 — The library line-ceiling GATED DECISION (do NOT reflexively split)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the DECISION itself — an extended `proof:*` gate
that RECORDS the resolution; the kf SOURCE is untouched, the wave ships a gate +
a recorded exception, the §Mandate-correct shape for a cohesive-gestalt ruling) ·
**Scope:** `scripts/proof-decomposition.mjs` (extend the ceiling sweep to
`src/animation/**` with a per-file cap + a recorded gated exception), `package.json`
(no new script — `proof:decomposition` already exists and is in `proof:all`) — ZERO
edit to `src/animation/**` · **DAG: independent of Band 0/1** (the gate surface is
the proof script, not the engine; runs in parallel) — but land AFTER `G.W2` so the
recorded line counts are taken on the re-pinned tree (the re-pin is ZERO kf source
edit, so the counts are stable, but the ordering keeps the recorded numbers honest to
the shipped surface) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *`engine.ts` is 1313L (+130L since F-open), un-ceilinged: `proof:decomposition`
sweeps the DEMO only, never `src/animation/**`. The chronic is the ABSENCE of a gated
decision, not the line count. DECIDE — extend the ceiling to the library with a
RECORDED gated exception for `engine.ts` carrying the F.md NEW-3 cohesion ruling, OR
re-baseline the class guard with the F.W7/W8 rationale. Do NOT reflexively split.*

This is one of the two gated DECISIONS that must not be re-deferred (`_SYNTHESIS-gap-
scorecard §THESIS (d)`; the other is the G.W4 back-compat framing, already a re-word).
It is the ONE chronic that is purely kf-owned and purely a G call to make
(`a-deferred-ledger C-6`). The post-F engine is NOT a god-module problem — it is a
correctly-decomposed engine whose two largest files (`engine.ts` 1313L, `group.ts`
752L) are at their cohesive gestalt (`a-backend-godmodules` headline, all 7 candidates
ALREADY-SOTA). The gap is structural-process, not architectural: the file grew +130L
since F-open UNCONSTRAINED, because the library is exempt from the ceiling gate the
demo lives under. The Mandate's no-god-modules precept names the line-ceiling as a
GATED DECISION, not a split — and F.md NEW-3 already ruled the `Animation` class
cohesive. G must record that ruling in a gate, so the next "engine.ts is 1313L, split
it" reflex reds against a documented exception instead of re-opening a settled call.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the resolution is a RECORDED gated decision, NOT a
reflexive split-for-line-count (which is the legacy-shape the Mandate forbids —
extract-for-line-count produces an anaemic object severed from the `this`-bound
re-derive seam the FrameCompiler depends on, `a-backend-godmodules G-GM-1`). NO god
modules — but the precept's own clause is explicit: "decompose >500L ONLY where
genuinely cohesive + befitting — the Animation class is at its gestalt per F.md NEW-3;
the line-ceiling is a gated DECISION, NOT a split." So the §Mandate-CORRECT move is to
gate the decision, not to carve. NO legacy: the recorded exception is honest (it
carries the cohesion rationale + a stale-entry guard that reds if the file ever drops
back under the base ceiling, so the exception cannot silently accrue slack — the
pattern `proof:decomposition`'s `CEILING_OVERRIDE` already implements). KISS · DRY:
ONE ceiling mechanism, extended to the library surface — not a second bespoke guard.
Measure-first binds on ANY split: if the lane disputes the gestalt and proposes a
carve, the gate's `proof:boundary`-parity instrument (Design decision 4) is the
falsifiable lock. inv ε: every claim cites `file:line` (`wc -l`, `grep`) against live
`tranche-g-dev`, verified not asserted. The `animations.ts` taxonomy carve is
RECORD/contrivance (Design decision 3) — do NOT carve it.

**Provenance.** `a-deferred-ledger C-6` (the library line-ceiling / `Animation`
god-object chronic — CHRONIC-UNDECIDED → "G must DECIDE, not re-defer (P-invariant)";
`engine.ts` re-verified 1313L, `proof:decomposition` re-verified demo-only) +
`a-backend-godmodules G-GM-1` (the gestalt held through F's +99L growth, re-measured
class anatomy: class 1012L `:82-1093`, subclass 208L `:1095-1295`; ALREADY-SOTA +
RECORD the guard re-baseline) + `a-backend-godmodules G-GM-1b` (the one cohesive carve
— `CSSKeyframesAnimation`→own file — MEASURE-FIRST → RECORD, fails the cohesion-benefit
test) + `a-backend-godmodules G-GM-2` (the `animations.ts` taxonomy split — god-LIST
not god-module, RECORD/contrivance). Synthesised at `_SYNTHESIS-gap-scorecard §1`
(engine line-ceiling row: "GAP — a DECISION, not a split") + `§2 Band 2 G.W5`.

---

## § State, verified (not asserted)

The live facts, `wc -l`- and `grep`-confirmed on `tranche-g-dev`:

1. **`engine.ts` is 1313L; the demo-only ceiling gate never sweeps it.** `wc -l
   src/animation/engine.ts` → **1313** (verified live). `proof:decomposition`
   (`scripts/proof-decomposition.mjs:21-27,149-158`) sweeps `animation-controls/**` +
   `demo/app/**` + `orbital-drag/**` + the named `EasingCurveCanvas.vue` — the DEMO
   surface, at a 350L `.vue` / 250L `.ts` ceiling. `src/animation/**` is NOT in the
   sweep set (read live: the `CONTROLS`/`APP`/`ORBITAL` roots are all under `demo/`).
   So the library has grown un-ceilinged (`a-deferred-ledger C-6`, re-verified).

2. **The growth since F is +130L, and it is COHESIVE, not sprawl.** `engine.ts` was
   ~1179L at F-open (`a-deferred-ledger C-6`); it is now 1313L. The `Animation` class
   is 1012L (`grep -nE "^export class"` → `:82` `Animation`, `:1095`
   `CSSKeyframesAnimation`; the class span verified `a-backend-godmodules G-GM-1`). The
   +99L class delta + +42L subclass delta trace to exactly two F waves, each landing in
   ONE method: F.W7's per-keyframe easing read + F.W8's sibling-style-rule base merge
   land inside `CSSKeyframesAnimation.fromString`; the `Animation` growth is the F.W4
   buffer machinery (`clearBuffer`, the single-frame alias fast-path, `processFrame` —
   the zero-alloc hot-path core). The four-group gestalt F-ENG-5 named is intact and
   re-verified (`a-backend-godmodules G-GM-1`): the compile-delegation facade, the ~13
   live-options-reference setters, the lifecycle/playback state machine, the fill/rest
   contract — none independently extractable without severing the `this`-bound re-derive
   seam.

3. **The class is 62L over its OWN F.md guard — the ONE candidate that trips its
   guard.** The F.md §ceiling DECISION (`F.md:213-220`) named the guard at the *class*
   (~913L at F-open, the `Animation` class itself); at 1012L the class is ~62L over.
   But F-ENG-5 ruled the class at its cohesive gestalt — the guard guarded against
   *growth*, and F's growth was cohesive (two methods doing their one job better), so
   the guard's INTENT held even as the number crossed (`a-backend-godmodules G-GM-1`).
   No OTHER candidate trips a guard: `group.ts` 752L, `sequence.ts` 616L, `spring.ts`
   491L, `waapi.ts` 473L, `frame-compiler.ts` 402L are all at gestalt or under
   (`a-backend-godmodules` table; `wc -l` verified live).

4. **The proof script ALREADY has the exact mechanism this decision needs.**
   `proof-decomposition.mjs:89-91,168-216` implements `CEILING_OVERRIDE` — a per-file
   cap + rationale entry, WITH a stale-entry guard (`:208-216`: an override whose file
   is now under the base ceiling reds, so the exception cannot silently accrue slack).
   It is EMPTY today (`:89-91`, the demo's `EasingCurveCanvas` was trimmed under rather
   than excepted). So the recorded-exception machinery — the §Mandate-correct shape for
   a cohesive-gestalt ruling — exists and is proven; G extends its SWEEP to the library
   and ADDS the one rationale-bearing entry.

5. **The F.md ceiling DECISION was deferred to "Band 0 should DECIDE," and was not
   resolved in F.** `F.md:213-220` (read live): "MEASURE-FIRST → BOOK … The gap is the
   ABSENCE of a *gated decision*. Band 0 should DECIDE: extend the ceiling to
   `src/animation/**` OR record an explicit gated exception with rationale. **Do not
   reflexively split.**" `a-deferred-ledger C-6` confirms it re-deferred to G as the one
   chronic G MUST resolve with a gated decision (P-invariant: do not re-defer).

The wave's job: DECIDE — extend `proof:decomposition`'s ceiling sweep to
`src/animation/**` with a per-file cap + a RECORDED gated exception for `engine.ts`
carrying the F.md NEW-3 cohesion ruling (path A), OR re-baseline the class guard with
the F.W7/W8 rationale (path B). The extended gate IS the lock — it forces the decision
to be recorded and reds the reflexive split. Do NOT carve `CSSKeyframesAnimation` (the
one cohesive-looking seam — fails the cohesion-benefit test) or `animations.ts` (a
god-LIST, contrivance).

---

## § Goal

**What lands (the DECISION, recorded as the gate):**

The wave RESOLVES the chronic by extending `proof:decomposition` to the library surface
and RECORDING the disposition. Two paths satisfy the §Mandate; **the lane recommends
path A** (Design decision 1), but either is a gated, recorded decision (not a re-defer):

- **Path A (recommended) — extend the ceiling to `src/animation/**` + a RECORDED gated
  EXCEPTION for `engine.ts`.** Add `src/animation/**` to `proof:decomposition`'s ceiling
  sweep at a library `.ts` cap (Design decision 2 sets the number), and add ONE
  `CEILING_OVERRIDE`-shaped entry for `engine.ts` with the cohesion rationale:
  *"the Animation class is at its cohesive gestalt (F.md NEW-3 / a-engine-post-e
  F-ENG-5, re-verified post-+99L at a-backend-godmodules G-GM-1) — the four-group
  state machine shares one `this`-bound re-derive seam the FrameCompiler depends on; a
  split-for-line-count is the legacy-shape the Mandate forbids."* The stale-entry guard
  (already in the script, `:208-216`) reds if `engine.ts` ever drops back under the base
  cap — so the exception is self-pruning, never silent slack. Every OTHER
  `src/animation/**` file (all under the cap — State 3) is swept with NO exception, so a
  future un-cohesive sprawl in `group.ts`/`sequence.ts` reds.
- **Path B (alternative) — re-baseline the class guard with the F.W7/W8 rationale.**
  If the lane prefers the class-scoped guard the F.md DECISION named (over a file-scoped
  one), re-baseline the `Animation`-class cap to ~1050L (the +99L cohesive growth
  recorded), with the F.W7/W8 rationale (the growth is two methods doing their one job)
  in the entry. Same self-pruning guard discipline; same recorded-decision outcome.

**What does NOT land (recorded so no future lane re-raises):**
- **NO `engine.ts` split.** The class is at gestalt (State 2/3); a carve is the
  legacy-shape the Mandate forbids (`a-backend-godmodules G-GM-1`).
- **NO `CSSKeyframesAnimation`→own-file carve.** The one cohesive-LOOKING seam
  (`a-backend-godmodules G-GM-1b`) — RECORD: it fails the cohesion-benefit test (same
  dynamic chunk, forces `private`→`protected` widening for cosmetics, no
  correctness/simplicity/speed gain).
- **NO `animations.ts` taxonomy carve.** A god-LIST not a god-module
  (`a-backend-godmodules G-GM-2`) — RECORD/contrivance: the `presetTaxonomy` index
  already banks the discoverability a 4-way split would chase, in-file, with no new
  files (Design decision 3).

**Why:** the chronic is the ABSENCE of a gated decision, not the line count — the file
grew +130L unconstrained precisely because no gate watches the library. Extending the
gate makes the library subject to the same forcing function the demo is, while the
RECORDED exception encodes the genuine cohesion ruling so the gate reds the WRONG move
(a reflexive split) and PASSES the RIGHT state (a cohesive class over a base cap, with
its rationale on record). The decision becomes a re-runnable artifact, not a prose
deferral — the P-invariant (do not re-defer) is satisfied by construction.

---

## § Scope

### S1 — extend `proof:decomposition`'s ceiling sweep to `src/animation/**` (`a-deferred-ledger C-6`) — SHIP-in-G (the gate)

**WHAT:** add `src/animation/**` to the ceiling-clause source set in
`proof-decomposition.mjs` (the `ceilingSources` assembly, `:149-158`), at a library
`.ts` cap (Design decision 2). Concretely: add a `LIBRARY = path.join(REPO,
"src/animation")` root and fold `collectSources(LIBRARY)` into `ceilingSources` (the
clauses 2–4 — parse-adapter, pure-utils, async-blob — stay DEMO-scoped; only clause 1,
the ceiling, extends). The cap for `src/animation/**` `.ts` is set per Design decision
2 (a library cap distinct from the demo's 250L, since the engine modules are
legitimately larger cohesive units). The clause message already names the remedy
("split at its natural concern seam … or add a rationale-bearing CEILING_OVERRIDE
entry") — it carries over.

**WHY:** State 1 — the library is exempt from the gate, so it grew un-ceilinged. The
gate is the forcing function; extending its SWEEP (not adding a second bespoke guard —
KISS/DRY) puts `src/animation/**` under the same discipline the demo lives under. Every
file under the cap (State 3) passes silently; only an un-cohesive sprawl reds.

### S2 — record the gated EXCEPTION for `engine.ts` carrying the F.md NEW-3 cohesion ruling (`a-backend-godmodules G-GM-1`) — SHIP-in-G (the recorded decision)

**WHAT (path A):** add ONE `CEILING_OVERRIDE` entry for `src/animation/engine.ts` (or,
path B, re-baseline the class guard) with the cap (Design decision 2) and the cohesion
rationale prose (Goal, path A). The stale-entry guard (`:208-216`, already in the
script) requires the file to genuinely exceed the base cap, else the entry reds as dead
— so the exception is self-validating. The entry's `why` cites `F.md NEW-3` /
`a-engine-post-e F-ENG-5` / `a-backend-godmodules G-GM-1` so the rationale is traceable
in the gate output itself.

**WHY:** State 2/3 — `engine.ts` is the ONE candidate over its guard, and it is over
because the class is at its cohesive gestalt (the four-group state machine on one
`this`-bound re-derive seam). The §Mandate-correct shape for "cohesive but over the
line" is a RECORDED gated exception, not a split — the exception encodes the ruling so
the gate PASSES the cohesive state and the next "split engine.ts" reflex reds against a
documented decision (the P-invariant: the decision is made and recorded, not re-deferred).

### S3 — record the two NON-carves (`a-backend-godmodules G-GM-1b` / `G-GM-2`) — SHIP-in-G (RECORD, no source)

**WHAT:** the wave RECORDS (in this doc's §Folds + §Design decisions) that
`CSSKeyframesAnimation`→own-file (`G-GM-1b`) and the `animations.ts` taxonomy split
(`G-GM-2`) are NOT carved, with their cohesion-benefit-test rationale — so a future
lane cannot re-open them as "obvious" decompositions. No source, no gate clause beyond
the S1 sweep passing (both files stay under the cap and trigger no override).

**WHY:** both LOOK like clean decompositions (a subclass seam; a taxonomy-partitioned
catalogue) and would invite a reflexive carve. Recording the cohesion-benefit failure
(`G-GM-1b`: same chunk + `protected` widening, no gain; `G-GM-2`: a god-LIST whose
`presetTaxonomy` already banks the discoverability) closes them as settled — the
Mandate's "do not reflexively split."

> **RECORDED / KILLED in this band — so no future lane re-litigates:**
> - **`G-GM-1b` `CSSKeyframesAnimation`→`css-keyframes.ts`** — RECORD (MEASURE-FIRST →
>   fails cohesion-benefit: same dynamic chunk, `private`→`protected` widening for
>   cosmetics, no correctness/simplicity/speed gain). The falsifiable instrument IF a
>   future wave disputes this: a `proof:boundary` re-run after the carve must show the
>   SAME single dynamic chunk AND zero new `protected` widenings — if either regresses,
>   the carve is legacy-shaped (it will). Do NOT carve.
> - **`G-GM-2` `animations.ts` taxonomy split** — RECORD/contrivance (a god-LIST, not a
>   god-module; the `presetTaxonomy` index `:865-870` already banks the discoverability
>   in-file; a 4-way split needs a shared `_spring-config` leaf + multiplies the boundary
>   surface 4× for ZERO behaviour/perf delta). Do NOT carve.
> - **`group.ts` 752L / `sequence.ts` 616L / `spring.ts` 491L / `waapi.ts` 473L /
>   `frame-compiler.ts` 402L** — ALREADY-SOTA (`a-backend-godmodules G-GM-3..7`): the
>   compositor 4-concern gestalt, the transport/scheduling `_fold` gestalt (a false
>   seam), under-ceiling single-source physics, the already-function-decomposed WAAPI
>   module, the D.W4 split's own product. Swept by S1, no exception owed.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable instrument,
not an assertion). **The extended `proof:decomposition` IS the lock — it forces the
decision to be recorded:**

1. **`proof:decomposition` clause 1 (ceiling) now SWEEPS `src/animation/**` and PASSES.**
   The extended gate scans every `src/animation/**` `.ts` against the library cap; all
   files PASS — the under-cap modules silently, `engine.ts` via its RECORDED exception
   (path A) or the re-baselined class guard (path B). **BITE:** revert S1 (drop
   `src/animation/**` from the sweep) → the library is un-ceilinged again, the chronic
   re-opens, and the gate no longer watches the engine (the decision is un-recorded). Or:
   delete the `engine.ts` exception entry WITHOUT splitting → `engine.ts` reds at 1313L
   over the base cap (the gate forces EITHER the recorded exception OR a split — it will
   not pass a silent un-decided state).

2. **The recorded exception is SELF-PRUNING — a dead exception reds.** The stale-entry
   guard (`proof-decomposition.mjs:208-216`) reds if the `engine.ts` `CEILING_OVERRIDE`
   entry matches no file over the base cap. **BITE:** if `engine.ts` is ever genuinely
   refactored back under the base cap, the exception becomes dead and the guard reds —
   forcing the entry's removal. The exception cannot silently accrue slack; it is valid
   ONLY while the file genuinely needs it.

3. **The reflexive split is REDDED by the boundary-parity instrument (the no-carve
   lock).** IF a future wave disputes the gestalt and carves `engine.ts` /
   `CSSKeyframesAnimation`, `proof:boundary` must show the SAME single dynamic chunk AND
   zero new `protected` widenings (`a-backend-godmodules G-GM-1b`). **BITE:** a carve
   that fragments the dynamic chunk, or widens base internals `private`→`protected` for
   the split, reds `proof:boundary` — proving the carve is legacy-shaped. The gate
   defends the gestalt against a reflexive split, not just the line count.

4. **No regression — the gate extension is inert on the demo + the engine source.**
   `npm run proof:decomposition` stays green (the demo clauses 2–4 UNCHANGED — they
   remain demo-scoped; clause 1 extends without reddening any current file). `proof:all`
   stays green (`proof:decomposition` is already in the `proof:all` chain,
   `package.json:64`). ZERO edit to `src/animation/**` — the wave ships a gate + a
   recorded entry, not a source change. **BITE:** any demo-clause regression, or any
   `src/animation/**` source edit attributed to this wave, reds (the wave is a gated
   DECISION, not a split).

---

## § Folds

Retires (by finding id):
- **`a-deferred-ledger C-6`** (the library line-ceiling / `Animation` god-object chronic
  — the ABSENCE of a gated decision) — S1 + S2 + gate clauses 1/2. The chronic is
  RESOLVED: the gate now watches `src/animation/**`, the cohesion ruling is recorded,
  the P-invariant (do not re-defer) is satisfied by construction.
- **`a-backend-godmodules G-GM-1`** (the gestalt held through F's +99L; the class 62L
  over its own guard — BOOK the re-baseline DECISION) — S2 (the recorded exception /
  class re-baseline) + gate clauses 1/2/3. ALREADY-SOTA (class) stands; the RECORD
  (the guard decision) lands as the gate.

**RECORDED in this band (not carved — see S3 callout):**
- **`a-backend-godmodules G-GM-1b`** (`CSSKeyframesAnimation`→own file) — RECORD (fails
  cohesion-benefit; gate clause 3 is the falsifiable instrument if disputed).
- **`a-backend-godmodules G-GM-2`** (`animations.ts` taxonomy split) — RECORD/contrivance
  (a god-LIST; `presetTaxonomy` already banks the discoverability).
- **`a-backend-godmodules G-GM-3..7`** (`group`/`sequence`/`spring`/`waapi`/
  `frame-compiler`) — ALREADY-SOTA; swept by S1, no exception owed.

---

## § Design decisions (the trade-offs RESOLVED)

1. **Path A (extend the ceiling + record the exception) over Path B (re-baseline the
   class guard) — RECOMMENDED, but either is a gated recorded decision.** RESOLVED: the
   F.md DECISION named the guard at the *class* (path B); the `a-backend-godmodules`
   re-measure works at the *file* (path A, the proof script's native unit — it sweeps
   files, not classes). Path A is the cleaner fit: it reuses the script's existing
   per-FILE `CEILING_OVERRIDE` machinery verbatim (`:89-91,168-216`) with its proven
   stale-guard, sweeps ALL of `src/animation/**` (so a future sprawl in any module reds,
   not just `engine.ts`), and needs no class-span parser. Path B is more faithful to the
   F.md framing (the guard IS the class) but requires the script to compute the class
   span (an `awk`-style range), adding a bespoke mechanism for one file. Trade-off:
   file-granularity-with-reuse (A) vs class-granularity-with-bespoke-parse (B). **Both
   record the decision and red the reflexive split; both satisfy the P-invariant.** The
   recommendation is A (KISS/DRY — one mechanism, extended); the impl wave makes the
   final call. The gate (clause 1) binds the OUTCOME (the library is swept, the cohesive
   exception is recorded), not the granularity.

2. **The library `.ts` cap is set ABOVE the demo's 250L — the engine modules are
   legitimately larger cohesive units.** RESOLVED + named: the demo's 250L `.ts` cap
   (`proof-decomposition.mjs:80`) fits Vue composables; the library's interpolation
   engines are larger cohesive units by nature (`frame-compiler.ts` 402L is the D.W4
   split's PRODUCT, `waapi.ts` 473L is already function-decomposed — both ALREADY-SOTA).
   A 250L library cap would red every one of them — a false alarm that would invite
   exactly the contrivance-splits the Mandate forbids. The cap is set so the
   ALREADY-SOTA modules pass cleanly (State 3: all under ~516L except `engine.ts`); a
   base library cap of ~550–800L (impl-wave's call within that band) leaves `engine.ts`
   the lone genuine exception and every other module passing without an override. The
   number is a DELTA, named: the library cap is intentionally higher than the demo's,
   because the engine's cohesive units are intrinsically larger — an isomorphism break
   the §Mandate permits when befitting + named.

3. **The `animations.ts` taxonomy carve is contrivance — do NOT carve (RECORD/KILL).**
   RESOLVED: `animations.ts` 870L is a god-LIST, not a god-module — ONE responsibility
   (the preset library) as a flat data table of value-equivalent leaves
   (`a-backend-godmodules G-GM-2`). Splitting a data table by a tag column is
   organization, not decomposition; the `presetTaxonomy` index (`:865-870`) already
   delivers the discoverability a 4-way split would chase, IN-FILE, with no new files,
   no shared `_spring-config` leaf, and no 4× boundary-surface multiplication. KISS
   argues to leave the flat catalogue + the index. A split is the contrivance the
   Mandate names — RECORD so no "870L, split it" reflex re-opens it.

4. **The gate DEFENDS the gestalt — a reflexive split is the falsifiable negative.**
   RESOLVED: the §Mandate-binding risk is not that `engine.ts` is too big, but that a
   future lane CARVES it reflexively (the legacy-shape). The gate's clause 3 makes that
   falsifiable: a carve that fragments the single dynamic chunk or widens base internals
   `private`→`protected` reds `proof:boundary` (`a-backend-godmodules G-GM-1b`). So the
   wave does not merely record "don't split" as prose — it builds the instrument that
   reds the split. The decision is enforced, not just stated.

5. **This wave is the gate + the recorded decision ALONE — ZERO `src/animation/**`
   edit.** RESOLVED: G.W5 ships `proof-decomposition.mjs` (the extended sweep) + the
   recorded exception, and RECORDS the non-carves. It does NOT touch the engine source
   — the whole point of the DECISION is that the cohesive gestalt is CORRECT and stays.
   The re-pin (`G.W2`) and the `serializeEasing` fix (`G.W4`) are the band's source
   SHIPs; this wave is purely the gated decision the §THESIS names as one of the two
   that must not be re-deferred (`_SYNTHESIS-gap-scorecard §THESIS (d)`).
