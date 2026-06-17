# Lane 18 — precept-contrivance: the runtime-ONLY precept and the data-model chronic class

**Lane:** 18 · **Tranche:** M (development audit) · **Date:** 2026-06-17
**Status:** ANALYSIS ONLY. Read-only. No gate changed, no code written, no `proof:all` re-run.
All claims verified against ground truth (package.json, gate scripts, PROGRESS.md, FINAL.md,
gate-apparatus audit docs). File:line anchors for every structural assertion.

---

## 1. THE QUESTION

The `proof:gate-is-runtime` + `proof:chronic-closure` precept forces every **correctness gate and
every chronic-closure oracle** through a browser oracle — a gate that opens a real Playwright
browser over the built `dist/gh-pages/` SPA and **actuates** the running product. The governing
precept text:

> A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME
> surface the human uses, with an ERROR BUDGET OF ZERO across the human's interaction battery
> (PLAY + SWITCH + DRAG). A gate whose oracle is source text, a jsdom unit, a serialized snapshot,
> a self-captured baseline, a design-token number, or a paperwork ledger is a HYGIENE gate, not a
> CORRECTNESS gate, and MUST be LABELED as such.
>
> — `scripts/proof-gate-is-runtime.mjs:8–24`

This precept was born in Tranche I from a REAL recorded bug class: source-shape gates green-lit an
**over-removal blank-out** (`docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`) and the
ROOT-A appearance misses (`docs/tranches/H/audit/a-gate-blindspots.md:21,82`). Those are UI/layout
regressions where the running product rendered blank or wrong while every gate passed — the kind of
defect that only a browser-over-dist oracle catches. The precept is correct for that class.

L then implemented the **replay-equality FLOOR** (L.W1) and the **compiler completeness** (L.W2)
gates — both closing chronic defects in the round-trip data model:

- `proof:replay-equality` (`node scripts/proof-replay-equality.mjs && vitest run test/replay-equality.test.ts`)
- `proof:compile-replay` (`node scripts/proof-compile-replay.mjs && vitest run test/compile-roundtrip.test.ts`)
- `proof:ingest-replay` (`node scripts/proof-ingest-replay.mjs && vitest run test/ingest.test.ts`)

**None of these open a browser.** Verified:

```
grep -c "demo-driver|withPage|withBrowser|serveDist|chromium" scripts/proof-replay-equality.mjs
→ 0
grep -c "demo-driver|withPage|withBrowser|serveDist|chromium" scripts/proof-compile-replay.mjs
→ 0
grep -c "demo-driver|withPage|withBrowser|serveDist|chromium" scripts/proof-ingest-replay.mjs
→ 0
```

These are correctly placed in the **HYGIENE tier** (`proof:hygiene`), not the correctness tier:

```python
# verified against package.json
proof:replay-equality in correctness: False  / in hygiene: True
proof:compile-replay in correctness: False   / in hygiene: True
proof:ingest-replay in correctness: False    / in hygiene: True
proof:roundtrip-fidelity in correctness: False / in hygiene: True
```

The L close ledger (`PROGRESS.md §"Open deferrals"`) accommodated them via the **RUNTIME-BAND
CITATION CONTRACT** (`PROGRESS.md:277–283`):

> A FOLD row's CLOSURE-CELL grammar is exact: any `` `proof:*` `` it backticks is treated as a
> load-bearing closure ORACLE that MUST — once authored in the impl phase — resolve to a
> `package.json` key, run in the `proof:correctness` tier, AND be a RUNTIME gate. A HYGIENE /
> source-shape gate is named in PLAIN PROSE and the row's terminal mechanism is the non-gate
> keyword the parser's `nonGateMechanism` clause reads.

DL-L1's closure cell names `proof:replay-equality` in **plain prose** (no backtick-quoting), not as
a load-bearing oracle. The `proof:chronic-closure` parser's `gateNames()` function uses
`` /`(proof:[a-z0-9-]+)`/gi `` — only backtick-quoted names are load-bearing
(`proof-chronic-closure.mjs:296–305`). So `proof:replay-equality` is NOT treated as a load-bearing
gate by the parser; instead, the keywords `node probe`, `fixture`, and `corpus` in the closure cell
satisfy the `nonGateMechanism` clause (`proof-chronic-closure.mjs:408`), which reads:

```js
/REWRITTEN|tarball|measured|bench|node probe|grep|build root|<title>|drift-gated|
relocat|annotation|pointer-only|deleted|typed|removed|UNexported|fixture|corpus/i
```

This is the mechanism L used to close data-model chronics without a browser oracle. It **works**.
The gate passes. The chronic is closed. But the escape is a **workaround-tier prose trick** — the
citation contract and the `nonGateMechanism` regex are a bespoke escape valve that is NOT
documented as a first-class design axis.

The `proof:transport-events` gate (L.W5) exposed the same seam from the other side: it was
initially mis-tiered into `proof:correctness` at commit `29bf376`, which caused
`proof:gate-is-runtime` to exit 1 (recorded at `FINAL.md:295–300`). The cure was to move it to
`proof:hygiene` — but this was treated as a reconciliation red to fix, not as evidence that the
two-tier architecture needs a principled middle axis.

---

## 2. THE ACTUAL ARCHITECTURE (as-built in L)

The gate suite is not truly "runtime-ONLY" for correctness — it is a **two-tier system where the
axes are conflated**:

| Gate class | Examples | Runner | Tier | Oracle character |
|---|---|---|---|---|
| UI/interaction correctness | `proof:live-session`, `proof:drag-gesture`, `proof:specular-absent-at-rest` | Playwright browser over built dist | `proof:correctness` (18 members) | Human-observable product property: rendered pixel, pointer actuation, zero-budget |
| Data-model correctness | `proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`, `proof:transport-events`, `proof:orchestration` | node + vitest (jsdom or compiled barrel, no browser) | `proof:hygiene` | Data-model contract: round-trip identity, serialize/parse symmetry, API contract |
| Source-shape hygiene | `proof:boundary`, `proof:decomposition`, `proof:no-dup-utility` | node (pure fs/grep) | `proof:hygiene` | Structural invariant: import edges, file sizes, selector patterns |

The data-model class is **distinct from both the UI-correctness and the source-shape classes**:

- It is NOT source-shape — `proof:replay-equality` runs the actual compiled engine's
  `fromString`/`CSSKeyframesToString` over real fixture inputs and asserts round-trip identity. The
  test **fails if the engine produces wrong output**. A source-shape gate cannot catch this (it
  cannot see what the engine produces at runtime).
- It is NOT UI/interaction — a parse/serialize round-trip has **no browser to drive**, no
  human-observable pixel, no pointer actuation. The oracle is a data contract, not a rendered
  surface. Forcing it through Playwright would add `withPage` boilerplate for zero gain — there is
  no DOM, no CSS cascade, no viewport to observe.

The gate-apparatus audit (`gate-apparatus-B-contrivance.md:Q4`) already named this clearly:

> The precept says "open a real browser over the built dist and actuate." It does NOT say "spawn a
> fresh chromium + a fresh http server in a fresh node process per gate."
> — `gate-apparatus-B-contrivance.md:315–319`

That doc focused on the implementation contrivance (per-process cold chromium). But the deeper
question — whether the runtime-ONLY rule is the right precept for the data-model class — was not
directly addressed. The L close sidestepped it via the `nonGateMechanism` prose escape, which is
technically correct but architecturally silent.

---

## 3. THE REAL-BUG JUSTIFICATION FOR THE RUNTIME PRECEPT (read carefully — the precept is RIGHT for
its target class)

The runtime precept is correct and should NOT be weakened for the UI/interaction class. Evidence:

- **Over-removal blank-out** (`rootcause-rc-gate-blindspot.md:164`): a source-shape gate
  green-lit a code deletion that caused the running product to render blank. Only
  `proof:subject-animates` (browser over built dist, writes to the real DOM target) caught this.
- **ROOT-A appearance misses** (`a-gate-blindspots.md:21,82`): H's entire gate corpus was
  "STATIC GREP or NARROW RUNTIME ASSERTION" with zero pixel/visual-regression oracle, missing
  D1/D3/D4/D6/D7/D10 appearance/layout regressions.
- **The K CI-greenify epic** (`project_ci_device_dependence_greening`): 259 fixed-ms
  `waitForTimeout()` sleeps (the macOS-pass/Linux-fail root) lived in browser gates precisely
  because those gates touch device-dependent timing. A jsdom gate cannot see this class.

These failures are **UI/interaction failures**. The browser-over-dist precept is the correct cure.
It is **not contrived** for the UI/interaction class. The 18-member correctness tier is correctly
all-browser.

---

## 4. THE ACTUAL CONTRIVANCE: CONFLATING TWO ORTHOGONAL AXES INTO ONE TIER

The contrivance is not the runtime precept itself — it is the **absence of a named
data-model-correctness axis** in the formal tier architecture. The result:

1. **Data-model gates live in `proof:hygiene`** alongside lint-class source-shape gates
   (`proof:boundary`, `proof:decomposition`, `proof:no-dup-utility`). These are not the same class:
   - A source-shape gate asserts a structural property of the source tree (file sizes, import
     edges). It cannot be wrong about the running engine's behaviour.
   - A data-model gate asserts a **behavioural correctness property** of the compiled engine
     (round-trip identity, serialize/parse symmetry). It CAN be wrong in ways that cause real user
     bugs (`adapter.ts` silently drops `Declaration.important`; `format.ts` emits wrong per-stop
     composition; `frame-compiler.ts` throws on `entry`/`exit` selectors).
   Both live in `proof:hygiene` by current taxonomy.

2. **`proof:gate-is-runtime` ignores the data-model class** because it only audits correctness-tier
   members (`proof-gate-is-runtime.mjs:106–114`): the WAVE_HARD_GATES roster is derived from
   `proof:correctness` membership. A data-model gate in `proof:hygiene` is **invisible to the
   meta-gate's enforcement**.

3. **The `nonGateMechanism` prose escape in `proof:chronic-closure`** is the only formal
   acknowledgment that data-model chronics exist as a separate class — but it is a parser keyword
   list (`node probe|fixture|corpus|...`), not a typed axis. This means:
   - Any data-model closure that does NOT use one of these keywords would be RED on the
     `proof:chronic-closure` meta-gate (a false positive).
   - A future author who writes a data-model gate and backtick-cites it in a FOLD row's closure
     cell will cause `proof:chronic-closure` to demand it be a browser runtime gate (false
     requirement).
   - The axis is implicit, not machine-readable.

4. **The `proof:transport-events` mis-tiering incident** (`FINAL.md:295–300`) is the canary: the
   L.W5 author naturally tiered a data-model correctness gate (node, no browser, tests a compiled
   LIGHT barrel API) into `proof:correctness` because it is correctness-significant — the
   Sequence `.on()` event API is a product contract, not hygiene. `proof:gate-is-runtime` rightly
   rejected it (a data-model gate is not a browser gate). The CURE was to demote it to
   `proof:hygiene`, but that cure is **architecturally unsatisfying**: the Sequence event API IS
   correctness-significant; it just has the wrong oracle type for the UI/interaction axis.

---

## 5. THE REFORM: A TYPED TWO-AXIS ARCHITECTURE

The M-reform is **NOT** to weaken or remove the runtime precept. The precept's win — the
browser-over-dist oracle catches the blank-out class that jsdom/grep cannot — is earned and should
be preserved verbatim. The reform is to make the second axis **explicit and machine-enforced**
rather than a prose escape.

### 5.1 The two-axis formal taxonomy

```
CORRECTNESS-AXIS-1 (UI/interaction correctness):
  Oracle = human-observable product property through the real surface (rendered pixel, pointer
           actuation, zero error budget).
  Requirement = open a real browser over built dist/gh-pages/, actuate.
  Tier = proof:correctness.
  Meta-gate = proof:gate-is-runtime (unchanged).

CORRECTNESS-AXIS-2 (data-model correctness):
  Oracle = data contract over the compiled engine: round-trip identity, serialize/parse symmetry,
           API contract, compiled-artifact shape.
  Requirement = run over the COMPILED library (dist/keyframes.js or vitest jsdom over src), NOT
                source-shape grep. The gate must FAIL if the engine's output is wrong.
  Tier = proof:data-model (NEW — a named sub-tier within proof:hygiene or a parallel tier).
  Meta-gate = proof:gate-is-data-model (NEW — mirrors proof:gate-is-runtime but for the node/vitest
              class; asserts these gates import dist/keyframes.js or run vitest against src, never
              pure source grep).
```

### 5.2 The boundary between the two axes

The axis a gate belongs to is determined by **what its oracle can falsify**:

- If the oracle can only be false when a RENDERED/INTERACTIVE property is wrong → AXIS-1 (browser).
- If the oracle can be false when the DATA MODEL produces wrong output (independent of rendering)
  → AXIS-2 (node+vitest).
- If the oracle can only be false when SOURCE TEXT is wrong → LINT tier (not a correctness axis).

Worked examples from the L corpus:

| Gate | Oracle | Axis | Current tier |
|---|---|---|---|
| `proof:live-session` | 8-scene rendered sweep, pointer actuation | AXIS-1 | correctness ✓ |
| `proof:drag-gesture` | real pointer drag, zero selection | AXIS-1 | correctness ✓ |
| `proof:replay-equality` | parse→serialize→parse round-trip identity | AXIS-2 | hygiene (misclassed) |
| `proof:compile-replay` | compiled CSS replays numerically equal | AXIS-2 | hygiene (misclassed) |
| `proof:ingest-replay` | CSSOM ingest → replay continuity | AXIS-2 | hygiene (misclassed) |
| `proof:transport-events` | Sequence.on() fires correct event data | AXIS-2 | hygiene (after mis-tier fix) |
| `proof:orchestration` | sequence/flip/decay/stagger API contracts | AXIS-2 | hygiene (misclassed) |
| `proof:blend` | AnimationGroup layer blending math | AXIS-2 | hygiene (misclassed) |
| `proof:spring-vector` | SpringProgress vector-sugar API | AXIS-2 | hygiene (misclassed) |
| `proof:agent-validate` | validate()/explain() return contract | AXIS-2 | hygiene (misclassed) |
| `proof:boundary` | import edge (LIGHT never pulls value.js) | LINT | hygiene ✓ |
| `proof:decomposition` | file-size ceiling | LINT | hygiene ✓ |

### 5.3 The device-honesty win is NOT lost

The existing `declarePosture("observe-only", ...)` mechanism
(`scripts/lib/ci-env.mjs`, the CATEGORY taxonomy — wall-clock / pixel-render / physics-settle)
already correctly handles device-dependent gates. The two-axis reform does NOT touch that mechanism:

- AXIS-1 gates that are device-independent remain HARD.
- AXIS-1 gates that are device-dependent get `observe-only` with a CATEGORY — unchanged from L.

AXIS-2 gates are **structurally device-independent** (a parse/serialize round-trip has no
rendering, no animation timing, no viewport-dependent layout). They cannot be observe-only by
the device-dependence taxonomy because there is nothing device-dependent in them. The reform
formalizes this property rather than leaving it implicit.

### 5.4 The `proof:chronic-closure` reform

The `nonGateMechanism` prose escape (`proof-chronic-closure.mjs:408`) should become a
**typed disposition band** rather than a keyword grep:

Current (L): the closure cell uses a keyword (`node probe`, `fixture`, `corpus`) to signal
"this FOLD row closes via a data-model gate, not a browser gate."

Proposed (M): the PROGRESS.md ledger gains a typed disposition `DATA-MODEL` alongside
`FOLD`/`VERIFY-ONLY`/`RECORD`/etc. The `proof:chronic-closure` parser reads `DATA-MODEL` as a
band that applies **AXIS-2 rules** (gate must run over the compiled engine via node+vitest, not be
a source grep). The `nonGateMechanism` fallback REMAINS for backward compat but the new axis is
machine-readable.

---

## 6. PRECEPT VIOLATIONS FOUND IN L-AS-BUILT

### V1 — The data-model correctness axis is an implicit prose escape, not a typed precept

`proof:chronic-closure:408` uses a keyword grep (`node probe|fixture|corpus`) to allow data-model
closures. This is a workaround-tier solution to a first-class architectural need. It will cause
false positives if a future author writes a data-model gate and cites it with backticks in a FOLD
row.

Evidence: `proof-chronic-closure.mjs:408`, `PROGRESS.md:277–283` (the RUNTIME-BAND CITATION
CONTRACT), `PROGRESS.md:284` (DL-L1's plain-prose citation avoidance).

### V2 — Data-model correctness gates live in `proof:hygiene` beside lint-class gates

`proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`, `proof:transport-events`,
`proof:orchestration`, `proof:blend`, `proof:agent-validate` are all in `proof:hygiene`. So are
`proof:boundary` (an import-edge lint), `proof:decomposition` (a file-size lint), and
`proof:no-dup-utility` (a grep rule). These are different classes mixed in one tier. A developer
looking at `proof:hygiene` membership cannot distinguish "this is a correctness invariant over
compiled engine behaviour" from "this is a size ceiling lint."

Evidence: verified via `package.json` `proof:hygiene` chain, all of:
`proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`, `proof:transport-events`,
`proof:boundary`, `proof:decomposition` in the same chain.

### V3 — `proof:gate-is-runtime` is blind to AXIS-2 gates in the correctness class

`proof:gate-is-runtime` derives its roster from `proof:correctness` membership
(`proof-gate-is-runtime.mjs:106–114`). It correctly enforces that every correctness-tier member is
a browser gate. But AXIS-2 gates (`proof:replay-equality`, `proof:transport-events`) are in
`proof:hygiene`, so they are **invisible to the meta-gate**. A data-model gate in `proof:hygiene`
can be a pure source grep and `proof:gate-is-runtime` will not detect it. The
`proof:chronic-closure` gate would catch it (via rule 3 for backtick-cited gates), but only if the
author backtick-cites it in a FOLD row — there is no proactive enforcement.

No dedicated meta-gate asserts "every data-model correctness gate in `proof:hygiene` actually runs
over the compiled engine and is not a source grep."

### V4 — The `proof:transport-events` mis-tiering incident is a predictable failure mode of the current design

`FINAL.md:295–300` records: `proof:transport-events` was added to `proof:correctness` (natural for
a correctness-significant gate), `proof:gate-is-runtime` correctly rejected it (it has no browser),
and the cure was to move it to `proof:hygiene`. This is the CORRECT resolution per the current
architecture. But it is architecturally unsatisfying: the Sequence event API is
correctness-significant and the author's instinct to put it in the correctness tier was right —
the problem was the missing AXIS-2 category. Without a named second axis, this incident will recur
for every new data-model gate.

Evidence: `FINAL.md:295–300`; `docs/tranches/L/waves/L.W5.md` ("no browser, no demo build");
`package.json` `proof:transport-events in hygiene: True` (post-fix).

---

## 7. THE M-WAVE PROPOSAL

### M-wave candidate: `M.W? — The two-axis gate taxonomy` (Band: test-architecture, sub-wave of the gate-suite consolidation)

**What it does:**

1. **Author `proof:gate-is-data-model`** — the AXIS-2 meta-gate, mirroring `proof:gate-is-runtime`
   but for the node+vitest class. Asserts every AXIS-2 gate in `proof:hygiene`:
   - imports the compiled dist (`dist/keyframes.js`) OR runs `vitest` against src, NOT a bare
     `fs.readFileSync` tree grep,
   - does NOT import `scripts/lib/demo-driver.mjs` (that would make it AXIS-1),
   - has a named vitest fixture or a node script that loads the compiled engine.
   This is the AXIS-2 equivalent of "opens a browser AND actuates."

2. **Create a `proof:data-model` sub-aggregator** within `proof:hygiene` that holds the AXIS-2
   gates explicitly. This lets the developer immediately see which hygiene members are
   correctness-significant behavioural assertions vs. lint-class shape checks.

3. **Reform `proof:chronic-closure`'s `nonGateMechanism` clause**: replace the keyword grep with
   a typed `DATA-MODEL` disposition band in the ledger. The parser reads `DATA-MODEL` and applies
   AXIS-2 rules: the cited gate must import the compiled engine, not be a source grep.

4. **Carry the device-honesty win untouched**: the `declarePosture("observe-only", CATEGORY)`
   mechanism remains as-is. AXIS-2 gates are structurally device-independent (no rendering, no
   timing) so they require no `observe-only` declaration by construction.

**What it does NOT do:**

- It does NOT weaken or modify the browser-over-dist requirement for AXIS-1 (correctness tier).
  The 18-member browser-only correctness tier is correct and stays.
- It does NOT move data-model gates to the correctness tier. They correctly live in `proof:hygiene`
  (or a named sub-tier thereof). The enforcement meta-gate (`proof:gate-is-data-model`) lives in
  `proof:hygiene` alongside `proof:gate-is-runtime`.
- It does NOT change the `proof:gate-is-runtime` precept text, enforcement, or roster. It adds an
  orthogonal enforcement alongside it.
- It does NOT affect the `@vitest/browser` migration path (the gate-apparatus VERDICT
  recommendation): the AXIS-1 browser gates should migrate to `@vitest/browser` with a shared
  warm browser + one globalSetup dist server. The AXIS-2 gates already run under vitest; they
  migrate trivially (zero structural change needed).

**Born-RED gate:** `proof:gate-is-data-model` is born-RED on today's tree if authored now because
there is no `proof:data-model` sub-aggregator, no assertion that `proof:replay-equality` loads the
compiled dist vs. greps source, and no machine-readable AXIS-2 axis in `proof:chronic-closure`.
The gate must RED on the unformed tree and GREEN on the reformed tree.

---

## 8. DEFERRED FOLDS

### DF-1 — `proof:gate-is-data-model` meta-gate (the machine-enforcer)

**Owner:** whoever takes the gate-suite consolidation M-wave.
**Tripwire:** the `proof:data-model` sub-aggregator is authored AND the two-axis reform to
`proof:chronic-closure`'s disposition bands is landed.
**Status:** BOOK (gate-first — author the gate before any sub-aggregator, per the born-RED
discipline).

### DF-2 — Reclassify the AXIS-2 hygiene gates into a `proof:data-model` named sub-tier

Currently: `proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`,
`proof:transport-events`, `proof:orchestration`, `proof:blend`, `proof:motion-path`,
`proof:drawsvg`, `proof:finished`, `proof:agent-validate`, `proof:composition-honored`,
`proof:spring-blend-weight`, `proof:adapter-capture`, `proof:roundtrip-easing`,
`proof:scroll-roundtrip`, `proof:diagnostics-channel` all belong to the AXIS-2 class by their
oracle character (they run over the compiled engine, not source text, and their failure means the
engine's output is wrong). They should be grouped under a named `proof:data-model` sub-aggregator
(which is itself a member of `proof:hygiene`) so their correctness-significance is explicit.

**Owner:** gate-suite consolidation M-wave.
**Tripwire:** `proof:gate-is-data-model` authored and born-RED.

---

## 9. CROSS-REPO ASKS

None. This is a kf-internal gate-architecture reform. The sibling repos (value.js, glass-ui,
parse-that) are not involved — the two-axis taxonomy applies only to the kf gate suite.

The gate-apparatus VERDICT's @vitest/browser migration recommendation
(`gate-apparatus-VERDICT.md §2–§3`) is orthogonal to this reform and should proceed independently:
the AXIS-1 browser gates migrate to `@vitest/browser` + shared browser + one `globalSetup` dist
server; the AXIS-2 gates are already vitest and migrate trivially.

---

## 10. PERFORMANCE NUMBERS

The reform has a measurable payoff in the gate-apparatus context:

- Currently the `proof:hygiene` chain mixes AXIS-2 data-model gates (mean ~0.76s each for the
  node+vitest class, per `gate-apparatus-A-taxonomy.md §2`) with lint-class source-shape gates
  (mean ~0.32s). Neither is the bottleneck (the bottleneck is the 72 browser gates at 92–96% of
  wall-clock, per `gate-apparatus-A-taxonomy.md §2`).
- The naming reform itself costs ~0s (a package.json restructure, no new test work). The meta-gate
  `proof:gate-is-data-model` is a source-shape gate reading the AXIS-2 scripts — sub-second.
- The primary payoff is **DX, not raw speed**: a developer can now identify which hygiene members
  are correctness-significant without reading every script. In the iterate-to-green loop (the
  O(N²) serial chain, the 3-hour witness), knowing which tier a gate belongs to lets you triage
  failures faster.
- The `@vitest/browser` migration (the major wall-clock fix) is unblocked by this reform —
  the two-axis taxonomy makes the migration path cleaner because the AXIS-2 gates are already
  correctly structured for a vitest migration (no browser harness to replace).

---

## 11. THE VERDICT (stated plainly)

The `proof:gate-is-runtime` precept is **NOT a contrivance and should NOT be reformed away**. It is
the correct answer to the UI/interaction correctness problem, it catches real bugs that jsdom/grep
cannot, and the 18-member all-browser correctness tier is intentionally designed this way.

The **contrivance** is the conflation of three distinct gate classes — UI/interaction correctness
(AXIS-1), data-model correctness (AXIS-2), and lint-class source-shape — into a single
CORRECTNESS/HYGIENE binary. L resolved the tension via a prose escape (`nonGateMechanism` keyword
grep + plain-prose citation avoidance in the ledger). That escape works but is architecturally
silent: it is not machine-enforced, not documented as a precept, and will cause the
`proof:transport-events`-class mis-tiering incident to recur for every future data-model gate.

**The M-reform is to formalize the second axis, not to weaken the first.** A typed two-axis
taxonomy — AXIS-1 (browser, UI/interaction) + AXIS-2 (node+vitest, data-model) — with a dedicated
meta-gate (`proof:gate-is-data-model`) and a named sub-aggregator (`proof:data-model`) preserves
every bit of the device-honesty win while giving the data-model class its own enforcement rule.
This is an architectural transposition, not a relaxation.

---

## Evidence index (all claims reproducible, ground-truth verified 2026-06-17)

- Runtime precept text: `scripts/proof-gate-is-runtime.mjs:8–24`
- AXIS-1 roster: `package.json` `proof:correctness` chain (18 members, all verified browser)
- AXIS-2 no-browser confirmation: `grep -c "demo-driver|..." scripts/proof-replay-equality.mjs → 0`
  (replicated for `proof-compile-replay.mjs`, `proof-ingest-replay.mjs`)
- Tier placement of data-model gates: `package.json` — `proof:replay-equality in correctness: False,
  in hygiene: True` (replicated for `proof:compile-replay`, `proof:ingest-replay`,
  `proof:transport-events`, `proof:roundtrip-fidelity`)
- RUNTIME-BAND CITATION CONTRACT: `PROGRESS.md:277–283`
- `nonGateMechanism` keyword grep: `proof-chronic-closure.mjs:408`
- `gateNames()` backtick-only regex: `proof-chronic-closure.mjs:296–305`
- DL-L1 plain-prose citation: `PROGRESS.md:286` (no backtick-quoted `proof:replay-equality`)
- `proof:transport-events` mis-tiering incident: `FINAL.md:295–300`
- AXIS-2 oracle character of transport-events: `scripts/proof-transport-events.mjs:1–62` ("no
  browser, no demo build")
- Gate-apparatus contrivance audit (Q4): `gate-apparatus-B-contrivance.md:284–365`
- Real-bug justification for runtime precept: `rootcause-rc-gate-blindspot.md:164`;
  `a-gate-blindspots.md:21,82` (cited in gate-apparatus-B-contrivance.md:296–311)
- `proof:gate-is-runtime` roster derivation from `proof:correctness`:
  `proof-gate-is-runtime.mjs:106–114`
- Device-honesty taxonomy: `scripts/lib/ci-env.mjs` `declarePosture`, `gate-taxonomy.md`
- Gate-apparatus VERDICT (the @vitest/browser migration recommendation):
  `gate-apparatus-VERDICT.md §2` (the four-tier target architecture)
