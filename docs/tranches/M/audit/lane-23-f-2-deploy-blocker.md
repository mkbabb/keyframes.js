# Lane 23 — F-2 deploy blocker (the full causal chain)

**Lane:** 23 · **Tranche:** M (seed audit) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `529fcfd` — the WZ close commit)
**Subject:** The precise deploy-blocker chain from `proof:peer-satisfied` RED to
`deploy-pages.yml` not firing. Every link verified against source.

**Relationship to lane-21:** lane-21 audits the five glass-ui BB asks as an EXTERNAL-ACTOR
dispatch (what BB must publish, what kf owns on consume, M-wave proposals). Lane-23 is
the CAUSAL-CHAIN audit: what exactly makes the L close not deploy, link by link, with
the exact version condition that unblocks it and the interplay with the 5.0.0 cut.

**Gates re-run this lane (all node-static):**
- `node scripts/proof-peer-satisfied.mjs` → exit 1, FAIL (re-run; authoritative) — verified
- `npm show @mkbabb/glass-ui version` → `4.0.0` (latest), `@mkbabb/glass-ui@4.1.0` E404 — verified
- `npm show @mkbabb/glass-ui@4.0.0 peerDependencies --json` → `"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` — verified
- `node_modules/@mkbabb/value.js/package.json` → `version: 0.13.0` — verified
- `node_modules/@mkbabb/glass-ui/package.json` → `version: 4.0.0` — verified

---

## §0 — Verdict (read first)

**The L close DID NOT DEPLOY.** The causal chain has two stacked conditions:

1. **tranche-l-dev is not merged into master** — `git merge-base --is-ancestor tranche-l-dev master`
   returns false; the `deploy-pages.yml` trigger requires a master push with a green CI run,
   so no deploy can fire from a branch that has not been merged. This is the OUTER condition.

2. **`proof:peer-satisfied` RED makes master CI fail** — even if tranche-l-dev were merged
   today, the `demo-smoke` CI job would fail (its `check-failures` step includes
   `proof-peer-satisfied`'s exit-1 outcome), which makes the overall `ci` workflow conclude
   `'failure'`, and `deploy-pages.yml` only fires on `conclusion == 'success'`. This is the
   INNER condition.

Both conditions resolve to the SAME root cause: glass-ui 4.0.0 declares
`"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` — a range that REJECTS the installed
`0.13.0` — and no glass-ui version with the widened range is published.

**The exact unblocking condition:** glass-ui BB publishes a cut (a 4.0.x patch or 4.1.0)
with the widened `@mkbabb/value.js` peer range (`^0.13.0` at minimum; the dispatch asks for
`^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0` or wider). kf re-pins to that cut in one
atomic commit. `proof:peer-satisfied` exits 0. tranche-l-dev is merged to master (or the
re-pin commit lands on master). CI runs GREEN. `deploy-pages.yml` fires. Live site updates.

**Is this an M wave or a pure-wait HANDOFF?** The re-pin commit is M's kf-side work — it is
identified as M-wave A in lane-21 (the `glass-ui BB re-pin commit, the UNLOCK commit`). But
the triggering event is an EXTERNAL publish (glass-ui BB). M does not own the publish; M owns
the consume. The classification is: **M wave (kf-side re-pin + workaround deletion) gated on
a HANDOFF (glass-ui BB publish)**. The HANDOFF is the blocking condition; the M wave is
short (one atomic commit + proof gate runs) and executes the instant the HANDOFF fires.

**5.0.0 interplay:** the site deploy (keyframes.babb.dev via deploy-pages.yml) and the npm
registry publish (release.yml on a v*.*.* tag) are **INDEPENDENT**. `proof:peer-satisfied`
is `continue-on-error: true` in release.yml — a RED peer-satisfied does NOT block `npm
publish`. So 5.0.0 CAN be published to npm while the site deploy is blocked. However, the
FINAL recommends cutting 5.0.0 as part of the close sequence (§S6), so in practice the
version cut + npm publish are coordinated with the re-pin and master merge.

---

## §1 — The causal chain, link by link

### §1.1 Link 1 — the peer-range mismatch (the root cause)

**Source of truth (re-verified against the registry and the installed manifests):**

`node_modules/@mkbabb/glass-ui/package.json` (installed 4.0.0):
```json
"peerDependencies": {
  "@mkbabb/value.js": "^0.10.0 || ^0.11.0"
}
```

`node_modules/@mkbabb/value.js/package.json` (installed 0.13.0):
```json
{ "version": "0.13.0" }
```

Semver evaluation: `^0.10.0` admits `>=0.10.0 <0.11.0`; `^0.11.0` admits `>=0.11.0 <0.12.0`
(npm caret semantics on 0.x.y pin the MINOR). `0.13.0` falls in neither range.
ELSPROBLEMS on any install of both `@mkbabb/glass-ui@4.0.0` and
`@mkbabb/value.js@0.13.0`. This is not a CI artifact — it is a live consumer-facing
defect on the published surface today.

**The gate:** `scripts/proof-peer-satisfied.mjs:144-180` reads the installed glass-ui peer
map, iterates every `@mkbabb/*` peer, resolves the installed version, and calls
`semver.satisfies`. For `@mkbabb/value.js@"^0.10.0 || ^0.11.0"` vs `0.13.0` it calls
`failures.push(...)` and exits 1. The exit-1 is the born-RED signal. `proof:peer-satisfied`
is not in `proof:all` (`package.json` scripts: `proof:all` = `proof:correctness && proof:hygiene`;
grep confirms `peer-satisfied` absent from both). It lives in `proof:all:demo`
(`package.json:175`: `npm run proof:demo-smoke && npm run proof:occlusion && npm run proof:peer-satisfied`).

### §1.2 Link 2 — CI demo-smoke job (how exit-1 propagates to job failure)

`ci.yml` has two jobs: `gates` (library-scoped, glass-ui-free) and `demo-smoke` (the demo
arm that installs glass-ui and runs browser proofs).

In `demo-smoke`, `proof:peer-satisfied` runs with `continue-on-error: true`
(`ci.yml:357-358`):
```yaml
- name: "[born-RED tripwire] proof:peer-satisfied ..."
  id: proof-peer-satisfied
  continue-on-error: true
  run: npm run proof:peer-satisfied
```

`continue-on-error: true` means the job does not ABORT on this step's failure — subsequent
steps still run (the report-all posture). BUT the `check-failures` step at the end of the
job (`ci.yml:1575-1689`) collects every step's `outcome` and exits 1 if ANY is `failure`:

```yaml
- name: "check-failures (L.W4 S1 — report-all: ...)"
  if: always()
  run: |
    failed=""
    if [ "${{ steps.proof-peer-satisfied.outcome }}" = "failure" ]; then
      failed="$failed proof-peer-satisfied"
    fi
    # ... [~80 more steps] ...
    if [ -n "$failed" ]; then
      echo "demo-smoke REPORT-ALL — these proof:* steps FAILED ..."
      exit 1
    fi
```

`ci.yml:1575-1576` explicitly annotates: "proof:peer-satisfied is INCLUDED: its born-RED F-2
state is a live defect the job SHOULD surface." So the design is intentional: the RED is
visible as a named failure annotation on every CI run until the fix ships.

**Result:** the `demo-smoke` job exits with conclusion `failure` due to
`check-failures → exit 1`.

### §1.3 Link 3 — CI workflow conclusion

`deploy-pages.yml` triggers on:
```yaml
on:
  workflow_run:
    workflows: ["ci"]
    types: [completed]
```

With condition:
```yaml
if: >-
  github.event_name == 'workflow_dispatch' ||
  (github.event.workflow_run.conclusion == 'success' &&
   github.event.workflow_run.head_branch == 'master' &&
   github.event.workflow_run.event == 'push')
```

GitHub Actions workflow conclusion: a workflow concludes `'failure'` if ANY job in it fails
(the default behavior; no `continue-on-error` at the job level is present here). The `gates`
job PASSES; the `demo-smoke` job FAILS (link 2). Therefore the `ci` workflow concludes
`'failure'`. The `deploy-pages.yml` `if` condition evaluates to false. The deploy job does
not run.

### §1.4 Link 4 — the outer condition (tranche-l-dev not merged)

Even with the above, there is a prior precondition: `deploy-pages.yml` only triggers on a
MASTER PUSH. tranche-l-dev has not been merged into master (verified: `git merge-base
--is-ancestor tranche-l-dev master` returns false; `git log master --oneline | head -3`
shows tip `9bbc227` = the K-close tip).

The FINAL §S6 explicitly sequences the close-merge AFTER proof:peer-satisfied going GREEN:

> "Only then does the close merge to master carry a green CI → `deploy-pages.yml`
> auto-fire → live `keyframes.babb.dev` serving the new `index-*.js`."

So the outer and inner conditions are intentionally correlated: kf does not merge to master
while the tripwire is RED, because the master CI would fail anyway. The re-pin commit (M-wave
A) either lands on `tranche-l-dev` before the merge, or on a `tranche-m-dev` branch that
also merges to master. Either way the master push that triggers the deploy must carry the
re-pin.

---

## §2 — The exact unblocking condition

**Minimum glass-ui change required:** widen the `@mkbabb/value.js` peer range to admit
`0.13.0`. The minimum sufficient range addition is `|| ^0.13.0`. The dispatch
(`KF-TO-GLASSUI-BB-ASKS.md §3`) asks for:
```json
"@mkbabb/value.js": "^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0"
```
or a range that captures `>=0.10.0 <0.15.0` once the O-tranche (`0.14.0`) cadence is
confirmed. The range-widen is a manifest-only change in glass-ui — no source behavior
changes.

**Minimum kf change required (M-wave A):** bump `optionalDependencies["@mkbabb/glass-ui"]`
from `~4.0.0` to the fixed-peer cut. Depending on whether BB ships the peer-widen in a
4.0.x patch or 4.1.0:
- **4.0.x patch:** `~4.0.0` admits any `4.0.*` already (tilde on a minor admits all patches);
  no manifest change needed in kf for the peer-widen alone — just run `npm install` to get
  the patch. `proof:peer-satisfied` turns GREEN. The S1/S2 workaround deletions (lane-21 §2)
  wait for 4.1.0.
- **4.1.0:** bump kf pin to `~4.1.0`. Simultaneously delete the S1 `:aria-orientation`
  suppress lines and the S2 `pointerHandled`/`onPlayPointerDown` interim in the same atomic
  commit. `proof:peer-satisfied` → GREEN, `proof:workaround-deletion` S1+S2 → GREEN.

**The gate sequence on the re-pin commit:**
1. `node scripts/proof-peer-satisfied.mjs` → exit 0 (the deploy blocker clears)
2. `node scripts/proof-workaround-deletion.mjs` → S1 + S2 GREEN (if 4.1.0)
3. `npm run proof:all` → full local roster GREEN
4. Merge to master → `ci` workflow runs → `gates` PASS + `demo-smoke` PASS
5. CI conclusion = `'success'`
6. `deploy-pages.yml` fires → CF Pages builds + deploys → `keyframes.babb.dev` live

---

## §3 — M wave vs pure-wait HANDOFF classification

The deploy blocker is a two-part structure:

| Part | Owner | Classification |
|---|---|---|
| glass-ui BB widens `@mkbabb/value.js` peer range | glass-ui BB (external) | PURE-WAIT HANDOFF — kf cannot write glass-ui source (inv-16) |
| kf re-pins + deletes workarounds (M-wave A) | kf (M tranche) | M WAVE — short atomic commit, executes on BB publish |

The M wave is short by design: one `package.json` line bump + two/three workaround
deletions + gate runs. It is not a new feature wave — it is the consume side of the HANDOFF.
Lane-21 §5 names it "M-Wave A — the glass-ui BB re-pin commit (the UNLOCK commit)."

**Classification verdict: M WAVE gated on HANDOFF.** The Tranche M charter must include the
re-pin commit as an early Band-B consume wave. It is the de-facto M.W0 or M.W1 depending on
timing. If glass-ui BB ships before M opens formally, the re-pin may land before the M wave
plan is authored — but it STILL belongs to M's consume budget and must be gate-tracked.

---

## §4 — The 5.0.0 user-domain finale interplay

The FINAL §S6 recommends cutting `5.0.0` (not `4.4.0`) based on three breaking-surface
changes from L: (1) compile output is now different for `@property`/per-stop-composition/
scroll and refuses multi-color tracks that previously shipped silently-lossy; (2) three
breaking type renames (`Animation`→`KeyframesAnimation`, `ScrollTimeline`, `ScrollTimelineOptions`);
(3) the package graph adds `@mkbabb/keyframes-vue`. These are USER-DOMAIN decisions (Mike
Babb confirms the version string and runs `changeset version` + `npm publish`).

**The site deploy and the npm publish are INDEPENDENT gates:**

| Action | Trigger | `proof:peer-satisfied` role |
|---|---|---|
| npm publish (release.yml) | `git push v*.*.*` tag | `continue-on-error: true` — RED is RECORDED, does NOT block publish |
| Site deploy (deploy-pages.yml) | green-CI master push | RED makes demo-smoke fail → CI fails → deploy does NOT fire |

This means **5.0.0 CAN be published to npm while the site deploy is blocked.** The
published npm package (5.0.0) and the live demo (keyframes.babb.dev) can diverge
temporarily. The FINAL's preferred sequence avoids this by performing the re-pin + version
cut + merge + deploy in one coordinated pass, but there is no technical enforcement — a user
who publishes 5.0.0 before glass-ui BB ships will have a published package but a stale demo.

The `proof:keyframes-vue-published` gate (`ci.yml:362-374` — also `continue-on-error: true`
in demo-smoke, also in `check-failures`) means publishing 5.0.0 alone does NOT clear the
demo-smoke failure if keyframes-vue is still absent. The check-failures step would report
BOTH `proof-peer-satisfied` AND `proof-keyframes-vue-published` as failures. The user must
also publish `@mkbabb/keyframes-vue` (USER-DOMAIN; `packages/keyframes-vue/`) for the
demo-smoke job to fully pass (or the gate must be moved out of check-failures — but that
would hide the live defect, which is the precept violation the gate exists to surface).

---

## §5 — Precept findings

### §5.1 No-workaround precept (live violations, correctly STAGED)

The S1 (`:aria-orientation="undefined"`) and S2 (`pointerHandled`/`onPlayPointerDown`)
workarounds are precept violations today — they patch glass-ui defects at the kf consume
seam, which inv-16 (`kf writes only its repo`) and the no-workaround precept forbid. They
are correctly STAGED (PENDING, not bare RED) by the three-state gate model. The workarounds
exist because deleting them before the sibling fix publishes would break the demo. This is
the correct posture: the precept names the VIOLATION, the gate names the EXIT condition,
the PENDING state is the minimum hold. No workaround loop — each has a named tripwire.

**The RF-17 interim (S2) has chronicity 3** (I, J, K → L). P-invariant-28 bars a 4th-tranche
carry: `deferred-ledger-L.md §DLL-19` records "no interim carries to a 4th tranche under
no-workaround; P-inv-28 exit-shaped." M cannot carry S2 to M.WZ without a terminal
disposition from glass-ui BB. If glass-ui 4.1.0 is not published by M.WZ, M must record
either a forced KILL or — if the kf owner IS the glass-ui owner — author the fix directly
in glass-ui. The inv-16 fence is only absolute if the two repos have separate owners.

### §5.2 No overclaim on the local proof:all green

The FINAL §S6 step 1 claims "the three roster reds CURED" and the roster is now green. This
is the LOCAL `npm run proof:all` result — `proof:all = proof:correctness && proof:hygiene`,
neither of which includes `proof:peer-satisfied`. The local proof:all CAN be green while CI
is red. This is by design (the born-RED tripwire is not a `proof:all` member) and is
correctly framed in the FINAL ("not part of proof:all" — `FINAL.md §S6 step 1`). The
distinction between local proof:all GREEN and CI conclusion GREEN must be held clearly: the
L close claims the former, not the latter.

### §5.3 No-workaround bars the `npm overrides` escape

`KF-TO-GLASSUI-BB-ASKS.md §3` and `completion-lanes-32-36.txt §Lane 36 ⚠` both explicitly
forbid papering the F-2 peer-cycle with an npm `overrides` block or
`peerDependenciesMeta: { "@mkbabb/value.js": { "optional": true } }` in kf's
`package.json`. This would silence the ELSPROBLEMS for kf's own install but would not cure
the consumer-facing defect and would mask the tripwire. The correct fix is glass-ui's peer
range. The gate (`proof:peer-satisfied`) would need to be updated to detect the override, or
would silently green — which is the workaround shape the no-workaround precept forbids.

---

## §6 — Deferred folds for M

| Item | Chronicity at M entry | Exit form in M | Born-RED gate | Owner |
|---|---|---|---|---|
| F-2 peer-cycle / DLL-24 | 2 (K, L) → M is 3rd | re-pin on BB peer-widen → `proof:peer-satisfied` GREEN → FOLD | `proof:peer-satisfied` exit 1 | glass-ui BB (HANDOFF) |
| S1 aria suppress / DLL-25 | 1 (L) → M | delete on BB root fix in same re-pin commit → FOLD | `proof:workaround-deletion` S1 | glass-ui BB (HANDOFF) |
| S2 RF-17 / DLL-19 | 3 (I,J,K→L) → M is 4th | P-inv-28 TERMINAL: delete on 4.1.0 OR forced KILL | `proof:workaround-deletion` S2 | glass-ui BB (HANDOFF) — P-inv-28 bars further BOOK |
| keyframes-vue publish / DLL? | 1 (L) → M | USER-DOMAIN publish → `proof:keyframes-vue-published` GREEN | `proof:keyframes-vue-published` exit 1 | Mike Babb (USER-DOMAIN) |

The S2 row is the most urgent precept obligation: if glass-ui 4.1.0 is not published by
M.WZ, M MUST record a terminal disposition (KILL or direct glass-ui source contribution if
the same owner controls both repos). No fourth carry is permitted under P-invariant-28.

---

## §7 — Cross-repo asks

The single cross-repo ask for this lane is identical to the dispatch already filed in
`KF-TO-GLASSUI-BB-ASKS.md §3` — the peer range widen. No additional ask is required. The
lane's contribution is the precise causal-chain analysis (links 1–4 above) and the
classification of the M-wave vs HANDOFF boundary.

**Timing urgency:** the F-2 peer-cycle is chronicity 2 (K born, L live) and is the
HIGHEST-URGENCY item in the glass-ui BB dispatch — it is a live consumer-facing defect
(any npm install of `@mkbabb/keyframes.js` + `@mkbabb/glass-ui` today gets ELSPROBLEMS).
It is cheaper to fix in a 4.0.x patch (manifest-only, no behavioral change) than as part
of a 4.1.0 feature release.

---

## §8 — Evidence anchors

| Claim | Evidence |
|---|---|
| glass-ui 4.0.0 peer `@mkbabb/value.js: "^0.10.0 \|\| ^0.11.0"` | `node_modules/@mkbabb/glass-ui/package.json` (installed); `npm show @mkbabb/glass-ui@4.0.0 peerDependencies --json` (registry) — both verified |
| value.js installed at `0.13.0` | `node_modules/@mkbabb/value.js/package.json:version` |
| `0.13.0` fails `^0.10.0 \|\| ^0.11.0` (ELSPROBLEMS) | `proof-peer-satisfied.mjs:86-88` (`caretMatch`: `^0.10.0` admits `>=0.10.0 <0.11.0`; `0.13.0` fails) + exit 1 observed |
| `proof:peer-satisfied` absent from `proof:all` | `package.json scripts.proof:all` = `proof:correctness && proof:hygiene`; both scripts grep-confirmed to not contain `peer-satisfied` |
| `proof:peer-satisfied` in `demo-smoke` `check-failures` | `ci.yml:1575-1581` — explicit `if [ "${{ steps.proof-peer-satisfied.outcome }}" = "failure" ]` block |
| `continue-on-error: true` on `proof:peer-satisfied` in `demo-smoke` | `ci.yml:357-358` |
| `deploy-pages.yml` fires only on `conclusion == 'success'` | `deploy-pages.yml:42-46` — explicit `github.event.workflow_run.conclusion == 'success'` condition |
| tranche-l-dev NOT merged into master | `git merge-base --is-ancestor tranche-l-dev master` → false; `git log master` tip = `9bbc227` (K-close) |
| FINAL §S6 sequences close-merge AFTER proof:peer-satisfied GREEN | `FINAL.md §S6` "Only then does the close merge to master carry a green CI" (line 324) |
| `proof:peer-satisfied` is `continue-on-error: true` in `release.yml` (does NOT block npm publish) | `release.yml:79-81` — explicit `continue-on-error: true` before `npm publish` step |
| P-inv-28 bars 4th carry of RF-17 interim | `deferred-ledger-L.md §DLL-19` "★ 3 (I,J,K→L) … no interim carries to a 4th tranche under no-workaround; P-inv-28 exit-shaped" |
| No `overrides` / `peerDependenciesMeta` escape | `KF-TO-GLASSUI-BB-ASKS.md §3` + `completion-lanes-32-36.txt §Lane 36 ⚠` — explicitly named as forbidden |
