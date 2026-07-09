# r8 — Gates, CI, and the Complete Deferred Ledger (Tranche S pass-1 research)

**Lane:** r8 · **Branch read:** `tranche-s-dev` (HEAD `18e8617`) · **Date:** 2026-07-02
**Scope:** the authoritative open-items map S must fold — the R chronic ledger, the gate roster
(189 `proof:*`), CI truth on master, and the bench taxonomy observe-only surface.

---

## Executive summary

The single load-bearing finding: **master CI has been RED continuously since Tranche K
(`9bbc227e`, 2026-06-16) — neither Q (5.0.0) nor R (5.1.0) ever achieved a green master CI push.**
Both published (npm publish is tag-triggered / `release.yml`, CI-independent) and both deployed
(via manual `workflow_dispatch`), so the *products* shipped — but the **auto-deploy-of-record is
dead**: every `workflow_run`-triggered `deploy-pages` run since K is `skipped` because it gates on a
green `demo-smoke` that never goes green (evidence §4). R's FINAL "verifies in CI post-push on the
proper runner" (`docs/tranches/R/FINAL.md:123-135`) is **falsified by the actual post-push runs** —
the VERIFY-ONLY chronics R declared terminal (DM-11b/DM-13/DM-14) sit in the demo-smoke *blocking*
failure set on the real Linux runner (§4.3).

Concrete red surface on the latest master run (`28192695182`, commit `18e8617`):

1. **Library gate — `proof:styling-idioms` RED (genuine source defect, NOT device).** Orphan class
   `.morph-ghost--from` referenced at `demo/scenes/morph/MorphTarget.vue:71` with no owned
   definition (only `.morph-ghost` + `.morph-ghost--to` are defined). Introduced by R.W5 morph
   scene-fusion (`f60d3a7`). Reproduced locally: `node scripts/proof-styling-idioms.mjs` → **exit 1**.
2. **Demo gate — `LoAF >50ms-trace` RED (device/harness flake).** The measured metric is
   `0.0000` frames >50ms (i.e. the assertion PASSES) yet the vitest-bench step exits non-zero — a
   harness/exit-code artifact under the 30.4s runner wall-clock.
3. **Demo gate — `check-failures` RED (14 blocking demo-smoke gates failed):** `demo-usability,
   cold-entry, engine-no-throw-on-play, subject-animates, fsm-suspend-resume-live, drag-gesture,
   icon-paint-live, live-session, visual-lock, computed-real-dom, lighthouse-a11y,
   easing-sidebar-minimal, scene-perf-budget, scene-parity`.

The library-gate red *rotates* run-to-run (`gate-is-runtime` on `1f7d323` → `styling-idioms` on
`18e8617`) — the classic fail-fast "one-red-per-round" loop the memory warns about
(`project_ci_device_dependence_greening`). The demo-gate red is *structural* (same LoAF +
check-failures shape every run).

**Gate roster:** 189 distinct `proof:*` script keys. Tiers: **24 correctness**, **159
hygiene-chain**, 4 unwired-to-a-tier (`proof:all`, `proof:hygiene` — orchestrators; `proof:browser`
— documented dev-convenience meta target; `proof:peer-satisfied` — demo-smoke born-RED tripwire).
No dead gates reference excised features (the sole `keyframes-vue` string is the KILL record in
`proof-chronic-closure.mjs`). **Bench taxonomy:** 75 cases — 40 observe-only, 32 run-check, 3
budgeted, 9 cross-repo.

**The R ledger (15 rows) is only half-terminal.** The 6 KILL/RECORD rows are truly terminal
(non-gate closure). The **7 VERIFY-ONLY + 2 RE-AFFIRM rows (DM-8…DM-15) are NOT terminal — they
carry a re-verify obligation every tranche**, and 3–4 of them are RED on the current runner, so per
the ledger's own rule ("any gate that reverts RED is a NEW regression to wave-assign") they are
effectively **OPEN for S**. Plus the glass-ui BC/BG handoffs are USER-DOMAIN and still pending.

---

## 1. The R deferred ledger — truly-terminal vs residue-bearing

Source: `docs/tranches/R/PROGRESS.md:156-172` (`## Open deferrals`, 15 rows) + `## Owner rulings`
(`:174-181`) + `docs/tranches/R/FINAL.md:36-46`. The live parse target is pinned:
`scripts/proof-chronic-closure.mjs:119` `CHRONIC_LEDGER = docs/tranches/R/PROGRESS.md`,
`:495` `LEDGER_LABEL = "R/PROGRESS.md"` (the Q→R re-point landed, confirmed).

### 1a. TRULY terminal (6 rows — non-gate KILL/RECORD closure, no re-verify)

| Row | Born | Chronicity | Disposition | Why terminal |
|---|---|---|---|---|
| DM-7 keyframes-vue | K.W12 | 6 | **KILL** | npm-unpublished + `packages/keyframes-vue/` deleted + all refs scrubbed (`23a6867`). No gate; the KILL band closes. `PROGRESS.md:158` |
| DM-1 dock click-strand | I (BLK-8) | 8 | **KILL (contingency fired)** | band-aid excised → kf-internal disjoint `pointerup`+`keydown` handler (`a452349`); `proof:workaround-deletion` S2 GREEN. `PROGRESS.md:159` |
| DM-5 S1 aria-orientation | K | 6 | **KILL (contingency fired)** | suppress excised → `KfPillTabs.vue`; S1 GREEN. `PROGRESS.md:160` |
| DM-24 N-Stage unshelf | N | 3→4 | **KILL — redundant** | mobile shelf-driver already shipped Q.WC3. `PROGRESS.md:162` |
| DQ-3 contrast-color() | Q | 1 | **KILL — reasoned** | value.js 1.2.0 shipped parser; kf has no demo use-case. `PROGRESS.md:163` |
| VJ-Q9 color-serialization | Q | 1 | **RECORD — covered** | covered by roundtrip-fidelity + grammar-fuzz corpora. `PROGRESS.md:164` |

*Caveat:* DM-5 S8 (`PROGRESS.md:161`, VERIFY-ONLY, chronicity 5) closes via `proof:workaround-deletion`
S8 — a source-present node probe, not a runtime gate. It is terminal *iff* the probe stays GREEN;
low residue but technically a re-verify.

### 1b. RESIDUE-bearing (9 rows — VERIFY-ONLY / RE-AFFIRM, re-verify EVERY tranche)

These are the "×7 VERIFY-ONLY + ×2 RE-AFFIRM" cohort the R substrate note itself flags
(`PROGRESS.md:152-154`): each cites a correctness-tier RUNTIME gate that must be re-run on each
tranche's dist. **The ledger's own rule (`PROGRESS.md §"[E]"` / `Q/PROGRESS.md:150`): "any gate that
reverts RED is a NEW regression to wave-assign."** Cross-referenced against the live CI runner (§4.3):

| Row | Gate (closure oracle) | Disp | R.W8 local (FINAL §5) | **Current CI runner** | S status |
|---|---|---|---|---|---|
| DM-8 Lighthouse floors | `proof:lighthouse-mobile` | VERIFY-ONLY | exit 2 (binary absent) | observe-only-in-CI | re-verify; never CI-hard |
| DM-9 specular | `proof:specular-absent-at-rest` | RE-AFFIRM | PASS | not in blocking-fail set → GREEN | re-verify (clean) |
| DM-10 typography | `proof:font-census` | VERIFY-ONLY | PASS | not in blocking-fail set → GREEN | re-verify (clean) |
| DM-11a mobile slider | `proof:spring-slider-continuous` | VERIFY-ONLY | PASS | not in fail set → GREEN | re-verify (clean) |
| **DM-11b mobile subject** | `proof:subject-animates` | VERIFY-ONLY | exit 1 (ENV) | **RED — blocking** | **OPEN — re-shape/calibrate** |
| **DM-12 dock perf** | `proof:perf-frame-budget` | RE-AFFIRM | exit 1 (ENV) | not in fail set (continue-on-error passed?) | re-verify; glass-ui HANDOFF clause |
| **DM-13 empty-value** | `proof:engine-no-throw-on-play` | VERIFY-ONLY | exit 1 (ENV importmap) | **RED — blocking** | **OPEN — re-shape/calibrate** |
| **DM-14 DFA suspend** | `proof:fsm-suspend-resume-live` | VERIFY-ONLY | exit 1 (ENV) | **RED — blocking** | **OPEN — re-shape/calibrate** |
| DM-15 scene-control-dfa | `proof:control-surface-single-writer` | VERIFY-ONLY | PASS | not in fail set → GREEN | re-verify (clean) |

**Finding r8-F1 (HIGH):** R FINAL §5 (`FINAL.md:123-135`) classifies DM-11b/DM-13/DM-14 misses as
"environment-class … verifies in CI post-push on the proper runner." The actual post-push runner run
(`28192695182`) shows all three in the demo-smoke **blocking** failure set — so the R claim is
unproven, and these three chronics are *not* closed. They are the S chronic substrate's live core.

### 1c. Owner rulings (terminal, no residue)

`PROGRESS.md:174-181`: version `5.1.0` (no 6.0.0); `animate()` EXCISE (done R.W4). Both discharged.

### 1d. glass-ui USER-DOMAIN handoffs (`PROGRESS.md:189-191`)

DM-1 / DM-5 are recorded USER-DOMAIN (owner WIP) but were closed via **contingency KILL** (kf-internal
replacements) rather than the BC consume — so the glass-ui BC dependency is *severed* for those two.
The residual glass-ui handoff is `proof:glassui-aria-ask` (observe-only, PENDING-until-BC-publish,
`ci.yml:470`) and `proof:peer-satisfied` (born-RED F-2 peer-cycle until glass-ui BB widens its peer
range, `ci.yml:531-533`). These are the surviving BC/BG springs.

---

## 2. Deferral language OUTSIDE the ledger (Q + R FINAL/PROGRESS scan)

Scanned R + Q FINAL/PROGRESS for `defer|handoff|BOOK|WATCH|pending|observe-only|re-verify`. Findings
not already a ledger row:

- **r8-F2 (MEDIUM):** Q's `## Open deferrals` (`Q/PROGRESS.md:152-181`) carries **7 DQ-N net-new
  rows** (DQ-1…DQ-7) — packrat re-entrancy, dead parse-that API, contrast-color, false-RED S1/S2,
  ci-coverage, emerging-CSS-P2, wave-charter. R's ledger folded DQ-3/VJ-Q9 but **DQ-1, DQ-2, DQ-4,
  DQ-5, DQ-6, DQ-7 do NOT appear as R rows** — they were dispatched/FOLD-LANDED in Q and are assumed
  closed, but S should confirm each landed (esp. DQ-1 parse-that packrat re-entrancy, a cross-repo
  dispatch, and DQ-2 dead-API which touches the SOTA-parsing lane).
- **r8-F3 (LOW):** R FINAL §7 (`FINAL.md:165-181`) leaves the **publish runbook** as USER-DOMAIN —
  the 5.1.0 tag/publish/deploy is owner-hand; not a code deferral but an open operational item (and
  5.1.0 *did* publish, so this is discharged).
- **r8-F4 (LOW):** `bench/taxonomy.json` `$comment` records **P.W4 codegen-parse as a "RETIRED
  TOMBSTONE" (owner directive 2026-06-22)** and `color2Into cross-repo` as awaiting value.js-P
  re-pin — a live cross-repo WATCH (9 crossRepo entries, §5).

No stray `BOOK` / bare deferral survives in the R FINAL prose (the `BOOK` hits are the non-vacuity
plant descriptions, `FINAL.md:75`). The Q→R substrate re-point is clean.

---

## 3. The gate roster — count, tiers, dead/vestigial, observe-only, device-dependence

**Count:** 189 distinct `proof:*` keys in `package.json` (`grep -oE '"proof:[a-z0-9-]+":'`).

### 3a. Tier map

| Tier | Members | Source |
|---|---|---|
| **correctness** (`proof:correctness`) | **24** | `package.json:234` |
| **hygiene-chain** (`proof:hygiene-chain`) | **159** | `package.json:236` |
| unwired to a tier | 4 | — |

The 4 unwired: `proof:all` + `proof:hygiene` (orchestrators, not gates); `proof:browser`
(documented META dev-convenience target, RECORDED exclusion in `proof:ci-coverage`,
`scripts/proof-browser.mjs:1-20` — **not vestigial, intentional**); `proof:peer-satisfied`
(demo-smoke-only born-RED tripwire, `ci.yml:531`, continue-on-error).

Also note the correctness tier (24) and the demo-smoke job overlap heavily but are wired *twice*
(once in `proof:correctness` for the tier-membership meta-gate, once as individual `ci.yml`
demo-smoke steps with `KF_REQUIRE_BROWSER=1` + `continue-on-error` + a `check-failures` re-aggregator,
`ci.yml:1719-1808`). This double-wiring is the source of the demo-smoke green criterion.

### 3b. Dead / vestigial gates

**None found referencing excised features.** Grepped `scripts/proof-*.mjs` for
`keyframes-vue|SpanParser|codegen|animate\(\)` — only hit is `proof-chronic-closure.mjs` (the DM-7
KILL record, correct). The 5.0.0 alias-drop (`Animation`/`ScrollTimeline`) is actively *policed* by
`proof:alias-dropped` (`ci.yml`) — the opposite of vestigial.

*Candidate cleanup (LOW):* the roster has grown to 189 gates with heavy demo-styling granularity
(`proof:bezier-no-scroll`, `proof:bezier-single-card`, `proof:bezier-grown`, `proof:crayon-preserved`,
`proof:easter-egg`, `proof:pp-logo-svg`, ~30 `proof:scene-*`/`proof:*-rounded`/`proof:stage-*`
layout locks). Many are single-assertion source-shape locks over demo CSS that S's demo re-org
(demo/app cleanup, scene-switcher resurrection) will invalidate wholesale — a re-shape/consolidation
target, not dead *today*.

### 3c. Observe-only clauses (`ci.yml`)

| Gate | Line | Posture |
|---|---|---|
| `proof:epf1-measure` | `ci.yml:274` | observe-only (forced-layout, exits 0 always) |
| `proof:bench-taxonomy` (budgeted arm) | `ci.yml:254` | budgeted floor observe-only-in-CI, hard on-device |
| `proof:pin-ledger-current` | `ci.yml:441` | npm-view leg observe-only |
| `proof:kf-differential` | `ci.yml:458` | observe-only in CI, hard under `KF_REQUIRE_BROWSER` |
| `proof:glassui-aria-ask` | `ci.yml:470` | observe-only PENDING-until-BC-publish |
| `proof:deploy-roundtrip` | `ci.yml:479` | live leg observe-only |
| `proof:lighthouse-mobile` | `ci.yml:984` | observe-only-in-CI, hard on-device via `KF_REQUIRE_LH=1` |
| `proof:peer-satisfied` | `ci.yml:531` | born-RED-by-design, continue-on-error (RECORDED not blocking) |

### 3d. Device-dependent gates

The entire demo-smoke correctness cohort runs `KF_REQUIRE_BROWSER=1` + `continue-on-error: true`
(`ci.yml:543-745`, ~30 steps) then re-aggregates via `check-failures` (`ci.yml:1719`). The
device-sensitive ones the memory (`project_ci_device_dependence_greening`) and R FINAL §5 name:
absolute frame/ms thresholds (`proof:perf-frame-budget` 4× CPU throttle, `ci.yml:628`;
`proof:scene-perf-budget`), render-race timeouts (`proof:subject-animates` `waitForFunction` 30s),
the `LoAF >50ms` bench (`ci.yml:1695`, `KF_LOAF_COUNT: "48"` runner-calibration), and the lighthouse
binary gates (`proof:lighthouse-a11y` `:968`, `proof:lighthouse-mobile` `:984`).

---

## 4. CI truth — the master red, characterized

### 4.1 No green master CI since Tranche K

`gh run list --workflow ci.yml --branch master`: the last **success** was `9bbc227e` (2026-06-16,
Tranche K WZ / 4.3.0). Every push since — Q close (`a15cd48` failure, `186acec` cancelled), R
fallout (`6f2493d` cancelled, `5a5f7db` cancelled, `1f7d323` failure, `18e8617` failure) — is
**failure or cancelled**. Over the last 30 runs: 17 failure, 9 cancelled, 4 success (all K-era).

**r8-F5 (CRITICAL):** Neither Q (5.0.0) nor R (5.1.0) ever produced a green master CI push. Q FINAL
("The constellation is shipped, live, and verified", `Q/FINAL.md:49`) and R FINAL ("green on
`tranche-r-dev` … CLOSED", `FINAL.md:6,194`) both assert green closes, but *master* CI is red. The
gap: R's close-state table (`FINAL.md:183-192`) ran only **6 gates** (chronic-closure, ci-coverage,
decomposition, lint, build, test) on the branch — it **never ran the full 159-member hygiene-chain
(which includes the RED `proof:styling-idioms`) nor the demo-smoke job.** Publish is tag-triggered
(CI-independent) and deploy is manual `workflow_dispatch`, so the ship happened over a red gate.

### 4.2 Library gate red — `proof:styling-idioms` (GENUINE, not device)

Run `28192695182` library job failed at `proof:styling-idioms`. Reproduced locally
(`node scripts/proof-styling-idioms.mjs` → **exit 1**):

> `morph-ghost--from (×1, first: demo/scenes/morph/MorphTarget.vue)` — a referenced idiom-shaped
> class resolves to NO owned definition.

`demo/scenes/morph/MorphTarget.vue:71` uses `class="morph-ghost morph-ghost--from"`, but the scoped
`<style>` defines only `.morph-ghost` (`:246`) and `.morph-ghost--to` (`:256`) — `.morph-ghost--from`
is orphaned. Introduced by R.W5 morph fusion (`f60d3a7`). **This is a one-line fix** (add the
`--from` rule) and a clean S FOLD. Note the library-gate red *rotates* (previous run `1f7d323` failed
on `proof:gate-is-runtime`, which `18e8617` then greened) — the fail-fast one-red-per-round loop; S
must green the WHOLE hygiene-chain in one pass, not chase heads.

### 4.3 Demo gate red — LoAF + 14 blocking check-failures

`check-failures` (`ci.yml:1719`) exit-1'd on: `demo-usability, cold-entry, engine-no-throw-on-play,
subject-animates, fsm-suspend-resume-live, drag-gesture, icon-paint-live, live-session, visual-lock,
computed-real-dom, lighthouse-a11y, easing-sidebar-minimal, scene-perf-budget, scene-parity`.
`proof:demo-smoke`/`occlusion`/`font-census`/`specular-absent-at-rest`/`spring-slider-continuous`
are NOT in the set → **the demo paints and the appearance axis is fine**; the failures are the
interaction/runtime-timing cohort. Mix of (a) genuine (the `styling-idioms` sibling suggests demo
regressions from scene-fusion may extend to `scene-parity`/`easing-sidebar-minimal`), (b) documented
device-dependence (`subject-animates` render-race, `scene-perf-budget` throttle), (c) binary-absent
(`lighthouse-a11y`). The `LoAF >50ms` step measured **0.0000** >50ms frames (assertion passes) yet the
step exits non-zero — a vitest-bench harness exit-code artifact under the 30.4s wall-clock, pure flake.

**Honest S disposition per red:**
- `styling-idioms` (morph-ghost--from) → **FOLD** (one-line CSS fix, wave 1).
- `LoAF >50ms` harness exit → **gate re-shape** (decouple the bench exit code from the measured
  assertion; the metric is green).
- the 14 demo-smoke blocking gates → **triage split**: genuine demo regressions (scene-fusion
  fallout) → FOLD in the demo re-org waves; render-race/throttle absolutes → **runner calibration or
  gate re-shape** (relative budgets, `KF_REQUIRE_BROWSER` posture review); `lighthouse-a11y` binary →
  install-in-CI or observe-only posture like `lighthouse-mobile`.

### 4.4 Deploy-of-record is DEAD

`deploy-pages.yml:42-46` gates on `workflow_run.conclusion == 'success' && head_branch == 'master' &&
event == 'push'`. Because the push-CI never succeeds, **every `workflow_run` deploy is `skipped`**
(`gh run list --workflow deploy-pages.yml`: the only `success` is a manual `workflow_dispatch`
`28143885914`, 2026-06-25). DM-20 (deploy round-trip, the "live-byte equality" oracle) is therefore
**not actually observed on the auto path** — it only fires when the owner manually dispatches. This is
a latent S obligation: green master CI is the prerequisite to resurrect the auto-deploy-of-record.

---

## 5. Bench taxonomy observe-only rows

`bench/taxonomy.json` (v1): **75 cases → 40 observe-only, 32 run-check, 3 budgeted**; **9 cross-repo**
(value.js color-math dispatch, `crossRepo[]`), 0 pendingBudgeted.

- **r8-F6 (MEDIUM):** the 6 `colorTail` SoA/boxed cases were classified **observe-only** at
  `1f7d323` (Q.WB3 S4) with the commit message conceding "bench-runs fix surfaced the **pre-existing
  coverage gap**." So 6 color-SoA bench arms have *no budget floor* — a SOTA-perf claim (`color-soa`)
  rides on observe-only benches. The `group-composite` budgeted arm (the SoA-vs-boxed K=8 ADOPT gate,
  `proof:soa-composite`) is the only real budgeted floor; the replace-arm + all color arms are
  observe-only. S's SOTA-animation uplift should convert the load-bearing color/compositor arms from
  observe-only → budgeted (device-independent ratio form, per the taxonomy's own `$comment` recipe).
- The `$comment` records **P.W4 codegen as a RETIRED TOMBSTONE** and `color2Into` cross-repo as
  awaiting a value.js-P re-pin — a live WATCH S inherits (SOTA-parsing lane).

---

## 6. Consolidated open-items table (the S chronic substrate)

| Item | Born | Chronicity | Current state | S-disposition candidate |
|---|---|---|---|---|
| **Master CI red (both jobs) since K** | K (2026-06-16) | ~9 days / 3 tranches | RED every push; no green since `9bbc227` | **FOLD wave-1 (green the whole hygiene-chain + demo-smoke in ONE pass; resurrect auto-deploy)** |
| `proof:styling-idioms` — orphan `.morph-ghost--from` | R.W5 (`f60d3a7`) | new (R) | RED (exit 1, genuine) | **FOLD** (add `.morph-ghost--from` rule, MorphTarget.vue) |
| `LoAF >50ms` bench exit-code flake | C.W1 (`ci.yml:1695`) | chronic (device) | RED step / GREEN metric (0 frames) | **VERIFY/re-shape** (decouple bench exit from assertion) |
| 14 demo-smoke blocking gates RED on runner | I–R | structural | RED (check-failures exit 1) | **triage: FOLD (genuine) + runner-calibrate / re-shape (device)** |
| DM-11b subject-animates | D(D10) | 11 (VERIFY-ONLY) | **RED on runner** (R claimed ENV) | **OPEN — re-verify + calibrate/re-shape** |
| DM-13 engine-no-throw-on-play | A(W0) | 9 (VERIFY-ONLY) | **RED on runner** (importmap ENV) | **OPEN — re-verify + fix harness importmap** |
| DM-14 fsm-suspend-resume-live | H | 8 (VERIFY-ONLY) | **RED on runner** (timing race) | **OPEN — re-verify + calibrate** |
| DM-12 perf-frame-budget | D(D5/D9) | 9 (RE-AFFIRM) | GREEN on runner / RED local throttle | **VERIFY** (glass-ui HANDOFF clause; re-affirm) |
| DM-8 lighthouse floors | B-era | 6 (VERIFY-ONLY) | observe-only (binary) | **VERIFY** (never CI-hard; on-device via KF_REQUIRE_LH) |
| DM-9 specular / DM-10 typography / DM-11a slider / DM-15 dfa | D–I | 6–9 (VERIFY/RE-AFFIRM) | GREEN on runner | **VERIFY** (clean carry; re-run on S dist) |
| DM-5 S8 FN_NAME | K | 5 (VERIFY-ONLY) | GREEN (source probe) | **VERIFY** (low residue) |
| DM-7 / DM-1 / DM-5 S1 / DM-24 / DQ-3 / VJ-Q9 | K–Q | terminal | KILL/RECORD (closed) | **none — truly terminal** |
| glass-ui `proof:glassui-aria-ask` | Q.WG-S1S2 | pending | observe-only PENDING-BC | **HANDOFF (USER-DOMAIN, glass-ui BC)** |
| glass-ui `proof:peer-satisfied` | L.W4 | chronic | born-RED (F-2 peer-cycle) | **HANDOFF (glass-ui BB peer-widen)** |
| DQ-1 packrat re-entrancy (parse-that) | Q | 1 | dispatched 0.13.0 | **VERIFY landed (SOTA-parsing lane)** |
| DQ-2 parse-that dead API / `*Span` | Q | 1 | dispatched 0.13.0 | **VERIFY landed (SOTA-parsing lane)** |
| Auto-deploy-of-record (DM-20) | L.WZ | 4 | dead (only manual dispatch) | **FOLD (revive on green CI)** |
| 6 colorTail SoA benches observe-only | Q.WB3 (`1f7d323`) | 1 | no budget floor | **FOLD (→ budgeted ratio, SOTA-animation)** |
| color2Into cross-repo WATCH | P | 1 | awaiting value.js-P | **WATCH / DISPATCH** |
| 189-gate roster granularity (demo-CSS locks) | H–R | accreting | valid today | **KILL/consolidate on demo re-org** |

---

## Tranche-S implications (wave-shaped recommendations)

1. **S-WAVE-CI-GREEN (first, blocking everything): green the master CI in ONE pass, not head-by-head.**
   Run the *complete* `proof:hygiene-chain` (159) + the demo-smoke job locally/on a calibrated runner
   before declaring any close. The R lesson repeats: R's 6-gate close table let a red hygiene-chain
   ship. Start with the genuine `styling-idioms` FOLD (orphan `.morph-ghost--from`), then work the
   demo-smoke blocking-14 triage. Do NOT chase the rotating library-gate head (fail-fast) — fix all.

2. **S-WAVE-DEVICE-CALIBRATION: settle the device-dependence class honestly.** For each of the ~14
   demo-smoke blocking gates, decide per-gate: (a) genuine regression → FOLD; (b) absolute
   frame/ms threshold that flakes on the slow Linux runner → re-shape to a *relative* budget or move to
   observe-only-in-CI/hard-on-device (the `lighthouse-mobile`/`kf-differential` posture); (c) binary
   absence (`lighthouse-a11y`) → install-in-CI or observe-only. Fix the `LoAF` bench exit-code
   decoupling (metric is green). This is the substrate the `project_ci_device_dependence_greening`
   memory is about — do it in one convergent pass.

3. **S-WAVE-CHRONIC-REVERIFY: re-classify the 9 VERIFY-ONLY/RE-AFFIRM rows against the REAL runner.**
   R verified them on a local quiet host and mislabeled runner reds as "ENV." S must re-run
   DM-8…DM-15 on the actual CI runner and either (a) confirm GREEN → carry as VERIFY, or (b) treat the
   runner RED (DM-11b/13/14) as a live regression to FOLD. The ledger's own rule mandates this. Then
   re-point `CHRONIC_LEDGER` Q→R→S atomically (the no-skip discipline — `proof-chronic-closure.mjs:119`).

4. **S-WAVE-DEPLOY-REVIVE: resurrect the auto-deploy-of-record.** Once push-CI goes green, the
   `deploy-pages.yml:42` `workflow_run` gate fires again and DM-20's live-byte round-trip is observed
   on the auto path (not just manual dispatch). Fold the manual-dispatch crutch.

5. **S-WAVE-GATE-CONSOLIDATION: prune/consolidate the 189-gate roster during the demo re-org.** The
   ~30 demo-CSS source-shape locks (`bezier-*`, `scene-*-rounded`, `stage-*`, `crayon-preserved`,
   `easter-egg`, `pp-logo-svg`) will be invalidated by the demo/app cleanup + scene-switcher
   resurrection. Re-shape them into a smaller cohesive set (or a single manifest-driven layout gate)
   rather than carrying per-pixel locks. NO gate should reference an excised feature after the re-org.

6. **S-WAVE-BENCH-BUDGET: convert load-bearing observe-only benches to budgeted.** The 6 colorTail
   SoA arms + the compositor replace-arm ride observe-only with no floor while `color-soa`/SOTA claims
   depend on them. Use the taxonomy's device-independent ratio form (SoA-vs-boxed at K=8) to give them
   real floors — the SOTA-animation uplift needs measured budgets, not observe-only.

7. **S-WAVE-SIBLING-VERIFY: confirm the Q net-new dispatches (DQ-1, DQ-2) landed** in parse-that
   0.13.0 (packrat re-entrancy try/finally; dead-API/`*Span` delete) — they feed the SOTA-parsing
   lane and were never re-stated in the R ledger.

8. **Handle glass-ui BC/BG as pure HANDOFF (USER-DOMAIN).** `proof:glassui-aria-ask` +
   `proof:peer-satisfied` stay born-RED/observe-only until the owner publishes glass-ui BC/BB; do not
   re-book them as kf work (DM-1/DM-5 already exited via kf-internal contingency KILLs — the BC
   consume for those is severed, correctly).
