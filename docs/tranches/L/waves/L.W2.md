# L.W2 — Compiler completeness

- **Band:** A · **Class:** SHIP-in-L · **Dep:** value.js 0.13.0 (already pinned `^0.13.0`) — no new sibling gate
- **Gate (extended + new):** `proof:compile-replay` extended with multi-color + scroll fixtures; born-RED on today's tree over the exact lossy cases the gate currently skips.

---

## Context

K.W10 established the compile moat: the parser run backward over the SAME data
model, refusing what cannot round-trip faithfully (CC-3). That moat is honest
for the single-color oklab densify and the four named refusals. Four gaps
remain in the SHIPPED 4.3.0 compile surface — three sins of omission, one sin
of silent commission:

1. **CC-6 — the compiler is scroll-BLIND.** `compile.ts` walks an
   `AnimationGroup`/`Sequence`/list and emits `@keyframes` + `animation`
   shorthand. K.W9 added the full scroll-grammar round-trip (`scroll-grammar.ts`
   — `parseScrollCSS`/`serializeScrollOptions` over value.js
   `extractTimelineOptions`/`serializeTimelineOptions`). K.W10 added the
   compiler. The two do NOT compose: `compileToCSS` has zero references to
   `animation-timeline` or `animation-range` (`grep animation-timeline
   src/animation/compile.ts` → zero hits). A scroll-driven animation compiled by
   `compileToCSS` produces a `.class { animation: … }` rule that the browser
   plays on the time clock — the CSS artifact is semantically wrong relative to
   the JS source. The compose gap is the W12 + W10 non-intersection the charter
   names as "CC-6 compile the scroll grammar" (L.md wave-map row; audit W12,
   W119, Lane 33 finding: "proof:compile-replay … the scroll-BLIND headline has
   NO compose gate").

2. **CC-3.5 — multi-color silent-densify (⚠28/⚠29, viol28, W113).** The
   single-color densify path is honest: ship under ΔE-ε, refuse over it.
   The multi-color path returns `null` at `compile-color.ts:190` — caller
   falls back to the verbatim declared block with `eligible:true`. That block
   interpolates in sRGB while kf's JS playback used oklab, producing the same
   ΔE drift the single-color path refuses — but here it **ships silently**.
   The comment at `compile-color.ts:188-189` names it "multi-color densify is
   BOOK"; the BOOK fallback is a lossy emit, not a deferral. `⚠28` records the
   measured drift (ΔE 0.82 on a two-changing-color track); `⚠29` names the
   violation: the safe deferral is a refusal, not a wrong-color ship. The
   proof corpus has no multi-color fixture: `grep multi-color
   test/fixtures/keyframes/manifest.json` → zero rows — the gate is green over
   the exact lossy case (Lane 33: "proof:color-fidelity is a SINGLE-PAIR
   midpoint ΔE — it cannot catch the multi-color densify silent-lossy ship",
   audit W114).

3. **CC-5 — static-weight pre-multiply absent (W36).** A `weighted`-blend layer
   with a constant `layer.weight` (no `weightSpring`) is refused today at
   `compile.ts:179` (`const weighted = blend === "weighted" || entry.layer.weightSpring != null`).
   A static weight (e.g. `weight: 0.3, blendMode: "weighted"`) is the simple
   pre-compositing case: the output keyframe values can be pre-multiplied by
   the scalar at compile time — the blend becomes an exact CSS `accumulate`
   layer at the pre-multiplied scale, no spring, no JS runtime required. The
   K.W10 BOOK (`K.W10.md:489`: "CC-5 pre-multiply static weights — a real
   partial-compile, premature") cited prematurity as the reason; the tripwire
   has fired — the compile surface is now in production. A static-weight group
   layer (the most common authored form: `{ blendMode: 'add', weight: 0.5 }`)
   refuses where it could compile, emitting no CSS when the intent is clear.

4. **Time-serialize divergence — `reverseMs` vs `reverseCSSTime` (⚠30/viol30, W115).**
   `compile.ts:241-242` defines a private `reverseMs`:
   ```ts
   const reverseMs = (ms: number): string =>
       ms % 1000 === 0 ? `${ms / 1000}s` : `${ms}ms`;
   ```
   `format.ts` imports and uses value.js's `reverseCSSTime` (line 5, used at
   line 160). `reverseCSSTime(1000)` emits `"1000ms"`; `reverseMs(1000)` emits
   `"1s"`. Two divergent time serializers in one pipeline: the stagger/sequence
   delay path (`compile.ts:378`) and the animation-options path (`format.ts:160`)
   can emit differing CSS representations for equal durations. This is a DRY
   violation (⚠30: "two divergent time serializers … reverseMs(1000)='1s' vs
   reverseCSSTime(1000)='1000ms'") and a potential round-trip mismatch when a
   downstream tool normalizes times.

The K substrate fully enables each cure: `sampleColorRamp` and `deltaEOK` are
already consumed (value.js 0.13.0, `^0.13.0` pinned); `serializeTimelineOptions`
is already exported from `scroll-grammar.ts:121-122`; `reverseCSSTime` is
already imported in `format.ts:5` and re-reachable from the same value.js
import. L.W2 is a wiring wave: connect the compose gap, elevate the multi-color
honest-refusal, enable the static-weight partial-compile, and unify the time
serializer.

### Audit evidence

| Ref | Source location | Gap |
|-----|-----------------|-----|
| W12, W119, Lane-33 | `compile.ts` — zero `animation-timeline` references | scroll-BLIND: no timeline/range emit in compiled artifact |
| ⚠28, ⚠29, viol28, W113, W114 | `compile-color.ts:188-190` | multi-color `return null` → verbatim sRGB with `eligible:true`, ΔE 0.82 unguarded |
| W36 | `compile.ts:179` | static-weight `weighted` blend refused where pre-multiply is exact |
| ⚠30, viol30, W115 | `compile.ts:241-242` vs `format.ts:5,160` | `reverseMs` diverges from `reverseCSSTime` — two serializers, one pipeline |
| Lane-33 gate-audit | `scripts/proof-compile-replay.mjs` | no multi-color fixture; no scroll-compile clause; gate is source-shape only |

L.W2 rides L.W1's replay-equality FLOOR (the scroll selectors in L.W1-S4 show
the scroll-grammar INGEST path; L.W2 closes the EMIT half). The gates compose
but do not block: L.W2's born-RED gate can land before L.W1 ships — the
multi-color fixture and scroll fixture each red independently.

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they extend
`proof:compile-replay` to GREEN over the complete compile surface.

### S1 — CC-6: emit `animation-timeline` + `animation-range` from `compileToCSS` (W12, W119)

**Breach.** `compileToCSS` (`compile.ts:397-447`) emits a `.class { animation:
… }` rule per child via `animationShorthand` (`format.ts:256-268`). When the
source animation carried scroll grammar (parsed by `fromString` via
`parseScrollCSS` in the ingest path), the compiled `.class` rule contains NO
`animation-timeline` or `animation-range` declaration. The browser plays the
artifact on the time clock — wrong behavior, no refusal, no diagnostic. The
`scroll-grammar.ts` serialize surface (`serializeScrollOptions`, line 116-123)
exists and is correct; it is simply never called from the compiler.

**Cure.** Three sites:

1. `CSSKeyframesAnimation` must expose its parsed scroll options. The
   `fromString` path already populates `resolved.options` (engine.ts F.W8 block,
   lines ~1251-1266); the `CSSTimelineOptions` from `parseScrollCSS` is not
   currently threaded into an accessible field on the animation. Add a
   `scrollOptions?: CSSTimelineOptions` field (analogous to `propertyRegistry`
   at `engine.ts:1225`), populated from `extractTimelineOptions(resolved.stylesheet)`.
   This is a read-only metadata field — no hot-path impact.

2. `compile.ts:compileChild` — after the `animationShorthand` emit, if
   `animation.scrollOptions` is set, call `serializeScrollOptions(animation.scrollOptions)`
   (re-exported from `scroll-grammar.ts`) and append the returned longhand
   declarations (`animation-timeline: …; animation-range: …;`) to the `.class`
   rule. The emit is VERBATIM (the value.js inverse serializer over the parsed
   typed options — the parser run backward, same moat law as the shorthand).

3. `animationShorthand` (`format.ts:256-268`) already correctly omits
   `animation-timeline` from the shorthand (it is NOT a shorthand sub-property
   in CSS Animations L2, same as `animation-composition`). The emit as a
   separate longhand is the faithful path — parallel to how `animationComposition`
   is handled at `compile.ts:370-371`.

**Constraint.** `CSSTimelineOptions` is HEAVY (carries a static value.js edge
via `scroll-grammar.ts`). The `scrollOptions` field may be typed with `import
type CSSTimelineOptions` — erased at runtime, no LIGHT surface impact.

**Gate bite.** Fixture: a scroll-driven CSS string with `animation-timeline:
view();` + `animation-range: entry 0% cover 40%;` compiled through
`compileToCSS`. Today: emitted `.class` block has no `animation-timeline` key →
compiled CSS is scroll-blind. After cure: emitted block contains verbatim
`animation-timeline: view();` and `animation-range: entry 0% cover 40%;`.

---

### S2 — CC-3.5: multi-color refuse-or-densify (`compile-color.ts:188-190`, ⚠28/⚠29, viol28, W113)

**Breach.** `densifyColorBlock` (`compile-color.ts:163-258`) collects all
changing color keys. At `line 190`: `if (colorKeys.length > 1) return null;`.
The `null` return signals "no densify applies"; the caller (`compile.ts:323-340`)
falls through to `keyframesBlock(animation, name)` — the verbatim declared
block — and emits it with `eligible:true`. That verbatim block interpolates in
browser-sRGB, while kf's JS playback used oklab. The drift (ΔE 0.82, measured
in the audit) is the SAME class of perceptual mismatch the single-color path
refuses at ΔE-ε. The asymmetry: one-color drift → hard refuse; same drift on
two colors → silent ship. This violates `inv-L-totality` (the honest-refusal
clause extended to the full parsed surface).

**Cure.** Two acceptable resolutions, in preference order:

**Option A (preferred — per-key independent densify):** generalize
`densifyColorBlock` to handle `colorKeys.length > 1` by densifying each
changing color key INDEPENDENTLY and merging the per-key stop sets into a
unified `@keyframes` block. Each key's color track gets its own `sampleColorRamp`
ramp; the `worstDelta` measurement covers all keys; the overall result ships
only if every key's densify holds under ΔE-ε, else refuses. This is the
idiomatic extension of the existing single-key logic — no architectural change,
just a loop over `colorKeys` instead of `colorKeys[0]`.

**Option B (honest deferral):** change `return null` at `compile-color.ts:190`
to `return { refused: true, delta: Infinity }` with a distinct `CompileRefusalReason`
(`"multi-color-perceptual-oklab"` or fold into the existing `"perceptual-oklab"`
reason). The caller records the refusal; the JS playback is the faithful path.
This is strictly better than today's silent lossy ship — a named refusal is
honest, a wrong-color artifact is not.

Option A is preferred: the per-key generalization is the correct extension of
the existing densify, costs no new refusal reason, and closes the gap without
sacrificing round-trip fidelity. Option B is the fallback if per-key stop-set
merging proves infeasible (timing conflicts between keys with different change
intervals).

**Constraint.** The ΔE proof must cover the WORST-CASE key, not the average.
For Option A, `worstDelta` is `max(worstDelta_key1, worstDelta_key2, …)`.

**Gate bite (born-RED on today's tree).** Fixture: a `@keyframes` with two
simultaneously changing color properties (e.g. `color` + `background-color`),
compiled through `compileToCSS`. Today: `eligible:true`, no refusal recorded,
emitted block interpolates in sRGB → silent drift. After Option-A cure: emitted
block densifies both tracks; `eligible:true` only if ΔE holds. After Option-B
cure: `eligible:false`, refusal recorded with reason. Either post-cure result is
honest. The gate asserts: the multi-color compile path does NOT emit
`eligible:true` when the ΔE drift exceeds the threshold — the same assertion the
single-color refusal test already locks for one-color tracks.

---

### S3 — CC-5: static-weight pre-multiply (`compile.ts:179`, W36)

**Breach.** `walkGroup` at `compile.ts:179` marks a layer `weighted` if
`blend === "weighted" || entry.layer.weightSpring != null`. Both cases refuse
at `compile.ts:279-289`. A static-weight layer (`blendMode: "weighted"`,
`weightSpring: undefined`, constant `weight: w`) is refused along with the
spring-driven crossfade — yet the static case IS compile-able: the author chose
a fixed scalar blend, the output keyframe values can be pre-multiplied by `w`
at compile time, and the result emitted as an `accumulate` layer (CSS
`animation-composition: accumulate`) at the pre-multiplied scale. No spring,
no runtime, no JS — exact CSS.

**Cure.** In `walkGroup` (`compile.ts:174-191`), partition the `weighted` flag:

```ts
const springWeighted = blend === "weighted" && entry.layer.weightSpring != null;
const staticWeighted = blend === "weighted" && entry.layer.weightSpring == null;
const composition: CompositeOperator =
    blend === "add" ? "add" : staticWeighted ? "accumulate" : "replace";
children.push({ ..., weighted: springWeighted, staticWeight: staticWeighted ? entry.layer.weight : undefined });
```

In `compileChild`, when `child.staticWeight` is defined, pre-multiply all
numeric leaf values in the declared `parsedVars` by the weight scalar before
emitting the `@keyframes` block, and set `composition` to `"accumulate"`.
Pre-multiplication operates on the DECLARED template values (`animation.parsedVars[i]`)
— the same values `keyframesBlock` projects. Only numeric units are scaled
(`unit !== "color"`, `unit !== "string"`, etc.); a non-numeric leaf in a
static-weight animation remains a refusal.

**Constraint.** The pre-multiply MUST NOT mutate `animation.parsedVars` in
place — it clones the relevant leaf values into a new map. The compiler is
read-only over the animation object.

**Gate bite.** Fixture: an `AnimationGroup` with one `add`-blended child
(`weight: 1`) and one `weighted`-blended child (`weight: 0.5`,
`weightSpring: undefined`), compiled through `compileToCSS`. Today: second
child refuses (`weighted-blend`), `eligible:false`. After cure: second child
compiles with pre-multiplied values and `animation-composition: accumulate`,
`eligible:true`. The gate asserts the result `eligible` field and the presence
of `animation-composition: accumulate` in the emitted CSS.

---

### S4 — Unify time serialization: delete `reverseMs`, use `reverseCSSTime` (⚠30, viol30, W115)

**Breach.** `compile.ts:241-242` defines a private `reverseMs`:

```ts
const reverseMs = (ms: number): string =>
    ms % 1000 === 0 ? `${ms / 1000}s` : `${ms}ms`;
```

This diverges from `reverseCSSTime` (value.js, already imported in
`format.ts:5`, used at `format.ts:160`). `reverseCSSTime(1000)` emits
`"1000ms"`; `reverseMs(1000)` emits `"1s"`. The delay emit at
`compile.ts:378` uses `reverseMs`; the duration emit in the same artifact's
`animationShorthand` path (`format.ts:259-262`) uses `reverseCSSTime` via
`reverseAnimationShorthand`. Two CSS time representations in one artifact for
equal durations — a DRY violation (⚠30) and a potential normalization mismatch.

**Cure.** One-line change in `compile.ts`:

1. Add `reverseCSSTime` to the `@mkbabb/value.js` import at `compile.ts:53`
   (already imports `formatCSS`).
2. Delete the `reverseMs` definition at `compile.ts:241-242`.
3. Replace the single call site at `compile.ts:378` (`reverseMs(child.delay)`)
   with `reverseCSSTime(child.delay)`.

`reverseCSSTime` is already published at value.js 0.13.0 (imported in
`format.ts:5`); no new dependency gate.

**Constraint.** This is a cosmetic serialization change — the emitted time
token is canonical CSS either way. The only observable difference is
`"1s"` vs `"1000ms"` for even-second values. The gate asserts BOTH the delete
(no `reverseMs` definition in `compile.ts`) and the correct call site
(`reverseCSSTime` used for delay emit).

**Gate bite.** Source-shape clause: `grep -n 'const reverseMs' compile.ts` →
must return zero matches after the cure. Behavior clause: a compiled child with
`delay: 2000` must emit `animation-delay: 2000ms` (matching `reverseCSSTime`'s
canonical form), not `2s`.

---

## The born-RED gate

**Gate name:** `proof:compile-replay` — existing gate EXTENDED with two new
fixture arms and two new source-shape clauses.

### What REDs on today's tree (before any cure)

The existing `proof:compile-replay` is GREEN today because its corpus has no
multi-color fixture and no scroll-compile clause. The L.W2 extension adds:

**New clause A — multi-color-honest (bites S2, ⚠28/⚠29):**

The clause asserts the POST-CURE discriminant ONLY — a symbol that does NOT
exist on the 4.3.0 tree. The old draft regex
(`/colorKeys\.length\s*>\s*1[\s\S]{0,120}(refused|refuse|refusal|densify)/`) was
VACUOUS: it scanned forward from `colorKeys.length > 1` for the word `densify`,
which already appears in the breach COMMENT at `compile-color.ts:188-190` ("…
multi-color densify is BOOK") — so a naive author could green it against the
UNCURED tree (and `perceptual-oklab`, the single-color refusal reason, already
exists at `compile.ts:77`/`compile.ts:332` — it is NOT a multi-color
discriminant either). The cure (S2) introduces one of two NEW symbols, neither
present today:
- Option A (per-key densify): a loop over `colorKeys` (e.g. `for (const key of
  colorKeys)`) replacing the single `colorKeys[0]` densify — the
  `if (colorKeys.length > 1) return null;` early-out is DELETED.
- Option B (honest deferral): the DISTINCT refusal reason
  `"multi-color-perceptual-oklab"` (a new `CompileRefusalReason` member),
  ABSENT today (`grep "multi-color-perceptual-oklab" src/animation/` → zero).

```
requireAll("multi-color-honest", COMPILE_COLOR, [
  { name: "multi-color path cures (per-key densify loop OR distinct multi-color refusal reason)",
    re: /multi-color-perceptual-oklab|for\s*\(\s*const\s+\w+\s+of\s+colorKeys\b/ }
]);
// AND the silent early-out must be GONE:
const ccsrc = read(COMPILE_COLOR);
if (/colorKeys\.length\s*>\s*1\s*\)\s*return\s+null\s*;/.test(ccsrc))
  fail("multi-color-honest", "compile-color.ts still SILENTLY returns null for colorKeys.length > 1 — densify per-key or refuse with multi-color-perceptual-oklab");
```
Today: `compile-color.ts:190` contains `if (colorKeys.length > 1) return null;`
(the silent early-out), and NEITHER `multi-color-perceptual-oklab` NOR a
`for (… of colorKeys)` loop exists → the `requireAll` anchor fails to match AND
the silent-null `fail()` fires → clause RED on the 4.3.0 tree, GREEN only when
S2's per-key densify or distinct-refusal cure lands.

**New fixture arm B — multi-color compile fixture:**
A `test/fixtures/compile/multi-color-scroll.css` fixture with two changing
color properties (`color` + `background-color`). The vitest arm
(`test/compile-roundtrip.test.ts`) asserts: `compileToCSS` over this fixture
does NOT produce `eligible:true` when the worst-case ΔE exceeds the threshold.
Today: `eligible:true` is returned (the silent-null path) → assertion FAILS.

**New clause C — scroll-compile-emit (bites S1, W119):**
```
requireAll("scroll-compile-emit", COMPILE, [
  { name: "animation-timeline emit in compileChild",
    re: /animation-timeline|serializeScrollOptions|scrollOptions/ }
]);
```
Today: zero matches in `compile.ts` → clause FAILS.

**New fixture arm D — scroll-compile fixture:**
A scroll-driven CSS with `animation-timeline: view()` compiled through
`compileToCSS`. The vitest arm asserts the emitted `.class` block contains
`animation-timeline:`. Today: no such assertion exists → arm RED as a new test.

**New clause E — no-reverseMs (bites S4, ⚠30):**
```
const src = read(COMPILE);
if (/\bconst\s+reverseMs\b/.test(src)) fail("no-reverseMs",
  "compile.ts still defines its own reverseMs — delete it, use reverseCSSTime");
```
Today: `compile.ts:241` contains `const reverseMs` → clause FAILS.

**Static-weight clause (bites S3, W36):**

The clause asserts the POST-CURE discriminant ONLY. The old draft regex
(`/weightSpring\s*!=\s*null|springWeighted|staticWeight/`) was VACUOUS: its
first alternative `weightSpring != null` ALREADY matches today's
`compile.ts:179` (`const weighted = blend === "weighted" || entry.layer.weightSpring != null;`)
— so the alternation greened against the UNCURED tree. The cure (S3) introduces
the `springWeighted` / `staticWeighted` partition variables (and the
`staticWeight` field on `CompileChild`), NONE of which exist today
(`grep -E "springWeighted|staticWeighted|staticWeight" src/animation/compile.ts`
→ zero). Require ONLY those new names, NOT the pre-existing `weightSpring != null`:

```
requireAll("static-weight-compile", COMPILE, [
  { name: "static/spring weight partition (the cure-only variable names)",
    re: /springWeighted|staticWeighted|staticWeight/ }
]);
```
Today: `compile.ts:179` tests `entry.layer.weightSpring != null` but does NOT
introduce the `springWeighted`/`staticWeighted`/`staticWeight` partition — none
of the cure-only names exist → clause RED on the 4.3.0 tree. GREEN only when
S3's `walkGroup` partition lands.

All five new clauses/arms RED on today's 4.3.0 tree. GREEN iff every S-clause
cure is applied.

---

## Deps

No new sibling publish gate. All four cures ride the currently-pinned stack:

| Resource | Available since | Consume site |
|----------|----------------|--------------|
| `sampleColorRamp` / `deltaEOK` | value.js 0.13.0 (pinned `^0.13.0`) | `compile-color.ts:25-34` — already imported |
| `serializeTimelineOptions` (via `serializeScrollOptions`) | value.js 0.13.0 | `scroll-grammar.ts:37,121-122` — already published; `compile.ts` adds one call |
| `reverseCSSTime` | value.js 0.13.0 | `format.ts:5` — already imported; `compile.ts` adds to import |

L.W2 proceeds immediately after L.W0/L.W1 in Band A. It COMPOSES L.W1's
scroll-selector ingest (L.W1 S4 handles named selectors on the INGEST path;
L.W2 S1 closes the EMIT half). The two are file-disjoint at the cure sites:
L.W1 touches `frame-compiler.ts` and `adapter.ts`; L.W2 touches `compile.ts`
and `compile-color.ts`. They can land in any order.

---

## Bite — regression each clause gate catches

| S-clause | Gate clause | Regression caught |
|----------|-------------|-------------------|
| S1 scroll emit | `scroll-compile-emit` + fixture arm D | Removing the `serializeScrollOptions` call silently produces a scroll-blind compiled artifact; a consumer pastes it into a stylesheet and the browser ignores scroll phasing |
| S2 multi-color | `multi-color-honest` + fixture arm B | Adding a second changing-color key in a `@keyframes` silently ships a perceptually-wrong sRGB block — the same drift the ΔE proof catches for one color becomes invisible for two |
| S3 static-weight | `static-weight-compile` | Rolling back the static-weight partition re-refuses all constant-weight blends, silently producing no CSS for an authored `weight: 0.5` group layer |
| S4 time serialize | `no-reverseMs` | Re-adding `reverseMs` reintroduces the divergent time serializer; a stagger cohort with 2 s delays emits `2s` while the animation shorthand emits `2000ms` in the same artifact |
