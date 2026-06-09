# I.WZ — THE CLOSE (FINAL.md · prompt-recap · the chronic ledger re-verified live · the changeset · the deploy)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** BOOK (the close docs —
  `docs/tranches/I/FINAL.md`) + **USER-DOMAIN** (the stacked I changeset + the deploy — version
  owner **Mike Babb** `mike@babb.dev`, confirm-first) · **Scope (docs + USER-DOMAIN release; NO
  behaviour source):** `docs/tranches/I/FINAL.md` (NEW — the I close report) + the prompt-recap
  reconciliation + the §"Open deferrals" chronic ledger RE-VERIFIED against the now-green
  `proof:live-session` + the `.changeset/` entry (USER-DOMAIN, confirm-first) + the deploy
  disposition (the IMMEDIATE `d469e69` revert tracked below, the I re-deploy) — ZERO `src/**` /
  `test/**` / `.github/**` / `demo/**` behaviour edit. · **DAG: LAST in I** — the close runs after
  every SHIP wave (I.W0–I.W7) lands + green CI; `proof:live-session` is GREEN (a human using the
  product sees it work), `proof:chronic-closure` cites only runtime gates that BIT, and
  `proof:gate-is-runtime` (I.W7 S6) confirms every wave's §Hard gate is interaction-driven.

**Title.** *The honest close. I recovered nine live breakages (B1–B9 + K) underneath the
gate-regime OVERHAUL that re-points every gate's ORACLE at the running product; the close writes
the I FINAL, re-verifies the chronic ledger against the now-green driven session, books the
USER-DOMAIN changeset + deploy, and — the most urgent item in the tranche, tracked here as a NAMED,
owner-tagged action — records the disposition of the `d469e69` deploy-revert that takes (or, per the
user's standing decision, LEAVES) the broken live demo on the air.*

This is the §Mandate's **P-invariant close**: every carry exits with a terminal disposition, no
perpetual punt survives, and inv ε is mechanical — the FINAL may not overclaim, because the close's
own evidence is `proof:live-session` GREEN on a tree where the human battery (PLAY + SWITCH + DRAG)
accumulates the S2a zero-error budget. The catastrophe I exists to end was a FINAL that overclaimed
(97 green gates, broken product); the I FINAL is held to a different oracle — the running product
itself, the same one the overhaul installs.

**Provenance.** `harden-review §5 M-4` (the deploy-revert elevated to an owner-tagged tracked action
with post-revert live verification + the revert-target git-log check) · `PATH-FORWARD.md §4` (the
IMMEDIATE deploy-damage-control recommendation) · `PROGRESS.md §0` (the IMMEDIATE item) ·
`recap-deferred §4f` (the deploy-HANDOFF band — kf AUTHORS the target, deploy WRITES; the revert is
separate from the DEP-1/2/3 handoffs) · `MEMORY project_deploy_cloudflare_pages.md` (keyframes.babb.dev
is Cloudflare Pages, deployed via `deploy-pages.yml` on green-CI `workflow_run`, NOT GitHub Pages) ·
`I.W7.md §S2a` (the structured error-budget allowlist the live verification asserts) · `I.W7.md §S6`
(`proof:gate-is-runtime`, the meta-gate the overhaul installs) · `G.WZ.md` (the close-doc shape: the
FINAL records what LANDED with `file:line` + gate evidence, not an aspirational summary).

---

## §State, verified (not asserted — `git log`/`ls`-confirmed on `tranche-i-dev`)

The load-bearing facts for the close, each re-checked first-hand:

1. **`docs/tranches/I/FINAL.md` does NOT yet exist** — it is the close report this wave authors
   (after the SHIP waves land). The I tranche dir carries `I.md` + `PROGRESS.md` + `PATH-FORWARD.md`
   + `audit/` + `waves/I.W0..I.W7.md` + `waves/I.WZ.md` (this file) but no `FINAL.md`.

2. **The deploy-revert target `d469e69` is VERIFIED — the git-log evidence the harden review (M-4)
   demanded the IMPL produce BEFORE acting:**
   - `d469e69` = `ci(deploy): every green-CI master push deploys — drop the tip-commit path filter`
     (`git log --oneline -1 d469e69`, confirmed).
   - `d469e69` IS an ancestor of `b934a08` (H's tip / I's fork-point) — `git merge-base --is-ancestor
     d469e69 b934a08` → true.
   - **Exactly 20 commits** separate them — `git rev-list --count d469e69..b934a08` → 20 — matching
     `PATH-FORWARD.md §4`'s "20 commits back, pre-H, clean ancestor" claim. The claim is TRUE.
   - **The subtlety the IMPL must hold (do NOT lose this in the revert):** `d469e69` is itself the
     commit that DROPPED the tip-commit path filter — i.e. it is the commit that ENABLED "every
     green-CI master push re-ships the live site." Reverting master to the TREE at `d469e69` restores
     a tree on which that auto-deploy mechanism is already live (the deploy memory confirms
     keyframes.babb.dev rides `deploy-pages.yml`'s green-CI `workflow_run`). So a green-CI push of the
     revert AUTO-RE-SHIPS the known-good demo — the same deploy path that shipped the breakage now
     ships the fix. This is intended, but it means the revert is NOT a no-op on the deploy posture;
     it re-arms the auto-deploy on a known-good tree. Recorded so the IMPL does not assume the revert
     merely "freezes" the live site.

3. **The deploy is USER-DOMAIN, and the user has DEFERRED the revert** — see §The IMMEDIATE item.

---

## §The IMMEDIATE item — the `d469e69` deploy-revert (M-4 · owner-tagged · DEFERRED-BY-USER)

The harden review's M-4 is decisive: the deploy-revert is *"the most urgent item in the tranche and
is independent of all the wave work"* (`PATH-FORWARD.md §4`), yet in the authored docs it sat as a
RECOMMENDATION, not a tracked deliverable with an owner and a verification — "sound advice that could
fall between the wave cracks." This section ELEVATES it to a named, owner-tagged IMMEDIATE action
with its own pre-condition (git-log verification, §State #2 — DONE) and its own post-condition (live
verification against keyframes.babb.dev), AND records its current disposition honestly.

### The action (named, owner-tagged)

| Field | Value |
|---|---|
| **Action ID** | `I-IMMEDIATE-1` (the deploy damage-control revert) |
| **Owner** | Mike Babb (`mike@babb.dev`) — USER-DOMAIN (deploy + master mutation, confirm-first) |
| **Pre-condition (VERIFY BEFORE acting — DONE, §State #2)** | `d469e69` is the right ancestor: the drop-tip-filter commit, ancestor of `b934a08`, 20 commits back, a clean pre-H tree. A WRONG revert target re-ships a DIFFERENT broken state — so the git-log check is mandatory before the `git revert`-style restore. **Verified first-hand; the claim holds.** |
| **The mechanism** | A `git revert`-style restore of master to the `d469e69` TREE (NOT a force-push that rewrites history — the H commits stay in the log; only the live site goes back to good). Green-CI on the restored tree re-fires `deploy-pages.yml`'s `workflow_run` → `wrangler pages deploy` of the known-good `dist/gh-pages/` to keyframes.babb.dev. |
| **Post-condition (LIVE verification — the new bite M-4 demands)** | After the revert deploys, drive `proof:live-session` (I.W7 S2) against the LIVE `https://keyframes.babb.dev` (the deployed edge, not localhost `dist`) and assert the KNOWN-GOOD budget: the structured S2a allowlist holds — `pageerror = 0`, `unhandledrejection = 0`, `console.error = 0`, the bare-`"......"` parse line `= 0`, the promoted ReadPixels/content-visibility warns `= 0` — across PLAY + SWITCH + DRAG. The pre-H tree predates B1–B9, so the live battery should be clean; if it is NOT, the revert target is wrong (re-open the pre-condition). This makes the revert a GATED action, not a hope. |

### The disposition — DEFERRED-BY-USER (a tracked decision, NOT a silent drop)

**The user has elected to LEAVE the deploy** (the standing instruction: leave the deploy as-is). Per
inv ε and the P-invariant, this is recorded as an EXPLICIT, tracked decision — a DEFERRAL by the
version/deploy owner, NOT a finding that fell through the cracks:

- **`I-IMMEDIATE-1` status: DEFERRED-BY-USER.** The revert is NOT executed this tranche on the
  owner's instruction. The action remains fully specified (target verified, mechanism named, live
  verification defined) so that if/when the owner elects to act, it is a single confirm-first step
  with no re-investigation. The broken-product-is-live risk (`PATH-FORWARD.md §4`) is ACKNOWLEDGED
  and OWNED, not mitigated — the owner has weighed it and chosen to leave the live site as-is.
- **Why this is the honest record, not a punt:** the catastrophe I exists to end was a silent
  overclaim. Recording the user's "leave the deploy" as a NAMED deferred decision — with the urgency
  flagged, the target verified, and the verification pre-defined — is the opposite of a silent drop.
  The decision is the user's to make; the close's job is to track it transparently so no future
  reader believes the revert "just didn't happen." It DID get a decision: DEFERRED-BY-USER.
- **This deferral is DISTINCT from the I re-deploy** (the eventual live ship of the I close, §The
  changeset + deploy) and from the `recap-deferred §4f` deploy-HANDOFFs (DEP-1 CNAME, DEP-2 template,
  DEP-3 roster — sibling-owned, kf authors / deploy writes). `I-IMMEDIATE-1` is the damage-control
  revert specifically; it does not gate the wave work and is not part of the changeset.

---

## §The close deliverables (the FINAL · the recap · the ledger · the changeset · the deploy)

- **S1 — `docs/tranches/I/FINAL.md` (the honest close report).** Records what LANDED across I.W0–I.W7
  with `file:line` + gate evidence (the engine value-seam + serialize-from-template, the bind-proof
  `RAFPlayback` + `useRafScene`, the control-surface single authority + unified `EasingEditor`, the
  amiga subject=pivot geometry, the shared drag seam, the composed frame driver + dock consume-edge,
  the icon single-source + title, the specular published-default consume-edge, AND the gate-regime
  overhaul itself). inv ε: the FINAL's correctness claims cite `proof:live-session` GREEN on the
  fixed tree — the running product is the arbiter, never a prior FINAL. NO overclaim: the one thing
  the catastrophe proves is that a FINAL asserting "all gates green, all chronics closed" against a
  proxy oracle is worthless; the I FINAL's evidence is the human battery's zero budget.

- **S2 — the prompt-recap reconciliation (close the A→H→I ledger).** Confirm `recap-prompts` statuses
  every A→H→I request including the I-ask deploy-revert as a discrete prompt-derived action (the M-4
  status gap the harden review noted at §0 criterion-4): the deploy-revert is now `I-IMMEDIATE-1`,
  DEFERRED-BY-USER — a STATUSED prompt-derived action, not an unstatused recommendation.

- **S3 — the §"Open deferrals" chronic ledger, RE-VERIFIED LIVE.** Every row in `PROGRESS.md §4` is
  re-checked against the now-green driven session, NOT a markdown round-trip: each FOLD row's closure
  cites the I runtime gate that BIT born-RED (B1→I.W0, B2→I.W1, B4→I.W2, B3→I.W3, B6/B8→I.W4,
  B9/K→I.W5, B7→I.W6). `proof:chronic-closure` (I.W7 S4) is RE-RUN as the meta-bite — a row citing a
  source-shape gate REDs; a HANDOFF row against an unpublished target REDs — and it is now GREEN
  because the rows cite runtime gates. `proof:gate-is-runtime` (I.W7 S6) is RE-RUN to confirm every
  cited correctness gate is interaction-driven. The two-tier taxonomy is machine-verified, not
  asserted.

- **S4 — the changeset (USER-DOMAIN, confirm-first).** The stacked I version atop `4.1.0` (owner
  Mike Babb). I un-fenced the engine (`src/animation` — the B1/B2/B3 transpositions) so the bump
  reflects engine behaviour changes; the version tier is the owner's call at cut time. The publish
  leg is USER-DOMAIN, confirm-first — HOLD the npm publish until the engine repair is settled and CI
  is green (`PATH-FORWARD.md §4.2`).

- **S5 — the I re-deploy (USER-DOMAIN, confirm-first; DISTINCT from `I-IMMEDIATE-1`).** The next
  intended LIVE ship is the I close — after `proof:live-session` is GREEN on a tree where a human
  using the product sees it work — re-driven through PLAY + SWITCH + DRAG against the deployed
  keyframes.babb.dev with the S2a zero budget. This is the constructive deploy (ship the FIX), as
  opposed to `I-IMMEDIATE-1`'s damage-control revert (take the BREAKAGE off the air). Both are
  USER-DOMAIN, confirm-first; both verify against the LIVE edge with the same S2a allowlist.

## §The meta-gate the overhaul installs (registered at the close)

The close registers the durability mechanisms the overhaul (I.W7) installs, so the chronic-ledger
re-verification leans on machine enforcement, not authorial discipline:

- **`proof:gate-is-runtime` (I.W7 S6) — the meta-gate that makes the gate-ORACLE precept MECHANICALLY
  PRIOR.** It asserts every wave's §Hard correctness gate is interaction-driven (opens a browser AND
  actuates) and wired to the correctness tier; a source-shape / load-rest / proxy §Hard gate FAILS
  it. Born-RED on `b934a08` (H's regime has ≈0 genuinely-behavioral §Hard gates); GREEN at the I
  close. This is the structural answer to the harden review's RED-1 — the precept is enforced by
  machine from t=0 (a charter invariant + this meta-gate), not asserted-backward by the last wave.
  The I FINAL's chronic-ledger re-verification (S3) cites this gate's GREEN as evidence that the
  two-tier taxonomy holds.
- **`proof:chronic-closure` (I.W7 S4) — rewired to police the PRODUCT.** Each cited gate must be a
  runtime gate that BIT; HANDOFF rows may target only a PUBLISHED version; SYSTEM gates must measure
  the user-reported pixel/interaction. The close re-runs it GREEN with the rows citing the I runtime
  gates — the durability keystone, finally policing the product rather than the column's paperwork.

## §Folds (the close's terminal dispositions)

- **The deploy damage-control revert** — `I-IMMEDIATE-1`, owner Mike Babb, target `d469e69`
  (git-log-VERIFIED, §State #2), live-verification DEFINED (S2a budget vs keyframes.babb.dev), status
  **DEFERRED-BY-USER** (the user elected to leave the deploy — a tracked decision, not a silent drop).
- **The I changeset + the I re-deploy** — USER-DOMAIN, confirm-first, owner Mike Babb (S4 + S5);
  HOLD the publish until the engine repair settles + CI green.
- **The deploy-HANDOFFs (DEP-1 CNAME / DEP-2 template / DEP-3 roster, `recap-deferred §4f`)** — kf
  AUTHORS the target, deploy WRITES; DISTINCT from `I-IMMEDIATE-1`. Carried as deploy-HANDOFFs, not I
  behaviour work.
- **The FINAL + recap + chronic-ledger re-verification** — S1/S2/S3; inv ε mechanical (the arbiter is
  `proof:live-session` GREEN, never a prior FINAL).
- **RECORD — the meta-gates the overhaul installs** — `proof:gate-is-runtime` (S6) +
  `proof:chronic-closure` (S4), the two durability keystones; the close cites their GREEN as the
  evidence the blindspot is closed by machine, not by a green-tally claim.

## §Design decisions (trade-offs RESOLVED)

- **The deploy-revert is TRACKED, not executed — RESOLVED.** The user's "leave the deploy" is binding;
  the close's duty is to make that an EXPLICIT, owner-tagged, verification-defined DEFERRAL
  (`I-IMMEDIATE-1`, DEFERRED-BY-USER), so the urgency is on the record and the action is a single
  confirm-first step if the owner elects it — the opposite of the silent drop the harden review (M-4)
  warned against. The catastrophe was a silent overclaim; the cure is a transparent tracked decision.
- **VERIFY the revert target BEFORE acting — RESOLVED (DONE).** `d469e69` is git-log-verified as the
  drop-tip-filter commit, ancestor of `b934a08`, 20 commits back. A wrong target re-ships a different
  broken state; the pre-condition is mandatory and is met. (And the non-obvious consequence — that
  `d469e69` re-arms the auto-deploy on a known-good tree — is recorded in §State #2 so the IMPL does
  not mis-model the revert as a freeze.)
- **The live verification asserts the S2a allowlist, not a bespoke budget — RESOLVED.** Both the
  damage-control revert (`I-IMMEDIATE-1`) and the constructive I re-deploy (S5) verify against the LIVE
  edge with the SAME structured budget defined once in I.W7 S2a — one definition, every verification.
  This is the H-2 discipline applied to the deploy gates too: the budget is one allowlist, not a
  per-action re-statement.
- **inv ε is MECHANICAL at the close — RESOLVED.** The I FINAL's evidence is `proof:live-session`
  GREEN + `proof:chronic-closure` + `proof:gate-is-runtime` GREEN on the fixed tree — the running
  product is the arbiter. No chain-of-trust over a prior FINAL; the catastrophe proves that is
  worthless. The close cannot overclaim because its oracle is the human battery itself.
