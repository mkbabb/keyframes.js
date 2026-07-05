# Tranche T — PROMPT-RECAP (the born-at-entry, owner-token-bound ask ledger)

> **Status: DEVELOPMENT + PROTOTYPING. Implementation NOT authorized.** This is the ENTRY
> skeleton: every row is populated at drive entry with its *current* owner-observed status;
> each row is **updated at the close of the wave that addresses it** (never reconstructed at
> close — lane 28 F1). A drive pre-empted at any point still has a real, current recap.
>
> **Why this ledger is different from every prior recap (lane 28).** Every recap A→S measured
> **letter** (did a wave/mechanism land) and bolted on a **spirit column** that self-certified by
> citing a **band** (→ S.G / → S.D / → S.E) — the three bands the owner then rejected on sight.
> "The anti-leak column certified the leak" (lane 28 F2). This ledger's spirit column cites an
> **owner-observed token, never a band**, and a **green gate may not stand as a spirit oracle for
> any design/appearance/interaction ask** (lane 26's "green was the defect").
>
> **Gate binding.** The falsifiable teeth are `proof:prompt-recap-t` (**T.M10**, born-RED +
> born-OWNER). This file is the **artifact** it binds (charter §6; authored under **T.S7** against
> T.M10's schema — coordination note 4). It is created **once**, born at entry, here.
>
> **Owner review is a WAVE-CLOSURE PRECONDITION** (T.M2, the S.E lesson made structural): a
> design/appearance/interaction row cannot flip to `OWNER-APPROVED` on critic-convergence + a green
> born-RED oracle alone — those are **necessary but not sufficient**; a committed owner (or
> owner-proxy live-review, the pass-3 chrome-devtools-mcp + live-shot pattern) token is required.

## The spirit-column schema (the token vocabulary)

Every ask's **spirit-status** ∈ exactly one of:

| Token | Meaning | Falsification (`proof:prompt-recap-t`) |
|---|---|---|
| `OWNER-APPROVED shot:NN` | An owner (or owner-proxy live-review) observed the T-rebuilt surface and blessed it | requires a committed owner token; a design row flipping here without one REDs (T.M2) |
| `OWNER-REJECTED shot:NN → T.X` | The owner observed it and rejected it; the cure is owned by wave T.X | this is the current state for the whole verdict catalogue |
| `PENDING-OWNER` | The T cure is not yet built + owner-reviewed | a row stuck here at close of its owning wave REDs |
| ~~`→ Band`~~ | **FORBIDDEN as a spirit oracle** | an ADDRESSED row citing a band, not an owner token, REDs (F2 plant) |
| ~~green gate~~ | **FORBIDDEN as a spirit oracle for a design/appearance/interaction ask** | REDs (lane 26 "green was the defect") |

At **entry** (this skeleton) **nothing is `OWNER-APPROVED`**: no T surface has been built or
owner-reviewed. Every design/appearance ask carries the owner's *rejection* token from the
2026-07-04 live review; every structural/perf ask carries `PENDING-OWNER`. That honest zero-approval
state is the point — it is the anti-leak baseline the S recap never had.

---

## §1 — The immutable standing mandate (the 7-clause block) — the RE-ISSUANCE CENSUS

The 7-clause mandate was first captured at `J/J.md:111-119` and re-issued **verbatim** through K,
L, M, O, P, Q, R, S, and now T (`ORIGINAL-PROMPT.md:100-112` is word-for-word off J) — its **~9th
consecutive re-issue**. **The re-issuance IS the falsification** (lane 28 F5): if a precept were
spirit-addressed to the owner's bar, the owner would not need to say it again. Per T.M10 clause (iv),
**a verbatim-re-issued precept AUTO-REDs its `ADDRESSED` claim** until a post-re-issuance owner token
clears it.

| Standing precept | Letter (S impl) | Spirit-status (owner) | T home |
|---|---|---|---|
| NO quick solutions / NO workarounds — idiomatic, gestalt | S.B/S.C/S.D ran | **RE-ISSUED → auto-RED** (`:67,102`) — `useToolbarKeyboard`, `KfPillTabs`, `gatedSliderDown` hand-rolls survived (VERDICT #18) | T.B/T.E/T.H hand-roll census; **T.S2** (the gate wrapper) |
| architectural transposition for elegance/simplicity/perf | S.B carve landed (SOUND) | **RE-ISSUED → auto-RED** (`:102`) — VERDICT #19 "performance god awful" refutes the perf half | T.G (perf from ground-up); T.F (structure) |
| NO legacy code | S.C landed (SOUND) | **RE-ISSUED → auto-RED** (`:59,104`) — owner does not trust totality | **T.S** (lane 21 residual sweep) + §1-litany |
| delineate + fold chronic/deferred items | §4 fold table authored (74 rows) | **RE-ISSUED ×2 → auto-RED** (`:106,108`) — the re-verification never ran; 52/74 unverified, 8 false-as-written (lane 27) | **T.S1** (ledger re-run) |
| Recap ALL prompts — ensure addressed | **NOT LANDED** — `PROMPT-RECAP.md` + `proof:prompt-recap-s` absent (lane 28 F1) | **RE-ISSUED → auto-RED** (`:110`) — the recap never ran; the substrate self-certified | **THIS LEDGER (T.S7)** + `proof:prompt-recap-t` (T.M10) |
| This is NOT an implementation phase | S was DEV-at-plan → owner authorized IMPL (OWNER-ASKS row 3) → owner rejected the impl | **RE-ISSUED → auto-RED** (`:112`) — the deepest recursion: the "dev" tranches keep shipping rejected impls | T is dev-only; the recursion is the finding (lane 28 F5) |
| (batches of 3 · Fable+frontend-design for ALL design · Opus/Sonnet fan-out) | S ran 11×100% + 10 Fable lanes | **RE-ISSUED** (`:114`) — the *shipped* S.G surfaces got no per-page Fable+owner pass | T.M2 (owner-review precondition); all design routed Fable |

**Census verdict:** all 7 clauses are verbatim re-issues. **None may be marked `ADDRESSED` until a
post-2026-07-04 owner observation clears it** — the recap-gate enforces this automatically (T.M10
clause (iv)). This is the single strongest machine-detectable signal that the spirit did not land.

---

## §2 — The S-kickoff twelve elements → landed reality → owner verdict → T home

Spirit token = the owner's live-review observation where one exists; else `PENDING-OWNER` / a
below-sight-line SOUND finding.

| # | S-kickoff element | Letter | Spirit-status | T home |
|---|---|---|---|---|
| 1 | deeper library sub-zoning | ✓ landed | SOUND (below sight-line; lane 24) | none — terminal |
| 2 | demo/app + playground restructure | ✓ partitioned | `OWNER-REJECTED → T.F` — VERDICT #26 "half baked", "wtf is app/chrome", "90% junk" | T.F (lanes 13/14/15) |
| 3 | SOTA re-research parse-that + animation | ✓ landed | SOUND (below sight-line; lane 26) — *except* the hero per-CHAR reversal | none (F/H) · hero → T.D |
| 4 | bbnf-lang HARD-EXCLUDED | ✓ held | held | none |
| 5 | glass-ui consume-published-only | ✓ tilde-pinned 4.0.1 | correctly open (BG/BH forthcoming) | HANDOFF → T.H |
| 6 | resurrect scene-switcher | built + converged 100/100 | `OWNER-REJECTED` — "looks awful" (SHELVED; the S.E lesson) | RECORD (terminal); the *lesson* → T.M2 |
| 7 | NO legacy (re-issued) | ✓ landed | RE-ISSUED (see §1) | T.S / lane 21 |
| 8 | fold ALL chronic + open | ✓ authored | **LEAKED** — re-verify never ran (lane 27) | **T.S1** |
| 9 | full prompt recap | ✗ NEVER RAN (lane 28 F1) | **LEAKED** | **THIS LEDGER (T.S7)** |
| 10 | mandatory-Fable per page + design routing | Fable ran at DEV + on the SHELVED proto | **LEAKED** — the *shipped* S.G surfaces got no per-page Fable+owner pass; VERDICT #16/#24 | T.M2 (owner-review); all design → Fable |
| 11 | 5-step convergence loop | ✓ 11×100% | **the convergence certified a rejected demo** (lane 26) | T.M2 (owner-in-loop, structural) |
| 12 | batches of three | ✓ | ✓ | carried into T orchestration |

---

## §3 — The 28-row live-review catalogue (the NEW T-verdict asks) — owner-observed, mapped

The full VERDICT.md catalogue, each row carrying its owner observation (the token) + its T home.
**This ledger ORIGINATES the §1c asks** (lane 28 §1c — single-option elision, per-CHAR hero, restore
the square panel, cursor-light-done-right, prune, the structural asks) — they appear in **no prior
recap**. Every row's spirit-status is the owner's rejection; each flips to `OWNER-APPROVED shot:NN'`
only when the owner reviews the T rebuild (T.M2 precondition).

| # | Shot | Surface | Owner observation (the token) | T home |
|---|---|---|---|---|
| 1 | 01 | cube | `OWNER-REJECTED shot:01 → T.A` — "does not render fully" (one die face) | T.A (`--spin-energy` bloom delete) |
| 2 | 02 | home typing card | `OWNER-REJECTED shot:02 → T.D` — "remove this crap" | T.D (typing-card excision) |
| 3 | 03,18 | the hero | `OWNER-REJECTED shot:03,18 → T.D` — per-CHAR uplift (reverses F.W16 word-split); hero lower/centred, overlap-OK; sub-header fonts wrong | **T.D · OD-4** |
| 4 | 04 | both docks | `OWNER-REJECTED shot:04 → T.C` — "blurry, broken, janky messes"; "all dock animations ruined" | T.C (dock recut; de-blur) |
| 5 | 05 | cube rx/ry/rz readout | `OWNER-REJECTED shot:05 → T.A` — "Remove this as well" | T.A · T.M4 inventory |
| 6 | 06 | dock cluster | `OWNER-REJECTED shot:06 → T.C` — ghost tooltip; home divider superfluous; play button must be first | T.C |
| 7 | 07 | controls pane | `OWNER-REJECTED shot:07 → T.B` — "remove the surrounding pane" | **T.B · OD-5** (two floating GlassPanels) |
| 8 | 08 | amiga gesture legend | `OWNER-REJECTED shot:08 → T.E` — "remove all elements like this" | T.E / T.B (gesture-legend layer) |
| 9 | — | amiga | `OWNER-REJECTED → T.A` — "broken mess, does not interleave/stack" | T.A (NaN/rotation cure; group ride) |
| 10 | 09 | dock cluster context | `OWNER-REJECTED shot:09 → T.C` — context for #12/#13 (elision · divider · order) | T.C |
| 11 | 10 | square caption block | `OWNER-REJECTED shot:10 → T.A/T.E` — "superfluous nonsense" | T.A/T.E · T.M4 inventory |
| 12 | — | square | `OWNER-REJECTED → T.B` — "totally a mess and unusable"; **restore the keyframes/controls/timeline panel** (reverses S.G2's honest-collapse) | **T.B** (SceneFacility triad) + T.A |
| 13 | 11 | easing telemetry | `OWNER-REJECTED shot:11 → T.E` — "Remove all of this" | T.E |
| 14 | 12 | easing canvas + ball | `OWNER-REJECTED shot:12 → T.E` — "just have the easing balls previewed here" | T.E (specimen drawer) |
| 15 | 13 | Gallery button | `OWNER-REJECTED shot:13 → T.E` — "remove this button" | T.E (gallery door) |
| 16 | — | easing page | `OWNER-REJECTED → T.D/T.E` — "looks awful, re-design with glass-ui; don't like this latent red theme"; fonts wrong | **T.D** (red-kill, theme) + T.E |
| 17 | 14 | spring dock dup | `OWNER-REJECTED shot:14 → T.C` — single-option elision (dock + animation) | **T.C** (§1c-originated) |
| 18 | 15,16 | spring presets + KfPillTabs | `OWNER-REJECTED shot:15,16 → T.B/T.H` — controls-model like cube/amiga/square; "why aren't these glass-ui components?" | T.B + T.H (KfPillTabs excise) |
| 19 | — | every page | `OWNER-REJECTED → T.G` — "performance god awful, rethought from the ground up" | **T.G** |
| 20 | — | motion-path | `OWNER-REJECTED → T.E` — "barely works" | **T.E · OD-1** |
| 21 | 17 | morph | `OWNER-REJECTED shot:17 → T.E` — "does not work at all" (bare grid) | T.E · OD-1 / T.A (MorphSVG) |
| 22 | — | cursor light | `OWNER-REJECTED → T.D` — "done right" (or removed) | **T.D · OD-2** |
| 23 | — | compose | `OWNER-REJECTED → T.E` — "remove this crap"; prune motion-path/morph/compose | **T.E** (compose DELETE) |
| 24 | — | fonts/sizes sitewide | `OWNER-REJECTED → T.D` — "not right at all"; glass-ui consistency | **T.D** (font-tuple gate) |
| 25 | — | panel facility | `OWNER-REJECTED → T.B` — "we forgot about that facility entirely" | **T.B** (SceneFacility everywhere) |
| 26 | — | demo/ structure | `OWNER-REJECTED → T.F` — re-structure first-principles; @/styles, app/chrome, app junk, scenes composition | **T.F** (§1c-originated) |
| 27 | — | glass-ui | `OWNER-REJECTED → T.H` — leverage latest glass-ui; delineate gaps | **T.H** (the ask letter) |
| 28 | — | codebase | `OWNER-REJECTED → §1 + T.S` — the standing refactor litany re-issued verbatim | §1 standing mandate + lane 21 sweep |

---

## §4 — The S-residue CARRY-INTO-T rows (closing S by named transfer)

S is **not re-opened**; its residue is transferred by name (lane 27 F1; lane 28 F6). Each row's T
home is a concrete wave; the spirit-status is `PENDING-OWNER` (the transfer is a plan act, not yet an
owner-observed close) except where noted.

| Carry | S state | Truth (audited) | T home |
|---|---|---|---|
| S.Z1 (prompt recap) | PENDING-IMPL | never ran; `proof:prompt-recap-s` + target absent (lane 28 F1) | **THIS LEDGER (T.S7)** + `proof:prompt-recap-t` (T.M10) |
| S.Z2 (template + RE-EXECUTION) | PENDING-IMPL | never ran (lane 27 F1) | **T.S1** (from-clean re-run) + T.M9 (board-live) |
| S.Z3 (FINAL + version) | PENDING-IMPL | never ran (lane 27 F1) | **T.Z** (T-equivalent close) |
| chronic ledger re-verify (52/74 unverified) | FOLD authored, re-verify unrun | **T.S1 LANDED (partial + remainder)** — the F2 tier-fix + rows 16/22 landed (`b19929b`); the remainder re-pointed rows 69/71/72 (71/72 GREEN, 69 rides `proof:square-honest` v2 → batch ③). ~33 un-backticked FOLD rows remain (the 'missing-witness wording' class, each owned by its landing wave) so `proof:chronic-closure` stays a T_BORNRED_BACKLOG gate — the batch-② '52→3' claim was inaccurate (the honest count is 33) | **T.S1** (backlog) |
| `ci.yml` stale `1.2.0` literal | — | **LANDED** — the Q-era literal single-sourced out (`b19929b`); `proof:ci-coverage` exits **0** on the merged tree (was exit 1, lane 27 F7) | **T.S1** ✓ |
| `drag-gesture` (the ONE named carry) | FOLD "discharges" | **T.S2 SEAM FIXED + occlusion residual carried** — root-caused to TWO defects: the `useTouchGate` mouse-mis-gate SWALLOWING the seam arming (FIXED — mouse/pen bypass, validated live) + the fixed TransportDock (z-40) OCCLUDING the easing ribbon-slider (residual → rides the T.C/T.E/T.B dock/controls redesign). 4/5 surfaces green; the browser leg still reds on easing/ribbon-slider (occlusion), so the backlog row STAYS (a named carry) | **T.S2** (seam) + **T.C/T.E/T.B** (occlusion) |
| S session-log ends ~40% early | — | **BACKFILLED** (T.S5) — the log carried to the S terminus `dee5aa6` (S.G3/F6/B8/C4·S2/⑩/T-pivot narrated); `proof:board-live` freshness GREEN | **T.S5** ✓ + T.M9 |
| KF-7 `PropertyDescriptor_2` | DISPATCH, unwatched | **LETTER LANDED** (`fa86147`, `KF-TO-VALUEJS-T.md §1`) + `proof:no-collision-rename` born-RED; STILL unrenamed at value.js **3.0.0** (re-verified T.S3 sweep) — greens only when value.js ships `CSSPropertyDescriptor` | **T.S3** (born-RED tripwire) |
| value.js 2.0.1 self-dependency phantom | not flagged | **LETTER LANDED** (`KF-TO-VALUEJS-T.md §2`) + `proof:no-nested-self-dependency` born-RED; **FIXED in value.js 3.0.0** (self-dep dropped) — greens on the kf re-pin (T.S3 pin eval) | **T.S3** |
| color2Into verification trail | verified-in-prose | **LANDED** — the itemized `proof:consume-bundle` exit 0 captured in `KF-TO-VALUEJS-T.md §3` (no longer a bare prose assertion) | **T.S3** ✓ |
| S.A3 auto-deploy | FOLD "revived" | **MECHANISM LANDED** (`b13dd65`, T.S6) — `deploy-pages.yml` `workflow_run` auto-path GATED on green `demo-correctness`; the auto-path deploy-run `success` oracle fires at **T.Z** (owner-gated). Row 16 honestly re-dispositioned at T.S1 | **T.S6** + T.S1 ✓ |
| DM-22 named-selector deferral | DEFERRED since P | **LANDED** (`47fd174`, T.S4) — the stale comment retired; the deferred-resolution step EXISTS at `bindTimeline` (phase→%), the play-time guard the accepted terminal contract; `grep 'DEFERRED to a follow-up wave' src/` → 0 | **T.S4** ✓ |
| 3 orphaned S.B6 type-surface gates | EXCLUDED "dev-only" | runnable + passing, never CI-wired (lane 27 F9) | **T.M8** |
| roster count 203 (diet inverted) | FOLD "190→~120" | 203 today (lane 27 F10 / lane 24) | **T.M8** |
| **OWNER-ASKS row 4** (the verdict) | `IN EXECUTION` / blocks S close | circular deadlock — row 4 *is* the tranche that supersedes the S recap gate (lane 28 F6) | **THIS LEDGER (T.S7): `→ Tranche T (this ledger)` — TERMINAL by transfer** |

**Deadlock break (lane 28 F6).** `proof:prompt-recap-s`'s S6 clause could never green because
`OWNER-ASKS.md` could never be fully-dispositioned while row 4 (the verdict) pointed at the successor
tranche. Dispositioning row 4 **here** as `→ Tranche T (this ledger)` is terminal: S's recap closes
by transfer, not by an in-S re-run that can never happen. This ledger is that transfer.

---

## §5 — The recurring-correction-shape register (promote a rejection pattern to a standing precept)

New row class (lane 28 F4 / T.M10): a **rejection pattern that recurs ≥2×** is promoted from N
discrete per-feature rulings to **one standing precept with its own gate**. The prior recap taxonomy
had no home for "a correction shape that generalizes" and filed the N-Stage 4× rejection as a closed
feature story — missing that it was the *signature* of the whole-demo rejection that followed.

| Correction shape | Recurrences | Promoted precept | Gate |
|---|---|---|---|
| **owner rejects on taste what the process passes on convergence** | N-Stage scene-switcher ×4 ("completely awful" → "still awful" → "totally and unmeasurably wrong" → "shelf this idea"); then the S.E scene-stage (SHELVED); then the **whole S impl demo** (2026-07-04) — **≥3× and escalating** | *critic-convergence + a green born-RED oracle is necessary but NOT sufficient to close a design wave; an owner (or owner-proxy live-review) token is required* | **T.M2** `proof:owner-review-gate` (+ T.M10 clause (iii); this register lives in this ledger) |
| **a green source-shape gate coexists with "reject on sight"** | the gate-blindspot lesson (MEMORY) recurred at scale despite S.A4; ≥9/22 verdict items had gates *enforcing* the rejected state (lane 29) | *no instrument gate may stand as the appearance bar; appearance gates must be owner-anchored + quality-shaped* | **T.M1/M3/M4/M5/M6** (the born-OWNER gate class) |

---

## §6 — OWNER-ASKS disposition mirror (all four S rows terminal)

| # | Ask (operative) | S disposition | T-ledger disposition |
|---|---|---|---|
| 1 | process the value.js R coordination letter | ADDRESSED (rulings 5+6 ratified + executed `c6eef78`) | terminal — value.js follow-ons (KF-7 / self-dep) carry → **T.S3** |
| 2 | execute doc changes + prep compaction | ADDRESSED (`c6eef78`) | terminal |
| 3 | THE IMPL AUTHORIZATION (totality; publish/deploy grant) | ADDRESSED (impl drive ran; rulings 1-4 resolved) | terminal — deploy grant governs **T.S6** + T.Z |
| 4 | **THE LIVE-REVIEW VERDICT + T DIRECTIVE** | `IN EXECUTION` / **blocks S close** | **`→ Tranche T (this ledger)` — TERMINAL by transfer (§4 deadlock break)** |

With row 4 transferred, `OWNER-ASKS.md` is **fully dispositioned** — the inherited S6 clause
(`proof:prompt-recap-t` clause (v)) can green. No S wave re-runs; the transfer *is* the close.

---

## §7 — Per-wave update protocol (born-at-entry → updated-per-wave)

This skeleton is the entry state. The discipline that keeps it honest (T.M10's binding):

1. **A design/appearance/interaction row** flips `OWNER-REJECTED → OWNER-APPROVED shot:NN'` **only**
   when its owning T wave closes **with a committed owner (or owner-proxy live-review) token** —
   critic-convergence + a green born-RED oracle is necessary but **not sufficient** (T.M2). No band,
   no green gate, may stand in for the token (T.M10 clauses (ii)/(iii)).
2. **A structural/perf/hygiene row** flips `PENDING-OWNER → ADDRESSED` when its owning wave's gate
   exits 0 from clean AND (for perf/appearance) carries the blocking OWNER-authority declaration
   (T.M6) — a green source-shape gate alone does not clear a row the owner observed.
3. **A §1 standing-mandate clause** flips off `RE-ISSUED → auto-RED` **only** on a post-2026-07-04
   owner observation clearing it (the re-issuance census, T.M10 clause (iv)) — never on a band mapping.
4. **The ledger is updated at the event**, appended to T's board (`PROGRESS.md`) amendment log under
   T.M9's freshness discipline — never reconstructed at close. This is what makes the F1 failure mode
   (recap scheduled last, never reached) structurally impossible for T.

**Entry-state summary:** 0 rows `OWNER-APPROVED`; 22 design/appearance rows `OWNER-REJECTED → T-wave`;
7 standing-mandate clauses `RE-ISSUED → auto-RED`; the structural/perf/S-residue rows `PENDING-OWNER`
or transferred. That honest zero-approval baseline is the anti-leak instrument the S recap never was.

---

## §8 — Mid-T owner asks (arriving DURING T — the S.Z1 mechanism carried forward; mirrors `OWNER-ASKS.md`)

Owner asks that land mid-development are recorded here at the event with their spirit-status token
(§ schema above), mirroring `OWNER-ASKS.md`. Per §7 clause 4 the row is appended when the ask arrives,
never reconstructed at close.

| # | Date | Ask (verbatim headline) | Spirit-status (token) | T home |
|---|---|---|---|---|
| 1 | 2026-07-05 | **THE GRAND COLOCATION EDICT** — recursive colocation for ALL file directories (components colocate sub-components/composables/skeletons/constants/styles; shared dirs hold only truly module/global-level members; long dirs always broken into encapsulated modules), **demo AND library**, plus the AGGRESSIVE demo purge (deprecated/legacy/superfluous/dead-export/`any`-ceiling/glass-ui-usage) — `OWNER-ASKS.md` row 1 | `PENDING-OWNER` — the T.F cure is planned + charter-amended, not yet built + owner-reviewed (a structural ask; no green gate may stand as its spirit oracle — §schema) | **→ T.F** (F21 the `proof:colocation` keystone gate · F22 the library half · F23 the aggressive purge); charter §1/§4 amended same-day; `waves/T.F.md` edict-fold landed |

**Note.** This mid-T `PENDING-OWNER` ask amends the §7 entry-state summary by one row; it flips to
`OWNER-APPROVED shot:NN'` only on a post-build owner review of the re-structured tree (T.M2
precondition) — a green `proof:colocation`/`proof:zone-cohesion`/`proof:no-dead-export` is necessary
but **not sufficient** (lane 26 "green was the defect").
