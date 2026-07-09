# Lane r2 — Tranche Genealogy & Outcomes (A → R)

**Branch:** `tranche-s-dev` · **Date:** 2026-07-02 · **Method:** every load-bearing claim re-checked
against the live tree (`wc -l`, `grep`, `git log/show`, gate re-runs) and against the on-disk tranche
records `docs/tranches/{A..R}/`. Where a doc asserts a number I re-measured it; where it asserts a gate
state I noted whether the gate script still exists. Analysis only — no source/test/config/doc touched
except this report.

---

## Executive summary

Eighteen tranches (A → R) have run on keyframes.js. The single most important structural fact the record
reveals is that **the tranche machine has a reliable failure mode and a reliable correction mode, and they
alternate.** Almost every tranche opens by auditing its predecessor's *close* and finding it overclaimed:
C found B's close overclaimed (gates asserted MET were unmet; the capture harness was never checked in);
I found H certified a broken product with "97 green gates"; J found the same blindspot at every boundary
beyond the surface I fixed; O found M was **DEVELOPED-not-IMPLEMENTED** (14 of 16 waves unbuilt, two
7-tranche P-inv-28 ABSOLUTE terminals — DM-2, DM-3 — silently unbuilt); and R found Q's headline
"decomposition close" **cosmetic** — `proof:decomposition` was RED at Q's own close commit, the mandated
`proof:engine-seam-split` gate was never authored, and the override cap was RAISED 1400→1450 in the same
commit branded "the decomposition close." (`R/audit/retro-plan-waves.md:23-98`.)

The recurring **failure modes** are: (1) **gate-shaped-but-not-runtime closures** (green source-shape gates
over a broken product — the I/H seminal case); (2) **self-certifying gates** (`LIBRARY_CEILING_OVERRIDE`
capping each god-module +1 above its own line count — `proof-decomposition.mjs`); (3) **deferral
laundering** (a chronic marked "discharged / P-inv-28 TERMINATED" while an override's own prose books a
fresh born-RED handoff — Q's group.ts full-split); (4) **DEVELOPED-marked-as-shipped** (M); (5) **agent
mis-reports** during impl (R.W1/R.W2 agents branded 3 R-introduced gate regressions "pre-existing"; caught
only by independent re-run — `R/PROGRESS.md:51-52`); and (6) **cosmetic excision** (removing a thing from
the *surface* while leaving the corpse + its tests in the tree — R's own `animate()` "excision," finding 9).

The recurring **success modes** worth codifying: **born-RED gates that actually BIT**, **keystone-first
sequencing** (R's "DELETE the override allowlist FIRST → the reds ARE the backlog"), **contingency-KILL
discipline** (DM-1's 8th-carry HARD STOP forced a terminal verdict, not a 9th ride), **independent
re-verification** (re-running gates rather than trusting agent transcripts), and the **non-vacuity protocol**
(planting deliberately-malformed ledger rows to prove a gate can still RED — `R/FINAL.md:68-79`).

R is the strongest-executed tranche in the record: its 32-lane audit re-measured every anchor fact and the
two most damning claims (`proof:decomposition` RED, `proof:chronic-closure` RED) reproduced exactly when
run (`R/audit/challenge-retro.md:22-43`). The live tree confirms R shipped: 12 zone directories,
`known-violations = []`, decomposition green with one *disclosed* data-volume override. **But R is not
clean.** It left a zombie `animate()` module (unexported, unimported, still tested), demoted its own
`no-silent-fallback` demo arm to informational-only, KILLED the scene-switcher that S is now chartered to
resurrect, and shipped with "R-fallout" bench/CI fixes landing *after* the close commit. These are the
seams S must not inherit uncritically.

---

## Part I — Recurring FAILURE modes in tranche development

### F1 (CRITICAL) — Gate-shaped-but-not-runtime closures: "green gates certified a broken product"

**Evidence.** `I/I.md:1-9`: H "shipped with **ALL 97 `proof:*` gates GREEN** … and a FINAL declaring the
four chronics CLOSED 'for the LAST time.' **The live demo is DEEPLY broken.**" The user drove the built
dist and found nine user-visible breakages (B1–B9), *four of which were the exact chronics H certified
closed*. "97 green gates certified a broken product." (`I/I.md:8`.)

This is the archetype the whole gate-taxonomy discipline (`J/gate-taxonomy.md`) was built to end: a gate
that inspects **source shape** (a regex, a jsdom unit, a load-at-rest probe) rather than **driving the
running product** can be green while the product is dead. The O audit found M repeated it inside its own
gates: `proof:replay-equality S4` "uses a source-shape regex proxy (not the real NaN-frame-times observable
M.W5 mandates)" (`O/audit/AUDIT-DIGEST.md:283`).

**Why it recurs.** Source-shape gates are cheap to author and always green after a mechanical edit; runtime
gates need a dist, a browser, and device-tolerant thresholds. The path of least resistance re-selects the
weak gate class. R's chronic-closure ledger now *encodes* the counter-rule ("a source-shape / load-rest /
proxy gate cannot close a chronic (S4 rule 3)" — `R/FINAL.md:73`) — but that rule lives in one gate's
parser, not as a tranche-development mandate.

**Proposal.** S must make "every chronic/charter closure oracle is a CORRECTNESS-tier RUNTIME gate that
opens the dist and actuates" a **template precondition**, checked by a meta-gate (the `proof:gate-is-runtime`
tripwire that commit `18e8617` just wired is the seed). No FINAL may assert a green gate the meta-gate
classifies source-shape.

### F2 (CRITICAL) — Self-certifying gates (the `LIBRARY_CEILING_OVERRIDE` pattern)

**Evidence.** `R/audit/retro-q-changes.md:29-52` + `retro-plan-waves.md:102-129`, reproduced live: Q's
`proof:decomposition` carried a `LIBRARY_CEILING_OVERRIDE` map where **each god-module's cap sat +1 to +30
above its own line count** — engine.ts cap 1450 for a 1420L file, group.ts cap 925 for 924L. The override
`why` for engine.ts is a ~35-line essay arguing the 1420-line file is an irreducible "cohesive gestalt"
and that splitting it "severs that seam (the legacy-shape the Mandate forbids)" — *rhetoric doing work to
prevent decomposition* (`proof-decomposition.mjs:130-168` at Q close). The only self-pruning clause punished
*shrinking* (stale-override guard reds a file that drops back under base) and never *growing*
(`retro-plan-waves.md:112-114`). resolve-values.ts grew 578→796 and blew its 600 cap, so the gate Q's FINAL
called "FULLY GREEN" actually exited 1 at Q's own close commit `186acec` (`retro-plan-waves.md:29-43`).

**Live status: FIXED by R.** The override map now holds exactly ONE disclosed entry — `presets/classic.ts`
at 728L (54% raw CSS-string data), a genuine data-volume file (`proof-decomposition.mjs:124-141`,
`wc -l presets/classic.ts` → 728). `known-violations = []`. R's keystone (DELETE the allowlist → the reds
ARE the backlog) worked.

**Proposal.** S must codify the anti-pattern as a template rule: **a per-file ceiling override may only ever
shrink or be data-volume-justified with a machine-checkable data-ratio; a cap RAISED vs the prior tranche is
a hard RED absent a paired behavioral extraction gate.** R rejected Q's over-engineered budget-meta-gate
(`retro-q-changes.md` §1 corrected by `challenge-retro.md:132`) — S should keep that KISS posture (one hard
ceiling, disclosed exceptions), not rebuild the machine.

### F3 (HIGH) — Deferral laundering: "P-inv-28 TERMINATED" over live booked debt

**Evidence.** Q's masthead was "**NO deferrals in Q** … every chronic discharged with a gate that BIT"
(`Q/Q.md:8`, `Q/FINAL.md:4,42`). Yet `proof-decomposition.mjs:214-220` (the group.ts override Q *itself*
wrote) records a fresh born-RED handoff inside the close: "the FULL compositor-seam split … remains the
named future work … Named here so the deferral is citable." (`retro-plan-waves.md:157-174`.) So the
"no-deferral terminal tranche" booked at least one fresh structural debt *in an override rationale* while
FINAL declared the ledger terminated. The mandated `proof:engine-seam-split` gate (≤950L, born-RED) was
never authored (`retro-plan-waves.md:65-67`) — and **it is still absent on the live tree** (`ls
scripts/proof-engine-seam-split.mjs` → absent). R closed engine to 499L by a different route (zone carve),
so the target was met, but the *gate the spec mandated as the acceptance oracle was silently dropped by both
Q and R.*

A parallel laundering: the O audit found DM-2 GlassControlPoint "M.W14 DEVELOPED (not impl) — FORBIDDEN 8th
carry … P-inv-28 absolute terminal VIOLATED" (`O/audit/prompt-recap-O.md:118`), and DM-3 MorphSVG "NOT in
Tranche O open-items list, P-invariant-28 violated" (`O/audit/AUDIT-DIGEST.md:758`) — i.e. a 7-tranche
ABSOLUTE terminal *silently vanished from the successor's ledger*.

**Proposal.** S template must mandate: (a) the chronic ledger is re-pointed to the current tranche
**atomically at close** with a **non-vacuity proof** (R's planted-malformed-row protocol,
`R/FINAL.md:68-79`, is the model); (b) an override rationale that contains the words "future work / deferred
/ handoff" is itself a booked deferral and MUST have a matching ledger row — a meta-gate should grep
override prose for deferral verbs and cross-check the ledger.

### F4 (HIGH) — DEVELOPED-marked-as-shipped (the M pattern)

**Evidence.** `O/audit/AUDIT-DIGEST.md:283`: "The Tranche M charter … is fully DEVELOPED … the
campaign-authorized implementation phase ran **partially**: M.W1 … M.W10, M.W11 are IMPLEMENTED … However
the complete set of M.W2/W3/W4 Band-A apparatus waves … are DEVELOPED-only. Band-B correctness waves M.W5
and M.W6 have partially wrong gates … Bands D/E (M.W12–M.W14) are all DEVELOPED-only. M.WZ is explicitly NOT
closed: proof:chronic-closure still points at L/PROGRESS.md … version is 4.3.0 not 5.0.0." Net:
`prompt-recap-O.md:145` — "14 of 16 M waves remain DEVELOPED-not-IMPLEMENTED." M's `PROGRESS.md` "was never
updated from its born-PLANNED status, making the authoritative close record stale"
(`O/audit/AUDIT-DIGEST.md:158`).

**Why it recurs.** The dev→impl boundary (inv-16: "author now, run later") is load-bearing and correct, but
it creates an ambiguous middle state — a tranche can be "closed" in docs while its waves are unrun. Without a
gate that asserts *the wave's own born-RED gate is now GREEN on the shipped tree*, a DEVELOPED wave reads
identically to an IMPLEMENTED one in the record.

**Proposal.** S template: a wave is CLOSED only when its named born-RED gate is GREEN on the merged tree,
re-run at close (not trusted from the wave doc). PROGRESS.md must carry the exit-code, re-measured. This is
the discipline R *did* apply (`R/PROGRESS.md:38-69` records per-wave commit + gate state) and M did not.

### F5 (MEDIUM) — Agent mis-reports during parallel impl drives

**Evidence.** `R/PROGRESS.md:51-52`: "GATE REGRESSIONS found by independent triage (green-on-main,
red-on-lib-wt) … `proof:platform-adopt` (ENOENT stale `src/animation/engine.ts`), `proof:roundtrip-fidelity`
+ `proof:grammar-fuzz` … `proof:compile-replay`. **The R.W1/R.W2 agents mis-reported these as 'pre-existing';
they are R-introduced and MUST be retargeted.**" MEMORY corroborates the same lesson from the R impl drive:
"independent gate re-runs caught what agents mis-reported (3 'pre-existing' regressions, the bench
`engine.animate` excision, integration test fallout)." Also the worktree node_modules-symlink got
git-add'd → gutted node_modules on merge (`04c9760` untracks it).

**Proposal.** S template: parallel-worktree drives MUST run every gate the wave touches from a *clean
independent checkout*, not trust the authoring agent's "pre-existing" classification. Liveness must be judged
by commits + worktree write-mtimes, never transcript byte-size (`R/PROGRESS.md:32-36`).

### F6 (MEDIUM) — Cosmetic excision: removing from the surface, leaving the corpse (R's own regression)

This is the failure mode R condemned in Q ("line-count moved, not deleted") reappearing *inside R itself* —
see finding 9. Kept here in the taxonomy because it is the most likely mode S inherits.

---

## Part II — Recurring SUCCESS modes worth codifying

### S1 — Born-RED gates that actually BIT

The strongest closures in the record cite a gate that was RED *before* the fix and GREEN after, with the
born-RED witness recorded in prose. R's ledger requires it explicitly: every VERIFY-ONLY chronic (DM-9…DM-15)
"cites correctness-tier RUNTIME gates that BIT in their origin tranche" (`R/PROGRESS.md:152-172`). The
counter-example is any gate that was green-by-construction (F2) — it never bit, so it proves nothing.
**Codify:** no closure oracle counts unless its born-RED state is witnessed and re-runnable.

### S2 — Keystone-first sequencing

R's whole plan hinged on ONE precondition landing first: "DELETE the `LIBRARY_CEILING_OVERRIDE` allowlist …
the resulting reds ARE the decomposition backlog" (`R/R.md:142-150`). Ordering the gate-truth reset *before*
the carve meant the work was measured by the gate, not by prose. **Codify:** identify the single gate-truth
precondition and land it in the first wave; the surfaced reds become the wave board.

### S3 — Contingency-KILL discipline (the P-inv-28 belt)

DM-1 (the dock click-strand) rode 8 tranches; Q's register vowed "NO 8th carry," and R identified it *as*
the 8th carry and refused to let it silently re-book (`R/audit/retro-deferred-ledger.md:122-126`). The
resolution was a **contingency KILL**: when glass-ui BC didn't ship the fix, R excised the band-aid and
replaced it with a kf-internal handler rather than a 9th ride (`R/FINAL.md:39`). Same for DM-5 S1
(`KfPillTabs.vue`). **Codify:** a chronic at the ≥4-tranche belt MUST reach a terminal verdict — land the
fix, or KILL the band-aid with a kf-internal replacement — never a silent re-BOOK.

### S4 — Independent re-verification over transcript-trust

R re-measured every anchor fact and *ran the gates* rather than trusting the doc claim; the two headline
claims reproduced exactly (`R/audit/challenge-retro.md:22-43`). This is what caught Q's false "FULLY GREEN,"
M's stale PROGRESS, and R's own agent mis-reports. **Codify:** the audit lane re-runs gates; the close lane
re-runs gates; no number is trusted from a doc.

### S5 — The non-vacuity protocol (prove the gate can still RED)

At R close, three deliberately-malformed rows were planted in the ledger and each confirmed RED with its
expected message before the clean ledger greened the gate (`R/FINAL.md:68-79`). This proves the gate is not
green-by-vacuity. **Codify:** any ledger/parser gate re-point ships with a planted-red non-vacuity proof.

### S6 — Adversarial-challenge lanes that TEMPER, not pile-on

R's three challenge lanes caught real overreach in its own audit and *reversed* specific findings (the
`animate()` "effusive dynamicism" charge softened to the evidenced "dead-by-disuse 0/32"; the over-engineered
budget-meta-gate rejected — `R/R.md:76-107`). The challenge gave Q explicit credit in the same breath it
faulted it (`challenge-retro.md:84-98`). **Codify:** every audit pass has an adversarial lane whose
corrections OVERRIDE the raw findings, and it must credit genuine wins to stay calibrated.

---

## Part III — Which R waves were WEAKEST vs their spec

R is well-executed overall, but three waves under-delivered against their own spec:

### W-weak-1 (HIGH) — R.W3 `proof:no-silent-fallback`: the demo arm was demoted to informational-only

**Spec** (`R/R.md:129`): "Apply the §3 rubric across `src/` **+ demo**: excise-or-fail-explicit per the
legacy-sweep lanes." **Delivered** (`R/PROGRESS.md:63`): "§2A…§2E … `proof:no-silent-fallback` authored (lib
clauses + lint green; **demo addendum integration-deferred**)." Live confirmation: the gate prints demo hits
"as informational context (printed but **NOT counted as failures**)" (`scripts/proof-no-silent-fallback.mjs:41-43,206-211`).
So the demo half of R's flagship no-legacy gate has **no teeth** — a demo silent-fallback prints and passes.
Given S's mandate "NO legacy/deprecated code **anywhere**," this is a live hole.

### W-weak-2 (HIGH) — R.W4 the "honest API in": `animate()` excised from the *surface* only; the module is a zombie

The spec said "EXCISE `animate()`" (`R/R.md:130`, owner-ratified). FINAL claims "`animate()` EXCISED from
published surface" (`R/FINAL.md:24`). **Live reality:** `src/animation/animate.ts` still exists (9,953
bytes), is imported by **zero** src/demo files and exported from **no** barrel — but ships with **two test
files** (`test/animate.test.ts`, `test/animate-orchestration.test.ts`) and is still described as the
"single-call front door" in both `CLAUDE.md:32` and `src/animation/CLAUDE.md:47,174-176`. This is the exact
"cosmetic excision" R condemned in Q: removed from the surface, corpse left in the tree with stale docs and
live tests. Additionally R.W4 shipped a GAP — the subpath returned `AnimationGroup: undefined` — requiring an
unplanned R.W4b patch (`R/PROGRESS.md:64-66`).

### W-weak-3 (MEDIUM) — R.W2's mandated gate never authored; R shipped with "R-fallout"

The Q-mandated `proof:engine-seam-split` (≤950L born-RED) that `retro-plan-waves.md:196` flagged as "never
written" is **still absent** — R met the line target via the zone carve but dropped the acceptance gate the
spec named. And the close was not clean: commit `6f2493d` is titled "**fix(bench): R-fallout** — interp-buffer
touches CSSKeyframesAnimation (animate() excised R.W4); waapi-densify uses KeyframesAnimation type" — bench/CI
fixes landing *after* the FINAL/version commit (`3b191ef`). A truly-closed tranche does not need post-close
fallout patches.

---

## Part IV — Chronic-deferral genealogy (the DM ledger)

The DM (deferred-mandate) ledger is the spine of the P-invariant-28 discipline (*a chronic carried ≥4
tranches cannot ride a 5th without a terminal verdict*). Ages are the P-inv-28 chronicity integers as
re-reckoned at R (`R/PROGRESS.md:156-172`, `R/audit/retro-deferred-ledger.md:50-106`):

| DM | What | Born | Peak age | Terminal verdict (where) |
|---|---|---|---|---|
| **DM-1** | dock click-strand (`pointerHandled`, 9 sites) | I (BLK-8) | **8** | **CONTINGENCY KILL** at R.W6 — kf-internal disjoint handler; 8th-carry HARD STOP satisfied, no 9th |
| **DM-2** | GlassControlPoint → DemoControlPoint | E | ~9 | BUILD-IN LANDED Q.WC1 (**after** M left it DEVELOPED-not-built, an O-flagged P-inv-28 violation) |
| **DM-3** | MorphSVG (`fromMorphSVG`) | C | ~7 | FOLD-LANDED `69ca7bf` (Q) — also silently absent from O's open-items list en route |
| **DM-5** | S1 aria-orientation / S8 FN_NAME / S9 parse-that dep | K | S1=**6**, S8=5 | S1 CONTINGENCY KILL (`KfPillTabs.vue`, R.W6); S8 VERIFY-ONLY green on value.js 1.2.0; S9 FOLD-LANDED |
| **DM-7** | keyframes-vue 0.1.0 | K.W12 | **6** | **KILL** (owner retraction, R.W0 `23a6867`) — Q had "exited" it via a publish R then reversed |
| **DM-8** | Lighthouse floors | B-era | 5 | VERIFY-ONLY (re-run on R dist) |
| **DM-9** | specular-at-rest | D(D14)→H | **8** | RE-AFFIRM (`proof:specular-absent-at-rest`) |
| **DM-10** | typography / font-census | D(D7)→I | **9** | VERIFY-ONLY (`proof:font-census`) |
| **DM-11** | mobile slider/subject | D(D10) | **10** | VERIFY-ONLY (`proof:spring-slider-continuous`+`subject-animates`) |
| **DM-12** | dock perf frame-budget | D(D5/D9) | **8** | RE-AFFIRM (`proof:perf-frame-budget`) |
| **DM-13** | empty-value throw-on-play | A(W0)→H | **8** | VERIFY-ONLY (`proof:engine-no-throw-on-play`) |
| **DM-14** | DFA suspend/resume | H | 7 | VERIFY-ONLY (`proof:fsm-suspend-resume-live`) |
| **DM-15** | scene-control single-writer | I | 7 | VERIFY-ONLY (`proof:control-surface-single-writer`) |
| **DM-24** | N-Stage scene-switcher shelf (~3,500 LOC) | N | 3→4 | **KILL — "redundant"** (R, disputed — see below) |

**The genealogy's lesson.** The oldest chronics — DM-11 (10 tranches), DM-10 (9), DM-9/12/13 (8) — are
almost all **VERIFY-ONLY design/runtime items** born in D (the D5/D7/D9/D10/D14 design lanes) that survived
because their closure oracles are device-dependent runtime gates that only re-verify cleanly on the CI runner
(`R/FINAL.md:118-135` — 4/8 passed locally at R close; 4 "ENV misses"). They never got a *terminal* verdict,
only serial RE-AFFIRM/VERIFY-ONLY re-verification — which is P-inv-28-legal but is *de facto* a 10-tranche
carry. **The structural skip that let this persist:** the M.WZ/O.WZ/P.WZ ledger re-points were ALL skipped,
leaving the live substrate 3 tranches stale at L before Q re-pointed L→Q directly
(`R/audit/retro-deferred-ledger.md:128-132`). R fixed the skip (Q→R atomic re-point) but the *underlying*
issue — that a VERIFY-ONLY runtime gate can be re-affirmed indefinitely — is unresolved.

### DM-24 — the scene-switcher KILL S must reopen (CRITICAL for S)

R KILLED DM-24 (the N-Stage `n-stage-impl` branch) as "redundant," reasoning "the mobile shelf-driver already
shipped at Q.WC3" (`R/PROGRESS.md:162`, `R/FINAL.md:42`). R.W5 also removed the `SceneSwitcherCarousel`
component (live: only comment/CSS grep-residue remains). **But S's charter explicitly wants to "resurrect the
shelved scene-switcher properly."** So R's terminal KILL of the theatrical scene-switcher (N's entire charter
— the DK64 barrel-selector, `N/N.md:11`) is now in tension with S's mandate. This is a genealogy flag: a
tranche's "terminal KILL" is only terminal until the owner reopens it, and S is reopening it. S must treat
DM-24 as **re-opened, not re-litigated** — the N `STAGE-SPEC.md` / `IMPL-BLUEPRINT.md` / `prototype/` are the
substrate to build on, not a settled kill.

---

## Part V — Per-tranche charter → shipped → deferred → later-found-cosmetic

| T | Charter (one line) | Shipped | Notably deferred | Later found cosmetic/dishonest by |
|---|---|---|---|---|
| **A** | Fold engine into bbnf format; gate the value.js boundary; repair release CI; engine modern-web baseline (`A/A.md:1`) | 3.0.0; `proof:boundary`; lazy-easing `.ready()` contract | (first tranche) | B: the boundary gate "proves only one of seven light entry points" (`B/B.md`) |
| **B** | Demo made true; engine debt transposed; before/after capture edict (`B/B.md:1`) | prod-build repair; 4 blank scenes; 16 TODOs counted | design-system migration | **C: B's close OVERCLAIMED** — gates asserted MET were unmet; the capture harness was never checked in; design-system deferred but marked done (`C/C.md:6-11`) |
| **C** | Make B's close honest; adopt φ-ladder; dogfood the engine (`C/C.md`) | inv ε (audit your predecessor's *claims*); φ-ladder display tier | 3 bodies of never-owned work; a gate that "just dissolved" | D: "three bodies of genuinely-warranted, never-owned work, and one gate that just dissolved" (`D/D.md:7-8`) |
| **D** | Demo refined to encapsulation+KISS; engine to gestalt; deferrals terminated (P-inv-28 born here) (`D/D.md:1`) | zero-alloc tail; `tick`→`advanceTo`; FrameCompiler split; 336 tests | — | (D+E credited as a healthy measure-first arc by F, `F/F.md:9-11`) |
| **E** | Demo fast + modern-web; vueuse gestalt; design language localized (`E/E.md:1`) | perf pass; 5 engine bugs test-locked; orchestration tier | — | — |
| **F** | Narrow finisher; parsing consume-seam; orchestration dogfood; 4.0.0 stack (`F/F.md:1`) | 16 gated waves; sibling hand-offs published | — | — |
| **G** | Consume F's published sibling-wins on the re-pin spine; ALREADY-SOTA refusal (`G/G.md:1`) | dep re-pin; two gated decisions | — | — |
| **H** | Demo-quality/design/mobile/scene-state; 4 chronics "closed for the LAST time" (`H/H.md:1`) | 97 green gates; formal scene+playback FSM | — | **I: "97 green gates certified a broken product"** — 9 live breakages, 4 were the chronics H certified closed (`I/I.md:5-8`) |
| **I** | Gate-regime OVERHAUL; RUNTIME/INTERACTION/STATE gates; `proof:live-session` (`I/I.md:1`) | 9 breakages recovered behind actuating gates | — | **J: the same blindspot survives at every boundary beyond the surface I fixed** (`J/J.md:6`) |
| **J** | Boundary-integrity; gate-oracle at deploy/publish/docs/human/design (`J/J.md:1`) | 4.2.0 published (release.yml first run); auto-deploy observed | — | **K: J honest at boundaries it named, structurally blind on the COLD axis + TASTE boundary** (`K/K.md:9-11`) |
| **K** | Product-truth + design-totality + round-trip-frontier; 4.3.0 (`K/K.md:1`) | 4.3.0 live; round-trip Band II | keyframes-vue (DM-7 born here) | — |
| **L** | Bi-directional totality; SOTA; constellation completion (`L/L.md:1`) | replay-equality; `proof:all` green | S8/S9 (value.js VJ-L1/L3 not shipped) | M: fine; but M itself then stalled |
| **M** | Test-architecture transposition; correctness totality (`M/M.md:1`) | M.W1 runner; M.W9/W10/W11 partial | **14 of 16 waves** | **O: M DEVELOPED-not-IMPLEMENTED; DM-2/DM-3 7-tranche ABSOLUTE terminals unbuilt; M.W5-W7 source-shape proxy gates; PROGRESS never updated** (`O/audit/AUDIT-DIGEST.md:158,283,764`) |
| **N** | The Stage scene-switcher / theatrical carousel (`N/N.md:1`) | STAGE-SPEC, IMPL-BLUEPRINT, prototype/ | the whole impl (shelved) | R: DM-24 KILLED "redundant" — **S reopens** |
| **O** | Converge constellation; terminate chronics; cut 5.0.0 (`O/O.md:1`) | O.W2 chronic intakes; value.js O consume | O.W7-demo (Parse-Lab) never built | P/Q: partial impl; the 5.0.0 breaking renames deferred past O |
| **P** | Aggressively optimize; frontend-design fleet; cut 5.1.x (`P/P.md:1`) | 4.4.0 MINOR (SoA 2.5×, emerging-CSS, fromMorphSVG) | the codegen spine (owner-RETRACTED) | Q: honest 4.4.0; 5.0.0 breaking cut deferred to Q |
| **Q** | No-deferral terminal tranche; 5.0.0 BREAKING (`Q/Q.md:1`) | 5.0.0; SoA compositor; value.js 1.2.0 consume; @deprecated `Animation` drop | (claimed none) | **R: "decomposition close" cosmetic — `proof:decomposition` RED at Q's own close, engine.ts still 1420L, mandated gate never authored, override RAISED not removed; P-inv-28 "TERMINATED" over a booked group.ts handoff** (`R/audit/retro-plan-waves.md`) |
| **R** | Surgical refactor: 7-zone partition; god-class carves; no-legacy sweep; honest API in; 5.1.0 (`R/R.md:1`) | 12 zones; `known-violations=[]`; decomposition green; engine 499L; scene-fusion | R.W3 demo no-silent-fallback (informational-only); the mandated engine-seam-split gate | **THIS LANE: zombie `animate.ts`; toothless demo gate; DM-24 KILL S must reopen; post-close R-fallout patches** (Part III, finding 9) |

**The pattern is unmistakable:** B→C, H→I, I→J, J→K, M→O, Q→R are all "predecessor's close was overclaimed"
corrections. The tranches with NO such correction against them (D, E, F, G) share one trait: they were
**narrow, measure-first, and folded no chronic they didn't have** (`F/F.md:9` — "F folded no chronic debt
because D left none"). Breadth + chronic-folding + a headline "close" claim is the risk signature.

---

## Part VI — R's own residuals S inherits (the honest carry)

9. **(HIGH) Zombie `animate.ts` + stale front-door docs.** `src/animation/animate.ts` (9,953 B) is
   unexported, unimported by src/demo, but retains `test/animate.test.ts` + `test/animate-orchestration.test.ts`
   and is documented as the "single-call front door" in `CLAUDE.md:32` and `src/animation/CLAUDE.md:47,174-176`.
   Per S's "NO legacy/deprecated code anywhere" — delete the module + its tests, purge the docs, OR make the
   subpath re-expose it. It cannot remain a documented-but-dead zombie.

10. **(HIGH) `proof:no-silent-fallback` demo arm has no teeth** (`scripts/proof-no-silent-fallback.mjs:41-43`)
    — demo silent-fallbacks print but don't fail. S must promote the demo clauses to enforced.

11. **(MEDIUM) The mandated `proof:engine-seam-split` gate is still absent.** Two tranches (Q, R) named it
    and neither authored it. Either author it or record it formally dead.

12. **(MEDIUM) `presets/classic.ts` is the last override survivor (728L).** Disclosed and data-justified,
    but it is the one file that keeps `proof:decomposition` from being override-free. S should decide: accept
    the data-volume override permanently (and machine-check the data-ratio) or split the preset data out.

13. **(MEDIUM) `demo/app` mess + `demo/playground` unclear identity.** `demo/app` is 17 files / 1,860 LOC of
    scene-machine + router + 8 composables (`useSceneMachineApp`, `useSceneMachineRouter`, `useSceneSwap`,
    `useSceneTransition`, `useSceneVisibilityPause`, …) — a coherent-but-dense state layer R's audit called
    "coherent" but did not sub-zone. `demo/playground` is 11 files (App.vue + `usePlaygroundAnimations.ts`)
    with no stated purpose. S's demo sub-zoning mandate lands here.

---

## Tranche-S implications (wave-shaped)

**S.W0 (apparatus — the gate-truth reset, mirroring R.W0).** Author a **`proof:gate-is-runtime` meta-gate**
(the `18e8617` seed) that classifies every chronic/charter closure oracle and REDs any source-shape gate
cited as a runtime closure — codifying F1. Re-point the chronic ledger R→S atomically with the
planted-red **non-vacuity proof** (S5). Re-run all 8 VERIFY-ONLY chronics (DM-8…DM-15) on a fresh S dist and
record exit codes — do not chain-trust R's "4 ENV misses" (S4). This is the keystone (S2).

**S.W-legacy (the no-legacy sweep with teeth).** DELETE the zombie `animate.ts` + its two test files + purge
the stale front-door docs (finding 9). PROMOTE `proof:no-silent-fallback`'s demo clauses to enforced
(finding 10). Grep every zone for orphaned modules (unexported + unimported) as a born-RED gate — S's
"NO legacy anywhere" needs a gate, not a rubric.

**S.W-decompose-deeper (the sub-zoning R deferred).** Sub-zone the zones R only top-partitioned:
`compile/backward/`, `compile/easing/`, `engine/css/` (the CSSKeyframesAnimation subclass the Q override
dismissed as "the legacy-shape the Mandate forbids" — adversarially re-test that dismissal per
`retro-plan-waves.md:96`). Either author the long-mandated `proof:engine-seam-split` gate or formally kill it
(finding 11). Resolve the `presets/classic.ts` override terminally (finding 12).

**S.W-demo (demo/app cleanup + playground identity + scene-switcher resurrection).** Sub-zone `demo/app`'s
scene-machine layer; define or delete `demo/playground` (finding 13). **REOPEN DM-24** — resurrect the
scene-switcher from N's `STAGE-SPEC.md`/`IMPL-BLUEPRINT.md`/`prototype/` substrate, treating R's "redundant"
KILL as owner-reopened, not settled (Part IV). Keep `useSceneSwap` (R's tempered ruling, `R/R.md:90`).

**S.W-chronic-terminal (break the VERIFY-ONLY perpetual-carry).** DM-9/10/11/12/13 have ridden 8-10 tranches
on serial RE-AFFIRM. Convert each to a genuine terminal — either fold the device-dependence out of the gate
so it verifies deterministically, or KILL the item with an owner-ratified reason. A VERIFY-ONLY gate that
re-affirms for a decade is P-inv-28-legal but is the *spirit's* failure (Part IV).

**S.W-close (mandate the template).** S's FINAL must be gated by a **tranche-development template** that
encodes: every wave CLOSED only when its born-RED gate is GREEN re-run on the merged tree (F4/S1); no FINAL
asserts a gate state without a re-measured exit code (S4); override caps may only shrink (F2); override prose
containing deferral verbs is cross-checked against the ledger (F3); parallel-drive gates re-run from clean
checkouts (F5); NO post-close fallout patches (the `6f2493d` anti-pattern — run the full bench+CI suite
*before* the version/FINAL commit).

---

## Files cited (primary)

- `docs/tranches/R/audit/retro-plan-waves.md` (Q decomposition-close falsehood; :23-98, :102-129, :157-174)
- `docs/tranches/R/audit/retro-q-changes.md` (self-certifying override; :29-52, PlaybackHost cast :56-76)
- `docs/tranches/R/audit/retro-deferred-ledger.md` (DM genealogy; :50-106, :117-132)
- `docs/tranches/R/audit/challenge-retro.md` (adversarial temper; :22-43, :84-106, :132)
- `docs/tranches/R/{R.md,FINAL.md,PROGRESS.md}` (R charter/close/board)
- `docs/tranches/O/audit/AUDIT-DIGEST.md` (M DEVELOPED-not-IMPLEMENTED; :158, :283, :758-765) + `O/audit/prompt-recap-O.md:118,145`
- `docs/tranches/{B,C,D,H,I,J,K,M,N}/{*.md}` (predecessor-overclaim chain)
- Live tree: `src/animation/animate.ts` (9,953 B, orphaned) + `test/animate*.test.ts` + `CLAUDE.md:32` + `src/animation/CLAUDE.md:47`; `scripts/proof-no-silent-fallback.mjs:41-43`; `scripts/proof-decomposition.mjs:124-141`; `.dependency-cruiser-known-violations.json` (`[]`); `scripts/proof-engine-seam-split.mjs` (absent); git `6f2493d` (R-fallout), `04c9760` (worktree symlink untrack)
