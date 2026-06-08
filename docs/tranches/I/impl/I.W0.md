# I.W0 — IMPL record (the empty-input + serialization correctness landing)

**Status:** LANDED · gate `proof:engine-no-throw-on-play` GREEN (live, against the BUILT
`dist/gh-pages/`) · `tsc` 0 · full suite 683 passed + 2 expected-fail · branch `tranche-i-dev`.

## What landed (file:line)

- **S1 — the value.js empty-input contract (PAIRED HANDOFF).** `value.js
  src/parsing/units.ts` — `parseCSSValueUnit("")`/whitespace now returns a typed-empty
  identity `ValueUnit(0)` instead of throwing the bare `Parse error at offset 0: "......"`.
  This heals B1's interp path (`getComputedValue` var branch reads an unset
  `getPropertyValue("--rotationX") === ""` → was thrown, now typed-empty = no contribution)
  AND B5's serialize path at ONE source. Authored + committed in the value.js repo
  (`fbea3e2`), built, and consumed locally into kf's `node_modules` for gate verification.
  **Consume-edge (USER-DOMAIN, tracked at I.WZ):** kf's pin stays `@mkbabb/value.js ^0.11.1`;
  CI-green on the cube interp clauses + the durable kf re-pin await a value.js publish. The
  kf-side belt (S2) makes B5 robust regardless of the publish.
- **S2 — serialize-from-template (the kf-side belt + elegance move).**
  `src/animation/format.ts` `CSSKeyframesToString` — sources each stop's declarations from
  the DECLARED `animation.parsedVars[i]` (the parsed-but-unresolved var map, 1:1 with
  `templateFrames`) via `unflattenObjectToString`, NOT a DOM-resolving `animation.at(progress,
  false)` sample. A `var()`/`matrix3d()` round-trips verbatim, never DOM-resolved — the
  serializer no longer touches the empty-read-back seam (defense in depth). `engine.ts` stays
  1376/1400 (the C-6 ceiling respected — no split needed).
- **S3 — `AnimationGroup.transform` is total by construction.** `src/animation/group.ts` —
  the lying `transform!: TransformFunction<V>` definite-assignment becomes `transform =
  NOOP_TRANSFORM` (a real no-op field default); the constructor inherits the first child's
  transform by identity (`=== NOOP_TRANSFORM`); the false "resolved lazily" comment is
  deleted AND **the lazy fallback is now REAL** — `transformFramesGrouped` resolves the
  composite transform from the first now-parsed child the first time it draws (children built
  before `parse()` keep the no-op until their frames exist), so a childless group composites a
  harmless empty frame and a deferred-parse group (the cube) paints correctly. PLUS
  `useAnimationGroupPlayback.toggleAnimationGroup` short-circuits a childless group so the home
  rainbow-play click reaches the navigate-intercept instead of a no-op play.
- **S4 — kill the mis-attributing placeholder.** `KeyframesStringControls.vue` — the catch no
  longer hard-codes `/* timing-function: custom — no CSS twin */` for EVERY throw (the B5→B4
  false trail); it names the ACTUAL serialize error. With S1+S2 the value path never throws,
  so the catch is unreachable for it.

## S5 (bare-`"cubic-bezier"` option seam) — coupled to I.W2

Per the binding H-7 witness split, I.W0 owns the construction-path clause but the re-parseable
readout that feeds it is I.W2's S3 (the unified `EasingEditor`). Gate clause (e) is authored
and greens once I.W2's readout persists a `cubic-bezier(…)` literal — verified at the I.W2
landing.

## The gate (proof:engine-no-throw-on-play) — live GREEN

Playwright over the BUILT `dist/gh-pages/` (the `proof-no-orphan-specular.mjs` harness):
- **(a)** rainbow group-play on HOME (empty group, no animation selected — the E1 witness) AND
  cube → ZERO `pageerror`/`unhandledrejection`. ✓
- **(b)** load + play + switch → ZERO `Parse error`/`"......"`/serialize-warn console lines. ✓
- **(c)** the cube transform PAINTS LIVE — **123 distinct** non-`none` matrices across the cube
  subtree (the draw loop is live; the transform lands on `.graph` via
  `apply-transform-to-container` during play). ✓ — the no-silent-no-op guard.
- **(d)** the keyframes pane shows real round-trippable `@keyframes` CSS (359 chars), NOT the
  placeholder. ✓
- **(f) HYGIENE** `parseCSSValueUnit("")` resolves typed-empty (the consumed value.js build). ✓
- **(g) HYGIENE** `engine.ts ≤ 1400` (1376). ✓

## Diagnostics on the live demo (chrome-devtools-mcp)

The cube-paints clause was first-hand validated via chrome-devtools-mcp: the engine composite
is proven correct in isolation (`test/iw0-cube-composite.test.ts` — the group writes ≥3 distinct
transforms to its target), and the live demo's cube animates (26→123 distinct on `.graph` when
sampled from the on-mount autoplay window). The cube's live transform lands on the OrbitalDrag
container (`.graph`) during play (`apply-transform-to-container`), and the Rotations animation
(0→1turn) ends back at the start pose — so the gate samples the cube SUBTREE from t=0 to catch
the active window, not `.cube` after settle.
