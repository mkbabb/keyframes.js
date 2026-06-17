# M.W6 — Multi-color densify fidelity (the space the gate emitted wrong)

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:**
  value.js 0.13.0 (already pinned — has `color2`/`COLOR_SPACE_RANGES.oklch`, the
  oklch emit + denormalization primitives; NO sibling publish gate). Parallel with
  M.W5 ∥ M.W7 (the three Band-B kf-internal correctness waves,
  value.js-0.13.0-sufficient). Composes with M.W1's report-all runner but does NOT
  require it.
- **Gate (extended + tightened):** `proof:compile-replay` — (a) a NEW
  `oklch-densify-emits-oklch` clause: a fixture with `colorSpace: "oklch"` compiled
  via `compileToCSS` asserts the emitted `@keyframes` block contains `oklch(` (NOT
  `oklab(`); born-RED because `densifyKey` calls `colorToOklabCSS` unconditionally
  (`compile-color.ts:191`) and `colorToOklchCSS` does not exist (`grep colorToOklchCSS
  src/animation/compile-color.ts` → 0, verified 2026-06-17). (b) a NEW
  `densify-preserves-non-color` clause: a fixture with `background-color` + `opacity`
  BOTH changing, compiled via `compileToCSS`, asserts the densified `@keyframes` block
  contains BOTH the densified color stops AND `opacity:` declarations; born-RED because
  `densify.block` REPLACES `keyframesBlock` (`compile.ts:397`) and `densifyColorBlock`
  emits a color-only body (`compile-color.ts:309-316`) — `opacity:` is silently absent.
- **Folds (lane #):** lane-02 §2 (the oklch densify emits `oklab()` CSS — the
  wrong-space residual) · lane-02 §2b (the mixed-animation non-color property drop) ·
  lane-02 §6 (the CC-7 + CC-7b M-wave proposals) · lane-02 §9 (the 1024-ramp
  inner-loop double-sample perf cleanup) · lane-02 §7 (the deferred-fold dispositions).
- **Precept cure:** ⚠M2 (`compile-color.ts:191` — `colorToOklabCSS` called
  unconditionally; `oklch` space emits `oklab()` — the inv-L-totality faithful
  round-trip violation) · ⚠M3 (densify drops non-color properties from mixed
  animations, `eligible:true` over a corrupt artifact — the inv-L-totality
  honest-or-refuse violation).

---

## Context

L.W2 shipped the multi-color HONEST densify (`proof:compile-replay`'s
`multi-color-honest` clause GREEN) — a two-changing-color track now densifies EACH
key independently and refuses if ANY key drifts past ΔE-ε, instead of the L-pre
silent verbatim-sRGB ship. That S-clause LANDED and is gated (lane-02 §1 S2). But
the 32-lane re-audit source-read + live-probed the as-shipped densify path and found
TWO real residual bugs the green gate cannot see — both on this wave's surface
(lane-02 §0 verdict: "the audit finds one NEW residual bug in the as-shipped code —
the oklch densify emit path — and … the mixed animation non-color property drop").
Each is the same failure class the tranche is named to cure: **the emitted CSS
artifact is wrong, but the gate asserts the ΔE-ε proof and never reads the emitted
space or the surviving declarations.**

**Breach 1 — the oklch densify emits `oklab()` CSS (lane-02 §2, ⚠M2).** `densifyKey`
(`compile-color.ts:161-214`) accepts a `space: "oklab" | "oklch"` parameter and
threads it to `sampleColorRamp` (`compile-color.ts:184-187,196-199`), so the COLOR
MATH is sampled in the correct space. `densifyColorBlock` correctly selects the
space from the author option (`compile-color.ts:273-275`: `colorSpace === "oklch" ?
"oklch" : "oklab"`). But the stop-emit line is space-BLIND:

```ts
stops.push({ pct: round(pct), css: colorToOklabCSS(ramp[s]!) });   // :191
```

`colorToOklabCSS` (`compile-color.ts:76-79`) is called REGARDLESS of `space`, and
there is NO `colorToOklchCSS` anywhere in the module (`grep colorToOklchCSS` → 0).
So a user who sets `colorSpace: "oklch"` and calls `compileToCSS` receives an
artifact whose stops are sampled on the oklch ramp but EMITTED as `oklab()` — the
browser's piecewise-linear `oklab()` lerp between those stops does NOT match the
oklch-space curve kf's JS playback used (oklch interpolates HUE around the wheel;
oklab interpolates a/b on the rectangular plane — a different path between the SAME
endpoints). The `hueMethod` option (`shorter`/`longer`/… for the oklch hue
trajectory, `compile-color.ts:276-278`) is consumed by the ramp but LOST in the
emit: the emitted `oklab()` stops bake in samples from one hue path while the
browser re-lerps them on the oklab plane. This is a sin of silent commission — the
API accepts `colorSpace: "oklch"`, no error fires, but the emitted CSS uses the
wrong space (lane-02 §4 precept violation: "if you accept the option, honor it
end-to-end through the CSS emit"). value.js 0.13.0 already exports the oklch emit
primitives — `color2(c, "oklch")` returns `{l, c, h}` and `COLOR_SPACE_RANGES.oklch`
carries the CSS denormalization (`c ∈ [0, 0.5]`, `h ∈ [0, 360]`) — both live-verified
2026-06-17 (audit evidence table). NO new value.js API is required; this is the
idiomatic gestalt completion of the oklch path L.W2 initiated.

**Breach 2 — mixed-animation non-color properties dropped (lane-02 §2b, ⚠M3).**
`densifyColorBlock` builds its `@keyframes` body from color declarations ONLY
(`compile-color.ts:309-316`): `byPct` accumulates `\`${cssProp}: ${css};\`` strings
exclusively from each key's densified color stops. No non-color property
(`opacity`, `transform`, `filter`, …) is included. In `compileChild` the densified
block REPLACES the full projection:

```ts
const block =
    staticBlock ??
    (densify && "block" in densify
        ? densify.block                       // :397 — color-only body
        : keyframesBlock(animation, name));   // the FULL declared projection, bypassed
```

`keyframesBlock` (`format.ts:240-266`) is the correct projection authority — it
projects ALL declared template properties via `declaredKeyframeBody`
(`unflattenObjectToString` over the full `parsedVars[i]` map). When `densify.block`
is chosen it bypasses that authority, so for an animation with `background-color:
red → blue` + `opacity: 0 → 1` the compiled `@keyframes` contains only the
densified `background-color` stops — `opacity` is silently absent, the browser
replays correct color with STATIC opacity, and `eligible: true` gives the consumer
no signal of the loss (lane-02 §2b: "a silent correctness failure on the common
mixed-animation case"). This is the most common real case — a fade-in whose color
also shifts — and the densify quietly corrupts it.

**The seam already exists.** `keyframesBlock` carries a `bodyByStop?:
ReadonlyMap<number, string>` parameter (`format.ts:243`) — the densify OVERRIDE seam
the L.W10 CC-2 split established: "`bodyByStop` (CC-2 densify) substitutes a per-stop
body where provided, else the verbatim declared projection rides"
(`format.ts:236-238`). The bug is that the densify path NEVER USES this seam — it
builds a complete block string and hands it to `compile.ts:397` as a wholesale
replacement instead of feeding per-stop color declarations THROUGH `keyframesBlock`
so the declared projection (opacity/transform/…) survives and the color stops
overlay it. The gestalt cure is to make `densifyColorBlock` a per-stop color OVERRIDE
producer and route it through the EXISTING `bodyByStop` seam — no second projection
authority, no new merge code in `compile.ts` (lane-02 §6 CC-7b: "the gestalt fix:
`densifyColorBlock` becomes a per-stop color OVERRIDE map, not a block builder").

**The proxy the audit indicts (lane-02 §5).** Today's `proof:compile-replay`
`densify-delta-proof` clause (`proof-compile-replay.mjs:250-260`) bites ONLY the
ΔE-ε assertion lock (`deltaEEpsilon` / `reason).toBe("perceptual-oklab")` patterns
in the test body). It does NOT assert WHICH CSS space the emitted stops use, NOR
whether non-color declarations survive. The behavior test
(`test/compile-roundtrip.test.ts`) tests `colorSpace: "oklab"` THROUGHOUT (every
densify test uses the default — `grep colorSpace` → only `"oklab"`, verified) and
exercises NO color + non-color mixed animation through the densify path. So the gate
GREENs while the oklch artifact is wrong-space and the mixed artifact is
property-dropped — exactly the inv-M-observable-truth failure class (the gate tests a
proxy — the ΔE math is right — and is blind to the observable that actually breaks —
the EMITTED CSS string). The gate this wave authors must read the emitted CSS.

### Audit evidence

| Ref | Source location | Fact |
|-----|-----------------|------|
| lane-02 §2 | `src/animation/compile-color.ts:191` | `stops.push({ … css: colorToOklabCSS(ramp[s]!) })` — `colorToOklabCSS` called REGARDLESS of `space` |
| lane-02 §2 | `grep colorToOklchCSS src/animation/compile-color.ts` | **ZERO** hits — no oklch CSS emitter exists (re-verified 2026-06-17) |
| lane-02 §2 | `src/animation/compile-color.ts:165,184-187,196-199` | the `space` param IS threaded to `sampleColorRamp` (the ramp math is correct) but ignored at emit |
| lane-02 §2 | `src/animation/compile-color.ts:273-275` | `densifyColorBlock` correctly selects `space` from `animation.options.colorSpace === "oklch"` |
| lane-02 §2 | `src/animation/compile-color.ts:276-278` | `hueMethod` is read into `hueOpt` and threaded to the ramp — but LOST in the `oklab()` emit |
| lane-02 §2b | `src/animation/compile-color.ts:309-316` | the `@keyframes` body is built from `byPct` (color declarations ONLY); no non-color property is included |
| lane-02 §2b | `src/animation/compile.ts:395-399` | `densify.block` REPLACES `keyframesBlock(animation, name)` — the full declared projection is bypassed |
| lane-02 §2b | `src/animation/format.ts:240-266` | `keyframesBlock` projects ALL declared template properties via `declaredKeyframeBody`/`unflattenObjectToString` — the authority the densify path skips |
| seam | `src/animation/format.ts:243,253` | `keyframesBlock(animation, name, bodyByStop?: ReadonlyMap<number, string>)` — `bodyByStop?.get(i) ?? declaredKeyframeBody(…)` — the per-stop override seam the densify path never uses |
| dep | `node -e "v.color2(parseCSSValue('red').value,'oklch')"` → `{l,c,h,…}` | `color2(c, "oklch")` returns the oklch channels — value.js 0.13.0 sufficient (live probe, 2026-06-17) |
| dep | `COLOR_SPACE_RANGES.oklch` → `{ c:{number:{min:0,max:0.5}}, h:{number:{min:0,max:360}} }` | the CSS oklch denormalization ranges are present (live probe, 2026-06-17) |
| perf | `src/animation/compile-color.ts:194-202` | the 1024-stop reference ramp `sampleColorRamp(fromColor, toColor_, 1024, …)` is recomputed inside the per-stop `s` loop — independent of `s`, hoistable (lane-02 §9) |
| gate proxy | `scripts/proof-compile-replay.mjs:250-260` | `densify-delta-proof` bites the ΔE-ε lock ONLY — never the emitted space, never non-color survival |
| gate proxy | `test/compile-roundtrip.test.ts` | every densify test uses `colorSpace: "oklab"`; ZERO oklch test, ZERO color+non-color mixed densify test (lane-02 §5) |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they make the
densify emit FAITHFUL to the author's `colorSpace` and preserve every declared
property through the densified block — the inv-L-totality round-trip the L.W2 gate
missed.

### S1 — `densifyKey` emits the author's color space (`oklch()` for oklch, `oklab()` for oklab)

**Breach.** `densifyKey` calls `colorToOklabCSS(ramp[s]!)` unconditionally
(`compile-color.ts:191`); a `colorSpace: "oklch"` animation samples the oklch ramp
but emits `oklab()` CSS — the browser's oklab re-lerp does not track the oklch curve
(hue-around-the-wheel vs a/b-plane), and `hueMethod` is lost. There is no
`colorToOklchCSS` (`grep` → 0).

**Cure.** Add `colorToOklchCSS(c: Color): string` in `compile-color.ts` beside the
existing `colorToOklabCSS` (`compile-color.ts:76-79`), built on the SAME value.js
primitives the oklab path uses: `color2(c, "oklch")` for the `{l, c, h}` channels +
`COLOR_SPACE_RANGES.oklch` for the CSS denormalization (`c ∈ [0, 0.5]`, `h ∈ [0,
360]`) — a faithful twin of `rawOklab`/`colorToOklabCSS`, NOT a bespoke
re-derivation. Then in `densifyKey` dispatch the emitter on `space` ONCE (hoisted
out of the inner loop):

```ts
const toCSSColor = space === "oklch" ? colorToOklchCSS : colorToOklabCSS;
// … inner loop:
stops.push({ pct: round(pct), css: toCSSColor(ramp[s]!) });
```

**Constraint (the ΔE proof midpoint must match the emitted space).** The ΔE
ship-vs-refuse proof measures the browser's inter-stop midpoint vs kf's perceptual
color (`compile-color.ts:194-201`). `channelMidpoint` (`compile-color.ts:108-112`)
is OKLAB-hardcoded (`rawOklab` channel averages) — correct when the emit is
`oklab()` (the browser channel-lerps in oklab), WRONG when the emit is `oklch()`
(the browser channel-lerps L, C, H in oklch). The cure adds a
`channelMidpointOklch(c1, c2): Color` for the oklch case (the oklch-channel average)
and dispatches the midpoint on `space` alongside the emitter (lane-02 §6 CC-7:
"similarly dispatch the midpoint function"). Without this, the oklch densify would
measure drift against the wrong browser model — a faithful emit gated by a
mismatched proof. The dispatch is symmetric: one space selector chooses BOTH the
emitter AND the proof midpoint.

**Constraint (oklab path byte-identical).** For `colorSpace: "oklab"` (the default
and every existing test/fixture), `space === "oklab"` → `toCSSColor =
colorToOklabCSS` and the oklab midpoint — the SAME functions called today. The
emitted CSS for every oklab animation is byte-identical (regression-lock); only the
oklch path changes.

**Gate bite (S3 coverage).** A `colorSpace: "oklch"` animation with one changing
color key, compiled via `compileToCSS`, asserts the emitted `@keyframes` block
`.toContain("oklch(")` AND `.not.toContain("oklab(")`. Today: emits `oklab(` → RED.
After cure: emits `oklch(` → GREEN. An oklab animation's compiled CSS is unchanged.

### S2 — the densify preserves non-color properties (route through the `bodyByStop` seam)

**Breach.** `densifyColorBlock` emits a color-ONLY body (`compile-color.ts:309-316`)
and `compile.ts:397` uses `densify.block` as a wholesale REPLACEMENT of
`keyframesBlock(animation, name)` (`format.ts:240-266`, the full declared
projection). A `background-color: red → blue` + `opacity: 0 → 1` animation compiles
to a `@keyframes` with the densified color stops and NO `opacity` — silently dropped,
`eligible: true`, the browser replays static opacity.

**Cure (route the densify through the EXISTING `keyframesBlock` override seam).**
`densifyColorBlock`'s success case changes from `{ block: string }` to a per-stop
color OVERRIDE that the established `keyframesBlock` projection authority MERGES with
the declared template — NOT a new merge in `compile.ts`. Concretely:

1. `DensifyResult`'s success case becomes `{ stops: Map<number, Map<string, string>> }`
   (pct → cssProp → css), not a complete block string (`compile-color.ts:139-142`,
   the `DensifyResult` union).
2. `compileChild` builds the densified block by passing a per-stop body map to
   `keyframesBlock(animation, name, bodyByStop)` (`format.ts:243`) — the override seam
   already present. For each template stop `i`, `bodyByStop.get(i)` returns the
   declared-projection body for that stop with the densified color declarations
   OVERLAID (the densify wins for the color props it owns; every other declared
   property — `opacity`, `transform`, … — survives from `declaredKeyframeBody`). The
   densify's intermediate stops (the baked sub-stops at percentages BETWEEN declared
   stops) extend the projected stop set rather than replacing it.
3. The `refused`/`null` cases are unchanged: `{ refused: true, delta }` still refuses
   the whole block when ANY key drifts past ΔE-ε, `null` still falls back to the
   verbatim declared projection.

The single-authority gestalt: `keyframesBlock` stays the ONE block projector; the
densify becomes a per-stop OVERLAY it already supports (`bodyByStop`) — no second
projection path, no `compile.ts` merge code (lane-02 §6 CC-7b: "pass the
color-override map to `keyframesBlock` via a `bodyByStop` arg that already exists").

**Constraint (color-only animations unchanged).** A pure color animation (the
existing `multi-color-scroll.css` fixture — no non-color property) produces the SAME
densified stops it does today: `declaredKeyframeBody` for a color-only stop is just
the color declaration, the densify overlays it, the merged body equals the current
color-only body. The regression-lock is the existing `multi-color-honest` +
`densify-delta-proof` clauses staying GREEN.

**Gate bite (S3 coverage).** A `background-color` + `opacity` BOTH-changing animation,
compiled via `compileToCSS`, asserts the densified `@keyframes` block contains BOTH
the densified color stops (`oklab(` for the default space) AND `opacity:`
declarations. Today: `opacity:` is absent → RED. After cure: both present → GREEN.

### S3 — extend `proof:compile-replay` to the REAL observable (inv-M-observable-truth)

**Breach.** `proof:compile-replay`'s `densify-delta-proof` clause
(`proof-compile-replay.mjs:250-260`) bites the ΔE-ε lock ONLY — it never reads the
emitted color space nor asserts non-color survival. The behavior test tests
`colorSpace: "oklab"` exclusively and exercises no mixed densify. The gate GREENs
over a wrong-space oklch artifact and a property-dropped mixed artifact — the
inv-M-observable-truth proxy failure (the ΔE math is right; the EMITTED CSS is wrong).

**Cure (the behavioral assertion over the emitted CSS, NOT a source-shape proxy).**
Add TWO clauses that read the REAL emitted artifact, asserted in
`test/compile-roundtrip.test.ts` (the behavior the node gate rides via its existing
test-anchor seam), with the node-script clause holding the test to the real compile
surface (the same shape as the L.W2 `densify-delta-proof` clause — a behavioral
assertion in the test body, an anchor in the script):

1. **`oklch-densify-emits-oklch`** — a NEW fixture `test/fixtures/compile/oklch-densify.css`
   (a single changing color track) compiled via `compileToCSS` with `colorSpace:
   "oklch"`; assert the extracted `@keyframes` block (via the existing
   `keyframesOf(css, name)` helper, `compile-roundtrip.test.ts:63-67`)
   `.toContain("oklch(")` AND `.not.toContain("oklab(")`. The node clause anchors on
   the test's `colorSpace: "oklch"` + `oklch(` assertion presence (the cure-only
   discriminant — absent on today's tree, anti-vacuous per the L.W2 §born-RED
   warnings).
2. **`densify-preserves-non-color`** — a NEW fixture
   `test/fixtures/compile/color-plus-opacity.css` (`background-color` + `opacity` both
   changing) compiled via `compileToCSS`; assert the extracted densified `@keyframes`
   block `.toContain("oklab(")` (the densified color, default space) AND
   `.toMatch(/opacity:/)` (the surviving non-color property). The node clause anchors
   on the test's `opacity:`-in-densified-block assertion.

**Constraint (born-RED on TODAY's tree — the keystone).** Both new assertions MUST
be authored FIRST and witnessed RED before the S1/S2 cures. On today's tree: the
oklch fixture's emitted block contains `oklab(` (and zero `oklch(`) — the
`.toContain("oklch(")` assertion FAILS (the genuine wrong-space defect, lane-02 §2
live source-read); the color+opacity fixture's densified block contains no `opacity:`
— the `.toMatch(/opacity:/)` assertion FAILS (the genuine property-drop defect,
lane-02 §2b). Each born-RED witness is the GENUINE emitted-CSS defect, live-readable
from the artifact, NOT a proxy for it (inv-M-observable-truth discharged). A clause
that merely greps `colorToOklchCSS` exists in source, or that `densifyColorBlock`
returns a `Map`, would repeat the L.W1-S4 mistake (asserting the cure's SHAPE, not
its OBSERVABLE) and is forbidden.

**Gate bite (S3 self-coverage).** Plant the S1 cure → the oklch block emits `oklch(`
→ `oklch-densify-emits-oklch` GREEN; revert → `oklab(` re-appears → RED. Plant the S2
cure → `opacity:` survives the densified block → `densify-preserves-non-color` GREEN;
revert → `opacity:` drops → RED. Each clause discriminates the EXACT state its cure
changes — the emitted-CSS observable, read from the real artifact.

### S4 — hoist the 1024-stop reference ramp out of the per-stop ΔE loop (perf)

**Breach.** The ΔE proof recomputes the 1024-stop reference ramp INSIDE the per-stop
inner loop (`compile-color.ts:194-199`): `sampleColorRamp(fromColor, toColor_, 1024,
…)` is called `N-1` times per changing segment (once for each adjacent emitted-stop
midpoint `s`), but the 1024-stop ramp is INDEPENDENT of `s` — it depends only on
`(fromColor, toColor_, space, hueOpt)`, constant across the inner loop. This is
`O(N × 1024)` color conversions per segment where `O(1024)` suffices (lane-02 §9).
Compile-time-only, so not blocking — but a free, obviously-correct cleanup the wave
folds while it is in this exact code path (it must already dispatch the emitter + the
ΔE midpoint on `space` here).

**Cure.** Hoist the `sampleColorRamp(…, 1024, …)` call ABOVE the inner `s` loop
(once per segment), index `refRamp[Math.round(tMid * 1023)]` inside. Behavior is
IDENTICAL (the same ramp, the same index) — a pure recompute elision, not a
numeric change. The ΔE values, the ship-vs-refuse decision, and the emitted stops
are byte-for-byte unchanged.

**Constraint (no observable change — a perf-only fold).** This is NOT a born-RED
S-clause (it changes no observable — the gate cannot witness it RED). It rides on the
S1/S2 cure that necessarily edits `densifyKey`'s inner loop, and is verified by the
existing `densify-delta-proof` + `multi-color-honest` + replay-equality clauses
staying GREEN (the ΔE values and emitted stops unchanged). It is recorded here so the
edit is intentional, not incidental — the wave touches this loop for S1's `space`
dispatch anyway, so the hoist is the idiomatic single-pass cleanup (no separate
churn).

---

## Born-RED gate

**Gate:** `proof:compile-replay` (EXISTING — `scripts/proof-compile-replay.mjs` + its
behavior twin `test/compile-roundtrip.test.ts`; this wave ADDS the
`oklch-densify-emits-oklch` + `densify-preserves-non-color` clauses and folds the
1024-ramp hoist under the existing ΔE clauses). The gate is GREEN on today's tree
against the WRONG observables (lane-02 §1: all four L.W2 S-clauses "LANDED and
gate-verified GREEN" — the ΔE math is right, the emitted space/properties are not
read). After this wave's extension it goes RED on today's tree until S1+S2 land.

**The REAL observable (inv-M-observable-truth).** The born-RED witness is the GENUINE
emitted-CSS defect, read live from the `compileToCSS` artifact, NOT a proxy:

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after cure |
|--------|-------------------------|------------------------------------------|---------------------|
| S1 / S3 oklch emit | `compileToCSS([a])` over a `colorSpace: "oklch"` changing-color animation; extract the `@keyframes` block; assert `.toContain("oklch(")` AND `.not.toContain("oklab(")` | `densifyKey` calls `colorToOklabCSS` unconditionally (`compile-color.ts:191`) → the emitted stops are `oklab()` despite the oklch ramp; the browser's oklab re-lerp does not track the oklch curve, `hueMethod` is lost (live source-read, lane-02 §2) | the emitted `@keyframes` block contains `oklch(` stops (the oklch midpoint proof matched) |
| S2 / S3 non-color survival | `compileToCSS([a])` over a `background-color` + `opacity` both-changing animation; extract the densified `@keyframes` block; assert `.toContain("oklab(")` AND `.toMatch(/opacity:/)` | `densify.block` REPLACES `keyframesBlock` (`compile.ts:397`); the densified body is color-only (`compile-color.ts:309-316`) → `opacity:` is **silently absent**, `eligible:true`, the browser replays static opacity (live source-read, lane-02 §2b) | the densified block contains BOTH the `oklab(` color stops AND `opacity:` declarations (routed through the `bodyByStop` seam) |

**Today's tree result.** With the two clauses added, `proof:compile-replay` exits
non-zero: the oklch fixture's emitted block contains `oklab(` (zero `oklch(`), and
the color+opacity fixture's densified block omits `opacity:`. The born-RED is the
genuine wrong-space / silent-drop on the EMITTED CSS, not a stand-in —
inv-M-observable-truth met (the L.W2 gate read the ΔE proof and missed these exact
emit defects; this wave reads the artifact).

**Green condition.** `densifyKey` emits `oklch()` for `colorSpace: "oklch"` (S1, with
the oklch ΔE midpoint); the densify preserves non-color properties through the
`bodyByStop` seam (S2); both new clauses' emitted-CSS assertions hold (S3); the
1024-ramp hoist leaves the ΔE values unchanged (S4); and every pre-existing
`proof:compile-replay` clause (`multi-color-honest`, `scroll-compile-emit`,
`static-weight-compile`, `no-reverseMs`, `densify-delta-proof`, `replay-equality`,
the four-refusals + heavy-boundary structural locks) stays GREEN (no regression).

---

## Dependencies

- **value.js 0.13.0 (already pinned) — NO sibling publish gate.** `color2(c,
  "oklch")` returns the oklch `{l, c, h}` channels and `COLOR_SPACE_RANGES.oklch`
  carries the CSS denormalization (`c ∈ [0, 0.5]`, `h ∈ [0, 360]`) — both
  live-verified 2026-06-17 (audit evidence table). The oklab path already consumes
  these for `color2(c, "oklab")` + `COLOR_SPACE_RANGES.oklab`
  (`compile-color.ts:25-44,62-72`); `colorToOklchCSS` is the symmetric twin over the
  oklch members. No O ask blocks this wave (lane-02 §6 CC-7: "no sibling dependency,
  no new value.js API required").
- **No sibling dep.** Pure kf-internal `compile-color.ts` (new `colorToOklchCSS` +
  `channelMidpointOklch` + the `space` dispatch + the `DensifyResult` shape change) +
  `compile.ts` (route `densify` through `keyframesBlock(…, bodyByStop)`) + the gate
  script + two fixtures + the behavior test. (The `color()`-wrapper-drop and the
  `transition`-shorthand-mirror gaps — lane-02 §3 Gaps A/B, DLL-26(d)/DLL-49 — are
  value.js-O-gated and EXCLUDED — see below.)
- **Composes with M.W1 (does NOT require it).** M.W1's report-all runner schedules
  `proof:compile-replay` as one node it no longer aborts the `&&` chain on; the
  iterate-to-green speedup compounds but is not owned here. M.W6 lands independently.
- **Parallel with M.W5 ∥ M.W7.** The three Band-B waves are value.js-0.13.0-sufficient
  kf-internal correctness fixes with no cross-wave file collision (M.W6 touches
  `compile-color.ts`/densify + the `compile.ts:397` densify-block consume site; M.W5
  touches `compile.ts`/`format.ts` `@property` export + `frame-compiler.ts` parse;
  M.W7 touches `walkSheet` ingest). The M.W5 ∥ M.W6 `compile.ts` edits are at
  DISJOINT sites — M.W5 prepends `@property` blocks in `compileChild`, M.W6 changes
  the `block =` densify selector at `compile.ts:395-399`; both touch `compileChild`
  but at non-overlapping statements, so the merge is mechanical.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 oklch emit | A `colorSpace: "oklch"` animation compiled via `compileToCSS` SILENTLY emits `oklab()` stops — the browser's oklab re-lerp diverges from the oklch curve (hue-around-the-wheel vs a/b-plane), `hueMethod` is lost, and the artifact is perceptually wrong despite a correct ΔE proof; the API accepts an option it does not honor end-to-end (⚠M2) |
| S2 non-color survival | A mixed color + non-color animation (`background-color` + `opacity`, the common fade-with-color-shift case) SILENTLY drops every non-color property through the densified block — the browser replays correct color with STATIC opacity, `eligible:true` masks the loss (⚠M3); the `keyframesBlock` projection authority is bypassed instead of overlaid |
| S3 gate extension | `proof:compile-replay` relapses to reading the ΔE proof ONLY and goes BLIND to the emitted color SPACE and non-color SURVIVAL — the exact inv-M-observable-truth failure the tranche is named to cure (the math is right, the emitted CSS is wrong) |
| S4 ramp hoist | The 1024-stop reference ramp is recomputed `N-1×` per segment in the inner ΔE loop where once suffices — an `O(N × 1024)` compile-time waste folded while the loop is already being edited for the `space` dispatch (no observable change; verified by the ΔE clauses staying GREEN) |

---

## Excluded from this wave

- **The `color()` CSS-function round-trip asymmetry (lane-02 §3 Gap A, DLL-26(d)).**
  value.js 0.13.0's `colorFunction` serializer DROPS the `color(srgb …)` wrapper
  (`parseCSSValue("color(srgb 0.5 0.3 0.7)").toString()` → `"rgb(127.5 76.5 178.5)"`,
  live-probed) — a `color(display-p3 …)` keyframe cannot round-trip through the
  densify because the space is lost at ingest. This is an UPSTREAM value.js defect
  with NO kf band-aid available (the information is gone before the compile path sees
  it); it is value.js-O-gated (consume on 0.14.0 + a born-RED `proof:replay-equality`
  fixture), NOT this wave.
- **The `transition`-shorthand mirror (lane-02 §3 Gap B, DLL-49).** value.js 0.13.0
  has `reverseAnimationShorthand` but NO `reverseTransitionShorthand`
  (`grep "(parse|reverse)TransitionShorthand"` → 0); a `transition` property cannot
  compile back to CSS. value.js-O-gated (consume on the pair's publish), NOT this
  wave.
- **The `@property` compile-artifact emit + the named-selector NaN-frame throw** —
  M.W5 scope (⚠M1). M.W6 touches the densify emit + the `bodyByStop` consume only,
  NOT the `@property` prefix or the `frame-compiler.ts` parse seam.
- **The cross-depth sibling-linkage ingest gap** (`@media{@keyframes}` + top-level
  `.foo{animation}`) — M.W7 scope. Out of this wave.
