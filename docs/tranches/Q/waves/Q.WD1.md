# Q.WD1 — NaN-frame proper cure: named scroll selectors stay opaque at ingest; deferred resolution at attach; typed throw at play-without-timeline (DM-22 TERMINAL)

**Band:** D — Correctness.
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. The enabling sub-wave Q.WD1-bind (the `bindTimeline` attach seam) is authored here and must land FIRST (gate-enforced ordering).
**Sequence (DAG edges):**
```
Q.WA3 master-merge ─► Q.WD1-bind (attach-time deferred-resolution seam, this wave § sub-wave)
                            │
                            ▼
                       Q.WD1 (play-time NAMED_SELECTOR_NO_TIMELINE guard — NEVER a parse-throw)
```
The sub-wave ordering is **gate-enforced** by `proof:nan-frame`: the gate asserts BOTH the S4-level `fromString` round-trip (the parse must not throw on `entry`/`exit`) AND no-NaN-at-play (the named-selector value resolves before the sort). Landing the guard BEFORE `Q.WD1-bind` would re-break the L.W1 S4 opaque-ingest floor — the exact trap the impl drive fell into when it added a parse-time throw and had to revert it.

**Owning chronic/DM:** **DM-22** (named-selector NaN-frame, a confirmed-live 4-tranche chronic: developed at M.W5, specced at O.W3 as Path A throw, REVERTED in the impl drive because `fromString` calls `parse()` unconditionally and a parse-time throw poisons the opaque-ingest contract, explicitly deferred in shipped code at `frame-compiler.ts:449`). Audit lanes: **B2-pw9-nanframe**, **B5-kf-engine-arch**. Cross-referenced in: `B3-chronic-ledger`, `B6-dag-ordering`.

This wave **supersedes O.W3 Path A** (the structured throw at `parse()` time — REVERTED because it broke the L.W1 S4 floor) and **implements Q Band D Path B** (deferred resolution at `bindTimeline` attach + a typed throw ONLY at `play()`/`at()` when no timeline is bound). It inherits the deferred-resolution spec from `frame-compiler.ts:449–461` (the shipped deferred-ledger comment that was the impl drive's honest EXIT marker) and the `PHASE_FRACTIONS` resolver from `scroll-scene.ts:99–107` (already exists, already correct, already disconnected from the frame pipeline — Q.WD1-bind is the seam that connects them).

---

## Context

### The exact defect chain (all refs verified on today's tree, 2026-06-23)

The NaN-frame bug is confirmed live. The defect chain, inherited from the B2-pw9-nanframe audit:

| Step | Location | Verified fact |
|------|----------|---------------|
| 1 | `frame-compiler.ts:128` | `NAMED_SELECTOR_SUPERTYPE = "named-selector"` (const decl at line 128) — WRITTEN in `addFrame` at lines 229–231 (the `new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` ctor), never READ in `parse()`, `engine.ts`, or `timeline.ts` (dead write — `superType` carries it but nothing keys on it); `NAMED_SELECTOR_NO_TIMELINE` typed at `errors.ts:46`, never thrown (zero throw sites in `src/animation/`) |
| 2 | `frame-compiler.ts:228–231` | `SELECTOR_NAMED_RANGE_RE.test(selector)` (line 228) → `addFrame` stores `new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])` (lines 229–231) with `.value = "entry"` (the raw string) — the L.W1 S4 opaque-ingest floor: `fromString` ingests + round-trips verbatim, NO throw. (`ValueUnit` ctor = `(value, unit?, superType?, …)` — value.js `units/index.ts:26–33`; `superType` is `string[]`.) |
| 3 | `frame-compiler.ts:462` | `parse()` sorts `templateFrames` by `(a, b) => a.start.value - b.start.value` (line 462, inside `parse()` declared at 446) → `"entry" - "exit"` = `NaN` (the sort line itself is the NaN producer; the shipped deferred comment at lines 449–461 names this explicitly) |
| 4 | `utils.ts:398` | `calcFrameTime`: `start: (start.value * duration) / 100` (line 398) → `"entry" * 1000 / 100` = `NaN` (`stop` at line 399 likewise) |
| 5 | `internal/binarySearch.ts:32–33` | The range comparisons (`binarySearchRange` while-loop, lines 29–35): `if (value < getStart(item)) hi = mid - 1; else if (value > getStop(item)) lo = mid + 1; else return mid;`. With `getStart`/`getStop` = `NaN`, `value < NaN === false` AND `value > NaN === false` → the `else return mid` fires for ANY `value` → the NaN-bounded frame is returned as the containing range (effectively ALWAYS-ACTIVE); every `interpFrames(t)` applies its vars at every progress position |
| 6 | `internal/errors.ts:46` | `NAMED_SELECTOR_NO_TIMELINE` typed at `errors.ts:46` (in `AnimationOptionErrorCode`), zero throw sites (confirmed: `grep -rn "NAMED_SELECTOR_NO_TIMELINE" src/animation/` → only `errors.ts:46` + the `frame-compiler.ts` comment refs, no `throw`) |
| 7 | `scripts/proof-nan-frame.mjs` | ABSENT (`ls scripts/proof-nan-frame.mjs` → no file) — this wave authors it |
| 8 | `scripts/proof-replay-equality.mjs:173–178` | The S4 `requireAll("named-selector", FRAME_COMPILER, […])` clause (block at lines 173–178; comment at 169–172) is a SOURCE-SHAPE REGEX over `frame-compiler.ts` (`re: /entry\s*\|\s*exit\s*\|\s*cover\s*\|\s*contain/` at line 176) — GREEN when "the token set appears in the guard," BLIND to whether frame times are NaN (the inv-M-observable-truth proxy failure) |

### Why Path A was correct for O.W3 but incorrect for the shipped tree

O.W3 (Path A) specified a throw at `parse()` time — correct at O.W3's tree because `fromString` then only called `addFrame()` + `parse()`, so a throw at `parse()` was reachable before the ingest floor was hardened. The impl drive REVERTEd Path A because, on the 4.4.0 tree, `fromString` calls `this.parse()` UNCONDITIONALLY at `engine.ts:1365` — and `replay-equality.test.ts:83` asserts `fromString(entry/exit css)` does NOT throw (the L.W1 S4 opaque-ingest contract). A parse-time throw on named selectors poisons the floor.

The shipped comment at `frame-compiler.ts:449–461` is the honest deferred-ledger EXIT marker:

> "P.W9 (DM-22 named-selector NaN-frame) — DEFERRED to a follow-up wave. A scroll-range named selector … is stored opaquely … so it INGESTS and round-trips VERBATIM (the L.W1 S4 floor — `fromString` must not throw). The correct cure is NOT a throw at parse() (that poisons the opaque-ingest floor): it is a deferred-resolution step that maps the named phase to a numeric `%` under a ScrollTimeline/ManualTimeline at attach time, refusing with the structured `NAMED_SELECTOR_NO_TIMELINE` only at the genuinely-demanded PLAY-without-timeline point."

That comment specifies Q.WD1 exactly. This wave implements it.

### The resolver ALREADY EXISTS — Q.WD1-bind is the connection seam

`scroll-scene.ts:99–107` already defines the `PHASE_FRACTIONS` table (with the correct CSS scroll-driven animation semantics):

| Name | start | end |
|------|-------|-----|
| `entry` | 0.0 | 0.25 |
| `cover` | 0.25 | 0.75 |
| `contain` | 0.375 | 0.625 |
| `exit` | 0.75 | 1.0 |

`scroll-scene.ts:134–154` defines `boundaryFraction(boundary, fallback)` — resolves a `RangeBoundary` with a `phase` field to a `[0,1]` fraction, with explicit `%`-offset-within-phase support (e.g. `entry 50%` = 0.5 * (0.25 − 0) + 0 = 0.125). The `namedSelectorToFraction` function this wave introduces extracts just the key-selector-to-number step from this existing logic.

The bare-form mapping rule (currently under-specified): `frame-compiler.ts:107` says bare `entry` maps to `entry 0% 100%` — a range, but a keyframe selector is a single position. A bare `entry` in a keyframe selector means "the start of the entry phase" — `PHASE_FRACTIONS["entry"].start = 0.0`. `entry 50%` is 50% through the entry band = `0.0 + 0.5 * 0.25 = 0.125`. This spec locks the single-position mapping.

### Why there is NO `bindTimeline` method on the engine today

`grep "bindTimeline\|attachTimeline\|setScrollTimeline" src/animation/engine.ts` → ZERO. `scrollOptions` (`engine.ts:1287`) is recovered from `fromString` but consumed ONLY by `compileToCSS` to re-emit the longhands — it is a metadata field, NOT a resolution-trigger. The named-selector frames sit unresolved from `addFrame` through `parse()` until the NaN sort. Q.WD1-bind creates the missing seam.

### Friction origin: why the sub-wave must land first

The guard (`S3`) throws `NAMED_SELECTOR_NO_TIMELINE` at `play()`/`at()` time when ANY frame has an unresolved named-selector start. If the guard lands WITHOUT Q.WD1-bind (the resolver), `play()` on a legitimately-timeline'd animation (a `ScrollTimeline` scroll scene with `entry`/`exit` frames) would ALSO throw — a false-positive that breaks valid use. The sub-wave provides `namedSelectorToFraction` + the `bindTimeline(timeline)` method that resolves the named frames to numeric `%` AT ATTACH, so the guard's "no timeline present" check only fires when there genuinely is no timeline. The gate `proof:nan-frame` asserts BOTH conditions atomically — it cannot fully green until BOTH the bind seam and the guard are present.

---

## Sub-wave: Q.WD1-bind — the attach-time deferred-resolution seam (enabling precondition)

This sub-wave authors the SEAM that Q.WD1's guard extends. It must be implemented BEFORE S3.

### Q.WD1-bind S1 — `namedSelectorToFraction(selector): number` extracted from scroll-scene.ts

**Breach.** No standalone `namedSelectorToFraction` function exists on the frame-compiler path. `PHASE_FRACTIONS` lives in `scroll-scene.ts` — a HEAVY module (it statically imports value.js via the scroll adapter). Importing `scroll-scene.ts` directly in `frame-compiler.ts` would couple two HEAVY modules AND pull scroll-scene's value.js edge into the frame-compiler, a structural entanglement.

**Cure.** Extract `namedSelectorToFraction(rawSelector: string): number` into a small in-file helper (or a sibling `internal/named-selector.ts`, value.js-free) that:

1. Parses the raw named selector against a CAPTURING variant of the existing guard regex — `NAMED_SELECTOR_CAPTURE_RE = /^(entry|exit|cover|contain)(?:\s+(\d+(?:\.\d+)?)%)?$/i` (NOTE: the existing `SELECTOR_NAMED_RANGE_RE` at `frame-compiler.ts:117–118` is NON-capturing — `/^(?:entry|exit|cover|contain)(?:\s+\d+(?:\.\d+)?%)?$/i` — so it validates but cannot extract; the helper needs its OWN capture-group regex to pull `[phase, offset]`. The two stay in lock-step: the same token set, the same shape, differing only in the capture groups). Group 1 is the phase; group 2 (optional) is the offset `%` numeral.
2. Looks up the matched phase in a LOCAL copy of the FOUR keyframe-reachable `PHASE_FRACTIONS` entries (`entry`→{0,0.25}, `exit`→{0.75,1}, `cover`→{0.25,0.75}, `contain`→{0.375,0.625} — the exact values at `scroll-scene.ts:101–104`; `normal`/`*-crossing` are NOT in the keyframe-selector grammar so they are not copied). The local copy duplicates the DATA, not the logic — value.js-free, numeric constants, no runtime import.
3. If an offset `%` is present (capture group 2 matched): `span.start + (offset / 100) * (span.end - span.start)` — matching `boundaryFraction`'s arithmetic at `scroll-scene.ts:146` (where `offsetToFraction` has already divided the raw `%` by 100, so the helper's `offset / 100` is the same fraction).
4. If no offset: `span.start` (the start of the phase — the single-position rule for bare `entry`, locking the under-specified `frame-compiler.ts:107` comment).
5. Returns a `[0, 1]` number. Never returns `NaN` — the `SELECTOR_NAMED_RANGE_RE` guard (`addFrame`, line 228) has already validated the input; any string reaching this function is a conforming named selector. (Defensive: if `NAMED_SELECTOR_CAPTURE_RE` somehow fails to match, throw the typed `NAMED_SELECTOR_NO_TIMELINE`-adjacent error rather than returning `NaN` — never invent a silent number.)

**Constraint (value.js-free, LIGHT-compatible).** This helper lives in `frame-compiler.ts` (not imported from `scroll-scene.ts`). The PHASE_FRACTIONS constants are inline numeric literals — no import, no dependency. The frame-compiler is already HEAVY (it imports `@mkbabb/value.js` via `utils.ts`/`adapter.ts`); the helper is HEAVY in the SAME chunk — no boundary breach.

**Gate bite.** `proof:nan-frame` `bind-resolves` clause: `namedSelectorToFraction("entry") === 0`, `namedSelectorToFraction("cover") === 0.25`, `namedSelectorToFraction("entry 50%") === 0.125`, `namedSelectorToFraction("exit") === 0.75`. Today: function does not exist → RED.

### Q.WD1-bind S2 — `bindTimeline(timeline: Timeline): this` on `CSSKeyframesAnimation`

**Breach.** No `bindTimeline` / `attachTimeline` / `setScrollTimeline` method exists on `Animation` or `CSSKeyframesAnimation` (`grep "bindTimeline\|attachTimeline\|setScrollTimeline" src/animation/engine.ts` → ZERO). Named-selector frames sit unresolved from `addFrame` through `parse()` with no attach-time hook.

**Cure.** Add `bindTimeline(timeline: Timeline): this` to `CSSKeyframesAnimation` (NOT to the base `Animation` class — `bindTimeline` is a scroll-context operation specific to CSS keyframes with named selectors; the base class is value.js-agnostic):

1. **Store the timeline reference** on `this._boundTimeline?: Timeline` (a private field, `undefined` by default).
2. **Walk `this.compiler.templateFrames`**: for each frame where `frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)`, replace `frame.start` with `new ValueUnit(namedSelectorToFraction(String(frame.start.value)) * 100, "%")` — a proper numeric percentage `ValueUnit`. The `NAMED_SELECTOR_SUPERTYPE` tag is CLEARED (not present on the replacement) so the resolved frame is indistinguishable from an author-written `%` selector at the sort step.
3. **Trigger a re-compile**: if `this.compiler.frames.length > 0` (already parsed), call **`this.parse()`** — the `Animation.parse()` wrapper (`engine.ts:352`) that delegates to `this.compiler.parse(this.targets)` with the live target list (the public `targets` field, `engine.ts:106` — NOT a private `_targets`). This re-compiles with the now-numeric starts. If not yet parsed, the next `parse()` call will find only numeric starts and proceed normally.
4. **Return `this`** (fluent).

**Constraint (idempotent, safe to call before `fromString`).** If called before `addFrame` populates `templateFrames`, the walk is a no-op (no named frames exist yet). If called AFTER `parse()` has already run (and produced NaN frames), the re-compile purges the NaN frames and produces correct ones. `bindTimeline` is idempotent: calling it twice with the same or different timeline overwrites `_boundTimeline` and re-walks.

**The no-timeline guard (S3) reads `_boundTimeline`.** At `play()`/`at()` time, if ANY frame in `templateFrames` still carries `NAMED_SELECTOR_SUPERTYPE` (unresolved — `bindTimeline` was never called), the guard throws `NAMED_SELECTOR_NO_TIMELINE`. A resolved frame (cleared superType) passes silently.

**Gate bite.** `proof:nan-frame` `bind-resolves` clause: after `bindTimeline(new ManualTimeline())` on a `fromString` animation with `entry`/`exit` frames, all `frame.time.start` values are finite. Today: no `bindTimeline` method → RED.

---

## Scope

### S1 — `fromString` / `parse()` NEVER throws on named selectors; round-trip is verbatim (the L.W1 S4 floor, held)

**Breach.** The L.W1 S4 floor requires that `new CSSKeyframesAnimation().fromString(css)` does NOT throw when `css` contains `entry`/`exit`/`cover`/`contain` keyframe selectors — the round-trip ingest floor. The impl drive's attempt to fix DM-22 via a parse-time throw BROKE this and was reverted (`frame-compiler.ts:449`). The floor must be held unconditionally by this wave.

**Cure.** S1 is a CONSTRAINT, not a new change. `addFrame` already stores named selectors opaquely (`new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE])`). `parse()` does NOT scan for named selectors (the deferred comment at lines 449–461 is kept as a record; the NaN sort is not yet fixed at this step — it is fixed by `bindTimeline` being called BEFORE `parse()` resolves the frame times). The cure for the NaN is in `bindTimeline` (Q.WD1-bind S2), not in `parse()`. The `parse()` path for named selectors remains: opaque store → NaN sort → NaN `calcFrameTime`. The guard (S3) then fires at play time.

**Constraint.** NO changes to `addFrame`, NO changes to `parse()`, NO throw of any kind on a named selector input before `play()`/`at()`. This wave's cure is additive: it adds `namedSelectorToFraction` + `bindTimeline` + the play-time guard. The existing opaque-ingest path is unchanged.

**Gate bite (S1 = the existing L.W1 S4 floor, now asserted by proof:nan-frame).** `proof:nan-frame` `s4-ingest-roundtrip` clause: `new CSSKeyframesAnimation().fromString('@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }')` does NOT throw AND the raw `String(frame.start.value)` of the first template frame contains `"entry"`. Today: this passes (the floor holds); the gate asserts it stays green after the Q.WD1 changes.

**The born-RED for this clause** is a planted regression (the guard S3 must not over-throw): a `fromString` with a named selector followed immediately by `play()` must NOT throw `NAMED_SELECTOR_NO_TIMELINE` if `bindTimeline` was called first. Without the bind-first guard, a naive S3 implementation would throw on every named-selector animation even when a timeline is present.

### S2 — `bindTimeline(timeline)` resolves named selectors to numeric `%` before the sort (Q.WD1-bind S2)

See Q.WD1-bind S2 above (the full spec lives in the sub-wave section). From the wave-scope perspective:

**Breach.** No resolution seam exists. Named frames sit as NaN-producing opaque strings from `addFrame` through `parse()` without a hook to convert them to numeric `%` at attach time.

**Cure.** Implement Q.WD1-bind S2: `bindTimeline(timeline: Timeline): this` on `CSSKeyframesAnimation` — walks `templateFrames`, resolves each named-selector start to a numeric `%` via `namedSelectorToFraction`, clears the `NAMED_SELECTOR_SUPERTYPE` tag on the replacement, triggers a re-compile. The SORT at `parse()` line 462 then operates on numeric values → no NaN.

**Gate bite.** `proof:nan-frame` `no-nan-at-play` clause: after `bindTimeline(new ManualTimeline())` + the re-compile, (a) every `frame.time.start` is `Number.isFinite` AND (b) **`at(0)` / `at(0.5)` / `at(1)` and `play()` do NOT throw `NAMED_SELECTOR_NO_TIMELINE`** (the bound path is clean — the guard's superType-scan finds zero unresolved frames because `bindTimeline` cleared every `NAMED_SELECTOR_SUPERTYPE` tag). Clause (b) is the ORDERING ENFORCER: it goes RED if S3's guard lands without S2's resolver (the guard would over-throw on a legitimately-bound animation — the false-positive the charter names). So `proof:nan-frame` cannot green unless S2 (bind/resolve) is present AND S3's guard reads the CLEARED tag — i.e. the guard provably cannot land before the attach-resolution. Today: no `bindTimeline` → RED (TypeError on the missing method).

### S3 — `play()` / `at()` throw `NAMED_SELECTOR_NO_TIMELINE` when named selectors remain unresolved (the play-time guard — NEVER at parse)

**Breach.** `NAMED_SELECTOR_NO_TIMELINE` is typed at `errors.ts:46` but has zero throw sites anywhere in `src/animation/` (`grep -rn "NAMED_SELECTOR_NO_TIMELINE" src/animation/` → `errors.ts` only). A named-selector animation `play()`d without a bound timeline silently produces always-active NaN frames (`binarySearchRange` treats the NaN range as ALWAYS-ACTIVE). This is the live DM-22 defect — confirmed by direct probe (`'entry' - 'exit'` → `NaN`, the binarySearch NaN-is-always-active behavior).

**Cure.** In `Animation.play()` (and `Animation.at()`), BEFORE starting the rAF/WAAPI loop, add a named-selector guard:

```ts
// Named-selector guard: if any template frame still carries NAMED_SELECTOR_SUPERTYPE
// (bindTimeline was never called to resolve it to a numeric %), refuse rather than
// producing NaN frames that binarySearchRange treats as ALWAYS-ACTIVE.
const unresolvedNamedFrame = this.compiler.templateFrames.find(
    f => f.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)
);
if (unresolvedNamedFrame != null) {
    throw new AnimationOptionError(
        "start",
        String(unresolvedNamedFrame.start.value),
        `named scroll-range selector ("${String(unresolvedNamedFrame.start.value)}") ` +
        `requires a ScrollTimeline or ManualTimeline — call bindTimeline(timeline) ` +
        `before play() to resolve the named phase to a numeric position`,
        "NAMED_SELECTOR_NO_TIMELINE",
    );
}
```

**Constraint (play-only, not parse).** The guard reads `NAMED_SELECTOR_SUPERTYPE` on the templateFrames at `play()` time — NOT at `parse()`, NOT at `addFrame()`, NOT at `fromString()`. The L.W1 S4 floor is unbroken: `fromString` + `parse()` still do not throw. The guard is the TYPED error that makes `NAMED_SELECTOR_NO_TIMELINE` live (the typed-never-thrown placeholder becomes a real code path — discharging the "dead write / typed-never-thrown" debt).

**Constraint (the at() guard — the oracle path).** `at(progress)` is the query API consumed by the differential oracle, scrub UIs, and tests. An unresolved named-selector animation calling `at()` would also produce NaN. The same guard applies to `at()` — same check, same error code. This prevents the differential oracle (Q.WD2's S3/S4) from seeing NaN values when exercising named-selector fixtures without a timeline.

**Gate bite.** `proof:nan-frame` `play-throws-no-timeline` clause: a named-selector animation that has NOT had `bindTimeline` called — `play()` throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"`. Today: `play()` does NOT throw (it silently runs with NaN frames) → RED.

### S4 — `proof:replay-equality` S4 clause re-targeted from source-shape proxy to behavioral anchor

**Breach.** `proof:replay-equality.mjs` S4 clause — the `requireAll("named-selector", FRAME_COMPILER, […])` block (lines 173–178; comment header at 169–172) with `re: /entry\s*\|\s*exit\s*\|\s*cover\s*\|\s*contain/` (line 176) — is a SOURCE-SHAPE REGEX over `frame-compiler.ts` — GREEN when "the token set appears in the guard," BLIND to whether frame times are NaN. This is the inv-M-observable-truth proxy failure that DM-22 has escaped for 4 tranches.

**Cure.** Replace the source-shape regex clause with a behavioral anchor that asserts the ROUND-TRIP is verbatim AND the bind-resolve path works:

1. `fromString('@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }')` does NOT throw AND `String(templateFrame.start.value)` contains `"entry"` — the ingest floor (S1).
2. After `bindTimeline(new ManualTimeline())`, `at(0)` and `at(1)` do NOT throw and return finite values — the resolved path works (S2 bind + S3 guard's "do not throw when resolved" branch).
3. Without `bindTimeline`, `play()` throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"` — the guard fires (S3).

The old source-shape regex is REPLACED (not kept alongside). The new behavioral anchor is the gate's durable standing proof.

**Gate bite.** The old S4 clause is GREEN on today's tree (the regex matches). After re-targeting: clause 1 stays green (the floor holds); clause 2 is RED today (no `bindTimeline` → `at()` produces NaN, not finite); clause 3 is RED today (no guard → `play()` does not throw). The re-targeted S4 goes RED until Q.WD1-bind + S3 land.

---

## Born-RED gate

**Gate:** `proof:nan-frame` (NEW — `scripts/proof-nan-frame.mjs`; this wave authors it). Four born-RED clauses, each asserting a RUNTIME observable — not a source-shape proxy.

**The REAL observables, witnessed on today's tree (2026-06-23):**

| Clause | Witness today (the GENUINE defect) | Failure mode today | Expected after the full cure |
|--------|-------------------------------------|--------------------|------------------------------|
| `s4-ingest-roundtrip` | `new CSSKeyframesAnimation().fromString('@keyframes x { entry {opacity:0} exit {opacity:1} }')` | does NOT throw (GOOD — the L.W1 S4 floor holds); `String(templateFrames[0].start.value) === "entry"` (GOOD — verbatim round-trip) | STAYS green — the cure must never break this |
| `no-nan-at-play` | after `bindTimeline(new ManualTimeline())` + re-compile: (a) `frame.time.start` values, (b) `at(0)`/`at(0.5)`/`at(1)`/`play()` on the BOUND animation | `bindTimeline` does not exist → TypeError; no ManualTimeline bind → NaN from the sort; AND (the ordering enforcer) a guard-before-resolver impl would over-throw `NAMED_SELECTOR_NO_TIMELINE` on the bound animation | (a) every `frame.time.start` is `Number.isFinite` after bind + re-compile AND (b) the bound animation's `at()`/`play()` do NOT throw (the guard reads the CLEARED superType tag) — so the gate cannot green unless the resolver precedes the guard |
| `play-throws-no-timeline` | `new CSSKeyframesAnimation().fromString(…).play()` without `bindTimeline` | does NOT throw — silently runs with NaN-poisoned frames (the DM-22 always-active defect) | throws `AnimationOptionError` with `code === "NAMED_SELECTOR_NO_TIMELINE"` |
| `bind-resolves` | `namedSelectorToFraction("entry")`, `namedSelectorToFraction("cover")`, etc. | function does not exist → ReferenceError | `namedSelectorToFraction("entry") === 0`, `("cover") === 0.25`, `("entry 50%") === 0.125`, `("exit") === 0.75`, `("contain") === 0.375` |

**Born-RED on the keystone defect (the NaN-frame bug).** `play-throws-no-timeline` is the genuine observable of DM-22: `play()` on a named-selector animation without a timeline silently runs with NaN frames. Neither a parse-time throw (breaks L.W1 S4) nor a silent NaN (the current defect) is acceptable. Only the play-time guard (`NAMED_SELECTOR_NO_TIMELINE` at `play()`/`at()`) is the correct cure — and `proof:nan-frame` bites the GENUINE defect, not a proxy.

**Planted-failure (born-RED proof).** On an unmodified tree:
- `proof:nan-frame` `no-nan-at-play` exits 1: `bindTimeline` does not exist (TypeError), confirming the gate was authored before the cure.
- `proof:nan-frame` `play-throws-no-timeline` exits 1: `play()` does NOT throw (the NaN is produced silently, the always-active defect is live).
- `proof:nan-frame` `bind-resolves` exits 1: `namedSelectorToFraction` does not exist.
- `proof:nan-frame` `s4-ingest-roundtrip` PASSES today (the floor holds) — and must stay green after the cure.

**Ordering-enforcement plant (the impl-drive-trap regression test).** Beyond the four born-RED clauses, `no-nan-at-play` clause (b) is a STANDING regression catcher: an implementer who lands the S3 guard BEFORE the S2 resolver (the exact trap the impl drive fell into) makes the guard over-throw on the BOUND animation — `no-nan-at-play` (b) reds. There is no impl order in which the guard lands first and the gate greens. This is the gate-enforced sub-wave ordering the charter requires (Q.WD1-bind → Q.WD1).

**Green condition.** `namedSelectorToFraction` authored (Q.WD1-bind S1, correct mappings); `bindTimeline(timeline)` authored (Q.WD1-bind S2, walk + resolve + clear-tag + re-compile); `s4-ingest-roundtrip` stays green; `no-nan-at-play` green after bind + re-compile (finite frame times AND no over-throw on the bound animation); `play-throws-no-timeline` green (the guard throws only WITHOUT a timeline); `proof:replay-equality` S4 re-targeted off the source-shape proxy onto the behavioral anchor (S4). Every pre-existing `proof:replay-equality` clause stays green (non-named animations are byte-identical — the common path is untouched). `NAMED_SELECTOR_NO_TIMELINE` exits `errors.ts` as a live throw site (the typed-never-thrown placeholder becomes real).

**Wire into `proof:hygiene`** (`package.json:200`) alongside its named siblings `proof:engine-correctness` and `proof:replay-equality` — the headless blocking source+runtime tier where those two correctness gates actually live (VERIFIED 2026-06-23: `proof:correctness` at `package.json:199` is the LIVE/browser interaction tier — `engine-no-throw-on-play`, `subject-animates`, `easing-editor-live` — and does NOT contain `proof:engine-correctness`/`proof:replay-equality`). `proof:nan-frame` is a pure headless HEAVY-engine + frame-compiler runtime gate (no browser, no DOM beyond jsdom-free `ManualTimeline`), kf-internal, no sibling dependency, no `observe-only` posture needed — so `proof:hygiene` is its correct home.

---

## Dependencies

- **`scroll-scene.ts:99–107` PHASE_FRACTIONS — NOT imported, numeric constants only.** The named-phase-to-fraction logic is replicated as inline constants in `namedSelectorToFraction`, so `frame-compiler.ts` does NOT statically import `scroll-scene.ts`. This avoids a HEAVY→HEAVY structural coupling across unrelated modules. The duplication is intentional and BOOK-recorded.
- **`internal/errors.ts` `AnimationOptionError` / `NAMED_SELECTOR_NO_TIMELINE` — already imported** in `frame-compiler.ts` (the existing `AnimationOptionError` throw at line 204 proves the import is present). No new dependency.
- **`Timeline` abstract class from `timeline.ts` — import for the `bindTimeline` type signature.** `CSSKeyframesAnimation` is in `engine.ts`; `timeline.ts` is a sibling HEAVY module; the import is a type import (erased under `verbatimModuleSyntax`) for the parameter type. The runtime `_boundTimeline` field is typed as `Timeline | undefined` — the type is the only cross-module dependency; the VALUE is stored but not called by `bindTimeline` (the timeline value is stored for the guard check, not sampled here).
- **No sibling publish dependency.** Pure kf-internal: `frame-compiler.ts` (sub-wave + S3 guard), `engine.ts` (`bindTimeline` method on `CSSKeyframesAnimation`), `scripts/proof-nan-frame.mjs` (NEW), `scripts/proof-replay-equality.mjs` (S4 clause re-target), `package.json` (gate wiring).
- **Couples to Q.WD2 (the fuzz harness + differential oracle).** Q.WD2 authors `proof:grammar-fuzz` and `proof:kf-differential`. The differential oracle (Q.WD2 S3) exercises named-selector fixtures through the kf engine — those fixtures must NOT produce NaN after Q.WD1 lands, so Q.WD2 depends on Q.WD1 being present. The sub-wave ordering is: Q.WD1-bind → Q.WD1 → Q.WD2 (the differential oracle's named-selector arm turns from a skip to a real clause once Q.WD1 resolves them).
- **DAG: must sequence AFTER Q.WA3 master-merge.** The sub-wave (Q.WD1-bind) and the guard (S3) both touch `engine.ts` / `frame-compiler.ts`; the master-merge reconcile (Q.WA3) must be clean before any engine edits.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WD1 — DOCS ONLY. It writes zero engine, demo, or library source (inv-16: kf writes only keyframes.js). The IMPLEMENTATION opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WA3 master-merge. When it opens, the implementation order is:

1. **Gate-first** (the P-inv-28 born-RED requirement): author `scripts/proof-nan-frame.mjs` BEFORE any engine cure lands. Confirm `no-nan-at-play`, `play-throws-no-timeline`, `bind-resolves` all RED on today's tree. Confirm `s4-ingest-roundtrip` GREEN on today's tree (the floor holds).
2. **Q.WD1-bind S1** (the resolver): add `namedSelectorToFraction(rawSelector: string): number` to `frame-compiler.ts`. Run `proof:nan-frame` `bind-resolves` clause — confirm GREEN.
3. **Q.WD1-bind S2** (the seam): add `bindTimeline(timeline: Timeline): this` to `CSSKeyframesAnimation` in `engine.ts`. Walk `templateFrames`, resolve named-selector starts via `namedSelectorToFraction`, clear the `NAMED_SELECTOR_SUPERTYPE` tag, trigger re-compile. Run `proof:nan-frame` `no-nan-at-play` — confirm GREEN.
4. **S3 guard** (the play-time throw): add the `unresolvedNamedFrame` check at the top of `play()` and `at()`. Run `proof:nan-frame` `play-throws-no-timeline` — confirm GREEN. Confirm `s4-ingest-roundtrip` still GREEN (the guard does NOT throw at `fromString` time).
5. **S4 re-target**: update `proof-replay-equality.mjs` S4 clause off the source-shape regex onto the behavioral anchor (the three-condition check). Run `proof:replay-equality` — confirm all existing clauses GREEN.
6. **Wire `proof:nan-frame` into `proof:hygiene`** (`package.json:200`, alongside `proof:engine-correctness` + `proof:replay-equality` — the headless tier those siblings occupy; NOT `proof:correctness`, which is the browser/interaction tier). Run `proof:nan-frame` — confirm all four clauses GREEN.
7. **Confirm no regression**: `npm test` + `proof:engine-correctness` + `proof:replay-equality` all green. No non-named animation behavior changes (the `NAMED_SELECTOR_SUPERTYPE` scan is an `Array.find` over `templateFrames` — zero-cost on animations with no named selectors since the array contains only `%`/`from`/`to` starts which have no `superType`).

**Observable-truth.** The keystone clause is `play-throws-no-timeline` — the RUNTIME throw, not a source-shape grep. The `s4-ingest-roundtrip` clause holds the floor. The `no-nan-at-play` clause confirms the resolver is connected. The `bind-resolves` clause confirms the numeric mappings are correct. Together they prevent: (a) a regression that breaks the L.W1 S4 floor, (b) a stub that throws at `parse()` time (re-breaking the floor), (c) a guard that fires even when `bindTimeline` was called (false positive), and (d) a resolver that produces wrong numeric values (a silent precision bug).

---

## Mid-tranche friction pre-empted

1. **The bind-before-guard ordering trap.** The guard (S3) must land AFTER the resolver (Q.WD1-bind S2). If S3 lands first, it throws at `play()`/`at()` even on legitimately-bound scroll animations (false positive — the exact impl-drive trap). Pre-empted: the gate `proof:nan-frame` `no-nan-at-play` clause (b) asserts that AFTER `bindTimeline(new ManualTimeline())`, the bound animation's `at()`/`play()` do NOT throw — so a guard-before-resolver impl reds the gate (the guard over-throws on the cleared-tag-but-not-actually-cleared animation). There is no impl order in which the guard lands first and `proof:nan-frame` greens — the ordering is genuinely gate-enforced (dev→impl step 3 before step 4).

2. **The bare-form under-specification trap.** `frame-compiler.ts:107` says bare `entry` maps to `entry 0% 100%` — a range — but a keyframe selector is a single position. Ambiguity here would produce a wrong numeric value in `namedSelectorToFraction`. Pre-empted: Q.WD1-bind S1 locks the single-position rule (`PHASE_FRACTIONS[phase].start`) and the `bind-resolves` gate clause asserts the exact values (e.g. `namedSelectorToFraction("entry") === 0`, not `0.125` or `0.5`).

3. **The scroll-scene.ts import entanglement.** Importing `PHASE_FRACTIONS` from `scroll-scene.ts` in `frame-compiler.ts` would couple two unrelated HEAVY modules and pull scroll-scene's value.js edge into the frame-compiler path. Pre-empted: `namedSelectorToFraction` uses inline numeric constants (NOT a `scroll-scene.ts` import), recorded as an intentional BOOK duplication.

4. **The Q.WD2 fuzz-oracle blocked-on-NaN problem.** The differential oracle (Q.WD2 S3) must not produce NaN values when exercising named-selector keyframe fixtures. Pre-empted: Q.WD2's named-selector arm is documented as SKIPPED until Q.WD1 lands; once Q.WD1 resolves the named selectors (via a test-side `bindTimeline` call), the arm unfolds to a real clause. The gate ordering ensures Q.WD1 precedes Q.WD2.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| `s4-ingest-roundtrip` | A future "cure" adds a parse-time throw that breaks the L.W1 S4 opaque-ingest floor — the exact trap the impl drive fell into (reverted Path A). The clause bites any throw at `fromString`/`parse()` time on named selectors. |
| `no-nan-at-play` | `bindTimeline` is omitted, stubbed incorrectly, or the resolver produces wrong values — named-selector frames arrive at the sort with non-numeric starts, the sort produces NaN, `calcFrameTime` produces NaN, and `binarySearchRange` treats the frame as ALWAYS-ACTIVE. |
| `play-throws-no-timeline` | The guard is omitted or only fires at `parse()` time (wrong seam) — a named-selector animation `play()`d without a bound timeline runs silently with NaN frames, re-opening DM-22. |
| `bind-resolves` (numeric correctness) | `namedSelectorToFraction` returns wrong values (e.g. maps `"entry"` to `0.25` instead of `0.0`, or maps `"entry 50%"` to `0.5` instead of `0.125`) — the resolved `%` is wrong; the scroll animation runs against the wrong phase boundaries. |
| `proof:replay-equality` S4 behavioral anchor | The S4 clause relapses to a source-shape regex (matches "the token set appears in the guard") and goes blind to NaN frame times — the inv-M-observable-truth failure re-committed for another tranche. |

---

## Excluded from this wave

- **The full CDP differential path for named-selector fixtures** — that is Q.WD2 S3's WAAPI-eligible subset and its future full-corpus extension. Q.WD1 closes the defect; Q.WD2 exposes it in the differential oracle.
- **A `play(timeline)` API variant** (accepting a timeline directly at play-time) — an ergonomic extension, not a correctness requirement. `bindTimeline(timeline).play()` is the established fluent idiom; a play-time timeline parameter is a future additive wave.
- **Mapping named-selector frames to the CSS scroll-timeline `animation-range` longhands** in `compileToCSS` — a round-trip serialization concern. The resolved `%` values are internal; `compileToCSS` already re-emits `scrollOptions` as the authoritative scroll longhands. The resolved numeric `%` are implementation detail, not serialized.
- **The Grammar-fuzz harness (fast-check) and differential oracle** — those are Q.WD2. This wave closes the correctness defect; Q.WD2 builds the oracle infrastructure over the corrected surface.
