# Tranche J — recap-I-session · the lineage recap (Tranche I prompt set + live-session directives → coverage TODAY)

**Lane:** `recap-I-session` (J audit). **Read-only.** **Branch state at audit:** HEAD on
`master` is actually `tranche-i-dev`'s content merged forward — the working checkout is on
branch `master` per env, but `git branch --show-current` = `master`, `git log -1` =
`4072af9` (the WZ-postclose CI-discovery commit). **`master` is 9 commits AHEAD of
`tranche-i-dev`** (the post-close CI work landed on master; `tranche-i-dev` is now BEHIND).
The lane brief's "merged a4b1472" — `a4b1472` IS a real commit object in the tree (`git
cat-file -t a4b1472` → `commit`); the live master tip is `4072af9`.

**Method (inv ε).** Every coverage status below is verified against the TREE TODAY (package.json,
scripts/, git, lockfile), not asserted from the I FINAL. Where the I close claimed something and
the tree contradicts or nuances it, both are recorded. Sources read in full: `I/recap-prompts.md`,
`I/audit/recap-prompts.md` (distinct — the honest A→H→I reckoning), `I/audit/recap-{chronic,deferred,precepts}.md`,
`I/audit/feedback/k-demo-name.md`, `I/I.md`.

---

## (a) THE FULL I PROMPT SET — each with coverage status TODAY

The 2026-06-08 live-feedback session + the standing orchestration directive. Status verified
against the tree on the live master tip.

### A1 — The standing development mandate (verbatim-in-substance A→H, carried into I)

> *FULL audit + Playwright investigation with dev tools; DEEPLY audit the original plan + waves +
> ALL changes; devise a path forward; recapitulate ALL prompts / plans / precepts; NO quick
> solutions, NO workarounds — IDIOMATIC, GESTALT; architectural transpositions for ELEGANCE,
> SIMPLICITY, PERFORMANCE above all; NO LEGACY CODE; delineate chronic + deferred and FOLD them;
> recap ALL prompts + ensure addressed.* (`I/I.md:83-88`, `I/recap-prompts.md:110-117`)

| Status | Evidence |
|---|---|
| **ADDRESSED (I) → RE-ASSERTED VERBATIM for J** | The identical mandate is the J ask (see §d). Tranche I executed it: `audit/recap-*.md` + 8 `rootcause-rc-*.md` + the wave board. This mandate is NOT I-specific — it is the project's standing spine and re-enters J's charter unchanged. |

### A2 — The B1–B9 + K live breakage report (the 2026-06-08 session)

The user drove the live demo and reported nine user-visible breakages + the tab title. Each
mapped to a falsified H claim and recovered in I behind an actuating runtime gate. **Coverage
TODAY (the gate KEY exists in `package.json proof:correctness`):**

| B | Breakage | I wave/commit | Gate (verified in package.json) | Status TODAY |
|---|---|---|---|---|
| **B1** | rainbow group-play `"......"` + `this.transform` crash | I.W0 `107236d` | `proof:engine-no-throw-on-play` ✓ | VERIFY-ONLY (key present; J re-runs) |
| **B2** | DFA `_gen` suspend crash; blank controls | I.W1 `8a40cf4` | `proof:fsm-suspend-resume-live` ✓ | VERIFY-ONLY |
| **B3** | `/amiga` floats / broken | I.W3 `b8659fe` | `proof:amiga-subject-is-pivot` ✓ | VERIFY-ONLY |
| **B4** | `/easing` lost curve/timing editor | I.W2 `e2085c8` | `proof:easing-editor-live` ✓ | VERIFY-ONLY |
| **B5** | keyframes pane "no CSS twin" placeholder | I.W0 (folds B1) | `proof:engine-no-throw-on-play` clause (d) | VERIFY-ONLY |
| **B6** | `/square` drag selects chrome text + no persist | I.W4 `3afd49f` | `proof:drag-gesture` ✓ | VERIFY-ONLY |
| **B7** | specular sheen on glass stages | I.W6 `4103c22` | `proof:specular-absent-at-rest` ✓ | VERIFY-ONLY |
| **B8** | ALL dock animations broken/slow/errored | I.W4+I.W0/I.W6 | `proof:perf-frame-budget` ✓ | VERIFY-ONLY |
| **B9** | dev `ENOENT easing-icon-sm.svg` + 47 source-maps | I.W5 `bea5f27` | `proof:icon-paint-live` ✓ | VERIFY-ONLY |
| **K** | tab title should be just `keyframes.js` | I.W5 `bea5f27` | `proof:icon-paint-live` clause (c) | **VERIFIED in tree:** `demo/app/index.html:14` = `<title>keyframes.js</title>` exactly; `demo/playground/index.html:7` keeps its own `Playground — keyframes.js` (out of scope, correct) |
| **DC-8** | twice-deferred scene-swap dead-CSS — no 4th defer | I.W5 | `proof:icon-paint-live` clause (e) | VERIFY-ONLY (claimed RESTORE, KILL target ∅) |

**All 10 correctness gate keys for B1–B9 are present in `package.json proof:correctness`** (verified:
`engine-no-throw-on-play`, `fsm-suspend-resume-live`, `easing-editor-live`, `amiga-subject-is-pivot`,
`drag-gesture`, `perf-frame-budget`, `icon-paint-live`, `specular-absent-at-rest`, `demo-fonts`,
`live-session`). **J should RE-RUN them, not re-derive** — but note the CI device-independence
caveat below (some were made "CI observe-only" POST-close).

### A3 — The standing orchestration directive (the headline operating posture)

> *Team-lead via parallel workflows; verify EVERY gate LIVE (playwright clicking play, switching
> scenes, dragging — NOT a source-shape check); commit wave-by-wave; NO quick solutions / NO
> workarounds / idiomatic gestalt; maximal parallelism; close the gate-blindspot for good.*
> (`I/I.md:92-96`, `I/recap-prompts.md:25-28`, the I-GATE row `recap-prompts.md:138`)

| Status | Evidence |
|---|---|
| **ADDRESSED (I)** | Maximal-parallel wave board I.W0–I.W7 committed wave-by-wave (`107236d`→`1a708cf`). Gate-blindspot closed via `proof:live-session` + `proof:gate-is-runtime` + the two-tier taxonomy (verified live in `package.json`). |
| **RE-ASSERT for J** | This is the durable operating posture. J's lane structure (32 parallel audit agents) IS the continuation; the "verify every gate LIVE" mandate becomes J's re-verification obligation against the BUILT dist, not a chain-of-trust over the I FINAL. |

### A4 — The durable publish/deploy authorization

> *Pull the latest glass-ui; AUTHORIZE the value.js publish + re-pin + the CF-Pages deploy.*
> (`I/recap-prompts.md:149` DT-2; `I/I.md:425` USER-DOMAIN)

| Status | Evidence |
|---|---|
| **EXECUTED (post-close)** | value.js PUBLISHED `0.11.2` + re-pinned: `package.json:170` `@mkbabb/value.js ^0.11.2`; lockfile resolves `0.11.2`. glass-ui PUBLISHED `~3.9.0`: `package.json:173` `@mkbabb/glass-ui ~3.9.0`; lockfile resolves `3.9.0`. The CF-Pages deploy EXECUTED — `4072af9` "deploy EXECUTED (keyframes.babb.dev live on the fixed build)". |
| **Version owner: Mike Babb** | The library bump off 4.1.0 stays USER-DOMAIN; **tree version is STILL `4.1.0`** (`package.json` `version: 4.1.0`) — the changeset tier was NOT cut. Two changesets present (`.changeset/tranche-h.md`, `.changeset/tranche-i.md`) but UNCONSUMED. **J P1: the version bump is OPEN** (see §c). |

### A5 — The "do not relinquish control until the plan IN TOTALITY" directive

> The user's directive to drive the plan to completion without handing back control prematurely —
> the totality assay (`I/impl/I-TOTALITY-ASSAY` referenced throughout `I/recap-prompts.md`).

| Status | Evidence |
|---|---|
| **ADDRESSED (I), with a POST-CLOSE discovery that proves the directive's value** | The I drive closed the full wave board AND THEN discovered, after the nominal close, that `ci.yml` had been **YAML-INVALID since Tranche H** (`f93e731` "ci.yml was YAML-INVALID, blocking ALL deploys since H"). Because control was NOT relinquished, the drive caught it and fixed it (`ci.yml` now parses OK — verified `yaml.parse()` succeeds). **This is the canonical proof of the directive: the close was NOT actually total until the CI/deploy spine was verified executing.** → J must inherit this: "green paperwork" includes "CI actually runs." |

---

## (b) THE I-BORN PRECEPTS THAT MUST ENTER J's CHARTER VERBATIM

These are charter invariants born in I. Verified LIVE in the tree (the machine enforcers exist).

### P1 — The gate-ORACLE precept (the I headline; charter invariant)

> *A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME
> surface the human uses, with an ERROR BUDGET of 0 across PLAY + SWITCH + DRAG. A gate whose
> oracle is source text / a jsdom unit / a serialized snapshot / a self-captured baseline / a
> design-token number / a paperwork ledger is a HYGIENE gate, not a CORRECTNESS gate, and MUST be
> labeled as such — it may never count toward a correctness or chronic-closure tally.*
> (`I/I.md:157`, `I/audit/recap-precepts.md:301-305`)

**Machine-enforced:** `proof:gate-is-runtime` (key present in `package.json`; in `proof:hygiene`).
**ENTER J VERBATIM.** This is the project's most expensive lesson (97 green gates / broken
product). J must never weaken it.

### P2 — The two-tier `proof:correctness` / `proof:hygiene` taxonomy

> Every wave's GREEN depends on its RUNTIME correctness clause; config/lint/class-shape clauses are
> HYGIENE-tier, strictly CORROBORATING, may NEVER substitute for a red runtime clause.
> (`I/I.md:159`)

**Live in package.json:** `proof:all = proof:correctness && proof:hygiene`. `proof:correctness` =
the 10 actuating gates. `proof:hygiene` = ~90 source-shape/jsdom gates + `gate-is-runtime` +
`chronic-closure` (correctness authority stripped). **ENTER J VERBATIM** — J's new gates inherit it.

### P3 — inv ε re-grounded (verify, do not assert; the oracle measures the PRODUCT)

> A checked-in re-runnable instrument that measures IDLE SOURCE-SHAPE is NOT the same as one that
> proves the PRODUCT works. Every claim needs a re-runnable probe or `file:line`.
> (`I/I.md:137-145`, `I/I.md:153`)

**ENTER J VERBATIM.** J's whole audit IS this precept applied to I's own close (this lane re-verifies
I's claims against the tree, refusing chain-of-trust).

### P4 — Born-RED on the defect tree (every correctness gate must bite)

> A correctness gate must FAIL on the pre-fix tree and PASS only post-fix; the born-RED ceremony
> must attach to PRODUCT behavior, not a proxy. `proof:live-session` is born-RED on `b934a08`,
> green only when I.W0–I.W6 land. (`I/recap-prompts.md:138`, `I/I.md:340`)

**ENTER J VERBATIM.** Any J wave-gate must demonstrate a born-RED witness on a defect tree.

### P5 — The no-vaporware-handoff rule (the chronic-closure meta-invariant, I-repaired)

> A chronic exits ONLY with (a) a passing RUNTIME/INTERACTION SYSTEM gate that BIT born-RED, OR
> (b) a HANDOFF paired with a born-RED kf gate **targeting a PUBLISHED version or a kf-owned
> consume-edge fix — NEVER an unreleased working-tree commit or a future version number.**
> (`I/I.md:160`, `I/audit/recap-chronic.md:398-403`)

**Machine-enforced + self-guarded:** `proof:specular-absent-at-rest.mjs:51-54` actively ASSERTS
`proof:specular-handoff` is DELETED from package.json (verified: the key is GONE; the script reds
if it ever returns). The vaporware-target failure mode (B7's "glass-ui 3.8.0 specular='off'" that
never existed) is now machine-forbidden. **ENTER J VERBATIM.**

### P6 — The CI device-independence boundary (born POST-close — a NEW J precept)

> CI must run device-independently: the live-session/perf gates were made **CI observe-only on the
> THROTTLED/TIMING budget** because cross-OS/CI-runner timing flakes (`196ec2f`, `166aa42`,
> `66855c2`); and `proof:ci-coverage` gained a **YAML-validity clause** to close the parse-time
> gate-blindspot (`c48d577`) after the discovery that `ci.yml` was YAML-invalid for days
> (`f93e731`).

**STATUS:** This boundary was born AFTER `FINAL.md`/`PATH-FORWARD.md` were written (Jun 9 13:19);
it lives only in the WZ-postclose commit chain (`f93e731`→`4072af9`) and the J sibling lane
`wave-I.WZ-postclose.md`. **It is NOT yet a binding charter precept** — it is an ad-hoc set of
"CI observe-only" relaxations. **J MUST formalize it into a charter invariant** (see §c CI-1): a
gate may be CI-observe-only ONLY if its product-correctness oracle still runs locally/in the
live-session, and the relaxation is named + measured — never a silent escape hatch. This is the
exact failure mode the gate-ORACLE precept forbids, re-emerging at the CI layer.

---

## (c) ITEMS MARKED PARTIAL / GATED in I's recap — current status

| Item | I disposition | Status TODAY (verified) |
|---|---|---|
| **DEP-1 / re-deploy the workflow** | GATED → "path bound; execution USER-DOMAIN" (`recap-prompts.md:181`) | **EXECUTED.** `4072af9` "deploy EXECUTED (keyframes.babb.dev live on the fixed build)". The merge `tranche-i-dev → master` happened; master tip carries the fix + CI repair. RESOLVED. |
| **DEP-2 / damage-control revert to `d469e69`** | GATED → SUPERSEDED-BY-FIX-SHIP (record, do NOT execute) | **HELD as SUPERSEDED.** The fix shipped; no revert executed. RECORD. |
| **DEP-3 / hold npm publish until engine whole** | ADDRESSED (engine repaired; publish actionable) | **value.js PUBLISHED 0.11.2 + consumed.** But the kf LIBRARY version is **STILL 4.1.0** in the tree (changeset uncut). **OPEN P1 for J:** the I library surface IS touched (`format.ts`/`group.ts` bugfixes + value.js floor moved) → I is NOT byte-stable vs 4.1.0 → a version bump is OWED. The `.changeset/tranche-i.md` exists but is unconsumed. → J must fold the version-cut + publish (USER-DOMAIN, confirm-first). |
| **B7 specular — `proof:specular-absent-at-rest`** | GATED; PRIMARY oracle = perceptual luminance delta, class-absence is HYGIENE corroborator | **VERIFY-ONLY.** Gate present; verify the perceptual-delta oracle did not silently degrade to class-absence-only. |
| **DT-3 fonts — `proof:demo-fonts`** | GATED (rendered computed font is the oracle) | **PARTIAL/CI-relaxed.** `166aa42` "demo-fonts excludes metric-override Fallback faces" — a CI carve-out was added post-close. J should verify the carve-out is befitting (metric-override fallbacks are legitimately not Plus-Jakarta), not a blind-spot re-open. |
| **CI-on-Linux gate-robustness (scene-control-dfa flake)** | OPEN follow-up (born POST-close, MEMORY note `project_ci_was_dead_and_deploy_creds.md`) | **OPEN.** `feb39c3` reverted a robustness attempt ("the escape-hatch waited on the STALE trigger — no-op under load"); `66855c2` added "CI-aware settle + wait for control-tab trigger". The scene-control-dfa transition-timing flake on CI-Linux is **NOT resolved** — it is parked. → **J MUST FOLD (P1):** a perpetual "CI-observe-only" relaxation violates P-invariant-28; give it a terminal home (fix the timing determinism) or a KILL (named device-class boundary). |
| **`proof:no-route-storm` dangling reference** | I.W7 claimed "the dangling reference removed" (`recap-prompts.md:140`) | **NUANCED — substantially honored.** The KEY is NOT in package.json (never authored — correct). 5 script references REMAIN, but they are: 1 docstring (`proof-timeline-rail-width.mjs:52`) and the rest are CLAUSE LABELS folded INTO `proof-scene-machine-irrefragable.mjs` (`no-route-storm: 0 scene-changing navs…`). The concern was FOLDED into an existing gate, not left dangling to a missing gate. **RECORD** (minor inv-ε nuance, not a P0). |

---

## (d) THE CURRENT J ASK — decomposed into charter requirements

The user's J ask (per the orchestration brief, identical-in-substance to the standing mandate):
**audit + path forward + fold ALL deferrals + recap ALL prompts + NO legacy + architectural
transpositions for elegance/simplicity/performance + TRANCHE DEVELOPMENT ONLY.**

Decomposed into the requirements J's charter MUST satisfy:

| # | J charter requirement | Derived from | The bar |
|---|---|---|---|
| **JR-1** | **Audit I's close against the TREE, not the FINAL** — re-verify every "CLOSED" I claim live; any claimed-closed item not closed in the tree is a P0. | inv ε re-grounded (P3); the I lesson that FINALs lie | This 32-agent audit IS JR-1. The deliverable is the J path-forward. |
| **JR-2** | **Fold ALL deferrals to a terminal home or KILL** (P-invariant-28: no perpetual punts) | A1 mandate + the I deferred/chronic recaps | EVERY carry from I exits J with a disposition. The OPEN ones TODAY: (a) the version bump/publish (P1); (b) the CI-on-Linux flake / CI-observe-only relaxations (P1, P-inv-28 violation if left); (c) the value.js next-slice (VJ-1…VJ-9, sibling-HANDOFF — re-affirm OPEN, ride next re-pin); (d) the engine BOOKs (FB-1/2/3/5, SoA, A7, A9 — measure-first); (e) DC-8 (VERIFY restored); (f) parse-that `(id,offset)` re-key (sibling-HANDOFF). |
| **JR-3** | **Recap ALL prompts + ensure addressed** — the no-drops ledger, now including the I session itself | A1 + A2 | This lane's `promptsRecap` is the I-session contribution; J's full recap must subsume A→I. |
| **JR-4** | **NO legacy** — no deprecated paths, compat shims, dead code, commented-out code, STALE DOCS | A1 mandate | Stale-doc check is NEW-weight for J: `FINAL.md`/`PATH-FORWARD.md` predate the CI-discovery and the executed deploy → they are now PARTIALLY STALE (they say deploy is "path bound / USER-DOMAIN"; it EXECUTED). J must reconcile or the docs lie. Also: the uncut version (docs say USER-DOMAIN-pending; tree still 4.1.0). |
| **JR-5** | **Architectural transpositions for elegance/simplicity/performance** — necessary AND desirable | A1 mandate | J is a development product; transpositions are invited. Candidates surface from the engine-core/periphery + parsing-units J lanes (not this lane's domain) — this lane flags only that the invitation is BINDING, not optional. |
| **JR-6** | **TRANCHE DEVELOPMENT ONLY** — docs only this phase; implementation awaits explicit authorization gated on green CI | A1 mandate + the I dev/impl boundary (`I/I.md:347-357`) | J authors `docs/tranches/J/**`; ZERO source/test/CI edits in development. The impl boundary is exactly D.W0/E.W0/F.W0/G.W1/H/I's. |
| **JR-7** | **Inherit the I-born charter invariants VERBATIM** (P1–P5) + **formalize P6** (CI device-independence) | §b | The gate-ORACLE precept, the two-tier taxonomy, born-RED, the no-vaporware rule, and the NEW CI-device-independence boundary must all be charter text in J, not re-derived. |
| **JR-8** | **The close cannot overclaim (inv ε mechanical)** — J's own FINAL must re-run `proof:live-session` over the BUILT dist and cite probes, not chain-trust I | P3, P4 | J's close gate: `proof:live-session` GREEN on the J tree (re-run, not inherited) + the deployed demo re-driven through PLAY+SWITCH+DRAG with a zero budget. |

---

## VERDICT (no drops)

Every I prompt resolves with a tree-verified status. The B1–B9+K live breakages are each behind a
present, named correctness gate (10/10 keys in `proof:correctness`); the gate-blindspot is
machine-closed (`proof:live-session` + `proof:gate-is-runtime` + the two-tier taxonomy, all live
in `package.json`); the publish/deploy authorization EXECUTED (value.js 0.11.2 + glass-ui 3.9.0
consumed; CF-Pages deployed via `4072af9`). The "do not relinquish control" directive proved its
worth: the post-close drive caught the YAML-invalid `ci.yml` that had silently killed CI/deploy
since H.

**Three items remain OPEN for J to fold (P-invariant-28):** (1) the kf LIBRARY version is still
`4.1.0` with an UNCONSUMED `.changeset/tranche-i.md` — the bump+publish is owed (USER-DOMAIN);
(2) the CI-on-Linux scene-control-dfa timing flake is PARKED behind "CI observe-only" relaxations
that are a perpetual-punt-shaped escape hatch — it needs a terminal fix or a named device-class
KILL; (3) `FINAL.md`/`PATH-FORWARD.md` are now PARTIALLY STALE (they describe the deploy as
"path-bound/pending" when it EXECUTED, and the version as USER-DOMAIN-pending when it is still
uncut) — the no-legacy/no-stale-docs precept requires reconciliation. The five I-born charter
invariants (gate-ORACLE, two-tier taxonomy, born-RED, no-vaporware-handoff, inv ε mechanical)
enter J verbatim; the sixth — the CI device-independence boundary — was born POST-close and J must
FORMALIZE it from an ad-hoc relaxation into a binding precept, lest the gate-blindspot re-open at
the CI layer.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/J/audit/recap-I-session.md`. ZERO source/test/CI/demo edits.
Every coverage status cites a tree anchor verified TODAY: `package.json` (version 4.1.0; value.js
^0.11.2, glass-ui ~3.9.0, parse-that ^0.9.0; the `proof:correctness`/`proof:hygiene` split; the 10
correctness gate keys); the lockfile (value.js 0.11.2, glass-ui 3.9.0); `demo/app/index.html:14`
(title K); `scripts/proof-specular-absent-at-rest.mjs:51-54` (the specular-handoff-is-deleted
self-guard); the git log (`4072af9` deploy-executed, `f93e731` ci.yml-was-invalid, `feb39c3`/
`66855c2` the parked CI flake); `git cat-file -t a4b1472` (merge commit exists). The I claims were
re-verified against the running tree, NOT chain-trusted over the I FINAL.
