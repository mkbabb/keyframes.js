# Lane R1-02 — Gate Soundness + Apparatus Critique

**Finding-ID prefix:** GS- · **Date:** 2026-07-16 · **Scope:** the entire verification
apparatus (package.json scripts, `scripts/**`, `.github/workflows/*.yml`, tsconfig
triplet, vitest.config.ts, vite build plugins, `.dependency-cruiser.cjs`).

## Verdict

The **merge/release gate spine is genuinely sound and non-vacuous.** I ran every
static/library gate CI actually invokes and each is green, fast, and falsifiable:
`check:lib` (<1s), `build:lib`, `test:lib` (1042 pass / 1 expected-fail, 6s wall),
`proof:publish` (green, ~12s — real npm-pack actuation, real dist import, 20 README
snippets executed with 29 `// =>` assertions, source+dist bundle boundary proofs),
`lint` (depcruise, 151 modules / 661 edges, 0 violations), `release:changelog` (real
git-reconstructed surface diff — correctly caught `getTimingFunction` removed 5.3.5→6.0.0
and documented in `MIGRATION-6.0.0.md`). These are the apparatus's crown jewels and
they earn their keep.

The defects are in the **browser/appearance tier and its documentation**, and they are
consistent with this repo's chronic disease (green-source-shape over
device/appearance): (1) **five browser-gated Vitest correctness oracles execute in NO
CI job** — vacuous-green-by-skip on the automated path; (2) the deploy `last-demo-green`
ancestry gate is routinely **bypassed via `workflow_dispatch`**, so the nightly demo
green is not actually enforced on real deploys; (3) `proof:owner-golden` now passes but
is wired into **no workflow**; (4) the `.dependency-cruiser.cjs` no-cycle comment
describes a **known-violations baseline that does not exist and is not wired**; (5)
44 orphaned diff PNGs from the retired `visual-lock` gate remain on disk. Nothing here
is a false green on the *library* release path, but the appearance/round-trip apparatus
is carrying weight that produces no automated signal — exactly the superfluity the
owner edict targets.

---

## GS-01 — Five browser-gated Vitest correctness oracles run in NO CI job (P1)

**mechanism-family:** vacuous-green-by-skip / gate-that-cannot-fire

Five `test/**` files are entirely `describe.skipIf(!chromium ...)` and are the exact 5
files Vitest reports skipped:

- `test/compile/entry-roundtrip.test.ts:66` — `describe.skipIf(!chromium)` (EN-c entry round-trip)
- `test/compile/view-transition-roundtrip.test.ts:73` — `skipIf(!chromium)` (VT-c round-trip)
- `test/orchestration/split-a11y-oracle.test.ts:136` — `skipIf(!chromium || !bundle)` (SplitText a11y tree)
- `test/engine/en-fix-oracle.test.ts:66` — `skipIf(!chromium)` (EN-a/EN-b browser-parse)
- `test/scroll/trigger-oracle.test.ts:142` — `skipIf(!chromium || !bundle)`

Evidence they never run in CI:
- The only CI job that runs Vitest is `ci.yml` `gates` (`npm run test:lib`). Its steps
  are checkout → setup-node → `npm ci` → `check:lib` → `build:lib` → `test:lib` →
  `proof:publish`. **It never installs Playwright.** `grep -n playwright package.json`
  → *"NOT in package.json deps"*; `node_modules/@playwright` / `playwright-core` absent.
  So `resolveChromium()` returns null → all five describe blocks SKIP.
- The nightly `demo-correctness` job DOES install chromium, but it runs
  `npm run demo:correctness` (`run-demo-roster.mjs` → the `observe/*` scripts), **not
  Vitest.** `grep demo:correctness .github/workflows` confirms the roster is the only
  browser invocation, and it is the observe roster, not `test:lib`.

Net: these five oracles — entry/VT round-trip equality, SplitText a11y-tree, browser
CSS-parse fixes, scroll-trigger — provide **zero CI signal**. Local `test:lib` output:
`Test Files 99 passed | 5 skipped (104)`. They can regress silently on every merge.

**Failure scenario:** a change breaks entry-`compileToEntry` round-trip fidelity; every
CI job stays green because the only oracle for it is `skipIf(!chromium)` and no CI job
that runs Vitest has chromium.

**Disposition (build):** in the nightly `demo-correctness` job, after installing
chromium, add a `npm run test:lib` (or a `vitest run` over these five files with
`KF_PLAYWRIGHT_DIR`/chromium resolvable) step so the browser oracles actually execute
where a browser exists. Alternatively fold each into the observe roster if the observe
scripts already cover the property (verify overlap first — they likely do not: round-trip
equality is a Vitest-only oracle). Until then, treat these files as documentation, not gates.

---

## GS-02 — Deploy `last-demo-green` ancestry gate is routinely bypassed via workflow_dispatch (P1)

**mechanism-family:** enforcement-defeated-by-operating-procedure

`deploy-pages.yml` `deploy-preflight` asserts the nightly `last-demo-green` tag is an
ancestor of the deploy SHA (`git merge-base --is-ancestor`), and both jobs' `if:` guards
are `github.event_name == 'workflow_dispatch' || (workflow_run.conclusion == success ...)`.
Every ancestry/CI-conclusion assertion is additionally guarded
`if: github.event_name != 'workflow_dispatch'` (deploy-pages.yml:38, 42). So a
**manual dispatch skips the demo-green ancestry check entirely.**

Per the project's own recorded practice (MEMORY: *"deploy via `gh workflow run
deploy-pages.yml` workflow_dispatch (bypasses the flaky Linux demo-gate)"* — Tranche R
impl-drive lesson, reaffirmed through T/U), real deploys are performed by manual
dispatch precisely to avoid the flaky Linux roster. The consequence is that the
`demo-correctness` roster's green — the only thing that verifies the demo isn't blank /
occluded / broken before it ships — is **not on the enforced path for the deploys that
actually happen.**

**Failure scenario:** the nightly roster is red (or was never run for a SHA); an operator
runs `workflow_dispatch` on deploy-pages; the preflight's ancestry assertion is skipped;
a demo defect ships to keyframes.babb.dev with a green deploy.

**Disposition (fold):** decide the posture explicitly. Either (a) make the ancestry
assertion also run under `workflow_dispatch` (drop the `!= workflow_dispatch` guard,
keep a documented `KF_FORCE_DEPLOY` break-glass input for genuine emergencies), or (b)
accept manual deploy as unverified and stop describing `last-demo-green` as a deploy
precondition. Today the comment claims a guarantee the standard operating procedure
removes.

---

## GS-03 — `proof:owner-golden` passes but is wired into no workflow (P2)

**mechanism-family:** standing-gate-never-run / apparatus-superfluity

`scripts/gates/visual/index.mjs` (375 L) is the owner-taste appearance oracle. Its
born-RED blocker is now discharged — `docs/tranches/T/goldens/BLESSED.json` exists and
the gate passes 14/14 cells (`node scripts/gates/visual/index.mjs` → *"the owner-blessed
goldens hold (14 checks; 14 cells)"*, energies 1.56–3.16 above the 1.5 floor).

But `grep -rn "owner-golden|gates/visual" .github package.json` shows its **only**
reference is `package.json:51 "proof:owner-golden": "node scripts/gates/visual/index.mjs"`.
No workflow invokes it. So:
- The **static leg** that does run (only when a human types the command) is weak: it
  verifies committed golden PNGs match their blessed sha256 and clear an edge-energy
  floor. Those PNGs never change unless someone re-blesses, so the static leg is
  near-tautological drift detection of files it also owns.
- The **strong leg** — the live perceptual dHash diff against the blessed golden
  (`gate()` §3) — needs a browser + built `dist/gh-pages`, and **no CI job provides
  either to this gate.** It is `SKIPPED (observe)` on every run without a browser.

Under the owner edict ("prune superfluity; spend time on product code and visual
verification, not process"), a 375-line gate whose enforcing leg never runs in automation
is exactly the process weight to justify or cut.

**Disposition (build or prune):** if owner-anchored appearance is a real standing
guarantee, add a nightly step that runs `npm run gh-pages` then
`node scripts/gates/visual/index.mjs` under chromium (co-scheduled with the roster it
already lives beside). If it is meant as a manual owner-review instrument only, delete
the static-only leg's pretense of being a "gate" and relabel it a review harness, keeping
`--capture-candidates`. Do not leave it as a green package script no path exercises.

---

## GS-04 — no-cycle rule documents a known-violations baseline that does not exist and is not wired (P2)

**mechanism-family:** stale/false apparatus documentation

`.dependency-cruiser.cjs` no-cycle rule comment (lines ~119–128) states the engine cycle
ring (`engine↔easing↔frame-compiler↔group↔waapi`, `spring↔spring-duration↔spring-reseat`,
…) is *"recorded in the known-violations BASELINE
(.dependency-cruiser-known-violations.json) so this rule greens on today's tree and bites
only a NEW cycle — the ratchet that lets the floor land without refactoring the engine."*

None of that is true of the running apparatus:
- `.dependency-cruiser-known-violations.json` **does not exist** (`cat` → empty; not in
  repo root listing).
- The `lint` script is `"depcruise src"` — **no `--known-violations` flag.**
  `grep -rn "known-violations"` across workflows/package.json/scripts/config hits **only
  the comment string itself** (`.dependency-cruiser.cjs:125`).
- `npm run lint` → *"✔ no dependency violations found (151 modules, 661 dependencies
  cruised)"* — green with **zero** violations, because R.W1 broke the cycle ring and the
  `viaOnly.dependencyTypesNot: ["type-only"]` refinement exempts type-closed rings.

So the "ratchet baseline" the comment describes as load-bearing is fictional. The rule is
sound (a new runtime cycle would red), but the comment misrepresents *why* it greens and
points a maintainer at a mechanism that isn't there — a trap for the next engine refactor.

**Failure scenario:** a future maintainer, trusting the comment, adds a cycle expecting
the baseline to absorb it (as documented); it hard-reds instead, or they hunt for a
baseline file that never existed.

**Disposition (fold):** delete the known-violations baseline paragraph from the comment
and state the true invariant ("the source graph is acyclic post-R.W1; any new runtime
cycle reds"). No code change needed — this is a documentation correction on a
correctly-behaving gate.

---

## GS-05 — 44 orphaned diff PNGs from the retired visual-lock gate (P3)

**mechanism-family:** dead-artifact cruft

`scripts/baselines/visual-lock/` contains only `_diff/` with **44 diff PNGs**
(`amiga-desktop-*.diff.png`, `cube-*.diff.png`, …). The gate that produced/consumed them
— `proof:visual-lock` — was retired in favor of `owner-golden` (only `index.mjs` remains
under `scripts/gates/visual/`; no `*visual-lock*` script exists: `find scripts -name
"*visual-lock*"` → none). `grep -rn "baselines/visual-lock"` across
scripts/workflows/package.json/vite.config → **no references.** These are stale *diff
outputs* (not even baseline references), tracked cruft from a dead gate.

**Disposition (prune):** delete `scripts/baselines/visual-lock/`.

---

## GS-06 — proof:publish U.D6 eager-graph clause is inert on the merge/release path (P3, documented)

**mechanism-family:** conditional-clause-vacuous-on-primary-path

`scripts/gates/surface/index.mjs:30-61` gates the demo entry chunk (no vendor-monaco/
highlight/three/worker edges; deferred-highlight ≤40 KB) **only if
`dist/gh-pages/assets` exists.** The CI `gates` job and the `release` job build only
`build:lib`, never `gh-pages`, so this clause prints
*"U.D6 deferred: dist/gh-pages is absent"* and asserts nothing on every merge and every
publish. It bites only in the nightly `demo-correctness` job (which builds gh-pages then
re-runs `proof:publish`). This is explicitly documented in the source comment, so it is
by-design, not a lie — but it means the demo bundle-shape protection rides on nightly
only, the same class of "not on the enforced path" as GS-01/GS-02.

**Disposition (fold / accept):** acceptable as-is given the library/demo split, but note
in the tranche ledger that U.D6 is a nightly-only guarantee, and consider having the
deploy-pages `deploy` job (which does `npm ci` + build demo) run `proof:publish` after
its build so the shipped bundle is shape-checked on the deploy path.

---

## Negatives — checked and found sound

- **`proof:boundary`** (`scripts/gates/surface/boundary.mjs`, 741 L): real and
  non-vacuous. Bundles each barrel light export from **source** with value.js +
  parse-that kept **non-external** via rolldown, asserts 0 value.js / 0 heavy-engine
  static modules per entry; self-derives the entry set from `export { … } from` parsing
  with a CORE sanity floor; W97 math-subpath probe bundles the graph and proves it
  grammar-free rather than allow-listing blindly; assertion 4/4b source-grep + parse-that
  acyclic-spine scan over the full tree. The negative test named in its own header
  (add `import "@mkbabb/value.js"` to a light module → red) is genuinely enforced.
- **`published-surface.mjs`** (874 L): actuates `npm pack --dry-run --json
  --ignore-scripts` (real tarball), imports the **built** `dist/keyframes.js` and diffs
  `Object.keys(loadAnimationEngine())` vs the d.ts interface (clause d — real runtime
  actuation), peer-honesty scans the dist import graph, PKG-3 `_2`-alias grep on the
  emitted d.ts. All fail-loud with sanity floors.
- **`readme-runs.mjs`** (498 L): executes 20 README snippets in child processes against
  the built dist under a jsdom shim, verifies 29 `// =>` assertions AND that the stated
  assertion count actually ran (a silently-not-executed assertion reds). Roster floor is
  derived from the taught set, not a frozen integer. Strong executable-docs oracle.
- **`consume-bundle.mjs`**: bundles the **built dist** barrel as a downstream consumer
  would; complements the source-side boundary. (Reported "0 dynamic chunk(s)" is correct
  — the sampled LIGHT exports pull no engine, so no dynamic chunk; the check only fails
  on static engine/value.js inlining, which is the right invariant.)
- **`release:changelog`**: real git-reconstructed surface diff; correctly resolved
  v5.3.5 as predecessor, found `getTimingFunction` removed, confirmed it documented in
  `docs/MIGRATION-6.0.0.md`. Fallback logic for already-published/offline is sound.
- **tsconfig triplet**: `check:lib` (src-only, glass-free, the release gate) green <1s;
  `check` (whole project + `tsconfig.test.json` bringing test/+bench/ into the typecheck)
  green ~3s. The self-alias `@mkbabb/keyframes.js → src/animation/index.ts` is mirrored
  consistently across `tsconfig.json`, `vitest.config.ts`, and the vite config (one realm).
- **`test:lib`**: 99 files pass, 1042 tests pass, 1 expected-fail, fast. Correctness spine
  is real.
- **depcruise rules 1–3**: real graph rules (no-cycle with type-only exemption,
  leaf-no-engine-no-valuejs, light-barrel allowlist mirroring proof:boundary). 151 modules
  cruised, 0 violations. (Only the *comment* on rule 1 is stale — GS-04.)
- **build/vite plugins** (`scripts/build/vite/*.ts`): `assetExtension404`,
  `chunkAnalyzer` (env-gated `KF_ANALYZE`), `criticalCSS`, `deferLazyCSS`,
  `engineDtsRollup` — legitimate build machinery wired into `vite.config.ts`, not gates.
- **`release.yml`**: tag==`package.json` version assertion is real; reuses the same
  compact gate surface (check:lib/build/test:lib/proof:publish/changelog) before
  `npm publish --provenance`.
- **`owner-golden` static leg**: passes 14 cells with subject-energy above floor and
  sha-matched blessed PNGs (weak, but not broken — see GS-03).

---

## Coverage gaps (this lane did not cover)

- **The 6 observe scripts** (`smoke` 200L, `occlusion` 327L, `usability` 410L,
  `subject-animates` 341L, `live-session` 1612L, `live-session-mobile` 1202L) and
  `lighthouse` (343L): I read their headers only. I did **not** run them (no browser, per
  lane rules) and did not audit their internal assertion soundness — whether their live
  clauses actually bite or downgrade to notes. A separate lane should drive the roster on
  a real browser. Note `audit:lighthouse` is invoked in CI with `|| echo "…recorded"`
  (ci.yml) so it can never fail the job — observe-only by construction.
- **Nightly CI green on the Linux runner**: cannot be verified from here; the roster's
  device-dependence history (MEMORY) suggests it is the flaky path GS-02 bypasses.
- **`gen:agent-surface` drift**: I did not verify whether the generated `llms.txt` /
  `llms-full.txt` are checked for staleness against `docs/published-surface.md` (the
  generator exists; a freshness gate may not).
- **`capture.mjs` / `probe-webkit-linear-accel.mjs` / `color-fidelity-harness.mjs`**:
  read as instruments (not CI gates); not exercised.

---

## Keep / Fold / Prune table

| Item | Boundary it checks | Can it fail? | Verdict | Rationale |
|---|---|---|---|---|
| `check` (pkg script) | whole-project + test/bench typecheck | yes | **keep** | dev-time; green ~3s; not in CI (fine) |
| `check:lib` | src-only publishable types (release gate) | yes | **keep** | CI+release gate; <1s; glass-free |
| `build:lib` / `build` | lib build artifact | yes | **keep** | prerequisite for every surface gate |
| `test:lib` | correctness suite (library project) | yes | **keep** | 1042 real tests; CI+release gate |
| `test` / `bench` / `bench:color-fidelity` | dev/measurement | n/a | **keep** | instruments, not gates |
| `lint` (`depcruise src`) | source graph: cycles, leaf/light boundary | yes | **keep** (fix comment GS-04) | real; but rule-1 comment is stale fiction |
| `proof:publish` → boundary.mjs | source light/heavy value.js split | yes | **keep** | crown jewel; source-bundle proof |
| `proof:publish` → published-surface.mjs | tarball==exports==docs==runtime | yes | **keep** | actuates npm-pack + built dist |
| `proof:publish` → consume-bundle.mjs | downstream dist consumer graph | yes | **keep** | complements source boundary at dist |
| `proof:publish` → readme-runs.mjs | README snippets execute + assert | yes | **keep** | executable-docs oracle |
| `proof:publish` U.D6 inline clause | demo entry chunk shape | only if gh-pages built | **fold** (GS-06) | inert on merge/release; nightly-only |
| `proof:owner-golden` (gates/visual) | owner appearance golden | static leg only w/o browser | **build or prune** (GS-03) | passes but no workflow runs it |
| `release:changelog` | semver removal→migration doc | yes | **keep** | real git surface diff; in release.yml |
| `gen:agent-surface` | generate llms.txt from manifest | generator (not a gate) | **keep** (verify drift gate — gap) | ensure output freshness is gated |
| `demo:correctness` (`run-demo-roster`) | 6 browser observations | yes (nightly job) | **keep** (enforce GS-02) | only real appearance signal; but bypassed on deploy |
| `audit:lighthouse` | a11y=100/SEO≥90 | masked `|| echo` in CI | **keep as observe** | never fails the job by construction (observe-only) |
| observe/*.mjs (smoke/occlusion/usability/subject-animates/live-session[-mobile]) | live demo product truth | yes | **keep** (audit separately) | not run this lane; roster backbone |
| 5 `skipIf(!chromium)` Vitest oracles | round-trip/a11y/browser-parse correctness | never in CI | **build** (GS-01) | zero CI signal until run under chromium |
| `.dependency-cruiser.cjs` rule-1 comment | (doc) | — | **fold** (GS-04) | describes a baseline file that doesn't exist |
| `scripts/baselines/visual-lock/_diff/` (44 PNGs) | (dead) | — | **prune** (GS-05) | retired gate's orphaned diff outputs |
| `scripts/capture.mjs`, `probe-webkit-*`, `color-fidelity-harness` | instruments | n/a | **keep** | measurement harnesses, not gates |
| `scripts/lib/*` (demo-driver, console-budget, agent-surface) | shared gate substrate | n/a | **keep** | single-source libs for the above |
| build/vite/*.ts plugins | build behavior | build | **keep** | product build machinery |
| ci.yml `gates` job | library merge correctness | yes | **keep** | the real merge gate |
| ci.yml `demo-correctness` job | nightly appearance roster | yes | **keep** (GS-02) | non-blocking for merges by design |
| deploy-pages.yml preflight | CI-green + demo-green ancestry | bypassable via dispatch | **fold** (GS-02) | routine dispatch defeats the ancestry check |
| release.yml | tag==version + gate surface + publish | yes | **keep** | provenance-signed publish path |
