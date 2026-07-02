# a14-w8-close-integrity — R.W8 close audit

## Executive summary

R.W8's mechanical claims hold: `node scripts/proof-chronic-closure.mjs` parses
`docs/tranches/R/PROGRESS.md` TODAY and exits 0 (verified live, not
chain-trusted); the re-point commit `f01fa9a` and the DM-7 KILL commit
`23a6867` both exist and match FINAL.md's citations; `proof:workaround-deletion`,
`proof:decomposition`, `proof:lint-clean`, and `proof:ci-coverage` all
independently re-verify GREEN today. The close mechanics were not faked.

But FINAL.md's version-naming rationale does not survive scrutiny. **5.1.0
removed `animate()` — a function that was part of the *published* npm 5.0.0
surface (both as a static barrel type re-export and as a runtime member of
`await loadAnimationEngine()`), documented as the headline "single-call front
door" in the pre-R README (`animate(box, {...})` examples) — and shipped it
under a `### Removals` subsection of a MINOR bump, with no migration doc and
no gate analogous to the one 5.0.0 used for a smaller-scoped breaking cut.**
5.0.0's alias drop (`Animation`/`ScrollTimeline`/`ScrollTimelineOptions`) got a
dedicated `docs/MIGRATION-5.0.0.md` gated by `proof:changelog-5` (HARD tier,
"a semver-honesty precept"). 5.1.0's `animate()` removal — arguably a more
prominent, more heavily-documented feature — got none of that rigor: it rode
through on an owner ruling ("5.0 is fine") and a repo-internal "0/32 adoption"
count that is not evidence of zero *external* npm-consumer adoption, which is
what semver protects. This is the load-bearing finding of this lane: **the
close was honest about what it did, but not about what it cost consumers.**

A second, smaller finding: the excision left `src/animation/animate.ts` (213L)
and two full test suites (`test/animate.test.ts` + `test/animate-orchestration.test.ts`,
373L, 19 tests) in the tree, exercising code that is no longer reachable
through any published surface (not in `package.json` `exports`, not in
`AnimationEngine`, not in `docs/published-surface.md`). This is dead code by
the very no-legacy precept the tranche claims to uphold — R.W4 consciously
scoped it as "stays as a HEAVY deep-import chunk," but never revisited whether
keeping the whole file + its dedicated test suites (as opposed to fully
deleting the capability) squares with "no legacy code anywhere."

Everything else audited — the chronic-ledger re-point mechanics, the DM-1/DM-5
contingency-KILL claims, the P-inv-28 register, the ×8 VERIFY-ONLY
re-verification honesty (4 PASS / 4 documented ENV misses) — is accurate
against git evidence.

---

## Findings

### F1 — [HIGH] `animate()` removal is a real breaking change shipped as a Minor, with none of the rigor 5.0.0's comparable cut got

**Evidence.**
- `animate()` was live on the published npm registry at 5.0.0 (`npm view
  @mkbabb/keyframes.js versions` lists `5.0.0` before `5.1.0`).
- Pre-R README (`git show a15cd48:README.md`) features `animate()` as a
  headline API: line 255 `const fade = animate(box, {...})`, lines 259–261 a
  3-way dispatch table, line 411 `animate(element, presets.fadeIn())`.
- Pre-R barrel (`git show a15cd48:src/animation/index.ts:136`) exported
  `AnimateInput`/`AnimateOptions`/`KeyframeMap` types, and `load-engine.ts`'s
  `AnimationEngine` interface carried a runtime `animate` member — i.e.
  `await loadAnimationEngine()).animate` was a real, documented, published
  dynamic-surface function, not an internal implementation detail.
- R.W4 commit `1d4e3d9` ("R.W4 §2.3/§2.4/§2.5/§2.6: excise animate() from the
  published surface") removed the type re-export, the `AnimationEngine`
  interface member, the `loadAnimationEngine()` runtime assignment, the
  `docs/published-surface.md` row, and the README examples, all in one
  commit.
- `CHANGELOG.md:6-15` records this as `## 5.1.0` → `### Minor Changes
  (additive)` (the `/engine` subpath) followed by a separate `### Removals`
  subsection listing `animate()` and the granular `load*` accessors — never a
  `### Major Changes (BREAKING)` heading, unlike the adjacent `## 5.0.0` entry
  one section down which correctly uses `### Major Changes (BREAKING)` for a
  narrower cut (3 aliased names).
- No `docs/MIGRATION-5.1.0.md` exists (`ls docs/MIGRATION*.md` → only
  `MIGRATION-5.0.0.md`).
- `scripts/proof-changelog-5.mjs:3-9,29,42,56-57` is scoped ONLY to the
  `Animation`/`ScrollTimeline`/`ScrollTimelineOptions` alias set (`grep -n
  "animate" scripts/proof-changelog-5.mjs` → zero hits). There is no gate that
  requires a migration doc for the `animate()` removal — the class of gate R.W8
  itself calls "a semver-honesty precept" (`proof-changelog-5.mjs:29`) simply
  does not apply to this cut.
- FINAL.md §1's justification ("0/32 adoption" — R.W4.md:134-138, "the audit
  verified") is a **repo-internal** call-site count (demo + tests within this
  monorepo). It says nothing about downstream npm consumers who may have
  adopted the documented `animate()` front door between whenever 5.0.0 shipped
  and now. Zero-internal-adoption is not evidence of zero-external-adoption;
  conflating the two is the exact failure mode semver review exists to catch.

**Failure scenario.** Any consumer who wrote `import { animate } from
"@mkbabb/keyframes.js"` (a type-level or dynamic-surface reference) or
`(await loadAnimationEngine()).animate(...)` against 5.0.0 — following the
then-current README verbatim — runs `npm install @mkbabb/keyframes.js@^5.1.0`
(a normal caret-range minor bump, which most consumers auto-accept) and their
build breaks with no compiler signal beyond "property does not exist" / "no
exported member," no CHANGELOG "BREAKING" heading to have flagged it in a
release-notes scan, and no migration doc to consult.

**Proposal.** For Tranche S: either (a) retroactively publish a
`docs/MIGRATION-5.1.0.md` and treat this as an acknowledged semver mistake in
the S ledger (owner already ratified "no 6.0.0," so this is a retrospective
honesty fix, not a re-cut), or (b) extend `proof:changelog-5`'s breaking-set
definition (or author a sibling gate) to catch *any* removal from
`docs/published-surface.md` — not just the hardcoded alias trio — so a future
"Minor" cut that deletes a published member gates RED until a migration doc
exists. Option (b) closes the actual structural gap: today the gate is a
one-off list, not a general "removed-from-published-surface ⇒ requires
migration doc" invariant.

---

### F2 — [MEDIUM] `animate.ts` + its two test suites survive as dead code after "excision," against the tranche's own no-legacy precept

**Evidence.**
- `src/animation/animate.ts` (213L) still exists, still exports `animate()`,
  is imported nowhere in `src/` (`grep -rn "from [\"'].*\/animate[\"']" src
  demo bench test scripts` → only hits are the two test files below).
- `test/animate.test.ts` (259L, 15 tests) and
  `test/animate-orchestration.test.ts` (114L, 4 tests) import `animate`
  directly from `../src/animation/animate` (bypassing the package boundary
  entirely) and are live in the suite (`npx vitest list` confirms all 19
  cases enumerate and presumably run as part of the 956-test count).
- `src/animation/CLAUDE.md:47,174-179` still documents `animate(target, input,
  opts?)` as one of "the heavy front doors" alongside `MotionPath`/`DrawSVG`
  with no note that it is unpublished — a reader of the zone doc would believe
  it is still a supported HEAVY export.
- R.W4.md:134-138 explicitly scoped this as intentional ("the file stays…
  only the public advertisement is gone") — this was a conscious choice, not
  an oversight, but it was never revisited against the "no legacy code
  anywhere" mission line for Tranche S.

**Failure scenario.** Not a runtime bug — a maintainability/cohesion one: 19
tests and 213 source lines are carried forward, counted in every
`npm test` run, touched by every refactor that moves `CSSKeyframesAnimation`
(as literally happened post-close: commit `6f2493d` "R-fallout" had to patch
`bench/interp-buffer.bench.ts` because it *also* still touched
`CSSKeyframesAnimation` via the animate-adjacent surface), for a capability
zero consumers can reach through the package's `exports` map. A future
contributor reading `src/animation/CLAUDE.md` would reasonably assume
`animate()` is still an "in."

**Proposal.** Tranche S: either fully delete `animate.ts` + its two test
files (the true "no legacy" terminal — if the capability is genuinely
dead-by-disuse, delete it, don't quarantine it), or if the dispatch logic is
worth keeping as *internal* plumbing for a future re-surface, fold its logic
into an internal helper under `internal/` with a single merged test file and
strip the "front door" framing from `CLAUDE.md`.

---

### F3 — [INFO] Mechanical close claims verified accurate

Independently re-run (read-only, no repo mutation), all confirmed against the
current `tranche-s-dev` tree (which carries R's commits):

- `node scripts/proof-chronic-closure.mjs` → **exit 0**, parses
  `docs/tranches/R/PROGRESS.md`, 15 rows, success line reads "the R ledger is
  TERMINAL" (not "Q ledger") — `scripts/proof-chronic-closure.mjs:117`
  (`CHRONIC_LEDGER`) and `:493` (`LEDGER_LABEL`) both correctly re-pointed to
  `R/PROGRESS.md`, matching FINAL.md §3's citation.
- `f01fa9a` ("R.W8: chronic-closure re-point Q→R + terminal R ledger") and
  `23a6867` ("chore(R.W0): remove keyframes-vue completely") both exist in
  `git log` exactly as FINAL.md cites them.
- `node scripts/proof-workaround-deletion.mjs` → **5/5 GREEN**, including S1
  (aria-orientation) and S2 (dock pointerHandled), matching FINAL.md §2's
  DM-1/DM-5 contingency-KILL claims. `grep -rln "pointerHandled\|onPlayPointerDown"
  demo/ src/` → zero hits (fully excised, not just from the one cited file).
  `demo/@/components/custom/KfPillTabs.vue` exists and is the cited
  kf-internal ARIA replacement.
- `node scripts/proof-decomposition.mjs`, `node scripts/proof-lint-clean.mjs`,
  `node scripts/proof-ci-coverage.mjs` → all **exit 0** today, consistent with
  FINAL.md's "Close state (gate roster)" table.
- `npx vitest list | wc -l` → 956 (FINAL.md claims 954; the 2-test drift is
  from post-close commits `1f7d323`/`6f2493d`'s bench-fallout fixes touching
  test-adjacent files — immaterial, not a red flag).
- The ×8 VERIFY-ONLY re-verification table in FINAL.md §5 (4 clean PASS: DM-9,
  DM-10, DM-11a, DM-15; 4 documented ENV misses: DM-11b, DM-12, DM-13, DM-8)
  is presented honestly as environment-class, not silently glossed as
  all-green — this claim is not independently re-run here (would require a
  full `gh-pages` build + browser harness, out of scope for a read-only audit
  lane) but the FINAL.md framing itself does not overclaim.

No issue found in the close mechanics themselves.

---

## Tranche-S implications

1. **Retroactively author `docs/MIGRATION-5.1.0.md`** documenting the
   `animate()` removal as a breaking-in-practice cut, even though the version
   number cannot be un-shipped. Record in the S ledger as an acknowledged
   semver-honesty gap from R, not silently absorbed.
2. **Generalize `proof:changelog-5`** (or add a sibling gate) so it fires on
   ANY removal from `docs/published-surface.md` between adjacent released
   versions, not just the hardcoded 5.0.0 alias trio — this is the structural
   fix that would have caught F1 at R.W4 time instead of at audit time.
3. **Delete `src/animation/animate.ts` + `test/animate.test.ts` +
   `test/animate-orchestration.test.ts` in totality**, or formally fold the
   dispatch logic into an internal/ leaf with framing that matches its
   internal-only status — do not carry "excised but present" files across
   another tranche close under the "no legacy code anywhere" mission line.
4. **Refresh `src/animation/CLAUDE.md:47,174-179`** to either drop the
   `animate()` front-door section entirely (if F2 lands as full deletion) or
   explicitly annotate it "internal-only, not published" if kept.
5. When Tranche S does its own version cut, **do not repeat the pattern**:
   any surface removal — however low internal-adoption — gets the same
   migration-doc + gate rigor as an alias rename, or an explicit,
   gated "MINOR removal" exception is formally defined project-wide (today
   there is none; R invented the exception ad hoc via owner ruling with no
   codified rule for future tranches to follow consistently).
