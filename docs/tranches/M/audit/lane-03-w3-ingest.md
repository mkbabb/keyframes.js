# Lane 03 — L.W3 Ingest Deepening Audit
## Tranche M seed · keyframes.js

**Lane:** 03 · **Subject:** L.W3 (ingest deepening: seedAtTime delay-reset, nested-walk,
ADOPT_REFUSE, shadow-walk, scroll-time CSSUnitValue) · **Branch audited:**
`tranche-l-dev` (tip `529fcfd`) · **Date:** 2026-06-17

---

## §0 — VERDICT

L.W3 shipped five correctness cures over K.W8's ingest substrate and is SOUND. Every
born-RED gate arm greens, all 18 vitest assertions pass, and the implementation is
architecturally correct for the five stated clauses. The cures are faithful to the
no-silent-drop law and the stable-`code` contract.

**Three residual gaps survive the L.W3 close and are new M-wave candidates:**

1. **The scroll-domain mismatch is an unrecorded BOOK** — the S5 cure converts a
   scroll-driven `CSSUnitValue` percent to a ms timestamp and hands it to a rAF-timeline
   animation (`ingest.ts:255-258`). After the takeover the animation runs time-forward,
   NOT scroll-tracking. This is the best the current engine can do without a scroll→rAF
   bridge, but the limitation is undocumented (no BOOK comment in the source, no deferred-
   ledger row). A consumer who expects the adopted animation to TRACK scroll position will
   be surprised.

2. **`fromLiveAnimations` does not handle shadow-hosted `@keyframes`** — `fromLiveAnimations`
   (`ingest-cssom.ts:418-466`) reads running animation names from `scope.getAnimations()` but
   reconstructs via `resolveLiveKeyframes(ownerDoc, ...)`, using the DOCUMENT's sheets, never
   the element's shadow root. If the `@keyframes` rule lives in a shadow stylesheet (the exact
   S4 scenario), `resolveLiveKeyframes` returns empty and the animation is silently absent from
   the result — the forbidden silent-absent class. The S4 test only exercises
   `fromStyleSheets(shadowRoot)`, not `fromLiveAnimations(shadowEl)`.

3. **Cross-depth sibling-rule linkage is broken for nested `@keyframes`** — `walkSheet`'s
   recursive descent (`ingest-cssom.ts:238-244`) calls `walkSheet(rule.cssRules, out, options,
   depth + 1)` with the same `out` Map but a fresh `styleRuleTexts` collected from the INNER
   rules only. A style rule at the top level (`.foo { animation: pulse 1s; }`) and its paired
   `@keyframes` inside a `@media` block are matched across depths — but the inner walk collects
   style rules only from WITHIN that `@media` block. The sibling linkage (options extraction)
   fails silently for this real-world pattern; the animation is reconstructed WITHOUT its
   declared timing options (duration/easing/delay), falling back to engine defaults. No test
   exercises this; no gate anchor bites it.

---

## §1 — EVIDENCE (file:line anchors, verified against `tranche-l-dev`)

### 1.1 What L.W3 shipped — confirmed GREEN

All five S-clauses landed in commit `4863446`. Verified by re-run:

- `node scripts/proof-ingest-replay.mjs` → **exit 0** (20/20 clauses, all anchors green)
- `npx vitest run test/ingest.test.ts` → **18/18 passed**

Evidence for each clause:

| Clause | Source anchor | Gate anchor |
|---|---|---|
| S1 delay-reset | `ingest.ts:330` `animation.setDelay(0)` before `animation.onStart()` at line 335 | `proof-ingest-replay.mjs:388-408` delay-reset block; pattern `/setDelay\(\s*0\s*\)/` matches |
| S2 nested-walk | `ingest-cssom.ts:238-244` depth-guarded recursive `walkSheet<V>(rule.cssRules, out, options, depth + 1)` | `proof-ingest-replay.mjs:418-456` nested-walk block; requires `walkSheet\s*(` in body + `.cssRules` |
| S3 ADOPT_REFUSE | `adapter.ts:39` `\| "ADOPT_REFUSE"` in `DiagnosticCode`; `ingest.ts:171,236` emits it for both refusal paths | `proof-ingest-replay.mjs:464-490` adopt-refuse block; anchors in ADAPTER + INGEST |
| S4 shadow-walk | `ingest-cssom.ts:335-354` `ShadowRoot` branch; collects `source.styleSheets` + `source.adoptedStyleSheets ?? []` | `proof-ingest-replay.mjs:498-507` shadow-walk block; requires `\bShadowRoot\b` + `\badoptedStyleSheets\b` |
| S5 scroll-time | `ingest.ts:199-213` `isCSSUnitValue` duck-type; `rawTime.unit === "percent"` → `scrollProgress = rawTime.value / 100` at line 201; `currentTime = scrollProgress * animation.options.duration` at line 257 | `proof-ingest-replay.mjs:515-539` scroll-time block; pattern `/["']percent["']/` |

### 1.2 S1 delay-reset — correctness trace

`seedAtTime` flow (verified):

1. `animation.setUseWAAPI(false)` — forces rAF path (line 318)
2. `animation.setDelay(0)` — strips declared delay BEFORE `onStart()` (line 330)
3. `animation.onStart()` — with `options.delay === 0`, takes the immediate path (`engine.ts:825`
   `this.started = true; return undefined`) — does NOT set `paused = true`
4. `animation.started = true` — redundant with step 3 but not harmful (line 336)
5. `animation.startTime = now - t` — positions the rAF baseline so first tick lands at `≈ t`
   (line 345)
6. `animation.t = t` (line 346)
7. `void animation.play()` — starts the rAF loop via `_playRAF()`; first frame calls
   `advanceTo(now2)`, which finds `startTime` defined so enters `_advance` directly (not
   `onStart` again) → `this.t = now2 - (now - t) ≈ t + 16ms`. Correct.

The cure is sound. The sub-frame drift (~16ms between the `now()` read in `seedAtTime` and
the first rAF timestamp) is visually continuous — this is the acknowledged limitation in
the comment ("one frame (~16ms) — visually continuous, the whole point of the seed").

### 1.3 S2 recursive walk — correctness trace and gap

The `walkSheet` function (`ingest-cssom.ts:177-245`) is structurally correct for the
stated goal: a `@keyframes` inside a `@media`/`@supports`/`@layer`/`@container` block is
reconstructed by the recursive descent.

**Gap found:** the sibling-style-rule linkage is LOCAL to each depth level. The `styleRuleTexts`
array (lines 188-198) is built from style rules (`type === 1`) at the CURRENT `rules` list
— the direct children of the grouping rule, NOT rules at ancestor levels. In the pattern:

```css
/* top level */
.foo { animation: pulse 1s linear; }

/* inside @media */
@media screen {
  @keyframes pulse { 0% { opacity: 0 } 100% { opacity: 1 } }
}
```

`walkSheet` is called recursively on the `@media` rule's `cssRules`. The inner call finds the
`@keyframes pulse` rule, collects style rules from within `@media` (none here), finds no match
for `.foo`, and calls `reconstructFromRule(cssText, undefined, ...)`. The sibling is
`undefined`, so the reconstructed animation has NO declared options (falls back to engine
defaults). The CSS `.foo { animation: pulse 1s linear; }` timing is SILENTLY ignored.

No test exercises this. The S2 test (`test/ingest.test.ts:366-388`) only asserts
`animations.has("nestedKf")` and `animations.has("nestedSupports")` — it does NOT assert that
the reconstructed animation carries its sibling-declared duration or timing function. The gate
anchor (`proof-ingest-replay.mjs:433-457`) also does not bite this gap.

This is the SILENT LOSS class: the walk returns a result, the gate is green, but the
reconstructed animation's timing defaults differ from the authored CSS. A born-RED arm
exercising the cross-depth sibling linkage would FAIL today.

### 1.4 S4 shadow-walk — `fromLiveAnimations` gap

The S4 cure adds a `ShadowRoot` branch to `resolveLiveKeyframes`. `fromStyleSheets(shadowRoot)`
now works. But `fromLiveAnimations` (`ingest-cssom.ts:418-466`) calls
`resolveLiveKeyframes(ownerDoc, ...)` (line 457), passing the OWNER DOCUMENT — not the
element's shadow root. When a custom element running a shadow-hosted animation is passed as
`target`:

- `scope.getAnimations()` returns the running animation (shadow-origin animations ARE
  returned by `getAnimations()` on the hosting element per the Web Animations spec)
- `ownerDoc = (scope as Element).ownerDocument` → the TOP-LEVEL document
- `resolveLiveKeyframes(ownerDoc, ...)` walks the document's stylesheets, NOT the shadow root

The `@keyframes` rule in the shadow root is not found. The result is an empty `animations` Map
with no diagnostic row (a silent absent, the forbidden class).

Evidence: `ingest-cssom.ts:449-458` — `resolveLiveKeyframes<V>(sheetSource, ...)` where
`sheetSource` is always `ownerDoc` (the document, never the shadow root).

No test exercises this. The S4 test (`test/ingest.test.ts:433-449`) tests
`fromStyleSheets(shadow)`, not `fromLiveAnimations(shadowElement)`.

### 1.5 S5 scroll-time — domain mismatch is an unrecorded BOOK

The S5 cure resolves the `CSSUnitValue percent` shape and computes:

```typescript
// ingest.ts:255-258
const currentTime =
    scrollProgress != null
        ? scrollProgress * animation.options.duration
        : msTime;
```

This seeds the rAF-timeline playhead at `scrollProgress * duration` ms. The native
scroll-driven animation is CANCELLED (`live.cancel()` at line 275), and `seedAtTime` hands
the element to a **time-driven rAF animation** starting from the equivalent-progress ms
position. After the takeover, the animation advances in real time — it does NOT track the
scroll position. The spec (L.W3.md §S5 cure) described wiring to a `ScrollTimeline.setProgress`
or equivalent manual-timeline seeding path; the implementation uses the simpler ms-domain
seeding instead.

This is an honest simplification (the `KeyframesScrollTimeline` is a viewport-fraction
sampler, not a CSS scroll container tracker — there is no direct mapping from the native
`animation-timeline: scroll()` to a kf `KeyframesScrollTimeline` without inspecting the
author's declared scroll container, range, and axis). The cure prevents the silent-zero-flash;
the domain mismatch (time-tracking after adoption, not scroll-tracking) is the residual
limitation.

The limitation is NOT documented in the source (no BOOK comment in `ingest.ts` near lines
250-258 naming the domain mismatch or the deferred native scroll-driving wiring). It is
also NOT in the deferred-ledger-L.md — DLL-10 records the fold as LANDED without noting
the rAF-substitution as a residual.

---

## §2 — PRECEPT VIOLATIONS

### P1 — Silent loss, no BOOK (MINOR)

**File:** `ingest.ts:250-258`

The scroll→rAF domain substitution is a limitation with no documentation. After a scroll-driven
animation is adopted, the element's animation advances in time, not scroll position. A consumer
expecting scroll-continuity after `adoptRunning` will be surprised.

**Precept hit:** "NO workarounds" + inv ε ("every claim cites an observed oracle, never
overclaim"). The deferred-ledger entry DLL-10 claims "scroll-time `currentTime` seed FOLD
LANDED" without recording that the post-takeover animation is no longer scroll-driven.
This is a mild overclaim.

**Verdict:** MINOR — the cure IS correct (no silent-zero-flash), the limitation is real-world
narrow (a scroll-driven animation adopted into a kf rAF-driven continuation is usually the
INTENDED semantic — the caller is taking over to add spring/interactivity), but M should add
a BOOK comment at `ingest.ts:255-258` and a ledger row naming the rAF-substitution explicitly.

### P2 — Cross-depth sibling linkage silent loss

**File:** `ingest-cssom.ts:188-198` (`styleRuleTexts` collection per walk level)

A `@keyframes` nested inside `@media`/`@supports` cannot find its sibling style rule from
an ancestor level. The reconstructed animation silently uses engine defaults for duration,
easing, and delay. No diagnostic is emitted.

**Precept hit:** no-silent-drop law ("what cannot ingest faithfully is REFUSED with a NAMED
reason, never silently approximated"). The current behavior silently reconstructs with wrong
options.

**Verdict:** CORRECTNESS GAP. M should either (a) collect a FLAT sibling-rule corpus by
scanning ALL levels before the walk (pass a shared `siblingTexts: string[]` down through
the recursion), or (b) emit a diagnostic when no sibling is found AND the parent stack
contained one (harder — requires tracking the call chain). Option (a) is simple and correct.

### P3 — `fromLiveAnimations` shadow-DOM silent absent

**File:** `ingest-cssom.ts:449-458`

`fromLiveAnimations` passes `ownerDoc` (never the shadow root) to `resolveLiveKeyframes`.
A running shadow-hosted animation is found by `getAnimations()` but its `@keyframes` rule
is silently missing from the result — no diagnostic, empty `animations` Map. The S4 cure
only guards the `fromStyleSheets` path.

**Precept hit:** no-silent-drop law. The caller has no way to know the ingest failed.

**Verdict:** CORRECTNESS GAP. M should either (a) narrow `fromLiveAnimations`'s
reconstruction to also check the shadow root when the target is a shadow-hosted element
(pass the element's `shadowRoot` as a candidate source to `resolveLiveKeyframes`), or (b)
emit a `CORS_SKIP`-class diagnostic when `resolveLiveKeyframes(ownerDoc)` returns empty for
a name found in `getAnimations()`.

---

## §3 — M-WAVE PROPOSALS

### M-W?: ingest-deepening-II (the three residual gaps)

**Band:** A (kf-internal; value.js 0.13.0 sufficient; no new sibling gate required)

**Gate:** `proof:ingest-replay` extended (born-RED arms for each gap). The existing gate is
the correct home — these are ingest-surface correctness items on the same contract.

**Three born-RED clauses:**

1. **cross-depth sibling linkage** — pass a shared `siblingTexts: string[]` accumulator
   through the `walkSheet` recursion so sibling style rules at any ancestor depth are
   available when a nested `@keyframes` is reconstructed. Born-RED arm: install
   `".foo { animation: nested-pulse 1s linear; }"` at the top level and
   `"@media screen { @keyframes nested-pulse { ... } }"` in a `@media` block; assert
   `animations.get("nested-pulse")!.animation.options.duration === 1000`.
   TODAY the reconstructed animation has the engine's default duration (not 1s from the
   sibling) — the arm FAILS.

2. **`fromLiveAnimations` shadow-DOM resolution** — when `target` is an Element inside
   a shadow root, try `target.getRootNode()` (which returns the shadow root for shadow-
   hosted elements) as a candidate source for `resolveLiveKeyframes` when the document-
   level walk returns empty for a found animation name. Born-RED arm: stub a running
   shadow-hosted animation, call `fromLiveAnimations(shadowEl)`, assert the animation is
   reconstructed. TODAY the Map is empty — the arm FAILS.

3. **scroll-domain mismatch BOOK** — add a source comment at `ingest.ts:255-258` explicitly
   naming the rAF-substitution as a BOOK (the post-takeover animation is time-driven, not
   scroll-tracking; full scroll-continuity requires wiring to a `KeyframesScrollTimeline`
   driven by the same scroll container as the native animation's `animation-timeline`). Add
   a corresponding row to the M deferred ledger. Gate arm: a source-shape anchor requiring
   the word `BOOK` (or a specific prose marker) in `ingest.ts` near the scroll percent
   branch. This is a documentation-and-honesty arm, not a behavior fix.

**Rationale:** all three are kf-internal. The cross-depth sibling linkage and shadow
`fromLiveAnimations` are correctness gaps in the no-silent-drop invariant. The scroll-domain
BOOK is an inv ε obligation (do not overclaim the S5 cure closes the scroll-continuity
problem — it closes the silent-zero-flash; the rAF-substitution is the residual). None
requires a sibling publish.

**Wave classification:** SHIP-in-M Band A, `proof:ingest-replay` extended. Born-RED on
today's tree (verified by the gap analysis above). Dep: none beyond the existing ingest
surface.

---

## §4 — DEFERRED FOLDS

| Item | Condition for FOLD | Tripwire |
|---|---|---|
| Cross-depth sibling-rule linkage | kf-internal fix (no new sibling gate) | Gate-first: born-RED arm for cross-depth sibling matching must RED on today's tree before any cure |
| `fromLiveAnimations` shadow-DOM reconstruction | kf-internal fix; value.js 0.13.0 sufficient | Gate-first: born-RED arm for `fromLiveAnimations(shadowEl)` must RED before cure |
| scroll-domain BOOK (rAF-substitution named) | A documentation motion + ledger row | No implementation required; a source comment + deferred-ledger row; no born-RED gate needed (hygiene motion) |
| DLL-27 recursive group-rule DEEPER substrate | value.js O (0.14.0) publishes its typed recursive at-rule body | Tripwire: value.js O publishes `@container`/`@layer`/`@scope` recursive parse; kf re-pins; `walkSheet` can then descend into semantically-typed group rules, not just duck-typed `cssRules` |

---

## §5 — CROSS-REPO ASKS

None from L.W3 specifically. The deeper substrate for nested group-rule walk (DLL-27 /
L.W10.S3) is already dispatched to value.js Tranche O in `KF-TO-VALUEJS-O-ASKS.md §9`
(nesting/container/layer recursive parse). The `fromLiveAnimations` shadow fix and the
cross-depth sibling linkage are kf-internal and do not require value.js changes.

---

## §6 — PERFORMANCE

No performance issues are specific to L.W3. The `walkSheet` recursive descent adds at most
O(depth × rules) traversal over the nested rule list. Real-world depth is ≤ 4; the 32-level
guard prevents adversarial blowup. No hot-path impact (the ingest runs once at page-load, not
per frame).

The `isCSSUnitValue` duck-type check in `ingest.ts:105-111` is two property reads on a
plain object — negligible.

---

## §7 — SUMMARY TABLE

| Finding | Severity | File:line | M-wave |
|---|---|---|---|
| Cross-depth sibling linkage silent loss | CORRECTNESS GAP | `ingest-cssom.ts:188-198`, `ingest-cssom.ts:238-244` | Yes — born-RED arm for cross-depth sibling matching |
| `fromLiveAnimations` shadow-DOM silent absent | CORRECTNESS GAP | `ingest-cssom.ts:449-458` | Yes — born-RED arm for `fromLiveAnimations(shadowEl)` |
| Scroll-domain mismatch unrecorded BOOK | MINOR / inv ε | `ingest.ts:250-258` | Yes — BOOK comment + ledger row (no behavior fix) |
| Depth guard not tested | MINOR | `ingest-cssom.ts:141`, `test/ingest.test.ts:364` | Low priority; mention in wave spec |
| L.W3 core cures (S1–S5) | GREEN | `ingest.ts:309-348`, `ingest-cssom.ts:177-244`, `adapter.ts:39` | N/A (SHIPPED) |
