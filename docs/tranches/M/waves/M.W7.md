# M.W7 — Ingest deepening II (cross-depth sibling linkage + the live-web residuals)

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:**
  NONE beyond the existing ingest surface (kf-internal; value.js 0.13.0
  sufficient — `walkSheet`/`fromLiveAnimations`/`reconstructFromRule` already
  exist; no sibling publish gate). Parallel with M.W5 ∥ M.W6 (the three Band-B
  kf-internal correctness waves, value.js-0.13.0-sufficient — no cross-wave file
  collision: M.W5 touches `compile.ts`/`format.ts`/`frame-compiler.ts`; M.W6
  touches `compile-color.ts`/densify; M.W7 touches `ingest-cssom.ts`/`ingest.ts`).
  Composes with M.W1's report-all runner but does NOT require it.
- **Gate (extended):** `proof:ingest-replay` (EXISTING —
  `scripts/proof-ingest-replay.mjs` + its behavior twin `test/ingest.test.ts`,
  wired as `node scripts/proof-ingest-replay.mjs && vitest run
  test/ingest.test.ts`, `package.json:91`). This wave adds THREE clauses: (a) a
  cross-depth sibling-linkage clause born-RED because `walkSheet`'s
  `styleRuleTexts` is rebuilt fresh per recursion level
  (`ingest-cssom.ts:188-198`) so a nested `@keyframes` cannot see a top-level
  `.foo{animation}`; (b) a `fromLiveAnimations`-shadow clause born-RED because
  `fromLiveAnimations` resolves only against `ownerDoc`, never the element's
  shadow root (`ingest-cssom.ts:449-458`); (c) a scroll-domain BOOK clause (a
  source-shape + ledger honesty arm — no behavior change).
- **Folds (lane #):** lane-03 §0.3 / §1.3 / §2 P2 (cross-depth sibling linkage
  silent loss) · lane-03 §0.2 / §1.4 / §2 P3 (`fromLiveAnimations` shadow-DOM
  silent absent) · lane-03 §0.1 / §1.5 / §2 P1 (the scroll→rAF domain-mismatch
  unrecorded BOOK) · lane-03 §3 (the M-W ingest-deepening-II proposal, the three
  born-RED clauses) · lane-03 §4 (the deferred folds + tripwires).
- **Precept cure:** the no-silent-drop law ("what cannot ingest faithfully is
  REFUSED with a NAMED reason, never silently approximated") — TWO silent-loss
  breaches (cross-depth options-default; shadow silent-absent) — plus inv-ε (the
  DLL-10 scroll-time overclaim: "FOLD LANDED" without recording the
  rAF-substitution residual).

---

## Context

L.W3 shipped five correctness cures over K.W8's ingest substrate (S1 delay-reset,
S2 nested-walk, S3 ADOPT_REFUSE, S4 shadow-walk, S5 scroll-time) and is SOUND —
`proof:ingest-replay` GREEN, 18/18 vitest assertions pass (lane-03 §0 verdict,
§1.1). But the 32-lane re-audit live-traced the surface the gate could not see and
found THREE residual gaps that survive the L.W3 close — two are the SAME
no-silent-drop failure class the tranche is named to cure, the third an inv-ε
overclaim. None requires a sibling publish (lane-03 §3: "all three are
kf-internal").

**Breach 1 — cross-depth sibling-rule linkage silent loss (lane-03 §0.3, §1.3,
§2 P2).** L.W3 S2 made `walkSheet` (`ingest-cssom.ts:177-245`) recurse into
`CSSGroupingRule` bodies so a `@keyframes` inside `@media`/`@supports`/`@layer`/
`@container` is reconstructed rather than silently absent — and that descent is
correct. But the SIBLING-style-rule linkage that recovers an animation's declared
options is LOCAL to each recursion level. `walkSheet` builds `styleRuleTexts`
fresh at the head of each call from the CURRENT `rules` list only
(`ingest-cssom.ts:188-198` — the first-pass `for` loop over `rule.type === 1`),
then the recursion re-enters a grouping rule's `.cssRules` with the same `out` Map
but a FRESH (empty-of-ancestors) `styleRuleTexts` (`ingest-cssom.ts:242`
`walkSheet<V>(rule.cssRules, out, options, depth + 1)`). So for the real-world
pattern:

```css
/* top level */
.foo { animation: pulse 1s linear; }

/* inside @media */
@media screen {
  @keyframes pulse { 0% { opacity: 0 } 100% { opacity: 1 } }
}
```

the inner `walkSheet` over the `@media` body finds `@keyframes pulse`, collects
style rules from WITHIN `@media` (none), runs `nameRe` (`ingest-cssom.ts:214-216`)
against an empty `styleRuleTexts`, finds `sibling === undefined`
(`ingest-cssom.ts:217`), and calls `reconstructFromRule(rule.cssText, undefined,
…)` (`ingest-cssom.ts:220-225`). With `siblingText === undefined` the
reconstructed `CSSKeyframesAnimation` carries NO declared options — duration,
easing, and delay fall back to engine defaults (1000ms / easeInOutCubic / 0). The
authored `animation: pulse 1s linear` timing is SILENTLY ignored. This is the
SILENT-LOSS class: the walk returns a result, the Map has the entry, the gate is
green — but the reconstructed timing differs from the authored CSS (lane-03 §1.3).
The existing S2 test (`test/ingest.test.ts:366-388`) asserts only
`animations.has("nestedKf")` / `animations.has("nestedSupports")` — never that the
reconstructed animation carries its sibling-declared duration; the S2 gate anchor
(`proof-ingest-replay.mjs:418-457`, a source-shape check that `walkSheet` recurses
+ reads `.cssRules`) also does not bite this gap.

**Breach 2 — `fromLiveAnimations` shadow-DOM silent absent (lane-03 §0.2, §1.4,
§2 P3).** L.W3 S4 added a `ShadowRoot` branch to `resolveLiveKeyframes`
(`ingest-cssom.ts:308`) so `fromStyleSheets(shadowRoot)` works. But
`fromLiveAnimations` (`ingest-cssom.ts:418-466`) — the "narrow to the names
currently RUNNING" front door — reconstructs via `resolveLiveKeyframes(ownerDoc,
…)` where `sheetSource` is ALWAYS the owner document, never the element's shadow
root (`ingest-cssom.ts:449-458`: `ownerDoc = scope instanceof Document ? scope :
(scope as Element).ownerDocument`, then `resolveLiveKeyframes(sheetSource, …)`).
When a custom element running a shadow-hosted animation is passed as `target`:

1. `scope.getAnimations()` returns the running animation — shadow-origin
   animations ARE returned by `getAnimations()` on the hosting element per the Web
   Animations spec (`ingest-cssom.ts:441-443` collects its `animationName`).
2. `ownerDoc` resolves to the TOP-LEVEL document (`ingest-cssom.ts:452`).
3. `resolveLiveKeyframes(ownerDoc, {animationName: name})` walks the document's
   stylesheets — NOT the shadow root — finds no matching `@keyframes`, and returns
   an empty `animations` Map (`ingest-cssom.ts:456-462` merges nothing).

The animation is silently absent from the result — no diagnostic row, the
forbidden silent-absent class (lane-03 §2 P3: "the caller has no way to know the
ingest failed"). The S4 test (`test/ingest.test.ts:433-449`) only exercises
`fromStyleSheets(shadow)`, never `fromLiveAnimations(shadowElement)`.

**Breach 3 — the scroll→rAF domain-mismatch unrecorded BOOK (lane-03 §0.1, §1.5,
§2 P1 — inv-ε, NOT a behavior fix).** L.W3 S5 resolves a scroll-driven
`CSSUnitValue` percent and seeds the rAF-timeline playhead at `scrollProgress *
animation.options.duration` ms (`ingest.ts:255-258`), cancels the native
scroll-driven animation (`ingest.ts:275` `live.cancel()`), and hands the element
to a TIME-driven rAF animation via `seedAtTime` (`ingest.ts:284`). After the
takeover the animation advances in real time — it does NOT track scroll position.
This is an honest simplification (there is no direct mapping from native
`animation-timeline: scroll()` to a kf `KeyframesScrollTimeline` without
inspecting the author's declared scroll container/range/axis — lane-03 §1.5), and
the cure correctly prevents the silent-zero-flash. But the limitation is NOT
documented: no BOOK comment at `ingest.ts:250-258` names the rAF-substitution, and
the deferred-ledger DLL-10 records "scroll-time `currentTime` seed FOLD LANDED"
without noting the post-takeover animation is no longer scroll-driven (lane-03
§2 P1: "a mild overclaim" against inv-ε — "every claim cites an observed oracle,
never overclaim"). A consumer expecting scroll-continuity after `adoptRunning`
will be surprised.

**The proxies the audit indicts.** The S2 gate anchor (`proof-ingest-replay.mjs:418-457`)
greps that `walkSheet` recurses and reads `.cssRules` — a SOURCE-SHAPE check that
GREENs on "the recursion exists" and is BLIND to whether the reconstructed
animation carries its sibling-declared timing. The S4 gate anchor
(`proof-ingest-replay.mjs:498-507`) requires `ShadowRoot` + `adoptedStyleSheets`
to APPEAR in `resolveLiveKeyframes` — and is BLIND to whether
`fromLiveAnimations(shadowEl)` actually resolves. Both are the
inv-M-observable-truth failure mode (M.md §inv-M-observable-truth): the gate
tested a proxy, not the observable that actually breaks. The clauses this wave
authors must bite the REAL observable — the engine-default duration on the
reconstructed object, and the empty Map from `fromLiveAnimations(shadowEl)` — both
live-witnessed RED on today's tree.

### Audit evidence

| Ref | Source location | Fact |
|-----|-----------------|------|
| lane-03 §1.3 | `src/animation/ingest-cssom.ts:188-198` | `styleRuleTexts` is built fresh at the head of EACH `walkSheet` call from the CURRENT `rules` list only (the `type === 1` first-pass loop) — never carries ancestor-level style rules |
| lane-03 §1.3 | `src/animation/ingest-cssom.ts:242` | the recursion `walkSheet<V>(rule.cssRules, out, options, depth + 1)` re-enters with the same `out` Map but an empty-of-ancestors `styleRuleTexts` |
| lane-03 §1.3 | `src/animation/ingest-cssom.ts:214-217` | `nameRe = /\banimation(?:-name)?\s*:[^;}]*\b${name}\b/`; `sibling = styleRuleTexts.find((t) => nameRe.test(t))` → `undefined` when the sibling is at an ancestor depth |
| lane-03 §1.3 | `src/animation/ingest-cssom.ts:220-225,257` | `reconstructFromRule(rule.cssText, sibling /* undefined */, options.options, perRule)` — `siblingText === undefined` → reconstructed object carries NO declared options, falls to engine defaults (1000ms / easeInOutCubic / 0) |
| lane-03 §1.3 | `test/ingest.test.ts:366-388` | the S2 test asserts only `animations.has("nestedKf")` / `has("nestedSupports")` — never the sibling-declared duration; the gap is untested |
| lane-03 §1.3 | `scripts/proof-ingest-replay.mjs:418-457` | the S2 `nested-walk` clause is a SOURCE-SHAPE check (`walkSheet` self-call + inner `.cssRules` read) — blind to the cross-depth options loss |
| lane-03 §1.4 | `src/animation/ingest-cssom.ts:449-458` | `fromLiveAnimations` sets `sheetSource = ownerDoc ?? undefined` and calls `resolveLiveKeyframes(sheetSource, {animationName: name})` — ALWAYS the document, never the shadow root |
| lane-03 §1.4 | `src/animation/ingest-cssom.ts:441-443` | `getAnimations()` collects the running shadow-origin `animationName` (the name IS found) — so the breach is a silent-absent, not a not-found |
| lane-03 §1.4 | `test/ingest.test.ts:433-449` | the S4 test exercises `fromStyleSheets(shadow)` only — never `fromLiveAnimations(shadowEl)` |
| lane-03 §1.5 | `src/animation/ingest.ts:255-258` | `currentTime = scrollProgress != null ? scrollProgress * animation.options.duration : msTime` — the rAF ms-domain seed |
| lane-03 §1.5 | `src/animation/ingest.ts:275,284` | `live.cancel()` then `seedAtTime(animation, currentTime)` — the element is handed to a TIME-driven rAF animation (no scroll-tracking after takeover); no BOOK comment names the substitution |
| dep | `src/animation/ingest-cssom.ts:308` | `resolveLiveKeyframes` already accepts `Document | DocumentOrShadowRoot`-class sources (the S4 `ShadowRoot` branch) — the shadow-root candidate plumbing already EXISTS; M.W7 routes `fromLiveAnimations` through it |
| ground truth | the DOM `Node.getRootNode()` | returns the shadow root for a shadow-hosted element (`composed:false` default) — the value.js-free standard accessor `fromLiveAnimations` can use as the shadow-source candidate |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. S1+S2 close the two
no-silent-drop breaches; S3 discharges the inv-ε BOOK; S4 holds the new clauses to
the REAL observable (born-RED on today's tree).

### S1 — cross-depth sibling linkage: a shared `siblingTexts` accumulator through `walkSheet`

**Breach.** A `@keyframes` nested in a grouping rule cannot find its sibling
`.foo{animation:…}` at an ancestor depth, so the reconstructed animation silently
uses engine defaults for duration/easing/delay (`ingest-cssom.ts:188-198,242` —
`styleRuleTexts` is per-level, never accumulated). Verified RED by the live trace
(lane-03 §1.3): a top-level `.foo{animation: pulse 1s linear}` + a
`@media{@keyframes pulse}` reconstructs `pulse` with `options.duration === 1000`
(the default), not `1000` from `1s` — coincidentally equal, so the falsifiable
assertion uses a NON-default duration (see S4 / gate bite).

**Cure (lane-03 §2 P2 Option (a) — the simple, correct fix).** Thread a shared
`siblingTexts: string[]` accumulator THROUGH the `walkSheet` recursion. The
top-level call seeds it; each level APPENDS its own `type === 1` style-rule
`cssText` to the SAME array before descending; the recursive call passes the same
accumulator down (`walkSheet<V>(rule.cssRules, out, options, depth + 1,
siblingTexts)`). The `nameRe`/`sibling` lookup (`ingest-cssom.ts:214-217`) then
searches the FLAT corpus of every ancestor-and-current level's style rules, so a
nested `@keyframes` finds a top-level `.foo{animation}`. This is the single-corpus
gestalt — ONE accumulator, scoped to the walk, no second linkage path, no
duplicate scan (lane-03 §3 "Option (a) is simple and correct").

**Constraint (scope-down-not-up; first-match-wins preserved).** The accumulator
grows as the walk DESCENDS — a sibling at the current-or-ancestor depth is
visible; a DEEPER sibling (in a different grouping branch the walk has not yet
entered) is NOT, which is correct (a `.foo` inside `@supports` does not name a
`@keyframes` in a sibling `@media`). The existing first-match-wins cascade comment
(`ingest-cssom.ts:209-213`) holds — ancestor style rules are appended BEFORE the
current level's, so the outermost match wins ties (deterministic; a later override
remains the BOOKed-not-half-wired scope already recorded at `ingest-cssom.ts:213`).

**Constraint (zero behavior change for the common path).** A top-level
`@keyframes` with a top-level sibling (the `fromString`-equivalent flat sheet)
already finds its sibling at depth 0 — the accumulator at depth 0 IS today's
`styleRuleTexts`, so the byte-identical lookup holds. The cure only ADDS ancestor
visibility for the nested case; no existing reconstruction changes.

**Gate bite (S4 coverage).** `installSheet(".foo { animation: pulse 1500ms linear;
} @media screen { @keyframes pulse { 0% { opacity: 0 } 100% { opacity: 1 } } }")`
then `fromStyleSheets([sheet])`; assert
`animations.get("pulse")!.animation.options.duration === 1500`. TODAY: the nested
`@keyframes` sees an empty `styleRuleTexts`, `sibling === undefined`,
reconstruction defaults to `1000` → `1500 !== 1000` → RED. After cure: the flat
accumulator carries the top-level `.foo`, `sibling` matches, the `1.5s` shorthand
is recovered → `1500` → GREEN. (1500ms is deliberately non-default so the
assertion discriminates the cure, not a coincidental default-equals-authored
value.)

---

### S2 — `fromLiveAnimations` resolves a shadow-hosted `@keyframes`

**Breach.** `fromLiveAnimations` passes `ownerDoc` (never the shadow root) to
`resolveLiveKeyframes`, so a running shadow-hosted animation found by
`getAnimations()` is silently absent from the result — empty Map, no diagnostic
(`ingest-cssom.ts:449-458`). The S4 cure only guarded `fromStyleSheets`.

**Cure (lane-03 §2 P3 Option (a) — the shadow-root candidate, reusing the existing
S4 branch).** When `target` is an Element, compute its `getRootNode()` (the DOM
standard accessor — returns the shadow root for a shadow-hosted element, the
document otherwise; value.js-free). If the document-level
`resolveLiveKeyframes(ownerDoc, …)` returns EMPTY for a name that IS in `liveNames`
(`ingest-cssom.ts:440-444`), re-resolve against the shadow root candidate via the
SAME `resolveLiveKeyframes` (its S4 `ShadowRoot` branch, `ingest-cssom.ts:308`,
already walks `styleSheets` + `adoptedStyleSheets`). The shadow-root path is the
EXISTING resolver, re-aimed — no second walk, no bespoke shadow logic in
`fromLiveAnimations` (the single-resolver gestalt; the S4 branch is the ONE shadow
walker, both front doors route through it).

**Constraint (try-document-first, shadow-fallback; no double-emit).** The document
walk runs first (the common case — most live animations are document-hosted); the
shadow re-resolve fires ONLY when the document walk yields nothing for a found
name AND the target's root node is a `ShadowRoot` (not the document). A name
resolved at the document level is NOT re-walked (no duplicate Map entries). When
BOTH walks return empty for a found name, the result is still empty for that name
— the silent-absent class is then a genuine not-reconstructable (a follow-on
diagnostic-emission is lane-03 §2 P3 Option (b), EXCLUDED here as a separate
honesty arm; this wave's contract is the shadow RESOLUTION, the positive cure).

**Constraint (SSR-safe; no new capability assumption).** The `getRootNode()` /
`ShadowRoot` checks are guarded the same way the existing `scope.getAnimations`
capability gate is (`ingest-cssom.ts:427`) — an Element without `getRootNode`
(non-DOM scope) takes the document-only path unchanged. No new global, no new
import.

**Gate bite (S4 coverage).** Stub a shadow-hosted running animation: attach a
shadow root carrying `@keyframes shadowPulse{…}`, start it on the shadow-hosted
element, call `fromLiveAnimations(shadowEl)`; assert
`animations.has("shadowPulse")`. TODAY: the document walk finds no `shadowPulse`
`@keyframes`, the Map is empty → RED. After cure: the shadow-root re-resolve
reconstructs it → GREEN.

---

### S3 — the scroll→rAF domain-mismatch BOOK + ledger row (inv-ε, no behavior change)

**Breach.** The S5 scroll-time cure substitutes a TIME-driven rAF continuation for
the cancelled scroll-driven native animation, but neither the source nor the
deferred ledger names the substitution — DLL-10 says "FOLD LANDED" (lane-03 §1.5,
§2 P1). A consumer expecting scroll-tracking after `adoptRunning` is surprised; the
overclaim violates inv-ε.

**Cure (lane-03 §3 clause 3 — documentation + honesty, NOT a behavior fix).** Add
a BOOK comment at `ingest.ts:250-258` (the `currentTime` scroll branch) that
explicitly names the rAF-substitution: the post-takeover animation is TIME-driven,
NOT scroll-tracking; full scroll-continuity requires wiring a
`KeyframesScrollTimeline` driven by the SAME scroll container/range/axis as the
native animation's `animation-timeline` — the deferred path. Add a corresponding
row to the M deferred ledger (`M/PROGRESS.md §"Open deferrals"`) naming the
rAF-substitution residual and its FOLD condition (the value.js-O typed scroll
container/range surface, beside DLL-27, lane-03 §4). This is the inv-ε discharge —
the cure does NOT change the seed behavior (the ms-domain takeover is the honest
best the current engine can do; lane-03 §2 P1 "MINOR — the cure IS correct").

**Constraint (axis-typed, not runtime-behavioral).** Per inv-M-two-axis, S3 closes
on a STATIC/source-shape axis — a source-comment marker — because it is a
source-shape-and-honesty invariant (a BOOK presence + a ledger row), not a
data-model or UI runtime behavior. Forcing this through a browser gate would be the
mis-axis the precept reform forbids (M.md §inv-M-two-axis). The gate arm is a
source anchor requiring the BOOK marker prose at the scroll branch (S4).

**Gate bite (S4 coverage).** A source-shape clause over `ingest.ts` requires a
`BOOK` marker (or the specific prose phrase naming "rAF-substitution" / "not
scroll-tracking") within the scroll-percent `currentTime` branch
(`ingest.ts:250-258`), AND the M ledger row exists. TODAY: no such marker, DLL-10
overclaims → RED. After cure: the marker + ledger row present → GREEN.

---

### S4 — the three clauses are born-RED over the REAL observable (inv-M-observable-truth)

**Breach.** The L.W3 S2 + S4 gate anchors are SOURCE-SHAPE proxies
(`proof-ingest-replay.mjs:418-457` greps the recursion; `:498-507` greps
`ShadowRoot`/`adoptedStyleSheets`) — GREEN on "the structure appears" and BLIND to
whether the cross-depth options or the shadow `fromLiveAnimations` actually resolve
(lane-03 §1.3, §1.4). Authoring the new clauses as further source greps would
repeat the inv-M-observable-truth failure.

**Cure (behavioral assertions, NOT proxies; the test-twin is the home).** The S1
+ S2 clauses are authored as BEHAVIORAL assertions in `test/ingest.test.ts` (the
behavior twin `proof:ingest-replay` already runs — `package.json:91` —
`installSheet` is the existing fixture helper, `test/ingest.test.ts:37`):

1. **cross-depth duration** — `fromStyleSheets([crossDepthSheet])` then
   `expect(animations.get("pulse")!.animation.options.duration).toBe(1500)` (the
   authored `1.5s`, NOT the `1000` default). Fails today (engine default).
2. **shadow live** — `fromLiveAnimations(shadowEl)` then
   `expect(animations.has("shadowPulse")).toBe(true)`. Fails today (empty Map).

The S3 BOOK clause is the ONE source-shape arm (it IS a source-shape invariant —
inv-M-two-axis), added to `proof-ingest-replay.mjs` as a marker-presence anchor
over `ingest.ts`. The node gate's role for S1/S2 is to HOLD the behavior tests to
the REAL ingest surface (the existing `&& vitest run test/ingest.test.ts` seam
already does this — the assertions import the genuine `fromStyleSheets` /
`fromLiveAnimations`, not a source string).

**Constraint (born-RED on TODAY's tree — the keystone).** Each behavioral
assertion MUST be authored FIRST and witnessed RED before its cure: the cross-depth
duration is `1000 !== 1500` today (live-traced, lane-03 §1.3); the shadow live Map
is empty today (live-traced, lane-03 §1.4); the BOOK marker is absent today
(grep → 0). The born-RED witnesses are the GENUINE defects — the engine-default
duration on the reconstructed object and the silent-absent shadow Map — not proxies
for them (inv-M-observable-truth discharged). A gate that merely greps "the
accumulator parameter exists in source" or "`getRootNode` appears" would repeat the
L.W3 mistake and is forbidden.

**Gate bite (self-coverage).** Plant S1 → the cross-depth assertion greens; revert
→ default `1000`, RED. Plant S2 → the shadow assertion greens; revert → empty Map,
RED. Plant S3 → the marker anchor greens; revert → RED. Each clause discriminates
the EXACT state its cure changes.

---

## Born-RED gate

**Gate:** `proof:ingest-replay` (EXISTING — `scripts/proof-ingest-replay.mjs` +
its behavior twin `test/ingest.test.ts`, wired `node
scripts/proof-ingest-replay.mjs && vitest run test/ingest.test.ts`,
`package.json:91`). This wave ADDS three clauses (S1 cross-depth behavioral, S2
shadow-live behavioral, S3 scroll-BOOK source-anchor) and does NOT weaken any
existing clause. The gate is GREEN on today's tree against the source-shape proxies
(lane-03 §1.1: `proof:ingest-replay` exit 0, 18/18 vitest); after this wave's new
clauses it goes RED on today's tree until S1+S2+S3 land.

**The REAL observable (inv-M-observable-truth).** The born-RED witness is the
GENUINE defect, live-traced in lane-03, NOT a proxy:

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after cure |
|--------|-------------------------|------------------------------------------|---------------------|
| S1 cross-depth | `fromStyleSheets` over `.foo{animation:pulse 1500ms linear}` (top level) + `@media{@keyframes pulse}`; assert `animations.get("pulse").animation.options.duration === 1500` | `styleRuleTexts` is per-level → nested `@keyframes` sees no ancestor sibling → `sibling === undefined` → reconstruction defaults `duration` to **1000**, the authored `1.5s` is **silently dropped** (live trace, lane-03 §1.3) | the flat `siblingTexts` accumulator carries the top-level `.foo`; `pulse` reconstructs with `duration === 1500` |
| S2 shadow-live | stub a running shadow-hosted `@keyframes shadowPulse`; `fromLiveAnimations(shadowEl)`; assert `animations.has("shadowPulse")` | `fromLiveAnimations` resolves only against `ownerDoc` → the shadow `@keyframes` is not found → the Map is **empty, no diagnostic** (the silent-absent class, live trace, lane-03 §1.4) | the `getRootNode()` shadow re-resolve reconstructs `shadowPulse`; `has(…)` is true |
| S3 scroll-BOOK | grep `ingest.ts:250-258` for the rAF-substitution BOOK marker; check the M ledger row | NO marker; DLL-10 records "FOLD LANDED" with no rAF-substitution residual (the inv-ε overclaim, lane-03 §1.5/§2 P1) | the BOOK comment names the time-driven-not-scroll-tracking residual; the M ledger row exists |

**Today's tree result.** With the three clauses authored, `proof:ingest-replay`
exits non-zero: the cross-depth fixture reconstructs `pulse` with the engine
default `1000` (not `1500`), `fromLiveAnimations(shadowEl)` returns an empty Map,
and the scroll BOOK marker is absent. The born-RED is the genuine silent-loss /
silent-absent / overclaim, not a stand-in — inv-M-observable-truth met (the L.W3
S2/S4 source-shape proxies missed these exact gaps; this wave does not repeat the
pattern).

**Green condition.** `walkSheet` threads a shared `siblingTexts` accumulator so a
nested `@keyframes` recovers its top-level sibling's options (S1);
`fromLiveAnimations` re-resolves against the element's shadow root when the
document walk is empty for a found name (S2); the scroll-percent branch carries the
rAF-substitution BOOK + the M ledger row (S3); the three new clauses' behavioral
disjuncts hold (S4); and every pre-existing `proof:ingest-replay` clause (S1
delay-reset, S2 nested-walk presence, S3 ADOPT_REFUSE, S4 shadow-walk presence, S5
scroll-time) + all existing `test/ingest.test.ts` assertions stay GREEN (no
regression).

---

## Dependencies

- **NONE beyond the existing ingest surface — value.js 0.13.0 sufficient, NO
  sibling publish gate.** `walkSheet`, `reconstructFromRule`,
  `resolveLiveKeyframes` (with its S4 `ShadowRoot` branch), and
  `fromLiveAnimations` all already exist (`ingest-cssom.ts`). S1 threads an
  accumulator parameter; S2 re-aims the existing shadow resolver via the DOM
  standard `getRootNode()`; S3 is a comment + ledger row. No value.js API is
  consumed that is not already present (lane-03 §3: "None requires a sibling
  publish"; §5: "the `fromLiveAnimations` shadow fix and the cross-depth sibling
  linkage are kf-internal and do not require value.js changes").
- **No cross-wave file collision (Band-B parallel).** M.W7 touches
  `ingest-cssom.ts` (`walkSheet` + `fromLiveAnimations`), `ingest.ts` (the S3 BOOK
  comment), `test/ingest.test.ts`, and `proof-ingest-replay.mjs`. M.W5 touches
  `compile.ts`/`format.ts`/`frame-compiler.ts` + `proof-replay-equality.mjs`; M.W6
  touches `compile-color.ts`/densify + `proof:compile-replay`. Disjoint surfaces —
  the three Band-B waves land in parallel.
- **Composes with M.W1 (does NOT require it).** M.W1's report-all runner schedules
  `proof:ingest-replay` as one node it no longer aborts the `&&` chain on; the
  iterate-to-green speedup compounds but is not owned here. M.W7 lands
  independently.
- **The DEEPER nested group-rule substrate is a SEPARATE deferred fold (DLL-27 /
  L.W10.S3).** Descending into SEMANTICALLY-TYPED group rules
  (`@container`/`@layer`/`@scope` recursive parse, not duck-typed `cssRules`) is
  already dispatched to value.js Tranche O (`KF-TO-VALUEJS-O-ASKS.md §9`) and
  tripwired (lane-03 §4): value.js O publishes the typed recursive at-rule body →
  kf re-pins → `walkSheet` descends into typed groups. NOT this wave (M.W7's
  recursion is the existing duck-typed `cssRules` descent; the sibling accumulator
  rides it as-is).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 cross-depth sibling | A `@keyframes` nested in `@media`/`@supports`/`@layer`/`@container` whose `.foo{animation:…}` is at the top level reconstructs with ENGINE-DEFAULT duration/easing/delay — the authored timing is silently dropped (the no-silent-drop law re-breached on the ingest surface); the per-level `styleRuleTexts` relapses |
| S2 `fromLiveAnimations` shadow | A running SHADOW-hosted animation found by `getAnimations()` is silently absent from `fromLiveAnimations`'s result — empty Map, no diagnostic, the forbidden silent-absent class; the front door relapses to document-only resolution |
| S3 scroll-BOOK | The DLL-10 "FOLD LANDED" overclaim re-opens — a consumer adopts a scroll-driven animation and is surprised it stops scroll-tracking after takeover, with nothing in the source or ledger naming the rAF-substitution (inv-ε) |
| S4 observable-truth | The new clauses relapse to SOURCE-SHAPE proxies (grep "the accumulator parameter / `getRootNode` appears") and go BLIND to whether the cross-depth options or the shadow `fromLiveAnimations` actually resolve — the L.W3-S2/S4 inv-M-observable-truth failure the tranche is named to cure |

---

## Excluded from this wave

- **The `fromLiveAnimations` shadow-DIAGNOSTIC arm (lane-03 §2 P3 Option (b)).**
  Emitting a `CORS_SKIP`-class diagnostic when BOTH the document AND shadow walks
  return empty for a found name is a SEPARATE honesty arm. M.W7's contract is the
  shadow RESOLUTION (the positive cure); the diagnostic-on-genuine-not-found is a
  follow-on (a `not-reconstructable` row), not this wave.
- **The deeper SEMANTICALLY-TYPED group-rule walk (DLL-27 / L.W10.S3).** Descending
  into typed `@container`/`@layer`/`@scope` bodies (vs. the duck-typed `cssRules`)
  is sibling-gated on value.js Tranche O (`KF-TO-VALUEJS-O-ASKS.md §9`) and
  tripwired in lane-03 §4 — NOT kf-internal, NOT this wave. The S1 accumulator
  rides the existing duck-typed descent unchanged; when the typed substrate lands,
  it threads through the SAME accumulator seam, NOT a re-architecture.
- **Path B scroll-continuity (the `KeyframesScrollTimeline` rAF-vs-scroll bridge).**
  Actually DRIVING the adopted animation by scroll position after takeover (wiring
  a `KeyframesScrollTimeline` to the native `animation-timeline`'s scroll
  container/range/axis) is the BOOKed deferred path S3 NAMES — it is a behavior
  feature requiring the author's declared scroll topology, EXCLUDED here. S3
  records the residual honestly; it does NOT build the bridge.
- **The depth-guard test (lane-03 §1.3 / §7 MINOR).** Exercising `MAX_WALK_DEPTH`
  (`ingest-cssom.ts:141`) against an adversarial deep CSSOM is a low-priority
  hardening test, not a correctness gap on the no-silent-drop law — mentioned in
  the audit, not folded into this wave's born-RED scope.
- **The M.W5 named-selector + `@property` compile fixes** (`frame-compiler.ts`
  parse seam, `compile.ts`/`format.ts` `@property` emit) and **the M.W6 multi-color
  densify fixes** (`compile-color.ts` oklch dispatch, non-color preservation) — the
  sibling Band-B waves. M.W7 touches the `ingest-cssom.ts`/`ingest.ts` ingest
  surface only.
