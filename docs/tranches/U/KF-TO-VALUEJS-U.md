# KF → value.js — Tranche U consume-edge letter

**From:** keyframes.js Tranche U
**To:** `@mkbabb/value.js` (its active tranche; upstream-owned work only)
**Issued:** 2026-07-12
**Status:** Drafted coordination contract; no value.js implementation is authorized in this repository.

This letter supersedes the Tranche-T letter at
`docs/tranches/T/KF-TO-VALUEJS-T.md`. It is a consume-edge document. The kf
side may re-point imports, update its pin, and consume a published upstream
surface; it does not implement, fork, or patch value.js internals. The sibling
tranche owns every ask below.

## Current witnessed package facts

The current kf declaration is `"@mkbabb/value.js": "^3.1.0"`. The installed
package is `@mkbabb/value.js@3.1.0` (the lockfile resolves the same tarball), and
its only runtime dependency is `@mkbabb/parse-that@^1.0.0`; it has an optional
`prettier@^3.0.0` peer. These facts were read from the local package manifest,
`package-lock.json`, and `node_modules/@mkbabb/value.js/package.json` on the
issue date.

The published `exports` table has exactly eight entries: the root `.` and
seven subpaths. There is no `./root` entry.

| Export | Local declaration target | Contract use |
| --- | --- | --- |
| `.` | `dist/value.js`, `dist/index.d.ts` | root-only helpers whose home is not a narrower export (for example `sleep` and `parseCSSTime`, subject to verification at each consume) |
| `./color` | `dist/subpaths/color.js` | color models, ranges, normalization, ramp/gamut operations |
| `./easing` | `dist/subpaths/easing.js` | easing functions, CSS cubic/steps/linear helpers, `bezierPresets`, resolver/parser surface |
| `./parsing` | `dist/subpaths/parsing.js` | CSS values, stylesheet parsing, flattening, diagnostics, syntax and serialization |
| `./transform` | `dist/subpaths/transform.js` | `PathGeometry`, path sampling, matrix decomposition |
| `./units` | `dist/subpaths/units.js` | `ValueUnit`, `FunctionValue`, unit constants and unit/object utilities |
| `./math` | `dist/subpaths/math.js` | `clamp`, `scale`, `lerp`, `lerpArray`, interpolation and geometry math |
| `./quantize` | `dist/subpaths/quantize.js` | `quantizePixels`, `dominantColor` |

The subpath declarations were inspected directly. In particular, `./easing`
currently exports `resolveEasing` and `resolveEasingFunction` but does **not**
yet export the unified `parseTimingFunction` requested below; `./parsing`
currently exports `parseCSSStylesheet`, `parseCSSSubValue`, and the
`ParseDiagnostic`/`OnParseError` types; `./transform` exports `PathGeometry`,
`getTotalLength`, and `getPointAtLength`; and `./units` exports
`COMPUTED_UNITS`, `flattenObject`, and `unflattenObject`.

The root and `./parsing` declarations still export the type
`PropertyDescriptor`. KF-7 therefore remains open: the current published name
still collides with the DOM global and can surface as
`PropertyDescriptor_2` in kf's rolled-up declaration.

## §A — Frozen consume contract

The following is the load-bearing contract for kf's HEAVY surface. A removed,
renamed, or moved export is a breaking change to kf even when the root barrel
continues to compile.

1. Keep the eight-entry table above stable and keep symbol membership additive.
   The seven subpaths are the canonical import homes. kf is transposing its
   HEAVY edge onto the narrowest home; the existing
   `src/animation/internal/leaves.ts` → `@mkbabb/value.js/math` import is the
   reference idiom. The LIGHT/HEAVY boundary remains unchanged: no LIGHT module
   gains a grammar-bearing value.js edge.
2. Keep `./color`, `./easing`, `./units`, `./transform`, and `./math` free of
   parse-that grammar reachability. This is a measured chunk contract, not an
   assumption: kf's boundary/chunk proofs will re-check the published graph.
3. Preserve the `ValueUnit` boxing behavior currently observed at the
   unflatten seam (a unitless authored number can arrive as a one-element
   `ValueUnit[]`) until the authored-plain decision in §C is resolved.
4. Preserve the fixed 2.0.x `@function` parameter grammar and
   clone-preserved `ValueUnit.fnName` provenance. Kf's old recovery apparatus is
   deleted and must not be reintroduced.
5. Preserve the `./transform` `PathGeometry` surface used by SVG morphing,
   including `sampleAtLength`/polyline behavior and the
   `getTotalLength`/`getPointAtLength` helpers.

## §B — Ask: one timing-function parser

Please add `parseTimingFunction(input: string): TimingFunction | Easing |
undefined` to `./easing`. It should own the complete, throwing-free dispatch:

- cubic-bezier literals;
- `steps(...)`, `step-start`, and `step-end`;
- `linear(...)`;
- registered timing-function names.

An unrecognized input returns `undefined`. Once a published value.js cut
contains this API, kf will delete `CUBIC_BEZIER_LITERAL`, the `STEPS_PREFIX` and
`LINEAR_PAREN_PREFIX` guards, and the four try/catch dispatch arms in
`src/animation/compile/easing-registry.ts`; `getTimingFunction` becomes a thin
normalization wrapper. No kf-side grammar fork is intended to survive.

## §C — Ask and binary decision: authored-plain unflatten

Please offer an `unflattenObject` option or sibling that returns authored-plain
values: a bare number for an authored unitless number, and a string where a
unit/color requires one, rather than array-boxed `ValueUnit[]` leaves. This
would let kf delete the per-frame projection in `plain-vars.ts` and its two hot
path callers (`engine/interpolate.ts` and `group/compositor.ts`).

This is a binary, not an indefinite workaround label:

- **If shipped:** kf consumes the API, removes the projection, and retires its
  workaround arm in the same witnessed re-pin.
- **If declined:** value.js must state that boxing is intentional; kf ratifies
  numbers-out as a permanent kf-owned public transform contract, removes the
  stale value.js-provenance framing, and stops tracking this as consume-edge
  debt.

Until that decision is witnessed, kf preserves the current adapter and does not
pretend it is upstream-fixed.

## §D — Diagnostics and unit-taxonomy asks

These asks are folded into this single letter from U.C10:

1. Provide a diagnostics-bearing parse API (`onParseError` on
   `parseCSSStylesheet`, or an `{ ast, diagnostics }` result) so kf can expose
   honest parse failure rather than a speculative scaffold. Kf has removed its
   un-fireable `PARSE_ERROR` producer; it awaits the upstream producer.
2. Provide semantic viewport/container tracking on `./units`, for example
   `VIEWPORT_LENGTH_UNITS` + `CONTAINER_LENGTH_UNITS` or
   `isLayoutTrackingUnit(unit)`. Kf can then derive WAAPI eligibility instead
   of maintaining `WAAPI_INELIGIBLE_UNITS` by hand.

## §E — KF-7 renewal

Rename the exported type `PropertyDescriptor` to `CSSPropertyDescriptor` in
the root and `./parsing` declarations, with no compatibility alias. The
collision-free name is required because the current name leaks as
`PropertyDescriptor_2` in kf's public declaration bundle. Kf will re-point its
imports in the same consume motion. The kf-side `proof:no-collision-rename`
tripwire remains born-RED until this upstream rename and the kf re-point both
land.

## §F — Pin and adoption discipline

The current `^3.1.0` declaration and installed `3.1.0` are a witnessed consume,
not permission for an unreviewed major float. During the sibling's active
tranche, every breaking cut must be tagged and consumed deliberately: value.js
publishes the cut and its export/behavior notes; kf verifies the package,
re-runs boundary and behavior proofs, then changes its declaration and lockfile
in a dedicated consume motion. No kf source change is made in anticipation of
an unpublished API.

## §G — Explicit non-asks and ring-fence

This letter requests no value.js-internal refactor, no parse-that work, no
grammar change beyond §B/§D, and no direct edit to the value.js checkout. The
parse-that edge is transitive-only (`value.js@3.1.0 → parse-that@^1.0.0`); kf
has no direct `@mkbabb/parse-that` import. Glass-ui is a separate sibling edge
and is not changed by this letter. All implementation, release, and migration
work belongs to the value.js or glass-ui tranche respectively.

## §H — Courtesy flag (not an ask)

The value.js demo appears to carry the same vestigial `demo/@/` shadcn alias
directory that U is dissolving in kf. The sibling may consider hoisting those
children while preserving alias spellings. This is a constellation note only;
it is not a kf deliverable or a value.js obligation.

## §I — D-GAP rows (complete set)

The convergence-loop dogfood census resolved the value.js capability gaps to
exactly these three rows. They are upstream capability asks, not demo defects;
the set is intentionally closed.

| ID | Capability gap | Current observable | Requested upstream posture |
| --- | --- | --- | --- |
| **D-GAP-1** | Quart/quint easing presets | `bezierPresets` has no quart/quint entries; the demo keeps hand-authored data | Add the presets to the canonical easing catalog, preserving existing names and behavior |
| **D-GAP-5** | Shallow/leaf-predicate object flattening | `flattenObject({ transform: { translateX, translateY }, opacity })` decomposes the composite; kf's `valueOf`-leaf guard remains | Add a shallow mode or `leafPredicate` so callers can retain intentional composite leaves |
| **D-GAP-6** | Bare path-data / optional flipped-coordinate bezier sampling | `cubicBezierToSVG(0.4, 0, 0.2, 1)` returns an element/full path in raw coordinates; kf needs bare sampled data and optional y-flip | Add a `sampleBezierPath`-style data sampler with explicit flip control, without changing the existing element helper |

D-GAP-2 is retired. D-GAP-3 and D-GAP-4 are accepted demo glue and are not
letter rows. No fourth gap is implied by this document.

## Deadlines and adoption ledger

Each ask below is a named, finite covenant. It is either absorbed by a
witnessed value.js release and consumed by kf, or expires at the stated cut and
kf records its own permanent posture. Nothing is allowed to become a silent,
perpetual tripwire or to ride into the next tranche without an owner decision.

| Covenant | Producer | Deadline / terminal action |
| --- | --- | --- |
| `parseTimingFunction` → delete `getTimingFunction` dispatcher | value.js `./easing` | At the next tagged value.js U cut; consume and retire the arm, or explicitly expire and retain the thinest justified kf dispatcher |
| Authored-plain unflatten → delete `plain-vars.ts` | value.js `./units` | At the next tagged cut; consume and remove both hot-path projections, or record the boxing-declined decision and ratify numbers-out as kf-owned |
| Diagnostics parse → honest parseability channel | value.js `./parsing` | At the next tagged cut; wire the producer or re-deadline once with an owner decision |
| Layout-tracking unit grouping → WAAPI derivation | value.js `./units` | At the next tagged cut; consume and derive eligibility or re-deadline once |
| KF-7 `PropertyDescriptor` rename | value.js root + `./parsing` | At the next tagged cut; consume the collision-free name and discharge `proof:no-collision-rename` or re-deadline explicitly |
| D-GAP-1/5/6 capabilities | value.js easing/units/math-transform owners | At the sibling tranche's U release review; each row is marked shipped, declined, or re-deadlined with evidence |

At each consume, kf records the exact package version, export map, tarball
identity, and gate/test evidence. No glass-ui 5.0.0 change is implied or
authorized here.
