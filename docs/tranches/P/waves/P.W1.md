# P.W1 — the apparatus: the lint-tier + bench COVERAGE + the portable perf-gate infra

**Band:** A — Apparatus (the optimization measurement floor).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence (the DAG edge):** `O.W8 (the measurement wave — bench taxonomy + the portable-ratio discipline ratified) ─► P.W1` (this wave — author the lint-tier O Band A named, EXTEND the bench taxonomy to the SIMD/codegen/SoA scenarios the aggressive optimizations require, and crystallize the portable-perf-gate infra those optimizations spend) ─► B{P.W2 SoA-compositor (NOW), P.W3 Typed-OM+Playhead (NOW)}`. Band A lands FIRST — the portable-perf-gate apparatus is the floor every Band-B aggressive idea stands on (`P.md:135,161,175`).
**Owning-DM-or-idea:** the O Band A apparatus carry (the eslint-flat + dep-cruiser lint-tier M.W2 developed but `O.md:50` records "no eslint/dep-cruiser config exists" still) + the X1-perf-gates novel ideas (the portable ratio gate, the constellation-bench-registry, the ci-env posture) + the K3 portability spine (`AUDIT-DIGEST.md` K3 "the portable-gate discipline … is the most durable structural contribution O.W8 ratifies").

This wave is the **apparatus**, not a strategy change: it builds the lint floor and the perf-gate infra; it ships ZERO engine code. P.W2/P.W3 spend what P.W1 builds. It SUPERSEDES O.W1 (the lint/dep-cruiser tier O Band A scoped but, per the O.md as-built table, was never implemented) and EXTENDS O.W8's bench taxonomy (which closed 7 un-measured gaps S1–S9 but covered NO SIMD/codegen/SoA-compositor scenario — the new optimization frontier).

---

## Context

### Three stale premises the campaign corrected, applied to this lane

The constitution (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md:20-26`) corrected the "no bench" premise: **both siblings already have benches**, and so does kf (`bench/` carries 10 `.bench.ts` files + `taxonomy.json` — verified `ls bench/*.bench.ts | wc -l`). So P.W1 does NOT author a "create benchmarks" task — kf already operates the constellation's gold-standard taxonomy (`AUDIT-DIGEST.md` X1: "keyframes.js operates the constellation's gold standard"). What is GENUINELY absent, verified live this session, is three things:

| Absent apparatus | Witness on today's tree | Digest anchor |
|---|---|---|
| the eslint-flat + dep-cruiser lint-tier | `ls .eslintrc* eslint.config.* .dependency-cruiser*` → no matches (verified — `O.md:50` "no eslint/dep-cruiser config exists"); `check` = `tsc --noEmit` only (`package.json:35`) | O Band A carry (M.W2 → O.W1 → P.W1) |
| a bench scenario covering the SIMD/codegen/SoA-compositor frontier | `taxonomy.json` classifies 42 cases but the SoA arms are the J.W6 **interp-buffer** SoA (per-frame numeric leaf), NOT the **compositor** SoA (the AnimationGroup blend fold P.W2 builds); zero codegen-parse arm; zero `color2Into`-consume arm | K1/K3 + V1-N2 codegen |
| a portable perf-gate the aggressive optimizations can author against | `ci-env.mjs` declares the posture taxonomy + `taxonomy.json` carries `baselineCase`×`floorFraction` ratios — but ONLY for the warmEngine + spring-vector + J.W6-SoA arms; no SHARED "ratio vs a portable anchor (JSON.parse / a same-report baseline)" helper a NEW gate imports | X1 (the portable ratio gate) + K3 (the portability spine) |

### The portable-perf-gate spine (the owner mandate — PORTABLE, ratio-normalized)

The owner mandate is **aggressive optimization** (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md:15-18`). Every aggressive idea in Band B is a perf claim, and a perf claim is only honest if its gate is **device-independent**. The device-dependence-greening lesson (`project_ci_device_dependence_greening`) is the constraint: a gate that passes on macOS must NOT flake RED on the slow Linux runner for a DEVICE reason. The O.W8 portability spine is the ratified discipline (`O.W8.md` "the portability spine"): every HARD predicate is a **same-report ratio** (`baseHz × frac`, numerator and denominator measured on the same runner in the same pass — device-independent BY CONSTRUCTION); the absolute wall-clock magnitude survives ONLY as an `observe-only` note (`ci-env.mjs:declarePosture("observe-only", {reason})`). P.W1 generalizes this: it authors the ONE helper a new perf gate imports so it never re-implements the ratio math, and it ratifies "ratio vs JSON.parse" as the portable cross-engine anchor (the value.js `proof-perf-target.mjs` pattern — `AUDIT-DIGEST.md` X1: "the rationally portable proof:perf-target (css/json.parse ratio)").

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|------------------------------|
| lint-absent | `ls .eslintrc* eslint.config.* .dependency-cruiser*` | NO matches — the lint-tier is UNBUILT (the O.W1/M.W2 carry) |
| check-is-tsc | `package.json:35` | `"check": "tsc --noEmit"` — the only static check; no eslint, no dep-cruiser |
| bench-roster | `ls bench/*.bench.ts` | 10 `.bench.ts` files + `taxonomy.json` — the "no bench" premise is FALSE (`CONSTELLATION-OPTIMIZATION-CAMPAIGN.md:20-22`) |
| taxonomy-gold | `bench/taxonomy.json:42-...` (42 cases, 4 categories) | the gold-standard manifest (`AUDIT-DIGEST.md` X1); but its SoA arms are interp-buffer (numeric leaf), NOT the compositor |
| posture | `scripts/lib/ci-env.mjs:declarePosture` | the 3-posture taxonomy (`hard`/`observe-only`/`runner-calibrated`) — the device-honesty authority; an `observe-only` without a `reason` THROWS |
| ratio-arm | `bench/taxonomy.json` (the J.W6 SoA + spring-vector budgeted cases) | `baselineCase`×`floorFraction` ratios EXIST for 3 arms — the pattern P.W1 generalizes into a shared helper |
| decision-record | `scripts/spring-vector-decision.json` | the durable ADOPT/KILL verdict shape (`ratio`, `winFraction`, `verdict`, `recordedAt`) — the P-inv-28 terminal-home pattern for every aggressive idea |
| portable-anchor | `AUDIT-DIGEST.md` X1 §recs | value.js `proof-perf-target.mjs` is "device-independent (ratio vs JSON.parse)" — the cross-engine portable anchor P.W1 ratifies for kf |
| bench-taxonomy-gate | `package.json:68` (`proof:bench-taxonomy`) | the existing coverage gate P.W1 EXTENDS with the new scenario classes (codegen, compositor-SoA, color2Into-consume) |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** authors the eslint-flat + dep-cruiser lint-tier (the O Band A carry) + wires it into `check`/`proof:hygiene`. **S2** EXTENDS the bench taxonomy with the optimization-frontier scenario classes (compositor-SoA, codegen-parse, color2Into-consume) as pendingBudgeted arms — the coverage manifest the Band-B waves graduate. **S3** authors `proof:portable-perf` — the ONE shared ratio-gate helper a new perf gate imports, ratifying the JSON.parse portable anchor + the same-report ratio discipline. **S4** wires the apparatus into CI with the correct posture. Every move is the floor the aggressive Band-B optimizations stand on — NONE a strategy change, NONE a workaround.

---

### S1 — the eslint-flat + dep-cruiser lint-tier (the O Band A carry)

**Breach.** `check` is `tsc --noEmit` ONLY (`package.json:35`). No eslint config exists (`ls .eslintrc* eslint.config.*` → no matches), no dep-cruiser config exists (`ls .dependency-cruiser*` → no matches). M.W2 developed the lint-tier; O.W1 scoped it; neither implemented it (`O.md:50` "no eslint/dep-cruiser config exists"). The LIGHT/HEAVY boundary is gated by `proof:boundary` (a bespoke bundle-graph script), but the SOURCE-graph invariants (no circular imports, no `internal/` leaf importing the engine, no LIGHT module statically importing value.js) have no STATIC lint floor — they are caught only at the bundle stage, late.

**Cure.** Author `eslint.config.js` (flat config — the Node ≥22 + ESM idiom) with the strict-mode rule-set the conventions mandate (`@typescript-eslint`, `import/no-cycle`, `import/order` co-operating with the prettier organize-imports plugin) and `.dependency-cruiser.cjs` with the architectural-boundary rules: (a) `internal/` leaves may NOT import `../engine` or `@mkbabb/value.js` (the value.js-free-leaf law); (b) the LIGHT barrel exports may NOT statically reach `./engine` (a STATIC pre-flight of what `proof:boundary` bundle-verifies — the same invariant, caught one tier earlier); (c) no circular dependency in `src/animation/`. Add `"lint": "eslint . && depcruise src"` to `package.json` scripts and into `proof:hygiene` (`package.json:194`).

**Constraint (idiomatic, KISS).** The lint-tier is a STATIC pre-flight that AGREES with `proof:boundary` (the runtime authority) — it does NOT replace it. dep-cruiser's boundary rules are the cheap source-graph guard; `proof:boundary` stays the bundle-graph oracle (`animation/CLAUDE.md` "gated in CI by proof:boundary"). No rule duplicates a `proof:*` gate's semantic; the lint floor catches the violation at edit time, the bundle gate confirms it at build time.

**Gate bite.** `proof:lint-clean` (NEW): `eslint.config.js` + `.dependency-cruiser.cjs` exist and `npm run lint` exits 0 on the clean tree. BITE: plant a circular import (`internal/leaves.ts` imports `../engine`) → `depcruise` reds; today the file does not exist so the gate cannot run → RED.

---

### S2 — EXTEND the bench taxonomy to the optimization-frontier scenario classes (the coverage manifest Band B graduates)

**Breach.** `taxonomy.json` is gold-standard but covers the O-era frontier (the J.W6 interp-buffer SoA, the spring-vector sugar, warmEngine). It carries ZERO case for the Band-B optimization frontier: (1) the **compositor-SoA** arm (the AnimationGroup `Float64Array` blend fold — P.W2; the existing SoA arms are interp-buffer NUMERIC-LEAF, NOT the group composite — `taxonomy.json` "K=8 … SoA Float64Array+lerpArray" is `interpFrames`, not `transformFramesGrouped`); (2) the **codegen-parse** arm (the BBNF-generated parser throughput vs the hand-rolled combinator baseline — V1-N2, the §4 spine; guarded against the A.W3 runtime-dispatch falsification); (3) the **color2Into-consume** arm (the value.js-P gamut zero-alloc tail measured kf-side — the K1 densify-COMPILE cross-repo frontier). An aggressive optimization with no bench scenario has no born-RED gate — the campaign's falsify-first mandate is unmet.

**Cure.** EXTEND `bench/taxonomy.json` and `proof:bench-taxonomy` (`scripts/proof-bench-taxonomy.mjs`) with three NEW scenario classes, authored as `pendingBudgeted` entries (the born-RED witness shape O.W8 used — a manifest case naming a bench arm the cure has not shipped yet, so the gate REDs until the arm exists):

1. **compositor-SoA** (P.W2 graduates): a `bench/group-composite.bench.ts` suite with the baseline (the current `transformFramesGrouped` boxed-leaf blend over `_grouped`) + the SoA twin (the contiguous `Float64Array` fold indexed by `_groupedKeys`). Budgeted `floorFraction` ratio = `1.2` against the boxed baseline (the J.W6 ADOPT threshold) — the SAME `baselineCase`×`floorFraction` device-independent shape. Plus an alloc-count arm (heap-delta) on the group draw path.
2. **codegen-parse** (P.W4 graduates, GATED): a `bench/codegen-parse.bench.ts` suite with the hand-rolled value.js combinator parser baseline + the BBNF-generated straight-line scanner. Budgeted ratio = `0.85` (close the documented 0.58x BBNF-vs-hand-rolled gap toward ≥0.85x — `CONSTELLATION-OPTIMIZATION-CAMPAIGN.md:92`), guarded by a parity clause (the generated parser's output `deepEquals` the hand-rolled output over the VALUE_CORPUS — a generated parser that is faster but WRONG reds). This arm is `crossRepo`-tagged (the generated parser ships from value.js P / parse-that B; kf consumes).
3. **color2Into-consume** (K1 densify-COMPILE, cross-repo): extend the `crossRepo[]` array with the value.js-P `color2Into` ask (the gamut bisection `~84 → <12` allocs/call — `AUDIT-DIGEST.md` V1-N1), measured kf-side via the `bench/color-interp.bench.ts` densify-COMPILE arm (O.W8 S2 authors the file; P.W1 adds the budgeted graduation trigger on the value.js-P re-pin).

**Constraint (MEASURE-FIRST, observable-truth).** Each new arm is born `pendingBudgeted` (the L.W7 MEASURE-FIRST discipline — no floor until a measurement run records the baseline; `taxonomy.json:$comment` "no unproven code"). The taxonomy STRUCTURE (every new class covered, every cross-repo ask present) is device-INDEPENDENT and HARD everywhere; the wall-clock magnitude is observe-only. No arm asserts an absolute hz floor — every floor is a `baselineCase`×`floorFraction` same-report ratio (the K3 portability spine).

**Gate bite.** `proof:bench-taxonomy` coverage clause: the manifest names `bench/group-composite.bench.ts` + `bench/codegen-parse.bench.ts` cases the bench REPORT cannot contain (the suites do not exist) → coverage reds (`proof-bench-taxonomy.mjs` "a manifest case with no report row"). BITE: drop a new scenario class from the manifest → the Band-B wave that graduates it has no born-RED gate; the cross-repo VJ ask silently un-tracked.

---

### S3 — `proof:portable-perf`: the ONE shared ratio-gate helper (the portability spine, crystallized)

**Breach.** The `baselineCase`×`floorFraction` ratio math is RE-IMPLEMENTED per budgeted arm inside `proof-bench-taxonomy.mjs` and `proof-spring-vector.mjs`. A NEW perf gate (P.W2's compositor-SoA, P.W4's codegen-parse) must re-derive: read the vitest `--outputJson`, match the baseline + candidate case by name, compute `candHz / baseHz`, compare to `floorFraction`, route the miss through `declarePosture`. Five steps, copy-pasted — the exact "per-bench process.exit() duplication" the X1 novel idea names (`AUDIT-DIGEST.md` X1 §recs "Eliminates the per-bench process.exit() duplication"). And the **portable cross-engine anchor** (ratio vs JSON.parse — the only normalizer that holds across V8/JSC/SpiderMonkey, `AUDIT-DIGEST.md` X1) is NOT ratified in kf at all (it lives only in value.js's `proof-perf-target.mjs`).

**Cure.** Author `scripts/lib/portable-perf.mjs` — one helper exporting `ratioGate({ report, baselineCase, candidateCase, floorFraction, posture, reason })` that: (a) reads a vitest bench `--outputJson` report, (b) extracts the `{baseHz, candHz}` pair from the same report (device-independent BY CONSTRUCTION), (c) computes the ratio, (d) routes the miss through `declarePosture(posture, {reason})` from `ci-env.mjs` (the existing authority — NO new posture system), and (e) records the durable verdict in a `*-decision.json` beside `spring-vector-decision.json` (the P-inv-28 terminal-home shape). Plus `jsonParseAnchor()` — the portable cross-engine normalizer (the candidate's MB/s ÷ an in-run `JSON.parse` MB/s ≥ a floor, the value.js `proof-perf-target.mjs` pattern), so a codegen-parse throughput claim is auditable from ANY machine. Wire it as `proof:portable-perf` and import it from P.W2/P.W4's new gates (they call `ratioGate`, never re-derive).

**Constraint (no-legacy, single-seam, gestalt).** After this cure there is ONE ratio-gate path: `ratioGate()` over `ci-env.mjs`'s `declarePosture`. `proof-bench-taxonomy.mjs` + `proof-spring-vector.mjs` are REFACTORED to import it (the re-implemented ratio math deleted, not left beside — no-legacy). No new posture taxonomy is invented (the X4-radical "extract ci-env to a package" idea is NOT this wave — the helper imports the existing module; copy-commit/extraction is a constellation-shared concern recorded, not built). KISS: the helper is the ratio + the anchor + the decision-record, nothing more.

**Gate bite.** `proof:portable-perf` self-test clause: a fixture report with `candHz = 0.5 × baseHz` and `floorFraction = 1.2` → the helper REDs locally (HARD) and NOTES in CI (observe-only with a stated reason). BITE: an aggressive idea ships a gate with a hardcoded absolute `floorHz` instead of a `ratioGate` call → `proof:portable-perf` lint clause reds (no budgeted arm may carry an absolute wall-clock HARD predicate — the K3 "no absolute floorHz survives as a HARD predicate").

---

### S4 — wire the apparatus into CI with the correct posture (the floor, live)

**Breach.** The lint-tier (S1) + the new bench scenarios (S2) + the portable-perf helper (S3) are inert until wired into the gate roster. `proof:hygiene` (`package.json:194`) is the blocking aggregator for static/structural gates; `proof:correctness` (`package.json:193`) for runtime. A new gate not in an aggregator is a dead gate (the `proof:ci-coverage` discipline — every gate is reachable from an aggregator or EXCLUDED-with-reason).

**Cure.** Wire: `proof:lint-clean` into `proof:hygiene` (it is a static source-graph gate, HARD everywhere — lint is device-independent). `proof:bench-taxonomy` already rides `proof:hygiene` (the EXTENDED taxonomy lands automatically; the new scenario classes are covered as the manifest grows). `proof:portable-perf` into `proof:hygiene` with the budgeted arms declaring `observe-only` posture in CI (the wall-clock magnitude is device-dependent; the STRUCTURE — every scenario classified, every ratio same-report — is HARD; the device-dependence-greening posture). Update `scripts/proof-ci-coverage.mjs` so the new gates are aggregator-reachable (no silent EXCLUDED).

**Constraint (CI honesty — the device-dependence-greening law).** The lint-tier is HARD in CI (eslint/dep-cruiser are device-independent — a circular import is a circular import on any runner). The bench arms are observe-only in CI for their wall-clock MAGNITUDE but HARD for their STRUCTURE + their same-report RATIO (the K3 portability spine — a 2× regression in the ratio reds HARD; only the absolute number is observe-only). No device-independent gate routes through observe-only to paper a flake (the `ci-env.mjs` no-workaround prohibition).

**Gate bite.** `proof:ci-coverage` clause: `proof:lint-clean` + `proof:portable-perf` are reachable from `proof:hygiene` (not orphaned, not silently EXCLUDED). BITE: author a new perf gate but forget to wire it → `proof:ci-coverage` reds (a gate exists in `package.json` scripts but no aggregator reaches it).

---

## Born-RED gate

**Gate:** `proof:lint-clean` (NEW — `scripts/proof-lint-clean.mjs` asserting the lint config exists + `npm run lint` exits 0) + `proof:portable-perf` (NEW — `scripts/proof-portable-perf.mjs` over `scripts/lib/portable-perf.mjs`) + the EXTENDED `proof:bench-taxonomy` (the new compositor-SoA / codegen-parse / color2Into scenario classes). Born-RED on today's tree, before any config/helper/scenario artifact exists.

**The REAL observable per arm (observable-truth — each bites the genuine absence, not a source-grep proxy).**

| Arm | The REAL observable the gate bites | Born-RED witness on today's (2026-06-20) tree |
|-----|-------------------------------------|------------------------------------------------|
| S1 lint-tier | `eslint.config.js` + `.dependency-cruiser.cjs` absent; a circular import (`internal/leaves.ts` → `../engine`) passes `tsc` silently | `ls eslint.config.* .dependency-cruiser*` → NO matches → `proof:lint-clean` cannot run → RED; PLANT a circular import → `tsc --noEmit` greens it (no source-graph lint floor) |
| S2 compositor-SoA coverage | a classified `group-composite` SoA case absent from the bench REPORT | `bench/group-composite.bench.ts` ENOENT → the manifest names a case the report cannot contain → coverage clause reds |
| S2 codegen-parse coverage | a classified `codegen-parse` case absent + no parity clause | `bench/codegen-parse.bench.ts` ENOENT (the generated parser does not exist — parse-that B / value.js P un-shipped) → coverage + parity reds |
| S3 portable-perf (**KEYSTONE**) | a budgeted arm carrying an ABSOLUTE `floorHz` HARD predicate instead of a same-report ratio | `scripts/lib/portable-perf.mjs` ENOENT → no shared ratio-gate exists → a NEW perf gate would copy-paste the ratio math + could hardcode an absolute floor that flakes RED on the slow runner (the device-dependence the spine forbids) |
| S4 ci-coverage | `proof:lint-clean` / `proof:portable-perf` orphaned (in scripts, no aggregator reaches them) | the gates do not exist → cannot be wired → `proof:ci-coverage` would red the moment they are authored-but-unwired |

**The portability spine (the owner mandate — PORTABLE perf gate, ratio-normalized).** Every HARD predicate P.W1 ships is device-INDEPENDENT: the lint-tier (a circular import is a circular import on any runner), the taxonomy STRUCTURE (every scenario classified), and the same-report RATIO (`baseHz × frac`, numerator and denominator from the same pass). The absolute wall-clock magnitude survives ONLY as an `observe-only` note via `declarePosture("observe-only", {reason})` — NEVER as a HARD CI predicate. This is the floor every Band-B aggressive idea spends: the compositor-SoA ratio (P.W2), the codegen-parse throughput-vs-parity (P.W4), the Typed-OM DOM-write cost (P.W3) all author their born-RED gate by CALLING `ratioGate()`, never re-deriving.

**How each is born-RED (plant-a-failure).** S1 reds because the lint config files are absent (the gate cannot run) AND a planted circular import passes `tsc` silently (proving the lint floor is genuinely missing, not redundant with the existing `check`). S2 reds because the new bench suites are absent — the coverage clause runs `vitest bench` and finds a manifest case with no report row (cannot be gamed by a stub). S3 reds because `portable-perf.mjs` is absent — there is no shared ratio helper, so a perf gate authored today would either copy-paste the math or hardcode an absolute floor (the keystone failure: the apparatus the aggressive optimizations REQUIRE does not exist). S4 reds the moment a new gate is authored-but-unwired. Each born-RED witness is the REAL absence measured live — never a source grep that a stub could green.

**Green condition.** `eslint.config.js` + `.dependency-cruiser.cjs` authored + `npm run lint` exits 0 + the boundary rules bite a planted circular import (S1); the taxonomy EXTENDED with the compositor-SoA + codegen-parse + color2Into scenario classes as `pendingBudgeted` arms (S2); `scripts/lib/portable-perf.mjs` authored with `ratioGate` + `jsonParseAnchor` + the decision-record, `proof-bench-taxonomy.mjs` + `proof-spring-vector.mjs` REFACTORED to import it (S3); all three new gates wired into `proof:hygiene` with the correct posture, `proof:ci-coverage` green (S4). The apparatus floor is LIVE — Band B's aggressive optimizations have their measurement substrate, and no absolute `floorHz` survives as a HARD predicate.

---

## Dependencies

- **O.W8 ratified (the measurement wave) — already developed.** O.W8 closed 7 un-measured gaps (S1–S9) and ratified the portability spine + the `baselineCase`×`floorFraction` ratio shape. P.W1 EXTENDS that taxonomy (the new scenario classes) and CRYSTALLIZES the spine into a shared helper. P.W1 does NOT re-author O.W8's bench files (`bench/numeric-soa.bench.ts`, `bench/color-interp.bench.ts` — O.W8 S1/S2 own those); it ADDS the compositor + codegen + color2Into classes O.W8 did not scope.
- **`ci-env.mjs` — already shipped** (`scripts/lib/ci-env.mjs`, the `declarePosture` posture authority). P.W1's `portable-perf.mjs` IMPORTS it; it does NOT re-implement the posture taxonomy (the X4-radical ci-env-extraction idea is recorded, not built — a constellation-shared concern).
- **Independent of every sibling publish — pure NOW.** The lint-tier, the taxonomy STRUCTURE extension, and the portable-perf helper fire entirely on today's installed tree. The codegen-parse + color2Into scenario classes are AUTHORED born-RED (the manifest names them) but their BUDGETED graduation is GATED on parse-that B / value.js P (S2's `crossRepo`-tagged arms) — the manifest tracks the cross-repo frontier without waiting on it (the O.W8 crossRepo discipline).
- **Feeds P.W2 + P.W3 + P.W4 (the Band-B floor).** Every Band-B aggressive idea authors its born-RED gate by calling `ratioGate()` (S3) and graduates a scenario class P.W1 added to the taxonomy (S2). P.W1 lands FIRST in the band ordering (`P.md:175` "Band A (the apparatus) lands FIRST"); without it the perf claims have no portable born-RED gate.
- **NO glass-ui publish dep, NO value.js publish dep (for the NOW arms), NO parse-that dep (for the NOW arms).** Pure-NOW apparatus; the GATED graduations are tracked-not-waited.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W1 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the codegen-parse + color2Into arms are DISPATCH-tracked cross-repo frontiers, never foreign-tree edits). The IMPLEMENTATION (the eslint/dep-cruiser config, the taxonomy extension, the `portable-perf.mjs` helper, the CI wiring) opens only on the owner's explicit authorization. When it opens it is gate-first (`proof:lint-clean` + `proof:portable-perf` authored born-RED BEFORE the configs/helper land), observable-truth (the lint floor bites a planted circular import; the taxonomy coverage bites a missing report row; the portable helper bites an absolute-floor HARD predicate), no-legacy (the re-implemented ratio math DELETED from `proof-bench-taxonomy.mjs`/`proof-spring-vector.mjs`, not kept beside; the lint floor AGREES with `proof:boundary`, never duplicates it), KISS (the helper is the ratio + the anchor + the decision-record), gestalt (ONE ratio-gate path over the existing `ci-env.mjs` posture authority), and P-invariant-28 (the lint-tier carry M.W2→O.W1→P.W1 TERMINATES here as a BUILD-IN — not a 4th ride; every aggressive idea's verdict gets a durable `*-decision.json` terminal home).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 lint-tier | A circular import or a LIGHT-module-imports-value.js boundary breach lands silently (passes `tsc --noEmit`) and is caught only LATE at the bundle stage — or not at all; the architectural boundary has no static source-graph floor (the O Band A carry rides a 4th tranche) |
| S2 taxonomy extension | An aggressive Band-B optimization (the compositor-SoA fold, the codegen parser) ships with NO bench scenario → no born-RED gate → the campaign's falsify-first mandate is unmet (a perf claim with no portable measurement) |
| S3 portable-perf (keystone) | A perf gate hardcodes an absolute `floorHz` that passes on macOS and flakes RED on the slow Linux runner for a DEVICE reason (the device-dependence-greening lesson) — OR the ratio math is copy-pasted per gate (the X1 per-bench-process.exit duplication) |
| S4 ci-wiring | A new apparatus gate is authored but unreachable from any aggregator (a dead gate) — `proof:ci-coverage` would silently shrink; the lint floor / portable-perf helper never run in CI |

---

## Excluded from this wave

- **The engine optimizations themselves** (the compositor SoA fold, the Typed-OM write path, the codegen-consume) — those are P.W2/P.W3/P.W4. P.W1 builds ONLY the apparatus they spend (the lint floor + the bench scenario classes + the portable ratio helper).
- **Extracting `ci-env.mjs` to a constellation-shared npm package** (the X4-radical idea) — recorded, NOT built. P.W1's helper IMPORTS the existing module; a copy-commit/extraction across three repos is a separable constellation-coordination concern.
- **The constellation-bench-registry.json** (the X1 novel idea — a shared DAG-root registry all three repos contribute to) — recorded as a cross-repo apparatus item; kf's `crossRepo[]` array (S2) tracks the value.js/parse-that asks WITHOUT a shared registry file (the registry is a value.js-P / parse-that-B authoring concern, dispatch-tracked).
- **Authoring the value.js / parse-that bench gates** (the X1 finding "parse-that has ZERO bench infrastructure in CI") — those are DISPATCHES (`KF-TO-VALUEJS-P.md` / `KF-TO-PARSETHAT-B.md`), never a kf write (inv-16).
- **O.W8's bench files** (`bench/numeric-soa.bench.ts`, `bench/color-interp.bench.ts`) — O.W8 S1/S2 own those; P.W1 ADDS the NEW scenario classes O.W8 did not scope (compositor-SoA, codegen-parse, color2Into-graduation).
