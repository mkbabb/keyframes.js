# G.W6 — CI workflow-hygiene gate (ONE gate, four findings)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the gate + a composite action — a CI/workflow
surface; ZERO `src/`/`test/`/`demo/` edit) · **Scope:**
`.github/workflows/ci.yml` (the stale `^0.10.0` dep-order comment; the duplicated
glass-ui clone block → a `uses:` of the composite action; a top-level
`concurrency:` block), `.github/workflows/release.yml` (a top-level
`concurrency:` block), `.github/workflows/deploy-pages.yml` (the duplicated clone
block → the same `uses:`), `.github/actions/setup-glass-ui/action.yml` (NEW — the
composite action single-sourcing the clone recipe + the pin),
`scripts/proof-ci-coverage.mjs` (extend with the three workflow-hygiene clauses) ·
**DAG: depends on `G.W2` for the pin target** — the `v3.2.0`→`v3.3.0` bump (S3) is
gated by the demo-smoke green that `G.W2`'s re-pin establishes (the demo consumes
glass-ui 3.3.0 surface only once the re-pin lands); S1/S2/S4 are independent of the
re-pin and may land in parallel · **Gated on:** keyframes' own green CI (inv-27) +
the extended `proof:ci-coverage`.

**Title.** *F.W2 + F.W17 left the CI constellation SOTA — legacy fully excised,
inv-28 green-CI-gating correct, provenance signed, gate-coverage self-policing
(`a-ci-streamline §0/§6/§7/§8/ALREADY-SOTA`). G closes the residual DRIFT, not
architecture: ONE workflow-hygiene gate folding four findings — the stale
`^0.10.0` comment (`ci.yml:33`), the byte-duplicated glass-ui clone block
(`ci.yml` ≡ `deploy-pages.yml`) → a `setup-glass-ui` composite action, the stale
`v3.2.0`→`v3.3.0` pin (gated by demo-smoke green), and the missing `concurrency:`
on ci/release. The Node-24 delta is NAMED, not aligned (RECORD).*

This is the CI drift-closure wave — the F-deploy spine is the strongest part of
the constellation and is touched in NONE of its load-bearing clauses
(`a-ci-streamline §8 ALREADY-SOTA`: the inv-28 green-CI gate, head-SHA pinning,
the `workflow_run` path-filter re-imposition, `pages-deploy.sh`'s rollback +
secret discipline). The four findings converge on ONE instrument — an extended
`proof:ci-coverage.mjs` (the F.W2 self-policing gate, the right home since it
already reads `package.json` + `ci.yml`) — plus one composite action. That is the
gestalt: a single self-policing CI-hygiene gate, not four scattered patches
(`a-ci-streamline §DISPOSITION SCORECARD` G-SHIP-set note).

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the duplicated clone block is DRY-folded into the
canonical GitHub-Actions primitive (a composite action), NOT papered with a copied
comment or a "keep them in sync" note — the recipe lives in ONE place, both jobs
`uses:` it (`a-ci-streamline §2`). The stale comment is not patched to a fresh
number that will drift again — the gestalt fix STOPS hardcoding the floor in prose
(the range is single-sourced in `package.json`; the comment points there) AND the
gate forbids the drift recurring (`a-ci-streamline §1`). NO legacy: the §0 legacy
excision is VERIFIED total (zero dangling peaceiris/CNAME/gh-pages-action refs;
the lone retirement comment is correct provenance — `a-ci-streamline §0
ALREADY-SOTA`) and this wave touches none of it. NO escape-hatch: the
`concurrency:` add is the constellation-standard guard, not a bespoke lock
(`a-ci-streamline §4`). KISS · DRY: ONE gate extension + ONE composite action — not
a `dependabot.yml` for one sibling (over-engineering, `a-ci-streamline §3`), not a
second bespoke `proof-ci-dry.mjs` (the clauses fold into the existing coverage gate,
its natural home — `a-ci-streamline §7`). Styling ISOMORPHIC: the `concurrency:`
block and the composite-action shape align to the already-adopted constellation
spine (`deploy/templates/ci.yml`); the Node-24 delta is a NAMED delta, recorded not
silently aligned (`a-ci-streamline §5`). inv ε: every claim cites `a-ci-streamline
§N` or a re-verified live `file:line` (re-run on `tranche-g-dev` below), verified
not asserted. The §1b/§3 dep-currency depths are HAND-OFF-tagged to the spine
(`G.W2`) — this wave owns only the CI *surface* (the comment, the clone DRY, the
pin literal, the concurrency guard), per `a-ci-streamline`'s own remit boundary.

**Provenance.** `a-ci-streamline §1` (the stale `^0.10.0` dep-order comment —
SHIP-in-G: stop hardcoding the floor; gate forbids drift) + `§2` (the
byte-duplicated glass-ui clone block — SHIP-in-G: a `setup-glass-ui` composite
action; gate: clone literal in 0 workflows) + `§3` (the stale `v3.2.0` pin while
glass-ui HEAD is `v3.3.0` — MEASURE-FIRST → SHIP-in-G, gated by demo-smoke green) +
`§4` (no `concurrency:` on ci/release — SHIP-in-G: the constellation-standard
guard). The Node-24 delta is `§5` (RECORD — name the delta, do not align). The
spine ALREADY-SOTA surfaces (`§0/§6/§7/§8`) are touched in none of their clauses.
Synthesised at `_SYNTHESIS-gap-scorecard §1` (CI/constellation row: "ALREADY-SOTA +
drift-closure — 4 SHIPs converging on ONE workflow-hygiene gate") + `§2 Band 3
G.W6`. The `§1b` package.json/lockfile pin lag is the SPINE (`G.W2`), HAND-OFF
here.

---

## § State, verified (not asserted)

The live facts, `sed`/`grep`/`wc`-confirmed on `tranche-g-dev` (re-run, not carried
from the lane):

1. **The stale `^0.10.0` dep-order comment is live at `ci.yml:33`.** Re-read live:
   `ci.yml:32-35` narrates *"keyframes.js resolves @mkbabb/value.js via the npm
   registry (^0.10.0). A breaking value.js publish surfaces here at the `npm ci` +
   build:lib step…"* But `F/FINAL.md:117` + the registry record value.js `0.11.0`
   published. The comment narrates a `^0.10.0` reality the published stack has moved
   past (`a-ci-streamline §1`). It is benign (comments don't gate), but inv ε
   ("VERIFY, do not assert") makes a CI comment that lies about the dependency
   contract a real seam: the next reader trusts `^0.10.0`. The DEEPER drift —
   `package.json:85` still ranges `@mkbabb/value.js: ^0.10.0`, `:84`
   `@mkbabb/parse-that: ^0.8.2` — is the SPINE (`G.W2`), HAND-OFF; this wave owns
   the *comment*.

2. **The glass-ui clone block is byte-identical across two workflows.** Re-read
   live: `ci.yml:154-159` (the `demo-smoke` job) and `deploy-pages.yml:87-92` (the
   `deploy` job) run the verbatim five-line recipe
   `git clone --depth 1 --branch v3.2.0 https://github.com/mkbabb/glass-ui.git
   "$GITHUB_WORKSPACE/../glass-ui"` → `cd …` → `npm ci` → `npm run build`.
   `grep -c 'git clone --depth 1 --branch v3.2.0'` = **1** in each file (re-run
   live). A DRY violation the Mandate names explicitly; the pin (`v3.2.0`) is
   repeated, so a bump must be made in two places or they diverge — the very
   "moving-HEAD reproducibility hole" the step's OWN comment (`ci.yml:148-153`)
   warns against, reintroduced as a *cross-file* drift risk (`a-ci-streamline §2`).

3. **The glass-ui pin is one minor STALE: `v3.2.0` while HEAD is `v3.3.0`.** Both
   workflows pin `--branch v3.2.0` (`ci.yml:156`, `deploy-pages.yml:89`). The
   sibling has advanced: `glass-ui/package.json` reads `3.3.0` (verified live), and
   `_SYNTHESIS-gap-scorecard` header records glass-ui `3.3.0` PUBLISHED. CI's demo
   build + the deploy build against an OLD glass-ui the dev machines have moved off
   (`a-ci-streamline §3`). The pin DISCIPLINE is correct in principle ("advance via
   an explicit chore(ci) bump"); the finding is that the pin has fallen BEHIND.

4. **`concurrency:` is MISSING on ci.yml and release.yml; PRESENT on
   deploy-pages.yml.** `grep -c concurrency`: `ci.yml` = **0**, `release.yml` = **0**,
   `deploy-pages.yml` = **1** (re-run live). `deploy-pages.yml:26-28` correctly keys
   `deploy-pages-${{ github.event.workflow_run.head_sha || github.ref }}`,
   `cancel-in-progress: true`. The constellation standard puts the guard on CI too
   (`deploy/templates/ci.yml:38-41`, `ci-${{ github.workflow }}-${{ github.ref }}`,
   `cancel-in-progress: true` — "Cancel superseded runs on the same ref to save
   minutes"). Without it, rapid pushes spin overlapping `ci` runs (the `gates` job
   is ~17 proof gates + tsc + build + test; `demo-smoke` is a Playwright + lighthouse
   + LoAF matrix, `timeout-minutes: 20`) — wasted minutes + a stale-result race that
   can mislead the `deploy-pages` `workflow_run` trigger about which SHA is current
   (`a-ci-streamline §4`).

5. **The host instrument EXISTS and is the right home.** `scripts/proof-ci-coverage.mjs`
   (57L, F.W2) is invoked at `ci.yml:126-127` (`npm run proof:ci-coverage`, the
   library `gates` job — re-verified live). It already reads `package.json` +
   `.github/workflows/ci.yml` (`:25-27`) and asserts every `proof:*` gate is invoked
   in CI, with a RECORDED-reason exclusion manifest (`:10-18,28-32`) — the
   Mandate-correct fail-explicit posture (`a-ci-streamline §7 ALREADY-SOTA`). The
   four findings' clauses fold into THIS gate (it is the natural home — it already
   grep-walks the workflows); its conceptual scope widens from "ci-coverage" to
   "workflow hygiene" (the §7 RECORD: name the broadened scope in the header).

6. **The Node-24 delta is real and currently UNNAMED.** All four setup-node steps
   pin `node-version: 24` (`ci.yml:53,137`; `release.yml:35`; `deploy-pages.yml:81`
   — re-run live). The constellation standard pins `22` (`deploy/templates/ci.yml:57`);
   kf's `package.json` `engines` declares `>=22` (satisfied by both). The delta is
   defensible (a library *should* test on the newest runtime — `engines: >=22` is the
   contract, 24 a superset) but is currently *silent* — no comment names why kf is 24
   while the constellation is 22 (`a-ci-streamline §5`). It is a NAMED-delta the
   Mandate permits, but unnamed today.

The wave's job: SHIP the four-finding workflow-hygiene gate — the comment fix
(S1), the composite-action DRY fold (S2), the pin bump gated by demo-smoke green
(S3), the `concurrency:` adds (S4), all locked by the extended
`proof:ci-coverage.mjs` — and RECORD the Node-24 delta as a NAMED delta (S5).

---

## § Goal

**What lands (the four findings + the gate):**

1. **`ci.yml:33` stops hardcoding the floor.** The dep-order comment drops the bare
   `^0.10.0` and points to the single source: *"keyframes.js resolves @mkbabb/value.js
   via the npm registry (range declared in `package.json`)."* Same DRY principle the
   file already preaches (it tells you to read the lockfile, not a copy —
   `a-ci-streamline §1`). The gate (clause 1) forbids a bare `^0.NN.0` version literal
   in the workflow that disagrees with `package.json`'s declared range — so the drift
   cannot silently recur.

2. **A `setup-glass-ui` composite action single-sources the clone recipe + the pin.**
   NEW `.github/actions/setup-glass-ui/action.yml` (a `composite` action — the
   canonical GitHub-Actions DRY primitive, `a-ci-streamline §2`) carries the five-line
   clone+build with the pin as a default input. Both jobs invoke it as
   `uses: ./.github/actions/setup-glass-ui` (`ci.yml` `demo-smoke`, `deploy-pages.yml`
   `deploy`). The clone literal then lives in EXACTLY one place — and the pin bump (S3)
   becomes a one-line change instead of two-in-sync. The gate (clause 2) asserts the
   clone literal appears in ZERO workflow `.yml` files.

3. **The pin bumps `v3.2.0`→`v3.3.0`, GATED by demo-smoke green.** The bump lands as
   the composite action's default-input default (one line — the §2 DRY payoff). It is
   gated by the MEASURE that the demo builds green against 3.3.0 — the existing
   `demo-smoke` job IS that gate (`a-ci-streamline §3`): a `v3.3.0` that breaks the demo
   reds `proof:dogfood`/occlusion/lighthouse. Sequenced behind `G.W2` (the re-pin
   establishes the demo's 3.3.0 surface consumption; until then 3.2.0 is byte-sufficient
   and the bump is deferred-not-blocked). The MEASURE downgrades to RECORD only IF the
   demo proves 3.2.0-byte-sufficient at re-pin time (it will not — glass-ui 3.3.0 is the
   F hand-off surface the D.W5 close — `a-glass-ui GG-1`).

4. **`concurrency:` blocks land on ci.yml and release.yml.** `ci.yml` gets the
   constellation-standard guard (`ci-${{ github.workflow }}-${{ github.ref }}`,
   `cancel-in-progress: true` — cancel superseded PR/master runs). `release.yml` gets a
   tag-keyed group with `cancel-in-progress: false` — a publish in flight must NOT be
   cancelled mid-`npm publish`; only a SECOND concurrent run is blocked
   (`a-ci-streamline §4`). Pure isomorphic alignment to the adopted constellation spine
   — no behaviour change to a *single* run. The gate (clause 3) asserts every workflow
   declares a top-level `concurrency:` block.

5. **The Node-24 delta is NAMED, not aligned.** A one-line comment at the first
   setup-node names it: *"kf runs Node 24 — the newest runtime the published lib will
   face; constellation default is 22; engines floor is >=22."* Do NOT reflexively
   downgrade to 22 chasing template-sameness (the legacy-shape conformance the Mandate
   forbids when the delta is befitting — `a-ci-streamline §5`). RECORD, not a gate
   clause (a CI matrix testing 22 AND 24 is over-engineering for a single-target library
   demo — MEASURE-FIRST: no biting reason, no matrix).

**What does NOT land (recorded so no future lane re-raises):**
- **NO `dependabot.yml` / scheduled glass-ui-pin-currency check.** Over-engineering for
  a single sibling — the disciplined chore(ci) bump the pin comment already prescribes,
  caught at break-time by `demo-smoke`, is sufficient (`a-ci-streamline §3`).
- **NO second bespoke `proof-ci-dry.mjs`.** The three clauses fold into the existing
  `proof:ci-coverage` (its natural home — it already grep-walks the workflows;
  `a-ci-streamline §7`). KISS/DRY: ONE gate, extended.
- **NO Node-22 alignment.** A NAMED delta, not silent drift — the comment is the fix
  (S5); the downgrade is the forbidden template-sameness (`a-ci-streamline §5`).
- **NO touch of the §0/§6/§8 spine.** The legacy excision, the release re-run
  publish-gate, the inv-28 deploy spine + `pages-deploy.sh` are ALREADY-SOTA and
  load-bearing — left ALONE (`a-ci-streamline ALREADY-SOTA 1–7`).

**Why:** F.W2 + F.W17 made the CI constellation SOTA; the residual is drift +
DRY, not architecture. The four findings each name a *silent* drift (a lying
comment, a duplicated pin, a stale pin, an unguarded run-overlap) — the Mandate's
posture is fail-explicit, no silent drift. The extended gate converts all four
into gated invariants: the next re-introduced `^0.10.0`, the next inlined clone,
the next concurrency-less workflow REDS. The gate IS the closure — the decision
becomes a re-runnable artifact, not a one-time patch that drifts again.

---

## § Scope

### S1 — de-hardcode the `ci.yml:33` dep-order comment + gate the version-literal consistency (`a-ci-streamline §1`) — SHIP-in-G

**WHAT:** edit `ci.yml:32-35`'s dep-order comment to drop the bare `^0.10.0` and
point at the single source (`package.json`'s declared range). Add the
version-literal-consistency clause to `proof-ci-coverage.mjs` (it already reads both
`package.json` + `ci.yml`, `:25-27`): assert `ci.yml` contains NO hardcoded
`@mkbabb/value.js@`-style version literal (a bare `^0.NN.0` in the dep-order
comment) that disagrees with `package.json`'s declared range — OR assert any version
literal present matches the range exactly.

**WHY:** State 1 — the comment lies about a `^0.10.0` contract the published stack
has moved past, and inv ε forbids an asserting-not-verifying CI comment. The gestalt
fix stops hardcoding the floor in prose (it is single-sourced in `package.json`); the
gate forbids the drift recurring. The DEEPER `package.json`/lockfile pin lag is the
SPINE (`G.W2`), HAND-OFF — this S owns the *comment* + its consistency gate.

### S2 — fold the duplicated glass-ui clone into a `setup-glass-ui` composite action + gate clone-DRY (`a-ci-streamline §2`) — SHIP-in-G

**WHAT:** create `.github/actions/setup-glass-ui/action.yml` (a `composite` action)
carrying the five-line clone+build, the pin as a default input. Replace the inlined
block in `ci.yml:154-159` (the `demo-smoke` job) and `deploy-pages.yml:87-92` (the
`deploy` job) with `uses: ./.github/actions/setup-glass-ui`. Add the clone-DRY clause
to `proof-ci-coverage.mjs`: assert the `git clone … glass-ui` literal appears in ZERO
workflow `.yml` files (the recipe must live ONLY in the composite action) AND both
demo-build jobs reference `uses: ./.github/actions/setup-glass-ui`.

**WHY:** State 2 — the byte-identical recipe is a named DRY violation, and the
repeated pin is a cross-file divergence risk (the very moving-HEAD hole the step's own
comment warns against). A composite action is the canonical GitHub-Actions DRY
primitive (idiomatic, not a workaround) — single-sourcing the recipe AND the pin, and
making S3's bump a one-line change.

### S3 — bump the pin `v3.2.0`→`v3.3.0`, GATED by demo-smoke green (`a-ci-streamline §3`) — MEASURE-FIRST → SHIP-in-G

**WHAT:** set the `setup-glass-ui` composite action's pin default-input to `v3.3.0`
(the §2 DRY payoff — one line). The MEASURE: the existing `demo-smoke` job builds the
demo against 3.3.0 and stays green (`proof:dogfood`/occlusion/lighthouse PASS). The
bump lands as a `chore(ci)` — the discipline the pin comment already prescribes.

**WHY:** State 3 — the pin is one minor behind the published glass-ui (`3.3.0`); CI's
demo + deploy build against an OLD glass-ui the dev machines moved off. Sequenced
behind `G.W2` (the re-pin establishes the demo's 3.3.0-surface consumption — the D.W5
close, `a-glass-ui GG-1`); the MEASURE is `demo-smoke` itself (a 3.3.0 that breaks the
demo reds it). RECORD only IF the demo proves 3.2.0-byte-sufficient at re-pin time
(it will not — 3.3.0 is the F hand-off surface).

### S4 — add `concurrency:` to ci.yml + release.yml + gate concurrency-present (`a-ci-streamline §4`) — SHIP-in-G

**WHAT:** add a top-level `concurrency:` block to `ci.yml`
(`group: ci-${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: true`)
and to `release.yml` (tag-keyed group, `cancel-in-progress: false`). Add the
concurrency-present clause to `proof-ci-coverage.mjs`: assert every workflow `.yml`
declares a top-level `concurrency:` block (ci.yml + release.yml + deploy-pages.yml,
the last already present).

**WHY:** State 4 — `ci.yml` + `release.yml` have NO concurrency guard, so rapid
pushes spin overlapping heavy runs (wasted minutes + a stale-result race misleading
the deploy trigger). `release.yml`'s `cancel-in-progress: false` is the load-bearing
asymmetry: a publish in flight must NOT be cancelled mid-`npm publish` — only block a
second. Pure isomorphic alignment to the constellation spine
(`deploy/templates/ci.yml:38-41`); no single-run behaviour change.

### S5 — name the Node-24 delta (`a-ci-streamline §5`) — SHIP-in-G (RECORD comment, no gate clause)

**WHAT:** add a one-line comment at the first setup-node naming the deliberate delta
(*"kf runs Node 24 — the newest runtime the published lib will face; constellation
default is 22; engines floor is >=22"*). No gate clause (no version-pin assertion — a
matrix is over-engineering).

**WHY:** State 6 — the Node-24 pin is a defensible NAMED delta (a library should test
the newest runtime; `engines: >=22` is satisfied), but it is currently *silent*. The
Mandate's "isomorphic unless befitting, NAMED deltas only" requires the delta be
named, not aligned away. Do NOT downgrade to 22 (the forbidden template-sameness).

> **RECORDED / ALREADY-SOTA in this band — so no future lane re-litigates:**
> - **`§0` legacy excision** — VERIFIED total: `deploy.yml` fully gone, zero dangling
>   peaceiris/CNAME/gh-pages-action refs; the lone retirement comment is correct
>   provenance (`a-ci-streamline §0`). The `dist/gh-pages` artefact-name vestige is a
>   cosmetic rename across ~5 files for zero behaviour change — RECORD (`§0b`), out of
>   this lane's remit. NOT touched.
> - **`§6` release.yml re-runs the gates subset** — ALREADY-SOTA: correct publish-gating
>   (release fires on tag push, which ci.yml does NOT trigger on), NOT redundancy; the
>   boundary-only scope EXCEEDS the constellation template. The `workflow_run`-gated-on-
>   green-ci alternative is BOOK, not a G SHIP. NOT touched.
> - **`§8` inv-28 deploy spine + `pages-deploy.sh`** — ALREADY-SOTA: faithful
>   constellation CF-Pages adoption (green-CI gate, head-SHA pinning, path-filter
>   re-imposition, rollback + secret discipline). The strongest part of the
>   constellation — NOT touched (the CF-deploy-id echo nicety is RECORD, deploy-HANDOFF).
> - **`§7` `proof:ci-coverage` itself / `§9` demo-smoke artefact upload** — ALREADY-SOTA
>   self-policing gate (the host extended here) / RECORD debuggability convenience, out
>   of remit. Not carved.
> - **`§1b` package.json/lockfile pin lag** — the SPINE (`G.W2`); HAND-OFF here. This
>   wave owns only the CI *surface*.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable
instrument, not an assertion). **The extended `proof:ci-coverage.mjs` is the lock —
the four findings converge on ONE workflow-hygiene gate**
(`proof-ci-coverage.mjs` → `proof:ci-coverage`, invoked `ci.yml:126-127`, in the
`gates` job and `proof:all` `package.json:64`):

1. **`proof:ci-coverage` version-literal-consistency clause (S1) PASSES + BITES.** The
   gate (already reading `package.json` + `ci.yml`) asserts NO bare `@mkbabb/*@^0.NN.0`
   version literal in `ci.yml` disagrees with `package.json`'s declared range. **BITE:**
   re-insert `^0.10.0` into the dep-order comment → the gate reds (a literal that
   disagrees with the `package.json` range). This converts "comments drift silently"
   into a gated invariant — the Mandate's no-silent-drift posture.

2. **`proof:ci-coverage` clone-DRY clause (S2) PASSES + BITES.** The gate asserts the
   `git clone … glass-ui` literal appears in ZERO workflow `.yml` files AND both
   demo-build jobs reference `uses: ./.github/actions/setup-glass-ui`. **BITE:** inline
   the clone recipe back into `ci.yml` (or `deploy-pages.yml`) → the gate reds (the
   literal is present in a workflow; the recipe must live ONLY in the composite action).
   The DRY fold is enforced, not just performed.

3. **`proof:ci-coverage` concurrency-present clause (S4) PASSES + BITES.** The gate
   asserts every workflow `.yml` (ci.yml, release.yml, deploy-pages.yml) declares a
   top-level `concurrency:` block. **BITE:** delete the `concurrency:` block from
   `ci.yml` (or `release.yml`) → the gate reds. The guard cannot silently regress out.

4. **The pin bump is GATED by `demo-smoke` green (S3).** The existing `demo-smoke` job
   (the Playwright + occlusion + lighthouse matrix) builds the demo against the
   composite action's `v3.3.0` default and stays green. **BITE:** a `v3.3.0` that breaks
   the demo build reds `proof:dogfood`/occlusion/lighthouse — the MEASURE that gates the
   bump. The bump does not land on assertion; it lands on the demo-smoke green
   established by `G.W2`'s re-pin (the DAG dependency).

5. **No regression — the gate extension + composite action are inert on every current
   surface.** `npm run proof:ci-coverage` stays green (the F.W2 coverage clause —
   every `proof:*` gate invoked in CI — UNCHANGED; the three new clauses extend without
   reddening the post-fix workflows). `proof:all` stays green (`proof:ci-coverage` is in
   the chain, `package.json:64`). **BITE:** any change that breaks the F.W2 coverage
   clause, or any `src/`/`test/`/`demo/` edit attributed to this wave, reds (the wave is
   a CI/workflow surface — composite action + workflow YAML + the proof script — NOT a
   source change).

---

## § Folds

Retires (by finding id):
- **`a-ci-streamline §1`** (the stale `^0.10.0` dep-order comment) — S1 + gate clause 1.
  The comment de-hardcodes (single-sourced to `package.json`); the version-literal
  consistency clause forbids the drift recurring. The `§1b` package.json/lockfile pin
  lag is the SPINE — HAND-OFF to `G.W2`.
- **`a-ci-streamline §2`** (the byte-duplicated glass-ui clone block) — S2 + gate
  clause 2. Folded into the `setup-glass-ui` composite action; the clone literal lives
  in ZERO workflows, both jobs `uses:` it.
- **`a-ci-streamline §3`** (the stale `v3.2.0`→`v3.3.0` pin) — S3 + gate clause 4.
  Bumped as the composite action's default input, gated by `demo-smoke` green
  (sequenced behind `G.W2`).
- **`a-ci-streamline §4`** (the missing `concurrency:` on ci/release) — S4 + gate
  clause 3. The constellation-standard guard lands on both; the concurrency-present
  clause forbids its regression.

**RECORDED in this band (not shipped as a gate — see S5 + the §Scope callout):**
- **`a-ci-streamline §5`** (Node-24 vs constellation-22 delta) — RECORD: name the
  delta with a one-line comment (S5); do NOT align to 22 (the forbidden
  template-sameness). No gate clause (a matrix is over-engineering).
- **`a-ci-streamline §0b`** (`dist/gh-pages` artefact-name vestige) — RECORD: a
  cosmetic rename across ~5 files, out of this lane's "streamline CI" remit.
- **`a-ci-streamline §6` (BOOK: workflow_run-gate alt) / `§8` (RECORD: CF-deploy-id
  echo) / `§9` (RECORD: demo-smoke artefact upload)** — ALREADY-SOTA / out-of-remit;
  not carved.

**ALREADY-SOTA (binding — manufacture NO work):** the §0 legacy excision (total +
honest), the §8 inv-28 deploy spine + `pages-deploy.sh`, the §6 release re-run
publish-gate + provenance, the §7 `proof:ci-coverage` self-policing mechanism (the
host this wave extends), the gates/demo-smoke library-vs-demo split, the uniform
`@v5` action pins (`a-ci-streamline ALREADY-SOTA 1–7`). G touches NONE of their
load-bearing clauses.

---

## § Design decisions (the trade-offs RESOLVED)

1. **A composite action over a reusable workflow (`workflow_call`) for the clone DRY.**
   RESOLVED: the glass-ui prerequisite is a sequence of run-steps with ONE parameter
   (the pin), invoked INLINE by two jobs that already own their checkout/setup-node
   context. A composite action (`.github/actions/setup-glass-ui/action.yml`,
   `uses: ./…`) is the gestalt fit — it drops into the existing job step list with no
   job-graph restructure. A reusable workflow (`workflow_call`) is the heavier
   primitive for whole-job reuse (it brings its own runner + checkout) — over-shaped for
   a step-sequence shared between two jobs. Composite action: minimal, idiomatic, makes
   the pin bump (S3) a one-line default-input change (`a-ci-streamline §2`).

2. **The four findings fold into ONE gate (`proof:ci-coverage`), not four scattered
   patches or a second `proof-ci-dry.mjs`.** RESOLVED: the gestalt is a single
   self-policing CI-hygiene gate (`a-ci-streamline §DISPOSITION SCORECARD` G-SHIP-set:
   "all four converge on one instrument extension … plus one composite action"). The
   existing `proof:ci-coverage` is the natural home — it already grep-walks
   `package.json` + `ci.yml` (`:25-27`), already runs in CI (`ci.yml:126`) + `proof:all`
   (`package.json:64`), already carries a RECORDED-reason exclusion manifest. Extending
   it (three clauses: version-literal-consistency + clone-DRY + concurrency-present) is
   KISS/DRY; a second bespoke `proof-ci-dry.mjs` multiplies the gate surface for zero
   gain. Its conceptual scope widens "ci-coverage"→"workflow hygiene" (the §7 RECORD:
   name the broadened scope in the header — it now reads all three workflows, not just
   `ci.yml`).

3. **The pin bump is MEASURE-FIRST (gated by demo-smoke), not a blind chore.** RESOLVED:
   `a-ci-streamline §3` graduates the pin from RECORD to SHIP only after the MEASURE —
   the demo builds green against 3.3.0. The existing `demo-smoke` job IS that gate (a
   3.3.0 that breaks the demo reds it), so no new permanent currency-check is owed (a
   `dependabot.yml` for one sibling is over-engineering). The bump is sequenced behind
   `G.W2` (the re-pin establishes the demo's 3.3.0-surface consumption, the D.W5 close
   `a-glass-ui GG-1`); 3.2.0 is byte-sufficient until then, so S3 is deferred-not-blocked
   within the band. The gate (clause 4) binds the OUTCOME (demo-smoke green at 3.3.0),
   not the bump-on-assertion.

4. **`release.yml`'s `cancel-in-progress: false` — the load-bearing asymmetry.**
   RESOLVED: `ci.yml`'s concurrency cancels superseded runs (`cancel-in-progress: true`
   — superseded PR/master CI is waste). But `release.yml` is tag-triggered and a publish
   in flight must NOT be cancelled mid-`npm publish` (a half-published version is the
   exact corruption the guard must prevent) — so `cancel-in-progress: false`: a second
   concurrent run is BLOCKED, the first runs to completion (`a-ci-streamline §4`). This
   is not a cosmetic copy of ci.yml's guard; it is the correct publish-safety posture.
   Both keys are constellation-isomorphic in shape, deliberately asymmetric in the
   cancel policy.

5. **The Node-24 delta is NAMED, not aligned (no gate clause).** RESOLVED: `a-ci-streamline
   §5` leans (b) — keep 24, add the naming comment — over (a) downgrade-to-22. A library
   SHOULD test on the newest runtime the published bytes will face; `engines: >=22` is
   the contract, 24 a superset. The Mandate permits a NAMED delta (isomorphic unless
   befitting, named deltas); the fix is to NAME it, not align it away (the legacy-shape
   template-conformance the Mandate forbids when the delta is befitting). No gate clause:
   a CI matrix testing 22 AND 24 is over-engineering for a single-target library demo
   (MEASURE-FIRST: no biting reason). The comment IS the resolution.

6. **This wave is a CI/workflow surface ONLY — ZERO `src/`/`test/`/`demo/` edit.**
   RESOLVED: G.W6 ships `.github/workflows/{ci,release,deploy-pages}.yml`, the NEW
   `.github/actions/setup-glass-ui/action.yml`, and the extended
   `scripts/proof-ci-coverage.mjs`. It does NOT touch the engine, the tests, or the demo
   — the drift-closure is entirely in the CI constellation. The dep-currency depth
   (`§1b`/`§3` package.json) is the SPINE (`G.W2`), HAND-OFF; the spine ALREADY-SOTA
   surfaces (`§0/§6/§7/§8`) are touched in none of their load-bearing clauses
   (`_SYNTHESIS-gap-scorecard §1` CI row: "ALREADY-SOTA + drift-closure").
