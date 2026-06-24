# Tranche R Audit — Lane `retro-plan-waves`

**Scope:** Did Tranche Q (kf 5.0.0, closed `186acec` / tag `v5.0.0`) deliver what it CLAIMED?
Concretely test the Q plan + wave claims against the actual tree.

**Method:** Read `docs/tranches/Q/{FINAL.md,Q.md,PROGRESS.md,IMPL-RUN-BOARD.md,waves/*}`, the
`proof:decomposition` / `proof:engine` gate sources, and the live tree. Verified line counts via `wc -l`,
git history via `git log/show`, gate status via `node scripts/proof-decomposition.mjs`. All facts re-checked
against the Q close commit `186acec` to distinguish "Q lied" from "R-branch drift."

---

## VERDICT

Q delivered a **real but partial** engine extraction, then **overclaimed it as a "decomposition close" and
declared `proof:decomposition` FULLY GREEN — a claim that was FALSE at the very commit FINAL.md describes.**
The headline structural goal (engine.ts 1397→~900) was MISSED by ~470 lines; the gate that would have caught
it was never authored; the override the spec mandated REMOVED was instead RAISED. The flat-sibling `engine-*.ts`
pattern was extended rather than cured into a real sub-module directory.

---

## FINDING 1 (CRITICAL) — FINAL.md's "decomposition close / proof:decomposition FULLY GREEN" is FALSE

**Claim.** `docs/tranches/Q/FINAL.md:34`:
> the engine.ts split → `engine-playback.ts` + **the decomposition close** (every Q-grown library file cured —
> `proof:decomposition` FULLY GREEN).

**Reality, at Q's OWN close commit `186acec` (tag v5.0.0):**
- `git show 186acec:src/animation/resolve-values.ts | wc -l` → **796L**
- The `proof:decomposition` override cap for `resolve-values.ts` is **600** (`scripts/proof-decomposition.mjs:307`),
  whose rationale text reads *"the cap sitting just above 578L so further unjustified growth reds"*.
- 796 > 600 → the `[ceiling]` clause (`proof-decomposition.mjs:451-467`) RED. The gate exits 1.

Running it on the current `tranche-r-dev` tree (resolve-values.ts unchanged at 796/797L) confirms verbatim:
```
proof:decomposition — FAIL (D.W1 — the demo is not yet decomposed):
  ✗ [ceiling] src/animation/resolve-values.ts: 797L exceeds the 600L library ceiling for .ts
EXIT: 1
```

`proof:decomposition` was **NOT** "FULLY GREEN" at Q close. resolve-values.ts grew 578→796 (+218L) under a
+50 cap and blew through it. FINAL.md asserts a green gate over a red tree.

**Proposal.** R must either (a) genuinely decompose resolve-values.ts (the Phase-1/Phase-2 emerging-CSS rewriter)
at its concern seam, or (b) if it is a true cohesive god-module, re-justify the cap HONESTLY — but FINAL.md's
blanket "every Q-grown library file cured / FULLY GREEN" must be RETRACTED as a recorded falsehood. A "close"
doc that claims a green gate over a red tree is exactly the deceptive-ledger pattern Q was chartered to end.

---

## FINDING 2 (CRITICAL) — engine.ts 1397→~900 MISSED by ~470L; the mandated gate was never authored; the override was RAISED not removed

**Claim.** The structural spine of Band F:
- `Q.md:57` (Q.WF1): "engine.ts 1397→~900"
- `IMPL-RUN-BOARD.md:36`: "engine.ts 1397→~900 → engine-playback.ts"
- `Q.WZ.md:215`: "engine.ts 1397→~900 split ... `proof:decomposition` GREEN (**the cap:1400 override REMOVED**)"
- `Q.WF1.md` Scope S1: author a NEW gate `proof:engine-seam-split` asserting **`engine.ts ≤ 950L`**, and
  S3: *"remove the engine.ts `LIBRARY_CEILING_OVERRIDE` entry ... OR re-write to a measured post-split cap"*
  with S1 clause-(c) "below 1000."

**Reality.**
- `wc -l src/animation/engine.ts` → **1420L** (at `186acec` AND now). The file did not shrink to ~900 — it is
  20L LARGER than the "1397→~900" baseline. engine.ts is the single largest file in `src/animation/`.
- The mandated gate **`proof:engine-seam-split` DOES NOT EXIST**: no `scripts/proof-engine-seam-split.mjs`, no
  `engine-seam-split` entry in `package.json`. The keystone born-RED gate (`engine.ts ≤ 950L`) that S1 made the
  acceptance oracle was never written. There is no gate anywhere asserting engine.ts ≤ 950 or ≤ 1000.
- The override was **RAISED, not removed.** `scripts/proof-decomposition.mjs:130-132`:
  ```
  "src/animation/engine.ts",
  { cap: 1450,   // was 1400 pre-Q; Q.WZ.md:215 said this entry would be REMOVED
  ```
  The commit that did this is literally `b246872 impl(Q.WF1 Band F): engine.ts split → engine-playback.ts +
  the decomposition close` — the same commit that raised the cap 1400→1450 also branded itself "the
  decomposition close." The override rationale (`:152,162`) admits the file is **1421L** and says *"The cap
  sits just above the measured 1421L post-split floor."*

So: spec said ≤950 with a removed/sub-1000 cap; delivery was 1420L with the cap raised to 1450. The gate greens
because the cap was moved to the file, not the file moved under the cap.

**What WAS genuinely done (partial credit):** the playback machine extraction is REAL, not a paper move.
`src/animation/engine-playback.ts` is 484L of real host-passing functions (`play`/`pause`/`resume`/`toggle`/
`stop`/`settle`/`reset`/`playFrame`/`renderFrame`/`playRAF`/`playViaWAAPI`/`playReducedMotion`/etc.) over a
`PlaybackHost<V>` protocol (`engine-playback.ts:50`), statically imported by `engine.ts:84`. The
`KeyframesAnimation` class body DID drop to ~1059L (`engine.ts:115-1173`), under `proof:engine`'s
`ANIMATION_CLASS_CEILING=1100` (`proof-engine.mjs:66`). So the *class body* shrank; the *file* did not, because
the extracted 484L module plus the CSSKeyframesAnimation subclass (`engine.ts:1175-1402`) keep the file at 1420L.

**The overclaim is the gap between "class body under 1100" (true) and "engine.ts 1397→~900 / decomposition
close / override removed" (false).** The doc trumpets the file-level + gate-level claim, delivered only the
class-body claim.

**Proposal.** R should treat the engine-seam split as INCOMPLETE, not closed. Either (a) finish it — author the
mandated `proof:engine-seam-split` gate, and actually split engine.ts below 1000 (the CSSKeyframesAnimation
subclass at :1175-1402 is a natural second extraction the override rationale dismisses as "the legacy-shape the
Mandate forbids" — that dismissal deserves adversarial re-test), or (b) record HONESTLY that the file-level
target was abandoned and only the class-body extraction shipped, and strike the "1397→~900" / "decomposition
close" language from FINAL/WZ. The cap:1450 entry must not stand as a green proxy for an unmet structural goal.

---

## FINDING 3 (HIGH) — `proof:decomposition` is a rationale-override gate that cannot catch "grew the file, raised the cap"

The gate is structurally GAMEABLE for the exact failure mode Q committed. `scripts/proof-decomposition.mjs`:
- Base ceiling `.ts` = 550L (`:119`).
- `LIBRARY_CEILING_OVERRIDE` (`:128-368`) holds **9** named library files with caps 580 → **1450**:
  engine.ts 1450, group.ts 925, animations.ts 900, sequence.ts 700, spring.ts 700, waapi.ts 650, frame-compiler.ts 640,
  resolve-values.ts 600, load-engine.ts 580.
- The effective ceiling logic (`:453-454`): `ceiling = override ? override.cap : base`. **Any file can be raised
  to any cap with a prose rationale.** There is no upper bound on an override cap, no budget on the number of
  overrides, and no clause asserting the SUM/COUNT of overrides is shrinking tranche-over-tranche.
- The ONLY self-pruning is the **stale-override guard** (`:486-489`): it reds an override only if the file drops
  BACK UNDER its 550 base — i.e. it punishes SHRINKING, never GROWING. A file that grows from 578→1421 and gets
  its cap bumped 600→1450 passes clean; the guard never fires.

This is the rationale-override escape hatch. The gate measures "is there a prose justification for this size,"
not "is this file decomposed." Seven of the nine overrides carry the literal disclaimer *"split-for-line-count is
the legacy-shape the Mandate forbids"* — a rhetorical move that converts EVERY oversized file into a
"cohesive god-module" exemption by assertion. The contrivance gate Q built to police perf claims
(`proof:wave-charter`) only inspects PERF-claiming waves' decision-JSON baselineCase identifiers
(`proof-wave-charter.mjs:35,66`); it does NOT inspect decomposition line-count claims, so nothing gated the
"1397→~900" overclaim.

**Proposal.** R should harden `proof:decomposition` so it cannot be gamed by cap-raising:
(1) cap the NUMBER of overrides (a budget that must monotonically shrink, or at minimum not grow);
(2) red any override whose cap was RAISED vs. the prior tranche without a corresponding `proof:*` behavioral
gate proving a real extraction landed (i.e. tie each override to a named extraction module that must exist);
(3) add a "decomposition-progress" assertion: total library LOC over base ceiling must trend DOWN, not up.
Absent this, "proof:decomposition GREEN" is a statement about prose, not architecture.

---

## FINDING 4 (HIGH) — The flat-sibling `engine-*.ts` / `group-*.ts` pattern was EXTENDED, not cured into real sub-modules

Q's Band F branded itself the "architectural transposition." What it actually produced is more FLAT hyphenated
siblings in the already-flat `src/animation/` directory, exactly the superficial-decomposition smell the R
charter flags. Q grew these flat siblings:
- `engine-playback.ts` (484L), joining `engine-composition.ts` (221L), `engine-options.ts` (193L),
  `engine-css-metadata.ts` (148L) — four `engine-*.ts` flat siblings, no `engine/` directory.
- `group-soa.ts` (254L), `group-layer-springs.ts` (236L) — `group-*.ts` siblings, no `group/` directory.
- `frame-compiler-numeric.ts`, `waapi-densify.ts` (287L), `spring-duration.ts`, `spring-reseat.ts` — more
  `<base>-<suffix>.ts` flat siblings.

`src/animation/` is still a flat tree of 55 `.ts` files; the ONLY sub-directory is `src/animation/internal/`.
The override rationales (`proof-decomposition.mjs:143,289`) explicitly frame these as "the fourth `engine-*.ts`"
and "the third SoA-style extraction" — the pattern is being PROLIFERATED by design, not consolidated. This is the
"prefer real DIRECTORY sub-modules, NOT flat hyphenated sibling files" precept inverted.

**Proposal.** R should plan the real directory transposition Q dodged: `src/animation/engine/` housing
`engine.ts` (or `index.ts`), `playback.ts`, `composition.ts`, `options.ts`, `css-metadata.ts`; `src/animation/group/`
housing `group.ts`, `soa.ts`, `layer-springs.ts`; `src/animation/spring/` housing the `spring-*.ts` trio. The
co-located-internal-module pattern is sound; its FLAT-sibling realization is the contrivance. This also creates
the natural seam to actually split engine.ts below 1000 (the CSSKeyframesAnimation subclass → `engine/css.ts`).

---

## FINDING 5 (MEDIUM) — The "no-deferral terminal tranche" framing is contradicted by Q's own override prose

Q's masthead (`Q.md:8`, `FINAL.md:42`) is "**NO deferrals in Q** ... every chronic discharged with a gate that
BIT." Yet `proof-decomposition.mjs:214-220` (the group.ts override Q itself wrote) records a fresh deferral
inside the close:
> BORN-RED HANDOFF (P-invariant-28): the FULL compositor-seam split (... the pre-P.W2 820L target) remains the
> named future work — it separates only once Q.WF1 re-threads the engine's composite contract ... Named here so
> the deferral is citable.

So Band F's group.ts work explicitly DEFERS the full split to "future work" — in the no-deferral terminal
tranche. And because Q.WF1's engine re-thread did NOT reach its ≤950 target (Finding 2), the precondition this
HANDOFF names ("once Q.WF1 re-threads the engine's composite contract") was not actually satisfied either. The
P-invariant-28 ledger Q claims to have "TERMINATED" (`FINAL.md:4,39`) is carrying at least this one fresh
born-RED handoff plus the unmet engine target.

**Proposal.** R should not trust "P-inv-28 ledger TERMINATED." Re-audit the ledger against the override prose:
the group.ts 820L full-split and the engine.ts ≤950 split are both live, named, deferred structural debts that Q
papered as "discharged." List them in R as the genuine carry.

---

## What Q GENUINELY achieved (give credit honestly)

- **Real playback extraction.** `engine-playback.ts` (484L) is a legitimate host-passing module over a
  `PlaybackHost` protocol; the class body dropped ~1297→1059L under the 1100 ceiling. This is not a stub.
- **Real SoA/density extractions.** `group-soa.ts`, `frame-compiler-numeric.ts`, `waapi-densify.ts` are
  substantive pure-helper modules with anchored behavioral gates (proof:soa-composite, proof:waapi-adaptive-densify).
- **DM-2 DemoControlPoint exists** — `demo/@/components/custom/DemoControlPoint.vue` is present (the 9th-carry
  chronic did get a real component, not vapor; this lane did not verify its runtime behavior).
- **DM-3 fromMorphSVG exists** — `src/animation/morph-svg.ts` (452L) with a real `fromMorphSVG` export.
- **The 5.0.0 cut shipped** — merged to master, tagged, published per FINAL.

## What Q PAPERED OVER

| Claim | Doc | Reality | Severity |
|---|---|---|---|
| `proof:decomposition` FULLY GREEN | FINAL.md:34 | RED at `186acec` (resolve-values 796>600) | CRITICAL |
| engine.ts 1397→~900 | Q.md:57, RUN-BOARD:36, WZ:215 | 1420L (grew) | CRITICAL |
| the cap:1400 override REMOVED | Q.WZ.md:215 | RAISED to 1450 | CRITICAL |
| `proof:engine-seam-split` gate (≤950L) authored born-RED | Q.WF1.md S1 | never written | CRITICAL |
| "decomposition close — every Q-grown file cured" | FINAL.md:34 | 9 files still over base; resolve-values RED | HIGH |
| no-deferral terminal / P-inv-28 TERMINATED | Q.md:8, FINAL.md:4 | group.ts full-split deferred in override prose | MEDIUM |

---

## Files cited
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/Q/FINAL.md` (:4,:34,:39,:42)
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/Q/Q.md` (:8,:57)
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/Q/waves/Q.WF1.md` (Scope S1/S3; born-RED gate)
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/Q/waves/Q.WZ.md` (:215)
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/Q/IMPL-RUN-BOARD.md` (:36,:77-79)
- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-decomposition.mjs` (:119,:128-368,:453-489)
- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-engine.mjs` (:66,:101-104)
- `/Users/mkbabb/Programming/keyframes.js/scripts/proof-wave-charter.mjs` (:35,:66)
- `/Users/mkbabb/Programming/keyframes.js/src/animation/engine.ts` (1420L; class :115-1173; subclass :1175-1402)
- `/Users/mkbabb/Programming/keyframes.js/src/animation/engine-playback.ts` (484L; :50 PlaybackHost)
- `/Users/mkbabb/Programming/keyframes.js/src/animation/resolve-values.ts` (796L)
- git: `b246872` (the "decomposition close" commit that raised cap 1400→1450), `186acec` (Q master close, tag v5.0.0)
