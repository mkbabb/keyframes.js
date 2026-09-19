# V.W9 — Prune Tombstones

The prune-sweep unit's deletion/fold ledger (executes R2-07's PRUNE/FOLD rows).
One line per removal, with the live-consumer grep that cleared it. Staged on
`v/w9-staging` for post-W2 landing. Every target was grepped across
`src/ test/ bench/ scripts/ .github/` before removal — a live consumer would
have vetoed the delete (none did).

## Deletions (files)

- **`bench/taxonomy.json`** (654 L) — PF-1/PF-2. Inert (no gate/script/test READS
  it) AND wrong (23 interp-buffer rows, 0 matching the 7 live cases). The 5 prose
  references (`src/animation/engine/interpolate.ts:259`,
  `bench/resolve.bench.ts:6`, `bench/group-composite.bench.ts:29`,
  `bench/cold-import.bench.ts:25`, `bench/spring-tick.bench.ts:233`) are COMMENTS,
  not reads → orphaned prose routed to the DOC wave (XB-05 / PF-3), not W9.
- **`bench/group-soa-integration.mjs`** (66 L) — PF-5. Orphan spike; no runner,
  zero content references (`grep -rn group-soa-integration` = none). Compositor
  SoA decision sealed.
- **`bench/typed-om-validate.mjs`** (184 L) — R2-07 orphan row. No runner; the only
  external reference was `bench/taxonomy.json` (deleted here too).
- **`bench/d3-changed-keys.measure.test.ts`** (63 L) — R2-07 orphan row. Matches
  neither the `bench/*.bench.ts` benchmark glob nor `test/**` → no runner; nothing
  imports it.
- **`bench/sync-step.measure.test.ts`** (199 L) — R2-07 orphan row. Same: orphan
  `.measure.test.ts`, no runner. The two references
  (`test/physics/sync-step.test.ts:24`, `bench/sync-step.bench.ts:129`) are PROSE
  comments (already citing a stale `test/…` path) → doc-wave cleanup, not a
  consumer. `sync-step.bench.ts` (the live perf bench) is untouched.
- **`scripts/probe-webkit-linear-accel.mjs`** — R2-07 orphan-instrument row +
  V-32. Self-labeled "NOT a CI gate"; no runner/reference (`grep` = file only).

## Already absent (recorded, no deletion made)

- **`scripts/baselines/visual-lock/` (the 44 diff PNGs, GS-05)** — the directory
  does NOT exist on this tree (no tracked files: `git ls-files | grep visual-lock`
  = empty; no untracked dir). Already gone; nothing to delete. `gates/visual/`
  references `visual-lock` only in PROSE (describing the retired `proof:visual-lock`
  it superseded), not as a live path.

## Folds (edits, not deletions)

- **`test/engine/zero-alloc.test.ts` — the gc arm PRUNED (TC-3).** Removed the
  `it("heap-delta over a steady-state window ≈ 0 …")` block: without `--expose-gc`
  it was a permanent `expect(true).toBe(true)` tautology. The deterministic
  buffer-identity arms (the real, portable bite) STAY.
- **`test/group/group-snapshot-identity.test.ts` — the `it.fails` wrapper FOLDED
  (TC-6).** Removed the `it.fails("g.hydrate(g.serialize()) is an identity …")`
  round-trip + its orphaned `clockOf` helper. The positive control
  (`typeof g.serialize !== "function"`) STAYS — it already flips RED the instant
  the engine ships the seam, so the HANDOFF signal is preserved without the
  double-count R2-07 forbade. Seam confirmed absent this tree (grep
  `src/animation/group/` for `serialize`/`hydrate` = only an unrelated comment).

## Relabel (GS-03 — out of the proof namespace)

- **`proof:owner-golden` → `review:owner-golden`.** `package.json` script key +
  the 6 self-label strings in `scripts/gates/visual/index.mjs` (its enforcing dHash
  leg runs in no workflow — it is a manual review harness, not a proof gate). The
  14-frame owner blessing set is untouched; MR1's per-scene render assert covers
  the "blank ships green" boundary more cheaply. `demo/DESIGN.md`'s prose "owner-
  golden" reference is demo-scope (do-not-touch) → doc wave.

## V-32 — scripts-tree residual re-measure (post-U)

`wc -l` + colocation scan over `scripts/**` (31 files). Every surviving file is an
R2-07 KEEP with a live runner/reference and sits under a purposeful subtree
(`build/vite/`, `gates/{structure,surface,visual}/`, `lib/`, `observe/{demo,}`,
`release/`) — no flat orphan, no mis-colocation. The ONLY residual orphan the
sweep surfaced was `probe-webkit-linear-accel.mjs` (pruned above). U cleared the
tree as expected; no additional prune.

---

# ADDENDUM 2026-09-19 — X.KF.W10 `.e` / G-7: THE LANDING, AND THE CENSUS THAT VETOED TWO OF THE SIX

SERVED MODEL: claude-opus-5[1m]

E-3: nothing above this rule is rewritten. The text above is the staging seat's
record at `b920b190` (2026-07-17) and stands as written. This block records what
the LAW A import-graph census measured **at the landing tree**, 229 commits later,
and what the landing therefore did.

## The instrument

X.KF.W10 §3.5 LAW A binds *"every seat that writes, carries, or **leaves standing**
an act that deletes, repoints, or shims a module `M` at path `P`"*, and G-7's
falsifier is explicit: *"A LAND that prunes on this file's pasted census rather
than re-deriving it at the landing tree fails on LAW A, naming the module."* The
spec's own census is dated to `origin/master 81a56990`. It was **re-derived here**
against `origin/master 69095552`, never inherited.

## Leg 1 — specifier census (full-path spelling + basename tail + alias roots)

⟨cmd⟩ `git grep -nF '<path-tail>' origin/master -- . ':!docs/'` for each of the six,
then the basename-tail spelling for each. **Zero import specifiers, all six.** Every
non-`docs/` hit is one of: the module's own header or usage comment
(`bench/taxonomy.json:3` · `bench/typed-om-validate.mjs:1,26,124,163,164,180` ·
`scripts/probe-webkit-linear-accel.mjs:36`), a `$note` string inside **another
member of the same prune set** (`bench/taxonomy.json:90` → `typed-om-validate.mjs`),
or a docblock naming a **different, `test/`-rooted** path
(`bench/sync-step.bench.ts:129` · `test/physics/sync-step.test.ts:24` ·
`CHANGELOG.md:359`). All recorded as non-import context; none counted as a consumer.

**Alias roots enumerated, not assumed.** `tsconfig.json#paths` → `@src/*`,
`@mkbabb/keyframes.js`. `vitest.config.ts#resolve.alias` → `@src` ·
`@mkbabb/keyframes.js` · `@styles` · `@state` · `@components` · `@composables` ·
`@utils` · `@kf-engine` · `@assets` · `@app`. Every one resolves into `src/`,
`demo/` or `assets/`; **none can reach `bench/` or `scripts/`**, so no aliased
spelling of any of the six exists to be missed.

## Leg 2 — symbol / runner census, read at the frontier — **THE VETO**

The spec's census states, of the two `.measure.test.ts` members: *"`vitest.config.ts:35`
`benchmark.include = ["bench/*.bench.ts"]` — **neither `.measure.test.ts` file is
matched** (the 'no runner glob' reading reproduces)."*

**That reading DOES NOT reproduce at the landing tree.** `vitest.config.ts` has moved:
`benchmark.include` now sits at `:47`, and at **`:84-91` a THIRD declared project
exists** —

```
{ extends: true, test: { name: "measure",
  include: ["bench/**/*.measure.test.ts"], environment: "jsdom" } },
```

— landed by **X.KF.W8 `.g`, commit `422c16c1`** (*"R-5/G9 — the two bench measure-test
orphans are adopted in place by a third declared project"*), four commits before this
landing and inside this same tranche. Its commit message is the adoption in as many
words: *"Before this, `bench/d3-changed-keys.measure.test.ts` and
`bench/sync-step.measure.test.ts` were collected by nothing."*

Measured, not inferred — ⟨cmd⟩ `npx vitest run --project measure` at the landing tree
→ **`Test Files 2 passed (2)` · `Tests 3 passed (3)`**. Both files are the prune set's.

**Consumer set, re-derived:**

| module | consumer set at `69095552` | disposition |
|---|---|---|
| `bench/d3-changed-keys.measure.test.ts` | **`vitest.config.ts:84-91`, project `measure`** (runner) | **DELETE VETOED** |
| `bench/sync-step.measure.test.ts` | **`vitest.config.ts:84-91`, project `measure`** (runner) | **DELETE VETOED** |
| `bench/group-soa-integration.mjs` | ∅ | pruned |
| `bench/taxonomy.json` | ∅ | pruned |
| `bench/typed-om-validate.mjs` | ∅ | pruned |
| `scripts/probe-webkit-linear-accel.mjs` | ∅ | pruned |

The staging seat's own rule is what fires here — *"a live consumer would have vetoed
the delete (none did)"*. One does now. The prune's premise was true on 2026-07-17 and
is **false at the landing tree**; the only repoint that would make the delete safe is
removing X.KF.W8's `measure` project, which would undo a sibling wave's landed cure and
is out of this unit's bounds. **Four of six deletions land; two are dropped, named.**

`tsconfig.test.json:17` `include: ["test/", "bench/", "demo/env.d.ts"]` still holds, so
`bench/` remains inside the typecheck project — measured below, not elided.

## MR4 — CONVERGED AT THE FRONTIER, recorded rather than wired twice

MR4's `package.json` leg (`"test:demo": "vitest run --project demo"`) is **already at
the frontier, verbatim**, at `package.json:47`; the merge diff on `package.json` is the
GS-03 relabel line alone. MR4's `ci.yml` leg conflicted with **X.KF.W4**'s
`demo correctness suite` step, which runs the identical `npm run test:demo` on the same
blocking job. MR4's goal criterion (*"the demo vitest project runs in NO CI job today"*)
is **met by X.KF.W4's step**, so the staged duplicate is dropped at the landing — a
second identical run is waste and a false second signal. Recorded at the bytes in
`.github/workflows/ci.yml` beside the surviving step.

## TC-3 and TC-6 — both staged premises RE-DERIVED TRUE

- **TC-6** (the `it.fails` round-trip fold) rests on *"seam confirmed absent this tree"*.
  ⟨cmd⟩ `git grep -nE '\b(serialize|hydrate)\b' HEAD -- src/animation/group/` → **0 hits**.
  Premise holds; the positive control still carries the HANDOFF signal.
- **TC-3** (the gc heap-delta prune) rests on *"without `--expose-gc` it was a permanent
  tautology"*. ⟨cmd⟩ `git grep -n 'expose-gc' HEAD -- . ':!docs/'` → 3 hits, **all comments**;
  no runner, script or workflow wires the flag. Premise holds.

## BV-2 — one type cure the landing owed

`test/group/static-weight-composite-golden.test.ts` typed its three layer factories
`AnimationLayerConfig`. At the landing tree that interface requires `weight` and
`enabled`, so the staged spelling raised **3 new `tsc -p tsconfig.test.json` errors**
(23 → 26). Cured at root: the factories are typed `Partial<AnimationLayerConfig>`, which
is the constructor's own declared parameter type (`group.ts:182`,
`AnimationGroupInput.layer`); the engine merges each partial over `defaultLayerConfig`
(`{ zIndex: 0, weight: 1, op: "replace", enabled: true }`). **No value changed** —
`addPlain` still omits `weight`, which is the arm the golden's *"`weight` is inert on
op:add"* row measures. Typecheck returns to **23**, the pre-landing baseline exactly.

## Landing battery — BEFORE → AFTER, at the landing tree, double-read

| probe | BEFORE (`69095552`) | AFTER (the landing) |
|---|---|---|
| `npm run test:lib` | 112 files passed / 5 skipped; 1256 passed / 3 expected-fail / 14 skipped | **113 / 5; 1259 passed / 2 expected-fail / 14 skipped** (+1 file = BV-2; −1 expected-fail = TC-6's fold) |
| `npm run test:demo` | 39 files / 286 tests passed | **39 / 286 passed — identical (TC-5 verification)** |
| `npx vitest run --project measure` | 2 files / 3 tests passed | **2 / 3 passed — preserved by the veto** |
| `npx tsc -p tsconfig.test.json` | 23 errors | **23 errors — no landing-introduced error** |
| `npm run check:lib` | 3 errors (TS6133, KF.W5-owned) | **3 — unmoved** |
| `npm run lint` | 4 dependency violations | **4 — unmoved** |
| `npm run proof:structure` | PASS, 0 violations | **PASS, 0 violations** |
| `npm run build:lib` | built | **built 1.55s** |
| `node --check` ×4 merged `.mjs` · `yaml.safe_load` ×2 workflows | — | **all OK** |
| `grep -rn 'proof:owner-golden'` over `package.json scripts/ .github/` | present | **0 — relabel complete** |

## RED-PREEXISTING at the landing substrate, named and NOT cured here

**`npm ci` fails on `master` in every CI job**, before any step this landing touches:
*"`npm ci` can only install packages when your package.json and package-lock.json are
in sync … Missing: `@vue/test-utils@2.5.1` from lock file"* (+14 transitives:
`js-beautify`, `vue-component-type-helpers`, `config-chain`, `editorconfig`, `glob`,
`js-cookie`, `nopt`, `ini`, `proto-list`, `@one-ini/wasm`, `commander`, `minimatch`,
`minipass`, `path-scurry`, `abbrev`). Origin: **`3a01e362`** (*"build(kf · X.KF.W7.a):
+@vue/test-utils ^2.5.1 devDependency"*) added the manifest entry without the lockfile.
`package-lock.json` is not in this unit's writable set (§4 *"EXPLICITLY NOT IN BOUNDS:
any product source in either repo"*), so it is **named and routed, never quietly
patched**. Consequence recorded honestly: every CI witness at this landing terminates
at `npm ci`, so MR1/MR2/MR3's runtime behaviour is witnessed **locally** (above) and
not yet in CI.
