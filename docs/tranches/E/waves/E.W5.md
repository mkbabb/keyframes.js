# E.W5 — Engine housekeeping (BOOK-only)

**Phase:** IMPL · **Class:** PATCH (BOOK-only; non-breaking — at most a doc/comment
+ a measure-gated micro-edit) · **Scope:** `src/animation/` (the published
library — but BARELY: the engine is at gestalt) · **Parallel to:** E.W4 (perf)
and the demo waves · **Gated on:** keyframes' own green CI (inv-27).

The engine is EXEMPLARY post-D. The 6-lane assay and the modern-web comparison
both confirm it: no hot-path allocations (the AnimationGroup compositor went
zero-alloc in D.W4), modern APIs aligned (`scheduler.yield` live-probed,
`prefersReducedMotion` unified, WAAPI maximally delegated with a faithfulness
gate the guide doesn't even demand, ScrollTimeline correctly JS-driven), the
`advanceTo` clock-advance canon, and the honest `pause`/`resume`/`toggle` API.
The modern-web lane scored the engine **6 ALIGNED, 0 GAP** — it is the *reference
implementation* of C1 (INP/`scheduler.yield`), CSS6 (`linear()` physics easing),
CSS7 (per-case reduced-motion), and CSS5 (compositor delegation)
(`audit/modern-web-findings.md` §2, E-1..E-6).

So **E barely touches the published library.** This wave is BOOK-ONLY: it
records what the assay found and lands at most two minimal items — a documentation
note (the managed-animation pause contract) and one measure-gated micro-edit
(`tryParseCache` eviction, which ships ONLY if a measure-first bench shows it
matters, else recorded-withheld). The mandate's spine — no-legacy, gestalt,
isomorphic, KISS, **inv-16** — holds, but the dominant verb here is RECORD, not
edit. Every item is `file:line`-grounded + verifiable, **verified not asserted**
(inv ε). E's content is **net-NEW**: D terminated every keyframes-owned deferral
(the ledger is clean, zero KFE — `audit/deferred-ledger.md`), so these are fresh
findings, not folded debt.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-d-impl`, so the wave's
framing is honest:

1. **The managed-animation pause contract is IMPLEMENTED but the cross-class
   contract is not documented in one place.** A managed child (`managed = true`,
   set at `group.ts:126`) throws on direct `play()` (`engine.ts:779-782`:
   "Animation.play() called on a managed animation — the AnimationGroup owns the
   rAF loop. Call group.play() instead."). But the PAUSE path is more subtle: the
   group's `pause()` propagates to every child via `anim.pause()`
   (`group.ts:530-538`) and sets each child's `pausedTime` from the group's LAST
   rAF timestamp (NOT `performance.now()`) so resume adjusts `startTime` without a
   forward jump (`group.ts:533-537`, the inline comment names the reason). The
   group's `resume()` un-pauses every child DIRECTLY (`entry.animation.paused =
   false`, `group.ts:556-558`) — explicitly NOT via `child.resume()`, because
   `child.resume()` would start each child's OWN rAF loop and race the group's
   draw loop (`group.ts:548-550`, the docstring names it). The individual
   `Animation.pause`/`resume` (`engine.ts:821-844`) each carry their own honest
   docstrings (pause pauses, never secretly resumes; resume nudges the WAAPI
   compositor directly to avoid racing the shadow loop, `engine.ts:831-841`).
   **The pieces are each documented at their site; what's MISSING is the ONE
   contract statement** — "a managed child's lifecycle is owned by the group: the
   group ticks, pauses, resumes, and settles it; the child must not drive its own
   loop; the group's pause uses the last rAF clock so resume is jump-free" —
   spanning `group.ts` ↔ `engine.ts` ↔ the `src/animation/CLAUDE.md` class notes.

2. **`tryParseCache` is an UNBOUNDED `Map`.** `src/animation/utils.ts:145`
   declares `const tryParseCache = new Map<string, ValueArray>()`; it is read at
   `:183` (`tryParseCache.get(cacheKey)`) and written at `:209`
   (`tryParseCache.set(cacheKey, parsed.clone())`). The `cacheKey` is
   `` `${childKey}:${strValue}` `` (`:182`) — the parsed-value memo keyed by
   sub-property + the raw string. It has **NO eviction**: every distinct
   `(childKey, value-string)` pair ever parsed across the process lifetime stays
   resident. For a long-lived editing session that types many distinct keyframe
   values (the demo's CSS editor churns unique strings on every edit), the map
   grows monotonically. This is the ONLY unbounded cache in the engine's parse
   path — the other memoization (value.js `memoize()`, the per-target frame
   buffers) is bounded by its inputs.

3. **The engine has ZERO other BOOK items.** The assay's engine lane
   (`audit/modern-web-findings.md` §2) and the perf lane found NO other
   housekeeping: no hot-path allocation (D.W4's zero-alloc held —
   `proof:zero-alloc`), no stale docstring (D.W4 swept them), no `| any` widening
   (D.W4 tightened `leaves.ts`), no deprecated re-export (D.W4 deleted
   `utils.ts`/`format.ts`'s path-compat blocks). The two items above are the
   COMPLETE engine BOOK set — and one of them (item 2) ships only if it MEASURES.

The wave's job: document the managed-pause contract in ONE place, and dispose
`tryParseCache` eviction MEASURE-FIRST — each closed by a re-runnable instrument
(a doc-presence grep + a bench delta), with no regression to the exemplary engine.

---

## § Goal

**What lands:**
- **The managed-animation pause contract DOCUMENTED in one place** — a
  consolidated note (in `src/animation/CLAUDE.md`'s `AnimationGroup` class section,
  cross-linked from a short `group.ts` docstring above `pause`/`resume`) that
  states the full lifecycle contract: the group OWNS a managed child's loop; the
  child must not drive its own rAF (it throws on `play()`); the group's `pause`
  propagates + records the last rAF clock so `resume` is jump-free; the group's
  `resume` un-pauses children directly (never `child.resume()`) to avoid racing
  the draw loop. **A comment/CLAUDE.md note, NOT code** — the behaviour is already
  correct (D.W4 landed the honest API); E records the contract, it does not
  re-implement it.
- **`tryParseCache` eviction DISPOSED measure-first** — a bench that drives the
  parse path with a large, diverse string set (the editing-session profile)
  measures whether the unbounded map's growth materially costs (memory headroom /
  GC pressure / lookup time). IF it measures a real cost, a bounded eviction (an
  LRU cap, or a `WeakRef`/size-capped `Map`) lands. IF it is within noise (the
  expected outcome — the demo's distinct-string count over a session is modest and
  `ValueArray.clone()` per hit is the dominant cost, not the map size), it is
  **recorded-withheld with the measurement** (the D-3 discipline — a change ships
  on a measured win or not at all).
- **The BOOK items recorded with `file:line`** in the wave + carried to E.W6's
  close ledger (each with its disposition: DOCUMENTED / LANDED-on-measure /
  RECORDED-WITHHELD).

**Why:** the engine is at gestalt — the honest move is to RECORD, not refactor.
The managed-pause contract is correct but its statement is scattered across three
files; a single consolidated note makes the contract discoverable without changing
a line of behaviour. `tryParseCache`'s unbounded growth is a real LATENT concern
(a monotonic map in a long session), but "unbounded" is not "costly" until
measured — adding an LRU to a cache that never grows large is speculative
complexity (anti-KISS), so the disposition is measure-first. Both are BOOK
discipline: name the thing, prove whether it matters, act only on the proof.

---

## § Scope

### S1 — Document the managed-animation pause contract (a NOTE, not code) — engine lane BOOK item 1

**WHAT:** a single consolidated contract statement, landed as documentation:

- **In `src/animation/CLAUDE.md`** — extend the `AnimationGroup<V>` class section
  (the `Draw loop rides its readonly playback…` bullet list) with a
  **managed-lifecycle contract** sub-note: a managed child (`managed = true`) is
  loop-owned by the group; it throws on direct `play()` (the group owns the rAF
  loop); the group's `pause()` propagates to every child AND records the last rAF
  timestamp on each child's `pausedTime` so `resume()` adjusts `startTime` without
  a forward jump; the group's `resume()` un-pauses children DIRECTLY (sets
  `paused = false`, never calls `child.resume()`) so the child's own rAF loop never
  races the group's draw loop; `settle()` releases the child (`managed = false`).
- **In `group.ts`** — a short docstring line above `pause`/`resume` (or a single
  block above the pair) pointing at the CLAUDE.md contract, so a reader in the
  code finds the statement. The existing per-method docstrings
  (`group.ts:513-522` pause, `:546-552` resume, `:571-576` settle) already carry
  the WHY at each site; S1 adds the ONE place that states the WHOLE contract +
  the cross-link.

**NO code change.** The behaviour is correct (D.W4's honest `pause`/`resume`/
`toggle` + the jump-free pausedTime + the no-race resume). S1 is purely the
contract STATEMENT — a comment/doc, exactly the plan's "a comment/CLAUDE.md note,
not code."

**WHY:** the managed-pause contract is the subtlest lifecycle invariant in the
group (the last-rAF-clock for jump-free resume; the direct-un-pause to avoid the
draw-loop race) — each piece is documented at its SITE, but no single place states
the contract a consumer must honor. A consolidated note makes it discoverable
(a reader asking "how does a managed child pause?" finds ONE answer), with zero
behaviour risk. The no-legacy mandate forbids a latent, undocumented contract;
KISS favors a note over a refactor of correct code.

### S2 — `tryParseCache` eviction — MEASURE-FIRST — engine lane BOOK item 2

**WHAT:** dispose the unbounded `tryParseCache` (`utils.ts:145`, read `:183`,
write `:209`) measure-first:

- **The bench (the gate is a delta, not an assertion).** Extend
  `bench/parser.bench.ts` (the existing parse bench) with an
  **editing-session profile**: drive `parseAndFlattenObject` with a large, diverse
  set of distinct `(childKey, value-string)` pairs (simulating a long editing
  session that types many unique keyframe values), measuring (a) the map's
  resident size growth, (b) per-parse wall-time as the map grows, and (c) GC
  pressure / heap headroom. Compare against a bounded variant (an LRU cap, or a
  size-capped `Map`).
- **The disposition:**
  - **IF it measures a real, reproducible cost** (the map grows large enough that
    memory headroom or lookup degrades materially over a realistic session), a
    **bounded eviction lands** — the minimal correct form (an LRU cap sized to the
    measured working set, or a size-capped `Map` that drops the oldest entry past
    a cap). The cache stays a hit on the hot keys; only the cold tail evicts.
  - **IF it is within noise** (the expected outcome: the demo's distinct-string
    count over a session is modest, the cache's `parsed.clone()` per-write/per-hit
    is the dominant cost — not the map's SIZE — and the working set is small), it
    is **recorded-WITHHELD with the measurement** in the wave + E.W6's ledger.

**WHY:** an unbounded `Map` in a long-lived process is a real latent concern (a
monotonic cache that never evicts), and naming it is BOOK discipline. But
"unbounded" ≠ "costly": adding an LRU to a cache that never grows large is
speculative complexity — anti-KISS, and exactly the kind of premature
optimization the no-workaround mandate disfavors. The honest disposition is
measure-first (the D.W4 D-3 discipline applied to the engine): the bench PROVES
whether eviction matters; the change ships on the proof or is recorded-withheld
with the number. No speculative cache machinery.

### S3 — The `proof:engine-book` instrument — the falsifiable close

**WHAT:** the BOOK items closed by a re-runnable instrument. The engine already
ships `proof:engine` (`scripts/proof-engine.mjs`, wired `npm run proof:engine`);
E.W5 extends it (or adds a sibling clause) that BITES on:

1. **The managed-pause contract is documented.** A grep asserts
   `src/animation/CLAUDE.md` carries the managed-lifecycle contract note (the
   key phrases: a managed child is loop-owned; the group's pause records the last
   rAF clock; resume un-pauses directly to avoid the draw-loop race) AND `group.ts`
   carries the cross-link docstring above `pause`/`resume`. BITES: stub the note
   → the grep reds.
2. **`tryParseCache` disposition is honored.** EITHER (LANDED) a grep asserts a
   bounded eviction is present (an LRU/size-cap around `tryParseCache`) AND the
   bench shows the measured win; OR (WITHHELD) the bench result is recorded in the
   wave/ledger and `tryParseCache` stays the documented unbounded memo with the
   measurement noted. BITES: a claim of eviction with no measured win → reds; a
   silent unbounded map with no recorded disposition → reds (P-invariant-28: no
   un-dispositioned item).
3. **The engine stays green + exemplary — no regression.** `npm test` stays green
   (the no-regression baseline; the docs change touches no behaviour; the
   eviction, if landed, is covered by a unit test asserting hot-key hits survive +
   the cold tail evicts); `proof:boundary` (the light/heavy edge), `proof:zero-alloc`
   (D.W4's composite), and the engine's modern-web alignment (E-1..E-6, ALIGNED)
   are UNTOUCHED. BITES: a test regression → reds.

**WHY:** even a BOOK-only wave closes on a gate that bites (inv ε). A doc-presence
grep is the falsifiable form of "the contract is documented"; a bench-delta +
disposition check is the falsifiable form of "`tryParseCache` was disposed
measure-first, not hand-waved." Each reds on the exact lapse this wave forbids
(an undocumented contract; an un-dispositioned cache), so "engine housekeeping
done" means what it says — even when the housekeeping is mostly RECORD.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real grep / bench /
test, not an assertion):

1. **The managed-pause contract is documented.** `proof:engine-book` clause 1:
   `src/animation/CLAUDE.md` carries the consolidated managed-lifecycle contract
   note + `group.ts` carries the cross-link. BITES: stub the note → reds.
2. **`tryParseCache` is disposed measure-first.** `proof:engine-book` clause 2:
   EITHER a bounded eviction landed WITH a measured bench win (the `bench/parser.bench.ts`
   editing-session profile shows the real cost the eviction removes), OR the bench
   result is recorded-withheld in the wave/ledger and the unbounded memo stays
   documented as deliberate-on-measurement. BITES: eviction-without-a-win, or an
   un-dispositioned unbounded map, reds (P-invariant-28).
3. **No regression — the engine stays exemplary.** `npm test` stays green (the
   docs change is behaviour-free; the eviction, if landed, carries a unit test:
   hot keys hit, the cold tail evicts, no parse-correctness change);
   `proof:boundary`, `proof:zero-alloc`, and the engine's modern-web alignment
   (E-1..E-6) are UNTOUCHED. The no-regression baseline is the live `npm test`
   count at E.W5-open; the gate is **no-regression + (if S2 lands) the new eviction
   test passes**.
4. **No new legacy, no speculative complexity.** S1 adds no code; S2 adds eviction
   ONLY on a measured win (else nothing ships but the recorded measurement). No
   speculative cache machinery, no behaviour change to the exemplary engine.

---

## § Folds

Retires (by finding id):
- **engine-lane BOOK item 1** (the managed-animation pause contract — documented,
  not coded) — S1 + S3.1.
- **engine-lane BOOK item 2** (`tryParseCache` eviction — measure-first) — S2 +
  S3.2.

**Routed OUTWARD / RECORDED (not this wave):**
- **The engine's 6 ALIGNED modern-web items** (E-1..E-6:
  `scheduler.yield`/`reduced-motion`/WAAPI/`linear()`/ScrollTimeline/no-sinks) —
  the engine is the reference impl; E LEAVES them (`audit/modern-web-findings.md`
  §2). Recorded as ALIGNED, no work.
- **`springLinearStops()` stability** — the OUT enabler for glass-ui's VAL-9
  (`--spring-*` codegen, ASK-2). E keeps the export stable; the codegen is
  glass-ui's arm (inv-16). RECORDED.
- **ScrollTimeline-native, Worker/OffscreenCanvas** — ARCH kills recorded in D;
  do NOT re-litigate (`audit/deferred-ledger.md`). The JS-driven ScrollTimeline is
  the correct primitive (keyframes animates arbitrary objects, not just DOM scroll
  effects).

---

## § Design decisions

1. **Document the contract — don't re-implement correct behaviour.** RESOLVED:
   the managed-pause behaviour is correct (D.W4 landed the honest API, the
   jump-free pausedTime, the no-race resume). The GAP is documentation discovery,
   not behaviour — so S1 is a NOTE (CLAUDE.md + a cross-link docstring), zero code.
   Trade-off: a doc note is "just words" — but a scattered correct contract IS a
   latent maintenance hazard (the next editor of `group.ts`/`engine.ts` must
   re-derive the last-rAF-clock + no-race-resume invariants from three files); one
   stated contract closes that. The no-legacy mandate forbids a latent contract;
   KISS forbids refactoring correct code to "document" it.

2. **`tryParseCache` eviction is MEASURE-FIRST — `unbounded` ≠ `costly`.**
   RESOLVED: an unbounded `Map` is a real latent concern WORTH naming (a monotonic
   cache, `utils.ts:145`), but eviction ships ONLY on a measured cost. The expected
   outcome is recorded-withheld: the demo's distinct-string count over a session is
   modest, and the cache's dominant cost is `ValueArray.clone()` per hit
   (`:185`/`:209`), not the map's SIZE — so an LRU would add complexity without a
   win. The honest disposition is the D-3 measure-first discipline: the bench
   proves it or the change is withheld with the number. Trade-off: measure-first is
   slower than "just add an LRU" — but a speculative LRU on a small cache is
   anti-KISS complexity the no-workaround mandate disfavors; the measurement is the
   correct gate.

3. **E barely touches the published library — and says so honestly.** RESOLVED +
   HONEST (inv ε): the assay found the engine EXEMPLARY (6 ALIGNED, 0 GAP); this
   wave's two items are a doc note + a measure-gated micro-edit, both BOOK-class.
   The FINAL must not overclaim "E hardened the engine" — it claims "E recorded the
   engine's gestalt: documented the one scattered contract, disposed the one
   unbounded cache measure-first, and confirmed the 6 modern-web alignments." The
   dominant verb is RECORD. The engine was D's terminal transposition home; E
   inherits an exemplary surface and keeps it that way — barely editing, honestly
   recording.
