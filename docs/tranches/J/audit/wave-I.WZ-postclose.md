# Tranche J audit — LANE: the I.WZ close + the POST-CLOSE tail

**Scope.** The I close (`FINAL.md` §8, `waves/I.WZ.md`, `impl/I-WZ-verify.md`), the two pending
changesets, and the 8-commit post-merge tail (`a4b1472..4072af9`) that NO tranche doc formally
owns. Read-only; verified against `master` tip `4072af9`, clean working tree.

**Headline verdict.** The post-close tail is REAL CI/deploy-hardening work performed AFTER the I
FINAL was written, narrated ONLY in an addendum buried in an IMPL doc (`I-WZ-verify.md`), with NO
wave file, NO FINAL §, NO PROGRESS row owning it. Each commit is individually honest and tight, but
the tail leaves FOUR live consequences J MUST adopt and terminate: (1) **deploy auto-fire is BLOCKED**
by a knowingly-reverted-to-flaky gate (`scene-control-dfa`) whose underlying defect is a REAL PRODUCT
BUG (control-surface projection lags hash-nav under load), not a test artifact; (2) the gates that
actually hard-gate deploy (`scene-control-dfa`, `scene-transition-perf`, `occlusion-gate`) are
**ORPHANED from the I.W7 two-tier taxonomy** — none are in `proof:correctness`/`proof:hygiene`/
`proof:all`, which is exactly why local convergence missed them; (3) the CI-on-Linux observe-only
boundary is applied **AD-HOC across 3 different strategies** with a triplicated `IN_CI` literal, no
single authority; (4) **two `patch` changesets sit unconsumed** and npm is still `4.1.0` — the
release pipeline has never run a single time (CI was dead since H).

---

## §A — The post-merge tail: 8 commits, REAL work, NO tranche-structural home

`git log --oneline a4b1472..master` (all 2026-06-09, all `Mike Babb <mike7400@gmail.com>`):

| commit | what | tree-verified |
|---|---|---|
| `a4b1472` | Merge Tranche I → master | merge present; `master`==`HEAD` (`git rev-list --count master..HEAD`=0) |
| `f93e731` | ci.yml YAML fix — 2 step names quoted (colon-space) | DIFF = exactly 2 lines (`ci.yml:953,985`); the prior unquoted `name:` carried `: ` mid-string → GHA "mapping values are not allowed" parse fail |
| `c48d577` | `proof:ci-coverage` gains a `yaml-valid` clause (clause −1) | `+41` lines; parses all 3 workflows with the real `yaml` parser, regex fallback for the colon-space class (`proof-ci-coverage.mjs:58-98`) |
| `c10e2b4` | occlusion-gate inv δ — easing subject = sweeping hero ball + drop resolved square allowances | `demo-driver.mjs +19`, `occlusion-gate.mjs +14/-6`; `sweepingSubject` flag skips centering; PENDING_OCCLUSION emptied |
| `196ec2f` | perf-frame-budget + scene-transition-perf → CI observe-only on the throttled/timing budget | adds `IN_CI` to both (`proof-perf-frame-budget.mjs:61`, `proof-scene-transition-perf.mjs:79`) |
| `166aa42` | demo-fonts excludes "… Fallback" faces + visual-lock pixel-diff CI observe-only | font exclusion is UNCONDITIONAL (`proof-demo-fonts.mjs:104`, NOT CI-gated); visual-lock `IN_CI` (`:220`) |
| `66855c2` | scene-control-dfa CI-aware settle + `waitForFunction` (slow-runner) | `+20/-1` |
| `feb39c3` | **REVERT** of `66855c2` — escape-hatch waited on STALE trigger (no-op under load) | `+1/-20`; `git diff a4b1472 master -- scripts/proof-scene-control-dfa.mjs` is **EMPTY** → clean revert to the merge baseline (fixed `settleMs=1600`, NO CI awareness) |
| `4072af9` | docs — deploy EXECUTED + CI-was-never-running discovery + CI-on-Linux follow-up | docs-only (`I-WZ-verify.md +44`) |

All 7 changed CI scripts `node --check` clean (verified).

**Finding (a) — this tail needs a formal J.W0 adoption wave [FOLD].** The 7 non-merge commits landed
AFTER `FINAL.md` was committed (`6a0abe9`, pre-merge). The authoritative close does NOT describe
them; only the `4072af9` addendum INSIDE `I-WZ-verify.md` (an IMPL doc, not the FINAL) narrates them,
and it explicitly leaves `scene-control-dfa` **"STILL OPEN"** (`I-WZ-verify.md:344-348`). There is no
wave file, no FINAL §, and no PROGRESS row that OWNS this tail. Per P-invariant-28 (no perpetual
punt), J must adopt it: a **J.W0 adoption wave** that (i) re-states the tail's terminal disposition in
a real wave doc, (ii) closes the OPEN `scene-control-dfa` flake + its underlying product bug (§C),
(iii) folds the orphaned gates into the taxonomy (§D), (iv) dispositions the changeset/publish (§E),
(v) reconciles the deploy story (§F).

---

## §B — The ci.yml YAML fix + the yaml-valid clause (the deepest blindspot)

`f93e731` is the most consequential commit in kf's recent history: `.github/workflows/ci.yml` was
**YAML-INVALID since H.W12** (two unquoted step `name:` values with a `: ` mid-string read by GHA as a
nested mapping). GitHub Actions 0s-rejects the WHOLE workflow at parse time BEFORE any job — so CI
NEVER RAN and `deploy-pages.yml` (gated on `workflow_run.conclusion == 'success'`) NEVER FIRED on any
master push from H's merge (06-07/06-08) until this fix (06-09). H's "green CI" close was a fiction;
the live site was frozen for days.

`proof:ci-coverage` did not catch it because it REGEX-parses the YAML (coverage/version/registry/
concurrency clauses) — it never validated the file would PARSE. This is the precise blindspot class
I.W7 exists to close, and it survived I.W7. `c48d577` adds clause −1 (parse with the real `yaml`
parser, regex fallback) — a correct, idiomatic closure.

**Finding (b1) — the yaml-valid clause depends on an UNRESOLVED `yaml` package [BOOK/VERIFY].**
`npm ls yaml` exits with **ELSPROBLEMS**: top-level `node_modules/yaml` resolves to `yaml@1.10.3`
(deduped from `@unovis/ts`→cosmiconfig), but `vite` declares `yaml@^2.4.2` → marked **invalid**. The
clause does `import("yaml")` (v1 or v2 both expose `parse`, so the clause works today), but it relies
on a transitively-present, version-conflicted dependency with no `package.json` declaration of its
own. If a future dedup removes the top-level `yaml`, the clause silently falls back to the regex
detector (which only catches the ONE unquoted-colon-space class, not arbitrary YAML errors). J should
either (i) add `yaml` as an explicit devDependency, or (ii) accept the regex fallback as the contract
and drop the `import` (KISS). The current state is a latent fragility, not a defect today.

**Finding (b2) — the yaml-valid clause is a CI gate but the close never observed it GREEN IN CI.**
The clause was added on `master` after CI was first repaired; the I-WZ-verify ledger records it run
LOCALLY (exit 0). No CI run of `proof:ci-coverage` post-fix is cited. Low risk (the fix is trivially
correct), but per inv ε the "CI now parses + runs" claim rests on a local probe + the absence of a
0s-fail, not an observed green CI run in the doc. J.W0 should cite the first green CI run.

---

## §C — `scene-control-dfa`: a REAL PRODUCT BUG masquerading as a CI flake [P0]

This is the most important finding in the lane. The revert rationale (`feb39c3`) is explicit:

> "on a hash-nav scene transition the control-surface projection lags the route under load (verified:
> a fresh `goto /spring` renders `trigger='Spring'` fine; the `cube→spring` hash-nav leaves it
> null/stale until the FSM settles). It passes on a fast/unloaded machine ... fails under load + on
> the slow CI runner."

This is NOT merely a slow-runner test-timing artifact. It is a **runtime correctness defect in the
scene/control-surface FSM**: a hash-nav transition between scenes leaves the destination scene's
control-surface trigger `null/stale` until the FSM settles — i.e. for a window after navigation, the
rendered control surface does not match the route. On a real loaded device a user CAN observe this
(the control panel briefly empty/wrong after a dock switch). The `scene-control-dfa` gate is doing
EXACTLY its job: it caught a real product lag. The reverted "fix" (`66855c2`) was a buggy
escape-hatch (`waitForFunction(trigger present)` returns immediately on the SOURCE scene's stale
trigger) that would have MASKED the bug. The revert correctly removed the mask — but it also removed
any CI accommodation, so the gate is now FLAKY in CI (passes fast/unloaded, fails under load) AND the
underlying product lag is **LIVE and unfixed**.

**Disposition [FOLD — J.W0, P0].** Two distinct work items, both must land:
1. **Product fix** — the control-surface projection must settle synchronously with (or be
   render-suppressed until) the hash-nav transition completes, so the destination trigger is never
   `null/stale` after a `cube→spring`-class nav. This is engine/FSM work, the I.W2 single-authority
   seam (`selectedControlSurfaceFor`) is the likely site. The FINAL's I.W2 §"single authority" claim
   is partially undercut by this: the surface is single-sourced but the source LAGS the route.
2. **Gate fix** — a per-EXPECTED-trigger settle wait (`waitForFunction` keyed on the DESTINATION
   trigger label, not "any trigger present"), so the gate is deterministic under load without
   relaxing its oracle. `I-WZ-verify.md:344-348` already prescribes this ("a per-expected-state
   settle wait (not a fixed `settleMs`)").

Until BOTH land, `demo-smoke` is flaky → the `ci` workflow conclusion is non-deterministic →
auto-deploy is non-deterministic (see §F). This is the single biggest blocker to a functioning
auto-deploy.

---

## §D — The CI-on-Linux observe-only boundary: AD-HOC, not consistent [P1]

**Finding (c1) — three different strategies for the same "device-dependent in CI" problem, with a
triplicated `IN_CI` literal.** `grep -rn 'process.env.CI|GITHUB_ACTIONS|IN_CI' scripts/` returns
exactly 3 files, each redefining the SAME predicate locally:

| script | line | strategy |
|---|---|---|
| `proof-perf-frame-budget.mjs` | `:61` `const IN_CI = !!(process.env.CI \|\| process.env.GITHUB_ACTIONS)` | hard→observe downgrade of the throttled budget |
| `proof-scene-transition-perf.mjs` | `:79` (same literal) | hard→observe downgrade of the p95 budget |
| `proof-visual-lock.mjs` | `:220` (same literal) | hard→observe downgrade of the pixel diff |

But the OTHER two CI-environment reconciliations from the same tail use DIFFERENT mechanisms:
- `proof-demo-fonts.mjs:104` excludes the "… Fallback" faces **UNCONDITIONALLY** (`/Fallback/i`
  filter) — NOT gated on `IN_CI`. This masks the Fallback-face error EVERYWHERE, including on-device,
  not just in CI. Arguably correct (the Fallback faces are metric-overrides whose `local()` source is
  inherently host-dependent), but it is a DIFFERENT boundary discipline than the `IN_CI` downgrade.
- `occlusion-gate.mjs` (c10e2b4) reconciled by REDESIGNING the oracle (sweepingSubject flag), not by
  a CI branch — the right call, but again a third pattern.

There is no shared `IN_CI` helper, no `scripts/lib/ci-env.mjs`, no single definition of "what
observe-only means." The principled boundary the commit messages cite ("CI enforces device-INDEPENDENT
correctness; device-DEPENDENT measurements hard-gate on-device, observe-only in CI") is SOUND and
worth codifying — but it is currently asserted per-gate, three times, with no enforcement that it is
applied consistently. **Disposition [FOLD — J.W0, P1]:** extract one `IN_CI` + `observe(label)` helper
into `scripts/lib/`, route all observe-only gates through it, and add a hygiene clause that asserts
every device-dependent gate declares its tier (hard-on-device / observe-in-CI) via that single seam.

**Finding (c2) — `proof:lighthouse-mobile` is the prior-art for this pattern but is fully CI-EXCLUDED
(not observe-only).** It sits in `proof-ci-coverage.mjs` EXCLUDED set. The tail's commits repeatedly
analogize the new observe-only gates to it ("the same environment-sensitive class as
proof:lighthouse-mobile"). J should decide ONE policy: device-dependent gates are EITHER CI-excluded
(like lighthouse) OR CI-observe-only (like the new three) — not a mix decided ad-hoc.

---

## §E — The taxonomy ORPHAN: the gates that block deploy are not in proof:all [P0]

**Finding (d) — the gates that actually hard-gate CI/deploy are NOT in the I.W7 two-tier taxonomy.**
`proof:all = proof:correctness && proof:hygiene` (`package.json`). Verified membership:

| gate | in `proof:correctness`? | in `proof:hygiene`? | hard-gates `demo-smoke`? |
|---|---|---|---|
| `proof:scene-control-dfa` | NO | NO | YES (`ci.yml:322`) |
| `proof:scene-transition-perf` | NO | NO | YES (`ci.yml:338`) |
| `occlusion-gate` (not even a `proof:*` script) | NO | NO | YES (`ci.yml:218`, `node scripts/occlusion-gate.mjs`) |
| `demo-smoke.mjs` | NO | NO | YES (`ci.yml:216`) |
| `lighthouse-gate.mjs` | NO | NO | YES (`ci.yml:471`) |

`c10e2b4` itself states the consequence: *"It is a demo-smoke gate, NOT in proof:all, so the local
convergence missed it (a coverage seam worth noting)."* This is the SAME class of blindspot I.W7
existed to close, re-occurring at the aggregator level: a developer running `npm run proof:all`
locally does NOT exercise the gates that block CI/deploy, so the post-close tail's 8 issues
(`I-WZ-verify.md:286-300`) were discovered only when CI finally ran. The two-tier taxonomy is
INCOMPLETE: it covers the 10 correctness + the hygiene set, but the `demo-smoke` job runs ~50 more
gates directly that no aggregator references. **Disposition [FOLD — J.W0, P0]:** either (i) fold every
demo-smoke gate into `proof:correctness`/`proof:hygiene` so `proof:all` IS the CI contract, or (ii)
add a hygiene clause that asserts `demo-smoke`'s gate roster ≡ the aggregator membership (no gate
hard-gates CI without being in a named tier). The I.WZ "run the whole suite each wave" process-gap
(`I-WZ-verify.md:285`) is a SYMPTOM of this; the cure is making `proof:all` ≡ the CI roster.

---

## §F — The deploy blocking chain + the changeset/publish state

**Finding (e) — the auto-deploy blocking chain, verified exactly.** `deploy-pages.yml:42-46`:
auto-deploy fires iff `workflow_run.conclusion == 'success' && head_branch == 'master' && event ==
'push'` of the `ci` workflow. The `ci` workflow has TWO jobs: `gates` (library) and `demo-smoke`
(`ci.yml:48,188`). `demo-smoke` has **NO `needs:`** (runs parallel to `gates`) and **NO
`continue-on-error`** (verified: zero `continue-on-error` in ci.yml) — so a `demo-smoke` failure makes
the `ci` workflow conclusion `failure`, which blocks deploy-pages. The chain is:

```
scene-control-dfa flake (LIVE, §C) ──▶ demo-smoke FAILS under load ──▶ ci conclusion=failure
   ──▶ deploy-pages.yml workflow_run gate is false ──▶ auto-deploy NEVER FIRES
```

So even with ci.yml now PARSING (`f93e731`), the auto-deploy is STILL effectively blocked by the
flaky `scene-control-dfa` in demo-smoke. The 06-09 deploy was a **MANUAL `wrangler pages deploy`
bypass** (`I-WZ-verify.md:308-314`), not an auto-deploy. The dist evidence corroborates: local
`dist/gh-pages/assets/index-DuJm1C6k.js` is byte-identical to the claimed live build.

**Finding (f) — the kf-owned deploy story EXISTS but the manual bypass used SIBLING creds.**
`deploy-pages.yml:66-67` consumes `secrets.CLOUDFLARE_API_TOKEN` + `secrets.CLOUDFLARE_ACCOUNT_ID`
(GH repo secrets) and runs `scripts/pages-deploy.sh` — a real, kf-owned, constellation-spine deploy
recipe (pre-flight project check, rollback-target capture, ASCII commit-message sanitisation). So the
kf-owned story is COMPLETE in-workflow. The MEMORY note (`project_ci_was_dead_and_deploy_creds.md`)
says the manual bypass pulled creds from a SIBLING repo's `.env` (`fourier-analysis/.env`, account
`07119f…`) — because the GH-secrets auto-path was blocked by dead CI. This is acceptable as a
one-time emergency, but J should VERIFY the GH repo secrets (`CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`) are actually configured and point at the SAME CF account as the sibling
`.env`, so the auto-path works once §C unblocks demo-smoke. **[VERIFY-ONLY — J.W0]:** I cannot read GH
secrets from the tree; J must confirm they exist and match. If they do, the kf-owned story is whole
and no sibling-`.env` dependency remains.

**Finding (g) — the changeset/publish: two `patch` changesets, npm still 4.1.0, release pipeline
NEVER RUN [P1].** `package.json` version = `4.1.0` (verified). BOTH `.changeset/tranche-h.md` AND
`.changeset/tranche-i.md` are present and BOTH declare `"@mkbabb/keyframes.js": patch`. Changesets
COALESCE same-type bumps: `4.1.0` + (patch + patch) → a SINGLE `4.1.1`, not 4.1.2. But `tranche-i.md`
itself notes the version owner "may elect to ship this as a `minor` instead of a `patch`" because the
value.js floor moved `^0.11.1 → ^0.11.2` (a dependency-floor change is arguably minor-worthy). So the
SemVer tier is genuinely undecided and is USER-DOMAIN (owner Mike Babb, confirm-first). Critically:
`release.yml` triggers on `push: tags: v*.*.*` (`release.yml:20-23`) — INDEPENDENT of the dead `ci`
workflow, so the publish leg was never blocked by the YAML breakage — BUT it has also **never run a
single time** (no tag pushed; npm still 4.1.0). The release pipeline re-runs `check:lib → build:lib →
test → proof:boundary` then `npm publish --provenance` — note it does NOT run the new
`proof:correctness` suite, only the library-scoped boundary gate. **Disposition [FOLD/RECORD —
J.W0]:** J must (i) get the owner's SemVer decision (patch→4.1.1 vs minor→4.2.0), (ii) consume BOTH
changesets in one `changeset version` (H's patch is subsumed since H never published), (iii) decide
whether `release.yml` should ALSO gate on `proof:correctness` (currently it ships the library without
the runtime suite — defensible since the library surface is glass-ui-free, but worth a recorded
decision).

---

## §G — inv ε violations: the close docs contradict each other on the deploy disposition [P2]

**Finding (h) — `waves/I.WZ.md` (the DEV spec) is now STALE against its own FINAL.** The spec file
disposes the `d469e69` damage-control revert as **`DEFERRED-BY-USER`** (`I.WZ.md:90,96,174` — "the
user elected to leave the deploy... the broken-product-is-live risk is ACKNOWLEDGED and OWNED, not
mitigated"). But `FINAL.md:244` + `I-WZ-verify.md:272` + the `tranche-i.md:69` changeset all dispose
it as **`SUPERSEDED-BY-FIX-SHIP`** (the fix shipped, no revert needed). These are CONTRADICTORY
narratives: one says the broken demo was LEFT live on the user's instruction; the other says the fix
SHIPPED and superseded the revert. The tree evidence (dist `index-DuJm1C6k.js` deployed, title
`keyframes.js`) confirms `SUPERSEDED-BY-FIX-SHIP` is the TRUE outcome — the FINAL supersedes the DEV
spec. This is a benign inv-ε drift (the spec is a frozen DEV-phase artifact, the FINAL is
authoritative), NOT an overclaim. But per the NO-legacy / NO-stale-docs precept, the `I.WZ.md` spec
now carries a disposition its own FINAL overrode. **Disposition [RECORD — J should note]:** the FINAL
is authoritative; J.W0 should add a one-line reconciliation note (or J's PROGRESS should record that
`I.WZ.md`'s `DEFERRED-BY-USER` was superseded), so a future reader does not believe the broken demo
was knowingly left live. This is the kind of two-narrative drift the I tranche was founded to forbid;
it is minor here only because the tree disambiguates.

**Finding (i) — `PROGRESS.md §0` still carries the obsolete "execute the d469e69 revert" IMMEDIATE
recommendation.** `FINAL.md:246-252` itself acknowledges this: PROGRESS is a frozen DEV board still
recommending the revert that the IMPL drive made obsolete. The FINAL declares itself the supersession.
This is internally disclosed (not a hidden overclaim) but is exactly a stale-doc the NO-legacy precept
targets. [RECORD — historical; the FINAL's disclosure is sufficient, J need only not re-propagate it.]

---

## §H — Disposition summary for J

| item | sev | disposition |
|---|---|---|
| Post-close tail has no tranche home | P1 | FOLD → J.W0 adoption wave |
| `scene-control-dfa` = live product bug (control-surface lags hash-nav under load) + flaky gate | P0 | FOLD → J.W0 (product fix + per-expected-trigger gate fix) |
| Deploy-block gates orphaned from `proof:all` taxonomy | P0 | FOLD → J.W0 (make `proof:all` ≡ CI roster) |
| `IN_CI` observe-only is ad-hoc / triplicated literal / 3 strategies | P1 | FOLD → J.W0 (single `IN_CI` helper + tier-declaration hygiene clause) |
| Changesets: 2× patch unconsumed, npm 4.1.0, SemVer undecided | P1 | FOLD (USER-DOMAIN SemVer) → J.W0 |
| `release.yml` never run; doesn't gate on `proof:correctness` | P2 | RECORD + decide in J.W0 |
| Auto-deploy blocked chain (scene-control-dfa→demo-smoke→ci→deploy) | P0 | FOLD (closes when §C lands) |
| kf-owned deploy creds vs sibling-`.env` bypass | P1 | VERIFY-ONLY → J confirms GH secrets exist/match |
| `yaml` package unresolved (ELSPROBLEMS) under yaml-valid clause | P2 | BOOK/VERIFY → declare devDep or accept regex fallback |
| `I.WZ.md` spec `DEFERRED-BY-USER` vs FINAL `SUPERSEDED-BY-FIX-SHIP` | P2 | RECORD (FINAL authoritative; tree confirms) |
| `PROGRESS.md §0` stale revert recommendation | P2 | RECORD (FINAL discloses; do not re-propagate) |
