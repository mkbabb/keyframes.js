# Lane a15-post-r-fixes — POST-R integration fixes audit

Scope: the three commits made **after** R's terminal close (`5a5f7db`, 2026-06-24 22:27:27):
`6f2493d` (bench R-fallout), `1f7d323` (taxonomy classify), `18e8617` (gate re-tier); plus the
three "R integration" commits that land the session edits named in the brief
(`39b9e25`, `65041ef`, `c81b9fc` — all timestamped 22:03–22:09, i.e. *before* `5a5f7db`, so they
are properly R.W8-adjacent close-out commits, not truly post-close, but are audited here as
instructed since they carry the same "integration fallout" character).

## Executive summary

Five of the six changes are correct, evidenced, and honestly scoped. **One is a real, verifiable
defect**: `6f2493d`'s `waapi-densify.bench.ts` hunk renamed the type-only import from `Animation`
to `KeyframesAnimation` but left every one of the file's 9 usage sites as bare `Animation<V>` —
which now silently resolves to `lib.dom.d.ts`'s non-generic global `Animation` interface instead
of erroring, because `bench/` is excluded from both `tsconfig.json`'s `include` and dependency-
cruiser's lint scope, so no CI surface ever type-checks it. Compiling the file in isolation
reproduces 8 `TS2315: Type 'Animation' is not generic` errors. The commit message ("waapi-densify
uses `KeyframesAnimation` type") overclaims: the import is dead, and the claimed migration didn't
happen. This is currently harmless at runtime (vitest bench uses esbuild, which erases types
without checking them) but is a landmine for Tranche S, which explicitly plans deeper zoning and
tighter gates — the moment `bench/` is added to `tsc --noEmit` scope (a natural S move), this file
goes red, and whoever lands that change will spend time debugging a bug that was actually
introduced here, a tranche early.

The second-order finding is process-level: R's `FINAL.md` declares the tranche "green on
`tranche-r-dev`" at close, but `proof:bench-runs`/`proof:bench-taxonomy` were provably broken by
the R.W4 `animate()` excision (the bench file's runtime assertion `typeof engine.animate !==
"function"` would throw post-excision — confirmed by diffing `load-engine.ts` at `a15cd48` vs
now, where `animate` is present pre-R and absent post-R) and `proof:gate-is-runtime` was RED
(confirmed: `proof-emerging-css-resolve-now.mjs` has zero browser/actuation anchors, so its
former membership in `proof:correctness` was a genuine precept violation the meta-gate is designed
to catch). Both were fixed the following day in unplanned hotfix commits, and `FINAL.md`/
`PROGRESS.md` were never amended to record that the close-time "green" claim required two more
fix commits to actually be true.

## Findings

### 1. [HIGH] `waapi-densify.bench.ts` type-fix is incomplete — import renamed, 9 usage sites left stale, silently shadowed by the DOM global

- **File/evidence**: `bench/waapi-densify.bench.ts:27` (`import type { KeyframesAnimation } from
  "../src/animation/engine";` — unused), vs. usage sites at lines 61, 83, 184, 201, 218, 237, 251,
  329, all still `Animation<...>`. Commit `6f2493d`.
- **Failure scenario**: compile the file with the repo's actual strict compiler options (target
  ES2022, DOM lib, strict, skipLibCheck) — reproduced standalone:
  ```
  bench/waapi-densify.bench.ts(61,16): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(83,16): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(184,26): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(201,36): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(218,36): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(237,36): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(251,36): error TS2315: Type 'Animation' is not generic.
  bench/waapi-densify.bench.ts(329,24): error TS2315: Type 'Animation' is not generic.
  ```
  This is invisible today only because `tsconfig.json`'s `"include": ["src/", "demo/"]`
  (`tsconfig.json:24`) and `vitest.config.ts`'s `benchmark.include: ["bench/*.bench.ts"]` never run
  `tsc`, and `depcruise src --ignore-known` (`package.json:211`, the `lint` script) never touches
  `bench/`. `git show 6f2493d^:bench/waapi-densify.bench.ts` proves the pre-fix file correctly
  imported and consistently used `Animation<V>` (the real generic engine export, pre-R.W4
  rename) — so this is a regression the commit introduced, not one it inherited.
- **Verdict**: CONFIRMED (reproduced directly).
- **Proposal**: Tranche S should either (a) fold `bench/` into `tsconfig.json`'s `include` (or a
  dedicated `tsconfig.bench.json` wired to `check`) so this class of drift is caught mechanically,
  and/or (b) finish the actual fix — `sed -i 's/\bAnimation</KeyframesAnimation</g'` across the 9
  sites in `waapi-densify.bench.ts`. Either alone helps; both together close the gap for good.

### 2. [MEDIUM] R's close declared "green" while `proof:bench-runs`/`proof:gate-is-runtime` were provably red; FINAL.md was never amended

- **File/evidence**: `docs/tranches/R/FINAL.md:5` ("IMPLEMENTED, merged, and green on
  `tranche-r-dev`"), closed timestamp `5a5f7db` (2026-06-24 22:27:27). The three post-close fix
  commits landed at 22:48:50 (`6f2493d`), 23:09:59 (`1f7d323`), and the next day 14:44:19
  (`18e8617`) — the last explicitly states its purpose is "`proof:gate-is-runtime` GREEN" in its
  own subject line, i.e. an admission the meta-gate was red at the point it was written.
  Confirmed independently: `git show a15cd48:src/animation/load-engine.ts` has `animate` on the
  `AnimationEngine` surface; the current tree does not (R.W4 excised it) — so
  `bench/interp-buffer.bench.ts`'s `typeof engine.animate !== "function"` assertion (pre-fix)
  would throw on any post-R.W4 tree, breaking `proof:bench-runs`/`proof:bench-taxonomy`.
  Separately, `scripts/proof-emerging-css-resolve-now.mjs` has no `withPage`/`withBrowser`/
  `page.*` actuation anchors anywhere in the file (grepped, zero hits) — it is a pure jsdom +
  source-grep gate exactly matching the class `proof:gate-is-runtime`'s own doc comment
  (`scripts/proof-gate-is-runtime.mjs:12-19`) says must NOT be a `proof:correctness` member. Its
  prior membership there (removed in `18e8617`) was a real, self-admitted precept violation.
- **Failure scenario**: not a runtime bug — a documentation-integrity gap. Anyone reading
  `FINAL.md` alone (as Tranche S's brief instructs: "its close [...] judge SPEC vs SHIPPED") would
  conclude R closed fully green; the actual git history shows a ~16-hour tail of unplanned
  hotfixes required to make that true, and none of `FINAL.md`/`PROGRESS.md` record the tail.
- **Verdict**: CONFIRMED.
- **Proposal**: Tranche S's wave-closing discipline should require a **fresh, full
  `npm run proof:all`** (not `proof:hygiene`/`proof:correctness` subsets, and not a state carried
  forward from an earlier run) immediately before writing `FINAL.md`, and `FINAL.md` should name
  the exact commit SHA the green run was taken against. If post-close fixes are still needed (as
  here), fold them into the close commit itself rather than landing them as same-day/next-day
  orphan hotfixes with no linking doc update.

### 3. [LOW] `bench/interp-buffer.bench.ts` `animate()`→`CSSKeyframesAnimation` fix is correct and complete

- **File/evidence**: `bench/interp-buffer.bench.ts:491-495` now asserts
  `typeof engine.CSSKeyframesAnimation !== "function"`. Confirmed `CSSKeyframesAnimation` is a
  concrete runtime member of the `AnimationEngine` interface (`src/animation/load-engine.ts:122`)
  and of the `./engine` zone barrel (`src/animation/engine/index.ts:20`). This correctly restores
  the "touch the resolved surface so the await isn't dead-code-eliminated" contract the comment
  describes, using the canonical post-R.W4 heavy-surface member.
- **Verdict**: CONFIRMED correct, no residue.

### 4. [LOW] `bench/taxonomy.json` colorTail classification (6 rows) is complete and correctly matched

- **File/evidence**: `bench/interp-buffer.bench.ts:425-459` generates exactly 6 dynamic bench
  cases (`KS = [3, 8, 12] as const` × `{boxed, SoA}`) inside a `for` loop — the 6 taxonomy rows
  added in `1f7d323` (`bench/taxonomy.json` +30 lines) name each one exactly
  (`colorTail boxed · K=3 · 600-frame window`, etc.), verified by cross-checking the template-
  literal interpolation against the loop bounds. `observe-only` classification is consistent with
  its immediate sibling `processFrame SoA · K=<k>` rows (added earlier, same file, same shape,
  same category) — neither carries a documented floor claim the way the `lerpArray SoA K=8`
  arm does (`bench/taxonomy.json:245`, "the W122 1.2x-at-K=8 floor," `budgeted`), so `observe-
  only` (not `budgeted`) is the honest posture per the gate's own taxonomy legend
  (`scripts/proof-bench-taxonomy.mjs:19-23`). No orphan case, no coverage gap remains for this
  suite (verified case count == taxonomy row count for the suite programmatically).
- **Verdict**: CONFIRMED correct.

### 5. [LOW] `package.json` re-tier of `proof:emerging-css-resolve-now` is principled and matches its two siblings

- **File/evidence**: `package.json` (diff in `18e8617`) removes the gate from
  `proof:correctness` and adds it to `proof:hygiene-chain`, landing it alongside
  `proof:emerging-css-resolve-p2` and `-fn`, which were already hygiene-chain-only. Read all
  three scripts (`scripts/proof-emerging-css-resolve-{now,p2,fn}.mjs`): none contains
  `withPage`/`withBrowser`/`page.click`/`page.dispatchEvent`/etc. — all are source-grep +
  `vitest run test/emerging-css-resolve-*.test.ts` (jsdom) chains, exactly the class
  `proof-gate-is-runtime.mjs`'s own precept doc (lines 12-19) calls a HYGIENE gate, not a
  CORRECTNESS gate. `-now`'s own top-of-file comment (line 13, unmodified by this fix) already
  self-describes as "All jsdom-clean — NO browser," which directly contradicts its former
  `proof:correctness` membership. The fix corrects a genuine miscategorization; it is not a
  workaround or a gate weakening (the gate still runs, in the correct tier, in `proof:all`'s
  `report-all` sweep either way).
- **Verdict**: CONFIRMED correct and principled.

### 6. [LOW] The three "R integration" session-edit commits (`39b9e25`, `65041ef`, `c81b9fc`) are all correct

- **`39b9e25`** (`CLAUDE.md` demo tree + `ci.yml` step): `CLAUDE.md`'s demo tree now names
  `@/ app/ scenes/ playground/`, matching the actual `demo/` top level (`ls demo/` → `@ app
  CLAUDE.md DESIGN.md playground scenes`) and `demo/scenes/` subdirs (`amiga cube easing morph
  motion-path sequence spring square`), verified by direct listing. The added `ci.yml` step for
  `proof:scene-colocated` fills a real gap: the gate script was authored in R.W5
  (`9c1d9bd`, confirmed via `git log --follow`) and was already a `proof:hygiene-chain` member
  (`package.json:150`/`236`) but had no individual `ci.yml` step until this commit — consistent
  with the file's established one-step-per-hygiene-gate convention (verified against neighboring
  steps at `.github/workflows/ci.yml:355-372`).
- **`65041ef`** (`proof-published-surface.mjs` demo-dir retarget): the clause-E real-dir list
  (`["@", "app", "scenes", "playground"]`) and the new "must-not-reappear" phantom-dir guard
  (`["amiga", "cube", "easing", "motion-path", "sequence", "spring", "square", "morph"]`) both
  match the current filesystem exactly (verified by direct `ls`). The reappear guard is a
  genuinely useful regression tripwire against a scene dir silently un-fusing back to
  `demo/<name>/`.
- **`c81b9fc`** (5 stale test imports + `ios-text-entry` rewrite + vitest alias): all 5 retargeted
  imports (`demo/amiga/useSphereSpin` → `demo/scenes/amiga/useSphereSpin`, and 3 more of the same
  shape) resolve to files that exist (verified by direct path checks on all 4 target files). The
  `ios-text-entry.test.ts` rewrite correctly mirrors the R.W3 §2F source change from a
  parameterized `isIOSLikePlatform(opts)` to a zero-arg global-reading
  `isIOSLikePlatform()`/`clampIOSNoZoomFontSize(fontSize)` (confirmed against
  `demo/@/utils/iosTextEntry.ts:1-11`); the `vi.stubGlobal`/`vi.unstubAllGlobals` pattern is
  idiomatic vitest for global-reading platform-detection code. Ran the suite directly: `npx vitest
  run test/ios-text-entry.test.ts` → 4/4 pass. Traced all 4 test cases' expected values by hand
  against the source predicate (`/iPad|iPhone|iPod/.test(userAgent) || (maxTouchPoints > 1 &&
  CSS.supports(...))`) — all four assertions are semantically correct, not just passing by
  accident. The `vitest.config.ts` alias additions (`@composables`, `@app`) are load-bearing for
  the retargeted imports and match the R.W5 fusion's actual demo build aliases.
- **Verdict**: all three CONFIRMED correct and complete.

## Tranche-S implications

1. **Fix the `waapi-densify.bench.ts` type regression directly** (Finding 1) — a one-line
   `sed`-shaped cleanup (rename the 9 stale `Animation<...>` usage sites to
   `KeyframesAnimation<...>`), landed early in S so it doesn't get discovered mid-wave by someone
   else's unrelated change.

2. **Bring `bench/` under type-check coverage.** Add `bench/` to `tsconfig.json`'s `include` (or a
   sibling `tsconfig.bench.json` wired into `check`/`check:lib`), and consider whether
   dependency-cruiser's `lint` script should also walk `bench/`. This is the structural fix behind
   Finding 1 — without it, any zone rename (which S's deeper sub-zoning, e.g. `compile/backward/`,
   `engine/css/`, will produce plenty of) can silently break bench files the same way, forever,
   with no gate ever noticing.

3. **Tighten the tranche-close ritual** (Finding 2): require a from-clean `npm run proof:all`
   immediately before authoring `FINAL.md`, cite the exact SHA, and if post-close fixes are still
   needed, fold them into the close commit rather than leaving an undocumented same-day/next-day
   hotfix tail. This directly serves the mission's "full prompt recap" and "fold ALL chronic +
   open deferrals" goals — an undocumented gap between claimed-green and actually-green is exactly
   the kind of residue that should not carry into S silently.

4. **When Tranche S re-tiers or reclassifies gates** (as `18e8617` did, correctly), the precedent
   set here — verify against the gate's own doc comment / self-description, and against its
   named siblings — is the right method and should be the standing bar for any future re-tier,
   not just this one.

5. No further action needed on Findings 3-6 — they are correct and complete as shipped; cite them
   as the positive baseline for what a well-evidenced post-close integration fix looks like.
