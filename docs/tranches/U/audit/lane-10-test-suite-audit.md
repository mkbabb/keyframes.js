# Tranche U — Audit Lane 10: test-suite-audit

**Scope:** `test/` (113 `*.test.ts` files / 1052 vitest tests + 2 `*.measure.test.ts`),
`bench/` (12 `*.bench.ts` — note the CLAUDE.md "9" is stale), `vitest.config.ts`,
and the gate apparatus that wraps them (`227` `proof:*` package.json keys / `209`
`scripts/proof-*.mjs`). Read against the U edict: **CI trim** (the runner is
"superfluous… most of it's likely tautological"), **the grand recursive-colocation
restructuring** of library + demo, **NO legacy code**, **performance as the grand
edict**, and **development-only** (this lane produces charter asks, not edits).

**Headline:** the suite's behavioral core is sound, but it is welded to the *source
shape* the grand transposition is about to dissolve — ~24 belt-and-suspenders
source-grep gates, 24 demo tests running inside the "glass-ui-free library gate" via
a stub, and deep-relative-path binding everywhere — so a colocation move reds the
suite for cosmetic reasons while no stable-surface characterization layer catches the
behavior that actually matters.

---

## Findings

### F1 — CRITICAL — Source-grep `proof-*.mjs` halves are hostile to the transposition (belt-and-suspenders)

`24` `proof:*` keys run the shape `node scripts/proof-X.mjs && vitest run test/X.test.ts`
(the belt-and-suspenders list: `proof:blend`, `proof:grammar-fuzz`, `proof:nan-frame`,
`proof:composition-honored`, `proof:diagnostics-channel`, `proof:scroll-roundtrip`,
`proof:drawsvg`, `proof:finished`, `proof:adopt-compiled`, `proof:interpolate-anything`,
`proof:roundtrip-fidelity`, `proof:ingest-replay`, `proof:orbital-rotate3d`,
`proof:morph`, `proof:emerging-css-resolve`, `proof:replay-equality`,
`proof:compile-replay`, `proof:spring-blend-weight`, `proof:color-fidelity`,
`proof:agent-validate`, `proof:platform-adopt`, `proof:scene-control-dfa`,
`proof:no-shadow-playback-authority`, `proof:scene-perf-budget`).

The `.mjs` half is a **SOURCE-GREP** gate: `scripts/proof-blend.mjs:12-40` self-describes
as "A SOURCE-GREP gate… each clause reds on the exact regression it forbids" and its
`array-guard` clause reds unless the source literally contains
`Array.isArray(existing) && Array.isArray(incoming)`. The `.test.ts` half
(`test/group/blend.test.ts:11-18`) is the real value proof (asserts exact blended
numbers: add→1.0, weighted→0.25). The behavioral test is refactor-invariant; the
source-grep half reds the instant the guard expression is *reworded* — i.e. on
exactly the "architectural transposition for elegance" the owner mandates. This is
the `209`-script tautological CI the owner named.

**Evidence:** `scripts/proof-blend.mjs:12-16,20-31`; `test/group/blend.test.ts:11-18`;
the 24-key belt-and-suspenders list (package.json `proof:*` grep).

**Proposal (gestalt):** demote the source-grep `.mjs` halves. Behavior is proven by
the value `.test.ts`; the *only* legitimate source-grep gates are the
**absence/regression guards** already banded in `gate-bands.mjs` `REGRESSION_GUARDS`
(keep-a-deleted-anti-pattern-deleted). Retire every source-grep half whose invariant
is a *positive* behavioral property (blend math, round-trip equality, densify curve)
and, where the grep tested a property the value test misses, *widen the value test* to
assert the behavior — never the syntax. This simultaneously discharges the CI-trim
edict and unblocks the transposition. Fold into the CI/gate-reduction band.

---

### F2 — CRITICAL — Demo tests run inside the glass-ui-free *library* gate, coupling library correctness to demo file layout

`vitest.config.ts:45` includes `test/**/*.test.ts` as ONE pool; `ci.yml:110` runs it
as `npm test -- --run` inside the job `library gate (glass-ui-free)` (`ci.yml:49`).
The `24` `test/demo/*.test.ts` files reach into `demo/@/state/*`, `demo/app/*`,
`demo/scenes/<name>/*` (import census: `../../demo/@/state/sceneMachine`,
`../../demo/scenes/cube/useCubeDemo`, `@components/custom/instrument/...` etc.). They
only resolve because `vitest.config.ts:35-38` aliases `@mkbabb/glass-ui/motion-core`
to `test/stubs/glass-ui-motion-core.ts` — a hand-written stub that must be kept in
lockstep with the real published contract.

Two structural wrongs: (a) the "glass-ui-free library gate" is *not* library-only —
it runs 24 demo suites bound to demo internals; (b) the grand recursive-colocation
restructuring moves nearly every `demo/@`, `demo/app`, `demo/scenes` path these tests
hard-code → mass RED unrelated to any behavior change, plus a stub that silently rots
against the real glass-ui it shadows.

**Evidence:** `vitest.config.ts:35-38,45`; `ci.yml:49,110`;
`test/stubs/glass-ui-motion-core.ts:1-24`; the demo import census (30+ deep paths).

**Proposal (gestalt):** split vitest into two **projects** — `library` (globs only
`test/<zone>/**` mirroring `src/animation/<zone>/`, glass-ui never in scope) and
`demo` (globs `test/demo/**`, resolves the REAL `@mkbabb/glass-ui`, runs in the
`demo-smoke` job that already has the demo build context). The library gate then
depends on ZERO demo files and needs no glass-ui stub. Demo seams get characterized
through the demo's public scene descriptors, not deep relative paths (see F7).

---

### F3 — MAJOR — `test/easing/easing.test.ts` tests the *dependency*, not keyframes.js (dead coverage)

`test/easing/easing.test.ts:1-6` imports ONLY from `@mkbabb/value.js`
(`CSSCubicBezier`, `steppedEase`, `timingFunctions`) and its 4 tests assert value.js's
own registry has keys and its bezier evaluates — **zero** keyframes.js code is
exercised (grep confirms no `src/animation` import). The file even calls itself
"easing re-exports (smoke tests)" but kf re-exports none of these. value.js's own
tranche is in active development with its own suite; this is redundant
dependency-testing living in the kf correctness pool.

Contrast the *correct* consume-edge model: `test/compile/valuejs-contract.test.ts:1-16`
deliberately pins ONE load-bearing value.js behavior kf depends on
(`parseCSSValueUnit("") → ValueUnit(0)`), documented as "a kf test that locks kf's
CONSUMPTION of a value.js property." That is the only shape kf may charter against
value.js (per the U constellation rule). `easing.test.ts` is not that.

**Evidence:** `test/easing/easing.test.ts:1-6` (value.js-only imports, 4 tests);
`test/compile/valuejs-contract.test.ts:1-16` (the correct contrast).

**Proposal (gestalt):** delete `easing.test.ts` (value.js owns it). Keep
`resolve-easing.test.ts` (it tests kf's `src/animation/easing.ts`) but relocate it —
`easing.ts` is a *root file*, not a zone, so `test/easing/` is a false zone (F4). Any
value.js behavior kf truly relies on is pinned as a named consume-edge contract beside
`valuejs-contract.test.ts`, not as a dependency smoke test.

---

### F4 — MAJOR — the `test/<zone>` mirror is dishonest at two directories

The mirror `test/<zone>/ ↔ src/animation/<zone>/` (`vitest.config.ts:42-44`) holds for
every real zone EXCEPT: `test/easing/` (no zone — `easing.ts` is a root file beside
`index.ts`/`load-engine.ts`/`public.ts`/`validate.ts`) and `test/demo/` (a *separate
product*, not a library zone). `src/animation/constants/` has no test dir (acceptable
— types-only). So the "mirror honesty" the config claims is broken by exactly the two
dirs that host the dead/foreign coverage in F2/F3.

**Evidence:** `find test -type d` vs `src/animation/` zone list; `vitest.config.ts:42-44`
(the mirror claim); root files `easing.ts`, `validate.ts` have no `test/<root>/` home.

**Proposal (gestalt):** make the mirror a *gate-checked invariant*, not a comment.
After the F2 project split, `test/demo/` leaves the library project entirely. Root
files (`easing.ts`, `validate.ts`, `index.ts`, `public.ts`) get a `test/_root/` tier
(or colocate per the grand edict — a `__tests__` beside the file). A cheap
`proof:test-mirror` gate asserts every library `test/` dir maps to a `src/animation/`
zone-or-root and vice-versa, so the mirror can never drift silently again.

---

### F5 — MAJOR — `*.measure.test.ts` artifacts run in every CI correctness pass but assert ~nothing

`vitest.config.ts:45` includes `test/**/*.measure.test.ts` in the correctness pool.
The two members are decision-support probes, not invariants:
`test/engine/d3-changed-keys.measure.test.ts:1-15` records an "unchanged-key fraction"
for a transposition already **WITHHELD** ("this proves the keyframes-local hot-path win
is ~0"); `test/physics/sync-step.measure.test.ts:22-27` is explicitly "arm-neutral…
the DECISION is made on-device from the printed numbers." Both burn runtime on every
`npm test` while asserting no correctness property — the "measurement rotting inside
the correctness pool" anti-pattern.

**Evidence:** `test/engine/d3-changed-keys.measure.test.ts:1-15`;
`test/physics/sync-step.measure.test.ts:12-27`; `vitest.config.ts:45`.

**Proposal (gestalt):** measurements belong in `bench/` (or a `measure/` tier invoked
on demand / on the impl host), never in the CI correctness glob. Drop
`test/**/*.measure.test.ts` from the vitest `include`; re-home the two artifacts beside
their bench siblings (`sync-step.bench.ts` already exists). The correctness suite then
asserts only invariants — faster, honest.

---

### F6 — MAJOR — 227 `proof:*` keys / 209 `.mjs` scripts vs a standing born-RED ceiling of 120; 13 keys are thin vitest aliases

`package.json` declares `227` `proof:*` keys against `ROSTER_CEILING = 120`
(`gate-bands.mjs:595`), and `proof:roster-ceiling` is a **standing born-RED backlog
row** (`gate-bands.mjs:665-676`, "today 228… converges SLOWLY"). `13` of those keys are
pure `vitest run <file>` aliases (`proof:engine-correctness`, `proof:sync-step`,
`proof:event-ordering`, `proof:adapter-capture`, `proof:standalone-zero-alloc`,
`proof:compile-deterministic`, `proof:roundtrip-easing`, `proof:cohesion`,
`proof:scene-raf-leak`, `proof:scene-contract-identity`, `proof:group-snapshot-identity`,
`proof:resize-tracks`, `proof:zero-alloc`) — one package.json line per test file, run
individually in `ci.yml` (`ci.yml:238-274`) instead of as one pooled vitest run. This
is the tautological-CI the owner named, self-declared over-ceiling.

**Evidence:** package.json `proof:*` (227 keys); `gate-bands.mjs:595,665-676`; the
13-alias list; `ci.yml:238-274` (per-file `npm run proof:*` steps).

**Proposal (gestalt):** collapse the thin vitest wrappers into vitest **project +
tag** selectors — the library correctness suite runs as ONE `npm test --project=library`
in ci.yml, not 13+ per-file `npm run proof:*` steps. Reserve `proof:*` keys for gates
with a *non-vitest apparatus* (bundle boundary, published-surface, source greps that
survive F1). Combined with F1's source-grep retirement, this is the concrete path from
228 → the 120 ceiling, greening `proof:roster-ceiling`.

---

### F7 — MAJOR (charter) — no restructure-safe characterization layer exists at the seams the transposition will move

Every library test binds to **deep source paths** (`../../src/animation/<zone>/<file>`)
and every demo test to **deep demo paths** (`../../demo/@/state/sceneMachine`,
`../../demo/scenes/cube/useCubeDemo`), not to the stable public surfaces (the LIGHT
barrel `src/animation/index.ts`, the `./engine` mirror `public.ts`, or the demo's
public scene descriptors). The grand recursive-colocation restructuring will move
nearly all of these files. There is currently **no** characterization suite pinned to
the stable "ins" that would stay green across the move while still catching behavioral
drift — so the restructure has no safety net that distinguishes "a file moved" from "a
behavior changed."

**Evidence:** the demo import census (30+ `../../demo/...` + `@components/...` deep
paths); library tests import `../../src/animation/engine`, `../../src/animation/group`,
etc.; CLAUDE.md names the two package "ins" (`index.ts` + `public.ts`) — no test tier
imports exclusively through them.

**Proposal (gestalt):** BEFORE the transposition, author a thin **characterization
tier** that imports ONLY through the two package ins (`index.ts` LIGHT surface +
`public.ts`/`./engine` HEAVY surface) and the demo's public scene entry points, and
goldens *observable* behavior at the seams: compiled-CSS bytes (`compileToCSS`),
sampled frame values over a fixed clock, reducer transition tables
(`test/demo/scene-machine-reducer.test.ts` is the right model — pure, path-shallow,
imports one public symbol). This suite stays green across any file move and reds only
on behavior change — the refactor-safe net the whole U restructuring needs.

---

### F8 — MINOR — preset-taxonomy tests assert object-identity of a literal index (near-tautological)

`test/presets/spring-presets.test.ts:66-90` asserts `enterPresets.fadeIn === fadeIn`,
`presetTaxonomy.exit === exitPresets`, `Object.keys(presetTaxonomy) === ["enter",
"exit","attention","loop"]` — testing that a hand-written index object references its
members and has the expected keys. Low signal: it guards only a copy-paste
re-implementation, and the `:92` property loop ("every taxonomy leaf constructs a valid
animation") already covers the load-bearing property.

**Evidence:** `test/presets/spring-presets.test.ts:62-90` (identity + key-shape
assertions) vs `:92-100` (the real property loop).

**Proposal (gestalt):** fold the identity/key-shape assertions into the single
property loop — "every taxonomy leaf IS the canonical exported factory AND constructs
a valid animation" — and drop the per-key `toBe` lines. One behavioral invariant
replaces ~15 structural echoes.

---

## Cross-cutting note — bench coverage vs hot paths (lower confidence, defer to the perf lane)

`bench/` has 12 files (not the CLAUDE.md-stated 9). Coverage is strong on
compile/parse/resolve/spring/densify/SoA-composite/cold-import. The gap: the
**color-interpolation** hot path (oklab perceptual lerp — the *default* color
dispatch per CLAUDE.md) and the DOM `getComputedValue`/`lerpComputedValue` path have
NO jsdom-free micro-bench — only `computed-real-dom.bench.ts` (Playwright,
browser-gated, rarely run). Given performance is the grand edict, the interpolation
dispatch's color branch is un-benched. **Proposal:** add a jsdom-free micro-bench on
the color-lerp branch and require (via `proof:bench-taxonomy`) one bench row per
interpolation-dispatch branch. Flagged for the perf lane to confirm against the real
hot-path profile.

---

## What U must charter

1. **Retire the source-grep `proof-*.mjs` halves** of the ~24 belt-and-suspenders
   gates; keep source greps ONLY for the `REGRESSION_GUARDS` absence-band. Widen the
   surviving value `.test.ts` to assert any behavior the grep uniquely covered. (F1)
2. **Split vitest into `library` and `demo` projects**; the library gate globs only
   `test/<zone>/**` and never resolves glass-ui, deleting the
   `test/stubs/glass-ui-motion-core.ts` coupling; the demo project runs in `demo-smoke`
   against the REAL glass-ui. (F2)
3. **Delete `test/easing/easing.test.ts`** (it tests `@mkbabb/value.js`, not kf);
   re-home any truly load-bearing value.js behavior as a named consume-edge contract
   beside `valuejs-contract.test.ts`. (F3)
4. **Author a gate-checked `test/<zone>` mirror invariant**; give root files
   (`easing.ts`, `validate.ts`, barrels) a real test home (colocated `__tests__` per
   the grand edict); `test/demo/` leaves the library project. (F4)
5. **Drop `*.measure.test.ts` from the vitest `include`**; re-home the two measurement
   artifacts under `bench/`/`measure/` invoked on demand. (F5)
6. **Collapse the 13 thin `vitest run <file>` `proof:*` aliases** into vitest
   project/tag selectors; reserve `proof:*` keys for non-vitest apparatus; drive the
   roster from 228 → the 120 ceiling and green `proof:roster-ceiling`. (F6)
7. **Author the restructure-safe characterization tier BEFORE the transposition** —
   golden observable behavior imported ONLY through the two package "ins" + demo scene
   public entries, so file moves red nothing and behavior drift reds loudly. (F7)
8. **Fold the near-tautological preset-taxonomy identity assertions** into the existing
   property loop. (F8)
9. **Add a jsdom-free color-lerp / computed-value micro-bench** and require a bench row
   per interpolation-dispatch branch (defer sizing to the perf lane). (cross-cutting)
