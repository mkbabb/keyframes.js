# O.W4 — Multi-color refusal + ingest (the M.W6/W7 cures)

**Band:** B — Engine correctness
**Phase:** NOW (kf-internal; zero sibling dependency; executable on authorization)
**Sequence:** O.W3 (named-selector NaN cure) → **O.W4** → O.W5 (DemoControlPoint)
**Owning chronic/DM:** ⚠M2 (`compile-color.ts:191` unconditional `colorToOklabCSS` — oklch space
emits `oklab()` CSS) · ⚠M3 (densify drops non-color properties from mixed animations) ·
M.W7 ingest gaps (cross-depth sibling linkage silent loss; `fromLiveAnimations` shadow-DOM silent absent)

---

## Context

M.W6 (multi-color densify fidelity) and M.W7 (ingest deepening II) were developed but never
implemented. The 32-lane re-audit (C12-kf-M-waves, C15-kf-engine) confirmed all four breaches are
live on master. O.W4 closes both M waves in one NOW-executable Band-B wave: they share no file
surface (M.W6 touches `compile-color.ts`/compile; M.W7 touches `ingest-cssom.ts`/`ingest.ts`),
are both value.js-1.0.2-sufficient, and have no cross-wave collision with O.W3
(`frame-compiler.ts`). Folding them is the gestalt move — one wave, two born-RED gates, four
correctness cures.

### Sub-scope A: Multi-color densify fidelity (M.W6, ⚠M2 + ⚠M3)

**Breach 1 — oklch space emits `oklab()` CSS (⚠M2).** `densifyKey`
(`compile-color.ts:161–214`) accepts `space: "oklab" | "oklch"` and threads it to `sampleColorRamp`
so the COLOR MATH is sampled in the correct space. But the stop-emit line is space-BLIND:

```ts
stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) });  // :191
```

`colorToOklabCSS` (`compile-color.ts:76–79`) is called REGARDLESS of `space`, and there is no
`colorToOklchCSS` anywhere in the module (`grep colorToOklchCSS src/animation/compile-color.ts` →
0, verified 2026-06-19). A user who sets `colorSpace: "oklch"` receives an artifact whose stops
are sampled on the oklch ramp but EMITTED as `oklab()` — the browser's piecewise-linear `oklab()`
lerp between those stops does NOT match the oklch-space curve (oklch interpolates HUE around the
wheel; oklab interpolates a/b on the rectangular plane). The `hueMethod` option is consumed by the
ramp but LOST in the emit. The API accepts `colorSpace: "oklch"`, no error fires, but the emitted
CSS uses the wrong space.

value.js 1.0.2 (installed) already exports the oklch emit primitives — `color2(c, "oklch")` returns
`{l, c, h}` and `COLOR_SPACE_RANGES.oklch` carries the CSS denormalization (`c ∈ [0, 0.5]`,
`h ∈ [0, 360]`) — both live-verifiable. NO new value.js API is required; this is the idiomatic
gestalt completion of the oklch path L.W2 initiated.

**Breach 2 — mixed-animation non-color properties dropped (⚠M3).** `densifyColorBlock` builds its
`@keyframes` body from color declarations ONLY (`compile-color.ts:309–316`). In `compileChild`
the densified block REPLACES the full projection:

```ts
const block =
    staticBlock ??
    (densify && "block" in densify
        ? densify.block          // color-only body — bypasses keyframesBlock
        : keyframesBlock(animation, name));
```

For an animation with `background-color: red → blue` + `opacity: 0 → 1`, the compiled `@keyframes`
contains only the densified color stops — `opacity` is silently absent. The
`bodyByStop?: ReadonlyMap<number, string>` seam already exists on `keyframesBlock`
(`format.ts:243`); it is simply never used by the densify path. The gestalt cure routes the densify
through this existing seam rather than bypassing it.

**The proxy the audit indicts.** `proof:compile-replay`'s `densify-delta-proof` clause bites only
the ΔE-ε assertion — it never reads the emitted color space nor asserts non-color survival. The
behavior test tests `colorSpace: "oklab"` exclusively (grep `colorSpace` in
`test/compile-roundtrip.test.ts` → only `"oklab"`). The gate GREENs over a wrong-space oklch
artifact and a property-dropped mixed artifact (C12 HIGH finding, ⚠M2/⚠M3).

### Sub-scope B: Ingest deepening (M.W7)

**Breach 3 — cross-depth sibling-rule linkage silent loss.** `walkSheet`
(`ingest-cssom.ts:188–198`) builds `styleRuleTexts` fresh at the head of EACH call from the
CURRENT `rules` list only (the `type === 1` first-pass loop), then the recursion re-enters a
grouping rule's `.cssRules` with the same `out` Map but a FRESH (empty-of-ancestors)
`styleRuleTexts` (`ingest-cssom.ts:242`). For the pattern:

```css
.foo { animation: pulse 1500ms linear; }
@media screen {
  @keyframes pulse { 0% { opacity: 0 } 100% { opacity: 1 } }
}
```

the inner `walkSheet` finds `@keyframes pulse`, collects style rules from WITHIN `@media` (none),
runs `nameRe` against an empty `styleRuleTexts`, finds `sibling === undefined`, and calls
`reconstructFromRule(rule.cssText, undefined, …)`. With `siblingText === undefined` the
reconstructed `CSSKeyframesAnimation` carries NO declared options — duration/easing/delay fall
back to engine defaults. The authored `1500ms` is silently ignored. The existing S2 gate
(`proof-ingest-replay.mjs:418–457`) is a SOURCE-SHAPE check that `walkSheet` recurses — BLIND
to whether the reconstructed animation carries its sibling-declared timing.

**Breach 4 — `fromLiveAnimations` shadow-DOM silent absent.** `fromLiveAnimations`
(`ingest-cssom.ts:418–466`) reconstructs via `resolveLiveKeyframes(ownerDoc, …)` where
`sheetSource` is ALWAYS the owner document, never the element's shadow root
(`ingest-cssom.ts:449–458`). When a custom element running a shadow-hosted animation is passed as
`target`: (1) `scope.getAnimations()` returns the running animation; (2) `ownerDoc` resolves to
the TOP-LEVEL document; (3) `resolveLiveKeyframes(ownerDoc, …)` walks the document's stylesheets
— not the shadow root — finds no matching `@keyframes`, returns an empty Map. The animation is
silently absent, no diagnostic row, the forbidden silent-absent class. The S4 test
(`test/ingest.test.ts:433–449`) only exercises `fromStyleSheets(shadow)`, never
`fromLiveAnimations(shadowElement)`. The L.W3 S4 gate anchor (`proof-ingest-replay.mjs:498–507`)
greps `ShadowRoot`/`adoptedStyleSheets` in `resolveLiveKeyframes` — a proxy, BLIND to whether
`fromLiveAnimations(shadowEl)` actually resolves.

---

## Scope

### S1 — `colorToOklchCSS` + `channelMidpointOklch` + space dispatch in `densifyKey`

**Cure.** Add `colorToOklchCSS(c: Color): string` in `compile-color.ts` beside the existing
`colorToOklabCSS` (`compile-color.ts:76–79`), built on the SAME value.js primitives: `color2(c,
"oklch")` for `{l, c, h}` channels + `COLOR_SPACE_RANGES.oklch` for CSS denormalization — a
faithful twin of the oklab path, NOT a bespoke re-derivation. Then in `densifyKey` dispatch the
emitter on `space` ONCE (hoisted out of the inner `s` loop):

```ts
const toCSSColor = space === "oklch" ? colorToOklchCSS : colorToOklabCSS;
// … inner loop:
stops.push({ pct: round(pct), css: toCSSColor(ramp[s]!) });
```

Add `channelMidpointOklch(c1, c2): Color` for the ΔE proof midpoint in the oklch case (oklch
channel averages, mirroring `channelMidpoint` for oklab), and dispatch the midpoint function on
`space` alongside the emitter (symmetric — one `space` selector chooses BOTH the emitter AND the
ΔE midpoint, so the ship-vs-refuse proof measures drift against the correct browser model).

Fold: hoist the 1024-stop reference ramp `sampleColorRamp(fromColor, toColor_, 1024, …)` ABOVE
the inner `s` loop (the ramp is independent of `s`; `O(N × 1024)` → `O(1024)` per segment — a
free, obviously-correct cleanup while already dispatching the emitter here).

**Constraint (oklab path byte-identical).** For `colorSpace: "oklab"` (the default and every
existing test), `space === "oklab"` → `toCSSColor = colorToOklabCSS` and the oklab midpoint — the
SAME functions called today. The emitted CSS for every oklab animation is byte-identical
(regression-lock). Only the oklch path changes.

### S2 — densify preserves non-color properties (route through the `bodyByStop` seam)

**Cure (route the densify through the EXISTING `keyframesBlock` override seam).** Change
`densifyColorBlock`'s success case from `{ block: string }` to a per-stop color OVERRIDE map that
the established `keyframesBlock` projection authority MERGES with the declared template:

1. `DensifyResult`'s success case becomes `{ stops: Map<number, Map<string, string>> }`
   (pct → cssProp → css value), not a complete block string.
2. `compileChild` builds the densified block by passing a per-stop body map to
   `keyframesBlock(animation, name, bodyByStop)` (`format.ts:243`) — the override seam ALREADY
   present. For each template stop `i`, `bodyByStop.get(i)` returns the declared-projection body
   for that stop with the densified color declarations OVERLAID (the densify wins for the color
   props it owns; every other declared property — `opacity`, `transform`, … — survives from
   `declaredKeyframeBody`).
3. The `refused`/`null` cases are unchanged.

The single-authority gestalt: `keyframesBlock` stays the ONE block projector; the densify becomes
a per-stop OVERLAY it already supports via `bodyByStop` — no second projection path, no new merge
code in `compile.ts`.

### S3 — `proof:compile-replay` extended to the REAL observable (`proof:oklch-densify-space`)

**Cure.** Add two clauses to `proof:compile-replay` that read the REAL emitted artifact from
`compileToCSS`, asserted in `test/compile-roundtrip.test.ts` (the behavior twin the gate rides):

1. **`oklch-densify-emits-oklch`** — a new fixture compiled with `colorSpace: "oklch"`; assert the
   extracted `@keyframes` block `.toContain("oklch(")` AND `.not.toContain("oklab(")`. Born-RED
   today: `densifyKey` calls `colorToOklabCSS` unconditionally → the block contains `oklab(` and
   zero `oklch(`.

2. **`densify-preserves-non-color`** — a new fixture with `background-color` + `opacity` both
   changing; assert the densified `@keyframes` block contains BOTH the densified color stops AND
   `opacity:` declarations. Born-RED today: `densify.block` REPLACES `keyframesBlock` → `opacity:`
   is silently absent.

**Constraint (born-RED is the genuine emitted-CSS defect, not a proxy).** Both clauses MUST be
authored FIRST and witnessed RED before S1/S2 cures. A clause that merely greps
`colorToOklchCSS` exists in source, or that `densifyColorBlock` returns a `Map`, would assert the
cure's SHAPE, not its OBSERVABLE — the exact L.W1-S4 proxy trap, repeated.

**Gate name:** the standalone gate `proof:oklch-densify-space` is authored as a separate entry in
`package.json` alongside `proof:compile-replay`, so the oklch-space and non-color-survival
observables have a dedicated entry in the correctness roster. `proof:compile-replay` is ALSO
extended (the existing gate tightened to include the new clauses) so the gate that already runs
`proof:correctness` bites both.

### S4 — cross-depth sibling linkage: shared `siblingTexts` accumulator through `walkSheet`

**Cure (Option (a) — the simple, correct fix).** Thread a shared `siblingTexts: string[]`
accumulator THROUGH the `walkSheet` recursion. The top-level call seeds it; each level APPENDS
its own `type === 1` style-rule `cssText` to the SAME array before descending; the recursive call
passes the same accumulator down. The `nameRe`/`sibling` lookup searches the FLAT corpus of every
ancestor-and-current level's style rules, so a nested `@keyframes` finds a top-level
`.foo{animation}`.

**Constraint (scope-down-not-up; first-match-wins preserved).** The accumulator grows as the walk
DESCENDS — a sibling at the current-or-ancestor depth is visible; a DEEPER sibling (in a different
grouping branch the walk has not yet entered) is NOT. Ancestor style rules are appended BEFORE the
current level's, so the outermost match wins ties (deterministic).

**Constraint (zero behavior change for the common path).** A top-level `@keyframes` with a
top-level sibling (the `fromString`-equivalent flat sheet) already finds its sibling at depth 0 —
the accumulator at depth 0 IS today's `styleRuleTexts`, so the byte-identical lookup holds.

### S5 — `fromLiveAnimations` resolves a shadow-hosted `@keyframes`

**Cure (reuse the existing S4 `ShadowRoot` branch in `resolveLiveKeyframes`).** When `target` is
an `Element`, compute its `getRootNode()` (the DOM standard accessor — returns the shadow root for
a shadow-hosted element, the document otherwise; value.js-free). If the document-level
`resolveLiveKeyframes(ownerDoc, …)` returns EMPTY for a name that IS in `liveNames`, re-resolve
against the shadow root candidate via the SAME `resolveLiveKeyframes` (its L.W3 S4 `ShadowRoot`
branch, `ingest-cssom.ts:308`, already walks `styleSheets` + `adoptedStyleSheets`). The shadow
root path is the EXISTING resolver, re-aimed — no second walk, no bespoke shadow logic in
`fromLiveAnimations` (the single-resolver gestalt).

**Constraint (try-document-first, shadow-fallback; no double-emit).** The document walk runs
first; the shadow re-resolve fires ONLY when the document walk yields nothing for a found name AND
the target's root node is a `ShadowRoot`. A name resolved at the document level is NOT re-walked.

### S6 — `proof:ingest-replay` extended to the REAL observable

**Cure.** Add TWO behavioral clauses to `test/ingest.test.ts` (the behavior twin
`proof:ingest-replay` runs via `vitest run test/ingest.test.ts`):

1. **cross-depth duration** — `fromStyleSheets([crossDepthSheet])` then assert
   `animations.get("pulse")!.animation.options.duration === 1500` (the authored `1.5s`, NOT the
   `1000` default). Born-RED today: the nested `@keyframes` sees an empty `styleRuleTexts`,
   reconstruction defaults to `1000`.

2. **shadow live** — `fromLiveAnimations(shadowEl)` then assert `animations.has("shadowPulse")`.
   Born-RED today: `fromLiveAnimations` resolves only against `ownerDoc` → empty Map.

The existing S2 (`nested-walk`) and S4 (`shadow-walk`) source-shape proxy clauses in
`proof-ingest-replay.mjs` are RE-TARGETED off their greps onto behavioral anchors that hold the
tests to the REAL ingest surface (the same pattern O.W3 applies to proof:replay-equality S4).

**Constraint (born-RED is the genuine defect, not a proxy).** Both assertions MUST be authored
FIRST and witnessed RED: cross-depth reconstructs `pulse` with `1000` today (not `1500`);
`fromLiveAnimations(shadowEl)` returns an empty Map today. A gate that merely greps "the
accumulator parameter / `getRootNode` appears" would repeat the L.W3-S2/S4 proxy mistake.

---

## Born-RED gates

**Gate 1:** `proof:oklch-densify-space` (NEW — `scripts/proof-oklch-densify-space.mjs`)
Wire into `package.json` alongside `proof:compile-replay` in the `proof:correctness` roster.

**Born-RED state on today's tree:**

A `colorSpace: "oklch"` animation compiled via `compileToCSS`:
- Emitted `@keyframes` block contains `oklab(` (zero `oklch(`) — the `.toContain("oklch(")` assertion FAILS
- `densifyKey` calls `colorToOklabCSS` unconditionally (`:191`) — `grep colorToOklchCSS src/animation/compile-color.ts` → 0

A `background-color` + `opacity` both-changing animation compiled via `compileToCSS`:
- Emitted densified `@keyframes` block contains no `opacity:` — the `.toMatch(/opacity:/)` assertion FAILS
- `densify.block` REPLACES `keyframesBlock` at `compile.ts:397` — `opacity` cannot survive

**Falsifiable clauses:**

| Clause | RED state today | GREEN condition after cure |
|--------|-----------------|----------------------------|
| `oklch-densify-emits-oklch` | `compileToCSS` over `colorSpace:"oklch"` animation; emitted block `.toContain("oklch(")` FAILS (contains `oklab(`) | `densifyKey` dispatches `colorToOklchCSS` for `space === "oklch"` → emitted block contains `oklch(` stops |
| `densify-preserves-non-color` | `compileToCSS` over `background-color`+`opacity` animation; emitted block `.toMatch(/opacity:/)` FAILS (silent drop) | densify routed through `bodyByStop` seam → declared `opacity:` survives alongside densified color stops |

**Gate 2:** `proof:ingest-replay` extended (EXISTING gate — `scripts/proof-ingest-replay.mjs` + `test/ingest.test.ts`)

**Born-RED state on today's tree:**

Cross-depth fixture: `fromStyleSheets` over `.foo{animation:pulse 1500ms linear}` (top level) +
`@media screen{@keyframes pulse{…}}`; assert `duration === 1500`.
Actual today: `styleRuleTexts` is per-level → `sibling === undefined` → reconstruction defaults to `1000` → `1500 !== 1000` → RED.

Shadow-live fixture: `fromLiveAnimations(shadowEl)` where `shadowEl` hosts a shadow-origin
`@keyframes shadowPulse`; assert `animations.has("shadowPulse")`.
Actual today: `ownerDoc` walk finds no `shadowPulse` → empty Map → `has(…) === false` → RED.

**Falsifiable clauses:**

| Clause | RED state today | GREEN condition after cure |
|--------|-----------------|----------------------------|
| `cross-depth-duration` | `animations.get("pulse").animation.options.duration === 1000` (default) instead of `1500` — the authored `1.5s` is silently dropped | shared `siblingTexts` accumulator carries the top-level `.foo`; `pulse` reconstructs with `duration === 1500` |
| `shadow-live` | `fromLiveAnimations(shadowEl)` returns empty Map — shadow `@keyframes` silently absent | `getRootNode()` shadow re-resolve → `animations.has("shadowPulse") === true` |

**Planted-failure contract (born-RED requirement).**
Both gate scripts are authored BEFORE their respective cures and witnessed RED on today's tree.
Each RED state is the GENUINE defect observable from the real artifact or the real Map result —
not a proxy for it (inv-M-observable-truth met for both sub-scopes).

**Green condition.**
Sub-scope A: `densifyKey` emits `oklch()` for `colorSpace: "oklch"` (S1); the densify preserves
non-color properties through the `bodyByStop` seam (S2); `proof:oklch-densify-space` two clauses
GREEN (S3); `proof:compile-replay` existing clauses (`multi-color-honest`, `densify-delta-proof`,
`static-weight-compile`, etc.) stay GREEN (regression-lock). Sub-scope B:
`walkSheet` threads a shared `siblingTexts` accumulator (S4); `fromLiveAnimations` re-resolves
against the shadow root (S5); `proof:ingest-replay` two new behavioral clauses GREEN (S6); all
18 existing `test/ingest.test.ts` assertions stay GREEN.

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling gate.** `color2(c, "oklch")` returns the oklch
  `{l, c, h}` channels and `COLOR_SPACE_RANGES.oklch` carries the CSS denormalization — both
  live-verifiable from the installed dist. `walkSheet`, `reconstructFromRule`,
  `resolveLiveKeyframes` (with its L.W3 S4 `ShadowRoot` branch), and `fromLiveAnimations` all
  already exist in `ingest-cssom.ts`. No value.js API consumed that is not already present.
- **No sibling dep.** Pure kf-internal changes:
  - Sub-scope A: `compile-color.ts` (new `colorToOklchCSS` + `channelMidpointOklch` + `space`
    dispatch + `DensifyResult` shape change) + `compile.ts` (route `densify` through
    `keyframesBlock(…, bodyByStop)`) + `scripts/proof-oklch-densify-space.mjs` (NEW) +
    two fixtures + `test/compile-roundtrip.test.ts` + `scripts/proof-compile-replay.mjs` extension.
  - Sub-scope B: `ingest-cssom.ts` (`walkSheet` + `fromLiveAnimations`) + `ingest.ts` (scroll-rAF
    BOOK comment) + `test/ingest.test.ts` + `scripts/proof-ingest-replay.mjs` clause re-target.
- **No cross-wave file collision.** O.W3 touches `frame-compiler.ts` + `proof-replay-equality.mjs`;
  O.W4 touches `compile-color.ts`/`compile.ts`/`ingest-cssom.ts`/`ingest.ts` — disjoint surfaces.
  O.W5 (DemoControlPoint) touches demo tree only; O.W6 (MorphSVG) touches `morph-svg.ts`/load-engine.
- **Sequence.** O.W4 is NOW-executable in parallel with O.W3 (no shared file surface). Both fire
  before O.W5 (the chronic terminal build-in, which benefits from the correct compile surface).

---

## dev→impl boundary

This wave is DEVELOPED (docs). The implementation opens on the owner's explicit authorization per
the O charter dev→impl boundary. When authorized, the sequence within this wave is:

**Sub-scope A (multi-color):**
1. Author `scripts/proof-oklch-densify-space.mjs` (born-RED) — witness RED on both clauses.
2. Add `colorToOklchCSS` + `channelMidpointOklch` in `compile-color.ts`.
3. Dispatch emitter + midpoint on `space` in `densifyKey`; hoist the 1024-ramp above the inner loop.
4. Change `DensifyResult` success case to `Map`; route `compileChild` through `keyframesBlock(…, bodyByStop)`.
5. Add fixtures + `test/compile-roundtrip.test.ts` assertions; extend `proof:compile-replay`.
6. Run `proof:oklch-densify-space` → GREEN; run `proof:compile-replay` → GREEN (all existing clauses intact).

**Sub-scope B (ingest):**
1. Extend `test/ingest.test.ts` with `cross-depth-duration` and `shadow-live` behavioral assertions — witness RED.
2. Thread `siblingTexts` accumulator through `walkSheet` recursion in `ingest-cssom.ts`.
3. Add `getRootNode()` shadow re-resolve to `fromLiveAnimations` in `ingest-cssom.ts`.
4. Re-target S2 + S4 source-shape proxy clauses in `proof-ingest-replay.mjs` onto behavioral anchors.
5. Run `proof:ingest-replay` → GREEN (all 18 existing assertions + 2 new clauses).

Both sub-scopes may be implemented in parallel (no shared file surface); both must be GREEN before
O.W4 is declared DONE.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| `oklch-densify-emits-oklch` | A `colorSpace: "oklch"` animation compiled via `compileToCSS` SILENTLY emits `oklab()` stops — the browser's oklab re-lerp diverges from the oklch curve, `hueMethod` is lost, and the artifact is perceptually wrong despite a correct ΔE proof; the API accepts an option it does not honor end-to-end (⚠M2 re-opens) |
| `densify-preserves-non-color` | A mixed color + non-color animation SILENTLY drops every non-color property through the densified block — the browser replays correct color with STATIC opacity, `eligible:true` masks the loss; the `keyframesBlock` projection authority is bypassed instead of overlaid (⚠M3 re-opens) |
| `cross-depth-duration` | A `@keyframes` nested in `@media`/`@supports`/`@layer` whose `.foo{animation:…}` is at the top level reconstructs with ENGINE-DEFAULT duration/easing/delay — the authored timing is silently dropped (the no-silent-drop law re-breached on the ingest surface) |
| `shadow-live` | A running SHADOW-hosted animation found by `getAnimations()` is silently absent from `fromLiveAnimations`'s result — empty Map, no diagnostic, the forbidden silent-absent class |

---

## Excluded from this wave

- **The `@property`-compile artifact gap** (M.W5 S1 — `compileToCSS` omits `@property` blocks).
  Not in O.W4 scope; belongs to a separate O wave touching `compile.ts`/`format.ts`.
- **The named-selector NaN cure** — O.W3 scope.
- **The `color()` CSS-function round-trip asymmetry** (DLL-26(d)) — value.js upstream defect; no
  kf band-aid available. Excluded.
- **The `transition`-shorthand mirror** (DLL-49) — value.js-gated. Excluded.
- **The `fromLiveAnimations` shadow-diagnostic arm** (M.W7 §Excluded Option (b)) — emitting a
  `CORS_SKIP`-class diagnostic when BOTH walks return empty is a follow-on honesty arm; the
  positive shadow resolution (S5) is the cure here.
- **The scroll→rAF domain-mismatch BOOK** (M.W7 S3) — the inv-ε honesty doc + ledger row for
  the rAF-substitution at `ingest.ts:250–258`. This is included as a micro-scope side-effect of
  the ingest edit in S5 (the BOOK comment is added while editing `ingest-cssom.ts` / `ingest.ts`),
  but it is NOT a born-RED clause (it is a source-shape/honesty invariant per inv-M-two-axis).
- **The deeper SEMANTICALLY-TYPED group-rule walk** (DLL-27 / L.W10.S3) — sibling-gated on a
  future value.js typed recursive at-rule body. NOT kf-internal, NOT this wave. The S4
  accumulator rides the existing duck-typed `cssRules` descent unchanged.
- **Path B scroll-continuity** (the `KeyframesScrollTimeline` rAF-vs-scroll bridge) — excluded
  same as O.W3. S3 BOOK names the residual; the bridge is a deferred feature.
