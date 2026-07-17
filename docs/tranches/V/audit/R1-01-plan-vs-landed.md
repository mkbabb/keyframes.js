# Lane R1-01 — PLAN-VS-LANDED DIFF

**Finding-ID prefix:** PL-
**Scope:** Verify every verifiable Tranche-U close claim (FINAL-U.md, U.md, waves, OWNER-DECISIONS) against the current tree; distinguish false-at-close from true-at-close-but-moved-by-the-current-transaction.
**Close commit of record:** `c80ad0bf` (tag `v5.3.4`, PR #11). **Working-tree HEAD:** `a59d3a22` ("consume Glass UI 6") carrying a large uncommitted Glass-7/value-4 transaction.

## Verdict

The Tranche-U close packet is, to the depth this lane checked, **honest**. Every headline quantitative and structural claim in `FINAL-U.md` verifies TRUE at the close commit `c80ad0bf`: 2 `proof:*` keys, 18 package scripts, 392-line `vite.config.ts`, 0 flat `scripts/proof-*.mjs`, **exactly 182** flat proofs deleted in the terminal cut (commit `70b32501`), 14 blessed goldens on disk (BLESSED.json entries + 14 golden PNGs incl. sequence light/dark), exactly six observe scripts under `scripts/observe/demo/`, a 102-line CI workflow and 55-line release workflow, no `demo/@`, no `components/custom`, a present and non-vacuous `test/orchestration/sequence-transport.test.ts`, and Monaco dynamic-import loading with the ts/html/json workers gone. No green-over-broken, no declared-capture-missing, no alias smuggling surfaced in this lane.

Two P3 deltas only: (PL-1) the one number that does NOT cleanly reproduce — `scripts/` "10,776 across 77 files" — where the **77-file** figure is a `find`-based count inflated by 44 gitignored visual-lock diff PNGs plus a `.DS_Store`, while the tracked apparatus is 32 files; and (PL-2) a set of close numbers the current in-flight transaction has already moved (18→19 scripts, 392→388 vite lines, version→6.0.0, glass-ui optionalDependency removed, value.js 3.1.0→4.0.0) — all category-(b) deliberate-transaction, not close regressions, recorded so a later reader does not misread the mid-transaction working tree as a broken close.

---

## PL-1 — "scripts/ = 10,776 text lines across 77 files" conflates 44 gitignored binary diff artifacts into the file count

**Severity:** P3
**Mechanism family:** misleading-measurement / doc-accuracy

`FINAL-U.md:43` claims: `` `scripts/` text lines | 66,706 before the terminal cut | **10,776 across 77 files** ``.

Measured at the close commit `c80ad0bf`:
- Tracked files under `scripts/`: **32** (`git ls-tree -r --name-only c80ad0bf -- scripts | wc -l` → 32; breakdown 25 `.mjs` + 6 `.ts` + 1 `.sh`, **zero** binary/png).
- Total text lines across those 32 tracked files: **10,846** (`.mjs`+`.ts`+`.sh`), vs claimed 10,776 (off by 70 — method noise, within tolerance).

The "77 files" figure is reproduced only by `find scripts -type f | wc -l` on a working tree that has *run the visual gate*: 32 tracked text files + **44 gitignored** diff PNGs at `scripts/baselines/visual-lock/_diff/` (`git check-ignore` → IGNORED; these are output artifacts of `scripts/gates/visual/index.mjs` = `proof:owner-golden`) + 1 `.DS_Store` = 77. So the packet's "text lines across N files" pairs a text-only line count (10,776) with a file count (77) that is dominated by binary, gitignored, non-apparatus artifacts. The honest committed apparatus is **10,846 text lines across 32 files** — a *better* number for the dissolution story than the one shipped.

**Disposition (fold):** V.docs micro-wave — correct the FINAL-U row to "10,846 text lines across 32 tracked files" (or re-measure with `git ls-files`), and add `.DS_Store` / stray-baseline hygiene to the observe-run cleanup so `find`-based counts stop drifting. No code impact.

---

## PL-2 — Current transaction has already moved several close-packet numbers (category-(b), not a close defect)

**Severity:** P3 (informational — recorded to prevent a future false-regression finding)
**Mechanism family:** mid-transaction-drift

The working tree carries the deliberate Glass-7/value-4 transaction. Verified deltas vs the close commit `c80ad0bf`, all category-(b) true-at-close-but-changed-by-transaction:

| Close claim (`c80ad0bf`) | Working tree (`a59d3a22` + uncommitted) | Cause |
|---|---|---|
| 18 package scripts | **19** | `test:lib` added (`git diff HEAD -- package.json`) |
| `vite.config.ts` 392 lines | **388** | transaction trimmed 4 lines |
| version `5.3.4` (pkg says `5.3.5` at HEAD) | **6.0.0** in working `package.json` | Glass-6/value-4 major bump |
| `optionalDependencies.@mkbabb/glass-ui 6.0.0` | **removed** | transaction |
| `@mkbabb/value.js ^3.1.0` | **4.0.0** | transaction |

Evidence: `git diff HEAD -- package.json` shows exactly these edits. None of these contradict the U close — they are the open Glass-7 transaction the audit was told exists. `proof:* = 2` still holds in the working tree; flat `scripts/proof-*.mjs` still 0; no `demo/@` or `components/custom` reintroduced. **No structural close claim regressed by the transaction.**

**Disposition (retire):** no action; noted so a sibling audit lane reading the working tree does not book "18 scripts claim is false — tree has 19" as a real finding.

---

## Negatives — claims checked and found SOUND (at close `c80ad0bf`)

All verified with commands against the close commit and/or working tree:

1. **`proof:*` package keys = 2** — TRUE. `proof:publish`, `proof:owner-golden` only, both at close and in the working tree. (`node -e` over `package.json`.)
2. **Package scripts, all kinds = 18** — TRUE at close (`git show c80ad0bf:package.json` → 18; now 19 via `test:lib`, PL-2).
3. **`vite.config.ts` = 392 lines** — TRUE at close (`git show c80ad0bf:vite.config.ts | wc -l` → 392; now 388, PL-2).
4. **182 flat proofs deleted in the terminal cut** — TRUE, EXACT. `git show --name-status 70b32501` ("dissolve the proof apparatus around direct product checks") deletes **exactly 182** `scripts/proof-*.mjs` (203 total deletions in that commit).
5. **Flat root `scripts/proof-*.mjs` = 0** — TRUE at close and now (`git ls-tree` / glob → 0).
6. **14 blessed goldens on disk at `docs/tranches/T/goldens/`** — TRUE. `BLESSED.json` `entries` object has **14** keys (amiga/cube/easing/home/sequence/spring/square × light/dark); `golden/` holds **14** PNGs including `sequence-{light,dark}.png`; blessed by `mkbabb`, commit `b6fab863`.
7. **Six observe scripts under `scripts/observe/demo/`** — TRUE, exactly 6: `smoke.mjs`, `occlusion.mjs`, `usability.mjs`, `subject-animates.mjs`, `live-session.mjs`, `live-session-mobile.mjs` — 1:1 with the six named observations (smoke, occlusion, usability, subject animation, live session, mobile live session).
8. **102-line CI / 55-line release workflow** — TRUE at close and now (`wc -l .github/workflows/ci.yml` → 102; `release.yml` → 55; identical to `git show c80ad0bf:` versions).
9. **No `demo/@`** — TRUE (absent). **No `components/custom`** — TRUE (absent; `find demo -type d -name custom` empty).
10. **Sequence transport behavior lives in `test/orchestration/sequence-transport.test.ts`** — TRUE and NON-VACUOUS: file present (19,468 bytes), **20** `it/test` blocks, **44** `expect(` assertions, asserts forward/reverse `_frame` pixel-identical to `seek` at dense master clocks *including* every segment boundary (0/1000/2000/3000). Not a shape stub.
11. **Monaco interaction-loaded; unused workers removed** — TRUE. `demo/components/instrument/keyframes/CSSCodeEditor.vue:54-58` uses dynamic `import()` for `editor.api` + `editor.worker` + **only** `css.worker`; the umbrella barrel (`instrument/index.ts:15`) documents no eager Monaco/highlight chunk; ts/html/json language workers are not imported (consistent with the U.D "8MB dead workers → 0" charter).
12. **Two retained commands wired to real gates** — `proof:publish` → `scripts/gates/surface/index.mjs`, `proof:owner-golden` → `scripts/gates/visual/index.mjs` (born-OWNER; RED without `BLESSED.json`). The surviving `scripts/gates/visual/` is NOT orphaned residual apparatus — it IS `proof:owner-golden`. The `_diff` PNGs are its gitignored output.

## Coverage gaps

- **Did not execute** `npm run check` / `npm test -- --run` / `proof:publish` / `proof:owner-golden` on the working tree. The tree is mid-transaction (value.js 4.0.0 / glass-ui 6.0.0, `node_modules` in flux); a run here would test the *transaction*, not the U close, and could report red for transaction reasons. Deferred to the transaction-verification lane. The close packet's own verification record (`FINAL-U.md:127-144`) claims these passed at `c80ad0bf`; this lane did not independently re-run them at that commit.
- **Historical inputs unverified**: "227 at U authoring / 204 at terminal audit", "66,706 lines before the cut", "193 flat proofs at terminal audit" — these reference pre-close/authoring states outside the committed history reachable here; only the terminal figures (2 keys, 0 flat proofs, 182 deleted, current line/file counts) were verifiable and verified.
- **`ls-tree` non-recursive anomaly**: `git ls-tree --name-only 70b32501^ -- scripts` reported 0 flat proofs while `git show --name-status 70b32501` shows 182 deletions from that same parent — a tooling artifact (non-`-r` listing), not a discrepancy in the 182 count, which is confirmed directly by the commit's own name-status diff.
- **Sibling-repo claims** (Glass 5.0.0 `9a8761f0` integrity, value.js 3.1.0 subpaths, npm tarball integrity/provenance for 5.3.4) not verified — out of this lane's read-only keyframes.js scope and owned by the constellation/release lanes.
