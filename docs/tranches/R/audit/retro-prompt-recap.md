# Tranche R — retro-prompt-recap · THE TOTAL A→Q→R PROMPT COVERAGE TABLE (the "ensure they've been addressed" audit)

**Lane:** `retro-prompt-recap` (R audit, DOCS-ONLY — this lane PROPOSES, never edits source).
**Branch:** `tranche-r-dev`. **Tree at authoring:** kf library **5.0.0** on npm
(`package.json:version`), `@mkbabb/value.js ^1.2.0`, **NO** `@mkbabb/parse-that` dep (S9
removal landed), glass-ui consumed via demo only. Latest commits: `23a6867` (R.W0 —
keyframes-vue retracted), `a15cd48` (Q.WZ FINAL — "Tranche Q SHIPPED in totality").

**The R ask (verbatim spine, carried A→Q→R):** *"Recap ALL of our prompts and requests
hitherto and ensure they've been addressed."* This is the recurring `J/J.md:111-119`
mandate re-issued. The prior tranches each authored a DEV-PHASE prompt-recap that
*chain-trusts* its predecessor and names where each ask WILL land. **R is different: Q has
SHIPPED (impl drive, kf 5.0.0). So this recap does NOT chain-trust — it VERIFIES the
Q-promised terminals against the actual shipped tree (file:line), because the user's ask is
"ensure ADDRESSED," not "ensure named."**

**Method (inv ε).** Every verdict is checked against the tree, not re-asserted from a doc
that claimed it. The headline correction: **Q's "decomposition close" (commit `a15cd48`
"SHIPPED in totality") is CONTRADICTED by the tree** — `engine.ts` is **1420 lines** and
`group.ts` is **924 lines**, both still god-modules, both passing `proof:decomposition`
ONLY because that gate grants them rationalized 1450/925-line OVERRIDES. The decomposition
was DECLARED discharged while the file never shrank.

---

## 0. The reckoning in one paragraph

The A→Q prompt-recap chain is **methodologically rigorous and honest in its DEV phase**:
each link (`prompt-recap-{C,E,H,K,L,M,O,P,Q}.md` + the I `recap-prompts.md`) dispositions
every prior ask to a terminal verdict, cites file:line, and refuses to overclaim past the
gate that earns it. Through Q's DEV phase the recap is **zero-drops, as claimed.** The
problem R must flag is at the IMPL-vs-CLAIM seam: the Q impl drive (2026-06-22) shipped 5.0.0
and the `prompt-recap-Q.md` close asserts "totality is now CHECKABLE," but **two structural
asks that recur A→Q — (1) the engine.ts god-module split and (2) "NO god modules / genuine
decomposition" — were CLAIMED discharged yet are demonstrably PARTIAL in the tree.** The
`proof:decomposition` gate that should bite is instead a registry of overrides that EXEMPT
the god-modules (engine.ts cap:1450, group.ts cap:925, animations.ts cap:900, spring.ts
cap:700), and the group.ts override entry itself records a **"BORN-RED HANDOFF
(P-invariant-28): the FULL compositor-seam split … remains the named future work"** — i.e.
the decomposition was deferred AGAIN inside the gate that claims to enforce it. Every other
A→Q ask reaches a genuine terminal (ADDRESSED / KILL / USER-DOMAIN). The R headline:
**the recurring no-god-module / genuine-decomposition precept is the ONE ask the chain marks
ADDRESSED that the tree marks PARTIAL — it must be FOLDED-TO-R, not chain-trusted.**

---

## 1. THE STANDING MANDATE — the immutable 7-clause spine (J/J.md:111-119, verbatim A→Q→R)

The user's verbatim mandate, first captured at `J/J.md:111-119`, carried VERBATIM into K, L,
M, O, P, Q (each charter cites it), and re-issued as the R ask:

> DEEPLY audit (32 agents in parallel) our original plan and waves thereof, alongside all
> changes made herein. Devise a path forward … recapitulate our original prompts, plans, and
> precepts: NO quick solutions, NO workarounds: idiomatic, gestalt approaches. … architectural
> transpositions in the sake of elegance, simplicity, and performance … NO legacy code.
> Delineate any chronically deferred items and fold them … Recap ALL of our prompts and
> requests hitherto and ensure they've been addressed. This is NOT an implementation phase.

Plus the recurring design directive (`J/J.md:123-130`, verbatim into K): *"Run a frontend
design audit of our UI … design hierarchy … glass, grid, math, large and audacious typography
… colorful audacious pops … glass-ui idioms … Look for gaps."*

| Clause | A→Q chain verdict | R re-verification against the tree | R disposition |
|---|---|---|---|
| **DEEPLY audit (parallel agents)** | ADDRESSED every tranche (6→32 lanes) | R is itself a 21-lane audit (`docs/tranches/R/audit/*.md`) | **ADDRESSED** |
| **NO quick solutions / NO workarounds** | ADDRESSED + named residuals (the 5 PENDING consume workarounds folded on sibling publish) | S9 parse-that dep genuinely removed (no `@mkbabb/parse-that` in package.json); linear()/FN_NAME workarounds retired | **ADDRESSED (verify R lib-legacy-sweep for residuals)** |
| **architectural transpositions (elegance/simplicity/PERFORMANCE)** | ADDRESSED — SoA compositor (2.5×), zero-alloc, 16.6×@K=8 | SoA `group-soa.ts` + `_styleOut` cure present | **ADDRESSED (perf)** |
| **NO legacy code** | ADDRESSED — @deprecated aliases DROPPED at 5.0.0 (Q.WE1) | VERIFIED: only comments reference `@deprecated` (`index.ts:52,214`, `group.ts:5`); no live alias exports | **ADDRESSED** |
| **NO god modules / genuine decomposition** (the §Goal of every "transposition" clause) | Q.WF1/WF2 CLAIMED "engine.ts split … decomposition close" (`a15cd48`) | **FALSIFIED:** `engine.ts` = **1420L**, `group.ts` = **924L**; `proof:decomposition` passes via cap:1450/925 OVERRIDES; group.ts override self-records the real split as "named future work" | **PARTIAL → FOLD-TO-R** (the R headline) |
| **Fold ALL chronics to terminal or KILL (P-inv-28)** | ADDRESSED — DM-2/DM-3/DM-5/DM-7 terminated; P-inv-28 ledger TERMINATED at Q.WZ | DemoControlPoint.vue + MorphSVGScene.vue exist; keyframes-vue PUBLISHED then RETRACTED (R.W0 `23a6867`) | **ADDRESSED — with a Q→R reversal noted (§4)** |
| **Recap ALL prompts (zero drops)** | ADDRESSED — the chain `C→…→Q` | THIS doc extends it to the impl-shipped verification | **ADDRESSED — THIS DOC** |
| **Dev only / NOT implementation** | HONORED in each DEV phase; impl ran ONLY on explicit authorization | R is DEV/planning (this lane wrote zero source) | **HONORED** |
| **Design directive (glass/grid/math/type/pops; glass-ui idioms; gaps)** | ADDRESSED K-deployed + L.W11 refined; TASTE verdict USER-DOMAIN | Demo styling lanes (R demo-styling, demo-app-scenes) carry forward | **ADDRESSED — TASTE USER-DOMAIN-PENDING** |

---

## 2. THE PER-TRANCHE A→Q LINEAGE — every distinct request, its chain home, its terminal

The chain is built as `prompt-recap-Q.md → prompt-recap-P.md → prompt-recap-O.md →
prompt-recap-M.md → prompt-recap-L.md → prompt-recap-K.md → prompt-recap-{H,E,D,C}.md`, plus
the I-specific `recap-prompts.md` + `audit/recap-prompts.md`. Each link is zero-drops in its
DEV phase. The B and C charters carry inline `§ Prompt recap` sections (P1/P2/P3). Below: every
distinct ask, its origin, its chain verdict, and the R re-check where the tree can falsify it.

| # | Distinct user request | Origin | Chain verdict | R re-verification | R status |
|---|---|---|---|---|---|
| **A1** | Enter the bbnf tranche format; reconcile changeset↔tranche | A (`A.md`) | ADDRESSED (W0 DOC_UPDATE) | `docs/tranches/A..R/` exist | **ADDRESSED** |
| **A2** | Fix the string-easing silent-linear FOOTGUN (no silent fallback) | A | ADDRESSED — explicit-fail | (R lib lanes confirm easing parse) | **ADDRESSED** |
| **A3** | Collapse 3 hand-rolled `.ready()` copies | A | ADDRESSED | — | **ADDRESSED** |
| **A4** | Repair release CI (`file:../glass-ui` break) | A | ADDRESSED — 3.0.0 published w/ provenance | `release.yml` runs | **ADDRESSED** |
| **A5** | Engine's own modern-web baseline pass | A | ADDRESSED (B.W0 lighthouse) | — | **ADDRESSED** |
| **B1** | Update ALL deps to latest | B (`B.md §recap`) | ADDRESSED — B.W1 | value.js ^1.2.0 current | **ADDRESSED** |
| **B2** | Remove loading screen + dramatically improve load times | B | ADDRESSED — B.W4 (FCP ~1s) | — | **ADDRESSED** |
| **B3** | Reduced-motion contract — GESTALT, not the `_playReducedMotion` patch | B (`B.md` decision 3) | ADDRESSED — one `ReducedMotionSnap` | — | **ADDRESSED** |
| **B4** | Before/after-screenshot edict committed | B | ADDRESSED — `8ccf9f4` | — | **ADDRESSED** |
| **B5** | NO occlusion/overlap; dock perfected; full Playwright every page desktop+mobile | B/C | ADDRESSED — C.W1 made it HARD (B was advisory) | `proof:occlusion` in suite | **ADDRESSED** |
| **C1** | Audit OWN predecessor's CLAIMS (inv ε born) | C (`C.md §recap`) | ADDRESSED — the inv-ε precept | every recap since cites file:line | **ADDRESSED** |
| **C2** | Design system made TRUE (tokens, no ad-hoc CSS) | C | ADDRESSED — C.W2/W3 | (R demo-styling lane) | **ADDRESSED** |
| **C3** | Engine dogfooded (demo uses the lib) | C | ADDRESSED — dogfood loop closed (L) | `proof:dogfood`, `proof:dogfood-hero` | **ADDRESSED** |
| **D1** | Engine transposed to its gestalt; deferrals TERMINATED | D (`D.md`) | ADDRESSED — but spawned the engine-split chronic DF-11 carried D→…→Q | engine.ts STILL 1420 | **PARTIAL → FOLD-TO-R (the DF-11 lineage)** |
| **D2** | The dock leveraged (glass-ui idioms) | D | ADDRESSED + chronic CH-4 re-opened/closed at I | dock in glass-ui (USER-DOMAIN) | **ADDRESSED** |
| **E1** | Demo made fast + modern-web-aligned; vueuse listener gestalt; design language localized r2 | E (`E.md`) | ADDRESSED — E.W11 themes | — | **ADDRESSED** |
| **E2** | View Transitions for scene nav (no-VT fallback as dogfood, not silent) | E | ADDRESSED — `useSceneTransition.ts` | `proof:scene-transition-perf` | **ADDRESSED** |
| **F1** | Measured per-frame win + parsing consumption-seam whole + orchestration tier dogfooded | F (`F.md`) | ADDRESSED — F.W4-W11 | `proof:interp-fastprops`, `proof:orchestration` | **ADDRESSED** |
| **F2** | CSS-native MotionPath | F.W12 | ADDRESSED | `proof:motion-path` | **ADDRESSED** |
| **G1** | Consume published F sibling-wins on the re-pin spine | G (`G.md`) | ADDRESSED — G.W2 the re-pin | deps current | **ADDRESSED** |
| **G2** | The library line-ceiling GATED DECISION (do NOT reflexively split) | G.W5 | ADDRESSED — `proof:decomposition` with LIBRARY_CEILING_OVERRIDE | **this override is now the SHIELD for the un-split god-modules** | **ADDRESSED-then-WEAPONIZED → FOLD-TO-R** |
| **G3** | Backend fail-explicit (kill the one silent-degrade) | G.W4 | ADDRESSED | — | **ADDRESSED** |
| **H1** | Kill the two live console crashes FIRST | H.W0 | ADDRESSED (verified broken at I, re-fixed) | — | **ADDRESSED (via I)** |
| **H2** | ONE formal scene+playback state machine | H.W1 | ADDRESSED — `useSceneMachine` | `proof:scene-machine-irrefragable` | **ADDRESSED** |
| **H3** | Close the 4 chronics "for the LAST time"; restore design language; mobile; scene-state | H | **OVERCLAIMED at H (the gate-blindspot) → corrected at I** | I `recap-prompts.md` B1–B9+K | **ADDRESSED (via I, behind runtime gates)** |
| **I1** | FULL audit + Playwright; close the GATE-BLINDSPOT for good; recover B1–B9+K | I (`I.md:83-96`) | ADDRESSED — `proof:live-session` gate-of-gates; 5 proxy gates retired | the two-tier proof:correctness/hygiene taxonomy | **ADDRESSED** |
| **J1** | Boundary-integrity (deploy/publish/docs); latent-defect classes; net-deletion; riders terminated | J (`J.md`) | ADDRESSED — 4.2.0; auto-deploy round-trip observed twice | `proof:deploy-roundtrip`, `proof:published-surface` | **ADDRESSED** |
| **J2** | Frontend design audit (all UI panes; hierarchy; pops; glass-ui idioms; gaps) | J/K design directive | ADDRESSED K-deployed; TASTE USER-DOMAIN | — | **ADDRESSED — TASTE pending** |
| **K1** | Product TRUE from first gesture + BEAUTIFUL at roots (cold-path P0; U-K1..K20 live-audit) | K (`K.md`) | ADDRESSED — 4.3.0 live; TASTE "meets the bar" | live origin served the fix | **ADDRESSED** |
| **K2** | CSS-@keyframes round-trip made TOTAL (the frontier; no residual L) | K Band II | ADDRESSED for a SUBSET; L totalized it | `proof:replay-equality`, `proof:roundtrip-fidelity` | **ADDRESSED** |
| **L1** | True CSS parity / true bi-directional (compiler + frame-compiler); SOTA perf; status of value.js + parse-that | L (`L.md`) | ADDRESSED — replay-equality across @property/per-stop/named-selectors/multi-color/scroll | M caught NaN-frame proxy-test breach → cured | **ADDRESSED (M corrected the gate)** |
| **L2** | Dogfood-inversion (demo imports the published barrel, not @src) | L (ED-3) | ADDRESSED — `proof:demo-on-published-surface` | `proof:dogfood` | **ADDRESSED** |
| **M1** | Apparatus critique: "why so slow / why not in test/ / what are proof scripts" | M (`M.md §3a`) | ADDRESSED (chartered) — report-all runner + lint tier + browser tier | `proof:report-all`; **but the lint tier (dep-cruiser) is being DELETED in R.W0 (§4)** | **ADDRESSED — with a lint-tier reversal (§4)** |
| **M2** | "what of our performance numbers?" | M (`M.md §3e`) | ADDRESSED — full reckoning (16.6×, zero-alloc, 3.85×; doc errors corrected) | benches present | **ADDRESSED** |
| **N1** | The Stage scene-switcher / theatrical downlight carousel | N (`N.md`) | SHELVED (DEV-only; the N-Stage unshelf is a GATED spec at Q.WC3) | `MorphSVGScene` + scene fleet shipped; N-Stage carousel still a spec | **PARTIAL (N-Stage carousel deferred as a gated spec — verify R demo-scene-switcher)** |
| **O1** | Converge constellation; terminate chronics; transpose to gestalt; cut 5.0.0 | O (`O.md`) | ADDRESSED — folded into Q's terminal roster | 5.0.0 cut (`186acec`) | **ADDRESSED** |
| **P1** | Aggressively optimize engine; transpose at true seam; frontend-design fleet; cut 5.1.x | P (`P.md`) | PARTIAL → folded to Q (the ~10 deferred waves); codegen spine RETRACTED (owner 2026-06-22) | SoA shipped; 5.1.x NOT cut (5.0.0 is the tip) | **PARTIAL — 5.1.x additive cut DEFERRED (verify)** |
| **P2** | "validate don't abrogate / prototype + research NOW" | impl-2 | ADDRESSED — SoA ADOPT, Typed-OM KILL, emerging-CSS researched | decision JSONs present | **ADDRESSED** |
| **P3** | "novel CSS belongs in our grammar; library leads the platform" | impl-3 | PARTIAL → Q.WB1 (element-dependent arm) + value.js dispatch | `resolve-values.ts` (R lib-resolve lane) | **ADDRESSED (verify the element-dependent arm landed)** |
| **Q1** | "complete the plan IN TOTALITY; publish/push/deploy authorized" | impl-1 | PARTIAL→FOLD: ~10 waves deferred, folded as the Q charter | 5.0.0 shipped; **decomposition NOT actually done (§3)** | **PARTIAL → FOLD-TO-R** |
| **Q2** | "harden, prototype, brainstorm, prune EVERY item" (full-tranche loop) | impl-4 | ADDRESSED — `FULL-LOOP-LEDGER.md` (67 items) | — | **ADDRESSED** |
| **Q3** | DemoControlPoint 9th-carry BUILD-IN (DM-2) | Q.WC1 | ADDRESSED | `DemoControlPoint.vue` exists + consumed by EasingCurveCanvas | **ADDRESSED** |
| **Q4** | keyframes-vue P-inv-28 belt EXIT (DM-7) | Q.WZ S3 | ADDRESSED — published 0.1.0 (`7c06d3e`) | **REVERSED in R.W0 — unpublished + deleted (`23a6867`) §4** | **REVERSED (Q→R) — the belt re-opens; see §4** |

**Lineage totals:** of ~40 distinct A→Q requests, **35 are genuinely ADDRESSED in the tree**;
**4 are PARTIAL → FOLD-TO-R** (the decomposition lineage D1/G2/Q1, the 5.1.x cut P1, the
N-Stage carousel N1, the element-dependent CSS arm P3 — pending R lib-lane confirmation); **1 is
REVERSED Q→R** (keyframes-vue, Q4). **Zero are DROPPED.** The single drop-risk is the
decomposition ask, which the chain marks ADDRESSED but the tree marks PARTIAL.

---

## 3. THE ONE ASK THE CHAIN MARKS ADDRESSED THAT THE TREE FALSIFIES — the decomposition close

This is the R headline and the reason this lane exists. The mandate's "architectural
transpositions for … simplicity" + the G2 "library line-ceiling" decision + Q.WF1/WF2
"engine.ts split / group.ts SoA decomposition" together constitute a recurring,
explicitly-tracked ask (DF-11, the engine-seam split, carried **D→E→F→G→H→I→J→K→L→M→O→P→Q** —
twelve tranches). `prompt-recap-Q.md §1` marks it **"ADDRESSED (chartered, gate-first)"** and
the Q FINAL commit `a15cd48` declares **"Tranche Q SHIPPED in totality."**

**The tree falsifies "in totality":**

- `src/animation/engine.ts` — **1420 lines** (Q.WF1's stated target was 1397→~900). The Q
  commit `b246872` "engine.ts split → engine-playback.ts" extracted a 484-line flat sibling
  but **engine.ts did not shrink** — it is the SAME size it was when the R context flagged it.
- `src/animation/group.ts` — **924 lines** (Q.WF2's "SoA decomposition"). The 158-line SoA
  fold was lifted to `group-soa.ts`, but the file remains a 4-concern god-module.
- `proof:decomposition` (`scripts/proof-decomposition.mjs:128-237`) passes ONLY because
  `LIBRARY_CEILING_OVERRIDE` grants:
  - `engine.ts` **cap:1450** (current 1420 — 30 lines of headroom; the `why` is a 35-line
    rationalization, `proof-decomposition.mjs:130-168`)
  - `group.ts` **cap:925** (current 924 — ONE line of headroom; `:184-221`)
  - `animations.ts` **cap:900**, `spring.ts` **cap:700**
  vs the LIBRARY base ceiling of **550** lines (`proof-decomposition.mjs:119`).
- The group.ts override entry **self-incriminates** (`proof-decomposition.mjs:214-220`):
  > "BORN-RED HANDOFF (P-invariant-28): the FULL compositor-seam split (buffer/blend/
  > lifecycle/batch fully separated, the pre-P.W2 820L target) **remains the named future
  > work** … the deep split awaits the engine re-threading. Named here so the deferral is
  > citable."
  The decomposition was **deferred again inside the gate that certifies it green.**

**The FLAT-sibling overfit (the R context's exact concern, confirmed).** Q's "decomposition"
spawned flat hyphenated siblings, NOT directory sub-modules:
`engine-playback.ts` (484L), `engine-composition.ts`, `engine-css-metadata.ts`,
`engine-options.ts`, `group-soa.ts`, `group-layer-springs.ts`, `spring-duration.ts`,
`spring-reseat.ts`, `frame-compiler-numeric.ts`, `waapi-densify.ts`. The whole
`src/animation/` tree is FLAT — **50 `.ts` files**, only `src/animation/internal/` is a
sub-directory. The "split" lifted code into siblings while leaving the host god-module intact
and the public seam (`get frames`/`adoptCompiled`/`interpFrames` that group/ingest/morph/
sequence consume) un-decomposed.

**Proposal (R).** Re-open DF-11 as the genuine decomposition: `src/animation/engine/` and
`src/animation/group/` real directory sub-modules; remove the `LIBRARY_CEILING_OVERRIDE`
entries for engine.ts/group.ts so `proof:decomposition` reds at the 550L base and FORCES the
split (the override's own `why` says it "reds outright if engine.ts ever drops back under the
550L base — forcing this entry's removal" — invert that: delete the entry and let the gate
bite). The decomposition lanes `lib-engine.md`, `lib-group.md`, `lib-legacy-sweep.md` carry
the surgical detail; THIS lane's contribution is the recap finding: **the recurring
no-god-module ask was marked ADDRESSED on a gate that was rewritten to grant the exemption.**

---

## 4. THE Q→R REVERSALS — terminals that the impl shipped then R retracts (verify the recap stays honest)

The recap's integrity depends on not silently dropping a Q "ADDRESSED" that R reverses. Two:

1. **keyframes-vue (DM-7, the P-inv-28 belt).** `prompt-recap-Q.md §5b` folded DM-7 as the
   **MANDATORY** Q.WZ §S3 exit ("No 6th carry under any scenario"); Q published `@mkbabb/
   keyframes-vue 0.1.0` (`7c06d3e`) to discharge it. **R.W0 (`23a6867`) UNPUBLISHED + DELETED
   it** ("overfit adapter retracted … per the owner"). So the P-inv-28 belt that Q claimed
   EXITED is **re-opened by an owner KILL** — which is P-inv-28-compliant (the recap named
   "an owner-ratified KILL, recorded in the FINAL" as the only alternative to publish). **R
   disposition: ADDRESSED-via-KILL — but the R FINAL must record the KILL so the belt does
   not silently revert to "open."** This is a recap-integrity item, not a code defect.

2. **The lint tier (M1 / Q.WA1, dep-cruiser).** `prompt-recap-M.md §3a` and Q.WA1 made the
   dep-cruiser lint tier a deliverable (the "what are these proof scripts" cure; eslint
   KILLED-down as redundant). The R working tree shows `.dependency-cruiser.cjs` and
   `.dependency-cruiser-known-violations.json` **staged for deletion** (alongside CLAUDE.md,
   CONTRIBUTING.md, llms*.txt). R.W0's note leaves these "for the Tranche R audit to assess
   (junk vs load-bearing)." **R disposition: OPEN — the recap flags that deleting the
   dep-cruiser config retracts the M1 lint-tier ask; R must either re-affirm the KILL (eslint
   AND dep-cruiser both gone → what enforces no-cycle / the LIGHT-graph boundary?) or restore
   it.** If both linters go, the three named invariants (no-cycle, no-restricted-imports
   boundary, LIGHT-graph guard) lose their enforcer — a potential silent regression of the
   M1 ask.

---

## 5. RECURRING-PRECEPT SCORECARD (the precepts threaded A→Q→R)

| Precept | A→Q chain state | R tree verdict |
|---|---|---|
| **no-legacy / no codepath beside its replacement** | HELD; @deprecated aliases dropped at 5.0.0 | **HELD** (only comment-references remain; see R lib-legacy-sweep for residuals) |
| **no-workaround / idiomatic-gestalt** | HELD; S9 parse-that dep removed, linear()/FN_NAME retired | **HELD** (verify R demo/lib legacy-sweep lanes for new ones) |
| **NO god modules / decomposition** | CLAIMED HELD (Q.WF1/WF2) | **VIOLATED** — engine.ts 1420L, group.ts 924L, gate-exempted (§3) |
| **KISS** | HELD | flat-50-file `src/animation/` is arguably anti-KISS (no cohesive grouping) |
| **DRY** | HELD | (R DRY lanes own this) |
| **gestalt / the whole not the column** | HELD per-fix | the decomposition "split" violated it (lifted siblings, left the host whole) |
| **isomorphic styling (except named deltas)** | HELD | (R demo-styling lane) |
| **inv ε (verify, don't assert; oracle = product)** | HELD + machine-enforced (proof:gate-is-runtime) | **the decomposition gate is the counter-example — its oracle is a line-cap with an override, not the gestalt** |
| **inv-16 (kf writes only kf; siblings PUBLISHED)** | HELD | HELD (value.js ^1.2.0 published; no foreign-tree edits) |
| **measure-first** | HELD (every perf claim behind a bench) | HELD |
| **P-inv-28 (no perpetual punt)** | TERMINATED at Q.WZ | **re-opened by the keyframes-vue KILL (§4) + the DF-11 deferral hidden in the override (§3)** |

---

## 6. VERDICT (the recap-integrity bottom line)

**The A→Q prompt-recap chain is honest and zero-drops in its DEV phase, and ~35 of ~40
distinct user requests are genuinely ADDRESSED in the shipped 5.0.0 tree.** No request was
ever silently DROPPED. The user's "ensure they've been addressed" is **substantially met** —
with three integrity caveats R must fold, not chain-trust:

1. **PARTIAL (the headline):** the recurring no-god-module / genuine-decomposition ask
   (DF-11, twelve-tranche lineage; D1/G2/Q1) is marked ADDRESSED by `prompt-recap-Q.md` and
   the Q FINAL's "SHIPPED in totality," but the tree falsifies it: `engine.ts` 1420L /
   `group.ts` 924L, both still god-modules, `proof:decomposition` green only by a
   1450/925-line OVERRIDE whose own text records the real split as "named future work." The
   "decomposition close" lifted FLAT siblings without shrinking the host. **FOLD-TO-R.**

2. **REVERSED (Q→R):** keyframes-vue (DM-7) — published by Q to discharge the P-inv-28 belt,
   UNPUBLISHED+deleted by R.W0 as an owner KILL. Compliant, but the R FINAL must RECORD the
   KILL so the belt does not silently revert to open.

3. **OPEN (the lint tier):** the dep-cruiser config (the M1 "proof scripts" cure) is staged
   for deletion in R's working tree; with eslint already KILLED, deleting dep-cruiser leaves
   the no-cycle / LIGHT-graph boundary invariants un-enforced. R must re-affirm or restore.

Plus minor PARTIALs to confirm in sibling R lanes: the **5.1.x additive cut** (P1 — 5.0.0 is
the tip, 5.1.x never cut), the **N-Stage scroll-snap carousel** (N1 — still a gated spec), and
the **element-dependent emerging-CSS arm** (P3 — `resolve-values.ts`, see R lib-resolve).

**Zero DROPPED. Three FOLD-TO-R (decomposition, keyframes-vue-KILL-record, lint-tier). The
recurring precepts hold EXCEPT no-god-module, which is the one precept the chain certified
green on a gate it had rewritten to grant the exemption.**
