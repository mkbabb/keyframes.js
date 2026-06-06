# F.W8 — Capture the dropped adapter metadata (`animation-composition` + the style-rule `options`)

**Phase:** IMPL · **Class:** MINOR (the published library — one CAPTURE that makes a
documented-but-dead field do what it says, behaviour-changing at one input shape; the
`ResolvedKeyframes` interface gains one field) · **Scope:** `src/animation/adapter.ts`
(the AST→`ResolvedKeyframes` normaliser) + `src/animation/engine.ts` (`fromString`'s
consumption of `resolved.options`) — the kf-side consumption seam, file-disjoint from the
serializer wave (F7) and the engine perf band · **DAG: independent of Bands 0/1**
(`F.md §The DAG` — Band 2 parallel) · **Gated on:** keyframes' own green CI
(inv-27).

**Title.** *value.js parses `animation-composition` and the style-rule `animation`
shorthand; the adapter drops the first and computes-then-discards the second. Capture
both — SHIP the apply, BOOK the honoring.*

These are two parsed-then-dropped consumption holes on the same adapter surface. value.js
already does the parse work — `liftKeyframeMetadata` lifts per-keyframe `composition`,
`extractAnimationOptions` builds the full `CSSAnimationOptions` from a sibling style rule
— and the kf adapter throws both on the floor: `ResolvedKeyframes` carries no
`composition` field, and `resolved.options` is computed at `adapter.ts:122` but has **zero
reads** in `engine.ts`. The second is a maintenance LIE: a typed surface a consumer
reasonably assumes is wired. The fix is to read what value.js already hands over.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO
workaround: SHIP the clean halves (capture `composition`; apply `options`), and **BOOK**
the deeper `composition`-HONORING (mapping keyframe `composition` → WAAPI
`KeyframeEffect.composite` + an rAF accumulate) rather than half-wire it — half-wiring is
the symptom-patch the Mandate forbids. NO legacy: `resolved.options` stops being a dead
documented field (a "documented contract" that is actually a bug, the exact anti-pattern
the Mandate names). Measure-first does not bind (correctness/capture, not perf).
Isomorphic-unless-named: capture is additive/inert (a new field, no behaviour change);
the `options`-apply is a NAMED behaviour change at one input shape (CSS that carries a
sibling style rule) — byte-identical for inputs with no style rule. inv ε: every claim
cites `file:line` against live `tranche-e-impl`.

**Provenance.** `a-parsing-post-e F-2` (`animation-composition` parsed, dropped — SHIP
capture + BOOK honoring), `a-parsing-post-e F-3` (`resolved.options` computed then never
consumed — SHIP-in-F MED) + the carried `px-kf-grammar PX-1` kf-half (the
`wrapBareKeyframes` decide-on-the-AST, booked from F.W7 to this adapter surface).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **`animation-composition` is PARSED by value.js, ABSENT from the adapter interface.**
   value.js lifts per-keyframe composition: `liftKeyframeMetadata` →
   `rule.composition: "replace" | "add" | "accumulate"` (`value.js stylesheet.ts:304,
   327-333,349-353`) and `extractAnimationOptions` recognises the style-rule longhand →
   `options.composition` (`value.js extract.ts:162-168`). kf's `ResolvedKeyframes`
   interface carries **neither** — verified: `adapter.ts:18-31` declares `keyframes`,
   `timingFunctions`, `properties`, `options` and NO `composition`. `resolveKeyframes`
   reads `rule.timingFunction` (`adapter.ts:112-114`) but never `rule.composition`. (grep
   `composition` across `src/animation/*.ts` finds only unrelated `drag.ts`/`group.ts`/
   `flip.ts` comments — the AnimationGroup blend modes `replace`/`add`/`weighted` are a
   SEPARATE axis and do NOT consume the parsed keyframe `composition`,
   `a-parsing-post-e F-2`.)

2. **`resolved.options` is COMPUTED then NEVER CONSUMED.** `resolveKeyframes` computes
   `options: extractAnimationOptions(ast)` (`adapter.ts:122`) and the
   `ResolvedKeyframes.options` field documents it recovers duration/easing/direction from
   a sibling style rule's `animation` shorthand/longhands (`adapter.ts:25-30`). But
   `fromString` reads only `resolved.properties` (`engine.ts:1073`), `resolved.keyframes`
   (`:1075`), and `resolved.timingFunctions` (`:1089`). Verified: grep `resolved.options`
   in `engine.ts` → **zero hits**. `extractAnimationOptions` walks every top-level style
   rule and builds a full `CSSAnimationOptions` (`value.js extract.ts:189-200` —
   duration/delay/iterationCount/direction/fillMode/timingFunction/composition) — all
   discarded (`a-parsing-post-e F-3`).

3. **The consequence (verified).** `new CSSKeyframesAnimation({}, el).fromString('.foo {
   animation: 2s ease-in-out infinite alternate; } @keyframes foo { … }')` runs at the
   1000 ms default, `easeInOutCubic`, 1 iteration — the authored `animation` shorthand is
   parsed and ignored. The dead `options` field is a maintenance lie (a typed surface a
   consumer reasonably assumes is wired, `a-parsing-post-e F-3`).

4. **The carry-in: `wrapBareKeyframes` is a regex pre-detection on this same adapter.**
   `resolveKeyframes` runs `wrapBareKeyframes(input)` first (`adapter.ts:97`), which
   regex-sniffs `if (/@keyframes\b/i.test(trimmed)) return input;` (`adapter.ts:81`) — so
   a `/* @keyframes foo */ from { … } to { … }` defeats the sniff, the bare list is NOT
   wrapped, the grammar rejects it → silent empty parse (`px-kf-grammar PX-1`). The "no
   regex pre-detection" claim two lines above the `fromString` call
   (`engine.ts:1068-1071`) is contradicted by it.

The wave's job: capture `composition` on `ResolvedKeyframes` (additive, inert), apply
`resolved.options` as the base for the animation's options (constructor-explicit
overriding), and decide `wrapBareKeyframes` on the parsed AST — each closed by a
re-runnable test that BITES. BOOK the deeper `composition`-honoring.

---

## § Goal

**What lands:**
- **`ResolvedKeyframes.composition` captured** — a per-keyframe `composition` map (keyed
  by percent string, mirroring `timingFunctions`) surfaced from `rule.composition`
  (`value.js stylesheet.ts:327-333`) in the `resolveKeyframes` loop (`adapter.ts:104-116`),
  plus the style-rule-level `options.composition`. The data stops being thrown away; a
  queryable field exists.
- **`resolved.options` APPLIED as the option base.** `fromString` (`engine.ts:1065-1110`)
  applies `resolved.options` as the base for the animation's options BEFORE the
  per-keyframe loop, with the constructor `options` arg OVERRIDING
  (constructor-explicit wins over parsed-from-CSS): `setOptions(merge(resolved.options,
  ctorOptions))`. The `timingFunction` string flows through `getTimingFunction` (the same
  path the per-keyframe case already uses), so `linear()`/`cubic-bezier()` in the
  shorthand resolve for free.
- **`wrapBareKeyframes` decides on the AST** (carried `px-kf-grammar PX-1` kf-half) — the
  regex sniff is replaced by a parse-then-decide: parse the raw input; if zero keyframes
  rules surfaced AND the input is a bare body, re-wrap and re-parse. The comment-defeat
  bug vanishes. The "no regex pre-detection" claim at `engine.ts:1068-1071` becomes true
  on the kf side.
- **`proof:adapter-capture`** (new) — three falsifiable clauses: (a) a `fromString` test
  where the sibling `.foo { animation: … }` shorthand takes effect AND an explicit ctor
  option overrides it; (b) a `composition`-captured assertion (the parsed value surfaces
  on `ResolvedKeyframes`); (c) the comment-defeat bite (`/* @keyframes x */ from { … } to
  { … }` parses to two frames, not zero).
- **BOOK: `composition`-honoring** — the engine BEHAVIOUR (map keyframe `composition` →
  WAAPI `KeyframeEffect.composite` + an rAF-side accumulate that touches the interpolation
  accumulate semantics) carries its own gate in the BOOK entry; do NOT half-wire it.

**Why:** value.js already does the parse work; the adapter discards it. Capturing
`composition` is additive (the data stops being lost, a future honoring wave has it
ready). Applying `options` makes the documented field do what it says — closing the
maintenance lie and honoring the authored `animation` shorthand. Deciding
`wrapBareKeyframes` on the AST makes the "single grammar, no pre-detection" contract true
on the kf side and kills the comment-defeat bug. Each reads what value.js hands over; none
re-implements a parse.

---

## § Scope

### S1 — Apply `resolved.options` as the option base (`a-parsing-post-e F-3`) — SHIP-in-F (MED)

**WHAT:** in `fromString` (`engine.ts:1065-1110`), before the per-keyframe loop
(`:1075`), apply `resolved.options` (`adapter.ts:122`) as the base for the animation's
options with the constructor-EXPLICIT `options` arg overriding. Concretely:
`this.setOptions({ ...resolved.options, ...explicitlyProvidedCtorOptions })` — the merge
direction is parsed-from-CSS as base, constructor-explicit as override, via the existing
`setOptions` bulk setter (fail-explicit, `engine.ts`). **`explicitlyProvidedCtorOptions`
must be the RAW author-provided `options` arg, NOT `this.options`** — `this.options` is
the fully-defaulted object (`engine.ts:210` merges `defaultOptions` into it at
construction), so spreading it would re-override every parsed value with the 1000 ms / 1
-iteration defaults and silently drop the parsed `animation: 2s` (the no-op trap, §Design
decisions 1). The fix therefore retains the author-provided key-set (the constructor
captures the raw `options` arg before the default-merge). The shorthand's `timingFunction`
STRING flows through `getTimingFunction` (the same path the per-keyframe case already uses
at `:1090`), so `linear()`/`cubic-bezier()` resolve for free.

**WHY:** `extractAnimationOptions` builds the full options (`value.js extract.ts:189-200`)
and `fromString` reads NONE of them (`engine.ts` grep `resolved.options` → 0 hits). The
authored `.foo { animation: 2s ease-in-out infinite alternate }` is parsed and ignored;
applying it honors the documented field. The value is already on `resolved.options`; this
is consumption, not computation. The constructor-override direction preserves the existing
contract (an explicit `new CSSKeyframesAnimation({ duration: 500 })` still wins over a
parsed `animation: 2s`).

### S2 — Capture `composition` on `ResolvedKeyframes` (`a-parsing-post-e F-2`) — SHIP-in-F (capture)

**WHAT:** add `composition` to the `ResolvedKeyframes` interface (`adapter.ts:18-31`) — a
`Map<string, string>` (percent → `"replace"|"add"|"accumulate"`) mirroring the shape of
`timingFunctions` (`adapter.ts:22`). In `resolveKeyframes`'s loop (`adapter.ts:104-116`),
beside the `rule.timingFunction != null` capture (`:112-114`), add `if (rule.composition
!= null) composition.set(percentText, rule.composition);` (reading
`value.js stylesheet.ts:327-333`). Also surface the style-rule-level
`options.composition` (`value.js extract.ts:162-168`) — it already rides in
`resolved.options`, so S1's apply carries it; S2 adds the per-KEYFRAME map. Capture ONLY —
no engine behaviour change (the field is queryable, inert).

**WHY:** an author writing the spec'd CSS Animations L2 `animation-composition: add` gets
it parsed (`value.js stylesheet.ts:327-333`) and silently dropped (the field is absent
from `adapter.ts:18-31`). Capturing it stops the data loss and gives a future honoring
wave a queryable field — additive and inert, exactly the clean half. The deeper honoring
is BOOKed (it touches accumulate semantics).

### S3 — Decide `wrapBareKeyframes` on the AST (carried `px-kf-grammar PX-1` kf-half) — SHIP-in-F (LOW)

**WHAT:** replace the regex sniff (`adapter.ts:81` `/@keyframes\b/i.test(trimmed)`) with
a parse-then-decide in `resolveKeyframes` (`adapter.ts:92-99`): parse the RAW input; if
`pickKeyframes(ast)` returns zero rules AND the trimmed input is non-empty (a bare body),
re-wrap with the synthetic `@keyframes anonymous { … }` (`adapter.ts:83`) and re-parse.
The grammar decides the input shape, not a regex. (The gestalt end-state is a value.js
grammar entry that accepts an unwrapped keyframe-stop list directly — that is the
**value.js-HANDOFF** half; the kf-side decide-on-the-AST is the bounded interim SHIP,
`px-kf-grammar PX-1`.)

**WHY:** the `/@keyframes\b/i` regex is a pre-detection the `engine.ts:1068-1071` comment
two lines above the `fromString` call explicitly denies exists; a `/* @keyframes foo */`
comment defeats it → silent empty parse (`px-kf-grammar PX-1`). Deciding on the parsed AST
makes the "single grammar, no pre-detection" contract TRUE on the kf side and kills the
comment-defeat bug. This is a befitting + strictly-more-correct fix (a no-comment bare
list parses byte-identically — the re-wrap path only triggers when the first parse yields
zero keyframes).

> **BOOK in this wave (named, gated in the BOOK entry — do NOT half-wire):**
> - **`composition`-HONORING** (`a-parsing-post-e F-2` honoring half) — map captured
>   keyframe `composition` → WAAPI `KeyframeEffect.composite` AND an rAF-side accumulate.
>   This touches the interpolation accumulate semantics (a real behaviour change), so it
>   is BOOKed as its own scoped item carrying its own gate (a WAAPI-`composite` assertion
>   + an rAF accumulate parity test). SHIP captures the field NOW so the data stops being
>   thrown away; BOOK the honoring so it is not half-wired (`a-parsing-post-e F-2`
>   disposition split).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real test, not an assertion):

1. **`proof:adapter-capture` clause A — the style-rule shorthand takes effect, ctor
   overrides (S1).** A `fromString('.foo { animation: 2s ease-in infinite alternate; }
   @keyframes foo { 0% { opacity: 0 } 100% { opacity: 1 } }')` test asserts the resulting
   animation's `options.duration === 2000`, `direction === "alternate"`,
   `iterationCount === Infinity`, and `timingFunction` samples `ease-in`. A SECOND test
   asserts `new CSSKeyframesAnimation({ duration: 500 }).fromString(<same css>)` keeps
   `duration === 500` (ctor-explicit overrides parsed). **BITE:** revert the S1 apply
   (re-drop `resolved.options`) → duration stays at the 1000 ms default and the clause
   reds. Reds today (the shorthand is ignored — verified State 3).

2. **`proof:adapter-capture` clause B — `composition` is captured (S2).** A `resolveKeyframes`
   test on `@keyframes x { 0% { opacity: 0; animation-composition: add } 100% { opacity: 1
   } }` asserts `resolved.composition.get("0%") === "add"`. **BITE:** drop the S2 capture
   (`composition` field / the `rule.composition` read) → the field is absent/empty and the
   clause reds. Reds today (the field does not exist — verified State 1).

3. **`proof:adapter-capture` clause C — the comment-defeat bug is fixed (S3).** A
   `resolveKeyframes('/* @keyframes x */ from { opacity: 0 } to { opacity: 1 }')` test
   asserts TWO frames surface. **BITE:** revert S3 (restore the `/@keyframes\b/i` regex
   sniff) → the comment defeats the sniff, the bare list is unwrapped-but-rejected, zero
   frames, the clause reds. Reds today (`px-kf-grammar PX-1` — the regex returns the input
   unwrapped, the grammar rejects it).

4. **No regression — captures are inert, the apply is isomorphic at the no-style-rule
   shape.** `npm test` stays green; a `fromString` of a bare `@keyframes` block with NO
   sibling style rule is byte-identical (S1: `extractAnimationOptions` returns `{}`, the
   merge is a no-op; S2: `composition` is empty; S3: a no-comment list re-wraps
   identically). `proof:boundary` UNTOUCHED. **BITE:** any existing `fromString`/
   `equivalence` test regression on a no-style-rule input reds.

---

## § Folds

Retires (by finding id):
- **`a-parsing-post-e F-3`** (`resolved.options` computed then never consumed) — S1 +
  gate clause 1.
- **`a-parsing-post-e F-2`** (`animation-composition` parsed, dropped — the CAPTURE half)
  — S2 + gate clause 2. **The HONORING half is BOOKed** (gate carried in the BOOK entry).
- **`px-kf-grammar PX-1`** (the `wrapBareKeyframes` regex-sniff, kf half — the
  comment-defeat bug) — S3 + gate clause 3. **The value.js half** (the `stripCSSComments`
  whole-input pre-pass) is **value.js-HANDOFF** (Band V Wave A4, `px-kf-grammar PX-1`).

**Routed OUTWARD / RECORDED (not this wave):**
- **`composition`-HONORING** (WAAPI `composite` + rAF accumulate) — **BOOK** (touches
  accumulate semantics; carries its own gate).
- **The value.js grammar entry for unwrapped keyframe-stop lists** (the gestalt end-state
  for S3) — **value.js-HANDOFF**; the kf-side decide-on-the-AST is the bounded interim SHIP.
- **Scroll-named selectors collapse to 0%** (`a-parsing-post-e F-4` / charter `NEW-15`) —
  **BOOK** (the right home is the E.W9 ScrollTimeline range model; interim fail-loud
  reject). NOT this wave — it crosses the ScrollTimeline surface, not the metadata-capture
  surface.

---

## § Design decisions

1. **`resolved.options` is the BASE; constructor-explicit OVERRIDES — the discrimination
   is REQUIRED, not optional.** RESOLVED + named: the merge direction is parsed-from-CSS as
   base, constructor as override (`a-parsing-post-e F-3`) — `new CSSKeyframesAnimation({
   duration: 500 }).fromString(<css with animation: 2s>)` keeps 500. The one subtlety:
   distinguishing a constructor-EXPLICIT option from a constructor-DEFAULT (so a parsed `2s`
   is not silently re-overridden by the 1000 ms default the constructor injected). The
   clean discrimination is to merge against the constructor's *provided* option keys only
   (the options the ctor arg actually carried), not the fully-defaulted set —
   `setOptions(merge(resolved.options, explicitlyProvidedCtorOptions))`. **The live
   constructor does NOT track this distinction today** — it collapses provided + default
   into one object in one motion (`engine.ts:210` — `this.setOptions({ ...defaultOptions,
   ...(options ?? {}) })`, verified live), so by the time `fromString` runs, every option
   key is present and the author/default origin is lost. The fix therefore REQUIRES the
   transposition: **retain the raw author-provided `options` arg** (the value before the
   `defaultOptions` merge, or a recorded key-set of what the ctor arg carried) so
   `fromString` can merge `resolved.options` UNDER it. **There is NO weaker-alternative
   escape hatch.** The §Mandate-forbidden "apply `resolved.options` only for keys the ctor
   did NOT carry, against the fully-defaulted set" is NOT a bounded form — because the ctor
   defaults ALL keys (`engine.ts:210`), every key is "carried," so that fallback makes S1 a
   silent NO-OP (the parsed `animation: 2s` is dropped exactly as today; the bug survives).
   Retaining the author key-set is the small, idiomatic transposition the fix demands;
   anything that does not is the bug. Gate clause 1's second test (ctor 500 wins) AND its
   first test (a parsed `2s` with NO ctor option DOES take effect) together lock the real
   discrimination — a NO-OP fallback reds clause 1.

2. **CAPTURE `composition` now; BOOK the HONORING — do NOT half-wire.** RESOLVED: the
   capture (a `composition` field, the `rule.composition` read) is additive and inert — it
   makes the parsed data queryable with zero behaviour change. The honoring (mapping
   `composition` → WAAPI `composite` + an rAF accumulate) is a REAL behaviour change that
   touches the interpolation accumulate path (`a-parsing-post-e F-2`). Half-wiring it — a
   field that some paths honor and some ignore — is the symptom-patch the Mandate forbids.
   Trade-off: shipping a captured-but-unhonored field looks incomplete — but it is the
   honest split (the data stops being lost; the honoring earns its own gated wave), and it
   is strictly better than continuing to drop the data OR shipping a divergent half-honor.

3. **Decide `wrapBareKeyframes` on the AST — the bounded interim of the value.js
   end-state.** RESOLVED: the gestalt end-state is a value.js grammar entry that accepts an
   unwrapped keyframe-stop list directly (no kf string-munging at all) — that is the
   value.js-HANDOFF half (`px-kf-grammar PX-1`). The kf-side bounded SHIP is to parse-then-
   decide: the regex sniff becomes a parse-then-re-wrap-if-empty, which kills the
   comment-defeat bug today without waiting on value.js. Trade-off: a double-parse on the
   bare-body path (parse raw → zero rules → re-wrap → re-parse) — but the bare-body input
   is the demo/test convenience shape, not the hot path, and the double-parse only triggers
   when the first parse yields zero keyframes (a `@keyframes`-carrying input parses once).

4. **This wave is the adapter+`fromString` surface; the serializer is F.W7.** RESOLVED:
   F.W8 is scoped to `adapter.ts` (the capture, the AST-decide) + `engine.ts fromString`
   (the options-apply). The round-trip serializer hole — per-keyframe easing dropped on
   EMIT — is F.W7's `format.ts` surface. The two are the same band (parsing/consumption
   seam), disjoint files, parallel; keeping them apart keeps each wave's gate a single-
   surface bite.
