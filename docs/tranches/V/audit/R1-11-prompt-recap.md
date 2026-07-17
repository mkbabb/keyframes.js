# Lane R1-11 — PROMPT-RECAP TOTAL (owner-ask registry)

**Auditor lane:** R1-11 · **Prefix:** PR- · **Date:** 2026-07-16
**Subject tree:** `/Users/mkbabb/Programming/keyframes.js` @ HEAD `a59d3a22` (+ large uncommitted transaction)

## Verdict

I decomposed the Tranche V charter (`docs/tranches/V/ORIGINAL-PROMPT.md`, 163 lines)
into **42 atomic owner-asks** (V-01…V-42), and reconciled them against the U ledgers
and the U agentic-handoff §5/§8 owner-binding obligations. The V registry
(`PROMPT-RECAP-V.md`) does **not yet exist** and `V/waves/` + `V/coordination/` are
empty — expected, because V is mid-formation and this lane's output feeds that registry.

Adversarial spot-checks of U's three most load-bearing dispositions: **two hold on the
tree** (CLAUDE.md deletion → 0 tracked; `demo/@` dissolution → absent; `proof:*`
collapse → exactly 2 keys). **One is a false close:** OD-U19 ruled `demo/app/dock/`
"needs to be straight up extirpated" and the U close claimed EXECUTED / "canonical
homes," yet the tree still carries `demo/app/dock/ChromeDock.vue` (385 L) and
`MbabbMenu.vue` (121 L) as real components — a **green-over-broken carry-forward** that V
must own with an explicit wave (PR-1). The largest owner obligation on the whole rail —
the handoff §5/§8 Glass-7 restart / 65-path consumer reconstruction — is undischargeable
until an immutable Glass 7 packet exists and MUST be minted as a V registry row rather
than silently inherited (PR-2). The two named V structural exemplars (easing-prefix
removal, compiled-frame/frame-compiler split) are genuine live tree defects and must
graduate to born-RED wave rows (PR-3, PR-4). A demo godmodule (609 L) exceeds the U 500 L
carve threshold (PR-5).

Silent drops are forbidden; every ask below is minted as a row even where addressed.

---

## The TOTAL owner-ask registry

### A. Tranche V charter — atomic decomposition (source: `V/ORIGINAL-PROMPT.md`)

Status legend: NEW-V = charter-new ask, no prior disposition, expected UNADDRESSED
(development-only tranche); ADDRESSED = already true on tree; META = process/orchestration
directive binding the tranche's own conduct.

| Ask ID | Verbatim / tight paraphrase | Line | Status | Required owner |
|---|---|---|---|---|
| V-01 | Beget the forthcoming tranche incorporating the adhoc glass-ui/value.js coordination done hitherto | 9-11 | NEW-V | V charter root |
| V-02 | Deferred colocation + modularization "must be finally settled" — the "massive explosion of module and directory structure" resolved with better grouping/encapsulation in BOTH library and demo | 11-14 | NEW-V | a restructure wave (lib) + a restructure wave (demo) |
| V-03 | Refer to glass-ui for flattening + component-structuring idioms | 14 | NEW-V | design/idiom wave |
| V-04 | `compile/easing/` modules: remove prefixes — no "easing-option", just "option" | 16-18 | **UNADDRESSED (live)** | born-RED rename wave (see PR-3) |
| V-05 | Why is `compiled-frame.ts` split into its own file; `frame-compiler.ts` is "quite massive" — should it not be a module? | 18-22 | **UNADDRESSED (live)** | born-RED compile/ module wave (see PR-4) |
| V-06 | ALL files ruthlessly inspected for a better, idiomatic, logically-grouped, cohesive, less-fragmented structure | 22-24 | NEW-V | the convergent restructure loop |
| V-07 | No godmodules | 24 | **PARTIAL** | carve wave (see PR-5) |
| V-08 | NOT an implementation phase — tranche development only; no source edits land | 28-30 | META | binds V posture |
| V-09 | Deliverable = next tranche fully formed: plan folder, wave specs, gates, dispositions | 30-31 | META (pending) | V return contract |
| V-10 | DEEPLY audit original plan + waves + all changes, 32 agents | 34-36 | META | this audit fleet |
| V-11 | Devise path forward: audit landed changes + remaining plan | 36-37 | META | synthesis |
| V-12 | Recapitulate original prompts/plans/precepts; verify each addressed or carries a ledger row + owner | 37-38 | META | **this lane** |
| V-13 | Form next tranche from what the audit surfaces | 38 | META | V charter root |
| V-14 | NO quick solutions/workarounds; idiomatic gestalt; architectural transpositions for elegance/simplicity/performance | 42-44 | META (standing edict) | every wave gate |
| V-15 | NO legacy code — no aliases, migration shims, dual paths, masking fallbacks | 45-46 | META (standing edict) | dead-code/dual-path lens |
| V-16 | Delineate EVERY chronic + deferred item, fold as DECIDED rows (build/fold/retire + rationale); re-booking forbidden; a chronic ridden ≥2 closes = disease row, deciding it = its own wave | 47-50 | META | chronic-ledger wave |
| V-17 | Recap ALL prompts/requests; unaddressed → registry row + owning wave; silent drops forbidden | 51-53 | META | **this lane** |
| V-18 | 32 agents = steerable budget; assignment follows registry round-over-round; no lens permanently staffed | 57-58 | META | orchestration |
| V-19 | Open with a diverse portfolio of audit lenses (plan-vs-landed, gate-soundness, gestalt-vs-per-mechanism, chronic/disposition ledgers, prompt-recap, consumer truth, perf, a11y, doc/canon drift, dead-code/dual-path, cross-repo) | 60-65 | META | orchestration (fleet in flight — 9 R1 lanes on disk) |
| V-20 | Withhold the favored success narrative from most auditors (early independence) | 66-68 | META | orchestration |
| V-21 | Maintain a finding-family registry grouped by defect mechanism; redirect excess | 69-72 | META | synthesis |
| V-22 | Audit adversarially vs the close-class lies (green-over-broken, vacuous-green gates, missing captures, masked fallbacks, alias smuggling, re-booked chronics, per-mechanism-green-over-gestalt-broken) | 73-76 | META | every lane |
| V-23 | Require concrete deliverables (file:line, failing probe, reproduction, named defect row); reject status reports/optimism | 77-79 | META | every lane |
| V-24 | Decompose any "redo the tranche"-strength finding into wave-shaped rows | 80-81 | META | synthesis |
| V-25 | Root repeatedly synthesizes/challenges/redirects/relaunches; stable only when two consecutive passes surface nothing new | 82-84 | META | orchestration |
| V-26 | Fable owns orchestration/synthesis/adjudication/design (via DesignSync); Opus/Sonnet fanout; every spawn declares its model; batches of 3 | 88-93 | META | orchestration |
| V-27 | Track partial progress; discard nothing; folding is a decision; every partial/banked/abandoned item → terminal disposition; counting a partial as done is forbidden | 97-101 | META | disposition ledger |
| V-28 | Return only when fully formed: plan folder; wave specs w/ acceptance gates born-RED where defect live; π + DELTA obligations for every visual claim; disposition for every chronic/deferred/recap row; blocker→strongest converged core + exact gap | 105-111 | META (pending) | V return contract |
| V-29 | GRAND EDICT, ALL dirs: components COLOCATED with sub-components/composables/skeletons/constants, recursively for nested components | 115-118 | NEW-V (partly landed at U; see carry-forward) | recursive-colocation wave |
| V-30 | Truly module/global composables live in a `composables/` dir; otherwise COLOCATED; same for styles | 120-123 | NEW-V | colocation wave |
| V-31 | Long-running dirs must ALWAYS be broken into common modules + encapsulated | 125-126 | NEW-V | granularity wave (both bounds) |
| V-32 | Same treatment for ALL backend files, abstracted/befitting those languages | 127-129 | NEW-V | backend restructure wave |
| V-33 | Extreme parsimony + fastidious care; KISS-forward, fewer LOC; consider the greater library/component picture | 131-134 | META (standing edict) | every wave gate |
| V-34 | Spend little time on contrived gates/process; majority on direct code implementation (via agents) + visual verification | 134-137 | META | orchestration budget |
| V-35 | ALL gates/proof/meta scripts ruthlessly critiqued; most tests too; prune the superfluity | 138-139 | NEW-V | gate/test-prune wave |
| V-36 | Root-level glass-ui defects noted, batched, sent to the working glass-ui agent | 141-143 | NEW-V | glass-ui defect-batch coordination |
| V-37 | Great care not to interrupt glass-ui's process until swaths isolated + precepts-compliant wave addenda written + exact defects targeted; be cognizant of its context window (mid BI/P) | 143-147 | META | coordination discipline |
| V-38 | Cards/components/affordances/hierarchy/margins/paddings/dividing-lines/small-UI audited + refined for Aristotelian proportionality + glass-ui suffusion/affordance | 151-158 | NEW-V | design-proportionality wave (Fable+DesignSync) |
| V-39 | Mark superfluous/duplicative/distracting UI elements ripe for removal | 158 | NEW-V | UI-census wave |
| V-40 | Mark the converse — items where MORE affordance is necessary (under-afforded) | 158 | NEW-V | UI-census wave |
| V-41 | glass-ui + sci-report + atlas in ACTIVE execution — establish bi-directional communication | 160-162 | NEW-V (partly: `V/coordination/` empty) | cross-repo coordination wave |
| V-42 | value.js will have a similar tranche dev/audit — coordinate precisely | 162-163 | NEW-V | value.js coordination letter |

### B. Tranche U carry-forward reconciliation (sources: U OWNER-ASKS / OWNER-DECISIONS / PROMPT-RECAP-U / handoff)

Nine U owner asks + OD-U1…U23 spot-checked against the tree. Rows that HOLD are minted
for completeness; rows that REGRESSED or were CONDITIONAL-ON-FUTURE-WORK carry into V.

| Ask ID | Ask | Source | Status | Required owner |
|---|---|---|---|---|
| U→V-01 | CLAUDE.md deletion (OD-U15) | OD-U15 | **ADDRESSED-with-evidence** — `git ls-files '*CLAUDE.md'` = 0 (worktree copies under `.claude/worktrees/**` are detached branches, not master tree) | none (holds) |
| U→V-02 | `demo/@` dissolution + `components/custom` dissolve (OD-U2/U19) | OD-U2 | **ADDRESSED-with-evidence** — `ls demo/@` → No such file; no `custom/` dir under `demo/` | none (holds) |
| U→V-03 | CI trim → `proof:*` collapse to the two measured mechanisms (OD-U1/U23) | OWNER-ASKS #1 | **ADDRESSED-with-evidence** — `package.json` has exactly `proof:publish` + `proof:owner-golden` | none (holds) |
| U→V-04 | **`app/dock/` "straight up extirpated" (OD-U19)** | OD-U19 | **REGRESSED / FALSE-CLOSE** — `demo/app/dock/{ChromeDock.vue(385L),MbabbMenu.vue(121L),index.ts}` still tracked at HEAD (see **PR-1**) | born-RED extirpation wave |
| U→V-05 | glass-ui-gaps.ts + `.dependency-cruiser-known-violations.json` deleted (OD-U17/U20) | OD-U17/U20 | **ADDRESSED-with-evidence** — neither present in tracked tree | none (holds) |
| U→V-06 | glass-ui consume edge (OD-U4: "we use 5.0.0"), now re-deadlined to Glass 6→7 | OD-U4 / handoff §5 | **CONDITIONAL (external producer)** — carry as named boundary, not local defer | V external-covenant row (Glass 7 packet) |
| U→V-07 | value 4.0 → Keyframes 6 → Glass 6 timing/vars/diagnostics rail | PROMPT-RECAP-U external covenant | **CONDITIONAL (external producer)** | V value.js coordination (dovetails V-42) |
| U→V-08 | Atlas 2.0 / sci-report post-Glass-6 successor | PROMPT-RECAP-U; handoff §6 | **CONDITIONAL (external producer)** | V cross-repo covenant (dovetails V-41) |
| U→V-09 | Amiga animation + scene suspend/resume first-principles fix, mandated IN-U (OD-U13) | OD-U13 | **UNVERIFIED THIS LANE** — a "broken for many tranches" chronic; must be re-checked live before V lets it ride a third close | coverage gap → dead-code/behavior lane; if still broken = disease row |
| U→V-10 | Compositor/stacking/layering fixes IN-U (OD-U14: CompositeState, op axis, group WAAPI) | OD-U14 | **UNVERIFIED THIS LANE** | coverage gap → compositor lane |

### C. Agentic-handoff §5/§8 owner-binding obligations (source: `U/AGENTIC-HANDOFF-2026-07-16.md`)

| Ask ID | Obligation | Source | Status | Required owner |
|---|---|---|---|---|
| H→V-01 | Keyframes restart after immutable Glass 7: reconstruct the 65-path consumer slice on clean K6 `5a9183a7…`, exact Glass 7 as demo-only devDependency, registry-only lock, one physical nonsymlinked core | §5 (1-8) | **BLOCKED-CONDITIONAL** — awaits immutable Glass 7 packet; must be a V registry row (see **PR-2**) | V external-rail wave, born-RED, producer-gated |
| H→V-02 | Substantive checks (`check`/`test --run`/`lint`/`build:lib`/`proof:publish`/`gh-pages`) + strict `skipLibCheck:false` packed consumer, not process theater | §5 (9) | **BLOCKED-CONDITIONAL** | same wave |
| H→V-03 | Native visual authority matrix @1280/390 (11 named acceptance checks); stop at first material defect; no CSS/timing cover | §5 (11) | **BLOCKED-CONDITIONAL** — this is V's π/DELTA obligation surface for the deploy | same wave (π + DELTA) |
| H→V-04 | Bounded consumer commit + Cloudflare deploy + round-trip facts recorded; never overwrite `6.0.0` — smallest honest successor from measured break shape | §5 (12-13), §8 | **BLOCKED-CONDITIONAL** | same wave |
| H→V-05 | Definition-of-done invariants: no held rehearsal / hidden second core / local parser / compat shim / fallback / proof farm / stale version claim survives | §8 | **STANDING INVARIANT** — dovetails V-15 (no legacy) + V-22 (close-class lies) | dead-code/dual-path lens |
| H→V-06 | Do-not-consume ledger (§7): every local Value 4 / Keyframes / Glass 7 rehearsal archive is defective/superseded; only registry + future immutable Glass 7 advance the DAG | §7 | **STANDING INVARIANT** | consumer-truth lens |

---

## Findings

### PR-1 — `app/dock/` extirpation (OD-U19) is a FALSE CLOSE; two real components still live there — P1

**Mechanism family:** green-over-broken / declared-restructure-missing-on-disk

OD-U19 (`docs/tranches/U/OWNER-DECISIONS.md:28`) records the owner ruling verbatim:
`app/dock/` as a component home "needs to be straight up extirpated"; and "app/ keeps
only the shell (router/machine bindings), never components." The U close mirror
(`OWNER-ASKS.md:11` row 7 → "EXECUTED — canonical homes … landed"; `PROMPT-RECAP-U.md:62`
"canonical homes … landed") asserts this executed.

Tree contradicts:
```
$ git ls-files demo/app/dock/
demo/app/dock/ChromeDock.vue
demo/app/dock/MbabbMenu.vue
demo/app/dock/index.ts
$ wc -l demo/app/dock/ChromeDock.vue demo/app/dock/MbabbMenu.vue
     385 demo/app/dock/ChromeDock.vue
     121 demo/app/dock/MbabbMenu.vue
```
`ChromeDock.vue:1` is `<script setup lang="ts">` with 385 lines of real dock rendering
(glass-ui `GlassDock`/`DockControl` consumption, cardinality model, injection keys) — not
a shell binding. `index.ts` is a 2-line barrel re-exporting both as components. These are
exactly the "component home" the owner ordered extirpated. The working-tree transaction
still MODIFIES both files (`git status`: `M demo/app/dock/ChromeDock.vue`,
`M demo/app/dock/MbabbMenu.vue`) — i.e. current work touches this home without relocating it.

**Disposition (build):** Mint a born-RED V wave "extirpate `demo/app/dock/` as a component
home": relocate `ChromeDock`/`MbabbMenu` to their colocated instrument/dock home under
`demo/components/**` (per V-29 recursive colocation), leave `demo/app/` shell-only. Gate:
`git ls-files demo/app | grep -E '\.vue$'` returns zero. This is a re-booked chronic
candidate (T #26 grand-colocation overstatement lineage) — if it rode U undecided it is a
disease row per V-16.

### PR-2 — The handoff §5/§8 Glass-7 restart obligation must be a V registry row, not silently inherited — P1

**Mechanism family:** conditional-obligation-without-owner / silent-inheritance risk

`AGENTIC-HANDOFF-2026-07-16.md:372-517` (§5 restart + §8 definition-of-done) is a large,
explicit, owner-binding obligation: reconstruct the 65-path consumer slice on immutable
K6 `5a9183a7…`, pin exact Glass 7 as a demo-only devDependency, registry-only lock, native
1280/390 visual matrix, bounded Cloudflare deploy, and the "never overwrite 6.0.0 / smallest
honest successor" invariant. It is undischargeable today (blocked on an immutable Glass 7
packet that does not yet exist — §7 explicitly voids every local Glass 7 rehearsal). The U
close routed this to an "owner-re-deadlined producer boundary" (`PROMPT-RECAP-U.md:43-50`),
which is legitimate — but V's charter (V-16, V-17, V-27) forbids silent inheritance: a
blocked-conditional obligation of this magnitude needs an explicit V ledger row with a named
re-trigger (the immutable Glass 7 packet) and an owning wave, or it evaporates between closes.

Note: current HEAD is `a59d3a22`, NOT the handoff's immutable K6 `5a9183a7…`; the working
tree carries the 226/250-path mixed transaction the handoff §5(4) explicitly warns "Do not
copy … wholesale." Whether the in-flight transaction is the disciplined 65-path slice or the
warned-against wholesale copy is out of this lane (see coverage gaps) but is the exact seam
this row must gate.

**Disposition (build):** Mint V rows H→V-01…H→V-06 (table C above) as a single
producer-gated external-rail wave, born-RED, re-trigger = "immutable Glass 7 packet
received," carrying the §5 native visual matrix as V's π/DELTA obligation for the deploy.

### PR-3 — easing-prefix removal (V-04) is a live tree defect; must be a born-RED wave row — P2

**Mechanism family:** owner-named-structural-defect-unaddressed

The charter (`V/ORIGINAL-PROMPT.md:16-18`) names it exactly: `compile/easing/` modules
"should have their prefixes removed — no 'easing-option' — just 'option'." Tree:
```
$ ls src/animation/compile/easing/
easing-option.ts  easing-registry.ts  index.ts
$ find src/animation/compile -name 'easing-*'
src/animation/compile/easing/easing-option.ts
src/animation/compile/easing/easing-registry.ts
src/animation/compile/emit/easing-serialize.ts
```
Both files inside `easing/` still carry the `easing-` prefix (redundant with the dir name);
`emit/easing-serialize.ts` is the same pattern one dir over. This is NEW-V (no prior close
claimed it), so UNADDRESSED is expected — but per V-17 it must appear as a registry row with
an owning wave, born-RED (the defect is live).

**Disposition (build):** rename wave `easing/{option,registry}.ts`, `emit/serialize.ts`;
update barrels/imports; gate: `find src/animation/compile -name 'easing-*'` returns zero.

### PR-4 — `compiled-frame.ts` split + `frame-compiler.ts` "massive" (V-05) — born-RED module wave — P2

**Mechanism family:** owner-named-structural-defect-unaddressed / over-and-under fragmentation

Charter (`V/ORIGINAL-PROMPT.md:18-22`) poses it directly. Tree:
```
$ wc -l src/animation/compile/compiled-frame.ts src/animation/compile/frame-compiler.ts
      32 src/animation/compile/compiled-frame.ts     # absurdly small — inline candidate
     461 src/animation/compile/frame-compiler.ts      # "quite massive" — module candidate
```
Both bounds of OD-U16 (carve long / inline tiny) apply in one seam: the 32-line file is an
inline-and-delete candidate; the 461-line file is a carve-into-`frame-compiler/`-module
candidate. NEW-V, UNADDRESSED-expected, must register.

**Disposition (build):** compile/ granularity wave: inline `compiled-frame.ts` into its sole
consumer or fold into a `frame-compiler/` module dir; carve `frame-compiler.ts` into cohesive
sub-modules. Gate: no file in `compile/` under ~40 L standing alone; `frame-compiler` is a dir
or ≤ a ruled ceiling.

### PR-5 — demo godmodule `ChannelOptions.vue` (609 L) exceeds the U 500 L carve threshold (V-07) — P2

**Mechanism family:** godmodule / >500L-renderer-uncarved

OD-U2 (`OWNER-DECISIONS.md:11`) set ">500L renderers carved into composables" as the demo
component discipline. Tree:
```
$ git ls-files 'demo/**/*.vue' | xargs wc -l | sort -rn | head -2
     609 demo/components/instrument/transport/channel-controls/ChannelOptions.vue
     499 demo/scenes/spring/useSpringDemo.ts
```
`ChannelOptions.vue` at 609 L is over the threshold; `ChannelControls.vue` (456 L) and
`SpringTarget.vue` (470 L) sit just under. Src side is clean (largest tracked src file =
`physics/spring/progress.ts` at 484 L, none over 500), so V-07 "no godmodules" is
substantially held in the library but breached in the demo. Both these files are in the
active working-tree transaction (`git status`: `M …ChannelOptions.vue`,
`M …ChannelControls.vue`) — the transaction touches them without carving.

**Disposition (fold):** fold into the demo restructure wave (V-02/V-29) — carve
`ChannelOptions.vue` per the >500L rule. Gate: no `demo/**/*.vue` over the ruled ceiling.

### PR-6 — U's "18 scripts" witness drifted to 19; minor count-inheritance nit — P3

**Mechanism family:** unverified-count-inherited-from-prose

`PROMPT-RECAP-U.md:31` states "`package.json` has 18 scripts and exactly two `proof:*`
commands." The `proof:*` count holds (2). The total is now 19
(`node -e "Object.keys(require('./package.json').scripts).length"` → 19; roster includes
`gen:agent-surface`, `audit:lighthouse`, `release:changelog`, `bench:color-fidelity`,
`demo:correctness`). Immaterial to any product boundary, but flags that U's tree-witness
numbers are point-in-time and V's registry should re-measure rather than inherit.

**Disposition (retire):** doc nit — V registry re-measures live; no wave.

---

## Negatives (checked and found sound)

- **CLAUDE.md deletion (OD-U15):** `git ls-files '*CLAUDE.md'` = 0. Only detached
  `.claude/worktrees/**` copies exist (other branches), not the master tree. HOLDS.
- **`demo/@` dissolution (OD-U2):** `ls demo/@` → No such file or directory. HOLDS.
- **`components/custom` dissolution (OD-U2):** no `custom/` dir under `demo/`. HOLDS.
- **`proof:*` collapse (OD-U1/U23):** exactly `proof:publish` + `proof:owner-golden` in
  `package.json:50-51`. HOLDS.
- **glass-ui-gaps.ts (OD-U20):** absent from tracked tree. HOLDS.
- **`.dependency-cruiser-known-violations.json` (OD-U17):** absent from tracked tree
  (worktree copies only). HOLDS.
- **Library godmodules (V-07, src side):** largest tracked `src/**/*.ts` = 484 L; none
  over 500. Library side of "no godmodules" substantially held.
- **All 42 V charter asks decomposed** with line anchors; none silently dropped.

## Coverage gaps (out of this lane — hand to named lenses)

1. **OD-U13 amiga + suspend/resume "fixed in-U":** not verified live this lane. It is a
   "broken for many tranches" chronic; if still broken it is a V disease row (V-16). →
   dead-code/behavior lane + a live scene drive.
2. **OD-U14 compositor/stacking/layering fixes (CompositeState, op axis, group WAAPI):**
   claimed landed IN-U; not exercised here. → compositor lane.
3. **The in-flight working-tree transaction vs handoff §5(4):** whether the uncommitted
   226/250-path mixed transaction is the disciplined 65-path consumer slice or the
   warned-against wholesale copy. → worktree-transaction lane (R1-03).
4. **HEAD ≠ immutable K6 `5a9183a7…`:** the version/tag/immutability reconciliation of the
   current tree against the handoff's frozen K6 coordinates. → consumer-truth/release lane.
5. **π/DELTA and visual-obligation completeness for V's own return contract (V-28):** not a
   recap-registry concern; belongs to the tranche-formation adjudicator.
