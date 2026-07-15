# Lane 14 — lib/ ingest · scroll · waapi · svg · presets

**Tranche U development audit** — read-only deep read of the five HEAVY zones that
sit ABOVE the engine/compile core: the CSSOM ingest + temporal takeover, the scroll
grammar/driver/dispatch, the WAAPI eligibility/densify/emission/delegation surface,
the SVG geometry factories, and the preset catalog.

Scope read in full (line counts): `ingest/{cssom 466, adopt 349, index 20}` ·
`scroll/{scene 319, trigger 317, dispatch 140, grammar 137, range 116, index 49}` ·
`waapi/{eligibility 269, densify 287, delegation 151, waapi-options 116, emission 66,
index 25}` · `svg/{morph-svg 348, motion-path 177, draw-svg 194, morph-geometry 170,
handle 53, index 14}` · `presets/{classic-data 458, classic 304, taxonomy 105,
spring 93, index 61}`. Total ≈ 4.8k lines.

**Headline verdict.** The zones are individually well-decomposed (the R.W1 zone
partition + the T.F22 cohesion carves landed cleanly — every file has a genuine
single concern). But three architectural transpositions are owed under U's edicts:
(1) **presets is 34× hand-written boilerplate across FOUR parallel lists** — the
charter's "code or data" question resolves decisively to DATA; (2) **ingest's
`adoptRunning` hand-rolls a `seekAndPlay` engine primitive that does not exist**,
poking four engine fields across the zone boundary; (3) **WAAPI eligibility
re-enumerates a 40-entry viewport/container unit vocabulary that value.js already
owns** (`RELATIVE_LENGTH_UNITS`) — a consume-edge duplication that silently drifts
as CSS ships new units. Plus a cluster of NO-LEGACY documentation debt and one
double-computation in the scroll dispatch.

---

## Findings

### F1 — MAJOR — presets: 34 hand-written factories over a parallel string list is DATA masquerading as CODE
**Area:** `presets/`
**Evidence:** `presets/classic.ts:49-305` (34 near-identical factory closures);
`presets/classic-data.ts:12-458` (34 raw CSS-string consts); `presets/index.ts:13-48`
(34-name barrel re-export); `presets/taxonomy.ts:8-43` (28 names re-imported).

Every classic preset is the SAME shape repeated 34 times:
```ts
export const fadeIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({ duration: 700, timingFunction: "ease-in-out", ...(options ?? {}) })
        .fromString(fadeInKeyframes);
```
The only per-preset variation is a small tuple: `{ css, duration, timingFunction,
iterationCount?, fillMode?, direction? }`. That tuple is a DATA row. Instead it is
spread across **four lists that must be kept in lockstep by hand**: the string
const (`classic-data.ts`), the factory closure (`classic.ts`), the barrel name
(`index.ts`), and the taxonomy leaf (`taxonomy.ts`). Adding one preset is a 4-file
edit; a name typo in any one silently drops it from a surface. `spring.ts:20-93`
repeats the identical closure shape a fifth time for its four springs.

This is the exact "long dir → encapsulate as a common module" + "performance/
elegance transposition" U calls for, and it is a textbook data-vs-code case.

**Proposal (gestalt):** Collapse to ONE `PRESET_SPECS` table — an array/record of
`{ name, css, duration, timingFunction, iterationCount?, fillMode?, direction?,
group: "enter"|"exit"|"attention"|"loop" }` rows. A single `definePreset(spec)`
factory-generator produces the `(options?) => CSSKeyframesAnimation` closure; the
barrel and the taxonomy both DERIVE from the table (the taxonomy becomes a
`groupBy(specs, s => s.group)`, not a hand-curated second copy). The catalog then
has ONE source of truth; a new preset is one row; the barrel/taxonomy cannot drift.
`timingFunction` values that are `CSSCubicBezier(...)`/`steppedEase(...)` calls stay
inline in the row (they are data — a resolved `Easing`). This also lets a
`proof:presets-*` gate assert coverage/uniqueness over the table declaratively.

---

### F2 — MAJOR — `adoptRunning` hand-assembles a non-existent `seekAndPlay` engine verb, reaching into four engine fields across the zone boundary
**Area:** `ingest/`
**Evidence:** `ingest/adopt.ts:310-349` (`seedAtTime`); the comment at
`adopt.ts:280-281` literally names the primitive — *"`seekAndPlay` starts the loop
with `startTime` shifted…"* — but `grep seekAndPlay src/` returns ONLY that comment.
No such method exists.

`seedAtTime` open-codes a delicate five-step continuity-seed protocol by poking
engine state from the ingest zone: `setUseWAAPI(false)` → `setDelay(0)` →
`onStart()` → `started = true` → `startTime = now - t` → `t = t` → `play()`
(adopt.ts:319-348). Each field (`startTime`, `started`, `onStart`, `t`) is a public
getter/setter on `KeyframesAnimation` (animation.ts:93-102, 405), so it compiles —
but the ORDERING is load-bearing and undocumented at the engine, and the comment
block at adopt.ts:321-336 has to explain WHY `setDelay(0)` must precede `onStart()`
(else the paused-sleep early-out freezes the engine forever). That knowledge belongs
INSIDE the engine, not reconstructed in the ingest zone from the outside.

**Proposal (gestalt):** Promote the continuity-seed to a first-class engine
transport verb — `KeyframesAnimation.seekAndPlay(t)` — that owns the
delay-strip/onStart/startTime-baseline/kick sequence as ONE atomic method (the name
the comment already assumes). `adopt.ts` then calls `animation.seekAndPlay(currentTime)`
and the fragile ordering + the "why" comment live once, at the engine, tested by the
engine's own gate. This closes the leaky abstraction and makes the takeover-seed
reusable (a scrubber, a scroll-adopt, a test harness all want "start playing from t").

---

### F3 — MAJOR (consume-edge) — WAAPI eligibility re-enumerates value.js's viewport/container unit taxonomy in a 40-line literal
**Area:** `waapi/`
**Evidence:** `waapi/eligibility.ts:27-62` — `WAAPI_INELIGIBLE_UNITS` hardcodes
`vh vw vmin vmax vi vb svh…svb lvh…lvb dvh…dvb cqw cqh cqi cqb cqmin cqmax` by hand.
value.js already exports the exact vocabulary: `RELATIVE_LENGTH_UNITS` =
`["em","ex","ch",…,"vw","vh","vmin","vmax","vb","vi","svw"…"dvmax","cqw"…"cqmax"]`
(`node_modules/@mkbabb/value.js/dist/units/constants.d.ts:2`), and the file already
imports `COMPUTED_UNITS` from value.js on eligibility.ts:1.

kf's set is a SUBSET (the viewport + container units, excluding the font-relative
`em/rem/ch/lh` that don't track layout-box resize) plus `%` plus `COMPUTED_UNITS`.
But the sv/lv/dv/cq families are precisely the part of CSS that GROWS — every new
viewport-unit spec addition must be manually appended here or the WAAPI guard
silently under-rejects (a wrong-pixel compositor animation, the one failure mode the
whole guard exists to prevent). Maintaining a parallel copy of a value.js-owned unit
model is exactly the consume-edge drift U's constellation reading forbids.

**Proposal (gestalt):** Charter a value.js consume-edge coordination row: value.js
should export a semantic grouping for the layout-tracking units — either
`VIEWPORT_LENGTH_UNITS` + `CONTAINER_LENGTH_UNITS` tuples, or a single
`isLayoutTrackingUnit(unit)` predicate (value.js owns the CSS unit model; it is the
correct home). kf then derives `WAAPI_INELIGIBLE_UNITS = new Set([...COMPUTED_UNITS,
"%", ...VIEWPORT_LENGTH_UNITS, ...CONTAINER_LENGTH_UNITS])` and the literal vanishes.
Until value.js publishes that surface, the literal is a BOOK'd tripwire, not a
manufactured copy. (value.js's tranche is active — this is the letter to send.)

---

### F4 — MAJOR — scroll dispatch double-computes eligibility AND double-creates the native ScrollTimeline on the fast path
**Area:** `scroll/`
**Evidence:** `scroll/dispatch.ts:100` calls `isWAAPIEligible(animation)`, then
`dispatch.ts:113` calls `attachNativeScrollTimeline(animation, nativeSpec)` which
AT `delegation.ts:122` calls `isWAAPIEligible(animation)` a SECOND time.
Independently, `dispatch.ts:107` calls `createNativeTimeline(nativeSpec)` purely to
feature-detect (discarding the result), then `delegation.ts:127` calls
`createNativeTimeline(spec)` AGAIN to actually attach.

So the native fast path pays for the eligibility scan twice and constructs a native
`ScrollTimeline`/`ViewTimeline` object twice (the first is thrown away). The
eligibility scan is O(frames × interpVars × ivs) — the exact per-frame nested loop
at eligibility.ts:228-266 — not free, and performance is U's grand edict.

**Proposal (gestalt):** Make `attachNativeScrollTimeline` accept the already-computed
eligibility + the already-constructed timeline as inputs (or invert: have the
dispatch be the SOLE eligibility/feature-detect site and hand `attach` a
pre-validated `{ eligible, timeline }`). One eligibility computation, one native
timeline construction, per dispatch. The "conservative-correct with a queryable
reason" contract is preserved — only the redundant recomputation is removed.

---

### F5 — MINOR (NO-LEGACY) — pervasive stale-filename self-references in file headers post-restructure
**Area:** ingest · scroll · waapi (documentation)
**Evidence:** `ingest/cssom.ts:3` header says *"ingest-cssom.ts"*; `ingest/adopt.ts:7`
says *"ingest.ts"* (the file is `adopt.ts`, and it still narrates itself as "the
ingest's public face" from before the split); `scroll/grammar.ts:11` says
*"scroll-grammar.ts"*; `scroll/scene.ts:15` says *"scroll-scene.ts"*;
`waapi/densify.ts:19` says *"waapi-densify.ts"*. Also `waapi/index.ts:8` documents a
member named *"`options.ts`"* — the file is `waapi-options.ts`.

Every one names a pre-R.W1 filename that no longer exists. Under U's explicit "NO
legacy code" + grand-restructure edict, a header that lies about its own path is
legacy documentation that misdirects every future reader and every grep.

**Proposal (gestalt):** A standing `proof:header-path` hygiene gate (befitting U's
"enforce by standing gate, not one-time moves" memory): assert each file's leading
`/** <path>` token matches its actual zone-relative path. Cure the current drift in
one pass; the gate keeps it true. This is the library-side of the colocation edict's
"enforce befittingly for the language."

---

### F6 — MINOR (NO-LEGACY) — preset data is inconsistent: 4 of 34 constants carry full `@keyframes` wrappers with meaningless historical names
**Area:** `presets/`
**Evidence:** `presets/classic-data.ts` — 30 constants are BARE keyframe bodies
(`from {…} to {…}` / `0% {…} 100% {…}`), but `warpLeftKeyframes` (:172) and
`warpRightKeyframes` (:196) are wrapped `@keyframes keyframeDelete { … }`, and
`jumpUpKeyframes` (:427) / `jumpDownKeyframes` (:443) are wrapped
`@keyframes keyframeShift { … }`. The rule names `keyframeDelete` / `keyframeShift`
are dead historical artifacts (the presets are `warpLeft`/`jumpUp`) that survive only
because `fromString` tolerates both a bare body and a full rule.

**Proposal (gestalt):** Normalize the data form — all preset CSS is bare keyframe
bodies (the majority idiom), no `@keyframes name {}` wrapper, no legacy rule names.
Folds naturally into F1's `PRESET_SPECS` table (each row's `css` is a bare body),
where the inconsistency cannot recur. A `proof:presets` gate can assert the form.

---

### F7 — MINOR — `cssom.ts` builds a `RegExp` from an unescaped `@keyframes` name
**Area:** `ingest/`
**Evidence:** `ingest/cssom.ts:214-216` —
`new RegExp(\`\\banimation(?:-name)?\\s*:[^;}]*\\b${name}\\b\`)` interpolates the raw
CSSOM `CSSKeyframesRule.name` directly. CSS custom-idents may contain escape
sequences and characters that are RegExp metacharacters; an animation name like
`a.b` or one carrying an escaped `(` would either mis-match the sibling style rule
(dropping its `animation-*` options) or throw an uncaught `SyntaxError` mid-walk —
the very silent-drop / uncaught-throw class the ingest's honesty surface forbids
everywhere else (the per-rule try/catch at cssom.ts:263-293 does NOT wrap this
regex construction, which happens in `walkSheet` above it).

**Proposal (gestalt):** Escape the interpolated name (a small `escapeRegExp` leaf in
`internal/`, or better — reuse value.js's own animation-shorthand parser to test the
sibling rule's `animation-name` STRUCTURALLY rather than by regex, which is the
zone's stated idiom: *"the SAME pipeline `fromString` uses, never a bespoke options
parser"* (cssom.ts:184-187). The regex IS a bespoke parser; routing the sibling-link
through value.js's `parseAnimationShorthand`/`extractAnimationOptions` name field
removes both the escape bug and the last hand-rolled parser in the walk.

---

### F8 — MINOR — the scroll DRIVE surface is fragmented: parse is unified, but driving parsed CSS needs three manually-wired entry points
**Area:** `scroll/`
**Evidence:** `parseScrollCSS` (grammar.ts:97) returns ONE `CSSTimelineOptions`
carrying `{ timeline, range, timelineScope, trigger }`. But driving it requires the
consumer to hand-fan it across THREE unrelated calls: `createScrollScene(opts)`
(scene.ts:306 — reads only `.range`, silently drops `.timeline`/`.trigger`, cast
`spec as ScrollSceneOptions` at :318), `createTriggerScene(opts)` (trigger.ts:306 —
reads only `.trigger`), and `dispatchScrollBackend({...})` (dispatch.ts:73 — the
native-vs-JS decision, a separate hand-assembled request). There is no single "drive
this parsed scroll CSS" composition. Relatedly, `ScrollBackend` (`"native"|"js"`) is
declared/exported from `scene.ts:69` but `scene.ts` never uses it — the concept lives
in `dispatch.ts` (which declares its own `ScrollDispatch`), so the type is
mis-homed.

**Proposal (gestalt):** Introduce ONE composition entry — `driveScrollCSS(opts,
target?, driverOptions?)` — that fans a parsed `CSSTimelineOptions` into the
scene + trigger + backend-dispatch internally and returns a unified handle
(`{ scene, trigger?, backend, reason? }`). The parse side is already one call; the
drive side should mirror it. Move `ScrollBackend` to `dispatch.ts` beside
`ScrollDispatch` (cohesion follows use). This makes the scroll zone's public shape
"parse → drive" symmetric, the round-trip's stated design.

---

## Notes (audited, NOT findings — recorded so U need not re-audit)

- **`waapi/densify.ts` is genuinely well-factored.** The best-first curvature
  refinement (:208-287), the quarter-point flatness predicate that defeats the
  symmetric-inflection blind spot (:146-171), the full-range normalizer that avoids
  the settled-tail-noise trap, and the shared-budget cap (not 2^D) are correct and
  cohesive. It reaches the animation ONLY through `interpFrames` — no eligibility/
  emission coupling. It IS build-time-heavy (RANGE_SCAN_PROBES=64 per segment +
  quarter/mid probes), but this is a BUILD emit, not a hot path, and the module
  documents that honestly. No transposition owed. Leave it.
- **`svg/handle.ts` is exemplary.** The `SVGAnimationHandle` base closes the
  `.finished` asymmetry by construction (S.B4); the three factories + the
  `morph-geometry.ts` carve are clean. The morph renderer's fail-explicit missing-key
  throw (morph-geometry.ts:153-158) is correct (honest-or-refuse). No finding.
- **`waapi-options.ts` / `emission.ts` densify→single-`linear()` collapse** is
  correct and well-explained (the double-ease avoidance at waapi-options.ts:88-93).
  No finding.
- **`scroll/range.ts` + `trigger.ts`** correctly share the `resolveRange` mapping
  and the `internal/scroll-phases` table (dissolving the BOOK'd duplication with
  `frame-compiler.ts`). Clean.
- **value.js consume edges are minimal and correct:** grammar.ts pass-throughs,
  morph's single `PathGeometry` edge (gated by `proof:morphsvg-consume`), eligibility's
  `COMPUTED_UNITS`. The only duplication is F3.
- **parse-that:** none of these five zones import parse-that (verified — the direct
  dep was removed at Q). No parse-that consume edge in scope.

---

## What U must charter

1. **CHARTER a presets DATA transposition** — collapse the 34 classic + 4 spring
   factories, the parallel `classic-data` string list, the `index` barrel, and the
   `taxonomy` index into ONE `PRESET_SPECS` table + a `definePreset` generator; derive
   the barrel and taxonomy from the table (F1, F6).
2. **CHARTER a `KeyframesAnimation.seekAndPlay(t)` engine transport verb** and refit
   `ingest/adopt.ts` to call it, deleting the hand-rolled `seedAtTime` field-poking
   and hoisting the ordering-contract knowledge into the engine (F2).
3. **CHARTER a value.js consume-edge letter** requesting a layout-tracking-unit
   grouping (`VIEWPORT_LENGTH_UNITS`/`CONTAINER_LENGTH_UNITS` or
   `isLayoutTrackingUnit`); refit `waapi/eligibility.ts` to derive its ineligible set
   from value.js instead of the 40-line literal (F3).
4. **CHARTER the scroll-dispatch de-duplication** — one eligibility computation and
   one native-timeline construction per dispatch; thread the pre-validated result
   into `attachNativeScrollTimeline` (F4).
5. **CHARTER a `proof:header-path` standing hygiene gate** and cure the stale
   post-restructure filename headers across ingest/scroll/waapi in one pass (F5).
6. **CHARTER escaping/structural sibling-linkage in the CSSOM walk** — remove the
   unescaped-`name` RegExp, routing the sibling `animation-*` link through value.js's
   shorthand parser (F7).
7. **CHARTER a unified `driveScrollCSS` composition entry** mirroring the unified
   `parseScrollCSS`, and re-home `ScrollBackend` into `dispatch.ts` (F8).
