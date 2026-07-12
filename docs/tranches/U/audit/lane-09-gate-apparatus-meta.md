# Lane 09 — Gate Apparatus (Meta): has the enforcement become the legacy?

**Tranche U audit fleet · lane 9/32 · slug `gate-apparatus-meta`**
Charter: audit the ENFORCEMENT APPARATUS ITSELF (`scripts/gate-bands.mjs`,
`proof-ci-coverage.mjs`, the born-RED / born-OWNER / FROZEN / DISCHARGE / tripwire
machinery, `scripts/lib/`). Has the apparatus become self-referential complexity that
outweighs the defects it prevents? What is the MINIMAL honest mechanism (the gestalt
cure)?

**Verdict: YES. The apparatus is now the largest single body of legacy in the repository
— it is 3.3× the size of the library it guards, it grows structurally faster than it can
be trimmed, and roughly a quarter of it exists only to police itself. The owner's U edict
("that runner is entirely superfluous… CI needs to be trimmed substantially… NO legacy
code… NO MORE DEFERRALS") is, read literally, an instruction to demolish most of this
apparatus.**

---

## The headline number (read from the tree, not the board)

| Surface | LOC | Files |
|---|---|---|
| `src/` (the entire library) | **22,054** | (all `*.ts`) |
| `scripts/` (the enforcement apparatus) | **73,563** | 230 `*.mjs` |
| — of which `proof-*.mjs` gate scripts | ~66k | **209** gates |
| — `scripts/lib/` shared harness | 3,043 | 9 |

Evidence: `find src -name '*.ts' | xargs wc -l` → 22054; `find scripts -name '*.mjs' |
xargs wc -l` → 73563; `ls scripts/proof-*.mjs | wc -l` → 209.

**The apparatus outweighs the library it defends by 3.3 to 1.** There are 209 standalone
proof gates guarding a 22k-LOC library that ALSO carries 113 vitest files / ~1052 tests.
This is the objective form of "the apparatus has become the legacy": more engineering
mass now lives in the machine that checks the product than in the product.

---

## Finding 1 (CRITICAL) — the roster is monotonically DIVERGING from its own ceiling; the apparatus is a ratchet that cannot trim

`scripts/gate-bands.mjs:595` declares `ROSTER_CEILING = 120`. The live count is **227**
`proof:*` keys (`Object.keys(pkg.scripts).filter(s=>s.startsWith('proof:')).length` → 227).

The ceiling's own commentary (`gate-bands.mjs:587-594`) is a confession of divergence:

> "S.A4's headline was **190 → ~138 immediate → ~120**… The tree **INVERTED to 203**
> (each altitude band authored MORE structural born-RED oracles)… it converges SLOWLY."

And the born-RED row (`gate-bands.mjs:665-676`): "today **228**… each altitude band had
kept authoring MORE born-RED oracles than the M7 retirements removed, so the count
converges SLOWLY."

The trajectory is the opposite of convergence: **190 → 203 → 236 → 228 → 227**, against a
ceiling of 120 that has been "about to be reached" since S.A4. `proof:roster-ceiling` is a
gate that has been declared-RED-and-backlogged across THREE tranches (S, T, now U) and has
never gone green. This is not a backlog item; it is a structural property: **the apparatus
adds gates faster than any tranche can retire them, and the retirement itself requires
authoring more machinery (Finding 2).**

**PROPOSAL (gestalt):** delete the ceiling gate and the count game entirely. A LOC/gate
ceiling is a symptom-treatment. The cure is to collapse the gate GENRES (Findings 3–5) so
the honest count falls to single digits by construction, at which point a ceiling is
meaningless. U must charter a target *shape* (three mechanisms — see "What U must
charter"), not a target *number*.

---

## Finding 2 (CRITICAL) — the FROZEN / DISCHARGE / RETIREMENT / born-RED ledger is a deletion-BUREAUCRACY that makes removing a gate harder than adding one

`scripts/gate-bands.mjs` (761 L, **33% pure prose**) is not code — it is five hand-curated
registers that exist ONLY to manage the lifecycle of gates:

| Register | Entries | Purpose |
|---|---|---|
| `FROZEN_SET` | 36 | demo-appearance gates "frozen in place," deletable only via a discharge |
| `DISCHARGE` | 17 | migration/kill records required to legally delete a FROZEN gate |
| `REGRESSION_GUARDS` | 10 | absence-guards that must stay wired to hygiene |
| `RETIREMENT_LEDGER` | 19 | feature-coupled gates pending removal |
| `T_BORNRED_BACKLOG` | 8 | gates deliberately shipped RED |

Evidence: `import('./scripts/gate-bands.mjs')` entry counts above; the machine-enforcement
lives in `proof-ci-coverage.mjs:1034-1121` (clause 9), which REDs if a FROZEN key is
deleted "with NO discharge record" — **"Free-prose deletion-with-cause is BANNED"**
(`gate-bands.mjs:17`, `proof-ci-coverage.mjs:1042-1047`).

To DELETE one gate you must add a machine-validated record: a `migration` naming a live
successor gate (`proof-ci-coverage.mjs:1060-1067`) or a `kill` carrying a ledger cite + a
re-run witness that re-verifies "every run that the script is gone, the key is gone, and
the roster membership is gone" (`gate-bands.mjs:268-277`, enforced at
`proof-ci-coverage.mjs:1068-1099`). Every DISCHARGE entry carries a 6–15-line prose
paragraph (see `gate-bands.mjs:127-392`).

This is the root cause of Finding 1. The apparatus has made **addition cheap and deletion
expensive** — the exact inversion of what a trimming regime needs. Worse, it directly
violates two U edicts:

- **"NO MORE DEFERRALS"** — `T_BORNRED_BACKLOG` (8 rows, `gate-bands.mjs:609-761`) is the
  "honest defer" device the owner just terminated. It is the institutionalized form of
  deferral: a gate that reds on a real defect but is kept OUT of every blocking chain and
  registered as "declared backlog." That is a deferral with paperwork.
- **"NO legacy code"** — the entire ledger IS legacy: it is machinery whose sole product
  is the safe retirement of other machinery.

**PROPOSAL (gestalt / architectural transposition):** do not "trim" the ledger — DELETE
its subject. The ledger exists to manage the lifecycle of the demo-appearance gate genre
(Finding 4) and the born-RED-defer genre (both terminated by U's edict). Remove those two
genres and all five registers evaporate along with clauses 9/10/11 of the meta-gate.
Deletion becomes what it should be: `git rm scripts/proof-X.mjs` + drop the package.json
key. No witness, no discharge record, no successor-migration proof. A tree where deleting
a gate is one line is a tree that can actually converge.

---

## Finding 3 (CRITICAL) — `proof-ci-coverage.mjs` is a 1,216-line META-gate that proves the proof-harness is internally consistent — infrastructure guarding infrastructure, not the product

`scripts/proof-ci-coverage.mjs` is **1,216 lines** (34% prose) implementing **13 clauses**
(−1 through 11) for ONE gate. Its subject is not the library or the demo — it is the gate
system itself:

- **Clause 0 / 0b / 0c** (`:156-448`) — bidirectional coverage: every `proof:*` key is
  invoked in CI, AND every CI-invoked gate is reachable from `proof:all`, so
  "`proof:all == the CI roster` is a machine fact" (`:19-20`). This is a proof that the
  proof-harness's own wiring is complete in both directions.
- **Clauses 9/10/11** (`:1023-1204`) — police `gate-bands.mjs`'s FROZEN/DISCHARGE/
  REGRESSION/born-RED registers (Finding 2).
- **Clause 4** (`:547-751`) — reads a MARKDOWN doc (`docs/tranches/J/gate-taxonomy.md`)
  with a 5-column table regex (`:688-697`) and REDs if a gate's "observe-only posture"
  row is missing a `Category` or `Architectural cure` cell. A gate parsing a documentation
  table with a regex to check that other gates documented their device-dependence.

This is self-referential complexity in its purest form: a ~1,200-line instrument whose job
is to prove the other ~226 instruments are correctly registered, tiered, wired, and
documented. It guards the guard. The `EXCLUDED` set alone (`:157-316`) is **160 lines** of
prose exemptions-with-reasons.

Evidence: full read of `proof-ci-coverage.mjs`; clause anchors cited inline.

**PROPOSAL (gestalt):** this meta-gate is only necessary because gates are scattered across
227 package.json keys, 3 aggregator chains, a demo-roster module, and 3 workflow files —
so a machine is needed to prove they all agree. Collapse the gate population to the three
honest mechanisms (below) and coverage becomes true by construction: `npm test` runs all
of vitest, `npm run proof:publish` runs the single structural oracle, CI runs exactly those
two. There is nothing to cross-check, so the entire 1,216-line meta-gate — and
`gate-taxonomy.md`, and the observe-only posture manifest — deletes.

---

## Finding 4 (MAJOR) — the demo-appearance gate GENRE encodes taste as pixel-locks; T already proved owner-review supersedes it, yet the genre (and its ledger) survives

The 36-member `FROZEN_SET` (`gate-bands.mjs:27-97`) is a catalogue of appearance locks:
`proof:hero-rung`, `proof:stage-glass-card`, `proof:card-rounded-primitive`,
`proof:dock-zorder`, `proof:crayon-preserved`, `proof:cartoon-shadow-unclipped`, etc. The
`DISCHARGE` ledger (`:122-392`) records the T tranche's enormous effort RETIRING many of
them — `proof:visual-lock` → `proof:owner-golden` (`:127-135`), the three hero locks
(`:146-174`), the seven easing surface-locks (`:187-251`), `proof:easter-egg` /
`proof:design-refinement` (`:351-391`) — because they had "crystallized the exact renders
the owner rejected" (`:131-134`).

The lesson is stated in the tree itself and in MEMORY (feedback_gate_blindspot): appearance
is an OWNER-REVIEW judgment, not a machine oracle. T's `proof:owner-golden` (a committed
owner BLESSING over reference frames) is the honest form; the FROZEN pixel-locks were the
dishonest form that had to be dismantled one discharge-record at a time. **Yet the GENRE
persists** — 36 frozen locks, a browser `demo-correctness` roster of 26 gates, plus a
`demo-device-observe` observe-only tier — and with it the entire lifecycle ledger of
Finding 2.

Evidence: `FROZEN_SET` / `DISCHARGE` in `gate-bands.mjs`; `demo-correctness` = 26 members,
`demo-device-observe` job at `ci.yml:672`.

**PROPOSAL (gestalt):** delete the demo-appearance gate genre wholesale — do NOT migrate it.
Appearance/interaction quality is owner-reviewed via Fable + the frontend-design plugin
(the U orchestration spec) against a small set of committed owner goldens, exactly the
`proof:owner-golden` shape. One owner-golden oracle replaces 36 FROZEN locks + 26 browser
gates + the observe tier + the discharge ledger. The demo's runtime correctness (does it
throw? does it mount?) is one smoke test, not a 26-gate roster.

---

## Finding 5 (MAJOR) — ~25% of the gate population exists to audit the apparatus, not the product

Of the 209 gate scripts, **53 read `package.json` scripts / `gate-bands.mjs` /
`demo-roster.mjs`** — i.e. their subject is the gate system's own bookkeeping, not the
library or demo (`grep -l 'gate-bands\|demo-roster\|pkg.scripts\|package.json'
scripts/proof-*.mjs | wc -l` → 53). The named meta-gates alone:

| Gate | LOC | Subject |
|---|---|---|
| `proof-ci-coverage.mjs` | 1,216 | the proof-harness wiring (Finding 3) |
| `proof-chronic-closure.mjs` | 723 | parses tranche ledgers for "chronic" rows |
| `proof-decomposition.mjs` | 875 | file-size / sibling-count shape of the tree |
| `proof-gate-is-runtime.mjs` | 385 | that OTHER gates actuate a browser (`:1-45`) |
| `proof-roster-ceiling.mjs` | — | the 227-vs-120 count (Finding 1) |
| `proof-retirement-ledger.mjs` | — | the RETIREMENT_LEDGER no-orphan clause |
| `gate-bands.mjs` | 761 | the five registers (Finding 2) |

`proof-gate-is-runtime.mjs` is a meta-gate whose ENTIRE purpose is to prove that every
`demo-correctness` gate "opens a browser… and ACTUATES the running product" (`:12-24`) — a
gate policing the epistemic quality of other gates. This is the harness auditing its own
methodology.

**PROPOSAL (gestalt):** the meta-gate layer is a response to gate SPRAWL — when you have 227
gates of heterogeneous quality across four registers, you need machines to keep them honest.
Remove the sprawl (Findings 3/4) and the meta-layer has nothing left to audit. A three-gate
world needs no gate-is-runtime, no ci-coverage, no roster-ceiling, no chronic-closure,
no retirement-ledger — those 4,000+ LOC delete outright.

---

## Finding 6 (MAJOR) — CI is NOT trimmed; the "entirely superfluous" Linux runner the owner named is still the primary runner

Owner edict (`ORIGINAL-PROMPT.md`): *"that runner is entirely superfluous — our CI needs
to be trimmed substantially (most of it's likely tautological)."* The reading (`:1`) names
"the Linux runner ruled superfluous."

Current state: `.github/workflows/ci.yml` is **751 lines**, with **135** `npm run proof:`
invocations across **3 jobs** (`gates` @`:48`, `demo-correctness` @`:628`,
`demo-device-observe` @`:672`), and **all three jobs still `runs-on: ubuntu-latest`**
(`ci.yml:50`, `:630`, `:674`). The Linux runner the owner called superfluous is the ONLY
runner. Half of the device-honesty apparatus (`ci-env.mjs`, `portable-perf.mjs` 419L,
`cdp-perf.mjs`, the observe-only posture manifest, clause 4's Category/cure columns) exists
solely to cope with the slow-Linux-runner render-race class documented in MEMORY
(project_ci_device_dependence_greening) — a class that vanishes the moment the Linux runner
does.

Evidence: `wc -l ci.yml` → 751; `grep -c 'npm run proof:'` → 135; three `runs-on:
ubuntu-latest` at the cited lines.

**PROPOSAL (gestalt):** delete the Linux runner. CI = one job that runs `npm test` +
`npm run proof:publish` + `npm run build` (+ the release-path publish oracle in
release.yml). The browser `demo-correctness` / `demo-device-observe` jobs are replaced by
the single owner-golden review (Finding 4). The entire device-honesty subsystem
(`ci-env.mjs` posture machinery, `portable-perf.mjs`, `gate-taxonomy.md`, ci-coverage
clause 4) deletes with the runner — its whole reason for existing was tolerating a runner
the owner has ruled out. macOS-parity render-races cannot fail a CI that no longer runs a
browser in CI.

---

## Finding 7 (MINOR) — the library-correctness gates are a SECOND correctness harness parallel to vitest, splitting the value-proof surface

`proof:library-correctness` has **37 members** (`proof:zero-alloc`, `proof:compile-replay`,
`proof:roundtrip-fidelity`, `proof:interpolate-anything`, `proof:blend`, `proof:soa-
composite`, …) — each a standalone `.mjs` node/jsdom value-proof. The repository ALSO
carries **113 vitest files / ~1052 tests** covering the same library. There are two
parallel correctness harnesses over one library: vitest (`npm test`) and the 37-gate
`.mjs` roster. A value invariant proven in a `proof-*.mjs` is a test that escaped the test
suite.

Evidence: `proof:library-correctness` membership (37); `find test -name '*.test.ts' | wc -l`
→ 113.

**PROPOSAL (gestalt):** fold every `proof:library-correctness` value-proof into vitest as an
ordinary test (they are node/jsdom already — zero migration friction). One correctness
harness, `npm test`, run once in CI. The 37 standalone scripts + their 37 package.json keys
+ their CI wiring + their tier membership in the ci-coverage union all delete. This alone
removes 37 gates from the 227 count and eliminates the `library-correctness` vs
`demo-correctness` tier split that clause 0b (`:348-420`) was built to police.

---

## Finding 8 (MINOR) — the born-RED backlog rows that are self-inflicted (not external consume-edge) are terminated deferrals that must be discharged in U, not carried

The 8 `T_BORNRED_BACKLOG` rows (`gate-bands.mjs:609-761`) split two ways. External
consume-edge (legitimate, per U's "charter the consume edge only"): `no-collision-rename`
(value.js PropertyDescriptor rename), `dock-rest-crisp` / `dock-morph-continuity` /
`dock-zorder` / `blur-not-resampled` (glass-ui GU-/BG- handoffs). But `stage-inventory`,
`subject-legible`, and `roster-ceiling` are SELF-inflicted deferrals — kf-owned defects
kept RED-with-paperwork. Under "NO MORE DEFERRALS" these cannot survive as backlog rows.

Evidence: `T_BORNRED_BACKLOG` entries at `:610-676`; each `dischargedBy` field names its
owner.

**PROPOSAL (gestalt):** partition the register at U-open. The external-blocked rows become
ONE coordination letter (the kf→value.js and kf→glass-ui consume-edge asks) — not gates,
not backlog, a letter, exactly as U's constellation clause requires. The self-inflicted
rows are either FIXED in U's implementation phase or the underlying "defect" is re-judged
by the owner as not-a-defect (e.g. the roster-ceiling count is not a real defect once
Findings 3–5 collapse the population). Either way the `T_BORNRED_BACKLOG` register + clause
11 delete.

---

## The gestalt cure — what the minimal honest mechanism looks like

Today: **227 `proof:*` keys · 209 gate scripts · 73,563 scripts LOC · 5 lifecycle registers
· 1 job on a Linux runner the owner ruled out · a 1,216-line meta-gate proving the harness
is internally consistent.**

The honest mechanism is THREE gates, no ledgers, no meta-gates:

1. **`npm test` (vitest)** — the single correctness harness. Every `proof:library-
   correctness` value-proof folds in (Finding 7). This is the ~1052-test suite that already
   exists; it absorbs the 37 refugees.
2. **`npm run proof:publish`** — ONE structural oracle composed of the three genuinely-
   load-bearing existing gates: `proof:boundary` (light/heavy split), `proof:published-
   surface` (tarball == exports == d.ts), `proof:deps-current` (the @mkbabb/* floor). Run
   in `release.yml` before `npm publish`. This is the ONLY thing a source grep can prove
   that a test cannot.
3. **Owner-golden review** — appearance/interaction is judged by the owner via Fable +
   frontend-design against a small committed golden set (the `proof:owner-golden` shape,
   Finding 4). Not a machine gate; a human oracle in the design loop, per the U edict.

Everything else deletes: the 36 FROZEN locks, the 26-gate demo-correctness browser roster,
the observe tier, all five lifecycle registers in `gate-bands.mjs`, `proof-ci-coverage.mjs`,
`proof-gate-is-runtime.mjs`, `proof-roster-ceiling.mjs`, `proof-chronic-closure.mjs`,
`proof-retirement-ledger.mjs`, `proof-decomposition.mjs`, the `gate-taxonomy.md` posture
manifest, `ci-env.mjs`'s posture machinery, and the Linux runner. Projected: **scripts/
73k → ~3–5k LOC; 227 gates → 3.** The apparatus stops being the legacy.

---

## What U must charter

- **Charter the three-mechanism collapse as the enforcement target** — `npm test` (all
  correctness), `npm run proof:publish` (boundary + published-surface + deps-current), owner-
  golden review. Not a gate-count ceiling; a gate-GENRE deletion.
- **Charter DELETION of the demo-appearance gate genre** — FROZEN_SET (36), the
  `demo-correctness` browser roster (26), `demo-device-observe` — replaced by ONE
  owner-golden review in the Fable/frontend-design design loop.
- **Charter DELETION of the lifecycle ledger** — FROZEN / DISCHARGE / RETIREMENT /
  REGRESSION / T_BORNRED_BACKLOG registers in `gate-bands.mjs`, and clauses 9/10/11 of
  `proof-ci-coverage.mjs`. Gate deletion becomes `git rm` + drop the key — no witness, no
  discharge record.
- **Charter DELETION of the meta-gate layer** — `proof-ci-coverage.mjs` (1,216 L),
  `proof-gate-is-runtime.mjs`, `proof-roster-ceiling.mjs`, `proof-chronic-closure.mjs`,
  `proof-retirement-ledger.mjs`; coverage becomes true by construction in a 3-gate world.
- **Charter the Linux-runner removal and the device-honesty subsystem it justifies** —
  drop `ubuntu-latest`, the browser CI jobs, `ci-env.mjs` posture machinery,
  `portable-perf.mjs`, `gate-taxonomy.md`, ci-coverage clause 4. CI = one macOS/none job.
- **Charter folding the 37 `proof:library-correctness` value-proofs into vitest** — one
  correctness harness, `npm test`.
- **Charter partitioning `T_BORNRED_BACKLOG`** — external-blocked rows → ONE consume-edge
  coordination letter (kf→value.js / kf→glass-ui); self-inflicted rows → fixed in the
  implementation phase or re-judged not-a-defect. "NO MORE DEFERRALS" forbids carrying the
  register.
- **Charter a standing anti-sprawl precept, not a ceiling** — new enforcement must land as a
  vitest test OR a clause of `proof:publish`; a new standalone `proof-*.mjs` gate requires
  owner sign-off. Make ADDITION expensive and DELETION free — the inverse of today's ratchet.
