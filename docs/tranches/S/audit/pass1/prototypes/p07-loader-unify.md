# p07-loader-unify — `loadAnimationEngine()` → `engine/public.ts` single-source probe

## 1. Question + spec assumption

SPEC-v1.md Q7 (§6, open questions): *"Does `loadAnimationEngine →
import("./engine/public")` preserve the chunk graph?"* — framed under S.B6
("Type surface + the `./engine` drift gate"), which proposes collapsing the
"triple hand-definition" (the `AnimationEngine` interface in `load-engine.ts`,
the manual `Promise.all([...11 imports]).then(Object.assign(...))` merge in
`load-engine.ts`, and the `engine/public.ts` composition barrel used by the
static `./engine` subpath) by rewriting `loadAnimationEngine()` to source from
`engine/public.ts` directly — closing the a08 finding that "the 39-key mirror
is not drift-proof."

SPEC's own SUCCESS/FAILURE framing (verbatim): *"SUCCESS: 39-key runtime
equality; proof:boundary green; light graph untouched; the lazy waterfall's
chunk count/size within tolerance (measure — a single fatter chunk may be
acceptable; record the number for the owner). FAILURE: light-entry pulls any
heavy chunk → keep the Promise.all mirror and rely on the B6 drift gate
alone."*

## 2. What I actually did

Worktree: `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_f9faf42c-6b8-7`
(branch `worktree-wf_f9faf42c-6b8-7`, off `tranche-s-dev`). Symlinked
`node_modules` from main tree first. No commits, no branch switches.

1. **Baseline build** (`npm run build`, exit 0) — captured `dist/` shape:
   23 `.js` chunks, total JS bytes = **145,756**, total dist (incl. `.d.ts`) =
   596K. Named lazy chunks present: `motion-path-*`, `draw-svg-*`,
   `morph-svg-*`, `ingest-*`, `scroll-*`, `compile-*`, `validate-*`,
   `presets-*`, `format-*`, `parse-flatten-*`, `scheduler-*`, `group-*`,
   `engine-*` (×2), `grammar-*`, `animation-*`, `delegation-*`,
   `easing-registry-*` (×2), plus `engine/index.js` (1.83 kB — thin barrel),
   `keyframes.js`, `sequence-*`.
2. **Baseline `proof:boundary`** (`node scripts/proof-boundary.mjs`, exit 0):
   `loadAnimationEngine static:2 value.js:0 engine:0 dynamic-chunks:21` /
   `dynamic engine chunks: 2 (static engine edges: 0, value.js: 0)`.
3. **Trial edit** — `src/animation/load-engine.ts`: replaced the
   `Promise.all([11 × import(...)]).then(([...]) => Object.assign({...42-key
   manual merge...}, engine))` body with:
   ```ts
   let _engineMod: Promise<typeof import("./engine/public")> | null = null;
   const importEngine = (): Promise<typeof import("./engine/public")> =>
       (_engineMod ??= import("./engine/public"));
   let _enginePromise: Promise<AnimationEngine> | null = null;
   export const loadAnimationEngine = (): Promise<AnimationEngine> =>
       (_enginePromise ??= importEngine() as unknown as Promise<AnimationEngine>);
   ```
   The `AnimationEngine` interface (the hand-written type mirror, ~90 lines)
   was left in place — the SPEC's B6 targets it separately (`typeof import`
   can't back API-Extractor's `.d.ts` roll-up per the file's own header
   comment on `AnimationEngine`), so only the RUNTIME merge collapses here.
   Diff: `1 file changed, 12 insertions(+), 112 deletions(-)` (net −100
   lines).
4. **`npm run check:lib`** (exit 0 after fixing a duplicate `_engineMod`
   declaration left over from the original block comment — one `Edit` pass).
5. **Trial build** (`npm run build`, exit 0) — captured `dist/` shape.
6. **Trial `proof:boundary`** (exit 0).
7. **Test suite**: `npx vitest run test` on both baseline (via `git stash`)
   and trial — **identical result both times**: `8 failed | 89 passed (97)
   files`, `912 passed | 2 expected fail | 1 skipped (915) tests`. The 8
   failures are a pre-existing worktree-only `@mkbabb/keyframes.js`
   self-alias resolution error (`demo/@/utils/kfEngine.ts` etc. can't resolve
   the package from source in this isolated worktree) — reproduced
   byte-identically on `git stash` (unmodified tree), confirming it is NOT
   caused by the trial change.
8. **Runtime 39-key equality check** — built `dist/keyframes.js` +
   `dist/engine/index.js`, ran both `loadAnimationEngine()` and a static
   `import("./dist/engine/index.js")`, diffed `Object.keys()`:
   `loadAnimationEngine keys: 39` / `engine/public keys: 39` / `only in
   loadAnimationEngine: []` / `only in engine/public: []` — **exact set
   equality**, zero drift.

## 3. Findings (file:line evidence)

- **Chunk graph does NOT survive as separate named chunks — it collapses to
  ONE.** Before: `src/animation/load-engine.ts:249-287` (baseline) issued 11
  distinct `import("./…")` calls inside the `Promise.all`, each landing in its
  own physical rollup chunk (`motion-path-pQVbamWT.js`, `draw-svg-GURj9nin.js`,
  `morph-svg-BToeumw5.js`, `ingest-S5hUe20K.js`, `scroll-CxpYFO4u.js`,
  `compile-CcSUwM8R.js`, `validate-DDeGnvSt.js`, `presets-BG2Fczzq.js`,
  `format-C-Gi9r7L.js`, `parse-flatten-ZZUSEQEL.js`, `scheduler-CUtVnuoU.js`,
  plus the engine core itself split across `engine-DrBtsKaf.js` /
  `engine-DEVgCTUy.js` / `animation-BGyzfzBq.js` / `group-vJcsHKN9.js` /
  `grammar-BLucehC4.js` / `delegation-DWwr4IXr.js`). After the trial edit, the
  ONE `import("./engine/public")` resolves to the exact same module the
  static `engine/index` build entry (`vite.config.ts:482-485`) already
  targets, so Rolldown dedupes both into a single shared chunk:
  `dist/engine/index.js` (97.32 kB, gzip 27.80 kB) is now the ENTIRE heavy
  surface — 5 total `.js` files in `dist/` (down from 23).
- **This is the SUCCESS branch per SPEC's own escape hatch** ("a single
  fatter chunk may be acceptable; record the number for the owner") — no
  DIVISION of concerns is lost at runtime because `loadAnimationEngine()`
  already `Promise.all`-awaited every one of those 11 imports UP FRONT before
  the trial (`load-engine.ts:243` baseline) — there was no per-symbol lazy
  code-splitting to begin with; a caller reaching for `MotionPath` alone still
  paid for `ingest`/`scroll`/`compile`/`validate`/`presets` too, both before
  and after. Consolidating to one HTTP chunk is a plausible *improvement*
  (fewer round trips), not a regression, for the actual `loadAnimationEngine()`
  call pattern.
- **Total JS bytes shrank ~6%**: 145,756 → 136,939 bytes (uncompressed source
  size summed across all chunks, both measured the same way). The shrinkage
  is from eliminating 20 individual chunk-wrapper/import-map overheads folded
  into one file. `.d.ts` bytes are UNCHANGED (348,731 bytes both runs) —
  expected, since `vite.config.ts:50` already points the `engine/index.d.ts`
  roll-up at `engine/public.ts`, so B6's dts half was already done; only the
  JS *runtime* merge was still hand-written.
- **`proof:boundary` (`scripts/proof-boundary.mjs`) passes unchanged** on both
  builds and does NOT assert a specific chunk count — it asserts (a) every
  LIGHT barrel entry carries zero static value.js/engine edges (unaffected —
  `load-engine.ts` only touches the loader, not the barrel) and (b)
  `loadAnimationEngine`/`warmEngine` emit "1+ non-entry dynamic engine chunk."
  Baseline: `dynamic engine chunks: 2`. Trial: `dynamic engine chunks: 1`. The
  gate's own wording never hardcodes ≥N; a single dynamic chunk still
  satisfies it. Confirmed via direct run: `node scripts/proof-boundary.mjs`
  exit 0 both times (full PASS banner both times).
- **39-key runtime equality holds exactly** — `Object.keys(await
  loadAnimationEngine())` and `Object.keys(await import("./dist/engine/index.js"))`
  are set-equal (39/39, zero-diff both directions) after the trial. Before the
  trial this equality was NEVER guaranteed by construction — it held only
  because a human kept two independently-hand-written lists (the
  `Object.assign` merge in `load-engine.ts` and the `export {...}` list in
  `engine/public.ts`) in sync by discipline; the a08 finding is exactly that
  this is not drift-proof.
- **`AnimationEngine` interface is now VESTIGIAL relative to its former job**:
  it is still needed as the `.d.ts`-emittable TYPE surface (the file's own
  comment explains `typeof import()` can't be used because API-Extractor
  can't resolve a `typeof import()` node pointing at an internal module) —
  but it no longer drives the runtime merge, so a key added to
  `engine/public.ts` and NOT added to `AnimationEngine` now produces a
  **type-level** drift (missing autocomplete/type on a real runtime key)
  rather than the OLD failure mode (a runtime key silently absent). This is a
  strictly safer drift direction — B6's proposed
  `proof:engine-subpath-mirror` gate (born-RED: delete a `public.ts`
  re-export → RED) should assert `Object.keys(runtime) ⊆ keys(AnimationEngine
  type)` via a `.d.ts`-derived key list, catching the residual type-only
  drift.

## 4. VERDICT: confirms-spec

The SPEC's own Q7 SUCCESS criteria are met point-for-point: 39-key runtime
equality (exact), `proof:boundary` green (both directions), light graph
untouched (barrel `index.ts` was not touched at all — 0 diff), and the lazy
waterfall's chunk count/size is "within tolerance" under the SPEC's explicit
escape clause — one fatter chunk (97 kB) replacing 20 smaller ones, net
smaller total bytes (145,756 → 136,939, −6%), with the FAILURE condition
("light-entry pulls any heavy chunk") never triggered.

**Adjustment to spell out for the real wave (S.B6):** none required to the
plan's shape — Q7 is answered SUCCESS as written. Two refinements worth
folding into B6's task text:
1. Record the concrete chunk-count change (23→5 total `.js` files;
   `loadAnimationEngine`'s "dynamic engine chunks" drops from 2 to 1) so the
   owner isn't surprised by the collapse when it lands — SPEC already
   anticipated this ("record the number for the owner"); this probe supplies
   the number.
2. `proof:engine-subpath-mirror` (the B6-proposed gate) should diff against
   the `AnimationEngine` TYPE's key list (derivable from the built
   `dist/keyframes.d.ts` or by parsing the interface AST), not just the two
   runtime `Object.keys()` sets — post-unification the only remaining drift
   surface is `engine/public.ts` exports ⊄ `AnimationEngine` interface
   fields, which a pure runtime-vs-runtime diff can't see (both would already
   read 39/39 from the SAME import).

## 5. Implementation-cost estimate for the real wave

- **Files touched**: `src/animation/load-engine.ts` (the `~124`-line
  collapse demonstrated here, minus the leftover duplicate-declaration
  cleanup which was a probe-only artifact of my edit sequence, not an
  inherent cost). No changes needed to `vite.config.ts` (the `engine/index`
  entry already points at `engine/public.ts` — R.W4b, pre-existing), no
  changes to `engine/public.ts` itself, no changes to the LIGHT barrel
  (`index.ts`).
- **Gates affected**: `proof:boundary` (passes unchanged, verified both
  ways) — no gate edit needed. A NEW gate is B6's own ask
  (`proof:engine-subpath-mirror`), not a cost of THIS change; scope that to
  B6's own line item. `proof:published-surface` should be re-run for real
  (not done in this probe — it greps published docs/surface md against dist,
  independent of the loader's internal shape, low risk) before the real wave
  closes B6.
- **Risk**: LOW for the runtime-merge collapse itself — proven byte-for-byte
  key-equal, zero light-graph impact, test suite bit-identical pass/fail
  count before/after. The one real risk surface is exactly what SPEC's
  FAILURE branch names — a future `engine/public.ts` edit that accidentally
  adds a STATIC (non-type) edge back into the LIGHT graph would now be
  caught by the EXISTING `proof:boundary` gate (it already asserts the light
  barrel's static value.js/engine edge count = 0, orthogonal to
  `load-engine.ts`'s internals) — no new exposure. Secondary minor risk: the
  single 97 kB chunk is less granular for a hypothetical FUTURE consumer that
  wants partial-engine code-splitting (e.g. MotionPath without ingest/scroll)
  — currently NO such consumer exists (`loadAnimationEngine()` always awaits
  the whole `Promise.all` set), so this is a foreclosed-optionality cost, not
  an active regression; worth one sentence in B6's writeup so a future tranche
  doesn't rediscover it by surprise.
- **Estimated effort**: ~30–45 min for a careful real-wave pass (the edit
  itself is mechanical — delete the 11-import `Promise.all` + `Object.assign`
  block, replace with the 6-line single-import version shown above), plus
  whatever B6 budgets for `proof:engine-subpath-mirror` (a new gate script,
  separately scoped).
