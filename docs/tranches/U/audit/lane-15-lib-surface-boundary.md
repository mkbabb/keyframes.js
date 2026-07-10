# Lane 15 — lib-surface-boundary

Tranche U development audit · READ-ONLY · keyframes.js @ 5.2.0 (post-T, `master`/`tranche-t-impl`)

Charter: the package surface — `index.ts`, `public.ts`, `load-engine.ts`, `easing.ts`,
`constants/`, `internal/`, `env.d.ts`; `package.json` `exports`; dist composition
(chunks, d.ts roll-up via API Extractor); the tsconfig family. Audit the two-in
LIGHT/HEAVY boundary's honesty and cost, tree-shakability, whether barrel discipline
fights or serves colocation, the ESM-only posture. Propose the U-era surface.

---

## Verdict in one line

The two-in boundary is *correct in intent and honest in outcome* — but its
implementation spells the HEAVY surface **five separate times** (three source sites +
two CLAUDE.md prose inventories), kept coherent only by a fleet of drift gates, with a
composition barrel (`public.ts`) that is *already the single source of truth the other
sites should collapse onto* — and the collapse is a **known, owner-deferred item** the
surface's own gate documents. Under U's "no more deferrals / no legacy / gestalt"
edict, the charter is to collapse the surface to ONE composition barrel and derive the
rest.

---

## The surface as it stands (evidence)

The HEAVY engine roster (`KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup`,
the SVG factories, the ingest/scroll/compile round-trip, validate/explain, the dogfood
helpers) is materialized in THREE source files:

1. **`load-engine.ts:131-226`** — the `AnimationEngine` interface, ~37 keys hand-spelled
   as `typeof X` with per-key JSDoc; then **`:265-379`** a `Promise.all` over 15 dynamic
   `import()`s + an `Object.assign` that re-lists ~30 keys a THIRD time inside the same file.
2. **`public.ts:48-169`** — the `./engine` subpath composition barrel: the same roster
   re-exported statically (`export * from "./engine"` + explicit `export { … }` per zone).
3. **`index.ts:159-310`** — the LIGHT barrel's `export type { … }` block re-declaring the
   heavy TYPES (so `import type { CSSKeyframesAnimation }` works off `.`), plus the
   value-level `export { loadAnimationEngine, warmEngine }`.

And a FOURTH + FIFTH time as prose: root `CLAUDE.md` "Library Entry Point" HEAVY list and
`src/animation/CLAUDE.md` "The value.js static/dynamic boundary" list.

The coherence of these five is not structural — it is *gated*: `proof:published-surface`
clause (d) diffs the hand-spelled interface against the built `Object.keys(engine)`;
`proof:engine-subpath-mirror` clause 2 diffs the subpath runtime keys against the interface
d.ts keys; `proof:claude-paths-live`, `proof:dts-rollups-agree`, `proof:in-is-importable`,
`proof:no-any-default`, `proof:alias-dropped` round out a ~8-gate surface-integrity belt.
Every new heavy front door = **5 hand-edits + a green run of ~8 gates**.

The provenance archaeology is dense: **53 tranche-tag comments** (`K.W8`, `K.W9`, `K.W10`,
`S.F1`, `S.F3`, `L.W6`, `L.W8`, `FLAGGED ADDITIVE EDIT`, …) across the three files
(index 20, load-engine 24, public 9). These narrate *how the surface grew wave by wave* —
they are exactly the "legacy code" (history embedded as comment) the owner's NO-LEGACY
edict targets.

---

## Findings

### F1 (critical) — The HEAVY surface is triplicated in source; `public.ts` already is the single source of truth the other two should collapse onto

**Evidence.** `load-engine.ts:265-379` composes the full heavy surface by hand
(`Promise.all([...15 imports...]).then(([...]) => Object.assign({...30 keys...}, engine))`.
`public.ts:48-169` composes the *same* surface statically. These are, by the code's own
admission (`public.ts:26-28`: "it MATCHES `load-engine.ts`'s `AnimationEngine` interface key
for key"), two hand-maintained rosters over the identical zone set. `proof:engine-subpath-mirror`'s
own header (`scripts/proof-engine-subpath-mirror.mjs:33-37`) names the cure and records it
as deferred: *"DECOUPLED FROM THE LOADER COLLAPSE … this gate ships WHETHER OR NOT the
owner-optional `loadAnimationEngine → import("./engine/public")` collapse ships."*

**Cost.** The `Object.assign(…, engine)` in `load-engine.ts` re-spreads keys that
`public.ts`'s `export * from "./engine"` already merges; the two lists drift-risk is real
enough that a dedicated gate exists solely to catch it.

**Proposal (gestalt).** Make `public.ts` the ONE composition barrel and collapse the
dynamic accessor onto it: `loadAnimationEngine = () => import("./public")` returning
`Promise<typeof import("./public")>`. This deletes the `Promise.all`/`Object.assign` hand-roster
(`load-engine.ts:265-379`) entirely — the subpath entry and the dynamic accessor become the
*same module reached two ways* (static import vs `await import`), which is what the "two-in"
was always meant to be. The runtime roster then lives in exactly one place. `warmEngine`
reduces to `void import("./public")`. This is the owner-deferred "loader collapse" — U folds it in.

### F2 (critical) — The `AnimationEngine` interface is a hand-maintained mirror of a runtime module, existing solely to route around an API-Extractor limitation

**Evidence.** `load-engine.ts:123-130` states the reason verbatim: *"Spelled as an explicit
interface (rather than `typeof import("./engine")`) because the dts roll-up — API Extractor —
cannot resolve a `typeof import()` type node that points at an internal module."*
`proof:published-surface` clause (d) (`scripts/proof-published-surface.mjs`) exists *only* to
diff this hand-spelled interface against the true runtime keys, because "a new `export const`
… is returned at RUNTIME by the `Object.assign` but silently absent from the TYPE." The
interface is thus a 37-key hand-copy of a module's shape, load-bearing enough to need its own
correctness oracle — the definition of legacy scaffolding.

**Proposal (gestalt).** The repo *already owns a bespoke API-Extractor pass* —
`engineDtsRollupPlugin()` in `vite.config.ts:38-183` runs Extractor over `public.ts` to emit
`dist/engine/index.d.ts`. The U-era surface should make that same pass emit the barrel's engine
TYPE from `public.ts`'s real shape, so the `.` d.ts references the generated
`typeof import("./public")`-equivalent instead of a hand-spelled interface. Then delete the
`AnimationEngine` interface and `proof:published-surface` clause (d) with it — the type becomes
DERIVED from the composition barrel, not hand-mirrored. If the tooling truly cannot, the
interface must at minimum be CODEGEN'd from `public.ts` (a `gen:*` step like the existing
`gen:agent-surface`), never hand-edited — but the generated-dts path is the honest cure.

### F3 (major) — `index.ts` re-declares the entire heavy TYPE surface, a third hand-list whose only job is `import type` ergonomics off `.`

**Evidence.** `index.ts:159-310` is ~150 lines of `export type { … } from "./engine" / "./group"
/ "./svg/*" / "./ingest" / "./scroll" / "./compile*" / "./validate"` — every heavy type re-exported
through the LIGHT barrel so a consumer keeps `import type { KeyframesAnimation } from
"@mkbabb/keyframes.js"`. Each block carries a paragraph explaining *why the runtime value is
NOT here but the type is* (e.g. `:277-283`, `:289-302`). This is a third hand-maintained heavy
roster, in a file whose stated job is the LIGHT surface.

**Proposal.** Once F1 lands (`public.ts` is the composition barrel), the heavy TYPE surface
should be re-exported from `.` in ONE line-group sourced from the composition barrel
(`export type * from "./public"` — types are erased, so no static value.js edge is introduced,
which `proof:boundary` already verifies file-by-file). The per-symbol explanatory paragraphs
collapse to one boundary note. `index.ts` shrinks to: the LIGHT value exports + one heavy
type re-export + the two dynamic accessors.

### F4 (major) — `constants/index.ts` is self-described "back-compat barrel"; under NO-LEGACY it is the legacy

**Evidence.** `constants/index.ts:1-16` — *"The back-compat barrel over the type/runtime split.
It preserves the EXACT import surface of the former monolithic `constants.ts`"*. 38 heavy
modules import `../constants` (the value.js-bearing barrel), 14 target `constants/types`
(measured). The barrel exists to spare the 38 heavy importers a specifier change when the S.B1
split happened — a back-compat convenience, not a structural need.

**Proposal.** Delete the back-compat framing. The barrel can survive only if re-justified as a
genuine zone barrel (constants IS a coherent zone: types + defaults), NOT as "preserves the old
specifier." Point the 38 heavy importers at `constants/defaults` (values) + `constants/types`
(types) explicitly, OR keep `constants/index.ts` but rewrite its charter comment to "the
constants zone barrel" with no "back-compat / former monolithic" language. The owner's edict is
that a shim preserved *because moving imports is work* is exactly the legacy to excise.

### F5 (major) — `warmEngine` + the granular-loader graveyard: dead-surface residue in the dynamic half

**Evidence.** `load-engine.ts:389-391` — `warmEngine = () => { void loadAnimationEngine(); }`,
a fire-and-forget warmer. Its own comment (`:381-388`) and `index.ts:305-309` both narrate that
the granular `loadEngine`/`loadCompiler`/`loadIngest` accessors + `EngineCore`/`CompilerSurface`/
`IngestSurface` types "were EXCISED in R.W1 (§2f — zero real call sites)". The excision comments
persist as tombstones in a live surface file. `warmEngine` itself is a one-liner wrapper that,
post-F1, is `void import("./public")`.

**Proposal.** Remove the excision-tombstone comments (they are changelog, not architecture — the
`docs/tranches/` record holds provenance). Keep `warmEngine` only if a real consumer calls it
(verify against the demo); if the demo warms via `loadAnimationEngine()` directly, `warmEngine`
is a speculative export and should go — the surface should carry only what a consumer uses.

### F6 (minor) — `env.d.ts` is demo-only ambient shim living at the library `src/` root, and CLAUDE.md points at the wrong path

**Evidence.** `src/env.d.ts` declares `*.vue`, `*.svg?component`, and `vite/client` — all
DEMO-only (the library ships no Vue/SVG). Root `CLAUDE.md`'s tree and the charter both list it as
`src/animation/env.d.ts`; it is actually at `src/env.d.ts` (measured). It is `include`d by
`tsconfig.json` (`src/` + `demo/`) but NOT by `tsconfig.lib.json` (`src/` only) — yet it sits
inside `src/`, so the lib type-check *does* see a Vue/SVG ambient module the library never uses.

**Proposal.** Move the demo ambient shims to `demo/env.d.ts` (colocation edict: demo tooling lives
with the demo). The library `src/` should carry NO Vue/`*.svg?component` declarations. Correct the
CLAUDE.md path drift as part of the same move. This also purifies `tsconfig.lib.json`'s graph.

### F7 (minor) — `package.json` `exports` duplicates each condition three ways; ESM-only posture is correct but the `main`/`types` top-level keys are legacy CJS-era vestiges

**Evidence.** `package.json:19-32` — top-level `"main"` + `"types"` (the pre-`exports` resolution
keys) coexist with the `exports` map, which re-states `types`/`import`/`default` per entry.
`"type": "module"` + `"formats": ["es"]` (`vite.config.ts:514`) make the package ESM-only; no CJS
artifact is emitted (confirmed — CLAUDE.md). With `exports` present and Node ≥22 (`engines`),
`main`/`types` are only consulted by tools that ignore `exports` — legacy fallbacks.

**Proposal.** Keep `exports` as the sole resolution surface; drop `"main"` (ESM-only, `exports.`.`.import`
is authoritative) and keep `"types"` at top level ONLY if a non-`exports`-aware typechecker in the
consumer matrix still needs it (verify; TS ≥5 `moduleResolution: bundler`/`node16` reads `exports.types`).
Within each `exports` entry, `"import"` and `"default"` point at the same file — collapse to one
`"default"` unless a genuine condition split is intended. The surface should declare each path once.

### F8 (minor) — `internal/` leaf tier is correct (no barrel, C-5) and the `@mkbabb/value.js/math` consume edge is idiomatic — RECORD as the model, not a defect

**Evidence.** `internal/` has no `index.ts` (verified) — leaves are deep-imported, which is what
keeps the LIGHT modules' import graph explicit and gate-auditable (`proof:boundary` bundles each
light entry and greps for value.js specifiers). `internal/leaves.ts:34` re-exports
`clamp`/`scale`/`lerp`/`lerpArray` from the `parse-that`-free `@mkbabb/value.js/math` subpath
(no byte-copy), externalized as a bare 113B runtime edge by `vite.config.ts:527-532`'s
`/^@mkbabb\/value\.js(\/|$)/` predicate. This is the correct DRY consume-edge — value.js owns the
math, kf re-exports it, the boundary gate's W97 clause verifies the subpath is grammar-free.

**Proposal.** No change. This is the pattern the rest of the surface should emulate: a thin,
gate-verified re-export of the upstream's canonical code rather than a hand-maintained mirror.
Note it in the U charter as the *reference idiom* against which F1/F2's hand-rosters are the anti-pattern.

---

## Tree-shakability & ESM posture (assessment)

- `"sideEffects": false` (`package.json:18`) + ESM-only + per-symbol named exports on the LIGHT
  barrel means a consumer importing only `SpringProgress` tree-shakes the rest of `orchestration/` —
  structurally sound. No finding.
- The two-in split is genuinely load-bearing for tree-shaking: `proof:boundary` proves a
  light-only consumer never pulls value.js. This is the surface's best property — the audit does NOT
  propose weakening it; F1-F3 collapse the *bookkeeping*, not the boundary.
- ESM-only is correct and modern. The only vestige is F7's `main`/dual-condition legacy.

## Does barrel discipline fight or serve colocation?

It **serves** at the zone level (each zone's `index.ts` is a real cohesion boundary,
`proof:zone-cohesion`/`proof:no-orphan-module` enforce it) and `public.ts`'s "build-entry sink /
one-directional edge" design (`public.ts:14-24`) is genuinely elegant — it dodges the engine↔group
cycle by construction. It **fights** only in the triplication: the SAME roster living in three
barrels (`index` types, `public` values, `load-engine` interface+assign) is the barrel discipline
turned against itself. Collapsing to one composition barrel (F1) resolves the tension — colocation
of the *composition* in one place.

---

## What U must charter

1. **Collapse the dynamic accessor onto the composition barrel** — `loadAnimationEngine =
   () => import("./public")` returning `Promise<typeof import("./public")>`; delete the
   `Promise.all`/`Object.assign` hand-roster in `load-engine.ts`. Fold the owner-deferred "loader collapse."
2. **Derive (or codegen) the `AnimationEngine` type from `public.ts`** — extend the bespoke
   `engineDtsRollupPlugin` to emit the barrel engine type; delete the hand-spelled interface and
   `proof:published-surface` clause (d). Never hand-edit the roster.
3. **Reduce `index.ts` to LIGHT values + one `export type * from "./public"` + the accessors** —
   delete the ~150-line hand heavy-TYPE re-list and its per-symbol paragraphs.
4. **Strip the 53 tranche-tag / FLAGGED-ADDITIVE archaeology comments** from the three surface
   files (provenance lives in `docs/tranches/`, not in shipped source) — NO-LEGACY.
5. **Re-charter or dissolve `constants/index.ts`** — remove the "back-compat / former monolithic"
   framing; either justify it as the constants zone barrel or point the 38 heavy importers at
   `defaults`/`types` directly.
6. **Excise the granular-loader tombstone comments and adjudicate `warmEngine`** — keep it only
   against a proven consumer; otherwise remove.
7. **Move demo ambient shims out of `src/`** — `src/env.d.ts` → `demo/env.d.ts`; fix the CLAUDE.md
   path drift; purify `tsconfig.lib.json`'s graph.
8. **Rationalize `package.json` exports** — drop the CJS-era `main` (and redundant `import`/`default`
   twins) to a single ESM `exports` surface; keep only conditions a real consumer needs.
9. **Adopt `internal/leaves.ts`'s value.js/math re-export as the reference consume idiom** — the
   surface's hand-rosters (F1/F2) are the anti-pattern; the thin gate-verified re-export is the model.
10. **Re-measure the surface-integrity gate belt after the collapse** — `proof:engine-subpath-mirror`,
    `published-surface` clause (d), `dts-rollups-agree`, `claude-paths-live` largely exist to police
    the triplication; several become vacuous once there is ONE roster. Feed this to the CI-trim band.
