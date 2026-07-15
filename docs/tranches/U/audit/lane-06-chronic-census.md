# Tranche U — Audit Lane 06: Chronic Census

**Charter:** the CHRONIC CLASS — items deferred across ≥2 tranches. Cross-reference the
memory-recorded chronic history (P-inv-28 ledger, S's "chronic-closure 31→0" claim, T's
chronic rows) against the CURRENT tree. Did "closure by transfer" actually close them, or
re-badge them? Trace each chronic to its FIRST appearance and verdict its TRUE current state.

**Verdict headline:** the chronic-tracking apparatus itself is the deepest chronic. The
meta-gate (`proof:chronic-closure`) is GREEN but parses a **one-tranche-stale substrate
(`docs/tranches/S/PROGRESS.md`)** that T never transitioned — the exact `M.WZ/O.WZ/P.WZ`
no-skip violation the gate's own header documents. T's live chronics live in a **second,
unreconciled register** (`T_BORNRED_BACKLOG`) that exits 0 while its gates RED — the "honest
defer" device the owner terminated for U, relocated from a markdown table into a JS object.
Two chronics have INVERTED (got worse while "folded"): the gate-roster consolidation
(190→120 target, now **227**) and the glass-ui/value.js external handoffs (riding since J/L/Q).

---

## Evidence-grounded findings

### F1 — CRITICAL — the chronic ledger substrate is FROZEN at S; T never re-pointed it (the M/O/P.WZ sin, reborn)

`scripts/proof-chronic-closure.mjs:145` hardcodes:
```js
const CHRONIC_LEDGER = path.join(REPO, "docs/tranches/S/PROGRESS.md");
```
and `:638` `const LEDGER_LABEL = "S/PROGRESS.md";`. The gate ran GREEN (exit 0) in this audit
against the S ledger's 74 rows. But **`docs/tranches/T/PROGRESS.md` has NO `## Open deferrals`
section** — its headings are `## State`, `## Session log`, `## State of play` only
(`grep '^## '` confirms). The gate's own header (`:102-109`) codifies the discipline it now
breaks: *"the S-tranche PROGRESS.md ledger SUPERSEDES the R table in the SAME motion the S
ledger becomes authoritative (the R→S re-point — **the no-skip discipline the M.WZ/O.WZ/P.WZ
re-points violated**)."* T shipped 5.2.0 and committed exactly that violation: the substrate
was never carried S→T, the chronicity integers never incremented for the S→T ride, and T's own
dispositions (deploy revival, easing terminal, roster) are invisible to the meta-gate. A GREEN
`proof:chronic-closure` today certifies that the **S** paperwork is tidy — it says nothing about
T or the current tree. This is the paper-close class the gate was built to kill, achieved by
letting the substrate rot rather than by a malformed row.

**Evidence:** `scripts/proof-chronic-closure.mjs:145,638`; `docs/tranches/S/PROGRESS.md:103`
(`## Open deferrals`); T/PROGRESS.md heading census (no such section); gate exit 0 observed.

**Proposal (gestalt):** do NOT merely re-point the constant to a `U/PROGRESS.md` table — that
perpetuates the per-tranche manual substrate migration that has now failed once (S→T). The
idiomatic cure is to make the substrate transition **structurally impossible to skip**: the
meta-gate must resolve the *current* tranche letter from the repo (the highest `docs/tranches/<L>/`
with a shipped tag, or an explicit `CURRENT_TRANCHE` manifest) and REQUIRE that tranche's ledger
to carry `## Open deferrals` — a missing section on the current tranche REDs. The gate then can
never be green against a stale substrate again, because "stale" becomes a red by construction.
U must author the single unified U ledger AND this self-locating substrate resolver together.

---

### F2 — CRITICAL — two parallel, unreconciled chronic registers; neither sees the other

There are now TWO chronic-tracking systems with disjoint contents and disjoint gates:

1. **The meta-gated ledger** — `docs/tranches/S/PROGRESS.md §"Open deferrals"`, 74 rows, policed
   by `proof:chronic-closure` (the runtime-gate-that-BIT + P-inv-28 + substance contract).
2. **The T born-RED backlog** — `scripts/gate-bands.mjs:609 T_BORNRED_BACKLOG`, **8 rows**, policed
   by `proof:ci-coverage` clause 11 (`:1161` — "failing ⊆ declared backlog, exactly"), each also
   listed in the ci-coverage EXCLUDED set so it never joins a blocking &&-chain.

The 8 T backlog rows (`proof:stage-inventory`, `subject-legible`, `blur-not-resampled`,
`roster-ceiling`, `no-collision-rename`, `dock-rest-crisp`, `dock-morph-continuity`, `dock-zorder`)
**never entered the meta-gated ledger**, and the 74 S rows are never re-checked against the current
tree. A chronic can live indefinitely in register (2) — RED gate, exit 0 — without ever facing the
runtime-gate-that-BIT / P-inv-28 EXIT-ONLY discipline that register (1) enforces. The apparatus that
was supposed to make chronics un-hideable has grown a second pocket to hide them in.

**Evidence:** `scripts/gate-bands.mjs:609,595`; `scripts/proof-ci-coverage.mjs:1161-1166,257-308`;
backlog enumerated live (8 keys); S ledger 74 rows parsed live.

**Proposal (gestalt):** collapse the two registers into ONE. `T_BORNRED_BACKLOG` is a chronic
ledger wearing a JS-object costume — every row is a deferred item with a `dischargedBy` (=
disposition) and a `reason` (= chronicity/evidence). Fold it INTO the unified `## Open deferrals`
table so `proof:chronic-closure`'s P-inv-28 EXIT-ONLY mandate and substance clause apply to it. A
born-RED gate is then a ledger row with a chronicity integer the ≥4-tranche exit-mandate can bite,
not an escape hatch beside the ledger. `proof:ci-coverage` clause 11 becomes a cross-check that the
ledger's born-RED rows == the exit-0 backlog set, not a second source of truth.

---

### F3 — MAJOR — the gate-roster consolidation chronic is INVERTED: deferred across H/S/T and getting WORSE

`scripts/gate-bands.mjs:595` `export const ROSTER_CEILING = 120;`. S ledger **row 70**: *"Gate
roster 190 → ~120 consolidation — FOLD"* (`S/PROGRESS.md:...` row 70). Actual current count:
**227 `proof:*` keys** (`node -e` over package.json). `proof:roster-ceiling` REDs live:
```
✗ count-ceiling (T.M8.1) — 227 proof:* gates exceed the declared ceiling of 120.
  S.A4's diet INVERTED (203 at S-close; batch ⑩'s edict fold re-authored it up further).
```
but the script **exits 0** (declared born-RED backlog). The trajectory is H(~190) → S-close(203)
→ T(236) → now(227): each tranche "folds" the consolidation while authoring MORE born-RED oracles
than it retires. This is the precise target of the owner's U edict: *"that runner is entirely
superfluous — our CI needs to be trimmed substantially (most of it's likely tautological)."* The
90%-over-ceiling roster is not a convergence-in-progress; it is a chronic that every tranche has
made larger while claiming to shrink it.

**Evidence:** `scripts/gate-bands.mjs:595`; `S/PROGRESS.md` row 70; `proof:roster-ceiling` live
output (227 vs 120, exit 0); T/FINAL.md:103 ("count-ceiling (236 > 120) is a DECLARED born-RED
backlog").

**Proposal (gestalt):** the ceiling will never be met by "converges as bands delete keys" — that
promise has failed three tranches running because gate-authoring is the reflex of every wave. U
must invert the incentive: a **net-negative roster covenant** — no U wave may land a new
`proof:*` key without retiring ≥1, enforced by a gate that diffs the roster against the previous
tag and REDs on net growth. Pair it with a one-time tautology census (the owner's explicit
hypothesis): cluster the 227 by the property each measures, and DELETE the source-shape gates whose
property is already covered by a runtime gate (the roster is dense with structural proxies for
interactions a single browser gate already actuates). Target is not "~120 someday" but a hard
budget U ratifies and the covenant defends.

---

### F4 — MAJOR — "closure by transfer" for the external chronics = re-badge to born-RED-exit-0; 6 of 8 backlog rows are sibling handoffs riding since J/L/Q

Of the 8 `T_BORNRED_BACKLOG` rows, **six are external sibling handoffs** that kf cannot close:

| Backlog gate | Owner | Traces to S ledger row | Born |
|---|---|---|---|
| `proof:dock-zorder` | glass-ui | 53 (dock chronic) | ~J |
| `proof:dock-morph-continuity` | glass-ui | 53 | ~J |
| `proof:dock-rest-crisp` | glass-ui (GU-1) | 53 | ~J |
| `proof:subject-legible` | glass-ui (dock de-blur) | 51/53 | Q/J |
| `proof:blur-not-resampled` | glass-ui (frozen-backdrop, VERDICT #19) | 52 | L |
| `proof:no-collision-rename` | value.js (KF-7 PropertyDescriptor) | — (T.S3) | Q-era |

S rows 51/52/53 are already `HANDOFF (owner — USER-DOMAIN, glass-ui-owned)` with chronicity
`2→3`, `4→5`, `4+→5` (`S/PROGRESS.md` rows 51-53). T did not close them — it **relocated** them
from the meta-gated S ledger into `T_BORNRED_BACKLOG` where they exit 0. `proof:no-collision-rename`'s
own reason (`gate-bands.mjs`) admits *"value.js 2.0.1, 3.0.0 AND 3.1.0 all still export it
un-renamed (re-verified at the T.S3 3.1.0 re-pin — the tripwire STAYS born-RED after the pin)."*
These are the chronics the owner's *"Delineate any chronically deferred items and fold them into
this tranche"* names — and "fold" has meant "carry in a different container" for J→T.

**Evidence:** `gate-bands.mjs:609` (8 backlog keys, all resolve in package.json — verified live);
`S/PROGRESS.md` rows 51/52/53; `gate-bands.mjs` `no-collision-rename.reason` (value.js 3.1.0 still
un-renamed); MEMORY dock double-click note (glass-ui-root, never patched in demo).

**Proposal (gestalt):** an external chronic cannot be closed by kf, so stop pretending a kf gate
tracks it. The idiomatic device already exists in the S ledger's own vocabulary (the vaporware-HANDOFF
rule, `proof:chronic-closure:420`): a HANDOFF may target ONLY a *published* sibling version. U must
convert each of the 6 into a **published-consume-edge covenant with a coordination letter** to the
named sibling tranche (glass-ui, value.js — value.js's tranche is live per the U prompt), and DELETE
the kf-side born-RED gate that can never green in-realm (it is a wrong-realm proxy, exactly the
"right-axis" violation the meta-gate forbids). The kf gate is re-authored only as a
*consume-verification* that greens the instant the published sibling ships the fix — never as a
standing RED that measures a defect kf cannot touch. This is the ONLY honest fold for a USER-DOMAIN
chronic under "no more deferrals."

---

### F5 — MAJOR — the born-RED-backlog exit-0 device is the deferral-laundering the substance clause was built to forbid, relocated outside its reach

`proof:chronic-closure`'s S.A1 substance clause (`:449-511`) exists to RED any disposition that
"launders a deferral verb (observe/watch/re-affirm/verify)" without a paired re-shape/KILL —
because a renamed verb that keeps an item alive forever is the P-inv-28 sin. The T backlog achieves
*identical* laundering by a mechanism the clause cannot see: a gate that genuinely REDs
(`proof:roster-ceiling`, `blur-not-resampled`, …) is registered in `T_BORNRED_BACKLOG` and made to
`exit 0`, and added to the ci-coverage EXCLUDED set so it never blocks. The item survives, CI stays
green, and the substance clause never runs on it (it's not in the S ledger). Structurally this is the
same escape as the `continue-on-error` mask the meta-gate red S ledger row 18 for
(`proof:scene-switcher-mobile` zombie) — a RED gate whose redness is suppressed at the roster level
instead of the workflow level.

**Evidence:** `proof:chronic-closure:449-511` (substance clause); `gate-bands.mjs:609` +
`ci-coverage.mjs` EXCLUDED set + clause 11 (`:1161`); the 8 backlog gates RED-but-exit-0 (roster-ceiling
observed RED, exit 0).

**Proposal (gestalt):** a born-RED gate is legitimate ONLY as the *forward* half of a FOLD row whose
owning wave will make it green within the tranche — that is the S.A0 keystone model. A born-RED gate
with NO in-tranche owning wave (an external handoff, or a "converges someday" like roster-ceiling) is
a deferral, and must face the ledger's P-inv-28 EXIT-ONLY mandate off a chronicity integer (F2's
fold). U's charter is to make `T_BORNRED_BACKLOG` a *transient* — every row either closes in U or
becomes a published-consume covenant (F4); zero rows may carry to V as "still converging."

---

### F6 — MAJOR — the meta-gate verifies chronics are PRESENT in the (stale) ledger, never CLOSED in the tree — the DM-9..DM-15 defect chronics are unverified

`proof:chronic-closure:651-664` `EXPECTED` greps that `DM-9`..`DM-15` tokens *appear* in the S
ledger text — a no-silent-drop check. It never asserts those chronics are actually terminalized in
the current tree. These are the DEEPEST defect chronics: DM-9 specular (born D, chronicity `8→9`),
DM-10 typography (D, `9→10`), DM-11 spring-slider (D, `10→11`), DM-13 engine-no-throw (A, `8→9`),
DM-14 fsm-suspend (H, `7→8`) — 7-to-11-tranche rides (`S/PROGRESS.md` rows 6-14). Their S disposition
is "FOLD — C-20 terminal-ization" citing browser gates (`proof:specular-absent-at-rest`,
`font-census`, `spring-slider-continuous`, `fsm-suspend-resume-live` — all resolve, verified live).
But because the meta-gate parses the S plan, not the T result, whether T's implementation actually
terminalized them is unknown to the apparatus. A DM-11 that rode ten tranches on serial re-affirmation
(S row 9's own words) could still be alive and the gate would be green.

**Evidence:** `proof:chronic-closure:651-664`; `S/PROGRESS.md` rows 6-14 (DM chronicity 6-11);
cited gates resolve (verified live); no tree-state assertion in the EXPECTED loop.

**Proposal (gestalt):** the census must close the loop from plan to product. For each ≥4-tranche
DM row, the unified U ledger must cite the runtime gate that BIT *and* record its live-green
witness on the current SHA (a re-run artifact, not a plan reference). U should run the DM-9..DM-15
browser gates on the merged tree and either mark each CLOSED-with-witness or re-open it as a U FOLD —
these are the highest-chronicity items in the entire corpus and the owner's "no more deferrals" lands
on them hardest.

---

### F7 — MINOR (positive control) — the deploy + master-CI chronics DID genuinely close; the mechanism to emulate

Not every transfer was a re-badge. S row 1 ("Master CI red on every push", born K, chronicity `3→4`)
and row 16 (DM-20 auto-deploy-of-record dead, born L.WZ, `4→5→6`, HANDOFF→T.S6/T.Z) are GENUINELY
closed: `proof:published-on-master` runs GREEN — `v5.2.0 (cf9b268e) IS an ancestor of master
(b95973a6)` — so the published tree is the deployed-of-record tree and the master-merge landed.
This is the shape of a real close: a runtime/state gate that BIT (deploy dead) now greens on the
current tree, with a run-time-resolved witness (no frozen hash). The DM-20 chronic rode L→T and
EXITED via a built mechanism, not a relabel.

**Evidence:** `proof:published-on-master` live output (v5.2.0 ancestor of master, exit 0);
`S/PROGRESS.md` rows 1, 16.

**Proposal:** U should hold every chronic to THIS bar — a state/runtime gate that was RED on the
defect and is GREEN on the current SHA with a re-derived witness. F4/F5/F6's items fail this bar
today; row 1/16 pass it. The bar is the census's acceptance criterion.

---

### F8 — MINOR — retired-gate hygiene held (the one clean sub-mechanism)

The RETIRED-tag dual (a killed gate must be ABSENT from package.json + proof:all) is honored:
`proof:scene-switcher-mobile` (S row 18 KILL), `proof:no-span-surface` (S row 48), and
`proof:compose-scene` (S row 29 KILL, T.E prune) are all ABSENT (verified live), and the
chronic-closure gate reports `proof:motion-path-editable` as `RETIRED(absent)` correctly (S row 68
KILL). This sub-mechanism — cure→discharge-same-commit with a re-run witness — is the ONE part of the
apparatus that closes chronics honestly, and it is the template F4's proposal generalizes.

**Evidence:** live absence checks (scene-switcher-mobile / no-span-surface / compose-scene ABSENT);
`proof:chronic-closure` output `68 … KILL · RETIRED(absent): proof:motion-path-editable`.

---

## What U must charter

1. **Author the unified U chronic ledger AND a self-locating substrate resolver in ONE motion** —
   `proof:chronic-closure` must resolve the current tranche from the repo and RED if the current
   tranche lacks `## Open deferrals`; the frozen `S/PROGRESS.md` hardcode
   (`proof-chronic-closure.mjs:145,638`) is deleted. Never hand-migrate the substrate again.
2. **Fold `T_BORNRED_BACKLOG` INTO the unified ledger** — collapse the two registers; every born-RED
   backlog row gets a chronicity integer and faces the P-inv-28 EXIT-ONLY + substance discipline;
   `proof:ci-coverage` clause 11 becomes a cross-check, not a second source of truth.
3. **Terminate the born-RED-exit-0 laundering device** — a born-RED gate is legal ONLY as the
   forward half of a FOLD with an in-tranche owning wave; zero rows may carry to V as "converging."
4. **Impose a net-negative roster covenant + tautology census** — no U wave adds a `proof:*` key
   without retiring ≥1 (gate-enforced against the prior tag); census the 227 by measured property and
   DELETE source-shape proxies already covered by a runtime gate. Ratify a hard budget, not "~120 someday."
5. **Convert the 6 external chronics to published-consume covenants** — issue coordination letters to
   glass-ui (dock-zorder/morph-continuity/rest-crisp, subject-legible, blur-not-resampled) and value.js
   (no-collision-rename / KF-7); DELETE the wrong-realm kf born-RED proxies; re-author each as a
   consume-verification that greens on the published sibling fix.
6. **Close the DM-9..DM-15 defect chronics to a live-green witness on the current SHA** — run the cited
   browser gates on the merged tree; mark CLOSED-with-witness or re-open as a U FOLD. These are the
   highest-chronicity items (7–11 rides) and the owner's edict lands on them hardest.
7. **Adopt "RED-on-defect → GREEN-on-current-SHA with re-derived witness" as the census acceptance
   bar** (the row 1 / DM-20 deploy pattern) — apply it uniformly; no chronic exits U on paperwork alone.
