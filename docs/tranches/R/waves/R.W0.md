# R.W0 — Audit-fold + the keystone gate-truth reset

**Phase:** DEV (done / authored — `tranche-r-dev`)
**Band:** A — apparatus

## 1. Scope

R.W0 is the DEV-phase deliverable: the 32-lane audit corpus on disk, the bound
deferred-ledger fold, the prompt-recap verification (A→Q→R, zero drops), the
root-file disposition table, one owner-directed corrective already shipped
(keyframes-vue KILLED at `23a6867`), and the single keystone pre-condition for
R.W1: **DELETE `LIBRARY_CEILING_OVERRIDE` in `scripts/proof-decomposition.mjs`
and set one hard library ceiling so that `proof:decomposition` reds on every
god-module today — those reds ARE the decomposition backlog.** No library or
demo source is refactored in this wave.

---

## 2. Concrete work

### 2a. keyframes-vue KILL (already executed at `23a6867`)

Commit `23a6867` (2026-06-24) retracted `@mkbabb/keyframes-vue` in totality:

- `packages/keyframes-vue/` deleted (all 12 files, −2,860 lines).
- `scripts/proof-keyframes-vue-published.mjs` deleted (194L) + its
  `package.json` `"proof:keyframes-vue-published"` script key removed.
- `ci.yml`: born-RED tripwire step, aggregator `check-failures` entry, and the
  notice comment removed; `release.yml`: `publish-keyframes-vue` job (44L)
  removed (`audit/retro-deferred-ledger.md §Group 1`).
- `scripts/proof-ci-coverage.mjs`: keyframes-vue entries removed from roster,
  exclusions, and BORNRED set; gate re-greened (177 gates, 8 exclusions,
  born-RED set == `{peer-satisfied}`) (`23a6867` commit msg).
- `README.md`: Ecosystem `keyframes-vue` bullet removed (6L).

Net: **zero residue in this repo** — no `packages/`, no workspace key, no
`keyframes-vue` string in any JSON (`audit/retro-q-changes.md §5`).

The dangling `proof:keyframes-vue-published` reference in `docs/tranches/Q/PROGRESS.md`
(the live `CHRONIC_LEDGER` parse substrate of `scripts/proof-chronic-closure.mjs:117`)
is the reason `proof:chronic-closure` RED today:

```
✗ [[C] DM-7 keyframes-vue] sibling/historical band names
  `proof:keyframes-vue-published` as present but it does NOT resolve —
  a DANGLING reference.
```

This red is the entry tripwire for R; it is discharged at R.W8 (re-point
`CHRONIC_LEDGER` Q→R + re-state DM-7 as an owner-ratified KILL).

### 2b. Root-file dispositions

The R.W0 commit note explicitly left seven files "for the Tranche R audit to
assess." Verdicts from `audit/retro-readme-docs.md` (confirmed against the
tree at `tranche-r-dev`):

| File | Verdict | Disposition |
|---|---|---|
| `.dependency-cruiser.cjs` | load-bearing — CI `npm run lint` target; `proof:lint-clean` invokes it | **RESTORE** |
| `.dependency-cruiser-known-violations.json` | load-bearing — `--ignore-known` baseline for the 15 circular-import violations; without it, lint REDs on known Q-era cycles | **RESTORE** (eliminate entries as R.W1/W2 fix the cycles) |
| `CLAUDE.md` (root) | load-bearing — AI context + README cross-links | **RESTORE** |
| `src/animation/CLAUDE.md` | load-bearing — README §Project-Structure links to it ("the inventory") | **RESTORE** |
| `CONTRIBUTING.md` | junk — thin wrapper over README/CLAUDE.md content, no unique material | **DELETION ENDORSED** (R.W7 trims the README link) |
| `llms.txt`, `llms-full.txt` | generated artifacts — not version-controlled source | **KEEP DELETED** (R.W7 reclassifies as build-output: `.gitignore` entry + CI-generate step) |

Restoring the four load-bearing files and committing the two deletions cleans
the working tree and surfaces the real red backlog without hiding it behind a
missing lint config.

### 2c. The keystone: DELETE `LIBRARY_CEILING_OVERRIDE`, set ONE hard ceiling

**File to edit:** `scripts/proof-decomposition.mjs:128–368`

**The problem** (`audit/retro-q-changes.md §1`, `audit/retro-prompt-recap.md §3`):
`LIBRARY_CEILING_OVERRIDE` is a `Map` of 9 per-file entries, each with a
`cap` set at most +71 lines above the file's current size and a prose `why`
rationale. The base ceiling is 550L (`.ts`), but:

| file | actual L | override `cap` | margin |
|---|---|---|---|
| `engine.ts` | 1420 | 1450 | +30 |
| `group.ts` | 924 | 925 | **+1** |
| `animations.ts` | 886 | 900 | +14 |
| `spring.ts` | 685 | 700 | +15 |
| `waapi.ts` | 579 | 650 | +71 |
| `frame-compiler.ts` | 616 | 640 | +24 |
| `resolve-values.ts` | 796 | 600 | **already OVER** — gate REDs today |
| `load-engine.ts` | 559 | 580 | +21 |
| `sequence.ts` | ~698 | 700 | +2 |

Every cap was set "just above the measured post-split floor" (the literal
phrase used at lines 162, 213, 240, 271, 299, 327, 352 of the script). A gate
whose ceiling tracks the file it measures cannot bite. The `group.ts` entry
self-incriminates at `proof-decomposition.mjs:214–220`:

> "BORN-RED HANDOFF (P-invariant-28): the FULL compositor-seam split …
> **remains the named future work** … Named here so the deferral is citable."

The decomposition was deferred again **inside the gate that certifies it green.**

**The fix (R.W0 keystone, lands before R.W1):**

EXCISE the entire `LIBRARY_CEILING_OVERRIDE` Map (lines 128–368 of
`proof-decomposition.mjs`). Set `LIBRARY_CEILING = { ".vue": 350, ".ts": 500 }`
as the single hard ceiling. (500L is the measured "already-SOTA leaf module"
floor; it passes every module that is genuinely decomposed. 550L was the
prior base — 500L is tighter and better-grounded: `spring-duration.ts` is
83L, `group-soa.ts` is 254L, `waapi-densify.ts` is 287L — all well under
500L. The `animations.ts` god-list is a data table, not an algorithm; it
warrants a `data/` move in R.W1 not an override. The four files that are
genuinely cohesive at over 500L (`resolve-values.ts` at 796L with its shared
Phase-1/Phase-2 recursion pinned by `proof:emerging-css-resolve-p2`, and
`frame-compiler.ts` at 616L with gate-pinned exports) get a NARROW, explicitly
gate-justified override only — not a blanket self-raising prose essay. The
working ceiling for this wave is **500L** for `.ts`.)

After the EXCISE, `proof:decomposition` will RED on every file over 500L:
`engine.ts` (1420), `group.ts` (924), `animations.ts` (886), `spring.ts`
(685), `frame-compiler.ts` (616), `resolve-values.ts` (796), `load-engine.ts`
(559), `sequence.ts` (~698), `waapi.ts` (579). **Those reds ARE the R.W1/W2
decomposition backlog**, measured by the gate, not by prose.

The stale-entry guard (lines 472–490 of the script, which reds if a named
override file drops back under the base ceiling) is also removed along with
the override Map it guards.

**REJECT** the proposed budget/diff meta-gate-governance machinery
(`audit/challenge-retro.md §secondary`). The keystone is the simplest
possible gate fix: delete the override, lower the ceiling, let it bite.

### 2d. The 32-lane audit corpus

`docs/tranches/R/audit/` holds 32 evidence files authored by the R.W0
agent workflow (3-wide batches; Sonnet fanout, Opus for legacy-sweep,
retrospective, gestalt, and adversarial-challenge lanes):

```
challenge-demo.md       lib-animations.md       retro-api-in.md
challenge-library.md    lib-boundary.md         retro-deferred-ledger.md
challenge-retro.md      lib-compile.md          retro-plan-waves.md
demo-anim-controls.md   lib-engine.md           retro-prompt-recap.md
demo-app-scenes.md      lib-group.md            retro-q-changes.md
demo-brittleness.md     lib-legacy-sweep.md     retro-readme-docs.md
demo-composables-state  lib-light.md
demo-legacy-sweep.md    lib-resolve.md
demo-scene-switcher.md  lib-scroll-ingest.md
demo-styling.md         lib-sequence.md
demo-targets.md         lib-spring.md
gestalt-demo.md         lib-support.md
gestalt-library.md      lib-waapi.md
```

Every load-bearing claim was re-checked against the live tree (`wc -l`, `grep`,
running the gates). Two claims reproduce when the gates are run:

1. `proof:chronic-closure` exits 1 — dangling `proof:keyframes-vue-published`
   reference in `docs/tranches/Q/PROGRESS.md` (`scripts/proof-chronic-closure.mjs:117`
   sets `CHRONIC_LEDGER` to that file).
2. `proof:decomposition` exits 1 — `resolve-values.ts` 797L > 600L cap
   (`audit/retro-q-changes.md §1`; confirmed live above).

The audit is the R.W0 deliverable and the evidence substrate for R.W1–R.W8.

---

## 3. The falsifiable born-RED gate

**Gate name:** `proof:decomposition`

**Existing gate, assertion change.** The gate (`scripts/proof-decomposition.mjs`)
currently exits 1 on `resolve-values.ts` (797L > 600L cap) but exits 0 on
`engine.ts` / `group.ts` / `animations.ts` / `spring.ts` / `frame-compiler.ts`
/ `load-engine.ts` / `sequence.ts` / `waapi.ts` because each has a
`LIBRARY_CEILING_OVERRIDE` entry raising its cap above its current size.

**Assertion change (the keystone):** DELETE `LIBRARY_CEILING_OVERRIDE` (lines
128–368), lower `LIBRARY_CEILING[".ts"]` to `500`. The gate must exit 1 on
every file currently over 500L — the full list above. That exit-1 set IS the
decomposition backlog R.W1/R.W2 discharges.

**Non-vacuous plant test (the RED-state proof):**

Before the override is deleted, run:
```
node scripts/proof-decomposition.mjs
```
With the override present the gate exits 0 on engine.ts/group.ts (ceiling
waived to 1450/925). After deleting `LIBRARY_CEILING_OVERRIDE` and setting
`LIBRARY_CEILING[".ts"] = 500`:

```
✗ [ceiling] src/animation/engine.ts: 1420L exceeds the 500L library ceiling
✗ [ceiling] src/animation/group.ts: 924L exceeds the 500L library ceiling
✗ [ceiling] src/animation/animations.ts: 886L exceeds the 500L library ceiling
… (all files over 500L)
proof:decomposition — FAIL
```

That set of reds — not produceable while the override exists — proves the gate
bites. A wave with no override deletion that still claims "decomposition close"
would re-enter the false-green state the twelve-tranche DF-11 lineage ended in.

**gate name (kebab):** `proof:decomposition` (existing gate, assertion change —
override deletion + ceiling lowered to 500L).

---

## 4. Challenge-tempered cautions

From `R.md §2` (the challenge-retro overrides), the ones load-bearing for R.W0:

- **REJECT the budget/diff meta-gate** (`challenge-retro.md §secondary`). The
  keystone is the simple fix: delete the override Map, set one hard ceiling.
  No governance machinery, no "approved-split diff" oracle, no per-PR budget
  framework. Per R.md §2: "the decomposition keystone is the SIMPLE fix, not a
  meta-gate."

- **The 3 gate co-edits with re-RED tests are R.W1's responsibility, not
  R.W0's.** The three gates hardcoded to `engine.ts` by literal path
  (`proof-boundary.mjs:84`, `proof-boundary.mjs:237`, `proof-engine.mjs:33,79`)
  break when `engine.ts` moves into an `engine/` directory. Per R.md §2:
  "three gates … are first-class R.W1 steps, each with a re-RED test." R.W0
  does not touch those gates; it only removes the override allowlist.

- **The override for `resolve-values.ts` is already causing a live RED.** The
  gate currently reports `resolve-values.ts 797L > 600L cap`. The 600L cap
  was set when the file was claimed to be 578L (`audit/retro-q-changes.md §1`
  notes: "the gate is now RED on this file … the cap/file relationship the
  gate advertises is already drifted"). Deleting the whole override Map
  addresses this correctly; adding a new narrower override for `resolve-values.ts`
  alone would be partial and inconsistent.

- **`presets/classic.ts` data-volume case** (`R.md §7`). If `animations.ts`
  (886L) reds after the override is deleted, it warrants a data-to-directory
  move (into `presets/`), not a new override entry. The data-volume exception
  the charter names is a documented move, not another self-raising cap.

- **`useSceneSwap` STAYS, subgrid STAYS** — not applicable to R.W0 (no demo
  source touched), confirmed.

---

## 5. Verification + DEV/IMPL boundary

**Verification of the R.W0 deliverable:**

1. The 32-lane audit on disk (`docs/tranches/R/audit/`) — re-runnable: every
   cited RED reproduces when the gates are run (confirmed above: both
   `proof:chronic-closure` and `proof:decomposition` exit 1 on `tranche-r-dev`).

2. The deferred-ledger (`PROGRESS.md §"Open deferrals"`) carries a real
   disposition per item — 10 binding fold items, zero un-dispositioned punts
   (`audit/retro-deferred-ledger.md §Disposition summary`).

3. The prompt-recap (`audit/retro-prompt-recap.md`) confirms full A→R coverage:
   ~40 distinct requests, 35 ADDRESSED, 4 PARTIAL→FOLD-TO-R, 1 REVERSED (Q→R),
   **zero DROPPED**. The "decomposition close" is the one ask the chain marks
   ADDRESSED that the tree falsifies.

4. This wave spec carries the falsifiable `proof:decomposition` assertion change
   with a non-vacuous plant test.

**DEV/IMPL boundary.** This spec is authored now. The keystone edit
(DELETE `LIBRARY_CEILING_OVERRIDE`, lower ceiling to 500L) and the root-file
restores are the only source-touching motions in R.W0 — they are preconditions
for R.W1 (which cannot move `engine.ts` into a directory before the gate knows
to look there). The seven-zone directory partition (R.W1), the god-class carves
(R.W2), and all subsequent waves open only on explicit authorization, exactly
as D/E/O/P/Q's dev→impl boundary.
