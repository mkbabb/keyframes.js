# M.W2 — The LINT tier (eslint + dependency-cruiser)

- **Band:** A · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** none
  (kf-internal; eslint + dependency-cruiser from the npm registry — NOT a sibling
  publish gate). Parallel with M.W3 ∥ M.W4; does NOT require M.W1 (but composes
  with it — M.W1's report-all runner schedules `proof:lint-tier` as one node it no
  longer aborts the chain on).
- **Gate (new):** `proof:lint-tier` — born-RED on today's tree because **no eslint
  config and no dependency-cruiser config exist** (`node_modules/eslint` ABSENT,
  `node_modules/dependency-cruiser` ABSENT, zero `eslint.config.*` / `.eslintrc*` /
  `.dependency-cruiser.*` in the repo — all verified 2026-06-17). GREEN only when
  ONE static pass (`eslint .` + `depcruise`) subsumes every assertion the ~33
  source-shape node gates make, with NO coverage lost.

---

## Context

The 32-lane re-audit quantified the gate apparatus as over-engineered in its
IMPLEMENTATION, not its principle (lane-13 §2, lane-15 §8). Of the 146 leaf gates
in `proof:all`, **33 are pure source-shape gates** — no browser, no vitest, no
playwright — each a standalone `scripts/proof-*.mjs` node process that (i) pays a
~0.18s `npm run` fork tax, (ii) re-reads the source tree from scratch with its own
`fs`/`glob` walk, and (iii) reports pass/fail via a bespoke `ok`/`fail` +
`process.exit(0/1)` pattern (lane-15 §6). Verified roster (2026-06-17,
`grep -L "demo-driver\|chromium\|playwright\|vitest" scripts/proof-*.mjs` → 33):

```
agent-surface  boundary  brittleness  browser  chronic-closure  ci-coverage
composable-encapsulation  control-point-live  crayon-preserved  decomposition
demo-no-oversize  demo-on-published-surface  deps-current  dogfood  dogfood-hero
engine  icon-idiom  idioms  keyframes-vue-published  modern-web  no-brittle-selector
no-deprecated-guard  no-dup-utility  no-single-option-select  peer-satisfied
phi-leaf-zero  platform-adopt  pp-logo-svg  readme-runs  single-writer
styling-idioms  transport-events  workaround-deletion
```

These are textbook lint-class invariants — file-size ceilings, forbidden import
edges, duplicate-surface bans, grep rules — implemented as 33 node processes
re-doing the one job eslint exists to do: **parse the tree once, run many rules**.
Lane-15 §6 measures the cost: `33 × (0.18s fork + an independent tree-read) ≈
10–15s of pure overhead` for invariants one `eslint .` pass over a parsed-once AST
handles in `< 2s`. The lint-class scripts alone carry **11,503 LOC**
(lane-15 §5 / lane-13 §11, `grep -L … | xargs wc -l`); the per-script process-spawn
wrapper (~5L × 33 ≈ 165L) deletes outright, and the assertion bodies that survive
do so as eslint rules / depcruise clauses / one vitest meta-unit, not as forks.

**eslint and dependency-cruiser are ABSENT today** (lane-13 §1 evidence index:
`ls node_modules/eslint` → ABSENT, `ls node_modules/dependency-cruiser` → ABSENT,
re-verified 2026-06-17). There is **no config to migrate** — this is a greenfield
install, the cleanest consolidation in the tranche (lane-13 §4: "the greenfield
cost is the only migration work; there is no config to migrate because eslint is
absent today"). The named-but-unbuilt cure has sat in `ci.yml:328`
("F-7's static-gate migration out of demo-smoke") since the F band, UNBUILT
through L (lane-13 §1, lane-15 §9 P-V3).

**This wave is one of three Band-A consolidation waves.** M.W2 owns the LINT tier
(the source-shape gates → static rules); M.W3 owns the @vitest/browser INTEGRATION
tier (the 72 runtime gates → one shared chromium); M.W4 owns the synthetic-clock
settle + the two-axis taxonomy reform. M.W2 is the **safest, highest
process-count-reduction** of the three (lane-13 §5 Phase 1: "cheapest, safest,
highest process-count reduction… zero coverage loss — same invariants, faster").
It removes ~23% of the suite's process count without touching a single browser
gate or the O(N²) browser wall-clock (that is M.W1 + M.W3).

The binding constraint is **inv-M-observable-truth**: `proof:lint-tier`'s born-RED
witness must be the GENUINE state — eslint/depcruise are not installed and no rule
exists, so the gate red is a real install/config gap, not a proxy. And the
coverage-invariant (lane-13 §4, the no-coverage-loss precept applied to the LINT
tier): for every deleted node gate, its assertion must (i) GREEN on the clean tree
as an eslint rule or depcruise clause AND (ii) RED when the violation it guards is
planted. A rule that only proves "eslint ran" is the L.W1-S4-class proxy this
invariant forbids.

### Audit evidence

| Ref | Source location | Fact |
|-----|-----------------|------|
| lane-13 §1 | `ls node_modules/eslint` / `…/dependency-cruiser` | both **ABSENT** — greenfield install, no config to migrate |
| lane-15 §0 | `grep -L "demo-driver\|chromium\|playwright\|vitest"` | **33** pure source-shape gates; **11,503 LOC** |
| lane-13 §3(a) | `scripts/proof-demo-no-oversize.mjs:39,76` | `const CEILING = 500; … readFileSync().split("\n").length > CEILING` — this IS `max-lines` |
| lane-16 §0 / direct | `scripts/proof-decomposition.mjs:119,128` | `LIBRARY_CEILING = { ".vue": 350, ".ts": 550 }` + a `LIBRARY_CEILING_OVERRIDE` Map of rationale-bearing per-file caps (engine.ts cap 1400) — `max-lines` WITH a per-file override table |
| lane-13 §3(c) | `scripts/proof-boundary.mjs:47,70,86–95` | the LIGHT surface (`src/animation/index.ts` entry graph) carries **0** static `@mkbabb/value.js` edges (bare/named/re-export/subpath) — this IS `import/no-restricted-paths` / a depcruise forbidden-edge rule |
| lane-15 §6 / direct | `scripts/proof-no-dup-utility.mjs:8,205` | a **no-legacy** check: a replaced surface must not live beside its replacement (3 named deletions + an `INTENTIONAL_STATIC` allowlist) — NOT a generic `no-identical-functions`; the exact deletion roster is the asset |
| lane-15 §6 / direct | `scripts/proof-single-writer.mjs:11–20` | no file OUTSIDE the scene-machine's own files assigns `.activeScene`/`.status` — a custom write-boundary rule |
| ⚠M8 / charter | `L.W9.md:381` | `proof:boundary` W96 **parse-that-scan** named but NOT implemented (the LIGHT surface forbidden `@mkbabb/parse-that` edge) — authored at M.W9, NOT here; named so the M.W2 boundary depcruise rule is forward-compatible with it |
| lane-15 §2.4 / direct | `scripts/proof-styling-idioms.mjs` | does NOT call `getComputedStyle` — `border-radius` appears only as a source comment; it is a pure source-shape grep gate (correctly in this tier, NOT a runtime gate) |

The fair defense (lane-13 §3, lane-16 §1): the boundary gate is the most
project-specific invariant — `proof-boundary.mjs` (405L) walks the actual built
entry-chunk module graph (assertion 1: each entry chunk's STATIC module set
contains 0 value.js edges, `proof-boundary.mjs:21`). A naive `import/no-restricted-paths`
over SOURCE is necessary but NOT sufficient for the full boundary oracle; the
dependency-cruiser config must walk the resolved module graph the same way (the
no-coverage-loss S-clause below is explicit about this).

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:lint-tier` GREEN with the coverage-invariant discharged for every deleted
node gate.

### S1 — Greenfield install of eslint + dependency-cruiser

**Breach.** `node_modules/eslint` and `node_modules/dependency-cruiser` are both
absent; no `eslint.config.*` / `.dependency-cruiser.*` exists in the repo
(verified 2026-06-17). There is no LINT tier — the 33 source-shape invariants run
as 33 forks.

**Cure.** `npm install -D eslint dependency-cruiser` (plus the
`@typescript-eslint/parser` + `@eslint/js` + `eslint-plugin-vue` peers eslint's
flat config requires to parse `.ts`/`.vue` — pinned, recorded in `package.json`
`devDependencies`). Author ONE flat `eslint.config.mjs` (project-root, the modern
flat-config form — NOT a legacy `.eslintrc`) and ONE `.dependency-cruiser.mjs`.
Add `npm run lint` = `eslint . && depcruise src` to `package.json`.

**Constraint.** Flat config only (eslint 9+ default; no `.eslintrc` legacy). The
config parses `src/animation/**` (the `.ts` library), `demo/**` (the `.vue`/`.ts`
demo), and `scripts/**` under their distinct ceilings — the existing gates already
partition these (lane-16 §0: demo 500L, library `{ .vue: 350, .ts: 550 }`), and
the eslint config must preserve the partition, not flatten to one ceiling.

**Gate bite.** `proof:lint-tier` clause S1: assert `eslint --version` resolves AND
`eslint.config.mjs` + `.dependency-cruiser.mjs` exist AND `npm run lint` is a
`package.json` script. Today: all four absent → RED. After cure: present → GREEN.

---

### S2 — `max-lines` with the per-file override table (subsumes `demo-no-oversize` + `decomposition` clause-1)

**Breach.** Two node gates re-implement line-count ceilings with `readFileSync().split("\n").length`:
`proof-demo-no-oversize.mjs:39,76` (demo, 500L flat) and
`proof-decomposition.mjs:119,128,346` (library, `{ .vue: 350, .ts: 550 }` WITH a
rationale-bearing `LIBRARY_CEILING_OVERRIDE` Map — e.g. `engine.ts` cap 1400). The
override table is **load-bearing**: it is the gated-exception mechanism that lets a
cohesive god-module (engine.ts) exceed the base ceiling with a recorded `why:`, and
it carries a stale-entry guard (`proof-decomposition.mjs:381` — an override whose
file is now under-cap reds).

**Cure.** eslint `max-lines` (built-in) configured per glob:
- `demo/**/*.{vue,ts}` → `max-lines: 500` (skipping `dist/` + generated).
- `src/animation/**/*.vue` → `max-lines: 350`; `src/animation/**/*.ts` → `max-lines: 550`.
- The per-file overrides become per-file eslint `overrides` glob blocks, each
  carrying its `why:` rationale as a config comment (the engine.ts 1400 cap is a
  `{ files: ["src/animation/engine.ts"], rules: { "max-lines": ["error", 1400] } }`
  block). This is the idiomatic eslint expression of the override Map — no bespoke
  table, no custom rule.

**Constraint (the stale-override guard is NOT free in eslint).** `max-lines` alone
cannot red an override that is now SLACK (a cap raised above a file that has since
shrunk back under base). That guard (`proof-decomposition.mjs:381`) is a distinct
invariant — it prevents override-rot. It survives as a **custom eslint rule**
(`kf/no-slack-ceiling-override`) OR as one clause of the vitest meta-unit (S6) that
reads the `eslint.config.mjs` override blocks and asserts each named file is
actually over its base ceiling. The S-clause must NOT silently drop this guard —
that is the coverage-loss the invariant forbids.

**Gate bite.** Coverage-invariant per S5: plant a 600L `demo/app/Foo.vue` → eslint
reds; plant a 1500L `engine.ts` → eslint reds (over the 1400 override); shrink a
named-override file under its base and leave the override → the slack-guard rule/
meta-unit reds. Today (no eslint) none of these red under a fresh `npm run lint`.

---

### S3 — `import/no-restricted-paths` + the depcruise boundary edge-scan (subsumes `boundary`)

**Breach.** `proof-boundary.mjs` (405L) enforces the value.js static/dynamic
boundary: the LIGHT surface (`src/animation/index.ts` and its static entry graph)
carries ZERO static `@mkbabb/value.js` edges — bare, named, re-export, OR subpath
(`proof-boundary.mjs:47`). It does this with a hand-rolled module-graph walk over
the built entry chunks (assertion 1, `proof-boundary.mjs:21`) PLUS a source grep
(assertion 4, `:86–95`). This is the canonical `import/no-restricted-paths` /
dependency-cruiser forbidden-edge rule — re-implemented as a node process.

**Cure.** TWO complementary rules over ONE parsed graph (the boundary is the one
invariant a single tier cannot fully express — lane-13 C2, lane-15 §11 C2):
1. **dependency-cruiser forbidden edge** — a rule `no-light-to-valuejs`: any module
   reachable from `src/animation/index.ts` via STATIC imports (excluding the
   `loadAnimationEngine()` dynamic split point) must not have a `to` edge matching
   `@mkbabb/value.js` (or any `@mkbabb/value.js/…` subpath). depcruise resolves the
   actual module graph the same way `proof-boundary.mjs` assertion 1 walks the entry
   chunks — this is the load-bearing equivalence the coverage-invariant must verify
   (a naive source-only `no-restricted-paths` is necessary but NOT sufficient).
2. **eslint `import/no-restricted-paths`** (or the depcruise rule alone if depcruise
   covers source too) as the fast source-level guard catching the dead-but-armed
   import (`proof-boundary.mjs:48` "the dead-but-armed import" case).

The W96 **parse-that** forbidden edge (⚠M8, `L.W9.md:381`, NOT implemented) is
authored at M.W9, not here — but the depcruise `no-light-to-valuejs` rule is
structured so its parse-that sibling (`no-light-to-parsethat`) is a one-clause add,
NOT a re-architecture. This wave names the seam; M.W9 fills it on the parse-that-dep
delete.

**Constraint.** depcruise must resolve through the bundler/`exports`-map exactly as
the build does (`moduleResolution: bundler`), so the forbidden edge bites the SAME
graph the boundary gate's built-chunk walk does — NOT a source-only approximation
that misses a re-export laundering value.js through a LIGHT leaf. The
`proof:published-surface` graph check (lane-15 §11 C2: "boundary/published-surface
belong in the LINT/GRAPH tier, not jsdom unit tests") rides the same depcruise pass.

**Gate bite.** Coverage-invariant per S5: add `import "@mkbabb/value.js"` to a LIGHT
leaf (`numeric.ts`/`smooth.ts`) → `npm run lint` reds (depcruise + import rule). The
existing gate's documented negative test (`proof-boundary.mjs:56`) is reproduced
verbatim as the planted-violation witness.

---

### S4 — Custom eslint rules for the remaining grep gates (subsumes `single-writer`, `no-brittle-selector`, `idioms`, `styling-idioms`, `no-single-option-select`, `no-deprecated-guard`, `no-dup-utility`)

**Breach.** The remaining lint-class gates are grep rules run as node forks. Each
asserts a project-specific source-shape invariant:
- `no-dup-utility` (`:8,205`) — a replaced surface must not live beside its
  replacement (3 named deletions + `INTENTIONAL_STATIC` allowlist). **NOT a generic
  `no-identical-functions`** — the deletion roster + allowlist are the asset.
- `single-writer` (`:11–20`) — no file outside the scene-machine's own files
  assigns `.activeScene`/`.status` (a write-boundary rule).
- `no-brittle-selector` (270L), `idioms` (670L), `styling-idioms` (470L),
  `no-single-option-select` (220L), `no-deprecated-guard` (117L) — forbidden-pattern
  source greps.

**Cure.** Author them as custom eslint rules in a local plugin (`eslint-plugin-kf`,
a flat-config-local rule object — NOT a published package). Each rule is the EXACT
predicate the node gate runs (the same forbidden patterns, the same allowlists, the
same write-boundary file set), operating on eslint's parsed AST/source rather than a
fresh `fs.readFileSync`. The rules that are genuinely line-oriented greps (not
AST-shaped) may glob-read via the rule's `Program` node once. The `INTENTIONAL_STATIC`
and scene-machine-own-files allowlists migrate verbatim into the rule options — the
coverage-invariant forbids approximating them with a built-in.

**Constraint (semantic fidelity, NOT a generic substitute).** `no-dup-utility` is the
sharpest trap: a generic `sonarjs/no-identical-functions` would over- or under-fire
relative to the no-legacy "replaced-surface-beside-replacement" semantics. The custom
rule MUST encode the specific deletion roster + the `INTENTIONAL_STATIC` allowlist —
the S5 coverage-invariant proves it by planting the exact regression each gate guards
(re-author a deleted `.scale-on-hover` rule beside its replacement → red), not a
generic duplicate.

**Gate bite.** Coverage-invariant per S5: for EACH of the 7 gates, plant its
documented violation (re-introduce a deleted surface; assign `.activeScene` from
outside the machine; add a brittle selector) → `npm run lint` reds on exactly that
rule. Today (no eslint) none red.

---

### S5 — The coverage-invariant witness (the no-coverage-loss proof, AXIS-aware)

**Breach.** Migrating 33 node gates to static rules risks SILENT coverage loss — a
rule that GREENs on the clean tree but does NOT actually bite the violation it
replaced (the L.W1-S4-class proxy: a gate that tests "the tool ran" rather than "the
defect reds"). inv-M-observable-truth forbids this.

**Cure.** A **per-gate planted-violation matrix** (the no-coverage-loss precept,
lane-13 §4). For every one of the 33 source-shape gates deleted, name (i) the eslint
rule / depcruise clause / vitest-meta clause that subsumes it AND (ii) a concrete
planted violation that the new rule REDs on and the old gate RED on. The matrix is
authored as a fixtures directory (`test/lint-coverage/<gate>.violation.fixture`) +ONE
vitest meta-test that, for each fixture, runs `eslint`/`depcruise` over a temp tree
with the violation planted and asserts a non-zero exit + the expected rule id. This
is the observable-truth witness: the planted defect is the REAL failure mode, not a
proxy for it.

**Constraint.** The matrix is the GATE's substance, not documentation. Three gates
do NOT map to a static rule and MUST be named as EXCEPTIONS routed to the right axis
(inv-M-two-axis, M.W4): the boundary/published-surface graph checks ride depcruise
(S3); the meta-gates over `package.json`/scripts shape (`chronic-closure`,
`ci-coverage`, `gate-is-runtime`) are a NODE/VITEST data-model axis (S6), NOT eslint
source rules. The matrix must classify all 33, dropping none.

**Gate bite.** `proof:lint-tier` runs the coverage-matrix meta-test; if any of the 33
gates lacks a planted-violation fixture that reds its successor rule, the gate REDs.
Today: 0 of 33 have a successor → RED.

---

### S6 — The package.json/scripts meta-unit (subsumes `chronic-closure`, `ci-coverage`, the gate-shape checks)

**Breach.** A subset of the 33 "source-shape" gates are not source-AST shaped at all
— they police the shape of `package.json` / `scripts/` (the proof chain, the chronic
ledger, the CI coverage map). `chronic-closure`, `ci-coverage`, and the
`gate-is-runtime` policy read `package.json` + every gate's script source once and
assert a data-model invariant. Forcing these through eslint source rules is the WRONG
axis (inv-M-two-axis); they are data-model truths.

**Cure.** ONE vitest meta-unit (`test/lint/gate-shape.test.ts`) that loads
`package.json` once and asserts the chain shape — the AXIS-2 (NODE/VITEST data-model)
home for these per inv-M-two-axis. This is NOT a browser gate and NOT an eslint rule;
it is the fast node/vitest axis. It runs under the existing jsdom vitest project (no
@vitest/browser dependency — that is M.W3).

**Constraint.** This S-clause must NOT pre-empt M.W4's `proof:gate-is-data-model`
meta-gate or M.W1's runner change — it only RELOCATES the package.json-shape gates
off the node-fork tier onto the vitest data-model axis. The `gate-is-runtime` POLICY
(the assertion that correctness gates actuate the built dist) is untouched in
substance; only its host moves. The full two-axis taxonomy reform is M.W4; M.W2 just
places these three on the correct axis as it migrates them.

**Gate bite.** `proof:lint-tier` asserts `chronic-closure`/`ci-coverage`/the
gate-shape checks exist as vitest meta-unit clauses (not node forks). Today: they are
node forks → the meta-unit does not exist → RED.

---

## Born-RED gate

**Gate name:** `proof:lint-tier` (NEW — does not exist in `package.json` or
`scripts/`; this wave authors it). Verified absent 2026-06-17.

**Structure:** a thin orchestrator gate (`scripts/proof-lint-tier.mjs` OR a
`package.json` clause) that runs `npm run lint` (eslint + depcruise) AND `vitest run
test/lint/` (the coverage-matrix meta-test S5 + the gate-shape meta-unit S6), then
asserts every one of the 33 source-shape gates maps to a named successor rule. The
gate is its own coverage-invariant: it cannot GREEN unless each migrated assertion
both passes clean AND reds on its planted violation.

**The REAL observable (inv-M-observable-truth).** The born-RED witness is the GENUINE
state, not a proxy: today `eslint` is not installed (`node_modules/eslint` ABSENT),
no `eslint.config.mjs` exists, no `.dependency-cruiser.mjs` exists, `dependency-cruiser`
is not installed, and `proof:lint-tier` is not a `package.json` key. Running the gate
on today's tree fails at the FIRST clause (S1: `eslint --version` does not resolve).
This is not a contrived red — it is the actual absence the wave cures.

**Witness inputs that RED today / GREEN after cure:**

| Clause | Witness on today's tree | Failure mode today | Expected after cure |
|--------|-------------------------|--------------------|---------------------|
| S1 | `eslint --version`; stat `eslint.config.mjs`, `.dependency-cruiser.mjs` | command not found; configs absent | resolves; configs present; `npm run lint` is a script |
| S2 | `npm run lint` over a planted 600L `demo/**.vue` + a 1500L `engine.ts` + a slack override | no eslint → no `max-lines` → silently passes | eslint reds on each; the slack-override guard reds |
| S3 | add `import "@mkbabb/value.js"` to `numeric.ts`, run `npm run lint` | no depcruise → the LIGHT→value.js edge is unguarded | depcruise + import rule red on the forbidden edge |
| S4 | re-author a deleted `.scale-on-hover` surface; assign `.activeScene` from outside the machine; add a brittle selector | no custom rules → all silently pass | the matching `kf/*` custom rule reds on each |
| S5 | run the coverage-matrix meta-test | no successor rule exists for ANY of the 33 gates → 0/33 mapped | all 33 mapped; each fixture reds its successor rule |
| S6 | the package.json/scripts meta-unit | `chronic-closure`/`ci-coverage` are node forks, not a vitest data-model unit | the meta-unit exists and asserts chain shape on the vitest axis |

**Today's tree result:** `proof:lint-tier` exits non-zero by construction at S1 (the
tool is not installed). No existing gate proves the LINT tier exists; the 33
source-shape invariants live as 33 forks the new gate replaces. The born-RED is the
real install/config absence — the inv-M-observable-truth requirement is met because
the witness IS the genuine missing apparatus, not a stand-in for it.

**Green condition:** `eslint .` exits 0 over the clean tree with every migrated rule
active; `depcruise` exits 0 on the boundary/published-surface graph; the
coverage-matrix meta-test maps all 33 gates each to a successor rule that reds on its
planted violation; the gate-shape meta-unit asserts the chain shape on the vitest
axis. ONE static pass subsumes ~33 node processes (lane-13 §6: `~33 processes → 1
pass`, `~10–15s → <2s`).

---

## Dependencies

- **eslint + dependency-cruiser (npm registry)** — `npm install -D eslint
  dependency-cruiser @typescript-eslint/parser @eslint/js eslint-plugin-vue`. NOT a
  sibling publish gate; greenfield (no config to migrate — lane-13 §4). This is the
  ONLY new install.
- **No sibling dep.** lane-13 §10: "the gate-apparatus consolidation is entirely
  kf-internal — no sibling repo publishes or consumes the test infrastructure."
- **M.W9 forward-seam (NOT a blocker).** The W96 parse-that forbidden edge
  (⚠M8, `L.W9.md:381`, never implemented) is authored at M.W9 on the parse-that-dep
  delete. M.W2's depcruise boundary rule (S3) is structured so the parse-that
  sibling clause is a one-line add — named here, filled there. M.W2 does NOT wait on
  M.W9.
- **Composes with M.W1 (does NOT require it).** M.W1's report-all parallel runner
  schedules `proof:lint-tier` as one fast node it no longer aborts the `&&` chain on.
  M.W2 lands independently; the speedup compounds when both are in.
- **Composes with M.W4 (does NOT require it).** S6 places the package.json-shape
  gates on the inv-M-two-axis NODE/VITEST data-model axis; M.W4's
  `proof:gate-is-data-model` meta-gate formalizes that axis. M.W2 only relocates the
  three named gates; M.W4 reforms the precept.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 install | The LINT tier silently never runs — a regression in any source-shape invariant ships because no static pass enforces it (the tool is absent) |
| S2 `max-lines` + override | A demo file grows past 500L / a library `.ts` past 550L / a cohesive god-module past its recorded cap with NO `why:` — or a stale override masks a file that should now be under base (override-rot) |
| S3 boundary edge-scan | A LIGHT leaf gains a static `@mkbabb/value.js` edge (bare/named/re-export/subpath) — a consumer importing only the LIGHT surface silently pulls value.js into its graph, breaking the static/dynamic boundary inv α protects |
| S4 custom rules | A deleted surface re-appears beside its replacement (no-legacy); a write to `.activeScene` from outside the scene machine (single-writer boundary); a brittle test selector — each a project-specific invariant a generic linter would miss |
| S5 coverage-matrix | A migration that SILENTLY drops an oracle — a rule that greens clean but never reds the violation it replaced (the L.W1-S4 proxy failure mode this invariant exists to forbid) |
| S6 gate-shape meta-unit | A package.json/scripts data-model invariant (chronic ledger closure, CI coverage map) forced through the wrong axis or run as a redundant node fork |

---

## Excluded from this wave

- **The @vitest/browser INTEGRATION tier** (the 72 runtime gates → one shared
  chromium) — M.W3 scope. M.W2 touches ZERO browser gates.
- **The serial `&&` → parallel report-all runner** — M.W1 scope. M.W2's gates run
  under whatever runner is current; the speedup compounds but is not owned here.
- **The synthetic-clock settle + the two-axis precept reform** — M.W4 scope. M.W2
  USES inv-M-two-axis (S5/S6 route data-model gates to the NODE/VITEST axis) but does
  NOT author the `proof:gate-is-data-model` meta-gate.
- **The W96 parse-that boundary scan** — M.W9 (authored on the parse-that-dep delete,
  ⚠M8). M.W2's depcruise rule is forward-compatible (S3) but does not implement it.
- **The superfluity clause prunes** (`card-rounded-primitive` clause 2, etc.,
  lane-16 §5) — those are BROWSER clause-duplicate removals (M.W3 / a prune wave),
  not source-shape; out of the LINT tier.
- **Prettier** — already configured (`CLAUDE.md` conventions: 4-space, 80-char,
  the named plugins). M.W2 does NOT fold formatting into eslint; the existing
  prettier config stands. (If a `eslint-config-prettier` disables-conflict shim is
  needed, it is a config detail of S1, not a new scope.)
