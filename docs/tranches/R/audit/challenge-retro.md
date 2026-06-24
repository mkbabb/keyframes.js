# Tranche R — Adversarial Challenge: RETROSPECTIVE + DEFERRALS lanes

**Challenger:** Claude Code (Opus 4.8, 1M)
**Date:** 2026-06-24
**Branch:** `tranche-r-dev`
**Targets:** `docs/tranches/R/audit/retro-prompt-recap.md`, `retro-deferred-ledger.md`, `retro-q-changes.md`, `retro-plan-waves.md`, `retro-api-in.md`, `retro-readme-docs.md`

**Charter (verbatim):** is the prompt-recap actually COMPLETE (any user request silently dropped)? Is the deferred-ledger fold honest and exhaustive (no chronic hidden)? Are the "Q overclaim" accusations fair and evidenced, or are they unfair pile-on? Is any proposed R scope actually re-litigating a settled ARCH kill? For each: verdict + critique + correction.

**Method.** Every load-bearing claim re-checked against the LIVE tree (`wc -l`, `grep`, `git show`, and by RUNNING the gates `proof:decomposition` + `proof:chronic-closure`). I do not trust a doc that claims a number; I re-measured.

---

## HEADLINE VERDICT

The retro lanes are **substantially SOUND and unusually well-evidenced.** The two most consequential claims — (1) `proof:decomposition` actually REDs on the live tree (resolve-values.ts 796 > 600 cap) and (2) `proof:chronic-closure` actually REDs (dangling `proof:keyframes-vue-published`) — **both reproduced exactly** when I ran the gates. The prompt-recap is genuinely zero-drops. The deferred-ledger is exhaustive and honest. The "Q overclaim" accusations are FAIR and tightly evidenced, not pile-on. No R scope re-litigates a settled ARCH kill.

The few corrections below are **calibration, not reversal**: a couple of severity labels overreach, one internal inconsistency between two lanes about the *same gate's* exit code, and one place where a lane mildly under-credits Q. None of these undermine the lanes' FOLD-TO-R recommendations.

---

## RE-MEASURED GROUND TRUTH (the anchor facts every challenge rests on)

| Fact | Doc claim | My re-measurement | Match? |
|---|---|---|---|
| `engine.ts` lines | 1420 | `wc -l` → **1420** | ✓ |
| `group.ts` lines | 924 | **924** | ✓ |
| `resolve-values.ts` lines | 796/797 | **796** | ✓ |
| `proof:decomposition` exit | "RED / EXIT 1" (plan-waves) | `node …; echo $?` → **1** (REDs on resolve-values.ts:797 > 600) | ✓ |
| `proof:chronic-closure` exit | "REDs NOW" (deferred-ledger headline) | **1** (dangling `proof:keyframes-vue-published`) | ✓ |
| `animate()` demo adoption | 0 call sites | bare `animate(` in `demo/**` minus rAF → **0** | ✓ |
| `new CSSKeyframesAnimation` demo sites | 32 | **32** | ✓ |
| `CSSKeyframesAnimation` static export | type-only (index.ts:219) | confirmed: only inside `export type {…}` block at :219 | ✓ |
| README Quick Start fence | ` ```ts ` not ` ```ts run `; no import line | confirmed: ` ```ts ` at README:4, **zero** import/require/from in lines 1-40 | ✓ |
| `package.json` exports | only `"."` (no subpaths) | confirmed: single `.` key | ✓ |
| `this as unknown as PlaybackHost` cast | engine.ts:917-918 | confirmed at **:918** | ✓ |
| PlaybackHost protocol members | "~35" | **36** members in the interface | ✓ (≈) |
| `getTimingFunction` fall-through comments | utils.ts:172,199 | confirmed "fall through to the registry / undefined" at **:172, :199** | ✓ |
| DQ-3 `contrast-color` kf consume | "ZERO kf source references" | `grep` over src/+scripts → **zero** | ✓ |
| known-violations cycle count | 15 (sibling cycles) | `git show HEAD:…` → **15** cycles incl. `engine.ts↔engine-playback.ts`, `group.ts↔group-soa.ts` | ✓ |
| working-tree governance deletions | 7 files staged-delete, uncommitted | confirmed: `.dependency-cruiser{.cjs,-known-violations.json}`, `CLAUDE.md`, `CONTRIBUTING.md`, `llms{,-full}.txt`, `src/animation/CLAUDE.md` all `D` | ✓ |

**Every anchor fact checks out.** This is the single strongest signal that the lanes did real work against the tree, not transcript-theater.

---

## CHALLENGE 1 — Is the prompt-recap COMPLETE? (any user request silently dropped?)

**Claim under test:** `retro-prompt-recap.md` §2 tallies "~40 distinct A→Q requests, 35 genuinely ADDRESSED, 4 PARTIAL→FOLD, 1 REVERSED, **Zero DROPPED**."

**Verdict: SOUND.**

**Evidence.**
- The request table enumerates A1–A5, B1–B5, C1–C3, D1–D2, E1–E2, F1–F2, G1–G3, H1–H3, I1, J1–J2, K1–K2, L1–L2, M1–M2, N1, O1, P1–P3, Q1–Q4 — a contiguous span across **every** tranche A→Q with no lettering gap. I grepped the IDs: the sequence is complete.
- The four PARTIALs (D1/G2/Q1 decomposition lineage, P1 5.1.x cut, N1 N-Stage carousel, P3 element-dependent CSS arm) are **surfaced in the body AND the summary** (lines 121, 123, 132-133, 257), not buried in a footnote. A dropped request would be one marked ADDRESSED with no tree check; instead the headline self-flags the ONE such case (decomposition) and FALSIFIES its own chain's ADDRESSED verdict.
- The recap correctly handles the settled ARCH kills as terminal, not dropped: **Typed-OM KILL** (P2), **codegen spine RETRACTED owner 2026-06-22** (P1) are both recorded as ADDRESSED/terminal with the owner-ratification cited. This is the honest disposition — a dropped request would simply be absent.

**The single genuine integrity risk the recap itself names** is the decomposition ask (DF-11, twelve-tranche lineage). The recap does NOT hide it — it makes it the *headline* and inverts its own chain's "ADDRESSED" to "PARTIAL → FOLD-TO-R." That is the opposite of a silent drop.

**Critique (minor calibration, not a drop):** the recap's "~40 distinct requests" is a *coarse* count — several rows bundle multiple sub-asks (e.g. H3 folds "4 chronics + design language + mobile + scene-state"; B5 folds "no-occlusion + dock + full-Playwright"). The tally is therefore an undercount of atomic asks, which makes "zero dropped" *easier* to claim. But spot-checking the bundled sub-asks (mobile → DM-11 `proof:spring-slider-continuous`; design-language → DM-10 `proof:font-census`) shows each bundled sub-ask is independently tracked in the deferred-ledger Group-4 roster. So the bundling does not hide a drop; it just makes the headline number softer than the underlying coverage.

**Correction:** none required. The "zero dropped" claim holds. R should adopt the recap's per-request table as-is. (Optional: when R re-issues, count atomic sub-asks rather than bundled rows, so the coverage number is conservative rather than flattering.)

---

## CHALLENGE 2 — Is the deferred-ledger fold HONEST and EXHAUSTIVE? (any chronic hidden?)

**Claim under test:** `retro-deferred-ledger.md` rosters every chronic with age + live status + FOLD disposition, headlined by "`proof:chronic-closure` REDs NOW."

**Verdict: SOUND (the strongest lane).**

**Evidence.**
- **The headline reproduces exactly.** I ran `node scripts/proof-chronic-closure.mjs` → exit 1, with the precise failure the doc quotes: `✗ [[C] DM-7 keyframes-vue 0.1.0 unpublished] … proof:keyframes-vue-published … does NOT resolve — a DANGLING reference.` The Q close claimed "the P-inv-28 ledger TERMINATED / proof:chronic-closure exits 0" — that claim is FALSE on the live tree, exactly as the lane states.
- **The roster is exhaustive across SIX groups:** ledger-integrity (DM-7), BC-gated (DM-1 8th-carry, DM-5 S1 6th-carry, DM-24 N-Stage), dropped Q dispatches (DQ-3 contrast-color, VJ-Q9 serialization, DM-5 S8), VERIFY-ONLY chronics (×8, DM-8…DM-15), FOLD-LANDED (DM-2/3, S7/S9, DQ-1…DQ-7), and NET-NEW R-born (the 7 working-tree deletions + the two RED gates). I cross-checked DQ-3: **zero** kf source references `contrast-color` despite value.js 1.2.0 shipping the parser — the "published-but-unconsumed" deferral is real.
- **The P-inv-28 re-reckoning is rigorous:** DM-1 is correctly identified as the **8th carry** into R (Q's register vowed "NO 8th carry") — a HARD STOP the lane refuses to let R silently re-book. This is the anti-chronic discipline working as designed.
- **No chronic is hidden.** The lane even surfaces chronics the Q FINAL marked terminal and demands re-verification (Group 4), and flags the *recurring structural skip* (M/O/P ledger re-points were all skipped) so R does not repeat it.

**Critique (minor):** Group 4's eight VERIFY-ONLY chronics are listed as "re-verify on the R dist" but the lane did NOT actually run those eight gates (it ran only chronic-closure + decomposition). So "re-verify obligation" is correctly stated as an obligation, not a result — honest, but it means the lane's exhaustiveness is *roster*-complete, not *status*-complete for Group 4. This is appropriately scoped (those are runtime/browser gates), but R must not read Group 4 as "verified green" — only as "rostered to verify."

**Correction:** none to the dispositions. R should treat the 10-item DISPOSITION SUMMARY as the binding fold list. The one tightening: Group 4 should be explicitly labeled "UNVERIFIED — re-run required" so no future reader mistakes the roster for a pass.

---

## CHALLENGE 3 — Are the "Q overclaim" accusations FAIR and EVIDENCED, or pile-on?

**Claims under test:** `retro-q-changes.md` + `retro-plan-waves.md` accuse Q of (a) a "superficial / self-justifying ceiling-allowlist" decomposition, (b) FINAL.md asserting "`proof:decomposition` FULLY GREEN" over a RED tree, (c) engine.ts 1397→~900 MISSED by ~470L, (d) the cap RAISED 1400→1450 not removed, (e) the mandated `proof:engine-seam-split` gate never authored.

**Verdict: FAIR + EVIDENCED (not pile-on).**

**Evidence — every accusation reproduces.**
- (a) **Self-justifying allowlist:** confirmed. The `LIBRARY_CEILING_OVERRIDE` for engine.ts is `cap:1450` (file 1420), group.ts `cap:925` (file 924, **+1 line headroom**). The override `why` for engine.ts literally argues the file is a "cohesive gestalt" and splitting it "severs that seam (the legacy-shape the Mandate forbids)" — confirmed verbatim at `proof-decomposition.mjs:130-168`. A ceiling +1 above the file it measures cannot bite; this is structurally a self-certifying gate.
- (b) **FULLY GREEN over a RED tree:** confirmed and *worse than the doc implies in one way, better in another*. The gate **DOES exit 1** today (resolve-values.ts 797 > 600). So FINAL.md:34's "proof:decomposition FULLY GREEN" is falsifiable by running the gate. This is the single most damning, and it is correct.
- (c) **engine.ts target missed:** confirmed. `wc -l` → 1420, vs the stated "1397→~900." The file is 20L *larger* than its own pre-split baseline.
- (d) **cap RAISED not removed:** confirmed. `proof-decomposition.mjs:130` `cap:1450` with the inline note that Q.WZ said this entry "would be REMOVED." The commit `b246872` that raised it is the same commit branded "the decomposition close."
- (e) **`proof:engine-seam-split` never authored:** confirmed — no `scripts/proof-engine-seam-split.mjs`, no package.json key. The keystone born-RED gate the spec made the acceptance oracle does not exist.
- **The cycle evidence corroborates the "flat-sibling created cycles" charge:** the known-violations baseline holds 15 `no-cycle` violations, explicitly between hyphenated siblings (`engine.ts↔engine-playback.ts`, `group.ts↔group-soa.ts`, `group.ts↔group-layer-springs.ts`, `drag.ts↔drag-2d.ts`). The "split" produced circular deps, not clean sub-modules — exactly as `retro-readme-docs.md §1e` and `retro-q-changes.md §3` claim.

**Why this is NOT pile-on:** the lanes give Q **explicit, specific credit** in the same breath — `retro-q-changes.md §4-5` KEEPs `group-soa.ts` as "the model of a GOOD extraction" (explicit args, no god-host, validated 3.7× perf), KEEPs `morph-svg.ts` (throws typed errors, no silent degrade), KEEPs the value.js 1.2.0 consume and the @deprecated drop. `retro-plan-waves.md` has a whole "What Q GENUINELY achieved" section crediting the real 484L playback extraction and the class-body drop to 1059L. A pile-on does not carve out the genuine wins this precisely. The accusations are confined to the *overclaim seam* (file-level + gate-level claims that the tree falsifies), with the *class-body-level* win acknowledged as real.

**Critiques (two calibration items).**

1. **INTER-LANE INCONSISTENCY on the same gate's exit code (the one real defect).** `retro-q-changes.md §1` describes the decomposition gate as one that "is structurally incapable of biting … green by construction" and lists resolve-values.ts under a note that it "claims 578L but the tree is 796L … *either* the gate is now RED *or* the cap was bumped" — hedging. But `retro-plan-waves.md` FINDING 1 states flatly and correctly that the gate **exits 1 RIGHT NOW** on resolve-values.ts. I confirmed plan-waves is right: the gate REDs. So `retro-q-changes.md`'s framing ("green by construction / cannot bite") is **half-wrong**: the override allowlist cannot bite on the *named* files (engine/group), but the gate as a whole DOES bite — on resolve-values.ts, whose growth (578→796) outran its cap (600). The honest synthesis: *the allowlist is a self-certifying escape hatch for the named god-modules, AND it failed to anticipate resolve-values.ts's growth, so the gate is currently RED — meaning Q's FINAL "FULLY GREEN" was false at close.* `retro-q-changes.md` should adopt plan-waves' confirmed exit-1 finding rather than hedging "either/or."

2. **Mild over-reach on `animate()` "effusive dynamicism" (retro-api-in §2).** The lane labels the 6-way runtime shape-sniff in `animate()` as "exactly the 'NO effusive dynamicism' the precept names." That is *defensible* but borders on overreach: a single-entry `animate(union)` dispatcher that branches on input shape is the **genre-standard** front-door pattern (motion's `animate()`, gsap's overloads all shape-sniff). The precept targets *gratuitous* dynamicism; a typed-union front door is arguably idiomatic. The lane's *stronger* and unimpeachable point is the **zero adoption** (0 demo sites vs 32 `new CSSKeyframesAnimation`) — that alone justifies "decide its fate." R should lead with the dead-by-disuse evidence, not the dynamicism label.

**Correction:** the Q-overclaim accusations stand as the binding R findings. Reconcile the one inter-lane inconsistency (gate DOES exit 1 — adopt plan-waves' measured result everywhere). Soften the `animate()` dynamicism framing to "dead surface" (the evidenced charge) rather than "effusive dynamicism" (the contestable one).

---

## CHALLENGE 4 — Is any proposed R scope re-litigating a SETTLED ARCH kill?

**Settled kills on record (from MEMORY + the tree):** Typed-OM KILL (P2, decision JSON), codegen/bbnf-lang spine RETRACTED (owner 2026-06-22, "not parse-that's job"), D7 SpanParser FALSIFIED (slower on V8 → retired), keyframes-vue RETRACTED (owner R.W0).

**Verdict: SOUND — no re-litigation.**

**Evidence.**
- I grepped all six retro lanes for `Typed-OM`, `SpanParser`, `codegen`. The only hits are in `retro-prompt-recap.md`, and every one **records the kill as terminal/ADDRESSED** (P2: "Typed-OM KILL"; P1: "codegen spine RETRACTED (owner 2026-06-22)"). No lane proposes resurrecting any of them. The recap explicitly lists them under "ADDRESSED" — the correct disposition for an owner-ratified kill.
- **keyframes-vue:** the lanes do the *opposite* of re-litigating — they ratify the R.W0 KILL and demand only that the FINAL *record* it so the P-inv-28 belt doesn't silently revert to "open." That is bookkeeping, not re-opening.
- **The one place to scrutinize — retro-api-in §1A's "re-expose CSSKeyframesAnimation / a renamed Animation."** This could *look* like re-litigating the 5.0.0 `Animation`-name drop (a settled no-legacy call). But the lane is careful: §4 explicitly says "**Do NOT re-expose `Animation`** … re-introducing a global-shadowing alias would be the legacy/fallback the R precepts forbid," and the §1A proposal is for a **package subpath export** (`@mkbabb/keyframes.js/engine`) of `CSSKeyframesAnimation` — a *static-import* affordance, NOT the killed `Animation` alias. So it respects the settled kill and proposes a structurally different fix. Not re-litigation.
- The engine.ts decomposition proposal is NOT a settled kill being re-opened — the override's OWN text records the full split as "named future work" (`proof-decomposition.mjs:214-220`), i.e. it was *deferred*, never *killed*. Re-opening a self-recorded deferral is precisely P-inv-28-compliant.

**Critique:** one sub-proposal in `retro-q-changes.md §2` ("either KEEP the split but REWORK it … OR fold it back") and `retro-plan-waves.md §2's adversarial re-test of the 'cohesive gestalt' dismissal" come close to re-opening the G2 "do NOT reflexively split" gated decision. But G2 was a decision to *not split for line-count alone* — it was never a decision that engine.ts at 1420L is *acceptable*. The lanes correctly attack the **gate that weaponized G2 into a shield** (the override allowlist), not G2 itself. This is the fair reading: G2 said "don't split reflexively"; the override turned that into "never split, ever, with a prose essay" — and R is right to challenge the latter, not the former.

**Correction:** none. No settled ARCH kill is being re-litigated. R should make the §1A "static-import home" proposal *explicitly* contingent on subpath exports (never an `Animation` alias) so the no-legacy kill stays honored in the impl phase.

---

## SECONDARY CHALLENGE — over-engineering / KISS in the PROPOSALS themselves

The charter is adversarial both ways: are the *proposals* over-engineered?

- **`retro-plan-waves §3` proposal to harden `proof:decomposition` with "(1) cap the NUMBER of overrides as a monotonically-shrinking budget, (2) red any cap RAISED vs prior tranche without a paired behavioral gate, (3) a decomposition-progress assertion that total over-base LOC trends DOWN."** **Verdict: OVER-ENGINEERED.** This builds a meta-gate-governance-machine (tranche-over-tranche cap-diffing, a paired-gate registry, a monotonic-LOC-budget) to police a gate. The KISS fix is exactly what `retro-q-changes §1` proposes: **DELETE the override allowlist, set one hard ceiling (550 .ts), let every oversized file RED.** Those reds ARE the backlog. A line-cap that needs a second meta-gate to keep it honest is the contrivance the precepts forbid. R should adopt the simple deletion, not the budget machinery.
- **`retro-api-in §5` tiered-barrel re-export proposal:** sound and KISS-aligned (re-export from `physics/`/`orchestration/`/`engine/` dirs once they exist) — it depends on the decomposition, doesn't add a new mechanism.
- **`retro-readme-docs` restore-list:** correct and minimal (restore load-bearing CI files from `git show HEAD:…`, accept the junk deletions). No over-engineering.

---

## DISPOSITION (what R should carry from these lanes)

1. **ADOPT** the prompt-recap's per-request table and "zero dropped" verdict (verified). Count atomic sub-asks on re-issue.
2. **ADOPT** the deferred-ledger's 10-item fold list as binding; label Group-4 "UNVERIFIED — re-run required."
3. **ADOPT** the Q-overclaim findings (all reproduced). **RECONCILE** the one inter-lane inconsistency: the gate DOES exit 1 (plan-waves is right; retro-q-changes' "green by construction" is half-wrong — it greens on the named files, REDs on resolve-values).
4. **ADOPT** the simple decomposition fix (DELETE the override allowlist → one hard ceiling). **REJECT** the over-engineered budget-meta-gate.
5. **SOFTEN** the `animate()` charge from "effusive dynamicism" to the evidenced "dead-by-disuse (0/32)."
6. **CONFIRM** no settled ARCH kill is re-litigated; make the §1A static-import proposal explicitly subpath-only (never re-add the killed `Animation` alias).

**Bottom line:** these are high-integrity audit lanes. The gates they cite as RED are RED when run. The credit they give Q is specific and fair. The corrections are calibration — one inter-lane exit-code inconsistency, one severity-label overreach (`animate()`), one over-engineered gate-hardening proposal — none of which reverse a single FOLD-TO-R recommendation.
