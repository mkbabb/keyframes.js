# G.W4 — Backend fail-explicit close (the one silent-degrade left: `serializeEasing`)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the published library — a correctness fix that
converts a WRONG silently-emitted value into a typed THROW; no new public surface,
the genuine-`linear` registry path byte-stable, uniform-easing serialization
byte-identical) · **Scope:** `src/animation/format.ts` (the `Easing`→CSS serializer)
— the kf-side serialization-correctness seam, file-disjoint from the line-ceiling
DECISION (G.W5), the re-pin spine (G.W2/G.W3), and the CI band (G.W6) · **DAG:
independent of Band 0/1** (the serializer surface shares no file with the re-pin or
verification waves; runs in parallel) — but land AFTER `G.W2` so the negative-control
gate runs on the consumed `value.js ^0.11.0` registry (the `timingFunctions` table
`serializeEasing` reverse-looks-up) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *`serializeEasing` silently emits `"linear"` for a custom-closure easing
— the real curve is discarded with no signal. A JS closure has no faithful CSS
`animation-timing-function` twin; the Mandate's rule is fail-EXPLICIT, not
silent-degrade. THROW a typed error naming the easing; keep a genuinely-`linear`
registry easing serializing `linear`.*

This is the single silent-degradation that survives the F fail-explicit sweep. The
backend is otherwise a reference fail-explicit surface (`a-backend-legacy §ALREADY-
SOTA`, the bulk) — `errors.ts` documents the posture verbatim, the setters throw,
`easing.ts` excised the former identity-fallback, `group.setLayerConfig` throws on an
unknown key. F.W7 closed the per-keyframe-easing round-trip data-loss hole on EMIT,
but it locked only the **registry-named** and **spring `linear()`** paths; the
custom-closure path is the uncovered seam. A consumer who legitimately passes a
closure easing (`timingFunction: (t) => myEase(t)` — a fully supported input;
`resolveEasingOption` at `frame-compiler.ts:51` accepts `typeof input ===
"function"`) gets their curve **silently replaced by `linear`** on serialize. The fix
is to surface what is structurally unrepresentable as a typed throw, not a wrong
value — the exact posture `errors.ts:5-10` already documents the rest of the engine
to.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the fix is fail-EXPLICIT (a typed throw naming the
easing + the remedy), NOT a softer escape hatch beside the silent default — there is
no `?? "linear"` survival left when the curve is genuinely unrepresentable. NO legacy
/ NO silent-graceful-handling: the `?? "linear"` is a silent contract-mask (the curve
is DISCARDED, not faithfully re-expressed), the precise shape the Mandate forbids; it
is EXCISED, not softened. The `?.[0]` is dead-defensive (`Array.prototype.map` always
returns an array; the optional chain never short-circuits) — collapse it in the same
motion (DRY: one expression, one meaning). KISS: the throw is one branch, no new
class needed if `AnimationOptionError` fits (Design decision 2 resolves the type).
Isomorphic-unless-named: a CSS-twinned easing (`easing.css !== undefined`) and a
genuine registry easing serialize BYTE-IDENTICALLY — the only output that changes is
the one emitting a WRONG `"linear"` today, which becomes a throw (a NAMED behaviour
change at exactly one input shape: a non-registry, no-`.css` closure). Measure-first
does not bind (a correctness fix, not a perf claim) — the gate is a falsifiable
negative-control bite, not a bench. inv ε: every claim below cites `file:line`
against live `tranche-g-dev`, verified by running the code, not asserted.

**Provenance.** `a-backend-legacy F-BL-2` (the silent-`linear` degradation — SHIP-in-G
MED, verified by running `serializeEasing({fn: closure})` → `"linear"`) + the
RECORD re-word `a-backend-legacy F-BL-6` (the `respectReducedMotion: false`
"back-compat" framing in a major — folded as a doc-only re-word, Design decision 3).
Synthesised at `_SYNTHESIS-gap-scorecard §1` (backend row: "~95% ALREADY-SOTA · 1 MED
+ 2 RECORDs") and `§2 Band 2 G.W4`.

---

## § State, verified (not asserted)

The live facts, read-, grep-, and RUN-confirmed on `tranche-g-dev`, so the wave's
framing is honest:

1. **`serializeEasing` silently degrades a custom closure to `"linear"`.**
   `format.ts:22-29` (read live):
   ```ts
   export function serializeEasing(easing: Easing): string {
       if (easing.css !== undefined) return easing.css;
       const registryName =
           Object.entries(timingFunctions)
               .filter(([_name, func]) => func === easing.fn)
               .map(([name]) => name)?.[0] ?? "linear";   // <- silent degrade
       return camelCaseToHyphen(registryName);
   }
   ```
   The `?? "linear"` fires whenever the callable is NOT a value.js registry entry and
   carries no `.css` twin — i.e. a genuine custom closure. Verified by running it:
   `serializeEasing({ fn: (t) => t*t*t*0.5 })` returns **`"linear"`** (`a-backend-legacy
   F-BL-2`, ran live). The curve is gone; the emit is a wrong value with no signal.

2. **A closure easing is a FULLY SUPPORTED input — this is not an edge case.**
   `resolveEasingOption` (`frame-compiler.ts:47-76`, read live: `:51` `if (typeof
   input === "function") return { fn: input };`) accepts a callable as the option's
   `Easing`. So `timingFunction: (t) => myEase(t)` is first-class on construction, then
   silently mis-serialized — the asymmetry is between the input contract and the emit.

3. **The `?? "linear"` is the silent contract-mask the Mandate forbids — distinct
   from the BEFITTING `linear` fallback elsewhere.** Contrast `waapi.ts:318`
   (`uniformTiming.css ?? "linear"`): there the eligibility gate (`waapi.ts:308-315`)
   GUARANTEES a non-CSS-twinned easing already baked its curve into the keyframe stops,
   so `linear` between stops is FAITHFUL. In `serializeEasing` there is no such
   guarantee — the closure's curve is genuinely unrepresentable in CSS and is being
   DISCARDED, not faithfully re-expressed (`a-backend-legacy F-BL-2`, the contrast
   verified at both `file:line`).

4. **F.W7's round-trip lock does NOT cover the closure path — and one assertion
   actively MASKS it.** `test/roundtrip-easing.test.ts:44` asserts `serializeEasing(
   tf!.timingFunction!) === "linear"` **for an easing that genuinely IS `linear`** (a
   registry `linear`, parsed from `animation-timing-function: linear`). So the existing
   lock does NOT distinguish "faithfully linear" (correct) from "silently degraded to
   linear" (the bug) — both spell `"linear"`. F.W7 locked the registry-named and spring
   `linear()` paths (`F.W7.md:135-160`); the custom-closure path is the uncovered seam
   (`a-backend-legacy F-BL-2`, `format.test.ts` confirmed to assert frame-count +
   property-name fidelity only, not closure-easing fidelity).

5. **The fail-explicit posture is already the engine's architecture — this throw is
   idiomatic, not novel.** `errors.ts:1-13,23-37` documents and implements
   `AnimationOptionError` ("THROW on malformed (non-`undefined`) input rather than
   silently defaulting"); `repr()` (`errors.ts:15-21`) already formats a function value
   as `[function <name>]` for the message. `easing.ts:12-17` records the EXCISION of
   the former silent identity-fallback. The throw G.W4 adds is the SAME posture reaching
   the serializer — the one surface it had not yet reached (`a-backend-legacy
   §ALREADY-SOTA`, the seam record).

The wave's job: replace the `?? "linear"` silent degrade with a typed THROW naming the
easing + the faithful-twin remedy, collapse the dead `?.[0]`, and lock it with a
negative control that BITES today (a closure THROWS) while a positive control holds (a
genuine `linear` still serializes `"linear"`).

---

## § Goal

**What lands:**
- **`serializeEasing` THROWS on a custom closure.** When `easing.css === undefined`
  AND the registry reverse-lookup yields no match, THROW a typed error (Design decision
  2: `AnimationOptionError` for `"timingFunction"`, OR a dedicated
  `UnserializableEasingError` if the lane elects the named subtype) carrying the easing
  (`repr()` already renders `[function <name>]`) and the remedy prose: *"a custom
  TimingFunction has no CSS `animation-timing-function` representation — attach a
  faithful `Easing.css` twin, or use a registry name / `cubic-bezier()` / `linear()`
  literal."* This mirrors `errors.ts:5-10` verbatim-in-spirit.
- **The dead `?.[0]` collapses.** `Array.prototype.map` always returns an array; the
  optional chain at `format.ts:27` never short-circuits. Reduce the reverse-lookup to a
  plain `[0]` / `.find()` whose `undefined` is the throw signal (no silent default
  swallows it). One expression, one meaning.
- **The genuine-`linear` and CSS-twin paths stay byte-identical.** `easing.css !==
  undefined` returns the twin VERBATIM (a spring `linear()`, a `cubic-bezier()`
  literal); a registry `linear` reverse-resolves to `"linear"` exactly as today. Only
  the unrepresentable closure changes (a wrong value → a throw).
- **`proof:roundtrip-easing` extended with a NEGATIVE control + a positive control.**
  The negative: `serializeEasing({ fn: (t) => t*t*t })` (a non-registry, no-`.css`
  closure) THROWS (today it returns the wrong `"linear"`). The positive: a genuinely-
  `linear` registry easing (the one `roundtrip-easing.test.ts:44` already exercises)
  STILL serializes `"linear"` (the F.W7 byte-stable uniform case holds, and the
  existing assertion is re-grounded so it can no longer pass on a degraded value).
- **The `respectReducedMotion: false` "back-compat" re-word** (`F-BL-6`, doc-only,
  ZERO behaviour) — `smooth.ts:24` / `numeric.ts:40` re-phrase "back-compat —
  consumers opt in" to "conservative default — opt in to the reduced-motion snap" (a
  major has no prior contract to be back-compatible with; the default is correct, only
  the framing invokes a legacy concept). Folded here as the band's RECORD close.

**Why:** a serializer that silently emits a WRONG value where the real value is
structurally unrepresentable is the silent-graceful-handling-that-hides-a-contract the
Mandate names. A JS closure genuinely has no faithful CSS twin — that is a real
structural limit, and the Mandate's rule for a real limit is fail-EXPLICIT, not a
quiet default that loses the curve. The throw makes the limit VISIBLE at the exact
moment a consumer would otherwise lose data, and points at the three faithful remedies.
The fix reaches the one fail-explicit seam F left uncovered, with the engine's own
established error type — no new posture, no escape hatch.

---

## § Scope

### S1 — `serializeEasing` THROWS on an unrepresentable closure; collapse the dead `?.[0]` (`a-backend-legacy F-BL-2`) — SHIP-in-G (MED)

**WHAT:** transpose `format.ts:22-29`'s tail from a silent default to a typed throw.
The CSS-twin branch (`easing.css !== undefined → return easing.css`) is UNCHANGED. The
registry reverse-lookup is rewritten so a no-match is the throw signal, not a `?? "linear"`
swallow:
```ts
export function serializeEasing(easing: Easing): string {
    if (easing.css !== undefined) return easing.css;
    const registryName = Object.entries(timingFunctions)
        .find(([_name, func]) => func === easing.fn)?.[0];
    if (registryName === undefined) {
        throw new AnimationOptionError(           // (or UnserializableEasingError — DD2)
            "timingFunction",
            easing.fn,
            "a custom TimingFunction has no CSS animation-timing-function " +
            "representation — attach a faithful Easing.css twin, or use a " +
            "registry name / cubic-bezier() / linear() literal",
        );
    }
    return camelCaseToHyphen(registryName);
}
```
The dead `.map(...)?.[0] ?? "linear"` (an optional chain over an always-defined array,
masking the no-match) becomes `.find(...)?.[0]` whose `undefined` is the explicit throw
signal — the `?.[0]` here is LOAD-BEARING (over the possibly-undefined `find` result),
unlike the dead one it replaces.

**WHY:** the `?? "linear"` discards a genuinely-unrepresentable curve and emits a wrong
value silently (State 1/3) — the Mandate-forbidden silent contract-mask. Throwing
surfaces the structural limit explicitly at the data-loss point, with the remedy named,
in the engine's own fail-explicit idiom (`errors.ts:5-10`). The two faithful paths
(CSS-twin, registry) are untouched, so the change is isomorphism-RESTORING: the only
output that changes is the one losing data.

### S2 — the negative + positive control on `proof:roundtrip-easing` (`a-backend-legacy F-BL-2`) — SHIP-in-G (test, gate-bearing)

**WHAT:** extend `test/roundtrip-easing.test.ts` (the `proof:roundtrip-easing` corpus)
with (a) a NEGATIVE control — `expect(() => serializeEasing({ fn: (t) => t*t*t }))
.toThrow(...)` (a non-registry, no-`.css` closure must throw; today it returns the
wrong `"linear"`); and (b) a re-grounded POSITIVE control — a genuinely-`linear`
registry easing STILL serializes `"linear"`, asserted in a way that can no longer pass
on a degraded value (e.g. assert the registry-resolved `linear` AND that a closure
NOT equal to the registry `linear` throws, so the two are provably distinguished — the
distinction `roundtrip-easing.test.ts:44` does not draw today). The existing F.W7
round-trip + byte-stable-uniform clauses stay green (untouched fidelity).

**WHY:** State 4 — the current lock asserts `serializeEasing(...) === "linear"` for a
genuine `linear`, which a SILENTLY-DEGRADED closure ALSO satisfies; the lock cannot
tell the bug from the correct case. The negative control is the falsifiable bite that
forces S1 (a closure must throw); the positive control proves S1 did not over-reach
(a real `linear` still serializes). Together they draw the "faithfully linear" vs
"silently degraded to linear" line the F.W7 lock left undrawn.

> **RECORDED in this band (NOT a behavioural change) — so no future lane re-raises:**
> - **`F-BL-6` the `respectReducedMotion: false` "back-compat" framing** (`smooth.ts:24`,
>   `numeric.ts:40`) — a doc-only re-word folded as S3 below; the DEFAULT is correct
>   and SOTA, only the prose invokes a legacy concept. NOT a wave of its own.
> - **`F-BL-3` `ResolvedKeyframes.composition` captured-but-dead** (`adapter.ts:29,
>   107-126`) — RECORD; the F.W8 BOOK rationale HOLDS (the field is honest about being
>   captured-for-future; honoring it → the AnimationGroup `add`/accumulate blend is the
>   named home, ready when G honors it). Do NOT excise (it correctly preserves parsed
>   data); do NOT half-wire.
> - **`F-BL-4` the stale scroll-named-selector comment + opaque value.js throw**
>   (`adapter.ts:56-61`) — RECORD (the comment promises "surface for the consumer to
>   handle"; the named selector now dies in `parseCSSValueUnit` — fail-loud, the right
>   direction, but the comment is a prose maintenance-lie) + **value.js-HANDOFF** (the
>   structured-diagnostics sink VJ-F2, surfaced in `G.WV`). Low urgency; current
>   behaviour is correct.
> - **`F-BL-5` the cross-realm parse-that `any` cast** (`utils.ts:246-258`) —
>   **value.js / parse-that-HANDOFF** (peer-declare parse-that → realm collapse → typed
>   import); RECORD kf-side (the cast is correct given current packaging). Routed to
>   `G.WV`.

### S3 — the `F-BL-6` "back-compat" → "conservative default" re-word (`a-backend-legacy F-BL-6`) — SHIP-in-G (doc-only, ZERO behaviour)

**WHAT:** re-phrase the two comments framing the `respectReducedMotion: false` default
as "back-compat" (`smooth.ts:24`, `numeric.ts:40`) to "conservative default — opt in
to the reduced-motion snap." No code, no test, no behaviour: the default value is
unchanged.

**WHY:** in a `4.0.0` MAJOR there is no prior contract to be "compatible" with for a
NEW option (`a-backend-legacy F-BL-6`); "back-compat" is a vestigial legacy framing the
Mandate's no-legacy precept would rather name for what it is — the conservative,
opt-in default. The behaviour is correct and SOTA; only the wording is the vestige.
Folded opportunistically into this band so it is not a wave of its own.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real lock-test, not an
assertion):

1. **`proof:roundtrip-easing` NEGATIVE control PASSES — a custom closure THROWS.**
   `expect(() => serializeEasing({ fn: (t) => t*t*t })).toThrow()` (a non-registry,
   no-`.css` closure) and the thrown error names the `timingFunction` option + carries
   the faithful-twin remedy. **BITE:** restore the `?? "linear"` (the silent degrade) →
   `serializeEasing` returns `"linear"`, no throw, the clause reds. Reds today (the
   serializer returns the wrong `"linear"` — verified State 1, ran live).

2. **`proof:roundtrip-easing` POSITIVE control PASSES — a genuine `linear` still
   serializes `"linear"`, provably distinguished from the degraded case.** A registry
   `linear` easing serializes `"linear"` AND a closure that is NOT the registry `linear`
   throws — so the assertion can no longer pass on a silently-degraded value. **BITE:**
   make the throw fire for the registry `linear` too (over-reach: throw before the
   reverse-lookup resolves) → the registry-`linear` serialization reds. This is the
   no-over-reach lock — S1 must throw ONLY on the unrepresentable closure.

3. **The CSS-twin + registry paths are byte-stable (isomorphism lock).** The existing
   F.W7 clauses — per-keyframe easing round-trip (`roundtrip-easing.test.ts:33-45`), the
   byte-stable uniform-easing case (`:47-55`), and the spring `linear()` round-trip
   (`:58-80`) — stay GREEN. A spring `springTimingFunction(...)` (which carries `.css`)
   serializes its `linear()` VERBATIM, unchanged. **BITE:** any regression in the
   CSS-twin or byte-stable-uniform assertions reds — S1 must not touch the faithful
   paths.

4. **No regression — the engine stays exemplary.** `npm test` + `proof:all` stay green;
   `format.test.ts` (frame-count / property-name fidelity) and `proof:boundary` (the
   light/heavy edge — `format.ts` is on the HEAVY surface, statically value.js-bearing)
   are UNTOUCHED. The S3 re-word is doc-only (no test asserts the comment text; a grep
   that the string "back-compat" no longer appears in `smooth.ts`/`numeric.ts` is the
   optional belt-and-braces clause). **BITE:** any `format.test.ts` or boundary
   regression reds.

---

## § Folds

Retires (by finding id):
- **`a-backend-legacy F-BL-2`** (`serializeEasing` silently emits `"linear"` for a
  custom closure — the curve lost on round-trip) — S1 + gate clauses 1/2/3.
- **`a-backend-legacy F-BL-6`** (the `respectReducedMotion: false` "back-compat" framing
  in a major) — S3 (doc-only re-word; gate clause 4's grep belt).

**RECORDED in this band (not folded as a behavioural change — see S2 callout):**
- **`a-backend-legacy F-BL-3`** (`ResolvedKeyframes.composition` captured-but-dead) —
  RECORD (the F.W8 BOOK holds; honoring → the AnimationGroup accumulate blend, ready).
- **`a-backend-legacy F-BL-4`** (stale scroll-selector comment + opaque value.js throw)
  — RECORD + **value.js-HANDOFF** (VJ-F2 diagnostics sink; routed to `G.WV`).

**Routed OUTWARD (not this wave):**
- **`a-backend-legacy F-BL-5`** (cross-realm parse-that `any` cast) — **value.js /
  parse-that-HANDOFF** (peer-declare parse-that → realm collapse → typed import; `G.WV`).
  RECORD kf-side: the cast is correct given current packaging.

---

## § Design decisions (the trade-offs RESOLVED)

1. **THROW, do NOT soften — there is no befitting fallback when the curve is genuinely
   unrepresentable.** RESOLVED: a JS closure has NO faithful CSS
   `animation-timing-function` twin — that is a real structural limit (State 3), not a
   missing feature. The Mandate's rule for a real limit is fail-EXPLICIT; the `?? "linear"`
   is a silent contract-mask that loses data. The escape-hatch alternatives — emit a
   sampled `linear(...)` approximation of the closure, or keep `"linear"` with a
   `console.warn` — are both Mandate-forbidden: the first invents a lossy curve the
   consumer did not author (a workaround wearing a feature costume), the second is a
   silent-degrade-plus-noise that a bundler's console-drop erases (the EXACT
   anti-pattern `easing.ts:12-17` records EXCISING). The only idiomatic move is the throw
   that names the three faithful remedies. There is NO weaker-alternative escape hatch.

2. **The error TYPE: reuse `AnimationOptionError("timingFunction", …)` unless the lane
   elects the named subtype.** RESOLVED + named: `AnimationOptionError` (`errors.ts:23-37`)
   already carries `option` + `value` + a reason, and `repr()` already renders a function
   as `[function <name>]` — it FITS the seam (a malformed-for-serialization
   `timingFunction`) with zero new surface (KISS). A dedicated `UnserializableEasingError`
   (the `a-backend-legacy F-BL-2` alternative) is MORE precise (a consumer can `catch` it
   distinctly) but adds a public error class for one call site. The trade-off is
   precision-vs-surface; the gate (clause 1) is type-agnostic (it asserts a throw + the
   remedy prose, not the class), so EITHER satisfies it. **Recommendation:
   `AnimationOptionError`** — it is the established type, the message carries the option
   + remedy, and one error class is KISS-er than two. The impl wave makes the final call;
   the gate binds the behaviour, not the class.

3. **The `F-BL-6` re-word is doc-only — the DEFAULT is correct, only the FRAMING is
   legacy.** RESOLVED: `respectReducedMotion: false` is a defensible conservative default
   (animations proceed unless the consumer opts into the a11y snap) — NOT a behaviour to
   change. The "back-compat" prose, in a major with no prior contract, is the legacy
   FRAMING the no-legacy precept names; re-wording it to "conservative default" costs
   nothing and removes the vestige. Folded here (not its own wave) because it is the
   band's RECORD close and shares the backend-legacy lane.

4. **This wave is the serializer's `format.ts` surface ALONE — the re-pin is G.W2, the
   line-ceiling is G.W5.** RESOLVED: G.W4 is scoped to the one silent-degrade in
   `serializeEasing`. The shipped-stale-pins finding (`F-BL-1`) is the re-pin SPINE,
   folded by `G.W2` (8 lanes converge there); the engine line-ceiling is the gated
   DECISION of `G.W5`. Keeping G.W4 to `format.ts` keeps its gate a clean, single-surface
   bite — disjoint files, parallel waves (`_SYNTHESIS-gap-scorecard §2`).
