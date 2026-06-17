# L.W3 — Ingest deepening

- **Band:** A · **Class:** SHIP-in-L · **Dep:** none — value.js/glass-ui publish-independent;
  rides the K.W8 substrate (`src/animation/ingest.ts` + `src/animation/ingest-cssom.ts`).
- **Gate (extended):** `proof:ingest-replay` — five NEW arms appended; each arm is
  born-RED on today's tree and greens only when its clause cures.

---

## Context

K.W8 shipped the ingest surface (`fromStyleSheets`, `fromLiveAnimations`, `adoptRunning`)
and proved the CORE round-trip: a same-origin `@keyframes` rule is reconstructed
replay-equal, mid-flight adoption seeds at the captured `currentTime`, and every
cross-origin sheet becomes a `CORS_SKIP` diagnostic row (never a silent drop). The
gate — `proof:ingest-replay` (eight clauses, all GREEN at K close) — is a
SOURCE-SHAPE lock: it asserts the surface EXISTS and wires the right pipeline; it does
NOT exercise the five live-web scenarios that K deferred as honest BOOKs (Lane 33
audit finding: `proof:ingest-replay` has **zero arms** for delay-reset, nested
group-rule, Shadow-DOM / adoptedStyleSheets, ADOPT_REFUSE diagnostics, or scroll-driven
`currentTime`). All five scenarios SILENTLY PASS today — the gate is green over the
exact cases that break.

L.W3 deepens the K.W8 substrate along the five BOOK rows without touching any sibling
publish gate. Each S-clause is a concrete falsifiable deliverable; the born-RED gate
arm for each clause is authored FIRST, biting the broken behavior on today's tree, and
greens only on the cure.

### Audit evidence

| Ref | Source location | Gap |
|-----|-----------------|-----|
| W8, audit★ | `ingest.ts:246-273` (`seedAtTime`) | `onStart()` at line 260 enters the `delay > 0` branch (`engine.ts:783-789`), sets `this.paused = true`; the takeover then sets `animation.started = true` (line 261) but `paused` remains — the animation is frozen mid-flight for any source with `animation-delay > 0`. The born-RED witness: a `seedAtTime` call on an animation reconstructed from `.foo { animation: spin 2s 500ms linear }` never advances (effectiveT stays at the seeded time). |
| W7, audit★ | `ingest-cssom.ts:142-194` (`walkSheet`) | `walkSheet` iterates a flat `CSSRuleList` with no recursive descent: `@media`, `@supports`, `@layer`, `@container` bodies (`CSSGroupingRule.cssRules`) are never entered. A `@keyframes` declared inside `@media (prefers-reduced-motion: no-preference)` is silently absent from the result (`animations` Map empty, zero diagnostics). |
| W9, audit★ | `adapter.ts:25-31` (`DiagnosticCode`) | No `ADOPT_REFUSE` code exists. Both failure paths in `adoptRunning` (`ingest.ts:131-158`) emit `"WAAPI_INELIGIBLE"` — correct for the `getAnimations()` absence (a WAAPI-API failure), but wrong for "no running animation by that name" (an INGEST failure, a different consumer branch). The consumer cannot distinguish "API absent" from "name not found" without scraping the message string (violates the stable-`code`, never-scrape-message contract). |
| W10, audit★ | `ingest-cssom.ts:267-285` (`resolveLiveKeyframes` — sheet resolution) | The sheet resolution path handles `Document \| CSSStyleSheet[] \| CSSStyleSheet` but has no branch for `ShadowRoot`. `el.shadowRoot.adoptedStyleSheets` (Baseline 2023) and `ShadowRoot.styleSheets` (the declarative shadow-DOM form) are both unwalked. A custom element with `@keyframes` in its shadow stylesheet is invisible to `fromStyleSheets()`. |
| W11, audit★ | `ingest.ts:162-166` (`adoptRunning` — `currentTime` extraction) | The comment explicitly acknowledges `CSSNumberish` at line 162 ("a `{value, unit}` for a scroll timeline") but the resolution at lines 164-166 defaults to `0` for any non-numeric form — a scroll-driven CSS animation has `currentTime` as a `CSSUnitValue` (`{value: 0.42, unit: "percent"}`, not a numeric ms); the takeover seeds at `0` (the flash-equivalent for scroll position). `seedAtTime` at line 221 then positions the playhead at `0 ms`, not the scroll percentage. |

Lane 33 audit (completion-lanes-32-36.txt:47): "`proof:ingest-replay` has NO arm for the
W3 ingest cures (seedAtTime delay-reset, nested group-rule, Shadow-DOM walk, refuse
diagnostics, scroll-time)." The current eight-clause gate (scripts/proof-ingest-replay.mjs)
has zero anchors for any of these arms; the `test/ingest.test.ts` file has zero
`describe`/`it` blocks for delay, nested, adoptedStyleSheets, `ADOPT_REFUSE`, or
scroll-time scenarios (confirmed: `grep -n "delay\|nested\|adoptedSheet\|shadowRoot\|
ADOPT_REFUSE\|scroll.*time" test/ingest.test.ts` → zero hits).

---

## Scope

Each S-clause is a concrete falsifiable deliverable. `proof:ingest-replay` GREEN on all
TWELVE clauses (the eight K.W8 clauses plus these five) is the wave's exit criterion.

### S1 — seedAtTime delay reset (W8 / `ingest.ts:258-272`)

**Breach.** `seedAtTime` at `ingest.ts:260` calls `animation.onStart()`. When the
reconstructed animation's `options.delay > 0` (i.e., the source CSS carries
`animation-delay: 500ms`), `onStart()` at `engine.ts:783-789` sets `this.paused = true`
and returns a pending promise. The next line (`animation.started = true`, line 261) marks
the engine started but leaves `paused` live. `animation.play()` (line 272) then enters
`_advance` at `engine.ts:840` which immediately hits the `paused && pausedTime === 0`
branch and returns `this.t` without advancing. The animation is frozen at the seeded time
forever. A mid-flight takeover MUST NOT honor the source delay — the native animation
already consumed it; re-imposing it re-freezes an animation the user was watching play.

**Cure.** Before calling `onStart()`, reset `animation.options.delay` to `0` (the
takeover is a mid-flight continuation — the delay has already elapsed on the native
side). The reset must happen on the reconstructed animation BEFORE `onStart()`, not as
an option passed to `resolveLiveKeyframes` (the sibling style rule carries the declared
delay and the reconstruction must preserve it for serialization symmetry; the seed
function strips it for the takeover). Alternative: `seedAtTime` calls
`animation.setDelay(0)` then `onStart()`.

**Gate arm (born-RED today, greens on cure).** `test/ingest.test.ts` new `describe`
block: reconstruct from `.foo { animation: spin 2000ms linear 800ms }` (sibling rule with
`animation-delay: 800ms`), then `seedAtTime(animation, 600)`, then advance one synthetic
frame via `animation.advanceTo(performance.now() + 1)` and assert
`animation.effectiveT > 0` (the animation advanced past the seeded time). On today's tree
this assertion FAILS: the paused flag from `onStart()`'s delay branch freezes the engine
at `t=600` forever. `proof:ingest-replay` new anchor (scripts/proof-ingest-replay.mjs):
`delay-reset` clause requiring the pattern `setDelay\(0\)|options\.delay\s*=\s*0` inside
`seedAtTime`'s body.

### S2 — Recursive group-rule walk for nested `@keyframes` (W7 / `ingest-cssom.ts:142-194`)

**Breach.** `walkSheet` at `ingest-cssom.ts:164` iterates `rules` with a flat `for` loop
and calls `isKeyframesRule(rule)` on each entry. `CSSGroupingRule` subclasses (`CSSMediaRule`,
`CSSSupportsRule`, `CSSLayerBlockRule`, `CSSContainerRule`) expose their own `.cssRules`
but `walkSheet` never descends into them. A `@keyframes` declared inside
`@media (prefers-reduced-motion: no-preference) { @keyframes pulse { … } }` is silently
absent from the ingest result — zero diagnostics, empty `animations` Map. The no-silent-drop
law requires either a descent or an honest diagnostic; a silent absent result is the
forbidden class.

**Cure.** Make `walkSheet` recursive: after the existing flat-rule loop, for each rule that
is a `CSSGroupingRule` (structural test: `typeof r.cssRules !== "undefined"` and it is NOT
a `CSSKeyframesRule`) call `walkSheet(rule.cssRules, out, options)` recursively. The
`CSSGroupingRule` test uses the same structural duck-type idiom already established at
`ingest-cssom.ts:117-131` (`isKeyframesRule`) — no `instanceof` coupling to a specific
CSSOM implementation. Depth is bounded by real-world stylesheet nesting (typically ≤4
levels); an explicit depth guard (max 32) is added to prevent adversarial recursion.

**Gate arm (born-RED today, greens on cure).** `test/ingest.test.ts` new `describe` block:
install a `<style>` with `@media screen { @keyframes nested { 0% { opacity: 0 } 100% {
opacity: 1 } } }`, call `fromStyleSheets([sheet])`, and assert `animations.has("nested")`.
On today's tree the `animations` Map is empty (the flat walk never enters `@media`) — the
assertion FAILS. `proof:ingest-replay` new anchor: `nested-walk` clause requiring
`cssRules` is accessed recursively inside `walkSheet` (pattern: a second `.cssRules`
access path after the outer loop, or a recursive call to `walkSheet`).

### S3 — `ADOPT_REFUSE` diagnostic code (W9 / `adapter.ts:25-31`, `ingest.ts:131-158`)

**Breach.** `DiagnosticCode` at `adapter.ts:25-31` has no `"ADOPT_REFUSE"` entry. Both
failure paths in `adoptRunning` emit `"WAAPI_INELIGIBLE"` — at `ingest.ts:133-139` for
"no `getAnimations()` method" and at `ingest.ts:150-158` for "no running animation by
that name". The first is legitimately a WAAPI-API absence (the Web Animations API is
unavailable — a WAAPI eligibility failure). The second is an INGEST failure (the API is
present but the named animation is not found — no running animation by that name to
adopt). Conflating them under `"WAAPI_INELIGIBLE"` forces consumers to scrape the
`message` string to distinguish the branches, violating the stable-`code`
never-scrape-message contract (`adapter.ts:47`: "A stable, branch-on-able code — never
scrape `message`").

**Cure.** Add `"ADOPT_REFUSE"` to `DiagnosticCode` at `adapter.ts:25-31`. Use it for the
"no running animation by that name" path at `ingest.ts:150-158` (the ingest-domain
failure). Retain `"WAAPI_INELIGIBLE"` for the "no `getAnimations()` method" path at
`ingest.ts:133-139` (a genuine WAAPI-API failure). The `"ADOPT_REFUSE"` code also covers
the "rule not found or could not be reconstructed" path at `ingest.ts:181-191` — the
current `"PARSE_ERROR"` there conflates a value.js parse failure with an adopt-context
reconstruction failure; `"ADOPT_REFUSE"` is the correct domain code for a refused
takeover.

**Gate arm (born-RED today, greens on cure).** `test/ingest.test.ts`: extend the existing
"adoptRunning REFUSES when no running animation matches" test (`ingest.test.ts:189`) to
assert `res.diagnostics.some(d => d.code === "ADOPT_REFUSE")`. On today's tree the
diagnostic code is `"WAAPI_INELIGIBLE"` — the assertion FAILS. `proof:ingest-replay` new
anchor: `adopt-refuse` clause requiring `"ADOPT_REFUSE"` in `adapter.ts`'s
`DiagnosticCode` type and used in `ingest.ts`.

### S4 — `adoptedStyleSheets` / Shadow-DOM walk (W10 / `ingest-cssom.ts:257-285`)

**Breach.** `resolveLiveKeyframes` at `ingest-cssom.ts:267-285` resolves the sheet source
to a `CSSStyleSheet[]` via three branches: `source == null` (ambient `document.styleSheets`),
`Array.isArray(source)` (explicit list), and `source instanceof Document` (document sheets).
No branch handles `ShadowRoot`. `ShadowRoot.adoptedStyleSheets` (constructable stylesheets,
Baseline 2023) and `ShadowRoot.styleSheets` (declarative shadow DOM `<template shadowrootmode>`)
are both unwalked. A custom element with its `@keyframes` in a shadow stylesheet is entirely
invisible to `fromStyleSheets()` — zero results, zero diagnostics (the silent-absent class).

**Cure.** Add a `ShadowRoot` branch to `resolveLiveKeyframes`'s source-resolution block
(after the `Document` branch, `ingest-cssom.ts:281`): if
`typeof ShadowRoot !== "undefined" && source instanceof ShadowRoot`, collect
`Array.from(source.styleSheets)` concatenated with `source.adoptedStyleSheets ?? []`. The
same per-sheet `try/catch` → `CORS_SKIP` idiom applies (a constructable sheet may still
throw on `.cssRules` if created in a different realm). Expose a `ShadowRoot` overload in
`fromStyleSheets`'s signature alongside the existing `Document | CSSStyleSheet[] | CSSStyleSheet`
union — the duck-type source resolution already accommodates it without a breaking change.

**Gate arm (born-RED today, greens on cure).** `test/ingest.test.ts` new `describe` block:
create a `CSSStyleSheet`, insert `@keyframes shadowPulse { 0% { opacity: 0 } 100% {
opacity: 1 } }` via `sheet.replaceSync(…)`, attach it as `document.body.shadowRoot`
(jsdom ≥20 supports `attachShadow`) or inject it as an `adoptedStyleSheets` entry, then
call `fromStyleSheets(shadowRoot)` and assert `animations.has("shadowPulse")`. On today's
tree the branch is absent — the call falls through to the `CSSStyleSheet` branch (treating
`ShadowRoot` as a bare sheet), `shadowRoot.cssRules` throws, and the result is empty with
a `CORS_SKIP` diagnostic — the assertion FAILS. `proof:ingest-replay` new anchor:
`shadow-walk` clause requiring `ShadowRoot` handling in the source-resolution block
(pattern: `ShadowRoot` + `adoptedStyleSheets` in `ingest-cssom.ts`).

### S5 — Scroll-time `CSSNumberish` `currentTime` resolution (W11 / `ingest.ts:162-166`)

**Breach.** `adoptRunning` at `ingest.ts:162-166` acknowledges that `currentTime` is a
`CSSNumberish` (the comment at line 162: "a `{value, unit}` for a scroll timeline") but
the extraction at lines 164-166 accepts only `typeof rawTime === "number"` — a
`CSSUnitValue` (`{value: 0.42, unit: "percent"}`) from a scroll-driven `CSSAnimation`
is NOT a `number`, so `currentTime` defaults to `0`. `seedAtTime` at line 221 then
positions the kf playhead at `0 ms`, which for a scroll-driven animation maps to the
top of the scroll range, not the current scroll position. The takeover jumps the scroll
target to position 0 — the same flash the continuity seed was built to prevent.

The fix composes K.W9's scroll grammar (`scroll-grammar.ts`) and the `ScrollTimeline`
driver (`timeline.ts`): the kf side of a scroll-driven animation does NOT use a ms
timestamp — it uses a scroll percentage. A `CSSUnitValue` with `unit: "percent"` must
be converted to the `[0, 1]` progress domain and handed to the kf `ScrollTimeline`
rather than to `seedAtTime`'s rAF baseline.

**Cure.** In `adoptRunning`, after extracting `rawTime`, branch on its shape: if `rawTime`
is a `CSSUnitValue` with `unit: "percent"`, compute `scrollProgress = rawTime.value / 100`
and seed the kf animation via its `ScrollTimeline.setProgress(scrollProgress)` (or the
equivalent manual-timeline seeding path) rather than `seedAtTime(animation, 0)`. If the
reconstructed animation carries an `animation-timeline: scroll(…)` option, wire it to a
`ScrollTimeline` seeded at `scrollProgress` before calling `play()`. A `CSSUnitValue` with
`unit !== "percent"` (unexpected unit from a future spec extension) emits an `"ADOPT_REFUSE"`
diagnostic (citing the unit) and returns `{ animation: null, currentTime: 0, diagnostics }`.

**Gate arm (born-RED today, greens on cure).** `test/ingest.test.ts` new `describe` block:
stub a running scroll-driven animation via the `stubRunning` helper from clause (c) at
`ingest.test.ts:133-150`, but set `currentTime = { value: 42, unit: "percent" }` (a
`CSSUnitValue`) instead of a numeric ms. Call `adoptRunning(el, { animationName })`, and
assert: (1) `res.currentTime` is NOT `0` (the silent-default), and (2)
`res.diagnostics.some(d => d.code === "ADOPT_REFUSE")` is `false` — a scroll-time
`CSSUnitValue` is a valid input, not a refusal. On today's tree: `typeof rawTime` is not
`"number"`, `currentTime` defaults to `0`, the assertion (1) FAILS. `proof:ingest-replay`
new anchor: `scroll-time` clause requiring a `CSSUnitValue` / `"percent"` branch in the
`currentTime` extraction block (pattern: `unit.*percent|CSSUnitValue` in
`ingest.ts:162-166`).

---

## Born-RED gate

**Gate name:** `proof:ingest-replay` (existing; extended by five new clauses).

**Script:** `scripts/proof-ingest-replay.mjs` — append five new `requireAll` blocks
(one per S-clause), each with at least one anchor whose regex does NOT match the
current source. Each block must fail on today's tree before any cure is applied.

**Witness inputs — what REDS today:**

| Clause | Witness input | Red behavior on today's tree |
|--------|---------------|------------------------------|
| S1 delay-reset | Reconstruct from `.foo { animation: spin 2s 500ms }`, call `seedAtTime(anim, 600)`, advance one frame | `effectiveT` stays at `600` forever — `onStart()` left `paused=true` |
| S2 nested-walk | Install `@media screen { @keyframes nested { … } }`, call `fromStyleSheets([sheet])` | `animations.size === 0` — flat walk skips `@media` body |
| S3 adopt-refuse | Call `adoptRunning` with a name not present in `getAnimations()` | `diagnostics[0].code === "WAAPI_INELIGIBLE"` — no `"ADOPT_REFUSE"` code exists |
| S4 shadow-walk | Pass a `ShadowRoot` (or sheet from `adoptedStyleSheets`) to `fromStyleSheets` | Result is empty (falls through to wrong branch or throws); no `shadowPulse` key |
| S5 scroll-time | Stub `currentTime = { value: 42, unit: "percent" }` on the native animation | `res.currentTime === 0` — CSSUnitValue is not `typeof "number"`, defaults silently |

**What greens on cure:** Each new `requireAll` anchor matches the patched source. The
corresponding `vitest` assertions in `test/ingest.test.ts` pass. `proof:ingest-replay`
exits 0. `npm test` (`vitest run test/ingest.test.ts`) green.

**The no-new-gate-NAME caveat.** L.W3 extends the EXISTING `proof:ingest-replay` gate
rather than creating a new named gate. This is correct: the gate already owns the
ingest contract; adding arms to it deepens the same invariant. The wave's exit
criterion is `proof:ingest-replay` GREEN on all TWELVE clauses (the original eight
plus these five). If the wave spec author determines a standalone `proof:ingest-deep`
is clearer, the naming is implementation-detail; the born-RED proof obligation does
not change.

---

## Deps

None. All five S-clauses ride `src/animation/ingest.ts` and `src/animation/ingest-cssom.ts`
(already HEAVY, already behind `loadAnimationEngine()`). No value.js or glass-ui publish
gate is required. S5's scroll-time branch composes the K.W9 `ScrollTimeline` (already
shipped at `src/animation/timeline.ts`; no new dependency). `adapter.ts` is a kf-internal
file — adding `"ADOPT_REFUSE"` to `DiagnosticCode` is a kf-owned type change, not a
cross-repo ask.

---

## Bite — what regression each clause gate catches

| Clause | Regression the gate catches |
|--------|-----------------------------|
| S1 delay-reset | A future refactor of `seedAtTime` that re-introduces delay sleep (e.g., a clean rewrite that calls `animation.play()` directly, which goes through the full delay path) freezes takeovers of any animation with declared delay. |
| S2 nested-walk | Any simplification of `walkSheet` that removes the recursive descent (e.g., replacing it with a `Array.from(rules).filter(isKeyframesRule)` one-liner) silently drops `@keyframes` inside `@media`/`@layer`/`@container`. |
| S3 adopt-refuse | Any future diagnostic-code refactor that collapses `"ADOPT_REFUSE"` back into `"WAAPI_INELIGIBLE"` (e.g., a generic error handler) forces consumers back to message-scraping; the gate bites because the `ADOPT_REFUSE` anchor pattern must appear in `adapter.ts`. |
| S4 shadow-walk | A source-resolution refactor that removes the `ShadowRoot` branch (e.g., a simplification that accepts only `Document | CSSStyleSheet[]`) silently drops shadow-stylesheet keyframes fleet-wide. |
| S5 scroll-time | A `currentTime` extraction simplification that collapses to `typeof rawTime === "number" ? rawTime : 0` (the current code) drops scroll-timeline takeovers silently; the gate forces the CSSUnitValue branch to remain. |
