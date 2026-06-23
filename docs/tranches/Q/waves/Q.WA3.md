# Q.WA3 — CI-green + master-merge reconcile + the deploy round-trip oracle + the device-dependence CI-harden

**Band:** A — Apparatus.
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence (the DAG edge):** `Q.W0 (record-hygiene — records the master-divergence obligation) ─►
Q.WA3` (this wave — make ci.yml genuinely green, merge the 4.4.0 tip to master, mechanize the deploy
round-trip oracle, harden the device-dependence wall) `─► [the FIRST motion of the Q.md §3 DAG — every
cross-repo publish chain + the 5.0.0 cut sit downstream of the master-merge reconcile]`. Per `Q.md §3`:
"Q.WA3 master-merge-reconcile (NOW, all 3 repos to master — the FIRST motion)."
**Owning-DM-or-idea:** the **B1-deploy-ci** lane's four-wave roster folded into one apparatus wave —
Q.W-CI-GREEN (the 6-gate ci.yml wiring + the merge-unblock) + Q.W-ROUNDTRIP-ORACLE (the pages-deploy.sh
post-deploy validation) + Q.W-CI-HARDEN (the F-7 static-gate migration + the serial-chain cure) — plus
the **B6-crossrepo-versions** Q.W-MERGE-RECONCILE (the three published tranche tips → master).

This wave is the **CI floor**, not a strategy change: it cures the two compounding reds, lands the
merge-of-record, mechanizes the verified-deploy oracle, and harms the device-dependence wall — so the
verified-deploy-of-record can fire and every downstream Q wave runs on genuinely-green CI. It ships
ZERO engine/demo source (it edits ci.yml + pages-deploy.sh + the gate scripts + package.json only).

---

## §Context — two compounding reds + a dead deploy-of-record (the blockers)

CI is RED on the impl-drive tree and the verified-deploy-of-record is structurally dead — both must be
cured in Q before anything else ships (`AUDIT-31.md` B1-deploy-ci, the lane VERDICT). The breaches,
each verified live:

1. **`proof:ci-coverage` exits 1 — six impl-drive gates are in `package.json` but never wired into
   ci.yml as steps.** The 6 gate DEFINITIONS are at package.json:193-198; they ARE invoked in the local
   aggregate chains — **4 in `proof:hygiene`** (line 200: `proof:no-foreign-symbol-stamp`,
   `proof:soa-composite`, `proof:morphsvg-consume`, `proof:portable-perf`) + **2 in `proof:correctness`**
   (line 199: `proof:emerging-css-resolve-now`, `proof:spring-heatmap`) — but the `proof:ci-coverage`
   discipline requires each to be a CI **step** in ci.yml too, and NONE of the 6 appears in ci.yml
   (confirmed: `grep` of the 6 over ci.yml → 0). The fast library `gates` job's coverage check fails
   (`node scripts/proof-ci-coverage.mjs` → exit 1, confirmed live; B1-deploy-ci BLOCKER). *(The exact
   unwired set the gate names: `proof:emerging-css-resolve-now, proof:morphsvg-consume,
   proof:no-foreign-symbol-stamp, proof:portable-perf, proof:soa-composite, proof:spring-heatmap`.)*
2. **demo-smoke can structurally NEVER be green** — the terminal check-failures aggregator (ci.yml
   `if: always()`) ADDS the three born-RED-BY-DESIGN tripwires to the `failed` set and exits 1
   (`AUDIT-31.md` B1-deploy-ci BLOCKER). So `deploy-pages.yml` (which gates on a green demo-smoke) can
   never fire — the verified-deploy-of-record is dead.
3. **The 4.4.0 tip is NOT merged to master** — `git rev-list --left-right --count master...tranche-p-dev`
   = 0/21 (re-confirmed live on the Q-dev tip; was 0/18 at the audit snapshot, +3 Q-doc commits since);
   the v4.4.0 release commit is **`c69bbb0`** (tag `v4.4.0`), and the drive tip is **`df78088`** (the
   final run-board doc commit, 3 commits AFTER c69bbb0) — **both are contained ONLY in `tranche-p-dev`,
   NEITHER is an ancestor of master** (`git merge-base --is-ancestor c69bbb0 master` = NO; same for
   df78088). master's tip is the M-era `aef3ef3` (B1-deploy-ci BLOCKER; B6-crossrepo-versions REGRESSION).
   All three siblings published from non-master branches (kf tranche-p-dev, value.js tranche-p, parse-that
   tranche-b). The deploy-of-record (CF Pages, branch `master`) is NOT live-correct until the merge lands.
   *(Anchor note: the audit's `tranche-p-dev(df78088, v4.4.0)` phrasing conflates the drive tip with the
   release commit — `df78088` is NOT the tagged commit; `v4.4.0` = `c69bbb0`. The merge action brings in
   BOTH; the version-ancestry assertion keys on the tagged `c69bbb0` — see S2.)*
4. **The deploy round-trip oracle is NOT mechanized** — `scripts/pages-deploy.sh` captures a rollback
   target (lines 65–78, confirmed) and its header references "post-deploy validation fails" (line 20,
   confirmed) but performs NO post-deploy validation — after `wrangler pages deploy` there is no HTTP-200
   probe + no bundle-hash assertion. The 2026-06-23 deploy BYPASSED the green-CI deploy-pages.yml gate
   (shipped via `bash scripts/pages-deploy.sh` from the host shell, B1-deploy-ci).
5. **The device-dependence wall + the serial-chain wound** — 15 device-INDEPENDENT static gates ride
   the slow 50m demo-smoke browser job instead of the fast 10m library `gates` job (the F-7 migration,
   B1-deploy-ci); `proof:hygiene` is a single 132-link `&& npm run proof:*` serial chain that aborts on
   first red (confirmed — package.json:200, the report-all cure the device-dependence-greening memory
   mandates was never applied to the local hygiene tier).

**Strengths Q.WA3 preserves (NOT re-certified):** the library boundary is healthy (`proof:boundary`
PASSES — 0 value.js static edges, 0 parse-that specifiers, the S9 acyclic-spine real); release.yml's
publish ordering is sound (value.js→kf→keyframes-vue). Q.WA3 does not touch these — it cures the CI reds
+ lands the merge + mechanizes the oracle + harms the device wall.

**Why this is a wave, not four.** The four B1-deploy-ci sub-waves share ONE blast radius (ci.yml +
pages-deploy.sh + the gate scripts) and ONE goal — a genuinely-green CI that can deploy. Splitting them
risks the device-dependence "one-red-per-round" loop the memory forbids; Q.WA3 breaks the loop in ONE
pass (the device-dependence-greening law: "break the one-red-per-round loop in ONE pass").

---

## §Scope — the S-clauses

### S1 — wire the 6 unwired impl-drive gates into ci.yml + the terminal-aggregate fix (CI-GREEN)

**Breach.** `proof:ci-coverage` exits 1 (6 gates unwired into ci.yml steps); demo-smoke's terminal
aggregator includes the 3 born-RED-by-design tripwires in its exit-1 set.

**Cure.** (1) Wire the 6 gates into ci.yml as steps, split by their ACTUAL shape (verified from the
package.json gate definitions, not assumed): the **4 pure-node static** gates →the fast `gates` job
(`proof:no-foreign-symbol-stamp`, `proof:soa-composite`, `proof:portable-perf`, `proof:spring-heatmap` —
none invokes vitest), and the **2 vitest-bearing** gates →the correctness job
(`proof:emerging-css-resolve-now` = `… && vitest run test/emerging-css-resolve-now.test.ts`;
`proof:morphsvg-consume` = `… && vitest run test/morph-svg.test.ts` — both run a vitest, so they belong in
the correctness/test job, NOT the static `gates` job). *(Anchor correction: the audit/charter's "5
static + 1 correctness" split mis-placed `proof:morphsvg-consume` as static — it runs a vitest; the
correct split is 4 static + 2 vitest.)* (2) EXCLUDE the 3 born-RED-by-design tripwires
(`proof:peer-satisfied`, `proof:keyframes-vue-published`, `proof:control-point-live` — confirmed at
ci.yml:1594-1596) from the terminal check-failures aggregator's exit-1 set (they are EXPECTED-RED
observe-only gates — reported, not blocking; the `declarePosture` observe-only discipline). *(Note: if
Q.WA2 lands first, `proof:control-point-live` is DELETED, not excluded — Q.WA3 excludes whichever of the
3 remain.)* (3) Extend `proof:ci-coverage` with a clause `terminal-aggregate-excludes-bornred`: parse
ci.yml's terminal check-failures step and assert no born-RED-by-design gate is in its blocking set.

**Falsifiable.** `node scripts/proof-ci-coverage.mjs` → exit 0; ci.yml's `gates`/correctness jobs name
all 6 gates; the terminal aggregator excludes the 3 born-RED tripwires.

### S2 — merge the three published tranche tips to master (MERGE-RECONCILE — the FIRST motion)

**Breach.** kf 4.4.0 (tranche-p-dev), value.js 1.1.0 (tranche-p), parse-that 0.12.0 (tranche-b) are NOT
merged to their masters; the deploy-of-record (CF Pages, `master`) is stale at the M-era `aef3ef3`.

**Cure.** Merge the kf `tranche-p-dev` tip (which contains the v4.4.0 release `c69bbb0` AND the drive
tip `df78088`) → `master`, and DISPATCH the value.js + parse-that master merges (inv-16: kf authors
only the kf merge + a DISPATCH note for the siblings — the `KF-TO-VALUEJS-Q.md`/`KF-TO-PARSETHAT-Q.md`
packets carry the master-merge ask). The kf merge lands FIRST so the next master CI run + the deploy
gate fire on the real impl-drive tree. Born-RED gate `proof:published-on-master`: assert the **v4.4.0
tag commit `c69bbb0` IS an ancestor of kf `master`** (the published-version-on-master oracle; the merge
of the tranche-p-dev tip brings it in transitively).

**Falsifiable.** `git merge-base --is-ancestor c69bbb0 master` → exit 0 (after the merge — the v4.4.0
tag commit is what the gate resolves, not a hardcoded hash, so it survives any later commits on the
branch); `proof:published-on-master` GREEN; the sibling merges are DISPATCH rows in the cross-repo packets.

### S3 — mechanize the deploy round-trip oracle in pages-deploy.sh (ROUNDTRIP-ORACLE)

**Breach.** `pages-deploy.sh` references "post-deploy validation fails" (line 20) but performs none
— no HTTP-200 probe, no bundle-hash assertion after `wrangler pages deploy`.

**Cure.** Add a post-deploy validation block to `scripts/pages-deploy.sh`: after `wrangler pages deploy`,
poll the production origin (`keyframes.babb.dev`) for HTTP-200 AND assert the served `index-*.js` hash
matches the locally-built `dist/gh-pages/assets/index-*.js` (the round-trip the impl drive observed by
hand — `index-DwKmrGBp.js`). On mismatch/non-200, surface the captured rollback target (the script
already captures it, lines 65–78). Author `proof:deploy-roundtrip` (NEW): born-RED on the current
pages-deploy.sh (no validation block — confirmed by grep for the absent HTTP-200/hash logic); GREEN when
the block exists + (in an observe-only CI leg) the live origin matches the built hash.

**Falsifiable.** `grep -c "curl\|HTTP\|200\|hash" pages-deploy.sh` (the validation block) ≥ 1 (today: 0
in the post-deploy region — confirmed the script has only rollback capture); `proof:deploy-roundtrip`
asserts the block + the hash-match.

### S4 — the device-dependence CI-harden: F-7 static-gate migration + the report-all serial-chain cure

**Breach.** 15 device-independent static gates ride the slow 50m demo-smoke job; `proof:hygiene` is a
132-link serial `&&` chain that aborts on first red (the iterate-to-green wound).

**Cure.** (1) F-7 migration: move the 15 device-INDEPENDENT static gates (each opens NO browser — they
are sub-second greps/graph-walks) from demo-smoke into the fast 10m library `gates` job (measure each
gate's wall-clock first — they are sub-second, so the `gates` job stays under its ceiling; the
device-dependence-greening measure-first discipline). (2) Convert the local `proof:hygiene` serial
`&&` chain to a report-all runner (the M.W1 `proof:report-all` shape — run ALL gates, collect ALL reds,
exit non-zero ONCE at the end — so the iterate-to-green loop is O(N), not O(N²)). (3) Extend
`proof:ci-coverage` with a clause `static-gate-placement`: each gate whose script opens NO browser MUST
ride the fast `gates` job, not demo-smoke.

**Falsifiable.** `proof:ci-coverage` `static-gate-placement` clause GREEN (the 15 gates are in the fast
job); `proof:hygiene` is report-all (collects all reds, not fail-fast); the `gates` job stays under its
time ceiling.

---

## §Born-RED gate — `proof:ci-coverage` (extended) + `proof:deploy-roundtrip` + `proof:published-on-master`

**Gate names:** `proof:ci-coverage` (EXTENDED — the `terminal-aggregate-excludes-bornred` +
`static-gate-placement` clauses) + `proof:deploy-roundtrip` (NEW — `scripts/proof-deploy-roundtrip.mjs`)
+ `proof:published-on-master` (NEW — `scripts/proof-published-on-master.mjs`). The first two are
AXIS-3 STATIC (ci.yml/pages-deploy.sh parse); the deploy-roundtrip's live-origin leg is observe-only in
CI (network-dependent).

**The REAL observable they bite (NOT a proxy):** the genuine defect is *CI that can never go green (the
ci-coverage exit-1 + the demo-smoke born-RED aggregation), a deploy-of-record stale at the M-era tip,
and a "verified deploy" that performs no actual verification*. The gates assert the ACTUAL ci.yml step
set, the ACTUAL ancestry of v4.4.0 in master, the ACTUAL post-deploy validation block in pages-deploy.sh,
and the ACTUAL served bundle hash — each the genuine observable, not a grep of intent.

**What they assert (four clauses):**

**(a) ci-coverage exits 0 + the 6 gates are wired + the terminal aggregator excludes born-RED (S1).**
```
node scripts/proof-ci-coverage.mjs                                → exit 0
ci.yml `gates` job names the 4 static gates (no-foreign-symbol-stamp, soa-composite, portable-perf, spring-heatmap)
ci.yml correctness job names the 2 vitest gates (emerging-css-resolve-now, morphsvg-consume)
terminal-aggregate-excludes-bornred: the 3 born-RED tripwires NOT in the blocking set
```
BITE: reds if any impl-drive gate is unwired OR a born-RED-by-design tripwire is in the demo-smoke
blocking set (so demo-smoke can never go green — the deploy-of-record stays dead).

**(b) v4.4.0 is an ancestor of master (S2).**
```
git merge-base --is-ancestor "$(git rev-list -n1 v4.4.0)" master   → exit 0   # v4.4.0 == c69bbb0
```
BITE: reds (today, confirmed: `master...tranche-p-dev` = 0/21 — the v4.4.0 commit c69bbb0 is NOT in
master) until the merge lands — the deploy-of-record is stale at aef3ef3. *The gate resolves the
`v4.4.0` tag to its commit at run time (not a frozen hash), so it does not rot as commits land.*

**(c) pages-deploy.sh validates the round-trip (S3).**
```
grep the post-deploy region of pages-deploy.sh for an HTTP-200 probe + a built-hash assertion → present
proof:deploy-roundtrip (observe-only CI leg): the live origin serves the built index-*.js hash
```
BITE: reds (today: the validation block is ABSENT — confirmed the script has only rollback capture)
until the block exists — a "verified deploy" that verifies nothing.

**(d) the device-dependence harden landed (S4).**
```
static-gate-placement: every browser-less gate rides the fast gates job, not demo-smoke
proof:hygiene is a report-all runner (collects all reds, exits once)
```
BITE: reds if a static gate still rides demo-smoke (the wall-clock + iterate-to-green wound) or the
hygiene chain is still fail-fast.

**Witness input that REDs on today's tree (pre-cure):**
- Clause (a): `node scripts/proof-ci-coverage.mjs` → exit 1 (confirmed — 6 gates unwired) → **RED**.
- Clause (b): `git rev-list --left-right --count master...tranche-p-dev` = 0/21 (re-confirmed live;
  was 0/18 at the audit snapshot) → the v4.4.0 commit c69bbb0 is NOT in master → **RED**.
- Clause (c): `scripts/pages-deploy.sh` has rollback capture but NO post-deploy HTTP-200/hash block
  (confirmed) → **RED**.
- Clause (d): the 15 static gates ride demo-smoke + `proof:hygiene` is a 132-link `&&` chain (confirmed
  package.json:200) → **RED**.

This is a GENUINE born-RED on the real observable: the exit-1 coverage gate + the missing master
ancestry + the no-op deploy validation + the device wall — never a proxy.

**Greens on the cure:** the 6 gates wired + the terminal aggregator fixed (S1) + v4.4.0 merged to
master (S2) + the pages-deploy.sh validation block + `proof:deploy-roundtrip` (S3) + the F-7 migration +
the report-all hygiene runner (S4) — `proof:ci-coverage` exits 0, `proof:published-on-master` GREEN,
demo-smoke can go green, the deploy-of-record fires.

**Implementation locus:** `.github/workflows/ci.yml` (the 6 gate steps + the terminal-aggregator fix +
the F-7 migration), `scripts/pages-deploy.sh` (the post-deploy validation block), `scripts/proof-ci-coverage.mjs`
(the two new clauses), `scripts/proof-deploy-roundtrip.mjs` + `scripts/proof-published-on-master.mjs`
(NEW gates), `package.json` (the report-all `proof:hygiene` runner + the new gate entries). NO `src/` or
`demo/` source change.

---

## §Dependencies

- **`proof:boundary` + release.yml — already GREEN/sound** (B1-deploy-ci STRENGTHS). Q.WA3 does not
  touch them.
- **Q.W0 (record-hygiene) — leads.** Q.W0 records the master-divergence as a tracked obligation; Q.WA3
  discharges it (the merge). No dependency on the other Band-A waves.
- **value.js + parse-that master merges — DISPATCH (not a kf edit).** inv-16: kf authors only the kf
  merge; the sibling master-merges are DISPATCH rows in `KF-TO-VALUEJS-Q.md`/`KF-TO-PARSETHAT-Q.md`
  (Band G). Q.WA3 does not block on them — the kf merge is the deploy-of-record's gate.
- **The FIRST motion of the whole Q DAG.** Per `Q.md §3`, every cross-repo publish chain (parse-that
  0.13.0 → value.js 1.2.0 → kf 5.0.0) AND the 5.0.0 cut sit DOWNSTREAM of the master-merge reconcile —
  Q.WA3 lands FIRST so the deploy-of-record is live-correct before any new cut.
- **`proof:alias-dropped` + `proof:changelog-5.0.0` — NOT a Q.WA3 gate; the SINGLE owner is Q.WE1.**
  Q.WA3 authors only the CI-floor gates (`proof:ci-coverage` extended, `proof:deploy-roundtrip`,
  `proof:published-on-master`). The no-legacy alias gate (`proof:alias-dropped`) and the breaking-set
  CHANGELOG gate (`proof:changelog-5.0.0`) are authored gate-first by **Q.WE1** (Band E §S1); Q.WA3 only
  REFERENCES them (the alias-free surface is exercised on the same CI run Q.WA3 makes green). This
  pre-empts the dual-ownership confusion the Q.W0/PROGRESS "Q.WE1/Q.WA3" phrasing once carried — there
  is ONE owner per gate, no co-authorship.

---

## §dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WA3 — DOCS ONLY. It writes zero engine/demo/library
source (inv-16; the value.js/parse-that master merges are DISPATCH-tracked, never foreign-tree edits).
The IMPLEMENTATION (the ci.yml wiring, the kf master merge, the pages-deploy.sh validation block, the
new gates, the report-all hygiene runner, the F-7 migration) opens only on the owner's explicit
authorization. When it opens it is gate-first (`proof:ci-coverage` extended + `proof:deploy-roundtrip` +
`proof:published-on-master` authored born-RED BEFORE the wiring lands), observable-truth (the gates
assert the actual ci.yml step set + the actual master ancestry + the actual served hash, never a grep
of intent), no-legacy (the serial `&&` hygiene chain is REPLACED by report-all, not kept beside; the
born-RED tripwires are excluded from the blocking aggregator, not silenced), KISS (one CI-green pass,
one merge, one validation block, one harden), gestalt (ONE deploy oracle — the round-trip mechanized,
not observed by hand), and P-invariant-28 (the master-merge reconcile is the FIRST DAG motion; the
deploy-of-record is live-correct before any cut).

---

## §Mid-tranche-friction pre-emption

**Friction this wave could spawn:** the kf master merge will trigger the FIRST real master demo-smoke
run with the impl-drive gates AND the real (non-born-RED) reds the last master run showed — a naive
merge could surface a cascade of device-dependent reds mid-tranche (the one-red-per-round loop).
**PRE-EMPT:** S1 (ci-green) + S4 (the F-7 migration + report-all) land IN THE SAME WAVE as the merge,
so the first post-merge master run is over a CI that is already wired + device-hardened — the
device-dependence-greening law ("break the one-red-per-round loop in ONE pass") is honored by folding
the four sub-waves into one.

**Second friction:** `proof:deploy-roundtrip`'s live-origin fetch is inherently network-dependent and
will flake in CI (CF edge propagation latency after a deploy). **PRE-EMPT:** the deploy-roundtrip CI
leg is OBSERVE-ONLY (`declarePosture("observe-only", {reason: "CF edge propagation latency"})`); the
HARD assertion is the static one (the validation block EXISTS in pages-deploy.sh — a grep, device-
independent); the live match is reported, never blocking.

**Third friction:** the F-7 move of 15 static gates into the fast `gates` job could push it past its
10m ceiling. **PRE-EMPT:** S4 measures each migrated gate's wall-clock FIRST (they are sub-second greps/
graph-walks per B1-deploy-ci), so the `gates` job stays under its ceiling by construction — the
measure-first discipline, not a hope.

**Fourth friction:** `proof:ci-coverage` clause (b) ("v4.4.0 ancestor of master") FAILS until the merge
actually happens — but the merge is a real git operation, owner-authorized at IMPL. **PRE-EMPT:** the
clause is born-RED BY DESIGN (it asserts the obligation Q.W0 recorded); it greens the moment the
authorized merge lands — it is not a perpetual blocker, it is the merge's own oracle.
