# a01-w0-charter-keystone — R.W0 audit (charter + keystone)

## Executive summary

R.W0's two headline claims both hold up under live re-verification: the
`LIBRARY_CEILING_OVERRIDE` self-raising allowlist genuinely was deleted
(`12603af`, `scripts/proof-decomposition.mjs`), the ceiling genuinely was
lowered to a single hard 500L/.ts · 350L/.vue cap, and the resulting reds
genuinely functioned as the R.W1/R.W2 decomposition backlog — running
`node scripts/proof-decomposition.mjs` today exits 0 with real multi-file
splits behind it (`engine.ts` 1420L → 12 files, largest 499L;
`group.ts` 924L → 8 files, largest 496L; `resolve-values.ts` 797L →
`resolve/index.ts` 289L + 3 siblings). The one surviving override
(`presets/classic.ts`, data-volume) is honestly scoped: the file is 34
CSS-string preset factories, not an algorithm — a legitimate exception, not
a reopened escape hatch. `keyframes-vue` is KILLED in totality: no source
tree, no package.json/workspace reference, no live CI/gate reference; every
grep hit outside historical tranche docs is either a changelog line
correctly describing the past removal or a code comment noting the excision.
The chronic-closure ledger substrate was correctly re-pointed Q→R
(`scripts/proof-chronic-closure.mjs:119`) and the dangling
`proof:keyframes-vue-published` reference that R.W0 itself introduced (by
killing the gate the Q-era ledger still named) was discharged at R.W8, not
silently dropped. The charter's own scope claim ("no library/demo source is
refactored here") is honest — R.W0's only source-touching motions are gate
config (`proof-decomposition.mjs`) and root-file restores, both explicitly
named as the keystone precondition, not IMPL.

The one real finding is soft: two of the carved files (`engine/animation.ts`
499L, `engine/playback.ts` 498L; `group/group.ts` 496L) sit suspiciously
close under the 500L ceiling, consistent with "split until the gate goes
green" rather than "split at the natural cohesion seam, wherever that
lands." This is not disqualifying — the splits are semantically real
(interpolate/composition/options/css-metadata/element-resolve are genuine
separate concerns) — but it is a pattern Tranche S should watch for: a gate
tuned to a specific numeric ceiling invites files parked just under it.

## Findings

### 1. [INFO] Keystone deletion is real and verifiable, not narrated

**Evidence:** `git show 12603af -- scripts/proof-decomposition.mjs` shows a
323-line diff (48 insertions / 275 deletions) that removes the entire
9-entry `LIBRARY_CEILING_OVERRIDE` Map (each entry `cap` set +1..+71 above
its file's then-current size) and the stale-entry guard that policed it,
replacing both with `LIBRARY_CEILING = { ".vue": 350, ".ts": 500 }` plus one
2-line `presets/classic.ts` override. The commit message states the plant
test outcome explicitly and matches the wave doc's pre-registered assertion
(`docs/tranches/R/waves/R.W0.md:172-199`). Live re-run today
(`node scripts/proof-decomposition.mjs`) exits 0, and `find src/animation
-name "*.ts" -o -name "*.vue" | xargs wc -l | sort -rn` shows the largest
files are 728L (`presets/classic.ts`, the documented exception) and 499L
(the next-largest, under the hard ceiling) — no undocumented file exceeds
500L.

**Verdict:** matches spec. The keystone is not cosmetic; it is a genuinely
bitten-then-discharged gate, and the discharge (R.W1/R.W2, commits
`40834d2`..`8e2fde1` etc.) produced real multi-concern splits, not
line-shaving stubs — e.g. `engine/interpolate.ts` (307L),
`engine/composition.ts` (221L), `engine/element-resolve.ts` (162L) are each
independently coherent modules, not padding.

### 2. [LOW] Two carved files sit suspiciously tight under the 500L ceiling

**Evidence:** `src/animation/engine/animation.ts` = 499L,
`src/animation/engine/playback.ts` = 498L, `src/animation/group/group.ts` =
496L (`find src/animation/engine -name "*.ts" | xargs wc -l`). All three are
1L–4L under the hard ceiling. This is consistent with a "split until this
file goes green" discipline rather than "split at the concern seam and stop
regardless of remaining size" — a gate tuned to one exact number is a soft
invitation to park a file just inside the line.

**Failure scenario:** a future edit adds 2 lines to `engine/animation.ts`
(e.g. a new option-setter branch) and immediately reds `proof:decomposition`
even though the change has nothing to do with decomposition — forcing an
unrelated future carve as collateral of the ceiling's tightness, not a
genuine new god-module.

**Proposal:** not a Tranche-R defect (the files' actual content, checked at
finding 1, is genuinely multi-concern) — but Tranche S should budget slack
(e.g. re-measure whether 450L is a more honest steady-state ceiling, or
accept that files landing at 490-499L are a known friction point and are
expected to need a further carve within 1-2 tranches) rather than treat
"green today" as "settled."

### 3. [INFO] keyframes-vue KILL is total — zero live residue

**Evidence:** `grep -ril "keyframes-vue"` across the repo (excluding
`.git`/`node_modules`) hits only: (a) historical tranche docs (`O`, `M`,
`K`, `L`, `P`, `Q`, `J` — all describing the pre-KILL past, expected and
correct as history), (b) `docs/tranches/R/**` — the KILL's own record, (c)
`CHANGELOG.md:69` — one past-tense line describing the historical
externalization, correct usage, (d) `.github/workflows/ci.yml:1710-1711` — a
comment noting the tripwire was *retired*, not a live reference, (e)
`scripts/proof-chronic-closure.mjs:110` — a comment noting the reference was
*excised*. `ls packages/` → does not exist. `grep -n
"keyframes-vue|workspace" package.json` → zero hits. No `npm run
proof:keyframes-vue-published` script key survives. Live
`node scripts/proof-chronic-closure.mjs` exits 0 and its output explicitly
lists `DM-7 keyframes-vue … — KILL` as a terminally-recorded, non-gate-cited
closure — the ledger records the kill rather than silently dropping the row.

**Verdict:** matches the charter's claim in `docs/tranches/R/R.md:16-18`
exactly. No residual reference of any kind — not a doc/config/gate/import —
survives outside historical record and the KILL's own audit trail.

### 4. [INFO] Charter scope claim ("no library/demo source refactored")
    holds precisely, by a narrow but honest reading

**Evidence:** `docs/tranches/R/R.md:5-6` states "No library/demo source is
refactored here. The one IMPL motion already taken under R.W0 is [the
keyframes-vue KILL]." The wave doc (`R.W0.md §5`) further scopes the
keystone edit and root-file restores as source-touching but explicitly
"preconditions for R.W1," not IMPL proper. Checked: the keystone edit
touches only `scripts/proof-decomposition.mjs` (a CI gate script, not
shipped `src/` or `demo/` source) plus 4 root-file restores
(`.dependency-cruiser.cjs`, its known-violations JSON, root `CLAUDE.md`,
`src/animation/CLAUDE.md`) and 2 confirmed deletions (`CONTRIBUTING.md`,
`llms.txt`/`llms-full.txt`). None of these are library or demo runtime
source. The claim is technically precise, not evasive.

**Minor caveat:** the phrase "no library/demo source is refactored" could
mislead a fast reader into thinking R.W0 touched nothing executable —
it touched a CI gate that directly determines pass/fail for every
subsequent wave, which is a meaningfully consequential edit even though it
is not `src/`. The report language is honest but a reader skimming only the
one-line claim would underestimate R.W0's leverage. Not a defect; a
documentation-clarity nit worth tightening in S's report style (name gate
edits as their own category, not folded silently under "no source").

### 5. [INFO] Chronic-ledger re-point discipline followed correctly

**Evidence:** `scripts/proof-chronic-closure.mjs:119` —
`CHRONIC_LEDGER = path.join(REPO, "docs/tranches/R/PROGRESS.md")`,
confirmed live (re-run `node scripts/proof-chronic-closure.mjs` exits 0,
"the R ledger is TERMINAL"). `docs/tranches/R/FINAL.md §3` documents the
Q→R re-point as landing "in ONE atomic commit" and explicitly calls out that
the M.WZ/O.WZ/P.WZ re-points were skipped (leaving the ledger 3-tranche
stale before Q), framing R's single-hop re-point as the corrective
discipline. This is a legitimate, checkable claim — matches the live gate
target.

## Tranche-S implications

1. **The 500L ceiling is working but tight — treat 490-499L modules as
   pre-red, not settled.** Files sitting 1-4L under the cap
   (`engine/animation.ts`, `engine/playback.ts`, `group/group.ts`) should be
   flagged in S's sub-zoning pass (S's own charter already names
   `compile/backward/`, `compile/easing/`, `engine/css/` as candidate
   sub-zones) as first-in-line for further carving before they force an
   unrelated future red.

2. **Keep the single-hard-ceiling discipline; do not reintroduce a
   per-file override allowlist beyond the one data-volume exception.** The
   R.W0 keystone's value was precisely in refusing the self-raising-cap
   pattern. S's deeper sub-zoning should extend the same discipline into the
   new sub-zone boundaries rather than granting fresh per-file exceptions.

3. **No keyframes-vue follow-up needed.** Confirmed zero residue; S can
   treat DM-7 as fully closed and does not need to re-audit it.

4. **Document gate-script edits as a distinct "apparatus" category in wave
   scope statements**, separate from "no source refactored," so that a
   skim-reader doesn't undercount a wave's leverage. Purely a
   documentation-precision suggestion for S's own wave-writing style, not a
   correction to R.
