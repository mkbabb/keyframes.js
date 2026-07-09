# Critique x2 — Cross-cutting anti-pattern enforcement (the r2 catalogue applied to SPEC-v1 itself)

**Agent:** x2-antipattern (adversarial) · **Branch:** `tranche-s-dev` · **Date:** 2026-07-02
**Scope:** the WHOLE spec, viewed through r2's failure catalogue (F1–F6, Part IV/V) and the §7 template
mandates (T1–T12). Analysis only; no source/git touched.
**Verdict headline:** the template mandates (T1–T12) are the strongest anti-pattern armor any tranche
in the record has carried into DEVELOPMENT — but S embeds **three live instances of the exact modes it
condemns**: (1) a self-certifying causal model in the keystone (§2.1 "device-dependence plane",
falsified by p12); (2) an unfalsifiable born-RED gate as-written (S.B2's single-writer clause,
falsified by p02); (3) a meta-gate (S.Z2) that certifies FINAL's *shape* not its *truth* and a close
band that never re-gates its own keystone. Plus two deferral-laundering rows (S.E6 external-forever;
S.A1 observe-in-CI-as-terminal). **Convergence 55%.**

---

## 0. Method

For each wave I asked r2's six questions: is the gate **runtime-honest or source-shaped** (F1)? Can it
**self-certify green** (F2)? Does any disposition **launder a deferral** (F3)? Does the DAG force the
**keystone first**, or can a wave **close cosmetic-but-green** (the B→C/H→I/M→O/Q→R pattern)? And the
acid test r2 F6 poses: **would THIS gate have caught the R residue it is aimed at?** The probe fleet
(p01–p12) is treated as EVIDENCE the spec predates and has not yet absorbed.

The one empirical law r2 Part V isolates: *"the only uncorrected tranches (D,E,F,G) were narrow,
measure-first, and folded no chronic they didn't have. Breadth + chronic-folding + a headline close
claim is the risk signature."* S is the **broadest tranche in the eighteen-tranche record** (8 bands,
~40 waves, 70 folded chronics, a headline "honesty-then-altitude" close). It sits dead-center in the
risk signature. §7 T11 *names* this — the question this critique answers is whether T1–T12 **mitigate**
it structurally or merely **cite** it. My finding: mostly cited.

---

## 1. The r2 catalogue applied wave-by-wave (the enforcement table)

| Wave | Born-RED gate (as written) | Runtime-honest? | Self-certifiable? | Would it have caught R's residue? | r2 risk |
|---|---|---|---|---|---|
| **S.A0** | `gh run list` shows green push run | **YES** (real CI) | **YES — via A2** (re-tier a genuine red to observe-only ⇒ green master over broken product) | It IS aimed at the master-red residue; but its *sub-dispositions* are pre-guessed and p12-falsified | **F1/F5 (HIGH)** |
| S.A1 | `proof:chronic-closure` REDs a bare re-verify verb | source-parse (appropriate for a ledger gate) | partial — "observe-in-CI = terminal" relabels a perpetual carry | catches the bare-verb form, not the observe-only escape | **F3 (MED)** |
| S.A2 | demo-correctness green on Linux, zero continue-on-error | YES | **YES** — the correctness/observe split is the masking lever | — | **F1 (HIGH, coupled to A0)** |
| S.A4 | `ci-coverage` + reformed `gate-is-runtime` green; planted mis-tier REDs | YES (p08 confirms) | **YES** — FROZEN-discharge "deletion-with-cause" has no cause-validating meta-gate | partially (p08: mis-tier only bidirectional after a NEW symmetric clause) | **F2 (MED)** |
| S.A5 | `proof:claude-paths-live` born-RED | source-parse (correct for a doc gate) | no | YES — would have caught the 9-lane doc-authority inversion | clean |
| **S.B2** | "FSM fields reached only via PlaybackState; plant class-body mutation → RED" | **UNFALSIFIABLE AS WRITTEN** (p02: fields stay public-writable by 4 zones+demo+107 tests) | **YES — un-authorable ⇒ vacuous green** | no (the clause it names cannot be authored) | **F1/F2 (HIGH)** |
| S.B5 | `proof:decomposition` with EMPTY override map, max ≤~460L | YES | NO (empty-map is the anti-self-cert; T2 at full strength) | YES — this is the clean fix for R's last override | **clean (the model wave)** |
| S.B6 | `proof:engine-subpath-mirror` (runtime key-equality) | YES | p07: pure runtime-vs-runtime diff can't see `public.ts ⊄ AnimationEngine` — needs a TYPE-key diff | mostly | minor |
| S.C1 | `proof:no-orphan-module` (reachability) | source-shape, but **correctly** a hygiene structural gate | no | **YES — this is the exact gate that makes F6 structural** | **clean (the F6 cure)** |
| S.C2 | gate REDs on planted demo bare-catch | source-shape hygiene | no | YES — closes W-weak-1's toothless demo arm | clean |
| S.D1/D2/D3 | `proof:app-is-shell` / `shared-has-n-consumers` / `compose-scene` | mix (compose-scene is runtime-mount) | shared-has-n-consumers is source-shape; app-is-shell risks phantom-citation repeat | census-backed (T9); OK | minor |
| S.E4/E5 | `proof:scene-stage-commits` browser-actuating | **YES (best-in-class)** | no | YES | clean |
| **S.E6** | `proof:peer-satisfied` flips green (EXTERNAL) | YES *if it fires* | **the terminal never fires if 5.0.0 doesn't publish** | it is the terminal home for 3 ≥4-tranche chronics whose only exit is external | **F3 (HIGH)** |
| S.F1 | emitted VT replays visually-equiv in live browser | **YES** (p09 confirms real) | no | n/a (new) | clean; input-model edit pending |
| S.F5 | `proof:zero-alloc` mixed-leaf clause | node bench (library-correctness) | no | YES | clean |
| S.G1 | `proof:stage-visible` at 375×667 across 9 scenes | **YES** (p10 confirms) | no | YES — the systemic cure | clean; 4 wording edits pending |
| **S.Z2** | `proof:tranche-template` parses S's FINAL, REDs on violation | **DOCUMENT-SHAPE** — certifies FINAL's shape, not its truth | **YES — cannot distinguish a measured exit code from a fabricated one** | it is the meta-gate meant to catch Q/R's cosmetic close; it catches *prose form*, not *outcome truth* | **F1-at-meta (HIGH)** |
| S.Z3 | FINAL over from-clean full-roster run | YES | **does NOT re-assert master-CI-green (A0)** ⇒ keystone can silently regress A0→Z3 | this is *precisely* where Q/R shipped over a red master | **F1/F4 (HIGH)** |

The waves that are **clean by construction** (B5, C1, C2, E4/E5, F1, G1) are the ones that inherited a
born-RED runtime/structural gate aimed at the exact defect. The dangerous ones cluster where a gate is
**pre-guessed (A0/A1/A2), un-authorable (B2), document-shaped (Z2/Z3), or externally-contingent (E6).**

---

## 2. The 5 most dangerous waves (ranked)

### #1 — S.A0 (+S.A2): the keystone rests on a self-certifying causal model that p12 has already falsified

**The anti-pattern:** F1 (gate-shaped-but-not-runtime) at the *disposition* layer, plus F5 (transcript-
trust) baked into the spec. S.A0's gate ("green push run") is honest. But §2.1 point 2 asserts the 14
blocking demo reds are **"the device-dependence plane"** and S.A0/A1/A2 pre-write per-gate dispositions
(§4 rows 10/13) on that assumption. **p12 reproduced every sampled red on fast macOS — true
device-dependence render-races = 0** (p12:139); the reds are genuine source/demo defects (`cold-entry`
resume no-op, DM-14 spring resume-iff, `easing-sidebar-minimal`, `scene-perf-budget`-A2), one shared
harness importmap bug (DM-13+DM-11b), and one gate-staleness false-positive (`demo-usability`)
(p12:114–139). The spec's row 10 ("fix or calibrate") and row 13 ("timing calibrate") are the **exact
r8-F1 trap** — "mislabel a runner-red as ENV" — committed *inside the spec* (p12:159).

**Why it is #1:** the masking lever is already specified. S.A2 splits demo-smoke into demo-correctness
(blocking) + demo-device-observe (observe-only). If impl trusts the spec's "device-dependence"
framing, the cheapest path to "green push run" is to **reclassify the genuine reds as observe-only** —
green master over a broken demo, the H→I archetype ("97 green gates certified a broken product",
r2 F1) re-committed at the keystone. p12:179 states it plainly: *"treating DM-11b/DM-14 as calibrate
would ship a masking change over a deterministic bug — R's exact failure mode re-committed."* Every
downstream wave's born-RED gate is meaningless over a cosmetically-green master (§3 S.A0 rationale
concedes this), so a cosmetic A0 poisons the whole tranche.

**Blocking edit:** rewrite §2.1 point 2 and §4 rows 5/10/13 to p12's taxonomy: *genuine source/demo
(fix-by-cause) · shared harness importmap (2 gates, one fix) · gate-staleness false-positive · exit-
code decouple; device-dependence render-races = 0.* Add a **fourth S.A2 bucket: stale-gate → re-point
the parser** (p12:157). Add a hard clause to S.A0/A2: **the correctness/observe split may NOT be used
to green a red whose signature reproduces off-runner** — a demo-correctness red is discharged by cause
or by an owner-ratified KILL, never by reclassification (this is T1 applied to A2's own split).

### #2 — S.Z2 / S.Z3: the close band certifies FINAL's *shape*, not its *truth*, and never re-gates the keystone

**The anti-pattern:** F1 at the meta level + the Q→R cosmetic-close mode, un-caught by the very gate
built to catch it. S.Z2's `proof:tranche-template` "parses S's own FINAL and REDs on any violation."
Parsing prose can verify that FINAL *asserts* a re-run exit code (T10) — it **cannot verify the exit
code is real**. r2 F1's whole lesson is that a gate reading *shape* (a regex, a doc parse) passes while
the *product/record* is false. S.Z2 is that gate. It would have flagged R's 6-row FINAL table (too
small) but would NOT catch a FINAL that *cites* a green `proof:decomposition` that was actually RED at
the close commit — which is exactly what Q did (r2 F2, `retro-plan-waves.md:29-43`).

Worse: **S.Z3 does not re-assert S.A0's keystone.** "FINAL over a from-clean full-roster run with the
exact SHA" runs `proof:all` locally. `proof:all` (per p08) = library-correctness && demo-correctness &&
hygiene — but **master-CI-green is a runner fact, distinct from a local `proof:all`**. Q and R both
passed local rosters and shipped over a red master (§2.1 point 2). Nothing in Z2/Z3 REDs a FINAL that
claims closure while `gh run list --branch master` is red. The keystone can regress between A0 and Z3
and the close band is blind to it — the single most-repeated failure in the record (B→C, H→I, Q→R).

**Blocking edit:** S.Z2's template gate must include a clause that **re-executes** the closure oracle
of every wave marked CLOSED (not parse the asserted code) and REDs on any exit-code mismatch — a
re-run, not a re-read (r2 S4 "the close lane re-runs gates; no number is trusted from a doc"). S.Z3
must add a born-RED precondition: **`gh run list --workflow ci.yml --branch master` shows a green push
run on the FINAL SHA** — the keystone re-gated at close, or the tranche is not closable (this is the
A0 gate, re-armed at Z3).

### #3 — S.B2: the born-RED single-writer gate is unfalsifiable as written (un-authorable ⇒ vacuous green)

**The anti-pattern:** F1/F2 — a gate that cannot be honestly authored is a self-certifying green.
S.B2's gate: *"FSM transition fields reached only via PlaybackState (plant a class-body mutation →
RED)."* p02 (worktree-proven, tsc exit 0, tests green) shows the 8 FSM fields are a **public mutable
surface written by `group/`, `orchestration/sequence/`, `ingest/`, `waapi/`, 107 test sites, and the
demo's `contractAnim.t =` pattern** (p02:11–16, 45). "Written only through `_playback`" is
**un-gateable while `anim.paused =` remains public** (p02:138). A gate that cannot RED honestly for the
property it names is the F2 pattern in a new dress: it goes green because it can't be written to bite.

**Blocking edit (p02 supplies the exact reframe):** change the clause from *"fields written only through
PlaybackState"* to *"no FSM field is DECLARED on the class body (accessor delegates only)"* — a
declared-only check that is honest and non-breaking (p02:135–139). Note the headroom coupling: delegates
GROW `engine/animation.ts` ~13L (442→455), eating S.B5's ≤460 headroom, so **sequence B2 before B5**
(p02:142). If the owner wants literal single-writer, book it as a BREAKING wave (34 files, MIGRATION
doc) that collides with S.Z3's additive-minor default — do NOT smuggle it under "engine-internal carve"
(p02:144–149).

### #4 — S.E6: the only externally-gated wave is the terminal home for three ≥4-tranche chronics whose exit may never fire

**The anti-pattern:** F3 (deferral laundering) — a HANDOFF whose re-entry condition cannot be met inside
S is a punt wearing a terminal's clothes. S.E6 fires "only on the joint glass-ui 5.0.0 publish," and
5.0.0 **"does not exist yet"** (§1: BG ≈110 + BH ≈30 waves dev-complete, *unbuilt*). Fold-table rows
51 (aria-ask), 52 (peer-satisfied, born-RED 4 tranches), 53 (dock double-click, 4+ tranches), and 55
(pin) all name S.E6 as their terminal. But §3 says E6 is *"explicitly bookable across the S close as a
structured HANDOFF if 5.0.0 has not landed."* So if 5.0.0 doesn't publish during S — the base case, on
the evidence — **three ≥4-tranche chronics ride into T on a HANDOFF whose gate never fired.** That is
*de facto* the VERIFY-ONLY perpetual carry (r2 Part IV, DM-11's 10-tranche ride) that S's charter
(§1) explicitly claims to END. T12 authorizes "one external gate, named not assumed" — but T12 does
not make an unfired terminal a real terminal.

**Blocking edit:** S must state, in §4 and §7-T12, that if 5.0.0 does not publish before S close, rows
51/52/53 are **NOT terminal-ized by S** — they are recorded as an *explicit residual carry with an
owner-acknowledged non-terminal status*, distinct from the folded chronics. Additionally, the dock
double-click (row 53) is a kf-observable interaction bug; per S3/contingency-KILL discipline (a chronic
at the ≥4 belt MUST reach a terminal), S should carry a **kf-internal contingency fallback** (the DM-1
R.W6 precedent — excise the band-aid with a kf-internal handler) so its terminal does not depend on an
external publish at all.

### #5 — S.A4: the FROZEN set authorizes coverage loss with no cause-validating meta-gate

**The anti-pattern:** F2 (self-certification) inverted — a structural authorization to *shrink*
coverage. S.A4 declares ~54 demo-appearance gates a FROZEN SET "authorized to red," each discharged by
**"deletion-with-cause OR migration to a layout-invariant system-property gate."** p08 confirms the
taxonomy mechanics land (VERDICT confirms-spec) but flags the FROZEN discharge as *"the large
downstream cost… MEDIUM risk"* (p08:314) and notes 51 gates fold to ~6. **Nothing validates the
"cause."** A demo wave under FROZEN authorization can DELETE a gate that was catching a real defect,
write a one-line "cause," and the roster shrinks 190→~120 with a coverage hole indistinguishable from a
legitimate fold. `proof:ci-coverage` catches an *orphaned CI step*, not a *deleted gate whose property
went un-migrated*. Combined with #1's observe-only lever, S.A4 is the second coverage-erosion vector.

**Blocking edit:** every FROZEN-set discharge must be one of two *machine-distinguishable* outcomes:
(a) **migration** — the deleted gate's live property is asserted by a named successor system gate
(`stage-visible`/`occlusion-free`/`a11y`/`dogfood`), enforced by a mapping clause in `ci-coverage`
that REDs if a FROZEN key is deleted without a successor row; or (b) **KILL** — an owner-ratified row
in the S ledger with a re-run witness that the property is genuinely obsolete. "Deletion-with-cause" as
free prose is banned. Add p08's **symmetric mis-tier clause** (a library-correctness member must NOT
carry browser-harness anchors, ~15 LOC) so "planted mis-tiered gate REDs" is bidirectional (p08:284).

---

## 3. Deferral-laundering audit of the §4 fold table (the F3 sweep)

My task asks which fold-table dispositions are laundering. The table is impressively complete (70 rows,
no un-dispositioned entries — a genuine strength vs Q's silent P-inv-28 vanishing, r2 F3). But three
disposition *shapes* recur that are laundering-prone:

1. **"→ terminal shape (observe-in-CI/hard-on-device)"** — rows 6 (DM-8 Lighthouse), and the pattern
   behind 7/8/9/14. Converting a VERIFY-ONLY to **observe-only** is not a terminal; an observe-only gate
   re-affirms forever by design (it never REDs the build). This is the DM-11 10-tranche mechanism with a
   new label. S.A1 must define "terminal" as **deterministic-re-shape (device dependence folded OUT so
   the gate REDs honestly on any runner) OR ratified-KILL** — never "declared observe-only." p10:195
   independently surfaces the sibling risk (gates that ARM on deleted born-open behavior encode stale
   truth). *Contrast:* rows 22 (engine-seam-split KILL), 32 (classic.ts data-split), 23 (animate KILL)
   are **real** terminals — a gate authored/deleted, a property structurally removed.

2. **"HANDOFF … re-entry: 5.0.0 publish"** — rows 51/52/53 (see danger #4). A HANDOFF whose re-entry is
   an external event the tranche cannot cause is a punt unless its non-firing is recorded as a residual
   carry, not a terminal.

3. **"DISPATCH … else WATCH with named exit"** — row 46 (color2Into). A WATCH is a VERIFY-ONLY; "named
   exit" is the mitigation, but S must ensure the exit is *checked at S.H4* (the row says so) and not
   silently re-WATCHed. Low risk given the named exit, but flag it in the ledger's non-vacuity proof.

**Cross-check the spec already mandates (credit where due):** T3's meta-gate ("override prose with
deferral verbs cross-checked against the ledger") is the correct structural cure for laundering and is a
real advance over Q. The gap is that T3 polices *override prose*; it does not police *fold-table
disposition verbs*. Extend T3's grep to the S ledger's disposition column: a row whose disposition
contains "observe/watch/re-affirm/verify" without a paired deterministic-re-shape or KILL row REDs.

---

## 4. DAG / keystone-first analysis

**Does the DAG force the keystone first?** For the kf tree, structurally yes: `S.A0 ──► S.A1, S.A2,
S.A4, S.A5, S.C*, S.B1` — every library and gate wave has A0 as a transitive predecessor, and A4 gates
D/E/G red-declarability. This is r2 S2 (keystone-first) correctly applied. **But two holes:**

- **The DAG is advisory prose, not a gate.** Nothing REDs a wave marked CLOSED while A0 is red. Q and R
  *intended* keystone-first and still shipped over a red master. The enforcement must be a meta-gate
  (danger #2's blocking edit: Z3 re-gates A0). Without it, a parallel impl drive can close the entire
  green-locally B/F library track while A0's demo reds persist, then declare S closed — the Q/R pattern
  exactly.

- **S.H (parse-that) is "parallel to all"** with no A0 dependency. Correct (separate repo), but S.H2's
  `proof:no-span-surface` and S.H1's heap gate are that repo's own born-RED gates; ensure the S ledger's
  close (Z1) does not chain-trust "H landed" — S.H4 verifies DQ-1/DQ-2 *actually landed in 0.13.0* (row
  47), which is the right re-measure-not-chain-trust posture (r2 S4). Good.

**Can a wave ship over a red master?** In development, nothing ships — but the *impl-drive* board is
these born-RED gates, and the risk is a wave *marked CLOSED* on a locally-green gate while master is
red. The answer today: **yes, nothing stops it** (the DAG doesn't gate closure on A0-green). Fixing this
is danger #2.

---

## 5. Is the breadth+chronic-folding+headline-close risk signature (r2 Part V) MITIGATED or CITED?

**Largely cited.** §7 T11 explicitly names the signature and asserts S "compensates with T1–T10 at full
strength, keystone-first (A0), the contingency-KILL belt, and the adversarial critique fleet." Assess
each claimed compensator:

- **Keystone-first (A0):** real, but ungated at close (danger #2) and resting on a falsified model
  (danger #1). *Partially structural.*
- **Contingency-KILL belt** ("every ≥4-tranche chronic reaches a terminal"): **breached by E6** (danger
  #4) — the glass-ui ≥4 chronics reach a terminal ONLY if an external publish fires. *Cited, not
  guaranteed.*
- **T1–T10 at full strength:** this is the exact claim Q made ("NO deferrals; every gate BIT",
  `Q/FINAL.md`) and was found cosmetic by R. Restating the mandates is not the same as a gate that
  enforces them — and the enforcing meta-gate (Z2) is document-shaped (danger #2). *Cited.*
- **Adversarial critique fleet:** real and operating (this document, sa-truth-gates at 58%, the sibling
  band critiques) — the one compensator that is genuinely structural (r2 S6). *Structural.*

**The unaddressed structural option:** r2 Part V's law is that *narrow + measure-first* tranches are the
only ones never corrected. S does not consider narrowing — cutting the SOTA band (S.F) or the design
fleet (S.G4 easter eggs) to a successor, or splitting A/B/C (honesty substrate) from D/E/G (demo
altitude) into two sequential cuts. The spec's own §2.1 point 1 establishes the substrate is red TODAY
(master CI, doc authority); building altitude (E/F/G) atop it in the same tranche is precisely the
"breadth + headline close" shape. **Recommend (non-blocking, owner ruling):** state explicitly why S is
not split A/B/C-then-D/E/F/G — the burden of the risk signature is to justify breadth, not assume it.

---

## 6. Probe adjustments the spec must absorb (cross-cutting only)

These are the cross-cutting ones; band critiques own the rest.

- **p12 → §2.1 point 2 + §4 rows 5/10/13 + S.A2.** The device-dependence model is REFUTED. Not
  mechanically absorbable — it changes A0/A1/A2's *sizing and shape* (most reds need real code fixes;
  DM-11b collapses into DM-13's one harness fix; DM-14 is a genuine spring source fix; add a stale-gate
  bucket). This is the single largest evidence-vs-spec gap (p12:143–159).
- **p02 → S.B2 gate clause.** "single writer" → "single STORAGE owner / declared-only." Mechanically
  absorbable, but MANDATORY (danger #3).
- **p08 → S.A4.** Name the 5-artifact atomic co-edit set; keep `proof:demo-correctness` a direct `&&`
  chain; add the symmetric mis-tier clause (p08:268–291). Mechanically absorbable.
- **p07 → S.B6.** `proof:engine-subpath-mirror` must diff the `AnimationEngine` TYPE key list, not two
  runtime `Object.keys()` sets (post-unification both read 39/39 from the same import — a real drift
  surface goes invisible) (p07:2nd refinement). Mechanically absorbable but gate-honesty-relevant.
- **p10 → S.G1.** Add the gate-arming audit (grep the roster for `.controls-pane--open` arming waits —
  existing gates encode the deleted born-open behavior) (p10:195). This is the same class as p12's
  gate-staleness: a green gate can encode obsolete truth. Mechanically absorbable.
- **p09 → S.F1.** Role-keyed input spec + mandatory group-pseudo emission; refusal taxonomy extension.
  Band-critique owns the detail; cross-cutting note: the F1 gate ("emitted VT replays visually-equiv")
  is a genuine runtime gate — a rare clean SOTA gate (p09:154).

---

## 7. What should be PRUNED / recorded-future

- **S.G4 (one easter egg per scene)** — observe-tier, non-load-bearing, ten authored eggs. Pure altitude
  on top of a red substrate; the strongest candidate to record-future and de-risk S's breadth (see §5).
- **S.H3 (Pratt combinator, DEVELOP-only)** — already scoped "not implemented without value.js
  ratification." Keep as a design doc; it is correctly non-load-bearing. No prune needed, just confirm
  its gate ("design doc + consume-edge sketch") is not counted as a closable born-RED.
- **The "observe-in-CI = terminal" dispositions (rows 6–9,14)** — not prune, but re-shape: they are not
  terminals (§3.1).

---

## 8. Scoring

**convergence_pct = 55.** Deductions from 100:

- **−15** — S.B2 born-RED gate is **unfalsifiable as written** (p02: un-authorable single-writer clause ⇒
  vacuous green). Dishonest gate.
- **−15** — S.Z2 template meta-gate is **self-certifying at the meta level** (certifies FINAL's shape not
  its truth; cannot distinguish a measured from a fabricated exit code) AND S.Z3 never re-gates the A0
  keystone (close band blind to the Q/R cosmetic-close mode). Dishonest/insufficient gate.
- **−15** — S.E6 + fold rows 51/52/53: **deferral laundering** — three ≥4-tranche chronics whose only
  "terminal" is an external publish that may not fire in S; presented as terminal-ized, actually a
  perpetual carry (r2 Part IV mode). Unfalsifiable terminal.
- **−10** — **p12's refutation of the §2.1 device-dependence model** is not absorbable by a mechanical
  edit; it re-sizes and re-shapes the entire S.A0/A1/A2 keystone (probe adjustment, not mechanical).
- **−10** — **missing item:** no meta-gate re-executes closure oracles / re-asserts master-CI-green at
  close (the DAG's keystone-first is advisory prose, ungated — §4).
- **−10** — **missing item:** S.A4 FROZEN-discharge "deletion-with-cause" has no cause-validating
  meta-gate; coverage can shrink silently (F2-inverted).

Partial credit restored (+ vs a naive floor): T1–T12 are the strongest anti-pattern armor in the record;
the fold table has zero un-dispositioned rows (beats Q's silent vanishing); C1/C2/B5/E4/G1/F1 carry
genuinely clean born-RED runtime/structural gates that WOULD have caught their R residue; the adversarial
fleet is structural. These keep S well above the cosmetic-close tranches.

**Net: 55%** — implementable-as-written after the §9 blocking edits land; no *unresolved design
uncertainty* (every defect has a spelled fix), but the anti-pattern posture is not yet sound.

---

## 9. Blocking edits for SPEC-v2 (MANDATORY before impl authorization)

1. Rewrite §2.1 point 2 + §4 rows 5/10/13 to p12's taxonomy (genuine-fix-by-cause / shared-harness /
   gate-staleness / exit-decouple; device-races = 0); add S.A2 stale-gate bucket.
2. Add a hard clause to S.A0/S.A2: the demo-correctness↔observe split may NOT green a red whose signature
   reproduces off-runner — discharge by cause or ratified-KILL, never reclassification.
3. Reframe S.B2's born-RED clause to "no FSM field DECLARED on the class body (accessor delegates only)";
   sequence B2 before B5 for the ~13L headroom cost.
4. S.Z2 template gate must RE-EXECUTE (not re-parse) each CLOSED wave's closure oracle and RED on
   exit-code mismatch; S.Z3 must add a born-RED precondition that master CI shows a green push run on the
   FINAL SHA (re-arm A0 at close).
5. Redefine "terminal" in S.A1 and §4: deterministic-re-shape (device-dependence folded out) OR
   ratified-KILL only; "observe-in-CI/hard-on-device" is NOT a terminal (rows 6–9,14).
6. Declare rows 51/52/53 (glass-ui ≥4 chronics) an explicit non-terminal RESIDUAL CARRY if 5.0.0 does
   not publish in S; add a kf-internal contingency fallback for dock double-click (row 53) so its
   terminal does not depend on an external publish.
7. S.A4: FROZEN-discharge must be machine-distinguishable migration (successor system-gate mapping row in
   ci-coverage, REDs on unmapped deletion) OR ledgered ratified-KILL with a re-run witness; ban free-prose
   "deletion-with-cause"; add p08's symmetric mis-tier clause.
8. Extend T3's deferral-verb meta-gate from override prose to the S ledger's disposition column.
9. S.B6: `proof:engine-subpath-mirror` diffs the `AnimationEngine` TYPE key list, not two runtime
   `Object.keys()` sets (p07).
10. S.G1: add the gate-arming audit clause (grep `.controls-pane--open` arming waits; p10).
```
```
