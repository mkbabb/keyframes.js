# a25 — test/ structure + coverage post-R

## Executive summary

Tranche R never touched `test/` structure — and never claimed to. `R.md` and all
of `R.W0..W8` are silent on test organization; the only test-directory edits in
the `a15cd48..18e8617` range are mechanical path retargeting for gates and
call-sites that moved (`b52ad3e`, `81a5114`, `9f6576d`, `8e2fde1`, `c81b9fc`).
`docs/tranches/R/waves/R.W7.md:114` even re-blesses the flat `test/` line
(`test/  # Vitest suites (jsdom)`) in the README rewrite, so the flatness is not
an oversight — R's authors looked directly at it and left it alone. That is a
legitimate scoping call for a "surgical refactor of `src/`" tranche, but it means
**the R closure claim of a clean 7-zone partition is a `src/`-only claim**; the
test suite is unpartitioned and its naming convention (wave/gate-lineage, e.g.
`F.W7`, `K.W10`, `G.W16`) is now the *only* map from 97 flat files to the zones
R just built. `vitest.config.ts:29` (`include: ["test/*.ts"]`) is flat by
construction — a zone-colocated `test/<zone>/__tests__/*.test.ts` layout is not
even reachable without a config edit, so any future "colocate tests near src"
instinct will silently no-op until someone notices the glob.

The coverage census turned up one real, material gap and one structural
(not correctness) risk, not a wide field of holes:

- **5 of 8 fused demo scenes have zero direct composable tests** (cube, morph,
  motion-path, sequence, square — 15 composable files with no test importing
  them). This is a direct, attributable consequence of R.W5 (scene fusion):
  the wave relocated composables into `demo/scenes/<name>/` and never asked
  "does this scene have a test," and R.W7's closing README rewrite didn't
  either.
- Zone-level lib coverage (`resolve/`, `ingest/`, `scroll/`) is **thin in file
  count but not thin in substance** — each zone has exactly 1-3 test files
  directly importing it, but those files are large (168-548 lines) and the
  zones' internal helpers (`resolve/env.ts`'s `ResolveContext`,
  `compile/backward.ts`'s `compileToCSS`) are exercised transitively through
  the zone's own barrel. Initial greps flagged these as gaps; deeper reads
  retracted the finding — the "1 test file per zone" pattern is honest
  integration testing, not neglect. Flagging this explicitly so Tranche S
  doesn't re-discover and re-litigate the same false positive.

No pre-R stale path references survive — every `../src/animation/<zone>`
import in `test/*.ts` resolves against R's actual post-partition tree
(`adapter`, `animate`, `compile`, `constants`, `easing`, `engine`, `group`,
`index`, `ingest`, `presets`, `resolve`, `scroll`, `validate`, `waapi` — all
real). `test/stubs/` holds exactly one stub (`glass-ui-motion-core.ts`) and it
is well-disciplined: typed against the real package's exported signatures so a
contract drift reds typecheck, not just the mock.

## Findings

### F1 — 5 of 8 fused demo scenes carry zero direct test coverage (SEVERITY: high)

R.W5 fused per-scene composables into `demo/scenes/<name>/` (amiga, cube,
easing, morph, motion-path, sequence, spring, square — per
`CLAUDE.md`'s Project Tree and confirmed via `ls demo/scenes/`). Grepping
`test/*.ts` for `demo/scenes/` imports finds only:

```
test/amiga-sphere-spin.test.ts    → demo/scenes/amiga/useSphereSpin
test/easing-trace-smear.test.ts   → demo/scenes/easing/useEasingTraceSmear
test/scene-contract-identity.test.ts → demo/scenes/easing/useEasingDemo
test/scene-raf-leak.test.ts       → demo/scenes/easing/useEasingDemo, demo/scenes/spring/useSpringDemo
```

That's 3 of 8 scenes (amiga, easing, spring) with any direct composable test.
The other 5 have zero:

| scene | composables with no test | 
|---|---|
| cube | `useCubeAnimations.ts`, `useCubeRelit.ts` |
| morph | `useMorphDemo.ts`, `morphKeys.ts`, `morphShapes.ts` |
| motion-path | `useMotionPathDemo.ts`, `useMotionPathGesture.ts`, `motionPathKeys.ts`, `motionPathGeometry.ts` |
| sequence | `useSequenceInstrument.ts`, `useSequenceDemo.ts`, `sequenceKeys.ts` |
| square | `useSquareAnimations.ts`, `useSquareKeyboard.ts`, `squareKeys.ts` |

`test/iw0-cube-composite.test.ts` looks like cube coverage by name but only
imports `CSSKeyframesAnimation`/`AnimationGroup`/`ValueUnit` from `src/` — it
is a lib-level test with a cube-flavored fixture, not a test of
`demo/scenes/cube/*`. Same false-positive risk for anyone name-matching
instead of import-matching this census in future.

**Attribution:** this is squarely R.W5's residue. `docs/tranches/R/waves/R.W5.md`
(`grep -n -i test`) has exactly one hit and it is unrelated ("Plant test" in a
gate-plan template line 351) — the wave plan never asked the coverage
question for the composables it was relocating/creating. `R.W7`'s README
rewrite (`R.W7.md:88-132`) replaced the stale file-by-file README tree with a
10-line pointer but likewise never touched `test/`.

**Proposal (Tranche S):** a wave that adds `useCubeAnimations`/`useMorphDemo`/
`useMotionPathDemo`/`useSequenceDemo`/`useSquareAnimations` composable tests
mirroring the shape of `scene-raf-leak.test.ts` / `scene-contract-identity.test.ts`
(the two tests that already prove the scene-machine contract pattern) — or, if
the judgment is that per-scene composable logic is thin enough to be exercised
adequately through `scene-contract-identity.test.ts`'s scene-machine
integration alone, say so explicitly in the wave doc and CLAUDE.md, rather than
leaving it silently absent.

### F2 — `test/` is unpartitioned; zone-colocation is not reachable without a `vitest.config.ts` edit (SEVERITY: medium)

`vitest.config.ts:12` sets `include: ["test/*.ts"]` — a single-level glob. A
`test/<zone>/foo.test.ts` or `src/animation/<zone>/__tests__/foo.test.ts` file
would silently never run under `npm test` today. This makes "colocate tests
per zone" (a stated Tranche S ambition per the mission brief: "deeper
sub-zoning of library zones") a two-step move — config first, files second —
and a silent footgun if done files-first. Given R just built 7
`src/animation/<zone>/index.ts` barrels and 97 test files still import via
`../src/animation/<zone>` (flat, zone-name-qualified but not zone-colocated),
the natural next move is visible but currently blocked by this glob.

**Proposal:** either (a) widen the glob to `test/**/*.test.ts` and physically
regroup the 97 files into `test/<zone>/` mirroring `src/animation/<zone>/`
(engine, group, compile, resolve, ingest, scroll, physics, orchestration, svg,
presets) plus `test/demo/` for the 14 demo-touching files, or (b) explicitly
keep `test/` flat as a deliberate "gate ledger" (each file's wave-lineage
comment IS its provenance) and say so in `CLAUDE.md`'s test/ line instead of
the current bare `# Vitest (jsdom)` one-liner. Either is defensible; the
current state — flat, unstated, glob-locked — is neither chosen.

### F3 — test file naming is wave/gate-lineage, not zone-mapped; the CLAUDE.md census note is already stale in spirit (SEVERITY: low)

`CLAUDE.md`'s `test/` line reads: `Count: ls test/*.test.ts | wc -l` files,
`npx vitest list | wc -l` tests (97 files / 957 tests at the Q 5.0.0 close —
derive, don't trust a frozen number)`. That self-aware "derive, don't trust"
caveat is honest, but it also concedes the file inventory has no durable
zone-mapping: names like `roundtrip-easing.test.ts` (holds `F.W7`, `G.W4`,
`L.W9` describe blocks — three different tranche waves in one file, per
`test/roundtrip-easing.test.ts:56,93,137,162`), `compile-roundtrip.test.ts`
(holds `K.W10` clauses a-d plus an `L.W2` describe at line 424), and
`orbital-inertia-parity.test.ts`/`orbital-rotate3d.test.ts` (physics zone,
named for a since-renamed demo feature) require reading the file, not the
name, to know what src zone(s) it exercises. This is not miscoverage — the
grep census (physics: 22 files, engine: 56, group: 19, compile: 15,
orchestration: 13 — see Evidence) shows real, broad coverage — but the
navigability is wave-archaeological, not zone-navigable. A newcomer (or an
agent) asking "what tests engine/composition.ts" has to grep imports, not
read filenames.

**Proposal:** no urgent fix, but if F2's colocation move happens, this
resolves for free — the directory IS the zone map, and describe-block wave
tags stay as in-file provenance comments (their genuine value: they record
*why* an assertion exists, which a path can't).

### F4 — no correctness gaps found in `resolve/`, `ingest/`, `scroll/` direct coverage (SEVERITY: info — closing a false lead)

Initial grep suggested `resolve/`, `ingest/`, `scroll/` each have only 1 test
file directly importing them (`emerging-css-resolve-now.test.ts`,
`ingest.test.ts`, `scroll-scene.test.ts` respectively — plus
`emerging-css-resolve-fn.test.ts`/`-p2.test.ts` importing the zone
transitively via `CSSKeyframesAnimation`). On inspection these are large,
multi-describe suites (168-548 lines) exercising the zones' full public
surface including internals (`resolve/env.ts`'s `ResolveContext`/
`makeResolveContext`, `compile/backward.ts`'s `compileToCSS`) through their
barrels. This is legitimate integration-style coverage, not a gap. Recorded
here only so a future audit pass doesn't re-flag it from the same grep
heuristic — file-count-per-zone is a weak signal on its own; line count and
describe-block count are needed to disambiguate "thin" from "consolidated."

### F5 — `test/stubs/` is minimal and disciplined; no finding (SEVERITY: info)

Exactly one file, `test/stubs/glass-ui-motion-core.ts` (36 lines). It types
each export against the real `@mkbabb/glass-ui/motion-core` signatures
(`typeof RealSupportsViewTransitions`/`typeof RealStartViewTransition`) so a
contract drift breaks typecheck, not just silently diverges — and its header
comment documents *why* it exists (library gate is glass-ui-free per inv β;
demo composables pull glass-ui transitively) and explicitly records a past
drift it corrected (a phantom `_options?: {types}` param that never shipped).
This is the right shape for a stub file; nothing to fix.

### F6 — no stale pre-R import paths found (SEVERITY: info)

Every `../src/animation/<name>` import across `test/*.ts` resolves to a real
post-R path: `adapter`, `animate`, `compile`, `constants`, `easing`, `engine`,
`group`, `index`, `ingest`, `presets`, `resolve`, `scroll`, `validate`,
`waapi` (verified via `ls src/animation/`). `animate.ts` still exists as a
deliberate top-level (non-zoned) file per `CLAUDE.md`'s own tree
(`animate.ts # animate() — single-call front door...`), so
`animate-orchestration.test.ts`/`animate.test.ts` importing it directly is
correct, not stale — the earlier commit-log line "animate() EXCISED" (in the
MEMORY.md Tranche R summary) refers to the bench `engine.animate` call
excision noted in `1f7d323`, a different surface, not this file.

## Evidence paths

- `vitest.config.ts:12` — `include: ["test/*.ts"]` (flat glob)
- `docs/tranches/R/waves/R.W7.md:88-114` — README rewrite keeps `test/` as
  one flat pointer line, no zone claim
- `docs/tranches/R/waves/R.W5.md` — zero test-coverage discussion for scene
  fusion (`grep -n -i test` → one unrelated template-line hit at :351)
- commits touching `test/` in range: `b52ad3e`, `81a5114`, `9f6576d`,
  `8e2fde1`, `c81b9fc` (all path-retargeting, no restructuring)
- `demo/scenes/{cube,morph,motion-path,sequence,square}/*.ts` — 15
  composable files, zero direct test importers (checked via
  `grep -l "demo/scenes/" test/*.ts`)
- `test/roundtrip-easing.test.ts:56,93,137,162` — one file, four
  tranche-wave-tagged describe blocks (F.W7/G.W4/F.W7/L.W9)
- `test/compile-roundtrip.test.ts:124,218,250,329,391,424` — one file, six
  wave-tagged describe blocks (K.W10 a-d + L.W2)
- `test/stubs/glass-ui-motion-core.ts` — sole stub, typed against real
  package signatures

## Tranche-S implications

1. **Wave: demo-scene test parity.** Add composable tests for
   `useCubeAnimations`/`useCubeRelit`, `useMorphDemo`, `useMotionPathDemo`/
   `useMotionPathGesture`, `useSequenceDemo`/`useSequenceInstrument`,
   `useSquareAnimations`/`useSquareKeyboard` — mirror the pattern already
   proven in `scene-raf-leak.test.ts` / `scene-contract-identity.test.ts`
   (RAF-leak + scene-machine-contract shape). This is the one concrete,
   attributable coverage debt R left behind (F1).
2. **Wave: decide and execute test colocation.** Given the mission brief
   already calls for deeper `src/` sub-zoning (`compile/backward/`,
   `compile/easing/`, `engine/css/`), pair it with a `test/<zone>/` regroup +
   `vitest.config.ts` glob widen (F2) — do this AS the sub-zoning wave, not
   after, so the two moves land as one coherent rename rather than two
   diffs touching the same files.
3. **If colocation is deferred:** at minimum fix the `CLAUDE.md` `test/`
   tree line to state the flat-by-design rationale explicitly (gate-ledger
   provenance via wave-tagged describe blocks) instead of the current bare
   `# Vitest suites (jsdom)`, so the next audit doesn't have to re-derive
   that R's silence was a choice and not an oversight (F2, F3).
4. **No action needed** on `resolve/`/`ingest/`/`scroll/` direct-coverage
   file counts (F4), `test/stubs/` (F5), or import-path staleness (F6) —
   recorded here to close these leads for future audits, not to spawn work.
