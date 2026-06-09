# Tranche I — HARDEN REVIEW 2 (adversarial re-harden) · the convergence scorecard + the IMPL-ready verdict

**Agent:** HARDEN-REVIEW-2 (adversarial). **Branch:** `tranche-i-dev`. **Type:** TRANCHE
DEVELOPMENT — this file is the deliverable; ZERO source/test/CI edits, NO git commit.
**Date:** 2026-06-08.

**Charge.** Re-harden the WHOLE reconciled Tranche I AFTER the convergence lanes closed the
14-item §5 fix-list of the first harden review (`audit/harden-review.md`). Read every spine doc
(`I.md`, `PROGRESS.md`, `PATH-FORWARD.md`, `waves/README.md`), every wave (`waves/I.W0..I.W7.md`
+ `waves/I.WZ.md`), and `recap-chronic.md`. VERIFY each fix-list item is CLOSED, citing a
`file:line` first-hand. Check NO NEW contradiction was introduced at the file-disjoint seams the
9 lanes own (B2 spec between I.W1 + I.W7; cubic-bezier between I.W0 + I.W2; budget between I.W7 +
every wave; taxonomy between the charter + every wave). Confirm the precept is now MECHANICALLY
prior. Score each fix CLOSED / PARTIAL / OPEN; state the exact remaining fix for any PARTIAL/OPEN.

**Method.** Read first-hand, this pass: `I.md` (charter, full), `PROGRESS.md`, `PATH-FORWARD.md`,
`waves/README.md`, `waves/I.W0..I.W7.md`, `waves/I.WZ.md`, `audit/recap-chronic.md`, plus targeted
greps of `recap-prompts.md`, `recap-deferred.md`, `recap-precepts.md`, `rootcause-rc-gate-blindspot.md`.
Every verdict below cites the exact line(s) I read.

---

## §0 — THE SCORECARD (the 14 fix-list items)

| ID | Severity | Verdict | One-line citation |
|---|---|---|---|
| **RED-1** | BLOCKER | **CLOSED** | ONE numbering across all four spine docs (I.W0=engine … I.W7=overhaul/CLOSES, I.WZ=close); precept bound as charter invariant at t=0 (`I.md:157,246-285`); `proof:gate-is-runtime` mechanically enforces it (`I.W7.md:331-367`); NO "overhaul leads" residue outside `harden-review.md` itself (grep clean). |
| **RED-2** | BLOCKER | **CLOSED** | `recap-chronic.md:287-327` cites the unbound-method root cause + bind-proof/`useRafScene` cure + the explicit callout box ruling out b12's stale-group hypothesis (`:307-312`); "**NO null-guard in suspend**" (`:325`); §8 fold agrees (`:430-431`). |
| **RED-3** | BLOCKER | **CLOSED (one stale-fact seam noted under §New-Contradictions / C-1)** | Synthetic `visibilitychange` is the born-RED-of-record, dock-decoupled (`I.W1.md:227-256`, `I.W7.md:240-245`); dev-server `:5174` is a NAMED exception (`I.W1.md:215-222`, `I.W7.md:246-257`). The de-coupling + dev-exception hold. BUT I.W7's dist-reproducibility FACT is stale vs I.W1's first-hand finding — see C-1. |
| **H-1** | HIGH | **CLOSED** | I.W6 clause (a) makes the PERCEPTUAL luminance delta the PRIMARY oracle; class-absence/opacity are explicitly HYGIENE corroborators "NOT an OR-escape," with the renamed-class/transparent-yet-nonzero defense (`I.W6.md:174-186,268-274`). |
| **H-2** | HIGH | **CLOSED** | The structured allowlist is defined ONCE in I.W7 S2a as a 5-tier table (`I.W7.md:197-221`) and inherited by reference in I.W1/I.W4/I.WZ/README; budget = COMPLEMENT of the named-EXCLUDED set, no regex-narrowing escape (`I.W7.md:212-216`). |
| **H-3** | HIGH | **CLOSED** | `proof:engine-line-ceiling` HYGIENE gate added as I.W0 clause (g): `engine.ts` ≤1400 OR a named-measured split landed, "enforced by machine, not authorial fiat" (`I.W0.md:146-152,247-255`). |
| **H-4** | HIGH | **CLOSED** | Two-tier taxonomy is a CHARTER INVARIANT (`I.md:159`) applied to the NEW gates (`I.W7.md:128-149`); each wave states green hangs on the runtime clause + labels its hygiene clause (I.W0 f/g, I.W1 d, I.W2's "NO source-shape clause", I.W4 e, I.W5 d, I.W6 b/c). |
| **H-5** | HIGH | **CLOSED** | I.W4 binds the thresholds: 4× throttle, dock `dropped ≤ 2` (born-RED witness 12/114), easing `dropped ≤ 3` (born-RED witness 36 / 62-under-4×); GREEN = cube-parity ≈0 (`I.W4.md:7-10,226-251,327-338`). No symbolic N. |
| **H-6** | HIGH | **CLOSED** | MODE-PERSIST (single context across the suspend/resume/switch matrix) vs MODE-FRESH named explicitly in both I.W1 (`:202-213,257-267`) and I.W7 S2 (`:184-195`); resume-iff-was-playing observable only in the persistent context. |
| **H-7** | HIGH | **CLOSED** | I.W0 clause (a) names the HOME-empty-group as the non-substitutable E1 witness (`I.W0.md:190-206`); the bare-`"cubic-bezier"` `AnimationOptionError` gets its OWN born-RED clause (e) (`I.W0.md:224-240`), split from the I.W2 readout witness (`I.W2.md:206-225`). |
| **M-1** | MED | **CLOSED** | "~98 nominal correctness gates (102 proof keys − 4 meta/aggregators; see rootcause-rc-gate-blindspot §1)" quoted consistently in I.md:18-19, PROGRESS.md:38-39, PATH-FORWARD.md:70. |
| **M-2** | MED | **CLOSED** | I.W6 S3 scoped as the gestalt-completion: clause (a) bloom-absent is the B7 deliverable; clause (b) legibility is non-blocking, "may NOT hold the bloom-removal hostage" (`I.W6.md:137-145,187-196,258-267`). |
| **M-3** | MED | **CLOSED** | I.W5 S5 states the mechanical DC-8 rule (KILL-unless-live-`startViewTransition`-consumer), with a first-hand live verdict (RESTORE + gate) and a runtime clause (e) that bites (`I.W5.md:123-147,181-193`). |
| **M-4** | MED | **CLOSED** | I.WZ elevates the revert to `I-IMMEDIATE-1` (owner Mike Babb), git-log-VERIFIES `d469e69` first-hand (drop-tip-filter, ancestor, 20 commits), defines the live post-condition, status DEFERRED-BY-USER (`I.WZ.md:50-110`). |

**Net.** **14 / 14 CLOSED.** Three blockers, seven HIGH, four MED all resolved with first-hand
`file:line` evidence. ONE stale-fact seam (C-1, MED) was introduced by the convergence and should
be tightened before/at IMPL — it does NOT re-open any fix-list item and does NOT block IMPL.

---

## §1 — THE BLOCKERS, VERIFIED FIRST-HAND

### RED-1 — ONE numbering · precept mechanically prior · no "overhaul leads" residue — **CLOSED**

All four spine docs now share ONE plan and ONE numbering — the LEAD DECISION's:
- `I.md` § The WAVE MAP table (`:331-341`): I.W0 = ENGINE empty-input (LEADS the fix waves), …
  I.W7 = THE GATE-REGIME OVERHAUL (the headline; CLOSES), I.WZ = CLOSE.
- `I.md` § "The precept is MECHANICALLY PRIOR — `proof:gate-is-runtime`" (`:246-285`) binds the
  gate-ORACLE precept as a **charter invariant at t=0** (also `:157`) and states "**This is why the
  overhaul CLOSES (I.W7) rather than LEADS**" with the precept-leads-at-t=0 / battery-closes-at-I.W7
  split made explicit (`:275-284`).
- `PROGRESS.md §1` board (`:64-83`): I.W0 = B1/B5 engine … I.W7 = OVERHAUL (CLOSES); the dependency
  note (`:76-82`) states "the gate-ORACLE precept LEADS as a CHARTER INVARIANT … NOT as a wave."
- `PATH-FORWARD.md §3` (`:115-212`): the remediation sequence is I.W0-engine-LEADS-the-fix-waves …
  I.W7-overhaul-CLOSES; "The gate-ORACLE precept does NOT lead as a wave — it is BOUND at I-open
  (t=0)" (`:120-122`).
- `waves/README.md §3` DAG (`:70-157`) + §4 (`:160-191`): rationale #0 "THE PRECEPT LEADS — as a
  CHARTER INVARIANT bound at t=0, NOT as a wave" (`:111-118`); #4 "I.W7 CLOSES … its precept was
  already bound at t=0" (`:144-156`).

The MECHANICAL enforcer is real, not asserted: `proof:gate-is-runtime` (I.W7 S6, `:331-367`) is a
meta-gate that runs from t=0 and REDS any wave whose registered §Hard correctness gate is
source-shape/load-rest/proxy/self-baseline — detection is structural (the gate script must
reference the actuating harness primitives `page.click`/`page.dispatchEvent`/`page.mouse`/
`page.dragAndDrop` over the `serveDist`+`newContext` pattern, `:344-346`). It is born-RED on
`b934a08` because H's regime has ≈0 genuinely-behavioral §Hard gates (`:355-358`). **This is the
structural answer to "the precept must be mechanically prior, not asserted-backward by the last
wave"** (`:347-354`).

**No "overhaul leads" residue:** a grep for `overhaul LEADS` / `I.W0 LEADS` / `I.W0 = THE GATE` /
`I.W9` / `keystone AND the prerequisite` / `LEADS the DAG` across all I docs returns hits ONLY
inside `audit/harden-review.md` itself (the first review's record of the original contradiction) —
ZERO in I.md, PROGRESS, PATH-FORWARD, README, or any wave. The residue is gone from every spine doc.

**Mechanically-prior confirmation:** would `proof:gate-is-runtime` fail a source-shape gate? YES —
by construction it inspects every wave's registered §Hard correctness gate and fails any that does
not actuate (`I.W7.md:338-346`); a wave cannot close on a hygiene clause (`I.md:255-265`). The
precept is enforced by a machine that runs at t=0, not by each wave author having read I.W7 first.

### RED-2 — recap-chronic cites the bind-proof cure, no null-guard workaround — **CLOSED**

`recap-chronic.md §2 B2` (`:287-327`) is fully corrected:
- The adjudicated root cause is the **UNBOUND instance-method** `playback.stop` at
  `useEasingDemo.ts:227`/`useSpringDemo.ts:365` (`:291-304`), "NOT an unarmed scene."
- The callout box (`:307-312`) records "**b12's unarmed-scene / stale-group hypothesis was RULED
  OUT** by `rc-dfa-gen §1b`" with the member-call-vs-free-call reasoning; "The cure is NOT a
  null-guard."
- The cure is "the bind-proof transposition, NOT a workaround … make `RAFPlayback`'s control surface
  bound-by-construction … AND consolidate … into ONE `useRafScene`" (`:318-324`), with "**NO
  null-guard in suspend** — that defends the call site against an undefined receiver instead of
  making the binding correct by construction, and is a WORKAROUND by this tranche's own definition"
  (`:325-327`).
- §8 fold (`:430-431`) agrees: "Cure: bind-proof `RAFPlayback` + `useRafScene` consolidation (I.W1
  S1) — NO null-guard."

The audit now speaks with ONE voice on the B2 CRITICAL cure (the wave, the PROGRESS board, and the
chronic ledger all cite the unbound-method → bind-proof transposition).

### RED-3 — synthetic-visibility born-RED-of-record · dist-vs-dev resolved · de-coupled from B8 — **CLOSED** (one stale-fact seam under C-1)

The three RED-3 sub-requirements are met:
1. **Synthetic `visibilitychange` is the born-RED-of-record** — I.W1 clause (a) (`:227-238`), I.W7
   S2b (`:240-245`): "play easing/spring → assert `isPlaying` → dispatch `visibilitychange → hidden`
   → assert ZERO `pageerror`/`unhandledrejection`/`this._gen`. NO dock gesture required."
2. **Dist-vs-dev resolved** — the dev server `:5174` is a NAMED, justified exception for the
   deterministic suspend witness (`I.W1.md:215-222`; `I.W7.md:246-257`).
3. **De-coupled from B8** — the real dock-Select gesture is split out as the ASPIRATIONAL-post-B8
   integration clause (b2) that "does NOT carry the B2 correctness authority" (`I.W1.md:246-256`,
   `I.W7.md:258-266`); the B2 correctness oracle is the synthetic tick alone.

These hold. The ONE blemish is a stale FACT in I.W7's narration vs I.W1's first-hand finding — see
C-1 (it does not re-open RED-3; the de-coupling and dev-exception are correct regardless of which
artifact the throw reproduces on).

---

## §2 — THE HIGH + MED FINDINGS, VERIFIED

- **H-1 (specular OR-escape) — CLOSED.** `I.W6.md:174-186` clause (a): the perceptual luminance
  delta over the plate at rest is the PRIMARY oracle; class-absence + `::before` opacity are
  "HYGIENE-tier CORROBORATORS … **NOT an OR-escape**"; the renamed-class / transparent-yet-nonzero
  future-glass-ui defense is spelled out (`:182-186,268-274`). The §Folds explicitly REJECTS the
  `.glass-specular-track::before { content: none }` neutralizer (`:231-235`).
- **H-2 (budget allowlist, one definition) — CLOSED.** `I.W7.md:197-221` S2a is a 5-tier structured
  table (HARD: pageerror/unhandledrejection/console.error/the `"......"` line; PROMOTED: ReadPixels/
  content-visibility warns; EXCLUDED: named dev source-map noise). The mechanism is the COMPLEMENT
  of the named-EXCLUDED set (`:212-216`) — no positive-match narrowing. Inherited by reference in
  I.W1 (`:283-284`), I.W4 (`:281-284`), I.WZ (`:198-202`), README (`:178-181`).
- **H-3 (line-ceiling gate) — CLOSED.** `I.W0.md:247-255` clause (g) `proof:engine-line-ceiling`:
  `engine.ts` ≤1400 OR a named-measured split landed + documented; labeled HYGIENE; "the C-6 ceiling
  is enforced by machine, not authorial fiat" (`:152`).
- **H-4 (two-tier on NEW gates) — CLOSED.** Charter invariant `I.md:159`; `I.W7.md:128-149` makes
  it a CONSTRUCTION RULE for every I-authored gate, machine-enforced by `proof:gate-is-runtime`.
  Each wave states green hangs on its runtime clause and labels its hygiene clause (I.W0 §spine bar
  `:264-269`; I.W1 `:268-273`; I.W2 "carries NO source-shape clause" `:247-253`; I.W4 `:261-267`;
  I.W5 `:206-216`; I.W6 `:172-173,204-214`).
- **H-5 (perf thresholds bound) — CLOSED.** `I.W4.md:7-10` header + `:226-251` clauses + `:327-338`
  design decision: throttle = 4× (single named factor), dock `dropped ≤ 2` (born-RED 12/114), easing
  `dropped ≤ 3` (born-RED 36 / 62-under-4×), GREEN = cube-parity ≈0; "No symbolic N."
- **H-6 (persistent context) — CLOSED.** Two harness modes named in both owners: I.W1 MODE-PERSIST/
  MODE-FRESH (`:202-213`, design decision `:368-376`); I.W7 S2 (`:184-195`). The resume-iff-was-
  playing continuity is observable only in the persistent context.
- **H-7 (HOME-empty-group + option-seam witnesses) — CLOSED.** I.W0 clause (a) names HOME as the
  non-substitutable E1 witness (`:190-206`); clause (e) is E-B5's OWN born-RED witness for the bare
  `"cubic-bezier"` `AnimationOptionError`, "NOT inferred from clause (d)" (`:224-240`). The ownership
  split with I.W2 is binding (I.W0 owns construction-path; I.W2 owns readout-emits-reparseable) —
  see C-2 (the cubic-bezier seam, which AGREES).
- **M-1 (gate count) — CLOSED.** Reconciled formula quoted in I.md:18-19, PROGRESS.md:38-39,
  PATH-FORWARD.md:70. The bare "~97" (H's green-tally headline) and "88 proof scripts" (the KISS
  script-file count) appear only in distinct, non-contradictory contexts.
- **M-2 (substrate scope) — CLOSED.** `I.W6.md:137-145` SCOPE GUARD: S3 is the gestalt-completion,
  clause (b) non-blocking, "may NEVER hold the bloom-removal hostage"; clause (a) bloom-absent is the
  sole B7 deliverable (`:204-214`).
- **M-3 (DC-8 rule) — CLOSED.** `I.W5.md:123-147` S5 is a mechanical KILL-unless-live-consumer rule
  with a first-hand live verdict (`startViewTransition` IS a live consumer → RESTORE + gate); runtime
  clause (e) bites (`:181-193`); "The fourth-defer is forbidden by the P-invariant."
- **M-4 (deploy-revert tracked) — CLOSED.** `I.WZ.md:50-110` `I-IMMEDIATE-1`: owner Mike Babb, the
  `d469e69` target git-log-VERIFIED first-hand (`:52-65` — drop-tip-filter commit, ancestor of
  `b934a08`, exactly 20 commits, the re-arm-auto-deploy subtlety recorded), post-condition = live
  `proof:live-session` against keyframes.babb.dev with the S2a budget (`:88`), status
  **DEFERRED-BY-USER** as a tracked decision (`:90-109`).

---

## §3 — THE SEAM CHECK (no NEW contradiction across the file-disjoint lanes)

The prompt names four load-bearing seams between disjoint lanes. I checked each first-hand.

### C-1 (the B2 dist-vs-dev FACT between I.W1 and I.W7) — **NEW MINOR CONTRADICTION · stale fact, MED**

This is the one genuine NEW seam disagreement the convergence introduced. The two waves DISAGREE on
whether the `_gen` throw reproduces on the BUILT dist:

- **I.W1 (the B2 owner) re-verified FIRST-HAND and CORRECTED the audit:** "b10 §B2 read
  '`this._gen` is dev-only' — that is a **HALF-TRUTH that must not mislead IMPL**" (`I.W1.md:46-47`).
  Its probe `b2-dist-visibility-suspend.{mjs,result.json}` proves the unbound site AND the `_gen`
  field both **survive minification** and the throw **reproduces verbatim on the built dist** (`at
  stop (engine-Do5bTwuK.js:1:2437)`), just **INTERMITTENTLY** (`:50-69,353-365`). Conclusion: "`_gen`
  is **NOT dev-only**" (`:71`); "What was 'dev-only' was the source-mapped STACK FRAME names, not the
  field/throw" (`:358-359`).

- **I.W7 (the overhaul) still narrates the OLD, now-superseded framing:** "the `this._gen` throw is
  **DEV-ONLY**" (`I.W7.md:232`); "The `_gen` throw is dev-only per the audit (b10 §B2); **the audit
  has NOT proven it reproduces on the built dist** (the dist throws `"......"`, a DIFFERENT
  fingerprint)" (`:247-249`); "the IMPL may instead re-run `b2-dfa-gen-crash.mjs` against the dist
  and, IF it captures the `_gen` JSON there … **but the audit has not done so**" (`:255-257`).

I.W1 DID do exactly what I.W7 says "the audit has not done." This is a factual contradiction at the
exact I.W1↔I.W7 B2 seam the prompt flags.

**Severity = MED, NOT a blocker.** The load-bearing RED-3 conclusions are IDENTICAL and correct in
both waves: (a) the synthetic tick is the born-RED-of-record; (b) the dev server `:5174` is the
NAMED exception for the DETERMINISTIC witness (justified in BOTH because the dist throw is
intermittent / the dev throw is deterministic); (c) the B2 oracle is de-coupled from B8. The
dev-server exception survives regardless of the dist-reproducibility fact (I.W1 grounds it on
"intermittent on dist, deterministic on dev," which is the stronger and correct justification). So
the gate posture is sound; only I.W7's stated RATIONALE for the exception is stale.

**The exact remaining fix (do at IMPL or a touch-up pass):** update `I.W7.md:232` and `:246-257` to
match I.W1's first-hand finding — replace "the `_gen` throw is DEV-ONLY / the audit has NOT proven it
reproduces on the built dist" with "the `_gen` throw reproduces on the built dist VERBATIM but
INTERMITTENTLY (`b2-dist-visibility-suspend.result.json`); it is DETERMINISTIC on the source-mapped
`:5174`, which is why the deterministic born-RED-of-record run targets `:5174` as a named exception
(the dist run is kept as the corroborator that `_gen` is not dev-only)." The exception and the
de-coupling stay; only the justification fact is corrected. (I.W7's own line `:255-257` even invites
this: "until proven otherwise" — and I.W1 has proven otherwise.)

### C-2 (the cubic-bezier clause between I.W0 and I.W2) — **AGREES**

The H-7 option-seam fix is split by ownership and the two waves AGREE precisely:
- **I.W0 OWNS the construction-path clause (e)** — `new CSSKeyframesAnimation` / `resolveEasingOption
  ← setTimingFunction` must round-trip a custom bezier WITHOUT throwing on the bare token; its §Hard
  clause (e) drives the construct/re-mount and asserts NO `AnimationOptionError` (`I.W0.md:176-182,
  224-240`).
- **I.W2 OWNS the readout-emits-reparseable clause (c)** — the unified `EasingEditor`'s readout/copy/
  persist emits a complete re-parseable `cubic-bezier(…)`/`steps(…)` literal, never the bare keyword;
  a switch-away/back re-mount throws ZERO `AnimationOptionError` (`I.W2.md:139-164,206-225,266-279,
  310-320`).
- BOTH waves state the split identically and identically note "each carries its OWN born-RED witness,
  neither inferred from the other" (I.W0 §Folds `:276-279`; I.W2 §Folds `:266-279`). The coupling
  point (the readout literal IS what the construction path must accept) is named the same in both. No
  contradiction.

### C-3 (the budget between I.W7 and every wave) — **AGREES**

I.W7 S2a defines the allowlist ONCE (`:197-221`). Every wave that carries a console clause inherits
it BY REFERENCE, never re-defining: I.W1 (`:283-284` "inherits the I.W7 structured error budget
(H-2)"), I.W4 (`:281-284` "INHERIT the I.W7 structured error-budget allowlist … the budget is one
definition (I.W7)"), I.WZ (`:198-202` "the SAME structured budget defined once in I.W7 S2a"). The
PROMOTED tier (ReadPixels/content-visibility warns) agrees with I.W3's own promotion (I.W3 clause (c)
`:147-152` promotes the GPU-stall warns past error-only; I.W7 S2a PROMOTED row `:209` cites I.W3 as
the source of the promotion). No drift.

### C-4 (the taxonomy between the charter and every wave) — **AGREES**

The two-tier taxonomy is a charter invariant (`I.md:159`) and `proof:gate-is-runtime` enforces it
on the NEW gates (`I.W7.md:128-149`). Every wave conforms: I.W0 (clauses a-e correctness, f/g
hygiene), I.W1 (a/b/c correctness, d hygiene), I.W2 (all correctness, explicitly "NO source-shape
clause"), I.W3 (all correctness — runtime drags + promoted console), I.W4 (a-d correctness, e
hygiene-flag), I.W5 (a/b/c/e correctness, d hygiene), I.W6 (a correctness, b/c hygiene). No wave
closes on a hygiene clause; each §spine bar states green hangs on the runtime clause. The meta-gate
even holds ITSELF to the taxonomy (it reads gate scripts, so it is hygiene-tier and carries no
product-correctness authority — `I.W7.md:363-367`). Consistent.

---

## §4 — TWO RESIDUAL SEAM NOTES (sub-MED · not fix-list items · IMPL hygiene)

These are NOT among the 14 fix-list items and do NOT block IMPL, but they are internal-audit
inconsistencies a careful IMPL reader should not be tripped by. Recorded for completeness (inv ε).

- **N-1 (recap-chronic still floats the REJECTED `::before{content:none}` workaround as a live
  option).** `recap-chronic.md:107` (CH-1 §1 option B) lists "suppress at the kf consume-edge with a
  scoped `.glass-specular-track::before { content: none }` (inv-16 permits a consumer to neutralise an
  unwired cosmetic at its own edge)"; `:353` ("OR neutralise at the kf consume-edge") and `:434`
  ("consume-edge suppress OR drive a real glass-ui release") echo it. The charter B7 row, I.W6 (§Folds
  REJECTED `:231-235`; §Design decisions `:244-248`), and the no-workaround precept all explicitly
  REJECT this exact neutralizer as a fork-by-another-name violating `feedback_glass_ui_root_changes` +
  inv-16. This is the B7 analogue of RED-2 (a forbidden cure surviving in the chronic ledger), but
  SOFTER: recap-chronic `:104,110-111` frames these as "Options the I authoring must choose between
  (decision, not made here)" — and the authoring DID choose (REJECT). Still, a canonical fold document
  presents a precept-forbidden workaround as viable. **Suggested touch-up (MED):** add a one-line note
  at `recap-chronic.md:107/353/434` that option (B) was REJECTED by I.W6 per the root-changes precept,
  so the ledger and the wave agree (the same one-voice fix RED-2 applied to B2). Not a blocker — the
  binding wave + charter already reject it.

- **N-2 (recap-prompts §4 has no discrete deploy-revert row).** The M-4 fix was routed to I.WZ
  (`I-IMMEDIATE-1`, DEFERRED-BY-USER) and I.WZ S2 (`:125-128`) names the recap-prompts reconciliation
  as a CLOSE-time deliverable ("the I-ask deploy-revert as a discrete prompt-derived action … now
  `I-IMMEDIATE-1`, DEFERRED-BY-USER — a STATUSED prompt-derived action"). The recap-prompts §4 I-ask
  table (`recap-prompts.md:254-268`) does not yet carry that row — but I.WZ owns the reconciliation
  and the close has not run. This is BY DESIGN (the close authors it), not a gap; recorded only so the
  IMPL knows I.WZ S2 is the home for it.

---

## §5 — MECHANICAL-PRIORITY CONFIRMATION (the deepest check)

The first review's RED-1 core demand was that the precept be **mechanically prior, not asserted
backward**. I confirm it is, by construction:

1. The gate-ORACLE precept, the error-budget allowlist, and the two-tier taxonomy are CHARTER
   INVARIANTS bound at I-open (`I.md:157,158,159`) — NON-wave, t=0.
2. `proof:gate-is-runtime` (`I.W7.md:331-367`) is the machine that runs from t=0 over the broken
   tree and every wave's gate registration; it REDS any wave whose registered §Hard correctness
   oracle is source-shape (grep / regex / re-derived table / localStorage round-trip / token /
   self-masked baseline) — detection is STRUCTURAL (the gate script must reference the actuating
   harness primitives and must NOT be a hygiene-tier script).
3. Therefore a wave authored or RUN before the overhaul cannot ship a source-shape §Hard gate
   without the meta-gate reding. **Would `proof:gate-is-runtime` fail a source-shape gate? YES** —
   that is precisely its bite, and it is born-RED on `b934a08` because H's regime has ≈0
   genuinely-behavioral §Hard gates (`I.W7.md:355-358`). The precept is enforced by a machine, not
   by authorial fiat. This is the structural answer the first review demanded — CONFIRMED.

The complement is also installed: `proof:chronic-closure` rewired (S4, `:297-307`) polices the
chronic ROWS' cited gates; `proof:gate-is-runtime` (S6) polices the GATES' SHAPE. Together they make
the two-tier taxonomy machine-enforced from t=0, not authored.

---

## §6 — THE VERDICT

**Tranche I is IMPL-READY.** All 14 fix-list items of the first harden review are CLOSED with
first-hand `file:line` evidence:
- **RED-1** is decisively closed — ONE numbering across all four spine docs, the precept bound as a
  charter invariant at t=0, `proof:gate-is-runtime` mechanically enforcing it from t=0, and ZERO
  "overhaul leads" residue outside the first review's own record. The precept is mechanically prior,
  not asserted backward — confirmed structurally.
- **RED-2** is closed — recap-chronic cites the unbound-method root cause + the bind-proof/`useRafScene`
  cure, rules out b12's stale-group hypothesis in an explicit callout, and forbids the null-guard
  workaround in both §2 and §8. The audit speaks with one voice on the B2 CRITICAL cure.
- **RED-3** is closed — the synthetic `visibilitychange` is the born-RED-of-record, dock-decoupled,
  with the dev server `:5174` a named justified exception; the B2 oracle no longer depends on the
  B8-blocked dock gesture.
- **H-1..H-7 and M-1..M-4** are all closed, each verified at its seam.

The four file-disjoint seams the prompt names AGREE at three of four (cubic-bezier I.W0↔I.W2; budget
I.W7↔every wave; taxonomy charter↔every wave). The fourth (B2 dist-vs-dev I.W1↔I.W7, **C-1**)
carries ONE NEW MINOR contradiction: I.W7 still narrates the audit's old "dev-only / not proven on
dist" framing that I.W1 then re-verified and CORRECTED first-hand (the `_gen` throw DOES reproduce on
the built dist, verbatim, intermittently). This is a STALE FACT, not a structural defect — the RED-3
conclusions (synthetic born-RED-of-record, dev-server-as-named-exception, B8-decoupling) are
identical and correct in both waves, and the dev-server exception is independently justified by
"intermittent-on-dist / deterministic-on-dev." It is MED severity, IMPL-touch-up grade, and does NOT
re-open RED-3 or block IMPL. Two further sub-MED residual seam notes (N-1: recap-chronic still floats
the I.W6-REJECTED `::before{content:none}` workaround as a live option; N-2: recap-prompts §4 lacks a
discrete deploy-revert row that I.WZ owns at close) are recorded for IMPL hygiene, neither a blocker.

**The recommendation:** PROCEED to IMPL. Fold the C-1 dist-vs-dev fact correction (the one-line
update to `I.W7.md:232,246-257` to match I.W1's first-hand finding) and the N-1 one-line REJECTED-note
into recap-chronic into the first IMPL touch-up — they are documentation-fact corrections, not design
changes, and the binding waves (I.W1, I.W6) already carry the correct substance. With those three
one-line touch-ups the audit is internally seamless. The headline holds: the gate-regime overhaul's
own keystone (the precept) is now mechanically prior, machine-enforced from t=0, and the blindspot
the tranche exists to close is closed by machine — `proof:gate-is-runtime` would itself red a
source-shape gate. The deepest irony the first review warned of (the headline gate carrying the
blindspot in its keystone) is averted.
