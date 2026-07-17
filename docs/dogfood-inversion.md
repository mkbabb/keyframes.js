# The dogfood inversion (K.W12 ED-3) — disposition

The boundary-ORACLE at the **package** boundary: the demo consumes the PUBLISHED
`@mkbabb/keyframes.js` barrel, NOT `@src/animation/*` deep paths — so the running
storefront is the dynamic integration test of the exact surface a `npm i`
consumer reaches (the publish-boundary check made DYNAMIC).

## Status: LANDED (L.W8 S1) — the flip is COMPLETE

The inversion has **landed** at **L.W8 S1**: every demo file consumes the
published `@mkbabb/keyframes.js` barrel — **zero** `@src/animation/*` deep
imports. The tranche-local boundary witness recorded a zero-file census before
its command wrapper was retired. The
LIGHT named exports (`SpringProgress`, `RAFPlayback`, `stagger`, `decay`,
`Sequence`, …) are static barrel imports; the HEAVY surface
(`CSSKeyframesAnimation` / `AnimationGroup` / `presets` / the serialization +
compile helpers) is reached ONLY through the barrel's `loadAnimationEngine()`
dynamic accessor — the package boundary stays green (value.js never lands on the
LIGHT static barrel; the built demo keeps `engine-*`/`value-*` as separate lazy
chunks). The multi-scene app + playground WARM the engine once before mount
(`demo/kf-engine.ts`), so the scene-machine's synchronous heavy
construction reads the resolved surface without threading async through the
non-null control-suite prop contracts.

The L.W8 S1 flip also surfaced five HEAVY engine helpers the demo legitimately
needs onto `loadAnimationEngine()`'s return (`CSSKeyframesToString` /
`CSSKeyframesToStrings` / `formatCSSKeyframeString` / `transformTargetsStyle` /
`yieldToMain`) — documented in `docs/published-surface.md` and checked by
`proof:publish`. A type-resolution twin of the vite
self-alias (`tsconfig.json` `paths`) keeps TS and the bundler on ONE realm in
dev so the barrel-specifier types unify with the `loadAnimationEngine()` runtime.

### Historical disposition (the STAGED posture, pre-L.W8)

The text below is the original K.W12 STAGED disposition — retained as the record
of why the flip was gated on the **K.WZ** publish and the **Band-I** honesty
precondition before it could honestly land. The flip executed once the published
surface caught up; the seam it rode (the **self-alias**) is unchanged.

The inversion was **recorded** and its seam was **in place**, but the full flip
was **gated on K.WZ**. This was the honest version, not a punt — here is exactly why.

### Why the full flip cannot land before K.WZ

1. **The published barrel is 4.2.0 — it predates the K-tranche surface.** The
   demo now consumes K.W7–W11 surface through deep paths (`@src/animation/compile`,
   `@src/animation/scroll-scene`, the physics). `@mkbabb/keyframes.js@4.2.0` on
   npm now carries those exports (published from K.WZ onward through 6.0.0); the
   flip onto the published barrel is honest only AFTER that publish lands.

2. **The demo reaches engine INTERNALS the barrel does not export as values.**
   `grep -rhoE 'from "@src/animation/[a-z-]+"' demo/` shows the demo imports
   `group`, `constants`, `format`, `utils`, `animations`, `internal/scheduler`,
   `motion-path`, `compile`, `spring`, `playback`, … — many are NOT public named
   value exports of the barrel (the public heavy surface is
   `loadAnimationEngine()`, not the raw chunk; `format`/`utils`/`constants`/
   `internal/*` are non-public). Flipping the whole demo to the bare specifier
   TODAY would fail to build (those symbols are not on the barrel). The
   reconciliation — surfacing what the demo legitimately needs onto the public
   barrel, or routing it through `loadAnimationEngine()` — is co-requisite with
   the K.WZ republish, not a W12-local edit.

3. **The Band-I honesty precondition is satisfied** (the inversion's binding
   gate): Band I (K.W0–K.W4) repaired the demo — the cold path PLAYS
   post-K.W0 (the historical cold-entry witness was green), the panes are re-cut post-K.W4. So
   when the flip lands at K.WZ, it certifies a WORKING demo against its own
   package, never a broken one.

### What IS in place now (the safely-doable seam)

- **The dev-resolution substrate.** `vite.config.ts:152-156` self-aliases
  `@mkbabb/keyframes.js` → `src/animation/index.ts` (a documented contract-v2
  supersession for the registry-pin reason — the in-repo header at `:140-151`).
  So the moment a demo file WRITES the bare specifier, dev HMR resolves it to
  source UNTOUCHED, and a `npm i` consumer resolves it to the tarball. The seam
  the inversion rides is live; the inversion is the demo WRITING the public
  specifier over it.

- **The boundary oracle** was a tranche-local witness;
  it is not part of the public command surface.
  In the STAGED posture it: asserts the self-alias seam exists (the substrate is
  not removed), takes the deep-import CENSUS (the born-RED witness — the work the
  K.WZ flip closes), and asserts THIS disposition record is honest (it names the
  K.WZ gating + the Band-I precondition). When the K.WZ flip lands, the gate's
  clause (b) flips to the full assertion (zero `@src/animation/*` deep imports
  outside the `env.d.ts`/test seams) — the staged census becomes the bite.

### The flip, at K.WZ (the recipe)

1. K.WZ republishes the core library carrying the K.W7–W11 surface; the public
   barrel + `loadAnimationEngine()` carry every export the demo needs.
2. Reconcile the demo's deep imports: the light tier → the bare
   `@mkbabb/keyframes.js` named exports; the heavy tier (the
   `import { CSSKeyframesAnimation } from "@src/animation/engine"` sites) → the
   PUBLIC `loadAnimationEngine()` boundary (an `await` at mount, NOT the raw
   `engine.ts` chunk — a partial flip leaving the raw chunk is still the SOURCE
   boundary, forbidden).
3. Flip the tranche-local boundary witness from the staged census to the full
   zero-deep-import assertion; it then BITES on any `@src` regression.

## The boundary held

ED-3 does NOT edit the vite self-alias (the alias is the dev-resolution
substrate, not the inversion). It does NOT flip a still-broken demo (Band I
satisfied). It does NOT leave the heavy tier on the raw chunk (the K.WZ flip
routes it through `loadAnimationEngine()`). The inversion is the demo writing the
public SPECIFIER — staged here, completed at K.WZ.
