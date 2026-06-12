# J.W3 Plan-vs-Delivery Audit (Tranche K Lane)

**Auditor:** K audit fleet — wave-J.W3 lane
**Branch audited:** `tranche-j-dev` @ `4f1fc4c` (= master, Tranche J closed 2026-06-11)
**Spec:** `docs/tranches/J/waves/J.W3.md`
**Impl record:** `docs/tranches/J/waves/J.W3-impl.md`
**Date:** 2026-06-11
**Scope:** plan-vs-delivery audit of J.W3 (the estate industrialized): lib reality (scripts/lib/*),
net-deletion numbers verifiable NOW, posture seam single, proof:all==CI two-way for K-era gates added since.

---

## §0 — Method

Every claim below is cited to a file:line, a command + observed output, or a git sha. Commands
run against `tranche-j-dev` HEAD (`4f1fc4c`); baseline comparisons cite the W3 commit (`8c66e3e`,
merged at `c6ba13b`). Severity: P0 product broken / P1 real defect or design failure /
P2 refinement.

---

## §1 — The lib (`scripts/lib/*`): real at HEAD

### 1a — All four lib authorities landed and are substantive

Commands run:

```
wc -l scripts/lib/demo-driver.mjs scripts/lib/ci-env.mjs \
       scripts/lib/console-budget.mjs scripts/lib/gate-shape.mjs
```

Observed:
```
     756 demo-driver.mjs   (impl said 669 — K-era lifecycle extensions grew it)
     105 ci-env.mjs
     130 console-budget.mjs
      91 gate-shape.mjs
    1082 total
```

**Verdict: DELIVERED.** All four authorities exist and export what the spec required
(`withPage`/`withBrowser`/`navToScene`/`serveDist`/`resolveChromium` confirmed at
`demo-driver.mjs:422–671`; `IN_CI`/`declarePosture`/`observeOnlyInCI` at `ci-env.mjs:41`;
`NAMED_BENIGN`/`chargeBudget`/`isNamedBenign` at `console-budget.mjs`; `HARNESS_SIGNATURE`/
`missingHarnessAnchors`/`actuationNamesOf` at `gate-shape.mjs:37–91`).

### 1b — Lib importers: W3 target was ~50, HEAD is 63

```
grep -rln 'lib/demo-driver' scripts/*.mjs | wc -l   →  63
```

W3 close recorded 60 (impl record §The net-deletion record); HEAD 63 = +3 K-era gates
(`proof:subject-animates`, `proof:live-session-mobile`, `proof:appearance-suffusion`) adopted the lib
on creation. lib-adoption velocity is positive.

---

## §2 — Net-deletion numbers: verifiable at HEAD

The binding BEFORE baseline is the W3 commit's worktree (`09a56bf`) as recorded in the impl record:
estate LoC 35,191. The W3 close was `31,775`. HEAD is `37,152`.

```
wc -l scripts/proof-*.mjs | tail -1   →  37,152 total
```

The HEAD excess over the W3 close is K-era additions: three new proof scripts added after the W3
merge (`proof-appearance-suffusion.mjs`, `proof-live-session-mobile.mjs`,
`proof-subject-animates.mjs`) and growth from K-era gate augmentation. The W3 wave-level
net-deletion (35,191 → 31,775, −3,416) is a per-wave binding: the K-era delta is a separate
accounted line (new correctness gates, `J.W3.md` §Hard leg-3 carve-out text). No violation of T1.

**Proof keys at W3 close:**

```
git show 8c66e3e:package.json | node -e "…" → 111
```

Observed 111 = matches impl record (−1 repin-safe, +3 S3d wraps; net +2 by design).
HEAD = 119 = +8 K-era additions (three new correctness gates: subject-animates, live-session-mobile,
appearance-suffusion; five hygiene additions).

**Binding dup-count cells at HEAD:**

| Cell | W3 BEFORE (09a56bf) | W3 AFTER (8c66e3e) | HEAD (4f1fc4c) | Status |
|------|--------------------|--------------------|----------------|--------|
| `serveDist()` inline | 43 | **0** promised | **5** | REGRESSION — see §3 |
| `const MIME` inline | 51 | **0** | **5** | REGRESSION — see §3 |
| `navByHash` copies | 5 | **0** | **0** | DELIVERED |
| `IN_CI` re-implemented | 3 | **0 functional** | **0 functional** | DELIVERED |
| lib importers | 7 → 9 | ~**60** | **63** | DELIVERED (UP) |

The `serveDist`/`MIME` cells are non-zero at HEAD: see §3 for the breakdown (2 of 5 are W7b
merge regressions; 2 are W2 scope-misses; 1 is a documented legitimate exception).

---

## §3 — The five remaining inline `serveDist` copies: root-cause breakdown

```
grep -rn 'function serveDist' scripts/*.mjs
```

Observed (`4f1fc4c`):
```
scripts/proof-control-surface-single-writer.mjs:140
scripts/proof-easing-sidebar-normalized.mjs:116
scripts/proof-easing-sidebar-minimal.mjs:179
scripts/proof-engine-no-throw-on-play.mjs:168
scripts/proof-sheet-reopen-scroll.mjs:70
```

### 3a — engine-no-throw-on-play: legitimate exception (DOCUMENTED)

`proof-engine-no-throw-on-play.mjs:48–56` states: "SPECIALIZED — not withPage — because the J.W1
live library probe needs routes the lib's serveDist has no overlay for: the lib-probe HTML +
importmap onto `/__kf-vendor__/` + `/__kf-lib__/`." It uses `withBrowser` from the lib
(`demo-driver.mjs` import at `:66`), omits `withPage` for a documented server reason. The inline
`serveDist()` serves a custom importmap overlay that `lib/demo-driver.mjs`'s `serveDist` cannot
emit. The spec's S1 no-workaround prohibition says "If a gate cannot route through the lib without
an oracle change, that is a product or primitive defect — handed back"; the engine gate's
specialization is a HARNESS (server overlay) change, not an oracle change, and the rationale is
documented in the gate header. **Classification: documented exception. Not a regression.**

### 3b — easing-sidebar-normalized and easing-sidebar-minimal: W7b merge regression (P1)

**Root-cause chain (verified via git log):**

1. W3 commit (`8c66e3e`) DID migrate both files: `git show 8c66e3e -- scripts/proof-easing-sidebar-normalized.mjs` shows `+import { navToScene, withPage } from "./lib/demo-driver.mjs";` and `+const result = await withPage(`.
2. The j-impl-w7b branch diverged from `tranche-j-dev` at `890e2b7` (tail-triage-round-3), which pre-dated the W3 merge (`c6ba13b`). The W7b worktree carried the H.W10 pre-migration versions.
3. `233c07e` ("Merge branch 'tranche-j-dev' into j-impl-w7b") merged in `tranche-j-dev` at the OLD `890e2b7` tip — NOT after the W3 merge. So the W7b branch never saw the W3 migration of these files.
4. When `73bf694` merged j-impl-w7b back into `tranche-j-dev`, the old inline versions won the merge resolution, silently overwriting the W3-migrated lib-importing versions.

**Evidence:**
```
git show c6ba13b:scripts/proof-easing-sidebar-normalized.mjs | grep 'withPage'
  → import { navToScene, withPage } from "./lib/demo-driver.mjs";
  → const result = await withPage(

git show 73bf694:scripts/proof-easing-sidebar-normalized.mjs | grep 'withPage\|serveDist'
  → function serveDist() {   ← old inline version won the merge
```

Both scripts are in `proof:hygiene` and carry 3× inline `KF_PLAYWRIGHT_DIR` each (no lib import).
Their oracles are intact (the W7b diff only widened `.single-surface-panel` selectors, not oracle
changes), so the **gate still bites** — this is a harness regression, not a lobotomy.
**Classification: P1 — a W3 net-deletion delivery item was silently reverted by a merge conflict
resolution. The scripts run correctly but re-introduce inline boilerplate W3 deleted.**

### 3c — control-surface-single-writer and sheet-reopen-scroll: W2 scope-miss (P2)

Both gates were authored at `7023e15` (J.W2 merge), which landed BEFORE the W3 merge (`c6ba13b`).
W3's migration batch list (impl record §The per-batch migration ledger, 8 batches, ~56 scripts)
does NOT include either:

```
git show 8c66e3e -- scripts/proof-control-surface-single-writer.mjs  → empty
git show 8c66e3e -- scripts/proof-sheet-reopen-scroll.mjs            → empty
```

The W3 batch `6 — dock/controls/interaction` covers 11 gates but not these two W2 gates.
`proof:sheet-reopen-scroll` only has `import { SCENE_MACHINE_KEY }` from lib (partial; no
`withPage`/`withBrowser`). `proof:control-surface-single-writer` imports `navToScene` +
`SCENE_MACHINE_KEY` but still has inline `serveDist()` + `MIME` + chromium resolution.

Both are now in the **correctness tier** (`proof:correctness` — confirmed at HEAD). They carry
inline harness for correctness-class oracles. Their oracles are intact and they still bite
(no lobotomy); the W3 bite-preservation machine clause (oracle-set byte-identical) is
satisfied. But the W3 spec's "~50 browser gates" scope should have covered them.
**Classification: P2 — scope miss in the W3 migration; both gates have correct oracles and
bite, but retain inline boilerplate contrary to the estate consolidation goal.**

---

## §4 — Posture seam: single at HEAD

```
grep -rn 'process\.env\.CI\b' scripts/*.mjs | grep -v 'ci-env\|ci-coverage'  → empty
grep -rn 'declarePosture\|observeOnlyInCI' scripts/proof-*.mjs | grep -v ci-coverage
  → proof-lighthouse-mobile.mjs:71, proof-perf-frame-budget.mjs:64,
     proof-scene-transition-perf.mjs:81, proof-visual-lock.mjs:292
```

All four `declarePosture` calls route through `scripts/lib/ci-env.mjs`. No re-implemented
`IN_CI` literal exists outside the authorized pair (`ci-env.mjs`, `ci-coverage.mjs` detection
text). **The single-authority posture seam holds at HEAD. DELIVERED.**

The taxonomy doc (`docs/tranches/J/gate-taxonomy.md`) names all three postures (hard,
observe-only, runner-calibrated) and the third state (correctness-tier-but-CI-observe-only).
Four observe-only rows are present (perf-frame-budget, scene-transition-perf, visual-lock,
lighthouse-mobile — the last added by J.W4 as the impl record promised).

---

## §5 — proof:all == CI two-way at HEAD (K-era gates included)

```
node -e "…converse check…"  →  CI gates not in proof:all: 0
```

Verified via the script at §5 of this doc's method: every gate invoked via `npm run proof:*` in
`ci.yml` is reachable from `proof:correctness ∪ proof:hygiene` (= `proof:all`), modulo the four
named exclusions (proof:all, proof:correctness, proof:hygiene, proof:browser). The three former
CI-only orphans (`dock-zorder`, `scene-control-dfa`, `scene-transition-perf`) are confirmed in
`proof:hygiene`. The three former raw-node steps (`demo-smoke`, `occlusion`, `lighthouse-a11y`)
are confirmed as `proof:*` keys in `proof:hygiene`. K-era correctness additions
(`subject-animates`, `control-surface-single-writer`, `sheet-reopen-scroll`, `live-session-mobile`,
`appearance-suffusion`) are CI-wired at `ci.yml:266–312,368–369,921–922` and in `proof:correctness`.

**The two-way `proof:all == CI` equivalence holds at HEAD. DELIVERED.**

The converse clause (`proof-ci-coverage.mjs:165–210`, clause 0b) is machine-enforced.

---

## §6 — Remaining S6 deliverables: verified at HEAD

| Item | Command | Result |
|------|---------|--------|
| `proof:repin-safe` KILLED | `ls scripts/proof-repin-safe.mjs` | ABSENT (KILLED) |
| `proof:repin-safe` key removed | `grep 'repin-safe' package.json` | absent |
| deps floor `value.js ≥ 0.11.2` | `proof-deps-current.mjs:65` | `"0.11.2"` |
| deps floor `glass-ui ≥ 3.9.0` | `proof-deps-current.mjs:80` | `"3.11.2"` (K-era advance) |
| `parse-that ≥ 0.9.0` | `proof-deps-current.mjs:66` | `"0.9.0"` |
| stale `dock-morph-settled` in ci.yml | `grep 'dock-morph-settled' ci.yml` | absent (PURGED) |
| phantom `no-route-storm` refs | `grep -rn 'no-route-storm' scripts/` | absent (PURGED) |
| W7-5 stale CANDIDATE_GATES | `grep 'demo-console-clean\|scene-icons' proof-browser.mjs` | absent (PURGED) |
| W7-1 vacuous-skip → hard fail | `withBrowser` source | `HarnessRequiredError` class at `demo-driver.mjs:442–480` |
| T3 relabels | `proof-scene-machine-irrefragable.mjs:8–9` | "reducer-algebra unit oracle … NON-AUTHORITATIVE" |
| T3 relabels | `proof-visual-lock.mjs:10–11` | "appearance-drift TRIPWIRE … NON-AUTHORITATIVE" |

**All S6 items delivered. glass-ui floor K-era advanced to 3.11.2 > the W3 3.9.0 target.**

---

## §7 — S4 meta-gate: derived roster confirmed

```
grep -n 'WAVE_HARD_GATES\|correctness' scripts/proof-gate-is-runtime.mjs | head -10
```

Line 82–114 confirm: `WAVE_HARD_GATES` is populated by parsing `proof:correctness` chain
membership (no hardcoded list). HEAD correctness tier = 15 gates (vs W3 close 10; K-era added 5).
All 15 audited by the meta-gate. **S4/T4 DELIVERED.**

---

## §8 — S5 demo-fonts actuation leg: confirmed

```
grep -c 'navToScene' scripts/proof-demo-fonts.mjs  →  4
```

Clause (d) is the SWITCH actuation leg (`proof-demo-fonts.mjs:87–102`): `navToScene(page, "spring", "Spring")` + assert body font identical. The impl record's bite-4 plant witness (Plus Jakarta re-landed in dist CSS → `✗ (d) the body font CHANGED across the cube→spring switch`) is the record. **S5 Option A DELIVERED.**

---

## §9 — gate-shape.mjs single detection authority: confirmed

Both meta-gates (`proof-gate-is-runtime.mjs:59–60`, `proof-chronic-closure.mjs:98`) import
`missingHarnessAnchors`/`actuationNamesOf` exclusively from `scripts/lib/gate-shape.mjs`.
The fix-round-1 disqualifier (the chronic-closure detector break) is closed. The inter-detector
drift class is dead. **DELIVERED.**

Note: `gate-shape.mjs:36–38` (`HARNESS_SIGNATURE`) recognizes BOTH the lib form (`withPage`/
`withBrowser`) AND the inline form (`serveDist` + `KF_PLAYWRIGHT_DIR` + `newContext`) as valid
harness signatures. This is the correct behavior — unmigrated scripts (§3b, §3c) still pass the
meta-gate check because their harnesses are intact, just not lib-routed.

---

## §10 — K-era new gates: lib adoption posture

Three new proof scripts added after the W3 merge (`diff --name-only --diff-filter=A c6ba13b HEAD`):

```
scripts/proof-appearance-suffusion.mjs    lib/demo-driver import: YES
scripts/proof-live-session-mobile.mjs     lib/demo-driver import: YES
scripts/proof-subject-animates.mjs        lib/demo-driver import: YES
```

All three K-era scripts adopted the lib lifecycle at creation. **The consolidation velocity
established by W3 is being maintained: no new gate is hand-rolling the boilerplate.**

---

## §11 — Honest coverage gap in the impl record

The impl record §Leg-1 (i) honest coverage note acknowledges that `proof:fsm-suspend-resume-live`,
`proof:amiga-subject-is-pivot`, `proof:drag-gesture`, and the `proof:live-session` battery oracle
carry **machine-fact coverage** (oracle-set byte-identical, harness-band-only diffs) rather than
fresh plant witnesses, because "their recorded defects live in engine/Three.js behavior not
reachable by a dist-CSS plant without rebuilding a stashed tree." This is an honest attenuation —
the oracle-invariance clause (all 52 `fail()` deletions classified into the permitted harness band)
is the machine ground, and the note is explicit. **Not a defect; recorded as an audit observation.**

---

## §12 — Findings summary

| ID | Finding | Evidence | Severity |
|----|---------|----------|----------|
| W3-K1 | easing-sidebar-normalized migrated by W3 then silently reverted by W7b merge conflict (inline `serveDist` returns; lib import lost) | `git show c6ba13b:…` has lib import; `git show 73bf694:…` does not; `proof-easing-sidebar-normalized.mjs:116` | P1 |
| W3-K2 | easing-sidebar-minimal: same W7b merge reversion | `git show 8c66e3e --stat` shows migration; HEAD `proof-easing-sidebar-minimal.mjs:179` inline | P1 |
| W3-K3 | control-surface-single-writer: W2 gate, existed before W3, never migrated (scope miss); now in correctness tier with inline harness | `git show 8c66e3e -- scripts/proof-control-surface-single-writer.mjs` empty; `:140` inline; in `proof:correctness` | P2 |
| W3-K4 | sheet-reopen-scroll: same scope-miss as W3-K3; partial lib import only (SCENE_MACHINE_KEY, not withPage) | `git show 8c66e3e -- scripts/proof-sheet-reopen-scroll.mjs` empty; `:70` inline; in `proof:correctness` | P2 |
| W3-K5 | impl record claims 56-gate migration; actual migrated set is ~54 (easing-sidebar-normalized and easing-sidebar-minimal were reverted post-merge); the ledger is inaccurate at HEAD | impl record §per-batch table lists both in batch 2; HEAD has neither migrated | P2 (record accuracy) |
| W3-K6 | engine-no-throw-on-play retains inline serveDist with full MIME table — documented SPECIALIZED exception (custom importmap overlay); not a defect but should be annotated as an explicit lib-exception in the posture manifest | `proof-engine-no-throw-on-play.mjs:48–56`; `gate-shape.mjs:36` accepts inline form | P2 (documentation) |

**No P0 findings.** The W3 estate consolidation is substantially delivered. The lib is real and
adopted by all new K-era gates. The posture seam is single. The proof:all==CI equivalence holds
two-way including K-era additions. The two P1 findings (W3-K1/K2) are harness regressions —
not oracle regressions — so no gate lost its bite, but the inline boilerplate W3 deleted has
re-appeared in two hygiene-tier gates via a merge conflict resolution that chose the old branch
version.

---

## §FOLD — Findings → K wave assignments

| Finding | Severity | Seam | Suggested wave-class |
|---------|----------|------|----------------------|
| W3-K1: easing-sidebar-normalized re-migration (W7b merge reversion) | P1 | `scripts/proof-easing-sidebar-normalized.mjs` | K.WX estate-maintenance (harness only; oracle byte-identical guaranteed by gate-shape; re-add lib import + withPage call, restore the 3727382 state) |
| W3-K2: easing-sidebar-minimal re-migration (W7b merge reversion) | P1 | `scripts/proof-easing-sidebar-minimal.mjs` | K.WX estate-maintenance (same as K1; parallel fix) |
| W3-K3: control-surface-single-writer correctness gate, inline harness | P2 | `scripts/proof-control-surface-single-writer.mjs` | K.WX estate-maintenance (migrate boilerplate; oracle untouched; confirmed bites already in correctness tier) |
| W3-K4: sheet-reopen-scroll correctness gate, inline harness | P2 | `scripts/proof-sheet-reopen-scroll.mjs` | K.WX estate-maintenance (add withPage; remove inline serveDist/MIME/chromium; oracle unchanged) |
| W3-K5: impl record migration count inaccurate at HEAD | P2 | `docs/tranches/J/waves/J.W3-impl.md` | DOCS lane (amend §per-batch with a post-merge annotation noting the W7b reversion) |
| W3-K6: engine-no-throw-on-play specialized exception undocumented in posture manifest | P2 | `scripts/proof-engine-no-throw-on-play.mjs` + `docs/tranches/J/gate-taxonomy.md` | DOCS lane (add a "non-instances" entry for engine-no-throw specialized server exception, mirroring scene-perf-budget's hard-by-decision entry) |

---

## §Appendix — Key commands run

```sh
# lib reality
wc -l scripts/lib/demo-driver.mjs scripts/lib/ci-env.mjs \
       scripts/lib/console-budget.mjs scripts/lib/gate-shape.mjs

# estate LoC
wc -l scripts/proof-*.mjs | tail -1   # → 37,152 (HEAD)

# proof: keys
node -e "const p=require('./package.json'); console.log(Object.keys(p.scripts).filter(s=>s.startsWith('proof:')).length)"
# → 119 HEAD; git show 8c66e3e:package.json | node -e "…" → 111 at W3 close

# inline serveDist copies
grep -rn 'function serveDist' scripts/*.mjs
# → 5 files (engine-no-throw: documented exception; easing-sidebar-*: W7b reversion; control-surface + sheet-reopen: W2 scope-misses)

# IN_CI single authority
grep -rn 'process\.env\.CI\b' scripts/*.mjs | grep -v 'ci-env\|ci-coverage'
# → empty (single authority holds)

# navByHash copies
grep -rln 'navByHash' scripts/*.mjs  # → 0 (fully killed)

# lib importers
grep -rln 'lib/demo-driver' scripts/*.mjs | wc -l  # → 63

# two-way proof:all==CI
node -e "…converse check…"  # → 0 CI gates not in proof:all

# W7b reversion evidence
git show c6ba13b:scripts/proof-easing-sidebar-normalized.mjs | grep 'withPage'
git show 73bf694:scripts/proof-easing-sidebar-normalized.mjs | grep 'serveDist'

# W3 scope-miss evidence
git show 8c66e3e -- scripts/proof-control-surface-single-writer.mjs  # → empty
git show 8c66e3e -- scripts/proof-sheet-reopen-scroll.mjs            # → empty
```
