# S.A — Truth & Gates (the keystone band)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.A** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, and fold-row this band carries is reproduced here; an implementer must NOT need
> to read SPEC-v3. Nothing runs until the owner authorizes an impl drive. A wave is CLOSED only
> when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16), and S.Z2 re-executes
> that oracle at close. **Branch:** `tranche-s-dev` · **Track:** gates.

---

## 0. Band charter — the keystone

S.A is the **keystone band**: it makes the repo's own instruments tell the truth again before any
altitude work lands on top of them (SPEC §1). Master CI has been RED on every push since Tranche K
(2026-06-16); neither Q (5.0.0) nor R (5.1.0) ever produced a green master CI; every `workflow_run`
deploy since K is skipped and both tranches shipped via manual `workflow_dispatch` (SPEC §2.1-2,
a28). The deploy-of-record is dead. The authoritative library map (`src/animation/CLAUDE.md`)
documents a tree that no longer exists (SPEC §2.1-4). S.A restores all three: green CI by cause, the
auto-deploy round-trip, and doc-authority — and it reforms the gate roster so the altitude bands
(D/E/G) can declare their born-RED appearance gates against a truthful tier taxonomy.

**The keystone's causal model, corrected (p12) — the load-bearing fact the whole band rests on
(SPEC §2.1-2).** SPEC-v1 framed the master-CI red as "two genuine source defects + a device-dependence
plane." **p12 refuted that model by reproducing every sampled red on fast macOS** (11 gates verified;
true device-dependence render-races = **0**). The red plane is a **fix-by-cause surface**, not a
reclassification surface. The verified taxonomy of the 14-blocking-red plane (11-gate sample):

- **Genuine source (2):** `proof:styling-idioms` (orphan `.morph-ghost--from`, `MorphTarget.vue:71`
  — one line) and `proof:pin-ledger-current` (PIN-LEDGER frozen at 4.4.0/1.1.0/0.12.0 vs installed
  5.1.0/1.2.0/0.13.0 — a31, CRITICAL).
- **Shared harness importmap bug (2 gates, ONE fix):** DM-13 `engine-no-throw-on-play` AND DM-11b
  `subject-animates` both ship a probe HTML mapping only bare `@mkbabb/value.js`; the lazy engine
  chunk imports `@mkbabb/value.js/math` (the value.js-O subpath split) → hard in-browser resolve
  failure. DM-11b's 30 s-timeout signature is a **swallowed** deterministic module-load throw, not a
  render race (p12 §3.1).
- **Genuine demo/source born-REDs (5):** DM-14 `fsm-suspend-resume-live` (the spring scene does not
  pause — `springPausedAfterClick=false`; a real pause/resume-continuity defect, NOT a timing
  calibrate), `cold-entry` (resume no-op on a never-started group, `scenePlaybackAdapters.ts:76-79`),
  `drag-gesture` (`userSelect:auto` mid-gesture), `easing-sidebar-minimal`, `scene-perf-budget` A2
  (AmigaScene missing `setPixelRatio(min(dpr,2))` — a static source assertion), plus `icon-paint-live`
  (`::view-transition-*` residue; glass-ui-touching — confirm the KILL target's home).
- **Gate-staleness false-positive (1):** `demo-usability` scans `router.ts` for literal `name:"…"`
  strings while R.W5 generates routes as `name: s.id` — a green demo red on the gate's own
  obsolescence (p12 §3.3).
- **Exit-code plumbing (1):** the LoAF bench step exits 1 with a GREEN metric.

The device-dependence **apparatus** concern (~50 chromium launches under a 50-minute ceiling) is real
and is cured structurally by S.A2's harness net-deletion — but it is **not why the gates are red**
(SPEC §2.1-2). The r8-F1 lesson ("a runner-red mislabeled as ENV") is live, not historical — DM-11b
and DM-14 were two fresh instances of it inside SPEC-v1 itself (SPEC §1). Accordingly S.A0 is recast
from a reclassification pass to a **cause-shaped fix-by-cause sweep** whose gate is
green-modulo-an-enumerated-born-RED-backlog.

**Rulings this band executes (SPEC §2.2).**

- **C-6 — the scene-switcher gate contradiction.** Both stale halves die in S.A: ASSERTION 3's
  carousel-absence clause is deleted (keep location/no-climb); `proof:scene-switcher-mobile` is
  retired and reborn as the stage band's born-RED acceptance gate (`proof:scene-stage-commits`,
  targeting `frontIndex`/`spinning` + commit-on-settle) at S.E4/E5. **S.A4 owns the retire + the
  ASSERTION-3 delete.**
- **C-8 — doc-regen timing, gate-first, regen-last.** S.A5 lands born-RED `proof:claude-paths-live`
  + hot-fixes the actively dangerous lines; the full `src/animation/CLAUDE.md` rewrite lands at
  **S.B8** against the final tree.
- **C-20 — "Terminal" is defined structurally.** A chronic/deferral disposition is terminal ONLY if
  it is (a) a **deterministic re-shaped gate** — device-dependence folded OUT so the gate REDs
  honestly on any runner — or (b) an owner-**ratified KILL** with a re-run witness. "Observe-in-CI",
  "hard-on-device", WATCH, and re-verify verbs are NOT terminals (they are the DM-11 ten-tranche
  mechanism relabeled). Every terminal disposition is re-derived from a **reproduced signature**,
  never inherited from the spec's pre-written guess (DM-14 is the standing proof of why). T3's
  deferral-verb meta-gate extends to the S ledger's disposition column. **S.A1 enforces C-20.**
- **C-21 — the closeable roster (T10 ⊥ T12 reconciled).** S.Z3's from-clean full-roster run is
  satisfied against the **closeable roster**: the full roster MINUS owner-ratified external HANDOFF
  gates (each named by its §4 ledger row), those gates rendered in the FINAL table as an explicit
  third state `HANDOFF — external — row N`, never omitted. **S.A0's "master push CI turns fully
  green" is re-asserted at S.Z3 under this definition (C-21/T10).**

**Mode declarations (C-14, one per wave):** S.A0 REWRITE (of the CI-red surface); S.A1 REWRITE;
S.A2 REWRITE; S.A3 REFINE; S.A4 REWRITE; S.A5 REFINE (gate) + hot-fix.

**Intra-band + cross-band DAG (SPEC §3 "The DAG").**

```
S.A0 ──► S.A1, S.A2, S.A4, S.A5, S.C1, S.C2, S.C3a, S.C3b, S.C4, S.B1, S.D1
S.A2 ──► S.A3        (auto-deploy fires when demo-correctness is green — post-backlog)
S.A4 + S.D1 ──► S.G1 ──► S.D2 ──► S.D3
S.A4 ──► BLOCKS the FROZEN reds of S.D3/S.E/S.G being declarable
```

`proof:scene-colocated` has a **canonical cross-band edit order: A4 → D2 → D3** (SPEC §3 DAG, fold
row 19; C-24). A4's FROZEN-set declaration **precedes any demo wave that reds a layout/appearance
gate** (D3, E, G — NOT D1, which reds only source-path gates, p04 F4). **S.A0 is FIRST — deps: none.**

**T11 (the risk signature) — this band's structural compensators (SPEC §7 T11).** S is deliberately
broad; S.A carries the structural (not cited) compensators that de-risk it: the cause-shaped keystone
with masking forbidden (S.A0), the observe-split no-reclassification hard clause (S.A2), the
machine-distinguishable FROZEN discharge (S.A4). These pair with S.Z2/Z3's closure re-execution +
master-green-on-FINAL-SHA precondition.

---

## S.A0 — CI-GREEN by cause, in one convergent pass (THE KEYSTONE)

**Mode: REWRITE (of the CI-red surface).** **Deps: none — FIRST.** **Blocks:** S.A1, S.A2, S.A4,
S.A5, S.C1, S.C2, S.C3a, S.C3b, S.C4, S.B1, S.D1.

### Charter

Recast per p12 from a **reclassification** pass to a **fix-by-cause sweep** (SPEC §3 S.A0; §2.1-2;
SA-3/SA-4). Every blocking red is discharged by a **named cause verified against a locally-reproduced
signature** — never by threshold-loosen, timeout-widen, residual `continue-on-error`, or
observe-reclassification. S.A0 owns items 1–6 outright (the fixes) plus item 7 (drive the full roster
to a verdict); the four **enumerated born-RED backlog** rows stay authorized-RED under named
downstream waves (NOT re-tiered). Master push CI turns fully green when the last backlog row's owning
wave closes.

### Scope items

- **S1 — The `.morph-ghost--from` FOLD (fold row 2; SPEC §2.1-2 "Genuine source").** Add the missing
  `.morph-ghost--from` rule at `MorphTarget.vue:71` — **1 line**; greens `proof:styling-idioms`
  (orphan-selector red today).
- **S2 — PIN-LEDGER re-author (fold row 3; SPEC §2.1-2, a31 CRITICAL).** Re-author
  `docs/tranches/Q/PIN-LEDGER.json` to **5.1.0/1.2.0/0.13.0** (installed) — it is frozen at
  4.4.0/1.1.0/0.12.0. Greens `proof:pin-ledger-current`.
- **S3 — The LoAF exit-code decouple (fold row 4; SPEC §3 S.A0 item 3).** Assert the **green metric**
  — a `window.__kfLoaf`-style node wrapper — instead of letting the vitest process exit gate the
  step (the step exits 1 with a GREEN metric today). **ci.yml ~5 lines.** The metric-asserting
  wrapper replaces exit-code coupling.
- **S4 — The shared importmap harness fix (fold rows 10 + 12; SPEC §3 S.A0 item 4; §2.1-2; SA-2).**
  **This fix greens BOTH DM-13 and DM-11b in ONE change ×2 and is a hard prerequisite of S.A0's own
  gate — it lives HERE, not in a downstream row.** Teach the vendor importmap the value.js **subpath
  namespace** (`"@mkbabb/value.js/": "/__kf-vendor__/value.js/dist/subpaths/"`, **keeping the bare
  map**) AND serve the whole value.js `dist/` subtree, replicated across **BOTH**
  `scripts/proof-engine-no-throw-on-play.mjs` + `scripts/proof-subject-animates.mjs`. **~10–20 LOC,
  ONE change ×2.** Root cause: the lazy engine chunk imports `@mkbabb/value.js/math` (the value.js-O
  subpath split) but the probe HTML maps only bare `@mkbabb/value.js` → hard in-browser resolve
  failure; DM-11b's 30 s-timeout is the swallowed deterministic module-load throw (p12 §3.1).
- **S5 — The `demo-usability` gate-staleness re-point (fold row 5, gate-staleness bucket; SPEC §3
  S.A0 item 5; §2.1-2; SA-5).** Teach the route-name parser the generated `name: s.id` form (R.W5
  generates routes as `name: s.id`, but the gate scans `router.ts` for literal `name:"…"` strings),
  **or** assert reachability at runtime — **~5–15 lines**. A green demo must not red on the gate's
  own obsolescence. (The same class is bucketed generically in S.A2; the concrete instance is fixed
  here.)
- **S6 — The two cheap genuine behavioral fixes that unblock the widest downstream surface (fold
  rows 5 + 13; SPEC §3 S.A0 item 6; §2.1-2).**
  - **`cold-entry` resume-totality:** `resume()` on a never-started group must call `group.play()`;
    `scenePlaybackAdapters.ts:76-79`; **~½ day**, upstream of `live-session`.
  - **DM-14 the spring pause/resume-continuity defect:** a **genuine source fix** with a live
    repro-and-verify — the spring scene does not pause (`springPausedAfterClick=false`); **~½–1 day.
    NOT a timing calibrate** (v1's row repeated the r8-F1 error verbatim; C-20; p12 §3.1).
- **S7 — Drive the FULL 159-member hygiene-chain + demo-smoke to a verdict in ONE non-fail-fast
  pass (SPEC §3 S.A0 item 7).** Downstream gates **not** verified by p12 (`computed-real-dom`,
  `lighthouse-a11y`, `scene-parity`, `live-session`, `live-session-mobile`) are re-run post-fix and
  sized then — several are downstream of `cold-entry`/`subject-animates`.

### The enumerated born-RED backlog (authorized-RED under named downstream waves, NOT re-tiered)

These four rows are **NOT** owned by S.A0's fixes; they stay red until their named owning wave closes
(SPEC §3 S.A0; §2.1-2; fold row 5; SA-4):

| Backlog row | Owning wave | Note |
|---|---|---|
| `drag-gesture` | **S.G3** | `userSelect:auto` mid-gesture |
| `easing-sidebar-minimal` | **S.G2** | |
| `scene-perf-budget` A2 | **S.G2** | amiga `setPixelRatio(min(dpr,2))` cap — a static source assertion |
| `icon-paint-live` | **S.G2** | **impl-time home check:** if the `::view-transition-*` residue KILL target is glass-ui-owned, this clause becomes a named **HANDOFF** (glass-ui-home check) |

### The HARD GATE — cause-shaped, falsifiable in both directions

**Gate criterion (SPEC §3 S.A0; SA-3/SA-4):**

1. **Each blocking red is discharged by a named cause verified against a locally-reproduced
   signature** (macOS reproduction IS the discriminator, p12).
2. **The CI run's failing steps must be ⊆ the enumerated backlog set.** Any red **outside** the
   backlog REDs the keystone.
3. **A backlog row without a named owning wave REDs the keystone.**
4. **FORBIDDEN discharge shapes (a discharge of any of these shapes REDs):** threshold-loosen,
   timeout-widen, residual `continue-on-error`, observe-reclassification. This is the T11 masking
   ban made structural (SPEC §7 T11; §2.1-2).

**Born-RED witness plan.** On day zero the master push CI (the full 159-member hygiene-chain +
demo-smoke, driven in ONE non-fail-fast pass — S7) fails with the 14-blocking-red plane of §2.1-2.
Each fix lands against a locally-reproduced signature: S1 flips `styling-idioms` green; S2 flips
`pin-ledger-current` green; S3 decouples the LoAF exit code so the GREEN metric governs; S4 flips
**both** DM-13 (`engine-no-throw-on-play`) and DM-11b (`subject-animates`) green (the 30 s-timeout
resolves to a passing module load); S5 flips `demo-usability` green (route parser reads `name: s.id`);
S6 flips `cold-entry` and DM-14 (`fsm-suspend-resume-live`) green via live repro-and-verify. After
the sweep the ONLY remaining red steps are the four backlog rows — the gate is GREEN iff the failing
set ⊆ {drag-gesture, easing-sidebar-minimal, scene-perf-budget-A2, icon-paint-live}, each carrying a
named owning wave.

**Falsifiability (both ways).** Planting a red **outside** the backlog (e.g. re-breaking
`styling-idioms`) REDs the keystone; deleting a backlog row's owning-wave pointer REDs the keystone;
"fixing" any row by loosening a threshold / widening a timeout / re-adding `continue-on-error` /
reclassifying to observe-only REDs (the masking ban). **Master push CI turns fully green when the
last backlog row's owning wave closes — that full-green is re-asserted at S.Z3 (C-21/T10).**

### Cost

S1: 1 line. S2: 1 JSON re-author. S3: ~5 lines (ci.yml). S4: ~10–20 LOC across two scripts (ONE
change ×2). S5: ~5–15 lines. S6: `cold-entry` ~½ day + DM-14 ~½–1 day. S7: one non-fail-fast roster
run + sizing of the five p12-unverified downstream gates.

### Verification

The keystone gate above IS the verification. Every cited RED reproduces locally on macOS before the
fix and is GREEN (or ⊆-backlog) after. Line/file anchors — `MorphTarget.vue:71`,
`docs/tranches/Q/PIN-LEDGER.json`, `scripts/proof-engine-no-throw-on-play.mjs` +
`scripts/proof-subject-animates.mjs`, `scenePlaybackAdapters.ts:76-79` — are grounded in SPEC §2.1-2
/ §3 S.A0. **This wave is development-only: the gate ships born-RED** and is CLOSED only when re-run
GREEN-modulo-backlog on the merged tree (T4); S.Z2 re-executes it at close.

---

## S.A1 — Chronic ledger R→S + VERIFY-ONLY terminal-ization, with substance

**Mode: REWRITE.** **Deps: A0.**

### Charter

Atomic re-point of `CHRONIC_LEDGER` from R to S, terminal-izing the DM-8…DM-15 chronics with
**substance** — not renamed verbs. Every disposition is **re-derived from a locally-reproduced
signature** (macOS reproduction IS the device-dependence discriminator; the "re-run on the REAL
runner" and the Linux-container/act reproduction apparatus are **DROPPED** — p12, SPEC §8-19, §6.1
Q12; SA-7). Terminal-ness uses **C-20's structural definition**: a deterministic re-shaped gate
(device dependence folded OUT — relative budgets, structural assertions) or a ratified KILL;
**observe-in-CI is NOT terminal** (SPEC §3 S.A1; §2.2 C-20; SA-6).

### Scope items

- **S1 — The atomic re-point of `CHRONIC_LEDGER`** with the **planted-malformed-row non-vacuity
  proof** (r2 S5) — the gate must red on a deliberately malformed ledger row, proving it is live.
- **S2 — DM-8…DM-15 dispositions, re-derived from reproduced signatures, C-20 terminal shape.** The
  rows this wave owns (SPEC §4 fold table):

  | Fold row | Chronic | Born | S-disposition (C-20 terminal shape) |
  |---|---|---|---|
  | 6 | **DM-8** Lighthouse floors | B-era | deterministic re-shape (relative budgets) **or** ratified KILL — observe-in-CI is NOT accepted |
  | 7 | **DM-9** specular-at-rest | D | re-run on **S dist** from a reproduced signature; C-20 terminal shape |
  | 8 | **DM-10** typography/font-census | D | same C-20 terminal-ization |
  | 9 | **DM-11a** spring-slider-continuous | D | same |
  | 14 | **DM-15** control-surface-single-writer | I | C-20 terminal-ization from a reproduced signature |
  | 15 | **DM-5 S8** FN_NAME source-probe | K | re-derive; terminal as a **regression-guard** |

  (DM-11b, DM-13, DM-14 are **NOT** here — they are genuine fixes owned by **S.A0** per §2.1-2. DM-12
  perf-frame-budget is **S.A2**. Rows 6–9/14/15 are the observe/chronic residue that S.A1
  terminal-izes.)
- **S3 — The substance clause (the gate teeth).** `proof:chronic-closure` **currently accepts**
  `VERIFY-ONLY` / `VERIFY-ONLY-TERMINATED` vocabulary (`scripts/proof-chronic-closure.mjs:64-86`).
  The re-shaped gate:
  - **REDs any `*-TERMINATED` row that does not cite a deterministic re-shaped gate or a ratified-KILL
    ledger row** (a renamed verb alone REDs);
  - **REDs any disposition containing deferral verbs** (observe / watch / re-affirm / verify)
    **without a paired re-shape/KILL row** (T3 extended to the ledger's disposition column — SPEC §7
    T3; x2-#8; C-20).

### The HARD GATE

**Gate name:** the re-shaped `proof:chronic-closure` + its plant.

**Born-RED witness plan.** Before the re-shape, the current gate (`:64-86`) GREENs a
`VERIFY-ONLY-TERMINATED` row that cites no re-shaped gate — that is the vacuity the wave closes. The
re-shaped gate REDs that row until each DM-8…DM-15 disposition cites a deterministic re-shaped gate
(relative budget / structural assertion) or a ratified-KILL ledger row. **Non-vacuity plant (r2 S5):**
a deliberately malformed ledger row (e.g. a `*-TERMINATED` row with a bare renamed verb, or a
disposition carrying "observe" with no paired KILL/re-shape row) must RED the gate; a well-formed
ledger GREENs it. **Falsifiability:** the plant proves the gate is not a rubber stamp — a renamed
verb, an unpaired deferral verb, or a missing re-shaped-gate citation each RED.

### Cost + DAG

Ledger re-point + 6 disposition re-derivations from reproduced macOS signatures + the gate re-shape
at `scripts/proof-chronic-closure.mjs:64-86` + the plant. **Deps: A0** (the CI surface must be
green-modulo-backlog before the chronic ledger can be honestly re-pointed).

### Verification

The re-shaped `proof:chronic-closure` + its planted-malformed-row test. Development-only: the gate
ships born-RED (the current ledger fails the substance clause); CLOSED only when GREEN re-run on the
merged tree (T4); S.Z2 re-executes.

---

## S.A2 — The demo-gate system: split, net-deletion, four disposition buckets

**Mode: REWRITE.** **Deps: A0.**

### Charter

Split the monolithic `demo-smoke` into a **blocking, deploy-gating** correctness job and an
**observe-only** device job; land the browser-harness **net-deletion** (amortize the ~50-launch
surface onto ONE shared chromium + one served dist); and disposition every per-gate red into one of
**four buckets**. The hard clause: **the correctness↔observe split may NOT green a red whose signature
reproduces off-runner** — such a red is discharged by cause or by owner-ratified KILL, **never by
reclassification** (SPEC §3 S.A2; §2.1-2; x2-#2).

### Scope items

- **S1 — Split `demo-smoke` into two jobs (a28 S-CI-1).**
  - **`demo-correctness`** — kf-owned, **blocking, gates deploy**.
  - **`demo-device-observe`** — LoAF / dock / lighthouse, **observe-only**.
- **S2 — The browser-harness net-deletion (a28 S-CI-2).** ONE shared chromium + one served dist
  across the ~50-launch surface (amortized, not per-gate). This structurally cures the
  device-dependence **apparatus** concern (~50 launches under a 50-minute ceiling — real, but NOT
  why the gates are red; SPEC §2.1-2). S.E's chrome-devtools-mcp acceptances ride this same shared
  chromium + served dist at zero additional CI launches (SPEC §3 S.E amortization note).
- **S3 — De-magic `KF_LOAF_COUNT`** (the magic env count).
- **S4 — Widen `proof:settle-is-predicate`** to ban numeric `waitForTimeout` across ALL driver code
  (not just the sampled sites).
- **S5 — The FOUR disposition buckets (per-gate; SPEC §3 S.A2; SA-5).**

  | Bucket | Red shape | Disposition |
  |---|---|---|
  | 1 | genuine | **FOLD by cause** |
  | 2 | absolute-threshold | **relative budget** |
  | 3 | binary-absent | **install-or-observe** |
  | 4 | **stale-gate** | **re-point the gate's parser/selector** — a green demo must not red on a gate's own obsolescence (the `demo-usability` class, p12) |

  Bucket 4 is the fourth bucket added per SA-5; its concrete instance (`demo-usability`) is fixed in
  **S.A0 item 5** — S.A2 owns the generic bucket, S.A0 owns the instance.
- **S6 — DM-12 perf-frame-budget split + HANDOFF (fold row 11; SPEC §4 row 11).** Split the
  **kf-blocking clause** from the **glass-ui-owned dock width-morph clause**; the dock width-morph
  clause is a named **HANDOFF (dock width-morph → glass-ui)**.

### The hard clause (x2-#2, SPEC §3 S.A2)

**The correctness↔observe split may NOT green a red whose signature reproduces off-runner.** Such a
red is discharged by cause or by owner-ratified KILL, never by reclassification. **The split will NOT
green correctness/gate-bug reds and is not claimed to.** (This is the structural T11 compensator for
this wave — SPEC §7 T11.)

### The HARD GATE

**Gate criterion:** the `demo-correctness` job runs **green on the Linux runner with zero
continue-on-error masking, modulo S.A0's enumerated backlog** (SPEC §3 S.A2).

**Born-RED witness plan.** Before the split, `demo-smoke` reds on the mixed correctness+device
surface. After the split, `demo-correctness` must be green (modulo the four A0 backlog rows) with NO
`continue-on-error` mask anywhere in the job; `demo-device-observe` runs observe-only and cannot gate
deploy. **Falsifiability:** a residual `continue-on-error` in `demo-correctness` REDs; a
correctness-tier red silently moved to the observe tier (a red whose signature reproduces off-runner
appearing green) violates the hard clause and REDs; `proof:settle-is-predicate` REDs on any numeric
`waitForTimeout` remaining in driver code.

### Cost + DAG

Job split (ci.yml) + the harness net-deletion (shared chromium + served dist) + `KF_LOAF_COUNT`
de-magic + the `proof:settle-is-predicate` widen + the DM-12 clause split + the four-bucket
disposition pass. **Deps: A0.** Blocks: **S.A3** (auto-deploy fires when `demo-correctness` is green).

### Verification

`demo-correctness` green on the Linux runner, zero continue-on-error, modulo the A0 backlog;
`proof:settle-is-predicate` green over all driver code. Development-only; born-RED; re-run at S.Z2.

---

## S.A3 — Deploy-of-record revived

**Mode: REFINE.** **Deps: A2.**

### Charter

Revive the dead auto-deploy: `deploy-pages.yml`'s `workflow_run` fires on green `demo-correctness`;
manual dispatch is demoted to documented break-glass; DM-20's live-byte round-trip is observed on the
**auto** path (SPEC §3 S.A3; fold row 16).

### Scope items

- **S1 — `deploy-pages.yml` `workflow_run` fires on green `demo-correctness`** (the auto path
  restored — every `workflow_run` deploy since K was skipped, SPEC §2.1-2).
- **S2 — Manual dispatch demoted to documented break-glass** (wording fixed — a28 F2). The manual
  `workflow_dispatch` both Q and R shipped via becomes the documented escape hatch, not the norm.
- **S3 — DM-20's live-byte round-trip observed on the auto path** (fold row 16, DM-20
  auto-deploy-of-record dead, L.WZ).

### The timing note (rides the keystone — expected, not a slip)

The auto-path deploy fires when `demo-correctness` is green, i.e. **after the S.A0 backlog rows'
owning waves discharge** (S.G2/S.G3). This is expected and recorded, not a slip (SPEC §3 S.A3).

### The HARD GATE

**Gate criterion:** one **auto-path deploy run `success`** with `proof:deploy-roundtrip`'s **live-leg
green** (SPEC §3 S.A3).

**Born-RED witness plan.** Today no `workflow_run` deploy succeeds (all skipped since K). The gate is
GREEN only when a `workflow_run`-triggered (not `workflow_dispatch`-triggered) `deploy-pages.yml` run
reports `success` AND `proof:deploy-roundtrip`'s live-leg (the deployed bytes fetched back and
verified) is green. **Falsifiability:** a deploy that fires via manual `workflow_dispatch` does not
satisfy the auto-path clause; a `success` run whose live-leg round-trip fails REDs.

### Cost + DAG

`deploy-pages.yml` `workflow_run` trigger wiring + the break-glass wording + one observed auto-path
round-trip. **Deps: A2** (the trigger keys off green `demo-correctness`, which A2 defines).

### Verification

One auto-path deploy `success` + `proof:deploy-roundtrip` live-leg green. Development-only; the gate
ships born-RED (no auto deploy fires today); re-run at S.Z2.

---

## S.A4 — Gate-roster diet + the 51-gate FROZEN migration, with the lockstep co-edit

**Mode: REWRITE.** **Deps: A0. BLOCKS the FROZEN reds of S.D3/S.E/S.G being declarable.**

### Charter

Replace harness-defined "correctness" (opens-a-browser) with a **three-tier taxonomy**
(library-correctness / demo-correctness / hygiene — a27 F1); execute it via the **5-artifact atomic
co-edit set** (p08, verified — the 15-clause coverage model is tier-count-agnostic, **no staging
needed**); add the **symmetric mis-tier clause**; and migrate the ~51-gate FROZEN appearance set with
a **machine-distinguishable discharge**. Arithmetic (p08): **190 → ~138 immediate → ~120 once the
FROZEN fold discharges** (the fold half validated by Q4/p04 + the D/G migration, **cited as a
dependency, not re-asserted** — SPEC §8-20; fold row 70; SA-8/SA-9/SA-10; x1-#5).

### Scope items

- **S1 — The 5-artifact atomic co-edit set (p08, verified — SPEC §3 S.A4; SA-8). All five land
  together (a partial edit reds):**

  | # | Artifact | Edit |
  |---|---|---|
  | (a) | `package.json` | Rename `proof:correctness`→`proof:demo-correctness` and **keep it a direct `&&` chain** (gate-is-runtime regex-matches the raw tier string with **no `resolveTier` indirection**; a run-all **delegator** yields an empty roster → **RED**). Add the `proof:library-correctness` chain. Thin `proof:hygiene-chain`. |
  | (b) | `scripts/proof-ci-coverage.mjs` | `EXCLUDED` add (`:141-192`) + **the clause-0b three-tier union at `:238-239`** — **the airtightness linchpin: omit it and all 39 LC gates red as `ciOnly`**. |
  | (c) | `scripts/proof-gate-is-runtime.mjs` | Retarget `:82` / `:108` to `proof:demo-correctness`; **replace the frozen `EXPECTED_WAVES` I-floor (`:248`) with a membership-count non-vacuity floor**; regenerate/drop `WAVE_ANNOTATION`. |
  | (d) | `scripts/run-all.mjs:42` | The `--all` tier list → **three tiers** (**the easily-missed third consumer**). |
  | (e) | `docs/tranches/J/gate-taxonomy.md` | Delete observe-only rows for merged/deleted gates (**clause 4b/4-ext stale-row RED otherwise**). |

- **S2 — The symmetric mis-tier clause (p08 §5.2, ~15 LOC; SA-9/SA-10).** A `proof:library-correctness`
  member's script must **NOT** carry browser-harness anchors — so **"a planted mis-tiered gate REDs"
  is falsifiable in BOTH directions** (today only node-masquerading-as-DC is caught). **The
  "post-actuation DOM-read heuristic" of v1 is DROPPED** (no probe validated it; p08 kept the
  browser-harness-import anchor) — the reformed gate is the **existing anchor + the symmetric
  inversion**.
- **S3 — The FROZEN-set discharge, machine-distinguishable (x2-#7; fold row 20).** Each of the ~51
  frozen keys is discharged EITHER by:
  - **(a) migration** — its live property asserted by a named **successor system gate**
    (`stage-visible` / `occlusion-free` / `a11y` / `dogfood`), enforced by a **mapping clause in
    ci-coverage that REDs if a FROZEN key is deleted without a successor row**; OR
  - **(b) KILL** — an **owner-ratified S-ledger row with a re-run witness** that the property is
    obsolete.
  - **Free-prose "deletion-with-cause" is BANNED.**
- **S4 — Scene-switcher gate contradiction (C-6; fold rows 18/19).** Delete `proof:scene-colocated`
  **ASSERTION 3** (the carousel-absence clause — keep location/no-climb); **retire
  `proof:scene-switcher-mobile`** (it reborns at S.E4/E5 as `proof:scene-stage-commits` + the mobile
  commit gate). `proof:scene-colocated`'s canonical cross-band edit order is **A4 → D2 → D3**.
- **S5 — Safe triple merges (p08 F6/F7).** Collapse the **morph-gate** and **emerging-css** triples
  (safe merges).
- **S6 — Constellation-PENDING consolidation + tripwire retarget.** Consolidate the
  constellation-PENDING placeholders into **one stateful consume-edge gate** and **retarget
  ci-coverage clause 6's `BORNRED_TRIPWIRES` literal** (`peer-satisfied` is the **one merge touching
  a born-RED tripwire**).
- **S7 — Band the regression-guards under an explicit header.**

### The HARD GATE

**Gate criterion (SPEC §3 S.A4):** `proof:ci-coverage` + the reformed `proof:gate-is-runtime` **green
over the new manifest**; **a planted mis-tiered gate REDs in BOTH directions**; **zero gates
orphaned**.

**Born-RED witness plan.**
- Before the co-edit, splitting the tier without landing the clause-0b three-tier union at
  ci-coverage `:238-239` reds **all 39 LC gates as `ciOnly`** — that is the airtightness RED the
  linchpin closes.
- A **run-all delegator** (instead of the direct `&&` chain in `package.json`) yields an empty roster
  → `proof:gate-is-runtime` REDs (it regex-matches the raw tier string with no `resolveTier`
  indirection).
- The frozen `EXPECTED_WAVES` I-floor at `proof-gate-is-runtime.mjs:248` must be replaced by a
  membership-count non-vacuity floor — leaving the frozen I-floor reds under the new manifest.
- **The symmetric mis-tier plant:** plant a node-only gate into `proof:demo-correctness` (caught
  today) AND plant a browser-harness-anchored gate into `proof:library-correctness` (caught ONLY by
  the new symmetric clause) — **both must RED**. This is the both-directions falsifiability.
- **The FROZEN discharge plant:** delete a FROZEN key **without** a successor-mapping row → the
  ci-coverage mapping clause REDs; delete it **with** a KILL row lacking a re-run witness → REDs;
  a free-prose "deletion-with-cause" → REDs.
- **Zero-orphan:** any gate left un-tiered / unmapped after the migration REDs.

### Cost + arithmetic + DAG

**190 → ~138 immediate → ~120 once the FROZEN fold discharges** (p08; fold row 70). The ~120 half is
**contingent on the FROZEN discharge** and **validated by Q4/p04 + the D/G migration, cited as a
dependency, not re-asserted** (SPEC §8-20). **Deps: A0.** **BLOCKS** the FROZEN reds of
**S.D3/S.E/S.G** being declarable (the altitude bands' born-RED appearance gates are only *declarable*
against the reformed tier taxonomy + FROZEN authorization A4 creates — SPEC §1). A4's FROZEN-set
declaration **precedes any demo wave that reds a layout/appearance gate** (D3, E, G — NOT D1, which
reds only source-path gates, p04 F4). `proof:scene-colocated` edit order: **A4 → D2 → D3**.

### Verification

`proof:ci-coverage` + reformed `proof:gate-is-runtime` green over the new manifest; the both-directions
mis-tier plant; the FROZEN-discharge plant; zero orphans. Development-only; born-RED; re-run at S.Z2.

---

## S.A5 — Doc-authority restoration, gate-first

**Mode: REFINE (gate) + hot-fix.** **Deps: A0.** *The one clean, un-critiqued gate in the band.*

### Charter

Land a born-RED `proof:claude-paths-live` gate that binds every CLAUDE.md against the real tree, and
hot-fix the actively wrong (dangerous) lines now — **gate-first, regen-last (C-8):** the full
`src/animation/CLAUDE.md` rewrite lands at **S.B8** against the final tree (SPEC §3 S.A5; §2.2 C-8;
§2.1-4; fold row 41).

### Scope items

- **S1 — Born-RED `proof:claude-paths-live`.** Every backtick path/symbol in **root + `src/animation`
  + `demo` CLAUDE.md** resolves **on disk / in the built surface**; the **HEAVY export list ⊆
  AnimationEngine keys**.
- **S2 — Hot-fix the actively wrong lines (SPEC §2.1-4):**
  - `animate` listed live → struck (`animate()` is EXCISED, R.W4);
  - `ScrollTimeline` → `KeyframesScrollTimeline`;
  - "seven-zone" → the true count;
  - `waapi/` registered (currently invisible);
  - the `parse-that` dependency row **struck** (the dependency no longer exists).

### The HARD GATE

**Gate name:** `proof:claude-paths-live` (**born-RED today by construction**).

**Born-RED witness plan.** The gate reds today because the current CLAUDE.md files reference a deleted
flat tree, the renamed `Animation` class, the excised `animate()`, a dead `ScrollTimeline` export, a
"seven-zone" count that mismatches the shipped directory count, an invisible `waapi/`, and a
`parse-that` dependency row that no longer resolves (SPEC §2.1-4). The hot-fix (S2) clears the
**actively dangerous** lines; full path-resolution GREEN is reached only after S.B8 regenerates
`src/animation/CLAUDE.md` against the final tree (C-8). **Falsifiability:** any backtick path/symbol
that does not resolve on disk / in the built surface REDs; any HEAVY export not in the AnimationEngine
key set REDs.

### Cost + DAG

The `proof:claude-paths-live` gate authoring + the ~5 hot-fix lines. **Deps: A0.** The full regen is
**S.B8** (not this wave — C-8).

### Verification

`proof:claude-paths-live` (born-RED by construction; GREEN reached across A5 hot-fix → S.B8 regen).
Development-only; re-run at S.Z2.

---

## Appendix A — Fold rows this band owns (SPEC §4, verbatim dispositions)

Every §4 chronic/deferral fold row whose S-disposition names an S.A wave, restated so an implementer
need not consult SPEC-v3. **"Terminal" uses C-20's structural definition** (a deterministic re-shaped
gate or an owner-ratified KILL with a re-run witness — never observe-in-CI / WATCH / a re-verify
verb); every disposition is re-derived from a locally-reproduced signature at impl, never inherited
from the table (SPEC §4 header).

| # | Item | Born | Chronicity | S-disposition |
|---|---|---|---|---|
| 1 | Master CI red on every push | K | 3 tranches | **WAVE S.A0** (cause-shaped fix-by-cause sweep; gate = failing steps ⊆ the enumerated backlog) |
| 2 | proof:styling-idioms orphan `.morph-ghost--from` | R.W5 | new | **WAVE S.A0** (one-line FOLD; `MorphTarget.vue:71`) |
| 3 | proof:pin-ledger-current RED (stale PIN-LEDGER) | Q→R | new | **WAVE S.A0** |
| 4 | LoAF bench exit-code flake (metric green) | C-era | chronic | **WAVE S.A0** (exit-code decouple; metric-asserting wrapper) |
| 5 | 14 demo-smoke blocking gates red — p12-verified taxonomy: 2 source + 2-gates/1-harness-importmap + 5 genuine demo born-RED + 1 gate-staleness + 1 exit-plumbing; device render-races = 0 | I–R | structural | **WAVES S.A0 (fix-by-cause + the enumerated backlog) + S.A2 (four-bucket disposition)**; backlog rows: drag-gesture→S.G3, easing-sidebar-minimal→S.G2, scene-perf-budget-A2→S.G2, icon-paint-live→S.G2 (glass-ui-home check) |
| 6 | DM-8 Lighthouse floors | B-era | 6 | **WAVE S.A1** → C-20 terminal: deterministic re-shape (relative budgets) or ratified KILL — observe-in-CI is NOT accepted |
| 7 | DM-9 specular-at-rest | D | 8 | **WAVE S.A1** → re-run on S dist from a reproduced signature; C-20 terminal shape |
| 8 | DM-10 typography/font-census | D | 9 | **WAVE S.A1** → same C-20 terminal-ization |
| 9 | DM-11a spring-slider-continuous | D | 10 | **WAVE S.A1** → same |
| 10 | DM-11b subject-animates — RED (timeout signature) | D | 11 | **WAVE S.A0** — the SAME importmap-subpath harness bug as row 12; ONE shared fix (p12 §3.1). NOT "fix or calibrate"; the timeout is a swallowed deterministic module-load throw |
| 11 | DM-12 perf-frame-budget (glass-ui-owned dock clause) | D | 9 | **WAVE S.A2** (split the kf-blocking clause from the glass-ui-owned dock width-morph clause) + **HANDOFF** (dock width-morph → glass-ui) |
| 12 | DM-13 engine-no-throw-on-play — RED | A | 9 | **WAVE S.A0** (the importmap subpath harness fix — shared with row 10); terminal |
| 13 | DM-14 fsm-suspend-resume-live — RED | H | 8 | **WAVE S.A0** — a GENUINE spring pause/resume-continuity source defect (`springPausedAfterClick=false`; p12 §3.1); a real behavioral fix with live repro-and-verify. NOT a timing calibrate — v1's row repeated the r8-F1 error verbatim |
| 14 | DM-15 control-surface-single-writer | I | 7 | **WAVE S.A1** → C-20 terminal-ization from a reproduced signature |
| 15 | DM-5 S8 FN_NAME source-probe | K | 5 | **WAVE S.A1** (re-derive; terminal as regression-guard) |
| 16 | DM-20 auto-deploy-of-record dead | L.WZ | 4 | **WAVE S.A3** |
| 18 | proof:scene-switcher-mobile zombie gate | R.W5 | new | **WAVE S.A4** (retire) + **S.E4/E5** (reborn as proof:scene-stage-commits + the mobile commit gate) |
| 19 | proof:scene-colocated ASSERTION 3 vs charter | R.W5 | new | **WAVE S.A4** (delete clause; edit order A4→D2→D3) |
| 20 | ~51 demo-layout ossifying gates | H–R | accreting | **WAVE S.A4** (FROZEN set; machine-distinguishable discharge: ci-coverage successor-mapping row or ledgered KILL with re-run witness — free-prose "deletion-with-cause" banned) |
| 41 | src/animation/CLAUDE.md pre-R (9 lanes); root doc drift | Q | 2 | **WAVES S.A5 (gate) + S.B8 (regen)** |
| 70 | Gate roster 190→~120 consolidation | H–R | accreting | **WAVE S.A4** (~138 immediate; ~120 contingent on the FROZEN discharge — cited to Q4/p04 + the D/G migration) |

---

## Appendix B — Critique disposition rows (SPEC §9 sa-truth-gates, 10 edits)

The band's traceability to the critique fleet — every sa-truth-gates blocking edit and its absorption
site (SPEC §9). All ABSORBED; none DISPUTED.

| # | Edit | Absorbed at |
|---|---|---|
| SA-1 | Rewrite §2.1-pt2 + rows 10/13: strike "device-dependence plane"; DM-11b = the same importmap bug as DM-13; DM-14 = a genuine spring source defect | §2.1-2, fold rows 10/13 (this doc §0 causal model + Appendix A) |
| SA-2 | Scope the value.js-subpath importmap harness fix INTO S.A0 (its own gate's prerequisite) | S.A0 item 4 (this doc S.A0/S4) |
| SA-3 | Make S.A0's gate cause-shaped: each red discharged by a named cause vs a reproduced signature; masking (threshold/timeout/continue-on-error) forbidden | S.A0 gate |
| SA-4 | Resolve the keystone-ordering contradiction: enumerate what A0 owns vs stays authorized-RED; re-scope to "green modulo the enumerated born-RED backlog" | S.A0 (ownership split: A0 owns items 1–6 incl. cold-entry + DM-14; backlog = drag-gesture/easing-sidebar-minimal/scene-perf-budget-A2/icon-paint-live with named owning waves) |
| SA-5 | Add the fourth S.A2 bucket: gate-staleness → re-point the parser (demo-usability's literal-name regex); the split will NOT green gate-bug reds | S.A2 (+ the instance fixed in S.A0 item 5) |
| SA-6 | S.A1 substance clause: RED any *-TERMINATED row citing no deterministic re-shaped gate/ratified KILL (existing vocab accepts VERIFY-ONLY); re-derive from reproduced signatures | S.A1 |
| SA-7 | Drop "re-run on the REAL runner" + the Linux-container/act apparatus — macOS reproduction IS the discriminator | S.A1 (§6.1 Q12, §8-19) |
| SA-8 | Expand S.A4 with the full lockstep co-edit set (direct && chain; EXCLUDED + clause-0b union; gate-is-runtime retarget + count floor; run-all.mjs:42; gate-taxonomy.md rows) | S.A4 (the 5-artifact set, verbatim) |
| SA-9 | Add the symmetric mis-tier clause (an LC member must NOT carry browser-harness anchors) — falsifiable in both directions | S.A4 |
| SA-10 | Validate or drop the "post-actuation DOM-read heuristic" — no probe tested it | S.A4 (DROPPED; re-specified as the existing anchor + the symmetric inversion) |

**Cross-cutting absorptions touching S.A (SPEC §9 x1/x2):** X1-5 (S.A4 absorbs p08's three
adjustments — same site as SA-8/SA-9); X2-2 (the hard no-reclassification clause — S.A0 gate + S.A2
hard clause); X2-7 (S.A4 FROZEN discharge machine-distinguishable + the symmetric mis-tier clause);
X2-8 (T3's deferral-verb meta-gate extended to the S ledger's disposition column — §7 T3, S.A1).
**Probe absorption:** p08 → S.A4 (lockstep set; symmetric clause; `&&` chain; no staging);
p12 → §2.1-2 / S.A0 / S.A1 / S.A2 + fold rows 5/10/12/13 (SPEC §9 probe index).

---

## Appendix C — DEV→IMPL boundary (binding for every S.A wave)

Every wave above is **DEVELOPMENT ONLY** (SPEC §1 "What S is NOT"). Each ships a falsifiable **born-RED
gate**; nothing runs until the owner authorizes an impl drive (inv-16). A wave is **CLOSED only when
its born-RED gate is GREEN re-run on the merged tree** (T4, r2 F4), exit code recorded in PROGRESS.md;
**S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives re-run every
touched gate from a clean independent checkout — "pre-existing" claims are verified by triage, never
accepted (T5, a15); node_modules symlinks are never git-added. S.A0's "master push CI turns fully
green when the last backlog row's owning wave closes" is **re-asserted at S.Z3 under the closeable-roster
definition (C-21/T10), pre-gated on master-green at the FINAL SHA** (SPEC §3 DAG; §7 T10/T11).
